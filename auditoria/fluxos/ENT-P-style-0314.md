# ENT-P-style-0314

Porta `canvas-double-click-grid-container` do comando `grid.enterEdit` (tipo comando-porta canvas-click). O trecho do comando é `TRC-grid.enterEdit`.

## Passos
1. `src/editor/input/pointer/events.ts:44` `gesture.dispatch(entry.command.id as CommandId, argsFor(entry, press, pickingOf(store.getState().ui)) as never);` — o clique duplo no canvas despacha `grid.enterEdit`.
2. `src/editor/input/pointer/events.ts:43` `const gesture = store.gesture();` — o gesto usado foi aberto na store do editor.
3. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir o gesto [lê: EST-L05a-001 via keepTyping].
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor encaminha o despacho ao gesto da store do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:410` `'grid.enterEdit': enterGridEdit,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/store.ts:218` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — com um grupo de comandos aberto, o gesto encaminha ao `dispatch` da store; sem ele, abre um gesto próprio do núcleo.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- nenhuma — o caminho do despacho até a linha da tabela não tem `await`, timer nem ouvinte (a porta dispara de um evento já recebido).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.gridEdit`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (`ui.gridEdit`).

## Resultado
- **Estado final:** `ui.gridEdit` fica com o id do nó da grelha (`src/editor/canvas/grid-edit.ts:45`); o documento e a seleção não mudam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`). A mensagem não muda.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o chrome do canvas desenha os números de coluna e as alças da grelha enquanto o editor está ligado.
- **DOM do canvas:** nada muda — o comando não devolve patch e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento; escreve só o estado do editor (`src/editor/canvas/grid-edit.ts:45`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:410` `'grid.enterEdit': enterGridEdit,` — as portas entregam o mesmo `target` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/canvas/grid-edit.ts:45`); o chrome da grelha deriva do `ui`.
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/canvas/grid-edit.ts:45`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: n/a — o trecho não escreve no documento; só o `ui` muda (`src/editor/canvas/grid-edit.ts:45`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/grid-edit.ts:39`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-grid.enterEdit
- **Argumentos enviados:** nenhum campo — o nó é o primeiro selecionado (o clique duplo não manda `target`).
- R2 `src/editor/canvas/grid-edit.ts:40` `const node = (target as NodeId | undefined) ?? state.selection[0];` — o clique duplo não manda `target`: o nó é o primeiro selecionado.
