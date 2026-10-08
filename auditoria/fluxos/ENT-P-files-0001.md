# ENT-P-files-0001 — pages.add pela porta explorer-add-page

- **Comando:** pages.add
- **Porta:** `manifest/commands/files.json:33` `"id": "explorer-add-page",`
- **Tratador:** `src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1101
- **Trecho:** TRC-pages.add

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o controle do botão da seção de páginas tem `door.run` no clique (não é uma peça da paleta, então `pressedByPointer` é falso).
2. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
3. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
4. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o despacho é o da store do editor.
5. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{ name: "" }`) e os do lugar.
6. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — `pages.add` não lê arquivo, então a guarda é verdadeira.
7. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `pages.add` com `{ name: "" }`; esta é a linha de Início.
8. `src/editor/store.ts:232` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
9. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
10. `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
11. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
12. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
13. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
14. `src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue ao passo 5.
- O gesto aberto na store do editor: `src/editor/store.ts:237` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:243` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030, EST-L01-037

## Resultado
- **Estado final:** o trecho TRC-pages.add grava EST-L01-030 com a página nova em `document.pages` e EST-L01-037 com `ui.page` nela (`src/core/project/pages.ts:97` `return { kind: 'change' as const, patches: [{ op: 'add', path: ['pages', document.pages.length], value: made }], ui: { ...state.ui, page: made.id }, selection: [], message: message('status.pages.added', { name: chosen, file }) };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a lista de páginas do explorador deriva de `document.pages` (`src/editor/shell/sidebar/explorer.tsx:66` `const shown = useEditorState((s) => pageShown(s)?.tree.id === page.tree.id);`); o caminho da porta não desenha nada novo.
- **DOM do canvas:** o quadro mostra a página aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — o tratador escreve `pages` e `pages[].tree`, fora de qualquer camada de estilo (`src/core/project/pages.ts:97` `patches: [{ op: 'add', path: ['pages', document.pages.length], value: made }]`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:97`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).

## Ramos do trecho
- **Trecho:** TRC-pages.add
- **Argumentos enviados:** `{ name: "" }` — o manifesto dá `name` vazio à porta (`manifest/commands/files.json:57` `"name": ""`).
- R1: o caminho passa pelo lado do nome padrão, porque `name` é vazio; a recusa de nome tomado não é alcançada. `src/core/project/pages.ts:90` `const given = typeof name === 'string' && name.trim() !== '';`
- R2: o caminho não alcança este ramo — com `name` vazio `given` é falso, então a comparação de nome tomado (`src/core/project/pages.ts:93` `if (given && document.pages.some((p) => p.name === typed)) return { kind: 'refused' as const, message: message('status.pages.nameTaken', { name: typed }) };`) não é tomada.
