# TRC-clipboard.cut
- **Chamada:** `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`
- **Argumentos:** nenhum campo variável — o tipo é `Record<string, never>`, `src/generated/commands.ts:78` `"clipboard.cut": Record<string, never>;`; o tratador recebe só o contexto (o primeiro parâmetro).
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/clipboard/clipboard.ts:106` `  const roots = selectedRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectedRoots] [lê: EST-L01-031 via selectedRoots]
3. `src/core/clipboard/clipboard.ts:63` `  return [...allNodes(document)].filter((node) => chosen.has(node.id) && !inside(node.id));` — as raízes: os selecionados que nenhum outro selecionado contém. [lê: EST-L01-030 via allNodes]
4. `src/core/clipboard/clipboard.ts:107` `  const first = roots[0];`
5. `src/core/clipboard/clipboard.ts:108` `  if (first === undefined) return { kind: 'refused', message: message('refusal.nothingSelected') };` — sem raiz, recusa.
6. `src/core/clipboard/clipboard.ts:109` `  const leaving = deleteCommand.run(context, {});` — a regra de sair é a da exclusão de elementos.
7. `src/core/structure/remove.ts:49` `  const roots = selectionRoots(state.document, state.selection);` — as mesmas raízes. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
8. `src/core/structure/remove.ts:55` `  if (roots.some((r) => r.parent === null)) return { kind: 'refused', message: message('status.delete.root') };` — a raiz da página não é excluída.
9. `src/core/structure/remove.ts:57` `  const locked = firstLockRefusal(state.document, roots.map((r) => r.node.id), 'status.locked.delete');` — um elemento travado, ou dentro de um, recusa. [lê: EST-L01-030 via firstLockRefusal]
10. `src/core/nodes/flags.ts:49` `export function firstLockRefusal(document: DocumentJson, ids: readonly NodeId[], key: LockedKey): Message | null {` — abre a checagem; a cadeia de cada nó é lida em `src/core/nodes/flags.ts:40` `export function lockRefusal(document: DocumentJson, id: NodeId, key: LockedKey): Message | null {`
11. `src/core/structure/remove.ts:58` `  if (locked !== null) return { kind: 'refused', message: locked };` — travado: recusa com a mensagem da trava.
12. `src/core/structure/remove.ts:59` `  const after = selectionAfter(roots, primary);` — onde a seleção fica depois.
13. `src/core/structure/remove.ts:38` `  const next = siblings.slice(primary.index + 1).find((s) => !leaving.has(s.id));` — o irmão seguinte que fica.
14. `src/core/structure/remove.ts:39` `  if (next) return next.id;` — havendo irmão seguinte, a seleção vai para ele.
15. `src/core/structure/remove.ts:45` `  return primary.parent?.id ?? null;` — sem irmão, a seleção vai para o pai.
16. `src/core/structure/remove.ts:64` `    .map((r) => ({ op: 'remove', path: r.path }));` — os patches de remoção, do último para o primeiro.
17. `src/core/structure/remove.ts:67` `  const cited = roots.reduce((sum, root) => sum + referencesTo(state.document, root.node.id), 0);` — quantas referências apontam para o que sai. [lê: EST-L01-030 via referencesTo]
18. `src/core/elements/references.ts:92` `export function referencesTo(document: DocumentJson, id: NodeId): number {` — abre a contagem de referências.
19. `src/core/structure/remove.ts:75` `  const released = releaseReferencesPatch(state.document, going);` — as referências que saem vão no mesmo passo. [lê: EST-L01-030 via releaseReferencesPatch]
20. `src/core/document/tree.ts:56` `export function releaseReferencesPatch(document: DocumentJson, leaving: ReadonlySet<NodeId>, names: ReadonlySet<string> = leavingNames(document, leaving)): Patch[] {` — abre o produtor dos patches de referência.
21. `src/core/structure/remove.ts:78` `    patches: [...released, ...patches],` — os patches devolvidos: referências e remoções.
22. `src/core/structure/remove.ts:79` `    selection: after === null ? [] : [after],` — a seleção depois da exclusão.
23. `src/core/structure/remove.ts:80` `    message: said,` — o recado da exclusão.
24. `src/core/clipboard/clipboard.ts:110` `  if (leaving.kind !== 'change') return leaving;` — se a exclusão recusou, o corte recusa com a mesma mensagem.
25. `src/core/clipboard/clipboard.ts:113` `    clipboard: copiedWrite(state.document, rules, roots),` — o que o corte escreve na área de transferência (o mesmo da cópia).
26. `src/core/clipboard/clipboard.ts:114` `    message: roots.length === 1 ? message('status.cut', { name: first.name }) : message('status.cutMany', { count: roots.length }),` — o recado do corte: um elemento pelo nome, vários pela contagem.
27. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches de remoção. [lê: EST-L01-030 via applyPatches]
28. `src/core/store/store.ts:530` `      const tx: Transaction = { command: id, patches: applied.applied, inverses: applied.inverses, selectionBefore: before.selection, selectionAfter: selection, context, at: clock.now(), coalesceKey: key, message: outcome.message ?? null };` — um passo de desfazer com o recado do corte. [lê: EST-L01-031 via run] [lê: EST-L01-033 via run]
29. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — publica a mudança. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
30. `src/core/store/store.ts:572` `    if (outcome.clipboard !== undefined) options.clipboard?.write(outcome.clipboard);` — entrega a escrita à porta da área de transferência.
31. `src/editor/clipboard.ts:79` `    own = content.text;` — a cópia própria do editor guarda o texto. [escreve: EST-L05b-001 via browserClipboard.write]

## Ramos
- R1 `src/core/clipboard/clipboard.ts:108` `  if (first === undefined) return { kind: 'refused', message: message('refusal.nothingSelected') };` — seleção vazia: recusa `refusal.nothingSelected`; com raiz: segue para a exclusão.
- R2 `src/core/structure/remove.ts:55` `  if (roots.some((r) => r.parent === null)) return { kind: 'refused', message: message('status.delete.root') };` — uma raiz é a da página: a exclusão recusa `status.delete.root`, e o corte devolve essa recusa no passo 24.
- R3 `src/core/structure/remove.ts:58` `  if (locked !== null) return { kind: 'refused', message: locked };` — algum nó travado: a exclusão recusa com a mensagem da trava, e o corte devolve essa recusa.
- R4 `src/core/clipboard/clipboard.ts:110` `  if (leaving.kind !== 'change') return leaving;` — a exclusão recusou (não mudou): o corte recusa com a mensagem dela; mudou: o corte acrescenta a escrita da área de transferência e o próprio recado.
- R5 `src/core/clipboard/clipboard.ts:114` `    message: roots.length === 1 ? message('status.cut', { name: first.name }) : message('status.cutMany', { count: roots.length }),` — uma raiz: `status.cut` com o nome; mais de uma: `status.cutMany` com a contagem.
- R6 `src/core/structure/remove.ts:39` `  if (next) return next.id;` — com irmão seguinte que fica, a seleção vai para ele; sem ele, `src/core/structure/remove.ts:45` `  return primary.parent?.id ?? null;` vai para o pai (ou vazia sem pai).
- R7 `src/core/structure/remove.ts:67` `  const cited = roots.reduce((sum, root) => sum + referencesTo(state.document, root.node.id), 0);` — com referências apontando para o que sai, o recado é `status.deleted.cited`; sem nenhuma, `status.deleted` ou `status.deletedMany`.

## Fronteiras assíncronas
- nenhuma — o tratador e a exclusão que ele chama são síncronos; a leitura das raízes (`src/core/clipboard/clipboard.ts:106` `  const roots = selectedRoots(state.document, state.selection);`) e a montagem dos patches não esperam por nada.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectedRoots, allNodes, selectionRoots, firstLockRefusal, referencesTo, releaseReferencesPatch, applyPatches), EST-L01-031 (a seleção, via handlerContext, selectedRoots, selectionRoots, run), EST-L01-033 (a mensagem, via run), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via publish), EST-L01-033 (a mensagem, via publish), EST-L05b-001

## Resultado
- **Estado final:** EST-L01-030 com os nós removidos a menos e EST-L01-031 com a seleção no irmão seguinte, no anterior ou no pai (`src/core/structure/remove.ts:79` `    selection: after === null ? [] : [after],`); EST-L05b-001 em V2, com o texto cortado (`src/editor/clipboard.ts:79` `    own = content.text;`).
- **Re-renderizado:** os assinantes de documento são chamados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`), porque o documento mudou; os assinantes da store também (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** os painéis e o canvas seguem a nova seleção pela store; a barra de status mostra o recado do corte (`src/core/clipboard/clipboard.ts:114`).
- **DOM do canvas:** os elementos removidos somem — o patch de `src/core/structure/remove.ts:64` é aplicado em `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);`.

## Regras
- G1: n/a — o trecho não grava por um campo de digitação; devolve patches aplicados pela store (`src/core/store/store.ts:477`).
- G2: n/a — o trecho não lê campo de texto nem rascunho; lê o estado (`src/core/clipboard/clipboard.ts:106`) e nada é descartado.
- G3: ok — as portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:208` `'clipboard.cut': cutCommand,` e enviam os mesmos argumentos vazios.
- G4: n/a — o trecho não posiciona nem cobre o canvas.
- G5: n/a — o trecho não mede nem desenha painel ou barra.
- G6: ok — a seleção depois é a única devolvida em `src/core/structure/remove.ts:79` `    selection: after === null ? [] : [after],` e aplicada pela store em `src/core/store/store.ts:523` `    const selection = followed === null ? chosen : chosen.filter((node) => locate(applied.document, node) !== null);`.
- G7: ok — o documento muda por patches de topo (`src/core/structure/remove.ts:64`) que a store aplica pelo único escritor (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);`).
- INT: ok — as referências que apontavam para o que sai vão no mesmo passo (`src/core/structure/remove.ts:75` `  const released = releaseReferencesPatch(state.document, going);`), e a exclusão nunca é undoable em falso (o manifesto declara `undoable`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer, quadro nem observador; o tratador de `src/core/clipboard/clipboard.ts:104` e a exclusão de `src/core/structure/remove.ts:48` são síncronos.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco; o trecho lê o modelo e devolve patches.
