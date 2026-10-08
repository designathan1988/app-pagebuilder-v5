# TRC-drag.levelUp
- **Chamada:** `src/app/commands.ts:367` `'drag.levelUp': levelUp,`
- **Argumentos:** nenhum campo — o tipo é `Record<string, never>`, `manifest/commands/structure.json:293` `"args": {},`; o tratador recebe só o contexto.
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a store do editor grava a digitação pendente antes do comando. [lê: EST-L05a-001 via beforeCommand]
2. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é `always` (`manifest/commands/structure.json:295` `"predicate": "always",`). [lê: EST-L01-030 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador sob `'drag.levelUp'`. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/editor/drag/drag-session.ts:103` `  const drag = live;` — o arraste vivo que o dono do ponteiro conduz. [lê: EST-L05b-019 via levelUp]
5. `src/editor/drag/drag-session.ts:104` `  if (drag === null || drag.base === null) return { kind: 'change' };` — sem arraste vivo, ou sem proposta (fora da página): nada muda.
6. `src/editor/drag/drag-session.ts:105` `  const levels = ladder(state.document, drag.dragged, drag.base);` — a escada de propostas, do nível do ponteiro para cima. [lê: EST-L01-030 via ladder]
7. `src/editor/drag/drag-session.ts:106` `  const shown = shownLevel(state.ui.drag, drag, levels);` — o nível mostrado agora, preso ao topo da escada. [lê: EST-L01-037 via shownLevel]
8. `src/editor/drag/drag-session.ts:107` `  const next = levels[shown + 1];` — o nível de cima na escada.
9. `src/editor/drag/drag-session.ts:108` `  if (next === undefined) return { kind: 'refused', message: message('status.drop.topLevel') };` — no topo da escada: recusa `status.drop.topLevel` e o nível fica.
10. `src/editor/drag/drag-session.ts:109` `  return { kind: 'change', ui: atLevel(state.ui, drag.id, shown + 1), message: where(state.document, next) };` — o resultado leva o nível daquele arraste e o recado do lugar. [escreve: EST-L01-037 via run] [escreve: EST-L01-033 via run]
11. `src/core/store/store.ts:544` `      ui: outcome.ui ?? before.ui,` — a store adota o estado do editor. [escreve: EST-L01-037 via run]
12. `src/core/store/store.ts:548` `    const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o `ui` novo torna `changed` verdadeiro.
13. `src/core/store/store.ts:551` `      const committed = commit(next, id);` — o estado novo é validado e fixado. [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit]
14. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado sem remendos. [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish]

## Ramos
- R1 `src/editor/drag/drag-session.ts:104` `  if (drag === null || drag.base === null) return { kind: 'change' };` — sem arraste vivo, ou sem proposta (fora da página): `{ kind: 'change' }` sem `ui` nem mensagem; com arraste e proposta: segue.
- R2 `src/editor/drag/drag-session.ts:108` `  if (next === undefined) return { kind: 'refused', message: message('status.drop.topLevel') };` — já no topo da escada (a raiz da página): recusa; senão, sobe um nível.
- R3 `src/editor/drag/drag-session.ts:82` `  return Math.max(0, Math.min(state.level, levels.length - 1));` — o nível mostrado nunca passa o topo da escada, então uma descida sempre volta um nível do que é desenhado.
- R4 `src/editor/drag/drag-session.ts:81` `  if (state.drag !== drag.id) return 0;` — um arraste novo (o `drag` do estado não é o dele) começa no nível 0; o mesmo arraste usa o nível guardado.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/editor/drag/drag-session.ts:102`); a porta entrega a intenção e o `dispatch` roda direto (`src/core/store/store.ts:413`). O dono do ponteiro redesenha a proposta de um assinante fora do trecho.

## Estado
- lê: EST-L01-030, EST-L01-037, EST-L05b-019, EST-L05a-001
- escreve: EST-L01-033, EST-L01-037

## Resultado
- **Estado final:** EST-L01-037 com `ui.drag.drag` no arraste vivo e `ui.drag.level` um acima (`src/editor/drag/drag-session.ts:98` `const atLevel = (ui: EditorUi, drag: number, level: number): EditorUi => ({ ...ui, drag: { ...ui.drag, drag, level } });`); o documento e a seleção não mudam; a mensagem diz o lugar (`src/editor/drag/drag-session.ts:95` `  return message(proposal.placement === 'before' ? 'status.drop.before' : proposal.placement === 'after' ? 'status.drop.after' : 'status.drop.inside', { name });`).
- **Re-renderizado:** os assinantes são avisados por `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`.
- **DOM do editor:** a barra de status mostra o lugar do pouso; o dono do ponteiro redesenha a proposta do nível novo.
- **DOM do canvas:** nada muda — o resultado não leva `patches` e `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` é falso.

## Regras
- G1: n/a — o comando não grava no documento nem num contexto de edição; escreve `ui.drag` (`src/editor/drag/drag-session.ts:109`).
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes.
- G3: ok `src/app/commands.ts:367` `'drag.levelUp': levelUp,` — um só tratador; as portas mandam só a intenção vazia.
- G4: n/a — o comando não desenha sobre o canvas; a proposta é desenhada pelo dono do ponteiro, fora do trecho.
- G5: n/a — o comando não mede nem desenha painel ou barra (`src/editor/drag/drag-session.ts:109`).
- G6: n/a — o comando não escreve a seleção; o resultado não leva `selection` (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`).
- G7: n/a — o comando não muda o documento; o `documentChanged` é falso (`src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — sem `patches` o documento não é tocado (`src/core/store/store.ts:500` `      own = applyPatches(before.document, outcome.patches ?? []);` aplica zero remendos).

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/editor/drag/drag-session.ts:102`).

## Medições
- nenhuma — nenhum passo usa dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; a escada e o nível vêm do modelo e do estado (`src/editor/drag/drag-session.ts:105`).
