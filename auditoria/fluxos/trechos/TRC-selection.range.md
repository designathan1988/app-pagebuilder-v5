# TRC-selection.range

- **Chamada:** `src/app/commands.ts:356` `  'selection.range': rangeCommand,`
- **Argumentos:** o tratador recebe `HandlerContext<never>` e os argumentos `{ target }`, com o campo `target` (args.target, tipo `node`, `refers: node`); a única porta (layers-row-shift) envia o id do nó e `manifest/commands/selection.json:365` `        "undoable": false`.
- **Ramos que dependem dos argumentos:** R1 (`target` que o documento não tem faz lançar); R2 (`target` sem nada selecionado fica sozinho); R3 (`target` e o último selecionado de pais diferentes junta só o clicado); R4 (mesmo pai: a corrida entre os dois índices).

## Passos

1. `src/app/commands.ts:356` `  'selection.range': rangeCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — a porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via dispatch] [lê: EST-L01-031 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade de `selection.range` é `always`. [lê: EST-L01-030 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/selection/selection.ts:156` `export const rangeCommand = registerHandler('selection.range', ({ state }, { target }) => {` — o tratador ligado à store do editor.
8. `src/core/selection/selection.ts:157` `  known(state, target);` — R1: o nó do argumento tem de existir. [lê: EST-L01-030 via known]
9. `src/core/selection/selection.ts:149` `  if (!locate(state.document, target)) throw new Error(`adding to the selection: the document has no node ${target}`);` — R1.
10. `src/core/selection/selection.ts:158` `  const anchorId = state.selection.at(-1);` — o último selecionado é a âncora. [lê: EST-L01-031 via handlerContext]
11. `src/core/selection/selection.ts:159` `  if (anchorId === undefined) return several(state, [target]);` — R2: sem nada selecionado o clicado fica sozinho.
12. `src/core/selection/selection.ts:160` `  const anchor = locate(state.document, anchorId);` — [lê: EST-L01-030 via locate]
13. `src/core/selection/selection.ts:161` `  const clicked = locate(state.document, target);` — [lê: EST-L01-030 via locate]
14. `src/core/selection/selection.ts:162` `  if (anchor === null || clicked === null || clicked.parent === null || anchor.parent?.id !== clicked.parent.id) {` — R3: pais diferentes.
15. `src/core/selection/selection.ts:163` `    return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);` — R3: só o clicado entra.
16. `src/core/selection/selection.ts:165` `  const [from, to] = anchor.index <= clicked.index ? [anchor.index, clicked.index] : [clicked.index, anchor.index];` — R4: a corrida dos irmãos.
17. `src/core/selection/selection.ts:166` `  const run = clicked.parent.children.slice(from, to + 1).map((node) => node.id);` — os irmãos entre eles.
18. `src/core/selection/selection.ts:167` `  const ordered = anchor.index <= clicked.index ? run : [...run].reverse();` — R4: para cima a ordem se inverte.
19. `src/core/selection/selection.ts:168` `  return several(state, [...state.selection.filter((id) => !ordered.includes(id)), ...ordered]);` — [escreve: EST-L01-031 via several] [escreve: EST-L01-033 via several]
20. `src/core/selection/selection.ts:144` `  return { kind: 'change', selection, message: said };` — o `Outcome`. [escreve: EST-L01-031 via several] [escreve: EST-L01-033 via several]
21. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
22. `src/core/store/store.ts:537` `      selection,` — [escreve: EST-L01-031 via run]
23. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — [escreve: EST-L01-033 via run]
24. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
25. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
26. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
27. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:149` `  if (!locate(state.document, target)) throw new Error(`adding to the selection: the document has no node ${target}`);` — nó existente: segue para o passo 10; ausente: lança, e o `run` apanha em `src/core/store/store.ts:435` `    } catch (error) {`.
- R2 `src/core/selection/selection.ts:159` `  if (anchorId === undefined) return several(state, [target]);` — nada selecionado: só o clicado; com âncora: segue para o passo 12.
- R3 `src/core/selection/selection.ts:162` `  if (anchor === null || clicked === null || clicked.parent === null || anchor.parent?.id !== clicked.parent.id) {` — pais diferentes (ou rede de segurança sem nó): só o clicado entra no passo 15; mesmo pai: segue para o passo 16.
- R4 `src/core/selection/selection.ts:167` `  const ordered = anchor.index <= clicked.index ? run : [...run].reverse();` — descendo, a corrida segue a ordem; subindo, ela se inverte (`manifest/features/02-structure-editing.json:14697` `"id": "shift-click-upwards-selects-the-rows-between-in-that-order",`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:156` `export const rangeCommand = registerHandler('selection.range', ({ state }, { target }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via locate, known, dispatch), EST-L01-031 (a seleção, via handlerContext, dispatch)
- escreve: EST-L01-031 (a seleção, via several, run, publish), EST-L01-033 (a mensagem, via several, run, publish)

## Resultado

- **Estado final:** EST-L01-031 — a corrida dos irmãos entre a âncora e o clicado entra na seleção na ordem certa (`src/core/selection/selection.ts:167` `  const ordered = anchor.index <= clicked.index ? run : [...run].reverse();`); o documento não muda (`manifest/commands/selection.json:365` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas da corrida em Camadas ficam realçadas (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada irmão da corrida ganha o próprio contorno (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:168` `  return several(state, [...state.selection.filter((id) => !ordered.includes(id)), ...ordered]);`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:356` `  'selection.range': rangeCommand,` — a porta entrega só o nó do alvo (`src/editor/shell/sidebar/layers.tsx:262` `if (entry) (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, target: node.id });`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:168`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:168`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:156`).

## Medições

- nenhuma
