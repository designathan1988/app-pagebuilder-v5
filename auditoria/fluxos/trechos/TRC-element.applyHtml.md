# TRC-element.applyHtml
- **Chamada:** `src/app/commands.ts:251` `'element.applyHtml': applyHtmlCommand,`
- **Argumentos:** o tratador recebe `{ html }` — a marcação editada no painel de código (string).
- **Ramos que dependem dos argumentos:** R4 (marcação que não pode ser lida), R5 (marcação que não é um único elemento), R6 (aninhamento recusado), R7 (o mesmo documento).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/import/apply-html.ts:45` `export const applyHtmlCommand = registerHandler('element.applyHtml', (context, { html }) => {` — o tratador recebe o contexto e a marcação.
3. `src/core/import/apply-html.ts:47` `const id = state.selection.length === 1 ? state.selection[0] : undefined;` [lê: EST-L01-031 via handlerContext]
4. `src/core/import/apply-html.ts:49` `const at = locate(state.document, id);` [lê: EST-L01-030 via locate]
5. `src/core/import/apply-html.ts:51` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
6. `src/core/import/apply-html.ts:53` `const imported = nodesFromMarkup(String(html ?? ''), nodeMaker(state.document, rules, ids, words), context as HandlerContext<never>);` — a marcação vira nós pelas regras do importador.
7. `src/core/import/apply-html.ts:63` `const reconciledNode = reconciled(at.node, root);` — o elemento mantém identidade e estilos, o markup dá tag, atributos, classes e texto.
8. `src/core/import/apply-html.ts:72` `const written = leaving.size === 0 ? reconciledNode : withoutReferencesTo(reconciledNode, names);` — a subárvore escrita, sem as referências ao que sai.
9. `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/import/apply-html.ts:48` `if (id === undefined) return { kind: 'refused' as const, message: message('status.needsSingleSelection') };` — sem um único elemento selecionado: recusa; com ele: segue.
- R2 `src/core/import/apply-html.ts:51` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 52): recusa; livre: segue.
- R3 `src/core/import/apply-html.ts:54` `if ('line' in imported) return { kind: 'refused' as const, message: imported.message };` — marcação que o importador recusa, com a linha e o motivo: recusa; lida: segue.
- R4 `src/core/import/apply-html.ts:57` `if (root === undefined || imported.nodes.length !== 1) return { kind: 'refused' as const, message: message('status.html.invalidAt', { line: 1, reason: { key: 'status.html.oneElement' } }) };` — nenhum ou mais de um elemento: recusa; exatamente um: segue.
- R5 `src/core/import/apply-html.ts:61` `if (refusal !== null) return { kind: 'refused' as const, message: refusal };` — o pai não aceita o elemento novo: recusa; aceita: segue.
- R6 `src/core/import/apply-html.ts:73` `const same = JSON.stringify(at.node) === JSON.stringify(written);` — o mesmo documento (linha 75): resultado sem patches; diferente: grava.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030, EST-L01-031, EST-L01-037
- escreve: EST-L01-030, EST-L01-033

## Resultado
- **Estado final:** EST-L01-030 com a subárvore do elemento trocada por `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/import/apply-html.ts:74`); as Camadas e o inspetor acompanham.
- **DOM do canvas:** o iframe redesenha a subárvore pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava tag, atributos, classes e texto do nó, não um valor de estilo `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/import/apply-html.ts:45` `export const applyHtmlCommand = registerHandler('element.applyHtml', (context, { html }) => {`
- G4: n/a — a porta é o botão Aplicar o HTML do painel de código, não um ponto do canvas `manifest/commands/elements.json:4773` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
