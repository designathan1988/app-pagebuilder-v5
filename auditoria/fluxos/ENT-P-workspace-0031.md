# ENT-P-workspace-0031 — workspace.toggleInspector pela porta workspace.toggleInspector#menu-view
- **Comando:** workspace.toggleInspector
- **Porta:** `menu-view`
- **Trecho:** TRC-workspace.toggleInspector

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no controle desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta sobre os do contexto.
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então o caminho segue ao despacho.
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor (o Início da porta).
6. `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — com o comando construído e a disponibilidade verdadeira, a porta segue aos passos seguintes; caso contrário não entrega nada.
- `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência: `files`, `file` e `clipboard` são indefinidos e o caminho toma o despacho direto. Os ramos de arquivo e área de transferência (linhas 98 a 142) não rodam.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.panels`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels`).

## Resultado
- **Estado final:** EST-L01-037 com os painéis do lugar `inspector` abertos ou fechados (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a coluna do inspector aparece ou some (`src/editor/workspace/panels.ts:106` `export const withInspector = (ui: EditorUi, open: boolean): EditorUi => panelsAt('inspector').reduce((next, panel) => withPanel(next, panel, open), ui);`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:109` `export const toggleInspector = registerHandler<'workspace.toggleInspector', EditorUi>(` — a porta envia só a intenção sem argumentos; o tratador é o mesmo de todas as portas do comando workspace.toggleInspector.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.toggleInspector
- **Argumentos enviados:** nenhum
- nenhum — os argumentos do comando não mudam o caminho do tratador: a porta envia só a intenção.
