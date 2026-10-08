# ENT-P-breakpoints-0001 — breakpoints.add pela porta menu-view-add-breakpoint-here

Fluxo de porta do domínio `breakpoints`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-breakpoints.add`, que segue daqui. O item do menu View roda a porta `src/editor/doors/menu.tsx:59` `door.run();`.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o item desenhado pela porta entrega o id e os argumentos ao despacho da store do editor; `given` são os argumentos do manifesto da porta sobre os que o item acrescenta.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `breakpoints.add` é desfazível (`manifest/commands/breakpoints.json:32` `"undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-037 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:451` `'breakpoints.add': addBreakpoint,`).
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-breakpoints.add`).

## Ramos
- R1 `src/editor/doors/menu.tsx:55` `if (!door.available) return;` — disponível: o item roda a porta; indisponível: nada é despachado.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, ele entraria na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — argumentos dentro da declaração do manifesto: o caminho segue ao tratador; fora dela: o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte. O item fecha o menu antes de rodar a porta `src/editor/doors/menu.tsx:58` `onDone();`, o que não abre espera.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-030, EST-L01-037 (a gravação efetiva entra no trecho `TRC-breakpoints.add`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-breakpoints.add` grava a tabela nova e as preferências.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-breakpoints.add`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id e os argumentos) e o tratador único decide.
- G4: n/a — a porta é um item do menu View, não um ponto do canvas (`manifest/commands/breakpoints.json:41` `"kind": "menu",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-breakpoints.add
- **Argumentos enviados:** nenhum campo — o item do menu acrescenta só o que o manifesto declara, `manifest/commands/breakpoints.json:59` `"args": {}`, então `width` e `name` chegam `undefined`.
- R1 `src/editor/view/breakpoint-table.ts:23` `const at = typeof width === 'number' && Number.isFinite(width) ? Math.round(width) : viewportWidth(state);` — o lado falso: `width` é `undefined`, então `at` é a largura que o canvas mostra.
- R2 `src/editor/view/breakpoint-table.ts:24` `const made = addedTable(breakpointsOf(state.document), at, typeof name === 'string' ? name : null, words('breakpoints.defaultName', { width: at }), (key) => words(key));` — o lado falso: `name` é `undefined`, então o ponto de quebra leva o nome do catálogo.
- R4 `src/core/document/breakpoints.ts:85` `if (same !== undefined) return refuse('widthTaken', { width, name: breakpointWords(same) });` — depende do documento: se a largura que o canvas mostra já é de um ponto de quebra, o caminho para na recusa `widthTaken`; livre, segue.
- R5 `src/core/document/breakpoints.ts:88` `if (typed !== '' && taken.has(typed.toLocaleLowerCase())) return refuse('nameTaken', { name: typed });` — o lado falso, porque sem `name` o texto fica vazio e a conferência de nome não roda.
