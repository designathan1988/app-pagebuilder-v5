# TRC-workspace.resizeSplitter
- **Chamada:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Argumentos:** `{ splitter, size?, distance?, direction? }` — `splitter` um nome de separador (`refers: splitter`), `size` e `distance` números opcionais, `direction` um enum `up`/`down`/`left`/`right` opcional.
- **Ramos que dependem dos argumentos:** R1 (`splitter` que o manifesto não declara), R2 (`size`), R3 (`distance`), R4 (`direction`).

## Passos
1. `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/layout.ts:322` `const base = typeof size === 'number' ? size : splitterSize(state.ui, splitter) ?? data.size;` — o tamanho de partida vem do argumento ou do mostrado agora [lê: EST-L01-037 via splitterSize].
7. `src/editor/workspace/layout.ts:326` `typeof distance === 'number' ? base + sign(data) * distance : direction !== undefined && along(data, direction) ? base + (direction === data.grow ? STEP : -STEP) : base;` — o tamanho querido vem do arraste ou do passo da seta.
8. `src/editor/workspace/layout.ts:327` `const next = clamped(data, wanted);` — o tamanho é preso às bordas do separador.
9. `src/editor/workspace/layout.ts:329` `const preferences = { ...state.ui.preferences, splitterSizes: { ...state.ui.preferences.splitterSizes, [splitter]: next } };` — o tamanho novo é guardado na preferência do separador [escreve: EST-L01-037 via run].
10. `src/editor/workspace/layout.ts:330` `return { kind: 'change', ui: { ...state.ui, preferences } };` — o resultado é uma mudança.
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/workspace/layout.ts:319` `if (data === undefined) throw new Error(` — um `splitter` que `layout.json` não declara lança (defeito da porta); um declarado segue.
- R2 `src/editor/workspace/layout.ts:322` `const base = typeof size === 'number' ? size : splitterSize(state.ui, splitter) ?? data.size;` — com `size` (o arraste), parte do tamanho que o gesto tocou; sem ele, do tamanho mostrado agora.
- R3 `src/editor/workspace/layout.ts:325` `const wanted =` — com `distance` (o arraste), o tamanho é a base mais o deslocamento assinado pelo sentido de crescer; sem ele, decide R4.
- R4 `src/editor/workspace/layout.ts:326` `typeof distance === 'number' ? base + sign(data) * distance : direction !== undefined && along(data, direction) ? base + (direction === data.grow ? STEP : -STEP) : base;` — uma `direction` ao longo do eixo do separador dá o passo (`STEP`) para o lado do crescer; uma seta atravessada ou sem direção não muda o tamanho.
- R5 `src/editor/workspace/layout.ts:328` `if (next === (splitterSize(state.ui, splitter) ?? data.size)) return { kind: 'change' };` — um tamanho igual ao mostrado devolve mudança vazia; diferente segue para o passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/layout.ts:314` `export const resizeSplitter = registerHandler<'workspace.resizeSplitter', EditorUi>(`); o arraste que o chama repete o despacho, mas cada passo roda inteiro dentro do trecho.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.preferences.splitterSizes`, via handlerContext, splitterSize, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.preferences.splitterSizes`, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.splitterSizes[splitter]` no tamanho preso às bordas (`src/editor/workspace/layout.ts:329`), ou inalterado quando igual (passo R5); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a coluna do separador muda de tamanho (`src/editor/workspace/layout.ts:330`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só uma preferência do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:329`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:314` `export const resizeSplitter = registerHandler<'workspace.resizeSplitter', EditorUi>(` — o arraste envia `size`, cada seta envia `direction`, o menu do View envia `splitter`/`direction`: todos chegam ao mesmo tratador.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:330`).
- G5: n/a — a dimensão do painel redimensionado e a barra de rolagem são medidas na Fase 6 (`src/editor/workspace/layout.ts:327`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:329`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/layout.ts:316`).

## Medições
- a medir na Fase 6: a distância do arraste e o tamanho resultante de cada separador são valores que só o navegador calcula (dimensão de painel e rolagem da coluna); medir o encaixe em 1280×720 e 1440×900 (famílias `cut`, `off-window`, `sideways`).
