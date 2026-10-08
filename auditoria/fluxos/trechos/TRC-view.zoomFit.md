# TRC-view.zoomFit

- **Chamada:** `src/app/commands.ts:443` `'view.zoomFit': zoomFit,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:447` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:447` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.zoomFit'`; o argumento é o objeto vazio.
2. `src/editor/view/camera.ts:107` `export const zoomFit = registerHandler<'view.zoomFit', EditorUi>(` — o tratador de `view.zoomFit`.
3. `src/editor/view/camera.ts:110` `const { zoom: _chosen, ...rest } = state.ui.preferences;` — separa o zoom escolhido das demais preferências, para devolver o modo Ajustar. [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/camera.ts:112` `return { kind: 'change', ui: { ...state.ui, preferences: rest, camera: { ...state.ui.camera, panX: 0, pivot: null } }, message: message('status.zoom.fitted', { zoom: Math.round(fitZoom(measure().width, viewportWidth(state)) * 100) }) };` — devolve o estado do editor sem a preferência de zoom, com a câmera zerada, e diz o zoom ajustado. [escreve: EST-L01-037 via run]
5. `src/editor/view/camera.ts:47` `function measure(): Stage {` — a medida do palco, chamada para o zoom ajustado da mensagem.
6. `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` — a caixa do palco. [lê: EST-L07-035 via measure]
7. `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);` — o espaçamento interno e as bordas, descontados da largura. [lê: EST-L07-035 via measure]
8. `src/editor/view/camera.ts:59` `export const fitZoom = (width: number, page: number = BASE_BREAKPOINT.width): number => (width > 0 && page > 0 ? Math.min(1, ZOOM_MAX / 100, Math.max(ZOOM_MIN / 100, (width - 2 * FIT_MARGIN) / page)) : 1);` — o zoom que cabe a página no palco.
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
12. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/camera.ts:107` `export const zoomFit = registerHandler<'view.zoomFit', EditorUi>(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.zoomFit` é `always` `manifest/commands/view.json:449` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/camera.ts:48` `if (stageElement === null) return { left: 0, width: 0 };` — sem palco registrado, a medida é zerada e `fitZoom` de largura zero devolve `1`; com palco, `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` mede a caixa dele.
- R4 `src/editor/view/camera.ts:59` `export const fitZoom = (width: number, page: number = BASE_BREAKPOINT.width): number => (width > 0 && page > 0 ? Math.min(1, ZOOM_MAX / 100, Math.max(ZOOM_MIN / 100, (width - 2 * FIT_MARGIN) / page)) : 1);` — palco e página positivos: o zoom cabe a página, nunca acima de cem por cento; qualquer deles zero: devolve `1`.
- R5 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve `preferences: rest` sem a chave `zoom` `src/editor/view/camera.ts:112` `preferences: rest`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish), EST-L07-035 (via measure)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 sem `ui.preferences.zoom` e com `ui.camera.panX` em zero e `ui.camera.pivot` nulo `src/editor/view/camera.ts:112` `camera: { ...state.ui.camera, panX: 0, pivot: null }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê o zoom `src/editor/shell/canvas.tsx:272` `const chosen = useEditorState((s) => s.ui.preferences.zoom);`.
- **DOM do editor:** sem a preferência de zoom, o quadro passa ao ajuste automático pela largura do palco `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só tira a preferência de zoom e zera a câmera `src/editor/view/camera.ts:112` `camera: { ...state.ui.camera, panX: 0, pivot: null }`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as quatro portas de `view.zoomFit` (Shift+1, o botão da barra de status, o item do menu de zoom e a barra de comandos) chegam à tabela `src/app/commands.ts:443` `'view.zoomFit': zoomFit,` e mandam só a intenção de ajustar `src/editor/view/camera.ts:112` `preferences: rest, camera: { ...state.ui.camera, panX: 0, pivot: null }`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/camera.ts:110` `const { zoom: _chosen, ...rest } = state.ui.preferences;`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só devolve as preferências e a câmera `src/editor/view/camera.ts:112` `camera: { ...state.ui.camera, panX: 0, pivot: null }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/camera.ts:107` `export const zoomFit = registerHandler<'view.zoomFit', EditorUi>(`.

## Medições

- MED-0005 — a largura e a borda esquerda do palco, lidas em `src/editor/view/camera.ts:49` `const box = stageElement.getBoundingClientRect();` e `src/editor/view/camera.ts:50` `const style = getComputedStyle(stageElement);`, de que o zoom ajustado depende; valor a medir na Fase 6.
