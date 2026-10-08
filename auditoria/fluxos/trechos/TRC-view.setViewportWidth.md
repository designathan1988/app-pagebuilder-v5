# TRC-view.setViewportWidth

- **Chamada:** `src/app/commands.ts:447` `'view.setViewportWidth': setViewportWidth,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ width }` (`manifest/commands/view.json:3124` `"args": {`), com o campo `width` (tipo `number`, `manifest/commands/view.json:3125` `"width": {`); a única porta (o campo de largura do painel de ferramentas) envia a largura digitada.
- **Ramos que dependem dos argumentos:** R4 depende de `width` (se ele cabe no intervalo aceito).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.setViewportWidth'`; o argumento é `{ width }`.
2. `src/editor/view/breakpoints.ts:46` `export const setViewportWidth = registerHandler<'view.setViewportWidth', EditorUi>('view.setViewportWidth', ({ state }, { width }) => {` — o tratador de `view.setViewportWidth`. [lê: EST-L01-037 via handlerContext]
3. `src/editor/view/breakpoints.ts:47` `if (!Number.isFinite(width) || width < MIN_VIEWPORT_WIDTH || width > MAX_BREAKPOINT_WIDTH) return { kind: 'refused', message: message('status.viewport.invalid') };` — R4.
4. `src/editor/view/breakpoints.ts:48` `return showingWidth(state, Math.round(width));` — a largura dentro do intervalo vai para `showingWidth`, arredondada.
5. `src/editor/view/breakpoints.ts:41` `export function showingWidth(state: Shown, width: number): Outcome<EditorUi> {` — o quadro mostrando um ecrã desta largura.
6. `src/editor/view/breakpoints.ts:42` `const chosen = breakpointAtWidth(state.document, width);` — o ponto de quebra que segura a largura. [lê: EST-L01-030 via showingWidth]
7. `src/editor/view/breakpoints.ts:43` `return { kind: 'change', ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }, message: message('status.viewport.set', { width, breakpoint: breakpointWords(chosen) }) };` — o `Outcome` com a largura no estado do editor e as preferências do ponto de quebra. [escreve: EST-L01-037 via showingWidth]
8. `src/editor/view/breakpoints.ts:30` `export function choosing(ui: EditorUi, chosen: Breakpoint): EditorUi['preferences'] {` — as preferências com o ponto de quebra escolhido.
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
12. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/breakpoints.ts:46` `export const setViewportWidth = registerHandler<'view.setViewportWidth', EditorUi>('view.setViewportWidth', ({ state }, { width }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.setViewportWidth` é `always` `manifest/commands/view.json:3132` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — o tratador pode devolver `refused` no R4; então a store publica a mensagem da recusa e devolve `status: 'refused'` `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`.
- R4 `src/editor/view/breakpoints.ts:47` `if (!Number.isFinite(width) || width < MIN_VIEWPORT_WIDTH || width > MAX_BREAKPOINT_WIDTH) return { kind: 'refused', message: message('status.viewport.invalid') };` — largura não finita, menor que `MIN_VIEWPORT_WIDTH` ou maior que `MAX_BREAKPOINT_WIDTH`: o comando é recusado com `status.viewport.invalid`; dentro do intervalo, o caminho segue para `src/editor/view/breakpoints.ts:48` `return showingWidth(state, Math.round(width));`.
- R5 `src/editor/view/breakpoints.ts:33` `return chosen.base ? rest : { ...rest, breakpoint: chosen.id };` — o ponto de quebra que segura a largura sendo o base, as preferências ficam sem a chave; sendo próprio, guardam o seu id.
- R6 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque `showingWidth` devolve um estado do editor novo `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish), EST-L01-030 (o documento, via showingWidth)
- escreve: EST-L01-037 (o estado do editor, via showingWidth, run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.viewportWidth` na largura pedida e `ui.preferences` no ponto de quebra que a segura `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; o campo de largura relê o valor `src/editor/shell/viewport-width.tsx:13` `const width = useEditorState((s) => viewportWidth(s));`.
- **DOM do editor:** o campo de largura mostra a largura nova `src/editor/shell/viewport-width.tsx:13` `const width = useEditorState((s) => viewportWidth(s));` e o quadro toma essa largura `src/editor/shell/canvas.tsx:302` `style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}`.
- **DOM do canvas:** nada muda no documento: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso; a página dentro do quadro passa a ter a largura do ecrã novo.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a largura e as preferências `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de `view.setViewportWidth` (o campo de largura do painel de ferramentas) chega à tabela `src/app/commands.ts:447` `'view.setViewportWidth': setViewportWidth,` e envia só a largura digitada `src/editor/view/breakpoints.ts:46` `({ state }, { width }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/breakpoints.ts:43` `return { kind: 'change', ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }, message: message('status.viewport.set', { width, breakpoint: breakpointWords(chosen) }) };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a largura e as preferências `src/editor/view/breakpoints.ts:43` `ui: { ...state.ui, viewportWidth: width, preferences: choosing(state.ui, chosen) }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/breakpoints.ts:46` `export const setViewportWidth = registerHandler<'view.setViewportWidth', EditorUi>('view.setViewportWidth', ({ state }, { width }) => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o ponto de quebra que segura a largura vem do documento `src/editor/view/breakpoints.ts:42` `const chosen = breakpointAtWidth(state.document, width);`.
