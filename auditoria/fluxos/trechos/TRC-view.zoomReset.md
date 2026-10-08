# TRC-view.zoomReset

- **Chamada:** `src/app/commands.ts:441` `'view.zoomReset': zoomReset,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:195` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:195` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.zoomReset'`; o argumento é o objeto vazio.
2. `src/editor/view/camera.ts:97` `export const zoomReset = registerHandler<'view.zoomReset', EditorUi>('view.zoomReset', ({ state }) => zoomTo(state, 100));` — o tratador leva o zoom a cem por cento. [lê: EST-L01-037 via zoomTo]
3. `src/editor/view/camera.ts:76` `function zoomTo(state: StoreState<EditorUi>, percent: number, pivot: { readonly x: number; readonly y: number } | null = null): Outcome<EditorUi> {` — o zoom para um por cento, com pivô nulo.
4. `src/editor/view/camera.ts:77` `const stage = measure();` — a medida do palco. [lê: EST-L07-035 via measure]
5. `src/editor/view/camera.ts:47` `function measure(): Stage {` — a medida do palco registrado.
6. `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` — a caixa do palco. [lê: EST-L07-035 via measure]
7. `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);` — o espaçamento interno e as bordas, descontados da largura. [lê: EST-L07-035 via measure]
8. `src/editor/view/camera.ts:78` `const before = zoomOf(state, stage.width);` — o zoom mostrado antes. [lê: EST-L01-037 via zoomOf]
9. `src/editor/view/camera.ts:83` `const ui: EditorUi = { ...state.ui, preferences: { ...state.ui.preferences, zoom: percent }, camera };` — o estado do editor com o zoom em cem por cento. [escreve: EST-L01-037 via zoomTo]
10. `src/editor/view/camera.ts:84` `return { kind: 'change', ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }, message: message('status.zoom.set', { zoom: percent }) };` — o `Outcome` com o estado do editor novo. [escreve: EST-L01-037 via zoomTo]
11. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
12. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo e a mensagem nova tornam `changed` verdadeiro.
13. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
14. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
15. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/camera.ts:97` `export const zoomReset = registerHandler<'view.zoomReset', EditorUi>('view.zoomReset', ({ state }) => zoomTo(state, 100));`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.zoomReset` é `always` `manifest/commands/view.json:197` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/camera.ts:48` `if (stageElement === null) return { left: 0, width: 0 };` — sem palco registrado, a medida é zerada e o deslocamento vem de uma largura zero; com palco, `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` mede a caixa dele.
- R4 `src/editor/view/camera.ts:80` `const at = pivot !== null ? pivot.x - stage.left : stage.width / 2;` — sem pivô, o zoom centra no meio do palco `stage.width / 2`; com pivô, ele pousa no ponto informado.
- R5 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve sempre um estado do editor novo `src/editor/view/camera.ts:84` `ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via zoomTo, zoomOf, publish), EST-L07-035 (via measure)
- escreve: EST-L01-037 (o estado do editor, via zoomTo, run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.preferences.zoom` em cem e `ui.camera.panX` recalculado `src/editor/view/camera.ts:84` `ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê o zoom `src/editor/shell/canvas.tsx:272` `const chosen = useEditorState((s) => s.ui.preferences.zoom);`.
- **DOM do editor:** o quadro toma a largura do zoom novo `src/editor/shell/canvas.tsx:302` `style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}` e o zoom mostrado é o escolhido `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava o zoom e a câmera `src/editor/view/camera.ts:83` `const ui: EditorUi = { ...state.ui, preferences: { ...state.ui.preferences, zoom: percent }, camera };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as duas portas de `view.zoomReset` (Ctrl+0 e a barra de comandos) chegam à tabela `src/app/commands.ts:441` `'view.zoomReset': zoomReset,` e mandam só a intenção de voltar a cem por cento `src/editor/view/camera.ts:97` `({ state }) => zoomTo(state, 100)`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/camera.ts:84` `return { kind: 'change', ui: { ...ui, camera: { ...camera, panX: panOf({ ...state, ui }, after) } }, message: message('status.zoom.set', { zoom: percent }) };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o zoom `src/editor/view/camera.ts:83` `const ui: EditorUi = { ...state.ui, preferences: { ...state.ui.preferences, zoom: percent }, camera };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/camera.ts:97` `export const zoomReset = registerHandler<'view.zoomReset', EditorUi>('view.zoomReset', ({ state }) => zoomTo(state, 100));`.

## Medições

- MED-0003 — a largura e a borda esquerda do palco, lidas em `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` e `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);`, de que o deslocamento em cem por cento depende; valor a medir na Fase 6.
