# TRC-parts.add
- **Chamada:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Argumentos:** o tratador recebe `{ type }` — a peça acrescentada (enum: option, optionGroup, source, track, rectangle, ellipse, line).
- **Ramos que dependem dos argumentos:** R2 (o destino não aceita a peça), R4 (o SVG guarda marcação), R6 (a peça é uma forma).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/parts.ts:76` `export const addPartCommand = registerHandler('parts.add', ({ state, rules, ids, words }, { type }): Outcome<never> => {` — o tratador recebe o estado, as regras, os ids e a palavra.
3. `src/core/elements/parts.ts:77` `const at = selectedOne(state.document, state.selection);` [lê: EST-L01-030 via selectedOne] [lê: EST-L01-031 via selectedOne]
4. `src/core/elements/parts.ts:83` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.insert');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/parts.ts:86` `if (parentTag === 'svg' && svgMarkupOf(at.node) !== '') return { kind: 'refused', message: message('status.svg.holdsMarkup', { name: at.node.name }) };` [lê: EST-L01-030 via svgMarkupOf]
6. `src/core/elements/parts.ts:87` `const made = newElement(nodeMaker(state.document, rules, ids, words), type);` — a peça nova pela fábrica de nós. [lê: EST-L01-030 via nodeMaker]
7. `src/core/elements/parts.ts:89` `const geometry = geometryAttributes(rules, type, resizeCommand.command);` — os atributos de geometria quando a peça é uma forma.
8. `src/core/elements/parts.ts:91` `const node = size === null ? made : { ...made, attributes: { ...made.attributes, ...shapeGeometry(partTag, geometry, size) } };` — a forma ganha sua geometria dentro do SVG.
9. `src/core/elements/parts.ts:93` `return { kind: 'change', patches: [{ op: 'add', path: [...at.path, 'children', index], value: node }], selection: [at.node.id], message: message('status.parts.added', { part: node.name, name: at.node.name }) };` [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/parts.ts:78` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um único elemento selecionado: recusa; com ele: segue.
- R2 `src/core/elements/parts.ts:82` `if (part === undefined || !rules.contentModel.names(parentTag, partTag)) return { kind: 'refused', message: message('status.refused.noChildren', { parent: at.node.name }) };` — o conteúdo do dono não nomeia a peça: recusa; nomeia: segue.
- R3 `src/core/elements/parts.ts:83` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.insert');` — travado (linha 84): recusa; livre: segue.
- R4 `src/core/elements/parts.ts:86` `if (parentTag === 'svg' && svgMarkupOf(at.node) !== '') return { kind: 'refused', message: message('status.svg.holdsMarkup', { name: at.node.name }) };` — SVG que guarda marcação: recusa; SVG vazio: segue.
- R5 `src/core/elements/parts.ts:90` `const size = geometry.length > 0 ? sizeForShapes(at.node, rules) : null;` — sem geometria, a peça entra como foi feita; com geometria, ganha um lugar dentro do SVG.
- R6 `src/core/elements/parts.ts:92` `const index = rules.contentModel.slotIn(parentTag, at.node.children.map((c) => c.tag ?? ''), partTag);` — a peça entra no lugar que a ordem de HTML dá.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento: o dono, o nó da peça, via selectedOne, lockRefusal, svgMarkupOf, nodeMaker), EST-L01-031 (a seleção, via selectedOne)
- escreve: EST-L01-030 (o documento: a peça nova entre os filhos do dono, via run), EST-L01-031 (a seleção no dono, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com a peça nova entre os filhos do dono, EST-L01-031 com a seleção no dono e EST-L01-033 com a mensagem `status.parts.added`, por `src/core/elements/parts.ts:93` `return { kind: 'change', patches: [{ op: 'add', path: [...at.path, 'children', index], value: node }], selection: [at.node.id], message: message('status.parts.added', { part: node.name, name: at.node.name }) };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; a seleção fica no dono pelo campo `selection` do resultado.
- **DOM do canvas:** o iframe redesenha o dono com a peça pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava a estrutura do nó, não um valor de estilo `src/core/elements/parts.ts:93` `return { kind: 'change', patches: [{ op: 'add', path: [...at.path, 'children', index], value: node }], selection: [at.node.id], message: message('status.parts.added', { part: node.name, name: at.node.name }) };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/parts.ts:76` `export const addPartCommand = registerHandler('parts.add', ({ state, rules, ids, words }, { type }): Outcome<never> => {`
- G4: n/a — a porta é um controle do inspetor, não um ponto do canvas `manifest/commands/elements.json:4964` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/parts.ts:93` `return { kind: 'change', patches: [{ op: 'add', path: [...at.path, 'children', index], value: node }], selection: [at.node.id], message: message('status.parts.added', { part: node.name, name: at.node.name }) };`.
- G6: ok — a seleção fica no dono pelo campo `selection` do resultado `src/core/elements/parts.ts:93` `return { kind: 'change', patches: [{ op: 'add', path: [...at.path, 'children', index], value: node }], selection: [at.node.id], message: message('status.parts.added', { part: node.name, name: at.node.name }) };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
