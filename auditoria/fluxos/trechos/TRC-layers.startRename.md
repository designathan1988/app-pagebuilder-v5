# TRC-layers.startRename

- **Chamada:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Argumentos:** o tratador recebe `HandlerContext<EditorUi>` e o manifesto não declara argumentos (`manifest/commands/nodes.json:9` `"args": {},`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumento; os ramos (R1 a R5) dependem do estado: a seleção, o nó que ela nomeia e o bloqueio.

## Passos

1. `src/app/commands.ts:334` `'layers.startRename': startRename,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente de outro campo é gravada antes.
3. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `singleSelection` é lida antes do tratador (`src/core/selection/selection.ts:23` `export const singleSelection = registerPredicate('singleSelection', (state) => state.selection.length === 1);`) [lê: EST-L01-031 via run].
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
5. `src/editor/layers/rename.ts:38` `export const startRename = registerHandler<'layers.startRename', EditorUi>('layers.startRename', ({ state }) => {` — o tratador.
6. `src/editor/layers/rename.ts:39` `const [only, ...others] = state.selection;` — [lê: EST-L01-031 via handlerContext]
7. `src/editor/layers/rename.ts:41` `if (only === undefined || others.length > 0) return { kind: 'refused', message: message('status.needsSingleSelection') };` — R1.
8. `src/editor/layers/rename.ts:42` `const found = locate(state.document, only);` — [lê: EST-L01-030 via locate]
9. `src/editor/layers/rename.ts:45` `if (found === null) throw new Error(` — R2, uma porta deu um nó que o documento não tem.
10. `src/editor/layers/rename.ts:46` `if (found.parent === null) return { kind: 'refused', message: message('status.rename.root') };` — R3.
11. `src/editor/layers/rename.ts:47` `const locked = lockRefusal(state.document, only, 'status.locked.rename');` — [lê: EST-L01-030 via lockRefusal]
12. `src/editor/layers/rename.ts:48` `if (locked !== null) return { kind: 'refused', message: locked };` — R4.
13. `src/editor/layers/rename.ts:50` `const shown = revealSelection({ ...state, ui: showPanel(state.ui, 'layers') });` — Camadas é mostrada (`src/editor/workspace/panels.ts:75` `export const showPanel = (ui: EditorUi, panel: Panel): EditorUi => (isPanelOpen(ui, panel) ? ui : withPanel(ui, panel, true));`) e os ramos que escondem a linha de camadas se abrem (`src/editor/layers/tree.ts:159` `export function revealSelection(state: StoreState<EditorUi>): EditorUi {`).
14. `src/editor/layers/rename.ts:51` `return { kind: 'change', ui: { ...shown, rename: { node: only } } };` — o Outcome, `ui.rename.node` passa a nomear o nó.
15. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — as recusas de R1, R3 e R4 seguem por aqui.
16. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] a recusa é publicada e nada mais muda.
17. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — [escreve: EST-L01-037 via run] o estado do editor passa a levar o rename.
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
20. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
21. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/editor/layers/rename.ts:41` `if (only === undefined || others.length > 0)` — nada ou vários selecionados: `refused` com `status.needsSingleSelection`; um só: segue.
- R2 `src/editor/layers/rename.ts:45` `if (found === null)` — o nó não está no documento: lança (defeito da porta); está: segue.
- R3 `src/editor/layers/rename.ts:46` `if (found.parent === null)` — a raiz da página: `refused` com `status.rename.root`; outro nó: segue.
- R4 `src/editor/layers/rename.ts:48` `if (locked !== null)` — o nó ou um ancestral carrega o bloqueio: `refused` com a mensagem do bloqueio (`lockRefusal`); livre: segue.
- R5 `src/editor/layers/rename.ts:50` `const shown = revealSelection({ ...state, ui: showPanel(state.ui, 'layers') });` — Camadas fechada: a interface passa a mostrá-la; a linha sob um ramo fechado: os ramos que a escondem se abrem (`revealSelection`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/editor/layers/rename.ts:38` `export const startRename = registerHandler<'layers.startRename', EditorUi>('layers.startRename', ({ state }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento), EST-L01-031 (a seleção), EST-L01-037 (o estado do editor), EST-L05a-001 (a digitação pendente, via `beforeCommand`).
- escreve: EST-L01-037 (`ui.panels`, `ui.layers.collapsed` e `ui.rename`).

## Resultado

- **Estado final:** EST-L01-037 — `ui.rename.node` nomeia o nó e Camadas fica mostrada (`src/editor/layers/rename.ts:51`); o documento não muda (o comando não é undoable: `manifest/commands/nodes.json:21` `"undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha do nó passa a desenhar o campo de nome (`src/editor/shell/sidebar/layers.tsx:236` `const renaming = useEditorState((s) => renamedNode(s.ui) === node.id);`).
- **DOM do canvas:** nada muda — o rótulo segue com o mesmo nome (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras

- G1: n/a — o comando escreve `ui.rename`, fora de qualquer camada de estilo (`src/editor/layers/rename.ts:51`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/layers/rename.ts:38` — o único tratador do comando; toda porta entrega só a intenção (sem argumento).
- G4: n/a — o campo é desenhado no painel Camadas, que ocupa a própria coluna; nada do editor é desenhado sobre o canvas (`src/editor/layers/rename.ts:50`).
- G5: n/a — o comando não desenha painel nem controle além do que `showPanel` abre (`src/editor/layers/rename.ts:50`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda só `ui.rename`; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/layers/rename.ts:38`).

## Medições

- nenhuma
