# TRC-clipboard.pasteStyle
- **Chamada:** `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`
- **Argumentos:** um campo, `clipboard`, do tipo `ClipboardContent` — `src/generated/commands.ts:80` `"clipboard.pasteStyle": { readonly clipboard: ClipboardContent };`. O tratador aceita `undefined` (uma execução que a porta faz sem ler, para saber se o comando roda), lido em `src/core/clipboard/clipboard.ts:351` `export const pasteStyleCommand = registerHandler('clipboard.pasteStyle', (context, { clipboard }): Outcome<never> => {`.
- **Ramos que dependem dos argumentos:** R1 (`clipboard` ausente), R2 (`status: 'denied'`), R3 (texto no formato de estilos contra outro texto).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador com os argumentos da porta. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/clipboard/clipboard.ts:352` `  const { state } = context;` — o estado do contexto. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext] [lê: EST-L01-037 via handlerContext]
3. `src/core/clipboard/clipboard.ts:353` `  const content = clipboard as ClipboardContent | undefined;` — o argumento lido.
4. `src/core/clipboard/clipboard.ts:355` `  if (content === undefined) return { kind: 'change', message: message('status.paste.empty') };` — sem leitura: diz que não há o que colar.
5. `src/core/clipboard/clipboard.ts:356` `  if (content.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — leitura negada: recusa.
6. `src/core/clipboard/clipboard.ts:357` `  const styles = copiedStyles(content.text);` — o texto lido como formato de estilos, ou nulo.
7. `src/core/clipboard/clipboard.ts:325` `function copiedStyles(text: string | null): Styles | null {` — abre o leitor do formato de estilos.
8. `src/core/clipboard/clipboard.ts:329` `    if (parsed.format !== STYLES_FORMAT || parsed.styles === null || typeof parsed.styles !== 'object') return null;` — só o formato `builder/styles` com estilos vale.
9. `src/core/clipboard/clipboard.ts:358` `  if (styles === null) return { kind: 'refused', message: message('status.paste.empty') };` — outro texto: recusa `status.paste.empty`.
10. `src/core/clipboard/clipboard.ts:359` `  const roots = selectionRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
11. `src/core/structure/remove.ts:18` `export function selectionRoots(document: DocumentJson, selection: Selection): Location[] {` — abre a coleta das raízes; a recursão em `src/core/structure/remove.ts:22` `    if (selected.has(node.id)) {` guarda cada selecionado que nenhum ancestral selecionado contém. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
12. `src/core/clipboard/clipboard.ts:360` `  if (roots.length === 0) return { kind: 'refused', message: message('refusal.nothingSelected') };` — sem raiz, recusa.
13. `src/core/clipboard/clipboard.ts:361` `  const locked = firstLockRefusal(state.document, roots.map((root) => root.node.id), 'status.locked.edit');` — um elemento travado, ou dentro de um, recusa. [lê: EST-L01-030 via firstLockRefusal]
14. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — abre a checagem; a cadeia de cada nó é lida em `src/core/nodes/flags.ts:40` `export function lockRefusal(document: DocumentJson, id: NodeId, key: LockedKey): Message | null {`
15. `src/core/clipboard/clipboard.ts:362` `  if (locked !== null) return { kind: 'refused', message: locked };` — travado: recusa com a mensagem da trava.
16. `src/core/clipboard/clipboard.ts:363` `  const holders = styleHolders(context, roots);` — os detentores do estilo: a classe-alvo, ou os elementos (a parte de uma instância vai para o componente). [lê: EST-L01-030 via styleHolders] [lê: EST-L01-037 via styleHolders]
17. `src/core/style/set.ts:56` `export function styleHolders<Ui>(context: HandlerContext<Ui>, nodes: readonly Location[]): StyleHolder[] {` — abre os detentores.
18. `src/core/style/set.ts:58` `  const target = targetClass(context);` — a classe que o editor faz de alvo do estilo, quando há uma. [lê: EST-L01-037 via targetClass]
19. `src/core/style/set.ts:59` `  if (target !== null && primary !== undefined) return [{ node: { ...primary.node, styles: target.styleClass.styles }, path: ['classes', target.index], parent: primary.parent, name: `.${target.styleClass.name}` }];` — havendo alvo, o estilo vai para a classe.
20. `src/core/design/classes.ts:54` `export function targetClass<Ui>(context: HandlerContext<Ui>): { readonly index: number; readonly styleClass: StyleClass } | null {` — abre a leitura do alvo.
21. `src/core/style/set.ts:64` `    (componentHolders(context.state.document, found.node.id as NodeId) ?? [found]).flatMap((held) => {` — sem alvo, um elemento de instância escreve no componente; senão, no próprio elemento. [lê: EST-L01-030 via componentHolders]
22. `src/core/design/instances.ts:21` `export function componentHolders(document: DocumentJson, id: NodeId): { readonly node: DocNode; readonly path: readonly (string | number)[]; readonly parent: DocNode | null }[] | null {` — abre a leitura das partes do componente.
23. `src/core/clipboard/clipboard.ts:364` `  const said = holders.length === 1 ? message('status.style.pasted', { name: holders[0]?.name ?? '' }) : message('status.style.pastedMany', { count: holders.length });` — o recado: um detentor pelo nome, vários pela contagem.
24. `src/core/clipboard/clipboard.ts:366` `  const patches: Patch[] = holders.flatMap((holder) => (deepEqual(holder.node.styles, styles) ? [] : [{ op: 'replace' as const, path: [...holder.path, 'styles'], value: styles }]));` — um patch de substituir por detentor que ainda não tem esses estilos. [lê: EST-L01-030 via deepEqual]
25. `src/core/history/transaction.ts:39` `export function deepEqual(a: unknown, b: unknown): boolean {` — abre a comparação de estilos.
26. `src/core/clipboard/clipboard.ts:367` `  if (patches.length > 0 && !pastable(state.document, patches, context.rules)) return { kind: 'refused', message: message('status.paste.invalid') };` — o documento que os patches fariam é validado antes de sair. [lê: EST-L01-030 via pastable]
27. `src/core/clipboard/clipboard.ts:314` `    return validateDocument(applyPatches(document, patches).document, [], rules).length === 0;` — aplica os patches numa cópia e roda o validador. [lê: EST-L01-030 via validateDocument]
28. `src/core/document/validate.ts:333` `export function validateDocument(doc: DocumentJson, selection: Selection, manifestRules: ModelRules): Invalid[] {` — abre o validador.
29. `src/core/clipboard/clipboard.ts:368` `  return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };` — sem mudança: só o recado; com mudança: os patches e o recado.
30. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches de substituir. [lê: EST-L01-030 via applyPatches]
31. `src/core/store/store.ts:530` `      const tx: Transaction = { command: id, patches: applied.applied, inverses: applied.inverses, selectionBefore: before.selection, selectionAfter: selection, context, at: clock.now(), coalesceKey: key, message: outcome.message ?? null };` — um passo de desfazer com o recado.
32. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — publica a mudança. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/clipboard/clipboard.ts:355` `  if (content === undefined) return { kind: 'change', message: message('status.paste.empty') };` — sem o argumento (a execução que só pergunta se o comando roda): diz que não há o que colar; com o argumento: segue.
- R2 `src/core/clipboard/clipboard.ts:356` `  if (content.status === 'denied') return { kind: 'refused', message: message('status.clipboard.denied') };` — leitura negada: recusa `status.clipboard.denied`; legível: segue.
- R3 `src/core/clipboard/clipboard.ts:358` `  if (styles === null) return { kind: 'refused', message: message('status.paste.empty') };` — texto que não é o formato de estilos: recusa `status.paste.empty`; no formato: segue.
- R4 `src/core/clipboard/clipboard.ts:360` `  if (roots.length === 0) return { kind: 'refused', message: message('refusal.nothingSelected') };` — seleção vazia: recusa `refusal.nothingSelected`; com raiz: segue.
- R5 `src/core/clipboard/clipboard.ts:362` `  if (locked !== null) return { kind: 'refused', message: locked };` — travado: recusa com a mensagem da trava; destravado: segue.
- R6 `src/core/style/set.ts:59` `  if (target !== null && primary !== undefined) return [{ node: { ...primary.node, styles: target.styleClass.styles }, path: ['classes', target.index], parent: primary.parent, name: `.${target.styleClass.name}` }];` — com classe-alvo: o estilo vai para a classe; sem: para os elementos (ou para o componente, na parte de uma instância).
- R7 `src/core/clipboard/clipboard.ts:364` `  const said = holders.length === 1 ? message('status.style.pasted', { name: holders[0]?.name ?? '' }) : message('status.style.pastedMany', { count: holders.length });` — um detentor: `status.style.pasted` com o nome; vários: `status.style.pastedMany` com a contagem.
- R8 `src/core/clipboard/clipboard.ts:368` `  return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };` — todos os detentores já com esses estilos: só o recado; algum sem: os patches de substituir.
- R9 `src/core/clipboard/clipboard.ts:367` `  if (patches.length > 0 && !pastable(state.document, patches, context.rules)) return { kind: 'refused', message: message('status.paste.invalid') };` — os patches deixariam um documento inválido: recusa `status.paste.invalid`; válido: devolve a mudança.

## Fronteiras assíncronas
- nenhuma — o tratador de `src/core/clipboard/clipboard.ts:351` é síncrono e devolve o resultado antes de qualquer retorno de chamada; a leitura da área de transferência, assíncrona, acontece na porta (`src/editor/clipboard.ts:63` `export async function readClipboard(): Promise<ClipboardContent> {`), antes desta chamada.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectionRoots, firstLockRefusal, styleHolders, componentHolders, deepEqual, pastable, validateDocument, applyPatches), EST-L01-031 (a seleção, via handlerContext, selectionRoots), EST-L01-037 (o estado do editor, via handlerContext, styleHolders, targetClass)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com os estilos dos detentores substituídos (`src/core/clipboard/clipboard.ts:366` `  const patches: Patch[] = holders.flatMap((holder) => (deepEqual(holder.node.styles, styles) ? [] : [{ op: 'replace' as const, path: [...holder.path, 'styles'], value: styles }]));`); a seleção fica a mesma (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- **Re-renderizado:** quando há patches, os assinantes de documento são chamados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`); sem patches, só os assinantes da store (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** os painéis e o canvas seguem a store; a barra de status mostra o recado (`src/core/clipboard/clipboard.ts:364`).
- **DOM do canvas:** os elementos cujos estilos mudaram são redesenhados — os patches de `src/core/clipboard/clipboard.ts:366` são aplicados em `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);`.

## Regras
- G1: n/a — o trecho não vem de um campo de digitação; a escrita vai pelos mesmos detentores de todo estilo (`src/core/style/set.ts:59`), a classe-alvo ou a parte da instância.
- G2: n/a — o trecho não lê campo de texto nem rascunho; lê o argumento e o estado (`src/core/clipboard/clipboard.ts:352`) e nada é descartado.
- G3: ok — as quatro portas leem a área de transferência e chamam o mesmo tratador pela mesma linha `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`; o tratador decide só pelo valor do argumento e do estado.
- G4: n/a — o trecho não posiciona nem cobre o canvas.
- G5: n/a — o trecho não mede nem desenha painel ou barra.
- G6: ok — a colagem de estilo não muda a seleção (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`), então todas as vistas seguem a seleção única da store.
- G7: ok — os estilos vão por patches de substituir (`src/core/clipboard/clipboard.ts:366`) que a store aplica pelo único escritor (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);`).
- INT: ok — o documento que os patches fariam é validado antes de sair (`src/core/clipboard/clipboard.ts:367`), e um detentor que já tem esses estilos não gera patch (`src/core/clipboard/clipboard.ts:366`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer, quadro nem observador; o tratador de `src/core/clipboard/clipboard.ts:351` é síncrono.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco; o trecho lê o modelo e devolve patches.
