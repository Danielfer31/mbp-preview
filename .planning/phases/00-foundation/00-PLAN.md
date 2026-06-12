# Fase 0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox
> syntax for tracking.

**Goal:** Completar la informacion, decisiones, controles y evidencia necesarios para
autorizar la construccion del sitio publico MVP.

**Architecture:** La fase produce documentos y prototipos desechables; no crea produccion.
Las decisiones se registran como ADR y deben respetar la politica gratuito-primero.

**Tech Stack:** Markdown, Git, prototipos locales de Astro y Next.js, herramientas gratuitas
de validacion.

---

### Task 1: Completar Insumos Humanos

**Files:**
- Modify: `.planning/phases/00-foundation/00-INPUTS.md`
- Create: `.planning/content/CONTENT-INVENTORY.md`

- [ ] Solicitar y registrar todas las respuestas obligatorias de `00-INPUTS.md`.
- [ ] Marcar cada contenido como aprobado, pendiente o rechazado.
- [ ] Adjuntar referencia verificable para credenciales publicables.
- [ ] Confirmar canal alternativo y procedimiento ante mensajes clinicos.
- [ ] Registrar aprobacion con fecha y nombre.

**Expected evidence:** `00-INPUTS.md` sin campos obligatorios vacios y contenido inventariado.

### Task 2: Designar Responsables

**Files:**
- Modify: `.planning/RACI.md`
- Modify: `.planning/RISK-REGISTER.md`

- [ ] Asignar nombres a doctora/aprobadora, coordinacion tecnica, privacidad y operacion.
- [ ] Confirmar quien puede aprobar costos y produccion.
- [ ] Asignar propietario a cada riesgo alto.
- [ ] Verificar que ningun rol bloqueante quede sin persona.

**Expected evidence:** RACI nominal y riesgos altos con propietario.

### Task 3: Ejecutar Spikes De Stack

**Files:**
- Modify: `.planning/phases/00-foundation/00-RESEARCH.md`
- Create: `.planning/adr/ADR-005-web-stack.md`
- Create: `.planning/adr/ADR-008-hosting.md`
- Create: `.planning/adr/ADR-009-analytics.md`

- [ ] Crear prototipo local equivalente en Astro y Next.js estatico.
- [ ] Medir build, JavaScript cliente, accesibilidad y compatibilidad de despliegue.
- [ ] Verificar limites y terminos en fuentes oficiales.
- [ ] Seleccionar la opcion mas simple que cumpla requisitos.
- [ ] Documentar alternativa y procedimiento de salida.

**Expected evidence:** ADR aprobados, con resultados reproducibles y sin servicio pago.

### Task 4: Cerrar Privacidad Y Amenazas

**Files:**
- Create: `.planning/privacy/DATA-MAP.md`
- Create: `.planning/privacy/PRIVACY-BASELINE.md`
- Modify: `.planning/phases/00-foundation/00-THREAT-MODEL.md`
- Modify: `.planning/phases/00-foundation/00-RUNBOOK.md`

- [ ] Dibujar flujo de datos del MVP.
- [ ] Demostrar que el sitio no almacena datos de pacientes.
- [ ] Definir textos para evitar recepcion de sintomas o documentos.
- [ ] Revisar amenazas con responsables designados.
- [ ] Registrar revision juridica preliminar o bloqueo.

**Expected evidence:** mapa de datos y controles aprobados.

### Task 5: Definir Calidad Y Backlog De Fase 1

**Files:**
- Create: `.planning/phases/01-public-mvp/01-SPEC.md`
- Create: `.planning/phases/01-public-mvp/01-PLAN.md`
- Create: `.planning/phases/01-public-mvp/01-VERIFICATION.md`
- Modify: `.planning/TRACEABILITY.md`

- [ ] Convertir requisitos F1 en criterios falsables.
- [ ] Crear tareas pequenas con archivos, pruebas y resultados esperados.
- [ ] Definir validaciones de build, accesibilidad, rendimiento, seguridad y E2E.
- [ ] Enlazar cada requisito activo a tarea y prueba.

**Expected evidence:** paquete ejecutable de Fase 1 con trazabilidad completa.

### Task 6: Configurar Fundacion Tecnica

**Files:**
- Create: `.github/workflows/docs.yml`
- Create: `.github/dependabot.yml`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] Crear validacion documental y de enlaces sin secretos.
- [ ] Configurar actualizaciones de dependencias cuando exista manifiesto.
- [ ] Validar que el repositorio pueda clonarse y verificarse limpiamente.
- [ ] Revisar visibilidad del repositorio antes de conectarlo a GitHub.

**Expected evidence:** validaciones verdes y repositorio reproducible.

### Task 7: Auditoria De Salida

**Files:**
- Modify: `.planning/phases/00-foundation/00-VERIFICATION.md`
- Create: `.planning/phases/00-foundation/00-EXIT-AUDIT.md`
- Modify: `.planning/STATE.md`

- [ ] Verificar individualmente V-01 a V-12.
- [ ] Clasificar hallazgos y asignar tratamiento.
- [ ] Bloquear salida si existe un hallazgo critico o alto abierto.
- [ ] Autorizar Fase 1 solo con evidencia completa.
- [ ] Actualizar estado y siguiente accion.

**Expected evidence:** auditoria de salida firmada y decision explicita.

