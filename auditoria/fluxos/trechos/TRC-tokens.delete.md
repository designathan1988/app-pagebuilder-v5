# TRC-tokens.delete
- **Chamada:** `src/app/commands.ts:226` `'tokens.delete': deleteToken,`
- **Argumentos:** `{ token: string }` — `token` refere uma variável (`manifest/commands/design-system.json:319` `"refers": "token"`), obrigatório.
- **Ramos que dependem dos argumentos:** R1, R2 e R3 (o `token` escolhe a variável; o documento decide R1, R2 e R3).

## Passos
1. `src/app/commands.ts:226` `'tokens.delete': deleteToken,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos; `token` ausente do projeto é `status.stale` [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/tokens.ts:236` `export const deleteToken = registerHandler('tokens.delete', ({ state }, { token }): Outcome<never> => {` — o tratador recebe o estado e o argumento `token`.
7. `src/core/design/tokens.ts:237` `const at = indexOf(state.document, token);` — o índice da variável é achado [lê: EST-L01-030 via indexOf].
8. `src/core/design/tokens.ts:239` `const count = usesToken(document, token);` — conta-se quantos elementos usam a variável [lê: EST-L01-030 via usesToken].
9. `src/core/design/tokens.ts:149` `export function usesToken(document: DocumentJson, name: string): number {` — `usesToken` soma os elementos que a nomeiam.
10. `src/core/design/tokens.ts:242` `if (usesOf(document, token).length > 0) return { kind: 'refused', message: message('status.tokens.inUseShared', { name: token }) };` — um portador compartilhado (classe, componente, outra variável) recusa [lê: EST-L01-030 via usesOf].
11. `src/core/design/tokens.ts:243` `const patch: Patch = tokensOf(document).length === 1 ? { op: 'remove', path: ['tokens'] } : { op: 'remove', path: ['tokens', at] };` — o patch tira a lista inteira quando é a última, senão a variável do índice.
12. `src/core/design/tokens.ts:244` `return { kind: 'change', patches: [patch], message: message('status.tokens.deleted', { name: token }) };` — o tratador devolve o patch e a mensagem.
13. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica o patch [escreve: EST-L01-030 via applyPatches].
14. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/tokens.ts:240` `if (count > 0) return { kind: 'refused', message: message('status.tokens.inUse', { name: token, count }) };` — elementos usam a variável: recusa `status.tokens.inUse`, nada muda; nenhum: segue.
- R2 `src/core/design/tokens.ts:242` `if (usesOf(document, token).length > 0) return { kind: 'refused', message: message('status.tokens.inUseShared', { name: token }) };` — um portador compartilhado a usa: recusa `status.tokens.inUseShared`; nenhum: segue.
- R3 `src/core/design/tokens.ts:243` `const patch: Patch = tokensOf(document).length === 1 ? { op: 'remove', path: ['tokens'] } : { op: 'remove', path: ['tokens', at] };` — só uma variável: o patch tira a lista `tokens`; mais de uma: tira a do índice.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/tokens.ts:236`); `usesToken` e `usesOf` percorrem o documento em memória.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, indexOf, usesToken, usesOf), EST-L05a-001 (a digitação pendente, via beforeCommand).
- Escreve: EST-L01-030 (o documento, via run, applyPatches, publish), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a variável sai de `tokens` (`src/core/design/tokens.ts:243`); a mensagem é `status.tokens.deleted` (`src/core/design/tokens.ts:244`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel de variáveis deixa de listá-la.
- **DOM do canvas:** nada muda (nenhum valor usava a variável, senão teria sido recusado).

## Regras
- G1: n/a — o comando escreve um caminho fixo do documento (`src/core/design/tokens.ts:243`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:226` `'tokens.delete': deleteToken,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/tokens.ts:244`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/tokens.ts:244`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/tokens.ts:236`).

## Medições
- nenhuma
