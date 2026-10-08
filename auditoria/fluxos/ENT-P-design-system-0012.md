# ENT-P-design-system-0012 — classes.delete pela porta styles-class-delete

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-classes.delete`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `classes.delete` é desfazível, então `changesDocument` é `true`.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:231` `'classes.delete': deleteClassCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-classes.delete`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não declara argumento do tipo `file`, `files` nem `clipboard`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho da porta, de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:231`, é síncrono e termina antes do tratador; a confirmação do comando vem do trecho `TRC-classes.delete`.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-classes.delete`

## Resultado
- **Estado final:** sem a confirmação dada, o estado do trecho guarda `confirmation` à espera; com ela, a definição sai e os listadores deixam de listá-la (`src/core/design/classes.ts:165` `...classListers(state.document, className).map((at): Patch => ({ op: 'replace', path: [...at.path, 'classes'], value: at.node.classes.filter((name) => name !== className) })),`); a mensagem é `status.classes.deleted`.
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** a barra de status e o diálogo de confirmação; a vista Styles deixa de listar a classe.
- **DOM do canvas:** o canvas redesenha o documento sem os estilos da classe.

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção e o tratador único decide.
- G4: n/a — a porta é o botão de remover de uma linha da vista Styles, não um ponto do canvas `manifest/commands/design-system.json:658` `"kind": "panel-control",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:231`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-classes.delete
- **Argumentos enviados:** `{ className }` — o nome da classe da linha; esta porta envia `className` com o nome da linha (`src/editor/shell/sidebar/styles.tsx:51` `args={{ className: name }}`).
- nenhum ramo do trecho depende dos argumentos: o trecho o registra (`auditoria/fluxos/trechos/TRC-classes.delete.md:4` `- **Ramos que dependem dos argumentos:** nenhum ramo muda com o valor do argumento`); o `className` escolhe a classe e o `confirmed` decide R4.
