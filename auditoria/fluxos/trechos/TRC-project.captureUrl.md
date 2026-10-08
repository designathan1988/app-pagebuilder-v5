# TRC-project.captureUrl

- **Chamada:** `src/app/commands.ts:216` `'project.captureUrl': captureUrlCommand,`
- **Argumentos:** o tratador recebe o `HandlerContext<EditorUi>` e `{ url, pages }` — o campo `url` é o endereço digitado (`string`) e o campo `pages` é quantas páginas seguir (`integer`, opcional, padrão 1). A forma vem de `manifest/commands/project.json` `"id": "project.captureUrl",`.
- **Ramos que dependem dos argumentos:** R1 (`url` não é endereço http ou https), R2 (`pages` fora de 1 a 30).

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-037 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/import/capture.ts:48` `export const captureUrlCommand = registerHandler<'project.captureUrl', EditorUi>('project.captureUrl', ({ state }, { url, pages = 1 }) => {` — o tratador.
5. `src/editor/import/capture.ts:49` `const address = captureAddress(url);`
6. `src/editor/import/capture.ts:34` `export function captureAddress(typed: string): string | null {` — a leitura do endereço.
7. `src/editor/import/capture.ts:50` `if (address === null) return { kind: 'refused', message: message('status.capture.invalidUrl', { url: url.trim() }) };` — R1.
8. `src/editor/import/capture.ts:51` `if (!Number.isInteger(pages) || pages < 1 || pages > MOST_PAGES) return { kind: 'refused', message: message('status.capture.badPages', { pages: String(pages) }) };` — R2.
9. `src/editor/import/capture.ts:31` `const MOST_PAGES = 30;` — o limite de páginas.
10. `src/editor/import/capture.ts:52` `const { dialog: _dialog, ...ui } = state.ui;` — R3, o diálogo é retirado do estado do editor. [lê: EST-L01-037 via handlerContext]
11. `src/editor/import/capture.ts:54` `return { kind: 'change', ui: { ...ui, capture: { url: address, count: (state.ui.capture?.count ?? 0) + 1, pages } }, message: message('status.capture.running', { url: address }) };` — o Outcome `change`. [escreve: EST-L01-037 via run] [escreve: EST-L01-033 via run]
12. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {`
13. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish]
14. `src/core/store/store.ts:494` `const before = state;`
15. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — sem patches, o documento não muda.
16. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store.
17. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o estado do editor novo torna `changed` verdadeiro.
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
19. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a validação.
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
21. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] [lê: EST-L01-033 via publish]

## Ramos

- R1 `src/editor/import/capture.ts:50` `if (address === null) return { kind: 'refused', message: message('status.capture.invalidUrl', { url: url.trim() }) };` — endereço que `captureAddress` não aceita (não é http nem https, ou sem host): Outcome `refused` com `status.capture.invalidUrl`; endereço aceito: segue.
- R2 `src/editor/import/capture.ts:51` `if (!Number.isInteger(pages) || pages < 1 || pages > MOST_PAGES) return { kind: 'refused', message: message('status.capture.badPages', { pages: String(pages) }) };` — `pages` não inteiro, menor que 1 ou maior que 30: Outcome `refused` com `status.capture.badPages`; dentro da faixa: segue.
- R3 `src/editor/import/capture.ts:52` `const { dialog: _dialog, ...ui } = state.ui;` — o campo `dialog` é retirado do estado do editor, então o diálogo de captura fecha; os demais campos seguem.
- R4 `src/editor/import/capture.ts:54` `return { kind: 'change', ui: { ...ui, capture: { url: address, count: (state.ui.capture?.count ?? 0) + 1, pages } }, message: message('status.capture.running', { url: address }) };` — `ui.capture` ausente: a contagem começa em 1; presente: a contagem anterior mais um.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/editor/import/capture.ts:48` `export const captureUrlCommand = registerHandler<'project.captureUrl', EditorUi>('project.captureUrl', ({ state }, { url, pages = 1 }) => {`, sem `await`); a requisição ao Companion é do ouvinte `installCapture`, e não deste tratador.

## Estado

- lê: EST-L01-030 (o documento, via argumentRefusal), EST-L01-037 (o estado do editor, `state.ui`, via handlerContext, run)
- escreve: EST-L01-033 (a mensagem, via run, publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish), EST-L01-037 (`ui.dialog` e `ui.capture`, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 — no ramo `change` o estado do editor perde `ui.dialog` e ganha `ui.capture` com o endereço, a contagem e as páginas (`src/editor/import/capture.ts:54`); nos ramos de recusa só EST-L01-033, EST-L01-035 e EST-L01-036 são escritas (`src/core/store/store.ts:451`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel de captura lê `ui.capture` pelo caminho da store (`src/editor/store.ts:253` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`).
- **DOM do canvas:** nada muda — o documento não é tocado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).

## Regras

- G1: n/a — o comando grava o estado do editor, sem gravar estilo nem valor de camada (`src/editor/import/capture.ts:54`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/import/capture.ts:48` `export const captureUrlCommand = registerHandler<'project.captureUrl', EditorUi>('project.captureUrl', ({ state }, { url, pages = 1 }) => {` — o único tratador do comando.
- G4: n/a — a porta é o controle do diálogo de captura, não um ponto do canvas (`manifest/commands/project.json` `"panel": "capture-url",`).
- G5: n/a — o comando escreve só o estado do editor; o diálogo é desenhado pela view (`src/editor/import/capture.ts:52` `const { dialog: _dialog, ...ui } = state.ui;`).
- G6: n/a — o comando não escreve a seleção (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o documento não é alterado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/editor/import/capture.ts:48`).

## Medições

- nenhuma
