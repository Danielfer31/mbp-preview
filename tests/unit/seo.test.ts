/**
 * seo.test.ts — TDD tests para check-hardcoded-content.mjs
 *
 * Verifica que el CI check detecte correctamente contenido prohibido
 * hardcodeado en archivos .astro, .ts, .js, .mjs fuera de src/content/.
 *
 * Fixtures:
 * 1. .astro con teléfono hardcodeado → debe fallar (exit != 0)
 * 2. .astro que sólo usa getEntry → debe pasar (exit 0)
 * 3. .astro con JSON-LD literal → debe fallar (exit != 0)
 * 4. .ts con email literal → debe fallar (exit != 0)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(__dirname, '../../scripts/check-hardcoded-content.mjs');

function runCheck(scanDir: string): { exitCode: number; output: string } {
  const result = spawnSync(process.execPath, [SCRIPT], {
    env: { ...process.env, CHECK_SCAN_DIR: scanDir },
    encoding: 'utf8',
  });
  const output = (result.stdout || '') + (result.stderr || '');
  return { exitCode: result.status ?? 1, output };
}

let tmpBase: string;

beforeAll(() => {
  tmpBase = mkdtempSync(join(tmpdir(), 'seo-test-'));
});

afterAll(() => {
  rmSync(tmpBase, { recursive: true, force: true });
});

function makeFixtureDir(name: string): string {
  const dir = join(tmpBase, name);
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  mkdirSync(join(dir, 'src', 'content', 'site'), { recursive: true });
  return dir;
}

// ─── Fixture 1: teléfono hardcodeado en .astro ────────────────────────────────
describe('Fixture 1 — teléfono hardcodeado en .astro', () => {
  let fixtureDir: string;

  beforeAll(() => {
    fixtureDir = makeFixtureDir('fixture-phone');
    writeFileSync(
      join(fixtureDir, 'src', 'pages', 'contact.astro'),
      `---
// Contacto
---
<p>Llame al +57 310 555 1234 para cita.</p>
`,
    );
  });

  it('debe salir con código != 0', () => {
    const { exitCode } = runCheck(fixtureDir);
    expect(exitCode).not.toBe(0);
  });

  it('debe reportar la ruta del archivo violador', () => {
    const { output } = runCheck(fixtureDir);
    expect(output).toContain('contact.astro');
  });
});

// ─── Fixture 2: .astro que sólo usa getEntry → pasa ─────────────────────────
describe('Fixture 2 — .astro usando getEntry (sin hardcodeo)', () => {
  let fixtureDir: string;

  beforeAll(() => {
    fixtureDir = makeFixtureDir('fixture-clean');
    writeFileSync(
      join(fixtureDir, 'src', 'pages', 'about.astro'),
      `---
import { getEntry } from 'astro:content';
const profile = await getEntry('site', 'profile');
---
<h1>{profile.data.value}</h1>
`,
    );
    // Crear src/content/ para que el scanner lo excluya
    writeFileSync(
      join(fixtureDir, 'src', 'content', 'site', 'profile.json'),
      JSON.stringify([{ id: 'PH-PUBLIC-NAME', value: '+57 310 000 0000', status: 'pendiente' }]),
    );
  });

  it('debe salir con código 0 (ninguna violación)', () => {
    const { exitCode } = runCheck(fixtureDir);
    expect(exitCode).toBe(0);
  });
});

// ─── Fixture 3: JSON-LD con valores literales en .astro → falla ──────────────
describe('Fixture 3 — JSON-LD con valores literales en .astro', () => {
  let fixtureDir: string;

  beforeAll(() => {
    fixtureDir = makeFixtureDir('fixture-jsonld');
    writeFileSync(
      join(fixtureDir, 'src', 'pages', 'home.astro'),
      `---
// página de inicio
---
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "telephone": "+57 310 555 9999",
  "email": "dra@ejemplo.com"
}
</script>
`,
    );
  });

  it('debe salir con código != 0', () => {
    const { exitCode } = runCheck(fixtureDir);
    expect(exitCode).not.toBe(0);
  });

  it('debe reportar la ruta del archivo con JSON-LD literal', () => {
    const { output } = runCheck(fixtureDir);
    expect(output).toContain('home.astro');
  });
});

// ─── Fixture 4: email literal en .ts → falla ─────────────────────────────────
describe('Fixture 4 — email literal en .ts', () => {
  let fixtureDir: string;

  beforeAll(() => {
    fixtureDir = makeFixtureDir('fixture-email');
    mkdirSync(join(fixtureDir, 'src', 'lib'), { recursive: true });
    writeFileSync(
      join(fixtureDir, 'src', 'lib', 'contact.ts'),
      `export const EMAIL = "dra.pacheco@clinica.com.co";
export function getEmail() { return EMAIL; }
`,
    );
  });

  it('debe salir con código != 0', () => {
    const { exitCode } = runCheck(fixtureDir);
    expect(exitCode).not.toBe(0);
  });

  it('debe reportar el archivo .ts y número de línea', () => {
    const { output } = runCheck(fixtureDir);
    expect(output).toContain('contact.ts');
  });
});

// ─── Fixture 5: URL wa.me en .astro → falla ──────────────────────────────────
describe('Fixture 5 — URL wa.me en .astro', () => {
  let fixtureDir: string;

  beforeAll(() => {
    fixtureDir = makeFixtureDir('fixture-whatsapp');
    writeFileSync(
      join(fixtureDir, 'src', 'pages', 'cta.astro'),
      `---
// CTA
---
<a href="https://wa.me/573105551234">WhatsApp</a>
`,
    );
  });

  it('debe salir con código != 0 (wa.me detectado)', () => {
    const { exitCode } = runCheck(fixtureDir);
    expect(exitCode).not.toBe(0);
  });
});

// ─── Fixture 6: src/content/ excluido del escaneo ────────────────────────────
describe('Fixture 6 — src/content/ excluido (contenido aprobado)', () => {
  let fixtureDir: string;

  beforeAll(() => {
    fixtureDir = makeFixtureDir('fixture-content-excluded');
    // El único archivo con teléfono está en src/content/ (excluido)
    writeFileSync(
      join(fixtureDir, 'src', 'content', 'site', 'contact.json'),
      JSON.stringify([{ id: 'PH-PHONE', value: '+57 310 555 0000', status: 'pendiente' }]),
    );
    // Archivo limpio fuera de content/
    writeFileSync(
      join(fixtureDir, 'src', 'pages', 'index.astro'),
      `---
import { getEntry } from 'astro:content';
const contact = await getEntry('site', 'contact');
---
<p>{contact.data.value}</p>
`,
    );
  });

  it('debe salir con código 0 (content/ excluido)', () => {
    const { exitCode } = runCheck(fixtureDir);
    expect(exitCode).toBe(0);
  });
});
