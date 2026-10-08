# ENT-P-content-0034 — pages.fromNames pela porta pages.fromNames#data-pages-from-names
- **Comando:** pages.fromNames
- **Porta:** `data-pages-from-names` `manifest/commands/content.json:1794` `          "id": "data-pages-from-names",`
- **Início:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:173` `  'pages.fromNames': pagesFromNamesCommand<EditorUi>(),`
- **Trecho:** TRC-pages.fromNames

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-pages.fromNames`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:286` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:95` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (o texto com um nome por linha).
5. `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-pages.fromNames`.

## Ramos
- R1 `src/editor/doors/door.tsx:94` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:144` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:96` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-pages.fromNames`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-pages.fromNames`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/core/data/commands.ts:410` `  return registerHandler<'pages.fromNames', Ui>('pages.fromNames', (context, { names }) =>` — o texto digitado é gravado no contexto capturado na primeira digitação.
- G2: ok `src/core/data/commands.ts:414` `      const wanted = names.split(/\r?\n/).map((name) => name.trim()).filter((name) => name !== '');` — o tratador lê o texto entregue pela porta, que é o do contexto da digitação.
- G3: ok `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:1794` `          "id": "data-pages-from-names",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:425` `        ui: { ...context.state.ui, page: first.id },`).
- G5: n/a — o comando não desenha controle; o campo vive na colocação do painel (`manifest/commands/content.json:1808` `            "region": "data-pages",`).
- G6: ok `src/core/data/commands.ts:66` `    const selection = chosen.filter((id) => locate(after, id) !== null);` — a seleção vem da store (a resposta vazia) e é a única fonte para canvas e Camadas.
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento e a seleção resultantes são validados antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-pages.fromNames
- **Argumentos enviados:** `{ names }` — o texto digitado, um nome por linha.
- R1 `src/core/data/commands.ts:415` `      if (wanted.length === 0) refuse('status.pages.noNames', { name: source.name });` — o `names` desta porta com ao menos uma linha não vazia segue para a criação de uma página por nome; só linhas vazias recusam.
