# ENT-P-nodes-0004 — layers.startRename pela porta layers.startRename#menu-arrange

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-layers.startRename`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o `run` do item do menu Arrange despacha o id do comando e a intenção (o Início da porta).
2. `src/editor/doors/menu.tsx:59` `door.run();` — o clique do item (`src/editor/doors/menu.tsx:54` `onClick={() => {`) chama o `run` do `useDoor(entry, {}, undefined, true, keysIn)` `src/editor/doors/menu.tsx:38` `const door = useDoor(entry, {}, undefined, true, keysIn);`, que despacha em `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
3. `src/editor/doors/menu.tsx:160` `slot.kind === 'door' ? <MenuItem key={slot.entry.ref} entry={slot.entry} onDone={onDone} keysIn="canvas" /> : <SubMenu key={slot.menu} menu={slot.menu} onDone={onDone} />,` — o item do menu `arrange` é desenhado pelo `MenuItem` da lista do menu.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos do manifesto da porta mais os que o lugar acrescenta; o item do menu não acrescenta nenhum, então o comando roda com os do manifesto.
5. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
6. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, pasta nem área de transferência, então a chamada é direta.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
8. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `layers.startRename` não é undoable (`manifest/commands/nodes.json:21` `"undoable": false`), então `changesDocument` é falso.
9. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de outro campo é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
10. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
11. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
12. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
13. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
14. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
15. `src/app/commands.ts:334` `'layers.startRename': startRename,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/doors/menu.tsx:55` `if (!door.available) return;` — o menu mostra todos os itens; indisponível (o predicado `singleSelection` não segura), o clique não despacha; disponível, segue.
- R2 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — indisponível, o item não despacha; disponível, segue.
- R3 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo ou área de transferência, a chamada é direta; com um deles a porta leria o arquivo antes (não é o caso desta porta).
- R4 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/menu.tsx:59` `door.run();` a `src/app/commands.ts:334` `'layers.startRename': startRename,`; nenhum passo cita await, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-layers.startRename`

## Resultado
- **Estado final:** EST-L01-037 — `ui.rename.node` passa a nomear o nó pelo trecho `TRC-layers.startRename` (`src/editor/layers/rename.ts:51` `return { kind: 'change', ui: { ...shown, rename: { node: only } } };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o menu Arrange fecha (`src/editor/doors/menu.tsx:58` `onDone();`) e a linha do nó passa a desenhar o campo de nome (`src/editor/shell/sidebar/layers.tsx:307` `{renaming ? (`).
- **DOM do canvas:** nada muda — o rótulo segue com o mesmo nome (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` e o trecho só move `ui.rename`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta chega à tabela `src/app/commands.ts:334` `'layers.startRename': startRename,` e envia só a intenção.
- G4: n/a — o item é desenhado no menu da barra de menus, fora do canvas; nada do editor cobre o ponto da ação no canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — o comando não escreve a seleção (`src/app/commands.ts:334` `'layers.startRename': startRename,`).
- G7: n/a — o comando não muda o documento (`src/app/commands.ts:334` `'layers.startRename': startRename,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/menu.tsx:59` `door.run();` e `src/app/commands.ts:334` `'layers.startRename': startRename,`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-layers.startRename
- **Argumentos enviados:** nenhum — a porta entrega o objeto vazio (`manifest/commands/nodes.json:111` `"args": {}`), o mesmo que o comando declara (`manifest/commands/nodes.json:9` `"args": {},`).
- Nenhum ramo do trecho depende dos argumentos: o trecho declara que os ramos (R1 a R5) dependem do estado — a seleção, o nó que ela nomeia e o bloqueio —, e `layers.startRename` não tem argumento.
