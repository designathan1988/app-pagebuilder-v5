# ENT-P-elements-0158 — element.setCustomAttribute pela porta element.setCustomAttribute#inspector-custom-attribute-add
## Passos
1. `src/editor/shell/inspector-settings.tsx:147` `if (dispatch(addEntry.command.id, { name: field.value, ...ADDED }).status === 'done') field.value = '';` — o campo de nome dos atributos próprios chama a adição com o nome digitado e o valor vazio.
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a `dispatch` que a store do editor (gestureSafe) expõe, por onde todo comando do editor passa.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store pergunta à digitação pendente o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a `dispatch` da store do núcleo roda o comando. [lê: EST-L05a-038 via gestureSafe.dispatch]
5. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a `dispatch` da store do núcleo.
6. `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a store recusa um despacho com um gesto aberto. [lê: EST-L01-007 via dispatch]
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store chama o `run` do despacho.
8. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — o `run` do despacho.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a store lê o tratador do comando na tabela.
10. `src/app/commands.ts:247` `'element.setCustomAttribute': setCustomAttributeCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).
## Ramos
- R1 `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — comando desfazível: a digitação pendente é guardada antes (o valor digitado vai primeiro); não desfazível: só o contexto da edição.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: o comando roda agora; com um gesto aberto e o comando desfazível: a gravação entra na fila da linha 224.
- R3 `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a `dispatch` da store do núcleo recusa um gesto aberto; sem gesto, segue.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — lida a entrada da tabela, o `run` segue para o tratador (a Chamada do trecho).
## Fronteiras assíncronas
- nenhuma — o caminho da porta até a chamada é síncrono; nenhum passo cita um await, timer, quadro ou ouvinte.
## Estado
- lê: EST-L05a-001, EST-L05a-038, EST-L01-007
- escreve: nenhum no caminho da porta; a escrita de EST-L01-030 é feita pelo trecho citado.
## Resultado
- **Estado final:** EST-L01-030 com `customAttributes` do nó com o atributo por `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo R8 (`src/core/elements/attributes.ts:291`).
- **DOM do canvas:** o iframe redesenha o atributo personalizado pelo mesmo aviso de `src/core/store/store.ts:312`.
## Regras
- G1: n/a — o trecho grava atributos do nó, não um valor de estilo `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/shell/inspector-settings.tsx:147` `if (dispatch(addEntry.command.id, { name: field.value, ...ADDED }).status === 'done') field.value = '';` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:247`).
- G4: n/a — a porta é um controle do inspetor, não um ponto do canvas `manifest/commands/elements.json:4506` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:294` `return { kind: 'change', patches: [{ op: at.node.customAttributes === undefined ? 'add' : 'replace', path: [...at.path, 'customAttributes'], value: next }], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.
## Medições
- nenhuma
## Ramos do trecho
- **Trecho:** TRC-element.setCustomAttribute
- **Argumentos enviados:** { name: <nome digitado>, value: '' }
- R2 `src/core/elements/attributes.ts:280` `if (typed.startsWith('on')) return { kind: 'refused', message: message('status.attribute.eventHandler') };` — o nome que a porta envia: nome de evento recusa; outro, segue.
- R3 `src/core/elements/attributes.ts:282` `if (owner !== null) return { kind: 'refused', message: message('status.attribute.reserved', { name: typed, owner: words(owner as never) }) };` — nome reservado ao editor recusa; livre, segue.
- R4 `src/core/elements/attributes.ts:283` `if (customAttributeRefusal(typed, rules) !== null) return { kind: 'refused', message: message('status.attribute.invalidName', { name: typed }) };` — nome que não é nome de atributo recusa; válido, segue.
- R5 `src/core/elements/attributes.ts:286` `if (address !== null && !address.ok) return { kind: 'refused', message: address.refusal };` — endereço recusado pela regra recusa; aceito, segue.
- R7 `src/core/elements/attributes.ts:292` `if (custom[typed] === String(value)) return { kind: 'change', message: said };` — o mesmo valor toma o lado sem patches; outro, grava.
