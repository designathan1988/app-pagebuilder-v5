# TRC-workspace.toggleLeftDock
- **Chamada:** `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/panels.ts:98` `const sidebar = !state.ui.panels.sidebar;` — o estado da barra lateral é invertido [lê: EST-L01-037 via handlerContext].
7. `src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };` — o resultado é uma mudança com `sidebar` novo [escreve: EST-L01-037 via run].
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
9. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
10. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
11. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- nenhum — o tratador não tem condição: lê `state.ui.panels.sidebar` e grava o seu oposto `src/editor/workspace/panels.ts:98` `const sidebar = !state.ui.panels.sidebar;`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/panels.ts:95` `export const toggleLeftDock = registerHandler<'workspace.toggleLeftDock', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.panels.sidebar`, via handlerContext, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.panels.sidebar`, via run, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com `ui.panels.sidebar` oposto ao anterior (`src/editor/workspace/panels.ts:99`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a coluna da barra lateral aparece ou some (`src/editor/workspace/panels.ts:99`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:99`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:95` `export const toggleLeftDock = registerHandler<'workspace.toggleLeftDock', EditorUi>(` — as três portas (Ctrl+B global, Ctrl+B no campo, menu View) chegam ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:99`); o cobrimento pela barra em janela estreita é medido na Fase 6.
- G5: n/a — o encaixe da barra lateral é medido na Fase 6 (`src/editor/workspace/panels.ts:99`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:99`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/panels.ts:98`).

## Medições
- a medir na Fase 6: o encaixe da barra lateral, com nomes longos e documento profundo, em 1280×720 e 1440×900 (famílias `cut`, `wrapped`, `off-window`, `covered`).
