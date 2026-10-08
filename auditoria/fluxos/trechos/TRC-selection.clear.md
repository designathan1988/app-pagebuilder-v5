# TRC-selection.clear

- **Chamada:** `src/app/commands.ts:354` `  'selection.clear': clearSelectionCommand,`
- **Argumentos:** o tratador não recebe argumento algum (`args` vazio em `manifest/commands/selection.json:202` `      "args": {},`); as quatro portas (key-escape-in-canvas, canvas-click-stage-outside-page, menu-edit, command-bar) enviam só a intenção.
- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (`hasSelection`).

## Passos

1. `src/app/commands.ts:354` `  'selection.clear': clearSelectionCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — cada porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-031 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade de `selection.clear` é `hasSelection`. [lê: EST-L01-030 via run]
5. `src/core/selection/selection.ts:12` `export const hasSelection = registerPredicate('hasSelection', (state) => state.selection.length > 0);` — R1: exige algo selecionado.
6. `src/core/store/store.ts:416` `    if (predicate && !predicate.test(state, layeredNow(at), args)) {` — R1: sem seleção o predicado falha.
7. `src/core/store/store.ts:419` `      publish(commit({ ...state, message: refusal, refused: true }, id));` — R1: a recusa é publicada e nada muda.
8. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
9. `src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));` — R2: o `Outcome` com a seleção vazia. [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
10. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
11. `src/core/store/store.ts:537` `      selection,` — a seleção vazia do `Outcome` entra no estado. [escreve: EST-L01-031 via run]
12. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — [escreve: EST-L01-033 via run]
13. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
14. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
15. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
16. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:12` `export const hasSelection = registerPredicate('hasSelection', (state) => state.selection.length > 0);` — com algo selecionado o passo 6 segue para o passo 8; sem nada, o `run` publica a recusa (`src/core/store/store.ts:417` `      const declared = message((command.availability.refusalKey ?? 'common.notAvailableYet') as Message['key']);`, "Selecione um elemento primeiro.") e nada muda.
- R2 `src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));` — a seleção passa a vazia e a barra diz "Nada selecionado.".

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`, sem `await`).

## Estado

- lê: EST-L01-031 (a seleção, via hasSelection, dispatch)
- escreve: EST-L01-031 (a seleção vazia, via run, publish), EST-L01-033 (a mensagem, via run, publish)

## Resultado

- **Estado final:** EST-L01-031 — a seleção fica vazia e EST-L01-033 com a mensagem `status.selection.cleared` (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:210` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nenhuma linha de Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** o contorno e o rótulo da seleção somem (`src/editor/canvas/chrome.tsx:698` `    if (selection.length === 0 && hovered === null && drawnBand === null) {`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:354` `  'selection.clear': clearSelectionCommand,` — as quatro portas convergem neste tratador.
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:38`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:38`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:38`).

## Medições

- nenhuma
