# Progresso — memória do trabalho

Leia por inteiro antes de começar; atualize ao fim de cada lote. Regras de ritmo e formato: `CLAUDE.md`, seções 0 e 1. O histórico até 2026-10-09 está em `auditoria/historico-progresso.md` (só consulta; não descreve o estado).

## Estado atual (2026-10-09)
- **Repositório:** ramo `estrutura/edicao-e-espaco`, publicado em `origin` (`github.com/designathan1988/app-pagebuilder-v5`).
- **Portões no último lote (DEF-0573):** detectores 25 arquivos e 115 testes sem falha; `npm run typecheck` e `npm run lint` sem erro; mutantes M68, M140, M141 acusados.
- **Defeitos:** os 83 registrados (até o DEF-0573) corrigidos, nenhum aberto (`auditoria/defeitos.md`). Da verificação integral (`auditoria/verificacao/RELATORIO.md`), as seções 2 e 3 estão tratadas, exceto o detector de D-1/DEC-70.
- **Fora da lista, por decisão do dono (2026-10-09):** os ajustes de registro da seção 4 do RELATORIO (citações antigas de decisões, campos de defeitos antigos). Os registros antigos ficam como estão.

## Feito
- **Lote 1 (2026-10-09), canvas no navegador:** dois casos em `tests/e2e/selection-label-touches.spec.ts`:
  - D-1: as abas coladas no topo da moldura, ou da faixa do breakpoint, com zoom ajustado, em 25 % e 400 %, e em Tablet e Phone;
  - DEC-70: o `c-logo`, estreito e sob as abas, com rótulo e chip logo abaixo dele.

  Os 6 casos do spec passam nas duas condições. Prova por mutação temporária: o ramo de baixo de `clearedLabel` retirado foi acusado (`top -38`, `overTabs true`); `marginLeft: 0` nas abas foi acusado (`start -2470` a 400 %). Nenhum defeito do app. O achado "covered" de 2026-10-06 não se reproduz: os 27 cenários `props-border-outline` com `SCREEN_GUARD=report` não deram achado nas duas condições. Typecheck e lint sem erro.

## Próximo passo
**Lote 2 — painel rápido:** a intermitência de `tests/e2e/draft-recovery.spec.ts` "quick panel draft…" (o chip não reabre o painel depois da última recarga; 2 falhas em 120). Pista a conferir: `tests/e2e/door.ts:169`, o `chip.count()` sem espera, decide antes de o chip ser desenhado; se o chip demora a aparecer no app depois da recarga, o defeito é do app.

## Fila depois do próximo passo, em ordem
1. **Lote 3 — uso real:** os fluxos de `tools/ui/flows.ts` nas duas condições, olhando as fotos, mais uma sessão livre (inserir, estilizar em dois breakpoints, estado hover, classe, quadro-chave, desfazer, salvar, recarregar, exportar). Cada achado vira DEF- e é corrigido no mesmo lote.
2. **Lote 4 — fim de etapa:** a suíte de navegador inteira nas duas condições (`E2E_WORKERS=3`, prioridade baixa, saída em arquivo) e o catálogo inteiro de mutantes; as falhas viram DEF-.
3. **Lote 5 — Fase 9 (otimização):** criar `auditoria/otimizacoes.md`; medir antes e depois: re-renders (grupo `render`), leituras de layout forçadas, operações na árvore de blocos e o tamanho do bundle (`npx vite build`).
