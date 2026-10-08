# ENT-P-geometry-0024 — position.setAnchors pela porta position.setAnchors#handle-anchor-left

## Passos
1. `src/editor/canvas/anchor-tabs.tsx:90` `<DoorControl entry={entry} className="anchor-tab" toggle>` — a aba de âncora do lado esquerdo é desenhada como controle da porta, sem argumentos próprios (o manifesto os dá).
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a Início: a porta entrega a intenção à store do editor; o `given` é composto em `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` e a guarda está em `src/editor/doors/door.tsx:94` `if (!built || !available) return;`. [lê: EST-L01-030 via useDoor] [lê: EST-L01-031 via useDoor]
3. `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — a Chamada do trecho TRC-position.setAnchors: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — o comando não está construído ou a predicação `positionedSelection` não vale: nada muda; vale: segue ao passo 2.
- R2 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não toma arquivo: o despacho direto no passo 2; um comando de arquivo seguiria pelos ramos de arquivo da mesma função.

## Fronteiras assíncronas
- nenhuma — o `run` da porta é síncrono para um comando sem arquivo nem área de transferência (`src/editor/doors/door.tsx:144` `if (file === undefined) {` leva direto ao passo 2).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.setAnchors.

## Resultado
- **Estado final:** os insets e o tamanho do eixo mudam para ancorar o lado esquerdo (`src/core/geometry/anchors.ts:132` `writes[axis.start] = next.sides.has('start') ? `${start}px` : null;`); a mensagem é `status.anchors.set` (`src/core/geometry/anchors.ts:145`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra as âncoras dos dois eixos (`src/core/geometry/anchors.ts:145`); a aba do lado fica cheia quando o lado está ancorado (`src/editor/canvas/anchor-tabs.tsx:90` `<DoorControl entry={entry} className="anchor-tab" toggle>`).
- **DOM do canvas:** o iframe desenha o elemento com as âncoras novas pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/anchors.ts:144` `patches: writeDeclarations(found.node, found.path, rules.base, writes),`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — as setas, as abas do canvas e o controle do inspector chamam o mesmo tratador com a mesma forma `{ edge, mode }`.
- G4: n/a — a aba é desenhada pelo chrome do canvas, fora do canvas no ponto da ação (`src/editor/canvas/anchor-tabs.tsx:90`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o passo é constante do manifesto (`manifest/commands/geometry.json:771` `"edge": "left",`).

## Ramos do trecho
- **Trecho:** TRC-position.setAnchors
- **Argumentos enviados:** `{ edge: 'left', mode: 'toggle' }` — o manifesto dá os dois valores (`manifest/commands/geometry.json:771` `"edge": "left",` e `manifest/commands/geometry.json:772` `"mode": "toggle"`).
- R4 (o `edge`): o `edge` `left` está no mapa `EDGES`, então o caminho passa pelo lado válido (`src/core/geometry/anchors.ts:109` `if (target === undefined) throw new Error(`position.setAnchors: no edge ${edge}`);` é falso).
- R5 (o `mode`): o `mode` `toggle` faz o passo 92 alternar (`src/core/geometry/anchors.ts:91` `if (mode === 'set') return { kind: 'edges', sides: new Set<Side>([side]) };` é falso).
- R6 (o `edge` no modo toggle): ao tirar o único lado ancorado, o oposto é ancorado (`src/core/geometry/anchors.ts:96` `return { kind: 'edges', sides: next.size === 0 ? new Set<Side>([side === 'start' ? 'end' : 'start']) : next };`).
- R7 (o `edge` no centro): o `edge` `left` não é um centro, então o caminho fica fora do centro (`src/core/geometry/anchors.ts:122` `if (next.kind === 'center') {` é falso).
