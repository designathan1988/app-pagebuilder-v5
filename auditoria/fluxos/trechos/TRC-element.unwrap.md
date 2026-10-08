# TRC-element.unwrap
- **Chamada:** `src/app/commands.ts:381` `'element.unwrap': unwrapCommand,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:1647` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `canUnwrap` (`manifest/commands/structure.json:1649` `"predicate": "canUnwrap",`). [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'element.unwrap'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/structure/wrap.ts:193` `export const unwrapCommand = registerHandler('element.unwrap', ({ state, rules }): Outcome<never> => {` — o tratador recebe o estado e as regras. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-031 via handlerContext]
5. `src/core/structure/wrap.ts:194` `  const wrapper = unwrappable(state);` — o invólucro a tirar. [lê: EST-L01-030 via unwrappable] [lê: EST-L01-031 via unwrappable]
6. `src/core/structure/wrap.ts:169` `  if (only === undefined || others.length > 0) return null;` — mais de um selecionado ou nenhum: sem invólucro.
7. `src/core/structure/wrap.ts:171` `  return found !== null && found.parent !== null && found.node.children.length > 0 ? found : null;` — abaixo da raiz e com filhos: o invólucro; senão `null` (a disponibilidade recusa com `status.unwrap.noChildren` ou `status.unwrap.unavailable`).
8. `src/core/structure/wrap.ts:196` `  if (wrapper === null || wrapper.parent === null) throw new Error('element.unwrap: the selection is not one element with children below the page root');` — sem invólucro, defeito da store.
9. `src/core/structure/wrap.ts:199` `  const locked = lockRefusal(state.document, wrapper.node.id, 'status.locked.edit');` — invólucro trancado recusa. [lê: EST-L01-030 via lockRefusal]
10. `src/core/structure/wrap.ts:202` `  const refused = placementRefusal(state.document, rules, parent.id, wrapper.node.children);` — a regra de onde elementos podem entrar recusa. [lê: EST-L01-030 via placementRefusal]
11. `src/core/structure/wrap.ts:211` `  const released = releaseReferencesPatch(state.document, leaving);` — o que apontava para o invólucro é solto no mesmo passo. [escreve: EST-L01-030 via run]
12. `src/core/structure/wrap.ts:216` `  const kept = wrapper.node.children.map((child) => withoutChildStyles(rules, withoutReferencesTo(child, names), given));` — os filhos são devolvidos sem o que o invólucro lhes deu.
13. `src/core/structure/wrap.ts:221` `    ...removeSubtree(wrapper),` — o invólucro sozinho sai. [escreve: EST-L01-030 via run]
14. `src/core/structure/wrap.ts:222` `    ...kept.map((child, i): Patch => ({ op: 'add', path: childPath(parentPath, wrapper.index + i), value: child })),` — os filhos tomam o lugar dele, na sua ordem. [escreve: EST-L01-030 via run]
15. `src/core/structure/wrap.ts:224` `  return { kind: 'change', patches, selection: wrapper.node.children.map((c) => c.id), message: message('status.unwrapped', { name: wrapper.node.name }) };` — o resultado leva os remendos, os filhos selecionados e o recado. [escreve: EST-L01-030 via run] [escreve: EST-L01-031 via run] [escreve: EST-L01-033 via run]
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os remendos. [escreve: EST-L01-030 via applyPatches]
17. `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção do resultado é a do tratador. [escreve: EST-L01-031 via run]
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
19. `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção são validados.
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado com os remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/core/structure/wrap.ts:169` `  if (only === undefined || others.length > 0) return null;` — mais de um selecionado ou nenhum: sem invólucro; um só: segue.
- R2 `src/core/structure/wrap.ts:187` `    if (found !== null && found.node.component !== undefined) return message('status.unwrap.instance', { name: found.node.name });` — uma instância conserva o invólucro; senão, segue.
- R3 `src/core/structure/wrap.ts:188` `    if (found !== null && found.parent !== null && found.node.children.length === 0) return message('status.unwrap.noChildren', { name: found.node.name });` — sem filhos para subir: recusa; com filhos: segue.
- R4 `src/core/structure/wrap.ts:200` `  if (locked !== null) return { kind: 'refused', message: locked };` — invólucro trancado: recusa; senão, segue.
- R5 `src/core/structure/wrap.ts:203` `  if (refused !== null) return { kind: 'refused', message: refused };` — o modelo de conteúdo recusa: recusa; senão, escreve.
- R6 `src/core/structure/wrap.ts:214` `  const given = wrapperChildStyles(rules, wrapper.node);` — o filho que ainda tem exatamente o que um invólucro lhe deu perde isso; um valor mudado pela pessoa fica.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/structure/wrap.ts:193`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`).

## Estado
- lê: EST-L01-030 (o documento, via run, handlerContext, unwrappable, lockRefusal, placementRefusal, commit), EST-L01-031 (a seleção, via run, handlerContext, unwrappable, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 sem o invólucro, os filhos no lugar dele (`src/core/structure/wrap.ts:222`), a seleção nos filhos (`src/core/structure/wrap.ts:224`) e a mensagem `status.unwrapped`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas troca a linha do invólucro pelas dos filhos.
- **DOM do canvas:** o invólucro sai e os filhos entram pela lista de remendos que `src/core/store/store.ts:542` publica.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado (`at`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:381` `'element.unwrap': unwrapCommand,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; devolve remendos (`src/core/structure/wrap.ts:222`).
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/core/structure/wrap.ts:224`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/structure/wrap.ts:193`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o modelo e devolve remendos (`src/core/structure/wrap.ts:222`).
