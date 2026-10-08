# ENT-P-layout-composer-0008 — layout.stroke pela porta layout-boundary

- **Comando:** layout.stroke
- **Porta:** `manifest/commands/layout-composer.json:267` `"id": "layout-boundary",`
- **Gatilho:** `manifest/commands/layout-composer.json:271` `"gesture": "layout-handle",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`
- **Trecho:** TRC-layout.stroke

## Passos
1. `src/modules/layout-composer/interaction/tool.ts:101` `if (travelled) points.push(local(next));` — o arraste que percorreu completa os `points` com o ponto da liberação.
2. `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);` — o comando do traço roda dentro do gesto, com os `points`, o `mode` e o `handle` quando há alça.
3. `src/editor/store.ts:217` `keepTyping();` — o gesto, aberto na pressão (`src/editor/input/pointer/events.ts:69` `const gesture = store.gesture();`), guarda a digitação pendente. [escreve: EST-L05a-001 via keepTyping]
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho do gesto entra no gesto da store do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o despacho do gesto do núcleo.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entrega o comando a `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador do comando na tabela `wiring().commands`.
8. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram nessa tabela por seu comando.
9. `src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>` — a Chamada do trecho TRC-layout.stroke: `registerHandler` liga o comando ao tratador; é por esta linha que o comando entra no trecho.

## Ramos
- R1 `src/modules/layout-composer/interaction/tool.ts:101` `if (travelled) points.push(local(next));` — um arraste que percorreu completa os `points` com o ponto da liberação antes do despacho; um clique em lugar não chega ao traço.
- R2 `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho entra no gesto da store do editor, com a digitação pendente já guardada (`src/editor/store.ts:217` `keepTyping();`).
- R3 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto o predicado `layoutComposing` falha e o comando é recusado com `layout.inactive` (`src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,`); composto, segue.

## Fronteiras assíncronas
- nenhuma — cada passo roda inteiro no mesmo quadro da liberação do arraste; o ouvinte do ponteiro que o repete existe fora do fluxo (`src/editor/input/pointer/events.ts:459` `session.release(toolPoint(event), gesture);`).

## Estado
- lê: EST-L05a-001 (a digitação pendente, guardada no gesto), EST-L01-030, EST-L01-037 (o estado da store, no despacho do núcleo)
- escreve: EST-L05a-001 (a digitação pendente é guardada pelo gesto, via `keepTyping`)

## Resultado
- **Estado final:** o que o trecho TRC-layout.stroke registra (`src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel do compositor mostra o estado novo.
- **DOM do canvas:** o canvas é redesenhado pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` quando o trecho muda o documento.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado e grava nele.
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é guardada antes de o comando rodar.
- G3: ok `src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>` — um só tratador; esta porta envia só a intenção.
- G4: n/a — o caminho da porta não desenha elemento sobre o canvas `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho desta porta entre `src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);` e `src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>`; nada a remover.

## Medições
- nenhuma — nenhum passo do caminho desta porta chama API de dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-layout.stroke
- **Argumentos enviados:** `{ points, mode, handle? }` — o controle envia os `points` do arraste e o `mode` (`src/modules/layout-composer/interaction/tool.ts:102` `gesture.dispatch(STROKE as never, { mode: handle === null ? modeOf(next, composer.tool) : 'auto', points: [...points], ...(handleText === null ? {} : { handle: handleText }) } as never);`); o `handle` só vai quando a alça existe.
- R1 `src/modules/layout-composer/host/handlers.ts:471` `if (!breakpoint.base) {` — num ponto de quebra menor os `points` desta porta são lidos onde a página os dispõe (a leitura responsiva); no base, a leitura normal.
- R2 `src/modules/layout-composer/host/handlers.ts:481` `if (reading.selection !== null) {` — o `mode` desta porta é `auto`; quando a leitura devolve uma seleção, só o estado do editor muda; nos demais casos, segue para a escrita.
- R3 `src/modules/layout-composer/host/handlers.ts:487` `if (reading.operation === null || reading.result === null) return refusedWith(reading.problems);` — os `points` e o `mode` desta porta produzem uma operação; sem operação, o caminho para na recusa.
- R4 `src/modules/layout-composer/host/handlers.ts:499` `if (outcome.kind !== 'change' || !dragged || reading.mode === 'repeat') return outcome;` — o `handle` desta porta define `dragged`, então uma alça arrastada que não move nem aninha acrescenta as medidas de tamanho; o outro lado devolve o `outcome` sem as medidas.
- R5 `src/modules/layout-composer/gestures/recognize.ts:508` `if (stroke.handle !== null) return readHandle(graph, stroke, stroke.handle, naming);` — esta porta envia `handle`, então a leitura é a da alça; o outro lado é o da leitura oposta.
