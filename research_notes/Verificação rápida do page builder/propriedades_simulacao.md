# Testes por propriedades, por modelo, fuzz, diferenciais e simulação determinística para verificar rápido um editor com estado

Notas de pesquisa de 2026-10-21. As datas das fontes aparecem junto de cada item. Seis PDFs não puderam ser lidos como texto: o artigo de Jane Street na ICSE 2024 e os slides de Hughes em Chalmers vieram binários. Por isso, alguns números vêm de resumos e abstracts, e isso está indicado em cada caso.

## 1. Como funcionam o fast-check (TS), o Hypothesis stateful e a máquina de estados do QuickCheck, e o que encontraram

### Síntese
fast-check tem testes por modelo prontos para TS: `fc.commands` com `fc.modelRun`, `asyncModelRun` e `scheduledModelRun`. A falha encolhe até a menor sequência de comandos e se repete exatamente com `seed`, `path` e `replayPath`. Por padrão são 100 execuções. O Hypothesis segue os mesmos padrões (100 exemplos, 50 passos). O QuickCheck por máquina de estados tem os números industriais mais fortes: mais de 200 problemas no AUTOSAR da Volvo, 5 condições de corrida no dets e perda de dados no Dropbox.

### Achados com fonte
- `fc.commands(allCommands, { size: '+1' })` gera um cenário aleatório de comandos. A diferença para `array` é que ele "can efficiently shrink failing scenarios". Cada comando implementa `check(model)`, que funciona como precondição, `run(model, real)` e `toString()`. — [fast-check: Model-based testing](https://fast-check.dev/docs/advanced/model-based-testing/)
- Executores disponíveis:
  - `fc.modelRun(setup, cmds)`, só para código síncrono, com `setup` devolvendo `{ model, real }`;
  - `fc.asyncModelRun`, para comandos assíncronos;
  - `fc.scheduledModelRun`, que ordena o assíncrono por agendamento e dá "better detection of race conditions". — [fast-check: Model-based testing](https://fast-check.dev/docs/advanced/model-based-testing/)
- Repetição de uma falha: a saída informa `seed` (ex.: `670108017`), `path` (ex.: `"96:5"`) e `replayPath` (ex.: `"AAAAABAAE:VF"`). Para repetir só o contraexemplo mínimo, passe `{ seed, path, endOnFailure: true }` ao `assert` e `{ replayPath }` ao `fc.commands`. O `replayPath` registra quais comandos rodaram de fato; no exemplo da página, `[A,-,C,A,-,-]` vira `[A,C,A]`. — [fast-check: Model-based testing](https://fast-check.dev/docs/advanced/model-based-testing/)
- Parâmetros do executor, segundo a referência `Parameters`:
  - `numRuns`: padrão 100;
  - `seed`: padrão `Date.now()`;
  - `path`: exige `seed`;
  - `endOnFailure`: para na primeira falha, sem encolher;
  - `interruptAfterTimeLimit`: medido com `Date.now()`; a interrupção conta como sucesso, a menos que `markInterruptAsFailure` esteja ligado;
  - `timeout`: só funciona em código assíncrono;
  - `skipAllAfterTimeLimit`: corta um encolhimento longo demais;
  - `examples`: casos fixos rodados sempre.

  `interruptAfterTimeLimit`, `markInterruptAsFailure` e `timeout` constam como deprecated em favor de plugin. — [fast-check: Parameters](https://fast-check.dev/docs/api/interfaces/Parameters/)
- Usuários citados no README: jest, jasmine, fp-ts, io-ts, ramda, js-yaml e query-string. — [GitHub dubzzz/fast-check](https://github.com/dubzzz/fast-check)
- Defeitos reais listados no "track record":
  - jest: `toStrictEqual` não distingue 0 de 5e-324, e `toEqual` é assimétrico para Set (#7941, #7975);
  - js-yaml: saída inválida para inteiros negativos em binário;
  - query-string: o formato `bracket` com null é lido de volta errado, um defeito de ida e volta;
  - eemeli/yaml: espaços extras ou perdidos no parse;
  - javascript-stringify: `-0` vira `"0"`;
  - node-jsonwebtoken: chave `valueOf` lança TypeError;
  - também há itens em facebook/react #18661 e react-spectrum #2065;
  - a página afirma que fast-check achou a maior parte dos CVEs de prototype poisoning do lodash. — [fast-check: Track record](https://fast-check.dev/docs/introduction/track-record/)
- Hypothesis `RuleBasedStateMachine`:
  - `@rule` define uma ação; `@precondition`, `@invariant` (roda após cada passo) e `@initialize` completam a máquina;
  - `Bundle` guarda valores criados, como os IDs de blocos;
  - a falha é impressa como um programa curto de chamadas, quase Python, pronto para colar num teste. — [Hypothesis: Stateful tests](https://hypothesis.readthedocs.io/en/latest/stateful.html)
- Padrões do Hypothesis:
  - `max_examples` = 100, `stateful_step_count` = 50, `deadline` = 200 ms;
  - `derandomize` = False, mas True em CI;
  - as falhas ficam guardadas em `.hypothesis/examples` e voltam a rodar primeiro (fase `reuse`). — [Hypothesis: API reference](https://hypothesis.readthedocs.io/en/latest/reference/api.html)
- AUTOSAR/Volvo (Arts, Hughes e outros, 2015): mais de 3000 páginas de especificação viraram modelos QuickCheck, testaram várias implementações e expuseram "over 200 issues". Exemplo: uma pilha CAN que não mascarava o bit alto, mudando a prioridade da mensagem. — [Chalmers: Testing AUTOSAR software with QuickCheck](https://research.chalmers.se/publication/?id=219899); [Hughes, Experiences with QuickCheck (2016)](https://research.chalmers.se/en/publication/232550); [slides Erlang Factory](https://www.erlang-factory.com/upload/presentations/582/CertifyingyourcarwithErlang.pdf)
- dets/Mnesia (Hughes e Bolinder, Erlang Workshop 2011): 5 condições de corrida encontradas "with relatively little effort". Duas explicavam falhas vistas em produção. — [Chalmers: Testing a database for race conditions with QuickCheck](https://research.chalmers.se/publication/150540)
- Dropbox (Hughes, Pierce, Arts e Norell, ICST 2016): com um modelo testável de sincronizador, encontraram perda de dados (valor velho que persiste sem arquivo de conflito) em dois sincronizadores amplamente usados. O Dropbox reproduziu os casos. — [Mysteries of Dropbox (PDF)](https://www.cis.upenn.edu/~bcpierce/papers/mysteriesofdropbox.pdf); [Chalmers](https://research.chalmers.se/publication/232551); [resumo mjtsai 2015-12-21](https://mjtsai.com/blog/2015/12/21/property-based-testing-of-a-synchronization-service)
- LevelDB: um resumo secundário diz que um modelo simples achou um contraexemplo reduzido de 17 passos em minutos e, depois da correção do Google, outro de 31 passos, também em minutos. Não consegui confirmar numa fonte primária. — [hada.io (secundária)](https://hi.news.hada.io/topic?id=15708)

### Inferências
- Para o page builder, `fc.commands` com `fc.modelRun` síncrono sobre a store do núcleo é o encaixe direto. Os comandos seriam inserir, mover, apagar, editar estilo em breakpoint/estado, undo, redo, serializar e recarregar. O modelo pode ser uma árvore pura simples.
- `scheduledModelRun` serve para a interação entre rascunho pendente e toque (G2) se ela for assíncrona.
- Com `replayPath`, cada falha vira um teste de regressão determinístico.

### Lacunas
- Não obtive o número exato de passos e o tempo do LevelDB numa fonte primária: os slides de Hughes vieram em PDF binário.
- O blog de dubzzz não tem uma lista separada da página "track record".

## 2. Simulação determinística: FoundationDB, TigerBeetle VOPR, Antithesis e Jepsen

### Síntese
Os relatos convergem: determinismo por semente, mais injeção de falhas, mais tempo comprimido, faz achar e repetir bugs raros com rendimento alto. FoundationDB fala em cerca de um trilhão de CPU-hours; TigerBeetle, em cerca de 700× de compressão de tempo. Nenhuma das fontes que encontrei dá contagem oficial de bugs. A ideia vale para um editor de processo único: semente, relógio falso e fila de eventos controlada.

### Achados com fonte
- FoundationDB:
  - roda o cluster inteiro num processo de thread única, deterministicamente, com "perfect repeatability";
  - executa "tens of thousands of simulations every night", com estimativa de "roughly one trillion CPU-hours of simulation";
  - a razão é de cerca de 10:1 entre tempo real e tempo simulado;
  - injeta falhas de rede, máquina e datacenter e de disco cheio;
  - o "swizzle-clogging" acha bugs raros e profundos;
  - a equipe diz que sem a simulação o FDB "unlikely to exist";
  - a página não traz contagem de bugs. — [FoundationDB: Testing](https://apple.github.io/foundationdb/testing.html)
- TigerBeetle VOPR, no blog de 2023-07-11:
  - "3.3 seconds of VOPR simulation gives you 39 minutes of real-world testing time. An hour gives you a month. A day gives you 2 years.", ou seja, cerca de 700×;
  - "we run 10 of these VOPR simulators 24/7";
  - todo o I/O é simulado, com muitos clusters num só processo. — [TigerBeetle blog](https://tigerbeetle.com/blog/2023-07-11-we-put-a-distributed-database-in-the-browser)
- Na documentação do VOPR, relógio, rede e disco são substituídos, e um bug se repete com a semente mais o commit Git. — [TigerBeetle docs: VOPR](https://docs.tigerbeetle.com/about/vopr)
- Uma nota de terceiros cita "30 bugs" achados após construir o VOPR. Não verificado. — [HackMD (terceiros)](https://hackmd.io/@no0mTG4DTVi61wHzNybh_Q/r1GaPZ_Mzx.md)
- Antithesis: um hipervisor determinístico ("The Determinator") simula hardware, rede e tempo. Foi usado no etcd, cuja equipe diz que antes era difícil reproduzir as falhas dos seus testes de robustez por propriedades. — [etcd blog 2025](https://etcd.io/blog/2025/autonomus_testing_with_antithesis/); [SE Radio 685](https://se-radio.net/?p=9188)
- Jepsen trata o sistema como caixa-preta: gera carga, injeta partições, mata processos e muda relógios, depois confere o histórico contra a garantia anunciada. Achou bugs de correção em "dozens" de bancos. Não há contagem consolidada. — [jepsen.io/ethics](https://jepsen.io/ethics); [hoverbear: Common safety pitfalls found by Jepsen](https://hoverbear.org/blog/common-safety-pitfalls-found-by-jepsen/)
- Yjs é um exemplo de "simulação determinística" leve em JS:
  - `applyRandomTests(tc, mods, iterations, init)` cria 5 usuários num `TestConnector`;
  - a cada iteração, ~2% das vezes desconecta ou reconecta, ~1% esvazia todas as mensagens e ~50% entrega uma mensagem aleatória;
  - aplica uma mutação aleatória num usuário;
  - ao fim, `compare(users)` exige convergência total (conteúdo, deltas, state vectors, delete sets, struct stores, snapshots, `mergeUpdates`);
  - toda a aleatoriedade vem do `prng` de lib0 passado em `tc.prng`, portanto repetível. — [yjs/tests/testHelper.js](https://raw.githubusercontent.com/yjs/yjs/main/tests/testHelper.js)

### Inferências
- O editor é de processo único, então a "simulação" fica barata. O necessário:
  - um PRNG semeado para gerar comandos;
  - relógio falso, como `vi.useFakeTimers` para debounce e rascunhos pendentes;
  - uma fila de eventos (digitação, toque, troca de breakpoint ou seleção, fechar painel) intercalada de modo controlado.
- O modelo do Yjs (operações aleatórias, entregas ou interrupções aleatórias e um `compare` final forte) se aplica direto a G1 e G2: digitar, trocar o contexto no meio e conferir onde a escrita caiu.
- Rodar sem DOM em Node é o que dá a compressão de tempo: milhares de sequências por segundo contra segundos por spec Playwright.

### Lacunas
- Não há contagens oficiais de bugs do FoundationDB, do VOPR nem do Antithesis nas páginas primárias que li.

## 3. Testes diferenciais e oráculos: incremental contra do zero, editor contra exportação, ida e volta, undo

### Síntese
O teste diferencial tem o melhor histórico de rendimento: Csmith passou de 325 bugs em compiladores. Ele elimina o problema do oráculo porque compara duas implementações. Nos editores e CRDTs, o oráculo típico é a convergência entre réplicas (Yjs). A ida e volta de serialização é a fonte de vários bugs reais achados pelo fast-check (query-string, js-yaml, yaml).

### Achados com fonte
- Csmith (Yang, Chen, Eide e Regehr, PLDI 2011):
  - gerador aleatório de programas C comparado entre compiladores;
  - em três anos, mais de 325 bugs desconhecidos em GCC, LLVM e compiladores comerciais;
  - todos os compiladores testados travaram e geraram código errado silenciosamente;
  - 25 bugs do GCC foram classificados P1. — [PLDI'11 preprint](https://www-old.cs.utah.edu/~regehr/papers/pldi11-preprint.pdf)
- Contagens posteriores do Csmith: 344 no post de Regehr e cerca de 500 depois. O volume levou à criação do C-Reduce. — [blog.regehr.org](https://blog.regehr.org/?p=492); [Regehr homepage](https://users.cs.utah.edu/~regehr/)
- Ida e volta: o fast-check achou em query-string um formato `bracket` com null que "creates output the parser reads incorrectly", em js-yaml saída inválida, e em eemeli/yaml espaços alterados. — [fast-check: Track record](https://fast-check.dev/docs/introduction/track-record/)
- Ressalva dos oráculos diferenciais: muitas diferenças são legítimas (comportamento não especificado, caminhos distintos). É preciso normalizar antes de comparar. — [SmartOracle, arXiv 2601.15074](https://arxiv.org/html/2601.15074v1)
- CRDT/Automerge: o artigo do Automerge Model Checker (AMC) diz que otimizações de CRDT "can lead to bugs despite the use of test suites and fuzzing". O AMC verifica propriedades explorando dinamicamente. — [Cambridge repository (AMC, PaPoC)](https://www.repository.cam.ac.uk/items/442d9403-f405-405c-b276-ecc8dd9189f3)
- ProseMirror: o changelog do prosemirror-history 1.0.2 corrige histórico corrompido ao rebasear mudanças colaborativas. Isso é exatamente a classe de bug de undo que propriedades pegam. — [prosemirror-history](https://classic.yarnpkg.com/en/package/prosemirror-history)
- Num tópico do fórum do ProseMirror, um fuzzing "gremlins" pela API de transações não achou bugs; o autor nota que usar a API "feels like cheating". — [discuss.prosemirror.net](https://discuss.prosemirror.net/t/fuzz-monkey-gremlin-testing/384/2)
- Lexical: unit em Jest e e2e em Playwright (Chromium, Firefox, WebKit). A documentação não menciona fuzz. — [lexical.dev/docs/testing](https://lexical.dev/docs/testing)
- Um projeto NLnet (início 2026-08) planeja um plugin Lexical sobre o CRDT Peritext do json-joy, com fuzz nos entregáveis. Segundo o projeto, a integração atual perde ou embaralha texto ao dividir ou juntar parágrafos. — [NLnet: Lexical-json-joy](https://nlnet.nl/project/Lexical-json-joy/)

### Inferências
Oráculos concretos para o builder, todos baratos em Node:
1. **G7 incremental contra do zero:** depois de cada comando gerado, compare `renderIncremental(doc)` com `renderFromScratch(doc)`, normalizando a ordem de atributos e removendo marcas do editor.
2. **Editor contra exportação:** compare a árvore e os estilos computados do documento renderizado no editor (sem as camadas do editor) com o HTML/CSS exportado do mesmo `doc`.
3. **Ida e volta:** `parse(serialize(doc))` deep-equal a `doc` após cada passo; também `serialize(parse(s)) === s`, que pega casos como `-0`, null e strings especiais (o padrão dos bugs de query-string e yaml).
4. **Inversa do undo:** para qualquer prefixo P e comando C, `apply(P;C;undo) == apply(P)`, e `redo` após `undo` volta ao mesmo estado. A integridade (IDs únicos, sem órfãos, esquema válido) entra como invariante após cada passo, no estilo `@invariant` do Hypothesis.
5. **Convergência no estilo Yjs:** a mesma sequência aplicada por caminhos diferentes (comando a comando, como um `commandGroup` ou via patches gravados reaplicados) termina no mesmo documento.
6. **Contexto (G1):** o modelo registra em qual breakpoint, estado ou quadro-chave uma digitação começou. Após trocas aleatórias de contexto no meio, o valor deve estar só no contexto original.
7. **Mesmo resultado por todas as portas (G3):** as portas de um comando (botão, tecla, roda) são geradas sobre o mesmo estado; os resultados têm de ser iguais.

### Lacunas
- Não encontrei uma descrição pública da suíte de fuzz do Figma.
- Não encontrei fuzzers publicados para Slate ou Lexical; o projeto NLnet ainda é planejado.

## 4. Evidência empírica: testes por propriedades contra exemplos (Jane Street, Hypothesis/OOPSLA, Etna)

### Síntese
O melhor dado quantitativo vem de Ravi e Coblenz (OOPSLA 2025): cada teste por propriedade mata em média cerca de 50× mais mutantes que um teste unitário, e 76% das mutações caem nas primeiras 20 entradas. Rodadas curtas já rendem muito. Jane Street, em 30 entrevistas, aponta força em código complexo e fraqueza em escrever geradores e avaliar a eficácia. O Etna mostra que geradores sob medida acham bugs em milissegundos.

### Achados com fonte
- Ravi e Coblenz, "An Empirical Evaluation of Property-Based Testing in Python" (OOPSLA 2025, PACMPL v9):
  - corpus de 426 programas com Hypothesis e teste por mutação em 40 projetos;
  - em média, cada teste por propriedade acha cerca de 50× mais mutações que o teste unitário médio;
  - testes de exceção, pertinência e tipo foram mais de 19× mais eficazes que outros testes por propriedade;
  - 76% das mutações encontradas apareceram nas primeiras 20 entradas.

  Esses números vieram do resumo exibido na busca; não li o texto completo. — [SPLASH 2025/OOPSLA](https://2025.splashcon.org/details/OOPSLA/102); [DOI 10.1145/3764068](https://api.crossref.org/works/10.1145%2F3764068)
- Goldstein, Cutler, Dickstein, Pierce e Head, "Property-Based Testing in Practice" (ICSE 2024):
  - 30 entrevistas com usuários experientes na Jane Street;
  - pontos fortes: testar código complexo e dar confiança além dos testes convencionais;
  - a maior parte do uso cabe em poucos idiomas de alta alavanca;
  - fraquezas: a complexidade de escrever propriedades e geradores e a dificuldade de avaliar a eficácia dos testes;
  - trabalho futuro: desempenho, testes diferenciais, geração de entradas, redução de casos e avaliação de eficácia;
  - benefício secundário: as propriedades servem de especificação persistente. — [ICSE 2024](https://conf.researchr.org/details/icse-2024/icse-2024-research-track/90/Property-Based-Testing-in-Practice); [PDF Penn](https://cis.upenn.edu/~bcpierce/papers/icse24-pbt-in-practice.pdf); [DOI](https://doi.org/10.1145/3597503.3639581)
- Etna (arXiv 2603.27002, 2026):
  - protocolo: 10 tentativas com timeout de 60 s por tarefa;
  - QuickCheck com gerador sob medida resolveu todas as tarefas; o QuickCheck ingênuo (derivado do tipo) falhou em 43;
  - o sob medida foi mais rápido em 83 de 124 tarefas;
  - LeanCheck resolveu 82% e SmallCheck 35%; num BST, LeanCheck levou cerca de 0,01 s contra 26 s;
  - com gerador sob medida, o mais lento achou todos os bugs de BST (52 tarefas) em 130 ms, e no STLC levou de 300 ms a pouco mais de 2 s;
  - no Rocq/RBT, o gerador sob medida resolveu tudo em menos de 10 s, enquanto o derivado do tipo falhou em 23 tarefas. — [Etna, arXiv HTML v3](https://arxiv.org/html/2603.27002v3)

### Inferências
- Para rodar em segundos, o gerador precisa produzir só comandos válidos: escolher entre IDs que existem no modelo, como o `check` ou precondição do fast-check e os `Bundle` do Hypothesis. Gerador ingênuo desperdiça execuções (Etna: 43 tarefas falhadas).
- Como 76% das mutações caem nas 20 primeiras entradas, 100 execuções de cerca de 50 comandos já pegam a maior parte. Rodadas longas (`numRuns` alto ou por tempo) ficam para o fim de etapa.

### Lacunas
- Não consegui extrair do PDF da Jane Street números de tempo ou de tentativas usados internamente: veio binário.
- Não há estudo que compare diretamente bugs por minuto entre propriedades e exemplos em editores de UI.

## 5. Armadilhas: oráculo, geradores lentos, não determinismo, e como ficar em poucos segundos

### Síntese
Os riscos principais:
- oráculos fracos ou diferenças legítimas entre implementações;
- geradores que produzem entradas inválidas;
- não determinismo, que impede repetir a falha;
- encolhimento longo.

As ferramentas oferecem os controles: semente fixa e repetição com `seed`/`path`/`replayPath`, `skipAllAfterTimeLimit` e `interruptAfterTimeLimit` (ou o plugin equivalente), `derandomize` em CI e banco de exemplos.

### Achados com fonte
- `interruptAfterTimeLimit` conta como sucesso por padrão. É um orçamento de tempo, não uma garantia. Para isso existe `markInterruptAsFailure`. `skipAllAfterTimeLimit` limita o encolhimento. `timeout` não interrompe código síncrono. — [fast-check: Parameters](https://fast-check.dev/docs/api/interfaces/Parameters/)
- No perfil `ci` do Hypothesis: `derandomize=True`, `deadline=None` e `database=None`. O `deadline` padrão de 200 ms acusa exemplos lentos. — [Hypothesis API](https://hypothesis.readthedocs.io/en/latest/reference/api.html)
- O etcd relata que falhas de testes de robustez não determinísticos eram difíceis de reproduzir; o ambiente determinístico resolve isso. — [etcd blog 2025](https://etcd.io/blog/2025/autonomus_testing_with_antithesis/)
- Os oráculos diferenciais geram ruído: muitas diferenças são legítimas, e é preciso definir a equivalência (normalizar). — [SmartOracle arXiv 2601.15074](https://arxiv.org/html/2601.15074v1)
- Jepsen alerta para os limites do espaço de busca e para "the problem of induction": passar não prova ausência de bugs. — [jepsen.io/ethics](https://jepsen.io/ethics)
- O fuzz de editor pela API de transações pode deixar de fora bugs da camada de entrada (teclado, IME). — [discuss.prosemirror.net](https://discuss.prosemirror.net/t/fuzz-monkey-gremlin-testing/384/2)

### Inferências: receita para o núcleo TS em segundos
- Rode em Vitest no Node, sem iframe nem DOM real, ou com jsdom ou happy-dom só no oráculo de render. Use `fc.assert(fc.property(fc.commands(cmds, { maxCommands: 50 }), s => fc.modelRun(setup, s)), { numRuns: 100, seed })`.
- Com operações de store em microssegundos, isso deve levar menos de 1 a 2 s. Estimativa minha; precisa ser medida no projeto.
- Semente fixa no laço do lote; semente aleatória com um orçamento maior (`numRuns` 1000–10000 ou limite de tempo) no fim de etapa. Toda falha vira um caso `examples`, ou um teste fixo com `seed`, `path` e `replayPath`.
- Mutantes do catálogo (`tools/runner/mutants.ts`) medem diretamente se as propriedades pegam defeitos. É o mesmo protocolo de Ravi e Coblenz.
- O relógio falso e a fila de eventos controlada eliminam a instabilidade que hoje aparece como "só falha com a máquina ocupada".
- Os oráculos ficam baratos e fortes porque comparam o sistema com ele mesmo: do zero, exportado, serializado ou desfeito. Não exigem especificar a saída esperada.

### Lacunas
- `maxCommands` não aparece na página de testes por modelo que li; confirmar a assinatura de `fc.commands` na versão instalada antes de usar.
- O caminho exato do plugin que substitui `interruptAfterTimeLimit` e `timeout` (deprecated) não foi verificado.
- Não há números publicados de tempo de execução de testes por modelo com fast-check em editores visuais.
