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

- **Lote 4 (2026-10-09), fim de etapa — feito:**
  - Primeira passada da suíte inteira:
    - condição padrão: 2.927 de 2.929, em 30,6 min;
    - condição Windows: 2.847 de 2.929, com 76 falhas, em 33,4 min.
  - 69 das falhas são cenários com os números das especificações, medidos sem barra de rolagem. Pela A3.22, a página do desktop deixa a barra livre e os painéis ficam 15 px mais estreitos. Ficam pulados na condição Windows (DCS-025).
  - Os demais viraram DEF-0577 a DEF-0585, todos corrigidos. Defeitos do app:
    - DEF-0577, a recusa por referência quebrada dizia só "/pages";
    - DEF-0578, o estado vazio da aba Configurações sem margem;
    - DEF-0582, o nome da variável cortado na aba Estilos;
    - DEF-0585, a seleção perdida numa recarga logo depois de selecionar.
  - Defeitos de teste: DEF-0579, DEF-0580, DEF-0581, DEF-0583 e DEF-0584.
  - Mutantes M142 e M143 acusados; `ui-widths.json` medido de novo nas três condições; detectores 117 de 117; typecheck e lint sem erro.

  - Segunda passada:
    - condição padrão: 2.928 de 2.930. As duas falhas foram o quadro de 70,3 ms em `onUp` com a CPU disputada (alvo do Lote 5) e o DEF-0586: `status-bar.spec.ts` abria o editor duas vezes na mesma página, declarando um perfil novo; o spec passa 6 de 6.
    - condição Windows: 886 passaram e 0 falharam, mas com todos os cenários pulados. A DCS-025 foi restringida ao `layout-composer` e a 21 cenários listados (`REFERENCE_NUMBERS`), e a condição Windows roda de novo (saída `l4c-windows.txt`).

  - Terceira passada da condição Windows: 2.857 passaram, 70 foram pulados (DCS-025) e 3 falharam por leituras feitas cedo demais com a máquina ocupada (DEF-0587, corrigido). Sozinhos, 15 de 15; depois da correção, 23 de 23 nas duas condições.
  - Catálogo inteiro de mutantes: 143, com 140 acusados e 3 equivalentes com motivo (M19, M25, M30), 100% dos não equivalentes, em 197,6 s.
  - Detectores 117 de 117; typecheck e lint sem erro.

- **Lote 5 (2026-10-09), Fase 9 — feito (`auditoria/otimizacoes.md`):**
  - OTM-001: a fonte da interface passou a WOFF, igual à TTF tabela por tabela e com o hinting. Foi de 857.100 para 375.504 bytes (−56,2%); com gzip, −7,7%. As 14 fotos de referência passam sem atualização.
  - As WOFF2 foram descartadas: vêm sem hinting e mudaram as fotos.
  - OTM-002 (`elementBoxes`) e OTM-003 (`fitNames`) foram desfeitas: as contagens por arraste não mudaram, e o ganho medido antes por tempo era ruído da carga da máquina.
  - A divisão de código não se aplica (DCS-026).
  - DEF-0588 (o caso da cota dependia do tempo da gravação) corrigido.
  - Specs da área (128) nas duas condições: 128 de 128 na Windows; na padrão, só o caso da cota falhou, e foi corrigido. `lote-navegador`: 7 de 7 nas duas.
  - Detectores 117 de 117; typecheck e lint sem erro.

- **Fechamento (2026-10-09):** a suíte inteira com o código final, uma vez, na condição padrão (regra nova do `CLAUDE.md`, seção 0): 2.930 de 2.930 em 30,3 min. Sem falha, não houve `--last-failed`. A passada Windows encadeada foi cancelada pela regra. Os servidores de medição foram encerrados.

## Próximo passo
**Defeitos do app que o usuário vê, achados usando o editor** (`CLAUDE.md`, seção 0, "Produção primeiro"). Comece por uma sessão de uso nas duas condições, com fotos olhadas; cada achado vira DEF-, corrigido com prova, em lotes por área.

## Para uma próxima rodada (fora dos lotes 1 a 5)
- O quadro de `onUp` acima de 50 ms só com a CPU disputada: o caminho está em `otimizacoes.md`, "O que fica para uma próxima rodada".
