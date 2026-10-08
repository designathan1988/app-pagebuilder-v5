# ENT-P-geometry-0057 — canvas.setEditMode pela porta canvas.setEditMode#quick-panel-edit-on-canvas

## Passos
1. `src/editor/canvas/quick-panel.tsx:127` `const args = { [name]: value };` — o item "Editar na tela" do painel rápido entrega o `mode` escolhido; o manifesto não dá argumentos a esta porta (`manifest/commands/geometry.json:1715` `"args": {},`).
2. `src/editor/canvas/quick-panel.tsx:147` `door.run();` — o item roda o `run` do `useDoor` com esse `mode`.
3. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a Início: o painel rápido entrega a intenção à store do editor; o `given` é composto em `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` e a guarda está em `src/editor/doors/door.tsx:93` `if (!built || !available) return;`. [lê: EST-L01-037 via useDoor]
4. `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,` — a Chamada do trecho TRC-canvas.setEditMode: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — o comando não está construído ou o valor não vale agora (o `modeBuilt` do item): nada muda; vale: segue ao passo 3.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo: o despacho direto no passo 3.

## Fronteiras assíncronas
- nenhuma — o `run` da porta é síncrono para um comando sem arquivo nem área de transferência (`src/editor/doors/door.tsx:143` `if (file === undefined) {` leva direto ao passo 3).

## Estado
- Lê: EST-L01-037 (`ui.editMode`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (`ui.editMode` e `ui.quickPanelOpen`), pelo tratador do trecho TRC-canvas.setEditMode. Nenhum documento muda.

## Resultado
- **Estado final:** o `ui.editMode` fica com o modo escolhido ou sai (`src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o canvas passa a desenhar as alças do modo; o painel rápido fica recolhido ao chip (`src/editor/canvas/edit-mode.ts:37` `const { quickPanelOpen: _folded, ...clear } = rest;`).
- **DOM do canvas:** nada muda no documento desenhado; só o chrome das alças do modo aparece ou some.

## Regras
- G1: n/a — o comando grava só o estado do editor (`src/editor/canvas/edit-mode.ts:39`), não uma camada de estilo de elemento.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,` — o item do painel rápido e o Esc do canvas chamam o mesmo tratador com a mesma forma `{ mode }`.
- G4: ok `src/editor/canvas/edit-mode.ts:37` `const { quickPanelOpen: _folded, ...clear } = rest;` — o modo recolhe o painel rápido ao chip, para nenhuma alça ficar sob ele.
- G5: n/a — o comando não redimensiona painel nem barra; só troca o modo do canvas (`src/editor/canvas/edit-mode.ts:39`).
- G6: n/a — o comando não lê nem escreve a seleção; grava só `ui.editMode` (`src/editor/canvas/edit-mode.ts:32`).
- G7: n/a — nenhum documento muda (`src/editor/canvas/edit-mode.ts:39`), então não há render incremental a comparar.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o modo é estado do editor (`src/editor/canvas/edit-mode.ts:27` `export const editMode = (ui: EditorUi): EditMode => ui.editMode ?? NO_MODE;`).

## Ramos do trecho
- **Trecho:** TRC-canvas.setEditMode
- **Argumentos enviados:** `{ mode: <valor> }` — o modo do item escolhido (`src/editor/canvas/quick-panel.tsx:127` `const args = { [name]: value };`).
- R1 (o `mode` igual ao atual): o `mode` escolhido igual ao `ui.editMode` de agora leva ao lado que não toca o `ui` (`src/editor/canvas/edit-mode.ts:32` `if (editMode(state.ui) === mode) return { kind: 'change' };`); diferente: o passo 11 troca o campo.
- R2 (o `mode` `none`): o `mode` `none` faz o campo `editMode` sair do `ui` (`src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };`); qualquer outro modo entra.
