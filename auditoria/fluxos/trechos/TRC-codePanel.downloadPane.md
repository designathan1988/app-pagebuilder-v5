# TRC-codePanel.downloadPane
- **Chamada:** `src/app/commands.ts:509` `'codePanel.downloadPane': downloadPane,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:509` `'codePanel.downloadPane': downloadPane,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/code-panel/code-panel.ts:161` `const shown = shownPane(state.ui, state.document, rules);` — o arquivo mostrado e o seu texto são lidos [lê: EST-L01-030 via shownPane] [lê: EST-L01-037 via shownPane].
7. `src/editor/code-panel/code-panel.ts:163` `return { kind: 'change', download: { name: shown.path.slice(shown.path.lastIndexOf('/') + 1), type: shown.path.endsWith('.css') ? 'text/css' : 'text/html', bytes: new TextEncoder().encode(shown.text) }, message: message('status.codePanel.downloaded', { path: shown.path }) };` — o arquivo é entregue à porta de descarga pelo `Outcome`.
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface fica a mesma (o `Outcome` não traz `ui`) [lê: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado (a mensagem mudou) [escreve: EST-L01-033 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a barra de estado mostra a mensagem [lê: EST-L01-033 via publish].
12. `src/core/store/store.ts:570` `if (outcome.download !== undefined) options.downloads?.deliver(outcome.download);` — o arquivo é levado à porta de descarga, depois do commit.
13. `src/editor/download.ts:7` `const url = URL.createObjectURL(new Blob([file.bytes.slice().buffer], { type: file.type }));` — o navegador cria o endereço do arquivo.
14. `src/editor/download.ts:13` `setTimeout(() => URL.revokeObjectURL(url), 0);` — o endereço é liberado no quadro de tempo seguinte.

## Ramos
- R1 `src/editor/code-panel/code-panel.ts:162` `if (shown === null || shown.text === null) return { kind: 'refused', message: message('status.codePanel.noText', { path: shown?.path ?? '' }) };` — sem arquivo mostrado ou sem texto legível: recusa nomeando o caminho; com texto: segue para o passo 7.

## Fronteiras assíncronas
- `src/editor/download.ts:13` `setTimeout(() => URL.revokeObjectURL(url), 0);` — o endereço do objeto é liberado no quadro de tempo seguinte; no intervalo, nenhuma entrada roda sobre o documento (o arquivo já foi entregue).

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, run, shownPane, commit), EST-L01-037 (o estado do editor, via run, shownPane, publish), EST-L01-033 (a mensagem, via publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-033 (a mensagem da barra de estado, via publish).

## Resultado
- **Estado final:** EST-L01-033 com a mensagem "descarregado" (`src/editor/code-panel/code-panel.ts:163`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a barra de estado.
- **DOM do editor:** a barra de estado diz que o arquivo foi descarregado (`src/editor/code-panel/code-panel.ts:163`).
- **DOM do canvas:** nada muda; o navegador guarda o arquivo por um link que ele mesmo clica (`src/editor/download.ts:11` `link.click();`).

## Regras
- G1: n/a — o comando não escreve no documento, só entrega um arquivo à porta de descarga (`src/editor/code-panel/code-panel.ts:163`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/code-panel/code-panel.ts:160` `export const downloadPane = registerHandler<'codePanel.downloadPane', EditorUi>('codePanel.downloadPane', ({ state, rules }) => {` — a única porta (o botão Descarregar do painel) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/code-panel/code-panel.ts:163`).
- G5: n/a — o encaixe do painel de código é medido na Fase 6 (`src/editor/code-panel/code-panel.ts:163`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/code-panel/code-panel.ts:163`).

## Limpeza
- o endereço do objeto é liberado no próprio temporizador `src/editor/download.ts:13` `setTimeout(() => URL.revokeObjectURL(url), 0);`; o link criado não é anexado à página nem recebe ouvinte, sem remoção pendente.

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
