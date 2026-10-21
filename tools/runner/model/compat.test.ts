// What the app asks of the browsers, without opening one (the investigation's C8: "iframe isolation",
// "postMessage" and "compatibility"). Three rules over the source and MDN's browser-compat-data 8.1.2, the data the
// manifest already checks the CSS against (tools/gen/compat.ts):
//  - no frame's sandbox puts allow-scripts together with allow-same-origin, a combination MDN says annuls the
//    isolation (a frame with both can reach its parent's document);
//  - every listener of the window's message event checks the window that sent it (event.source), because a message
//    arrives from any page that reaches the window;
//  - every API of the browser the app calls is one the current stable Chrome, Firefox and Safari all support, or one
//    whose use is declared here with the reason it is safe (guarded by a test of its presence, or not tracked by BCD).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { mutatedSource } from '../mutants.ts';

const require = createRequire(import.meta.url);

const sourceFiles = (): readonly string[] =>
  (fs.readdirSync('src', { recursive: true }) as string[]).map((one) => `src/${one.replace(/\\/g, '/')}`).filter((one) => /\.(ts|tsx)$/.test(one) && !one.endsWith('.test.ts'));
const read = (file: string): string => mutatedSource(file, fs.readFileSync(file, 'utf8'));

// What the app calls of the browser, the BCD path of each (bcd.api or bcd.javascript), and — for an API BCD does not
// report as supported by all three — the reason its use is safe anyway.
interface Use {
  readonly api: string;
  readonly path: string;
  // how the call is written in the source, so a declared API the code stopped calling is accused
  readonly call: string;
  readonly reason?: string;
}
const USES: readonly Use[] = [
  { api: 'Array.prototype.at', path: 'javascript.builtins.Array.at', call: '\\.at\\(' },
  { api: 'Array.prototype.findLast', path: 'javascript.builtins.Array.findLast', call: '\\.findLast\\(' },
  { api: 'Array.prototype.findLastIndex', path: 'javascript.builtins.Array.findLastIndex', call: '\\.findLastIndex\\(' },
  { api: 'Object.hasOwn', path: 'javascript.builtins.Object.hasOwn', call: 'Object\\.hasOwn' },
  { api: 'Intl.PluralRules', path: 'javascript.builtins.Intl.PluralRules', call: 'Intl\\.PluralRules' },
  { api: 'structuredClone', path: 'api.structuredClone', call: 'structuredClone\\(' },
  { api: 'queueMicrotask', path: 'api.queueMicrotask', call: 'queueMicrotask\\(' },
  { api: 'navigator.locks', path: 'api.LockManager', call: 'navigator\\.locks' },
  { api: 'URL.canParse', path: 'api.URL.canParse', call: 'URL\\.canParse', reason: 'BCD 8.1.2 has no entry for this static method; all three engines have supported it since 2023 and the app calls it in a single place, src/core/document/captured.ts' },
  { api: 'requestIdleCallback', path: 'api.Window.requestIdleCallback', call: 'requestIdleCallback', reason: 'Safari does not ship it in a stable release yet; the app calls it behind typeof window.requestIdleCallback === "function", with a fallback setTimeout (src/editor/persistence/autosave.ts)' },
  { api: 'Element.computedStyleMap', path: 'api.Element.computedStyleMap', call: 'computedStyleMap\\(', reason: 'stable Firefox does not ship it (BCD 8.1.2: preview only); the app calls it behind typeof element.computedStyleMap === "function" and reads getComputedStyle without it (src/editor/canvas/coordinates.ts, computedValues; DEF-0548)' },
];

interface Support {
  readonly version_added: string | boolean | null;
  readonly prefix?: string;
  readonly alternative_name?: string;
  readonly partial_implementation?: boolean;
  readonly flags?: unknown;
}
const at = (root: unknown, path: string): unknown => path.split('.').reduce<unknown>((one, key) => (one !== null && typeof one === 'object' ? (one as Record<string, unknown>)[key] : undefined), root);
// A statement of support for a stable release: a version that is not the preview channel, with no prefix, no
// alternative name, no flag and no partial implementation (the rule the manifest check uses for CSS:
// tools/gen/compat.ts)
const stable = (support: Support | readonly Support[] | undefined): boolean => {
  const one = Array.isArray(support) ? support[0] : support;
  if (one === undefined || typeof one !== 'object') return false;
  return typeof one.version_added === 'string' && one.version_added !== 'preview' && one.prefix === undefined && one.alternative_name === undefined && one.flags === undefined && one.partial_implementation !== true;
};

describe('what the app requires of the browsers', () => {
  it('no frame combines allow-scripts with allow-same-origin', () => {
    const found: string[] = [];
    let counted = 0;
    for (const file of sourceFiles()) {
      for (const one of read(file).matchAll(/sandbox="([^"]*)"/g)) {
        counted += 1;
        const tokens = (one[1] ?? '').split(/\s+/).filter((token) => token !== '');
        if (tokens.includes('allow-scripts') && tokens.includes('allow-same-origin')) found.push(`${file}: sandbox="${one[1]}"`);
      }
    }
    expect(counted, 'the scan found the frames\' sandbox').toBeGreaterThan(0);
    expect(found, 'frames whose combination annuls the isolation').toEqual([]);
  });

  it('every message listener of the window checks the window that sent it', () => {
    const found: string[] = [];
    let counted = 0;
    for (const file of sourceFiles()) {
      const lines = read(file).split('\n');
      lines.forEach((line, i) => {
        const call = /window\.addEventListener\(\s*'message'\s*,\s*([^)]*)/.exec(line);
        if (call === null) return;
        counted += 1;
        // the handler written there, or the function it names
        const handler = (call[1] ?? '').trim().replace(/[;,]$/, '');
        const named = /^[A-Za-z_$][\w$]*$/.test(handler) ? lines.findIndex((one) => new RegExp(`(?:const|function)\\s+${handler}\\b`).test(one)) : -1;
        const region = named >= 0 ? lines.slice(named, named + 40).join('\n') : lines.slice(i, i + 30).join('\n');
        // the sender is checked before the message is read: the handler names event.source
        if (!/\bsource\b/.test(region)) found.push(`${file}:${i + 1}`);
      });
    }
    expect(counted, 'the scan found the window\'s message listener').toBeGreaterThan(0);
    expect(found, 'message listeners that do not check event.source').toEqual([]);
  });

  it('every browser API the app calls is supported by all three, or has its reason declared here', () => {
    const bcd = require('@mdn/browser-compat-data') as unknown;
    const found: string[] = [];
    for (const use of USES) {
      const entry = at(bcd, use.path) as { readonly __compat?: { readonly support?: Record<string, Support | readonly Support[]> } } | undefined;
      const support = entry?.__compat?.support;
      if (support === undefined) {
        if (use.reason === undefined) found.push(`${use.api}: BCD 8.1.2 has no ${use.path} and the reason is not declared`);
        continue;
      }
      const lacking = (['chrome', 'firefox', 'safari'] as const).filter((browser) => !stable(support[browser]));
      if (lacking.length > 0 && use.reason === undefined) found.push(`${use.api}: ${lacking.join(', ')} does not support it in a stable release`);
    }
    expect(found, 'APIs not all three browsers support, with no reason declared').toEqual([]);
  });

  it('each API declared here is one the code really calls, and each guarded use is guarded', () => {
    const sources = sourceFiles().map((file) => read(file)).join('\n');
    const stale = USES.filter((use) => !new RegExp(use.call).test(sources)).map((use) => use.api);
    expect(stale, 'declared APIs the code no longer calls').toEqual([]);
    // the one use BCD reports as unsupported is guarded by a test of its presence
    expect(sources.includes('typeof window.requestIdleCallback'), 'the requestIdleCallback call is guarded').toBe(true);
    // every line of code (its comment left out) that calls computedStyleMap guards it in the same expression (DEF-0548)
    const calls = sources.split('\n').map((line) => line.replace(/\/\/.*$/, '')).filter((line) => line.includes('computedStyleMap('));
    expect(calls.length, 'the code calls computedStyleMap').toBeGreaterThan(0);
    expect(calls.filter((line) => !/typeof \w+\.computedStyleMap === 'function' \? \w+\.computedStyleMap\(\)/.test(line)), 'computedStyleMap calls without the guard').toEqual([]);
  });
});
