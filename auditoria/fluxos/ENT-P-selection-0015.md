# ENT-P-selection-0015 — selection.toggle pela porta layers-row-ctrl

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.toggle`, que segue daqui.

## Passos
1. `src/editor/shell/sidebar/layers.tsx:255` `const held = modifierOf(event);` — a linha do nó lê o modificador da pressão.
2. `src/editor/shell/sidebar/layers.tsx:261` `const entry = LAYERS_MODIFIED.find((d) => d.door.kind === 'panel-control' && d.door.modifier === held);` — com um modificador (Shift ou Ctrl), procura-se a porta daquele modificador.
3. `src/editor/shell/sidebar/layers.tsx:262` `if (entry) (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, target: node.id });` — a linha despacha o comando da porta com os argumentos do door e o nó da linha.
4. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a `dispatch` da store do editor (gestureSafe), por onde todo comando do editor passa.
5. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — lê do manifesto se o comando muda o documento; os comandos de seleção não são desfazíveis, então `changesDocument` é falso.
6. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store entrega ao comando o contexto da edição da digitação pendente. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai ao `dispatch` da store do núcleo. [lê: EST-L05a-038 via dispatch]
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o `dispatch` do núcleo chama `run`.
9. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
10. `src/app/commands.ts:357` `'selection.toggle': toggleCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

## Ramos
- R1 `src/editor/shell/sidebar/layers.tsx:255` `const held = modifierOf(event);` — com um modificador (Shift ou Ctrl) o caminho não entra no ramo do clique simples.
- R2 `src/editor/shell/sidebar/layers.tsx:261` `const entry = LAYERS_MODIFIED.find((d) => d.door.kind === 'panel-control' && d.door.modifier === held);` — achada a porta do modificador, o caminho segue; um modificador sem porta não despacha nada.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o despacho vai à store do núcleo.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono do Início até a Chamada do trecho; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via beforeCommand), EST-L05a-038 (o gesto aberto visto pela store do editor, via dispatch), EST-L01-030 e EST-L01-031 (o documento e a seleção, via handlerContext)
- escreve: nenhum no caminho da porta; a escrita de EST-L01-031 e EST-L01-033 é feita pelo trecho.

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031 e EST-L01-033 — o nó alterna: sai da seleção se estava, entra se não estava (`src/core/selection/selection.ts:182` `  return several(state, state.selection.includes(target) ? state.selection.filter((id) => id !== target) : [...state.selection, target]);`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:415` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas selecionadas em Camadas ficam realçadas pelo conjunto novo (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** os contornos seguem o conjunto novo (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:182` `  return several(state, state.selection.includes(target) ? state.selection.filter((id) => id !== target) : [...state.selection, target]);`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (o contexto dela é entregue ao comando).
- G3: ok `src/editor/shell/sidebar/layers.tsx:262` `if (entry) (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, target: node.id });` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:357` `'selection.toggle': toggleCommand,`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:182`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:182`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.toggle
- **Argumentos enviados:** { target: id do nó da linha }. O manifesto declara `"args": {}` e o controle desenhado para o nó acrescenta `target`.
- R1 `src/core/selection/selection.ts:149` `if (!locate(state.document, target)) throw new Error(`adding to the selection: the document has no node ${target}`);` — esta porta envia `target` = o nó clicado, que o documento tem: o caminho segue sem lançar.
- R2 `src/core/selection/selection.ts:182` `return several(state, state.selection.includes(target) ? state.selection.filter((id) => id !== target) : [...state.selection, target]);` — `target` é o nó clicado; sair ou entrar depende de ele já estar na seleção, que é estado, e não do argumento.
- R3 `src/core/selection/selection.ts:143` `selection.length === 0 ? message('status.selection.cleared') : only !== null ? message('status.selected', { name: only.node.name }) : message('status.selection.count', { count: selection.length });` — um só a barra o nomeia; vários, ela conta; nenhum, ela diz que nada resta.
