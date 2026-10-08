# TRC-colors.saveSwatch
- **Chamada:** `src/app/commands.ts:211` `'colors.saveSwatch': saveSwatchCommand,`
- **Argumentos:** `{ color: string }` — o argumento `color` do manifesto (`manifest/commands/design-system.json:10` `"color": {`), do tipo `color`, obrigatório.
- **Ramos que dependem dos argumentos:** R1 e R2 (o valor de `color` decide a recusa e o caminho do patch).

## Passos
1. `src/app/commands.ts:211` `'colors.saveSwatch': saveSwatchCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — a store lê os argumentos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/design/colors.ts:12` `export const saveSwatchCommand = registerHandler('colors.saveSwatch', ({ state }, { color }): Outcome<never> => {` — o tratador recebe o estado e o argumento `color`.
7. `src/core/design/colors.ts:13` `const colour = String(color).trim();` — o texto do argumento é aparado.
8. `src/core/design/colors.ts:10` `export const swatchesOf = (document: DocumentJson): readonly string[] => document.swatches ?? NONE;` — `swatchesOf` lê as cores guardadas do documento [lê: EST-L01-030 via swatchesOf].
9. `src/core/design/colors.ts:17` `const saved = swatchesOf(state.document);` — a lista guardada é lida.
10. `src/core/design/colors.ts:19` `const patch = state.document.swatches === undefined ? { op: 'add' as const, path: ['swatches'], value: [colour] } : { op: 'add' as const, path: ['swatches', saved.length], value: colour };` — o patch acrescenta a cor (a lista inteira quando não há nenhuma, senão no fim).
11. `src/core/design/colors.ts:20` `return { kind: 'change', patches: [patch], message: said };` — o tratador devolve o patch e a mensagem.
12. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
13. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história (o comando é desfazível) [escreve: EST-L01-032 via record].
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — a store valida o documento novo [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
15. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado e avisa os assinantes [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/colors.ts:15` `if (colour === '') return { kind: 'refused', message: argumentRefused('color') };` — com `color` vazio (só espaços), o tratador recusa e nada muda; com um texto não vazio, segue para o passo 9.
- R2 `src/core/design/colors.ts:18` `if (saved.includes(colour)) return { kind: 'change', message: said };` — cor já guardada: devolve `change` sem patch, e nada no documento muda; cor inédita: segue para o passo 10.
- R3 `src/core/design/colors.ts:19` `const patch = state.document.swatches === undefined ? { op: 'add' as const, path: ['swatches'], value: [colour] } : { op: 'add' as const, path: ['swatches', saved.length], value: colour };` — `swatches` ausente: o patch cria a lista; `swatches` presente: o patch acrescenta no fim.
- R4 `src/core/store/store.ts:527` `if (documentChanged && gesture === null && ownedGroup === null) {` — sem mudança no documento (R2) não há entrada na história; com mudança e sem gesto, a entrada é gravada.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/colors.ts:12` `export const saveSwatchCommand = registerHandler('colors.saveSwatch', ({ state }, { color }): Outcome<never> => {`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento, via argumentRefusal, run, swatchesOf, commit), EST-L01-031 (a seleção, via commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `swatches`, via applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o documento ganha a cor em `swatches` (`src/core/design/colors.ts:19` `const patch = state.document.swatches === undefined ? { op: 'add' as const, path: ['swatches'], value: [colour] } : { op: 'add' as const, path: ['swatches', saved.length], value: colour };`), e a mensagem é `status.swatch.saved` (`src/core/design/colors.ts:16` `const said = message('status.swatch.saved', { color: colour });`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o seletor de cor lista a nova amostra (leitura da store).
- **DOM do canvas:** nada muda (a cor guardada não é desenhada no canvas).

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/colors.ts:19`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:211` `'colors.saveSwatch': saveSwatchCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/colors.ts:20`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/colors.ts:20`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é desenhado do documento commitado.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de ser commitado.

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/colors.ts:12`).

## Medições
- nenhuma
