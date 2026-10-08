# ENT-P-workspace-0034 — workspace.collapseDocks pela porta workspace.collapseDocks#menu-view
- **Comando:** workspace.collapseDocks
- **Porta:** `menu-view`
- **Trecho:** TRC-workspace.collapseDocks

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no controle desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta sobre os do contexto.
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então o caminho segue ao despacho.
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor (o Início da porta).
6. `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — com o comando construído e a disponibilidade verdadeira, a porta segue aos passos seguintes; caso contrário não entrega nada.
- `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência: `files`, `file` e `clipboard` são indefinidos e o caminho toma o despacho direto. Os ramos de arquivo e área de transferência (linhas 98 a 142) não rodam.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.panels`, `ui.layout`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels`, `ui.layout`).

## Resultado
- **Estado final:** EST-L01-037 com todas as docas recolhidas e `ui.panels.collapsed` guardando o que estava aberto (`src/editor/workspace/panels.ts:146` `const collapsed = { sidebar: p.sidebar, inspector, dock: ui.layout.dock };`); ou, na segunda pressão, o estado reposto (`src/editor/workspace/panels.ts:144` `return { kind: 'change', ui: withDock(restored, back.dock), message: message('status.docks.restored') };`). O documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** as colunas somem e resta a faixa do dock (`src/editor/workspace/panels.ts:148` `return { kind: 'change', ui: withDock(hidden, 'collapsed'), message: message('status.docks.collapsed') };`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:148` `return { kind: 'change', ui: withDock(hidden, 'collapsed'), message: message('status.docks.collapsed') };`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:136` `export const collapseDocks = registerHandler<'workspace.collapseDocks', EditorUi>('workspace.collapseDocks', ({ state }) => {` — a porta envia só a intenção sem argumentos; o tratador é o mesmo de todas as portas do comando workspace.collapseDocks.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:148` `return { kind: 'change', ui: withDock(hidden, 'collapsed'), message: message('status.docks.collapsed') };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/panels.ts:148` `return { kind: 'change', ui: withDock(hidden, 'collapsed'), message: message('status.docks.collapsed') };`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:148` `return { kind: 'change', ui: withDock(hidden, 'collapsed'), message: message('status.docks.collapsed') };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.collapseDocks
- **Argumentos enviados:** nenhum
- nenhum — os argumentos do comando não mudam o caminho do tratador: a porta envia só a intenção.
