# TRC-grid.setSettings

- **Chamada:** `src/app/commands.ts:468` `'grid.setSettings': setGridSettings,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ grid, setting, value }` (`manifest/commands/view.json:2194` `"args": {`), com o campo `grid` (enum `columns`/`rows`/`dots`, `manifest/commands/view.json:2195` `"grid": {`), o campo `setting` (enum, `manifest/commands/view.json:2204` `"setting": {`) e o campo `value` (tipo `number`, `manifest/commands/view.json:2216` `"value": {`); cada porta envia a grade que ela edita `manifest/commands/view.json:2263` `"grid": "columns"`.
- **Ramos que dependem dos argumentos:** R3 depende de `grid` e `setting` (se a grade tem esse ajuste); R5 depende de `value` (se ele cabe no intervalo).

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'grid.setSettings'`; o argumento é `{ grid, setting, value }`.
2. `src/core/page/grid.ts:84` `export const setGridSettings = registerHandler('grid.setSettings', ({ state, rules, words }, { grid, setting, value }): Outcome<never> => {` — o tratador de `grid.setSettings`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
3. `src/core/store/store.ts:378` `rules: layered,` — as regras por camada que o tratador recebe, com a camada em vigor em `rules.base`.
4. `src/core/store/store.ts:379` `words: (key, params) => options.words(ui, key, params),` — as palavras do catálogo no idioma da pessoa.
5. `src/core/page/grid.ts:86` `const facts = settingOf(grid, setting);` — os fatos do ajuste pedido.
6. `src/core/page/grid.ts:87` `const page = pageShown(state);` — a página que o editor mostra. [lê: EST-L01-030 via pageShown] [lê: EST-L01-037 via pageShown]
7. `src/core/page/grid.ts:88` `if (facts === undefined) return { kind: 'refused', message: argumentRefused('setting') };` — R3.
8. `src/core/page/grid.ts:89` `if (page === undefined) throw new Error('grid: the document has no page');` — R4.
9. `src/core/page/grid.ts:91` `const [min, max] = pairConstant(facts.range);` — o intervalo aceito do ajuste.
10. `src/core/page/grid.ts:92` `const next = setting === 'count' ? Math.round(value) : value;` — R6: uma contagem de colunas é arredondada; os demais valores ficam como digitados.
11. `src/core/page/grid.ts:93` `if (!Number.isFinite(next) || next < min || next > max) return { kind: 'refused', message: message('status.grid.outOfRange', { setting: label, min, max }) };` — R5.
12. `src/core/page/grid.ts:94` `const breakpoint = rules.base.breakpoint;` — a escrita pousa no ponto de quebra em vigor. [lê: EST-L01-030 via handlerContext]
13. `src/core/page/grid.ts:96` `const said = breakpoint === rules.baseLayer.breakpoint || shown === undefined ? message('status.grid.set', { setting: label, value: next }) : message('status.grid.setAt', { setting: label, value: next, breakpoint: breakpointName(shown, words) });` — R7: no ponto de quebra base, a mensagem é simples; em outro, ela nomeia o ponto de quebra.
14. `src/core/page/grid.ts:98` `const held = page.tree.grid;` — as grades já guardadas na página. [lê: EST-L01-030 via handlerContext]
15. `src/core/page/grid.ts:99` `const at = (held?.[grid] as Readonly<Record<string, Readonly<Record<string, number>>>> | undefined)?.[breakpoint];` — o registro da grade no ponto de quebra.
16. `src/core/page/grid.ts:100` `if (at?.[setting] === next) return { kind: 'change', message: said };` — R8: valor igual ao guardado, devolve `change` sem remendo.
17. `src/core/page/grid.ts:101` `const settings = { ...held, [grid]: { ...held?.[grid], [breakpoint]: { ...at, [setting]: next } } };` — as grades com o ajuste novo.
18. `src/core/page/grid.ts:103` `return { kind: 'change', patches: [held === undefined ? { op: 'add', path, value: settings } : { op: 'replace', path, value: settings }], message: said };` — R9: sem grades guardadas, o remendo acrescenta; com elas, substitui. [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o remendo ao documento. [escreve: EST-L01-030 via applyPatches]
20. `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — o remendo muda o documento.
21. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico como um passo. [escreve: EST-L01-032 via record]
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]
24. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-002 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/core/page/grid.ts:84` `export const setGridSettings = registerHandler('grid.setSettings', ({ state, rules, words }, { grid, setting, value }): Outcome<never> => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `grid.setSettings` é `always` `manifest/commands/view.json:2223` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/page/grid.ts:88` `if (facts === undefined) return { kind: 'refused', message: argumentRefused('setting') };` — a grade não tem esse ajuste: o comando é recusado com a mensagem do argumento `setting`; com um ajuste válido, o caminho segue para `src/core/page/grid.ts:91` `const [min, max] = pairConstant(facts.range);`.
- R4 `src/core/page/grid.ts:89` `if (page === undefined) throw new Error('grid: the document has no page');` — sem página aberta no documento, o tratador lança; com página, o caminho segue.
- R5 `src/core/page/grid.ts:93` `if (!Number.isFinite(next) || next < min || next > max) return { kind: 'refused', message: message('status.grid.outOfRange', { setting: label, min, max }) };` — fora do intervalo do ajuste: o comando é recusado com `status.grid.outOfRange`; dentro dele, o caminho segue para `src/core/page/grid.ts:100` `if (at?.[setting] === next) return { kind: 'change', message: said };`.
- R6 `src/core/page/grid.ts:92` `const next = setting === 'count' ? Math.round(value) : value;` — `setting` igual a `count`: o valor é arredondado para um inteiro; os demais: o valor fica como digitado.
- R7 `src/core/page/grid.ts:96` `const said = breakpoint === rules.baseLayer.breakpoint || shown === undefined ? message('status.grid.set', { setting: label, value: next }) : message('status.grid.setAt', { setting: label, value: next, breakpoint: breakpointName(shown, words) });` — no ponto de quebra base, a mensagem é `status.grid.set`; em outro ponto de quebra, `status.grid.setAt` nomeia-o.
- R8 `src/core/page/grid.ts:100` `if (at?.[setting] === next) return { kind: 'change', message: said };` — valor já guardado igual ao pedido: devolve `change` sem remendo (nada muda no documento); diferente, o caminho segue para `src/core/page/grid.ts:103` `return { kind: 'change', patches: [held === undefined ? { op: 'add', path, value: settings } : { op: 'replace', path, value: settings }], message: said };`.
- R9 `src/core/page/grid.ts:103` `return { kind: 'change', patches: [held === undefined ? { op: 'add', path, value: settings } : { op: 'replace', path, value: settings }], message: said };` — sem `tree.grid` na página, o remendo é `op: 'add'`; com ele, `op: 'replace'`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-030 (a página e as suas grades em `page.tree.grid`, via handlerContext, pageShown), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via pageShown), EST-L01-002 (os ouvintes, via publish)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via run, publish)

## Resultado

- **Estado final:** EST-L01-030 com `pages[at].tree.grid[grid][breakpoint][setting]` no valor pedido, ou sem mudança quando o valor já era esse `src/core/page/grid.ts:103` `patches: [held === undefined ? { op: 'add', path, value: settings } : { op: 'replace', path, value: settings }]`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; o campo do diálogo relê o ajuste `src/editor/shell/guides-grids.tsx:130` `const value = useEditorState((s) => gridSetting(s.document, grid, setting, activeBreakpoint(s).id, openedPage(s)));`.
- **DOM do editor:** o campo do diálogo mostra o valor guardado no ponto de quebra em vigor `src/editor/shell/guides-grids.tsx:130` `const value = useEditorState((s) => gridSetting(s.document, grid, setting, activeBreakpoint(s).id, openedPage(s)));`.
- **DOM do canvas:** as faixas da grade são redesenhadas com o ajuste novo pela leitura `src/editor/canvas/grid-overlay.tsx:35` `const settings = useEditorState((s) => JSON.stringify({ columns: columnsOf(s.document, breakpoint, openedPage(s)), rows: rowsOf(s.document, breakpoint, openedPage(s)), dots: dotsOf(s.document, breakpoint, openedPage(s)) }));`.

## Regras

- G1: n/a — a escrita pousa no ponto de quebra do contexto em vigor, mas fora de qualquer classe de estilo; o tratador só monta o remendo das grades `src/core/page/grid.ts:103` `patches: [held === undefined ? { op: 'add', path, value: settings } : { op: 'replace', path, value: settings }]`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as três portas de `grid.setSettings` (os campos de ajustes de colunas, de linhas e de pontos) chegam à tabela `src/app/commands.ts:468` `'grid.setSettings': setGridSettings,` e enviam só a grade, o ajuste e o valor `manifest/commands/view.json:2263` `"grid": "columns"`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador só monta o remendo `src/core/page/grid.ts:103` `patches: [held === undefined ? { op: 'add', path, value: settings } : { op: 'replace', path, value: settings }]`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o ajuste `src/core/page/grid.ts:101` `const settings = { ...held, [grid]: { ...held?.[grid], [breakpoint]: { ...at, [setting]: next } } };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando escreve as grades da página no documento; a igualdade entre render incremental e render do zero é do renderizador `src/core/store/store.ts:321` `if (next.document !== before.document) {`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento novo é validado antes de publicar e `manifest/commands/view.json:2231` `"undoable": true,` assenta o passo no histórico.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/core/page/grid.ts:84` `export const setGridSettings = registerHandler('grid.setSettings', ({ state, rules, words }, { grid, setting, value }): Outcome<never> => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o intervalo vem do manifesto `src/core/page/grid.ts:91` `const [min, max] = pairConstant(facts.range);`.
