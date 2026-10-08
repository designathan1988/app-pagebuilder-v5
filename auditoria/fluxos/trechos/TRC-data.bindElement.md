# TRC-data.bindElement
- **Chamada (menu do campo):** `src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`
- **Chamada (arraste de coluna):** `src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`
- **Argumentos:** `{ node: string, field: string, to: enum }`; as duas portas mandam o nó, o campo e o destino.
- **Ramos que dependem dos argumentos:** R2 (o destino não cabe no elemento), R3 (campo de página de item com destino fora de ligação), R4 (campo vazio desliga a ligação).

## Passos
1. `src/app/commands.ts:170` `  'data.bindElement': bindElementCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:301` `export const bindElementCommand = registerHandler('data.bindElement', (context, { node, field, to }): Outcome<never> => {` — o tratador recebe o nó, o campo e o destino. [nada muda]
3. `src/core/data/commands.ts:302` `  const document = context.state.document;` — lê o documento. [lê: EST-L01-030 via handlerContext]
4. `src/core/data/commands.ts:303` `  const found = locate(document, node);` — localiza o nó. [lê: EST-L01-030 via locate]
5. `src/core/data/commands.ts:304` `  if (found === null) throw new Error(` — nó ausente é defeito da porta (R5). [nada muda]
6. `src/core/data/commands.ts:305` `  const locked = lockRefusal(document, node, 'status.locked.edit');` — confere se o nó está travado. [lê: EST-L01-030 via lockRefusal]
7. `src/core/data/commands.ts:306` `  if (locked !== null) return { kind: 'refused', message: locked };` — nó travado recusa (R1). [nada muda]
8. `src/core/data/commands.ts:307` `  const target = to as BindTarget;` — o destino pedido. [nada muda]
9. `src/core/data/commands.ts:308` `  if (!targetsOf(found.node, context.rules).includes(target)) return { kind: 'refused', message: message('status.data.cannotShow', { name: found.node.name, target: { key: `data.target.${target}` as MessageId } }) };` — destino que o elemento não mostra recusa (R2). [nada muda]
10. `src/core/data/commands.ts:309` `  if (field === ITEM_PAGE && target !== 'link') return { kind: 'refused', message: message('status.data.cannotShow', { name: found.node.name, target: { key: `data.target.${target}` as MessageId } }) };` — a página de item só cabe como ligação (R3). [nada muda]
11. `src/core/data/commands.ts:310` `  const bound = (held: readonly Bound[] | undefined): readonly Bound[] => [...(held ?? []).filter((b) => b.to !== target), ...(field === '' ? [] : [{ field, to: target }])];` — monta a lista de ligações sem a do destino e com a nova (campo vazio desliga) (R4). [nada muda]
12. `src/core/data/commands.ts:311` `  return contentChange(context, (current) => {` — o documento novo é calculado por `contentChange`. [nada muda]
13. `src/core/data/commands.ts:313` `    for (const holder of bindingHolders(current, node)) {` — escreve no nó e em cada instância do componente dele. [lê: EST-L01-030 via bindingHolders]
14. `src/core/data/commands.ts:291` `function bindingHolders(document: DocumentJson, id: NodeId): { readonly node: DocNode; readonly path: readonly (string | number)[] }[] {` — os portadores da ligação. [nada muda]
15. `src/core/data/commands.ts:318` `      working = replaceAt(working, holder.path, value);` — troca o nó no seu caminho. [escreve: EST-L01-030 via run]
16. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
17. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
18. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
19. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
20. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
21. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-037 via publish]

## Ramos
- R1: `src/core/data/commands.ts:306` `  if (locked !== null) return { kind: 'refused', message: locked };` — nó travado recusa; nó livre segue.
- R2: `src/core/data/commands.ts:308` `  if (!targetsOf(found.node, context.rules).includes(target)) return { kind: 'refused', message: message('status.data.cannotShow',` — destino que o elemento não mostra (por exemplo, ligação num elemento sem endereço) recusa; destino válido segue.
- R3: `src/core/data/commands.ts:309` `  if (field === ITEM_PAGE && target !== 'link') return { kind: 'refused', message: message('status.data.cannotShow',` — o endereço da página do item só cabe como ligação.
- R4: `src/core/data/commands.ts:310` `  const bound = (held: readonly Bound[] | undefined): readonly Bound[] =>` — com `field` vazio a ligação do destino sai e volta-se a mensagem de desligar (`src/core/data/commands.ts:320` `    return { document: working, message: field === '' ? message('status.data.unbound', { name: found.node.name, target: { key:`); com campo, entra a ligação nova e a mensagem de ligar.
- R5: `src/core/data/commands.ts:304` `  if (found === null) throw new Error(` — nó ausente é defeito da porta.

## Fronteiras assíncronas
- a porta de arraste despacha ao soltar o ponteiro (`src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`): entre a pressão e a soltura correm os quadros do arraste, e o tratador roda síncrono na soltura.

## Estado
- Lê: EST-L01-030 (`state.document`, via handlerContext, locate, lockRefusal, bindingHolders, publish), EST-L01-037 (`state.ui`, via publish).
- Escreve: EST-L01-030 (`document.pages`, `document.components`, via run, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (`history`, via run).

## Resultado
- **Estado final:** o elemento (e cada instância do seu componente) passa a mostrar o campo escolhido no destino, ou deixa de mostrar quando o campo é vazio (`src/core/data/commands.ts:317` `      const value: DocNode = next.length === 0 ? plain : { ...plain, bind: next };`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha a ligação do campo.
- **DOM do canvas:** o canvas redesenha o elemento (o valor do item aparece no destino).

## Regras
- G1: n/a — o comando não tem digitação de campo; os argumentos são o nó, o campo e o destino.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: ok `src/core/data/commands.ts:301` `export const bindElementCommand = registerHandler('data.bindElement', (context, { node, field, to }): Outcome<never> => {` — o menu do campo (`src/editor/doors/door.tsx:144` `      dispatch(entry.command.id, given);`) e o arraste de coluna (`src/editor/input/pointer/effects.ts:199` `      if (ps.columning !== null && effect === 'commit' && ps.columning.over !== null) closing?.dispatch(ps.columning.press.entry.command.id as CommandId, { ...ps.columning.press.entry.door.args, field: ps.columning.press.field, node: ps.columning.over.node, to: ps.columning.over.to } as never);`) mandam a mesma intenção (o nó, o campo e o destino) ao mesmo tratador.
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:318` `      working = replaceAt(working, holder.path, value);`).
- G5: n/a — o comando não desenha controle: o menu do campo e o arraste vivem na colocação do painel e do canvas.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
