---
phase: 01-public-mvp
plan: "02"
subsystem: content
tags: [content-contract, approval-manifest, sha256, content-validation, tdd, placeholders]

# Dependency graph
requires: [01-01]
provides:
  - Contrato de contenido estructurado: 6 colecciones Astro (profile/services/contact/locations/hours)
  - APPROVAL-MANIFEST.json a prueba de manipulacion con reconciliacion de hash
  - src/lib/approval.ts con computeContentHash y verifyApproval
  - src/lib/placeholders.ts con BLOCKING_PLACEHOLDER_IDS (21 IDs, derivado de codigo no de JSON editable)
  - scripts/validate-content.mjs: preview tolerante, production intolerante con reconciliacion de hash
  - scripts/hash-content.mjs: utilitario sha256 para aprobadores humanos
  - 28 tests unitarios (12 approval + 16 validator) mas los 8 smoke previos = 36 totales
affects: [01-03, 01-04, 01-05, 01-06, 01-07, 01-08, 01-09]

# Tech tracking
tech-stack:
  added:
    - "node:crypto createHash — sha256 hex para contentHash y verifyApproval"
    - "Astro content collections (type: data) — colecciones JSON con validacion Zod"
  patterns:
    - "Derivacion de bloqueo desde codigo (BLOCKING_PLACEHOLDER_IDS) en lugar de campo editable en JSON"
    - "Manifiesto de aprobacion inmutable con contentHash: si el valor cambia, el hash deja de coincidir"
    - "Modo dual del validador: preview (tolerante) / production (intolerante con reconciliacion de hash)"
    - "Tests de integracion de scripts usando spawnSync con fixtures temporales en tmpdir"

key-files:
  created:
    - "src/content.config.ts — 5 colecciones Astro con esquema {id, value, status, source}"
    - "src/content/site/profile.json — perfil y credenciales con placeholders canónicos"
    - "src/content/site/services.json — servicios y programas con placeholders"
    - "src/content/site/contact.json — datos de contacto con CTAs deshabilitados"
    - "src/content/site/locations.json — sedes estructuradas (cierra WEB-01)"
    - "src/content/site/hours.json — horarios estructurados (cierra WEB-01)"
    - ".planning/content/APPROVAL-MANIFEST.json — manifiesto inicial vacio (produccion bloqueada)"
    - "src/lib/approval.ts — computeContentHash + verifyApproval"
    - "src/lib/placeholders.ts — BLOCKING_PLACEHOLDER_IDS (21 IDs canonicos)"
    - "scripts/validate-content.mjs — validador endurecido con todos los casos borde"
    - "scripts/hash-content.mjs — utilitario sha256 para aprobadores"
    - "tests/unit/approval.test.ts — 12 tests TDD (hash, revocacion, sin entrada, aprobacion valida)"
    - "tests/unit/placeholders.test.ts — 16 tests TDD (JSON invalido, ID desconocido, duplicados, espacios, URL peligrosa, hash no coincidente, evidencia faltante)"
  modified: []

key-decisions:
  - "BLOCKING_PLACEHOLDER_IDS vive en src/lib/placeholders.ts (codigo versionado) no como campo blocksProduction en JSON editable: evita evasion manual de puerta de produccion (cierra H1, T-01-04)"
  - "APPROVAL-MANIFEST.json inicial vacio: produccion debe permanecer bloqueada hasta que la doctora apruebe contenido medico con evidencia"
  - "21 IDs bloqueantes copiados literalmente de PLACEHOLDER-REGISTER.md columna Si: fuente unica de verdad"
  - "Tests de scripts usando spawnSync con env vars CONTENT_DIR y MANIFEST_PATH: permite fixtures temporales sin modificar archivos reales"

# Metrics
duration: 18min
completed: 2026-06-13
---

# Phase 01 Plan 02: Contenido Estructurado y Manifiesto de Aprobacion Summary

**Contrato de contenido estructurado con reconciliacion de hash SHA-256 que hace la puerta de produccion no evadible: blocksProduction se deriva de codigo versionado (BLOCKING_PLACEHOLDER_IDS), no de un campo editable en JSON**

## Performance

- **Duration:** 18 min
- **Started:** 2026-06-13T22:05:50Z
- **Completed:** 2026-06-13T22:24:00Z
- **Tasks:** 2/2
- **Files modified:** 13 creados

## Accomplishments

- 6 colecciones de contenido Astro (JSON estructurado) incluyendo locations.json y hours.json (cierra MEDIUM WEB-01)
- APPROVAL-MANIFEST.json inicial vacio: produccion bloqueada por diseno hasta sustitucion de placeholders
- src/lib/approval.ts: computeContentHash (sha256 hex) y verifyApproval (reconciliacion de hash contra manifiesto)
- src/lib/placeholders.ts: BLOCKING_PLACEHOLDER_IDS derivado de codigo, no de campo editable en JSON (cierra H1 / T-01-04)
- scripts/validate-content.mjs: validador con modo preview (tolerante) y production (intolerante), cubriendo todos los casos borde del threat model
- scripts/hash-content.mjs: utilitario para que aprobadores humanos generen contentHash
- 36 tests totales pasando (28 nuevos en dos archivos TDD)
- node scripts/validate-content.mjs production: exit 1, lista los 21 bloqueantes sin aprobacion

## Task Commits

| Tarea | Tipo | Hash | Descripcion |
|-------|------|------|-------------|
| Task 1 RED | test | 1edf8e8 | Failing tests para approval hash verification |
| Task 1 GREEN | feat | d8454a0 | Contenido estructurado, manifiesto y verificacion de hash |
| Task 2 RED | test | 9ad0505 | Failing tests para validador de contenido y utilitario hash |
| Task 2 GREEN | feat | 7ef2369 | Validador endurecido y utilitario hash (GREEN) |

## Files Created/Modified

- `src/content.config.ts` — 5 colecciones Astro con esquema Zod `{id, value, status, source}`
- `src/content/site/profile.json` — perfil con PH-PUBLIC-NAME, PH-PROFESSIONAL-TITLE, PH-PROFESSIONAL-REGISTRY, PH-AGE-RANGE, PH-CARE-MODALITY
- `src/content/site/services.json` — PH-SERVICE-DESCRIPTIONS, PH-SPECIAL-PROGRAM-NAMES
- `src/content/site/contact.json` — PH-PHONE, PH-EMAIL, PH-WHATSAPP, PH-ALTERNATE-CHANNEL, PH-CLINICAL-MESSAGE-PROCEDURE, PH-EMERGENCY-PROCEDURE
- `src/content/site/locations.json` — PH-ADDRESS, PH-CITY (cierra WEB-01 parcialmente)
- `src/content/site/hours.json` — PH-PUBLIC-HOURS (cierra WEB-01)
- `.planning/content/APPROVAL-MANIFEST.json` — array vacio inicial
- `src/lib/approval.ts` — exports: `computeContentHash`, `verifyApproval`, `ManifestEntry`, `ApprovalResult`
- `src/lib/placeholders.ts` — exports: `BLOCKING_PLACEHOLDER_IDS` (21 IDs readonly)
- `scripts/validate-content.mjs` — validador ESM Node con modos preview/production
- `scripts/hash-content.mjs` — utilitario sha256 para aprobadores
- `tests/unit/approval.test.ts` — 12 tests
- `tests/unit/placeholders.test.ts` — 16 tests

## Decisions Made

- **blocksProduction como codigo, no como campo JSON:** La lista de IDs bloqueantes vive en `src/lib/placeholders.ts` (codigo bajo control de version). Un editor no puede poner `blocksProduction: false` en un JSON para evadir la puerta de produccion. Cierra H1 (T-01-04).
- **Manifiesto vacio inicial:** Ningun contenido medico ha sido aprobado formalmente. Produccion permanece bloqueada hasta que la doctora apruebe con evidencia.
- **Variables de entorno CONTENT_DIR y MANIFEST_PATH:** Permiten que los tests de scripts usen fixtures temporales sin tocar archivos reales del proyecto.
- **spawnSync para tests de scripts:** Los scripts son ESM puro (.mjs), invocarlos como procesos hijos es la forma mas directa y no requiere adaptadores de transpilacion.

## Deviations from Plan

Ninguna — plan ejecutado exactamente como escrito.

## Known Stubs

- `src/content/site/profile.json`: todos los campos tienen valores placeholder (no datos reales aprobados). Intencional por diseno; seran reemplazados en el plan de sustitucion cuando la doctora apruebe.
- `src/content/site/services.json`: idem.
- `src/content/site/contact.json`: CTAs deshabilitados ("CTA deshabilitado"). Intencional.
- `src/content/site/locations.json`: "Informacion disponible proximamente". Intencional.
- `src/content/site/hours.json`: "Horario pendiente de confirmacion". Intencional.
- `.planning/content/APPROVAL-MANIFEST.json`: array vacio. Intencional — produccion bloqueada.

Todos los stubs son intencionales, trazados en PLACEHOLDER-REGISTER.md y bloquean produccion correctamente. No impiden el objetivo del plan (establecer el contrato de contenido y la puerta de aprobacion).

## Threat Flags

Ninguna superficie nueva no contemplada en el threat model del plan.

El plan mitiga:
- T-01-04 (Tampering / blocksProduction editable): CERRADO — bloqueo deriva de BLOCKING_PLACEHOLDER_IDS en codigo
- T-01-05 (Tampering / aprobacion sin evidencia): CERRADO — manifiesto exige approvedBy/approvedAt/evidenceRef
- T-01-06 (Tampering / contenido cambiado tras aprobar): CERRADO — reconciliacion de contentHash
- T-01-07 (Spoofing / URL peligrosa): CERRADO — allowlist de esquemas, bloqueo javascript:/data:/file:
- T-01-08 (DoS / JSON invalido): CERRADO — parseo defensivo con fallo explicito

## Self-Check: PASSED

Todos los archivos verificados presentes. Commits 1edf8e8, d8454a0, 9ad0505, 7ef2369 verificados en git log.

---
*Phase: 01-public-mvp*
*Completed: 2026-06-13*
