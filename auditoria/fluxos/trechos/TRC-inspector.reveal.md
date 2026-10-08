# TRC-inspector.reveal
- **Chamada:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Argumentos:** `{ property?, attribute? }` — os dois opcionais: `property` mostra o campo da propriedade na aba Estilo, `attribute` o campo do atributo na aba Configurações.
- **Ramos que dependem dos argumentos:** R1 (nenhum argumento), R2 (`attribute` presente).

## Passos
1. `src/app/commands.ts:504` `'inspector.reveal': revealField,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/inspector/sections.ts:313` `const field = attribute ?? property;` — o campo a mostrar é o atributo, senão a propriedade.
7. `src/editor/inspector/sections.ts:315` `const shown = withInspectorTab(withInspector(state.ui, true), attribute !== undefined ? SETTINGS_TAB : STYLE_TAB);` — a coluna do inspector é mostrada e a aba certa escolhida [escreve: EST-L01-037 via withInspector] [escreve: EST-L01-037 via withInspectorTab].
8. `src/editor/inspector/sections.ts:316` `return { kind: 'change', ui: { ...shown, revealed: { field, count: (state.ui.revealed?.count ?? 0) + 1 } } };` — o pedido de revelação é gravado, contado para o campo distinguir um novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e o inspector redesenha [lê: EST-L01-002 via publish].

## Ramos
- R1 `src/editor/inspector/sections.ts:314` `if (field === undefined) return { kind: 'change' };` — sem `property` nem `attribute`: mudança vazia; com um deles, segue.
- R2 `src/editor/inspector/sections.ts:315` `const shown = withInspectorTab(withInspector(state.ui, true), attribute !== undefined ? SETTINGS_TAB : STYLE_TAB);` — com `attribute`: a aba Configurações mostra o campo; sem ele: a aba Estilo mostra o da propriedade.

## Fronteiras assíncronas
- o campo revelado toma o foco depois de o inspector desenhar; esse pedido é atendido fora do trecho (o contador em `ui.revealed`), num efeito do painel cujo instante só o navegador calcula.

## Estado
- lê: EST-L01-037 (`ui.revealed`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels`, `ui.layout.inspectorTab`, `ui.revealed`).

## Resultado
- **Estado final:** EST-L01-037 com o inspector aberto, a aba certa escolhida e `ui.revealed` com o campo e a contagem nova (`src/editor/inspector/sections.ts:316`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o inspector.
- **DOM do editor:** a coluna do inspector aparece na aba certa, com o campo revelado em vista (`src/editor/inspector/sections.ts:315`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/inspector/sections.ts:316`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/inspector/sections.ts:312` `export const revealField = registerHandler<'inspector.reveal', EditorUi>('inspector.reveal', ({ state }, { property, attribute }) => {` — as portas (o item Adicionar propriedade, a barra de comandos, o duplo clique num controle do canvas) chegam ao mesmo tratador com só `property` ou `attribute`.
- G4: n/a — o comando muda estado; a coluna do inspector ocupa a própria coluna e nada cobre o canvas no ponto da ação (`src/editor/inspector/sections.ts:315`).
- G5: n/a — o encaixe do campo revelado é medido na Fase 6 (`src/editor/inspector/sections.ts:315`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/inspector/sections.ts:316`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/inspector/sections.ts:313`).

## Medições
- a medir na Fase 6: a ordem de foco ao revelar um campo (o campo revelado toma o foco depois de o inspector desenhar), que só o navegador calcula, nas duas telas.
