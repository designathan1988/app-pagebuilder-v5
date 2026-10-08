# ENT-P-project-0004 — project.takeOverEditing pela porta project.takeOverEditing#tab-guard-take-over

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.takeOverEditing`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o botão Take over do painel da trava de edição chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `project.takeOverEditing` tem `"undoable": false` (`manifest/commands/project.json:134` `"undoable": false`), então `changesDocument` é `false`.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:345` `'project.takeOverEditing': takeOverEditing,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.takeOverEditing`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não declara argumento `file`, `files` nem `clipboard` (`manifest/commands/project.json:126` `"args": {},`), então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que não muda o documento, ele roda pelo gesto (`src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`).
- R3 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:345`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.takeOverEditing`

## Resultado
- **Estado final:** nada muda — o trecho devolve `change` sem patch, seleção, ui nem mensagem, então `changed` é falso (`src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;`) e a store não escreve.
- **Re-renderizado:** nada — `publish` roda só dentro de `if (changed)` (`src/core/store/store.ts:550` `if (changed) {`); nenhum assinante é chamado.
- **DOM do editor:** nada muda — nenhum estado é escrito e nenhum assinante é notificado.
- **DOM do canvas:** nada muda — o documento não é tocado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único `src/app/commands.ts:345` `'project.takeOverEditing': takeOverEditing,` decide.
- G4: n/a — a porta é o botão do painel da trava de edição, não um ponto do canvas (`manifest/commands/project.json:139` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção; ela fica como a store a tem `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:345`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.takeOverEditing
- **Argumentos enviados:** `{}` — a porta não fixa argumento (`manifest/commands/project.json:161` `"args": {}`) e o comando não declara nenhum (`manifest/commands/project.json:126` `"args": {},`).
- o trecho não lista ramo que dependa dos argumentos ("Ramos que dependem dos argumentos: nenhum"), então esta porta não decide nenhum lado do trecho pelos argumentos.
