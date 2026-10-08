# ENT-P-files-0009 — files.createFolder pela porta explorer-new-folder

- **Comando:** files.createFolder
- **Porta:** `manifest/commands/files.json:397` `"id": "explorer-new-folder",`
- **Tratador:** `src/app/commands.ts:301` `'files.createFolder': createFolderCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:200` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(door.command.id as CommandId, { ...door.door.args, path });`
- **Requisitos:** REQ-1106
- **Trecho:** TRC-files.createFolder

## Passos
1. `src/editor/shell/sidebar/explorer.tsx:197` `const make = (typed: string): void => {` — o campo do novo caminho, no Enter do seu formulário, entrega o texto digitado a `make` (`src/editor/shell/sidebar/explorer.tsx:204` `make(String(new FormData(event.currentTarget).get('path') ?? ''));`).
2. `src/editor/shell/sidebar/explorer.tsx:198` `const path = typed.trim();` — o caminho é o texto podado nas pontas.
3. `src/editor/shell/sidebar/explorer.tsx:199` `if (path === '' || !field.built) return;` — campo vazio ou não construído não despacha.
4. `src/editor/shell/sidebar/explorer.tsx:200` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(door.command.id as CommandId, { ...door.door.args, path });` — a porta despacha `files.createFolder` com o caminho digitado; esta é a linha de Início.
5. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
6. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:301` `'files.createFolder': createFolderCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A guarda do campo: `src/editor/shell/sidebar/explorer.tsx:199` `if (path === '' || !field.built) return;` — caminho vazio não despacha; não vazio segue ao passo 4.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:301` `'files.createFolder': createFolderCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.createFolder grava EST-L01-030 com `document.folders` ganhando o caminho novo (`src/core/files/files.ts:448` `return { kind: 'change' as const, patches: [{ op: 'add', path: ['folders'], value: [...(state.document.folders ?? []), wanted] }], message: message('status.files.folderCreated', { name: nameOfPath(wanted) }) };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document.folders` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `folders`, que o canvas não desenha (`src/core/files/files.ts:448`).

## Regras
- G1: n/a — o patch escreve `folders`, fora de qualquer camada de estilo (`src/core/files/files.ts:448`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:301` `'files.createFolder': createFolderCommand,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/shell/sidebar/explorer.tsx:200`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/shell/sidebar/explorer.tsx:200`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite um patch aplicado pela store (`src/core/files/files.ts:448`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/shell/sidebar/explorer.tsx:200`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/shell/sidebar/explorer.tsx:200`).

## Ramos do trecho
- **Trecho:** TRC-files.createFolder
- **Argumentos enviados:** `{ path }` — o caminho digitado, já podado nas pontas.
- R1: o caminho não alcança o lançamento de caminho vazio — a guarda do campo só despacha com caminho não vazio (`src/editor/shell/sidebar/explorer.tsx:199` `if (path === '' || !field.built) return;`); o `throw` de `src/core/files/files.ts:445` `if (wanted === '') throw new Error('files.createFolder: a door hands the path of the folder it makes');` não é tomado.
- R2: o caminho decide a recusa: uma das quatro recusas de `makingRefusal` (`src/core/files/files.ts:429` `if (projectPathProblem(path) !== null) return message('status.files.badName', { name: path });`) devolve `refused`; nenhuma (`src/core/files/files.ts:434` `return null;`) segue para o patch.
