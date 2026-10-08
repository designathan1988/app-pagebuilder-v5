# TRC-style.setCustomDeclarations
- **Chamada:** `src/app/commands.ts:422` `'style.setCustomDeclarations': setCustomDeclarationsCommand,`
- **Argumentos:** `{ declarations: string, target?: node }` — `declarations` é o texto "propriedade: valor;" de cada uma; `target` o nó, opcional, como o manifesto declara (`manifest/commands/style.json:9402` `"id": "style.setCustomDeclarations",`).
- **Ramos que dependem dos argumentos:** R1 (o `target`), R3 (o texto que não é declaração).

## Passos
1. `src/app/commands.ts:422` `'style.setCustomDeclarations': setCustomDeclarationsCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/inspector.tsx:502` `(store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(command, { ...args, [filled]: text });` — o campo das declarações entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/custom.ts:68` `export const setCustomDeclarationsCommand = registerHandler('style.setCustomDeclarations', (context, { declarations, target }): Outcome<never> => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/custom.ts:70` `const id = (target as NodeId | undefined) ?? (state.selection.length === 1 ? state.selection[0] : undefined);` — o nó é o `target` ou o único selecionado [lê: EST-L01-031 via handlerContext].
9. `src/core/style/custom.ts:72` `const at = locate(state.document, id);` — o nó é achado [lê: EST-L01-030 via locate].
10. `src/core/style/custom.ts:74` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — a trava do nó é lida [lê: EST-L01-030 via lockRefusal].
11. `src/core/style/custom.ts:76` `const parsed = parseDeclarations(String(declarations), context);` — o texto vira declarações pelo dono único do formato.
12. `src/core/style/custom.ts:78` `const { breakpoint, state: base } = rules.base;` — a camada escrita é a que o editor mostra [lê: EST-L01-037 via handlerContext].
13. `src/core/style/custom.ts:86` `return { kind: 'change' as const, patches: replaceLayer(context, at, wanted), message: said };` — o detentor é reescrito inteiro pela camada nova.
14. `src/core/style/set.ts:84` `    return writeDeclarations(held.node, held.path, layer, { ...cleared, ...wanted });` — as declarações são escritas no detentor [escreve: EST-L01-030 via writeDeclarations].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/custom.ts:71` `if (id === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem `target` e sem exatamente um selecionado: recusa `status.needsSingleSelection`; com um nó: segue.
- R2 `src/core/style/custom.ts:73` `if (at === null) throw new Error(` — o nó nomeado não está no documento: lança o defeito; está: segue.
- R3 `src/core/style/custom.ts:75` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/style/custom.ts:77` `if ('refused' in parsed) return { kind: 'refused', message: parsed.refused };` — peça que não é declaração (`status.css.notDeclaration`), propriedade desconhecida (`status.css.unknownProperty`), valor com chaves (`status.css.badValue`) ou endereço inseguro: recusa; texto bom: segue.
- R5 `src/core/style/custom.ts:84` `if (same) return { kind: 'change', message: said };` — as declarações já são as mesmas: `change` sem patch; diferentes: escreve pela camada nova.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/custom.ts:68`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o elemento do `target` fica com as declarações do texto na camada `rules.base` (`src/core/style/custom.ts:86`); uma propriedade deixada fora sai, uma escrita entra; em uma transação e um passo de desfazer. A mensagem é `status.style.declarationsSet`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo das declarações passa a exibir o texto novo.
- **DOM do canvas:** o iframe desenha o elemento com as declarações novas pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/custom.ts:78` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:422` `'style.setCustomDeclarations': setCustomDeclarationsCommand,` — as portas entregam o mesmo texto ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/custom.ts:86`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/custom.ts:86`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/custom.ts:68`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
