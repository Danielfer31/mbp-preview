/**
 * src/lib/placeholders.ts
 *
 * Lista canonica de IDs de placeholder que bloquean produccion.
 * Copiados literalmente de .planning/content/PLACEHOLDER-REGISTER.md
 * columna "Bloquea produccion = Si".
 *
 * IMPORTANTE: blocksProduction NO es un campo editable en los JSON de contenido.
 * La derivacion de bloqueo ocurre aqui, en codigo versionado, no en datos mutables.
 * Esto cierra la amenaza H1 (T-01-04): un editor no puede poner blocksProduction:false
 * en un JSON para evadir la puerta de produccion.
 */

export const BLOCKING_PLACEHOLDER_IDS: readonly string[] = [
  'PH-PROFESSIONAL-TITLE',
  'PH-PROFESSIONAL-REGISTRY',
  'PH-SERVICE-DESCRIPTIONS',
  'PH-SPECIAL-PROGRAM-NAMES',
  'PH-AGE-RANGE',
  'PH-CARE-MODALITY',
  'PH-CITY',
  'PH-ADDRESS',
  'PH-PUBLIC-HOURS',
  'PH-PHONE',
  'PH-EMAIL',
  'PH-WHATSAPP',
  'PH-ALTERNATE-CHANNEL',
  'PH-CLINICAL-MESSAGE-PROCEDURE',
  'PH-EMERGENCY-PROCEDURE',
  'PH-PRIVACY-OWNER',
  'PH-OPERATIONS-OWNER',
  'PH-PRODUCTION-APPROVER',
  'PH-LEGAL-REVIEW',
  'PH-DOMAIN',
  'PH-ANNUAL-BUDGET',
] as const;
