# TRC-breakpoints.remove
- **Chamada:** `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`
- **Argumentos:** um objeto com `breakpoint` (um id da tabela, obrigatório) e `styles` (enum `discard`, `wider` ou `narrower`, obrigatório).
- **Ramos que dependem dos argumentos:** R1 (`breakpoint`), R3 (`styles`), R4 (`styles` = `narrower` sem vizinho mais estreito).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador de `breakpoints.remove`. `[lê: EST-L01-030 via run] [lê: EST-L01-037 via run]`
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. `[lê: EST-L01-030 via argumentRefusal]`
3. `src/core/store/args.ts:79` `for (const [argument, arg] of Object.entries(command.args)) {` — percorre `breakpoint` e `styles`.
4. `src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';` — o id do `breakpoint` precisa ser da tabela do projeto.
5. `src/core/store/args.ts:42` `return typeof value === 'string' && (arg.values.length === 0 || arg.values.includes(value)) ? 'fits' : 'invalid';` — `styles`, um dos três valores do enum.
6. `src/editor/view/breakpoint-table.ts:62` `export const removeBreakpoint = registerHandler<'breakpoints.remove', EditorUi>('breakpoints.remove', ({ state }, { breakpoint, styles }) => {` — o tratador recebe o estado e os dois argumentos. `[lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]`
7. `src/editor/view/breakpoint-table.ts:63` `const held = breakpointById(state.document, breakpoint);` — procura o ponto de quebra na tabela. `[lê: EST-L01-030 via breakpointById]`
8. `src/core/document/breakpoints.ts:28` `export const breakpointById = (document: Tabled, id: string): ProjectBreakpoint | undefined => breakpointsOf(document).find((b) => b.id === id);` — a busca na tabela do projeto.
9. `src/editor/view/breakpoint-table.ts:64` `if (held === undefined) return unknown();` — um id que a tabela não tem é recusado. `[lê: EST-L01-030 via handlerContext]`
10. `src/editor/view/breakpoint-table.ts:19` `const unknown = (): Outcome<EditorUi> => ({ kind: 'refused', message: message('status.breakpoints.unknown') });` — a mensagem `status.breakpoints.unknown`.
11. `src/editor/view/breakpoint-table.ts:65` `if (held.base) return { kind: 'refused', message: message('status.breakpoints.baseStays', { name: breakpointWords(held) }) };` — o ponto de quebra base não sai.
12. `src/editor/view/breakpoint-table.ts:66` `const table = breakpointsOf(state.document);` — a tabela do projeto. `[lê: EST-L01-030 via breakpointsOf]`
13. `src/core/document/breakpoints.ts:20` `export const breakpointsOf = (document: Tabled): readonly ProjectBreakpoint[] => document.breakpoints ?? DEFAULT_BREAKPOINTS;` — a tabela do projeto, ou a padrão.
14. `src/editor/view/breakpoint-table.ts:67` `const at = table.findIndex((b) => b.id === breakpoint);` — a posição do ponto de quebra, da mais larga para a mais estreita.
15. `src/editor/view/breakpoint-table.ts:68` `const into = styles === 'wider' ? table[at - 1] : styles === 'narrower' ? table[at + 1] : undefined;` — para onde vão os estilos: o vizinho mais largo, o mais estreito, ou nenhum.
16. `src/editor/view/breakpoint-table.ts:69` `if (styles === 'narrower' && into === undefined) return { kind: 'refused', message: message('status.breakpoints.noNarrower', { name: breakpointWords(held) }) };` — `narrower` sem vizinho mais estreito recusa.
17. `src/editor/view/breakpoint-table.ts:70` `const without = documentWithout(state.document as unknown as Readonly<Record<string, unknown>>, breakpoint, into?.id ?? null);` — o documento sem os estilos do ponto de quebra. `[lê: EST-L01-030 via documentWithout]`
18. `src/core/document/breakpoints.ts:123` `export function documentWithout(document: DocumentLike, id: string, into: string | null = null): { readonly document: DocumentLike } | TableRefusal {` — a função que tira o ponto de quebra do documento.
19. `src/core/document/breakpoints.ts:129` `const { [id]: held, ...rest } = record;` — um registro por ponto de quebra, sem o ponto de quebra.
20. `src/core/document/breakpoints.ts:130` `if (into === null || held === undefined) return rest;` — sem destino, ou sem o que mover, o registro sai.
21. `src/core/document/breakpoints.ts:132` `if (!isRecord(held) || !isRecord(there)) return { ...rest, [into]: there ?? held };` — o que havia no ponto de quebra vai para o destino.
22. `src/core/document/breakpoints.ts:139` `if (key === 'breakpoints' && value.every((v) => typeof v === 'string')) {` — a lista de pontos de quebra de uma animação.
23. `src/core/document/breakpoints.ts:141` `if (into !== null) return value.includes(into) ? value.filter((v) => v !== id) : value.map((v) => (v === id ? into : v));` — o ponto de quebra sai da lista, ou é trocado pelo destino.
24. `src/core/document/breakpoints.ts:148` `if (value.kind === 'breakpoint' && value.breakpoint === id) {` — uma referência a um ponto de quebra.
25. `src/core/document/breakpoints.ts:149` `if (into === null) used = true;` — sem destino, a referência marca o ponto de quebra como usado.
26. `src/core/document/breakpoints.ts:154` `if (key === 'grid')` — as configurações de grade por ponto de quebra.
27. `src/core/document/breakpoints.ts:160` `if (key === 'styles') return Object.fromEntries(Object.entries(byBreakpoint(value, true)).map(([name, held]) => [name, strip(held, name)]));` — os estilos por ponto de quebra.
28. `src/core/document/breakpoints.ts:172` `return used ? refuse('usedByMotion', {}) : { document: next };` — a recusa `usedByMotion`, ou o documento sem os estilos.
29. `src/editor/view/breakpoint-table.ts:71` `if (isRefusal(without)) return { kind: 'refused', message: message('status.breakpoints.usedByMotion', { name: breakpointWords(held) }) };` — uma recusa de `documentWithout` vira a recusa do comando. `[lê: EST-L01-030 via isRefusal]`
30. `src/editor/view/breakpoint-table.ts:72` `const before = state.document as unknown as Readonly<Record<string, unknown>>;` — o documento de antes. `[lê: EST-L01-030 via handlerContext]`
31. `src/editor/view/breakpoint-table.ts:75` `const patches: Patch[] = Object.keys(after)` — os campos que mudam viram patches.
32. `src/editor/view/breakpoint-table.ts:77` `.map((field) => ({ op: 'replace', path: [field], value: after[field] }));` — cada campo, um `replace`.
33. `src/editor/view/breakpoint-table.ts:78` `patches.push(tablePatch(state.document, breakpointsOf(state.document).filter((b) => b.id !== breakpoint)));` — o patch da tabela sem o ponto de quebra.
34. `src/editor/view/breakpoint-table.ts:79` `const shown = activeBreakpoint(state).id === breakpoint;` — o ponto de quebra removido é o mostrado? `[lê: EST-L01-030 via activeBreakpoint] [lê: EST-L01-037 via activeBreakpoint]`
35. `src/editor/view/breakpoints.ts:25` `export const activeBreakpoint = (shown: Shown): Breakpoint => (shown.ui.preferences.breakpoint === undefined ? undefined : breakpointById(shown.document, shown.ui.preferences.breakpoint)) ?? baseBreakpointOf(shown.document);` — o ponto de quebra ativo.
36. `src/editor/view/breakpoint-table.ts:80` `const said: Message = into === undefined ? message('status.breakpoints.removed', { name: breakpointWords(held) }) : message('status.breakpoints.removedInto', { name: breakpointWords(held), into: breakpointWords(into) });` — a mensagem, nomeando o destino quando há um.
37. `src/editor/view/breakpoint-table.ts:81` `if (!shown) return { kind: 'change', patches, message: said };` — não mostrado: só o documento muda.
38. `src/editor/view/breakpoint-table.ts:84` `const { breakpoint: _was, ...preferences } = state.ui.preferences;` — as preferências sem o ponto de quebra escolhido. `[lê: EST-L01-037 via handlerContext]`
39. `src/editor/view/breakpoint-table.ts:86` `return { kind: 'change', patches, ui: { ...ui, preferences }, message: said };` — o documento e o estado do editor, com a preferência do ponto de quebra fora.
40. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — o despacho aplica os patches ao documento. `[escreve: EST-L01-030 via run]`
41. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado novo é publicado. `[escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]`

## Ramos

- R1 `src/editor/view/breakpoint-table.ts:63` `const held = breakpointById(state.document, breakpoint);` — lado verdadeiro (`held` é `undefined`): recusa `status.breakpoints.unknown`; lado falso: segue. O mesmo id já é conferido antes pelo despacho `src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';`.
- R2 `src/editor/view/breakpoint-table.ts:65` `if (held.base) return { kind: 'refused', message: message('status.breakpoints.baseStays', { name: breakpointWords(held) }) };` — lado verdadeiro (o base): recusa `baseStays`; lado falso: segue.
- R3 `src/editor/view/breakpoint-table.ts:68` `const into = styles === 'wider' ? table[at - 1] : styles === 'narrower' ? table[at + 1] : undefined;` — `wider`: o vizinho mais largo; `narrower`: o mais estreito; `discard`: nenhum destino.
- R4 `src/editor/view/breakpoint-table.ts:69` `if (styles === 'narrower' && into === undefined) return { kind: 'refused', message: message('status.breakpoints.noNarrower', { name: breakpointWords(held) }) };` — lado verdadeiro: recusa `noNarrower`; lado falso: segue para `documentWithout`.
- R5 `src/core/document/breakpoints.ts:149` `if (into === null) used = true;` — lado verdadeiro (sem destino): uma referência sem outro ponto de quebra marca o ponto de quebra como usado, e o passo 28 recusa `usedByMotion`; lado falso: a referência é trocada pelo destino.
- R6 `src/editor/view/breakpoint-table.ts:79` `const shown = activeBreakpoint(state).id === breakpoint;` — lado verdadeiro (o removido é o mostrado): o retorno leva `ui` com a preferência do ponto de quebra fora; lado falso: o retorno não leva `ui`.
- R7 `src/editor/view/breakpoint-table.ts:71` `if (isRefusal(without)) return { kind: 'refused', message: message('status.breakpoints.usedByMotion', { name: breakpointWords(held) }) };` — lado verdadeiro: o comando devolve `kind: 'refused'`; lado falso: `kind: 'change'`.

## Fronteiras assíncronas

- nenhuma — o tratador e cada função que ele chama são síncronos; `src/editor/view/breakpoint-table.ts:62` `export const removeBreakpoint = registerHandler<'breakpoints.remove', EditorUi>('breakpoints.remove', ({ state }, { breakpoint, styles }) => {` devolve um `Outcome` sem `await`, `.then` ou temporizador.

## Estado

- **Lê:** EST-L01-030 (o documento, via run, argumentRefusal, handlerContext, breakpointById, breakpointsOf, documentWithout, isRefusal, activeBreakpoint), EST-L01-037 (o estado do editor, via run, handlerContext, activeBreakpoint).
- **Escreve:** EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run).

## Resultado

- **Estado final:** o documento perde os estilos do ponto de quebra e ele sai da tabela `src/editor/view/breakpoint-table.ts:78` `patches.push(tablePatch(state.document, breakpointsOf(state.document).filter((b) => b.id !== breakpoint)));`; o estado do editor larga a preferência do ponto de quebra quando o removido é o mostrado `src/editor/view/breakpoint-table.ts:86` `return { kind: 'change', patches, ui: { ...ui, preferences }, message: said };`.
- **Re-renderizado:** `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` avisa os assinantes do documento e do estado.
- **DOM do editor:** as abas relêem a tabela sem o ponto de quebra `src/editor/shell/breakpoint-tabs.tsx:51` `const table = useEditorState((s) => breakpointsOf(s.document));`.
- **DOM do canvas:** a largura da moldura vem da tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.

## Regras

- G1: n/a — a alteração escreve o documento (a tabela de breakpoints e os estilos dos elementos), fora das camadas (ponto de quebra, estado, classe, quadro-chave) que o contexto de edição nomeia `src/editor/view/breakpoint-table.ts:70` `const without = documentWithout(state.document as unknown as Readonly<Record<string, unknown>>, breakpoint, into?.id ?? null);`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` mantém a digitação pendente antes do comando que muda o documento, e `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok `src/editor/view/breakpoint-table.ts:62` `export const removeBreakpoint = registerHandler<'breakpoints.remove', EditorUi>('breakpoints.remove', ({ state }, { breakpoint, styles }) => {` — um só tratador; a porta envia só o comando, `manifest/commands/breakpoints.json:256` `"kind": "panel-control",`.
- G4: n/a — o trecho não age sobre um ponto do canvas; a porta é um controle de diálogo `manifest/commands/breakpoints.json:256` `"kind": "panel-control",`.
- G5: n/a — o trecho não monta painel nem barra; grava o documento e, às vezes, o estado do editor `src/editor/view/breakpoint-table.ts:86` `return { kind: 'change', patches, ui: { ...ui, preferences }, message: said };`.
- G6: n/a — o trecho não escreve seleção; a store mantém a anterior `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o desenho do canvas não é exercido no trecho; a moldura lê a mesma tabela `src/editor/shell/canvas.tsx:274` `const pageWidth = useEditorState((s) => viewportWidth(s));`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — todo commit valida o documento e a seleção.

## Limpeza

- Nenhum ouvinte, temporizador ou observador é criado no trecho `src/editor/view/breakpoint-table.ts:62` `export const removeBreakpoint = registerHandler<'breakpoints.remove', EditorUi>('breakpoints.remove', ({ state }, { breakpoint, styles }) => {`; não há remoção a citar.

## Medições

- nenhuma
