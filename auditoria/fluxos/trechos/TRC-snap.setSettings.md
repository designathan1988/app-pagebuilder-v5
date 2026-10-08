# TRC-snap.setSettings

- **Chamada:** `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,`
- **Argumentos:** o tratador recebe `(context, args)`; `args` é `{ targets, distance }` (`manifest/commands/view.json:2909` `"args": {`), com o campo `targets` (tipo `json`, `manifest/commands/view.json:2910` `"targets": {`) e o campo `distance` (tipo `number`, `manifest/commands/view.json:2924` `"distance": {`).
- **Ramos que dependem dos argumentos:** R3 depende de `targets`; R4 depende de `distance`; R5 depende de `targets` e `distance`.

## Passos

1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador que a tabela guarda sob `'snap.setSettings'`; o argumento é `{ targets, distance }`.
2. `src/editor/view/snap.ts:60` `export const setSnapSettings = registerHandler<'snap.setSettings', EditorUi>('snap.setSettings', ({ state }, { targets, distance }) => {` — o tratador de `snap.setSettings`. [lê: EST-L01-037 via handlerContext]
3. `src/editor/view/snap.ts:61` `if (!Array.isArray(targets) || targets.some((t) => typeof t !== 'string' || !SNAP_TARGETS.includes(t))) throw new Error(`snap.setSettings: targets is a list of ${SNAP_TARGETS.join(', ')}`);` — R3.
4. `src/editor/view/snap.ts:27` `const withinRange = (distance: number) => Number.isFinite(distance) && distance >= DISTANCE_MIN && distance <= DISTANCE_MAX;` — o alcance aceito da distância.
5. `src/editor/view/snap.ts:62` `if (!withinRange(distance)) return { kind: 'refused', message: message('status.snap.distanceRange') };` — R4.
6. `src/editor/view/snap.ts:29` `const targetsIn = (list: readonly unknown[]): readonly string[] => SNAP_TARGETS.filter((t) => list.includes(t));` — os alvos da lista, na ordem do manifesto.
7. `src/editor/view/snap.ts:63` `const kept = targetsIn(targets);` — os alvos que ficam.
8. `src/editor/view/snap.ts:64` `const byDefault = distance === SNAP_DISTANCE && kept.length === SNAP_TARGETS.length;` — R5: os valores iguais aos de origem não viram preferência.
9. `src/editor/view/snap.ts:65` `const { dialog: _closed, ...ui } = state.ui;` — separa o diálogo aberto do estado do editor; ele fecha. [lê: EST-L01-037 via handlerContext]
10. `src/editor/view/snap.ts:67` `const { snapSettings: _stored, ...preferences } = state.ui.preferences;` — as preferências sem os ajustes guardados. [lê: EST-L01-037 via handlerContext]
11. `src/editor/view/snap.ts:69` `return { kind: 'change', ui: { ...ui, preferences: byDefault ? preferences : { ...preferences, snapSettings: { targets: kept, distance } } }, message: message('status.snap.settingsKept') };` — o `Outcome`: aos valores de origem, as preferências ficam sem `snapSettings`; fora deles, guardam a lista e a distância. [escreve: EST-L01-037 via run]
12. `src/core/store/store.ts:544` `ui: outcome.ui ?? before.ui,` — a store adota o estado do editor que o tratador devolveu. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo (o diálogo fechado) torna `changed` verdadeiro.
14. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado.
15. `src/core/store/store.ts:320` `state = next;` — a store publica o estado. [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish]
16. `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();` — os assinantes são avisados. [lê: EST-L01-037 via publish]

## Ramos

- R1 `src/core/store/store.ts:408` `if (!isBuilt(entry)) return { status: 'not-available-yet' };` — o tratador está registrado `src/editor/view/snap.ts:60` `export const setSnapSettings = registerHandler<'snap.setSettings', EditorUi>('snap.setSettings', ({ state }, { targets, distance }) => {`; o lado "não disponível" não é tomado e o despacho segue para `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado de `snap.setSettings` é `always` `manifest/commands/view.json:2931` `"predicate": "always",`, cuja função `src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);` devolve verdadeiro sempre; o lado da recusa não é tomado.
- R3 `src/editor/view/snap.ts:61` `if (!Array.isArray(targets) || targets.some((t) => typeof t !== 'string' || !SNAP_TARGETS.includes(t))) throw new Error(`snap.setSettings: targets is a list of ${SNAP_TARGETS.join(', ')}`);` — `targets` não é uma lista de ids que o encaixe oferece: o tratador lança; sendo, o caminho segue para `src/editor/view/snap.ts:62` `if (!withinRange(distance)) return { kind: 'refused', message: message('status.snap.distanceRange') };`.
- R4 `src/editor/view/snap.ts:62` `if (!withinRange(distance)) return { kind: 'refused', message: message('status.snap.distanceRange') };` — a distância fora do alcance `SNAP_DISTANCE`–`DISTANCE_MAX`: o comando é recusado com `status.snap.distanceRange` e o diálogo fica aberto; dentro dele, o caminho segue para `src/editor/view/snap.ts:64` `const byDefault = distance === SNAP_DISTANCE && kept.length === SNAP_TARGETS.length;`.
- R5 `src/editor/view/snap.ts:64` `const byDefault = distance === SNAP_DISTANCE && kept.length === SNAP_TARGETS.length;` — a distância na de origem e todos os alvos: as preferências ficam sem `snapSettings`; fora disso, guardam a lista e a distância.
- R6 `src/core/store/store.ts:470` `if (outcome.kind === 'refused') {` — no R4, a store publica a recusa `src/core/store/store.ts:472` `publish(commit({ ...state, message: said, refusal: { command: id, args, message: said }, refused: true }, id));` e devolve `status: 'refused'`; o documento não é tocado.

## Fronteiras assíncronas

- nenhuma: o caminho do tratador é síncrono; `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` chama o tratador e a store publica no mesmo despacho `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, run)
- escreve: EST-L01-033 (a mensagem, via publish), EST-L01-037 (o estado do editor, via run, publish)

## Resultado

- **Estado final:** EST-L01-037 sem `ui.dialog` e com `ui.preferences.snapSettings` na lista e na distância guardadas, ou sem a chave aos valores de origem `src/editor/view/snap.ts:69` `ui: { ...ui, preferences: byDefault ? preferences : { ...preferences, snapSettings: { targets: kept, distance } } }`.
- **Re-renderizado:** os componentes inscritos no estado do editor são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`; o diálogo relê o que está em vigor `src/editor/shell/snap-settings.tsx:35` `const inForce = useEditorState((s) => JSON.stringify(snapSettingsOf(s.ui)));`.
- **DOM do editor:** o diálogo de ajustes do encaixe fecha, e o que está em vigor é o guardado `src/editor/shell/snap-settings.tsx:35` `const inForce = useEditorState((s) => JSON.stringify(snapSettingsOf(s.ui)));`.
- **DOM do canvas:** nada muda no documento: o resultado não leva `patches` e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras

- G1: n/a — o comando não grava no documento nem num contexto de edição; o tratador só grava as preferências e fecha o diálogo `src/editor/view/snap.ts:69` `ui: { ...ui, preferences: byDefault ? preferences : { ...preferences, snapSettings: { targets: kept, distance } } }`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` guarda a digitação pendente antes do comando `src/editor/input/pending.ts:82` `keepTyping();`, exceto com o foco dentro do próprio campo `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`.
- G3: ok — a única porta de `snap.setSettings` (o botão Apply do diálogo de ajustes do encaixe) chega à tabela `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,` e envia só a lista de alvos e a distância `src/editor/view/snap.ts:60` `({ state }, { targets, distance }) => {`.
- G4: n/a — o trecho não desenha elemento algum sobre o canvas; o tratador não toca o DOM `src/editor/view/snap.ts:69` `return { kind: 'change', ui: { ...ui, preferences: byDefault ? preferences : { ...preferences, snapSettings: { targets: kept, distance } } }, message: message('status.snap.settingsKept') };`.
- G5: n/a — o trecho não desenha nem mede painel, barra ou rótulo; só grava as preferências `src/editor/view/snap.ts:69` `preferences: byDefault ? preferences : { ...preferences, snapSettings: { targets: kept, distance } }`.
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`.
- INT: ok — sem `patches` o documento não é tocado `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos e `src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Limpeza

- Nenhum ouvinte, timer ou observador é criado neste trecho; não há remoção a citar `src/editor/view/snap.ts:60` `export const setSnapSettings = registerHandler<'snap.setSettings', EditorUi>('snap.setSettings', ({ state }, { targets, distance }) => {`.

## Medições

- nenhuma: os passos do tratador não leem nem calculam valor do navegador; a lista de alvos e a distância vêm dos argumentos `src/editor/view/snap.ts:63` `const kept = targetsIn(targets);`.
