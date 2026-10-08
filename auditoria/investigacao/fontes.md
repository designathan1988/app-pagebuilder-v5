# Fontes da investigação

Todas as fontes abaixo foram abertas por WebFetch (ou baixadas e lidas, quando a nota de pesquisa diz isso) em 2026-10-08 pelos subagentes de pesquisa. As anotações completas, com fatos documentados e avaliações separados, estão em auditoria/investigacao/pesquisa/. Cada tabela lista uma linha por URL distinta citada na nota da capacidade; a coluna de versão ou data repete o que a nota registra sobre o conteúdo aberto.

## C1 — Inventário dinâmico

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ | 2026-10-08 | TypeScript 7.0, publicado em 2026-07-08 | A 7.0 não traz API programática (a 7.1 terá API nova); pacote @typescript/typescript6 reexporta a API da 6.0; build do vscode de 125,7 s para 10,6 s |
| 2 | https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ | 2026-10-08 | TypeScript 6.0; a listagem dá 2026-03-06 e o corpo da página dá 2026-03-23 | A 6.0 é compatível em API com a 5.9 e é a última versão baseada em JavaScript; novos padrões de tsconfig |
| 3 | https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API | 2026-10-08 | Descreve TypeScript 6.0 e anteriores | createProgram, getTypeChecker, getPreEmitDiagnostics, forEachChild e createLanguageService |
| 4 | https://github.com/microsoft/typescript-go | 2026-10-08 | README lido em 2026-10-08; arquivamento previsto para setembro de 2026 | Porte nativo concluído; API marcada como não pronta; serviço de linguagem parcial |
| 5 | https://registry.npmjs.org/typescript/latest | 2026-10-08 | typescript 7.0.2 | Sem campo main e sem lib/typescript.js no manifesto; binário tsc |
| 6 | https://github.com/dsherret/ts-morph/releases | 2026-10-08 | ts-morph 28.0.0 (12 de abril, ano não mostrado) | A 28.0.0 atualiza para TypeScript 6.0 como mudança incompatível |
| 7 | https://registry.npmjs.org/ts-morph/latest | 2026-10-08 | ts-morph 28.0.0 | Depende de @ts-morph/common ~0.29.0; sem campo engines |
| 8 | https://registry.npmjs.org/@ts-morph/common/0.29.0 | 2026-10-08 | @ts-morph/common 0.29.0 | devDependency typescript 6.0.2 e script bundleLocalTs |
| 9 | https://ts-morph.com/setup/ | 2026-10-08 | Não informada na página | new Project com tsConfigFilePath e skipAddingFilesFromTsConfig; lib.d.ts servidos da memória |
| 10 | https://ts-morph.com/navigation/ | 2026-10-08 | Não informada na página | getChildren, forEachChild e forEachDescendant com traversal.skip, up e stop |
| 11 | https://playwright.dev/docs/aria-snapshots | 2026-10-08 | Documentação corrente do Playwright Test | toMatchAriaSnapshot, sintaxe YAML de nós, modos de children, --update-snapshots |
| 12 | https://playwright.dev/docs/api/class-locator | 2026-10-08 | Série corrente; ariaSnapshot desde a v1.49, depth e mode na v1.59, boxes na v1.60, signal na v1.62 | Assinatura de locator.ariaSnapshot com boxes, depth e mode; timeout padrão 0 |
| 13 | https://playwright.dev/docs/api/class-page | 2026-10-08 | Série corrente; ariaSnapshotJSON desde a v1.63 | page.ariaSnapshotJSON devolve a árvore de acessibilidade como valor JSON |
| 14 | https://playwright.dev/docs/release-notes | 2026-10-08 | Índice até a 1.64 | getByRef na 1.64; ariaSnapshotJSON na 1.63; page.accessibility removido na 1.57 |
| 15 | https://playwright.dev/docs/api/class-locatorassertions | 2026-10-08 | Série corrente; forma inline desde a v1.49, forma em arquivo desde a v1.50 | toMatchAriaSnapshot com template inline ou arquivo, signal e timeout |
| 16 | https://playwright.dev/docs/api/class-cdpsession | 2026-10-08 | Série corrente; on(event) e on(close) desde a v1.59 | newCDPSession, send, on e detach |
| 17 | https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/browser_protocol.json | 2026-10-08 | Ramo master (tip-of-tree), sem número de versão | Domínio Accessibility experimental: getFullAXTree, getPartialAXTree, queryAXTree e campos de AXNode |
| 18 | https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/ | 2026-10-08 | Não informada | não aberta: devolveu só um redirecionamento e não foi usada |
| 19 | https://registry.npmjs.org/dependency-cruiser/latest | 2026-10-08 | dependency-cruiser 18.5.0 | Node ^22, ^24 ou >=26; transpilador typescript >=2.0.0 e abaixo de 7.0.0 |
| 20 | https://github.com/sverweij/dependency-cruiser | 2026-10-08 | Não informada na página | Linguagens lidas e reporters disponíveis |
| 21 | https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/rules-reference.md | 2026-10-08 | Ramo main (série 18) | Regras forbidden, allowed e required; orphan, reachable, circular e severidades |
| 22 | https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/output-format.md | 2026-10-08 | Ramo main | Estrutura do JSON: modules, dependencies, summary e folders |
| 23 | https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/options-reference.md | 2026-10-08 | Ramo main | doNotFollow, includeOnly, tsPreCompilationDeps, cache (desde a 11.14.0) e skipAnalysisNotInRules |
| 24 | https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/cli.md | 2026-10-08 | Ramo main | Tipos de saída, --init, --cache, --baseline e --ignore-known |
| 25 | https://registry.npmjs.org/knip/latest | 2026-10-08 | knip 6.40.0 | Node ^20.19.0 ou >=22.12.0; oxc-parser e oxc-resolver; typescript só em devDependencies |
| 26 | https://knip.dev/blog/knip-v6 | 2026-10-08 | Knip 6, anúncio de 2026-03-20 | Backend trocado para oxc; classMembers removido; ganhos de 2 a 4 vezes em desempenho publicados pelo autor |
| 27 | https://knip.dev/reference/issue-types | 2026-10-08 | Série 6 | Tipos de problema: files, exports, types, dependencies, cycles e demais |
| 28 | https://knip.dev/reference/configuration | 2026-10-08 | Série 6 | entry, project, ignore e includeEntryExports (padrão false) |
| 29 | https://knip.dev/overview/configuration | 2026-10-08 | Série 6 | Plugins habilitados automaticamente; padrão de project |
| 30 | https://knip.dev/explanations/entry-files | 2026-10-08 | Série 6 | Arquivos de entrada como ponto de partida do grafo de módulos |
| 31 | https://knip.dev/features/production-mode | 2026-10-08 | Série 6 | knip --production e --strict excluem arquivos de teste |
| 32 | https://knip.dev/features/reporters | 2026-10-08 | Série 6 | Reporters json, markdown, sarif e reporter próprio com ReporterOptions |
| 33 | https://registry.npmjs.org/@microsoft/api-extractor/latest | 2026-10-08 | @microsoft/api-extractor 7.59.4 | Node >=20.9.0; typescript fixado em 5.9.3 |
| 34 | https://raw.githubusercontent.com/microsoft/rushstack/HEAD/apps/api-extractor/CHANGELOG.md | 2026-10-08 | 7.59.4 em 2026-10-06; 7.58.0 em 2026-04-01 | Compilador empacotado atualizado para 5.9.3; nenhuma menção a TypeScript 6 |
| 35 | https://api-extractor.com/pages/overview/intro/ | 2026-10-08 | Série 7 | Três saídas: relatório de API, rollup de .d.ts e modelo de documentação em JSON |
| 36 | https://api-extractor.com/pages/setup/configure_api_report/ | 2026-10-08 | Série 7 | apiReport.reportFolder e relatório etc/api-extractor.api.md versionado no git |
| 37 | https://api-extractor.com/pages/setup/invoking/ | 2026-10-08 | Série 7 | api-extractor run --local, mainEntryPointFilePath em .d.ts e exigência de declaration true |
| 38 | https://github.com/jsx-eslint/eslint-plugin-jsx-a11y | 2026-10-08 | Não informada na página | Regras no-static-element-interactions e click-events-have-key-events; análise somente estática |
| 39 | https://grapesjs.com/docs/api/commands.html | 2026-10-08 | Não informada na página | Commands: add, get, getAll, has, run, stop e eventos command:run |
| 40 | https://grapesjs.com/docs/modules/Traits.html | 2026-10-08 | Não informada na página | addType de componente com traits; tipos embutidos de trait |
| 41 | https://grapesjs.com/docs/api/components.html | 2026-10-08 | Não informada na página | addType, getType e getTypes (lista todos os tipos de componente) |
| 42 | https://www.builder.io/c/docs/custom-components-setup | 2026-10-08 | Versão do SDK não informada | Builder.registerComponent com name, inputs e opções; sem API de listagem descrita |
| 43 | https://developers.webflow.com/code-components/define-code-component | 2026-10-08 | Não informada na página | declareComponent em arquivo .webflow.tsx cujo nome identifica o componente |
| 44 | https://tldraw.dev/docs/shapes | 2026-10-08 | Não informada na página | ShapeUtil com static type e props, passado em shapeUtils |
| 45 | https://tldraw.dev/docs/tools | 2026-10-08 | Não informada na página | Ferramenta como StateNode com static id, passada na prop tools |
| 46 | https://tldraw.dev/sdk-features/actions | 2026-10-08 | Não informada na página | useActions devolve registro de ações por id; TLUiActionItem e atalhos ligados por kbd |
| 47 | https://lexical.dev/docs/concepts/commands | 2026-10-08 | Não informada na página | createCommand, registerCommand com prioridade e dispatchCommand; sem listagem descrita |
| 48 | https://www.cs.umd.edu/~atif/pubs/MemonWCRE2003-abstract.html | 2026-10-08 | Memon, Banerjee, Nagarajan; WCRE, novembro de 2003 (resumo) | GUI ripping percorre a interface em execução e extrai widgets, propriedades e valores |
| 49 | https://www.cs.umd.edu/~atif/pubs/ISSRE2012-abstract.html | 2026-10-08 | Cohen, Huang, Memon; ISSRE 2012 | Só título, autores e BibTeX foram lidos; o conteúdo do artigo não foi lido |
| 50 | https://ouia.readthedocs.io/en/latest/ | 2026-10-08 | Especificação OUIA 1.0-RC | Especificação de projeto de interface web para testadores; atributos e enumeração não constam do trecho lido |

## C2 — Acusação automática de quebra

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://registry.npmjs.org/vitest/latest | 2026-10-08 | vitest 5.0.3 | Peer de vite ^6.4.0, ^7.0.0 ou ^8.0.0; Node ^22.12.0, ^24.0.0 ou >=26.0.0 |
| 2 | https://registry.npmjs.org/fast-check/latest | 2026-10-08 | fast-check 4.10.2 | Versão atual igual à do projeto; Node >=12.17.0 |
| 3 | https://registry.npmjs.org/@fast-check/vitest/latest | 2026-10-08 | @fast-check/vitest 0.5.0 | Peer vitest ^4.1.0 ou ^5.0.0; compatível com Vitest 5 |
| 4 | https://registry.npmjs.org/@stryker-mutator/vitest-runner/latest | 2026-10-08 | @stryker-mutator/vitest-runner 10.0.0 | Peer vitest >=2.0.0 e core na versão exata 10.0.0; Node >=22.0.0 |
| 5 | https://vitest.dev/guide/migration.html | 2026-10-08 | Vitest 5.0.3 | Mudanças do Vitest 5: separador ' > ' em testNamePattern, clearMocks padrão true, reporters em arquivo |
| 6 | https://vitest.dev/guide/cli.html | 2026-10-08 | Vitest 5.0.3 | vitest related, vitest list, --changed, --shard, --bail e --project |
| 7 | https://vitest.dev/config/changed | 2026-10-08 | Vitest 5.0.3 | Opção changed e forceRerunTriggers (config e package.json rodam a suíte completa) |
| 8 | https://vitest.dev/guide/features.html | 2026-10-08 | Vitest 5.0.3 | Modo watch usa o module graph do Vite; --standalone; sharding com blob |
| 9 | https://vitest.dev/guide/filtering.html | 2026-10-08 | Vitest 5.0.3 | Filtros por arquivo, -t, linha e tags; filtros aplicados por arquivo |
| 10 | https://vitest.dev/guide/improving-performance.html | 2026-10-08 | Vitest 5.0.3 | pool forks, isolate false, fsModuleCache (8,75 s para 5,90 s no exemplo) e NODE_COMPILE_CACHE |
| 11 | https://vitest.dev/api/test#test-for | 2026-10-08 | Vitest 5.0.3 | test.each e test.for com TestContext e formatação de títulos |
| 12 | https://fast-check.dev/docs/advanced/model-based-testing/ | 2026-10-08 | Sem número de versão; rodapé de 18 de agosto de 2026 | Interface de comando (check, run, toString), shrinking e reprodução por replayPath |
| 13 | https://fast-check.dev/docs/api/functions/commands/ | 2026-10-08 | Sem versão do pacote | fc.commands e o shrinker adaptado a comandos |
| 14 | https://fast-check.dev/docs/api/functions/modelRun/ | 2026-10-08 | Sem versão do pacote | Assinatura de fc.modelRun com ModelRunSetup |
| 15 | https://fast-check.dev/docs/api/functions/asyncModelRun/ | 2026-10-08 | Sem versão do pacote | Assinatura de fc.asyncModelRun |
| 16 | https://fast-check.dev/docs/api/functions/scheduledModelRun/ | 2026-10-08 | Desde 1.24.0 | fc.scheduledModelRun passa comandos assíncronos pelo scheduler |
| 17 | https://fast-check.dev/docs/api/interfaces/CommandsContraints/ | 2026-10-08 | Sem versão do pacote | maxCommands, size, replayPath e disableReplayLog |
| 18 | https://fast-check.dev/docs/api/interfaces/Parameters/ | 2026-10-08 | Corresponde a 4.10 ou posterior | numRuns 100, seed, path, endOnFailure, examples; timeout obsoleto |
| 19 | https://fast-check.dev/docs/advanced/race-conditions/ | 2026-10-08 | Série 4.x; descontinuações desde v4.2.0 | Scheduler, waitIdle, waitNext e limites de scheduledModelRun |
| 20 | https://fast-check.dev/docs/configuration/global-settings/ | 2026-10-08 | Sem versão do pacote | configureGlobal, readConfigureGlobal e resetConfigureGlobal; registro em setupFiles do Vitest |
| 21 | https://fast-check.dev/docs/core-blocks/runners/ | 2026-10-08 | Sem versão do pacote | RunDetails de fc.check |
| 22 | https://fast-check.dev/docs/configuration/user-definable-values/ | 2026-10-08 | Sem versão do pacote | Valores definidos pelo usuário nas configurações do runner |
| 23 | https://fast-check.dev/blog/2025/03/10/whats-new-in-fast-check-4-0-0/ | 2026-10-08 | fast-check 4.0.0, 2025-03-10 | Mudanças da 4.0.0: datas inválidas, remoção de noBias e noShrink, scheduler mais preciso |
| 24 | https://raw.githubusercontent.com/dubzzz/fast-check/main/packages/fast-check/src/check/model/ModelRunner.ts | 2026-10-08 | Ramo main, sem versão | Ordem de execução: setup uma vez, check antes de run, comando ignorado se check falha |
| 25 | https://fast-check.dev/docs/tutorials/setting-up-your-test-environment/property-based-testing-with-vitest/ | 2026-10-08 | Sem versão | @fast-check/vitest com test.prop e configureGlobal para repetir falha |
| 26 | https://stryker-mutator.io/docs/stryker-js/vitest-runner/ | 2026-10-08 | Marca Since v7.0 | vitest.related padrão true, opções fixadas pelo Stryker, coverageAnalysis perTest, sem Browser Mode |
| 27 | https://stryker-mutator.io/docs/stryker-js/incremental/ | 2026-10-08 | Disponível desde o Stryker 6.2 | Modo incremental, --force, incrementalFile e limites de detecção de mudanças |
| 28 | https://stryker-mutator.io/docs/stryker-js/configuration/ | 2026-10-08 | Sem versão atual | mutate com faixas de linhas, concurrency, timeoutMS, thresholds, checkers |
| 29 | https://stryker-mutator.io/docs/stryker-js/disable-mutants/ | 2026-10-08 | Desde 5.4 | Comentários Stryker disable next-line, disable all e restore all |
| 30 | https://stryker-mutator.io/docs/mutation-testing-elements/supported-mutators/ | 2026-10-08 | Sem versão | Lista de mutadores do StrykerJS |
| 31 | https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/ | 2026-10-08 | Sem versão | Estados dos mutantes e fórmulas do mutation score |
| 32 | https://github.com/stryker-mutator/stryker-js/releases | 2026-10-08 | Núcleo 10.0.0 de 2026-08-14 até 9.0.1 | Histórico de versões; suporte a Vitest 4 na 9.4.0; as notas não citam Vitest 5 |
| 33 | https://research.google/pubs/state-of-mutation-testing-at-google/ | 2026-10-08 | Petrović e Ivanković, ICSE-SEIP 2018 (resumo) | Mutação baseada em diff, cerca de 6.000 engenheiros, cerca de 30% dos diffs |
| 34 | https://abseil.io/resources/swe-book/html/ch23.html | 2026-10-08 | Software Engineering at Google, capítulo 23 | TAP seleciona testes pelo grafo de dependências; mais de 50.000 mudanças e 4 bilhões de casos por dia |
| 35 | https://research.google/pubs/taming-google-scale-continuous-testing/ | 2026-10-08 | Memon e outros, ICSE-SEIP 2017 (só o resumo) | Poucos testes falham e tendem a estar próximos do código testado |
| 36 | https://arxiv.org/abs/1810.05286 | 2026-10-08 | Machalica e outros, 2018 (resumo) | Seleção preditiva da Meta: custo de testes reduzido por fator de dois, mais de 95% das falhas mantidas |
| 37 | https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis?view=azure-devops | 2026-10-08 | Página atualizada em 2026-05-07 | Test Impact Analysis recai para rodar tudo quando não entende a mudança; mapa de dependências manual |
| 38 | https://github.com/alexreardon/tiny-invariant | 2026-10-08 | Sem versão na página | invariant(condition, message) lança erro; mensagem vira Invariant failed em produção |
| 39 | https://vite.dev/guide/env-and-mode | 2026-10-08 | Vite v8.3.3 | import.meta.env.DEV removido por tree-shaking no build; NODE_ENV e mode são distintos |
| 40 | https://tldraw.dev/sdk-features/store | 2026-10-08 | Sem versão do pacote | Store valida registros contra schema a cada escrita; escrita inválida lança e nada é gravado |
| 41 | https://tldraw.dev/sdk-features/validation | 2026-10-08 | Sem versão do pacote (@tldraw/validate) | Validadores de schema e onValidationFailure |
| 42 | https://tldraw.dev/docs/persistence | 2026-10-08 | Sem versão | Só menciona migrações e o store |
| 43 | https://react.dev/reference/react/StrictMode | 2026-10-08 | Sem versão explícita; comportamento do React 19 | StrictMode em desenvolvimento reexecuta setup, cleanup e setup de effects e ref callbacks |
| 44 | https://en.wikipedia.org/wiki/Specification_by_example | 2026-10-08 | Artigo enciclopédico, sem versão | Especificação por exemplo: exemplos automatizados como documentação viva |

## C3 — Mapa executável

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://stately.ai/docs/setup | 2026-10-08 | xstate v5; setup.extend desde 5.24.0 | Assinatura e tipos de setup() e createMachine |
| 2 | https://stately.ai/docs/actors | 2026-10-08 | xstate v5 | createActor, start, send, getSnapshot e subscribe |
| 3 | https://stately.ai/docs/inspection | 2026-10-08 | xstate v5 | Opção inspect e eventos de inspeção |
| 4 | https://stately.ai/docs/inspector | 2026-10-08 | @statelyai/inspect, versão não informada na página | createBrowserInspector e suas opções |
| 5 | https://stately.ai/docs/xstate-graph | 2026-10-08 | xstate v5 (graph incluído no pacote principal) | getShortestPaths, getSimplePaths, getPathsFromEvents e createTestModel |
| 6 | https://stately.ai/docs/testing | 2026-10-08 | xstate v5 | Utilitários de teste baseado em modelo migraram para xstate/graph |
| 7 | https://stately.ai/docs/transition-actors | 2026-10-08 | xstate v5 | fromTransition(transition, estado inicial) |
| 8 | https://registry.npmjs.org/xstate/latest | 2026-10-08 | xstate 5.33.2 | Sem dependências; export do subcaminho ./graph |
| 9 | https://registry.npmjs.org/@xstate/graph/latest | 2026-10-08 | @xstate/graph 3.0.4 | Peer xstate ^5.19.4 |
| 10 | https://registry.npmjs.org/@xstate/test/latest | 2026-10-08 | @xstate/test 0.5.1 | Pacote marcado como obsoleto; peer xstate ^4.29.0 |
| 11 | https://registry.npmjs.org/@statelyai/inspect/latest | 2026-10-08 | @statelyai/inspect 0.7.2 | Dependências e peer xstate ^5.5.1 |
| 12 | https://unpkg.com/xstate@5.33.2/dist/declarations/src/graph/TestModel.d.ts | 2026-10-08 | xstate 5.33.2 | Classe TestModel: getPaths, testPath, testState e testTransition |
| 13 | https://unpkg.com/xstate@5.33.2/dist/declarations/src/graph/types.d.ts | 2026-10-08 | xstate 5.33.2 | TraversalOptions, TestModelOptions, TestMeta, TestPath e TestParam |
| 14 | https://unpkg.com/xstate@5.33.2/dist/declarations/src/inspection.d.ts | 2026-10-08 | xstate 5.33.2 | União InspectionEvent |
| 15 | https://bundlephobia.com/api/size?package=xstate@5.33.2 | 2026-10-08 | xstate 5.33.2 | 46.874 bytes minificado, 14.559 bytes gzip, 0 dependências |
| 16 | https://stately.ai/docs/xstate-test | 2026-10-08 | @xstate/test@beta | Aviso de migração para o pacote graph |
| 17 | https://dev.to/ryanroselloog/model-based-testing-using-playwright-and-xstate-what-ive-learnt-so-far-4180 | 2026-10-08 | Publicado em 2022-07-15; @xstate/test sem versão fixada | Custos e armadilhas na prática: execução exaustiva lenta |
| 18 | https://statecharts.dev/ | 2026-10-08 | Lido em 2026-10-08 | Statechart como máquina de estados ampliada; cita Harel 1987 |
| 19 | https://statecharts.dev/what-is-a-statechart.html | 2026-10-08 | Lido em 2026-10-08 | Hierarquia, regiões ortogonais, ações de entrada e saída, guardas e histórico |
| 20 | https://www.w3.org/TR/scxml/ | 2026-10-08 | Recomendação W3C de 2015-09-01; lidos os primeiros 100.000 de 227.948 caracteres | Elementos do SCXML, microstep e macrostep |
| 21 | https://www.state-machine.com/doc/Harel87.pdf | 2026-10-08 | Science of Computer Programming 8, 1987 | não aberta: PDF digitalizado sem camada de texto, conteúdo não lido |
| 22 | https://www.typescriptlang.org/docs/handbook/2/narrowing.html | 2026-10-08 | Handbook atual | Uniões discriminadas e verificação de exaustividade com never |
| 23 | https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html | 2026-10-08 | TypeScript 4.9 | Operador satisfies |
| 24 | https://unpkg.com/typescript@6.0.3/lib/typescript.d.ts | 2026-10-08 | typescript 6.0.3; lido o intervalo a partir do caractere 500.000 | Assinaturas de prepareCallHierarchy, provideCallHierarchyIncomingCalls, OutgoingCalls e findReferences |
| 25 | https://registry.npmjs.org/typescript/6.0.3 | 2026-10-08 | typescript 6.0.3 | 24.346.827 bytes descompactado; binários tsc e tsserver |
| 26 | https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API | 2026-10-08 | Página de 2020 | LanguageServiceHost e document registry; não cobre 5.x nem 6.x |
| 27 | https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-beta/ | 2026-10-08 | 2026-04-21 | Sem API programática estável antes do 7.1; alias @typescript/typescript6 |
| 28 | https://ts-morph.com/navigation/finding-references | 2026-10-08 | Versão não informada na página | findReferences e findReferencesAsNodes |
| 29 | https://ts-morph.com/navigation/ | 2026-10-08 | Versão não informada na página | A página não menciona call hierarchy |
| 30 | https://registry.npmjs.org/ts-morph/latest | 2026-10-08 | ts-morph 28.0.0 | Dependência de @ts-morph/common ~0.29.0; 1.481.221 bytes descompactado |
| 31 | https://registry.npmjs.org/@ts-morph/common/latest | 2026-10-08 | @ts-morph/common 0.29.0 | TypeScript 6.0.2 como devDependency e script de empacotamento do compilador |
| 32 | https://tldraw.dev/sdk-features/tools | 2026-10-08 | tldraw 5.5.2 (registro npm) | Ferramentas como statechart: StateNode com filhos idle, pointing_shape, translating |
| 33 | https://tldraw.dev/docs/tools | 2026-10-08 | tldraw atual | StateNode e ferramenta customizada |
| 34 | https://tldraw.dev/reference/editor/StateNode | 2026-10-08 | @tldraw/editor atual | Membros de StateNode: transition, onEnter e onExit |
| 35 | https://tldraw.dev/sdk-features/events | 2026-10-08 | tldraw atual | Tipos e nomes de eventos; before-event e event |
| 36 | https://registry.npmjs.org/tldraw/latest | 2026-10-08 | tldraw 5.5.2 | 15.244.188 bytes descompactado; peer React ^18.2.0 ou ^19.2.1 |
| 37 | https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/actions/manager.tsx | 2026-10-08 | Ramo master em 2026-10-08 | ActionManager: uma action com três portas (teclado, interface, API) convergindo em perform |
| 38 | https://img.ly/docs/cesdk/js/concepts/edit-modes-1f5b6c | 2026-10-08 | Documentação atual | Modos de edição no estado do motor: getEditMode e setEditMode |
| 39 | https://www.figma.com/blog/multiplayer-editing-in-figma/ | 2026-10-08 | Não informada | não aberta: apareceu em busca; trata de edição multiusuário, fora do tema |
| 40 | https://cucumber.io/docs/gherkin/reference/ | 2026-10-08 | Documentação atual | Palavras-chave do Gherkin, tags, DocStrings e DataTables |
| 41 | https://raw.githubusercontent.com/cucumber/gherkin/main/gherkin-languages.json | 2026-10-08 | Ramo main em 2026-10-08 | Palavras-chave do Gherkin em português |
| 42 | https://cucumber.io/docs/bdd/ | 2026-10-08 | Documentação atual | Documentação viva verificada contra o comportamento |
| 43 | https://cucumber.io/docs/installation/javascript/ | 2026-10-08 | Documentação atual | npm install --save-dev @cucumber/cucumber |
| 44 | https://registry.npmjs.org/@cucumber/cucumber/latest | 2026-10-08 | @cucumber/cucumber 13.3.0 | Node 22, 24 ou 26 e superior; 32 dependências; 1.104.053 bytes |
| 45 | https://registry.npmjs.org/playwright-bdd/latest | 2026-10-08 | playwright-bdd 9.2.1 | Peer @playwright/test >=1.44 |
| 46 | https://github.com/vitalets/playwright-bdd | 2026-10-08 | README em 2026-10-08 | Converte arquivos .feature em testes nativos do Playwright; suporta a última versão estável e as 10 anteriores |
| 47 | https://vitalets.github.io/playwright-bdd | 2026-10-08 | Não informada | não aberta de fato: a página devolveu só o título, sem bddgen nem defineBddConfig |
| 48 | https://playwright.dev/docs/test-parameterize | 2026-10-08 | Playwright atual | Gerar test() a partir de arrays e CSV |
| 49 | https://playwright.dev/docs/test-fixtures | 2026-10-08 | Playwright atual | test.extend, escopo e fixtures automáticas |
| 50 | https://playwright.dev/docs/api/class-test#test-step | 2026-10-08 | Playwright atual; opções params e subtitle desde 1.63 | Assinatura de test.step |
| 51 | https://fast-check.dev/docs/advanced/model-based-testing/ | 2026-10-08 | fast-check 4.x | fc.commands, fc.modelRun e fc.asyncModelRun |
| 52 | https://vitest.dev/api/#test-each | 2026-10-08 | Vitest atual | test.each e test.for |
| 53 | https://mermaid.js.org/syntax/stateDiagram.html | 2026-10-08 | Mermaid 12 | Sintaxe de diagrama de estados, composição e concorrência |

## C4 — Interface sem navegador

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://github.com/chenglou/pretext | 2026-10-08 | README do ramo main, 1.819 commits | API prepare e layout; medição de texto sem DOM |
| 2 | https://raw.githubusercontent.com/chenglou/pretext/main/package.json | 2026-10-08 | Versão 0.0.9 | Versão do pacote |
| 3 | https://registry.npmjs.org/@chenglou/pretext/latest | 2026-10-08 | @chenglou/pretext 0.0.9 | sideEffects false, sem engines e sem dependências de execução |
| 4 | https://raw.githubusercontent.com/chenglou/pretext/main/CHANGELOG.md | 2026-10-08 | 0.0.9 em 2026-09-07; seção Unreleased posterior | Correções de kerning e ligadura ainda não publicadas |
| 5 | https://raw.githubusercontent.com/chenglou/pretext/main/src/measurement.ts | 2026-10-08 | Ramo main | Escolha de OffscreenCanvas ou canvas do DOM; erro em Node puro |
| 6 | https://raw.githubusercontent.com/chenglou/pretext/main/PLATFORM_BUGS.md | 2026-10-08 | Ramo main | Discrepâncias canvas versus DOM por navegador; Windows não testado |
| 7 | https://raw.githubusercontent.com/chenglou/pretext/main/DEVELOPMENT.md | 2026-10-08 | Ramo main | Bun como executor; medição real exige navegador |
| 8 | https://raw.githubusercontent.com/chenglou/pretext/main/RESEARCH.md | 2026-10-08 | Primeiros 100000 de 473775 caracteres lidos | Encaixe de linha por motor (Chrome em 1/64 px) e divergências canvas versus DOM |
| 9 | https://github.com/chenglou/pretext/issues?q=node+canvas | 2026-10-08 | 52 resultados | Nenhum título visível cita @napi-rs/canvas, skia-canvas ou node-canvas |
| 10 | https://registry.npmjs.org/@napi-rs/canvas/latest | 2026-10-08 | @napi-rs/canvas 1.0.10 | Node >=10; pacote opcional win32-x64-msvc |
| 11 | https://raw.githubusercontent.com/Brooooooklyn/canvas/main/package.json | 2026-10-08 | Ramo main | napi.targets inclui x86_64-pc-windows-msvc |
| 12 | https://raw.githubusercontent.com/Brooooooklyn/canvas/main/index.d.ts | 2026-10-08 | @napi-rs/canvas 1.0.10 | GlobalFonts.registerFromPath, TextMetrics e propriedades de texto do contexto |
| 13 | https://github.com/Brooooooklyn/canvas/releases | 2026-10-08 | v1.0.10 em 2026-10-01 | Correção de use-after-free; v1.0.9 invalida o cache de typefaces |
| 14 | https://github.com/samizdatco/skia-canvas/releases | 2026-10-08 | Estável 3.0.8; v4.0.0-rc9 em 6 de outubro | Versões estável e de pré-lançamento |
| 15 | https://raw.githubusercontent.com/samizdatco/skia-canvas/master/package.json | 2026-10-08 | Versão 4.0.0-rc9 | Node >=18; binário pré-compilado ou compilação |
| 16 | https://registry.npmjs.org/skia-canvas/latest | 2026-10-08 | skia-canvas 3.0.8 | Versão estável |
| 17 | https://skia-canvas.org/getting-started | 2026-10-08 | Versão não informada na página | Linux, macOS ou Windows com binários arm64 ou x64; Windows x64 não nomeado |
| 18 | https://skia-canvas.org/api/font-library | 2026-10-08 | Série 3.x | FontLibrary.use, has, family e reset |
| 19 | https://skia-canvas.org/api/context | 2026-10-08 | Série 3.x | measureText com .lines, textWrap, fontHinting desligado por padrão |
| 20 | https://github.com/Automattic/node-canvas | 2026-10-08 | v3 estável; v4 em pré-lançamento | Backend Cairo; Node mínimo 22 na v4; binários para Windows |
| 21 | https://github.com/opentypejs/opentype.js | 2026-10-08 | Versão não informada na página | getAdvanceWidth, getKerningValue, features liga e rlig |
| 22 | https://registry.npmjs.org/opentype.js/latest | 2026-10-08 | opentype.js 2.0.0 | Sem dependências de execução |
| 23 | https://github.com/foliojs/fontkit | 2026-10-08 | Sem versão na página | font.layout, GSUB, GPOS e fontes variáveis |
| 24 | https://registry.npmjs.org/fontkit/latest | 2026-10-08 | fontkit 2.0.4 | Versão do pacote |
| 25 | https://github.com/harfbuzz/harfbuzzjs | 2026-10-08 | Sem versão na página | WASM do HarfBuzz com HB_TINY; fluxo Blob, Face, Font, Buffer e shape |
| 26 | https://registry.npmjs.org/harfbuzzjs/latest | 2026-10-08 | harfbuzzjs 1.6.3 | Cerca de 1,3 MB descompactado, 9 arquivos |
| 27 | https://registry.npmjs.org/yoga-layout/latest | 2026-10-08 | yoga-layout 3.2.1 | Versão do pacote WASM |
| 28 | https://www.yogalayout.dev/docs/styling/ | 2026-10-08 | Sem versão na página | Propriedades de estilo suportadas; sem grid; sempre border-box |
| 29 | https://www.yogalayout.dev/docs/getting-started/configuring-yoga | 2026-10-08 | Sem versão na página | Configuração, incluindo UseWebDefaults |
| 30 | https://www.yogalayout.dev/docs/advanced/external-layout-systems | 2026-10-08 | Sem versão na página | Função de medição de texto externa; Yoga não implementa layout de texto |
| 31 | https://raw.githubusercontent.com/facebook/yoga/main/javascript/src/wrapAssembly.ts | 2026-10-08 | Ramo main | setMeasureFunc; sem free exposto, usa FinalizationRegistry |
| 32 | https://raw.githubusercontent.com/facebook/yoga/main/javascript/README.md | 2026-10-08 | Ramo main | Uso do binding JavaScript do Yoga |
| 33 | https://github.com/DioxusLabs/taffy | 2026-10-08 | Sem versão na página | Block, flexbox e grid; nenhum layout de texto |
| 34 | https://docs.rs/taffy/latest/taffy/ | 2026-10-08 | taffy 0.14.0 | compute_layout_with_measure para folhas |
| 35 | https://registry.npmjs.org/taffy-js/latest | 2026-10-08 | taffy-js 0.2.12 | Obsoleto, renomeado para taffy-layout |
| 36 | https://registry.npmjs.org/taffy-layout/latest | 2026-10-08 | taffy-layout 3.0.0 | MIT, Node >=18, módulo ES |
| 37 | https://github.com/ByteLandTechnology/taffy-layout | 2026-10-08 | Sem versão na página | Binding JS mantido por terceiro: loadTaffy, TaffyTree, Style e Layout |
| 38 | https://registry.npmjs.org/satori/latest | 2026-10-08 | satori 0.44.0 | Node >=16 |
| 39 | https://github.com/vercel/satori | 2026-10-08 | Sem versão na página | Renderiza JSX para SVG com Taffy e HarfBuzz |
| 40 | https://github.com/vercel/satori/blob/main/README.md | 2026-10-08 | Ramo main | Fontes TTF, OTF e WOFF; overflowWrap não suportado; subconjunto de CSS |
| 41 | https://developer.android.com/guide/topics/resources/pseudolocales | 2026-10-08 | Sem data na página | Pseudolocales en-XA (acentos e colchetes) e ar-XB (invertido) |
| 42 | https://learn.microsoft.com/en-us/windows/win32/intl/pseudo-locales | 2026-10-08 | Atualizada em 2025-03-11 | Pseudo-locales qps-ploc, qps-plocm, qps-ploca e qps-Latn-x-sh |
| 43 | https://learn.microsoft.com/en-us/windows/win32/intl/using-pseudo-locales-for-localization-testing | 2026-10-08 | Atualizada em 2025-03-11 | Uso de pseudo-locales em teste de localização |
| 44 | https://github.com/tryggvigy/pseudo-localization | 2026-10-08 | Sem versão na página | pseudoLocalizeString, strategy accented e bidi, PseudoLocalizeDom |
| 45 | https://registry.npmjs.org/pseudo-localization/latest | 2026-10-08 | pseudo-localization 3.1.3 | Sem dependências de execução |
| 46 | https://formatjs.github.io/docs/tooling/cli/ | 2026-10-08 | Sem versão na página | Pseudo-locales xx-LS, xx-AC, xx-HA, en-XA e en-XB (exigem --ast) |
| 47 | https://www.w3.org/International/articles/article-text-size | 2026-10-08 | Artigo W3C, tabela atribuída à IBM | Expansão de texto por faixa de comprimento (de 130% a 300%) |
| 48 | https://playwright.dev/docs/aria-snapshots | 2026-10-08 | Sem número de versão; direitos 2026 | Snapshot de acessibilidade como restrição, não serialização completa |
| 49 | https://playwright.dev/docs/api/class-locator#locator-aria-snapshot | 2026-10-08 | Série corrente; desde a 1.49 | locator.ariaSnapshot e opção boxes (desde a 1.60) com retângulos |
| 50 | https://playwright.dev/docs/api/class-page#page-aria-snapshot | 2026-10-08 | Série corrente; desde a 1.59 | page.ariaSnapshot e ariaSnapshotJSON (1.63) |
| 51 | https://playwright.dev/docs/release-notes | 2026-10-08 | Mais recente listada: 1.64 | Marcos de versão do ariaSnapshot, boxes e getByRef |
| 52 | https://registry.npmjs.org/happy-dom/latest | 2026-10-08 | happy-dom 20.14.5 | Node >=20.0.0 |
| 53 | https://raw.githubusercontent.com/capricorn86/happy-dom/master/packages/happy-dom/src/nodes/element/Element.ts | 2026-10-08 | Ramo master | getBoundingClientRect devolve DOMRect vazio; scrollWidth e scrollHeight em 0 |
| 54 | https://raw.githubusercontent.com/capricorn86/happy-dom/master/packages/happy-dom/src/nodes/html-element/HTMLElement.ts | 2026-10-08 | Ramo master | offsetWidth, offsetHeight e clientWidth inicializados com 0, sem lógica de layout |
| 55 | https://github.com/capricorn86/happy-dom | 2026-10-08 | Sem versão na página | Descrição de navegador sem interface gráfica; nada sobre layout |
| 56 | https://github.com/capricorn86/happy-dom/wiki | 2026-10-08 | Sem versão | Wiki sem afirmação sobre layout |
| 57 | https://github.com/capricorn86/happy-dom/wiki/Node-Canvas-Adapter | 2026-10-08 | Sem versão | Adaptador para o pacote canvas; não cita @napi-rs/canvas nem measureText |
| 58 | https://registry.npmjs.org/css-tree/latest | 2026-10-08 | css-tree 3.2.1 | Dependências mdn-data 2.27.1 e source-map-js |
| 59 | https://github.com/csstree/csstree/blob/master/README.md | 2026-10-08 | Ramo master, sem versão | Lexer, parser tolerante e walk |
| 60 | https://github.com/csstree/csstree/blob/master/docs/ast.md | 2026-10-08 | Ramo master | Tipos de nó da AST |
| 61 | https://github.com/csstree/csstree/blob/master/docs/parsing.md | 2026-10-08 | Ramo master | parse com opções context, positions e onParseError |
| 62 | https://github.com/csstree/csstree/blob/master/docs/traversal.md | 2026-10-08 | Ramo master | walk, find, findAll, walk.skip e walk.break |
| 63 | https://registry.npmjs.org/stylelint/latest | 2026-10-08 | stylelint 17.16.0 | Node >=20.19.0 |
| 64 | https://stylelint.io/user-guide/rules/ | 2026-10-08 | Sem versão na página | Nenhuma regra nativa sobre overflow, white-space ou flex |
| 65 | https://stylelint.io/developer-guide/plugins/ | 2026-10-08 | Sem versão na página | createPlugin, utils.report e API PostCSS |
| 66 | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText | 2026-10-08 | Baseline desde julho de 2015 | measureText devolve TextMetrics |
| 67 | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontKerning | 2026-10-08 | Disponibilidade limitada | fontKerning auto, normal e none |
| 68 | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing | 2026-10-08 | Baseline 2025 (março de 2025) | letterSpacing do canvas como string CSS |
| 69 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter | 2026-10-08 | Baseline 2024 (abril de 2024) | Granularidades grapheme, word e sentence |

## C5 — Contratos de campo

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://raw.githubusercontent.com/csstree/csstree/master/README.md | 2026-10-08 | Ramo master (css-tree 3.x) | Lexer valida só valores de declarações e at-rules; matchProperty, isType e getTrace |
| 2 | https://raw.githubusercontent.com/csstree/csstree/master/docs/readme.md | 2026-10-08 | Ramo master | Índice da documentação; não há página dedicada ao lexer |
| 3 | https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md | 2026-10-08 | Ramo master | Módulo definitionSyntax: parse, walk e generate |
| 4 | https://raw.githubusercontent.com/csstree/csstree/master/docs/utils.md | 2026-10-08 | Ramo master | Utilitários property, keyword, ident, string e url |
| 5 | https://github.com/csstree/csstree/blob/master/lib/lexer/Lexer.js | 2026-10-08 | Ramo master | Métodos matchProperty, matchType e match; erros para var() e propriedade customizada |
| 6 | https://github.com/csstree/csstree/blob/master/lib/lexer/error.js | 2026-10-08 | Ramo master | SyntaxReferenceError e SyntaxMatchError com mismatchOffset; mensagem em inglês |
| 7 | https://github.com/csstree/csstree/blob/master/lib/syntax/create.js | 2026-10-08 | Ramo master | fork(extension) recria parser, walker, generator e Lexer |
| 8 | https://github.com/csstree/csstree/blob/master/CHANGELOG.md | 2026-10-08 | 3.0.0 (2024-09-11) até 3.2.1 (2026-03-05) | Histórico de versões do css-tree; nada sobre desempenho |
| 9 | https://zod.dev/codecs | 2026-10-08 | Série 4.x do zod | z.codec, decode, encode e checks nas duas direções |
| 10 | https://zod.dev/api?id=codecs | 2026-10-08 | Série 4.x do zod | Codecs, templateLiteral e refine |
| 11 | https://zod.dev/error-customization | 2026-10-08 | Série 4.x do zod | Parâmetro error, precedência de mensagens e z.config |
| 12 | https://zod.dev/error-customization?id=internationalization | 2026-10-08 | Série 4.x do zod | Locales pt e ptBR em zod/locales |
| 13 | https://zod.dev/v4/changelog | 2026-10-08 | Série 4 do zod | message virou error; errorMap virou error |
| 14 | https://zod.dev/error-formatting | 2026-10-08 | Série 4.x do zod | treeifyError, prettifyError e flattenError |
| 15 | https://zod.dev/json-schema | 2026-10-08 | Série 4.x do zod | z.toJSONSchema com target, io e unrepresentable |
| 16 | https://fast-check.dev/docs/core-blocks/arbitraries/primitives/string/ | 2026-10-08 | Série 4.x | fc.string e a opção unit |
| 17 | https://fast-check.dev/docs/core-blocks/arbitraries/combiners/string/ | 2026-10-08 | Série 4.x; stringMatching desde 3.10.0 | fc.stringMatching com regex |
| 18 | https://fast-check.dev/docs/core-blocks/arbitraries/combiners/any/ | 2026-10-08 | Série 4.x | fc.oneof ponderado e fc.option |
| 19 | https://fast-check.dev/docs/core-blocks/arbitraries/combiners/constant/ | 2026-10-08 | Série 4.x | constant, constantFrom e mapToConstant |
| 20 | https://fast-check.dev/docs/core-blocks/properties/ | 2026-10-08 | Série 4.x | fc.property, fc.pre e fc.assert |
| 21 | https://fast-check.dev/docs/core-blocks/runners/ | 2026-10-08 | Série 4.x | fc.check e RunDetails |
| 22 | https://fast-check.dev/docs/api/interfaces/Parameters/ | 2026-10-08 | Série 4.x | numRuns, seed, path, examples e reporter |
| 23 | https://fast-check.dev/docs/configuration/global-settings/ | 2026-10-08 | Série 4.x | configureGlobal e readConfigureGlobal |
| 24 | https://fast-check.dev/docs/configuration/user-definable-values/ | 2026-10-08 | Série 4.x | Valores configuráveis pelo usuário |
| 25 | https://fast-check.dev/docs/advanced/model-based-testing/ | 2026-10-08 | Série 4.x | fc.commands, modelRun e replayPath; modelo simplificado, não cópia |
| 26 | https://fsharpforfunandprofit.com/posts/property-based-testing-2/ | 2026-10-08 | Data não exibida na página | Seis categorias de propriedade: ida e volta, invariantes, idempotência e outras |
| 27 | https://hypothesis.works/articles/what-is-hypothesis/ | 2026-10-08 | Publicado em 2016-07-24 | Round-trip e redução do caso falho; banco local de falhas |
| 28 | https://react-aria.adobe.com/NumberField | 2026-10-08 | Sem versão na página | Props de NumberField: commitBehavior, formatOptions, isWheelDisabled |
| 29 | https://react-aria.adobe.com/NumberField/useNumberField | 2026-10-08 | Sem versão na página | Hook useNumberField e seus parâmetros |
| 30 | https://cdn.jsdelivr.net/npm/@react-stately/numberfield/src/useNumberFieldState.ts | 2026-10-08 | Código mais recente; registro npm informa 3.12.1 | commit em cinco passos, validate parcial e incremento seguro |
| 31 | https://cdn.jsdelivr.net/npm/@react-aria/numberfield/src/useNumberField.ts | 2026-10-08 | Registro npm informa 3.13.1 | Enter e blur chamam commit; roda do mouse; sem tratamento de Escape |
| 32 | https://react-aria.adobe.com/internationalized/number/NumberParser | 2026-10-08 | Registro npm informa 3.6.9 | NumberParser.parse e isValidPartialNumber; unidades do Intl, não unidades CSS |
| 33 | https://base-ui.com/react/components/number-field | 2026-10-08 | @base-ui/react 1.8.0 | onValueCommitted, smallStep, largeStep, ScrubArea e allowWheelScrub |
| 34 | https://github.com/designbyadrian/react-input-with-drag | 2026-10-08 | Versão não exibida; repositório descontinuado | Prop modifiers com padrão shiftKey 0.1 |
| 35 | https://developer.chrome.com/docs/devtools/shortcuts | 2026-10-08 | Sem número de versão do Chrome | Seta, Shift, Control ou Command e Alt mudam valores em 1, 10, 100 e 0,1 |
| 36 | https://developer.chrome.com/docs/devtools/css/reference | 2026-10-08 | Sem número de versão do Chrome | Referência de edição de valores CSS; edição por arraste obsoleta desde o Chrome 123 |
| 37 | https://developer.chrome.com/docs/devtools/css | 2026-10-08 | Sem número de versão do Chrome | Editor de sombra e edição de valores no painel Styles |
| 38 | https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/ | 2026-10-08 | Data da página não exibida | Teclado do spinbutton: setas, Home, End, Page Up e Page Down; aria-valuenow |
| 39 | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number | 2026-10-08 | Data da página não exibida | step, min, pattern não suportado e papel spinbutton |
| 40 | https://help.figma.com/hc/en-us/articles/360040449873-Set-small-and-big-nudge-values | 2026-10-08 | Não informada na página | Aberta sem tratar de campos numéricos nem de arraste do rótulo |
| 41 | https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard | 2026-10-08 | Não informada na página | Aberta sem tratar de campos numéricos nem de arraste do rótulo |
| 42 | https://university.webflow.com/videos/input-values-and-units | 2026-10-08 | Não informada na página | Diz só que o valor pode ser digitado por teclado ou mouse e remete a um vídeo |
| 43 | https://elementor.com/help/number-scrubber/ | 2026-10-08 | Não informada na página | não aberta de fato: a página abriu sem o corpo do artigo |
| 44 | https://www.w3.org/TR/css-values-4/ | 2026-10-08 | CSS Values and Units Level 4; lidos os primeiros 100000 de 253104 caracteres | number, dimension, percentage, unidades insensíveis a caixa e precisão definida pela implementação |
| 45 | https://stately.ai/docs/xstate | 2026-10-08 | XState v5 | Exemplo de campo de texto com estados reading e editing, commit e cancel |

## C6 — Eventos e estados

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://tldraw.dev/docs/editor | 2026-10-08 | Sem número; package.json do editor em main indica 5.5.2 | Editor como statechart: getPath, getCurrentToolId e root |
| 2 | https://tldraw.dev/sdk-features/tools | 2026-10-08 | Sem número; editor 5.5.2 em main | StateNode root, branch e leaf; ganchos e transition |
| 3 | https://tldraw.dev/sdk-features/events | 2026-10-08 | Sem número; editor 5.5.2 em main | Tipos de evento, before-event e event, tick |
| 4 | https://tldraw.dev/sdk-features/input-handling | 2026-10-08 | Sem número; editor 5.5.2 em main | InputsManager, limiar de arraste e ordem de processamento do evento |
| 5 | https://tldraw.dev/reference/editor/Editor | 2026-10-08 | Sem número; editor 5.5.2 em main | dispatch, getPath, getCurrentTool e setCurrentTool |
| 6 | https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/editor/tools/StateNode.ts | 2026-10-08 | Ramo main | transition, handleEvent e proteções contra transição reentrante; sem tabela de transições legais |
| 7 | https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/editor/Editor.ts | 2026-10-08 | Ramo main; arquivo de 11764 linhas baixado por curl | dispatch com fila por quadro, isIn, markEventAsHandled |
| 8 | https://prosemirror.net/docs/ref/#view.EditorProps | 2026-10-08 | Versão do prosemirror-view não informada; lidos 100000 de 282448 caracteres | handleDOMEvents, handleKeyDown e ordem de combinação das props |
| 9 | https://prosemirror.net/docs/guide/ | 2026-10-08 | Versão não informada | Fluxo evento, transação, estado; dispatchTransaction e updateState |
| 10 | https://lexical.dev/docs/concepts/commands | 2026-10-08 | Versão não informada | createCommand, dispatchCommand, prioridades e retorno true interrompe a propagação |
| 11 | https://lexical.dev/docs/concepts/listeners | 2026-10-08 | Versão não informada | registerRootListener e demais registros devolvem função de remoção |
| 12 | https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/components/App.tsx | 2026-10-08 | Ramo master; packages indicou 0.18.0; 12053 linhas baixadas por curl | handleCanvasPointerDown, maybeCleanupAfterMissingPointerUp e emissor de remoção de ouvintes |
| 13 | https://react.dev/reference/react/StrictMode | 2026-10-08 | Sem versão declarada; cita ref callbacks com cleanup do React 19 | Ciclo extra de setup, cleanup e setup em effects e ref callbacks |
| 14 | https://react.dev/blog/2024/12/05/react-19 | 2026-10-08 | React 19 estável, 2024-12-05 | Callback de ref pode devolver função de cleanup |
| 15 | https://react.dev/reference/react/useEffectEvent | 2026-10-08 | Versão não informada | Restrições de uso de useEffectEvent dentro de Effects |
| 16 | https://legacy.reactjs.org/blog/2020/10/20/react-v17.html | 2026-10-08 | React 17, 2020-10-20 | Handlers anexados ao contêiner raiz e não ao document |
| 17 | https://react.dev/reference/react-dom/client/createRoot | 2026-10-08 | Sem versão declarada | root.unmount remove handlers e estado da árvore |
| 18 | https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | 2026-10-08 | Baseline desde julho de 2015 | Opções signal, once, passive e capture |
| 19 | https://dom.spec.whatwg.org/#abortsignal | 2026-10-08 | Living Standard; lidos 100000 de 400851 caracteres | Ouvinte com signal já abortado não é adicionado; AbortSignal.any e timeout |
| 20 | https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static | 2026-10-08 | Baseline desde março de 2024 | AbortSignal.any aborta quando qualquer entrada abortar |
| 21 | https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture | 2026-10-08 | Sem data de revisão | setPointerCapture lança NotFoundError se o pointerId não está ativo |
| 22 | https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture | 2026-10-08 | Baseline desde julho de 2020 | releasePointerCapture e liberação implícita no pointerup |
| 23 | https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event | 2026-10-08 | Sem data de revisão | Evento lostpointercapture disparado quando a captura é liberada |
| 24 | https://www.w3.org/TR/pointerevents/ | 2026-10-08 | Working Draft Pointer Events Level 4 de 2026-10-08; lidos 100000 de 372869 caracteres | lostpointercapture disparado antes de eventos seguintes; a seção 8 de captura ficou fora do trecho lido |
| 25 | https://developer.chrome.com/docs/devtools/console/utilities | 2026-10-08 | Sem data na página | getEventListeners só existe no Console do DevTools |
| 26 | https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/DOMDebugger.pdl | 2026-10-08 | Versão do protocolo não exposta | DOMDebugger.getEventListeners com depth e pierce |
| 27 | https://chromedevtools.github.io/devtools-protocol/tot/DOMDebugger/ | 2026-10-08 | Não informada | não aberta: devolveu só um aviso de redirecionamento |
| 28 | https://playwright.dev/docs/api/class-cdpsession | 2026-10-08 | Série corrente | newCDPSession e send; página não declara restrição a Chromium |
| 29 | https://vitest.dev/api/vi.html#vi-gettimercount | 2026-10-08 | Vitest v5.0.3 | vi.getTimerCount e vi.useFakeTimers |
| 30 | https://vitest.dev/config/faketimers | 2026-10-08 | Vitest v5.0.3 | toFake padrão, toNotFake, loopLimit e shouldAdvanceTime |
| 31 | https://github.com/mafintosh/why-is-node-running | 2026-10-08 | Requer Node.js 20.11 ou superior na versão ESM | Lista handles ativos com arquivo e linha de criação |
| 32 | https://fast-check.dev/docs/advanced/race-conditions/ | 2026-10-08 | Descontinuações desde a v4.2.0; projeto usa 4.10.2 | fc.scheduler, scheduleFunction, waitIdle e limites declarados |
| 33 | https://github.com/developit/mitt | 2026-10-08 | Versão não informada | Barramento tipado com menos de 200 bytes gzip; on, off, emit e wildcard |
| 34 | https://github.com/ai/nanoevents | 2026-10-08 | Versão não informada | createNanoEvents; on devolve função de remoção; 108 bytes |
| 35 | https://stately.ai/docs/xstate | 2026-10-08 | XState v5 | createMachine, createActor, send e subscribe |
| 36 | https://stately.ai/docs/transitions | 2026-10-08 | XState v5 | Evento sem transição habilitada é descartado; transição proibida com forbidden |
| 37 | https://stately.ai/docs/invoke | 2026-10-08 | XState v5 | Ator invocado inicia ao entrar no estado e para ao sair |
| 38 | https://stately.ai/docs/inspection | 2026-10-08 | XState v5 | Opção inspect e eventos de inspeção |

## C7 — Undo e redo

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://github.com/ProseMirror/prosemirror-history/blob/master/src/history.ts | 2026-10-08 | Ramo master; repositório arquivado em 2026-04-01; registro npm informa 1.5.1 | Branch, Item, bookmark da seleção, closeHistory, agrupamento por tempo e adjacência; sem toJSON |
| 2 | https://code.haverbeke.berlin/prosemirror/prosemirror-history | 2026-10-08 | Não informada | Endereço para onde a página diz que o repositório foi movido; a nota não registra leitura |
| 3 | https://prosemirror.net/docs/ref/ | 2026-10-08 | Versão não declarada; seção prosemirror-history aberta com offset 200000 | history(config) com depth 100 e newGroupDelay 500; undo, redo, undoDepth |
| 4 | https://prosemirror.net/docs/ref/#state.EditorState.toJSON | 2026-10-08 | Versão não declarada | StateField.toJSON é opcional; sem ele o campo não é serializado |
| 5 | https://raw.githubusercontent.com/ProseMirror/prosemirror-history/master/README.md | 2026-10-08 | Ramo master | Descreve o módulo como plugin de undo e redo e remete à referência |
| 6 | https://lexical.dev/docs/concepts/history | 2026-10-08 | Versão não declarada; registro npm informa @lexical/history 0.52.0 | registerHistory, delay 300 ms, snapshots do EditorState com NodeMap compartilhado |
| 7 | https://raw.githubusercontent.com/facebook/lexical/main/packages/lexical-history/src/index.ts | 2026-10-08 | Ramo main | getMergeAction com ordem de decisão, maxDepth, esvaziamento do redo e dateNow injetável |
| 8 | https://raw.githubusercontent.com/facebook/lexical/main/packages/lexical/src/LexicalUpdateTags.ts | 2026-10-08 | Ramo main | Tags historic, history-push, history-merge, paste e cut |
| 9 | https://lexical.dev/docs/concepts/transforms | 2026-10-08 | Versão não declarada | Cada ciclo de transform cria um novo EditorState e pode interferir em undo e redo |
| 10 | https://tldraw.dev/sdk-features/history | 2026-10-08 | Página editada em 2025-12-20 | Marcas de parada, três modos de run (record, record-preserveRedoStack, ignore), bailToMark e squashToMark |
| 11 | https://tldraw.dev/docs/editor | 2026-10-08 | Versão não declarada | Editor e armazenamento de registros |
| 12 | https://tldraw.dev/sdk-features/instance-state | 2026-10-08 | Página atualizada em 2026-01-31 | Instance state fora do undo por padrão; seleção no page state |
| 13 | https://tldraw.dev/sdk-features/store | 2026-10-08 | Versão não declarada | Escopos document, session e presence; listen com source |
| 14 | https://tldraw.dev/reference/editor/Editor | 2026-10-08 | Código da v5.5.1; registro npm informa tldraw 5.5.2 | Métodos do histórico do Editor: markHistoryStoppingPoint, bailToMark, squashToMark |
| 15 | https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/editor/managers/HistoryManager/HistoryManager.ts | 2026-10-08 | Ramo main | Pilhas imutáveis, diff pendente, reverseRecordsDiff e três estados do gravador |
| 16 | https://github.com/excalidraw/excalidraw/pull/7348 | 2026-10-08 | PR mesclado em 2024-04-17 | Store, Delta e History para undo e redo em multiplayer |
| 17 | https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/element/src/store.ts | 2026-10-08 | Ramo master | CaptureUpdateAction (IMMEDIATELY, NEVER, EVENTUALLY) e getObservedAppState |
| 18 | https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/history.ts | 2026-10-08 | Ramo master | HistoryDelta, record e laço de undo até haver mudança visível |
| 19 | https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api | 2026-10-08 | Registro npm informa @excalidraw/excalidraw 0.18.1 | updateScene com captureUpdate e history.clear |
| 20 | https://www.figma.com/blog/how-figmas-multiplayer-technology-works/ | 2026-10-08 | Publicado em 2019-10-16 | Princípio: desfazer muito, copiar e refazer até o presente não altera o documento |
| 21 | https://www.figma.com/blog/multiplayer-editing-in-figma/ | 2026-10-08 | Post de 2016 | não aberta: apareceu só em busca |
| 22 | https://replicache.notion.site/Redoing-undo-c0183b91d12c4272a3482e3233cc2890 | 2026-10-08 | Não informada | não aberta: o WebFetch devolveu apenas a palavra Notion; nenhuma afirmação depende dela |
| 23 | https://liveblocks.io/blog/how-to-build-undo-redo-in-a-multiplayer-environment | 2026-10-08 | Publicado em 2022-06-09 | Inversos por usuário em vez de snapshots; pause e resume em mouse down e mouse up |
| 24 | https://immerjs.github.io/immer/patches | 2026-10-08 | Versão não declarada; registro npm informa immer 11.1.21 | enablePatches, produceWithPatches, applyPatches; patches não são mínimos |
| 25 | http://mutative.js.org/docs/getting-started/performance/ | 2026-10-08 | Mutative v1.3.0 contra Immer v10.1.3 | Benchmark do autor em ops por segundo (M1 Max, Node 22.11.0) |
| 26 | http://mutative.js.org/docs/api-reference/create/ | 2026-10-08 | Atualizada em 2023-12-10 | create com enablePatches, pathAsArray e arrayLengthAssignment |
| 27 | http://mutative.js.org/docs/api-reference/apply/ | 2026-10-08 | Atualizada em 2025-05-22 | apply(state, patches) e opção mutable desde 1.2.0 |
| 28 | https://docs.yjs.dev/api/undo-manager | 2026-10-08 | Versão não declarada; registro npm informa yjs 13.6.33 | UndoManager: captureTimeout 500 ms, trackedOrigins, stopCapturing, eventos stack-item |
| 29 | https://raw.githubusercontent.com/yjs/yjs/main/src/utils/UndoManager.js | 2026-10-08 | Ramo main | Regra de mescla por tempo e limpeza do redoStack |
| 30 | https://refactoring.guru/design-patterns/command | 2026-10-08 | Catálogo de padrões, sem data legível | Command com backup ou operação inversa; prós e contras |
| 31 | https://refactoring.guru/design-patterns/memento | 2026-10-08 | Catálogo de padrões, sem data legível | Memento: snapshots imutáveis; custo de RAM |
| 32 | https://fast-check.dev/docs/advanced/model-based-testing/ | 2026-10-08 | Versão do pacote não declarada | fc.commands, fc.modelRun e replayPath; modelo simplificado |
| 33 | https://fast-check.dev/docs/api/interfaces/ICommand/ | 2026-10-08 | Desde 1.5.0 | Contrato de check, run e toString |
| 34 | https://hypothesis.readthedocs.io/en/latest/stateful.html | 2026-10-08 | Versão não declarada (latest) | RuleBasedStateMachine, precondition e invariant após cada passo |
| 35 | https://github.com/stevana/quickcheck-state-machine | 2026-10-08 | Versão não declarada | Haskell: modelo, pré-condições, pós-condições e execução paralela |

## C8 — Classes de defeito (parte A)

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://github.com/facebook/memlab | 2026-10-08 | Sem versão na página | Cenário (url, action, back, leakFilter), CLI e API do memlab |
| 2 | https://facebook.github.io/memlab/docs/intro | 2026-10-08 | Sem versão visível | memlab dirige o navegador com Puppeteer e gera retainer traces |
| 3 | https://registry.npmjs.org/memlab/latest | 2026-10-08 | memlab 2.0.5 | Versão atual; puppeteer e puppeteer-core fixados em 24.31.0 |
| 4 | https://facebook.github.io/memlab/docs/how-memlab-works | 2026-10-08 | Documentação de memlab 2.x | Três snapshots (baseline, target, final); heurísticas de DOM destacado e Fiber desmontado |
| 5 | https://facebook.github.io/memlab/docs/api/api/src/functions/findLeaks | 2026-10-08 | Documentação de @memlab/api | Assinatura de findLeaks e funções exportadas |
| 6 | https://facebook.github.io/memlab/docs/api/api/src/functions/run | 2026-10-08 | Documentação de @memlab/api | run equivale a aquecer, takeSnapshots e findLeaks |
| 7 | https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/js_protocol.pdl | 2026-10-08 | Ramo master (domínio experimental) | Comandos de HeapProfiler: collectGarbage, takeHeapSnapshot |
| 8 | https://playwright.dev/docs/api/class-cdpsession | 2026-10-08 | Marcas até v1.59 | CDPSession: send, on, detach; criado por context.newCDPSession |
| 9 | https://playwright.dev/docs/api/class-browsertype | 2026-10-08 | Pacote @playwright/test | Opção channel; connectOverCDP só para Chromium |
| 10 | https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory | 2026-10-08 | Sem data de revisão visível | Exige contexto seguro e isolamento de origem cruzada; experimental |
| 11 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry | 2026-10-08 | Sem data de revisão visível | Garantias e não garantias do callback de FinalizationRegistry |
| 12 | https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots | 2026-10-08 | Atualizada em 2024-02-09 | Vista Comparison, Retainers e objetos retidos por nós destacados |
| 13 | https://react.dev/reference/react/Profiler | 2026-10-08 | Documentação do React 19 | Parâmetros de onRender; Profiler desativado em produção |
| 14 | https://react.dev/reference/dev-tools/react-performance-tracks | 2026-10-08 | Documentação do React 19.x | Trilhas de desempenho e build react-dom/profiling com alias no Vite |
| 15 | https://registry.npmjs.org/react-scan/latest | 2026-10-08 | react-scan 0.5.7 | Peer dependencies React 16.8 a 19; bin react-scan |
| 16 | https://github.com/aidenybai/react-scan | 2026-10-08 | Sem versão na página | API scan e onRender; CLI só init; sem menção a CI |
| 17 | https://developer.chrome.com/docs/web-platform/long-animation-frames | 2026-10-08 | Atualizada em 2024-10-14 | Long Animation Frames: limiar de 50 ms, campos e suporte Chrome e Edge 123 |
| 18 | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming | 2026-10-08 | Sem data na captura | blockingDuration, renderStart, styleAndLayoutStart e scripts; disponibilidade limitada |
| 19 | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming | 2026-10-08 | Sem data na captura | Limiar de 50 ms e atribuição por contexto |
| 20 | https://web.dev/articles/inp | 2026-10-08 | Sem data visível no retorno | Definição e limiares do INP (bom até 200 ms, ruim acima de 500 ms) |
| 21 | https://registry.npmjs.org/web-vitals/latest | 2026-10-08 | web-vitals 6.2.3 | Versão da biblioteca que mede INP |
| 22 | https://registry.npmjs.org/axe-core/latest | 2026-10-08 | axe-core 4.14.0 | Versão atual |
| 23 | https://registry.npmjs.org/@axe-core/playwright/latest | 2026-10-08 | @axe-core/playwright 4.13.0 | Depende de axe-core ~4.13.0; peer playwright-core >=1.0.0 |
| 24 | https://github.com/dequelabs/axe-core/blob/develop/doc/API.md | 2026-10-08 | Ramo develop (axe-core 4.14) | Opções runOnly, rules, resultTypes e iframes; formato dos resultados |
| 25 | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md | 2026-10-08 | axe-core 4.14 | IDs de regras de ARIA, rótulos, contraste, foco e target-size |
| 26 | https://github.com/dequelabs/axe-core/blob/develop/README.md | 2026-10-08 | Ramo develop | Suporte limitado a JSDOM; color-contrast não funciona em JSDOM; 57% dos problemas WCAG |
| 27 | https://github.com/nickcolley/jest-axe | 2026-10-08 | Sem versão na página | Contraste desligado em JSDOM; temporizadores falsos quebram o axe |
| 28 | https://playwright.dev/docs/accessibility-testing | 2026-10-08 | Documentação do Playwright | AxeBuilder, withTags, exclude e disableRules; testes automáticos não pegam todas as violações |
| 29 | https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ | 2026-10-08 | APG, rodapé com copyright 2026; sem versão do padrão | Teclado e ARIA de menu e menubar |
| 30 | https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ | 2026-10-08 | APG | Tabindex móvel e conflito de setas com slider e spinbutton |
| 31 | https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ | 2026-10-08 | APG | Teclado e ARIA de tree view; aria-level, aria-setsize e aria-posinset |
| 32 | https://www.w3.org/WAI/ARIA/apg/patterns/slider/ | 2026-10-08 | APG | Teclado e ARIA de slider |
| 33 | https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/ | 2026-10-08 | APG | Teclado e ARIA de spinbutton |
| 34 | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ | 2026-10-08 | APG | Retenção de foco, Esc, retorno do foco e aria-modal |
| 35 | https://registry.npmjs.org/i18next-parser/latest | 2026-10-08 | i18next-parser 9.4.0, obsoleto | Substituto indicado: i18next-cli |
| 36 | https://github.com/i18next/i18next-parser | 2026-10-08 | Repositório arquivado em 2026-02-22 | failOnUpdate, failOnWarnings e extração de chaves de t() |
| 37 | https://registry.npmjs.org/@lingual/i18n-check/latest | 2026-10-08 | @lingual/i18n-check 0.9.5 | Versão do pacote |
| 38 | https://github.com/lingualdev/i18n-check | 2026-10-08 | Sem versão na página | Chaves ausentes, inválidas, não usadas e indefinidas; formatos ICU e i18next |
| 39 | https://registry.npmjs.org/eslint-plugin-i18next/latest | 2026-10-08 | eslint-plugin-i18next 6.1.5 | devDependency eslint ^9.6.0; sem peerDependencies listadas |
| 40 | https://github.com/edvardchen/eslint-plugin-i18next | 2026-10-08 | Sem versão na página | Regra no-literal-string; configuração flat; sem autocorreção |
| 41 | https://raw.githubusercontent.com/edvardchen/eslint-plugin-i18next/master/docs/rules/no-literal-string.md | 2026-10-08 | Documentação da regra, eslint-plugin-i18next 6.x | Modos jsx-text-only, jsx-only e all; opções words, jsx-attributes e callees |
| 42 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules | 2026-10-08 | Baseline desde setembro de 2019 | Categorias de plural devolvidas por select |
| 43 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat | 2026-10-08 | Baseline desde setembro de 2017 | Formatação de número por locale; sem análise de texto |
| 44 | https://www.w3.org/International/articles/article-text-size.en.html | 2026-10-08 | Artigo W3C Internationalization | Tabela de expansão de texto por tamanho da fonte em inglês |
| 45 | https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API | 2026-10-08 | Baseline desde janeiro de 2020 | document.fonts, ready e eventos loading, loadingdone e loadingerror |
| 46 | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust | 2026-10-08 | Baseline desde setembro de 2023 | Descritor size-adjust |
| 47 | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display | 2026-10-08 | Sem data na captura | Valores block, swap, fallback e optional e seus períodos |
| 48 | https://web.dev/articles/optimize-cls | 2026-10-08 | Sem data na captura | Fontes web causam deslocamento de layout; mitigação com font-display optional |
| 49 | https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio | 2026-10-08 | Sem data na captura | Fatores que mudam devicePixelRatio; monitoramento por matchMedia |
| 50 | https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport | 2026-10-08 | Baseline desde agosto de 2021 | Propriedades e eventos do VisualViewport |
| 51 | https://developer.mozilla.org/en-US/docs/Web/CSS/zoom | 2026-10-08 | Baseline 2024 (maio de 2024) | Propriedade CSS zoom padronizada; afeta o layout |
| 52 | https://developer.mozilla.org/en-US/docs/Web/API/Element/currentCSSZoom | 2026-10-08 | Baseline 2026 (março de 2026) | currentCSSZoom é o produto dos zoom do elemento e dos ancestrais |
| 53 | https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | 2026-10-08 | Sem data na captura | Retângulo relativo ao viewport; muda com a rolagem |
| 54 | https://registry.npmjs.org/@mdn/browser-compat-data/latest | 2026-10-08 | @mdn/browser-compat-data 8.1.5; instalado no projeto 8.1.2 | Versão e campos exports |
| 55 | https://github.com/mdn/browser-compat-data/blob/main/schemas/compat-data-schema.md | 2026-10-08 | Ramo main | Esquema __compat, support, version_added, status e partial_implementation |
| 56 | https://github.com/mdn/browser-compat-data/blob/main/README.md | 2026-10-08 | Ramo main | Uso em Node, chaves de topo e __meta |
| 57 | https://registry.npmjs.org/eslint-plugin-compat/latest | 2026-10-08 | eslint-plugin-compat 7.0.2 | Depende de @mdn/browser-compat-data ^6.1.1; peer eslint ^9 ou ^10; Node >=22 |
| 58 | https://github.com/amilajack/eslint-plugin-compat | 2026-10-08 | Sem versão na página | Detecta APIs web; usa browserslist; polyfills |
| 59 | https://registry.npmjs.org/doiuse/latest | 2026-10-08 | doiuse 6.0.6 | Dependências caniuse-lite e browserslist |
| 60 | https://github.com/anandthakker/doiuse | 2026-10-08 | Sem versão na página | Lint de CSS contra caniuse; detecção descrita como ingênua |
| 61 | https://registry.npmjs.org/stylelint-no-unsupported-browser-features/latest | 2026-10-08 | Versão 8.1.2 | Plugin do stylelint sobre doiuse 6.0.6; peer stylelint >=16.0.2 |
| 62 | https://github.com/browserslist/browserslist | 2026-10-08 | Sem versão na página | Sintaxe de consultas, configuração, CLI e fonte caniuse-lite |
| 63 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON | 2026-10-08 | Sem data na captura | Number.EPSILON igual a 2^-52, adequado só perto de magnitude 1 |
| 64 | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_values_and_units/Numeric_data_types | 2026-10-08 | Sem data na captura | 1in igual a 96px; em e rem; percentual relativo |
| 65 | https://www.w3.org/TR/css-values-4/ | 2026-10-08 | CSS Values and Units Level 4; lidos os primeiros 100000 caracteres | Precisão e faixa definidas pela implementação; px canônico; arredondamento de bordas |
| 66 | https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/primitives/utils.ts | 2026-10-08 | Ramo main em 2026-10-08 | approximately, toPrecision, toDomPrecision, toFixed e isSafeFloat |
| 67 | https://tldraw.dev/sdk-features/snapping | 2026-10-08 | Sem versão na página | Limiar de encaixe em pixels de tela convertido pelo zoom |
| 68 | https://tldraw.dev/sdk-features/performance | 2026-10-08 | Página editada em 2026-01-31 | Culling, sinais reativos, lotes, cache de geometria e maxShapesPerPage 4000 |
| 69 | https://github.com/excalidraw/excalidraw | 2026-10-08 | Sem versão na página | Sem documentação de desempenho nem de benchmark visível; testes com Vitest |
| 70 | https://registry.npmjs.org/@tanstack/react-virtual/latest | 2026-10-08 | @tanstack/react-virtual 3.14.13 | Peer react até 19 |
| 71 | https://tanstack.com/virtual/latest/docs/introduction | 2026-10-08 | TanStack Virtual v3 | Biblioteca headless; useVirtualizer |
| 72 | https://web.dev/articles/virtualize-long-lists-react-window | 2026-10-08 | Atualizada em 2019-04-29 | Janelamento reduz nós do DOM; overscan |
| 73 | https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing | 2026-10-08 | Publicado em 2015-03-20, atualizado em 2025-05-07 | Custo de layout cresce com o DOM; layout síncrono forçado |
| 74 | https://vitest.dev/guide/browser/ | 2026-10-08 | Vitest v5.0.3 | Modo browser com provider Playwright e instances |
| 75 | https://github.com/capricorn86/happy-dom | 2026-10-08 | Sem versão na página | Descrição de navegador sem interface gráfica; nada sobre layout |
| 76 | https://github.com/capricorn86/happy-dom/wiki/Element | 2026-10-08 | Wiki do happy-dom | Não menciona getBoundingClientRect nem layout |

## C8 — Classes de defeito (parte B)

| # | URL | Acesso | Versão ou data do conteúdo | O que sustentou |
|---|---|---|---|---|
| 1 | https://github.com/cure53/DOMPurify | 2026-10-08 | README cita DOMPurify v3.4.16 | ALLOWED_TAGS, USE_PROFILES, SAFE_FOR_XML, ganchos e Trusted Types; esquemas de URI permitidos |
| 2 | https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API | 2026-10-08 | Limited availability em 2026-10-08 | setHTML, setHTMLUnsafe, parseHTML e configuração padrão |
| 3 | https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML | 2026-10-08 | Página MDN | setHTML remove script, iframe, object, embed, use e atributos de evento; aviso de XSS por mutação |
| 4 | https://developer.mozilla.org/en-US/docs/Web/API/Sanitizer | 2026-10-08 | Limited availability | allowElement, removeElement, removeUnsafe e get |
| 5 | https://blog.openreplay.com/html-sanitizer-api-overview/ | 2026-10-08 | Publicado em 2026-03-19 | Firefox 148 e Chrome 146 entregam a API; detecção de recurso com DOMPurify como reserva |
| 6 | https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API | 2026-10-08 | Baseline 2026 Newly available desde fevereiro de 2026 | Diretivas require-trusted-types-for e trusted-types, lista de sinks e políticas |
| 7 | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP | 2026-10-08 | Página MDN | Nonce por resposta, modo somente relatório, report-to e Trusted Types na CSP |
| 8 | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe | 2026-10-08 | Página MDN | Tokens de sandbox; allow-scripts com allow-same-origin anula o isolamento; srcdoc |
| 9 | https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage | 2026-10-08 | Página MDN | Verificação de origin e source, targetOrigin e origem opaca |
| 10 | https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html | 2026-10-08 | Sem data na página | Mensagens entre janelas com igualdade exata de origem; sandbox |
| 11 | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-src | 2026-10-08 | Baseline desde agosto de 2016 | Diretiva frame-src e cadeia de reserva child-src e default-src |
| 12 | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src | 2026-10-08 | Página MDN | Nonce único por requisição, hashes, strict-dynamic e manipuladores inline bloqueados |
| 13 | https://w3c.github.io/webappsec-csp/ | 2026-10-08 | Editor's Draft de 16 de setembro de 2026 | Herança da lista de CSP pelo policy container; o item 7.8 não foi lido |
| 14 | https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria | 2026-10-08 | Página MDN | Limites por navegador, QuotaExceededError, persist e despejo |
| 15 | https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate | 2026-10-08 | Baseline desde setembro de 2023 | quota, usage e usageDetails aproximados |
| 16 | https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event | 2026-10-08 | Página MDN | Evento storage só dispara em outros documentos |
| 17 | https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API | 2026-10-08 | Baseline desde março de 2022 | Canal entre contextos de mesma origem com clone estruturado |
| 18 | https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API | 2026-10-08 | Baseline desde março de 2022 | navigator.locks.request, modos, ifAvailable, steal e signal |
| 19 | https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/blocked_event | 2026-10-08 | Página MDN | Evento blocked do IndexedDB |
| 20 | https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/versionchange_event | 2026-10-08 | Página MDN | Evento versionchange do IndexedDB |
| 21 | https://zod.dev/api | 2026-10-08 | zod 4.x | Chaves desconhecidas, discriminatedUnion, preprocess, codec, default, prefault e catch |
| 22 | https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Prototype_pollution | 2026-10-08 | Página MDN | Poluição de protótipo: __proto__ em JSON.parse não polui, mescla posterior sim; mitigações |
| 23 | https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API | 2026-10-08 | Página MDN | Requisitos de segurança e divergências entre navegadores |
| 24 | https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem | 2026-10-08 | Baseline 2024 Newly available desde junho de 2024 | ClipboardItem, supports, leitura e escrita |
| 25 | https://developer.chrome.com/blog/web-custom-formats-for-the-async-clipboard-api | 2026-10-08 | Atualizado em 2022-08-01 | Prefixo web (com espaço) nos tipos MIME; Chromium 104 |
| 26 | https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event | 2026-10-08 | Página MDN | clipboardData no evento paste; eventos sintéticos não alteram o documento |
| 27 | https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer | 2026-10-08 | Página MDN | getData, setData, items, types e files |
| 28 | https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API | 2026-10-08 | Página MDN | Sequência de eventos; preventDefault em dragover; acesso ao armazenamento de dados |
| 29 | https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/clipboard.ts | 2026-10-08 | Ramo master em 2026-10-08 | Serialização JSON de elementos no clipboard; cadeia de reserva na cópia |
| 30 | https://github.com/tldraw/tldraw/blob/main/packages/tldraw/src/lib/ui/hooks/useClipboardEvents.ts | 2026-10-08 | Ramo main em 2026-10-08 | Tipos e fluxo do clipboard do tldraw |
| 31 | https://tldraw.dev/sdk-features/clipboard | 2026-10-08 | Documentação do SDK | Carga versão 3 em text/html, prioridade de colagem e ganchos |
| 32 | https://developer.chrome.com/docs/web-platform/page-lifecycle-api | 2026-10-08 | Atualizado em 2023-12-01 | Seis estados do ciclo de vida; hidden como último evento confiável |
| 33 | https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event | 2026-10-08 | Página MDN | visibilitychange como ponto de salvar estado |
| 34 | https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event | 2026-10-08 | Página MDN | beforeunload não confiável; registrar só com alterações não salvas |
| 35 | https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event | 2026-10-08 | Página MDN | pagehide e a propriedade persisted; compatível com bfcache |
| 36 | https://playwright.dev/docs/test-snapshots | 2026-10-08 | Direitos de 2026; sem número de versão | toHaveScreenshot, threshold, maxDiffPixels, stylePath e variação entre sistemas |
| 37 | https://playwright.dev/docs/api/class-pageassertions | 2026-10-08 | Documentação do Playwright | Padrões das opções: animations disabled, caret hide, threshold 0.2, scale css |
| 38 | https://playwright.dev/docs/api/class-page | 2026-10-08 | Cita versões até v1.64 | page.emulateMedia com colorScheme, forcedColors (v1.15), reducedMotion (v1.12) e contrast (v1.51) |
| 39 | https://html-validate.org/ | 2026-10-08 | html-validate v11.16.2 | Validador HTML5 offline |
| 40 | https://html-validate.org/usage/index.html | 2026-10-08 | html-validate v11.x | CLI, configuração e preset html-validate:recommended |
| 41 | https://validator.github.io/validator/ | 2026-10-08 | Nu Html Checker; cita 20.6.30 (30 de junho de 2020) como último número de versão | vnu.jar exige Java 17 ou mais novo |
| 42 | https://validator.github.io/validator/docs/vnu.1.html | 2026-10-08 | Manual do vnu | Opções --format json, --errors-only, --also-check-css e código de saída 1 |
| 43 | https://react.dev/reference/react-dom/client/createRoot | 2026-10-08 | Documentação react-dom 19, sem número de versão | onCaughtError, onUncaughtError e onRecoverableError |
| 44 | https://react.dev/reference/react/Component | 2026-10-08 | Documentação do React 19, sem número de versão | Limites de erro e o que não capturam |
| 45 | https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event | 2026-10-08 | Página MDN | Evento error e window.onerror |
| 46 | https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event | 2026-10-08 | Página MDN | Evento unhandledrejection e preventDefault |
| 47 | https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | 2026-10-08 | Página MDN | Erro de loop completed with undelivered notifications |
| 48 | https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API | 2026-10-08 | Baseline 2026 Newly available desde março de 2026 | Tipos de relatório, ReportingObserver e Reporting-Endpoints |
| 49 | https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver | 2026-10-08 | Baseline 2026 Newly available | Construtor, types, buffered, observe e takeRecords |
| 50 | https://docs.sentry.io/platforms/javascript/enriching-events/breadcrumbs/ | 2026-10-08 | Versão não informada na página | Breadcrumbs automáticos, addBreadcrumb e beforeBreadcrumb |
| 51 | https://opentelemetry.io/docs/languages/js/getting-started/browser/ | 2026-10-08 | Sem números de versão na página | Instrumentação de navegador experimental; pacotes disponíveis |
| 52 | https://vite.dev/config/build-options | 2026-10-08 | Vite v8.3.3 | build.sourcemap true, inline ou hidden |
| 53 | https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md | 2026-10-08 | Versão não informada | Seções forbidden, allowed e required; no-circular; reachable e orphan |
| 54 | https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md | 2026-10-08 | Série 18.x (exemplo mostra 18.0.0, texto cita 18.3.0) | CLI, tipos de saída, código de saída, baseline e TypeScript |
| 55 | https://github.com/javierbrea/eslint-plugin-boundaries | 2026-10-08 | README; documentação da v7.1.0 | Plugin de fronteiras para ESLint |
| 56 | https://www.jsboundaries.dev/docs/rules/ | 2026-10-08 | eslint-plugin-boundaries 7.1.0 | Regras ativas e obsoletas |
| 57 | https://github.com/pahen/madge | 2026-10-08 | Versão não mostrada na página | Detecção de ciclos e suporte a TypeScript |
| 58 | https://github.com/ts-arch/ts-arch | 2026-10-08 | Pacote npm tsarch; versão não mostrada | Regras de arquitetura ao estilo ArchUnit; exemplos só com Jest |
| 59 | https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing | 2026-10-08 | Baseline 2026 Newly available | isComposing durante composição de IME |
| 60 | https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events | 2026-10-08 | Baseline desde julho de 2020 | pointerType, pointercancel e captura de ponteiro |
| 61 | https://www.w3.org/International/articles/inline-bidi-markup/ | 2026-10-08 | Artigo W3C, sem data na captura | dir, dir auto, bdi e caracteres de isolamento |
| 62 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion | 2026-10-08 | Baseline desde janeiro de 2020 | Valores no-preference e reduce |
| 63 | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors | 2026-10-08 | Página MDN | Efeitos do modo forced-colors e forced-color-adjust |
| 64 | https://community.owasp.org/attacks/Regular_expression_Denial_of_Service_-_ReDoS | 2026-10-08 | Página OWASP Community | Retrocesso catastrófico e padrões típicos de ReDoS |
| 65 | https://ota-meshi.github.io/eslint-plugin-regexp/rules/no-super-linear-backtracking.html | 2026-10-08 | Regra desde a v0.13.0 do eslint-plugin-regexp | Regra no-super-linear-backtracking e opção report potential |
| 66 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse | 2026-10-08 | Página MDN | Date.parse com ISO sem horário em UTC e formatos dependentes da implementação |
| 67 | https://playwright.dev/docs/emulation | 2026-10-08 | Documentação do Playwright | Opções locale, timezoneId, colorScheme e permissions |

## Lacunas registradas pelas notas

- C1: campos dos nós do JSON de ariaSnapshotJSON não foram descritos; a seção de locator.ariaSnapshotJSON não foi localizada.
- C1: funcionamento do ts-morph 28 sobre TypeScript 7 e versão exata do compilador empacotado no @ts-morph/common 0.29.0.
- C1: comportamento do API Extractor 7.59.4 com TypeScript 6.0.3, e a diferença de --local frente ao CI.
- C1: versão de Node do projeto frente às exigências do dependency-cruiser 18.5.0 e do Knip 6.40.0.
- C1: API de listagem de comandos em Lexical e de componentes em Builder.io não documentadas nas páginas lidas; atributos do OUIA não mostrados.
- C1: nenhum custo de execução foi medido no projeto; datas divergentes do anúncio do TypeScript 6.0; o artigo The First Decade of GUI Ripping só apareceu em busca e não foi aberto; nenhum post de empresa sobre inventário automatizado de funcionalidades foi encontrado.
- C2: nenhuma fonte afirma teste do runner do Stryker contra Vitest 5.0.1; é preciso execução-piloto.
- C2: nenhuma fonte traz tempos típicos do Stryker nem custo por comando do fast-check; ambos precisam de medição no projeto.
- C3: documentação de bddgen e defineBddConfig do playwright-bdd não foi lida (a página abriu só com o título).
- C3: a página dedicada de documentação viva do Cucumber retornou 404; o artigo de Harel (1987) é PDF sem texto.
- C3: acesso ao language service pelo ts-morph e hierarquia de chamadas no ts-morph não confirmados; uso de fromTransition com xstate/graph não documentado.
- C3: posts de engenharia de Figma, Excalidraw, Framer e Webflow sobre modos de interação não foram encontrados.
- C3: tamanho em bundle real do xstate com tree shaking e tempo do LanguageService no repositório não medidos.
- C4: precisão do canvas de Node (@napi-rs/canvas) contra o Chrome do Windows não verificada; o Pretext 0.0.9 não declara suporte a Node nem ao Windows.
- C4: nenhuma medição própria da diferença entre largura lida da fonte e layout do navegador; hinting do DirectWrite no Windows sem fonte aberta.
- C4: a documentação consultada do happy-dom não declara nada sobre layout; os valores de layout lidos no código-fonte são zero.
- C4: as páginas de Yoga e do código-fonte divergem sobre free e freeRecursive; a conferência precisa ser feita no pacote instalado.
- C5: comportamento de arraste do rótulo, Shift e unidades no Figma, Webflow, Framer e tldraw sem fonte aberta; a página do Elementor abriu sem o corpo; Webstudio redirecionou para a página inicial.
- C5: lista de componentes do Radix Primitives não aberta; Escape em React Aria e Base UI sem confirmação; Enter e Escape no painel Styles do Chrome DevTools sem documentação.
- C5: artigo original de QuickCheck (2000) não pôde ser lido; do CSS Values 4 foram lidos só os primeiros 100000 de 253104 caracteres.
- C6: a seção 8 de captura do Pointer Events Level 4 não foi lida; ordem de lostpointercapture e efeito de remover o elemento capturador não confirmados.
- C6: restrição de CDP a Chromium no Playwright não confirmada em página lida.
- C6: destroy do plugin do ProseMirror e cleanup de fromCallback no XState não foram lidos.
- C6: versões exatas de ProseMirror, Lexical, mitt, nanoevents e XState não aparecem nas páginas abertas.
- C7: nenhum artigo dedicado a testes de propriedade de undo e redo foi lido; o post do Figma de 2016 e a nota do Replicache não foram lidos.
- C7: as páginas de tldraw lidas não documentam RecordsDiff nem a profundidade máxima das pilhas; os números de benchmark do Mutative são do autor da biblioteca.
- C7: nenhuma fonte lida documenta histórico persistido ao salvar e abrir.
- C8 (parte A): a página de asserções de memória do memlab retornou 404; o tipo RunOptions do memlab não foi aberto.
- C8 (parte A): compatibilidade do eslint-plugin-i18next com eslint 10 e do axe-core com happy-dom 20.x não documentada; sem fonte sobre precisão numérica no Figma; sem fonte sobre react-scan em CI.
- C8 (parte B): suporte do Safari à Sanitizer API e a setHTML não verificado; suporte de Firefox e Safari aos formatos personalizados do clipboard não verificado.
- C8 (parte B): item 7.8 da especificação CSP (herança em srcdoc) não lido; assinatura de page.clock do Playwright não aberta.
- C8 (parte B): versões exatas de madge, ts-arch e Sentry não informadas; opções da API programática do html-validate e regras de stylelint para propriedades lógicas não abertas.
