# Progresso — memória do trabalho

Este arquivo é a memória do trabalho e a única fonte para retomar. A seção **Estado atual** é o estado; tudo abaixo de **Histórico** é registro do que já passou e não descreve o estado de agora. Leia-o por inteiro antes de qualquer trabalho e grave nele o avanço depois de cada passo (CLAUDE.md, seção 0).

## Estado atual (2026-10-08)

**Decisão do dono (2026-10-08), registrada em `deepseek-tarefa.md`:** a manutenção dos registros de `auditoria/` — citações, inventário, fluxos, matriz, pares, `check.mjs` — para. Não se rodam mais `recitar.mjs`, `inventariar.mjs`, `matriz.mjs`, `renumerar.mjs`, `esqueletos.mjs` nem `check.mjs`; não se atualizam citações, fluxos, pares, `estado.md`, `entradas.md` nem `inventario-arquivos.md`. A prova de que o app funciona passa a ser: os detectores (`npx vitest run --config tools/runner/model/vitest.config.ts`), `npm run typecheck` e `npm run lint`. Continuam em uso: este arquivo (andamento), `auditoria/defeitos.md` (cada defeito, com a correção e o mutante) e `auditoria/mecanismos.md` (cada mecanismo novo).

Instrução em vigor: a "Tarefa do DeepSeek" — **item 1 feito** (os 8 elementos classificados como "porta faltando": nenhum é porta que falta no manifesto; a categoria "parte de porta" ficou em DCS-020, e o rastreamento achou o DEF-0514, G2, e o DEF-0515, G3, os dois corrigidos com o grupo `drafts` e os mutantes M52 a M56) e **item 2 feito** (a parte sem navegador do C8: os grupos `robustness`, `storage`, `i18n`, `import`, `compat` e `render`, MEC-13 a MEC-18, com os DEF-0516 e DEF-0517 corrigidos). Sem nada visual nem de navegador; a etapa 4 inteira e as partes de navegador da etapa 5 estão na seção "Para o Claude", no fim deste arquivo.

**Instrução em vigor (nova, 2026-10-08): a "Tarefa do DeepSeek: a parte visual e de navegador"** (`deepseek-tarefa.md`, 5 itens, a lista da seção "Para o Claude"). Andamento:
- **Item 1 (DEF-0518) feito:** os dois artefatos gerados (`generated/behavior.json`, `generated/inventory.json`) entraram em `SINGLE_FILES` com um esquema zod cada, o grupo `manifest` (MEC-19) e o mutante M67. `npm run manifest:check` passa.
- **Item 2 (fonte da interface, DCS-012) feito:** os TTF (pesos 400 e 600) e o `OFL.txt` em `src/ui/fonts/`, baixados de `github.com/adobe-fonts/source-sans`, ramo `release`, pasta `TTF/` (o scratchpad com os arquivos citados em `progresso.md` não existia mais); dois `@font-face` em `src/ui/tokens.css`, com `font-display: swap`, e `--font-ui: "Source Sans 3", system-ui, sans-serif`. Os cinco testes de tela passam na condição padrão e os quatro outros (fora o `visual`) na condição Windows; as 14 fotos de referência do `visual.spec.ts` foram olhadas uma a uma (a diferença é só de glifo — nada cortado, coberto ou desalinhado) e atualizadas. Nenhum DEF- pela fonte nova.
- **Itens 3 a 5:** medição de texto (C4), lote do navegador e as partes de navegador da etapa 5 — em andamento (item 3).

| etapa | conteúdo | estado |
|---|---|---|
| 0 | decisões D-A a D-E gravadas (`decisoes.md`, DCS-009 a DCS-014) | feita |
| 1 | modelo da store (`tools/runner/model/`), catálogo de mutantes (`tools/runner/mutants.ts`), invariantes do histórico em DEV e prova P5, seletor de impacto (MEC-01 a MEC-04) | feita |
| 2 | Fase 8: DEF- abertos por causa raiz, cada um com detector, correção e mutante | feita (o DEF-0512 ganhou detector no ponto 2 do dono: grupo `composer`, M51) |
| 3 | detectores durante a Fase 8: contratos de campo (C5), inventário e `builder/interactive-owner` (C1), modos, `builder/listener-scope`, escopo de vida e corridas (C6/C3) — MEC-05 a MEC-11 | feita (a classificação dos 8 elementos "porta faltando" virou o item 1 da Tarefa do DeepSeek: MEC-12, DCS-020 e DCS-021) |
| 4 | fonte empacotada (DCS-012), medição de texto (C4), lote único do navegador | não iniciada, e fora da Tarefa do DeepSeek (seção "Para o Claude"; licença OFL da Source Sans 3 já obtida em `scratchpad/licenca/LICENSE.md`, fora do repositório; os TTF em `scratchpad/fontes/`) |
| 5 | Fase 9: contadores de render, LoAF, memória, catálogo C8 | não iniciada; a parte sem navegador do catálogo C8 virou o item 2 da Tarefa do DeepSeek (MEC-13 a MEC-18); Long Animation Frames e a memória pelo CDP ficam na seção "Para o Claude" |

**Defeitos** (`auditoria/defeitos.md`): 28 registrados, 1 com status aberto (DEF-0518, o verificador do manifesto, fora do item 2).
- Com detector que acusa antes da correção e não acusa depois: DEF-0512 (grupo `composer`, M51, o código anterior à alteração), DEF-0001 (grupo `lifetime`, M41, M42), DEF-0508 (invariantes e grupo `history`, M28, M29), DEF-0509 (grupo `fields`, M34), DEF-0510 (grupo `machine`, M36, M37), DEF-0511 (grupos `history` e `style`, M38 a M40), DEF-0513 (grupo `races`, M49, M50), DEF-0514 e DEF-0515 (grupo `drafts`, M52 a M56), DEF-0516 (grupo `robustness`, M57, M58), DEF-0517 (grupo `storage`, M65).
- Defeitos de registro da auditoria, sem código da aplicação, conferidos pelo verificador (C2, C6): DEF-0002 a DEF-0008, DEF-0286, DEF-0289, DEF-0501 a DEF-0507.

**Mecanismos** (`auditoria/mecanismos.md`): MEC-01 a MEC-18. Detectores sem navegador: 20 grupos, 59 testes, 9,0 s juntos (medido: 20 arquivos, 59 testes, 9,03 s com `npx vitest run --config tools/runner/model/vitest.config.ts`).

**Catálogo de mutantes** (`node tools/runner/mutants-run.ts`, 2026-10-08): **66 mutantes, 63 acusados, 3 equivalentes com motivo (100,0% dos não equivalentes), 99,2 s**; linha de base 14,0 s; o processo mais lento, 7,7 s (M23). Nenhum sobrevivente sem motivo.

**Verificação na última rodada:** os detectores (`npx vitest run --config tools/runner/model/vitest.config.ts`) 20 arquivos e 59 testes sem falha; `npm run typecheck` e `npm run lint` com saída 0; catálogo de mutantes sem sobrevivente sem motivo.

**Commits locais** (o repositório não tem remoto; o dono pediu commit local por enquanto; ficam fora `PROMPT.md`, `deepseek.ps1` e a pasta do dono): 253b9a3 (etapas 1 a 3 até o MEC-08), d6a6b4a (registro do commit), faab19e (MEC-09 e MEC-10), 549f5f3 (autosave e DEF-0513), 023c536 (leitores da conferência dos modos), bd52de1 (a manutenção da auditoria para; CLAUDE.md sem as travas), 81be75c (item 1: os 8 elementos "porta faltando").

**Próximo passo:** seguir a "Tarefa do DeepSeek: a parte visual e de navegador" (`deepseek-tarefa.md`). Itens 1 e 2 feitos. O item 3 (medição de texto sem navegador, C4) está em andamento: `tools/ui-fit/font.ts` (o leitor de TrueType) pronto, e faltam `tools/ui-fit/check.ts` (a regra), o medidor das larguras fluidas, o detector e o mutante. Depois, os itens 4 (lote do navegador) e 5 (partes de navegador da etapa 5).

**Limite medido no item 2:** as fotos de referência do `tests/e2e/visual.spec.ts` são de uma condição só (o arquivo fixa 1440×900 e o nome do arquivo não distingue condição). Na condição Windows (`E2E_SCROLLBARS=shown E2E_SCALE=1.25`) 6 dos 14 casos falham porque as barras de rolagem tiram ~15 px das regiões que rolam (a página, o `aside.sidebar`, o `aside.inspector`) — o mesmo motivo que a `playwright.config.ts` dá para a variável; os outros 8 e os quatro testes de tela restantes passam. Isto é do arranjo de uma base por condição, não da fonte nova.


### Procedimentos
- **Depois de alterar:** rode os detectores da área (`npx vitest run --config tools/runner/model/vitest.config.ts`), `npm run typecheck` e `npm run lint`; todo defeito corrigido ganha um mutante no catálogo que o detector acusa antes da correção e não acusa depois.
- **Detectores:** `npx vitest run --config tools/runner/model/vitest.config.ts` (todos os grupos); `BUILDER_MUTANT=<id>` com o mesmo comando para um mutante; `node tools/runner/mutants-run.ts` para o catálogo inteiro.
- Não use `sed` em arquivos do escopo; no Git Bash, escreva scripts com barra invertida pela ferramenta de escrita, nunca por heredoc.

### Para o Claude (nada visual, nada de navegador — fora desta tarefa)
- **A etapa 4 inteira:** a fonte empacotada (DCS-012), a medição de texto com a fonte (C4) e o lote único do navegador.
- **As partes de navegador da etapa 5:** Long Animation Frames, memória pelo CDP (sonda WeakRef com `HeapProfiler.collectGarbage`) e as classes de navegador do C8.
- **O lote único do navegador (lista a cumprir quando ele for feito):**
  - guarda de tela (off-window, covered, sideways) nas duas configurações da seção 8 do CLAUDE.md;
  - controles montados contra `manifest/generated/inventory.json`;
  - larguras fluidas;
  - para cada comando desfazível: DOM do canvas incremental, o mesmo documento aberto do zero e a exportação (DCS-002);
  - a lista de exceções da regra `builder/interactive-owner` conferida contra `manifest/generated/inventory.json`, e os pontos da revisão do dono que o navegador tiver de fechar (o DEF-0512 já tem detector sem navegador, o grupo `composer`, M51).
- **A parte sem navegador do item 2 está feita** (MEC-13 a MEC-18): o que resta do catálogo C8 são as classes que precisam do navegador (vazamento de memória pelo CDP, Long Animation Frames, memória, IME, área de transferência, fidelidade da exportação, classes forçadas, texto bidirecional, várias abas, cota).
- **O DEF-0518 (aberto):** o `npm run manifest:check` falha com 2 problemas porque a lista de arquivos aceitos não inclui `generated/behavior.json` nem `generated/inventory.json`; a correção é a lista (ou o esquema dos dois artefatos), e ela não foi feita por estar fora do item 2.


### Fim da Tarefa do DeepSeek (2026-10-08)
- **Item 1 e item 2 feitos.** O item 1 fechou com a categoria "parte de porta" (DCS-020), a decisão dos diálogos de criação (DCS-021) e os DEF-0514 e DEF-0515 corrigidos (MEC-12, mutantes M52 a M56). O item 2 fechou com seis grupos novos (MEC-13 a MEC-18), os DEF-0516 e DEF-0517 corrigidos e os mutantes M57 a M66.
- **Taxa de acusação do catálogo de mutantes:** 66 mutantes, 63 acusados, 3 equivalentes com motivo (M19, M25, M30, os mesmos de antes), **100,0% dos não equivalentes**, 99,2 s (linha de base 14,0 s). Saída completa em `.cache/mutants/summary.json`.
- **Verificação final:** `npx vitest run --config tools/runner/model/vitest.config.ts` — 20 arquivos, 59 testes, sem falha; `npm run typecheck` — saída 0; `npm run lint` — saída 0; as provas da área tocada (145 testes de `src/core/document`, `src/core/data`, `src/core/project`, `src/core/elements`, `src/core/history`; 87 de `src/core/store` e `src/manifest`) sem falha.
- **Para o Claude:** a seção acima; nada visual e nada de navegador foi feito.

### Lições
- Um caso de detector precisa provar que passou pelo caminho que confere: o caso do autosave passava sem trocar de projeto, porque a troca pedia confirmação, e o M48 sobrevivente mostrou; o grupo `races` exige os dois desfechos.
- Um fluxo registrado pode afirmar uma regra que não vale: o fluxo da colagem pela tecla dizia "G1: ok" e o grupo `races` reproduziu o DEF-0513.
- Um detector novo erra pela convenção do projeto antes de errar pelo código: o grupo `i18n` acusou 58 chaves na primeira rodada porque supôs que `.one` pede `.other`, quando a chave base é o plural (`status.pages.madeFromCollection` serve os números que não são 1) e há textos de modelo que só terminam em `.one` por coincidência (`template.accordion.answer.one`); a conferência passou a ler do próprio código as bases que o `pluralForm` conta.
- Uma diferença entre dois filtros pode ser proposital: o filtro da captura não decodifica referências de caractere (`java&#115;cript:`) e o do SVG decodifica, e não é defeito — o valor capturado vai à página por `setAttribute` e a exportação escapa o `&`, enquanto o markup do SVG é lido como markup, onde o parser decodifica antes de o endereço executar.
- Um caso de controle pode não ser uma contagem: a vista cujo seletor devolve um objeto novo a cada publicação não redesenha mais vezes, o React a recusa com "The result of getSnapshot should be cached"; o controle útil é a mudança de outra parte do estado, que não pode redesenhar.
- O detector do inventário (`manifest/generated/inventory.json`) exige o arquivo gerado fresco: mudar código de `src/` obriga a rodar `node tools/inventory/write.ts` antes de fechar.

## Histórico (não é o estado atual)

### Execução final, etapas 1 e 2 (2026-10-08)
**Etapa 1 (fechada em 2026-10-08):**
- MEC-01 a MEC-04 registrados em `auditoria/mecanismos.md` e criados: `tools/runner/model/` (5 grupos, 4,7 s juntos), `tools/runner/mutants.ts` e `mutants-run.ts` (29 mutantes, 27 acusados, 2 equivalentes com motivo, 42,4 s), `src/core/history/invariants.ts` ligado em DEV por `src/editor/store.ts`, verificação no `vite.config.ts` e `tools/runner/production-probe.ts` (1,1 s), `tools/impact/detectors.ts` ligado a `select.ts` e `run.ts`.
- A invariante nova acusou um defeito real na linha de base: `DEF-0508` (rajada fundida que volta ao documento de antes deixa entrada vazia). A linha de base da etapa 1 fecha verde com a correção dele.
- **Procedimento novo, obrigatório depois de toda edição em código citado:** `node tools/audit/recitar.mjs` reposiciona as citações da auditoria pelo diff exato contra `.cache/audit/base/` (a base foi gravada em 2026-10-08 com o código atual). Sem isso as citações apontam para as linhas antigas. Não use `sed` em arquivos do escopo: a trava exige reler o arquivo inteiro depois.
- Lição registrada: a primeira reposição desta sessão foi por proximidade e deixou 365 citações ambíguas; foram resolvidas uma a uma por linha inteira, indentação e citações vizinhas (`.cache/dbg/resolver3.mjs`), e o C2 voltou a 0 pendências.

- **Procedimento depois de mudar uma marca `[lê:]`/`[escreve:]` de fluxo:** `node tools/audit/matriz.mjs` (a matriz), `node tools/audit/renumerar.mjs` (os ids `GRE-`/`GRL-` saem da posição do nome da função na lista ordenada: um grupo que entra ou sai renumera os seguintes, e os arquivos de par precisam ser renomeados pelo nome da função do cabeçalho), `node tools/audit/esqueletos.mjs <EST>` (os pares novos) e só então o preenchimento. Lição: um grupo novo em EST-L05a-034 deslocou 160 pares; o C6 não acusou porque os nomes antigos continuavam existindo.
- **Procedimento depois de toda mudança de código, nesta ordem:** `node tools/audit/recitar.mjs` (citações); `node tools/audit/inventariar.mjs <arquivos>` (inventário; arquivo novo exige propósito em JSON e entra no lote `L23`); `node tools/audit/check.mjs --resumo`.

**Etapa 2, andamento:**
- DEF-0508 corrigido (M28, M29 no catálogo).
- MEC-05 (contratos de campo, grupo `fields`) criado e registrado; antecipado da etapa 3 porque é o detector do DEF-0509.
- DEF-0509 corrigido (quatro codecs planejados e não registrados: `position-axis`, `grid-line`, `property-list`, `keyword-list`; M34 no catálogo; `manifest/references.json` marca os quatro registrados).
- Achado dos codecs de vários valores decidido como regra: DCS-015 (não é defeito).
- Catálogo: M30 a M35 entraram (M30 equivalente com motivo medido).
- MEC-06 (mapa: tabela da máquina de gestos, grupo `machine`, `manifest/generated/behavior.json` e `.md` por `node tools/map/generate.ts`) criado.
- DEF-0510 corrigido (segundo toque do mesmo ponteiro com o gesto aberto: efeito `restart`, DCS-013; M36, M37). 16 pares novos de EST-L05a-034 (leitor `onDown`) rastreados por subagente.
- DEF-0511 corrigido (D-A: a transação guarda o contexto e desfazer e refazer o devolvem, DCS-009 e DCS-016; M38 a M40; 75 pares do `publish` de EST-L01-037 e 6 de EST-L01-032 re-rastreados).
- Achados C7 (cancelamento sem devolver o ui) e C8 (postMessage para `*`) rastreados e resolvidos como regra: DCS-017 e DCS-018.
- DEF-0001 corrigido (o boot de teste desenhado devolve a parada; MEC-07 com o grupo `lifetime`; M41, M42).
- Defeitos de registro do grupo 1 (DEF-0003, 0004, 0501 a 0507) corrigidos: marcas tiradas, matriz recalculada (8.292 pares), 180 pares órfãos arquivados em `.cache/audit/orfaos/`, 4.860 pares renomeados.
- DEF-0002 (ids MED separados em MED-0103 a MED-0116), DEF-0005, DEF-0006, DEF-0007, DEF-0008, DEF-0286 e DEF-0289 corrigidos; o rastreamento achou o DEF-0512 (o compositor reaberto com a caixa da sessão anterior), que foi alterado sem detector sem navegador e está em revisão (ver Estado atual).

### Fases 1 a 7 (fechadas em 2026-10-08, antes da execução final)
O texto abaixo foi escrito ao fim da Fase 7. Os números e as frases "não iniciada" valiam naquele momento; o estado de agora está em **Estado atual**.

#### Escopo e trava (atualizado em 2026-10-08 pelo dono)
O dono tirou `manifest/features/fixtures/**` e `deepseek.ps1` do escopo da trava, e a leitura sem offset/limit passou a valer só para arquivo de até 34.000 caracteres (arquivo maior é lido com offset e limit explícitos, em partes de até 60.000 caracteres). O escopo caiu de 1.225 para 1.163 arquivos; os 10 arquivos grandes que estavam lidos por uma leitura inteira voltaram a exigir leitura em partes e foram relidos. O bloqueio que isso resolve está em `auditoria/decisoes.md`, DCS-007.

#### Onde estava ao fim da Fase 7
- **Fases 1 a 7 FECHADAS e verificadas.** `node tools/audit/check.mjs --ate-fase 7` termina com `TOTAL: 0 pendências`:
  - C1 `1163 no escopo | 1163 inventariados | 0 pendências`;
  - C2 `11181 arquivos | 0 pendências`;
  - C3 `3202 ocorrências | 0 pendências` (todas as ocorrências de todo padrão citadas num item de estado, numa entrada, ou excluídas com motivo);
  - C4 `568 itens | 0 pendências` (mais 239 exclusões com motivo);
  - C5 `2444 arquivos | 0 pendências` (373 trechos de comando, 1.362 fluxos de porta, 709 fluxos de entrada);
  - C6 `353 itens de estado | 0 pendências` (os 8.456 pares da matriz, um arquivo em `auditoria/interacoes/` cada, todos rastreados);
  - C7 `11181 arquivos | 0 pendências`;
  - C9 `760 requisitos | 0 pendências`.
- `npm run typecheck` e `npm run lint` terminam com exit 0.
- Ao fim da Fase 7, o rastreamento tinha aberto 17 defeitos (`DEF-0001` a `DEF-0008`, `DEF-0286`, `DEF-0289`, `DEF-0501` a `DEF-0507`) para a Fase 8, que naquele momento não tinha começado; a execução final os tratou (ver **Estado atual**).
- **Entradas gravadas:** as 1.362 portas de comando em `auditoria/entradas/portas-<domínio>.md` e as demais entradas (ouvintes, handlers, efeitos, timers, quadros, observadores, mensagens, promessas, assinaturas de store, boot e restauração de rascunho) em `auditoria/entradas/<área>.md`, juntadas em `auditoria/entradas.md`.
- **Fase 5 FECHADA:** `node tools/audit/check.mjs --ate-fase 5` termina com `TOTAL: 0 pendências` (C5 com 2.444 arquivos de fluxo, zero pendências). O rastreamento achou um defeito real, `DEF-0001` (o laço de `runDrawnTestBoot` não cancela o quadro), aberto em `auditoria/defeitos.md` para a Fase 8.
- **Fase 6 quase fechada:** 50 medições gravadas em `auditoria/medicoes/` (`MED-nnnn.mjs` + `MED-nnnn.md`), medidas no Chrome headless nas duas configurações (A: 1280×720 pt-BR escala 1; B: 1440×900 en-US escala 1.25 com barras), com o boot de teste `?test-boot`. O servidor é o `vite preview` (`PORT=5399 npm run preview`) — este ambiente não tem Python para o `http.server` da seção 8. Uma medição (MED-0029) não foi medida por não ser citada por fluxo algum. Um defeito de registro, `DEF-0002`, guarda a colisão de ids `MED-` entre áreas (agentes independentes numeraram cada um a partir do mesmo ponto).
- **Medições: o valor medido e o script** estão em `auditoria/medicoes/`; a citação do `MED-` está no passo do fluxo.
- **Fase 7 em re-escopo, por instrução do dono (2026-10-08).** `node tools/audit/matriz.mjs` contava 346 itens de estado e 77.715 pares, dos quais **76.925 (99%) vinham de um item só, `EST-L01-006`**, com 181 grupos de escritores × 425 de leitores. Os outros 345 itens somam 790 pares, e 333 deles têm 10 pares ou menos.
  - **A causa:** `auditoria/estado/L01.md` registrava o `state` da store do núcleo inteiro como **um** item, e as marcas dos fluxos diziam `via <tratador do comando>` em vez da função que lê ou escreve a parte na linha citada.
  - **Passo 1 (feito):** `EST-L01-006` partido nas oito partes que `src/core/store/store.ts` mantém — `state.document`, `state.selection`, `state.history`, `state.message`, `state.confirmation`, `state.refusal`, `state.refused`, `state.ui` — cada uma um item, `EST-L01-030` a `EST-L01-037`, em `auditoria/estado/L01.md`.
  - **Passo 2 (feito):** os 2.444 fluxos e trechos re-marcados com a parte do estado e a função que realmente lê ou escreve aquela parte na linha citada, nunca o tratador do comando. Os 1.607 arquivos a tocar foram divididos em 36 lotes de 45 em `auditoria/fluxos/lotes-remarca/`, com a regra em `auditoria/fluxos/PROCEDIMENTO-REMARCA.md` (DCS-008); o teste final aponta zero ocorrências de `EST-L01-006` nos fluxos.
  - **Passo 3 (feito):** `--ate-fase 6` de volta a zero, e `node tools/audit/matriz.mjs` congelou `auditoria/matriz.md`.
  - **Passo 4 (feito):** os 8.456 pares gerados por `node tools/audit/esqueletos.mjs` e rastreados um a um em `auditoria/interacoes/`, com a regra em `auditoria/interacoes/PROCEDIMENTO.md`; `--ate-fase 7` termina com `TOTAL: 0 pendências`. O rastreamento abriu 17 defeitos (a Fase 8).

#### Fase 7 — a matriz depois do re-escopo
`node tools/audit/matriz.mjs`: **353 itens de estado, 8.456 pares**. Antes do re-escopo eram 349 itens e 77.541 pares; o item único `EST-L01-006` respondia por 76.744 deles.

**Distribuição por item** (escritores × leitores = pares):

| item | escritores | leitores | pares |
|---|---|---|---|
| `EST-L01-030` (o documento) | 20 | 253 | 5.060 |
| `EST-L01-037` (o estado do editor) | 29 | 75 | 2.175 |
| `EST-L01-031` (a seleção) | 7 | 55 | 385 |
| `EST-L05a-034` | 16 | 14 | 224 |
| `EST-L05a-019` | 8 | 7 | 56 |
| `EST-L09b-057` | 9 | 6 | 54 |
| `EST-L01-032` (o histórico) | 5 | 6 | 30 |
| `EST-L05a-001` | 4 | 7 | 28 |
| `EST-L06-004` | 7 | 4 | 28 |
| `EST-L08-019` | 4 | 5 | 20 |
| `EST-L06-008` | 6 | 3 | 18 |
| `EST-L01-033` (a mensagem) | 6 | 3 | 18 |

- Itens por faixa de pares: 190 com zero, 136 com 1 a 5, 18 com 6 a 20, 5 com 21 a 100, 2 com 101 a 500, 2 com mais de 500 (`EST-L01-030` e `EST-L01-037`).
- Os dois itens da store do núcleo respondem por 7.235 dos 8.456 pares; a causa é o número de **leitores** distintos do documento e do estado do editor (253 e 75), que o agrupamento por função não reduz.
- Os 190 itens com zero pares têm só um dos lados (escrito e nunca lido, ou lido e nunca escrito); o C4 exige `DEF-` para o estado escrito e nunca lido, então esses itens estão registrados.
- **Comparação com o plano:** a estimativa de G.1/G.2 era de 700 a 24.750 arquivos em `interacoes/`. Os 8.456 pares estão nessa faixa.
- **Fase 6 FECHADA:** `node tools/audit/check.mjs --ate-fase 6` termina com `TOTAL: 0 pendências`.
- **A trava da vistoria deixou de exigir leitura:** todo arquivo do escopo está lido na versão atual.

#### Fechamento das Fases 1 a 7
- Ao fim da Fase 7, as Fases 8 e 9 não tinham começado, por instrução do dono; a execução final, iniciada no mesmo dia, as retomou.

#### Como retomar depois de uma compactação de contexto, ou numa sessão nova
1. Leia este arquivo por inteiro.
2. Leia `auditoria/decisoes.md` (as decisões tomadas não se rediscutem).
3. Rode `node tools/audit/check.mjs --resumo` e leia as contagens.
4. Releia do disco o que precisar. Nunca continue por memória da conversa.

#### Fase 1 — verificador (fechada)
- **Ferramentas:** `tools/audit/check.mjs` (as dez conferências C1 a C10, com `--ate-fase`, `--so`, `--lote` e `--resumo`), `lib.mjs`, `lotes.mjs`, `juntar-inventario.mjs`, `juntar.mjs`, `matriz.mjs`, `esqueletos.mjs`, `contar.mjs`.
- **Conferência:** `node tools/audit/check.mjs --ate-fase 1` termina com `TOTAL: 0 pendências`.
- **Decisões:** `auditoria/decisoes.md`, DCS-001 a DCS-006.

#### Fase 2 — leitura integral (fechada)
- **Partição:** `auditoria/lotes/<lote>.md`, gerada por `node tools/audit/lotes.mjs`; as 36 contagens de arquivos batem com a tabela B.2 do plano, com `L22a` maior por conter as ferramentas criadas.
- **Procedimento de um lote:** `auditoria/inventario/PROCEDIMENTO.md`.
- **Padrões:** `auditoria/padroes.json`, com 25 padrões; `node tools/audit/contar.mjs` conta 3.202 ocorrências nos alvos.
- **Pesquisa:** `auditoria/inventario/stack.md` (pacotes de produção) e `stack-ferramentas.md` (ferramentas), ambas gravadas.

#### Ambiente e armadilhas aprendidas
- **Git:** o repositório acusa proprietário diferente do usuário da sessão; sem a exceção `safe.directory` (acrescentada em 2026-10-08), `git ls-files` falha e a vistoria cai na varredura alternativa, subindo o escopo de 1.225 para 2.280 arquivos.
- **Leitura por subagente não é debitada do orçamento da sessão principal:** use subagentes para as varreduras grandes.
- **O principal fica com `L01` e `L05a`,** os pontos garantidores de G1 e G2 (a store do núcleo e a store do editor).
- **Cuidados que já custaram retrabalho:** o exemplo de bloco em `PROCEDIMENTO.md` não pode ser um título de nível três com caminho entre crases fora de bloco de código; um arquivo de uma linha tem `Partes lidas` no formato `1-1`, nunca `1`; um lote que só lê metade de um arquivo (`L14a`, `L15a`) tem as partes unidas pelo `juntar-inventario.mjs`.
