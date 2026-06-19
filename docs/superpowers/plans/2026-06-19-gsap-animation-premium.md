# GSAP Animation System — Premium Clínico Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 5-layer GSAP animation system to `index.html` that elevates the site to premium-clínico feel with entrance animations, smooth page transitions, scroll reveals, hover micro-interactions, and decorative details.

**Architecture:** All code lives in a second `<script>` block appended immediately after the existing one (just before `</body>`). This block conditionally loads GSAP + ScrollTrigger from CDN, then patches the existing `goTo()`, `openMenu()`, `closeMenu()`, and `toggleFaq()` functions. If GSAP fails to load, original behavior is 100% preserved.

**Tech Stack:** GSAP 3.12.5 + ScrollTrigger plugin (CDN), vanilla JS, zero build tools.

---

## File Map

| File | Change |
|------|--------|
| `C:\Users\USUARIO\Downloads\index.html` | Add second `<script>` block before `</body>` with all GSAP code |

The existing `<script>` block (lines 656–716) is **not modified**. All new code goes after it.

---

## Task 1: Layer 0 — GSAP Conditional Setup + MBPAnimations Namespace

**Files:**
- Modify: `C:\Users\USUARIO\Downloads\index.html` — add script block before `</body>`

- [ ] **Step 1: Locate insertion point**

Find the closing `</script>` tag on line 716 and the `</body>` on line 717. New code goes between them.

- [ ] **Step 2: Add the GSAP loader + namespace scaffold**

Insert this immediately after line 716 (after the existing `</script>`):

```html
<script>
/* ═══════════════════════════════════════════════════════
   MBP GSAP ANIMATION SYSTEM — v1.0
   All layers: 0 Setup · 1 Entrances · 2 Transitions
               3 Scroll reveals · 4 Micro · 5 Decorative
   Depends on: goTo, openMenu, closeMenu, toggleFaq (above)
═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── Layer 0: Kill switch — reduced motion ──────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── MBPAnimations namespace ────────────────────────────
  window.MBPAnimations = {
    ready: false,

    init: function() {
      gsap.registerPlugin(ScrollTrigger);
      this.ready = true;
      this.patchFunctions();
      this.enterPage(currentPage);    // animate current page on first load
      this.initMicro();
      this.initDecorative();
    },

    enterPage: function(page) {
      ScrollTrigger.getAll().forEach(function(t) { t.kill(); });
      var fn = this['enter_' + page];
      if (fn) fn.call(this);
      this.initScrollReveals(page);
    },

    patchFunctions: function() { /* Task 2 */ },
    enter_inicio:   function() { /* Task 3 */ },
    enter_servicios:function() { /* Task 4a */ },
    enter_perfil:   function() { /* Task 4b */ },
    enter_contacto: function() { /* Task 4c */ },
    enter_avisos:   function() { /* Task 4d */ },
    initScrollReveals: function(page) { /* Task 5 */ },
    initMicro:      function() { /* Task 6 */ },
    initDecorative: function() { /* Task 7 */ }
  };

  // ── Conditional CDN load ───────────────────────────────
  var s1 = document.createElement('script');
  s1.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
  s1.onerror = function() { console.warn('[MBP] GSAP failed to load — animations disabled'); };
  s1.onload = function() {
    var s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';
    s2.onerror = function() { console.warn('[MBP] ScrollTrigger failed — animations disabled'); };
    s2.onload = function() { MBPAnimations.init(); };
    document.head.appendChild(s2);
  };
  document.head.appendChild(s1);

})();
</script>
```

- [ ] **Step 3: Verify in browser**

Open `index.html` in browser. Open DevTools → Network tab → filter "gsap".
Expected: two requests, both 200 — `gsap.min.js` and `ScrollTrigger.min.js`.
Open Console — no errors. `window.MBPAnimations.ready` should be `true`.

- [ ] **Step 4: Verify reduced-motion kill switch**

In DevTools Console run:
```js
// Simulate reduced motion by checking the guard manually
// (actual test: in Chrome DevTools → Rendering → Emulate CSS media: prefers-reduced-motion: reduce)
```
In Chrome: DevTools → More Tools → Rendering → "Emulate CSS media feature" → `prefers-reduced-motion: reduce`.
Reload. Network tab: GSAP scripts should NOT appear (0 requests).

- [ ] **Step 5: Commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): GSAP conditional loader + MBPAnimations namespace scaffold"
```

---

## Task 2: Layer 2 — Page Transitions (patch goTo)

**Files:**
- Modify: `index.html` — fill `patchFunctions()` in the script block from Task 1

- [ ] **Step 1: Replace `patchFunctions` stub**

Find `patchFunctions: function() { /* Task 2 */ },` and replace with:

```js
patchFunctions: function() {
  var self = this;
  var _goTo = window.goTo;

  window.goTo = function(page) {
    if (page === currentPage) return;
    if (!MBPAnimations.ready) { _goTo(page); return; }

    var curEl = document.getElementById('page-' + currentPage);
    var nextEl = document.getElementById('page-' + page);
    var hdr = document.getElementById('hdr');

    // Exit current page
    gsap.to(curEl, {
      opacity: 0,
      y: -10,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: function() {
        curEl.classList.remove('active');
        gsap.set(curEl, { opacity: 0, y: 0 });

        // Update header + nav (same as original goTo)
        currentPage = page;
        hdr.className = (page === 'inicio') ? 'dark' : 'light';
        document.querySelectorAll('.nb[data-p]').forEach(function(btn) {
          btn.classList.toggle('active', btn.getAttribute('data-p') === page);
        });
        window.scrollTo(0, 0);

        // Enter new page
        nextEl.classList.add('active');
        gsap.fromTo(nextEl,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power3.out',
            onComplete: function() {
              self.enterPage(page);
            }
          }
        );
      }
    });
  };

  // Patch openMenu
  var _openMenu = window.openMenu;
  window.openMenu = function() {
    var menu = document.getElementById('mob-menu');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    gsap.from(menu, { opacity: 0, x: 20, duration: 0.28, ease: 'power3.out' });
    gsap.from(menu.querySelectorAll('.mob-nb, .mob-cta'), {
      opacity: 0, y: 12, stagger: 0.06, delay: 0.1,
      duration: 0.35, ease: 'power2.out'
    });
  };

  // Patch closeMenu
  var _closeMenu = window.closeMenu;
  window.closeMenu = function() {
    var menu = document.getElementById('mob-menu');
    if (!menu.classList.contains('open')) return;
    gsap.to(menu, {
      opacity: 0, x: 20, duration: 0.2, ease: 'power2.in',
      onComplete: function() {
        menu.classList.remove('open');
        gsap.set(menu, { opacity: 1, x: 0 });
        document.body.style.overflow = '';
      }
    });
  };

  // Patch toggleFaq
  var _toggleFaq = window.toggleFaq;
  window.toggleFaq = function(id) {
    var body = document.getElementById('faq-body-' + id);
    var chev = document.getElementById('faq-chev-' + id);
    var btn  = document.getElementById('faq-btn-'  + id);
    if (!body) return;

    var isOpen = body.classList.contains('open');

    if (isOpen) {
      gsap.to(body, {
        maxHeight: 0, duration: 0.25, ease: 'power2.in',
        onComplete: function() { body.classList.remove('open'); }
      });
      chev.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      body.classList.add('open');
      var h = body.scrollHeight;
      gsap.fromTo(body,
        { maxHeight: 0 },
        { maxHeight: h, duration: 0.35, ease: 'power2.out' }
      );
      chev.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  };
},
```

- [ ] **Step 2: Verify page transitions in browser**

Open `index.html`. Click "SERVICIOS" in the nav.
Expected: current page fades + slides up slightly, servicios page fades + slides up from below. No flash.
Click "INICIO". Expected: reverse — smooth transition back.
Header color should change from dark→light and back.

- [ ] **Step 3: Verify mobile menu**

On desktop, resize to <800px or use DevTools device emulation.
Click hamburger. Expected: menu slides in from right, items stagger down.
Click ✕. Expected: menu slides out to right, then disappears.
Press Escape. Expected: same close animation.

- [ ] **Step 4: Commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): GSAP page transitions + mobile menu + FAQ patches"
```

---

## Task 3: Layer 1 — Hero Entrance (inicio)

**Files:**
- Modify: `index.html` — fill `enter_inicio()`

- [ ] **Step 1: Replace `enter_inicio` stub**

Find `enter_inicio:   function() { /* Task 3 */ },` and replace with:

```js
enter_inicio: function() {
  // ── Letter split on h1 ──
  var h1 = document.querySelector('#page-inicio h1');
  if (!h1) return;

  // Preserve aria label before DOM manipulation
  var originalText = h1.innerText.replace(/\s+/g, ' ').trim();
  h1.setAttribute('aria-label', originalText);

  // Split innerHTML by <br>, split each line into letter spans
  var lines = h1.innerHTML.split(/<br\s*\/?>/i);
  h1.innerHTML = lines.map(function(line) {
    return line.split('').map(function(ch) {
      if (ch === ' ') return '<span aria-hidden="true"> </span>';
      return '<span class="ltr" aria-hidden="true">' + ch + '</span>';
    }).join('');
  }).join('<br>');

  var letters = h1.querySelectorAll('.ltr');

  // ── Tagline, CTAs, disclaimer ──
  var tagline    = document.querySelector('#page-inicio p[style*="font-size:17px"]');
  var ctaGroup   = document.querySelector('#page-inicio div[style*="display:flex;flex-wrap:wrap;gap:12px"]');
  var disclaimer = document.querySelector('#page-inicio div[style*="align-items:center;gap:8px"]');

  var tl = gsap.timeline();

  // Letters stagger
  tl.from(letters, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.022,
    clearProps: 'all'
  }, 0.1);

  // Tagline
  if (tagline) {
    tl.from(tagline, { opacity: 0, y: 16, duration: 0.7, ease: 'power3.out' }, 0.55);
  }

  // CTAs
  if (ctaGroup) {
    tl.from(ctaGroup.children, {
      opacity: 0, y: 12, duration: 0.5, ease: 'power3.out', stagger: 0.1
    }, 0.65);
  }

  // Disclaimer
  if (disclaimer) {
    tl.from(disclaimer, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.9);
  }
},
```

- [ ] **Step 2: Verify in browser**

Reload `index.html` (or navigate away and back to inicio).
Expected: letters of "MARIA BERNARDA" and "PACHECO" animate in left-to-right with stagger, then tagline, CTAs, and disclaimer follow.
Total sequence should feel ~1.2s from page load.

- [ ] **Step 3: Verify accessibility**

In DevTools → Accessibility tab, inspect the h1.
Expected: screen reader sees `aria-label="MARIA BERNARDA PACHECO"` on the h1, not individual letter spans (which are `aria-hidden="true"`).

- [ ] **Step 4: Commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): hero entrance — letter stagger on inicio h1"
```

---

## Task 4: Layer 1 — Inner Page Entrances (servicios, perfil, contacto, avisos)

**Files:**
- Modify: `index.html` — fill `enter_servicios`, `enter_perfil`, `enter_contacto`, `enter_avisos`

- [ ] **Step 1: Helper function — add before `enter_servicios`**

Add this helper at the top of the GSAP script block, inside the IIFE, before `window.MBPAnimations = {...}`:

```js
function wordSplit(el, cssClass) {
  if (!el) return [];
  var original = el.textContent;
  el.setAttribute('aria-label', original);
  el.innerHTML = original.trim().split(/\s+/).map(function(word) {
    return '<span class="' + cssClass + '" aria-hidden="true">' + word + '</span>';
  }).join(' ');
  return el.querySelectorAll('.' + cssClass);
}
```

- [ ] **Step 2: Fill `enter_servicios`**

```js
enter_servicios: function() {
  var h1    = document.querySelector('#page-servicios h1');
  var badge = document.querySelector('#page-servicios div[style*="display:inline-block"]');
  var divider = document.querySelector('#page-servicios div[style*="width:40px;height:2px"]');
  var body  = document.querySelector('#page-servicios p[style*="font-size:15px"]');

  var words = wordSplit(h1, 'wd');
  var tl = gsap.timeline();

  if (badge) {
    tl.from(badge, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, 0);
  }
  if (words.length) {
    tl.from(words, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, 0.15);
  }
  if (divider) {
    tl.from(divider, { width: 0, duration: 0.5, ease: 'power3.out' }, 0.4);
  }
  if (body) {
    tl.from(body, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0.5);
  }
},
```

- [ ] **Step 3: Fill `enter_perfil`**

```js
enter_perfil: function() {
  var h1    = document.querySelector('#page-perfil h1');
  var badge = document.querySelector('#page-perfil div[style*="display:inline-block"]');
  var divider = document.querySelector('#page-perfil div[style*="width:40px;height:2px"]');
  var body  = document.querySelector('#page-perfil p[style*="font-size:14px"]');
  var cards = document.querySelectorAll('#page-perfil div[style*="flex:1 1 220px"] > div');

  var words = wordSplit(h1, 'wd');
  var tl = gsap.timeline();

  if (badge) {
    tl.from(badge, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, 0);
  }
  if (words.length) {
    tl.from(words, {
      opacity: 0, y: 28, rotateX: 25,
      duration: 0.75, ease: 'power3.out',
      stagger: 0.06,
      transformOrigin: 'center bottom'
    }, 0.15);
  }
  if (divider) {
    tl.from(divider, { width: 0, duration: 0.5, ease: 'power3.out' }, 0.4);
  }
  if (body) {
    tl.from(body, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0.5);
  }
  if (cards.length) {
    tl.from(cards, { opacity: 0, x: 20, duration: 0.55, ease: 'power2.out', stagger: 0.08 }, 0.5);
  }
},
```

- [ ] **Step 4: Fill `enter_contacto`**

```js
enter_contacto: function() {
  var h1    = document.querySelector('#page-contacto h1');
  var badge = document.querySelector('#page-contacto div[style*="display:inline-block"]');
  var divider = document.querySelector('#page-contacto div[style*="width:40px;height:2px"]');
  var body  = document.querySelector('#page-contacto p[style*="font-size:15px"]');

  var words = wordSplit(h1, 'wd');
  var tl = gsap.timeline();

  if (badge) {
    tl.from(badge, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' }, 0);
  }
  if (words.length) {
    tl.from(words, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, 0.15);
  }
  if (divider) {
    tl.from(divider, { width: 0, duration: 0.5, ease: 'power3.out' }, 0.4);
  }
  if (body) {
    tl.from(body, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0.5);
  }
},
```

- [ ] **Step 5: Fill `enter_avisos`**

```js
enter_avisos: function() {
  var eyebrow = document.querySelector('#page-avisos p[style*="letter-spacing:.25em"]');
  var h1      = document.querySelector('#page-avisos h1');
  var divider = document.querySelector('#page-avisos div[style*="width:40px;height:2px"]');
  var body    = document.querySelector('#page-avisos p[style*="font-size:15px"]');

  var words = wordSplit(h1, 'wd');
  var tl = gsap.timeline();

  if (eyebrow) {
    tl.from(eyebrow, { opacity: 0, y: 8, duration: 0.4, ease: 'power2.out' }, 0);
  }
  if (words.length) {
    tl.from(words, { opacity: 0, y: 20, duration: 0.55, ease: 'power3.out', stagger: 0.05 }, 0.15);
  }
  if (divider) {
    tl.from(divider, { width: 0, duration: 0.45, ease: 'power3.out' }, 0.35);
  }
  if (body) {
    tl.from(body, { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' }, 0.45);
  }
},
```

- [ ] **Step 6: Verify all inner pages**

Navigate to each page and verify:
- **servicios**: badge pops in, h1 words stagger, divider draws, body fades
- **perfil**: h1 words have 3D rotateX feel, info cards slide from right
- **contacto**: badge + h1 + divider sequence
- **avisos**: eyebrow → h1 words → divider sequence

- [ ] **Step 7: Commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): inner page entrances — servicios, perfil, contacto, avisos"
```

---

## Task 5: Layer 3 — Scroll Reveals (ScrollTrigger)

**Files:**
- Modify: `index.html` — fill `initScrollReveals(page)`

- [ ] **Step 1: Replace `initScrollReveals` stub**

```js
initScrollReveals: function(page) {
  if (page === 'servicios') {
    var cards = document.querySelectorAll('#page-servicios article');
    if (!cards.length) return;
    gsap.from(cards, {
      opacity: 0, y: 36, scale: 0.96,
      duration: 0.65, ease: 'power3.out',
      stagger: { each: 0.09, from: 'start' },
      scrollTrigger: {
        trigger: cards[0].closest('div'),
        start: 'top 78%',
        toggleActions: 'play none none none'
      }
    });
  }

  if (page === 'contacto') {
    var channelCards = document.querySelectorAll(
      '#page-contacto section[aria-label="Canales de contacto"] > div > div'
    );
    if (channelCards.length) {
      gsap.from(channelCards, {
        opacity: 0, y: 24,
        duration: 0.55, ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: channelCards[0].closest('div'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }

    var privacySection = document.querySelector('#page-contacto section[aria-label="Aviso de privacidad y seguridad"]');
    if (privacySection) {
      gsap.from(privacySection, {
        opacity: 0, y: 20,
        duration: 0.6, ease: 'power3.out',
        scrollTrigger: {
          trigger: privacySection,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      });
    }
  }

  if (page === 'avisos') {
    var notices = document.querySelectorAll('#page-avisos article');
    if (notices.length) {
      gsap.from(notices, {
        opacity: 0, x: -16,
        duration: 0.55, ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: notices[0].closest('div'),
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  }
},
```

- [ ] **Step 2: Verify servicios scroll**

Navigate to servicios. Scroll down to the service cards grid.
Expected: cards animate in with stagger as they enter the viewport.
If the page is short enough that all cards are visible immediately, they should still animate in on page load via entrance.

- [ ] **Step 3: Verify contacto scroll**

Navigate to contacto. Scroll to channel cards and privacy section.
Expected: cards stagger up, privacy section fades up from below.

- [ ] **Step 4: Verify avisos scroll**

Navigate to avisos. Scroll down.
Expected: notice articles slide in from the left (matching the left-border accent visual).

- [ ] **Step 5: Commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): ScrollTrigger scroll reveals — cards, notices, privacy section"
```

---

## Task 6: Layer 4 — Micro-interactions (hover effects)

**Files:**
- Modify: `index.html` — fill `initMicro()`

- [ ] **Step 1: Replace `initMicro` stub**

```js
initMicro: function() {
  // ── Service card hover lift ──────────────────────────
  document.querySelectorAll('#page-servicios article').forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      gsap.to(card, {
        y: -6,
        boxShadow: '0 12px 32px rgba(45,50,15,0.14)',
        duration: 0.28,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', function() {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 0px 0px rgba(45,50,15,0)',
        duration: 0.22,
        ease: 'power2.inOut'
      });
    });
  });

  // ── CTA button hover scale ───────────────────────────
  var ctaSelectors = [
    '.h-cta',
    '#page-inicio button[onclick*="contacto"]',
    '#page-inicio button[onclick*="servicios"]',
    '.mob-cta'
  ];
  document.querySelectorAll(ctaSelectors.join(',')).forEach(function(btn) {
    btn.addEventListener('mouseenter', function() {
      gsap.to(btn, { scale: 1.03, duration: 0.18, ease: 'back.out(1.4)' });
    });
    btn.addEventListener('mouseleave', function() {
      gsap.to(btn, { scale: 1, duration: 0.15, ease: 'power2.in' });
    });
  });

  // ── Contact channel card hover glow ─────────────────
  document.querySelectorAll(
    '#page-contacto section[aria-label="Canales de contacto"] > div > div'
  ).forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      gsap.to(card, {
        boxShadow: '0 6px 24px rgba(77,130,130,0.15)',
        borderColor: '#b0caca',
        duration: 0.25,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', function() {
      gsap.to(card, {
        boxShadow: '0 0px 0px rgba(77,130,130,0)',
        borderColor: '#e8e0d4',
        duration: 0.2,
        ease: 'power2.inOut'
      });
    });
  });

  // ── Footer social icon hover ─────────────────────────
  document.querySelectorAll('.soc-a').forEach(function(icon) {
    icon.addEventListener('mouseenter', function() {
      gsap.to(icon, {
        scale: 1.1,
        borderColor: 'rgba(255,255,255,0.6)',
        duration: 0.2,
        ease: 'power2.out'
      });
    });
    icon.addEventListener('mouseleave', function() {
      gsap.to(icon, {
        scale: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        duration: 0.15,
        ease: 'power2.in'
      });
    });
  });
},
```

- [ ] **Step 2: Verify service card hover**

Navigate to servicios. Hover over each service card.
Expected: card lifts 6px upward with shadow deepening. On mouse leave, returns smoothly.

- [ ] **Step 3: Verify CTA button hover**

On inicio, hover over "AGENDAR CITA" and "CONOCER SERVICIOS" buttons.
Expected: subtle scale-up (1.03x) on enter, returns on leave.
Also hover the `.h-cta` button in the header.

- [ ] **Step 4: Commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): micro-interactions — card hover lift, CTA scale, contact glow"
```

---

## Task 7: Layer 5 — Decorative (logo petals + footer icons)

**Files:**
- Modify: `index.html` — fill `initDecorative()`

- [ ] **Step 1: Replace `initDecorative` stub**

```js
initDecorative: function() {
  // ── Logo SVG petal hover ─────────────────────────────
  var logoBtn = document.querySelector('.logo-btn');
  var petals  = document.querySelectorAll('.logo-btn > svg > path');

  if (logoBtn && petals.length) {
    logoBtn.addEventListener('mouseenter', function() {
      gsap.to(petals, {
        scale: 1.15,
        duration: 0.35,
        ease: 'back.out(1.7)',
        stagger: 0.06,
        transformOrigin: '22px 22px'
      });
    });
    logoBtn.addEventListener('mouseleave', function() {
      gsap.to(petals, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.in',
        stagger: { each: 0.04, from: 'end' },
        transformOrigin: '22px 22px'
      });
    });
  }

  // ── Header scroll shadow ─────────────────────────────
  window.addEventListener('scroll', function() {
    // Only run when on a scrollable page
    if (currentPage === 'inicio') return;
    // Header already handles dark/light via class — this adds smooth shadow
    // No-op: existing CSS box-shadow on .light already handles this
  }, { passive: true });
},
```

- [ ] **Step 2: Verify logo petal hover**

Hover over the logo in the top-left corner.
Expected: SVG petals expand outward (scale 1.15) in stagger sequence. On mouse leave, petals close in reverse order.

- [ ] **Step 3: Verify orb CSS is intact**

Reload inicio. The radial gradient orb background should still animate via CSS (it was not modified by GSAP).
Expected: orb still pulses/drifts as before.

- [ ] **Step 4: Final full pass — all animations together**

Walk through the complete site:
1. Load `index.html` — inicio letters animate in ✓
2. Click SERVICIOS — transition slide, badge pops, h1 words stagger, scroll reveals cards ✓
3. Click PERFIL — transition, h1 with rotateX, info cards slide from right ✓
4. Click CONTACTO — transition, badge, channel cards stagger on scroll ✓
5. Click AVISOS — transition, notices slide from left ✓
6. Click logo back to INICIO ✓
7. Open mobile menu (hamburger) — panel slides in, items stagger ✓
8. Close mobile menu — slides out ✓
9. Hover service cards — lift + shadow ✓
10. Hover header CTA "AGENDAR CITA" — scale ✓
11. Hover logo — petals expand and close ✓

- [ ] **Step 5: Test `prefers-reduced-motion` one final time**

DevTools → Rendering → `prefers-reduced-motion: reduce`.
Reload. All pages navigate instantly with no animation. GSAP scripts not in Network tab.

- [ ] **Step 6: Final commit**

```bash
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" add -A
git -C "C:\Users\USUARIO\Desktop\BOVEDA\Desarrollo Web\Doctora Maria Bernarlda" commit -m "feat(animation): decorative layer — logo petal hover + full animation system complete"
```

---

## Notes for the implementer

**Selector fragility:** The HTML uses only inline styles, no semantic classes on most elements. The selectors above use `aria-label` attributes and `style` attribute substrings (e.g., `[style*="font-size:17px"]`). These are robust as long as the HTML structure doesn't change. If a selector returns `null`, the animation for that element simply doesn't run — no errors thrown.

**GSAP and existing CSS transitions:** The existing CSS has `transition: opacity .4s ease` on `.page`. Once GSAP takes over page switching, this CSS transition is overridden by GSAP's animation. No conflict because GSAP sets `opacity` directly via inline style, which takes precedence. After the transition, GSAP's `clearProps` is not needed here because the pages maintain their `opacity:1` state.

**Word split `.wd` spans:** These spans are inline elements. Wrapping words in `<span>` does not break line wrapping because spans are `display:inline` by default. The space between words is preserved as the text node between spans.

**ScrollTrigger and page switching:** `ScrollTrigger.getAll().forEach(t => t.kill())` runs on every `enterPage()` call. This prevents triggers from a previous page firing on the new page. Critical — without this, servicios triggers could fire while viewing contacto.
