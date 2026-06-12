# Investigacion Obligatoria De Fase 0

## Regla De Evidencia

Usar fuentes oficiales primarias, registrar fecha de consulta y separar hechos verificados
de estimaciones.

## Spikes Requeridos

### R-01: Generador Estatico

Comparar Astro y exportacion estatica de Next.js mediante un prototipo minimo.

Medir:

- Complejidad de build y despliegue.
- JavaScript enviado al cliente.
- Manejo de contenido y metadatos.
- Compatibilidad con Cloudflare Pages.
- Accesibilidad y mantenimiento.

Resultado: ADR que seleccione una opcion sin bloquear migracion futura.

### R-02: Hosting Gratuito

Validar Cloudflare Pages, GitHub Pages y cualquier alojamiento existente.

Registrar:

- Limites.
- Dominio y TLS.
- Entornos de prueba.
- Rollback.
- Privacidad, terminos y procedimiento de salida.

### R-03: Contenido

Validar si Markdown/MDX cubre el flujo real. Sanity solo se recomienda si la doctora
necesita editar frecuentemente sin apoyo tecnico.

### R-04: Analitica

Verificar si Cloudflare Web Analytics es necesaria. La alternativa preferida es no instalar
analitica hasta definir metricas accionables.

### R-05: Agenda Futura

Investigar Easy!Appointments sin desplegarlo en produccion. Documentar requisitos de hosting,
MySQL, backups, actualizaciones, privacidad, exportacion y soporte.

## Fuentes Iniciales Verificadas El 2026-06-12

- Cloudflare Pages limits:
  https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare static assets billing:
  https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- Cloudflare Web Analytics:
  https://developers.cloudflare.com/web-analytics/about/
- Cloudflare Turnstile plans:
  https://developers.cloudflare.com/turnstile/plans/
- Sanity plans:
  https://www.sanity.io/docs/platform-management/plans-and-payments
- Easy!Appointments:
  https://easyappointments.org/blog/easyappointments-ecosystem-powering-appointment-scheduling-everywhere/

