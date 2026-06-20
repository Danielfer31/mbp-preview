# Splash Screen — Design Spec

**Date:** 2026-06-19  
**Project:** Maria Bernarda Pacheco — Pediatría  
**Status:** Approved

---

## Overview

A full-screen intro overlay that appears once per browser session, covering the entire viewport before the main site is visible. Provides a prestigious first impression using the site's brand identity (dark green, logo, typography). Dismissed by click, mousemove (after animation completes), or auto-dismiss at 6s.

---

## Behavior

### Session Logic

- Check `sessionStorage.getItem('splash-seen')` on page load.
- If key exists: `#splash` is immediately hidden (`display:none`) — no animation runs.
- If key absent: run entrance animation, then wait for dismiss trigger.
- On dismiss: set `sessionStorage.setItem('splash-seen', '1')` and hide splash.
- Key resets when browser tab/session closes (desired — appears once per visit session).

### Dismiss Triggers

| Trigger | Condition |
|---------|-----------|
| Click | Anywhere on `#splash` — immediate |
| Mousemove | First `mousemove` event after `t=1.8s` (after entrance completes) |
| Auto-dismiss | `setTimeout` at `6000ms` from page load |

Only the first trigger to fire runs the exit animation. Guards prevent double-firing.

---

## Structure

```
#splash  (position:fixed; inset:0; z-index:500; overflow:hidden)
├── #splash-left   (position:absolute; top:0; left:0;  width:50%; height:100%; background:#3d4728)
├── #splash-right  (position:absolute; top:0; right:0; width:50%; height:100%; background:#3d4728)
└── #splash-center (position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:501; text-align:center)
    ├── SVG logo (4-petal brand mark, 88×88px desktop / 64×64px mobile)
    ├── p.splash-name  "MARIA BERNARDA" + line break + "PACHECO"
    └── p.splash-spec  "PEDIATRÍA"
```

---

## Entrance Animation (GSAP, total ~2.2s)

All elements start `opacity:0`.

| t (s) | Element | From | To | Duration | Ease |
|-------|---------|------|----|----------|------|
| 0.2 | Petal 1 | rotate:45°, scale:0.6, opacity:0 | rotate:0°, scale:1, opacity:1 | 0.5s | back.out(1.4) |
| 0.32 | Petal 2 | same | same | 0.5s | back.out(1.4) |
| 0.44 | Petal 3 | same | same | 0.5s | back.out(1.4) |
| 0.56 | Petal 4 | same | same | 0.5s | back.out(1.4) |
| 1.0 | Name | y:16, opacity:0 | y:0, opacity:1 | 0.4s | power2.out |
| 1.35 | Specialty | y:16, opacity:0 | y:0, opacity:1 | 0.4s | power2.out |
| 1.8 | Logo (loop) | scale:1 | scale:1.04 → 1 | 1.2s | sine.inOut, yoyo, repeat:-1 |

`svgOrigin: "22 22"` for each petal path (SVG coordinate space, viewBox center). Do NOT use `transformOrigin` — it resolves relative to the element's own bounding box, not the SVG canvas center, causing off-center rotation.

---

## Exit Animation (GSAP, ~0.65s)

Triggered by first dismiss event. Guard flag `splashDismissed` prevents re-trigger.

1. `#splash-center`: `opacity:1→0, y:0→-12` — duration 0.25s, ease `power2.in`
2. Simultaneously: `#splash-left` → `x:0→-100%`, `#splash-right` → `x:0→+100%` — duration 0.55s, ease `power3.inOut`
3. On complete: `#splash.style.display = 'none'`

---

## CSS

```css
#splash {
  position: fixed;
  inset: 0;
  z-index: 500;
  overflow: hidden;
}
#splash-left,
#splash-right {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: #3d4728;
}
#splash-left  { left: 0; }
#splash-right { right: 0; }
#splash-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 501;
  text-align: center;
  pointer-events: none;
  white-space: nowrap;
}
.splash-name {
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #f0ebe0;
  line-height: 1.4;
  margin-top: 18px;
  margin-bottom: 0;
}
.splash-spec {
  font-family: 'Jost', sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: #a8c080;
  margin-top: 6px;
}

@media (max-width: 800px) {
  .splash-name { font-size: 11px; }
}
```

---

## Accessibility

- `#splash` has `aria-hidden="true"` — purely decorative, no interactive content inside.
- `prefers-reduced-motion`: skip all GSAP animations. Show splash static, then fade out with CSS `opacity` transition (0.4s) after 1.5s delay. No petal rotation, no sliding panels.

```css
@media (prefers-reduced-motion: reduce) {
  #splash { transition: opacity 0.4s ease; }
}
```

---

## Integration

- **New file:** `src/components/SplashScreen.astro`
- **Import:** added to `src/pages/index.astro` as last child of `<body>` (before closing tag)
- **Dependencies:** GSAP — already present in project (used for existing scroll animations)
- **Z-index stack:** splash (500) > service modal (310) > mobile menu (200) > header (100)
- **No changes** to Header.astro, Footer.astro, or any other page component

---

## Out of Scope

- Splash on inner pages (servicios, perfil, contacto) — only index
- Video or image background
- Skip button / explicit close UI — dismiss is implicit (click or mouse)
