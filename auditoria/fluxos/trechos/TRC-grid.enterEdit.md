# TRC-grid.enterEdit
- **Chamada:** `src/app/commands.ts:410` `'grid.enterEdit': enterGridEdit,`
- **Argumentos:** `{ target?: node }` — o nó da grelha, opcional; sem ele, o primeiro selecionado, como o manifesto declara (`manifest/commands/style.json:10619` `"id": "grid.enterEdit",`).
- **Ramos que dependem dos argumentos:** R2 (o `target` ausente cai no primeiro selecionado).

## Passos
1. `src/app/commands.ts:410` `'grid.enterEdit': enterGridEdit,` — a tabela liga o id ao tratador.
2. `src/editor/input/pointer/events.ts:44` `gesture.dispatch(entry.command.id as CommandId, argsFor(entry, press, pickingOf(store.getState().ui)) as never);` — o clique duplo no canvas entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/canvas/grid-edit.ts:39` `export const enterGridEdit = registerHandler<'grid.enterEdit', EditorUi>('grid.enterEdit', ({ state, rules }, { target }) => {` — o tratador é registrado para o estado do editor.
8. `src/editor/canvas/grid-edit.ts:40` `const node = (target as NodeId | undefined) ?? state.selection[0];` — o nó é o `target` ou o primeiro selecionado [lê: EST-L01-031 via handlerContext].
9. `src/editor/canvas/grid-edit.ts:41` `const found = node === undefined ? null : locate(state.document, node);` — o nó é achado [lê: EST-L01-030 via locate].
10. `src/editor/canvas/grid-edit.ts:43` `if (!isGridContainer(found.node, rules, state.document.classes)) return { kind: 'refused', message: message('status.gridEdit.notGrid', { name: found.node.name }) };` — o nó precisa ser contêiner de grelha [lê: EST-L01-030 via isGridContainer].
11. `src/editor/canvas/grid-edit.ts:45` `return { kind: 'change', ui: { ...state.ui, gridEdit: found.node.id as NodeId } };` — o nó entra no `ui.gridEdit` [escreve: EST-L01-037 via run].
12. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` mudou, então o estado muda [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run].
13. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (o `ui` novo) [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/canvas/grid-edit.ts:42` `if (found === null) return { kind: 'change' };` — sem nó (nada selecionado, ou `target` que não está no documento): `change` sem mudança; com: segue.
- R2 `src/editor/canvas/grid-edit.ts:40` `const node = (target as NodeId | undefined) ?? state.selection[0];` — com `target`: é ele; sem: o primeiro selecionado.
- R3 `src/editor/canvas/grid-edit.ts:43` `if (!isGridContainer(found.node, rules, state.document.classes)) return { kind: 'refused', message: message('status.gridEdit.notGrid', { name: found.node.name }) };` — nó que não é contêiner de grelha: recusa `status.gridEdit.notGrid`; é: segue.
- R4 `src/editor/canvas/grid-edit.ts:44` `if (state.ui.gridEdit === found.node.id) return { kind: 'change' };` — a grelha já está aberta: `change` sem mudança; outra: o passo 11 escreve o `ui`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/grid-edit.ts:39`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, locate, isGridContainer, commit), EST-L01-031 (a seleção, via handlerContext, run, commit), EST-L01-033 (a mensagem, via run), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (o `ui.gridEdit`, via run, publish).

## Resultado
- **Estado final:** `ui.gridEdit` fica com o id do nó da grelha (`src/editor/canvas/grid-edit.ts:45`); o documento e a seleção não mudam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`). A mensagem não muda.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o chrome do canvas desenha os números de coluna e as alças da grelha enquanto o editor está ligado.
- **DOM do canvas:** nada muda — o comando não devolve patch e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento; escreve só o estado do editor (`src/editor/canvas/grid-edit.ts:45`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
