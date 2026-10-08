# ENT-P-style-0260

Porta `key-arrow-up-in-shadow-pad` do comando `style.setShadows` (tipo comando-porta shortcut). O trecho do comando é `TRC-style.setShadows`.

## Passos
1. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla do door `key-arrow-up-in-shadow-pad` despacha `style.setShadows`; o comando não toma a área de transferência.
2. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` resolvido é o da store do editor quando não há gesto nem rajada de teclas.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — a store do editor lê do manifesto se o comando é desfazível.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente de um campo é gravada antes da escrita [lê: EST-L05a-001 via beforeCommand].
5. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o comando segue à store do núcleo no contexto capturado.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entra em `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
9. `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto aberto e fora de uma rajada de teclas do canvas, o disparo é o `dispatch` da store do editor.
- `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o comando não toma a área de transferência: a tecla despacha de imediato.
- `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha; com gesto, o despacho que muda o documento espera o fim dele.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- ouvinte `keydown` — `src/editor/input/keymap.ts:586` `target.addEventListener('keydown', onKeyDown);` — a tecla desta porta chega por este ouvinte; no intervalo podem rodar as demais entradas de teclado (`auditoria/entradas.md`), com a store no estado atual.
- timer da rajada — `src/editor/input/keymap.ts:395` `burstTimer = target.setTimeout(endBurst, TYPING_BURST);` — armado quando a tecla é uma letra (`src/editor/input/keymap.ts:392` `if (letter) {`); no intervalo pode rodar outra tecla do mesmo campo, com a store no estado atual.

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** o detentor fica com as camadas da sombra escritas na camada `rules.base` (`src/core/style/set.ts:351`), guardadas como estrutura, em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o editor de sombra passa a exibir as camadas novas.
- **DOM do canvas:** o iframe desenha o elemento com a sombra nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,` — o campo, o pad e a alça entregam o mesmo `edit` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/shadows.ts:174`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/shadows.ts:174`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- o ouvinte `keydown` que entrega a tecla é removido em `src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`; o timer da rajada é limpo em `src/editor/input/keymap.ts:367` `target.clearTimeout(burstTimer);`.
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/shadows.ts:157`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o `css.supports` é a porta de suporte a CSS, não uma medida do navegador.

## Ramos do trecho
- **Trecho:** TRC-style.setShadows
- **Argumentos enviados:** { property: "box-shadow", edit: {"nudge":{"y":-1}} }
- R2 `src/core/style/shadows.ts:162` `if (fields === undefined) throw new Error(` — a `property` é `box-shadow`; sem estrutura em properties.json lança o defeito, com estrutura segue.
- R3 `src/core/style/shadows.ts:164` `if (primary === null || edit === null || typeof edit !== 'object' || Array.isArray(edit)) return { kind: 'change' };` — o `edit` que esta porta manda é objeto: segue.
- R4 `src/core/style/shadows.ts:168` `const stepped = modifier === 'Shift' && given.nudge !== undefined` — a tecla manda um `nudge`; com Shift move dez pixels, sem Shift um.
- R5 `src/core/style/shadows.ts:170` `if ('refused' in result) return refuse((edit as Record<string, unknown>)[result.refused]);` — camada inexistente, comprimento que não é comprimento, blur negativo ou cor vazia recusam `status.value.invalid`; editado segue.
- R6 `src/core/style/shadows.ts:173` `if (!css.supports(property, text)) return refuse((edit as ShadowEdit).color ?? text);` — camadas que o navegador não aceita recusam `status.value.invalid`; aceitas escreve.
