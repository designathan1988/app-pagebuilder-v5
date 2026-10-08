# ENT-P-selection-0009 — selection.clear pela porta canvas-click-stage-outside-page

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.clear`, que segue daqui.

## Passos
1. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — a pressão abre o gesto da store do editor. [escreve: EST-L05a-019 via store.gesture]
2. `src/editor/input/pointer/effects.ts:47` `const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);` — o toque resolve a porta do controle sob o ponteiro.
3. `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — o toque roda a porta dentro do gesto.
4. `src/editor/store.ts:217` `keepTyping();` — a abertura do gesto grava a digitação pendente antes do comando (G2). [lê: EST-L05a-001 via keepTyping]
5. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o `dispatch` do gesto do editor entrega a intenção ao gesto do núcleo. Antes e depois do comando, a conferência dos modos lê a store, o estado do ponteiro e a digitação (`src/editor/input/modes.ts:27` `const state = store.getState();`, `src/editor/input/modes.ts:29` `const shared = sharedOf(store);`, `src/editor/input/modes.ts:33` `typing: heldTyping() !== null,`). [lê: EST-L01-037 via getState] [lê: EST-L01-034 via getState] [lê: EST-L05a-019 via sharedOf] [lê: EST-L05a-001 via heldTyping]
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador com o gesto aberto. [lê: EST-L01-007 via run]
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
8. `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

## Ramos
- R1 `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — com uma porta resolvida, sem `deferred` e sem seleção de alvo em curso, o toque roda a porta; qualquer outro caso não chega aqui.
- R2 `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o gesto é aberto nesta linha; a porta roda dentro dele.
- R3 `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador; o gesto que a pressão abriu é o contexto da gravação.

## Fronteiras assíncronas
- a porta roda dentro do ouvinte do dono do ponteiro `src/editor/input/pointer.ts:204` `target.addEventListener('pointerdown', p.onDown, true);`; a porta roda dentro do gesto aberto no próprio toque.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via keepTyping), EST-L01-007 (o gesto aberto do núcleo), EST-L01-030 e EST-L01-031 (o documento e a seleção, via handlerContext)
- escreve: EST-L05a-019 (o gesto aberto que sobrevive ao toque); a escrita de EST-L01-031 e EST-L01-033 é feita pelo trecho.

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031 e EST-L01-033 — a seleção fica vazia e a mensagem é `status.selection.cleared` (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:210` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nenhuma linha de Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** o contorno e o rótulo da seleção somem (`src/editor/canvas/chrome.tsx:698` `    if (selection.length === 0 && hovered === null && drawnBand === null) {`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`).
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:38`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:38`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o caminho da porta não cria outro ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.clear
- **Argumentos enviados:** {}. O manifesto declara `"args": {}`; o adaptador de seleção da porta acrescenta o nó quando a porta o tem.
- o trecho declara, nos ramos que dependem dos argumentos, que não há nenhum: nenhum ramo do caminho muda com os argumentos desta porta (`auditoria/fluxos/trechos/TRC-selection.clear.md:5` `- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (`hasSelection`).`).
