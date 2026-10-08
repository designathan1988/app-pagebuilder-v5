# ENT-P-structure-0004 — element.insert pela porta canvas-drag-palette-tile-drop-proposal
## Passos
1. `src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);` — a porta canvas-drag-palette-tile-drop-proposal despacha o comando e os argumentos na liberação — o Início da porta.
2. `src/editor/input/pointer/effects.ts:154` `const closing = shared.open;` — `closing` é o gesto aberto (`shared.open`).
3. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o gesto foi aberto no toque, com `store.gesture()`.
4. `src/editor/store.ts:216` `gesture: () => {` — a store do editor abre o gesto.
5. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes de abrir o gesto. [lê: EST-L05a-001 via keepTyping]
6. `src/editor/store.ts:219` `const gesture = store.gesture();` — o gesto do núcleo vem de `store.gesture()`.
7. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto da store do editor encaminha o despacho ao gesto do núcleo.
8. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
9. `src/core/store/store.ts:720` `return run(id, args, current);` — chama a regra única de execução dentro do gesto.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:365` `'element.insert': insertCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);` — a liberação é de uma criação de peça sobre uma proposta: o pouso leva `parent` e `index`.
- R2 `src/editor/input/pointer/effects.ts:243` `if (effect === 'commit') closing?.commit();` — a liberação confirma o gesto; o Escape cancela (`src/editor/input/pointer/effects.ts:244` `else closing?.cancel();`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via handlerContext), EST-L01-031 (a seleção, via handlerContext), EST-L05a-001 (a digitação pendente, via keepTyping)
- escreve: EST-L01-030 (o documento, via run), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run)
## Resultado
- **Estado final:** EST-L01-030 com o nó no receptor, no índice pedido (`src/core/structure/insert.ts:247` `patches: [{ op: 'add', path: [...at.parent.path, 'children', at.index], value: placed }],`), EST-L01-031 com a seleção no nó novo (`src/core/structure/insert.ts:248` `selection: [node.id],`) e EST-L01-033 com a mensagem `status.placed` (`src/core/structure/insert.ts:249` `message: message('status.placed', { element: node.name, parent: receiver.name, position: at.index + 1, count: receiver.children.length + 1 }),`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do nó novo.
- **DOM do canvas:** o nó entra pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes do gesto.
- G3: ok `src/app/commands.ts:365` `'element.insert': insertCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:365` `'element.insert': insertCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:365` `'element.insert': insertCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);`).
## Ramos do trecho
- **Trecho:** TRC-element.insert
- **Argumentos enviados:** `{ entry: <id da entrada da paleta>, parent: <receptor do pouso>, index: <índice do pouso> }`
- R1: `src/core/structure/insert.ts:146` `if (parent !== undefined) {` — esta porta manda `parent`: o lugar é o nó nomeado no índice dado.
- R2: `src/core/structure/insert.ts:150` `return { parent: at, index: index === undefined ? count : Math.max(0, Math.min(index, count)) };` — esta porta manda `index`: o índice é preso entre 0 e o número de filhos.
