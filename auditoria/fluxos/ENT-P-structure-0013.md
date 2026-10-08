# ENT-P-structure-0013 — drag.cancel pela porta key-escape-in-color-picker
## Passos
1. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta key-escape-in-color-picker despacha o comando e os argumentos quando não há área de transferência — o Início da porta.
2. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — há um gesto aberto (o arraste, ou a sessão do seletor de cor), então `dispatch` é o do gesto.
3. `src/editor/input/keymap.ts:412` `const gesture = openGesture(store);` — `openGesture` dá o gesto aberto agora.
4. `src/editor/input/pointer/common.ts:355` `export function openGesture(store: EditorStore): { readonly context: KeyContextId; readonly gesture: Gesture } | null {` — `openGesture` devolve o contexto e o gesto aberto da store do editor.
5. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto da store do editor encaminha o despacho ao gesto do núcleo.
6. `src/editor/store.ts:219` `const gesture = store.gesture();` — o gesto do núcleo foi aberto por `store.gesture()`.
7. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
8. `src/core/store/store.ts:720` `return run(id, args, current);` — chama a regra única de execução dentro do gesto.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
10. `src/app/commands.ts:369` `'drag.cancel': cancelDrag,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/input/keymap.ts:412` `const gesture = openGesture(store);` — a tecla só está neste contexto com um gesto aberto (o arraste, ou a sessão do seletor de cor): o despacho é o do gesto.
- R2 `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — gesto aberto: o `dispatch` é o do gesto; sem gesto, seria o `store.dispatch`.
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via keepTyping)
- escreve: EST-L01-037 (o estado do editor, via run), EST-L01-033 (a mensagem, via run)
## Resultado
- **Estado final:** EST-L01-037 com `ui.drag.cancels` um a mais (`src/editor/drag/drag-session.ts:126` `ui: { ...state.ui, drag: { ...state.ui.drag, cancels: state.ui.drag.cancels + 1 } },`); o documento e a seleção não mudam; EST-L01-033 com a mensagem `status.drag.cancelled` (`src/editor/drag/drag-session.ts:127` `message: message('status.drag.cancelled'),`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; o dono do ponteiro, ao ver a contagem nova, termina o arraste do seu gesto.
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.
## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui` (`src/app/commands.ts:369` `'drag.cancel': cancelDrag,`).
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes do gesto.
- G3: ok `src/app/commands.ts:369` `'drag.cancel': cancelDrag,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:369` `'drag.cancel': cancelDrag,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:369` `'drag.cancel': cancelDrag,`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`).
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
## Ramos do trecho
- **Trecho:** TRC-drag.cancel
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-drag.cancel` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:371` `"args": {},`); esta porta manda a intenção vazia.
