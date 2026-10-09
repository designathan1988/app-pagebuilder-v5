// What the app asks of the browsers, without opening one (the investigation's C8: "isolamento do iframe",
// "postMessage" and "compatibilidade"). Three rules over the source and MDN's browser-compat-data 8.1.2, the data the
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
  { api: 'URL.canParse', path: 'api.URL.canParse', call: 'URL\\.canParse', reason: 'o BCD 8.1.2 não traz entrada para este método estático; as três engines o sustentam desde 2023 e o app o chama num só ponto, src/core/document/captured.ts' },
  { api: 'requestIdleCallback', path: 'api.Window.requestIdleCallback', call: 'requestIdleCallback', reason: 'o Safari ainda não o traz numa versão estável; o app o chama por trás de typeof window.requestIdleCallback === "function", com um setTimeout de reserva (src/editor/persistence/autosave.ts)' },
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

describe('o que o app exige dos navegadores', () => {
  it('nenhum quadro junta allow-scripts com allow-same-origin', () => {
    const found: string[] = [];
    let counted = 0;
    for (const file of sourceFiles()) {
      for (const one of read(file).matchAll(/sandbox="([^"]*)"/g)) {
        counted += 1;
        const tokens = (one[1] ?? '').split(/\s+/).filter((token) => token !== '');
        if (tokens.includes('allow-scripts') && tokens.includes('allow-same-origin')) found.push(`${file}: sandbox="${one[1]}"`);
      }
    }
    expect(counted, 'a varredura achou o sandbox dos quadros').toBeGreaterThan(0);
    expect(found, 'quadros cuja combinação anula o isolamento').toEqual([]);
  });

  it('todo ouvinte de message da janela confere a janela que enviou', () => {
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
    expect(counted, 'a varredura achou o ouvinte de message da janela').toBeGreaterThan(0);
    expect(found, 'ouvintes de message sem conferir event.source').toEqual([]);
  });

  it('toda API do navegador que o app chama é dos três, ou tem a sua razão declarada aqui', () => {
    const bcd = require('@mdn/browser-compat-data') as unknown;
    const found: string[] = [];
    for (const use of USES) {
      const entry = at(bcd, use.path) as { readonly __compat?: { readonly support?: Record<string, Support | readonly Support[]> } } | undefined;
      const support = entry?.__compat?.support;
      if (support === undefined) {
        if (use.reason === undefined) found.push(`${use.api}: o BCD 8.1.2 não traz ${use.path} e a razão não está declarada`);
        continue;
      }
      const lacking = (['chrome', 'firefox', 'safari'] as const).filter((browser) => !stable(support[browser]));
      if (lacking.length > 0 && use.reason === undefined) found.push(`${use.api}: ${lacking.join(', ')} não o sustenta numa versão estável`);
    }
    expect(found, 'APIs que nem os três navegadores sustentam, sem razão declarada').toEqual([]);
  });

  it('cada API declarada aqui é uma que o código realmente chama, e cada uso guardado é guardado', () => {
    const sources = sourceFiles().map((file) => read(file)).join('\n');
    const stale = USES.filter((use) => !new RegExp(use.call).test(sources)).map((use) => use.api);
    expect(stale, 'APIs declaradas que o código não chama mais').toEqual([]);
    // the one use BCD reports as unsupported is guarded by a test of its presence
    expect(sources.includes('typeof window.requestIdleCallback'), 'a chamada de requestIdleCallback é guardada').toBe(true);
  });
});
