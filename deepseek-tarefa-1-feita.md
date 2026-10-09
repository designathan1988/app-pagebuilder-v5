# Tarefa do DeepSeek: tudo o que não é visual nem de navegador

Execute sem me perguntar nada.

## Primeiro: pare a manutenção da auditoria (decisão do dono)
Os registros de `auditoria/` (citações, inventário, fluxos, matriz, pares, `check.mjs`) não são mais mantidos. A prova de que o app funciona passa a ser: os detectores, `npm run typecheck` e `npm run lint`.
- Não rode `recitar.mjs`, `inventariar.mjs`, `matriz.mjs`, `renumerar.mjs`, `esqueletos.mjs` nem `check.mjs`.
- Não atualize citações, fluxos, pares, `estado.md`, `entradas.md` nem `inventario-arquivos.md`.
- No `CLAUDE.md`:
  - apague a seção 9 (travas);
  - na seção 2, troque os passos 3 e 4 por: "Depois de alterar: rode os detectores da área (`npx vitest run --config tools/runner/model/vitest.config.ts`), `npm run typecheck` e `npm run lint`; todo defeito corrigido ganha um mutante no catálogo que o detector acusa antes da correção e não acusa depois."
- No `auditoria/progresso.md`:
  - troque a seção "Procedimentos" pela mesma regra acima;
  - registre esta decisão com a data.
- Continue usando `auditoria/progresso.md` (o andamento), `auditoria/defeitos.md` (cada defeito, com a correção e o mutante) e `auditoria/mecanismos.md` (cada mecanismo novo).

## O que fazer, nesta ordem
1. **Os 8 elementos "porta faltando".** O "Próximo passo" de `auditoria/progresso.md`. Para cada um, confira:
   - se o popover está ligado ao campo por `aria-controls` (G2);
   - se envia a mesma intenção ao mesmo tratador que a porta com `data-door` (G3).

   Cada achado vira DEF-. Escreva o mutante ou o passo de modelo que reproduz a causa e confirme que o detector acusa. Corrija na causa raiz (`CLAUDE.md`, seção 4) e confirme que o detector parou de acusar.
2. **A parte sem navegador do C8** (`auditoria/investigacao/relatorio.md`):
   - chaves de i18n dos dois idiomas;
   - corpus de importação contra XSS;
   - corrupção e migração do que é salvo;
   - ReDoS;
   - poluição de protótipo;
   - compatibilidade;
   - contadores de render em happy-dom.

   O que for acusado segue a mesma regra do item 1.

## O que não fazer
- **Nada visual, nada de navegador.** Isso inclui:
  - a etapa 4 inteira: fonte, medição de texto com a fonte e lote do navegador;
  - as partes de navegador da etapa 5: Long Animation Frames, memória pelo CDP e as classes de navegador do C8.

  Liste tudo isso em `auditoria/progresso.md`, numa seção "Para o Claude".
- **Sem suíte completa.** Não rode a suíte completa de testes. Rode só os detectores, os testes da área que mudou, `npm run typecheck` e `npm run lint`.
- **Sem push.** Faça um commit local ao fim de cada item, só com os arquivos que você mudou.

## Fim
- Detectores, `npm run typecheck` e `npm run lint` sem falha.
- `auditoria/progresso.md` atualizado, com:
  - a taxa de acusação do catálogo de mutantes;
  - a seção "Para o Claude".
