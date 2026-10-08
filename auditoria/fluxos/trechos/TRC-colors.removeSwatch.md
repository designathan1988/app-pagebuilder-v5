# TRC-colors.removeSwatch
- **Chamada:** `src/app/commands.ts:212` `'colors.removeSwatch': removeSwatchCommand,`
- **Argumentos:** `{ index: integer }` — o argumento `index` do manifesto (`manifest/commands/design-system.json:64` `"index": {`), obrigatório.
- **Ramos que dependem dos argumentos:** R1 e R2 (o valor de `index` decide a recusa e o caminho do patch).

## Passos
1. `src/app/commands.ts:212` `'colors.removeSwatch': removeSwatchCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/colors.ts:23` `export const removeSwatchCommand = registerHandler('colors.removeSwatch', ({ state }, { index }): Outcome<never> => {` — o tratador recebe o estado e o argumento `index`.
7. `src/core/design/colors.ts:24` `const saved = swatchesOf(state.document);` — as cores guardadas são lidas [lê: EST-L01-030 via swatchesOf].
8. `src/core/design/colors.ts:25` `const colour = saved[index];` — a cor daquela posição é lida.
9. `src/core/design/colors.ts:27` `const patch = saved.length === 1 ? { op: 'remove' as const, path: ['swatches'] } : { op: 'remove' as const, path: ['swatches', index] };` — o patch tira a lista inteira quando é a última, senão a cor da posição.
10. `src/core/design/colors.ts:28` `return { kind: 'change', patches: [patch], message: message('status.swatch.removed', { color: colour }) };` — o tratador devolve o patch e a mensagem.
11. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
12. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
13. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/colors.ts:26` `if (colour === undefined) return { kind: 'refused', message: argumentRefused('index') };` — `index` fora do intervalo das cores guardadas: recusa, nada muda; dentro do intervalo: segue.
- R2 `src/core/design/colors.ts:27` `const patch = saved.length === 1 ? { op: 'remove' as const, path: ['swatches'] } : { op: 'remove' as const, path: ['swatches', index] };` — uma só cor guardada: o patch tira a lista `swatches`; mais de uma: tira a cor da posição.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/colors.ts:23`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento, via argumentRefusal, swatchesOf, commit), EST-L01-031 (a seleção, via commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `swatches`, via applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a cor sai de `swatches` (`src/core/design/colors.ts:27` `const patch = saved.length === 1 ? { op: 'remove' as const, path: ['swatches'] } : { op: 'remove' as const, path: ['swatches', index] };`); a mensagem é `status.swatch.removed`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o seletor de cor deixa de listar a amostra.
- **DOM do canvas:** nada muda (a cor guardada não é desenhada no canvas).

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/colors.ts:27`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:212` `'colors.removeSwatch': removeSwatchCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/colors.ts:28`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/colors.ts:28`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é desenhado do documento commitado.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/colors.ts:23`).

## Medições
- nenhuma
