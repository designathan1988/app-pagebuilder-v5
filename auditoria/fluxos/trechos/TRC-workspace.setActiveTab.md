# TRC-workspace.setActiveTab
- **Chamada:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Argumentos:** `{ group, panel }` — `group` um enum de grupo de abas (`inspector`, `workbench`, `sidebar`, `refers: tab-group`), `panel` um texto (a aba que o grupo deve mostrar).
- **Ramos que dependem dos argumentos:** R1 (`group` inspector), R2 (`group` workbench), R3 (`group` sidebar), R4 (grupo desconhecido).

## Passos
1. `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — o despacho entra na store do núcleo.
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/editor/workspace/layout.ts:111` `if (group === INSPECTOR_GROUP) {` — um grupo escolhe o ramo do tratador [lê: EST-L01-037 via handlerContext].
7. `src/editor/workspace/layout.ts:131` `return { kind: 'change', ui: withLayout(ui, { ...ui.layout, tabActive: { ...ui.layout.tabActive, [host]: tab } }) };` — no grupo `sidebar`, a aba ativa da área hospedeira é gravada [escreve: EST-L01-037 via withLayout].
8. `src/editor/workspace/layout.ts:115` `return { kind: 'change', ui: withInspectorTab(ui, panel) };` — no grupo `inspector`, a aba do cabeçalho é gravada [escreve: EST-L01-037 via withInspectorTab].
9. `src/editor/workspace/layout.ts:121` `return { kind: 'change', ui: withDock(withActiveDockTab(ui, tab), ui.layout.dock === 'collapsed' ? 'open' : ui.layout.dock) };` — no grupo `workbench`, a aba do dock é gravada e o dock recolhido abre [escreve: EST-L01-037 via withActiveDockTab] [escreve: EST-L01-037 via withDock].
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a interface do tratador entra no estado novo [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
12. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado [escreve: EST-L01-037 via publish].
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados e a casca redesenha [lê: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/workspace/layout.ts:111` `if (group === INSPECTOR_GROUP) {` — grupo `inspector`: `panel` fora de `INSPECTOR_TABS` recusa (`src/editor/workspace/layout.ts:113`); a aba já ativa devolve mudança vazia (`src/editor/workspace/layout.ts:114`); outra segue para o passo 8.
- R2 `src/editor/workspace/layout.ts:117` `if (group === WORKBENCH_GROUP) {` — grupo `workbench`: `panel` fora de `ui.panels.dockTabs` recusa (`src/editor/workspace/layout.ts:120`); uma aba aberta segue para o passo 9.
- R3 `src/editor/workspace/layout.ts:123` `if (group === SIDEBAR_GROUP) {` — grupo `sidebar`: `panel` fora de `PANELS` recusa (`src/editor/workspace/layout.ts:126`); uma área empilhada (modo não `tabs`) recusa (`src/editor/workspace/layout.ts:129`); a aba já ativa devolve mudança vazia (`src/editor/workspace/layout.ts:130`); outra segue para o passo 7.
- R4 `src/editor/workspace/layout.ts:133` `return { kind: 'refused', message: argumentRefused('group') };` — um `group` que não é nenhum dos três recusa.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/workspace/layout.ts:107` `export const setActiveTab = registerHandler<'workspace.setActiveTab', EditorUi>(`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, handlerContext, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor: `ui.layout`, `ui.panels`, via handlerContext, publish), EST-L05a-001 (a digitação pendente, via beforeCommand).
- escreve: EST-L01-037 (o estado do editor: `ui.layout.inspectorTab`, `ui.layout.activeDockTab`, `ui.layout.tabActive`, `ui.layout.dock`, via withInspectorTab, withActiveDockTab/withDock, withLayout, run, publish).

## Resultado
- **Estado final:** EST-L01-037 com a aba ativa do grupo mudada (`src/editor/workspace/layout.ts:131`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a faixa de abas do grupo marca a aba nova e mostra o seu corpo (`src/editor/workspace/layout.ts:121`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:131`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:107` `export const setActiveTab = registerHandler<'workspace.setActiveTab', EditorUi>(` — as portas (abas do inspector, do dock, de uma área combinada) chegam ao mesmo tratador com o `group` e o `panel` da aba.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:131`).
- G5: n/a — o encaixe da faixa de abas é medido na Fase 6 (`src/editor/workspace/layout.ts:131`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:131`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/workspace/layout.ts:111`).

## Medições
- a medir na Fase 6: o encaixe da faixa de abas com nomes longos, nas duas telas (famílias `cut`, `wrapped`, `off-window`, `english`).
