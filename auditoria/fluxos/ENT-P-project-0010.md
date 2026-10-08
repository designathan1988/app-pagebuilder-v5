# ENT-P-project-0010 — project.openFolder pela porta project.openFolder#command-bar

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:139` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.openFolder`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:137` `if (file !== undefined && entry.door.adapter.fileReading === 'folder') {` — o comando declara o argumento `folder` do tipo `file` (`manifest/commands/project.json:306` `"folder": {`) e a porta é marcada com `"fileReading": "folder"` (`manifest/commands/project.json:371` `"fileReading": "folder"`), então o caminho entra no ramo da pasta.
2. `src/editor/doors/door.tsx:138` `void chooseFolder().then((chosen) => {` — a porta abre o seletor de pasta do navegador (`chooseFolder`) e continua num `then`; só despacha depois que a pasta chega.
3. `src/editor/doors/door.tsx:139` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });` — a linha de Início: com uma pasta escolhida, o nome e os arquivos dela entram em `file` e o comando é despachado; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
4. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
5. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `project.openFolder` tem `"undoable": false` (`manifest/commands/project.json:327` `"undoable": false`), então `changesDocument` é `false`.
6. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
8. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
10. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
11. `src/app/commands.ts:350` `'project.openFolder': openFolderCommand,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.openFolder`).

## Ramos
- R1 `src/editor/doors/door.tsx:139` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });` — com uma pasta escolhida (`chosen` não nulo) o comando é despachado; sem escolha (cancelamento) nada é despachado.
- R2 `src/editor/doors/door.tsx:211` `if (chosen.length === 0) return null;` — o seletor de pasta sem arquivos devolve `null`, então a porta não despacha com pasta vazia.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que não muda o documento, ele roda pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R4 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- `src/editor/doors/door.tsx:138` `void chooseFolder().then((chosen) => {` — a escolha da pasta é uma promessa; quem retoma o caminho é ENT-L05b-0014; enquanto ela espera, o estado da aplicação é o do editor intacto, com o seletor do navegador aberto.
- `src/editor/doors/door.tsx:203` `input.addEventListener('change', () => resolve([...(input.files ?? [])]));` — o ouvinte de escolha do seletor de pasta (ENT-L05b-0021).
- `src/editor/doors/door.tsx:204` `input.addEventListener('cancel', () => resolve([]));` — o ouvinte de cancelamento do seletor de pasta (ENT-L05b-0022).
- `src/editor/doors/door.tsx:210` `const chosen = await chooseDirectoryFiles();` — a espera do seletor de pasta dentro de `chooseFolder` (ENT-L05b-0023).
- `src/editor/doors/door.tsx:216` `const files = await Promise.all(` — a leitura em série dos arquivos da pasta (ENT-L05b-0024).
- `src/editor/doors/door.tsx:218` `const read = await readUploadFile(file);` — a leitura de cada arquivo da pasta (ENT-L05b-0025).
- o estado da aplicação não muda em nenhuma dessas esperas: nada é despachado à store até a linha de Início.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.openFolder`

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031, EST-L01-032, EST-L01-033, EST-L01-034 e EST-L01-035 — no ramo `load` o documento passa a ser o da pasta e a seleção e o histórico começam vazios (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);`); nos ramos `confirm` e `refused` só a confirmação pendente ou a mensagem e a recusa são escritas (`src/core/store/store.ts:446`, `src/core/store/store.ts:451`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** no ramo `load` o quadro passa a mostrar a página do documento da pasta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:139` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });` — a porta envia só a intenção (o id do comando e a pasta lida) e o tratador único `src/app/commands.ts:350` `'project.openFolder': openFolderCommand,` decide.
- G4: n/a — a porta é o item da barra de comando, não um ponto do canvas (`manifest/commands/project.json:355` `"kind": "command-bar",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:139` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });`.
- G6: n/a — o caminho da porta não escreve a seleção; ela fica como a store a tem `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:139` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- os ouvintes do seletor (`change` e `cancel`) vivem num `<input>` criado por `chooseDirectoryFiles` e nunca anexado ao documento (`src/editor/doors/door.tsx:199` `const input = document.createElement('input');`); quando a promessa assenta nada mais o referencia, então não há remoção a citar nem alvo vivo a que os ouvintes fiquem presos.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.openFolder
- **Argumentos enviados:** `{ folder }` — `folder` é `{ name, files }` lido por `chooseFolder` (`src/editor/doors/door.tsx:139` `if (chosen !== null) dispatch(entry.command.id, { ...given, [file]: chosen });`), com o nome da pasta e cada arquivo com o caminho que guarda dentro dela.
- R1 `src/core/import/folder.ts:96` `if (files.length === 0) return { refused: message('status.folder.unsupported') };` — a porta não despacha com pasta vazia (`src/editor/doors/door.tsx:211` `if (chosen.length === 0) return null;`), então `files` (os caminhos não vazios) segue e o caminho não toma o lado da recusa.
- R2 `src/core/import/folder.ts:101` `if (refused !== null) return { refused };` — depende dos arquivos que a porta leu: sem arquivo em erro e com página entre eles, `pickedRefusal` devolve nulo (`src/core/import/import.ts:1658` `export function pickedRefusal(picked: readonly PickedFile[]): Message | null {`) e o caminho segue; com arquivo não lido ou sem página, toma o lado da recusa.
- R3 `src/core/import/folder.ts:195` `if (context.confirmed !== true && !isEmptyProject(context.state.document)) return { kind: 'confirm' as const };` — depende do projeto aberto, não do argumento: vazio ou confirmado, o caminho segue para `load`; com trabalho e sem confirmação, toma o lado `confirm`.
- R4 `src/core/import/folder.ts:145` `if (!pages.some((page) => page.file === 'index.html')) {` — depende da pasta: com `index.html` as páginas da pasta bastam; sem ele uma página inicial vazia é criada com nomes novos (`src/core/import/folder.ts:147` `const root: DocNode = { id: ids.next(), type: rules.root.type, name, tag: rules.root.tag, attributes: {}, classes: [], styles: {}, text: null, children: [] };`).
