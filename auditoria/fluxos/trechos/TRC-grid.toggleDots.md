# TRC-grid.toggleDots

- **Chamada:** `src/app/commands.ts:466` `'grid.toggleDots': toggleDots,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:2072` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:2072` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'grid.toggleDots'`; o argumento é o objeto vazio.
2. `src/core/page/grid.ts:36` `export const toggleDots = registerHandler(` — o tratador de `grid.toggleDots`.
3. `src/core/page/grid.ts:38` `({ state }) => toggled(state, 'gridDots', 'status.grid.dotsShown', 'status.grid.dotsHidden'),` — inverte a grade de pontos da página. [lê: EST-L01-030 via toggled]
4. `src/core/page/grid.ts:19` `function toggled(state: { readonly document: DocumentJson; readonly ui?: unknown }, grid: Grid, shown: MessageId, hidden: MessageId): Outcome<never> {` — o interruptor de uma grade.
5. `src/core/page/grid.ts:20` `const at = openedPage(state);` — a página que o editor mostra. [lê: EST-L01-030 via toggled]
6. `src/core/page/grid.ts:21` `if (state.document.pages[at] === undefined) throw new Error('grid: the document has no page');` — R3.
7. `src/core/page/grid.ts:22` `const path = ['pages', at, 'tree', 'attributes', grid];` — o caminho do atributo da grade no documento.
8. `src/core/page/grid.ts:17` `export const gridShown = (state: { readonly document: DocumentJson; readonly ui?: unknown }, grid: Grid): boolean => pageShown(state)?.tree.attributes[grid] === true;` — a grade está à mostra quando o atributo é `true`. [lê: EST-L01-030 via gridShown]
9. `src/core/page/grid.ts:23` `return gridShown(state, grid) ? { kind: 'change', patches: [{ op: 'remove', path }], message: message(hidden) } : { kind: 'change', patches: [{ op: 'add', path, value: true }], message: message(shown) };` — R4: mostrada, o remendo tira o atributo; escondida, o remendo o acrescenta com `true`. [escreve: EST-L01-030 via toggled]
10. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo ao documento. [escreve: EST-L01-030 via run]
11. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — o remendo muda o documento.
12. `src/core/store/store.ts:527` `if (documentChanged && gesture === null && ownedGroup === null) {` — R6.
13. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como um passo. [escreve: EST-L01-032 via run]
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
15. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
16. `src/core/store/store.ts:320` `state = next;` — o estado é publicado. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
17. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/core/page/grid.ts:36` `export const toggleDots = registerHandler(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `grid.toggleDots` é `always` `manifest/commands/view.json:2074` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/page/grid.ts:21` `if (state.document.pages[at] === undefined) throw new Error('grid: the document has no page');` — sem página aberta no documento, o tratador lança; com página, o caminho segue para `src/core/page/grid.ts:23` `return gridShown(state, grid) ? { kind: 'change', patches: [{ op: 'remove', path }], message: message(hidden) } : { kind: 'change', patches: [{ op: 'add', path, value: true }], message: message(shown) };`.
- R4 `src/core/page/grid.ts:23` `return gridShown(state, grid) ? { kind: 'change', patches: [{ op: 'remove', path }], message: message(hidden) } : { kind: 'change', patches: [{ op: 'add', path, value: true }], message: message(shown) };` — o atributo `gridDots` sendo `true`, o comando o tira (`op: 'remove'`) e diz `status.grid.dotsHidden`; não sendo, o comando o acrescenta com `true` (`op: 'add'`) e diz `status.grid.dotsShown`.
- R5 `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — o tratador não devolve `refused` neste trecho; o lado da recusa não é tomado.
- R6 `src/core/store/store.ts:527` `if (documentChanged && gesture === null && ownedGroup === null) {` — fora de um gesto e de um grupo, a mudança vira uma entrada de histórico `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);`; dentro de um gesto ou grupo, os remendos entram no gesto (não neste trecho).
- R7 `src/core/store/store.ts:520` `if (documentChanged && !command.history.undoable) throw new Error(`${id} is not undoable in the manifest but changed the document`);` — `grid.toggleDots` é desfazível `manifest/commands/view.json:2080` `"undoable": true,`, então o lado do lançamento não é tomado.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (os atributos da página em `document.pages[at].tree.attributes`)
- escreve: EST-L01-030 (o documento), EST-L01-033 (a mensagem)

## Resultado

- **Estado final:** EST-L01-030 com `pages[at].tree.attributes.gridDots` em `true` ou sem a chave `src/core/page/grid.ts:23` `patches: [{ op: 'add', path, value: true }]`, dentro de um passo de histórico `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a sobreposição de grades relê o atributo `src/editor/canvas/grid-overlay.tsx:27` `const dots = useEditorState((s) => gridShown(s, 'gridDots'));`.
- **DOM do editor:** a porta do painel aparece marcada ou não pelo predicado `src/core/page/grid.ts:39` `(state) => gridShown(state, 'gridDots'),`.
- **DOM do canvas:** os pontos da grade de pontos são desenhados ou apagados pela leitura `src/editor/canvas/grid-overlay.tsx:27` `const dots = useEditorState((s) => gridShown(s, 'gridDots'));`.

## Regras

- G1: n/a — o comando escreve os atributos da página, fora de qualquer camada de estilo; o tratador só monta o remendo do atributo `src/core/page/grid.ts:23` `patches: [{ op: 'add', path, value: true }]`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as duas portas de `grid.toggleDots` (o controle do painel de ferramentas e o interruptor do diálogo de guias e grelhas) chegam à tabela `src/app/commands.ts:466` `'grid.toggleDots': toggleDots,` e mandam só a intenção de inverter `src/core/page/grid.ts:38` `({ state }) => toggled(state, 'gridDots', 'status.grid.dotsShown', 'status.grid.dotsHidden'),`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador só monta o remendo `src/core/page/grid.ts:23` `patches: [{ op: 'add', path, value: true }]`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o atributo `src/core/page/grid.ts:22` `const path = ['pages', at, 'tree', 'attributes', grid];`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando escreve o atributo da página no documento; a igualdade entre render incremental e render do zero é do renderizador `src/core/store/store.ts:321` `if (next.document !== before.document) {`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar e `src/core/store/store.ts:557` `if (documentChanged && gesture !== null) {` junta o remendo ao gesto quando houver.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/core/page/grid.ts:36` `export const toggleDots = registerHandler(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a página e o atributo vêm do documento `src/core/page/grid.ts:17` `export const gridShown = (state: { readonly document: DocumentJson; readonly ui?: unknown }, grid: Grid): boolean => pageShown(state)?.tree.attributes[grid] === true;`.
