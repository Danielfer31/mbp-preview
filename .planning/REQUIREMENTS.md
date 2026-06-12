# Requisitos Canonicos

Cada requisito debe tener fase, evidencia y criterio de aceptacion en `TRACEABILITY.md`.

## Negocio Y Gobierno

- `BUS-01`: La doctora aprueba por escrito identidad, especialidad, credenciales, servicios,
  sedes, horarios y canales antes de publicar.
- `BUS-02`: Cada fase tiene responsable, aprobador, alcance y criterio de salida.
- `BUS-03`: Existe una unica fuente de verdad dentro del repositorio canonico.
- `BUS-04`: Toda herramienta nueva cumple la politica gratuito-primero.
- `BUS-05`: Cada capacidad diferida requiere problema, metrica, costo total y aprobacion.
- `BUS-06`: Ninguna contratacion o cuenta con facturacion se activa sin aprobacion humana.

## Sitio Publico MVP

- `WEB-01`: Presentar perfil, credenciales verificables, servicios, sedes y contacto.
- `WEB-02`: Ofrecer CTA contextual hacia contacto humano y canal alternativo.
- `WEB-03`: Funcionar correctamente en navegadores modernos y pantallas moviles.
- `WEB-04`: Cumplir WCAG 2.2 AA en flujos principales.
- `WEB-05`: Alcanzar en movil LCP < 2.5 s, INP < 200 ms y CLS < 0.1 en pruebas objetivo.
- `WEB-06`: Implementar titulos, descripciones, sitemap, robots y datos estructurados aplicables.
- `WEB-07`: Mostrar privacidad, condiciones de contacto y advertencia de no enviar sintomas
  o documentos medicos.
- `WEB-08`: No almacenar solicitudes de contacto durante el MVP inicial.
- `WEB-09`: No cargar rastreadores publicitarios ni analitica que identifique visitantes.
- `WEB-10`: Mantener un canal alternativo visible cuando el canal principal falle.

## Contenido

- `CNT-01`: Toda afirmacion medica publicada tiene autora, fecha y aprobacion de la doctora.
- `CNT-02`: Las credenciales publicadas son verificables y no exageradas.
- `CNT-03`: Imagenes y testimonios tienen autorizacion y procedencia documentadas.
- `CNT-04`: El contenido puede actualizarse sin modificar componentes de presentacion.
- `CNT-05`: Existe inventario de contenido, responsable y estado de aprobacion.

## Privacidad Y Seguridad

- `PRV-01`: El MVP minimiza datos y evita almacenar informacion de pacientes.
- `PRV-02`: Ningun canal administrativo solicita sintomas, diagnosticos, resultados o documentos.
- `PRV-03`: Se documentan finalidad, responsables, proveedores, retencion y eliminacion antes
  de almacenar datos personales.
- `PRV-04`: Secretos y credenciales nunca se almacenan en Git ni se exponen al navegador.
- `PRV-05`: Cuentas administrativas usan MFA y minimo privilegio cuando el proveedor lo permite.
- `PRV-06`: Formularios futuros requieren validacion, antiabuso, limites y mensajes seguros.
- `PRV-07`: Existe procedimiento de incidente, contacto de privacidad y canal alternativo.
- `PRV-08`: Produccion requiere revision juridica y de privacidad aplicable en Colombia.

## Operacion Y Continuidad

- `OPS-01`: Cada servicio externo tiene propietario, limite, costo, contingencia y salida.
- `OPS-02`: Cambios de produccion tienen procedimiento de rollback verificable.
- `OPS-03`: Datos futuros que requieran backup tienen RTO, RPO y restauracion probada.
- `OPS-04`: Dependencias y limites de planes gratuitos se revisan trimestralmente.
- `OPS-05`: El sitio publico puede reconstruirse desde el repositorio.

## Calidad Y Entrega

- `QA-01`: Cada tarea enlaza requisito y evidencia.
- `QA-02`: CI ejecuta formato, validacion, pruebas y build antes de integrar cambios.
- `QA-03`: Flujos publicos criticos tienen pruebas automatizadas de navegador.
- `QA-04`: Accesibilidad se valida automatica y manualmente.
- `QA-05`: Rendimiento se mide antes de publicar.
- `QA-06`: Dependencias y secretos se revisan antes de publicar.
- `QA-07`: Ningun hallazgo critico o alto abierto permite produccion.
- `QA-08`: Cada fase termina con verificacion y auditoria independiente.

## Evolucion Diferida

- `EVO-01`: Agenda digital solo se adopta con necesidad, costo total y operacion aprobados.
- `EVO-02`: Easy!Appointments es candidato preferido, no decision irreversible.
- `EVO-03`: WhatsApp automatizado usa exclusivamente Cloud API oficial.
- `EVO-04`: Chatwoot, colas y automatizaciones requieren justificacion por volumen real.
- `EVO-05`: IA administrativa se prueba primero en modo sombra y nunca responde contenido clinico.
- `EVO-06`: Toda accion automatizada futura usa politicas deterministas, auditoria y handoff humano.

