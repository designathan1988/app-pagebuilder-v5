# ENT-P-files-0025 — assets.insertImageFile pela porta canvas-drag-os-image-file-drop-proposal

- **Comando:** assets.insertImageFile
- **Porta:** `manifest/commands/files.json:1148` `"id": "canvas-drag-os-image-file-drop-proposal",`
- **Gatilho:** `manifest/commands/files.json:1151` `"source": "os-image-file",` `manifest/commands/files.json:1152` `"zone": "drop-proposal",`
- **Tratador:** `src/app/commands.ts:311` `'assets.insertImageFile': insertImageFileCommand,`
- **Início:** `src/editor/input/file-drop.ts:172` `store.dispatch(door.command.id, args as never);`
- **Requisitos:** REQ-1116
- **Trecho:** TRC-assets.insertImageFile

## Passos
1. `src/editor/input/file-drop.ts:143` `const drop = (event: DragEvent): void => {` — o ouvinte de soltura de uma imagem do sistema operacional sobre o quadro trata o arquivo (o ouvinte é posto por `installOsFileDrop`, `src/editor/input/file-drop.ts:116` `export function installOsFileDrop(store: EditorStore, win: Window, inside: boolean): () => void {`).
2. `src/editor/input/file-drop.ts:152` `const file = event.dataTransfer?.files?.[0];` — o primeiro arquivo solto.
3. `src/editor/input/file-drop.ts:154` `const target = imageUnder(store, at);` — a imagem sob o ponteiro, se houver.
4. `src/editor/input/file-drop.ts:155` `const place = target === null ? fileDropProposal(store, at) : null;` — o lugar da proposta de criação, quando não há imagem sob o ponteiro.
5. `src/editor/input/file-drop.ts:156` `if (target === null && place === null) return;` — sem lugar não despacha.
6. `src/editor/input/file-drop.ts:161` `void readUploadFile(file).then((payload: UploadedFile) => {` — o arquivo é lido como recurso; a leitura espera.
7. `src/editor/input/file-drop.ts:172` `store.dispatch(door.command.id, args as never);` — a porta despacha `assets.insertImageFile` com o arquivo e o lugar (ou a imagem a substituir); esta é a linha de Início.
8. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
9. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:311` `'assets.insertImageFile': insertImageFileCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A soltura da imagem: `src/editor/input/file-drop.ts:156` `if (target === null && place === null) return;` — sem imagem sob o ponteiro e sem proposta não despacha; com uma ou outra segue.
- O lugar contra a imagem: `src/editor/input/file-drop.ts:155` `const place = target === null ? fileDropProposal(store, at) : null;` — sobre uma imagem vão `replace` e o pai; fora dela vão `parent` e `index` (`src/editor/input/file-drop.ts:169` `const args = target === null`).
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- A leitura da imagem: `src/editor/input/file-drop.ts:161` `void readUploadFile(file).then((payload: UploadedFile) => {` — entre a soltura e o retorno da promessa o editor segue montado; entradas do editor podem rodar nesse intervalo (a lista em `auditoria/entradas.md`), com o documento como está.
- Os ouvintes da soltura: `src/editor/input/file-drop.ts:181` `for (const [name, listener] of listeners) win.addEventListener(name, listener);` — ficam postos na janela enquanto o editor está montado e são removidos na desmontagem.

## Estado
- lê: EST-L01-030, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-assets.insertImageFile grava EST-L01-030 com `document.files` ganhando o arquivo e o documento ganhando o Image que o usa (na posição, `src/core/files/assets.ts:56`; ou trocando o `src` de uma imagem, `src/core/files/assets.ts:39`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o canvas e as Camadas derivam do documento (`src/core/project/pages.ts:72` `export const pageShown = (state: { readonly document: { readonly pages: readonly Page[] }; readonly ui?: unknown }): Page | null => state.document.pages[openedPage(state)] ?? null;`).
- **DOM do canvas:** o Image novo é desenhado na página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — os patches escrevem `files` e `children`, fora de qualquer camada de estilo (`src/core/files/assets.ts:56` `patches: [...held, { op: 'add' as const, path: [...at.parent.path, 'children', at.index], value: node }],`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:311` `'assets.insertImageFile': insertImageFileCommand,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/input/file-drop.ts:172`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/input/file-drop.ts:172`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/assets.ts:56`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- Os ouvintes criados por `installOsFileDrop` são removidos na desmontagem (`src/editor/input/file-drop.ts:183` `for (const [name, listener] of listeners) win.removeEventListener(name, listener);`); o caminho da porta (da linha 172 ao despacho) não cria ouvinte, timer nem observador.

## Medições
- nenhuma — o ponto do ponteiro vem dos eventos de arraste; nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/input/file-drop.ts:172`).

## Ramos do trecho
- **Trecho:** TRC-assets.insertImageFile
- **Argumentos enviados:** `{ file: payload, parent, index }` fora de uma imagem, ou `{ file: payload, parent, index: 0, replace: target }` sobre uma imagem (`src/editor/input/file-drop.ts:170` `? { ...door.door.args, file: payload, parent: place?.parent, index: Math.min(place?.index ?? 0, parent?.node.children.length ?? 0) }`).
- R1: o caminho não alcança o lançamento de arquivo nulo — a soltura só chega ao despacho com um arquivo (`src/editor/input/file-drop.ts:152` `const file = event.dataTransfer?.files?.[0];`); o `throw` de `src/core/files/assets.ts:21` `if (first === undefined) throw new Error('assets.insertImageFile: no file');` não é tomado.
- R2: o caminho decide a recusa pelo tipo: um arquivo de tipo não aceito recusa (`src/core/files/assets.ts:23` `if (wrong !== undefined) return { kind: 'refused' as const, message: message('status.files.unsupportedType', { name: wrong.name }) };`); aceito segue.
- R3: o caminho passa pela troca da fonte quando a soltura foi sobre uma imagem, porque `replace` vai (`src/editor/input/file-drop.ts:171` `: { ...door.door.args, file: payload, parent: locate(document, target as NodeId)?.parent?.id, index: 0, replace: target };`); fora de uma imagem, `replace` não vai.
- R4: o caminho passa pela inserção na posição quando a soltura não foi sobre uma imagem, porque `parent` e `index` vão (`src/editor/input/file-drop.ts:170` `? { ...door.door.args, file: payload, parent: place?.parent, index: Math.min(place?.index ?? 0, parent?.node.children.length ?? 0) }`); sobre uma imagem, a inserção não é tomada.
