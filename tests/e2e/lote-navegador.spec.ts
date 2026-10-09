// As classes de navegador da etapa 5 (item 5 da "Tarefa do DeepSeek: a parte visual e de navegador"): o que só o
// navegador responde, com a fixture do projeto (a guarda de tela, o feed de incidentes e os erros do console vêm dela).
//  - Quadros de animação longos (Long Animation Frames): inserir, arrastar, digitar num campo, desfazer e trocar de
//    página, cada um com um observador de `long-animation-frame`; um quadro acima de 50 ms vira defeito, com os
//    `scripts[]` do quadro. A rodada aquece antes de medir: o primeiro quadro de uma sessão paga a compilação. Este
//    arquivo mede tempo de parede do navegador: rode-o sozinho, porque com outros navegadores na mesma máquina o quadro
//    passa de 50 ms por contenção (medido: 70,2 ms num quadro `onUp` com quinze arquivos em voo, e nenhum quadro acima
//    de 50 ms com este arquivo sozinho, nas duas condições).
//  - Memória: um `WeakRef` do elemento antes de cada ação, vinte repetições, `HeapProfiler.collectGarbage` e todos os
//    `WeakRef` vazios no fim (DEF-0571: só o da última volta era conferido).
//  - Composição de texto (IME) pelo CDP: durante a composição a tecla que escolheria uma entrada não roda comando, e
//    o texto entra inteiro; a composição é de um texto que casa com entradas, então só a guarda do keymap impede o
//    Enter, e o mesmo Enter depois de a composição confirmar roda a entrada (o controle).
//  - Área de transferência: copiar e colar um nó com estilo devolve o mesmo; colar HTML externo com `onclick` não
//    deixa o atributo entrar no documento, e o nó colado clicado no canvas não roda nada.
//  - Cores forçadas e movimento reduzido: nenhum controle que se via passa a não se ver, nem some contra o fundo (a
//    cor do controle igual à do fundo que ele tem).
//  - Texto bidirecional: uma página com `dir="rtl"` (`pageDirection`) e um texto de caracteres hebraicos e conteúdo
//    latino misto; o canvas desenha o texto da direita para a esquerda, e a edição mostra o mesmo texto.
//  - Cota: o localStorage cheio; o autosave não perde o documento e diz que o diário passou ao IndexedDB
//    (`status.save.journalInDatabase`, src/editor/persistence/autosave.ts).
import fs from 'node:fs';
import { expect, test, type Page } from '../support/test.ts';
import { openEditor } from '../support/editor.ts';
import { openQuickPanel, pagePoint, runDoor, runs } from './door.ts';

const FIXTURE = 'manifest/features/fixtures/aurora.json';
const OPEN = 'project.open#menu-file';
const INSERT = 'element.insert#elements-tile';
const DELETE = 'element.delete#key-delete-in-canvas';
// a exclusão pela Edit › Delete: o atalho do canvas só age com o contexto do canvas (a inserção deixa o foco na paleta)
const DELETE_MENU = 'element.delete#menu-edit';
const UNDO = 'history.undo#key-ctrl-z-in-global';
const COPY = 'clipboard.copy#key-ctrl-c-in-global';
const PASTE = 'clipboard.paste#key-ctrl-v-in-global';
const SELECT_ROW = 'selection.select#layers-row';
const EXPLORER = 'workspace.setPanelOpen#toolbar-activity-bar-explorer';
const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';

// o documento de aurora, como o porto de teste o lê
const tree = (page: Page) =>
  page.evaluate(() => {
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: unknown }[] }; selection: () => readonly string[] } }).__builderTestPort;
    return { tree: port.document().pages[0]?.tree ?? null, selection: port.selection() };
  });
const idsOf = (page: Page): Promise<readonly string[]> =>
  page.evaluate(() => {
    const walk = (n: { id: string; children: unknown[] }): string[] => [n.id, ...n.children.flatMap((c) => walk(c as never))];
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: never }[] } } }).__builderTestPort;
    return walk(port.document().pages[0]?.tree as never);
  });
const stylesOf = (page: Page, id: string): Promise<unknown> =>
  page.evaluate((node) => {
    const walk = (n: { id: string; styles: unknown; children: unknown[] }): unknown => (n.id === node ? n.styles : (n.children.map((c) => walk(c as never)).find((s) => s !== null && s !== undefined) ?? null));
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: never }[] } } }).__builderTestPort;
    return walk(port.document().pages[0]?.tree as never);
  }, id);

// the history's undo steps, as the test port reads them
const undoSteps = (page: Page): Promise<number> => page.evaluate(() => (window as unknown as { __builderTestPort: { history: () => { undoSteps: number } } }).__builderTestPort.history().undoSteps);
// the drag's undo when the drag made a step: a drag that moved nothing records none, and an undo then would take back
// what came before it (the page the case added)
const undoTheDrag = async (page: Page, before: number): Promise<void> => {
  if ((await undoSteps(page)) > before) await page.keyboard.press('Control+z');
};

const openAurora = async (page: Page): Promise<void> => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page);
  const chooser = page.waitForEvent('filechooser');
  await runDoor(page, OPEN);
  await (await chooser).setFiles({ name: 'aurora.json', mimeType: 'application/json', buffer: fs.readFileSync(FIXTURE) });
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-title"]')).toHaveCount(1);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-hero' } });
};

// ---------------------------------------------------------------- quadros longos

interface Frame {
  readonly duration: number;
  readonly scripts: readonly string[];
}
const observeFrames = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    const held: { duration: number; scripts: string[] }[] = [];
    (window as unknown as { __frames: typeof held }).__frames = held;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const frame = entry as PerformanceEntry & { scripts?: readonly { sourceURL?: string; sourceFunctionName?: string }[] };
        held.push({ duration: frame.duration, scripts: (frame.scripts ?? []).map((s) => `${s.sourceFunctionName ?? '?'}@${s.sourceURL ?? '?'}`) });
      }
    }).observe({ type: 'long-animation-frame', buffered: true });
  });
};
const framesOf = (page: Page): Promise<readonly Frame[]> => page.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames ?? []);

test('nenhum quadro de animação passa de 50 ms ao inserir, arrastar, digitar, desfazer e trocar de página', runs(OPEN, INSERT, UNDO, EXPLORER, 'pages.add#explorer-add-page', 'pages.switch#file-tab', INSERT_PANEL), async ({ page }) => {
  test.setTimeout(180_000);
  await observeFrames(page);
  await openAurora(page);

  // uma rodada de aquecimento com as mesmas ações: o primeiro quadro de cada caminho paga a compilação do código
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));
  const tile = page.locator(`[data-door="${INSERT}"][data-args*='"entry":"section"']`).first();
  // a segunda página, para a troca de página medida (DEF-0571: o caso abria e fechava a barra de comandos no lugar)
  await runDoor(page, EXPLORER);
  await page.locator('[data-door="pages.add#explorer-add-page"]').first().click();
  const tabs = page.locator('[data-door="pages.switch#file-tab"]');
  await expect(tabs, 'a página nova desenhou a sua aba').toHaveCount(2);
  // the page tabs stand in the Explorer and the tiles in the Insert panel, which share the side: each comes back when
  // its control is out of sight, as a person opens it
  const toPage = async (index: number): Promise<void> => {
    if (!(await tabs.nth(index).isVisible())) await runDoor(page, EXPLORER);
    await tabs.nth(index).click();
  };
  const insertSection = async (): Promise<void> => {
    if (!(await tile.isVisible())) await runDoor(page, INSERT_PANEL);
    await tile.click();
  };
  await toPage(0);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]')).toHaveCount(1);
  await insertSection();
  await page.keyboard.press('Control+z');
  const first = await pagePoint(page, 'centre');
  const beforeWarmDrag = await undoSteps(page);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  await page.mouse.move(first.x + 60, first.y + 30, { steps: 8 });
  await page.mouse.up();
  await undoTheDrag(page, beforeWarmDrag);
  await toPage(1);
  await toPage(0);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]')).toHaveCount(1);
  await page.waitForTimeout(200);
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));

  await insertSection();
  await page.keyboard.press('Control+z');
  const at = await pagePoint(page, 'centre');
  const beforeDrag = await undoSteps(page);
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  // um arraste de pessoa: um passo por quadro (~60 por segundo), e não a rajada que o mouse sintético entrega
  for (let step = 1; step <= 10; step++) {
    await page.mouse.move(at.x + 16 * step, at.y + 9 * step);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await undoTheDrag(page, beforeDrag);
  // digitar num campo: o campo de busca do inspector
  const field = page.locator('aside.inspector input[type="search"], aside.inspector input[type="text"]').first();
  if ((await field.count()) > 0) {
    await field.click();
    await page.keyboard.type('padding');
    await page.keyboard.press('Escape');
  }
  // trocar de página: a outra aba e de volta, cada página desenhada no quadro
  await toPage(1);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'a outra página está no quadro').toHaveCount(0);
  await toPage(0);
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'a primeira página voltou ao quadro').toHaveCount(1);
  await page.waitForTimeout(200);

  const long = (await framesOf(page)).filter((frame) => frame.duration > 50);
  expect(long.map((frame) => `${frame.duration.toFixed(1)} ms: ${frame.scripts.join(', ')}`), 'quadros de animação acima de 50 ms').toEqual([]);
});

// ---------------------------------------------------------------- memória

test('um controle desmontado não fica preso: o WeakRef esvazia depois da coleta', runs(OPEN, INSERT, DELETE_MENU), async ({ page, context }) => {
  test.setTimeout(600_000);
  await openAurora(page);
  const cdp = await context.newCDPSession(page);
  const alive: string[] = [];
  // every turn's element is held, not only the last one's (DEF-0571)
  const holdInPage = (selector: string): Promise<void> =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el === null) throw new Error(`o elemento ${sel} não está desenhado`);
      const held = window as unknown as { __probes?: WeakRef<Element>[] };
      (held.__probes ??= []).push(new WeakRef(el));
    }, selector);
  // Cada ação vinte vezes; no fim, coletas de lixo em laço (até doze, com uma espera entre elas: uma só é instável,
  // e foi uma medição instável que fez a primeira hipótese do DEF-0522 cair) e os WeakRef das vinte voltas, que
  // precisam estar vazios: um controle fora do documento não pode continuar referenciado.
  const cycle = async (what: string, action: () => Promise<void>): Promise<void> => {
    await page.evaluate(() => void ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes = []));
    for (let i = 0; i < 20; i++) await action();
    const turns = await page.evaluate(() => (window as unknown as { __probes?: WeakRef<Element>[] }).__probes?.length ?? 0);
    expect(turns, `${what}: as vinte voltas guardaram o seu elemento`).toBe(20);
    let held: readonly string[] = ['não medido'];
    for (let round = 0; round < 12 && held.length > 0; round++) {
      await cdp.send('HeapProfiler.collectGarbage');
      await page.waitForTimeout(60);
      held = await page.evaluate(() =>
        ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes ?? []).flatMap((probe, turn) => {
          const el = probe.deref();
          return el === undefined ? [] : [`volta ${String(turn + 1)} ${el.isConnected ? 'conectado' : 'preso'}`];
        }),
      );
    }
    // the element on the page now (the last turn's, when the action leaves it drawn) is no leak
    const leaked = held.filter((one) => one.endsWith('preso'));
    if (leaked.length > 0) alive.push(`${what} (${leaked.join(', ')})`);
  };

  await cycle('o menu', async () => {
    await page.locator('[data-menu="file"]').first().click();
    await holdInPage('[data-region="menu:file"]');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-region="menu:file"]'), 'o menu fecha').toHaveCount(0);
  });
  // O painel rápido fechado pelo Esc: o caminho do DEF-0522, corrigido (o foco volta ao chip com o painel ainda
  // desenhado, e só então ele sai da página).
  await cycle('o painel rápido', async () => {
    await openQuickPanel(page);
    await holdInPage('.quick-panel');
    await page.keyboard.press('Escape');
    await expect(page.locator('.quick-panel'), 'o painel rápido fecha').toHaveCount(0);
    // the focus stays on the chip, the same element the close gave it to (DEF-0533: a frame later it was mounted again
    // and the focus fell to the body; measured in Chrome before and after the correction)
    await expect.poll(() => page.evaluate(() => document.activeElement?.matches('[data-quick-panel-chip][aria-expanded="false"]') === true), { message: 'o foco fica no chip depois do fecho' }).toBe(true);
    await page.waitForTimeout(50);
    expect(await page.evaluate(() => document.activeElement?.matches('[data-quick-panel-chip][aria-expanded="false"]') === true), 'o foco continua no chip um instante depois').toBe(true);
  });
  await cycle('o nó inserido e apagado', async () => {
    await page.locator(`[data-door="${INSERT}"][data-args*='"entry":"section"']`).first().click();
    const id = await page.evaluate(() => (window as unknown as { __builderTestPort: { selection: () => readonly string[] } }).__builderTestPort.selection()[0] ?? null);
    if (id === null) throw new Error('a inserção não deixou seleção');
    await page.evaluate((node) => {
      const el = document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument?.querySelector(`[data-node="${node}"]`);
      if (el === null || el === undefined) throw new Error(`o canvas não desenha ${node}`);
      ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes ??= []).push(new WeakRef(el));
    }, id);
    await runDoor(page, DELETE_MENU);
    await expect.poll(() => idsOf(page), { message: `o nó ${id} apagado sai do documento` }).not.toContain(id);
  });
  await runDoor(page, EXPLORER);
  await page.locator('[data-door="pages.add#explorer-add-page"]').first().click();
  const tabs = page.locator('[data-door="pages.switch#file-tab"]');
  await expect(tabs, 'a página nova desenhou a sua aba').toHaveCount(2);
  await cycle('a página trocada', async () => {
    await tabs.nth(0).click();
    await expect(page.locator('.frame__page')).toBeVisible();
    await page.evaluate(() => {
      // um nó da página que sai, e não o corpo do quadro (que a troca reusa)
      const el = document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument?.querySelector('[data-node="n-hero"]');
      if (el === null || el === undefined) throw new Error('a página não desenhou o hero');
      ((window as unknown as { __probes?: WeakRef<Element>[] }).__probes ??= []).push(new WeakRef(el));
    });
    await tabs.nth(1).click();
    // a página que saiu deixa de ser desenhada: o quadro mostra a outra
    await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'a página trocada sai do quadro').toHaveCount(0);
  });

  expect(alive, 'controles que continuam vivos depois da coleta de lixo').toEqual([]);
});

// ---------------------------------------------------------------- composição de texto (IME)

test('durante a composição nenhum atalho dispara e o texto entra inteiro', runs(OPEN), async ({ page, context }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  const cdp = await context.newCDPSession(page);
  await page.keyboard.press('Control+k');
  const field = page.locator('[data-region="command-palette"] input[role="combobox"]');
  await expect(field, 'a barra de comandos abre com o seu campo').toBeVisible();
  await field.click();
  await field.press('Control+a');
  await field.press('Backspace');
  const nodesBefore = await idsOf(page);
  // A composição de um texto que casa com entradas (measured in Chrome: "wrap" lists Wrap in a row, in a column, in a
  // container): o texto ainda não está confirmado, e o Enter, que chega com isComposing, não pode rodar a entrada
  // (src/editor/input/keymap.ts, `if (event.isComposing || event.keyCode === 229) return;`). Sem a guarda, o Enter
  // rodaria a primeira entrada listada (DEF-0571: a composição de kana não casava com nada e o caso passava sem ela).
  await cdp.send('Input.imeSetComposition', { text: 'wrap', selectionStart: 4, selectionEnd: 4 });
  await expect(page.locator('[data-region="command-palette"] [role="option"]').first(), 'a consulta em composição lista entradas').toBeVisible();
  await field.press('Enter');
  expect(await idsOf(page), 'a tecla apertada durante a composição rodou um comando').toEqual(nodesBefore);
  await expect(field, 'a barra continua aberta durante a composição').toBeVisible();
  // a composição confirma o texto inteiro
  await cdp.send('Input.insertText', { text: 'wrap' });
  await expect(field).toHaveValue('wrap');
  // o controle: o mesmo Enter, sem composição, roda a primeira entrada (um envoltório novo no documento)
  await field.press('Enter');
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'o Enter fora da composição roda a entrada listada' }).toBeGreaterThan(nodesBefore.length);
});

// ---------------------------------------------------------------- área de transferência

test('copiar e colar um nó com estilo devolve o mesmo, e HTML externo com onclick não entra', runs(OPEN, COPY, PASTE), async ({ page, context }) => {
  test.setTimeout(120_000);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openAurora(page);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-title' } });
  const before = await idsOf(page);
  await runDoor(page, COPY);
  // a cópia assenta na área de transferência antes de a colagem a ler: sem esta espera, com a máquina carregada a
  // colagem lia antes da escrita e o comando era recusado (a bateria roda com três processos)
  await expect.poll(() => page.evaluate(async () => (await navigator.clipboard.readText()).includes('builder/elements')), { message: 'a cópia assenta na área de transferência' }).toBe(true);
  await runDoor(page, PASTE);
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'a colagem deixa um nó novo' }).toEqual(before.length + 1);
  const after = await idsOf(page);
  const added = after.filter((id) => !before.includes(id));
  expect(added, 'a colagem deixou um nó novo').toHaveLength(1);
  const copy = added[0] as string;
  expect(await stylesOf(page, copy), 'o estilo do nó colado é o do nó copiado').toEqual(await stylesOf(page, 'n-title'));

  // HTML externo com onclick: o atributo não pode atravessar a colagem
  const nodes = (await idsOf(page)).length;
  await page.evaluate(async () => {
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob(['<div onclick="window.pwned=1">x</div>'], { type: 'text/html' }) })]);
  });
  const beforeExternal = await idsOf(page);
  await runDoor(page, PASTE);
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'a colagem do HTML externo deixa um nó' }).toBeGreaterThan(nodes);
  // the attribute never enters the document: no attribute of the pasted nodes is an event handler (DEF-0571: the case
  // read only the editor's window, and nothing clicked the pasted node)
  const pasted = (await idsOf(page)).filter((id) => !beforeExternal.includes(id));
  const handlers = await page.evaluate((ids) => {
    const port = (window as unknown as { __builderTestPort: { document: () => { pages: { tree: unknown }[] } } }).__builderTestPort;
    type Node = { id: string; attributes: Record<string, unknown>; customAttributes?: Record<string, unknown>; children: Node[] };
    const all: Node[] = [];
    const walk = (n: Node) => {
      all.push(n);
      n.children.forEach(walk);
    };
    walk(port.document().pages[0]?.tree as Node);
    return all.filter((n) => ids.includes(n.id)).flatMap((n) => [...Object.keys(n.attributes), ...Object.keys(n.customAttributes ?? {})].filter((name) => /^on/i.test(name)).map((name) => `${n.id}.${name}`));
  }, pasted);
  expect(pasted.length, 'a colagem deixou nós novos').toBeGreaterThan(0);
  expect(handlers, 'atributos de evento nos nós colados').toEqual([]);
  // the pasted node clicked on the canvas runs nothing, in the frame's window nor in the editor's
  const point = await page.evaluate((node) => {
    const iframe = document.querySelector<HTMLIFrameElement>('.frame__page');
    const el = iframe?.contentDocument?.querySelector(`[data-node="${node}"]`);
    if (iframe === null || iframe === undefined || el === null || el === undefined) throw new Error('o canvas não desenhou o nó colado');
    const zoom = iframe.currentCSSZoom;
    const frame = iframe.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { x: frame.left + (rect.left + rect.width / 2) * zoom, y: frame.top + (rect.top + rect.height / 2) * zoom };
  }, pasted[0] ?? '');
  await page.mouse.click(point.x, point.y);
  expect(await page.evaluate(() => (window as unknown as { pwned?: number }).pwned), 'o onclick do HTML colado rodou no editor').toBeUndefined();
  expect(await page.evaluate(() => (document.querySelector<HTMLIFrameElement>('.frame__page')?.contentWindow as unknown as { pwned?: number } | null)?.pwned), 'o onclick do HTML colado rodou no canvas').toBeUndefined();
});

// ---------------------------------------------------------------- cores forçadas e movimento reduzido

test('com cores forçadas e movimento reduzido nenhum controle que se via passa a não se ver', runs(OPEN), async ({ page }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  // what forced colours change is colour: a control is seen when it is drawn and its colour (its text's and its
  // icons', which draw in currentColor) differs from the background it stands on, the first one not transparent up its
  // ancestors (DEF-0571: the case measured only visibility and display, which forced colours never change)
  const seen = () =>
    page.evaluate(() => {
      const opaque = (colour: string) => !/rgba\(.*,\s*0\)$/.test(colour) && colour !== 'transparent';
      const backgroundOf = (from: Element): string => {
        for (let at: Element | null = from; at !== null; at = at.parentElement) {
          const colour = getComputedStyle(at).backgroundColor;
          if (opaque(colour)) return colour;
        }
        return 'rgb(255, 255, 255)';
      };
      return [...document.querySelectorAll('[data-door], [data-local]')].map((control, index) => {
        const style = getComputedStyle(control);
        const drawn = style.visibility !== 'hidden' && style.display !== 'none' && control.getBoundingClientRect().width > 0;
        const marks = (control.textContent ?? '').trim() !== '' || control.querySelector('svg') !== null;
        return { key: `${control.getAttribute('data-door') ?? control.getAttribute('data-local') ?? '?'}#${index}`, drawn, apart: !marks || style.color !== backgroundOf(control), colour: `${style.color} sobre ${backgroundOf(control)}` };
      });
    });
  const before = await seen();
  await page.emulateMedia({ forcedColors: 'active' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const after = await seen();
  const wasSeen = new Map(before.map((one) => [one.key, one.drawn && one.apart]));
  const lost = after.filter((one) => wasSeen.get(one.key) === true && !(one.drawn && one.apart)).map((one) => `${one.key}: ${one.drawn ? one.colour : 'não desenhado'}`);
  expect(lost, 'controles que se viam e as cores forçadas esconderam ou apagaram contra o fundo').toEqual([]);
  await page.locator('.workbench').screenshot({ path: 'test-results/lote-navegador-cores-forcadas.png' });
});

// ---------------------------------------------------------------- texto bidirecional

test('numa página da direita para a esquerda, um texto com caracteres hebraicos e conteúdo misto aparece certo no canvas, na edição e em Camadas', runs(SELECT_ROW, 'text.startEdit#canvas-double-click-text-element'), async ({ page }) => {
  test.setTimeout(120_000);
  const MIXED = 'שלום hello 123';
  const project = JSON.stringify({
    version: 4,
    pages: [
      {
        id: 'p-home',
        name: 'Início',
        file: 'index.html',
        tree: {
          id: 'r-page',
          type: 'page',
          name: 'Página',
          tag: 'body',
          // the page reads right to left (its dir: pageDirection, manifest/elements.json; DEF-0571)
          attributes: { pageDirection: 'rtl' },
          classes: [],
          styles: {},
          text: null,
          children: [
            {
              id: 'r-section',
              type: 'section',
              name: 'Seção',
              tag: 'section',
              attributes: {},
              classes: [],
              styles: {},
              text: null,
              children: [{ id: 'r-text', type: 'paragraph', name: 'Texto misto', tag: 'p', attributes: {}, classes: [], styles: {}, text: MIXED, children: [] }],
            },
          ],
        },
      },
    ],
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await openEditor(page, { project: { text: project } });
  const drawnText = page.frameLocator('.frame__page').locator('[data-node="r-text"]');
  expect(await drawnText.innerText()).toBe(MIXED);
  // the canvas draws it right to left: the page's direction reaches the paragraph, which starts at its right edge
  expect(await drawnText.evaluate((el) => getComputedStyle(el).direction), 'a direção calculada do texto').toBe('rtl');
  expect(await page.frameLocator('.frame__page').locator('html').getAttribute('dir'), 'o dir da página no canvas').toBe('rtl');
  await runDoor(page, SELECT_ROW, { args: { target: 'r-text' } });
  const layers = await page.locator('[data-region="layers-tree"] .row.is-selected').first().innerText();
  expect(layers).toContain('Texto misto');
  const field = await tree(page);
  expect(JSON.stringify(field.selection)).toContain('r-text');
  // a edição do texto na própria página (um duplo clique): o mesmo texto, na mesma ordem. O ponto sai da posição do
  // quadro mais a do nó vezes o zoom do quadro (seção 8 do CLAUDE.md): o boundingBox do Playwright não o aplica
  const at = await page.evaluate((node) => {
    const iframe = document.querySelector<HTMLIFrameElement>('.frame__page');
    const el = iframe?.contentDocument?.querySelector(`[data-node="${node}"]`);
    if (iframe === null || iframe === undefined || el === null || el === undefined) throw new Error('o canvas não desenhou o texto');
    const zoom = iframe.currentCSSZoom;
    const frame = iframe.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { x: frame.left + (rect.left + rect.width / 2) * zoom, y: frame.top + (rect.top + rect.height / 2) * zoom };
  }, 'r-text');
  await page.mouse.dblclick(at.x, at.y);
  const editing = page.frameLocator('.frame__page').locator('[data-node="r-text"]');
  await expect(editing, 'a edição abre no próprio texto').toHaveAttribute('contenteditable', 'plaintext-only');
  expect(await editing.innerText()).toBe(MIXED);
  await page.keyboard.press('Escape');
  await page.locator('[data-region="canvas-frame"]').screenshot({ path: 'test-results/lote-navegador-bidi.png' });
});

// ---------------------------------------------------------------- cota de armazenamento

test('com o armazenamento cheio o autosave não perde o documento e diz para onde o diário foi', runs(OPEN, DELETE), async ({ page }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  // enche o localStorage até a cota
  // to its last bytes: a piece that no longer fits halves, down to one character (DEF-0571: the room the 256 KB pieces
  // left still held the journal, so the case never reached the notice)
  await page.evaluate(() => {
    let piece = 256 * 1024;
    for (let i = 0; i < 4000 && piece >= 1; i++) {
      try {
        localStorage.setItem(`cheio-${i}`, 'x'.repeat(piece));
      } catch {
        piece = Math.floor(piece / 2);
      }
    }
  });
  const full = await page.evaluate(() => {
    try {
      localStorage.setItem('cheio-fim', 'x');
      return false;
    } catch {
      return true;
    }
  });
  expect(full, 'o localStorage recusou a escrita: é o estado que a cota deixa').toBe(true);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-actions' } });
  await runDoor(page, DELETE);
  const status = page.locator('.status-bar');
  await expect(status, 'o autosave para de gravar e diz em que estado ficou').not.toContainText(/Saving/i, { timeout: 20_000 });
  expect(await idsOf(page), 'a mudança continua no documento com o armazenamento cheio').not.toContain('n-actions');
  // the journal that no longer fits localStorage moves to IndexedDB, and the status bar says so (DEF-0571: the case
  // checked no notice)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __builderTestPort: { keys: () => readonly string[] } }).__builderTestPort.keys()), { message: 'o aviso de que o diário passou ao IndexedDB foi dito' }).toContain('status.save.journalInDatabase');
  await page.reload();
  await expect(page.locator('.workbench')).toBeVisible();
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-actions"]'), 'a mudança sobreviveu à recarga').toHaveCount(0);
});
