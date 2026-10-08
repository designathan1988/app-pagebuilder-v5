# TRC-project.importHtml

- **Chamada:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{ files, destination?, target? }` — `files` são os arquivos escolhidos, `destination` é `page`, `inside` ou `replace` (opcional, padrão `page`), `target` é o nó de destino (opcional) (`manifest/commands/project.json` `"id": "project.importHtml",`).
- **Ramos que dependem dos argumentos:** R1 (`destination` ausente com páginas escolhidas abre o diálogo), R3 (`destination` `replace` sem confirmação), R5 (`destination` `page` sobre projeto sem trabalho).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/import/html-import.ts:7` `return { ...owner, run(context, args) {` — o tratador registrado envolve o do núcleo.
5. `src/editor/import/html-import.ts:9` `const files = args.files.length > 0 ? args.files : (context.state.ui.htmlImport?.files ?? []);` — [lê: EST-L01-037 via choosingImport]
6. `src/editor/import/html-import.ts:10` `if (args.destination === undefined && importPageFiles(args.files).length > 0 && !args.files.some(f => f.error)) {` — R1.
7. `src/core/import/import.ts:1655` `export const importPageFiles = (files: readonly PickedFile[]): PickedFile[] => files.filter(file => isHtmlFile(file.name)).sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));` — as páginas escolhidas.
8. `src/editor/import/html-import.ts:11` `return { kind: 'change', ui: { ...context.state.ui, dialog: 'html-import', htmlImport: { files: args.files } } };` — R1, abre o diálogo. [escreve: EST-L01-037 via choosingImport]
9. `src/editor/import/html-import.ts:13` `const outcome = owner.run(context, { ...args, files });` — o tratador do núcleo.
10. `src/core/import/import.ts:1792` `export const importHtmlCommand = registerHandler('project.importHtml', (context, { files, destination = 'page', target }) => {` — o tratador do núcleo.
11. `src/core/import/import.ts:1794` `const picked = (files ?? []) as readonly PickedFile[];`
12. `src/core/import/import.ts:1795` `const refused = pickedRefusal(picked);` — R2.
13. `src/core/import/import.ts:1658` `export function pickedRefusal(picked: readonly PickedFile[]): Message | null {` — a recusa antes de ler.
14. `src/core/import/import.ts:1796` `if (refused !== null) return { kind: 'refused' as const, message: refused };` — R2, a recusa.
15. `src/core/import/import.ts:1798` `if (destination === 'replace' && confirmed !== true) return { kind: 'confirm' as const };` — R3.
16. `src/core/import/import.ts:1799` `const pristine = isEmptyProject(state.document) && [state.document.classes, state.document.files, state.document.components, state.document.tokens, state.document.swatches, state.document.folders].every(values => !values?.length);` — [lê: EST-L01-030 via isEmptyProject]
17. `src/core/import/import.ts:1800` `const replacing = destination === 'replace' || (destination === 'page' && pristine);` — R5.
18. `src/core/import/import.ts:1801` `const { document: parsed, report, elements } = importedSite(context, picked, replacing);` — os arquivos viram páginas e estilos.
19. `src/core/import/import.ts:1673` `export function importedSite<Ui>(context: HandlerContext<Ui>, picked: readonly PickedFile[], replacing: boolean): ImportedSite {` — o leitor de HTML.
20. `src/core/import/import.ts:1802` `const composed = importDestination(context, parsed, replacing ? 'replace' : destination, (target ?? (state.selection.length === 1 ? state.selection[0] : undefined)) as NodeId | undefined);` — os patches no destino.
21. `src/core/import/destinations.ts:13` `export function importDestination(context: HandlerContext<never>, parsed: DocumentJson, destination: 'page' | 'inside' | 'replace', target?: NodeId): { patches: Patch[]; selection: NodeId[] } | { refused: ReturnType<typeof message> } {` — o compositor.
22. `src/core/import/destinations.ts:16` `if (first === undefined) return { refused: message('status.import.noPage') };` — R4.
23. `src/core/import/import.ts:1803` `if ('refused' in composed) return { kind: 'refused' as const, message: composed.refused };` — R4, a recusa do destino.
24. `src/core/import/import.ts:1809` `return { kind: 'change' as const, ...composed, message: said };` — o Outcome `change`.
25. `src/editor/import/html-import.ts:14` `if (outcome.kind !== 'change') return outcome;` — R6.
26. `src/editor/import/html-import.ts:15` `const { dialog: _dialog, htmlImport: _request, ...ui } = outcome.ui ?? context.state.ui;` — o diálogo é fechado. [escreve: EST-L01-037 via choosingImport]
27. `src/editor/import/html-import.ts:18` `return { ...outcome, ui };` — o Outcome com o estado novo. [escreve: EST-L01-037 via choosingImport]
28. `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (outcome.patches?.length ?? 0) > 0))) {` — leitura somente: o comando com patch seria recusado.
29. `src/core/store/store.ts:494` `const before = state;`
30. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — [escreve: EST-L01-030 via applyPatches]
31. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção nova do destino.
32. `src/core/store/store.ts:527` `if (documentChanged && gesture === null && ownedGroup === null) {` — a transação no histórico (o comando é desfazível).
33. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
34. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-031 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
35. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/editor/import/html-import.ts:10` `if (args.destination === undefined && importPageFiles(args.files).length > 0 && !args.files.some(f => f.error)) {` — sem destino e com páginas escolhidas e sem arquivo em erro: devolve `change` só de estado, que abre o diálogo de destinos (`src/editor/import/html-import.ts:11`); com destino ou sem páginas: segue para o tratador do núcleo (`src/editor/import/html-import.ts:13`).
- R2 `src/core/import/import.ts:1796` `if (refused !== null) return { kind: 'refused' as const, message: refused };` — arquivo não lido ou nenhuma página entre os escolhidos: Outcome `refused`; sem recusa: segue.
- R3 `src/core/import/import.ts:1798` `if (destination === 'replace' && confirmed !== true) return { kind: 'confirm' as const };` — `replace` sem confirmação: Outcome `confirm`; confirmado ou outro destino: segue.
- R4 `src/core/import/import.ts:1803` `if ('refused' in composed) return { kind: 'refused' as const, message: composed.refused };` — `importDestination` recusa (nenhuma página a compor, `src/core/import/destinations.ts:16`): Outcome `refused`; sem recusa: segue.
- R5 `src/core/import/import.ts:1800` `const replacing = destination === 'replace' || (destination === 'page' && pristine);` — destino `page` sobre o projeto sem trabalho: `replacing` é verdadeiro e o lugar é substituído; caso contrário o destino é o pedido.
- R6 `src/editor/import/html-import.ts:14` `if (outcome.kind !== 'change') return outcome;` — Outcome que não é `change`: devolvido como está; `change`: o estado do diálogo é limpo e o estado novo volta (`src/editor/import/html-import.ts:17`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/editor/import/html-import.ts:7` `return { ...owner, run(context, args) {`, sem `await`); `importedSite` e `importDestination` são síncronos.

## Estado

- lê: EST-L01-030 (o documento, via isEmptyProject), EST-L01-037 (o estado do editor, `state.ui`, via choosingImport, handlerContext)
- escreve: EST-L01-030 (o documento com os patches do destino, via commit, publish), EST-L01-031 (a seleção do destino, via commit, publish), EST-L01-033 (a mensagem, via publish), EST-L01-037 (`ui.dialog` e `ui.htmlImport`, via choosingImport, publish), EST-L01-029

## Resultado

- **Estado final:** EST-L01-037 — no ramo R1 só `ui.dialog` e `ui.htmlImport` mudam (`src/editor/import/html-import.ts:11`); no ramo `change` EST-L01-030 ganha os patches do destino e EST-L01-031 passa a ser a do destino (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`); nos ramos `confirm` e `refused` só EST-L01-034 ou EST-L01-033 e EST-L01-035 são escritas.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro mostra a página aberta com os elementos importados (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras

- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o comando é desfazível, então `changesDocument` é verdadeiro e a digitação pendente é gravada no contexto da digitação antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/import/html-import.ts:7` `return { ...owner, run(context, args) {` — o único tratador do comando envolve o do núcleo.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/editor/import/html-import.ts:18`).
- G5: n/a — o comando não desenha painel nem controle (`src/editor/import/html-import.ts:18`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/store/store.ts:542`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/import/html-import.ts:7`).

## Medições

- nenhuma
