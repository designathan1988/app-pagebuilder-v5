# Verificação — grupo B: DEF-0512 a DEF-0515, DCS-017 a DCS-021 e o item 1 da tarefa (os 8 elementos "porta faltando")

Verificador: subagente do grupo B, 2026-10-09. Código conferido: árvore de trabalho no commit `ae24ee7e` (ramo `estrutura/edicao-e-espaco`).

## Comandos rodados (saída resumida)
- `npx vitest run --config tools/runner/model/vitest.config.ts` sem mutante: **61 de 61 passaram** (22 arquivos).
- Os três detectores do grupo, `--reporter=verbose`: `composer` 1 de 1, `races` 1 de 1, `drafts` 10 de 10 (12 de 12).
- Com mutante (`BUILDER_MUTANT=<id>`, suíte inteira de detectores):
  - **M49**: falham `races` ("select: colada em n-footer#1 (status.pasted.after), sem a corrida em n-hero#3") e `lint` (variável sem uso no texto do mutante). 2 de 61.
  - **M50**: falham `races` (a mesma mensagem) e `lint` ("'afterRead' is defined but never used" em `keymap.ts`). 2 de 61.
  - **M51**: falha `composer` ("o primeiro desenho depois de reabrir põe o palco em 10px; a caixa da sessão anterior era 10px"). 1 de 61.
  - **M52**: falham os 3 casos "perde o foco" de `drafts` (painel, banda, grades) e `lint`. 4 de 61.
  - **M53**: falham os 2 casos G2 do campo de painel ("toque começou fora" e "perdeu o foco"). 2 de 61.
  - **M54**: falham os 2 casos G2 da banda, `inventory` ("elementos sem porta, sem data-local e sem exceção com motivo") e `lint`. 4 de 61.
  - **M55**: falha o caso G3 de `drafts` ("guia nova, \"\": sem aviso", mais um). 1 de 61.
  - **M56**: falha o caso G3 de `drafts` ("guia nova, \"\": status.guides.at"). 1 de 61.
- `.cache/model/races.json` depois das rodadas: `"kept": 21, "refused": 39, "found": []` (o que o MEC-11 registra).
- Três sondas do verificador, só no scratchpad (`scratchpad/grupo-b/sonda-saida.test.ts`, `sonda-esc.test.ts`, `sonda-compositor.test.ts`, com uma configuração do Vitest no próprio scratchpad que usa os arquivos de preparação do projeto). Saídas citadas nos achados.

---

## DEF-0512 — o compositor reaberto desenha um quadro com a caixa e as regiões da sessão anterior

**Veredito:** parcial.

**Provas:**
- Causa no código de antes (`git show 253b9a36^:src/modules/layout-composer/ui/overlay.tsx`): não havia nada que voltasse `box` e `measured` a nulo; o efeito de medição só sai com o compositor fechado: `src/modules/layout-composer/ui/overlay.tsx:90` `if (composer === null) return;`.
- Correção (commit `253b9a36`, 11 linhas acrescentadas, nenhuma outra mudança no arquivo):
  - `src/modules/layout-composer/ui/overlay.tsx:75` `const [open, setOpen] = useState(composer !== null);`
  - `src/modules/layout-composer/ui/overlay.tsx:78` `if (composer === null) {`
  - `src/modules/layout-composer/ui/overlay.tsx:79` `setBox(null);`
  - `src/modules/layout-composer/ui/overlay.tsx:80` `setMeasured(null);`
  - com a caixa nula, a camada sai oculta até a primeira medição: `src/modules/layout-composer/ui/overlay.tsx:123` `if (composer === null || record === null || box === null || drawn === null || STAGE === undefined) return <div ref={layer} className="layout-composer" hidden />;`
- Detector: `tools/runner/model/composer.test.ts` monta a camada de verdade, abre, mede em x=10, fecha, move o nó para x=200 e reabre; confere o primeiro desenho antes de qualquer quadro (`tools/runner/model/composer.test.ts:93` `expect(first === null || first === '200px', ...`). Passa sem mutante; acusa o M51.
- Mutante: o M51 tira exatamente as linhas 75 a 82; o resto do arquivo é o de `253b9a36^` (o diff da correção só acrescenta essas linhas e o comentário). Reproduz o código de antes.

**Achados:**
1. **A correção só zera a caixa quando o compositor fecha; a troca direta de um contêiner para outro com o compositor aberto mantém a caixa e as regiões do primeiro.** O `layout.enter` roda com o compositor aberto e troca o alvo sem passar por nulo: `src/modules/layout-composer/host/handlers.ts:426` `// the view the sidebar showed before the tool (kept when the tool comes on again over itself)` e `src/modules/layout-composer/host/handlers.ts:429` `return hidePanel(showPanel(withComposer(context.state.ui, { target: id, selection: [], lens: 'spatial', tool: 'auto', shows: PANEL, back, ...(layers ? { layers } : {}) }), PANEL), LAYERS);`; o zeramento só olha a passagem para nulo (`overlay.tsx:78` `if (composer === null) {`). Sonda `sonda-compositor.test.ts` (fixture aurora; o nó da página em x=10,y=20, o Hero em x=300,y=400): `layout.enter` na página, um quadro, `layout.enter` no Hero sem fechar → `{"r2":{"status":"done","changed":true},"target":"n-hero","onA":"10px,20px","firstOnB":"10px,20px","measuredOnB":"300px,400px"}`. Entrada → resultado: compositor aberto sobre a página, compor outro contêiner → o primeiro desenho do Hero põe o palco (e as regiões de `measured`, cujas chaves são as do contêiner anterior) na caixa da página; só o quadro seguinte o põe no lugar. É o efeito que o DEF-0512 descreve ("reaberto sobre outro contêiner"), por um caminho que a correção não cobre. Quais portas chegam a `layout.enter` com o compositor aberto no app (o menu de contexto `layout-compose-menu`, a tecla `L`, o botão da barra): não verificado no app (o navegador está proibido nesta verificação); o tratador aceita, conforme a sonda.
2. O registro diz "Arquivos da correção: ... `tools/runner/model/lifetime.test.ts` (o detector, MEC-07)"; o detector é `tools/runner/model/composer.test.ts` (`lifetime.test.ts` não menciona o compositor). O MEC-07 diz que a geometria foi trocada por `vi.mock` das coordenadas; o teste usa `registerFrame` com um iframe (`tools/runner/model/composer.test.ts:58` `const unregister = registerFrame(iframe);`), como o próprio DEF-0512 explica. Erro de registro, sem efeito no código.
3. Proibições: nenhuma no código novo.

---

## DEF-0513 — a colagem cai onde a seleção estiver quando a leitura da área de transferência chega

**Veredito:** parcial (a correção confere; o detector só prova a porta da tecla e só a parte "seleção" do contexto).

**Provas:**
- Causa no código de antes (`git show 549f5f37^:src/editor/input/keymap.ts`, linha 532): `else if (gesture === null) void readClipboard().then((content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));`; e em `549f5f37^:src/editor/doors/door.tsx`, linha 111: `void readClipboard().then((content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`. Nada guardava o contexto da tecla ou do clique.
- Correção (commit `549f5f37`):
  - `src/editor/input/after-read.ts:11` `const taken = editedKey(store.getState());`
  - `src/editor/input/after-read.ts:13` `if (editedKey(store.getState()) !== taken) {`
  - `src/editor/input/after-read.ts:14` `store.notice(message('status.stale'));`
  - a chave: `src/editor/store.ts:109` `export const editedKey = (state: EditorState): string => JSON.stringify([state.selection, editContextOf(state)]);`, com `editContextOf` = camada (breakpoint e estado: `src/editor/view/style-state.ts:22` `export const activeLayer = (shown: Shown): { readonly breakpoint: string; readonly state: string } => ...`), classe-alvo e quadro-chave.
  - as duas portas: `src/editor/input/keymap.ts:533` `else if (gesture === null) afterRead(store, readClipboard(), (content) => dispatch(binding.command.id, { ...args, [clipboard]: content }));` e `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`. `grep readClipboard` em `src/` não acha outra leitura.
- Detector `races`: passa sem mutante; acusa M49 e M50 com "select: colada em n-footer#1 (status.pasted.after), sem a corrida em n-hero#3". O M50 reproduz a tecla de antes (texto igual à linha 532 de `549f5f37^`); o M49 desliga a conferência.

**Achados:**
1. **O detector não passa pela porta clicada.** `tools/runner/model/races.test.ts` só instala o mapa de teclas (`tools/runner/model/races.test.ts:45` `const stop = installKeymap(store, window);`); `door.tsx` não tem mutante. Voltar `door.tsx:112` para `void readClipboard().then(...)` não seria acusado por nenhum detector (conclusão da leitura do teste e do catálogo; não rodei esse mutante porque ele não existe no catálogo e não posso alterar `tools/`).
2. **O ramo "breakpoint" do detector não distingue o defeito.** Colar um elemento não depende do breakpoint, então, com o M49 ou o M50, as rodadas com o breakpoint trocado contam como "kept" (a saída dos dois mutantes só lista o caso `select:`). A parte "breakpoint, estado, classe, quadro-chave" da conferência está no código (`editedKey`), mas nenhum detector a acusaria se faltasse.
3. Regressão: nenhuma achada. A rejeição de `readClipboard` continua sem `catch` em `after-read.ts:12` (`void read.then(...)`), como antes; `systemClipboard` trata as falhas de `navigator.clipboard.read()` (`src/editor/clipboard.ts:43` `if (error instanceof DOMException && error.name === 'NotAllowedError') return { status: 'denied' };`). Proibições: nenhuma.

---

## DEF-0514 — campos de valor fora do registro de pendências perdem a digitação ao perder o foco

**Veredito:** parcial (a perda de foco e o toque fora conferem; a gravação "ao sair", que o registro afirma, não acontece).

**Provas:**
- Causa no código de antes (`git show 81be75c7^:...`): `PanelField` descartava no blur (`onBlur={() => setEdited(false)}`), `TypedBand` só fechava (`onBlur={() => typedBand.close()}`) e `GridField` descartava (`onBlur={() => setDraft(null)}`); nenhum dos três chamava `holdTyping`.
- Correção (commit `81be75c7`):
  - `src/editor/input/held-draft.ts:39` `holdTyping({ field: element, region: region.current ?? element, context, owns: (id) => id === command, keep: () => keep.current(context) });`
  - `src/editor/input/held-draft.ts:42` `if (holding() !== null) keepTyping();`
  - `src/editor/shell/panel-field.tsx:146` `held.current?.left();`, `src/editor/canvas/edit-handles.tsx:275` `held.current?.left();`, `src/editor/shell/guides-grids.tsx:194` `held.current?.left();`
  - o toque fora: `src/editor/input/pending.ts:69` `keepTyping();` (chamado pelo dono do ponteiro).
  - O ponto é o registro único da G2 (`src/editor/input/pending.ts`), como a seção 4 do `CLAUDE.md` manda; `held-draft.ts` só liga os três campos a ele.
- Detector `drafts`: 10 de 10 sem mutante; M52, M53 e M54 acusados (lista acima). M53 e M54 não são o texto de antes, mas deixam o campo fora do registro, que é o comportamento de antes.

**Achados:**
1. **"Ao sair" (o campo desmontado) não grava: a limpeza do efeito lê a ref do campo, que o React já zerou.** `held-draft.ts` decide se o campo segura a digitação pela ref: `src/editor/input/held-draft.ts:31` `const element = field.current;` e `src/editor/input/held-draft.ts:32` `return element !== null && heldTyping()?.field === element ? element : null;`; a limpeza chama `left()` (`src/editor/shell/panel-field.tsx:103` `draft.left();`, e o mesmo nas outras duas), quando a ref do `input` desmontado já é `null`, então `left()` não grava e o registro fica segurando um campo fora da página. Medido pelas sondas:
   - **Guias e grades, Esc pelo mapa de teclas** (`sonda-esc.test.ts`): 7 digitado no número de colunas, Esc com o foco no campo (`data-key-context="dialog"` → `ui.dismiss`, o único Esc desse contexto no manifesto, não altera documento, então `src/editor/input/pending.ts:81` `if (!changesDocument && focused !== null && within(typing, focused)) return undefined;` não grava antes) → `{"focusedIsField":true,"dialog":null,"afterEsc":null,"held":true,"afterPress":"status.grid.set","past":1}`. Entrada → resultado: o diálogo fecha sem gravar o 7; o 7 entra no documento no próximo toque em qualquer lugar da página, num momento que a pessoa não escolheu. O comentário do próprio campo promete o contrário: `src/editor/shell/guides-grids.tsx:153` `// the typing is held in the one registry of typing (input/held-draft.ts, rule G2; DEF-0514): a press elsewhere, the` / `:154` `// focus leaving or the dialog closing keep it`.
   - **Banda digitada desmontada sem perder o foco antes** (`sonda-saida.test.ts`): 12 digitado, desmontada → `{"keptAtUnmount":false,"stillHeld":true,"afterPress12":false,"message":"status.value.invalid","refused":true}`. No toque seguinte o registro roda a gravação, que lê o texto da ref nula (`src/editor/canvas/edit-handles.tsx:240` `const text = input.current?.value ?? '';`) e despacha `''`: o 12 se perde e a barra de status mostra uma recusa num toque sem relação. Qual caminho do app desmonta a banda com o foco nela sem toque, sem comando e sem blur: não verificado (sem navegador nesta verificação).
   - **Campo de painel desmontado** (`sonda-saida.test.ts`): `{"atUnmount":null,"stillHeld":true,"afterPress":"status.project.languageSet"}`: grava só no toque seguinte (o texto vem de `typed.current`, que não é a ref do DOM).
   O detector não tem caso "sair" (`tools/runner/model/drafts.test.ts` só confere Enter, `keepTypingBefore` e o blur), por isso não acusa.
2. Proibições: nenhuma no código novo.

---

## DEF-0515 — guias e grades descartam no componente o texto que o tratador recusaria com aviso

**Veredito:** confirmado.

**Provas:**
- Causa no código de antes (`git show 81be75c7^:src/editor/shell/guides-grids.tsx`): a guia nova `if (field !== null && field.value.trim() !== '' && Number.isFinite(at)) run(entry, { axis, at });` e o campo das grades `if (draft.trim() !== '' && Number.isFinite(typed)) run(entry, { grid, setting, value: typed });`.
- Correção: `src/editor/input/held-draft.ts:53` `export const typedNumber = (text: string): number => (text.trim() === '' ? Number.NaN : Number(text));`, usado em `src/editor/shell/guides-grids.tsx:82` `run(entry, { axis, at: typedNumber(field?.value ?? '') });` e `src/editor/shell/guides-grids.tsx:143` `const write = (text: string, context?: EditContext) => run(entry, { grid, setting, value: typedNumber(text) }, context);`. A recusa vem da checagem de argumentos (`src/core/store/args.ts:22` `const finite = (value: unknown): boolean => typeof value !== 'number' || Number.isFinite(value);` → `status.args.invalid`), como o registro diz; os tratadores também recusam (`src/core/page/guides.ts:47` e `src/core/page/grid.ts:93`, conferidos).
- Detector: o caso G3 de `drafts` passa; M55 (texto equivalente ao da guia nova de antes) e M56 acusados.

**Achados:**
1. Nenhum mutante reproduz o julgamento antigo do campo das grades (o M56 é outra falha: vazio virando 0). O detector o acusaria se voltasse, porque confere "grades, \"\"" e "grades, \"abc\"" (`tools/runner/model/drafts.test.ts:164`).
2. Consequência de comportamento, não defeito: com o DEF-0514, apagar o campo das grades e clicar fora agora mostra a recusa `status.args.invalid` (a gravação envia `NaN`), onde antes o campo voltava em silêncio. É o que a G3 pede.

---

## DCS-017 — o cancelamento de gesto e de grupo não devolve o `ui`

**Veredito:** confirmado.

**Provas:** `src/core/store/store.ts:750` `if (state !== before) publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture'), current.inverses);`; o grupo: `src/core/store/store.ts:619` `publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history, confirmation: before.confirmation ?? null }, 'a cancelled command group'), current.inverses);`. A publicação segue a seleção: `src/core/store/store.ts:314` `const next = follow ? followSelection(before, committed) : committed;`. A contagem de cancelamentos: `src/editor/drag/drag-session.ts:126` `ui: { ...state.ui, drag: { ...state.ui.drag, cancels: state.ui.drag.cancels + 1 } },` e `src/editor/input/pointer/effects.ts:43` `ps.cancelsAtOpen = store.getState().ui.drag.cancels;`. Os oito cenários citados existem nos manifestos (`manifest/commands/structure.json`, `style.json`, `geometry.json`, `design-system.json`).

**Achados:** nenhum. Observação: a sequência de comandos devolve o estado inteiro, `ui` incluído (`src/core/store/store.ts:678` `publish(commit(current.before, 'a cancelled command sequence'), current.inverses, false);`); a DCS-017 fala só de gesto e grupo, então não há conflito.

---

## DCS-018 — o `postMessage` da pré-visualização com destino `'*'` não expõe dado

**Veredito:** confirmado.

**Provas:** `src/editor/shell/preview.tsx:62` `var leave = e.key === 'Escape' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey));`; `src/editor/shell/preview.tsx:64` `parent.postMessage({ builderPreviewKey: { key: e.key, code: e.code, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey, altKey: e.altKey } }, '*');` (só tecla e modificadores); `src/editor/shell/preview.tsx:53` com `sandbox="allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"` (sem `allow-same-origin`); `src/editor/shell/preview.tsx:42` `if (event.source === null || event.source !== frame.current?.contentWindow) return;`; `src/editor/shell/preview.tsx:70` `if (key !== 'Escape' && key !== 'Enter') return null;`.

**Achados:** nenhum. O `eslint-disable-next-line builder/frame-owner` da linha 41 já estava no commit inicial `8c71d650`; não foi introduzido por esta decisão.

---

## DCS-019 — o que chega tarde de uma leitura da área de transferência, num contexto que mudou, não roda

**Veredito:** parcial (o comportamento descrito confere; a justificativa "é a regra que o produto já tem" não confere).

**Provas:** o comportamento novo está em `src/editor/input/after-read.ts:11`, `:13` e `:14` (citados no DEF-0513); a chave cobre seleção, breakpoint, estado, classe e quadro-chave (`src/editor/store.ts:109`, `src/editor/view/style-state.ts:22`).

**Achados:**
1. O soltar de arquivo não segue a mesma regra: ele confere só se o alvo ainda existe (`src/editor/input/file-drop.ts:164` `const stillThere = target !== null ? locate(document, target as NodeId) !== null : parent !== null;`) e recusa explicitamente a comparação mais ampla (`src/editor/input/file-drop.ts:159` `// with a word instead of landing where the person never saw it (plan T3; a plain revision comparison would refuse` / `:160` `// on any other command that landed meanwhile, which is not the same thing).`). A DCS-019 recusa quando a seleção ou o contexto de edição mudam, mesmo com o alvo existindo. As duas usam `status.stale`, mas o critério é outro; o registro não pode citar o soltar de arquivo como "a regra que o produto já tem". Sem efeito no código da colagem.

---

## DCS-020 — a categoria "parte de porta" dos elementos desenhados fora do elemento da porta

**Veredito:** parcial (os 8 elementos conferem com G3 e com a categoria; uma citação está com a linha errada; a G2 do elemento 1 e dos 5 a 7 depende do DEF-0514, que é parcial).

**Provas:** `tools/lint/interactive-allowed.ts` tem 18 exceções `door-part`: os 8 elementos, o `input` da banda (passou de `local` para `door-part` no commit `81be75c7`) e os 9 outros (`color.tsx` 2, `command-bar.tsx` 1, `component-prompt.tsx` 1, `field.tsx` 5). A conferência de cada elemento está na seção "Item 1" abaixo.

**Achados:**
1. Citação errada: a DCS-020 cita `src/editor/shell/panel-field.tsx:144` `run={runWith}`; no commit `81be75c7` e agora, o trecho está em `src/editor/shell/panel-field.tsx:151` `{curve ? <EasingCurveButton value={value === '' && placeholder !== undefined ? placeholder : value} label={label} disabled={!ready} run={runWith} /> : null}` (a linha 144 é o comentário do blur).

---

## DCS-021 — o texto de um formulário de criação numa camada some quando a camada fecha

**Veredito:** confirmado.

**Provas:** `src/editor/shell/popover.tsx:63` `useOutsideLayer(own, true, onDismiss, anchor);`; `src/editor/shell/guides-grids.tsx:102` (o campo `at` com `data-local="guide-place"` e `onBlur={() => setOpen(false)}`); os campos da barra de classes são `data-local="class-name"` (`src/editor/shell/class-bar.tsx:132` e `:174`), fora do registro; os pontos da curva são estado local de `EasingChooser` (`src/editor/shell/easing-curve.tsx:79` `const [points, setPoints] = useState<readonly string[]>(() => pointsOf(value).map(written));`), que some com a camada.

**Achados:** nenhum.

---

## Item 1 da tarefa — os 8 elementos "porta faltando" (`aria-controls`, G2; mesma intenção ao mesmo tratador, G3)

Lista tirada da DCS-020 e do commit `81be75c7`. Conferidos um a um no código atual.

| # | Elemento | Camada ligada por `aria-controls` (G2) | Mesma intenção ao mesmo tratador (G3) |
|---|---|---|---|
| 1 | form da banda digitada, `src/editor/canvas/edit-handles.tsx:266` `<form ref={form} className="chrome__band-field" ...` | não há camada; o campo entra no registro por `held-draft.ts` (a lacuna "ao sair" do DEF-0514 vale para ele) | sim: `src/editor/canvas/edit-handles.tsx:241` despacha `entry.command.id` com `{ ...entry.door.args, ...stands, [valueArg(entry)]: text }`; o arraste: `src/editor/input/pointer/events.ts:314` `ps.spacing.gesture.dispatch(ps.spacing.entry.command.id as CommandId, { ...ps.spacing.entry.door.args, ...ps.spacing.args, [ps.spacing.valueArg]: `${value}px` } as never);` (o texto vai cru, o tratador o lê) |
| 2 | corpo do quadro lateral, `src/editor/canvas/side-frame.tsx:81` `<div className="side-frame__body" ref={body} onClick={door.run} aria-hidden>` | não há campo nem camada | sim: o mesmo `door.run` do cabeçalho, `src/editor/canvas/side-frame.tsx:75` (`onClick={door.run}`) |
| 3 | form "+ Classe", `src/editor/shell/class-bar.tsx:130` | camada em portal sem `aria-controls`; o campo é local (`data-local`), fora do registro: DCS-021 | sim: `run` de `src/editor/shell/class-bar.tsx:89` `const run = useTyped(APPLY, 'className');`, o mesmo dos itens com `data-door` |
| 4 | form "Salvar como classe", `src/editor/shell/class-bar.tsx:173` | idem ao 3 (campo local, DCS-021) | sim: `src/editor/shell/class-bar.tsx:145` `const run = useTyped(SAVE, 'name');` |
| 5 | botão de predefinido da curva, `src/editor/shell/easing-curve.tsx:88` | **não ligado**: o botão que abre a camada não tem `aria-controls` (`src/editor/shell/easing-curve.tsx:59` só `aria-haspopup="dialog" aria-expanded={open}`) e a camada vai para o `body` (`src/editor/shell/popover.tsx:84` `return createPortal(`) | sim: `run` é o `runWith` do campo (`panel-field.tsx:151`) |
| 6 | form dos pontos da curva, `src/editor/shell/easing-curve.tsx:97` | idem ao 5 | sim: `src/editor/shell/easing-curve.tsx:103` `if (valid) run(bezier);` (o `valid` decide só se o Bézier existe; o botão de envio fica desabilitado sem ele) |
| 7 | botão Aplicar da curva, `src/editor/shell/easing-curve.tsx:123` | idem ao 5 | sim (envio do form 6) |
| 8 | form da guia nova, `src/editor/shell/guides-grids.tsx:101` | não há camada em portal (o form é filho do botão de abrir); o campo é local: DCS-021 | sim depois do DEF-0515 (`guides-grids.tsx:82`); a porta é `src/editor/shell/guides-grids.tsx:89` `data-door={entry.ref}` |

**Efeito da curva sem `aria-controls` (elementos 5 a 7):** com texto digitado no campo de painel, o toque no botão da curva fica dentro da linha (não grava), mas o foco sai do campo e o blur grava o texto (`panel-field.tsx:146`) antes de a camada abrir. Não há perda (G2 sem achado); o texto digitado vira um passo de undo antes da escolha da curva. Se a camada estivesse ligada, o registro (`src/editor/input/pending.ts:58`) a trataria como parte do campo só para toques e comandos; o blur grava de qualquer forma.

---

## Resumo

| Registro | Veredito | Achado principal |
|---|---|---|
| DEF-0512 | parcial | o zeramento só roda quando o compositor fecha; `layout.enter` com ele aberto troca o contêiner e o primeiro desenho do novo usa a caixa do anterior (sonda: `firstOnB` 10px,20px, medido 300px,400px); o registro aponta `lifetime.test.ts` como detector, que é `composer.test.ts` |
| DEF-0513 | parcial | correção confere (M49 e M50 acusados); o detector não passa pela porta clicada (`door.tsx`, sem mutante) e o ramo "breakpoint" não distingue o defeito |
| DEF-0514 | parcial | blur e toque fora gravam (M52 a M54 acusados); "ao sair" não grava porque a limpeza lê a ref já nula: Esc no diálogo Guias e grades fecha sem gravar e o valor entra no próximo toque; a banda desmontada perde o 12 e mostra `status.value.invalid` depois |
| DEF-0515 | confirmado | `typedNumber` envia `NaN`, a checagem de argumentos recusa com aviso; M55 e M56 acusados |
| DCS-017 | confirmado | gesto e grupo devolvem documento, seleção e histórico; o `ui` fica, como dito |
| DCS-018 | confirmado | a mensagem leva só tecla e modificadores; o editor confere `event.source` |
| DCS-019 | parcial | comportamento confere; o soltar de arquivo confere só a existência do alvo, não a mesma regra |
| DCS-020 | parcial | os 8 elementos conferem com G3; a citação `panel-field.tsx:144` está na linha 151 |
| DCS-021 | confirmado | camada e campo locais descartam o texto ao fechar |
| Item 1 (8 elementos) | parcial | G3 confere nos 8; a camada da curva (5 a 7) não está ligada por `aria-controls`, sem perda porque o blur grava; a G2 do 1 herda a lacuna "ao sair" do DEF-0514 |
