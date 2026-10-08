# TRC-focus.previous

- **Chamada:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/focus.json:341` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/focus.json:341` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'focus.previous'`; o argumento é o objeto vazio.
2. `src/editor/focus/focus.ts:25` `export const focusPrevious = registerHandler<'focus.previous', EditorUi>('focus.previous', ({ state }) => ({ kind: 'change', ui: asking(state.ui, 'previous') }));` — o tratador lê o estado do editor e devolve `{ kind: 'change', ui }`. [lê: EST-L01-037 via handlerContext]
3. `src/editor/focus/focus.ts:22` `export const asking = (ui: EditorUi, move: FocusMove): EditorUi => ({ ...ui, focus: { request: { move, count: (ui.focus.request?.count ?? 0) + 1 } } });` — `asking` grava a requisição de foco `'previous'` e acrescenta um à contagem das requisições. [lê: EST-L01-037 via asking] [escreve: EST-L01-037 via asking]
4. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
5. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
6. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado; `src/core/store/store.ts:320` `state = next;` publica-o e `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` avisa os assinantes. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit] [escreve: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/focus/focus.ts:25` `export const focusPrevious = registerHandler<'focus.previous', EditorUi>('focus.previous', ({ state }) => ({ kind: 'change', ui: asking(state.ui, 'previous') }));`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `focus.previous` é `always` `manifest/commands/focus.json:343` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque `asking` devolve sempre um objeto de estado do editor novo `src/editor/focus/focus.ts:22` `focus: { request: { move, count: (ui.focus.request?.count ?? 0) + 1 } }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (o documento, via commit), EST-L01-031 (a seleção, via commit), EST-L01-037 (o estado do editor, via handlerContext, asking)
- escreve: EST-L01-037 (o estado do editor, via asking, run, publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.focus.request` em `{ move: 'previous', count: n+1 }` `src/editor/focus/focus.ts:22` `focus: { request: { move, count: (ui.focus.request?.count ?? 0) + 1 } }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; o instalador de foco lê a requisição nova `src/editor/focus/focus.ts:250` `const request = store.getState().ui.focus.request;`.
- **DOM do editor:** o instalador leva a requisição ao foco do DOM `src/editor/focus/focus.ts:253` `carryOut(store, request.move, document.activeElement);`, que para `'previous'` aciona o item anterior da região `src/editor/focus/focus.ts:243` `items[index]?.focus();`; nenhum elemento é desenhado pelo tratador.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a requisição de foco `src/editor/focus/focus.ts:25` `({ kind: 'change', ui: asking(state.ui, 'previous') })`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as dez portas de `focus.previous` chegam à tabela `src/app/commands.ts:316` `'focus.previous': focusPrevious,` e mandam só a intenção `'previous'` `src/editor/focus/focus.ts:25` `({ kind: 'change', ui: asking(state.ui, 'previous') })`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/focus/focus.ts:25` `({ kind: 'change', ui: asking(state.ui, 'previous') })`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a requisição `src/editor/focus/focus.ts:22` `focus: { request: { move, count: (ui.focus.request?.count ?? 0) + 1 } }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar. O `store.subscribe` do instalador de foco `src/editor/focus/focus.ts:249` `return store.subscribe(() => {` pertence ao instalador, fora deste trecho, e a sua remoção é a função devolvida por `src/editor/focus/focus.ts:247` `export function installFocus(store: EditorStore): () => void {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o foco do DOM é aplicado pelo instalador `src/editor/focus/focus.ts:253` `carryOut(store, request.move, document.activeElement);`.
