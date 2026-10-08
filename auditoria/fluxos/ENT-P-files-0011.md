# ENT-P-files-0011 — files.startRename pela porta explorer-file-name

- **Comando:** files.startRename
- **Porta:** `manifest/commands/files.json:505` `"id": "explorer-file-name",`
- **Tratador:** `src/app/commands.ts:303` `'files.startRename': startRenameFile,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1108
- **Trecho:** TRC-files.startRename

## Passos
1. `src/editor/shell/sidebar/explorer.tsx:311` `{row.generated ? null : <DoorControl entry={RENAME_START} args={{ path: row.path }} />}` — o botão de renomear da linha carrega o caminho da linha nos argumentos.
2. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão roda `door.run`.
3. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
4. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{}`) e o `path` da linha.
6. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `files.startRename` com o caminho da linha; esta é a linha de Início.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
8. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:303` `'files.startRename': startRenameFile,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que não muda o documento (como este), roda pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:303` `'files.startRename': startRenameFile,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-037

## Resultado
- **Estado final:** o trecho TRC-files.startRename grava EST-L01-037 com `ui.renamingFile` nomeando a linha em renomeação (`src/editor/explorer/explorer.ts:164` `return { kind: 'change', ui: { ...state.ui, renamingFile: path === '' ? undefined : path } };`); o documento não muda.
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha desenha o campo do nome no lugar do rótulo (`src/editor/shell/sidebar/explorer.tsx:234` `const renaming = useEditorState((s) => s.ui.renamingFile === row.path);`).
- **DOM do canvas:** nada muda — o comando escreve `ui.renamingFile`, que o canvas não lê (`src/editor/explorer/explorer.ts:164`).

## Regras
- G1: n/a — o comando escreve `ui.renamingFile`, fora de qualquer camada de estilo (`src/editor/explorer/explorer.ts:164`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:303` `'files.startRename': startRenameFile,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho muda `ui.renamingFile`; a igualdade de render é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-files.startRename
- **Argumentos enviados:** `{ path: row.path }` — o caminho da linha (o manifesto dá `args` vazio à porta: `manifest/commands/files.json:528` `"args": {}`).
- R1: o caminho não alcança o lançamento de argumento não texto, porque `path` é o texto do caminho da linha; o `throw` de `src/editor/explorer/explorer.ts:162` `if (typeof path !== 'string') throw new Error('files.startRename: a door hands the path of the row it renames');` não é tomado.
- R2: o caminho passa pelo lado que abre a renomeação, porque `path` tem valor; a linha `src/editor/explorer/explorer.ts:164` `return { kind: 'change', ui: { ...state.ui, renamingFile: path === '' ? undefined : path } };` toma o ramo do valor, e não o que encerra a renomeação.
