# Procedimento das portas de comando (Fase 4)

Você recebe um domínio de comando (por exemplo `history`). A fonte é `manifest/commands/<domínio>.json`, e cada porta de cada comando é uma entrada.

Leia o arquivo por inteiro, em partes (cada leitura com custo até 50.000 caracteres, calculado como as linhas mais 8 por linha).

## O que gravar
Um bloco por porta, em `auditoria/entradas/portas-<domínio>.md`:

## ENT-P-<domínio>-<nnnn> — <id do comando> pela porta <ref da porta>
- **Tipo:** comando-porta <kind da porta>
- **Comando:** <o id do comando>
- **Porta:** `<caminho do manifesto>:<linha>` `<trecho literal da linha do "id" da porta>`
- **Gatilho:** `<caminho do manifesto>:<linha>` `<trecho literal do "chord", "zone", "gesture" ou "source" da porta, o que ela tiver; omita este campo quando a porta não declara gatilho>`
- **Tratador:** `src/app/commands.ts:<linha>` `'<id do comando>': <nome do tratador>,` (quando o comando for de um módulo instalado, cite `src/app/modules.ts:24`)
- **Início:** <a citação da linha que despacha a porta: o keymap para uma porta `shortcut`, `src/editor/doors/door.tsx` para um controle desenhado, o dono do ponteiro para uma porta de canvas; leia a linha e cite o trecho literal>
- **Fluxo:** `fluxos/ENT-P-<domínio>-<nnnn>.md` (o arquivo entra na Fase 5)
- **Requisitos:** <os ids REQ- do comando, lidos em `auditoria/requisitos/<domínio>.md`>

Numere em sequência a partir da faixa indicada no seu prompt, uma porta por bloco, sem repetir. O `kind` da porta é o campo `kind` do objeto `door`.

## Fechamento
Rode `node tools/audit/check.mjs --so C2,C7,C3 --resumo` e confira que nenhuma pendência aponta para o seu arquivo. As pendências de C5 e de C9 são das fases seguintes e não contam aqui.

## Regras
- Todo trecho citado é copiado literalmente da linha; a gravação é recusada quando o trecho não está na linha.
- Escreva em português e não use as palavras proibidas da vistoria.
- Não edite nada fora de `auditoria/`. Não rode testes.

## Resposta final
Responda em menos de 150 palavras: quantos comandos e quantas portas, e a faixa de ids usada.
