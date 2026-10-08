# TRC-guides.delete

- **Chamada:** `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ guide }` (`manifest/commands/view.json:2601` `"args": {`), com o campo `guide` (`manifest/commands/view.json:2602` `"guide": {`).
- **Ramos que dependem dos argumentos:** R3 depende de `guide` (se ele ainda existe na página aberta).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'guides.delete'`; o argumento é `{ guide }`.
2. `src/core/page/guides.ts:70` `export const deleteGuideCommand = registerHandler('guides.delete', ({ state }, { guide }): Outcome<never> => {` — o tratador de `guides.delete`. [lê: EST-L01-030 via handlerContext]
3. `src/core/page/guides.ts:71` `const page = openedPage(state);` — a página que o editor mostra. [lê: EST-L01-030 via openedPage]
4. `src/core/page/guides.ts:72` `if (found(state.document, page, guide) === null) return stale;` — R3.
5. `src/core/page/guides.ts:39` `function found(document: DocumentJson, page: number, id: string): Guide | null {` — a guia pelo id na página.
6. `src/core/page/guides.ts:73` `return { kind: 'change', patches: [guidesPatch(state.document, page, guidesOf(state.document, page).filter((g) => g.id !== guide))], message: message('status.guides.deleted') };` — o `Outcome` com o remendo da lista sem a guia. [lê: EST-L01-030 via guidesOf] [escreve: EST-L01-030 via run]
7. `src/core/page/guides.ts:23` `function guidesPatch(document: DocumentJson, page: number, next: readonly Guide[]): Patch {` — o remendo que faz as guias da página serem estas.
8. `src/core/page/guides.ts:26` `if (next.length === 0) return { op: 'remove', path: [...root, 'guides'] };` — R5: a última guia saindo, o campo `guides` sai da página.
9. `src/core/page/guides.ts:27` `return held === undefined ? { op: 'add', path: [...root, 'guides'], value: next } : { op: 'replace', path: [...root, 'guides'], value: next };` — R6: ainda havendo guias, o remendo substitui a lista.
10. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo ao documento. [escreve: EST-L01-030 via run]
11. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — o remendo muda o documento.
12. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como um passo. [escreve: EST-L01-032 via run]
13. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
15. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/core/page/guides.ts:70` `export const deleteGuideCommand = registerHandler('guides.delete', ({ state }, { guide }): Outcome<never> => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `guides.delete` é `always` `manifest/commands/view.json:2610` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/page/guides.ts:72` `if (found(state.document, page, guide) === null) return stale;` — a guia não está na página aberta (uma porta vencida): devolve `stale`; estando, o caminho segue para `src/core/page/guides.ts:73` `return { kind: 'change', patches: [guidesPatch(state.document, page, guidesOf(state.document, page).filter((g) => g.id !== guide))], message: message('status.guides.deleted') };`.
- R4 `src/core/page/guides.ts:42` `const stale: Outcome<never> = { kind: 'refused', message: message('status.stale') };` — a recusa `status.stale` é publicada pela store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`; o documento não é tocado.
- R5 `src/core/page/guides.ts:26` `if (next.length === 0) return { op: 'remove', path: [...root, 'guides'] };` — a última guia da página saindo: o remendo tira o campo `guides`.
- R6 `src/core/page/guides.ts:27` `return held === undefined ? { op: 'add', path: [...root, 'guides'], value: next } : { op: 'replace', path: [...root, 'guides'], value: next };` — ainda havendo guias e a página já tendo `guides`: o remendo substitui a lista (`op: 'replace'`).

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (as guias da página em `document.pages[page].tree.guides`)
- escreve: EST-L01-030 (o documento)

## Resultado

- **Estado final:** EST-L01-030 sem a guia nomeada em `pages[page].tree.guides` (ou sem o campo, na última) `src/core/page/guides.ts:26` `if (next.length === 0) return { op: 'remove', path: [...root, 'guides'] };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; as guias relêem a lista `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.
- **DOM do editor:** nada do editor muda além do status bar, que mostra a mensagem da store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`.
- **DOM do canvas:** a guia apagada some do desenho pela leitura `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.

## Regras

- G1: n/a — o comando escreve as guias da página, fora de qualquer camada de estilo; o tratador só monta o remendo `src/core/page/guides.ts:73` `patches: [guidesPatch(state.document, page, guidesOf(state.document, page).filter((g) => g.id !== guide))]`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as quatro portas de `guides.delete` (o arraste da guia para a própria régua, as teclas Delete e Backspace no contexto da guia e o botão do diálogo de guias e grelhas) chegam à tabela `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,` e enviam só o id da guia `src/core/page/guides.ts:70` `({ state }, { guide }): Outcome<never> => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador só monta o remendo `src/core/page/guides.ts:73` `return { kind: 'change', patches: [guidesPatch(state.document, page, guidesOf(state.document, page).filter((g) => g.id !== guide))], message: message('status.guides.deleted') };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a lista `src/core/page/guides.ts:73` `patches: [guidesPatch(state.document, page, guidesOf(state.document, page).filter((g) => g.id !== guide))]`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando tira uma guia do documento; a igualdade entre render incremental e render do zero é do renderizador `src/core/store/store.ts:321` `if (next.document !== before.document) {`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar e `manifest/commands/view.json:2616` `"undoable": true,` assenta o passo no histórico.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/core/page/guides.ts:70` `export const deleteGuideCommand = registerHandler('guides.delete', ({ state }, { guide }): Outcome<never> => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a guia vem do argumento `src/core/page/guides.ts:70` `export const deleteGuideCommand = registerHandler('guides.delete', ({ state }, { guide }): Outcome<never> => {`.
