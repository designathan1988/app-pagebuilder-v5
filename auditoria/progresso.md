# Progresso — memória do trabalho

Leia por inteiro antes de começar; atualize ao fim de cada lote. Regras de ritmo e formato: `CLAUDE.md`, seções 0 e 1. O histórico até 2026-10-09 está em `auditoria/historico-progresso.md` (só consulta; não descreve o estado).

## Estado atual (2026-10-09)
- **Repositório:** ramo `estrutura/edicao-e-espaco`, publicado em `origin` (`github.com/designathan1988/app-pagebuilder-v5`).
- **Portões no último lote (DEF-0573):** detectores 25 arquivos e 115 testes sem falha; `npm run typecheck` e `npm run lint` sem erro; mutantes M68, M140, M141 acusados.
- **Defeitos:** os 83 registrados (até o DEF-0573) corrigidos, nenhum aberto (`auditoria/defeitos.md`). Da verificação integral (`auditoria/verificacao/RELATORIO.md`), as seções 2 e 3 estão tratadas, exceto o detector de D-1/DEC-70.
- **Fora da lista, por decisão do dono (2026-10-09):** os ajustes de registro da seção 4 do RELATORIO (citações antigas de decisões, campos de defeitos antigos). Os registros antigos ficam como estão.

## Próximo passo
**Lote 1 — canvas no navegador:** um spec que mede, nas duas condições de tela, a posição das abas de breakpoint coladas no topo da moldura (D-1) e o rótulo e o chip da seleção (DEC-70: acima do elemento; sobre as abas, pela linha de cima até passar a última aba; elemento estreito sob as abas, logo abaixo dele), com um mutante em `clearedLabel` (`src/editor/canvas/placement.ts`). No mesmo lote: o achado "covered" de `.cache/screen-guard/4f4cfd86…json` (divisor do inspector sobre um botão de linha de conceito, cenário de `tools/runner/scenarios.ts`).

## Fila depois do próximo passo, em ordem
1. **Lote 2 — painel rápido:** a intermitência de `tests/e2e/draft-recovery.spec.ts` "quick panel draft…" (o chip não reabre o painel depois da última recarga; 2 falhas em 120).
2. **Lote 3 — uso real:** os fluxos de `tools/ui/flows.ts` nas duas condições, olhando as fotos, mais uma sessão livre (inserir, estilizar em dois breakpoints, estado hover, classe, quadro-chave, desfazer, salvar, recarregar, exportar). Cada achado vira DEF- e é corrigido no mesmo lote.
3. **Lote 4 — fim de etapa:** a suíte de navegador inteira nas duas condições (`E2E_WORKERS=3`, prioridade baixa, saída em arquivo) e o catálogo inteiro de mutantes; as falhas viram DEF-.
4. **Lote 5 — Fase 9 (otimização):** criar `auditoria/otimizacoes.md`; medir antes e depois: re-renders (grupo `render`), leituras de layout forçadas, operações na árvore de blocos e o tamanho do bundle (`npx vite build`).
