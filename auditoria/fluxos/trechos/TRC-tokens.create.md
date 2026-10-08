# TRC-tokens.create
- **Chamada:** `src/app/commands.ts:213` `'tokens.create': createToken,`
- **Argumentos:** `{ kind: enum [color, length, font-size], name: string, value: string }` — os argumentos do manifesto (`manifest/commands/design-system.json:118` `"kind": {`), os três obrigatórios.
- **Ramos que dependem dos argumentos:** R1, R2 e R3 (o `name` decide R1 e R2; o `kind` e o `value` decidem R3).

## Passos
1. `src/app/commands.ts:213` `'tokens.create': createToken,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/tokens.ts:183` `export const createToken = registerHandler('tokens.create', (context, { kind, name, value }): Outcome<never> => {` — o tratador recebe o contexto e os três argumentos.
7. `src/core/design/tokens.ts:185` `const typed = name.trim();` — o nome é aparado.
8. `src/core/design/tokens.ts:177` `const nameRefusal = (document: DocumentJson, name: string, except: string | null): Message | null => {` — `nameRefusal` julga o nome [lê: EST-L01-030 via nameRefusal].
9. `src/core/design/tokens.ts:178` `if (!NAME.test(name)) return message('status.tokens.badName', { name });` — nome fora do padrão é recusado.
10. `src/core/design/tokens.ts:179` `if (tokensOf(document).some((t) => t.name === name && t.name !== except)) return message('status.tokens.nameTaken', { name });` — nome já usado é recusado.
11. `src/core/design/tokens.ts:172` `function valueRefusal<Ui>(context: HandlerContext<Ui>, kind: string, value: string): Message | null {` — `valueRefusal` julga o valor pelo tipo [lê: EST-L01-030 via valueRefusal].
12. `src/core/design/tokens.ts:173` `const probe = probeOf(context, kind);` — a propriedade que lê o tipo é achada por `probeOf`.
13. `src/core/design/tokens.ts:186` `const refused = nameRefusal(state.document, typed, null) ?? valueRefusal(context, kind, value.trim());` — a primeira recusa vale.
14. `src/core/design/tokens.ts:187` `if (refused !== null) return { kind: 'refused', message: refused };` — recusa: nada muda.
15. `src/core/design/tokens.ts:190` `const patch: Patch = state.document.tokens === undefined ? { op: 'add', path: ['tokens'], value: [token] } : { op: 'add', path: ['tokens', held.length], value: token };` — o patch cria a lista `tokens` quando não há nenhuma, senão acrescenta no fim.
16. `src/core/design/tokens.ts:191` `return { kind: 'change', patches: [patch], message: message('status.tokens.created', { name: typed }) };` — o tratador devolve o patch e a mensagem.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/tokens.ts:178` `if (!NAME.test(name)) return message('status.tokens.badName', { name });` — nome inválido: recusa `status.tokens.badName`; válido: segue.
- R2 `src/core/design/tokens.ts:179` `if (tokensOf(document).some((t) => t.name === name && t.name !== except)) return message('status.tokens.nameTaken', { name });` — nome já usado por outra variável: recusa `status.tokens.nameTaken`; livre: segue.
- R3 `src/core/design/tokens.ts:175` `return read === null ? message('status.tokens.invalidValue', { value, kind: { key: `styles.kind.${kind}` as Message['key'] } }) : null;` — valor que o tipo não lê: recusa `status.tokens.invalidValue`; legível: segue.
- R4 `src/core/design/tokens.ts:190` `const patch: Patch = state.document.tokens === undefined ? { op: 'add', path: ['tokens'], value: [token] } : { op: 'add', path: ['tokens', held.length], value: token };` — `tokens` ausente: cria a lista; presente: acrescenta no fim.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/tokens.ts:183`); `readValue` (`src/core/design/tokens.ts:174`) é síncrono.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, nameRefusal, valueRefusal), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** o documento ganha a variável em `tokens` (`src/core/design/tokens.ts:190`); a mensagem é `status.tokens.created`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de variáveis lista a nova variável.
- **DOM do canvas:** nada muda (a variável só chega ao canvas pelo `:root` do render).

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/tokens.ts:190`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:213` `'tokens.create': createToken,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/tokens.ts:191`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/tokens.ts:191`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/tokens.ts:183`).

## Medições
- nenhuma
