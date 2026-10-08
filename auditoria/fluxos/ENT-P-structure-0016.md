# ENT-P-structure-0016 — element.moveUp pela porta context-menu
## Passos
1. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta context-menu despacha `entry.command.id` e a intenção `given` na store do editor — o Início da porta.
2. `src/editor/doors/door.tsx:94` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
3. `src/editor/doors/door.tsx:95` `const given = { ...entry.door.args, ...args };` — o `given` junta os argumentos do manifesto da porta (vazios no manifesto) e os que o lugar acrescenta: nada — a porta manda a intenção vazia.
4. `src/editor/doors/door.tsx:143` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
5. `src/editor/store.ts:221` `dispatch: (id, args, context) => {` — a store do editor envolve o despacho (`gestureSafe`).
6. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes e o contexto de edição é capturado. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai direto à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-033 via dispatch]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/doors/door.tsx:93` `if (!built || !available) return;` — porta não construída ou indisponível: não despacha; disponível: segue.
- R2 `src/editor/doors/door.tsx:143` `if (file === undefined) {` — sem argumento de arquivo ou de área de transferência: a chamada é direta; com um deles a porta lê o arquivo ou o conteúdo antes (não é o caso desta porta).
- R3 `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha direto; com gesto aberto e comando que muda o documento: espera o gesto terminar (`src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via handlerContext), EST-L01-031 (a seleção, via handlerContext), EST-L05a-001 (a digitação pendente, via beforeCommand)
- escreve: EST-L01-030 (o documento, via run), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run)
## Resultado
- **Estado final:** EST-L01-030 com os selecionados um lugar acima, sem deixar o pai (`src/core/structure/move.ts:256` `patches.push({ op: 'remove', path: [...parentPath, 'children', i] }, { op: 'add', path: [...parentPath, 'children', i + step], value: node });`), EST-L01-031 com a seleção como estava (`src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`) e EST-L01-033 com a mensagem de `src/core/structure/move.ts:308` `message:`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas reordena as linhas movidas.
- **DOM do canvas:** os nós trocam de lugar pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do despacho.
- G3: ok `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);`).
## Ramos do trecho
- **Trecho:** TRC-element.moveUp
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-element.moveUp` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:429` `"args": {},`); esta porta manda a intenção vazia.
