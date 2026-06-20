# Splash Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen intro overlay to the home page that animates the brand logo on first visit per session, then splits apart like a curtain on click, mousemove, or after 6s.

**Architecture:** A single `SplashScreen.astro` component added to `index.astro` contains all HTML, CSS (keyframes + transitions), and JS in one file. No external animation libraries — pure CSS with JS class toggling. SessionStorage gates the experience to first visit per session.

**Tech Stack:** Astro 6, CSS keyframes, CSS transitions, Web API (`sessionStorage`, `matchMedia`), Playwright (E2E tests)

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/components/SplashScreen.astro` | **Create** | Full splash component — HTML structure, CSS animations, JS logic |
| `src/pages/index.astro` | **Modify** | Import and render `<SplashScreen />` |
| `tests/e2e/public-pages.spec.ts` | **Modify** | Add 3 splash E2E tests + update h1 test to handle splash overlay |

---

## Task 1: Write failing E2E tests

**Files:**
- Modify: `tests/e2e/public-pages.spec.ts`

Add a new `describe` block at the end of the file (after the existing tests). These tests will FAIL until Task 3 is complete.

- [ ] **Step 1: Add splash test suite to `tests/e2e/public-pages.spec.ts`**

Open `tests/e2e/public-pages.spec.ts` and add this block at the end of the file, before the closing `});` of any outer describe, or as a new top-level describe:

```typescript
test.describe('Splash screen — comportamiento por sesión', () => {

  test('splash aparece en / al cargar sin sessionStorage', async ({ page }) => {
    // Ensure sessionStorage is clean (new context = clean storage)
    await page.goto('/');
    const splash = page.locator('#splash');
    await expect(splash).toBeAttached();
    // The splash panels must be covering the viewport (not display:none)
    const isHidden = await splash.evaluate((el) =>
      window.getComputedStyle(el).display === 'none'
    );
    expect(isHidden).toBe(false);
  });

  test('click en splash lo elimina visualmente', async ({ page }) => {
    await page.goto('/');
    const splash = page.locator('#splash');
    await expect(splash).toBeAttached();
    // Click anywhere on the splash
    await splash.click();
    // After exit animation (650ms) the element gets display:none
    await page.waitForTimeout(800);
    const isHidden = await splash.evaluate((el) =>
      window.getComputedStyle(el).display === 'none'
    );
    expect(isHidden).toBe(true);
  });

  test('splash no aparece si sessionStorage tiene la clave', async ({ page }) => {
    // Set the key before navigating
    await page.goto('/');
    await page.evaluate(() => sessionStorage.setItem('splash-seen', '1'));
    await page.reload();
    const splash = page.locator('#splash');
    await expect(splash).toBeAttached();
    const isHidden = await splash.evaluate((el) =>
      window.getComputedStyle(el).display === 'none'
    );
    expect(isHidden).toBe(true);
  });

});
```

- [ ] **Step 2: Run tests to verify they fail (component does not exist yet)**

```bash
npx playwright test tests/e2e/public-pages.spec.ts --grep "splash" --reporter=line
```

Expected output: 3 tests FAIL with "No element matching selector '#splash'"

---

## Task 2: Create `src/components/SplashScreen.astro`

**Files:**
- Create: `src/components/SplashScreen.astro`

The component has three sections: HTML structure, `<style>`, `<script>`. No props needed.

- [ ] **Step 1: Create the file with complete implementation**

Create `src/components/SplashScreen.astro` with this exact content:

```astro
---
/**
 * SplashScreen.astro — Intro overlay de primera visita por sesión
 *
 * Aparece en index.astro al cargar. Se oculta en sessionStorage.
 * Dismiss: click | mousemove (después de t=1.8s) | auto t=6s
 * Exit: cortina — panel izquierdo sale a la izquierda, derecho a la derecha.
 * Accesibilidad: aria-hidden, prefers-reduced-motion.
 */
---

<div id="splash" aria-hidden="true">
  <div id="splash-left"></div>
  <div id="splash-right"></div>
  <div id="splash-center">
    <div class="splash-logo-wrap">
      <svg
        class="splash-logo"
        width="88"
        height="88"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse class="splash-petal" cx="20" cy="10" rx="6"  ry="10" fill="#DCCDFF" opacity="0.9"/>
        <ellipse class="splash-petal" cx="30" cy="20" rx="10" ry="6"  fill="#C8CD91" opacity="0.9"/>
        <ellipse class="splash-petal" cx="20" cy="30" rx="7"  ry="10" fill="#F0F0E6" opacity="0.75"/>
        <ellipse class="splash-petal" cx="10" cy="20" rx="10" ry="6"  fill="#87AAAF" opacity="0.9"/>
        <circle class="splash-petal-center" cx="20" cy="20" r="3" fill="#DCCDFF"/>
      </svg>
    </div>
    <p class="splash-name">MARIA BERNARDA<br/>PACHECO</p>
    <p class="splash-role">pediatra</p>
  </div>
</div>

<style>
  /* ── Layout ── */
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
    background: var(--color-primary); /* #2D320F */
    will-change: transform;
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

  /* ── Text ── */
  .splash-name {
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: var(--font-regular);
    letter-spacing: var(--tracking-heading);
    color: var(--color-cream);
    line-height: 1.45;
    text-transform: uppercase;
    margin-top: var(--space-lg);
    margin-bottom: 0;
    opacity: 0;
  }

  .splash-role {
    font-family: var(--font-sans);
    font-size: 10px;
    font-weight: var(--font-light);
    letter-spacing: var(--tracking-label);
    color: var(--color-sage);
    text-transform: lowercase;
    margin-top: var(--space-xs);
    opacity: 0;
  }

  /* ── Logo petals — default hidden, animate when .splash--animate added ── */
  .splash-petal,
  .splash-petal-center {
    opacity: 0;
    transform-box: view-box;
    transform-origin: 50% 50%; /* = (20,20) in 40×40 viewBox */
  }

  /* ── Keyframes ── */
  @keyframes petalIn {
    from {
      opacity: 0;
      transform: rotate(45deg) scale(0.6);
    }
    to {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }
  }

  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes logoPulse {
    from { transform: scale(1); }
    to   { transform: scale(1.04); }
  }

  /* ── Entrance animations (active when .splash--animate on #splash) ── */
  #splash.splash--animate .splash-petal:nth-child(1) {
    animation: petalIn 0.5s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) 0.2s  both;
  }
  #splash.splash--animate .splash-petal:nth-child(2) {
    animation: petalIn 0.5s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) 0.32s both;
  }
  #splash.splash--animate .splash-petal:nth-child(3) {
    animation: petalIn 0.5s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) 0.44s both;
  }
  #splash.splash--animate .splash-petal:nth-child(4) {
    animation: petalIn 0.5s var(--ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) 0.56s both;
  }
  #splash.splash--animate .splash-petal-center {
    animation: petalIn 0.3s ease-out 0.68s both;
  }
  #splash.splash--animate .splash-name {
    animation: fadeSlideUp 0.4s ease-out 1.0s both;
  }
  #splash.splash--animate .splash-role {
    animation: fadeSlideUp 0.4s ease-out 1.35s both;
  }
  #splash.splash--animate .splash-logo-wrap {
    animation: logoPulse 1.2s ease-in-out 1.8s infinite alternate;
  }

  /* ── Exit animation (active when .is-exiting on #splash) ── */
  #splash-left,
  #splash-right {
    transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  }

  #splash-center {
    transition: opacity 0.25s ease-in, transform 0.25s ease-in;
  }

  #splash.is-exiting #splash-left  { transform: translateX(-100%); }
  #splash.is-exiting #splash-right { transform: translateX(100%); }
  #splash.is-exiting #splash-center {
    opacity: 0;
    transform: translate(-50%, calc(-50% - 12px));
  }

  /* ── Mobile ── */
  @media (max-width: 480px) {
    .splash-logo {
      width: 64px;
      height: 64px;
    }
    .splash-name {
      font-size: 11px;
    }
  }

  /* ── Reduced motion — skip animations, show content immediately ── */
  @media (prefers-reduced-motion: reduce) {
    #splash.splash--animate .splash-petal,
    #splash.splash--animate .splash-petal-center,
    #splash.splash--animate .splash-name,
    #splash.splash--animate .splash-role {
      animation: none;
      opacity: 1;
      transform: none;
    }

    #splash.splash--animate .splash-logo-wrap {
      animation: none;
    }

    #splash-left,
    #splash-right,
    #splash-center {
      transition: none;
    }

    #splash.is-exiting {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
</style>

<script>
  function initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return; // Not on index page

    // Already seen this session — hide immediately
    if (sessionStorage.getItem('splash-seen')) {
      splash.style.display = 'none';
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;

      splash.classList.add('is-exiting');

      // Wait for exit transition to complete before hiding
      setTimeout(function () {
        splash.style.display = 'none';
        sessionStorage.setItem('splash-seen', '1');
      }, 650);
    }

    // Start entrance animation
    splash.classList.add('splash--animate');

    // Click — dismiss immediately
    splash.addEventListener('click', dismiss);

    // Mousemove — dismiss after intro animation completes
    const mousemoveDelay = reducedMotion ? 500 : 1800;
    setTimeout(function () {
      document.addEventListener('mousemove', dismiss, { once: true });
    }, mousemoveDelay);

    // Auto-dismiss fallback at 6s
    setTimeout(dismiss, 6000);
  }

  // Runs on initial load AND after Astro View Transitions
  document.addEventListener('astro:page-load', initSplash);
</script>
```

- [ ] **Step 2: Verify file exists and has no syntax errors**

```bash
npx astro check
```

Expected: 0 errors (or only pre-existing errors unrelated to SplashScreen.astro).

---

## Task 3: Integrate SplashScreen into index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add import at the top of the frontmatter**

In `src/pages/index.astro`, inside the `---` frontmatter block, add the import after the existing imports:

```typescript
import SplashScreen from '../components/SplashScreen.astro';
```

Full updated import block (replace existing imports section):

```typescript
import BaseLayout from '../layouts/BaseLayout.astro';
import PlaceholderNotice from '../components/PlaceholderNotice.astro';
import SplashScreen from '../components/SplashScreen.astro';
import { getCollection } from 'astro:content';
import { BLOCKING_PLACEHOLDER_IDS } from '../lib/placeholders';
```

- [ ] **Step 2: Add `<SplashScreen />` as last element inside `<BaseLayout>`**

At the bottom of the template section in `src/pages/index.astro`, before the closing `</BaseLayout>` tag, add:

```astro
  <!-- SPLASH SCREEN — visible solo en primera visita por sesión -->
  <SplashScreen />
</BaseLayout>
```

The full closing of the file should look like:

```astro
  <!-- CTA FINAL -->
  <section class="cta-final" aria-labelledby="cta-final-heading">
    <div class="cta-final__content">
      <h2 id="cta-final-heading" class="cta-final__title reveal">¿TIENES DUDAS SOBRE LA SALUD DE TU BEBÉ?</h2>
      <p class="cta-final__body reveal" style="--reveal-delay: 150ms">
        Cuando estés lista, estaremos disponibles para acompañarte.
      </p>
      <a href="/contacto#canales" class="btn btn--outline-light reveal" style="--reveal-delay: 300ms">
        VER FORMAS DE CONTACTO
      </a>
    </div>
  </section>

  <!-- SPLASH SCREEN — visible solo en primera visita por sesión -->
  <SplashScreen />
</BaseLayout>
```

- [ ] **Step 3: Verify Astro builds without errors**

```bash
npx astro check
```

Expected: 0 new errors.

- [ ] **Step 4: Start dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:4321` in browser.

Verify manually:
- [ ] Splash covers full viewport with dark green background
- [ ] Logo petals animate in sequence with spring feel
- [ ] Name and "pediatra" fade/slide up after petals
- [ ] Logo pulses gently after t=1.8s
- [ ] Click anywhere → panels slide apart revealing site
- [ ] After panels close, site is fully visible and interactive
- [ ] Refreshing page → splash does NOT show again (sessionStorage set)
- [ ] Opening new tab → splash shows again (new session)

- [ ] **Step 5: Commit**

```bash
git add src/components/SplashScreen.astro src/pages/index.astro
git commit -m "feat(splash): intro overlay — curtain split with petal entrance animation"
```

---

## Task 4: Run all tests

**Files:**
- `tests/e2e/public-pages.spec.ts`

- [ ] **Step 1: Run the new splash E2E tests**

```bash
npx playwright test tests/e2e/public-pages.spec.ts --grep "splash" --reporter=line
```

Expected: 3 tests PASS.

If test `click en splash lo elimina visualmente` times out: increase `page.waitForTimeout(800)` to `1000`. The 650ms exit + some render time should fit within 800ms but Playwright CI can be slower.

- [ ] **Step 2: Run the full E2E suite to check for regressions**

```bash
npm run test:e2e
```

Expected: All previously passing tests still pass. The h1 visibility test on `/` (`toBeVisible`) continues to pass because `position:fixed` splash does not affect DOM visibility as measured by Playwright — the `<h1>` is still in the DOM and not `display:none`.

If the h1 test fails due to splash coverage:

Find the `/ — página de inicio carga con h1 del nombre` test and add a splash dismiss before the assertion:

```typescript
test('/ — página de inicio carga con h1 del nombre', async ({ page }) => {
  await page.goto('/');
  // Dismiss splash if present so we can check main content
  const splash = page.locator('#splash');
  if (await splash.isVisible()) {
    await splash.click();
    await page.waitForTimeout(800);
  }
  const h1 = page.locator('h1').first();
  await expect(h1).toBeVisible();
  const h1Text = await h1.textContent();
  expect(h1Text).toBeTruthy();
  expect(h1Text!.length).toBeGreaterThan(3);
});
```

- [ ] **Step 3: Run unit tests to confirm no regressions**

```bash
npm test
```

Expected: All unit tests pass (SplashScreen has no unit-testable logic — all behavior is E2E).

- [ ] **Step 4: Commit test updates**

```bash
git add tests/e2e/public-pages.spec.ts
git commit -m "test(e2e): add splash screen behavior tests"
```

---

## Verification Checklist

After all tasks complete:

- [ ] `#splash` element present in DOM on `/`
- [ ] Splash hidden immediately if `sessionStorage.getItem('splash-seen')` === `'1'`
- [ ] Click anywhere on splash triggers dismiss
- [ ] Dismiss: left panel exits left, right panel exits right (~550ms)
- [ ] Center content fades + moves up before panels finish (~250ms)
- [ ] After 650ms: `#splash` has `display:none` and sessionStorage key is set
- [ ] Auto-dismiss fires at 6s if no interaction
- [ ] `prefers-reduced-motion`: content shows without animation, exit is instant fade
- [ ] No regressions in existing E2E tests
- [ ] `npx astro check` passes with 0 new errors
