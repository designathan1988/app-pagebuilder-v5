# TRC-tokens.update
- **Chamada:** `src/app/commands.ts:214` `'tokens.update': updateToken,`
- **Argumentos:** `{ token: string, value: string }` — `token` refere uma variável (`manifest/commands/design-system.json:194` `"refers": "token"`); `value` é o texto novo. Os dois obrigatórios.
- **Ramos que dependem dos argumentos:** R1 e R2 (o `value` decide R1 e R2; o `token` decide o índice).

## Passos
1. `src/app/commands.ts:214` `'tokens.update': updateToken,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto; um `token` que o projeto não tem é `status.stale` [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/tokens.ts:203` `export const updateToken = registerHandler('tokens.update', (context, { token, value }): Outcome<never> => {` — o tratador recebe o contexto e os dois argumentos.
7. `src/core/design/tokens.ts:205` `const at = indexOf(state.document, token);` — o índice da variável é achado [lê: EST-L01-030 via indexOf].
8. `src/core/design/tokens.ts:197` `function indexOf(document: DocumentJson, name: string): number {` — `indexOf` percorre `tokens`; acha o índice ou lança.
9. `src/core/design/tokens.ts:206` `const held = tokensOf(state.document)[at] as Token;` — a variável guardada é lida, com o seu `kind`.
10. `src/core/design/tokens.ts:207` `const typed = value.trim();` — o valor é aparado.
11. `src/core/design/tokens.ts:208` `const refused = valueRefusal(context, held.kind, typed);` — o valor é julgado pelo tipo da variável [lê: EST-L01-030 via valueRefusal].
12. `src/core/design/tokens.ts:210` `const said = message('status.tokens.updated', { name: held.name, value: typed });` — a mensagem é montada.
13. `src/core/design/tokens.ts:211` `if (held.value === typed) return { kind: 'change', message: said };` — valor igual: `change` sem patch.
14. `src/core/design/tokens.ts:212` `return { kind: 'change', patches: [{ op: 'replace', path: ['tokens', at, 'value'], value: typed }], message: said };` — o patch troca o valor.
15. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
16. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
17. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
18. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/tokens.ts:209` `if (refused !== null) return { kind: 'refused', message: refused };` — valor que o tipo não lê: recusa `status.tokens.invalidValue`, nada muda; legível: segue.
- R2 `src/core/design/tokens.ts:211` `if (held.value === typed) return { kind: 'change', message: said };` — valor igual ao guardado: `change` sem patch; diferente: segue para o passo 14.
- R3 `src/core/design/tokens.ts:197` `function indexOf(document: DocumentJson, name: string): number {` — variável ausente de `tokens`: lança (o argumento `refers: token` já a recusa antes, em `status.stale`).

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/tokens.ts:203`); `readValue` (`src/core/design/tokens.ts:174`) é síncrono.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, indexOf, valueRefusal), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o valor da variável muda (`src/core/design/tokens.ts:212`); a mensagem é `status.tokens.updated` (`src/core/design/tokens.ts:210`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo de valor e o `:root` do render refletem o valor novo.
- **DOM do canvas:** o canvas redesenha o documento com o valor novo da variável.

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/tokens.ts:212`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:214` `'tokens.update': updateToken,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/tokens.ts:212`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/tokens.ts:212`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/tokens.ts:203`).

## Medições
- nenhuma
