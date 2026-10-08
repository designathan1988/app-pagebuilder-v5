# TRC-element.setLayerColor

- **Chamada:** `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ target, color }` (`manifest/commands/nodes.json:503` `"args": {`), com `target` (tipo `node`, obrigatório) e `color` (tipo `color`, obrigatório); a porta `layers-row-colour-dot` envia `{ target: node.id, color }` (`src/editor/shell/sidebar/layers.tsx:146` `{chosen === undefined ? null : <span className="row__swatch row__swatch--none" onClick={() => setOpen(false)}><DoorControl entry={entry} args={{ target: node.id, color: '' }} tabbable={false} /></span>}`).
- **Ramos que dependem dos argumentos:** R2 (a forma de `color`), R4 (`color` vazio tira a cor) e R7 (`color` igual à que o nó tem não muda nada).

## Passos

1. `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada antes.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
5. `src/core/nodes/flags.ts:155` `export const setLayerColorCommand = registerHandler('element.setLayerColor', ({ state }, { target, color }): Outcome<never> => {` — o tratador.
6. `src/core/nodes/flags.ts:156` `  const at = flagged(state.document, state.selection, target);` — [lê: EST-L01-030 via flagged] [lê: EST-L01-031 via flagged] o nó que a porta nomeou.
7. `src/core/nodes/flags.ts:101` `  const id = typeof target === 'string' ? (target as NodeId) : selection[0];` — o nó é o `target` (`color` é obrigatório, então a dot o manda).
8. `src/core/nodes/flags.ts:157` `  if (at === null) throw new Error(` — R1.
9. `src/core/nodes/flags.ts:158` `  if (typeof color !== 'string') throw new Error('element.setLayerColor: a colour is a string');` — R2.
10. `src/core/nodes/flags.ts:159` `  const root = state.document.pages[at.page]?.tree;` — [lê: EST-L01-030 via handlerContext] a raiz da página do nó.
11. `src/core/nodes/flags.ts:160` `  if (root === undefined) throw new Error(` — R3.
12. `src/core/nodes/flags.ts:161` `  const list = root.layerColors ?? [];` — a lista de cores da página.
13. `src/core/nodes/flags.ts:162` `  const held = list.findIndex((one) => one.node === at.node.id);` — a entrada do nó, se houver.
14. `src/core/nodes/flags.ts:163` `  const path = ['pages', at.page, 'tree', 'layerColors'];` — o caminho que os patches usam.
15. `src/core/nodes/flags.ts:164` `  const typed = color.trim();` — a cor aparada.
16. `src/core/nodes/flags.ts:165` `  if (typed === '') {` — R4.
17. `src/core/nodes/flags.ts:166` `    const removed = message('status.layerColor.removed', { name: at.node.name });` — a mensagem de retirada.
18. `src/core/nodes/flags.ts:167` `    if (held < 0) return { kind: 'change', message: removed };` — R5.
19. `src/core/nodes/flags.ts:170` `    return { kind: 'change', patches: [{ op: 'remove', path: list.length === 1 ? path : [...path, held] }], message: removed };` — R6.
20. `src/core/nodes/flags.ts:172` `  const said = message('status.layerColor.set', { name: at.node.name });` — a mensagem de definir.
21. `src/core/nodes/flags.ts:173` `  if (held >= 0 && list[held]?.colour === typed) return { kind: 'change', message: said };` — R7.
22. `src/core/nodes/flags.ts:175` `  const patches: Patch[] = list.length === 0 ? [{ op: 'add', path, value: [{ node: at.node.id, colour: typed }] }] : held < 0 ? [{ op: 'add', path: [...path, list.length], value: { node: at.node.id, colour: typed } }] : [{ op: 'replace', path: [...path, held, 'colour'], value: typed }];` — R8.
23. `src/core/nodes/flags.ts:176` `  return { kind: 'change', patches, message: said };` — o Outcome.
24. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — uma recusa seguiria por aqui; este tratador não recusa.
25. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — [escreve: EST-L01-030 via applyPatches] a cor entra no documento.
26. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — [escreve: EST-L01-032 via record] o passo entra na história.
27. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
28. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
29. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
30. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/nodes/flags.ts:157` `if (at === null)` — o nó que a porta nomeou não está no documento (nem há seleção): lança (defeito da porta); achado: segue.
- R2 `src/core/nodes/flags.ts:158` `if (typeof color !== 'string')` — a cor não é texto: lança (defeito da porta); texto: segue.
- R3 `src/core/nodes/flags.ts:160` `if (root === undefined)` — a página do nó não está no documento: lança; está: segue.
- R4 `src/core/nodes/flags.ts:165` `if (typed === '')` — cor vazia: a cor do nó é retirada (R5 e R6); preenchida: segue para definir (R7 e R8).
- R5 `src/core/nodes/flags.ts:167` `if (held < 0)` — o nó não tinha cor: `change` só com a mensagem, nada muda; tinha: segue.
- R6 `src/core/nodes/flags.ts:170` `path: list.length === 1 ? path : [...path, held]` — era a única cor da página: o patch remove a lista inteira; havendo outras: remove só a entrada do nó.
- R7 `src/core/nodes/flags.ts:173` `if (held >= 0 && list[held]?.colour === typed)` — a cor é a que o nó já tem: `change` só com a mensagem; diferente: segue.
- R8 `src/core/nodes/flags.ts:175` `const patches: Patch[] = list.length === 0 ?` — página sem cor: o patch `add` cria a lista inteira; cor nova: `add` de uma entrada no fim; cor já existente no nó: `replace` do campo `colour`.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/nodes/flags.ts:155` `export const setLayerColorCommand = registerHandler('element.setLayerColor', ({ state }, { target, color }): Outcome<never> => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via argumentRefusal, flagged, handlerContext), EST-L01-031 (a seleção, via flagged), EST-L05a-001 (a digitação pendente, via `beforeCommand`).
- escreve: EST-L01-030 (`pages[at.page].tree.layerColors`, via applyPatches, commit, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (a história, via record), EST-L01-033 (a mensagem, via publish).

## Resultado

- **Estado final:** EST-L01-030 — a lista `layerColors` da raiz da página ganha, troca ou perde a entrada do nó (`src/core/nodes/flags.ts:170` e `src/core/nodes/flags.ts:175`); nada disso vai ao export (o dado fica no documento, na raiz da página).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha de Camadas desenha a cor (`src/editor/shell/sidebar/layers.tsx:288` `'--row-colour': layerColourCss(colour)`).
- **DOM do canvas:** a moldura do canvas desenha a seleção na cor do nó (`src/editor/canvas/chrome.tsx:1130` `style={layerColour === null ? undefined : ({ '--color-layer-label': layerColourCss(layerColour) } as CSSProperties)}`).

## Regras

- G1: n/a — a cor vive na raiz da página (`src/core/nodes/flags.ts:163`) e não numa camada de estilo (breakpoint, estado, classe).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/nodes/flags.ts:155` — o único tratador do comando; toda porta entrega o mesmo par `{ target, color }`.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/nodes/flags.ts:176`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/nodes/flags.ts:176`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/nodes/flags.ts:176`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/nodes/flags.ts:155`).

## Medições

- nenhuma
