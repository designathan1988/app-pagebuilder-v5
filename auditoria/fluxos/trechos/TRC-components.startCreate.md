# TRC-components.startCreate
- **Chamada:** `src/app/commands.ts:234` `'components.startCreate': openComponentPrompt,`
- **Argumentos:** `{ target?: node }` — um nó opcional (`manifest/commands/design-system.json:752` `"target": {`); quando ausente, vale a seleção.
- **Ramos que dependem dos argumentos:** R1 (o `target` decide o nó do prompt).

## Passos
1. `src/app/commands.ts:234` `'components.startCreate': openComponentPrompt,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o menu de contexto ou a command bar).
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `singleSelection` é lida antes do tratador [lê: EST-L01-031 via run].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos; um `target` que o documento não tem é `status.stale` [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/shell/component-prompt.ts:11` `export const openComponentPrompt = registerHandler<'components.startCreate', EditorUi>('components.startCreate', ({ state }, { target }) => {` — o tratador recebe o estado e o argumento `target`.
8. `src/editor/shell/component-prompt.ts:12` `const node = (target as NodeId | undefined) ?? state.selection[0];` — o nó nomeado, senão o primeiro selecionado [lê: EST-L01-031 via handlerContext].
9. `src/editor/shell/component-prompt.ts:15` `const refused = createRefusal(state.document, node);` — o nó é julgado pelo que o `create` responderia [lê: EST-L01-030 via createRefusal].
10. `src/core/design/components.ts:85` `export function createRefusal(document: DocumentJson, id: NodeId): Message | null {` — `createRefusal` julga a raiz, a instância, um instante dentro dela e a trava.
11. `src/core/design/components.ts:88` `if (found.parent === null) return message('status.components.root');` — a raiz da página é recusada.
12. `src/core/design/components.ts:89` `if (instanceRootOf(document, found.node.id as NodeId) !== null) return message('status.components.inInstance', { name: found.node.name });` — um nó dentro de uma instância é recusado.
13. `src/editor/shell/component-prompt.ts:17` `if (state.ui.componentPrompt?.node === node) return { kind: 'change' };` — o prompt já está aberto nesse nó: `change` sem mudança [lê: EST-L01-037 via handlerContext].
14. `src/editor/shell/component-prompt.ts:18` `return { kind: 'change', ui: { ...state.ui, componentPrompt: { node } } };` — o prompt abre no nó.
15. `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — o estado novo reúne documento, seleção, mensagem e `ui`.
16. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
17. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (o `ui` novo) [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/shell/component-prompt.ts:13` `if (node === undefined) return { kind: 'refused', message: message('status.needsSingleSelection') };` — sem `target` e sem seleção: recusa `status.needsSingleSelection`; com nó: segue.
- R2 `src/editor/shell/component-prompt.ts:16` `if (refused !== null) return { kind: 'refused', message: refused };` — nó que não pode virar componente: recusa a mensagem do `create`; pode: segue.
- R3 `src/editor/shell/component-prompt.ts:17` `if (state.ui.componentPrompt?.node === node) return { kind: 'change' };` — prompt já aberto nesse nó: `change` sem mudança; outro nó ou fechado: o passo 14 abre.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/shell/component-prompt.ts:11`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento, via argumentRefusal, createRefusal, commit), EST-L01-031 (a seleção, via run, handlerContext, commit), EST-L01-037 (o estado do editor, via handlerContext), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (o estado do editor, via publish), EST-L01-033 (a mensagem de recusa quando houver).

## Resultado
- **Estado final:** `ui.componentPrompt` fica com o nó escolhido (`src/editor/shell/component-prompt.ts:18`) ou o comando é recusado; o comando não é desfazível (`manifest/commands/design-system.json:770` `"undoable": false`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** o painel do prompt de componente abre no nó; a barra de status mostra a recusa quando houver.
- **DOM do canvas:** nada muda (o documento não é tocado).

## Regras
- G1: n/a — o comando não grava no documento nem numa camada (`src/editor/shell/component-prompt.ts:18`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:234` `'components.startCreate': openComponentPrompt,` — o menu de contexto e a command bar chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/shell/component-prompt.ts:18`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/editor/shell/component-prompt.ts:18`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/shell/component-prompt.ts:11`).

## Medições
- nenhuma
