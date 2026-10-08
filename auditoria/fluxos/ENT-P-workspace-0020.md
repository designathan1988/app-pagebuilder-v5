# ENT-P-workspace-0020 — workspace.setPanelOpen pela porta workspace.setPanelOpen#dock-strip-timeline
- **Comando:** workspace.setPanelOpen
- **Porta:** `dock-strip-timeline`
- **Trecho:** TRC-workspace.setPanelOpen

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no controle desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta sobre os do contexto.
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então o caminho segue ao despacho.
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor (o Início da porta).
6. `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — com o comando construído e a disponibilidade verdadeira, a porta segue aos passos seguintes; caso contrário não entrega nada.
- `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência: `files`, `file` e `clipboard` são indefinidos e o caminho toma o despacho direto. Os ramos de arquivo e área de transferência (linhas 98 a 142) não rodam.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.panels`, `ui.layout`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels`, `ui.layout`, `ui.focus`).

## Resultado
- **Estado final:** EST-L01-037 com o painel aberto ou fechado conforme `open` (`src/editor/workspace/panels.ts:87` `return { kind: 'change', ui, message: panelMessage(args.panel, open) };`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a casca mostra ou esconde o painel pela sua coluna (`src/editor/workspace/panels.ts:85` `const shown = open ? showPanel(state.ui, args.panel) : withPanel(state.ui, args.panel, false);`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:87` `return { kind: 'change', ui, message: panelMessage(args.panel, open) };`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:81` `export const setPanelOpen = registerHandler<'workspace.setPanelOpen', EditorUi>(` — a porta envia só `panel` e `open`; o tratador é o mesmo de todas as portas do comando workspace.setPanelOpen.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:85` `const shown = open ? showPanel(state.ui, args.panel) : withPanel(state.ui, args.panel, false);`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/panels.ts:85` `const shown = open ? showPanel(state.ui, args.panel) : withPanel(state.ui, args.panel, false);`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:87` `return { kind: 'change', ui, message: panelMessage(args.panel, open) };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.setPanelOpen
- **Argumentos enviados:** panel: `timeline`; open: `toggle`
- R1 `src/editor/workspace/panels.ts:84` `const open = args.open === 'toggle' ? !isPanelOpen(state.ui, args.panel) : args.open === 'open';` — esta porta envia `open` `toggle`: o caminho toma o lado que inverte o estado do painel.
- R2 `src/editor/workspace/panels.ts:86` `args.focus === true && open ? asking(shown,` — esta porta não envia `focus`: o estado fica sem pedido de foco.
- R3 `src/editor/workspace/panels.ts:20` `const data = PANELS[panel];` — o `panel` enviado é declarado pelo catálogo, então o tratador segue; não lança.
