# TRC-linkPicker.open
- **Chamada:** `src/app/commands.ts:396` `'linkPicker.open': openLinkPicker,`
- **Argumentos:** o tratador recebe `{ target }` — o nó cujo link é escolhido (node, opcional).
- **Ramos que dependem dos argumentos:** R1 (o alvo recebido), R3 (o mesmo nó já aberto).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/editor/shell/link-picker.ts:21` `export const openLinkPicker = registerHandler<'linkPicker.open', EditorUi>('linkPicker.open', ({ state }, { target }) => {` — o tratador recebe o estado do editor e o alvo.
3. `src/editor/shell/link-picker.ts:22` `const node = (target as NodeId | undefined) ?? state.selection[0];` [lê: EST-L01-031 via handlerContext]
4. `src/editor/shell/link-picker.ts:25` `const href = locate(state.document, node)?.node.attributes.href;` [lê: EST-L01-030 via locate]
5. `src/editor/shell/link-picker.ts:26` `return { kind: 'change', ui: { ...state.ui, linkPicker: { node, kind: linkKindOf(state.document, href === undefined ? '' : String(href)) } } };` [escreve: EST-L01-037 via run]

## Ramos
- R1 `src/editor/shell/link-picker.ts:22` `const node = (target as NodeId | undefined) ?? state.selection[0];` — com alvo recebido usa-o; sem ele usa o primeiro da seleção.
- R2 `src/editor/shell/link-picker.ts:23` `if (node === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem nó: recusa; com nó: segue.
- R3 `src/editor/shell/link-picker.ts:24` `if (state.ui.linkPicker?.node === node) return { kind: 'change' };` — seletor já aberto para o mesmo nó: resultado `change` sem estado novo; qualquer outro: o estado do editor passa a `{ node, kind }`.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-037
- escreve: EST-L01-037

## Resultado
- **Estado final:** EST-L01-037 com `ui.linkPicker` em `{ node, kind }` por `src/editor/shell/link-picker.ts:26` `return { kind: 'change', ui: { ...state.ui, linkPicker: { node, kind: linkKindOf(state.document, href === undefined ? '' : String(href)) } } };`, ou inalterado no ramo R3.
- **Re-renderizado:** o painel do seletor de links, que lê `ui.linkPicker` pelo caminho de `src/editor/store.ts:275` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`.
- **DOM do editor:** o painel do seletor de links passa a ser desenhado no tipo do link guardado.
- **DOM do canvas:** nada muda — o seletor não altera o documento.

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/shell/link-picker.ts:26` `return { kind: 'change', ui: { ...state.ui, linkPicker: { node, kind: linkKindOf(state.document, href === undefined ? '' : String(href)) } } };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/shell/link-picker.ts:21` `export const openLinkPicker = registerHandler<'linkPicker.open', EditorUi>('linkPicker.open', ({ state }, { target }) => {`
- G4: n/a — a porta é o controle do campo de endereço, não um ponto do canvas `manifest/commands/elements.json:4064` `"kind": "panel-control",`.
- G5: n/a — o trecho escreve só o estado do editor; o painel é desenhado pela view `src/editor/shell/link-picker.ts:26` `return { kind: 'change', ui: { ...state.ui, linkPicker: { node, kind: linkKindOf(state.document, href === undefined ? '' : String(href)) } } };`.
- G6: n/a — o trecho não escreve a seleção `src/editor/shell/link-picker.ts:26` `return { kind: 'change', ui: { ...state.ui, linkPicker: { node, kind: linkKindOf(state.document, href === undefined ? '' : String(href)) } } };`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
