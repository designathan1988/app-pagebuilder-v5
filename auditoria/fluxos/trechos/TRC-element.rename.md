# TRC-element.rename

- **Chamada:** `src/app/commands.ts:336` `'element.rename': renameCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ target, name }` (`manifest/commands/nodes.json:199` `"args": {`), com `target` (tipo `node`, obrigatório) e `name` (tipo `string`, obrigatório); a porta `layers-row-name-field` envia `{ target: node.id, name }` (`src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });`).
- **Ramos que dependem dos argumentos:** R1 e R2 (a forma dos argumentos lança), R5 (`name` vazio), R6 (`name` igual ao atual); os demais dependem do nó que `target` nomeia.

## Passos

1. `src/app/commands.ts:336` `'element.rename': renameCommand,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada antes.
3. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
5. `src/core/nodes/names.ts:14` `export const renameCommand = registerHandler('element.rename', ({ state }, { target, name }) => {` — o tratador.
6. `src/core/nodes/names.ts:15` `const found = locate(state.document, target);` — [lê: EST-L01-030 via locate] o nó que a porta nomeou.
7. `src/core/nodes/names.ts:17` `if (!found) throw new Error(` — R1.
8. `src/core/nodes/names.ts:18` `if (typeof name !== 'string') throw new Error('element.rename: the name is not a string');` — R2.
9. `src/core/nodes/names.ts:21` `if (found.parent === null) return { kind: 'refused', message: message('status.rename.root') };` — R3.
10. `src/core/nodes/names.ts:22` `const locked = lockRefusal(state.document, target, 'status.locked.rename');` — [lê: EST-L01-030 via lockRefusal]
11. `src/core/nodes/names.ts:23` `if (locked !== null) return { kind: 'refused', message: locked };` — R4.
12. `src/core/nodes/names.ts:24` `const previous = found.node.name;` — o nome de antes.
13. `src/core/nodes/names.ts:25` `const kept = name.trim();` — o nome aparado.
14. `src/core/nodes/names.ts:26` `if (kept === '') return { kind: 'change', message: message('status.rename.empty', { name: previous }) };` — R5.
15. `src/core/nodes/names.ts:27` `if (kept === previous) return { kind: 'change' };` — R6.
16. `src/core/nodes/names.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...found.path, 'name'], value: kept }], message: message('status.renamed', { old: previous, name: kept }) };` — R7, o patch do nome.
17. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — as recusas de R3 e R4 seguem por aqui.
18. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish] a recusa é publicada.
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — [escreve: EST-L01-030 via applyPatches] o nome novo entra no documento.
20. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — [escreve: EST-L01-032 via record] o passo entra na história.
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
23. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
24. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/nodes/names.ts:17` `if (!found)` — o nó que a porta nomeou não está no documento: lança (defeito da porta); está: segue.
- R2 `src/core/nodes/names.ts:18` `if (typeof name !== 'string')` — o argumento não é texto: lança (defeito da porta); é: segue.
- R3 `src/core/nodes/names.ts:21` `if (found.parent === null)` — a raiz da página: `refused` com `status.rename.root`; outro nó: segue.
- R4 `src/core/nodes/names.ts:23` `if (locked !== null)` — o nó ou um ancestral carrega o bloqueio: `refused` com a mensagem do bloqueio (`lockRefusal`); livre: segue.
- R5 `src/core/nodes/names.ts:26` `if (kept === '')` — nome vazio: `change` só com `status.rename.empty`, sem patch; preenchido: segue.
- R6 `src/core/nodes/names.ts:27` `if (kept === previous)` — nome igual ao atual: `change` sem patch nem mensagem; diferente: segue.
- R7 `src/core/nodes/names.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...found.path, 'name'], value: kept }], message: message('status.renamed', { old: previous, name: kept }) };` — o nome do nó é trocado e a barra de status diz o de antes e o novo.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/nodes/names.ts:14` `export const renameCommand = registerHandler('element.rename', ({ state }, { target, name }) => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento e o nó, via argumentRefusal, locate, lockRefusal), EST-L05a-001 (a digitação pendente, via `beforeCommand`).
- escreve: EST-L01-030 (o `name` do nó no documento, via applyPatches, commit, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (a história, via record), EST-L01-033 (a mensagem, via publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish).

## Resultado

- **Estado final:** EST-L01-030 — o caminho `[...found.path, 'name']` do nó recebe o nome aparado (`src/core/nodes/names.ts:28`); no nome vazio (R5) e no igual (R6) nada muda no documento.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha de Camadas volta a desenhar o nome (o rename termina) (`src/editor/shell/sidebar/layers.tsx:307` `{renaming ? (`).
- **DOM do canvas:** o rótulo do elemento mostra o nome novo (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras

- G1: n/a — o comando escreve o nome do nó, fora de qualquer camada de estilo (`src/core/nodes/names.ts:28`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/nodes/names.ts:14` `export const renameCommand = registerHandler('element.rename', ({ state }, { target, name }) => {` — o único tratador do comando; a porta entrega o mesmo par `{ target, name }`.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/nodes/names.ts:28`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/nodes/names.ts:28`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/nodes/names.ts:28`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/nodes/names.ts:14`).

## Medições

- nenhuma
