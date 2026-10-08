# ENT-P-content-0013 — data.addField pela porta data.addField#data-field-add
- **Comando:** data.addField
- **Porta:** `data-field-add` `manifest/commands/content.json:546` `          "id": "data-field-add",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:157` `  'data.addField': addFieldCommand<EditorUi>(),`
- **Trecho:** TRC-data.addField

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do botão desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.addField`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o clique no botão desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (o rótulo digitado e o tipo escolhido).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.addField`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.addField`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.addField`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o rótulo vem do campo da porta e é lido uma vez (`src/core/data/commands.ts:201` `  return registerHandler<'data.addField', Ui>('data.addField', (context, { label, type }) =>`), sem digitação pendente com contexto.
- G2: n/a — o caminho da porta não lê rascunho pendente (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta envia só a intenção e o comando tem uma porta só (`manifest/commands/content.json:546` `          "id": "data-field-add",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:207` `      return { document: withCollection(document, held.name, next), message: message('status.data.fieldAdded', { collection: held.name, label: label.trim() }) };`).
- G5: n/a — o comando não desenha controle; o formulário vive na colocação do painel (`manifest/commands/content.json:560` `            "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.addField
- **Argumentos enviados:** `{ label, type }` — o rótulo digitado no formulário e o tipo escolhido; a coleção vem do estado da store, não da porta.
- R1 `src/core/data/commands.ts:204` `      if (held === undefined) refuse('status.data.noCollection');` — havendo coleção mostrada (a escolhida ou a primeira do projeto) o caminho segue; sem nenhuma, recusa.
- R2 `src/core/data/commands.ts:205` `      if (label.trim() === '') refuse('status.data.fieldLabelEmpty', { collection: held.name });` — o `label` desta porta com texto segue; vazio, recusa.
- R3 `src/core/data/collections.ts:159` `    if (labels.has(label)) return message('status.data.fieldLabelTaken', { collection, label: field.label.trim() });` — o `label` desta porta repetido na coleção lança `DataRefusal` (vira `refused`), e o `type` fora da lista também recusa; um rótulo livre com tipo válido segue.
