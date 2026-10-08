# TRC-project.restoreVersion

- **Chamada:** `src/app/commands.ts:344` `'project.restoreVersion': restoreVersion,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{ version }` — o campo `version` é a revisão da versão salva a restaurar (`manifest/commands/project.json` `"id": "project.restoreVersion",` com `"version"`).
- **Ramos que dependem dos argumentos:** R1 (`version` não encontra versão salva), R2 (o documento da versão é recusado).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/recovery.ts:8` `export const restoreVersion = registerHandler('project.restoreVersion', ({ rules, version }, args) => {` — o tratador.
5. `src/core/project/recovery.ts:9` `const saved = version?.(args.version);` — a versão salva pela revisão. [lê: EST-L01-030 via version]
6. `src/core/store/store.ts:387` `version: (revision) => options.version?.(revision),` — a porta da versão no contexto.
7. `src/editor/store.ts:142` `version: (revision) => options.recovery?.find((v) => String(v.revision) === revision)?.document,` — as versões salvas do autosave.
8. `src/core/project/recovery.ts:10` `if (saved === undefined) throw new Error(` — R1, a versão não existe.
9. `src/core/project/recovery.ts:11` `const read = readProject(saved, rules);` — a leitura pelo leitor único.
10. `src/core/project/archive.ts:18` `export function readProject(parsed: unknown, rules: ModelRules): { readonly document: DocumentJson } | { readonly refused: Message } {` — o leitor.
11. `src/core/project/archive.ts:19` `const migrated = migrateDocument(parsed);` — R3.
12. `src/core/project/archive.ts:26` `if (!Array.isArray(document.pages)) return invalid('it is not a project document');` — R4.
13. `src/core/project/archive.ts:27` `const first = validateDocument(document, [], rules)[0];` — [lê: EST-L01-030 via validateDocument]
14. `src/core/project/archive.ts:28` `if (first !== undefined) return invalid(` — R5, o documento inválido.
15. `src/core/project/archive.ts:29` `return { document };` — o documento aceito.
16. `src/core/project/recovery.ts:12` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — R2.
17. `src/core/project/recovery.ts:13` `return { kind: 'load' as const, document: read.document, message: message('status.save.restored') };` — o Outcome `load`.
18. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {`
19. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish]
20. `src/core/store/store.ts:487` `if (outcome.kind === 'load') {`
21. `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit] [escreve: EST-L01-032 via commit] [escreve: EST-L01-033 via commit]
22. `src/core/store/store.ts:490` `publish(loaded, [{ op: 'replace', path: ['pages'], value: outcome.document.pages }]);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-032 via publish] [escreve: EST-L01-033 via publish]
23. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/recovery.ts:10` `if (saved === undefined) throw new Error(` — revisão sem versão salva: o tratador lança e a store recolhe a falha (`src/core/store/store.ts:436` `const failed = message('status.change.failed', { command: nameOf(command) });`); com versão: segue.
- R2 `src/core/project/recovery.ts:12` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — o leitor recusou o documento: Outcome `refused` com o motivo; aceito: Outcome `load`.
- R3 `src/core/project/archive.ts:20` `if (!migrated.ok) {` — versão mais nova devolve `refused` com `status.open.newerVersion` (`src/core/project/archive.ts:21`), versão sem passo de migração e arquivo que não é documento devolvem `status.open.invalidArchive` (`src/core/project/archive.ts:22`); migração aceita: segue.
- R4 `src/core/project/archive.ts:26` `if (!Array.isArray(document.pages)) return invalid('it is not a project document');` — sem lista de páginas: recusa; com lista: segue.
- R5 `src/core/project/archive.ts:28` `if (first !== undefined) return invalid(` — a validação aponta problema: recusa nomeando `caminho: motivo`; sem problema: devolve o documento (`src/core/project/archive.ts:29`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/project/recovery.ts:8` `export const restoreVersion = registerHandler('project.restoreVersion', ({ rules, version }, args) => {`, sem `await`); a leitura da versão e a validação não abrem timer, quadro nem ouvinte.

## Estado

- lê: EST-L01-030 (o documento, via version, validateDocument), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento restaurado, via commit, publish), EST-L01-031 (a seleção vazia, via commit, publish), EST-L01-032 (o histórico zerado, via commit, publish), EST-L01-033 (a mensagem, via commit, publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish)

## Resultado

- **Estado final:** EST-L01-030 — no ramo `load` o documento passa a ser o da versão nomeada e EST-L01-031 e EST-L01-032 começam vazios (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);`); nos ramos de recusa só EST-L01-033, EST-L01-035 e EST-L01-036 são escritas (`src/core/store/store.ts:451`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro passa a mostrar a página do documento restaurado (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: n/a — o comando troca o documento inteiro, sem gravar estilo nem valor de camada (`src/core/project/recovery.ts:13` `return { kind: 'load' as const, document: read.document, message: message('status.save.restored') };`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/project/recovery.ts:8` `export const restoreVersion = registerHandler('project.restoreVersion', ({ rules, version }, args) => {` — o único tratador do comando.
- G4: n/a — o comando troca o documento; não desenha nada sobre o canvas (`src/core/project/recovery.ts:13`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/recovery.ts:13`).
- G6: ok `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);` — a seleção nova do `load` vem da store.
- G7: n/a — o trecho emite um `load` aplicado pela store (`src/core/store/store.ts:467`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/recovery.ts:8`).

## Medições

- nenhuma
