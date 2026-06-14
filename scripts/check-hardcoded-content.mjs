#!/usr/bin/env node
/**
 * check-hardcoded-content.mjs
 *
 * CI check que detecta contenido prohibido hardcodeado en archivos de código
 * fuente (.astro, .ts, .js, .mjs) y archivos públicos (.html, .js, .json)
 * fuera de src/content/ (donde vive el contenido aprobado).
 *
 * Uso:
 *   node scripts/check-hardcoded-content.mjs
 *
 * Variables de entorno:
 *   CHECK_SCAN_DIR  — raíz del proyecto a escanear (default: cwd)
 *
 * Sale con código 0 si no hay violaciones.
 * Sale con código 1 si hay violaciones (lista archivo+línea por cada una).
 *
 * Cierra concern HIGH H2: previene que afirmaciones médicas, datos de
 * contacto, metadata o schema se incrusten directamente en archivos .astro
 * evadiendo el sistema de contenido/validador.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

// ─── Configuración ────────────────────────────────────────────────────────────

const PROJECT_ROOT = process.env.CHECK_SCAN_DIR ?? process.cwd();

/**
 * Directorios excluidos del escaneo.
 * src/content/ contiene el contenido aprobado — es la fuente de verdad.
 * node_modules/ y .git/ son artefactos externos.
 */
const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.astro',
]);

/**
 * Rutas relativas excluidas (prefijo).
 * src/content/ alberga datos JSON estructurados aprobados por la doctora.
 */
const EXCLUDED_PATH_PREFIXES = [
  'src/content/',
  'src\\content\\',
];

/** Extensiones de archivos a escanear en src/ */
const SRC_EXTENSIONS = new Set(['.astro', '.ts', '.js', '.mjs']);

/** Extensiones de archivos a escanear en public/ */
const PUBLIC_EXTENSIONS = new Set(['.html', '.js', '.json']);

// ─── Patrones de contenido prohibido ─────────────────────────────────────────

/**
 * Patrones de datos de contacto prohibidos.
 *
 * Teléfonos colombianos:
 *   - Formato nacional: 310 555 1234 / 3105551234
 *   - Formato E.164: +57 310 555 1234 / +573105551234
 *   - Con guiones: 310-555-1234
 *
 * El check EXCLUYE referencias legítimas como:
 *   - getCollection('contact') / getEntry('site', 'contact')
 *   - Astro.props.phone
 *   - import ... from 'astro:content'
 */
const FORBIDDEN_PATTERNS = [
  // ── Teléfonos colombianos y E.164 ──
  {
    id: 'PHONE_COL',
    description: 'Teléfono colombiano o E.164 hardcodeado',
    // +57 o código de área 3xx con 7-10 dígitos
    regex: /(?<![a-zA-Z0-9_\-/])\+?57[\s.-]?[3][0-9]{2}[\s.-]?[0-9]{3,4}[\s.-]?[0-9]{3,4}(?![a-zA-Z0-9])/,
  },
  {
    id: 'PHONE_MOBILE_COL',
    description: 'Número de celular colombiano (3xx) hardcodeado',
    // Números que empiezan con 3 seguidos de 9 dígitos (sin prefijo +57)
    // Excluir dentro de URLs de contenido (getEntry, etc.)
    regex: /(?<![a-zA-Z0-9_/.'":])3[0-9]{2}[\s.-][0-9]{3}[\s.-][0-9]{4}(?![a-zA-Z0-9])/,
  },
  // ── Emails literales ──
  {
    id: 'EMAIL_LITERAL',
    description: 'Dirección de email hardcodeada',
    // email@dominio.tld — excluir en comentarios de código /* */ y //
    // pero capturar en strings, JSX, HTML
    regex: /["'`\s]([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})["'`\s<>]/,
  },
  // ── URLs de WhatsApp / wa.me ──
  {
    id: 'WHATSAPP_URL',
    description: 'URL wa.me o whatsapp.com hardcodeada',
    regex: /https?:\/\/(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\/[0-9]/,
  },
  // ── Direcciones postales literales ──
  {
    id: 'POSTAL_ADDRESS',
    description: 'Dirección postal literal (Calle/Carrera/Av + número)',
    // Calle 10 # 5-23 / Carrera 7 No. 45-12 / Av. 68 # 13-45
    regex: /(?:Calle|Carrera|Cra|Cll|Avenida|Av\.|Transversal|Tr\.|Diagonal|Dg\.)\s+\d+/i,
  },
  // ── Afirmaciones médicas/credenciales ──
  {
    id: 'YEARS_EXPERIENCE',
    description: 'Afirmación de años de experiencia hardcodeada',
    // "15 años de experiencia" / "más de 10 años"
    regex: /\b\d+\s+a[ñn]os?\s+de\s+experiencia\b/i,
  },
  {
    id: 'PROFESSIONAL_REGISTRY',
    description: 'Número de registro profesional hardcodeado',
    // "Registro: 12345" / "RM 54321" / "RETHUS 123456"
    regex: /(?:registro\s+(?:m[eé]dico|profesional|RETHUS)|R\.?M\.?|RETHUS)\s*[:\-]?\s*\d{4,}/i,
  },
  // ── JSON-LD con valores literales ──
  {
    id: 'JSONLD_LITERAL',
    description: 'Bloque JSON-LD (application/ld+json) con datos literales de contacto',
    // script type application/ld+json que contenga telephone, email, address con valores
    regex: /application\/ld\+json/,
    // Este patrón requiere verificación de bloque completo (ver lógica especial abajo)
    requiresBlockCheck: true,
  },
];

/**
 * Patrones que son PERMITIDOS — excluyen falsos positivos.
 * Si una línea coincide con un patrón prohibido pero también con uno de estos,
 * NO se reporta como violación.
 */
const ALLOWED_PATTERNS = [
  // Referencias a getCollection / getEntry desde astro:content
  /getCollection\s*\(/,
  /getEntry\s*\(/,
  // Props de Astro
  /Astro\.props/,
  /\bprops\./,
  // Imports desde content/
  /from\s+['"].*\/content\//,
  /from\s+['"]astro:content['"]/,
  // Variables interpoladas (${...})
  /\$\{[^}]+\}/,
  // Comentarios de documentación (líneas que solo son comentario)
  /^\s*(?:\/\/|\/\*|\*|#)/,
];

// ─── Utilidades ───────────────────────────────────────────────────────────────

/**
 * Devuelve true si la ruta relativa está excluida del escaneo.
 */
function isExcluded(relPath) {
  for (const prefix of EXCLUDED_PATH_PREFIXES) {
    if (relPath.startsWith(prefix)) return true;
  }
  return false;
}

/**
 * Recorre un directorio recursivamente y devuelve los archivos
 * con las extensiones especificadas.
 */
function collectFiles(dir, extensions, results = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;

    const fullPath = join(dir, entry.name);
    const relPath = relative(PROJECT_ROOT, fullPath).replace(/\\/g, '/');

    if (isExcluded(relPath)) continue;

    if (entry.isDirectory()) {
      collectFiles(fullPath, extensions, results);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (extensions.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/**
 * Comprueba si una línea es una línea de comentario pura.
 */
function isPureComment(line) {
  const trimmed = line.trim();
  return (
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('<!--')
  );
}

/**
 * Comprueba si algún patrón allowed cubre esta línea.
 */
function isAllowed(line) {
  return ALLOWED_PATTERNS.some((p) => p.test(line));
}

/**
 * Verifica si un bloque JSON-LD contiene datos literales de contacto
 * (telephone, email, address con valor hardcodeado).
 */
function jsonLdHasLiteralContactData(content) {
  // Buscar bloques <script type="application/ld+json">...</script>
  const blockRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[1];
    // Si el bloque contiene campos de contacto con valores literales (no interpolados)
    if (
      /"telephone"\s*:\s*"[^{][^"]*"/.test(block) ||
      /"email"\s*:\s*"[^{][^"]*"/.test(block) ||
      /"streetAddress"\s*:\s*"[^{][^"]*"/.test(block) ||
      /"addressLocality"\s*:\s*"[^{][^"]*"/.test(block)
    ) {
      return true;
    }
  }
  return false;
}

// ─── Escaneo principal ────────────────────────────────────────────────────────

const violations = [];

/**
 * Escanea un único archivo buscando patrones prohibidos.
 */
function scanFile(filePath) {
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    return; // No se puede leer — skip
  }

  const relPath = relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
  const lines = content.split('\n');

  // ── Verificación de bloque JSON-LD ──
  if (jsonLdHasLiteralContactData(content)) {
    violations.push({
      file: relPath,
      line: findJsonLdLine(lines),
      rule: 'JSONLD_LITERAL',
      description: 'Bloque JSON-LD con datos de contacto literales',
    });
    // No añadir más violaciones por las líneas individuales que también coincidan
  }

  // ── Verificación línea a línea ──
  lines.forEach((line, idx) => {
    // Saltar líneas de puro comentario para la mayoría de reglas
    if (isPureComment(line)) return;

    for (const pattern of FORBIDDEN_PATTERNS) {
      // JSONLD se verifica por bloque arriba, no por línea
      if (pattern.requiresBlockCheck) continue;

      if (!pattern.regex.test(line)) continue;

      // ¿La línea está cubierta por un patrón permitido?
      if (isAllowed(line)) continue;

      violations.push({
        file: relPath,
        line: idx + 1,
        rule: pattern.id,
        description: pattern.description,
        context: line.trim().slice(0, 120),
      });
    }
  });
}

/**
 * Encuentra el número de línea donde empieza el primer bloque JSON-LD.
 */
function findJsonLdLine(lines) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('application/ld+json')) return i + 1;
  }
  return 1;
}

// ─── Recopilar archivos ───────────────────────────────────────────────────────

const srcDir = join(PROJECT_ROOT, 'src');
const publicDir = join(PROJECT_ROOT, 'public');

const srcFiles = collectFiles(srcDir, SRC_EXTENSIONS);

// public/ sólo si existe
let publicFiles = [];
try {
  statSync(publicDir);
  publicFiles = collectFiles(publicDir, PUBLIC_EXTENSIONS);
} catch {
  // public/ no existe — ok
}

const allFiles = [...srcFiles, ...publicFiles];

for (const file of allFiles) {
  scanFile(file);
}

// ─── Reporte ─────────────────────────────────────────────────────────────────

if (violations.length === 0) {
  console.log('check-hardcoded-content: OK — no se encontraron violaciones.');
  process.exit(0);
}

console.error(`\ncheck-hardcoded-content: FALLO — ${violations.length} violacion(es) encontrada(s):\n`);

for (const v of violations) {
  const lineInfo = `${v.file}:${v.line}`;
  console.error(`  [${v.rule}] ${lineInfo}`);
  console.error(`    ${v.description}`);
  if (v.context) {
    console.error(`    > ${v.context}`);
  }
  console.error('');
}

console.error(
  'Solucion: mover datos de contacto/medicos a src/content/ y referenciarlos via getEntry/getCollection.',
);

process.exit(1);
