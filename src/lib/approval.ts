/**
 * src/lib/approval.ts
 *
 * Logica de aprobacion de contenido medico.
 * Cierra H1 (puerta de produccion no evadible) y H5 (aprobacion con evidencia).
 *
 * IMPORTANTE: blocksProduction NO viene de los JSON de contenido.
 * Se deriva exclusivamente de BLOCKING_PLACEHOLDER_IDS (lista canonica no editable).
 */
import { createHash } from 'node:crypto';

export interface ManifestEntry {
  contentId: string;
  contentHash: string;
  approvedBy: string;
  approvedAt: string;
  evidenceRef: string;
  status: 'approved' | 'revoked';
}

export interface ApprovalResult {
  approved: boolean;
  reason: string;
}

/**
 * Computa el SHA-256 hex de un valor de contenido.
 * El aprobador usa este hash para generar entradas de manifiesto.
 */
export function computeContentHash(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/**
 * Verifica si un contentId esta aprobado en el manifiesto para el valor dado.
 *
 * Reglas (todas deben cumplirse para retornar approved: true):
 * 1. Existe entrada en el manifiesto para contentId
 * 2. status === 'approved' (no 'revoked')
 * 3. El hash del valor actual coincide con el contentHash del manifiesto
 * 4. approvedBy, approvedAt y evidenceRef son no vacios y no solo-espacios
 */
export function verifyApproval(
  contentId: string,
  value: string,
  manifest: ManifestEntry[],
): ApprovalResult {
  const entry = manifest.find((e) => e.contentId === contentId);

  if (!entry) {
    return { approved: false, reason: `No entry in manifest for contentId: ${contentId}` };
  }

  if (entry.status === 'revoked') {
    return { approved: false, reason: `Approval revoked for contentId: ${contentId}` };
  }

  const currentHash = computeContentHash(value);
  if (currentHash !== entry.contentHash) {
    return {
      approved: false,
      reason: `Content hash mismatch for ${contentId}: content changed after approval`,
    };
  }

  const isBlank = (s: string) => /^\s*$/.test(s);
  if (isBlank(entry.approvedBy)) {
    return { approved: false, reason: `Missing or blank approvedBy for contentId: ${contentId}` };
  }
  if (isBlank(entry.approvedAt)) {
    return { approved: false, reason: `Missing or blank approvedAt for contentId: ${contentId}` };
  }
  if (isBlank(entry.evidenceRef)) {
    return {
      approved: false,
      reason: `Missing or blank evidenceRef for contentId: ${contentId}`,
    };
  }

  return { approved: true, reason: 'ok' };
}
