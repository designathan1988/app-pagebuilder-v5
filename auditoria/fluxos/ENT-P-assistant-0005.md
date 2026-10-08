# ENT-P-assistant-0005 — assistant.clearReference pela porta assistant.clearReference#assistant-clear-reference

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o botão "Remover referência" que acompanha a prévia da imagem, desenhado por `DoorControl` — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.clearReference`, que segue daqui.

## Passos
1. `src/editor/assistant/panel.tsx:91` `    {state.reference && <div className="assistant-reference"><img src={`data:${state.reference.type};base64,${state.reference.bytes}`} alt={t('assistant.referenceImage')} /><DoorControl entry={entryOf('assistant-clear-reference')} ready={!state.busy} /></div>}` — o painel desenha o controle por `DoorControl` ao lado da prévia.
2. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle roda `door.run`; o `pointerRuns` lido em `src/editor/doors/door.tsx:264` `const pointerRuns = pressedByPointer(entry);` é falso, porque `pressedByPointer` só é verdadeiro para um controle cujo `drawnAs` é `item` (`src/editor/input/pointer/common.ts:299`).
3. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — comando não construído ou indisponível não roda.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos da porta (o manifesto não fixa nenhum, `manifest/commands/assistant.json:257` `"args": {}`).
5. `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não declara argumento `file`, então ele é `undefined`.
6. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem arquivo, o caminho segue para a linha seguinte.
7. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
8. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
9. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.clearReference` não é desfazível (`manifest/commands/assistant.json:230` `"undoable": false`).
10. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
13. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
14. `src/app/commands.ts:181` `'assistant.clearReference': clearAssistantReference,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.clearReference`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — controle indisponível não roda; disponível segue.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, então este lado é o tomado.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.clearReference` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/doors/door.tsx:285` a `src/app/commands.ts:181` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; a escrita de EST-L06-050 entra no trecho `TRC-assistant.clearReference`

## Resultado
- **Estado final:** EST-L06-050 com `reference` nulo, pelo trecho `TRC-assistant.clearReference` (`src/editor/assistant/state.ts:44`).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` redesenham o painel.
- **DOM do editor:** a prévia da imagem de referência sai do painel, pelo trecho.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:230` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado antes de rodar: `manifest/commands/assistant.json:230` `"undoable": false`
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a única porta do comando (`manifest/commands/assistant.json:234` `"id": "assistant-clear-reference",`) entrega só a intenção e o tratador único decide.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:239` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:144`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/doors/door.tsx:144`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:230` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:285` e `src/app/commands.ts:181`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.clearReference
- **Argumentos enviados:** nenhum — a porta não envia valor (`src/editor/doors/door.tsx:144` entrega só o id do comando).
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.clearReference.md` `**Ramos que dependem dos argumentos:** nenhum`), então o caminho segue direto à gravação de `reference: null`.
