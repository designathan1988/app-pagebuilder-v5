# TRC-layout.enter
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {`
- **Argumentos:** `{ target?: NodeId }` — o manifesto (`manifest/commands/layout-composer.json:10` `"target": {`), opcional.
- **Ramos que dependem dos argumentos:** R1 e R2 (o `target` decide o contêiner; o `id` que ele faz falta decide R1).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/modules/layout-composer/host/handlers.ts:401` `const id = target ?? context.state.selection[0] ?? pageShown(context.state)?.tree.id;` — o alvo é o argumento, senão o selecionado, senão a raiz da página [lê: EST-L01-030 via pageShown] [lê: EST-L01-031 via pageShown].
8. `src/modules/layout-composer/host/handlers.ts:402` `const at = id === undefined ? null : locate(context.state.document, id);` — o nó alvo é localizado [lê: EST-L01-030 via locate].
9. `src/modules/layout-composer/host/handlers.ts:403` `if (at === null || id === undefined || context.rules.elements.get(at.node.type)?.content !== 'children') return { kind: 'refused', message: message('layout.noContainer') };` — só um contêiner compõe (R1).
10. `src/modules/layout-composer/host/handlers.ts:404` `const locked = firstLockRefusal(context.state.document, [id], 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
11. `src/modules/layout-composer/host/handlers.ts:406` `const box = context.layout.box(id);` — a caixa do contêiner vem da porta de layout [lê: EST-L01-037 via layout].
12. `src/modules/layout-composer/host/handlers.ts:409` `const held = recordOf(at.node);` — o registro do compositor é lido [lê: EST-L01-030 via recordOf].
13. `src/modules/layout-composer/host/handlers.ts:413` `const start: LayoutIntent = held === null ? emptyIntent(box.width, Math.max(box.height, room)) : namesFromElements(at.node, held.intent);` — o grafo inicial ou o registro relido.
14. `src/modules/layout-composer/host/handlers.ts:415` `const back = held === null ? { intent: start, container: at.node, changed: false } : readBack(context, at.node, start);` — um contêiner já composto é relido da página.
15. `src/modules/layout-composer/host/handlers.ts:416` `const adopted = adopt(context, back.container, back.intent);` — cada elemento existente vira uma região que o layout coloca.
16. `src/modules/layout-composer/host/handlers.ts:418` `const entered = back.changed ? structured(context, withAuthoring(adopted.container, record), record, adopted.graph, false) : withAuthoring(adopted.container, record);` — o grafo é compilado e materializado quando a página mudou.
17. `src/modules/layout-composer/host/handlers.ts:419` `const replaced = containerWrite(context, at.node, at.path, entered);` — o contêiner é escrito [escreve: EST-L01-030 via containerWrite].
18. `src/modules/layout-composer/host/handlers.ts:429` `return hidePanel(showPanel(withComposer(context.state.ui, { target: id, selection: [], lens: 'spatial', tool: 'auto', shows: PANEL, back, ...(layers ? { layers } : {}) }), PANEL), LAYERS);` — o estado do compositor e os painéis [escreve: EST-L01-037 via withComposer].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/modules/layout-composer/host/handlers.ts:403` `if (at === null || id === undefined || context.rules.elements.get(at.node.type)?.content !== 'children') return { kind: 'refused', message: message('layout.noContainer') };` — elemento ausente ou que não é contêiner: recusa `layout.noContainer`; contêiner: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:405` `if (locked !== null) return { kind: 'refused', message: locked };` — contêiner travado: recusa `status.locked.edit`; livre: segue.
- R3 `src/modules/layout-composer/host/handlers.ts:407` `if (box === null) return { kind: 'refused', message: message('layout.noContainer') };` — sem caixa na tela: recusa; com caixa: segue. `src/modules/layout-composer/host/handlers.ts:408` `if (!(box.width > 0)) return refusedWith([{ code: 'viewport', params: {} }]);` — caixa sem largura: recusa `viewport`.
- R4 `src/modules/layout-composer/host/handlers.ts:413` `const start: LayoutIntent = held === null ? emptyIntent(box.width, Math.max(box.height, room)) : namesFromElements(at.node, held.intent);` — sem registro: grafo vazio na caixa; com registro: o grafo guardado, com os nomes relidos das Camadas.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:399`); a porta para `layout.enter` não lê arquivo nem área de transferência, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner), EST-L01-037 (estado do editor com o compositor aberto).

## Resultado
- **Estado final:** o contêiner ganha o registro do compositor e, quando a página mudou, a estrutura compilada (`src/modules/layout-composer/host/handlers.ts:418`); a mensagem é `layout.status.entered`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** o painel do compositor abre na barra lateral e o painel de Camadas se recolhe (`src/modules/layout-composer/host/handlers.ts:429`).
- **DOM do canvas:** o contêiner é reescrito com os marcadores do compositor; a aparência da página não muda até o primeiro gesto (`src/modules/layout-composer/host/handlers.ts:418`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {` — um só tratador; as portas enviam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches e estado `src/modules/layout-composer/host/handlers.ts:419`.
- G5: n/a — o comando troca a visão da barra lateral, não a geometria de um painel `src/modules/layout-composer/host/handlers.ts:429`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:399`).

## Medições
- nenhuma — a caixa do contêiner vem da porta `Layout` (`src/modules/layout-composer/host/handlers.ts:406`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
