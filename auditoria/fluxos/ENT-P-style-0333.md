# ENT-P-style-0333

Porta `key-o-in-layers-tree` do comando `element.organize` (tipo comando-porta shortcut). O trecho do comando é `TRC-element.organize`.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla do door `key-o-in-layers-tree` despacha `element.organize`; o comando não toma a área de transferência.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — a tecla é uma letra escolhida no canvas ou nas camadas (`src/editor/input/keymap.ts:490` `const typedKey = letter && binding.door.kind === 'shortcut' && CHOSEN_CONTEXTS.has(binding.door.context) && (focused === CANVAS_CONTEXT || focused === LAYERS_CONTEXT) && gesture === null;`): o `dispatch` resolvido é o da rajada de teclas.
3. `src/editor/input/keymap.ts:520` `burstSequence = store.sequence();` — a rajada de teclas é aberta na store do editor.
4. `src/editor/store.ts:193` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir a rajada [lê: EST-L05a-001 via keepTyping].
5. `src/core/store/store.ts:669` `dispatch: (id, args) => {` — a sequência de comandos da store do núcleo recebe o despacho.
6. `src/core/store/store.ts:671` `return run(id, args, null);` — a sequência entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:393` `'element.organize': organizeCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/input/keymap.ts:490` `const typedKey = letter && binding.door.kind === 'shortcut' && CHOSEN_CONTEXTS.has(binding.door.context) && (focused === CANVAS_CONTEXT || focused === LAYERS_CONTEXT) && gesture === null;` — a tecla é uma letra de um door do canvas ou das camadas: `typedKey` é verdadeiro, e o disparo é o `dispatch` da rajada de teclas (o lado do `store.dispatch` não é tomado).
- `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o comando não toma a área de transferência: a tecla despacha de imediato.
- `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha; com gesto, o despacho que muda o documento espera o fim dele.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- ouvinte `keydown` — `src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);` — a tecla desta porta chega por este ouvinte; no intervalo podem rodar as demais entradas de teclado (`auditoria/entradas.md`), com a store no estado atual.
- timer da rajada — `src/editor/input/keymap.ts:395` `burstTimer = target.setTimeout(endBurst, TYPING_BURST);` — armado quando a tecla é uma letra (`src/editor/input/keymap.ts:392` `if (letter) {`); no intervalo pode rodar outra tecla do mesmo campo, com a store no estado atual.

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles` do contêiner e dos filhos), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** o contêiner fica com `display: flex`, a direção e o vão lidos das caixas; as margens dos filhos ao longo da linha saem (`src/core/style/organize.ts:102`), então o que a página mostra não se move. Em uma transação e um passo de desfazer; a mensagem é `status.organized`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o iframe desenha o contêiner como flex pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/organize.ts:92` `  const layer = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:393` `'element.organize': organizeCommand,` — as portas enviam só a intenção; os nomes das propriedades vêm dos doors.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/organize.ts:84`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/organize.ts:84`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- o ouvinte `keydown` que entrega a tecla é removido em `src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`; o timer da rajada é limpo em `src/editor/input/keymap.ts:367` `target.clearTimeout(burstTimer);`.
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/organize.ts:75`).

## Medições
- nenhuma — as caixas dos filhos vêm da porta Layout (`src/core/style/organize.ts:84` `  const boxes = holder.node.children.map((child) => layout.box(child.id as NodeId));`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-element.organize
- **Argumentos enviados:** { gaps: "gap", margins: "margin", view: "display", axis: "flex-direction" }
