# Mecanismos

Os mecanismos de verificação construídos a partir de `auditoria/investigacao/relatorio.md` (capacidades C1 a C8, plano da seção 4). Cada um entra aqui antes de qualquer arquivo dele ser criado, com o caminho de cada arquivo, a capacidade, as falhas de aceitação que ele precisa acusar e, ao final, o tempo medido.

## MEC-01 — modelo da store e do histórico
- **Capacidade:** C2 (acusação automática de quebra) e C7 (undo e redo precisos).
- **Ponto de partida:** `auditoria/investigacao/poc/c7-historico/modelo.poc.ts`.
- **Arquivos:**
  - `tools/runner/model/harness.ts` — o sistema real (a store do editor sobre a fixture, com relógio manual e ids sequenciais), o modelo da pilha de entradas que a pessoa espera, as conferências depois de cada passo e os passos comuns (desfazer, refazer, esperar, digitar, gesto, toque, troca de contexto, carga de projeto);
  - `tools/runner/model/history.test.ts` — histórico e seleção;
  - `tools/runner/model/style.test.ts` — estilo, passo de campo, rajadas e contexto de edição;
  - `tools/runner/model/structure.test.ts` — estrutura (inserir, apagar, duplicar, mover) e integridade do documento (`validateDocument`, `applyPatches`);
  - `tools/runner/model/text.test.ts` — texto (`text.set`) e digitação pendente;
  - `tools/runner/model/pages.test.ts` — páginas e carga de projeto (`project.open`, `project.newBlankPage`);
  - `tools/runner/model/vitest.config.ts` — a configuração das corridas do modelo, com o plugin do catálogo de mutantes.
- **Regras conferidas depois de cada passo:** entrada nova só com documento mudado; fusão só quando o manifesto permite (`history.coalesce`, janela da constante, sem comando no meio); publicação sem mudança de documento não mexe no histórico; desfazer devolve documento e seleção de antes, refazer os de depois; cada `DocumentChange` leva `before` a `after` pelos próprios patches (a carga de projeto troca `pages` inteiro, como `src/core/store/store.ts:91` `// transaction's patches, its inverses on undo, a cancelled gesture's inverses; a loaded project replaces the pages).` declara); a digitação pendente é gravada antes de qualquer comando de fora do campo e no contexto em que começou; o gesto não mexe no histórico enquanto aberto; abrir outro projeto esvazia o histórico; no fim, desfazer tudo e refazer tudo.
- **Falhas de aceitação que precisa acusar:** os mutantes M01 a M18 da prova; M19 a M29 do catálogo (MEC-02); M15 (abrir outro projeto mantém o histórico), que a prova não acusava.
- **Tempo medido (2026-10-08, esta máquina):** os cinco grupos juntos, 4,6 s de relógio com a partida do Vitest (`node node_modules/vitest/vitest.mjs run --config tools/runner/model/vitest.config.ts`); 150 sequências por grupo, de 3.558 a 3.928 passos por grupo, 373 a 687 ms de teste por grupo. Abaixo da meta de 1 minuto por área.
- **Acusou na linha de base:** DEF-0508, pela invariante do MEC-03 que o modelo exercita.

## MEC-02 — catálogo de mutantes
- **Capacidade:** C2.
- **Ponto de partida:** `auditoria/investigacao/poc/c7-historico/mutantes.ts`, `rodar-mutantes.mjs` e `auditoria/investigacao/poc/vitest.poc.config.ts`.
- **Arquivos:**
  - `tools/runner/mutants.ts` — o catálogo (cada mutante troca um trecho único de um arquivo na carga do módulo, declara a regra que quebra, o detector que o alcança e, quando sobrevive por ser equivalente, o motivo) e o plugin do Vite que faz a troca, como `tools/runner/tooth-plugin.ts` faz com uma funcionalidade inteira;
  - `tools/runner/mutants-run.ts` — a corrida: a linha de base sem mutante, depois um processo do Vitest por mutante, quatro em paralelo e com prioridade baixa; mede a taxa de acusação e termina com falha quando a linha de base falha, quando um mutante sobrevive sem motivo registrado ou quando a troca não carregou. Resumo de no máximo 30 linhas na saída, completo em `.cache/mutants/summary.json`.
- **Falhas de aceitação que precisa acusar:** um mutante do catálogo que sobrevive sem motivo; um mutante cujo trecho deixou de existir no arquivo (a troca não carrega).
- **Tempo medido (2026-10-08):** 29 mutantes e a linha de base em 42,4 s (linha de base 6,8 s; o processo mais lento, 5,6 s). Abaixo da meta de 10 minutos para o conjunto.
- **Taxa de acusação ao fechar a etapa 1:** 27 acusados de 27 não equivalentes (100%); 2 equivalentes com motivo no catálogo (M19, M25); nenhum sobrevivente sem motivo. M28 e M29 entraram com o DEF-0508.

## MEC-03 — invariantes do histórico em desenvolvimento e prova de remoção em produção
- **Capacidade:** C2 (opção D) e a prova P5.
- **Ponto de partida:** `auditoria/investigacao/poc/c-producao/construir.mjs`.
- **Arquivos:**
  - `src/core/history/invariants.ts` (novo) — as regras do histórico a cada publicação: entrada nova só com documento mudado; pilha de refazer vazia depois de entrada nova; `DocumentChange` coerente;
  - `src/core/store/store.ts` — a opção `invariants` da store do núcleo, chamada em `publish` antes de o estado mudar;
  - `src/editor/store.ts` — liga a opção só quando `import.meta.env.DEV` (o núcleo também roda em Node puro pelas ferramentas, onde `import.meta.env` não existe);
  - `vite.config.ts` — a verificação permanente: todo build (o de produção e o e2e) falha quando um pedaço carrega a marca de `src/core/history/invariants.ts`, como o plugin `no-test-port` já faz com a porta de teste (`vite.config.ts:49` `const TEST_ONLY_NAMES = ['__builderTestPort', '__builderTestBoot'];`);
  - `tools/runner/production-probe.ts` (novo) — a prova de que a verificação vê alguma coisa: constrói o app em memória com `import.meta.env.DEV` falso e verdadeiro e procura a marca em cada saída: ausente no primeiro, presente no segundo.
- **Falhas de aceitação que precisa acusar:** a regra ligada sem a condição de desenvolvimento (a marca aparece no build de produção); uma publicação que cresce o histórico sem mudar o documento; uma entrada nova que não esvazia o refazer.
- **Tempo medido (2026-10-08):** `node tools/runner/production-probe.ts` em 1,1 s — DEV falso: marca ausente (471 ms); DEV verdadeiro: marca presente (369 ms). A invariante roda dentro de cada publicação em desenvolvimento e teste; os modelos com ela ligada ficam nos mesmos 4,6 s.
- **Ajuste registrado:** a primeira forma da regra ("entrada nova só com documento mudado na mesma publicação") acusava o commit de todo gesto, que grava a entrada numa publicação sem mudança de documento; a regra passou a conferir a própria entrada (os inversos desfazem algo e os patches refazem exatamente o que os inversos desfazem).

## MEC-04 — seletor de impacto para os detectores
- **Capacidade:** C2 (opção E).
- **Arquivos:**
  - `tools/impact/detectors.ts` (novo) — de cada arquivo mudado, os modelos de `tools/runner/model/` e os mutantes de `tools/runner/mutants.ts` que o alcançam: o mutante pelo arquivo que ele troca; o modelo pelo grafo de imports estáticos que parte dele (um arquivo que nenhum modelo importa não escolhe modelo); um arquivo de `tools/runner/model/` ou `tools/runner/mutants.ts` escolhe todos;
  - `tools/impact/select.ts` — a escolha dos testes passa a incluir os detectores;
  - `tools/impact/run.ts` — roda os modelos e os mutantes escolhidos.
- **Falhas de aceitação que precisa acusar:** uma mudança em `src/core/history/history.ts` que não escolhe o modelo do histórico nem os mutantes M01 a M05; uma mudança em `tools/runner/mutants.ts` que não escolhe todos os mutantes.
- **Tempo medido (2026-10-08):** a escolha de quatro mudanças em 52 ms: `src/core/history/history.ts` escolhe os cinco grupos e M01 a M05 (hoje também M28); `tools/runner/mutants.ts` escolhe os cinco grupos e todos os mutantes; `src/editor/shell/preview.tsx` e `README.md` não escolhem nenhum.

## MEC-05 — contratos de campo e porta css pelo lexer
- **Capacidade:** C5 (controlador global de entradas e saídas), opções A, B e C do relatório.
- **Ponto de partida:** `auditoria/investigacao/poc/c5-campos/ida-e-volta.poc.ts`.
- **Arquivos:**
  - `tools/runner/css-lexer-port.ts` (novo) — a porta `css` de teste: `supports` responde pelo lexer do css-tree que `src/manifest/css.ts` monta (`matchImplemented`), no lugar de `anyCss`, para que as verificações sem navegador recusem o que o navegador recusaria; `var()` é aceito como o navegador aceita na leitura;
  - `tools/runner/contracts.ts` (novo) — o contrato de cada propriedade e composto do manifesto: o codec declarado e se está registrado, as unidades e palavras-chave oferecidas, as portas que o escrevem, se `style.set` o alcança, e os fatores de passo do manifesto. Fica em `tools/` e não em `src/core/style/contracts.ts` (o caminho do relatório) porque nenhum código do app o lê: só os detectores;
  - `tools/runner/model/fields.test.ts` (novo) — o grupo `fields` do modelo: as propriedades sobre todos os contratos, com a porta do lexer.
- **Propriedades conferidas:** todo longhand ou propriedade que uma porta de `style.set` ou de campo escreve tem codec registrado; ida e volta (o texto gravado, lido de novo, grava o mesmo texto); gramática (o texto gravado é aceito pelo lexer); número preservado com quatro casas onde o codec lê um comprimento (DCS-015); aceitação (um comprimento numa unidade oferecida, aceito pelo lexer, não é recusado); a vírgula decimal lida como ponto; nenhum `-0` gravado; o passo de campo move pelo passo e pelos fatores do manifesto (Shift, Alt, página); toda chave de recusa dos comandos de estilo e de campo existe em `pt-BR.json` e em `en.json`.
- **Falhas de aceitação que precisa acusar (mutantes do catálogo):** `writeNumber` deixando passar `-0`; a vírgula decimal deixando de ser lida como ponto; uma unidade oferecida que o codec não lê; um passo de campo com Shift multiplicando por 100; DEF-0509 (um codec declarado e não registrado).
- **Fora deste mecanismo, pendentes:** a roda de rolagem somando o passo antes de enviar a intenção, o Esc do campo gravando o rascunho e a volta da store sobrescrevendo um rascunho pendente só aparecem no componente `NumberField` (`src/editor/shell/field.tsx`); ficam para um contrato de componente em happy-dom.
- **Tempo medido:** a medir.

## MEC-06 — mapa executável: tabela da máquina de gestos
- **Capacidade:** C3 (mapa executável de comportamento), opção A; a parte das máquinas de modos (C6) entra no MEC-08.
- **Ponto de partida:** `auditoria/investigacao/poc/c3-mapa/tabela.poc.ts`.
- **Arquivos:**
  - `tools/map/gesture-table.ts` (novo) — a tabela de `step` (`src/editor/input/pointer/machine.ts`) executada em todas as combinações de fase e evento, com o limiar de arraste do manifesto, e a lista declarada das combinações que a máquina ignora de propósito, cada uma com o motivo;
  - `tools/map/behavior.ts` (novo) — os textos dos dois arquivos do mapa, os mesmos para o gerador e para o detector (chaves em ordem fixa, sem data, sem caminho absoluto);
  - `tools/map/generate.ts` (novo) — grava `manifest/generated/behavior.json` (a tabela) e `manifest/generated/behavior.md` (o diagrama Mermaid); o diff dos dois mostra o que mudou;
  - `tools/runner/model/machine.test.ts` (novo) — o grupo `machine` do modelo.
- **Falhas de aceitação que precisa acusar:** uma transição nova em `step` sem a tabela gravada atualizada; uma combinação ignorada em silêncio sem motivo declarado; DEF-0510 (o segundo `down` do mesmo ponteiro com o gesto aberto, ignorado, quando a DCS-013 manda cancelar e começar de novo).
- **Tempo medido:** a medir.

## MEC-07 — escopo de vida: o que fica agendado depois de parar
- **Capacidade:** C6 (controlador global de eventos e estados), opções B e C do relatório: ouvintes, timers, quadros e observers que sobrevivem ao fim de quem os abriu.
- **Arquivos:**
  - `tools/runner/model/lifetime.test.ts` (novo) — o grupo `lifetime` do modelo: cada rotina que agenda quadros ou timers, parada no meio, não deixa nada agendado e não roda o que ainda esperava.
- **Falhas de aceitação que precisa acusar:** DEF-0001 (o laço de quadros do boot de teste desenhado sem como parar); um quadro reagendado depois de a rotina ser parada.
- **Tempo medido:** a medir.

## MEC-08 — inventário gerado e dono de todo elemento interativo
- **Capacidade:** C1 (inventário dinâmico), opções A, B e F do relatório.
- **Ponto de partida:** `auditoria/investigacao/poc/c1-inventario/varrer.mjs`.
- **Arquivos:**
  - `tools/inventory/ui-scan.ts` (novo) — a varredura dos elementos JSX interativos de `src/` com a API do TypeScript: cada um é porta (`data-door`), controle local declarado (`data-local`), parte de uma porta, recebe atributos espalhados, envolve uma porta, ou não tem dono;
  - `tools/inventory/inventory-file.ts` (novo) — o texto do inventário, o mesmo para o gravador e para o detector;
  - `tools/inventory/write.ts` (novo) — grava `manifest/generated/inventory.json` (chaves em ordem, sem data, sem caminho absoluto): funcionalidades, comandos e portas (de `tools/inventory/generate.ts`), campos (os contratos do MEC-05), as oito partes do estado da store e os elementos interativos com a classe de cada um; o detector `inventory` falha quando o arquivo gravado está atrás do código;
  - `tools/lint/interactive-allowed.ts` (novo) — a lista inicial dos elementos interativos sem porta nem controle local, cada um com a categoria (`structural`, `local` ou `door-part`, a parte de uma porta desenhada fora do elemento com `data-door`: o popover num portal, o form do valor digitado, o JSX montado numa constante) e o motivo, como `tests/support/screen-guard-allowed.ts` faz; 81 entradas: 32 estruturais, 32 locais, 17 partes de porta;
  - `tools/lint/plugin.ts` — a regra `builder/interactive-owner`: todo elemento JSX intrínseco interativo leva `data-door`, `data-local`, atributos espalhados, está dentro de uma porta, envolve uma porta, ou está na lista;
  - `eslint.config.js` — liga a regra em `src/**/*.tsx`;
  - `tools/runner/model/inventory.test.ts` (novo) — o grupo `inventory` do modelo: o inventário gravado é o que o código dá, nenhum elemento interativo fica sem dono e nenhuma exceção da lista sobra;
  - `tools/runner/mutants.ts` — o grupo `inventory` entre os detectores, `mutatedSource` (o texto de um arquivo lido do disco com o trecho do mutante trocado, porque o varredor não passa pelo Vite) e o mutante M43 (o botão da cabeça do quadro lateral sem `data-door`);
  - `tools/impact/detectors.ts` — o grupo `inventory` alcança todo arquivo de `src/` fora dos testes e os JSON de `manifest/`, que ele lê do disco e não importa.
- **Falhas de aceitação que precisa acusar:** um `<button onClick>` novo sem `data-door` nem `data-local` num componente do inspector (o lint); um campo novo de `manifest/properties.json` sem codec (o contrato do MEC-05); o inventário gravado atrás do código.
- **Tempo medido:** grupo `inventory` 5,5 s (varredura de `src/`, inventário e lista; M43 acusado: `src/editor/canvas/side-frame.tsx:75 <button>` sem dono); a regra de lint entra na rodada de `npm run lint` sem custo separado medido.

## MEC-09 — todo ouvinte, intervalo e observer com o seu fechamento declarado
- **Capacidade:** C6 (controlador global de eventos e estados), opção F do relatório, com a forma ajustada à medição do código: a regra não exige o `{ signal }` de um escopo novo, exige que cada registro declare como termina.
- **Medição que decidiu a forma** (script `.cache/dbg/escopo.ts`, fora do repositório; 2026-10-08): dos 78 `addEventListener` de `src/` fora dos testes e do motion runtime, 64 têm `removeEventListener` com o mesmo tipo e o mesmo tratador dentro da mesma função que registra (o efeito e o seu retorno), 2 usam `once` ou `signal`, 11 ouvem um objeto criado na própria função (o soquete de `src/editor/assistant/client.ts`, o `input` de arquivo de `src/editor/doors/door.tsx`) e 1 par instala os tratadores de erro da página para a vida dela (`src/editor/errors.ts`); os 13 `ResizeObserver` e os 3 `MutationObserver` desconectam na mesma função; o único `setInterval` é limpo por `clearTimeout` em outro arquivo (`src/editor/input/pointer/panels.ts`), o que a especificação HTML permite (os dois limpam a mesma lista de timers ativos). Migrar os 78 pontos para um `scope.ts` não mudaria nenhum comportamento; a regra acusa o que falta.
- **Arquivos:**
  - `tools/lint/plugin.ts` — a regra `builder/listener-scope`: um `addEventListener` passa quando leva `signal` ou `once` nas opções, quando a mesma função que registra chama `removeEventListener` com o mesmo tipo e o mesmo tratador, ou quando o alvo é criado na própria função; um `setInterval` e um `new ResizeObserver`, `MutationObserver` ou `IntersectionObserver` passam quando o identificador fica guardado e a mesma função ou o mesmo arquivo o fecha (`clearInterval`, `clearTimeout`, `disconnect`); o resto só passa listado com motivo;
  - `tools/lint/listener-allowed.ts` (novo) — as exceções, cada uma com o motivo;
  - `eslint.config.js` — liga a regra em `src/**/*.{ts,tsx}`, fora dos testes, do motion runtime (script da página publicada, fora do dono único por decisão já registrada no lint) e do código de terceiros;
  - `tools/runner/model/lint.test.ts` (novo) — o grupo `lint` dos detectores: passa o arquivo do mutante sob execução, com o trecho trocado, pelo ESLint do projeto (`ESLint#lintText` com `filePath`, ESLint 10.11.0) e falha quando o texto mutado recebe um erro que o original não recebe;
  - `tools/runner/mutants.ts` — o grupo `lint` entre os detectores e os mutantes das falhas de aceitação;
  - `tools/impact/detectors.ts` — o grupo `lint` alcança os arquivos de `src/`, `eslint.config.js` e `tools/lint/`, que o ESLint lê do disco.
- **Falhas de aceitação que precisa acusar:** um `addEventListener` sem remoção num efeito de componente; um `ResizeObserver` que não desconecta ao fechar o menu; um `setInterval` sem fechamento.
- **Achados ao ligar a regra:** 3, nenhum vazamento: os dois tratadores de erro de `src/editor/errors.ts`, instalados uma vez para a vida da página, e o `setInterval` da repetição de `src/editor/input/pointer/events.ts`, fechado por `stopRepeating` (`src/editor/input/pointer/panels.ts:32` `window.clearInterval(ps.repeating.timer);`) na soltura, no cancelamento e na desmontagem do dono do ponteiro (`src/editor/input/pointer.ts:220` `p.onCancel();`); os três estão em `tools/lint/listener-allowed.ts` com o motivo.
- **Mutantes:** M44 (a remoção do ouvinte `focusin` de `src/editor/shell/field-origin.tsx` apagada) e M45 (o `disconnect` do `ResizeObserver` de `src/editor/doors/menu.tsx` apagado), os dois acusados pelo grupo `lint`.
- **Tempo medido:** grupo `lint` 4,5 s sem mutante (dois arquivos pelo ESLint do projeto); a regra entra na rodada de `npm run lint`.

## MEC-10 — máquina de modos de interação, conferida a cada comando dentro de um gesto
- **Capacidade:** C6 (controlador global de eventos e estados), opção A do relatório, com a máquina derivada do estado que já existe em vez de uma segunda fonte: o gesto do dono do ponteiro e a sessão do seletor de cor ficam no estado compartilhado do ponteiro (`src/editor/input/pointer/common.ts`, `sharedOf`), a digitação no registro de `src/editor/input/pending.ts`, e os menus, diálogos, seletores, renomeação, edição de texto, prévia e confirmação na store; uma máquina que guardasse os modos de novo seria uma cópia de estado que G6 proíbe.
- **Leitura do código que decidiu o ponto:** com um gesto do ponteiro aberto, o mapa de teclas troca o contexto focado pelo do gesto (`src/editor/input/keymap.ts:457`, o contexto `drag`), então nenhum atalho global chega; o único caminho por onde um comando de fora roda dentro do gesto é a store do editor, que despacha pelo gesto todo comando que não muda o documento (`src/editor/store.ts:240` `result = inGesture(id, () => gesture.dispatch(id, args));`): o resultado de uma leitura de arquivo, o assistente, um timer.
- **Arquivos:**
  - `src/editor/input/modes.ts` (novo) — a união dos modos, `modesOf` (os modos de uma store agora) e a tabela `REFUSED_WHILE` (os modos que não abrem enquanto outro está ativo), com `modeBreaches` (as entradas que a tabela recusa entre dois momentos);
  - `src/editor/input/pointer/shared.ts` (novo) — o estado do ponteiro que dura além de um gesto (`PointerShared`, `sharedOf`), saído de `src/editor/input/pointer/common.ts` sem mudar nada: `modesOf` o lê, e a store do editor importa `modes.ts`; importado de `common.ts`, ele trazia `src/editor/input/pointer/press.ts`, que lê `MODEL_RULES` da store do editor no carregamento, um ciclo que deixava `MODEL_RULES` indefinido (medido no primeiro run do grupo `modes`: `TypeError: Cannot read properties of undefined (reading 'valuePredicates')`);
  - `src/editor/input/pointer/common.ts` — reexporta `sharedOf` e `PointerShared` do módulo novo, e os importadores continuam iguais;
  - `src/editor/store.ts` — a store do editor confere a tabela em todo comando que roda dentro de um gesto aberto: em desenvolvimento e nos testes lança, fora deles vai ao feed de incidentes (`src/core/incidents.ts`);
  - `tools/runner/model/modes.test.ts` (novo) — o grupo `modes` dos detectores: com um gesto do ponteiro aberto, cada atalho do manifesto passa pelo mapa de teclas real (`installKeymap`) e nenhum modo recusado abre; o mesmo em sequências aleatórias de atalhos com o gesto aberto e fechado entre elas;
  - `tools/runner/mutants.ts` — o grupo `modes` e o mutante da falha de aceitação;
  - `tools/map/behavior.ts` — a tabela dos modos entra no mapa gerado (`manifest/generated/behavior.json` e `.md`).
- **Falhas de aceitação que precisa acusar:** um menu que abre durante um arraste (o mapa de teclas que deixa os atalhos globais chegarem com o gesto aberto); um comando de fora que abre uma camada dentro do gesto.
- **O que a primeira rodada mostrou:** as teclas de um gesto despacham pelo objeto do próprio gesto (`src/editor/store.ts:221` `dispatch: (id, args) => inGesture(id, () => gesture.dispatch(id, args)),`), não pelo `dispatch` da store; a conferência ficou nos dois caminhos por uma função só, `inGesture`. Com o mapa de teclas como está, nenhum dos 69 atalhos do manifesto abre um modo recusado nem lança com o gesto aberto; com o M46 (os atalhos globais chegando durante o gesto) a tabela acusa `Ctrl+K` e `Ctrl+Shift+K` (barra de comandos), `Ctrl+Enter` e `Ctrl+P` (prévia), e quatro atalhos lançam porque o comando deles grava uma transação por despacho e não roda dentro de um gesto.
- **Mutante:** M46 acusado.
- **Tempo medido:** grupo `modes` 3,5 s (69 atalhos, mais 40 sequências aleatórias de até 25 ações); catálogo completo com M43 a M46: 46 mutantes, 43 acusados, 3 equivalentes com motivo, 100,0% dos não equivalentes, 67,1 s.
- **Registro da auditoria em aberto:** `modesOf` lê campos da interface direto (`ui.commandBar`, `ui.dialog`, `ui.colorPicker`, `ui.assetPicker`, `ui.linkPicker`, `ui.componentPrompt`, `ui.rename`, `ui.textEdit`, `ui.preview`, `state.confirmation`) e o menu de contexto por `openContextMenu`; esses leitores ainda não têm marca `[lê: …]` nos fluxos que passam por `inGesture`, e o verificador não os acusa.
