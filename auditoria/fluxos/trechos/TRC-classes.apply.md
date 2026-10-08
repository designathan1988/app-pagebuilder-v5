# TRC-classes.apply
- **Chamada:** `src/app/commands.ts:228` `'classes.apply': applyClassCommand,`
- **Argumentos:** `{ className: string }` — o argumento `className` do manifesto (`manifest/commands/design-system.json:431` `"className": {`), obrigatório.
- **Ramos que dependem dos argumentos:** R2 (o valor de `className` decide a recusa por nome).

## Passos
1. `src/app/commands.ts:228` `'classes.apply': applyClassCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (a de `inspector-class-add` ou a de `command-bar-apply-class`).
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/classes.ts:86` `export const applyClassCommand = registerHandler('classes.apply', (context, { className }): Outcome<never> => {` — o tratador recebe o contexto e o argumento `className`.
7. `src/core/design/classes.ts:88` `const typed = className.trim();` — o nome é aparado.
8. `src/core/design/classes.ts:89` `const nodes = selectedNodes(context);` — os selecionados são achados [lê: EST-L01-030 via selectedNodes] [lê: EST-L01-031 via selectedNodes].
9. `src/core/design/classes.ts:91` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome que não é identificador é recusado.
10. `src/core/design/classes.ts:92` `const without = nodes.filter((found) => !found.node.classes.includes(typed));` — só os que ainda não listam a classe.
11. `src/core/design/classes.ts:93` `const locked = firstLockRefusal(state.document, without.map((found) => found.node.id as NodeId), 'status.locked.edit');` — um deles trancado recusa [lê: EST-L01-030 via firstLockRefusal].
12. `src/core/design/classes.ts:97` `const defined = classesOf(state.document).some((c) => c.name === typed);` — verifica-se se a classe já está definida [lê: EST-L01-030 via classesOf].
13. `src/core/design/classes.ts:98` `const patches: Patch[] = [` — o elenco de patches começa.
14. `src/core/design/classes.ts:99` `...(defined ? [] : [classAdded(state.document, { name: typed, styles: {} })]),` — classe nova entra sem estilos.
15. `src/core/design/classes.ts:100` `...without.map((found): Patch => ({ op: 'replace', path: [...found.path, 'classes'], value: [...found.node.classes, typed] })),` — cada elemento passa a listá-la.
16. `src/core/design/classes.ts:102` `return { kind: 'change', patches, message: said };` — o tratador devolve os patches e a mensagem.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:90` `if (nodes.length === 0) return { kind: 'change' };` — nada selecionado: `change` sem patch; com seleção: segue.
- R2 `src/core/design/classes.ts:91` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome inválido: recusa `status.classes.badName`; válido: segue.
- R3 `src/core/design/classes.ts:94` `if (locked !== null) return { kind: 'refused', message: locked };` — um selecionado trancado: recusa `status.locked.edit`; livres: segue.
- R4 `src/core/design/classes.ts:96` `if (without.length === 0) return { kind: 'change', message: said };` — todos já listam a classe: `change` sem patch; alguém não lista: segue.
- R5 `src/core/design/classes.ts:99` `...(defined ? [] : [classAdded(state.document, { name: typed, styles: {} })]),` — a classe não existe: entra uma definição vazia; existe: não entra.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/classes.ts:86`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, via argumentRefusal, selectedNodes, firstLockRefusal, classesOf, commit), EST-L01-031 (a seleção, via selectedNodes, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `classes` e `classes` de cada elemento, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os elementos que não listavam a classe passam a listá-la (`src/core/design/classes.ts:100`), e uma classe nova entra sem estilos (`src/core/design/classes.ts:99`); a mensagem é `status.classes.applied` (`src/core/design/classes.ts:95`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; a barra de classes do inspector mostra a classe aplicada.
- **DOM do canvas:** o canvas redesenha o documento com os estilos da classe onde houver.

## Regras
- G1: n/a — o comando escreve caminhos do documento a partir da seleção (`src/core/design/classes.ts:100`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:228` `'classes.apply': applyClassCommand,` — uma porta de painel e uma da command bar chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:102`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:102`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:86`).

## Medições
- nenhuma
