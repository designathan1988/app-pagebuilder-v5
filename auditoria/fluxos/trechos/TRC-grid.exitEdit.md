# TRC-grid.exitEdit
- **Chamada:** `src/app/commands.ts:411` `'grid.exitEdit': exitGridEdit,`
- **Argumentos:** nenhum campo variável — o tipo é `Record<string, never>`; o tratador recebe só o contexto (o primeiro parâmetro), como o manifesto declara (`manifest/commands/style.json:10689` `"id": "grid.exitEdit",`).
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/app/commands.ts:411` `'grid.exitEdit': exitGridEdit,` — a tabela liga o id ao tratador.
2. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o Esc do contexto da grelha entrega a intenção.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/canvas/grid-edit.ts:48` `export const exitGridEdit = registerHandler<'grid.exitEdit', EditorUi>('grid.exitEdit', ({ state }) => {` — o tratador é registrado para o estado do editor.
8. `src/editor/canvas/grid-edit.ts:49` `if (state.ui.gridEdit === undefined) return { kind: 'change' };` — sem editor ligado: `change` sem mudança [lê: EST-L01-037 via handlerContext].
9. `src/editor/canvas/grid-edit.ts:50` `const { gridEdit: _left, ...rest } = state.ui;` — o campo `gridEdit` é separado do resto do estado do editor.
10. `src/editor/canvas/grid-edit.ts:52` `return { kind: 'change', ui: rest };` — o `ui` sem `gridEdit` é devolvido [escreve: EST-L01-037 via run].
11. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` mudou, então o estado muda [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (o `ui` novo) [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/canvas/grid-edit.ts:49` `if (state.ui.gridEdit === undefined) return { kind: 'change' };` — nenhum editor de grelha ligado: `change` sem mudança; ligado: segue para o passo 9.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/grid-edit.ts:48`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, commit), EST-L01-031 (a seleção, via run, commit), EST-L01-033 (a mensagem, via run), EST-L01-037 (o estado do editor, via handlerContext, run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (o `ui.gridEdit`, via run, publish).

## Resultado
- **Estado final:** `ui.gridEdit` sai do estado do editor (`src/editor/canvas/grid-edit.ts:52`); o documento e a seleção não mudam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** o chrome do canvas deixa de desenhar os números de coluna e as alças da grelha.
- **DOM do canvas:** nada muda — o comando não devolve patch e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento; escreve só o estado do editor (`src/editor/canvas/grid-edit.ts:52`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:411` `'grid.exitEdit': exitGridEdit,` — as portas entregam os mesmos argumentos vazios ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/canvas/grid-edit.ts:52`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/canvas/grid-edit.ts:52`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: n/a — o trecho não escreve no documento; só o `ui` muda (`src/editor/canvas/grid-edit.ts:52`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/grid-edit.ts:48`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
