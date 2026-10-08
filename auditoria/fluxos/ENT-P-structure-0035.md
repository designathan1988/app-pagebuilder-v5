# ENT-P-structure-0035 — element.wrapBeside pela porta canvas-drag-palette-tile-side-band
## Passos
1. `src/editor/input/pointer/effects.ts:215` `else if (side !== null && sideDoorOf !== null) closing?.dispatch(` — a porta canvas-drag-palette-tile-side-band despacha o comando e os argumentos na liberação — o Início da porta.
2. `src/editor/input/pointer/effects.ts:154` `const closing = shared.open;` — `closing` é o gesto aberto (`shared.open`).
3. `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();` — o gesto foi aberto no toque, com `store.gesture()`.
4. `src/editor/store.ts:215` `gesture: () => {` — a store do editor abre o gesto.
5. `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada antes de abrir o gesto. [lê: EST-L05a-001 via keepTyping]
6. `src/editor/store.ts:218` `const gesture = store.gesture();` — o gesto do núcleo vem de `store.gesture()`.
7. `src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o gesto da store do editor encaminha o despacho ao gesto do núcleo.
8. `src/core/store/store.ts:718` `dispatch: (id, args) => {` — o gesto do núcleo recebe o despacho.
9. `src/core/store/store.ts:720` `return run(id, args, current);` — chama a regra única de execução dentro do gesto.
10. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id.
11. `src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,` — a linha da Chamada do trecho: o tratador do comando.
## Ramos
- R1 `src/editor/input/pointer/effects.ts:215` `else if (side !== null && sideDoorOf !== null) closing?.dispatch(` — a liberação é uma criação de peça com um lado confirmado: leva `entry`, `target`, `side` e `wrapper`.
- R2 `src/editor/input/pointer/effects.ts:243` `if (effect === 'commit') closing?.commit();` — a liberação confirma o gesto; o Escape cancela (`src/editor/input/pointer/effects.ts:244` `else closing?.cancel();`).
## Fronteiras assíncronas
- nenhuma — o caminho da porta é síncrono (`src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);`); nenhum `await`, timer, quadro ou ouvinte é criado no trecho desta porta.
## Estado
- lê: EST-L01-030 (o documento, via handlerContext), EST-L01-031 (a seleção, via handlerContext), EST-L05a-001 (a digitação pendente, via keepTyping)
- escreve: EST-L01-030 (o documento, via run), EST-L01-031 (a seleção, via run), EST-L01-033 (a mensagem, via run)
## Resultado
- **Estado final:** EST-L01-030 com o invólucro no lugar do alvo, segurando o alvo e o que chega na ordem do lado (`src/core/structure/wrap.ts:267` `const children = withChildStyles(rules, side === 'before' ? [...arriving, place.node] : [place.node, ...arriving], definition.childStyles);`), EST-L01-031 com a seleção no invólucro (`src/core/structure/wrap.ts:289` `selection: [node.id],`) e EST-L01-033 com a mensagem `status.wrappedBeside` (`src/core/structure/wrap.ts:290` `message: message('status.wrappedBeside', { wrapper: node.name, name: first.name, target: at.node.name, styles: stylesText(definition.styles) }),`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; Camadas ganha a linha do invólucro.
- **DOM do canvas:** o invólucro entra pela lista de remendos que `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` publica.
## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador escreve pela camada do contexto capturado.
- G2: ok `src/editor/store.ts:216` `keepTyping();` — a digitação pendente é gravada antes do gesto.
- G3: ok `src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,` — um só tratador; esta porta manda só a intenção e chega à mesma linha da Chamada do trecho.
- G4: n/a — o caminho da porta e o tratador não desenham sobre o canvas (`src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,`).
- G5: n/a — o caminho da porta e o tratador não medem nem desenham painel ou barra (`src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — o render incremental recebe os remendos do documento novo.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nada a remover — o caminho da porta não cria ouvinte, timer nem observador (`src/editor/input/pointer/effects.ts:215` `else if (side !== null && sideDoorOf !== null) closing?.dispatch(`).
## Medições
- nenhuma — nenhum passo do caminho da porta usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco (`src/editor/input/pointer/effects.ts:215` `else if (side !== null && sideDoorOf !== null) closing?.dispatch(`).
## Ramos do trecho
- **Trecho:** TRC-element.wrapBeside
- **Argumentos enviados:** `{ entry: <id da entrada da paleta>, target: <alvo do lado>, side: <before|after da oferta>, wrapper: <row|column da oferta, trocado pelo modificador> }`
- R1: `src/core/structure/wrap.ts:240` `const arriving: DocNode[] = entry === undefined ? selectionRoots(state.document, state.selection).map((l) => l.node) : [paletteNode(make, entry)];` — esta porta manda `entry`: chega um nó novo da paleta.
- R2: `src/core/structure/wrap.ts:241` `if (arriving.length === 0) throw new Error('element.wrapBeside: nothing arrives');` — esta porta manda o que chega (a entrada nova).
- R3: `src/core/structure/wrap.ts:267` `const children = withChildStyles(rules, side === 'before' ? [...arriving, place.node] : [place.node, ...arriving], definition.childStyles);` — esta porta manda sempre um lado (`before` ou `after`): `before` põe o que chega antes do alvo e `after` depois dele.
- R4: `src/core/structure/wrap.ts:251` `const definition = rules.wrappers.get(kind as WrapperId);` — esta porta manda sempre um invólucro (`row` ou `column`): ele escolhe a definição do invólucro.
