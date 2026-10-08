# TRC-data.closePreview
- **Chamada:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Argumentos:** nenhum; a porta `data-preview-close` não manda campo algum.
- **Ramos que dependem dos argumentos:** nenhum — o comando não tem argumentos; o ramo R1 depende do estado (há prévia ou não).

## Passos
1. `src/app/commands.ts:167` `  'data.closePreview': closePreview,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/editor/data/state.ts:172` `export const closePreview = registerHandler<'data.closePreview', EditorUi>('data.closePreview', ({ state }) => {` — o tratador lê o estado. [lê: EST-L01-037 via handlerContext]
3. `src/editor/data/state.ts:173` `  const preview = dataOf(state.ui).preview;` — lê a prévia atual. [lê: EST-L01-037 via handlerContext]
4. `src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };` — apaga a prévia e, havendo uma, diz o nome do arquivo. [escreve: EST-L01-037 via run]
5. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store guarda a ui nova. [escreve: EST-L01-037 via run]
6. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a troca da ui conta como mudança. [lê: EST-L01-031 via run] [lê: EST-L01-037 via run] [lê: EST-L01-033 via run]
7. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
8. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes da store são notificados. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };` — havendo prévia, a resposta traz a mensagem com o nome do arquivo; sem prévia, nenhuma mensagem. Nos dois casos a prévia fica indefinida.

## Fronteiras assíncronas
- nenhuma — o tratador (linhas 172-175) é síncrono; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (o documento, via commit), EST-L01-031 (a seleção, via run, commit), EST-L01-033 (a mensagem, via run), EST-L01-037 (`state.ui.data.preview`, via handlerContext, run, publish).
- Escreve: EST-L01-037 (`ui.data.preview`, via run), EST-L01-030 (o documento, via commit), EST-L01-031 (a seleção, via commit).

## Resultado
- **Estado final:** `ui.data.preview` fica indefinida (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).
- **Re-renderizado:** os assinantes da store são notificados (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** o painel Dados redesenha sem a prévia.
- **DOM do canvas:** nada muda — o documento não muda (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,` com `documentChanged` falso).

## Regras
- G1: n/a — o comando não tem argumentos nem digitação de campo (`manifest/commands/content.json:1246` `      "args": {},`).
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:1258` `      "id": "data-preview-close",`).
- G4: n/a — o tratador só grava estado do editor (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).
- G5: n/a — o comando não desenha controle: o botão de fechar vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/editor/data/state.ts:174` `  return { kind: 'change', ui: withData(state.ui, { preview: undefined }), ...(preview === undefined ? {} : { message: message('status.data.previewClosed', { name: preview.file }) }) };`).
- G7: n/a — o resultado não traz patches; o documento fica como estava (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`).
- INT: n/a — nenhuma escrita no documento.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
