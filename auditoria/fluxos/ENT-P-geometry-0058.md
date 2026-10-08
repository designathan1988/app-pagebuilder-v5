# ENT-P-geometry-0058 — canvas.setEditMode pela porta canvas.setEditMode#key-escape-in-canvas-edit-mode

## Passos
1. `src/editor/input/keymap.ts:381` `const onKeyDown = (event: KeyboardEvent) => {` — o keymap recebe a tecla `Escape` no contexto `canvas-edit-mode`.
2. `src/editor/input/keymap.ts:477` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação do acorde no contexto `canvas-edit-mode`.
3. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto (`manifest/commands/geometry.json:1738` `"mode": "none"`) sobre os do controle focado.
4. `src/editor/input/keymap.ts:528` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — este `gesture` é nulo (`manifest/commands/geometry.json:1725` `"gesture": null,`), então `args` é `given`.
5. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a Início: a tecla entrega a intenção à store do editor. [lê: EST-L01-037 via keyContextIn]
6. `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,` — a Chamada do trecho TRC-canvas.setEditMode: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/input/keymap.ts:506` `if (!shortcutRunsNow(binding)) return;` — a porta não corre agora: nada; corre: segue ao passo 5.
- R2 `src/editor/input/keymap.ts:531` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — um argumento de área de transferência faria a tecla aguardar; este comando não tem: o passo 5 despacha direto.

## Fronteiras assíncronas
- nenhuma — o keymap despacha de forma síncrona; a leitura da área de transferência (`src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) só vale para um argumento de área de transferência, que este comando não tem.

## Estado
- Lê: EST-L01-037 (`ui.editMode`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (`ui.editMode` e `ui.quickPanelOpen`), pelo tratador do trecho TRC-canvas.setEditMode. Nenhum documento muda.

## Resultado
- **Estado final:** o campo `ui.editMode` sai do estado (`src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o canvas deixa de desenhar as alças do modo (`src/editor/canvas/edit-mode.ts:32`).
- **DOM do canvas:** nada muda no documento desenhado; só o chrome das alças do modo some.

## Regras
- G1: n/a — o comando grava só o estado do editor (`src/editor/canvas/edit-mode.ts:39`), não uma camada de estilo de elemento.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,` — o item do painel rápido e o Esc do canvas chamam o mesmo tratador com a mesma forma `{ mode }`.
- G4: ok `src/editor/canvas/edit-mode.ts:37` `const { quickPanelOpen: _folded, ...clear } = rest;` — o modo recolhe o painel rápido ao chip, para nenhuma alça ficar sob ele.
- G5: n/a — o comando não redimensiona painel nem barra; só troca o modo do canvas (`src/editor/canvas/edit-mode.ts:39`).
- G6: n/a — o comando não lê nem escreve a seleção; grava só `ui.editMode` (`src/editor/canvas/edit-mode.ts:32`).
- G7: n/a — nenhum documento muda (`src/editor/canvas/edit-mode.ts:39`), então não há render incremental a comparar.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531`); o ouvinte `keydown` do keymap existe fora dele.

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o modo é estado do editor (`src/editor/canvas/edit-mode.ts:27` `export const editMode = (ui: EditorUi): EditMode => ui.editMode ?? NO_MODE;`).

## Ramos do trecho
- **Trecho:** TRC-canvas.setEditMode
- **Argumentos enviados:** `{ mode: 'none' }` — o Esc do canvas manda o modo que limpa (`manifest/commands/geometry.json:1738` `"mode": "none"`).
- R1 (o `mode` igual ao atual): com um modo em vigor (`ui.editMode` diferente de `none`), o `mode` `none` é diferente do atual e não é tomado (`src/editor/canvas/edit-mode.ts:32` `if (editMode(state.ui) === mode) return { kind: 'change' };`); já em `none`, nada muda.
- R2 (o `mode` `none`): o `mode` `none` faz o campo `editMode` sair do `ui` (`src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };`).
