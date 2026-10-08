# ENT-P-design-system-0029 — design.colourToVariable pela porta styles-site-colour-variable

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-design.colourToVariable`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o botão de variável da cor chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `design.colourToVariable` é desfazível, então `changesDocument` é `true`.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:224` `'design.colourToVariable': colourToVariableCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-design.colourToVariable`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não declara argumento do tipo `file`, `files` nem `clipboard`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:224`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-design.colourToVariable`

## Resultado
- **Estado final:** uma variável nova entra com a cor (`src/core/design/site-colours.ts:172` `const made: Patch = state.document.tokens === undefined ? { op: 'add', path: ['tokens'], value: [token] } : { op: 'add', path: ['tokens', held.length], value: token };`) e cada valor que era a cor passa a nomeá-la (`src/core/design/site-colours.ts:173` `const patches = replacing(state.document, from, `var(--${typed})`, true);`); a mensagem é `status.siteColours.madeVariable`.
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel de variáveis lista a variável nova.
- **DOM do canvas:** o canvas redesenha o documento com os valores a nomear a variável.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção e o tratador único decide.
- G4: n/a — a porta é o botão de variável de uma linha de site colour, não um ponto do canvas `manifest/commands/design-system.json:1373` `"kind": "panel-control",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:224`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-design.colourToVariable
- **Argumentos enviados:** `{ colour, name }` — a cor em uso e o nome da variável nova; esta porta envia `colour` com a cor da linha e `name` com o próximo nome livre de variável de cor (`src/editor/shell/variables.tsx:226` `args={{ colour, name }}`).
- R1 `src/core/design/site-colours.ts:166` `if (from === null) return { kind: 'refused', message: message('status.siteColours.notUsed', { colour }) };` — o `colour` desta porta é uma cor que o site usa (a linha lista as cores em uso); usada, o caminho segue.
- R2 `src/core/design/site-colours.ts:168` `if (!new RegExp(`^${IDENTIFIER_SOURCE}$`, 'u').test(typed)) return { kind: 'refused', message: message('status.tokens.badName', { name: typed }) };` e `src/core/design/site-colours.ts:169` `if (tokensOf(state.document).some((t) => t.name === typed)) return { kind: 'refused', message: message('status.tokens.nameTaken', { name: typed }) };` — o `name` desta porta é o próximo nome livre do tipo; válido e livre, o caminho segue; inválido ou tomado, para na recusa.
