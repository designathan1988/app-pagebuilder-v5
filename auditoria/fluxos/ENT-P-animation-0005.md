# ENT-P-animation-0005 — animation.moveKeyframe pela porta animation.moveKeyframe#panel-drag-keyframe-track

Fluxo de porta do domínio `animation`. Rastreia o caminho próprio da porta — de `src/editor/input/pointer/panels.ts:86` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-animation.moveKeyframe`, cuja `Chamada` nomeia a chamada desta porta em `src/editor/input/pointer/panels.ts:86`.

## Passos
1. `src/editor/input/pointer/panels.ts:81` `if (ps.keyframing === null) return;` — sem um arrasto de quadro-chave em curso, nada roda.
2. `src/editor/input/pointer/panels.ts:82` `const { press, startX } = ps.keyframing;` — o `press` que abriu o arrasto e onde o ponteiro desceu.
3. `src/editor/input/pointer/panels.ts:83` `const offset = offsetFromTrackX(at.x - press.track.left);` — o deslocamento sob o ponteiro, a partir da trilha do arrasto.
4. `src/editor/input/pointer/panels.ts:84` `shared.open?.cancel();` — o gesto aberto no quadro anterior é cancelado (volta ao que o quadro-chave guardava antes da press).
5. `src/editor/input/pointer/panels.ts:85` `shared.open = store.gesture();` — abre um gesto novo, cujo despacho corre dentro dele. [escreve: EST-L01-007 via store.gesture]
6. `src/editor/store.ts:215` `gesture: () => {` — o `store.gesture` da store do editor é o embrulho `gestureSafe`.
7. `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada antes de o gesto servir. [lê: EST-L05a-001 via keepTyping]
8. `src/editor/store.ts:218` `const gesture = store.gesture();` — a store do núcleo abre o gesto de verdade.
9. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho devolvido encaminha ao gesto do núcleo.
10. `src/core/store/store.ts:712` `open = current;` — o gesto fica aberto na store do núcleo. [escreve: EST-L01-007 via gesture]
11. `src/editor/input/pointer/panels.ts:86` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);` — o arrasto despacha o comando com o deslocamento sob o ponteiro e a medida do arrasto (a `Chamada` do trecho).
12. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o despacho do gesto do núcleo.
13. `src/core/store/store.ts:720` `return run(id, args, current);` — o comando corre dentro do gesto.
14. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
15. `src/app/commands.ts:196` `'animation.moveKeyframe': moveKeyframeCommand,` — a linha que despacha o comando ao tratador (o primeiro passo do trecho `TRC-animation.moveKeyframe`).

## Ramos
- R1 `src/editor/input/pointer/panels.ts:81` `if (ps.keyframing === null) return;` — sem arrasto de quadro-chave em curso, nada roda; com um, segue ao passo 2.
- R2 `src/editor/store.ts:217` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — com um grupo de comandos aberto, o despacho do arrasto vai ao `dispatch` do núcleo em vez do gesto (`src/core/store/store.ts:685` `dispatch: (id, args, context) => {`); sem grupo, segue ao passo 8 (o gesto comum).
- R3 `src/editor/input/pointer/panels.ts:84` `shared.open?.cancel();` — com um gesto já aberto, ele é cancelado antes de abrir o novo; sem gesto, nada a cancelar.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/pointer/panels.ts:86` a `src/app/commands.ts:196`; cada quadro do arrasto despacha aqui, sem await, timer nem quadro interposto pelo próprio caminho.

## Estado
- lê: EST-L05a-001 (via keepTyping)
- escreve: EST-L01-007 (o gesto aberto, via store.gesture e o gesture do núcleo) — a gravação do documento entra no trecho `TRC-animation.moveKeyframe`

## Resultado
- **Estado final:** EST-L01-007 com o gesto do arrasto aberto; a cada quadro o quadro-chave fica no deslocamento novo, e no fim do gesto o histórico ganha um passo, pelo trecho `TRC-animation.moveKeyframe`.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo, pelo trecho `TRC-animation.moveKeyframe`.
- **DOM do canvas:** o quadro redesenha a folha `@keyframes` pelo mesmo aviso de documento em `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada no contexto dela ao abrir o gesto, antes de o arrasto despachar.
- G2: ok `src/editor/store.ts:216` `keepTyping();` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado ao abrir o gesto; o gesto grava antes.
- G3: ok `src/editor/input/pointer/panels.ts:86` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);` — a porta envia só a intenção (o id do comando, o deslocamento e a medida) e o tratador único decide.
- G4: n/a — a porta é um arrasto de painel, não um ponto do canvas (`manifest/commands/animation.json:291` `"kind": "panel-drag",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/input/pointer/panels.ts:86` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/input/pointer/panels.ts:86` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/input/pointer/panels.ts:86` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, offset, distance: at.x - startX } as never);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit a cada quadro, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; o gesto que ele abre é fechado pelo próprio caminho (`src/editor/input/pointer/panels.ts:84` `shared.open?.cancel();`).

## Medições
- nenhuma — o deslocamento sob o ponteiro é calculado pelo caminho da porta (`src/editor/input/pointer/panels.ts:83` `const offset = offsetFromTrackX(at.x - press.track.left);`), fora do trecho.

## Ramos do trecho
- **Trecho:** TRC-animation.moveKeyframe
- **Argumentos enviados:** `{ animation, keyframe, offset, distance }` — `animation` e `keyframe` vêm do `press` da porta (`press.entry.door.args` e `press.args`), `offset` é o deslocamento sob o ponteiro e `distance` a medida do arrasto (a porta não declara argumentos próprios, `manifest/commands/animation.json:307` `"args": {}`).
- R2 `src/core/animation/animation.ts:286` `if (moving === undefined || offset === undefined || offset === keyframe) return { kind: 'change' };` — esta porta sempre manda `offset` (o deslocamento sob o ponteiro), então o caminho passa pelo lado do deslocamento presente; o lado ausente (um despacho sem arrasto) não é o desta porta.
- R3 `src/core/animation/animation.ts:286` `if (moving === undefined || offset === undefined || offset === keyframe) return { kind: 'change' };` — o `offset` que esta porta manda igual ao atual deixa o resultado vazio; outro deslocamento segue.
- R5 `src/core/animation/animation.ts:288` `if (!Number.isInteger(offset) || offset < low || offset > high) return { kind: 'refused', message: message('status.animation.offsetOutOfRange', { offset: String(offset) }) };` — o `offset` do arrasto fora do intervalo `timeline.offsetRange` para na recusa `status.animation.offsetOutOfRange`; dentro dele segue.
- R6 `src/core/animation/animation.ts:289` `if (held.keyframes.some((k) => k.offset === offset)) return { kind: 'refused', message: message('status.animation.keyframeTaken', { offset: String(offset) }) };` — o `offset` que o arrasto aponta; já tomado por outro quadro, para na recusa `status.animation.keyframeTaken`; livre segue.
