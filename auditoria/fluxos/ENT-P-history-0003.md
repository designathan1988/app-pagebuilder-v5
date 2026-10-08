# ENT-P-history-0003 — history.undo pela porta toast-undo
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:63` `          "id": "toast-undo",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Trecho:** TRC-history.undo

## Passos
1. `src/editor/doors/door.tsx:78` `  const available = useEditorState((s) => built && (predicate?.test(s, layeredRules(s), runArgs) ?? true));` — o botão do aviso lê a disponibilidade (a pilha de desfazer). [lê: EST-L01-032 via useDoor]
2. `src/editor/doors/door.tsx:92` `  const run = () => {` — a função que o controle executa ao ser acionado.
3. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — só uma porta construída e disponível despacha.
4. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o despacho é o da store do editor.
5. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos da porta; `history.undo` declara `manifest/commands/history.json:9` `      "args": {},`, e a porta declara `manifest/commands/history.json:86` `          "args": {}`, então `given` é o objeto vazio.
6. `src/editor/doors/door.tsx:107` `    const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — `history.undo` não tem argumento do tipo `file`, então `file` é `undefined`.
7. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não pede arquivo.
8. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o botão do aviso despacha history.undo com os argumentos da porta; esta é a linha de Início da porta.
9. `src/editor/store.ts:232` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`. [lê: EST-L05a-038 via gestureSafe]
10. `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
11. `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-032 via dispatch]
12. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
13. `src/core/store/store.ts:400` `    const entry = table[id];` — a tabela de comandos devolve a entrada do comando. [lê: EST-L01-032 via run]
14. `src/app/commands.ts:332` `'history.undo': undoCommand,` — a linha que despacha o comando ao tratador (a Chamada do trecho `TRC-history.undo`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — o lado verdadeiro (a porta não construída, ou a pilha de desfazer vazia) não despacha; o lado falso segue ao passo 4.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando desta porta não pede arquivo, então o lado é verdadeiro e o caminho segue ao passo 8; um comando que lê arquivo iria pelo ramo do arquivo (`src/editor/doors/door.tsx:149` `    void chooseFile().then(async (bytes) => {`).
- R3 `src/editor/store.ts:237` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto e um comando que não muda o documento (`history.undo` não é desfazível), iria pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` a `src/app/commands.ts:332` `'history.undo': undoCommand,`; nenhum passo cria ouvinte, timer, quadro ou promessa.

## Estado
- Lê: EST-L01-032, EST-L05a-001, EST-L05a-038.
- Escreve: EST-L01-030, EST-L01-031, EST-L01-032 (pelo `dispatch` do editor; a gravação própria do desfazer entra no trecho TRC-history.undo).

## Resultado
- **Estado final:** inalterado por esta porta; o comando é entregue ao tratador `src/app/commands.ts:332` `'history.undo': undoCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-history.undo.md`.
- **Re-renderizado:** nada muda nesta porta; quem avisa os assinantes é o trecho `TRC-history.undo`.
- **DOM do editor:** nada muda neste caminho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda neste caminho.

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` e o desfazer restaura o documento no trecho.
- G2: ok `src/editor/store.ts:234` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando.
- G3: ok `src/app/commands.ts:332` `'history.undo': undoCommand,` — as cinco portas do comando (`key-ctrl-z-in-global`, `toolbar-top-bar`, esta, `menu-edit`, `command-bar`) chegam a este tratador e enviam só a intenção, os argumentos vazios.
- G4: n/a — a porta é um botão do aviso (toast), fora do canvas (`manifest/commands/history.json:64` `          "kind": "panel-control",`).
- G5: n/a — a porta não desenha nem mede painel ou barra `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- G6: n/a — a porta não escreve a seleção; o trecho `TRC-history.undo` mantém a seleção da store.
- G7: n/a — a porta não muda o documento; só entrega o comando `src/app/commands.ts:332` `'history.undo': undoCommand,`.
- INT: n/a — a porta não escreve no documento; a integridade é do trecho `fluxos/trechos/TRC-history.undo.md`.

## Limpeza
- nenhum ouvinte, timer ou observador é criado neste caminho; `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` não abre nenhum, e não há remoção a citar.

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-history.undo
- **Argumentos enviados:** nenhum campo — `manifest/commands/history.json:9` `      "args": {},`; a porta `toast-undo` também declara `manifest/commands/history.json:86` `          "args": {}`, então o tratador recebe só o contexto.
- nenhum ramo do trecho depende de um valor de argumento: `TRC-history.undo` declara que nenhum ramo muda com um valor de argumento, e o tratador `src/core/history/history.ts:79` `export const undoCommand = registerHandler('history.undo', () => ({ kind: 'undo' }));` não decide por valor de argumento.
