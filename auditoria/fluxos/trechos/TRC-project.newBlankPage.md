# TRC-project.newBlankPage

- **Chamada:** `src/app/commands.ts:343` `'project.newBlankPage': newBlankPage,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{}` — o comando não declara argumento (`manifest/commands/project.json` `"id": "project.newBlankPage",` com `"args": {}`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não recebe argumento.

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/project.ts:8` `export const newBlankPage = registerHandler('project.newBlankPage', ({ state, ids, rules, words, confirmed, language }) => {` — o tratador.
5. `src/core/project/project.ts:9` `if (confirmed !== true && !isEmptyProject(state.document)) return { kind: 'confirm' as const };` — R1. [lê: EST-L01-030 via isEmptyProject]
6. `src/core/document/model.ts:262` `export function isEmptyProject(doc: DocumentJson): boolean {` — a decisão de perguntar.
7. `src/core/document/model.ts:266` `return root.children.length === 0 && Object.keys(root.attributes).length === 0 && root.classes.length === 0 && Object.keys(root.styles).length === 0;` — a raiz vazia.
8. `src/core/project/project.ts:10` `const rootLabel = rules.elements.get(rules.root.type)?.labelKey;`
9. `src/core/project/project.ts:11` `if (rootLabel === undefined) throw new Error('newBlankPage: the page root has no label');` — R2.
10. `src/core/project/project.ts:12` `const document = createEmptyDocument(ids, { language: language ?? 'en', page: words('pages.defaultHome'), root: words(rootLabel) }, rules.root);` — [escreve: EST-L01-029 via ids.next]
11. `src/core/document/model.ts:244` `export function createEmptyDocument(ids: IdGenerator, names: EmptyProjectNames, root: { readonly type: ElementType; readonly tag: string }): DocumentJson {` — o documento vazio.
12. `src/core/document/model.ts:251` `id: ids.next(),` — [escreve: EST-L01-029 via ids.next]
13. `src/core/document/model.ts:254` `tree: { id: ids.next(), type: root.type, name: names.root, tag: root.tag, attributes: {}, classes: [], styles: {}, text: null, children: [] },` — [escreve: EST-L01-029 via ids.next]
14. `src/core/project/project.ts:13` `return { kind: 'load' as const, document, message: message('status.project.blankPage') };` — o Outcome `load`.
15. `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {` — o ramo R1.
16. `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` — [escreve: EST-L01-034 via publish]
17. `src/core/store/store.ts:487` `if (outcome.kind === 'load') {`
18. `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit] [escreve: EST-L01-032 via commit] [escreve: EST-L01-033 via commit]
19. `src/core/store/store.ts:490` `publish(loaded, [{ op: 'replace', path: ['pages'], value: outcome.document.pages }]);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish] [escreve: EST-L01-033 via publish]
20. `src/core/store/store.ts:320` `state = next;`
21. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/project.ts:9` `if (confirmed !== true && !isEmptyProject(state.document)) return { kind: 'confirm' as const };` — projeto com trabalho e sem confirmação: o Outcome é `confirm` e a store guarda o despacho (`src/core/store/store.ts:446`); projeto vazio ou já confirmado: segue para a criação do documento.
- R2 `src/core/project/project.ts:11` `if (rootLabel === undefined) throw new Error('newBlankPage: the page root has no label');` — raiz sem rótulo: o tratador lança e a store recolhe a falha (`src/core/store/store.ts:436` `const failed = message('status.change.failed', { command: nameOf(command) });`); raiz rotulada: segue.
- R3 `src/core/document/model.ts:264` `if (page === undefined || others.length > 0 || page.capture !== undefined) return false;` — documento sem página, com mais de uma página ou com página capturada não é o projeto vazio: `isEmptyProject` devolve falso; caso contrário avalia a raiz (`src/core/document/model.ts:266`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/project.ts:8` `export const newBlankPage = registerHandler('project.newBlankPage', ({ state, ids, rules, words, confirmed, language }) => {`, sem `await`); a criação do documento não abre timer, quadro nem ouvinte.

## Estado

- lê: EST-L01-030 (o documento, via isEmptyProject), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento: a página em branco, via commit, publish), EST-L01-031 (a seleção vazia, via commit, publish), EST-L01-032 (o histórico zerado, via commit, publish), EST-L01-033 (a mensagem, via commit, publish), EST-L01-034 (a confirmação pendente, via publish), EST-L01-029

## Resultado

- **Estado final:** EST-L01-030 — no ramo `load` o documento passa a uma página cuja raiz não tem filho e EST-L01-031 e EST-L01-032 começam vazios (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);`); no ramo R1 só EST-L01-034 é escrita.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro passa a mostrar a página nova (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando troca o documento inteiro, sem gravar estilo nem valor de camada (`src/core/project/project.ts:13` `return { kind: 'load' as const, document, message: message('status.project.blankPage') };`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/project/project.ts:8` `export const newBlankPage = registerHandler('project.newBlankPage', ({ state, ids, rules, words, confirmed, language }) => {` — o único tratador do comando.
- G4: n/a — o comando troca o documento; não desenha nada sobre o canvas (`src/core/project/project.ts:13`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/project.ts:13`).
- G6: ok `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — a seleção nova do `load` vem da store.
- G7: n/a — o trecho emite um `load` aplicado pela store (`src/core/store/store.ts:467`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/project.ts:8`).

## Medições

- nenhuma
