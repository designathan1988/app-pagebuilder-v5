# Procedimento: tipos de elemento e atributos (Fase 2)

A fonte é `manifest/elements.json`. Leia o arquivo por inteiro, em partes (cada leitura com custo até 50.000 caracteres, calculado como as linhas mais 8 por linha).

## Tipos de elemento
Para cada entrada de `elements` escreva um bloco em `auditoria/requisitos/elementos.md`, na faixa **REQ-2601 a REQ-2799**:

## REQ-<id> — <nome do tipo>
- **Onde:** `` `manifest/elements.json:<linha>` `` `` `<trecho literal da linha do id do tipo>` ``
- **Rótulo:** `` `manifest/elements.json:<linha>` `` `` `"labelKey": "<chave>"` ``
- **Comportamento esperado:** <em português: para que o tipo serve, que conteúdo aceita (`content`), que tags pode tomar (`tag` e `alternativeTags`), que filhos naturais cria (`naturalChild`) e em que grupo da paleta aparece (`palette`)>

## Atributos
Para cada entrada de `attributes` escreva um bloco na mesma faixa, continuando a numeração:

## REQ-<id> — <nome do atributo>
- **Onde:** `` `manifest/elements.json:<linha>` `` `` `<trecho literal da linha do id do atributo>` ``
- **Rótulo:** `` `manifest/elements.json:<linha>` `` `` `"labelKey": "<chave>"` ``
- **Comportamento esperado:** <em português: que valor toma (`valueType`), em que elementos se aplica (`elements`), se é global, e o que a pessoa vê quando o edita>

Regras:
- Todo trecho citado é copiado literalmente da linha; a gravação é recusada quando o trecho não está na linha.
- Não escreva os campos **Entradas** nem **Trecho** (fases 4 e 5).
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7 --resumo` e confira zero pendências apontando para o seu arquivo.

## Resposta final
Responda em menos de 150 palavras: quantos tipos e quantos atributos, e a faixa de ids usada.
