/**
 * src/content.config.ts
 *
 * Definicion de colecciones de contenido Astro para el sitio de la Doctora.
 * Cada entrada modela un campo de contenido estructurado con id, value, status y source.
 *
 * IMPORTANTE: blocksProduction NO forma parte de este esquema.
 * El bloqueo de produccion se deriva de BLOCKING_PLACEHOLDER_IDS en src/lib/placeholders.ts,
 * que es codigo versionado no editable a mano (cierra H1 / T-01-04).
 */
import { defineCollection, z } from 'astro:content';

const contentStatus = z.enum(['pendiente', 'verificar', 'rechazado', 'aprobado']);

const contentFieldSchema = z.object({
  id: z.string().min(1),
  value: z.string().nullable(),
  status: contentStatus,
  source: z.string().min(1),
});

export const collections = {
  profile: defineCollection({
    type: 'data',
    schema: z.array(contentFieldSchema),
  }),
  services: defineCollection({
    type: 'data',
    schema: z.array(contentFieldSchema),
  }),
  contact: defineCollection({
    type: 'data',
    schema: z.array(contentFieldSchema),
  }),
  locations: defineCollection({
    type: 'data',
    schema: z.array(contentFieldSchema),
  }),
  hours: defineCollection({
    type: 'data',
    schema: z.array(contentFieldSchema),
  }),
};
