// The design tokens (tokens.css), the one stylesheet that writes colours, type, spacing, sizes, radii, shadows and
// layers: the light and the dark theme define the same names, and in each theme every "on-X" colour reads on "X", the
// tooltip's text on its background, and the three text colours on every surface they sit on, at 4.5:1 or more (WCAG
// 2.2, 1.4.3).
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const CSS = fs.readFileSync('src/ui/tokens.css', 'utf8');
// the declarations of the first block a selector opens
function block(selector: string, from = 0): Map<string, string> {
  const at = CSS.indexOf(`${selector} {`, from);
  if (at < 0) throw new Error(`tokens.css has no ${selector} block`);
  const body = CSS.slice(CSS.indexOf('{', at) + 1, CSS.indexOf('}', at));
  return new Map([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1] ?? '', (m[2] ?? '').trim()]));
}
// the light theme is the second :root block (the first holds what both themes share), the dark one the explicit choice
const shared = block(':root');
const light = block(':root', CSS.indexOf(':root {') + 1);
const dark = block(':root[data-theme="dark"]');
const system = block(':root:not([data-theme="light"])');

const MIN_CONTRAST = 4.5;
const TEXT_ON = [
  ['text', 'surface'],
  ['text-muted', 'surface'],
  ['text-subtle', 'surface'],
  ['text-subtle', 'surface-raised'],
  ['text-subtle', 'surface-sunken'],
  ['text-subtle', 'bg-app'],
  ['tip-text', 'tip-bg'],
] as const;
const hex = (value: string | undefined) => (value !== undefined && /^#[0-9a-f]{6}$/i.test(value) ? value : null);
function luminance(colour: string): number {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => parseInt(colour.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
function illegible(theme: Map<string, string>): string[] {
  const colour = (name: string) => hex(theme.get(`color-${name}`));
  const names = [...theme.keys()].filter((n) => n.startsWith('color-')).map((n) => n.slice('color-'.length));
  const pairs: (readonly [string, string])[] = [...names.filter((n) => n.startsWith('on-') && names.includes(n.slice(3))).map((n) => [n, n.slice(3)] as const), ...TEXT_ON];
  return pairs.flatMap(([fg, bg]) => {
    const a = colour(fg);
    const b = colour(bg);
    if (a === null || b === null) return [];
    const ratio = contrast(a, b);
    return ratio < MIN_CONTRAST ? [`${fg} on ${bg}: ${ratio.toFixed(2)}:1`] : [];
  });
}

describe('the design tokens', () => {
  it('define the same names in the light theme, the dark theme and the system dark theme', () => {
    expect([...dark.keys()].sort()).toEqual([...light.keys()].sort());
    expect([...system.entries()].sort()).toEqual([...dark.entries()].sort());
    expect(shared.size).toBeGreaterThan(0);
  });

  it('keep every text colour legible on what it sits on, in each theme', () => {
    expect(illegible(light), 'light').toEqual([]);
    expect(illegible(dark), 'dark').toEqual([]);
    // the pairs are real: the theme names the colours they read
    expect(hex(light.get('color-text'))).not.toBeNull();
    expect(hex(dark.get('color-surface'))).not.toBeNull();
  });
});
