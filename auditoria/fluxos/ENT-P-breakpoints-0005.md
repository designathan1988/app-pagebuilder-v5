# ENT-P-breakpoints-0005 — breakpoints.remove pela porta breakpoints-dialog-remove

Fluxo de porta do domínio `breakpoints`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-breakpoints.remove`, que segue daqui. A escolha do menu do lixo roda a porta `src/editor/shell/breakpoints-dialog.tsx:161` `door.run();`.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a escolha desenhada pela porta entrega o id e os argumentos ao despacho da store do editor; `given` são os argumentos do manifesto da porta sobre os que a escolha acrescenta (o ponto de quebra e o destino dos estilos).
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `breakpoints.remove` é desfazível (`manifest/commands/breakpoints.json:247` `"undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-037 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:454` `'breakpoints.remove': removeBreakpoint,`).
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-breakpoints.remove`).

## Ramos
- R1 `src/editor/shell/breakpoints-dialog.tsx:158` `if (!door.available) return;` — disponível: a escolha roda a porta; indisponível: nada é despachado.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, ele entraria na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o id de `breakpoint` precisa ser da tabela do projeto (`src/core/store/args.ts:44` `return typeof value === 'string' && rules.breakpoints.has(value) ? 'fits' : 'invalid';`) e `styles` precisa ser um dos três valores (`src/core/store/args.ts:42` `return typeof value === 'string' && (arg.values.length === 0 || arg.values.includes(value)) ? 'fits' : 'invalid';`): dentro da declaração o caminho segue; fora dela o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte. A escolha fecha o menu antes de rodar a porta `src/editor/shell/breakpoints-dialog.tsx:160` `onDone();`, o que não abre espera.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030, EST-L01-037 (a gravação efetiva entra no trecho `TRC-breakpoints.remove`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-breakpoints.remove` tira o ponto de quebra do documento e da tabela.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-breakpoints.remove`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id, o ponto de quebra e o destino dos estilos) e o tratador único decide.
- G4: n/a — a porta é um controle do diálogo de breakpoints, não um ponto do canvas (`manifest/commands/breakpoints.json:256` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-breakpoints.remove
- **Argumentos enviados:** `{ breakpoint, styles }` — a escolha do menu despacha o ponto de quebra da linha e o destino escolhido (`src/editor/shell/breakpoints-dialog.tsx:137` `<RemoveChoice key={choice.styles} entry={entry} args={{ breakpoint: breakpoint.id, styles: choice.styles }} label={choice.label} onDone={() => setOpen(false)} />`) e o manifesto declara `manifest/commands/breakpoints.json:278` `"args": {}`. Os três destinos são `narrower`, `wider` e `discard` (`src/editor/shell/breakpoints-dialog.tsx:111` `const choices: readonly { readonly styles: string; readonly label: string }[] = [`).
- R1 `src/editor/view/breakpoint-table.ts:63` `const held = breakpointById(state.document, breakpoint);` — o lado falso: `breakpoint` é o id da linha da tabela, então `held` existe.
- R3 `src/editor/view/breakpoint-table.ts:68` `const into = styles === 'wider' ? table[at - 1] : styles === 'narrower' ? table[at + 1] : undefined;` — depende de `styles`: `wider` leva os estilos ao vizinho mais largo, `narrower` ao mais estreito, `discard` a nenhum.
- R4 `src/editor/view/breakpoint-table.ts:69` `if (styles === 'narrower' && into === undefined) return { kind: 'refused', message: message('status.breakpoints.noNarrower', { name: breakpointWords(held) }) };` — depende de `styles` e do documento: `narrower` sem vizinho mais estreito recusa `noNarrower`; qualquer outra combinação segue para `documentWithout`.
