/**
 * robots.txt.ts — Endpoint estático para robots.txt
 *
 * Durante pre-producción (mientras el contenido médico está pendiente de
 * aprobación), el sitio se bloquea completamente al rastreo de crawlers.
 *
 * RESTRICCIONES de este archivo:
 * - NO contiene datos de contacto (teléfono, email, dirección)
 * - NO contiene afirmaciones médicas ni credenciales
 * - NO referencia dominio ficticio
 *
 * El dominio real se configura en astro.config.mjs (site: '...').
 * Este archivo simplemente bloquea crawlers — el Sitemap-URL usa la URL de Astro.
 *
 * Se habilitará indexación en producción tras aprobación de contenido médico.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ url }) => {
  const sitemapUrl = new URL('/sitemap.xml', url.origin).href;

  const content = [
    '# robots.txt — Sitio de Dra. María Bernarda Pacheco Martelo',
    '# Contenido pendiente de verificación médica — rastreo bloqueado temporalmente.',
    '',
    'User-agent: *',
    'Disallow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
