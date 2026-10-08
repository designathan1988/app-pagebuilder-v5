# ENT-P-selection-0010 — selection.clear pela porta menu-edit

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.clear`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama a `dispatch` da store do editor com o id do comando e os argumentos que o door e o local montam em `given` (`src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };`); essa `dispatch` é `store.dispatch`, ligada em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a `dispatch` da store do editor (gestureSafe), por onde todo comando do editor passa.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — lê do manifesto se o comando muda o documento; os comandos de seleção não são desfazíveis, então `changesDocument` é falso.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store entrega ao comando o contexto da edição da digitação pendente. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai ao `dispatch` da store do núcleo. [lê: EST-L05a-038 via dispatch]
6. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o `dispatch` do núcleo chama `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
8. `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não lê arquivo, então o caminho segue pela linha 144; um comando que lê arquivo seguiria pelo ramo do arquivo.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direito à store do núcleo; com um gesto aberto e um comando que não muda o documento, ele rodaria pelo gesto (`src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`).
- R3 `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — o comando não muda o documento, então este ramo não força a gravação da digitação pendente.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono do Início até a Chamada do trecho; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via beforeCommand), EST-L05a-038 (o gesto aberto visto pela store do editor, via dispatch), EST-L01-030 e EST-L01-031 (o documento e a seleção, via handlerContext)
- escreve: nenhum no caminho da porta; a escrita de EST-L01-031 e EST-L01-033 é feita pelo trecho.

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031 e EST-L01-033 — a seleção fica vazia e a mensagem é `status.selection.cleared` (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:210` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** nenhuma linha de Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** o contorno e o rótulo da seleção somem (`src/editor/canvas/chrome.tsx:698` `    if (selection.length === 0 && hovered === null && drawnBand === null) {`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (o contexto dela é entregue ao comando).
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:38`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:38`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.clear
- **Argumentos enviados:** {}. O manifesto declara `"args": {}` e o controle desenhado para o nó acrescenta `target`.
- o trecho declara, nos ramos que dependem dos argumentos, que não há nenhum: nenhum ramo do caminho muda com os argumentos desta porta (`auditoria/fluxos/trechos/TRC-selection.clear.md:5` `- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (`hasSelection`).`).
