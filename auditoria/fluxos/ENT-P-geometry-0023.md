# ENT-P-geometry-0023 — position.setAnchors pela porta position.setAnchors#key-alt-shift-arrow-down-in-canvas-positioned

## Passos
1. `src/editor/input/keymap.ts:380` `const onKeyDown = (event: KeyboardEvent) => {` — o keymap recebe a tecla `Alt+Shift+ArrowDown`.
2. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação do acorde no contexto `canvas-positioned`.
3. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto (`manifest/commands/geometry.json:745` `"edge": "bottom",`) sobre os do controle focado.
4. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — este `gesture` é nulo (`manifest/commands/geometry.json:728` `"gesture": null,`), então `args` é `given`.
5. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a Início: a tecla entrega a intenção à store do editor. [lê: EST-L01-030 via positionedContext] [lê: EST-L01-031 via positionedContext]
6. `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — a Chamada do trecho TRC-position.setAnchors: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — a porta não corre agora: nada; corre: segue ao passo 5.
- R2 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — um argumento de área de transferência faria a tecla aguardar; este comando não tem: o passo 5 despacha direto.

## Fronteiras assíncronas
- nenhuma — o keymap despacha de forma síncrona; a leitura da área de transferência (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) só vale para um argumento de área de transferência, que este comando não tem.

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.setAnchors.

## Resultado
- **Estado final:** os insets e o tamanho do eixo mudam para ancorar o lado (`src/core/geometry/anchors.ts:132` `writes[axis.start] = next.sides.has('start') ? `${start}px` : null;`); a mensagem é `status.anchors.set` (`src/core/geometry/anchors.ts:145`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra as âncoras dos dois eixos (`src/core/geometry/anchors.ts:145`).
- **DOM do canvas:** o iframe desenha o elemento com as âncoras novas pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/anchors.ts:144` `patches: writeDeclarations(found.node, found.path, rules.base, writes),`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,` — as setas, as abas do canvas e o controle do inspector chamam o mesmo tratador com a mesma forma `{ edge, mode }`.
- G4: n/a — o fluxo de porta não desenha painel nem barra sobre o canvas (`src/editor/input/keymap.ts:531`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/input/keymap.ts:531`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531`); o ouvinte `keydown` do keymap existe fora dele.

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o passo é constante do manifesto (`manifest/commands/geometry.json:745`).

## Ramos do trecho
- **Trecho:** TRC-position.setAnchors
- **Argumentos enviados:** `{ edge: 'bottom', mode: 'toggle' }` — o manifesto dá os dois valores (`manifest/commands/geometry.json:745` `"edge": "bottom",` e `manifest/commands/geometry.json:746` `"mode": "toggle"`).
- R4 (o `edge`): o `edge` `bottom` está no mapa `EDGES`, então o caminho passa pelo lado válido (`src/core/geometry/anchors.ts:109` `if (target === undefined) throw new Error(`position.setAnchors: no edge ${edge}`);` é falso).
- R5 (o `mode`): o `mode` `toggle` faz o passo 92 alternar (`src/core/geometry/anchors.ts:91` `if (mode === 'set') return { kind: 'edges', sides: new Set<Side>([side]) };` é falso).
- R6 (o `edge` no modo toggle): ao tirar o único lado ancorado, o oposto é ancorado (`src/core/geometry/anchors.ts:96` `return { kind: 'edges', sides: next.size === 0 ? new Set<Side>([side === 'start' ? 'end' : 'start']) : next };`).
- R7 (o `edge` no centro): o `edge` `bottom` não é um centro, então o caminho fica fora do centro (`src/core/geometry/anchors.ts:122` `if (next.kind === 'center') {` é falso).
