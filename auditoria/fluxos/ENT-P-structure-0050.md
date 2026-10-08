# ENT-P-structure-0050 — element.duplicate pela porta canvas-drag-canvas-element-duplicate
## Passos
1. `src/editor/input/pointer/effects.ts:230` `const made = closing?.dispatch(DUPLICATE_DRAG.command.id, { ...DUPLICATE_DRAG.door.args } as never);` — a porta canvas-drag-canvas-element-duplicate despacha o comando e os argumentos na liberação — o Início da porta.
2. `src/editor/input/pointer/effects.ts:154` `const closing = shared.open;` — `closing` é o gesto aberto (`shared.open`).
3. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o gesto foi aberto no toque, com `store.gesture()`.
4. `src/editor/store.ts:216` `gesture: () => {` — a store do editor abre o gesto.
5. `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes de abrir o gesto. [lê: EST-L05a-001 via keepTyping]
6. `src/editor/store.ts:219` `const gesture = store.gesture();` — o gesto do núcleo vem de `store.gesture()`.
7. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto da store do editor encaminha o despacho ao gesto do núcleo.
8. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
9. `src/core/store/store.ts:720` `return run(id, args, current);` — chama a regra única de execução dentro do gesto.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/input/pointer/effects.ts:223` `} else if (effect === 'commit' && dropped !== null && !fromRow && DUPLICATE_DRAG !== null && ps.releaseModifier !== null && ps.releaseModifier === DUPLICATE_KEY) {` — a liberação de um arraste com a tecla de duplicar mantida: manda a intenção vazia.
- R2 `src/editor/input/pointer/effects.ts:243` `if (effect === 'commit') closing?.commit();` — a liberação confirma o gesto; o Escape cancela (`src/editor/input/pointer/effects.ts:244` `else closing?.cancel();`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L05a-001 (a digitação pendente, via keepTyping)
- escreve: EST-L01-030 (o documento, via dispatch), EST-L01-031 (a seleção, via dispatch), EST-L01-033 (a mensagem, via dispatch)
## Resultado
- **Estado final:** EST-L01-030 com uma cópia depois de cada raiz (`src/core/structure/duplicate.ts:97` `.map(({ root, copy }) => ({ op: 'add', path: [...root.path.slice(0, -1), root.index + 1], value: copy }));`), EST-L01-031 com a seleção nas cópias (`src/core/structure/duplicate.ts:104` `const selection = [primary.copy.id, ...copies.filter((c) => c !== primary).map((c) => c.copy.id)];`) e EST-L01-033 com a mensagem de `src/core/structure/duplicate.ts:109` `message: copies.length === 1 ? message('status.duplicated', { name: primary.root.node.name, copy: primary.copy.name }) : message('status.duplicatedMany', { count: copies.length }),`.
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha as linhas das cópias.
- **DOM do canvas:** as cópias entram pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada antes do gesto.
- G3: ok `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/effects.ts:230` `const made = closing?.dispatch(DUPLICATE_DRAG.command.id, { ...DUPLICATE_DRAG.door.args } as never);`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/pointer/effects.ts:230` `const made = closing?.dispatch(DUPLICATE_DRAG.command.id, { ...DUPLICATE_DRAG.door.args } as never);`).
## Ramos do trecho
- **Trecho:** TRC-element.duplicate
- **Argumentos enviados:** nenhum campo — o tipo é `Record<string, never>`
- nenhum — o trecho `TRC-element.duplicate` não lista ramo que dependa dos argumentos (`manifest/commands/structure.json:1348` `"args": {},`); esta porta manda a intenção vazia.
