# ENT-P-style-0298

Porta `panel-drag-field-label-horizontal` do comando `field.scrub` (tipo comando-porta panel-drag). O trecho do comando é `TRC-field.scrub`.

## Passos
1. `src/editor/input/pointer/panels.ts:137` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, value: press.value, distance: at.x - startX, ...(held !== null ? { modifier: held } : {}) } as never);` — o arraste do painel despacha `field.scrub`.
2. `src/editor/input/pointer/panels.ts:136` `shared.open = store.gesture();` — o gesto usado foi aberto na store do editor.
3. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir o gesto [lê: EST-L05a-001 via keepTyping].
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor encaminha o despacho ao gesto da store do núcleo. Antes e depois do comando, a conferência dos modos lê a store, o estado do ponteiro e a digitação (`src/editor/input/modes.ts:27` `const state = store.getState();`, `src/editor/input/modes.ts:29` `const shared = sharedOf(store);`, `src/editor/input/modes.ts:33` `typing: heldTyping() !== null,`). [lê: EST-L01-037 via getState] [lê: EST-L01-034 via getState] [lê: EST-L05a-019 via sharedOf] [lê: EST-L05a-001 via heldTyping]
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:427` `'field.scrub': scrubField,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/store.ts:218` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — com um grupo de comandos aberto, o gesto encaminha ao `dispatch` da store; sem ele, abre um gesto próprio do núcleo.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- nenhuma — o caminho do despacho até a linha da tabela não tem `await`, timer nem ouvinte (a porta dispara de um evento já recebido).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** a propriedade do detentor move pelos passos do arraste, na camada `rules.base` (`src/core/style/set.ts:351`); os patches entram no gesto (`src/core/store/store.ts:534`) e o gesto grava um passo de desfazer ao fechar. A mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo passa a exibir o valor novo.
- **DOM do canvas:** o iframe desenha o elemento com o valor novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:427` `'field.scrub': scrubField,` — o arraste do rótulo entrega o texto do campo, mesmo vazio, e a distância ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/number-field.ts:79`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/number-field.ts:79`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/number-field.ts:87`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-field.scrub
- **Argumentos enviados:** { property: <a propriedade do campo>, value: <o texto guardado na pressão>, distance: <os px do arraste> }
- R1 `src/editor/inspector/number-field.ts:88` `const delta = Math.round(distance / SCRUB_PIXELS_PER_STEP) * STEP * factorOf(modifier);` — o `modifier` segurado (Shift ×10, Alt ×0.1) multiplica o passo do arraste; sem ele, ×1.
- R2 `src/editor/inspector/number-field.ts:56` `if (value.trim() !== '') return value;` — o `value` é o texto do campo na pressão; vazio parte do valor mostrado.
