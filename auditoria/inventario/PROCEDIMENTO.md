# Procedimento de um lote da Fase 2

Você é um subagente da Fase 2 da auditoria do repositório `C:\Codex-Shared\webconstructor` (projeto Builder, um page builder com editor visual). Seu trabalho é SOMENTE ler arquivos e registrar o que leu. Não edite código da aplicação. Não rode testes.

Você recebe um lote (por exemplo `L06`). Substitua `LX` pelo seu lote em tudo abaixo.

## Como ler
1. Abra `auditoria/lotes/LX.md`. Para cada arquivo ele traz: caminho, número de linhas, SHA1 e a lista de leituras no formato `(offset, limit)`.
2. Para cada arquivo, faça exatamente aquelas leituras com a ferramenta Read (passe `offset` e `limit`). Havendo uma única leitura, pode omitir offset e limit.
3. Se um Read responder "PARTIAL", releia aquela faixa em duas metades menores e registre esse fato no bloco.
4. Leia TODOS os arquivos do lote. Nenhum pode faltar.

## Como gravar
Escreva `auditoria/inventario/LX.md` com, para cada arquivo, um bloco exatamente neste formato:

```markdown
### `caminho/do/arquivo.ts`
- **Lote:** LX
- **Linhas:** (o mesmo número do lotes/LX.md)
- **SHA1:** (o mesmo sha1 do lotes/LX.md)
- **Partes lidas:** (as faixas lidas, por exemplo 1-1200, ou 1-800; 801-1530)
- **Propósito:** (uma frase em português dizendo o que o arquivo faz, derivada do conteúdo lido)
- **Âncora:** `src/core/document/model.ts:17` `export const DOCUMENT_VERSION = 4;`
```

Regras do formato:
- **Partes lidas** sempre no formato `início-fim`; um arquivo de uma linha vira `1-1`, nunca `1`.
- **Âncora** é conferida automaticamente: o trecho entre crases tem de ser copiado literalmente de uma linha existente do arquivo. Se errar, a gravação é recusada com erro. Prefira uma linha curta, sem crases no meio, e confira o número da linha.

## Fechamento
Rode: `node tools/audit/check.mjs --so C1,C2,C7 --lote LX`
Ele precisa terminar com `TOTAL: 0 pendências`. Se apontar pendência, corrija o registro e rode de novo. Só então responda.

## Regras
- Escreva em português. A lista de palavras proibidas nos registros está na configuração da vistoria, em `.claude/vistoria.config.json`, e o verificador aponta cada ocorrência; não as use fora de trechos de código.
- Não afirme comportamento de arquivos fora do seu lote.
- Não leia arquivos fora do lote (gasta orçamento), exceto `auditoria/lotes/LX.md`, este procedimento e `auditoria/plano-execucao.md`.
- Não edite nada fora de `auditoria/`.
- Não rode `npm test`, `npm run e2e` nem qualquer suíte de testes.

## Resposta final
Responda em menos de 150 palavras: quantos arquivos foram lidos, a saída final do comando de conferência e qualquer faixa que exigiu releitura.
