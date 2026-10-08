# TRC-design.applySuggestion
- **Chamada:** `src/app/commands.ts:221` `'design.applySuggestion': applySuggestionCommand,`
- **Argumentos:** `{ type: string, name: string }` — `type` é o tipo de elemento e `name` o nome da classe nova (`manifest/commands/design-system.json:1562` `"type": {`). Os dois obrigatórios.
- **Ramos que dependem dos argumentos:** R1 e R2 (o `type` decide R1; o `name` decide R2).

## Passos
1. `src/app/commands.ts:221` `'design.applySuggestion': applySuggestionCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/suggest.ts:62` `export const applySuggestionCommand = registerHandler('design.applySuggestion', (context, { type, name }): Outcome<never> => {` — o tratador recebe o contexto e os dois argumentos.
7. `src/core/design/suggest.ts:64` `const suggestion = suggestionsOf(state.document).find((one) => one.type === type);` — a sugestão do tipo é achada [lê: EST-L01-030 via suggestionsOf].
8. `src/core/design/suggest.ts:39` `export function suggestionsOf(document: DocumentJson): readonly Suggestion[] {` — `suggestionsOf` acha as declarações que todos os elementos de um tipo partilham.
9. `src/core/design/suggest.ts:66` `const typed = name.trim();` — o nome é aparado.
10. `src/core/design/suggest.ts:67` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome que não é identificador é recusado.
11. `src/core/design/suggest.ts:68` `if (classesOf(state.document).some((one) => one.name === typed)) return { kind: 'refused', message: message('status.classes.nameTaken', { name: typed }) };` — nome já usado é recusado [lê: EST-L01-030 via classesOf].
12. `src/core/design/suggest.ts:69` `const locked = firstLockRefusal(state.document, suggestion.nodes, 'status.locked.edit');` — um elemento do tipo trancado recusa [lê: EST-L01-030 via firstLockRefusal].
13. `src/core/design/suggest.ts:71` `const styleClass: StyleClass = { name: typed, styles: { [BASE_BREAKPOINT]: { [BASE_STATE]: suggestion.declarations } } as StyleClass['styles'] };` — a classe nova leva as declarações partilhadas.
14. `src/core/design/suggest.ts:72` `const patches: Patch[] = [state.document.classes === undefined ? { op: 'add', path: ['classes'], value: [styleClass] } : { op: 'add', path: ['classes', classesOf(state.document).length], value: styleClass }];` — a classe nova entra.
15. `src/core/design/suggest.ts:74` `const at = locate(state.document, id);` — a posição de cada elemento do tipo [lê: EST-L01-030 via locate].
16. `src/core/design/suggest.ts:76` `const kept = Object.fromEntries(Object.entries(baseOf(at.node)).filter(([property]) => !(property in suggestion.declarations)));` — as declarações que o elemento mantém.
17. `src/core/design/suggest.ts:86` `patches.push({ op: 'replace', path: [...at.path, 'styles'], value: styles });` — os estilos do elemento ficam sem as partilhadas.
18. `src/core/design/suggest.ts:87` `if (!at.node.classes.includes(typed)) patches.push({ op: 'replace', path: [...at.path, 'classes'], value: [...at.node.classes, typed] });` — o elemento passa a listar a classe.
19. `src/core/design/suggest.ts:89` `return { kind: 'change', patches, message: message('status.suggest.applied', { name: typed, count: suggestion.nodes.length }) };` — o tratador devolve os patches e a mensagem.
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
22. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
23. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/suggest.ts:65` `if (suggestion === undefined) return { kind: 'refused', message: message('status.suggest.none', { type }) };` — sem sugestão para o tipo: recusa `status.suggest.none`; com sugestão: segue.
- R2 `src/core/design/suggest.ts:67` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome inválido: recusa `status.classes.badName`; válido: segue.
- R3 `src/core/design/suggest.ts:68` `if (classesOf(state.document).some((one) => one.name === typed)) return { kind: 'refused', message: message('status.classes.nameTaken', { name: typed }) };` — nome já usado: recusa `status.classes.nameTaken`; livre: segue.
- R4 `src/core/design/suggest.ts:70` `if (locked !== null) return { kind: 'refused', message: locked };` — um elemento do tipo trancado: recusa `status.locked.edit`; livres: segue.
- R5 `src/core/design/suggest.ts:72` `const patches: Patch[] = [state.document.classes === undefined ? { op: 'add', path: ['classes'], value: [styleClass] } : { op: 'add', path: ['classes', classesOf(state.document).length], value: styleClass }];` — `classes` ausente: cria a lista; presente: acrescenta no fim.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/suggest.ts:62`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, estilos dos elementos), EST-L01-031 (seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `classes` e os estilos e classes dos elementos do tipo), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** uma classe nova toma as declarações partilhadas (`src/core/design/suggest.ts:71`), cada elemento do tipo passa a listá-la e fica sem essas declarações próprias (`src/core/design/suggest.ts:86`); a mensagem é `status.suggest.applied`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de variáveis oferece a sugestão aplicada.
- **DOM do canvas:** o canvas redesenha o documento; os elementos ficam iguais (as declarações passam para a classe).

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/suggest.ts:86`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:221` `'design.applySuggestion': applySuggestionCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/suggest.ts:89`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/suggest.ts:89`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/suggest.ts:62`).

## Medições
- nenhuma
