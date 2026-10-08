# ENT-P-files-0021 — files.upload pela porta panel-drag-os-file-explorer-folder

- **Comando:** files.upload
- **Porta:** `manifest/commands/files.json:960` `"id": "panel-drag-os-file-explorer-folder",`
- **Gatilho:** `manifest/commands/files.json:963` `"source": "os-file",` `manifest/commands/files.json:964` `"zone": "explorer-folder",`
- **Tratador:** `src/app/commands.ts:309` `'files.upload': uploadCommand,`
- **Início:** `src/editor/input/file-drop.ts:74` `store.dispatch(door.command.id as never, { ...door.door.args, files: stored } as never);`
- **Requisitos:** REQ-1114
- **Trecho:** TRC-files.upload

## Passos
1. `src/editor/input/file-drop.ts:67` `const drop = (event: DragEvent): void => {` — o ouvinte de soltura sobre a zona de pasta do explorador trata o arquivo do sistema operacional (o ouvinte é posto por `installFolderDrop`, `src/editor/input/file-drop.ts:58` `function installFolderDrop(store: EditorStore, win: Window): () => void {`).
2. `src/editor/input/file-drop.ts:71` `const dropped = [...(event.dataTransfer?.files ?? [])];` — os arquivos soltos.
3. `src/editor/input/file-drop.ts:72` `if (dropped.length === 0) return;` — sem arquivos não despacha.
4. `src/editor/input/file-drop.ts:73` `void Promise.all(dropped.map((one) => readUploadFile(one))).then((stored) => {` — cada arquivo é lido como recurso; a leitura espera.
5. `src/editor/input/file-drop.ts:74` `store.dispatch(door.command.id as never, { ...door.door.args, files: stored } as never);` — a porta despacha `files.upload` com os arquivos lidos; esta é a linha de Início.
6. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
7. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:309` `'files.upload': uploadCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- O caminho da soltura: `src/editor/input/file-drop.ts:72` `if (dropped.length === 0) return;` — sem arquivos não despacha; com arquivos segue ao passo 4.
- A zona da soltura: `src/editor/input/file-drop.ts:68` `const zone = zoneOf(event.target);` — fora da zona da pasta do explorador a soltura não é tratada aqui (`src/editor/input/file-drop.ts:69` `if (zone === null) return;`).
- O gesto aberto na store do editor: `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- A leitura dos arquivos: `src/editor/input/file-drop.ts:73` `void Promise.all(dropped.map((one) => readUploadFile(one))).then((stored) => {` — entre a soltura e o retorno da promessa o editor segue montado; entradas do editor podem rodar nesse intervalo (a lista em `auditoria/entradas.md`), com o documento como está.
- Os ouvintes da soltura: `src/editor/input/file-drop.ts:77` `win.addEventListener('dragover', over as EventListener);` e `src/editor/input/file-drop.ts:78` `win.addEventListener('drop', drop as EventListener);` — ficam postos na janela enquanto o editor está montado e são removidos na desmontagem.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.upload grava EST-L01-030 com `document.files` ganhando um registro por arquivo, cada um no seu caminho (`src/core/files/files.ts:216` `patches: addRecords(state.document, records),`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document.files` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `files`, que o canvas só desenha por um elemento que o use (`src/core/files/files.ts:216`).

## Regras
- G1: n/a — os patches escrevem `files`, fora de qualquer camada de estilo (`src/core/files/files.ts:216`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:309` `'files.upload': uploadCommand,` — as duas portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/input/file-drop.ts:74`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/input/file-drop.ts:74`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:216`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- Os ouvintes criados por `installFolderDrop` são removidos na desmontagem (`src/editor/input/file-drop.ts:80` `win.removeEventListener('dragover', over as EventListener);` e `src/editor/input/file-drop.ts:81` `win.removeEventListener('drop', drop as EventListener);`); o caminho da porta (da linha 74 ao despacho) não cria ouvinte, timer nem observador.

## Medições
- nenhuma — o ponto do ponteiro vem dos eventos de arraste; nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/input/file-drop.ts:74`).

## Ramos do trecho
- **Trecho:** TRC-files.upload
- **Argumentos enviados:** `{ files: stored }` — os arquivos lidos; o manifesto dá `args` vazio à porta (`manifest/commands/files.json:978` `"args": {}`), então `folder` não vai.
- R1: o caminho não alcança o lançamento de lista vazia — a soltura sem arquivos não despacha (`src/editor/input/file-drop.ts:72` `if (dropped.length === 0) return;`); o `throw` de `src/core/files/files.ts:209` `if (list.length === 0) throw new Error('files.upload: no file');` não é tomado.
- R2: o caminho decide a recusa pelo tipo de cada arquivo: um arquivo nem suportado nem dado recusa (`src/core/files/files.ts:212` `if (wrong !== undefined) return { kind: 'refused' as const, message: message('status.files.unsupportedType', { name: wrong.name }) };`); todos aceitos seguem.
- R3: o caminho passa pelo lado sem pasta nomeada, porque `folder` não vai; a pasta é a do tipo (`src/core/files/files.ts:132` `const path = uploadPath(held, folder === undefined || folder === '' ? folderFor(file.type) : folder, file.name);`).
