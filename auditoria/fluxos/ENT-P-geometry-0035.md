# ENT-P-geometry-0035 — position.align pela porta position.align#quick-panel-align-right

## Passos
1. `src/editor/canvas/quick-panel.tsx:244` `if (isAction(entry)) return <DoorControl entry={entry} args={args.target?.type === 'node' ? { target: node.id } : {}} ready={ready} className="quick-panel__action" />;` — o item de alinhamento do painel rápido é desenhado como controle da porta; valem os argumentos do manifesto (`manifest/commands/geometry.json:1091` `"edge": "right"`).
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a Início: a porta entrega a intenção à store do editor; o `given` é composto em `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` e a guarda está em `src/editor/doors/door.tsx:93` `if (!built || !available) return;`. [lê: EST-L01-030 via useDoor] [lê: EST-L01-031 via useDoor]
3. `src/app/commands.ts:328` `'position.align': alignCommand,` — a Chamada do trecho TRC-position.align: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — o comando não está construído ou a predicação `positionedSelection` não vale: nada muda; vale: segue ao passo 2.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo: o despacho direto no passo 2.

## Fronteiras assíncronas
- nenhuma — o `run` da porta é síncrono para um comando sem arquivo nem área de transferência (`src/editor/doors/door.tsx:143` `if (file === undefined) {` leva direto ao passo 2).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.align.

## Resultado
- **Estado final:** os insets de cada elemento mudam para alinhá-lo à borda direita (`src/core/geometry/align.ts:47` `return writeDeclarations(at.node, at.path, context.rules.base, movedInsets(at.node, context.rules, measuredPlace(context as HandlerContext<unknown>, at.node), dx, dy).writes);`); a mensagem é `status.align.done`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com a borda e quantos elementos moveu.
- **DOM do canvas:** o iframe desenha os elementos alinhados pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/align.ts:47`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:328` `'position.align': alignCommand,` — o painel rápido, o menu Organizar e a barra de comandos chamam o mesmo tratador com a mesma forma `{ edge }`.
- G4: n/a — o fluxo de porta não desenha painel nem barra sobre o canvas no ponto da ação (`src/editor/doors/door.tsx:144`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; a caixa e a posição de cada elemento chegam pelo porto de layout (`src/core/ports/layout.ts:9` `box(node: NodeId): Rect | null;`).

## Ramos do trecho
- **Trecho:** TRC-position.align
- **Argumentos enviados:** `{ edge: 'right' }` — o lado direito, do manifesto (`manifest/commands/geometry.json:1091` `"edge": "right"`).
- R4 (o `edge` decide o eixo): o `edge` `right` é do eixo horizontal; este ramo (`src/core/geometry/align.ts:63` `if (place === null) return { kind: 'change', message: said };`) é decidido pela medida do pai, não pelo argumento.
- R5 (o `edge` decide o eixo): vale o mesmo; este ramo (`src/core/geometry/align.ts:71` `if (measured.length === 0) return { kind: 'change', message: said };`) é decidido pelas caixas medidas, não pelo argumento. O `edge` decide o eixo em `src/core/geometry/align.ts:64` `const [before = 0, after = 0] = target.axis === 'horizontal' ? [place.left, place.right] : [place.top, place.bottom];`.
