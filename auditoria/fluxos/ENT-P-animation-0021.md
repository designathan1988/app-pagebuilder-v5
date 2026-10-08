# ENT-P-animation-0021 — timeline.toggleLoop pela porta timeline.toggleLoop#timeline-loop

Fluxo de porta do domínio `animation`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-timeline.toggleLoop`, cuja `Chamada` nomeia a chamada desta porta em `src/editor/doors/door.tsx:144`.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o botão do painel chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
2. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — lê da tabela `UNDOABLE` se o comando muda o documento; `timeline.toggleLoop` não é desfazível (`manifest/commands/animation.json:1004` `"undoable": false`), então `changesDocument` é `false`.
4. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via getState] [lê: EST-L01-037 via getState]
6. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai à store do núcleo.
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
10. `src/app/commands.ts:205` `'timeline.toggleLoop': toggleLoopCommand,` — a linha que despacha o comando ao tratador (o primeiro passo do trecho `TRC-timeline.toggleLoop`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não pede arquivo (o manifesto não declara argumento `file`, `files` nem `clipboard`), então o caminho segue para a linha 144; um comando que lê arquivo iria pelo ramo do arquivo.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o despacho vai direto à store do núcleo (o lado desta porta); com um gesto aberto, como este comando não muda o documento, o despacho corre pelo próprio gesto (`src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`).
- R3 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` a `src/app/commands.ts:205`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L01-031 (via getState), EST-L01-037 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-timeline.toggleLoop`

## Resultado
- **Estado final:** EST-L01-037 com `ui.timeline.loop` virado ao contrário, pelo trecho `TRC-timeline.toggleLoop`; o documento não muda; uma digitação pendente de outro alvo é gravada antes (R3).
- **Re-renderizado:** os assinantes da store em `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra a mensagem do ramo, pelo trecho `TRC-timeline.toggleLoop`; o painel Timeline redesenha o botão Loop conforme o estado novo.
- **DOM do canvas:** o laço que move o playhead passa a repetir, ou deixa de repetir; o documento não muda (`src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` só roda com documento novo).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta envia só a intenção (o id do comando) e o tratador único decide.
- G4: n/a — a porta é um controle desenhado no painel, não um ponto do canvas (`manifest/commands/animation.json:1009` `"kind": "panel-control",`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/doors/door.tsx:144` e `src/app/commands.ts:205`; nada a remover.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-timeline.toggleLoop
- **Argumentos enviados:** `{}` — a porta não declara argumentos (`manifest/commands/animation.json:1031` `"args": {}`) e o comando não toma nenhum.
- o trecho não lista ramos que dependem dos argumentos (Argumentos: `{}`; nenhum ramo da porta depende deles).
