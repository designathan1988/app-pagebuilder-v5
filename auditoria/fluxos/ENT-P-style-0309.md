# ENT-P-style-0309

Porta `handle-grid-track` do comando `style.setGridTracks` (tipo comando-porta canvas-handle). O trecho do comando é `TRC-style.setGridTracks`.

## Passos
1. `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId, { ...ps.spacing.entry.door.args, ...ps.spacing.args, [ps.spacing.valueArg]: `${value}px` } as never);` — a faixa de espaçamento despacha `style.setGridTracks` com o valor em px.
2. `src/editor/input/pointer/events.ts:280` `ps.spacing.gesture = store.gesture();` — o gesto usado foi aberto na store do editor.
3. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente de um campo é gravada ao abrir o gesto [lê: EST-L05a-001 via keepTyping].
4. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto do editor encaminha o despacho ao gesto da store do núcleo. Antes e depois do comando, a conferência dos modos lê a store, o estado do ponteiro e a digitação (`src/editor/input/modes.ts:27` `const state = store.getState();`, `src/editor/input/modes.ts:29` `const shared = sharedOf(store);`, `src/editor/input/modes.ts:33` `typing: heldTyping() !== null,`). [lê: EST-L01-037 via getState] [lê: EST-L01-034 via getState] [lê: EST-L05a-019 via sharedOf] [lê: EST-L05a-001 via heldTyping]
5. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto entra em `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — o tratador é achado na tabela de comandos pelo id.
8. `src/app/commands.ts:409` `'style.setGridTracks': setGridTracksCommand,` — a linha da tabela liga o id ao tratador (a Chamada do trecho).

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
- **Estado final:** o `grid-template-columns` (ou o eixo pedido) do detentor fica com a lista nova na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o editor de trilhas passa a mostrar a trilha nova.
- **DOM do canvas:** o iframe desenha a grelha com a trilha nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:409` `'style.setGridTracks': setGridTracksCommand,` — o campo, os botões e as teclas da grelha entregam a mesma intenção ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/tracks.ts:134`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/tracks.ts:134`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/tracks.ts:116`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-style.setGridTracks
- **Argumentos enviados:** { property: "grid-template-columns", track: <o lugar da trilha>, value: <o texto do campo> }
- R1 `src/core/style/tracks.ts:117` `if (typeof property !== 'string' || (typeof track !== 'number' && (typeof edit !== 'object' || edit === null || Array.isArray(edit)))) {` — o `property` e o `track` vêm do campo; bom segue, faltando `track` e `edit` recusa nomeando o argumento.
- R2 `src/core/style/tracks.ts:109` `if ('add' in edit) return withTrackAdded(held);` — a porta de campo não manda `edit` de acrescentar nem remover: o ramo não é tomado.
- R3 `src/core/style/tracks.ts:130` `if (typeof written !== 'string') return { kind: 'refused', message: message('status.tracks.noTrack', { name: primary.node.name }) };` — uma trilha de um lugar que a grelha não tem recusa `status.tracks.noTrack`; lugar válido segue.
- R4 `src/core/style/tracks.ts:133` `if (read === null) return { kind: 'refused'` — uma trilha que a propriedade não toma recusa `status.value.invalid`; tomada escreve.
