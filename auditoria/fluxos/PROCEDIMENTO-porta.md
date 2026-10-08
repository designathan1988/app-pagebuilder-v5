# Procedimento do fluxo de porta (Fase 5)

Você recebe um domínio de comando. Para CADA porta listada em `auditoria/entradas/portas-<domínio>.md` escreva um arquivo `auditoria/fluxos/ENT-P-<domínio>-<nnnn>.md`, com as oito seções obrigatórias, nesta ordem e com estes títulos exatos: `## Passos`, `## Ramos`, `## Fronteiras assíncronas`, `## Estado`, `## Resultado`, `## Regras`, `## Limpeza`, `## Medições`; e, no fim, a seção `## Ramos do trecho`.

O trecho do comando já existe em `auditoria/fluxos/trechos/TRC-<comando>.md`. O fluxo de porta NÃO o repete: ele rastreia só o caminho próprio, da porta até a chamada que entra no trecho.

## O que rastrear
Leia o campo **Início** do bloco da porta em `auditoria/entradas/portas-<domínio>.md`. Comece ali e siga cada chamada até a linha que despacha o comando ao tratador (a `Chamada` do trecho). Abra cada função chamada e cite cada passo.

## O fecho do fluxo
Depois de `## Medições`, escreva:

## Ramos do trecho
- **Trecho:** TRC-<id-do-comando>
- **Argumentos enviados:** <os valores que esta porta envia, campo a campo>
- um item por ramo listado em `Ramos que dependem dos argumentos` do trecho, dizendo por qual lado os argumentos desta porta fazem o caminho passar, com citação.

O último passo de `## Passos` tem de citar a MESMA linha da `Chamada` do trecho.

## As demais seções
- `## Passos`: um passo por linha, numerado, cada um com a citação da linha que executa, e as marcas `[lê: EST-x via <função>]` / `[escreve: EST-x via <função>]` quando o passo toca estado (ids de `auditoria/estado.md`).
- `## Ramos`: um item por condição, com a citação, os valores que levam a cada lado e o resultado de cada lado.
- `## Fronteiras assíncronas`: um item por `await`, timer, quadro ou ouvinte, com a citação, as entradas que podem rodar no intervalo (ids de `auditoria/entradas.md`) e o estado da aplicação; `- nenhuma` com o motivo quando não houver.
- `## Estado`: os ids lidos e os escritos.
- `## Resultado`: os quatro campos `- **Estado final:**`, `- **Re-renderizado:**`, `- **DOM do editor:**`, `- **DOM do canvas:**`.
- `## Regras`: as oito linhas G1 a G7 e INT, cada uma com `ok` mais citação, `DEF-<nnnn>` ou `n/a — <motivo citado>`.
- `## Limpeza`: a remoção citada de todo ouvinte, timer ou observador criado; sem ela, `DEF-<nnnn>`.
- `## Medições`: `- nenhuma` ou os ids `MED-<nnnn>`.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7,C5 --resumo` e corrija até nenhuma pendência estrutural apontar para os seus arquivos.

## Regras
- Todo trecho citado é copiado literalmente da linha; nada de memória.
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantas portas, quantos fluxos gravados, e qualquer ramo do trecho que ficou indeterminado.
