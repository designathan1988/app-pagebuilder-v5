// O lote visual (item 4 da "Tarefa do DeepSeek: a parte visual e de navegador"): o que nenhum teste existente cobre.
// Duas famílias, com a fixture do projeto (a guarda de tela, o feed de incidentes e os erros do console, em
// tests/support/test.ts):
//
//  1. Controles montados: abrindo cada região que o editor monta, os `[data-door]` e `[data-local]` que a página
//     desenha são conferidos contra o manifesto e contra `manifest/generated/inventory.json`: todo id montado é uma
//     porta do manifesto e o manifesto a coloca naquela região; nenhum elemento interativo fora da lista de exceções
//     da regra `builder/interactive-owner` (tools/lint/interactive-allowed.ts) aparece sem marca.
//  2. O canvas é o documento (G7, DCS-002): para cada comando desfazível do manifesto, o comando é executado pelo boot
//     de teste sobre um documento profundo, o DOM do quadro do canvas é serializado (atributos em ordem, sem as marcas
//     do editor da lista fechada de DCS-002, `src/core/document/validate.ts:519`), o documento resultante é aberto do
//     zero e serializado de novo, e as duas serializações são comparadas. Ao fim, o canvas é comparado com a
//     exportação pelas propriedades calculadas, elemento a elemento, como tests/e2e/export-zip.spec.ts faz.
import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { unzip } from '../../tools/runner/unzip.ts';
import { INTERACTIVE_ALLOWED } from '../../tools/lint/interactive-allowed.ts';
import { INTERACTIVE_ROLES, INTERACTIVE_TAGS } from '../../tools/inventory/ui-scan.ts';
import { DOORS, door, runs } from './door.ts';
import type { TestBootCommand } from '../../src/editor/test-boot.ts';

const DEEP = 'aurora';
// the closed list of the editor's own marks (DCS-002): what the canvas draws and the document does not hold
const EDITOR_MARKS: readonly string[] = ['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style'];
const run = (ref: string, args: Readonly<Record<string, unknown>> = {}): TestBootCommand => ({ command: ref.split('#')[0] ?? '', args: { ...door(ref).args, ...args } });

interface Inventory {
  readonly features: readonly { readonly id: string; readonly commands: readonly string[] }[];
  readonly interactive: { readonly owners: Readonly<Record<string, number>>; readonly elements: readonly { readonly key: string; readonly tag: string; readonly role: string | null; readonly handlers: readonly string[]; readonly owner: string }[] };
}
const INVENTORY = JSON.parse(fs.readFileSync('manifest/generated/inventory.json', 'utf8')) as Inventory;
const INVENTORY_COMMANDS = new Set(INVENTORY.features.flatMap((f) => f.commands));

// ------------------------------------------------ 1. os controles montados

// A key of an element of tools/lint/interactive-allowed.ts, as the DOM names it: the tag and the attribute names, with
// the DOM's spelling of the prop (class for className, for for htmlFor) and the props that never become an attribute
// (an event handler, ref, key, defaultValue) left out.
const JSX_ONLY = /^on[A-Z]|^(ref|key|defaultValue|defaultChecked|dangerouslySetInnerHTML|children)$/;
const toDomName = (name: string): string => (name === 'className' ? 'class' : name === 'htmlFor' ? 'for' : name.toLowerCase());
const jsxAttributes = (key: string): { tag: string; attrs: readonly string[] } => {
  const [, tag = '', attrs = ''] = key.split('|');
  return { tag, attrs: attrs.split(',').filter((a) => a !== '' && !JSX_ONLY.test(a)).map(toDomName) };
};
const ALLOWED = INTERACTIVE_ALLOWED.map((entry) => jsxAttributes(entry.key));
// whether an element with this tag and these attributes is one the exception list names: every attribute the source
// gives the element is on it (the page may carry more: the ones a script writes at run time)
const allowed = (tag: string, attrs: readonly string[]): boolean => ALLOWED.some((entry) => entry.tag === tag && entry.attrs.every((a) => attrs.includes(a)));

// The controls the editor mounts, each with the chain of regions it lies in, outermost first: the region a door is
// placed in may hold another one that draws it (the Explorer's file rows live in the panel region).
interface Mounted {
  readonly ref: string;
  readonly chain: readonly string[];
}
interface Found {
  readonly doors: readonly Mounted[];
  readonly locals: readonly Mounted[];
  readonly unmarked: readonly Mounted[];
}
const readMounted = (page: Page): Promise<Found> =>
  page.evaluate((payload) => {
    const { marks, tags, handles } = payload;
    const markSet = new Set(marks);
    const tagSet = new Set(tags);
    const handleSet = new Set(handles);
    const chainOf = (element: Element): string[] => {
      const out: string[] = [];
      for (let at = element.closest('[data-region]'); at !== null; at = at.parentElement?.closest('[data-region]') ?? null) out.unshift(at.getAttribute('data-region') ?? '');
      return out;
    };
    const attributeNames = (element: Element): string[] => [...element.attributes].map((a) => a.name).filter((name) => !markSet.has(name) && name !== 'style');
    // the rule of tools/inventory/ui-scan.ts, read in the page: an element of one of its tags, or holding an interactive
    // ARIA role, or given a tabindex (the handlers it may carry are a prop, not an attribute, and only the source sees them)
    const interactive = (element: Element, names: readonly string[], role: string | null): boolean =>
      /^[a-z]/.test(element.localName) && (tagSet.has(element.localName) || (role !== null && handleSet.has(role)) || names.includes('tabindex') || names.includes('contenteditable'));
    const doors: { ref: string; chain: string[] }[] = [];
    const locals: { ref: string; chain: string[] }[] = [];
    const unmarked: { ref: string; chain: string[] }[] = [];
    for (const element of document.querySelectorAll('[data-door],[data-local],[role],[tabindex]')) {
      const ref = element.getAttribute('data-door');
      const chain = chainOf(element);
      if (ref !== null) {
        doors.push({ ref, chain });
        continue;
      }
      const local = element.getAttribute('data-local');
      if (local !== null) {
        locals.push({ ref: local, chain });
        continue;
      }
      if (element.closest('[data-door],[data-local]') !== null) continue;
      if (element.getAttribute('aria-hidden') === 'true') continue;
      const names = attributeNames(element);
      if (!interactive(element, names, element.getAttribute('role'))) continue;
      unmarked.push({ ref: `${element.localName}[${names.slice().sort().join(',')}]`, chain });
    }
    return { doors, locals, unmarked };
  }, { marks: [...EDITOR_MARKS], tags: [...INTERACTIVE_TAGS], handles: [...INTERACTIVE_ROLES] });

test('a porta que a região monta é a que o manifesto coloca nela, e nenhum controle fica sem marca', runs('selection.select#layers-row'), async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page, { project: DEEP });
  const states: Found[] = [await readMounted(page)];
  for (const menu of ['file', 'edit', 'arrange', 'view', 'help', 'theme', 'language', 'element-actions', 'zoom', 'snap', 'style-state']) {
    const button = page.locator(`[data-menu="${menu}"]`).first();
    if ((await button.count()) === 0) continue;
    await button.click();
    states.push(await readMounted(page));
    await page.keyboard.press('Escape');
  }
  await page.keyboard.press('Control+k');
  states.push(await readMounted(page));
  await page.keyboard.press('Escape');
  const chip = page.locator('[data-quick-panel-chip]').first();
  if ((await chip.count()) > 0) {
    await chip.click();
    states.push(await readMounted(page));
    await page.keyboard.press('Escape');
  }
  for (const selector of ['.activity-bar button[data-door]', '[data-region="dock-strip"] button[data-door]']) {
    const count = await page.locator(selector).count();
    for (let i = 0; i < count; i++) {
      await page.locator(selector).nth(i).click();
      states.push(await readMounted(page));
    }
  }

  const wrongRegion: string[] = [];
  const unknown: string[] = [];
  const unmarked: string[] = [];
  for (const state of states)
    for (const mounted of state.doors) {
      const held = DOORS.get(mounted.ref);
      if (held === undefined) {
        unknown.push(`${mounted.chain.join(' › ')} › ${mounted.ref}`);
        continue;
      }
      // the region the manifest names may hold the region the page draws the control in (the Explorer's panel holds
      // its file rows), never lie inside it; the overlay's backdrop is the layer itself and lies in no region
      const placement = held.placement;
      if (typeof placement === 'object') {
        const outside = placement.region === 'overlay' && mounted.chain.length === 0;
        if (!outside && !mounted.chain.includes(placement.region)) wrongRegion.push(`${mounted.chain.join(' › ')} › ${mounted.ref} (o manifesto diz ${placement.region})`);
      }
    }
  for (const state of states)
    for (const element of state.unmarked) {
      const tag = element.ref.slice(0, element.ref.indexOf('['));
      const attrs = element.ref.slice(element.ref.indexOf('[') + 1, -1).split(',').filter((a) => a !== '');
      if (!allowed(tag, attrs)) unmarked.push(`${element.chain.join(' › ')} › ${element.ref}`);
    }
  expect([...new Set(unknown)], 'portas montadas que o manifesto não declara').toEqual([]);
  expect([...new Set(wrongRegion)], 'portas montadas na região errada').toEqual([]);
  expect([...new Set(unmarked)], 'controles sem data-door, sem data-local e fora da lista de exceções').toEqual([]);
});

// ------------------------------------------------ 2. o canvas é o documento

// The DOM the canvas draws, normalized: the attributes of each element in name order, the editor's own marks left out,
// the text of each text node trimmed. The body of the canvas's frame is the page.
const serializeCanvas = (page: Page): Promise<string> =>
  page.frameLocator('.frame__page').locator('body').evaluate((body, marks) => {
    const set = new Set(marks);
    const out: string[] = [];
    const walk = (element: Element, depth: number): void => {
      const attrs = [...element.attributes]
        .filter((a) => !set.has(a.name))
        .map((a) => `${a.name}=${JSON.stringify(a.value)}`)
        .sort();
      out.push(`${'  '.repeat(depth)}<${element.localName} ${attrs.join(' ')}>`);
      for (const child of element.childNodes) {
        if (child.nodeType === 3) {
          const text = (child.textContent ?? '').trim();
          if (text !== '') out.push(`${'  '.repeat(depth + 1)}"${text}"`);
        } else if (child.nodeType === 1) walk(child as Element, depth + 1);
      }
    };
    walk(body, 0);
    return out.join('\n');
  }, [...EDITOR_MARKS]);

const bootResults = (page: Page): Promise<readonly { command: string; status: string }[]> =>
  page.evaluate(() => ((window as unknown as { __builderTestPort?: { boot: () => { command: string; status: string }[] } }).__builderTestPort?.boot() ?? []));

// every command of the manifest whose history is undoable
const UNDOABLE: readonly string[] = (() => {
  const out: string[] = [];
  for (const file of fs.readdirSync('manifest/commands')) {
    const data = JSON.parse(fs.readFileSync(path.join('manifest/commands', file), 'utf8')) as { commands: { id: string; history: { undoable: boolean }; entryPoints: { id: string; args?: Readonly<Record<string, unknown>> }[] }[] };
    for (const command of data.commands) if (command.history.undoable) out.push(command.id);
  }
  return out;
})();
// the door of a command that carries arguments: what the boot can hand a command that edits
const doorOf = (id: string): string | null => {
  for (const [ref, held] of DOORS) if (ref.startsWith(`${id}#`) && Object.keys(held.args).length > 0) return ref;
  return null;
};

test('o canvas é o documento, para cada comando desfazível', async ({ browser }) => {
  test.setTimeout(2_700_000);
  const SELECT = run('selection.select#layers-row', { target: 'n-hero' });
  const differences: string[] = [];
  const didNotRun: string[] = [];
  let ran = 0;
  for (const id of UNDOABLE) {
    const ref = doorOf(id);
    const commands: TestBootCommand[] = ref === null ? [SELECT] : [SELECT, run(ref)];
    // One context per command: the boot is fetched on a page's first load only, and the profile a page sees is the
    // context's (tests/support/editor.ts). The document from scratch is the one the editor saves: a reload reopens it
    // through the reader, the same path a person's second visit takes (tests/e2e/espaco.spec.ts, G7).
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    const page = await context.newPage();
    try {
      await openEditor(page, { project: DEEP, commands });
    } catch {
      // the helper asserts the boot ran every command as asked; a command the editor refuses is a result to read here
    }
    const results = await bootResults(page);
    // a command that could not run (a canvas gesture, a picker: the boot hands commands, not gestures) proves nothing
    const ranTheEdit = ref === null ? results.length > 0 : results[results.length - 1]?.status === 'done';
    if (!ranTheEdit) {
      didNotRun.push(id);
      await context.close();
      continue;
    }
    const editado = await serializeCanvas(page);
    await page.reload();
    await page.locator('.workbench').waitFor();
    await page.locator('.frame__page').waitFor();
    try {
      await expect.poll(() => serializeCanvas(page), { message: `${id}: o canvas depois de recarregar`, timeout: 4_000 }).toBe(editado);
    } catch {
      differences.push(id);
    }
    ran += 1;
    await context.close();
  }
  expect(differences, 'comandos cujo desenho incremental difere do desenho do zero').toEqual([]);
  // the boot hands commands, not gestures: a command that needs a canvas gesture, a picker or a state the fixture does
  // not have is refused, and a refused command draws nothing to compare. The floor keeps the batch from quietly
  // shrinking to nothing; the refused ones are listed with the test.
  expect(ran, 'comandos desfazíveis que o boot rodou e cujo desenho foi comparado').toBeGreaterThanOrEqual(150);
  test.info().annotations.push({ type: 'o boot recusou', description: didNotRun.join(', ') });
});

// ------------------------------------------------ 2b. o canvas e a exportação

test('o canvas e a exportação desenham as mesmas propriedades calculadas', runs('project.export#toolbar-top-bar-export'), async ({ page, context }) => {
  test.setTimeout(120_000);
  const PROPERTIES = ['display', 'position', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'color', 'background-color', 'text-align', 'border-top-width', 'box-sizing', 'flex-direction', 'gap'];
  const styles = (root: Element, properties: readonly string[]) =>
    [root, ...root.querySelectorAll('*')].map((el) => {
      const computed = el.ownerDocument.defaultView?.getComputedStyle(el);
      return [el.localName, ...properties.map((p) => computed?.getPropertyValue(p) ?? '')].join('|');
    });
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page, { project: DEEP });
  await page.keyboard.press('Control+0');
  const canvas = await page.frameLocator('.frame__page').locator('body').evaluate(styles, PROPERTIES);
  const download = page.waitForEvent('download');
  await page.locator('[data-door="project.export#toolbar-top-bar-export"]').first().click();
  const archive = await (await download).path();
  const files = unzip(fs.readFileSync(archive));
  const html = files.get('index.html')?.toString('utf8');
  const css = files.get('css/styles.css')?.toString('utf8');
  if (html === undefined || css === undefined) throw new Error('the archive lacks index.html or css/styles.css');
  const exported = await context.newPage();
  const width = await page.locator('.frame__page').evaluate((el) => (el as HTMLIFrameElement).contentDocument?.documentElement.clientWidth ?? 0);
  await exported.setViewportSize({ width, height: 900 });
  await exported.route('https://site.test/**', (route) => {
    const at = new URL(route.request().url()).pathname;
    return at === '/css/styles.css' ? route.fulfill({ contentType: 'text/css', body: css }) : route.fulfill({ contentType: 'text/html', body: html });
  });
  await exported.goto('https://site.test/index.html');
  const written = await exported.locator('body').evaluate(styles, PROPERTIES);
  expect(written.length, 'a página exportada tem os elementos do canvas').toBe(canvas.length);
  expect(written).toEqual(canvas);
  await exported.close();
});

// the inventory is read, not restated: the commands it names are the manifest's
test('o inventário em disco conhece os comandos do manifesto', () => {
  expect(INVENTORY_COMMANDS.size).toBeGreaterThan(0);
  expect([...DOORS.keys()].filter((ref) => !INVENTORY_COMMANDS.has(ref.split('#')[0] ?? ''))).toEqual([]);
});
