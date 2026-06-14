/**
 * sitemap.xml.ts — Endpoint estático para sitemap.xml
 *
 * Genera un sitemap básico con las rutas públicas del sitio.
 * En pre-producción el sitio tiene Disallow: / en robots.txt, pero el
 * sitemap existe para cuando se habilite el rastreo.
 *
 * RESTRICCIONES de este archivo:
 * - NO contiene datos de contacto (teléfono, email, dirección)
 * - NO contiene afirmaciones médicas ni credenciales
 * - NO referencia dominio ficticio — el origen viene de Astro.url
 *
 * El dominio real se configura en astro.config.mjs (site: '...').
 */

import type { APIRoute } from 'astro';

/** Rutas públicas del sitio (se expande en planes futuros) */
const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
];

export const GET: APIRoute = ({ url }) => {
  const origin = url.origin;
  const lastmod = new Date().toISOString().split('T')[0];

  const urlEntries = PUBLIC_ROUTES.map(
    (route) => `
  <url>
    <loc>${origin}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  ).join('');

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(content, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
