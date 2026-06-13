# MBP Brand Analysis — Web Design Direction
# María Bernarda Pacheco · Pediatra · March 2026
# Source: MBP_branding.pdf (13 pages, analyzed June 2026)

---

## QUICK REFERENCE

| Token | Value | Source |
|-------|-------|--------|
| color-primary | `#2D320F` | Pág. 1, 3 |
| color-lavender | `#DCCDFF` | Pág. 3, 5 |
| color-sage | `#C8CD91` | Pág. 3, 13 |
| color-teal | `#87AAAF` | Pág. 3, 7 |
| color-cream | `#F0F0E6` | Pág. 2, 8 |
| color-white | `#FFFFFF` | Pág. 7, 13 |
| font-family | Josefin Sans (inferida visualmente) | Todas |
| font-thin | weight 100 | H1 ≥36px |
| font-light | weight 300 | H2, body, labels |
| font-regular | weight 400 | Card titles |
| tracking-label | 0.45em | Etiquetas tipo "PEDIATRÍA CON EXPERIENCIA" |
| tracking-heading | 0.35em | H1, H2 all caps |
| tracking-button | 0.3em | "AGENDAR CITA" |
| radius-pill | 9999px | Botones |
| radius-card | 14px | Cards servicio |
| radius-container | 22px | Gran contenedor de cards |
| max-width | 1280px | Contenido |

---

## PALETA COMPLETA

### Colores con función semántica (Pág. 3)

| Color | HEX | RGB | Atributo PDF | Rol web |
|-------|-----|-----|-------------|---------|
| Verde Oliva | `#2D320F` | (45,50,15) | ESTABILIDAD | Texto, botón primario, fondos oscuros |
| Lavanda | `#DCCDFF` | (220,205,255) | SENSIBILIDAD | Hero, fondo logo, fondo intro |
| Sage Green | `#C8CD91` | (200,205,145) | CRECIMIENTO | Sección servicios, bandas |
| Teal Muted | `#87AAAF` | (135,170,175) | CONFIANZA | Acentos, iconos, hover |
| Crema | `#F0F0E6` | (240,240,230) | SOBRIEDAD | Fondo neutro principal, cards |
| Blanco | `#FFFFFF` | (255,255,255) | — | Cards internas |
| Lavanda claro | `#EBE6FF` | (235,230,255) | — | Patrón tono-sobre-tono |

### Proporción de uso (derivada del mockup Pág. 13)
- 45% crema
- 20% lavanda
- 15% sage green
- 12% oliva oscuro
- 5% fotografía
- 3% teal

### Texto sobre cada fondo
- Sobre `#2D320F` → `#F0F0E6` o `#DCCDFF`
- Sobre `#DCCDFF` → `#2D320F`
- Sobre `#C8CD91` → `#2D320F` (verificar WCAG AA)
- Sobre `#87AAAF` → `#2D320F` (solo peso ≥regular para tamaños pequeños)
- Sobre `#F0F0E6` → `#2D320F` (WCAG AAA)
- Sobre fotografía → `#FFFFFF` (siempre con panel o card, nunca texto directo sobre foto)

---

## TIPOGRAFÍA

### Identificación
- Familia embebida como Type3 en PDF (nombre no extraíble de metadatos)
- **Inferencia visual: Josefin Sans** (Google Fonts, gratuita)
- Alternativas si no es Josefin: Futura PT Light, Jost Light, Montserrat ExtraLight
- Cargar pesos: 100 (Thin), 300 (Light), 400 (Regular)

### Regla fundamental
- Headings / labels / botones / nav: **ALL CAPS + tracking amplio**
- Cuerpo de texto >3 líneas: **mixto + tracking mínimo**
- NUNCA texto en peso Thin para tamaños <24px

### Jerarquía recomendada (desktop / mobile)

| Nivel | Estilo | Tamaño D | Tamaño M | Tracking | Peso |
|-------|--------|----------|----------|----------|------|
| H1 Hero | ALL CAPS | 52-60px | 32-36px | 0.35em | 100/Thin |
| H2 Sección | ALL CAPS | 36-42px | 26-30px | 0.3em | 300/Light |
| H3 Sub | ALL CAPS | 22-26px | 18-20px | 0.25em | 300/Light |
| Statement | ALL CAPS centrado | 20-24px | 16-18px | 0.2em | 300/Light |
| Label | ALL CAPS | 11-13px | 10-11px | 0.45em | 300/Light |
| Nav | ALL CAPS | 12-14px | — | 0.3em | 300/Light |
| Botón | ALL CAPS | 12-13px | 12-13px | 0.3em | 300/Light |
| Card title | Capitalizado | 16-18px | 15-16px | 0.02em | 400/Regular |
| Body | Mixto | 15-17px | 14-15px | 0.02em | 300/Light |
| Atribución | ALL CAPS | 10-11px | 10-11px | 0.35em | 300/Light |
| Footer | Mixto | 12-13px | 12-13px | 0.05em | 300/Light |

---

## LOGOTIPO

### Descripción del isotipo (Pág. 4, 5)
- 4 lóbulos orgánicos en disposición de cuadrantes
- Superiores: elongados, levemente apuntados, más finos
- Inferiores: más redondeados y anchos
- Centro: punto de convergencia con nervadura cruzada
- Trazo: línea de contorno peso medio-fino
- Carácter: 100% orgánico (no geométrico)
- Lecturas múltiples: flor 4 pétalos / mariposa / BB monograma / trébol

### Versiones validadas (Pág. 7)

| Fondo | Color del isotipo |
|-------|-----------------|
| `#DCCDFF` lavanda | `#2D320F` oliva |
| `#FFFFFF` blanco | `#C8CD91` sage |
| `#C8CD91` sage | `#2D320F` oliva |
| `#87AAAF` teal | `#2D320F` oliva |
| `#2D320F` oliva | `#DCCDFF` lavanda |
| `#F0F0E6` crema | `#2D320F` oliva |
| Fotografía | `#FFFFFF` blanco |

### Lockup del logo (Pág. 5)
```
[ISOTIPO]
MARIA BERNARDA
PACHECO
pediatra
```
- Isotipo centrado arriba
- Nombre en 2 líneas: "MARIA BERNARDA" / "PACHECO"
- "pediatra" en lowercase debajo, tracking 0.35em, tamaño pequeño
- Esta ruptura de línea es canónica — conservarla en la web

### Tamaños mínimos
- Isotipo solo (favicon): 28×28px mínimo
- Logo completo: 120px de ancho mínimo

---

## ESTRUCTURA DE PÁGINA (del mockup Pág. 13)

```
1. HERO          Lavanda izq + Foto bebé der (50/50)
2. PILARES       Blanco, centrado, 4 círculos oliva
3. BIO DOCTORA   Crema, foto izq + texto der (40/60)
4. SERVICIOS     Sage bg, 6 cards en contenedor crema (3×2)
5. TESTIMONIOS   3 cards crema sobre foto botánica full-bleed
6. CTA FINAL     Oliva izq + foto bebé der (50/50)
7. FOOTER        Crema, minimalista
```

Alternancia de fondos por sección:
`lavanda → blanco → crema → sage → foto → oliva → crema`

---

## COMPONENTES DETALLADOS

### Navegación
- Fondo: transparente sobre secciones, crema al hacer scroll
- Logo: izquierda, isotipo + "MARIA BERNARDA / PACHECO" en oliva
- Links: ALL CAPS, 12-14px, tracking 0.3em, oliva
- Botón CTA: pill oliva + texto crema "AGENDAR CITA"
- Altura: ~80-88px

### Hero (Pág. 13 — sección 1)
- Split 50/50 exacto, sin gap
- Izquierda: `#DCCDFF`, logo top-left, H1 lower-left, body, botón pill oliva
- Derecha: foto bebé object-fit:cover, 100% del panel
- Texto CTA referencia del mockup: "CRECEMOS CONTIGO"
- Botón: pill `#2D320F` + texto `#F0F0E6` "AGENDAR CITA"

### Sección Pilares (Pág. 13 — sección 2)
- Fondo: `#FFFFFF`
- Etiqueta: "PEDIATRÍA CON EXPERIENCIA" — ALL CAPS, tracking 0.45em, 11px, centrado
- Statement: ALL CAPS, 20-24px, centrado, max-width 680px
- 4 pilares: círculos `#2D320F` relleno ~64px, label debajo ALL CAPS 10px

Pilares confirmados:
1. PREVENCIÓN Y PROMOCIÓN DE LA SALUD
2. NEURODESARROLLO Y CRIANZA RESPETUOSA
3. ACOMPAÑAMIENTO INTEGRAL DE LA FAMILIA
4. NUTRICIÓN Y MICROBIOTA INFANTIL

### Sección Bio (Pág. 13 — sección 3)
- Fondo: `#F0F0E6`
- 2 columnas: ~40% foto | ~60% texto
- H2 ALL CAPS "MARIA BERNARDA PACHECO"
- Body: 2 párrafos, Josefin Light, mixto, interlineado 1.7
- Transición: banda `#C8CD91` ~60px en la base

### Cards de Servicios (Pág. 13 — sección 4)
- Fondo sección: `#C8CD91`
- Label: "SERVICIOS ESPECIALIZADOS" ALL CAPS tracking extremo, centrado
- Gran contenedor: `#F0F0E6`, border-radius 22px, márgenes proporcionales
- Cards en grilla 3×2, gap ~16-20px
- Card individual:
  - Fondo: `#FFFFFF`
  - border-radius: 14px
  - padding: 20-24px
  - Ícono: cuadrado redondeado 40px, fondo pastel, línea thin 20px
  - Título: 16-18px, Regular/400, capitalizado (no all caps)
  - Descripción: 14px, Light/300, interlineado 1.6

Servicios confirmados:
1. Consulta Pediátrica General
2. Patología Respiratoria
3. Conducta y Desarrollo
4. Nutrición Pediátrica
5. Atención al Recién Nacido
6. Control de Crecimiento

### Testimonios (Pág. 13 — sección 5)
- Fondo: fotografía botánica macro full-bleed (sage + lavanda, bokeh extremo)
- 3 cards horizontales
- Card: `#F0F0E6`, border-radius 14px, padding 24-28px
- Body: Light/300, mixto, 14-15px, interlineado 1.7
- Atribución: ALL CAPS, tracking 0.35em, 10-11px

### CTA Final (Pág. 13 — sección 6)
- Split 50/50 exacto
- Izquierda: `#2D320F`, H2 en `#F0F0E6` ALL CAPS, botón outline crema
- Derecha: foto bebé mano sobre tejido crema (Categoría C)
- Botón outline: borde fino `#F0F0E6`, texto `#F0F0E6`, pill, sin relleno

### Botones
| Tipo | Fondo | Texto | Hover |
|------|-------|-------|-------|
| Primario | `#2D320F` | `#F0F0E6` ALL CAPS | bg `#3D4420` |
| Outline sobre oscuro | transparent | `#F0F0E6` + borde fino | bg `#F0F0E6` + texto `#2D320F` |
| Outline sobre claro | transparent | `#2D320F` + borde fino | bg `#2D320F` + texto `#F0F0E6` |
- Forma: pill (border-radius: 9999px)
- Padding: 12px 28px
- Tracking: 0.3em
- Tamaño táctil mínimo: 44×44px

---

## PATRÓN DECORATIVO (Págs. 9–10)

- Isotipo repetido en grilla regular (~12×8 en landscape)
- Tono-sobre-tono: `#EBE6FF` sobre `#DCCDFF` (variante lavanda)
- También en sage: isotipo claro sobre `#C8CD91`
- Separación entre símbolos: ~1× el tamaño del símbolo
- Uso web: fondos de secciones secundarias, baja opacidad
- NUNCA sobre texto o elementos interactivos
- Implementar como SVG `<pattern>` o background CSS

---

## FOTOGRAFÍA

### Categorías (Págs. 6, 8, 11, 12)

**A — Niños sin rostro**
- Encuadre: desde hombros/pecho hacia abajo. Nunca el rostro.
- Ropa: colores de la paleta (lavanda, sage, crema, blanco)
- Objetos: juguetes de madera en colores de paleta
- Superficies: alfombra blanca, tejidos crema, suelos madera
- Luz: cálida, natural, lateral. Sin flash duro.
- Saturación: baja-media

**B — Botánica macro**
- Bokeh extremo, imagen semi-abstracta
- Colores: sage + lavanda/rosa
- Uso: fondo de testimonios, side panels

**C — Texturas íntimas**
- Tejido de punto, lana, algodón (crema, lavanda, blanco)
- Uso: fondo del CTA

**D — Naturaleza**
- Mariposas, flores. Fondo teal o verde difuso.
- Conexión visual con el isotipo (mariposa)

### PROHIBIDO fotografiar
- Estetoscopios, termómetros, jeringas
- Batas o uniformes médicos
- Consultorios o camillas
- Rostros de niños
- Niños llorando o en estrés
- Hospitales o entornos clínicos
- Colores saturados fuera de la paleta

---

## ANIMACIONES

| Elemento | Tipo | Duración | Easing |
|----------|------|----------|--------|
| Scroll reveal secciones | fade + translateY(10px) | 400ms | ease-out |
| Botón hover | bg color | 200ms | ease |
| Card hover | translateY(-3px) + sombra | 250ms | ease-out |
| Foto fondo testimonios | background-attachment: fixed | — | — |
| Patrón | estático siempre | — | — |
| Isotipo (solo preloader) | scale 0.95→1.0 | 400ms | ease-out |

**PROHIBIDO:** bounce, spin, flash, parallax agresivo, confetti, efectos 3D
**Implementar:** `prefers-reduced-motion` → desactivar todo decorativo

---

## REGLAS ABSOLUTAS

### SIEMPRE
1. Solo 5 colores de la paleta + blanco. Sin excepciones.
2. Texto sobre foto: dentro de panel o card, nunca directo.
3. Botones: siempre pill.
4. Headings: siempre ALL CAPS.
5. Espacio negativo: tratarlo como elemento activo.
6. Secciones separadas por cambio de color, no por líneas divisorias.
7. Isotipo: solo las 6 combinaciones validadas (Pág. 7).

### NUNCA
1. Negro puro `#000000` — el más oscuro es `#2D320F`.
2. Colores externos a la paleta.
3. Texto directo sobre fotografías.
4. Rostros de niños en fotografías.
5. Fotografías clínicas o instrumentos médicos.
6. Peso Thin para texto <24px.
7. Rotar, distorsionar o recolorizar el isotipo fuera del sistema.
8. Sombras dramáticas o gradientes.
9. Justificar el texto (text-align: justify).
10. Fuentes adicionales distintas a la familia principal.
11. Patrón sobre texto o elementos interactivos.
12. Animaciones bounce, spin, flash.

---

## RESPONSIVE

| Breakpoint | Cambios clave |
|-----------|---------------|
| Desktop >1440px | Layout exacto del mockup, max-width 1280px centrado |
| Laptop 1024-1440px | Idéntico a desktop |
| Tablet 768-1024px | Hero apila (foto arriba, texto abajo). Cards 2×3. Pilares 2×2. |
| Mobile <768px | Todo en 1 columna. Tracking reducido a 0.15-0.2em. Botón full-width. |

Regla crítica en móvil: Tracking 0.35em en ALL CAPS provoca overflow en <380px. Reducir a 0.15em.

---

## CSS VARIABLES MÍNIMAS

```
--color-primary:  #2D320F
--color-lavender: #DCCDFF
--color-sage:     #C8CD91
--color-teal:     #87AAAF
--color-cream:    #F0F0E6
--color-white:    #FFFFFF

--font-family:    'Josefin Sans', sans-serif
--tracking-label:   0.45em
--tracking-heading: 0.35em
--tracking-button:  0.30em
--tracking-body:    0.02em

--radius-pill:      9999px
--radius-card:      14px
--radius-container: 22px

--transition-base:  200ms ease
--max-width:        1280px
```

---

## INFORMACIÓN PENDIENTE DEL CLIENTE

| # | Item | Impacto |
|---|------|---------|
| 1 | SVG del isotipo | Bloqueante para favicon, nav, patrón |
| 2 | Nombre exacto de la tipografía | Alto — confirmar "Josefin Sans" |
| 3 | Foto profesional de la Dra. | Bloqueante para sección bio |
| 4 | Librería fotográfica completa (4 slots vacíos) | Alto |
| 5 | Copys definitivos (todo es Lorem ipsum) | Alto |
| 6 | Logo versión horizontal para nav | Medio |
| 7 | Favicon en ICO/PNG | Medio |
| 8 | Colores pastel exactos de íconos en cards | Bajo |
| 9 | Comportamiento del nav en scroll | Bajo |
