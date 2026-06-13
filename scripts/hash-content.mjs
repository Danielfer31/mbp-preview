#!/usr/bin/env node
/**
 * scripts/hash-content.mjs
 *
 * Utilitario para que el aprobador humano genere el sha256 de un valor
 * antes de crear una entrada en APPROVAL-MANIFEST.json.
 *
 * Uso:
 *   node scripts/hash-content.mjs "valor exacto aprobado"
 *
 * El resultado es el contentHash que debe colocarse en APPROVAL-MANIFEST.json.
 */
import { createHash } from 'node:crypto';

const value = process.argv[2];
if (value === undefined) {
  console.error('Uso: node scripts/hash-content.mjs "valor exacto"');
  process.exit(1);
}

const hash = createHash('sha256').update(value, 'utf8').digest('hex');
console.log(hash);
