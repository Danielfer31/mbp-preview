# Especificacion De Fase 1 - Sitio Publico MVP

## Objetivo

Construir un sitio publico estatico, rapido y accesible que presente informacion aprobada
de la Doctora Maria Bernarlda Pacheco Martelo y facilite contacto administrativo humano sin
almacenar datos de visitantes.

## Alcance

- Inicio con propuesta de valor aprobada.
- Perfil, experiencia y credenciales verificadas.
- Servicios y programas aprobados.
- Ubicacion, horarios y canales de contacto aprobados.
- Paginas de privacidad y condiciones de contacto.
- SEO tecnico, datos estructurados, sitemap y robots.
- CTA hacia contacto humano y canal alternativo.

## Exclusiones

- Formularios con almacenamiento.
- Agenda, reservas, dashboard y recordatorios.
- WhatsApp automatizado e IA.
- Analitica en el lanzamiento inicial.
- Diagnostico, triage o recomendaciones medicas.

## Criterios De Aceptacion

- Todo contenido medico tiene estado aprobado y evidencia cuando corresponda.
- El sitio no solicita ni almacena datos de visitantes.
- Los CTA muestran advertencia de no enviar informacion clinica.
- Navegacion principal y contacto funcionan con teclado y lector de pantalla.
- Cumple WCAG 2.2 AA en flujos principales.
- Objetivos moviles: LCP menor de 2,5 s, INP menor de 200 ms y CLS menor de 0,1.
- Build genera salida estatica portable en `dist/`.
- No existen secretos, vulnerabilidades altas abiertas ni rastreadores publicitarios.
- El entorno local y de preview puede utilizar placeholders registrados.
- El build de produccion falla si existe cualquier placeholder bloqueante.

## Puertas De Construccion Y Revision

- El desarrollo local puede iniciar usando `.planning/content/PLACEHOLDER-REGISTER.md`.
- Los CTA sin datos reales deben permanecer deshabilitados.
- Las descripciones medicas no aprobadas deben limitarse a nombres confirmados.
- No se usan datos reales de pacientes ni servicios pagos.

## Puertas De Produccion

- Todos los placeholders bloqueantes fueron reemplazados y aprobados.
- Credenciales verificables adjuntas.
- Responsable de privacidad y responsable operativo designados.
- Procedimientos para mensajes clinicos y urgencias aprobados.
- Revision juridica preliminar registrada.
- Auditoria de seguridad sin hallazgos altos.
