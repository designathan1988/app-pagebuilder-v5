# Builder: instruções do projeto

Page builder com editor visual. O canvas é renderizado em iframe e há breakpoints, estados, classes e quadros-chave. A interface tem dois idiomas: pt-BR e inglês.

Este arquivo contém **requisitos e regras de trabalho**. Ele não descreve o estado atual do código. O que está verificado consta em `auditoria/` e só vale com `node tools/audit/check.mjs` sem pendências.

## 0. Memória do trabalho (obrigatória)
O trabalho tem memória em disco, e ela é a única fonte de retomada. A memória da conversa não conta: uma compactação de contexto, uma sessão nova ou uma retomada depois de horas não a preservam, e o que não estiver gravado perdeu-se.

**Onde ela vive:**
- `auditoria/progresso.md` — onde o trabalho está agora e qual é o próximo passo.
- `auditoria/decisoes.md` — as decisões tomadas, que não se rediscutem.
- `auditoria/defeitos.md` e `auditoria/otimizacoes.md` — o que foi aberto e o que foi corrigido.
- `auditoria/plano-execucao.md` — o plano das fases.
- `auditoria/inventario-arquivos.md`, `auditoria/estado.md`, `auditoria/entradas.md`, `auditoria/matriz.md` — o que já foi levantado.

**Regras:**
- **Antes de qualquer trabalho:** leia `auditoria/progresso.md` por inteiro e comece pelo próximo passo que ele registra.
- **Depois de cada passo:** grave o avanço em `auditoria/progresso.md` antes de começar o seguinte.
- **Depois de uma compactação de contexto ou ao retomar em outra sessão:** releia do disco os arquivos acima. Nunca continue por memória da conversa nem por resumo.
- **Nunca encerre um passo sem gravar o próximo:** quem retomar só sabe o que estiver em disco.
- **Ao concluir uma fase:** atualize o estado da fase em `auditoria/progresso.md` na mesma hora.

## 1. Escopo
- Trabalhe apenas no código da aplicação:
  - editor e canvas;
  - blocos e componentes;
  - estado e renderização;
  - interações e estilos;
  - serialização e i18n;
  - performance.
- **Fora de escopo:** publicação, deploy, banco de dados, infraestrutura, hospedagem e CI. Não altere, não comente, não sugira.
- Persistência e backend são fronteira fixa. Rastreie até a chamada da interface existente e não além.

## 2. Método obrigatório: vale para TODA alteração, por menor que seja
1. **Antes de alterar:**
   - leia por inteiro os arquivos envolvidos;
   - identifique em `auditoria/estado.md` os itens de estado que a alteração toca.
2. **Alterar:** corrija no ponto único que garante a regra (seção 4), nunca em cada componente que manifesta o defeito.
3. **Depois de alterar:**
   - re-rastreie todas as entradas e todos os pares de `auditoria/matriz.md` que escrevem ou leem os itens tocados;
   - atualize `fluxos/`, `interacoes/` e `defeitos.md`.

   Estado ou entrada nova entra nos inventários e é rastreado, com todos os seus pares.
4. **Fechar:** `npm run typecheck`, `npm run lint` e `node tools/audit/check.mjs` devem terminar com zero erros e zero pendências.
5. **Comportamento:** toda conclusão sobre comportamento vem de rastreamento registrado com citação no formato:

   `` `caminho/arquivo.ts:LINHA` `trecho exato daquela linha` ``

   Nunca deduza o comportamento pelo nome de uma função. Abra a função.
6. **Gravação em disco:** grave à medida que avança. Antes de retomar, releia do disco. Nunca escreva de memória.

## 3. Conduta
- **Linguagem de conclusão:** proibido escrever "funciona", "corrigido", "garantido", "100%", "sem erros" ou equivalente sem citar a saída de `node tools/audit/check.mjs` sem pendências.
- **Palavras proibidas em `auditoria/`:** "etc.", "e assim por diante", "similar", "mesmo padrão", "análogo", "presumivelmente", "provavelmente", "deve funcionar", "aparentemente".
- **Proibido silenciar erros:**
  - `@ts-ignore` e `eslint-disable`;
  - `any` para calar o tipo;
  - try/catch vazio;
  - fallback que esconde falha;
  - remover funcionalidade.
- **Bibliotecas externas:** consulte a documentação oficial da versão instalada com WebFetch, citando nome e versão. Ler `node_modules` complementa, não substitui. Não confie na memória.
- **Sem testes:** não rode a suíte de testes e não crie testes. O navegador serve apenas para medir valores que só ele calcula (seção 8).
- **Decisão de produto:** registre em `auditoria/decisoes.md` a opção que preserva o comportamento que o código já oferece e continue.
- **Relate fatos:** sem desculpas, justificativas ou ressalvas.
- **Status:** nunca escreva neste arquivo que algo está resolvido. Status fica em `auditoria/`.

## 4. Regras do editor
Cada regra tem um ponto garantidor e lista o que o rastreamento precisa provar. Os caminhos de arquivo devem ser confirmados no código. Se algum estiver errado, corrija a seção 6.

### G1. Toda edição é gravada no contexto em que foi feita
O contexto inclui os elementos, o breakpoint, o estado, a classe-alvo e o quadro-chave.
- **Ponto garantidor:**
  - `dispatch` da store do núcleo (`src/core/store/store.ts`), que aceita um `EditContext`;
  - `editContextOf` (`src/editor/store.ts`), que o captura na primeira digitação;
  - o rascunho guardado leva o breakpoint (`src/editor/persistence/drafts.ts`).
- **Provar:** toda gravação usa o contexto capturado na primeira digitação, inclusive quando breakpoint, estado, classe, quadro-chave ou seleção mudam com a digitação pendente, e na restauração de rascunho.

### G2. Digitação nunca some
- **Ponto garantidor:** o registro único `src/editor/input/pending.ts`, aplicado em dois pontos:
  - na store do editor (`gestureSafe` em `src/editor/store.ts`), em `dispatch`, `gesture`, `sequence` e `commandGroup`;
  - no início de cada toque (`src/editor/input/pointer/events.ts`).
- **Provar:** com rascunho pendente, o registro grava antes, no contexto da digitação, quando:
  - qualquer entrada muda a seleção ou a camada;
  - um painel fecha;
  - um toque começa;
  - roda um comando que altera o documento ou que vem de fora do campo.
- **Comandos do próprio campo:** são lidos do manifesto (partes, arraste do rótulo, teclas do contexto do campo) e rodam no contexto da digitação.
- **Limite do campo:** o campo inclui a linha dele e as camadas ligadas por `aria-controls` (menu de valores, sugestões). Ações dentro do campo não forçam gravação.
- **Exceção única:** o Esc do painel rápido descarta o rascunho por especificação.
- **Manutenção:** nunca acrescente "lembre de gravar o campo" num caminho novo. Corrija o registro.

### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado
- **Ponto garantidor:** o tratador do comando. Cada porta (botão, tecla, roda, arraste) envia só a intenção: o texto do campo, mesmo vazio, e a direção. Exemplos: `startOf` em `src/editor/inspector/number-field.ts` e `Layout.computed` em `src/core/ports/layout.ts`.
- **Provar:** os rastreamentos de todas as portas de cada comando convergem no mesmo tratador, com a mesma intenção. Porta que decide por conta própria é defeito.

### G4. O resultado de uma ação fica visível
- **Requisito:** nada do editor cobre o canvas no ponto onde a ação acontece. A barra lateral ocupa a própria coluna em qualquer janela. Numa janela estreita, a primeira visita abre com ela fechada (`src/editor/workspace/narrow.ts`).
- **Provar:** por medição (seção 8), o elemento sob o ponto da ação é o canvas.

### G5. Painéis e barras cabem; nenhum controle fica fora de alcance
- **Famílias de defeito a eliminar:**
  - `cut` (cortado);
  - `wrapped` (quebrado em linhas indevidas);
  - `off-window` (fora da janela);
  - `covered` (coberto);
  - `english` (texto em inglês na interface pt-BR);
  - `sideways` (rolagem lateral).
- **Exceções:** apenas em `tests/support/screen-guard-allowed.ts`, com motivo.
- **Técnicas obrigatórias:**
  - medir fora de vista numa caixa de tamanho zero que recorta (`overflow: hidden; contain: strict`), porque uma caixa invisível ainda alarga a rolagem;
  - todo item que cresce declara como encolhe (`min-width: 0`);
  - medir contra o espaço do próprio elemento, nunca contra uma trilha escolhida por posição;
  - a trilha da barra de status recolhe os níveis do meio (`src/editor/shell/crumb-fold.ts`).
- **Provar:** por medição (seção 8), nas duas configurações de tela, com documento profundo e nomes longos.

### G6. Todas as vistas mostram a mesma seleção
- **Ponto garantidor:** a store é a fonte única.
- **Provar:**
  - toda escrita de seleção passa pela store;
  - canvas e Camadas apenas derivam da store;
  - nenhuma cópia local de seleção existe em `estado.md`.

### G7. O canvas é o documento
- **Requisito:** o render incremental é igual a um render do zero.
- **Provar:** para cada tipo de mudança, o caminho incremental produz o mesmo DOM que o render do zero. A renderização do editor e a final também coincidem.

### Integridade do documento
- **Provar após toda escrita:**
  - esquema de cada bloco válido;
  - IDs únicos;
  - nenhum bloco órfão nem referência quebrada;
  - consistência pai/filho e regras de aninhamento;
  - pilha de undo/redo consistente;
  - serialização ida-e-volta idêntica.

## 5. Decisões do dono (só ele muda)
- **D-1:** as abas de breakpoint ficam coladas no topo da moldura.
- **DEC-70:** o rótulo da seleção fica sempre acima do elemento, encostado na moldura. O chip do painel rápido fica à direita do rótulo.
  - **Exceção (2026-10-07):** quando esse lugar cai sobre as abas de breakpoint (elemento no topo da página):
    - rótulo e chip seguem pela linha de cima da moldura até passar a última aba, enquanto couberem sobre o elemento;
    - num elemento estreito sob as abas, ficam logo abaixo dele.
  - **Onde vive:** `clearedLabel` em `src/editor/canvas/placement.ts`.
  - **Por quê:** descer para dentro do elemento cobria a alça de raio e punha o chip sob a alça leste; ficar sempre embaixo tirava de vista o rótulo de um elemento alto.

## 6. Mapa do código
Confirme na auditoria e corrija esta seção se algo estiver errado.

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
| Geradores | `tools/gen/generate.ts` |
| Verificador da auditoria | `tools/audit/check.mjs` (`node tools/audit/check.mjs`) |

## 7. Registros da auditoria (`auditoria/`)
| Arquivo | Conteúdo |
|---|---|
| `inventario-arquivos.md` | todo arquivo do repositório e seu propósito |
| `padroes.json` | padrões de busca de estado e de entradas |
| `requisitos.md` | toda funcionalidade da aplicação e o comportamento esperado |
| `estado.md` | inventário de estado |
| `entradas.md` | inventário de entradas |
| `fluxos/<id>.md` | rastreamento de cada entrada |
| `matriz.md` | escritores e leitores de cada item de estado |
| `interacoes/<estado>__<escritor>__<leitor>.md` | um registro por par |
| `medicoes/` | valores medidos no navegador e os scripts |
| `defeitos.md` | defeitos, abertos ou corrigidos |
| `otimizacoes.md` | otimizações, com medida de antes e depois |
| `decisoes.md` | decisões de produto tomadas |

**Interações:**
- Cada par (A escreve S, B lê S) é rastreado a partir de cada estado distinto que A pode deixar em S, cobrindo:
  - os estados finais e os intermediários;
  - B chegando com A em curso;
  - B depois da desmontagem de um componente que A usa.
- Leitores podem ser agrupados quando leem S pela mesma função; escritores, quando escrevem S pela mesma função, listando todos os estados distintos que os membros deixam. Cite a função.
- Trecho compartilhado por várias entradas (a partir da mesma chamada, com os mesmos argumentos) é rastreado uma vez em `fluxos/trechos/`.

## 8. Medição no navegador: só para valores que o navegador calcula
São eles: dimensão, posição, quebra de linha, rolagem, zoom do iframe, estilo calculado, elemento sob um ponto e ordem de foco. O rastreamento nunca presume esses valores. Ele os mede assim:

1. **Servidor:** sirva o build com `python -m http.server 5399 --bind 127.0.0.1 --directory dist`. O `dist` é o build e2e, com `window.__builderTestPort` só para leitura.
2. **Navegador:** use Playwright headless pela entrada padrão (`$script | node --input-type=module -`), com `chromium.launch({ channel: 'chrome', headless: true })`. Não use o painel de navegador do app: oculto, ele para de desenhar quadros.
3. **Boot:** responda `**/__builderTestBoot.json` com `{ project, commands, drawn }` e abra `/?test-boot`.
4. **Telas:** use 1280×720 em pt-BR e 1440×900 em inglês, com barras de rolagem visíveis (~15 px por painel) e escala 1.25.
5. **Ponto no canvas:** posição do iframe mais a posição do nó vezes `iframe.currentCSSZoom`.
6. **Um editor por página:** nunca abra um segundo editor na mesma página. O perfil guarda o que o primeiro salvou.
7. **Registro:** grave o valor e o script em `auditoria/medicoes/` e cite a medição no passo do fluxo.

## 9. Travas automáticas (`.claude/`, do dono)
Hooks em `.claude/settings.json` impõem as regras acima. Ninguém além do dono altera `.claude/`; comandos que tocam a pasta são bloqueados.
- **Leitura integral:** cada Read fica registrado com o hash do arquivo. Edição em código da aplicação só é liberada quando todo arquivo do escopo foi lido por inteiro na versão atual. Arquivo alterado depois (por comando ou gerador) volta a exigir leitura. Grep e buscas não contam; leitura em partes só conta quando as partes cobrem todas as linhas.
- **Registro antes da edição:** o arquivo editado precisa estar citado em `auditoria/defeitos.md` ou `auditoria/otimizacoes.md`.
- **Pesquisa:** cada pacote externo importado pelo arquivo precisa de um WebFetch da documentação oficial com o nome do pacote e a versão instalada (completa, major.minor ou major) na URL ou no prompt.
- **Registros:** escrita em `auditoria/` é recusada com palavra proibida; citação que não confere com o código é apontada na hora.
- **Encerramento:** cada resposta só termina com leitura integral, pesquisa completa, registros válidos e `node tools/audit/check.mjs`, `npm run typecheck` e `npm run lint` aprovados.
- **Escopo:** `git ls-files` menos `ignorar` de `.claude/vistoria.config.json` (a lista `ignorar` já deixa de fora os gerados, `vendor` e `.xlsx`). Read sem offset/limit só conta para arquivo de até 34.000 caracteres, com o prefixo de linha. Arquivo maior é lido com offset e limit explícitos, em partes de até 60.000 caracteres; se o Read recusar uma parte, use partes menores.
- **Livres das travas:** `auditoria/`, `tools/audit/` e `CLAUDE.md`. `PROMPT.md`, `node_modules/` e `dist/` não podem ser editados.

## 10. Ambiente e armadilhas
- **Sistema:** Windows com PowerShell. Rode processos pesados com prioridade baixa (`Start-Process` e `PriorityClass = 'BelowNormal'`).
- **Finais de linha:** convivem arquivos CRLF e LF. Ao editar por script, preserve o final de linha de cada arquivo.
- **Ids do manifesto:** nunca se escrevem à mão (regra de lint `builder/no-manifest-id`). Leia do manifesto.
- **Mensagem nova:** entra em `en.json` **e** em `pt-BR.json`. Depois rode `node tools/gen/generate.ts`.
- **Verificação estática:** `npm run typecheck` e `npm run lint` (o lint inclui CSS).
