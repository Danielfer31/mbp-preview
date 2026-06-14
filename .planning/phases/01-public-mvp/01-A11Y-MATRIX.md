# Matriz de Accesibilidad Manual — MBP Sitio Publico MVP
# Phase 01 — Plan 07 Checkpoint de Revision Humana
# Creado: 2026-06-14 | Completar antes de aprobar wave 5 → wave 6

> **Proposito:** Complementar los tests automatizados de axe-core (plan 01-06)
> con evidencia manual de usabilidad real — especialmente con lector de pantalla,
> que axe no puede medir.
>
> **Instrucciones:** Para cada fila, anotar resultado (PASO / FALLO / N/A),
> descripcion del defecto si aplica, y evidencia (captura de pantalla o nota).
> Completar TODAS las filas antes de escribir "aprobado" en el chat.

---

## Seccion A — Lector de Pantalla (NVDA en Windows / VoiceOver en macOS)

Herramienta recomendada: **NVDA 2024.x + Chrome** (Windows) o **VoiceOver + Safari** (macOS).

| ID | Ruta Probada | Accion | Resultado Esperado | Resultado Real | Defecto | Evidencia |
|----|-------------|--------|--------------------|----------------|---------|-----------|
| SR-01 | `/` (Inicio) | Activar NVDA y navegar con Tab | El skip link "Ir al contenido principal" debe anunciarse primero | PENDIENTE | — | — |
| SR-02 | `/` (Inicio) | Navegar con flecha ↓ por la pagina | Cada heading (h1 → h2 → h3) debe anunciarse con su nivel. Sin saltos de nivel | PENDIENTE | — | — |
| SR-03 | `/` (Inicio) | Llegar al boton CTA deshabilitado "AGENDAR CITA" | NVDA debe anunciar "boton, deshabilitado" o equivalente. No debe activarse al pulsar Enter/Space | PENDIENTE | — | — |
| SR-04 | `/contacto` | Navegar por los canales de contacto | Cada canal debe anunciar su tipo (enlace, telefono, correo) y que abre aplicacion externa. El aviso "no enviar informacion medica" debe leerse antes de los canales | PENDIENTE | — | — |
| SR-05 | `/servicios` | Navegar por tarjetas de servicios | Cada tarjeta debe anunciar: nombre del servicio, descripcion breve (si existe). No debe haber textos repetidos "mas informacion mas informacion" sin contexto | PENDIENTE | — | — |
| SR-06 | `/perfil` | Navegar la seccion bio | La imagen de la doctora (placeholder) debe tener alt descriptivo anunciado. No alt="foto" ni alt vacio | PENDIENTE | — | — |
| SR-07 | `/privacidad` | Navegar la pagina | Headings deben anunciar estructura legal. Ningun vinculo "haz clic aqui" sin contexto | PENDIENTE | — | — |
| SR-08 | `/404` | Navegar la pagina | NVDA debe anunciar que la pagina no existe. El enlace de regreso debe ser comprensible sin contexto visual | PENDIENTE | — | — |

**Resultado seccion:** PENDIENTE  
**Defectos encontrados:** —  
**Fecha de prueba:** ___________  
**Herramienta usada:** ___________

---

## Seccion B — Navegacion Solo Teclado (sin raton)

Navegador: Chrome o Firefox. Sin extensiones de accesibilidad activas.

| ID | Ruta Probada | Accion | Resultado Esperado | Resultado Real | Defecto | Evidencia |
|----|-------------|--------|--------------------|----------------|---------|-----------|
| KB-01 | `/` (Inicio) | Pulsar Tab en foco inicial (URL bar) | El PRIMER elemento recibe foco visible: skip link "Ir al contenido principal" | PENDIENTE | — | — |
| KB-02 | `/` (Inicio) | Pulsar Enter sobre skip link | El foco salta a `<main>`, visible en la pantalla | PENDIENTE | — | — |
| KB-03 | Cualquier pagina | Tab por nav | Cada enlace de navegacion recibe foco con indicador de foco VISIBLE (outline >=2px, contraste >= 3:1) | PENDIENTE | — | — |
| KB-04 | Cualquier pagina | Tab por botones | Los CTAs deshabilitados deben ser OMITIDOS por Tab (no deben recibir foco) o anunciarse como deshabilitados claramente | PENDIENTE | — | — |
| KB-05 | `/contacto` | Tab por canales | Los enlaces de correo/telefono reciben foco. Al pulsar Enter abren el cliente o app correspondiente | PENDIENTE | — | — |
| KB-06 | Hamburger menu (movil) | Tab hasta boton menu + Enter | Menu se despliega. Tab navega DENTRO del menu. Escape cierra el menu y devuelve foco al boton de apertura | PENDIENTE | — | — |
| KB-07 | Cualquier pagina | Shift+Tab desde primer elemento | El foco retrocede en orden logico, sin trampas | PENDIENTE | — | — |

**Resultado seccion:** PENDIENTE  
**Defectos encontrados:** —  
**Fecha de prueba:** ___________

---

## Seccion C — Viewport Movil (375px / iPhone SE / Android clasico)

Herramienta: DevTools → Responsive Mode, o dispositivo fisico.

| ID | Ruta Probada | Accion | Resultado Esperado | Resultado Real | Defecto | Evidencia |
|----|-------------|--------|--------------------|----------------|---------|-----------|
| MO-01 | `/` (Inicio) | Verificar hero en 375px | Texto H1 visible sin overflow. Boton pill full-width o alineado correctamente | PENDIENTE | — | — |
| MO-02 | Cualquier pagina | Medir letra-espaciado en etiquetas ALL CAPS | Tracking <= 0.2em en <380px para evitar overflow horizontal | PENDIENTE | — | — |
| MO-03 | Cualquier pagina | Medir target de hamburger menu | Area tocable >= 44×44px (medir con DevTools → inspector de elementos) | PENDIENTE | — | — |
| MO-04 | Cualquier pagina | Medir targets de enlaces y botones | Todos >= 44×44px de area tocable (WCAG 2.2 SC 2.5.8) | PENDIENTE | — | — |
| MO-05 | `/servicios` | Ver grilla de tarjetas en movil | Cambio a 1 columna sin solapamientos. Texto legible sin hacer zoom | PENDIENTE | — | — |
| MO-06 | Cualquier pagina | Verificar disclaimer clinico | Visible en footer sin necesidad de hacer scroll horizontal | PENDIENTE | — | — |
| MO-07 | `/` | Verificar paleta de colores | Ningun color externo a la paleta (#2D320F / #DCCDFF / #C8CD91 / #87AAAF / #F0F0E6 / #FFFFFF) | PENDIENTE | — | — |

**Resultado seccion:** PENDIENTE  
**Defectos encontrados:** —  
**Fecha de prueba:** ___________

---

## Seccion D — prefers-reduced-motion

Activar en: Windows → Configuracion → Accesibilidad → Efectos visuales → Mostrar animaciones desactivado.  
O en DevTools → Emulate CSS media feature → prefers-reduced-motion: reduce.

| ID | Ruta Probada | Accion | Resultado Esperado | Resultado Real | Defecto | Evidencia |
|----|-------------|--------|--------------------|----------------|---------|-----------|
| RM-01 | `/` (Inicio) | Cargar pagina con reduced-motion activo | NO debe aparecer ninguna animacion: sin fade-in de secciones, sin translateY de scroll, sin transicion del isotipo | PENDIENTE | — | — |
| RM-02 | Cualquier pagina | Hover sobre botones | Transicion de color del boton puede mantenerse (<= 200ms, no movimiento). Sin bounce ni desplazamiento | PENDIENTE | — | — |
| RM-03 | Cualquier pagina | Hover sobre tarjetas | Sin translateY(-3px). El cambio de sombra puede mantenerse si no implica movimiento | PENDIENTE | — | — |
| RM-04 | Cualquier pagina | Desplazarse por la pagina | Sin parallax. Sin background-attachment:fixed en movil (ya debe estar desactivado — verificar) | PENDIENTE | — | — |

**Resultado seccion:** PENDIENTE  
**Defectos encontrados:** —  
**Fecha de prueba:** ___________

---

## Seccion E — Zoom al 200% (WCAG 1.4.4 — Resize Text)

Metodo: Ctrl/Cmd + (Chrome/Firefox). O DevTools → Zoom custom.

| ID | Ruta Probada | Accion | Resultado Esperado | Resultado Real | Defecto | Evidencia |
|----|-------------|--------|--------------------|----------------|---------|-----------|
| ZM-01 | `/` (Inicio) a 200% | Cargar pagina al 200% | Sin scroll horizontal. Todo el contenido visible. Sin texto cortado o solapado | PENDIENTE | — | — |
| ZM-02 | `/servicios` a 200% | Revisar grilla de tarjetas | Las tarjetas apilan correctamente. Sin overflow horizontal | PENDIENTE | — | — |
| ZM-03 | `/contacto` a 200% | Revisar avisos y canales | El disclaimer clinico NO desaparece ni queda fuera de pantalla | PENDIENTE | — | — |
| ZM-04 | Nav a 200% | Verificar menu de navegacion | Los enlaces del nav siguen siendo accesibles (colapsan a menu si aplica) | PENDIENTE | — | — |

**Resultado seccion:** PENDIENTE  
**Defectos encontrados:** —  
**Fecha de prueba:** ___________

---

## Resultado Final de la Matriz

| Seccion | Estado | Defectos Encontrados |
|---------|--------|---------------------|
| A — Lector de Pantalla | PENDIENTE | — |
| B — Solo Teclado | PENDIENTE | — |
| C — Viewport Movil | PENDIENTE | — |
| D — prefers-reduced-motion | PENDIENTE | — |
| E — Zoom 200% | PENDIENTE | — |
| **TOTAL** | **PENDIENTE** | — |

**Aprobacion:**  
Nombre del revisor: ___________  
Fecha: ___________  
Firma digital (descripcion): ___________

> Una vez completada esta matriz, actualizar `01-REVIEW.md` Seccion A con el resumen
> y escribir "aprobado" en el chat para desbloquear wave 6.
