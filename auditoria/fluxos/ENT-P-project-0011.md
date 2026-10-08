# ENT-P-project-0011 — project.importHtml pela porta project.importHtml#menu-file

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:102` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.importHtml`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:98` `const files = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'files' && !arg.optional && !(name in given))?.[0];` — o comando declara `files` do tipo `files` (`manifest/commands/project.json:383` `"files": {`), que ainda não está em `given`, então o caminho entra no ramo dos arquivos.
2. `src/editor/doors/door.tsx:99` `if (files !== undefined) {` — o nome do argumento dos arquivos foi encontrado.
3. `src/editor/doors/door.tsx:100` `void (entry.door.adapter.fileReading === 'folder' ? chooseDirectoryFiles() : chooseFiles()).then(async (chosen) => {` — esta porta não é marcada com `fileReading`, então o navegador abre o seletor de vários arquivos (`chooseFiles`) e a leitura continua num `then`.
4. `src/editor/doors/door.tsx:101` `if (chosen.length === 0) return;` — sem arquivos escolhidos nada é despachado.
5. `src/editor/doors/door.tsx:102` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });` — a linha de Início: os arquivos escolhidos, lidos por `readPickedFiles`, entram em `files` e o comando é despachado; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
6. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
7. `src/editor/store.ts:222` `const changesDocument = UNDOABLE.get(id) === true;` — `project.importHtml` tem `"undoable": true` (`manifest/commands/project.json:418` `"undoable": true,`), então `changesDocument` é `true`.
8. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado e o contexto é tomado. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
10. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
12. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
13. `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.importHtml`).

## Ramos
- R1 `src/editor/doors/door.tsx:100` `void (entry.door.adapter.fileReading === 'folder' ? chooseDirectoryFiles() : chooseFiles()).then(async (chosen) => {` — esta porta não é marcada com `fileReading` (o manifesto não traz `fileReading` nesta porta, `manifest/commands/project.json:445` `"args": {}`), então o seletor é o de vários arquivos; a porta `#menu-file-folder` deste comando, marcada com `"fileReading": "folder"` (`manifest/commands/project.json:487`), usa o de pasta.
- R2 `src/editor/doors/door.tsx:101` `if (chosen.length === 0) return;` — sem arquivos escolhidos nada é despachado; com arquivos, o caminho segue.
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que muda o documento, o despacho entra na fila `waiting` (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- R4 `src/editor/store.ts:233` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- `src/editor/doors/door.tsx:100` `void (entry.door.adapter.fileReading === 'folder' ? chooseDirectoryFiles() : chooseFiles()).then(async (chosen) => {` — a escolha dos arquivos é uma promessa; quem retoma o caminho é ENT-L05b-0010; enquanto ela espera, o estado da aplicação é o do editor intacto, com o seletor do navegador aberto.
- `src/editor/doors/door.tsx:187` `input.addEventListener('change', () => resolve([...(input.files ?? [])]));` — o ouvinte de escolha do seletor de vários arquivos (ENT-L05b-0019).
- `src/editor/doors/door.tsx:188` `input.addEventListener('cancel', () => resolve([]));` — o ouvinte de cancelamento do seletor de vários arquivos (ENT-L05b-0020).
- `src/editor/doors/door.tsx:102` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });` — o `await readPickedFiles(chosen)` lê os bytes de cada arquivo, um a um (`src/core/import/import.ts:77` `export async function readPickedFiles(files: readonly File[]): Promise<readonly PickedFile[]> {`), antes de o comando ser despachado; o estado da aplicação não muda nesse intervalo.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.importHtml`

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031, EST-L01-033, EST-L01-034, EST-L01-035 e EST-L01-037 — no ramo R1 do trecho só `ui.dialog` e `ui.htmlImport` mudam, abrindo o diálogo de destinos (`src/editor/import/html-import.ts:11` `return { kind: 'change', ui: { ...context.state.ui, dialog: 'html-import', htmlImport: { files: args.files } } };`); no ramo `change` o documento ganha os patches do destino e a seleção passa a ser a do destino (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`); nos ramos `confirm` e `refused` só a confirmação pendente ou a mensagem e a recusa são escritas.
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o diálogo de importação abre pelo estado do editor no ramo R1; a árvore de páginas deriva do documento (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** o quadro mostra a página aberta com os elementos importados (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o comando é desfazível, então `changesDocument` é verdadeiro e a digitação pendente é gravada no contexto da digitação antes, entregue à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar, e um comando que muda o documento grava a digitação antes.
- G3: ok `src/editor/doors/door.tsx:102` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });` — a porta envia só a intenção (o id do comando e os arquivos lidos) e o tratador único `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),` decide.
- G4: n/a — a porta é o item do menu File, não um ponto do canvas (`manifest/commands/project.json:427` `"kind": "menu",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:102` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });`.
- G6: n/a — o caminho da porta não escreve a seleção; ela fica como a store a tem `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:102` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- os ouvintes do seletor (`change` e `cancel`) vivem num `<input>` criado por `chooseFiles` e nunca anexado ao documento (`src/editor/doors/door.tsx:184` `const input = document.createElement('input');`); quando a promessa assenta nada mais o referencia, então não há remoção a citar nem alvo vivo a que os ouvintes fiquem presos.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.importHtml
- **Argumentos enviados:** `{ files }` — `files` são os arquivos escolhidos no seletor e lidos por `readPickedFiles` (`src/editor/doors/door.tsx:102` `dispatch(entry.command.id, { ...given, [files]: await readPickedFiles(chosen) });`); a porta não fixa `destination` nem `target`.
- R1 `src/editor/import/html-import.ts:10` `if (args.destination === undefined && importPageFiles(args.files).length > 0 && !args.files.some(f => f.error)) {` — a porta não envia `destination`, então o lado depende dos arquivos: com páginas HTML e sem arquivo em erro, o caminho abre o diálogo de destinos (`src/editor/import/html-import.ts:11`); sem páginas, segue ao tratador do núcleo (`src/editor/import/html-import.ts:13` `const outcome = owner.run(context, { ...args, files });`).
- R3 `src/core/import/import.ts:1798` `if (destination === 'replace' && confirmed !== true) return { kind: 'confirm' as const };` — quando o caminho chega ao tratador do núcleo, o `destination` que entra é o padrão `page` (`src/core/import/import.ts:1792` `export const importHtmlCommand = registerHandler('project.importHtml', (context, { files, destination = 'page', target }) => {`), então o teste é falso e o caminho não toma o lado `confirm` por esta porta.
- R5 `src/core/import/import.ts:1800` `const replacing = destination === 'replace' || (destination === 'page' && pristine);` — com o `destination` padrão `page`, `replacing` é verdadeiro quando o projeto está sem trabalho (`pristine`) e falso caso contrário.
