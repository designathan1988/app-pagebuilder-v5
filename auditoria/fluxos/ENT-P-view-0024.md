# ENT-P-view-0024

- **Porta:** ENT-P-view-0024 — view.pan pela porta canvas-drag-space-held-stage
- **Comando:** view.pan
- **Início:** `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`
- **Trecho:** `TRC-view.pan`

## Passos

1. `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });` — cada movimento do arraste despacha a pan com o deslocamento do ponteiro. [lê: EST-L05a-019 via onMove]
2. `src/editor/input/pointer/events.ts:207` `const panEntry = source !== null ? panDrag(source) : null;` — a porta do arraste, escolhida no início do arraste pela fonte.
3. `src/editor/input/pointer/events.ts:210` `shared.panning = { pointer: event.pointerId, last: { x: event.clientX, y: event.clientY }, moved: { x: 0, y: 0 }, entry: panEntry };` — o pan em curso guarda a porta armada.
4. `src/editor/input/pointer/tools.ts:45` `const dispatchPan = (entry: DoorEntry, args: Readonly<Record<string, unknown>>) => {` — o despacho da pan.
5. `src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o comando é despachado na store do editor com os argumentos da porta.
6. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho da porta.
7. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não é reversível no manifesto, então `changesDocument` é falso.
8. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, salvo com o foco dentro do próprio campo. [lê: EST-L05a-001 via beforeCommand] [escreve: EST-L05a-001 via keepTyping]
9. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o estado do editor que a digitação edita, quando há digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
10. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando vai à store do núcleo.
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
13. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
14. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
15. `src/app/commands.ts:445` `'view.pan': pan,` — a entrada da tabela é o tratador; o trecho segue daqui.

## Ramos

- R1 `src/editor/input/pointer/events.ts:388` `if (dx === 0 && dy === 0) return;` — um movimento sem deslocamento não despacha a pan.
- R2 `src/editor/input/pointer/events.ts:206` `const source = onStage(event.target) && ps.machine.phase === 'idle' ? (event.button === 1 ? 'middle-button' : event.button === 0 && shared.spaceDown ? 'space-held' : null) : null;` — a fonte do arraste arma a porta; esta porta é a da fonte `space-held`.
- R3 `src/editor/input/pointer/common.ts:239` `export const panDrag = (source: string): DoorEntry | null => PAN_DRAGS.find((d) => d.door.kind === 'canvas-drag' && d.door.source === source) ?? null;` — a porta do arraste pela fonte.
- R4 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o caminho vai à store do núcleo; aqui o pan corre pela store do editor.
- R5 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela sempre devolve a entrada `src/app/commands.ts:445` `'view.pan': pan,`.

## Fronteiras assíncronas

- `src/editor/input/pointer.ts:204` `target.addEventListener('pointerdown', p.onDown, true);` — o ouvinte de pointerdown (entrada ENT-L05a-0040) arma o pan e guarda a porta.
- `src/editor/input/pointer.ts:206` `target.addEventListener('pointermove', p.onMove, true);` — o ouvinte de pointermove (entrada ENT-L05a-0042) leva o arraste a cada movimento; o despacho da pan é síncrono `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`.

## Estado

- lê: EST-L01-031 (a seleção, via editedKey), EST-L01-037 (o estado do editor, via editedKey), EST-L05a-001, EST-L05a-019
- escreve: EST-L05a-001

## Resultado

- **Estado final:** inalterado por esta porta; o comando foi entregue ao tratador `src/app/commands.ts:445` `'view.pan': pan,`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho.
- **DOM do editor:** nada muda por esta porta `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`.
- **DOM do canvas:** nada muda por esta porta.

## Regras

- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` e o tratador só grava a câmera.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`.
- G3: ok — a porta chega à tabela `src/app/commands.ts:445` `'view.pan': pan,` e envia só a intenção, os argumentos da porta.
- G4: n/a — a porta não desenha elemento algum sobre o canvas `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`.
- G5: n/a — a porta não desenha nem mede painel, barra ou rótulo `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`.
- G6: n/a — o comando não escreve a seleção.
- G7: n/a — o comando não muda o documento.
- INT: n/a — a porta não toca o documento; a integridade é a do trecho `src/app/commands.ts:445` `'view.pan': pan,`.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado nesta porta; o despacho não cria nenhum `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);`. O ouvinte que entrega o evento é de outra entrada e não é criado nem removido aqui.

## Medições

- MED-0007 — a largura e a borda esquerda do palco, de que o deslocamento horizontal e a rolagem dependem; valor medido no trecho, na Fase 6.

## Ramos do trecho

- **Trecho:** `TRC-view.pan`
- **Argumentos enviados:** `dx` e `dy`, o deslocamento do ponteiro: `src/editor/input/pointer/events.ts:391` `p.dispatchPan(shared.panning.entry, { dx, dy });`; a forma dos argumentos é `manifest/commands/view.json:600` `"args": {`.
- R4 — `src/editor/view/camera.ts:131` `const camera = { ...across.camera, panX: panOf({ ...state, ui: across }, zoom), scroll: dy !== 0 ? { by: -dy / zoom, count: scroll.count + 1 } : scroll };`: com `dy` diferente de zero o caminho pede a rolagem da página e a contagem cresce; com `dy` zero a rolagem fica como estava.
