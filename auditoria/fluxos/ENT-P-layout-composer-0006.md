# ENT-P-layout-composer-0006 — layout.leave pela porta layout-escape

- **Comando:** layout.leave
- **Porta:** `manifest/commands/layout-composer.json:171` `"id": "layout-escape",`
- **Gatilho:** `manifest/commands/layout-composer.json:174` `"chord": "Escape",`
- **Tratador:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`
- **Início:** `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Trecho:** TRC-layout.leave

## Passos
1. `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — a ligação da tecla resolve o despacho; sem gesto de ponteiro aberto e sem tecla digitada do canvas, `dispatch` é o da store do editor.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla roda o comando da ligação com os argumentos do campo, quando a guarda da área de transferência passa.
3. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no embrulho `gestureSafe` da store do editor.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente é consultado antes de o comando rodar. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai à store do núcleo.
6. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`.
8. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador do comando na tabela `wiring().commands`.
9. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram nessa tabela por seu comando.
10. `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {` — a Chamada do trecho TRC-layout.leave: `registerHandler` liga o comando ao tratador; é por esta linha que o comando entra no trecho.

## Ramos
- R1 `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — o despacho desta tecla é o da store do editor: sem gesto de ponteiro aberto e sem tecla digitada do canvas, os dois primeiros membros são nulos e `dispatch` é `store.dispatch`.
- R2 `src/editor/input/keymap.ts:530` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `layout.leave` não toma argumento de tipo `clipboard`, então `clipboard` é `undefined` e a guarda de `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` é verdadeira; um comando que lê a área de transferência seguiria pelo ramo da leitura.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando roda já pela store do núcleo; com um gesto aberto e um comando que muda o documento, entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto o predicado `layoutComposing` falha e o comando é recusado com `layout.inactive` (`src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,`); composto, segue.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/input/keymap.ts:525` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` a `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {`; a guarda da área de transferência (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`) é verdadeira, porque o comando não lê a área de transferência, e o despacho roda direto.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via `beforeCommand`), EST-L01-037 (o estado da store, no despacho do núcleo)
- escreve: nenhum — a gravação entra no trecho TRC-layout.leave

## Resultado
- **Estado final:** o que o trecho TRC-layout.leave registra (`src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem do trecho; o painel do compositor mostra o estado novo.
- **DOM do canvas:** o canvas é redesenhado pelo aviso de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);` quando o trecho muda o documento.

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado e grava nele.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é guardada antes de o comando rodar.
- G3: ok `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {` — um só tratador; esta porta envia só a intenção.
- G4: n/a — o caminho da porta não desenha elemento sobre o canvas `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G5: n/a — o caminho da porta não desenha painel nem barra `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o canvas é redesenhado pelo mesmo aviso.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade do documento é conferida no commit.

## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho desta porta entre `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` e `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {`; nada a remover.

## Medições
- nenhuma — nenhum passo do caminho desta porta chama API de dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-layout.leave
- **Argumentos enviados:** `{}` — esta porta não envia campo: o manifesto declara o comando sem argumento (`manifest/commands/layout-composer.json:127` `"args": {},`).
- nenhum ramo do trecho depende dos argumentos: o trecho o declara (`auditoria/fluxos/trechos/TRC-layout.leave.md:4` `- **Ramos que dependem dos argumentos:** nenhum (o comando não tem argumento; os ramos dependem do estado do compositor).`).
