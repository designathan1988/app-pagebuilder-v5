# TRC-page.openProperties

- **Chamada:** `src/app/commands.ts:341` `'page.openProperties': openPageProperties,`
- **Argumentos:** o tratador recebe `HandlerContext<EditorUi>` e os argumentos `{}` (`manifest/commands/page.json:9` `"args": {},`); as duas portas (inspector-page-properties-button e command-bar) enviam `{}`.
- **Ramos que dependem dos argumentos:** nenhum — o comando não recebe argumentos (`manifest/commands/page.json:9` `"args": {},`); os ramos dependem do documento e do estado do editor.

## Passos

1. `src/app/commands.ts:341` `'page.openProperties': openPageProperties,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho da store do editor entra aqui.
4. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é undoável (`manifest/commands/page.json:17` `"undoable": false`), `changesDocument` é falso.
5. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho segue para a store do núcleo.
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
9. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — sem argumentos, nenhuma recusa.
10. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado `always` passa.
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
12. `src/editor/inspector/page-properties.ts:24` `export const openPageProperties = registerHandler<'page.openProperties', EditorUi>('page.openProperties', ({ state, rules }) => {` — o tratador.
13. `src/editor/inspector/page-properties.ts:25` `const root = pageShown(state)?.tree;` — [lê: EST-L01-030 via pageShown] [lê: EST-L01-037 via pageShown]
14. `src/core/project/pages.ts:72` `export const pageShown = (state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): Page | null => state.document.pages[openedPage(state)] ?? null;` — a página aberta.
15. `src/core/project/pages.ts:64` `export function openedPage(state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): number {` — a página que o editor mostra.
16. `src/editor/inspector/page-properties.ts:26` `if (root === undefined) throw new Error('page.openProperties: the document has no page');` — R1.
17. `src/editor/inspector/page-properties.ts:17` `function settingsTab(rules: ModelRules): string {` — a aba que desenha os campos das configurações da página.
18. `src/editor/inspector/page-properties.ts:18` `const field = manifest.doors.find((d) => d.door.kind === 'inspector-field' && d.door.attribute !== null && isPageSetting(rules.attributes.get(d.door.attribute), rules.root.type));` — [lê: EST-L01-030 via handlerContext]
19. `src/editor/inspector/page-properties.ts:19` `const tab = field !== undefined && typeof field.door.placement === 'object' ? inspectorTabDrawing(field.door.placement.region) : null;` — R3.
20. `src/editor/workspace/layout.ts:76` `export function inspectorTabDrawing(region: string): string | null {` — casa a região com a aba que a desenha.
21. `src/editor/inspector/page-properties.ts:20` `if (tab === null) throw new Error('page.openProperties: no inspector tab draws the fields of the page settings');` — R3.
22. `src/editor/inspector/page-properties.ts:27` `return { kind: 'change', selection: [root.id], ui: withInspectorTab(withInspector(state.ui, true), settingsTab(rules)), message: message('status.selected', { name: root.name }) };` — o Outcome `change`.
23. `src/editor/workspace/panels.ts:106` `export const withInspector = (ui: EditorUi, open: boolean): EditorUi => panelsAt('inspector').reduce((next, panel) => withPanel(next, panel, open), ui);` — abre o painel do inspector.
24. `src/editor/workspace/layout.ts:81` `export function withInspectorTab(ui: EditorUi, panel: string): EditorUi {` — a aba escolhida.
25. `src/editor/workspace/layout.ts:83` `if (inspectorTab(ui) === panel) return ui;` — R4.
26. `src/editor/workspace/layout.ts:84` `return { ...ui, layout: { ...ui.layout, inspectorTab: panel === FIRST_INSPECTOR_TAB ? undefined : panel } };` — grava a aba.
27. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — [escreve: EST-L01-031 via run]
28. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run]
29. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
30. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish]
31. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-033 via publish]
32. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/editor/inspector/page-properties.ts:26` `if (root === undefined) throw new Error('page.openProperties: the document has no page');` — documento sem página: lança; com página: segue com a raiz dela.
- R2 `src/core/project/pages.ts:66` `if (typeof named !== 'string') return 0;` — `ui.page` ausente ou não-string: `openedPage` devolve 0 (a primeira página); string: procura o índice e cai em 0 se nenhuma casa (`src/core/project/pages.ts:68` `return at < 0 ? 0 : at;`).
- R3 `src/editor/inspector/page-properties.ts:19` `const tab = field !== undefined && typeof field.door.placement === 'object' ? inspectorTabDrawing(field.door.placement.region) : null;` — uma porta inspector-field é achada e a região dela nomeia uma aba: `tab` é essa aba; sem porta ou sem aba: a linha 20 lança.
- R4 `src/editor/workspace/layout.ts:83` `if (inspectorTab(ui) === panel) return ui;` — a aba já é a mostrada: devolve o mesmo `ui`; outra: a linha 84 grava `layout.inspectorTab`.
- R5 `src/editor/workspace/panels.ts:69` `return { ...ui, panels: { ...p, open: { ...p.open, [panel]: open } } };` — o inspector tem lugar próprio (`manifest/layout.json:649` `"place": "inspector",`), então `withPanel` cai no ramo padrão e grava `panels.open.inspector` verdadeiro.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/inspector/page-properties.ts:24` `export const openPageProperties = registerHandler<'page.openProperties', EditorUi>('page.openProperties', ({ state, rules }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (a página aberta, `document.pages`), EST-L01-037 (`ui`), EST-L05a-001 (a digitação pendente de um campo).
- escreve: EST-L01-031 (a seleção), EST-L01-037 (`ui`: `panels.open.inspector` e `layout.inspectorTab`).

## Resultado

- **Estado final:** EST-L01-031 e EST-L01-037 — a seleção passa a ser `[root.id]` e `ui` mostra a aba Settings com o inspector aberto (`src/editor/inspector/page-properties.ts:27`); o documento não muda (o comando não é undoável: `manifest/commands/page.json:17` `"undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o inspector desenha a aba escolhida (`src/editor/shell/inspector.tsx:717` `const tab = useEditorState((s) => inspectorTab(s.ui));`) e a barra de status mostra a mensagem (`src/editor/shell/status-bar.tsx:37` `const message = useEditorState((s) => s.message);`).
- **DOM do canvas:** as alças e o rótulo seguem a seleção nova (`src/editor/canvas/chrome.tsx:1044` `const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando cria o contexto com a seleção e `ui` (`src/editor/inspector/page-properties.ts:27` `return { kind: 'change', selection: [root.id], ui: withInspectorTab(withInspector(state.ui, true), settingsTab(rules)), message: message('status.selected', { name: root.name }) };`), não escreve camada de estilo nem classe nem quadro-chave.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `page.openProperties` muda a seleção e, vindo de fora do campo, grava a digitação pendente antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:341` `'page.openProperties': openPageProperties,` — as duas portas chegam ao mesmo tratador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/editor/inspector/page-properties.ts:27`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/inspector/page-properties.ts:27`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa a ser `[root.id]` e vem da store, sem cópia local.
- G7: n/a — o comando não emite patches (`src/editor/inspector/page-properties.ts:27`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/page-properties.ts:24`).

## Medições

- nenhuma
