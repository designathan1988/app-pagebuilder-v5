# ENT-P-geometry-0054 — handle.step pela porta handle.step#key-arrow-up-in-canvas-handle

## Passos
1. `src/editor/input/keymap.ts:381` `const onKeyDown = (event: KeyboardEvent) => {` — o keymap recebe a tecla `ArrowUp` no contexto `canvas-handle`.
2. `src/editor/input/keymap.ts:477` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação do acorde no contexto `canvas-handle`.
3. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto (`manifest/commands/geometry.json:1614` `"direction": "increase"`) sobre os do controle focado; a alça focada entrega o seu próprio nome em `src/editor/input/keymap.ts:191` `return typeof stands[HANDLE_ARG] === 'string' && HANDLE_ARG in entry.command.args ? { ...handed, [HANDLE_ARG]: stands[HANDLE_ARG] } : handed;`.
4. `src/editor/input/keymap.ts:528` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — o gesto `handle-keys` não multiplica nada (`src/editor/input/keymap.ts:271` `const rule = STEPPED[gesture];` devolve indefinido), então `args` é `given`.
5. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a Início: a tecla entrega a intenção à store do editor. [lê: EST-L01-037 via keyContextIn]
6. `src/app/commands.ts:330` `'handle.step': stepHandle,` — a Chamada do trecho TRC-handle.step: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/input/keymap.ts:506` `if (!shortcutRunsNow(binding)) return;` — a porta não corre agora: nada; corre: segue ao passo 5.
- R2 `src/editor/input/keymap.ts:531` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — um argumento de área de transferência faria a tecla aguardar; este comando não tem: o passo 5 despacha direto.

## Fronteiras assíncronas
- nenhuma — o keymap despacha de forma síncrona; a leitura da área de transferência (`src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) só vale para um argumento de área de transferência, que este comando não tem.

## Estado
- Lê: EST-L01-030, EST-L01-031, EST-L01-037 (documento, seleção, regras), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador delegado do trecho TRC-handle.step.

## Resultado
- **Estado final:** a propriedade que a alça focada edita é gravada um passo acima (`src/editor/canvas/handles.ts:117` `return run(context as never, { ...entry.door.args, ...handleArgs(entry), [valueArg(entry)]: `${next}px` } as never) as Outcome<EditorUi>;`), ou a primeira camada de sombra (`src/editor/canvas/handles.ts:112`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do comando delegado (`src/core/style/set.ts:375`).
- **DOM do canvas:** o iframe desenha o valor novo pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o valor entra na camada ativa pelo tratador delegado (`src/core/style/set.ts:343` `const layer = { breakpoint, state: base };`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:330` `'handle.step': stepHandle,` — as quatro setas das alças chamam o mesmo tratador com a mesma forma `{ direction, handle }`.
- G4: n/a — a alça é desenhada pelo chrome do canvas, fora do canvas no ponto da ação (`src/editor/input/keymap.ts:531`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/input/keymap.ts:531`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531`); o ouvinte `keydown` do keymap existe fora dele.

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o valor que a alça arrasta vem do documento (`src/core/style/stored.ts:8` `export function storedValue(node: DocNode, property: string, rules: ModelRules): string | undefined {`).

## Ramos do trecho
- **Trecho:** TRC-handle.step
- **Argumentos enviados:** `{ direction: 'increase' }` — a direção do manifesto (`manifest/commands/geometry.json:1614` `"direction": "increase"`), mais o `handle` quando uma alça focada o entrega (`src/editor/input/keymap.ts:190`).
- R1 (o `handle` resolve a alça e o tratador): o tratador só segue quando o `handle` resolve uma alça do tipo `canvas-handle` com valor (`src/editor/canvas/handles.ts:100` `if (entry === undefined || entry.door.kind !== 'canvas-handle' || run === undefined) return { kind: 'change' };`).
- R2 (o `handle`): este ramo (elemento principal selecionado) é decidido pela seleção, não pelo argumento (`src/editor/canvas/handles.ts:103` `if (primary === null) return { kind: 'change' };`).
- R3 (a `direction` no eixo das sombras): só a alça de sombra sem camada não muda nada (`src/editor/canvas/handles.ts:107` `if (shadow === null) return { kind: 'change' };`).
- R5 (a `direction`): a `direction` `increase` soma um passo (`src/editor/canvas/handles.ts:111` `const next = offset ? held + (direction === INCREASE ? KEY_STEP : -KEY_STEP) : Math.max(0, held + (direction === INCREASE ? KEY_STEP : -KEY_STEP));`).
