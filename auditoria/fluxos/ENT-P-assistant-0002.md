# ENT-P-assistant-0002 — assistant.setPreferences pela porta assistant.setPreferences#assistant-preferences

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o botão "Preferências" do cabeçalho da conversa, desenhado por `DoorControl` — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.setPreferences`, que segue daqui.

## Passos
1. `src/editor/assistant/surface.tsx:7` `<header>{door('assistant-model', { value: model, disabled: busy })}{door('assistant-preferences', {})}</header>` — o painel pede o controle "Preferências" com os argumentos `{}`.
2. `src/editor/assistant/panel.tsx:67` `return <DoorControl entry={entry} ready={props.disabled !== true} />;` — o desenhador devolve o `DoorControl` para esta porta.
3. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle roda `door.run`; o `pointerRuns` lido em `src/editor/doors/door.tsx:264` `const pointerRuns = pressedByPointer(entry);` é falso, porque `pressedByPointer` só é verdadeiro para um controle cujo `drawnAs` é `item` (`src/editor/input/pointer/common.ts:299`).
4. `src/editor/doors/door.tsx:92` `const run = () => {` — a função que o clique chama.
5. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — comando não construído ou indisponível não roda.
6. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos da porta juntam os do manifesto (`manifest/commands/assistant.json:117` `"open": true`) aos que o lugar acrescenta (nenhum aqui).
7. `src/editor/doors/door.tsx:98` `const files = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'files' && !arg.optional && !(name in given))?.[0];` — o comando não declara argumento `files`, então o ramo do escolhedor de vários arquivos não é tomado.
8. `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não declara argumento `file`, então ele é `undefined`.
9. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem arquivo, o caminho segue para a linha seguinte.
10. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
11. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
12. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.setPreferences` não é desfazível (`manifest/commands/assistant.json:89` `"undoable": false`).
13. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
14. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
15. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
16. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
17. `src/app/commands.ts:179` `'assistant.setPreferences': setAssistantPreferences,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.setPreferences`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — controle indisponível (o assistente ocupado desabilita o botão) não roda; disponível segue.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, então este lado é o tomado; um comando que lê arquivo iria pelos ramos das linhas 100, 120, 128, 138 e 149.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.setPreferences` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/doors/door.tsx:285` a `src/app/commands.ts:179` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; a escrita de EST-L06-050 entra no trecho `TRC-assistant.setPreferences`

## Resultado
- **Estado final:** EST-L06-050 com `preferences` igual ao argumento `open` (aberto nesta porta), pelo trecho `TRC-assistant.setPreferences` (`src/editor/assistant/state.ts:26`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** o painel `assistant-panel` troca entre as preferências e a conversa, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:89` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:89` `"undoable": false`
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e o `open` do manifesto) e o tratador único decide; as duas portas chegam ao mesmo tratador (`manifest/commands/assistant.json:117` `"open": true` e `manifest/commands/assistant.json:145` `"open": false`).
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:98` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:144`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/doors/door.tsx:144`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:89` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:285` e `src/app/commands.ts:179`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.setPreferences
- **Argumentos enviados:** `{ open: true }` — o manifesto fixa o argumento da porta (`manifest/commands/assistant.json:117` `"open": true`), que abre as preferências; a porta não acrescenta valor.
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.setPreferences.md` `**Ramos que dependem dos argumentos:** nenhum`), então o único lado do caminho é a gravação do booleano.
