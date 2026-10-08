# TRC-tokens.rename
- **Chamada:** `src/app/commands.ts:225` `'tokens.rename': renameToken,`
- **Argumentos:** `{ token: string, name: string }` — `token` refere uma variável (`manifest/commands/design-system.json:256` `"refers": "token"`); `name` é o nome novo. Os dois obrigatórios.
- **Ramos que dependem dos argumentos:** R1, R2 e R3 (o `token` decide R1; o `name` decide R2 e R3).

## Passos
1. `src/app/commands.ts:225` `'tokens.rename': renameToken,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto; `token` ausente do projeto é `status.stale` [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/tokens.ts:215` `export const renameToken = registerHandler('tokens.rename', (context, { token, name }): Outcome<never> => {` — o tratador recebe o contexto e os dois argumentos.
7. `src/core/design/tokens.ts:218` `indexOf(state.document, token);` — a variável tem de ser a do projeto [lê: EST-L01-030 via indexOf].
8. `src/core/design/tokens.ts:219` `const typed = name.trim();` — o nome novo é aparado.
9. `src/core/design/tokens.ts:220` `const said = message('status.tokens.renamed', { from: token, to: typed });` — a mensagem é montada.
10. `src/core/design/tokens.ts:222` `const refused = nameRefusal(state.document, typed, token);` — o nome novo é julgado, deixando de fora a própria variável [lê: EST-L01-030 via nameRefusal].
11. `src/core/design/tokens.ts:224` `return { kind: 'change', patches: renameTokenPatches(state.document, token, typed), message: said };` — o tratador devolve os patches de renomeação.
12. `src/core/design/tokens.ts:230` `export function renameTokenPatches(document: DocumentJson, from: string, to: string): Patch[] {` — `renameTokenPatches` monta os patches [lê: EST-L01-030 via renameTokenPatches].
13. `src/core/design/tokens.ts:232` `const uses: Patch[] = usesOf(document, from).map((use) => ({ op: 'replace', path: use.path, value: renamedIn(use.value, from, to) }));` — cada valor que nomeia a variável é reescrito.
14. `src/core/design/tokens.ts:233` `return [{ op: 'replace', path: ['tokens', at, 'name'], value: to }, ...uses];` — o nome da variável e todos os usos.
15. `src/core/design/tokens.ts:118` `export function usesOf(document: DocumentJson, name: string): readonly Use[] {` — `usesOf` percorre páginas, classes, componentes, timelines e variáveis [lê: EST-L01-030 via usesOf].
16. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
17. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/tokens.ts:221` `if (typed === token) return { kind: 'change', message: said };` — nome novo igual ao antigo: `change` sem patch; diferente: segue.
- R2 `src/core/design/tokens.ts:222` `const refused = nameRefusal(state.document, typed, token);` — nome inválido ou já usado por outra variável: recusa (`status.tokens.badName` ou `status.tokens.nameTaken`); livre: segue.
- R3 `src/core/design/tokens.ts:223` `if (refused !== null) return { kind: 'refused', message: refused };` — com recusa, nada muda; sem recusa, monta os patches no passo 11.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/tokens.ts:215`); `usesOf` (`src/core/design/tokens.ts:118`) percorre o documento em memória.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, indexOf, nameRefusal, renameTokenPatches, usesOf), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o nome da variável e todo valor que a nomeia mudam (`src/core/design/tokens.ts:233`); a mensagem é `status.tokens.renamed` (`src/core/design/tokens.ts:220`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo de nome e o `:root` do render refletem o nome novo.
- **DOM do canvas:** o canvas redesenha o documento com os valores renomeados.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/tokens.ts:233`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:225` `'tokens.rename': renameToken,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/tokens.ts:224`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/tokens.ts:224`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/tokens.ts:215`).

## Medições
- nenhuma
