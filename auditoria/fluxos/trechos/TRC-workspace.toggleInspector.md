# TRC-workspace.toggleInspector
- **Chamada:** `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/panels.ts:112` `const open = !inspectorOpen(state.ui);` — o inspector é aberto quando fechado e fechado quando aberto [lê: EST-L01-037 via inspectorOpen].
7. `src/editor/workspace/panels.ts:106` `export const withInspector = (ui: EditorUi, open: boolean): EditorUi => panelsAt('inspector').reduce((next, panel) => withPanel(next, panel, open), ui);` — cada painel do lugar `inspector` é mostrado ou escondido [escreve: EST-L01-037 via withInspector].
8. `src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };` — o resultado é uma mudança.
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- nenhum — o tratador não tem condição além da leitura que decide: abre quando `inspectorOpen` é falso, fecha quando é verdadeiro `src/editor/workspace/panels.ts:112` `const open = !inspectorOpen(state.ui);`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/panels.ts:109` `export const toggleInspector = registerHandler<'workspace.toggleInspector', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.panels`, via handlerContext, inspectorOpen, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.panels`, via withInspector, run, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com os painéis do lugar `inspector` abertos ou fechados (`src/editor/workspace/panels.ts:113`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a coluna do inspector aparece ou some (`src/editor/workspace/panels.ts:106`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:113`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:109` `export const toggleInspector = registerHandler<'workspace.toggleInspector', EditorUi>(` — as três portas (Ctrl+Alt+B global, Ctrl+Alt+B no campo, menu View) chegam ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:113`); o cobrimento em janela estreita é medido na Fase 6.
- G5: n/a — o encaixe da coluna do inspector é medido na Fase 6 (`src/editor/workspace/panels.ts:113`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:113`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/panels.ts:112`).

## Medições
- a medir na Fase 6: o encaixe da coluna do inspector, com nomes longos, nas duas telas (famílias `cut`, `wrapped`, `off-window`, `covered`).
