# Grupo K — cumprimento das tarefas e do plano

Verificador do grupo K, 2026-10-09. Conferido contra o repositório no commit `ae24ee7e` (ramo `estrutura/edicao-e-espaco`), com `auditoria/progresso.md` modificado e não comitado (a seção "Verificação da entrega" e a da verificação integral).

Rodado nesta verificação (saídas em `scratchpad/k/`):
- `npx vitest run --config tools/runner/model/vitest.config.ts`: `Test Files  22 passed (22)`, `Tests  61 passed (61)`, 33,8 s (máquina com outros verificadores rodando ao mesmo tempo), saída 0.
- `npm run typecheck`: saída 0. `npm run lint`: saída 0. `npm run manifest:check`: `manifest:check passed.`, saída 0.
- `BUILDER_MUTANT=M15 npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/pages.test.ts`: `× as páginas e a abertura de projeto seguem o modelo do manifesto`, `Tests  1 failed (1)` (acusado).
- Playwright não foi rodado (proibido pelas instruções): toda afirmação sobre testes de navegador abaixo vem dos logs de `.cache/` e do código dos testes, e está marcada assim.

Fonte da escolha do dono para as decisões (item 4): a instrução "Execução final" colada pelo dono na sessão `94ca8cb7-3c3f-459e-af83-8e99c02fb5a7` (2026-10-08T19:50Z), seção "DECISÕES DO DONO". Não há cópia dela em disco no repositório; a única gravação é `auditoria/decisoes.md`.

---

## K1 — `deepseek-tarefa-1-feita.md` (a primeira Tarefa do DeepSeek)

- **Veredito:** parcial.

### K1.1 — `CLAUDE.md`: seção 9 (travas) apagada
- **Confere.** `git show bd52de1f -- CLAUDE.md` tira o bloco `## 9. Travas automáticas (`.claude/`, do dono)` inteiro e renumera `## 10. Ambiente e armadilhas` para `## 9.` (`CLAUDE.md:193` `## 9. Ambiente e armadilhas`).

### K1.2 — `CLAUDE.md`: passos 3 e 4 da seção 2 trocados pela regra nova
- **Confere no texto.** `CLAUDE.md:40` `3. **Depois de alterar:** rode os detectores da área (`npx vitest run --config tools/runner/model/vitest.config.ts`), `npm run typecheck` e `npm run lint`; todo defeito corrigido ganha um mutante no catálogo que o detector acusa antes da correção e não acusa depois.` — igual, palavra por palavra, ao texto pedido. Os antigos 3 ("re-rastreie… atualize `fluxos/`, `interacoes/`") e 4 ("`node tools/audit/check.mjs`… zero pendências") saíram; os passos 5 e 6 viraram 4 e 5.
- **Mudanças além do pedido, no mesmo commit:** a frase de abertura (o que prova o app), a "Linguagem de conclusão" da seção 3 e a linha "Verificador da auditoria" da tabela da seção 6 trocadas para os detectores. São coerentes com a decisão.
- **Achado (inconsistência que ficou):** o resto do `CLAUDE.md` ainda manda manter registros que a decisão parou: `CLAUDE.md:38` `- identifique em `auditoria/estado.md` os itens de estado que a alteração toca.` (o `estado.md` não é mais atualizado); a seção 0 ainda lista `estado.md`, `entradas.md`, `inventario-arquivos.md` e `matriz.md` como memória do trabalho; o passo 4 da seção 2 ainda exige "rastreamento registrado com citação"; a seção 7 descreve `fluxos/`, `matriz.md` e `interacoes/`; `CLAUDE.md:58` `- **Sem testes:** não rode a suíte de testes e não crie testes.` contradiz a criação dos detectores (resolvida só em `auditoria/decisoes.md`, DCS-014). Efeito: quem segue o `CLAUDE.md` à risca é mandado a ler um `estado.md` desatualizado e a não criar o detector que o passo 3 exige.

### K1.3 — `progresso.md`: seção "Procedimentos" trocada pela mesma regra
- **Confere.** `git show bd52de1f -- auditoria/progresso.md` tira os procedimentos de `recitar.mjs`, `inventariar.mjs`, `matriz.mjs`, `renumerar.mjs`, `esqueletos.mjs` e `check.mjs` e põe a regra como primeiro item (`auditoria/progresso.md:59`, o mesmo texto do `CLAUDE.md:40`). Ficaram dois itens a mais (como rodar os detectores e os mutantes; não usar `sed`), compatíveis com a regra.
- **Observação:** o "Histórico" (`auditoria/progresso.md:87` e `:93`) ainda descreve `recitar.mjs` como "Procedimento novo, obrigatório"; está sob o título "Histórico (não é o estado atual)", então não contradiz o estado.

### K1.4 — `progresso.md`: decisão registrada com a data
- **Confere, com referência quebrada.** `auditoria/progresso.md:7` `**Decisão do dono (2026-10-08), registrada em `deepseek-tarefa.md`:**`.
- **Achado:** o arquivo citado mudou de nome. `git show --stat 454de31b` mostra `deepseek-tarefa.md => deepseek-tarefa-1-feita.md`; o `deepseek-tarefa.md` de hoje é outra tarefa (a parte visual e de navegador, não versionada). Efeito: quem abre o arquivo citado na linha 7 lê uma tarefa que não contém a decisão. As linhas 11 e 39 citam `deepseek-tarefa.md` já como a segunda tarefa, então a mesma referência significa dois arquivos diferentes no mesmo arquivo.

### K1.5 — "Não atualize citações, fluxos, pares, `estado.md`, `entradas.md` nem `inventario-arquivos.md`"
- **Não confere no commit do item 1.** `git show --stat 81be75c7` (item 1, 232 arquivos) muda `auditoria/entradas.md` (230 linhas), `auditoria/estado.md` (138), `auditoria/estado/L07.md`, `L09a.md`, `L09b.md`, `auditoria/entradas/*.md`, 18 arquivos de `auditoria/fluxos/trechos/` e pares de `auditoria/interacoes/`. O diff de `auditoria/estado.md` é reposicionamento de citação, por exemplo `-  - `src/editor/canvas/edit-handles.tsx:285` …` para `+  - `src/editor/canvas/edit-handles.tsx:321` …` — o trabalho do `recitar.mjs`, que a tarefa mandou parar. O commit da decisão (`bd52de1f`, 20:47:33) e o do item 1 (`81be75c7`, 20:47:38) têm 5 s de diferença; não há como saber, pelo repositório, se as citações foram reposicionadas antes ou depois de a tarefa chegar.
- Depois do item 1, nenhum commit toca esses registros (`git show --stat` de `880a3b8c` a `ae24ee7e`): confere.

### K1.6 — item 1 da tarefa: os 8 elementos "porta faltando" (G2 por `aria-controls` e G3)
- **Parcial.** A G3 está registrada para os 8 em `auditoria/decisoes.md`, DCS-020 (linhas 164 a 169), e os dois achados viraram DEF-0514 (G2) e DEF-0515 (G3), com o grupo `drafts` (`tools/runner/model/drafts.test.ts`) e os mutantes M52 a M56 em `tools/runner/mutants.ts`.
- **Achado:** a tarefa pedia conferir "se o popover está ligado ao campo por `aria-controls` (G2)". Nenhum registro fala disso: `grep -c aria-controls` dá 0 em `auditoria/decisoes.md`, `defeitos.md` e `mecanismos.md`. No código, o popover da curva de atenuação (elementos 5 a 7) é um portal (`src/editor/shell/popover.tsx:84` `return createPortal(`) aberto por um botão sem `aria-controls`: `src/editor/shell/easing-curve.tsx:59` `<button ref={trigger} type="button" className="easing-curve__button" aria-haspopup="dialog" aria-expanded={open} …>`, e o popover não tem `id` (`src/editor/shell/popover.tsx:83` `const common = { className: …, role, 'aria-label': label, 'data-key-context': keyContext, style, onClick };`). O limite do campo do registro de pendências só alcança o que um `aria-controls` aponta (`src/editor/input/pending.ts:56` `const controls = [typing.region, ...typing.region.querySelectorAll('[aria-controls]')];`). Logo, pelo código, um toque dentro do popover da curva está fora do campo de painel que o hospeda. O efeito disso numa digitação pendente no campo de painel (gravação forçada antes de a curva rodar) **não verificado**: exige o navegador.

### K1.7 — item 2 da tarefa: a parte sem navegador do C8
- **Confere quanto à existência**, commit `880a3b8c`: chaves de i18n (`tools/runner/model/i18n.test.ts:42` `it('têm as mesmas chaves, nos dois sentidos', () => {`), corpus de importação contra XSS (`tools/runner/model/import.test.ts:58` `it('recusa todo atributo que executa, e guarda os que não executam', () => {`), corrupção e migração (`tools/runner/model/storage.test.ts:21` `describe('o que é salvo, contra corrupção e migração', () => {`), ReDoS (`tools/runner/model/robustness.test.ts:55` `it('nunca é lançado e nunca demora, em nenhuma propriedade', () => {`), poluição de protótipo (`tools/runner/model/robustness.test.ts:100` e `:119`, e `import.test.ts:94`), compatibilidade (`tools/runner/model/compat.test.ts:60` `describe('o que o app exige dos navegadores', () => {`), contadores de render em happy-dom (`tools/runner/model/render.test.ts:1` `// @vitest-environment happy-dom`). Achados viraram DEF-0516 e DEF-0517 (status `corrigido`, mutantes M57, M58, M65).
- **Achado (alcance do contador de render):** o grupo `render` tem um caso só e mede uma vista sintética escrita no próprio teste (`tools/runner/model/render.test.ts:54` `const View = () => {` com `useEditorState((s: EditorState) => s.selection.length)`), não uma vista do app. Ele prova a assinatura por fatia do `useEditorState`; não conta os redesenhos de nenhum componente do editor por ação (o que o relatório pede em C8, "re-render desnecessário", e a Fase 9 do `PROMPT.md`).

### K1.8 — commits locais por item, só com os arquivos mudados
- **Parcial.** Um commit por item: `bd52de1f` (decisão), `81be75c7` (item 1), `880a3b8c` (item 2), mais `e06318c3` (números do progresso). Sem push: `git remote -v` vazio.
- **Achado:** `bd52de1f` versiona `deepseek-tarefa.md` (47 linhas), arquivo do dono que o executor não escreveu. `81be75c7` leva os registros de citação do K1.5.

### K1.9 — "Fim" da primeira tarefa
- **Confere no registro da época.** `auditoria/progresso.md:69` `### Fim da Tarefa do DeepSeek (2026-10-08)` com a taxa de acusação (`:71`, 66 mutantes, 63 acusados, 3 equivalentes, 100,0% dos não equivalentes) e a seção "Para o Claude" (no `bd52de1f`, a lista da etapa 4 e das partes de navegador da etapa 5). Detectores, typecheck e lint de hoje: sem falha (saídas acima).

---

## K2 — `deepseek-tarefa.md` e `claude-tarefa.md` (parte de processo)

- **Veredito:** parcial.
- **Relação entre as duas:** `claude-tarefa.md` (21:31) e `deepseek-tarefa.md` (21:34) pedem os mesmos 5 itens; o andamento só registra a do DeepSeek (`auditoria/progresso.md:11`); `claude-tarefa.md` não é citado em nenhum registro. As duas não são versionadas (`git status`: `?? claude-tarefa.md`, `?? deepseek-tarefa.md`). Abaixo, um item só para as duas.

### K2.1 — commit local por item
- **Parcial.** Commits: `454de31b` (item 1), `cb59b928` (item 2), `1bc2d094` (item 3), `1f0b094a` (item 4), `7b8636db` (item 5), `d27e4ae6` (item 2, fotos por condição), `0c0e5423`, `fb88ff40` (item 5), `ad520c29`, `ae24ee7e` (DEF-0522). Sem push.
- **Achados:**
  - `1f0b094a` (item 4) leva os registros do item 5: o diff de `auditoria/defeitos.md` desse commit acrescenta `## DEF-0522 — o painel rápido fica preso na memória depois de fechar` e `## DEF-0523 — a medição dos quadros longos…`; `7b8636db` (item 5) só tem `tests/e2e/lote-navegador.spec.ts`. Um item não ficou num commit só.
  - `454de31b` (item 1) leva a troca de nome `deepseek-tarefa.md => deepseek-tarefa-1-feita.md`, que não é do item.
  - `1bc2d094` (item 3) reescreve o `package.json` inteiro (`157 +++++------`) para acrescentar uma linha: o arquivo passou de CRLF para LF (`git show 1bc2d094^:package.json | od -c` dá `{  \r  \n`; o novo, `{  \n`; `git diff --ignore-cr-at-eol` dá `1 insertion(+)`, o script `ui-fit:measure`). Fere `CLAUDE.md` seção 9 ("preserve o final de linha de cada arquivo").

### K2.2 — "Fim": detectores, typecheck, lint e `manifest:check`
- **Confere hoje:** 22 arquivos e 61 testes; typecheck, lint e `manifest:check` com saída 0 (saídas acima).
- **"Todos os testes de navegador deste arquivo passando nas duas condições":** não verificado por execução (Playwright proibido nesta verificação). Pelos logs: `.cache/final-item4-default.log` e `-windows.log` `63 passed`, `.cache/final-item5-*.log` `7 passed`, `.cache/final-item2-*.log` `25 passed`, todos entre 23:00 e 23:13 de 2026-10-08, antes da mudança de `src/editor/canvas/quick-panel.tsx` (`ae24ee7e`, 23:55). `.cache/def0522-windows2.log` (23:45) termina com `1 failed` / `76 passed`, a falha no caso dos quadros longos (`lote-navegador-nenhum-quad-…-desfazer-e-trocar-de-página`); `.cache/final5w2.log` (23:52) dá `7 passed`. A rodada posterior é a da verificação do Claude de 2026-10-09 (`.cache/v-item4-*.log`, `63 passed`).

### K2.3 — seção "Para o Claude" do `progresso.md` com só o que não deu, com o motivo
- **Não confere.** `auditoria/progresso.md:63` a `:66` lista três coisas. Faltas e afirmações erradas, conferidas no código:
  - `auditoria/progresso.md:64` diz que "os 164 restantes foram comparados com o desenho do zero e com a exportação". No teste, um comando sem porta com argumentos roda só a seleção e conta como rodado: `tests/e2e/lote-visual.spec.ts:212` `const commands: TestBootCommand[] = ref === null ? [SELECT] : [SELECT, run(ref)];` e `:225` `const ranTheEdit = ref === null ? results.length > 0 : results[results.length - 1]?.status === 'done';`. A exportação só é comparada no caso separado `tests/e2e/lote-visual.spec.ts:253` `test('o canvas e a exportação desenham as mesmas propriedades calculadas', …`, com o documento sem edição (`openEditor(page, { project: DEEP })`), nunca por comando. A tarefa pedia "compare também com a exportação" para cada comando: não feito e não listado.
  - O item 4.2 da tarefa pedia conferir "toda porta que o inventário dá para aquela região está montada": o caso só tem três asserções (`tests/e2e/lote-visual.spec.ts:156` a `:158`: portas desconhecidas, região errada, sem marca); a conferência pedida não existe e não está listada.
  - A busca dos controles visita só `document.querySelectorAll('[data-door],[data-local],[role],[tabindex]')` (`tests/e2e/lote-visual.spec.ts:82`): um `<button>` ou `<input>` sem nenhuma dessas marcas nunca é conferido. Não listado.
  - Achado de proibição no código novo: `tests/e2e/lote-visual.spec.ts:218` a `:222` é um `try { await openEditor(…) } catch { // comentário }` sem instrução no `catch` (try/catch vazio, proibido pelo `CLAUDE.md` seção 3).
  - O DEF-0522: `auditoria/progresso.md:39` diz "(o DEF-0522 aberto entre eles)" e manda à seção "O que não deu", que não existe com esse nome; a seção "Para o Claude" não o lista. `auditoria/defeitos.md:374` dá `- **Status:** corrigido`. A seção "Verificação da entrega" (não comitada, `auditoria/progresso.md:45` em diante) afirma que a correção não fecha o que diz; o conteúdo técnico do DEF-0522 é de outro grupo.

### K2.4 — `claude-tarefa.md`, "Fim": "Lote do navegador sem achados abertos" e "relatório curto"
- **Não verificado por execução** (Playwright proibido). Em registro, os achados abertos que a "Verificação da entrega" lista (`auditoria/progresso.md:45` a `:53`) contradizem "sem achados abertos".

---

## K3 — etapas 0 a 7 do plano (`auditoria/investigacao/relatorio.md`, seção 4) e Fase 9

O `progresso.md` numera as etapas pela instrução "Execução final" do dono (etapa 1 = relatório 0 e 1; etapa 3 = relatório 2, 3 e 4; etapa 4 = relatório 5; etapa 5 = relatório 6 e 7) e acrescenta uma etapa 0 (as decisões). `auditoria/plano-execucao.md` não define etapas: só as Fases 1 a 9 (`auditoria/plano-execucao.md:1166` a `:1175`). A conferência abaixo segue a numeração do relatório.

- **Veredito:** parcial.

| etapa do relatório | o que pedia | no repositório | veredito |
|---|---|---|---|
| 0 | modelo da store e do histórico, catálogo de mutantes, invariantes em DEV, prova de remoção em produção | `tools/runner/model/` (22 arquivos de teste e `harness.ts`), `tools/runner/mutants.ts` (68 ids `M01` a `M68`, únicos), `src/core/history/invariants.ts`, `tools/runner/production-probe.ts`, todos criados em `253b9a36` | confere |
| 1 | seletor de impacto ligado aos modelos e ao catálogo; regra "cada defeito entra com um mutante" no procedimento de `auditoria/defeitos.md` | `tools/impact/detectors.ts` (criado em `253b9a36`); a regra está em `CLAUDE.md:40` e `auditoria/progresso.md:59`, mas `auditoria/defeitos.md` não tem procedimento: a linha 1 é `# Defeitos` e a 3 já é `## DEF-0001` | parcial |
| 2 | contratos de campo e porta `css` pelo lexer (C5); passo de carga de projeto e de troca de breakpoint no modelo | `tools/runner/contracts.ts`, `tools/runner/css-lexer-port.ts`, `tools/runner/model/fields.test.ts`; carga: `tools/runner/model/pages.test.ts:14` `...LOAD_STEPS,` e M15 acusado (rodado acima); troca de breakpoint: `tools/runner/model/harness.ts:420` `if (breakpoint !== undefined) dispatch('view.setBreakpoint' as CommandId, { breakpoint: breakpoint.id });` | confere |
| 3 | inventário gerado e `builder/interactive-owner` com os 81 | `manifest/generated/inventory.json`, `tools/lint/interactive-allowed.ts`, `eslint.config.js:131` `rules: { 'builder/interactive-owner': 'error' },` | confere (a classificação é de outro grupo) |
| 4 | máquina de modos e escopo de vida (C6), tabelas no mapa gerado (C3) | `src/editor/input/modes.ts`, `eslint.config.js:140` `rules: { 'builder/listener-scope': 'error' },`, `tools/map/`, `manifest/generated/behavior.json` | confere |
| 5 | largura de texto pela fonte e larguras por região (C4); lote único do navegador **por impacto** | `tools/ui-fit/font.ts`, `check.ts`, `manifest/generated/ui-widths.json`; o lote foi rodado como lista fixa de arquivos (`deepseek-tarefa.md`, item 4.1), não escolhido pelo seletor; `.cache/impact` não existe e `.cache/e2e-coverage/` é de 2026-10-07 (anterior aos testes novos), então o seletor não tem mapa que escolha `lote-visual.spec.ts` ou `lote-navegador.spec.ts` por linha mudada | parcial |
| 6 | contadores de render (`<Profiler>`), Long Animation Frames **nas corridas de `tools/perf/`**, sonda de memória pelo CDP | `<Profiler>`: `tools/runner/model/render.test.ts:9`, uma vista sintética (K1.7); LoAF e memória pelo CDP: só em `tests/e2e/lote-navegador.spec.ts`; `git log -- tools/perf` dá só `8c71d650 Estado de partida`: nenhuma corrida de `tools/perf/` ganhou LoAF | parcial |
| 7 | catálogo C8 sem navegador e a parte de navegador **por impacto** | sem navegador: K1.7; navegador: `tests/e2e/lote-navegador.spec.ts` (7 casos), sem ligação ao seletor de impacto além de ser um arquivo de `tests/e2e/` | parcial |

### K3.1 — `auditoria/mecanismos.md`: tempo medido de cada mecanismo
- **Achado:** a instrução do dono manda registrar "ao final, o tempo medido" de cada mecanismo. `auditoria/mecanismos.md:63` (MEC-05) e `:74` (MEC-06) dizem `- **Tempo medido:** a medir.`

### K3.2 — Fase 9 do `PROMPT.md` (otimização)
- **Não confere.** `auditoria/otimizacoes.md` não existe (`ls`: "No such file or directory"). Nenhuma otimização está registrada noutro lugar: `grep -i "otimiza\|OTM-"` em `progresso.md`, `defeitos.md`, `mecanismos.md` e `decisoes.md` só acha a menção a `otimizacoes.md` não existir (`auditoria/progresso.md:41`); nenhum commit de `253b9a36` em diante fala de otimização; nenhuma medida de antes e depois de mudança de código da aplicação. A Fase 9 pede re-renders, leituras de layout em sequência, operações na árvore, ouvintes e tamanho do bundle; nenhum foi tratado.
- **Achado relacionado:** o DEF-0523 registra quadros de 70,3 ms e 92,2 ms num arraste e a causa no código (`src/editor/input/pointer/events.ts:235` processa cada movimento sem juntar os de um quadro); a correção mudou só o teste (o passo do mouse). O custo por evento de movimento, candidato da Fase 9, ficou sem registro de otimização.
- **Achado de registro:** a tabela do `progresso.md` dá a etapa 5 (Fase 9) como `feita` (`auditoria/progresso.md:25`), sem otimização feita.

---

## K4 — decisões D-A a D-E e DCS-009 a DCS-014

- **Veredito:** parcial.

| decisão | escolha do dono (instrução "Execução final") | gravada | código |
|---|---|---|---|
| D-A / DCS-009 | "opção 1. Desfazer e refazer devolvem o breakpoint, o estado, a classe e o quadro-chave" | `auditoria/decisoes.md:73` `- **Escolhida:** (1).` | confere: `src/core/history/transaction.ts:25` `readonly context?: EditContext;` e `src/core/store/store.ts:483` `const ui = tx.context !== undefined && options.restoreContext !== undefined ? options.restoreContext({ ...state, ...restored }, tx.context) : state.ui;`, ligado em `src/editor/store.ts:152` `restoreContext: restoreEditContext,` |
| D-B / DCS-010 | "opção 1. O histórico não sobrevive a recarregar a página" | `auditoria/decisoes.md:80` `(1)` | confere: o autosave não grava o histórico; `src/editor/persistence/autosave.ts:11` diz que o histórico começa vazio |
| D-C / DCS-011 | "opção 1. Nenhuma dependência nova" | `auditoria/decisoes.md:87` `(1)` | confere nas dependências: comparando `package.json` de `0c22cd6e` com o atual, nenhuma entrada de `dependencies` ou `devDependencies` mudou (só o script `ui-fit:measure`). **Achado de registro:** `auditoria/decisoes.md:88` diz "a contagem de ouvintes é de `src/editor/input/scope.ts`"; o arquivo não existe (`ls src/editor/input/` não o lista). O que existe é a regra de lint `builder/listener-scope` (MEC-09) |
| D-D / DCS-012 | "opção 2, com uma fonte de licença livre (SIL Open Font License)… Registre a fonte escolhida, a licença e o motivo" | `auditoria/decisoes.md:93` (Source Sans 3, 400 e 600), `:94` (licença), `:96` a `:100` (motivo medido) | confere: `src/ui/fonts/SourceSans3-Regular.ttf`, `SourceSans3-Semibold.ttf`, `OFL.txt` (`Copyright 2010-2024 Adobe…`), `src/ui/tokens.css:22` `--font-ui: "Source Sans 3", system-ui, sans-serif;`. A `:95` ("Comportamento atual") ainda cita a Segoe UI, a linha de antes |
| D-E / DCS-013 | "opção 2. Um segundo toque com o gesto aberto cancela o gesto aberto e começa o novo" | `auditoria/decisoes.md:107` `(2)`, sem restrição | **parcial:** o código só faz isso para o **mesmo** ponteiro: `src/editor/input/pointer/machine.ts:88` `if (event.type === 'down' && event.pointer === machine.pointer) return { … effect: 'restart' };` e `:90` `if (event.type === 'down' || event.pointer !== machine.pointer) return { machine, effect: null };` (comentário `:89`: "another pointer (a second finger, a pen) does not join the gesture"). Efeito: com um arraste aberto por um dedo, o toque de um segundo dedo ou de uma caneta é ignorado, e o gesto aberto continua. A restrição está no título do DEF-0510 ("o segundo toque do mesmo ponteiro"), não na DCS-013 |
| DCS-014 | (derivada da instrução de construir os mecanismos) | `auditoria/decisoes.md:114` `(b)` | confere: os caminhos de `:115` existem, menos `tools/runner/field-contracts.test.ts` (o contrato de campo está em `tools/runner/model/fields.test.ts`) |

---

## K5 — consistência do `auditoria/progresso.md` consigo e com `defeitos.md` e `mecanismos.md`

- **Veredito:** não confere.

| afirmação no `progresso.md` | conferido | resultado |
|---|---|---|
| `:27` "30 registrados" | `grep -c '^## DEF-' auditoria/defeitos.md` = 33 (DEF-0001 a 0008, 0286, 0289, 0501 a 0523) | **não confere** |
| `:27` "1 com status aberto (DEF-0522…)" | `auditoria/defeitos.md:374` `- **Status:** corrigido`; os 33 estão `corrigido` | **não confere**; e `:16` diz "Achou e corrigiu o DEF-0522", contradizendo `:27` e `:39` no mesmo arquivo |
| `:28` e `:29`, listas de defeitos com detector e de registro | somadas dão 32; falta o DEF-0522 | consequência da linha anterior |
| `:31` "MEC-01 a MEC-22… 22 grupos, 61 testes" | `mecanismos.md` vai até `## MEC-22`; a rodada desta verificação dá 22 arquivos e 61 testes | confere (o tempo de 9,2 s não foi reproduzido: 33,8 s com a máquina carregada) |
| `:33` "68 mutantes, 65 acusados, 3 equivalentes… 114,4 s" | `tools/runner/mutants.ts`: 68 ids, 3 com `equivalent:` (`:58`, `:74`, `:80`); `.cache/mutants-final4.log` (23:55) `mutantes: 68; acusados: 65; … total 114.4 s` | confere com o log; `:41` (não comitado) traz 122,2 s e põe o M19 "em conferência" |
| `:37` lista de commits | para em `1bc2d094`; faltam `9fe0f393`, `880a3b8c`, `e06318c3`, `1f0b094a`, `7b8636db`, `d27e4ae6`, `0c0e5423`, `fb88ff40`, `ad520c29`, `ae24ee7e`; `bd52de1` e `81be75c` aparecem como "etapas 1 a 3 e o item 1 da Tarefa antiga" | **não confere** |
| `:39` "o que fica é a seção 'O que não deu', abaixo" | não há seção com esse nome; a de `:63` chama-se "Para o Claude (o que não deu…)" | não confere |
| `:24` e `:25`, etapas 4 e 5 `feita` | K3: lote não escolhido por impacto, LoAF fora de `tools/perf/`, Fase 9 sem otimização | não confere |
| `:64` "os 164 restantes foram comparados com o desenho do zero e com a exportação" | K2.3 | não confere |
| `:7` decisão "registrada em `deepseek-tarefa.md`" | K1.4 | referência quebrada |
| `:35` e `:44` "os mutantes M67 e M68 são acusados" | `auditoria/mecanismos.md` (MEC-19, MEC-20) diz o mesmo; não rodados aqui (o grupo de mecanismos confere) | consistente entre os registros |

---

## K6 — palavras proibidas (`CLAUDE.md` seção 3)

- **Veredito:** confere.
- Busca por palavra inteira, com e sem os trechos entre crases, de "etc.", "e assim por diante", "similar", "mesmo padrão", "análogo", "presumivelmente", "provavelmente", "deve funcionar", "aparentemente" em `auditoria/progresso.md`, `auditoria/defeitos.md`, `auditoria/mecanismos.md` e `auditoria/decisoes.md` (script `scratchpad/k/proibidas.mjs`): nenhuma ocorrência.

---

## Resumo

| item | veredito | achado principal |
|---|---|---|
| K1 — primeira tarefa do DeepSeek | parcial | `CLAUDE.md` e "Procedimentos" trocados como pedido, mas o commit do item 1 (`81be75c7`) reposicionou citações em `estado.md`, `entradas.md`, fluxos e pares, o que a tarefa proibia; a conferência por `aria-controls` não foi registrada (o popover da curva não tem `aria-controls`); `progresso.md:7` cita `deepseek-tarefa.md`, que hoje é outra tarefa |
| K2 — processo das tarefas visual/navegador | parcial | commits misturam itens (DEF-0522 e DEF-0523 no commit do item 4), `package.json` trocado de CRLF para LF; a seção "Para o Claude" afirma comparação com a exportação para 164 comandos, quando o teste compara a exportação só no documento sem edição e todo comando sem porta com argumentos roda só a seleção e conta como rodado (149 de 203 pela "Verificação da entrega"; o número não foi recontado aqui), e omite a conferência "toda porta do inventário montada", que não existe |
| K3 — etapas 0 a 7 e Fase 9 | parcial | etapas 0, 2, 3 e 4 existem; regra do mutante ausente de `defeitos.md`; lote do navegador sem seleção por impacto; LoAF fora de `tools/perf/`; render com vista sintética; MEC-05 e MEC-06 sem tempo; Fase 9 sem nenhuma otimização e `otimizacoes.md` inexistente |
| K4 — decisões D-A a D-E, DCS-009 a DCS-014 | parcial | gravadas como o dono escolheu e D-A a D-D implementadas; D-E implementada só para o mesmo ponteiro (segundo dedo ou caneta continuam ignorados, sem registro na DCS-013); DCS-011 cita `src/editor/input/scope.ts`, que não existe |
| K5 — consistência do `progresso.md` | não confere | 30 defeitos contra 33 em `defeitos.md`; DEF-0522 "aberto" contra `corrigido` em `defeitos.md` e na linha 16 do próprio arquivo; lista de commits para em `1bc2d094` (faltam 10); etapas 4 e 5 dadas como feitas |
| K6 — palavras proibidas | confere | nenhuma ocorrência nos quatro registros |
