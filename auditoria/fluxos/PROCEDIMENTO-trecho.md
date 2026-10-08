# Procedimento do trecho de comando (Fase 5)

Você recebe um domínio de comando. Para CADA comando do domínio escreva um arquivo `auditoria/fluxos/trechos/TRC-<id-do-comando>.md`, com as oito seções obrigatórias, nesta ordem e com estes títulos exatos: `## Passos`, `## Ramos`, `## Fronteiras assíncronas`, `## Estado`, `## Resultado`, `## Regras`, `## Limpeza`, `## Medições`.

Antes das seções, o cabeçalho:

# TRC-<id-do-comando>
- **Chamada:** `<caminho>:<linha>` `<trecho literal da linha onde o despacho chama o tratador>`
- **Argumentos:** <a forma dos argumentos que o tratador recebe, com o nome de cada campo>
- **Ramos que dependem dos argumentos:** <os ids dos ramos (R1, R2…) cujo caminho muda com o valor de um argumento>

## Como rastrear
- Comece no tratador do comando (a linha de `src/app/commands.ts` ou, para um módulo, a de `src/modules/…`). Abra CADA função que ele chama, seguindo até o fim, e cite cada passo com `` `caminho:LINHA` `trecho literal` ``. Nunca deduza o comportamento pelo nome de uma função.
- Em `## Passos`, um passo por linha, numerado, cada um com a citação da linha que executa. Marque o estado lido e escrito de cada passo assim: `[lê: EST-x via <função>]` e `[escreve: EST-x via <função>]`, usando os ids de `auditoria/estado.md`.
- Em `## Ramos`, um item por condição (R1, R2…): a citação da condição, quais valores de estado levam a cada lado e o resultado de cada lado.
- Em `## Fronteiras assíncronas`, um item por `await`, timer, quadro ou ouvinte: a citação, quais entradas podem rodar no intervalo (ids de `auditoria/entradas.md`) e em que estado a aplicação está. Se não houver nenhuma, escreva `- nenhuma` e cite o motivo.
- Em `## Estado`, a lista dos ids lidos e dos escritos.
- Em `## Resultado`, exatamente estes quatro campos: `- **Estado final:**`, `- **Re-renderizado:**`, `- **DOM do editor:**`, `- **DOM do canvas:**`, cada um com citação ou com as palavras "nada muda".
- Em `## Regras`, exatamente oito linhas — G1, G2, G3, G4, G5, G6, G7 e INT — cada uma no formato `- G1: ok `<citação>`` ou `- G4: n/a — <motivo citado>` ou `- G2: DEF-<nnnn>`. Use `n/a` quando a regra não se aplica ao trecho, sempre com motivo citado.
- Em `## Limpeza`, todo ouvinte, timer ou observador criado no trecho tem a remoção citada; sem ela, abra `DEF-<nnnn>` e cite o ponto.
- Em `## Medições`, `- nenhuma` ou o id `MED-<nnnn>` de cada valor que só o navegador calcula (dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto, ordem de foco).

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7,C5 --resumo` e corrija até nenhuma pendência apontar para os seus arquivos. As pendências de C5 dos outros domínios e de C6 são esperadas.

## Regras
- Todo trecho citado é copiado literalmente da linha; a gravação é recusada quando o trecho não está na linha.
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantos comandos, quantos trechos gravados, e qualquer ramo que ficou sem medição.
