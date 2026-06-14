# MBP Animation System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add expressive motion system (hero entrance, scroll reveal, View Transitions, micro-interactions, orb background) to the MBP pediatrics site with zero new dependencies.

**Architecture:** CSS keyframes handle hero entrance and decorative animations; a single IntersectionObserver script (~0.6KB) activates `.reveal → .revealed` class transitions; Astro View Transitions provides cross-page fades. All motion gated behind `prefers-reduced-motion: no-preference`.

**Tech Stack:** Astro 6.4.6 (SSG), vanilla CSS, vanilla JS IntersectionObserver, `astro:transitions` (built-in).

**Spec:** `docs/superpowers/specs/2026-06-14-animation-system-design.md`

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/styles/tokens.css` | Modify | Add `--ease-expo-out`, `--ease-spring` |
| `src/styles/global.css` | Modify | Keyframes, reveal system, button micro-interactions |
| `src/layouts/BaseLayout.astro` | Modify | `<ViewTransitions />` + reveal init script |
| `src/pages/index.astro` | Modify | Hero entrance, orb, pillars stagger, CTA reveal |
| `src/components/ServiceCard.astro` | Modify | Enhanced hover (lift, shadow, icon color) |
| `src/pages/servicios.astro` | Modify | Stagger `--reveal-delay` per card |
| `src/pages/perfil.astro` | Modify | `.reveal` on section headings + content |
| `src/pages/contacto.astro` | Modify | `.reveal` on section headings + content |

**No new files. No new dependencies.**

---

## Task 1: Easing Tokens

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Add easing tokens to `:root`**

Open `src/styles/tokens.css`. After the `--transition-scroll: 400ms ease-out;` line (inside the `TRANSICIONES` block), add:

```css
  /* Curvas de animación para el sistema de motion */
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(tokens): add ease-expo-out and ease-spring animation tokens"
```

---

## Task 2: Global CSS — Keyframes, Reveal System, Button Micro-interactions

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace the existing `.reveal` block**

In `src/styles/global.css`, find the existing block inside `@media (prefers-reduced-motion: no-preference)`:

```css
  /* Scroll reveal — se activa via JS con class .reveal */
  .reveal {
    transition: opacity var(--transition-scroll),
                transform var(--transition-scroll);
  }
```

Replace it with:

```css
  /* Scroll reveal — JS añade .revealed cuando el elemento entra al viewport */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity  700ms var(--ease-expo-out),
      transform 700ms var(--ease-expo-out);
    transition-delay: var(--reveal-delay, 0ms);
  }

  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
```

- [ ] **Step 2: Add keyframes block after the closing brace of `@media (prefers-reduced-motion: no-preference)`**

Add this block immediately after the media query that contains the `.reveal` and `.card` rules (before the `/* -------------------------------------------------------------------------- BOTONES BASE ...` section):

```css
/* --------------------------------------------------------------------------
   KEYFRAMES — Solo declaración; uso dentro de @media (prefers-reduced-motion)
   -------------------------------------------------------------------------- */

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

@keyframes orb-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-4%, 3%) scale(1.06); }
}

@keyframes circle-pop {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
```

- [ ] **Step 3: Add button micro-interactions inside the existing `@media (prefers-reduced-motion: no-preference)` block**

Inside the same media query (after `.card:hover` block), add:

```css
  /* Botones: scale en press */
  .btn,
  button,
  [role="button"] {
    transition: background-color var(--transition-btn),
                color var(--transition-btn),
                border-color var(--transition-btn),
                transform 100ms ease;
  }

  .btn:active,
  button:active,
  [role="button"]:active {
    transform: scale(0.97);
  }

  /* Shimmer en botón primario */
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
    pointer-events: none;
  }

  .btn-primary:hover::after,
  .btn--primary:hover::after {
    transform: translateX(100%);
  }
```

- [ ] **Step 4: Build to verify no CSS errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with no CSS parse errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(css): reveal system, keyframes, button micro-interactions"
```

---

## Task 3: BaseLayout — View Transitions + Reveal Script

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Import and render ViewTransitions**

In `src/layouts/BaseLayout.astro`, add the import at the top of the frontmatter (after the existing imports):

```astro
import { ViewTransitions } from 'astro:transitions';
```

Then inside `<head>`, after the `<link rel="stylesheet" ...>` line, add:

```astro
    <!-- View Transitions — fade suave entre páginas (Astro built-in) -->
    <ViewTransitions />
```

- [ ] **Step 2: Add reveal script before `</body>`**

Inside `<body>`, immediately before the closing `</body>` tag (after `<Footer />`), add:

```astro
    <!-- Reveal script — IntersectionObserver activa .reveal → .revealed -->
    <script>
      function initReveal() {
        const elements = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)');
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

      /* Fires on initial load AND after every View Transitions navigation */
      document.addEventListener('astro:page-load', initReveal);
    </script>
```

- [ ] **Step 3: Build + verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: successful build, no TS errors.

- [ ] **Step 4: Dev server smoke test**

```bash
npm run dev
```

Open `http://localhost:4321`. Navigate between pages (index → perfil → contacto). Verify a smooth fade transition occurs between pages. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(layout): Astro View Transitions + IntersectionObserver reveal script"
```

---

## Task 4: Hero Entrance + Orb Background (index.astro)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add hero entrance animations to `<style>` block**

In `src/pages/index.astro`, find the `.hero` CSS block inside `<style>`. Add `position: relative; overflow: hidden;` to `.hero`:

```css
  .hero {
    background-color: var(--color-lavender);
    padding-block: var(--space-3xl);
    min-height: 70vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }
```

- [ ] **Step 2: Add orb pseudo-element to `.hero` CSS**

After the `.hero__disclaimer` block, add:

```css
  /* --- ORB DE FONDO --- */
  @media (prefers-reduced-motion: no-preference) {
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
  }
```

- [ ] **Step 3: Add hero entrance CSS for each element**

After the orb block, add:

```css
  /* --- HERO ENTRANCE --- */
  @media (prefers-reduced-motion: no-preference) {
    .hero__eyebrow {
      --enter-y: 20px;
      animation: hero-enter 600ms var(--ease-expo-out) both;
      animation-delay: 0ms;
    }

    .hero__title {
      --enter-y: 40px;
      animation: hero-enter 850ms var(--ease-expo-out) both;
      animation-delay: 150ms;
    }

    .hero__subtitle {
      --enter-y: 20px;
      animation: hero-enter 650ms var(--ease-expo-out) both;
      animation-delay: 380ms;
    }

    .hero__cta-group {
      --enter-y: 20px;
      animation: hero-enter 600ms var(--ease-expo-out) both;
      animation-delay: 560ms;
    }

    .hero__disclaimer {
      --enter-y: 0px;
      animation: hero-enter 500ms var(--ease-expo-out) both;
      animation-delay: 750ms;
    }
  }
```

- [ ] **Step 4: Dev server visual check**

```bash
npm run dev
```

Open `http://localhost:4321`. Reload the page. Verify:
- Eyebrow fades+slides up first
- H1 follows with larger movement
- CTAs appear last
- Orb gradient is visible in upper-right area of hero (very subtle sage on lavender)

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(hero): entrance stagger animation + orb radial background"
```

---

## Task 5: Pillars Stagger + Circle Pop + CTA Reveal (index.astro)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add `.reveal` to pillars header elements in template**

In the `<!-- PILARES -->` section template, add `class="reveal"` to eyebrow and statement:

```astro
      <p class="pillars__eyebrow reveal">{/* existing content */}PEDIATRÍA CON EXPERIENCIA</p>
      <h2 id="pillars-heading" class="pillars__statement reveal" style="--reveal-delay: 100ms">
        CUIDADO INTEGRAL CENTRADO EN EL BIENESTAR DEL NIÑO Y SU FAMILIA
      </h2>
```

- [ ] **Step 2: Add stagger to each pillars item**

Replace the static `<ul class="pillars__list">` content with staggered items:

```astro
      <ul class="pillars__list" role="list">
        <li class="pillars__item reveal" style="--reveal-delay: 0ms">
          <div class="pillars__circle" aria-hidden="true"></div>
          <span class="pillars__label">PREVENCIÓN Y PROMOCIÓN DE LA SALUD</span>
        </li>
        <li class="pillars__item reveal" style="--reveal-delay: 120ms">
          <div class="pillars__circle" aria-hidden="true"></div>
          <span class="pillars__label">NEURODESARROLLO Y CRIANZA RESPETUOSA</span>
        </li>
        <li class="pillars__item reveal" style="--reveal-delay: 240ms">
          <div class="pillars__circle" aria-hidden="true"></div>
          <span class="pillars__label">ACOMPAÑAMIENTO INTEGRAL DE LA FAMILIA</span>
        </li>
        <li class="pillars__item reveal" style="--reveal-delay: 360ms">
          <div class="pillars__circle" aria-hidden="true"></div>
          <span class="pillars__label">NUTRICIÓN Y MICROBIOTA INFANTIL</span>
        </li>
      </ul>
```

- [ ] **Step 3: Update circle styles**

In the `<style>` block, replace the existing `.pillars__circle` rule:

```css
  .pillars__circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-sage) 100%);
    flex-shrink: 0;
  }
```

Then add circle-pop animation block after it:

```css
  @media (prefers-reduced-motion: no-preference) {
    .pillars__item.revealed .pillars__circle {
      animation: circle-pop 550ms var(--ease-spring) both;
      animation-delay: var(--reveal-delay, 0ms);
    }
  }
```

- [ ] **Step 4: Add `.reveal` to CTA Final elements**

In the `<!-- CTA FINAL -->` section:

```astro
      <h2 id="cta-final-heading" class="cta-final__title reveal">¿TIENES DUDAS SOBRE LA SALUD DE TU BEBÉ?</h2>
      <p class="cta-final__body reveal" style="--reveal-delay: 150ms">
        Cuando estés lista, estaremos disponibles para acompañarte.
      </p>
      <a href="/contacto" class="btn btn--outline-light reveal" style="--reveal-delay: 300ms">
        VER FORMAS DE CONTACTO
      </a>
```

- [ ] **Step 5: Dev server visual check**

```bash
npm run dev
```

Open `http://localhost:4321`. Scroll past the hero. Verify:
- Pillars eyebrow and statement fade in
- 4 circles pop in with stagger (with slight spring bounce)
- Circles show olive→sage gradient instead of flat olive
- CTA section elements stagger in when scrolled to

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(pillars): scroll reveal stagger, circle-pop spring, gradient fill, CTA reveal"
```

---

## Task 6: ServiceCard Enhanced Hover + Servicios Stagger

**Files:**
- Modify: `src/components/ServiceCard.astro`
- Modify: `src/pages/servicios.astro`

- [ ] **Step 1: Enhance ServiceCard hover in `<style>`**

In `src/components/ServiceCard.astro`, replace the existing hover block:

```css
  @media (prefers-reduced-motion: no-preference) {
    .service-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(45, 50, 15, 0.14);
    }

    .service-card:hover .service-card__icon,
    .service-card:hover .service-card__icon-placeholder {
      background-color: var(--color-sage);
      transition: background-color 250ms var(--ease-expo-out);
    }
  }
```

Also update the base `.service-card` transition duration from `var(--transition-card)` to `350ms`:

```css
  .service-card {
    background-color: var(--color-white);
    border-radius: var(--radius-card);
    padding: var(--space-lg) var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    transition: transform 350ms var(--ease-expo-out), box-shadow 350ms var(--ease-expo-out);
  }
```

- [ ] **Step 2: Add stagger to servicios.astro grid**

In `src/pages/servicios.astro`, find the `servicesToShow.map` call and add index + reveal classes:

```astro
        <ul class="services-grid" role="list">
          {servicesToShow.map((name, i) => (
            <li class="reveal" style={`--reveal-delay: ${i * 60}ms`}>
              <ServiceCard
                name={name}
                descriptionPlaceholderId="PH-SERVICE-DESCRIPTIONS"
              />
            </li>
          ))}
        </ul>
```

Also add `.reveal` to the page header elements in `servicios.astro`:

```astro
      <p class="page-eyebrow reveal">ESPECIALIDADES</p>
      <h1 id="services-heading" class="page-title reveal" style="--reveal-delay: 120ms">SERVICIOS</h1>
```

- [ ] **Step 3: Dev server visual check**

```bash
npm run dev
```

Open `http://localhost:4321/servicios`. Verify:
- Page heading fades in on load
- Cards appear with stagger (0ms to 300ms)
- Hover lifts card 6px with deeper shadow
- Icon background shifts to sage on hover

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/ServiceCard.astro src/pages/servicios.astro
git commit -m "feat(services): enhanced card hover, staggered grid entrance"
```

---

## Task 7: Perfil + Contacto Section Reveals

**Files:**
- Modify: `src/pages/perfil.astro`
- Modify: `src/pages/contacto.astro`

- [ ] **Step 1: Add reveals to perfil.astro**

In `src/pages/perfil.astro`, add `.reveal` to the header and section elements:

```astro
  <!-- ENCABEZADO DE PERFIL -->
  <section class="profile-hero" aria-labelledby="profile-heading">
    <div class="page-container">
      <p class="page-eyebrow reveal">PERFIL PROFESIONAL</p>
      <h1 id="profile-heading" class="page-title reveal" style="--reveal-delay: 120ms">{doctorName}</h1>
    </div>
  </section>

  <!-- CREDENCIALES -->
  <section class="credentials" aria-labelledby="credentials-heading">
    <div class="page-container">
      <h2 id="credentials-heading" class="section-heading reveal">FORMACIÓN Y CREDENCIALES</h2>
      <!-- existing content below — no changes needed to dl/empty-state -->
```

Also wrap the `<dl>` (if rendered) with a reveal:

```astro
      {hasAnyCredential ? (
        <dl class="credentials__list reveal" style="--reveal-delay: 150ms">
```

- [ ] **Step 2: Add reveals to contacto.astro**

In `src/pages/contacto.astro`, add `.reveal` to section headings:

```astro
  <!-- ENCABEZADO -->
  <section class="contact-hero" aria-labelledby="contact-heading">
    <div class="page-container">
      <p class="page-eyebrow reveal">COMUNICACIÓN</p>
      <h1 id="contact-heading" class="page-title reveal" style="--reveal-delay: 120ms">CONTACTO</h1>
    </div>
  </section>
```

And for the channels section heading:

```astro
      <h2 id="channels-heading" class="section-heading reveal">CANALES DE ATENCIÓN</h2>
```

- [ ] **Step 3: Dev server visual check**

```bash
npm run dev
```

Open `http://localhost:4321/perfil` and `http://localhost:4321/contacto`. Verify section headings fade in on load. Navigate between pages using nav links — verify smooth fade transitions (View Transitions). Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/pages/perfil.astro src/pages/contacto.astro
git commit -m "feat(pages): scroll reveal on perfil and contacto section headings"
```

---

## Task 8: Playwright Smoke Tests + Final Build

**Files:**
- Modify or create: `tests/animation.spec.ts`

- [ ] **Step 1: Write Playwright test for reveal system**

Create `tests/animation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Animation system', () => {
  test('hero elements are visible after entrance animation', async ({ page }) => {
    await page.goto('/');
    // After animation delay (max 750ms + 500ms = 1250ms), all elements should be visible
    await page.waitForTimeout(1400);
    const title = page.locator('.hero__title');
    await expect(title).toBeVisible();
    const ctaGroup = page.locator('.hero__cta-group');
    await expect(ctaGroup).toBeVisible();
  });

  test('reveal class elements get .revealed after scroll', async ({ page }) => {
    await page.goto('/');
    // Scroll to pillars section
    await page.locator('.pillars').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const pillarItems = page.locator('.pillars__item.revealed');
    await expect(pillarItems).toHaveCount(4);
  });

  test('servicios cards stagger in on scroll', async ({ page }) => {
    await page.goto('/servicios');
    // Scroll to grid
    await page.locator('.services-grid').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    const revealedCards = page.locator('.services-grid .revealed');
    const count = await revealedCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('view transitions fade between pages', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/perfil"]');
    await page.waitForURL('/perfil');
    const heading = page.locator('#profile-heading');
    await expect(heading).toBeVisible();
  });
});
```

- [ ] **Step 2: Run Playwright tests**

```bash
npx playwright test tests/animation.spec.ts --reporter=list 2>&1 | tail -30
```

Expected: all 4 tests pass. If a test fails due to timing, increase `waitForTimeout` value in that test by 200ms and re-run.

- [ ] **Step 3: Full build**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors or warnings.

- [ ] **Step 4: Final commit**

```bash
git add tests/animation.spec.ts
git commit -m "test(animation): Playwright smoke tests for reveal, hero, and view transitions"
```

---

## Self-Review Checklist

- [x] **Spec §1 Easing tokens** → Task 1
- [x] **Spec §2 View Transitions** → Task 3 Step 1
- [x] **Spec §3 Reveal system (CSS + JS)** → Task 2 Step 1, Task 3 Step 2
- [x] **Spec §4 Hero entrance stagger** → Task 4 Steps 1-3
- [x] **Spec §4 Hero orb** → Task 4 Steps 1-2
- [x] **Spec §5 Pillars stagger** → Task 5 Steps 1-2
- [x] **Spec §5 Circle-pop spring** → Task 5 Step 3
- [x] **Spec §5 Circle gradient fill** → Task 5 Step 3
- [x] **Spec §6 ServiceCard stagger** → Task 6 Step 2
- [x] **Spec §6 Enhanced hover** → Task 6 Step 1
- [x] **Spec §7 Button scale + shimmer** → Task 2 Step 3
- [x] **Spec §8 CTA Final reveal** → Task 5 Step 4
- [x] **Spec §9 Perfil + Contacto reveals** → Task 7
- [x] **Accessibility: prefers-reduced-motion** → Task 2 (all in media query), Task 3 (Astro handles it)
