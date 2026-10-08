# ENT-P-geometry-0017 — position.move pela porta position.move#key-arrow-right-in-canvas-positioned

## Passos
1. `src/editor/input/keymap.ts:380` `const onKeyDown = (event: KeyboardEvent) => {` — o keymap recebe a tecla `ArrowRight`.
2. `src/editor/input/keymap.ts:476` `const binding = held?.entry ?? bindingIn(chain, chordOf(event));` — a ligação do acorde no contexto `canvas-positioned`.
3. `src/editor/input/keymap.ts:526` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos do manifesto (`manifest/commands/geometry.json:543` `"dx": 1,`) sobre os do controle focado.
4. `src/editor/input/keymap.ts:527` `const args = binding.door.kind === 'shortcut' && binding.door.gesture !== null ? stepped(binding.door.gesture, given, held?.modifier ?? null) : given;` — o gesto `nudge-keys` multiplica a direção pelo passo (`src/editor/input/keymap.ts:237`).
5. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a Início: a tecla entrega a intenção à store do editor. [lê: EST-L01-030 via positionedContext] [lê: EST-L01-031 via positionedContext]
6. `src/app/commands.ts:326` `'position.move': movePositionedCommand,` — a Chamada do trecho TRC-position.move: a tabela liga o id ao tratador.

## Ramos
- R1 `src/editor/input/keymap.ts:505` `if (!shortcutRunsNow(binding)) return;` — a porta não corre agora: nada; corre: segue ao passo 5.
- R2 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — um argumento de área de transferência faria a tecla aguardar; este comando não tem: o passo 5 despacha direto.

## Fronteiras assíncronas
- nenhuma — o keymap despacha de forma síncrona; a leitura da área de transferência (`src/editor/input/keymap.ts:532` `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`) só vale para um argumento de área de transferência, que este comando não tem.

## Estado
- Lê: EST-L01-030 (documento, regras), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`), pelo tratador do trecho TRC-position.move.

## Resultado
- **Estado final:** os insets de cada raiz mudam em px inteiros (`src/core/geometry/position.ts:98` `writes[start] = `${next}px`;`); a mensagem é `status.position.moved` (`src/core/geometry/position.ts:120`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem com o elemento e as coordenadas (`src/core/geometry/position.ts:120`).
- **DOM do canvas:** o iframe desenha o elemento na posição nova pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/position.ts:118`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:326` `'position.move': movePositionedCommand,` — o arraste livre (`src/editor/input/pointer/resize.ts:73`) e as setas (`src/editor/input/keymap.ts:531`) chamam o mesmo tratador com a mesma forma `{ dx, dy }`.
- G4: n/a — o fluxo de porta não desenha painel nem barra sobre o canvas (`src/editor/input/keymap.ts:531`).
- G5: n/a — o fluxo de porta não altera a geometria de painel nem de barra (`src/editor/input/keymap.ts:531`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o fluxo de porta não cria ouvinte, timer nem observador (`src/editor/input/keymap.ts:531`); o ouvinte `keydown` do keymap existe fora dele.

## Medições
- nenhuma — o fluxo de porta não chama API de medida; o passo é constante do manifesto (`src/editor/input/keymap.ts:237`).

## Ramos do trecho
- **Trecho:** TRC-position.move
- **Argumentos enviados:** `{ dx: nudge.step, dy: 0 }` — o manifesto dá `{ dx: 1, dy: 0 }` (`manifest/commands/geometry.json:543` `"dx": 1,`) e o gesto multiplica por `nudge.step` (`src/editor/input/keymap.ts:272` `const step = modifier === SHIFT ? rule.shiftStep : rule.step;`).
- R3 (a trava do nó): os argumentos não decidem este ramo; a trava decide (`src/core/geometry/position.ts:112` `if (locked !== null) return { kind: 'refused', message: locked };`); a seta envia sempre um `dx` não nulo.
- R4 (o `dx`/`dy` decide o deslocamento): o `dx` positivo move para a direita; o lado do inset que recebe o valor vem do nó (`src/core/geometry/position.ts:92` `if (set(end) && !set(start)) {`), e o passo 98 escreve o inset inicial (`src/core/geometry/position.ts:98` `writes[start] = `${next}px`;`).
