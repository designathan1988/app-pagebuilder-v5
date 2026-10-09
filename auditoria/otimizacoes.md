# Otimizações

Cada otimização é registrada antes da edição, com a medida de antes; a medida de depois entra quando a mudança está feita. Uma mudança que não mostra ganho medido é desfeita, e o registro diz isso. Formato curto (`CLAUDE.md`, seção 1).

Medições do Lote 5 (2026-10-09). Os scripts estão no scratchpad da sessão:
- **Build de produção:** `npx vite build --outDir .cache/build-prod-<antes|depois> --sourcemap`, com bytes, gzip e brotli de cada arquivo medidos por `pesos.mjs`.
- **Soltar de um arraste, por tempo:** `perfil-up.mjs`, com Long Animation Frames de `onUp` e a CPU 4× mais lenta pelo CDP. Essa medida não serviu para comparar. Em rodadas alternadas entre os dois builds, as duas versões pioraram ao longo da medição (o "antes" foi de 107 para 187 ms de mediana), porque a carga da máquina mudou.
- **Soltar de um arraste, por contagem:** `contagem-up.mjs`, que não depende da carga. Mede, por arraste do Hero com soltar e desfazer, as leituras de caixa e de estilo do iframe do canvas e os eventos `Layout` e `UpdateLayoutTree` do trace do Chrome. São 8 arrastes por rodada, em duas rodadas alternadas.

## OTM-001 — a fonte da interface em WOFF
- **Onde:** `src/ui/tokens.css`, os dois `@font-face`.
- **Antes:** TTF de 431.196 e 425.904 bytes, somando 857.100 bytes de fonte no build (403.412 com gzip).
- **Mudança:** as WOFF do mesmo repositório e versão (`adobe-fonts/source-sans`, ramo `release`, `WOFF/TTF/`, revisão 3.052).
  - Cada tabela descompactada é igual, byte a byte, à da TTF, com o hinting incluído.
  - As 7.188 cadeias dos dois catálogos medem o mesmo nos dois pesos.
  - As 14 fotos de referência do `visual.spec.ts` passam sem atualização, e a medição de rótulos (`ui-widths.json`) só mudou o hash do CSS.
  - As TTF ficam em `src/ui/fonts/` para `tools/ui-fit/font.ts`.
- **Descartado:** as WOFF2 do mesmo repositório (109.632 e 108.900 bytes) vêm sem hinting (sem as tabelas `prep`, `fpgm` e `gasp`). Com elas, as 14 fotos de referência mudaram em glifos isolados nas duas condições, e no Windows o texto de 13 px depende do hinting.
- **Depois:** 188.176 e 187.328 bytes, somando 375.504 (−56,2%); com gzip, 372.453 (−7,7%). O ganho grande vale quando o servidor não comprime fontes e no tamanho do pacote.

## OTM-002 — as caixas dos elementos lidas com uma só geometria do quadro (desfeita)
- **Onde:** `src/editor/canvas/coordinates.ts`, `elementBoxes`.
- **Antes, por contagem:** 642,8 e 647,9 leituras da caixa do iframe por arraste; 616,5 e 621,1 do estilo; 31,3 e 30,5 layouts (21,6 e 20,9 ms).
- **Depois, por contagem:** 642,3 e 642,0 leituras da caixa; 616,0 e 615,5 do estilo; 30,8 e 30,9 layouts (20,9 e 20,5 ms).
- **Resultado:** sem ganho. `elementBoxes` não roda no arraste: ele desenha os contornos (`view-overlays.tsx`). A mudança foi desfeita.

## OTM-003 — o ajuste dos nomes das Camadas lendo tudo antes de escrever (desfeita)
- **Onde:** `src/editor/shell/sidebar/name-first.ts`, `fitNames`.
- **Medida:** a mesma da OTM-002, nas mesmas rodadas. Os layouts por arraste não mudaram (cerca de 31): nenhuma linha muda de estado nesse gesto, então não havia escrita entre leituras.
- **Resultado:** sem ganho, desfeita.

## O que fica para uma próxima rodada
- **O soltar de um arraste:** o quadro de `onUp` passou de 50 ms na suíte só com a CPU disputada; sozinho, o caso passa. Por contagem, cada arraste lê cerca de 640 vezes a caixa e o estilo do iframe (`geometryOf`, `src/editor/canvas/coordinates.ts:62`). Cada leitura é barata enquanto o layout está limpo, e são só cerca de 31 layouts por arraste. No perfil, o resto é redesenho do React (`DoorControl`, `renderWithHooks`).
- **O bundle:** a divisão de código não se aplica sem mudar o comportamento (`decisoes.md`, DCS-026). O manifesto de comandos é lido em execução: as portas são a maior parte dele.
