# ENT-P-workspace-0026 — workspace.toggleLeftDock pela porta workspace.toggleLeftDock#key-ctrl-b-in-global
- **Comando:** workspace.toggleLeftDock
- **Porta:** `key-ctrl-b-in-global`
- **Trecho:** TRC-workspace.toggleLeftDock

## Passos
1. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a tecla resolve a ligação do acorde no contexto do foco.
2. `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — a tecla só roda se o comando está construído.
3. `src/editor/input/keymap.ts:514` `: focusedArgs(event.target, binding);` — os argumentos vêm do controle em foco quando ele é do mesmo comando.
4. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto da porta entram sobre os do foco.
5. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o despacho entra na store do editor (o Início da porta).
6. `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,` — a store resolve o id na tabela de comandos, que o liga ao tratador; a Chamada do trecho.

## Ramos
- `src/editor/input/keymap.ts:487` `if (!binding) return;` — sem ligação do acorde na cadeia de contextos a tecla não faz nada.
- `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — com o comando construído a tecla roda; caso contrário para.
- `src/editor/input/keymap.ts:515` `if (own === null) return;` — um controle do mesmo comando indisponível deixa a tecla sem efeito.
- `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — sem argumento de área de transferência (`clipboard` indefinido), o despacho é imediato (linha 531).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`), sem await, temporizador nem ouvinte.

## Estado
- lê: EST-L01-037 (`ui.panels.sidebar`), EST-L05a-001 (digitação pendente).
- escreve: EST-L01-037 (`ui.panels.sidebar`).

## Resultado
- **Estado final:** EST-L01-037 com `ui.panels.sidebar` oposto ao anterior (`src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };`); o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham a casca.
- **DOM do editor:** a coluna da barra lateral aparece ou some (`src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };`).
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando escreve só estado do editor, fora de qualquer camada de estilo (`src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/workspace/panels.ts:95` `export const toggleLeftDock = registerHandler<'workspace.toggleLeftDock', EditorUi>(` — a porta envia só a intenção sem argumentos; o tratador é o mesmo de todas as portas do comando workspace.toggleLeftDock.
- G4: n/a — o comando muda estado; nada é desenhado sobre o canvas no ponto da ação (`src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };`).
- G5: n/a — o encaixe dos painéis é medido na Fase 6 (`src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {`
- INT: n/a — nenhum esquema, id ou referência do documento é tocado (`src/editor/workspace/panels.ts:99` `return { kind: 'change', ui: { ...state.ui, panels: { ...state.ui.panels, sidebar } }, message: message(sidebar ? 'status.sidebar.shown' : 'status.sidebar.hidden') };`).

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, temporizador nem observador (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).

## Medições
- nenhuma — a porta não lê valores que só o navegador calcula; o encaixe é medido na Fase 6.

## Ramos do trecho
- **Trecho:** TRC-workspace.toggleLeftDock
- **Argumentos enviados:** nenhum
- nenhum — os argumentos do comando não mudam o caminho do tratador: a porta envia só a intenção.
