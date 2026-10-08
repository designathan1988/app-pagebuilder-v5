# TRC-field.cancel
- **Chamada:** `src/app/commands.ts:429` `'field.cancel': cancelField,`
- **Argumentos:** `{ property: property }` — a propriedade que o campo edita, para o recado, como o manifesto declara (`manifest/commands/style.json:10055` `"id": "field.cancel",`).
- **Ramos que dependem dos argumentos:** nenhum — o `property` só nomeia a propriedade no recado.

## Passos
1. `src/app/commands.ts:429` `'field.cancel': cancelField,` — a tabela liga o id ao tratador.
2. `src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);` — o Esc do campo entrega a intenção.
3. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto [lê: EST-L01-030 via argumentRefusal].
5. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade `always` é lida [lê: EST-L01-030 via run] [lê: EST-L01-037 via run].
6. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
7. `src/editor/inspector/number-field.ts:136` `export const cancelField = registerHandler('field.cancel', ({ state, rules }, { property }) => {` — o tratador recebe o contexto e a propriedade.
8. `src/editor/inspector/number-field.ts:137` `  const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o elemento principal é achado [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate].
9. `src/editor/inspector/number-field.ts:139` `  return { kind: 'change', message: message('status.field.cancelled', { property: propertyName(property, rules), name: primary.node.name }) };` — devolve `change` só com o recado; nada é escrito.
10. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do recado entra no estado [escreve: EST-L01-033 via run].
11. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a mensagem mudou, então o estado muda [lê: EST-L01-031 via run] [lê: EST-L01-033 via run] [lê: EST-L01-037 via run].
12. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
13. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado (a mensagem nova) [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/editor/inspector/number-field.ts:138` `  if (!primary) return { kind: 'change' };` — sem elemento principal: `change` sem mensagem; com: segue para o passo 9.
- R2 `src/editor/inspector/number-field.ts:139` `  return { kind: 'change', message: message('status.field.cancelled', { property: propertyName(property, rules), name: primary.node.name }) };` — com elemento: a mensagem é `status.field.cancelled`; o documento fica como estava.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/inspector/number-field.ts:136`) e não há `await`, timer nem ouvinte nos passos.

## Estado
- Lê: EST-L01-030 (o documento, via argumentRefusal, run, locate, commit), EST-L01-031 (a seleção, via run, locate, commit), EST-L01-033 (a mensagem, via run), EST-L01-037 (o estado do editor, via run), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-033 (a mensagem, via run, publish).

## Resultado
- **Estado final:** o documento, a seleção e o `ui` ficam como estavam; muda só a mensagem, que passa a ser `status.field.cancelled` (`src/core/store/store.ts:515`). O campo volta a mostrar o valor do documento.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`).
- **DOM do editor:** a barra de status mostra `status.field.cancelled`; o campo passa a exibir o valor que o documento guarda.
- **DOM do canvas:** nada muda — o comando não devolve patch e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho cancela a digitação e não grava no documento; devolve só um recado (`src/editor/inspector/number-field.ts:139`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/app/commands.ts:429` `'field.cancel': cancelField,` — o Esc do campo entrega a mesma `property` ao mesmo tratador.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/editor/inspector/number-field.ts:139`).
- G5: n/a — o comando não altera a geometria de painel nem de barra (`src/editor/inspector/number-field.ts:139`).
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: n/a — o trecho não escreve no documento; só a mensagem muda (`src/editor/inspector/number-field.ts:139`).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/inspector/number-field.ts:136`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco.
