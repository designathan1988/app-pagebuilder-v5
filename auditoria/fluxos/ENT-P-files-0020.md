# ENT-P-files-0020 — files.upload pela porta explorer-upload

- **Comando:** files.upload
- **Porta:** `manifest/commands/files.json:933` `"id": "explorer-upload",`
- **Tratador:** `src/app/commands.ts:309` `'files.upload': uploadCommand,`
- **Início:** `src/editor/doors/door.tsx:131` `dispatch(entry.command.id, { ...given, [file]: records });`
- **Requisitos:** REQ-1114
- **Trecho:** TRC-files.upload

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o botão de carregar arquivos tem `door.run` no clique.
2. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
3. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
4. `src/editor/doors/door.tsx:127` `if (file !== undefined && entry.door.adapter.fileReading === 'upload') {` — a porta armazena os próprios arquivos, então o ramo do seletor de arquivos é o seu.
5. `src/editor/doors/door.tsx:128` `void chooseFiles().then(async (chosen) => {` — o navegador abre o seletor de arquivos; a leitura espera.
6. `src/editor/doors/door.tsx:129` `if (chosen.length === 0) return;` — nada escolhido não despacha.
7. `src/editor/doors/door.tsx:130` `const records = await Promise.all(chosen.map((one) => readUploadFile(one)));` — cada arquivo é lido como recurso (bytes e tamanho de imagem).
8. `src/editor/doors/door.tsx:131` `dispatch(entry.command.id, { ...given, [file]: records });` — a porta despacha `files.upload` com os arquivos lidos; esta é a linha de Início.
9. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
10. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
14. `src/app/commands.ts:309` `'files.upload': uploadCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O seletor de arquivos: `src/editor/doors/door.tsx:129` `if (chosen.length === 0) return;` — nada escolhido não despacha; com arquivos segue ao passo 7.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- O seletor de arquivos do navegador: `src/editor/doors/door.tsx:128` `void chooseFiles().then(async (chosen) => {` — entre o clique e o retorno da promessa o editor segue montado; entradas do editor podem rodar nesse intervalo (a lista em `auditoria/entradas.md`), com o documento como está.
- A leitura dos arquivos: `src/editor/doors/door.tsx:130` `const records = await Promise.all(chosen.map((one) => readUploadFile(one)));` — enquanto os bytes são lidos, o editor segue montado e outras entradas podem rodar.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.upload grava EST-L01-030 com `document.files` ganhando um registro por arquivo, cada um no seu caminho (`src/core/files/files.ts:216` `patches: addRecords(state.document, records),`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document.files` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `files`, que o canvas só desenha por um elemento que o use (`src/core/files/files.ts:216`).

## Regras
- G1: n/a — os patches escrevem `files`, fora de qualquer camada de estilo (`src/core/files/files.ts:214`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:309` `'files.upload': uploadCommand,` — as duas portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:131`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:131`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:214`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (o seletor de arquivos é um `<input type="file">` efêmero criado e abandonado por `chooseFiles`, `src/editor/doors/door.tsx:182` `function chooseFiles(): Promise<readonly File[]> {`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:131`).

## Ramos do trecho
- **Trecho:** TRC-files.upload
- **Argumentos enviados:** `{ files: records }` — os arquivos lidos; o manifesto dá `args` vazio à porta (`manifest/commands/files.json:957` `"args": {}`), então `folder` não vai.
- R1: o caminho não alcança o lançamento de lista vazia — o seletor não despacha sem arquivos (`src/editor/doors/door.tsx:129` `if (chosen.length === 0) return;`); o `throw` de `src/core/files/files.ts:209` `if (list.length === 0) throw new Error('files.upload: no file');` não é tomado.
- R2: o caminho decide a recusa pelo tipo de cada arquivo: um arquivo nem suportado nem dado recusa (`src/core/files/files.ts:212` `if (wrong !== undefined) return { kind: 'refused' as const, message: message('status.files.unsupportedType', { name: wrong.name }) };`); todos aceitos seguem.
- R3: o caminho passa pelo lado sem pasta nomeada, porque `folder` não vai; a pasta é a do tipo (`src/core/files/files.ts:132` `const path = uploadPath(held, folder === undefined || folder === '' ? folderFor(file.type) : folder, file.name);`).
