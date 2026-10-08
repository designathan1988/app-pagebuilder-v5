# TRC-style.setGridTracks
- **Chamada:** `src/app/commands.ts:409` `'style.setGridTracks': setGridTracksCommand,`
- **Argumentos:** `{ property: property, track?: integer, value?: string, edit?: json }` — o campo de uma trilha manda o seu `track` e o `value`; os botões de acrescentar e remover mandam um `edit`, como o manifesto declara (`manifest/commands/style.json:10139` `"id": "style.setGridTracks",`).
- **Ramos que dependem dos argumentos:** R1 (o `property`/`track` ausentes), R2 (o `edit` de acrescentar ou remover), R3 (a trilha sem lugar), R4 (o valor que a propriedade não toma).

## Passos
1. `src/app/commands.ts:409` `'style.setGridTracks': setGridTracksCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/inspector-controls.tsx:378` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { property, track: index, value: element.value });` — o campo de uma trilha entrega a intenção; os botões de acrescentar e remover pela porta do manifesto (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/tracks.ts:116` `export const setGridTracksCommand = registerHandler('style.setGridTracks', (context, { property, track, value, edit }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/tracks.ts:121` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento principal é achado [lê: EST-L01-030 via locate].
9. `src/core/style/tracks.ts:124` `const asked: TrackEdit = typeof track === 'number' ? { track, value: typeof value === 'string' ? value : '' } : (edit as TrackEdit);` — o campo manda o lugar e o texto; o botão manda o edit.
10. `src/core/style/tracks.ts:127` `const held = storedValue(primary.node, property, rules) ?? shownText(primary.node, property, rules);` — as trilhas mostradas aqui são lidas do elemento, próprias ou herdadas [lê: EST-L01-030 via storedValue].
11. `src/core/style/tracks.ts:128` `const written = editedTracks(held, asked);` — o edit monta a lista nova (acrescentar, remover, ou escrever uma trilha pelo lugar).
12. `src/core/style/tracks.ts:131` `const read = readValue(context, property, written);` — a lista montada é lida pelo codec [lê: EST-L01-030 via readValue].
13. `src/core/style/tracks.ts:134` `return writeStyle(context, property, read.css);` — o valor lido vira uma escrita de estilo.
14. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/tracks.ts:117` `if (typeof property !== 'string' || (typeof track !== 'number' && (typeof edit !== 'object' || edit === null || Array.isArray(edit)))) {` — `property` que não é texto, ou sem `track` nem `edit`: recusa nomeando o argumento; com: segue.
- R2 `src/core/style/tracks.ts:109` `if ('add' in edit) return withTrackAdded(held);` — o `edit` de acrescentar: uma trilha a mais (igual às outras quando todas são iguais); o de remover (`src/core/style/tracks.ts:110` `if ('remove' in edit) return withTrackRemoved(held);`): a última sai.
- R3 `src/core/style/tracks.ts:130` `if (typeof written !== 'string') return { kind: 'refused', message: message('status.tracks.noTrack', { name: primary.node.name }) };` — a trilha de um lugar que a grelha não tem: recusa `status.tracks.noTrack`; lugar válido: segue.
- R4 `src/core/style/tracks.ts:133` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, rules), value: 'value' in asked ? String(asked.value) : written }) };` — trilha que a propriedade não toma, ou o navegador não aceita: recusa `status.value.invalid`; tomada: escreve.
- R5 `src/core/style/tracks.ts:122` `if (primary === null) return { kind: 'change' };` — seleção vazia: `change` sem patch; com: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/tracks.ts:116`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o `grid-template-columns` (ou o eixo pedido) do detentor fica com a lista nova na camada `rules.base` (`src/core/style/set.ts:351`), em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o editor de trilhas passa a mostrar a trilha nova.
- **DOM do canvas:** o iframe desenha a grelha com a trilha nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
