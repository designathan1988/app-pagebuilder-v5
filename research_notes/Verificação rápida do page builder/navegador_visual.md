# Verificação rápida no navegador (page builder com canvas em iframe, painéis, breakpoints, pt-BR/en)

Pesquisa feita em 2026-10-21. Datas das fontes indicadas quando conhecidas. Contexto: a suíte atual tem cerca de 2.900 casos Playwright e leva cerca de 30 min.

## 1. Smoke tests: quantos e2e ficam no caminho de cada mudança? Quais são as evidências sobre flakiness e custo?

### Takeaway
Nenhuma das fontes de referência (Google, Fowler, Kent C. Dodds, Spotify) recomenda um número fixo, mas todas dizem que os e2e devem ser poucos e cobrir só as jornadas centrais. A maior parte da confiança vem de testes de integração e de unidade. Os dados de flakiness do Google mostram por que milhares de e2e no caminho de cada mudança custam caro.

### Cited Findings
- O post "Just Say No to More End-to-End Tests", do Google (2015), defende uma base de testes de unidade e e2e poucos e amplos. Ele reconhece que o e2e simula melhor o usuário real, mas diz que o ciclo de feedback lento e instável anula essa vantagem. Os comentaristas atribuem ao post a proporção 70/20/10 (unidade/integração/e2e) e o exemplo de desenvolvedores que perderam "mais de três dias" esperando o resultado dos e2e. O corpo do post não carregou na busca, e esses detalhes vêm dos comentários. — [Google Testing Blog, 2015](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- No Google (2016), cerca de 1,5% de todas as execuções de teste deram resultado flaky, e quase 16% dos testes tinham algum grau de flakiness. No CI pós-submit, cerca de 84% das transições de passa para falha envolveram um teste flaky. Os números vieram via busca, que cita o blog. — [Google Testing Blog, mai/2016](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
- Nos comentários do mesmo post, o Google diz que a flakiness aparece em todo o acervo de testes, "provavelmente com algum viés para testes de UI", mas não quantificou isso. — [Google Testing Blog, 2016](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
- O artigo de Fowler e Vocke sobre a pirâmide prática pede reduzir os e2e "a um mínimo absoluto" por causa do custo de manutenção. Diz que eles são "notoriamente flaky" e que muitas vezes a falha é falso positivo. Recomenda automatizar só as jornadas de maior valor e não repetir no alto da pirâmide o que as camadas de baixo já cobrem. Também diz que boa parte do comportamento de UI pode ser testada sem e2e. — [martinfowler.com, Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- Testing Trophy: a recomendação é "Write tests. Not too many. Mostly integration.", com análise estática na base, depois unidade, integração (a maior fatia) e e2e. Dodds não dá percentual e chama de distração o debate sobre proporções. O critério dele é a confiança obtida por tempo investido. — [Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- Testing Honeycomb (Spotify, 2018): o grosso são testes de integração do serviço isolado, poucos testes de detalhe de implementação e "even fewer Integrated Tests (ideally none)". Testes que dependem de outro sistema são descritos como "quite fragile". — [Spotify Engineering, 2018](https://engineering.atspotify.com/2018/01/testing-of-microservices)

### Inferences
- Para o editor, isso sugere um conjunto de smoke de cerca de 5 a 20 jornadas centrais por mudança: abrir o editor, inserir um bloco, editar no inspector, trocar de breakpoint, desfazer/refazer, trocar o idioma e exportar. Os ~2.900 casos ficariam no fim da etapa. Isso já coincide com a regra do CLAUDE.md seção 0 ("suíte inteira só no fim de uma etapa").
- Com uma taxa de flaky na ordem de 1,5% por execução, como no Google, uma suíte de 2.900 casos teria ~40 resultados flaky por rodada. Essa é uma extrapolação, não uma medida deste projeto. Ela explica por que a suíte inteira não serve como portão por mudança.

### Gaps
- O texto integral do post de 2015 não carregou. O 70/20/10 e o exemplo dos "três dias" vêm de comentários que citam o post.
- Não achei dado público de quantos e2e por mudança times maduros de editores visuais (Figma, Webflow, Framer) mantêm.

## 2. Velocidade no Playwright

### Takeaway
Os maiores ganhos vêm de três coisas: não reconstruir nem subir o servidor a cada rodada (`reuseExistingServer`), rodar só o afetado (`--only-changed`, `--last-failed`) e preparar o estado por API ou `storageState` em vez da UI. Os workers ajudam até o limite da CPU. Os contextos de navegador são baratos, e o custo dominante é o setup e a espera dentro do teste.

### Cited Findings
- Com `webServer.reuseExistingServer: true`, o Playwright reutiliza um servidor que já responde na `url` em vez de rodar o `command`. A doc sugere `!process.env.CI`. O timeout padrão de subida é 60.000 ms. — [playwright.dev/docs/test-webserver](https://playwright.dev/docs/test-webserver)
- `--only-changed` existe desde a 1.46. Ele roda só os arquivos de teste alterados desde um commit ou ref (por exemplo `--only-changed=main`) e também os testes que importam arquivos alterados. A 1.46.1 corrigiu bugs com project dependencies e com shallow clone. — [newreleases.io, Playwright 1.46.0](https://newreleases.io/project/npm/playwright/release/1.46.0); [1.46.1](https://newreleases.io/project/npm/playwright/release/1.46.1)
- Outras versões relevantes: `--fail-on-flaky-tests` (1.45), `test.step` com `timeout` e `test.step.skip` (1.50), `testProject.workers` para número de workers por projeto (1.52), aba Speedboard no relatório HTML, que ordena os testes por duração (1.57), `page.ariaSnapshot()` (1.59), opção `boxes` (1.60), `retryStrategy` (1.62) e `--shuffle` (1.63). — [Playwright release notes](https://playwright.dev/docs/release-notes)
- A doc descreve os contextos de navegador como rápidos e baratos de criar e isolados. O Playwright cria um contexto novo por teste e prefere começar do zero a limpar estado. — [playwright.dev/docs/browser-contexts](https://playwright.dev/docs/browser-contexts)
- A Checkly propõe fazer o login uma vez num passo de setup e salvar a sessão (`storageState`) para o resto da suíte. — [Checkly blog](https://www.checklyhq.com/blog/speed-up-playwright-tests-with-storage-state)
- Conta ilustrativa (não medida) da TestDino: 100 testes × 4 s de login = 400 s perdidos. Outro guia estima 100 testes × 8 s = 800 s em série, contra ~200 s com 4 workers. Os guias também alertam que workers disputando CPU limitada degradam muito o desempenho. — [TestDino](https://testdino.com/blog/reduce-playwright-ci-runtime); [qaskills.sh](https://qaskills.sh/blog/playwright-parallel-sharding-execution-guide)
- Benchmark da Better Stack (20 execuções de uma checagem simples de título, em segundos): Playwright 4,513, Selenium 4,590, Puppeteer 4,784, Cypress 9,378. — [Better Stack](https://betterstack.com/community/guides/scaling-nodejs/playwright-cypress-puppeteer-selenium-comparison/)
- A Checkly mediu que o Cypress tem uma partida bem mais lenta, com cerca de 7 s antes de o teste começar. O Puppeteer foi o mais rápido no cenário curto. — [Checkly speed comparison](https://www.checklyhq.com/blog/cypress-vs-selenium-vs-playwright-vs-puppeteer-speed-comparison/)

### Inferences
- Neste projeto, o `playwright.config.ts` remonta `dist/` a cada rodada (CLAUDE.md seção 8). Manter um `vite preview` já rodando e ligar `reuseExistingServer` tiraria o build e a subida do laço de cada spec. Com isso, um spec pequeno passaria a custar a partida do navegador (~poucos segundos) mais os próprios passos.
- O limite de 2 workers do projeto (o PC travou com 3) torna o paralelismo um ganho pequeno aqui. O ganho real está em rodar menos casos (seleção por área ou `--only-changed`) e em preparar o documento por API ou injeção na store em vez de cliques.

### Gaps
- Não achei um estudo de caso público e medido de "minutos para segundos" com antes e depois. Os números de workers e de login são ilustrativos.
- Não achei medida oficial do tempo de criar um contexto de navegador em ms.

## 3. Vitest Browser Mode e Playwright Component Testing

### Takeaway
Os dois rodam componentes isolados num Chromium real servido pelo Vite, sem montar o app inteiro. O Vitest Browser Mode tem provider Playwright, roda arquivos em paralelo e tem asserção de screenshot embutida. O Playwright CT continua marcado como experimental. Não achei benchmark confiável de tempo por teste em nenhum dos dois.

### Cited Findings
- O Vitest Browser Mode roda os testes num navegador real. A doc recomenda o provider Playwright (`@vitest/browser-playwright`) por suportar execução paralela. O provider padrão, "preview", simula eventos, não roda em CI e não é recomendado. O modo headless vem por `browser.headless`. A doc vista é do Vitest v5.0.5. — [vitest.dev/guide/browser](https://vitest.dev/guide/browser/)
- `toMatchScreenshot` do Vitest usa pixelmatch, com opções `threshold` e `allowedMismatchedPixelRatio`, e aceita comparadores SSIM. Ele captura repetidamente até a imagem estabilizar ou o timeout vencer. As referências ficam por navegador e plataforma (`button-chromium-win32.png`). A doc recomenda ambiente padronizado (Docker ou só CI) e esperar `document.fonts.ready`. Com Playwright, as animações ficam desligadas por padrão. — [vitest.dev visual regression](https://vitest.dev/guide/browser/visual-regression-testing)
- A troca descrita pelas fontes é que o navegador real é mais pesado que o jsdom, com boot mais longo e mais memória. Por isso muitos times deixam a lógica pura em jsdom/node e usam o Browser Mode para componentes. Fonte qualitativa, sem números. — [SitePoint](https://www.sitepoint.com/vitest-4-browser-mode-component-testing-without-playwright/); [frugaltesting](https://www.frugaltesting.com/blog/vitest-browser-mode-testing-real-browsers)
- O Playwright Component Testing continua com a página "Components (experimental)" e usa Vite para montar e servir o bundle dos componentes. — [playwright.dev/docs/test-components](https://playwright.dev/docs/test-components)
- A Currents afirma que a API do CT pode mudar entre versões menores e que a 1.59 (abril de 2026) removeu `experimental-ct-svelte`. Não verifiquei isso na fonte oficial. — [Currents](https://currents.dev/posts/playwright-component-testing)
- O tech radar da Porsche relata média de CI de testes abaixo de 90 s em todos os projetos. O número é da suíte inteira, não do Browser Mode. — [Porsche tech radar](https://opensource.porsche.com/porschedigital-technology-radar/tools/vitest/)

### Inferences
- O projeto já tem detectores em Vitest (`tools/runner/model/`). Painéis do inspector, number-field e placement do rótulo poderiam ser checados em Browser Mode com medições reais de layout, sem build de produção nem servidor de preview. Esse é o candidato mais direto a verificar em segundos componentes que hoje só os specs e2e checam.
- Pelo status experimental do Playwright CT, o Vitest Browser Mode é a escolha menos arriscada.

### Gaps
- Não achei benchmark confiável em ms por teste. Um "80% mais rápido no Vitest 3" de um glossário japonês não tem metodologia e foi descartado.

## 4. Regressão visual: tempo, flakiness e alternativas mais rápidas

### Takeaway
A comparação por pixels (pixelmatch) é barata. O custo e a instabilidade vêm de renderização de fontes, anti-aliasing, animações e baselines geradas em ambientes diferentes. Os serviços de nuvem economizam com seleção do que mudou (o TurboSnap diz até 80–85% menos). O snapshot ARIA/DOM é mais rápido e determinístico, mas não vê layout.

### Cited Findings
- `toHaveScreenshot` do Playwright usa pixelmatch, com `threshold` padrão de 0,2 por pixel (escala de 0 a 1) e `maxDiffPixels` sem valor padrão. O nome da baseline inclui navegador e plataforma, e `stylePath` aplica CSS para esconder partes voláteis, como iframes. A doc manda gerar as baselines no ambiente onde os testes rodam. — [playwright.dev/docs/test-snapshots](https://playwright.dev/docs/test-snapshots)
- As causas de flakiness visual citadas são rasterização de fonte e anti-aliasing subpixel, que variam por SO, versão do navegador e hardware. Um fornecedor viu flake até entre dois M1 iguais. As correções propostas: uma imagem Docker fixa, Chromium com `--disable-lcd-text` e `--font-render-hinting=none`, esperar `document.fonts.ready` e tolerância a diferenças de 1 px nas bordas. — [Argos: stabilize text rendering](https://argos-ci.com/docs/learn/reliability-and-flakiness/flaky-tests/stabilize-text-rendering); [TestQuality](https://testquality.com/playwright-visual-regression-guide/); [OpenReplay](https://blog.openreplay.com/catch-ui-bugs-visual-regression-testing/)
- Pela busca, `toHaveScreenshot` desliga animações, transições e Web Animations CSS por padrão. Animações dirigidas por JS não entram nisso. — [TestQuality](https://testquality.com/playwright-visual-regression-guide/)
- O Chromatic TurboSnap usa o git e o grafo de dependências do bundler para fotografar só as stories afetadas. O fornecedor diz até 80% menos snapshots por rodada e até 85% de rodadas mais rápidas (número de marketing). Ele exige 10 builds de CI bem-sucedidos antes de ativar, e arquivos fora do grafo (Sass, templates) pedem configuração. O próprio Chromatic avisa que mudanças podem passar despercebidas. É pago. — [Chromatic docs: TurboSnap](https://www.chromatic.com/docs/turbosnap/setup)
- `toMatchAriaSnapshot` (Playwright 1.49) compara a árvore de acessibilidade em YAML: papéis, nomes, atributos e texto. A comparação é parcial: omitir o nome ignora o nome, e `/children: contain|equal|deep-equal` controla os filhos. Desde a 1.50 os snapshots podem ficar em arquivos `.aria.yml`. A doc o indica para checagens estruturais amplas e não para conteúdo muito dinâmico. — [playwright.dev/docs/aria-snapshots](https://playwright.dev/docs/aria-snapshots); [release notes](https://playwright.dev/docs/release-notes)

### Inferences
- O snapshot ARIA pega rótulo errado, texto em inglês na UI pt-BR (família `english`) e controle sumido, sem depender de fontes. Não pega `cut`, `covered` nem `wrapped`. Para essas famílias, a varredura geométrica da seção 5 é mais rápida e determinística que uma foto.
- Se forem usadas fotos, a regra do projeto de rodar em "Windows real com escala 1,25" exige baselines `-win32` separadas, porque a renderização difere entre plataformas.

### Gaps
- Não achei medida pública independente de tempo por snapshot (ms) para Playwright, Argos, Lost Pixel, reg-suit ou Percy. Lost Pixel, reg-suit e Percy não foram aprofundados.

## 5. Checagem automática de layout sem testes escritos à mão (overflow, corte, sobreposição, i18n)

### Takeaway
Um script de varredura do DOM resolve boa parte. Ele compara `scrollWidth > clientWidth`, cruza os retângulos com o ancestral que recorta e procura sobreposição por `getBoundingClientRect`. Dá para rodar em cada tela visitada por um smoke, com tolerância de 1 a 3 px. A pseudo-localização (+30–35% de texto) força os casos de i18n. Não achei número publicado de tempo do axe-core em páginas grandes.

### Cited Findings
- `scrollWidth` é a largura mínima para o conteúdo caber sem barra horizontal, então `scrollWidth > clientWidth` é o teste básico de overflow. — [MDN scrollWidth](https://developer.mozilla.org/pl/docs/DOM/element.scrollWidth)
- O projeto `responsive-overflow-tests` roda a checagem em várias larguras num navegador real. Ele mostra que, com `overflow-x: hidden` num ancestral, o conteúdo é cortado sem mudar o `scrollWidth`, e a página passa com texto cortado. Por isso compara o elemento com a caixa do ancestral que o recorta. — [GitHub CyberPunkCodes/responsive-overflow-tests](https://github.com/CyberPunkCodes/responsive-overflow-tests)
- Um bug do Firefox registra erro de 1 a 3 px no cálculo de `scrollWidth` com reticências, então convém usar tolerância. Também se sugere comparar retângulos fracionários via `Range` para evitar falso positivo com zoom diferente de 100%. — [Bugzilla 1250824](https://bugzilla.mozilla.org/show_bug.cgi?id=1250824)
- Há receita de asserção de overflow reutilizável em Cypress, portável para Playwright via `page.evaluate`. — [Gleb Bahmutov, Cypress examples](https://glebbahmutov.com/cypress-examples/recipes/overflow.html)
- O axe-core tem a opção `performanceTimer`, que mede o tempo por regra e o total (`audit_start_to_end`). Um exemplo numa issue mostra ~312 ms numa regra, mas não é benchmark. — [Lightrun/axe-core issue](https://lightrun.com/answers/dequelabs-axe-core-understanding-performancetimer-metrics)
- Expansão típica de texto ao traduzir do inglês: 15–30% para francês, espanhol e português, 35% ou mais para alemão. O CJK contrai 30–55%. Envolver as strings pseudo-localizadas em colchetes torna o corte visível. — [Globalization Partners, 2015](https://www.globalizationpartners.com/2015/04/17/what-is-pseudo-localization/)
- A Netflix recomenda pseudo-localização cedo no desenvolvimento e cita crescimento vertical de até 70% em scripts como o tailandês. — [Netflix Games i18n requirements](https://backlothelp.netflix.com/hc/en-us/articles/4411631891859-Netflix-Games-Internationalization-Requirements)
- O pacote `pseudolocale` tem a opção `extend`, que alonga as strings em ~30%, e uma opção RTL. Uma ferramenta de pseudo-loc usa ~35% de expansão como convenção. — [openapps.pro pseudolocale](https://openapps.pro/packages/pseudolocale); [tessl.io](https://tessl.io/registry/testland/pseudo-localization-runner)

### Inferences
- O `tests/support/test.ts` do projeto já tem uma "guarda de tela" com as famílias `cut`, `wrapped`, `off-window`, `covered`, `english` e `sideways`. Rodar essa varredura isolada numa página já aberta, contra um preview que já está rodando, num locale pseudo (por exemplo pt-BR com +35% e colchetes), cobriria em segundos boa parte do que hoje exige centenas de specs de layout.
- Um locale pseudo detecta também string não traduzida, que apareceria sem os colchetes ou acentos. Isso pega a família `english` sem lista de palavras.

### Gaps
- Não achei tempos publicados do axe-core em DOM grande (ms por página). É preciso medir localmente com `performanceTimer`.
- Não achei material sobre o Galen Framework nas buscas.

## 6. Testes exploratórios e monkey testing no navegador

### Takeaway
O gremlins.js injeta cliques, toques, digitação, preenchimento de formulário e rolagem aleatórios com semente reprodutível, e o mogwai `gizmo` para depois de 10 erros. No Android, o estudo clássico achou o Monkey aleatório à frente das ferramentas de pesquisa comparadas. Não achei estudo que meça a quantidade de bugs achados por fuzzing de UI web com invariantes.

### Cited Findings
- Espécies do gremlins.js: clicker, toucher, formFiller, scroller e typer. Mogwais: fps (avisa queda de quadros), alert (impede bloqueio por `alert()`) e gizmo (para após 10 erros). A semente vem por `new gremlins.Chance(1234)`. Estratégias: distribution (padrão, 10 ms entre ações), allTogether e bySpecies. Com Playwright, injeta-se `dist/gremlins.min.js` por `page.addInitScript` e roda-se `gremlins.createHorde().unleash()` por `page.evaluate`. O repositório tem ~9,1k estrelas e 323 commits, sem releases listadas na captura. — [GitHub marmelab/gremlins.js](https://github.com/marmelab/gremlins.js)
- Os relatos de prática são anedóticos: o método "descobre problemas fora do fluxo normal", mas sem medida. A distinção citada é que o monkey "burro" acha falhas por entrada aleatória e o "esperto" (com modelo) acha erros de lógica e de estado. — [Medium, Gary Parker](https://medium.com/@qa.gary.parker/monkey-testing-lets-break-things-b3e8efb63fda); [yrkan.com](https://yrkan.com/course/module-02-levels-types/ad-hoc-monkey-testing/)
- Em "Automated Test Input Generation for Android: Are We There Yet?" (Choudhary, Gorla, Orso, 2015; prêmio MIP do ASE 2025), segundo o trabalho seguinte (Zeng et al., FSE 2016), o Monkey aleatório superou todas as ferramentas de pesquisa do estudo. No caso industrial do WeChat, uma abordagem nova melhorou muito a cobertura em relação ao Monkey. — [arXiv 1503.07217](https://arxiv.org/abs/1503.07217); [Zeng et al., FSE 2016](https://mir.cs.illinois.edu/winglam/publications/2016/fse16industry-wechat.pdf); [ASE 2025 MIP](https://conf.researchr.org/details/ase-2025/ase-2025-mip-award/1/Automated-Test-Input-Generation-for-Android-Are-We-There-Yet-)

### Inferences
- No editor, uma horda com semente e poucos segundos de ações aleatórias rende mais se, depois de cada ação ou lote, checar as invariantes do CLAUDE.md seção 5. São elas a integridade do documento (IDs únicos, sem órfãos, serialização de ida e volta), a mesma seleção no canvas e nas Camadas (G6), render incremental igual ao render do zero (G7), console sem erro e a varredura de layout da seção 5. É um fuzzing com oráculo, não só a caça a exceções que o gremlins.js faz por padrão.
- A semente fixa torna reproduzível qualquer achado, que pode virar spec ou mutante.

### Gaps
- Não achei estudo empírico de bug yield de monkey testing em aplicação web (só Android) nem números de chaos testing de UI web.
