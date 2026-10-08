# TRC-linkPicker.setKind
- **Chamada:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Argumentos:** o tratador recebe `{ kind }` — o tipo de link escolhido (enum: url, page, anchor, email, phone).
- **Ramos que dependem dos argumentos:** R2 (o mesmo tipo já escolhido).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/editor/shell/link-picker.ts:29` `export const setLinkKind = registerHandler<'linkPicker.setKind', EditorUi>('linkPicker.setKind', ({ state }, { kind }) => {` — o tratador recebe o estado do editor e o tipo.
3. `src/editor/shell/link-picker.ts:30` `if (state.ui.linkPicker === null) return { kind: 'change' };` [lê: EST-L01-037 via handlerContext]
4. `src/editor/shell/link-picker.ts:31` `if (state.ui.linkPicker.kind === kind) return { kind: 'change' };` [lê: EST-L01-037 via handlerContext]
5. `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };` [escreve: EST-L01-037 via run]

## Ramos
- R1 `src/editor/shell/link-picker.ts:30` `if (state.ui.linkPicker === null) return { kind: 'change' };` — seletor fechado: resultado `change` sem estado novo; aberto: segue.
- R2 `src/editor/shell/link-picker.ts:31` `if (state.ui.linkPicker.kind === kind) return { kind: 'change' };` — o mesmo tipo já escolhido: `change` sem estado novo; outro tipo: o estado do editor passa a `{ ...linkPicker, kind }`.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-037
- escreve: EST-L01-037

## Resultado
- **Estado final:** EST-L01-037 com `ui.linkPicker.kind` no tipo escolhido por `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`, ou inalterado nos ramos R1 e R2.
- **Re-renderizado:** o painel do seletor de links, pelo caminho de `src/editor/store.ts:276` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`.
- **DOM do editor:** o painel do seletor de links passa a mostrar os alvos do tipo escolhido.
- **DOM do canvas:** nada muda — o comando não altera o documento.

## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/shell/link-picker.ts:29` `export const setLinkKind = registerHandler<'linkPicker.setKind', EditorUi>('linkPicker.setKind', ({ state }, { kind }) => {`
- G4: n/a — a porta é um controle do painel do seletor, não um ponto do canvas `manifest/commands/elements.json:4120` `"kind": "panel-control",`.
- G5: n/a — o trecho escreve só o estado do editor; o painel é desenhado pela view `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`.
- G6: n/a — o trecho não escreve a seleção `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
