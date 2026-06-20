# Manual Ejecutivo Del Sitio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repeatable local pipeline that captures preview screenshots, composes a high-quality executive HTML manual, exports it to PDF, and verifies the PDF artifact exists with the expected sections.

**Architecture:** The manual is generated as static HTML/CSS from structured content in `docs/manual-ejecutivo/`, then exported by Playwright/Chromium to `output/pdf/manual-ejecutivo-sitio.pdf`. Screenshots are captured from `preview-fullscreen.html` using Playwright, with a configurable source path so the workflow can use the copy in Downloads or the repository copy.

**Tech Stack:** Node.js >=24, npm >=10, Playwright already installed via `@playwright/test`, plain ESM scripts, HTML/CSS, no new paid or hosted tools.

## Global Constraints

- The manual must mark the site status as "Preview en revision".
- No pending medical content can be presented as approved.
- Placeholders must remain visible in screenshots and be marked as pending when discussed.
- The manual must not suggest diagnosis, triage, medical recommendations, or clinical automation.
- Contact must be explained as safe human administrative contact.
- Final PDF output path: `output/pdf/manual-ejecutivo-sitio.pdf`.
- Intermediate screenshot path: `docs/manual-ejecutivo/assets/screenshots/`.
- Intermediate HTML path: `docs/manual-ejecutivo/build/manual.html`.
- Use Playwright/Chromium as the primary PDF export path.
- Do not add paid services, external SaaS, or new hosted tooling.

---

## File Structure

- Create `docs/manual-ejecutivo/content/manual-data.mjs`: structured page data, annotations, section copy, and expected screenshot filenames.
- Create `docs/manual-ejecutivo/styles/manual.css`: print-oriented horizontal layout, palette, page grid, annotation styling, screenshot treatment, and page breaks.
- Create `scripts/capture-manual-screenshots.mjs`: opens the preview HTML and captures desktop/mobile screenshots for the manual.
- Create `scripts/build-executive-manual.mjs`: renders `manual-data.mjs` into `docs/manual-ejecutivo/build/manual.html`.
- Create `scripts/export-executive-manual.mjs`: opens the generated HTML and exports the final PDF with Playwright.
- Create `scripts/verify-executive-manual.mjs`: checks required screenshots, HTML sections, PDF existence, and minimum PDF size.
- Modify `package.json`: add `manual:screenshots`, `manual:html`, `manual:pdf`, `manual:verify`, and `manual:build` scripts.
- Test via existing npm scripts and the new manual pipeline.

---

### Task 1: Structured Manual Content

**Files:**
- Create: `docs/manual-ejecutivo/content/manual-data.mjs`
- Create: `docs/manual-ejecutivo/assets/screenshots/.gitkeep`

**Interfaces:**
- Produces: `manual` object exported from `manual-data.mjs`.
- Consumes: none.

- [ ] **Step 1: Create the screenshots folder marker**

```powershell
New-Item -ItemType Directory -Force 'docs/manual-ejecutivo/assets/screenshots' | Out-Null
New-Item -ItemType File -Force 'docs/manual-ejecutivo/assets/screenshots/.gitkeep' | Out-Null
```

- [ ] **Step 2: Create `manual-data.mjs`**

```js
export const manual = {
  meta: {
    title: 'Manual ejecutivo del sitio web',
    subtitle: 'Doctora Maria Bernarlda Pacheco Martelo',
    version: 'Preview en revision',
    date: '2026-06-20',
    audience: 'Equipo de diseno y marketing',
    outputName: 'manual-ejecutivo-sitio.pdf',
  },
  principles: [
    {
      label: 'Confianza profesional',
      copy: 'El sitio debe presentar experiencia, criterio y cercania sin convertir la pagina en una consulta medica.',
    },
    {
      label: 'Calidez visual',
      copy: 'La paleta suave, el aire entre bloques y las formas organicas sostienen una lectura tranquila y humana.',
    },
    {
      label: 'Contacto humano',
      copy: 'Los canales orientan hacia informacion administrativa y preservan limites claros sobre datos clinicos.',
    },
  ],
  journey: [
    { label: 'Inicio', copy: 'Primer impacto, confianza y rutas principales.' },
    { label: 'Servicios', copy: 'Catalogo orientador sin promesas medicas.' },
    { label: 'Perfil', copy: 'Autoridad profesional, enfoque y cercania.' },
    { label: 'Contacto', copy: 'Canales administrativos y privacidad.' },
    { label: 'Avisos', copy: 'Limites, seguridad y mensajes preventivos.' },
  ],
  pages: [
    {
      id: 'inicio',
      title: 'Inicio: confianza desde el primer vistazo',
      screenshot: 'inicio-desktop.png',
      summary: 'La pagina de inicio concentra la identidad, el tono y los accesos principales.',
      shows: 'Hero de marca, llamado a conocer servicios, resumen de confianza, perfil y contacto seguro.',
      communicates: 'Una pediatria profesional, cercana y ordenada, con rutas claras para seguir explorando.',
      rationale: 'El inicio funciona como mapa emocional y funcional: presenta valor, reduce incertidumbre y abre caminos hacia servicios, perfil y contacto.',
      care: 'No convertir el hero en una promesa medica. Mantener el estado de preview cuando haya datos pendientes.',
      notes: [
        { n: '01', tag: 'Jerarquia', text: 'El primer bloque debe explicar quien es la doctora y por que la experiencia transmite confianza.' },
        { n: '02', tag: 'Accion', text: 'Los CTA deben llevar a exploracion o contacto seguro, no a una agenda no aprobada.' },
        { n: '03', tag: 'Continuidad', text: 'Servicios, perfil y contacto aparecen como resumen para orientar al visitante.' },
      ],
    },
    {
      id: 'servicios',
      title: 'Servicios: orientar sin diagnosticar',
      screenshot: 'servicios-desktop.png',
      mobileScreenshot: 'servicios-mobile.png',
      summary: 'La pagina de servicios organiza areas de atencion pediatrica de forma comprensible.',
      shows: 'Encabezado, tarjetas de servicios, detalle informativo y aviso de contacto responsable.',
      communicates: 'Claridad sobre los temas que atiende la doctora sin resolver casos clinicos en linea.',
      rationale: 'Las tarjetas ayudan a escanear opciones y permiten ampliar informacion sin saturar la pagina.',
      care: 'Todo alcance medico y descripcion de servicio requiere aprobacion medica antes de produccion.',
      notes: [
        { n: '01', tag: 'Contenido', text: 'Los nombres de servicios deben mantenerse trazables a contenido aprobado o pendiente.' },
        { n: '02', tag: 'Interaccion', text: 'El detalle de servicio debe ser informativo y conducir a contacto administrativo.' },
        { n: '03', tag: 'Mobile', text: 'En movil se prioriza lectura por tarjetas y progresion vertical.' },
      ],
    },
    {
      id: 'detalle-servicio',
      title: 'Detalle de servicio: profundidad controlada',
      screenshot: 'detalle-servicio-desktop.png',
      summary: 'El detalle permite explicar un servicio sin romper los limites clinicos del sitio.',
      shows: 'Titulo del servicio, icono, introduccion, bloques informativos y aviso administrativo.',
      communicates: 'Informacion suficiente para entender el area, con recordatorio de aprobacion y contacto humano.',
      rationale: 'Separar el detalle evita sobrecargar las tarjetas y mejora la comprension por tema.',
      care: 'No incluir recomendaciones personalizadas, sintomas interpretados ni rutas de triage.',
      notes: [
        { n: '01', tag: 'Estado', text: 'El rotulo de borrador protege contenido pendiente de aprobacion.' },
        { n: '02', tag: 'Privacidad', text: 'El aviso recuerda que el contacto no debe recibir informacion clinica.' },
      ],
    },
    {
      id: 'perfil',
      title: 'Perfil: autoridad con cercania',
      screenshot: 'perfil-desktop.png',
      mobileScreenshot: 'perfil-mobile.png',
      summary: 'La pagina de perfil construye credibilidad profesional sin perder tono humano.',
      shows: 'Stories de experiencia, encabezado profesional, credenciales, principios y enfoque.',
      communicates: 'Formacion, experiencia regional, acompanamiento y actualizacion continua.',
      rationale: 'La mezcla de credenciales y narrativa ayuda a que el equipo comunique autoridad sin frialdad.',
      care: 'Credenciales, registros y afirmaciones de experiencia deben tener evidencia antes de produccion.',
      notes: [
        { n: '01', tag: 'Confianza', text: 'Las credenciales deben ser verificables y consistentes en todo el sitio.' },
        { n: '02', tag: 'Narrativa', text: 'Los principios traducen la practica medica a lenguaje entendible para familias.' },
        { n: '03', tag: 'Responsive', text: 'En movil las tarjetas se apilan para preservar lectura y jerarquia.' },
      ],
    },
    {
      id: 'contacto',
      title: 'Contacto: canales seguros y humanos',
      screenshot: 'contacto-desktop.png',
      mobileScreenshot: 'contacto-mobile.png',
      summary: 'La pagina de contacto orienta al visitante sin capturar datos clinicos.',
      shows: 'Canales administrativos, aviso de privacidad, sedes, horarios, mapa y preguntas.',
      communicates: 'Disponibilidad administrativa con limites claros sobre urgencias e informacion clinica.',
      rationale: 'El contacto se disena como puente humano, no como sistema de atencion automatizada.',
      care: 'No activar telefono, WhatsApp, correo, sede u horario sin datos confirmados y aprobados.',
      notes: [
        { n: '01', tag: 'Privacidad', text: 'El aviso clinico debe permanecer visible junto a decisiones de contacto.' },
        { n: '02', tag: 'Operacion', text: 'Los canales dependen de datos reales y responsables humanos.' },
        { n: '03', tag: 'Mapa', text: 'El mapa debe seguir estatico hasta confirmar direccion y proveedor.' },
      ],
    },
    {
      id: 'avisos',
      title: 'Avisos: limites que protegen',
      screenshot: 'avisos-desktop.png',
      summary: 'Los avisos explican reglas de seguridad, privacidad y uso correcto del sitio.',
      shows: 'Lista de mensajes importantes sobre contacto, privacidad, urgencias y contenido informativo.',
      communicates: 'El sitio informa y orienta, pero no reemplaza consulta ni servicios de urgencia.',
      rationale: 'Centralizar avisos ayuda a que marketing y contenido no diluyan mensajes sensibles.',
      care: 'Los avisos clinicos y legales requieren revision humana antes de produccion.',
      notes: [
        { n: '01', tag: 'Seguridad', text: 'La pagina evita expectativas incorrectas sobre respuesta clinica.' },
        { n: '02', tag: 'Legal', text: 'Los textos deben conservar precision y no suavizarse en exceso.' },
      ],
    },
  ],
  teamGuide: [
    {
      label: 'Puede ajustar diseno/marketing',
      items: ['Orden visual de capturas del manual', 'Titulos explicativos del manual', 'Recortes de screenshots', 'Etiquetas de anotacion no clinicas'],
    },
    {
      label: 'Requiere aprobacion medica',
      items: ['Descripciones de servicios', 'Alcances clinicos', 'Credenciales publicas', 'Afirmaciones de experiencia'],
    },
    {
      label: 'Requiere aprobacion legal o privacidad',
      items: ['Avisos clinicos', 'Procedimiento de urgencias', 'Politica de privacidad', 'Uso de canales externos'],
    },
    {
      label: 'Requiere revision tecnica',
      items: ['Activacion de CTAs', 'Cambio de rutas', 'Mapa o proveedor externo', 'Scripts o analitica'],
    },
  ],
};
```

- [ ] **Step 3: Verify the data file imports**

Run:

```powershell
node -e "import('./docs/manual-ejecutivo/content/manual-data.mjs').then(({manual}) => { if (manual.pages.length < 6) throw new Error('manual pages missing'); console.log(manual.meta.title); })"
```

Expected: prints `Manual ejecutivo del sitio web`.

- [ ] **Step 4: Commit**

```powershell
git add 'docs/manual-ejecutivo/content/manual-data.mjs' 'docs/manual-ejecutivo/assets/screenshots/.gitkeep'
git commit -m 'docs: add executive manual content model'
```

---

### Task 2: Screenshot Capture Script

**Files:**
- Create: `scripts/capture-manual-screenshots.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `docs/manual-ejecutivo/content/manual-data.mjs`.
- Produces: PNG files in `docs/manual-ejecutivo/assets/screenshots/`.

- [ ] **Step 1: Add the capture script**

```js
import { chromium, devices } from '@playwright/test';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const defaultPreviewPaths = [
  process.env.MANUAL_PREVIEW_HTML,
  path.join(process.env.USERPROFILE || '', 'Downloads', 'preview-fullscreen.html'),
  path.join(repoRoot, 'preview-fullscreen.html'),
].filter(Boolean);

const outputDir = path.join(repoRoot, 'docs', 'manual-ejecutivo', 'assets', 'screenshots');

async function firstExisting(paths) {
  for (const candidate of paths) {
    try {
      await stat(candidate);
      return candidate;
    } catch {
      // Keep looking.
    }
  }
  throw new Error(`No preview HTML found. Tried: ${paths.join(', ')}`);
}

async function openPreview(page, previewFile) {
  await page.goto(pathToFileURL(previewFile).href, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    const splash = document.querySelector('#splash');
    if (splash) splash.remove();
  });
}

async function goTo(page, pageId) {
  await page.evaluate((target) => {
    if (typeof window.goTo === 'function') {
      window.goTo(target);
      return;
    }
    document.querySelectorAll('.page').forEach((node) => node.classList.remove('active'));
    const next = document.querySelector(`#page-${target}`);
    if (next) next.classList.add('active');
  }, pageId);
  await page.waitForTimeout(450);
}

async function captureActivePage(page, filename) {
  const active = page.locator('main.page.active').first();
  await active.screenshot({
    path: path.join(outputDir, filename),
    animations: 'disabled',
  });
}

async function capture(page, previewFile, target, filename, viewport) {
  await page.setViewportSize(viewport);
  await openPreview(page, previewFile);
  await goTo(page, target);
  await captureActivePage(page, filename);
}

async function captureServiceDetail(page, previewFile) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openPreview(page, previewFile);
  await goTo(page, 'servicios');
  const firstService = page.locator('#page-servicios article[data-service]').first();
  await firstService.click();
  await page.waitForTimeout(600);
  await captureActivePage(page, 'detalle-servicio-desktop.png');
}

async function main() {
  const previewFile = await firstExisting(defaultPreviewPaths);
  await mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  const desktop = { width: 1440, height: 1000 };
  const mobile = devices['Pixel 5'].viewport;

  await capture(page, previewFile, 'inicio', 'inicio-desktop.png', desktop);
  await capture(page, previewFile, 'servicios', 'servicios-desktop.png', desktop);
  await capture(page, previewFile, 'servicios', 'servicios-mobile.png', mobile);
  await captureServiceDetail(page, previewFile);
  await capture(page, previewFile, 'perfil', 'perfil-desktop.png', desktop);
  await capture(page, previewFile, 'perfil', 'perfil-mobile.png', mobile);
  await capture(page, previewFile, 'contacto', 'contacto-desktop.png', desktop);
  await capture(page, previewFile, 'contacto', 'contacto-mobile.png', mobile);
  await capture(page, previewFile, 'avisos', 'avisos-desktop.png', desktop);

  await browser.close();
  console.log(`[manual] screenshots written to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

- [ ] **Step 2: Add the npm script**

Modify `package.json` scripts:

```json
"manual:screenshots": "node scripts/capture-manual-screenshots.mjs"
```

- [ ] **Step 3: Run screenshot capture**

Run:

```powershell
npm run manual:screenshots
```

Expected: PNG files are created in `docs/manual-ejecutivo/assets/screenshots/`.

- [ ] **Step 4: Verify screenshots exist**

Run:

```powershell
node -e "$p='docs/manual-ejecutivo/assets/screenshots'; $names=['inicio-desktop.png','servicios-desktop.png','servicios-mobile.png','detalle-servicio-desktop.png','perfil-desktop.png','perfil-mobile.png','contacto-desktop.png','contacto-mobile.png','avisos-desktop.png']; const fs=require('fs'); for (const n of $names) { const f=$p+'/'+n; if (!fs.existsSync(f) || fs.statSync(f).size < 10000) throw new Error('missing or small screenshot: '+f); } console.log('screenshots ok')"
```

Expected: prints `screenshots ok`.

- [ ] **Step 5: Commit**

```powershell
git add 'scripts/capture-manual-screenshots.mjs' 'package.json' 'docs/manual-ejecutivo/assets/screenshots'
git commit -m 'docs: capture screenshots for executive manual'
```

---

### Task 3: Manual HTML And CSS Generator

**Files:**
- Create: `docs/manual-ejecutivo/styles/manual.css`
- Create: `scripts/build-executive-manual.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `manual` from `docs/manual-ejecutivo/content/manual-data.mjs`.
- Consumes: screenshots from `docs/manual-ejecutivo/assets/screenshots/`.
- Produces: `docs/manual-ejecutivo/build/manual.html`.

- [ ] **Step 1: Create `manual.css`**

```css
@page {
  size: 297mm 210mm;
  margin: 0;
}

:root {
  --olive: #2D320F;
  --lavender: #DCCDFF;
  --sage: #C8CD91;
  --teal: #87AAAF;
  --cream: #F0F0E6;
  --white: #FFFFFF;
  --ink: #252817;
  --muted: #606553;
  --line: rgba(45, 50, 15, 0.18);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--cream);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}

body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.manual-page {
  width: 297mm;
  height: 210mm;
  page-break-after: always;
  break-after: page;
  position: relative;
  overflow: hidden;
  background: var(--white);
  padding: 18mm 16mm 14mm;
}

.manual-page.cover {
  background: linear-gradient(135deg, var(--cream), var(--white) 54%, rgba(220, 205, 255, 0.4));
  display: grid;
  grid-template-columns: 0.86fr 1.14fr;
  gap: 16mm;
  align-items: center;
}

.kicker {
  color: var(--teal);
  font-size: 9pt;
  font-weight: 700;
  letter-spacing: 0.18em;
  margin: 0 0 5mm;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  color: var(--olive);
  font-size: 31pt;
  line-height: 1.02;
  letter-spacing: 0;
}

h2 {
  color: var(--olive);
  font-size: 21pt;
  line-height: 1.08;
  letter-spacing: 0;
}

h3 {
  color: var(--olive);
  font-size: 11pt;
  margin-bottom: 2mm;
}

p,
li {
  font-size: 10pt;
  line-height: 1.48;
}

.lead {
  color: var(--muted);
  font-size: 12pt;
  line-height: 1.5;
  margin-top: 6mm;
}

.cover-shot {
  border: 1px solid var(--line);
  border-radius: 7mm;
  background: var(--white);
  box-shadow: 0 18px 50px rgba(45, 50, 15, 0.12);
  padding: 5mm;
}

.cover-shot img,
.screenshot-frame img,
.mobile-shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.seal-row {
  display: flex;
  gap: 3mm;
  margin-top: 10mm;
}

.seal {
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--olive);
  font-size: 8.5pt;
  padding: 2.4mm 4mm;
  background: rgba(255, 255, 255, 0.72);
}

.status-note {
  margin-top: 9mm;
  border-left: 2px solid var(--teal);
  padding-left: 4mm;
  color: var(--muted);
  font-size: 9.5pt;
}

.page-footer {
  position: absolute;
  left: 16mm;
  right: 16mm;
  bottom: 7mm;
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 7.8pt;
  border-top: 1px solid var(--line);
  padding-top: 3mm;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 5mm;
  height: 158mm;
}

.text-col {
  grid-column: span 4;
}

.visual-col {
  grid-column: span 8;
}

.screenshot-frame {
  height: 142mm;
  border: 1px solid var(--line);
  border-radius: 5mm;
  overflow: hidden;
  background: var(--cream);
}

.dual-shot {
  display: grid;
  grid-template-columns: 1fr 42mm;
  gap: 5mm;
}

.dual-shot .screenshot-frame {
  height: 142mm;
}

.mobile-shot {
  height: 142mm;
  border: 1px solid var(--line);
  border-radius: 7mm;
  overflow: hidden;
  background: var(--cream);
}

.note-list {
  display: grid;
  gap: 3mm;
  margin-top: 7mm;
}

.note-card {
  border: 1px solid var(--line);
  border-radius: 4mm;
  padding: 3.4mm;
  background: rgba(240, 240, 230, 0.55);
}

.note-card strong {
  color: var(--olive);
  display: block;
  font-size: 8.8pt;
  margin-bottom: 1.4mm;
}

.note-card span {
  color: var(--teal);
}

.summary-box {
  background: var(--olive);
  color: var(--cream);
  border-radius: 5mm;
  padding: 6mm;
  margin-top: 7mm;
}

.summary-box p {
  font-size: 10.5pt;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4mm;
  margin-top: 10mm;
}

.info-card {
  border: 1px solid var(--line);
  border-radius: 5mm;
  padding: 5mm;
  background: rgba(255, 255, 255, 0.72);
}

.info-card p {
  color: var(--muted);
  font-size: 9.5pt;
}

.journey {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3mm;
  margin-top: 14mm;
}

.journey-step {
  border-radius: 5mm;
  background: var(--cream);
  border: 1px solid var(--line);
  padding: 5mm;
  min-height: 34mm;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5mm;
  margin-top: 9mm;
}

.team-card {
  border: 1px solid var(--line);
  border-radius: 5mm;
  padding: 5mm;
  background: rgba(240, 240, 230, 0.62);
}

.team-card ul {
  margin: 3mm 0 0;
  padding-left: 5mm;
}
```

- [ ] **Step 2: Add `build-executive-manual.mjs`**

```js
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { manual } from '../docs/manual-ejecutivo/content/manual-data.mjs';

const repoRoot = process.cwd();
const buildDir = path.join(repoRoot, 'docs', 'manual-ejecutivo', 'build');
const outputFile = path.join(buildDir, 'manual.html');
const cssPath = path.relative(buildDir, path.join(repoRoot, 'docs', 'manual-ejecutivo', 'styles', 'manual.css')).replaceAll(path.sep, '/');
const screenshotBase = path.relative(buildDir, path.join(repoRoot, 'docs', 'manual-ejecutivo', 'assets', 'screenshots')).replaceAll(path.sep, '/');

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function footer(label, index) {
  return `<footer class="page-footer"><span>${esc(manual.meta.version)}</span><span>${esc(label)} · ${index}</span></footer>`;
}

function noteCards(notes) {
  return `<div class="note-list">${notes.map((note) => `
    <article class="note-card">
      <strong><span>${esc(note.n)}</span> · ${esc(note.tag)}</strong>
      <p>${esc(note.text)}</p>
    </article>`).join('')}</div>`;
}

function pageShot(page) {
  const main = `<div class="screenshot-frame"><img src="${screenshotBase}/${esc(page.screenshot)}" alt="Captura de ${esc(page.title)}"></div>`;
  if (!page.mobileScreenshot) return main;
  return `<div class="dual-shot">${main}<div class="mobile-shot"><img src="${screenshotBase}/${esc(page.mobileScreenshot)}" alt="Captura movil de ${esc(page.title)}"></div></div>`;
}

function annotatedPage(page, index) {
  return `
    <section class="manual-page">
      <p class="kicker">${esc(page.id)}</p>
      <div class="section-grid">
        <div class="text-col">
          <h2>${esc(page.title)}</h2>
          <p class="lead">${esc(page.summary)}</p>
          <div class="summary-box"><p>${esc(page.communicates)}</p></div>
          ${noteCards(page.notes)}
        </div>
        <div class="visual-col">${pageShot(page)}</div>
      </div>
      ${footer(page.id, index)}
    </section>`;
}

function detailPages(page, index) {
  const cards = [
    ['Que muestra', page.shows],
    ['Que debe comunicar', page.communicates],
    ['Por que se diseno asi', page.rationale],
    ['Que cuidar al modificarlo', page.care],
  ];
  return `
    <section class="manual-page">
      <p class="kicker">lectura de segmento</p>
      <h2>${esc(page.title)}</h2>
      <p class="lead">${esc(page.summary)}</p>
      <div class="info-grid">
        ${cards.map(([title, copy]) => `<article class="info-card"><h3>${esc(title)}</h3><p>${esc(copy)}</p></article>`).join('')}
      </div>
      ${footer(`${page.id} detalle`, index)}
    </section>`;
}

function render() {
  let pageNumber = 1;
  const coverShot = `${screenshotBase}/inicio-desktop.png`;
  const pages = [];

  pages.push(`
    <section class="manual-page cover">
      <div>
        <p class="kicker">${esc(manual.meta.audience)}</p>
        <h1>${esc(manual.meta.title)}</h1>
        <p class="lead">${esc(manual.meta.subtitle)}</p>
        <div class="seal-row">
          ${manual.principles.map((principle) => `<span class="seal">${esc(principle.label)}</span>`).join('')}
        </div>
        <p class="status-note">${esc(manual.meta.version)} · ${esc(manual.meta.date)}. Contenido y datos sujetos a aprobacion humana antes de produccion.</p>
      </div>
      <div class="cover-shot"><img src="${coverShot}" alt="Vista previa del sitio"></div>
      ${footer('portada', pageNumber++)}
    </section>`);

  pages.push(`
    <section class="manual-page">
      <p class="kicker">resumen ejecutivo</p>
      <h2>Que debe entender el equipo</h2>
      <p class="lead">El sitio debe transmitir confianza profesional, calidez y contacto administrativo responsable. Su funcion no es diagnosticar ni resolver casos clinicos en linea.</p>
      <div class="info-grid">
        ${manual.principles.map((principle) => `<article class="info-card"><h3>${esc(principle.label)}</h3><p>${esc(principle.copy)}</p></article>`).join('')}
      </div>
      <div class="journey">
        ${manual.journey.map((step) => `<article class="journey-step"><h3>${esc(step.label)}</h3><p>${esc(step.copy)}</p></article>`).join('')}
      </div>
      ${footer('resumen', pageNumber++)}
    </section>`);

  for (const page of manual.pages) {
    pages.push(annotatedPage(page, pageNumber++));
    pages.push(detailPages(page, pageNumber++));
  }

  pages.push(`
    <section class="manual-page">
      <p class="kicker">guia para el equipo</p>
      <h2>Que puede cambiarse y que requiere aprobacion</h2>
      <p class="lead">Esta guia evita que ajustes de diseno o marketing rompan decisiones medicas, legales, de privacidad o tecnicas.</p>
      <div class="team-grid">
        ${manual.teamGuide.map((group) => `
          <article class="team-card">
            <h3>${esc(group.label)}</h3>
            <ul>${group.items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
          </article>`).join('')}
      </div>
      ${footer('guia', pageNumber++)}
    </section>`);

  pages.push(`
    <section class="manual-page">
      <p class="kicker">cierre</p>
      <h2>Criterio final de consistencia</h2>
      <p class="lead">Cada cambio futuro debe preservar tres ideas: autoridad profesional verificable, lenguaje claro para familias y contacto humano protegido por limites de privacidad.</p>
      <div class="summary-box"><p>El manual es una herramienta de alineacion para diseno y marketing. No reemplaza la aprobacion medica, legal, de privacidad ni tecnica necesaria antes de produccion.</p></div>
      ${footer('cierre', pageNumber++)}
    </section>`);

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(manual.meta.title)}</title>
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>
${pages.join('\n')}
</body>
</html>`;
}

await mkdir(buildDir, { recursive: true });
await writeFile(outputFile, render(), 'utf8');
console.log(`[manual] html written to ${outputFile}`);
```

- [ ] **Step 3: Add the npm script**

Modify `package.json` scripts:

```json
"manual:html": "node scripts/build-executive-manual.mjs"
```

- [ ] **Step 4: Generate HTML**

Run:

```powershell
npm run manual:html
```

Expected: `docs/manual-ejecutivo/build/manual.html` exists.

- [ ] **Step 5: Verify HTML content**

Run:

```powershell
node -e "$f='docs/manual-ejecutivo/build/manual.html'; const s=require('fs').readFileSync($f,'utf8'); for (const text of ['Manual ejecutivo del sitio web','Inicio: confianza','Servicios: orientar','Contacto: canales seguros','Que puede cambiarse']) { if (!s.includes(text)) throw new Error('missing '+text); } console.log('manual html ok')"
```

Expected: prints `manual html ok`.

- [ ] **Step 6: Commit**

```powershell
git add 'docs/manual-ejecutivo/styles/manual.css' 'scripts/build-executive-manual.mjs' 'package.json' 'docs/manual-ejecutivo/build/manual.html'
git commit -m 'docs: generate executive manual html'
```

---

### Task 4: PDF Export Pipeline

**Files:**
- Create: `scripts/export-executive-manual.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `docs/manual-ejecutivo/build/manual.html`.
- Produces: `output/pdf/manual-ejecutivo-sitio.pdf`.

- [ ] **Step 1: Add `export-executive-manual.mjs`**

```js
import { chromium } from '@playwright/test';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const htmlFile = path.join(repoRoot, 'docs', 'manual-ejecutivo', 'build', 'manual.html');
const pdfDir = path.join(repoRoot, 'output', 'pdf');
const pdfFile = path.join(pdfDir, 'manual-ejecutivo-sitio.pdf');

await stat(htmlFile);
await mkdir(pdfDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1131 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: pdfFile,
  format: 'A4',
  landscape: true,
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();
console.log(`[manual] pdf written to ${pdfFile}`);
```

- [ ] **Step 2: Add the npm script**

Modify `package.json` scripts:

```json
"manual:pdf": "node scripts/export-executive-manual.mjs"
```

- [ ] **Step 3: Export PDF**

Run:

```powershell
npm run manual:pdf
```

Expected: `output/pdf/manual-ejecutivo-sitio.pdf` exists.

- [ ] **Step 4: Verify PDF exists and is not empty**

Run:

```powershell
node -e "$f='output/pdf/manual-ejecutivo-sitio.pdf'; const fs=require('fs'); if (!fs.existsSync($f)) throw new Error('missing pdf'); if (fs.statSync($f).size < 100000) throw new Error('pdf too small'); console.log('pdf ok')"
```

Expected: prints `pdf ok`.

- [ ] **Step 5: Commit**

```powershell
git add 'scripts/export-executive-manual.mjs' 'package.json' 'output/pdf/manual-ejecutivo-sitio.pdf'
git commit -m 'docs: export executive manual pdf'
```

---

### Task 5: Manual Verification Script

**Files:**
- Create: `scripts/verify-executive-manual.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: screenshots, generated HTML, and generated PDF.
- Produces: console verification output.

- [ ] **Step 1: Add `verify-executive-manual.mjs`**

```js
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { manual } from '../docs/manual-ejecutivo/content/manual-data.mjs';

const repoRoot = process.cwd();
const screenshotDir = path.join(repoRoot, 'docs', 'manual-ejecutivo', 'assets', 'screenshots');
const htmlFile = path.join(repoRoot, 'docs', 'manual-ejecutivo', 'build', 'manual.html');
const pdfFile = path.join(repoRoot, 'output', 'pdf', 'manual-ejecutivo-sitio.pdf');

async function requireFile(file, minSize) {
  const info = await stat(file);
  if (info.size < minSize) {
    throw new Error(`${file} is too small: ${info.size}`);
  }
}

const requiredScreenshots = new Set();
for (const page of manual.pages) {
  requiredScreenshots.add(page.screenshot);
  if (page.mobileScreenshot) requiredScreenshots.add(page.mobileScreenshot);
}

for (const filename of requiredScreenshots) {
  await requireFile(path.join(screenshotDir, filename), 10_000);
}

const html = await readFile(htmlFile, 'utf8');
for (const expected of [
  manual.meta.title,
  manual.meta.version,
  'Que debe entender el equipo',
  'Que puede cambiarse y que requiere aprobacion',
  'Criterio final de consistencia',
]) {
  if (!html.includes(expected)) {
    throw new Error(`manual html missing: ${expected}`);
  }
}

await requireFile(pdfFile, 100_000);

console.log('[manual] verification ok');
```

- [ ] **Step 2: Add verification and build scripts**

Modify `package.json` scripts:

```json
"manual:verify": "node scripts/verify-executive-manual.mjs",
"manual:build": "npm run manual:screenshots && npm run manual:html && npm run manual:pdf && npm run manual:verify"
```

- [ ] **Step 3: Run full manual pipeline**

Run:

```powershell
npm run manual:build
```

Expected: screenshots, HTML, PDF, and verification complete successfully.

- [ ] **Step 4: Commit**

```powershell
git add 'scripts/verify-executive-manual.mjs' 'package.json'
git commit -m 'docs: verify executive manual artifact'
```

---

### Task 6: Visual Quality Review

**Files:**
- Inspect: `output/pdf/manual-ejecutivo-sitio.pdf`
- Optionally modify: `docs/manual-ejecutivo/styles/manual.css`
- Optionally modify: `docs/manual-ejecutivo/content/manual-data.mjs`

**Interfaces:**
- Consumes: final PDF.
- Produces: visually reviewed PDF with any CSS/content corrections.

- [ ] **Step 1: Open the generated PDF locally**

Run:

```powershell
Start-Process 'output/pdf/manual-ejecutivo-sitio.pdf'
```

Expected: PDF opens in the system viewer.

- [ ] **Step 2: Review visual checklist**

Check every page manually:

```text
- Page has one clear main idea.
- Screenshot is not distorted.
- Text does not overlap screenshots.
- Footer is visible.
- No page has more than 5 annotations.
- Placeholders are visible and not presented as approved.
- Mobile screenshots are readable.
- Colors feel consistent with the project palette.
- The PDF reads as an executive manual, not a raw technical report.
```

- [ ] **Step 3: Fix layout if needed**

If screenshots are too large or cropped badly, adjust these values in `docs/manual-ejecutivo/styles/manual.css`:

```css
.screenshot-frame {
  height: 138mm;
}

.mobile-shot {
  height: 138mm;
}
```

If text feels too dense, reduce note text or move content from `notes` into the detail page in `docs/manual-ejecutivo/content/manual-data.mjs`.

- [ ] **Step 4: Rebuild after any visual fix**

Run:

```powershell
npm run manual:html
npm run manual:pdf
npm run manual:verify
```

Expected: all commands pass.

- [ ] **Step 5: Final commit if visual fixes were made**

```powershell
git add 'docs/manual-ejecutivo' 'output/pdf/manual-ejecutivo-sitio.pdf'
git commit -m 'docs: polish executive manual layout'
```

---

## Self-Review

Spec coverage:

- Executive, visual, client/team-friendly PDF: Tasks 1, 3, 4, and 6.
- Screenshots from preview: Task 2.
- Playwright/Chromium export: Task 4.
- No paid tools or hosted services: global constraints and architecture.
- Preview/pending approval status: Task 1 content and Task 3 rendering.
- Verification of output: Task 5 and Task 6.

Placeholder scan:

- The plan contains no incomplete placeholder markers.
- Every created script includes complete code.
- Every verification step includes exact commands and expected result.

Type and path consistency:

- `manual` export is defined in Task 1 and consumed by Tasks 3 and 5.
- Screenshot output path is consistent across Tasks 2, 3, and 5.
- Final PDF path is consistent across Tasks 4, 5, and 6.
