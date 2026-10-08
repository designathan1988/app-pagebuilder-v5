# TRC-element.setEmbedMarkup
- **Chamada:** `src/app/commands.ts:250` `'element.setEmbedMarkup': setEmbedMarkupCommand,`
- **Argumentos:** o tratador recebe `{ markup, target }` — `markup` é a marcação colada (string), `target` é o nó (opcional).
- **Ramos que dependem dos argumentos:** R2 (o elemento não é destino), R4 (a mesma marcação).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/embed.ts:17` `export const setEmbedMarkupCommand = registerHandler('element.setEmbedMarkup', ({ state, rules }, { markup, target }): Outcome<never> => {` — o tratador recebe o estado, as regras e a marcação.
3. `src/core/elements/embed.ts:18` `const id = target ?? (state.selection.length === 1 ? state.selection[0] : undefined);` [lê: EST-L01-031 via handlerContext]
4. `src/core/elements/embed.ts:20` `const at = locate(state.document, id);` [lê: EST-L01-030 via locate]
5. `src/core/elements/embed.ts:23` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
6. `src/core/elements/embed.ts:25` `const text = String(markup);` — a marcação fica como foi digitada.
7. `src/core/elements/embed.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'text'], value: text }], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/embed.ts:19` `if (id === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem nó nomeado nem um elemento selecionado: recusa; com nó: segue.
- R2 `src/core/elements/embed.ts:22` `if (rules.elements.get(at.node.type)?.content !== 'markup') return { kind: 'refused', message: message('status.element.notApplicable', { command: { key: 'command.setEmbedMarkup' }, name: at.node.name }) };` — elemento cujo conteúdo não é marcação: recusa; é: segue.
- R3 `src/core/elements/embed.ts:23` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 24): recusa; livre: segue.
- R4 `src/core/elements/embed.ts:27` `if (at.node.text === text) return { kind: 'change', message: said };` — o mesmo texto: resultado sem patches; outro: grava.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, locate, lockRefusal), EST-L01-031 (a seleção, via handlerContext), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com o `text` do nó igual à marcação por `src/core/elements/embed.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'text'], value: text }], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/embed.ts:26`).
- **DOM do canvas:** o iframe redesenha o Embed dentro do quadro em sandbox pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava o texto do nó, não um valor de estilo `src/core/elements/embed.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'text'], value: text }], message: said };`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/embed.ts:17` `export const setEmbedMarkupCommand = registerHandler('element.setEmbedMarkup', ({ state, rules }, { markup, target }): Outcome<never> => {`
- G4: n/a — a porta é o campo de marcação do inspetor, não um ponto do canvas `manifest/commands/elements.json:4710` `"kind": "inspector-field",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/embed.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'text'], value: text }], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/embed.ts:28` `return { kind: 'change', patches: [{ op: 'replace', path: [...at.path, 'text'], value: text }], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
