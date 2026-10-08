# TRC-ui.dismiss

- **Chamada:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é o objeto vazio do manifesto `manifest/commands/focus.json:1187` `"args": {},`, sem campos nomeados.
- **Ramos que dependem dos argumentos:** nenhum: toda porta envia `args` vazio `manifest/commands/focus.json:1187` `"args": {},`, então nenhum ramo do trecho muda com um valor de argumento.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'ui.dismiss'`; o argumento é o objeto vazio.
2. `src/editor/menus/overlays.ts:17` `const { dialog: _closed, commandBar: _bar, htmlImport: _import, ...rest } = state.ui;` — o tratador lê o estado do editor e separa dele o diálogo, a barra de comandos e a importação abertos. [lê: EST-L01-037 via handlerContext]
3. `src/editor/menus/overlays.ts:21` `return { kind: 'change', ui: { ...rest, overlays: { dismissals: state.ui.overlays.dismissals + 1 } } };` — devolve o estado do editor sem `dialog`, `commandBar` e `htmlImport` e com `overlays.dismissals` acrescido de um. [lê: EST-L01-037 via handlerContext] [escreve: EST-L01-037 via run]
4. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
5. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
6. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado; `src/core/store/store.ts:320` `state = next;` publica-o e `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` avisa os assinantes. [escreve: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/menus/overlays.ts:16` `export const dismiss = registerHandler<'ui.dismiss', EditorUi>('ui.dismiss', ({ state }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `ui.dismiss` é `always` `manifest/commands/focus.json:1189` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — `next.ui !== before.ui` é verdadeiro porque `dismissals` sempre cresce `src/editor/menus/overlays.ts:21` `overlays: { dismissals: state.ui.overlays.dismissals + 1 }`; o lado "sem mudança" não é tomado e o estado é publicado em `src/core/store/store.ts:320` `state = next;`.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-037 (o estado do editor, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.overlays.dismissals` em `n+1` e sem `ui.dialog`, `ui.commandBar` e `ui.htmlImport` `src/editor/menus/overlays.ts:21` `overlays: { dismissals: state.ui.overlays.dismissals + 1 }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; o menu inscrito relê os descartes `src/editor/doors/menu.tsx:234` `const dismissals = useEditorState((s) => s.ui.overlays.dismissals);`.
- **DOM do editor:** o menu aberto fecha porque um descarte novo chegou `src/editor/doors/menu.tsx:236` `const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;`, e o foco volta ao botão que abriu o menu `src/editor/doors/menu.tsx:240` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();`.
- **DOM do canvas:** nada muda: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava o número de descartes `src/editor/menus/overlays.ts:21` `overlays: { dismissals: state.ui.overlays.dismissals + 1 }`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as seis portas de `ui.dismiss` (Escape no menu, no pano de fundo, na barra de comandos, nas sugestões do campo, no diálogo e o botão de fechar do diálogo) chegam à tabela `src/app/commands.ts:323` `'ui.dismiss': dismiss,` e mandam só a intenção de descartar `src/editor/menus/overlays.ts:21` `overlays: { dismissals: state.ui.overlays.dismissals + 1 }`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/menus/overlays.ts:21` `return { kind: 'change', ui: { ...rest, overlays: { dismissals: state.ui.overlays.dismissals + 1 } } };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava o número de descartes `src/editor/menus/overlays.ts:21` `overlays: { dismissals: state.ui.overlays.dismissals + 1 }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar. O fecho do menu lê os descartes por uma inscrição do próprio componente `src/editor/doors/menu.tsx:234` `const dismissals = useEditorState((s) => s.ui.overlays.dismissals);`, que a montagem do React remove na desmontagem.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o fecho do menu é decidido pela leitura dos descartes `src/editor/doors/menu.tsx:236` `const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;`.
