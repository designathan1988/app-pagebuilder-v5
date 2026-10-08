# ENT-P-files-0004 — pages.delete pela porta explorer-page-delete

- **Comando:** pages.delete
- **Porta:** `manifest/commands/files.json:213` `"id": "explorer-page-delete",`
- **Tratador:** `src/app/commands.ts:299` `'pages.delete': deletePageCommand,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1104
- **Trecho:** TRC-pages.delete

## Passos
1. `src/editor/doors/door.tsx:285` `onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o botão de apagar da linha de página tem `door.run` no clique.
2. `src/editor/doors/door.tsx:92` `const run = () => {` — o clique entra na função `run` do `useDoor`.
3. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{}`) e o `page` que a linha acrescenta.
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `pages.delete` com o id da página; esta é a linha de Início.
6. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
7. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto de ponteiro aberto o comando segue para a store do núcleo.
9. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
10. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
11. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
12. `src/app/commands.ts:299` `'pages.delete': deletePageCommand,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que muda o documento, a gravação é adiada (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
- A confirmação: `src/core/store/store.ts:455` `if (outcome.kind === 'confirm') {` — não confirmado, a store publica o pedido de confirmação; confirmado, o trecho segue para os patches.

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:299` `'pages.delete': deletePageCommand,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-030

## Resultado
- **Estado final:** o trecho TRC-pages.delete grava EST-L01-030 sem a página em `document.pages` e sem as referências a ela (`src/core/project/pages.ts:188` `return { kind: 'change' as const, patches: [...released, ...unlinked, { op: 'remove', path: ['pages', at] }], selection: [], message: message('status.pages.deleted', { name: held.name }) };`); sem confirmação, `confirmation` fica com o pedido.
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** a linha sai da lista de páginas (`src/editor/shell/sidebar/explorer.tsx:148` `const rows = useMemo(() => treeRows(document, MODEL_RULES), [document]);`).
- **DOM do canvas:** o quadro mostra a página aberta; a página aberta cai na primeira quando a sua sai (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — os patches escrevem `pages` e atributos de endereço, fora de qualquer camada de estilo (`src/core/project/pages.ts:188` `patches: [...released, ...unlinked, { op: 'remove', path: ['pages', at] }]`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:299` `'pages.delete': deletePageCommand,` — a porta chega a este único tratador e manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho emite patches aplicados pela store (`src/core/project/pages.ts:188`); a igualdade de render é do renderizador.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-pages.delete
- **Argumentos enviados:** `{ page: page.tree.id }` — o id da página da linha.
- R1: o caminho não alcança o lançamento, porque `page` nomeia uma página existente; o `throw` de `src/core/project/pages.ts:175` `if (held === undefined) throw new Error(`pages.delete: the document has no page ${String(page)}`);` não é tomado.
- R2: o caminho passa pela recusa quando a página é a inicial (`src/core/project/pages.ts:176` `if (held.file === HOME) return { kind: 'refused' as const, message: message('status.pages.homeUndeletable') };`); outra página segue para os patches.
- Os demais ramos dependem de `confirmed`, não do argumento: sem confirmação o tratador devolve `confirm` (`src/core/project/pages.ts:178` `if (confirmed !== true) return { kind: 'confirm' as const, params: { name: held.name } };`).
