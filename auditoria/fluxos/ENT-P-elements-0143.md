# ENT-P-elements-0143 — element.setLink pela porta element.setLink#quick-panel-href
## Passos
1. `src/editor/shell/field.tsx:1768` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { ...args, [filled]: text });` — o campo de texto do inspetor grava o que ele mostra no argumento que lhe cabe, para o nó que ele desenha.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a `dispatch` que a store do editor (gestureSafe) expõe, por onde todo comando do editor passa.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store pergunta à digitação pendente o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a `dispatch` da store do núcleo roda o comando. [lê: EST-L05a-038 via gestureSafe.dispatch]
5. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a `dispatch` da store do núcleo.
6. `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a store recusa um despacho com um gesto aberto. [lê: EST-L01-007 via dispatch]
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store chama o `run` do despacho.
8. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — o `run` do despacho.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a store lê o tratador do comando na tabela.
10. `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),` — a tabela liga o comando ao tratador (a Chamada do trecho).
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
- **Estado final:** EST-L01-030 com o `href` (ou `newTab`) do nó gravado ou removido por `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`, e EST-L01-037 com o seletor de links fechado pelo ramo R9.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem; o seletor de links fecha.
- **DOM do canvas:** o iframe redesenha o link do elemento pelo mesmo aviso de `src/core/store/store.ts:312`.
## Regras
- G1: n/a — o trecho grava um atributo do nó, não um valor de estilo `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/shell/field.tsx:1768` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { ...args, [filled]: text });` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:244`).
- G4: n/a — as portas são o campo de endereço e o campo de nova aba do inspetor, não um ponto do canvas `manifest/commands/elements.json:3890` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/link.ts:101` `return { kind: 'change', patches: [{ op: stored === undefined ? 'add' : 'replace', path, value: read.value }], message: set };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.
## Medições
- nenhuma
## Ramos do trecho
- **Trecho:** TRC-element.setLink
- **Argumentos enviados:** { target: <id do nó>, href: <texto do campo> }
- R4 `src/core/elements/link.ts:42` `if (typeof newTab === 'boolean') {` — sem newTab: lado falso.
- R5 `src/core/elements/link.ts:54` `if (page !== undefined || anchor !== undefined) {` — sem page nem anchor: lado falso.
- R6 `src/core/elements/link.ts:81` `if (typed === '') {` — href vazio remove o endereço; com texto, segue.
- R7 `src/core/elements/link.ts:88` `if (!read.ok) return { kind: 'refused', message: read.refusal };` — endereço recusado pela regra toma o lado da recusa; aceito, segue.
- R8 `src/core/elements/link.ts:96` `if (locate(state.document, named as NodeId) === null && !ids.has(named)) return { kind: 'refused', message: message('status.link.noSection', { name: named }) };` — fragmento que não nomeia nó nem id recusa; nomeia, segue.
