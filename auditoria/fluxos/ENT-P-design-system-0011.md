# ENT-P-design-system-0011 — classes.rename pela porta styles-class-rename

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-classes.rename`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `classes.rename` é desfazível, então `changesDocument` é `true`.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:230` `'classes.rename': renameClassCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-classes.rename`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não declara argumento do tipo `file`, `files` nem `clipboard`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:230`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-classes.rename`

## Resultado
- **Estado final:** a definição e cada elemento que a lista ficam com o nome novo (`src/core/design/classes.ts:138` `...(index < 0 ? [] : [{ op: 'replace' as const, path: ['classes', index, 'name'], value: nextName }]),`, `src/core/design/classes.ts:139` `...classListers(document, className).map((at): Patch => ({ op: 'replace', path: [...at.path, 'classes'], value: at.node.classes.map(name => name === className ? nextName : name) })),`); a mensagem é `status.classes.renamed`.
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o campo de nome da classe acompanha.
- **DOM do canvas:** o canvas redesenha o documento com a classe renomeada.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção e o tratador único decide.
- G4: n/a — a porta é o campo de nome de uma classe na vista Styles, não um ponto do canvas `manifest/commands/design-system.json:598` `"kind": "panel-control",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:230`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-classes.rename
- **Argumentos enviados:** `{ className, nextName }` — a classe atual e o nome novo; esta porta envia `className` com o nome da linha e `nextName` com o texto do campo (`src/editor/shell/sidebar/styles.tsx:69` `afterGesture(store, () => (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { className: name, nextName }));`).
- R1 `src/core/design/classes.ts:146` `if (index < 0 || className === typed) return { kind: 'change' };` — o `className` desta porta é o nome de uma classe listada e o campo só o despacha quando difere (`src/editor/shell/sidebar/styles.tsx:68` `if (nextName === name) return;`); presente e diferente, o caminho segue.
- R2 `src/core/design/classes.ts:147` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — o `nextName` desta porta é o texto digitado; válido e livre, o caminho segue; inválido, para na recusa.
