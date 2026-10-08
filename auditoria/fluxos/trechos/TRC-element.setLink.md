# TRC-element.setLink
- **Chamada:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Argumentos:** o tratador recebe `{ target, href, newTab, page, anchor }` — `target` é o nó (opcional), `href` é o endereço digitado (opcional), `newTab` é o destino em nova aba (booleano opcional), `page` é o arquivo da página (opcional), `anchor` é o nó âncora (opcional).
- **Ramos que dependem dos argumentos:** R4 (newTab booleano), R5 (page ou anchor presentes), R6 (href vazio), R7 (endereço recusado), R8 (fragmento que não nomeia nada).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador embrulhado por `closingPicker`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/editor/shell/link-picker.ts:43` `export function closingPicker(owner: RegisteredHandler<'element.setLink', EditorUi>): RegisteredHandler<'element.setLink', EditorUi> {` — o embrulho em volta do tratador.
3. `src/editor/shell/link-picker.ts:47` `const outcome = owner.run(context, args);` — chama o tratador dono.
4. `src/core/elements/link.ts:29` `export const setLinkCommand = registerHandler('element.setLink', ({ state, rules }, { target, href, newTab, page, anchor }) => {` — o dono recebe o estado e as regras.
5. `src/core/elements/link.ts:30` `const id = target ?? (state.selection.length === 1 ? state.selection[0] : undefined);` [lê: EST-L01-031 via handlerContext]
6. `src/core/elements/link.ts:38` `const locked = lockRefusal(state.document, found.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
7. `src/core/elements/link.ts:42` `if (typeof newTab === 'boolean') {` — o ramo da nova aba.
8. `src/core/elements/link.ts:54` `if (page !== undefined || anchor !== undefined) {` — o ramo da página ou da âncora do seletor.
9. `src/core/elements/link.ts:87` `const read = readAddress(typed);` — a regra única de endereço.
10. `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
11. `src/editor/shell/link-picker.ts:48` `const fromItem = args.page !== undefined || args.anchor !== undefined;` [lê: EST-L01-037 via closingPicker]
12. `src/editor/shell/link-picker.ts:50` `return { ...outcome, ui: { ...(outcome.ui ?? context.state.ui), linkPicker: null } };` [escreve: EST-L01-037 via closingPicker]

## Ramos
- R1 `src/core/elements/link.ts:31` `if (id === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem nó nem um elemento selecionado: recusa; com nó: segue.
- R2 `src/core/elements/link.ts:36` `if (appliesTo === undefined || (appliesTo !== 'all' && !appliesTo.includes(found.node.type))) return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.setLink' }, name: found.node.name }) };` — elemento a que o link não se aplica: recusa; aplica-se: segue.
- R3 `src/core/elements/link.ts:38` `const locked = lockRefusal(state.document, found.node.id, 'status.locked.edit');` — travado (linha 39): recusa; livre: segue.
- R4 `src/core/elements/link.ts:42` `if (typeof newTab === 'boolean') {` — com newTab booleano segue o ramo da nova aba (linha 47); sem ele segue para os demais.
- R5 `src/core/elements/link.ts:54` `if (page !== undefined || anchor !== undefined) {` — com página ou âncora segue o ramo do seletor (linha 76); sem elas segue para o endereço digitado.
- R6 `src/core/elements/link.ts:81` `if (typed === '') {` — endereço vazio remove o href (linha 83); com texto: segue.
- R7 `src/core/elements/link.ts:88` `if (!read.ok) return { kind: 'refused', message: read.refusal };` — endereço recusado pela regra (javascript:, data:): recusa; aceito: segue.
- R8 `src/core/elements/link.ts:96` `if (locate(state.document, named as NodeId) === null && !ids.has(named)) return { kind: 'refused', message: message('status.link.noSection', { name: named }) };` — fragmento que não nomeia nó nem id: recusa; nomeia: segue.
- R9 `src/editor/shell/link-picker.ts:49` `if (outcome.kind !== 'change' || !fromItem || context.state.ui.linkPicker === null) return outcome;` — sem mudança, sem item do seletor ou sem seletor aberto: devolve o resultado; com item e seletor aberto: fecha o seletor.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, lockRefusal), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext, closingPicker)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run), EST-L01-037 (o estado do editor, via closingPicker)

## Resultado
- **Estado final:** EST-L01-030 com o `href` (ou `newTab`) do nó gravado ou removido por `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`, e o seletor de links fechado pelo ramo R9.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; o seletor de links fecha.
- **DOM do canvas:** o iframe redesenha o link do elemento pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava um atributo do nó, não um valor de estilo `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/link.ts:29` `export const setLinkCommand = registerHandler('element.setLink', ({ state, rules }, { target, href, newTab, page, anchor }) => {`
- G4: n/a — as portas são o campo de endereço e o campo de nova aba do inspetor, não um ponto do canvas `manifest/commands/elements.json:3890` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
