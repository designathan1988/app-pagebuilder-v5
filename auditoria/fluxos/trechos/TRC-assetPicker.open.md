# TRC-assetPicker.open
- **Chamada:** `src/app/commands.ts:399` `'assetPicker.open': openAssetPicker,`
- **Argumentos:** o tratador recebe `{ attribute }` — o id do atributo que o seletor grava (string).
- **Ramos que dependem dos argumentos:** R1 (o mesmo atributo já aberto).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-037 via handlerContext]
2. `src/editor/shell/asset-picker.ts:8` `export const openAssetPicker = registerHandler<'assetPicker.open', EditorUi>('assetPicker.open', ({ state }, { attribute }) => {` — o tratador recebe o estado do editor e o atributo.
3. `src/editor/shell/asset-picker.ts:9` `if (state.ui.assetPicker !== null && state.ui.assetPicker.attribute === attribute) return { kind: 'change' };` [lê: EST-L01-037 via handlerContext]
4. `src/editor/shell/asset-picker.ts:10` `return { kind: 'change', ui: { ...state.ui, assetPicker: { attribute } } };` [escreve: EST-L01-037 via run]

## Ramos
- R1 `src/editor/shell/asset-picker.ts:9` `if (state.ui.assetPicker !== null && state.ui.assetPicker.attribute === attribute) return { kind: 'change' };` — seletor já aberto para o mesmo atributo: resultado `change` sem estado novo; qualquer outro caso: o estado do editor passa a `{ attribute }`.
- R2 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — sem documento alterado e com o estado do editor novo, o resultado é `changed` sem entrada no histórico (o comando não é desfazível).

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-037
- escreve: EST-L01-037

## Resultado
- **Estado final:** EST-L01-037 com `ui.assetPicker` igual a `{ attribute }` por `src/editor/shell/asset-picker.ts:10` `return { kind: 'change', ui: { ...state.ui, assetPicker: { attribute } } };`, ou inalterado no ramo R1.
- **Re-renderizado:** o painel do seletor de arquivos, que lê `ui.assetPicker` pelo caminho de `src/editor/store.ts:275` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`.
- **DOM do editor:** o painel do seletor de arquivos passa a ser desenhado.
- **DOM do canvas:** nada muda — o seletor não altera o documento.

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/shell/asset-picker.ts:10` `return { kind: 'change', ui: { ...state.ui, assetPicker: { attribute } } };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/shell/asset-picker.ts:8` `export const openAssetPicker = registerHandler<'assetPicker.open', EditorUi>('assetPicker.open', ({ state }, { attribute }) => {`
- G4: n/a — a porta é o controle do campo Origem, não um ponto do canvas `manifest/commands/elements.json:3621` `"kind": "panel-control",`.
- G5: n/a — o trecho escreve só o estado do editor; o painel é desenhado pela view `src/editor/shell/asset-picker.ts:10` `return { kind: 'change', ui: { ...state.ui, assetPicker: { attribute } } };`.
- G6: n/a — o trecho não escreve a seleção `src/editor/shell/asset-picker.ts:10` `return { kind: 'change', ui: { ...state.ui, assetPicker: { attribute } } };`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
