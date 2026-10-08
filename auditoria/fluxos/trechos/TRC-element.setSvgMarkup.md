# TRC-element.setSvgMarkup
- **Chamada:** `src/app/commands.ts:249` `'element.setSvgMarkup': setSvgMarkupCommand,`
- **Argumentos:** o tratador recebe `{ markup }` — a marcação digitada ou colada (string).
- **Ramos que dependem dos argumentos:** R3 (o elemento não é um destino válido), R5 (a marcação não é bem formada), R6 (a mesma marcação), R7 (marcação vazia).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/svg.ts:190` `export const setSvgMarkupCommand = registerHandler('element.setSvgMarkup', ({ state, rules }, { markup }): Outcome<never> => {` — o tratador recebe o estado, as regras e a marcação.
3. `src/core/elements/svg.ts:191` `const id: NodeId | undefined = state.selection.length === 1 ? state.selection[0] : undefined;` [lê: EST-L01-031 via handlerContext]
4. `src/core/elements/svg.ts:193` `const at = locate(state.document, id);` [lê: EST-L01-030 via locate]
5. `src/core/elements/svg.ts:197` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
6. `src/core/elements/svg.ts:199` `const parsed = sanitizedSvgMarkup(String(markup));` — a marcação passa pelo sanitizador, que tira scripts e atributos de evento.
7. `src/core/elements/svg.ts:202` `const held = at.node.attributes[MARKUP];` — a marcação que o nó guarda.
8. `src/core/elements/svg.ts:206` `return { kind: 'change', patches: [{ op: held === undefined ? 'add' : 'replace', path, value: parsed.markup }], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/svg.ts:192` `if (id === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem um único elemento selecionado: recusa; com ele: segue.
- R2 `src/core/elements/svg.ts:196` `if (applies === undefined || (applies !== 'all' && !applies.includes(at.node.type))) return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.setSvgMarkup' }, name: at.node.name }) };` — elemento a que a marcação não se aplica: recusa; aplica-se: segue.
- R3 `src/core/elements/svg.ts:197` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 198): recusa; livre: segue.
- R4 `src/core/elements/svg.ts:200` `if ('refusal' in parsed) return { kind: 'refused', message: parsed.refusal };` — marcação quebrada, com tag não fechada ou fechamento que não fecha nada: recusa; bem formada: segue.
- R5 `src/core/elements/svg.ts:203` `if ((held ?? '') === parsed.markup) return { kind: 'change', message: said };` — a mesma marcação: resultado sem patches; outra: segue.
- R6 `src/core/elements/svg.ts:205` `if (parsed.markup === '') return { kind: 'change', patches: held === undefined ? [] : [{ op: 'remove', path }], message: said };` — marcação vazia remove o atributo (ou nada muda quando já não havia); com texto: grava.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, locate, lockRefusal), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com o atributo `svgMarkup` do nó por `src/core/elements/svg.ts:206` `return { kind: 'change', patches: [{ op: held === undefined ? 'add' : 'replace', path, value: parsed.markup }], message: said };`, ou removido no ramo R6.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/svg.ts:201`).
- **DOM do canvas:** o iframe redesenha o SVG com a marcação guardada pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava um atributo do nó, não um valor de estilo `src/core/elements/svg.ts:206` `return { kind: 'change', patches: [{ op: held === undefined ? 'add' : 'replace', path, value: parsed.markup }], message: said };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/svg.ts:190` `export const setSvgMarkupCommand = registerHandler('element.setSvgMarkup', ({ state, rules }, { markup }): Outcome<never> => {`
- G4: n/a — a porta é o campo de marcação do inspetor, não um ponto do canvas `manifest/commands/elements.json:4648` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/svg.ts:206` `return { kind: 'change', patches: [{ op: held === undefined ? 'add' : 'replace', path, value: parsed.markup }], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/svg.ts:206` `return { kind: 'change', patches: [{ op: held === undefined ? 'add' : 'replace', path, value: parsed.markup }], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
