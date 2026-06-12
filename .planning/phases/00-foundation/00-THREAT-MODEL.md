# Modelo De Amenazas Inicial

## Alcance

Fase 0 y MVP publico estatico. No cubre agenda, dashboard, WhatsApp automatizado ni IA,
porque esas capacidades estan diferidas.

## Activos

- Reputacion profesional de la doctora.
- Integridad del contenido medico y credenciales.
- Cuentas de repositorio, hosting, dominio y contenido.
- Datos de contacto publicados.
- Disponibilidad del sitio y canales humanos.

## Limites De Confianza

1. Equipo o agentes -> repositorio.
2. Repositorio -> proveedor de build y hosting.
3. Doctora -> contenido aprobado -> sitio publico.
4. Visitante -> canal externo de contacto humano.

## Amenazas Priorizadas

| ID | Amenaza | Probabilidad | Impacto | Control |
|---|---|---|---|---|
| T-01 | Publicacion de consejo medico incorrecto | Media | Alto | Aprobacion de la doctora y trazabilidad |
| T-02 | Compromiso de cuenta y modificacion del sitio | Media | Alto | MFA, minimo privilegio y revision |
| T-03 | Secreto incluido en Git o bundle | Media | Alto | Escaneo y ausencia de secretos en MVP |
| T-04 | Visitante envia informacion clinica por contacto | Alta | Alto | Advertencias y procedimiento humano |
| T-05 | Rastreador recopila datos innecesarios | Media | Alto | Sin publicidad; analitica opcional y revisada |
| T-06 | Dependencia vulnerable compromete build | Media | Medio | Dependabot, lockfile, CI y actualizaciones |
| T-07 | Suplantacion por dominio o contenido falso | Baja | Alto | Dominio controlado, TLS y credenciales verificables |
| T-08 | Caida del sitio impide contacto | Media | Medio | Canal alternativo visible |

## Riesgos No Aceptables

- Formularios que soliciten sintomas o documentos.
- Contenido medico generado o publicado sin aprobacion.
- Cuenta administrativa compartida sin trazabilidad.
- Secretos en repositorio.
- Analitica publicitaria.

## Revision

Actualizar antes de Fase 1 y cada vez que se agregue almacenamiento, formulario, agenda,
mensajeria o IA.

