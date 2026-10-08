# TRC-breakpoints.setWidth
- **Chamada:** `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`
- **Argumentos:** um objeto com `breakpoint` (um id da tabela, obrigatório) e `width` (número, obrigatório).
- **Ramos que dependem dos argumentos:** R1 (`breakpoint`), R2 (`width` igual ao de antes), R3 (`width` fora da ordem).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador de `breakpoints.setWidth`. `[lê: EST-L01-030 via run] [lê: EST-L01-037 via run]`
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. `[lê: EST-L01-030 via argumentRefusal]`
3. `src/core/store/args.ts:79` `for (const [argument, arg] of Object.entries(command.args)) {` — percorre `breakpoint` e `width`.
4. `src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';` — o id do `breakpoint` precisa ser da tabela do projeto.
5. `src/core/store/args.ts:37` `if (typeof value !== 'number' || !finite(value)) return 'invalid';` — `width`, número finito.
6. `src/editor/view/breakpoint-table.ts:46` `export const setBreakpointWidth = registerHandler<'breakpoints.setWidth', EditorUi>('breakpoints.setWidth', ({ state }, { breakpoint, width }) => {` — o tratador recebe o estado e os dois argumentos. `[lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]`
7. `src/editor/view/breakpoint-table.ts:47` `const held = breakpointById(state.document, breakpoint);` — procura o ponto de quebra na tabela. `[lê: EST-L01-030 via breakpointById]`
8. `src/core/document/breakpoints.ts:28` `export const breakpointById = (document: Tabled, id: string): ProjectBreakpoint | undefined => breakpointsOf(document).find((b) => b.id === id);` — a busca na tabela do projeto.
9. `src/editor/view/breakpoint-table.ts:48` `if (held === undefined) return unknown();` — um id que a tabela não tem é recusado. `[lê: EST-L01-030 via handlerContext]`
10. `src/editor/view/breakpoint-table.ts:19` `const unknown = (): Outcome<EditorUi> => ({ kind: 'refused', message: message('status.breakpoints.unknown') });` — a mensagem `status.breakpoints.unknown`.
11. `src/editor/view/breakpoint-table.ts:49` `const rounded = Math.round(width);` — a largura arredondada.
12. `src/editor/view/breakpoint-table.ts:50` `if (rounded === held.width) return { kind: 'change' };` — largura igual: um `change` sem patch e sem mensagem.
13. `src/editor/view/breakpoint-table.ts:51` `const table = resizedTable(breakpointsOf(state.document), breakpoint, rounded);` — monta a tabela com a largura nova. `[lê: EST-L01-030 via resizedTable]`
14. `src/core/document/breakpoints.ts:20` `export const breakpointsOf = (document: Tabled): readonly ProjectBreakpoint[] => document.breakpoints ?? DEFAULT_BREAKPOINTS;` — a tabela do projeto, ou a padrão. `[lê: EST-L01-030 via breakpointsOf]`
15. `src/core/document/breakpoints.ts:111` `export function resizedTable(table: readonly ProjectBreakpoint[], id: string, width: number): readonly ProjectBreakpoint[] | TableRefusal {` — a função da largura nova.
16. `src/core/document/breakpoints.ts:114` `const { min, max } = widthRangeOf(table, id);` — os limites da posição do ponto de quebra.
17. `src/core/document/breakpoints.ts:68` `return { min: narrower === undefined ? MIN_BREAKPOINT_WIDTH : narrower.width + 1, max: wider === undefined ? MAX_BREAKPOINT_WIDTH : wider.width - 1 };` — o intervalo entre os vizinhos.
18. `src/core/document/breakpoints.ts:115` `if (!Number.isInteger(width) || width < min || width > max) return refuse('widthOrder', { name: breakpointWords(held), min, max });` — fora do intervalo recusa com `widthOrder`.
19. `src/core/document/breakpoints.ts:116` `return table.map((b) => (b.id === id ? { ...b, width } : b));` — a tabela com a largura nova no id.
20. `src/editor/view/breakpoint-table.ts:52` `if (isRefusal(table)) return refused(table);` — uma recusa de `resizedTable` vira a recusa do comando. `[lê: EST-L01-030 via isRefusal]`
21. `src/editor/view/breakpoint-table.ts:14` `const refused = (refusal: TableRefusal): Outcome<EditorUi> => ({` — a mensagem da recusa.
22. `src/editor/view/breakpoint-table.ts:54` `const shown = activeBreakpoint(state).id === breakpoint;` — o ponto de quebra mudado é o mostrado? `[lê: EST-L01-030 via activeBreakpoint] [lê: EST-L01-037 via activeBreakpoint]`
23. `src/editor/view/breakpoints.ts:25` `export const activeBreakpoint = (shown: Shown): Breakpoint => (shown.ui.preferences.breakpoint === undefined ? undefined : breakpointById(shown.document, shown.ui.preferences.breakpoint)) ?? baseBreakpointOf(shown.document);` — o ponto de quebra ativo.
24. `src/editor/view/breakpoint-table.ts:55` `const { viewportWidth: _width, ...rest } = state.ui;` — o estado do editor sem a largura temporária. `[lê: EST-L01-037 via handlerContext]`
25. `src/editor/view/breakpoint-table.ts:57` `return { kind: 'change', patches: [tablePatch(state.document, table)], ...(shown ? { ui: rest } : {}), message: message('status.breakpoints.resized', { name: breakpointWords(held), width: rounded }) };` — o patch da tabela, o estado do editor quando o mudado é o mostrado, e a mensagem.
26. `src/editor/view/breakpoint-table.ts:17` `const tablePatch = (document: DocumentJson, table: readonly ProjectBreakpoint[]): Patch => ({ op: document.breakpoints === undefined ? 'add' : 'replace', path: ['breakpoints'], value: table });` — o patch de escrita da tabela.
27. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — o despacho aplica o patch ao documento. `[escreve: EST-L01-030 via run]`
28. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado. `[escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]`

## Ramos

- R1 `src/editor/view/breakpoint-table.ts:47` `const held = breakpointById(state.document, breakpoint);` — lado verdadeiro (`held` é `undefined`): recusa `status.breakpoints.unknown`; lado falso: segue. O mesmo id já é conferido antes pelo despacho `src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';`.
- R2 `src/editor/view/breakpoint-table.ts:50` `if (rounded === held.width) return { kind: 'change' };` — lado verdadeiro: nada é gravado, sem mensagem; lado falso: segue para `resizedTable`.
- R3 `src/core/document/breakpoints.ts:115` `if (!Number.isInteger(width) || width < min || width > max) return refuse('widthOrder', { name: breakpointWords(held), min, max });` — lado verdadeiro: recusa `widthOrder`; lado falso: a tabela nova.
- R4 `src/editor/view/breakpoint-table.ts:54` `const shown = activeBreakpoint(state).id === breakpoint;` — lado verdadeiro (o mudado é o mostrado): o retorno leva `ui: rest`, que larga a largura temporária; lado falso: o retorno não leva `ui` e o estado do editor fica como está.
- R5 `src/editor/view/breakpoint-table.ts:52` `if (isRefusal(table)) return refused(table);` — lado verdadeiro: o comando devolve `kind: 'refused'`; lado falso: `kind: 'change'`.

## Fronteiras assíncronas

- nenhuma — o tratador e cada função que ele chama são síncronos; `src/editor/view/breakpoint-table.ts:46` `export const setBreakpointWidth = registerHandler<'breakpoints.setWidth', EditorUi>('breakpoints.setWidth', ({ state }, { breakpoint, width }) => {` devolve um `Outcome` sem `await`, `.then` ou temporizador.

## Estado

- **Lê:** EST-L01-030 (o documento, via run, argumentRefusal, handlerContext, breakpointById, resizedTable, breakpointsOf, isRefusal, activeBreakpoint), EST-L01-037 (o estado do editor, via run, handlerContext, activeBreakpoint).
- **Escreve:** EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run).

## Resultado

- **Estado final:** o documento leva a tabela com a largura nova `src/editor/view/breakpoint-table.ts:57` `return { kind: 'change', patches: [tablePatch(state.document, table)], ...(shown ? { ui: rest } : {}), message: message('status.breakpoints.resized', { name: breakpointWords(held), width: rounded }) };`; o estado do editor larga a largura temporária quando o mudado é o mostrado.
- **Re-renderizado:** `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` avisa os assinantes do documento e do estado.
- **DOM do editor:** as abas relêem a tabela e mostram a largura nova `src/editor/shell/breakpoint-tabs.tsx:51` `const table = useEditorState((s) => breakpointsOf(s.document));`.
- **DOM do canvas:** a largura da moldura vem da tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.

## Regras

- G1: n/a — a alteração escreve a tabela de breakpoints do documento, fora das camadas (ponto de quebra, estado, classe, quadro-chave) que o contexto de edição nomeia `src/editor/view/breakpoint-table.ts:17` `const tablePatch = (document: DocumentJson, table: readonly ProjectBreakpoint[]): Patch => ({ op: document.breakpoints === undefined ? 'add' : 'replace', path: ['breakpoints'], value: table });`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` mantém a digitação pendente antes do comando que muda o documento, e `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok `src/editor/view/breakpoint-table.ts:46` `export const setBreakpointWidth = registerHandler<'breakpoints.setWidth', EditorUi>('breakpoints.setWidth', ({ state }, { breakpoint, width }) => {` — um só tratador; a porta envia só o comando, `manifest/commands/breakpoints.json:188` `"kind": "panel-control",`.
- G4: n/a — o trecho não age sobre um ponto do canvas; a porta é um controle de diálogo `manifest/commands/breakpoints.json:188` `"kind": "panel-control",`.
- G5: n/a — o trecho não monta painel nem barra; grava o documento e, às vezes, o estado do editor `src/editor/view/breakpoint-table.ts:57` `return { kind: 'change', patches: [tablePatch(state.document, table)], ...(shown ? { ui: rest } : {}), message: message('status.breakpoints.resized', { name: breakpointWords(held), width: rounded }) };`.
- G6: n/a — o trecho não escreve seleção; a store mantém a anterior `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o desenho do canvas não é exercido no trecho; a moldura lê a mesma tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — todo commit valida o documento e a seleção.

## Limpeza

- Nenhum ouvinte, temporizador ou observador é criado no trecho `src/editor/view/breakpoint-table.ts:46` `export const setBreakpointWidth = registerHandler<'breakpoints.setWidth', EditorUi>('breakpoints.setWidth', ({ state }, { breakpoint, width }) => {`; não há remoção a citar.

## Medições

- nenhuma
