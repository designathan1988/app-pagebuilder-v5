# ENT-P-content-0014 — data.setField pela porta data.setField#data-field-label
- **Comando:** data.setField
- **Porta:** `data-field-label` `manifest/commands/content.json:635` `          "id": "data-field-label",`
- **Início:** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Tratador:** `src/app/commands.ts:158` `  'data.setField': setFieldCommand,`
- **Trecho:** TRC-data.setField

Fluxo de porta do domínio `content`. Rastreia o caminho próprio do campo desenhado até a linha que despacha o comando, que é também a `Chamada` do trecho `TRC-data.setField`; o trecho não é repetido.

## Passos
1. `src/editor/doors/door.tsx:285` `    onClick: pointerRuns ? (event: MouseEvent) => (event.detail === 0 ? door.run() : undefined) : door.run,` — o envio do campo desenhado pela porta executa o `run` da porta.
2. `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — a porta só entrega a intenção quando o comando está construído e disponível.
3. `src/editor/doors/door.tsx:94` `    const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
4. `src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };` — os argumentos são os do manifesto da porta (vazios) sobre os que o lugar acrescenta (a coleção, o campo e o rótulo digitado).
5. `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
6. `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — a porta entrega o id e os argumentos ao despacho da store do editor; esta é a linha de Início da porta e a `Chamada` do trecho `TRC-data.setField`.

## Ramos
- R1 `src/editor/doors/door.tsx:93` `    if (!built || !available) return;` — porta construída e disponível: o caminho segue ao despacho; não construída ou indisponível: nada é despachado.
- R2 `src/editor/doors/door.tsx:143` `    if (file === undefined) {` — esta porta não manda arquivo nem área de transferência, então o caminho toma o despacho direto.

## Fronteiras assíncronas
- nenhuma — o caminho é síncrono de `src/editor/doors/door.tsx:285` a `src/editor/doors/door.tsx:144`; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: nenhum item do inventário de estado no `run`; a porta lê o manifesto e os argumentos que o lugar acrescenta (`src/editor/doors/door.tsx:95` `    const given = { ...entry.door.args, ...args };`).
- escreve: nenhum — a gravação entra no trecho `TRC-data.setField`.

## Resultado
- **Estado final:** inalterado por esta porta; o comando foi entregue à `Chamada` do trecho `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-data.setField`.
- **DOM do editor:** nada muda por esta porta `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: ok `src/core/data/commands.ts:212` `export const setFieldCommand = registerHandler('data.setField', (context, { collection, field, label, type }) =>` — o rótulo digitado é gravado no contexto capturado na primeira digitação (a porta entrega `collection` e `field` junto com `label`).
- G2: ok `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — o tratador lê o texto entregue pela porta.
- G3: ok `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);` — as duas portas do comando (o rótulo e o tipo) mandam a mesma intenção (o campo e o valor) ao mesmo tratador (`manifest/commands/content.json:635` `          "id": "data-field-label",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:217` `    return { document: withCollection(document, held.name, next), message: message('status.data.fieldChanged', { collection: held.name, label: shown }) };`).
- G5: n/a — o comando não desenha controle; o campo vive na colocação do painel (`manifest/commands/content.json:649` `            "region": "data-collection",`).
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`).

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-data.setField
- **Argumentos enviados:** `{ collection, field, label }` — esta porta é o campo do rótulo, então manda o `label` e não manda `type`.
- R1 `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — com `label` presente o rótulo troca; como esta porta não manda `type`, o tipo fica.
- R2 `src/core/data/commands.ts:215` `    const next = setField(held, field, { ...(typeof label === 'string' ? { label } : {}), ...(type === undefined ? {} : { type: fieldType(type) }) });` — sem `type`, o caminho não passa pela releitura de valores; só o rótulo entra.
- R3 `src/core/data/collections.ts:291` `  if (next.type === field.type) return { ...collection, fields };` — sem `type`, os dois são iguais, então o caminho passa pelo lado que só relabela, sem reler cada valor.
