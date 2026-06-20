# Manual Ejecutivo Del Sitio - Design Spec

Fecha: 2026-06-20
Estado: aprobado para planificacion
Audiencia principal: equipo de diseno y marketing
Entregable final: PDF ejecutivo con screenshots anotados

## Objetivo

Crear un PDF visual, claro y presentable que explique al equipo de diseno y marketing
como leer, mantener y comunicar el sitio web de la Doctora Maria Bernarlda Pacheco
Martelo.

El manual debe explicar que muestra cada segmento del sitio, que debe comunicar,
por que fue disenado asi y que debe cuidarse si se modifica. No es un documento de
venta comercial ni una documentacion tecnica pesada.

## Estado Y Restricciones Del Proyecto

- El sitio esta en estado de preview local avanzado.
- Produccion sigue bloqueada por placeholders, datos reales y aprobaciones humanas.
- El manual debe marcar el estado como "Preview en revision".
- Ningun contenido medico pendiente debe presentarse como aprobado.
- No se deben ocultar placeholders si aparecen en screenshots.
- No se debe sugerir diagnostico, triage, recomendaciones medicas ni automatizacion
  clinica.
- El contacto debe explicarse como contacto administrativo humano y seguro.

## Enfoque Editorial Aprobado

El manual se organizara como un mapa de recorrido del sitio:

1. Inicio.
2. Servicios.
3. Perfil.
4. Contacto.
5. Avisos, privacidad y footer.

Cada pagina o segmento usara cuatro bloques breves:

- Que muestra.
- Que debe comunicar.
- Por que se diseno asi.
- Que cuidar al modificarlo.

El tono debe ser ejecutivo, calido, visual y concreto. El equipo debe poder entender
cada pagina en menos de un minuto.

## Formato Visual

Formato recomendado: A4 horizontal o 16:9 horizontal, pensado principalmente para
revision en pantalla y envio digital.

Rango estimado: 18 a 28 paginas.

Reticula:

- 12 columnas.
- Margenes amplios.
- Screenshot principal ocupando 60 a 70 por ciento de la pagina.
- Columna lateral de explicacion ocupando 25 a 35 por ciento.
- Banda fina para metadatos, seccion y numero de pagina.

Cada screenshot puede tener hasta 5 anotaciones numeradas. Si una seccion necesita
mas explicacion, se crea una pagina de zoom o recorte, no se sobrecarga la captura.

## Sistema De Paginas

### Portada

Debe incluir:

- Titulo: Manual ejecutivo del sitio web.
- Subtitulo: Doctora Maria Bernarlda Pacheco Martelo.
- Estado: Preview local / contenido pendiente de aprobacion.
- Fecha y version.
- Captura parcial del home, enmarcada con sobriedad.
- Tres sellos pequenos: Pediatria, Confianza, Contacto humano.

### Resumen Ejecutivo

Explica en una pagina:

- Proposito del sitio.
- Audiencia del sitio.
- Tono de comunicacion.
- Restricciones de privacidad y produccion.
- Idea central: confianza profesional, calidez y contacto responsable.

### Sistema Visual

Explica:

- Paleta.
- Tipografia.
- Formas organicas.
- Fotografia.
- Iconografia.
- Espaciado y aire visual.
- Uso de placeholders y estados pendientes.

### Mapa De Recorrido

Muestra el flujo:

Inicio -> Servicios -> Perfil -> Contacto -> Avisos/Privacidad.

Debe explicar que el sitio no busca resolver casos medicos en linea, sino orientar,
generar confianza y llevar a canales administrativos humanos.

### Paginas Anotadas

Para cada pagina principal:

- Screenshot general.
- Anotaciones numeradas.
- Bloque lateral con mensaje, decision y cuidado.
- Nota de estado si hay contenido pendiente.

### Secciones Ampliadas

Se usaran cuando una parte necesite explicacion especial:

- Hero de inicio.
- Tarjetas de servicios.
- Detalle de servicio.
- Stories o tarjetas de perfil.
- Canales de contacto.
- Avisos clinicos y privacidad.
- Footer.

### Guia Para El Equipo

Debe separar:

- Puede cambiarse por diseno/marketing.
- Requiere aprobacion medica.
- Requiere aprobacion legal o privacidad.
- Requiere revision tecnica.
- No debe modificarse sin nueva decision.

### Cierre

Debe resumir:

- Mensaje central del sitio.
- Criterios de consistencia.
- Pendientes antes de produccion.

## Estilo De Anotaciones

Las anotaciones deben ser discretas y legibles:

- Circulos numerados pequenos.
- Lineas finas de conexion.
- Color oliva o teal.
- Caja lateral con numero, titulo corto y texto de 1 a 2 lineas.
- Etiquetas funcionales: Confianza, Accion, Privacidad, Jerarquia, Accesibilidad,
  Contenido pendiente.

Evitar flechas grandes, exceso de llamadas visuales o texto sobre screenshots cuando
baje la legibilidad.

## Paleta Para El Manual

Usar la paleta visual vigente del proyecto:

- Oliva: #2D320F.
- Lavanda: #DCCDFF.
- Sage: #C8CD91.
- Teal: #87AAAF.
- Crema: #F0F0E6.
- Blanco: #FFFFFF.

Aplicacion:

- Fondo principal: blanco o crema.
- Texto principal: oliva.
- Anotaciones: teal y oliva.
- Lavanda: acento suave o separador.
- Sage: fondos secundarios o chips.
- Alertas: tono sobrio; evitar rojo salvo riesgo real.

El color debe organizar la lectura, no decorar.

## Tratamiento De Screenshots

Reglas:

- Capturar desktop y mobile cuando cambie la experiencia.
- No deformar screenshots.
- Mantener escala consistente.
- Usar recortes con intencion.
- Mantener visibles los placeholders.
- Marcar placeholders como pendientes.
- Revisar legibilidad en el PDF exportado, no solo en la vista HTML.

Capturas esperadas:

- Home desktop desde `preview-fullscreen.html`.
- Servicios desktop y mobile.
- Perfil desktop y mobile.
- Contacto desktop y mobile.
- Avisos importantes.
- Detalle de servicio.
- Menu movil abierto si el estado existe.
- Recortes de secciones clave.

## Herramientas Investigadas

Se investigaron rutas open source y GitHub para producir un PDF visual de alta
calidad.

| Herramienta | Uso | Evaluacion |
|---|---|---|
| Playwright / Chromium | Exportar HTML/CSS local a PDF | Recomendado como ruta principal. Ya existe en el stack y respeta mejor el resultado de navegador. |
| Puppeteer | Exportar HTML/CSS a PDF | Buena alternativa, pero duplicaria capacidades ya cubiertas por Playwright. |
| WeasyPrint | HTML/CSS a PDF con Python | Util para documentos estaticos, pero puede diferir del render real de Astro/Chromium. |
| Paged.js | Paginacion editorial con CSS | Util si Playwright puro se queda corto en paginacion avanzada. |
| Vivliostyle | Publicacion editorial HTML/Markdown a PDF | Segunda opcion si el manual se vuelve una publicacion recurrente o mas compleja. |
| Marp | Markdown a PDF tipo slides | Util si el entregable cambia a presentacion, no para manual anotado. |
| Slidev | Deck visual exportable a PDF | Potente para presentaciones, mas pesado para manual. |
| Quarto | Documentos reproducibles y tecnicos | Mejor para informes tecnicos que para manual visual desde Astro. |
| ReportLab | PDF programatico con Python | No recomendado para este caso por la cantidad de layout manual requerido. |

Decision propuesta: construir el manual como HTML/CSS local y exportarlo con
Playwright/Chromium.

## Arquitectura Propuesta Del Entregable

El manual debe tener una fuente de contenido clara y una salida PDF verificable.

Ruta recomendada:

1. Crear una plantilla HTML/CSS especifica para el manual.
2. Capturar screenshots del preview local con Playwright.
3. Insertar screenshots en paginas de manual con anotaciones.
4. Exportar el manual completo a PDF con Playwright.
5. Renderizar paginas del PDF a imagen para verificar legibilidad, cortes y alineacion.

Ubicaciones sugeridas:

- `docs/manual-ejecutivo/` para contenido fuente, notas y assets.
- `output/pdf/` para el PDF final.
- `tmp/pdfs/` para renders temporales de verificacion.

## Criterios De Calidad

- El PDF se entiende sin explicacion oral.
- Cada pagina tiene una idea principal.
- Ninguna captura tiene mas de 5 anotaciones.
- El texto es legible en pantalla y al imprimir.
- Los placeholders se entienden como pendientes.
- Los avisos clinicos y de privacidad no se diluyen.
- Las decisiones visuales se conectan con intencion de comunicacion.
- Las recomendaciones distinguen entre cambios libres y cambios con aprobacion.
- El PDF final se valida visualmente despues de exportarlo.

## Criterios De Exito

- Existe un PDF ejecutivo con portada, resumen, mapa de recorrido, paginas anotadas,
  guia de equipo y cierre.
- El PDF incluye screenshots reales del preview.
- El equipo de diseno/marketing puede usarlo para entender que transmite cada seccion.
- El documento evita tecnicismos innecesarios.
- El documento no presenta contenido pendiente como aprobado.
- La produccion del PDF puede repetirse localmente.

## Fuentes Consultadas

- Playwright: https://github.com/microsoft/playwright
- Puppeteer: https://github.com/puppeteer/puppeteer
- WeasyPrint: https://github.com/Kozea/WeasyPrint
- Paged.js: https://github.com/pagedjs/pagedjs
- Vivliostyle CLI: https://github.com/vivliostyle/vivliostyle-cli
- Marp CLI: https://github.com/marp-team/marp-cli
- Slidev: https://github.com/slidevjs/slidev
- Quarto CLI: https://github.com/quarto-dev/quarto-cli
- ReportLab: https://docs.reportlab.com/install/open_source_installation/
- NN/g UX Deliverables: https://www.nngroup.com/articles/ux-deliverables-glossary/
- NHS Service Manual: https://service-manual.nhs.uk/
- W3C WCAG Contrast: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

