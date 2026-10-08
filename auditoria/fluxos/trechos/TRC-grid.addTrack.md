# TRC-grid.addTrack
- **Chamada:** `src/app/commands.ts:412` `'grid.addTrack': addGridTrack,`
- **Argumentos:** `{ property: property[grid-template-columns] }` — o eixo cuja trilha entra, como o manifesto declara (`manifest/commands/style.json:10727` `"id": "grid.addTrack",`).
- **Ramos que dependem dos argumentos:** nenhum — o `property` só nomeia o eixo; os ramos vêm da grelha e do dono das trilhas.

## Passos
1. `src/app/commands.ts:412` `'grid.addTrack': addGridTrack,` — a tabela liga o id ao tratador.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla `+` do contexto da grelha entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/canvas/grid-edit.ts:90` `export const addGridTrack = registerHandler<'grid.addTrack', EditorUi>('grid.addTrack', (context, { property }) =>` — o tratador recebe o contexto e o eixo.
8. `src/editor/canvas/grid-edit.ts:91` `  tracksOn(context, { property, edit: { add: true } }),` — o edit passa ao dono das trilhas.
9. `src/editor/canvas/grid-edit.ts:84` `  const grid = gridOf(context.state, context.rules);` — a grelha editada é achada [lê: EST-L01-030 via gridOf] [lê: EST-L01-031 via gridOf].
10. `src/editor/canvas/grid-edit.ts:86` `  const aimed = { ...context, state: { ...context.state, selection: [grid.id as NodeId] } };` — a seleção é a grelha, para o dono das trilhas escrever nela.
11. `src/editor/canvas/grid-edit.ts:87` `  return setGridTracksCommand.run(aimed as never, { property: edit.property, edit: edit.edit } as never) as Outcome<EditorUi>;` — chama o dono único das trilhas [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
12. `src/core/style/tracks.ts:124` `  const asked: TrackEdit = typeof track === 'number' ? { track, value: typeof value === 'string' ? value : '' } : (edit as TrackEdit);` — o edit de acrescentar é lido.
13. `src/core/style/tracks.ts:127` `  const held = storedValue(primary.node, property, rules) ?? shownText(primary.node, property, rules);` — as trilhas do elemento são lidas [lê: EST-L01-030 via storedValue].
14. `src/core/style/tracks.ts:128` `  const written = editedTracks(held, asked);` — uma trilha entra (igual às outras quando todas são iguais).
15. `src/core/style/tracks.ts:131` `  const read = readValue(context, property, written);` — a lista nova é lida pelo codec [lê: EST-L01-030 via readValue].
16. `src/core/style/tracks.ts:134` `  return writeStyle(context, property, read.css);` — o valor lido vira uma escrita de estilo.
17. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via run].
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/canvas/grid-edit.ts:85` `  if (grid === null) return { kind: 'change' };` — nenhuma grelha editada nem selecionada: `change` sem patch; com: segue.
- R2 `src/core/style/tracks.ts:122` `  if (primary === null) return { kind: 'change' };` — a grelha não está no documento: `change` sem patch; está: segue.
- R3 `src/core/style/tracks.ts:130` `  if (typeof written !== 'string') return { kind: 'refused', message: message('status.tracks.noTrack', { name: primary.node.name }) };` — a trilha pedida não existe na grelha: recusa `status.tracks.noTrack`; existe: segue.
- R4 `src/core/style/tracks.ts:133` `  if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, rules), value: 'value' in asked ? String(asked.value) : written }) };` — a lista nova que o navegador não aceita: recusa `status.value.invalid`; aceita: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/grid-edit.ts:90`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, gridOf, storedValue, readValue, commit), EST-L01-031 (a seleção, via gridOf, commit), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (o documento `styles`, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a grelha editada fica com uma trilha a mais no eixo pedido, na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o chrome da grelha desenha a coluna nova.
- **DOM do canvas:** o iframe desenha a grelha com a trilha nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:412` `'grid.addTrack': addGridTrack,` — a tecla e a alça do chrome entregam o mesmo eixo ao dono único das trilhas.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/canvas/grid-edit.ts:87`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/canvas/grid-edit.ts:87`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/grid-edit.ts:90`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
