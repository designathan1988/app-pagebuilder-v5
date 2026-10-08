# TRC-components.create
- **Chamada:** `src/app/commands.ts:233` `'components.create': createComponentCommand,`
- **Argumentos:** `{ name?: string }` — um nome opcional (`manifest/commands/design-system.json:822` `"name": {`); vazio, vale o nome do elemento.
- **Ramos que dependem dos argumentos:** R2 (o `name` decide o nome da definição).

## Passos
1. `src/app/commands.ts:233` `'components.create': createComponentCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `singleSelection` é lida antes do tratador [lê: EST-L01-031 via run].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/design/components.ts:115` `export const createComponentCommand = registerHandler('components.create', ({ state, ids }, { name: typed }): Outcome<never> => {` — o tratador recebe o estado, o gerador de ids e o argumento `name`.
8. `src/core/design/components.ts:116` `const primary = state.selection[0];` — o elemento principal [lê: EST-L01-031 via handlerContext].
9. `src/core/design/components.ts:117` `const found = primary === undefined ? null : locate(state.document, primary);` — a posição dele no documento [lê: EST-L01-030 via locate].
10. `src/core/design/components.ts:119` `const refusedHere = createRefusal(state.document, found.node.id as NodeId);` — o elemento é julgado pelo `createRefusal` [lê: EST-L01-030 via createRefusal].
11. `src/core/design/components.ts:122` `const asked = typeof typed === 'string' ? typed.trim() : '';` — o nome pedido é aparado.
12. `src/core/design/components.ts:123` `const name = componentName(state.document, asked === '' ? found.node.name : asked);` — o nome livre (o do elemento quando nenhum foi digitado) [lê: EST-L01-030 via componentName].
13. `src/core/design/components.ts:124` `const plainCopy = copied(found.node, () => ids.next() as NodeId, null);` — a cópia da árvore com ids novos, sem marca de instância.
14. `src/core/design/components.ts:125` `const definitionTree = refreshCopiedIdentities(state.document, [{ source: found.node, copy: plainCopy }], false)[0];` — a cópia tem as identidades renovadas [lê: EST-L01-030 via refreshCopiedIdentities].
15. `src/core/design/components.ts:128` `const added: Patch = state.document.components === undefined ? { op: 'add', path: ['components'], value: [definition] } : { op: 'add', path: ['components', componentsOf(state.document).length], value: definition };` — a definição entra (a lista inteira quando não há nenhuma).
16. `src/core/design/components.ts:129` `return { kind: 'change', patches: [added, { op: 'replace', path: found.path, value: marked(found.node, [], name) }], message: message('status.components.created', { name }) };` — o tratador devolve os patches (a definição e o nó virado instância) e a mensagem.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:118` `if (found === null) return { kind: 'change' };` — nada selecionado (ou nó ausente): `change` sem patch; com nó: segue.
- R2 `src/core/design/components.ts:120` `if (refusedHere !== null) return { kind: 'refused', message: refusedHere };` — raiz, instância, um dentro de instância ou trancado: recusa; livre: segue.
- R3 `src/core/design/components.ts:122` `const asked = typeof typed === 'string' ? typed.trim() : '';` — `name` ausente ou vazio: a definição toma o nome do elemento (`src/core/design/components.ts:123`); digitado: toma o digitado.
- R4 `src/core/design/components.ts:128` `const added: Patch = state.document.components === undefined ? { op: 'add', path: ['components'], value: [definition] } : { op: 'add', path: ['components', componentsOf(state.document).length], value: definition };` — `components` ausente: cria a lista; presente: acrescenta no fim.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:115`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento, via argumentRefusal, locate, createRefusal, componentName, refreshCopiedIdentities, commit), EST-L01-031 (a seleção, via run, handlerContext, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `components` e o nó virado instância, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o documento ganha a definição em `components` e o elemento vira a primeira instância (`src/core/design/components.ts:129`); a mensagem é `status.components.created`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de elementos lista o componente novo.
- **DOM do canvas:** o canvas redesenha o documento com o nó marcado como instância.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/components.ts:129`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:233` `'components.create': createComponentCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:129`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:129`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:115`).

## Medições
- nenhuma
