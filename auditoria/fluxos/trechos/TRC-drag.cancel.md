# TRC-drag.cancel
- **Chamada:** `src/app/commands.ts:369` `'drag.cancel': cancelDrag,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:371` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `always` (`manifest/commands/structure.json:373` `"predicate": "always",`). [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'drag.cancel'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/drag/drag-session.ts:124` `export const cancelDrag = registerHandler<'drag.cancel', EditorUi>('drag.cancel', ({ state }) => ({` — o tratador recebe o estado. [lê: EST-L01-037 via handlerContext]
5. `src/editor/drag/drag-session.ts:126` `  ui: { ...state.ui, drag: { ...state.ui.drag, cancels: state.ui.drag.cancels + 1 } },` — a contagem de cancelamentos do arraste cresce um. [escreve: EST-L01-037 via run]
6. `src/editor/drag/drag-session.ts:127` `  message: message('status.drag.cancelled'),` — o recado do cancelamento.
7. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store adota o estado do editor. [escreve: EST-L01-037 via run]
8. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
9. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
10. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado sem remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/editor/drag/drag-session.ts:126` `  ui: { ...state.ui, drag: { ...state.ui.drag, cancels: state.ui.drag.cancels + 1 } },` — o tratador não decide por valor algum: sempre acrescenta um a `cancels`.
- R2 `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — como `ui` é sempre um objeto novo, `changed` é verdadeiro e o estado é publicado.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/drag/drag-session.ts:124`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`). O dono do ponteiro lê `cancels` para terminar o arraste, fora do trecho.

## Estado
- lê: EST-L01-030, EST-L01-037, EST-L05a-001
- escreve: EST-L01-037

## Resultado
- **Estado final:** EST-L01-037 com `ui.drag.cancels` um a mais (`src/editor/drag/drag-session.ts:126`); o documento e a seleção não mudam; a mensagem `status.drag.cancelled` (`src/editor/drag/drag-session.ts:127`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o recado; o dono do ponteiro, ao ver a contagem nova, termina o arraste do seu gesto.
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui.drag.cancels` (`src/editor/drag/drag-session.ts:126`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:369` `'drag.cancel': cancelDrag,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; a terminação do arraste é do dono do ponteiro, fora do trecho.
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/editor/drag/drag-session.ts:127`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/drag/drag-session.ts:124`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o tratador lê o estado e devolve `ui` (`src/editor/drag/drag-session.ts:126`).
