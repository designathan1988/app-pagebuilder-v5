# ENT-P-design-system-0020 — components.insertInstance pela porta canvas-drag-component-tile-drop-proposal

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/input/pointer/effects.ts:219` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-components.insertInstance`, que segue daqui.

## Passos
1. `src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);` — a porta canvas-drag despacha o comando e os argumentos na liberação — o Início da porta.
2. `src/editor/input/pointer/effects.ts:154` `const closing = shared.open;` — `closing` é o gesto aberto (`shared.open`).
3. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o gesto foi aberto no toque, com `store.gesture()`.
4. `src/editor/store.ts:216` `gesture: () => {` — a store do editor abre o gesto.
5. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes de abrir o gesto. [lê: EST-L05a-001 via keepTyping]
6. `src/editor/store.ts:219` `const gesture = store.gesture();` — o gesto do núcleo vem de `store.gesture()`.
7. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto da store do editor encaminha o despacho ao gesto do núcleo.
8. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
9. `src/core/store/store.ts:720` `return run(id, args, current);` — chama a regra única de execução dentro do gesto.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,` — a linha da Chamada do trecho: o tratador do comando.

## Ramos
- R1 `src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);` — a liberação é de uma criação de telha sobre uma proposta: o pouso leva `parent` e `index`.
- R2 `src/editor/input/pointer/effects.ts:243` `if (effect === 'commit') closing?.commit();` — a liberação confirma o gesto; o Escape cancela (`src/editor/input/pointer/effects.ts:244` `else closing?.cancel();`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030, EST-L01-031, EST-L01-033

## Resultado
- **Estado final:** a instância nova entra na árvore e vira a seleção (`src/core/design/components.ts:157` `selection: [node.id],`); a mensagem é `status.placed` (`src/core/design/components.ts:158` `message: message('status.placed', { element: node.name, parent: receiver.name, position: at.index + 1, count: receiver.children.length + 1 }),`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra a mensagem do trecho; as Camadas selecionam a instância nova.
- **DOM do canvas:** o canvas redesenha o documento pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto, que o gesto carrega.
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes do gesto.
- G3: ok `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/pointer/effects.ts:219` `else if (dropped !== null && dropDoorOf !== null) closing?.dispatch(dropDoorOf.command.id, { ...dropDoorOf.door.args, ...press.args, parent: dropped.parent, index: dropped.index } as never);`).

## Ramos do trecho
- **Trecho:** TRC-components.insertInstance
- **Argumentos enviados:** `{ component, parent, index }` — esta porta envia `component` com o nome do componente da telha (`press.args`, lido do `data-args` do controle em `src/editor/input/pointer/common.ts:542`) e `parent` e `index` com o pouso proposto (`dropped.parent`, `dropped.index`).
- R2 `src/core/design/components.ts:151` `if (host !== null) return { kind: 'refused', message: message('status.components.inInstance', { name: receiver.name }) };` — o `parent` desta porta é o receptor do pouso; dentro de instância, o caminho para na recusa; fora, segue.
- R3 `src/core/design/components.ts:153` `if (refused !== null) return { kind: 'refused', message: refused };` — o `parent` e o `index` desta porta dão o lugar; aceito pelo modelo, o caminho devolve a mudança; não aceito, para na recusa.
