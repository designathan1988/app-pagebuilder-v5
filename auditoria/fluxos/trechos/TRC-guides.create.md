# TRC-guides.create

- **Chamada:** `src/app/commands.ts:469` `'guides.create': createGuideCommand,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ axis, at }` (`manifest/commands/view.json:2329` `"args": {`), com o campo `axis` (enum `horizontal`/`vertical`, `manifest/commands/view.json:2330` `"axis": {`) e o campo `at` (tipo `number`, `manifest/commands/view.json:2338` `"at": {`).
- **Ramos que dependem dos argumentos:** R3 depende de `at` (se ele é um número finito).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'guides.create'`; o argumento é `{ axis, at }`.
2. `src/core/page/guides.ts:44` `export const createGuideCommand = registerHandler('guides.create', ({ state }, { axis, at }): Outcome<never> => {` — o tratador de `guides.create`. [lê: EST-L01-030 via handlerContext]
3. `src/core/page/guides.ts:47` `if (typeof at !== 'number' || !Number.isFinite(at)) return { kind: 'refused', message: message('status.guides.noPosition') };` — R3.
4. `src/core/page/guides.ts:48` `const page = openedPage(state);` — a página que o editor mostra. [lê: EST-L01-030 via openedPage]
5. `src/core/page/guides.ts:31` `function nextGuideId(document: DocumentJson, axis: Guide['axis'], page: number): string {` — o nome da guia nova: o eixo e o primeiro número livre.
6. `src/core/page/guides.ts:32` `const taken = new Set(guidesOf(document, page).map((g) => g.id));` — os nomes já usados na página. [lê: EST-L01-030 via nextGuideId]
7. `src/core/page/guides.ts:49` `const guide: Guide = { id: nextGuideId(state.document, axis, page), axis, at: place(at) };` — a guia nova, com o eixo do argumento e o lugar arredondado a partir de zero. [lê: EST-L01-030 via nextGuideId]
8. `src/core/page/guides.ts:20` `const place = (at: number) => Math.max(0, Math.round(at));` — o lugar preso a zero ou mais, inteiro.
9. `src/core/page/guides.ts:50` `return { kind: 'change', patches: [guidesPatch(state.document, page, [...guidesOf(state.document, page), guide])], message: message('status.guides.at', { at: guide.at }) };` — o `Outcome` com o remendo que junta a guia nova. [escreve: EST-L01-030 via run]
10. `src/core/page/guides.ts:23` `function guidesPatch(document: DocumentJson, page: number, next: readonly Guide[]): Patch {` — o remendo que faz as guias da página serem estas.
11. `src/core/page/guides.ts:26` `if (next.length === 0) return { op: 'remove', path: [...root, 'guides'] };` — R5: lista vazia, o campo sai.
12. `src/core/page/guides.ts:27` `return held === undefined ? { op: 'add', path: [...root, 'guides'], value: next } : { op: 'replace', path: [...root, 'guides'], value: next };` — R6: sem guias guardadas, o remendo acrescenta; com elas, substitui.
13. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo ao documento. [escreve: EST-L01-030 via run]
14. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — o remendo muda o documento.
15. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como um passo. [escreve: EST-L01-032 via run]
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
18. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/core/page/guides.ts:44` `export const createGuideCommand = registerHandler('guides.create', ({ state }, { axis, at }): Outcome<never> => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `guides.create` é `always` `manifest/commands/view.json:2345` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/page/guides.ts:47` `if (typeof at !== 'number' || !Number.isFinite(at)) return { kind: 'refused', message: message('status.guides.noPosition') };` — `at` não é um número finito (um arraste sem posição): o comando é recusado com `status.guides.noPosition`; com um número, o caminho segue para `src/core/page/guides.ts:48` `const page = openedPage(state);`.
- R4 `src/core/page/guides.ts:47` `if (typeof at !== 'number' || !Number.isFinite(at)) return { kind: 'refused', message: message('status.guides.noPosition') };` — a recusa é publicada pela store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` e devolvida como `status: 'refused'`; o documento não é tocado.
- R5 `src/core/page/guides.ts:26` `if (next.length === 0) return { op: 'remove', path: [...root, 'guides'] };` — a lista de guias ficando vazia, o campo `guides` sai da página (não é o caso de criar, que sempre acrescenta uma).
- R6 `src/core/page/guides.ts:27` `return held === undefined ? { op: 'add', path: [...root, 'guides'], value: next } : { op: 'replace', path: [...root, 'guides'], value: next };` — a página sem `guides` guardados: o remendo acrescenta a lista; com eles: substitui.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (as guias da página em `document.pages[page].tree.guides`)
- escreve: EST-L01-030 (o documento)

## Resultado

- **Estado final:** EST-L01-030 com uma guia nova em `pages[page].tree.guides`, nomeada pelo eixo e pelo primeiro número livre `src/core/page/guides.ts:49` `const guide: Guide = { id: nextGuideId(state.document, axis, page), axis, at: place(at) };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; as guias relêem a lista `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.
- **DOM do editor:** nada do editor muda com a guia nova além do status bar, que mostra a mensagem da store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`.
- **DOM do canvas:** a guia nova é desenhada sobre a página pela leitura `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.

## Regras

- G1: n/a — o comando escreve as guias da página, fora de qualquer camada de estilo; o tratador só monta o remendo `src/core/page/guides.ts:50` `patches: [guidesPatch(state.document, page, [...guidesOf(state.document, page), guide])]`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as três portas de `guides.create` (o arraste da régua de cima, o da régua da esquerda e o botão do diálogo de guias e grelhas) chegam à tabela `src/app/commands.ts:469` `'guides.create': createGuideCommand,` e enviam só o eixo e a posição `src/core/page/guides.ts:44` `({ state }, { axis, at }): Outcome<never> => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador só monta o remendo `src/core/page/guides.ts:50` `return { kind: 'change', patches: [guidesPatch(state.document, page, [...guidesOf(state.document, page), guide])], message: message('status.guides.at', { at: guide.at }) };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a guia `src/core/page/guides.ts:49` `const guide: Guide = { id: nextGuideId(state.document, axis, page), axis, at: place(at) };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando acrescenta uma guia ao documento; a igualdade entre render incremental e render do zero é do renderizador `src/core/store/store.ts:321` `if (next.document !== before.document) {`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar e `manifest/commands/view.json:2353` `"undoable": true,` assenta o passo no histórico.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/core/page/guides.ts:44` `export const createGuideCommand = registerHandler('guides.create', ({ state }, { axis, at }): Outcome<never> => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a posição vem do argumento `src/core/page/guides.ts:20` `const place = (at: number) => Math.max(0, Math.round(at));`.
