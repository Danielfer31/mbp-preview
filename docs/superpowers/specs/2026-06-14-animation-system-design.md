# MBP Animation System — Design Spec

**Date:** 2026-06-14  
**Status:** Approved  
**Scope:** Fluidity, scroll reveal, hero entrance, page transitions, micro-interactions  
**Constraint:** Zero new dependencies. Vanilla JS + CSS only. `prefers-reduced-motion` respected throughout.

---

## Goal

Elevate brand feel from static → premium-editorial through expressive motion. All animation is additive — the page is fully functional without it.

---

## 1. Easing Tokens (tokens.css)

Add to `:root`:

```css
--ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

- `--ease-expo-out`: fast start, very soft land. Used for entrances.
- `--ease-spring`: subtle overshoot. Used for circle pop only.

---

## 2. Astro View Transitions (BaseLayout.astro)

Import and render `<ViewTransitions />` from `astro:transitions`.

- Default `fade` morph between pages
- Duration: 280ms
- Script reveal re-initializes on `astro:page-load` event (fires on initial load + every navigation)

---

## 3. Reveal System (BaseLayout.astro — inline `<script>`)

Single IntersectionObserver instance. ~0.6KB unminified.

### CSS (global.css)

```css
/* Base state — hidden */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity  700ms var(--ease-expo-out),
    transform 700ms var(--ease-expo-out);
  transition-delay: var(--reveal-delay, 0ms);
}

/* Revealed state — JS adds this class */
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

Wrapped in `@media (prefers-reduced-motion: no-preference)`. Outside that block, `.reveal` shows immediately.

### JS (inline in BaseLayout, runs on `astro:page-load`)

```js
function initReveal() {
  const elements = document.querySelectorAll('.reveal:not(.revealed)');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '-32px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('astro:page-load', initReveal);
```

---

## 4. Hero Entrance (index.astro)

CSS `@keyframes` — no JS. Elements animate on page load without waiting for scroll.

### Keyframe

```css
@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(var(--enter-y, 28px));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Stagger schedule

| Element | `--enter-y` | delay | duration |
|---|---|---|---|
| `.hero__eyebrow` | 20px | 0ms | 600ms |
| `.hero__title` | 40px | 150ms | 850ms |
| `.hero__subtitle` | 20px | 380ms | 650ms |
| `.hero__cta-group` | 20px | 560ms | 600ms |
| `.hero__disclaimer` | 0px (opacity only) | 750ms | 500ms |

All use `--ease-expo-out`. Elements start `opacity: 0` via `animation-fill-mode: both`.

### Hero background orb

```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 60% 70% at 75% 40%,
    var(--color-sage) 0%,
    transparent 65%
  );
  opacity: 0.28;
  animation: orb-drift 9s ease-in-out infinite alternate;
}

@keyframes orb-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-4%, 3%) scale(1.06); }
}
```

Hero gets `position: relative; overflow: hidden`.

---

## 5. Pillars Section (index.astro)

### Section header

`.pillars__eyebrow` and `.pillars__statement` each get `.reveal` class.

### Pillar items — stagger

Each `pillars__item` gets `.reveal` plus inline `--reveal-delay`:

```html
<li class="pillars__item reveal" style="--reveal-delay: 0ms">
<li class="pillars__item reveal" style="--reveal-delay: 120ms">
<li class="pillars__item reveal" style="--reveal-delay: 240ms">
<li class="pillars__item reveal" style="--reveal-delay: 360ms">
```

### Circles — spring pop

`.pillars__circle` gets `@keyframes circle-pop` (triggered when parent `.revealed`):

```css
@keyframes circle-pop {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.pillars__item.revealed .pillars__circle {
  animation: circle-pop 550ms var(--ease-spring) both;
  /* --reveal-delay cascades from parent li via CSS custom property inheritance */
  animation-delay: var(--reveal-delay, 0ms);
}
```

### Circle fill upgrade

Replace flat `background-color: var(--color-primary)` with:
```css
background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-sage) 100%);
```

---

## 6. Service Cards (servicios.astro + ServiceCard.astro)

### Staggered entrance

Each `<li>` in the services grid gets `.reveal` and `--reveal-delay` computed by index (0–5):

```astro
{servicesToShow.map((name, i) => (
  <li class="reveal" style={`--reveal-delay: ${i * 60}ms`}>
    <ServiceCard name={name} ... />
  </li>
))}
```

### Enhanced hover (ServiceCard.astro)

```css
/* Increase lift */
.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(45, 50, 15, 0.14);
}

/* Icon area color shift */
.service-card:hover .service-card__icon,
.service-card:hover .service-card__icon-placeholder {
  background-color: var(--color-sage);
  transition: background-color 250ms var(--ease-expo-out);
}
```

Card transition duration extended to `350ms`.

---

## 7. Button Micro-interactions (global.css)

```css
@media (prefers-reduced-motion: no-preference) {
  .btn:active {
    transform: scale(0.97);
    transition: transform 100ms ease;
  }

  /* Shimmer on primary button */
  .btn-primary,
  .btn--primary {
    position: relative;
    overflow: hidden;
  }

  .btn-primary::after,
  .btn--primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.12) 50%,
      transparent 60%
    );
    transform: translateX(-100%);
    transition: transform 500ms ease;
  }

  .btn-primary:hover::after,
  .btn--primary:hover::after {
    transform: translateX(100%);
  }
}
```

---

## 8. CTA Final Section (index.astro)

`.cta-final__title`, `.cta-final__body`, and the `<a>` button each get `.reveal` with delays 0ms / 150ms / 300ms.

---

## 9. Perfil + Contacto pages

Section headings and content blocks get `.reveal` class. No special stagger needed — simpler pages.

---

## Accessibility

- All animation inside `@media (prefers-reduced-motion: no-preference)`
- Outside that block: `.reveal` has no opacity/transform — elements visible immediately
- View Transitions respects `prefers-reduced-motion` natively (Astro handles it)
- No animation on focus indicators

---

## Files Changed

| File | Change |
|---|---|
| `src/layouts/BaseLayout.astro` | + `<ViewTransitions />` + reveal script |
| `src/styles/tokens.css` | + `--ease-expo-out`, `--ease-spring` |
| `src/styles/global.css` | + keyframes, reveal system, button shimmer/scale |
| `src/pages/index.astro` | + hero entrance, orb, pillar stagger, CTA reveal |
| `src/components/ServiceCard.astro` | + enhanced hover |
| `src/pages/servicios.astro` | + stagger `--reveal-delay` per card |
| `src/pages/perfil.astro` | + `.reveal` on sections |
| `src/pages/contacto.astro` | + `.reveal` on sections |

**New files:** none  
**New dependencies:** none  
**New JS:** ~0.6KB (IntersectionObserver init)

---

## Out of Scope

- Parallax (hero text slower than scroll) — too gimmicky for medical brand
- Typed/reveal text effects — distracting for this content
- GSAP or any animation library
- Cursor effects
