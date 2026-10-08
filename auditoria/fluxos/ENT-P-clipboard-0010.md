# ENT-P-clipboard-0010 — clipboard.cut pela porta context-menu

Fluxo de porta do domínio `clipboard`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:144` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-clipboard.cut`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — o controle desenhado chama o `dispatch` da store do editor com o id do comando e os argumentos; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`. É o Início da porta.
2. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
3. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `clipboard.cut` é reversível no manifesto, então `changesDocument` é verdadeiro.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando. [lê: EST-L05a-001 via beforeCommand]
5. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — o alvo da digitação pendente. [lê: EST-L05a-001 via heldTyping] [lê: EST-L01-031 via editedKey] [lê: EST-L01-037 via editedKey]
6. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch]
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho entrega o comando à função que o roda.
9. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — a função que roda um comando.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos devolve a entrada do comando.
11. `src/app/commands.ts:208` `'clipboard.cut': cutCommand,` — a linha que despacha o comando ao tratador (a Chamada do trecho `TRC-clipboard.cut`).

## Ramos
- R1 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando desta porta não pede arquivo (o manifesto não declara um argumento `file`, `files` nem `clipboard`), então `file` é `undefined` e o caminho segue para a linha 144; um comando que lê arquivo seguiria pelo ramo do arquivo.
- R2 `src/editor/doors/door.tsx:109` `const clipboard = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in given))?.[0];` — `clipboard.cut` não tem argumento do tipo `clipboard`, então `clipboard` é `undefined` e o ramo que lê a área de transferência (`src/editor/doors/door.tsx:110` `if (clipboard !== undefined) {`) não é tomado.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto, `clipboard.cut` é reversível, então entraria na fila `waiting` (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — o id é um comando do manifesto, então a tabela devolve a entrada `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono, de `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` a `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`; nenhum passo cria ouvinte, timer, quadro ou promessa.

## Estado
- lê: EST-L05a-001, EST-L01-031, EST-L01-037
- escreve: EST-L01-030, EST-L01-031

## Resultado
- **Estado final:** inalterado por esta porta; o comando é entregue ao tratador `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-clipboard.cut.md`.
- **Re-renderizado:** nada muda nesta porta; quem avisa os assinantes é o trecho `TRC-clipboard.cut`.
- **DOM do editor:** nada muda neste caminho `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda neste caminho.

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando.
- G3: ok — a porta chega à tabela `src/app/commands.ts:208` `'clipboard.cut': cutCommand,` e envia só a intenção, os argumentos da porta.
- G4: n/a — a porta não desenha elemento sobre o canvas `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G5: n/a — a porta é um item de menu de contexto, desenhado na própria camada; ela não mede nem cobre o canvas `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`.
- G6: n/a — a porta não escreve a seleção; o trecho `TRC-clipboard.cut` escreve a seleção pela store.
- G7: n/a — a porta não muda o documento; só entrega o comando `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`.
- INT: n/a — a porta não escreve no documento; a integridade é do trecho `fluxos/trechos/TRC-clipboard.cut.md`.

## Limpeza
- nenhum ouvinte, timer ou observador é criado neste caminho; `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` não abre nenhum, e não há remoção a citar.

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-clipboard.cut
- **Argumentos enviados:** nenhum campo — `manifest/commands/clipboard.json:235` `"args": {},`; a porta `context-menu` também declara `manifest/commands/clipboard.json:291` `"args": {}`, então o tratador recebe só o contexto.
- nenhum ramo do trecho depende de um valor de argumento: `TRC-clipboard.cut` declara que nenhum ramo muda com um valor de argumento, e o tratador `src/core/clipboard/clipboard.ts:104` `export const cutCommand = registerHandler('clipboard.cut', (context): Outcome<never> => {` não decide por valor de argumento.
