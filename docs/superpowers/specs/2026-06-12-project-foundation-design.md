# Diseno De Fundacion Y Gobierno Del Proyecto

## Decision

El proyecto adopta una estrategia de MVP gratuito y progresivo. Primero se valida una
experiencia publica profesional, accesible, privada y medible. La agenda digital, la
bandeja compartida, las automatizaciones y la IA se incorporan solamente cuando exista
evidencia de necesidad, capacidad operativa y beneficio.

## Problema Que Resuelve

La doctora necesita presencia digital confiable y un camino simple para que potenciales
pacientes conozcan servicios y soliciten contacto. El proyecto debe evitar crear una
plataforma operativamente costosa antes de conocer demanda, procesos reales y restricciones
de privacidad.

## Enfoques Considerados

1. Plataforma completa desde el inicio: descartada por costo y sobrearquitectura.
2. SaaS gratuitos como dependencia principal: util para acelerar, pero sujeto a limites
   y cambios comerciales.
3. MVP estatico y progresivo: seleccionado porque reduce costo, superficie de ataque y
   mantenimiento, sin bloquear evolucion futura.

## Arquitectura Progresiva

### Etapa Inicial

- Sitio publico estatico con TypeScript.
- Contenido versionado en Git; CMS solo si el flujo editorial demuestra necesitarlo.
- Hosting estatico gratuito.
- Analitica privada sin identificacion personal.
- Contacto mediante telefono, correo o WhatsApp humano, con advertencia de no enviar
  informacion clinica.

### Etapa De Agenda

- Easy!Appointments es la opcion preferida por ser open source y self-hosted.
- Su adopcion depende de validar alojamiento, backups, soporte y costo operativo.
- Hasta entonces, la autoridad es el procedimiento manual definido por la doctora.

### Etapa De Automatizacion

- Chatwoot, orquestador, automatizaciones e IA permanecen diferidos.
- Cada componente requiere ADR, amenaza, presupuesto, responsable y prueba de beneficio.
- La IA nunca diagnostica, hace triage ni ejecuta acciones sin politicas deterministas.

## Limites

- No historia clinica, resultados, formulas, documentos o pagos en el MVP.
- No formularios que inviten a describir sintomas.
- No WhatsApp no oficial.
- No herramienta nueva sin evaluacion gratuito-primero.

## Criterio De Exito

El proyecto puede iniciar cuando exista una fuente unica de verdad, requisitos trazables,
responsables provisionales, presupuesto por escenarios, paquete ejecutable de Fase 0 y
auditoria que no tenga hallazgos altos sin tratamiento.

