# TRC-components.detach
- **Chamada:** `src/app/commands.ts:237` `'components.detach': detachInstanceCommand,`
- **Argumentos:** `{}` — o comando não toma argumentos (`manifest/commands/design-system.json:1039` `"args": {},`); a disponibilidade `instanceSelected` lê a seleção.
- **Ramos que dependem dos argumentos:** nenhum — o comando não toma argumentos.

## Passos
1. `src/app/commands.ts:237` `'components.detach': detachInstanceCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o menu de contexto ou a command bar).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `instanceSelected` é lida antes do tratador [lê: EST-L01-031 via instanceSelected].
5. `src/core/design/components.ts:345` `export const instanceSelected = registerPredicate('instanceSelected', (state) => {` — o predicado exige uma só seleção que é raiz de instância.
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/design/components.ts:350` `export const detachInstanceCommand = registerHandler('components.detach', ({ state }): Outcome<never> => {` — o tratador recebe o estado.
8. `src/core/design/components.ts:351` `const primary = state.selection[0];` — o elemento principal [lê: EST-L01-031 via handlerContext].
9. `src/core/design/components.ts:352` `const found = primary === undefined ? null : locate(state.document, primary);` — a posição dele [lê: EST-L01-030 via locate].
10. `src/core/design/components.ts:353` `if (found === null || found.node.component === undefined) return { kind: 'change' };` — sem nó ou sem marca de instância: `change` sem patch.
11. `src/core/design/components.ts:355` `const locked = lockRefusal(state.document, found.node.id as NodeId, 'status.locked.edit');` — uma instância trancada recusa [lê: EST-L01-030 via lockRefusal].
12. `src/core/design/components.ts:357` `return { kind: 'change', patches: [{ op: 'replace', path: found.path, value: unmarked(found.node) }], message: message('status.components.detached', { name: found.node.name }) };` — o patch tira a marca de instância da subárvore; a mensagem é montada.
13. `src/core/design/components.ts:76` `export function unmarked(node: DocNode): DocNode {` — `unmarked` tira `component` e `componentPart` da subárvore.
14. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
15. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:353` `if (found === null || found.node.component === undefined) return { kind: 'change' };` — sem nó ou sem instância: `change` sem patch; com instância: segue.
- R2 `src/core/design/components.ts:356` `if (locked !== null) return { kind: 'refused', message: locked };` — instância trancada ou dentro de trancado: recusa `status.locked.edit`; livre: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:350`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento, via locate, lockRefusal, commit), EST-L01-031 (a seleção, via instanceSelected, handlerContext, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: a subárvore sem marca de instância, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a subárvore deixa de ser uma instância (`src/core/design/components.ts:357`); a mensagem é `status.components.detached`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o menu de contexto deixa de oferecer o detach.
- **DOM do canvas:** o canvas redesenha o documento com os elementos comuns.

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/components.ts:357`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:237` `'components.detach': detachInstanceCommand,` — o menu de contexto e a command bar chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:357`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:357`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:350`).

## Medições
- nenhuma
