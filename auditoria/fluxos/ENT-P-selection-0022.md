# ENT-P-selection-0022 — selection.selectAllInContainer pela porta menu-edit

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.selectAllInContainer`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama a `dispatch` da store do editor com o id do comando e os argumentos que o door e o local montam em `given` (`src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };`); essa `dispatch` é `store.dispatch`, ligada em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a `dispatch` da store do editor (gestureSafe), por onde todo comando do editor passa.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — lê do manifesto se o comando muda o documento; os comandos de seleção não são desfazíveis, então `changesDocument` é falso. [lê: EST-L01-030 via dispatch]
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store entrega ao comando o contexto da edição da digitação pendente. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai ao `dispatch` da store do núcleo. [lê: EST-L05a-038 via dispatch]
6. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o `dispatch` do núcleo chama `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
8. `src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não lê arquivo, então o caminho segue pela linha 144; um comando que lê arquivo seguiria pelo ramo do arquivo.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direito à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele rodaria pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R3 `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não muda o documento, então este ramo não força a gravação da digitação pendente.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono do Início até a Chamada do trecho; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via beforeCommand), EST-L05a-038 (o gesto aberto visto pela store do editor, via dispatch), EST-L01-030 (o documento, via handlerContext), EST-L01-031 (a seleção, via handlerContext)
- escreve: nenhum no caminho da porta; a escrita de EST-L01-031 e EST-L01-033 é feita pelo trecho.

## Resultado
- **Estado final:** EST-L01-031 — a seleção passa a ser os filhos do contêiner tomados, na ordem (`src/core/selection/selection.ts:53` `    selection: taken.map((child) => child.id),`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:641` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas tomadas em Camadas ficam realçadas (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada nó tomado ganha o próprio contorno (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:53` `    selection: taken.map((child) => child.id),`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (o contexto dela é entregue ao comando).
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:53`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:53`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.selectAllInContainer
- **Argumentos enviados:** {}. O manifesto declara `"args": {}` e o controle desenhado para o nó acrescenta `target`.
- o trecho declara, nos ramos que dependem dos argumentos, que não há nenhum: nenhum ramo do caminho muda com os argumentos desta porta (`auditoria/fluxos/trechos/TRC-selection.selectAllInContainer.md:5` `- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (nada selecionado, sem contêiner, filhos ocultos ou bloqueados).`).
