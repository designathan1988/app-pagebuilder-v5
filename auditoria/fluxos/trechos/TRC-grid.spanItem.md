# TRC-grid.spanItem
- **Chamada:** `src/app/commands.ts:414` `'grid.spanItem': spanGridItem,`
- **Argumentos:** `{ property: property[grid-column], value: string, span?: integer, width?: number }` — o `value` é o px que o arraste cobre; o `span` e o `width` são o que a alça mediu ao ser premida, como o manifesto declara (`manifest/commands/style.json:10831` `"id": "grid.spanItem",`).
- **Ramos que dependem dos argumentos:** R3 (o `width` e o `span` que a alça carrega decidem a largura da trilha).

## Passos
1. `src/app/commands.ts:414` `'grid.spanItem': spanGridItem,` — a tabela liga o id ao tratador.
2. `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId,` — a alça do canto do item, arrastada, entrega a intenção a cada passo.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/canvas/grid-edit.ts:112` `export const spanGridItem = registerHandler<'grid.spanItem', EditorUi>('grid.spanItem', (context, { property, value, span: heldSpan, width }) => {` — o tratador recebe o contexto e o que a alça mediu.
8. `src/editor/canvas/grid-edit.ts:114` `  const item = itemOf(state, rules);` — o item selecionado é achado [lê: EST-L01-030 via itemOf] [lê: EST-L01-031 via itemOf] [lê: EST-L01-037 via itemOf].
9. `src/editor/canvas/grid-edit.ts:116` `  const held = storedPlace(item, property, rules);` — o lugar guardado do item é lido [lê: EST-L01-030 via storedPlace].
10. `src/editor/canvas/grid-edit.ts:117` `  const asked = Number.parseFloat(value);` — o px do arraste vira número.
11. `src/editor/canvas/grid-edit.ts:120` `  const measured = typeof width === 'number' && width > 0 ? width : (layout.box(item.id as NodeId)?.width ?? 0);` — a largura de uma trilha vem da medida ao premir, ou da caixa do item [lê: EST-L01-037 via layout].
12. `src/editor/canvas/grid-edit.ts:121` `  const coveredThen = typeof heldSpan === 'number' && heldSpan > 0 ? heldSpan : held.span;` — o span coberto ao premir.
13. `src/editor/canvas/grid-edit.ts:123` `  const tracks = Math.max(1, Math.round(asked / (measured / coveredThen)));` — o número de trilhas cobertas.
14. `src/editor/canvas/grid-edit.ts:124` `  return spanThrough(context, property, tracks) ?? { kind: 'change' };` — chama o dono único do lugar do item.
15. `src/editor/canvas/grid-edit.ts:106` `  return setGridItemCommand.run(context as never, { property, ...(start === undefined ? {} : { start }), span } as never) as Outcome<EditorUi>;` — o dono único escreve o lugar [lê: EST-L01-030 via run].
16. `src/core/style/grid-item.ts:51` `  const written = gridItemValue(storedPlace(primary.node, property, rules), start, span);` — o start é o do item; o span é o novo [lê: EST-L01-030 via storedPlace].
17. `src/core/style/grid-item.ts:57` `  return writeStyle(context, property, read.css, longhandValues(property, read.value, context.rules));` — o valor lido vira uma escrita de estilo.
18. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:559` `        gesture.patches.push(...applied.applied);` — dentro do gesto do arraste, o patch entra na transação do gesto [escreve: EST-L01-007 via run].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/canvas/grid-edit.ts:115` `  if (item === null) return { kind: 'change' };` — a seleção não é um item da grelha editada: `change` sem patch; é: segue.
- R2 `src/editor/canvas/grid-edit.ts:122` `  if (measured <= 0 || !Number.isFinite(asked)) return { kind: 'change' };` — trilha de largura zero, ou px ilegível: `change` sem patch; medidos: segue.
- R3 `src/editor/canvas/grid-edit.ts:120` `  const measured = typeof width === 'number' && width > 0 ? width : (layout.box(item.id as NodeId)?.width ?? 0);` — a alça carrega a largura medida: é ela; sem: a caixa do item.
- R4 `src/core/style/grid-item.ts:53` `    return { kind: 'refused', message: message(written.refused === 'start' ? 'status.gridItem.noStart' : 'status.gridItem.noSpan') };` — span abaixo de 1: recusa `status.gridItem.noSpan`; válido: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/grid-edit.ts:112`); o arraste repete o despacho a cada passo, mas cada passo roda inteiro dentro do trecho, dentro de um gesto.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L01-037 (`ui.gridEdit`, regras), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-032 (histórica), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** o `grid-column` do item fica com o span que o arraste cobriu, na camada `rules.base` (`src/core/style/set.ts:351`); os patches entram no gesto do arraste (`src/core/store/store.ts:534`) e o gesto grava um passo de desfazer ao fechar. A mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o chrome da grelha desenha a alça na nova borda do item.
- **DOM do canvas:** o iframe desenha o item com o span novo pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:414` `'grid.spanItem': spanGridItem,` — a alça entrega só a intenção ao dono do lugar do item.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/canvas/grid-edit.ts:124`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/canvas/grid-edit.ts:124`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/grid-edit.ts:112`).

## Medições
- nenhuma — a largura de uma trilha vem da porta Layout (`src/editor/canvas/grid-edit.ts:120` `  const measured = typeof width === 'number' && width > 0 ? width : (layout.box(item.id as NodeId)?.width ?? 0);`), fora do trecho; nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
