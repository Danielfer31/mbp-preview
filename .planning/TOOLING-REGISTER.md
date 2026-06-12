# Registro De Herramientas Y Costos

Verificacion inicial: 2026-06-12. Los limites y precios pueden cambiar; deben comprobarse
en fuentes oficiales antes de adoptar cada herramienta.

## Herramientas Aprobadas Para Fase 0

| Necesidad | Herramienta | Tipo de costo | Decision | Evidencia |
|---|---|---|---|---|
| Repositorio local | Git | Software libre | Aprobada | Instalado localmente |
| Repositorio remoto | GitHub Free | Gratis con limites | Candidata; crear solo con aprobacion | https://github.com/pricing |
| Automatizacion CI | GitHub Actions | Gratis para repos publicos; privados sujetos al plan | Candidata; verificar privacidad del repo | https://github.com/features/actions |
| Actualizaciones | Dependabot | Disponible para repositorios GitHub | Candidata | https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/dependabot-quickstart |
| Documentacion | Markdown en Git | Sin licencia adicional | Aprobada | Este repositorio |

## Herramientas Preferidas Para MVP

| Necesidad | Preferida | Alternativa | Condicion de adopcion |
|---|---|---|---|
| Generador web | Astro estatico con TypeScript | Next.js exportado estaticamente | ADR en Fase 0 con prototipo de rendimiento y compatibilidad |
| Hosting estatico | Cloudflare Pages Free | GitHub Pages o alojamiento existente | Revisar limites y dominio |
| Analitica | Cloudflare Web Analytics | Sin analitica | Aprobar mapa de datos y configuracion |
| Antiabuso | Cloudflare Turnstile Free | Sin formulario almacenado | Adoptar solo si existe formulario |
| Contenido | Markdown/MDX en Git | Sanity Free | CMS solo si la doctora necesita editar sin Git |

## Herramientas Diferidas

| Necesidad | Opcion principal | Costo oculto | Puerta |
|---|---|---|---|
| Agenda | Easy!Appointments | Hosting, MySQL, backups, parches y soporte | Fase 2 |
| Bandeja compartida | Chatwoot Community | Servidor, base de datos, actualizaciones y operacion | Fase 4 |
| Automatizacion | Activepieces Community | Infraestructura, secretos y mantenimiento | Fase 4 |
| IA administrativa | Proveedor por seleccionar | Consumo, privacidad, evaluaciones y supervision | Fase 5 |

## Evidencia Oficial Verificada

- Cloudflare Pages Free limita los sitios a 20.000 archivos:
  https://developers.cloudflare.com/pages/platform/limits/
- Los activos estaticos de Cloudflare Workers son gratuitos y sin limite de solicitudes;
  la ejecucion de Workers usa sus cuotas:
  https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- Pages Functions comparte la cuota gratuita diaria de Workers:
  https://developers.cloudflare.com/pages/functions/pricing/
- Cloudflare Web Analytics se presenta como gratuita y orientada a privacidad:
  https://developers.cloudflare.com/web-analytics/about/
- Cloudflare Turnstile ofrece plan gratuito para la mayoria de aplicaciones:
  https://developers.cloudflare.com/turnstile/plans/
- Sanity crea proyectos en plan gratuito por defecto, con cuotas mensuales:
  https://www.sanity.io/docs/platform-management/plans-and-payments
- Easy!Appointments se presenta como open source y self-hosted:
  https://easyappointments.org/blog/easyappointments-ecosystem-powering-appointment-scheduling-everywhere/

## Regla De Rechazo

Una herramienta se rechaza aunque sea gratuita si exige recopilar datos innecesarios,
impide exportarlos, carece de mantenimiento razonable o supera la capacidad operativa.

