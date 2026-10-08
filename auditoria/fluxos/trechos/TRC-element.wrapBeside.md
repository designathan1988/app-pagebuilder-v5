# TRC-element.wrapBeside
- **Chamada:** `src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,`
- **Argumentos:** `{ target: NodeId, side: enum [before, after], wrapper: enum [row, column], entry?: string (tipo palette-entry, refers palette-entry) }` — o manifesto (`manifest/commands/structure.json:972` `"target": {`, `manifest/commands/structure.json:977` `"side": {`, `manifest/commands/structure.json:985` `"wrapper": {`, `manifest/commands/structure.json:993` `"entry": {`).
- **Ramos que dependem dos argumentos:** R1 e R2 (o `entry`, presente ou não, decide o que chega), R3 (o `side` decide a ordem dentro do invólucro) e R4 (o `wrapper` decide a definição do invólucro).

## Passos
1. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são conferidos contra o manifesto. [lê: EST-L01-030 via argumentRefusal]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.wrapBeside'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/wrap.ts:235` `export const wrapBesideCommand = registerHandler('element.wrapBeside', ({ state, ids, rules, words }, { target, side, wrapper: kind, entry }): Outcome<never> => {` — o tratador recebe o estado e os quatro campos. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/wrap.ts:236` `  const at = locate(state.document, target);` — o alvo é o nó nomeado. [lê: EST-L01-030 via locate]
6. `src/core/structure/wrap.ts:237` `  if (at === null) throw new Error(`element.wrapBeside: the document has no node ${target}`);` — sem alvo, defeito da porta.
7. `src/core/structure/wrap.ts:238` `  if (at.parent === null) return { kind: 'refused', message: message('status.wrap.root') };` — a raiz da página recusa.
8. `src/core/structure/wrap.ts:240` `  const arriving: DocNode[] = entry === undefined ? selectionRoots(state.document, state.selection).map((l) => l.node) : [paletteNode(make, entry)];` — o que chega: uma entrada nova, ou as raízes da seleção. [lê: EST-L01-030 via selectionRoots] [lê: EST-L01-031 via selectionRoots]
9. `src/core/structure/wrap.ts:242` `  if (movesIntoItself(arriving, target)) return { kind: 'refused', message: message('status.refused.intoItself') };` — um alvo dentro do que chega recusa.
10. `src/core/structure/wrap.ts:244` `  const locked = firstLockRefusal(state.document, moving, 'status.locked.move') ?? lockRefusal(state.document, at.parent.id, 'status.locked.insert') ?? lockRefusal(state.document, target, 'status.locked.move');` — nó, pai ou alvo trancado recusa. [lê: EST-L01-030 via firstLockRefusal]
11. `src/core/structure/wrap.ts:248` `  const instanced = instanceMoveRefusal(state.document, entry === undefined ? arriving : [], at.parent.id as NodeId);` — a peça fica na instância; a instância não entra noutra. [lê: EST-L01-030 via instanceMoveRefusal]
12. `src/core/structure/wrap.ts:253` `  if (definition === undefined || element === undefined) throw new Error(`element.wrapBeside: elements.json defines no ${kind} wrapper`);` — sem definição, defeito do manifesto.
13. `src/core/structure/wrap.ts:261` `    const patch: Patch = { op: 'remove', path: now.path };` — os que se movem saem do lugar. [escreve: EST-L01-030 via run]
14. `src/core/structure/wrap.ts:267` `  const children = withChildStyles(rules, side === 'before' ? [...arriving, place.node] : [place.node, ...arriving], definition.childStyles);` — o invólucro segura o alvo e o que chega, na ordem do lado.
15. `src/core/structure/wrap.ts:280` `  const refused = placementRefusal(state.document, rules, at.parent.id, [node], new Set([target])) ?? (tag === null ? null : childrenRefusal(rules, tag, children));` — a regra de onde elementos podem entrar recusa. [lê: EST-L01-030 via placementRefusal]
16. `src/core/structure/wrap.ts:284` `  patches.push({ op: 'replace', path: place.path, value: node });` — o invólucro toma o lugar do alvo. [escreve: EST-L01-030 via run]
17. `src/core/structure/wrap.ts:290` `    message: message('status.wrappedBeside', { wrapper: node.name, name: first.name, target: at.node.name, styles: stylesText(definition.styles) }),` — o recado nomeia o invólucro, o que chegou, o alvo e os estilos.
18. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
19. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
20. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
21. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/wrap.ts:240` `  const arriving: DocNode[] = entry === undefined ? selectionRoots(state.document, state.selection).map((l) => l.node) : [paletteNode(make, entry)];` — com `entry`: um nó novo da paleta; sem: as raízes da seleção.
- R2 `src/core/structure/wrap.ts:241` `  if (arriving.length === 0) throw new Error('element.wrapBeside: nothing arrives');` — sem `entry` e sem seleção: defeito da porta; senão, segue.
- R3 `src/core/structure/wrap.ts:267` `  const children = withChildStyles(rules, side === 'before' ? [...arriving, place.node] : [place.node, ...arriving], definition.childStyles);` — `side` `before`: o que chega antes do alvo; `after`: depois dele.
- R4 `src/core/structure/wrap.ts:251` `  const definition = rules.wrappers.get(kind as WrapperId);` — o `wrapper` `row` ou `column` escolhe a definição; sem ela, defeito do manifesto.
- R5 `src/core/structure/wrap.ts:238` `  if (at.parent === null) return { kind: 'refused', message: message('status.wrap.root') };` — alvo é a raiz da página: recusa; senão, segue.
- R6 `src/core/structure/wrap.ts:245` `  if (locked !== null) return { kind: 'refused', message: locked };` — nó, pai ou alvo trancado: recusa; senão, segue.
- R7 `src/core/structure/wrap.ts:281` `  if (refused !== null) return { kind: 'refused', message: refused };` — o modelo de conteúdo recusa: recusa; senão, escreve.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/wrap.ts:235`); a porta é o arraste lateral de canvas com confirmação, mas o `dispatch` que chega roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, locate, selectionRoots, firstLockRefusal, instanceMoveRefusal, placementRefusal, commit), EST-L01-031 (a seleção, via handlerContext, selectionRoots, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via publish)

## Resultado
- **Estado final:** EST-L01-030 com o invólucro no lugar do alvo, segurando o alvo e o que chega na ordem do lado (`src/core/structure/wrap.ts:267`), a seleção no invólucro (`src/core/structure/wrap.ts:289`) e a mensagem `status.wrappedBeside` (`src/core/structure/wrap.ts:290`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do invólucro.
- **DOM do canvas:** o invólucro entra pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/wrap.ts:235` `export const wrapBesideCommand = registerHandler('element.wrapBeside', ({ state, ids, rules, words }, { target, side, wrapper: kind, entry }): Outcome<never> => {` — um só tratador; as portas mandam só a intenção (o alvo, o lado, o invólucro e a entrada).
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/wrap.ts:284`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/wrap.ts:290`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/wrap.ts:235`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/wrap.ts:284`).
