# ENT-P-files-0015 — files.move pela porta explorer-move-target

- **Comando:** files.move
- **Porta:** `manifest/commands/files.json:684` `"id": "explorer-move-target",`
- **Tratador:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1110
- **Trecho:** TRC-files.move

## Passos
1. `src/editor/shell/sidebar/explorer.tsx:317` `<DoorControl key={folder} entry={target} args={{ path: row.path, to: folder }} className="row__target">` — cada item da lista de destinos carrega o caminho da linha e a pasta do destino nos argumentos (a lista sai de `folders`, `src/editor/shell/sidebar/explorer.tsx:316` `{folders.map((folder) => (`).
2. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no item roda `door.run`.
3. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
4. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{}`) e o `path` e o `to` do item.
6. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `files.move` com o caminho da linha e a pasta escolhida; esta é a linha de Início.
7. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
8. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:305` `'files.move': moveFileCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:305` `'files.move': moveFileCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.move grava EST-L01-030 com `document.files`, `document.folders` e `document.pages[].file` nos caminhos novos (`src/core/files/files.ts:485` `return { kind: 'change' as const, patches, message: message('status.files.moved', { name: nameOfPath(from), folder: folder === '' ? '/' : folder }) };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o arquivo movido não é o de uma página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — os patches escrevem `files`, `folders` e `pages[].file`, fora de qualquer camada de estilo (`src/core/files/files.ts:481` `const patches = pathMovePatches(state.document, rules, from, wanted);`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:305` `'files.move': moveFileCommand,` — as três portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:485`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-files.move
- **Argumentos enviados:** `{ path: row.path, to: folder }` — o caminho da linha e a pasta do item escolhido.
- R1: o caminho não alcança o lançamento de caminho vazio, porque `path` é o caminho da linha; o `throw` de `src/core/files/files.ts:476` `if (from === '') throw new Error('files.move: a door hands the path it moves');` não é tomado.
- R2: o caminho não alcança a recusa de destino que não é pasta — `to` vem da lista `folders`, que são pastas existentes (mais a raiz vazia).
- R3: o par decide a recusa: uma das recusas de `renameRefusal` (`src/core/files/files.ts:381` `if (!to.startsWith(`${from}/`) && pathTaken(document, to)) return message('status.files.nameTaken', { path: to, name: nameOfPath(to) });`) devolve `refused`; nenhuma segue.
- R4: o caminho passa pelo lado de nada mudar quando o item é a pasta em que a linha já está (`src/core/files/files.ts:484` `if (patches.length === 0) return { kind: 'change' as const };`); outra pasta segue para a mensagem.
