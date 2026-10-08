# ENT-P-workspace-0040 — workspace.setActiveTab pela porta workspace.setActiveTab#inspector-tab-style
- **Comando:** workspace.setActiveTab
- **Porta:** `inspector-tab-style`
- **Trecho:** TRC-workspace.setActiveTab

## Passos
1. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no controle desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta sobre os do contexto.
4. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então o caminho segue ao despacho.
5. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor (o Início da porta).
6. `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — com o comando construído e a disponibilidade verdadeira, a porta segue aos passos seguintes; caso contrário não entrega nada.
- `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência: `files`, `file` e `clipboard` são indefinidos e o caminho toma o despacho direto. Os ramos de arquivo e área de transferência (linhas 98 a 142) não rodam.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.layout`, `ui.panels`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layout.inspectorTab`, `ui.layout.activeDockTab`, `ui.layout.tabActive`, `ui.layout.dock`).

## Resultado
- **Estado final:** EST-L01-037 com a aba ativa do grupo mudada (`src/editor/workspace/layout.ts:131` `return { kind: 'change', ui: withLayout(ui, { ...ui.layout, tabActive: { ...ui.layout.tabActive, [host]: tab } }) };`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a faixa de abas do grupo marca a aba nova e mostra o seu corpo (`src/editor/workspace/layout.ts:121` `return { kind: 'change', ui: withDock(withActiveDockTab(ui, tab), ui.layout.dock === 'collapsed' ? 'open' : ui.layout.dock) };`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:131` `return { kind: 'change', ui: withLayout(ui, { ...ui.layout, tabActive: { ...ui.layout.tabActive, [host]: tab } }) };`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:107` `export const setActiveTab = registerHandler<'workspace.setActiveTab', EditorUi>(` — a porta envia só `group` e `panel`; o tratador é o mesmo de todas as portas do comando workspace.setActiveTab.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:131` `return { kind: 'change', ui: withLayout(ui, { ...ui.layout, tabActive: { ...ui.layout.tabActive, [host]: tab } }) };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/layout.ts:131` `return { kind: 'change', ui: withLayout(ui, { ...ui.layout, tabActive: { ...ui.layout.tabActive, [host]: tab } }) };`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:131` `return { kind: 'change', ui: withLayout(ui, { ...ui.layout, tabActive: { ...ui.layout.tabActive, [host]: tab } }) };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.setActiveTab
- **Argumentos enviados:** group: `inspector`; panel: `style`
- R1 `src/editor/workspace/layout.ts:111` `if (group === INSPECTOR_GROUP) {` — esta porta envia `group` `inspector`: o caminho toma este ramo e grava a aba do cabeçalho.
- R2 `src/editor/workspace/layout.ts:117` `if (group === WORKBENCH_GROUP) {` — esta porta não envia `group` `workbench`: não toma este ramo.
- R3 `src/editor/workspace/layout.ts:123` `if (group === SIDEBAR_GROUP) {` — esta porta não envia `group` `sidebar`: não toma este ramo.
- R4 `src/editor/workspace/layout.ts:133` `return { kind: 'refused', message: argumentRefused('group') };` — o `group` enviado é um dos três: não toma o ramo da recusa.
