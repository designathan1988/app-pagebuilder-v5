# ENT-P-elements-0102 — element.setAttribute pela porta element.setAttribute#forms-address-endpoint
## Passos
1. `src/editor/forms/inspector.tsx:134` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { target: node.id, attribute, value: JSON.stringify(next) });` — o campo do inspetor de formulários grava a configuração inteira pelo tratador de atributo, com o nó alvo, o atributo do nó e o JSON da configuração nova.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a `dispatch` que a store do editor (gestureSafe) expõe, por onde todo comando do editor passa.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store pergunta à digitação pendente o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a `dispatch` da store do núcleo roda o comando. [lê: EST-L05a-038 via dispatch]
5. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a `dispatch` da store do núcleo.
6. `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a store recusa um despacho com um gesto aberto. [lê: EST-L01-007 via dispatch]
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store chama o `run` do despacho.
8. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — o `run` do despacho.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a store lê o tratador do comando na tabela.
10. `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),` — a tabela liga o comando ao tratador (a Chamada do trecho).
## Ramos
- R1 `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — comando desfazível: a digitação pendente é guardada antes (o valor digitado vai primeiro); não desfazível: só o contexto da edição.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: o comando roda agora; com um gesto aberto e o comando desfazível: a gravação entra na fila da linha 224.
- R3 `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a `dispatch` da store do núcleo recusa um gesto aberto; sem gesto, segue.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — lida a entrada da tabela, o `run` segue para o tratador (a Chamada do trecho).
## Fronteiras assíncronas
- nenhuma — o caminho da porta até a chamada é síncrono; nenhum passo cita um await, timer, quadro ou ouvinte.
## Estado
- lê: EST-L05a-001, EST-L05a-038, EST-L01-007
- escreve: nenhum no caminho da porta; a escrita de EST-L01-030 e EST-L01-037 é feita pelo trecho citado.
## Resultado
- **Estado final:** EST-L01-030 com o atributo do nó gravado ou removido por `src/core/elements/attributes.ts:241` `const patch = attributePatch(at, attribute, stored);`, e EST-L01-037 com o seletor de arquivos fechado pelo ramo R9.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; o seletor de arquivos fecha.
- **DOM do canvas:** o iframe redesenha o atributo pelo mesmo aviso de `src/core/store/store.ts:312`.
## Regras
- G1: n/a — o trecho grava um atributo do nó, não um valor de estilo; nenhum passo lê a camada `src/core/elements/attributes.ts:241` `const patch = attributePatch(at, attribute, stored);`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/forms/inspector.tsx:134` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { target: node.id, attribute, value: JSON.stringify(next) });` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:241`).
- G4: n/a — as portas são campos do inspetor e do painel rápido, não um ponto do canvas `manifest/commands/elements.json:140` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:263` `return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:263` `return patches.length === 0 ? { kind: 'change', message: said } : { kind: 'change', patches, message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.
## Medições
- nenhuma
## Ramos do trecho
- **Trecho:** TRC-element.setAttribute
- **Argumentos enviados:** { target: <id do nó selecionado>, attribute: 'formField', value: JSON.stringify(<configuração nova>) }
- R4 `src/core/elements/attributes.ts:216` `if (rule.valueType === 'boolean') {` — o valor desta porta é o texto JSON da configuração gravada no atributo formField, de tipo texto: o caminho toma o lado falso e entra no ramo else da linha 219; o ramo R5 não é alcançado.
- R5 `src/core/elements/attributes.ts:218` `stored = value ? true : undefined;` — não é alcançado: pertence ao lado verdadeiro de R4, que esta porta não toma.
- R6 `src/core/elements/attributes.ts:227` `} else if (rule.valueType === 'keyword') {` — o atributo de tipo texto não é keyword: lado falso.
- R7 `src/core/elements/attributes.ts:230` `} else if (rule.valueType === 'url') {` — o atributo de tipo texto não é url: lado falso; o valor cai no ramo final, linha 236.
