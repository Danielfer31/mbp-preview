#!/usr/bin/env node
/**
 * scripts/validate-content.mjs
 *
 * Validador de contenido estructurado para el sitio de la Doctora.
 * Modo preview: tolerante a placeholders bloqueantes (exit 0).
 * Modo production: intolerante — falla si cualquier bloqueante no tiene aprobacion valida.
 *
 * Uso:
 *   node scripts/validate-content.mjs preview
 *   node scripts/validate-content.mjs production
 *
 * Variables de entorno (para tests):
 *   CONTENT_DIR   — directorio raiz de src/content (default: src/content)
 *   MANIFEST_PATH — ruta al APPROVAL-MANIFEST.json
 *                   (default: .planning/content/APPROVAL-MANIFEST.json)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// ─── Configuracion ────────────────────────────────────────────────────────────

const mode = process.argv[2] || 'preview';
if (mode !== 'preview' && mode !== 'production') {
  console.error(`[validate-content] Modo invalido: "${mode}". Use "preview" o "production".`);
  process.exit(1);
}

const CONTENT_DIR = process.env.CONTENT_DIR
  ? resolve(process.env.CONTENT_DIR)
  : join(PROJECT_ROOT, 'src/content');

const MANIFEST_PATH = process.env.MANIFEST_PATH
  ? resolve(process.env.MANIFEST_PATH)
  : join(PROJECT_ROOT, '.planning/content/APPROVAL-MANIFEST.json');

// ─── IDs canonicos registrados ────────────────────────────────────────────────
// Extraidos de PLACEHOLDER-REGISTER.md y CONTENT-INVENTORY.md.
// Un ID en contenido que no este en esta lista es desconocido => error estructural.

const KNOWN_PLACEHOLDER_IDS = new Set([
  'PH-PROFESSIONAL-TITLE',
  'PH-PROFESSIONAL-REGISTRY',
  'PH-PUBLIC-NAME',
  'PH-SERVICE-DESCRIPTIONS',
  'PH-SPECIAL-PROGRAM-NAMES',
  'PH-AGE-RANGE',
  'PH-CARE-MODALITY',
  'PH-CITY',
  'PH-ADDRESS',
  'PH-PUBLIC-HOURS',
  'PH-PHONE',
  'PH-EMAIL',
  'PH-WHATSAPP',
  'PH-ALTERNATE-CHANNEL',
  'PH-BRAND-NAME',
  'PH-LOGO',
  'PH-PHOTOS',
  'PH-FAQ',
  'PH-ARTICLES',
  'PH-CLINICAL-MESSAGE-PROCEDURE',
  'PH-EMERGENCY-PROCEDURE',
  'PH-PRIVACY-OWNER',
  'PH-OPERATIONS-OWNER',
  'PH-PRODUCTION-APPROVER',
  'PH-LEGAL-REVIEW',
  'PH-DOMAIN',
  'PH-ANNUAL-BUDGET',
]);

const KNOWN_CONTENT_IDS = new Set([
  'CNT-I01', 'CNT-I02', 'CNT-I03', 'CNT-I04', 'CNT-I05', 'CNT-I06',
  'CNT-M01', 'CNT-M02', 'CNT-M03', 'CNT-M04', 'CNT-M05', 'CNT-M06',
  'CNT-C01', 'CNT-C02', 'CNT-C03', 'CNT-C04', 'CNT-C05', 'CNT-C06', 'CNT-C07',
  'CNT-S01', 'CNT-S02', 'CNT-S03', 'CNT-S04', 'CNT-S05', 'CNT-S06',
  'CNT-S07', 'CNT-S08', 'CNT-S09', 'CNT-S10',
  'CNT-O01', 'CNT-O02', 'CNT-O03', 'CNT-O04', 'CNT-O05', 'CNT-O06',
  'CNT-O07', 'CNT-O08',
  'CNT-V01', 'CNT-V02', 'CNT-V03', 'CNT-V04', 'CNT-V05',
  'CNT-X01', 'CNT-X02', 'CNT-X03', 'CNT-X04', 'CNT-X05', 'CNT-X06',
]);

const KNOWN_IDS = new Set([...KNOWN_PLACEHOLDER_IDS, ...KNOWN_CONTENT_IDS]);

// IDs de contacto: sus values pueden ser URLs y deben validarse de esquema
const CONTACT_IDS = new Set([
  'PH-PHONE', 'PH-EMAIL', 'PH-WHATSAPP', 'PH-ALTERNATE-CHANNEL',
]);

// IDs bloqueantes de produccion (copiados de src/lib/placeholders.ts para evitar dependencia TS)
const BLOCKING_PLACEHOLDER_IDS = new Set([
  'PH-PROFESSIONAL-TITLE',
  'PH-PROFESSIONAL-REGISTRY',
  'PH-SERVICE-DESCRIPTIONS',
  'PH-SPECIAL-PROGRAM-NAMES',
  'PH-AGE-RANGE',
  'PH-CARE-MODALITY',
  'PH-CITY',
  'PH-ADDRESS',
  'PH-PUBLIC-HOURS',
  'PH-PHONE',
  'PH-EMAIL',
  'PH-WHATSAPP',
  'PH-ALTERNATE-CHANNEL',
  'PH-CLINICAL-MESSAGE-PROCEDURE',
  'PH-EMERGENCY-PROCEDURE',
  'PH-PRIVACY-OWNER',
  'PH-OPERATIONS-OWNER',
  'PH-PRODUCTION-APPROVER',
  'PH-LEGAL-REVIEW',
  'PH-DOMAIN',
  'PH-ANNUAL-BUDGET',
]);

// Valores de placeholder que indican "CTA deshabilitado" / datos no disponibles
// Estos valores son intencionales y no se consideran URLs malformadas
const PLACEHOLDER_SENTINEL_VALUES = new Set([
  'cta deshabilitado',
  'informacion disponible proximamente',
  'horario pendiente de confirmacion',
  'credencial pendiente de verificacion',
  'mostrar solo nombres confirmados',
  'programas pediatricos especiales',
  'texto preventivo sin gestion clinica',
  'dirigir a servicios de emergencia locales sin triage',
  'barranquilla, pendiente de confirmacion final',
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeHash(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function isBlank(s) {
  return typeof s !== 'string' || /^\s*$/.test(s);
}

/** Valida esquema de URL en contacto. Retorna string de error o null. */
function validateContactUrl(id, value) {
  if (value === null) return null;
  if (isBlank(value)) return null; // blanks caught separately

  const normalized = value.trim().toLowerCase();

  // Los valores placeholder conocidos no son URLs
  if (PLACEHOLDER_SENTINEL_VALUES.has(normalized)) return null;

  // Detectar patrones de esquema peligrosos primero (sin necesidad de parsear URL)
  if (normalized.startsWith('javascript:')) {
    return `${id}: URL usa esquema peligroso "javascript:"`;
  }
  if (normalized.startsWith('data:')) {
    return `${id}: URL usa esquema peligroso "data:"`;
  }
  if (normalized.startsWith('file:')) {
    return `${id}: URL usa esquema peligroso "file:"`;
  }

  // Si parece una URL (tiene protocolo o es tel:/mailto:), validar esquema permitido
  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(value.trim());
  if (hasProtocol) {
    try {
      const url = new URL(value.trim());
      const allowedSchemes = ['https:', 'tel:', 'mailto:'];
      const isWhatsApp = url.href.startsWith('https://wa.me');
      if (!allowedSchemes.includes(url.protocol) && !isWhatsApp) {
        return `${id}: esquema URL no permitido "${url.protocol}" (solo https, tel, mailto, wa.me)`;
      }
    } catch {
      return `${id}: URL malformada: "${value}"`;
    }
  }

  return null;
}

// ─── Lectura de manifest ──────────────────────────────────────────────────────

let manifest = [];
try {
  const raw = readFileSync(MANIFEST_PATH, 'utf8');
  manifest = JSON.parse(raw);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`[validate-content] MANIFEST_PATH no encontrado: ${MANIFEST_PATH}`);
  } else {
    console.error(`[validate-content] Error leyendo manifiesto: ${err.message}`);
  }
  process.exit(1);
}

// ─── Lectura de archivos de contenido ────────────────────────────────────────

const SITE_DIR = join(CONTENT_DIR, 'site');
let jsonFiles = [];

try {
  jsonFiles = readdirSync(SITE_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => join(SITE_DIR, f));
} catch (err) {
  // Si no hay archivos de contenido, sale con 0 (nada que validar en preview)
  if (err.code === 'ENOENT') {
    if (mode === 'production') {
      console.error('[validate-content] Produccion bloqueada: no se encontro el directorio de contenido');
      process.exit(1);
    }
    process.exit(0);
  }
  throw err;
}

// ─── Validacion estructural ───────────────────────────────────────────────────

const errors = [];
const allEntries = []; // { file, entry }
const seenIds = new Map(); // id => file

for (const filePath of jsonFiles) {
  const fileName = filePath.split('/').pop() || filePath.split('\\').pop();
  let entries;

  // 1. Parseo defensivo
  try {
    const raw = readFileSync(filePath, 'utf8');
    entries = JSON.parse(raw);
  } catch (err) {
    errors.push(`${fileName}: JSON invalido — ${err.message}`);
    continue;
  }

  if (!Array.isArray(entries)) {
    errors.push(`${fileName}: se esperaba un array JSON`);
    continue;
  }

  // Determinar si es archivo de contacto para validacion de URL
  const isContactFile = fileName === 'contact.json';

  for (const entry of entries) {
    const id = entry.id;

    // 2. ID desconocido
    if (!KNOWN_IDS.has(id)) {
      errors.push(`${fileName}: ID desconocido "${id}"`);
    }

    // 3. ID duplicado
    if (seenIds.has(id)) {
      errors.push(`${fileName}: ID duplicado "${id}" (ya visto en ${seenIds.get(id)})`);
    } else {
      seenIds.set(id, fileName);
    }

    // 4. Valor solo-espacios
    if (entry.value !== null && isBlank(entry.value)) {
      errors.push(`${fileName}: el campo "${id}" tiene valor solo-espacios`);
    }

    // 5. Validacion de URL para campos de contacto
    if (isContactFile || CONTACT_IDS.has(id)) {
      if (entry.value !== null && !isBlank(entry.value)) {
        const urlError = validateContactUrl(id, entry.value);
        if (urlError) {
          errors.push(`${fileName}: ${urlError}`);
        }
      }
    }

    allEntries.push({ file: fileName, entry });
  }
}

// ─── Modo production: reconciliacion de hash ──────────────────────────────────

const blockingIds = [];

if (mode === 'production') {
  // Construir mapa de manifest por contentId
  const manifestMap = new Map();
  for (const mEntry of manifest) {
    manifestMap.set(mEntry.contentId, mEntry);
  }

  // Verificar cada ID bloqueante
  for (const blockingId of BLOCKING_PLACEHOLDER_IDS) {
    const mEntry = manifestMap.get(blockingId);
    if (!mEntry) {
      blockingIds.push(blockingId);
      continue;
    }

    // Verificar status
    if (mEntry.status === 'revoked') {
      blockingIds.push(blockingId);
      errors.push(`${blockingId}: aprobacion revocada en el manifiesto`);
      continue;
    }

    // Verificar campos de evidencia
    if (isBlank(mEntry.approvedBy) || isBlank(mEntry.approvedAt) || isBlank(mEntry.evidenceRef)) {
      blockingIds.push(blockingId);
      errors.push(`${blockingId}: entrada de manifiesto sin approvedBy/approvedAt/evidenceRef`);
      continue;
    }

    // Reconciliar hash: buscar el valor actual en el contenido
    const contentEntry = allEntries.find((e) => e.entry.id === blockingId);
    if (!contentEntry) {
      // El ID bloqueante no tiene archivo de contenido: bloqueante
      blockingIds.push(blockingId);
      continue;
    }

    const currentValue = contentEntry.entry.value;
    if (currentValue === null) {
      blockingIds.push(blockingId);
      errors.push(`${blockingId}: valor es null, no puede ser aprobado`);
      continue;
    }

    const currentHash = computeHash(currentValue);
    if (currentHash !== mEntry.contentHash) {
      blockingIds.push(blockingId);
      errors.push(
        `${blockingId}: hash del contenido no coincide con el manifiesto (contenido cambiado tras aprobar)`,
      );
      continue;
    }
  }
}

// ─── Salida ───────────────────────────────────────────────────────────────────

if (errors.length > 0) {
  for (const err of errors) {
    console.error(`[validate-content] Error: ${err}`);
  }
}

if (mode === 'production' && blockingIds.length > 0) {
  console.error(
    `[validate-content] Produccion bloqueada: ${blockingIds.length} placeholder(s) sin resolver: ${blockingIds.join(', ')}`,
  );
  process.exit(1);
}

if (errors.length > 0) {
  process.exit(1);
}

console.log(`[validate-content] OK modo ${mode}: validacion completada sin errores.`);
process.exit(0);
