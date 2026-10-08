# TRC-workspace.movePanel
- **Chamada:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Argumentos:** `{ panel, to, at?, host?, distance? }` — `panel` e `host` textos, `to` um enum `float`/`dock-left`/`dock-right`/`workbench`/`tabs`/`stack`, `at` um ponto e `distance` um número opcionais.
- **Ramos que dependem dos argumentos:** R1 (`to` `float`), R2 (`to` `dock-left`), R3 (`to` `dock-right`), R4 (`to` `workbench`), R5 (`host` ausente nas duas combinações), R6 (`to` `tabs` ou `stack`).

## Passos
1. `src/app/commands.ts:486` `'workspace.movePanel': movePanel,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/layout.ts:233` `const panel = panelOf(args.panel);` — o painel é resolvido pelo catálogo (defeito da porta quando não existe).
7. `src/editor/workspace/layout.ts:234` `const ui = detachPanel(state.ui, panel);` — o painel deixa todo lugar onde estava [escreve: EST-L01-037 via detachPanel].
8. `src/editor/workspace/layout.ts:238` `const floating = [...(layout.floating ?? []), { panel, x: Math.round(at.x), y: Math.round(at.y) }];` — no lugar `float`, a janela nova é acrescentada no ponto `at` [escreve: EST-L01-037 via run].
9. `src/editor/workspace/layout.ts:239` `return { kind: 'change', ui: withLayout(ui, { ...layout, floating }), message: panelMessage('status.panel.floating', panel) };` — o resultado é uma mudança com a janela flutuante.
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/workspace/layout.ts:236` `if (args.to === FLOAT) {` — `float`: a janela flutuante é posta em `at` (ou `{ x: 0, y: 0 }` sem ele) (passos 8 e 9).
- R2 `src/editor/workspace/layout.ts:241` `if (args.to === 'dock-left') {` — `dock-left`: a volta ao lugar da esquerda (`src/editor/workspace/layout.ts:212` `function dockedLeft(ui: EditorUi, panel: Panel): EditorUi {`).
- R3 `src/editor/workspace/layout.ts:244` `if (args.to === 'dock-right') {` — `dock-right`: entra na doca direita (`src/editor/workspace/layout.ts:246`).
- R4 `src/editor/workspace/layout.ts:248` `if (args.to === 'workbench') {` — `workbench`: entra nas abas do dock e esta abre (`src/editor/workspace/layout.ts:252`).
- R5 `src/editor/workspace/layout.ts:255` `if (host === null) throw new Error(` — `tabs`/`stack` sem `host` lança (defeito da porta); com `host`, segue para R6.
- R6 `src/editor/workspace/layout.ts:256` `const mode: CombinedPanel['mode'] = args.to === STACK ? 'stack' : 'tabs';` — `stack`: empilha sob o hospedeiro; `tabs`: vira uma aba da área dele (`src/editor/workspace/layout.ts:258`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/layout.ts:230` `export const movePanel = registerHandler<'workspace.movePanel', EditorUi>(`); o arraste que o chama entrega o ponto `at` a cada solta, mas cada solta roda inteira dentro do trecho.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.layout`, `ui.panels`, via handlerContext, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.layout.floating`, `ui.layout.right`, `ui.layout.combined`, `ui.layout.tabActive`, `ui.panels`, via detachPanel, run, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com o painel fora de todo lugar antigo e no lugar pedido por `to` (`src/editor/workspace/layout.ts:239`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel aparece como janela, na doca, nas abas ou combinado (`src/editor/workspace/layout.ts:258`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:234`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:230` `export const movePanel = registerHandler<'workspace.movePanel', EditorUi>(` — as portas de arraste (header para o canvas, para a borda esquerda, para a direita, para a parte de cima ou de baixo de outro painel) e o botão Dock chegam ao mesmo tratador com só `to`, `at` e `host`.
- G4: n/a — o comando muda estado; a janela flutuante cobre parte do canvas e esse cobrimento é medido na Fase 6 (`src/editor/workspace/layout.ts:239`).
- G5: n/a — o encaixe da janela flutuante e das áreas combinadas é medido na Fase 6 (`src/editor/workspace/layout.ts:238`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:234`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/layout.ts:234`).

## Medições
- a medir na Fase 6: o ponto `at` da janela flutuante e a sua dimensão são valores que só o navegador calcula (posição e dimensão de painel); medir o encaixe da janela e das áreas combinadas nas duas telas (famílias `off-window`, `covered`, `sideways`).
