# TRC-project.setLanguage

- **Chamada:** `src/app/commands.ts:347` `'project.setLanguage': setProjectLanguage,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{ language }` — o campo `language` é a etiqueta de idioma digitada (`manifest/commands/project.json` `"id": "project.setLanguage",` com `"language"`).
- **Ramos que dependem dos argumentos:** R1 (`language` não é etiqueta de idioma), R2 (a etiqueta é a mesma que o documento já guarda).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/language.ts:15` `export const setProjectLanguage = registerHandler('project.setLanguage', ({ state }, { language }) => {` — o tratador.
5. `src/core/project/language.ts:16` `const typed = language.trim();`
6. `src/core/project/language.ts:17` `if (!languageTagAllowed(typed)) return refused(typed);` — R1.
7. `src/core/text/language-tag.ts:9` `export function languageTagAllowed(value: string): boolean {` — o validador de etiqueta.
8. `src/core/project/language.ts:13` `const refused = (value: string) => ({ kind: 'refused' as const, message: message('status.project.languageInvalid', { value }) });` — a recusa.
9. `src/core/project/language.ts:18` `const document = state.document as ExportDocument;` — [lê: EST-L01-030 via handlerContext]
10. `src/core/project/language.ts:19` `const patches = projectLanguagePatches(document, typed, document.codeLanguage ?? DEFAULT_CODE_LANGUAGE).filter((patch) => patch.path[0] !== 'codeLanguage');` — R2 e R3.
11. `src/core/export/authoring.ts:9` `export function projectLanguagePatches(document:ExportDocument,language:string,codeLanguage:string):readonly Patch[]{` — os patches das duas etiquetas.
12. `src/core/export/authoring.ts:14` `return held===value?[]:[{op:held===undefined?'add' as const:'replace' as const,path:[key],value}];` — R2, sem patch quando o valor já é o guardado.
13. `src/core/project/language.ts:20` `return { kind: 'change', patches, ...(patches.length === 0 ? {} : { message: message('status.project.languageSet', { language: typed }) }) };` — o Outcome `change`.
14. `src/core/store/store.ts:494` `const before = state;`
15. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — com patch, o documento muda. [escreve: EST-L01-030 via applyPatches]
16. `src/core/store/store.ts:527` `if (documentChanged && gesture === null && ownedGroup === null) {` — a transação no histórico (o comando é desfazível).
17. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store.
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a validação.
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
21. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/core/project/language.ts:17` `if (!languageTagAllowed(typed)) return refused(typed);` — texto que não é etiqueta de idioma: Outcome `refused` com `status.project.languageInvalid` (`src/core/project/language.ts:13`); etiqueta válida: segue.
- R2 `src/core/project/language.ts:19` `const patches = projectLanguagePatches(document, typed, document.codeLanguage ?? DEFAULT_CODE_LANGUAGE).filter((patch) => patch.path[0] !== 'codeLanguage');` — a etiqueta já é a do documento: `projectLanguagePatches` não emite patch para ela (`src/core/export/authoring.ts:14`), então `patches` fica vazio e o Outcome não traz mensagem (`src/core/project/language.ts:20`); etiqueta nova: um patch é emitido.
- R3 `src/core/project/language.ts:19` `const patches = projectLanguagePatches(document, typed, document.codeLanguage ?? DEFAULT_CODE_LANGUAGE).filter((patch) => patch.path[0] !== 'codeLanguage');` — o filtro descarta o patch de `codeLanguage`, então o comando escreve só `language`; sem o filtro, as duas etiquetas mudariam.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/core/project/language.ts:15` `export const setProjectLanguage = registerHandler('project.setLanguage', ({ state }, { language }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento: `language`, via applyPatches, commit, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-030 — com patch, `document.language` passa à etiqueta digitada e a seleção e o histórico seguem os do comando (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`); no ramo R2, sem patch, só EST-L01-033 (ou nada) muda.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o campo de idioma do inspector deriva do documento.
- **DOM do canvas:** nada muda — o comando não altera a estrutura das páginas (`src/core/project/language.ts:19`).

## Regras

- G1: n/a — o comando grava uma propriedade do documento pelo patch, sem camada de estilo (`src/core/project/language.ts:19` `const patches = projectLanguagePatches(document, typed, document.codeLanguage ?? DEFAULT_CODE_LANGUAGE).filter((patch) => patch.path[0] !== 'codeLanguage');`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o comando é desfazível, então `changesDocument` é verdadeiro e a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/project/language.ts:15` `export const setProjectLanguage = registerHandler('project.setLanguage', ({ state }, { language }) => {` — o único tratador do comando.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/project/language.ts:20`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/language.ts:20`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/store/store.ts:542`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/language.ts:15`).

## Medições

- nenhuma
