# TRC-quickPanel.setOpen
- **Chamada:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Argumentos:** `{ open }` — um enum `open`/`close`/`toggle`.
- **Ramos que dependem dos argumentos:** R1 (`open`), R2 (o estado não muda).

## Passos
1. `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/quick-panel/quick-panel.ts:51` `const now = quickPanelOpen(state.ui);` — o estado atual do painel é lido [lê: EST-L01-037 via quickPanelOpen].
7. `src/editor/quick-panel/quick-panel.ts:52` `const next = open === 'toggle' ? !now : open === 'open';` — o pedido vira o estado final.
8. `src/editor/quick-panel/quick-panel.ts:54` `return { kind: 'change', ui: { ...state.ui, quickPanelOpen: next ? true : undefined } };` — o painel aberto é gravado (ausente quando fechado) [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/quick-panel/quick-panel.ts:52` `const next = open === 'toggle' ? !now : open === 'open';` — `toggle`: inverte; `open`: abre; `close`: fecha.
- R2 `src/editor/quick-panel/quick-panel.ts:53` `if (next === now) return { kind: 'change' };` — o estado já é o pedido: mudança vazia, sem tocar `ui`; diferente segue para o passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/quick-panel/quick-panel.ts:50` `export const setOpen = registerHandler<'quickPanel.setOpen', EditorUi>('quickPanel.setOpen', ({ state }, { open }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, `ui.quickPanelOpen`, via quickPanelOpen, run, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.quickPanelOpen`, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.quickPanelOpen` verdadeiro ou ausente conforme `open` (`src/editor/quick-panel/quick-panel.ts:54`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel rápido abre ou volta a ser a sua alça (`src/editor/quick-panel/quick-panel.ts:54`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/quick-panel/quick-panel.ts:54`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/quick-panel/quick-panel.ts:50` `export const setOpen = registerHandler<'quickPanel.setOpen', EditorUi>('quickPanel.setOpen', ({ state }, { open }) => {` — as portas (alça do painel, Ctrl+Shift+Q global e no painel, Esc no painel) chegam ao mesmo tratador com só `open`.
- G4: n/a — o comando muda estado; o painel que ele abre fica ao lado do rótulo (`src/editor/quick-panel/quick-panel.ts:54`); a colocação é medida na Fase 6.
- G5: n/a — o encaixe do painel rápido alto é medido na Fase 6 (`src/editor/quick-panel/quick-panel.ts:54`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/quick-panel/quick-panel.ts:54`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/quick-panel/quick-panel.ts:51`).

## Medições
- a medir na Fase 6: o encaixe do painel rápido aberto (alto, com campos) sobre o palco, nas duas telas (famílias `cut`, `off-window`, `covered`, `sideways`).
