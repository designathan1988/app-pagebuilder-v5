# TRC-breakpoints.rename
- **Chamada:** `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`
- **Argumentos:** um objeto com `breakpoint` (um id da tabela, obrigatório) e `name` (texto, obrigatório).
- **Ramos que dependem dos argumentos:** R1 (`breakpoint`), R2 (`name`), R4 (`name` vazio), R5 (`name` já em uso).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador de `breakpoints.rename`. `[lê: EST-L01-030 via run] [lê: EST-L01-037 via run]`
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. `[lê: EST-L01-030 via argumentRefusal]`
3. `src/core/store/args.ts:79` `for (const [argument, arg] of Object.entries(command.args)) {` — percorre `breakpoint` e `name`.
4. `src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';` — o id do `breakpoint` precisa ser da tabela do projeto.
5. `src/core/store/args.ts:67` `return typeof value === 'string' ? 'fits' : 'invalid';` — `name`, texto.
6. `src/editor/view/breakpoint-table.ts:36` `export const renameBreakpoint = registerHandler<'breakpoints.rename', EditorUi>('breakpoints.rename', ({ state, words }, { breakpoint, name }) => {` — o tratador recebe o estado e os dois argumentos. `[lê: EST-L01-030 via handlerContext]`
7. `src/editor/view/breakpoint-table.ts:37` `const held = breakpointById(state.document, breakpoint);` — procura o ponto de quebra na tabela. `[lê: EST-L01-030 via breakpointById]`
8. `src/core/document/breakpoints.ts:28` `export const breakpointById = (document: Tabled, id: string): ProjectBreakpoint | undefined => breakpointsOf(document).find((b) => b.id === id);` — a busca na tabela do projeto.
9. `src/editor/view/breakpoint-table.ts:38` `if (held === undefined) return unknown();` — um id que a tabela não tem é recusado. `[lê: EST-L01-030 via handlerContext]`
10. `src/editor/view/breakpoint-table.ts:19` `const unknown = (): Outcome<EditorUi> => ({ kind: 'refused', message: message('status.breakpoints.unknown') });` — a mensagem `status.breakpoints.unknown`.
11. `src/editor/view/breakpoint-table.ts:39` `const table = renamedTable(breakpointsOf(state.document), breakpoint, typeof name === 'string' ? name : '', (key) => words(key));` — monta a tabela com o nome novo. `[lê: EST-L01-030 via renamedTable]`
12. `src/core/document/breakpoints.ts:20` `export const breakpointsOf = (document: Tabled): readonly ProjectBreakpoint[] => document.breakpoints ?? DEFAULT_BREAKPOINTS;` — a tabela do projeto, ou a padrão. `[lê: EST-L01-030 via breakpointsOf]`
13. `src/core/document/breakpoints.ts:101` `export function renamedTable(table: readonly ProjectBreakpoint[], id: string, name: string, words: (key: MessageId) => string): readonly ProjectBreakpoint[] | TableRefusal {` — a função do nome novo.
14. `src/core/document/breakpoints.ts:103` `if (typed === '') return refuse('nameEmpty');` — nome vazio recusa com `nameEmpty`.
15. `src/core/document/breakpoints.ts:104` `if (table.some((b) => b.id !== id && breakpointName(b, words).toLocaleLowerCase() === typed.toLocaleLowerCase())) return refuse('nameTaken', { name: typed });` — nome já mostrado recusa com `nameTaken`.
16. `src/core/document/breakpoints.ts:105` `const label = defaultLabelOf(id);` — o rótulo do catálogo, quando o id é um ponto de quebra padrão.
17. `src/core/document/breakpoints.ts:107` `return table.map((b) => (b.id === id ? { ...b, name: next } : b));` — a tabela com o nome novo no id.
18. `src/editor/view/breakpoint-table.ts:40` `if (isRefusal(table)) return refused(table);` — uma recusa de `renamedTable` vira a recusa do comando. `[lê: EST-L01-030 via isRefusal]`
19. `src/editor/view/breakpoint-table.ts:14` `const refused = (refusal: TableRefusal): Outcome<EditorUi> => ({` — a mensagem da recusa.
20. `src/editor/view/breakpoint-table.ts:41` `const renamed = table.find((b) => b.id === breakpoint) ?? held;` — o ponto de quebra como ficou.
21. `src/editor/view/breakpoint-table.ts:42` `if (renamed.name === held.name) return { kind: 'change' };` — nome igual ao de antes: um `change` sem patch e sem mensagem.
22. `src/editor/view/breakpoint-table.ts:43` `return { kind: 'change', patches: [tablePatch(state.document, table)], message: message('status.breakpoints.renamed', { name: breakpointWords(renamed) }) };` — o patch da tabela e a mensagem; sem `ui`, as preferências ficam como estão.
23. `src/editor/view/breakpoint-table.ts:17` `const tablePatch = (document: DocumentJson, table: readonly ProjectBreakpoint[]): Patch => ({ op: document.breakpoints === undefined ? 'add' : 'replace', path: ['breakpoints'], value: table });` — o patch de escrita: `replace` desde a primeira mudança da tabela própria.
24. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — o despacho aplica o patch ao documento. `[escreve: EST-L01-030 via run]`
25. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado. `[escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]`

## Ramos

- R1 `src/editor/view/breakpoint-table.ts:37` `const held = breakpointById(state.document, breakpoint);` — lado verdadeiro (`held` é `undefined`): recusa `status.breakpoints.unknown`; lado falso: segue para o nome. O mesmo id já é conferido antes pelo despacho `src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';`.
- R2 `src/editor/view/breakpoint-table.ts:39` `const table = renamedTable(breakpointsOf(state.document), breakpoint, typeof name === 'string' ? name : '', (key) => words(key));` — lado verdadeiro: o nome do argumento; lado falso: texto vazio, que recusa por `nameEmpty`.
- R4 `src/core/document/breakpoints.ts:103` `if (typed === '') return refuse('nameEmpty');` — lado verdadeiro: recusa `nameEmpty`; lado falso: segue.
- R5 `src/core/document/breakpoints.ts:104` `if (table.some((b) => b.id !== id && breakpointName(b, words).toLocaleLowerCase() === typed.toLocaleLowerCase())) return refuse('nameTaken', { name: typed });` — lado verdadeiro: recusa `nameTaken`; lado falso: segue para a tabela nova.
- R6 `src/editor/view/breakpoint-table.ts:42` `if (renamed.name === held.name) return { kind: 'change' };` — lado verdadeiro (o nome não muda): nada é gravado, sem mensagem; lado falso: grava a tabela e diz o nome.
- R7 `src/editor/view/breakpoint-table.ts:40` `if (isRefusal(table)) return refused(table);` — lado verdadeiro: o comando devolve `kind: 'refused'`; lado falso: `kind: 'change'`.

## Fronteiras assíncronas

- nenhuma — o tratador e cada função que ele chama são síncronos; `src/editor/view/breakpoint-table.ts:36` `export const renameBreakpoint = registerHandler<'breakpoints.rename', EditorUi>('breakpoints.rename', ({ state, words }, { breakpoint, name }) => {` devolve um `Outcome` sem `await`, `.then` ou temporizador.

## Estado

- **Lê:** EST-L01-030 (o documento, via run, argumentRefusal, handlerContext, breakpointById, renamedTable, breakpointsOf, isRefusal), EST-L01-037 (o estado do editor, via run).
- **Escreve:** EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run).

## Resultado

- **Estado final:** o documento leva a tabela renomeada `src/editor/view/breakpoint-table.ts:43` `return { kind: 'change', patches: [tablePatch(state.document, table)], message: message('status.breakpoints.renamed', { name: breakpointWords(renamed) }) };`; o estado do editor não é tocado nessa linha.
- **Re-renderizado:** `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` avisa os assinantes do documento e do estado.
- **DOM do editor:** as abas relêem a tabela e mostram o nome novo `src/editor/shell/breakpoint-tabs.tsx:51` `const table = useEditorState((s) => breakpointsOf(s.document));`.
- **DOM do canvas:** nada muda — a renomeação troca só o nome, as larguras continuam as mesmas `src/core/document/breakpoints.ts:107` `return table.map((b) => (b.id === id ? { ...b, name: next } : b));`.

## Regras

- G1: n/a — a alteração escreve a tabela de breakpoints do documento, fora das camadas (ponto de quebra, estado, classe, quadro-chave) que o contexto de edição nomeia `src/editor/view/breakpoint-table.ts:17` `const tablePatch = (document: DocumentJson, table: readonly ProjectBreakpoint[]): Patch => ({ op: document.breakpoints === undefined ? 'add' : 'replace', path: ['breakpoints'], value: table });`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` mantém a digitação pendente antes do comando que muda o documento, e `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok `src/editor/view/breakpoint-table.ts:36` `export const renameBreakpoint = registerHandler<'breakpoints.rename', EditorUi>('breakpoints.rename', ({ state, words }, { breakpoint, name }) => {` — um só tratador; a porta envia só o comando, `manifest/commands/breakpoints.json:126` `"kind": "panel-control",`.
- G4: n/a — o trecho não age sobre um ponto do canvas; a porta é um controle de diálogo `manifest/commands/breakpoints.json:126` `"kind": "panel-control",`.
- G5: n/a — o trecho não monta painel nem barra; grava só o documento `src/editor/view/breakpoint-table.ts:43` `return { kind: 'change', patches: [tablePatch(state.document, table)], message: message('status.breakpoints.renamed', { name: breakpointWords(renamed) }) };`.
- G6: n/a — o trecho não escreve seleção; a store mantém a anterior `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o desenho do canvas não é exercido no trecho; a moldura lê a mesma tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — todo commit valida o documento e a seleção.

## Limpeza

- Nenhum ouvinte, temporizador ou observador é criado no trecho `src/editor/view/breakpoint-table.ts:36` `export const renameBreakpoint = registerHandler<'breakpoints.rename', EditorUi>('breakpoints.rename', ({ state, words }, { breakpoint, name }) => {`; não há remoção a citar.

## Medições

- nenhuma
