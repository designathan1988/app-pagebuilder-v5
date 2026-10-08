# ENT-P-files-0002 — pages.rename pela porta explorer-page-name-field

- **Comando:** pages.rename
- **Porta:** `manifest/commands/files.json:97` `"id": "explorer-page-name-field",`
- **Tratador:** `src/app/commands.ts:297` `'pages.rename': renamePageCommand,`
- **Início:** `src/editor/shell/sidebar/explorer.tsx:84` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(PAGE_NAME.command.id as CommandId, { ...PAGE_NAME.door.args, page: page.tree.id, name });`
- **Requisitos:** REQ-1102
- **Trecho:** TRC-pages.rename

## Passos
1. `src/editor/shell/sidebar/explorer.tsx:110` `onBlur={(event) => keep(event.currentTarget.value)}` — o campo do nome da página, ao perder o foco, entrega o texto digitado a `keep` (o Enter passa pelo mesmo `keep`, em `src/editor/shell/sidebar/explorer.tsx:88` `keep((event.currentTarget.elements.namedItem('name') as HTMLInputElement).value);`).
2. `src/editor/shell/sidebar/explorer.tsx:83` `if (!field.built || name.trim() === page.name) return;` — campo não construído ou nome igual ao da página não despacha.
3. `src/editor/shell/sidebar/explorer.tsx:84` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(PAGE_NAME.command.id as CommandId, { ...PAGE_NAME.door.args, page: page.tree.id, name });` — a porta despacha `pages.rename` com o id da página e o nome digitado; esta é a linha de Início.
4. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
5. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
6. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
7. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
8. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
9. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
10. `src/app/commands.ts:297` `'pages.rename': renamePageCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A guarda do campo: `src/editor/shell/sidebar/explorer.tsx:83` `if (!field.built || name.trim() === page.name) return;` — nome igual ao da página não despacha; nome diferente segue ao passo 3.
- O gesto aberto na store do editor: `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:297` `'pages.rename': renamePageCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-pages.rename grava EST-L01-030 com `pages[at].name` novo e, quando muda, `pages[at].tree.name` e os caminhos dos usuários (`src/core/project/pages.ts:117` `const patches: Patch[] = [{ op: 'replace', path: ['pages', at, 'name'], value: typed }];`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha da página mostra o nome novo (`src/editor/shell/sidebar/explorer.tsx:70` `if (input.current !== null && document.activeElement !== input.current) input.current.value = page.name;`).
- **DOM do canvas:** o quadro mostra a página aberta; nada muda quando a página renomeada não é a aberta (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — os patches escrevem `pages[].name` e `pages[].tree.name`, fora de qualquer camada de estilo (`src/core/project/pages.ts:117` `const patches: Patch[] = [{ op: 'replace', path: ['pages', at, 'name'], value: typed }];`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:297` `'pages.rename': renamePageCommand,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/shell/sidebar/explorer.tsx:84` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(PAGE_NAME.command.id as CommandId, { ...PAGE_NAME.door.args, page: page.tree.id, name });`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/shell/sidebar/explorer.tsx:84`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:117`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/shell/sidebar/explorer.tsx:84`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/shell/sidebar/explorer.tsx:84`).

## Ramos do trecho
- **Trecho:** TRC-pages.rename
- **Argumentos enviados:** `{ page: page.tree.id, name }` — o id da página aberta e o texto digitado, já sem espaços nas pontas.
- R1: o caminho não alcança a recusa de nome vazio — a guarda do campo só despacha com o texto podado diferente do nome atual (`src/editor/shell/sidebar/explorer.tsx:83` `if (!field.built || name.trim() === page.name) return;`); a recusa de `src/core/project/pages.ts:107` `if (typed === '') return { kind: 'refused' as const, message: argumentRefused('name') };` não é tomada.
- R2: o caminho não alcança o ramo do nome igual ao atual — a mesma guarda o barra antes do despacho.
- R3: o caminho passa pelo lado de recusa quando o nome digitado pertence a outra página (`src/core/project/pages.ts:109` `if (document.pages.some((p, i) => i !== at && p.name === typed)) return { kind: 'refused' as const, message: message('status.pages.nameTaken', { name: typed }) };`); livre, segue para os patches.
