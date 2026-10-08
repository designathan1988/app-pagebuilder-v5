# ENT-P-files-0022 — files.saveContent pela porta code-panel-save

- **Comando:** files.saveContent
- **Porta:** `manifest/commands/files.json:1017` `"id": "code-panel-save",`
- **Tratador:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1115
- **Trecho:** TRC-files.saveContent

## Passos
1. `src/editor/shell/code-pane.tsx:168` `{info === null || info.generated || PART('save') === undefined ? null : <DoorControl entry={PART('save') as DoorEntry} args={{ path: info.path, content: shown ?? info.text ?? '' }} className="code-pane__apply" />}` — o botão Salvar do painel Código carrega o caminho do arquivo e o texto mostrado nos argumentos.
2. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão roda `door.run`.
3. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
4. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{ path: "", content: "" }`) e o `path` e o `content` do botão.
6. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `files.saveContent` com o caminho e o texto; esta é a linha de Início.
7. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
8. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
9. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
10. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
11. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
12. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
13. `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-files.saveContent grava EST-L01-030 com `document.files[index].bytes` tomando os bytes novos do texto (`src/core/files/files.ts:525` `return { kind: 'change' as const, patches: [{ op: 'replace', path: ['files', index, 'bytes'], value: bytes }], message: message('status.files.saved', { path: wanted }) };`); conteúdo igual, nada muda.
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Código relê o arquivo pelo caminho (`src/editor/explorer/explorer.ts:77` `export function fileRows(document: DocumentJson, rules: ModelRules): readonly FileRow[] {`).
- **DOM do canvas:** o quadro mostra a página aberta; um arquivo de texto guardado não muda o desenho (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — o patch escreve `files[].bytes`, fora de qualquer camada de estilo (`src/core/files/files.ts:525`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,` — as três portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite um patch aplicado pela store (`src/core/files/files.ts:525`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-files.saveContent
- **Argumentos enviados:** `{ path: info.path, content: shown ?? info.text ?? '' }` — o caminho do arquivo e o texto mostrado (`src/editor/shell/code-pane.tsx:168`).
- R1: o caminho recusa quando é gerado e não há arquivo guardado (`src/core/files/files.ts:516` `if (pathGenerated(wanted) && file === null) return { kind: 'refused' as const, message: message('status.files.generatedPath', { path: wanted }) };`); senão segue.
- R2: o caminho recusa quando não há arquivo (`src/core/files/files.ts:517` `if (file === null) return { kind: 'refused' as const, message: message('status.files.missing', { path: wanted }) };`); com arquivo segue.
- R3: a extensão do `path` decide se o texto é lido como JavaScript: `.js`/`.mjs` passam por `javascriptProblem`, outra extensão não (`src/core/files/files.ts:519` `const bad = wanted.endsWith('.js') || wanted.endsWith('.mjs') ? javascriptProblem(text) : null;`).
- R4: o caminho passa pelo lado de nada mudar quando o texto gera os mesmos bytes (`src/core/files/files.ts:522` `if (bytes === file.bytes) return { kind: 'change' as const, message: message('status.files.saved', { path: wanted }) };`); diferente, um patch troca os bytes.
