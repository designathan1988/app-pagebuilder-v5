# ENT-P-files-0023 — files.saveContent pela porta key-ctrl-s-in-code-editor

- **Comando:** files.saveContent
- **Porta:** `manifest/commands/files.json:1046` `"id": "key-ctrl-s-in-code-editor",`
- **Gatilho:** `manifest/commands/files.json:1049` `"chord": "Ctrl+S",`
- **Contexto:** `manifest/commands/files.json:1050` `"context": "code-editor",`
- **Tratador:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Início:** `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`
- **Requisitos:** REQ-1115
- **Trecho:** TRC-files.saveContent

## Passos
1. `src/editor/input/keymap.ts:515` `: focusedArgs(event.target, binding);` — a tecla Ctrl+S no contexto `code-editor` resolve a ligação e toma os argumentos do controle em foco (o campo do painel Código).
2. `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — sem gesto de ponteiro e sem ser uma tecla digitada do canvas, o despacho é o da store do editor.
3. `src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);` — os argumentos são os do campo em foco (`path` e o texto) e os do manifesto.
4. `src/editor/input/keymap.ts:531` `const clipboard = Object.entries(binding.command.args).find(([name, arg]) => arg.type === 'clipboard' && !(name in args))?.[0];` — `files.saveContent` não toma argumento de tipo `clipboard`, então `clipboard` é indefinido.
5. `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a tecla despacha `files.saveContent` já, com os argumentos do campo; esta é a linha de Início.
6. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
7. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
9. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
10. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run]
11. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
12. `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- O despacho da tecla: `src/editor/input/keymap.ts:526` `const dispatch = (gesture?.gesture.dispatch ?? (typedKey ? burstSequence?.dispatch : undefined) ?? store.dispatch) as (id: CommandId, args: unknown) => DispatchResult;` — com um gesto de ponteiro aberto o despacho seria o do gesto; com uma tecla digitada do canvas, o da rajada; nenhum vale aqui (o contexto `code-editor` não está em `CHOSEN_CONTEXTS`), então o despacho é `store.dispatch`.
- A guarda do clipboard: `src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);` — sem argumento de tipo `clipboard`, o comando roda já; com um, esperaria a leitura (`src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`).
- O gesto aberto na store do editor: `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`); o ramo que espera o clipboard (`src/editor/input/keymap.ts:532`) não é tomado.

## Estado
- lê: EST-L01-030, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.saveContent grava EST-L01-030 com `document.files[index].bytes` tomando os bytes novos do texto (`src/core/files/files.ts:525` `return { kind: 'change' as const, patches: [{ op: 'replace', path: ['files', index, 'bytes'], value: bytes }], message: message('status.files.saved', { path: wanted }) };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Código relê o arquivo pelo caminho (`src/editor/explorer/explorer.ts:77` `export function fileRows(document: DocumentJson, rules: ModelRules): readonly FileRow[] {`).
- **DOM do canvas:** o quadro mostra a página aberta; um arquivo de texto guardado não muda o desenho (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — o patch escreve `files[].bytes`, fora de qualquer camada de estilo (`src/core/files/files.ts:525`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente do campo é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,` — as três portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/input/keymap.ts:531`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/input/keymap.ts:531`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite um patch aplicado pela store (`src/core/files/files.ts:525`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- Nenhum ouvinte, timer ou observador é criado nos passos desta porta; os ouvintes de teclado do keymap são criados por `installKeymap` (`src/editor/input/keymap.ts:587` `target.addEventListener('keydown', onKeyDown);`) e a instalação devolve a remoção (`src/editor/input/keymap.ts:592` `target.removeEventListener('keydown', onKeyDown);`), fora do caminho desta porta.

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/input/keymap.ts:531`).

## Ramos do trecho
- **Trecho:** TRC-files.saveContent
- **Argumentos enviados:** `{ path, content }` — o caminho do controle em foco e o texto do campo (`src/editor/input/keymap.ts:527` `const given = withDoorArgs({ ...own, ...modifier }, binding.door.args);`).
- R1: o caminho recusa quando é gerado e não há arquivo guardado (`src/core/files/files.ts:516` `if (pathGenerated(wanted) && file === null) return { kind: 'refused' as const, message: message('status.files.generatedPath', { path: wanted }) };`); senão segue.
- R2: o caminho recusa quando não há arquivo (`src/core/files/files.ts:517` `if (file === null) return { kind: 'refused' as const, message: message('status.files.missing', { path: wanted }) };`); com arquivo segue.
- R3: a extensão do `path` decide se o texto é lido como JavaScript: `.js`/`.mjs` passam por `javascriptProblem`, outra extensão não (`src/core/files/files.ts:519` `const bad = wanted.endsWith('.js') || wanted.endsWith('.mjs') ? javascriptProblem(text) : null;`).
- R4: o caminho passa pelo lado de nada mudar quando o texto gera os mesmos bytes (`src/core/files/files.ts:522` `if (bytes === file.bytes) return { kind: 'change' as const, message: message('status.files.saved', { path: wanted }) };`); diferente, um patch troca os bytes.
