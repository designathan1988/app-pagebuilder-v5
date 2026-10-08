# TRC-workspace.setPanelOpen
- **Chamada:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Argumentos:** `{ panel, open, focus? }` — `panel` um enum de painel (`main`, `sidebar`, `section`, `dock`, `workbench`), `open` um enum `open`/`close`/`toggle`, `focus` um booleano opcional, como o manifesto declara.
- **Ramos que dependem dos argumentos:** R1 (`open`), R2 (`focus`), R3 (`panel` que o catálogo não declara).

## Passos
1. `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/panels.ts:83` `({ state }, args) => {` — o tratador recebe o estado e os argumentos.
7. `src/editor/workspace/panels.ts:84` `const open = args.open === 'toggle' ? !isPanelOpen(state.ui, args.panel) : args.open === 'open';` — o pedido vira o estado final [lê: EST-L01-037 via isPanelOpen].
8. `src/editor/workspace/panels.ts:85` `const shown = open ? showPanel(state.ui, args.panel) : withPanel(state.ui, args.panel, false);` — o painel é mostrado (`showPanel`) ou escondido (`withPanel`) [escreve: EST-L01-037 via showPanel] [escreve: EST-L01-037 via withPanel].
9. `src/editor/workspace/panels.ts:86` `args.focus === true && open ? asking(shown,` — abrindo com `focus`, o foco é pedido [escreve: EST-L01-037 via asking].
10. `src/editor/workspace/panels.ts:87` `return { kind: 'change', ui, message: panelMessage(args.panel, open) };` — o resultado é uma mudança com a mensagem do painel.
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/workspace/panels.ts:84` `const open = args.open === 'toggle' ? !isPanelOpen(state.ui, args.panel) : args.open === 'open';` — `toggle`: inverte o estado do painel; `open`: abre; `close`: fecha.
- R2 `src/editor/workspace/panels.ts:86` `args.focus === true && open ? asking(shown,` — com `focus` e abrindo, o pedido de foco vai a `panel:<panel>`; sem ele, o estado fica sem pedido.
- R3 `src/editor/workspace/panels.ts:20` `const data = PANELS[panel];` — um `panel` que o catálogo não declara devolve `undefined` e o tratador lança ao ler `data.place` (defeito da porta); um painel declarado segue.

## Fronteiras assíncronas
- o pedido de foco gravado em `ui.focus` é atendido pelo instalador do foco quando o estado muda, num quadro: `src/editor/focus/focus.ts:187` `requestAnimationFrame(() =>` — o painel recém-aberto é desenhado no quadro seguinte e só então a região toma o foco.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.panels`, `ui.layout`, via handlerContext, isPanelOpen, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.panels`, `ui.layout`, `ui.focus`, via showPanel/withPanel, asking, run, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com o painel aberto ou fechado conforme `open` (`src/editor/workspace/panels.ts:87`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a casca mostra ou esconde o painel pela sua coluna (`src/editor/workspace/panels.ts:85` `const shown = open ? showPanel(state.ui, args.panel) : withPanel(state.ui, args.panel, false);`).
- **DOM do canvas:** nada muda; o quadro é desenhado pela mesma store.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:87`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:81` `export const setPanelOpen = registerHandler<'workspace.setPanelOpen', EditorUi>(` — todas as portas chegam ao mesmo tratador com só `panel`/`open`/`focus`.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:85`); o cobrimento em janela estreita é medido na Fase 6.
- G5: n/a — o encaixe do painel e da barra é medido na Fase 6 (`src/editor/workspace/panels.ts:85`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:87`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/panels.ts:83`).

## Medições
- a medir na Fase 6: a ordem de foco após abrir um painel com `focus` (o primeiro controle alcançável da região), que só o navegador calcula; e o encaixe da barra lateral sobre o canvas em 1280×720 e 1440×900 (famílias `cut`, `off-window`, `covered`).
