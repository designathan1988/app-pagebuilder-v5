# TRC-components.closePrompt
- **Chamada:** `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,`
- **Argumentos:** `{}` — o comando não toma argumentos (`manifest/commands/design-system.json:880` `"args": {},`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não toma argumentos.

## Passos
1. `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta de painel entrega a intenção.
3. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — a porta de atalho (Esc do prompt) entrega a intenção.
4. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/shell/component-prompt.ts:21` `export const closeComponentPrompt = registerHandler<'components.closePrompt', EditorUi>('components.closePrompt', ({ state }) =>` — o tratador recebe o estado.
8. `src/editor/shell/component-prompt.ts:22` `state.ui.componentPrompt === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, componentPrompt: null } },` — com o prompt aberto, devolve o `ui` com `componentPrompt` nulo; fechado, devolve `change` sem mudança.
9. `src/core/store/store.ts:535` `const ran: StoreState<Ui> = {` — o estado novo reúne documento, seleção, mensagem e `ui`.
10. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
11. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (o `ui` novo) [escreve: EST-L01-037 via publish].

## Ramos
- R1 `src/editor/shell/component-prompt.ts:22` `state.ui.componentPrompt === null ? { kind: 'change' } : { kind: 'change', ui: { ...state.ui, componentPrompt: null } },` — prompt já fechado (`null`): `change` sem mudança; aberto: o `ui` fica com `componentPrompt` nulo.
- R2 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — com o `ui` novo, `changed` é verdadeiro e a store publica; sem mudança, nada é publicado.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/shell/component-prompt.ts:21`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento, via argumentRefusal, commit), EST-L01-031 (a seleção, via commit), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (o estado do editor, via publish).

## Resultado
- **Estado final:** `ui.componentPrompt` fica nulo (`src/editor/shell/component-prompt.ts:22`); o comando não é desfazível (`manifest/commands/design-system.json:888` `"undoable": false`).
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** o painel do prompt de componente fecha.
- **DOM do canvas:** nada muda (o documento não é tocado).

## Regras
- G1: n/a — o comando não grava no documento nem numa camada (`src/editor/shell/component-prompt.ts:22`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,` — o botão e o Esc do prompt chegam ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/shell/component-prompt.ts:22`).
- G5: n/a — o comando não altera a geometria de painel nenhum (`src/editor/shell/component-prompt.ts:22`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/shell/component-prompt.ts:21`).

## Medições
- nenhuma
