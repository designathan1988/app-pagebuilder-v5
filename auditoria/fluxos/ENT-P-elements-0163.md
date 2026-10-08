# ENT-P-elements-0163 — element.applyHtml pela porta element.applyHtml#code-panel-html-apply
## Passos
1. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — o controle do manifesto despacha o comando da porta com os argumentos que o door e o local lhe dão (door.tsx:95 monta `given` de `entry.door.args` e dos argumentos do local).
2. `src/editor/store.ts:233` `dispatch: (id, args, context) => {` — a `dispatch` que a store do editor (gestureSafe) expõe, por onde todo comando do editor passa.
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — antes de rodar, a store pergunta à digitação pendente o contexto da edição. [lê: EST-L05a-001 via beforeCommand]
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto, a `dispatch` da store do núcleo roda o comando. [lê: EST-L05a-038 via gestureSafe.dispatch]
5. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — a `dispatch` da store do núcleo.
6. `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a store recusa um despacho com um gesto aberto. [lê: EST-L01-007 via dispatch]
7. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — a store chama o `run` do despacho.
8. `src/core/store/store.ts:399` `const run = <Id extends CommandId>(id: Id, args: CommandArgs[Id], gesture: OpenGesture | null, confirmed = false, ownedGroup: OpenGesture | null = null, at?: EditContext): DispatchResult => {` — o `run` do despacho.
9. `src/core/store/store.ts:400` `const entry = table[id];` — a store lê o tratador do comando na tabela.
10. `src/app/commands.ts:251` `'element.applyHtml': applyHtmlCommand,` — a tabela liga o comando ao tratador (a Chamada do trecho).
## Ramos
- R1 `src/editor/store.ts:234` `const changesDocument = UNDOABLE.get(id) === true;` — comando desfazível: a digitação pendente é guardada antes (o valor digitado vai primeiro); não desfazível: só o contexto da edição.
- R2 `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — sem gesto aberto: o comando roda agora; com um gesto aberto e o comando desfazível: a gravação entra na fila da linha 224.
- R3 `src/core/store/store.ts:686` `if (open) throw new Error('a gesture is open: dispatch through it');` — a `dispatch` da store do núcleo recusa um gesto aberto; sem gesto, segue.
- R4 `src/core/store/store.ts:400` `const entry = table[id];` — lida a entrada da tabela, o `run` segue para o tratador (a Chamada do trecho).
## Fronteiras assíncronas
- nenhuma — o caminho da porta até a chamada é síncrono; nenhum passo cita um await, timer, quadro ou ouvinte.
## Estado
- lê: EST-L05a-001, EST-L05a-038, EST-L01-007
- escreve: nenhum no caminho da porta; a escrita de EST-L01-030 é feita pelo trecho citado.
## Resultado
- **Estado final:** EST-L01-030 com a subárvore do elemento trocada por `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- **Re-renderizado:** o canvas pelo caminho de `src/core/store/store.ts:323` `for (const listener of [...documentListeners]) listener(change);`.
- **DOM do editor:** a barra de status mostra a mensagem (`src/core/import/apply-html.ts:74`); as Camadas e o inspetor acompanham.
- **DOM do canvas:** o iframe redesenha a subárvore pelo mesmo aviso de `src/core/store/store.ts:312`.
## Regras
- G1: n/a — o trecho grava tag, atributos, classes e texto do nó, não um valor de estilo `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta envia só a intenção ao mesmo tratador do comando (`src/app/commands.ts:251`).
- G4: n/a — a porta é o botão Aplicar o HTML do painel de código, não um ponto do canvas `manifest/commands/elements.json:4773` `"kind": "panel-control",`.
- G5: n/a — o trecho não desenha painel nem barra; só devolve patches `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- G6: n/a — o trecho não escreve a seleção `src/core/import/apply-html.ts:85` `return { kind: 'change' as const, patches: [{ op: 'replace', path: [...at.path], value: written }, ...released], message: said };`.
- G7: n/a — a comparação do DOM do canvas é medida fora do trecho `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`
## Limpeza
- nenhum ouvinte, timer ou observador é criado no caminho da porta; nada a remover.
## Medições
- nenhuma
## Ramos do trecho
- **Trecho:** TRC-element.applyHtml
- **Argumentos enviados:** { html: <o markup do painel de código, o elemento e suas linhas> }
- R4 (marcação que não pode ser lida) `src/core/import/apply-html.ts:54` `if ('line' in imported) return { kind: 'refused' as const, message: imported.message };` — a marcação que a porta envia: recusada pelo importador toma o lado da recusa; lida, segue.
- R5 (marcação que não é um único elemento) `src/core/import/apply-html.ts:57` `if (root === undefined || imported.nodes.length !== 1) return { kind: 'refused' as const, message: message('status.html.invalidAt', { line: 1, reason: { key: 'status.html.oneElement' } }) };` — nenhum ou mais de um elemento recusa; exatamente um, segue.
- R6 (aninhamento recusado) `src/core/import/apply-html.ts:61` `if (refusal !== null) return { kind: 'refused' as const, message: refusal };` — pai que não aceita o elemento novo recusa; aceita, segue.
- R7 (o mesmo documento) `src/core/import/apply-html.ts:73` `const same = JSON.stringify(at.node) === JSON.stringify(written);` — o mesmo documento toma o lado sem patches; diferente, grava a subárvore.
