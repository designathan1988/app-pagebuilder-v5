# TRC-workspace.collapseDocks
- **Chamada:** `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,`
- **Argumentos:** nenhum.
- **Ramos que dependem dos argumentos:** nenhum

## Passos
1. `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/panels.ts:139` `const inspector = inspectorOpen(ui);` — o inspector é lido [lê: EST-L01-037 via inspectorOpen].
7. `src/editor/workspace/panels.ts:140` `const anyOpen = p.sidebar || inspector || ui.layout.dock !== 'collapsed';` — decide se há algo aberto a recolher [lê: EST-L01-037 via handlerContext].
8. `src/editor/workspace/panels.ts:146` `const collapsed = { sidebar: p.sidebar, inspector, dock: ui.layout.dock };` — guarda o que estava aberto para a segunda pressão [escreve: EST-L01-037 via run].
9. `src/editor/workspace/panels.ts:147` `const hidden = withInspector({ ...ui, panels: { ...p, sidebar: false, collapsed } }, false);` — a barra lateral e o inspector são escondidos [escreve: EST-L01-037 via withInspector].
10. `src/editor/workspace/panels.ts:148` `return { kind: 'change', ui: withDock(hidden, 'collapsed'), message: message('status.docks.collapsed') };` — o dock é recolhido [escreve: EST-L01-037 via withDock].
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/workspace/panels.ts:141` `if (!anyOpen && p.collapsed !== null) {` — nada aberto e com o último recolhimento guardado: a segunda pressão repõe o que estava aberto (`src/editor/workspace/panels.ts:144`); caso contrário, recolhe tudo (passos 8 a 10).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/panels.ts:136` `export const collapseDocks = registerHandler<'workspace.collapseDocks', EditorUi>('workspace.collapseDocks', ({ state }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.panels`, `ui.layout`, via handlerContext, inspectorOpen, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.panels`, `ui.layout`, via run, withInspector, withDock, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** EST-L01-037 com todas as docas recolhidas e `ui.panels.collapsed` guardando o que estava aberto (`src/editor/workspace/panels.ts:146`); ou, na segunda pressão, o estado reposto (`src/editor/workspace/panels.ts:144`). O documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** as colunas somem e resta a faixa do dock (`src/editor/workspace/panels.ts:148`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:148`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:136` `export const collapseDocks = registerHandler<'workspace.collapseDocks', EditorUi>('workspace.collapseDocks', ({ state }) => {` — as três portas (Ctrl+\ global, Ctrl+\ no campo, menu View) chegam ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:148`).
- G5: n/a — o encaixe das colunas e da faixa do dock é medido na Fase 6 (`src/editor/workspace/panels.ts:148`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:148`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/panels.ts:139`).

## Medições
- a medir na Fase 6: o encaixe das colunas recolhidas e da faixa do dock, com nomes longos, nas duas telas (famílias `cut`, `off-window`, `covered`, `sideways`).
