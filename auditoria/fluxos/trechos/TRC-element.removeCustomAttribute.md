# TRC-element.removeCustomAttribute
- **Chamada:** `src/app/commands.ts:248` `'element.removeCustomAttribute': removeCustomAttributeCommand,`
- **Argumentos:** o tratador recebe `{ name }` — o nome do atributo a remover (string).
- **Ramos que dependem dos argumentos:** R3 (o atributo não está no nó).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/attributes.ts:297` `export const removeCustomAttributeCommand = registerHandler('element.removeCustomAttribute', ({ state }, { name }): Outcome<never> => {` — o tratador recebe o estado e o nome.
3. `src/core/elements/attributes.ts:298` `const at = oneSelected(state);` [lê: EST-L01-030 via oneSelected] [lê: EST-L01-031 via oneSelected]
4. `src/core/elements/attributes.ts:300` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/attributes.ts:304` `const custom = Object.fromEntries(Object.entries(at.node.customAttributes ?? {}).filter(([n]) => n !== name));` — os atributos sem o removido.
6. `src/core/elements/attributes.ts:306` `return { kind: 'change', patches: [Object.keys(custom).length === 0 ? { op: 'remove', path } : { op: 'replace', path, value: custom }], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/attributes.ts:299` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um único elemento selecionado: recusa; com ele: segue.
- R2 `src/core/elements/attributes.ts:300` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 301): recusa; livre: segue.
- R3 `src/core/elements/attributes.ts:303` `if (!(name in (at.node.customAttributes ?? {}))) return { kind: 'change', message: said };` — o atributo não está no nó: resultado sem patches; está: segue.
- R4 `src/core/elements/attributes.ts:306` `return { kind: 'change', patches: [Object.keys(custom).length === 0 ? { op: 'remove', path } : { op: 'replace', path, value: custom }], message: said };` — sem nenhum atributo restante remove a coleção inteira; com outros, troca a lista.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, oneSelected, lockRefusal), EST-L01-031 (a seleção, via handlerContext, oneSelected), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 sem o atributo em `customAttributes` do nó por `src/core/elements/attributes.ts:306` `return { kind: 'change', patches: [Object.keys(custom).length === 0 ? { op: 'remove', path } : { op: 'replace', path, value: custom }], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/attributes.ts:302`).
- **DOM do canvas:** o iframe redesenha o elemento sem o atributo pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava atributos do nó, não um valor de estilo `src/core/elements/attributes.ts:306` `return { kind: 'change', patches: [Object.keys(custom).length === 0 ? { op: 'remove', path } : { op: 'replace', path, value: custom }], message: said };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/attributes.ts:297` `export const removeCustomAttributeCommand = registerHandler('element.removeCustomAttribute', ({ state }, { name }): Outcome<never> => {`
- G4: n/a — a porta é um botão do inspetor, não um ponto do canvas `manifest/commands/elements.json:4588` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:306` `return { kind: 'change', patches: [Object.keys(custom).length === 0 ? { op: 'remove', path } : { op: 'replace', path, value: custom }], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:306` `return { kind: 'change', patches: [Object.keys(custom).length === 0 ? { op: 'remove', path } : { op: 'replace', path, value: custom }], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
