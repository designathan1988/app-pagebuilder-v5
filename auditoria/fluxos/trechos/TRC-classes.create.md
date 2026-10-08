# TRC-classes.create
- **Chamada:** `src/app/commands.ts:227` `'classes.create': createClassCommand,`
- **Argumentos:** `{ name: string }` — o argumento `name` do manifesto (`manifest/commands/design-system.json:373` `"name": {`), obrigatório.
- **Ramos que dependem dos argumentos:** R2 e R3 (o valor de `name` decide R2 e R3).

## Passos
1. `src/app/commands.ts:227` `'classes.create': createClassCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `singleSelection` é lida antes do tratador [lê: EST-L01-031 via run].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/design/classes.ts:71` `export const createClassCommand = registerHandler('classes.create', (context, { name }): Outcome<never> => {` — o tratador recebe o contexto e o argumento `name`.
8. `src/core/design/classes.ts:73` `const typed = name.trim();` — o nome é aparado.
9. `src/core/design/classes.ts:50` `const selectedNodes = <Ui>({ state }: HandlerContext<Ui>) => state.selection.map((id) => locate(state.document, id)).filter((found) => found !== null);` — os elementos selecionados são achados [lê: EST-L01-030 via selectedNodes] [lê: EST-L01-031 via selectedNodes].
10. `src/core/design/classes.ts:74` `const found = selectedNodes(context)[0];` — o primeiro selecionado.
11. `src/core/design/classes.ts:76` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome que não é identificador é recusado.
12. `src/core/design/classes.ts:77` `if (classesOf(state.document).some((c) => c.name === typed)) return { kind: 'refused', message: message('status.classes.nameTaken', { name: typed }) };` — nome já usado é recusado [lê: EST-L01-030 via classesOf].
13. `src/core/design/classes.ts:78` `const locked = firstLockRefusal(state.document, [found.node.id as NodeId], 'status.locked.edit');` — um elemento trancado recusa [lê: EST-L01-030 via firstLockRefusal].
14. `src/core/design/classes.ts:80` `const patches: Patch[] = [classAdded(state.document, { name: typed, styles: found.node.styles })];` — a classe nova leva os estilos próprios do elemento [lê: EST-L01-030 via classAdded].
15. `src/core/design/classes.ts:67` `function classAdded(document: DocumentJson, styleClass: StyleClass): Patch {` — `classAdded` monta o patch da lista `classes`.
16. `src/core/design/classes.ts:81` `if (Object.keys(found.node.styles).length > 0) patches.push({ op: 'replace', path: [...found.path, 'styles'], value: {} });` — o elemento fica sem estilos próprios.
17. `src/core/design/classes.ts:82` `if (!found.node.classes.includes(typed)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: [...found.node.classes, typed] });` — o elemento passa a listar a classe.
18. `src/core/design/classes.ts:83` `return { kind: 'change', patches, message: message('status.classes.created', { name: typed, element: found.node.name }) };` — o tratador devolve os patches e a mensagem.
19. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
20. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/classes.ts:75` `if (found === undefined) return { kind: 'change' };` — nada selecionado: `change` sem patch, nada muda; com seleção: segue.
- R2 `src/core/design/classes.ts:76` `if (!isIdentifier(typed)) return { kind: 'refused', message: message('status.classes.badName', { name: typed }) };` — nome inválido: recusa `status.classes.badName`; válido: segue.
- R3 `src/core/design/classes.ts:77` `if (classesOf(state.document).some((c) => c.name === typed)) return { kind: 'refused', message: message('status.classes.nameTaken', { name: typed }) };` — nome já usado: recusa `status.classes.nameTaken`; livre: segue.
- R4 `src/core/design/classes.ts:79` `if (locked !== null) return { kind: 'refused', message: locked };` — elemento trancado (ou dentro de um): recusa `status.locked.edit`; livre: segue.
- R5 `src/core/design/classes.ts:81` `if (Object.keys(found.node.styles).length > 0) patches.push({ op: 'replace', path: [...found.path, 'styles'], value: {} });` — o elemento tem estilos próprios: o patch os esvazia; sem estilos: esse patch não entra.
- R6 `src/core/design/classes.ts:82` `if (!found.node.classes.includes(typed)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: [...found.node.classes, typed] });` — já lista a classe: não acrescenta; não lista: acrescenta.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/classes.ts:71`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, via run, argumentRefusal, selectedNodes, classesOf, firstLockRefusal, classAdded, commit), EST-L01-031 (a seleção, via run, selectedNodes, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `classes`, o elemento: `styles` e `classes`, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** uma classe nova recebe os estilos do elemento (`src/core/design/classes.ts:80`), o elemento fica sem estilos próprios e passa a listá-la; a mensagem é `status.classes.created`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; a barra de classes do inspector mostra a classe nova.
- **DOM do canvas:** o canvas redesenha o documento; a página fica igual (os estilos passam para a classe).

## Regras
- G1: n/a — o comando escreve caminhos do documento a partir da seleção (`src/core/design/classes.ts:81`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:227` `'classes.create': createClassCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/classes.ts:83`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/classes.ts:83`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/classes.ts:71`).

## Medições
- nenhuma
