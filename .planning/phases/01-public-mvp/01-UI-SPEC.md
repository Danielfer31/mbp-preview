---
phase: 01
slug: public-mvp
status: draft
shadcn_initialized: false
preset: none
created: 2026-06-13
---

# Phase 01 — UI Design Contract
# Sitio Publico MVP — Doctora Maria Bernarlda Pacheco Martelo

> Contrato visual e interactivo para la Fase 1. Generado por gsd-ui-researcher.
> Verificado contra: REQUIREMENTS.md, 01-SPEC.md, 01-PLAN.md, 01-REVIEWS.md,
> LEGACY-MATERIAL-ANALYSIS.md, PLACEHOLDER-REGISTER.md.

---

## Design System

| Propiedad           | Valor                                                           | Fuente                        |
|---------------------|-----------------------------------------------------------------|-------------------------------|
| Tool                | none (CSS custom properties en `src/styles/tokens.css`)         | 01-PLAN.md Task 3             |
| Preset              | not applicable                                                  | —                             |
| Component library   | none — componentes Astro nativos                                | 01-PLAN.md stack              |
| Icon library        | none — SVG inline o unicode semantico                           | constraint: no dependencias   |
| Font                | System font stack (sin dependencia externa)                     | 01-PLAN.md Task 3 / WEB-05    |

**Razon de shadcn = no aplicable:** el stack es Astro estatico (HTML generado en build),
no React/Next.js/Vite con runtime. shadcn requiere componentes React con estado en cliente.
El patron correcto es CSS custom properties + componentes Astro sin JS de cliente salvo
donde sea estrictamente necesario.

---

## Spacing Scale

Escala base-8. Todos los valores son multiplos de 4. Referencia: `src/styles/tokens.css`.

| Token     | Valor | Variable CSS           | Uso declarado                                      |
|-----------|-------|------------------------|----------------------------------------------------|
| `xs`      | 4px   | `--space-xs`           | Gaps entre icono y etiqueta; padding inline mini   |
| `sm`      | 8px   | `--space-sm`           | Padding de badges, separacion de metadatos         |
| `md`      | 16px  | `--space-md`           | Padding interno de tarjetas y grupos de texto      |
| `lg`      | 24px  | `--space-lg`           | Espaciado entre secciones cortas; padding lateral  |
| `xl`      | 32px  | `--space-xl`           | Separacion entre bloques de contenido              |
| `2xl`     | 48px  | `--space-2xl`          | Breaks de seccion mayor (servicios, perfil)        |
| `3xl`     | 64px  | `--space-3xl`          | Espaciado de pagina (hero top/bottom padding)      |

Excepciones:
- Touch targets minimos: 44px x 44px (WCAG 2.2 SC 2.5.8). Los CTA que son enlaces de contacto
  deben tener area de toque de al menos 44px aunque el texto sea mas pequeno.
- Skip link: posicionado fuera de flujo, sin excepcion de escala.

---

## Typography

Stack de sistema (sin Google Fonts ni fuentes externas en Fase 1):

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
--font-weight-regular:  400;
--font-weight-semibold: 600;
```

Exactamente 4 roles, 2 pesos:

| Rol       | Tamano | Variable CSS         | Peso           | Line-height | Uso declarado                                      |
|-----------|--------|----------------------|----------------|-------------|---------------------------------------------------|
| Body      | 16px   | `--text-body`        | 400 (regular)  | 1.6         | Parrafos, descripciones, copy de secciones         |
| Label     | 14px   | `--text-label`       | 400 (regular)  | 1.4         | Etiquetas de estado, horarios, metadata secundaria |
| Heading   | 20px   | `--text-heading`     | 600 (semibold) | 1.25        | Titulos de seccion (h2, h3), nombre de servicios   |
| Display   | 28px   | `--text-display`     | 600 (semibold) | 1.15        | H1 de pagina, nombre de la doctora en hero         |

Nota de accesibilidad: el texto debe ser redimensionable hasta 200% sin perdida de
contenido ni desbordamiento (WCAG 1.4.4). Usar `rem` en implementacion, con base `1rem = 16px`.

Equivalencias en `rem`:
- `--text-body`:    `1rem`
- `--text-label`:  `0.875rem`
- `--text-heading`: `1.25rem`
- `--text-display`: `1.75rem`

---

## Color

Direccion visual: **Calido Familiar** (tambien referenciada como "Clinical Warmth").
Fuente de paleta: LEGACY-MATERIAL-ANALYSIS.md (candidata, no requiere aprobacion de la
doctora para implementacion tecnica — la aprobacion aplica al contenido medico, no al CSS).

Todos los pares de color deben pasar contraste WCAG 2.2 AA: minimo 4.5:1 para texto normal,
3:1 para texto grande (>=18px regular o >=14px bold) y componentes UI.

| Rol                 | Valor hex  | Variable CSS              | Uso declarado                                         |
|---------------------|------------|---------------------------|-------------------------------------------------------|
| Dominant (60%)      | `#FAF7F2`  | `--color-surface`         | Fondo de pagina, fondo de secciones alternadas        |
| Secondary (30%)     | `--`       | ver tabla extendida abajo  | Tarjetas, nav, footer, secciones de contraste         |
| Accent (10%)        | `#C17A4A`  | `--color-accent`          | Ver lista "Accent reservado para" abajo               |
| Text primary        | `#3B2A1A`  | `--color-text`            | Todo el cuerpo de texto sobre superficie              |
| Text secondary      | `#6B5040`  | `--color-text-muted`      | Metadata, labels, texto de ayuda                      |
| Destructive         | `#B91C1C`  | `--color-destructive`     | Solo advertencias de error funcional (ver uso abajo)  |

Tabla extendida de secundarios (30%):

| Variable CSS              | Valor hex  | Uso                                               |
|---------------------------|------------|---------------------------------------------------|
| `--color-surface-alt`     | `#F0EAE0`  | Secciones alternadas (servicios, perfil)          |
| `--color-surface-card`    | `#FFFFFF`  | Fondo de ServiceCard, SafeContactCard             |
| `--color-border`          | `#D6C9B8`  | Bordes de tarjeta, separadores                    |
| `--color-nav`             | `#FAF7F2`  | Fondo del Header (misma superficie, con sombra)   |
| `--color-footer`          | `#3B2A1A`  | Fondo de Footer oscuro para contraste             |
| `--color-footer-text`     | `#F0EAE0`  | Texto en footer (contraste sobre footer oscuro)   |

**Accent reservado EXCLUSIVAMENTE para:**
1. Boton primario de CTA (texto "Agendar consulta" / "Contactar") — estado enabled
2. Estado hover/focus de enlaces de contacto
3. Icono de estado de placeholder activo en `PlaceholderNotice`
4. Subrayado activo en navegacion principal (indicador de pagina actual)

El accent NO se usa en: texto corrido, backgrounds de secciones, decoraciones ilustrativas,
badges de estado pendiente, ni en ningun elemento sin intencion de accion del usuario.

**Destructive reservado EXCLUSIVAMENTE para:**
- Mensaje de advertencia "No envie informacion clinica por este canal" (icono + texto)
- Estado de CTA deshabilitado con razon visible (placeholder bloqueante activo)
- Ningun otro uso en Fase 1 (no hay acciones destructivas como eliminar/borrar)

**Verificacion de contraste obligatoria antes de produccion:**
- `#3B2A1A` sobre `#FAF7F2`: requiere verificacion (estimacion >10:1, pasa AA y AAA)
- `#C17A4A` sobre `#FAF7F2`: requiere verificacion (texto sobre fondo — puede fallar AA para
  texto normal 16px; usar solo para elementos grandes o iconos, nunca para body copy)
- `#F0EAE0` sobre `#3B2A1A` (footer): requiere verificacion (estimacion >8:1, pasa)

Nota: si `#C17A4A` no pasa 4.5:1 para texto, oscurecer a `#9C5E32` para CTAs con texto.

---

## Interaction States

Cada elemento interactivo debe tener todos los estados definidos. No se usa JS para estilos
de estado — solo CSS (:hover, :focus-visible, :disabled, :active).

| Estado          | CTA Boton primario                          | Enlace de texto                      | CTA Deshabilitado                       |
|-----------------|---------------------------------------------|--------------------------------------|-----------------------------------------|
| Default         | bg `--color-accent`, texto `#FAF7F2`        | texto `--color-accent`, sin subrayado | bg `--color-border`, texto `--color-text-muted` |
| Hover           | bg oscurecido 10% (`#9C5E32`)               | subrayado visible                    | sin cambio (cursor: not-allowed)        |
| Focus-visible   | outline 3px `--color-accent` offset 2px     | outline 3px `--color-accent` offset 2px | outline visible (accesibilidad)       |
| Active          | bg oscurecido 15%                           | color oscurecido                     | sin cambio                              |
| Disabled        | no aplica (usar CTA Deshabilitado)          | no aplica                            | `aria-disabled="true"`, no navigable   |

**Skip link:** posicionado con `position: absolute; left: -9999px` en default. En
`:focus-visible` aparece en top-left con fondo `--color-accent`, texto `#FAF7F2`, padding md.
Texto exacto: "Ir al contenido principal".

**Focus visible:** `outline: 3px solid var(--color-accent); outline-offset: 2px;` en TODOS
los elementos interactivos. Nunca `outline: none` sin reemplazo visible equivalente.

**Reduced motion:** toda animacion o transicion CSS debe envolverse en:
```css
@media (prefers-reduced-motion: no-preference) {
  /* transicion aqui */
}
```
Por defecto (sin media query) no hay movimiento.

---

## Layout & Responsive

Mobile-first. Breakpoints de referencia para `tokens.css`:

| Variable CSS         | Valor  | Uso                                            |
|----------------------|--------|------------------------------------------------|
| `--bp-sm`            | 480px  | Ajuste de tipografia display                   |
| `--bp-md`            | 768px  | Layout de 2 columnas en grid de servicios      |
| `--bp-lg`            | 1024px | Layout de navegacion horizontal, max-width     |

Ancho maximo de contenido: `--max-content: 1080px`, centrado con `margin-inline: auto`.
Padding lateral de pagina: `--space-lg` (24px) en movil, `--space-xl` (32px) en >=768px.

Grid de servicios: 1 columna en movil, 2 columnas en >=768px, 3 columnas en >=1024px.
ServiceCard: altura minima natural (no fija), padding interno `--space-md`.

---

## Component Inventory

Componentes Astro requeridos por 01-PLAN.md Task 3 y Task 4, con contrato visual:

| Componente               | Archivo destino                           | Descripcion visual                                                                 |
|--------------------------|-------------------------------------------|------------------------------------------------------------------------------------|
| `BaseLayout`             | `src/layouts/BaseLayout.astro`            | `<html lang="es">`, skip link, `<main id="main-content">`, ARIA landmarks         |
| `Header`                 | `src/components/Header.astro`             | Nav horizontal en >=lg, hamburger en movil, fondo `--color-nav`, sombra sutil      |
| `Footer`                 | `src/components/Footer.astro`             | Fondo `--color-footer`, texto `--color-footer-text`, disclaimer de no-clinica      |
| `PlaceholderNotice`      | `src/components/PlaceholderNotice.astro`  | Banner amarillo claro con icono de advertencia, texto en `--color-text`            |
| `ServiceCard`            | `src/components/ServiceCard.astro`        | Tarjeta `--color-surface-card`, borde `--color-border`, padding md, heading sm     |
| `SafeContactCard`        | `src/components/SafeContactCard.astro`    | CTA deshabilitado o habilitado segun placeholder; advertencia destructive visible  |
| `SeoHead`                | `src/components/SeoHead.astro`            | Solo `<head>` metadata — sin output visual                                         |

Composicion grafica temporal (sin fotos personales):
- Hero: gradiente suave de `--color-surface` a `--color-surface-alt`, con elemento
  tipografico prominente (nombre de la doctora) y monograma SVG como identidad visual.
- No se usan imagenes de stock de personas. Se permite ilustracion geometrica o botanica
  simple si no requiere dependencia externa.
- Placeholder de foto: rectangulo redondeado con fondo `--color-surface-alt`, icono SVG
  inline de silueta neutra, borde `--color-border`.

---

## ARIA Landmarks & Accessibility Contract

| Landmark         | Elemento HTML | Uso                                              |
|------------------|---------------|--------------------------------------------------|
| `<header>`       | `<header>`    | Navegacion principal, logo/nombre                |
| `<nav>`          | `<nav>`       | Lista de enlaces de navegacion con `aria-label`  |
| `<main>`         | `<main>`      | `id="main-content"` — destino del skip link      |
| `<footer>`       | `<footer>`    | Informacion legal, disclaimer, contacto fallback |

`lang="es"` en `<html>` (confirmado por Gemini review como requisito WCAG + SEO).

Todos los SVG decorativos: `aria-hidden="true"`.
Todos los SVG informativos: `role="img"` + `<title>` descriptivo.
CTA deshabilitado: `aria-disabled="true"` + `title` explicando por que esta deshabilitado.
Disclaimer clinico: `role="alert"` NO (es informacion estatica, no alerta de error);
usar `<aside aria-label="Aviso importante">` o inclusion directa en footer.

---

## Copywriting Contract

Todo el copy usa voz calida, serena y profesional. Espanol colombiano. Sin tuteo informal
ni lenguaje tecnico innecesario. Sin promesas medicas ni garantias de resultado.

| Elemento                        | Copy exacto                                                                                                  | Notas                                      |
|---------------------------------|--------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| CTA principal (habilitado)      | "Agendar consulta"                                                                                           | Boton primario de contacto                 |
| CTA principal (deshabilitado)   | "Informacion de contacto proximamente"                                                                       | Estado mientras PH-PHONE/PH-WHATSAPP activos |
| CTA alternativo                 | "Canal alternativo"                                                                                          | Visible cuando canal principal no disponible |
| Placeholder de datos            | "Informacion disponible proximamente"                                                                        | Texto de PH genericos                      |
| CTA deshabilitado tooltip       | "Este enlace estara disponible cuando se confirme la informacion de contacto."                               | `title` attribute                          |
| Disclaimer clinico (footer)     | "Este sitio es solo informativo. No envie sintomas, diagnosticos, resultados ni documentos medicos por ningun canal de contacto. En caso de urgencia, acuda al servicio de emergencias mas cercano." | Obligatorio en cada pagina (WEB-07) |
| Disclaimer clinico (CTA card)   | "No envie informacion clinica por este canal."                                                               | Junto a cada CTA de contacto               |
| Empty state — servicios         | "Los servicios disponibles se publicaran cuando esten confirmados."                                          | Seccion servicios con placeholders activos |
| Empty state — perfil            | "Las credenciales verificadas se publicaran proxiamente."                                                    | Credenciales pendientes                    |
| Error de build (produccion)     | "[validate-content] Produccion bloqueada: {n} placeholder(s) sin resolver: {lista de IDs}"                  | Output de scripts/validate-content.mjs     |
| Error 404                       | "Esta pagina no existe. Puede regresar al inicio o contactar directamente."                                  | Con enlace al home                         |
| Meta description (home)         | "Medicina pediatrica profesional en Barranquilla. Perfil, servicios y contacto de la Doctora Maria Bernarlda Pacheco Martelo." | Solo cuando PH-CITY confirmado |
| Meta description (placeholder)  | "Sitio profesional de medicina pediatrica. Informacion en proceso de verificacion."                          | Mientras placeholders bloqueantes activos  |

Acciones destructivas en Fase 1: ninguna desde la perspectiva del visitante (no hay formularios,
no hay cuentas, no hay datos que borrar). El unico patron "destructivo" es el disclaimer
de no enviar informacion clinica — tratado como advertencia informativa, no confirmacion.

---

## Privacy & No-Tracking Contract

Derivado de WEB-09, PRV-01, PRV-02, PRV-04:

- Cero scripts de analytics en el HTML generado.
- Cero cookies de seguimiento ni pixels de publicidad.
- Cero `<script>` de terceros salvo Cloudflare Turnstile (diferido a Fase con formulario).
- CSP en `public/_headers` debe bloquear `script-src` externo por defecto.
- No se usa `localStorage`, `sessionStorage` ni `IndexedDB`.
- Los enlaces de contacto (tel:, mailto:, wa.me) abren la app nativa del usuario —
  el disclaimer junto al CTA advierte sobre privacidad en canales externos.

---

## Registry Safety

| Registry        | Bloques usados | Safety Gate                          |
|-----------------|----------------|--------------------------------------|
| shadcn official | ninguno        | not applicable — Astro static, no React |
| third-party     | ninguno        | not applicable                          |

No se usan registros de componentes externos en Fase 1. Todo componente se implementa
como `.astro` nativo con CSS custom properties.

---

## Performance Contract

Derivado de WEB-05 y restriccion de sistema de fuentes:

| Metrica | Objetivo movil | Tecnica                                                    |
|---------|----------------|------------------------------------------------------------|
| LCP     | < 2.5s         | Sistema de fuentes (0 FOIT), sin imagenes externas en hero |
| INP     | < 200ms        | Cero JS de cliente en Fase 1 salvo navegacion hamburger    |
| CLS     | < 0.1          | Dimensiones explicitas en placeholders de imagen           |

JS de cliente permitido en Fase 1: solo toggle de menu movil (sin framework).
Peso estimado de JS: < 1KB inline.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
