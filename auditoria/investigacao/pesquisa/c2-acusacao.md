# C2 — Acusação automática de quebra em segundos ou minutos e prova de que o detector detecta

Data de acesso a todas as fontes: 2026-10-08. Cada fonte foi aberta com WebFetch. Onde a página não informa a versão do pacote, isso está registrado na própria entrada.

Convenção: "Fato documentado" vem da fonte aberta. "Avaliação" é opinião minha para este projeto (React 19.3.0, Vite 8.3.0, Vitest 5.0.1, fast-check 4.10.2, happy-dom 20.14.5, Windows).

## 1. Versões e existência dos pacotes (consulta ao registro npm)

Fonte: https://registry.npmjs.org/vitest/latest, https://registry.npmjs.org/fast-check/latest, https://registry.npmjs.org/@fast-check/vitest/latest, https://registry.npmjs.org/@stryker-mutator/vitest-runner/latest. Conteúdo lido em 2026-10-08 (campos de versão do registro).

Fato documentado:
- Vitest 5 existe. A versão mais recente no registro é 5.0.3 (o projeto usa 5.0.1). Peer dependency de `vite`: `^6.4.0 || ^7.0.0 || ^8.0.0`. Engines de Node: `^22.12.0 || ^24.0.0 || >=26.0.0`.
- fast-check: versão mais recente 4.10.2 (igual à do projeto). Engines de Node: `>=12.17.0`.
- `@fast-check/vitest` 0.5.0: peer dependency `vitest` `^4.1.0 || ^5.0.0`; depende de `fast-check` `^3.0.0 || ^4.0.0`. Compatível com Vitest 5.
- `@stryker-mutator/vitest-runner` 10.0.0: peer dependency `vitest` `>=2.0.0` e `@stryker-mutator/core` na versão exata 10.0.0; engines de Node `>=22.0.0`. A faixa `>=2.0.0` admite Vitest 5 no nível de instalação.

Lacuna: nenhuma fonte aberta afirma teste do runner do Stryker contra Vitest 5. O que existe de declaração explícita é Vitest 4 (versão 9.4.0 do core, 2025-11-23) e correção para Vitest 4.1 (9.6.1, 2026-04-10). Compatibilidade real com Vitest 5.0.1 precisa de execução experimental no projeto.

## 2. Vitest 5: o que mudou e comandos de seleção de testes

### 2.1 Guia de migração para Vitest 5
URL: https://vitest.dev/guide/migration.html. Conteúdo: Vitest 5.0.3 (seletor de versão da página).

Fato documentado (itens que afetam este tema):
- Exige Vite maior ou igual a 6.4.0 e Node maior ou igual a 22.12.0.
- `testNamePattern` (`-t`) passa a comparar o nome completo com separador ` > ` em vez de espaço. Filtros por nome escritos para Vitest 4 precisam usar o novo separador.
- `clearMocks` passa a ser `true` por padrão.
- Asserções assíncronas não aguardadas (`resolves`, `rejects`, `toMatchFileSnapshot`) passam a falhar o teste.
- Os reporters `json` e `junit` gravam em arquivo por padrão, não no stdout.
- Artefatos vão para o diretório `.vitest`.
- Ambientes DOM (`jsdom`, `happy-dom`) propagam atribuições globais para a window.
- Títulos de teste usam `pretty-format` em vez de `loupe`.
- `@vitest/runner` está deprecated; entradas como `vitest/reporters`, `vitest/runners`, `vitest/suite` foram removidas.
- A página de migração não menciona mudança em `threads`, `singleThread` ou `pool` (relevante para o runner do Stryker, ver seção 4).

### 2.2 CLI do Vitest
URL: https://vitest.dev/guide/cli.html. Conteúdo: Vitest 5.0.3.

Fato documentado:
- `vitest related <arquivos>`: executa só os testes que cobrem a lista de arquivos-fonte. Funciona com imports estáticos e não funciona com imports dinâmicos. Caminhos relativos à raiz. Como o modo watch é o padrão, scripts de hook precisam de `--run`.
- `vitest list`: imprime os testes que casam com os filtros, sem executá-los. `--json` (stdout ou `--json=./arquivo.json`), `--filesOnly` (só arquivos). No Vitest 5 os arquivos são analisados estaticamente, sem execução; `--no-static-parse` executa os arquivos; `--static-parse-concurrency` ajusta a concorrência (padrão `os.availableParallelism()`).
- `--changed [since]`: testes afetados pelos arquivos alterados; padrão `false`; aceita `HEAD~1`, hash de commit ou branch como `origin/main`.
- `--shard <índice>/<total>`: divide por arquivo de teste; incompatível com `--watch`.
- `--bail <n>`: encerra após n testes com falha; padrão 0.
- `--project` / `-p`: seleciona projetos, aceita curinga e negação com `!`.
- `--reporter`: default, agent, minimal, blob, verbose, dot, json, tap, tap-flat, junit, tree, hanging-process, github-actions.

### 2.3 Opção `changed` e `forceRerunTriggers`
URL: https://vitest.dev/config/changed. Conteúdo: Vitest 5.0.3.

Fato documentado: sem valor, `--changed` considera mudanças não commitadas (staged e unstaged). Com `HEAD~1`, as do último commit. Se um arquivo listado em `forceRerunTriggers` mudar, a suíte inteira roda; por padrão mudanças no arquivo de configuração do Vitest e no `package.json` rodam a suíte completa. A página não descreve o uso de module graph.

### 2.4 Recursos: watch e module graph
URL: https://vitest.dev/guide/features.html. Conteúdo: Vitest 5.0.3.

Fato documentado: no modo watch o Vitest percorre o module graph do Vite e executa só os testes relacionados ao arquivo modificado, no estilo do HMR. `--standalone` mantém o processo vivo sem executar até haver mudança. Há sharding por `--shard` com `--reporter=blob` e `--merge-reports`. Há in-source testing em bloco `if (import.meta.vitest)`.

### 2.5 Filtragem e desempenho
URLs: https://vitest.dev/guide/filtering.html e https://vitest.dev/guide/improving-performance.html. Conteúdo: Vitest 5.0.3.

Fato documentado:
- Filtros por nome de arquivo (trecho do caminho), por `-t`, por linha (nome completo do arquivo seguido de dois-pontos e o número da linha, sem intervalos) e por tags (`{ tags: ['frontend'] }` com `--tags-filter=frontend`). Filtros por `-t`, tags, `.only` e `.skip` são aplicados por arquivo: o Vitest ainda carrega cada arquivo. A flag `--experimental.preParse` descobre nomes de teste sem execução completa.
- Desempenho: `pool` padrão `forks`; `isolate: false` (`--no-isolate`) evita recriar o ambiente por arquivo e acelera bastante, mas só é seguro sem efeitos colaterais entre testes; `fileParallelism: false` reduz inicialização; `fsModuleCache` persiste transformações em disco (exemplo da página: segunda execução de 8,75 s para 5,90 s); `NODE_COMPILE_CACHE=<diretório>` guarda bytecode V8 entre execuções (desabilitado automaticamente com cobertura `v8`); `happy-dom` costuma ser mais barato que `jsdom` na inicialização.
- A página de desempenho não menciona `--changed` nem `related`.

### 2.6 `test.each` e `test.for`
URL: https://vitest.dev/api/test#test-for. Conteúdo: Vitest 5.0.3.

Fato documentado: `test.each(tabela)(nome, fn)` espalha cada linha em argumentos posicionais; `test.for(tabela)(nome, fn, contexto?)` entrega a linha inteira e recebe o `TestContext` como segundo argumento (útil para `expect` local em testes concorrentes). Ambos aceitam array de arrays, array de objetos e template literal. Cada linha vira um teste separado, com título formatado por `%s`, `%d`, `%i`, `%j`, `%#`, `$campo`.

## 3. fast-check 4.x: testes baseados em modelo

### 3.1 Fontes abertas
- https://fast-check.dev/docs/advanced/model-based-testing/ (página sem número de versão; rodapé "Last updated Aug 18, 2026").
- https://fast-check.dev/docs/api/functions/commands/ , https://fast-check.dev/docs/api/functions/modelRun/ , https://fast-check.dev/docs/api/functions/asyncModelRun/ , https://fast-check.dev/docs/api/functions/scheduledModelRun/ (páginas de API; só informam "Since x.y.z" de introdução, sem versão do pacote).
- https://fast-check.dev/docs/api/interfaces/CommandsContraints/ (página sem versão; hash de commit do site 014cc87e).
- https://fast-check.dev/docs/api/interfaces/Parameters/ (cita "Since 4.10.0" na propriedade `plugins`, portanto corresponde a 4.10 ou posterior).
- https://fast-check.dev/docs/advanced/race-conditions/ (cita descontinuações "desde v4.2.0").
- https://fast-check.dev/docs/configuration/global-settings/ , https://fast-check.dev/docs/core-blocks/runners/ , https://fast-check.dev/docs/configuration/user-definable-values/.
- https://fast-check.dev/blog/2025/03/10/whats-new-in-fast-check-4-0-0/ (conteúdo: 4.0.0, 2025-03-10).
- https://raw.githubusercontent.com/dubzzz/fast-check/main/packages/fast-check/src/check/model/ModelRunner.ts (código do ramo main, sem versão).
- https://fast-check.dev/docs/tutorials/setting-up-your-test-environment/property-based-testing-with-vitest/ (página sem versão).

### 3.2 Fatos documentados
APIs e assinaturas:
- `fc.commands(commandArbs, constraints?)` devolve `Arbitrary<Iterable<Command<Model, Real>>>` (síncrono) ou `Arbitrary<Iterable<AsyncCommand<Model, Real, CheckAsync>>>` (assíncrono). A página informa que o shrinker é adaptado a comandos e deve reduzir casos de falha melhor que `fc.array`.
- `CommandsContraints` (o nome do tipo tem essa grafia na documentação): `maxCommands: number` (disponível desde 1.11.0; a documentação recomenda `size`), `size: SizeForArbitrary` (desde 2.22.0), `replayPath: string` (desde 1.11.0; usado só para reproduzir, junto com `{ seed, path }` do `assert`), `disableReplayLog: boolean` (padrão `false`; impede o `replayPath` na saída).
- `fc.modelRun(s, cmds): void` com `s: ModelRunSetup<InitialModel, Real>` (função que devolve `{ model, real }`).
- `fc.asyncModelRun(s, cmds): Promise<void>`, aceita setup síncrono ou assíncrono.
- `fc.scheduledModelRun(scheduler, s, cmds): Promise<void>` (desde 1.24.0): roda os comandos assíncronos passando-os pelo scheduler para explorar intercalações.
- Interface do comando: `check(model)` indica se o comando é aplicável no estado atual; `run(model, real)` age sobre o sistema real e atualiza o modelo, e lança erro quando o sistema real diverge do modelo; `toString()` serializa o comando para o relatório.
- Ordem de execução (código-fonte): o setup é chamado uma vez; os comandos são percorridos em ordem; para cada um, `check(model)` vem antes de `run`; se `check` devolve falso o comando é ignorado sem erro; exceções de `run` se propagam. No trecho lido não há etapa de limpeza (sem `finally`).
- Invariantes depois de cada comando: não existe gancho próprio na documentação nem no código lido. O mecanismo documentado é lançar erro dentro de `run`.

Reprodução e shrinking:
- Em falha, o log mostra `seed`, `path` e `replayPath`. Para reproduzir o contraexemplo mínimo: passar o `replayPath` a `fc.commands` e `seed` e `path` a `fc.assert`, com `endOnFailure: true`.
- O shrinking reduz apenas os comandos efetivamente executados. Exemplo da página: gerados `[A,B,C,A,A,C]`, executados `[A,-,C,A,-,-]`, resultado do shrink `[A,C,A]`. O `replayPath` registra esse histórico.

Parâmetros do runner (`Parameters`, página de 4.10 ou posterior):
- `numRuns` padrão 100; `seed` padrão `Date.now()` (doubles viram inteiros de 32 bits); `path` (recebe o `counterexamplePath` e exige `seed`); `endOnFailure`; `verbose` (padrão `VerbosityLevel.None`); `examples` (valores executados antes dos gerados, contam dentro de `numRuns`); `maxSkipsPerRun`; `skipAllAfterTimeLimit` em ms; `interruptAfterTimeLimit`, `markInterruptAsFailure` e `timeout` constam como obsoletas.
- `fc.configureGlobal(opções)` redefine por completo as configurações globais; para acrescentar, usar `fc.configureGlobal({ ...fc.readConfigureGlobal(), ...novas })`; `fc.resetConfigureGlobal()` restaura. Para Vitest, a página manda registrar a chamada em um arquivo de `setupFiles`.
- `RunDetails` de `fc.check` inclui `failed`, `interrupted`, `counterexample`, `counterexamplePath`, `error`, `errorInstance`.

Scheduler (página de condições de corrida, linha 4.x a partir de 4.2.0):
- `fc.scheduler({ act })`, `fc.schedulerFor(ordem)` (ordem fixa de resolução), `s.scheduleFunction(fn)`, `s.schedule(promise)`, `s.scheduleSequence(...)`, `s.waitNext(n)`, `s.waitFor(promise)`, `s.waitIdle()`. `waitAll`, `count` e `waitOne` estão descontinuados desde 4.2.0. `waitFor` pode esperar chamadas ainda não agendadas.
- Em `scheduledModelRun`, nem `check` nem `run` devem depender da conclusão de outras tarefas agendadas; podem disparar novas sem aguardá-las. Gatilhos assíncronos que o fast-check não controla dificultam reproduzir falhas.

Mudanças da 4.0.0 (2025-03-10): datas inválidas incluídas por padrão; erros com `cause`; `record` e `dictionary` incluem objetos sem protótipo; remoção de `.noBias`, `.noShrink`, `uuidV` e dos arbitrários de string antigos em favor de `fc.string`; remoção de `withDeletedKeys` de `record`; scheduler mais preciso.

Integração com Vitest: o pacote `@fast-check/vitest` oferece `test.prop` (notação de registro ou de tupla) e o parâmetro `g`; a página manda usar `fc.configureGlobal({ seed })` para repetir uma falha. A página não documenta `numRuns` para esse pacote.

### 3.3 Técnica: teste de modelo para a store do núcleo (como se faz)
Passos concretos (Avaliação, montados sobre as APIs acima):
1. Definir o modelo puro: um objeto pequeno com o que importa (conjunto de ids de blocos, árvore pai/filho, tamanho das pilhas de undo e redo, seleção). O sistema real é a store com `dispatch(comando, EditContext)`.
2. Escrever uma classe por comando do editor, implementando `fc.Command<Model, Real>`: `check` garante a pré-condição (por exemplo, só remover um bloco existente), `run` chama `dispatch` e atualiza o modelo, `toString` imprime o comando com argumentos.
3. Chamar a função de invariantes do documento (esquema, ids únicos, sem órfãos, pai/filho, pilhas de undo, ida-e-volta de serialização) no fim de todo `run`. Como o fast-check não oferece gancho após cada comando, a chamada deve estar num helper compartilhado pelas classes, ou num envoltório que decora cada comando. Essa decisão é minha, não do fast-check.
4. Gerar com `fc.commands([...arbitrários de comando], { size: '+1' })` e rodar com `fc.modelRun(() => ({ model, real }), cmds)` dentro de `fc.property` e `fc.assert`.
5. Propriedades que o modelo cobre bem: undo seguido de redo devolve o mesmo documento; undo de n comandos devolve o documento inicial; mesma sequência de comandos em portas diferentes dá o mesmo resultado; render incremental igual a render do zero (se o modelo comparar o DOM).
6. Fixar `seed` e `numRuns` pequenos no modo rápido (por exemplo, 30 execuções com seed fixa, para acusação reproduzível em segundos) e uma rodada maior com seed rotativa em execução periódica. Em falha, gravar `seed`, `path` e `replayPath` no relatório, para repetir exatamente.
7. Comandos assíncronos (digitação pendente que grava depois): `fc.asyncModelRun`; intercalações com o scheduler: `fc.scheduledModelRun(s, setup, cmds)`.

Custo: proporcional a `numRuns` vezes o tamanho da sequência vezes o custo do `dispatch`. A store do núcleo roda em memória, sem navegador, então a ordem de grandeza é de milissegundos por comando. Valor concreto para este projeto exige medição; nenhuma fonte fornece esse número.

O que detecta: violações de invariante do documento depois de qualquer sequência de comandos, divergência entre modelo e store, falhas de undo/redo, e a sequência mínima que reproduz (shrinking). Falhas de intercalação com `scheduledModelRun`.
O que não detecta: defeitos de layout e medição que só o navegador calcula; defeitos em comandos que nenhum arbitrário gera; invariantes que o modelo não expressa. O modelo precisa ser simples o bastante para não repetir o bug do código real.

Compatibilidade: fast-check 4.10.2 é a versão mais recente do registro e o `@fast-check/vitest` 0.5.0 aceita Vitest 5.

## 4. StrykerJS e teste de mutação

### 4.1 Fontes abertas
- https://stryker-mutator.io/docs/stryker-js/vitest-runner/ (página sem versão do pacote; marca "Since v7.0").
- https://stryker-mutator.io/docs/stryker-js/incremental/ (disponível desde o Stryker 6.2; sem versão atual).
- https://stryker-mutator.io/docs/stryker-js/configuration/ (sem versão atual).
- https://stryker-mutator.io/docs/stryker-js/disable-mutants/ (desde 5.4).
- https://stryker-mutator.io/docs/mutation-testing-elements/supported-mutators/ e https://stryker-mutator.io/docs/mutation-testing-elements/mutant-states-and-metrics/ (sem versão).
- https://github.com/stryker-mutator/stryker-js/releases (núcleo 10.0.0 de 2026-08-14 até 9.0.1).

### 4.2 Fatos documentados
Runner do Vitest:
- O plugin não inclui o `vitest`; a versão mínima está no `package.json` do pacote (peer `>=2.0.0`).
- `vitest.configFile` (padrão `undefined`), `vitest.dir` (desde 7.1) e `vitest.related` (padrão `true`: roda só os testes relacionados aos arquivos mutados, via `related` do Vitest). Deve ser desligado se os testes não importam o código-fonte diretamente.
- Opções fixadas pelo Stryker: `threads: true`, `singleThread: true`, `watch: false`, `coverage.enabled: false` (a cobertura é do Stryker), `bail: 1` (ou 0 com `disableBail: true`), `includeTaskLocation: true` (para o modo incremental identificar testes alterados), `onConsoleLog` que descarta saída.
- `coverageAnalysis` é ignorada: o plugin sempre usa `perTest`.
- Limitações: só há suporte a `threads: true`; Browser Mode do Vitest não é suportado; para in-source testing é preciso excluir o bloco com `// Stryker disable all`.
- A página não cita `inPlace`, `forks` nem `ignoreStatic` na seção do runner.

Núcleo e configuração:
- `mutate` aceita globs e faixas de linhas (arquivo, dois-pontos, linha inicial, hífen, linha final; colunas opcionais após cada linha); faixa não combina com glob na mesma entrada.
- `coverageAnalysis`: `off`, `all`, `perTest` (padrão `perTest`; exige testes independentes e que possam rodar em ordem aleatória).
- `concurrency` padrão: n-1 se houver mais de 4 núcleos, senão n; aceita percentual.
- `timeoutMS` padrão 5000 e `timeoutFactor` padrão 1,5; `thresholds` padrão `high: 80`, `low: 60`, `break: null` (com `break` definido, abaixo do valor o processo sai com código 1).
- `ignoreStatic` padrão `false` (exige `perTest`); `disableTypeChecks` padrão `true` desde a 7.0; `checkers` (por exemplo `typescript`) descartam mutantes inválidos antes de executar; `dryRunOnly`; `tempDirName` padrão `.stryker-tmp`; `inPlace` padrão `false`; `mutator.excludedMutations`.
- Uma opção passada pela linha de comando substitui por completo o valor do arquivo de configuração.

Modo incremental:
- Ativado por `--incremental` ou `"incremental": true`. `--force` reexecuta todos os mutantes do escopo, e combina com `--mutate` aplicado a uma faixa de linhas (exemplo da página: linhas 5 a 7 de um arquivo). `incrementalFile` padrão: `reports/stryker-incremental.json`.
- Faz um diff entre o código e os testes atuais e a versão registrada no arquivo. Mutante Killed é reaproveitado se o teste responsável existe e não mudou. Mutante não Killed é reaproveitado se nenhum teste novo o cobre e nenhum teste mudou. O dry run continua obrigatório.
- Limite: só monitora arquivos mutados e arquivos de teste; mudanças em dependências, variáveis de ambiente, arquivos de snapshot e documentação não são detectadas. Vitest tem suporte completo à detecção de testes alterados. Mutantes estáticos não têm cobertura, então mudanças de teste não os reativam.
- Ao interromper (Ctrl+C), os resultados parciais são gravados e a próxima execução continua de onde parou.

Mutadores do StrykerJS (página de mutadores): ArithmeticOperator, ArrayDeclaration, BlockStatement, BooleanLiteral, ConditionalExpression, EqualityOperator, LogicalOperator, MethodExpression, ObjectLiteral, OptionalChaining, Regex, StringLiteral, UnaryOperator, UpdateOperator. A página, como lida, marca o mutador de atribuição como suportado só no Stryker.NET.

Estados e métricas: Killed, Survived, No coverage, Timeout (conta como detectado), Runtime error e Compile error (fora do score), Ignored. Fórmulas: detectados = killed + timeout; válidos = detectados + survived + no coverage; mutation score = detectados dividido por válidos vezes 100; score baseado em código coberto = detectados dividido por (detectados + survived) vezes 100.

Comentários de desativação: `// Stryker disable next-line NomeDoMutador: motivo`, `// Stryker disable all`, `// Stryker restore all`. Mutantes desativados aparecem como `ignored` e não afetam o score.

Versões do núcleo: 9.1.0 (2025-08-30) trouxe suporte a `vitest related`; 9.4.0 (2025-11-23) suporte a Vitest 4; 9.5.1 (2026-02-02) suporte a fixtures do Vitest (`test.extend`) e correções de EBUSY no Windows; 9.6.0 concorrência em percentual; 9.6.1 (2026-04-10) correção de contagem de hits e cobertura para Vitest 4.1; 10.0.0 (2026-08-14) exige Node 22 ou superior, adiciona mutador de expressões vazias e filtragem de mutantes. As notas não citam Vitest 5.

### 4.3 Técnica: medir a taxa de detecção com mutação (como se faz)
Passos (Avaliação):
1. Instalar `@stryker-mutator/core@10.0.0` e `@stryker-mutator/vitest-runner@10.0.0` como dependências de desenvolvimento (versões exatas, porque o runner exige o core na mesma versão). O projeto roda Node 22 ou superior no Vitest 5, o que também satisfaz o Stryker 10.
2. Criar um `stryker.config.json` dedicado ao detector, sem tocar o `vitest.config` principal: `testRunner: "vitest"`, `vitest.configFile` apontando para uma configuração do Vitest que contenha só o conjunto rápido (testes de modelo e de invariantes), `mutate` limitado ao núcleo (`src/core/store/store.ts`, `src/core/ports/`, `src/editor/input/pending.ts`), `incremental: true`, `thresholds.break` definido, `checkers: ["typescript"]` para descartar mutantes que não compilam.
3. Reduzir o custo: `coverageAnalysis` já é `perTest` no runner; `vitest.related` fica `true`; usar `--mutate` com faixa de linhas para mutar só a faixa que o diff tocou; cada execução seguinte usa `--incremental` e reaproveita o arquivo incremental.
4. A taxa de detecção é o mutation score. Os sobreviventes são a lista de lacunas: cada mutante Survived ou No coverage aponta a linha e o mutador que o conjunto rápido não percebe.
5. Complemento próprio: um catálogo de falhas injetadas à mão (por exemplo, undo que esquece de restaurar a seleção, dispatch que ignora o contexto capturado, rascunho que não leva o breakpoint). Cada injeção é um patch aplicado e revertido por script; o detector precisa acusar cada uma com a funcionalidade e a causa. A taxa de detecção do catálogo é injeções acusadas dividido por injeções aplicadas.

Custo: nenhuma fonte aberta traz tempo típico em minutos. A documentação indica os redutores de custo (perTest, related, incremental, faixas de linhas, concurrency). O tempo para este projeto só se obtém executando; a suíte atual leva mais de uma hora, então o Stryker não deve rodar sobre ela inteira.

O que detecta: testes que passam mesmo com o código quebrado em pontos específicos; mede a força do detector. O que não detecta: falhas de mutantes equivalentes (comportamento idêntico, ficam como Survived sem serem lacuna), defeitos de interação que nenhum mutante de operador representa, mudanças em dependências e em snapshots (limite documentado do modo incremental).

Risco aberto de compatibilidade (Avaliação baseada em fato): o runner fixa `threads: true` e `singleThread: true`, e o guia de migração do Vitest 5 não lista mudança nessas opções, mas nenhuma fonte afirma que o runner foi exercitado com Vitest 5.0.1. Fazer uma execução-piloto de poucos mutantes antes de depender dele.

### 4.4 Literatura de mutação em larga escala
URL: https://research.google/pubs/state-of-mutation-testing-at-google/ (Petrović e Ivanković, ICSE-SEIP 2018; conteúdo: resumo do artigo).
Fato documentado: a mutação é baseada em diff, só nas linhas alteradas; descarta linhas sem cobertura de statement e linhas "arid" por heurística dependente da linguagem; seleciona poucos mutantes, para resultados fáceis de avaliar; é usada por cerca de 6.000 engenheiros, mais de 14.000 autores, e processa cerca de 30% dos diffs com cobertura de statement calculada. Taxa de aceitação e número de mutantes por mudança não constam no resumo.
Avaliação: a ideia de mutar só o diff corresponde, no StrykerJS, a `--mutate` com faixa de linhas mais `--incremental`.

## 5. Seleção de testes por impacto (literatura)

### 5.1 Google TAP
URL: https://abseil.io/resources/swe-book/html/ch23.html (Software Engineering at Google, capítulo 23).
Fato documentado: o TAP é o build contínuo do monorepo; seleciona testes pela análise do grafo de dependências a jusante de cada mudança, mantido pelo sistema de build; trata mais de 50.000 mudanças únicas e mais de 4 bilhões de casos de teste por dia; no presubmit roda testes rápidos e confiáveis, o restante no postsubmit; uma mudança que passa o presubmit tem probabilidade acima de 95% de passar o resto; espera média cerca de 11 minutos; em lote com falha, o TAP separa as mudanças e reexecuta cada uma isoladamente, e há busca binária e rollback automático quando a confiança é alta.

URL: https://research.google/pubs/taming-google-scale-continuous-testing/ (Memon e outros, ICSE-SEIP 2017; só o resumo foi lido). Fato documentado: poucos testes falham, e os que falham tendem a estar mais próximos do código testado; código alterado com frequência e recentemente por mais de três desenvolvedores quebra mais. O método de seleção e números não constam no resumo.

### 5.2 Meta, Predictive Test Selection
URL: https://arxiv.org/abs/1810.05286 (Machalica e outros, 2018; conteúdo: resumo).
Fato documentado: seleção aprendida por aprendizado de máquina sobre dados históricos; trata não determinismo (flakiness); reduz o custo de infraestrutura de teste por um fator de dois; mantém mais de 95% das falhas individuais de teste reportadas e mais de 99,9% das mudanças defeituosas reportadas. O resumo não informa a fração de testes selecionados.

### 5.3 Microsoft, Test Impact Analysis
URL: https://learn.microsoft.com/en-us/azure/devops/pipelines/test/test-impact-analysis?view=azure-devops (página atualizada em 2026-05-07 segundo o metadado; escopo: Azure Pipelines com a tarefa Visual Studio Test).
Fato documentado: seleciona testes impactados, testes que falharam antes e testes novos; recai para rodar todos os testes quando não entende a mudança (exemplo: arquivos HTML ou CSS); permite rodar tudo com periodicidade configurada; aceita mapa de dependências escrito à mão (`TIA.UserMapFile`), que pode ser aproximado; escopo atual só código gerenciado em uma máquina, sem .NET Core. A página orienta validar a seleção rodando em sequência os testes impactados e depois todos, comparando as falhas.

### 5.4 Avaliação para este projeto
- As três fontes concordam em três elementos: um mapa teste-para-código (grafo de dependências no Google, histórico na Meta, cobertura dinâmica na Microsoft), um recuo seguro para a suíte completa quando a mudança não é compreendida, e uma verificação periódica contra a suíte completa.
- No Vitest 5, o mapa estático é o module graph que `vitest related` e `--changed` usam. Limite documentado: imports dinâmicos não são seguidos por `related`. Qualquer carga dinâmica de módulos no editor precisa de entrada manual no estilo do mapa de dependências da Microsoft.
- Arquivos que o grafo não vê (JSON de mensagens `en.json` e `pt-BR.json`, CSS, manifesto gerado por `tools/gen/generate.ts`) precisam entrar em `forceRerunTriggers` ou num mapa próprio, senão a seleção os ignora.
- A verificação do detector contra a suíte completa (rodar o subconjunto, depois tudo, e comparar as falhas) é a mesma prática recomendada pela página da Microsoft e é o jeito de medir a perda de detecção da seleção.

## 6. Invariantes em tempo de execução no build de desenvolvimento

### 6.1 Fontes abertas
- https://github.com/alexreardon/tiny-invariant (página sem versão).
- https://vite.dev/guide/env-and-mode (Vite v8.3.3 segundo a página).
- https://tldraw.dev/sdk-features/store e https://tldraw.dev/sdk-features/validation (páginas sem versão do pacote; `@tldraw/validate`).
- https://tldraw.dev/docs/persistence (página sem versão; só menciona migrações e o store).
- https://react.dev/reference/react/StrictMode (página sem versão explícita; o conteúdo trata de ref callbacks com cleanup, comportamento do React 19).

### 6.2 Fatos documentados
- tiny-invariant: `invariant(condition, message?)`, em que `message` é string ou função que devolve string; lança erro quando a condição é falsa. Com `NODE_ENV=production` a mensagem vira "Invariant failed"; a página recomenda plugin de bundler para descartar mensagens e tree-shaking. O erro continua sendo lançado em produção: a biblioteca não remove a verificação.
- Vite 8.3.3: `import.meta.env.DEV` é sempre o oposto de `PROD`; no build as constantes são substituídas estaticamente e o bloco `if (import.meta.env.DEV)` é removido por tree-shaking. `NODE_ENV` e `mode` são conceitos diferentes: `NODE_ENV=development vite build` dá `DEV` verdadeiro com `MODE` igual a `"production"`. O build e2e do projeto (`dist`) precisa dessa distinção para saber se as verificações estão ligadas.
- tldraw: o store valida registros contra um schema; o campo `validator` valida o registro inteiro (incluindo `id` e `typeName`) a cada escrita; se a validação falha, a escrita lança e nada é gravado; um `StoreSchema` próprio aceita `onValidationFailure` para corrigir ou substituir o registro; o schema padrão apenas registra o erro e relança. A documentação não diz que a validação mude entre desenvolvimento e produção: é descrita como sempre ativa. Efeitos colaterais do store (`side effects`) mantêm a consistência interna (exemplo: remover bindings quando um shape é excluído). Migrações são aplicadas ao carregar snapshots antigos.
- React StrictMode (somente desenvolvimento, não afeta produção): chama duas vezes o corpo do componente, as funções passadas a `useState`, aos setters, a `useMemo` e a `useReducer`, e métodos de classe; reexecuta ciclo extra de setup, cleanup, setup em effects e em ref callbacks (os effects só se o StrictMode estiver na raiz). O objetivo documentado é expor impureza (mutação de dados externos) e cleanup ausente.

### 6.3 Técnica: verificador de invariantes do documento em desenvolvimento (Avaliação)
Como se faz:
1. Uma função única `checkDocumentInvariants(doc)` que lança erro com mensagem contendo o nome da regra violada, o id do bloco e o comando que acabou de rodar (esquema válido por bloco, ids únicos, sem órfãos, pai/filho, pilhas de undo, ida-e-volta da serialização).
2. A store do núcleo chama essa função no fim de `dispatch` apenas dentro de `if (import.meta.env.DEV)`, que o Vite elimina no build de produção. O custo fica fora do usuário final.
3. A mesma função é chamada pelos testes de modelo (seção 3.3) e pelo teste e2e, de modo que a acusação aponta o comando que gerou o estado inválido no instante em que ele ocorre, não minutos depois quando outra funcionalidade lê o estado.
4. Padrão do tldraw: validar na escrita e recusar a escrita inválida (nada gravado). Padrão do StrictMode: executar o `dispatch` duas vezes com o mesmo comando sobre cópias e comparar resultados para provar determinismo e ausência de mutação do comando; isso é adaptação minha do princípio documentado, não uma API do React.

Custo: uma passagem sobre o documento por `dispatch` em desenvolvimento; em documentos profundos o custo cresce com o tamanho, então limitar a verificação completa ao modo de teste e usar verificação incremental (só blocos tocados) na sessão de desenvolvimento é decisão de projeto a medir.
Detecta: estado inválido no momento da escrita, em qualquer caminho de uso do editor, inclusive manual. Não detecta: defeitos que não alteram o documento (layout, foco, posição); build de produção não tem a verificação.

## 7. Contratos gerados de cenários (especificação por exemplo)

URL: https://en.wikipedia.org/wiki/Specification_by_example (conteúdo: artigo enciclopédico, sem versão).
Fato documentado: especificação por exemplo define requisitos e testes funcionais com exemplos realistas; práticas centrais incluem ilustrar requisitos com exemplos, automatizar testes a partir desses exemplos, validar com frequência e evoluir os exemplos para documentação viva; com validação automática, a especificação deixa de ficar desatualizada. O artigo atribui o nome a Martin Fowler (2004) e cita o uso anterior no projeto WyCash+ (Ward Cunningham, 1996), com o livro de Adzic (2011) como referência.

Técnica (Avaliação, usando APIs já documentadas):
1. Guardar cada cenário como dado (arquivo JSON ou TypeScript de tabela): estado inicial, sequência de comandos com seus `EditContext`, estado final esperado e nome da funcionalidade.
2. Gerar um teste por linha com `test.for(tabela)('funcionalidade: %s', ...)` do Vitest 5 (`test.for` recebe o `TestContext` com `expect` local). Cada título carrega o nome da funcionalidade, e a falha já acusa a funcionalidade.
3. Marcar os testes com tags (`{ tags: [...] }`) e filtrar com `--tags-filter` para rodar só a funcionalidade tocada. O filtro por tag é por arquivo, logo cada funcionalidade deve ter arquivo próprio para o filtro economizar tempo.
4. Os exemplos que o fast-check encontra por contraexemplo (`counterexample`, `seed`, `path`) viram novas linhas da tabela, e o parâmetro `examples` do `fc.assert` reexecuta essas linhas antes dos valores gerados (elas contam dentro de `numRuns`). Assim a especificação cresce com cada defeito achado.
Detecta: regressão de comportamento já conhecido, com nome da funcionalidade no título. Não detecta: comportamento que nenhum exemplo descreve.

Pact não foi pesquisado, conforme o escopo.

## 8. Conclusões e arquitetura sugerida (Avaliação)

1. Camada de acusação em segundos: testes de modelo do fast-check sobre a store do núcleo com seed fixa e `numRuns` pequeno, mais o verificador de invariantes chamado no fim de cada comando. Não depende de navegador. Em falha, o relatório traz `seed`, `path`, `replayPath` e a sequência mínima de comandos já reduzida pelo shrinking.
2. Camada de acusação em minutos: `vitest related <arquivos alterados>` (ou `--changed`) para rodar só os testes que importam o código tocado, com `forceRerunTriggers` listando os arquivos que o grafo não enxerga (mensagens, CSS, manifesto gerado), e recuo para a suíte completa quando o arquivo é desconhecido (regra da Microsoft). Rodar a suíte completa periodicamente e comparar as falhas com o subconjunto para medir a perda.
3. Apontar a funcionalidade: cenários como tabela com `test.for`, o nome da funcionalidade no título e em tag; mapa próprio de arquivo-fonte para funcionalidade, mantido no repositório, para listar a funcionalidade afetada antes de rodar.
4. Apontar a causa provável: o contraexemplo mínimo do fast-check mais o nome da regra de invariante violada mais o diff do arquivo tocado. A busca binária entre commits (prática do TAP para localizar o culpado) pode ser feita com `vitest related` por commit.
5. Prova de que o detector detecta: StrykerJS 10.0.0 com runner 10.0.0 restrito ao núcleo e ao conjunto rápido, `incremental` ligado, faixas de linhas do diff, `thresholds.break`; mais um catálogo de falhas injetadas à mão com taxa de detecção própria. Antes de adotar, uma execução-piloto prova que o runner funciona com Vitest 5.0.1, porque nenhuma fonte documenta essa combinação.
6. Limitações documentadas que o desenho precisa respeitar: `related` não segue imports dinâmicos; o modo incremental do Stryker ignora mudanças em dependências, variáveis de ambiente e snapshots; Vitest filtra por arquivo e ainda carrega cada arquivo; o runner do Stryker não suporta Browser Mode; valores medidos pelo navegador (layout, posição, foco) ficam fora de qualquer camada acima e continuam dependendo da medição com Playwright.
7. Não encontrei fonte com tempos típicos do Stryker nem com custo por comando do fast-check; esses dois números precisam ser medidos no projeto.
