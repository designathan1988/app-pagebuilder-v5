# TRC-style.resetAll
- **Chamada:** `src/app/commands.ts:425` `'style.resetAll': resetAllCommand,`
- **Argumentos:** nenhum campo variável — o tipo é `Record<string, never>`; o tratador recebe só o contexto (o primeiro parâmetro), como o manifesto declara (`manifest/commands/style.json:9587` `"id": "style.resetAll",`).
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/app/commands.ts:425` `'style.resetAll': resetAllCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `hasSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/reset.ts:46` `export const resetAllCommand = registerHandler('style.resetAll', (context) => {` — o tratador recebe só o contexto.
8. `src/core/style/reset.ts:48` `const nodes = state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos escritos são achados [lê: EST-L01-030 via locate].
9. `src/core/style/reset.ts:51` `const locked = firstLockRefusal(state.document, nodes.map((found) => found.node.id as NodeId), 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
10. `src/core/style/reset.ts:53` `const holders = styleHolders(context, nodes);` — os detentores escritos são achados.
11. `src/core/style/reset.ts:54` `const patches: Patch[] = holders.filter((held) => Object.keys(held.node.styles).length > 0).map((held) => ({ op: 'replace', path: [...held.path, 'styles'], value: {} }));` — cada detentor com estilos fica sem nenhum [escreve: EST-L01-030 via run].
12. `src/core/style/reset.ts:55` `if (holders.length > 1) return { kind: 'change', patches, message: message('status.style.resetAllMany', { count: holders.length }) };` — vários elementos: a mensagem nomeia a contagem; um só: nomeia o elemento.
13. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
14. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — seleção vazia: recusa `refusal.nothingSelected`; com seleção: segue.
- R2 `src/core/style/reset.ts:50` `if (primary === undefined) return { kind: 'change' };` — seleção vazia: `change` sem patch; com seleção: segue.
- R3 `src/core/style/reset.ts:52` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado, ou dentro de um: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/style/reset.ts:54` `const patches: Patch[] = holders.filter((held) => Object.keys(held.node.styles).length > 0).map((held) => ({ op: 'replace', path: [...held.path, 'styles'], value: {} }));` — cada detentor que guarda estilos fica sem nenhum; um detentor sem estilos não entra.
- R5 `src/core/style/reset.ts:55` `if (holders.length > 1) return { kind: 'change', patches, message: message('status.style.resetAllMany', { count: holders.length }) };` — vários detentores: mensagem `status.style.resetAllMany`; um só: `status.style.resetAll` (`src/core/style/reset.ts:56`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/reset.ts:46`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os estilos dos detentores ficam vazios em todos os breakpoints e estados (`src/core/style/reset.ts:54`), em uma transação e um passo de desfazer; a mensagem é `status.style.resetAll` ou `status.style.resetAllMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; os campos do inspector passam a exibir os valores herdados.
- **DOM do canvas:** o iframe desenha os elementos sem estilos próprios pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a remoção usa a camada do contexto capturado (`src/core/style/reset.ts:37` `    return writeDeclarations(held.node, held.path, rules.base, removed);`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:425` `'style.resetAll': resetAllCommand,` — as portas entregam os mesmos argumentos vazios ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/reset.ts:56`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/reset.ts:56`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/reset.ts:46`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
