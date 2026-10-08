# TRC-classes.detach
- **Chamada:** `src/app/commands.ts:229` `'classes.detach': detachClassCommand,`
- **Argumentos:** `{ className: string }` — o argumento `className` do manifesto (`manifest/commands/design-system.json:511` `"className": {`), obrigatório.
- **Ramos que dependem dos argumentos:** nenhum ramo muda com o valor do argumento; o `className` escolhe a classe, e o documento decide R1 e R2.

## Passos
1. `src/app/commands.ts:229` `'classes.detach': detachClassCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/classes.ts:105` `export const detachClassCommand = registerHandler('classes.detach', (context, { className }): Outcome<never> => {` — o tratador recebe o contexto e o argumento `className`.
7. `src/core/design/classes.ts:107` `const holding = selectedNodes(context).filter((found) => found.node.classes.includes(className));` — só os selecionados que listam a classe [lê: EST-L01-030 via selectedNodes] [lê: EST-L01-031 via selectedNodes].
8. `src/core/design/classes.ts:109` `const locked = firstLockRefusal(state.document, holding.map((found) => found.node.id as NodeId), 'status.locked.edit');` — um deles trancado recusa [lê: EST-L01-030 via firstLockRefusal].
9. `src/core/design/classes.ts:111` `const patches: Patch[] = holding.map((found) => ({ op: 'replace', path: [...found.path, 'classes'], value: found.node.classes.filter((c) => c !== className) }));` — cada um deixa de listar a classe.
10. `src/core/design/classes.ts:112` `return { kind: 'change', patches, message: message('status.classes.detached', { name: className }) };` — o tratador devolve os patches e a mensagem.
11. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
12. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
13. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
14. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:108` `if (holding.length === 0) return { kind: 'change' };` — nenhum selecionado lista a classe: `change` sem patch; algum lista: segue.
- R2 `src/core/design/classes.ts:110` `if (locked !== null) return { kind: 'refused', message: locked };` — um deles trancado: recusa `status.locked.edit`, nada muda; livres: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/classes.ts:105`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes` dos elementos, via argumentRefusal, selectedNodes, firstLockRefusal, commit), EST-L01-031 (a seleção, via selectedNodes, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `classes` de cada elemento, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os selecionados deixam de listar a classe (`src/core/design/classes.ts:111`); a classe permanece no projeto; a mensagem é `status.classes.detached`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; a barra de classes do inspector deixa de mostrar a classe.
- **DOM do canvas:** o canvas redesenha o documento sem os estilos da classe nos elementos.

## Regras
- G1: n/a — o comando escreve caminhos do documento a partir da seleção (`src/core/design/classes.ts:111`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:229` `'classes.detach': detachClassCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:112`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:112`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:105`).

## Medições
- nenhuma
