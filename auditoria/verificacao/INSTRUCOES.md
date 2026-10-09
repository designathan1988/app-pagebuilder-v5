# Verificação integral (2026-10-09): instruções comuns a todo verificador

O dono pediu a verificação de **tudo** o que está registrado como feito. Você verifica um grupo de registros e grava o resultado em `auditoria/verificacao/<seu-grupo>.md`. Não confie no que o registro afirma: confira no código e, quando houver detector, rodando o detector.

## Proibido
- Alterar qualquer arquivo fora de `auditoria/verificacao/<seu-grupo>.md` e do scratchpad. Nada de editar `src/`, `tools/`, `tests/`, `manifest/` ou outros registros.
- Mudar a árvore de trabalho do git: nada de `git stash`, `git checkout`, `git reset`, `git worktree`, commit. Para ver o código antigo, use `git show <commit>^:<caminho>` e `git log`.
- Rodar Playwright (`npx playwright test`, `npm test`, `npm run e2e`, `npm run ui`): outra execução está usando o navegador e o `dist/`.
- Rodar `tools/audit/check.mjs`, `recitar.mjs`, `inventariar.mjs`, `matriz.mjs`, `renumerar.mjs`, `esqueletos.mjs` (a manutenção da auditoria foi encerrada pelo dono).
- Palavras proibidas no relatório: "etc.", "e assim por diante", "similar", "mesmo padrão", "análogo", "presumivelmente", "provavelmente", "deve funcionar", "aparentemente".

## Permitido
- Ler qualquer arquivo; `git log`, `git show`, `git diff <a> <b>`.
- Rodar os detectores: `npx vitest run --config tools/runner/model/vitest.config.ts` (todos, ~11 s) ou com um arquivo (`npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/<grupo>.test.ts`), e com um mutante: `BUILDER_MUTANT=<id> npx vitest run --config tools/runner/model/vitest.config.ts`.
- Rodar testes unitários de uma área: `npx vitest run <caminho-do-teste>` (configuração padrão), sem `--coverage`.
- Scripts curtos em Node lendo arquivos (no scratchpad, nunca no projeto).

## O que conferir em cada registro
1. **O código faz o que o registro afirma?** Abra a função citada e as que ela chama. Nunca deduza pelo nome.
2. **A correção está na causa raiz** (o ponto garantidor do `CLAUDE.md`, seção 4), e não num sintoma?
3. **A correção introduziu outro defeito?** Leia o diff do commit da correção inteiro (`git log -S` ou `git log --format=%h -- <arquivo>` acha o commit) e procure regressões: ramos que mudaram de comportamento, estados novos sem limpeza, foco, ordem de efeitos, casos de borda.
4. **O detector prova o que diz provar?** Leia o teste. Procure afirmações vazias: casos que passam sem passar pelo caminho conferido, contagens que incluem casos que não rodaram, `try/catch` que engole falha, limites mínimos frouxos, comparação com o próprio valor, mock que substitui o que devia ser testado.
5. **O mutante reproduz o código de antes da correção?** Compare o trecho do mutante em `tools/runner/mutants.ts` com `git show <commit-da-correção>^:<arquivo>`. Rode o detector com o mutante: precisa acusar. Rode sem: precisa passar.
6. **Proibições do projeto** no código novo: `@ts-ignore`, `eslint-disable`, `any` para calar tipo, try/catch vazio, fallback que esconde falha, funcionalidade removida.

## Formato do relatório
Para cada registro do grupo, uma seção `## <ID> — <título curto>` com:
- **Veredito:** `confirmado` (tudo o que o registro afirma confere), `parcial` (parte confere; diga qual não) ou `não confere`.
- **Provas:** cada afirmação com a citação `` `caminho/arquivo.ts:LINHA` `trecho exato da linha` `` e a saída resumida dos comandos rodados (contagens de testes, nome do teste que falhou com o mutante).
- **Achados:** cada problema com o efeito concreto (entrada → resultado errado). Só o que você confirmou lendo o código ou rodando; hipótese não confirmada vai marcada como "não verificado" com o motivo.

No fim do arquivo, uma seção `## Resumo` com uma linha por registro: ID, veredito e o achado principal.
Grave o arquivo à medida que avança (um registro por vez), e não só no final.
