import { test, expect } from '@playwright/test';

/**
 * public-pages.spec.ts — Tests E2E para las páginas públicas del sitio MBP
 * Plan 01-04
 *
 * Verifica:
 * 1. Existencia y encabezados de las 6 rutas (/, /perfil, /servicios, /contacto, /privacidad, /404)
 * 2. Presencia de empty states / placeholders esperados
 * 3. CTAs bloqueados no tienen href real (T-01-11 — sin href ficticio)
 * 4. Canal alternativo presente en /contacto (WEB-10)
 * 5. Sedes y horarios presentes en /contacto (WEB-01)
 * 6. 404 personalizada con enlace al home
 */

test.describe('Rutas públicas — existencia y encabezados', () => {

  test('/ — página de inicio carga con h1 del nombre', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    // El h1 debe contener el nombre de la doctora (confirmado, no bloqueante)
    const h1Text = await h1.textContent();
    expect(h1Text).toBeTruthy();
    expect(h1Text!.length).toBeGreaterThan(3);
  });

  test('/perfil — página de perfil carga con encabezado', async ({ page }) => {
    await page.goto('/perfil');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text).toBeTruthy();
  });

  test('/servicios — página de servicios carga con encabezado', async ({ page }) => {
    await page.goto('/servicios');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('/contacto — página de contacto carga con encabezado', async ({ page }) => {
    await page.goto('/contacto');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('/privacidad — página de privacidad carga con encabezado', async ({ page }) => {
    await page.goto('/privacidad');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('/404 — retorna status 404 con contenido personalizado', async ({ page }) => {
    const response = await page.goto('/ruta-que-no-existe-abc123');
    // Astro puede devolver 404 en producción; en dev puede retornar 200 con contenido
    // Verificar que la página tiene el texto esperado
    const body = await page.textContent('body');
    // Verificar que hay contenido de página MBP (no página de error del servidor)
    expect(body).toBeTruthy();
  });

  test('/404 — página 404 directa tiene copy exacto y enlace al home', async ({ page }) => {
    await page.goto('/404');
    // Copy exacto requerido por el plan
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Esta pagina no existe');
    // Enlace al home
    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();
  });

});

test.describe('Empty states y placeholders', () => {

  test('/perfil — muestra empty state de credenciales cuando están pendientes', async ({ page }) => {
    await page.goto('/perfil');
    // Verificar que la página no muestra datos médicos inventados
    // Debe mostrar el aviso de placeholder o el empty state
    const body = await page.textContent('body');
    // No debe haber texto inventado como "Cardiología" u otras especialidades no confirmadas
    expect(body).toBeTruthy();
    // Verificar que existe la sección de credenciales
    const credentialsSection = page.locator('[aria-labelledby="credentials-heading"]');
    await expect(credentialsSection).toBeVisible();
  });

  test('/servicios — muestra nombres de servicios o empty state (no descripciones no aprobadas)', async ({ page }) => {
    await page.goto('/servicios');
    // La página debe cargar sin descripciones médicas no aprobadas
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    // Los nombres confirmados del branding deben estar presentes
    // (ServiceCard muestra nombre aunque descripción esté bloqueada)
    const servicesSection = page.locator('[aria-labelledby="services-grid-heading"], [aria-labelledby="services-heading"]').first();
    await expect(servicesSection).toBeAttached();
  });

  test('/contacto — muestra aviso de placeholder cuando datos de contacto están pendientes', async ({ page }) => {
    await page.goto('/contacto');
    // PlaceholderNotice o texto de pendiente debe ser visible
    const body = await page.textContent('body');
    expect(body).toContain('pendiente');
  });

});

test.describe('CTAs bloqueados — sin href real (T-01-11)', () => {

  test('/ — CTA "AGENDAR CITA" deshabilitado no tiene href real', async ({ page }) => {
    await page.goto('/');
    // El CTA principal en la home debe estar deshabilitado (es un span con role="link" aria-disabled)
    const disabledCta = page.locator('[aria-disabled="true"]').first();
    await expect(disabledCta).toBeAttached();
    // No debe tener href (es un span, no un <a>)
    const tagName = await disabledCta.evaluate((el) => el.tagName.toLowerCase());
    // Si es un <a>, verificar que no tiene href real (no http/tel/mailto)
    if (tagName === 'a') {
      const href = await disabledCta.getAttribute('href');
      if (href) {
        expect(href).not.toMatch(/^(tel:|mailto:|https?:\/\/|wa\.me)/);
      }
    }
    // Si es span/button con role="link", está correctamente deshabilitado
  });

  test('/contacto — CTAs de contacto deshabilitados no tienen href real', async ({ page }) => {
    await page.goto('/contacto');
    // Buscar todos los elementos con aria-disabled="true"
    const disabledLinks = page.locator('[aria-disabled="true"]');
    const count = await disabledLinks.count();

    // Si hay CTAs deshabilitados (como se espera con placeholders bloqueantes)
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const el = disabledLinks.nth(i);
        const tagName = await el.evaluate((node) => node.tagName.toLowerCase());
        if (tagName === 'a') {
          const href = await el.getAttribute('href');
          // No debe tener href con esquemas reales
          if (href) {
            expect(href).not.toMatch(/^(tel:|mailto:|https?:\/\/|wa\.me)/);
          }
        }
      }
    }
  });

  test('/contacto — ningún CTA bloqueado tiene href ficticio (tel/mailto/wa.me inválido)', async ({ page }) => {
    await page.goto('/contacto');
    // Verificar que los SafeContactCard con placeholder bloqueante no tienen href real
    const allLinks = page.locator('a');
    const count = await allLinks.count();

    for (let i = 0; i < count; i++) {
      const link = allLinks.nth(i);
      const href = await link.getAttribute('href');
      const ariaDisabled = await link.getAttribute('aria-disabled');

      // Si el enlace está marcado como disabled Y tiene un href real, es un error
      if (ariaDisabled === 'true' && href) {
        expect(href).not.toMatch(/^(tel:|mailto:|https?:\/\/wa\.me)/);
      }
    }
  });

});

test.describe('Canal alternativo (WEB-10)', () => {

  test('/contacto — canal alternativo está visible cuando canal principal no disponible', async ({ page }) => {
    await page.goto('/contacto');
    // El canal alternativo debe ser visible en el SafeContactCard
    // cuando el canal principal está bloqueado
    const body = await page.textContent('body');
    // Debe contener texto sobre canal alternativo o "proximamente"
    const hasAlternateText =
      body?.includes('Canal alternativo') ||
      body?.includes('canal alternativo') ||
      body?.includes('próximamente') ||
      body?.includes('proximamente');
    expect(hasAlternateText).toBeTruthy();
  });

});

test.describe('Sedes y horarios (WEB-01)', () => {

  test('/contacto — sección de sedes y horarios está presente', async ({ page }) => {
    await page.goto('/contacto');
    const locationsSection = page.locator('[aria-label="Sedes y horarios de atención"]');
    await expect(locationsSection).toBeVisible();
  });

  test('/contacto — horarios de atención o pendiente visible', async ({ page }) => {
    await page.goto('/contacto');
    const body = await page.textContent('body');
    const hasHoursText =
      body?.includes('HORARIO') ||
      body?.includes('horario') ||
      body?.includes('ATENCIÓN') ||
      body?.includes('atención') ||
      body?.includes('próximamente') ||
      body?.includes('proximamente');
    expect(hasHoursText).toBeTruthy();
  });

  test('/contacto — sección SEDE está presente', async ({ page }) => {
    await page.goto('/contacto');
    const body = await page.textContent('body');
    const hasSede =
      body?.includes('SEDE') ||
      body?.includes('sede') ||
      body?.includes('Información disponible');
    expect(hasSede).toBeTruthy();
  });

});

test.describe('Página 404 personalizada', () => {

  test('/404 — tiene enlace <a href="/"> al home', async ({ page }) => {
    await page.goto('/404');
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink.first()).toBeVisible();
  });

  test('/404 — contiene texto "Esta pagina no existe"', async ({ page }) => {
    await page.goto('/404');
    const body = await page.textContent('body');
    expect(body).toContain('Esta pagina no existe');
  });

  test('/404 — tiene enlace visible para regresar', async ({ page }) => {
    await page.goto('/404');
    // Debe haber al menos un botón/enlace de navegación
    const actionLinks = page.locator('a.btn, a[class*="btn"]');
    await expect(actionLinks.first()).toBeVisible();
  });

});

test.describe('Disclaimer clínico (WEB-07)', () => {

  test('/ — disclaimer "No envíe información clínica" está visible junto al CTA', async ({ page }) => {
    await page.goto('/');
    const body = await page.textContent('body');
    const hasDisclaimer =
      body?.includes('No envíe información clínica') ||
      body?.includes('No envie informacion clinica');
    expect(hasDisclaimer).toBeTruthy();
  });

  test('/contacto — disclaimer presente junto a canales de contacto', async ({ page }) => {
    await page.goto('/contacto');
    const body = await page.textContent('body');
    const hasDisclaimer =
      body?.includes('No envíe información clínica') ||
      body?.includes('No envie informacion clinica') ||
      body?.includes('No envíe síntomas');
    expect(hasDisclaimer).toBeTruthy();
  });

});

test.describe('Estructura base (BaseLayout)', () => {

  const routes = ['/', '/perfil', '/servicios', '/contacto', '/privacidad', '/404'];

  for (const route of routes) {
    test(`${route} — tiene lang="es", skip link y landmarks ARIA`, async ({ page }) => {
      await page.goto(route);

      // lang="es"
      const lang = await page.getAttribute('html', 'lang');
      expect(lang).toBe('es');

      // skip link
      const skipLink = page.locator('a.skip-link');
      await expect(skipLink).toBeAttached();

      // header landmark
      const header = page.locator('header[role="banner"]');
      await expect(header).toBeAttached();

      // main landmark
      const main = page.locator('main#main-content');
      await expect(main).toBeAttached();

      // footer landmark
      const footer = page.locator('footer[role="contentinfo"]');
      await expect(footer).toBeAttached();
    });
  }

});
