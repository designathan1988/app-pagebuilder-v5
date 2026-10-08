# ENT-P-nodes-0018 — element.renameMany pela porta element.renameMany#batch-rename-apply

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.renameMany`, que segue daqui.

## Passos
1. `src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);` — o envio do formulário do diálogo despacha o id do comando com `{ pattern, start }` (o Início da porta).
2. `src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };` — os argumentos do manifesto da porta mais o padrão que o campo tem e o número inicial.
3. `src/editor/shell/batch-rename.tsx:51` `const typed = String(form.get('start') ?? '').trim();` — o texto do campo do número inicial; vazio vira `NaN`.
4. `src/editor/shell/batch-rename.tsx:49` `if (!door.available) return;` — o botão só despacha quando o comando corre agora.
5. `src/editor/shell/batch-rename.tsx:53` `afterGesture(store, () => {` — o despacho corre uma vez sem gesto aberto (o caminho de `afterGesture` é a Fronteira assíncrona abaixo).
6. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `element.renameMany` é undoable (`manifest/commands/nodes.json:585` `"undoable": true`), então `changesDocument` é verdadeiro.
8. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
10. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
14. `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/shell/batch-rename.tsx:49` `if (!door.available) return;` — o comando indisponível (sem seleção, o predicado `hasSelection` não segura) não despacha; disponível, segue.
- R2 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — o predicado `hasSelection` é lido antes do tratador; sem seleção, a recusa viria por aqui.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/editor/input/pointer/common.ts:404` `if (shared.open === null) {` — sem gesto aberto, `afterGesture` corre o despacho no ato; com um gesto aberto, ele espera o gesto terminar (o ramo assíncrono).

## Fronteiras assíncronas
- `src/editor/input/pointer/common.ts:408` `const wait = () => (shared.open === null ? run() : requestAnimationFrame(wait));` — `afterGesture` (`src/editor/shell/batch-rename.tsx:53` `afterGesture(store, () => {`) corre o despacho no ato quando nenhum gesto de ponteiro está aberto e, com um gesto aberto, adia-o por quadro até o gesto terminar; nesse intervalo uma entrada (um atalho do keymap, ENT-L05a-0028) pode rodar, e o despacho de `element.renameMany` sai depois, com o mesmo `args` que o formulário montou.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.renameMany`

## Resultado
- **Estado final:** EST-L01-030 — cada alvo da seleção recebe um patch `replace` do próprio nome pelo trecho `TRC-element.renameMany` (`src/core/export/authoring.ts:32` `return {kind:'change',patches};`), todos numa transação.
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas de Camadas dos alvos mostram os nomes novos (`src/editor/shell/sidebar/layers.tsx:319` `{node.name}`).
- **DOM do canvas:** os rótulos dos alvos mostram os nomes novos (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da digitação é capturado aqui e entregue à store do núcleo em `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);` — a porta envia só a intenção e o tratador único `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,` decide.
- G4: n/a — o botão é desenhado no diálogo de renomear em lote, fora do canvas; nada do editor cobre o ponto da ação no canvas (`src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);`).
- G6: n/a — a porta não escreve a seleção (`src/app/commands.ts:337` `'element.renameMany': renameManyCommand,`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/app/commands.ts:337` `'element.renameMany': renameManyCommand,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/batch-rename.tsx:54` `const outcome = (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(apply.command.id as CommandId, args);` e `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,`; o quadro que `afterGesture` pede é de outra função e não é criado nem cancelado aqui (não há `cancelAnimationFrame` no caminho).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.renameMany
- **Argumentos enviados:** `{ pattern, start }` — `pattern` é o texto do campo do padrão e `start` é `Number(typed)` ou `NaN` quando o campo do número está vazio (`src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };`); a porta carrega o objeto vazio no manifesto (`manifest/commands/nodes.json:616` `"args": {}`).
- R2 `src/core/nodes/rename-many.ts:15` `if (typed === '' || !Number.isSafeInteger(first) || first < 1) return { kind: 'refused', message: message('status.rename.patternInvalid') };` — `pattern` e `start` vêm dos campos do formulário; um padrão vazio ou um número inicial inválido (o campo vazio vira `NaN`) fazem o caminho passar por aqui (recusa), um padrão preenchido e um inteiro ao menos 1 seguem.
