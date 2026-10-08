# TRC-parts.move
- **Chamada:** `src/app/commands.ts:254` `'parts.move': movePartCommand,`
- **Argumentos:** o tratador recebe `{ target, delta }` — `target` é o nó da peça (node), `delta` é o passo (integer: -1 sobe, +1 desce).
- **Ramos que dependem dos argumentos:** R1 (o alvo e seu pai), R3 (a mesma posição), R4 (o passo).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/parts.ts:96` `export const movePartCommand = registerHandler('parts.move', ({ state }, { target, delta }): Outcome<never> => {` — o tratador recebe o estado, o alvo e o passo.
3. `src/core/elements/parts.ts:97` `const at = locate(state.document, target);` [lê: EST-L01-030 via locate]
4. `src/core/elements/parts.ts:99` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.move');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/parts.ts:101` `const to = Math.max(0, Math.min(at.parent.children.length - 1, at.index + delta));` — a posição nova, presa às bordas.
6. `src/core/elements/parts.ts:105` `return { kind: 'change', patches: [{ op: 'remove', path: at.path }, { op: 'add', path: [...parentPath, to], value: at.node }], selection: [at.parent.id], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/parts.ts:98` `if (at === null || at.parent === null) return { kind: 'refused', message: argumentRefused('target') };` — alvo ausente ou sem pai: recusa; com pai: segue.
- R2 `src/core/elements/parts.ts:99` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.move');` — travado (linha 100): recusa; livre: segue.
- R3 `src/core/elements/parts.ts:103` `if (to === at.index) return { kind: 'change', message: said };` — a posição nova é a mesma: resultado sem patches; outra: move.
- R4 `src/core/elements/parts.ts:101` `const to = Math.max(0, Math.min(at.parent.children.length - 1, at.index + delta));` — o passo fixa a posição nova entre a primeira e a última; o valor do passo decide a distância.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento: a peça e o pai, via locate, lockRefusal)
- escreve: EST-L01-030 (o documento: a peça na posição nova, via run), EST-L01-031 (a seleção no dono, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com a peça na posição nova, EST-L01-031 com a seleção no dono e EST-L01-033 com a mensagem, por `src/core/elements/parts.ts:105` `return { kind: 'change', patches: [{ op: 'remove', path: at.path }, { op: 'add', path: [...parentPath, to], value: at.node }], selection: [at.parent.id], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; a seleção fica no dono pelo campo `selection` do resultado.
- **DOM do canvas:** o iframe redesenha a peça na ordem nova pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava a ordem dos filhos, não um valor de estilo `src/core/elements/parts.ts:105` `return { kind: 'change', patches: [{ op: 'remove', path: at.path }, { op: 'add', path: [...parentPath, to], value: at.node }], selection: [at.parent.id], message: said };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/parts.ts:96` `export const movePartCommand = registerHandler('parts.move', ({ state }, { target, delta }): Outcome<never> => {`
- G4: n/a — a porta são as setas do inspetor, não um ponto do canvas `manifest/commands/elements.json:5223` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/parts.ts:105` `return { kind: 'change', patches: [{ op: 'remove', path: at.path }, { op: 'add', path: [...parentPath, to], value: at.node }], selection: [at.parent.id], message: said };`.
- G6: ok — a seleção fica no dono pelo campo `selection` do resultado `src/core/elements/parts.ts:105` `return { kind: 'change', patches: [{ op: 'remove', path: at.path }, { op: 'add', path: [...parentPath, to], value: at.node }], selection: [at.parent.id], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
