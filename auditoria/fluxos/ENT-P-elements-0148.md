# ENT-P-elements-0148 — linkPicker.setKind pela porta linkPicker.setKind#link-picker-page
## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle do manifesto despacha o comando da porta com os argumentos que o door e o local lhe dão (door.tsx:95 monta `given` de `entry.door.args` e dos argumentos do local).
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a `dispatch` que a store do editor (gestureSafe) expõe, por onde todo comando do editor passa.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store pergunta à digitação pendente o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a `dispatch` da store do núcleo roda o comando. [lê: EST-L05a-038 via gestureSafe.dispatch]
5. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a `dispatch` da store do núcleo.
6. `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a store recusa um despacho com um gesto aberto. [lê: EST-L01-007 via dispatch]
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store chama o `run` do despacho.
8. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — o `run` do despacho.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a store lê o tratador do comando na tabela.
10. `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,` — a tabela liga o comando ao tratador (a Chamada do trecho).
## Ramos
- R1 `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — comando desfazível: a digitação pendente é guardada antes (o valor digitado vai primeiro); não desfazível: só o contexto da edição.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: o comando roda agora; com um gesto aberto e o comando desfazível: a gravação entra na fila da linha 224.
- R3 `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a `dispatch` da store do núcleo recusa um gesto aberto; sem gesto, segue.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — lida a entrada da tabela, o `run` segue para o tratador (a Chamada do trecho).
## Fronteiras assíncronas
- nenhuma — o caminho da porta até a chamada é síncrono; nenhum passo cita um await, timer, quadro ou ouvinte.
## Estado
- lê: EST-L05a-001, EST-L05a-038, EST-L01-007
- escreve: nenhum no caminho da porta; a escrita de EST-L01-037 é feita pelo trecho citado.
## Resultado
- **Estado final:** EST-L01-037 com `ui.linkPicker.kind` no tipo escolhido por `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`, ou inalterado nos ramos R1 e R2.
- **Re-renderizado:** o painel do seletor de links, pelo caminho de `src/editor/store.ts:253` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`.
- **DOM do editor:** o painel do seletor de links passa a mostrar os alvos do tipo escolhido.
- **DOM do canvas:** nada muda — o comando não altera o documento.
## Regras
- G1: n/a — o trecho não grava estilo nem valor de camada `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:397`).
- G4: n/a — a porta é um controle do painel do seletor, não um ponto do canvas `manifest/commands/elements.json:4120` `"kind": "panel-control",`.
- G5: n/a — o trecho escreve só o estado do editor; o painel é desenhado pela view `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`.
- G6: n/a — o trecho não escreve a seleção `src/editor/shell/link-picker.ts:32` `return { kind: 'change', ui: { ...state.ui, linkPicker: { ...state.ui.linkPicker, kind } } };`.
- G7: n/a — o trecho não altera o documento `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.
## Medições
- nenhuma
## Ramos do trecho
- **Trecho:** TRC-linkPicker.setKind
- **Argumentos enviados:** { kind: 'page' }
- R2 `src/editor/shell/link-picker.ts:31` `if (state.ui.linkPicker.kind === kind) return { kind: 'change' };` — a porta envia kind page: o mesmo tipo já escolhido toma o lado sem estado novo; outro, grava o tipo novo.
