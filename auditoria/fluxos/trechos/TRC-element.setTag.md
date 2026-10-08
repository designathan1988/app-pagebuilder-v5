# TRC-element.setTag
- **Chamada:** `src/app/commands.ts:240` `'element.setTag': setTagCommand,`
- **Argumentos:** o tratador recebe `{ tag }` — `tag` é o texto do campo (string).
- **Ramos que dependem dos argumentos:** R2 (texto vazio), R4 (o valor da tag).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho monta o contexto e chama o tratador; o contexto lê o estado. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/tag.ts:28` `export const setTagCommand = registerHandler('element.setTag', ({ state, rules }, { tag }) => {` — o tratador recebe o estado, as regras do modelo e a tag digitada.
3. `src/core/elements/tag.ts:29` `const id = state.selection.length === 1 ? state.selection[0] : undefined;` [lê: EST-L01-031 via handlerContext]
4. `src/core/elements/tag.ts:30` `const at = id === undefined ? null : locate(state.document, id);` [lê: EST-L01-030 via locate]
5. `src/core/elements/tag.ts:37` `const typed = tag.trim().toLowerCase();` — a tag entra sem os espaços em volta e em minúsculas.
6. `src/core/elements/tag.ts:39` `const locked = lockRefusal(state.document, node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
7. `src/core/elements/tag.ts:42` `const misplaced = retagRefusal(state.document, rules, node.id, typed);` [lê: EST-L01-030 via retagRefusal]
8. `src/core/elements/tag.ts:46` `const lost = Object.keys(node.attributes).filter((attribute) => {` — separa os atributos que a tag nova não aceita.
9. `src/core/elements/tag.ts:51` `{ op: 'replace' as const, path: [...at.path, 'tag'], value: typed },` — o patch que troca a tag.
10. `src/core/elements/tag.ts:56` `return { kind: 'change', patches, message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/tag.ts:32` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um único elemento selecionado: recusa; com um: segue.
- R2 `src/core/elements/tag.ts:38` `if (typed === '' || typed === node.tag) return { kind: 'change', message: message('status.tag.set', { name: node.name, tag: shown(node.tag) }) };` — texto vazio ou a tag que o nó já tem: resultado `change` sem patches (sem entrada no histórico); qualquer outra: segue para as recusas.
- R3 `src/core/elements/tag.ts:39` `const locked = lockRefusal(state.document, node.id, 'status.locked.edit');` — com o nó travado ou sob ancestral travado (`locked !== null`, linha 40): recusa com a mensagem do lock; sem lock: segue.
- R4 `src/core/elements/tag.ts:41` `if (!equivalentTags(element).includes(typed)) return { kind: 'refused', message: message('status.tag.notEquivalent', { tag: shown(typed), name: node.name }) };` — tag não equivalente ao tipo: recusa; equivalente: segue.
- R5 `src/core/elements/tag.ts:42` `const misplaced = retagRefusal(state.document, rules, node.id, typed);` — o aninhamento não aceita a tag nova (`misplaced !== null`, linha 43): recusa; aceita: segue.
- R6 `src/core/elements/tag.ts:55` `const said = lost.length === 0 ? message('status.tag.set', { name: node.name, tag: shown(typed) }) : message('status.tag.setLost', { name: node.name, tag: shown(typed), attributes: names });` — sem atributos perdidos a mensagem é `status.tag.set`; com eles, `status.tag.setLost`.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono do `src/core/store/store.ts:413` ao retorno; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, locate, lockRefusal, retagRefusal), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com a tag do nó trocada por `src/core/elements/tag.ts:51` `{ op: 'replace' as const, path: [...at.path, 'tag'], value: typed },`, ou inalterado quando o ramo R2 devolve `change` sem patches.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo (`src/core/elements/tag.ts:55`).
- **DOM do canvas:** o iframe redesenha o elemento com a tag nova pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava a tag do nó, não um valor de estilo; nenhum passo lê a camada (breakpoint, estado, classe ou quadro-chave) `src/core/elements/tag.ts:51` `{ op: 'replace' as const, path: [...at.path, 'tag'], value: typed },`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/tag.ts:28` `export const setTagCommand = registerHandler('element.setTag', ({ state, rules }, { tag }) => {`
- G4: n/a — as portas do comando são um campo do inspetor e um controle do painel rápido, não um ponto do canvas `manifest/commands/elements.json:42` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/tag.ts:56` `return { kind: 'change', patches, message: said };`.
- G6: n/a — o trecho não escreve a seleção; a seleção fica como a store a tem `src/core/elements/tag.ts:56` `return { kind: 'change', patches, message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho; o trecho só grava o documento `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
