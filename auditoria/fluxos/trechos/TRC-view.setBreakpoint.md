# TRC-view.setBreakpoint

- **Chamada:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ breakpoint }` (`manifest/commands/view.json:708` `"args": {`), com o campo `breakpoint` (tipo `breakpoint`, `manifest/commands/view.json:709` `"breakpoint": {`); as portas das abas e da barra de previsão enviam o id do ponto de quebra (`manifest/commands/view.json:748` `"breakpoint": "desktop"`).
- **Ramos que dependem dos argumentos:** R4 depende de `breakpoint` (se ele existe no projeto); os demais ramos leem o estado.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.setBreakpoint'`; o argumento é `{ breakpoint }`.
2. `src/editor/view/breakpoints.ts:54` `export const setBreakpoint = registerHandler<'view.setBreakpoint', EditorUi>(` — o tratador de `view.setBreakpoint`.
3. `src/editor/view/breakpoints.ts:56` `({ state }, { breakpoint }) => {` — lê o id do ponto de quebra pedido. [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/breakpoints.ts:57` `const chosen = breakpointById(state.document, breakpoint);` — procura o ponto de quebra no documento. [lê: EST-L01-030 via breakpointById]
5. `src/editor/view/breakpoints.ts:58` `if (chosen === undefined) return { kind: 'refused', message: message('status.breakpoints.unknown') };` — R4.
6. `src/editor/view/breakpoints.ts:60` `const said = state.ui.preview !== undefined ? 'status.breakpointPreviewed' : 'status.breakpointActive';` — R5: na previsão, a mensagem diz o ecrã mostrado; fora dela, o ponto de quebra ativo. [lê: EST-L01-037 via handlerContext]
7. `src/editor/view/breakpoints.ts:61` `const { viewportWidth: _width, ...ui } = state.ui;` — separa a largura de ecrã do estado do editor. [lê: EST-L01-037 via handlerContext]
8. `src/editor/view/breakpoints.ts:63` `return { kind: 'change', ui: { ...ui, preferences: choosing(state.ui, chosen) }, message: message(said, { breakpoint: breakpointWords(chosen) }) };` — o `Outcome` com as preferências escolhidas e a largura de ecrã limpa. [escreve: EST-L01-037 via run]
9. `src/editor/view/breakpoints.ts:30` `export function choosing(ui: EditorUi, chosen: Breakpoint): EditorUi['preferences'] {` — as preferências com o ponto de quebra escolhido; o base não é preferência.
10. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
11. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
13. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
14. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/breakpoints.ts:54` `export const setBreakpoint = registerHandler<'view.setBreakpoint', EditorUi>(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.setBreakpoint` é `always` `manifest/commands/view.json:716` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/breakpoints.ts:25` `export const activeBreakpoint = (shown: Shown): Breakpoint => (shown.ui.preferences.breakpoint === undefined ? undefined : breakpointById(shown.document, shown.ui.preferences.breakpoint)) ?? baseBreakpointOf(shown.document);` — a porta marcada é a do ponto de quebra ativo, pelo predicado `current` `src/editor/view/breakpoints.ts:66` `(state, args) => activeBreakpoint(state).id === args.breakpoint,`.
- R4 `src/editor/view/breakpoints.ts:58` `if (chosen === undefined) return { kind: 'refused', message: message('status.breakpoints.unknown') };` — o id pedido não é um ponto de quebra do projeto: o comando é recusado com `status.breakpoints.unknown`; com um id válido, o caminho segue para `src/editor/view/breakpoints.ts:60` `const said = state.ui.preview !== undefined ? 'status.breakpointPreviewed' : 'status.breakpointActive';`.
- R5 `src/editor/view/breakpoints.ts:60` `const said = state.ui.preview !== undefined ? 'status.breakpointPreviewed' : 'status.breakpointActive';` — na previsão, a mensagem é `status.breakpointPreviewed`; fora dela, `status.breakpointActive`.
- R6 `src/editor/view/breakpoints.ts:33` `return chosen.base ? rest : { ...rest, breakpoint: chosen.id };` — o ponto de quebra base não entra nas preferências (só as demais ficam); um ponto de quebra próprio guarda o seu id.
- R7 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque o tratador devolve um objeto de estado do editor novo `src/editor/view/breakpoints.ts:63` `ui: { ...ui, preferences: choosing(state.ui, chosen) }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish), EST-L01-030 (o documento, via breakpointById)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.preferences.breakpoint` no ponto de quebra escolhido (ou sem a chave, para o base) e `ui.viewportWidth` removido `src/editor/view/breakpoints.ts:63` `ui: { ...ui, preferences: choosing(state.ui, chosen) }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a coluna do canvas relê o ponto de quebra ativo `src/editor/shell/canvas.tsx:235` `const breakpoint = useEditorState((s) => activeBreakpoint(s));`.
- **DOM do editor:** a banda do ponto de quebra (fora do base) é redesenhada `src/editor/shell/canvas.tsx:236` `if (breakpoint.base) return null;` e a porta ativa do menu é a do ponto em vigor `src/editor/view/breakpoints.ts:66` `(state, args) => activeBreakpoint(state).id === args.breakpoint,`.
- **DOM do canvas:** o quadro toma a largura do ponto de quebra novo `src/editor/shell/canvas.tsx:302` `style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}`; o documento não muda e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a preferência do ponto de quebra `src/editor/view/breakpoints.ts:63` `ui: { ...ui, preferences: choosing(state.ui, chosen) }`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as onze portas de `view.setBreakpoint` (as cinco abas dos pontos de quebra, as cinco da barra de previsão e a aba do quadro lado a lado) chegam à tabela `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,` e enviam só o id do ponto de quebra `src/editor/view/breakpoints.ts:56` `({ state }, { breakpoint }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/breakpoints.ts:63` `return { kind: 'change', ui: { ...ui, preferences: choosing(state.ui, chosen) }, message: message(said, { breakpoint: breakpointWords(chosen) }) };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a preferência `src/editor/view/breakpoints.ts:63` `preferences: choosing(state.ui, chosen)`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/breakpoints.ts:54` `export const setBreakpoint = registerHandler<'view.setBreakpoint', EditorUi>(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a largura do ponto de quebra vem do documento `src/editor/view/breakpoints.ts:57` `const chosen = breakpointById(state.document, breakpoint);`.
