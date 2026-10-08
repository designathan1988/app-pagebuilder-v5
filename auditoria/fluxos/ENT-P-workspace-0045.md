# ENT-P-workspace-0045 — workspace.resizeSplitter pela porta workspace.resizeSplitter#panel-drag-splitter-workspace
- **Comando:** workspace.resizeSplitter
- **Porta:** `panel-drag-splitter-workspace`
- **Trecho:** TRC-workspace.resizeSplitter

## Passos
1. `src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;` — só um arraste de separador em curso segue.
2. `src/editor/input/pointer/resize.ts:19` `const { press, start, from } = ps.splitting;` — o press, o ponto de início e o tamanho que o separador mostra no press.
3. `src/editor/input/pointer/resize.ts:21` `const distance = axis === 'x' ? Math.round(at.x - start.x) : Math.round(at.y - start.y);` — o deslocamento do ponteiro ao longo do eixo do separador.
4. `src/editor/input/pointer/resize.ts:23` `shared.open = store.gesture();` — o deslocamento roda no gesto do arraste.
5. `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);` — o gesto despacha o id e os argumentos (o Início da porta).
6. `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;` — sem um arraste de separador em curso nada roda.
- `src/editor/input/pointer/resize.ts:20` `const axis = SPLITTERS[String(press.args.splitter ?? '') as SplitterId]?.axis ?? 'x';` — o eixo do separador decide se o deslocamento mede `at.x - start.x` (horizontal) ou `at.y - start.y` (vertical).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.preferences.splitterSizes`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.preferences.splitterSizes`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.preferences.splitterSizes[splitter]` no tamanho preso às bordas (`src/editor/workspace/layout.ts:329` `const preferences = { ...state.ui.preferences, splitterSizes: { ...state.ui.preferences.splitterSizes, [splitter]: next } };`), ou inalterado quando igual; o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a coluna do separador muda de tamanho (`src/editor/workspace/layout.ts:330` `return { kind: 'change', ui: { ...state.ui, preferences } };`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/layout.ts:329` `const preferences = { ...state.ui.preferences, splitterSizes: { ...state.ui.preferences.splitterSizes, [splitter]: next } };`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:314` `export const resizeSplitter = registerHandler<'workspace.resizeSplitter', EditorUi>(` — a porta envia `splitter` e a sua intenção (`size`/`distance` no arraste, `direction` na seta e no menu); o tratador é o mesmo de todas as portas do comando workspace.resizeSplitter.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:330` `return { kind: 'change', ui: { ...state.ui, preferences } };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/layout.ts:327` `const next = clamped(data, wanted);`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:329` `const preferences = { ...state.ui.preferences, splitterSizes: { ...state.ui.preferences.splitterSizes, [splitter]: next } };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.resizeSplitter
- **Argumentos enviados:** splitter: o nome do separador pressionado; size: o tamanho que ele mostra no press; distance: o deslocamento do arraste
- R1 `src/editor/workspace/layout.ts:319` `if (data === undefined) throw new Error(` — o `splitter` enviado (o do separador pressionado) é declarado por layout.json: o tratador segue, não lança.
- R2 `src/editor/workspace/layout.ts:322` `const base = typeof size === 'number' ? size : splitterSize(state.ui, splitter) ?? data.size;` — esta porta envia `size` (o arraste): o tamanho de partida é o que o gesto tocou.
- R3 `src/editor/workspace/layout.ts:325` `const wanted =` — esta porta envia `distance` (o arraste): o tamanho querido é a base mais o deslocamento assinado.
- R4 `src/editor/workspace/layout.ts:326` `typeof distance === 'number' ? base + sign(data) * distance : direction !== undefined && along(data, direction) ? base + (direction === data.grow ? STEP : -STEP) : base;` — esta porta não envia `direction`: o caminho não toma este lado.
