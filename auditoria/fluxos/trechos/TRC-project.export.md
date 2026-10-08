# TRC-project.export

- **Chamada:** `src/app/commands.ts:352` `'project.export': exportProject,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{}` — o comando não declara argumento (`manifest/commands/project.json` `"id": "project.export",` com `"args": {}`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não recebe argumento.

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/export/export.ts:538` `export const exportProject = registerHandler('project.export', ({ state, rules, siteScripts }) => {` — o tratador.
5. `src/core/export/export.ts:540` `const site = siteFiles(state.document, rules, true, siteScripts);` — o site escrito das páginas e do estilo. [lê: EST-L01-030 via siteFiles]
6. `src/core/export/export.ts:394` `export function siteFiles(` — o escritor do site.
7. `src/core/export/export.ts:543` `const assets = filesOf(state.document).map((file) => ({ path: file.path, bytes: fileBytes(file) }));` — os arquivos do projeto no arquivo compactado.
8. `src/core/export/export.ts:544` `const capturedSnapshots = state.document.pages.flatMap((page) => {` — R1, as páginas capturadas.
9. `src/core/export/export.ts:556` `const script = site.interactions === null ? [] : [{ path: INTERACTIONS_SCRIPT, bytes: encoder.encode(site.interactions) }];` — R2.
10. `src/core/export/export.ts:557` `if (site.forms !== null) script.push({ path: FORMS_SCRIPT, bytes: encoder.encode(site.forms) });` — R2.
11. `src/core/export/export.ts:558` `if (site.motion !== null) script.push({ path: MOTION_SCRIPT, bytes: encoder.encode(site.motion) });` — R2.
12. `src/core/export/export.ts:559` `if (site.lottie !== null) script.push({ path: LOTTIE_SCRIPT, bytes: encoder.encode(site.lottie) });` — R2.
13. `src/core/export/export.ts:560` `const entries = [...site.pages.map(({ file, html }) => ({ path: file, bytes: encoder.encode(html) })), { path: STYLESHEET, bytes: encoder.encode(site.css) }, ...capturedSnapshots, ...script, ...assets];` — as entradas do arquivo compactado.
14. `src/core/export/export.ts:561` `const bytes = zip(entries, FIXED_TIME);` — o arquivo compactado com tempo fixo.
15. `src/core/project/zip.ts:44` `export function zip(entries: readonly ZipEntry[], modified: number): Uint8Array {` — o escritor de arquivos compactados.
16. `src/core/export/export.ts:562` `return { kind: 'change' as const, message: message('status.export.done', { file: SITE_ARCHIVE }), download: { name: SITE_ARCHIVE, type: 'application/zip', bytes } };` — o Outcome `change` com `download`.
17. `src/core/store/store.ts:446` `if (outcome.kind === 'load' || outcome.kind === 'undo' || outcome.kind === 'redo' ||` — o `download` assenta a sequência.
18. `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (outcome.patches?.length ?? 0) > 0))) {` — R3.
19. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — sem patches, o documento não muda.
20. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a mensagem nova torna `changed` verdadeiro.
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a validação.
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish]
24. `src/core/store/store.ts:570` `if (outcome.download !== undefined) options.downloads?.deliver(outcome.download);` — o arquivo é entregue à porta de downloads.
25. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/export/export.ts:544` `const capturedSnapshots = state.document.pages.flatMap((page) => {` — página capturada: um pacote de captura entra no arquivo compactado (`src/core/export/export.ts:552`); página comum: nada entra por ela.
- R2 `src/core/export/export.ts:556` `const script = site.interactions === null ? [] : [{ path: INTERACTIONS_SCRIPT, bytes: encoder.encode(site.interactions) }];` — sem interações: nenhum script de interações; com interações: o script entra. `site.forms`, `site.motion` e `site.lottie` seguem a mesma decisão (`src/core/export/export.ts:557`, `src/core/export/export.ts:558`, `src/core/export/export.ts:559`).
- R3 `src/core/store/store.ts:570` `if (outcome.download !== undefined) options.downloads?.deliver(outcome.download);` — porta de downloads presente: o arquivo é entregue; ausente: nada é entregue.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/core/export/export.ts:538` `export const exportProject = registerHandler('project.export', ({ state, rules, siteScripts }) => {`, sem `await`); `siteFiles` e `zip` são síncronos.

## Estado

- lê: EST-L01-030 (o documento, via siteFiles), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-033 — o documento não é alterado e a mensagem passa a `status.export.done` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` com `documentChanged` falso, de `src/core/store/store.ts:495`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status passa a mostrar a mensagem do comando.
- **DOM do canvas:** nada muda — o documento não é tocado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).

## Regras

- G1: n/a — o comando não grava estilo nem valor de camada (`src/core/export/export.ts:540` `const site = siteFiles(state.document, rules, true, siteScripts);`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/export/export.ts:538` `export const exportProject = registerHandler('project.export', ({ state, rules, siteScripts }) => {` — o único tratador do comando.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/export/export.ts:562`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/export/export.ts:562`).
- G6: n/a — o comando não escreve a seleção (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o documento não é alterado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/export/export.ts:538`).

## Medições

- nenhuma
