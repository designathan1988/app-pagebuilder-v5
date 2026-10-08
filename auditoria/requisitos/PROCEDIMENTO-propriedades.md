# Procedimento: propriedades e composições (Fase 2)

A fonte é `manifest/properties.json`. Leia o arquivo por inteiro, em partes (cada leitura com custo até 50.000 caracteres, calculado como as linhas mais 8 por linha).

## Propriedades editáveis
Para cada entrada de `properties` escreva um bloco em `auditoria/requisitos/propriedades.md`, na faixa **REQ-2801 a REQ-2999**:

## REQ-<id> — <nome da propriedade>
- **Onde:** `` `manifest/properties.json:<linha>` `` `` `<trecho literal da linha do id da propriedade>` ``
- **Rótulo:** `` `manifest/properties.json:<linha>` `` `` `"labelKey": "<chave>"` ``
- **Comportamento esperado:** <em português: o que a propriedade escreve no CSS (`codec`, `valueType`), a que elementos se aplica (`appliesTo`), e o que a pessoa vê ao editá-la no inspetor>

## Composições, receitas e estados
Depois das propriedades, na mesma faixa e continuando a numeração, um bloco para cada entrada de `composites`, de `recipes` e de `states`:

## REQ-<id> — <nome>
- **Onde:** `` `manifest/properties.json:<linha>` `` `` `<trecho literal da linha do id>` ``
- **Comportamento esperado:** <em português: para uma composição, quais propriedades longas ela agrupa e como as lê; para uma receita, que declarações ela escreve; para um estado, sobre que elementos ele fica e como aparece>

Regras:
- Todo trecho citado é copiado literalmente da linha; a gravação é recusada quando o trecho não está na linha.
- Não escreva os campos **Entradas** nem **Trecho** (fases 4 e 5).
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7 --resumo` e confira zero pendências apontando para o seu arquivo.

## Resposta final
Responda em menos de 150 palavras: quantas propriedades, composições, receitas e estados, e a faixa de ids usada.
