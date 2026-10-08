# TRC-position.distribute
- **Chamada:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Argumentos:** `{ axis }` — enum `horizontal`, `vertical`, obrigatório, como o manifesto declara (`manifest/commands/geometry.json:1367` `"axis": {`).
- **Ramos que dependem dos argumentos:** R3 e R4 (o `axis` decide o eixo dos vãos e o eixo dos deslocamentos em `moves`).

## Passos
1. `src/app/commands.ts:329` `'position.distribute': distributeCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `distributableSelection` é testada.
6. `src/core/geometry/align.ts:87` `(state, rules) => positionedSelection.test(state, rules) && selectionRoots(state.document, state.selection).length >= DISTRIBUTE_MIN,` — exige três posicionados ou mais [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots].
7. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
8. `src/core/geometry/align.ts:91` `export const distributeCommand = registerHandler('position.distribute', (context, { axis }) => {` — o tratador recebe o contexto e o `axis`.
9. `src/core/geometry/align.ts:92` `const found = movable(context);` — as raízes da seleção, recusadas enquanto uma estiver travada [lê: EST-L01-030 via movable] [lê: EST-L01-031 via movable].
10. `src/core/geometry/align.ts:95` `if (roots.length < DISTRIBUTE_MIN) return { kind: 'refused', message: message('status.distribute.needsThree') };` — menos de três raízes: recusa `status.distribute.needsThree`.
11. `src/core/geometry/align.ts:98` `const box = context.layout.box(at.node.id as NodeId);` — a caixa desenhada de cada elemento vem do porto de layout [lê: EST-L01-030 via layout.box].
12. `src/core/geometry/align.ts:101` `.sort((a, b) => a.start - b.start);` — as caixas medidas são ordenadas pelo início do eixo.
13. `src/core/geometry/align.ts:107` `const gap = (last.start + last.size - first.start - measured.reduce((sum, m) => sum + m.size, 0)) / (measured.length - 1);` — o vão igual que enche o vão do primeiro ao último.
14. `src/core/geometry/align.ts:109` `const travels = measured.map((m) => {` — o deslocamento de cada elemento, o primeiro e o último parados.
15. `src/core/geometry/align.ts:45` `const dx = axis === 'horizontal' ? delta : 0;` — o eixo `horizontal` desloca em `x`; `vertical`, em `y` (`src/core/geometry/align.ts:46` `const dy = axis === 'vertical' ? delta : 0;`).
16. `src/core/geometry/align.ts:47` `return writeDeclarations(at.node, at.path, context.rules.base, movedInsets(at.node, context.rules, measuredPlace(context as HandlerContext<unknown>, at.node), dx, dy).writes);` — os insets que movem cada elemento são escritos na camada ativa [escreve: EST-L01-030 via writeDeclarations].
17. `src/core/geometry/align.ts:114` `return { kind: 'change', patches: moves(context, travels, axis), message: said };` — o tratador devolve os patches e a mensagem.
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/geometry/align.ts:93` `if ('refused' in found) return found.refused;` — alguma raiz travada: recusa `status.locked.move`; livres: segue para o passo 10.
- R2 `src/core/geometry/align.ts:95` `if (roots.length < DISTRIBUTE_MIN) return { kind: 'refused', message: message('status.distribute.needsThree') };` — menos de três: recusa `status.distribute.needsThree`; três ou mais: segue.
- R3 `src/core/geometry/align.ts:99` `return box === null ? [] : [{ at, ...span(box, axis) }];` — elemento não desenhado: sai da medida; desenhado: entra com o vão do `axis`.
- R4 `src/core/geometry/align.ts:105` `if (first === undefined || last === undefined || measured.length < 3) return { kind: 'change', message: said };` — menos de três medidas: `change` sem patch; três ou mais: o passo 107 calcula o vão.
- R5 `src/core/geometry/align.ts:110` `const delta = next - m.start;` — cada elemento vai para a posição da fila; a mensagem é `status.distribute.done` (`src/core/geometry/align.ts:104`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/geometry/align.ts:91` `export const distributeCommand = registerHandler('position.distribute', (context, { axis }) => {`) e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- Lê: EST-L01-030 (o documento e as regras, via argumentRefusal, selectionRoots, movable, layout.box), EST-L01-031 (a seleção, via selectionRoots, movable, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`, via writeDeclarations, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os insets de cada elemento mudam para igualar os vãos (`src/core/geometry/align.ts:47`); a mensagem é `status.distribute.done`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com o eixo e quantos elementos moveu.
- **DOM do canvas:** o iframe desenha os elementos com os vãos iguais pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/align.ts:47`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:329` `'position.distribute': distributeCommand,` — o painel rápido, o menu Organizar e a barra de comandos chamam o mesmo tratador com a mesma forma `{ axis }`.
- G4: n/a — o trecho não desenha painel nem barra sobre o canvas (`src/core/geometry/align.ts:114`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/core/geometry/align.ts:47`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/geometry/align.ts:91`).

## Medições
- nenhuma — o trecho não chama API de medida; a caixa desenhada de cada elemento chega pelo porto de layout (`src/core/ports/layout.ts:9` `box(node: NodeId): Rect | null;`).
