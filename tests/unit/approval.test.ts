/**
 * Tests for src/lib/approval.ts
 * TDD RED phase: tests written before implementation
 */
import { describe, it, expect } from 'vitest';
import { computeContentHash, verifyApproval, type ManifestEntry } from '../../src/lib/approval';

describe('computeContentHash', () => {
  it('returns a hex string of 64 characters (sha256)', () => {
    const hash = computeContentHash('test value');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns the same hash for the same input', () => {
    const value = 'Especialidad en Medicina Pediatrica';
    expect(computeContentHash(value)).toBe(computeContentHash(value));
  });

  it('returns different hashes for different inputs', () => {
    const hash1 = computeContentHash('valor A');
    const hash2 = computeContentHash('valor B');
    expect(hash1).not.toBe(hash2);
  });

  it('is case-sensitive', () => {
    expect(computeContentHash('abc')).not.toBe(computeContentHash('ABC'));
  });
});

describe('verifyApproval', () => {
  const goodHash = computeContentHash('valor real aprobado');

  const validEntry: ManifestEntry = {
    contentId: 'PH-PROFESSIONAL-TITLE',
    contentHash: goodHash,
    approvedBy: 'Dra. Maria Bernarlda',
    approvedAt: '2026-06-13T00:00:00Z',
    evidenceRef: '.planning/evidence/titulo.pdf',
    status: 'approved',
  };

  const manifest: ManifestEntry[] = [validEntry];

  it('returns approved when all conditions are met', () => {
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor real aprobado', manifest);
    expect(result.approved).toBe(true);
  });

  it('rejects when contentId has no entry in manifest', () => {
    const result = verifyApproval('PH-NONEXISTENT', 'cualquier valor', manifest);
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/no entry/i);
  });

  it('rejects when status is revoked even if hash matches', () => {
    const revokedEntry: ManifestEntry = { ...validEntry, status: 'revoked' };
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor real aprobado', [revokedEntry]);
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/revoked/i);
  });

  it('rejects when content value produces a different hash (content changed after approval)', () => {
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor MODIFICADO', manifest);
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/hash/i);
  });

  it('rejects when approvedBy is empty', () => {
    const noApprover: ManifestEntry = { ...validEntry, approvedBy: '' };
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor real aprobado', [noApprover]);
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/approvedBy|evidence/i);
  });

  it('rejects when approvedAt is empty', () => {
    const noDate: ManifestEntry = { ...validEntry, approvedAt: '' };
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor real aprobado', [noDate]);
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/approvedAt|evidence/i);
  });

  it('rejects when evidenceRef is empty', () => {
    const noEvidence: ManifestEntry = { ...validEntry, evidenceRef: '' };
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor real aprobado', [noEvidence]);
    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/evidenceRef|evidence/i);
  });

  it('rejects when approvedBy is whitespace only', () => {
    const wsApprover: ManifestEntry = { ...validEntry, approvedBy: '   ' };
    const result = verifyApproval('PH-PROFESSIONAL-TITLE', 'valor real aprobado', [wsApprover]);
    expect(result.approved).toBe(false);
  });
});
