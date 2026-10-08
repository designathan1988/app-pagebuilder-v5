# TRC-handle.step
- **Chamada:** `src/app/commands.ts:330` `'handle.step': stepHandle,`
- **Argumentos:** `{ direction, handle? }` — `direction` é enum `increase`, `decrease` (obrigatório); `handle` é um texto opcional (a referência da porta da alça), como o manifesto declara (`manifest/commands/geometry.json:1545` `"direction": {`).
- **Ramos que dependem dos argumentos:** R1 e R2 (o `handle` resolve a alça e o seu tratador), R3 (a `direction`), R5 (a `direction`).

## Passos
1. `src/app/commands.ts:330` `'handle.step': stepHandle,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — as setas do contexto `canvas-handle` entregam `direction` e o `handle` da alça focada.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/editor/canvas/handles.ts:97` `export const stepHandle = registerHandler<'handle.step', EditorUi>('handle.step', (context, { direction, handle }) => {` — o tratador recebe o contexto, a direção e a alça.
7. `src/editor/canvas/handles.ts:98` `const entry = handle === undefined ? undefined : manifest.doorByRef.get(handle as DoorId);` — a alça é resolvida pelo manifesto [lê: EST-L01-037 via manifest].
8. `src/editor/canvas/handles.ts:99` `const run = entry === undefined ? undefined : RUNS.get(entry.command.id);` — o tratador do valor da alça é resolvido na tabela `RUNS` (`src/editor/canvas/handles.ts:84`).
9. `src/editor/canvas/handles.ts:100` `if (entry === undefined || entry.door.kind !== 'canvas-handle' || run === undefined) return { kind: 'change' };` — sem alça, alça que não é do canvas ou valor sem tratador: `change` sem patch.
10. `src/editor/canvas/handles.ts:102` `const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento principal da seleção é achado [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate].
11. `src/editor/canvas/handles.ts:114` `const held = Number.parseFloat(storedValue(primary.node, entry.door.adapter.writes[0] ?? '', rules) ?? '0');` — o valor que a alça arrasta é lido da primeira propriedade que ela escreve [lê: EST-L01-030 via storedValue].
12. `src/editor/canvas/handles.ts:116` `const next = Math.max(0, current + (direction === INCREASE ? KEY_STEP : -KEY_STEP));` — um passo de `handle.keyStep` a mais ou a menos, nunca abaixo de zero.
13. `src/editor/canvas/handles.ts:117` `return run(context as never, { ...entry.door.args, ...handleArgs(entry), [valueArg(entry)]: `${next}px` } as never) as Outcome<EditorUi>;` — a alça entrega o valor ao tratador do seu comando (`style.setSpacing`, `style.setRadius`, `style.setBorder` ou `style.set`, `src/editor/canvas/handles.ts:84`).
14. `src/editor/canvas/handles.ts:105` `if (entry.command.id === setShadowsCommand.command) {` — a alça de sombra edita a primeira camada, não uma propriedade simples.
15. `src/editor/canvas/handles.ts:112` `return setShadowsCommand.run(context as never, { property: shadow.property, edit: { layer: 0, [name]: `${next}px` } } as never) as Outcome<EditorUi>;` — o deslocamento (X) ou o borrão da primeira camada vai para `style.setShadows`.
16. `src/core/style/set.ts:397` `export const setStyleCommand = registerHandler('style.set', (given, { property, value, targets }) => {` — o tratador delegado (`style.set` entre os quatro) recebe a propriedade e o valor em px.
17. `src/core/style/set.ts:384` `return writeStyle(context, property, read.css, longhandValues(property, read.value, context.rules));` — a escrita do valor passa pelo escritor único das declarações [escreve: EST-L01-030 via writeStyle].
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
19. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/canvas/handles.ts:100` `if (entry === undefined || entry.door.kind !== 'canvas-handle' || run === undefined) return { kind: 'change' };` — sem alça focada ou sem valor a tratar: nada muda; com alça do canvas e tratador: segue.
- R2 `src/editor/canvas/handles.ts:103` `if (primary === null) return { kind: 'change' };` — sem elemento principal selecionado: nada muda; com um: segue para o passo 11.
- R3 `src/editor/canvas/handles.ts:107` `if (shadow === null) return { kind: 'change' };` — alça de sombra num elemento sem camada: nada muda; com camada: o passo 111 calcula o passo.
- R4 `src/editor/canvas/handles.ts:108` `const offset = movesOffset(entry);` — alça que move o deslocamento (`x`): passo positivo ou negativo; senão, o borrão nunca fica abaixo de zero.
- R5 `src/editor/canvas/handles.ts:111` `const next = offset ? held + (direction === INCREASE ? KEY_STEP : -KEY_STEP) : Math.max(0, held + (direction === INCREASE ? KEY_STEP : -KEY_STEP));` — `direction` `increase`: soma um passo; `decrease`: subtrai (o borrão, limitado a zero).
- R6 `src/editor/canvas/handles.ts:106` `const shadow = shadowOf(entry, primary.node, rules);` — a última propriedade da alça que guarda camadas é lida; nenhuma guarda: `shadow` nulo (R3).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/canvas/handles.ts:97` `export const stepHandle = registerHandler<'handle.step', EditorUi>('handle.step', (context, { direction, handle }) => {`); o tratador delegado (`style.set`) também é síncrono.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L01-037 (regras), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), EST-L01-033 (mensagem), pelo tratador delegado, via `writeStyle`, `applyPatches` e `publish`.

## Resultado
- **Estado final:** a propriedade que a alça edita é gravada em px (`src/editor/canvas/handles.ts:117`), ou a primeira camada de sombra (`src/editor/canvas/handles.ts:112`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do comando delegado (`src/core/style/set.ts:375`).
- **DOM do canvas:** o iframe desenha o valor novo pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o valor entra na camada ativa pelo tratador delegado (`src/core/style/set.ts:343` `const layer = { breakpoint, state: base };`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:330` `'handle.step': stepHandle,` — as quatro setas entre camadas e alças chamam o mesmo tratador com a mesma forma `{ direction, handle }`.
- G4: n/a — o trecho não desenha painel nem barra sobre o canvas (`src/editor/canvas/handles.ts:117`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/editor/canvas/handles.ts:114`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/canvas/handles.ts:97`).

## Medições
- nenhuma — o trecho não chama API de medida; o valor que a alça arrasta vem do documento (`src/core/style/stored.ts:8` `export function storedValue(node: DocNode, property: string, rules: ModelRules): string | undefined {`).
