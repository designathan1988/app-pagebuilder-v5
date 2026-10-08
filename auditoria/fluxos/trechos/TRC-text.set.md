# TRC-text.set
- **Chamada:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Argumentos:** o tratador recebe `{ target, content }` (`src/generated/commands.ts:335` `"text.set": { readonly target: NodeId; readonly content: JsonValue };`), com `target` (o id do nó editado, tipo `node`, obrigatório) e `content` (tipo `json`, obrigatório): o texto simples digitado, ou a árvore de runs do texto editado (`editArgs`, `src/editor/canvas/text-edit.ts:227` `args.content = marked || hasMarks(reading.runs) ? canonical(reading.runs) : plainText(reading.runs);`).
- **Ramos que dependem dos argumentos:** R1 e R2 (o nó que `target` nomeia), R3, R5 e R6 (a forma e o valor de `content`).

## Passos
1. `src/app/commands.ts:431` `'text.set': setTextCommand,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada antes; `text.set` é desfazível (`manifest/commands/text.json:117` `"undoable": true,`), então a digitação pendente de um campo é gravada primeiro.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — [lê: EST-L01-030 via argumentRefusal] os argumentos são lidos contra o manifesto.
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador.
5. `src/core/text/text.ts:18` `export const setTextCommand = registerHandler('text.set', ({ state, rules }, { target, content }) => {` — o tratador.
6. `src/core/text/text.ts:19` `const found = locate(state.document, target);` — [lê: EST-L01-030 via locate] o nó que a porta nomeou.
7. `src/core/text/text.ts:21` `if (!found) throw new Error(` — R1, defeito da porta.
8. `src/core/text/text.ts:22` `if (rules.elements.get(found.node.type)?.content !== 'text') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.editText' }, name: found.node.name }) };` — R2.
9. `src/core/text/text.ts:25` `const parsed = typeof content === 'string' ? withText(found.node.inline ?? [found.node.text ?? ''], content) : parseInline(content);` — [lê: EST-L01-030 via withText] o texto digitado sobre o texto guardado, ou a árvore de runs.
10. `src/core/text/text.ts:26` `const runs = Array.isArray(parsed) ? [...mapInlineLinks(parsed, keptHref)] : parsed;` — os endereços de link do conteúdo tomam a forma que a regra lê.
11. `src/core/text/text.ts:27` `if (runs === null) return { kind: 'refused', message: argumentRefused('content') };` — R3.
12. `src/core/text/text.ts:29` `const locked = lockRefusal(state.document, target, 'status.locked.editText');` — [lê: EST-L01-030 via lockRefusal] a trava sobre o nó.
13. `src/core/text/text.ts:30` `if (locked !== null) return { kind: 'refused', message: locked };` — R4.
14. `src/core/text/text.ts:31` `if (runs === 'unsafe') return { kind: 'refused', message: message('status.link.unsafe') };` — R5.
15. `src/core/text/text.ts:32` `const text = plainText(runs);` — [lê: EST-L01-030 via plainText] o texto das runs.
16. `src/core/text/text.ts:33` `const inline: readonly InlineRun[] | null = hasMarks(runs) ? canonical(runs) : null;` — [lê: EST-L01-030 via canonical] a árvore canônica quando há marcas.
17. `src/core/text/text.ts:35` `if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });` — [escreve: EST-L01-030 via run] o patch do texto.
18. `src/core/text/text.ts:37` `if (inline === null && stored !== null) patches.push({ op: 'remove', path: [...found.path, 'inline'] });` — [escreve: EST-L01-030 via run] o patch que tira a árvore inline.
19. `src/core/text/text.ts:38` `else if (inline !== null && !deepEqual(stored, inline)) patches.push({ op: stored === null ? 'add' : 'replace', path: [...found.path, 'inline'], value: inline });` — [escreve: EST-L01-030 via run] o patch da árvore inline.
20. `src/core/text/text.ts:40` `if (patches.length === 0) return { kind: 'change', message: message('status.textEdit.cancelled', { name: found.node.name }) };` — R6.
21. `src/core/text/text.ts:41` `return { kind: 'change', patches, message: message('status.textEdit.committed', { name: found.node.name }) };` — R7.
22. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — [escreve: EST-L01-030 via applyPatches] os patches entram no documento.
23. `src/core/store/store.ts:504` `derived = own.applied.length > 0 && options.derive !== undefined ? options.derive(before.document, own.document, handlerContext(confirmed)) : null;` — o que segue a mudança (as coleções e as regiões compartilhadas) junta-se na mesma transação.
24. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — [escreve: EST-L01-032 via record] o passo de desfazer.
25. `src/editor/store.ts:166` `return styleStateFollows({ ...followed, ui: endRenameOnUndoable({ ...followed, ui: endOnUndoable(followed, command) }, command) });` — um comando desfazível encerra a edição de texto.
26. `src/editor/canvas/text-edit.ts:187` `return command.history.undoable ? ended(state.ui) : state.ui;` — [escreve: EST-L01-037 via endOnUndoable] o `ui.textEdit` fica com `node` nulo e sem prompt de link.
27. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] publica a mudança.
28. `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` — [lê: EST-L01-030 via publish] os assinantes de documento são chamados.
29. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-037 via publish] os assinantes são chamados.

## Ramos
- R1 `src/core/text/text.ts:21` `if (!found) throw new Error(` — o nó que `target` nomeia não está no documento: lança (defeito da porta); está: segue.
- R2 `src/core/text/text.ts:22` `if (rules.elements.get(found.node.type)?.content !== 'text') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.editText' }, name: found.node.name }) };` — o tipo do nó não é de conteúdo texto: `refused` com `status.element.notApplicable`; é: segue.
- R3 `src/core/text/text.ts:27` `if (runs === null) return { kind: 'refused', message: argumentRefused('content') };` — `content` não é texto nem árvore de runs: `refused` com `status.args.invalid`; é: segue.
- R4 `src/core/text/text.ts:30` `if (locked !== null) return { kind: 'refused', message: locked };` — o nó ou um ancestral carrega a trava: `refused` com a mensagem da trava; livre: segue.
- R5 `src/core/text/text.ts:31` `if (runs === 'unsafe') return { kind: 'refused', message: message('status.link.unsafe') };` — a árvore traz um endereço de link não permitido: `refused` com `status.link.unsafe`; permitido: segue.
- R6 `src/core/text/text.ts:40` `if (patches.length === 0) return { kind: 'change', message: message('status.textEdit.cancelled', { name: found.node.name }) };` — o conteúdo é igual ao guardado: `change` sem patch, com `status.textEdit.cancelled`; diferente: segue (R7).
- R7 `src/core/text/text.ts:41` `return { kind: 'change', patches, message: message('status.textEdit.committed', { name: found.node.name }) };` — o texto e/ou a árvore inline entram por patches, com `status.textEdit.committed`.

## Fronteiras assíncronas
- nenhuma — o tratador de `src/core/text/text.ts:18` é síncrono e devolve o resultado na chamada; o que segue a mudança (`src/core/store/store.ts:481`) roda na mesma chamada.

## Estado
- lê: EST-L01-030 (o documento, via argumentRefusal, locate, withText, lockRefusal, handlerContext), EST-L01-037 (o estado do editor, via handlerContext, endOnUndoable), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, endOnUndoable, publish)

## Resultado
- **Estado final:** EST-L01-030 com o `text` (e o `inline`) do nó pelos patches `src/core/text/text.ts:35` `if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });` e o `ui.textEdit` encerrado por `src/editor/canvas/text-edit.ts:187`; em R6 o documento fica como estava e só a mensagem muda, e nas recusas R2, R3, R4 e R5 nada muda no documento.
- **Re-renderizado:** os assinantes de documento (`src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`) e os assinantes da store (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a barra de status mostra a mensagem do desfecho (`src/core/store/store.ts:540` `message: outcome.message ?? (before.refused === true ? null : before.message),`) e a moldura volta a ser `aria-hidden` quando a edição acaba (`src/editor/canvas/frame.tsx:264` `aria-hidden={editing ? undefined : true}`).
- **DOM do canvas:** o renderizador aplica os patches ao elemento (`src/editor/canvas/frame.tsx:81` `renderer.apply(change.before, change.after, change.patches);`) e a edição em lugar termina.

## Regras
- G1: n/a — o trecho grava o texto do nó, fora de qualquer camada de estilo `src/core/text/text.ts:35` `if (found.node.text !== text) patches.push({ op: 'replace', path: [...found.path, 'text'], value: text });`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/text/text.ts:18` `export const setTextCommand = registerHandler('text.set', ({ state, rules }, { target, content }) => {` — o único tratador; as portas do manifesto (Enter e Escape no texto editando, clique fora, campo do inspector, Enter no campo, painel rápido) chamam a mesma linha `src/app/commands.ts:431` `'text.set': setTextCommand,`.
- G4: n/a — o tratador muda estado e não desenha nada sobre o canvas `src/core/text/text.ts:41`.
- G5: n/a — o trecho não desenha painel nem barra `src/core/text/text.ts:41`; as famílias de defeito de painel são medidas na Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: ok `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — o texto entra por um patch aplicado pelo único escritor do documento, e o resultado é validado antes de publicar `src/core/store/store.ts:267`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador `src/core/text/text.ts:18`.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco.
