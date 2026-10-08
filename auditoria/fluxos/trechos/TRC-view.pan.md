# TRC-view.pan

- **Chamada:** `src/app/commands.ts:445` `'view.pan': pan,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ dx, dy }` (`manifest/commands/view.json:600` `"args": {`), com o campo `dx` (tipo `number`, `manifest/commands/view.json:601` `"dx": {`) e o campo `dy` (tipo `number`, `manifest/commands/view.json:606` `"dy": {`).
- **Ramos que dependem dos argumentos:** R4 depende de `dy` (se há rolagem da página); o valor de `dx` move o deslocamento horizontal da câmera, sem mudar o caminho tomado.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.pan'`; o argumento é `{ dx, dy }`.
2. `src/editor/view/camera.ts:127` `export const pan = registerHandler<'view.pan', EditorUi>('view.pan', ({ state }, { dx, dy }) => {` — o tratador do deslocamento da página.
3. `src/editor/view/camera.ts:128` `const zoom = zoomOf(state);` — o zoom mostrado, de que o passo da rolagem depende. [lê: EST-L01-037 via zoomOf]
4. `src/editor/view/camera.ts:62` `export const zoomOf = (shown: Shown, width: number = measure().width): number => (shown.ui.preferences.zoom !== undefined ? shown.ui.preferences.zoom / 100 : fitZoom(width, viewportWidth(shown)));` — o zoom escolhido, ou o que cabe no palco. [lê: EST-L01-037 via zoomOf] [lê: EST-L07-035 via measure]
5. `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` — a caixa do palco, medida pelo valor por omissão de `zoomOf`. [lê: EST-L07-035 via measure]
6. `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);` — o espaçamento interno e as bordas do palco. [lê: EST-L07-035 via measure]
7. `src/editor/view/camera.ts:129` `const across: EditorUi = { ...state.ui, camera: { ...state.ui.camera, panX: panOf(state, zoom) + dx } };` — a câmera com o deslocamento horizontal somado a `dx`.
8. `src/editor/view/camera.ts:131` `const camera = { ...across.camera, panX: panOf({ ...state, ui: across }, zoom), scroll: dy !== 0 ? { by: -dy / zoom, count: scroll.count + 1 } : scroll };` — R4: com `dy` diferente de zero, a rolagem da página é pedida e a contagem cresce; com `dy` zero, a rolagem fica como estava. [escreve: EST-L01-037 via run]
9. `src/editor/view/camera.ts:132` `return { kind: 'change', ui: { ...state.ui, camera } };` — o `Outcome` com o estado do editor novo. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
11. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
13. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish]
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/camera.ts:127` `export const pan = registerHandler<'view.pan', EditorUi>('view.pan', ({ state }, { dx, dy }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.pan` é `always` `manifest/commands/view.json:613` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/camera.ts:48` `if (stageElement === null) return { left: 0, width: 0 };` — sem palco registrado, a medida é zerada e o deslocamento vem de uma largura zero; com palco, `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` mede a caixa dele.
- R4 `src/editor/view/camera.ts:131` `scroll: dy !== 0 ? { by: -dy / zoom, count: scroll.count + 1 } : scroll` — com `dy` diferente de zero, o quadro pede uma rolagem da página em `-dy / zoom` e a contagem cresce; com `dy` zero, a rolagem fica como estava e o quadro não rola.
- R5 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve sempre um estado do editor com um objeto de câmera novo `src/editor/view/camera.ts:132` `return { kind: 'change', ui: { ...state.ui, camera } };`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via zoomOf, publish), EST-L07-035 (via measure)
- escreve: EST-L01-037 (o estado do editor, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.camera.panX` deslocado por `dx` e, com `dy` diferente de zero, `ui.camera.scroll` com a rolagem pedida e a contagem acrescida `src/editor/view/camera.ts:131` `scroll: dy !== 0 ? { by: -dy / zoom, count: scroll.count + 1 } : scroll`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê o deslocamento `src/editor/shell/canvas.tsx:278` `const pan = useEditorState((s) => panOf(s, zoom, size.width));`.
- **DOM do editor:** o quadro move-se pelo deslocamento novo `src/editor/shell/canvas.tsx:302` `style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}`.
- **DOM do canvas:** com `dy` diferente de zero, o quadro rola a página pelo pedido novo `src/editor/canvas/frame.tsx:250` `const scroll = useEditorState((s) => s.ui.camera.scroll);` e `src/editor/canvas/frame.tsx:257` `scrollPageBy(frame, scroll.by);`; com `dy` zero, nada muda na página, pois o resultado não leva `patches` `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a câmera `src/editor/view/camera.ts:129` `const across: EditorUi = { ...state.ui, camera: { ...state.ui.camera, panX: panOf(state, zoom) + dx } };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as quatro portas de `view.pan` (a roda sem modificador, a roda com Shift, o arraste com Espaço no palco e o arraste com o botão do meio no palco) chegam à tabela `src/app/commands.ts:445` `'view.pan': pan,` e enviam só o deslocamento `src/editor/view/camera.ts:127` `({ state }, { dx, dy }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/camera.ts:132` `return { kind: 'change', ui: { ...state.ui, camera } };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a câmera `src/editor/view/camera.ts:131` `const camera = { ...across.camera, panX: panOf({ ...state, ui: across }, zoom), scroll: dy !== 0 ? { by: -dy / zoom, count: scroll.count + 1 } : scroll };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/camera.ts:127` `export const pan = registerHandler<'view.pan', EditorUi>('view.pan', ({ state }, { dx, dy }) => {`. A rolagem que o quadro executa pertence ao efeito de `src/editor/canvas/frame.tsx:250` `const scroll = useEditorState((s) => s.ui.camera.scroll);`, fora deste trecho.

## Medições

- MED-0007 — a largura e a borda esquerda do palco, lidas em `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` e `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);`, de que o deslocamento horizontal e a rolagem dependem; valor a medir na Fase 6.
