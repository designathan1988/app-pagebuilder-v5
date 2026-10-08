# ENT-P-selection-0016 — selection.walkNextSibling pela porta key-arrow-right-in-canvas

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.walkNextSibling`, que segue daqui.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla do acorde roda o comando que a ligação resolve no contexto do seletor.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto de ponteiro e sem ser uma tecla digitada, o despacho é o da store do editor.
3. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a `dispatch` da store do editor (gestureSafe), por onde todo comando do editor passa.
4. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — lê do manifesto se o comando muda o documento; os comandos de seleção não são desfazíveis, então `changesDocument` é falso.
5. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store entrega ao comando o contexto da edição da digitação pendente. [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai ao `dispatch` da store do núcleo. [lê: EST-L05a-038 via dispatch]
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o `dispatch` do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
9. `src/app/commands.ts:358` `'selection.walkNextSibling': walkNextSiblingCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

## Ramos
- R1 `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — com um gesto de ponteiro aberto o despacho seria o do gesto; sem gesto e sem rajada, o despacho é `store.dispatch`.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto o comando roda já pelo `dispatch` do núcleo.
- R3 `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — com digitação pendente no próprio campo, o contexto dela é entregue ao comando.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono do Início até a Chamada do trecho; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via beforeCommand), EST-L05a-038 (o gesto aberto visto pela store do editor, via dispatch), EST-L01-030 e EST-L01-031 (o documento e a seleção, via handlerContext)
- escreve: nenhum no caminho da porta; a escrita de EST-L01-031 e EST-L01-033 é feita pelo trecho.

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031 e EST-L01-033 — o irmão seguinte fica sozinho na seleção e a barra o nomeia (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:483` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha do nó alcançado em Camadas fica realçada (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** o contorno e o rótulo seguem o nó alcançado (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (o contexto dela é entregue ao comando).
- G3: ok `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:358` `'selection.walkNextSibling': walkNextSiblingCommand,`).
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/core/selection/selection.ts:199`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:199`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; os ouvintes de teclado são criados por `installKeymap` (`src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);`) e removidos fora do caminho (`src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.walkNextSibling
- **Argumentos enviados:** {}. O manifesto declara `"args": {}` e a porta não acrescenta nada.
- o trecho declara, nos ramos que dependem dos argumentos, que não há nenhum: nenhum ramo do caminho muda com os argumentos desta porta (`auditoria/fluxos/trechos/TRC-selection.walkNextSibling.md:5` `- **Ramos que dependem dos argumentos:** nenhum — nenhuma porta envia argumento; os ramos dependem do estado (nada selecionado, último filho, raiz).`).
