# C3 — Mapa executável de comportamento (pesquisa)

Data da pesquisa: 2026-10-08. Todas as fontes abaixo foram abertas com WebFetch nesta data. Onde a ferramenta de leitura devolveu um resumo, o resumo é o que está registrado; o que a página não trazia está marcado como "não confirmado".

Convenção: "Fato documentado" vem da fonte citada. "Avaliação" é conclusão minha para este projeto (React 19.3.0, TypeScript 6.0.3, Vite 8.3.0, Vitest 5.0.1, Playwright 1.63.0, zod 4.6.5, fast-check 4.10.2, Windows).

---

## 1. Fontes consultadas

### 1.1 XState v5

| Fonte | URL | Versão ou data do conteúdo | O que sustenta |
|---|---|---|---|
| Doc de setup | https://stately.ai/docs/setup | xstate v5 (setup.extend desde 5.24.0) | Assinatura e tipos de setup() |
| Doc de actors | https://stately.ai/docs/actors | xstate v5 | createActor(actorLogic, options?), start, send, getSnapshot, subscribe |
| Doc de inspeção | https://stately.ai/docs/inspection | xstate v5 | Opção inspect e eventos de inspeção |
| Doc do Inspector | https://stately.ai/docs/inspector | @statelyai/inspect (versão não informada na página) | createBrowserInspector e opções |
| Doc de xstate/graph | https://stately.ai/docs/xstate-graph | xstate v5 (graph incluído no pacote principal) | getShortestPaths, getSimplePaths, getPathsFromEvents, createTestModel |
| Doc de testes | https://stately.ai/docs/testing | xstate v5 | Utilitários de teste baseado em modelo migraram para xstate/graph |
| Doc de transition actors | https://stately.ai/docs/transition-actors | xstate v5 | fromTransition(transition, estado inicial) |
| Registro npm xstate | https://registry.npmjs.org/xstate/latest | 5.33.2 (lido em 2026-10-08) | Tamanho, ausência de dependências, export "./graph" |
| Registro npm @xstate/graph | https://registry.npmjs.org/@xstate/graph/latest | 3.0.4 | peerDependency xstate ^5.19.4 |
| Registro npm @xstate/test | https://registry.npmjs.org/@xstate/test/latest | 0.5.1 | Pacote marcado como obsoleto |
| Registro npm @statelyai/inspect | https://registry.npmjs.org/@statelyai/inspect/latest | 0.7.2 | Dependências e peerDependency |
| Tipos de TestModel | https://unpkg.com/xstate@5.33.2/dist/declarations/src/graph/TestModel.d.ts | xstate 5.33.2 | Classe TestModel |
| Tipos de graph | https://unpkg.com/xstate@5.33.2/dist/declarations/src/graph/types.d.ts | xstate 5.33.2 | TraversalOptions, TestModelOptions, TestMeta, TestPath, TestParam |
| Tipos de inspeção | https://unpkg.com/xstate@5.33.2/dist/declarations/src/inspection.d.ts | xstate 5.33.2 | União InspectionEvent |
| Tamanho | https://bundlephobia.com/api/size?package=xstate@5.33.2 | xstate 5.33.2 | 46.874 bytes minificado, 14.559 bytes gzip, 0 dependências |
| Doc antiga do xstate/test | https://stately.ai/docs/xstate-test | @xstate/test@beta | Aviso de migração para o pacote graph |
| Artigo de Playwright com XState | https://dev.to/ryanroselloog/model-based-testing-using-playwright-and-xstate-what-ive-learnt-so-far-4180 | Publicado em 2022-07-15, @xstate/test sem versão fixada | Custos e armadilhas na prática |

### 1.2 Statecharts, SCXML

| Fonte | URL | Data | O que sustenta |
|---|---|---|---|
| Site statecharts.dev (início) | https://statecharts.dev/ | lido em 2026-10-08 | Statechart como máquina de estados ampliada; cita Harel 1987, "A visual formalism for complex systems" |
| statecharts.dev, o que é | https://statecharts.dev/what-is-a-statechart.html | lido em 2026-10-08 | Hierarquia, regiões ortogonais, ações de entrada e saída, guardas, histórico, transições automáticas e temporizadas |
| SCXML 1.0 | https://www.w3.org/TR/scxml/ | Recomendação W3C de 2015-09-01 (lidos os primeiros 100.000 de 227.948 caracteres) | Elementos, semântica de eventos, microstep e macrostep, relatório de implementações |
| Harel 1987 (PDF) | https://www.state-machine.com/doc/Harel87.pdf | Science of Computer Programming 8, 1987 | O PDF é uma digitalização sem camada de texto; o conteúdo não foi lido. As afirmações sobre o artigo vêm de statecharts.dev. |

### 1.3 TypeScript e análise de código

| Fonte | URL | Versão ou data | O que sustenta |
|---|---|---|---|
| Handbook, narrowing | https://www.typescriptlang.org/docs/handbook/2/narrowing.html | Handbook atual | Uniões discriminadas e verificação de exaustividade com never |
| Notas do TS 4.9 | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html | TypeScript 4.9 | Operador satisfies |
| typescript.d.ts | https://unpkg.com/typescript@6.0.3/lib/typescript.d.ts | typescript 6.0.3 (lido o intervalo a partir do caractere 500.000) | Assinaturas do LanguageService |
| Registro npm typescript | https://registry.npmjs.org/typescript/6.0.3 | 6.0.3 | 24.346.827 bytes descompactado; binários tsc e tsserver |
| Language Service API (wiki) | https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API | página de 2020 | LanguageServiceHost, document registry; a página não cobre 5.x nem 6.x |
| Anúncio do TypeScript 7.0 Beta | https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/ | 2026-04-21 | Sem API programática estável antes do 7.1 |
| ts-morph, findReferences | https://ts-morph.com/navigation/finding-references | versão não informada na página | findReferences, findReferencesAsNodes |
| ts-morph, navegação | https://ts-morph.com/navigation/ | versão não informada | A página não menciona call hierarchy |
| Registro npm ts-morph | https://registry.npmjs.org/ts-morph/latest | 28.0.0 | Dependência de @ts-morph/common ~0.29.0 |
| Registro npm @ts-morph/common | https://registry.npmjs.org/@ts-morph/common/latest | 0.29.0 | TypeScript 6.0.2 como devDependency e script de empacotamento do TypeScript |

### 1.4 Modelagem de ferramentas e modos em editores

| Fonte | URL | Versão ou data | O que sustenta |
|---|---|---|---|
| tldraw, Tools | https://tldraw.dev/sdk-features/tools | tldraw 5.5.2 (registro npm) | Statechart de ferramentas |
| tldraw, docs/tools | https://tldraw.dev/docs/tools | tldraw atual | StateNode, ferramenta customizada |
| tldraw, referência de StateNode | https://tldraw.dev/reference/editor/StateNode | @tldraw/editor atual | Membros de StateNode |
| tldraw, eventos | https://tldraw.dev/sdk-features/events | tldraw atual | Tipos e nomes de eventos, before-event e event |
| Registro npm tldraw | https://registry.npmjs.org/tldraw/latest | 5.5.2 | 15.244.188 bytes descompactado; peer de React ^18.2.0 ou ^19.2.1; licença em arquivo próprio |
| Excalidraw, ActionManager | https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/actions/manager.tsx | branch master em 2026-10-08 | Uma action, três portas |
| IMG.LY CE.SDK, edit modes | https://img.ly/docs/cesdk/js/concepts/edit-modes-1f5b6c | documentação atual | Modos de edição no estado do motor |
| Pesquisa por posts de engenharia | busca web | 2026-10-08 | Não localizei post de engenharia de Figma, Excalidraw, Framer ou Webflow sobre modelagem de modos de interação; ver a seção 6 |

### 1.5 Especificação executável e testes

| Fonte | URL | Versão ou data | O que sustenta |
|---|---|---|---|
| Gherkin, referência | https://cucumber.io/docs/gherkin/reference/ | documentação atual | Palavras-chave, tags, DocStrings, DataTables, idiomas |
| Gherkin, idiomas | https://raw.githubusercontent.com/cucumber/gherkin/main/gherkin-languages.json | branch main em 2026-10-08 | Palavras-chave em português |
| Cucumber, BDD | https://cucumber.io/docs/bdd/ | documentação atual | Documentação viva verificada contra o comportamento |
| Cucumber-JS, instalação | https://cucumber.io/docs/installation/javascript/ | documentação atual | npm install --save-dev @cucumber/cucumber |
| Registro npm @cucumber/cucumber | https://registry.npmjs.org/@cucumber/cucumber/latest | 13.3.0 | Node 22, 24 ou 26 ou superior; 32 dependências; 1.104.053 bytes |
| Registro npm playwright-bdd | https://registry.npmjs.org/playwright-bdd/latest | 9.2.1 | peer @playwright/test >=1.44 |
| README do playwright-bdd | https://github.com/vitalets/playwright-bdd | README em 2026-10-08 | Converte .feature em testes nativos do Playwright; suporta a última versão estável e as 10 anteriores |
| Playwright, parametrização | https://playwright.dev/docs/test-parameterize | Playwright atual | Gerar test() a partir de arrays e CSV |
| Playwright, fixtures | https://playwright.dev/docs/test-fixtures | Playwright atual | test.extend, escopo, fixtures automáticas |
| Playwright, test.step | https://playwright.dev/docs/api/class-test#test-step | Playwright atual (opções params e subtitle desde 1.63) | Assinatura de test.step |
| fast-check, model-based | https://fast-check.dev/docs/advanced/model-based-testing/ | fast-check 4.x | fc.commands, fc.modelRun, fc.asyncModelRun |
| Vitest, test.each | https://vitest.dev/api/#test-each | Vitest atual | test.each, test.for |
| Mermaid, diagrama de estados | https://mermaid.js.org/syntax/stateDiagram.html | Mermaid 12 | Sintaxe de estados, composição e concorrência |

---

## 2. XState v5 e @xstate/graph

### 2.1 Fatos documentados

- Versão publicada em 2026-10-08 segundo o registro npm: xstate 5.33.2, sem dependências de runtime e sem peerDependencies. O pacote exporta o subcaminho "./graph", ou seja, o código de grafo vem dentro de xstate.
- Tamanho (Bundlephobia, xstate 5.33.2): 46.874 bytes minificado e 14.559 bytes gzip para o pacote inteiro, 0 dependências. O subcaminho xstate/graph é um arquivo de saída separado (xstate-graph.esm.js), portanto fica fora do bundle de produção se só o código de teste o importar.
- setup(): setup({ types, actions, guards, delays, actors }).createMachine(config). Os tipos entram em types: context, events (união com type literal e payload), input, actions e guards (com params) e actors. Nomes de actions e guards usados na configuração são verificados contra o setup. setup.extend() existe desde 5.24.0. A página recomenda TypeScript 5.0 ou superior.
- createActor(actorLogic, options?): a página documenta a opção snapshot. Métodos: start(), send(event), getSnapshot() e subscribe(observer). Os eventos entram numa fila interna e são processados em sequência.
- Inspeção: a opção inspect de createActor recebe uma função chamada com um evento de inspeção para cada ator do sistema. Os tipos, pelo arquivo de declarações da 5.33.2: @xstate.snapshot (campos event e snapshot), @xstate.event (campos sourceRef e event), @xstate.actor, @xstate.microstep (campos event, snapshot e transições) e mais dois tipos na união (transição e ação). Todos trazem rootId e actorRef. Estados transitórios entrados e saídos apenas por transições always no mesmo passo só aparecem no evento de microstep.
- @statelyai/inspect 0.7.2: createBrowserInspector com as opções filter, serialize, autoStart (padrão true), url (padrão https://stately.ai/inspector) e iframe. Depende de ws, superjson, partysocket, isomorphic-ws, fast-safe-stringify e safe-stable-stringify, e tem peerDependency xstate ^5.5.1. Para outras bibliotecas de estado, expõe inspector.actor, inspector.event e inspector.snapshot para envio manual. Abre uma janela do Stately Inspector (serviço externo) por padrão.
- Destino do @xstate/graph: a página oficial diz que o pacote @xstate/graph está descontinuado e que as utilidades estão em xstate/graph. O registro npm ainda lista @xstate/graph 3.0.4 sem aviso de depreciação, com peerDependency xstate ^5.19.4.
- Destino do @xstate/test: o registro marca 0.5.1 como obsoleto, substituído por @xstate/test@2 (para o XState v6) e pelas utilidades de caminho em xstate/graph. Seu peerDependency é xstate ^4.29.0, portanto não instala com o XState 5 sem conflito.
- API de xstate/graph (docs): getShortestPaths(logic, options?) devolve um caminho mínimo até cada estado alcançável (Dijkstra). getSimplePaths(logic, options?) devolve todos os caminhos sem ciclos (busca em profundidade). getPathsFromEvents(logic, events, options?) devolve um único caminho. createTestModel(machine) devolve um TestModel.
- Opções de travessia (arquivo de tipos): events (lista ou função do estado), filterEvents, limit (padrão Infinity), fromState, stopWhen, toState, serializeState, serializeEvent, input.
- TestModel (arquivo de tipos): construtor (testLogic, options?); métodos getPaths(pathGenerator, options?), getShortestPaths, getSimplePaths, getPathsFromEvents, testPath(path, params), testState(params, state), testTransition(params, step). O construtor aceita ActorLogic qualquer, não só máquinas criadas por createMachine.
- TestPath: estende StatePath (state, steps, weight) com description e test(params). TestParam: states (um verificador por chave de estado) e events (um executor por tipo de evento). TestMeta (meta.test em cada estado): função (testContext, snapshot) que verifica o estado do sistema real.
- fromTransition(transition, estado inicial): ator puro baseado em reducer (state, event). Funciona com createActor. A página não menciona xstate/graph e não menciona o terceiro argumento actorScope; o uso com xstate/graph não foi confirmado por documentação.

### 2.2 Como se faz, com APIs

1. Declarar a máquina com setup({ types: { context, events } }).createMachine(...) com um estado por modo de interação (ocioso, apontando, arrastando, solto).
2. Gerar caminhos: createTestModel(machine).getShortestPaths({ events: [...] }) ou getSimplePaths.
3. Executar contra o sistema real: para cada caminho, chamar path.test({ events: { TIPO: async ({ event }) => { ...ação no Playwright... } }, states: { 'arrastando': async (snapshot) => { ...asserção... } } }).
4. Opcional: inspect em createActor para registrar a sequência de eventos do app real e comparar com o modelo.

### 2.3 Custo

- Dependência de runtime só se a máquina fizer parte do código do app: cerca de 15 KB gzip para o pacote inteiro (o bundle real depende do tree shaking, não medido).
- Se usada só em teste, o custo é zero no bundle de produção.
- Explosão combinatória: getSimplePaths cresce com o número de eventos e estados; limit e toState limitam. O artigo de 2022 sobre Playwright com XState registra que a execução exaustiva é lenta e sugere caminhos curtos no CI e cobertura completa fora do horário de pico.

### 2.4 O que verifica e o que não verifica

- Verifica: que cada transição do modelo, executada pelo driver (Playwright), leva o sistema real a um estado que passa nas asserções de cada estado do modelo. Detecta divergência entre modelo e app, dentro dos eventos e estados modelados.
- Não verifica: estados e eventos que o modelo não declara; que o modelo seja a especificação correta (o modelo é escrito à mão); causalidade interna (qual função foi chamada). Sem acoplamento ao código, o modelo e o app só se encontram pelas asserções.

### 2.5 Compatibilidade

- xstate 5.33.2 não declara peerDependencies. O arquivo de tipos exige TypeScript recente; a página de setup pede TypeScript 5.0 ou superior; o projeto usa 6.0.3. Não há restrição de React.
- Não testei a instalação nem a compilação no projeto; a compatibilidade com Vite 8.3.0, Vitest 5.0.1 e TypeScript 6.0.3 é inferida das informações acima.

### 2.6 Avaliação

- O projeto já tem um manifesto JSON com comandos e portas. Uma máquina XState duplicaria a tabela de transições existente. O valor está em getShortestPaths e em TestModel quando o modelo é de modos de interação (arrastar, redimensionar, digitar), não em mapear comandos um a um.
- @xstate/test não serve (peer xstate 4). @xstate/graph 3.0.4 existe, mas a documentação oficial manda usar xstate/graph.

---

## 3. Statecharts de Harel e SCXML

### 3.1 Fatos documentados

- statecharts.dev: um statechart é uma máquina de estados em que cada estado pode ter máquinas subordinadas. Extensões listadas: hierarquia (estado composto ativa um subestado inicial), regiões ortogonais (todas as regiões ativam juntas), ações de entrada e saída, guardas, várias transições para o mesmo evento escolhidas por guarda, transições automáticas e temporizadas, e estado de histórico. A página inicial cita o artigo de Harel (1987) e o problema da explosão de estados, sem detalhar.
- SCXML 1.0 (Recomendação W3C, 2015-09-01): elementos state, parallel, transition, onentry, onexit, initial, final, history, datamodel. Em estado composto exatamente um filho fica ativo; em parallel todos ficam ativos. Atributos de transition: event (lista de descritores, com casamento por prefixo separado por pontos), cond (guarda; erro conta como falso), target, type (external padrão ou internal). Microstep: executa o conjunto de transições habilitadas, na ordem saída, conteúdo da transição, entrada. Macrostep: sequência de microsteps até a fila interna esvaziar. Erros viram eventos error.communication e error.execution. Há um relatório de implementações (IRP, 2013) com suíte de testes.
- O PDF original de Harel não pôde ser lido (digitalização sem texto). Nada sobre o conteúdo do artigo foi extraído dele.

### 3.2 Como se usa

- SCXML é um formato de intercâmbio em XML. XState v5 não importa SCXML na documentação consultada; a devDependency xml-js e @scion-scxml/test-framework no registro do xstate indica testes de conformidade internos, não um recurso para o usuário. Não confirmado.
- Para o projeto, o que se aproveita é o vocabulário: estado composto (modo de arrasto com subestados), regiões paralelas (seleção e modo de edição ao mesmo tempo), ações de entrada e saída (onEnter e onExit para limpar a moldura), guarda, histórico.

### 3.3 Avaliação

- Adotar SCXML como formato de arquivo tem custo (XML, intérprete) sem ganho: não há ferramenta de verificação contra uma implementação em React. A semântica de microstep e macrostep é a referência útil para definir quando um comando "termina" (todos os efeitos em fila resolvidos) antes de verificar o estado.

---

## 4. Máquina de estados tipada sem biblioteca em TypeScript

### 4.1 Fatos documentados

- Handbook: quando todos os membros de uma união têm uma propriedade comum de tipo literal, o TypeScript estreita a união por ela (discriminante). Em um switch, o ramo default com const _exhaustiveCheck: never = valor produz erro de compilação quando um membro novo da união não é tratado.
- Operador satisfies (TypeScript 4.9): valida uma expressão contra um tipo sem alargar o tipo inferido. Com Record<Estados, ...> exige exatamente as chaves do tipo (nem a mais, nem a menos) e mantém os literais.

### 4.2 Técnica

1. Tipos: type Modo = { tipo: 'ocioso' } | { tipo: 'apontando'; alvo: Id; origem: Ponto } | { tipo: 'arrastando'; alvo: Id; alvosValidos: readonly Id[] } e type Evento = união discriminada por tipo.
2. Tabela de transições: const tabela = { ocioso: { PONTEIRO_BAIXO: ... }, apontando: { ... }, arrastando: { ... } } satisfies { [E in Modo['tipo']]: Partial<{ [V in Evento['tipo']]: Transicao }> }.
3. Função pura passo(modo, evento): Modo (reducer). A verificação de exaustividade usa never no default ou em um mapeado (Record) que obriga cada estado e cada evento.
4. Enumeração do grafo: busca em largura de uns 30 linhas sobre passo, com um conjunto de eventos de amostra por estado. Resulta em lista de pares (estado, evento, estado seguinte), que serve de dado para o teste do driver.

### 4.3 Custo

- Zero dependência e zero bytes extras. A enumeração do grafo e a geração de caminhos ficam a cargo do projeto (código próprio, a testar).

### 4.4 O que verifica e o que não verifica

- Verifica em tempo de compilação: cobertura de todos os estados e eventos da união, chaves da tabela e forma dos payloads.
- Não verifica: que o código real do app (handlers de ponteiro) siga a tabela; isso exige que o app consuma a tabela (ela deve ser a implementação, não uma cópia) ou um driver que compare.

### 4.5 Compatibilidade

- Totalmente compatível: usa só recursos do TypeScript 4.9 e anteriores. Funciona no TypeScript 6.0.3.

### 4.6 Avaliação

- Se a máquina de modos for a implementação (o tratador de ponteiros chama passo), o mapa deixa de ser documentação paralela: tabela e execução são o mesmo objeto. Essa é a vantagem sobre diagramas desenhados à parte.

---

## 5. tldraw: ferramentas como statechart

### 5.1 Fatos documentados

- Uma ferramenta é um estado de topo no statechart; o editor tem uma única ferramenta ativa. O pacote @tldraw/editor traz só o nó raiz; o pacote tldraw acrescenta as ferramentas.
- A classe StateNode (referência): propriedades id, initial (opcional), children (opcional, Record de nós); métodos transition(id, info?), getCurrent(), getPath(), getIsActive(); handlers opcionais onPointerDown, onPointerMove, onPointerUp, onKeyDown, onCancel, onInterrupt, onEnter(info, from) e onExit(info, to). Propriedade static trackPerformance ativa eventos de início e fim de interação.
- A ferramenta de seleção tem filhos como idle, pointing_shape, translating, resizing e rotating. Transição entre irmãos: this.parent.transition('id', info), com notação de pontos para estados mais fundos ('crop.pointing_crop_handle'). O info é entregue ao onExit do estado antigo e ao onEnter do novo.
- Os eventos descem da raiz pela ferramenta ativa até o estado filho ativo; um estado que não implementa o handler repassa o evento ao filho. O canvas envia eventos com target 'canvas'; o estado idle da seleção faz hit-test e redireciona para pointing_shape ou pointing_canvas.
- Exemplo de desenho: idle, pointing e drawing; em pointing, se o editor.inputs.getIsDragging() é verdadeiro, vai para drawing; se o ponteiro é solto antes, volta a idle.
- Eventos de entrada: type pointer (pointer_down, pointer_move, pointer_up, right_click, middle_click, long_press), keyboard (key_down, key_up, key_repeat) e misc (cancel, complete, interrupt, tick). Campos de ponteiro: point e target (canvas, shape, selection, handle, overlay). Todo evento despachado dispara before-event (antes da máquina) e event (depois), assinaturas por editor.on('event', ...).
- tldraw 5.5.2: 15,2 MB descompactado, peer de React ^18.2.0 ou ^19.2.1, licença em arquivo próprio (não verificada).

### 5.2 Lições aproveitáveis (avaliação)

- Modos aninhados com caminho completo (por exemplo selecionar.arrastando) permitem a máquina de interação de arraste do projeto ser um statechart simples: ocioso, apontando, arrastando, com onEnter e onExit para criar e remover a moldura.
- O ponto único de entrada (despacho de evento com alvo resolvido por hit-test) corresponde ao requisito G3 do projeto: as portas enviam só intenção, e o estado ativo decide.
- Os ganchos before-event e event são um modelo de observação para registrar a cadeia causa e efeito sem alterar os tratadores.
- Não faz sentido adotar tldraw como biblioteca: o pacote tem licença própria e 15 MB; serve de referência de desenho.

---

## 6. Excalidraw, CE.SDK, Figma, Framer, Webflow

### 6.1 Fatos documentados

- Excalidraw, ActionManager (código-fonte do branch master): as ações ficam em this.actions[action.name] (registerAction, registerAll). Teclado: handleKeyDown filtra as ações cujo keyTest casa, ordena por keyPriority e só executa se exatamente uma casar. Interface: renderAction desenha o PanelComponent da ação e o updateData chama perform. Programático: executeAction (source "api" por padrão). Todos os caminhos chegam em perform(elements, appState, value, app) e depois ao updater. Cada caminho registra o evento com o source (keyboard, ui, api). Os caminhos diferem em filtros: teclado exige correspondência única; API ignora o bloqueio de interação para source "api".
- CE.SDK (IMG.LY): modo de edição faz parte do estado do motor: getEditMode, setEditMode(modo) e setEditMode(nome, modoBase), onStateChanged. Modos: Transform (padrão), Crop, Text, Trim, Playback, Vector. Crop exige bloco de imagem ou vídeo selecionado; Text exige bloco de texto.
- Busca por posts de engenharia de Figma, Excalidraw, Framer e Webflow sobre modelagem de modos de interação: não localizei nenhum. O único post de engenharia da Figma que apareceu trata de edição multiusuário (https://www.figma.com/blog/multiplayer-editing-in-figma/, não aberto; fora do tema). Não há fonte primária dessas quatro empresas para este tema.

### 6.2 Avaliação

- O ActionManager do Excalidraw é a prova de existência do padrão do projeto (G3): várias portas, um perform. A tabela de portas do manifesto do projeto pode ser verificada por um teste que dispara cada porta e compara o efeito.
- O modelo de modo no estado do motor (CE.SDK) mostra um modo explícito e observável; o projeto já tem estados (breakpoint, classe, quadro-chave) que ocupam o papel de contexto de edição.

---

## 7. Especificação executável: Gherkin, Cucumber e alternativas data-driven

### 7.1 Fatos documentados

- Gherkin: palavras-chave Feature (um por arquivo), Rule (desde Gherkin 6), Example ou Scenario, Given, When, Then, And, But, Background, Scenario Outline com Examples, tags, DocStrings e DataTables. Mais de 70 idiomas; a primeira linha "# language: xx" escolhe o idioma.
- Português do Gherkin (arquivo gherkin-languages.json): Funcionalidade, Característica; Regra; Exemplo, Cenário; Esquema do Cenário; Contexto, Cenário de Fundo, Fundo; Exemplos, Cenários; Dado, Dada, Dados, Dadas; Quando; Então; E; Mas.
- Cucumber, BDD: o objetivo declarado é produzir documentação do sistema verificada automaticamente contra o comportamento; cada exemplo vira um teste ligado ao sistema.
- Cucumber-JS 13.3.0 exige Node 22, 24 ou 26 e superior, tem 32 dependências e 1,1 MB descompactado.
- playwright-bdd 9.2.1: converte arquivos .feature em testes nativos do Playwright; peerDependency @playwright/test >=1.44; Node 20 ou superior; o README diz suportar a última versão estável do Playwright e as 10 anteriores. Dependências incluem @cucumber/gherkin, @cucumber/messages e @cucumber/cucumber-expressions. Detalhes de bddgen e defineBddConfig não foram confirmados: a documentação em vitalets.github.io/playwright-bdd devolveu só o título.
- Playwright Test: gerar testes em laço a partir de arrays (nomes únicos), ou de CSV lido com fs; test.extend cria fixtures tipadas com escopo de teste ou worker e fixtures automáticas (auto: true); test.step(title, body, options) aceita box, timeout, location e, desde 1.63, params e subtitle.
- Vitest: test.each (array de arrays, array de objetos com $propriedade no título, template literal) e test.for (não espalha o array, entrega o TestContext).

### 7.2 Técnicas

A. Gherkin com cenários em português via playwright-bdd ou Cucumber-JS: arquivos .feature por funcionalidade, passos Dado/Quando/Então ligados a fixtures.
- Custo: acrescenta uma linguagem, um gerador (bddgen), 13 pacotes @cucumber e a manutenção de definições de passos. Ganho: texto legível por não programadores.
- Verifica: que cada cenário descrito passa na aplicação.
- Não verifica: que o texto cubra todos os comandos, portas e estados; que as definições de passos façam o que a frase diz.

B. Data-driven sem linguagem nova: o manifesto JSON existente (features com intent e scenarios) é lido por um único arquivo de teste que gera um test() por cenário (padrão documentado de parametrização do Playwright) e envolve cada etapa em test.step com params e subtitle (1.63). O JSON passa por zod para validar a forma. A fixture do Playwright expõe um driver de portas (botão, tecla, roda, arraste) que recebe a intenção.
- Custo: nenhuma dependência nova (zod, Playwright e Vitest já existem no projeto). Ganho: o manifesto é a fonte única do texto e do teste; o relatório do Playwright mostra os passos.
- Verifica: que o comportamento declarado em cada cenário se cumpre pelas portas declaradas.
- Não verifica: comportamento não declarado; e a validade do texto em si.

C. Cobertura cruzada manifesto-código: um teste de nível Vitest que percorre o manifesto e falha se algum comando não tiver cenário, se alguma porta não tiver um tratador que converge no comando, ou se algum cenário citar comando inexistente. Custo mínimo, só leitura de JSON.

### 7.3 Avaliação

- A opção B reaproveita o que o projeto já tem e evita uma segunda linguagem. A opção A só se justifica se pessoas sem acesso ao repositório precisarem ler e escrever cenários. A tradução para pt-BR do Gherkin existe e é completa.
- Esta pesquisa não encontrou, nas páginas abertas, documentação do Cucumber sobre "documentação viva" além do texto da página BDD; a página dedicada devolveu 404.

---

## 8. Geração de grafo de chamadas e de fluxo a partir do código

### 8.1 Fatos documentados

- LanguageService do TypeScript 6.0.3 (typescript.d.ts):
  - prepareCallHierarchy(fileName: string, position: number): CallHierarchyItem | CallHierarchyItem[] | undefined
  - provideCallHierarchyIncomingCalls(fileName: string, position: number): CallHierarchyIncomingCall[]
  - provideCallHierarchyOutgoingCalls(fileName: string, position: number): CallHierarchyOutgoingCall[]
  - findReferences(fileName: string, position: number): ReferencedSymbol[] | undefined
  - getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[] | undefined
  - CallHierarchyItem: name, kind, kindModifiers?, file, span, selectionSpan, containerName?. CallHierarchyIncomingCall: from e fromSpans. CallHierarchyOutgoingCall: to e fromSpans.
- A wiki do LanguageService: o serviço precisa de um LanguageServiceHost (que fornece arquivos e opções); um objeto de serviço por projeto; ScriptSnapshot.fromString evita análise incremental; createDocumentRegistry compartilha SourceFiles. A página é de 2020 e não descreve assinaturas de 5.x ou 6.x.
- ts-morph 28.0.0: findReferences() devolve símbolos referenciados, cada um com getReferences(); findReferencesAsNodes() devolve só os nós. As páginas consultadas não mencionam chamada de hierarquia nem acesso ao language service; esse acesso não foi confirmado na documentação. ts-morph 28.0.0 depende de @ts-morph/common ~0.29.0, que lista TypeScript 6.0.2 como devDependency e empacota o TypeScript no build (versão empacotada não confirmada). Tamanho: 1.481.221 bytes descompactado.
- TypeScript 7.0 Beta (2026-04-21): o compilador nativo (Go); não haverá API programática estável antes do 7.1; durante o beta o pacote é @typescript/native-preview com o executável tsgo; @typescript/typescript6 reexporta a API do 6.0 e pode ser aliado como typescript (npm install -D typescript@npm:@typescript/typescript6). O 7.0 é descrito como estruturalmente idêntico ao 6.0 na checagem de tipos.
- Uma busca web não achou fonte que confirme se o serviço de linguagem do tsgo oferece hierarquia de chamadas.

### 8.2 Técnica

1. Criar o LanguageService com createLanguageService e um host que lê tsconfig.json (ts.parseJsonConfigFileContent), ou usar ts-morph (new Project({ tsConfigFilePath })).
2. Para cada símbolo-raiz (por exemplo o tratador de um comando do manifesto), obter a posição do identificador, chamar prepareCallHierarchy e depois provideCallHierarchyOutgoingCalls recursivamente com um conjunto de visitados, até uma profundidade ou até nós de fronteira (a chamada de persistência).
3. Para leitores e escritores de estado (matriz do projeto): findReferences na declaração de cada item de estado, separando leitura de escrita pelo contexto sintático do nó.
4. Emitir o grafo como JSON e Mermaid (flowchart ou stateDiagram-v2).

### 8.3 Custo

- Dependência de desenvolvimento: typescript 6.0.3 já instalado (24,3 MB descompactado); ts-morph acrescenta 1,48 MB mais o TypeScript embutido.
- Tempo: cada chamada de hierarquia consulta o serviço; o tempo em um projeto deste tamanho não foi medido.

### 8.4 O que verifica e o que não verifica

- Verifica: o que o código chama de fato, estaticamente: confirma ou refuta uma cadeia declarada ("o botão chama o comando X que chama a função de escrita Y").
- Não verifica: chamadas por despacho dinâmico (nome de comando em string, tabela indexada por id do manifesto, callbacks passados como dado), efeitos de ordem em tempo de execução, valores de contexto. Uma hierarquia de chamadas estática de um sistema orientado a manifesto vê apenas até o ponto em que o código procura o tratador numa tabela.

### 8.5 Compatibilidade

- O LanguageService do 6.0.3 tem as assinaturas acima. Atualizar para o TypeScript 7 antes do 7.1 remove a API programática; a mitigação documentada é o alias @typescript/typescript6.

### 8.6 Avaliação

- Esta técnica serve como verificação cruzada do mapa (cada elo declarado pode ser confirmado por existência de caminho de chamada) e como detector de elos esquecidos. Não substitui o rastreamento manual com citação que o projeto exige.
- Como o projeto resolve comandos por id de manifesto, o grafo estático terá um corte no despacho. Uma tabela id do comando para função, mantida no código tipado, deixa o corte rastreável (findReferences na tabela).

---

## 9. Model-based testing com fast-check e com Playwright

### 9.1 Fatos documentados

- fast-check 4.x: interface de comando com check(model), run(model, real) e toString(); fc.commands(listaDeArbitrarios, { size }) monta a sequência; fc.modelRun(setup, cmds) para sistemas síncronos; fc.asyncModelRun para assíncronos; fc.scheduledModelRun para detectar corridas. Shrinking reduz só os comandos realmente executados. Reprodução exige seed, path e replayPath em commands. O modelo deve ser uma versão simplificada do sistema, não uma cópia.
- Com XState: o artigo de 2022 descreve o padrão de Playwright com @xstate/test (versão 4 do xstate): estados com meta para asserções, eventos com exec, geração dinâmica de testes por caminho, execução exaustiva lenta, manutenção do modelo indefinida pelo autor, dificuldade de depuração de testes dirigidos por dados.
- No xstate 5.33.2, o equivalente é createTestModel(machine) com path.test({ events, states }), conforme os arquivos de tipos da seção 2.

### 9.2 Técnica

- Para propriedades: fc.commands com comandos que são portas do manifesto (clicar botão, tecla, roda, arrastar), um modelo mínimo (por exemplo seleção e quantidade de blocos) e um sistema real que é o store do núcleo. Roda no Vitest (sem navegador), com asyncModelRun se o store for assíncrono. Invariantes após cada comando: integridade do documento, seleção igual nas vistas.
- Para caminhos: createTestModel sobre a máquina de modos; um teste de Playwright por caminho com path.test.

### 9.3 Custo e limites

- fast-check já faz parte do projeto (4.10.2). Custo adicional é só escrever comandos e modelo.
- O modelo deve ser independente da implementação; um modelo copiado do código repete os mesmos erros.

### 9.4 O que verifica e o que não verifica

- Verifica: invariantes após sequências aleatórias longas de comandos, com redução automática do caso de falha.
- Não verifica: aparência e medidas (que dependem do navegador); causalidade declarada (o modelo não registra qual função escreveu o quê).

### 9.5 Avaliação

- O fast-check fornece a rede de segurança que o mapa não dá: o mapa declara cadeias fixas, as propriedades verificam sequências não previstas.

---

## 10. Mermaid como saída legível por gente

### 10.1 Fatos documentados

- Mermaid, diagrama de estados: transições com -->, rótulos de texto, [*] como início e fim, estados compostos com state e chaves (aninhamento em várias camadas), choice, fork e join, concorrência com --, notas, classDef (não vale para estados inicial, final ou compostos). Desde a versão 12.0.0 o layout padrão é o ELK e o tema é redux-color; os valores antigos se restauram por front matter ou mermaid.initialize.

### 10.2 Avaliação

- Gerar texto Mermaid a partir da tabela de transições (ou do manifesto) dá uma visão para humanos sem dependência de runtime; renderização fica a cargo do visualizador do repositório ou de uma página de documentação. Texto gerado é determinístico e pode ser comparado por teste (o arquivo gerado deve coincidir com o commitado).

---

## 11. Proposta de arquitetura (avaliação, não fato documentado)

Camadas, da mais barata à mais cara:

1. Estrutura: ampliar o manifesto com cadeias declaradas por funcionalidade (porta, comando, contexto, estados escritos, vistas que refletem). Validar com zod no carregamento e em um teste de Vitest de cobertura cruzada (seção 7.2, opção C).
2. Modos de interação: máquina em TypeScript puro (seção 4) com tabela satisfies e verificação de exaustividade; o tratador de ponteiros executa a mesma tabela. Gerar Mermaid dela (seção 10).
3. Execução: um arquivo de Playwright que lê os cenários do manifesto, gera um test() por cenário, usa test.step com params, e uma fixture com o driver de portas (seção 7.2, opção B).
4. Sequências: fc.commands sobre as portas do manifesto com modelo mínimo (seção 9).
5. Confirmação estática: script com LanguageService (seção 8) que, para cada cadeia declarada, confirma o caminho de chamada entre o tratador da porta e a função que escreve o estado, e lista escritores de estado não declarados em nenhuma cadeia.

XState como dependência: adequado só se o grafo de caminhos (getShortestPaths e path.test) for desejado sem escrever o enumerador (a seção 4 mostra que o enumerador próprio tem cerca de 30 linhas). Custos da adoção: 14,6 KB gzip se a máquina for do app, mais uma segunda notação para manter. A compatibilidade de xstate com fromTransition e xstate/graph (modelar um reducer próprio sem createMachine) não está documentada nas páginas lidas e precisa de verificação por experimento antes de decidir.

Riscos registrados:
- TypeScript 7 sem API programática estável até 7.1 afeta a camada 5; o alias @typescript/typescript6 cobre.
- Hierarquia de chamadas estática para no despacho por id de manifesto.
- Playwright-bdd e Cucumber acrescentam dependências sem necessidade se o manifesto já guarda os cenários.
- Explosão de caminhos em getSimplePaths: usar limit e toState.

## 12. Lacunas desta pesquisa

- Documentação de bddgen e defineBddConfig do playwright-bdd: a página abriu apenas com o título.
- Página dedicada de documentação viva do Cucumber: retornou 404.
- Artigo de Harel (1987): PDF sem texto; usei statecharts.dev.
- Acesso ao language service pelo ts-morph e wrapper de hierarquia de chamadas: não confirmados na documentação.
- Posts de engenharia de Figma, Excalidraw, Framer e Webflow sobre modos de interação: não encontrados.
- Tamanho em bundle real do xstate com tree shaking e tempo de execução do LanguageService neste repositório: não medidos.
