# TRC-element.setLabelTarget
- **Chamada:** `src/app/commands.ts:246` `'element.setLabelTarget': setLabelTargetCommand,`
- **Argumentos:** o tratador recebe `{ control }` — o nó do controle rotulado (node).
- **Ramos que dependem dos argumentos:** R3 (o elemento não é rótulo), R4 (o alvo não é controle), R6 (o controle sem id).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/inputs.ts:129` `export const setLabelTargetCommand = registerHandler('element.setLabelTarget', ({ state }, { control }): Outcome<never> => {` — o tratador recebe o estado e o controle.
3. `src/core/elements/inputs.ts:130` `const label = oneSelected(state);` [lê: EST-L01-030 via oneSelected] [lê: EST-L01-031 via oneSelected]
4. `src/core/elements/inputs.ts:131` `const target = locate(state.document, control);` [lê: EST-L01-030 via locate]
5. `src/core/elements/inputs.ts:137` `const locked = lockRefusal(state.document, label.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
6. `src/core/elements/inputs.ts:142` `const holder = target.node.attributes.id === undefined || String(target.node.attributes.id) === '';` — se o controle precisa de id.
7. `src/core/elements/inputs.ts:144` `const lockedControl = holder ? lockRefusal(state.document, target.node.id, 'status.locked.edit') : null;` [lê: EST-L01-030 via lockRefusal]
8. `src/core/elements/inputs.ts:146` `if (holder) patches.push({ op: 'add', path: [...target.path, 'attributes', 'id'], value: freshId(state.document, target.node.name) });` — o controle ganha um id novo.
9. `src/core/elements/inputs.ts:147` `if (label.node.attributes.labelFor !== target.node.id) patches.push({ op: label.node.attributes.labelFor === undefined ? 'add' : 'replace', path: [...label.path, 'attributes', 'labelFor'], value: target.node.id });` — o rótulo aponta para o id do nó do controle.
10. `src/core/elements/inputs.ts:148` `return { kind: 'change', patches, message: message('status.label.target', { name: label.node.name, control: target.node.name }) };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/inputs.ts:132` `if (label === null || target === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem rótulo selecionado ou sem alvo no documento: recusa; com ambos: segue.
- R2 `src/core/elements/inputs.ts:135` `if (label.node.type !== LABEL) return { kind: 'refused', message: message('status.label.notLabel', { name: label.node.name }) };` — o selecionado não é um rótulo: recusa; é: segue.
- R3 `src/core/elements/inputs.ts:136` `if (!CONTROLS.has(target.node.type)) return { kind: 'refused', message: message('status.label.notControl', { name: target.node.name }) };` — o alvo não é um controle de formulário: recusa; é: segue.
- R4 `src/core/elements/inputs.ts:137` `const locked = lockRefusal(state.document, label.node.id, 'status.locked.edit');` — rótulo travado (linha 138): recusa; livre: segue.
- R5 `src/core/elements/inputs.ts:144` `const lockedControl = holder ? lockRefusal(state.document, target.node.id, 'status.locked.edit') : null;` — o controle que precisaria de id está travado (linha 145): recusa; livre: segue.
- R6 `src/core/elements/inputs.ts:142` `const holder = target.node.attributes.id === undefined || String(target.node.attributes.id) === '';` — controle sem id: ganha um (linha 146); com id: nenhum patch de id.
- R7 `src/core/elements/inputs.ts:147` `if (label.node.attributes.labelFor !== target.node.id) patches.push({ op: label.node.attributes.labelFor === undefined ? 'add' : 'replace', path: [...label.path, 'attributes', 'labelFor'], value: target.node.id });` — o rótulo que já aponta para o controle não gera patch; outro gera.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, oneSelected, locate, lockRefusal), EST-L01-031 (a seleção, via handlerContext, oneSelected), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com o atributo `labelFor` do rótulo e, quando preciso, o `id` do controle, por `src/core/elements/inputs.ts:148` `return { kind: 'change', patches, message: message('status.label.target', { name: label.node.name, control: target.node.name }) };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/inputs.ts:148`).
- **DOM do canvas:** o iframe redesenha o rótulo ligado ao controle pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava atributos do nó, não um valor de estilo `src/core/elements/inputs.ts:148` `return { kind: 'change', patches, message: message('status.label.target', { name: label.node.name, control: target.node.name }) };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/inputs.ts:129` `export const setLabelTargetCommand = registerHandler('element.setLabelTarget', ({ state }, { control }): Outcome<never> => {`
- G4: n/a — a porta é o campo for do rótulo no inspetor, não um ponto do canvas `manifest/commands/elements.json:4442` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/inputs.ts:148` `return { kind: 'change', patches, message: message('status.label.target', { name: label.node.name, control: target.node.name }) };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/inputs.ts:148` `return { kind: 'change', patches, message: message('status.label.target', { name: label.node.name, control: target.node.name }) };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
