# Grupo I — G1 (toda edição é gravada no contexto em que foi feita) e G2 (digitação nunca some)

Verificação de 2026-10-09 no código da árvore de trabalho (ramo `estrutura/edicao-e-espaco`, último commit `ae24ee7e`).
Arquivos lidos por inteiro: `src/core/store/store.ts`, `src/editor/store.ts`, `src/editor/persistence/drafts.ts`,
`src/editor/input/pending.ts`, `src/editor/input/pointer/events.ts`, `src/editor/canvas/quick-panel.tsx`,
`src/editor/input/held-draft.ts`, `tools/runner/model/harness.ts`, `drafts.test.ts`, `history.test.ts`, `races.test.ts`,
`style.test.ts`, `text.test.ts`, `src/editor/input/pending.test.ts`; trechos de `src/editor/shell/field.tsx`,
`src/editor/canvas/edit-handles.tsx`, `src/editor/input/keymap.ts`, `src/editor/assistant/controller.ts`,
`src/editor/assistant/editor.ts`, `src/editor/timeline/playhead.ts`.

## Comandos rodados

- Detectores, sem mutante: `npx vitest run --config tools/runner/model/vitest.config.ts` → `Test Files 22 passed (22)`,
  `Tests 61 passed (61)`. Resumos em `.cache/model/`: history 150 rodadas (244 digitações, 262 trocas de contexto),
  style 150 (235 digitações, 236 trocas), text 150 (300, 319), structure 150 (231, 190), pages 150 (237, 245).
- `npx vitest run src/editor/input/pending.test.ts` → `Tests 6 passed (6)`.
- Mutantes do catálogo que tocam G1/G2, cada um no detector que o catálogo nomeia:
  M16 (history) falha 1/1; M17 (history) falha 1/1; M20 (history) falha 1/1; M21 (style) falha 1/2; M24 (history) falha
  1/1; M27 (style) falha 1/2; **M19 (style) passa 2/2** (declarado equivalente no catálogo, conferido abaixo).
- Passos de modelo no scratchpad, com o arnês e o setup dos detectores (`vitest.scratch.config.ts`, plugin de mutantes
  do projeto): `g1g2.check.ts` (casos A, A2, B, B2), `quick.check.ts` (caso Q, o painel rápido real com o keymap real),
  `band.check.ts` (caso BAND, a banda digitada real). Relatos gravados em `scratchpad/relatos.txt`.
- Mutante do scratchpad (fora do catálogo, `vitest.semtoque.config.ts`): a linha `events.ts:58` trocada por `void 0`,
  com os detectores do modelo e os testes de `src/editor/input/` → `Test Files 30 passed (30)`, `Tests 89 passed (89)`;
  o marcador do plugin confirma que `src/editor/input/pointer/events.ts` foi carregado com a troca.

## G1 — toda edição é gravada no contexto em que foi feita

- **Veredito:** parcial.

### Provas (o que confere)

- O contexto capturado traz camada, classe e quadro-chave:
  `src/editor/store.ts:105` `  return { layer: activeLayer(state), styleClass: state.ui.styleTarget ?? null, keyframe: keyframeTarget(state) };`
- O campo captura o contexto e os elementos na primeira tecla (campo numérico):
  `src/editor/shell/field.tsx:648` `      typing.targets = state.selection;` e grava com os dois:
  `src/editor/shell/field.tsx:643` `      keepValue(store, command, property, element.value, typing.targets, typing.context);`
- Comando do próprio campo roda no contexto da digitação:
  `src/editor/input/pending.ts:79` `  if (typing.owns(id, (args ?? {}) as Readonly<Record<string, unknown>>)) return typing.context;`
- A store do núcleo grava no contexto recebido: a camada
  `src/core/store/store.ts:355` `    const picked = at?.layer ?? options.layer?.(state);`, e a transação registra o mesmo
  contexto `src/core/store/store.ts:529` `      const context = contextAt(before, at);`.
- Comando que move o que o campo edita, com a digitação pendente, grava na hora:
  `src/editor/store.ts:247` `      if (edited !== null && heldTyping() !== null && editedKey(store.getState()) !== edited) keepTyping();`
  (`editedKey` compara seleção e contexto: `src/editor/store.ts:109`).
- Um comando que muda o documento e chega durante um gesto roda depois, no contexto em que foi pedido:
  `src/editor/store.ts:244` `        waiting.push(() => void store.dispatch(id, args, asked));`
- A derivação (`src/core/store/store.ts:504`) roda sem o contexto da digitação, mas `deriveData` só lê
  `context.rules.elements` (`src/core/data/targets.ts:16`), nunca a camada: sem efeito em G1.

### Caso a caso, com digitação pendente

| Muda | Caminho | Resultado |
|---|---|---|
| breakpoint | `view.setBreakpoint` pela store do editor, de fora (grava antes, `pending.ts:82`) ou de dentro do campo (grava depois, `store.ts:247`) | confere: passo `Context` do arnês, M24 e M27 acusam |
| estado | `view.setStyleState`, o mesmo caminho do breakpoint | confere: passo `Context` do arnês |
| classe-alvo | `inspector.setStyleTarget` é desfazível no manifesto (`"undoable":true`), então `beforeCommand` grava antes sempre (`pending.ts:82`) | confere por leitura; sem passo de modelo |
| quadro-chave | `timeline.setPlayhead` (inclusive o laço de reprodução, `src/editor/timeline/preview.ts:98`) e o fecho da Timeline passam pela store do editor; `editedKey` inclui o quadro-chave | confere por leitura; sem passo de modelo |
| seleção, campo com `targets` | `store.ts:247` grava depois da troca, nos elementos guardados (`field.tsx:643`) | confere: `pending.test.ts:112` |
| seleção, campo sem `targets` (banda digitada, campos de `heldDraft`) | `store.ts:247` grava depois da troca, na seleção nova | **não confere**: caso BAND |
| qualquer contexto, dentro de um grupo de comandos | `group.dispatch` vai direto ao `run` do núcleo, sem `store.ts:247` | **não confere** para a gravação na hora; o valor ainda cai no contexto certo por `pending.ts:79`: caso A |
| restauração, breakpoint | `src/editor/persistence/drafts.ts:166` troca o breakpoint antes do campo capturar | confere: caso B2 |
| restauração, estado e classe | `drafts.ts:168` e `drafts.ts:169` despacham antes | confere por leitura (não rodado) |
| restauração, quadro-chave | o rascunho não guarda quadro-chave (`drafts.ts:28`) e a restauração não move o playhead | **não confere**: caso B |

### Achados

1. **BAND — a banda digitada grava no elemento novo.** Entrada: elemento `n-hero` selecionado, banda de
   preenchimento de cima aberta, `12` digitado; com o foco ainda no campo, `selection.select` de `n-title` pela store do
   editor. Resultado medido: `{"held":true,"focusStayed":true,"stillHeld":false,"typedFor":"n-hero","other":"n-title","paddingTypedFor":"56px","paddingOther":"12px"}`
   — o `12px` foi para `n-title`, e `n-hero` ficou com o `56px` que já tinha. Causa:
   `src/editor/canvas/edit-handles.tsx:241` `    (store.dispatch as (id: CommandId, a: unknown, c?: EditContext) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...stands, [valueArg(entry)]: text }, context);`
   leva o contexto mas não os elementos (`style.setSpacing` não aceita `targets` no manifesto), e `store.ts:247` grava
   depois da troca de seleção. O comentário de `src/editor/store.ts:178` e `src/editor/store.ts:179` afirma "keeps it at once, where it was typed";
   para os campos de `heldDraft` (`src/editor/input/held-draft.ts:39`) o "onde" não inclui os elementos. Quem dispara uma
   troca de seleção sem mudar o documento com o foco no campo: o despacho do assistente
   (`src/editor/assistant/editor.ts:35`) e o grupo do assistente (achado A2 de G2).
2. **A — dentro de um grupo de comandos a troca de contexto não grava a digitação.** Entrada: grupo aberto
   (`store.commandGroup`, o turno do assistente: `src/editor/assistant/controller.ts:61`), digitação de `opacity 0.4`
   começa em `desktop`, o grupo despacha `view.setBreakpoint laptop` e depois `style.set width 33px`. Medido:
   `{"afterContext":true,"afterDocument":true,"keptCount":0,"opacityAtTypingLayer":"0.4",...}` — a digitação continua
   pendente depois das duas, e o Enter do campo depois do grupo grava em `desktop`. Causa:
   `src/core/store/store.ts:626` `            const result = run(id, args, null, false, current);` não passa por
   `src/editor/store.ts:235` nem por `src/editor/store.ts:247`; o invólucro só grava na abertura
   (`src/editor/store.ts:209` `      keepTyping();`).
3. **M19 não é equivalente.** O catálogo (`tools/runner/mutants.ts:59`) diz que "toda troca de camada, classe,
   quadro-chave ou seleção passa pela store do editor". O caso A é uma troca que não passa. Com `BUILDER_MUTANT=M19` o
   caso A falha: `AssertionError: expected undefined to be '0.4'`, e o relato mostra `"opacityAtOther":"0.4"` — o valor
   digitado em `desktop` foi gravado em `laptop`. O mutante sobrevive aos detectores só porque nenhum detector abre um
   grupo de comandos com digitação pendente.
4. **B — o rascunho restaurado perde o quadro-chave.** Entrada: elemento com a animação `Entrada` (quadros-chave 0 e
   100), Timeline aberta, playhead no fim (quadro 100), rascunho de campo gravado na sessão; a aba recarrega com a mesma
   obra, a mesma seleção e o mesmo espaço de trabalho. Medido:
   `"typedOn":{"node":"n-title","animation":"Entrada","keyframe":100}`, `"savedContext":{"quick":false,"styleState":null,"styleTarget":null,"revealed":null,"breakpoint":"desktop"}`,
   `"restoredKeyframe":{"node":"n-title","animation":"Entrada","keyframe":0}`. O campo que restaura captura
   `editContextOf` (`src/editor/shell/field.tsx:648` e seguinte), então o contexto da digitação restaurada é o quadro 0.
   Causa: `src/editor/persistence/drafts.ts:28` `  context: z.object({ quick: z.boolean(), styleState: z.string().nullable(), styleTarget: z.string().nullable(), revealed: z.string().nullable(), breakpoint: z.string().nullable().optional() }),`
   não tem quadro-chave, e `drafts.ts:165` a `drafts.ts:170` não movem o playhead. Não verificado: a gravação final do
   valor no quadro 0 pelo campo montado; `restoreFieldDraft` espera `visibility: visible` e `getClientRects()`
   (`drafts.ts:116`), que o happy-dom não calcula.
5. Não verificado: `src/editor/shell/field.tsx:988` `        if (!same && (targets.length === 0 || !('targets' in entry.command.args))) return;`
   descarta o texto de um campo de comando próprio quando a seleção mudou antes da gravação e o comando não aceita
   `targets`. Os comandos próprios desenhados por `TextStyleField` no manifesto de agora (`style.setBorder`,
   `style.setRadius`, `style.setBackgroundImage`, `style.setShadows`, `style.setFilter`, `style.setTransform`) aceitam
   `targets`; nenhum caminho que chegue a esse descarte foi encontrado.

### Detectores de G1 e o que fica sem detector

- Cobertos: contexto de breakpoint e estado com troca de dentro e de fora do campo (passo `Context`,
  `tools/runner/model/harness.ts:407`); comando do próprio campo no contexto da digitação (passo `FieldOwn`); contexto
  da transação (M39); colagem que chega tarde (`races.test.ts`, só a leitura da área de transferência, sem digitação).
- Sem detector:
  - classe-alvo e quadro-chave como contexto da digitação: o passo `Context` só troca breakpoint e estado
    (`harness.ts:420` e `harness.ts:421`), a Timeline nunca abre nos passos comuns, e a conferência de camada pula
    esses contextos: `tools/runner/model/harness.ts:213` `  if (context.layer === undefined || (context.styleClass ?? null) !== null || (context.keyframe ?? null) !== null) return;`.
    M21 é acusado pela forma do objeto (`harness.ts:337`, `deepEqual` com a chave `keyframe` ausente), não por uma
    gravação num quadro-chave;
  - seleção trocada com o foco no campo: todo passo de seleção do arnês tira o foco antes
    (`harness.ts:222` `  if (r.typing !== null && !inField) r.typing.field.blur();`), e a gravação sintética do passo
    `Type` não leva `targets`; só `pending.test.ts:112` cobre, com um campo que leva;
  - grupo de comandos e sequência com digitação pendente (achados A e M19);
  - restauração de rascunho (`startDrafts`, `restoreFieldDraft`): nenhum teste chama.

## G2 — digitação nunca some

- **Veredito:** parcial.

### Provas (o que confere)

- Comando que muda o documento ou vem de fora do campo grava antes:
  `src/editor/store.ts:235` `      const at = context ?? beforeCommand(id, args, changesDocument);` e
  `src/editor/input/pending.ts:81` `  if (!changesDocument && focused !== null && within(typing, focused)) return undefined;`
  seguido de `src/editor/input/pending.ts:82` `  keepTyping();`. M16 e M24 acusados pelo grupo history.
- Toque começa: `src/editor/input/pointer/events.ts:58` `    keepTypingBefore(event.target);`, antes de qualquer
  medida ou comando do toque; o duplo clique abre gesto, que grava antes (`src/editor/store.ts:217` `      keepTyping();`).
- Campo novo grava o anterior: `src/editor/input/pending.ts:31` `  if (held !== null && held.field !== typing.field) keepTyping();` (M17 acusado).
- Painel do inspector que fecha (Ctrl+B, Ctrl+Alt+B, Ctrl+\ do contexto `field`, que não mudam documento e deixam a
  digitação pendente por `pending.ts:81`): o campo grava ao desmontar, no contexto e nos elementos da digitação —
  `src/editor/shell/field.tsx:667` `      keepNow();` (campo numérico), `field.tsx:1111` `      if (keepOnLeave) keepNow();`,
  `field.tsx:1597` `      if (keepOnLeave) keepNow();`, e `draft.left()` nos campos de `heldDraft`
  (`edit-handles.tsx`, `panel-field.tsx`, `guides-grids.tsx`). A gravação vem depois do comando que fecha, que não muda
  o documento: documento e histórico finais são os mesmos de uma gravação antes.
- Temporizadores que despacham (`src/editor/timeline/preview.ts:98`, `src/editor/motion/use-canvas-motion.ts:106`,
  `src/editor/canvas/chrome.tsx:1120`) passam pela store do editor.
- Exceção do Esc do painel rápido: medida no caso Q, `"close":"escape"` → `"documentChanged":false`.

### Achados

1. **Q — Ctrl+Shift+Q no painel rápido também descarta, e o botão de fechar grava.** Painel rápido real montado com o
   keymap real, `0.37` digitado no campo de opacidade (`style.set#quick-panel-opacity`), fechado de três maneiras.
   Medido:
   - Esc: `"closed":true,"documentChanged":false,"valueInDocument":false`;
   - Ctrl+Shift+Q: `"closed":true,"documentChanged":false,"valueInDocument":false`;
   - toque no botão de fechar (`keepTypingBefore` do dono do ponteiro e depois o clique): `"closed":true,"documentChanged":true,"valueInDocument":true`.
   O `CLAUDE.md` diz "Exceção única: o Esc do painel rápido descarta o rascunho". O Ctrl+Shift+Q do contexto
   `quick-panel` (`manifest/commands/workspace.json:3806` `"id": "key-ctrl-shift-q-in-quick-panel",`) é uma segunda
   porta que descarta: o comando não é do campo e não muda o documento, então `pending.ts:81` deixa a digitação; o foco
   vai ao chip e `src/editor/shell/field.tsx:1059` `      if (!keepOnLeave && !quickPanelOpen(store.getState().ui)) return;`
   descarta. A especificação do manifesto (`manifest/features/04-inspector.json`, recurso `quick-panel`) diz que o chip
   "does the same" e que "what a field held unkept is dropped as the panel closes" — o botão de fechar grava. As três
   portas do mesmo `quickPanel.setOpen`, no mesmo estado, dão resultados diferentes. Qual comportamento vale é decisão
   do dono; o código de agora não segue nem o `CLAUDE.md` (Ctrl+Shift+Q descarta) nem a especificação (o botão grava).
2. **O commit `ae24ee7e` não muda o resultado de G2.** Diff lido (`src/editor/canvas/quick-panel.tsx`: o painel fica
   montado um quadro, `quick-panel.tsx:496` a `quick-panel.tsx:500`, com o chip ao lado para receber o foco). No quadro
   do fecho, o campo perde o foco para o chip, `keepSoon` roda e a gravação cai em `field.tsx:1059` (painel já fechado);
   no desmonte seguinte, `field.tsx:1112` `      else releaseTyping(element);`. Todos os campos do painel rápido usam
   `keepOnLeave={false}` (`quick-panel.tsx:204`, `232`, `237`, `249`, `254`, `256`), então nenhum caminho do quadro extra
   grava; o caso Q mediu o código de agora.
3. **A2 — digitação durante o turno do assistente sai do registro sem ser gravada.** Entrada: grupo aberto, `0.6`
   digitado, toque fora do campo. Medido: `{"kept":1,"status":"refused","held":false,"message":"assistant.busy"}` e a
   opacidade não foi gravada. `src/core/store/store.ts:403` `    if (group !== null && ownedGroup !== group && command.history.undoable) return busyResult();`
   recusa a gravação; o registro já soltou a digitação (`src/editor/input/pending.ts:47` `  held = null;`) e o campo
   numérico já marcou o texto como gravado (`field.tsx`, `keepNow`: `typing.typed = false`), então nenhum toque ou perda
   de foco posterior tenta de novo. A barra de status diz "ocupado"; o texto continua visível no campo sem estar no
   documento.
4. **A — comandos do grupo que mudam o documento não gravam a digitação antes** (`afterDocument: true` no caso A),
   pelo mesmo caminho de `src/core/store/store.ts:626`. A sequência de teclas da rajada
   (`src/core/store/store.ts:671` `          return run(id, args, null);`) também não passa por `beforeCommand`, mas só roda com
   o foco no canvas ou nas Camadas, e o foco entrando num campo encerra a rajada (`src/editor/input/keymap.ts`,
   `onFocusIn`, `endBurst()`): sem caminho com digitação pendente.
5. Não verificado (sem caminho encontrado): o painel rápido some sem fechar — `src/editor/canvas/quick-panel.tsx:501`
   `  if (!shown || node === null) return null;` (arraste, texto editado no lugar) — e os campos dele soltam a digitação
   sem gravar (`field.tsx:1112`), com `quickPanelOpen` ainda verdadeiro. O arraste e a edição no lugar começam com um
   toque, que grava antes (`events.ts:58`); nenhum comando de dentro do campo inicia um dos dois.

### Detectores de G2 e o que fica sem detector

- Cobertos: comando de fora (`dispatchStep`, `harness.ts:231` a `harness.ts:234`; M16, M24), campo novo (M17), toque
  fora e dentro pelo registro (`Touch` chama `keepTypingBefore` direto; M20), gesto (`GestureStep`), abrir outro projeto
  (`Load`), desfazer e refazer; campos de rascunho próprio contra toque e perda de foco (`drafts.test.ts`, três campos);
  `pending.test.ts` (seis casos, inclusive o menu de valores pelo `aria-controls`).
- Sem detector:
  - **a linha do toque em `events.ts:58`**: o mutante do scratchpad que a remove passa em 89 de 89 testes
    (detectores do modelo e `src/editor/input/`); os detectores chamam `keepTypingBefore` direto
    (`harness.ts:396`, `drafts.test.ts`), nunca `onDown`;
  - painel que fecha com campo montado (inspector, painel rápido): nenhum detector monta um painel e o fecha com
    digitação pendente; `drafts.test.ts` desmonta só depois de conferir;
  - a exceção do Esc e as outras portas de fecho do painel rápido (achado Q);
  - grupo de comandos com digitação pendente (achados A, A2);
  - restauração de rascunho (`src/editor/persistence/drafts.ts`): nenhum teste chama `startDrafts`.

## Resumo

| Registro | Veredito | Achado principal |
|---|---|---|
| G1 | parcial | A banda digitada (e os campos de `heldDraft`) grava na seleção nova quando a seleção muda com o foco no campo (BAND: `12px` em `n-title`); o rascunho restaurado perde o quadro-chave (B: quadro 100 vira 0); dentro de um grupo de comandos a troca de contexto não grava na hora, e por isso M19 não é equivalente (falha no caso A) |
| G2 | parcial | Ctrl+Shift+Q no painel rápido descarta a digitação como o Esc, enquanto o botão de fechar grava (Q); durante o grupo do assistente a digitação é recusada com "ocupado" e sai do registro (A2); a linha do toque `events.ts:58` não tem detector (mutante do scratchpad passa 89/89) |
