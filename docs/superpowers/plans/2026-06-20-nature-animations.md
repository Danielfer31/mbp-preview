# Nature Animations — Flores, Mariposas y Abejas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer el splash screen con 30 elementos animados (22 flores + 5 mariposas + 3 abejas) y agregar 5 elementos ambientales sutiles al nav header.

**Architecture:** Todos los cambios están en un único archivo HTML. Se extiende `initWindPetals()` para soportar configs multi-path, se agregan dos funciones de animación (`animateButterfly`, `animateBee`), y se agrega el método `initNavDecorations()` a `MBPAnimations`.

**Tech Stack:** Vanilla JS, GSAP 3.12.5 (ya cargado condicionalmente), SVG inline.

---

## File Map

| Archivo | Cambio |
|---------|--------|
| `C:\Users\USUARIO\Downloads\preview-fullscreen.html` | Único archivo — 4 secciones modificadas |

Secciones modificadas (por línea aproximada):
- **L2026–2060:** `initWindPetals()` — expandir configs + soporte multi-path
- **L2062–2083:** Agregar `animateButterfly()` y `animateBee()` después de `animateWindPetal()`
- **L1569–1576:** `MBPAnimations.init()` — agregar llamada a `initNavDecorations()`
- **L1945–1970:** Después de `initDecorative()` — agregar método `initNavDecorations()`

---

## Task 1: Expandir `initWindPetals()` — 12 → 30 configs, soporte multi-path

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\preview-fullscreen.html` (función `initWindPetals`, líneas ~2026–2061)

- [ ] **Step 1: Localizar y reemplazar la función `initWindPetals` completa**

Reemplazar desde `function initWindPetals(container) {` hasta el cierre `}` de la función (antes de `function animateWindPetal`).

Nuevo código completo:

```javascript
function initWindPetals(container) {
  var configs = [
    // ── Flores existentes (12) ────────────────────────────
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4b0e8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4b0e8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4b0e8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4d8a8' },
    { path: 'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill: '#c4d8a8' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z',  fill: '#8aaa68' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z',  fill: '#8aaa68' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z',  fill: '#8aaa68' },
    { path: 'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z',  fill: '#8aaa68' },
    { path: 'M6,1 L11,5 L8,11 L3,9 L1,4 Z',        fill: '#4d8282' },
    { path: 'M6,1 L11,5 L8,11 L3,9 L1,4 Z',        fill: '#4d8282' },
    { path: 'M6,1 L11,5 L8,11 L3,9 L1,4 Z',        fill: '#4d8282' },
    // ── Flores nuevas — pétalo elongado (5) ──────────────
    { path: 'M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z', fill: '#9878cc' },
    { path: 'M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z', fill: '#9878cc' },
    { path: 'M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z', fill: '#9878cc' },
    { path: 'M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z', fill: '#c4b0e8' },
    { path: 'M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z', fill: '#c4b0e8' },
    // ── Flores nuevas — lágrima (5) ───────────────────────
    { path: 'M6,12 C2,10 1,5 6,0 C11,5 10,10 6,12 Z', fill: '#4d8282' },
    { path: 'M6,12 C2,10 1,5 6,0 C11,5 10,10 6,12 Z', fill: '#4d8282' },
    { path: 'M6,12 C2,10 1,5 6,0 C11,5 10,10 6,12 Z', fill: '#8aaa68' },
    { path: 'M6,12 C2,10 1,5 6,0 C11,5 10,10 6,12 Z', fill: '#8aaa68' },
    { path: 'M6,12 C2,10 1,5 6,0 C11,5 10,10 6,12 Z', fill: '#c4d8a8' },
    // ── Mariposas (5) ────────────────────────────────────
    { type: 'butterfly', viewBox: '0 0 16 16', paths: [
        { d: 'M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z',   fill: '#c4b0e8' },
        { d: 'M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z', fill: '#c4b0e8' },
        { d: 'M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z',  fill: '#c4d8a8' },
        { d: 'M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z', fill: '#c4d8a8' },
        { d: 'M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z', fill: '#3d4728' }
    ]},
    { type: 'butterfly', viewBox: '0 0 16 16', paths: [
        { d: 'M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z',   fill: '#8aaa68' },
        { d: 'M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z', fill: '#8aaa68' },
        { d: 'M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z',  fill: '#c4d8a8' },
        { d: 'M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z', fill: '#c4d8a8' },
        { d: 'M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z', fill: '#3d4728' }
    ]},
    { type: 'butterfly', viewBox: '0 0 16 16', paths: [
        { d: 'M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z',   fill: '#9878cc' },
        { d: 'M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z', fill: '#9878cc' },
        { d: 'M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z',  fill: '#c4b0e8' },
        { d: 'M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z', fill: '#c4b0e8' },
        { d: 'M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z', fill: '#3d4728' }
    ]},
    { type: 'butterfly', viewBox: '0 0 16 16', paths: [
        { d: 'M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z',   fill: '#c4b0e8' },
        { d: 'M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z', fill: '#4d8282' },
        { d: 'M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z',  fill: '#4d8282' },
        { d: 'M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z', fill: '#c4b0e8' },
        { d: 'M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z', fill: '#3d4728' }
    ]},
    { type: 'butterfly', viewBox: '0 0 16 16', paths: [
        { d: 'M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z',   fill: '#8aaa68' },
        { d: 'M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z', fill: '#c4d8a8' },
        { d: 'M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z',  fill: '#8aaa68' },
        { d: 'M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z', fill: '#c4d8a8' },
        { d: 'M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z', fill: '#2c2c2c' }
    ]},
    // ── Abejas (3) ────────────────────────────────────────
    { type: 'bee', viewBox: '0 0 14 14', paths: [
        { d: 'M4,5 C4,3 10,3 10,5 L10,10 C10,12 4,12 4,10 Z', fill: '#f0c060' },
        { d: 'M4,7 C4,6.5 10,6.5 10,7 L10,8 C10,8.5 4,8.5 4,8 Z', fill: '#3d4728' },
        { d: 'M7,5 C4,2 1,3 2,6 Z', fill: 'rgba(196,216,168,0.65)' },
        { d: 'M7,5 C10,2 13,3 12,6 Z', fill: 'rgba(196,216,168,0.65)' }
    ]},
    { type: 'bee', viewBox: '0 0 14 14', paths: [
        { d: 'M4,5 C4,3 10,3 10,5 L10,10 C10,12 4,12 4,10 Z', fill: '#f0c060' },
        { d: 'M4,7 C4,6.5 10,6.5 10,7 L10,8 C10,8.5 4,8.5 4,8 Z', fill: '#3d4728' },
        { d: 'M7,5 C4,2 1,3 2,6 Z', fill: 'rgba(196,216,168,0.65)' },
        { d: 'M7,5 C10,2 13,3 12,6 Z', fill: 'rgba(196,216,168,0.65)' }
    ]},
    { type: 'bee', viewBox: '0 0 14 14', paths: [
        { d: 'M4,5 C4,3 10,3 10,5 L10,10 C10,12 4,12 4,10 Z', fill: '#e8b040' },
        { d: 'M4,7 C4,6.5 10,6.5 10,7 L10,8 C10,8.5 4,8.5 4,8 Z', fill: '#252d10' },
        { d: 'M7,5 C4,2 1,3 2,6 Z', fill: 'rgba(138,170,104,0.55)' },
        { d: 'M7,5 C10,2 13,3 12,6 Z', fill: 'rgba(138,170,104,0.55)' }
    ]}
  ];
  var sizes = [10, 12, 14, 16, 18];
  var svgNS = 'http://www.w3.org/2000/svg';

  configs.forEach(function(cfg, i) {
    var isMulti = !!(cfg.paths && cfg.paths.length);
    var vb = cfg.viewBox || '0 0 12 12';
    var base = sizes[Math.floor(Math.random() * sizes.length)];
    var size = cfg.type === 'butterfly' ? Math.round(base * 1.5) :
               cfg.type === 'bee'       ? Math.round(base * 1.25) : base;

    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', vb);
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.className = 'sp-wind-petal';

    if (isMulti) {
      cfg.paths.forEach(function(ph) {
        var p = document.createElementNS(svgNS, 'path');
        p.setAttribute('d', ph.d);
        p.setAttribute('fill', ph.fill);
        svg.appendChild(p);
      });
    } else {
      var p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', cfg.path);
      p.setAttribute('fill', cfg.fill);
      svg.appendChild(p);
    }

    container.appendChild(svg);

    var animator = cfg.type === 'butterfly' ? animateButterfly :
                   cfg.type === 'bee'        ? animateBee : animateWindPetal;

    splashTimers.push(gsap.delayedCall(i * 0.20, (function(el, anim) {
      return function() { anim(el); };
    })(svg, animator)));
  });
}
```

- [ ] **Step 2: Verificar en browser que splash sigue funcionando**

Abrir `preview-fullscreen.html` en Chrome. Borrar `sessionStorage` si es necesario (`sessionStorage.clear()` en consola). Recargar.
Verificar: aparecen ~22+ pétalos cayendo, mariposas moviéndose diferente a los pétalos, abejas con movimiento errático. Consola sin errores.

- [ ] **Step 3: Commit**

```
git add -A
git commit -m "feat(splash): expand wind petals 12→22 + multi-path SVG support"
```

---

## Task 2: Agregar `animateButterfly()` y `animateBee()`

**Files:**
- Modify: `preview-fullscreen.html` — insertar dos funciones después de `animateWindPetal()` (línea ~2083)

- [ ] **Step 1: Insertar `animateButterfly` después del cierre de `animateWindPetal`**

Localizar la línea:
```javascript
}
```
que cierra `animateWindPetal`. Inmediatamente después, insertar:

```javascript
function animateButterfly(el) {
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var x = Math.random() * vw;
  var y = 80 + Math.random() * (vh * 0.65);
  var amplitude = 60 + Math.random() * 80;
  var stepDur  = 2 + Math.random() * 1.5;

  gsap.set(el, {
    x: x, y: y, rotation: 0,
    opacity: 0.35 + Math.random() * 0.30
  });

  function step(cx, cy, phase) {
    var nx = cx + (phase % 2 === 0 ? amplitude : -amplitude) + (Math.random() - 0.5) * 30;
    var ny = cy + (Math.random() - 0.5) * 80;
    nx = Math.max(20, Math.min(vw - 20, nx));
    ny = Math.max(-60, Math.min(vh + 60, ny));
    if (ny > vh + 40 || ny < -40) { animateButterfly(el); return; }
    gsap.to(el, {
      x: nx, y: ny,
      rotation: phase % 2 === 0 ? 12 : -12,
      duration: stepDur,
      ease: 'sine.inOut',
      onComplete: function() { step(nx, ny, phase + 1); }
    });
  }
  step(x, y, 0);
}

function animateBee(el) {
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var x = Math.random() * vw;
  var y = 100 + Math.random() * (vh * 0.55);
  var maxSteps = 7 + Math.floor(Math.random() * 4);
  var stepCount = 0;

  gsap.set(el, {
    x: x, y: y,
    opacity: 0.45 + Math.random() * 0.25
  });

  function buzz(cx, cy) {
    if (stepCount >= maxSteps) { animateBee(el); return; }
    stepCount++;
    var nx = cx + (Math.random() - 0.5) * 90;
    var ny = cy + (Math.random() - 0.5) * 60;
    nx = Math.max(20, Math.min(vw - 20, nx));
    ny = Math.max(50, Math.min(vh - 50, ny));
    gsap.to(el, {
      x: nx, y: ny,
      rotation: Math.random() * 40 - 20,
      duration: 0.30 + Math.random() * 0.35,
      ease: 'power1.inOut',
      onComplete: function() { buzz(nx, ny); }
    });
  }
  buzz(x, y);
}
```

- [ ] **Step 2: Verificar en browser**

Recargar (con `sessionStorage.clear()` si necesario). Verificar:
- Mariposas zigzaguean suavemente con rotación alternada ±12°
- Abejas se mueven en pasos cortos erráticos
- Flores siguen cayendo normalmente
- `splash.querySelectorAll('.sp-wind-petal')` en consola devuelve 30 elementos
- Al hacer click en el splash, todo desaparece limpiamente

- [ ] **Step 3: Commit**

```
git add -A
git commit -m "feat(splash): add animateButterfly and animateBee with distinct movement physics"
```

---

## Task 3: Agregar `initNavDecorations()` al header

**Files:**
- Modify: `preview-fullscreen.html`
  - Sección A: agregar método `initNavDecorations` en el objeto `MBPAnimations` (después de `initDecorative`)
  - Sección B: llamar `this.initNavDecorations()` en `MBPAnimations.init()`

- [ ] **Step 1: Agregar método `initNavDecorations` en `MBPAnimations`**

Localizar el cierre de `initDecorative`:
```javascript
    }
  };
```
(el `}` que cierra `initDecorative` y el `};` que cierra `MBPAnimations`).

Reemplazar esa parte por:

```javascript
    },
    initNavDecorations: function() {
      var hdr = document.getElementById('hdr');
      if (!hdr || !window.gsap) return;
      var svgNS = 'http://www.w3.org/2000/svg';

      var wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;';
      hdr.insertBefore(wrap, hdr.firstChild);

      var vw = window.innerWidth;
      var navEls = [
        { viewBox:'0 0 12 12', size:8,  opacity:0.18, anim:'drift',
          paths:[{ d:'M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z', fill:'#c4b0e8' }] },
        { viewBox:'0 0 12 12', size:7,  opacity:0.15, anim:'drift',
          paths:[{ d:'M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z', fill:'#8aaa68' }] },
        { viewBox:'0 0 12 12', size:7,  opacity:0.15, anim:'oscillate',
          paths:[{ d:'M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z', fill:'#c4d8a8' }] },
        { viewBox:'0 0 16 16', size:10, opacity:0.20, anim:'cross',
          paths:[
            { d:'M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z',       fill:'#c4b0e8' },
            { d:'M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z',   fill:'#c4b0e8' },
            { d:'M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z',      fill:'#c4d8a8' },
            { d:'M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z',   fill:'#c4d8a8' },
            { d:'M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z', fill:'#3d4728' }
          ]},
        { viewBox:'0 0 14 14', size:9,  opacity:0.22, anim:'buzz-nav',
          paths:[
            { d:'M4,5 C4,3 10,3 10,5 L10,10 C10,12 4,12 4,10 Z', fill:'#f0c060' },
            { d:'M4,7 C4,6.5 10,6.5 10,7 L10,8 C10,8.5 4,8.5 4,8 Z', fill:'#3d4728' },
            { d:'M7,5 C4,2 1,3 2,6 Z', fill:'rgba(196,216,168,0.65)' },
            { d:'M7,5 C10,2 13,3 12,6 Z', fill:'rgba(196,216,168,0.65)' }
          ]}
      ];

      navEls.forEach(function(cfg) {
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width',   cfg.size);
        svg.setAttribute('height',  cfg.size);
        svg.setAttribute('viewBox', cfg.viewBox);
        svg.setAttribute('fill',    'none');
        svg.setAttribute('aria-hidden', 'true');
        svg.style.cssText = 'position:absolute;will-change:transform;';

        cfg.paths.forEach(function(ph) {
          var p = document.createElementNS(svgNS, 'path');
          p.setAttribute('d', ph.d);
          p.setAttribute('fill', ph.fill);
          svg.appendChild(p);
        });
        wrap.appendChild(svg);

        var op = cfg.opacity;

        if (cfg.anim === 'drift') {
          var sx = Math.random() * (vw * 0.5) + vw * 0.1;
          var sy = 10 + Math.random() * 48;
          gsap.set(svg, { x:sx, y:sy, opacity:op, rotation:Math.random()*360 });
          gsap.to(svg, {
            x: '+=' + (100 + Math.random() * 80),
            y: '+=' + ((Math.random() - 0.5) * 18),
            rotation: '+=' + (50 + Math.random() * 60),
            duration: 14 + Math.random() * 6,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });

        } else if (cfg.anim === 'oscillate') {
          var ox = Math.random() * (vw * 0.4) + vw * 0.25;
          var oy = 14 + Math.random() * 40;
          gsap.set(svg, { x:ox, y:oy, opacity:op, rotation:Math.random()*180 });
          gsap.to(svg, {
            y: '+=' + 8,
            rotation: '+=' + 20,
            duration: 5 + Math.random() * 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          });

        } else if (cfg.anim === 'cross') {
          var cy2 = 10 + Math.random() * 46;
          gsap.set(svg, { x:-20, y:cy2, opacity:0 });
          gsap.to(svg, {
            x: vw + 20,
            opacity: op,
            duration: 22 + Math.random() * 10,
            ease: 'none',
            repeat: -1,
            onRepeat: function() {
              gsap.set(svg, { x:-20, y: 10 + Math.random() * 46, opacity:0 });
            }
          });

        } else if (cfg.anim === 'buzz-nav') {
          var bx = vw * 0.55 + Math.random() * (vw * 0.35);
          var by = 10 + Math.random() * 50;
          gsap.set(svg, { x:bx, y:by, opacity:op });
          (function navBuzz(cx, cy) {
            var nx = cx + (Math.random() - 0.5) * 60;
            var ny = Math.max(4, Math.min(64, cy + (Math.random() - 0.5) * 28));
            nx = Math.max(40, Math.min(vw - 40, nx));
            gsap.to(svg, {
              x:nx, y:ny,
              rotation: Math.random() * 30 - 15,
              duration: 0.8 + Math.random() * 0.6,
              ease: 'power1.inOut',
              onComplete: function() { navBuzz(nx, ny); }
            });
          })(bx, by);
        }
      });
    }
  };
```

- [ ] **Step 2: Agregar llamada en `MBPAnimations.init()`**

Localizar:
```javascript
    init: function() {
      this.injectModal();
      gsap.registerPlugin(ScrollTrigger);
      this.ready = true;
      this.patchFunctions();
      this.enterPage(typeof currentPage !== 'undefined' ? currentPage : 'inicio');
      this.initMicro();
      this.initDecorative();
    },
```

Reemplazar por:
```javascript
    init: function() {
      this.injectModal();
      gsap.registerPlugin(ScrollTrigger);
      this.ready = true;
      this.patchFunctions();
      this.enterPage(typeof currentPage !== 'undefined' ? currentPage : 'inicio');
      this.initMicro();
      this.initDecorative();
      this.initNavDecorations();
    },
```

- [ ] **Step 3: Verificar en browser**

Recargar. Verificar:
- En el header se ven 2 pétalos pequeños drifting + 1 hoja oscilando + 1 mariposa cruzando lentamente + 1 abeja con buzz suave
- Opacidades muy sutiles (no distraen del contenido)
- Navegar entre páginas — los elementos del nav persisten correctamente en todos los temas (dark, light, hdr-servicios, etc.)
- Abrir menú móvil: no interfieren con el menú

- [ ] **Step 4: Verificar `prefers-reduced-motion`**

En Chrome DevTools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce`. Recargar. Verificar:
- Splash muestra el logo sin animaciones (comportamiento existente)
- Nav elements NO aparecen (el guard `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;` en línea ~1977 evita que `MBPAnimations.init()` se ejecute, así que `initNavDecorations` tampoco corre)

- [ ] **Step 5: Commit**

```
git add -A
git commit -m "feat(nav): add ambient nature elements — petals, butterfly, bee in header"
```

---

## Task 4: Commit final y copiar al proyecto

- [ ] **Step 1: Verificar archivo destino en el proyecto Astro**

Identificar si existe equivalente en `src/`. Si existe un splash component, aplicar los mismos cambios ahí. Si `preview-fullscreen.html` es el único archivo relevante, omitir este paso.

- [ ] **Step 2: Commit de cierre**

```
git add -A
git commit -m "feat(animations): nature theme complete — 30-element splash + ambient nav flora"
```

---

## Self-Review

### Spec coverage

| Requisito | Task que lo implementa |
|-----------|------------------------|
| Más flores en splash (12→22) | Task 1 |
| Mariposas (5) en splash | Task 1 (configs) + Task 2 (animateButterfly) |
| Abejas (3) en splash | Task 1 (configs) + Task 2 (animateBee) |
| Mariposas zigzag sinusoidal | Task 2 (`animateButterfly`) |
| Abejas buzz errático | Task 2 (`animateBee`) |
| Nav: 2 pétalos + hoja + mariposa + abeja | Task 3 (`initNavDecorations`) |
| Nav: flotan pasivamente | Task 3 (anims drift/oscillate/cross/buzz-nav) |
| Dismiss mata todos los tweens | Cubierto por `gsap.killTweensOf(windPetals)` existente — todos tienen clase `sp-wind-petal` |
| `prefers-reduced-motion` | Task 3 Step 4 — guard existente en L1977 bloquea init() completo |

### Placeholders

Ninguno encontrado. Todos los steps tienen código completo.

### Type consistency

- `animateButterfly(el)` — referenciado en Task 1 (asignado como animator) y definido en Task 2. ✓
- `animateBee(el)` — ídem. ✓
- `initNavDecorations()` — definido en Task 3 Step 1 y llamado en Task 3 Step 2. ✓
- `splashTimers` — variable global existente, accedida por referencia en `initWindPetals`. ✓
