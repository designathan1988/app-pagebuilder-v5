# ENT-P-layout-composer-0001 — layout.enter pela porta layout-compose

- **Comando:** layout.enter
- **Porta:** `manifest/commands/layout-composer.json:37` `"id": "layout-compose",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Trecho:** TRC-layout.enter

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor, ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`; os argumentos desta porta vão em `given`.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
4. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai à store do núcleo.
5. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
6. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`.
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador do comando na tabela `wiring().commands`.
8. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram nessa tabela por seu comando.
9. `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {` — a Chamada do trecho TRC-layout.enter: `registerHandler` liga o comando ao tratador; é por esta linha que o comando entra no trecho.

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo (o manifesto não declara argumento `file`, `files` nem `clipboard`), então `file` é `undefined` e o caminho segue para o despacho; um comando que lê arquivo seguiria pelo ramo do arquivo.
- R2 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando roda já pela store do núcleo (o lado tomado por esta porta); com um gesto aberto e um comando que muda o documento, o despacho entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R3 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` a `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {`; nenhum passo cita `await`, timer, quadro ou ouvinte. O comando `layout.enter` não toma argumento de tipo `file`, `files` nem `clipboard`, então o despacho roda direto (`src/editor/doors/door.tsx:143` `if (file === undefined) {`).

## Estado
- lê: EST-L05a-001 (a digitação pendente, via `beforeCommand`), EST-L01-030, EST-L01-037 (o estado da store, no despacho do núcleo)
- escreve: nenhum — a gravação entra no trecho TRC-layout.enter

## Resultado
- **Estado final:** o que o trecho TRC-layout.enter registra (`src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel do compositor mostra o estado novo.
- **DOM do canvas:** o canvas é redesenhado pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` quando o trecho muda o documento.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado e grava nele.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é guardada antes de o comando rodar.
- G3: ok `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {` — um só tratador; esta porta envia só a intenção.
- G4: n/a — o caminho da porta não desenha elemento sobre o canvas `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho desta porta entre `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` e `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {`; nada a remover.

## Medições
- nenhuma — nenhum passo do caminho desta porta chama API de dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-layout.enter
- **Argumentos enviados:** `{}` — esta porta não envia o campo `target` (`manifest/commands/layout-composer.json:10` `"target": {` é opcional); o alvo é o que o tratador escolhe — a seleção ou a raiz da página (`src/modules/layout-composer/host/handlers.ts:401` `const id = target ?? context.state.selection[0] ?? pageShown(context.state)?.tree.id;`).
- R1 `src/modules/layout-composer/host/handlers.ts:403` `if (at === null || id === undefined || context.rules.elements.get(at.node.type)?.content !== 'children') return { kind: 'refused', message: message('layout.noContainer') };` — esta porta não envia `target`, então o alvo é o selecionado ou a raiz da página (`src/modules/layout-composer/host/handlers.ts:401` `const id = target ?? context.state.selection[0] ?? pageShown(context.state)?.tree.id;`); sem alvo que seja contêiner, o caminho para na recusa `layout.noContainer`; com ele, segue.
- R2 `src/modules/layout-composer/host/handlers.ts:405` `if (locked !== null) return { kind: 'refused', message: locked };` — sem `target`, o contêiner cujo lock é lido aqui é o do alvo escolhido; travado, o caminho para na recusa do lock; livre, segue.
