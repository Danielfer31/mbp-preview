# Plan De Fase 1 - Sitio Publico MVP

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox
> syntax for tracking.

**Goal:** construir un sitio Astro estatico, accesible y verificable que permita revision
local con placeholders seguros y rechace produccion mientras falten datos bloqueantes.

**Architecture:** contenido estructurado separado de componentes; Astro genera HTML
estatico sin servidor ni almacenamiento. Un validador distingue `preview` de `production`:
preview representa placeholders de forma segura y production falla si queda alguno
bloqueante.

**Tech Stack:** Astro estatico, TypeScript estricto, Vitest, Playwright, axe-core,
Lighthouse CI y Cloudflare Pages sin Functions.

---

### Task 1: Resolver Dependencias Y Crear Fundacion

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `astro.config.ts`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `tests/unit/smoke.test.ts`

- [ ] Seleccionar versiones compatibles que produzcan `npm audit --audit-level=high`
  sin hallazgos altos.
- [ ] Configurar salida estatica y TypeScript estricto.
- [ ] Escribir prueba de humo que compruebe la existencia de la pagina principal.
- [ ] Ejecutar `npm test`, `npm run build` y auditoria.
- [ ] Bloquear la tarea si no existe combinacion sin hallazgos altos.

**Resultado:** proyecto base reproducible y sin hallazgos altos.

### Task 2: Implementar Contrato De Contenido Y Placeholders

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/site/profile.json`
- Create: `src/content/site/services.json`
- Create: `src/content/site/contact.json`
- Create: `src/lib/placeholders.ts`
- Create: `scripts/validate-content.mjs`
- Create: `tests/unit/placeholders.test.ts`

- [ ] Modelar cada dato con `value`, `status`, `source` y `blocksProduction`.
- [ ] Incorporar los identificadores de `.planning/content/PLACEHOLDER-REGISTER.md`.
- [ ] Hacer que preview acepte placeholders y production falle con la lista exacta.
- [ ] Probar que los CTA sin destino real quedan deshabilitados.
- [ ] Probar que ninguna credencial pendiente aparece como verificada.

**Resultado:** contenido incompleto representado de forma segura y producción protegida.

### Task 3: Construir Sistema Visual Y Layout

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/PlaceholderNotice.astro`
- Test: `tests/e2e/layout.spec.ts`

- [ ] Implementar la direccion `Calido Familiar` con contraste WCAG AA.
- [ ] Usar fuentes del sistema inicialmente para evitar dependencia externa.
- [ ] Implementar skip link, foco visible, landmarks y movimiento reducido.
- [ ] Usar composicion grafica temporal sin fotografias personales.
- [ ] Probar navegacion por teclado y responsive.

**Resultado:** base visual profesional, accesible y ligera.

### Task 4: Construir Paginas Y Secciones Publicas

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/perfil.astro`
- Create: `src/pages/servicios.astro`
- Create: `src/pages/contacto.astro`
- Create: `src/pages/privacidad.astro`
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/SafeContactCard.astro`
- Test: `tests/e2e/public-pages.spec.ts`

- [ ] Publicar solo nombre, especialidad, experiencia y servicios confirmados.
- [ ] Mostrar nombres de servicios sin descripciones medicas no aprobadas.
- [ ] Mostrar contacto pendiente sin enlaces ficticios.
- [ ] Incluir advertencia de no enviar informacion clinica.
- [ ] Probar todas las rutas, encabezados y estados de placeholder.

**Resultado:** experiencia completa revisable sin datos inventados.

### Task 5: Implementar SEO Y Seguridad Estatica

**Files:**
- Create: `src/components/SeoHead.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `src/pages/sitemap.xml.ts`
- Create: `public/_headers`
- Create: `tests/unit/seo.test.ts`
- Test: `tests/e2e/privacy.spec.ts`

- [ ] Generar metadatos sin usar direccion, telefono o dominio ficticios.
- [ ] Omitir schema medico que dependa de credenciales pendientes.
- [ ] Configurar encabezados CSP, Referrer-Policy, Permissions-Policy y nosniff.
- [ ] Verificar ausencia de formularios, cookies, almacenamiento y scripts de analitica.
- [ ] Probar robots, sitemap y encabezados.

**Resultado:** sitio rastreable y seguro sin afirmar datos pendientes.

### Task 6: Configurar Calidad Automatizada

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `lighthouserc.json`
- Create: `.github/workflows/site.yml`
- Modify: `package.json`

- [ ] Configurar scripts `validate`, `test`, `test:e2e`, `build:preview`,
  `build:production`, `audit` y `verify`.
- [ ] Ejecutar unitarias, E2E, axe y Lighthouse en CI.
- [ ] Verificar que `build:preview` pase con placeholders.
- [ ] Verificar que `build:production` falle mientras existan placeholders bloqueantes.
- [ ] Guardar informes como evidencia, sin datos personales.

**Resultado:** cada cambio se valida automáticamente.

### Task 7: Revision Visual Y Funcional

**Files:**
- Create: `.planning/phases/01-public-mvp/01-REVIEW.md`
- Modify: `.planning/phases/01-public-mvp/01-VERIFICATION.md`

- [ ] Abrir el preview local en navegador.
- [ ] Revisar escritorio, movil, teclado, foco y movimiento reducido.
- [ ] Confirmar que placeholders son comprensibles y no parecen datos reales.
- [ ] Registrar defectos, corregirlos y repetir verificaciones.
- [ ] Marcar evidencia tecnica completada.

**Resultado:** preview aprobado para revision humana.

### Task 8: Sustitucion De Datos Y Puerta De Produccion

**Files:**
- Modify: `src/content/site/profile.json`
- Modify: `src/content/site/services.json`
- Modify: `src/content/site/contact.json`
- Modify: `.planning/content/CONTENT-INVENTORY.md`
- Modify: `.planning/content/PLACEHOLDER-REGISTER.md`
- Modify: `.planning/phases/01-public-mvp/01-VERIFICATION.md`

- [ ] Reemplazar cada placeholder bloqueante solo con informacion aprobada.
- [ ] Adjuntar evidencia de credenciales y autorizaciones.
- [ ] Registrar responsables, revision juridica y aprobacion de produccion.
- [ ] Ejecutar `npm run verify` y `npm run build:production`.
- [ ] No desplegar si queda un placeholder bloqueante o hallazgo alto.

**Resultado:** artefacto de produccion autorizado y reconstruible.

