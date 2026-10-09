# Verificação — grupo A (defeitos do núcleo): DEF-0001, DEF-0508, DEF-0509, DEF-0510, DEF-0511; DCS-009, DCS-013, DCS-015, DCS-016

Data: 2026-10-09. Árvore de trabalho em `HEAD` = `ae24ee7e` (ramo `estrutura/edicao-e-espaco`).

Os cinco defeitos foram corrigidos todos no mesmo commit, `253b9a36` ("Mecanismos de detecção e defeitos da fase 8 (etapas 1 a 3)"); o código de antes é `253b9a36^` = `8c71d650` ("Estado de partida"). Depois de `253b9a36`, nenhum commit tocou `src/editor/test-boot.ts`, `src/core/history/history.ts`, `src/core/history/transaction.ts`, `src/core/store/store.ts`, `src/editor/input/pointer/machine.ts`, `src/editor/input/pointer/events.ts`, `src/editor/view/edit-context.ts`, `src/editor/timeline/playhead.ts` nem `tools/runner/model/harness.ts` (`git log --format=%h 253b9a36..HEAD -- <arquivo>` vazio para cada um); `src/editor/store.ts` mudou em `549f5f37` e `faab19e4`, `src/core/style/codecs.ts` em `880a3b8c`.

Linha de base dos detectores, sem mutante: `npx vitest run --config tools/runner/model/vitest.config.ts` → `Test Files  22 passed (22)`, `Tests  61 passed (61)`.

## DEF-0001 — quadro do boot de teste desenhado não é cancelado

**Veredito:** confirmado (com dois achados sobre o alcance e o detector).

**Provas:**
- Código de antes (`git show 253b9a36^:src/editor/test-boot.ts`): a função devolvia `void`, `settle` reagendava-se com `else target.requestAnimationFrame(settle);` sem guardar o identificador, e a espera das fontes era `void target.document.fonts.ready.then(() => target.requestAnimationFrame(settle));`. Não havia `cancelAnimationFrame` no arquivo. A causa descrita confere.
- Código de agora:
  - `src/editor/test-boot.ts:105` `export function runDrawnTestBoot(store: EditorStore, boot: TestBoot, results: TestBootResult[], target: Window = window): () => void {`
  - `src/editor/test-boot.ts:114` `frame = null;` e `src/editor/test-boot.ts:115` `if (stopped) return;`
  - `src/editor/test-boot.ts:122` `else frame = target.requestAnimationFrame(settle);`
  - `src/editor/test-boot.ts:125` `if (!stopped) frame = target.requestAnimationFrame(settle);`
  - `src/editor/test-boot.ts:129` `if (frame !== null) target.cancelAnimationFrame(frame);`
  As citações do registro conferem linha a linha.
- Chamadores: só `src/main.tsx:86` `if (__BUILDER_TEST_PORT__ && boot !== null) runDrawnTestBoot(store, boot, booted);` (fora dele, só o detector). O valor devolvido é descartado, como o registro declara.
- Detector `tools/runner/model/lifetime.test.ts:54` `it('o boot de teste desenhado, parado no meio, não deixa quadro agendado nem roda os comandos (DEF-0001)', async () => {`: sem mutante, o arquivo passa (2 de 2 na corrida completa acima).
- Mutantes (`BUILDER_MUTANT=<id> npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/lifetime.test.ts`):
  - M41 (tira a linha 129): `Tests  1 failed | 1 passed (2)`, `AssertionError: parado entre dois quadros, o quadro pendente é cancelado: expected 1 to be +0`.
  - M42 (tira o `if (!stopped)` da linha 125): `Tests  1 failed | 1 passed (2)`, `AssertionError: parado antes das fontes, nenhum quadro é pedido: expected 1 to be +0`.
  O código de antes não tinha função de parada; nenhum mutante o reproduz inteiro (com ele o teste cairia já em `tools/runner/model/lifetime.test.ts:60` `expect(typeof stopEarly, 'runDrawnTestBoot devolve como parar').toBe('function');`). M41 e M42 reproduzem cada um a falta de uma das duas partes da parada.
- Regressão: o diff de `src/editor/test-boot.ts` em `253b9a36` só acrescenta o identificador, a marca `stopped` e a função devolvida; o laço (`STILL_FRAMES`, `MOST_FRAMES`, a medida do palco, o `runTestBoot` final) é o mesmo. Nenhuma regressão encontrada.
- Proibições: nenhuma em `src/editor/test-boot.ts`.

**Achados:**
1. A correção não muda nada que o app execute: o único chamador (`src/main.tsx:86`) descarta a parada, e nenhum caminho do app desmonta o boot. O "Efeito" do registro ("um desmonte durante a espera deixa o quadro seguinte agendado") não tem entrada no app que o produza; a correção prepara a parada para quem a quiser. O registro diz isso na Correção, então não é divergência, mas o defeito é de forma e não de comportamento observado.
2. A linha `src/editor/test-boot.ts:115` `if (stopped) return;` não é coberta pelo detector: no caso "parado entre dois quadros", a parada já apaga o quadro do mapa da janela falsa (`tools/runner/model/lifetime.test.ts:34` `cancelAnimationFrame: (id: number) => void frames.delete(id),`), então `late.runFrames()` não roda nada com ou sem a linha 115. E a afirmação `tools/runner/model/lifetime.test.ts:73` `expect(results, 'parado, os comandos desenhados não rodam').toEqual([]);` é vazia: a janela falsa devolve `querySelector: () => null` (linha 29), o tamanho fica `''`, `still` nunca sobe, e os comandos só rodariam no 120.º quadro; com dois quadros rodados, `results` fica vazio mesmo sem parada nenhuma. Efeito: tirar a linha 115 não é acusado (conclusão pela leitura do teste; não criei mutante, porque as instruções proíbem editar `tools/`).
3. O detector usa `as never` para passar o boot e as constantes (`tools/runner/model/lifetime.test.ts:59` `... drawn: [{ command: 'view.zoomIn', args: {} }] } as never, results, early.target);` e `tools/runner/model/lifetime.test.ts:18` `numberConstant('autosave.idleWait' as never)`), um molde que cala o tipo da mesma forma que `any`. Está no detector, não no app.

## DEF-0508 — rajada fundida que volta ao documento de antes deixa entrada vazia

**Veredito:** confirmado.

**Provas:**
- Código de antes (`git show 253b9a36^:src/core/history/history.ts`): `record(history, tx, within)` montava `merged` e devolvia `return { past: [...history.past.slice(0, -1), merged], future: [] };` sem olhar o que a entrada fundida faz; a store (`git show 253b9a36^:src/core/store/store.ts`) chamava `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null);` e `lastMergeable = key;`. A causa descrita confere, e o cabeçalho que o registro cita existe: `src/core/history/history.ts:3` `// A new transaction empties the redo stack; a command that changes nothing records no entry (the store never`.
- Correção, no ponto único que funde entradas:
  - `src/core/history/history.ts:24` `export function record(history: HistoryState, tx: Transaction, within: number | null, document?: DocumentJson): HistoryState {`
  - `src/core/history/history.ts:40` `if (document !== undefined && deepEqual(applyPatches(document, merged.inverses).document, document)) return { past: history.past.slice(0, -1), future: [] };`
  - `src/core/store/store.ts:531` `history = record(before.history, tx, key !== null && key === previousMergeable ? within : null, applied.document);`
  - `src/core/store/store.ts:533` `lastMergeable = history.past.length < before.history.past.length ? null : key;`
  As citações do registro conferem. `record` é chamado só em `src/core/store/store.ts:531` (as entradas de grupo e de gesto são montadas à parte, com `coalesceKey: null`), então o ramo novo só é alcançado pelo despacho com janela de fusão, como o registro diz.
- A conferência de "não muda nada" está certa: `merged.inverses` aplicados ao documento que a transação deixa (`applied.document`) dão o documento de antes da entrada; igual ao de agora, a entrada não muda nada.
- Detectores, sem mutante: `history.test.ts` e `style.test.ts` passam (dentro da corrida completa, 61 de 61).
- Mutantes (`BUILDER_MUTANT=<id> npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/history.test.ts tools/runner/model/style.test.ts`):
  - M28 (tira a linha 40): `Tests  1 failed | 2 passed (3)`; falha `o histórico e a seleção seguem o modelo do manifesto em sequências aleatórias`, contraexemplo `["aurora",Vaivém(0)]`, causa `builder-history-rules: an entry merged that changes nothing` (a invariante do MEC-03, `src/core/history/invariants.ts:43` `if (deepEqual(undone, after.document)) out.push(`${HISTORY_RULES_MARK}: an entry ${how} that changes nothing`);`).
  - M29 (`lastMergeable = key;`): `Tests  1 failed | 2 passed (3)`; contraexemplo `["aurora",Vaivém(0)]`, causa `o documento mudou e nenhuma entrada nova apareceu, sem fusão que o manifesto permita`.
  M28 e M29 juntos reproduzem o código de antes nas duas linhas que mudaram (o parâmetro `document` sem uso equivale à linha 40 ausente).
- O detector prova o que diz: a regra do modelo é independente do código do histórico (`tools/runner/model/harness.ts:156` `const nothing = deepEqual(state.document, top.before.document);` e `tools/runner/model/harness.ts:157` `demand(!nothing || grew === -1, 'uma fusão que volta ao documento de antes da entrada deixou uma entrada que não muda nada');`), e o passo `Vaivém` (`tools/runner/model/history.test.ts:25`) monta exatamente a rajada que volta (seta para cima, para baixo, para cima, depois de um comando no meio).
- Regressão: o diff de `record` só acrescenta o ramo da linha 40 e o campo `context`; o ramo de entrada nova (linha 43) e a fusão que muda o documento (linha 41) são os mesmos. Depois de a entrada sair, a pilha de refazer fica vazia (já estava, porque o primeiro passo da rajada a esvaziou) e o desfazer seguinte desfaz a entrada anterior, como esperado. Nenhuma regressão encontrada.
- Proibições: nenhuma em `src/core/history/history.ts` nem nas linhas mudadas de `src/core/store/store.ts`.

**Achados:**
1. Sem defeito no código. Observação sobre a invariante do MEC-03: a saída da entrada é aceita pela regra pensada para a sequência cancelada (`src/core/history/invariants.ts:36` `const rolledBack = now.past.length < was.past.length && now.past.every((tx, i) => tx === was.past[i]);`), que aceita qualquer corte do fim do passado; quem distingue "saiu porque voltou ao documento de antes" de "saiu sem motivo" é só o modelo (`tools/runner/model/harness.ts:158` `demand(nothing || grew === 0, 'uma fusão que muda o documento tirou a entrada do histórico');`), não a invariante que roda no app de desenvolvimento.

## DEF-0509 — longhands com codec declarado e não registrado recusam todo valor

**Veredito:** confirmado (as citações de linha do registro em `src/core/style/codecs.ts` estão 20 linhas defasadas; o detector não prova a aceitação de seis dos oito longhands).

**Provas:**
- Código de antes: `git show 253b9a36^:src/core/style/codecs.ts | grep -c "position-axis\|'grid-line'\|property-list\|keyword-list"` → `0`; os quatro codecs não existiam, e o manifesto os marcava `"status": "planned"` (diff de `manifest/references.json` em `253b9a36`, as quatro entradas passam a `"registered"`). Com o codec ausente, `src/core/style/set.ts:217` `return facts === undefined ? null : codecOf(facts.codec);` dá nulo e `src/core/style/set.ts:260` `if (codec === null) return null;` recusa todo texto. A causa confere.
- O manifesto declara os codecs e as portas de `style.set` (lido de `manifest/properties.json`): `grid-column-start`, `grid-column-end`, `grid-row-start`, `grid-row-end` com `"codec":"grid-line"`; `background-position-x` e `-y` com `"codec":"position-axis"`; `transition-property` com `"codec":"property-list"`; `transition-behavior` com `"codec":"keyword-list"`; cada um com uma porta `style.set#inspector-…` na lista `doors`.
- Correção, no registro único de codecs (linhas de hoje):
  - `src/core/style/codecs.ts:689` `const gridLine = registerCodec('grid-line', { read: (text, facts) => (text.includes('/') ? null : cssText(text, facts)), write: writeCssText });`
  - `src/core/style/codecs.ts:690` `const propertyList = registerCodec('property-list', { read: cssText, write: writeCssText });`
  - `src/core/style/codecs.ts:691` `const keywordList = registerCodec('keyword-list', {`
  - `src/core/style/codecs.ts:701` `const positionAxis = registerCodec('position-axis', { read: (text, facts) => lengthPercentage.read(text, facts), write: (value) => lengthPercentage.write(value) });`
  - os quatro no mapa `CODECS` (diff de `253b9a36`: `gridLine,`, `propertyList,`, `keywordList,`, `positionAxis,`); `src/core/style/codecs.ts:959` `export function codecOf(id: string): Codec | null {`.
- Os valores que o registro diz recusados antes, lidos hoje por `readValue` com a porta do lexer (`tools/runner/css-lexer-port.ts`), num teste de rascunho fora do projeto (scratchpad, configuração própria apontando para o projeto):
  - `background-position-x`: `0px` → `"0px"`, `6px` → `"6px"`, `.5dvw` → `"0.5dvw"`, `left` → `"left"`, `50%` → `"50%"`, `10` → `"10px"`; `top` → recusa (palavra do outro eixo, certo).
  - `background-position-y`: `top`, `bottom`, `25%` aceitos; `left` recusado (certo).
  - `grid-column-start`: `span 2`, `2`, `-1`, `auto`, `a` aceitos; `1 / 3` e `span` recusados (certo).
  - `transition-property`: `all`, `none`, `opacity, transform` aceitos; `1px` recusado.
  - `transition-behavior`: `normal`, `allow-discrete`, `normal, allow-discrete`, `Normal` (→ `normal`) aceitos; `x` e `` recusados.
- Detector, sem mutante: `fields.test.ts` 5 de 5 (dentro da corrida completa). Com M34 (`positionAxis,` tirado do mapa): `Tests  1 failed | 4 passed (5)`, falha `toda propriedade que uma porta de style.set ou de campo escreve tem um codec registrado` com `"background-position-x (codec position-axis)"` e `"background-position-y (codec position-axis)"`.
- Regressão: os outros leitores de `codecOf` (`src/core/style/border.ts:81`, `src/editor/shell/field.tsx:363`, `src/editor/shell/field.tsx:870`, `src/core/render/output.ts:79`) leem o codec de outras propriedades ou de compostos; nenhum decide algo pela ausência de codec destes longhands. Os compostos (`grid-column`, `grid-row`, `background-position`, `transition`) têm codec próprio e não mudaram. Nenhuma regressão encontrada.
- Proibições: nenhuma nas linhas novas de `src/core/style/codecs.ts`.

**Achados:**
1. Citações defasadas: o registro cita `src/core/style/codecs.ts:681`, `:669`, `:670`, `:671` e `:939`; o commit `880a3b8c` (DEF-0516) acrescentou 20 linhas acima, e hoje as mesmas linhas estão em `:701`, `:689`, `:690`, `:691` e `:959`. O texto citado confere; o número da linha, não.
2. O detector só prova o registro do codec, não a aceitação: o laço de ida e volta e aceitação só roda nos contratos com unidades (`tools/runner/model/fields.test.ts:48` `for (const contract of CONTRACTS.filter((c) => c.kind === 'property' && c.registered && !c.structured && c.units.length > 0)) {`), e os quatro longhands de grid e os dois de transição têm `units 0` (lido de `fieldContracts()` no teste de rascunho). Efeito: um codec `grid-line`, `property-list` ou `keyword-list` registrado que recusasse todo texto passaria pelos 5 testes de `fields.test.ts`. A aceitação dos valores citados no registro foi conferida só pelo teste de rascunho desta verificação.
3. M34 tira só `positionAxis` do mapa; o código de antes não tinha nenhum dos quatro. A regra do teste é genérica (todo codec declarado e alcançado por `style.set`), então tirar qualquer um dos outros três também seria acusado pelo mesmo teste (conclusão pela leitura de `tools/runner/model/fields.test.ts:41`; não rodei mutante para eles, porque o catálogo não os tem e as instruções proíbem editar `tools/`).
4. Limite do codec `position-axis`, não afirmado pelo registro: um deslocamento a partir de uma borda (`right 10px`), que a sintaxe de `background-position-x` aceita, é recusado (`background-position-x | "right 10px" -> RECUSA` no teste de rascunho). O registro não lista esse valor; fica como limite do codec, não como divergência.

## DEF-0510 — segundo toque do mesmo ponteiro com o gesto aberto é ignorado

**Veredito:** parcial — a máquina e o dono do ponteiro fazem o que o registro diz; o detector prova só a função pura `step`, e nenhum detector passa pela mudança do dono do ponteiro (`onDown`), que é onde o gesto preso se resolve.

**Provas:**
- Código de antes: `git show 253b9a36^:src/editor/input/pointer/machine.ts` linha 85 `if (event.type === 'down' || event.pointer !== machine.pointer) return { machine, effect: null };` (todo `down` com o gesto aberto ignorado); `git show 253b9a36^:src/editor/input/pointer/events.ts`, começo do `onDown`: `if (pointerPressing() || ps.spacing !== null || … || ps.tooling !== null) p.onCancel();`, sem olhar a máquina; e `src/editor/input/pointer/events.ts:433` `setPressing(false);` no começo do `onUp`, antes de olhar o ponteiro. Rastreando a sequência `down(p1)`, `up(p2)` (o `up(p1)` perdido), `down(p1)` no código de antes: o `up(p2)` desliga o pressionado e chega a `src/editor/input/pointer/events.ts:539` `const next = step(ps.machine, { type: 'up', pointer: event.pointerId });`, que ignora outro ponteiro; o `down(p1)` seguinte não cancela (pressionado desligado) e chega a `step`, que o ignorava; o gesto fica aberto. A causa confere.
- O efeito confere: com o gesto aberto, um despacho que muda o documento entra na fila (`src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));`).
- Correção:
  - `src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { machine: { phase: 'pressed', pointer: event.pointer, start: event.at, press: event.press }, effect: 'restart' };`
  - `src/editor/input/pointer/events.ts:51` `const lost = ps.machine.phase !== 'idle' && step(ps.machine, { type: 'down', pointer: event.pointerId, at: { x: event.clientX, y: event.clientY }, press: { on: 'stage' } }).effect === 'restart';`
  - `src/editor/input/pointer/events.ts:52` `if (lost || pointerPressing() || ps.spacing !== null || … || ps.tooling !== null) p.onCancel();`
  `p.onCancel` (`src/editor/input/pointer/events.ts:549` `const next = step(ps.machine, { type: 'cancel' });`, `:551` `p.run(next.effect);`) cancela o gesto e põe a máquina em `idle`; o toque segue e chega a `src/editor/input/pointer/events.ts:230` `const next = step(ps.machine, { type: 'down', pointer: event.pointerId, at, press });` com a máquina em `idle`, efeito `press`. Os ramos das alças, guias, rotação e pan exigem `ps.machine.phase === 'idle'` (linhas 105, 140, 155, 182, 206) e passam a ser alcançados depois do cancelamento, como o registro diz.
- O efeito `restart` nunca chega ao tratador: o dono só o lê para decidir o cancelamento (linha 51), e depois do cancelamento a linha 230 dá `press`. `src/editor/input/pointer/effects.ts:31` `const run = (effect: Effect) => {` trata `press`, `drag`, `commit` e `cancel` (linhas 32, 100, 153) e não tem ramo para `restart`; hoje isso não tem efeito, porque nenhum caminho entrega `restart` a `run`.
- Detector, sem mutante: `machine.test.ts` 3 de 3 (na corrida completa). Mutantes (`BUILDER_MUTANT=<id> npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/machine.test.ts`):
  - M36 (tira a linha 88): `Tests  3 failed (3)` — a tabela gravada diverge, `ignorada em silêncio, sem motivo: expected [ 'pressed + down(p1)', …(1) ]`, e `pressed + down do mesmo ponteiro: expected null to be 'restart'`. Sem a linha 88, `lost` da linha 51 nunca é verdadeiro e o dono volta ao comportamento de antes, então M36 reproduz o código de antes no efeito.
  - M37 (`>=` trocado por `>` no limiar): `Tests  2 failed | 1 passed (3)` — tabela gravada divergente e `ignorada em silêncio, sem motivo`.
- Regressão: com mouse e caneta, um segundo botão apertado com o primeiro seguro não gera outro `pointerdown` do mesmo `pointerId` (é um `pointermove` de botões encadeados, Pointer Events), então o ramo novo só é alcançado quando o `up` do ponteiro se perdeu. Não encontrei caminho em que o cancelamento novo desfaça um gesto legítimo.
- Proibições: nenhuma nas linhas novas.

**Achados:**
1. O detector não passa pelo dono do ponteiro. `tools/runner/model/machine.test.ts` importa só `src/editor/input/pointer/machine.ts` e `tools/map/` (`tools/runner/model/machine.test.ts:8` `import { IDLE, step, type Press } from '../../../src/editor/input/pointer/machine.ts';`), e nenhum outro arquivo de `tools/runner/model/` importa `src/editor/input/pointer/events.ts` (a única menção é um comentário em `tools/runner/model/drafts.test.ts:135`). Efeito: tirar `lost ||` da linha 52, ou trocar a linha 51 por `const lost = false;`, devolve o gesto preso do DEF-0510 e nenhum detector acusa (conclusão pela leitura dos imports; sem mutante no catálogo para isso e sem permissão para criar um). O caso de ponta a ponta `down(p1)`, `up(p2)`, `down(p1)` não é exercitado em lugar nenhum: `tests/e2e/pointer.spec.ts` não tem caso de `up` perdido (busca por `lost`, `pointerId: 2`, `restart`, `DEF-0510`, `DCS-013` sem resultado).
2. A tabela `manifest/generated/behavior.json` não descreve o que o dono faz com outro ponteiro: ela declara `'pressed + down(p2)': 'another pointer (a second finger, a pen) does not join the gesture'` (`tools/map/gesture-table.ts:41`), mas o dono cancela o gesto aberto em todo `down` de qualquer ponteiro enquanto o pressionado está ligado (`src/editor/input/pointer/events.ts:52`, a condição `pointerPressing()`, que existia antes da correção) e o segundo dedo abre o seu próprio gesto a partir de `idle`. Efeito: um segundo dedo que toca durante um arraste cancela o arraste do primeiro, e a tabela diz "ignorado". Não é regressão desta correção; é divergência entre o mapa executável e o dono do ponteiro (não medido no navegador).
3. Alcance do defeito, não verificado: pela condição `pointerPressing()` da linha 52, todo `down` de outro ponteiro visto pelo `onDown` já cancela o gesto aberto. Para o gesto ficar preso é preciso um `up` de outro ponteiro cujo `down` não passou pelo `onDown` do mesmo dono (os ouvintes são de captura na janela: `src/editor/input/pointer.ts:204` `target.addEventListener('pointerdown', p.onDown, true);`). O registro não nomeia a entrada real que produz essa sequência, e não a encontrei sem navegador.

## DEF-0511 — desfazer e refazer não devolvem o contexto da mudança

**Veredito:** parcial — o despacho, o gesto e a fusão gravam e devolvem o contexto como o registro diz, e os três mutantes são acusados; mas a entrada de um grupo de comandos grava o contexto de quando o grupo abriu, e um grupo que troca de breakpoint antes de escrever faz o desfazer levar o editor para longe da camada desfeita (regressão em relação ao código de antes, reproduzida abaixo).

**Provas:**
- Código de antes (`git show 253b9a36^:src/core/history/transaction.ts`): a transação tinha `selectionBefore`, `selectionAfter`, `at`, `coalesceKey`, `message`, sem contexto; `git show 253b9a36^:src/core/store/store.ts`: o desfazer publicava `commit({ ...state, ...restored, message: … })`, com o `ui` de agora. A causa confere.
- Correção:
  - `src/core/history/transaction.ts:25` `readonly context?: EditContext;`
  - `src/core/store/store.ts:362` `const contextAt = (s: StoreState<Ui>, at?: EditContext): EditContext => {` (camada, classe e quadro-chave: os do despacho quando ele os traz, senão os que o editor mostra);
  - despacho: `src/core/store/store.ts:529` `const context = contextAt(before, at);`; grupo: `context: contextAt(before),` com o comentário `// a group is made where it was opened` (linha 645–646); gesto: `context: contextAt(before),` com `// a gesture is made where it was pressed` (linha 739–740);
  - fusão: `src/core/history/history.ts:34` `...(last.context === undefined ? {} : { context: last.context }),`;
  - desfazer e refazer: `src/core/store/store.ts:483` `const ui = tx.context !== undefined && options.restoreContext !== undefined ? options.restoreContext({ ...state, ...restored }, tx.context) : state.ui;`;
  - o editor: `src/editor/view/edit-context.ts:13` `export function restoreEditContext(state: StoreState<EditorUi>, context: EditContext): EditorUi {` (breakpoint por `choosing`, como `view.setBreakpoint` faz em `src/editor/view/breakpoints.ts:61`–`63`, largura digitada descartada ao trocar; estado de estilo; classe-alvo; quadro-chave por `src/editor/timeline/playhead.ts:99` `export function atKeyframe(state: StoreState<EditorUi>, target: KeyframeTarget): EditorUi | null {`, que abre a Timeline e põe o playhead no quadro); ligado em `src/editor/store.ts` por `restoreContext: restoreEditContext,`.
  As citações do registro conferem linha a linha.
- Detector, sem mutante: `history.test.ts` e `style.test.ts` passam (na corrida completa, 61 de 61). A regra do modelo é independente do código: `tools/runner/model/harness.ts:274` `demand(sameContext(contextOf(s), entry.before.context), …)` no desfazer e `:308` no refazer, com o contexto da entrada tirado de `madeIn ?? contextOf(previous)` (`tools/runner/model/harness.ts:145`).
- Mutantes (`BUILDER_MUTANT=<id> npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/history.test.ts tools/runner/model/style.test.ts`):
  - M38 (`const ui = state.ui;`): `Tests  3 failed (3)`; contraexemplos `["aurora",Alternar(0),Digitar(0.5),Contexto(0,1,fora),Desfazer]` (`desfazer não devolveu o contexto em que a mudança foi feita: {"breakpoint":"desktop","state":"base"} e o editor mostra {"breakpoint":"desktop","state":"hover"}`) e `["aurora",Gesto(1,commit,seleciona 0),Contexto(0,1,fora),Desfazer]`; o caso dirigido `history.undo devolve o quadro-chave: expected null to deeply equal { node: 'n-title', …(2) }`.
  - M39 (`contextAt(before)` sem o contexto do despacho): `Tests  2 failed | 1 passed (3)`; contraexemplos `[…,Digitar(0.5),Contexto(0,1,dentro do campo),Desfazer]` e `[…,Contexto(1,-,fora),Selecionar(0),Digitar(0.5),Contexto(0,-,dentro do campo),Desfazer]`.
  - M40 (sem a linha do quadro-chave em `edit-context.ts`): `Tests  1 failed | 2 passed (3)`; `history.undo devolve o quadro-chave: expected null to deeply equal { node: 'n-title', …(2) }`.
  M38 reproduz o desfazer de antes (o `ui` como está).
- Proibições: nenhuma em `src/editor/view/edit-context.ts`, `src/editor/timeline/playhead.ts` nem nas linhas novas da store (o padrão `const { x: _x, ...rest } = ui; void _x;` não cala tipo).

**Achados:**
1. **Regressão no grupo de comandos (o turno do assistente).** O grupo grava o contexto de quando abriu (`context: contextAt(before),` em `src/core/store/store.ts:646`), e o assistente despacha qualquer comando construído que não seja `assistant.*` pelo grupo do turno (`src/editor/assistant/controller.ts:54` `const commands = manifest.commands.filter(command => isBuilt(wiring().commands[command.id as CommandId]));`, `:61` `const group = store.commandGroup(message('assistant.busy'));`, `:65` `authorize: async command => !command.id.startsWith('assistant.'),`), inclusive `view.setBreakpoint`. Reproduzido num teste de rascunho sobre a store do editor (fixture `aurora`): grupo aberto em `desktop/base`; no grupo, `view.setBreakpoint` para `laptop` (`{"status":"done","changed":true}`) e `style.set width 123px` (`{"status":"done","changed":true}`), gravado em `{"laptop":{"base":{"width":"123px"}}}`; a entrada guarda `{"layer":{"breakpoint":"desktop","state":"base"},"styleClass":null,"keyframe":null}`; depois de `history.undo`, o editor mostra `{"breakpoint":"desktop","state":"base"}`. Efeito: o desfazer muda a camada `laptop` e leva o editor para `desktop`, onde a mudança não aparece — o sintoma que o DEF-0511 corrige, agravado (antes da correção o editor ficava em `laptop` e mostrava o desfeito). Contraria a DCS-009 ("o breakpoint … em que a mudança foi feita"). O modelo não tem passo de grupo de comandos (`COMMON_STEPS` em `tools/runner/model/harness.ts:512`–`523` não abre grupo), então nenhum detector cobre esse caminho.
2. **O desfazer de uma mudança que não toca o quadro-chave abre a Timeline.** `contextAt` grava o quadro-chave sob o playhead para todo comando (`src/core/store/store.ts:367` `keyframe: at !== undefined && 'keyframe' in at ? (at.keyframe ?? null) : (options.keyframe?.(s) ?? null),`), não só para as escritas de estilo. Reproduzido no rascunho: com a Timeline aberta no quadro 0 % de `n-title`, `element.duplicate` grava `"keyframe":{"node":"n-title","animation":"Entrada","keyframe":0}`; com a Timeline fechada, `history.undo` a reabre (`Timeline aberta antes do desfazer: false`, `depois do desfazer: true`). A duplicação não foi "feita num quadro-chave" no sentido da DCS-016 (nada escrito no quadro), e a justificativa da DCS-016 é que "nenhum comando fecha o painel nem move o playhead por conta própria"; aqui o desfazer abre o painel por conta própria para uma mudança que não está nele.
3. O caso dirigido do quadro-chave (`tools/runner/model/style.test.ts:40`) usa um só quadro (0 %) e uma só animação; o modelo aleatório não cria animação nem abre a Timeline, então o quadro-chave só é conferido nesse caso.

## DCS-009 — D-A: desfazer e refazer devolvem o contexto de edição

**Veredito:** parcial.

**Provas:** a transação ganhou o contexto (`src/core/history/transaction.ts:25` `readonly context?: EditContext;`), o desfazer e o refazer devolvem o `ui` desse contexto (`src/core/store/store.ts:483`, `src/editor/view/edit-context.ts:13`), e o modelo do histórico confere o contexto devolvido (`tools/runner/model/harness.ts:274` e `:308`); M38, M39 e M40 acusados (seção DEF-0511). O "Comportamento atual" citado pela decisão era o código de antes: hoje `src/core/history/transaction.ts:21` `readonly selectionBefore: Selection;` continua na mesma linha, e o contexto entrou na linha 25. A DCS-010 (o contexto não entra no formato salvo) confere: o histórico não é restaurado (`src/editor/persistence/autosave.ts:11`, comentário com `the history starts empty`).

**Achados:** a entrada de um grupo de comandos grava o contexto de quando o grupo abriu, não o da mudança; com uma troca de breakpoint dentro do grupo (o turno do assistente pode despachar `view.setBreakpoint`), o desfazer devolve o breakpoint errado (reproduzido; seção DEF-0511, achado 1). Fora do grupo, a decisão está implementada.

## DCS-013 — D-E: um segundo toque com o gesto aberto

**Veredito:** confirmado (com a ressalva de cobertura do DEF-0510).

**Provas:** a máquina devolve `restart` para o mesmo ponteiro com o gesto aberto (`src/editor/input/pointer/machine.ts:88`), e o dono do ponteiro cancela o gesto aberto e segue com o toque novo a partir de `idle` (`src/editor/input/pointer/events.ts:51`–`52`, `:549`–`551`, `:230`), que é a opção (2) escolhida. A tabela gerada confere com o código: `machine.test.ts` 3 de 3 sem mutante, e o teste "a tabela gravada em manifest/generated/behavior.json é a que o código dá" falha com M36 e M37. O "Comportamento atual" citado pela decisão (`machine.ts:90`, `event.type === 'down' ||`) é o mesmo texto que hoje está na linha 90, mas a linha 88 trata antes o mesmo ponteiro, então a linha 90 só ignora o `down` de outro ponteiro.

**Achados:** o cancelamento no dono (`events.ts:51`–`52`) não é coberto por detector nenhum (seção DEF-0510, achado 1); e a tabela declara que um `down` de outro ponteiro é ignorado enquanto o dono cancela o gesto aberto nesse caso pela condição `pointerPressing()` (seção DEF-0510, achado 2).

## DCS-015 — codecs de vários valores guardam o número como digitado

**Veredito:** parcial — o código segue a regra (b); o detector não faz a conferência que o "Efeito no plano" declara para os textos conferidos pelo navegador; as citações de `codecs.ts` estão defasadas.

**Provas:**
- O codec que lê um comprimento escreve pelo `writeNumber`: `src/core/style/codecs.ts:240`, `if (value.kind === 'length') return` seguido do número por `writeNumber(value.number)` e da unidade.
- Os codecs citados leem por `cssText`: `src/core/style/codecs.ts:872` `const translate = registerCodec('translate', { read: cssText, write: writeCssText });`, `:873` (`rotate`), `:874` (`scale`), `:843` `const fontStretch = registerCodec('font-stretch', { read: cssText, write: writeCssText });`, `:714` `const trackList = registerCodec('track-list', { read: cssText, write: writeCssText });`; e `object-position`, `transform-origin` e `perspective-origin` (codec `position`, sem `axes` em `manifest/properties.json`) caem em `src/core/style/codecs.ts:444` `if (facts.axes === undefined) return cssText(text, facts);`.
- Nenhuma conta passa por esses textos: o passo de campo (`moved`, a função única do passo em `src/editor/inspector/number-field.ts`) recusa o que não é comprimento (`src/editor/inspector/number-field.ts:73`, `if (read === null || read.value.kind !== 'length') return { kind: 'refused', message: message('status.value.notSteppable', …`).

**Achados:**
1. O "Efeito no plano" diz que o contrato de campo, "nos de texto conferido pelo navegador, confere que o texto guardado é o digitado, sem espaços nas pontas". `tools/runner/model/fields.test.ts` não tem essa conferência: depois do comentário `tools/runner/model/fields.test.ts:71` `// the codecs whose grammar the browser checks keep the text as typed (DCS-015)`, a linha 72 só confere `-0` em valores de `kind === 'length'`; nenhuma afirmação compara o texto de um valor `expression` com o digitado. Efeito: um `cssText` que arredondasse ou reescrevesse o número de `translate` passaria pelos detectores.
2. `cssText` não guarda o texto exatamente como digitado: além de tirar os espaços das pontas, junta os espaços internos (`src/core/style/codecs.ts:662` `const typed = text.trim().replace(/\s+/g, ' ');`) e passa a palavra-chave para minúsculas (`:664`–`:665`). O número fica como digitado, que é o que a decisão regula; a redação "o texto como a pessoa digitou" é mais larga que o código.
3. Citações defasadas pelo commit `880a3b8c` (20 linhas a mais acima): a decisão cita `codecs.ts:638`, `:852` e `:424`; hoje as mesmas linhas estão em `:658`, `:872` e `:444`.

## DCS-016 — D-A e o quadro-chave

**Veredito:** parcial — a opção (b) está implementada para as mudanças sem quadro-chave gravado; mas o quadro-chave é gravado para todo comando feito com o playhead sobre um quadro, inclusive os que não escrevem nele.

**Provas:**
- O quadro-chave só é devolvido quando a entrada o tem: `src/editor/view/edit-context.ts:32` `if (context.keyframe !== null && context.keyframe !== undefined) ui = atKeyframe({ ...state, ui }, context.keyframe) ?? ui;`; sem ele, a Timeline fica como está.
- O quadro-chave é derivado do playhead com a Timeline aberta, como a decisão diz: `src/editor/timeline/playhead.ts:75` `if (!isPanelOpen(state.ui, TIMELINE_PANEL)) return null;` e `src/editor/timeline/playhead.ts:86` `export function keyframeTarget(state: StoreState<EditorUi>): KeyframeTarget | null {`.
- O modelo confere a camada e a classe sempre e o quadro-chave só quando a mudança o tem (`tools/runner/model/harness.ts:60`, `sameContext`, com `((made.keyframe ?? null) === null || deepEqual(now.keyframe, made.keyframe))`).
- O caso dirigido (`tools/runner/model/style.test.ts:40`) passa sem mutante e falha com M38 e M40.

**Achados:** `contextAt` grava `options.keyframe?.(s)` para todo comando (`src/core/store/store.ts:367`). Reproduzido: um `element.duplicate` feito com a Timeline no quadro 0 % grava o quadro-chave, e o desfazer, com a Timeline fechada, reabre a Timeline (seção DEF-0511, achado 2). A decisão diz que o quadro-chave volta "quando a mudança foi feita num"; uma duplicação não escreve no quadro, e o desfazer abre o painel por conta própria, o que a justificativa da decisão diz que nenhum comando faz.

## Arquivos de rascunho desta verificação

Fora do projeto, em `C:\Users\jonathanrodriguesti\AppData\Local\Temp\claude\C--Codex-Shared-webconstructor\600766c1-80cf-4e22-a55a-57c0c6c56f60\scratchpad\v\`: `vitest.scratch.config.ts` (configuração com raiz no projeto), `codecs.test.ts` (valores do DEF-0509), `contracts.test.ts` (unidades dos contratos), `grupo.test.ts` (grupo com troca de breakpoint, DEF-0511 achado 1), `quadro.test.ts` (duplicação no quadro-chave, DEF-0511 achado 2). Rodados com `npx vitest run --config <rascunho>/vitest.scratch.config.ts <arquivo> --silent=false`.

## Resumo

| Registro | Veredito | Achado principal |
|---|---|---|
| DEF-0001 | confirmado | Correção confere e M41/M42 são acusados; não muda nada no app (o único chamador, `src/main.tsx:86`, descarta a parada) e a linha `if (stopped) return;` não é coberta (a afirmação de `results` vazio passa sem parada nenhuma). |
| DEF-0508 | confirmado | Ramo da linha 40 de `history.ts` e recomeço da rajada conferem; M28 e M29 acusados com `Vaivém(0)`; sem regressão encontrada. |
| DEF-0509 | confirmado | Os quatro codecs registrados aceitam os valores citados (conferido em rascunho); citações de `codecs.ts` 20 linhas defasadas; o detector só prova o registro, e seis dos oito longhands (sem unidades) ficam fora do laço de aceitação. |
| DEF-0510 | parcial | Máquina e dono do ponteiro conferem; nenhum detector passa por `events.ts:51`–`52` (tirar `lost ||` não seria acusado); a tabela diz que outro ponteiro é ignorado, mas o dono cancela o gesto nesse caso. |
| DEF-0511 | parcial | Despacho, gesto e fusão conferem, M38–M40 acusados; regressão reproduzida: o grupo de comandos grava o contexto de abertura, e um turno do assistente que troca para `laptop` e escreve faz o desfazer levar o editor para `desktop`. |
| DCS-009 | parcial | Implementada, exceto na entrada do grupo de comandos com troca de breakpoint dentro (achado 1 do DEF-0511). |
| DCS-013 | confirmado | Opção (2) implementada na máquina e no dono; o cancelamento no dono não tem detector. |
| DCS-015 | parcial | O código segue a regra (b); o detector não confere o "texto como digitado" que o Efeito no plano promete; `cssText` junta espaços internos; citações defasadas. |
| DCS-016 | parcial | Mudança sem quadro-chave deixa a Timeline como está; mas todo comando feito com o playhead num quadro grava o quadro, e o desfazer de um `element.duplicate` reabre a Timeline (reproduzido). |
