# TRC-position.setMode
- **Chamada:** `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,`
- **Argumentos:** `{ property, mode }` — `property` é do tipo `property` (obrigatório) e `mode` é um enum `static`, `relative`, `absolute`, `fixed`, `sticky` (obrigatório), como o manifesto declara (`manifest/commands/geometry.json:10` `"property": {`).
- **Ramos que dependem dos argumentos:** R1 (a leitura de `mode` contra a propriedade), R2 (o `mode` decide o caminho de `static`/`relative`).

## Passos
1. `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,` — a tabela de comandos liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção à store do editor.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor capta o contexto da edição [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade do comando (`always`) é testada; o predicado `always` devolve verdadeiro (`src/core/commands/registry.ts:195` `export const always = registerPredicate('always', () => true);`).
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
7. `src/core/geometry/position.ts:28` `export const setPositionModeCommand = registerHandler('position.setMode', (context, { property, mode }) => {` — o tratador recebe o contexto e os dois argumentos.
8. `src/core/geometry/position.ts:29` `const read = readValue(context, property, mode);` — o texto do `mode` é lido pelo codec da propriedade [lê: EST-L01-030 via readValue].
9. `src/core/style/set.ts:235` `export function readValue<Ui>(context: HandlerContext<Ui>, property: string, typedText: string): ReadValue | null {` — `readValue` resolve o valor [lê: EST-L01-030 via readValue].
10. `src/core/style/set.ts:264` `const value = codec.read(typed, { units, keywords, defaultUnit: DEFAULT_UNIT, ...(axes === undefined ? {} : { axes }) });` — o codec lê o texto; um valor que ele não lê devolve nulo.
11. `src/core/geometry/position.ts:33` `if (mode === 'static' || mode === 'relative') {` — o ramo dos modos inertes.
12. `src/core/geometry/position.ts:37` `const insets = (context.rules.compositeFacts.get(INSET)?.longhands ?? []).filter((p) => p !== property);` — as propriedades do composto `inset`, sem a própria `position`.
13. `src/core/geometry/position.ts:38` `const roots = context.state.selection.flatMap((id) => {` — os nós selecionados são achados [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate].
14. `src/core/geometry/position.ts:42` `const removed = styleHolders(context, roots).flatMap((held) => {` — os detentores dos estilos são lidos [lê: EST-L01-030 via styleHolders].
15. `src/core/geometry/position.ts:44` `return inert.length === 0 ? [] : writeDeclarations(held.node, held.path, context.rules.base, Object.fromEntries(inert.map((p) => [p, null])));` — as declarações inertes saem no mesmo nível de breakpoint e estado [lê: EST-L01-030 via writeDeclarations].
16. `src/core/geometry/position.ts:47` `const left = applyPatches(context.state.document, removed).document;` — o documento sem os insets é montado para o passo seguinte [escreve: EST-L01-030 via applyPatches].
17. `src/core/geometry/position.ts:48` `const written = writeStyle({ ...context, state: { ...context.state, document: left } }, property, read.css);` — o `mode` é escrito sobre o documento que já perdeu os insets.
18. `src/core/geometry/position.ts:53` `return writeStyle(context, property, read.css);` — nos demais modos, o `mode` é escrito direto no estado.
19. `src/core/style/set.ts:342` `const holders = styleHolders(context, nodes);` — os detentores do destino do estilo [lê: EST-L01-030 via styleHolders].
20. `src/core/style/set.ts:350` `const written = coupledScene(held.node, held.parent, plain, via, rules, place);` — os acoplamentos do `position` correm (absolute/fixed mantêm o lugar e tornam o pai relativo) [lê: EST-L01-030 via coupledScene].
21. `src/core/style/set.ts:351` `patches.push(...writeDeclarations(held.node, held.path, layer, { ...clearedRecipes(held.node, written.own, rules), ...structured }));` — as declarações do `mode` são escritas [escreve: EST-L01-030 via writeDeclarations].
22. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
23. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
24. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
25. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/geometry/position.ts:30` `if (read === null) return { kind: 'refused', message: message('status.value.invalid', { property: propertyName(property, context.rules), value: mode }) };` — `property`/`mode` que o codec não lê: recusa `status.value.invalid` e nada muda; legível: segue para o passo 11.
- R2 `src/core/geometry/position.ts:33` `if (mode === 'static' || mode === 'relative') {` — `static` ou `relative`: os insets inertes são removidos (passos 12 a 17); qualquer outro `mode`: o passo 18 escreve direto.
- R3 `src/core/geometry/position.ts:46` `if (removed.length > 0) {` — havia insets a remover: o documento é reconstruído e o `mode` escrito sobre ele; nada a remover: o passo 18 escreve sobre o estado atual.
- R4 `src/core/geometry/position.ts:49` `if (written.kind !== 'change') return written;` — `writeStyle` recusado (elemento travado): devolve a recusa; `change`: junta os patches removidos aos do `mode`.
- R5 `src/core/style/set.ts:308` `if (primary === undefined) return { kind: 'change' };` — sem seleção: `change` sem patch (`context.state.selection` de `src/core/geometry/position.ts:38` vazio); com seleção: segue.
- R6 `src/core/style/set.ts:310` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento travado (ou dentro de um travado): recusa; livre: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/geometry/position.ts:28` `export const setPositionModeCommand = registerHandler('position.setMode', (context, { property, mode }) => {`) e nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- Lê: EST-L01-030 (o documento e as regras, via argumentRefusal, readValue, locate, styleHolders, coupledScene, writeDeclarations), EST-L01-031 (a seleção, via locate, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `styles`, via applyPatches, writeDeclarations, publish), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o `mode` é gravado em cada elemento selecionado (`src/core/geometry/position.ts:53` `return writeStyle(context, property, read.css);`); nos modos inertes, os insets saem antes (`src/core/geometry/position.ts:47` `const left = applyPatches(context.state.document, removed).document;`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do `writeStyle` (`src/core/style/set.ts:373` `? message('status.style.set', { property: name, name: holders[0]?.name ?? primary.node.name, value: css })`).
- **DOM do canvas:** o iframe redesenha os elementos com o `mode` novo e sem os insets inertes, pelo mesmo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto captado escreve na camada de `src/core/style/set.ts:343` `const layer = { breakpoint, state: base };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,`
- G4: n/a — o trecho não desenha nada sobre o canvas (`src/core/geometry/position.ts:53`).
- G5: n/a — o trecho não altera a geometria de painel nem de barra (`src/core/geometry/position.ts:53`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/geometry/position.ts:28`).

## Medições
- nenhuma — o trecho não chama API de medida; onde o acoplamento `keepVisualPlace` lê a posição atual, ele o faz pelo porto de layout (`src/core/ports/layout.ts:18`).
