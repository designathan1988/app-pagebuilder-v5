# ENT-P-workspace-0113 — quickPanel.setOpen pela porta quickPanel.setOpen#key-ctrl-shift-q-in-global

- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:3763` `"kind": "shortcut",`
- **Porta:** `manifest/commands/workspace.json:3762` `"id": "key-ctrl-shift-q-in-global",`
- **Gatilho:** `manifest/commands/workspace.json:3764` `"chord": "Ctrl+Shift+Q",`
- **Tratador:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`

## Passos
1. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — de onde a intenção sai: o gesto aberto, a rajada de letras ou a store do editor
2. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do contexto e os da porta são unidos em `given`
3. `src/editor/input/keymap.ts:528` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — um atalho com gesto escala o valor; sem gesto, os argumentos ficam como estão
4. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — sem argumento de área de transferência: a intenção é despachada
5. `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,` — a tabela liga o id ao tratador; o trecho TRC-quickPanel.setOpen começa aqui

## Ramos
- R1 `src/editor/quick-panel/quick-panel.ts:52` `const next = open === 'toggle' ? !now : open === 'open';` — `toggle`: inverte; `open`: abre; `close`: fecha.
- R2 `src/editor/quick-panel/quick-panel.ts:53` `if (next === now) return { kind: 'change' };` — o estado já é o pedido: mudança vazia, sem tocar `ui`; diferente segue para o passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/quick-panel/quick-panel.ts:50` `export const setOpen = registerHandler<'quickPanel.setOpen', EditorUi>('quickPanel.setOpen', ({ state }, { open }) => {`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.quickPanelOpen`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.quickPanelOpen`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.quickPanelOpen` verdadeiro ou ausente conforme `open` (`src/editor/quick-panel/quick-panel.ts:54`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** o painel rápido abre ou volta a ser a sua alça (`src/editor/quick-panel/quick-panel.ts:54`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/quick-panel/quick-panel.ts:54`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/quick-panel/quick-panel.ts:50` `export const setOpen = registerHandler<'quickPanel.setOpen', EditorUi>('quickPanel.setOpen', ({ state }, { open }) => {` — as portas (alça do painel, Ctrl+Shift+Q global e no painel, Esc no painel) chegam ao mesmo tratador com só `open`.
- G4: n/a — o comando muda estado; o painel que ele abre fica ao lado do rótulo (`src/editor/quick-panel/quick-panel.ts:54`); a colocação é medida na Fase 6.
- G5: n/a — o encaixe do painel rápido alto é medido na Fase 6 (`src/editor/quick-panel/quick-panel.ts:54`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/quick-panel/quick-panel.ts:54`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/quick-panel/quick-panel.ts:51`).

## Medições
- a medir na Fase 6: o encaixe do painel rápido aberto (alto, com campos) sobre o palco, nas duas telas (famílias `cut`, `off-window`, `covered`, `sideways`).

## Ramos do trecho
- **Trecho:** TRC-quickPanel.setOpen
- **Argumentos enviados:** o manifesto declara `open` `toggle`
- R1 `src/editor/quick-panel/quick-panel.ts:52` `const next = open === 'toggle' ? !now : open === 'open';` — esta porta envia `open` `toggle`: inverte o painel.
- R2 `src/editor/quick-panel/quick-panel.ts:53` `if (next === now) return { kind: 'change' };` — com o painel já no estado pedido o caminho passa pelo lado da mudança vazia; diferente, pelo lado que grava.
