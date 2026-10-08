# ENT-P-nodes-0015 — element.toggleHidden pela porta element.toggleHidden#menu-element-actions

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.toggleHidden`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o `run` do item do menu Element actions despacha o id do comando e a intenção (o Início da porta).
2. `src/editor/doors/menu.tsx:59` `door.run();` — o clique do item chama o `run` do `useDoor(entry, {}, undefined, true, keysIn)` `src/editor/doors/menu.tsx:38` `const door = useDoor(entry, {}, undefined, true, keysIn);`, que despacha em `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
3. `src/editor/doors/menu.tsx:160` `slot.kind === 'door' ? <MenuItem key={slot.entry.ref} entry={slot.entry} onDone={onDone} keysIn="canvas" /> : <SubMenu key={slot.menu} menu={slot.menu} onDone={onDone} />,` — o item do menu `element-actions` é desenhado pelo `MenuItem` da lista do menu.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos do manifesto da porta mais os que o lugar acrescenta; o item do menu não acrescenta nenhum, então o comando roda com os do manifesto.
5. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
6. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, pasta nem área de transferência, então a chamada é direta.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
8. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `element.toggleHidden` é undoable (`manifest/commands/nodes.json:400` `"undoable": true`), então `changesDocument` é verdadeiro.
9. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
10. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
11. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
12. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
13. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
14. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
15. `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/doors/menu.tsx:55` `if (!door.available) return;` — o menu mostra todos os itens; indisponível (o predicado `targetOrSelection` sem argumento não segura), o clique não despacha; disponível, segue.
- R2 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — indisponível, o item não despacha; disponível, segue.
- R3 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo ou área de transferência, a chamada é direta; com um deles a porta leria o arquivo antes (não é o caso desta porta).
- R4 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/menu.tsx:59` `door.run();` a `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`; nenhum passo cita await, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.toggleHidden`

## Resultado
- **Estado final:** EST-L01-030 — o flag `hidden` do nó ganha `true` ou some pelo trecho `TRC-element.toggleHidden` (`src/core/nodes/flags.ts:109` `if (at.node[flag] === true) return { kind: 'change', patches: [{ op: 'remove', path }], message: message(off, { name }) };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha de Camadas do nó ganha ou solta a marca do oculto (`src/editor/shell/sidebar/layers.tsx:284` `node.hidden === true ? ' row--hidden' : ''`).
- **DOM do canvas:** o elemento do nó ganha ou solta `data-hidden` (`src/editor/canvas/render/render.ts:708` `if (node.hidden === true) wanted.set(HIDDEN_ATTRIBUTE, '');`), que o CSS do editor desenha com `display: none`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da digitação é capturado aqui e entregue à store do núcleo em `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta chega à tabela `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,` e envia só a intenção.
- G4: n/a — o item é desenhado no menu da barra de menus, fora do canvas; nada do editor cobre o ponto da ação no canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — a porta não escreve a seleção (`src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/menu.tsx:59` `door.run();` e `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.toggleHidden
- **Argumentos enviados:** nenhum — a porta entrega o objeto vazio (`manifest/commands/nodes.json:473` `"args": {}`), o mesmo que o comando carrega na entrada de menu.
- R1 `src/core/nodes/flags.ts:101` `const id = typeof target === 'string' ? (target as NodeId) : selection[0];` — esta porta não manda `target`, então o caminho passa pelo lado do primeiro selecionado, e não pelo do nó nomeado.
