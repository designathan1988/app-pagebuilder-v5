# TRC-workspace.toggleDeveloperTools
- **Chamada:** `src/app/commands.ts:481` `'workspace.toggleDeveloperTools': toggleDeveloperTools,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:481` `'workspace.toggleDeveloperTools': toggleDeveloperTools,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/panels.ts:128` `const on = state.ui.preferences.developerTools !== true;` — a preferência é invertida [lê: EST-L01-037 via handlerContext].
7. `src/editor/workspace/panels.ts:129` `const preferences = { ...state.ui.preferences, developerTools: on ? (true as const) : undefined };` — a preferência nova [escreve: EST-L01-037 via run].
8. `src/editor/workspace/panels.ts:130` `return { kind: 'change', ui: withPanel({ ...state.ui, preferences }, DOCUMENT_TAB, on), message: panelMessage(DOCUMENT_TAB, on) };` — mostra ou esconde a aba Documento [escreve: EST-L01-037 via withPanel].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- nenhum — o tratador liga a preferência quando está desligada e a apaga quando está ligada, sem outra decisão `src/editor/workspace/panels.ts:128` `const on = state.ui.preferences.developerTools !== true;`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/panels.ts:125` `export const toggleDeveloperTools = registerHandler<'workspace.toggleDeveloperTools', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.preferences.developerTools`, via handlerContext, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.preferences`, `ui.panels`, via run, withPanel, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.developerTools` ligado ou ausente e a aba Documento do dock mostrada ou escondida (`src/editor/workspace/panels.ts:130`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a aba Documento aparece ou some na faixa do dock (`src/editor/workspace/panels.ts:130`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:130`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:125` `export const toggleDeveloperTools = registerHandler<'workspace.toggleDeveloperTools', EditorUi>(` — a única porta (menu View) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:130`).
- G5: n/a — o encaixe da faixa do dock é medido na Fase 6 (`src/editor/workspace/panels.ts:130`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:130`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/panels.ts:128`).

## Medições
- a medir na Fase 6: o encaixe da faixa do dock com a aba Documento a mais, nas duas telas (famílias `cut`, `wrapped`, `off-window`, `covered`).
