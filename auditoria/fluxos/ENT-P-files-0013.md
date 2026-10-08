# ENT-P-files-0013 — files.move pela porta panel-drag-explorer-row-folder

- **Comando:** files.move
- **Porta:** `manifest/commands/files.json:638` `"id": "panel-drag-explorer-row-folder",`
- **Gatilho:** `manifest/commands/files.json:641` `"source": "explorer-row",` `manifest/commands/files.json:642` `"zone": "folder",`
- **Tratador:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Início:** `src/editor/input/pointer/effects.ts:193` `if (into !== null) closing?.dispatch(exploringNow.entry.command.id as CommandId, { ...exploringNow.entry.door.args, ...exploringNow.args, to: into } as never);`
- **Requisitos:** REQ-1110
- **Trecho:** TRC-files.move

## Passos
1. `src/editor/input/pointer/common.ts:491` `if (typeof stands.path === 'string' && stands.path !== '') return { on: 'explorer', entry, args: stands, path: stands.path };` — o toque na área principal da linha vira um toque `explorer`, com os argumentos da linha (o `path` e o `to` do desenho, `src/editor/shell/sidebar/explorer.tsx:301` `data-args={JSON.stringify({ path: row.path, to: folderOf(row.path) })}`).
2. `src/editor/input/pointer/effects.ts:85` `if (press.on === 'explorer') ps.exploring = { press, over: null };` — o toque começa o arraste de linha.
3. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o toque abre o gesto na store do editor. [escreve: EST-L01-007 via store.gesture]
4. `src/editor/input/pointer/panels.ts:96` `ps.exploring = { ...ps.exploring, over };` — os movimentos marcam a pasta sob o ponteiro (`src/editor/input/pointer/panels.ts:94` `const over = p.folderUnder(at)?.getAttribute('data-folder') ?? null;`).
5. `src/editor/input/pointer/effects.ts:189` `if (ps.exploring !== null && effect === 'commit' && ps.exploring.press.path !== '') {` — a liberação com caminho não vazio entra no ramo do arraste de linha.
6. `src/editor/input/pointer/effects.ts:190` `const into = ps.exploring.over;` — `into` é a pasta marcada.
7. `src/editor/input/pointer/effects.ts:193` `if (into !== null) closing?.dispatch(exploringNow.entry.command.id as CommandId, { ...exploringNow.entry.door.args, ...exploringNow.args, to: into } as never);` — a porta despacha `files.move` com o caminho da linha e a pasta sob o ponteiro; esta é a linha de Início.
8. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto da store do editor encaminha o despacho ao gesto do núcleo.
9. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
10. `src/core/store/store.ts:720` `return run(id, args, current);` — chama a regra única de execução dentro do gesto.
11. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
12. `src/app/commands.ts:305` `'files.move': moveFileCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A zona da liberação: `src/editor/input/pointer/effects.ts:193` `if (into !== null) closing?.dispatch(exploringNow.entry.command.id as CommandId, { ...exploringNow.entry.door.args, ...exploringNow.args, to: into } as never);` — sobre uma pasta o arraste move o arquivo; fora de qualquer pasta o clique abre o arquivo (`src/editor/input/pointer/effects.ts:194` `else if (EXPLORER_OPEN !== null) closing?.dispatch(EXPLORER_OPEN.command.id as CommandId, { ...EXPLORER_OPEN.door.args, path: exploringNow.path } as never);`).
- O caminho da linha: `src/editor/input/pointer/effects.ts:189` `if (ps.exploring !== null && effect === 'commit' && ps.exploring.press.path !== '') {` — caminho vazio não entra no ramo; não vazio segue ao passo 6.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.move grava EST-L01-030 com `document.files`, `document.folders` e `document.pages[].file` nos caminhos novos (`src/core/files/files.ts:485` `return { kind: 'change' as const, patches, message: message('status.files.moved', { name: nameOfPath(from), folder: folder === '' ? '/' : folder }) };`); na mesma pasta, nada muda.
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o arquivo movido não é o de uma página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — os patches escrevem `files`, `folders` e `pages[].file`, fora de qualquer camada de estilo (`src/core/files/files.ts:481` `const patches = pathMovePatches(state.document, rules, from, wanted);`).
- G2: ok `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada antes de o gesto abrir (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:305` `'files.move': moveFileCommand,` — as três portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/input/pointer/effects.ts:193`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/input/pointer/effects.ts:193`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:485`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/effects.ts:193`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (o ponto do ponteiro vem dos eventos do gesto, em `src/editor/input/pointer/panels.ts:94`).

## Ramos do trecho
- **Trecho:** TRC-files.move
- **Argumentos enviados:** `{ path: row.path, to: into }` — o caminho da linha arrastada e a pasta sob o ponteiro.
- R1: o caminho não alcança o lançamento de caminho vazio — o ramo só executa com `ps.exploring.press.path !== ''` (`src/editor/input/pointer/effects.ts:189` `if (ps.exploring !== null && effect === 'commit' && ps.exploring.press.path !== '') {`); o `throw` de `src/core/files/files.ts:476` `if (from === '') throw new Error('files.move: a door hands the path it moves');` não é tomado.
- R2: o caminho não alcança a recusa de destino que não é pasta — `to` é o `data-folder` de uma linha de pasta (`src/editor/input/pointer/panels.ts:94` `const over = p.folderUnder(at)?.getAttribute('data-folder') ?? null;`); a recusa de `src/core/files/files.ts:477` `if (folder !== '' && !folderPaths(state.document).includes(folder)) return { kind: 'refused' as const, message: message('status.files.nameTaken', { path: folder, name: nameOfPath(folder) }) };` não é tomada.
- R3: o par decide a recusa: uma das recusas de `renameRefusal` (`src/core/files/files.ts:376` `if (projectPathProblem(to) !== null) return message('status.files.badName', { name: nameOfPath(to) });`) devolve `refused`; nenhuma (`src/core/files/files.ts:392` `return null;`) segue.
- R4: o caminho passa pelo lado de nada mudar quando a linha já está na pasta (`src/core/files/files.ts:484` `if (patches.length === 0) return { kind: 'change' as const };`); com patches, segue para a mensagem.
