# TRC-view.zoomAt

- **Chamada:** `src/app/commands.ts:444` `'view.zoomAt': zoomAt,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ factor, point }` (`manifest/commands/view.json:550` `"args": {`), com o campo `factor` (tipo `number`, `manifest/commands/view.json:551` `"factor": {`) e o campo `point` (tipo `point`, `manifest/commands/view.json:556` `"point": {`).
- **Ramos que dependem dos argumentos:** R4 depende de `factor` (se ele muda o número inteiro do zoom); o valor de `point` decide o pivô que `zoomTo` recebe, sem mudar o caminho tomado.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.zoomAt'`; o argumento é `{ factor, point }`.
2. `src/editor/view/camera.ts:118` `export const zoomAt = registerHandler<'view.zoomAt', EditorUi>('view.zoomAt', ({ state }, { factor, point }) => {` — o tratador da roda com Ctrl.
3. `src/editor/view/camera.ts:119` `const now = zoomOf(state) * 100;` — o zoom mostrado, em por cento. [lê: EST-L01-037 via zoomOf]
4. `src/editor/view/camera.ts:62` `export const zoomOf = (shown: Shown, width: number = measure().width): number => (shown.ui.preferences.zoom !== undefined ? shown.ui.preferences.zoom / 100 : fitZoom(width, viewportWidth(shown)));` — o zoom escolhido, ou o que cabe no palco. [lê: EST-L01-037 via zoomOf] [lê: EST-L07-035 via measure]
5. `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` — a caixa do palco, medida pelo valor por omissão de `zoomOf`. [lê: EST-L07-035 via measure]
6. `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);` — o espaçamento interno e as bordas do palco. [lê: EST-L07-035 via measure]
7. `src/editor/view/camera.ts:120` `const next = clamp(now * factor);` — o zoom vezes o fator da roda, preso entre o mínimo e o máximo.
8. `src/editor/view/camera.ts:121` `if (next === Math.round(now)) return (factor > 1 && next === ZOOM_MAX) || (factor < 1 && next === ZOOM_MIN) ? { kind: 'refused', message: message('status.zoom.limit') } : { kind: 'change' };` — R4.
9. `src/editor/view/camera.ts:122` `return zoomTo(state, next, point);` — sem no limite, o zoom vai para `zoomTo` pivô no ponto da roda.
10. `src/editor/view/camera.ts:76` `function zoomTo(state: StoreState<EditorUi>, percent: number, pivot: { readonly x: number; readonly y: number } | null = null): Outcome<EditorUi> {` — o zoom para um por cento, mantendo o ponto sob o pivô.
11. `src/editor/view/camera.ts:77` `const stage = measure();` [lê: EST-L07-035 via measure]
12. `src/editor/view/camera.ts:80` `const at = pivot !== null ? pivot.x - stage.left : stage.width / 2;` — R5: com o ponto da roda, o pivô pousa nele; sem, no meio do palco.
13. `src/editor/view/camera.ts:83` `const ui: EditorUi = { ...state.ui, preferences: { ...state.ui.preferences, zoom: percent }, camera };` — o estado do editor com o zoom novo. [escreve: EST-L01-037 via zoomTo]
14. `src/editor/view/camera.ts:84` `return { kind: 'change', ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }, message: message('status.zoom.set', { zoom: percent }) };` — o `Outcome` com o estado do editor novo. [escreve: EST-L01-037 via zoomTo]
15. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
16. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
18. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
19. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/camera.ts:118` `export const zoomAt = registerHandler<'view.zoomAt', EditorUi>('view.zoomAt', ({ state }, { factor, point }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.zoomAt` é `always` `manifest/commands/view.json:563` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/camera.ts:48` `if (stageElement === null) return { left: 0, width: 0 };` — sem palco registrado, a medida é zerada e o pivô cai numa largura zero; com palco, `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` mede a caixa dele.
- R4 `src/editor/view/camera.ts:121` `if (next === Math.round(now)) return (factor > 1 && next === ZOOM_MAX) || (factor < 1 && next === ZOOM_MIN) ? { kind: 'refused', message: message('status.zoom.limit') } : { kind: 'change' };` — com `factor` maior que um e o zoom já no máximo, ou `factor` menor que um e o zoom já no mínimo, a roda é recusada com `status.zoom.limit`; com `factor` que muda o número inteiro do zoom, o caminho segue para `src/editor/view/camera.ts:122` `return zoomTo(state, next, point);`; com um `factor` que não muda o número inteiro fora dos limites, devolve `change` sem tocar o documento.
- R5 `src/editor/view/camera.ts:80` `const at = pivot !== null ? pivot.x - stage.left : stage.width / 2;` — com o `point` da roda, o pivô pousa no ponto informado; sem pivô, no meio do palco.
- R6 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve sempre um estado do editor novo `src/editor/view/camera.ts:84` `ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via zoomOf, publish), EST-L07-035 (via measure)
- escreve: EST-L01-037 (o estado do editor, via zoomTo, run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.preferences.zoom` no número resultante e `ui.camera.panX`/`ui.camera.pivot` recalculados `src/editor/view/camera.ts:84` `ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê o zoom `src/editor/shell/canvas.tsx:272` `const chosen = useEditorState((s) => s.ui.preferences.zoom);`.
- **DOM do editor:** o quadro toma a largura do zoom novo `src/editor/shell/canvas.tsx:302` `style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}` e o zoom mostrado é o escolhido `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava o zoom e a câmera `src/editor/view/camera.ts:83` `const ui: EditorUi = { ...state.ui, preferences: { ...state.ui.preferences, zoom: percent }, camera };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de `view.zoomAt` (a roda com Ctrl sobre o canvas) chega à tabela `src/app/commands.ts:444` `'view.zoomAt': zoomAt,` e envia só o fator da roda e o ponto dela `src/editor/view/camera.ts:118` `({ state }, { factor, point }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/camera.ts:122` `return zoomTo(state, next, point);`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o zoom `src/editor/view/camera.ts:83` `const ui: EditorUi = { ...state.ui, preferences: { ...state.ui.preferences, zoom: percent }, camera };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/camera.ts:118` `export const zoomAt = registerHandler<'view.zoomAt', EditorUi>('view.zoomAt', ({ state }, { factor, point }) => {`.

## Medições

- MED-0006 — a largura e a borda esquerda do palco, lidas em `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` e `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);`, de que o ponto do pivô e o piso da roda dependem; valor a medir na Fase 6.
