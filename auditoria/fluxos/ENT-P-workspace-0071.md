# ENT-P-workspace-0071 — commandBar.open pela porta commandBar.open#key-ctrl-shift-k-in-text-editing

- **Tipo:** comando-porta shortcut `manifest/commands/workspace.json:2084` `"kind": "shortcut",`
- **Porta:** `manifest/commands/workspace.json:2083` `"id": "key-ctrl-shift-k-in-text-editing",`
- **Gatilho:** `manifest/commands/workspace.json:2086` `"chord": "Ctrl+Shift+K",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`

## Passos
1. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — de onde a intenção sai: o gesto aberto, a rajada de letras ou a store do editor
2. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do contexto e os da porta são unidos em `given`
3. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — um atalho com gesto escala o valor; sem gesto, os argumentos ficam como estão
4. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — sem argumento de área de transferência: a intenção é despachada
5. `src/app/commands.ts:491` `'commandBar.open': openCommandBar,` — a tabela liga o id ao tratador; o trecho TRC-commandBar.open começa aqui

## Ramos
- R1 `src/editor/command-bar/command-bar.ts:16` `state.ui.commandBar === true ? { kind: 'change' }` — a barra já está aberta: mudança vazia, sem tocar `ui`; fechada, segue para o passo 7.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/command-bar/command-bar.ts:16` `export const openCommandBar = registerHandler<'commandBar.open', EditorUi>('commandBar.open', ({ state }) => (state.ui.commandBar === true ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, commandBar: true } }));`), sem `await`, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.commandBar`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.commandBar`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.commandBar` verdadeiro (`src/editor/command-bar/command-bar.ts:16`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca e a barra aparece.
- **DOM do editor:** a barra de comandos abre e o seu campo de busca toma o foco (efeito da casca, medido na Fase 6).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/command-bar/command-bar.ts:16`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/command-bar/command-bar.ts:16` `export const openCommandBar = registerHandler<'commandBar.open', EditorUi>('commandBar.open', ({ state }) => (state.ui.commandBar === true ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, commandBar: true } }));` — as portas (Ctrl+K, Ctrl+Shift+K global e na edição de texto, campo da barra de topo, menu Arquivo) chegam ao mesmo tratador sem argumentos.
- G4: n/a — o comando muda estado; a barra flutua sobre a área do editor e o seu cobrimento é medido na Fase 6 (`src/editor/command-bar/command-bar.ts:16`).
- G5: n/a — o encaixe da barra de comandos é medido na Fase 6 (`src/editor/command-bar/command-bar.ts:16`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/command-bar/command-bar.ts:16`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, temporizador nem observador (`src/editor/command-bar/command-bar.ts:16`).

## Medições
- a medir na Fase 6: a ordem de foco ao abrir a barra (o campo de busca toma o foco) e o seu encaixe, nas duas telas (famílias `cut`, `off-window`, `covered`, `english`).

## Ramos do trecho
- **Trecho:** TRC-commandBar.open
- **Argumentos enviados:** a porta não envia argumento
- nenhum — o trecho TRC-commandBar.open não lista ramo que dependa dos argumentos; o tratador decide só pelo estado `src/editor/command-bar/command-bar.ts:16` `export const openCommandBar = registerHandler<'commandBar.open', EditorUi>('commandBar.open', ({ state }) => (state.ui.commandBar === true ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, commandBar: true } }));`.
