# Wind Petals Splash — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 12 animated wind-blown SVG petals, radial gradient background, and SVG noise texture to the splash screen in `preview-fullscreen.html`.

**Architecture:** Three edit zones in one standalone HTML file — CSS (gradient + petal base styles), HTML (noise SVG element inside `#splash`), and JS (petal factory + GSAP animation integrated into existing splash IIFE). GSAP loads asynchronously via CDN, so petal init polls `window.gsap` before starting.

**Tech Stack:** GSAP 3.12.5 (already in file, dynamic CDN), SVG `feTurbulence`, CSS `radial-gradient`

**Note:** `preview-fullscreen.html` lives at `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — outside the git repo. All edits go to that file. Git commits in this plan track only the planning docs in the repo.

---

### Task 1: CSS — radial gradient + base styles for petals and noise

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html:466`
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html:486`

- [ ] **Step 1: Replace curtain background with radial gradient**

Find line 466 — the single line starting with `#splash-left,#splash-right{`:

```
#splash-left,#splash-right{position:absolute;top:0;width:50%;height:100%;background:#3d4728;will-change:transform;transition:transform .8s cubic-bezier(.4,0,.2,1)}
```

Replace that entire line with:

```
#splash-left,#splash-right{position:absolute;top:0;width:50%;height:100%;background:radial-gradient(ellipse at center,#4e6030 0%,#3d4728 45%,#252d10 100%);will-change:transform;transition:transform .8s cubic-bezier(.4,0,.2,1)}
```

- [ ] **Step 2: Add base styles for petal elements and noise SVG**

Find line 486 — the `@media(prefers-reduced-motion:reduce){...}` line for splash. It ends with `}`. Immediately AFTER that closing `}` (still before `</style>` on line 487), append on a new line:

```css
.sp-wind-petal{position:absolute;pointer-events:none;z-index:2;will-change:transform,opacity}
#splash-noise{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
```

- [ ] **Step 3: Verify gradient in browser**

Open `C:\Users\USUARIO\Downloads\preview-fullscreen.html` in browser.
In DevTools console run: `sessionStorage.clear()` then reload the page.

Expected: splash background shows gradient (lighter center, darker edges) instead of flat green. Logo + text unchanged.

---

### Task 2: HTML — SVG noise texture inside `#splash`

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html:1696`

- [ ] **Step 1: Insert noise SVG between curtain divs and #splash-center**

Find lines 1695–1697 (inside `<div id="splash">`):

```html
  <div id="splash-left"></div>
  <div id="splash-right"></div>
  <div id="splash-center">
```

Insert the noise SVG between `#splash-right` and `#splash-center` — result:

```html
  <div id="splash-left"></div>
  <div id="splash-right"></div>
  <svg id="splash-noise" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" style="opacity:.07">
    <filter id="noise-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#noise-filter)"/>
  </svg>
  <div id="splash-center">
```

- [ ] **Step 2: Verify noise texture in browser**

Reload with cleared sessionStorage. On the dark gradient background, a very subtle grain/paper texture should be barely visible at ~7% opacity. It should not interfere with logo readability.

---

### Task 3: JS — petal factory + GSAP animation + dismiss integration

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html:1710–1737`

The entire `<script>` block currently (lines 1710–1737):

```html
<script>
(function(){
  var splash = document.getElementById('splash');
  if (!splash) return;
  if (sessionStorage.getItem('splash-seen')) { splash.style.display='none'; return; }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dismissed = false;
  var mouseReg = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    if (mouseReg) document.removeEventListener('mousemove', dismiss);
    splash.classList.add('sp-out');
    setTimeout(function() {
      splash.style.display = 'none';
      sessionStorage.setItem('splash-seen', '1');
    }, 900);
  }
  splash.classList.add('sp-go');
  splash.addEventListener('click', dismiss, { once: true });
  setTimeout(function() {
    if (dismissed) return;
    mouseReg = true;
    document.addEventListener('mousemove', dismiss, { once: true });
  }, reduced ? 800 : 3800);
  setTimeout(dismiss, 9000);
})();
</script>
```

- [ ] **Step 1: Replace the entire `<script>` block with the enhanced version**

Replace lines 1710–1737 (`<script>` through `</script>`) with:

```html
<script>
function initWindPetals(container) {
  var configs = [
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4b0e8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4b0e8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4b0e8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4d8a8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4d8a8' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z', fill: '#8aaa68' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z', fill: '#8aaa68' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z', fill: '#8aaa68' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z', fill: '#8aaa68' },
    { path: 'M6,1 L11,5 L8,11 L3,9 L1,4 Z', fill: '#4d8282' },
    { path: 'M6,1 L11,5 L8,11 L3,9 L1,4 Z', fill: '#4d8282' },
    { path: 'M6,1 L11,5 L8,11 L3,9 L1,4 Z', fill: '#4d8282' }
  ];
  var sizes = [10, 12, 14, 16, 18];
  var svgNS = 'http://www.w3.org/2000/svg';

  configs.forEach(function(cfg, i) {
    var size = sizes[Math.floor(Math.random() * sizes.length)];
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 12 12');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.className = 'sp-wind-petal';
    var p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', cfg.path);
    p.setAttribute('fill', cfg.fill);
    svg.appendChild(p);
    container.appendChild(svg);

    gsap.delayedCall(i * 0.35, function() { animateWindPetal(svg); });
  });
}

function animateWindPetal(el) {
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var startX = Math.random() * vw;
  var driftX = (Math.random() - 0.5) * 280;
  var duration = 5 + Math.random() * 4;
  gsap.set(el, {
    x: startX,
    y: -20 - Math.random() * 40,
    rotation: Math.random() * 360,
    opacity: 0.30 + Math.random() * 0.35
  });
  gsap.to(el, {
    y: vh + 50,
    x: startX + driftX,
    rotation: '+=' + (180 + Math.random() * 180),
    duration: duration,
    ease: 'none',
    onComplete: function() { animateWindPetal(el); }
  });
}

(function(){
  var splash = document.getElementById('splash');
  if (!splash) return;
  if (sessionStorage.getItem('splash-seen')) { splash.style.display='none'; return; }
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dismissed = false;
  var mouseReg = false;

  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    if (mouseReg) document.removeEventListener('mousemove', dismiss);
    var windPetals = splash.querySelectorAll('.sp-wind-petal');
    if (windPetals.length && window.gsap) {
      gsap.to(windPetals, { opacity: 0, duration: 0.4, ease: 'power2.in' });
    }
    splash.classList.add('sp-out');
    setTimeout(function() {
      splash.style.display = 'none';
      sessionStorage.setItem('splash-seen', '1');
    }, 900);
  }

  splash.classList.add('sp-go');
  splash.addEventListener('click', dismiss, { once: true });

  if (!reduced) {
    function tryInitPetals() {
      if (window.gsap) {
        initWindPetals(splash);
      } else {
        setTimeout(tryInitPetals, 100);
      }
    }
    tryInitPetals();
  }

  setTimeout(function() {
    if (dismissed) return;
    mouseReg = true;
    document.addEventListener('mousemove', dismiss, { once: true });
  }, reduced ? 800 : 3800);
  setTimeout(dismiss, 9000);
})();
</script>
```

- [ ] **Step 2: Verify petals in browser**

Clear sessionStorage in console and reload. Expected behavior:
- 12 small abstract petals (teardrops, curved leaves, angular fragments) appear and fall diagonally across the splash
- Colors: lila (`#c4b0e8`), sage (`#8aaa68`), light green (`#c4d8a8`), teal (`#4d8282`)
- Movement: diagonal fall with side drift, rotating as they fall
- Petals recycle at top when they exit bottom
- Logo and name text remain above all petals (unobstructed)

- [ ] **Step 3: Verify dismiss behavior**

Click anywhere on the splash. Expected:
- Petals fade to opacity 0 simultaneously with the curtain exit
- Curtains slide left/right
- Splash disappears revealing the main page
- Reloading immediately shows no splash (sessionStorage gate works)

- [ ] **Step 4: Verify reduced-motion**

In DevTools: Rendering panel → Enable "Emulate CSS media feature prefers-reduced-motion: reduce", then clear sessionStorage and reload.
Expected: splash shows with gradient + noise texture but NO petals appear and NO petal animation runs.

---

### Task 4: Commit plan doc to git

**Files:**
- Commit: `docs/superpowers/plans/2026-06-19-wind-petals-splash.md`

- [ ] **Step 1: Commit the plan doc**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add docs/superpowers/plans/2026-06-19-wind-petals-splash.md && git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "docs(plan): wind petals splash implementation plan"
```

---

## Self-Review Checklist

- [x] Gradient on both curtain panels: Task 1 Step 1
- [x] SVG noise texture: Task 2 Step 1
- [x] 12 petals, 3 shape variants, 4 brand colors: Task 3 Step 1 (`configs` array — 5 teardrops + 4 leaf + 3 angular)
- [x] Sizes 10–18px from `sizes` array: Task 3 Step 1
- [x] Opacity 0.30–0.65: Task 3 Step 1 `gsap.set` call
- [x] Diagonal fall + drift ±140px: Task 3 Step 1 `animateWindPetal`
- [x] Duration 5–9s: Task 3 Step 1 `duration = 5 + Math.random() * 4`
- [x] Stagger 0.35s per petal: Task 3 Step 1 `gsap.delayedCall(i * 0.35, ...)`
- [x] Recycle on exit: Task 3 Step 1 `onComplete: function() { animateWindPetal(el); }`
- [x] Fade-out on dismiss: Task 3 Step 1 `dismiss()` function
- [x] GSAP async guard (polling): Task 3 Step 1 `tryInitPetals()`
- [x] prefers-reduced-motion: Task 3 Step 4 (no petals created when `reduced === true`)
- [x] Scope: only `preview-fullscreen.html` — no Astro project changes
