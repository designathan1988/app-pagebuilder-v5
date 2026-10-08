# TRC-components.setVariant
- **Chamada:** `src/app/commands.ts:220` `'components.setVariant': setVariantCommand,`
- **Argumentos:** `{ variant: string }` — o nome da variante (`manifest/commands/design-system.json:1668` `"variant": {`), obrigatório; um texto vazio tira a variante.
- **Ramos que dependem dos argumentos:** R2 e R3 (o `variant` decide R2 e R3).

## Passos
1. `src/app/commands.ts:220` `'components.setVariant': setVariantCommand,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `insideInstance` é lida antes do tratador [lê: EST-L01-031 via insideInstance].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/core/design/components.ts:450` `export const setVariantCommand = registerHandler('components.setVariant', ({ state }, { variant }): Outcome<never> => {` — o tratador recebe o estado e o argumento `variant`.
7. `src/core/design/components.ts:452` `const root = primary === undefined ? null : instanceRootOf(state.document, primary);` — a raiz da instância [lê: EST-L01-030 via instanceRootOf].
8. `src/core/design/components.ts:454` `const found = locate(state.document, root.id as NodeId);` — a posição da raiz [lê: EST-L01-030 via locate].
9. `src/core/design/components.ts:456` `const typed = variant.trim().toLowerCase();` — a variante é aparada e posta em minúsculas.
10. `src/core/design/components.ts:458` `const locked = lockRefusal(state.document, root.id as NodeId, 'status.locked.edit');` — uma instância trancada recusa [lê: EST-L01-030 via lockRefusal].
11. `src/core/design/components.ts:441` `export function variantBase(component: string): string {` — `variantBase` monta a base do modificador a partir do nome do componente.
12. `src/core/design/components.ts:462` `const classes = [...root.classes.filter((one) => !one.startsWith(prefix)), ...(typed === '' ? [] : [className])];` — as classes da raiz ficam com a variante escolhida e sem outra do componente.
13. `src/core/design/components.ts:464` `const held = state.document.classes ?? [];` — as classes do projeto [lê: EST-L01-030 via handlerContext].
14. `src/core/design/components.ts:466` `patches.push(state.document.classes === undefined ? { op: 'add', path: ['classes'], value: [{ name: className, styles: {} }] } : { op: 'add', path: ['classes', held.length], value: { name: className, styles: {} } });` — a classe da variante entra, vazia, quando o projeto não a tem.
15. `src/core/design/components.ts:468` `if (!deepEqual(classes, root.classes)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: classes });` — o patch das classes da raiz, quando mudam.
16. `src/core/design/components.ts:469` `return { kind: 'change', patches, message: typed === '' ? message('status.components.variantCleared', { name: root.name }) : message('status.components.variantSet', { name: root.name, variant: typed }) };` — o tratador devolve os patches e a mensagem (limpa ou definida).
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);` — o passo entra na história [escreve: EST-L01-032 via record].
19. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o documento novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
20. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/design/components.ts:453` `if (root === null || root.component === undefined) return { kind: 'refused', message: message('status.components.notInstance') };` — sem raiz de instância: recusa `status.components.notInstance`; com raiz: segue.
- R2 `src/core/design/components.ts:457` `if (typed !== '' && !/^[a-z][a-z0-9-]*$/.test(typed)) return { kind: 'refused', message: message('status.components.badVariant', { variant: variant.trim() }) };` — variante fora do padrão: recusa `status.components.badVariant`; vazia ou válida: segue.
- R3 `src/core/design/components.ts:459` `if (locked !== null) return { kind: 'refused', message: locked };` — instância trancada: recusa `status.locked.edit`; livre: segue.
- R4 `src/core/design/components.ts:465` `if (typed !== '' && !held.some((one) => one.name === className)) {` — variante nova e classe ausente: a classe vazia entra (passo 14); vazia ou já existente: não entra.
- R5 `src/core/design/components.ts:468` `if (!deepEqual(classes, root.classes)) patches.push({ op: 'replace', path: [...found.path, 'classes'], value: classes });` — classes da raiz sem mudança: nenhum patch; mudadas: o patch entra.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/core/design/components.ts:450`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`, classes da raiz, via instanceRootOf, locate, lockRefusal, handlerContext, commit), EST-L01-031 (a seleção, via insideInstance, commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento: `classes` do projeto e as classes da raiz, via applyPatches, publish), EST-L01-031 (a seleção, via commit), EST-L01-032 (o histórico, via record), EST-L01-033 (a mensagem, via publish).

## Resultado
- **Estado final:** a raiz da instância passa a listar a classe da variante (ou perde a variante, com `typed` vazio) (`src/core/design/components.ts:468`), e a classe da variante entra vazia quando faltava (`src/core/design/components.ts:466`); a mensagem é `status.components.variantSet` ou `status.components.variantCleared`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o campo de variante do inspector mostra a escolha.
- **DOM do canvas:** o canvas redesenha o documento com os estilos da variante.

## Regras
- G1: n/a — o comando escreve caminhos fixos do documento (`src/core/design/components.ts:468`), não a camada que a digitação começou.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:220` `'components.setVariant': setVariantCommand,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/design/components.ts:469`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/core/design/components.ts:469`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/core/design/components.ts:450`).

## Medições
- nenhuma
