# TRC-element.renameMany

- **Chamada:** `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ pattern, start }` (`manifest/commands/nodes.json:562` `"args": {`), com `pattern` (tipo `string`, obrigatório) e `start` (tipo `integer`, obrigatório); a porta `batch-rename-apply` envia `{ ...apply.door.args, pattern, start }` (`src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };`).
- **Ramos que dependem dos argumentos:** R2 (`pattern` vazio, ou `start` que não é inteiro seguro ao menos 1).

## Passos

1. `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada antes.
3. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `hasSelection` é lida antes do tratador (`src/core/selection/selection.ts:12` `export const hasSelection = registerPredicate('hasSelection', (state) => state.selection.length > 0);`) [lê: EST-L01-031 via run].
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
5. `src/core/nodes/rename-many.ts:10` `export const renameManyCommand = registerHandler('element.renameMany', (context, { pattern, start }) => {` — o tratador.
6. `src/core/nodes/rename-many.ts:11` `const targets = context.state.selection as readonly NodeId[];` — [lê: EST-L01-031 via handlerContext] os alvos são a seleção.
7. `src/core/nodes/rename-many.ts:12` `if (targets.length === 0) return { kind: 'change' };` — R1.
8. `src/core/nodes/rename-many.ts:13` `const typed = pattern.trim();` — o padrão aparado.
9. `src/core/nodes/rename-many.ts:14` `const first = Number(start);` — o número inicial.
10. `src/core/nodes/rename-many.ts:15` `if (typed === '' || !Number.isSafeInteger(first) || first < 1) return { kind: 'refused', message: message('status.rename.patternInvalid') };` — R2.
11. `src/core/export/authoring.ts:18` `export function renameBatch(context:HandlerContext<never>,targets:readonly NodeId[],pattern:string,start=1):Outcome<never>{` — o renomeador em lote.
12. `src/core/export/authoring.ts:19` ` if(new Set(targets).size!==targets.length)throw new Error('A batch target must occur once');` — R3.
13. `src/core/export/authoring.ts:21` `   const at=locate(context.state.document,id);` — [lê: EST-L01-030 via locate] cada alvo no documento.
14. `src/core/export/authoring.ts:22` `   if(at===null)throw new Error('A batch target no longer exists');` — R4.
15. `src/core/export/authoring.ts:25` ` const renamed=batchNames(names,pattern,start);` — a lista de nomes novos.
16. `src/core/export/names.ts:237` `  const output = names.map((name, index) => pattern.replaceAll('{name}', name).replaceAll('{n}', String(start + index)).trim());` — `{name}` e `{n}` são substituídos.
17. `src/core/export/names.ts:238` `  if (output.some((name) => name === '')) throw new Error('Every layer must have a nonempty name');` — R5.
18. `src/core/export/authoring.ts:27` ` for(const [index,target] of targets.entries()){` — um a um, na ordem da seleção.
19. `src/core/export/authoring.ts:28` `   const outcome=renameCommand.run(context,{target,name:renamed[index]??''});` — cada nome passa pelo renomeador único (`src/core/nodes/names.ts:14` `export const renameCommand = registerHandler('element.rename', ({ state }, { target, name }) => {`).
20. `src/core/nodes/names.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...found.path, 'name'], value: kept }], message: message('status.renamed', { old: previous, name: kept }) };` — o patch do nome de cada alvo.
21. `src/core/export/authoring.ts:29` `   if(outcome.kind!=='change')return outcome;` — R6.
22. `src/core/export/authoring.ts:32` ` return {kind:'change',patches};` — um `change` com todos os patches, uma transação.
23. `src/core/nodes/rename-many.ts:18` `  if (outcome.kind !== 'change') return outcome;` — uma recusa de qualquer alvo é devolvida inteira.
24. `src/core/nodes/rename-many.ts:19` `  return { ...outcome, message: message('status.rename.many', { count: targets.length }) };` — a mensagem conta os renomeados.
25. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — a recusa de R2 e a de qualquer alvo seguem por aqui.
26. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish] a recusa é publicada, nada é renomeado em parte.
27. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — [escreve: EST-L01-030 via applyPatches] todos os patches entram no documento numa transação.
28. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — [escreve: EST-L01-032 via record] um passo de história.
29. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
30. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
31. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
32. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/nodes/rename-many.ts:12` `if (targets.length === 0)` — nada selecionado: `change` sem patches, nada muda; com seleção: segue.
- R2 `src/core/nodes/rename-many.ts:15` `if (typed === '' || !Number.isSafeInteger(first) || first < 1)` — padrão vazio ou número inicial inválido: `refused` com `status.rename.patternInvalid`; válidos: segue.
- R3 `src/core/export/authoring.ts:19` `if(new Set(targets).size!==targets.length)` — um alvo repetido: lança (defeito da porta); únicos: segue.
- R4 `src/core/export/authoring.ts:22` `if(at===null)` — um alvo que o documento não tem: lança (defeito da porta); todos presentes: segue.
- R5 `src/core/export/names.ts:238` `if (output.some((name) => name === ''))` — um padrão que não gera nome para algum alvo: lança; todo alvo ganha nome: segue.
- R6 `src/core/export/authoring.ts:29` `if(outcome.kind!=='change')return outcome;` — um alvo que o renomeador recusa (raiz ou bloqueio): a recusa inteira é devolvida e nada muda; todos aceitos: o `change` com todos os patches.
- R7 `src/core/export/authoring.ts:32` `return {kind:'change',patches};` — os patches de todos os alvos numa só transação.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/nodes/rename-many.ts:10` `export const renameManyCommand = registerHandler('element.renameMany', (context, { pattern, start }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via locate), EST-L01-031 (a seleção, via run, handlerContext), EST-L05a-001 (a digitação pendente, via `beforeCommand`).
- escreve: EST-L01-030 (o `name` de cada alvo no documento, via applyPatches, commit, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (a história, via record), EST-L01-033 (a mensagem, via publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish).

## Resultado

- **Estado final:** EST-L01-030 — cada alvo recebe um patch `replace` do próprio nome (`src/core/export/authoring.ts:28` via `src/core/nodes/names.ts:28`), todos numa transação; uma recusa de qualquer alvo não muda nada (`src/core/export/authoring.ts:29`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** as linhas de Camadas dos alvos mostram os nomes novos (`src/editor/shell/sidebar/layers.tsx:319` `{node.name}`).
- **DOM do canvas:** os rótulos dos alvos mostram os nomes novos (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras

- G1: n/a — o comando escreve nomes no documento, fora de qualquer camada de estilo (`src/core/nodes/names.ts:28`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/nodes/rename-many.ts:10` `export const renameManyCommand = registerHandler('element.renameMany', (context, { pattern, start }) => {` — o único tratador do comando; toda porta entrega o mesmo par `{ pattern, start }`.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/nodes/rename-many.ts:19`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/nodes/rename-many.ts:19`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/export/authoring.ts:32`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar, e o lote inteiro entra numa transação.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/nodes/rename-many.ts:10`).

## Medições

- nenhuma
