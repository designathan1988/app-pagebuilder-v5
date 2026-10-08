# TRC-selection.walkNextSibling

- **Chamada:** `src/app/commands.ts:358` `  'selection.walkNextSibling': walkNextSiblingCommand,`
- **Argumentos:** o tratador não recebe argumento algum (`args` vazio em `manifest/commands/selection.json:473` `      "args": {},`); a única porta (key-arrow-right-in-canvas) envia só a intenção.
- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (nada selecionado, último filho, raiz).

## Passos

1. `src/app/commands.ts:358` `  'selection.walkNextSibling': walkNextSiblingCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — a porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-031 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade é `always`. [lê: EST-L01-031 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/selection/selection.ts:208` `export const walkNextSiblingCommand = registerHandler('selection.walkNextSibling', ({ state }) => {` — o tratador ligado à store do editor.
8. `src/core/selection/selection.ts:209` `  const at = walkFrom(state);` — [lê: EST-L01-031 via walkFrom] [lê: EST-L01-030 via walkFrom]
9. `src/core/selection/selection.ts:192` `  const primary = state.selection[0];` — o nó primário. [lê: EST-L01-031 via walkFrom]
10. `src/core/selection/selection.ts:193` `  if (primary === undefined) return null;` — R1: sem nada selecionado, `walkFrom` devolve nulo.
11. `src/core/selection/selection.ts:194` `  const found = locate(state.document, primary);` — [lê: EST-L01-030 via locate]
12. `src/core/selection/selection.ts:197` `  return found;` — o lugar do nó primário.
13. `src/core/selection/selection.ts:210` `  if (at === null) return start(state);` — R1: a caminhada começa pela raiz da página aberta.
14. `src/core/selection/selection.ts:202` `  const root = pageShown(state)?.tree;` — [lê: EST-L01-030 via pageShown]
15. `src/core/selection/selection.ts:204` `  return reach(root);` — R1: a raiz fica sozinha na seleção.
16. `src/core/selection/selection.ts:211` `  const next = at.parent?.children[at.index + 1];` — o irmão seguinte. [lê: EST-L01-030 via walkFrom]
17. `src/core/selection/selection.ts:212` `  if (next) return reach(next);` — R2.
18. `src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });` — o `Outcome` do passo que alcança um nó. [escreve: EST-L01-031 via reach] [escreve: EST-L01-033 via reach]
19. `src/core/selection/selection.ts:213` `  return { kind: 'refused', message: message('status.walk.noNext', { parent: at.parent?.name ?? state.document.pages[at.page]?.name ?? '' }) };` — R3: recusa no último filho e na raiz.
20. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [escreve: EST-L01-031 via run]
21. `src/core/store/store.ts:537` `      selection,` — [escreve: EST-L01-031 via run]
22. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
23. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
24. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
25. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:210` `  if (at === null) return start(state);` — nada selecionado: a caminhada começa pela raiz da página aberta (`src/core/selection/selection.ts:202` `  const root = pageShown(state)?.tree;`); com primário: segue para o passo 16 (`manifest/features/02-structure-editing.json:11973` `"id": "an-arrow-with-nothing-selected-starts-at-the-page",`).
- R2 `src/core/selection/selection.ts:212` `  if (next) return reach(next);` — há irmão seguinte: ele fica sozinho na seleção; não há: segue para o passo 19.
- R3 `src/core/selection/selection.ts:213` `  return { kind: 'refused', message: message('status.walk.noNext', { parent: at.parent?.name ?? state.document.pages[at.page]?.name ?? '' }) };` — último filho ou raiz: a porta é recusada com `status.walk.noNext` e a seleção fica como está.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:208` `export const walkNextSiblingCommand = registerHandler('selection.walkNextSibling', ({ state }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via walkFrom, locate, pageShown), EST-L01-031 (a seleção, via walkFrom)
- escreve: EST-L01-031 (a seleção, via run, reach), EST-L01-033 (a mensagem, via reach, publish)

## Resultado

- **Estado final:** EST-L01-031 — o irmão seguinte fica sozinho na seleção e a barra o nomeia (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:483` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha do nó alcançado em Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** o contorno e o rótulo seguem o nó alcançado (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:358` `  'selection.walkNextSibling': walkNextSiblingCommand,` — a porta envia só a intenção (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:199`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:199`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:208`).

## Medições

- nenhuma
