# TRC-selection.add

- **Chamada:** `src/app/commands.ts:355` `  'selection.add': addCommand,`
- **Argumentos:** o tratador recebe `HandlerContext<never>` e os argumentos `{ target }`, com o campo `target` (args.target, tipo `node`, `refers: node`); a única porta (canvas-click-element-shift) envia o id do nó.
- **Ramos que dependem dos argumentos:** R1 (`target` que o documento não tem faz o tratador lançar); R2 (`target` já na seleção não a muda); R3 (`target` fora da seleção a estende).

## Passos

1. `src/app/commands.ts:355` `  'selection.add': addCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — a porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via dispatch] [lê: EST-L01-031 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade de `selection.add` é `always`. [lê: EST-L01-030 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/selection/selection.ts:173` `export const addCommand = registerHandler('selection.add', ({ state }, { target }) => {` — o tratador ligado à store do editor.
8. `src/core/selection/selection.ts:174` `  known(state, target);` — [lê: EST-L01-030 via known]
9. `src/core/selection/selection.ts:149` `  if (!locate(state.document, target)) throw new Error(`adding to the selection: the document has no node ${target}`);` — R1.
10. `src/core/selection/selection.ts:175` `  return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);` — R2/R3: escolhe a seleção inalterada ou estendida. [lê: EST-L01-031 via several]
11. `src/core/selection/selection.ts:140` `function several(state: StoreState<never>, selection: StoreState<never>['selection']): Outcome<never> {` — compõe a mensagem da barra.
12. `src/core/selection/selection.ts:143` `    selection.length === 0 ? message('status.selection.cleared') : only !== null ? message('status.selected', { name: only.node.name }) : message('status.selection.count', { count: selection.length });` — um nó nomeia, vários contam.
13. `src/core/selection/selection.ts:144` `  return { kind: 'change', selection, message: said };` — o `Outcome`. [escreve: EST-L01-031 via several] [escreve: EST-L01-033 via several]
14. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
15. `src/core/store/store.ts:537` `      selection,` — [escreve: EST-L01-031 via run]
16. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — [escreve: EST-L01-033 via run]
17. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
18. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
19. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
20. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:149` `  if (!locate(state.document, target)) throw new Error(`adding to the selection: the document has no node ${target}`);` — nó que o documento tem: o passo 10 segue; nó ausente: lança, e o `run` apanha em `src/core/store/store.ts:435` `    } catch (error) {`.
- R2 `src/core/selection/selection.ts:175` `  return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);` — nó já selecionado: a seleção fica como está; nó fora dela: entra no fim.
- R3 `src/core/selection/selection.ts:143` `    selection.length === 0 ? message('status.selection.cleared') : only !== null ? message('status.selected', { name: only.node.name }) : message('status.selection.count', { count: selection.length });` — um só selecionado: a barra o nomeia; vários: conta-os (`manifest/features/02-structure-editing.json:14398` `"id": "shift-click-adds-to-the-selection",`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:173` `export const addCommand = registerHandler('selection.add', ({ state }, { target }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via known, dispatch), EST-L01-031 (a seleção, via several, run, publish, dispatch)
- escreve: EST-L01-031 (a seleção, via run, publish), EST-L01-033 (a mensagem, via run, publish)

## Resultado

- **Estado final:** EST-L01-031 — o nó entra na seleção depois dos que já estavam, ou fica onde estava (`src/core/selection/selection.ts:175` `  return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:319` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** cada linha selecionada em Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada elemento selecionado tem o próprio contorno (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:175` `  return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:355` `  'selection.add': addCommand,` — a porta entrega só o nó do alvo (`src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:175`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:175`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:173`).

## Medições

- nenhuma
