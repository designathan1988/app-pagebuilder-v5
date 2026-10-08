# TRC-components.fillFromData
- **Chamada:** `src/app/commands.ts:239` `'components.fillFromData': fillFromDataCommand,`
- **Argumentos:** `{ path: path }` — o caminho do arquivo de dados (`manifest/commands/design-system.json:1221` `"path": {`), obrigatório; a disponibilidade `instanceSelected` lê a seleção.
- **Ramos que dependem dos argumentos:** R1 (o `path` decide o arquivo lido); o documento decide os demais.

## Passos
1. `src/app/commands.ts:239` `'components.fillFromData': fillFromDataCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `instanceSelected` é lida antes do tratador [lê: EST-L01-031 via instanceSelected].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — o argumento é lido contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/core/design/components.ts:297` `export const fillFromDataCommand = registerHandler('components.fillFromData', ({ state, ids, rules, words }, { path }): Outcome<never> => {` — o tratador recebe o contexto e o argumento `path`.
8. `src/core/design/components.ts:298` `const primary = state.selection[0];` — o elemento principal [lê: EST-L01-031 via handlerContext].
9. `src/core/design/components.ts:300` `if (found === null || found.parent === null || found.node.component === undefined) return { kind: 'refused', message: message('status.components.notInstance') };` — sem instância selecionada, recusa `status.components.notInstance`.
10. `src/core/design/components.ts:301` `const definition = componentsOf(state.document).find((c) => c.name === found.node.component);` — a definição do componente [lê: EST-L01-030 via componentsOf].
11. `src/core/design/components.ts:303` `const file = fileAt(state.document, path);` — o arquivo do caminho [lê: EST-L01-030 via fileAt].
12. `src/core/design/components.ts:304` `const rows = file === null ? null : dataRows(file);` — as linhas do arquivo são lidas.
13. `src/core/design/components.ts:307` `const lockedParent = lockRefusal(state.document, parent.id, 'status.locked.edit');` — o pai é julgado pela trava [lê: EST-L01-030 via lockRefusal].
14. `src/core/design/components.ts:310` `const items = parent.children.map((child, index) => ({ child, index })).filter(({ child }) => child.component === definition.name);` — os itens repetidos do pai, em ordem.
15. `src/core/design/components.ts:311` `const columns = columnsOf(fieldsOf(definition, rules), rows, state.document);` — a coluna de cada campo é decidida [lê: EST-L01-030 via columnsOf].
16. `src/core/design/components.ts:313` `for (const [i, { child, index }] of items.entries()) {` — cada item toma a sua linha.
17. `src/core/design/components.ts:316` `const next = filled(child, row, i, columns, state.document, rules);` — o item é preenchido [lê: EST-L01-030 via filled].
18. `src/core/design/components.ts:317` `if (isMessage(next)) return { kind: 'refused', message: next };` — uma célula que não é imagem nem texto recusa o preenchimento inteiro.
19. `src/core/design/components.ts:322` `const locked = [...walk(child)].find((one) => one.locked === true && !deepEqual(now.get(one.id), one));` — um item trancado que a linha mudaria recusa.
20. `src/core/design/components.ts:324` `patches.push({ op: 'replace', path: [...parentPath, index], value: next });` — o item preenchido entra.
21. `src/core/design/components.ts:330` `for (const [i, row] of rows.slice(items.length).entries()) {` — as linhas além dos itens viram itens novos.
22. `src/core/design/components.ts:339` `patches.push({ op: 'add', path: [...parentPath, last + 1 + i], value: next });` — cada item novo entra após o último.
23. `src/core/design/components.ts:341` `return { kind: 'change', patches, message: message('status.data.filled', { name: definition.name, count: rows.length, path }) };` — o tratador devolve os patches e a mensagem.
24. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
25. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
26. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
27. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:305` `if (rows === null) return { kind: 'refused', message: message('status.data.unreadable', { path }) };` — arquivo ausente ou que não lê: recusa `status.data.unreadable`; lível: segue.
- R2 `src/core/design/components.ts:302` `if (definition === undefined) return { kind: 'refused', message: message('status.components.notInstance') };` — definição ausente: recusa `status.components.notInstance`; presente: segue.
- R3 `src/core/design/components.ts:308` `if (lockedParent !== null) return { kind: 'refused', message: lockedParent };` — pai trancado: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/design/components.ts:318` `if (deepEqual(next, child)) continue;` — item que a linha não muda: nenhum patch; mudado: o passo 20.
- R5 `src/core/design/components.ts:323` `if (locked !== undefined) return { kind: 'refused', message: message('status.locked.edit', { name: locked.name }) };` — item trancado que a linha mudaria: recusa o preenchimento inteiro.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:297`); `dataRows` (`src/core/design/components.ts:304`) lê o texto do arquivo em memória.

## Estado
- Lê: EST-L01-030 (documento: `files`, `components`, a árvore, via argumentRefusal, componentsOf, fileAt, lockRefusal, columnsOf, filled, commit), EST-L01-031 (a seleção, via instanceSelected, handlerContext, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: os itens da lista preenchidos e os itens novos, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** os itens repetidos tomam as linhas do arquivo (`src/core/design/components.ts:324`) e as linhas além viram itens novos (`src/core/design/components.ts:339`); a mensagem é `status.data.filled`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem.
- **DOM do canvas:** o canvas redesenha o documento com os itens preenchidos.

## Regras
- G1: n/a — o comando escreve caminhos do documento a partir da lista (`src/core/design/components.ts:324`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:239` `'components.fillFromData': fillFromDataCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:341`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:341`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:297`).

## Medições
- nenhuma
