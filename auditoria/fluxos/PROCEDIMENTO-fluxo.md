# Procedimento do fluxo de uma entrada (Fase 5)

Você recebe uma área de código. Para CADA entrada listada em `auditoria/entradas/<área>.md` que NÃO seja uma porta de comando (o tipo dela não começa por `comando-porta`), escreva um arquivo `auditoria/fluxos/<id-da-entrada>.md` com as oito seções obrigatórias, nesta ordem e com estes títulos exatos: `## Passos`, `## Ramos`, `## Fronteiras assíncronas`, `## Estado`, `## Resultado`, `## Regras`, `## Limpeza`, `## Medições`.

(Portas de comando já têm o fluxo delas, com `## Ramos do trecho`; não as refaça.)

## Como rastrear
Comece na linha do campo **Início** da entrada e siga CADA chamada até o fim, abrindo cada função chamada. Cite cada passo com `` `caminho:LINHA` `trecho literal` ``. Nunca deduza o comportamento pelo nome de uma função.

Quando o caminho chegar a uma chamada já rastreada noutro arquivo com os MESMOS argumentos (um trecho de comando, por exemplo), cite o arquivo e não repita o trecho.

## As seções
- `## Passos`: um passo por linha, numerado, com a citação da linha que executa, e as marcas `[lê: EST-x via <função>]` / `[escreve: EST-x via <função>]` quando o passo toca estado (ids de `auditoria/estado.md`).
- `## Ramos`: um item por condição, com a citação, os valores que levam a cada lado e o resultado de cada lado.
- `## Fronteiras assíncronas`: um item por `await`, timer, quadro ou ouvinte, com a citação, quais entradas podem rodar no intervalo (ids de `auditoria/entradas.md`) e o estado da aplicação; `- nenhuma` com o motivo quando não houver.
- `## Estado`: os ids lidos e os escritos.
- `## Resultado`: exatamente os quatro campos `- **Estado final:**`, `- **Re-renderizado:**`, `- **DOM do editor:**`, `- **DOM do canvas:**`.
- `## Regras`: exatamente as oito linhas G1 a G7 e INT, cada uma com `ok` mais citação, `DEF-<nnnn>` ou `n/a — <motivo citado>`.
- `## Limpeza`: a remoção citada de todo ouvinte, timer ou observador criado; sem ela, `DEF-<nnnn>`.
- `## Medições`: `- nenhuma` ou os ids `MED-<nnnn>`.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7,C5 --resumo` e corrija até nenhuma pendência estrutural apontar para os seus arquivos.

## Regras
- Todo trecho citado é copiado literalmente da linha; nada de memória.
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantas entradas não-porta a área tem, quantos fluxos gravados, e qualquer entrada cujo rastreamento ficou incompleto.
