# TRC-classes.delete
- **Chamada:** `src/app/commands.ts:231` `'classes.delete': deleteClassCommand,`
- **Argumentos:** `{ className: string }` — o argumento `className` do manifesto (`manifest/commands/design-system.json:630` `"className": {`), obrigatório. O tratador recebe também `confirmed`.
- **Ramos que dependem dos argumentos:** nenhum ramo muda com o valor do argumento; `className` escolhe a classe, e `confirmed` decide R4.

## Passos
1. `src/app/commands.ts:231` `'classes.delete': deleteClassCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador (primeira vez, sem confirmação).
6. `src/core/design/classes.ts:156` `export const deleteClassCommand = registerHandler('classes.delete', ({ state, confirmed }, { className }): Outcome<never> => {` — o tratador recebe o estado (com `confirmed`) e o argumento `className`.
7. `src/core/design/classes.ts:157` `const classes = classesOf(state.document);` — a lista de classes é lida [lê: EST-L01-030 via classesOf].
8. `src/core/design/classes.ts:158` `const index = classes.findIndex((c) => c.name === className);` — o índice da classe é achado.
9. `src/core/design/classes.ts:159` `if (index < 0) return { kind: 'change' };` — classe ausente: `change` sem patch.
10. `src/core/design/classes.ts:160` `const uses = classUses(state.document, className);` — os elementos que a listam nas páginas [lê: EST-L01-030 via classUses].
11. `src/core/design/classes.ts:161` `const locked = firstLockRefusal(state.document, uses.map((at) => at.node.id as NodeId), 'status.locked.edit');` — um deles trancado recusa [lê: EST-L01-030 via firstLockRefusal].
12. `src/core/design/classes.ts:163` `if (!confirmed) return { kind: 'confirm', params: { count: uses.length } };` — sem confirmação, o tratador pede a confirmação.
13. `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {` — a store trata o pedido de confirmação.
14. `src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));` — a store publica a confirmação à espera [escreve: EST-L01-034 via publish].
15. `src/core/store/store.ts:698` `return run(waiting.command, waiting.args as CommandArgs[typeof waiting.command], null, true);` — respondida que sim, o comando roda de novo com `confirmed` verdadeiro.
16. `src/core/design/classes.ts:164` `const patches: Patch[] = [` — com confirmação, o elenco de patches começa.
17. `src/core/design/classes.ts:165` `...classListers(state.document, className).map((at): Patch => ({ op: 'replace', path: [...at.path, 'classes'], value: at.node.classes.filter((name) => name !== className) })),` — cada listador deixa de listar a classe [lê: EST-L01-030 via classListers].
18. `src/core/design/classes.ts:166` `classes.length === 1 ? { op: 'remove', path: ['classes'] } : { op: 'remove', path: ['classes', index] },` — a definição sai (a lista inteira quando é a última).
19. `src/core/design/classes.ts:168` `return { kind: 'change', patches, message: message('status.classes.deleted', { name: className, count: uses.length }) };` — o tratador devolve os patches e a mensagem.
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:159` `if (index < 0) return { kind: 'change' };` — classe ausente: `change` sem patch; presente: segue.
- R2 `src/core/design/classes.ts:162` `if (locked !== null) return { kind: 'refused', message: locked };` — um listador trancado: recusa `status.locked.edit`, nada muda; livres: segue.
- R3 `src/core/design/classes.ts:163` `if (!confirmed) return { kind: 'confirm', params: { count: uses.length } };` — sem confirmação: `confirm` com a contagem; confirmada: segue para os patches.
- R4 `src/core/design/classes.ts:166` `classes.length === 1 ? { op: 'remove', path: ['classes'] } : { op: 'remove', path: ['classes', index] },` — última classe: tira a lista; mais de uma: tira a do índice.

## Fronteiras assíncronas
- a confirmação (`src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));`): entre o pedido e a resposta, o estado fica com `confirmation` à espera, e nenhuma entrada muda o documento; a resposta de sim re-roda o comando (`src/core/store/store.ts:671`).

## Estado
- Lê: EST-L01-030 (documento `classes` e os elementos que a listam, via argumentRefusal, classesOf, classUses, firstLockRefusal, classListers, commit), EST-L01-031 (a seleção, via commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `classes` de cada listador e a definição, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish), EST-L01-034 (a confirmação, via publish).

## Resultado
- **Estado final:** com a confirmação dada, a definição sai e os listadores deixam de listá-la (`src/core/design/classes.ts:165`, `src/core/design/classes.ts:166`); a mensagem é `status.classes.deleted`. Sem a confirmação, o estado guarda `confirmation` à espera.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status e o diálogo de confirmação; a barra de classes do inspector deixa de mostrar a classe.
- **DOM do canvas:** o canvas redesenha o documento sem os estilos da classe.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/classes.ts:165`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:231` `'classes.delete': deleteClassCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:168`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:168`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:156`).

## Medições
- nenhuma
