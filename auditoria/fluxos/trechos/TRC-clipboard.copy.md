# TRC-clipboard.copy
- **Chamada:** `src/app/commands.ts:206` `'clipboard.copy': copyCommand,`
- **Argumentos:** nenhum campo variável — o tipo é `Record<string, never>`, `src/generated/commands.ts:76` `"clipboard.copy": Record<string, never>;`; o tratador recebe só o contexto (o primeiro parâmetro).
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/clipboard/clipboard.ts:90` `  const roots = selectedRoots(state.document, state.selection);` — as raízes da seleção. [lê: EST-L01-030 via selectedRoots] [lê: EST-L01-031 via selectedRoots]
3. `src/core/clipboard/clipboard.ts:63` `  return [...allNodes(document)].filter((node) => chosen.has(node.id) && !inside(node.id));` — percorre os nós da página e fica com os selecionados que nenhum outro selecionado contém. [lê: EST-L01-030 via allNodes]
4. `src/core/clipboard/clipboard.ts:60` `    for (let at = locate(document, id)?.parent ?? null; at !== null; at = locate(document, at.id)?.parent ?? null) if (chosen.has(at.id)) return true;` — a subida pelos ancestrais marca um selecionado dentro de outro selecionado. [lê: EST-L01-030 via locate]
5. `src/core/document/model.ts:290` `export function locate(doc: DocumentJson, id: NodeId): Location | null {` — a localização de cada id pelo índice da árvore.
6. `src/core/clipboard/clipboard.ts:91` `  const first = roots[0];` — a primeira raiz.
7. `src/core/clipboard/clipboard.ts:92` `  if (first === undefined) return { kind: 'refused', message: message('refusal.nothingSelected') };` — sem raiz, recusa.
8. `src/core/clipboard/clipboard.ts:94` `  if (roots.some((node) => locate(state.document, node.id)?.parent === null)) return { kind: 'refused', message: message('status.copy.root') };` — a raiz da página nunca é copiada.
9. `src/core/clipboard/clipboard.ts:97` `    clipboard: copiedWrite(state.document, rules, roots),` — o que a cópia escreve na área de transferência.
10. `src/core/clipboard/clipboard.ts:83` `  const text = JSON.stringify({ format: ELEMENTS_FORMAT, nodes: roots.map(withoutIds) });` — o texto no formato de elementos do editor.
11. `src/core/clipboard/clipboard.ts:51` `  const copy: Record<string, unknown> = { ...node, copiedFrom: node.id, children: node.children.map(withoutIds) };` — cada nó copiado sem o id, guardando o id de origem.
12. `src/core/clipboard/clipboard.ts:52` `  delete copy.id;` — o id sai do texto.
13. `src/core/clipboard/clipboard.ts:84` `  const { html, css } = exportedFragment(document, rules, roots);` — o markup exportado e as regras que ele usa.
14. `src/core/clipboard/clipboard.ts:71` `  const index = openedPage({ document });` — a página mostrada. [lê: EST-L01-030 via openedPage]
15. `src/core/clipboard/clipboard.ts:75` `  const code = pageLines(asPage, index, rules);` — o escritor do site escreve os nós como filhos da raiz da página.
16. `src/core/export/export.ts:258` `export function pageLines(document: DocumentJson, pageIndex: number, manifestRules: ModelRules, shared: SharedClasses = newShared(document, manifestRules), relative = true): PageCode {` — abre o escritor da página.
17. `src/core/clipboard/clipboard.ts:77` `  return { html, css: pageCss(code.css).trimEnd() };` — o HTML (linhas da página que têm nó) e o CSS aparado.
18. `src/core/export/export.ts:223` `export const pageCss` — o texto do CSS a partir das linhas.
19. `src/core/clipboard/clipboard.ts:85` `  if (html === '') return { text };` — sem markup, a área de transferência leva só o texto.
20. `src/core/clipboard/clipboard.ts:86` `  return css === '' ? { text, html } : { text, html, css };` — com markup, leva o HTML e, quando houver, o CSS ao lado.
21. `src/core/clipboard/clipboard.ts:98` `    message: roots.length === 1 ? message('status.copied', { name: first.name }) : message('status.copiedMany', { count: roots.length }),` — o recado: um elemento pelo nome, vários pela contagem.
22. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a cópia não devolve patch, então o documento não mudou. [lê: EST-L01-030 via deepEqual]
23. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
24. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — publica sem patches. [escreve: EST-L01-033 via publish]
25. `src/core/store/store.ts:572` `    if (outcome.clipboard !== undefined) options.clipboard?.write(outcome.clipboard);` — entrega a escrita à porta da área de transferência.
26. `src/editor/clipboard.ts:79` `    own = content.text;` — a cópia própria do editor guarda o texto. [escreve: EST-L05b-001 via browserClipboard.write]

## Ramos
- R1 `src/core/clipboard/clipboard.ts:92` `  if (first === undefined) return { kind: 'refused', message: message('refusal.nothingSelected') };` — seleção vazia (nenhuma raiz): recusa `refusal.nothingSelected`; com raiz: segue para o passo 8.
- R2 `src/core/clipboard/clipboard.ts:94` `  if (roots.some((node) => locate(state.document, node.id)?.parent === null)) return { kind: 'refused', message: message('status.copy.root') };` — alguma raiz é a raiz da página (parente nulo): recusa `status.copy.root`; nenhuma é: segue para a cópia.
- R3 `src/core/clipboard/clipboard.ts:98` `    message: roots.length === 1 ? message('status.copied', { name: first.name }) : message('status.copiedMany', { count: roots.length }),` — uma raiz: `status.copied` com o nome; mais de uma: `status.copiedMany` com a contagem.
- R4 `src/core/clipboard/clipboard.ts:85` `  if (html === '') return { text };` — sem markup exportável: a escrita leva só o texto; com markup: `src/core/clipboard/clipboard.ts:86` `  return css === '' ? { text, html } : { text, html, css };` leva o HTML e, se houver, o CSS.
- R5 `src/core/clipboard/clipboard.ts:60` `    for (let at = locate(document, id)?.parent ?? null; at !== null; at = locate(document, at.id)?.parent ?? null) if (chosen.has(at.id)) return true;` — um selecionado dentro de outro selecionado não é raiz e não é copiado sozinho.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono e devolve o resultado antes de qualquer retorno de chamada; a criação das raízes e do texto (`src/core/clipboard/clipboard.ts:90` `  const roots = selectedRoots(state.document, state.selection);`) não espera por nada.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, selectedRoots, allNodes, locate, openedPage, deepEqual), EST-L01-031 (a seleção, via selectedRoots), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-033 (a mensagem, via run, publish), EST-L05b-001

## Resultado
- **Estado final:** EST-L01-030 com o mesmo documento e EST-L01-031 com a mesma seleção; muda só EST-L01-033 (a mensagem) (`src/core/store/store.ts:515`) e EST-L05b-001 em V2, com o texto copiado (`src/editor/clipboard.ts:79` `    own = content.text;`).
- **Re-renderizado:** os assinantes da store são chamados por `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`; os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** nada muda — o tratador devolve só uma escrita de área de transferência (`src/core/clipboard/clipboard.ts:97`); a barra de status passa a mostrar a mensagem de `src/core/clipboard/clipboard.ts:98`.
- **DOM do canvas:** nada muda — `src/core/clipboard/clipboard.ts:89` `export const copyCommand = registerHandler('clipboard.copy', ({ state, rules }): Outcome<never> => {` não devolve patch, e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento por um campo de digitação; devolve uma escrita de área de transferência (`src/core/clipboard/clipboard.ts:97`).
- G2: n/a — o trecho não lê um campo de texto nem um rascunho; lê o estado (`src/core/clipboard/clipboard.ts:90`) e nada é descartado.
- G3: ok — as portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:206` `'clipboard.copy': copyCommand,` e enviam os mesmos argumentos vazios.
- G4: n/a — o trecho não posiciona nem cobre o canvas; não desenha (devolve dados em `src/core/clipboard/clipboard.ts:97`).
- G5: n/a — o trecho não mede nem desenha painel ou barra.
- G6: ok — a seleção não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`), então todas as vistas seguem a seleção única da store.
- G7: ok — sem patch, o DOM do canvas não muda (`src/core/clipboard/clipboard.ts:89`).
- INT: n/a — o trecho não escreve no documento; devolve só a escrita da área de transferência (`src/core/clipboard/clipboard.ts:97`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer, quadro nem observador; o tratador de `src/core/clipboard/clipboard.ts:89` é síncrono.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco; o trecho lê o modelo e devolve dados (`src/core/clipboard/clipboard.ts:97`).
