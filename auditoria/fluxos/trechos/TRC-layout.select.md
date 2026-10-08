# TRC-layout.select
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>`
- **Argumentos:** `{ regions: json, mode: enum [replace, add, toggle, cycle] }` — o manifesto (`manifest/commands/layout-composer.json:369` `"regions": {`, `manifest/commands/layout-composer.json:374` `"mode": {`).
- **Ramos que dependem dos argumentos:** R2 e R3 (o `regions` decide se as regiões existem; o `mode` decide a seleção nova).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o clique sobre a região).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só seleciona com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:575` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:576` `const { record, state } = composed(context);` — o contêiner composto e seu registro [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:577` `if (!Array.isArray(regions) || !regions.every((r) => typeof r === 'string' && findRegion(record.intent, r) !== undefined)) return refusedWith([{ code: 'unknown-region', params: {} }]);` — toda região pedida tem de existir (R2).
12. `src/modules/layout-composer/host/handlers.ts:578` `const selection = nextSelection(state.selection, regions as string[], mode as SelectionMode);` — a seleção nova é calculada [lê: EST-L01-037 via nextSelection].
13. `src/modules/layout-composer/gestures/structural.ts:144` `if (mode === 'add') return [...new Set([...current, ...ids])];` — `add` acrescenta; `toggle` alterna; os demais substituem.
14. `src/modules/layout-composer/host/handlers.ts:580` `return { kind: 'change', ui: withComposer(context.state.ui, { ...state, selection }), message: selection.length === 0 ? message('layout.status.noSelection') : message('layout.status.selected', { names }) };` — só o estado do editor muda [escreve: EST-L01-037 via run].
15. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:577` `if (!Array.isArray(regions) || !regions.every((r) => typeof r === 'string' && findRegion(record.intent, r) !== undefined)) return refusedWith([{ code: 'unknown-region', params: {} }]);` — região desconhecida: recusa `unknown-region`; conhecidas: segue.
- R3 `src/modules/layout-composer/gestures/structural.ts:144` `if (mode === 'add') return [...new Set([...current, ...ids])];` — o `mode` escolhe: `add` acrescenta, `toggle` alterna, qualquer outro substitui.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:574`); a porta é um clique de canvas, sem leitura de arquivo, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor e a seleção), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (estado do editor com a seleção nova).

## Resultado
- **Estado final:** a seleção do compositor passa a ser a calculada (`src/modules/layout-composer/host/handlers.ts:578`); a mensagem é `layout.status.selected` ou `layout.status.noSelection`; o documento não muda.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** o painel do compositor e a barra de status mostram a seleção e a mensagem.
- **DOM do canvas:** nada muda (o comando não emite patches).

## Regras
- G1: n/a — o comando não grava o documento nem uma camada; só devolve o estado do editor `src/modules/layout-composer/host/handlers.ts:580`.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>` — um só tratador; as portas enviam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve estado `src/modules/layout-composer/host/handlers.ts:580`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:580`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção é derivada da store.
- G7: n/a — o comando não emite patches; o DOM do canvas não é tocado `src/core/store/store.ts:542`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:574`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho só lê e escreve estado.
