# TRC-inspector.toggleSpacingLink
- **Chamada:** `src/app/commands.ts:395` `'inspector.toggleSpacingLink': toggleSpacingLink,`
- **Argumentos:** `{ box: enum[padding|margin] }` — a caixa cujo elo se liga ou desliga, como o manifesto declara (`manifest/commands/style.json:6050` `"id": "inspector.toggleSpacingLink",`).
- **Ramos que dependem dos argumentos:** R1 (a escolha guardada da pessoa vence a leitura dos lados).

## Passos
1. `src/app/commands.ts:395` `'inspector.toggleSpacingLink': toggleSpacingLink,` — a tabela liga o id ao tratador.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta do elo entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/inspector/spacing.ts:27` `export const toggleSpacingLink = registerHandler<'inspector.toggleSpacingLink', EditorUi>(` — o tratador é registrado para o estado do editor.
8. `src/editor/inspector/spacing.ts:31` `const node = styleSource(state);` — o elemento que a aba Estilo edita é achado [lê: EST-L01-030 via styleSource] [lê: EST-L01-037 via styleSource].
9. `src/editor/inspector/spacing.ts:32` `const linked = isLinked(state, box, rules);` — o elo lido para a caixa [lê: EST-L01-030 via isLinked] [lê: EST-L01-037 via isLinked].
10. `src/editor/inspector/spacing.ts:20` `const chosen = state.ui.spacingLinks?.[node.id]?.[box];` — a escolha guardada da pessoa para aquele elemento [lê: EST-L01-037 via handlerContext].
11. `src/editor/inspector/spacing.ts:23` `const values = sides.map((side) => storedValue(node, side, rules));` — sem escolha guardada, os quatro lados da caixa são lidos [lê: EST-L01-030 via storedValue].
12. `src/editor/inspector/spacing.ts:35` `const links = state.ui.spacingLinks ?? {};` — o mapa de elos guardados é tomado.
13. `src/editor/inspector/spacing.ts:36` `const ui: EditorUi = node === null ? state.ui : { ...state.ui, spacingLinks: { ...links, [node.id]: { ...(links[node.id] ?? {}), [box]: !linked } } };` — o elo daquele elemento e caixa é invertido no estado do editor [escreve: EST-L01-037 via run].
14. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` mudou, então o estado muda [lê: EST-L01-037 via run].
15. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
16. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (o `ui` novo) [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/inspector/spacing.ts:21` `if (chosen !== undefined) return chosen;` — a pessoa já escolheu o elo daquela caixa e elemento: vale a escolha; sem escolha: os quatro lados iguais decidem (`src/editor/inspector/spacing.ts:24` `return values.length > 0 && values[0] !== undefined && values.every((value) => value === values[0]);`).
- R2 `src/editor/inspector/spacing.ts:19` `if (node === null) return false;` — nenhum elemento editado: não ligado; com: segue.
- R3 `src/editor/inspector/spacing.ts:36` `const ui: EditorUi = node === null ? state.ui : { ...state.ui, spacingLinks: { ...links, [node.id]: { ...(links[node.id] ?? {}), [box]: !linked } } };` — sem elemento: o `ui` fica igual; com: o elo é invertido.
- R4 `src/editor/inspector/spacing.ts:40` `message: message(linked ? 'status.spacing.unlinked' : 'status.spacing.linked', { box: named }),` — estava ligado: a mensagem é `status.spacing.unlinked`; desligado: `status.spacing.linked`.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/spacing.ts:27`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-031 (seleção), EST-L01-037 (`ui.styleTarget`, `ui.spacingLinks`, regras), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (`ui.spacingLinks`), EST-L01-033 (mensagem).

## Resultado
- **Estado final:** `ui.spacingLinks[node][box]` fica com o oposto do elo anterior (`src/editor/inspector/spacing.ts:36`); o documento e a seleção não mudam (`src/core/store/store.ts:536` `      document: documentChanged ? applied.document : before.document,`). A mensagem é `status.spacing.linked` ou `status.spacing.unlinked`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra a mensagem; o botão do elo passa a marcar ligado ou desligado.
- **DOM do canvas:** nada muda — o comando não devolve patch e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento por um campo de digitação; escreve só o estado do editor (`src/editor/inspector/spacing.ts:36`).
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:395` `'inspector.toggleSpacingLink': toggleSpacingLink,` — as portas entregam a mesma caixa ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/spacing.ts:36`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/spacing.ts:36`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: n/a — o trecho não escreve no documento; só o `ui` muda (`src/editor/inspector/spacing.ts:36`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/spacing.ts:27`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
