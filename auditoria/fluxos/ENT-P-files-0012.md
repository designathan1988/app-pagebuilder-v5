# ENT-P-files-0012 — files.rename pela porta explorer-file-name-field

- **Comando:** files.rename
- **Porta:** `manifest/commands/files.json:569` `"id": "explorer-file-name-field",`
- **Tratador:** `src/app/commands.ts:304` `'files.rename': renameFileCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:243` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(doors.rename?.command.id as CommandId, { path: row.path, name: wanted });`
- **Requisitos:** REQ-1109
- **Trecho:** TRC-files.rename

## Passos
1. `src/editor/shell/sidebar/explorer.tsx:275` `onBlur={(event) => keepName(event.currentTarget.value)}` — o campo do nome da linha, ao perder o foco, entrega o texto a `keepName` (o Enter passa pelo mesmo `keepName`, em `src/editor/shell/sidebar/explorer.tsx:262` `keepName(String(new FormData(event.currentTarget).get('name') ?? ''));`).
2. `src/editor/shell/sidebar/explorer.tsx:239` `void store.dispatch(RENAME_START.command.id as CommandId, { path: '' });` — a renomeação em curso é encerrada antes de escrever (o campo some).
3. `src/editor/shell/sidebar/explorer.tsx:240` `if (renamed === null || !renamed.built) return;` — porta não construída não despacha.
4. `src/editor/shell/sidebar/explorer.tsx:241` `const wanted = typed.trim();` — o nome é o texto podado nas pontas.
5. `src/editor/shell/sidebar/explorer.tsx:242` `if (wanted === '' || wanted === name) return;` — nome vazio ou igual ao da linha não despacha.
6. `src/editor/shell/sidebar/explorer.tsx:243` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(doors.rename?.command.id as CommandId, { path: row.path, name: wanted });` — a porta despacha `files.rename` com o caminho da linha e o nome digitado; esta é a linha de Início.
7. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
8. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:304` `'files.rename': renameFileCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A guarda do campo: `src/editor/shell/sidebar/explorer.tsx:242` `if (wanted === '' || wanted === name) return;` — nome vazio ou o da linha não despacha; diferente segue ao passo 6.
- O gesto aberto na store do editor: `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:304` `'files.rename': renameFileCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.rename grava EST-L01-030 com `document.files`, `document.folders` e `document.pages[].file` nos caminhos novos (`src/core/files/files.ts:469` `return { kind: 'change' as const, patches: pathMovePatches(state.document, rules, from, to), message: message('status.files.renamed', { name: typed }) };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o arquivo renomeado não é o de uma página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — os patches escrevem `files`, `folders` e `pages[].file`, fora de qualquer camada de estilo (`src/core/files/files.ts:469`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:304` `'files.rename': renameFileCommand,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/shell/sidebar/explorer.tsx:243`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/shell/sidebar/explorer.tsx:243`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:412`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/shell/sidebar/explorer.tsx:243`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/shell/sidebar/explorer.tsx:243`).

## Ramos do trecho
- **Trecho:** TRC-files.rename
- **Argumentos enviados:** `{ path: row.path, name: wanted }` — o caminho da linha e o nome digitado, já podado nas pontas.
- R1: o caminho não alcança a recusa de `path`/`name` vazio — a guarda do campo só despacha com nome não vazio e diferente do atual (`src/editor/shell/sidebar/explorer.tsx:242` `if (wanted === '' || wanted === name) return;`); a recusa de `src/core/files/files.ts:465` `if (from === '' || typed === '') return { kind: 'refused' as const, message: argumentRefused(from === '' ? 'path' : 'name') };` não é tomada.
- R2: o par decide a recusa: uma das recusas de `renameRefusal` (`src/core/files/files.ts:376` `if (projectPathProblem(to) !== null) return message('status.files.badName', { name: nameOfPath(to) });`) devolve `refused`; nenhuma (`src/core/files/files.ts:392` `return null;`) segue para os patches.
