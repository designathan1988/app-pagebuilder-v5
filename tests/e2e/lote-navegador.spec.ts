// As classes de navegador da etapa 5 (item 5 da "Tarefa do DeepSeek: a parte visual e de navegador"): o que só o
// navegador responde, com a fixture do projeto (a guarda de tela, o feed de incidentes e os erros do console vêm dela).
//  - Quadros de animação longos (Long Animation Frames): inserir, arrastar, digitar num campo, desfazer e trocar de
//    página, cada um com um observador de `long-animation-frame`; um quadro acima de 50 ms vira defeito, com os
//    `scripts[]` do quadro. A rodada aquece antes de medir: o primeiro quadro de uma sessão paga a compilação.
//  - Memória: um `WeakRef` do elemento antes de cada ação, vinte repetições, `HeapProfiler.collectGarbage` e o
//    `WeakRef` vazio no fim.
//  - Composição de texto (IME) pelo CDP: durante a composição nenhum atalho dispara, e o texto entra inteiro.
//  - Área de transferência: copiar e colar um nó com estilo devolve o mesmo; colar HTML externo com `onclick` não
//    deixa o atributo entrar.
//  - Cores forçadas e movimento reduzido: nenhum controle que se via passa a não se ver.
//  - Texto bidirecional: um texto com caracteres hebraicos e conteúdo latino misto; o canvas, a edição e Camadas
//    mostram o mesmo texto (o modelo não permite `dir` num parágrafo: `manifest/generated/html-elements.json` dá a
//    `p` só `align`, então a direção vem dos próprios caracteres).
//  - Cota: o localStorage cheio; o autosave não perde o documento (o diário passa ao IndexedDB,
//    src/editor/persistence/autosave.ts:150, então só há aviso quando os dois armazenamentos recusam).
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

test('nenhum quadro de animação passa de 50 ms ao inserir, arrastar, digitar, desfazer e trocar de página', runs(OPEN, INSERT, UNDO), async ({ page }) => {
  test.setTimeout(180_000);
  await observeFrames(page);
  await openAurora(page);

  // uma rodada de aquecimento com as mesmas ações: o primeiro quadro de cada caminho paga a compilação do código
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));
  const tile = page.locator(`[data-door="${INSERT}"][data-args*='"entry":"section"']`).first();
  await tile.click();
  await page.keyboard.press('Control+z');
  const first = await pagePoint(page, 'centre');
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  await page.mouse.move(first.x + 60, first.y + 30, { steps: 8 });
  await page.mouse.up();
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+z');
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.evaluate(() => ((window as unknown as { __frames: unknown[] }).__frames.length = 0));

  await tile.click();
  await page.keyboard.press('Control+z');
  const at = await pagePoint(page, 'centre');
  await page.mouse.move(at.x, at.y);
  await page.mouse.down();
  // um arraste de pessoa: um passo por quadro (~60 por segundo), e não a rajada que o mouse sintético entrega
  for (let step = 1; step <= 10; step++) {
    await page.mouse.move(at.x + 16 * step, at.y + 9 * step);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await page.keyboard.press('Control+z');
  // digitar num campo: o campo de busca do inspector
  const field = page.locator('aside.inspector input[type="search"], aside.inspector input[type="text"]').first();
  if ((await field.count()) > 0) {
    await field.click();
    await page.keyboard.type('padding');
    await page.keyboard.press('Escape');
  }
  // trocar de página abre e fecha a lista (a página única é a que está aberta)
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Escape');
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
  const holdInPage = (selector: string): Promise<void> =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el === null) throw new Error(`o elemento ${sel} não está desenhado`);
      (window as unknown as { __probe: WeakRef<Element> }).__probe = new WeakRef(el);
    }, selector);
  // Cada ação vinte vezes; no fim, coletas de lixo em laço (até doze, com uma espera entre elas: uma só é instável,
  // e foi uma medição instável que fez a primeira hipótese do DEF-0522 cair) e o WeakRef da última volta, que precisa
  // estar vazio: o controle fora do documento não pode continuar referenciado. `retido` nomeia, para a ação que ainda
  // prende o seu controle, o defeito aberto que mede isso (auditoria/defeitos.md).
  const cycle = async (what: string, action: () => Promise<void>, retido?: string): Promise<void> => {
    for (let i = 0; i < 20; i++) await action();
    let held: string | null = 'nao medido';
    for (let round = 0; round < 12 && held !== null; round++) {
      await cdp.send('HeapProfiler.collectGarbage');
      await page.waitForTimeout(60);
      held = await page.evaluate(() => {
        const el = (window as unknown as { __probe?: WeakRef<Element> }).__probe?.deref();
        return el === undefined || el === null ? null : el.isConnected ? 'conectado' : 'preso';
      });
    }
    if (held === null) return;
    if (retido !== undefined) {
      expect(held, `${what}: a retenção medida é de um controle fora do documento`).toBe('preso');
      test.info().annotations.push({ type: retido, description: `${what} (${held})` });
      return;
    }
    alive.push(`${what} (${held})`);
  };

  await cycle('o menu', async () => {
    await page.locator('[data-menu="file"]').first().click();
    await holdInPage('[data-region="menu:file"]');
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-region="menu:file"]'), 'o menu fecha').toHaveCount(0);
  });
  // O painel rápido fechado pelo Esc (o caminho que o DEF-0522 mede: fechado pelo próprio chip, o mesmo elemento é
  // recolhido) ainda deixa o elemento referenciado; o defeito está aberto e o caso o registra.
  await cycle(
    'o painel rápido',
    async () => {
      await openQuickPanel(page);
      await holdInPage('.quick-panel');
      await page.keyboard.press('Escape');
      await expect(page.locator('.quick-panel'), 'o painel rápido fecha').toHaveCount(0);
    },
    'DEF-0522',
  );
  await cycle('o nó inserido e apagado', async () => {
    await page.locator(`[data-door="${INSERT}"][data-args*='"entry":"section"']`).first().click();
    const id = await page.evaluate(() => (window as unknown as { __builderTestPort: { selection: () => readonly string[] } }).__builderTestPort.selection()[0] ?? null);
    if (id === null) throw new Error('a inserção não deixou seleção');
    await page.evaluate((node) => {
      const el = document.querySelector<HTMLIFrameElement>('.frame__page')?.contentDocument?.querySelector(`[data-node="${node}"]`);
      if (el === null || el === undefined) throw new Error(`o canvas não desenha ${node}`);
      (window as unknown as { __probe: WeakRef<Element> }).__probe = new WeakRef(el);
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
      (window as unknown as { __probe: WeakRef<Element> }).__probe = new WeakRef(el);
    });
    await tabs.nth(1).click();
    // a página que saiu deixa de ser desenhada: o quadro mostra a outra
    await expect(page.frameLocator('.frame__page').locator('[data-node="n-hero"]'), 'a página trocada sai do quadro').toHaveCount(0);
  });

  console.log('limpezas:', await page.evaluate(() => (globalThis as unknown as { __chipCleanups?: number }).__chipCleanups ?? -1));
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
  // uma consulta com entradas listadas: o Enter de agora escolheria uma delas
  await page.keyboard.type('wrap');
  const nodesBefore = await idsOf(page);
  // A composição: o texto ainda não está confirmado, e a tecla que a escolheria um candidato não pode rodar comando
  // (src/editor/input/keymap.ts:385, `if (event.isComposing || event.keyCode === 229) return;`)
  await cdp.send('Input.imeSetComposition', { text: 'にほんご', selectionStart: 4, selectionEnd: 4 });
  await field.press('Enter');
  expect(await idsOf(page), 'a tecla apertada durante a composição rodou um comando').toEqual(nodesBefore);
  await expect(field, 'a barra continua aberta durante a composição').toBeVisible();
  await cdp.send('Input.insertText', { text: 'にほんご' });
  await expect(field).toHaveValue('wrapにほんご');
});

// ---------------------------------------------------------------- área de transferência

test('copiar e colar um nó com estilo devolve o mesmo, e HTML externo com onclick não entra', runs(OPEN, COPY, PASTE), async ({ page, context }) => {
  test.setTimeout(120_000);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openAurora(page);
  await runDoor(page, SELECT_ROW, { args: { target: 'n-title' } });
  const before = await idsOf(page);
  await runDoor(page, COPY);
  await runDoor(page, PASTE);
  // a leitura da área de transferência chega um instante depois da tecla (tests/e2e/clipboard-cut-styles.spec.ts)
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
  await runDoor(page, PASTE);
  await expect.poll(() => idsOf(page).then((ids) => ids.length), { message: 'a colagem do HTML externo deixa um nó' }).toBeGreaterThan(nodes);
  expect(await page.evaluate(() => (window as unknown as { pwned?: number }).pwned), 'o onclick do HTML colado rodou').toBeUndefined();
});

// ---------------------------------------------------------------- cores forçadas e movimento reduzido

test('com cores forçadas e movimento reduzido nenhum controle que se via passa a não se ver', runs(OPEN), async ({ page }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  const seen = () =>
    page.evaluate(() =>
      [...document.querySelectorAll('[data-door], [data-local]')].map((control, index) => {
        const style = getComputedStyle(control);
        return { index, key: `${control.getAttribute('data-door') ?? control.getAttribute('data-local') ?? '?'}#${index}`, hidden: style.visibility === 'hidden' || style.display === 'none' };
      }),
    );
  const before = await seen();
  await page.emulateMedia({ forcedColors: 'active' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const after = await seen();
  const wasVisible = new Map(before.map((one) => [one.key, !one.hidden]));
  const lost = after.filter((one) => wasVisible.get(one.key) === true && one.hidden).map((one) => one.key);
  expect(lost, 'controles que se viam e as cores forçadas esconderam').toEqual([]);
  await page.locator('.workbench').screenshot({ path: 'test-results/lote-navegador-cores-forcadas.png' });
});

// ---------------------------------------------------------------- texto bidirecional

test('um texto com caracteres hebraicos e conteúdo misto aparece certo no canvas, na edição e em Camadas', runs(OPEN, SELECT_ROW), async ({ page }) => {
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
          attributes: {},
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
  expect(await page.frameLocator('.frame__page').locator('[data-node="r-text"]').innerText()).toBe(MIXED);
  await runDoor(page, SELECT_ROW, { args: { target: 'r-text' } });
  const layers = await page.locator('[data-region="layers-tree"] .row.is-selected').first().innerText();
  expect(layers).toContain('Texto misto');
  const field = await tree(page);
  expect(JSON.stringify(field.selection)).toContain('r-text');
  await page.locator('[data-region="canvas-frame"]').screenshot({ path: 'test-results/lote-navegador-bidi.png' });
});

// ---------------------------------------------------------------- cota de armazenamento

test('com o armazenamento cheio o autosave não perde o documento', runs(OPEN, DELETE), async ({ page }) => {
  test.setTimeout(120_000);
  await openAurora(page);
  // enche o localStorage até a cota
  await page.evaluate(() => {
    for (let i = 0; i < 80; i++) {
      try {
        localStorage.setItem(`cheio-${i}`, 'x'.repeat(256 * 1024));
      } catch {
        return;
      }
    }
  });
  const full = await page.evaluate(() => {
    try {
      localStorage.setItem('cheio-fim', 'x'.repeat(512 * 1024));
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
  await page.reload();
  await expect(page.locator('.workbench')).toBeVisible();
  await expect(page.frameLocator('.frame__page').locator('[data-node="n-actions"]'), 'a mudança sobreviveu à recarga').toHaveCount(0);
});
