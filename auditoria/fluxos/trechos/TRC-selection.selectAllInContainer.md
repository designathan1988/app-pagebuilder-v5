# TRC-selection.selectAllInContainer

- **Chamada:** `src/app/commands.ts:362` `  'selection.selectAllInContainer': selectAllInContainerCommand,`
- **Argumentos:** o tratador não recebe argumento algum (`args` vazio em `manifest/commands/selection.json:633` `      "args": {},`); as quatro portas (key-ctrl-a-in-canvas, key-ctrl-a-in-global, menu-edit, command-bar) enviam só a intenção.
- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (nada selecionado, sem contêiner, filhos ocultos ou bloqueados).

## Passos

1. `src/app/commands.ts:362` `  'selection.selectAllInContainer': selectAllInContainerCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — cada porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via dispatch] [lê: EST-L01-031 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade é `always`. [lê: EST-L01-030 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/selection/selection.ts:44` `export const selectAllInContainerCommand = registerHandler('selection.selectAllInContainer', ({ state }): Outcome<never> => {` — o tratador ligado à store do editor.
8. `src/core/selection/selection.ts:45` `  const [primary] = state.selection;` — [lê: EST-L01-031 via handlerContext]
9. `src/core/selection/selection.ts:46` `  const at = primary === undefined ? null : locate(state.document, primary);` — [lê: EST-L01-030 via locate]
10. `src/core/selection/selection.ts:47` `  const container = at?.parent ?? at?.node ?? pageShown(state)?.tree ?? null;` — R1/R2: o contêiner é o pai do primário, ou o próprio primário (raiz), ou a raiz da página aberta. [lê: EST-L01-030 via pageShown] [lê: EST-L01-037 via pageShown]
11. `src/core/selection/selection.ts:48` `  if (container === null) return { kind: 'change' };` — R1: sem contêiner, nada muda.
12. `src/core/selection/selection.ts:49` `  const taken = container.children.filter((child) => child.hidden !== true && lockOver(state.document, child.id) === null);` — R2: ocultos e bloqueados ficam de fora. [lê: EST-L01-030 via lockOver]
13. `src/core/selection/selection.ts:50` `  const skipped = container.children.length - taken.length;` — o que ficou de fora.
14. `src/core/selection/selection.ts:53` `    selection: taken.map((child) => child.id),` — os tomados, na ordem, viram a seleção. [escreve: EST-L01-031 via run]
15. `src/core/selection/selection.ts:54` `    message: skipped > 0 ? message('status.selection.skipped', { count: taken.length, skipped }) : message('status.selection.count', { count: taken.length }),` — R3: a barra conta o que ficou de fora, ou só conta os tomados.
16. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
17. `src/core/store/store.ts:537` `      selection,` — [escreve: EST-L01-031 via run]
18. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — [escreve: EST-L01-033 via run]
19. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
20. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
21. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
22. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:48` `  if (container === null) return { kind: 'change' };` — sem contêiner (nenhum nó lido e nenhuma página aberta): o passo 11 devolve um `change` sem seleção nem mensagem; com contêiner: segue para o passo 12.
- R2 `src/core/selection/selection.ts:47` `  const container = at?.parent ?? at?.node ?? pageShown(state)?.tree ?? null;` — nada selecionado usa a raiz da página aberta; a raiz da página selecionada usa o próprio nó (os filhos da página), como no cenário `ctrl-a-with-nothing-selected-selects-the-page-children` (`manifest/features/02-structure-editing.json:16821` `"id": "ctrl-a-with-nothing-selected-selects-the-page-children",`).
- R3 `src/core/selection/selection.ts:49` `  const taken = container.children.filter((child) => child.hidden !== true && lockOver(state.document, child.id) === null);` — filho oculto, bloqueado ou dentro de um bloqueado fica de fora; o passo 15 diz quantos ficaram quando há algum.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:44` `export const selectAllInContainerCommand = registerHandler('selection.selectAllInContainer', ({ state }): Outcome<never> => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via locate, pageShown, lockOver, run, dispatch), EST-L01-031 (a seleção, via handlerContext, run, dispatch), EST-L01-037 (a página aberta, via pageShown)
- escreve: EST-L01-031 (`selection`, via run, publish), EST-L01-033 (`message`, via run, publish)

## Resultado

- **Estado final:** EST-L01-031 — a seleção passa a ser os filhos do contêiner tomados, na ordem (`src/core/selection/selection.ts:53` `    selection: taken.map((child) => child.id),`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:641` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas tomadas em Camadas ficam realçadas (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada nó tomado ganha o próprio contorno (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:53` `    selection: taken.map((child) => child.id),`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:362` `  'selection.selectAllInContainer': selectAllInContainerCommand,` — as quatro portas convergem neste tratador (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:53`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:53`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:44`).

## Medições

- nenhuma
