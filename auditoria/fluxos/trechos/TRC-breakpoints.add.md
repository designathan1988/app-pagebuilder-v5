# TRC-breakpoints.add
- **Chamada:** `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`
- **Argumentos:** um objeto com `width` (número, opcional) e `name` (texto, opcional); o campo ausente chega como `undefined`.
- **Ramos que dependem dos argumentos:** R1 (`width`), R2 (`name`), R4 (`width` já existente), R5 (`name` já em uso).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador de `breakpoints.add`. `[lê: EST-L01-030 via run] [lê: EST-L01-037 via run]`
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. `[lê: EST-L01-030 via argumentRefusal]`
3. `src/core/store/args.ts:79` `for (const [argument, arg] of Object.entries(command.args)) {` — percorre `width` e `name` do manifesto.
4. `src/core/store/args.ts:84` `if (arg.optional || arg.type === 'clipboard') continue;` — ausente e opcional passa; os dois argumentos de `add` são opcionais.
5. `src/editor/view/breakpoint-table.ts:21` `export const addBreakpoint = registerHandler<'breakpoints.add', EditorUi>('breakpoints.add', ({ state, words }, { width, name }) => {` — o tratador recebe o estado, as palavras e os dois argumentos. `[lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]`
6. `src/editor/view/breakpoint-table.ts:23` `const at = typeof width === 'number' && Number.isFinite(width) ? Math.round(width) : viewportWidth(state);` — a largura de destino. `[lê: EST-L01-030 via viewportWidth] [lê: EST-L01-037 via viewportWidth]`
7. `src/editor/view/breakpoints.ts:27` `export const viewportWidth = (shown: Shown): number => shown.ui.viewportWidth ?? activeBreakpoint(shown).width;` — a largura mostrada, da preferência ou do ponto de quebra ativo. `[lê: EST-L01-030 via viewportWidth] [lê: EST-L01-037 via viewportWidth]`
8. `src/editor/view/breakpoints.ts:25` `export const activeBreakpoint = (shown: Shown): Breakpoint => (shown.ui.preferences.breakpoint === undefined ? undefined : breakpointById(shown.document, shown.ui.preferences.breakpoint)) ?? baseBreakpointOf(shown.document);` — o ponto de quebra ativo. `[lê: EST-L01-030 via activeBreakpoint] [lê: EST-L01-037 via activeBreakpoint]`
9. `src/core/document/breakpoints.ts:28` `export const breakpointById = (document: Tabled, id: string): ProjectBreakpoint | undefined => breakpointsOf(document).find((b) => b.id === id);` — procura o id na tabela. `[lê: EST-L01-030 via breakpointById]`
10. `src/core/document/breakpoints.ts:23` `const base = breakpointsOf(document).find((b) => b.base);` — o ponto de quebra base, quando nenhum foi escolhido. `[lê: EST-L01-030 via baseBreakpointOf]`
11. `src/editor/view/breakpoint-table.ts:24` `const made = addedTable(breakpointsOf(state.document), at, typeof name === 'string' ? name : null, words('breakpoints.defaultName', { width: at }), (key) => words(key));` — monta a tabela com o ponto de quebra novo. `[lê: EST-L01-030 via addedTable]`
12. `src/core/document/breakpoints.ts:20` `export const breakpointsOf = (document: Tabled): readonly ProjectBreakpoint[] => document.breakpoints ?? DEFAULT_BREAKPOINTS;` — a tabela do projeto, ou a padrão. `[lê: EST-L01-030 via breakpointsOf]`
13. `src/core/document/breakpoints.ts:83` `if (!Number.isInteger(width) || width < MIN_BREAKPOINT_WIDTH || width > max) return refuse('widthRange', { min: MIN_BREAKPOINT_WIDTH, max });` — largura fora do intervalo recusa com `widthRange`.
14. `src/core/document/breakpoints.ts:85` `if (same !== undefined) return refuse('widthTaken', { width, name: breakpointWords(same) });` — largura já usada recusa com `widthTaken`.
15. `src/core/document/breakpoints.ts:88` `if (typed !== '' && taken.has(typed.toLocaleLowerCase())) return refuse('nameTaken', { name: typed });` — nome já em uso recusa com `nameTaken`.
16. `src/core/document/breakpoints.ts:89` `let chosen = typed !== '' ? typed : named;` — o nome do ponto de quebra novo.
17. `src/core/document/breakpoints.ts:91` `const ids = new Set(table.map((b) => b.id));` — os ids já em uso, para um id livre.
18. `src/core/document/breakpoints.ts:94` `const nearest = [...table].sort((a, b) => Math.abs(a.width - width) - Math.abs(b.width - width))[0] ?? base;` — o ponto de quebra mais próximo, pela altura de tela.
19. `src/core/document/breakpoints.ts:95` `const added: ProjectBreakpoint = { id, name: chosen, width, height: nearest.height, base: false };` — o ponto de quebra montado.
20. `src/core/document/breakpoints.ts:96` `return { table: [...table, added].sort((a, b) => (a.base ? -1 : b.base ? 1 : b.width - a.width)), added };` — a tabela nova, ordenada da mais larga.
21. `src/editor/view/breakpoint-table.ts:25` `if (isRefusal(made)) return refused(made);` — uma recusa de `addedTable` vira a recusa do comando. `[lê: EST-L01-030 via isRefusal]`
22. `src/core/document/breakpoints.ts:178` `export const isRefusal = (value: unknown): value is TableRefusal => value !== null && typeof value === 'object' && 'refused' in value;` — o discriminante da recusa.
23. `src/editor/view/breakpoint-table.ts:14` `const refused = (refusal: TableRefusal): Outcome<EditorUi> => ({` — a mensagem da recusa, com os parâmetros.
24. `src/editor/view/breakpoint-table.ts:26` `const { viewportWidth: _width, ...ui } = state.ui;` — o estado do editor sem a largura temporária. `[lê: EST-L01-037 via handlerContext]`
25. `src/editor/view/breakpoint-table.ts:17` `const tablePatch = (document: DocumentJson, table: readonly ProjectBreakpoint[]): Patch => ({ op: document.breakpoints === undefined ? 'add' : 'replace', path: ['breakpoints'], value: table });` — o patch da tabela: `add` no primeiro câmbio, `replace` depois.
26. `src/editor/view/breakpoint-table.ts:30` `patches: [tablePatch(state.document, made.table)],` — o patch de escrita do documento.
27. `src/editor/view/breakpoint-table.ts:31` `ui: { ...ui, preferences: choosing(state.ui, made.added) },` — as preferências com o ponto de quebra novo escolhido. `[lê: EST-L01-037 via choosing]`
28. `src/editor/view/breakpoints.ts:33` `return chosen.base ? rest : { ...rest, breakpoint: chosen.id };` — o base não é preferência; outro ponto de quebra é.
29. `src/editor/view/breakpoint-table.ts:32` `message: message('status.breakpoints.added', { name: breakpointWords(made.added), width: made.added.width }),` — a mensagem da barra de status.
30. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — o despacho aplica o patch ao documento. `[escreve: EST-L01-030 via run]`
31. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado aos leitores. `[escreve: EST-L01-030 via run]`

## Ramos

- R1 `src/editor/view/breakpoint-table.ts:23` `const at = typeof width === 'number' && Number.isFinite(width) ? Math.round(width) : viewportWidth(state);` — lado verdadeiro (`width` é número): `at` é a largura arredondada; lado falso (ausente ou texto): `at` é a largura que o canvas mostra.
- R2 `src/editor/view/breakpoint-table.ts:24` `const made = addedTable(breakpointsOf(state.document), at, typeof name === 'string' ? name : null, words('breakpoints.defaultName', { width: at }), (key) => words(key));` — lado verdadeiro: o nome do argumento; lado falso: `null`, e o ponto de quebra leva o nome do catálogo.
- R3 `src/core/document/breakpoints.ts:83` `if (!Number.isInteger(width) || width < MIN_BREAKPOINT_WIDTH || width > max) return refuse('widthRange', { min: MIN_BREAKPOINT_WIDTH, max });` — lado verdadeiro (fora do intervalo): recusa `widthRange`; lado falso: segue para o nome.
- R4 `src/core/document/breakpoints.ts:85` `if (same !== undefined) return refuse('widthTaken', { width, name: breakpointWords(same) });` — lado verdadeiro (a largura já existe): recusa `widthTaken`; lado falso: segue.
- R5 `src/core/document/breakpoints.ts:88` `if (typed !== '' && taken.has(typed.toLocaleLowerCase())) return refuse('nameTaken', { name: typed });` — lado verdadeiro (o nome já é mostrado): recusa `nameTaken`; lado falso: segue para a montagem.
- R6 `src/editor/view/breakpoint-table.ts:25` `if (isRefusal(made)) return refused(made);` — lado verdadeiro: o comando devolve `kind: 'refused'`; lado falso: devolve `kind: 'change'` com o patch e as preferências.

## Fronteiras assíncronas

- nenhuma — o tratador e cada função que ele chama são síncronos; `src/editor/view/breakpoint-table.ts:21` `export const addBreakpoint = registerHandler<'breakpoints.add', EditorUi>('breakpoints.add', ({ state, words }, { width, name }) => {` devolve um `Outcome` sem `await`, `.then` ou temporizador, e o despacho `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` lê o resultado no mesmo passo.

## Estado

- **Lê:** EST-L01-030 e EST-L01-037 (o estado da store: o documento e o estado do editor).
- **Escreve:** EST-L01-030 e EST-L01-037 (o documento pela tabela de breakpoints e o estado do editor pelas preferências).

## Resultado

- **Estado final:** o documento leva a tabela nova `src/editor/view/breakpoint-table.ts:30` `patches: [tablePatch(state.document, made.table)],` e as preferências guardam o ponto de quebra novo `src/editor/view/breakpoint-table.ts:31` `ui: { ...ui, preferences: choosing(state.ui, made.added) },`.
- **Re-renderizado:** `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` avisa os assinantes do documento e do estado.
- **DOM do editor:** a barra de abas relê a tabela `src/editor/shell/breakpoint-tabs.tsx:51` `const table = useEditorState((s) => breakpointsOf(s.document));`.
- **DOM do canvas:** a largura da moldura vem da tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.

## Regras

- G1: n/a — a alteração escreve a tabela de breakpoints do documento, fora das camadas (ponto de quebra, estado, classe, quadro-chave) que o contexto de edição nomeia `src/editor/view/breakpoint-table.ts:17` `const tablePatch = (document: DocumentJson, table: readonly ProjectBreakpoint[]): Patch => ({ op: document.breakpoints === undefined ? 'add' : 'replace', path: ['breakpoints'], value: table });`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` mantém a digitação pendente antes do comando que muda o documento, e `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok `src/editor/view/breakpoint-table.ts:21` `export const addBreakpoint = registerHandler<'breakpoints.add', EditorUi>('breakpoints.add', ({ state, words }, { width, name }) => {` — um só tratador; as duas portas enviam só o comando, `manifest/commands/breakpoints.json:41` `"kind": "menu",` e `manifest/commands/breakpoints.json:63` `"kind": "panel-control",`.
- G4: n/a — o trecho não age sobre um ponto do canvas; a porta é um controle de diálogo `manifest/commands/breakpoints.json:63` `"kind": "panel-control",`.
- G5: n/a — o trecho não monta painel nem barra; grava o documento e as preferências `src/editor/view/breakpoint-table.ts:31` `ui: { ...ui, preferences: choosing(state.ui, made.added) },`.
- G6: n/a — o trecho não escreve seleção; a store mantém a anterior `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o desenho do canvas não é exercido no trecho; a moldura lê a mesma tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — todo commit valida o documento e a seleção.

## Limpeza

- Nenhum ouvinte, temporizador ou observador é criado no trecho `src/editor/view/breakpoint-table.ts:21` `export const addBreakpoint = registerHandler<'breakpoints.add', EditorUi>('breakpoints.add', ({ state, words }, { width, name }) => {`; não há remoção a citar.

## Medições

- nenhuma
