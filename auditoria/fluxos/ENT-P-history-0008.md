# ENT-P-history-0008 — history.redo pela porta toolbar-top-bar
- **Comando:** history.redo
- **Porta:** `manifest/commands/history.json:190` `          "id": "toolbar-top-bar",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Trecho:** TRC-history.redo

## Passos
1. `src/editor/doors/door.tsx:78` `  const available = useEditorState((s) => built && (predicate?.test(s, layeredRules(s), runArgs) ?? true));` — o botão da barra de ferramentas lê a disponibilidade (a pilha de refazer). [lê: EST-L01-032 via useDoor]
2. `src/editor/doors/door.tsx:92` `  const run = () => {` — a função que o controle executa ao ser acionado.
3. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — só uma porta construída e disponível despacha.
4. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o despacho é o da store do editor.
5. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos da porta; `history.redo` declara `manifest/commands/history.json:138` `      "args": {},`, e a porta declara `manifest/commands/history.json:209` `          "args": {}`, então `given` é o objeto vazio.
6. `src/editor/doors/door.tsx:107` `    const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — `history.redo` não tem argumento do tipo `file`, então `file` é `undefined`.
7. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não pede arquivo.
8. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — o botão despacha history.redo com os argumentos da porta; esta é a linha de Início da porta.
9. `src/editor/store.ts:221` `    dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`. [lê: EST-L05a-038 via gestureSafe]
10. `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente, se houver, é guardada antes do comando. [lê: EST-L05a-001 via beforeCommand]
11. `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-032 via dispatch]
12. `src/core/store/store.ts:688` `      return run(id, args, null, false, null, context);` — o despacho entra em `run`.
13. `src/core/store/store.ts:400` `    const entry = table[id];` — a tabela de comandos devolve a entrada do comando. [lê: EST-L01-032 via run]
14. `src/app/commands.ts:333` `'history.redo': redoCommand,` — a linha que despacha o comando ao tratador (a Chamada do trecho `TRC-history.redo`).

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — o lado verdadeiro (a porta não construída, ou a pilha de refazer vazia) não despacha; o lado falso segue ao passo 4.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando desta porta não pede arquivo, então o lado é verdadeiro e o caminho segue ao passo 8; um comando que lê arquivo iria pelo ramo do arquivo (`src/editor/doors/door.tsx:149` `    void chooseFile().then(async (bytes) => {`).
- R3 `src/editor/store.ts:226` `      if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo; com um gesto aberto e um comando que não muda o documento (`history.redo` não é desfazível), iria pelo gesto (`src/editor/store.ts:227` `      else if (!changesDocument) result = open.dispatch(id, args);`).

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` a `src/app/commands.ts:333` `'history.redo': redoCommand,`; nenhum passo cria ouvinte, timer, quadro ou promessa.

## Estado
- Lê: EST-L01-032, EST-L05a-001, EST-L05a-038.
- Escreve: EST-L01-030, EST-L01-031, EST-L01-032 (pelo `dispatch` do editor; a gravação própria do refazer entra no trecho TRC-history.redo).

## Resultado
- **Estado final:** inalterado por esta porta; o comando é entregue ao tratador `src/app/commands.ts:333` `'history.redo': redoCommand,`; o estado que ele escreve está no trecho `fluxos/trechos/TRC-history.redo.md`.
- **Re-renderizado:** nada muda nesta porta; quem avisa os assinantes é o trecho `TRC-history.redo`.
- **DOM do editor:** nada muda neste caminho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda neste caminho.

## Regras
- G1: n/a — a porta não grava no documento nem num contexto de edição; o contexto é capturado em `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` e o refazer restaura o documento no trecho.
- G2: ok `src/editor/store.ts:223` `      const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando.
- G3: ok `src/app/commands.ts:333` `'history.redo': redoCommand,` — as cinco portas do comando (`key-ctrl-shift-z-in-global`, `key-ctrl-y-in-global`, esta, `menu-edit`, `command-bar`) chegam a este tratador e enviam só a intenção, os argumentos vazios.
- G4: n/a — a porta é um botão da barra superior, fora do canvas (`manifest/commands/history.json:191` `          "kind": "toolbar",`).
- G5: n/a — a porta não desenha nem mede painel ou barra `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- G6: n/a — a porta não escreve a seleção; o trecho `TRC-history.redo` mantém a seleção da store.
- G7: n/a — a porta não muda o documento; só entrega o comando `src/app/commands.ts:333` `'history.redo': redoCommand,`.
- INT: n/a — a porta não escreve no documento; a integridade é do trecho `fluxos/trechos/TRC-history.redo.md`.

## Limpeza
- nenhum ouvinte, timer ou observador é criado neste caminho; `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` não abre nenhum, e não há remoção a citar.

## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.

## Ramos do trecho
- **Trecho:** TRC-history.redo
- **Argumentos enviados:** nenhum campo — `manifest/commands/history.json:138` `      "args": {},`; a porta `toolbar-top-bar` também declara `manifest/commands/history.json:209` `          "args": {}`, então o tratador recebe só o contexto.
- nenhum ramo do trecho depende de um valor de argumento: `TRC-history.redo` declara que nenhum ramo muda com um valor de argumento, e o tratador `src/core/history/history.ts:80` `export const redoCommand = registerHandler('history.redo', () => ({ kind: 'redo' }));` não decide por valor de argumento.
