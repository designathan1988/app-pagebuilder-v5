# TRC-view.selectTool

- **Chamada:** `src/app/commands.ts:450` `'view.selectTool': selectTool,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:3265` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:3265` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.selectTool'`; o argumento é o objeto vazio.
2. `src/editor/view/select-tool.ts:24` `export const selectTool = registerHandler<'view.selectTool', EditorUi>(` — o tratador de `view.selectTool`.
3. `src/editor/view/select-tool.ts:26` `({ state }) => (otherTool(state.ui) ? { kind: 'change', ui: selecting(state.ui), message: message('status.tool.select') } : { kind: 'change', message: message('status.tool.select') }),` — R3: com outra ferramenta em uso, devolve o estado com a Select acesa; sem, só a mensagem. [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/select-tool.ts:22` `const otherTool = (ui: EditorUi): boolean => Object.keys(ui.modules ?? {}).length > 0 || ui.gridEdit !== undefined;` — há outra ferramenta quando um módulo guarda estado ou o modo de edição de grade está aberto.
5. `src/editor/view/select-tool.ts:12` `function selecting(ui: EditorUi): EditorUi {` — o estado do editor sem ferramenta nenhuma além da Select.
6. `src/editor/view/select-tool.ts:13` `const { modules, gridEdit: _gridEdit, ...rest } = ui;` — tira os módulos e o modo de edição de grade do estado. [lê: EST-L01-037 via selecting]
7. `src/editor/view/select-tool.ts:16` `const opened = states.some((state) => state.layers === true) ? showPanel(rest, 'layers') : rest;` — R4: um módulo que tinha aberto as Camadas devolve o painel.
8. `src/editor/view/select-tool.ts:19` `return showing === undefined ? opened : showPanel(opened, (typeof showing.back === 'string' ? showing.back : 'explorer') as Parameters<typeof showPanel>[1]);` — R5: a vista que a barra lateral mostrava antes volta (a Explorer por omissão).
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo (no R3 com ferramenta) ou a mensagem nova tornam `changed` verdadeiro.
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
12. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/select-tool.ts:24` `export const selectTool = registerHandler<'view.selectTool', EditorUi>(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.selectTool` é `always` `manifest/commands/view.json:3267` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/select-tool.ts:26` `({ state }) => (otherTool(state.ui) ? { kind: 'change', ui: selecting(state.ui), message: message('status.tool.select') } : { kind: 'change', message: message('status.tool.select') }),` — com outra ferramenta em uso `otherTool(state.ui)` verdadeiro: devolve o estado do editor sem ela `src/editor/view/select-tool.ts:12` `function selecting(ui: EditorUi): EditorUi {`; sem outra ferramenta: devolve só a mensagem `status.tool.select`.
- R4 `src/editor/view/select-tool.ts:16` `const opened = states.some((state) => state.layers === true) ? showPanel(rest, 'layers') : rest;` — um módulo que tinha aberto as Camadas (`layers === true`): o painel volta a abrir; nenhum: as preferências de painel ficam como estão.
- R5 `src/editor/view/select-tool.ts:19` `return showing === undefined ? opened : showPanel(opened, (typeof showing.back === 'string' ? showing.back : 'explorer') as Parameters<typeof showPanel>[1]);` — um módulo que mostrava uma vista da barra lateral: ela volta (`back`, ou a Explorer); nenhum: fica o que `opened` deixou.
- R6 `src/editor/view/select-tool.ts:27` `(state) => !otherTool(state.ui),` — o botão Select aparece marcado quando nenhuma outra ferramenta está em uso; com uma delas, não.
- R7 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — com outra ferramenta, `next.ui !== before.ui` é verdadeiro `src/editor/view/select-tool.ts:26` `ui: selecting(state.ui)` e o estado é publicado em `src/core/store/store.ts:320` `state = next;`; sem, só a mensagem muda e o estado é publicado com a mensagem nova.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, selecting, publish)
- escreve: EST-L01-037 (o estado do editor, via run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 sem `ui.modules` nem `ui.gridEdit`, com o painel das Camadas e a vista da barra lateral devolvidos `src/editor/view/select-tool.ts:19` `return showing === undefined ? opened : showPanel(opened, (typeof showing.back === 'string' ? showing.back : 'explorer') as Parameters<typeof showPanel>[1]);`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** o botão Select aparece marcado pelo predicado `src/editor/view/select-tool.ts:27` `(state) => !otherTool(state.ui),`; o modo de edição de grade fecha pela leitura `src/editor/canvas/grid-editor.tsx:25` `const editing = useEditorState((s) => gridEditOf(s.ui));`.
- **DOM do canvas:** as camadas que os módulos desenham sobre a página somem com eles `src/editor/canvas/frame.tsx:270` `{wiring().canvasLayers.map((Layer, i) => (`; o documento não muda e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava o estado do editor sem outra ferramenta `src/editor/view/select-tool.ts:13` `const { modules, gridEdit: _gridEdit, ...rest } = ui;`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as duas portas de `view.selectTool` (o botão da barra do canvas e a tecla V) chegam à tabela `src/app/commands.ts:450` `'view.selectTool': selectTool,` e mandam só a intenção de escolher a Select `src/editor/view/select-tool.ts:26` `({ state }) => (otherTool(state.ui) ? { kind: 'change', ui: selecting(state.ui), message: message('status.tool.select') } : { kind: 'change', message: message('status.tool.select') }),`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/select-tool.ts:19` `return showing === undefined ? opened : showPanel(opened, (typeof showing.back === 'string' ? showing.back : 'explorer') as Parameters<typeof showPanel>[1]);`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só devolve o estado do editor `src/editor/view/select-tool.ts:13` `const { modules, gridEdit: _gridEdit, ...rest } = ui;`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/select-tool.ts:24` `export const selectTool = registerHandler<'view.selectTool', EditorUi>(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a ferramenta em uso vem de `ui.modules` e `ui.gridEdit` `src/editor/view/select-tool.ts:22` `const otherTool = (ui: EditorUi): boolean => Object.keys(ui.modules ?? {}).length > 0 || ui.gridEdit !== undefined;`.
