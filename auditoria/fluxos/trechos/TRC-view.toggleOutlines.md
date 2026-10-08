# TRC-view.toggleOutlines

- **Chamada:** `src/app/commands.ts:459` `'view.toggleOutlines': toggleOutlines,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/view.json:1684` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/view.json:1684` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'view.toggleOutlines'`; o argumento é o objeto vazio.
2. `src/editor/view/overlays.ts:26` `export const toggleOutlines: RegisteredHandler<'view.toggleOutlines', EditorUi> = registerHandler(` — o tratador de `view.toggleOutlines`.
3. `src/editor/view/overlays.ts:28` `({ state }) => flip(state.ui, 'outlines', toggleOutlines.command),` — inverte o interruptor dos contornos no estado do editor. [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/overlays.ts:20` `function flip(ui: EditorUi, which: Switch, command: CommandId) {` — o interruptor invertido, com a mensagem do que passou a mostrar.
5. `src/editor/view/overlays.ts:13` `function flipped(ui: EditorUi, which: Switch): EditorUi {` — as preferências viradas.
6. `src/editor/view/overlays.ts:14` `const { [which]: on, ...rest } = ui.preferences;` — o valor atual do interruptor. [lê: EST-L01-037 via flipped]
7. `src/editor/view/overlays.ts:15` `return { ...ui, preferences: on === true ? rest : { ...rest, [which]: true } };` — R3: ligado, tira a chave; desligado, grava-a. [escreve: EST-L01-037 via flipped]
8. `src/editor/view/overlays.ts:23` `return { kind: 'change' as const, ui: next, message: switched(command, NEGATIVE.includes(which) ? !set : set) };` — o `Outcome` com o estado novo e a mensagem. [escreve: EST-L01-037 via flip]
9. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
10. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
11. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
12. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish]
13. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/overlays.ts:26` `export const toggleOutlines: RegisteredHandler<'view.toggleOutlines', EditorUi> = registerHandler(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `view.toggleOutlines` é `always` `manifest/commands/view.json:1686` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/overlays.ts:15` `return { ...ui, preferences: on === true ? rest : { ...rest, [which]: true } };` — com o interruptor ligado, a chave sai das preferências; desligado, ela entra com `true`.
- R4 `src/editor/view/overlays.ts:29` `(state) => state.ui.preferences.outlines === true,` — o botão aparece marcado com os contornos ligados; desligado, não.
- R5 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque `flipped` devolve sempre um objeto de estado do editor novo `src/editor/view/overlays.ts:15` `return { ...ui, preferences: on === true ? rest : { ...rest, [which]: true } };`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, flipped, publish)
- escreve: EST-L01-037 (o estado do editor, via flipped, flip, run, publish), EST-L01-033 (a mensagem, via publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.preferences.outlines` em `true` ou sem a chave `src/editor/view/overlays.ts:15` `return { ...ui, preferences: on === true ? rest : { ...rest, [which]: true } };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; a sobreposição de vista relê o interruptor `src/editor/canvas/view-overlays.tsx:47` `const outlines = useEditorState((s) => s.ui.preferences.outlines === true);`.
- **DOM do editor:** o botão do interruptor aparece marcado ou não `src/editor/view/overlays.ts:29` `(state) => state.ui.preferences.outlines === true,`; a página não muda.
- **DOM do canvas:** os contornos por cima da página são desenhados ou apagados pela leitura `src/editor/canvas/view-overlays.tsx:47` `const outlines = useEditorState((s) => s.ui.preferences.outlines === true);`; o documento não muda e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a preferência `src/editor/view/overlays.ts:15` `return { ...ui, preferences: on === true ? rest : { ...rest, [which]: true } };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de `view.toggleOutlines` (o controle do painel de ferramentas do canvas) chega à tabela `src/app/commands.ts:459` `'view.toggleOutlines': toggleOutlines,` e manda só a intenção de inverter `src/editor/view/overlays.ts:28` `({ state }) => flip(state.ui, 'outlines', toggleOutlines.command),`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/overlays.ts:23` `return { kind: 'change' as const, ui: next, message: switched(command, NEGATIVE.includes(which) ? !set : set) };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a preferência `src/editor/view/overlays.ts:15` `return { ...ui, preferences: on === true ? rest : { ...rest, [which]: true } };`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/overlays.ts:26` `export const toggleOutlines: RegisteredHandler<'view.toggleOutlines', EditorUi> = registerHandler(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o interruptor é uma preferência `src/editor/view/overlays.ts:14` `const { [which]: on, ...rest } = ui.preferences;`.
