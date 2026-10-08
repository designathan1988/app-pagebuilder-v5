# TRC-project.takeOverEditing

- **Chamada:** `src/app/commands.ts:345` `'project.takeOverEditing': takeOverEditing,`
- **Argumentos:** o tratador não recebe nada — devolve o Outcome sem ler estado nem argumento (`manifest/commands/project.json` `"id": "project.takeOverEditing",` com `"args": {}`).
- **Ramos que dependem dos argumentos:** nenhum — o comando não recebe argumento.

## Passos

1. `src/core/store/store.ts:685` `dispatch: (id, args, context) => {` — o despacho da porta entra aqui.
2. `src/core/store/store.ts:688` `return run(id, args, null, false, null, context);` — [lê: EST-L01-037 via run]
3. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
4. `src/core/project/tab-guard.ts:6` `export const takeOverEditing = registerHandler('project.takeOverEditing', () => ({ kind: 'change' as const, editing: 'take-over' as const }));` — o tratador devolve o Outcome `change` com `editing: 'take-over'`.
5. `src/core/store/store.ts:446` `if (outcome.kind === 'load' || outcome.kind === 'undo' || outcome.kind === 'redo' ||` — um efeito fora do estado assenta a sequência.
6. `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (outcome.patches?.length ?? 0) > 0))) {` — R1, a aba somente-leitura.
7. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — R2.
8. `src/core/store/store.ts:574` `if (outcome.editing === 'take-over') options.editing?.takeOver();` — a tomada da trava de edição. [lê: EST-L01-037 via takeOver]
9. `src/editor/store.ts:147` `editing: { takeOver },` — a porta da trava de edição do editor.

## Ramos

- R1 `src/core/store/store.ts:449` `if (options.readOnly?.() === true && (outcome.kind === 'load' || outcome.kind === 'confirm' || (outcome.kind === 'change' && (outcome.patches?.length ?? 0) > 0))) {` — aba somente-leitura: o Outcome é `change` sem patch, então a condição de patches não vale e o comando segue; um comando com patch seria recusado com `status.tabGuard.readOnly` (`src/core/store/store.ts:450` `const readOnly = message('status.tabGuard.readOnly');`).
- R2 `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — o Outcome não traz patch, seleção, ui nem mensagem: `changed` é falso e a store não grava nada; um Outcome com qualquer desses campos entraria em `commit` (`src/core/store/store.ts:526`).
- R3 `src/core/store/store.ts:574` `if (outcome.editing === 'take-over') options.editing?.takeOver();` — `editing: 'take-over'`: a porta `takeOver` do editor é chamada; outro valor: nada é chamado.

## Fronteiras assíncronas

- nenhuma — o tratador devolve o Outcome numa chamada síncrona (`src/core/project/tab-guard.ts:6` `export const takeOverEditing = registerHandler('project.takeOverEditing', () => ({ kind: 'change' as const, editing: 'take-over' as const }));`, sem `await`).

## Estado

- lê: EST-L01-037 (o estado do editor, via handlerContext, takeOver)
- escreve: nenhum

## Resultado

- **Estado final:** nada muda — o Outcome não traz patch, seleção, ui nem mensagem, então `changed` é falso (`src/core/store/store.ts:523`) e a store não escreve o estado.
- **Re-renderizado:** nada muda — `publish` só é chamado dentro de `if (changed)` (`src/core/store/store.ts:525`); nenhum assinante é chamado.
- **DOM do editor:** nada muda — nenhum estado é escrito e nenhum assinante notificado.
- **DOM do canvas:** nada muda — o documento não é tocado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).

## Regras

- G1: n/a — o comando não grava estilo nem valor de camada (`src/core/project/tab-guard.ts:6` `export const takeOverEditing = registerHandler('project.takeOverEditing', () => ({ kind: 'change' as const, editing: 'take-over' as const }));`).
- G2: ok `src/editor/store.ts:234` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/core/project/tab-guard.ts:6` `export const takeOverEditing = registerHandler('project.takeOverEditing', () => ({ kind: 'change' as const, editing: 'take-over' as const }));` — o único tratador do comando.
- G4: n/a — o comando não desenha nada sobre o canvas (`src/core/project/tab-guard.ts:6`).
- G5: n/a — o comando não desenha painel nem controle (`src/core/project/tab-guard.ts:6`).
- G6: n/a — o comando não escreve a seleção (`src/core/store/store.ts:523`).
- G7: n/a — o documento não é alterado (`src/core/store/store.ts:518` `const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);`).
- INT: n/a — `changed` é falso, então `commit` e a validação não rodam (`src/core/store/store.ts:525`).

## Limpeza

- nenhuma — o trecho não cria ouvinte, timer nem observador (`src/core/project/tab-guard.ts:6`).

## Medições

- nenhuma
