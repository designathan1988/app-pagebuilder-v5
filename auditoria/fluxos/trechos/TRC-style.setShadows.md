# TRC-style.setShadows
- **Chamada:** `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,`
- **Argumentos:** `{ property: enum[box-shadow|text-shadow], edit: json, distance?: number, modifier?: enum[Shift], targets?: nodes }` — como o manifesto declara (`manifest/commands/style.json:7708` `"id": "style.setShadows",`).
- **Ramos que dependem dos argumentos:** R2 (a `property` de uma estrutura), R3 (o `edit` não objeto), R4 (o `modifier` Shift multiplica o nudge), R5 (o `edit` recusado), R6 (as camadas que o navegador não aceita).

## Passos
1. `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,` — a tabela liga o id ao tratador.
2. `src/editor/shell/field.tsx:989` `(store.dispatch as Dispatch)(entry.command.id, same ? args : { ...args, targets: [...targets] }, context);` — o campo entrega a intenção, com os alvos onde foi digitado; o pad e a alça de sombra entregam pelo dono do ponteiro (`src/editor/input/pointer/events.ts:290` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId, { ...ps.spacing.entry.door.args, property, edit, distance: dx } as never);`).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `editableSelection` é lida [lê: EST-L01-031 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/style/shadows.ts:157` `export const setShadowsCommand = registerHandler('style.setShadows', (asked, { property, edit, modifier, targets }) => {` — o tratador recebe o contexto e os argumentos.
8. `src/core/style/shadows.ts:158` `const context = withTargets(asked, targets);` — o contexto passa a nomear os alvos [lê: EST-L01-030 via withTargets].
9. `src/core/style/shadows.ts:161` `const fields = rules.structures.get(property);` — a estrutura da sombra é procurada [lê: EST-L01-037 via handlerContext].
10. `src/core/style/shadows.ts:163` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento principal é achado [lê: EST-L01-030 via locate].
11. `src/core/style/shadows.ts:168` `const stepped = modifier === 'Shift' && given.nudge !== undefined ? { ...given, nudge: { ...(given.nudge.x === undefined ? {} : { x: given.nudge.x * 10 }), ...(given.nudge.y === undefined ? {} : { y: given.nudge.y * 10 }) } } : given;` — o Shift multiplica o nudge por dez.
12. `src/core/style/shadows.ts:169` `const result = editedLayers(storedLayers(primary.node, property, rules), fields, stepped);` — as camadas são editadas [lê: EST-L01-030 via storedLayers].
13. `src/core/style/shadows.ts:171` `const text = structuredCss(result.layers, fields);` — as camadas viram CSS.
14. `src/core/style/shadows.ts:173` `if (!css.supports(property, text)) return refuse((edit as ShadowEdit).color ?? text);` — o navegador precisa aceitar as camadas [lê: EST-L01-030 via css.supports].
15. `src/core/style/shadows.ts:174` `return writeStyle(context, property, text, { [property]: result.layers });` — as camadas vão pela via de um estilo, guardadas como estrutura.
16. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as camadas são escritas no detentor, no breakpoint e estado [escreve: EST-L01-030 via writeDeclarations].
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/shadows.ts:159` `if (context === null) return { kind: 'change' };` — nenhum alvo restou: `change` sem mudança; restou: segue.
- R2 `src/core/style/shadows.ts:162` `if (fields === undefined) throw new Error(` — `property` sem estrutura em properties.json: lança o defeito; com estrutura: segue.
- R3 `src/core/style/shadows.ts:164` `if (primary === null || edit === null || typeof edit !== 'object' || Array.isArray(edit)) return { kind: 'change' };` — sem elemento principal ou `edit` que não é objeto: `change` sem mudança; com objeto: segue.
- R4 `src/core/style/shadows.ts:168` `const stepped = modifier === 'Shift' && given.nudge !== undefined ? { ...given, nudge: { ...(given.nudge.x === undefined ? {} : { x: given.nudge.x * 10 }), ...(given.nudge.y === undefined ? {} : { y: given.nudge.y * 10 }) } } : given;` — `modifier` Shift com nudge: move dez pixels; sem: move um.
- R5 `src/core/style/shadows.ts:170` `if ('refused' in result) return refuse((edit as Record<string, unknown>)[result.refused]);` — camada inexistente, comprimento que não é comprimento, blur negativo ou cor vazia: recusa `status.value.invalid`; editado: segue.
- R6 `src/core/style/shadows.ts:173` `if (!css.supports(property, text)) return refuse((edit as ShadowEdit).color ?? text);` — camadas que o navegador não aceita: recusa `status.value.invalid`; aceitas: escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/shadows.ts:157`); o pad e a alça repetem o despacho a cada passo do arraste, mas cada passo roda inteiro dentro do trecho.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, firstLockRefusal, lockRefusal, readValue, storedValue, run), EST-L01-031 (a seleção, via handlerContext, locate, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o detentor fica com as camadas da sombra escritas na camada `rules.base` (`src/core/style/set.ts:351`), guardadas como estrutura, em uma transação e um passo de desfazer; a mensagem é a de `writeStyle`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o editor de sombra passa a exibir as camadas novas.
- **DOM do canvas:** o iframe desenha o elemento com a sombra nova pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto capturado (`src/core/style/set.ts:334` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,` — o campo, o pad e a alça entregam o mesmo `edit` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/shadows.ts:174`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/shadows.ts:174`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/shadows.ts:157`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o `css.supports` é a porta de suporte a CSS, não uma medida do navegador.
