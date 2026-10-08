# TRC-design.colourToVariable
- **Chamada:** `src/app/commands.ts:224` `'design.colourToVariable': colourToVariableCommand,`
- **Argumentos:** `{ colour: string, name: string }` — `colour` é a cor em uso e `name` o nome da variável nova (`manifest/commands/design-system.json:1342` `"colour": {`). Os dois obrigatórios.
- **Ramos que dependem dos argumentos:** R1 e R2 (o `colour` decide R1 e R3; o `name` decide R2).

## Passos
1. `src/app/commands.ts:224` `'design.colourToVariable': colourToVariableCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/site-colours.ts:163` `export const colourToVariableCommand = registerHandler('design.colourToVariable', (context, { colour, name }): Outcome<never> => {` — o tratador recebe o contexto e os dois argumentos.
7. `src/core/design/site-colours.ts:165` `const from = knownColour(context, colour);` — a cor em uso é reduzida à sua grafia uma [lê: EST-L01-030 via knownColour].
8. `src/core/design/site-colours.ts:167` `const typed = name.trim();` — o nome é aparado.
9. `src/core/design/site-colours.ts:168` `if (!new RegExp(`^${IDENTIFIER_SOURCE}$`, 'u').test(typed)) return { kind: 'refused', message: message('status.tokens.badName', { name: typed }) };` — nome fora do padrão de variável é recusado.
10. `src/core/design/site-colours.ts:169` `if (tokensOf(state.document).some((t) => t.name === typed)) return { kind: 'refused', message: message('status.tokens.nameTaken', { name: typed }) };` — nome já usado é recusado [lê: EST-L01-030 via tokensOf].
11. `src/core/design/site-colours.ts:170` `const token = { name: typed, kind: COLOUR_KIND, value: from };` — a variável nova toma a cor como valor.
12. `src/core/design/site-colours.ts:172` `const made: Patch = state.document.tokens === undefined ? { op: 'add', path: ['tokens'], value: [token] } : { op: 'add', path: ['tokens', held.length], value: token };` — o patch cria a variável.
13. `src/core/design/site-colours.ts:173` `const patches = replacing(state.document, from, `var(--${typed})`, true);` — os valores que são a cor passam a nomear a variável [lê: EST-L01-030 via replacing].
14. `src/core/design/site-colours.ts:174` `const locked = lockedBy(state.document, patches);` — um elemento trancado que os patches mudariam recusa [lê: EST-L01-030 via lockedBy].
15. `src/core/design/site-colours.ts:176` `return { kind: 'change', patches: [made, ...patches], message: message('status.siteColours.madeVariable', { colour: from, name: typed, count: patches.length }) };` — o tratador devolve os patches (a variável e os valores) e a mensagem.
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
17. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/site-colours.ts:166` `if (from === null) return { kind: 'refused', message: message('status.siteColours.notUsed', { colour }) };` — cor que o site não usa: recusa `status.siteColours.notUsed`; usada: segue.
- R2 `src/core/design/site-colours.ts:168` (nome fora do padrão) e `src/core/design/site-colours.ts:169` (nome já usado) — nome inválido ou tomado: recusa (`status.tokens.badName` ou `status.tokens.nameTaken`); livre e válido: segue.
- R3 `src/core/design/site-colours.ts:173` `const patches = replacing(state.document, from, `var(--${typed})`, true);` — os valores que são a cor por inteiro passam a nomear a variável; nenhum valor é a cor por inteiro: só a variável entra.
- R4 `src/core/design/site-colours.ts:175` `if (locked !== null) return { kind: 'refused', message: locked };` — um elemento que os patches mudariam trancado: recusa `status.locked.edit`; livres: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/site-colours.ts:163`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento: `tokens`, os valores de estilo do projeto, elementos das páginas), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `tokens` e cada valor que era a cor), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** uma variável nova entra com a cor (`src/core/design/site-colours.ts:172`) e cada valor que era a cor passa a nomeá-la (`src/core/design/site-colours.ts:173`); a mensagem é `status.siteColours.madeVariable`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de variáveis lista a variável nova.
- **DOM do canvas:** o canvas redesenha o documento com os valores a nomear a variável.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/site-colours.ts:173`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:224` `'design.colourToVariable': colourToVariableCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/site-colours.ts:176`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/site-colours.ts:176`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/site-colours.ts:163`).

## Medições
- nenhuma
