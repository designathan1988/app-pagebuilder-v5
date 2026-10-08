# TRC-clipboard.paste
- **Chamada:** `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`
- **Argumentos:** um campo, `clipboard`, do tipo `ClipboardContent` — `src/generated/commands.ts:77` `"clipboard.paste": { readonly clipboard: ClipboardContent };`. `ClipboardContent` é a união `{ status: 'read'; html; text; markup? }` ou `{ status: 'denied' }` (`src/generated/commands.ts:22` `export type ClipboardContent =`). Na verdade o tratador aceita `undefined` (uma execução que a porta faz sem ler, para saber se o comando roda): o campo é lido em `src/core/clipboard/clipboard.ts:214` `export const pasteCommand = registerHandler('clipboard.paste', (context, { clipboard }): Outcome<never> => {`.
- **Ramos que dependem dos argumentos:** R1 (`clipboard` ausente), R2 (`status: 'denied'`), R3 (formato de elementos do editor contra outro texto), R4 (markup de HTML contra texto simples).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador com os argumentos da porta. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/clipboard/clipboard.ts:215` `  const { state, rules, ids, words } = context;` — do contexto: o estado, o modelo, o gerador de ids e as palavras. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext] [lê: EST-L01-037 via handlerContext]
3. `src/core/clipboard/clipboard.ts:219` `  if (clipboard === undefined) {` — a execução sem leitura (a porta que só pergunta se o comando roda).
4. `src/core/clipboard/clipboard.ts:220` `    const at = target(state, state.selection, rules);` — onde um paste cairia. [lê: EST-L01-030 via target] [lê: EST-L01-031 via target] [lê: EST-L01-037 via target]
5. `src/core/clipboard/clipboard.ts:201` `function target(state: { readonly document: DocumentJson; readonly ui?: unknown }, selection: readonly NodeId[], rules: ModelRules): { readonly parent: Location; readonly index: number; readonly after: DocNode | null } | null {` — abre o destino.
6. `src/core/clipboard/clipboard.ts:203` `  const root = pageShown(state)?.tree ?? null;` — a raiz da página mostrada. [lê: EST-L01-030 via pageShown] [lê: EST-L01-037 via pageShown]
7. `src/core/clipboard/clipboard.ts:204` `  const primary = selection[0] === undefined ? null : locate(document, selection[0]);` — o nó principal da seleção. [lê: EST-L01-030 via locate]
8. `src/core/clipboard/clipboard.ts:205` `  if (primary !== null && rules.elements.get(primary.node.type)?.content === 'children') return { parent: primary, index: primary.node.children.length, after: null };` — um contêiner selecionado recebe os nós como últimos filhos.
9. `src/core/clipboard/clipboard.ts:208` `    if (up) return { parent: up, index: primary.index + 1, after: primary.node };` — uma folha selecionada é seguida pelos nós.
10. `src/core/clipboard/clipboard.ts:211` `  return at === null ? null : { parent: at, index: at.node.children.length, after: null };` — sem seleção, os nós vão ao fim da raiz da página.
11. `src/core/clipboard/clipboard.ts:221` `    const locked = at === null ? null : lockRefusal(state.document, at.parent.node.id, 'status.locked.insert');` — o receptor travado recusa. [lê: EST-L01-030 via lockRefusal]
12. `src/core/clipboard/clipboard.ts:222` `    return locked === null ? { kind: 'change', message: message('status.paste.empty') } : { kind: 'refused', message: locked };` — sem receptor travado: mudança com `status.paste.empty`; travado: recusa.
13. `src/core/clipboard/clipboard.ts:225` `  if (content.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — a leitura negada pelo navegador recusa `status.clipboard.denied`.
14. `src/core/clipboard/clipboard.ts:226` `  const at = target(state, state.selection, rules);` — o destino de novo, agora para valer. [lê: EST-L01-030 via target] [lê: EST-L01-031 via target] [lê: EST-L01-037 via target]
15. `src/core/clipboard/clipboard.ts:227` `  if (at === null) throw new Error('clipboard.paste: the document has no page');` — sem página, é defeito.
16. `src/core/clipboard/clipboard.ts:228` `  const receiver = at.parent.node;` — o receptor é o pai do destino.
17. `src/core/clipboard/clipboard.ts:229` `  const locked = lockRefusal(state.document, receiver.id, 'status.locked.insert');` [lê: EST-L01-030 via lockRefusal]
18. `src/core/clipboard/clipboard.ts:230` `  if (locked !== null) return { kind: 'refused', message: locked };` — receptor travado: recusa.
19. `src/core/clipboard/clipboard.ts:233` `  const copied = copiedNodes(content.text);` — o texto lido como formato de elementos do editor, ou nulo.
20. `src/core/clipboard/clipboard.ts:119` `function copiedNodes(text: string | null): Copied[] | null {` — abre o leitor do formato.
21. `src/core/clipboard/clipboard.ts:123` `    return parsed.format === ELEMENTS_FORMAT && Array.isArray(parsed.nodes) && parsed.nodes.length > 0 ? (parsed.nodes as Copied[]) : null;` — só o formato `builder/elements` com nós vale.
22. `src/core/clipboard/clipboard.ts:234` `  let nodes: readonly DocNode[] | null = null;` — os nós a colar, ainda vazios.
23. `src/core/clipboard/clipboard.ts:235` `  let said: Message | null = null;` — o recado, ainda vazio.
24. `src/core/clipboard/clipboard.ts:237` `    const taken = new Set([...allNodes(state.document)].map((n) => n.name));` — os nomes já usados no documento. [lê: EST-L01-030 via allNodes]
25. `src/core/clipboard/clipboard.ts:238` `    const renamed = new Map<string, NodeId>();` — o mapa do id copiado para o id novo.
26. `src/core/clipboard/clipboard.ts:239` `    nodes = settled(state.document, copied.map((node) => fresh(node, ids, taken, renamed)), renamed);` — cada nó copiado ganha id e nome novos, e depois é ajustado ao documento. [lê: EST-L01-030 via settled]
27. `src/core/clipboard/clipboard.ts:131` `function fresh(copied: Copied, ids: IdGenerator, taken: Set<string>, renamed: Map<string, NodeId>): DocNode {` — abre o gerador de id e nome novos.
28. `src/core/clipboard/clipboard.ts:140` `  const id = ids.next();` — o id novo vem do gerador. [lê: EST-L01-029 via ids.next] (o contador de ids)
29. `src/core/clipboard/clipboard.ts:143` `  return { ...fields, id, name, children: copied.children.map((child) => fresh(child, ids, taken, renamed)) } as DocNode;` — o nó novo desce pela subárvore.
30. `src/core/clipboard/clipboard.ts:150` `function settled(document: DocumentJson, nodes: readonly DocNode[], renamed: ReadonlyMap<string, NodeId>): DocNode[] {` — abre o ajuste ao documento.
31. `src/core/clipboard/clipboard.ts:151` `  const present = new Set<string>([...allNodes(document)].map((node) => node.id));` — os ids do documento. [lê: EST-L01-030 via allNodes]
32. `src/core/clipboard/clipboard.ts:184` `    const detaching = detached || (component !== undefined && !components.has(component));` — uma instância de componente ausente vira elementos simples.
33. `src/core/document/clone.ts:15` `export function withFreshAnimationNames(node: DocNode, taken: Set<string>): DocNode {` — os nomes de animação copiados recebem um nome novo. [lê: EST-L01-030 via withFreshAnimationNames]
34. `src/core/clipboard/clipboard.ts:195` `  const names = animationNamesOf(document);` — os nomes de animação já usados. [lê: EST-L01-030 via animationNamesOf]
35. `src/core/clipboard/clipboard.ts:196` `  return nodes.map((node) => withFreshAnimationNames(repair(node), names));` — aplica o ajuste e os nomes de animação.
36. `src/core/clipboard/clipboard.ts:241` `    const count = receiver.children.length + nodes.length;` — quantos filhos o receptor passa a ter.
37. `src/core/clipboard/clipboard.ts:244` `        ? message('status.pasted.inside', { name: first.name, parent: receiver.name, position: at.index + 1, count })` — receptor que recebe como filhos.
38. `src/core/clipboard/clipboard.ts:245` `        : message('status.pasted.after', { name: first.name, sibling: at.after.name, position: at.index + 1, count, parent: receiver.name });` — nós que seguem uma folha.
39. `src/core/clipboard/clipboard.ts:248` `    if (markup !== null && markup.trim() !== '') {` — o ramo do HTML copiado de fora.
40. `src/core/clipboard/clipboard.ts:250` `      const imported = nodesFromExternal(markup, nodeMaker(state.document, rules, ids, words), context as HandlerContext<never>);` — o dono de ler HTML lê o markup. [lê: EST-L01-030 via nodesFromExternal]
41. `src/core/import/import.ts:234` `export function nodesFromExternal(markup: string, make: NodeMaker, context: HandlerContext<never>): PastedFragment {` — abre o importador.
42. `src/core/import/import.ts:236` `  const nodes = buildChildren(parseMarkup(markup) as readonly MarkupChild[], 'body', ['body'], builder, 1);` — a limpeza e a leitura do markup fazem os nós.
43. `src/core/structure/node-maker.ts:18` `export function nodeMaker(document: DocumentJson, rules: ModelRules, ids: IdGenerator, words: (key: MessageId) => string): NodeMaker {` — abre o fabricante de nós.
44. `src/core/structure/node-maker.ts:19` `  return { rules, ids, words, taken: new Set([...allNodes(document)].map((n) => n.name)) };` — os nomes já usados entram. [lê: EST-L01-030 via allNodes]
45. `src/core/clipboard/clipboard.ts:251` `      if (imported.nodes.length === 0) return { kind: 'refused', message: message('status.paste.empty') };` — nada importado: recusa `status.paste.empty`.
46. `src/core/clipboard/clipboard.ts:253` `      said = message('status.pasted.html', { count: imported.nodes.length, notes: reportNotes(imported.report, words) });` — o recado do HTML traz as notas do relatório.
47. `src/core/import/import.ts:187` `export function reportNotes(report: Report, words: (key: MessageId, params?: Readonly<Record<string, string | number>>) => string): string {` — abre a montagem das notas.
48. `src/core/clipboard/clipboard.ts:254` `    } else if (content.text !== null && content.text.trim() !== '') {` — o ramo do texto simples.
49. `src/core/clipboard/clipboard.ts:261` `      nodes = lines.map((line) => paragraphOf(line, make));` — uma linha vira um Parágrafo.
50. `src/core/clipboard/clipboard.ts:297` `function paragraphOf(text: string, make: NodeMaker): DocNode {` — abre o fabricante do Parágrafo.
51. `src/core/clipboard/clipboard.ts:302` `    name: freshName(make, make.words((element?.labelKey ?? 'element.paragraph.label') as MessageId)),` — o nome do Parágrafo vem das palavras. [lê: EST-L01-030 via freshName]
52. `src/core/structure/node-maker.ts:22` `export function freshName(make: NodeMaker, base: string): string {` — abre o gerador de nome.
53. `src/core/clipboard/clipboard.ts:262` `      said = message('status.pasted.text', { count: nodes.length });` — o recado do texto.
54. `src/core/clipboard/clipboard.ts:265` `  if (nodes === null || said === null) return { kind: 'refused', message: message('status.paste.empty') };` — nada a colar: recusa `status.paste.empty`.
55. `src/core/clipboard/clipboard.ts:267` `  const refused = placementRefusal(state.document, rules, receiver.id, nodes);` — a regra de onde elementos podem entrar. [lê: EST-L01-030 via placementRefusal]
56. `src/core/elements/content-model.ts:253` `export function placementRefusal(document: DocumentJson, rules: ModelRules, receiver: NodeId, arriving: readonly DocNode[], staying: ReadonlySet<NodeId> = new Set()): Message | null {` — abre a regra; um receptor que não aceita os nós recusa em `src/core/elements/content-model.ts:258` `  if (rules.elements.get(host.type)?.content !== 'children') return message('status.refused.noChildren', { parent: host.name });`
57. `src/core/clipboard/clipboard.ts:268` `  if (refused !== null) return { kind: 'refused', message: refused };` — recusado o lugar: a colagem recusa.
58. `src/core/clipboard/clipboard.ts:269` `  const patches: Patch[] = nodes.map((node, i) => ({ op: 'add' as const, path: [...at.parent.path, 'children', at.index + i], value: node }));` — um patch de acrescentar por nó, no destino.
59. `src/core/clipboard/clipboard.ts:272` `  if (!pastable(state.document, patches, rules)) return { kind: 'refused', message: message('status.paste.invalid') };` — o documento que os patches fariam é validado antes de sair. [lê: EST-L01-030 via pastable]
60. `src/core/clipboard/clipboard.ts:312` `function pastable(document: DocumentJson, patches: readonly Patch[], rules: ModelRules): boolean {` — abre a validação.
61. `src/core/clipboard/clipboard.ts:314` `    return validateDocument(applyPatches(document, patches).document, [], rules).length === 0;` — aplica os patches numa cópia e roda o validador. [lê: EST-L01-030 via validateDocument]
62. `src/core/history/transaction.ts:141` `export function applyPatches(document: DocumentJson, patches: readonly Patch[]): Applied {` — abre o aplicador de patches.
63. `src/core/document/validate.ts:333` `export function validateDocument(doc: DocumentJson, selection: Selection, manifestRules: ModelRules): Invalid[] {` — abre o validador.
64. `src/core/clipboard/clipboard.ts:276` `    selection: nodes.map((node) => node.id),` — os nós colados tornam-se a seleção.
65. `src/core/clipboard/clipboard.ts:277` `    message: said,` — o recado.
66. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches de acrescentar. [lê: EST-L01-030 via applyPatches]
67. `src/core/store/store.ts:523` `    const selection = followed === null ? chosen : chosen.filter((node) => locate(applied.document, node) !== null);` — a seleção depois: os nós colados. [escreve: EST-L01-031 via run]
68. `src/core/store/store.ts:530` `      const tx: Transaction = { command: id, patches: applied.applied, inverses: applied.inverses, selectionBefore: before.selection, selectionAfter: selection, context, at: clock.now(), coalesceKey: key, message: outcome.message ?? null };` — um passo de desfazer.
69. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — publica a mudança. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/clipboard/clipboard.ts:219` `  if (clipboard === undefined) {` — sem o argumento (a execução que só pergunta se o comando roda): devolve mudança com `status.paste.empty`, ou recusa a trava do receptor; com o argumento: segue a colagem.
- R2 `src/core/clipboard/clipboard.ts:225` `  if (content.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — leitura negada: recusa `status.clipboard.denied`; legível: segue.
- R3 `src/core/clipboard/clipboard.ts:236` `  if (copied !== null) {` — texto no formato de elementos do editor: os passos 24 a 38; outro texto: os passos 39 a 53.
- R4 `src/core/clipboard/clipboard.ts:248` `    if (markup !== null && markup.trim() !== '') {` — markup de HTML: o importador (passo 40); senão, com texto simples não vazio: uma linha por Parágrafo (passo 49); senão, `status.paste.empty` no passo 54.
- R5 `src/core/clipboard/clipboard.ts:230` `  if (locked !== null) return { kind: 'refused', message: locked };` — receptor travado: recusa com a mensagem da trava; destravado: segue.
- R6 `src/core/clipboard/clipboard.ts:268` `  if (refused !== null) return { kind: 'refused', message: refused };` — o lugar recusa os nós (pelo modelo de conteúdo): recusa com a mensagem; aceita: monta os patches.
- R7 `src/core/clipboard/clipboard.ts:272` `  if (!pastable(state.document, patches, rules)) return { kind: 'refused', message: message('status.paste.invalid') };` — os patches deixariam um documento inválido: recusa `status.paste.invalid`; válido: devolve a mudança.
- R8 `src/core/clipboard/clipboard.ts:205` `  if (primary !== null && rules.elements.get(primary.node.type)?.content === 'children') return { parent: primary, index: primary.node.children.length, after: null };` — contêiner selecionado: os nós entram como últimos filhos; folha: seguem-na (passo 9); nada selecionado: vão ao fim da raiz da página (passo 10).

## Fronteiras assíncronas
- nenhuma — o tratador de `src/core/clipboard/clipboard.ts:214` é síncrono e devolve o resultado antes de qualquer retorno de chamada; a leitura da área de transferência, que é assíncrona, acontece na porta (`src/editor/clipboard.ts:63` `export async function readClipboard(): Promise<ClipboardContent> {`), antes desta chamada.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, target, pageShown, locate, lockRefusal, allNodes, settled, withFreshAnimationNames, animationNamesOf, nodesFromExternal, freshName, placementRefusal, pastable, validateDocument, applyPatches), EST-L01-031 (a seleção, via handlerContext, target), EST-L01-037 (o estado do editor, via handlerContext, target, pageShown), EST-L01-029 (o contador de ids, via ids.next)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com os nós colados no destino (`src/core/clipboard/clipboard.ts:269` `  const patches: Patch[] = nodes.map((node, i) => ({ op: 'add' as const, path: [...at.parent.path, 'children', at.index + i], value: node }));`) e a seleção sobre eles (`src/core/store/store.ts:523` `    const selection = followed === null ? chosen : chosen.filter((node) => locate(applied.document, node) !== null);`).
- **Re-renderizado:** os assinantes de documento são chamados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`), porque o documento mudou.
- **DOM do editor:** os painéis e o canvas seguem a nova seleção pela store (a store é a fonte única: `src/core/store/store.ts:500`); a barra de status mostra o recado (`src/core/clipboard/clipboard.ts:277` `    message: said,`).
- **DOM do canvas:** os elementos colados entram na árvore — os patches de `src/core/clipboard/clipboard.ts:269` são aplicados em `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);`.

## Regras
- G1: n/a — o trecho não grava por um campo de digitação; recebe o conteúdo lido e devolve patches aplicados pela store (`src/core/store/store.ts:477`).
- G2: n/a — o trecho não lê campo de texto nem rascunho; lê o argumento e o estado (`src/core/clipboard/clipboard.ts:215`) e nada é descartado.
- G3: ok — as quatro portas leem a área de transferência e chamam o mesmo tratador pela mesma linha `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`; o tratador decide só pelo valor do argumento e do estado, nunca pela porta.
- G4: n/a — o trecho não posiciona nem cobre o canvas.
- G5: n/a — o trecho não mede nem desenha painel ou barra.
- G6: ok — a seleção após a colagem é a única devolvida em `src/core/clipboard/clipboard.ts:276` `    selection: nodes.map((node) => node.id),` e escrita pela store em `src/core/store/store.ts:500`.
- G7: ok — a colagem entra por patches de acrescentar de topo (`src/core/clipboard/clipboard.ts:269`) que a store aplica pelo único escritor (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);`).
- INT: ok — os ids são novos pelo gerador (`src/core/clipboard/clipboard.ts:140` `  const id = ids.next();`), os nomes não colidem (`src/core/clipboard/clipboard.ts:237`), as referências internas apontam para os novos ids (`src/core/clipboard/clipboard.ts:143`) e o documento que os patches fariam é validado antes de sair (`src/core/clipboard/clipboard.ts:272`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer, quadro nem observador; o tratador de `src/core/clipboard/clipboard.ts:214` é síncrono.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco; o trecho lê o modelo e devolve patches.
