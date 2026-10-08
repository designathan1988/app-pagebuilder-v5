# ENT-P-animation-0017 — timeline.setPlayhead pela porta timeline.setPlayhead#panel-drag-playhead-ruler

Fluxo de porta do domínio `animation`. Rastreia o caminho próprio da porta — de `src/editor/input/pointer/panels.ts:78` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-timeline.setPlayhead`, cuja `Chamada` nomeia a chamada desta porta em `src/editor/input/pointer/panels.ts:78`.

## Passos
1. `src/editor/input/pointer/panels.ts:71` `if (ps.playheading === null) return;` — sem um arrasto do playhead em curso, nada roda.
2. `src/editor/input/pointer/panels.ts:73` `const shown = shownAnimation(store.getState());` — a animação mostrada, do estado da store. [lê: EST-L01-030 via getState] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState]
3. `src/editor/input/pointer/panels.ts:74` `if (shown === null) return;` — sem animação mostrada, nada roda.
4. `src/editor/input/pointer/panels.ts:75` `const time = playheadTimeFromTrackX(shown.animation, at.x - press.track.left);` — o tempo sob o ponteiro, a partir da régua do arrasto.
5. `src/editor/input/pointer/panels.ts:76` `shared.open?.cancel();` — o gesto aberto no quadro anterior é cancelado (volta ao tempo que a régua mostrava antes da press).
6. `src/editor/input/pointer/panels.ts:77` `shared.open = store.gesture();` — abre um gesto novo, cujo despacho corre dentro dele. [escreve: EST-L01-007 via store.gesture]
7. `src/editor/store.ts:215` `gesture: () => {` — o `store.gesture` da store do editor é o embrulho `gestureSafe`.
8. `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada antes de o gesto servir. [lê: EST-L05a-001 via keepTyping]
9. `src/editor/store.ts:218` `const gesture = store.gesture();` — a store do núcleo abre o gesto de verdade.
10. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho devolvido encaminha ao gesto do núcleo.
11. `src/core/store/store.ts:712` `open = current;` — o gesto fica aberto na store do núcleo. [escreve: EST-L01-007 via gesture]
12. `src/editor/input/pointer/panels.ts:78` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);` — o arrasto despacha o comando com o tempo sob o ponteiro e a medida do arrasto (a `Chamada` do trecho).
13. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o despacho do gesto do núcleo.
14. `src/core/store/store.ts:720` `return run(id, args, current);` — o comando corre dentro do gesto.
15. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
16. `src/app/commands.ts:200` `'timeline.setPlayhead': setPlayheadCommand,` — a linha que despacha o comando ao tratador (o primeiro passo do trecho `TRC-timeline.setPlayhead`).

## Ramos
- R1 `src/editor/input/pointer/panels.ts:71` `if (ps.playheading === null) return;` — sem arrasto do playhead em curso, nada roda; com um, segue ao passo 2.
- R2 `src/editor/input/pointer/panels.ts:74` `if (shown === null) return;` — sem animação mostrada nada roda; com uma, segue ao passo 4.
- R3 `src/editor/store.ts:217` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — com um grupo de comandos aberto, o despacho do arrasto vai ao `dispatch` do núcleo em vez do gesto (`src/core/store/store.ts:685` `dispatch: (id, args, context) => {`); sem grupo, segue ao passo 9 (o gesto comum).
- R4 `src/editor/input/pointer/panels.ts:76` `shared.open?.cancel();` — com um gesto já aberto, ele é cancelado antes de abrir o novo; sem gesto, nada a cancelar.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/pointer/panels.ts:78` a `src/app/commands.ts:200`; cada quadro do arrasto despacha aqui, sem await, timer nem quadro interposto pelo próprio caminho.

## Estado
- lê: EST-L01-030 (via getState), EST-L01-031 (via getState), EST-L01-037 (via getState), EST-L05a-001 (via keepTyping)
- escreve: EST-L01-007 (o gesto aberto, via store.gesture e o gesture do núcleo) — a gravação do estado do editor entra no trecho `TRC-timeline.setPlayhead`

## Resultado
- **Estado final:** EST-L01-007 com o gesto do arrasto aberto; `ui.timeline.time` fica no tempo preso, pelo trecho `TRC-timeline.setPlayhead`; o documento não muda.
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** o painel Timeline redesenha o marcador do playhead na régua; a barra de status só muda se o trecho trouxer mensagem.
- **DOM do canvas:** o quadro desenha a animação mostrada no tempo do playhead; o documento não muda (`src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` só roda com documento novo).

## Regras
- G1: ok `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada no contexto dela ao abrir o gesto, antes de o arrasto despachar.
- G2: ok `src/editor/store.ts:216` `keepTyping();` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado ao abrir o gesto; o gesto grava antes.
- G3: ok `src/editor/input/pointer/panels.ts:78` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);` — a porta envia só a intenção (o id do comando, o tempo e a medida) e o tratador único decide.
- G4: n/a — a porta é um arrasto de painel, não um ponto do canvas (`manifest/commands/animation.json:839` `"kind": "panel-drag",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/input/pointer/panels.ts:78` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/input/pointer/panels.ts:78` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/input/pointer/panels.ts:78` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, time, distance: at.x - startX } as never);`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; o gesto que ele abre é fechado pelo próprio caminho (`src/editor/input/pointer/panels.ts:76` `shared.open?.cancel();`).

## Medições
- nenhuma — o tempo sob o ponteiro é calculado pelo caminho da porta (`src/editor/input/pointer/panels.ts:75` `const time = playheadTimeFromTrackX(shown.animation, at.x - press.track.left);`), fora do trecho.

## Ramos do trecho
- **Trecho:** TRC-timeline.setPlayhead
- **Argumentos enviados:** `{ time, distance }` — `time` é o tempo sob o ponteiro e `distance` a medida do arrasto (a porta não declara argumentos próprios, `manifest/commands/animation.json:855` `"args": {}`).
- R1 `src/editor/timeline/playhead.ts:138` `if (time === undefined) return { kind: 'change' };` — esta porta sempre manda `time` (o tempo sob o ponteiro), então o caminho passa pelo lado do tempo presente; o lado ausente (um despacho sem arrasto) não é o desta porta.
- R2 `src/editor/timeline/playhead.ts:143` `if (timeline.time === clamped && timeline.live === true) return { kind: 'change' };` — o `time` que esta porta manda igual ao já ao vivo deixa o resultado vazio; outro tempo segue.
