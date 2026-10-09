# Builder: instruções do projeto

Page builder com editor visual. O canvas é renderizado em iframe e há breakpoints, estados, classes e quadros-chave. A interface tem dois idiomas: pt-BR e inglês.

Este arquivo contém **requisitos e regras de trabalho**. Ele não descreve o estado atual do código: o estado está em `auditoria/progresso.md`.

## 0. Ritmo (exigência do dono, 2026-10-09)
O trabalho estava lento demais pelo ritual, não pelo código. Valem estas regras:
- **Lotes por área:** corrija de 5 a 10 defeitos da mesma área por vez. Dentro do lote, rode só o grupo de detectores da área (`npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/<grupo>.test.ts`) e o spec de navegador da área.
- **Portões completos uma vez por lote:** todos os detectores, `npm run typecheck`, `npm run lint`, os mutantes novos (`BUILDER_MUTANT=<id>`) e um commit com push.
- **Catálogo inteiro de mutantes e suíte inteira de navegador:** só no fim de uma etapa.
- **Ferramenta de teste nova** só quando um defeito do app pedir. Não conserte ferramenta por conserto.
- **Sem perguntas:** decisão de produto vai para `auditoria/decisoes.md` com a opção que preserva o comportamento atual, e o trabalho segue.
- **Subagentes** para o mecânico (rodar, medir, capturar) e para a conferência cética antes de declarar um lote feito.

## 1. Memória do trabalho
- `auditoria/progresso.md`: o estado e **um único** próximo passo. Leia antes de começar; atualize ao fim de cada lote. É curto: histórico não entra nele.
- `auditoria/defeitos.md`: um registro por defeito, **no máximo 5 linhas** (formato abaixo).
- `auditoria/decisoes.md`: decisões tomadas, que não se rediscutem.
- `auditoria/mecanismos.md`: cada detector novo, uma linha.
- `auditoria/otimizacoes.md`: cada otimização, com a medida de antes e depois.
- Os demais arquivos de `auditoria/` (inventários, fluxos, matriz, interações, `check.mjs`) estão **congelados** desde 2026-10-08: não se leem, não se atualizam, não se rodam.

Formato do defeito:
```
## DEF-NNNN — título
- Status: aberto | corrigido (commit)
- Sintoma: o que o usuário vê, e como reproduzir.
- Causa: `caminho:linha` e uma frase.
- Prova: detector (grupo) e mutante (Mnnn), ou o spec de navegador que falha antes e passa depois.
```

## 2. Escopo
- **Dentro:** editor e canvas; blocos e componentes; estado e renderização; interações e estilos; serialização e i18n; performance.
- **Fora:** publicação, deploy, banco de dados, infraestrutura, hospedagem e CI. Não altere, não comente, não sugira.
- Persistência e backend são fronteira fixa: rastreie até a chamada da interface existente e não além.

## 3. Método
1. Leia o código envolvido (a função inteira e quem a chama). Nunca deduza o comportamento pelo nome de uma função.
2. Corrija no ponto único que garante a regra (seção 4), nunca em cada componente que manifesta o defeito.
3. Todo defeito corrigido ganha prova: um mutante no catálogo (`tools/runner/mutants.ts`) que o detector acusa antes da correção e não acusa depois; defeito de layout tem como prova o spec que falha antes e passa depois.
4. Um detector precisa passar pelo caminho que confere: um caso que passaria com o código quebrado não é prova.
5. Antes de dizer que um lote está feito: os portões completos sem falha **e** o app usado no navegador como o usuário usa (seção 8).

## 4. Conduta
- Proibido declarar "funciona", "corrigido" ou equivalente sem a saída dos portões do lote.
- Proibido silenciar erros: `@ts-ignore`, `eslint-disable`, `any` para calar o tipo, try/catch vazio, fallback que esconde falha, remover funcionalidade.
- Proibido mudar texto da interface só para um detector passar. Rótulo que não cabe é corrigido no CSS do componente; encurtar a mensagem só quando o texto novo for igualmente claro (sem abreviação).
- Bibliotecas externas: consulte a documentação oficial da versão instalada antes de usar uma API nova.
- Relate fatos, sem ressalvas.

## 5. Regras do editor
Cada regra tem um ponto garantidor. Os caminhos devem ser confirmados no código; se algum estiver errado, corrija a seção 7.

### G1. Toda edição é gravada no contexto em que foi feita
O contexto inclui os elementos, o breakpoint, o estado, a classe-alvo e o quadro-chave.
- **Ponto garantidor:** `dispatch` da store do núcleo (`src/core/store/store.ts`), que aceita um `EditContext`; `editContextOf` (`src/editor/store.ts`), que o captura na primeira digitação; o rascunho guardado leva o breakpoint e o quadro-chave (`src/editor/persistence/drafts.ts`).
- **Exigido:** toda gravação usa o contexto capturado na primeira digitação, inclusive quando breakpoint, estado, classe, quadro-chave ou seleção mudam com a digitação pendente, e na restauração de rascunho.

### G2. Digitação nunca some
- **Ponto garantidor:** o registro único `src/editor/input/pending.ts`, aplicado na store do editor (`gestureSafe` em `src/editor/store.ts`, em `dispatch`, `gesture`, `sequence` e `commandGroup`) e no início de cada toque (`src/editor/input/pointer/events.ts`).
- **Exigido:** com rascunho pendente, o registro grava antes, no contexto da digitação, quando qualquer entrada muda a seleção ou a camada, um painel fecha, um toque começa ou roda um comando que altera o documento ou vem de fora do campo.
- **Comandos do próprio campo:** lidos do manifesto (partes, arraste do rótulo, teclas do contexto do campo); rodam no contexto da digitação.
- **Limite do campo:** a linha dele e as camadas ligadas por `aria-controls`. Ações dentro do campo não forçam gravação.
- **Exceção única:** o Esc do painel rápido descarta o rascunho.
- **Manutenção:** nunca acrescente "lembre de gravar o campo" num caminho novo. Corrija o registro.

### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado
- **Ponto garantidor:** o tratador do comando. Cada porta (botão, tecla, roda, arraste) envia só a intenção: o texto do campo, mesmo vazio, e a direção. Exemplos: `startOf` em `src/editor/inspector/number-field.ts` e `Layout.computed` em `src/core/ports/layout.ts`. Porta que decide por conta própria é defeito.

### G4. O resultado de uma ação fica visível
Nada do editor cobre o canvas no ponto da ação. A barra lateral ocupa a própria coluna em qualquer janela; numa janela estreita, a primeira visita abre com ela fechada (`src/editor/workspace/narrow.ts`).

### G5. Painéis e barras cabem; nenhum controle fica fora de alcance
- **Famílias de defeito:** `cut`, `wrapped`, `off-window`, `covered`, `english`, `sideways`. Exceções só em `tests/support/screen-guard-allowed.ts`, com motivo.
- **Técnicas:** medir fora de vista numa caixa de tamanho zero que recorta (`overflow: hidden; contain: strict`); todo item que cresce declara como encolhe (`min-width: 0`); medir contra o espaço do próprio elemento, nunca contra uma trilha; a trilha da barra de status recolhe os níveis do meio (`src/editor/shell/crumb-fold.ts`).
- Vale nas duas configurações de tela, com documento profundo e nomes longos.

### G6. Todas as vistas mostram a mesma seleção
A store é a fonte única: toda escrita de seleção passa por ela; canvas e Camadas só derivam dela.

### G7. O canvas é o documento
O render incremental é igual a um render do zero, e a renderização do editor coincide com a exportação.

### Integridade do documento
Após toda escrita: esquema de cada bloco válido; IDs únicos; nenhum bloco órfão nem referência quebrada; pai/filho e aninhamento consistentes; undo/redo consistente; serialização ida-e-volta idêntica.

## 6. Decisões do dono (só ele muda)
- **D-1:** as abas de breakpoint ficam coladas no topo da moldura.
- **DEC-70:** o rótulo da seleção fica sempre acima do elemento, encostado na moldura. O chip do painel rápido fica à direita do rótulo.
  - **Exceção (2026-10-07):** quando esse lugar cai sobre as abas de breakpoint (elemento no topo da página), rótulo e chip seguem pela linha de cima da moldura até passar a última aba, enquanto couberem sobre o elemento; num elemento estreito sob as abas, ficam logo abaixo dele.
  - **Onde vive:** `clearedLabel` em `src/editor/canvas/placement.ts`.

## 7. Mapa do código
| Área | Onde fica |
|---|---|
| Store do núcleo | `src/core/store/store.ts` |
| Portas do núcleo | `src/core/ports/` |
| Store do editor | `src/editor/store.ts` |
| Entrada e rascunhos pendentes | `src/editor/input/` |
| Persistência de rascunhos | `src/editor/persistence/` |
| Inspector | `src/editor/inspector/` |
| Canvas | `src/editor/canvas/` |
| Shell e workspace | `src/editor/shell/`, `src/editor/workspace/` |
| Mensagens | `src/i18n/locales/en.json`, `src/i18n/locales/pt-BR.json` |
| Geradores | `tools/gen/generate.ts`, `tools/map/generate.ts`, `tools/inventory/write.ts` |
| Detectores | `tools/runner/model/` (`npx vitest run --config tools/runner/model/vitest.config.ts`) |
| Catálogo de mutantes | `tools/runner/mutants.ts` (`node tools/runner/mutants-run.ts`) |

## 8. Navegador
- **Specs:** `npx playwright test <arquivos>`, com `E2E_WORKERS=3`. O `playwright.config.ts` monta o build e sobe o servidor sozinho; liste todos os arquivos de uma rodada num único comando e nunca rode duas execuções ao mesmo tempo (cada uma reconstrói `dist/`). Use a fixture `tests/support/test.ts`, que já confere a guarda de tela, o feed de incidentes e o console.
- **Proibido** no laço do lote: `npm test`, `npm run e2e` e `npx playwright test` sem arquivos (a suíte inteira passa de uma hora).
- **Duas condições de tela:** padrão, e Windows real com `E2E_SCROLLBARS=shown E2E_SCALE=1.25`. `tests/e2e/espaco.spec.ts` cobre 1280×720 em pt-BR e 1440×900 em inglês.
- **Usar como o usuário:** `npm run build:e2e`, `PORT=5320 npm run preview` em segundo plano e `npm run ui -- <fluxo>` (fluxos em `tools/ui/flows.ts`), ou Playwright headless com `chromium.launch({ channel: 'chrome', headless: true })`. Não use o painel de navegador do app: oculto, ele para de desenhar quadros. Um editor por página.
- **Ponto no canvas:** posição do iframe mais a posição do nó vezes `iframe.currentCSSZoom`.

## 9. Ambiente e armadilhas
- **Sistema:** Windows com PowerShell. Rode processos pesados com prioridade baixa (`Start-Process` e `PriorityClass = 'BelowNormal'`).
- **Finais de linha:** convivem arquivos CRLF e LF. Ao editar por script, preserve o final de linha de cada arquivo.
- **Ids do manifesto:** nunca se escrevem à mão (regra de lint `builder/no-manifest-id`). Leia do manifesto.
- **Mensagem nova:** entra em `en.json` **e** em `pt-BR.json`. Depois rode `node tools/gen/generate.ts`.
- **Código de `src/` mudado:** rode `node tools/inventory/write.ts` antes dos detectores (o grupo `inventory` exige o arquivo fresco).
- **Repositório:** `origin` é `github.com/designathan1988/app-pagebuilder-v5`; commit e push a cada lote. Ficam fora do repositório `PROMPT.md`, `claude-tarefa.md`, `deepseek-tarefa.md`, `deepseek.ps1` e `.claude/`.
