# ENT-P-workspace-0049 — workspace.resizeSplitter pela porta workspace.resizeSplitter#key-arrow-down-in-splitter
- **Comando:** workspace.resizeSplitter
- **Porta:** `key-arrow-down-in-splitter`
- **Trecho:** TRC-workspace.resizeSplitter

## Passos
1. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a tecla resolve a ligação do acorde no contexto do foco.
2. `src/editor/shell/splitter.tsx:31` `data-args={JSON.stringify({ splitter })}` — o separador com foco entrega o seu nome ao comando.
3. `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — a tecla só roda se o comando está construído.
4. `src/editor/input/keymap.ts:514` `: focusedArgs(event.target, binding);` — os argumentos vêm do controle em foco quando ele é do mesmo comando.
5. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto da porta entram sobre os do foco.
6. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o despacho entra na store do editor (o Início da porta).
7. `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/input/keymap.ts:487` `if (!binding) return;` — sem ligação do acorde na cadeia de contextos a tecla não faz nada.
- `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — com o comando construído a tecla roda; caso contrário para.
- `src/editor/input/keymap.ts:515` `if (own === null) return;` — um controle do mesmo comando indisponível deixa a tecla sem efeito.
- `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — sem argumento de área de transferência (`clipboard` indefinido), o despacho é imediato (linha 531).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`), sem await, temporizador nem ouvinte.

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
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/layout.ts:314` `export const resizeSplitter = registerHandler<'workspace.resizeSplitter', EditorUi>(` — a porta envia `splitter` e a sua intenção (`size`/`distance` no arraste, `direction` na seta e no menu); o tratador é o mesmo de todas as portas do comando workspace.resizeSplitter.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/layout.ts:330` `return { kind: 'change', ui: { ...state.ui, preferences } };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/layout.ts:327` `const next = clamped(data, wanted);`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/layout.ts:329` `const preferences = { ...state.ui.preferences, splitterSizes: { ...state.ui.preferences.splitterSizes, [splitter]: next } };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.resizeSplitter
- **Argumentos enviados:** splitter: o separador com foco; direction: `down`
- R1 `src/editor/workspace/layout.ts:319` `if (data === undefined) throw new Error(` — o `splitter` enviado (o do separador com foco) é declarado por layout.json: o tratador segue, não lança.
- R2 `src/editor/workspace/layout.ts:322` `const base = typeof size === 'number' ? size : splitterSize(state.ui, splitter) ?? data.size;` — esta porta não envia `size`: o tamanho de partida é o mostrado agora.
- R3 `src/editor/workspace/layout.ts:325` `const wanted =` — esta porta não envia `distance`: o caminho não toma este lado.
- R4 `src/editor/workspace/layout.ts:326` `typeof distance === 'number' ? base + sign(data) * distance : direction !== undefined && along(data, direction) ? base + (direction === data.grow ? STEP : -STEP) : base;` — esta porta envia `direction` `down`: uma seta ao longo do eixo dá o passo (`STEP`) para o lado do crescer.
