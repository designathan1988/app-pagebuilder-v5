# TRC-project.save

- **Chamada:** `src/app/commands.ts:346` `'project.save': saveProject,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{}` — o comando não declara argumento (`manifest/commands/project.json` `"id": "project.save",` com `"args": {}`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não recebe argumento.

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/archive.ts:40` `export const saveProject = registerHandler('project.save', ({ state, clock }) => {` — o tratador.
5. `src/core/project/archive.ts:41` `const document = new TextEncoder().encode(` — o documento do estado vira texto JSON. [lê: EST-L01-030 via handlerContext]
6. `src/core/project/archive.ts:42` `const bytes = zip([{ path: PROJECT_DOCUMENT, bytes: document }], clock.now());` — o arquivo compactado. [lê: EST-L01-030 via clock]
7. `src/core/project/zip.ts:44` `export function zip(entries: readonly ZipEntry[], modified: number): Uint8Array {` — o escritor de arquivos compactados.
8. `src/core/project/archive.ts:43` `return { kind: 'change' as const, message: message('status.project.saved', { file: PROJECT_ARCHIVE }), download: { name: PROJECT_ARCHIVE, type: 'application/zip', bytes } };` — o Outcome `change` com `download`.
9. `src/core/store/store.ts:446` `if (outcome.kind === 'load' || outcome.kind === 'undo' || outcome.kind === 'redo' ||` — o `download` assenta a sequência.
10. `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (outcome.patches?.length ?? 0) > 0))) {` — R1.
11. `src/core/store/store.ts:494` `const before = state;`
12. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — sem patches, o documento não muda.
13. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — R2, a mensagem nova torna `changed` verdadeiro.
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
15. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a validação.
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-033 via publish]
17. `src/core/store/store.ts:570` `if (outcome.download !== undefined) options.downloads?.deliver(outcome.download);` — o arquivo é entregue à porta de downloads.

## Ramos

- R1 `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (outcome.patches?.length ?? 0) > 0))) {` — aba somente-leitura: o Outcome é `change` sem patch, então a condição de patches não vale e o comando segue; um comando com patch seria recusado com `status.tabGuard.readOnly` (`src/core/store/store.ts:450` `const readOnly = message('status.tabGuard.readOnly');`).
- R2 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a mensagem `status.project.saved` difere da anterior: `changed` é verdadeiro e a store grava; sem mensagem nova (mesmo texto) `changed` seria falso e nada seria gravado.
- R3 `src/core/store/store.ts:570` `if (outcome.download !== undefined) options.downloads?.deliver(outcome.download);` — porta de downloads presente: o arquivo é entregue; ausente: nada é entregue.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/core/project/archive.ts:40` `export const saveProject = registerHandler('project.save', ({ state, clock }) => {`, sem `await`); `zip` é síncrono.

## Estado

- lê: EST-L01-030 (o documento, via handlerContext, clock), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-033 — o documento não é alterado e a mensagem passa a `status.project.saved` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` com `documentChanged` falso, de `src/core/store/store.ts:495`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status passa a mostrar a mensagem do comando.
- **DOM do canvas:** nada muda — o documento não é tocado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).

## Regras

- G1: n/a — o comando não grava estilo nem valor de camada (`src/core/project/archive.ts:41` `const document = new TextEncoder().encode(`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/project/archive.ts:40` `export const saveProject = registerHandler('project.save', ({ state, clock }) => {` — o único tratador do comando.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/project/archive.ts:43`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/archive.ts:43`).
- G6: n/a — o comando não escreve a seleção (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o documento não é alterado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/archive.ts:40`).

## Medições

- nenhuma
