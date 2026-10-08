# ENT-P-geometry-0028 — position.setAnchors pela porta position.setAnchors#inspector-anchor-control

## Passos
1. `src/editor/shell/inspector-controls.tsx:602` `<DoorControl key={edge} entry={entry} args={{ edge, mode: 'set' }} label={t(`command.anchor.${camel(edge)}` as MessageId)} className="anchor-control__item" ready={ready}>` — o controle de âncoras do inspector passa o lado e o `mode` `set`; o manifesto não dá argumentos a esta porta (`manifest/commands/geometry.json:888` `"args": {}`).
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a Início: a porta entrega a intenção à store do editor; o `given` é composto em `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` (os do lugar sobre os do manifesto) e a guarda está em `src/editor/doors/door.tsx:93` `if (!built || !available) return;`. [lê: EST-L01-030 via useDoor] [lê: EST-L01-031 via useDoor]
3. `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — a Chamada do trecho TRC-position.setAnchors: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — o comando não está construído ou a predicação `positionedSelection` não vale: nada muda; vale: segue ao passo 2.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo: o despacho direto no passo 2.

## Fronteiras assíncronas
- nenhuma — o `run` da porta é síncrono para um comando sem arquivo nem área de transferência (`src/editor/doors/door.tsx:143` `if (file === undefined) {` leva direto ao passo 2).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.setAnchors.

## Resultado
- **Estado final:** os insets, as margens e o tamanho do eixo mudam para fixar o lado (`src/core/geometry/anchors.ts:133` `writes[axis.end] = !next.sides.has('end') ? null : `${both ? roundedDown(exact(axis.end) + exact(axis.start) - start) : Math.round(exact(axis.end))}px`;`); a mensagem é `status.anchors.set` (`src/core/geometry/anchors.ts:145`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra as âncoras dos dois eixos (`src/core/geometry/anchors.ts:145`); o segmento do lado fica pressionado quando o lado está ancorado (`src/editor/shell/inspector-controls.tsx:602`).
- **DOM do canvas:** o iframe desenha o elemento com as âncoras novas pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/anchors.ts:144` `patches: writeDeclarations(found.node, found.path, rules.base, writes),`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — as setas, as abas do canvas e o controle do inspector chamam o mesmo tratador com a mesma forma `{ edge, mode }`.
- G4: n/a — o fluxo de porta não desenha painel nem barra sobre o canvas; o controle vive na coluna do inspector (`src/editor/doors/door.tsx:144`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o lado vem do segmento do controle (`src/editor/shell/inspector-controls.tsx:602`).

## Ramos do trecho
- **Trecho:** TRC-position.setAnchors
- **Argumentos enviados:** `{ edge: <lado>, mode: 'set' }` — o lado é o do segmento pressionado e o `mode` é `set` (`src/editor/shell/inspector-controls.tsx:602` `args={{ edge, mode: 'set' }}`).
- R4 (o `edge`): o lado do segmento (left, right, top ou bottom) está no mapa `EDGES`, então o caminho passa pelo lado válido (`src/core/geometry/anchors.ts:109` `if (target === undefined) throw new Error(`position.setAnchors: no edge ${edge}`);` é falso).
- R5 (o `mode`): o `mode` `set` fixa só aquele lado (`src/core/geometry/anchors.ts:91` `if (mode === 'set') return { kind: 'edges', sides: new Set<Side>([side]) };`).
- R6 (o `edge` no modo toggle): este ramo é do `mode` `toggle`; com `set` não é tomado (`src/core/geometry/anchors.ts:96` `return { kind: 'edges', sides: next.size === 0 ? new Set<Side>([side === 'start' ? 'end' : 'start']) : next };`).
- R7 (o `edge` no centro): o lado do segmento não é um centro, então o caminho fica fora do centro (`src/core/geometry/anchors.ts:122` `if (next.kind === 'center') {` é falso).
