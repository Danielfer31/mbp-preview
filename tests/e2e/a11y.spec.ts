import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * a11y.spec.ts — Accessibility E2E tests con axe-core (WCAG 2.1 AA)
 * Plan 01-06
 *
 * Ejecuta axe-core sobre cada ruta publica y falla ante violaciones
 * serias (serious) o criticas (critical).
 *
 * Rutas cubiertas: /, /perfil, /servicios, /contacto, /privacidad, /404
 */

const PUBLIC_ROUTES = ['/', '/perfil', '/servicios', '/contacto', '/privacidad', '/404'];

// Reglas axe que se omiten en este estadio (justificacion inline):
// - color-contrast: los placeholders usan colores de sistema del OS;
//   se verificara cuando el diseno final este implementado (plan 01-07+).
const DISABLED_RULES = ['color-contrast'];

for (const route of PUBLIC_ROUTES) {
  test(`${route} — sin violaciones axe serias/criticas (WCAG 2.1 AA)`, async ({ page }) => {
    await page.goto(route);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .disableRules(DISABLED_RULES)
      .analyze();

    // Filtrar solo violaciones serias y criticas
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    if (seriousOrCritical.length > 0) {
      // Reporte legible en la salida del test
      const report = seriousOrCritical
        .map(
          (v) =>
            `[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
            v.nodes.map((n) => `  -> ${n.html}`).join('\n'),
        )
        .join('\n\n');
      console.error(`Violaciones de accesibilidad en ${route}:\n${report}`);
    }

    expect(seriousOrCritical).toHaveLength(0);
  });
}
