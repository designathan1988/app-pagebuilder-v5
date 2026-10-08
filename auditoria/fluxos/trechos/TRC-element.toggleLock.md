# TRC-element.toggleLock

- **Chamada:** `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`
- **Argumentos:** o tratador recebe `HandlerContext` e os argumentos `{ target }` (`manifest/commands/nodes.json:263` `"args": {`), com `target` (tipo `node`, opcional).
- **Ramos que dependem dos argumentos:** R1 (com `target` o nó é o nomeado; sem ele, o primeiro selecionado).

## Passos

1. `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,` — a tabela liga o id ao tratador.
2. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — [lê: EST-L05a-001 via beforeCommand] a digitação pendente é gravada antes.
3. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `targetOrSelection` é lida antes do tratador (`src/core/selection/selection.ts:16` `export const targetOrSelection = registerPredicate('targetOrSelection', (state, _rules, args) => {`) [lê: EST-L01-030 via run] [lê: EST-L01-031 via run].
4. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
5. `src/core/nodes/flags.ts:129` `export const toggleLockCommand = registerHandler(` — o tratador.
6. `src/core/nodes/flags.ts:131` `  ({ state }, { target }): Outcome<never> => {` — recebe `target`.
7. `src/core/nodes/flags.ts:132` `    const at = flagged(state.document, state.selection, target);` — [lê: EST-L01-030 via flagged] [lê: EST-L01-031 via flagged] o nó que a porta age sobre.
8. `src/core/nodes/flags.ts:100` `function flagged(document: DocumentJson, selection: Selection, target: unknown): Location | null {` — onde o nó é decidido.
9. `src/core/nodes/flags.ts:101` `  const id = typeof target === 'string' ? (target as NodeId) : selection[0];` — R1.
10. `src/core/nodes/flags.ts:102` `  return id === undefined ? null : locate(document, id);` — [lê: EST-L01-030 via locate]
11. `src/core/nodes/flags.ts:135` `    if (at === null) throw new Error(` — R2.
12. `src/core/nodes/flags.ts:136` `    if (at.parent === null) return { kind: 'refused', message: message('status.lock.root') };` — R3.
13. `src/core/nodes/flags.ts:137` `    const locked = ancestorLockRefusal(state.document, at.node.id);` — [lê: EST-L01-030 via ancestorLockRefusal]
14. `src/core/nodes/flags.ts:95` `  const lock = chain.slice(0, -1).find((n) => n.locked === true);` — o bloqueio acima do nó, sem o próprio.
15. `src/core/nodes/flags.ts:138` `    if (locked !== null) return { kind: 'refused', message: locked };` — R4.
16. `src/core/nodes/flags.ts:139` `    return toggled(at, 'locked', 'status.locked', 'status.unlocked');` — o Outcome.
17. `src/core/nodes/flags.ts:106` `function toggled(at: Location, flag: 'hidden' | 'locked', on: MessageId, off: MessageId): Outcome<never> {` — monta o patch do flag.
18. `src/core/nodes/flags.ts:109` `  if (at.node[flag] === true) return { kind: 'change', patches: [{ op: 'remove', path }], message: message(off, { name }) };` — R5.
19. `src/core/nodes/flags.ts:110` `  return { kind: 'change', patches: [{ op: 'add', path, value: true }], message: message(on, { name }) };` — R5.
20. `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — as recusas de R3 e R4 seguem por aqui.
21. `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` — [escreve: EST-L01-033 via publish] [escreve: EST-L01-035 via publish] [escreve: EST-L01-036 via publish] a recusa é publicada, nada muda.
22. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — [escreve: EST-L01-030 via applyPatches] o flag entra no documento.
23. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — [escreve: EST-L01-032 via record] o passo entra na história.
24. `src/core/store/store.ts:551` `const committed = commit(next, id);` — [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
25. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
26. `src/core/store/store.ts:320` `state = next;` — [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
27. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/nodes/flags.ts:101` `const id = typeof target === 'string' ? (target as NodeId) : selection[0];` — com `target` texto, o nó é o que ele nomeia; sem, o primeiro da seleção.
- R2 `src/core/nodes/flags.ts:135` `if (at === null)` — sem `target` e sem seleção, ou um nó que o documento não tem: lança (defeito da porta); achado: segue.
- R3 `src/core/nodes/flags.ts:136` `if (at.parent === null)` — a raiz da página: `refused` com `status.lock.root`; outro nó: segue.
- R4 `src/core/nodes/flags.ts:138` `if (locked !== null)` — um ancestral carrega o bloqueio: `refused` com `status.locked.byAncestor`; sem: segue.
- R5 `src/core/nodes/flags.ts:109` `if (at.node[flag] === true)` — o nó já está trancado: um patch `remove` do flag; destrancado: um patch `add` com `true` (`src/core/nodes/flags.ts:110`).

## Fronteiras assíncronas

- nenhuma — o tratador devolve o `Outcome` numa chamada síncrona (`src/core/nodes/flags.ts:131` `  ({ state }, { target }): Outcome<never> => {`, sem `await`).

## Estado

- lê: EST-L01-030 (o documento, via run, flagged, locate, ancestorLockRefusal, commit), EST-L01-031 (a seleção, via run, flagged, commit), EST-L01-002 (os ouvintes, via publish), EST-L05a-001 (a digitação pendente, via `beforeCommand`).
- escreve: EST-L01-030 (o documento, via applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish), EST-L01-035 (a recusa, via publish), EST-L01-036 (o sinal de recusa, via publish).

## Resultado

- **Estado final:** EST-L01-030 — o flag `locked` do nó ganha `true` ou some (`src/core/nodes/flags.ts:109` e `src/core/nodes/flags.ts:110`); o resto do documento não muda.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:314`).
- **DOM do editor:** a linha de Camadas ganha ou solta a marca do trancado (`src/editor/shell/sidebar/layers.tsx:284` `node.locked === true ? ' row--locked' : ''`).
- **DOM do canvas:** nada muda — o renderizador marca só o nó oculto (`src/editor/canvas/render/render.ts:708` `if (node.hidden === true) wanted.set(HIDDEN_ATTRIBUTE, '');`).

## Regras

- G1: n/a — o comando escreve o flag `locked` do nó, fora de qualquer camada de estilo (`src/core/nodes/flags.ts:110`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/core/nodes/flags.ts:129` `export const toggleLockCommand = registerHandler(` — o único tratador do comando; toda porta entrega só `{ target }`.
- G4: n/a — o comando muda estado; não desenha nada sobre o canvas (`src/core/nodes/flags.ts:139`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/nodes/flags.ts:139`); as famílias de defeito de painel são medidas em Fase 6.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/nodes/flags.ts:110`); a igualdade entre render incremental e render do zero é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado antes de publicar.

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/nodes/flags.ts:129`).

## Medições

- nenhuma
