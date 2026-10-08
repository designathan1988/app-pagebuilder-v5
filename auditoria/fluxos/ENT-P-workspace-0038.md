# ENT-P-workspace-0038 — workspace.setWorkbenchState pela porta workspace.setWorkbenchState#toolbar-workbench-strip-toggle
- **Comando:** workspace.setWorkbenchState
- **Porta:** `toolbar-workbench-strip-toggle`
- **Trecho:** TRC-workspace.setWorkbenchState

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no controle desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta sobre os do contexto.
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então o caminho segue ao despacho.
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor (o Início da porta).
6. `src/app/commands.ts:483` `'workspace.setWorkbenchState': setWorkbenchState,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — com o comando construído e a disponibilidade verdadeira, a porta segue aos passos seguintes; caso contrário não entrega nada.
- `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência: `files`, `file` e `clipboard` são indefinidos e o caminho toma o despacho direto. Os ramos de arquivo e área de transferência (linhas 98 a 142) não rodam.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.layout.dock`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.layout.dock`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.layout.dock` no estado derivado de `state` (`src/editor/workspace/layout.ts:151` `ui: withDock(state.ui, nextDock(state.ui.layout.dock, args.state)),`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o dock mostra-se, recolhe-se ou maximiza-se (`src/editor/workspace/layout.ts:96` `export function withDock(ui: EditorUi, dock: DockState): EditorUi {`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:151` `ui: withDock(state.ui, nextDock(state.ui.layout.dock, args.state)),`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:147` `export const setWorkbenchState = registerHandler<'workspace.setWorkbenchState', EditorUi>(` — a porta envia só `state`; o tratador é o mesmo de todas as portas do comando workspace.setWorkbenchState.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:96` `export function withDock(ui: EditorUi, dock: DockState): EditorUi {`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/layout.ts:96` `export function withDock(ui: EditorUi, dock: DockState): EditorUi {`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:151` `ui: withDock(state.ui, nextDock(state.ui.layout.dock, args.state)),`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.setWorkbenchState
- **Argumentos enviados:** state: `toggle`
- R1 `src/editor/workspace/layout.ts:91` `if (request === 'toggle') return current === 'collapsed' ? 'open' : 'collapsed';` — esta porta envia `state` `toggle`: o caminho toma o lado que abre quando o dock está recolhido e o recolhe quando está aberto ou maximizado.
- R2 `src/editor/workspace/layout.ts:92` `if (request === 'toggle-max') return current === 'max' ? 'open' : 'max';` — esta porta não envia `state` `toggle-max`: o caminho não toma este lado.
- R3 `src/editor/workspace/layout.ts:93` `return request;` — esta porta não envia um `state` fixo (`collapsed`, `open`, `max`): o caminho não toma este lado.
