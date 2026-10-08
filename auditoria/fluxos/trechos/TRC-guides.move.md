# TRC-guides.move

- **Chamada:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ guide, at, delta, along, modifier }` (`manifest/commands/view.json:2433` `"args": {`), com os campos `guide` (`manifest/commands/view.json:2434` `"guide": {`), `at` (opcional, `manifest/commands/view.json:2440` `"at": {`), `delta` (opcional, `manifest/commands/view.json:2445` `"delta": {`), `along` (opcional, `manifest/commands/view.json:2450` `"along": {`) e `modifier` (opcional, `manifest/commands/view.json:2458` `"modifier": {`); o tratador não lê `modifier` `src/core/page/guides.ts:56` `export const moveGuideCommand = registerHandler('guides.move', ({ state }, { guide, at, delta, along }): Outcome<never> => {`.
- **Ramos que dependem dos argumentos:** R3 depende de `guide`; R4 depende de `at`, `delta` e `along`; os demais leem o estado.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'guides.move'`; o argumento é `{ guide, at, delta, along, modifier }`.
2. `src/core/page/guides.ts:56` `export const moveGuideCommand = registerHandler('guides.move', ({ state }, { guide, at, delta, along }): Outcome<never> => {` — o tratador de `guides.move`. [lê: EST-L01-030 via handlerContext]
3. `src/core/page/guides.ts:57` `const page = openedPage(state);` — a página que o editor mostra. [lê: EST-L01-030 via openedPage]
4. `src/core/page/guides.ts:58` `const held = found(state.document, page, guide);` — a guia que o argumento nomeia na página aberta. [lê: EST-L01-030 via found]
5. `src/core/page/guides.ts:39` `function found(document: DocumentJson, page: number, id: string): Guide | null {` — a guia pelo id na página.
6. `src/core/page/guides.ts:40` `return guidesOf(document, page).find((g) => g.id === id) ?? null;` — a guia procurada ou `null`. [lê: EST-L01-030 via found]
7. `src/core/page/guides.ts:42` `const stale: Outcome<never> = { kind: 'refused', message: message('status.stale') };` — a recusa da porta vencida.
8. `src/core/page/guides.ts:59` `if (held === null) return stale;` — R3.
9. `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };` — R4.
10. `src/core/page/guides.ts:54` `const alongOf = (guide: Guide): Guide['axis'] => (guide.axis === 'horizontal' ? 'vertical' : 'horizontal');` — o eixo em que uma guia se move; a tecla do outro eixo não a move.
11. `src/core/page/guides.ts:62` `if (held.locked === true) return { kind: 'refused', message: message('status.guides.locked') };` — R5.
12. `src/core/page/guides.ts:63` `const next = place(at ?? held.at + (delta ?? 0));` — o lugar novo: o `at`, ou o atual mais o passo `delta`, preso a zero ou mais.
13. `src/core/page/guides.ts:65` `if (next === held.at) return { kind: 'change', message: said };` — R6.
14. `src/core/page/guides.ts:66` `const list = guidesOf(state.document, page).map((g) => (g.id === guide ? { ...g, at: next } : g));` — a lista de guias com a guia movida. [lê: EST-L01-030 via guidesOf]
15. `src/core/page/guides.ts:67` `return { kind: 'change', patches: [guidesPatch(state.document, page, list)], message: said };` — o `Outcome` com o remendo da lista nova. [escreve: EST-L01-030 via run]
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo ao documento. [escreve: EST-L01-030 via run]
17. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — o remendo muda o documento.
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como um passo. [escreve: EST-L01-032 via run]
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
21. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/core/page/guides.ts:56` `export const moveGuideCommand = registerHandler('guides.move', ({ state }, { guide, at, delta, along }): Outcome<never> => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `guides.move` é `always` `manifest/commands/view.json:2467` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/page/guides.ts:59` `if (held === null) return stale;` — a guia não está na página aberta (uma porta vencida): devolve `stale`, a recusa `status.stale`; estando, o caminho segue para `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };`.
- R4 `src/core/page/guides.ts:61` `if (at === undefined && (delta === undefined || (along !== undefined && along !== alongOf(held)))) return { kind: 'change' };` — sem `at`, e sem `delta` ou com um `along` diferente do eixo de movimento da guia: devolve `change` sem remendo (a tecla do outro eixo não move); com um movimento válido, o caminho segue para `src/core/page/guides.ts:62` `if (held.locked === true) return { kind: 'refused', message: message('status.guides.locked') };`.
- R5 `src/core/page/guides.ts:62` `if (held.locked === true) return { kind: 'refused', message: message('status.guides.locked') };` — a guia travada: o comando é recusado com `status.guides.locked`; solta, o caminho segue para `src/core/page/guides.ts:63` `const next = place(at ?? held.at + (delta ?? 0));`.
- R6 `src/core/page/guides.ts:65` `if (next === held.at) return { kind: 'change', message: said };` — o lugar novo igual ao atual: devolve `change` sem remendo; diferente, o caminho segue para `src/core/page/guides.ts:66` `const list = guidesOf(state.document, page).map((g) => (g.id === guide ? { ...g, at: next } : g));`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (as guias da página em `document.pages[page].tree.guides`)
- escreve: EST-L01-030 (o documento)

## Resultado

- **Estado final:** EST-L01-030 com a guia nomeada em `pages[page].tree.guides` no lugar novo `src/core/page/guides.ts:67` `return { kind: 'change', patches: [guidesPatch(state.document, page, list)], message: said };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; as guias relêem a lista `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.
- **DOM do editor:** nada do editor muda além do status bar, que mostra a mensagem da store `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));`.
- **DOM do canvas:** a guia é redesenhada no lugar novo pela leitura `src/editor/canvas/guides.tsx:20` `const guides = useEditorState((s) => (s.ui.preferences.guidesHidden === true ? NONE : guidesOf(s.document, openedPage(s))));`.

## Regras

- G1: n/a — o comando escreve as guias da página, fora de qualquer camada de estilo; o tratador só monta o remendo `src/core/page/guides.ts:67` `patches: [guidesPatch(state.document, page, list)]`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as portas de `guides.move` (o arraste da guia e as quatro teclas de seta no contexto da guia) chegam à tabela `src/app/commands.ts:470` `'guides.move': moveGuideCommand,` e enviam só o lugar ou o passo e o eixo `src/core/page/guides.ts:56` `({ state }, { guide, at, delta, along }): Outcome<never> => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador só monta o remendo `src/core/page/guides.ts:67` `return { kind: 'change', patches: [guidesPatch(state.document, page, list)], message: said };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a lista `src/core/page/guides.ts:66` `const list = guidesOf(state.document, page).map((g) => (g.id === guide ? { ...g, at: next } : g));`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando move uma guia no documento; a igualdade entre render incremental e render do zero é do renderizador `src/core/store/store.ts:321` `if (next.document !== before.document) {`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar e `manifest/commands/view.json:2475` `"undoable": true,` assenta o passo no histórico.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/core/page/guides.ts:56` `export const moveGuideCommand = registerHandler('guides.move', ({ state }, { guide, at, delta, along }): Outcome<never> => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o passo `delta` vem do argumento `src/core/page/guides.ts:63` `const next = place(at ?? held.at + (delta ?? 0));`.
