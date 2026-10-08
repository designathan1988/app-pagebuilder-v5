# TRC-layout.reference
- **Chamada:** `src/modules/layout-composer/host/handlers.ts:847` `export const referenceLayout = registerHandler<'layout.reference', EditorUi>('layout.reference', (context, { file, opacity }) =>`
- **Argumentos:** `{ file?: string, opacity?: string }` — o manifesto (`manifest/commands/layout-composer.json:1513` `"file": {`, `manifest/commands/layout-composer.json:1518` `"opacity": {`).
- **Ramos que dependem dos argumentos:** R2 e R3 (o `file` vazio tira a imagem; o `opacity` muda a transparência).

## Passos
1. `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;` — os tratadores do módulo entram na tabela de comandos.
2. `src/editor/doors/door.tsx:145` `dispatch(entry.command.id, given);` — a porta entrega a intenção (o segmento de imagem, o campo de opacidade, o botão de tirar).
3. `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);` — a digitação pendente é gravada antes [lê: EST-L05a-001 via beforeCommand].
4. `src/editor/store.ts:238` `if (open === null) result = store.dispatch(id, args, at);` — a store do núcleo recebe a intenção.
5. `src/core/store/store.ts:410` `const invalid = argumentRefusal(id, command, args, state.document, layeredNow(at));` — os argumentos são lidos contra o manifesto.
6. `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — a disponibilidade é lida [lê: EST-L01-037 via layoutComposing].
7. `src/modules/layout-composer/host/handlers.ts:57` `(state) => composerOf(state.ui) !== null,` — só escolhe a referência com um contêiner composto [lê: EST-L01-037 via composerOf].
8. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — a store chama o tratador.
9. `src/modules/layout-composer/host/handlers.ts:848` `guarded(context, () => {` — o corpo passa por `guarded`.
10. `src/modules/layout-composer/host/handlers.ts:849` `const { record } = composed(context);` — o registro do compositor [lê: EST-L01-030 via composed] [lê: EST-L01-037 via composed].
11. `src/modules/layout-composer/host/handlers.ts:850` `const held = record.intent.reference;` — a imagem de referência guardada é lida [lê: EST-L01-030 via recordOf].
12. `src/modules/layout-composer/host/handlers.ts:851` `if (file === '') {` — um arquivo vazio tira a imagem (R2).
13. `src/modules/layout-composer/host/handlers.ts:853` `const outcome = operate(context, { kind: 'reference', reference: null });` — a imagem sai do grafo.
14. `src/modules/layout-composer/host/handlers.ts:856` `const path = file ?? held?.file;` — o caminho é o argumento, senão o guardado.
15. `src/modules/layout-composer/host/handlers.ts:858` `if (!imageFiles(context.state.document).some((f) => f.path === path)) throw new LayoutRefusal('reference');` — caminho que não é imagem do projeto: recusa `reference`.
16. `src/modules/layout-composer/host/handlers.ts:859` `let alpha = held?.opacity ?? REFERENCE_OPACITY;` — a opacidade parte da guardada ou do padrão.
17. `src/modules/layout-composer/host/handlers.ts:862` `if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new LayoutRefusal('value', { value: opacity, property: context.words('layout.door.referenceOpacity' as MessageId) });` — opacidade fora de 0..100: recusa `value` (R3).
18. `src/modules/layout-composer/host/handlers.ts:865` `const outcome = operate(context, { kind: 'reference', reference: { file: path, box: held?.box ?? record.intent.viewport, opacity: alpha, locked: true } });` — a referência entra no grafo.
19. `src/modules/layout-composer/host/handlers.ts:165` `return { patches: [...released, { op: 'replace', path: [...path], value: next }] };` — o contêiner é escrito de novo [escreve: EST-L01-030 via run].
20. `src/core/store/store.ts:500` `own = applyPatches(before.document, outcome.patches ?? []);` — a store aplica os patches [escreve: EST-L01-030 via applyPatches].
21. `src/core/store/store.ts:551` `const committed = commit(next, id);` — o estado novo é validado [lê: EST-L01-030 via commit] [lê: EST-L01-031 via commit].
22. `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);` — a store publica o estado [escreve: EST-L01-030 via publish] [escreve: EST-L01-033 via publish].

## Ramos
- R1 `src/core/store/store.ts:416` `if (predicate && !predicate.test(state, layeredNow(at), args)) {` — sem contêiner composto: recusa `layout.inactive`; composto: segue.
- R2 `src/modules/layout-composer/host/handlers.ts:851` `if (file === '') {` — `file` vazio: a imagem guardada sai (ou recusa `no-reference` se não há nenhuma); `file` com valor: a imagem entra.
- R3 `src/modules/layout-composer/host/handlers.ts:862` `if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new LayoutRefusal('value', { value: opacity, property: context.words('layout.door.referenceOpacity' as MessageId) });` — opacidade fora de 0..100: recusa `value`; dentro ou ausente: segue.

## Fronteiras assíncronas
- nenhuma — o tratador é síncrono (`src/modules/layout-composer/host/handlers.ts:847`); a leitura dos pixels da imagem acontece no painel (`src/modules/layout-composer/ui/panel.tsx`), fora deste trecho, e o comando recebe só o caminho.

## Estado
- Lê: EST-L01-030 (documento), EST-L01-037 (estado do editor com o compositor), EST-L05a-001 (digitação pendente).
- Escreve: EST-L01-030 (documento do contêiner com a referência), EST-L01-037 (estado do editor).

## Resultado
- **Estado final:** o grafo guarda ou perde a imagem de referência (`src/modules/layout-composer/host/handlers.ts:865`); a mensagem é `layout.status.referenced` ou `layout.status.unreferenced`.
- **Re-renderizado:** os assinantes ouvem `publish` (`src/core/store/store.ts:542`).
- **DOM do editor:** a barra de status mostra a mensagem; o painel do compositor mostra a imagem escolhida.
- **DOM do canvas:** o contêiner é reescrito com a referência (a imagem fica sob as regiões) (`src/modules/layout-composer/host/handlers.ts:165`).

## Regras
- G1: ok `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o tratador recebe o contexto capturado.
- G2: ok `src/editor/store.ts:235` `const at = context ?? beforeCommand(id, args, changesDocument);`
- G3: ok `src/modules/layout-composer/host/handlers.ts:847` `export const referenceLayout = registerHandler<'layout.reference', EditorUi>('layout.reference', (context, { file, opacity }) =>` — um só tratador; as portas enviam só a intenção.
- G4: n/a — o comando não desenha sobre o canvas; devolve patches `src/modules/layout-composer/host/handlers.ts:165`.
- G5: n/a — o comando não altera a geometria de painel nenhum `src/modules/layout-composer/host/handlers.ts:866`.
- G6: ok `src/core/store/store.ts:522` `const chosen = outcome.selection ?? before.selection;` — a seleção passa pela store.
- G7: ok `src/core/store/store.ts:567` `publish(committed, documentChanged ? applied.applied : []);`
- INT: ok `src/core/store/store.ts:273` `const problems = validateDocument(next.document, next.selection, rules);`

## Limpeza
- nada a remover — o trecho não cria ouvinte, timer nem observador (`src/modules/layout-composer/host/handlers.ts:847`).

## Medições
- nenhuma — nenhum passo chama API de dimensão, posição, rolagem, zoom, estilo calculado, elemento sob um ponto nem ordem de foco; o trecho lê o grafo e devolve patches.
