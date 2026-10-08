# ENT-P-design-system-0003 — tokens.create pela porta variables-add

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-tokens.create`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `tokens.create` é desfazível, então `changesDocument` é `true`.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:213` `'tokens.create': createToken,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-tokens.create`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não declara argumento do tipo `file`, `files` nem `clipboard`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:213`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-tokens.create`

## Resultado
- **Estado final:** o documento ganha a variável em `tokens` (`src/core/design/tokens.ts:190` `const patch: Patch = state.document.tokens === undefined ? { op: 'add', path: ['tokens'], value: [token] } : { op: 'add', path: ['tokens', held.length], value: token };`); a mensagem é `status.tokens.created`.
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel de variáveis lista a variável nova.
- **DOM do canvas:** o canvas redesenha o documento com a variável nova no `:root`.

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção e o tratador único decide.
- G4: n/a — a porta é um controle desenhado no painel de variáveis, não um ponto do canvas `manifest/commands/design-system.json:158` `"kind": "panel-control",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:213`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-tokens.create
- **Argumentos enviados:** `{ kind, name, value }` — o tipo, o nome e o valor da variável nova; esta porta envia os três do item escolhido na lista de tipos (`src/editor/shell/variables.tsx:114` `args={{ kind, name: nextName(kind, tokens), value: FIRST_VALUES[i] ?? '' }}`).
- R1 `src/core/design/tokens.ts:178` `if (!NAME.test(name)) return message('status.tokens.badName', { name });` — o `name` desta porta é o próximo nome livre do tipo (`nextName`), no padrão; válido, o caminho segue.
- R2 `src/core/design/tokens.ts:179` `if (tokensOf(document).some((t) => t.name === name && t.name !== except)) return message('status.tokens.nameTaken', { name });` — o nome vem de `nextName`, que não repete um existente; livre, segue para o valor.
- R3 `src/core/design/tokens.ts:175` `return read === null ? message('status.tokens.invalidValue', { value, kind: { key: `styles.kind.${kind}` as Message['key'] } }) : null;` — o `value` desta porta é o primeiro valor do tipo (`FIRST_VALUES`); legível, o caminho segue para o patch.
