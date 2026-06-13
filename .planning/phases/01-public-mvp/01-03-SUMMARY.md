---
phase: 01-public-mvp
plan: "03"
subsystem: visual-system
tags: [css-tokens, layout, accessibility, wcag, playwright, astro, branding, mbp]

# Dependency graph
requires: [01-01]
provides:
  - Sistema de tokens CSS con paleta canónica MBP (6 colores del PDF de branding)
  - BaseLayout.astro accesible: lang=es, skip link, main#main-content, landmarks ARIA
  - Header.astro con nav horizontal desktop y hamburger móvil (<1KB JS inline)
  - Footer.astro con disclaimer clínico persistente (Ley 23/1981 Colombia)
  - PlaceholderNotice.astro para datos pendientes
  - Suite E2E Playwright 16 tests (layout, accesibilidad, responsive)
affects: [01-04, 01-05, 01-06, 01-07, 01-08, 01-09]

# Tech tracking
tech-stack:
  added:
    - "@playwright/test@^1.60.0 — suite E2E para tests de layout y accesibilidad"
    - "Josefin Sans (Google Fonts pesos 100/300/400) — tipografía canónica MBP"
  patterns:
    - "CSS custom properties como única fuente de verdad de design tokens"
    - "prefers-reduced-motion: no-preference como guard para todas las transiciones (sin movimiento por defecto)"
    - "tabindex=-1 en main para recibir foco programático de skip link (WCAG 2.4.1)"
    - "JS inline <1KB para toggle hamburger sin framework de cliente"
    - "Playwright webServer Astro dev: tests E2E que levantan el servidor automáticamente"

key-files:
  created:
    - "src/styles/tokens.css — 6 colores MBP, tipografía Josefin Sans, espaciado base-8, radios, breakpoints"
    - "src/styles/global.css — reset, foco visible, skip-link, transiciones en prefers-reduced-motion"
    - "src/layouts/BaseLayout.astro — lang=es, skip link, main#main-content tabindex=-1, Header y Footer integrados"
    - "src/components/Header.astro — nav accesible, hamburger 44px, toggle JS inline"
    - "src/components/Footer.astro — disclaimer clínico en aside aria-label=Aviso importante"
    - "src/components/PlaceholderNotice.astro — banner con SVG aria-hidden, role=status"
    - "tests/e2e/layout.spec.ts — 16 tests Playwright (skip link, disclaimer, hamburger, responsive)"
    - "playwright.config.ts — config E2E con webServer y proyectos chromium/mobile-chrome"
  modified:
    - "src/pages/index.astro — actualizada para usar BaseLayout con PlaceholderNotice hero"
    - "package.json — agrega @playwright/test devDep y script test:e2e"
    - "package-lock.json — lockfile actualizado con Playwright"

key-decisions:
  - "Paleta MBP del PDF de branding (MBP-BRAND-ANALYSIS.md) es fuente canónica — NO el UI-SPEC previo que usaba #C17A4A (terracota inexistente en el branding real)"
  - "Google Fonts Josefin Sans cargada vía @import en global.css — confirmada como tipografía canónica MBP"
  - "Disclaimer clínico implementado como <aside aria-label=Aviso importante> en Footer (NO role=alert — es información estática, no alerta dinámica)"
  - "tabindex=-1 en <main> para que el skip link pueda enfocar el elemento programáticamente (WCAG 2.4.1)"
  - "Selectores de tests usando role=banner y role=contentinfo para evitar colisión con Astro DevToolbar en modo dev"
  - "@playwright/test instalado como devDependency verificando paquete legítimo de Microsoft (npmjs.com/package/@playwright/test)"

# Metrics
duration: 35min
completed: 2026-06-13
---

# Phase 01 Plan 03: Sistema Visual y Layout Base Accesible — Summary

**Tokens CSS con paleta canónica MBP (#2D320F/#DCCDFF/#C8CD91/#87AAAF/#F0F0E6), BaseLayout con lang=es/skip link/landmarks, Header hamburger, Footer con disclaimer clínico persistente (Ley 23/1981) y suite E2E Playwright 16/16 verde**

## Performance

- **Duration:** 35 min
- **Started:** 2026-06-13T22:00:00Z
- **Completed:** 2026-06-13T22:35:00Z
- **Tasks:** 2/2
- **Files modified:** 10 (7 creados, 3 modificados)

## Accomplishments

- `tokens.css` con los 6 colores canónicos del PDF de branding MBP (sin #C17A4A del UI-SPEC antiguo)
- `global.css` con reset mínimo, `:focus-visible` 3px oliva, clase `.skip-link` y transiciones en `prefers-reduced-motion: no-preference`
- `BaseLayout.astro` con `lang="es"`, skip link "Ir al contenido principal", `main#main-content tabindex="-1"` y landmarks ARIA
- `Header.astro` con nav horizontal desktop, hamburger móvil (toggle JS inline <1KB), botón 44×44px WCAG SC 2.5.8
- `Footer.astro` con disclaimer clínico persistente en `<aside aria-label="Aviso importante">` — cierra T-01-09 (Ley 23/1981 Colombia)
- `PlaceholderNotice.astro` con SVG decorativo `aria-hidden="true"` y `role="status"` para datos pendientes
- Suite E2E Playwright: **16/16 tests verde** (skip link, disclaimer, hamburger, responsive, ARIA landmarks)

## Task Commits

| Task | Descripción | Commit | Tipo |
|------|-------------|--------|------|
| 1 | Tokens MBP, global.css y BaseLayout accesible | `0997932` | feat |
| 2 | Header, Footer disclaimer, PlaceholderNotice y E2E | `194e0c8` | feat |

## Files Created/Modified

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `src/styles/tokens.css` | creado | 6 colores MBP, Josefin Sans, espaciado base-8, radios |
| `src/styles/global.css` | creado | reset, focus-visible, skip-link, prefers-reduced-motion |
| `src/layouts/BaseLayout.astro` | creado+mod | lang=es, skip link, main tabindex=-1, Header+Footer |
| `src/components/Header.astro` | creado | nav accesible, hamburger 44px, JS inline <1KB |
| `src/components/Footer.astro` | creado | disclaimer clínico persistente, fondo #2D320F |
| `src/components/PlaceholderNotice.astro` | creado | SVG aria-hidden, role=status |
| `tests/e2e/layout.spec.ts` | creado | 16 tests Playwright |
| `playwright.config.ts` | creado | config E2E con webServer Astro |
| `src/pages/index.astro` | modificado | usa BaseLayout con PlaceholderNotice |
| `package.json` | modificado | @playwright/test devDep, script test:e2e |

## Decisions Made

- **Paleta canónica MBP (no UI-SPEC):** El UI-SPEC definía `--color-accent: #C17A4A` (terracota) que no existe en el PDF de branding real. Se descartó completamente en favor de los 6 colores del PDF: `#2D320F` (oliva), `#DCCDFF` (lavanda), `#C8CD91` (sage), `#87AAAF` (teal), `#F0F0E6` (crema), `#FFFFFF` (blanco).
- **`<aside>` para disclaimer (no `role="alert"`):** El disclaimer es información estática persistente, no una alerta dinámica. ARIA `role="alert"` está reservado para mensajes de error que requieren atención inmediata. Confirmado por UI-SPEC y plan.
- **`tabindex="-1"` en `<main>`:** Sin este atributo, el `<main>` no puede recibir foco programático cuando el skip link es activado. Agregar `tabindex="-1"` es la práctica WCAG 2.4.1 estándar para destinos de skip links.
- **Selectores E2E específicos:** `header[role="banner"]` y `footer[role="contentinfo"]` para evitar que los tests fallen por colisión con los `<header>` internos del Astro DevToolbar (que aparecen en modo dev).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] tabindex="-1" en main para skip link funcional**
- **Found during:** Task 2 (ejecución de tests E2E)
- **Issue:** El test "skip link lleva a #main-content" fallaba — el `<main>` no recibe foco programático sin `tabindex="-1"` porque no es un elemento interactivo nativo.
- **Fix:** Agregado `tabindex="-1"` a `<main id="main-content">` en BaseLayout.astro. Es práctica estándar WCAG 2.4.1 para targets de skip links.
- **Files modified:** `src/layouts/BaseLayout.astro`
- **Commit:** `194e0c8`

**2. [Rule 1 - Bug] Selectores de test corregidos para entorno Astro dev**
- **Found during:** Task 2 (ejecución de tests E2E)
- **Issue:** `page.locator('header')` resolvía 7 elementos en modo dev (Astro DevToolbar inyecta `<header>` internos). Playwright falla en modo estricto cuando un selector resuelve múltiples elementos.
- **Fix:** Cambiado a `header[role="banner"]` y `footer[role="contentinfo"]` — selectores únicos que solo coinciden con los landmarks del sitio.
- **Files modified:** `tests/e2e/layout.spec.ts`
- **Commit:** `194e0c8`

**3. [Rule 2 - Missing Critical] @playwright/test instalado como devDependency**
- **Found during:** Task 2 (el plan requería `npx playwright test` sin que Playwright estuviera en package.json)
- **Issue:** El plan pedía ejecutar tests E2E sin tener Playwright instalado. Paquete verificado como legítimo (Microsoft, npmjs.com/package/@playwright/test).
- **Fix:** `npm install --save-dev @playwright/test` — audit post-instalación: 0 vulnerabilidades.
- **Commit:** `194e0c8`

---

**Total deviations:** 3 auto-fixed (Rules 1 y 2 — bugs de test + dependencia faltante)
**Impact on plan:** Sin scope creep. Los fixes son necesarios para que el plan funcione correctamente.

## Verification Results

- **Task 1 — tokens y layout:** `node -e "..."` checks pasados (lang=es, main-content, skip link, tokens MBP, sin #C17A4A, focus-visible, prefers-reduced-motion)
- **Task 2 — componentes y E2E:** 16/16 tests Playwright verde en chromium

## Known Stubs

- Logo en Header.astro: SVG placeholder con 4 elipses representando los lóbulos del isotipo. **Bloqueante confirmado** — el SVG definitivo del isotipo está pendiente del diseñador (ver MBP-BRAND-ANALYSIS.md "Información Pendiente" item #1).
- Favicon: data URI SVG placeholder (círculo oliva + lavanda). Pendiente de favicon definitivo del cliente (item #7).
- `src/pages/index.astro`: hero con PlaceholderNotice. Será reemplazado en plan 01-05.

## Threat Flags

Ninguna superficie nueva no contemplada en el threat model del plan.

T-01-09 (Information Disclosure via datos clínicos) CERRADO: disclaimer clínico persistente implementado en `<aside aria-label="Aviso importante">` en Footer, visible en cada página que usa BaseLayout.

## Self-Check

- [x] `src/styles/tokens.css` — existe y contiene `--color-primary: #2D320F`
- [x] `src/styles/global.css` — existe con `:focus-visible` y `prefers-reduced-motion`
- [x] `src/layouts/BaseLayout.astro` — existe con `lang="es"`, skip link, `main-content`
- [x] `src/components/Header.astro` — existe con hamburger y 44px touch target
- [x] `src/components/Footer.astro` — existe con `No envie sintomas` y `aside aria-label`
- [x] `src/components/PlaceholderNotice.astro` — existe con `aria-hidden="true"`
- [x] `tests/e2e/layout.spec.ts` — existe, 16/16 verde
- [x] `playwright.config.ts` — existe
- [x] Commits `0997932` y `194e0c8` verificados
- [x] Sin `#C17A4A` en ninguna asignación CSS

## Self-Check: PASSED

---
*Phase: 01-public-mvp*
*Completed: 2026-06-13*
