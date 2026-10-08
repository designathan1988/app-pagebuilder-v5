# TRC-element.wrapRow
- **Chamada:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:691` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho (o invólucro é fixo: `'row'`).

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `hasSelection` (`manifest/commands/structure.json:693` `"predicate": "hasSelection",`). [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.wrapRow'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/wrap.ts:154` `export const wrapRowCommand = registerHandler('element.wrapRow', (context): Outcome<never> => wrap('row', context));` — o tratador chama `wrap` com o invólucro `'row'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/wrap.ts:88` `  const selected = roots(state.selection, at);` — as raízes da seleção, na ordem do pai. [lê: EST-L01-031 via roots]
6. `src/core/structure/wrap.ts:92` `  if (selected.some((l) => l.parent === null)) return { kind: 'refused', message: message('status.wrap.root') };` — a raiz da página recusa.
7. `src/core/structure/wrap.ts:94` `  if (selected.some((l) => l.parent?.id !== parent.id)) return { kind: 'refused', message: message('status.wrap.needsSameParent') };` — pais diferentes recusam.
8. `src/core/structure/wrap.ts:96` `  const locked = firstLockRefusal(state.document, selected.map((l) => l.node.id), 'status.locked.edit');` — raiz trancada recusa. [lê: EST-L01-030 via firstLockRefusal]
9. `src/core/structure/wrap.ts:101` `  if (confirmed !== true) {` — antes de confirmar, o invólucro que muda o que a página mostra pede a pessoa.
10. `src/core/structure/wrap.ts:104` `    if (positioned || !nextToEachOther) return { kind: 'confirm' };` — um selecionado posicionado ou irmãos não vizinhos: pede confirmação.
11. `src/core/structure/wrap.ts:113` `  const perChild = wrapper.perChildTracks === true ? tracksForChildren(selected.length, rules) : null;` — os estilos do invólucro vêm da sua definição.
12. `src/core/structure/wrap.ts:125` `    name: uniqueName(state.document, words(wrapper.nameKey)),` — o invólucro é nomeado na língua da pessoa, numerado quando o nome já existe.
13. `src/core/structure/wrap.ts:135` `  const refused = placementRefusal(state.document, rules, parent.id, [node]) ?? (tag === null ? null : childrenRefusal(rules, tag, node.children));` — a regra de onde elementos podem entrar recusa. [lê: EST-L01-030 via placementRefusal]
14. `src/core/structure/wrap.ts:140` `  const patches: Patch[] = [...selected].reverse().map((l): Patch => ({ op: 'remove', path: [...parentPath, 'children', l.index] }));` — os selecionados saem do pai, do último para o primeiro. [escreve: EST-L01-030 via run]
15. `src/core/structure/wrap.ts:141` `  patches.push({ op: 'add', path: [...parentPath, 'children', first.index], value: node });` — o invólucro toma o lugar do primeiro. [escreve: EST-L01-030 via run]
16. `src/core/structure/wrap.ts:151` `  return { kind: 'change', patches, selection: [node.id], message: said };` — o resultado leva os remendos, o invólucro selecionado e o recado. [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
18. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
20. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
21. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/wrap.ts:92` `  if (selected.some((l) => l.parent === null)) return { kind: 'refused', message: message('status.wrap.root') };` — a raiz da página entre os selecionados: recusa; senão, segue.
- R2 `src/core/structure/wrap.ts:94` `  if (selected.some((l) => l.parent?.id !== parent.id)) return { kind: 'refused', message: message('status.wrap.needsSameParent') };` — pais diferentes: recusa; senão, segue.
- R3 `src/core/structure/wrap.ts:97` `  if (locked !== null) return { kind: 'refused', message: locked };` — raiz trancada: recusa; senão, segue.
- R4 `src/core/structure/wrap.ts:104` `    if (positioned || !nextToEachOther) return { kind: 'confirm' };` — posicionado ou não vizinhos, sem confirmação: `{ kind: 'confirm' }` e a store guarda a confirmação (`src/core/store/store.ts:455` `    if (outcome.kind === 'confirm') {`); senão, segue para a escrita.
- R5 `src/core/structure/wrap.ts:136` `  if (refused !== null) return { kind: 'refused', message: refused };` — o modelo de conteúdo recusa: recusa; senão, escreve.
- R6 `src/core/structure/wrap.ts:143` `  const said =` — um selecionado com estilos: `status.wrapped` (`src/core/structure/wrap.ts:149` `        ? message('status.wrapped', { name: first.node.name, wrapper: node.name, styles: named })`); sem estilos: `status.wrappedPlain` (`src/core/structure/wrap.ts:146` `        ? message('status.wrappedPlain', { name: first.node.name, wrapper: node.name })`); vários contam.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/wrap.ts:154`); a confirmação é guardada na store (`src/core/store/store.ts:467` `      publish(commit({ ...state, confirmation }, id));`) e a resposta roda o comando de novo (`src/core/store/store.ts:698` `        return run(waiting.command, waiting.args as CommandArgs[typeof waiting.command], null, true);`).

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, firstLockRefusal, placementRefusal, commit), EST-L01-031 (a seleção, via handlerContext, roots, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com o invólucro no lugar do primeiro selecionado, os selecionados dentro dele (`src/core/structure/wrap.ts:141`), a seleção no invólucro (`src/core/structure/wrap.ts:151`) e a mensagem de `src/core/structure/wrap.ts:143`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do invólucro.
- **DOM do canvas:** o invólucro entra pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/core/structure/wrap.ts:154` `export const wrapRowCommand = registerHandler('element.wrapRow', (context): Outcome<never> => wrap('row', context));` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/wrap.ts:141`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/wrap.ts:151`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/wrap.ts:154`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/wrap.ts:141`).
