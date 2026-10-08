# ENT-P-files-0016 — files.delete pela porta explorer-delete

- **Comando:** files.delete
- **Porta:** `manifest/commands/files.json:745` `"id": "explorer-delete",`
- **Tratador:** `src/app/commands.ts:306` `'files.delete': deleteFileCommand,`
- **Início:** `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1111
- **Trecho:** TRC-files.delete

## Passos
1. `src/editor/shell/sidebar/explorer.tsx:312` `{doors.remove === undefined || row.generated ? null : <DoorControl entry={doors.remove} args={{ path: row.path }} label={t('explorer.deleteRow', { name })} />}` — o botão de apagar da linha carrega o caminho da linha nos argumentos.
2. `src/editor/doors/door.tsx:286` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão roda `door.run`.
3. `src/editor/doors/door.tsx:93` `const run = () => {` — o clique entra na função `run` do `useDoor`.
4. `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — porta indisponível não despacha.
5. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{}`) e o `path` da linha.
6. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta despacha `files.delete` com o caminho da linha; esta é a linha de Início.
7. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
8. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:306` `'files.delete': deleteFileCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- A confirmação: `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {` — não confirmado, a store publica o pedido de confirmação; confirmado, o trecho segue para os patches.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:306` `'files.delete': deleteFileCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.delete grava EST-L01-030 sem o caminho e o que ele guarda em `document.files` e `document.folders` (`src/core/files/files.ts:509` `return { kind: 'change' as const, patches, message: message('status.files.deleted', { name: nameOfPath(wanted) }) };`); sem confirmação, `confirmation` fica com o pedido.
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a árvore de arquivos deriva de `document` (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** nada muda — o comando escreve `files`/`folders`, sem nós novos no documento (`src/core/files/files.ts:509`).

## Regras
- G1: n/a — os patches escrevem `files` e `folders`, fora de qualquer camada de estilo (`src/core/files/files.ts:507` `const patches: Patch[] = [{ op: 'replace', path: ['files'], value: files }];`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:306` `'files.delete': deleteFileCommand,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/files/files.ts:509`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-files.delete
- **Argumentos enviados:** `{ path: row.path }` — o caminho da linha.
- R1: o caminho não alcança o lançamento de caminho vazio, porque `path` é o caminho da linha; o `throw` de `src/core/files/files.ts:493` `if (wanted === '') throw new Error('files.delete: a door hands the path it deletes');` não é tomado.
- R2: o caminho decide a recusa: uma das recusas decide o lado — arquivo gerado (`src/core/files/files.ts:494` `if (pathGenerated(wanted) || holdsGenerated(wanted)) return { kind: 'refused' as const, message: message('status.files.generatedPath', { path: wanted }) };`), ausente (`src/core/files/files.ts:496` `if (!isFolder && fileAt(state.document, wanted) === null) return { kind: 'refused' as const, message: message('status.files.missing', { path: wanted }) };`), pasta que guarda página (`src/core/files/files.ts:499`) ou arquivo ligado (`src/core/files/files.ts:501`); nenhuma segue para os patches.
- R3: o caminho passa pelo pedido de confirmação quando a pasta guarda arquivos e não veio confirmada (`src/core/files/files.ts:504` `if (holds && confirmed !== true) return { kind: 'confirm' as const };`); confirmado, segue; arquivo solto, segue direto.
