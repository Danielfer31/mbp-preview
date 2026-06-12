# Registro De Riesgos

| ID | Riesgo | Probabilidad | Impacto | Tratamiento | Propietario |
|---|---|---|---|---|---|
| R-01 | Publicar informacion medica incorrecta | Media | Alto | Aprobacion explicita de la doctora | Doctora |
| R-02 | Recopilar sintomas o datos clinicos por canales administrativos | Alta | Alto | Mensajes preventivos, minimizacion y procedimiento humano | Privacidad por designar |
| R-03 | Plan gratuito cambia o supera limites | Media | Medio | Registro, alertas y alternativa de salida | Tecnico |
| R-04 | Sobrearquitectura antes de validar demanda | Alta | Alto | Puertas de adopcion y MVP estatico | Coordinador |
| R-05 | Servicio self-hosted sin mantenimiento | Media | Alto | No adoptar sin responsable y presupuesto | Operacion |
| R-06 | Dependencia de un proveedor | Media | Medio | Exportacion y contingencia documentadas | Tecnico |
| R-07 | Cuenta o secreto comprometido | Media | Alto | MFA, minimo privilegio y gestion de secretos | Seguridad |
| R-08 | Ausencia de respuestas humanas bloquea el proyecto | Alta | Medio | Formulario de insumos y escalamiento | Coordinador |
| R-09 | Confusion con documentos antiguos | Media | Alto | Fuente canonica y registro de reemplazo | Coordinador |
| R-10 | Automatizacion o IA responde contenido clinico | Baja en MVP | Critico | IA excluida hasta fase controlada | Seguridad |

## Regla De Escalamiento

Todo riesgo alto sin tratamiento y propietario bloquea la fase relacionada.

