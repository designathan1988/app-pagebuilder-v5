# ENT-P-capture-0005 — capture.select pela porta capture.select#canvas-click-captured-element

Fluxo de porta do domínio `capture`. Rastreia o caminho próprio da porta — de `src/editor/input/pointer/effects.ts:61` até a linha que despacha o comando ao tratador — sem repetir o trecho `TRC-capture.select`, que segue daqui. A porta é `manifest/commands/capture.json:191` `"kind": "canvas-click",` com o alvo `manifest/commands/capture.json:193` `"target": "captured-element",`.

## Passos
1. `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — o toque roda a porta dentro do gesto que a pressão abriu em `src/editor/input/pointer/effects.ts:41` `shared.open = store.gesture();`, com a porta resolvida em `src/editor/input/pointer/effects.ts:47` `const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);`. [escreve: EST-L05a-019 via store.gesture] [lê: EST-L01-007 via dispatch]
2. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador com o gesto aberto, depois de a store do editor gravar a digitação pendente em `src/editor/store.ts:205` `keepTyping();`. [lê: EST-L05a-001 via keepTyping] [lê: EST-L01-007 via run]
3. `src/core/store/store.ts:400` `const entry = table[id];` — a tabela de comandos dá o tratador do id (`src/app/commands.ts:218` `'capture.select': selectCapturedCommand,`).
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento declarado é conferido antes do tratador. [lê: EST-L01-030 via argumentRefusal]
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a linha que despacha o comando ao tratador (a `Chamada` do trecho `TRC-capture.select`).

## Ramos
- R1 `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — com uma porta resolvida, sem `deferred` e sem escolha de alvo em curso, o toque roda a porta; qualquer outro caso não chega aqui.
- R2 `src/editor/input/pointer/effects.ts:47` `const entry = clickDoor(press, ps.buttons.button, ps.buttons.count, clickModifier, p.factsOf(press), picking);` — a porta só é resolvida quando o toque pousa sobre um nó capturado (`src/editor/input/pointer/press.ts:57` `if (target === 'captured-element') return press.on === 'captured';`); fora dele, `entry` é nulo.
- R3 `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador com o gesto aberto; a gravação fica no contexto do gesto.
- R4 `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento `target` dentro da declaração do manifesto: o caminho segue ao tratador; fora dela: o despacho para na recusa.

## Fronteiras assíncronas
- a porta roda dentro do ouvinte do dono do ponteiro `src/editor/input/pointer.ts:204` `target.addEventListener('pointerdown', p.onDown, true);`; a porta roda dentro do gesto aberto no próprio toque.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via keepTyping), EST-L01-007 (o gesto aberto do núcleo), EST-L01-030 (o documento, via argumentRefusal), EST-L01-031 (a seleção, via handlerContext)
- escreve: EST-L05a-019 (o gesto aberto que sobrevive ao toque); a escrita de EST-L01-031 e EST-L01-037 é feita pelo trecho.

## Resultado
- **Estado final:** inalterado por esta porta; o tratador do trecho `TRC-capture.select` guarda o nó escolhido em `ui.capturedNode` e esvazia a seleção dos elementos.
- **Re-renderizado:** nada muda por esta porta; quem avisa os assinantes da store é o trecho `TRC-capture.select`.
- **DOM do editor:** nada muda por esta porta `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`.
- **DOM do canvas:** nada muda por esta porta.

## Regras
- G1: n/a — o comando não tem digitação de campo; o único argumento é o nó capturado sob o ponteiro (`src/editor/input/pointer/press.ts:84` `return entry.door.adapter.selection === 'target' && (press.on === 'node' || press.on === 'captured') ? { ...entry.door.args, target: press.node } : { ...entry.door.args };`).
- G2: ok `src/editor/store.ts:205` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);` — a porta envia só a intenção (o id e o argumento) e o tratador único decide.
- G4: n/a — o comando muda a seleção; nada é desenhado sobre o ponto da ação no canvas (`src/editor/capture/selection.ts:11` `return { kind: 'change', ui: { ...state.ui, capturedNode: target }, selection: [], message: message('status.selected', { name }) };`).
- G5: n/a — o caminho da porta não desenha painel nem barra (`src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`).
- G6: n/a — o caminho da porta não escreve a seleção (`src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`).
- G7: n/a — a comparação do DOM do canvas é medida fora desta porta (`src/editor/input/pointer/effects.ts:61` `if (entry && !deferred && pickingDoor === null) shared.open.dispatch(entry.command.id as CommandId, argsFor(entry, press, picking) as never);`).
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);` — a integridade é conferida no commit da store do núcleo, depois da gravação que o trecho devolve.

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o caminho da porta não cria outro ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-capture.select
- **Argumentos enviados:** `{ target }` — a porta entrega o nó capturado sob o ponteiro (`src/editor/input/pointer/press.ts:84` `return entry.door.adapter.selection === 'target' && (press.on === 'node' || press.on === 'captured') ? { ...entry.door.args, target: press.node } : { ...entry.door.args };`) e o manifesto declara `manifest/commands/capture.json:209` `"args": {}`.
- R1 `src/editor/capture/selection.ts:9` `if (found === null) return { kind: 'refused', message: message('status.capture.nodeMissing') };` — o lado falso: o toque só resolve a porta sobre um nó capturado, então `target` existe na captura e `found` existe.
- R2 `src/editor/capture/selection.ts:10` `const name = found.node.kind === 'element' ? found.node.tag : found.node.kind;` — depende do nó tocado: para um elemento a mensagem nomeia a tag; para texto ou comentário nomeia o próprio `kind`.
