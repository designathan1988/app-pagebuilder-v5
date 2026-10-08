# TRC-project.open

- **Chamada:** `src/app/commands.ts:349` `'project.open': openProject,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{ file }` — o campo `file` é o texto do arquivo escolhido (`manifest/commands/project.json` `"id": "project.open",` com `"file"`; a porta lê o arquivo e entrega o texto).
- **Ramos que dependem dos argumentos:** R1 (`file` não é JSON), R2 (`file` é o motivo de um arquivo não lido), R3 (o documento do arquivo é recusado), R4 (o projeto atual tem trabalho e falta confirmação).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/archive.ts:63` `export const openProject = registerHandler('project.open', ({ rules, state, confirmed }, args) => {` — o tratador.
5. `src/core/project/archive.ts:66` `parsed = JSON.parse(args.file);` — R1, o texto vira JSON.
6. `src/core/project/archive.ts:68` `return { kind: 'refused' as const, message: invalid((error as Error).message).refused };` — R1, texto que não é JSON.
7. `src/core/project/archive.ts:71` `const unread = parsed !== null && typeof parsed === 'object' && 'archive' in parsed ? archiveReason((parsed as { archive: unknown }).archive) : null;` — R2.
8. `src/core/project/zip.ts:161` `export function archiveReason(value: unknown): ArchiveReason | null {` — o motivo de arquivo não lido.
9. `src/core/project/archive.ts:72` `if (unread !== null) return { kind: 'refused' as const, message: invalid(unread).refused };` — R2, o motivo do arquivo.
10. `src/core/project/archive.ts:73` `const read = readProject(parsed, rules);` — a leitura pelo leitor único.
11. `src/core/project/archive.ts:18` `export function readProject(parsed: unknown, rules: ModelRules): { readonly document: DocumentJson } | { readonly refused: Message } {` — o leitor.
12. `src/core/project/archive.ts:19` `const migrated = migrateDocument(parsed);` — [lê: EST-L01-030 via migrateDocument]
13. `src/core/project/archive.ts:27` `const first = validateDocument(document, [], rules)[0];` — a validação do documento.
14. `src/core/project/archive.ts:29` `return { document };` — o documento aceito.
15. `src/core/project/archive.ts:74` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — R3.
16. `src/core/project/archive.ts:75` `if (confirmed !== true && !isEmptyProject(state.document)) return { kind: 'confirm' as const };` — R4. [lê: EST-L01-030 via isEmptyProject]
17. `src/core/document/model.ts:262` `export function isEmptyProject(doc: DocumentJson): boolean {` — a decisão de perguntar.
18. `src/core/project/archive.ts:76` `return { kind: 'load' as const, document: read.document, message: message('status.open.opened') };` — o Outcome `load`.
19. `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {`
20. `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` — [escreve: EST-L01-034 via publish]
21. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {`
22. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish]
23. `src/core/store/store.ts:487` `if (outcome.kind === 'load') {`
24. `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit] [escreve: EST-L01-032 via commit] [escreve: EST-L01-033 via commit]
25. `src/core/store/store.ts:490` `publish(loaded, [{ op: 'replace', path: ['pages'], value: outcome.document.pages }]);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish] [escreve: EST-L01-033 via publish]
26. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/archive.ts:66` `parsed = JSON.parse(args.file);` — texto que não é JSON: o `catch` devolve `refused` com `status.open.invalidArchive` (`src/core/project/archive.ts:68`); JSON válido: segue.
- R2 `src/core/project/archive.ts:72` `if (unread !== null) return { kind: 'refused' as const, message: invalid(unread).refused };` — o objeto traz a marca `archive` de arquivo não lido: recusa com o motivo; sem a marca: segue.
- R3 `src/core/project/archive.ts:74` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — o leitor recusou o documento: Outcome `refused`; aceito: segue.
- R4 `src/core/project/archive.ts:75` `if (confirmed !== true && !isEmptyProject(state.document)) return { kind: 'confirm' as const };` — projeto com trabalho e sem confirmação: Outcome `confirm`; projeto vazio ou confirmado: Outcome `load`.
- R5 `src/core/project/archive.ts:20` `if (!migrated.ok) {` — migração recusada: versão mais nova devolve `status.open.newerVersion` (`src/core/project/archive.ts:21` `if (migrated.reason === 'newer') return { refused: message('status.open.newerVersion', { version: migrated.version ?? 0 }) };`), versão sem passo de migração devolve `status.open.invalidArchive` (`src/core/project/archive.ts:22` `if (migrated.reason === 'no-step') return invalid(`); migração aceita: segue.
- R6 `src/core/project/archive.ts:28` `if (first !== undefined) return invalid(` — a validação aponta problema: recusa nomeando `caminho: motivo`; sem problema: devolve o documento (`src/core/project/archive.ts:29`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/core/project/archive.ts:63` `export const openProject = registerHandler('project.open', ({ rules, state, confirmed }, args) => {`, sem `await`); o texto do arquivo já foi lido pela porta antes do despacho.

## Estado

- lê: EST-L01-030 (o documento, via migrateDocument, isEmptyProject), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento aberto, via commit, publish), EST-L01-031 (a seleção vazia, via commit, publish), EST-L01-032 (o histórico zerado, via commit, publish), EST-L01-033 (a mensagem, via commit, publish), EST-L01-034 (a confirmação pendente, via publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish)

## Resultado

- **Estado final:** EST-L01-030 — no ramo `load` o documento passa a ser o do arquivo e EST-L01-031 e EST-L01-032 começam vazios (`src/core/store/store.ts:466`); nos ramos `confirm` e `refused` só EST-L01-034 ou EST-L01-033, EST-L01-035 e EST-L01-036 são escritas (`src/core/store/store.ts:446`, `src/core/store/store.ts:451`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** no ramo `load` o quadro passa a mostrar a página do documento aberto (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando troca o documento inteiro, sem gravar estilo nem valor de camada (`src/core/project/archive.ts:76` `return { kind: 'load' as const, document: read.document, message: message('status.open.opened') };`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/project/archive.ts:63` `export const openProject = registerHandler('project.open', ({ rules, state, confirmed }, args) => {` — o único tratador do comando.
- G4: n/a — o comando troca o documento; não desenha nada sobre o canvas (`src/core/project/archive.ts:76`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/archive.ts:76`).
- G6: ok `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — a seleção nova do `load` vem da store.
- G7: n/a — o trecho emite um `load` aplicado pela store (`src/core/store/store.ts:467`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/archive.ts:63`).

## Medições

- nenhuma
