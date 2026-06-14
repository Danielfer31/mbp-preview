# Registro de Revision Visual y Funcional — MBP Sitio Publico MVP
# Phase 01 — Plan 07 Checkpoint de Revision Humana
# Creado: 2026-06-14 | Basado en: MBP-BRAND-ANALYSIS.md + 01-UI-SPEC.md

> **Instrucciones:** Ejecutar `npm run build:preview` y luego `npx serve dist` (o equivalente)
> para servir el preview local. Revisar cada seccion. Marcar [ ] → [x] al aprobar.
> Documentar defectos con descripcion y archivo afectado. Corregir y re-verificar.
> Al finalizar todas las secciones sin defectos abiertos → escribir "aprobado" en el chat.

---

## Estado del Build (completado por el ejecutor automatico)

| Metrica | Valor |
|---------|-------|
| Comando ejecutado | `npm run build:preview` |
| Resultado | EXIT 0 — BUILD EXITOSO |
| Paginas generadas | 6 (/, /perfil, /servicios, /contacto, /privacidad, /404) |
| Archivos adicionales | robots.txt, sitemap.xml |
| Advertencias del build | Colecciones de contenido vacias (normal en preview con placeholders) |
| check:hardcoded | PASSED — sin contenido medico hardcodeado |
| validate:preview | PASSED — validacion de placeholders OK |
| Fecha | 2026-06-14 |

Advertencias del build (esperadas — no son errores):
- `collection "contact" does not exist or is empty` → placeholder para datos de contacto reales
- `collection "locations" does not exist or is empty` → placeholder para ubicacion
- `collection "hours" does not exist or is empty` → placeholder para horarios
- `collection "profile" does not exist or is empty` → placeholder para datos de la doctora
- `collection "services" does not exist or is empty` → placeholder para servicios

> Estas advertencias son el comportamiento CORRECTO del modo preview — el sistema
> opera con placeholders seguros mientras los datos reales no esten aprobados.

---

## Seccion A — Accesibilidad (Completar manualmente)

### A1. Lector de Pantalla

Ver **01-A11Y-MATRIX.md Seccion A** para detalle completo.

| Item | Estado | Defecto (si aplica) |
|------|--------|---------------------|
| Skip link "Ir al contenido principal" anunciado al inicio | PENDIENTE | — |
| Estructura de headings sin saltos de nivel | PENDIENTE | — |
| Boton CTA deshabilitado anunciado como deshabilitado | PENDIENTE | — |
| Disclaimer clinico leido antes de canales de contacto en /contacto | PENDIENTE | — |
| Tarjetas de servicios comprensibles sin contexto visual | PENDIENTE | — |
| Imagen placeholder de la doctora tiene alt descriptivo | PENDIENTE | — |

Resumen seccion A-NVDA/VoiceOver: **PENDIENTE**

### A2. Solo Teclado

Ver **01-A11Y-MATRIX.md Seccion B** para detalle completo.

| Item | Estado | Defecto (si aplica) |
|------|--------|---------------------|
| Primer Tab desde pagina activa skip link | PENDIENTE | — |
| Foco visible en TODOS los elementos interactivos | PENDIENTE | — |
| Hamburger menu abre, navega y cierra con teclado | PENDIENTE | — |
| Sin trampa de foco en ninguna pagina | PENDIENTE | — |

Resumen seccion A-Teclado: **PENDIENTE**

### A3. Movil (375px viewport)

Ver **01-A11Y-MATRIX.md Seccion C** para detalle completo.

| Item | Estado | Defecto (si aplica) |
|------|--------|---------------------|
| Ningun scroll horizontal involuntario | PENDIENTE | — |
| Botones y enlaces con area >= 44×44px | PENDIENTE | — |
| Hamburger menu >= 44×44px | PENDIENTE | — |
| Texto legible sin hacer zoom | PENDIENTE | — |

Resumen seccion A-Movil: **PENDIENTE**

### A4. Movimiento Reducido

Ver **01-A11Y-MATRIX.md Seccion D**.

| Item | Estado | Defecto (si aplica) |
|------|--------|---------------------|
| Sin animaciones con prefers-reduced-motion activo | PENDIENTE | — |
| Sin parallax en movil (background-attachment:fixed desactivado) | PENDIENTE | — |

### A5. Comprensibilidad de Placeholders

| Item | Estado | Defecto (si aplica) |
|------|--------|---------------------|
| Los placeholders NO parecen datos reales de la doctora | PENDIENTE | — |
| Los placeholders se entienden (ej: "[NOMBRE DE LA CLINICA]" no "undefined") | PENDIENTE | — |
| Los CTA de cita deshabilitados muestran razon comprensible | PENDIENTE | — |
| El texto de servicios es Lorem Ipsum (correcto en preview) o placeholder etiquetado | PENDIENTE | — |

**Resultado Seccion A:** PENDIENTE  
**Defectos Abiertos:** —

---

## Seccion B — Fidelidad de Marca MBP

> Basado en: `.planning/content/MBP-BRAND-ANALYSIS.md` — Seccion "REGLAS ABSOLUTAS"  
> Verificar visualmente en el preview. Si la pagina usa Josefin Sans (actualmente sistema fonts
> segun 01-UI-SPEC.md), documentar como esperado — la Josefin Sans llega en planes de diseno posteriores.

### B1. Paleta de Colores

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Solo colores de paleta: #2D320F / #DCCDFF / #C8CD91 / #87AAAF / #F0F0E6 / #FFFFFF | PENDIENTE | — |
| Sin negro puro #000000 (el maximo oscuro es #2D320F) | PENDIENTE | — |
| Sin #C17A4A ni colores externos a la paleta | PENDIENTE | — |
| Sobre #2D320F: solo #F0F0E6 o #DCCDFF como texto | PENDIENTE | — |
| Sobre fotografias: solo dentro de panel/card, nunca texto directo | PENDIENTE | — |

### B2. Tipografia

> Nota: En Fase 1 MVP se usa system font stack (sin Josefin Sans externa).
> Verificar que el sistema de pesos y escala sea correcto.

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Headings usan peso semibold/bold (no thin para texto <24px) | PENDIENTE | — |
| Sin fuentes adicionales externas cargadas (solo system fonts en Fase 1) | PENDIENTE | — |
| Body text en mixto (no all-caps en parrafos de mas de 3 lineas) | PENDIENTE | — |
| Pendiente Josefin Sans: se integrara en plan de diseno visual posterior | N/A por diseno | Diferido a plan de diseno |

### B3. Tracking (Letra-Espaciado)

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Etiquetas ALL CAPS con tracking amplio (>= 0.3em) | PENDIENTE | — |
| Body text con tracking minimo (<= 0.05em) | PENDIENTE | — |
| En movil <380px: tracking <= 0.2em en ALL CAPS para evitar overflow | PENDIENTE | — |

### B4. Botones y Formas

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Todos los botones con forma pill (border-radius: 9999px) | PENDIENTE | — |
| Padding de botones >= 12px vertical, >= 28px horizontal | PENDIENTE | — |
| Texto de botones en ALL CAPS | PENDIENTE | — |
| Color boton primario: fondo #2D320F + texto #F0F0E6 | PENDIENTE | — |

### B5. Logo e Isotipo

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Logo placeholder SVG aceptable hasta recibir SVG definitivo | N/A / PENDIENTE | Verificar que no sea un texto plano sin estructura |
| Isotipo no rotado, no distorsionado, no recoloreado fuera del sistema | PENDIENTE | — |

### B6. Separacion de Secciones

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Secciones separadas por cambio de color de fondo (sin lineas divisorias <hr>) | PENDIENTE | — |
| Alternancia de fondos: lavanda → blanco → crema → sage → oliva → crema (aprox.) | PENDIENTE | — |
| Espacio negativo generoso — sin relleno innecesario | PENDIENTE | — |

### B7. Prohibiciones Absolutas

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Sin gradientes en ningun elemento | PENDIENTE | — |
| Sin sombras dramaticas (solo sombras sutiles en cards si aplica) | PENDIENTE | — |
| Sin texto directo sobre fotografias | PENDIENTE | — |
| Sin bounce, spin, flash en animaciones | PENDIENTE | — |
| Sin text-align:justify | PENDIENTE | — |
| Sin fotografias con rostros de ninos | PENDIENTE | — |
| Sin fotografias de instrumentos medicos o entornos clinicos | PENDIENTE | — |

### B8. Disclaimer Clinico

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Disclaimer visible en footer de TODAS las paginas (/, /perfil, /servicios, /contacto, /privacidad) | PENDIENTE | — |
| Disclaimer en /contacto visible ANTES de los canales de comunicacion | PENDIENTE | — |
| Texto del disclaimer comprensible para pacientes no tecnicos | PENDIENTE | — |

### B9. Cards de Servicios

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| Cards con border-radius 14px | PENDIENTE | — |
| Fondo de cards: #FFFFFF | PENDIENTE | — |
| Icono en cuadrado redondeado con fondo pastel de la paleta | PENDIENTE | — |
| Titulo de card en capitalizado (no ALL CAPS) | PENDIENTE | — |

### B10. Responsive y Movil

| Item | Estado | Defecto / Nota |
|------|--------|----------------|
| En movil (<768px): todo en 1 columna | PENDIENTE | — |
| Hero en tablet: foto arriba, texto abajo | PENDIENTE | — |
| Cards de servicios en movil: 1 columna | PENDIENTE | — |
| Boton primario full-width en movil | PENDIENTE | — |

**Resultado Seccion B — Fidelidad de Marca:** PENDIENTE  
**Items aprobados:** 0 / 10 categorias  
**Defectos Abiertos:** —

---

## Registro de Defectos

> Completar durante la revision. Un defecto = una fila.

| ID | Seccion | Descripcion del Defecto | Archivo Afectado | Severidad | Estado | Commit Fix |
|----|---------|------------------------|------------------|-----------|--------|------------|
| — | — | (sin defectos registrados — completar durante revision) | — | — | — | — |

---

## Resultado Final

| Seccion | Estado | Defectos Abiertos |
|---------|--------|-------------------|
| A1 — Lector de Pantalla | PENDIENTE | — |
| A2 — Solo Teclado | PENDIENTE | — |
| A3 — Movil 375px | PENDIENTE | — |
| A4 — Movimiento Reducido | PENDIENTE | — |
| A5 — Placeholders | PENDIENTE | — |
| B1 — Paleta de Colores | PENDIENTE | — |
| B2 — Tipografia | PENDIENTE | — |
| B3 — Tracking | PENDIENTE | — |
| B4 — Botones y Formas | PENDIENTE | — |
| B5 — Logo e Isotipo | PENDIENTE | — |
| B6 — Separacion de Secciones | PENDIENTE | — |
| B7 — Prohibiciones Absolutas | PENDIENTE | — |
| B8 — Disclaimer Clinico | PENDIENTE | — |
| B9 — Cards de Servicios | PENDIENTE | — |
| B10 — Responsive y Movil | PENDIENTE | — |
| **TOTAL** | **PENDIENTE** | — |

---

## Aprobacion Final

**Instrucciones:** Al no tener defectos abiertos en ninguna seccion, completar aqui:

Revisado por: ___________  
Fecha de revision: ___________  
Plataformas probadas: ___________  
Lector de pantalla usado: ___________  

**Decision:** [ ] APROBADO para proceder a wave 6  
**Senal al ejecutor:** Escribir "aprobado" en el chat.

> Si hay defectos: documentarlos en el Registro de Defectos, corregir en el codigo,
> hacer commit y re-revisar los items afectados. Repetir hasta aprobar.
