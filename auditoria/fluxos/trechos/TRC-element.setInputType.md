# TRC-element.setInputType
- **Chamada:** `src/app/commands.ts:245` `'element.setInputType': setInputTypeCommand,`
- **Argumentos:** o tratador recebe `{ type }` — o tipo de campo escolhido (string).
- **Ramos que dependem dos argumentos:** R3 (tipo inválido), R4 (o mesmo tipo), R5 (a troca exige texto).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/inputs.ts:104` `export const setInputTypeCommand = registerHandler('element.setInputType', ({ state, rules }, { type }): Outcome<never> => {` — o tratador recebe o estado e as regras.
3. `src/core/elements/inputs.ts:105` `const at = oneSelected(state);` [lê: EST-L01-030 via oneSelected] [lê: EST-L01-031 via oneSelected]
4. `src/core/elements/inputs.ts:107` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/inputs.ts:109` `const nextType = type.trim().toLowerCase();` — o tipo entra sem os espaços em volta e em minúsculas.
6. `src/core/elements/inputs.ts:113` `const switched: DocNode = { ...at.node, attributes: { ...at.node.attributes, inputType: nextType } };` — o nó com o tipo novo.
7. `src/core/elements/inputs.ts:115` `const dropped = new Set(droppedInputAttributes(at.node, nextType));` [lê: EST-L01-030 via droppedInputAttributes]
8. `src/core/elements/inputs.ts:116` `const kept = Object.fromEntries(Object.entries(switched.attributes).filter(([name]) => !dropped.has(name)));` — os atributos que o tipo novo aceita.
9. `src/core/elements/inputs.ts:117` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'attributes'], value: kept }], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/inputs.ts:106` `if (at === null || at.node.type !== 'input') return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um único input selecionado: recusa; com ele: segue.
- R2 `src/core/elements/inputs.ts:107` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 108): recusa; livre: segue.
- R3 `src/core/elements/inputs.ts:110` `if (!rules.attributeValues.get('inputType')?.keywords.includes(nextType)) return { kind: 'refused', message: message('status.input.invalidType', { type }) };` — tipo fora das palavras-chave: recusa; válido: segue.
- R4 `src/core/elements/inputs.ts:112` `if (inputTypeOf(at.node) === nextType) return { kind: 'change', message: said };` — o mesmo tipo: resultado sem patches; outro: segue.
- R5 `src/core/elements/inputs.ts:114` `if (hasIncompatibleMask(switched)) return { kind: 'refused', message: message('status.forms.requiresText') };` — a máscara do formulário não cabe no tipo novo: recusa; cabe: segue.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, oneSelected, lockRefusal, droppedInputAttributes), EST-L01-031 (a seleção, via handlerContext, oneSelected), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com os atributos do input trocados por `src/core/elements/inputs.ts:117` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'attributes'], value: kept }], message: said };`, mantendo só os atributos que o tipo novo aceita.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/inputs.ts:111`).
- **DOM do canvas:** o iframe redesenha o input com o tipo novo pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava atributos do nó, não um valor de estilo `src/core/elements/inputs.ts:117` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'attributes'], value: kept }], message: said };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/inputs.ts:104` `export const setInputTypeCommand = registerHandler('element.setInputType', ({ state, rules }, { type }): Outcome<never> => {`
- G4: n/a — a porta é o campo Mudar o tipo do inspetor, não um ponto do canvas `manifest/commands/elements.json:4356` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/inputs.ts:117` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'attributes'], value: kept }], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/inputs.ts:117` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'attributes'], value: kept }], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
