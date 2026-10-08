# TRC-geometry.resize
- **Chamada:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Argumentos:** `{ width?, height?, left?, top?, modifier?, marginLeft?, marginTop? }` — todos textos (`string`) opcionais, `modifier` um enum `Shift`, `Alt`, `Ctrl`, como o manifesto declara (`manifest/commands/geometry.json:108` `"width": {`).
- **Ramos que dependem dos argumentos:** R2 (o prefixo `margin` do argumento), R3 (o comprimento não é px), R4 (a forma SVG).

## Passos
1. `src/app/commands.ts:325` `'geometry.resize': resizeCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/input/pointer/events.ts:380` `ps.resizing.gesture.dispatch(ps.resizing.entry.command.id as CommandId, { ...ps.resizing.entry.door.args, ...given } as never);` — o dono do ponteiro entrega a intenção a cada passo do arraste, dentro de um gesto.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext].
6. `src/core/geometry/resize.ts:22` `export const resizeCommand = registerHandler('geometry.resize', (context, args): Outcome<never> => {` — o tratador recebe o contexto e os argumentos do arraste.
7. `src/core/geometry/resize.ts:24` `const id: NodeId | undefined = state.selection.length === 1 ? state.selection[0] : undefined;` — só um elemento selecionado [lê: EST-L01-031 via handlerContext].
8. `src/core/geometry/resize.ts:26` `const at = locate(state.document, id);` — o nó é achado [lê: EST-L01-030 via locate].
9. `src/core/geometry/resize.ts:28` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — a trava do nó e dos ancestrais é lida [lê: EST-L01-030 via lockRefusal].
10. `src/core/geometry/resize.ts:30` `const values: Record<string, string> = {};` — o mapa das declarações a escrever.
11. `src/core/geometry/resize.ts:31` `for (const [property, value] of Object.entries(args)) {` — cada argumento é lido.
12. `src/core/geometry/resize.ts:33` `if (!LENGTH.test(value)) return { kind: 'refused', message: argumentRefused(property) };` — valor que não é px inteiro é recusado.
13. `src/core/geometry/resize.ts:37` `if (!property.startsWith(MARGIN_ARG)) {` — o argumento de margem é separado dos demais.
14. `src/core/geometry/resize.ts:42` `const longhand = rules.compositeFacts.get(MARGIN_BOX)?.longhands.find((name) => name.endsWith(`-${side}`));` — o lado da margem é resolvido pelo composto `margin` [lê: EST-L01-030 via handlerContext].
15. `src/core/geometry/resize.ts:47` `const geometry = geometryAttributes(rules, at.node.type, resizeCommand.command);` — os atributos de geometria do tipo [lê: EST-L01-030 via geometryAttributes].
16. `src/core/geometry/resize.ts:48` `const from = geometry.length > 0 ? shapeBox(at.node, geometry) : null;` — a caixa atual, quando o nó é uma forma.
17. `src/core/geometry/resize.ts:52` `const shaped = resizedShape(at.node, geometry, box) ?? {};` — os atributos da forma redimensionada.
18. `src/core/geometry/resize.ts:62` `const patches = styleHolders(context, [at]).flatMap((held) => writeDeclarations(held.node, held.path, { breakpoint, state: base }, values));` — as declarações são escritas no detentor do estilo, no breakpoint e estado ativos [escreve: EST-L01-030 via run].
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o gesto grava um passo [escreve: EST-L01-032 via record].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/geometry/resize.ts:25` `if (id === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem exatamente um elemento selecionado: recusa; com um: segue para o passo 8.
- R2 `src/core/geometry/resize.ts:37` `if (!property.startsWith(MARGIN_ARG)) {` — argumento `marginLeft`/`marginTop`: vira o longhand de margem do lado (`src/core/geometry/resize.ts:44` `values[longhand] = value;`); os demais: entram como propriedade própria (`src/core/geometry/resize.ts:38` `values[property] = value;`).
- R3 `src/core/geometry/resize.ts:33` `if (!LENGTH.test(value)) return { kind: 'refused', message: argumentRefused(property) };` — comprimento que não é `-?digits px`: recusa nomeando o argumento; px inteiro: segue.
- R4 `src/core/geometry/resize.ts:48` `const from = geometry.length > 0 ? shapeBox(at.node, geometry) : null;` — o nó é uma forma SVG: os atributos de geometria são escritos (passos 17 e `src/core/geometry/resize.ts:53`); não é: as declarações de estilo são escritas (passo 18).
- R5 `src/core/geometry/resize.ts:29` `if (locked !== null) return { kind: 'refused', message: locked };` — nó travado: recusa `status.locked.edit`; livre: segue.
- R6 `src/core/geometry/resize.ts:43` `if (longhand === undefined) return { kind: 'refused', message: argumentRefused(property) };` — argumento de margem sem longhand no composto: recusa; com longhand: grava.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/geometry/resize.ts:22` `export const resizeCommand = registerHandler('geometry.resize', (context, args): Outcome<never> => {`); o arraste que o chama repete o despacho, mas cada passo roda inteiro dentro do trecho.

## Estado
- Lê: EST-L01-030 (documento, regras, via argumentRefusal, handlerContext, locate, lockRefusal, geometryAttributes, commit), EST-L01-031 (seleção, via handlerContext, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles` ou atributos de forma, via run, applyPatches, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a largura, a altura e, para um posicionado, `left` e `top` são gravados em px inteiros (`src/core/geometry/resize.ts:62`), ou os atributos da forma (`src/core/geometry/resize.ts:53`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra `status.resized` (`src/core/geometry/resize.ts:59` `const said = message('status.resized', { width: size.width ?? 'auto', height: size.height ?? 'auto' });`).
- **DOM do canvas:** o iframe desenha o elemento no tamanho novo pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a camada escrita é `rules.base` (`src/core/geometry/resize.ts:56` `const { breakpoint, state: base } = rules.base;`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- G4: n/a — o trecho não desenha painel nem barra sobre o canvas; as alças são desenhadas pelo chrome do canvas (`src/core/geometry/resize.ts:22`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/core/geometry/resize.ts:62`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/geometry/resize.ts:22`).

## Medições
- nenhuma — o trecho não chama API de medida; a caixa da forma vem do próprio documento (`src/core/elements/svg.ts:279` `export function shapeBox(node: DocNode, attributes: readonly string[]): Box | null {`).
