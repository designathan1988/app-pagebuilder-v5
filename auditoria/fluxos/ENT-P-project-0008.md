# ENT-P-project-0008 — project.open pela porta project.open#command-bar

Fluxo de porta do domínio `project`. Rastreia o caminho próprio da porta — de `src/editor/doors/door.tsx:150` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-project.open`, que segue daqui.

## Passos
1. `src/editor/doors/door.tsx:149` `void chooseFile().then(async (bytes) => {` — o item da barra de comando abre o seletor de arquivo do navegador (`chooseFile`) e continua num `then`; a porta só despacha depois que a escolha chega.
2. `src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });` — a linha de Início: com um arquivo escolhido, o texto lido por `projectFileText` entra em `file` e o comando é despachado; esse `dispatch` é `store.dispatch` ligado em `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;`.
3. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — a store do editor recebe o despacho no embrulho `gestureSafe`.
4. `src/editor/store.ts:233` `const changesDocument = UNDOABLE.get(id) === true;` — `project.open` tem `"undoable": false` (`manifest/commands/project.json:252` `"undoable": false`), então `changesDocument` é `false`.
5. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de o comando rodar, o registro da digitação pendente é consultado. [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:235` `const edited = heldTyping() === null ? null : editedKey(store.getState());` — lê-se a digitação pendente e o estado da store do editor. [lê: EST-L05a-001 via heldTyping] [lê: EST-L05a-036 via getState]
7. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai à store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — o despacho do núcleo chama `run`.
9. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o comando na tabela de comandos (`wiring().commands`).
10. `src/app/commands.ts:349` `'project.open': openProject,` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-project.open`).

## Ramos
- R1 `src/editor/doors/door.tsx:107` `const file = Object.entries(entry.command.args).find(([name, arg]) => arg.type === 'file' && !arg.optional && !(name in given))?.[0];` — o comando declara o argumento `file` do tipo `file` (`manifest/commands/project.json:232` `"file": {`), que ainda não está em `given`, então esta porta entra no ramo do arquivo e não no despacho simples da linha 144.
- R2 `src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });` — com um arquivo escolhido (`bytes` não nulo) o comando é despachado; sem escolha (cancelamento, `bytes` nulo) nada é despachado.
- R3 `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto, o despacho vai direto à store do núcleo, o lado tomado por esta porta; com um gesto aberto e um comando que não muda o documento, ele roda pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).
- R4 `src/editor/store.ts:246` `if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();` — com uma digitação pendente cujo alvo mudou depois do comando, ela é gravada de novo; sem digitação pendente, nada roda aqui.

## Fronteiras assíncronas
- `src/editor/doors/door.tsx:149` `void chooseFile().then(async (bytes) => {` — a escolha do arquivo é uma promessa; quem retoma o caminho é ENT-L05b-0015, e os ouvintes do seletor são ENT-L05b-0016 (escolha) e ENT-L05b-0018 (cancelamento); enquanto ela espera, o estado da aplicação é o do editor intacto, com o seletor do navegador aberto.
- `src/editor/doors/door.tsx:171` `input.addEventListener('change', () => {` — o ouvinte de escolha do seletor de um arquivo (ENT-L05b-0016); resolve a promessa com os bytes lidos.
- `src/editor/doors/door.tsx:176` `input.addEventListener('cancel', () => resolve(null));` — o ouvinte de cancelamento (ENT-L05b-0018); resolve a promessa com `null`.
- `src/editor/doors/door.tsx:173` `if (chosen) void chosen.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)), () => resolve(null));` — a leitura dos bytes do arquivo escolhido é outra promessa (ENT-L05b-0017).
- `src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });` — o `await projectFileText(bytes)` espera o texto do projeto; dentro dele a descompactação do arquivo é assíncrona (`src/core/project/archive.ts:52` `const document = (await unzip(bytes)).get(PROJECT_DOCUMENT);`); o estado da aplicação não muda nesse intervalo.

## Estado
- lê: EST-L05a-001 (via beforeCommand e heldTyping), EST-L05a-036 (via getState)
- escreve: nenhum — a gravação entra no trecho `TRC-project.open`

## Resultado
- **Estado final:** EST-L01-030, EST-L01-031, EST-L01-032, EST-L01-033, EST-L01-034 e EST-L01-035 — no ramo `load` o documento passa a ser o do arquivo e a seleção e o histórico começam vazios (`src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, message: outcome.message ?? (state.refused === true ? null : state.message), refusal: null, refused: false }, id);`); nos ramos `confirm` e `refused` só a confirmação pendente ou a mensagem e a recusa são escritas (`src/core/store/store.ts:446`, `src/core/store/store.ts:451`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de páginas do explorador deriva do documento e realça a aberta (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`).
- **DOM do canvas:** no ramo `load` o quadro passa a mostrar a página do documento aberto (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o caminho da porta toma o contexto da digitação aqui e o entrega à store do núcleo em `src/editor/store.ts:220`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — o registro da digitação pendente (`src/editor/input/pending.ts:27` `let held: Typing | null = null;`) é consultado antes de o comando rodar.
- G3: ok `src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });` — a porta envia só a intenção (o id do comando e o texto do arquivo) e o tratador único `src/app/commands.ts:349` `'project.open': openProject,` decide.
- G4: n/a — a porta é o item da barra de comando, não um ponto do canvas (`manifest/commands/project.json:279` `"kind": "command-bar",`).
- G5: n/a — o caminho da porta não desenha painel nem barra; ele só despacha o comando `src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });`.
- G6: n/a — o caminho da porta não escreve a seleção; ela fica como a store a tem `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta; o caminho só despacha o comando `src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- os ouvintes do seletor (`change` e `cancel`) vivem num `<input>` criado por `chooseFile` e nunca anexado ao documento (`src/editor/doors/door.tsx:169` `const input = document.createElement('input');`); quando a promessa assenta nada mais o referencia, então não há remoção a citar nem alvo vivo a que os ouvintes fiquem presos.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-project.open
- **Argumentos enviados:** `{ file }` — `file` é o texto do arquivo escolhido, lido por `projectFileText` (`src/editor/doors/door.tsx:150` `if (bytes !== null) dispatch(entry.command.id, { ...given, [file]: await projectFileText(bytes) });`).
- R1 `src/core/project/archive.ts:66` `parsed = JSON.parse(args.file);` — `file` vem de `projectFileText` (`src/core/project/archive.ts:49` `export async function projectFileText(bytes: Uint8Array): Promise<string> {`), que devolve o `project.json` do arquivo compactado ou o texto do próprio arquivo: um arquivo compactado ou um `project.json` é JSON e o caminho segue; um arquivo solto que não seja JSON falha em `JSON.parse` e toma o lado da recusa (`src/core/project/archive.ts:68` `return { kind: 'refused' as const, message: invalid((error as Error).message).refused };`).
- R2 `src/core/project/archive.ts:72` `if (unread !== null) return { kind: 'refused' as const, message: invalid(unread).refused };` — quando `projectFileText` não conseguiu ler o arquivo compactado, o texto é `{ archive: <motivo> }` (`src/core/project/archive.ts:53`), então `unread` não é nulo e o caminho toma o lado da recusa; um arquivo lido segue.
- R3 `src/core/project/archive.ts:74` `if ('refused' in read) return { kind: 'refused' as const, message: read.refused };` — o documento que o arquivo traz passa pela validação do leitor único (`src/core/project/archive.ts:28` `if (first !== undefined) return invalid(`); aceito, o caminho segue (`src/core/project/archive.ts:29` `return { document };`); um documento inválido tomaria o lado da recusa.
- R4 `src/core/project/archive.ts:75` `if (confirmed !== true && !isEmptyProject(state.document)) return { kind: 'confirm' as const };` — depende do projeto aberto, não do argumento: vazio ou confirmado, o caminho segue para `load`; com trabalho e sem confirmação, toma o lado `confirm` e a store guarda o despacho (`src/core/store/store.ts:467` `publish(commit({ ...state, confirmation }, id));`).
