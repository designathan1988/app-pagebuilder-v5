# TRC-element.setId
- **Chamada:** `src/app/commands.ts:242` `'element.setId': setIdCommand,`
- **Argumentos:** o tratador recebe `{ id, target }` — `id` é o texto do campo (string), `target` é o nó (opcional).
- **Ramos que dependem dos argumentos:** R3 (id inválido), R4 (id já usado), R5 (id vazio remove).

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/elements/attributes.ts:146` `export const setIdCommand = registerHandler('element.setId', ({ state, rules, words }, { id, target }): Outcome<never> => {` — o tratador recebe o estado, as regras e a palavra.
3. `src/core/elements/attributes.ts:147` `const at = nodeOf(state, target as NodeId | undefined);` [lê: EST-L01-030 via nodeOf] [lê: EST-L01-031 via nodeOf]
4. `src/core/elements/attributes.ts:149` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` [lê: EST-L01-030 via lockRefusal]
5. `src/core/elements/attributes.ts:151` `const typed = String(id).trim();` — o texto entra sem os espaços em volta.
6. `src/core/elements/attributes.ts:154` `const other = [...allNodes(state.document)].find((n) => n.id !== at.node.id && n.attributes.id === typed);` [lê: EST-L01-030 via allNodes]
7. `src/core/elements/attributes.ts:157` `const patch = attributePatch(at, 'id', typed === '' ? undefined : typed);` — o patch do atributo id.
8. `src/core/elements/attributes.ts:159` `return patch === null ? { kind: 'change', message: said } : { kind: 'change', patches: [patch, ...followedReferences(state.document, at.node)], message: said };` [escreve: EST-L01-030 via run] [escreve: EST-L01-033 via run]

## Ramos
- R1 `src/core/elements/attributes.ts:148` `if (at === null) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem nó nem um elemento selecionado: recusa; com nó: segue.
- R2 `src/core/elements/attributes.ts:149` `const locked = lockRefusal(state.document, at.node.id, 'status.locked.edit');` — travado (linha 150): recusa; livre: segue.
- R3 `src/core/elements/attributes.ts:152` `if (typed !== '' && !ID.test(typed)) return { kind: 'refused', message: message('status.id.invalid', { id: typed }) };` — id que não começa por letra ou tem símbolo fora de letras, dígitos, `-` e `_`: recusa; válido: segue.
- R4 `src/core/elements/attributes.ts:155` `if (other !== undefined) return { kind: 'refused', message: message('status.id.duplicate', { id: typed, name: other.name }) };` — id que outro nó já usa: recusa; livre: segue.
- R5 `src/core/elements/attributes.ts:157` `const patch = attributePatch(at, 'id', typed === '' ? undefined : typed);` — id vazio remove o atributo; com valor, grava.
- R6 `src/core/elements/attributes.ts:159` `return patch === null ? { kind: 'change', message: said } : { kind: 'change', patches: [patch, ...followedReferences(state.document, at.node)], message: said };` — quando o nó já tem esse id, resultado sem patches; caso contrário, o patch e as referências que seguem o id.

## Fronteiras assíncronas
- nenhuma — o trecho é síncrono; nenhum passo cita `await`, timer, quadro ou ouvinte.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, nodeOf, lockRefusal, allNodes), EST-L01-031 (a seleção, via handlerContext, nodeOf), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-030 (o documento, via run), EST-L01-033 (a mensagem, via run)

## Resultado
- **Estado final:** EST-L01-030 com o atributo id do nó gravado ou removido por `src/core/elements/attributes.ts:157` `const patch = attributePatch(at, 'id', typed === '' ? undefined : typed);`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/elements/attributes.ts:158`).
- **DOM do canvas:** o iframe redesenha o id do elemento pelo mesmo aviso de `src/core/store/store.ts:312`.

## Regras
- G1: n/a — o trecho grava um atributo do nó, não um valor de estilo `src/core/elements/attributes.ts:157` `const patch = attributePatch(at, 'id', typed === '' ? undefined : typed);`.
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/elements/attributes.ts:146` `export const setIdCommand = registerHandler('element.setId', ({ state, rules, words }, { id, target }): Outcome<never> => {`
- G4: n/a — a porta é o campo Definir o ID do inspetor, não um ponto do canvas `manifest/commands/elements.json:3747` `"id": "inspector-id",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/elements/attributes.ts:159` `return patch === null ? { kind: 'change', message: said } : { kind: 'change', patches: [patch, ...followedReferences(state.document, at.node)], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/elements/attributes.ts:159` `return patch === null ? { kind: 'change', message: said } : { kind: 'change', patches: [patch, ...followedReferences(state.document, at.node)], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nenhum ouvinte, timer ou observador é criado no trecho; nada a remover.

## Medições
- nenhuma
