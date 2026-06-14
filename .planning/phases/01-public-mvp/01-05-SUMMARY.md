---
phase: 01-public-mvp
plan: "05"
subsystem: seo-security-ci
tags: [ci-check, hardcoded-content, security-headers, seo, robots, sitemap, privacy, cloudflare-pages, tdd]

# Dependency graph
requires: [01-02, 01-03]
provides:
  - scripts/check-hardcoded-content.mjs: CI check que detecta contacto/médico/JSON-LD hardcodeados (cierra H2)
  - src/components/SeoHead.astro: metadatos SEO desde contenido estructurado (sin schema médico)
  - src/pages/robots.txt.ts: robots.txt con Disallow:/ para pre-producción
  - src/pages/sitemap.xml.ts: sitemap.xml básico con origen de Astro.url
  - public/_headers: CSP + X-Frame-Options + nosniff + Referrer-Policy + Permissions-Policy
  - public/_routes.json: routing estático Cloudflare Pages
  - tests/e2e/privacy.spec.ts: 8 tests E2E (sin form/storage/analytics/cookies + robots+sitemap)
affects: [01-06, 01-07, 01-08, 01-09]

# Tech tracking
tech-stack:
  added:
    - "Node.js fs.readdirSync recursivo — escaneo de archivos para CI check (sin dependencias extra)"
  patterns:
    - "CI check por escaneo de patrones regex (no AST) — rápido, sin dependencias de compilación"
    - "CHECK_SCAN_DIR env var para fixtures aisladas en tests (misma técnica que CONTENT_DIR en 01-02)"
    - "Cloudflare Pages _headers — headers HTTP estáticos sin lógica de servidor"
    - "Astro APIRoute para endpoints estáticos (robots.txt, sitemap.xml) — sin hardcodeo de dominio"

key-files:
  created:
    - "scripts/check-hardcoded-content.mjs — CI check: teléfonos, emails, wa.me, postal, médico, JSON-LD (H2)"
    - "src/components/SeoHead.astro — title/description/canonical/OG; sin schema médico (diferido a 01-08)"
    - "src/pages/robots.txt.ts — endpoint Astro; Disallow:/ pre-producción; sin contacto hardcodeado"
    - "src/pages/sitemap.xml.ts — endpoint Astro; origen via Astro.url; sin dominio ficticio"
    - "public/_headers — CSP/X-Frame-Options/nosniff/Referrer/Permissions-Policy/HSTS"
    - "public/_routes.json — include: ['/*'] para routing estático Cloudflare Pages"
    - "tests/unit/seo.test.ts — 9 unit tests TDD (6 fixtures: phone, clean, JSON-LD, email, wa.me, content/)"
    - "tests/e2e/privacy.spec.ts — 8 tests E2E: sin form, sin storage, sin analytics, robots+sitemap"
  modified: []

key-decisions:
  - "Schema médico (MedicalBusiness/Physician JSON-LD) diferido a 01-08 — no se emite sin credenciales verificadas (T-01-16, H5)"
  - "robots.txt: Disallow:/ en pre-producción — bloquea crawlers hasta aprobación de contenido médico"
  - "Referrer-Policy: no-referrer (más restrictivo que strict-origin) — apropiado para sitio médico sin analítica"
  - "CSP: unsafe-inline en script-src — Astro inyecta toggle hamburger inline; se preferiría hash pero Astro no lo expone en static build"
  - "CI check por regex, no AST — Node 18+ sin dependencias extra; suficiente para detectar datos literales de contacto"

# Metrics
duration: 10min
completed: 2026-06-14
---

# Phase 01 Plan 05: SEO Técnico, Headers de Seguridad y CI Check Anti-Hardcodeo — Summary

**CI check operativo que impide evadir el sistema de contenido hardcodeando afirmaciones médicas/contacto en .astro (H2 cerrado); SeoHead/robots/sitemap sin datos ficticios; CSP + X-Frame-Options + nosniff + Permissions-Policy para Cloudflare Pages; 8 E2E de privacidad verdes**

## Performance

- **Duration:** 10 min
- **Started:** 2026-06-14T07:53:00Z
- **Completed:** 2026-06-14T08:00:00Z
- **Tasks:** 2/2
- **Files modified:** 8 creados

## Accomplishments

- `scripts/check-hardcoded-content.mjs`: CI check que detecta teléfonos colombianos (E.164/nacional), emails, URLs wa.me/whatsapp, direcciones postales, años de experiencia, registros profesionales y bloques JSON-LD con datos literales; excluye `src/content/`; sale 1 con reporte archivo+línea (cierra **H2 / T-01-14**)
- `src/components/SeoHead.astro`: title/description/canonical/OG sin dominio ficticio ni schema médico; placeholder description genérica mientras PH-CITY/PH-DOMAIN son bloqueantes
- `src/pages/robots.txt.ts` + `src/pages/sitemap.xml.ts`: endpoints Astro APIRoute; dominio desde `Astro.url.origin` (no hardcodeado)
- `public/_headers`: CSP (bloquea script-src externo, frame-ancestors 'none', form-action 'none'), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: no-referrer, Permissions-Policy (camera/mic/geolocation deshabilitados), HSTS (cierra **T-01-15, T-01-17**)
- `public/_routes.json`: include `/*` para routing estático en Cloudflare Pages
- 9 tests unitarios TDD (seo.test.ts) — 9/9 verde
- 8 tests E2E de privacidad (privacy.spec.ts) — 8/8 verde en chromium

## Task Commits

| Tarea | Tipo | Hash | Descripción |
|-------|------|------|-------------|
| Task 1 RED | test | fd10ffd | Failing tests para CI check hardcoded content |
| Task 1 GREEN | feat | 772ae4b | check-hardcoded-content.mjs implementado (cierra H2) |
| Task 2 | feat | 77f1886 | SeoHead, robots, sitemap, _headers, _routes, privacy E2E |

## Files Created/Modified

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `scripts/check-hardcoded-content.mjs` | creado | CI check anti-hardcodeo (H2) |
| `src/components/SeoHead.astro` | creado | SEO head; sin schema médico; sin datos ficticios |
| `src/pages/robots.txt.ts` | creado | Disallow:/ pre-producción |
| `src/pages/sitemap.xml.ts` | creado | Sitemap básico; origen de Astro.url |
| `public/_headers` | creado | Headers de seguridad Cloudflare Pages |
| `public/_routes.json` | creado | Routing estático Cloudflare Pages |
| `tests/unit/seo.test.ts` | creado | 9 tests unitarios TDD (6 fixtures) |
| `tests/e2e/privacy.spec.ts` | creado | 8 tests E2E de privacidad |

## Decisions Made

- **Schema médico diferido a 01-08:** `SeoHead.astro` no emite `MedicalBusiness`/`Physician` JSON-LD hasta que 01-08 verifique credenciales de la doctora. Emitir schema sin verificar credenciales sería spoofing (T-01-16, sugerencia Gemini H5).
- **robots.txt con Disallow:/** El contenido médico está pendiente de aprobación. Bloquear crawlers protege al sitio de ser indexado con contenido placeholder.
- **Referrer-Policy: no-referrer** (más restrictivo que `strict-origin-when-cross-origin`): un sitio médico sin analítica no debe enviar información de navegación a ningún tercero.
- **CSP con unsafe-inline en script-src:** Astro inyecta el toggle del hamburger como script inline. La alternativa (nonce/hash) requeriría un servidor SSR. Para sitio estático, unsafe-inline es el tradeoff aceptado; se documenta en los comentarios del `_headers`.
- **CI check por regex, no AST:** Más rápido y sin dependencias adicionales (Node 18+ nativo). Suficiente para detectar literales de teléfono/email/postal/JSON-LD.

## Deviations from Plan

Ninguna — plan ejecutado exactamente como escrito.

## Known Stubs

- `SeoHead.astro`: `description` usa placeholder genérico ("Sitio profesional de medicina pediátrica. Información en proceso de verificación.") mientras `PH-CITY` y `PH-DOMAIN` sean bloqueantes. Intencional — la descripción real viene en el plan de sustitución de placeholders.
- Schema médico JSON-LD ausente: intencional, diferido a 01-08 por diseño de seguridad.

## Threat Flags

Ninguna superficie nueva no contemplada en el threat model del plan.

Amenazas mitigadas:
- **T-01-14** (Tampering / hardcodeo en .astro): **CERRADO** — `check-hardcoded-content.mjs` en CI bloquea teléfono/email/médico/JSON-LD literal
- **T-01-15** (Information Disclosure / scripts terceros): **CERRADO** — CSP bloquea `script-src` externo; 8 E2E de privacidad verifican ausencia de analytics/terceros
- **T-01-16** (Spoofing / schema sin credenciales): **CERRADO** — schema médico diferido a 01-08
- **T-01-17** (Clickjacking): **CERRADO** — `X-Frame-Options: DENY` + `frame-ancestors 'none'` en CSP

## Self-Check

- [x] `scripts/check-hardcoded-content.mjs` — existe, sale 0 contra el proyecto, sale 1 ante fixtures con violaciones
- [x] `tests/unit/seo.test.ts` — existe, 9/9 verde
- [x] `src/components/SeoHead.astro` — existe, sin schema médico, sin dominio ficticio
- [x] `src/pages/robots.txt.ts` — existe, sin datos hardcodeados
- [x] `src/pages/sitemap.xml.ts` — existe, sin dominio ficticio
- [x] `public/_headers` — existe, contiene CSP + Referrer-Policy + Permissions-Policy + X-Content-Type-Options
- [x] `public/_routes.json` — existe
- [x] `tests/e2e/privacy.spec.ts` — existe, 8/8 verde
- [x] Build `npm run build` — exitoso (robots.txt + sitemap.xml + index.html generados)
- [x] Commits fd10ffd, 772ae4b, 77f1886 verificados en git log

## Self-Check: PASSED

---
*Phase: 01-public-mvp*
*Completed: 2026-06-14*
