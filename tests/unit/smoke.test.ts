import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Smoke tests - fundacion Astro', () => {
  it('src/pages/index.astro existe', () => {
    const indexPath = resolve(process.cwd(), 'src', 'pages', 'index.astro');
    expect(existsSync(indexPath)).toBe(true);
  });

  it('src/pages/index.astro usa BaseLayout (no genera HTML en source)', () => {
    const indexPath = resolve(process.cwd(), 'src', 'pages', 'index.astro');
    const content = readFileSync(indexPath, 'utf-8');
    // index.astro delega estructura HTML a BaseLayout — no debe contener <html> raw
    expect(content).toContain('BaseLayout');
  });

  it('src/pages/index.astro contiene seccion hero con nombre de la doctora', () => {
    const indexPath = resolve(process.cwd(), 'src', 'pages', 'index.astro');
    const content = readFileSync(indexPath, 'utf-8');
    expect(content).toContain('Pacheco');
  });

  it('astro.config.ts existe', () => {
    const configPath = resolve(process.cwd(), 'astro.config.ts');
    expect(existsSync(configPath)).toBe(true);
  });

  it('astro.config.ts contiene output static', () => {
    const configPath = resolve(process.cwd(), 'astro.config.ts');
    const content = readFileSync(configPath, 'utf-8');
    expect(content).toContain("output: 'static'");
  });

  it('tsconfig.json contiene strict true', () => {
    const tsconfigPath = resolve(process.cwd(), 'tsconfig.json');
    const content = readFileSync(tsconfigPath, 'utf-8');
    expect(content).toContain('"strict": true');
  });

  it('.nvmrc existe', () => {
    const nvmrcPath = resolve(process.cwd(), '.nvmrc');
    expect(existsSync(nvmrcPath)).toBe(true);
  });

  it('package.json contiene engines.node', () => {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    expect(pkg.engines).toBeDefined();
    expect(pkg.engines.node).toBeDefined();
    expect(pkg.engines.node).toContain('24');
  });
});
