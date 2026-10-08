# TRC-capture.edit
- **Chamada:** `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`
- **Argumentos:** um objeto com `target` (texto, o id do nó capturado), `operation` (enum `text`, `attribute`, `insert`, `remove` ou `move`), `name` (texto, opcional), `value` (texto, opcional), `parent` (texto, opcional) e `index` (inteiro, opcional).
- **Ramos que dependem dos argumentos:** R1 (`target`), R3, R5, R8, R10, R13, R17 (`operation`), R4 e R6 (`value`), R6 e R7 (`name`), R11 (`parent`, `index`), R15 e R16 (`value`).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador de `capture.edit`. [lê: EST-L01-030 via run] [lê: EST-L01-037 via run]
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
3. `src/core/capture/edits.ts:74` `export const editCaptureCommand = registerHandler('capture.edit', ({ state, ids }, { target, operation, name, value, parent, index }) => {` — o tratador recebe o estado, o gerador de ids e os seis argumentos. [lê: EST-L01-030 via handlerContext]
4. `src/core/capture/edits.ts:75` `const found = findCaptured(state.document, target);` — procura o nó capturado pelo id. [lê: EST-L01-030 via findCaptured]
5. `src/core/capture/edits.ts:16` `export function findCaptured(document: DocumentJson, id: string): CapturedLocation | null {` — abre `findCaptured`.
6. `src/core/capture/edits.ts:17` `for (const [page, entry] of document.pages.entries()) {` — percorre as páginas do documento.
7. `src/core/capture/edits.ts:28` `const found = visit(entry.capture.root, []);` — desce a árvore da captura da página.
8. `src/core/capture/edits.ts:22` `for (const [index, child] of inside(node).entries()) {` — cada filho vem de `inside`. [lê: EST-L01-030 via findCaptured]
9. `src/core/capture/edits.ts:14` `const inside = (node: CapturedElement): readonly CapturedNode[] => [...(node.shadow?.children ?? []), ...node.children];` — os filhos do elemento, somando os do shadow.
10. `src/core/capture/edits.ts:76` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — R1: id ausente recusa.
11. `src/core/capture/edits.ts:77` `const capture = state.document.pages[found.page]?.capture;` — a captura da página achada. [lê: EST-L01-030 via handlerContext]
12. `src/core/capture/edits.ts:78` `if (capture === undefined) throw new Error('captured page disappeared during edit');` — R2: página sem captura é defeito, não recusa.
13. `src/core/capture/edits.ts:79` `let root: CapturedElement = capture.root;` — a raiz que o comando vai trocar.
14. `src/core/capture/edits.ts:80` `if (operation === 'text') {` — R3: ramo de texto.
15. `src/core/capture/edits.ts:81` `if (found.node.kind !== 'text' || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R4.
16. `src/core/capture/edits.ts:42` `function replaceNode(root: CapturedNode, id: string, update: (node: CapturedNode) => CapturedNode): CapturedNode {` — abre `replaceNode`.
17. `src/core/capture/edits.ts:34` `function mapChildren(node: CapturedElement, map: (children: readonly CapturedNode[]) => readonly CapturedNode[]): CapturedElement {` — abre `mapChildren`.
18. `src/core/capture/edits.ts:82` `root = replaceNode(root, target, (node) => {` — troca o valor do nó de texto.
19. `src/core/capture/edits.ts:84` `const at = everyWidth(node.at, withoutValue);` — abre `everyWidth` e `withoutValue`.
20. `src/core/capture/edits.ts:62` `function everyWidth(at: CapturedAt | undefined, change: (variant: CapturedWidth) => CapturedWidth): CapturedAt | undefined {`
21. `src/core/capture/edits.ts:66` `function withoutValue(variant: CapturedWidth): CapturedWidth {`
22. `src/core/capture/edits.ts:87` `} else if (operation === 'attribute') {` — R5: ramo de atributo.
23. `src/core/capture/edits.ts:88` `if (found.node.kind !== 'element' || typeof name !== 'string' || !NAME.test(name) || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R6.
24. `src/core/capture/edits.ts:89` `if (unsafeCapturedAttribute(found.node.tag, { name, value })) return { kind: 'refused', message: message('status.capture.unsafeEdit') };` — R7.
25. `src/core/document/captured.ts:102` `export function unsafeCapturedAttribute(tag: string, attribute: Pick<CapturedAttribute, 'name' | 'value'>): boolean {` — abre `unsafeCapturedAttribute`.
26. `src/core/capture/edits.ts:58` `function withAttribute(attributes: readonly CapturedAttribute[], name: string, namespace: string | null, value: string): readonly CapturedAttribute[] {` — abre `withAttribute`.
27. `src/core/capture/edits.ts:91` `root = replaceNode(root, target, (node) => {` — escreve o atributo no nó e nas larguras.
28. `src/core/capture/edits.ts:96` `} else if (operation === 'remove') {` — R8: ramo de remoção.
29. `src/core/capture/edits.ts:97` `if (found.path.length === 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R9.
30. `src/core/capture/edits.ts:48` `function removeNode(root: CapturedElement, id: string): CapturedElement {` — abre `removeNode`.
31. `src/core/capture/edits.ts:98` `root = removeNode(root, target);` — remove o nó pelo id.
32. `src/core/capture/edits.ts:99` `} else if (operation === 'insert' || operation === 'move') {` — R10: ramo de inserção e de movimento.
33. `src/core/capture/edits.ts:100` `if (typeof parent !== 'string' || typeof index !== 'number' || !Number.isInteger(index) || index < 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R11.
34. `src/core/capture/edits.ts:101` `const destination = findCaptured(state.document, parent);` — procura o destino pelo id. [lê: EST-L01-030 via findCaptured]
35. `src/core/capture/edits.ts:102` `if (destination === null || destination.page !== found.page || destination.node.kind !== 'element') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R12.
36. `src/core/capture/edits.ts:104` `if (operation === 'move') {` — R13: move o próprio nó, senão insere.
37. `src/core/capture/edits.ts:53` `function contains(node: CapturedNode, id: string): boolean {` — abre `contains`.
38. `src/core/capture/edits.ts:105` `if (found.path.length === 0 || contains(found.node, parent)) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R14: destino dentro do próprio nó recusa.
39. `src/core/capture/edits.ts:106` `inserted = [found.node];` — move o próprio nó.
40. `src/core/capture/edits.ts:109` `if (typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R15.
41. `src/core/document/captured.ts:195` `export function captureTree(markup: string, ids: IdGenerator): CapturedElement {` — abre `captureTree`.
42. `src/core/document/captured.ts:196` `return browserPorts().capturedTree(markup, ids);` — a porta de navegador analisa a marcação.
43. `src/core/capture/edits.ts:110` `const parsed = captureTree('<!doctype html><html><head></head><body>' + value + '</body></html>', ids);` — a árvore do valor inserido.
44. `src/core/capture/edits.ts:112` `if (body === undefined || body.children.length === 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R16.
45. `src/core/capture/edits.ts:115` `root = replaceNode(root, parent, (node) => {` — insere os filhos na posição `index`.
46. `src/core/capture/edits.ts:121` `} else return { kind: 'refused', message: message('status.capture.invalidEdit') };` — R17: `operation` fora do enum recusa.
47. `src/core/capture/edits.ts:122` `if (root === capture.root) return { kind: 'change', message: message('status.capture.edited') };` — R18: nada mudou, a mudança vai sem patch.
48. `src/core/capture/edits.ts:123` `return { kind: 'change', patches: [{ op: 'replace', path: ['pages', found.page, 'capture', 'root'], value: root }], message: message('status.capture.edited') };` — o patch que troca a raiz da captura.
49. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — o despacho aplica o patch ao documento. [escreve: EST-L01-030 via run]
50. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
51. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o estado é publicado aos assinantes. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/capture/edits.ts:76` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — `target` que nenhuma captura tem: recusa `status.capture.nodeMissing`; id existente: segue com `found`.
- R2 `src/core/capture/edits.ts:78` `if (capture === undefined) throw new Error('captured page disappeared during edit');` — a página achada sem campo `capture` lança; com campo, `root` é a raiz da captura.
- R3 `src/core/capture/edits.ts:80` `if (operation === 'text') {` — `operation` = `text`: ramo de texto; outro: vai para R5, R8, R10 ou R17.
- R4 `src/core/capture/edits.ts:81` `if (found.node.kind !== 'text' || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — nó que não é texto ou `value` não textual: recusa `status.capture.invalidEdit`; nó de texto com `value` textual: troca o valor em todas as larguras.
- R5 `src/core/capture/edits.ts:87` `} else if (operation === 'attribute') {` — `operation` = `attribute`: ramo de atributo; outro: vai para R8, R10 ou R17.
- R6 `src/core/capture/edits.ts:88` `if (found.node.kind !== 'element' || typeof name !== 'string' || !NAME.test(name) || typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — nó que não é elemento, `name` fora de `NAME` ou `value` não textual: recusa; caso contrário: R7.
- R7 `src/core/capture/edits.ts:89` `if (unsafeCapturedAttribute(found.node.tag, { name, value })) return { kind: 'refused', message: message('status.capture.unsafeEdit') };` — atributo executável ou endereço inseguro: recusa `status.capture.unsafeEdit`; seguro: escreve o atributo no nó e em cada largura.
- R8 `src/core/capture/edits.ts:96` `} else if (operation === 'remove') {` — `operation` = `remove`: ramo de remoção; outro: vai para R10 ou R17.
- R9 `src/core/capture/edits.ts:97` `if (found.path.length === 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — nó na raiz (caminho vazio): recusa; nó interno: remove por `removeNode`.
- R10 `src/core/capture/edits.ts:99` `} else if (operation === 'insert' || operation === 'move') {` — `operation` = `insert` ou `move`: ramo de inserção e de movimento; outro: R17.
- R11 `src/core/capture/edits.ts:100` `if (typeof parent !== 'string' || typeof index !== 'number' || !Number.isInteger(index) || index < 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — `parent` não textual ou `index` não inteiro não negativo: recusa; válidos: R12.
- R12 `src/core/capture/edits.ts:102` `if (destination === null || destination.page !== found.page || destination.node.kind !== 'element') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — destino ausente, noutra página ou não elemento: recusa; caso contrário: R13.
- R13 `src/core/capture/edits.ts:104` `if (operation === 'move') {` — `operation` = `move`: move o próprio nó (R14); `insert`: insere a árvore analisada de `value` (R15 e R16).
- R14 `src/core/capture/edits.ts:105` `if (found.path.length === 0 || contains(found.node, parent)) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — nó na raiz ou destino dentro do próprio nó: recusa; caso contrário: remove e reinsere.
- R15 `src/core/capture/edits.ts:109` `if (typeof value !== 'string') return { kind: 'refused', message: message('status.capture.invalidEdit') };` — `value` não textual: recusa; textual: analisa em `captureTree`.
- R16 `src/core/capture/edits.ts:112` `if (body === undefined || body.children.length === 0) return { kind: 'refused', message: message('status.capture.invalidEdit') };` — `value` sem corpo: recusa; com filhos: insere-os na posição `index`.
- R17 `src/core/capture/edits.ts:121` `} else return { kind: 'refused', message: message('status.capture.invalidEdit') };` — `operation` fora do enum: recusa.
- R18 `src/core/capture/edits.ts:122` `if (root === capture.root) return { kind: 'change', message: message('status.capture.edited') };` — árvore sem mudança: mudança sem patch; árvore nova: o patch substitui `pages[found.page].capture.root`.

## Fronteiras assíncronas
- nenhuma — o tratador e cada função que ele chama são síncronos; `src/core/capture/edits.ts:74` `export const editCaptureCommand = registerHandler('capture.edit', ({ state, ids }, { target, operation, name, value, parent, index }) => {` devolve um resultado sem espera, e `src/core/document/captured.ts:196` `return browserPorts().capturedTree(markup, ids);` devolve a árvore de imediato; o despacho `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` lê o resultado no mesmo passo.

## Estado
- **Lê:** EST-L01-030 (o documento com as capturas das páginas, via run, argumentRefusal, handlerContext, findCaptured), EST-L01-037 (o estado do editor, via run).
- **Escreve:** EST-L01-030 (o documento, pela raiz da captura da página, via run, publish), EST-L01-031 (a seleção, via commit), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o documento leva a raiz nova da captura `src/core/capture/edits.ts:123` `return { kind: 'change', patches: [{ op: 'replace', path: ['pages', found.page, 'capture', 'root'], value: root }], message: message('status.capture.edited') };`, ou fica como estava quando `src/core/capture/edits.ts:122` `if (root === capture.root) return { kind: 'change', message: message('status.capture.edited') };`.
- **Re-renderizado:** `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` avisa os assinantes; o desenho incremental remonta a página capturada em `src/editor/canvas/render/render.ts:612` `this.mount(after);`.
- **DOM do editor:** a lista do inspector de captura é refeita da árvore nova `src/editor/shell/captured-inspector.tsx:103` `const rows = useMemo(() => root === null ? [] : flatten(root), [root]);`.
- **DOM do canvas:** a página capturada é remontada no iframe `src/editor/canvas/render/render.ts:612` `this.mount(after);`.

## Regras
- G1: n/a — a edição muda o nó em todas as larguras, fora das camadas que o contexto de edição nomeia `src/core/capture/edits.ts:57` `// An edit is the node's at every width: what it changes is changed in the node's own values and in every width's.`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é mantida antes do comando que muda o documento.
- G3: ok `src/core/capture/edits.ts:74` `export const editCaptureCommand = registerHandler('capture.edit', ({ state, ids }, { target, operation, name, value, parent, index }) => {` — um só tratador; as três portas enviam só a intenção.
- G4: n/a — o trecho não age sobre um ponto do canvas; o contorno do elemento é de outra entrada `src/editor/canvas/chrome.tsx:591` `function CapturedSelection() {`.
- G5: n/a — o trecho não monta painel nem barra; lê a árvore e devolve estado `src/core/capture/edits.ts:75` `const found = findCaptured(state.document, target);`.
- G6: n/a — o trecho não escreve seleção; o resultado não leva `selection` `src/core/capture/edits.ts:123` `return { kind: 'change', patches: [{ op: 'replace', path: ['pages', found.page, 'capture', 'root'], value: root }], message: message('status.capture.edited') };`.
- G7: ok `src/editor/canvas/render/render.ts:612` `this.mount(after);` — uma mudança na captura remonta a página a partir do documento, então o desenho incremental coincide com o do zero.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento com a raiz nova é validado antes de ser commitado.

## Limpeza
- Nenhum ouvinte, temporizador ou observador é criado no trecho `src/core/capture/edits.ts:74` `export const editCaptureCommand = registerHandler('capture.edit', ({ state, ids }, { target, operation, name, value, parent, index }) => {`; não há remoção a citar.

## Medições
- nenhuma
