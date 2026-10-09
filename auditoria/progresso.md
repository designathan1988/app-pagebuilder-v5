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

- **Lote 2 (2026-10-09), painel rápido:** DEF-0574, defeito do teste e não do app. Antes da correção, com a CPU 6× lenta: 8 falhas em 15, com 0 chips desenhados no momento da decisão em 15 de 15. Depois da correção: 30 de 30. Os 9 specs que usam `openQuickPanel` deram 117 de 117 na condição Windows e 116 de 117 na padrão. A única falha foi um quadro de 59,7 ms em `onUp`, com 3 navegadores disputando a CPU; o caso sozinho deu 5 de 5. Detectores 115 de 115; typecheck e lint sem erro.

- **Lote 3 (2026-10-09), uso real:**
  - `flows.spec.ts` e 11 specs de jornada: 85 de 85 nas duas condições, com `SCREEN_GUARD=report` e nenhum achado da guarda.
  - Passada visual por 79 fotos de 6 fluxos de `npm run ui`. Um defeito do app: DEF-0575, o rótulo sobre a aba depois da troca de idioma, corrigido em `chrome.tsx`.
  - Rodando os specs do canvas apareceu o DEF-0576, uma premissa de teste que só valia sem barra de rolagem.
  - Achados da passada que não são defeito, medidos:
    - as setas do campo em foco terminam em x=1264 e o campo começa em 1265, então não cobrem o texto; o que se vê é o campo rolado com "calc(100% - 20px)";
    - os nomes "Page", "Image" e "Button" são dados do documento, inseridos antes da troca de idioma;
    - a paleta de cor da linha de Camadas abre com o ponteiro sobre o ponto, por especificação (`layers.tsx:120`);
    - a medida "1360 × 41" é a prévia da área de um traço do compositor (`overlay.tsx:172`), sem controle.
  - Os 12 specs do canvas passam nas duas condições; detectores 115 de 115; typecheck e lint sem erro.

## Próximo passo
**Lote 4 — fim de etapa:** a suíte de navegador inteira nas duas condições (`E2E_WORKERS=3`, prioridade baixa, saída em arquivo) e o catálogo inteiro de mutantes; as falhas viram DEF-.

## Fila depois do próximo passo, em ordem
1. **Lote 5 — Fase 9 (otimização):** criar `auditoria/otimizacoes.md`. Alvos já vistos: as fontes em TTF (431 KB e 426 KB; as WOFF2 de contornos TrueType do mesmo repositório têm 109,6 KB e 108,9 KB); o bundle sem divisão de código; o quadro de `onUp` perto de 60 ms com a CPU ocupada. Medir antes e depois: re-renders (grupo `render`), leituras de layout forçadas, operações na árvore de blocos e o tamanho do bundle (`npx vite build`).
