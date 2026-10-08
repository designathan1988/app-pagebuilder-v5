# Procedimento de um domínio de requisitos (Fase 2)

Você recebe um domínio de comando do manifesto (por exemplo `history`). O seu trabalho é montar, para cada comando do domínio, um requisito em `auditoria/requisitos/<domínio>.md`.

## O que ler
1. `manifest/commands/<domínio>.json` por inteiro (em partes, se preciso: cada leitura com custo até 50.000 caracteres, calculado como as linhas mais 8 por linha).
2. A feature que introduz cada comando: o campo `introducedBy` do comando nomeia a feature; a feature vive em `manifest/features/<NN>-<nome>.json`. Leia o `intent` e os `scenarios` dela — eles definem o comportamento esperado (DCS-004, em `auditoria/decisoes.md`).
3. `src/app/commands.ts` na linha do tratador do comando.
4. `src/app/features.ts` na linha do `registerFeature` da feature.

## O que gravar
Um bloco por comando, em `auditoria/requisitos/<domínio>.md`:

## REQ-<id> — <nome do comando>
- **Onde:** `manifest/commands/<domínio>.json:<linha>` `<trecho literal daquela linha>`
- **Tratador:** `src/app/commands.ts:<linha>` `'<id do comando>': <nome do tratador>,`
- **Feature:** `src/app/features.ts:<linha>` `'<feature>': registerFeature('<feature>'),`
- **Recusa declarada:** `manifest/commands/<domínio>.json:<linha>` `"refusalKey": "<chave>"` (só quando o comando declarar uma)
- **Comportamento esperado:** <em português, o que o comando faz para a pessoa, tirado do `intent` e dos `scenarios` da feature, do rótulo de i18n e das regras G1 a G7 do CLAUDE.md>

Regras:
- **Não** escreva os campos **Entradas** nem **Trecho**: eles entram nas fases 4 e 5, e citá-los agora criaria referências a registros que ainda não existem.
- Todo trecho citado é copiado literalmente da linha; a gravação é conferida e recusada quando o trecho não está na linha.
- Quando o `intent` ou os `scenarios` divergirem do código, registre o requisito pelo que o manifesto diz e **não** abra o defeito: a divergência é da Fase 8. Anote a divergência numa linha `- **Divergência:** <o que diverge, com a citação>` no próprio requisito.
- Os ids `REQ-` vêm da faixa que o seu prompt indica; numere em sequência a partir dela, um por comando, sem repetir.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7,C9 --resumo` e confira que não há pendência apontando para o seu arquivo. Rode também `node tools/audit/check.mjs --so C9 --lote ignorado 2>/dev/null || true` para ver as pendências de C9 dos comandos ainda sem requisito (elas são esperadas enquanto os outros domínios não fecharem; só as do seu domínio são suas).

## Regras gerais
- Escreva em português. Não use as palavras proibidas da vistoria (a lista está em `.claude/vistoria.config.json`; o verificador aponta cada ocorrência).
- Não edite nada fora de `auditoria/`.
- Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantos comandos o domínio tem, quantos requisitos foram gravados, e a faixa de ids usada.
