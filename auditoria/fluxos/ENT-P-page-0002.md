# ENT-P-page-0002 — page.openProperties pela porta page.openProperties#command-bar

Fluxo de porta do domínio `page`. Rastreia o caminho próprio da porta — a entrada "Propriedades da página" da barra de comandos, desenhada por `DoorControl` — até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-page.openProperties`, que segue daqui.

## Passos
1. `src/editor/shell/command-bar.tsx:275` `    <DoorControl entry={e.entry} args={e.args} label={e.label} className="command-bar__entry" tabbable={false} icon={icon ?? null}>` — a barra de comandos desenha cada entrada por `DoorControl`, com os argumentos da entrada.
2. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique do controle roda `door.run`; o `pointerRuns` lido em `src/editor/doors/door.tsx:264` `const pointerRuns = pressedByPointer(entry);` é falso, porque `pressedByPointer` só é verdadeiro para um controle cujo `drawnAs` é `item` (`src/editor/input/pointer/common.ts:299`).
3. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — comando não construído ou indisponível não roda.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos da porta juntam os do manifesto (nenhum, `manifest/commands/page.json:65` `"args": {}`) aos que a entrada acrescenta (nenhum aqui).
5. `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando não declara argumento `file`, então ele é `undefined`.
6. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem arquivo, o caminho segue para a linha seguinte.
7. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor. O `dispatch` é ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
8. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
9. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é desfazível (`manifest/commands/page.json:17` `"undoable": false`).
10. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
11. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [lê: EST-L05a-038 via gestureSafe.dispatch]
12. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
13. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store do núcleo chama o `run`.
14. `src/core/store/store.ts:400` `const entry = table[id];` — o `run` busca o tratador do id na tabela.
15. `src/app/commands.ts:341` `'page.openProperties': openPageProperties,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-page.openProperties`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — a entrada de um comando indisponível não roda; a barra mostra o motivo (`src/editor/shell/command-bar.tsx:163`); disponível segue.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não pede arquivo, então este lado é o tomado.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai direto à store do núcleo; com um gesto aberto, iria por `src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id `page.openProperties` tem tratador na tabela.

## Fronteiras assíncronas
- nenhuma — o caminho de `src/editor/shell/command-bar.tsx:275` a `src/app/commands.ts:341` é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

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
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `page.openProperties` muda a seleção e, vindo de fora do campo, grava a digitação pendente antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:341` `'page.openProperties': openPageProperties,` — as duas portas chegam ao mesmo tratador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas: `src/editor/inspector/page-properties.ts:27`.
- G5: n/a — o caminho da porta não desenha painel nem barra: `src/editor/doors/door.tsx:144`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa a ser `[root.id]` e vem da store, sem cópia local.
- G7: n/a — o comando não emite patches: `src/editor/inspector/page-properties.ts:27`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/command-bar.tsx:275` e `src/app/commands.ts:341`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-page.openProperties
- **Argumentos enviados:** `{}` — o manifesto não fixa argumentos (`manifest/commands/page.json:65` `"args": {}`) e a entrada da barra não acrescenta nenhum (`src/editor/doors/door.tsx:144`).
- nenhum — o trecho não lista ramo que dependa dos argumentos (`auditoria/fluxos/trechos/TRC-page.openProperties.md` `**Ramos que dependem dos argumentos:** nenhum`), então os ramos do trecho dependem do documento e do estado do editor, não do que a porta envia.
