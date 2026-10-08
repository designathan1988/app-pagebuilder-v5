# TRC-layers.cancelRename

- **Chamada:** `src/app/commands.ts:335` `'layers.cancelRename': cancelRename,`
- **Argumentos:** o tratador recebe `HandlerContext<EditorUi>` e o manifesto não declara argumentos (`manifest/commands/nodes.json:161` `"args": {},`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumento; o único ramo (R1) depende do estado `ui.rename`.

## Passos

1. `src/app/commands.ts:335` `'layers.cancelRename': cancelRename,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de outro campo é gravada antes.
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
4. `src/editor/layers/rename.ts:36` `export const cancelRename = registerHandler<'layers.cancelRename', EditorUi>('layers.cancelRename', ({ state }) => ({ kind: 'change', ui: ended(state.ui) }));` — o tratador devolve `change` com a interface que `ended` calcula.
5. `src/editor/layers/rename.ts:32` `const ended = (ui: EditorUi): EditorUi => (ui.rename.node === null ? ui : { ...ui, rename: INITIAL_RENAME });` — R1: com nó em renomear, `ui.rename` volta ao inicial; [lê: EST-L01-037 via ended].
6. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor passa a levar o rename encerrado.
7. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
8. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
9. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
10. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/editor/layers/rename.ts:32` `ui.rename.node === null` — sem renomear em curso: `ui` é devolvido igual (nada muda); com um nó em renomear: `ui` passa a levar `rename` inicial e o campo fecha.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/layers/rename.ts:36` `export const cancelRename = registerHandler<'layers.cancelRename', EditorUi>('layers.cancelRename', ({ state }) => ({ kind: 'change', ui: ended(state.ui) }));`, sem `await`).

## Estado

- lê: EST-L01-037 (o estado do editor, `ui.rename`), EST-L05a-001 (a digitação pendente, via `beforeCommand`).
- escreve: EST-L01-037 (`ui.rename`).

## Resultado

- **Estado final:** EST-L01-037 — `ui.rename.node` volta a `null` quando havia renomear (`src/editor/layers/rename.ts:32`); o documento não muda (o comando não é undoable: `manifest/commands/nodes.json:169` `"undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha volta a desenhar o nome no lugar do campo (`src/editor/shell/sidebar/layers.tsx:307` `{renaming ? (`).
- **DOM do canvas:** nada muda — o rótulo segue com o mesmo nome (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras

- G1: n/a — o comando escreve `ui.rename`, fora de qualquer camada de estilo (`src/editor/layers/rename.ts:32`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`); o Esc do próprio campo é a exceção da especificação.
- G3: ok `src/editor/layers/rename.ts:36` — o único tratador do comando; a porta de Esc entrega só a intenção (sem argumento).
- G4: n/a — o comando encerra um campo no painel Camadas; nada do editor é desenhado sobre o canvas (`src/editor/layers/rename.ts:36`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/layers/rename.ts:36`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda só `ui.rename`; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/layers/rename.ts:36`).

## Medições

- nenhuma
