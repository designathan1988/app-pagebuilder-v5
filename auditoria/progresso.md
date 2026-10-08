# Progresso — memória do trabalho

## Escopo e trava (atualizado em 2026-10-08 pelo dono)
O dono tirou `manifest/features/fixtures/**` e `deepseek.ps1` do escopo da trava, e a leitura sem offset/limit passou a valer só para arquivo de até 34.000 caracteres (arquivo maior é lido com offset e limit explícitos, em partes de até 60.000 caracteres). O escopo caiu de 1.225 para 1.163 arquivos; os 10 arquivos grandes que estavam lidos por uma leitura inteira voltaram a exigir leitura em partes e foram relidos. O bloqueio que isso resolve está em `auditoria/decisoes.md`, DCS-007.

## Execução final (iniciada em 2026-10-08): mecanismos do relatório e Fases 8 e 9
Instrução do dono: construir os mecanismos de `auditoria/investigacao/relatorio.md` (seção 4 e C1 a C8, a partir das provas de `auditoria/investigacao/poc/`) e executar as Fases 8 e 9, sem perguntar. Cada mecanismo entra em `auditoria/mecanismos.md` antes de qualquer arquivo dele existir.

| etapa | conteúdo | estado |
|---|---|---|
| 0 | decisões D-A a D-E gravadas (`decisoes.md`, DCS-009 a DCS-014) | feita |
| 1 | detectores: modelo da store (`tools/runner/model/`), catálogo de mutantes (`tools/runner/mutants.ts`), invariantes do histórico em DEV e prova P5, seletor de impacto | **feita** (linha de base verde; catálogo 27 de 27 acusados, 2 equivalentes com motivo) |
| 2 | Fase 8: DEF- abertos por causa raiz, cada um com mutante ou passo de modelo | **feita**: os 22 DEF- corrigidos, C8 com 0 pendências (DEF-0512 sem detector sem navegador: conferir no lote da etapa 4) |
| 3 | detectores durante a Fase 8: contratos de campo (C5), inventário e `builder/interactive-owner` (C1), modos e `builder/listener-scope` (C6/C3) | em curso: MEC-05 a MEC-07 feitos; MEC-08 (inventário e lint) em construção |
| 4 | fonte empacotada (DCS-012), medição de texto (C4), lote único do navegador | não iniciada |
| 5 | Fase 9: contadores de render, LoAF, memória, catálogo C8 | não iniciada |

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
- DEF-0002 (ids MED separados em MED-0103 a MED-0116), DEF-0005, DEF-0006, DEF-0007, DEF-0008, DEF-0286 e DEF-0289 corrigidos; o rastreamento achou e corrigiu o DEF-0512 (o compositor reaberto com a caixa da sessão anterior).

**Próximo passo:** etapa 3 — MEC-09 (C6: máquina de modos, escopo de vida e regra `builder/listener-scope`, tabelas no mapa gerado). O MEC-08 está feito: regra `builder/interactive-owner` ligada em `eslint.config.js`, 81 exceções com motivo em `tools/lint/interactive-allowed.ts` (32 estruturais, 32 locais, 17 partes de porta; o ramo de reserva de `FieldInput` não é alcançado por nenhuma porta do manifesto: caixa de espaçamento vai para `BoxModel`, filtros para `partOfField`), detector `inventory` (5,5 s) e mutante M43 acusado. Faltam os tempos do MEC-05 a MEC-07 e a rodada completa do catálogo com M43.

Este arquivo é a memória do trabalho. Ele diz onde o trabalho está e qual é o próximo passo. Leia-o por inteiro antes de qualquer trabalho e grave nele o avanço depois de cada passo (CLAUDE.md, seção 0).

## Onde está
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
- **A Fase 8 (correção) tem 17 defeitos abertos**, achados pelo rastreamento (`DEF-0001` a `DEF-0008`, `DEF-0286`, `DEF-0289`, `DEF-0501` a `DEF-0507`); o C8 acusa uma pendência por defeito aberto, e é a conta que a Fase 8 fecha. **A Fase 8 não foi iniciada.**
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

## Fase 7 — a matriz depois do re-escopo (2026-10-08)
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

## Fechamento

**Fases 1 a 7 concluídas; próxima etapa: revisão independente**

- A Fase 8 (correção dos 17 defeitos abertos) e a Fase 9 (otimização) **não foram iniciadas**, por instrução do dono.
- Quem retomar para as Fases 8 e 9 começa pelos defeitos de `auditoria/defeitos.md` e fecha o C8; `node tools/audit/check.mjs --ate-fase 7` é a trava que a Fase 7 deixa verde.

## Como retomar depois de uma compactação de contexto, ou numa sessão nova
1. Leia este arquivo por inteiro.
2. Leia `auditoria/decisoes.md` (as decisões tomadas não se rediscutem).
3. Rode `node tools/audit/check.mjs --resumo` e leia as contagens.
4. Releia do disco o que precisar. Nunca continue por memória da conversa.

## Fase 1 — verificador (fechada)
- **Ferramentas:** `tools/audit/check.mjs` (as dez conferências C1 a C10, com `--ate-fase`, `--so`, `--lote` e `--resumo`), `lib.mjs`, `lotes.mjs`, `juntar-inventario.mjs`, `juntar.mjs`, `matriz.mjs`, `esqueletos.mjs`, `contar.mjs`.
- **Conferência:** `node tools/audit/check.mjs --ate-fase 1` termina com `TOTAL: 0 pendências`.
- **Decisões:** `auditoria/decisoes.md`, DCS-001 a DCS-006.

## Fase 2 — leitura integral (em curso)
- **Partição:** `auditoria/lotes/<lote>.md`, gerada por `node tools/audit/lotes.mjs`; as 36 contagens de arquivos batem com a tabela B.2 do plano, com `L22a` maior por conter as ferramentas criadas.
- **Procedimento de um lote:** `auditoria/inventario/PROCEDIMENTO.md`.
- **Padrões:** `auditoria/padroes.json`, com 25 padrões; `node tools/audit/contar.mjs` conta 3.202 ocorrências nos alvos.
- **Pesquisa:** `auditoria/inventario/stack.md` (pacotes de produção) e `stack-ferramentas.md` (ferramentas), ambas gravadas.

## Ambiente e armadilhas aprendidas
- **Git:** o repositório acusa proprietário diferente do usuário da sessão; sem a exceção `safe.directory` (acrescentada em 2026-10-08), `git ls-files` falha e a vistoria cai na varredura alternativa, subindo o escopo de 1.225 para 2.280 arquivos.
- **Leitura por subagente não é debitada do orçamento da sessão principal:** use subagentes para as varreduras grandes.
- **O principal fica com `L01` e `L05a`,** os pontos garantidores de G1 e G2 (a store do núcleo e a store do editor).
- **Cuidados que já custaram retrabalho:** o exemplo de bloco em `PROCEDIMENTO.md` não pode ser um título de nível três com caminho entre crases fora de bloco de código; um arquivo de uma linha tem `Partes lidas` no formato `1-1`, nunca `1`; um lote que só lê metade de um arquivo (`L14a`, `L15a`) tem as partes unidas pelo `juntar-inventario.mjs`.
