# Service Detail Modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centered GSAP-animated overlay modal that shows each service's detailed description on hover (desktop) or tap (mobile) within the Servicios page.

**Architecture:** Single `#svc-modal` DOM element injected at body-end by JS, reused for all 6 services. `SERVICES` data object holds content per index. `openServiceModal(idx)` / `closeServiceModal()` added to `MBPAnimations`. Desktop: mouseenter/mouseleave with 200ms debounce to let cursor travel card→modal. Mobile: click toggle detected via `matchMedia('(hover: none)')`.

**Tech Stack:** Vanilla JS ES5, GSAP 3.12.5 (already loaded), single HTML file `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — no build step.

---

### Task 1: Add CSS for modal and backdrop

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — inside `<style>` block, before `</style>` on line 82

- [ ] **Step 1: Insert CSS before `</style>`**

Find `</style>` (line 82) and insert immediately before it:

```css
/* ── SERVICE MODAL ─────────────────────────────────── */
#svc-backdrop{position:fixed;inset:0;background:rgba(45,40,35,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);z-index:309;opacity:0;pointer-events:none}
#svc-backdrop.open{pointer-events:auto}
#svc-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.85);z-index:310;width:90%;max-width:520px;background:#fafaf8;border-radius:16px;padding:32px;box-shadow:0 24px 64px rgba(0,0,0,.18);opacity:0;pointer-events:none}
#svc-modal.open{pointer-events:auto}
#svc-modal-header{display:flex;align-items:flex-start;gap:18px;margin-bottom:18px}
#svc-modal-icon{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}
#svc-modal-title{font-family:'Cormorant Garamond',serif;font-size:clamp(20px,3vw,26px);font-weight:400;color:#2c2c2c;line-height:1.15;flex:1;margin-top:6px}
#svc-modal-close{background:none;border:none;cursor:pointer;font-size:18px;color:#aaa;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;flex-shrink:0;font-family:'Jost',sans-serif;line-height:1}
#svc-modal-close:hover{color:#2c2c2c}
#svc-modal-divider{height:1px;margin-bottom:20px}
#svc-modal-desc{font-family:'Jost',sans-serif;font-size:14px;font-weight:300;color:#5a5858;line-height:1.75;margin:0}
@media(max-width:800px){#svc-modal{padding:24px;width:calc(100% - 32px)}}
```

- [ ] **Step 2: Open in browser, verify no visual breakage**

Open `preview-fullscreen.html`. No layout shifts. DevTools Console: no CSS errors.

---

### Task 2: Add service data object and modal HTML injection

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — inside the `MBPAnimations` IIFE, right after `'use strict';` on line 726

- [ ] **Step 1: Insert SERVICES data object after `'use strict';`**

Find `'use strict';` (line 726) and insert immediately after it:

```js
// ── Service content data ───────────────────────────────
var SERVICES = {
  0: {
    title: 'Consulta pediátrica general',
    color: '#9878cc', bg: '#ede8f5',
    svgPaths: '<path d="M6 3H18"/><path d="M6 3V7C6 10 18 10 18 7V3"/><path d="M12 10V18"/><circle cx="12" cy="20" r="2"/>',
    desc: 'Evaluación médica integral del niño desde el nacimiento hasta la adolescencia. Diagnóstico y tratamiento de enfermedades agudas y crónicas, seguimiento del estado general de salud y orientación continua a la familia.'
  },
  1: {
    title: 'Patología respiratoria',
    color: '#6a8c50', bg: '#e0e8d0',
    svgPaths: '<path d="M12 3V21"/><path d="M12 7C10 7 6 9 6 14C6 17.5 7.5 20 10.5 20H12V7"/><path d="M12 7C14 7 18 9 18 14C18 17.5 16.5 20 13.5 20H12V7"/><path d="M9 11C8 12.5 7.5 14 7.5 15.5"/><path d="M15 11C16 12.5 16.5 14 16.5 15.5"/>',
    desc: 'Diagnóstico y manejo de enfermedades del sistema respiratorio: asma, bronquitis recurrente, neumonía, rinitis alérgica y sinusitis. Atención de crisis agudas y planificación del tratamiento y seguimiento a largo plazo.'
  },
  2: {
    title: 'Conducta y desarrollo',
    color: '#9878cc', bg: '#ede8f5',
    svgPaths: '<path d="M12 4C9 4 6.5 6 6.5 9C6.5 10.8 7.4 12.3 8.8 13"/><path d="M12 4C15 4 17.5 6 17.5 9C17.5 10.8 16.6 12.3 15.2 13"/><path d="M6.5 9C5 9 4 10 4 11.5C4 13 5 14 6.5 14"/><path d="M17.5 9C19 9 20 10 20 11.5C20 13 19 14 17.5 14"/><path d="M6.5 14C6.5 17 8.5 19.5 11 20"/><path d="M17.5 14C17.5 17 15.5 19.5 13 20"/><path d="M11 20H13"/><path d="M12 4V6"/>',
    desc: 'Evaluación del desarrollo psicomotor, cognitivo y emocional del niño. Atención de TDAH, dificultades de aprendizaje y trastornos del comportamiento y del sueño, con acompañamiento respetuoso e integral a la familia.'
  },
  3: {
    title: 'Nutrición pediátrica',
    color: '#c07850', bg: '#fce8d8',
    svgPaths: '<path d="M12 7C9 7 6 9.5 6 13.5C6 17.5 8.5 21 12 21C15.5 21 18 17.5 18 13.5C18 9.5 15 7 12 7Z"/><path d="M12 7V5"/><path d="M14 4C15.5 3 17 3.5 17 3.5C17 3.5 15 6 12 7"/>',
    desc: 'Evaluación nutricional personalizada para cada etapa del crecimiento. Orientación sobre alimentación complementaria, corrección de deficiencias, manejo de obesidad infantil y promoción de hábitos alimentarios saludables desde la primera infancia.'
  },
  4: {
    title: 'Atención al recién nacido',
    color: '#9878cc', bg: '#ede8f5',
    svgPaths: '<path d="M9 3H15V9H21V15H15V21H9V15H3V9H9Z"/>',
    desc: 'Valoración integral del neonato en los primeros días y semanas de vida. Control de peso, alimentación, detección de ictericia y otras alteraciones tempranas, con acompañamiento cercano y orientación a los padres.'
  },
  5: {
    title: 'Control de crecimiento',
    color: '#6a8c50', bg: '#e0e8d0',
    svgPaths: '<path d="M3 20H21"/><path d="M3 20V3"/><rect x="6" y="13" width="3" height="7" rx="1"/><rect x="11" y="9" width="3" height="11" rx="1"/><rect x="16" y="5" width="3" height="15" rx="1"/>',
    desc: 'Monitoreo periódico del crecimiento físico, cognitivo y emocional mediante curvas de desarrollo estandarizadas. Detección oportuna de desviaciones y seguimiento longitudinal del bienestar integral del niño.'
  }
};

// ── Modal close timer (hover debounce) ─────────────────
var _svcCloseTimer = null;
```

- [ ] **Step 2: Add injectModal method to MBPAnimations object**

Inside the `window.MBPAnimations = { ... }` object (before `ready: false`), add as the first method:

```js
injectModal: function() {
  var bd = document.createElement('div');
  bd.id = 'svc-backdrop';
  bd.setAttribute('aria-hidden', 'true');

  var modal = document.createElement('div');
  modal.id = 'svc-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'svc-modal-title');
  modal.innerHTML = [
    '<div id="svc-modal-header">',
      '<div id="svc-modal-icon" aria-hidden="true">',
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
        ' stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" id="svc-modal-svg"></svg>',
      '</div>',
      '<h2 id="svc-modal-title"></h2>',
      '<button id="svc-modal-close" aria-label="Cerrar">&#x2715;</button>',
    '</div>',
    '<div id="svc-modal-divider"></div>',
    '<p id="svc-modal-desc"></p>'
  ].join('');

  document.body.appendChild(bd);
  document.body.appendChild(modal);
},
```

- [ ] **Step 3: Call injectModal from init()**

Inside `init: function()`, add `this.injectModal();` as the first line (before `gsap.registerPlugin(ScrollTrigger)`):

```js
init: function() {
  this.injectModal();           // ← add this line
  gsap.registerPlugin(ScrollTrigger);
  this.ready = true;
  // ...rest unchanged
```

- [ ] **Step 4: Open in browser, verify no console errors**

Open `preview-fullscreen.html`. Open DevTools → Elements. Verify `#svc-backdrop` and `#svc-modal` appear at the bottom of `<body>`. Console: no errors.

---

### Task 3: Add openServiceModal and closeServiceModal methods

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — inside `window.MBPAnimations` object

- [ ] **Step 1: Add openServiceModal method**

After the `injectModal` method (before `init`), add:

```js
openServiceModal: function(idx) {
  var svc = SERVICES[idx];
  if (!svc) return;

  // Cancel any pending close
  if (_svcCloseTimer) { clearTimeout(_svcCloseTimer); _svcCloseTimer = null; }

  // Populate content
  var icon  = document.getElementById('svc-modal-icon');
  var svg   = document.getElementById('svc-modal-svg');
  var title = document.getElementById('svc-modal-title');
  var div   = document.getElementById('svc-modal-divider');
  var desc  = document.getElementById('svc-modal-desc');
  var modal = document.getElementById('svc-modal');
  var bd    = document.getElementById('svc-backdrop');

  if (!modal || !bd) return;

  icon.style.background = svc.bg;
  svg.setAttribute('stroke', svc.color);
  svg.innerHTML = svc.svgPaths;
  title.textContent = svc.title;
  div.style.background = svc.color;
  div.style.opacity = '0.35';
  desc.textContent = svc.desc;

  // Reset state
  gsap.set(modal, { opacity: 0, scale: 0.85 });
  gsap.set(bd,    { opacity: 0 });
  modal.classList.add('open');
  bd.classList.add('open');

  // Move focus to close button
  var closeBtn = document.getElementById('svc-modal-close');

  // Animate in
  var tl = gsap.timeline({ onComplete: function() { if (closeBtn) closeBtn.focus(); } });
  tl.to(bd,    { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0);
  tl.to(modal, { opacity: 1, scale: 1, duration: 0.32, ease: 'power3.out' }, 0);
  tl.from([icon, title, desc], { opacity: 0, y: 8, duration: 0.3, ease: 'power2.out', stagger: 0.06 }, 0.1);
},
```

- [ ] **Step 2: Add closeServiceModal method**

Immediately after `openServiceModal`, add:

```js
closeServiceModal: function() {
  var modal = document.getElementById('svc-modal');
  var bd    = document.getElementById('svc-backdrop');
  if (!modal || !modal.classList.contains('open')) return;

  var tl = gsap.timeline({
    onComplete: function() {
      modal.classList.remove('open');
      bd.classList.remove('open');
      gsap.set(modal, { scale: 0.85, opacity: 0 });
      gsap.set(bd, { opacity: 0 });
    }
  });
  tl.to(modal, { opacity: 0, scale: 0.88, duration: 0.2, ease: 'power2.in' }, 0);
  tl.to(bd,    { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);
},
```

- [ ] **Step 3: Verify methods exist**

Open DevTools Console and run:
```js
typeof MBPAnimations.openServiceModal   // "function"
typeof MBPAnimations.closeServiceModal  // "function"
```

---

### Task 4: Add data-service attributes to article cards

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — the 6 `<article>` elements in `#page-servicios`

- [ ] **Step 1: Add data-service and cursor to each article**

Find each `<article style="flex:1 1 300px;...` in `#page-servicios` and add `data-service="N" style="...cursor:pointer"`.

**Card 0** (Consulta pediátrica general, ~line 222):
```html
<article data-service="0" style="flex:1 1 300px;background:#fafaf8;border:1px solid #e8e0d4;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:260px;cursor:pointer;">
```

**Card 1** (Patología respiratoria, ~line 241):
```html
<article data-service="1" style="flex:1 1 300px;background:#fafaf8;border:1px solid #e8e0d4;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:260px;cursor:pointer;">
```

**Card 2** (Conducta y desarrollo, ~line 260):
```html
<article data-service="2" style="flex:1 1 300px;background:#fafaf8;border:1px solid #e8e0d4;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:260px;cursor:pointer;">
```

**Card 3** (Nutrición pediátrica, ~line 279):
```html
<article data-service="3" style="flex:1 1 300px;background:#fafaf8;border:1px solid #e8e0d4;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:260px;cursor:pointer;">
```

**Card 4** (Atención al recién nacido, ~line 298):
```html
<article data-service="4" style="flex:1 1 300px;background:#fafaf8;border:1px solid #e8e0d4;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:260px;cursor:pointer;">
```

**Card 5** (Control de crecimiento, ~line 317):
```html
<article data-service="5" style="flex:1 1 300px;background:#fafaf8;border:1px solid #e8e0d4;border-radius:12px;padding:24px;display:flex;flex-direction:column;gap:16px;min-width:260px;cursor:pointer;">
```

- [ ] **Step 2: Verify in DevTools**

Open browser → DevTools → Console:
```js
document.querySelectorAll('#page-servicios article[data-service]').length  // 6
```

---

### Task 5: Wire up hover and click events in initMicro

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html` — inside `initMicro` method

- [ ] **Step 1: Detect touch device and wire events**

Find the existing card hover lift block inside `initMicro` (~line 1027):

```js
// ── Service card hover lift ────────────────────────────
document.querySelectorAll('#page-servicios article').forEach(function(card) {
  card.addEventListener('mouseenter', function() {
    gsap.to(card, { y:-6, boxShadow:'0 12px 32px rgba(45,50,15,0.14)', duration:0.28, ease:'power2.out' });
  });
  card.addEventListener('mouseleave', function() {
    gsap.to(card, { y:0, boxShadow:'0 0px 0px rgba(45,50,15,0)', duration:0.22, ease:'power2.inOut' });
  });
});
```

Replace the **entire block** with:

```js
// ── Service card hover lift + modal trigger ────────────
var isTouch = window.matchMedia('(hover: none)').matches;
var modal   = document.getElementById('svc-modal');
var self    = MBPAnimations;

document.querySelectorAll('#page-servicios article[data-service]').forEach(function(card) {
  var idx = parseInt(card.getAttribute('data-service'), 10);

  if (!isTouch) {
    // Desktop: hover lift + modal on mouseenter, debounced close on mouseleave
    card.addEventListener('mouseenter', function() {
      gsap.to(card, { y:-6, boxShadow:'0 12px 32px rgba(45,50,15,0.14)', duration:0.28, ease:'power2.out' });
      self.openServiceModal(idx);
    });
    card.addEventListener('mouseleave', function() {
      gsap.to(card, { y:0, boxShadow:'0 0px 0px rgba(45,50,15,0)', duration:0.22, ease:'power2.inOut' });
      _svcCloseTimer = setTimeout(function() { self.closeServiceModal(); }, 200);
    });
  } else {
    // Mobile: click to open, no hover lift
    card.addEventListener('click', function() {
      self.openServiceModal(idx);
    });
  }
});

// Desktop: hovering the modal cancels the close timer
if (!isTouch && modal) {
  modal.addEventListener('mouseenter', function() {
    if (_svcCloseTimer) { clearTimeout(_svcCloseTimer); _svcCloseTimer = null; }
  });
  modal.addEventListener('mouseleave', function() {
    _svcCloseTimer = setTimeout(function() { self.closeServiceModal(); }, 200);
  });
}
```

- [ ] **Step 2: Wire close button and backdrop**

Find the end of `initMicro` (before the closing `},`) and add:

```js
// ── Modal close button and backdrop ───────────────────
var closeBtn = document.getElementById('svc-modal-close');
var backdrop = document.getElementById('svc-backdrop');
if (closeBtn) {
  closeBtn.addEventListener('click', function() { MBPAnimations.closeServiceModal(); });
}
if (backdrop) {
  backdrop.addEventListener('click', function() { MBPAnimations.closeServiceModal(); });
}
```

- [ ] **Step 3: Wire Escape key**

Find `document.addEventListener('keydown', function(e) {` (~line 702) and add the modal close:

```js
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMenu();
    MBPAnimations.closeServiceModal();   // ← add this line
  }
});
```

- [ ] **Step 4: Manual test — desktop hover**

Open `preview-fullscreen.html`. Navigate to Servicios. Hover over any service card:
- Card lifts (y: -6px, shadow)
- Backdrop fades in (dark semi-transparent)
- Modal scales in from center with service icon, title, description
- Moving mouse from card to modal keeps it open
- Moving mouse away from modal closes it after ~200ms
- Pressing Escape closes modal

- [ ] **Step 5: Manual test — mobile simulation**

In DevTools, toggle device toolbar (mobile simulation). Navigate to Servicios. Tap a card:
- Modal opens
- Tap `✕` → modal closes
- Tap backdrop → modal closes
- No hover effects on cards

- [ ] **Step 6: Manual test — all 6 services**

Open each service card. Verify correct title, icon color, and description for all 6 entries.

---

### Task 6: Final commit

- [ ] **Step 1: Commit the plan doc**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add "docs/superpowers/plans/2026-06-19-service-detail-modal.md"
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "docs(plan): service detail modal implementation plan"
```

> Note: `preview-fullscreen.html` lives in `Downloads\` outside the project git repo — track it manually if needed or copy into `src/` after verification.
