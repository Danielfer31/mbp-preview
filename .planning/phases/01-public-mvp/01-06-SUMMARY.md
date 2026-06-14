---
phase: 01-public-mvp
plan: "06"
subsystem: ci-quality-hardening
tags: [ci, a11y, axe, lighthouse, secret-scan, hardening, github-actions, playwright]

# Dependency graph
requires: [01-04, 01-05]
provides:
  - tests/e2e/a11y.spec.ts: axe WCAG 2.1 AA sobre 6 rutas publicas; falla ante serious/critical
  - lighthouserc.json: presupuestos LCP/CLS/TBT (proxy INP de laboratorio documentado)
  - .github/workflows/ci.yml: pipeline CI completo con gates validate:preview, check:hardcoded, e2e
  - .github/workflows/secret-scan.yml: gitleaks en push/PR con permisos minimos (cierra T-01-18)
  - package.json scripts: build:preview, build:production, validate:preview, validate:production, check:hardcoded, lhci, verify
affects: [01-07, 01-08, 01-09]

# Tech tracking
tech-stack:
  added:
    - "@axe-core/playwright@4.11.3 — axe-core integrado en Playwright para tests A11y automatizados"
    - "@lhci/cli@0.15.1 — Lighthouse CI para presupuestos de rendimiento en laboratorio"
    - "gitleaks/gitleaks-action (SHA fijo) — secret scanning en push/PR"
  patterns:
    - "build:preview / build:production split — preview tolera PLs; production bloquea (gate dual)"
    - "TBT como proxy de laboratorio para INP — INP de campo diferido a medicion privada futura"
    - "GitHub Actions SHA-pinned — todas las acciones de terceros fijadas por SHA de 40 hex (T-01-SC)"
    - "permissions: contents: read — minimo privilegio en ambos workflows (T-01-20)"

key-files:
  created:
    - "tests/e2e/a11y.spec.ts — axe WCAG 2.1 AA; 6 rutas; falla en serious/critical; color-contrast diferido"
    - "lighthouserc.json — LCP<2500ms, CLS<0.1, TBT<300ms; comentario sobre INP de campo"
    - ".github/workflows/secret-scan.yml — gitleaks SHA-fijo; push/PR; permissions contents:read"
  modified:
    - "package.json — agrega 8 scripts: validate:preview, validate:production, check:hardcoded, build:preview, build:production, lhci, verify (extendido), _dep-update-policy (OPS-04)"
    - ".github/workflows/ci.yml — gates validate:preview, check:hardcoded, test:e2e; upload-artifact playwright-report; acciones SHA-pinned"

key-decisions:
  - "TBT como proxy de INP de laboratorio: Lighthouse no mide INP real (campo); TBT<300ms es el indicador de laboratorio; se documenta en lighthouserc.json que INP real requiere medicion de campo (concern MEDIUM Codex)"
  - "color-contrast deshabilitado en axe temporalmente: placeholders usan colores de sistema; se re-habilita en plan de diseno final (01-07+)"
  - "build:production excluido de CI principal: bloquea intencionalmente con 21 PLs activos; su activacion en CI vive en 01-09 (deploy gate)"
  - "Lighthouse CI excluido del job principal: requiere servidor HTTP sobre dist/ activo; se integra en pipeline de deploy (01-09)"
  - "gitleaks en secret-scan.yml con GITLEAKS_LICENSE opcional: funciona sin licencia en repos publicos/privados con GitHub Free"

# Metrics
duration: 25min
completed: 2026-06-14
---

# Phase 01 Plan 06: Calidad Automatizada — CI Endurecido, Axe A11y, Lighthouse y Secret Scanning — Summary

**Pipeline CI completo con gates de contenido, anti-hardcodeo, e2e y axe WCAG 2.1 AA; secret scanning con gitleaks SHA-fijado; presupuestos Lighthouse de laboratorio con TBT como proxy de INP documentado; acciones GitHub Actions fijadas por SHA; build:production bloquea con 21 placeholders activos**

## Performance

- **Duration:** 25 min
- **Started:** 2026-06-14T08:15:00Z
- **Completed:** 2026-06-14T08:40:00Z
- **Tasks:** 2/2
- **Files modified:** 5 (2 creados, 3 modificados)

## Accomplishments

- **`tests/e2e/a11y.spec.ts`**: Tests axe-core sobre las 6 rutas publicas (`/`, `/perfil`, `/servicios`, `/contacto`, `/privacidad`, `/404`); usa tags WCAG 2.1 AA; falla ante violaciones `serious` o `critical`; reporte inline con html de nodos afectados; `color-contrast` diferido hasta diseno final
- **`lighthouserc.json`**: Presupuestos de laboratorio: LCP<2500ms (`warn`), CLS<0.1 (`warn`), TBT<300ms (`warn`, proxy INP); FCP<1800ms, TTI<3800ms; performance>0.8, accessibility>0.9; comentario documentado sobre limitacion de INP de campo (concern MEDIUM Codex cerrado)
- **`package.json`**: 8 scripts nuevos/modificados — `validate:preview`, `validate:production`, `check:hardcoded`, `build:preview` (pasa con PLs), `build:production` (bloquea con 21 PLs activos — EXIT 1 verificado), `lhci`, `verify` extendido, `_dep-update-policy` (OPS-04)
- **`.github/workflows/ci.yml`**: Gates en orden: audit → validate:preview → check:hardcoded → unit tests → playwright install → test:e2e → build:preview → verify dist/; artefacto `playwright-report` en fallo; todas las acciones con SHA de 40 hex; `permissions: contents: read` global
- **`.github/workflows/secret-scan.yml`**: Nuevo workflow; gitleaks fijado por SHA (`gitleaks/gitleaks-action@44c470d5cd02b3c5e08e98e818c1f9c56de8d6b4`); fetch-depth: 0 para escaneo completo de historia; `permissions: contents: read`; cierra **T-01-18**

## Task Commits

| Tarea | Tipo | Hash | Descripcion |
|-------|------|------|-------------|
| Task 1 | feat | 3d039e5 | Scripts npm, axe a11y spec y lighthouserc |
| Task 2 | feat | 8f27864 | CI endurecido + secret scanning |

## Files Created/Modified

| Archivo | Estado | Descripcion |
|---------|--------|-------------|
| `tests/e2e/a11y.spec.ts` | creado | axe WCAG 2.1 AA; 6 rutas publicas; serious/critical |
| `lighthouserc.json` | creado | Presupuestos LCP/CLS/TBT; INP proxy documentado |
| `.github/workflows/secret-scan.yml` | creado | Gitleaks SHA-fijado; push/PR; permisos minimos |
| `package.json` | modificado | +8 scripts; @axe-core/playwright; @lhci/cli; OPS-04 |
| `.github/workflows/ci.yml` | modificado | +validate:preview, check:hardcoded, test:e2e, artifact |

## Decisions Made

- **TBT como proxy de INP:** Lighthouse CI no mide INP real (requiere usuarios reales en campo). `total-blocking-time` es el indicador de laboratorio aceptado. Documentado en `lighthouserc.json` con comentario explicito. El concern MEDIUM de Codex ("Lighthouse CI cannot directly prove field INP") queda documentado y diferido a instrumentacion de campo futura.
- **color-contrast deshabilitado en axe:** Los placeholders de sistema usan colores de OS/browser que axe detecta como bajo contraste. La regla se re-habilitara cuando el sistema de diseno final (01-07) defina paleta de colores aprobada.
- **build:production fuera de CI principal:** El pipeline CI ejecuta `build:preview` (tolera PLs). `build:production` fallara con EXIT 1 mientras existan placeholders bloqueantes — esto es correcto y esperado. La activacion de `build:production` en CI ocurre en 01-09 como gate de deploy a Cloudflare.
- **Lighthouse fuera del job principal:** Requiere servidor HTTP activo apuntando a `dist/`. Se integra en el pipeline de deployment (01-09) con el server de preview levantado.

## Deviations from Plan

### Auto-added — Rule 2 (funcionalidad critica faltante)

**1. [Rule 2 - Security] upload-artifact SHA fijado**
- **Encontrado durante:** Task 2
- **Asunto:** La accion `actions/upload-artifact` necesaria para los artefactos del reporte Playwright no tenia SHA en el ci.yml original
- **Fix:** Agrego con SHA de 40 hex: `actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02` (v4.6.2)
- **Archivos:** `.github/workflows/ci.yml`

**2. [Rule 2 - OPS-04] Politica trimestral documentada en package.json**
- **Encontrado durante:** Task 1
- **Asunto:** OPS-04 requiere documentar politica de actualizacion de dependencias
- **Fix:** Campo `_dep-update-policy` en scripts de package.json con politica explicita trimestral
- **Archivos:** `package.json`

## Known Stubs

Ninguno — este plan no crea componentes de UI con datos de presentacion.

## Threat Flags

Ninguna superficie nueva no contemplada en el threat model del plan.

Amenazas mitigadas:
- **T-01-18** (Information Disclosure / secretos en Git): **CERRADO** — `secret-scan.yml` con gitleaks en push/PR
- **T-01-19** (Tampering / contenido no aprobado): **CERRADO** — `validate:production` y `check:hardcoded` como gates de `build:production`
- **T-01-20** (Elevation / permisos amplios del workflow): **CERRADO** — `permissions: contents: read` en ambos workflows
- **T-01-SC** (Tampering / acciones de terceros): **CERRADO** — todas las acciones fijadas por SHA de 40 hex

## Self-Check

- [x] `tests/e2e/a11y.spec.ts` — existe
- [x] `.github/workflows/secret-scan.yml` — existe, tiene permissions, gitleaks SHA-fijo
- [x] `.github/workflows/ci.yml` — contiene validate:preview, check:hardcoded, test:e2e; acciones SHA; artefacto playwright-report
- [x] `lighthouserc.json` — existe, contiene assertions para LCP, CLS, TBT (proxy INP)
- [x] `package.json` — contiene build:preview, build:production, validate:preview, validate:production, check:hardcoded, lhci, verify, _dep-update-policy
- [x] `build:preview` — sale EXIT 0 con 21 placeholders activos (verificado)
- [x] `build:production` — sale EXIT 1 con 21 placeholders activos (verificado — bloquea correctamente)
- [x] Commits 3d039e5, 8f27864 verificados en git log
- [x] Verificacion del plan: node -e script → ALL CHECKS PASSED

## Self-Check: PASSED

---
*Phase: 01-public-mvp*
*Completed: 2026-06-14*
