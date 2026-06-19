# MBP GSAP Animation System — Premium Clínico

**Date:** 2026-06-19
**Status:** Approved
**Target:** `index.html` (standalone, single deliverable for Dr. Maria Bernarda Pacheco)
**Approach:** Additive layers — page fully functional without animation
**Library:** GSAP 3.12.5 + ScrollTrigger via CDN (conditional load)
**Constraint:** Zero build tools. One `<script>` block at end of `<body>`.

---

## Goals

Elevate the standalone HTML from functional → premium-clínico feel.
Motion conveys **trust and authority**, not decoration.
All animation is progressive enhancement — the page works identically without it.

---

## Layer 0 — Setup & Kill Switch

### CDN Load (conditional)

```html
<!-- Place just before closing </body> -->
<script>
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var s1 = document.createElement('script');
  s1.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
  s1.onload = function() {
    var s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
    s2.onload = function() {
      gsap.registerPlugin(ScrollTrigger);
      window.__mbpGsap = true;
      MBPAnimations.init();
    };
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);
})();
</script>
```

**Why conditional load:** If `prefers-reduced-motion: reduce` → 0KB downloaded. Not just a runtime check — scripts never load.

### MBPAnimations namespace

All animation code lives in `window.MBPAnimations = { init, enterPage, ... }`.
This keeps it isolated from the existing `goTo()`, `openMenu()`, `closeMenu()`, `toggleFaq()` functions.

### Eases used

| Name | GSAP string | Used for |
|------|-------------|----------|
| Expo out | `"power3.out"` | Entrances, reveals |
| Spring pop | `"back.out(1.7)"` | Circle/badge pops, button hover |
| Smooth in | `"power2.in"` | Exits |
| Smooth inOut | `"power2.inOut"` | Transitions, FAQ |

---

## Layer 1 — Page Entrance Animations

Triggered when `goTo(page)` is called AND on initial load.
`goTo()` is patched: after showing the new page, it calls `MBPAnimations.enterPage(page)`.

### inicio

**h1 letter split** — "MARIA BERNARDA" / "PACHECO" split into individual `<span class="letter">` elements.
No SplitText plugin (paid). Manual DOM split preserves `aria-label` on h1.

```
gsap.from('.letter-inicio', {
  opacity: 0,
  y: 40,
  duration: 0.9,
  ease: 'power3.out',
  stagger: 0.022,
  delay: 0.1,
  clearProps: 'all'
})
```

**Tagline** `font-size:17px` paragraph: `opacity:0→1`, `y:16→0`, `duration:0.7`, `delay:0.55`
**CTA buttons**: `opacity:0→1`, `y:12→0`, stagger `0.1s`, `delay:0.65`
**Disclaimer line**: `opacity:0→1`, `delay:0.9`

### servicios

Badge pill: `scale:0→1`, `back.out(1.7)`, `duration:0.4`, `delay:0`
h1 words stagger: split by space into `<span>`, `y:24→0`, `opacity:0→1`, stagger `0.06s`
Divider: `width:0→40px`, `duration:0.5`, `delay:0.4`
Body text: `opacity:0→1`, `y:12→0`, `delay:0.5`

### perfil

Same as servicios but h1 adds `rotateX:25→0` for 3D editorial weight.
`transformOrigin: 'center bottom'`
Info cards on right: stagger `0.08s`, `x:20→0`, `opacity:0→1`

### contacto

Badge + h1: same stagger pattern as servicios, no rotateX.
Channel cards entrance: stagger `0.1s`, `y:20→0`, `opacity:0→1`, `delay:0.4`

### avisos

Eyebrow label: `opacity:0→1`, `y:8→0`
h1 word stagger: `y:20→0`, stagger `0.05s`
Notice articles: `x:-12→0`, `opacity:0→1`, stagger `0.08s`, `delay:0.5`

---

## Layer 2 — Page Transitions

Replaces the current instant `opacity:0→1` toggle in `goTo()`.

### Exit animation (current page leaving)

```
gsap.to(currentPageEl, {
  opacity: 0,
  y: -10,
  duration: 0.22,
  ease: 'power2.in',
  onComplete: () => {
    currentPageEl.classList.remove('active')
    gsap.set(currentPageEl, { opacity: 0, y: 0 }) // reset
    // then trigger enter
  }
})
```

### Enter animation (new page arriving)

```
nextPageEl.classList.add('active')
gsap.fromTo(nextPageEl,
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out',
    onComplete: () => MBPAnimations.enterPage(page) }
)
```

**Header color change** fires at the `onComplete` of exit (midpoint of total transition).
Total transition: ~520ms. Feels fast but not abrupt.

### goTo() patch

```js
// Wrap existing goTo() — do not delete it
const _goToOriginal = goTo;
window.goTo = function(page) {
  if (!window.__mbpGsap) { _goToOriginal(page); return; }
  MBPAnimations.transition(page); // GSAP-powered version
};
```

---

## Layer 3 — Scroll Reveals (ScrollTrigger)

Elements that already have CSS `.reveal` class: **leave them alone** — IntersectionObserver handles them.
GSAP ScrollTrigger only for **card grids** where coordinated stagger matters.

### Service cards (6 cards, `#page-servicios`)

Remove `.reveal` from these cards via JS when GSAP loads.
```
gsap.from(serviceCards, {
  opacity: 0, y: 36, scale: 0.96,
  duration: 0.65, ease: 'power3.out',
  stagger: { each: 0.09, from: 'start' },
  scrollTrigger: {
    trigger: serviceCardsParent,
    start: 'top 78%',
    toggleActions: 'play none none none'
  }
})
```

### Contact channel cards (3 cards, `#page-contacto`)

```
gsap.from(channelCards, {
  opacity: 0, y: 24,
  duration: 0.55, ease: 'power2.out',
  stagger: 0.12,
  scrollTrigger: { trigger: channelGrid, start: 'top 80%', toggleActions: 'play none none none' }
})
```

### Notice articles (5 articles, `#page-avisos`)

```
gsap.from(noticeArticles, {
  opacity: 0, x: -16,
  duration: 0.55, ease: 'power2.out',
  stagger: 0.1,
  scrollTrigger: { trigger: noticeList, start: 'top 80%', toggleActions: 'play none none none' }
})
```

### Privacy section (`#page-contacto` teal band)

```
gsap.from(privacySection, {
  opacity: 0, y: 20,
  duration: 0.6, ease: 'power3.out',
  scrollTrigger: { trigger: privacySection, start: 'top 82%', toggleActions: 'play none none none' }
})
```

---

## Layer 4 — Micro-interactions

### Service cards hover lift

Remove CSS hover transform. Replace with GSAP:
```
mouseenter → gsap.to(card, { y:-6, boxShadow:'0 12px 32px rgba(45,50,15,0.14)', duration:0.28, ease:'power2.out' })
mouseleave → gsap.to(card, { y:0, boxShadow:'0 0px 0px rgba(45,50,15,0)', duration:0.22, ease:'power2.inOut' })
```

### CTA buttons hover

```
mouseenter → gsap.to(btn, { scale:1.03, duration:0.18, ease:'back.out(1.4)' })
mouseleave → gsap.to(btn, { scale:1, duration:0.15, ease:'power2.in' })
```
Applied to: `.h-cta`, hero CTAs, footer CTA equivalent.

### Nav `.nb` active underline

Current: CSS `border-bottom` appears instantly.
GSAP: animate `scaleX:0→1` on the border via `transformOrigin:'left center'`:
```
// On goTo() call, update active nav button:
gsap.from(newActiveBtn, { scaleX:0, transformOrigin:'left center', duration:0.3, ease:'power2.out' })
// targeting the border-bottom pseudo via direct style on the element itself
```

### Mobile menu open

```
openMenu:
  - gsap.from('#mob-menu', { opacity:0, x:20, duration:0.28, ease:'power3.out' })
  - gsap.from('.mob-nb, .mob-cta', { opacity:0, y:12, stagger:0.06, delay:0.1, duration:0.35, ease:'power2.out' })

closeMenu:
  - gsap.to('#mob-menu', { opacity:0, x:20, duration:0.2, ease:'power2.in',
      onComplete: () => { menu.classList.remove('open'); gsap.set(menu, {opacity:1, x:0}) }
    })
```

**Patch `openMenu()` and `closeMenu()`** same pattern as `goTo()` — check `__mbpGsap`, delegate if available.

### FAQ accordion

Current: CSS `max-height` transition. GSAP replaces with `gsap.to` on `maxHeight` for spring feel:
```
open:  gsap.to(body, { maxHeight: body.scrollHeight, duration:0.35, ease:'power2.out' })
close: gsap.to(body, { maxHeight: 0, duration:0.25, ease:'power2.in' })
```
Patch `toggleFaq()`.

---

## Layer 5 — Decorative

### Logo SVG petal hover

4 `<path>` elements inside `.logo-btn > svg`.
```
mouseenter → gsap.to(petals, { scale:1.15, opacity:1, duration:0.35, ease:'back.out(1.7)',
               stagger:0.06, transformOrigin:'22px 22px' })
mouseleave → gsap.to(petals, { scale:1, opacity:0.85, duration:0.25, ease:'power2.in',
               stagger:{ each:0.04, from:'end' }, transformOrigin:'22px 22px' })
```
Stagger reverses on leave — petals "close" in opposite order.

### Hero orb

Already animated via CSS `@keyframes` infinite. **Leave in CSS** — GPU-friendly, no GSAP needed for infinite loops.

### Section dividers (colored `height:2px` lines)

On page entrance, before the reveal of the text above:
```
gsap.from(divider, { width:0, duration:0.5, ease:'power3.out', delay:0.4 })
```

### Footer social icons hover

```
mouseenter → gsap.to(icon, { scale:1.1, borderColor:'rgba(255,255,255,0.6)', duration:0.2, ease:'power2.out' })
mouseleave → gsap.to(icon, { scale:1, borderColor:'rgba(255,255,255,0.25)', duration:0.15 })
```

---

## Implementation Notes

### Patching existing functions

All 4 existing functions (`goTo`, `openMenu`, `closeMenu`, `toggleFaq`) are patched with the wrapper pattern — not replaced. If `__mbpGsap` is false (GSAP not loaded), original behavior runs unchanged.

### ScrollTrigger cleanup on page change

Before each `MBPAnimations.enterPage()` call:
```js
ScrollTrigger.getAll().forEach(t => t.kill());
```
Prevents orphaned triggers from previous pages.

### Element selectors

Use the exact IDs/classes from the current HTML:
- Page containers: `#page-inicio`, `#page-servicios`, `#page-perfil`, `#page-contacto`, `#page-avisos`
- Service cards: `#page-servicios article`
- Channel cards: `#page-contacto .sec > div > div` (first 3 flex children)
- Notice articles: `#page-avisos article`
- Logo paths: `.logo-btn > svg > path`
- Mobile menu items: `#mob-menu .mob-nb`, `#mob-menu .mob-cta`
- FAQ bodies: `.faq-body`

### What NOT to animate

- `font-size`, `letter-spacing` — Safari interpolation issues
- `display` — not animatable; use `opacity` + `pointer-events` instead
- `color` on text — use `opacity` instead for performance
- Anything inside `.page` that isn't `.active` — waste of GPU

### File output

All code added to existing `<script>` block at end of `index.html` body.
No new files. No build step. No npm.

---

## Acceptance Criteria

- [ ] `prefers-reduced-motion: reduce` → no animation, scripts not downloaded
- [ ] `goTo()` still works if GSAP CDN fails (network error, CDN down)
- [ ] All 5 pages have entrance animations
- [ ] Service card stagger visible on servicios page scroll
- [ ] Mobile menu slides in/out smoothly
- [ ] Logo petal hover works on desktop
- [ ] No layout shift (CLS) from animations
- [ ] FAQ accordions open/close with GSAP spring
