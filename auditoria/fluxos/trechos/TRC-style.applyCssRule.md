# TRC-style.applyCssRule
- **Chamada:** `src/app/commands.ts:423` `'style.applyCssRule': applyCssRuleCommand,`
- **Argumentos:** `{ css: string }` — o texto da regra do elemento, como o manifesto declara (`manifest/commands/style.json:9468` `"id": "style.applyCssRule",`).
- **Ramos que dependem dos argumentos:** R3 (o `css` que não é declaração ou não é tomado).

## Passos
1. `src/app/commands.ts:423` `'style.applyCssRule': applyCssRuleCommand,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-031 via run].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/style/css-rule.ts:14` `export const applyCssRuleCommand = registerHandler('style.applyCssRule', (context, { css }) => {` — o tratador recebe o contexto e o texto.
7. `src/core/style/css-rule.ts:16` `const id = state.selection.length === 1 ? state.selection[0] : undefined;` — só um elemento selecionado [lê: EST-L01-031 via handlerContext].
8. `src/core/style/css-rule.ts:18` `const at = locate(state.document, id);` — o nó é achado [lê: EST-L01-030 via locate].
9. `src/core/style/css-rule.ts:20` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — a trava do nó é lida [lê: EST-L01-030 via lockRefusal].
10. `src/core/style/css-rule.ts:22` `const parsed = parseDeclarations(String(css ?? ''), context);` — o texto vira declarações pelo dono único do formato.
11. `src/core/style/css-rule.ts:24` `const { breakpoint, state: base } = context.rules.base;` — a camada escrita é a que o editor mostra [lê: EST-L01-037 via handlerContext].
12. `src/core/style/css-rule.ts:28` `const same = Object.keys(current).length === Object.keys(wanted).length && Object.entries(wanted).every(([property, value]) => current[property] === value);` — as declarações atuais são comparadas com as novas.
13. `src/core/style/css-rule.ts:32` `return { kind: 'change' as const, patches: replaceLayer(context, at, wanted), message: said };` — o detentor é reescrito inteiro pela camada nova.
14. `src/core/style/set.ts:84` `    return writeDeclarations(held.node, held.path, layer, { ...cleared, ...wanted });` — as declarações são escritas no detentor [escreve: EST-L01-030 via writeDeclarations].
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/style/css-rule.ts:17` `if (id === undefined) return { kind: 'refused' as const, message: message('status.needsSingleSelection') };` — não há exatamente um selecionado: recusa `status.needsSingleSelection`; há: segue.
- R2 `src/core/style/css-rule.ts:19` `if (at === null) throw new Error(` — o nó não está no documento: lança o defeito; está: segue.
- R3 `src/core/style/css-rule.ts:21` `if (locked !== null) return { kind: 'refused' as const, message: locked };` — elemento travado: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/style/css-rule.ts:23` `if ('refused' in parsed) return { kind: 'refused' as const, message: parsed.refused };` — peça que não é declaração, propriedade desconhecida, valor com chaves ou endereço inseguro: recusa com o motivo; texto bom: segue.
- R5 `src/core/style/css-rule.ts:30` `if (same) return { kind: 'change' as const, message: said };` — as declarações já são as mesmas: `change` sem patch; diferentes: escreve pela camada nova.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/style/css-rule.ts:14`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, locate, lockRefusal, readValue, run), EST-L01-031 (a seleção, via handlerContext, run), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via writeDeclarations, applyPatches), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o elemento selecionado fica com as declarações da regra na camada `rules.base` (`src/core/style/css-rule.ts:32`); uma propriedade deixada fora sai, uma escrita entra; em uma transação e um passo de desfazer. A mensagem é `status.css.applied`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de código passa a exibir a regra nova.
- **DOM do canvas:** o iframe desenha o elemento com as declarações novas pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a escrita usa a camada do contexto captado (`src/core/style/css-rule.ts:24` `const { breakpoint, state: base } = context.rules.base;`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:423` `'style.applyCssRule': applyCssRuleCommand,` — a porta do painel de código entrega o texto ao tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/style/css-rule.ts:32`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/core/style/css-rule.ts:32`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/style/css-rule.ts:14`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
