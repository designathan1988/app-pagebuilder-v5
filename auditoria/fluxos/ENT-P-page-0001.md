# ENT-P-page-0001 — page.openProperties pela porta page.openProperties#inspector-page-properties-button

Fluxo de porta do domínio `page`. Rastreia o caminho próprio da porta — o botão do cabeçalho do inspector, desenhado por `DoorControl` — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-page.openProperties`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado despacha a porta. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`, os argumentos são montados em `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` e o clique chega aqui por `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,`.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é desfazível (`manifest/commands/page.json:17` `"undoable": false`), então `changesDocument` é falso.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via gestureSafe.dispatch]
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
9. `src/app/commands.ts:341` `'page.openProperties': openPageProperties,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-page.openProperties`).

## Ramos
- R1 `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — comando não desfazível: a digitação pendente só toma o contexto da edição; um comando que muda o documento a gravaria antes.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto, iria por `src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`.
- R3 `src/core/store/store.ts:400` `const entry = table[id];` — o id `page.openProperties` tem tratador na tabela.
- R4 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não declara argumento de tipo `file`, então este lado é o tomado.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:341` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand), EST-L05a-038 (via gestureSafe.dispatch)
- escreve: nenhum no caminho da porta; as escritas de EST-L01-031, EST-L01-037 entram no trecho `TRC-page.openProperties`

## Resultado
- **Estado final:** EST-L01-031, EST-L01-037 — a seleção passa a ser `[root.id]` e `ui` mostra a aba Settings com o inspector aberto, pelo trecho `TRC-page.openProperties` (`src/editor/inspector/page-properties.ts:27`).
- **Re-renderizado:** todo assinante da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** o inspector desenha a aba escolhida e a barra de status mostra a mensagem, pelo trecho.
- **DOM do canvas:** as alças e o rótulo seguem a seleção nova, pelo trecho.

## Regras
- G1: n/a — o comando cria o contexto com a seleção e `ui`, não escreve camada de estilo, classe nem quadro-chave: `src/editor/inspector/page-properties.ts:27`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `page.openProperties` muda a seleção e, vindo de fora do campo, grava a digitação pendente antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:341` `'page.openProperties': openPageProperties,` — as duas portas chegam ao mesmo tratador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas: `src/editor/inspector/page-properties.ts:27`.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:144`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa a ser `[root.id]` e vem da store, sem cópia local.
- G7: n/a — o comando não emite patches: `src/editor/inspector/page-properties.ts:27`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:341`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-page.openProperties
- **Argumentos enviados:** `{}` — o manifesto não fixa argumentos (`manifest/commands/page.json:9` `"args": {},`); a porta entrega só o id do comando (`src/editor/doors/door.tsx:144`).
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-page.openProperties.md` `**Ramos que dependem dos argumentos:** nenhum`), então os ramos do trecho dependem do documento e do estado do editor, não do que a porta envia.
