# Especificacion De Fase 0 - Fundacion Y Descubrimiento

## Objetivo

Dejar el proyecto listo para construir el sitio publico MVP sin decisiones criticas,
datos, responsables o riesgos indefinidos.

## Resultado Observable

Al cerrar la fase, una persona tecnica que no participo en la planificacion puede iniciar
la Fase 1 usando exclusivamente este repositorio, y el auditor puede verificar cada decision
mediante evidencia.

## Entregables Obligatorios

1. Insumos de identidad, servicios, sedes, contacto y preferencias aprobados.
2. Inventario de contenido y credenciales verificables.
3. ADR de generador web, hosting, contenido y analitica.
4. Mapa de datos que demuestre que el MVP no almacena datos de pacientes.
5. Modelo de amenazas actualizado.
6. Responsables humanos designados para contenido, tecnica, privacidad y operacion.
7. Backlog de Fase 1 trazado a requisitos.
8. Flujo de calidad automatizable definido.
9. Runbook inicial de incidentes, rollback y canal alternativo.
10. Auditoria de salida sin hallazgos altos abiertos.

## Criterios De Aceptacion

- `00-INPUTS.md` no contiene campos obligatorios sin respuesta.
- Toda afirmacion medica o credencial propuesta tiene estado y aprobador.
- Cada herramienta seleccionada tiene fuente oficial, limites, costo total y alternativa.
- El ADR selecciona una arquitectura estatica compatible con el MVP.
- El mapa de datos no contiene sintomas, diagnosticos, documentos o historias clinicas.
- La matriz de trazabilidad cubre todos los requisitos activos de Fase 1.
- Los responsables bloqueantes tienen nombre o una decision explicita de no avanzar.
- La auditoria de salida clasifica y trata todos los hallazgos.

## Limites

- No crear el sitio productivo.
- No crear cuentas con facturacion.
- No contratar dominio o servicios.
- No recopilar datos reales de pacientes.
- No implementar agenda, dashboard, Chatwoot, automatizacion o IA.

## Decisiones Permitidas

- Seleccionar generador web y estrategia de contenido.
- Seleccionar herramientas gratuitas para desarrollo y entorno de prueba.
- Crear repositorio remoto privado o publico solo con aprobacion humana.

## Ambiguedades Conocidas

- Nombre correcto y especialidad de la doctora.
- Ciudad, sedes, horarios y datos de contacto.
- Existencia de dominio, identidad visual, fotografias y contenido.
- Personas que ocuparan roles de privacidad y operacion.

Estas ambiguedades bloquean Fase 1, pero no bloquean iniciar Fase 0.

