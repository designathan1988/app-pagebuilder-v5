# TRC-assetPicker.close
- **Chamada:** `src/app/commands.ts:400` `'assetPicker.close': closeAssetPicker,`
- **Argumentos:** o tratador não recebe argumento (`{}`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumento.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-037 via handlerContext]
2. `src/editor/shell/asset-picker.ts:13` `export const closeAssetPicker = registerHandler<'assetPicker.close', EditorUi>('assetPicker.close', ({ state }) =>` — o tratador recebe o estado do editor.
3. `src/editor/shell/asset-picker.ts:14` `state.ui.assetPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, assetPicker: null } },` — sem seletor aberto devolve `change` sem estado novo; com seletor aberto o estado do editor passa a `assetPicker: null`. [lê: EST-L01-037 via handlerContext] [escreve: EST-L01-037 via run]

## Ramos
- R1 `src/editor/shell/asset-picker.ts:14` `state.ui.assetPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, assetPicker: null } },` — sem seletor aberto: nada muda; com seletor aberto: o estado do editor passa a `assetPicker: null`.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-037
- escreve: EST-L01-037

## Resultado
- **Estado final:** EST-L01-037 com `ui.assetPicker` em `null` por `src/editor/shell/asset-picker.ts:14` `state.ui.assetPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, assetPicker: null } },`, ou inalterado no ramo sem seletor aberto.
- **Re-renderizado:** o painel do seletor de arquivos, pelo caminho de `src/editor/store.ts:276` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`.
- **DOM do editor:** o painel do seletor de arquivos deixa de ser desenhado.
- **DOM do canvas:** nada muda — o comando não altera o documento.

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/shell/asset-picker.ts:14` `state.ui.assetPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, assetPicker: null } },`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/shell/asset-picker.ts:13` `export const closeAssetPicker = registerHandler<'assetPicker.close', EditorUi>('assetPicker.close', ({ state }) =>`
- G4: n/a — a porta é o botão de fechar do painel do seletor, não um ponto do canvas `manifest/commands/elements.json:3665` `"kind": "panel-control",`.
- G5: n/a — o trecho escreve só o estado do editor; o fechar do painel é desenhado pela view `src/editor/shell/asset-picker.ts:14` `state.ui.assetPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, assetPicker: null } },`.
- G6: n/a — o trecho não escreve a seleção `src/editor/shell/asset-picker.ts:14` `state.ui.assetPicker === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, assetPicker: null } },`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
