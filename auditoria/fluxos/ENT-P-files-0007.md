# ENT-P-files-0007 — pages.switch pela porta toolbar-top-bar-page-switcher

- **Comando:** pages.switch
- **Porta:** `manifest/commands/files.json:318` `"id": "toolbar-top-bar-page-switcher",`
- **Tratador:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Início:** `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`
- **Requisitos:** REQ-1105
- **Trecho:** TRC-pages.switch

## Passos
1. `src/editor/shell/top-bar.tsx:60` `const door = useDoor(entry, { page });` — o item da lista do trocador de páginas lê a porta (o rótulo, a disponibilidade) com o id da sua página nos argumentos.
2. `src/editor/shell/top-bar.tsx:71` `door.run();` — o clique no item roda a porta (o item fecha a lista antes, em `src/editor/shell/top-bar.tsx:70` `onDone();`).
3. `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha.
4. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto (`{ page: "" }`) e o `page` do item.
5. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta despacha `pages.switch` com o id da página; esta é a linha de Início.
6. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — o despacho entra no guarda da store do editor.
7. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — `beforeCommand` põe em dia a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o `dispatch` da store do núcleo.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — `dispatch` entrega o comando a `run`. [lê: EST-L01-030 via run] [lê: EST-L01-031 via run]
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,` — a linha da Chamada do trecho: o comando entra nele por aqui.

## Ramos
- A disponibilidade da porta: `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta indisponível não despacha; disponível segue.
- O gesto aberto na store do editor: `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto o despacho segue já; com gesto e um comando que não muda o documento, roda pelo gesto (`src/editor/store.ts:227` `else if (!changesDocument) result = open.dispatch(id, args);`).

## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`); não há `await`, timer, quadro nem ouvinte nos passos.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L05a-001
- escreve: EST-L01-037, EST-L01-031

## Resultado
- **Estado final:** o trecho TRC-pages.switch grava EST-L01-037 com `ui.page` nomeando a página escolhida e EST-L01-031 com a seleção vazia (`src/core/project/pages.ts:228` `return { kind: 'change' as const, ui: { ...state.ui, page: held.id }, selection: [], message: said };`).
- **Re-renderizado:** os assinantes da store são avisados (`src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o botão do trocador mostra o nome e o arquivo da página aberta (`src/editor/shell/top-bar.tsx:22` `const page = useEditorState((s) => pageShown(s));`).
- **DOM do canvas:** o quadro mostra a página escolhida (`src/editor/canvas/frame.tsx:48` `const page = useEditorState((s) => openedPage(s));`).

## Regras
- G1: n/a — o comando escreve `ui.page` e a seleção, fora de qualquer camada de estilo (`src/core/project/pages.ts:228`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do comando (`src/editor/input/pending.ts:82` `keepTyping();`).
- G3: ok `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,` — as quatro portas chegam ao mesmo tratador; esta manda só a intenção.
- G4: n/a — o caminho da porta não desenha nada sobre o canvas (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
- G5: n/a — o caminho da porta não mede nem desenha painel ou barra (`src/editor/doors/door.tsx:144`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: n/a — o trecho muda `ui.page`; a igualdade de render é do renderizador (`src/core/store/store.ts:321` `if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — o documento não muda e o estado é validado antes de publicar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144`).

## Medições
- nenhuma — nenhum passo do caminho da porta usa API calculada pelo navegador (`src/editor/doors/door.tsx:144`).

## Ramos do trecho
- **Trecho:** TRC-pages.switch
- **Argumentos enviados:** `{ page }` — o id da página do item (`src/editor/shell/top-bar.tsx:60` `const door = useDoor(entry, { page });`).
- R1: o caminho não alcança o lançamento, porque `page` nomeia uma página existente; o `throw` de `src/core/project/pages.ts:223` `if (held === undefined) throw new Error(`pages.switch: the document has no page ${String(page)}`);` não é tomado.
- R2: o caminho passa pelo lado de nada mudar quando o item é o da página aberta (`src/core/project/pages.ts:225` `if (openedPage(state) === at) return { kind: 'change' as const, message: said };`); outra página segue para `ui.page`.
