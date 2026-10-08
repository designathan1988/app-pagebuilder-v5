# TRC-position.setAnchors
- **Chamada:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Argumentos:** `{ edge, mode }` — `edge` é um enum `left`, `right`, `top`, `bottom`, `horizontal-center`, `vertical-center`, `horizontal-stretch`, `vertical-stretch`; `mode` é um enum `toggle`, `set`; os dois obrigatórios, como o manifesto declara (`manifest/commands/geometry.json:601` `"edge": {`).
- **Ramos que dependem dos argumentos:** R4 (`edge`), R5 (`mode`), R6 e R7 (`edge` decide o eixo, o lado, o centro ou os dois).

## Passos
1. `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `positionedSelection` é testada.
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/core/geometry/anchors.ts:100` `  'position.setAnchors',` — o tratador é registrado para `position.setAnchors`.
8. `src/core/geometry/anchors.ts:101` `  (context, { edge, mode }) => {` — o tratador recebe o contexto e os dois argumentos.
9. `src/core/geometry/anchors.ts:103` `if (state.selection.length !== 1) return { kind: 'refused', message: message('status.needsSingleSelection') };` — exige exatamente um elemento [lê: EST-L01-031 via handlerContext].
10. `src/core/geometry/anchors.ts:104` `const found = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o nó é achado [lê: EST-L01-030 via locate].
11. `src/core/geometry/anchors.ts:106` `const locked = firstLockRefusal(state.document, [found.node.id as NodeId], 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
12. `src/core/geometry/anchors.ts:108` `const target = EDGES[edge];` — o `edge` é resolvido no mapa dos lados.
13. `src/core/geometry/anchors.ts:110` `const both = axes(rules);` — os dois eixos, do composto `inset`, do composto `margin` e da seção de tamanho [lê: EST-L01-030 via axes].
14. `src/core/geometry/anchors.ts:112` `const current = anchorsOf(found.node, axis, rules);` — as âncoras de agora no eixo [lê: EST-L01-030 via anchorsOf].
15. `src/core/geometry/anchors.ts:113` `const next = nextAnchors(current, target.side, mode);` — as âncoras novas, pelo `edge` e pelo `mode`.
16. `src/core/geometry/anchors.ts:117` `const place = layout.place(found.node.id as NodeId, fixed ? 'viewport' : 'parent') as Readonly<Record<string, number>> | null;` — onde o elemento está agora vem do porto de layout [lê: EST-L01-030 via layout.place].
17. `src/core/geometry/anchors.ts:132` `writes[axis.start] = next.sides.has('start') ? `${start}px` : null;` — os insets e o tamanho são escritos em px inteiros (nunca menores que o desenhado).
18. `src/core/geometry/anchors.ts:144` `patches: writeDeclarations(found.node, found.path, rules.base, writes),` — as declarações da âncora são escritas na camada ativa [escreve: EST-L01-030 via writeDeclarations].
19. `src/core/geometry/anchors.ts:145` `message: message('status.anchors.set', { name: found.node.name, horizontal: words(horizontal, both.horizontal), vertical: words(vertical, both.vertical) }),` — a mensagem diz as âncoras dos dois eixos.
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/geometry/anchors.ts:103` `if (state.selection.length !== 1) return { kind: 'refused', message: message('status.needsSingleSelection') };` — nem um nem vários: recusa `status.needsSingleSelection`; exatamente um: segue para o passo 10.
- R2 `src/core/geometry/anchors.ts:105` `if (found === null) return { kind: 'change' };` — o id não está no documento: `change` sem patch; está: segue.
- R3 `src/core/geometry/anchors.ts:107` `if (locked !== null) return { kind: 'refused', message: locked };` — nó travado: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/geometry/anchors.ts:109` `if (target === undefined) throw new Error(`position.setAnchors: no edge ${edge}`);` — `edge` fora do mapa (defeito da porta): lança; válido: segue.
- R5 `src/core/geometry/anchors.ts:91` `if (mode === 'set') return { kind: 'edges', sides: new Set<Side>([side]) };` — `mode` `set`: fixa só aquele lado; `toggle`: o passo 92 alterna sobre as âncoras de agora.
- R6 `src/core/geometry/anchors.ts:96` `return { kind: 'edges', sides: next.size === 0 ? new Set<Side>([side === 'start' ? 'end' : 'start']) : next };` — tirar o único lado ancorado ancora o oposto; com lados restantes: ficam.
- R7 `src/core/geometry/anchors.ts:122` `if (next.kind === 'center') {` — centro: os dois insets `0px`, as margens `auto` e o tamanho `fit-content`; fora do centro: o passo 125 cuida das margens que saem e dos insets e do tamanho.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/geometry/anchors.ts:99` `export const setAnchorsCommand = registerHandler(`) e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- Lê: EST-L01-030 (o documento e as regras, via argumentRefusal, locate, firstLockRefusal, axes, anchorsOf, layout.place), EST-L01-031 (a seleção, via handlerContext, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`, via writeDeclarations, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os insets, as margens e o tamanho do eixo mudam (`src/core/geometry/anchors.ts:133` `writes[axis.end] = !next.sides.has('end') ? null : `${both ? roundedDown(exact(axis.end) + exact(axis.start) - start) : Math.round(exact(axis.end))}px`;`); a mensagem é `status.anchors.set`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra as âncoras dos dois eixos (`src/core/geometry/anchors.ts:145`).
- **DOM do canvas:** o iframe desenha o elemento com as âncoras novas pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/anchors.ts:144`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — as setas e as abas do canvas chamam o mesmo tratador com a mesma forma `{ edge, mode }`.
- G4: n/a — o trecho não desenha painel nem barra sobre o canvas (`src/core/geometry/anchors.ts:144`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/core/geometry/anchors.ts:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/geometry/anchors.ts:99`).

## Medições
- nenhuma — o trecho não chama API de medida; onde o elemento está chega pelo porto de layout (`src/core/ports/layout.ts:18` `place(node: NodeId, within: 'parent' | 'viewport'): Place | null;`).
