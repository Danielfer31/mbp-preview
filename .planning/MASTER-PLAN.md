# Plan Maestro Canonico

## Estrategia

El producto se entrega mediante incrementos verticales. Cada fase debe producir valor
verificable y puede detenerse sin dejar una plataforma innecesariamente compleja.

```text
Fase 0: Gobierno y descubrimiento
  -> Fase 1: Sitio publico y contacto humano
  -> Fase 2: Agenda digital validada
  -> Fase 3: Operacion y observabilidad
  -> Fase 4: WhatsApp oficial y automatizaciones limitadas
  -> Fase 5: IA administrativa en modo sombra, solo si se aprueba
  -> Fase 6: Piloto y produccion controlada
```

## Regla Gratuito-Primero

Toda seleccion debe comparar:

- Costo de licencia.
- Costo de infraestructura.
- Horas mensuales de mantenimiento.
- Riesgo de privacidad y dependencia.
- Limites del plan gratuito.
- Costo y procedimiento de salida.

Una herramienta gratuita puede rechazarse si aumenta el riesgo o el costo total.

## Arquitectura Objetivo Por Horizonte

### Horizonte 1: MVP Publico

```text
Repositorio Git -> generador estatico -> hosting estatico
                         |
                         +-> analitica privada
                         +-> CTA telefono/correo/WhatsApp humano
```

No se almacena informacion de pacientes en el sitio durante este horizonte.

### Horizonte 2: Agenda

```text
Sitio publico -> adaptador de agenda -> Easy!Appointments
                                     -> procedimiento manual de contingencia
```

Antes de permitir reservas reales se debe validar autenticacion, backups, restauracion,
zonas horarias, privacidad, costo de alojamiento y soporte.

### Horizonte 3: Operacion Y Automatizacion

Un orquestador, Chatwoot, colas o IA solo se agregan cuando un ADR demuestra que el proceso
manual ya no cumple objetivos medibles.

## Puertas De Adopcion

Una capacidad diferida entra al plan activo solo cuando tiene:

1. Problema y metrica de exito.
2. Responsable humano.
3. Comparacion de al menos una alternativa gratuita.
4. Presupuesto total de propiedad.
5. Modelo de amenazas y mapa de datos.
6. Estrategia de salida y contingencia.
7. Aprobacion humana registrada.

## Metodo De Trabajo

- Especificacion antes de implementacion.
- Tareas pequenas y trazables.
- Pruebas proporcionales al riesgo.
- Revision funcional y de seguridad.
- Despliegue de prueba antes de produccion.
- Documentacion y evidencia como parte del entregable.

## Puertas Obligatorias

### Diseno

- Fuente unica de verdad vigente.
- Requisitos, exclusiones y criterios inequivocos.
- Herramientas evaluadas con politica gratuito-primero.
- Responsables y decisiones criticas identificados.

### Implementacion

- Pruebas y controles aplicables aprobados.
- Sin secretos ni datos reales en repositorio o fixtures.
- Accesibilidad y rendimiento verificados.
- Dependencias y licencias revisadas.

### Privacidad Y Seguridad

- Datos minimizados y finalidad documentada.
- Sin contenido clinico en formularios, logs o analitica.
- Sin hallazgos criticos o altos abiertos.
- Incidentes, eliminacion y canal alternativo documentados.

### Produccion

- Aprobacion de la doctora.
- Revision juridica y de privacidad.
- Dominio, accesos, responsables y recuperacion confirmados.
- Auditoria independiente de preparacion aprobada.

## Condiciones Que Bloquean Produccion

- Dos fuentes de verdad activas.
- Contenido medico sin aprobacion.
- Datos personales sin finalidad, retencion o responsable.
- Herramienta sin propietario, costo total o alternativa.
- Backups requeridos sin restauracion probada.
- Hallazgos criticos o altos abiertos.
- Automatizacion que pueda emitir consejo clinico.
