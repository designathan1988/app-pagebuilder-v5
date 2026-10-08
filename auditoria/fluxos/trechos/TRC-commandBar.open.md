# TRC-commandBar.open
- **Chamada:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:491` `'commandBar.open': openCommandBar,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/command-bar/command-bar.ts:16` `state.ui.commandBar === true ? { kind: 'change' }` — com a barra já aberta, devolve mudança vazia.
7. `src/editor/command-bar/command-bar.ts:16` `ui: { ...state.ui, commandBar: true } }` — fechada, grava `ui.commandBar` [escreve: EST-L01-037 via run].
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha a barra [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/command-bar/command-bar.ts:16` `state.ui.commandBar === true ? { kind: 'change' }` — a barra já está aberta: mudança vazia, sem tocar `ui`; fechada, segue para o passo 7.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/command-bar/command-bar.ts:16` `export const openCommandBar = registerHandler<'commandBar.open', EditorUi>('commandBar.open', ({ state }) => (state.ui.commandBar === true ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, commandBar: true } }));`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, run, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via run, publish), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (o estado do editor, via run, publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.commandBar` verdadeiro (`src/editor/command-bar/command-bar.ts:16`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca e a barra aparece.
- **DOM do editor:** a barra de comandos abre e o seu campo de busca toma o foco (efeito da casca, medido na Fase 6).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/command-bar/command-bar.ts:16`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/command-bar/command-bar.ts:16` `export const openCommandBar = registerHandler<'commandBar.open', EditorUi>('commandBar.open', ({ state }) => (state.ui.commandBar === true ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, commandBar: true } }));` — as portas (Ctrl+K, Ctrl+Shift+K global e na edição de texto, campo da barra de topo, menu Arquivo) chegam ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; a barra flutua sobre a área do editor e o seu cobrimento é medido na Fase 6 (`src/editor/command-bar/command-bar.ts:16`).
- G5: n/a — o encaixe da barra de comandos é medido na Fase 6 (`src/editor/command-bar/command-bar.ts:16`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/command-bar/command-bar.ts:16`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/command-bar/command-bar.ts:16`).

## Medições
- a medir na Fase 6: a ordem de foco ao abrir a barra (o campo de busca toma o foco) e o seu encaixe, nas duas telas (famílias `cut`, `off-window`, `covered`, `english`).
