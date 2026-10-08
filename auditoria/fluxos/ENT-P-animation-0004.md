# ENT-P-animation-0004 — animation.addKeyframe pela porta animation.addKeyframe#timeline-add-keyframe

Fluxo de porta do domínio `animation`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-animation.addKeyframe`, cuja `Chamada` nomeia a chamada desta porta em `src/editor/doors/door.tsx:144`.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado do painel chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — lê da tabela `UNDOABLE` se o comando muda o documento; `animation.addKeyframe` é desfazível (`manifest/commands/animation.json:209` `"undoable": true,`), então `changesDocument` é `true`.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
10. `src/app/commands.ts:195` `'animation.addKeyframe': addKeyframeCommand,` — a linha que despacha o comando ao tratador (o primeiro passo do trecho `TRC-animation.addKeyframe`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não pede arquivo (o manifesto não declara argumento `file`, `files` nem `clipboard`), então o caminho segue para a linha 144; um comando que lê arquivo iria pelo ramo do arquivo.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o despacho vai direto à store do núcleo (o lado desta porta); com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:195`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-031 (a seleção, via getState), EST-L01-037 (o estado do editor, via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-animation.addKeyframe`

## Resultado
- **Estado final:** EST-L01-030 com o quadro-chave vazio no deslocamento pedido, pelo trecho `TRC-animation.addKeyframe`; uma digitação pendente de outro alvo é gravada antes (R3).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo, pelo trecho `TRC-animation.addKeyframe`.
- **DOM do canvas:** o quadro redesenha a folha `@keyframes` pelo mesmo aviso de documento em `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando e os argumentos) e o tratador único decide.
- G4: n/a — a porta é um controle desenhado no painel, não um ponto do canvas (`manifest/commands/animation.json:218` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:195`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-animation.addKeyframe
- **Argumentos enviados:** `{ animation, offset }` — `offset` é o deslocamento pedido e `animation` é a animação mostrada (o manifesto fixa `args: {}` na porta, `manifest/commands/animation.json:240` `"args": {}`, e o painel acrescenta os dois).
- R2 `src/core/animation/animation.ts:272` `if (!Number.isInteger(offset) || offset < low || offset > high) return { kind: 'refused', message: message('status.animation.offsetOutOfRange', { offset: String(offset) }) };` — o deslocamento vai em `offset`; fora do intervalo `timeline.offsetRange`, o caminho para na recusa `status.animation.offsetOutOfRange`; dentro dele segue.
- R3 `src/core/animation/animation.ts:273` `if (held.keyframes.some((k) => k.offset === offset)) return { kind: 'refused', message: message('status.animation.keyframeTaken', { offset: String(offset) }) };` — o deslocamento em `offset`; já tomado por um quadro-chave, o caminho para na recusa `status.animation.keyframeTaken`; livre segue.
