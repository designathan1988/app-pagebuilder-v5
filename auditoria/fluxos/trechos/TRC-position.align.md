# TRC-position.align
- **Chamada:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Argumentos:** `{ edge }` — enum `left`, `horizontal-center`, `right`, `top`, `vertical-center`, `bottom`, obrigatório, como o manifesto declara (`manifest/commands/geometry.json:898` `"edge": {`).
- **Ramos que dependem dos argumentos:** R4 e R5 (o `edge` decide o eixo e a borda/centro em que os elementos se alinham).

## Passos
1. `src/app/commands.ts:328` `'position.align': alignCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `positionedSelection` é testada (recusa `status.align.needsPositioned`).
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/core/geometry/align.ts:51` `export const alignCommand = registerHandler('position.align', (context, { edge }) => {` — o tratador recebe o contexto e o `edge`.
8. `src/core/geometry/align.ts:52` `const found = movable(context);` — as raízes da seleção, recusadas enquanto uma estiver travada [lê: EST-L01-030 via movable] [lê: EST-L01-031 via movable].
9. `src/core/geometry/align.ts:38` `const locked = firstLockRefusal(state.document, roots.map((at) => at.node.id as NodeId), 'status.locked.move');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
10. `src/core/geometry/align.ts:55` `const target = EDGES[edge];` — o `edge` é resolvido no mapa.
11. `src/core/geometry/align.ts:59` `const only = roots.length === 1 ? roots[0] : undefined;` — um só elemento recebe o tratamento do pai; vários, o das caixas desenhadas.
12. `src/core/geometry/align.ts:62` `const place = measuredPlace(context as HandlerContext<unknown>, only.node);` — onde o único elemento está agora vem do porto de layout [lê: EST-L01-030 via measuredPlace].
13. `src/core/geometry/align.ts:65` `const delta = target.at === 'start' ? -before : target.at === 'end' ? after : (after - before) / 2;` — o deslocamento até a borda ou o centro do pai.
14. `src/core/geometry/align.ts:69` `const boxes = roots.map((at) => ({ at, box: context.layout.box(at.node.id as NodeId) }));` — as caixas desenhadas dos vários elementos vêm do porto de layout [lê: EST-L01-030 via layout.box].
15. `src/core/geometry/align.ts:72` `const low = Math.min(...measured.map((m) => m.start));` — o início e o fim que limitam a seleção.
16. `src/core/geometry/align.ts:76` `delta: target.at === 'start' ? low - m.start : target.at === 'end' ? high - (m.start + m.size) : (low + high) / 2 - (m.start + m.size / 2),` — o deslocamento de cada elemento.
17. `src/core/geometry/align.ts:47` `return writeDeclarations(at.node, at.path, context.rules.base, movedInsets(at.node, context.rules, measuredPlace(context as HandlerContext<unknown>, at.node), dx, dy).writes);` — os insets que movem cada elemento são escritos na camada ativa [escreve: EST-L01-030 via writeDeclarations].
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/geometry/align.ts:53` `if ('refused' in found) return found.refused;` — alguma raiz travada: recusa `status.locked.move`; livres: segue para o passo 10.
- R2 `src/core/geometry/align.ts:57` `if (roots.length === 0) return { kind: 'change' };` — sem raízes: `change` sem patch; com raízes: segue.
- R3 `src/core/geometry/align.ts:60` `if (only !== undefined) {` — um só elemento: alinha contra a caixa de preenchimento do pai; vários: o passo 69 alinha contra os limites da seleção.
- R4 `src/core/geometry/align.ts:63` `if (place === null) return { kind: 'change', message: said };` — o pai não é medido: `change` sem patch; medido: o passo 66 move.
- R5 `src/core/geometry/align.ts:71` `if (measured.length === 0) return { kind: 'change', message: said };` — nenhuma caixa medida: `change` sem patch; medidas: o passo 78 move.
- R6 `src/core/geometry/align.ts:64` `const [before = 0, after = 0] = target.axis === 'horizontal' ? [place.left, place.right] : [place.top, place.bottom];` — eixo horizontal lê `left`/`right`; vertical lê `top`/`bottom`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/geometry/align.ts:51` `export const alignCommand = registerHandler('position.align', (context, { edge }) => {`) e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- Lê: EST-L01-030 (o documento e as regras, via argumentRefusal, movable, firstLockRefusal, measuredPlace, layout.box), EST-L01-031 (a seleção, via movable, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`, via writeDeclarations, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os insets de cada elemento mudam para alinhá-lo (`src/core/geometry/align.ts:47`); a mensagem é `status.align.done` (`src/core/geometry/align.ts:58` `const said = message('status.align.done', { edge: { key: `command.align.${camel(edge)}` as MessageId }, elements: { plural: 'status.elementCount', count: roots.length } });`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com a borda e quantos elementos moveu.
- **DOM do canvas:** o iframe desenha os elementos alinhados pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/align.ts:47`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:328` `'position.align': alignCommand,` — o painel rápido, o menu Organizar e a barra de comandos chamam o mesmo tratador com a mesma forma `{ edge }`.
- G4: n/a — o trecho não desenha painel nem barra sobre o canvas (`src/core/geometry/align.ts:78`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/core/geometry/align.ts:47`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/geometry/align.ts:51`).

## Medições
- nenhuma — o trecho não chama API de medida; a caixa e a posição de cada elemento chegam pelo porto de layout (`src/core/ports/layout.ts:9` `box(node: NodeId): Rect | null;`).
