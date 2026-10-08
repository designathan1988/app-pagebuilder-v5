# TRC-regions.stopSharing
- **Chamada:** `src/editor/doors/door.tsx:145` `      dispatch(entry.command.id, given);`
- **Argumentos:** `{ component: string }`; a porta `data-shared-stop` manda o nome do componente (a região).
- **Ramos que dependem dos argumentos:** R1 (o componente não é região compartilhada).

## Passos
1. `src/app/commands.ts:177` `  'regions.stopSharing': stopSharingCommand,` — a tabela liga o comando ao tratador. [nada muda]
2. `src/core/data/commands.ts:486` `export const stopSharingCommand = registerHandler('regions.stopSharing', (context, { component }): Outcome<never> =>` — o tratador recebe o componente. [nada muda]
3. `src/core/data/commands.ts:487` `  contentChange(context, (document) => ({ document: stopSharing(document, component), message: message('status.regions.stopped', { name: component }) })),` — o documento novo é calculado por `contentChange`. [nada muda]
4. `src/core/data/commands.ts:59` `    const before = context.state.document;` — lê o documento. [lê: EST-L01-030 via contentChange]
5. `src/core/data/regions.ts:152` `export function stopSharing(document: DocumentJson, component: string): DocumentJson {` — encerra o compartilhamento. [nada muda]
6. `src/core/data/regions.ts:153` `  const definition = document.components?.find((c) => c.name === component);` — procura a definição do componente. [lê: EST-L01-030 via stopSharing]
7. `src/core/data/regions.ts:154` `  if (definition === undefined || definition.shared === undefined) refuse('status.regions.notShared', { name: component });` — componente que não é região recusa (R1). [nada muda]
8. `src/core/data/regions.ts:159` `      const { shared: _shared, ...plain } = c;` — a marca de região sai da definição. [escreve: EST-L01-030 via stopSharing]
9. `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a diferença vira patches. [nada muda]
10. `src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches. [escreve: EST-L01-030 via run]
11. `src/core/store/store.ts:531` `      history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — a mudança entra no histórico. [escreve: EST-L01-032 via run]
12. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado é validado e commitado. [escreve: EST-L01-030 via commit] [escreve: EST-L01-031 via commit]
13. `src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);` — o canvas ouve a mudança. [lê: EST-L01-030 via publish]
14. `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();` — os assinantes redesenham o painel. [lê: EST-L01-030 via publish] [lê: EST-L01-033 via publish]

## Ramos
- R1: `src/core/data/regions.ts:154` `  if (definition === undefined || definition.shared === undefined) refuse('status.regions.notShared', { name: component });` — componente que o projeto não tem ou que não é região compartilhada recusa; sendo região, segue para o passo 8.

## Fronteiras assíncronas
- nenhuma — o tratador, `contentChange` e `stopSharing` são síncronos; o despacho em `src/editor/doors/door.tsx:144` não interpõe await.

## Estado
- Lê: EST-L01-030 (o documento: `state.document`, via contentChange, stopSharing).
- Escreve: EST-L01-030 (o documento: `document.components`, via run, stopSharing, commit, publish), EST-L01-032 (o histórico, via run), EST-L01-033 (a mensagem, via run, publish).

## Resultado
- **Estado final:** a região deixa de ser compartilhada; cada página mantém a sua instância, que segue o componente comum e não mais as outras páginas (`src/core/data/regions.ts:155` `  return {`).
- **Re-renderizado:** os assinantes do documento e da store são notificados (`src/core/store/store.ts:323` `      for (const listener of [...documentListeners]) listener(change);`).
- **DOM do editor:** o painel Dados redesenha o formulário de regiões.
- **DOM do canvas:** o canvas redesenha as instâncias da região (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).

## Regras
- G1: n/a — o comando não tem digitação de campo; o argumento é o nome de um componente que existe.
- G2: n/a — não há rascunho pendente lido pelo tratador.
- G3: n/a — o comando tem uma porta só (`manifest/commands/content.json:2049` `          "id": "data-shared-stop",`).
- G4: n/a — o tratador só grava estado (`src/core/data/commands.ts:487` `  contentChange(context, (document) => ({ document: stopSharing(document, component), message: message('status.regions.stopped', { name: component }) })),`).
- G5: n/a — o comando não desenha controle: o botão vive na colocação do painel.
- G6: n/a — o comando não escreve seleção (`src/core/data/commands.ts:67` `    const moved = result.selection !== undefined || selection.length !== chosen.length;` falso).
- G7: ok `src/core/data/commands.ts:63` `    const patches: Patch[] = documentPatches(before, after);` — a mudança é expressa como patches mínimos.
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o documento resultante é validado antes de commitar.

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer nem observador.

## Medições
- nenhuma
