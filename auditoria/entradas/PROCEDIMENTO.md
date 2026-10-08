# Procedimento das demais entradas (Fase 4)

Você recebe uma área de código (um lote, indicado no seu prompt). O seu trabalho é levantar TODA forma de o código daquela área começar a executar, fora as portas de comando, e gravar um bloco por entrada em `auditoria/entradas/<área>.md`.

## O que é uma entrada
- ouvintes do DOM (`addEventListener`, propriedades `on*`);
- handlers declarados no JSX (`onClick={...}` e outros) que **não** sejam portas de comando (uma porta de comando já é registrada em `auditoria/entradas/portas-<domínio>.md`);
- efeitos e ciclo de vida (montagem e desmontagem: `useEffect`, `useLayoutEffect`, métodos de classe);
- temporizadores e quadros (`setTimeout`, `setInterval`, `requestAnimationFrame`, `requestIdleCallback`, `queueMicrotask`);
- observadores (`ResizeObserver`, `MutationObserver`, `IntersectionObserver`, `PerformanceObserver`);
- mensagens entre o editor e o iframe (`postMessage`, `onmessage`);
- continuações de Promise (`.then`, `.catch`, `.finally`, `await` num ponto que volta a executar depois);
- assinaturas de store (`subscribe`);
- boot e carga (efeito de topo de módulo, `await` de topo);
- restauração de rascunho.

## O que gravar
Um bloco por entrada, em `auditoria/entradas/<área>.md`:

## ENT-<área>-<nnnn> — <nome curto>
- **Tipo:** listener | handler-jsx | montagem | desmontagem | timer | frame | microtarefa | observer | mensagem | promessa | assinatura-de-store | boot | carga-de-projeto | restauração-de-rascunho
- **Origem:** `<caminho>:<linha>` `<trecho literal da linha que declara a entrada>`
- **Início:** `<caminho>:<linha>` `<trecho literal da linha onde o código começa a executar>`
- **Fluxo:** `fluxos/ENT-<área>-<nnnn>.md` (o arquivo entra na Fase 5)
- **Requisitos:** <os ids REQ- que a entrada executa, quando houver um; omita o campo quando não houver>

Numere em sequência a partir da faixa indicada no seu prompt.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C3,C7 --resumo` e confira que nenhuma pendência aponta para o seu arquivo. As pendências de C5 e de C9 são das fases seguintes e não contam aqui.

## Regras
- Todo trecho citado é copiado literalmente da linha; a gravação é recusada quando o trecho não está na linha.
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantas entradas por tipo e a faixa de ids usada.
