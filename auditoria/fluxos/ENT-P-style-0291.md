# ENT-P-style-0291

Porta `key-arrow-down-in-number-field` do comando `field.step` (tipo comando-porta shortcut). O trecho do comando é `TRC-field.step`.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla do door `key-arrow-down-in-number-field` despacha `field.step`; o comando não toma a área de transferência.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` resolvido é o da store do editor quando não há gesto nem rajada de teclas.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — a store do editor lê do manifesto se o comando é desfazível.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de um campo é gravada antes da escrita [lê: EST-L05a-001 via beforeCommand].
5. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando segue à store do núcleo no contexto capturado.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entra em `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
9. `src/app/commands.ts:426` `'field.step': stepField,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e fora de uma rajada de teclas do canvas, o disparo é o `dispatch` da store do editor.
- `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o comando não toma a área de transferência: a tecla despacha de imediato.
- `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha; com gesto, o despacho que muda o documento espera o fim dele.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- ouvinte `keydown` — `src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);` — a tecla desta porta chega por este ouvinte; no intervalo podem rodar as demais entradas de teclado (`auditoria/entradas.md`), com a store no estado atual.
- timer da rajada — `src/editor/input/keymap.ts:395` `burstTimer = target.setTimeout(endBurst, TYPING_BURST);` — armado quando a tecla é uma letra (`src/editor/input/keymap.ts:392` `if (letter) {`); no intervalo pode rodar outra tecla do mesmo campo, com a store no estado atual.

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** a propriedade do detentor move um passo (fino, ou o do campo) na camada `rules.base` (`src/core/style/set.ts:351`); passos em rajada no mesmo campo fundem num só passo de desfazer. A mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo passa a exibir o valor novo.
- **DOM do canvas:** o iframe desenha o elemento com o valor novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:426` `'field.step': stepField,` — o botão, a tecla, a roda e o arraste entregam o texto do campo, mesmo vazio, e a direção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/number-field.ts:79`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/number-field.ts:79`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- o ouvinte `keydown` que entrega a tecla é removido em `src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`; o timer da rajada é limpo em `src/editor/input/keymap.ts:367` `target.clearTimeout(burstTimer);`.
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/number-field.ts:82`).

## Medições
- nenhuma — o valor mostrado de um campo vazio vem da porta Layout (`src/editor/inspector/number-field.ts:61` `      return found === null ? '' : (storedValue(found.node, property, context.rules) ?? context.layout.computed(id as NodeId, property) ?? '');`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-field.step
- **Argumentos enviados:** { direction: "down", size: "step", property: <a propriedade do campo>, value: <o texto do campo, mesmo vazio> }
- R1 `src/editor/inspector/number-field.ts:83` `const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);` — o `modifier` que a porta mandar (Shift ×10, Alt ×0.1) multiplica o passo; sem ele, ×1.
- R2 `src/editor/inspector/number-field.ts:83` `const delta = (size === 'page' ? PAGE_STEP : STEP) * factorOf(modifier) * (direction === 'up' ? 1 : -1);` — o `size` da porta é `step`: um passo simples, na direção `down`.
- R3 `src/editor/inspector/number-field.ts:56` `if (value.trim() !== '') return value;` — o `value` é o texto que o campo guarda, mesmo vazio; vazio parte do valor mostrado pelo elemento ou pela página.
