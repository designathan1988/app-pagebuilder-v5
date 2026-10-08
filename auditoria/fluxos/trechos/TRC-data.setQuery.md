# TRC-data.setQuery
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ part: 'filterField'|'filterOperator'|'filterValue'|'sortFirst'|'sortSecond'|'offset'|'limit'|'clear', value?: string }`.
- **Ramos que dependem dos argumentos:** R1 (o `part` escolhe a parte da consulta), R5 (o `value` de `offset`/`limit`/`filterOperator`).

## Passos
1. `src/app/commands.ts:153` `  'data.setQuery': setQuery,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:102` `export const setQuery = registerHandler<'data.setQuery', EditorUi>('data.setQuery', ({ state }, { part, value }) => {` — o tratador é registrado e recebe `part` e `value`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
3. `src/editor/data/state.ts:103` `  const collection = shownCollection(state.document, state.ui);` — lê a coleção mostrada. [lê: EST-L01-030 via shownCollection] [lê: EST-L01-037 via shownCollection]
4. `src/editor/data/state.ts:104` `  if (collection === undefined) return { kind: 'refused', message: message('status.data.noCollection') };` — sem coleção, recusa sem mudar nada (R2). [lê: EST-L01-030 via handlerContext]
5. `src/editor/data/state.ts:106` `    const asked = canonicalQuery(queryWith(dataOf(state.ui).query ?? {}, part,` — monta a consulta nova a partir da atual e da parte pedida. [lê: EST-L01-037 via dataOf]
6. `src/editor/data/state.ts:67` `    case 'filterField':` — o `part` escolhe a parte alterada na consulta (R1). [nada muda]
7. `src/core/data/collections.ts:399` `export function canonicalQuery(query: Query): Query {` — a consulta entra na forma canônica. [nada muda]
8. `src/editor/data/state.ts:107` `    const refused = queryRefusal(collection, asked);` — confere a consulta contra os campos da coleção. [lê: EST-L01-030 via queryRefusal]
9. `src/editor/data/state.ts:108` `    if (refused !== null) return { kind: 'refused', message: refused };` — consulta inválida recusa sem mudar nada (R3). [lê: EST-L01-030 via handlerContext]
10. `src/editor/data/state.ts:109` `    const shown = queryItems(collection, asked).length;` — conta os itens que a consulta mostra. [lê: EST-L01-030 via queryItems]
11. `src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })` — grava a consulta no estado do editor. [escreve: EST-L01-037 via run]
12. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda a ui nova. [escreve: EST-L01-037 via run]
13. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança. [lê: EST-L01-031 via run] [lê: EST-L01-037 via run] [lê: EST-L01-033 via run]
14. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
15. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-002 via publish]

## Ramos
- R1: `src/editor/data/state.ts:67` `    case 'filterField':` — o `part` escolhe o ramo de `queryWith` (linhas 64-98): `filterField` troca o campo do filtro; `filterOperator` troca a condição; `filterValue` troca o valor comparado; `sortFirst` e `sortSecond` trocam as chaves de ordem; `offset` e `limit` trocam o pular e o máximo; qualquer outro `part` cai em `src/editor/data/state.ts:95` `    default:` e devolve `{}` (consulta vazia).
- R2: `src/editor/data/state.ts:104` `  if (collection === undefined) return { kind: 'refused', message: message('status.data.noCollection') };` — sem coleção mostrada a resposta é `refused`; com coleção o tratador segue para o passo 5.
- R3: `src/editor/data/state.ts:108` `    if (refused !== null) return { kind: 'refused', message: refused };` — `queryRefusal` não nulo (campo desconhecido, contagem que não é inteiro a partir de 0) recusa; nulo segue.
- R4: `src/editor/data/state.ts:70` `      if (filter === undefined) refuse('status.data.noFilter', { collection });` — `filterOperator` e `filterValue` sem filtro existente recusam por `DataRefusal` (apanhada em `src/editor/data/state.ts:112` `    if (error instanceof DataRefusal) return { kind: 'refused', message: error.refusal };`).
- R5: `src/editor/data/state.ts:86` `      if (typed === '' && part === 'limit') {` — `limit` vazio apaga o máximo; senão `src/editor/data/state.ts:92` `      if (count === null) refuse('status.data.badCount', { collection });` recusa um valor que não é inteiro a partir de 0, e um inteiro grava-se no passo 11.

## Fronteiras assíncronas
- nenhuma — o tratador (linhas 102-115) e o `run` da store (linha 378) são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await nem timer.

## Estado
- Lê: EST-L01-030 (`state.document`), EST-L01-037 (`state.ui.data.query`).
- Escreve: EST-L01-037 (`ui.data.query`).

## Resultado
- **Estado final:** `ui.data.query` passa a ser a consulta canônica montada (`src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Dados lê `ui.data.query` e redesenha a grade e a contagem.
- **DOM do canvas:** nada muda — o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — os campos do painel entregam só a parte e o valor (`src/editor/data/state.ts:102` `export const setQuery = registerHandler<'data.setQuery', EditorUi>('data.setQuery', ({ state }, { part, value }) => {`); não há digitação de campo guardada com contexto.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: ok `src/editor/data/state.ts:102` `export const setQuery = registerHandler<'data.setQuery', EditorUi>('data.setQuery', ({ state }, { part, value }) => {` — as oito portas do painel mandam a mesma intenção (parte e valor) ao mesmo tratador.
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })`).
- G5: n/a — o comando não desenha controle: as portas vivem na colocação do painel (`manifest/commands/content.json:112` `            "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:110` `kind: 'change', ui: withData(state.ui, { query: asked })`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
