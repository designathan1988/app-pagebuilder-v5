# TRC-canvas.setEditMode
- **Chamada:** `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,`
- **Argumentos:** `{ mode }` — enum `none`, `padding`, `margin`, `radius`, `border`, `gap`, `row-gap`, `column-gap`, `shadow-offset`, `shadow-blur`, obrigatório, como o manifesto declara (`manifest/commands/geometry.json:1669` `"mode": {`).
- **Ramos que dependem dos argumentos:** R1 (o `mode` igual ao atual) e R2 (o `mode` `none`).

## Passos
1. `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o painel rápido entrega a intenção à store do editor.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento é lido contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é testada (`src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);`).
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/editor/canvas/edit-mode.ts:30` `  'canvas.setEditMode',` — o tratador é registrado para `canvas.setEditMode`.
8. `src/editor/canvas/edit-mode.ts:31` `  ({ state }, { mode }) => {` — o tratador recebe o estado e o `mode`.
9. `src/editor/canvas/edit-mode.ts:32` `if (editMode(state.ui) === mode) return { kind: 'change' };` — `mode` igual ao atual: `change` sem mudança [lê: EST-L01-037 via editMode].
10. `src/editor/canvas/edit-mode.ts:27` `export const editMode = (ui: EditorUi): EditMode => ui.editMode ?? NO_MODE;` — o modo atual é lido do estado do editor.
11. `src/editor/canvas/edit-mode.ts:33` `const { editMode: _dropped, ...rest } = state.ui;` — o estado do editor sem o campo `editMode`.
12. `src/editor/canvas/edit-mode.ts:37` `const { quickPanelOpen: _folded, ...clear } = rest;` — o modo recolhe o painel rápido ao seu chip, para nenhuma alça ficar sob ele.
13. `src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };` — o `mode` novo entra no estado do editor (ou sai, em `none`) [escreve: EST-L01-037 via run].
14. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store junta o `ui` novo ao estado do comando.
15. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a mudança do `ui` basta para o estado ser publicado.
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (sem patches) [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/canvas/edit-mode.ts:32` `if (editMode(state.ui) === mode) return { kind: 'change' };` — `mode` igual ao atual: `change` sem tocar no `ui`; diferente: segue para o passo 11.
- R2 `src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };` — `mode` `none`: o campo `editMode` sai do `ui`; outro: entra com o modo novo.
- R3 `src/editor/canvas/edit-mode.ts:41` `  (state, args) => editMode(state.ui) === args.mode,` — o estado do controle (pressionado) é o `mode` igual ao atual; não muda o caminho do tratador.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/edit-mode.ts:29` `export const setEditMode = registerHandler<'canvas.setEditMode', EditorUi>(`) e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via run, editMode), EST-L05a-001 (a digitação pendente).
- Escreve: EST-L01-037 (o estado do editor, via run, publish). Nenhum documento muda.

## Resultado
- **Estado final:** o `ui.editMode` fica com o modo escolhido ou sai (`src/editor/canvas/edit-mode.ts:39` `return { kind: 'change', ui: mode === NO_MODE ? rest : { ...clear, editMode: mode } };`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o canvas passa a desenhar as alças do modo; o painel rápido fica recolhido ao chip (`src/editor/canvas/edit-mode.ts:37` `const { quickPanelOpen: _folded, ...clear } = rest;`).
- **DOM do canvas:** nada muda no documento desenhado; só o chrome das alças do modo aparece ou some.

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
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/edit-mode.ts:29`).

## Medições
- nenhuma — o trecho não chama API de medida; o modo é estado do editor.
