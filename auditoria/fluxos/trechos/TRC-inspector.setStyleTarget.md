# TRC-inspector.setStyleTarget
- **Chamada:** `src/app/commands.ts:232` `'inspector.setStyleTarget': setStyleTarget,`
- **Argumentos:** `{ target: enum [element, class], className?: string }` — `target` escolhe o Elemento ou a classe (`manifest/commands/design-system.json:690` `"target": {`); `className` é opcional.
- **Ramos que dependem dos argumentos:** R1, R2 e R3 (o `target` e o `className` decidem os três).

## Passos
1. `src/app/commands.ts:232` `'inspector.setStyleTarget': setStyleTarget,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
6. `src/editor/inspector/style-target.ts:29` `export const setStyleTarget = registerHandler<'inspector.setStyleTarget', EditorUi>(` — o tratador é registrado para o estado do editor.
7. `src/editor/inspector/style-target.ts:32` `const { styleTarget: _dropped, ...rest } = state.ui;` — o estado do editor é separado do campo `styleTarget` [lê: EST-L01-037 via handlerContext].
8. `src/editor/inspector/style-target.ts:36` `if (target !== ELEMENT && className !== undefined && !classesOf(state.document).some((styleClass) => styleClass.name === className)) {` — classe pedida que o projeto não tem [lê: EST-L01-030 via classesOf].
9. `src/editor/inspector/style-target.ts:37` `const selected = state.selection.map((id) => locate(state.document, id)?.node);` — os nós selecionados são achados [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate].
10. `src/editor/inspector/style-target.ts:38` `if (selected.length > 0 && selected.every((node) => node !== undefined && node.classes.includes(className)))` — todos os selecionados já listam a classe.
11. `src/editor/inspector/style-target.ts:39` `return { kind: 'change', patches: missingClassDefinitions(state.document, [className]), ui: { ...rest, styleTarget: className }, message: message('status.classes.registered', { name: className }) };` — registra a definição vazia e escolhe o alvo [lê: EST-L01-030 via missingClassDefinitions].
12. `src/core/design/classes.ts:27` `export function missingClassDefinitions(document: DocumentJson, names: readonly string[]): Patch[] {` — `missingClassDefinitions` cria as definições que faltam.
13. `src/editor/inspector/style-target.ts:42` `const name = target === ELEMENT || className === undefined ? null : classTarget(state.document, state.selection, className)?.styleClass.name ?? null;` — a classe do alvo, quando todos os selecionados a listam [lê: EST-L01-030 via classTarget] [lê: EST-L01-031 via classTarget].
14. `src/core/design/classes.ts:62` `if (index < 0 || nodes.length === 0 || !nodes.every((node) => node !== undefined && node.classes.includes(name))) return null;` — `classTarget` devolve a classe só quando ela existe e todos os selecionados a listam.
15. `src/editor/inspector/style-target.ts:43` `if (name === (state.ui.styleTarget ?? null)) return { kind: 'change' };` — alvo igual ao atual: `change` sem mudança.
16. `src/editor/inspector/style-target.ts:44` `return { kind: 'change', ui: name === null ? rest : { ...rest, styleTarget: name } };` — o novo alvo entra (ou sai) do estado do editor.
17. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches, se houver [escreve: EST-L01-030 via applyPatches].
18. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
19. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (o `ui` novo) [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish] [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/inspector/style-target.ts:36` `if (target !== ELEMENT && className !== undefined && !classesOf(state.document).some((styleClass) => styleClass.name === className)) {` — classe pedida que o projeto não tem: julga o passo 10; tem, ou `target` é Elemento: segue para o passo 13.
- R2 `src/editor/inspector/style-target.ts:38` `if (selected.length > 0 && selected.every((node) => node !== undefined && node.classes.includes(className)))` — todos os selecionados listam a classe: registra a definição e escolhe o alvo; algum não lista (ou nada selecionado): segue para o passo 13.
- R3 `src/editor/inspector/style-target.ts:43` `if (name === (state.ui.styleTarget ?? null)) return { kind: 'change' };` — alvo novo igual ao atual: `change` sem mudança; diferente: o passo 16 escreve o `ui`.
- R4 `src/editor/inspector/style-target.ts:44` `return { kind: 'change', ui: name === null ? rest : { ...rest, styleTarget: name } };` — `name` nulo: o campo `styleTarget` sai (alvo Elemento); não nulo: entra com a classe.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/style-target.ts:29`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento `classes`), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento `classes`, quando registra), EST-L01-033 (mensagem), EST-L01-037 (`ui.styleTarget`).

## Resultado
- **Estado final:** o `ui.styleTarget` fica com a classe escolhida ou sai (`src/editor/inspector/style-target.ts:44`); quando a classe faltava e todos a listam, uma definição vazia entra (`src/editor/inspector/style-target.ts:39`). A mensagem é `status.classes.registered` só no caso do registro.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de alvo do inspector marca o chip Elemento ou o chip da classe; a barra de status mostra a mensagem quando há registro.
- **DOM do canvas:** nada muda (o comando não muda estilos nem a geometria da página).

## Regras
- G1: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — o dispatch carrega o contexto da edição, que os campos de estilo leem a seguir.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:232` `'inspector.setStyleTarget': setStyleTarget,`
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/style-target.ts:44`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/editor/inspector/style-target.ts:44`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/style-target.ts:29`).

## Medições
- nenhuma
