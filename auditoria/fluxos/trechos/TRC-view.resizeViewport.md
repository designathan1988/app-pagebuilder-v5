# TRC-view.resizeViewport

- **Chamada:** `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ size, distance }` (`manifest/commands/view.json:3176` `"args": {`), com o campo `size` (tipo `number`, opcional, `manifest/commands/view.json:3177` `"size": {`) e o campo `distance` (tipo `number`, `manifest/commands/view.json:3182` `"distance": {`).
- **Ramos que dependem dos argumentos:** R4 depende de `size` (se ele veio, o passo parte dele; sem ele, da largura mostrada); o valor de `distance` soma à largura, sem mudar o caminho tomado.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.resizeViewport'`; o argumento é `{ size, distance }`.
2. `src/editor/view/frame-edge.ts:13` `export const resizeViewport = registerHandler<'view.resizeViewport', EditorUi>('view.resizeViewport', ({ state }, { size, distance }) => {` — o tratador do arraste da borda do quadro.
3. `src/editor/view/frame-edge.ts:14` `const zoom = zoomOf(state);` — o zoom do momento da pressão. [lê: EST-L01-037 via zoomOf]
4. `src/editor/view/camera.ts:62` `export const zoomOf = (shown: Shown, width: number = measure().width): number => (shown.ui.preferences.zoom !== undefined ? shown.ui.preferences.zoom / 100 : fitZoom(width, viewportWidth(shown)));` — o zoom escolhido, ou o que cabe no palco. [lê: EST-L01-037 via zoomOf] [lê: EST-L07-035 via measure]
5. `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` — a caixa do palco, medida pelo valor por omissão de `zoomOf`. [lê: EST-L07-035 via measure]
6. `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);` — o espaçamento interno e as bordas do palco. [lê: EST-L07-035 via measure]
7. `src/editor/view/frame-edge.ts:15` `const width = Math.round((size ?? viewportWidth(state)) + (2 * distance) / (zoom > 0 ? zoom : 1));` — R4: com `size`, a largura parte dele; sem, da largura mostrada; o dobro da distância entra dividido pelo zoom. [lê: EST-L01-037 via viewportWidth]
8. `src/editor/view/frame-edge.ts:16` `return showingWidth(state, Math.min(MAX_BREAKPOINT_WIDTH, Math.max(MIN_VIEWPORT_WIDTH, width)));` — a largura presa ao intervalo vai para `showingWidth`.
9. `src/editor/view/breakpoints.ts:41` `export function showingWidth(state: Shown, width: number): Outcome<EditorUi> {` — o quadro mostrando um ecrã desta largura.
10. `src/editor/view/breakpoints.ts:42` `const chosen = breakpointAtWidth(state.document, width);` — o ponto de quebra que segura a largura. [lê: EST-L01-030 via showingWidth]
11. `src/editor/view/breakpoints.ts:43` `return { kind: 'change', ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }, message: message('status.viewport.set', { width, breakpoint: breakpointWords(chosen) }) };` — o `Outcome` com a largura no estado do editor. [escreve: EST-L01-037 via showingWidth]
12. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
15. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
16. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/frame-edge.ts:13` `export const resizeViewport = registerHandler<'view.resizeViewport', EditorUi>('view.resizeViewport', ({ state }, { size, distance }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.resizeViewport` é `always` `manifest/commands/view.json:3189` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/camera.ts:48` `if (stageElement === null) return { left: 0, width: 0 };` — sem palco registrado, a medida é zerada e `zoomOf` toma o `fitZoom` de largura zero; com palco, `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` mede a caixa dele.
- R4 `src/editor/view/frame-edge.ts:15` `const width = Math.round((size ?? viewportWidth(state)) + (2 * distance) / (zoom > 0 ? zoom : 1));` — com `size` no argumento, a largura parte dele; com `size` ausente, da largura mostrada `viewportWidth(state)`; o divisor é o zoom, e zero cai em um `(zoom > 0 ? zoom : 1)`.
- R5 `src/editor/view/frame-edge.ts:16` `return showingWidth(state, Math.min(MAX_BREAKPOINT_WIDTH, Math.max(MIN_VIEWPORT_WIDTH, width)));` — a largura acima do máximo é presa em `MAX_BREAKPOINT_WIDTH`; abaixo do mínimo, em `MIN_VIEWPORT_WIDTH`.
- R6 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque `showingWidth` devolve um estado do editor novo `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via zoomOf, viewportWidth, publish), EST-L01-030 (o documento, via showingWidth), EST-L07-035 (via measure)
- escreve: EST-L01-037 (o estado do editor, via showingWidth, run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.viewportWidth` na largura do arraste e `ui.preferences` no ponto de quebra que a segura `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê a largura `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.
- **DOM do editor:** o quadro toma a largura nova `src/editor/shell/canvas.tsx:302` `style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}` e a alça da borda segue a largura `src/editor/shell/canvas.tsx:310` `<FrameEdge width={pageWidth} />`.
- **DOM do canvas:** nada muda no documento: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a largura e as preferências `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de `view.resizeViewport` (o arraste da borda do quadro) chega à tabela `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,` e envia só o tamanho e a distância do arraste `src/editor/view/frame-edge.ts:13` `({ state }, { size, distance }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/frame-edge.ts:16` `return showingWidth(state, Math.min(MAX_BREAKPOINT_WIDTH, Math.max(MIN_VIEWPORT_WIDTH, width)));`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a largura e as preferências `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/frame-edge.ts:13` `export const resizeViewport = registerHandler<'view.resizeViewport', EditorUi>('view.resizeViewport', ({ state }, { size, distance }) => {`.

## Medições

- MED-0008 — a largura e a borda esquerda do palco, lidas em `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` e `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);`, de que o zoom do arraste e a largura resultante dependem; valor a medir na Fase 6.
