# TRC-element.setAttribute
- **Chamada:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Argumentos:** o tratador recebe `{ attribute, value, target }` — `attribute` é o id do atributo (string de elements.json), `value` é o valor (json), `target` é o nó (opcional).
- **Ramos que dependem dos argumentos:** R4 (o tipo do valor decide a leitura), R5 (booleano), R6 (keyword), R7 (url).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador embrulhado por `closingAssetPicker`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/editor/shell/asset-picker.ts:18` `export function closingAssetPicker(owner: RegisteredHandler<'element.setAttribute', EditorUi>): RegisteredHandler<'element.setAttribute', EditorUi> {` — o embrulho em volta do tratador.
3. `src/editor/shell/asset-picker.ts:22` `const outcome = owner.run(context, args);` — chama o tratador dono.
4. `src/core/elements/attributes.ts:205` `export const setAttributeCommand = registerHandler('element.setAttribute', ({ state, rules, words }, { attribute, value, target }): Outcome<never> => {` — o dono recebe o estado, as regras e a palavra.
5. `src/core/elements/attributes.ts:206` `const at = nodeOf(state, target as NodeId | undefined);` [lê: EST-L01-030 via nodeOf] [lê: EST-L01-031 via nodeOf]
6. `src/core/elements/attributes.ts:208` `const rule = rules.attributeValues.get(attribute);` — a regra de valor do atributo. [lê: EST-L01-030 via handlerContext]
7. `src/core/elements/attributes.ts:211` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
8. `src/core/elements/attributes.ts:216` `if (rule.valueType === 'boolean') {` — a leitura do valor segue o tipo.
9. `src/core/elements/attributes.ts:233` `const read = readAddress(typed);` — para o tipo url, a regra única de endereço.
10. `src/core/elements/attributes.ts:241` `const patch = attributePatch(at, attribute, stored);` — o patch do atributo.
11. `src/core/elements/attributes.ts:263` `return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
12. `src/editor/shell/asset-picker.ts:23` `if (outcome.kind !== 'change' || context.state.ui.assetPicker === null) return outcome;` — o embrulho lê o estado do editor. [lê: EST-L01-037 via closingAssetPicker]
13. `src/editor/shell/asset-picker.ts:24` `return { ...outcome, ui: { ...(outcome.ui ?? context.state.ui), assetPicker: null } };` [escreve: EST-L01-037 via closingAssetPicker]

## Ramos
- R1 `src/core/elements/attributes.ts:207` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem nó nomeado nem um elemento selecionado: recusa; com nó: segue.
- R2 `src/core/elements/attributes.ts:210` `if (rule === undefined || appliesTo === undefined || (appliesTo !== 'all' && !appliesTo.includes(at.node.type))) throw new Error(`element.setAttribute: ${attribute} is not an attribute of ${at.node.type}`);` — atributo que o tipo não aceita: defeito da porta; aceito: segue.
- R3 `src/core/elements/attributes.ts:211` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 212): recusa; livre: segue.
- R4 `src/core/elements/attributes.ts:216` `if (rule.valueType === 'boolean') {` — booleano: o valor precisa ser booleano; qualquer outro tipo: o texto decide.
- R5 `src/core/elements/attributes.ts:218` `stored = value ? true : undefined;` — booleano verdadeiro grava `true`, falso remove o atributo.
- R6 `src/core/elements/attributes.ts:227` `} else if (rule.valueType === 'keyword') {` — keyword fora da lista (linha 228): recusa; na lista: grava.
- R7 `src/core/elements/attributes.ts:230` `} else if (rule.valueType === 'url') {` — endereço que a regra recusa (linha 234): recusa; aceito: grava o valor normalizado.
- R8 `src/core/elements/attributes.ts:245` `if (stored === true && isMutedWith(attribute, at.node, rules)) {` — autoplay liga Muted no mesmo passo; senão, nenhum patch exclusivo.
- R9 `src/editor/shell/asset-picker.ts:23` `if (outcome.kind !== 'change' || context.state.ui.assetPicker === null) return outcome;` — sem mudança ou sem seletor aberto: devolve o resultado como está; com mudança e seletor aberto: fecha o seletor.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, nodeOf, lockRefusal), EST-L01-031 (a seleção, via handlerContext, nodeOf), EST-L01-037 (o estado do editor, via handlerContext, closingAssetPicker)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run), EST-L01-037 (o estado do editor, via closingAssetPicker)

## Resultado
- **Estado final:** EST-L01-030 com o atributo do nó gravado ou removido por `src/core/elements/attributes.ts:241` `const patch = attributePatch(at, attribute, stored);`, e EST-L01-037 com o seletor de arquivos fechado pelo ramo R9.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; o seletor de arquivos fecha.
- **DOM do canvas:** o iframe redesenha o atributo pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava um atributo do nó, não um valor de estilo; nenhum passo lê a camada `src/core/elements/attributes.ts:241` `const patch = attributePatch(at, attribute, stored);`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/attributes.ts:205` `export const setAttributeCommand = registerHandler('element.setAttribute', ({ state, rules, words }, { attribute, value, target }): Outcome<never> => {`
- G4: n/a — as portas são campos do inspetor e do painel rápido, não um ponto do canvas `manifest/commands/elements.json:140` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:263` `return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:263` `return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
