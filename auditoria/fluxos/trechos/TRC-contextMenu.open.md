# TRC-contextMenu.open

- **Chamada:** `src/app/commands.ts:364` `  'contextMenu.open': contextMenuOpen,`
- **Argumentos:** o tratador recebe `HandlerContext<EditorUi>` e os argumentos `{ target }`, com o campo `target` (args.target, tipo `node`, `refers: node`); as três portas (canvas-right-click-element-or-page, layers-row-secondary-click, quick-panel-more-actions) enviam o id do nó.
- **Ramos que dependem dos argumentos:** R1 (`target` que o documento não tem faz lançar); R2 (`target` já na seleção conserva a seleção); R3 (`target` fora da seleção passa a ser a seleção).

## Passos

1. `src/app/commands.ts:364` `  'contextMenu.open': contextMenuOpen,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — cada porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via dispatch] [lê: EST-L01-031 via dispatch] [lê: EST-L01-037 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade é `always`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run] [lê: EST-L01-037 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/editor/menus/context-menu.ts:26` `export const contextMenuOpen = registerHandler<'contextMenu.open', EditorUi>('contextMenu.open', ({ state }, { target }) => {` — o tratador ligado à store do editor.
8. `src/editor/menus/context-menu.ts:27` `  const found = locate(state.document, target);` — [lê: EST-L01-030 via locate]
9. `src/editor/menus/context-menu.ts:29` `  if (!found) throw new Error(`contextMenu.open: the document has no node ${target}`);` — R1.
10. `src/editor/menus/context-menu.ts:30` `  const ui: EditorUi = { ...state.ui, contextMenu: { opened: { count: (state.ui.contextMenu.opened?.count ?? 0) + 1, dismissals: state.ui.overlays.dismissals } } };` — a abertura entra no estado do editor. [escreve: EST-L01-037 via run]
11. `src/editor/menus/context-menu.ts:31` `  if (state.selection.includes(target)) return { kind: 'change', ui };` — R2: nó já selecionado, a seleção fica. [lê: EST-L01-031 via handlerContext]
12. `src/editor/menus/context-menu.ts:32` `  return { kind: 'change', ui, selection: [target], message: message('status.selected', { name: found.node.name }) };` — R3: o nó passa a ser a seleção. [escreve: EST-L01-037 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
13. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
14. `src/core/store/store.ts:537` `      selection,` — [escreve: EST-L01-031 via run]
15. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — o estado do editor do `Outcome` entra no estado. [escreve: EST-L01-037 via run]
16. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — [escreve: EST-L01-033 via run]
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
18. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish]
19. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
20. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/editor/menus/context-menu.ts:29` `  if (!found) throw new Error(`contextMenu.open: the document has no node ${target}`);` — nó existente: o passo 10 segue; ausente: lança, e o `run` apanha em `src/core/store/store.ts:435` `    } catch (error) {`, respondendo `status.change.failed` sem abrir menu.
- R2 `src/editor/menus/context-menu.ts:31` `  if (state.selection.includes(target)) return { kind: 'change', ui };` — nó já selecionado: só a abertura muda; fora da seleção: o passo 12 faz dele a seleção e o nomeia.
- R3 `src/editor/menus/context-menu.ts:32` `  return { kind: 'change', ui, selection: [target], message: message('status.selected', { name: found.node.name }) };` — a seleção passa a ser só o nó e a barra o nomeia.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/menus/context-menu.ts:26` `export const contextMenuOpen = registerHandler<'contextMenu.open', EditorUi>('contextMenu.open', ({ state }, { target }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via dispatch, run, handlerContext, locate, commit), EST-L01-031 (a seleção, via dispatch, run, handlerContext, commit), EST-L01-037 (o estado do editor em `state.ui`, via dispatch, run, handlerContext, publish)
- escreve: EST-L01-037 (`ui.contextMenu.opened`, via run, publish), EST-L01-031 (`selection`, via run, commit, publish), EST-L01-033 (`message`, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 e EST-L01-031 — `ui.contextMenu.opened` ganha uma abertura nova e a seleção passa a ser o nó, quando ele não estava selecionado (`src/editor/menus/context-menu.ts:30` `  const ui: EditorUi = { ...state.ui, contextMenu: { opened: { count: (state.ui.contextMenu.opened?.count ?? 0) + 1, dismissals: state.ui.overlays.dismissals } } };`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:831` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o menu de contexto é desenhado no ponteiro (`src/editor/doors/menu.tsx:294` `  const opened = useEditorState((s) => openContextMenu(s.ui));`).
- **DOM do canvas:** o contorno e o rótulo seguem o nó que passou a ser a seleção (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `ui.contextMenu.opened` e a seleção, fora de qualquer camada de estilo (`src/editor/menus/context-menu.ts:30` `  const ui: EditorUi = { ...state.ui, contextMenu: { opened: { count: (state.ui.contextMenu.opened?.count ?? 0) + 1, dismissals: state.ui.overlays.dismissals } } };`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:364` `  'contextMenu.open': contextMenuOpen,` — as três portas convergem neste tratador (`src/editor/shell/sidebar/layers.tsx:272` `secondary.run();`).
- G4: n/a — o comando muda estado; o menu é do desenho do canvas, e o trecho não o cobre no ponto da ação (`src/editor/menus/context-menu.ts:32`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/menus/context-menu.ts:32`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda `ui.contextMenu.opened` e a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/menus/context-menu.ts:26`).

## Medições

- nenhuma
