# ENT-P-selection-0025 — selection.marquee pela porta canvas-drag-shift-on-element

Fluxo de porta do domínio `selection`. Rastreia o caminho próprio da porta, do Início até a linha que despacha o comando ao tratador, sem repetir o trecho `TRC-selection.marquee`, que segue daqui.

## Passos
1. `src/editor/input/pointer/drag.ts:34` `shared.open = store.gesture();` — cada desenho da faixa abre um gesto novo da store do editor. [escreve: EST-L05a-019 via store.gesture]
2. `src/editor/input/pointer/drag.ts:35` `const rect = { x: from.x, y: from.y, width: to.x - from.x, height: to.y - from.y };` — o retângulo da faixa a partir do ponto de partida.
3. `src/editor/input/pointer/drag.ts:36` `shared.open.dispatch(ps.marquee.entry.command.id as CommandId, { ...argsFor(ps.marquee.entry, ps.marquee.press, NOT_PICKING), rect, mode: ps.marquee.mode, ...(leavesNow(altHeld) ? { leaves: true } : {}) } as never);` — o desenho roda a porta da faixa dentro do gesto.
4. `src/editor/store.ts:217` `keepTyping();` — a abertura do gesto grava a digitação pendente antes do comando (G2). [lê: EST-L05a-001 via keepTyping]
5. `src/editor/store.ts:222` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),` — o `dispatch` do gesto do editor entrega a intenção ao gesto do núcleo.
6. `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador com o gesto aberto. [lê: EST-L01-007 via dispatch]
7. `src/core/store/store.ts:400` `const entry = table[id];` — `run` busca o tratador na tabela de comandos.
8. `src/app/commands.ts:363` `'selection.marquee': marqueeCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).

## Ramos
- R1 `src/editor/input/pointer/drag.ts:29` `if (ps.marquee === null || ps.pressedAt === null || ps.pressedAt.page === null) return;` — sem faixa em curso, sem ponto de partida ou sem ponto na página, o desenho para aqui.
- R2 `src/editor/input/pointer/drag.ts:33` `shared.open?.cancel();` `src/editor/input/pointer/drag.ts:34` `shared.open = store.gesture();` — o gesto anterior é cancelado e um novo é aberto para o desenho novo.
- R3 `src/core/store/store.ts:720` `return run(id, args, current);` — o gesto do núcleo executa o tratador da faixa.

## Fronteiras assíncronas
- a porta roda dentro do ouvinte do dono do ponteiro `src/editor/input/pointer.ts:206` `target.addEventListener('pointermove', p.onMove, true);` (a cada movimento do arraste da faixa); a porta roda dentro do gesto aberto no desenho.

## Estado
- lê: EST-L05a-001 (a digitação pendente, via keepTyping), EST-L01-007 (o gesto aberto do núcleo), EST-L01-030 (o documento, via handlerContext), EST-L01-031 (a seleção, via handlerContext)
- escreve: EST-L05a-019 (o gesto aberto que sobrevive ao toque); a escrita de EST-L01-031 e EST-L01-033 é feita pelo trecho.

## Resultado
- **Estado final:** EST-L01-031 — a seleção é o modo aplicado ao que a faixa tocou (`src/core/selection/selection.ts:131` `        : [...base.filter((id) => !took.includes(id)), ...took.filter((id) => !base.includes(id))];`); o documento não muda e o comando não é desfazível (`manifest/commands/selection.json:767` `        "undoable": false`).
- **Re-renderizado:** todo assinante da store é chamado (`src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`).
- **DOM do editor:** as linhas tomadas em Camadas ficam realçadas (`src/editor/shell/sidebar/layers.tsx:229` `  const selected = useEditorState((s) => s.selection.includes(node.id));`).
- **DOM do canvas:** cada nó tomado ganha o próprio contorno e a faixa some ao findar o arraste (`src/editor/canvas/chrome.tsx:1044` `  const selection = useEditorState((s) => s.selection);`).

## Regras
- G1: n/a — o comando escreve `selection` e `message`, fora de qualquer camada de estilo (`src/core/selection/selection.ts:131` `        : [...base.filter((id) => !took.includes(id)), ...took.filter((id) => !base.includes(id))];`).
- G2: ok `src/editor/store.ts:217` `keepTyping();` — a digitação pendente é gravada quando o gesto do editor abre.
- G3: ok `src/editor/input/pointer/drag.ts:36` `shared.open.dispatch(ps.marquee.entry.command.id as CommandId, { ...argsFor(ps.marquee.entry, ps.marquee.press, NOT_PICKING), rect, mode: ps.marquee.mode, ...(leavesNow(altHeld) ? { leaves: true } : {}) } as never);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:363` `'selection.marquee': marqueeCommand,`).
- G4: n/a — o comando muda a seleção; a faixa é do desenho do canvas, não do trecho (`src/core/selection/selection.ts:131`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/selection/selection.ts:131`).
- G6: ok `src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;` — a seleção vem da store, sem cópia local.
- G7: n/a — o trecho muda a seleção; a igualdade entre render incremental e render do zero é do renderizador (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- INT: ok `src/core/store/store.ts:273` `    const problems = validateDocument(next.document, next.selection, rules);` — o estado é validado antes de publicar.

## Limpeza
- o ouvinte do dono do ponteiro é removido em `src/editor/input/pointer.ts:237` `target.removeEventListener('pointerup', p.onUp, true);`; o caminho da porta não cria outro ouvinte, timer nem observador.

## Medições
- nenhuma

## Ramos do trecho
- **Trecho:** TRC-selection.marquee
- **Argumentos enviados:** { target: id do nó sob o ponteiro, rect: o retângulo medido, mode: replace/add/toggle } e, com a tecla de pegar folhas presa, leaves: true. A porta monta os campos no próprio despacho (rect, mode e, com a tecla de pegar folhas presa, leaves); o alvo vai em `target` só na porta com Shift.
- R2 `src/core/selection/selection.ts:83` `if (target === undefined) {` — esta porta (com Shift) envia `target` = o nó sob o ponteiro: o contêiner é o pai do elemento.
- R3 `src/core/selection/selection.ts:103` `if (leaves === true) {` — com `leaves` verdadeiro (a porta o envia com a tecla de pegar folhas presa) o caminho toma a regra fina; ausente, a regra grossa.
- R4 `src/core/selection/selection.ts:127` `mode === 'replace'` — o `mode` que a porta envia (do modificador da gesto) decide o que acontece com a seleção de partida: replace, add ou toggle.
