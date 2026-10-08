# TRC-codePanel.copyPane
- **Chamada:** `src/app/commands.ts:508` `'codePanel.copyPane': copyPane,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:508` `'codePanel.copyPane': copyPane,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/code-panel/code-panel.ts:155` `const shown = shownPane(state.ui, state.document, rules);` — o arquivo mostrado e o seu texto são lidos [lê: EST-L01-030 via shownPane] [lê: EST-L01-037 via shownPane].
7. `src/editor/code-panel/code-panel.ts:157` `return { kind: 'change', clipboard: { text: shown.text }, message: message('status.codePanel.copied', { path: shown.path }) };` — o texto é entregue à área de transferência pelo `Outcome`, não ao documento.
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface fica a mesma (o `Outcome` não traz `ui`) [lê: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado (a mensagem mudou) [escreve: EST-L01-033 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a barra de estado mostra a mensagem [lê: EST-L01-033 via publish].
12. `src/core/store/store.ts:572` `if (outcome.clipboard !== undefined) options.clipboard?.write(outcome.clipboard);` — o texto é levado à porta da área de transferência, depois do commit.
13. `src/editor/clipboard.ts:79` `own = content.text;` — a cópia própria do editor guarda o texto [escreve: EST-L05b-001 via browserClipboard.write].

## Ramos
- R1 `src/editor/code-panel/code-panel.ts:156` `if (shown === null || shown.text === null) return { kind: 'refused', message: message('status.codePanel.noText', { path: shown?.path ?? '' }) };` — sem arquivo mostrado ou sem texto legível: recusa nomeando o caminho; com texto: segue para o passo 7.

## Fronteiras assíncronas
- a escrita no clipboard do sistema é disparada sem espera: `src/editor/clipboard.ts:83` `? navigator.clipboard.writeText(content.text)`; o editor não aguarda a promessa (o seu próprio `own` já guarda o texto).

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, run, shownPane, commit), EST-L01-037 (o estado do editor, via run, shownPane, publish), EST-L01-033 (a mensagem, via publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-033 (a mensagem da barra de estado, via publish), EST-L05b-001 (a cópia própria do editor).

## Resultado
- **Estado final:** EST-L01-033 com a mensagem "copiado" (`src/editor/code-panel/code-panel.ts:157`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a barra de estado.
- **DOM do editor:** a barra de estado diz que o texto foi copiado (`src/editor/code-panel/code-panel.ts:157`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não escreve no documento, só entrega texto à área de transferência (`src/editor/code-panel/code-panel.ts:157`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/code-panel/code-panel.ts:154` `export const copyPane = registerHandler<'codePanel.copyPane', EditorUi>('codePanel.copyPane', ({ state, rules }) => {` — a única porta (o botão Copiar do painel) chega ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/code-panel/code-panel.ts:157`).
- G5: n/a — o encaixe do painel de código é medido na Fase 6 (`src/editor/code-panel/code-panel.ts:157`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/code-panel/code-panel.ts:157`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/code-panel/code-panel.ts:155`).

## Medições
- nenhuma — o trecho não lê dimensão, posição, rolagem, zoom, estilo calculado nem o elemento sob um ponto.
