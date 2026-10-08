# TRC-workspace.setWorkbenchState
- **Chamada:** `src/app/commands.ts:483` `'workspace.setWorkbenchState': setWorkbenchState,`
- **Argumentos:** `{ state }` — um enum `collapsed`/`open`/`max`/`toggle`/`toggle-max` (o pedido que vira o estado do dock).
- **Ramos que dependem dos argumentos:** R1 (`state` `toggle`), R2 (`state` `toggle-max`), R3 (`state` fixo).

## Passos
1. `src/app/commands.ts:483` `'workspace.setWorkbenchState': setWorkbenchState,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/layout.ts:151` `ui: withDock(state.ui, nextDock(state.ui.layout.dock, args.state)),` — o estado pedido vira o estado do dock [lê: EST-L01-037 via nextDock] [escreve: EST-L01-037 via withDock].
7. `src/editor/workspace/layout.ts:96` `export function withDock(ui: EditorUi, dock: DockState): EditorUi {` — o dock é escrito só quando muda.
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/workspace/layout.ts:91` `if (request === 'toggle') return current === 'collapsed' ? 'open' : 'collapsed';` — `toggle`: abre quando recolhido, recolhe quando aberto ou maximizado.
- R2 `src/editor/workspace/layout.ts:92` `if (request === 'toggle-max') return current === 'max' ? 'open' : 'max';` — `toggle-max`: maximiza quando aberto, volta a aberto quando maximizado.
- R3 `src/editor/workspace/layout.ts:93` `return request;` — `collapsed`, `open` ou `max`: o dock toma exatamente o valor pedido.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/layout.ts:147` `export const setWorkbenchState = registerHandler<'workspace.setWorkbenchState', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.layout.dock`, via handlerContext, nextDock, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.layout.dock`, via withDock, run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.layout.dock` no estado derivado de `state` (`src/editor/workspace/layout.ts:151`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o dock mostra-se, recolhe-se ou maximiza-se (`src/editor/workspace/layout.ts:96` `export function withDock(ui: EditorUi, dock: DockState): EditorUi {`); maximizado, ele cobre a área do canvas, o que é medido na Fase 6.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:151`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:147` `export const setWorkbenchState = registerHandler<'workspace.setWorkbenchState', EditorUi>(` — as duas portas (botão de ligar, botão de maximizar) chegam ao mesmo tratador, uma com `state` `toggle` e a outra `toggle-max`.
- G4: n/a — o comando muda estado; o dock maximizado cobre a área do canvas e esse cobrimento é medido na Fase 6 (`src/editor/workspace/layout.ts:96`).
- G5: n/a — o encaixe do dock maximizado é medido na Fase 6 (`src/editor/workspace/layout.ts:96`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:151`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/layout.ts:151`).

## Medições
- a medir na Fase 6: quanto o dock maximizado cobre da área do canvas e se nada fica fora da janela (famílias `covered`, `off-window`), nas duas telas.
