# ENT-P-geometry-0015 — position.move pela porta position.move#canvas-drag-positioned-element-containing-block

## Passos
1. `src/editor/input/pointer/resize.ts:60` `const moveFree = (at: Point, suspended: boolean) => {` — o arraste livre segue o ponteiro a cada movimento.
2. `src/editor/input/pointer/resize.ts:62` `const travel = { x: (at.x - ps.freeing.start.x) / ps.freeing.zoom, y: (at.y - ps.freeing.start.y) / ps.freeing.zoom };` — o deslocamento desde a pressão, em px de página.
3. `src/editor/input/pointer/resize.ts:69` `const dx = total.x - ps.freeing.applied.x;` — o que já correu é descontado (`src/editor/input/pointer/resize.ts:70` `const dy = total.y - ps.freeing.applied.y;`). [lê: EST-L01-030 via store.getState] [lê: EST-L01-031 via store.getState]
4. `src/editor/input/pointer/resize.ts:71` `if (dx === 0 && dy === 0) return;` — sem deslocamento novo, nada é despachado.
5. `src/editor/input/pointer/resize.ts:73` `shared.open.dispatch(FREE_DRAG.command.id as CommandId, { ...FREE_DRAG.door.args, dx, dy } as never);` — a Início: o arraste entrega a intenção à store do editor, dentro de um gesto.
6. `src/app/commands.ts:326` `'position.move': movePositionedCommand,` — a Chamada do trecho TRC-position.move: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/input/pointer/resize.ts:61` `if (ps.freeing === null || shared.open === null || FREE_DRAG === null) return;` — sem arraste livre aberto: nada; com: segue ao passo 2.
- R2 `src/editor/input/pointer/resize.ts:71` `if (dx === 0 && dy === 0) return;` — deslocamento zero: nada é despachado; diferente de zero: o passo 5 despacha.

## Fronteiras assíncronas
- nenhuma — cada passo do arraste roda inteiro dentro do fluxo; o ouvinte do ponteiro que o repete existe fora dele (`src/editor/input/pointer/resize.ts:73`).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.move.

## Resultado
- **Estado final:** os insets de cada raiz mudam em px inteiros (`src/core/geometry/position.ts:98` `writes[start] = `${next}px`;`); a mensagem é `status.position.moved` (`src/core/geometry/position.ts:120` `return { kind: 'change', patches, message: message('status.position.moved', { name: primary.node.name, parent: primary.parent?.name ?? '', x: shown.x, y: shown.y }) };`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com o elemento e as coordenadas (`src/core/geometry/position.ts:120`).
- **DOM do canvas:** o iframe desenha o elemento na posição nova pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/position.ts:118` `patches.push(...writeDeclarations(at.node, at.path, rules.base, moved.writes));`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o gesto do arraste capta o contexto na primeira passagem.
- G3: ok `src/app/commands.ts:326` `'position.move': movePositionedCommand,` — o arraste livre (`src/editor/input/pointer/resize.ts:73`) e as setas (`src/editor/input/keymap.ts:531`) chamam o mesmo tratador com a mesma forma `{ dx, dy }`.
- G4: n/a — o fluxo de porta não desenha painel nem barra sobre o canvas (`src/editor/input/pointer/resize.ts:73`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/input/pointer/resize.ts:73`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção é a da store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/resize.ts:73`).

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o deslocamento vem do ponteiro e do estado do arraste (`src/editor/input/pointer/resize.ts:62`).

## Ramos do trecho
- **Trecho:** TRC-position.move
- **Argumentos enviados:** `{ dx, dy }` — números inteiros em px de página, o deslocamento desde a pressão menos o que já correu (`src/editor/input/pointer/resize.ts:69` `const dx = total.x - ps.freeing.applied.x;`).
- R3 (a trava do nó): os argumentos não decidem este ramo; a trava decide (`src/core/geometry/position.ts:112` `if (locked !== null) return { kind: 'refused', message: locked };`); o arraste sempre envia um deslocamento não nulo (`src/editor/input/pointer/resize.ts:71` `if (dx === 0 && dy === 0) return;`).
- R4 (o `dx`/`dy` decide o deslocamento): o `dx`/`dy` move cada raiz pelos insets que ela declara (`src/core/geometry/position.ts:92` `if (set(end) && !set(start)) {`): o sinal do `dx`/`dy` não muda o lado do inset, que vem do nó; o passo 98 escreve o inset inicial (`src/core/geometry/position.ts:98` `writes[start] = `${next}px`;`).
