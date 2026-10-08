# ENT-P-capture-0004 — capture.select pela porta capture.select#captured-inspector-node

Fluxo de porta do domínio `capture`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-capture.select`, que segue daqui. A linha da lista roda a porta `src/editor/shell/captured-inspector.tsx:43` `aria-pressed={selected} title={row.node.id} onClick={door.run} disabled={!door.available}>`.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o controle desenhado pela porta entrega o id e os argumentos ao despacho da store do editor; `given` são os argumentos do manifesto da porta sobre os que o painel acrescenta (o nó da linha).
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `capture.select` não é desfazível (`manifest/commands/capture.json:160` `"undoable": false`), então `changesDocument` é `false`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-037 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:218` `'capture.select': selectCapturedCommand,`).
10. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos declarados são conferidos antes do tratador. [lê: EST-L01-030 via argumentRefusal]
11. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-capture.select`).

## Ramos
- R1 `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — `capture.select` não é desfazível, então `changesDocument` é falso.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto, um comando que não muda o documento vai pelo gesto (`src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento `target` dentro da declaração do manifesto: o caminho segue ao tratador; fora dela: o despacho para na recusa.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/core/store/store.ts:413`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-030 (via argumentRefusal), EST-L01-031 (via getState e editedKey), EST-L01-037 (via getState e editedKey)
- escreve: EST-L01-031, EST-L01-037 (a gravação efetiva entra no trecho `TRC-capture.select`)

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-capture.select` guarda o nó escolhido em `ui.capturedNode` e esvazia a seleção dos elementos.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-capture.select`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e o argumento) e o tratador único decide.
- G4: n/a — a porta é um item do painel de captura, não um ponto do canvas (`manifest/commands/capture.json:165` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/core/store/store.ts:413`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-capture.select
- **Argumentos enviados:** `{ target }` — o painel acrescenta o nó da linha e a porta declara `manifest/commands/capture.json:187` `"args": {}`.
- R1 `src/editor/capture/selection.ts:9` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — o lado falso: `target` é o nó da linha (`row.node.id`), que a captura da página tem, então `found` existe.
- R2 `src/editor/capture/selection.ts:10` `const name = found.node.kind === 'element' ? found.node.tag : found.node.kind;` — depende do nó de `target`: para um elemento a mensagem nomeia a tag; para texto ou comentário nomeia o próprio `kind`.
