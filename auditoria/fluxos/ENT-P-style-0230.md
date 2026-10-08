# ENT-P-style-0230

Porta `panel-drag-gradient-stop-gradient-bar` do comando `style.setBackgroundImage` (tipo comando-porta panel-drag). O trecho do comando é `TRC-style.setBackgroundImage`.

## Passos
1. `src/editor/input/pointer/panels.ts:127` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, edit, distance: at.x - startX } as never);` — o arraste do painel despacha `style.setBackgroundImage`.
2. `src/editor/input/pointer/panels.ts:125` `shared.open = store.gesture();` — o gesto usado foi aberto na store do editor.
3. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir o gesto [lê: EST-L05a-001 via keepTyping].
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor encaminha o despacho ao gesto da store do núcleo.
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

## Ramos
- `src/editor/store.ts:218` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — com um grupo de comandos aberto, o gesto encaminha ao `dispatch` da store; sem ele, abre um gesto próprio do núcleo.
- `src/core/store/store.ts:403` `if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();` — grupo aberto num comando desfazível: recusa; sem grupo: segue.
- `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — comando construído segue; não construído devolve `not-available-yet`.

## Fronteiras assíncronas
- nenhuma — o caminho do despacho até a linha da tabela não tem `await`, timer nem ouvinte (a porta dispara de um evento já recebido).

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** a `background-image` do detentor fica com o valor lido na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`. O gradiente removido deixa as outras camadas; sem camada, a declaração sai.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo do endereço passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com a imagem nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,` — o campo, o editor de gradiente e a alça entregam a mesma intenção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/background-image.ts:67`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/background-image.ts:67`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/background-image.ts:25`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.setBackgroundImage
- **Argumentos enviados:** { property: "background-image", edit: <o edit do arraste>, distance: <os px> }
- R3 `src/core/style/background-image.ts:39` `if (rest.length === 0) return removeStyle(context, property);` — a porta manda um `edit` de gradiente; sem camada restante a declaração é removida, com camadas escreve o resto.
- R4 `src/core/style/background-image.ts:47` `if ('refused' in edited) {` — gradiente inexistente, paradas abaixo de duas ou valor não tomado recusam; editado segue.
- R5 `src/core/style/background-image.ts:56` `if (typeof value !== 'string') return { kind: 'refused', message: argumentRefused('value') };` — esta porta não manda `value` (manda `edit`): o ramo não é tomado.
- R6 `src/core/style/background-image.ts:61` `if (!read.ok) return { kind: 'refused', message: read.refusal };` — esta porta não manda endereço: o ramo não é tomado.
- R7 `src/core/style/background-image.ts:66` `if (read === null) return { kind: 'refused'` — esta porta manda `edit`, não endereço: o ramo não é tomado.
