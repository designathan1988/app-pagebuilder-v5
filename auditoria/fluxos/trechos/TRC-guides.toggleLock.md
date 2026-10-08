# TRC-guides.toggleLock

- **Chamada:** `src/app/commands.ts:472` `'guides.toggleLock': toggleGuideLockCommand,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ guide }` (`manifest/commands/view.json:2716` `"args": {`), com o campo `guide` (`manifest/commands/view.json:2717` `"guide": {`).
- **Ramos que dependem dos argumentos:** R3 depende de `guide` (se ele ainda existe na página aberta).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'guides.toggleLock'`; o argumento é `{ guide }`.
2. `src/core/page/guides.ts:76` `export const toggleGuideLockCommand = registerHandler('guides.toggleLock', ({ state }, { guide }): Outcome<never> => {` — o tratador de `guides.toggleLock`. [lê: EST-L01-030 via handlerContext]
3. `src/core/page/guides.ts:77` `const page = openedPage(state);` — a página que o editor mostra. [lê: EST-L01-030 via openedPage]
4. `src/core/page/guides.ts:78` `const held = found(state.document, page, guide);` — a guia que o argumento nomeia. [lê: EST-L01-030 via found]
5. `src/core/page/guides.ts:39` `function found(document: DocumentJson, page: number, id: string): Guide | null {` — a guia pelo id na página.
6. `src/core/page/guides.ts:79` `if (held === null) return stale;` — R3.
7. `src/core/page/guides.ts:81` `if (g.id !== guide) return g;` — R5: só a guia nomeada é tocada.
8. `src/core/page/guides.ts:82` `if (held.locked === true) {` — R6: travada, a chave `locked` sai; solta, ela entra.
9. `src/core/page/guides.ts:83` `const { locked: _dropped, ...rest } = g;` — a guia sem a chave `locked`, para destravar.
10. `src/core/page/guides.ts:87` `return { ...g, locked: true };` — a guia com a chave `locked` em `true`, para travar.
11. `src/core/page/guides.ts:89` `return { kind: 'change', patches: [guidesPatch(state.document, page, list)], message: message(held.locked === true ? 'status.guides.unlocked' : 'status.guides.lockedNow') };` — o `Outcome` com o remendo da lista nova e a mensagem do que passou a valer. [escreve: EST-L01-030 via run]
12. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo ao documento. [escreve: EST-L01-030 via run]
13. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — o remendo muda o documento.
14. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como um passo. [escreve: EST-L01-032 via run]
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
17. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/core/page/guides.ts:76` `export const toggleGuideLockCommand = registerHandler('guides.toggleLock', ({ state }, { guide }): Outcome<never> => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `guides.toggleLock` é `always` `manifest/commands/view.json:2725` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/page/guides.ts:79` `if (held === null) return stale;` — a guia não está na página aberta (uma porta vencida): devolve `stale`; estando, o caminho segue para `src/core/page/guides.ts:80` `const list = guidesOf(state.document, page).map((g): Guide => {`.
- R4 `src/core/page/guides.ts:42` `const stale: Outcome<never> = { kind: 'refused', message: message('status.stale') };` — a recusa `status.stale` é publicada pela store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`; o documento não é tocado.
- R5 `src/core/page/guides.ts:81` `if (g.id !== guide) return g;` — uma guia que não é a nomeada é devolvida como está; só a nomeada é tocada `src/core/page/guides.ts:82` `if (held.locked === true) {`.
- R6 `src/core/page/guides.ts:82` `if (held.locked === true) {` — a guia travada tem a chave `locked` tirada `src/core/page/guides.ts:83` `const { locked: _dropped, ...rest } = g;` e a mensagem é `status.guides.unlocked`; solta, ganha a chave em `true` `src/core/page/guides.ts:87` `return { ...g, locked: true };` e a mensagem é `status.guides.lockedNow`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (as guias da página em `document.pages[page].tree.guides`)
- escreve: EST-L01-030 (o documento)

## Resultado

- **Estado final:** EST-L01-030 com a chave `locked` da guia nomeada invertida em `pages[page].tree.guides` `src/core/page/guides.ts:89` `return { kind: 'change', patches: [guidesPatch(state.document, page, list)], message: message(held.locked === true ? 'status.guides.unlocked' : 'status.guides.lockedNow') };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; as guias relêem a lista `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.
- **DOM do editor:** nada do editor muda além do status bar, que mostra a mensagem da store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`.
- **DOM do canvas:** a guia é redesenhada com ou sem a marca de travada pela leitura `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.

## Regras

- G1: n/a — o comando escreve as guias da página, fora de qualquer camada de estilo; o tratador só monta o remendo `src/core/page/guides.ts:89` `patches: [guidesPatch(state.document, page, list)]`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de `guides.toggleLock` (a tecla L no contexto da guia) chega à tabela `src/app/commands.ts:472` `'guides.toggleLock': toggleGuideLockCommand,` e manda só o id da guia `src/core/page/guides.ts:76` `({ state }, { guide }): Outcome<never> => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador só monta o remendo `src/core/page/guides.ts:89` `return { kind: 'change', patches: [guidesPatch(state.document, page, list)], message: message(held.locked === true ? 'status.guides.unlocked' : 'status.guides.lockedNow') };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a lista `src/core/page/guides.ts:80` `const list = guidesOf(state.document, page).map((g): Guide => {`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando muda a guia no documento; a igualdade entre render incremental e render do zero é do renderizador `src/core/store/store.ts:321` `if (next.document !== before.document) {`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar e `manifest/commands/view.json:2731` `"undoable": true,` assenta o passo no histórico.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/core/page/guides.ts:76` `export const toggleGuideLockCommand = registerHandler('guides.toggleLock', ({ state }, { guide }): Outcome<never> => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a guia e a sua trava vêm do documento e do argumento `src/core/page/guides.ts:78` `const held = found(state.document, page, guide);`.
