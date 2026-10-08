# TRC-selection.select

- **Chamada:** `src/app/commands.ts:353` `  'selection.select': selectCommand,`
- **Argumentos:** o tratador recebe `HandlerContext<never>` e os argumentos `{ target }`, com o campo `target` (args.target, tipo `node`, `refers: node`); as sete portas (canvas-click-element-or-page, layers-row, key-enter-in-layers-tree, status-bar-breadcrumb-item, checks-issue, code-panel-html-line, command-bar-select-layer) enviam o id do nó.
- **Ramos que dependem dos argumentos:** R1 (`target` que o documento não tem faz o tratador lançar); o passo que nomeia o nó lido depende do valor de `target`.

## Passos

1. `src/app/commands.ts:353` `  'selection.select': selectCommand,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/core/store/store.ts:685` `    dispatch: (id, args, context) => {` — cada porta entrega a intenção pela `dispatch` da store.
3. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via dispatch]
4. `src/core/store/store.ts:415` `    const predicate = predicates[command.availability.predicate as keyof PredicateTable<Ui>];` — a disponibilidade de `selection.select` é `always`. [lê: EST-L01-030 via run]
5. `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` — o predicado `always` devolve verdadeiro sem ler estado.
6. `src/core/store/store.ts:434` `      outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/selection/selection.ts:31` `export const selectCommand = registerHandler('selection.select', ({ state }, { target }) => {` — o tratador ligado à store do editor.
8. `src/core/selection/selection.ts:32` `  const found = locate(state.document, target);` — [lê: EST-L01-030 via locate]
9. `src/core/document/model.ts:290` `export function locate(doc: DocumentJson, id: NodeId): Location | null {` — procura o nó e o seu lugar no documento.
10. `src/core/selection/selection.ts:33` `  if (!found) throw new Error(`selection.select: the document has no node ${target}`);` — R1.
11. `src/core/selection/selection.ts:34` `  return { kind: 'change', selection: [target], message: message('status.selected', { name: found.node.name }) };` — o `Outcome` com o nó sozinho e o aviso. [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
12. `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — [lê: EST-L01-031 via run]
13. `src/core/store/store.ts:537` `      selection,` — a seleção do `Outcome` entra no estado. [escreve: EST-L01-031 via run]
14. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — [escreve: EST-L01-033 via run]
15. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
16. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
17. `src/core/store/store.ts:320` `    state = next;` — [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish]
18. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-031 via publish]

## Ramos

- R1 `src/core/selection/selection.ts:33` `  if (!found) throw new Error(`selection.select: the document has no node ${target}`);` — nó que o documento tem: o passo 11 devolve a seleção; nó ausente: lança, e o `run` apanha em `src/core/store/store.ts:435` `    } catch (error) {`, respondendo `status.change.failed` sem mudar a seleção.
- R2 `src/core/selection/selection.ts:32` `  const found = locate(state.document, target);` — com página para o argumento o lugar é achado; o passo 11 lê `found.node.name` para a mensagem.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/selection/selection.ts:31` `export const selectCommand = registerHandler('selection.select', ({ state }, { target }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento em `state.document`, via locate, run, dispatch), EST-L01-031 (a seleção em `state.selection`, via run)
- escreve: EST-L01-031 (`selection`, via run, publish), EST-L01-033 (`message`, via run, publish)

## Resultado

- **Estado final:** EST-L01-031 — a seleção passa a ser só o alvo e EST-L01-033 nomeia o nó (`src/core/selection/selection.ts:34` `  return { kind: 'change', selection: [target], message: message('status.selected', { name: found.node.name }) };`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:23` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha do nó selecionado em Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** o contorno e o rótulo seguem a seleção e o rótulo nomeia o nó (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras

- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:34` `  return { kind: 'change', selection: [target], message: message('status.selected', { name: found.node.name }) };`).
- G2: ok `src/editor/input/pending.ts:82` `  keepTyping();` — a digitação pendente é gravada antes (`src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);`).
- G3: ok `src/app/commands.ts:353` `  'selection.select': selectCommand,` — as sete portas convergem neste tratador.
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:34`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:34`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/selection/selection.ts:31`).

## Medições

- nenhuma
