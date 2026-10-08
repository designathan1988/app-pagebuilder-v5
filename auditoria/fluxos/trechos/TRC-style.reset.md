# TRC-style.reset
- **Chamada:** `src/app/commands.ts:424` `'style.reset': resetValueCommand,`
- **Argumentos:** `{ property: property }` — a propriedade a tirar, como o manifesto declara (`manifest/commands/style.json:9529` `"id": "style.reset",`).
- **Ramos que dependem dos argumentos:** R2 (a `property` de um composto tira os longhands).

## Passos
1. `src/app/commands.ts:424` `'style.reset': resetValueCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta do Reset entrega a intenção.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/reset.ts:44` `export const resetValueCommand = registerHandler('style.reset', (context, { property }) => removeStyle(context, property));` — o tratador entrega a propriedade a `removeStyle`.
8. `src/core/style/reset.ts:20` `const nodes = state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos escritos são achados [lê: EST-L01-030 via locate].
9. `src/core/style/reset.ts:23` `const locked = firstLockRefusal(state.document, nodes.map((found) => found.node.id as NodeId), 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
10. `src/core/style/reset.ts:25` `const names = rules.compositeFacts.get(property)?.longhands ?? [property];` — um composto tira os seus longhands; o mais tira a própria propriedade [lê: EST-L01-037 via handlerContext].
11. `src/core/style/reset.ts:27` `const holders = styleHolders(context, nodes);` — os detentores escritos são achados.
12. `src/core/style/reset.ts:37` `    return writeDeclarations(held.node, held.path, rules.base, removed);` — cada declaração sai pela via de declarações [escreve: EST-L01-030 via writeDeclarations].
13. `src/core/style/reset.ts:40` `if (holders.length > 1) return { kind: 'change', patches, message: message('status.style.resetMany', { property: propertyName(property, rules), count: holders.length }) };` — vários elementos: a mensagem nomeia a contagem; um só: nomeia o elemento.
14. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
15. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/reset.ts:22` `if (primary === undefined) return { kind: 'change' };` — seleção vazia: `change` sem patch; com seleção: segue.
- R2 `src/core/style/reset.ts:24` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado, ou dentro de um: recusa `status.locked.edit`; livre: segue.
- R3 `src/core/style/reset.ts:25` `const names = rules.compositeFacts.get(property)?.longhands ?? [property];` — a `property` é um composto: tira cada longhand; é simples: tira ela mesma. Uma declaração que uma coupling encheu e ainda guarda o valor que ela escreveu sai com o seu gatilho (`src/core/style/reset.ts:35` `    if (storedValue(held.node, effect.property, rules) === effect.value) removed[effect.property] = null;`).
- R4 `src/core/style/reset.ts:40` `if (holders.length > 1) return { kind: 'change', patches, message: message('status.style.resetMany', { property: propertyName(property, rules), count: holders.length }) };` — vários detentores: mensagem `status.style.resetMany`; um só: `status.style.reset` (`src/core/style/reset.ts:41`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/reset.ts:44`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a propriedade (ou os longhands do composto) sai dos estilos dos detentores na camada `rules.base` (`src/core/style/reset.ts:37`), em uma transação e um passo de desfazer; a mensagem é `status.style.reset` ou `status.style.resetMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do Reset passa a exibir o valor herdado ou o padrão.
- **DOM do canvas:** o iframe desenha o elemento sem a propriedade pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a remoção usa a camada do contexto capturado (`src/core/style/reset.ts:37` `    return writeDeclarations(held.node, held.path, rules.base, removed);`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:424` `'style.reset': resetValueCommand,` — as portas entregam a mesma `property` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/reset.ts:41`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/reset.ts:41`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/reset.ts:44`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
