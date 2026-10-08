# ENT-P-elements-0019 — element.setAttribute pela porta element.setAttribute#inspector-checked

Fluxo de porta do domínio `elements`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.setAttribute`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `element.setAttribute` é undoable, então `changesDocument` é `true`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-element.setAttribute`).

## Ramos
- R1 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando desta porta não pede arquivo (o manifesto não declara um argumento `file`, `files` nem `clipboard`), então `file` é `undefined` e o caminho segue para a linha 144; um comando que lê arquivo seguiria pelo ramo do arquivo.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:247` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:241`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.setAttribute`

## Resultado
- **Estado final:** EST-L01-030 com o atributo do nó gravado ou removido pelo trecho `TRC-element.setAttribute`, e EST-L01-037 com o seletor de arquivos fechado quando ele estava aberto.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo, pelo trecho `TRC-element.setAttribute`.
- **DOM do canvas:** o iframe redesenha o elemento pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide.
- G4: n/a — a porta é um controle desenhado no inspetor ou no painel rápido, não um ponto do canvas `manifest/commands/elements.json:556` `"kind": "inspector-field",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção; ela fica como a store a tem `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:241`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.setAttribute
- **Argumentos enviados:** `{ attribute, value, target }` — `attribute` é `'checked'` (a porta fixa o atributo no manifesto), `value` é o booleano do controle (ligado grava `true`, desligado remove o atributo) e `target` é o nó editado (`target` só entra quando o comando o declara).
- R4 `src/core/elements/attributes.ts:216` `if (rule.valueType === 'boolean') {` — o atributo desta porta, `checked`, tem `valueType` `boolean` (`manifest/elements.json:1362` `"valueType": "boolean",`), então o teste é verdadeiro e o caminho entra no ramo booleano.
- R5 `src/core/elements/attributes.ts:218` `stored = value ? true : undefined;` — o valor desta porta é o booleano do controle: ligado grava `true`, desligado remove o atributo.
- R6 `src/core/elements/attributes.ts:227` `} else if (rule.valueType === 'keyword') {` — `checked` não é keyword, então o teste é falso e o caminho segue.
- R7 `src/core/elements/attributes.ts:230` `} else if (rule.valueType === 'url') {` — `checked` não é url, então o teste é falso; o texto digitado é gravado em `src/core/elements/attributes.ts:236` `} else stored = typed;`.
