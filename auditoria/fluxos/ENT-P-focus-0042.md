# ENT-P-focus-0042 — focus.nextRegion pela porta key-f6-in-field

- **Comando:** focus.nextRegion
- **Porta:** `manifest/commands/focus.json:985` `"id": "key-f6-in-field",`
- **Gatilho:** `manifest/commands/focus.json:988` `"chord": "F6",`
- **Contexto:** `manifest/commands/focus.json:989` `"context": "field",`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Tratador:** `src/app/commands.ts:320` `'focus.nextRegion': focusNextRegion,`
- **Trecho:** TRC-focus.nextRegion

## Passos
1. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla do acorde `F6` no contexto `field` roda o comando que a ligação resolve; como `focus.nextRegion` não toma argumento de tipo `clipboard`, a guarda é verdadeira e o despacho acontece já.
2. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — o despacho desta tecla é o da store do editor: sem gesto de ponteiro e sem ser uma tecla digitada do canvas, os dois primeiros membros são nulos e `dispatch` é `store.dispatch`.
3. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando (G2). [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o comando segue para o `dispatch` da store do núcleo.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` procura o tratador do comando na tabela da fiação.
9. `src/app/commands.ts:320` `'focus.nextRegion': focusNextRegion,` — a linha da tabela liga `focus.nextRegion` ao tratador `focusNextRegion`; é por ela que o comando entra no trecho TRC-focus.nextRegion.

## Ramos
- R1 `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — com um gesto de ponteiro aberto o despacho seria o do gesto; com uma tecla digitada do canvas (`typedKey`), o da rajada; nenhum dos dois vale para esta tecla (o contexto `field` não está em `CHOSEN_CONTEXTS` e não há gesto aberto), então o despacho é `store.dispatch`.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o comando roda já pelo `dispatch` do núcleo; com um gesto aberto e um comando que não muda o documento, rodaria pelo gesto (`src/editor/store.ts:241` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R3 `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` devolve o contexto da digitação quando o comando é o do próprio campo (`src/editor/input/pending.ts:79`), deixa a digitação como está quando o foco está dentro do campo e o comando não muda o documento (`src/editor/input/pending.ts:81`), e grava a digitação antes nos demais casos (`src/editor/input/pending.ts:82` `keepTyping();`).

## Fronteiras assíncronas
- nenhuma: o caminho da porta é síncrono — `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` chama o `dispatch` da store, que roda o tratador no mesmo despacho (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); não há espera, timer nem ouvinte nos passos.

## Estado
- lê: EST-L05a-001
- escreve: EST-L05a-001 (a digitação pendente é gravada antes, via `keepTyping` dentro de `beforeCommand`)

## Resultado
- **Estado final:** a porta entrega o comando ao tratador do trecho TRC-focus.nextRegion; o estado final é o que aquele trecho registra — `ui.focus.request` na requisição `{ move: 'nextRegion', count: n+1 }` (`src/editor/focus/focus.ts:22` `export const asking = (ui: EditorUi, move: FocusMove): EditorUi`).
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o trecho leva a requisição ao foco do DOM (`src/editor/focus/focus.ts:253` `carryOut(store, request.move, document.activeElement);`), que põe o foco na próxima região desenhada (`src/editor/focus/focus.ts:217` `focusRegion(region);`); nenhum elemento é desenhado pelo caminho da porta.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; o caminho da porta só entrega o comando (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando, salvo com o foco dentro do próprio campo (`src/editor/input/pending.ts:81`) ou com o comando do próprio campo (`src/editor/input/pending.ts:79`).
- G3: ok — as 2 portas de `focus.nextRegion` chegam à mesma tabela (`src/app/commands.ts:320` `'focus.nextRegion': focusNextRegion,`) e mandam só a intenção; esta porta não decide por conta própria.
- G4: n/a — o caminho da porta não desenha elemento algum sobre o canvas (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`).
- G5: n/a — o caminho da porta não desenha nem mede painel, barra ou rótulo.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:495`).
- INT: ok — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`).

## Limpeza
- Nenhum ouvinte, timer ou observador é criado nos passos desta porta; não há remoção a citar. Os ouvintes de teclado do keymap são criados por `installKeymap` (`src/editor/input/keymap.ts:587` `target.addEventListener('keydown', onKeyDown);`) e a instalação devolve a remoção (`src/editor/input/keymap.ts:592` `target.removeEventListener('keydown', onKeyDown);`), fora do caminho desta porta.

## Medições
- nenhuma: os passos desta porta não leem nem calculam valor do navegador; o despacho e a tabela correm antes do trecho.

## Ramos do trecho
- **Trecho:** TRC-focus.nextRegion
- **Argumentos enviados:** `{}` — a porta não envia campo nomeado: o `args` do comando é vazio (`manifest/commands/focus.json:953` `"args": {},`) e a porta não acrescenta nada (`manifest/commands/focus.json:1002` `"args": {}`).
- nenhum ramo do trecho depende dos argumentos: o trecho o registra (`auditoria/fluxos/trechos/TRC-focus.nextRegion.md:5` `- **Ramos que dependem dos argumentos:** nenhum`); os valores que esta porta envia deixam todos os ramos do trecho pelo mesmo lado.
