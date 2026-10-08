# ENT-P-structure-0083 — element.wrapGrid pela porta menu-arrange
## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta menu-arrange despacha `entry.command.id` e a intenção `given` na store do editor — o Início da porta.
2. `src/editor/doors/door.tsx:95` `const dispatch = store.dispatch as (id: CommandId, args: unknown) => DispatchResult;` — o `dispatch` é o da store do editor.
3. `src/editor/doors/door.tsx:96` `const given = { ...entry.door.args, ...args };` — o `given` junta os argumentos do manifesto da porta (vazios no manifesto) e os que o lugar acrescenta: nada — a porta manda a intenção vazia.
4. `src/editor/doors/door.tsx:144` `if (file === undefined) {` — o comando não toma arquivo nem área de transferência, então a chamada é direta.
5. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a store do editor envolve o despacho (`gestureSafe`).
6. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes e o contexto de edição é capturado. [lê: EST-L05a-001 via beforeCommand]
7. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, o despacho vai direto à store do núcleo. [escreve: EST-L01-030 via dispatch] [escreve: EST-L01-031 via dispatch] [escreve: EST-L01-033 via dispatch]
8. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a store do núcleo recebe o despacho.
9. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — chama a regra única de execução.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/doors/door.tsx:94` `if (!built || !available) return;` — porta não construída ou indisponível: não despacha; disponível: segue.
- R2 `src/editor/doors/door.tsx:144` `if (file === undefined) {` — sem argumento de arquivo ou de área de transferência: a chamada é direta; com um deles a porta lê o arquivo ou o conteúdo antes (não é o caso desta porta).
- R3 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: despacha direto; com gesto aberto e comando que muda o documento: espera o gesto terminar (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via run), EST-L01-031 (a seleção, via run), EST-L05a-001
- escreve: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L01-033 (a mensagem, via dispatch)
## Resultado
- **Estado final:** EST-L01-030 com o invólucro de grade no lugar do primeiro selecionado, os selecionados dentro dele (`src/core/structure/wrap.ts:141` `patches.push({ op: 'add', path: [...parentPath, 'children', first.index], value: node });`), EST-L01-031 com a seleção no invólucro (`src/core/structure/wrap.ts:151` `return { kind: 'change', patches, selection: [node.id], message: said };`) e EST-L01-033 com a mensagem com os estilos nomeados (`src/core/structure/wrap.ts:149` `? message('status.wrapped', { name: first.node.name, wrapper: node.name, styles: named })`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do invólucro.
- **DOM do canvas:** o invólucro entra pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes do despacho.
- G3: ok `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);`).
## Ramos do trecho
- **Trecho:** TRC-element.wrapGrid
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-element.wrapGrid` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:2321` `"args": {},`); esta porta manda a intenção vazia.
