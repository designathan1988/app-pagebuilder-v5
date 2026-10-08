# TRC-element.setClasses
- **Chamada:** `src/app/commands.ts:243` `'element.setClasses': setClassesCommand,`
- **Argumentos:** o tratador recebe `{ classes, target }` — `classes` é o texto ou a lista digitada (json), `target` é o nó (opcional).
- **Ramos que dependem dos argumentos:** R3 (classe inválida), R4 (a mesma lista), R5 (lista vazia remove).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/attributes.ts:177` `export const setClassesCommand = registerHandler('element.setClasses', ({ state, rules, words }, { classes, target }): Outcome<never> => {` — o tratador recebe o estado, as regras e a palavra.
3. `src/core/elements/attributes.ts:178` `const at = nodeOf(state, target as NodeId | undefined);` [lê: EST-L01-030 via nodeOf] [lê: EST-L01-031 via nodeOf]
4. `src/core/elements/attributes.ts:180` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/attributes.ts:182` `const list = (Array.isArray(classes) ? classes.map(String) : String(classes ?? '').split(/\s+/)).map((c) => c.trim()).filter((c) => c !== '');` — o texto vira a lista das palavras.
6. `src/core/elements/attributes.ts:184` `const wrong = list.find((c) => !validClassName(c));` — a primeira palavra que não é um nome de classe de CSS.
7. `src/core/elements/attributes.ts:188` `const definitions = missingClassDefinitions(state.document, kept);` [lê: EST-L01-030 via missingClassDefinitions]
8. `src/core/elements/attributes.ts:191` `return { kind: 'change', patches: [...definitions, ...classPatch], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/attributes.ts:179` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem nó nem um elemento selecionado: recusa; com nó: segue.
- R2 `src/core/elements/attributes.ts:180` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 181): recusa; livre: segue.
- R3 `src/core/elements/attributes.ts:185` `if (wrong !== undefined) return { kind: 'refused', message: message('status.attribute.invalid', { attribute: label, value: wrong }) };` — palavra que não é um nome de classe: recusa; todas válidas: segue.
- R4 `src/core/elements/attributes.ts:189` `if (kept.join(' ') === at.node.classes.join(' ') && definitions.length === 0) return { kind: 'change', message: said };` — a mesma lista e sem definições novas: resultado sem patches; qualquer outra: segue.
- R5 `src/core/elements/attributes.ts:182` `const list = (Array.isArray(classes) ? classes.map(String) : String(classes ?? '').split(/\s+/)).map((c) => c.trim()).filter((c) => c !== '');` — texto vazio faz `kept` ficar vazio; o ramo de remoção da linha 187 nomeia `status.attribute.removed`.
- R6 `src/core/elements/attributes.ts:190` `const classPatch: Patch[] = kept.join(' ') === at.node.classes.join(' ') ? [] : [{ op: 'replace', path: [...at.path, 'classes'], value: kept }];` — a lista igual ao que o nó já tem não gera patch de classes; diferente, o patch troca a lista.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, nodeOf, lockRefusal, missingClassDefinitions), EST-L01-031 (a seleção, via handlerContext, nodeOf), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com a lista de classes do nó trocada por `src/core/elements/attributes.ts:190` `const classPatch: Patch[] = kept.join(' ') === at.node.classes.join(' ') ? [] : [{ op: 'replace', path: [...at.path, 'classes'], value: kept }];` e com as definições que faltam.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/attributes.ts:187`).
- **DOM do canvas:** o iframe redesenha as classes do elemento pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava classes do nó, não um valor de estilo `src/core/elements/attributes.ts:190` `const classPatch: Patch[] = kept.join(' ') === at.node.classes.join(' ') ? [] : [{ op: 'replace', path: [...at.path, 'classes'], value: kept }];`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/attributes.ts:177` `export const setClassesCommand = registerHandler('element.setClasses', ({ state, rules, words }, { classes, target }): Outcome<never> => {`
- G4: n/a — a porta é o campo Definir as classes do inspetor, não um ponto do canvas `manifest/commands/elements.json:3809` `"id": "inspector-classes",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:191` `return { kind: 'change', patches: [...definitions, ...classPatch], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:191` `return { kind: 'change', patches: [...definitions, ...classPatch], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
