# ENT-P-layout-composer-0019 — layout.place pela porta handle-layout-region-edge

- **Comando:** layout.place
- **Porta:** `manifest/commands/layout-composer.json:629` `"id": "handle-layout-region-edge",`
- **Gatilho:** `manifest/commands/layout-composer.json:633` `"gesture": "layout-place",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`
- **Trecho:** TRC-layout.place

## Passos
1. `src/editor/input/pointer/events.ts:240` `const step = ps.tooling.session.move(toolPoint(event));` — o movimento do arraste pede o passo à sessão da ferramenta (`src/modules/layout-composer/interaction/place-tool.ts:62` `return { command: PLACE, args: travel(next) };`), que traz o comando `layout.place` e o deslocamento.
2. `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);` — o deslocamento entrega o comando do passo ao gesto (`src/editor/input/pointer/events.ts:244` `const gesture = store.gesture();` abre um novo a cada movimento).
3. `src/editor/store.ts:216` `keepTyping();` — o gesto guarda a digitação pendente antes de o comando rodar. [escreve: EST-L05a-001 via keepTyping]
4. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho do gesto entra no gesto da store do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o despacho do gesto do núcleo.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entrega o comando a `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador do comando na tabela `wiring().commands`.
8. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram nessa tabela por seu comando.
9. `src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>` — a Chamada do trecho TRC-layout.place: `registerHandler` liga o comando ao tratador; é por esta linha que o comando entra no trecho.

## Ramos
- R1 `src/editor/input/pointer/events.ts:240` `const step = ps.tooling.session.move(toolPoint(event));` — o passo só existe depois do limite de clique (o movimento pede o passo à sessão); sem deslocamento, o caminho não despacha.
- R2 `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho entra no gesto da store do editor, com a digitação pendente já guardada (`src/editor/store.ts:216` `keepTyping();`).

## Fronteiras assíncronas
- nenhuma — cada passo roda inteiro no mesmo quadro do movimento do arraste; o ouvinte do ponteiro que o repete existe fora do fluxo (`src/editor/input/pointer/events.ts:240` `const step = ps.tooling.session.move(toolPoint(event));`).

## Estado
- lê: EST-L05a-001 (a digitação pendente, guardada no gesto), EST-L01-030, EST-L01-031, EST-L01-037 (o estado da store, no despacho do núcleo)
- escreve: EST-L05a-001 (a digitação pendente é guardada pelo gesto, via `keepTyping`)

## Resultado
- **Estado final:** o que o trecho TRC-layout.place registra (`src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel do compositor mostra o estado novo.
- **DOM do canvas:** o canvas é redesenhado pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` quando o trecho muda o documento.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado e grava nele.
- G2: ok `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é guardada antes de o comando rodar.
- G3: ok `src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>` — um só tratador; esta porta envia só a intenção.
- G4: n/a — o caminho da porta não desenha elemento sobre o canvas `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho desta porta entre `src/editor/input/pointer/events.ts:247` `gesture.dispatch(step.command as never, step.args as never);` e `src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>`; nada a remover.

## Medições
- nenhuma — nenhum passo do caminho desta porta chama API de dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-layout.place
- **Argumentos enviados:** `{ target, edges, dx, dy }` — a sessão da ferramenta monta o alvo e o deslocamento (`src/modules/layout-composer/interaction/place-tool.ts:57` `const travel = (next: ToolPoint) => ({ target: id, edges, dx: Math.round((next.x - at.x) / zoom), dy: Math.round((next.y - at.y) / zoom) });`); o `edges` desta porta é a borda que a alça move (`src/modules/layout-composer/interaction/place-tool.ts:57` `const travel = (next: ToolPoint) => ({ target: id, edges, dx: Math.round((next.x - at.x) / zoom), dy: Math.round((next.y - at.y) / zoom) });`).
- R2 `src/modules/layout-composer/host/handlers.ts:546` `const target = typeof named === 'string' ? named : context.state.selection.length === 1 ? context.state.selection[0] : undefined;` — esta porta envia `target` (a região arrastada), então a região nomeada é ela; sem ele, seria a selecionada.
- R3 `src/modules/layout-composer/gestures/recognize.ts:385` `if (edges === 'move') return readMove(graph, stroke, region, 'move', naming);` — o `edges` desta porta é a borda que a alça move (a região é redimensionada).
