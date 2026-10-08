# ENT-P-view-0021

- **Porta:** ENT-P-view-0021 — view.zoomAt pela porta canvas-wheel-ctrl
- **Comando:** view.zoomAt
- **Início:** `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });`
- **Trecho:** `TRC-view.zoomAt`

## Passos

1. `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });` — a roda sobre o palco roda o comando da porta com os argumentos calculados do evento.
2. `src/editor/input/pointer/tools.ts:45` `const dispatchPan = (entry: DoorEntry, args: Readonly<Record<string, unknown>>) => {` — o despacho da pan e da roda.
3. `src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o comando é despachado na store do editor com os argumentos da porta.
4. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho da porta.
5. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é reversível no manifesto, então `changesDocument` é falso.
6. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, salvo com o foco dentro do próprio campo. [lê: EST-L05a-001 via beforeCommand] [escreve: EST-L05a-001 via keepTyping]
7. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o estado do editor que a digitação edita, quando há digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
8. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando vai à store do núcleo.
9. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
10. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
11. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
13. `src/app/commands.ts:444` `'view.zoomAt': zoomAt,` — a entrada da tabela é o tratador; o trecho segue daqui.

## Ramos

- R1 `src/editor/input/pointer/tools.ts:49` `if (!onStage(event.target)) return;` — a roda vale sobre o palco; fora dele nada roda.
- R2 `src/editor/input/pointer/tools.ts:50` `const modifier = event.ctrlKey || event.metaKey ? 'Ctrl' : event.shiftKey ? 'Shift' : null;` — o modificador decide a porta; esta porta é a do modificador `Ctrl`.
- R3 `src/editor/input/pointer/tools.ts:51` `const entry = WHEEL_DOORS.find((d) => d.door.kind === 'canvas-wheel' && d.door.modifier === modifier);` — a porta da roda pelo modificador.
- R4 `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });` — o comando do zoom tem `factor`, então o caminho toma este lado.
- R5 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o caminho vai à store do núcleo.
- R6 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela sempre devolve a entrada `src/app/commands.ts:444` `'view.zoomAt': zoomAt,`.

## Fronteiras assíncronas

- `src/editor/input/pointer.ts:203` `target.addEventListener('wheel', p.onWheel, { passive: false, capture: true });` — o ouvinte de roda (entrada ENT-L05a-0039) entrega o evento que roda a porta; entre o evento e o despacho não há await, timer nem quadro `src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`.

## Estado

- lê: EST-L01-031 (a seleção, via editedKey), EST-L01-037 (o estado do editor, via editedKey), EST-L05a-001
- escreve: EST-L05a-001

## Resultado

- **Estado final:** inalterado por esta porta; o comando foi entregue ao tratador `src/app/commands.ts:444` `'view.zoomAt': zoomAt,`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho.
- **DOM do editor:** nada muda por esta porta `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });`.
- **DOM do canvas:** nada muda por esta porta.

## Regras

- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` e o tratador só move o zoom.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok — a porta chega à tabela `src/app/commands.ts:444` `'view.zoomAt': zoomAt,` e envia só a intenção, os argumentos da porta.
- G4: n/a — a porta não desenha elemento algum sobre o canvas `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });`.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });`.
- G6: n/a — o comando não escreve a seleção.
- G7: n/a — o comando não muda o documento.
- INT: n/a — a porta não toca o documento; a integridade é a do trecho `src/app/commands.ts:444` `'view.zoomAt': zoomAt,`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado nesta porta; o despacho não cria nenhum `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);`. O ouvinte que entrega o evento é de outra entrada e não é criado nem removido aqui.

## Medições

- MED-0006 — a largura e a borda esquerda do palco, de que o ponto do pivô e o piso da roda dependem; valor medido no trecho, na Fase 6.

## Ramos do trecho

- **Trecho:** `TRC-view.zoomAt`
- **Argumentos enviados:** `factor` e `point`, calculados do evento: `src/editor/input/pointer/tools.ts:57` `if ('factor' in entry.command.args) p.dispatchPan(entry, { factor: Math.exp(-dy * WHEEL_FACTOR), point: { x: event.clientX, y: event.clientY } });`; a forma dos argumentos é `manifest/commands/view.json:550` `"args": {`.
- R4 — `src/editor/view/camera.ts:121` `if (next === Math.round(now)) return (factor > 1 && next === ZOOM_MAX) || (factor < 1 && next === ZOOM_MIN) ? { kind: 'refused', message: message('status.zoom.limit') } : { kind: 'change' };`: o fator da porta é `Math.exp(-dy * WHEEL_FACTOR)`; longe dos limites ele muda o número inteiro do zoom, e o caminho segue para `src/editor/view/camera.ts:122` `return zoomTo(state, next, point);`. Só quando a roda não muda o número e o zoom já está no limite é que esta porta faz o caminho passar pelo lado da recusa.
