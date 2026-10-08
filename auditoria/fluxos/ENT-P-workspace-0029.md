# ENT-P-workspace-0029 — workspace.toggleInspector pela porta workspace.toggleInspector#key-ctrl-alt-b-in-global
- **Comando:** workspace.toggleInspector
- **Porta:** `key-ctrl-alt-b-in-global`
- **Trecho:** TRC-workspace.toggleInspector

## Passos
1. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a tecla resolve a ligação do acorde no contexto do foco.
2. `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — a tecla só roda se o comando está construído.
3. `src/editor/input/keymap.ts:514` `: focusedArgs(event.target, binding);` — os argumentos vêm do controle em foco quando ele é do mesmo comando.
4. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto da porta entram sobre os do foco.
5. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o despacho entra na store do editor (o Início da porta).
6. `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/input/keymap.ts:487` `if (!binding) return;` — sem ligação do acorde na cadeia de contextos a tecla não faz nada.
- `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — com o comando construído a tecla roda; caso contrário para.
- `src/editor/input/keymap.ts:515` `if (own === null) return;` — um controle do mesmo comando indisponível deixa a tecla sem efeito.
- `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — sem argumento de área de transferência (`clipboard` indefinido), o despacho é imediato (linha 531).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`), sem await, temporizador nem ouvinte.

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
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:109` `export const toggleInspector = registerHandler<'workspace.toggleInspector', EditorUi>(` — a porta envia só a intenção sem argumentos; o tratador é o mesmo de todas as portas do comando workspace.toggleInspector.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:113` `return { kind: 'change', ui: withInspector(state.ui, open), message: message(open ? 'status.inspector.shown' : 'status.inspector.hidden') };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.toggleInspector
- **Argumentos enviados:** nenhum
- nenhum — os argumentos do comando não mudam o caminho do tratador: a porta envia só a intenção.
