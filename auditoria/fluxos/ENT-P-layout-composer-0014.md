# ENT-P-layout-composer-0014 — layout.select pela porta layout-region-add

- **Comando:** layout.select
- **Porta:** `manifest/commands/layout-composer.json:426` `"id": "layout-region-add",`
- **Gatilho:** `manifest/commands/layout-composer.json:433` `"gesture": "layout-click",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`
- **Trecho:** TRC-layout.select

## Passos
1. `src/modules/layout-composer/interaction/tool.ts:92` `if (!travelled && (handle === null || handle.kind === 'move')) {` — um clique em lugar (sem alça de redimensionamento) segue pelo ramo do clique.
2. `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);` — o comando do clique roda dentro do gesto, com a região sob o ponto e o `mode` calculado.
3. `src/editor/store.ts:217` `keepTyping();` — o gesto, aberto na pressão (`src/editor/input/pointer/events.ts:69` `const gesture = store.gesture();`), guarda a digitação pendente. [escreve: EST-L05a-001 via keepTyping]
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o despacho do gesto entra no gesto da store do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o despacho do gesto do núcleo.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entrega o comando a `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador do comando na tabela `wiring().commands`.
8. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram nessa tabela por seu comando.
9. `src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>` — a Chamada do trecho TRC-layout.select: `registerHandler` liga o comando ao tratador; é por esta linha que o comando entra no trecho.

## Ramos
- R1 `src/modules/layout-composer/interaction/tool.ts:92` `if (!travelled && (handle === null || handle.kind === 'move')) {` — um clique em lugar (sem alça de redimensionamento) segue para o clique; um arraste seguiria para o traço.
- R2 `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);` — o clique entrega a região sob o ponto e o `mode` calculado; sem região sob o ponto, `regions` é vazio.
- R3 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto o predicado `layoutComposing` falha e o comando é recusado com `layout.inactive` (`src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,`); composto, segue.

## Fronteiras assíncronas
- nenhuma — cada passo roda inteiro no mesmo quadro da liberação do arraste; o ouvinte do ponteiro que o repete existe fora do fluxo (`src/editor/input/pointer/events.ts:459` `session.release(toolPoint(event), gesture);`).

## Estado
- lê: EST-L05a-001 (a digitação pendente, guardada no gesto), EST-L01-030, EST-L01-031, EST-L01-037 (o estado da store, no despacho do núcleo)
- escreve: EST-L05a-001 (a digitação pendente é guardada pelo gesto, via `keepTyping`)

## Resultado
- **Estado final:** o que o trecho TRC-layout.select registra (`src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel do compositor mostra o estado novo.
- **DOM do canvas:** o canvas é redesenhado pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` quando o trecho muda o documento.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado e grava nele.
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é guardada antes de o comando rodar.
- G3: ok `src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>` — um só tratador; esta porta envia só a intenção.
- G4: n/a — o caminho da porta não desenha elemento sobre o canvas `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho desta porta entre `src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);` e `src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>`; nada a remover.

## Medições
- nenhuma — nenhum passo do caminho desta porta chama API de dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-layout.select
- **Argumentos enviados:** `{ regions, mode: 'add' }` — o controle envia a região sob o clique e o `mode` add (`src/modules/layout-composer/interaction/tool.ts:98` `gesture.dispatch(SELECT as never, { regions: picked === null ? [] : [picked], mode } as never);`); o manifesto fixa `mode` na porta (`manifest/commands/layout-composer.json:446` `"mode": "add"`).
- R2 `src/modules/layout-composer/host/handlers.ts:577` `if (!Array.isArray(regions) || !regions.every((r) => typeof r === 'string' && findRegion(record.intent, r) !== undefined)) return refusedWith([{ code: 'unknown-region', params: {} }]);` — o `regions` desta porta é a região sob o clique (ou vazio); região desconhecida recusa `unknown-region`; conhecida, segue.
- R3 `src/modules/layout-composer/gestures/structural.ts:144` `if (mode === 'add') return [...new Set([...current, ...ids])];` — o `mode` desta porta é `add`; `add` acrescenta, `toggle` alterna, os demais substituem.
