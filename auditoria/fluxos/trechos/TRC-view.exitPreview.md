# TRC-view.exitPreview

- **Chamada:** `src/app/commands.ts:458` `'view.exitPreview': exitPreview,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:1604` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:1604` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.exitPreview'`; o argumento é o objeto vazio.
2. `src/editor/view/preview.ts:16` `export const exitPreview = registerHandler<'view.exitPreview', EditorUi>('view.exitPreview', ({ state }) => {` — o tratador de `view.exitPreview`.
3. `src/editor/view/preview.ts:17` `const held = state.ui.preview;` — a previsão em curso, com a seleção que ela guardou. [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/preview.ts:18` `if (held === undefined) return { kind: 'change' };` — R3.
5. `src/editor/view/preview.ts:19` `const { preview: _left, ...ui } = state.ui;` — separa a previsão do estado do editor. [lê: EST-L01-037 via handlerContext]
6. `src/editor/view/preview.ts:21` `return { kind: 'change', ui, selection: held.selection, message: message('status.preview.off') };` — o `Outcome` com a previsão fora e a seleção que ela guardou. [escreve: EST-L01-037 via run] [escreve: EST-L01-031 via run]
7. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção que o resultado leva substitui a seleção atual. [escreve: EST-L01-031 via run]
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo, a seleção restaurada e a mensagem nova tornam `changed` verdadeiro.
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
11. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/preview.ts:16` `export const exitPreview = registerHandler<'view.exitPreview', EditorUi>('view.exitPreview', ({ state }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.exitPreview` é `always` `manifest/commands/view.json:1606` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/preview.ts:18` `if (held === undefined) return { kind: 'change' };` — sem previsão em curso: devolve `change` sem `ui`, seleção nem mensagem; com a previsão aberta, o caminho segue para `src/editor/view/preview.ts:19` `const { preview: _left, ...ui } = state.ui;`.
- R4 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — no ramo do R3, `next.ui === before.ui` e a seleção não muda: `changed` é falso e `src/core/store/store.ts:550` `if (changed) {` não publica nada; fora dele, `next.ui !== before.ui` é verdadeiro `src/editor/view/preview.ts:21` `ui, selection: held.selection, message: message('status.preview.off')` e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, publish)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 sem `ui.preview` e com a seleção que a previsão guardou `src/editor/view/preview.ts:21` `ui, selection: held.selection, message: message('status.preview.off')`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a casca relê a previsão `src/editor/shell/shell.tsx:144` `const inPreview = useEditorState((s) => previewing(s.ui));`.
- **DOM do editor:** a casca volta a desenhar o editor inteiro pela leitura `src/editor/shell/shell.tsx:144` `const inPreview = useEditorState((s) => previewing(s.ui));`; a barra de status também a lê `src/editor/shell/status-bar.tsx:64` `const preview = useEditorState((s) => previewing(s.ui));`.
- **DOM do canvas:** a seleção guardada volta, pelo desenho das alças sobre a seleção da store `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`; o documento não muda e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só tira a previsão e devolve a seleção guardada `src/editor/view/preview.ts:21` `ui, selection: held.selection, message: message('status.preview.off')`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as três portas de `view.exitPreview` (Escape em previsão, Ctrl+Enter em previsão e o botão Sair da barra de previsão) chegam à tabela `src/app/commands.ts:458` `'view.exitPreview': exitPreview,` e mandam só a intenção de sair `src/editor/view/preview.ts:21` `return { kind: 'change', ui, selection: held.selection, message: message('status.preview.off') };`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/preview.ts:21` `return { kind: 'change', ui, selection: held.selection, message: message('status.preview.off') };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só tira a previsão e devolve a seleção `src/editor/view/preview.ts:21` `ui, selection: held.selection`.
- G6: ok — a seleção vem da store, sem cópia local: o resultado a leva `src/editor/view/preview.ts:21` `selection: held.selection` e a store a adota `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/preview.ts:16` `export const exitPreview = registerHandler<'view.exitPreview', EditorUi>('view.exitPreview', ({ state }) => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a seleção guardada vem do estado do editor `src/editor/view/preview.ts:17` `const held = state.ui.preview;`.
