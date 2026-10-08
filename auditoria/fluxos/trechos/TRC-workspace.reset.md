# TRC-workspace.reset
- **Chamada:** `src/app/commands.ts:482` `'workspace.reset': resetWorkspace,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:482` `'workspace.reset': resetWorkspace,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/layout.ts:273` `const { splitterSizes: _sizes, collapsedSections: _sections, ...preferences } = state.ui.preferences;` — as preferências de tamanho e secção são deixadas de fora [lê: EST-L01-037 via handlerContext].
7. `src/editor/workspace/layout.ts:278` `ui: { ...state.ui, panels: INITIAL_PANELS, layout: INITIAL_LAYOUT, preferences },` — os painéis e o traçado voltam ao primeiro estado [escreve: EST-L01-037 via run].
8. `src/editor/workspace/layout.ts:279` `message: message('status.workspace.reset'),` — a barra de estado diz que a área de trabalho foi reposta.
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- nenhum — o tratador repõe sempre `INITIAL_PANELS` e `INITIAL_LAYOUT` `src/editor/workspace/layout.ts:278` `ui: { ...state.ui, panels: INITIAL_PANELS, layout: INITIAL_LAYOUT, preferences },`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/layout.ts:272` `export const resetWorkspace = registerHandler<'workspace.reset', EditorUi>('workspace.reset', ({ state }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.preferences`, `ui.panels`, `ui.layout`, via handlerContext, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.panels`, `ui.layout`, `ui.preferences`, via run, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.panels` e `ui.layout` no primeiro estado e as preferências sem `splitterSizes` nem `collapsedSections` (`src/editor/workspace/layout.ts:278`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** os painéis e o traçado voltam ao primeiro estado (`src/editor/workspace/layout.ts:278`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:278`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:272` `export const resetWorkspace = registerHandler<'workspace.reset', EditorUi>('workspace.reset', ({ state }) => {` — as duas portas (menu View, barra de comandos) chegam ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:278`).
- G5: n/a — o encaixe dos painéis repostos é medido na Fase 6 (`src/editor/workspace/layout.ts:278`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:278`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/layout.ts:273`).

## Medições
- a medir na Fase 6: o encaixe dos painéis e do traçado no primeiro estado, com documento profundo e nomes longos, nas duas telas (famílias `cut`, `wrapped`, `off-window`, `covered`, `sideways`).
