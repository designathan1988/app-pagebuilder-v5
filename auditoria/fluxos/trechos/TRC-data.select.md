# TRC-data.select
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ collection: string }`; a porta declara `entry.door.args` vazio e o painel acrescenta `collection` (o nome da coleção da aba).
- **Ramos que dependem dos argumentos:** R1

## Passos
1. `src/app/commands.ts:152` `  'data.select': selectCollection,` — a tabela de comandos liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:43` `export const selectCollection = registerHandler<'data.select', EditorUi>(` — o tratador é registrado com o predicado `current` da linha 50. [nada muda]
3. `src/editor/data/state.ts:45` `  ({ state }, { collection }) => {` — lê o estado e a coleção pedida. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/data/state.ts:46` `    const held = collectionNamed(state.document, collection);` — procura a coleção pelo nome nas coleções do documento. [lê: EST-L01-030 via collectionNamed]
5. `src/editor/data/state.ts:47` `    if (held === undefined) throw new Error(` — uma coleção que o projeto não tem é defeito da porta, não recusa (R1). [lê: EST-L01-030 via handlerContext]
6. `src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })` — grava a coleção mostrada e limpa a consulta no estado do editor. [escreve: EST-L01-037 via run]
7. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda o estado do editor que o resultado trouxe. [escreve: EST-L01-037 via run]
8. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança a publicar. [lê: EST-L01-031 via run] [lê: EST-L01-037 via run] [lê: EST-L01-033 via run]
9. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
10. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados: o painel Dados redesenha a coleção mostrada. [lê: EST-L01-002 via publish]
11. `src/editor/data/state.ts:48` `count: { plural: 'data.items', count: held.items.length }` — a mensagem conta os itens da coleção escolhida. [lê: EST-L01-030 via handlerContext]

## Ramos
- R1: `src/editor/data/state.ts:47` `    if (held === undefined) throw new Error(` — se a coleção existe (`collectionNamed` devolve a coleção) o passo 6 grava a escolha; se não existe o tratador lança, e o `run` da store responde `status.change.failed` (`src/core/store/store.ts:436` `      const failed = message('status.change.failed', { command: nameOf(command) });`), sem mudar o documento.

## Fronteiras assíncronas
- nenhuma — o tratador (linhas 43-51) e o `run` da store (linha 378) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await nem timer entre a leitura e a gravação.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui`).
- Escreve: EST-L01-037 (`ui.data.collection`, `ui.data.query`).

## Resultado
- **Estado final:** `ui.data.collection` passa a ser a coleção escolhida e `ui.data.query` fica indefinida (`src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Dados lê `ui.data.collection` e redesenha a grade da coleção mostrada.
- **DOM do canvas:** nada muda — o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o comando não tem digitação de campo; o único argumento é um nome de coleção vindo da porta (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).
- G2: n/a — não há rascunho pendente: o tratador não lê campo de digitação.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:28` `      "id": "data-collection-tab",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })`); nada é colocado sobre o canvas.
- G5: n/a — o comando não desenha controle: a aba vive na colocação do painel (`manifest/commands/content.json:42` `          "region": "data-panel",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:48` `kind: 'change', ui: withData(state.ui, { collection, query: undefined })`).
- G7: n/a — o resultado não traz patches, então o documento e o canvas ficam como estavam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
