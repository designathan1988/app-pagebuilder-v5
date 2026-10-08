# TRC-snap.setEnabled

- **Chamada:** `src/app/commands.ts:474` `'snap.setEnabled': setSnapEnabled,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ enabled }` (`manifest/commands/view.json:2809` `"args": {`), com o campo `enabled` (enum `toggle`/`on`/`off`, `manifest/commands/view.json:2810` `"enabled": {`); o botão envia `toggle` `manifest/commands/view.json:2851` `"enabled": "toggle"` e os itens do menu enviam `on`/`off`.
- **Ramos que dependem dos argumentos:** R4 e R5 dependem de `enabled`.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'snap.setEnabled'`; o argumento é `{ enabled }`.
2. `src/editor/view/snap.ts:45` `export const setSnapEnabled = registerHandler<'snap.setEnabled', EditorUi>(` — o tratador de `snap.setEnabled`.
3. `src/editor/view/snap.ts:48` `const was = state.ui.preferences.snap === true;` — o encaixe estava ligado? [lê: EST-L01-037 via handlerContext]
4. `src/editor/view/snap.ts:49` `const on = enabled === 'toggle' ? !was : enabled === 'on';` — R4: `toggle` inverte o que havia; `on` liga; `off` desliga.
5. `src/editor/view/snap.ts:51` `if (on === was) return { kind: 'change', message: said };` — R5.
6. `src/editor/view/snap.ts:52` `const { snap: _was, ...rest } = state.ui.preferences;` — as preferências sem a chave do encaixe. [lê: EST-L01-037 via handlerContext]
7. `src/editor/view/snap.ts:54` `return { kind: 'change', ui: { ...state.ui, preferences: on ? { ...rest, snap: true } : rest }, message: said };` — o `Outcome` com o encaixe ligado ou a chave fora. [escreve: EST-L01-037 via run]
8. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
9. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo (no R5, só a mensagem) torna `changed` verdadeiro.
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
11. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
12. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/snap.ts:45` `export const setSnapEnabled = registerHandler<'snap.setEnabled', EditorUi>(`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `snap.setEnabled` é `always` `manifest/commands/view.json:2821` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/snap.ts:27` `const withinRange = (distance: number) => Number.isFinite(distance) && distance >= DISTANCE_MIN && distance <= DISTANCE_MAX;` — o alcance da distância pertence a `snap.setSettings`, não a este trecho.
- R4 `src/editor/view/snap.ts:49` `const on = enabled === 'toggle' ? !was : enabled === 'on';` — `enabled` igual a `toggle`: o encaixe fica no contrário do que havia; `on`: fica ligado; `off`: desligado.
- R5 `src/editor/view/snap.ts:51` `if (on === was) return { kind: 'change', message: said };` — o estado pedido igual ao atual: devolve `change` só com a mensagem, sem mexer no `ui`; diferente, o caminho segue para `src/editor/view/snap.ts:54` `return { kind: 'change', ui: { ...state.ui, preferences: on ? { ...rest, snap: true } : rest }, message: said };`.
- R6 `src/editor/view/snap.ts:57` `(state, args) => (args.enabled === 'off' ? state.ui.preferences.snap !== true : state.ui.preferences.snap === true),` — o item `off` aparece marcado com o encaixe desligado; o botão e o item `on`, com ele ligado.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, run)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 com `ui.preferences.snap` em `true` ou sem a chave `src/editor/view/snap.ts:54` `return { kind: 'change', ui: { ...state.ui, preferences: on ? { ...rest, snap: true } : rest }, message: said };`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** o botão do encaixe e os itens do menu aparecem marcados pelo predicado `src/editor/view/snap.ts:57` `(state, args) => (args.enabled === 'off' ? state.ui.preferences.snap !== true : state.ui.preferences.snap === true),`.
- **DOM do canvas:** nada muda no documento: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava a preferência `src/editor/view/snap.ts:54` `preferences: on ? { ...rest, snap: true } : rest`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — as três portas de `snap.setEnabled` (o botão da barra do canvas e os itens On/Off do menu do encaixe) chegam à tabela `src/app/commands.ts:474` `'snap.setEnabled': setSnapEnabled,` e enviam só o estado pedido `src/editor/view/snap.ts:49` `const on = enabled === 'toggle' ? !was : enabled === 'on';`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/snap.ts:54` `return { kind: 'change', ui: { ...state.ui, preferences: on ? { ...rest, snap: true } : rest }, message: said };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava a preferência `src/editor/view/snap.ts:54` `preferences: on ? { ...rest, snap: true } : rest`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/snap.ts:45` `export const setSnapEnabled = registerHandler<'snap.setEnabled', EditorUi>(`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; o encaixe é uma preferência `src/editor/view/snap.ts:48` `const was = state.ui.preferences.snap === true;`.
