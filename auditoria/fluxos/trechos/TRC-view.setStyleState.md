# TRC-view.setStyleState

- **Chamada:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ state }` (`manifest/commands/view.json:1117` `"args": {`), com o campo `state` (tipo `state`, `manifest/commands/view.json:1118` `"state": {`); cada item do menu de estados envia o id do estado `manifest/commands/view.json:1157` `"state": "base"`.
- **Ramos que dependem dos argumentos:** R3 depende de `state` (se ele existe na lista de estados).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.setStyleState'`; o argumento é `{ state }`.
2. `src/editor/view/style-state.ts:64` `export const setStyleState = registerHandler<'view.setStyleState', EditorUi>(` — o tratador de `view.setStyleState`.
3. `src/editor/view/style-state.ts:66` `({ state }, args) => {` — lê o estado pedido e o estado da store. [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/style-state.ts:67` `const chosen = STATES.find((s) => s.id === args.state);` — o estado da lista que o argumento nomeia.
5. `src/editor/view/style-state.ts:68` `if (chosen === undefined) throw new Error(`view.setStyleState: no state ${args.state}`);` — R3.
6. `src/editor/view/style-state.ts:70` `const node = standsApart(state, chosen);` — o primeiro elemento selecionado onde o estado não assenta. [lê: EST-L01-030 via standsApart] [lê: EST-L01-031 via standsApart]
7. `src/editor/view/style-state.ts:37` `function standsApart(state: Pick<StoreState<EditorUi>, 'document' | 'selection'>, chosen: (typeof STATES)[number]): DocNode | null {` — a volta pelos elementos selecionados.
8. `src/editor/view/style-state.ts:39` `const node = locate(state.document, id)?.node;` — o nó de cada id da seleção. [lê: EST-L01-030 via standsApart]
9. `src/editor/view/style-state.ts:71` `if (node !== null) return { kind: 'refused', message: apart(chosen, node, 'status.styleState.notApplicable') };` — R4.
10. `src/editor/view/style-state.ts:72` `const { styleState: _was, ...rest } = state.ui;` — separa o estado de estilo atual do estado do editor. [lê: EST-L01-037 via handlerContext]
11. `src/editor/view/style-state.ts:74` `const ui: EditorUi = chosen.id === BASE.id ? rest : { ...rest, styleState: chosen.id };` — R5: o base limpa a chave; outro estado guarda o seu id. [escreve: EST-L01-037 via run]
12. `src/editor/view/style-state.ts:75` `return { kind: 'change', ui, message: message('status.styleStateActive', { state: { key: chosen.labelKey as MessageId } }) };` — o `Outcome` com o estado do editor novo. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
14. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
16. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
17. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/style-state.ts:64` `export const setStyleState = registerHandler<'view.setStyleState', EditorUi>(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.setStyleState` é `always` `manifest/commands/view.json:1125` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/style-state.ts:68` `if (chosen === undefined) throw new Error(`view.setStyleState: no state ${args.state}`);` — o id pedido não é um estado de properties.json: o tratador lança; com um id válido, o caminho segue para `src/editor/view/style-state.ts:70` `const node = standsApart(state, chosen);`.
- R4 `src/editor/view/style-state.ts:71` `if (node !== null) return { kind: 'refused', message: apart(chosen, node, 'status.styleState.notApplicable') };` — a seleção tem um elemento em que o estado não assenta: o comando é recusado com `status.styleState.notApplicable`; sem esse elemento, o caminho segue para `src/editor/view/style-state.ts:74` `const ui: EditorUi = chosen.id === BASE.id ? rest : { ...rest, styleState: chosen.id };`.
- R5 `src/editor/view/style-state.ts:74` `const ui: EditorUi = chosen.id === BASE.id ? rest : { ...rest, styleState: chosen.id };` — o estado base limpa a chave `styleState`; outro estado guarda o seu id.
- R6 `src/editor/view/style-state.ts:78` `(state, args) => activeState(state.ui).id === args.state,` — o item marcado é o do estado ativo, pela leitura `src/editor/view/style-state.ts:19` `export const activeState = (ui: EditorUi): (typeof STATES)[number] => STATES.find((s) => s.id === ui.styleState) ?? BASE;`.
- R7 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve um `ui` novo `src/editor/view/style-state.ts:75` `return { kind: 'change', ui, message: message('status.styleStateActive', { state: { key: chosen.labelKey as MessageId } }) };`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish), EST-L01-030 (o documento, via standsApart), EST-L01-031 (a seleção, via standsApart)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.styleState` no estado escolhido, ou sem a chave para o base `src/editor/view/style-state.ts:74` `const ui: EditorUi = chosen.id === BASE.id ? rest : { ...rest, styleState: chosen.id };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê o estado ativo `src/editor/shell/canvas.tsx:222` `const state = useEditorState((s) => activeState(s.ui));`.
- **DOM do editor:** o emblema de estado aparece quando o estado não é o base `src/editor/shell/canvas.tsx:223` `if (state.pseudo === null) return null;` e o item do menu marcado é o do estado ativo `src/editor/view/style-state.ts:78` `(state, args) => activeState(state.ui).id === args.state,`.
- **DOM do canvas:** nada muda no documento: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso; a página é desenhada com o estado aplicado pelos leitores `src/editor/canvas/frame.tsx:171` `const state = activeState(s.ui);`.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava o estado de estilo `src/editor/view/style-state.ts:74` `const ui: EditorUi = chosen.id === BASE.id ? rest : { ...rest, styleState: chosen.id };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as quinze portas de `view.setStyleState` (os itens do menu de estados) chegam à tabela `src/app/commands.ts:456` `'view.setStyleState': setStyleState,` e enviam só o id do estado `src/editor/view/style-state.ts:66` `({ state }, args) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/style-state.ts:75` `return { kind: 'change', ui, message: message('status.styleStateActive', { state: { key: chosen.labelKey as MessageId } }) };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o estado de estilo `src/editor/view/style-state.ts:74` `const ui: EditorUi = chosen.id === BASE.id ? rest : { ...rest, styleState: chosen.id };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/style-state.ts:64` `export const setStyleState = registerHandler<'view.setStyleState', EditorUi>(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o estado ativo vem de `ui.styleState` `src/editor/view/style-state.ts:19` `export const activeState = (ui: EditorUi): (typeof STATES)[number] => STATES.find((s) => s.id === ui.styleState) ?? BASE;`.
