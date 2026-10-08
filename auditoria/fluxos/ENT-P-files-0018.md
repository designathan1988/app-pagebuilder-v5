# ENT-P-files-0018 — files.open pela porta file-tab (aba de arquivo)

- **Comando:** files.open
- **Porta:** `manifest/commands/files.json:821` `"id": "file-tab",`
- **Tratador:** `src/app/commands.ts:307` `'files.open': openFile,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1112
- **Trecho:** TRC-files.open

## Passos
1. `src/editor/shell/canvas.tsx:66` `<DoorControl entry={fileTab} args={{ path }} className="file-tab__main">` — a aba de um arquivo de código carrega o caminho nos argumentos (a porta é o controle `file-tab` da região `file-tabs`, `src/editor/shell/canvas.tsx:45` `const fileTab = doorSlots('file-tabs').find((d) => d.door.kind === 'panel-control' && d.door.control === 'file-tab');`).
2. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique na aba roda `door.run`.
3. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
4. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{}`) e o `path` da aba.
6. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `files.open` com o caminho da aba; esta é a linha de Início.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
8. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:307` `'files.open': openFile,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que não muda o documento, roda pelo gesto (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:307` `'files.open': openFile,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-037

## Resultado
- **Estado final:** o trecho TRC-files.open grava EST-L01-037 com `ui.code.open` ganhando o caminho e `ui.editorView` passando a `code` fora do modo dividido (`src/editor/explorer/explorer.ts:151` `return { kind: 'change', ui: editorView(state.ui) === 'split' ? ui : { ...ui, editorView: 'code' }, message: message('status.files.opened', { path }) };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a faixa de abas desenha os arquivos abertos (`src/editor/shell/canvas.tsx:44` `const code = useEditorState((s) => codeTabs(s.ui)?.open ?? NO_CODE);`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando o centro só troca para o código (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — o comando escreve `ui.code` e `ui.editorView`, fora de qualquer camada de estilo (`src/editor/explorer/explorer.ts:151`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:307` `'files.open': openFile,` — as duas portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho muda `ui.code`/`ui.editorView`; a igualdade de render é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-files.open
- **Argumentos enviados:** `{ path }` — o caminho da aba (`src/editor/shell/canvas.tsx:66` `<DoorControl entry={fileTab} args={{ path }} className="file-tab__main">`).
- R1: o caminho não alcança o lançamento de argumento não texto ou vazio, porque `path` é o caminho da aba; o `throw` de `src/editor/explorer/explorer.ts:148` `if (typeof path !== 'string' || path === '') throw new Error('files.open: a door hands the path of the file it opens');` não é tomado.
- R2: o caminho passa pela recusa quando o caminho não está entre as linhas da árvore (`src/editor/explorer/explorer.ts:149` `if (fileRows(state.document, rules).every((row) => row.path !== path)) return { kind: 'refused', message: message('status.files.missing', { path }) };`); na árvore, segue.
- R3: a vista decide: `ui: editorView(state.ui) === 'split' ? ui : { ...ui, editorView: 'code' }` (`src/editor/explorer/explorer.ts:151`) — no modo dividido só os tabs mudam.
