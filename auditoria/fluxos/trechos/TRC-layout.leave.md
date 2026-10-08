# TRC-layout.leave
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {`
- **Argumentos:** `{}` — o manifesto (`manifest/commands/layout-composer.json:127` `"args": {},`), sem campos.
- **Ramos que dependem dos argumentos:** nenhum (o comando não tem argumento; os ramos dependem do estado do compositor).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:144` `dispatch(entry.command.id, given);` — a porta entrega a intenção.
3. `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:226` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:55` `export const layoutComposing = registerPredicate<EditorUi>(` — o predicado do domínio.
8. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só fecha quando um contêiner está composto [lê: EST-L01-037 via composerOf].
9. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
10. `src/modules/layout-composer/host/handlers.ts:442` `const composer = composerOf(state.ui);` — o estado do compositor é lido [lê: EST-L01-037 via composerOf].
11. `src/modules/layout-composer/host/handlers.ts:444` `const left = withComposer(state.ui, null);` — o compositor é retirado [escreve: EST-L01-037 via withComposer].
12. `src/modules/layout-composer/host/handlers.ts:445` `const ui = folded ? showPanel(left, LAYERS) : left;` — as Camadas voltam se o compositor as recolheu.
13. `src/modules/layout-composer/host/handlers.ts:448` `return { kind: 'change', ui: ui.panels.sidebarView === PANEL ? showPanel(ui, (composer?.back ?? BACK) as typeof BACK) : ui, message: message('layout.status.closed') };` — a barra lateral volta à vista anterior [escreve: EST-L01-037 via showPanel].
14. `src/core/store/store.ts:548` `const changed = documentChanged || !deepEqual(before.selection, next.selection) || next.ui !== before.ui || next.message !== before.message;` — a mudança só de estado do editor conta.
15. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-037 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto o predicado falha: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:443` `const folded = composer?.layers === true;` — o compositor recolheu as Camadas: `showPanel(left, LAYERS)` as reabre; não recolheu: a barra lateral fica como está.
- R3 `src/modules/layout-composer/host/handlers.ts:448` `return { kind: 'change', ui: ui.panels.sidebarView === PANEL ? showPanel(ui, (composer?.back ?? BACK) as typeof BACK) : ui, message: message('layout.status.closed') };` — a barra lateral mostrava o painel do compositor: volta à vista anterior (`back`); mostrava outra: fica.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:441`); a porta `layout-done` não lê arquivo nem área de transferência, então `dispatch` roda direto (`src/editor/doors/door.tsx:144`).

## Estado
- Lê: EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-037 (estado do editor sem o compositor e com a barra lateral restaurada).

## Resultado
- **Estado final:** o compositor deixa de estar composto; a barra lateral volta à vista anterior (`src/modules/layout-composer/host/handlers.ts:448`); a mensagem é `layout.status.closed`; o documento não muda.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** o painel do compositor fecha e o de Camadas reabre quando fora recolhido (`src/modules/layout-composer/host/handlers.ts:445`).
- **DOM do canvas:** nada muda (o comando não emite patches).

## Regras
- G1: n/a — o comando não grava o documento nem uma camada; só devolve o estado do editor `src/modules/layout-composer/host/handlers.ts:448`.
- G2: ok `src/editor/store.ts:223` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {` — um só tratador; as portas enviam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve estado `src/modules/layout-composer/host/handlers.ts:448`.
- G5: n/a — o comando troca a visão da barra lateral, não a geometria de um painel `src/modules/layout-composer/host/handlers.ts:445`.
- G6: n/a — o comando não escreve a seleção; a store mantém a anterior `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;`.
- G7: n/a — o comando não emite patches; o DOM do canvas não é tocado `src/core/store/store.ts:542`.
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:441`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho só lê e escreve estado.
