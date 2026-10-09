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
import { DOORS, door, openQuickPanel, runs } from './door.ts';
import { TEST_BOOT_PARAM, TEST_BOOT_URL, type TestBoot, type TestBootCommand, type TestBootResult } from '../../src/editor/test-boot.ts';

const DEEP = 'aurora';
// the edits the G7 case ran last time it was measured, less a margin for a command a fixture change takes away
const RAN_FLOOR = 45;
// the closed list of the editor's own marks (DCS-002): what the canvas draws and the document does not hold
const EDITOR_MARKS: readonly string[] = ['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style'];
const run = (ref: string, args: Readonly<Record<string, unknown>> = {}): TestBootCommand => ({ command: ref.split('#')[0] ?? '', args: { ...door(ref).args, ...args } });

interface Inventory {
  readonly features: readonly { readonly id: string; readonly commands: readonly string[] }[];
  readonly interactive: { readonly owners: Readonly<Record<string, number>>; readonly elements: readonly { readonly key: string; readonly tag: string; readonly role: string | null; readonly handlers: readonly string[]; readonly owner: string }[] };
}
const INVENTORY = JSON.parse(fs.readFileSync('manifest/generated/inventory.json', 'utf8')) as Inventory;
const INVENTORY_COMMANDS = new Set(INVENTORY.features.flatMap((f) => f.commands));
const LAYOUT = JSON.parse(fs.readFileSync('manifest/layout.json', 'utf8')) as { localControls: { id: string }[]; regions: { id: string; area: string }[] };
// the local controls manifest/layout.json declares, each with its reason
const LOCAL_CONTROLS: ReadonlySet<string> = new Set(LAYOUT.localControls.map((one) => one.id));
// the regions of the area "component": the parts of a control repeated wherever it is drawn (every field, every Layers
// row, every tab strip; src/manifest/schema.ts), drawn inside their control and never a region of the page of their own
// the states the style-state menu offers the selected element (manifest/properties.json: a state with elements names
// the element types it applies to; src/editor/doors/menu.tsx draws only those), and the type of the element the case
// selects (the fixture's n-title)
const STATES = (JSON.parse(fs.readFileSync('manifest/properties.json', 'utf8')) as { states: { id: string; elements: readonly string[] | null }[] }).states;
const SELECTED = 'n-title';
const SELECTED_TYPE = ((): string => {
  const walk = (node: { id: string; type: string; children: unknown[] }): string | null => (node.id === SELECTED ? node.type : (node.children.map((one) => walk(one as never)).find((one) => one !== null) ?? null));
  const fixture = JSON.parse(fs.readFileSync(`manifest/features/fixtures/${DEEP}.json`, 'utf8')) as { pages: { tree: never }[] };
  return walk(fixture.pages[0]?.tree as never) ?? '';
})();
const offeredState = (args: Readonly<Record<string, unknown>>): boolean => {
  const state = STATES.find((one) => one.id === args.state);
  return state === undefined || state.elements === null || state.elements.includes(SELECTED_TYPE);
};
const COMPONENT_REGIONS: ReadonlySet<string> = new Set(LAYOUT.regions.filter((one) => one.area === 'component').map((one) => one.id));

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
    // every element a person may act on: a mark, a role, a tabindex, or a tag of the rule's own list (DEF-0572: a
    // <button> or an <input> with no role nor tabindex was never visited)
    for (const element of document.querySelectorAll(['[data-door]', '[data-local]', '[role]', '[tabindex]', '[contenteditable]', ...tags].join(','))) {
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

test('a porta que a região monta é a que o manifesto coloca nela, e nenhum controle fica sem marca', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  // an element selected, so the quick panel's chip is drawn and the panel is opened too (DEF-0572: the editor opened
  // with nothing selected, and the panel's region was never read)
  await openEditor(page, { project: DEEP, commands: [run('selection.select#layers-row', { target: SELECTED })] });
  const states: Found[] = [await readMounted(page)];
  // every menu opened draws every door the manifest places in it (an unbuilt feature's door is drawn disabled)
  const menusMissing: string[] = [];
  const menusOpened: string[] = [];
  for (const menu of ['file', 'edit', 'arrange', 'view', 'help', 'theme', 'language', 'element-actions', 'zoom', 'snap', 'style-state']) {
    const button = page.locator(`[data-menu="${menu}"]`).first();
    if ((await button.count()) === 0) continue;
    await button.click();
    const state = await readMounted(page);
    states.push(state);
    menusOpened.push(menu);
    const drawn = new Set(state.doors.filter((one) => one.chain.includes(`menu:${menu}`)).map((one) => one.ref));
    for (const [ref, held] of DOORS) {
      if (typeof held.placement !== 'object' || held.placement.region !== `menu:${menu}` || drawn.has(ref)) continue;
      // the style-state menu offers only the states the selected element takes
      if (menu === 'style-state' && !offeredState(held.args)) continue;
      menusMissing.push(`menu:${menu} › ${ref}`);
    }
    await page.keyboard.press('Escape');
  }
  expect(menusOpened.length, 'os menus da barra do topo foram abertos').toBeGreaterThan(4);
  await page.keyboard.press('Control+k');
  states.push(await readMounted(page));
  await page.keyboard.press('Escape');
  await openQuickPanel(page);
  const panel = await readMounted(page);
  expect(panel.doors.filter((one) => one.chain.includes('quick-panel')).length, 'o painel rápido desenhou as suas portas').toBeGreaterThan(5);
  states.push(panel);
  await page.keyboard.press('Escape');
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
  // a key has no control of its own: a shortcut's door drawn is a door the page invents (a gesture's door, a handle or
  // a grip, is drawn by its gesture)
  const drawnKeys: string[] = [];
  // a local control the page draws is one manifest/layout.json declares
  const undeclaredLocals: string[] = [];
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
      if (placement === 'none' && held.kind === 'shortcut') drawnKeys.push(`${mounted.chain.join(' › ')} › ${mounted.ref}`);
      if (typeof placement === 'object' && !COMPONENT_REGIONS.has(placement.region)) {
        const outside = placement.region === 'overlay' && mounted.chain.length === 0;
        if (!outside && !mounted.chain.includes(placement.region)) wrongRegion.push(`${mounted.chain.join(' › ')} › ${mounted.ref} (o manifesto diz ${placement.region})`);
      }
    }
  for (const state of states) for (const local of state.locals) if (!LOCAL_CONTROLS.has(local.ref)) undeclaredLocals.push(`${local.chain.join(' › ')} › ${local.ref}`);
  for (const state of states)
    for (const element of state.unmarked) {
      const tag = element.ref.slice(0, element.ref.indexOf('['));
      const attrs = element.ref.slice(element.ref.indexOf('[') + 1, -1).split(',').filter((a) => a !== '');
      if (!allowed(tag, attrs)) unmarked.push(`${element.chain.join(' › ')} › ${element.ref}`);
    }
  expect([...new Set(unknown)], 'portas montadas que o manifesto não declara').toEqual([]);
  expect([...new Set(wrongRegion)], 'portas montadas na região errada').toEqual([]);
  expect([...new Set(unmarked)], 'controles sem data-door, sem data-local e fora da lista de exceções').toEqual([]);
  expect([...new Set(drawnKeys)], 'portas de tecla desenhadas como controle').toEqual([]);
  expect([...new Set(undeclaredLocals)], 'controles locais que manifest/layout.json não declara').toEqual([]);
  expect([...new Set(menusMissing)], 'portas que o manifesto põe num menu e o menu aberto não desenha').toEqual([]);
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

// every command of the manifest whose history is undoable
const UNDOABLE: readonly string[] = (() => {
  const out: string[] = [];
  for (const file of fs.readdirSync('manifest/commands')) {
    const data = JSON.parse(fs.readFileSync(path.join('manifest/commands', file), 'utf8')) as { commands: { id: string; history: { undoable: boolean }; entryPoints: { id: string; args?: Readonly<Record<string, unknown>> }[] }[] };
    for (const command of data.commands) if (command.history.undoable) out.push(command.id);
  }
  return out;
})();
// the door the boot runs a command by: one that carries arguments, else any of its doors (a door with none acts on the
// selection, here n-hero)
const doorOf = (id: string): string | null => {
  let any: string | null = null;
  for (const [ref, held] of DOORS) {
    if (!ref.startsWith(`${id}#`)) continue;
    if (Object.keys(held.args).length > 0) return ref;
    any ??= ref;
  }
  return any;
};

// The editor opened by the boot, for a case that reads what each command did: the wait openEditor makes (the
// workbench drawn, every command handed run, the canvas drawing), with a command the editor refuses read as a result,
// not asserted (DEF-0572: an empty catch swallowed the helper's assertions)
async function openWithBoot(page: Page, boot: TestBoot): Promise<readonly TestBootResult[]> {
  await page.route(TEST_BOOT_URL, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(boot) }));
  await page.goto(`/?${TEST_BOOT_PARAM}`);
  const handed = (boot.project === undefined ? 0 : 1) + (boot.commands?.length ?? 0) + (boot.drawn?.length ?? 0);
  const results = await page.evaluate(async (count) => {
    const port = () => (window as unknown as { __builderTestPort?: { boot: () => TestBootResult[] } }).__builderTestPort;
    const until = performance.now() + 10_000;
    const drawn = () => document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument?.querySelector('[data-node]') != null;
    while (!((port()?.boot().length ?? -1) >= count && drawn()) && performance.now() < until) await new Promise((resolve) => setTimeout(resolve, 5));
    return port()?.boot() ?? [];
  }, handed);
  await page.unroute(TEST_BOOT_URL);
  return results;
}
// what a page of the case leaves that the fixture would have read on its own page (DEF-0572: the case's pages, in
// contexts of their own, were out of its sight): the page's exceptions and console errors, and its incident feed
const watchPage = (page: Page): string[] => {
  const found: string[] = [];
  page.on('pageerror', (error) => found.push(`exceção: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) found.push(`console: ${message.text()}`);
  });
  return found;
};
const incidentsOf = (page: Page): Promise<readonly unknown[]> => page.evaluate(() => (window as unknown as { __builderTestPort?: { incidents: () => unknown[] } }).__builderTestPort?.incidents() ?? []);

test('o canvas é o documento, para cada comando desfazível', async ({ browser }) => {
  test.setTimeout(2_700_000);
  // the elements a command is tried on, in turn, until one takes it: a section, then a heading (a command for text
  // refuses a section). Measured on 2026-10-09: the section alone ran 47 edits in 3 minutes; five elements (a
  // paragraph, a list item and a grid besides) ran 50 in 11 minutes
  const TARGETS = ['n-hero', 'n-title'];
  const project = fs.readFileSync(`manifest/features/fixtures/${DEEP}.json`, 'utf8');
  const differences: string[] = [];
  const didNotRun: string[] = [];
  const problems: string[] = [];
  let ran = 0;
  for (const id of UNDOABLE) {
    const ref = doorOf(id);
    if (ref === null) {
      didNotRun.push(`${id} (sem porta)`);
      continue;
    }
    // One context per command: the boot is fetched on a page's first load only, and the profile a page sees is the
    // context's (tests/support/editor.ts). The edit runs once the editor is drawn (the boot's drawn commands), so the
    // canvas shows it by its incremental path; the document from scratch is the one the editor saves, which a reload
    // reopens through the reader, the path a person's second visit takes (DEF-0572: the edit ran before the first
    // drawing, and both sides were drawings from scratch).
    let context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
    let page = await context.newPage();
    let errors = watchPage(page);
    let status = 'sem resultado';
    for (const [index, target] of TARGETS.entries()) {
      if (index > 0) {
        await context.close();
        context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' });
        page = await context.newPage();
        errors = watchPage(page);
      }
      const results = await openWithBoot(page, { project, commands: [run('selection.select#layers-row', { target })], drawn: [run(ref)] });
      status = results.length < 3 ? 'sem resultado' : (results[results.length - 1]?.status ?? 'sem resultado');
      if (status === 'done') break;
    }
    // a command that could not run on any of them (a canvas gesture, a picker, a state the fixture does not have)
    // proves nothing
    if (status !== 'done') {
      didNotRun.push(`${id} (${status})`);
      await context.close();
      continue;
    }
    const incremental = await serializeCanvas(page);
    await page.reload();
    await page.locator('.workbench').waitFor();
    await page.locator('.frame__page').waitFor();
    const fromScratch = await expect
      .poll(() => serializeCanvas(page), { message: `${id}: o canvas depois de recarregar`, timeout: 4_000 })
      .toBe(incremental)
      .then(() => true, () => false);
    if (!fromScratch) differences.push(id);
    for (const incident of await incidentsOf(page)) problems.push(`${id}: incidente ${JSON.stringify(incident).slice(0, 200)}`);
    for (const error of errors) problems.push(`${id}: ${error}`);
    ran += 1;
    await context.close();
  }
  test.info().annotations.push({ type: 'o boot recusou', description: didNotRun.join(', ') });
  expect(differences, 'comandos cujo desenho incremental difere do desenho do zero').toEqual([]);
  expect(problems, 'incidentes e erros das páginas do caso').toEqual([]);
  // only the edits that ran count (DEF-0572: a selection alone counted as a command run); the floor keeps the batch
  // from quietly shrinking, the refused ones listed with the test
  expect(ran, 'comandos desfazíveis que rodaram depois do primeiro desenho e cujo desenho foi comparado').toBeGreaterThanOrEqual(RAN_FLOOR);
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
  // the document after real edits, not only as the fixture holds it (DEF-0572: the export was compared with the
  // unedited document alone)
  const edit = (target: string, property: string, value: string): TestBootCommand[] => [run('selection.select#layers-row', { target }), run('style.set#inspector-width', { property, value })];
  await openEditor(page, {
    project: DEEP,
    commands: [...edit('n-hero', 'padding-top', '48px'), ...edit('n-title', 'font-size', '40px'), ...edit('n-title', 'color', '#c0392b'), ...edit('n-intro', 'margin-top', '24px'), ...edit('n-actions', 'gap', '18px')],
  });
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
  // the site's width: the body's, which the scrollbar's room does not take (DEF-0521, DEF-0572)
  const width = await page.locator('.frame__page').evaluate((el) => (el as HTMLIFrameElement).contentDocument?.body.clientWidth ?? 0);
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
