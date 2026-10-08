# TRC-element.setCustomAttribute
- **Chamada:** `src/app/commands.ts:247` `'element.setCustomAttribute': setCustomAttributeCommand,`
- **Argumentos:** o tratador recebe `{ name, value }` — `name` é o nome do atributo (string), `value` é o valor (string).
- **Ramos que dependem dos argumentos:** R2 (nome de evento), R3 (nome reservado), R4 (nome inválido), R5 (endereço recusado), R7 (o mesmo valor).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/attributes.ts:276` `export const setCustomAttributeCommand = registerHandler('element.setCustomAttribute', ({ state, rules, words }, { name, value }): Outcome<never> => {` — o tratador recebe o estado, as regras e a palavra.
3. `src/core/elements/attributes.ts:277` `const at = oneSelected(state);` [lê: EST-L01-030 via oneSelected] [lê: EST-L01-031 via oneSelected]
4. `src/core/elements/attributes.ts:279` `const typed = String(name).trim().toLowerCase();` — o nome entra sem os espaços em volta e em minúsculas.
5. `src/core/elements/attributes.ts:283` `if (customAttributeRefusal(typed, rules) !== null) return { kind: 'refused', message: message('status.attribute.invalidName', { name: typed }) };`
6. `src/core/elements/attributes.ts:285` `const address = customAttributeValueRefusal(typed, String(value)) === null ? null : readAddress(String(value));` — a regra de endereço para atributos de endereço.
7. `src/core/elements/attributes.ts:287` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
8. `src/core/elements/attributes.ts:293` `const next = { ...custom, [typed]: String(value) };` — os atributos personalizados com o valor novo.
9. `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/attributes.ts:278` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um único elemento selecionado: recusa; com ele: segue.
- R2 `src/core/elements/attributes.ts:280` `if (typed.startsWith('on')) return { kind: 'refused', message: message('status.attribute.eventHandler') };` — nome de evento (on*): recusa; outro: segue.
- R3 `src/core/elements/attributes.ts:282` `if (owner !== null) return { kind: 'refused', message: message('status.attribute.reserved', { name: typed, owner: words(owner as never) }) };` — nome reservado ao editor: recusa; livre: segue.
- R4 `src/core/elements/attributes.ts:283` `if (customAttributeRefusal(typed, rules) !== null) return { kind: 'refused', message: message('status.attribute.invalidName', { name: typed }) };` — nome que não é nome de atributo: recusa; válido: segue.
- R5 `src/core/elements/attributes.ts:286` `if (address !== null && !address.ok) return { kind: 'refused', message: address.refusal };` — endereço que a regra recusa: recusa; aceito: segue.
- R6 `src/core/elements/attributes.ts:287` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 288): recusa; livre: segue.
- R7 `src/core/elements/attributes.ts:292` `if (custom[typed] === String(value)) return { kind: 'change', message: said };` — o mesmo valor: resultado sem patches; outro: segue.
- R8 `src/core/elements/attributes.ts:291` `const said = custom[typed] === undefined && String(value) === '' ? message('status.attribute.added', { attribute: typed, name: at.node.name }) : message('status.attribute.set', { attribute: typed, name: at.node.name, value: String(value) });` — atributo novo sem valor diz `status.attribute.added`; qualquer outro diz `status.attribute.set`.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, oneSelected, lockRefusal), EST-L01-031 (a seleção, via handlerContext, oneSelected), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com `customAttributes` do nó com o atributo por `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo R8 (`src/core/elements/attributes.ts:291`).
- **DOM do canvas:** o iframe redesenha o atributo personalizado pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava atributos do nó, não um valor de estilo `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/attributes.ts:276` `export const setCustomAttributeCommand = registerHandler('element.setCustomAttribute', ({ state, rules, words }, { name, value }): Outcome<never> => {`
- G4: n/a — a porta é um controle do inspetor, não um ponto do canvas `manifest/commands/elements.json:4506` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
