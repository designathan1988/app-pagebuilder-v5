# ENT-P-nodes-0008 — element.rename pela porta element.rename#layers-row-name-field

Fluxo de porta do domínio `nodes`. Rastreia o caminho próprio da porta — de `src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-element.rename`, que segue daqui.

## Passos
1. `src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });` — o campo de nome despacha o id do comando com `{ target: node.id, name }` (o Início da porta).
2. `src/editor/shell/sidebar/layers.tsx:81` `const submit = (event: FormEvent<HTMLFormElement>) => {` — o envio do formulário (`src/editor/shell/sidebar/layers.tsx:83` `keep(input.current?.value ?? node.name);`) e a saída do campo (`src/editor/shell/sidebar/layers.tsx:100` `onBlur={(event) => keep(event.currentTarget.value)}`) chamam `keep` com o texto do campo.
3. `src/editor/shell/sidebar/layers.tsx:78` `if (!field.built || renamedNode(store.getState().ui) !== node.id) return;` — o campo só grava quando o seu comando está construído e o nó ainda é o que está a ser renomeado.
4. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
5. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `element.rename` é undoable (`manifest/commands/nodes.json:223` `"undoable": true`), então `changesDocument` é verdadeiro.
6. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
8. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
9. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
10. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
11. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
12. `src/app/commands.ts:336` `'element.rename': renameCommand,` — a linha da Chamada do trecho: o tratador único do comando.

## Ramos
- R1 `src/editor/shell/sidebar/layers.tsx:78` `if (!field.built || renamedNode(store.getState().ui) !== node.id) return;` — o nó já não está a ser renomeado ou o comando não está construído: nada despacha; caso contrário, segue.
- R2 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — a forma dos argumentos é conferida contra o manifesto antes de o tratador rodar; um par fora da forma seria recusado aqui.

## Fronteiras assíncronas
- nenhuma — de `src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });` a `src/app/commands.ts:336` `'element.rename': renameCommand,` o caminho é síncrono; o efeito que dá o foco ao campo (`src/editor/shell/sidebar/layers.tsx:73` `useEffect(() => {`) corre no desenho do campo e não no intervalo entre a gravação e o despacho.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-element.rename`

## Resultado
- **Estado final:** EST-L01-030 — o caminho `[...found.path, 'name']` do nó recebe o nome aparado pelo trecho `TRC-element.rename` (`src/core/nodes/names.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...found.path, 'name'], value: kept }], message: message('status.renamed', { old: previous, name: kept }) };`).
- **Re-renderizado:** todo assinante da store é chamado pelo trecho (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha de Camadas volta a desenhar o nome, o rename termina (`src/editor/shell/sidebar/layers.tsx:307` `{renaming ? (`).
- **DOM do canvas:** o rótulo do elemento mostra o nome novo (`src/editor/canvas/chrome.tsx:1014` `<span className="chrome__name">{node.name}</span>`).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o contexto da digitação é capturado aqui e entregue à store do núcleo em `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });` — a porta envia só a intenção e o tratador único `src/app/commands.ts:336` `'element.rename': renameCommand,` decide.
- G4: n/a — a porta é o campo de nome desenhado no painel Camadas, que ocupa a própria coluna; nada do editor é desenhado sobre o canvas (`src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });`).
- G5: n/a — o caminho da porta não desenha painel nem barra; só despacha o comando (`src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });`).
- G6: n/a — a porta não escreve a seleção (`src/app/commands.ts:336` `'element.rename': renameCommand,`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/app/commands.ts:336` `'element.rename': renameCommand,`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento é validado no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta entre `src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });` e `src/app/commands.ts:336` `'element.rename': renameCommand,`; nada a remover. O efeito que dá o foco ao campo é de outro caminho e não é criado nem removido aqui.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-element.rename
- **Argumentos enviados:** `{ target: node.id, name }` — `target` é o id do nó da linha e `name` é o texto do campo (`src/editor/shell/sidebar/layers.tsx:79` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(LAYERS_NAME_FIELD.command.id as CommandId, { ...LAYERS_NAME_FIELD.door.args, target: node.id, name });`).
- R1 `src/core/nodes/names.ts:17` `if (!found) throw new Error(` — o `target` desta porta é o id do nó da linha, que o documento tem, então o caminho passa pelo lado do nó achado.
- R2 `src/core/nodes/names.ts:18` `if (typeof name !== 'string') throw new Error('element.rename: the name is not a string');` — `name` é o texto do campo, uma string, então o caminho não passa pelo lado do lançamento.
- R5 `src/core/nodes/names.ts:26` `if (kept === '') return { kind: 'change', message: message('status.rename.empty', { name: previous }) };` — `name` é o que o campo tem; um campo vazio faz o caminho passar por aqui (mensagem, sem patch), um preenchido segue.
- R6 `src/core/nodes/names.ts:27` `if (kept === previous) return { kind: 'change' };` — `name` pode repetir o nome atual do nó, e o caminho passa por aqui (sem patch nem mensagem); diferente, segue para o patch.
