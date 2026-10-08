# TRC-project.openFolder

- **Chamada:** `src/app/commands.ts:350` `'project.openFolder': openFolderCommand,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{ folder }` — o campo `folder` é a pasta que a porta leu (nome e arquivos), não a forma declarada no manifesto (`manifest/commands/project.json` `"id": "project.openFolder",` com `"folder"`).
- **Ramos que dependem dos argumentos:** R1 (pasta sem arquivo), R2 (os arquivos não formam página ou trazem arquivo não lido), R3 (o projeto atual tem trabalho e falta confirmação), R4 (a pasta não tem `index.html`).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/import/folder.ts:190` `export const openFolderCommand = registerHandler('project.openFolder', (context, { folder }) => {` — o tratador.
5. `src/core/import/folder.ts:192` `const wanted = folder as unknown as FolderImport | undefined;`
6. `src/core/import/folder.ts:193` `const read = importFolder({ name: wanted?.name ?? '', files: wanted?.files ?? [] }, context);` — a leitura da pasta.
7. `src/core/import/folder.ts:95` `const files = folder.files.filter((file) => file.path !== '');`
8. `src/core/import/folder.ts:96` `if (files.length === 0) return { refused: message('status.folder.unsupported') };` — R1.
9. `src/core/import/folder.ts:100` `const refused = pickedRefusal(picked);` — R2.
10. `src/core/import/import.ts:1658` `export function pickedRefusal(picked: readonly PickedFile[]): Message | null {` — a recusa antes de ler.
11. `src/core/import/folder.ts:101` `if (refused !== null) return { refused };` — R2, a recusa.
12. `src/core/import/folder.ts:102` `const site = importedSite(context, picked, true);` — os arquivos viram as páginas.
13. `src/core/import/import.ts:1673` `export function importedSite<Ui>(context: HandlerContext<Ui>, picked: readonly PickedFile[], replacing: boolean): ImportedSite {` — o leitor de HTML.
14. `src/core/import/folder.ts:145` `if (!pages.some((page) => page.file === 'index.html')) {` — R4.
15. `src/core/import/folder.ts:147` `const root: DocNode = { id: ids.next(), type: rules.root.type, name, tag: rules.root.tag, attributes: {}, classes: [], styles: {}, text: null, children: [] };` — [escreve: EST-L01-029 via ids.next]
16. `src/core/import/folder.ts:148` `pages.unshift({ id: ids.next(), name, file: 'index.html', tree: root });` — [escreve: EST-L01-029 via ids.next]
17. `src/core/import/folder.ts:170` `return { document, report };` — o documento e o relatório.
18. `src/core/import/folder.ts:194` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — R2, a recusa da leitura.
19. `src/core/import/folder.ts:195` `if (context.confirmed !== true && !isEmptyProject(context.state.document)) return { kind: 'confirm' as const };` — R3. [lê: EST-L01-030 via isEmptyProject]
20. `src/core/document/model.ts:262` `export function isEmptyProject(doc: DocumentJson): boolean {` — a decisão de perguntar.
21. `src/core/import/folder.ts:197` `return { kind: 'load' as const, document: { ...read.document, ...projectLanguages(context.state.document) }, message: reportMessage(wanted?.name ?? '', read.report) };` — o Outcome `load`.
22. `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {`
23. `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` — [escreve: EST-L01-034 via publish]
24. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {`
25. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish]
26. `src/core/store/store.ts:487` `if (outcome.kind === 'load') {`
27. `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit] [escreve: EST-L01-032 via commit] [escreve: EST-L01-033 via commit]
28. `src/core/store/store.ts:490` `publish(loaded, [{ op: 'replace', path: ['pages'], value: outcome.document.pages }]);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish] [escreve: EST-L01-033 via publish]
29. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/import/folder.ts:96` `if (files.length === 0) return { refused: message('status.folder.unsupported') };` — pasta sem arquivo: recusa com `status.folder.unsupported`; com arquivo: segue.
- R2 `src/core/import/folder.ts:101` `if (refused !== null) return { refused };` — `pickedRefusal` devolve arquivo não lido ou pasta sem página: a leitura para e `openFolderCommand` recusa (`src/core/import/folder.ts:194`); sem recusa: segue.
- R3 `src/core/import/folder.ts:195` `if (context.confirmed !== true && !isEmptyProject(context.state.document)) return { kind: 'confirm' as const };` — projeto com trabalho e sem confirmação: Outcome `confirm`; projeto vazio ou confirmado: Outcome `load`.
- R4 `src/core/import/folder.ts:145` `if (!pages.some((page) => page.file === 'index.html')) {` — pasta sem `index.html`: uma página inicial vazia é criada com nomes novos (`src/core/import/folder.ts:147`, `src/core/import/folder.ts:148`); com `index.html`: as páginas da pasta bastam.
- R5 `src/core/import/folder.ts:118` `if (!pathGenerated(file.path)) continue;` — arquivo cujo caminho pertence a um gerado muda de nome (`src/core/import/folder.ts:119`); os outros ficam no caminho próprio.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/core/import/folder.ts:190` `export const openFolderCommand = registerHandler('project.openFolder', (context, { folder }) => {`, sem `await`); a porta já leu a pasta antes do despacho.

## Estado

- lê: EST-L01-030 (o documento, via isEmptyProject), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento da pasta, via commit, publish), EST-L01-031 (a seleção vazia, via commit, publish), EST-L01-032 (o histórico zerado, via commit, publish), EST-L01-033 (a mensagem, via commit, publish), EST-L01-034 (a confirmação pendente, via publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish), EST-L01-029

## Resultado

- **Estado final:** EST-L01-030 — no ramo `load` o documento passa a ser o da pasta e EST-L01-031 e EST-L01-032 começam vazios (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);`); nos ramos `confirm` e `refused` só EST-L01-034 ou EST-L01-033, EST-L01-035 e EST-L01-036 são escritas.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** no ramo `load` o quadro passa a mostrar a página do documento da pasta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando troca o documento inteiro, sem gravar estilo nem valor de camada (`src/core/import/folder.ts:197` `return { kind: 'load' as const, document: { ...read.document, ...projectLanguages(context.state.document) }, message: reportMessage(wanted?.name ?? '', read.report) };`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/import/folder.ts:190` `export const openFolderCommand = registerHandler('project.openFolder', (context, { folder }) => {` — o único tratador do comando.
- G4: n/a — o comando troca o documento; não desenha nada sobre o canvas (`src/core/import/folder.ts:197`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/import/folder.ts:197`).
- G6: ok `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — a seleção nova do `load` vem da store.
- G7: n/a — o trecho emite um `load` aplicado pela store (`src/core/store/store.ts:467`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/import/folder.ts:190`).

## Medições

- nenhuma
