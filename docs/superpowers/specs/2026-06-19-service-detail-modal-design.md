# Service Detail Modal — Design Spec

**Date:** 2026-06-19
**Feature:** Hover/click detail panel for service cards on Servicios page
**File target:** `C:\Users\USUARIO\Downloads\preview-fullscreen.html`

---

## 1. Summary

When the user hovers a service card (desktop) or taps it (mobile), a centered overlay modal appears with the service icon, title, and a detailed description of the service/pathology. The modal scales in from center with a GSAP animation consistent with the existing `MBPAnimations` system.

---

## 2. Trigger Behavior

| Context | Trigger to open | Trigger to close |
|---|---|---|
| Desktop (`hover: hover`) | `mouseenter` on card | `mouseleave` from modal + 150ms delay, or `Escape`, or click backdrop |
| Mobile (`hover: none`) | `click` / `tap` on card | Tap `✕` button, tap backdrop, or `Escape` |

Detection via `window.matchMedia('(hover: none)')` — evaluated at runtime, not compile time.

---

## 3. DOM Structure

Single modal element reused for all 6 services. Injected once at body level, hidden by default.

```html
<!-- Backdrop -->
<div id="svc-backdrop"></div>

<!-- Modal -->
<div id="svc-modal" role="dialog" aria-modal="true" aria-labelledby="svc-modal-title">
  <div id="svc-modal-inner">
    <div id="svc-modal-header">
      <div id="svc-modal-icon"><!-- SVG icon --></div>
      <h2 id="svc-modal-title"><!-- Service title --></h2>
      <button id="svc-modal-close" aria-label="Cerrar">✕</button>
    </div>
    <div id="svc-modal-divider"></div>
    <p id="svc-modal-desc"><!-- Description --></p>
  </div>
</div>
```

---

## 4. Service Data

Each service card gets `data-service="N"` (0–5). The JS object:

```js
const SERVICES = {
  0: {
    title: 'Consulta pediátrica general',
    color: '#9878cc', bg: '#ede8f5',
    icon: '<!-- stethoscope SVG path -->',
    desc: 'Evaluación médica integral del niño desde el nacimiento hasta la adolescencia. Diagnóstico y tratamiento de enfermedades agudas y crónicas, seguimiento del estado general de salud y orientación continua a la familia.'
  },
  1: {
    title: 'Patología respiratoria',
    color: '#6a8c50', bg: '#e0e8d0',
    icon: '<!-- lungs SVG path -->',
    desc: 'Diagnóstico y manejo de enfermedades respiratorias como asma, bronquitis recurrente, neumonía y rinitis alérgica. Atención de crisis agudas y planificación del tratamiento y seguimiento a largo plazo.'
  },
  2: {
    title: 'Conducta y desarrollo',
    color: '#9878cc', bg: '#ede8f5',
    icon: '<!-- brain SVG path -->',
    desc: 'Evaluación del desarrollo psicomotor, cognitivo y emocional del niño. Atención de TDAH, dificultades de aprendizaje y trastornos del comportamiento, con acompañamiento respetuoso e integral a la familia.'
  },
  3: {
    title: 'Nutrición pediátrica',
    color: '#c07850', bg: '#fce8d8',
    icon: '<!-- apple SVG path -->',
    desc: 'Evaluación nutricional personalizada para cada etapa del crecimiento. Orientación sobre alimentación complementaria, manejo de obesidad infantil y promoción de hábitos alimentarios saludables desde la primera infancia.'
  },
  4: {
    title: 'Atención al recién nacido',
    color: '#9878cc', bg: '#ede8f5',
    icon: '<!-- cross SVG path -->',
    desc: 'Valoración integral del neonato en los primeros días y semanas de vida. Control de peso, alimentación, detección de ictericia y otras alteraciones tempranas, con acompañamiento cercano a los padres.'
  },
  5: {
    title: 'Control de crecimiento',
    color: '#6a8c50', bg: '#e0e8d0',
    icon: '<!-- chart SVG path -->',
    desc: 'Monitoreo periódico del crecimiento físico, cognitivo y emocional mediante curvas de desarrollo estandarizadas. Detección oportuna de desviaciones y seguimiento longitudinal del bienestar integral del niño.'
  }
};
```

---

## 5. Visual Design

| Property | Value |
|---|---|
| Modal background | `#fafaf8` |
| Border radius | `16px` |
| Max width | `520px` |
| Padding | `32px` |
| Backdrop color | `rgba(45,40,35,.55)` |
| Backdrop backdrop-filter | `blur(4px)` |
| Title font | Cormorant Garamond, 26px, weight 400 |
| Description font | Jost, 14px, weight 300, color `#5a5858`, line-height 1.7 |
| Icon circle | 56px, background = service `bg` color |
| Divider | 1px, color = service `color` at 40% opacity |
| Close button | `✕`, top-right, color `#888`, hover `#2c2c2c` |
| Z-index modal | 310 (above mobile menu at 200) |
| Z-index backdrop | 309 |

---

## 6. GSAP Animation

### Open sequence
```
t=0.00  backdrop: opacity 0→1, duration 0.25s
t=0.00  modal: scale 0.82→1, opacity 0→1, duration 0.32s, ease power3.out
t=0.08  [icon, title, desc]: y 8→0, opacity 0→1, stagger 0.06s, ease power2.out
```

### Close sequence
```
t=0.00  modal: scale 1→0.88, opacity 1→0, duration 0.2s, ease power2.in
t=0.00  backdrop: opacity 1→0, duration 0.2s
```

All added inside `window.MBPAnimations` — `openServiceModal(idx)` and `closeServiceModal()` methods.

---

## 7. Mobile Adaptation

- `matchMedia('(hover: none)')` checked once on init, stored as `isTouchDevice`
- Desktop: `mouseenter` on `article[data-service]` → open; `mouseleave` on `#svc-modal` with 150ms debounce → close
- Mobile: `click` on `article[data-service]` → open; `#svc-modal-close` or backdrop click → close
- `body.style.overflow = 'hidden'` while modal open on mobile (prevent scroll behind)

---

## 8. Accessibility

- Modal has `role="dialog"` and `aria-modal="true"`
- On open: focus moves to `#svc-modal-close`
- `Escape` key closes modal
- `aria-labelledby` points to `#svc-modal-title`
- Backdrop click closes modal

---

## 9. Out of Scope

- CTA button inside modal (user explicitly declined)
- Animations for cards themselves (hover lift already handled by existing `MBPAnimations.initMicro`)
- Any changes to pages other than Servicios

---

## 10. Implementation Notes

- All JS added to the existing `<script>` block containing `MBPAnimations`
- Modal HTML injected via JS `document.body.insertAdjacentHTML()` on `init`
- CSS added inside existing `<style>` block
- No new dependencies — GSAP already loaded via CDN in the file
- Icons reused from existing SVG paths in each `article` card
