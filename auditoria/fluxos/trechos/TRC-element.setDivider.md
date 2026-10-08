# TRC-element.setDivider
- **Chamada:** `src/app/commands.ts:394` `'element.setDivider': setDividerCommand,`
- **Argumentos:** `{ index: integer, value: string, grow: property[flex-grow], basis: property[flex-basis], view: property[display], axis: property[flex-direction] }` — o `index` é a fronteira arrastada e o `value` a largura pedida, como o manifesto declara (`manifest/commands/style.json:11575` `"id": "element.setDivider",`).
- **Ramos que dependem dos argumentos:** R3 (o `index` sem o vizinho seguinte), R5 (o `value` que não é número).

## Passos
1. `src/app/commands.ts:394` `'element.setDivider': setDividerCommand,` — a tabela liga o id ao tratador.
2. `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId,` — a alça da fronteira, arrastada, entrega a intenção a cada passo.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `divideableSelection` é lida [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/divider.ts:47` `export const setDividerCommand = registerHandler('element.setDivider', (context, { index, value }): Outcome<never> => {` — o tratador recebe o contexto e a fronteira.
8. `src/core/style/divider.ts:49` `  const at = rowOf(state, rules);` — a linha flex da seleção é achada [lê: EST-L01-030 via rowOf] [lê: EST-L01-031 via rowOf].
9. `src/core/style/divider.ts:52` `  const before = at.node.children[index];` — o filho antes da fronteira.
10. `src/core/style/divider.ts:53` `  const after = at.node.children[index + 1];` — o filho depois.
11. `src/core/style/divider.ts:55` `  const locked = firstLockRefusal(state.document, [at.node.id as NodeId, before.id as NodeId, after.id as NodeId], 'status.locked.edit');` — a trava dos três é lida [lê: EST-L01-030 via firstLockRefusal].
12. `src/core/style/divider.ts:57` `  const left = layout.box(before.id as NodeId);` — a caixa do filho antes vem da porta Layout [lê: EST-L01-030 via layout].
13. `src/core/style/divider.ts:61` `  const room = left.width + right.width;` — a sala que os dois dividem.
14. `src/core/style/divider.ts:63` `  const asked = Number.parseFloat(value);` — a largura pedida vira número.
15. `src/core/style/divider.ts:65` `  const wanted = Math.min(Math.max(asked, MIN_WIDTH), Math.max(MIN_WIDTH, room - MIN_WIDTH));` — a largura é limitada pelo mínimo de uma coluna.
16. `src/core/style/divider.ts:66` `  const fraction = round(wanted / room);` — a fração da sala.
17. `src/core/style/divider.ts:74` `    const values: Record<string, StoredValue> = { [ARGS.grow ?? '']: String(share), [ARGS.basis ?? '']: '0px' };` — cada filho toma a sua fração como crescimento, com base 0 [escreve: EST-L01-030 via run].
18. `src/core/style/divider.ts:75` `    patches.push(...writeDeclarations(where.node, where.path, rules.base, values));` — as declarações são escritas no filho, na camada [escreve: EST-L01-030 via run].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:559` `        gesture.patches.push(...applied.applied);` — dentro do gesto do arraste, o patch entra na transação do gesto [escreve: EST-L01-030 via run].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a seleção não é uma linha flex: recusa `status.divider.unavailable`; é: segue.
- R2 `src/core/style/divider.ts:51` `  if (at === null) throw new Error('element.setDivider: the selection is not one flex row');` — a linha some entre a predicate e o tratador: lança o defeito; presente: segue.
- R3 `src/core/style/divider.ts:54` `  if (before === undefined || after === undefined) return { kind: 'refused', message: message('status.divider.unavailable', { name: at.node.name }) };` — o `index` sem os dois vizinhos: recusa `status.divider.unavailable`; com: segue.
- R4 `src/core/style/divider.ts:56` `  if (locked !== null) return { kind: 'refused', message: locked };` — algum dos três travado: recusa `status.locked.edit`; livres: segue.
- R5 `src/core/style/divider.ts:60` `  if (left === null || right === null) return { kind: 'refused', message: message('status.divider.unmeasured', { name: at.node.name }) };` — filho que o canvas não desenha: recusa `status.divider.unmeasured`; desenhados: segue. Sala zero: a mesma recusa (`src/core/style/divider.ts:62`).
- R6 `src/core/style/divider.ts:64` `  if (!Number.isFinite(asked)) return { kind: 'refused', message: message('status.value.invalid', { value }) };` — `value` que não é número: recusa `status.value.invalid`; número: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/divider.ts:47`); o arraste repete o despacho a cada passo, mas cada passo roda inteiro dentro do trecho, dentro de um gesto.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles` dos dois filhos), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** os dois filhos da fronteira ficam com a fração da sala como `flex-grow` e base 0 (`src/core/style/divider.ts:74`); os patches entram no gesto do arraste (`src/core/store/store.ts:534`) e o gesto grava um passo de desfazer ao fechar. A mensagem é `status.divider` com as porcentagens.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o iframe desenha os dois filhos na proporção nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/divider.ts:75` `    patches.push(...writeDeclarations(where.node, where.path, rules.base, values));`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:394` `'element.setDivider': setDividerCommand,` — a alça entrega só a intenção (a fronteira e a largura) ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/divider.ts:75`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/divider.ts:75`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/divider.ts:47`).

## Medições
- nenhuma — as caixas dos filhos vêm da porta Layout (`src/core/style/divider.ts:57` `  const left = layout.box(before.id as NodeId);`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
