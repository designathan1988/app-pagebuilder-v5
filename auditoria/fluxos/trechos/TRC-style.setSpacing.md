# TRC-style.setSpacing
- **Chamada:** `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,`
- **Argumentos:** `{ box: enum[padding|margin], sides: enum[all|top|right|bottom|left], value: string, modifier?: enum[Shift|Alt] }` — como o manifesto declara (`manifest/commands/style.json:5463` `"id": "style.setSpacing",`).
- **Ramos que dependem dos argumentos:** R1 (o `box` e os `sides` resolvem as propriedades longhand), R2 (o `box` padding com `value` negativo), R3 (o `value` não tomado pelo longhand).

## Passos
1. `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/inspector-controls.tsx:460` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { box, sides, value });` — o campo da caixa entrega a intenção; a faixa de espaçamento entrega pela mesma linha do dono do ponteiro (`src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId,`).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/spacing.ts:20` `export const setSpacingCommand = registerHandler('style.setSpacing', (context, { box, sides, value }): Outcome<never> => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/spacing.ts:22` `const composite = rules.compositeFacts.get(box);` — o composto da caixa é procurado [lê: EST-L01-037 via handlerContext].
9. `src/core/style/spacing.ts:25` `const properties = sides === 'all' ? composite.longhands : composite.longhands.filter((p) => p === `${box}-${sides}`);` — os longhands escritos são resolvidos pelos `sides`.
10. `src/core/style/spacing.ts:29` `const nodes = state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos escritos são achados [lê: EST-L01-030 via locate].
11. `src/core/style/spacing.ts:32` `const locked = firstLockRefusal(state.document, nodes.map((found) => found.node.id as NodeId), 'status.locked.edit');` — a trava é lida [lê: EST-L01-030 via firstLockRefusal].
12. `src/core/style/spacing.ts:35` `const read = readValue(context, first, value);` — o texto é lido pelo codec do longhand [lê: EST-L01-030 via readValue].
13. `src/core/style/spacing.ts:40` `const patches: Patch[] = holders.flatMap((held) => writeDeclarations(held.node, held.path, { breakpoint, state: base }, values));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
14. `src/core/style/spacing.ts:43` `return { kind: 'change', patches, message: said };` — o tratador devolve os patches e a mensagem.
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/spacing.ts:27` `if (first === undefined) throw new Error(` — `sides` que não existe na caixa: lança o defeito; com lado: segue para o passo 10. O lado inteiro escreve o longhand próprio; `all` escreve os quatro longhands da caixa.
- R2 `src/core/style/spacing.ts:34` `if (box === NO_NEGATIVE && /^\s*-/.test(value) && Number.parseFloat(value) < 0) return { kind: 'refused', message: message('status.value.negativePadding') };` — padding com valor negativo: recusa `status.value.negativePadding`; caso contrário: segue (um margin negativo é escrito).
- R3 `src/core/style/spacing.ts:36` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: named, value }) };` — valor que o longhand não toma, ou o navegador não aceita: recusa `status.value.invalid`; tomado: escreve.
- R4 `src/core/style/spacing.ts:31` `if (primary === undefined) return { kind: 'change' };` — seleção vazia: `change` sem patch; com seleção: segue.
- R5 `src/core/style/spacing.ts:33` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado, ou dentro de um: recusa `status.locked.edit`; livre: segue.
- R6 `src/core/style/spacing.ts:42` `const said = holders.length > 1 ? message('status.style.setMany', { property: named, count: holders.length, value: read.css }) : message('status.spacing.set', { property: named, name: holders[0]?.name ?? primary.node.name, value: read.css });` — vários elementos: a mensagem nomeia a contagem; um só: a mensagem nomeia o elemento.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/spacing.ts:20`); a faixa de espaçamento repete o despacho a cada passo do arraste, mas cada passo roda inteiro dentro do trecho.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, lockRefusal, readValue, run), EST-L01-031 (a seleção, via handlerContext, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os longhands da caixa ficam com o valor lido na camada `rules.base` (`src/core/style/spacing.ts:40`), em uma transação e um passo de desfazer; a mensagem é `status.spacing.set` ou `status.style.setMany`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo da caixa passa a exibir o valor.
- **DOM do canvas:** o iframe desenha o elemento com o espaçamento novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/spacing.ts:37` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
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
