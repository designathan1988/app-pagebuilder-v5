# TRC-capture.select
- **Chamada:** `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`
- **Argumentos:** um objeto com `target` (texto, o id do nó capturado).
- **Ramos que dependem dos argumentos:** R1 (`target`).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador de `capture.select`. [lê: EST-L01-030 via run] [lê: EST-L01-037 via run]
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento declarado é conferido antes do tratador. [lê: EST-L01-030 via argumentRefusal]
3. `src/editor/capture/selection.ts:7` `export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {` — o tratador recebe o estado e o argumento `target`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/capture/selection.ts:8` `const found = findCaptured(state.document, target);` — procura o nó capturado pelo id. [lê: EST-L01-030 via findCaptured]
5. `src/core/capture/edits.ts:16` `export function findCaptured(document: DocumentJson, id: string): CapturedLocation | null {` — abre `findCaptured`.
6. `src/core/capture/edits.ts:17` `for (const [page, entry] of document.pages.entries()) {` — percorre as páginas do documento.
7. `src/core/capture/edits.ts:28` `const found = visit(entry.capture.root, []);` — desce a árvore da captura da página.
8. `src/editor/capture/selection.ts:9` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — R1: id ausente recusa.
9. `src/editor/capture/selection.ts:10` `const name = found.node.kind === 'element' ? found.node.tag : found.node.kind;` — R2: o nome mostrado é a tag ou o próprio tipo do nó.
10. `src/editor/capture/selection.ts:11` `return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };` — o resultado guarda o nó escolhido no estado do editor e esvazia a seleção dos elementos. [lê: EST-L01-037 via handlerContext]
11. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vazia do resultado substitui a anterior. [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — o estado do editor fica com o nó capturado novo. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado aos assinantes. [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/editor/capture/selection.ts:9` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — `target` que nenhuma captura tem: recusa `status.capture.nodeMissing`; id existente: segue e grava o nó escolhido.
- R2 `src/editor/capture/selection.ts:10` `const name = found.node.kind === 'element' ? found.node.tag : found.node.kind;` — nó elemento: a mensagem nomeia a tag; texto ou comentário: nomeia o próprio `kind`.

## Fronteiras assíncronas
- nenhuma — o tratador e cada função que ele chama são síncronos; `src/editor/capture/selection.ts:7` `export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {` devolve um resultado sem espera, e o despacho `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` lê o resultado no mesmo passo.

## Estado
- **Lê:** EST-L01-030 (o documento com as capturas das páginas, via run, argumentRefusal, handlerContext, findCaptured), EST-L01-031 (a seleção, via run), EST-L01-037 (o estado do editor, via run, handlerContext).
- **Escreve:** EST-L01-030 (o documento, via commit), EST-L01-031 (a seleção, via run, commit), EST-L01-037 (o estado do editor, via run), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** `ui.capturedNode` passa a ser o id escolhido e a seleção dos elementos fica vazia `src/editor/capture/selection.ts:11` `return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };`.
- **Re-renderizado:** `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` avisa os assinantes; o inspector de captura e o contorno releem `ui.capturedNode`.
- **DOM do editor:** a linha escolhida ganha o destaque e o formulário abre `src/editor/shell/captured-inspector.tsx:99` `const selected = useEditorState((state) => state.ui.capturedNode ?? null);` e `src/editor/shell/captured-inspector.tsx:116` `{node !== null && <CapturedEdit key={node.id} node={node} />}`; o contorno e o rótulo do elemento são desenhados `src/editor/canvas/chrome.tsx:626` `className="chrome__selection" data-chrome="captured-selection"`.
- **DOM do canvas:** nada muda — o documento não muda, o resultado não traz patches `src/editor/capture/selection.ts:11` `return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };`.

## Regras
- G1: n/a — o comando não tem digitação de campo; o único argumento é o id do nó vindo da porta `src/editor/capture/selection.ts:7` `export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é mantida antes de um comando que muda a seleção.
- G3: ok `src/editor/capture/selection.ts:7` `export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {` — um só tratador; as duas portas enviam só `target`.
- G4: n/a — o trecho não age sobre um ponto do canvas; o contorno do elemento é de outra entrada `src/editor/canvas/chrome.tsx:591` `function CapturedSelection() {`.
- G5: n/a — o trecho não monta painel nem barra; lê a árvore e devolve estado `src/editor/capture/selection.ts:8` `const found = findCaptured(state.document, target);`.
- G6: ok `src/editor/canvas/chrome.tsx:592` `const id = useEditorState((s) => s.ui.capturedNode ?? null);` — o contorno e o inspector derivam a mesma escolha da store.
- G7: n/a — o trecho não muda o documento `src/editor/capture/selection.ts:11` `return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado com a seleção vazia é validado antes de ser commitado.

## Limpeza
- Nenhum ouvinte, temporizador ou observador é criado no trecho `src/editor/capture/selection.ts:7` `export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {`; não há remoção a citar.

## Medições
- nenhuma
