# ENT-P-design-system-0035 — components.setVariant pela porta inspector-component-variant

Fluxo de porta do domínio `design-system`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-components.setVariant`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o campo Variant chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — lê-se da tabela `UNDOABLE` (do manifesto) se o comando muda o documento; `components.setVariant` é desfazível, então `changesDocument` é `true`.
4. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:236` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
9. `src/app/commands.ts:220` `'components.setVariant': setVariantCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-components.setVariant`).

## Ramos
- R1 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando desta porta não declara argumento do tipo `file`, `files` nem `clipboard`, então `file` é `undefined` e o caminho segue para a linha 144.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:247` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:220`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-components.setVariant`

## Resultado
- **Estado final:** a raiz da instância passa a listar a classe da variante (ou perde a variante, com `typed` vazio) (`src/core/design/components.ts:468` `if (!deepEqual(classes, root.classes)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: classes });`), e a classe da variante entra vazia quando faltava (`src/core/design/components.ts:466` `patches.push(state.document.classes === undefined ? { op: 'add', path: ['classes'], value: [{ name: className, styles: {} }] } : { op: 'add', path: ['classes', held.length], value: { name: className, styles: {} } });`); a mensagem é `status.components.variantSet` ou `status.components.variantCleared`.
- **Re-renderizado:** os assinantes ouvem `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`.
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o campo de variante do inspector mostra a escolha.
- **DOM do canvas:** o canvas redesenha o documento com os estilos da variante.

## Regras
- G1: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar, e o campo só o despacha quando difere (`src/editor/shell/panel-field.tsx:84` `if (argument === null || chosen === value) return;`).
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção e o tratador único decide.
- G4: n/a — a porta é o campo Variant do inspector, não um ponto do canvas `manifest/commands/design-system.json:1693` `"kind": "panel-control",`.
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G6: n/a — o caminho da porta não escreve a seleção `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:220`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-components.setVariant
- **Argumentos enviados:** `{ variant }` — o nome da variante da instância; esta porta envia `variant` com o texto do campo (`src/editor/shell/panel-field.tsx:85` `const outcome = (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args, [argument]: chosen }, context);`, com o argumento livre `variant`).
- R2 `src/core/design/components.ts:457` `if (typed !== '' && !/^[a-z][a-z0-9-]*$/.test(typed)) return { kind: 'refused', message: message('status.components.badVariant', { variant: variant.trim() }) };` — o `variant` desta porta é o texto digitado ou um dos oferecidos; vazio ou no padrão, o caminho segue; fora do padrão, para na recusa.
- R3 `src/core/design/components.ts:459` `if (locked !== null) return { kind: 'refused', message: locked };` — a raiz da instância desta porta não está trancada; livre, o caminho segue para os patches.
