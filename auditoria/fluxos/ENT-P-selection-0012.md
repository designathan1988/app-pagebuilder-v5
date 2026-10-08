# ENT-P-selection-0012 — selection.add pela porta canvas-click-element-shift

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.add`, que segue daqui.

## Passos
1. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — a pressão abre o gesto da store do editor. [escreve: EST-L05a-019 via store.gesture]
2. `src/editor/input/pointer/effects.ts:47` `const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);` — o toque resolve a porta do controle sob o ponteiro.
3. `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — o toque roda a porta dentro do gesto.
4. `src/editor/store.ts:217` `keepTyping();` — a abertura do gesto grava a digitação pendente antes do comando (G2). [lê: EST-L05a-001 via keepTyping]
5. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o `dispatch` do gesto do editor entrega a intenção ao gesto do núcleo.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador com o gesto aberto. [lê: EST-L01-007 via run]
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
8. `src/app/commands.ts:355` `'selection.add': addCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

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
- **Estado final:** EST-L01-030, EST-L01-031 e EST-L01-033 — o nó entra na seleção depois dos que já estavam, ou fica onde estava (`src/core/selection/selection.ts:175` `  return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:319` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** cada linha selecionada em Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada elemento selecionado tem o próprio contorno (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:175` `  return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);`).
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:355` `'selection.add': addCommand,`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:175`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:175`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o caminho da porta não cria outro ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.add
- **Argumentos enviados:** { target: id do nó sob o ponteiro }. O manifesto declara `"args": {}`; o adaptador de seleção da porta acrescenta o nó quando a porta o tem.
- R1 `src/core/selection/selection.ts:149` `if (!locate(state.document, target)) throw new Error(`adding to the selection: the document has no node ${target}`);` — esta porta envia `target` = o nó do clique, que o documento tem: o caminho segue sem lançar.
- R2 `src/core/selection/selection.ts:175` `return several(state, state.selection.includes(target) ? state.selection : [...state.selection, target]);` — `target` é o nó clicado; o lado (permanecer ou entrar no fim) é decidido por o nó já estar na seleção, que é estado, e não pelo argumento.
- R3 `src/core/selection/selection.ts:143` `selection.length === 0 ? message('status.selection.cleared') : only !== null ? message('status.selected', { name: only.node.name }) : message('status.selection.count', { count: selection.length });` — um só selecionado a barra o nomeia; vários, ela conta; o valor de `target` é o nó que se testa.
