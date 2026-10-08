# TRC-view.enterPreview

- **Chamada:** `src/app/commands.ts:457` `'view.enterPreview': enterPreview,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:1503` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:1503` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.enterPreview'`; o argumento é o objeto vazio.
2. `src/editor/view/preview.ts:11` `export const enterPreview = registerHandler<'view.enterPreview', EditorUi>('view.enterPreview', ({ state }) => {` — o tratador de `view.enterPreview`.
3. `src/editor/view/preview.ts:9` `export const previewing = (ui: EditorUi): boolean => ui.preview !== undefined;` — a leitura de a previsão estar em curso. [lê: EST-L01-037 via previewing]
4. `src/editor/view/preview.ts:12` `if (previewing(state.ui)) return { kind: 'change' };` — R3.
5. `src/editor/view/preview.ts:13` `return { kind: 'change', ui: { ...state.ui, preview: { selection: state.selection } }, message: message('status.preview.on') };` — o `Outcome` com a previsão aberta, guardando a seleção atual. [lê: EST-L01-037 via handlerContext] [lê: EST-L01-031 via handlerContext] [escreve: EST-L01-037 via run]
6. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
7. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo e a mensagem nova tornam `changed` verdadeiro.
8. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
9. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
10. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/preview.ts:11` `export const enterPreview = registerHandler<'view.enterPreview', EditorUi>('view.enterPreview', ({ state }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.enterPreview` é `always` `manifest/commands/view.json:1505` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/preview.ts:12` `if (previewing(state.ui)) return { kind: 'change' };` — já em previsão: devolve `change` sem `ui` nem mensagem; fora dela, o caminho segue para `src/editor/view/preview.ts:13` `return { kind: 'change', ui: { ...state.ui, preview: { selection: state.selection } }, message: message('status.preview.on') };`.
- R4 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — no ramo do R3, `next.ui === before.ui` e a mensagem não muda: `changed` é falso e `src/core/store/store.ts:550` `if (changed) {` não publica nada; fora dele, `next.ui !== before.ui` é verdadeiro `src/editor/view/preview.ts:13` `ui: { ...state.ui, preview: { selection: state.selection } }` e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via previewing, handlerContext, publish), EST-L01-031 (a seleção, via handlerContext)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.preview` em `{ selection: <seleção atual> }`, ou sem mudança quando já em previsão `src/editor/view/preview.ts:13` `ui: { ...state.ui, preview: { selection: state.selection } }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a casca relê a previsão `src/editor/shell/shell.tsx:144` `const inPreview = useEditorState((s) => previewing(s.ui));`.
- **DOM do editor:** a casca desenha a página exportada sozinha e a barra de previsão pela leitura `src/editor/shell/shell.tsx:144` `const inPreview = useEditorState((s) => previewing(s.ui));`; a barra de status também a lê `src/editor/shell/status-bar.tsx:64` `const preview = useEditorState((s) => previewing(s.ui));`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a previsão e guarda a seleção `src/editor/view/preview.ts:13` `ui: { ...state.ui, preview: { selection: state.selection } }`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as quatro portas de `view.enterPreview` (Ctrl+P, Ctrl+Enter, o botão da barra superior e a barra de comandos) chegam à tabela `src/app/commands.ts:457` `'view.enterPreview': enterPreview,` e mandam só a intenção de entrar em previsão `src/editor/view/preview.ts:13` `return { kind: 'change', ui: { ...state.ui, preview: { selection: state.selection } }, message: message('status.preview.on') };`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/preview.ts:13` `return { kind: 'change', ui: { ...state.ui, preview: { selection: state.selection } }, message: message('status.preview.on') };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a previsão `src/editor/view/preview.ts:13` `ui: { ...state.ui, preview: { selection: state.selection } }`.
- G6: n/a — o comando não escreve a seleção; a seleção é guardada dentro de `ui.preview`, não trocada `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/preview.ts:11` `export const enterPreview = registerHandler<'view.enterPreview', EditorUi>('view.enterPreview', ({ state }) => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a previsão é um campo do estado do editor `src/editor/view/preview.ts:9` `export const previewing = (ui: EditorUi): boolean => ui.preview !== undefined;`.
