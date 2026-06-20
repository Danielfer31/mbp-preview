# Nature Animations — Flores, Mariposas y Abejas

**Archivo:** `preview-fullscreen.html`
**Fecha:** 2026-06-20
**Alcance:** Enriquecer splash screen + agregar elementos ambientales en nav header

---

## Objetivo

Dar más presencia visual a la animación de inicio añadiendo más flores y dos nuevas criaturas (mariposas y abejas) con comportamiento propio. Extender el mismo vocabulario visual al header de navegación de forma sutil y pasiva.

---

## Splash Screen

### Conteo de elementos

| Tipo | Antes | Después |
|------|-------|---------|
| Pétalos/flores | 12 | 22 |
| Mariposas | 0 | 5 |
| Abejas | 0 | 3 |
| **Total** | **12** | **30** |

### Formas de flor (SVG viewBox 0 0 12 12)

Las 3 formas existentes se mantienen:
- Pétalo puntiagudo: `M6,1 C8,3 10,7 6,11 C2,7 4,3 6,1 Z` — colores #c4b0e8, #c4d8a8
- Hoja redonda: `M2,9 C1,5 4,1 9,2 C8,6 6,10 2,9 Z` — color #8aaa68
- Pentágono: `M6,1 L11,5 L8,11 L3,9 L1,4 Z` — color #4d8282

2 formas nuevas:
- Pétalo elongado: `M6,0 C10,2 10,8 6,12 C2,8 2,2 6,0 Z` — color #9878cc
- Lágrima invertida: `M6,12 C2,10 1,5 6,0 C11,5 10,10 6,12 Z` — color #4d8282

Tamaños: 10–18px, aleatorio de array `[10, 12, 14, 16, 18]`.

Física: caen top → bottom con drift lateral ±140px, rotación continua, se reinician al salir del viewport. Sin cambios respecto al sistema actual.

### Mariposa (SVG viewBox 0 0 16 16)

4 paths + body:
```
ala superior izq:  M8,8 C4,5 1,3 2,7 C3,10 6,10 8,8 Z    fill: #c4b0e8
ala superior der:  M8,8 C12,5 15,3 14,7 C13,10 10,10 8,8 Z fill: #c4b0e8
ala inferior izq:  M8,8 C4,9 2,13 5,13 C7,13 8,10 8,8 Z   fill: #c4d8a8
ala inferior der:  M8,8 C12,9 14,13 11,13 C9,13 8,10 8,8 Z fill: #c4d8a8
cuerpo:            M7,5 C7,4 9,4 9,5 L9,11 C9,12 7,12 7,11 Z fill: #3d4728
```

**Comportamiento:** zigzag sinusoidal
- Aparece en posición random dentro del viewport
- Alterna movimiento horizontal ±60–80px cada 2–3s
- Leve rotación ±15° sincronizada con la dirección
- Opacidad 0.35–0.65
- Al salir del viewport, reaparece en nueva posición aleatoria

### Abeja (SVG viewBox 0 0 14 14)

```
cuerpo:   M4,5 C4,3 10,3 10,5 L10,10 C10,12 4,12 4,10 Z  fill: #f0c060
franja:   M4,7 C4,6.5 10,6.5 10,7 L10,8 C10,8.5 4,8.5 4,8 Z fill: #3d4728
ala izq:  M7,5 C4,2 1,3 2,6 Z                              fill: rgba(196,216,168,0.65)
ala der:  M7,5 C10,2 13,3 12,6 Z                           fill: rgba(196,216,168,0.65)
```

**Comportamiento:** buzz errático
- Pasos cortos (0.3–0.5s por paso) en dirección aleatoria
- Desplazamiento por paso: ±40px X, ±30px Y
- ~8 pasos antes de reaparecer en nueva posición
- Rotación ligera ±20° random por paso
- Opacidad 0.45–0.70

---

## Nav Header

### Estructura

Contenedor `<div>` insertado como primer hijo del `<header>`:
```css
position: absolute;
inset: 0;
overflow: hidden;
pointer-events: none;
z-index: 0;
```

### Elementos

| Elemento | Qty | Tamaño | Opacidad max | Movimiento |
|----------|-----|--------|--------------|------------|
| Pétalo elongado | 2 | 8px | 0.18 | drift horizontal, loop 12–18s |
| Hoja redonda | 1 | 7px | 0.15 | oscilación vertical ±4px, loop 8s |
| Mariposa | 1 | 10px | 0.20 | cruza izq→der en 20–30s, reinicia |
| Abeja | 1 | 9px | 0.22 | buzz contenido dentro del bbox del header |

### Adaptación por tema

- Header `dark` (inicio): opacidades al 100%
- Header `light`, `hdr-servicios`, `hdr-perfil`, `hdr-contacto`, `hdr-avisos`: opacidades ×0.65 (fondos claros → más sutiles)

---

## Implementación técnica

### Cambios en `initWindPetals()`

Extender `configs` de 12 → 30 entradas. Soportar nuevo formato multi-path:
```javascript
{ paths: [{ d: '...', fill: '...' }, ...], viewBox: '0 0 16 16' }
```
Mantener compatibilidad con formato actual `{ path, fill }`.

### Nuevas funciones

- `animateButterfly(el)` — zigzag recursivo con GSAP
- `animateBee(el)` — buzz recursivo con GSAP, pasos cortos
- `initNavDecorations()` — crea y anima elementos del header; se llama desde `MBPAnimations.init()`

### Compatibilidad

- Respeta `prefers-reduced-motion` existente — guard ya en place, sin cambios
- Sin nuevas dependencias CDN — GSAP ya se carga condicionalmente
- Nav elements: solo se crean si GSAP está disponible (mismo patrón que petals)

### Rendimiento

- 30 elementos en splash: activos ~4–9s máximo antes de dismiss
- 5 elementos en nav: tweens lentos (8–30s), impacto mínimo
- Todos usan `will-change: transform` via clase `.sp-wind-petal` existente

---

## Criterios de éxito

1. Splash visualmente más lleno — flores cubren el espacio, mariposas y abejas tienen movimiento claramente diferenciado
2. Nav: elementos apenas perceptibles, no distraen del contenido
3. Dismiss del splash mata todos los tweens (petals + butterflies + bees)
4. Sin regresión en `prefers-reduced-motion`
5. Sin cambio en comportamiento del header al cambiar de página
