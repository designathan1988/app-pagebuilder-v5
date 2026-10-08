# ENT-P-view-0039

- **Porta:** ENT-P-view-0039 — view.setEditorView pela porta toolbar-canvas-toolbar-code
- **Comando:** view.setEditorView
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Trecho:** `TRC-view.setEditorView`

## Passos

1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a ativação do controle despacha o comando com os argumentos da porta.
2. `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o despacho usado é o da store do editor.
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos da porta.
4. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho da porta.
5. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é reversível no manifesto, então `changesDocument` é falso.
6. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, salvo com o foco dentro do próprio campo. [lê: EST-L05a-001 via beforeCommand] [escreve: EST-L05a-001 via keepTyping]
7. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o estado do editor que a digitação edita, quando há digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
8. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando vai à store do núcleo.
9. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
10. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
11. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
13. `src/app/commands.ts:455` `'view.setEditorView': setEditorView,` — a entrada da tabela é o tratador; o trecho segue daqui.

## Ramos

- R1 `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — com a porta construída e o predicado `always` verdadeiro, o controle roda; senão não chama o despacho.
- R2 `src/editor/doors/door.tsx:99` `const files = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'files' && !arg.optional && !(name in given))?.[0];` e `src/editor/doors/door.tsx:110` `const clipboard = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in given))?.[0];` — o comando não tem argumento `files` nem `clipboard`, então `files`, `file` e `clipboard` ficam `undefined` e o caminho chega a `src/editor/doors/door.tsx:144` `if (file === undefined) {` e despacha.
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o caminho vai à store do núcleo; com um gesto aberto e `changesDocument` falso, iria pela do gesto.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela sempre devolve a entrada `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`.

## Fronteiras assíncronas

- nenhuma: a porta roda na ativação do controle, e o caminho até a entrada da tabela é síncrono `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.

## Estado

- lê: EST-L01-031 (a seleção, via editedKey), EST-L01-037 (o estado do editor, via editedKey), EST-L05a-001
- escreve: EST-L05a-001

## Resultado

- **Estado final:** inalterado por esta porta; o comando foi entregue ao tratador `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras

- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` e o tratador só troca a vista do editor.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok — a porta chega à tabela `src/app/commands.ts:455` `'view.setEditorView': setEditorView,` e envia só a intenção, os argumentos da porta.
- G4: n/a — a porta não desenha elemento algum sobre o canvas `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G6: n/a — o comando não escreve a seleção.
- G7: n/a — o comando não muda o documento.
- INT: n/a — a porta não toca o documento; a integridade é a do trecho `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado nesta porta; o despacho não cria nenhum `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);`.

## Medições

- nenhuma: a porta não lê valor calculado pelo navegador; a vista é um campo do estado do editor, e o passo que o grava está no trecho.

## Ramos do trecho

- **Trecho:** `TRC-view.setEditorView`
- **Argumentos enviados:** `view` = "code": `manifest/commands/view.json:1082` `"view": "code"`.
- Nenhum ramo do trecho depende dos argumentos: o trecho declara que nenhum ramo muda com um valor de argumento, e o tratador `src/editor/view/editor-view.ts:18` `({ state }, { view }) => ({ kind: 'change', ui: { ...state.ui, editorView: view === 'canvas' ? undefined : view }, message: message(SAID[view]) }),` não decide pelo valor.
