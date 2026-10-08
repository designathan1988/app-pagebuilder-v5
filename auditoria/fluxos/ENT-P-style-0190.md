# ENT-P-style-0190

Porta `handle-padding-left-band` do comando `style.setSpacing` (tipo comando-porta canvas-handle). O trecho do comando é `TRC-style.setSpacing`.

## Passos
1. `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId, { ...ps.spacing.entry.door.args, ...ps.spacing.args, [ps.spacing.valueArg]: `${value}px` } as never);` — a faixa de espaçamento despacha `style.setSpacing` com o valor em px.
2. `src/editor/input/pointer/events.ts:280` `ps.spacing.gesture = store.gesture();` — o gesto usado foi aberto na store do editor.
3. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir o gesto [lê: EST-L05a-001 via keepTyping].
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor encaminha o despacho ao gesto da store do núcleo. Antes e depois do comando, a conferência dos modos lê a store, o estado do ponteiro e a digitação (`src/editor/input/modes.ts:27` `const state = store.getState();`, `src/editor/input/modes.ts:29` `const shared = sharedOf(store);`, `src/editor/input/modes.ts:33` `typing: heldTyping() !== null,`). [lê: EST-L01-037 via getState] [lê: EST-L01-034 via getState] [lê: EST-L05a-019 via sharedOf] [lê: EST-L05a-001 via heldTyping]
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

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
- **Estado final:** os longhands da caixa ficam com o valor lido na camada `rules.base` (`src/core/style/spacing.ts:40`), em uma transação e um passo de desfazer; a mensagem é `status.spacing.set` ou `status.style.setMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo da caixa passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com o espaçamento novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/spacing.ts:37` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,` — o campo e a faixa entregam o mesmo valor ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/spacing.ts:43`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/spacing.ts:43`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/spacing.ts:20`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.setSpacing
- **Argumentos enviados:** { box: "padding", sides: "left", value: <os px medidos> }
- R1 `src/core/style/spacing.ts:27` `if (first === undefined) throw new Error(` — a porta manda `box` `padding` e `sides` `left`; um lado escreve o longhand daquele lado.
- R2 `src/core/style/spacing.ts:34` `if (box === NO_NEGATIVE && /^\s*-/.test(value) && Number.parseFloat(value) < 0) return { kind: 'refused', message: message('status.value.negativePadding') };` — a caixa é `padding`; um valor negativo recusa `status.value.negativePadding`; não negativo segue.
- R3 `src/core/style/spacing.ts:36` `if (read === null) return { kind: 'refused'` — o `value` (o texto do campo, ou os px medidos) lido pelo codec do longhand; não tomado recusa `status.value.invalid`; tomado escreve.
