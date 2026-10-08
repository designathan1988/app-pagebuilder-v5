# ENT-P-nodes-0009 — element.toggleLock pela porta element.toggleLock#layers-row-lock

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.toggleLock`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o `run` do botão de trancar da linha despacha o id do comando e a intenção (o Início da porta).
2. `src/editor/shell/sidebar/layers.tsx:332` `<DoorControl key={b.ref} entry={b} args={{ target: node.id }} tabbable={false} />` — o botão da linha é desenhado com `{ target: node.id }`, o nó da linha.
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos do manifesto da porta mais os que o lugar acrescenta (`{ target: node.id }`).
4. `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
5. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não pede arquivo, pasta nem área de transferência, então a chamada é direta.
6. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `element.toggleLock` é undoable (`manifest/commands/nodes.json:280` `"undoable": true`), então `changesDocument` é verdadeiro.
8. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
10. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
14. `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — o botão da linha carrega `{ target: node.id }`, então o predicado `targetOrSelection` segura a disponibilidade; indisponível, o clique não despacha.
- R2 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem argumento de arquivo ou área de transferência, a chamada é direta; com um deles a porta leria o arquivo antes (não é o caso desta porta).
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado `targetOrSelection` é lido com os argumentos da porta (o `target` presente); sem um alvo nem seleção, a recusa viria por aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/shell/sidebar/layers.tsx:332` `<DoorControl key={b.ref} entry={b} args={{ target: node.id }} tabbable={false} />` a `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`; nenhum passo cita await, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.toggleLock`

## Resultado
- **Estado final:** EST-L01-030 — o flag `locked` do nó ganha `true` ou some pelo trecho `TRC-element.toggleLock` (`src/core/nodes/flags.ts:109` `if (at.node[flag] === true) return { kind: 'change', patches: [{ op: 'remove', path }], message: message(off, { name }) };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha de Camadas ganha ou solta a marca do trancado (`src/editor/shell/sidebar/layers.tsx:284` `node.locked === true ? ' row--locked' : ''`).
- **DOM do canvas:** nada muda — o renderizador marca só o nó oculto (`src/editor/canvas/render/render.ts:708` `if (node.hidden === true) wanted.set(HIDDEN_ATTRIBUTE, '');`).

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da digitação é capturado aqui e entregue à store do núcleo em `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta chega à tabela `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,` e envia só a intenção.
- G4: n/a — o botão é desenhado no painel Camadas, que ocupa a própria coluna; nada do editor é desenhado sobre o canvas (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G6: n/a — a porta não escreve a seleção (`src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/sidebar/layers.tsx:332` `<DoorControl key={b.ref} entry={b} args={{ target: node.id }} tabbable={false} />` e `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.toggleLock
- **Argumentos enviados:** `{ target: node.id }` — o botão da linha carrega o nó da linha (`src/editor/shell/sidebar/layers.tsx:332` `<DoorControl key={b.ref} entry={b} args={{ target: node.id }} tabbable={false} />`).
- R1 `src/core/nodes/flags.ts:101` `const id = typeof target === 'string' ? (target as NodeId) : selection[0];` — esta porta manda `target` texto (o id do nó da linha), então o caminho passa pelo lado do nó nomeado, e não pelo do primeiro selecionado.
