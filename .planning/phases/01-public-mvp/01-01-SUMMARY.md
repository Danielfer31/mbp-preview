---
phase: 01-public-mvp
plan: "01"
subsystem: infra
tags: [astro, typescript, vitest, github-actions, esbuild, static-site]

# Dependency graph
requires: []
provides:
  - Proyecto Astro 6.4.6 con salida estatica funcional (dist/)
  - Auditoria npm sin vulnerabilidades high/critical (override esbuild 0.28.1)
  - Version Node 24 fijada en .nvmrc y engines.node en package.json
  - Pipeline CI GitHub Actions con permisos de minimo privilegio y acciones fijadas por SHA
  - Suite de pruebas de humo Vitest con 8 tests (100% pasando)
  - Script verify local que encadena audit + test + build
affects: [01-02, 01-03, 01-04, 01-05, 01-06, 01-07, 01-08, 01-09]

# Tech tracking
tech-stack:
  added:
    - "astro@6.4.6 — generador estatico SSG"
    - "typescript@5.8.3 — tipado estricto"
    - "vitest@4.1.8 — framework de tests"
    - "esbuild@0.28.1 (override) — cierra CVEs GHSA-g7r4-m6w7-qqqr y GHSA-gv7w-rqvm-qjhr"
  patterns:
    - "npm overrides para fijar versiones transitivas vulnerables sin downgrade de dependencias principales"
    - "SHAs de 40 chars para todas las acciones de terceros en GitHub Actions"
    - "Script verify local como alias del pipeline CI completo"

key-files:
  created:
    - "package.json — manifiesto con engines.node, scripts base y override esbuild"
    - "package-lock.json — lockfile reproducible"
    - ".nvmrc — version Node 24 fijada"
    - "astro.config.ts — output static, site url"
    - "tsconfig.json — strict true, strictNullChecks, extiende astro/tsconfigs/strict"
    - "src/env.d.ts — referencia tipos Astro"
    - "src/pages/index.astro — pagina minima funcional"
    - "vitest.config.ts — configuracion tests"
    - "tests/unit/smoke.test.ts — 8 pruebas de humo"
    - ".github/workflows/ci.yml — pipeline CI endurecido"
  modified: []

key-decisions:
  - "Usar Astro 6.4.6 (latest) compatible con Node >=22.12.0; Node 24 seleccionado como runtime"
  - "Override esbuild a 0.28.1 via npm overrides para cerrar CVEs sin downgrade de Astro; alternativa audit fix --force habria instalado Astro 2.4.5 (regresion inaceptable)"
  - "Acciones GitHub fijadas por SHA: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 y actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020"
  - "permissions: contents: read en CI como unico permiso; sin write sobre ningun recurso"

patterns-established:
  - "npm overrides: para dependencias transitivas con CVEs cuando el fix directo rompe el arbol"
  - "SHA pinning en CI: ninguna accion de terceros por tag mutable"
  - "Paridad CI/local: .nvmrc + engines.node + node-version-file: .nvmrc en CI"

requirements-completed: [OPS-05, QA-01, QA-02, QA-06, QA-07, BUS-04]

# Metrics
duration: 8min
completed: 2026-06-13
---

# Phase 01 Plan 01: Fundacion Astro + CI Summary

**Astro 6.4.6 estatico reproducible con audit limpio (override esbuild 0.28.1), Node 24 fijado en .nvmrc/engines, y CI GitHub Actions endurecido con SHA pinning desde el primer commit**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-13T21:50:29Z
- **Completed:** 2026-06-13T22:00:00Z
- **Tasks:** 2/2
- **Files modified:** 10 creados

## Accomplishments

- Proyecto Astro 6.4.6 con `output: 'static'` compilando a `dist/index.html` sin errores
- Auditoria de dependencias limpia (0 vulnerabilidades high/critical) via override de esbuild a 0.28.1
- CI GitHub Actions activo desde el primer commit con permisos de minimo privilegio y acciones fijadas por SHA
- Version Node 24 fijada en `.nvmrc` y `engines.node` en `package.json` garantizando paridad CI/local
- Suite Vitest con 8 pruebas de humo pasando; script `verify` como alias local del pipeline CI

## Task Commits

Cada tarea fue commiteada atomicamente:

1. **Task 1: Crear fundacion Astro auditada con paridad de Node** - `65ebb9c` (feat)
2. **Task 2: Establecer CI base inmediatamente despues de la fundacion** - `4711594` (feat)

**Plan metadata:** (commit final de SUMMARY)

## Files Created/Modified

- `package.json` — manifiesto npm con engines.node >=24.0.0, scripts build/test/audit/verify, override esbuild
- `package-lock.json` — lockfile reproducible (5343 lineas)
- `.nvmrc` — Node 24 fijado
- `astro.config.ts` — output: 'static', site url para Cloudflare Pages
- `tsconfig.json` — strict true, strictNullChecks, extiende astro/tsconfigs/strict
- `src/env.d.ts` — tipos Astro
- `src/pages/index.astro` — pagina minima con robots noindex (contenido pendiente aprobacion)
- `vitest.config.ts` — configuracion Vitest node environment
- `tests/unit/smoke.test.ts` — 8 pruebas de humo (existencia y contenido de archivos criticos)
- `.github/workflows/ci.yml` — pipeline CI endurecido (permissions, SHA pinning, .nvmrc)

## Decisions Made

- **Override esbuild 0.28.1:** `astro@6.4.6` requiere `esbuild: ^0.27.3` y `vite@^7.3.2` que a su vez requiere `esbuild ^0.27.0`; ambos bloquean la version 0.28.1 que cierra los CVEs. Se uso `overrides.esbuild` en package.json para forzar 0.28.1 sin alterar el arbol de versiones principales. El alternativo `npm audit fix --force` habria instalado `astro@2.4.5` (downgrade mayor inaceptable).
- **SHA pinning acciones CI:** `actions/checkout@v4.2.2` → SHA `11bd71901bbe5b1630ceea73d27597364c9af683`; `actions/setup-node@v4.4.0` → SHA `49933ea5288caeca8642d1e84afbd3f7d6820020`. Cumple T-01-03.
- **Node 24 como runtime:** Compatible con Astro 6 (>=22.12.0) y Vitest 4 (^20||^22||>=24). Version LTS planificada para mediados 2026.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Override de esbuild para cerrar CVEs sin romper Astro**
- **Found during:** Task 1 (instalacion de dependencias)
- **Issue:** `npm install` reporto 3 vulnerabilidades HIGH en esbuild (GHSA-g7r4-m6w7-qqqr: lectura arbitraria de archivos en Windows en dev server; GHSA-gv7w-rqvm-qjhr: falta de verificacion de integridad binaria). El estado del proyecto documentaba este bloqueo del spike.
- **Fix:** Agregado `overrides.esbuild: "0.28.1"` en package.json. Tras `npm install` la auditoria reporto 0 vulnerabilidades.
- **Files modified:** `package.json`
- **Verification:** `npm audit --audit-level=high` exit code 0
- **Committed in:** `65ebb9c` (Task 1)

---

**Total deviations:** 1 auto-fixed (Rule 2 - missing critical security mitigation)
**Impact on plan:** Necesario para cumplir el criterio bloqueante del spike y el requisito T-01-01. Sin scope creep.

## Issues Encountered

El advisory de esbuild afecta el servidor de desarrollo en Windows (no el build estatico en produccion). Sin embargo, la auditoria se ejecuta sobre todas las dependencias instaladas incluyendo devDependencies, por lo que el CVE es reportado independientemente del modo de uso. El override soluciona el hallazgo sin comprometer la funcionalidad de build estatico.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- La fundacion Astro esta lista para que los planes 01-02 a 01-09 construyan sobre ella
- El CI valida cada push desde ahora; los planes posteriores podran extenderlo (e2e, axe, lighthouse)
- El sitio compilado tiene `<meta name="robots" content="noindex">` hasta que el contenido real sea aprobado

## Known Stubs

- `src/pages/index.astro` contiene contenido placeholder (robots noindex, descripcion generica). Sera reemplazado en planes 01-03 (contenido/perfil) y posteriores cuando el contenido medico sea aprobado por la doctora.

## Threat Flags

Ninguna superficie nueva no contemplada en el threat model del plan.

---
*Phase: 01-public-mvp*
*Completed: 2026-06-13*
