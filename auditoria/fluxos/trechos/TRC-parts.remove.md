# TRC-parts.remove
- **Chamada:** `src/app/commands.ts:255` `'parts.remove': removePartCommand,`
- **Argumentos:** o tratador recebe `{ target }` — o nó da peça a remover (node).
- **Ramos que dependem dos argumentos:** R1 (o alvo e seu pai).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/parts.ts:108` `export const removePartCommand = registerHandler('parts.remove', ({ state }, { target }): Outcome<never> => {` — o tratador recebe o estado e o alvo.
3. `src/core/elements/parts.ts:109` `const at = locate(state.document, target);` [lê: EST-L01-030 via locate]
4. `src/core/elements/parts.ts:111` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/parts.ts:115` `const released = releaseReferencesPatch(state.document, subtreeIds(at.node));` — o que aponta para a peça sai com ela. [lê: EST-L01-030 via releaseReferencesPatch]
6. `src/core/elements/parts.ts:116` `return { kind: 'change', patches: [...released, { op: 'remove', path: at.path }], selection: [at.parent.id], message: message('status.parts.removed', { part: at.node.name, name: at.parent.name }) };` [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/parts.ts:110` `if (at === null || at.parent === null) return { kind: 'refused', message: argumentRefused('target') };` — alvo ausente ou sem pai: recusa; com pai: segue.
- R2 `src/core/elements/parts.ts:111` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 112): recusa; livre: segue.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento: a peça, o pai, as referências que a ela levam, via locate, lockRefusal, releaseReferencesPatch)
- escreve: EST-L01-030 (o documento: a peça removida de seu pai, via run), EST-L01-031 (a seleção no dono, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com a peça removida de seu pai, EST-L01-031 com a seleção no dono e EST-L01-033 com a mensagem `status.parts.removed`, por `src/core/elements/parts.ts:116` `return { kind: 'change', patches: [...released, { op: 'remove', path: at.path }], selection: [at.parent.id], message: message('status.parts.removed', { part: at.node.name, name: at.parent.name }) };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; a seleção fica no dono pelo campo `selection` do resultado.
- **DOM do canvas:** o iframe redesenha o dono sem a peça pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava a estrutura do nó, não um valor de estilo `src/core/elements/parts.ts:116` `return { kind: 'change', patches: [...released, { op: 'remove', path: at.path }], selection: [at.parent.id], message: message('status.parts.removed', { part: at.node.name, name: at.parent.name }) };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/parts.ts:108` `export const removePartCommand = registerHandler('parts.remove', ({ state }, { target }): Outcome<never> => {`
- G4: n/a — a porta é o botão de remover do inspetor, não um ponto do canvas `manifest/commands/elements.json:5309` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/parts.ts:116` `return { kind: 'change', patches: [...released, { op: 'remove', path: at.path }], selection: [at.parent.id], message: message('status.parts.removed', { part: at.node.name, name: at.parent.name }) };`.
- G6: ok — a seleção fica no dono pelo campo `selection` do resultado `src/core/elements/parts.ts:116` `return { kind: 'change', patches: [...released, { op: 'remove', path: at.path }], selection: [at.parent.id], message: message('status.parts.removed', { part: at.node.name, name: at.parent.name }) };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
