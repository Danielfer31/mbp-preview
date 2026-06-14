/**
 * privacy.spec.ts — Tests E2E de privacidad y ausencia de tracking
 *
 * Verifica que el sitio cumpla con el contrato de privacidad del UI-SPEC:
 *   - Sin formularios (<form>)
 *   - Sin cookies ni localStorage/sessionStorage
 *   - Sin scripts de analítica o terceros
 *   - robots.txt accesible y con Disallow: /
 *   - sitemap.xml accesible y con estructura válida
 *
 * Refs:
 *   T-01-15 (Information Disclosure vía scripts terceros)
 *   Privacy & No-Tracking Contract (01-UI-SPEC.md)
 */

import { test, expect } from '@playwright/test';

test.describe('Privacy & No-Tracking Contract', () => {
  test('la página de inicio no contiene elementos <form>', async ({ page }) => {
    await page.goto('/');
    const forms = await page.locator('form').count();
    expect(forms).toBe(0);
  });

  test('la página de inicio no usa localStorage', async ({ page }) => {
    // Interceptar y registrar accesos a localStorage
    let localStorageAccessed = false;

    await page.addInitScript(() => {
      const originalSetItem = localStorage.setItem.bind(localStorage);
      localStorage.setItem = (...args) => {
        (window as typeof window & { __lsAccessed?: boolean }).__lsAccessed = true;
        return originalSetItem(...args);
      };
    });

    await page.goto('/');

    // Esperar a que el JS del cliente se ejecute
    await page.waitForLoadState('networkidle');

    localStorageAccessed = await page.evaluate(
      () => !!(window as typeof window & { __lsAccessed?: boolean }).__lsAccessed,
    );
    expect(localStorageAccessed).toBe(false);
  });

  test('la página de inicio no usa sessionStorage', async ({ page }) => {
    let sessionStorageAccessed = false;

    await page.addInitScript(() => {
      const originalSetItem = sessionStorage.setItem.bind(sessionStorage);
      sessionStorage.setItem = (...args) => {
        (window as typeof window & { __ssAccessed?: boolean }).__ssAccessed = true;
        return originalSetItem(...args);
      };
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    sessionStorageAccessed = await page.evaluate(
      () => !!(window as typeof window & { __ssAccessed?: boolean }).__ssAccessed,
    );
    expect(sessionStorageAccessed).toBe(false);
  });

  test('la página de inicio no carga scripts de analítica conocidos', async ({ page }) => {
    const analyticsUrls: string[] = [];

    // Escuchar peticiones de red a dominios de analítica/tracking conocidos
    page.on('request', (request) => {
      const url = request.url();
      const analyticsPatterns = [
        'google-analytics.com',
        'googletagmanager.com',
        'analytics.js',
        'gtag',
        'facebook.com/tr',
        'hotjar.com',
        'clarity.ms',
        'segment.com',
        'mixpanel.com',
        'amplitude.com',
        'heap.io',
        'fullstory.com',
      ];
      if (analyticsPatterns.some((p) => url.includes(p))) {
        analyticsUrls.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(analyticsUrls).toHaveLength(0);
  });

  test('la página de inicio no carga scripts de terceros externos', async ({ page }) => {
    const thirdPartyScripts: string[] = [];
    const allowedOrigins = [
      'localhost',
      '127.0.0.1',
      // Google Fonts es CSS (no script), pero lo listamos por si acaso
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ];

    page.on('request', (request) => {
      const url = request.url();
      const resourceType = request.resourceType();

      if (resourceType === 'script') {
        const isAllowed = allowedOrigins.some((origin) => url.includes(origin));
        if (!isAllowed) {
          thirdPartyScripts.push(url);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(thirdPartyScripts).toHaveLength(0);
  });

  test('robots.txt existe y bloquea rastreo (Disallow: /)', async ({ request }) => {
    const response = await request.get('/robots.txt');

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Disallow: /');
  });

  test('sitemap.xml existe y tiene estructura XML válida', async ({ request }) => {
    const response = await request.get('/sitemap.xml');

    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('xml');

    const body = await response.text();
    // Estructura básica del sitemap
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
    expect(body).toContain('<url>');
    expect(body).toContain('<loc>');
  });

  test('la página de inicio no define cookies via document.cookie', async ({ page }) => {
    let cookieSet = false;

    await page.addInitScript(() => {
      const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
      if (descriptor && descriptor.set) {
        const originalSet = descriptor.set;
        Object.defineProperty(document, 'cookie', {
          set(value) {
            (window as typeof window & { __cookieSet?: boolean }).__cookieSet = true;
            if (originalSet) originalSet.call(this, value);
          },
          get: descriptor.get,
          configurable: true,
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    cookieSet = await page.evaluate(
      () => !!(window as typeof window & { __cookieSet?: boolean }).__cookieSet,
    );
    expect(cookieSet).toBe(false);
  });
});
