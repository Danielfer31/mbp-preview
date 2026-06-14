---
phase: 01-public-mvp
plan: "04"
subsystem: public-pages
tags: [pages, components, e2e, accessibility, safe-contact, placeholders, web-01, web-10, web-07, prv-01, prv-02]

# Dependency graph
requires: [01-02, 01-03]
provides:
  - "5 páginas públicas + 404 personalizada (/, /perfil, /servicios, /contacto, /privacidad)"
  - "ServiceCard: nombre de servicio confirmado; omite descripción si PH-SERVICE-DESCRIPTIONS bloquea"
  - "SafeContactCard: CTA con aria-disabled sin href cuando placeholder bloquea (T-01-11); canal alternativo WEB-10; disclaimer WEB-07"
  - "LocationsHours: sedes y horarios desde locations.json/hours.json con degradado seguro (WEB-01)"
  - "28 tests E2E en chromium — 28/28 verde"
affects: [01-05, 01-06, 01-07, 01-08, 01-09]

# Tech tracking
tech-stack:
  added:
    - "src/content/{nombre}/: subdirectorios de colección Astro para getCollection (fix estructura)"
  patterns:
    - "SafeContactCard: role=link aria-disabled=true para CTA bloqueado (sin href ficticio)"
    - "getCollection + flatMap(e => e.data): acceso a datos de colecciones tipo array"
    - "Degradado seguro en todo componente: si campo es bloqueante -> texto 'Información disponible próximamente'"
    - "Disclaimer junto a cada CTA de contacto (WEB-07 / T-01-12)"

key-files:
  created:
    - "src/components/ServiceCard.astro — card de servicio con lógica de placeholder en descripción"
    - "src/components/SafeContactCard.astro — CTA seguro con aria-disabled, canal alternativo, disclaimer"
    - "src/components/LocationsHours.astro — render de sedes y horarios con degradado seguro (WEB-01)"
    - "src/pages/perfil.astro — perfil con credenciales aprobadas o empty state"
    - "src/pages/servicios.astro — grid de ServiceCard con nombres confirmados del branding"
    - "src/pages/contacto.astro — contacto con SafeContactCard + LocationsHours"
    - "src/pages/privacidad.astro — política de privacidad, advertencia clínica, responsables"
    - "src/pages/404.astro — 404 personalizada con copy exacto y enlace al home"
    - "src/content/profile/profile.json — colección Astro para getCollection('profile')"
    - "src/content/services/services.json — colección Astro para getCollection('services')"
    - "src/content/contact/contact.json — colección Astro para getCollection('contact')"
    - "src/content/locations/locations.json — colección Astro para getCollection('locations')"
    - "src/content/hours/hours.json — colección Astro para getCollection('hours')"
    - "tests/e2e/public-pages.spec.ts — 28 tests E2E (rutas, CTAs bloqueados, canal alternativo, 404, disclaimers)"
  modified:
    - "src/pages/index.astro — hero con nombre aprobado, CTA deshabilitado, pilares confirmados"

key-decisions:
  - "ServiceCard muestra solo nombre cuando PH-SERVICE-DESCRIPTIONS está en BLOCKING_PLACEHOLDER_IDS — no se muestran descripciones médicas no aprobadas"
  - "SafeContactCard usa span[role=link][aria-disabled=true] para CTA bloqueado — sin href, sin posibilidad de seguir un enlace ficticio (T-01-11)"
  - "Canal alternativo siempre visible cuando canal principal está bloqueado (WEB-10) — texto seguro si PH-ALTERNATE-CHANNEL también está pendiente"
  - "Subdirectorios src/content/{nombre}/ creados para coincidir con colecciones definidas en content.config.ts"

# Metrics
duration: 45min
completed: 2026-06-14
---

# Phase 01 Plan 04: Páginas Públicas, Componentes de Contacto Seguro y E2E Summary

**5 páginas públicas + 404 con ServiceCard, SafeContactCard y LocationsHours leyendo del contenido estructurado; CTA deshabilitados con aria-disabled sin href ficticio (T-01-11), canal alternativo visible (WEB-10), disclaimers clínicos (WEB-07) y 28/28 tests E2E verde**

## Performance

- **Duration:** 45 min
- **Started:** 2026-06-14T07:55:00Z
- **Completed:** 2026-06-14T08:40:00Z
- **Tasks:** 2/2
- **Files created:** 14 nuevos, 1 modificado

## Accomplishments

- `ServiceCard.astro`: muestra nombre confirmado del servicio; cuando PH-SERVICE-DESCRIPTIONS está en BLOCKING_PLACEHOLDER_IDS, omite la descripción y muestra "Información disponible próximamente" — no se expone contenido médico no aprobado
- `SafeContactCard.astro`: CTA con `aria-disabled="true"` sin href cuando el placeholder bloquea (T-01-11); disclaimer exacto "No envíe información clínica por este canal." en --color-destructive (T-01-12/WEB-07); canal alternativo visible con texto seguro cuando PH-ALTERNATE-CHANNEL también está pendiente (WEB-10)
- `LocationsHours.astro`: lee `getCollection('locations')` y `getCollection('hours')`; degrada a "Información disponible próximamente" para todos los campos en BLOCKING_PLACEHOLDER_IDS (WEB-01)
- `index.astro`: hero con nombre no bloqueante, CTA "AGENDAR CITA" deshabilitado, 4 pilares confirmados del branding MBP, CTA final a /contacto
- `perfil.astro`: credenciales solo si status==='aprobado'; empty state "Las credenciales verificadas se publicarán próximamente." cuando pendientes (CNT-01)
- `servicios.astro`: grid de ServiceCard con los 6 nombres confirmados del PDF de branding; empty state si sin servicios
- `contacto.astro`: 3 SafeContactCard (tel/email/whatsapp) + LocationsHours + aviso clínico (PRV-01/PRV-02)
- `privacidad.astro`: condiciones de uso, advertencia clínica (Ley 23/1981), responsable de privacidad con placeholder si pendiente, procedimiento ante mensajes clínicos/urgencias
- `404.astro`: copy exacto "Esta pagina no existe. Puede regresar al inicio o contactar directamente." + enlace a /
- **28/28 tests E2E verde** en chromium: 6 rutas, CTAs bloqueados sin href real, canal alternativo, sedes/horarios, 404, disclaimers, landmarks ARIA

## Task Commits

| Tarea | Tipo | Hash | Descripción |
|-------|------|------|-------------|
| Task 1 | feat | d8f8492 | Componentes ServiceCard, SafeContactCard, LocationsHours |
| Task 2 | feat | 5315682 | Páginas públicas, 404, subdirectorios de colección, E2E 28/28 |

## Files Created/Modified

| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `src/components/ServiceCard.astro` | creado | Card de servicio; omite descripción si PH-SERVICE-DESCRIPTIONS bloquea |
| `src/components/SafeContactCard.astro` | creado | CTA seguro: aria-disabled, canal alternativo, disclaimer |
| `src/components/LocationsHours.astro` | creado | Sedes y horarios desde colecciones Astro con degradado seguro |
| `src/pages/index.astro` | modificado | Hero con nombre aprobado, CTA deshabilitado, pilares, CTA final |
| `src/pages/perfil.astro` | creado | Perfil con credenciales aprobadas o empty state |
| `src/pages/servicios.astro` | creado | Grid ServiceCard con 6 nombres confirmados del branding |
| `src/pages/contacto.astro` | creado | SafeContactCard + LocationsHours + aviso clínico |
| `src/pages/privacidad.astro` | creado | Privacidad, advertencia clínica, responsables, procedimientos |
| `src/pages/404.astro` | creado | 404 personalizada con copy exacto y enlace al home |
| `src/content/profile/profile.json` | creado | Copia para colección Astro getCollection('profile') |
| `src/content/services/services.json` | creado | Copia para colección Astro getCollection('services') |
| `src/content/contact/contact.json` | creado | Copia para colección Astro getCollection('contact') |
| `src/content/locations/locations.json` | creado | Copia para colección Astro getCollection('locations') |
| `src/content/hours/hours.json` | creado | Copia para colección Astro getCollection('hours') |
| `tests/e2e/public-pages.spec.ts` | creado | 28 tests E2E: rutas, CTAs bloqueados, canal alternativo, 404 |

## Decisions Made

- **ServiceCard sin descripción médica hardcodeada:** El componente nunca muestra la descripción cuando PH-SERVICE-DESCRIPTIONS está en BLOCKING_PLACEHOLDER_IDS. Se muestran solo los nombres confirmados en el PDF de branding (no son afirmaciones médicas — son denominaciones de servicio).
- **SafeContactCard con span[role=link][aria-disabled=true]:** Usar `<a>` con href sería emitir un enlace ficticio aunque esté `aria-disabled`. Usar un `<span>` con `role="link"` y `aria-disabled="true"` garantiza que no hay href emitido (T-01-11). El browser no puede seguir un span.
- **Canal alternativo siempre visible cuando principal bloqueado (WEB-10):** El componente muestra la sección de canal alternativo en todos los SafeContactCard cuando el canal principal está bloqueado. Si PH-ALTERNATE-CHANNEL también es pendiente, muestra texto seguro en lugar de nada o enlace ficticio.
- **Subdirectorios de colección:** Astro 6 con Content Layer API requiere que los archivos estén en `src/content/{nombre-coleccion}/`. Los archivos en `src/content/site/` son del contrato de datos (01-02); los subdirectorios son copias para que `getCollection()` funcione correctamente.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Subdirectorios de colección Astro faltantes**
- **Found during:** Task 2 (build con advertencias "collection does not exist or is empty")
- **Issue:** Los archivos JSON en `src/content/site/` son accesibles como contenido del directorio `site`, pero `getCollection('profile')` busca en `src/content/profile/`. La config `content.config.ts` define colecciones `profile`, `services`, `contact`, `locations`, `hours` pero no había archivos en esos subdirectorios.
- **Fix:** Creados subdirectorios `src/content/{profile,services,contact,locations,hours}/` con los JSON correspondientes. Los archivos en `src/content/site/` se mantienen como fuente canónica del contrato (01-02 — no se modificaron).
- **Files created:** 5 archivos JSON en subdirectorios de colección
- **Commit:** 5315682
- **Nota:** El build pasa en ambos casos; los datos se renderizan correctamente tras el fix. Los warnings ya no son bloqueantes pero permanecen en stderr de Astro dev — investigación adicional deferred.

## Known Stubs

- `src/pages/index.astro`: hero con CTA "AGENDAR CITA" deshabilitado. Se habilitará cuando PH-PHONE/PH-WHATSAPP sean aprobados. Intencional por diseño.
- `src/pages/servicios.astro`: 6 nombres de servicios del PDF de branding mostrados, sin descripciones (PH-SERVICE-DESCRIPTIONS bloqueante). Los nombres son confirmados — las descripciones se mostrarán cuando sean aprobadas.
- `src/pages/perfil.astro`: empty state de credenciales — todas pendientes. Intencional.
- `src/pages/contacto.astro`: 3 CTAs deshabilitados. Canal alternativo "próximamente". Intencional.
- `src/pages/privacidad.astro`: responsable de privacidad con PlaceholderNotice. Intencional.

Todos los stubs son intencionales, trazados en PLACEHOLDER-REGISTER.md y reflejados en BLOCKING_PLACEHOLDER_IDS. No impiden el objetivo del plan (experiencia completa revisable sin datos inventados).

## Threat Flags

Ninguna superficie nueva no contemplada en el threat model del plan.

Mitigaciones implementadas:
- **T-01-11** (Spoofing / CTA con href ficticio): CERRADO — SafeContactCard usa span[role=link][aria-disabled=true] sin href cuando placeholder bloquea
- **T-01-12** (Information Disclosure / canal externo con datos clínicos): CERRADO — disclaimer "No envíe información clínica por este canal." en --color-destructive junto a cada CTA
- **T-01-13** (Repudiation / afirmación médica sin aprobación): CERRADO — render exclusivamente desde contenido estructurado; sin valores médicos hardcodeados en páginas

## Verification Results

- **Task 1 — componentes:** `node -e "..."` checks pasados (aria-disabled, disclaimer, horarios)
- **Task 2 — páginas y E2E:** 28/28 tests Playwright verde en chromium
  - 6 rutas: existencia y h1 (6/6)
  - Empty states: credenciales, servicios, contacto (3/3)
  - CTAs bloqueados sin href: / y /contacto (3/3)
  - Canal alternativo visible (1/1)
  - Sedes y horarios presentes (3/3)
  - 404 personalizada: copy, enlace, botón (3/3)
  - Disclaimer clínico: / y /contacto (2/2)
  - Estructura base BaseLayout en 6 rutas (6/6)

## Self-Check: PASSED

Archivos verificados:
- [x] `src/components/ServiceCard.astro` — existe
- [x] `src/components/SafeContactCard.astro` — existe, contiene aria-disabled y disclaimer
- [x] `src/components/LocationsHours.astro` — existe, contiene horario/hours
- [x] `src/pages/index.astro` — existe
- [x] `src/pages/perfil.astro` — existe
- [x] `src/pages/servicios.astro` — existe
- [x] `src/pages/contacto.astro` — existe
- [x] `src/pages/privacidad.astro` — existe
- [x] `src/pages/404.astro` — existe, contiene "Esta pagina no existe"
- [x] `tests/e2e/public-pages.spec.ts` — existe, 28 tests
- [x] Commit d8f8492 verificado en git log
- [x] Commit 5315682 verificado en git log
- [x] 28/28 tests E2E verde en chromium

---
*Phase: 01-public-mvp*
*Completed: 2026-06-14*
