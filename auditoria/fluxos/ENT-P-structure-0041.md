# ENT-P-structure-0041 — element.promote pela porta key-p-in-canvas
## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta key-p-in-canvas despacha o comando e os argumentos quando não há área de transferência — o Início da porta.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — a tecla é uma letra digitada no canvas ou nas Camadas, então `dispatch` é o da sequência de teclas (`burstSequence`).
3. `src/editor/input/keymap.ts:519` `if (burstSequence?.active() !== true) {` — a sequência de teclas é aberta se ainda não estiver ativa.
4. `src/editor/input/keymap.ts:520` `burstSequence = store.sequence();` — `burstSequence` é a sequência da store do editor.
5. `src/editor/store.ts:203` `sequence: () => {` — a store do editor abre a sequência.
6. `src/editor/store.ts:204` `keepTyping();` — a digitação pendente é gravada antes de abrir a sequência. [lê: EST-L05a-001 via keepTyping]
7. `src/core/store/store.ts:669` `dispatch: (id, args) => {` — a sequência do núcleo recebe o despacho.
8. `src/core/store/store.ts:671` `return run(id, args, null);` — chama a regra única de execução.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
10. `src/app/commands.ts:378` `'element.promote': promoteCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/input/keymap.ts:490` `const typedKey = letter && binding.door.kind === 'shortcut' && CHOSEN_CONTEXTS.has(binding.door.context) && (focused === CANVAS_CONTEXT || focused === LAYERS_CONTEXT) && gesture === null;` — a tecla é uma letra do canvas ou das Camadas: entra na sequência de teclas; outra tecla: pelo caminho direto.
- R2 `src/editor/input/keymap.ts:493` `if (!lettersChosen) {` — a tecla digitada onde a pessoa não escolheu o canvas ou as Camadas: não roda; escolhido: segue.
- R3 `src/editor/input/keymap.ts:519` `if (burstSequence?.active() !== true) {` — a sequência já está ativa: reusa; senão abre (`src/editor/input/keymap.ts:520` `burstSequence = store.sequence();`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L05a-001 (a digitação pendente, via keepTyping)
- escreve: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L01-033 (a mensagem, via dispatch)
## Resultado
- **Estado final:** EST-L01-030 com o nó no avô, logo depois do pai (`src/core/structure/move.ts:122` `patches.push({ op: 'add', path: [...target.path, 'children', start + i], value: at.node });`), EST-L01-031 com a seleção de volta na raiz (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`) e EST-L01-033 com a mensagem `status.movedInto` (`src/core/structure/move.ts:167` `: message('status.movedInto', { name: first.node.name, receiver: receiver.node.name, position: start + 1, count });`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas sobe a linha movida um nível.
- **DOM do canvas:** o nó muda de lugar pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:204` `keepTyping();` — a digitação pendente é gravada antes da sequência.
- G3: ok `src/app/commands.ts:378` `'element.promote': promoteCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:378` `'element.promote': promoteCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:378` `'element.promote': promoteCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
## Ramos do trecho
- **Trecho:** TRC-element.promote
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-element.promote` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:1210` `"args": {},`); esta porta manda a intenção vazia.
