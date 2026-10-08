# ENT-P-geometry-0047 — position.distribute pela porta position.distribute#quick-panel-distribute-horizontal

## Passos
1. `src/editor/canvas/quick-panel.tsx:244` `if (isAction(entry)) return <DoorControl entry={entry} args={args.target?.type === 'node' ? { target: node.id } : {}} ready={ready} className="quick-panel__action" />;` — o item de distribuição do painel rápido é desenhado como controle da porta; valem os argumentos do manifesto (`manifest/commands/geometry.json:1413` `"axis": "horizontal"`).
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a Início: a porta entrega a intenção à store do editor; o `given` é composto em `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` e a guarda está em `src/editor/doors/door.tsx:94` `if (!built || !available) return;`. [lê: EST-L01-030 via useDoor] [lê: EST-L01-031 via useDoor] [lê: EST-L01-037 via useDoor]
3. `src/app/commands.ts:329` `'position.distribute': distributeCommand,` — a Chamada do trecho TRC-position.distribute: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — o comando não está construído ou a predicação `distributableSelection` não vale (menos de três posicionados): nada muda; vale: segue ao passo 2.
- R2 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não toma arquivo: o despacho direto no passo 2.

## Fronteiras assíncronas
- nenhuma — o `run` da porta é síncrono para um comando sem arquivo nem área de transferência (`src/editor/doors/door.tsx:144` `if (file === undefined) {` leva direto ao passo 2).

## Estado
- Lê: EST-L01-030, EST-L01-031, EST-L01-037 (documento, seleção, regras), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.distribute.

## Resultado
- **Estado final:** os insets de cada elemento mudam para igualar os vãos no eixo horizontal (`src/core/geometry/align.ts:47` `return writeDeclarations(at.node, at.path, context.rules.base, movedInsets(at.node, context.rules, measuredPlace(context as HandlerContext<unknown>, at.node), dx, dy).writes);`); a mensagem é `status.distribute.done`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com o eixo e quantos elementos moveu.
- **DOM do canvas:** o iframe desenha os elementos com os vãos iguais pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/align.ts:47`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:329` `'position.distribute': distributeCommand,` — o painel rápido, o menu Organizar e a barra de comandos chamam o mesmo tratador com a mesma forma `{ axis }`.
- G4: n/a — o fluxo de porta não desenha painel nem barra sobre o canvas no ponto da ação (`src/editor/doors/door.tsx:144`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; a caixa desenhada de cada elemento chega pelo porto de layout (`src/core/ports/layout.ts:9` `box(node: NodeId): Rect | null;`).

## Ramos do trecho
- **Trecho:** TRC-position.distribute
- **Argumentos enviados:** `{ axis: 'horizontal' }` — o eixo horizontal, do manifesto (`manifest/commands/geometry.json:1413` `"axis": "horizontal"`).
- R3 (o `axis`): o `axis` `horizontal` mede o vão em x (`src/core/geometry/align.ts:99` `return box === null ? [] : [{ at, ...span(box, axis) }];`); este ramo (elemento não desenhado) é decidido pela medida, não pelo argumento.
- R4 (o `axis`): o `axis` decide o eixo dos vãos; este ramo (`src/core/geometry/align.ts:105` `if (first === undefined || last === undefined || measured.length < 3) return { kind: 'change', message: said };`) é decidido pelo número de elementos medidos, não pelo argumento.
