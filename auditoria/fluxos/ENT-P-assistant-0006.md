# ENT-P-assistant-0006 — assistant.editKey pela porta assistant.editKey#assistant-key

Fluxo de porta do domínio `assistant`. Rastreia o caminho próprio da porta — o controle `assistant-key`, declarado `panel-control` desenhado como campo — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-assistant.editKey`, que segue daqui.

O painel não desenha esta porta pelo `DoorControl`: em `src/editor/assistant/panel.tsx:60` `if (name === 'assistant-key') return <label className="assistant-field" data-door={entry.ref}>{t('assistant.key')}<input ref={key} className="input" type="password" autoComplete="off" aria-label={t('assistant.key')} disabled={state.busy} /></label>;` o campo é um `input` de senha sem `onInput` nem `onBlur` que não despacha comando algum (a chave fica para o `stageKey`, `src/editor/assistant/panel.tsx:62` `assistantController(store)?.stageKey(key.current?.value ?? '');`). O caminho abaixo é o que qualquer porta `panel-control` desenhada pelo `DoorControl` toma; é o caminho que o manifesto declara para a porta.

## Passos
1. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique de um controle desenhado por `DoorControl` roda `door.run`; o `pointerRuns` lido em `src/editor/doors/door.tsx:265` `const pointerRuns = pressedByPointer(entry);` é falso, porque `pressedByPointer` só é verdadeiro para um controle cujo `drawnAs` é `item` (`src/editor/input/pointer/common.ts:299`).
2. `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — comando não construído ou indisponível não roda.
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos da porta (o manifesto não fixa nenhum, `manifest/commands/assistant.json:315` `"args": {}`).
4. `src/editor/doors/door.tsx:108` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não declara argumento `file`, então ele é `undefined`.
5. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem arquivo, o caminho segue para a linha seguinte.
6. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor. O `dispatch` é ligado em `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
7. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
8. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `assistant.editKey` não é desfazível (`manifest/commands/assistant.json:288` `"undoable": false`).
9. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via o dispatch da store do editor]
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
12. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
13. `src/app/commands.ts:182` `'assistant.editKey': editAssistantKey,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-assistant.editKey`).

## Ramos
- R1 `src/editor/assistant/panel.tsx:60` `if (name === 'assistant-key') return <label className="assistant-field" data-door={entry.ref}>{t('assistant.key')}<input ref={key} className="input" type="password" autoComplete="off" aria-label={t('assistant.key')} disabled={state.busy} /></label>;` — o painel desenha o campo sem despachar comando, então o caminho pelo `DoorControl` não é tomado pelo painel; o texto da chave é levado ao `stageKey` na gravação (`src/editor/assistant/panel.tsx:62`).
- R2 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não pede arquivo, então este lado é o tomado.
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele iria por `src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `assistant.editKey` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/doors/door.tsx:285` a `src/app/commands.ts:182` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-038 (via o dispatch da store do editor)
- escreve: nenhum no caminho da porta; o trecho `TRC-assistant.editKey` devolve uma mudança sem `ui` e nada grava

## Resultado
- **Estado final:** nada muda no estado — o tratador devolve `{ kind: 'change' }` sem `ui`, pelo trecho `TRC-assistant.editKey` (`src/editor/assistant/state.ts:46`).
- **Re-renderizado:** nada muda; o desfecho `{ kind: 'change' }` sem `ui` nem patches não altera o estado, então nenhum assinante é avisado.
- **DOM do editor:** nada muda.
- **DOM do canvas:** nada muda.

## Regras
- G1: n/a — o comando não grava no documento: `manifest/commands/assistant.json:288` `"undoable": false`
- G2: n/a — o comando não altera o documento nem o estado: `manifest/commands/assistant.json:288` `"undoable": false`
- G3: ok `src/app/commands.ts:182` `'assistant.editKey': editAssistantKey,` — a única porta do comando (`manifest/commands/assistant.json:292` `"id": "assistant-key",`) e o tratador único não decide por conta própria.
- G4: n/a — a porta é desenhada na barra lateral `manifest/commands/assistant.json:297` `"panel": "assistant",`, nada sobre o canvas.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:144`.
- G6: n/a — o caminho da porta não escreve a seleção: `src/editor/doors/door.tsx:144`.
- G7: n/a — o documento não muda: `src/core/store/store.ts:321` `if (next.document !== before.document) {` não avisa os ouvintes de documento.
- INT: n/a — nenhum esquema, id ou referência do documento é tocado: `manifest/commands/assistant.json:288` `"undoable": false`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:285` e `src/app/commands.ts:182`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-assistant.editKey
- **Argumentos enviados:** nenhum — o manifesto não fixa argumentos na porta (`manifest/commands/assistant.json:315` `"args": {}`) e o tratador os ignora (`src/editor/assistant/state.ts:46`).
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-assistant.editKey.md` `**Ramos que dependem dos argumentos:** nenhum`), então o caminho segue direto à mudança sem `ui`.
