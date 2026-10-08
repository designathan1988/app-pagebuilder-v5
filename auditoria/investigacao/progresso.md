# Investigação: progresso

Memória desta sessão de investigação (a sessão só escreve em `auditoria/investigacao/`).

## Passos
1. Pesquisa na web por tema, em subagentes — FEITA. Nove arquivos em `auditoria/investigacao/pesquisa/` (c1-inventario, c2-acusacao, c3-mapa, c4-interface, c5-campos, c6-eventos, c7-historico, c8a-classes, c8b-classes).
2. Leitura dos pontos centrais — FEITA: `src/core/store/store.ts`, `src/editor/store.ts`, `src/editor/input/pending.ts`, `src/core/history/history.ts`, `src/core/history/transaction.ts`, `src/core/commands/registry.ts`, `src/editor/input/pointer/machine.ts`, `src/manifest/fields.ts`, `tools/runner/invariants.test.ts`, cabeçalhos de `tools/runner/tooth.ts` e `tools/runner/tooth-plugin.ts`.
3. Provas de conceito em `auditoria/investigacao/poc/`:
   - P1 (C7 e C2) — FEITA: `poc/c7-historico/` (modelo com fc.commands sobre a store real; 18 mutantes; 17 acusados; o sobrevivente é M15, a carga de projeto, que o modelo não exercita). Resultado em `poc/c7-historico/resultados/resumo.txt`.
   - P2 (C4) — FEITA: `poc/c4-texto/`; com o kerning do GPOS, erro máximo de 0,015 px contra o Chrome em 6.229 textos e 5 tamanhos; 93 mil larguras em 86 ms.
   - P3 (C1) — FEITA: `poc/c1-inventario/`; 261 elementos interativos em 0,5 s; 81 sem marca de porta nem de controle local.
   - P4 (C5) — FEITA: `poc/c5-campos/`; 11.800 casos em 0,8 s; idempotência sem quebra; recusa de comprimentos em background-position-x e background-position-y; codecs de vários valores guardam mais de quatro casas.
   - P5 (custo zero) — FEITA: `poc/c-producao/`; a sonda some do build de produção.
   - P6 (C3 e C6) — FEITA: `poc/c3-mapa/`; tabela de transições de step gerada do código; 17 combinações ignoradas em silêncio.
4. Relatório `auditoria/investigacao/relatorio.md` e `auditoria/investigacao/fontes.md` — FEITOS (fontes.md com 477 linhas de fonte, compilado das nove notas).
5. Fechamento — FEITO: `git status` igual ao do início da sessão (nada fora de `auditoria/investigacao/` mudou); `node tools/audit/check.mjs --so C2,C7` termina com `TOTAL: 0 pendências`; `npm run typecheck` e `npm run lint` com saída 0 (o lint alcança `auditoria/`: as provas importam `console`, `process` e `performance` de `node:`).

## Achados da P1 para o relatório
- A primeira divergência da linha de base foi do modelo, não do código: um gesto sem comando nenhum não interrompe a fusão de setas; a nota de `history.nudgeBurstWindow` diz "no other command in between", e o código segue a nota.
- O modelo roda 300 sequências (8.589 passos, 221 fusões) em 0,9 s; um processo do Vitest por mutante leva cerca de 3 s.

## Próximo passo
Sessão de investigação encerrada. Quem retomar começa pelas decisões D-A a D-E da seção 5 do relatório e pela etapa 0 do plano (seção 4).
