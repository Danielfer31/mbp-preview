# Wind Petals Splash — Design Spec

**Date:** 2026-06-19
**Project:** Maria Bernarda Pacheco — Pediatría (preview-fullscreen.html)
**Status:** Approved

---

## Overview

Decorative animated petals falling diagonally across the splash screen, simulating flowers carried by wind. Runs only inside `#splash` in `preview-fullscreen.html`. Enhances the background with a radial gradient and SVG noise texture. Uses GSAP (already loaded in file).

---

## Scope

- **File:** `C:\Users\USUARIO\Downloads\preview-fullscreen.html` only
- **No changes** to Astro project (`SplashScreen.astro`, `index.astro`, etc.)
- Petals exist only while `#splash` is visible. Destroyed/hidden on dismiss.

---

## Background Enhancements

### Gradient on curtain panels

`#splash-left` and `#splash-right` change from solid `#3d4728` to a radial gradient:

```css
background: radial-gradient(ellipse at center, #4e6030 0%, #3d4728 45%, #252d10 100%);
```

Center edge (where panels meet): lighter `#4e6030`
Outer edges: darker `#252d10`
Effect: depth, eye drawn toward center logo.

### SVG noise texture overlay

A single `<svg>` element with `feTurbulence` filter positioned absolute inside `#splash`, full viewport size, z-index between curtains and petals, `pointer-events: none`, opacity 0.07.

```html
<svg id="splash-noise" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
     style="position:absolute;inset:0;width:100%;height:100%;opacity:.07;pointer-events:none;z-index:601">
  <filter id="noise-filter">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise-filter)"/>
</svg>
```

---

## Petal Elements

### Count & placement

12 petal SVGs, created by JS and appended to `#splash`. All have:
- `position: absolute`
- `pointer-events: none`
- `z-index: 602` (above noise texture, below `#splash-center` at z-index 601... wait, splash-center is 601 so petals should be between noise and center)

Z-index stack inside `#splash`:
- `#splash-left`, `#splash-right`: z-index as default (no explicit z)
- `#splash-noise`: z-index 1 (above curtains)
- `.sp-wind-petal`: z-index 2 (above noise)
- `#splash-center`: z-index 601 (always on top — logo + text)

### Shapes (3 variants, SVG paths)

All 12x12 viewBox `0 0 12 12`.

**Variant A — Teardrop** (used 5×):
```svg
<path d="M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z"/>
```
Colors: `#c4b0e8` (3×), `#c4d8a8` (2×)

**Variant B — Curved leaf** (used 4×):
```svg
<path d="M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z"/>
```
Colors: `#8aaa68` (4×)

**Variant C — Angular fragment** (used 3×):
```svg
<path d="M6,1 L11,5 L8,11 L3,9 L1,4 Z"/>
```
Colors: `#4d8282` (3×)

### Sizes

Each petal element rendered as `<svg width="{size}" height="{size}">` where size is randomly chosen from `[10, 12, 14, 16, 18]` at creation.

### Opacity

Each petal initial opacity: random between 0.30 and 0.65, set via `gsap.set`.

---

## Animation — GSAP

### Per-petal function

```javascript
function animateWindPetal(el) {
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var startX = Math.random() * vw;
  var driftX = (Math.random() - 0.5) * 280; // ±140px horizontal drift
  var duration = 5 + Math.random() * 4;      // 5–9s
  var startRotation = Math.random() * 360;
  var endRotationDelta = 180 + Math.random() * 180; // +180 to +360°

  gsap.set(el, {
    x: startX,
    y: -20 - Math.random() * 40,  // -20 to -60px above top
    rotation: startRotation,
    opacity: 0.30 + Math.random() * 0.35
  });

  gsap.to(el, {
    y: vh + 50,
    x: startX + driftX,
    rotation: '+=' + endRotationDelta,
    duration: duration,
    ease: 'none',
    onComplete: function() { animateWindPetal(el); }
  });
}
```

### Staggered start

Each of the 12 petals gets an initial `delay` of `i * 0.35` seconds (0 to ~4.2s) so they don't all enter simultaneously.

```javascript
petals.forEach(function(el, i) {
  gsap.delayedCall(i * 0.35, function() { animateWindPetal(el); });
});
```

---

## Integration with existing splash JS

The petal system initializes inside the existing IIFE, after the `sp-go` class is added:

```javascript
// After: splash.classList.add('sp-go');
if (!reduced) { initWindPetals(splash); }
```

`initWindPetals(splash)` creates elements, appends to splash, starts animations.

### Exit behavior

In the existing `dismiss()` function, before adding `sp-out`:

```javascript
// Fade out all petals with curtain
var petals = splash.querySelectorAll('.sp-wind-petal');
if (petals.length) {
  gsap.to(petals, { opacity: 0, duration: 0.4, ease: 'power2.in' });
}
```

### Cleanup

In the `setTimeout` that hides the splash (after exit animation):
```javascript
setTimeout(function() {
  splash.style.display = 'none';
  sessionStorage.setItem('splash-seen', '1');
  // petals are inside #splash so hidden automatically
}, 900);
```

No explicit DOM removal needed — petals are children of `#splash`, hidden with it.

---

## Accessibility

`prefers-reduced-motion: reduce` → `initWindPetals` is never called. No elements created, no GSAP animations. Background gradient and noise texture still apply (static).

---

## CSS changes

Only two changes to existing CSS:

1. `#splash-left`, `#splash-right` background → radial gradient (replace existing `background:#3d4728`)
2. No other CSS additions — petals are styled entirely via inline attributes + GSAP

---

## Out of Scope

- Petals on main page sections (only splash)
- Astro project changes
- Petal interactivity (hover, click)
- Variable wind speed / direction controls
