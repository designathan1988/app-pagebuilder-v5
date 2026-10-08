# TRC-element.organize
- **Chamada:** `src/app/commands.ts:393` `'element.organize': organizeCommand,`
- **Argumentos:** `{ gaps: property[gap], margins: property[margin], view: property[display], axis: property[flex-direction] }` — os nomes das propriedades que os doors fixam, como o manifesto declara (`manifest/commands/style.json:11366` `"id": "element.organize",`).
- **Ramos que dependem dos argumentos:** nenhum — os nomes das propriedades vêm dos doors; os ramos vêm da seleção e da medida.

## Passos
1. `src/app/commands.ts:393` `'element.organize': organizeCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o mesmo caminho pela tecla do canvas e pelo menu).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `organizableSelection` é lida [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
7. `src/core/style/organize.ts:75` `export const organizeCommand = registerHandler('element.organize', (context): Outcome<never> => {` — o tratador recebe o contexto.
8. `src/core/style/organize.ts:77` `  const at = containerOf(state, rules);` — o contêiner da seleção é achado [lê: EST-L01-030 via containerOf] [lê: EST-L01-031 via containerOf].
9. `src/core/style/organize.ts:80` `  const locked = firstLockRefusal(state.document, [at.node.id as NodeId], 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
10. `src/core/style/organize.ts:82` `  const holder = styleHolders(context, [at])[0];` — o detentor do contêiner é achado.
11. `src/core/style/organize.ts:84` `  const boxes = holder.node.children.map((child) => layout.box(child.id as NodeId));` — as caixas desenhadas dos filhos vêm da porta Layout [lê: EST-L01-030 via layout].
12. `src/core/style/organize.ts:88` `  const line = lineOf(drawn) ?? 'column';` — a linha em que os filhos correm (coluna ou linha).
13. `src/core/style/organize.ts:89` `  const gap = gapOf(drawn, line);` — o vão mais frequente entre vizinhos.
14. `src/core/style/organize.ts:93` `  const patches: Patch[] = writeDeclarations(holder.node, holder.path, layer, {` — o contêiner toma display flex, a direção e o vão [escreve: EST-L01-030 via run].
15. `src/core/style/organize.ts:102` `    patches.push(...writeDeclarations(where.node, where.path, layer, Object.fromEntries(sides.map((property): [string, StoredValue | null] => [property, null]))));` — as margens dos filhos ao longo da linha saem [escreve: EST-L01-030 via run].
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
17. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a seleção não é um contêiner com dois filhos: recusa `status.organize.unavailable`; é: segue.
- R2 `src/core/style/organize.ts:79` `  if (at === null) throw new Error('element.organize: the selection is not one container holding two children');` — o contêiner some entre a predicate e o tratador: lança o defeito; presente: segue.
- R3 `src/core/style/organize.ts:81` `  if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/style/organize.ts:86` `  if (boxes.some((box) => box === null)) return { kind: 'refused', message: message('status.organize.unmeasured', { name: holder.node.name }) };` — um filho que o canvas não desenha: recusa `status.organize.unmeasured`; todos desenhados: segue.
- R5 `src/core/style/organize.ts:47` `  const down = boxes.every((box, i) => i === 0 || box.y >= before(i).y + before(i).height - 1);` — caixas uma abaixo da outra: a linha é `column`; uma ao lado da outra (`src/core/style/organize.ts:48`): `row`; nenhuma das duas: a linha fica `column`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/organize.ts:75`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles` do contêiner e dos filhos), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** o contêiner fica com `display: flex`, a direção e o vão lidos das caixas; as margens dos filhos ao longo da linha saem (`src/core/style/organize.ts:102`), então o que a página mostra não se move. Em uma transação e um passo de desfazer; a mensagem é `status.organized`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o iframe desenha o contêiner como flex pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/organize.ts:92` `  const layer = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:393` `'element.organize': organizeCommand,` — as portas enviam só a intenção; os nomes das propriedades vêm dos doors.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/organize.ts:84`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/organize.ts:84`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/organize.ts:75`).

## Medições
- nenhuma — as caixas dos filhos vêm da porta Layout (`src/core/style/organize.ts:84` `  const boxes = holder.node.children.map((child) => layout.box(child.id as NodeId));`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
