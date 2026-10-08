# C8 (parte A) - Classes de defeito de editores visuais web e detecção automática

Data da pesquisa: 2026-10-08. Todas as fontes abaixo foram abertas com WebFetch na data de acesso 2026-10-08.

Convenção do documento: em cada classe, o bloco "Fato documentado" traz o que a fonte afirma; o bloco "Avaliação" traz a conclusão do pesquisador para este projeto. As duas coisas não se misturam.

Versões instaladas no projeto (lidas de package.json e do node_modules em 2026-10-08): react e react-dom ^19.3.0, vitest ^5.0.1, happy-dom ^20.14.5, @playwright/test ^1.63.0, @mdn/browser-compat-data 8.1.2 (instalado), eslint ^10.11.0, html-validate ^11.16.0, typescript ^6.0.3, vite ^8.3.0. Não há dependência de biblioteca de i18n, de axe-core, de memlab, de react-scan nem de virtualização no package.json.

---

## Fontes consultadas

| # | URL | Acesso | Versão ou data do conteúdo | O que sustenta |
|---|---|---|---|---|
| S1 | https://github.com/facebook/memlab | 2026-10-08 | página do repositório; sem versão na página; versão do pacote npm em S3 | cenário (url, action, back, leakFilter), CLI, API, integração Puppeteer |
| S2 | https://facebook.github.io/memlab/docs/intro | 2026-10-08 | documentação sem versão visível | memlab dirige o navegador com Puppeteer, tira snapshots, agrupa vazamentos e gera retainer traces |
| S3 | https://registry.npmjs.org/memlab/latest | 2026-10-08 | memlab 2.0.5 (campo latest do registro) | versão atual; dependência fixa puppeteer e puppeteer-core 24.31.0 |
| S4 | https://facebook.github.io/memlab/docs/how-memlab-works | 2026-10-08 | documentação de memlab 2.x | três snapshots (baseline, target, final); fórmula do conjunto de vazamento; heurísticas incluem DOM destacado; detecção de Fiber React desmontado |
| S5 | https://facebook.github.io/memlab/docs/api/api/src/functions/findLeaks | 2026-10-08 | documentação de @memlab/api | assinatura de findLeaks, lista de funções exportadas |
| S6 | https://facebook.github.io/memlab/docs/api/api/src/functions/run | 2026-10-08 | documentação de @memlab/api | run equivale a aquecer, takeSnapshots e findLeaks |
| S7 | https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/js_protocol.pdl | 2026-10-08 | ramo master do repositório devtools-protocol (domínio experimental) | comandos e eventos de HeapProfiler |
| S8 | https://playwright.dev/docs/api/class-cdpsession | 2026-10-08 | documentação do Playwright com marcas até v1.59 | CDPSession: send, on, detach; criado por context.newCDPSession |
| S9 | https://playwright.dev/docs/api/class-browsertype | 2026-10-08 | documentação do Playwright (pacote @playwright/test) | opção channel; connectOverCDP só para Chromium |
| S10 | https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory | 2026-10-08 | MDN, sem data de revisão visível | exige contexto seguro e isolamento de origem cruzada; experimental |
| S11 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry | 2026-10-08 | MDN, sem data de revisão visível | garantias e não garantias do callback |
| S12 | https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots | 2026-10-08 | página atualizada em 2024-02-09 | vista Comparison, Retainers, objetos retidos por nós destacados |
| S13 | https://react.dev/reference/react/Profiler | 2026-10-08 | documentação do React 19 | componente Profiler, parâmetros de onRender, desativado em produção |
| S14 | https://react.dev/reference/dev-tools/react-performance-tracks | 2026-10-08 | documentação do React 19.x | trilhas, build de profiling react-dom/profiling, alias no Vite |
| S15 | https://registry.npmjs.org/react-scan/latest | 2026-10-08 | react-scan 0.5.7 (campo latest) | versão; peer dependencies React 16.8 a 19; bin react-scan |
| S16 | https://github.com/aidenybai/react-scan | 2026-10-08 | página do repositório; sem versão na página | API scan, useScan, setOptions, onRender; CLI só init; sem menção a CI |
| S17 | https://developer.chrome.com/docs/web-platform/long-animation-frames | 2026-10-08 | página atualizada em 2024-10-14 | PerformanceObserver long-animation-frame, limiar 50 ms, campos, suporte Chrome e Edge 123 |
| S18 | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongAnimationFrameTiming | 2026-10-08 | MDN | propriedades blockingDuration, renderStart, styleAndLayoutStart, scripts; disponibilidade limitada |
| S19 | https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming | 2026-10-08 | MDN | limiar 50 ms, atribuição por contexto, disponibilidade limitada |
| S20 | https://web.dev/articles/inp | 2026-10-08 | web.dev, sem data visível no retorno | definição e limiares de INP; medição em laboratório e em campo |
| S21 | https://registry.npmjs.org/web-vitals/latest | 2026-10-08 | web-vitals 6.2.3 | versão da biblioteca que mede INP |
| S22 | https://registry.npmjs.org/axe-core/latest | 2026-10-08 | axe-core 4.14.0 | versão atual |
| S23 | https://registry.npmjs.org/@axe-core/playwright/latest | 2026-10-08 | @axe-core/playwright 4.13.0 (depende de axe-core ~4.13.0; peer playwright-core >= 1.0.0) | versão e compatibilidade |
| S24 | https://github.com/dequelabs/axe-core/blob/develop/doc/API.md | 2026-10-08 | ramo develop (axe-core 4.14) | opções runOnly, rules, resultTypes, iframes; formato dos resultados |
| S25 | https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md | 2026-10-08 | axe-core 4.14 | IDs de regras de ARIA, rótulos, contraste, foco, target-size |
| S26 | https://github.com/dequelabs/axe-core/blob/develop/README.md | 2026-10-08 | ramo develop | suporte a JSDOM limitado; color-contrast não funciona em JSDOM; 57% dos problemas WCAG em média; resultados incomplete |
| S27 | https://github.com/nickcolley/jest-axe | 2026-10-08 | página do repositório; sem versão | contraste desligado em JSDOM; temporizadores falsos quebram o axe |
| S28 | https://playwright.dev/docs/accessibility-testing | 2026-10-08 | documentação do Playwright | AxeBuilder, withTags, exclude, disableRules; testes automáticos não pegam todas as violações |
| S29 | https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ | 2026-10-08 | APG (rodapé com copyright 2026; sem versão do padrão) | teclado e ARIA de menu e menubar |
| S30 | https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ | 2026-10-08 | APG | teclado, tabindex móvel, conflito de setas com slider e spinbutton |
| S31 | https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ | 2026-10-08 | APG | teclado e ARIA de tree view |
| S32 | https://www.w3.org/WAI/ARIA/apg/patterns/slider/ | 2026-10-08 | APG | teclado e ARIA de slider |
| S33 | https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/ | 2026-10-08 | APG | teclado e ARIA de spinbutton |
| S34 | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ | 2026-10-08 | APG | retenção de foco, Esc, retorno do foco, aria-modal |
| S35 | https://registry.npmjs.org/i18next-parser/latest | 2026-10-08 | i18next-parser 9.4.0, marcado como obsoleto | versão e substituto i18next-cli |
| S36 | https://github.com/i18next/i18next-parser | 2026-10-08 | repositório arquivado em 2026-02-22 | failOnUpdate, failOnWarnings, extração de chaves de t() |
| S37 | https://registry.npmjs.org/@lingual/i18n-check/latest | 2026-10-08 | @lingual/i18n-check 0.9.5 | versão |
| S38 | https://github.com/lingualdev/i18n-check | 2026-10-08 | página do repositório | chaves ausentes, inválidas, não usadas, indefinidas; formatos ICU e i18next |
| S39 | https://registry.npmjs.org/eslint-plugin-i18next/latest | 2026-10-08 | eslint-plugin-i18next 6.1.5 | versão; devDependency eslint ^9.6.0; sem peerDependencies listadas |
| S40 | https://github.com/edvardchen/eslint-plugin-i18next | 2026-10-08 | página do repositório | regra no-literal-string; config flat; sem autocorreção |
| S41 | https://raw.githubusercontent.com/edvardchen/eslint-plugin-i18next/master/docs/rules/no-literal-string.md | 2026-10-08 | documentação da regra (eslint-plugin-i18next 6.x) | modos jsx-text-only, jsx-only, all; opções words, jsx-attributes, callees, object-properties, class-properties |
| S42 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules | 2026-10-08 | MDN | categorias de plural; Baseline amplamente disponível desde setembro de 2019 |
| S43 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat | 2026-10-08 | MDN | formatação por locale; sem análise de texto; Baseline desde setembro de 2017 |
| S44 | https://www.w3.org/International/articles/article-text-size.en.html | 2026-10-08 | artigo W3C Internationalization | tabela de expansão de texto por tamanho da fonte em inglês |
| S45 | https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API | 2026-10-08 | MDN | document.fonts, ready, eventos loading, loadingdone, loadingerror; Baseline desde janeiro de 2020 |
| S46 | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust | 2026-10-08 | MDN | size-adjust; Baseline amplamente disponível desde setembro de 2023 |
| S47 | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display | 2026-10-08 | MDN | valores e períodos de block e swap |
| S48 | https://web.dev/articles/optimize-cls | 2026-10-08 | web.dev | fontes web causam deslocamento de layout; mitigação com font-display optional, preload e descritores de métrica |
| S49 | https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio | 2026-10-08 | MDN | fatores que mudam devicePixelRatio; monitoramento por matchMedia resolution |
| S50 | https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport | 2026-10-08 | MDN | propriedades e eventos; Baseline desde agosto de 2021 |
| S51 | https://developer.mozilla.org/en-US/docs/Web/CSS/zoom | 2026-10-08 | MDN | zoom padronizado; Baseline 2024 (Newly available, maio de 2024); afeta o layout |
| S52 | https://developer.mozilla.org/en-US/docs/Web/API/Element/currentCSSZoom | 2026-10-08 | MDN | produto dos zoom do elemento e dos ancestrais; Baseline 2026 (Newly available, março de 2026) |
| S53 | https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | 2026-10-08 | MDN | retângulo relativo ao viewport; deslocamento de rolagem |
| S54 | https://registry.npmjs.org/@mdn/browser-compat-data/latest | 2026-10-08 | @mdn/browser-compat-data 8.1.5 (latest); instalado no projeto 8.1.2 | versão e campos exports |
| S55 | https://github.com/mdn/browser-compat-data/blob/main/schemas/compat-data-schema.md | 2026-10-08 | ramo main | esquema __compat, support, version_added, status, flags, partial_implementation |
| S56 | https://github.com/mdn/browser-compat-data/blob/main/README.md | 2026-10-08 | ramo main | uso em Node, chaves de topo, __meta |
| S57 | https://registry.npmjs.org/eslint-plugin-compat/latest | 2026-10-08 | eslint-plugin-compat 7.0.2 | depende de @mdn/browser-compat-data ^6.1.1 e browserslist ^4.25.2; peer eslint ^9 ou ^10; Node >= 22 |
| S58 | https://github.com/amilajack/eslint-plugin-compat | 2026-10-08 | página do repositório | detecta APIs web; browserslist; polyfills; config flat |
| S59 | https://registry.npmjs.org/doiuse/latest | 2026-10-08 | doiuse 6.0.6 | versão; dependências caniuse-lite e browserslist |
| S60 | https://github.com/anandthakker/doiuse | 2026-10-08 | página do repositório | lint de CSS contra caniuse; detecção descrita como ingênua por nome de propriedade |
| S61 | https://registry.npmjs.org/stylelint-no-unsupported-browser-features/latest | 2026-10-08 | versão 8.1.2 | plugin do stylelint sobre doiuse 6.0.6; peer stylelint >= 16.0.2 |
| S62 | https://github.com/browserslist/browserslist | 2026-10-08 | página do repositório | sintaxe de consultas, configuração, CLI, fonte caniuse-lite |
| S63 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON | 2026-10-08 | MDN | Number.EPSILON = 2^-52, adequado só perto de magnitude 1 |
| S64 | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_values_and_units/Numeric_data_types | 2026-10-08 | MDN | 1in = 96px; em e rem; percentual relativo; sem tratamento de precisão |
| S65 | https://www.w3.org/TR/css-values-4/ | 2026-10-08 | CSS Values and Units Level 4 (leitura dos primeiros 100000 caracteres) | precisão e faixa definidas pela implementação; px canônico; arredondamento de bordas |
| S66 | https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/primitives/utils.ts | 2026-10-08 | ramo main do tldraw em 2026-10-08 | funções approximately, toPrecision, toDomPrecision, toFixed, isSafeFloat |
| S67 | https://tldraw.dev/sdk-features/snapping | 2026-10-08 | documentação do tldraw | limiar de encaixe em pixels de tela, convertido pelo zoom |
| S68 | https://tldraw.dev/sdk-features/performance | 2026-10-08 | página editada em 2026-01-31 | culling, sinais reativos, lotes, zoom com debounce, cache de geometria |
| S69 | https://github.com/excalidraw/excalidraw | 2026-10-08 | página do repositório | sem documentação de desempenho nem de benchmark visível; testes com Vitest |
| S70 | https://registry.npmjs.org/@tanstack/react-virtual/latest | 2026-10-08 | @tanstack/react-virtual 3.14.13 | versão; peer react até 19 |
| S71 | https://tanstack.com/virtual/latest/docs/introduction | 2026-10-08 | TanStack Virtual v3 | biblioteca headless, useVirtualizer |
| S72 | https://web.dev/articles/virtualize-long-lists-react-window | 2026-10-08 | página atualizada em 2019-04-29 | janelamento reduz nós do DOM; overscan |
| S73 | https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing | 2026-10-08 | publicado em 2015-03-20, atualizado em 2025-05-07 | custo de layout cresce com o DOM; layout síncrono forçado; detecção |
| S74 | https://vitest.dev/guide/browser/ | 2026-10-08 | documentação do Vitest v5.0.3 | modo browser com provider Playwright e instances |
| S75 | https://github.com/capricorn86/happy-dom | 2026-10-08 | página do repositório | descrição "implementação de navegador sem interface gráfica"; sem declaração sobre layout |
| S76 | https://github.com/capricorn86/happy-dom/wiki/Element | 2026-10-08 | wiki do happy-dom | não menciona getBoundingClientRect nem layout |

Buscas sem fonte aproveitável: duas pesquisas na web (tldraw sobre precisão de ponto flutuante; Figma sobre precisão de coordenadas grandes) não retornaram nenhuma página do Figma ou do tldraw sobre o tema que pudesse ser aberta e que o tratasse. Nenhuma afirmação sobre a abordagem do Figma para precisão numérica está sustentada neste documento. Também não foi aberta a página do Playwright sobre medição de heap; a combinação Playwright com CDP vem de S8, S9 e S7.

---

## 1. Vazamento de memória

### Fato documentado

- memlab 2.0.5 (S3) é um framework de teste que dirige um Chrome headless com Puppeteer (S2). A dependência puppeteer e puppeteer-core está fixada em 24.31.0 (S3).
- O cenário exporta url (página inicial), action (interação testada) e back (desfaz a interação). Opcionalmente exporta leakFilter(node, heap), chamado para cada objeto alocado durante a action que não foi liberado (S1).
- Três snapshots: baseline (página de url), target (depois da action) e final (depois do back). O conjunto de vazamentos é (target menos baseline) interseção final: objetos alocados na interação e ainda vivos quando deveriam ter sido liberados (S4).
- Os detectores embutidos aplicam heurísticas, entre elas DOM destacado, e memlab identifica nós de Fiber React desmontados que seguem retidos (S4). Para cada vazamento gera retainer trace a partir das raízes de GC e agrupa traces parecidos (S4).
- CLI: memlab run --scenario arquivo; memlab view-heap --snapshot arquivo; memlab analyze unbound-object; memlab trace --node-id id (S1).
- API: findLeaks(runResult, options) devolve Promise de ISerializedInfo[] e equivale ao comando find-leaks; run(options) equivale a aquecer, takeSnapshots e findLeaks; também são exportadas takeSnapshots, warmupAndTakeSnapshots, findLeaksBySnapshotFilePaths e analyze (S5, S6). As páginas S5 e S6 não definem o tipo RunOptions.
- Asserções de memória em testes Node (takeNodeMinimalHeap) são citadas em S1; a página de detalhes retornou 404 e não foi lida.
- Domínio HeapProfiler do CDP (experimental): collectGarbage, takeHeapSnapshot (parâmetros reportProgress, captureNumericValue, exposeInternals), addHeapSnapshotChunk (evento com pedaços de texto do snapshot), getHeapObjectId, getObjectByHeapObjectId, startSampling, stopSampling, startTrackingHeapObjects (S7).
- Playwright oferece CDPSession por context.newCDPSession(page), com send(método, parâmetros) e on(evento) (S8). connectOverCDP só funciona em navegadores Chromium (S9). O canal channel aceita "chrome" e "msedge" além de "chromium" (S9).
- Chrome DevTools: cada snapshot de heap começa com coleta de lixo; a vista Comparison diferencia dois snapshots; a seção Retainers mostra quem referencia o objeto; o filtro de construtor "Objects retained by detached nodes" lista objetos retidos por nós destacados (S12).
- FinalizationRegistry: o callback nunca é síncrono, pode nunca ser chamado, tem tempo imprevisível, não roda ao fechar a aba, e o alvo registrado no mesmo job não é coletado até o job terminar; a MDN diz para não usar em lógica essencial (S11). WeakRef é limpo ao mesmo tempo ou antes do callback (S11).
- performance.measureUserAgentSpecificMemory exige contexto seguro e isolamento de origem cruzada (crossOriginIsolated), lança SecurityError fora disso, é experimental, de disponibilidade limitada, e os bytes não são comparáveis entre navegadores nem versões (S10). Devolve bytes e breakdown com atribuição por realm, inclusive iframes e workers (S10).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| memlab run com cenário (url, action, back) sobre o build servido | Sim, Chrome headless via Puppeteer | Minutos por cenário; snapshots de heap de dezenas a centenas de MB; dependência extra | Objetos alocados na ação e retidos depois do back; Fiber desmontado retido; DOM destacado; mostra o caminho de retenção | Vazamento que só ocorre em sequência diferente da cenarizada; crescimento lento abaixo do que o filtro agrupa |
| CDP via Playwright: HeapProfiler.collectGarbage, depois takeHeapSnapshot, repetido N ciclos de ação e retorno, comparação de contagem por construtor | Sim, só Chromium | Segundos a minutos; scripts próprios para ler o snapshot; sem dependência nova | Crescimento de contagem de nós por ciclo repetido; contagem de nós destacados; serve para medição registrada | Não indica sozinho o caminho de retenção sem analisar o grafo |
| Sonda WeakRef e FinalizationRegistry no teste: registrar o objeto criado na ação, remover a referência, forçar HeapProfiler.collectGarbage via CDP, verificar deref() igual a undefined | Sim, Chromium com CDP para coleta forçada | Baixo; poucas linhas por sonda | Objeto específico que deveria ser liberado e não foi (por exemplo painel desmontado, nó do canvas) | Não explica por que ficou retido; callback do registro não serve de asserção (S11), por isso a asserção usa deref() após coleta forçada |
| performance.measureUserAgentSpecificMemory | Sim; exige página servida com cabeçalhos de isolamento de origem cruzada | Baixo; limitado a navegador que implementa | Crescimento total de memória em bytes inclusive nos iframes do canvas | Não identifica o objeto; valores não comparáveis entre navegadores (S10) |
| Vista Comparison do DevTools (manual) | Sim | Humano no ciclo | Diagnóstico depois que uma das técnicas acima apontou o vazamento | Não é automática |

### Avaliação

- O canvas do projeto vive em iframe (CLAUDE.md do projeto): nós destacados do documento do iframe e listeners do iframe são o caso de maior risco; o memlab já cobre nó destacado e Fiber desmontado (S4), então o primeiro cenário a escrever é: abrir o editor, executar a ação (selecionar, abrir painel rápido, trocar de breakpoint), voltar ao estado inicial, e conferir o conjunto de vazamentos.
- A sonda WeakRef com coleta forçada por CDP é a técnica de menor custo e menor dependência para o laboratório Playwright que o projeto já usa (CLAUDE.md seção 8); ela confirma um objeto por vez.
- Instalar memlab traz Puppeteer 24.31.0 fixo (S3) ao lado do Playwright; isso é um custo de manutenção. A comparação de snapshots por CDP no Playwright evita a segunda dependência, mas obriga a escrever a análise do grafo.
- measureUserAgentSpecificMemory exige isolamento de origem cruzada, o que muda os cabeçalhos do servidor de teste; no servidor do projeto (python http.server) isso não existe sem alteração. Só vale como métrica agregada.

---

## 2. Re-render desnecessário e tarefas longas

### Fato documentado

- O componente Profiler recebe id e onRender; onRender recebe id, phase (mount, update, nested-update), actualDuration, baseDuration, startTime e commitTime (S13). O Profiler fica desativado no build de produção; a medição em produção exige o build de profiling (S13).
- O build de profiling é obtido importando react-dom/profiling no lugar de react-dom/client; a documentação recomenda um alias em tempo de build, com exemplo no Vite (S14). Nesse build só as trilhas do Scheduler vêm ativas por padrão e a trilha Components inclui só subárvores envolvidas em Profiler (S14). Em desenvolvimento, a trilha Components pode mostrar as props alteradas, o que ajuda a achar re-render desnecessário (S14).
- react-scan 0.5.7 (S15). API: scan(options), useScan(options), setOptions, getOptions, onRender(Componente, callback); opções enabled, log, showToolbar, animationSpeed, onCommitStart, onRender, onCommitFinish; a opção dangerouslyForceRunInProduction força execução em produção e não é recomendada (S16). A CLI documentada tem só o comando init (S16). A página não afirma suporte a CI nem a execução headless (S16).
- Long Animation Frames: PerformanceObserver com type long-animation-frame e buffered true; limiar de 50 ms; o buffer de getEntriesByType guarda 200 entradas; campos scripts (scripts acima de 5 ms, só mesma origem), blockingDuration, renderStart, styleAndLayoutStart; Chrome e Edge 123 em diante; Firefox e Safari não implementam (S17, S18). A MDN classifica como disponibilidade limitada e experimental (S18).
- Long Tasks: tarefas de 50 ms ou mais, atribuídas ao contêiner do contexto de navegação (self, same-origin-descendant e demais valores); disponibilidade limitada (S19).
- INP: latência de clique, toque e teclado ao longo da visita, composta de atraso de entrada, tempo de processamento e atraso de apresentação; bom até 200 ms, ruim acima de 500 ms; mede-se em campo com a biblioteca web-vitals 6.2.3; em laboratório a página sugere reproduzir interações e usar Total Blocking Time como aproximação (S20, S21).
- O LoAF expõe forcedStyleAndLayoutDuration, citado como forma de apontar layout forçado em campo (S73).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Profiler onRender em torno de subárvores do editor, com contagem de commits por ação em teste Playwright (build com alias para react-dom/profiling) | Sim, para medir tempo real; a contagem de commits pode rodar em happy-dom | Baixo; um build extra com alias | Número de commits por ação; actualDuration contra baseDuration; fase nested-update | Causa da re-renderização por prop; custo de layout e de pintura |
| react-scan com scan({ onRender, onCommitFinish }) e opção log, injetado no navegador do laboratório | Sim | Dependência extra; a API é de uso interativo; uso em CI não está documentado (S16) | Quais componentes renderizam em cada interação | Não há contrato documentado para falhar teste em CI |
| PerformanceObserver long-animation-frame injetado por page.addInitScript, lendo scripts, blockingDuration, renderStart, styleAndLayoutStart | Sim, Chromium | Baixo | Quadros acima de 50 ms por interação, com atribuição de script; separa JS de estilo e layout | Não funciona em Firefox e Safari (S17); só atribui script de mesma origem |
| PerformanceObserver longtask | Sim | Baixo | Tarefas acima de 50 ms; funciona como contador de regressão | Atribuição fraca; disponibilidade limitada (S19) |
| web-vitals onINP no navegador de laboratório | Sim | Biblioteca extra; precisa de interações reais | INP em fluxos de usuário | Interação que não foi executada no roteiro |

### Avaliação

- Em teste, o dado mais estável é o contador de commits do Profiler por ação, porque não depende do relógio; actualDuration depende da máquina e serve só como medição registrada.
- O PerformanceObserver de long-animation-frame cobre o iframe do canvas apenas para scripts de mesma origem (S17), o que é o caso do editor; ele é a ferramenta que separa o custo de JS do custo de layout nos quadros lentos.
- Para react-scan, a documentação aberta não descreve uso em CI; usar como ferramenta de diagnóstico e não como portão automático.

---

## 3. Acessibilidade, foco e teclado

### Fato documentado

- axe-core 4.14.0 e @axe-core/playwright 4.13.0 (dependência axe-core ~4.13.0; peer playwright-core >= 1.0.0) (S22, S23).
- axe.run aceita runOnly (tags ou IDs; várias tags formam união), rules (liga e desliga regras), resultTypes (limita os tipos que retornam todos os nós, acelera páginas grandes), iframes (padrão true) (S24). Os resultados são passes, violations, incomplete (precisa de revisão) e inapplicable (S24).
- Regras relevantes ao editor: aria-allowed-attr, aria-required-attr, aria-required-children, aria-required-parent, aria-roles, aria-valid-attr-value, aria-hidden-focus, aria-command-name, aria-input-field-name, aria-tooltip-name, button-name, label, color-contrast, scrollable-region-focusable, tabindex, nested-interactive, region, target-size (WCAG 2.2, desligada por padrão), aria-treeitem-name, aria-dialog-name (S25). focus-order-semantics é experimental e desligada por padrão (S25).
- O README do axe-core afirma suporte limitado a JSDOM, recomenda desligar regras que não funcionam, e diz que color-contrast não funciona em JSDOM (S26). jest-axe repete que o contraste é desligado em JSDOM e que temporizadores falsos fazem o axe estourar o tempo (S27). O README afirma que o axe encontra em média 57% dos problemas WCAG automaticamente (S26) e a página de acessibilidade do Playwright afirma que teste automático não detecta todos os tipos de violação (S28). A documentação consultada do happy-dom não traz declaração sobre layout (S75, S76), portanto a possibilidade de rodar axe em happy-dom não está documentada em nenhuma fonte aberta.
- Playwright: AxeBuilder({ page }).analyze(); withTags, exclude, disableRules (S28).
- APG, menu e menubar: Tab entra e sai; Setas movem; Direita abre submenu; Esquerda fecha e volta ao pai; Home e End; caracteres imprimíveis opcionais; Esc fecha e devolve o foco ao abridor; foco em roving tabindex (itens com tabindex -1, o primeiro 0) ou aria-activedescendant; aria-haspopup, aria-expanded, aria-checked, aria-disabled; itens desabilitados continuam focáveis (S29).
- APG, toolbar: um único Tab stop; setas movem entre controles; Home e End opcionais; recomenda evitar controles que usam as mesmas setas (spinbutton e slider), ou incluir só um e colocá-lo por último; aria-label ou aria-labelledby (S30).
- APG, tree view: Direita abre nó fechado ou desce ao primeiro filho; Esquerda fecha ou sobe ao pai; Cima e Baixo movem sem abrir; Home e End; Enter executa a ação; type-ahead recomendado; aria-expanded só em nós pai; aria-selected ou aria-checked, um dos dois de forma consistente; aria-level, aria-setsize e aria-posinset são necessários quando o conjunto completo não está no DOM (S31).
- APG, slider: Direita e Cima aumentam; Esquerda e Baixo diminuem; Home e End; Page Up e Page Down opcionais; aria-valuenow, aria-valuemin, aria-valuemax, aria-valuetext (S32).
- APG, spinbutton: Cima e Baixo; Home e End; Page Up e Page Down opcionais; role spinbutton com aria-valuenow, aria-valuemin, aria-valuemax; teclas de edição de texto não podem ser capturadas; aria-invalid para valor fora da faixa (S33).
- APG, diálogo modal: Tab e Shift+Tab ciclam dentro do diálogo; o foco inicial vai para elemento dentro do diálogo; Esc fecha; o foco volta ao elemento que abriu; aria-modal true só quando o código bloqueia a interação fora (S34).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| AxeBuilder sobre o editor em estados abertos (menu aberto, painel rápido, árvore expandida) no Playwright, com withTags para WCAG A e AA | Sim | Dependência @axe-core/playwright; segundos por varredura; resultTypes reduz o custo | Papéis e atributos ARIA inválidos, nomes ausentes, filhos obrigatórios, contraste, nesting interativo | Ordem de foco coerente, atalhos de teclado do APG, retenção de foco, usabilidade (S28) |
| axe-core em happy-dom ou JSDOM com color-contrast desligado | Não | Baixo; resultado incompleto | Regras estruturais de ARIA e de nome | Contraste, tudo que depende de layout; não há fonte aberta que garanta o resultado em happy-dom |
| Roteiro de teclado no Playwright por padrão APG: Tab para entrar, setas, Home e End, Esc, conferência de document.activeElement e de aria-activedescendant a cada passo | Sim | Roteiro por componente; sem dependência nova | Ordem de foco, roving tabindex, retorno do foco, saída do menu por Tab | Qualquer comportamento que o roteiro não percorreu |
| Teste de retenção de foco: Tab repetido N vezes dentro do diálogo e Shift+Tab, com verificação de que activeElement permanece dentro | Sim | Baixo | Foco que escapa do diálogo; foco que não volta ao abridor | Leitores de tela reais |
| Verificação de atributos por padrão APG via locator.getAttribute após cada tecla (aria-expanded, aria-valuenow, aria-selected) | Sim | Baixo | Estados ARIA que não acompanham a interface | Qualidade do texto de aria-label |
| html-validate (já instalado) sobre o HTML renderizado | Não | Baixo | IDs duplicados, atributos inválidos, papéis inválidos no HTML estático | Estado dinâmico |

### Avaliação

- Axe e roteiro de teclado se completam: o axe pega erro estrutural, o roteiro pega o contrato de teclado. O axe sozinho não prova nenhum dos padrões APG listados.
- Seguindo S30, uma barra de ferramentas que contenha spinbutton ou slider (como os campos numéricos do inspetor) deve ter o controle de seta como único ou último; o roteiro de teclado deve checar esse conflito.
- Árvore de Camadas com janelamento exige aria-level, aria-setsize e aria-posinset (S31); essa checagem de atributos entra no roteiro.

---

## 4. Internacionalização

### Fato documentado

- i18next-parser 9.4.0 está marcado como obsoleto, o repositório foi arquivado em 2026-02-22 e o substituto indicado é i18next-cli (S35, S36). Opções: failOnUpdate sai com código 1 quando os catálogos mudam, failOnWarnings sai com código 1 em avisos (chaves não literais, valores conflitantes) (S36). A página não descreve verificação de chave ausente por idioma (S36).
- @lingual/i18n-check 0.9.5 compara um idioma-fonte com os idiomas-alvo: chaves ausentes, chaves inválidas (tipo do valor diferente), chaves não usadas e chaves indefinidas (as duas últimas com a opção -u contra o código); formatos JSON e YAML, ICU por padrão e i18next com -f i18next; sem Action oficial, mas com exemplo de fluxo de CI (S37, S38). A página não confirma verificação de placeholders ICU (S38).
- eslint-plugin-i18next 6.1.5 (S39). Regra no-literal-string: modo padrão jsx-text-only (texto direto em JSX); jsx-only inclui valores de atributos JSX; all verifica todas as strings literais; opções words, jsx-components, jsx-attributes, callees, object-properties, class-properties, cada uma com include e exclude; sem autocorreção; configuração flat com i18next.configs['flat/recommended'] (S40, S41). O pacote lista eslint ^9.6.0 em devDependencies e não lista peerDependencies (S39); o projeto usa eslint ^10.11.0.
- Intl.PluralRules.select devolve zero, one, two, few, many ou other; Baseline amplamente disponível desde setembro de 2019; a página não documenta pluralCategories, e a nota sobre o português ter many vem de conhecimento geral do conteúdo retornado, sem sustentação na página (S42).
- Intl.NumberFormat formata por locale (de-DE usa vírgula decimal e ponto de milhar; en-IN agrupa em lakh); não há método de análise de texto para número; Baseline desde setembro de 2017 (S43).
- Expansão de texto, segundo o artigo do W3C com dados da IBM: fonte inglesa de até 10 caracteres expande 200 a 300%; 11 a 20 caracteres, 180 a 200%; 21 a 30, 160 a 180%; 31 a 50, 140 a 160%; 51 a 70, 151 a 170% (como impresso); acima de 70, 130% (S44). O artigo recomenda layouts flexíveis e alerta que tradução curta demais também causa problemas (S44).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Script próprio que carrega en.json e pt-BR.json e compara conjuntos de chaves em achatado, tipos de valor e placeholders | Não | Quase zero; sem dependência | Chave ausente em um idioma, tipo divergente, placeholder diferente | Chave usada no código e ausente nos dois idiomas |
| @lingual/i18n-check com -s en e -f i18next | Não | Dependência de desenvolvimento | Chaves ausentes, inválidas, não usadas e indefinidas | Formato de mensagens próprio do projeto pode não ser reconhecido; a leitura do código depende do analisador (S38) |
| Regra no-literal-string em modo jsx-only ou all no ESLint | Não | Dependência de desenvolvimento; ajuste de words, callees e jsx-attributes para reduzir ruído | Texto fixo em JSX e em atributos (title, aria-label, placeholder) | Strings montadas fora de JSX, texto em módulos de dados, dependendo do modo (S41) |
| Pseudo-localização (expansão sintética em até 300% para textos curtos, conforme S44) rodando o editor no Playwright com medição de overflow | Sim | Um idioma sintético além de en e pt-BR | Texto cortado, quebra indevida, rolagem lateral | Erros de gramática e de gênero |
| Teste de plural: para cada chave plural, Intl.PluralRules do idioma enumera as categorias e o teste exige uma forma para cada uma | Não | Baixo | Categoria de plural sem forma definida | Qualidade da tradução |
| Teste de número: Intl.NumberFormat com o locale da interface contra a entrada do campo numérico (vírgula decimal em pt-BR) | Não | Baixo | Formatação e leitura divergentes entre en e pt-BR | O que o Intl não oferece: leitura de texto local para número exige código próprio (S43) |

### Avaliação

- O projeto não tem biblioteca de i18n no package.json; o formato dos arquivos de mensagens do projeto decide se i18n-check reconhece as chaves. A comparação por script próprio de dois JSON é a opção sem dependência e tem custo mínimo.
- A regra no-literal-string é a técnica que impede texto fixo no código; seu modo all gera ruído em strings técnicas e exige listas de exceção (S41).
- eslint-plugin-i18next não declara peerDependencies e foi testado com eslint 9 (S39); a compatibilidade com eslint 10 do projeto não está documentada e precisa ser verificada por execução.
- O pacote i18next-parser está arquivado; recomendação de não adotá-lo (S36).

---

## 5. Carregamento de fontes alterando medidas

### Fato documentado

- document.fonts é um FontFaceSet; document.fonts.ready resolve quando todas as fontes do documento foram resolvidas e o layout terminou; os eventos loading, loadingdone e loadingerror expõem event.fontfaces; FontFace.status assume unloaded, loading, loaded ou failed; fonte com origem por URL fica unloaded até load() (S45). API Baseline amplamente disponível desde janeiro de 2020 (S45).
- font-display tem valores auto, block, swap, fallback e optional; swap tem período de bloqueio mínimo e período de troca infinito, ou seja, a fonte web pode entrar a qualquer momento (S47). optional usa a fonte web só se ela já estiver disponível no layout inicial (S47, S48).
- A web.dev afirma que tanto FOUT quanto FOIT podem causar deslocamento de layout e recomenda font-display optional, fallback casado, preload e os descritores size-adjust, ascent-override, descent-override e line-gap-override (S48). size-adjust é Baseline amplamente disponível desde setembro de 2023 (S46). A página de size-adjust lida não cobre os demais descritores (S46).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Esperar document.fonts.ready antes de qualquer medição no Playwright e falhar se document.fonts conter FontFace com status diferente de loaded | Sim | Baixo | Medida tomada antes de a fonte carregar; fonte que falhou | Troca que acontece depois do ready, por exemplo fonte pedida mais tarde por texto novo |
| Escutar loadingdone no addInitScript e comparar bounding boxes de elementos-sentinela antes e depois | Sim | Baixo | Mudança real de medida causada pela troca de fonte | Elementos que não são sentinelas |
| Layout Shift via PerformanceObserver type layout-shift durante o carregamento | Sim, Chromium | Baixo | Deslocamento causado por troca de fonte | Não distingue fonte de outras causas sem atribuição de fontes dos nós |
| Medição com fonte local do sistema e com a fonte web, comparando larguras de textos de referência | Sim | Médio | Diferença de métrica entre fallback e fonte web | O desenho real em outras plataformas |

### Avaliação

- A regra de medição do projeto (CLAUDE.md seção 8) mede dimensão e quebra de linha no navegador; essas medidas só são válidas depois de document.fonts.ready, e vale um portão que registre o status de cada FontFace junto de cada medição.
- Fontes carregadas depois do ready (texto novo em outro peso, por exemplo) invalidam medições já tomadas; o evento loadingdone é a sonda para isso.

---

## 6. Zoom e devicePixelRatio

### Fato documentado

- devicePixelRatio é um double; muda com o zoom do navegador e com troca de monitor ou de escala do sistema; pinch-zoom não o altera. Não existe evento próprio: monitora-se com matchMedia de (resolution: Xdppx) recriada a cada mudança (S49). A página marca como disponibilidade limitada na tabela, e o exemplo de canvas usa Math.floor(size * scale) (S49).
- VisualViewport (Baseline desde agosto de 2021) traz scale, width, height, offsetLeft, offsetTop, pageLeft, pageTop e eventos resize, scroll e scrollend; em iframes, width e height sempre igualam o layout viewport; a página trata de pinch-zoom e não descreve o efeito do zoom do navegador (S50).
- A propriedade CSS zoom foi padronizada no módulo CSS Viewport Level 1; Baseline 2024, Newly available desde maio de 2024; afeta o layout, ao contrário de transform scale (S51). Os valores normal e reset são não padronizados (S51).
- Element.currentCSSZoom é o produto dos zoom do elemento e dos ancestrais; vale 1 sem caixa CSS; Baseline 2026, Newly available desde março de 2026 (S52). getBoundingClientRect já inclui o efeito do zoom; propriedades relativas ao elemento (clientWidth, clientHeight, scroll, offset) não incluem, e a MDN manda multiplicar por currentCSSZoom (S52).
- getBoundingClientRect devolve DOMRect relativo ao viewport, que muda com a rolagem (S53). A página não discute fracionários, transformações nem zoom (S53).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Matriz Playwright com deviceScaleFactor 1, 1.25, 1.5 e 2, e viewport fixo, rodando as mesmas medições de layout | Sim | Multiplica o tempo de execução pelo número de escalas | Defeito que só aparece em escala fracionária (arredondamento de subpixel, linha de 1 px sumindo) | Zoom do navegador feito pelo usuário (Ctrl +), que o Playwright não emula como o navegador real |
| Leitura de currentCSSZoom do iframe e conferência de que ponto no canvas = posição do iframe + posição do nó x currentCSSZoom (fórmula do CLAUDE.md seção 8) em cada escala | Sim | Baixo | Conversão de coordenadas errada entre iframe e página | Defeito de pintura |
| Observador de devicePixelRatio por matchMedia resolution, com teste que muda a escala via CDP Emulation.setDeviceMetricsOverride e verifica se o editor recalcula | Sim, Chromium | Baixo | Editor que não reage a mudança de escala com a página aberta | Mudança por zoom do navegador real |
| Comparação de rects antes e depois de alterar zoom do iframe, com tolerância baseada em 1/devicePixelRatio | Sim | Baixo | Medida que muda além do arredondamento esperado | Defeitos abaixo da tolerância |

### Avaliação

- A fórmula do CLAUDE.md para ponto no canvas usa iframe.currentCSSZoom, o que está alinhado a S52. O fato de currentCSSZoom ser Baseline 2026 Newly available (S52) implica que navegadores mais antigos dentro da faixa de suporte podem não ter a propriedade; a checagem "currentCSSZoom in Element.prototype" aparece no exemplo da MDN (S52).
- Valores lidos de client* e offset* dentro do iframe sem multiplicar por currentCSSZoom são a classe de erro explicitamente descrita por S52; uma busca estática por esses usos é possível e barata.

---

## 7. Compatibilidade entre navegadores

### Fato documentado

- @mdn/browser-compat-data 8.1.5 é a versão latest do registro; o projeto instala 8.1.2 (S54). O esquema: cada feature tem um nó __compat com support (por navegador), status (standard_track, deprecated, experimental), version_added (false, versão, faixa como "≤50" ou "preview"), version_removed, prefix, alternative_name, flags, partial_implementation e notes (S55). Os identificadores de navegador incluem chrome, chrome_android, edge, firefox, firefox_android, safari, safari_ios, samsunginternet_android, webview_android, entre outros (S55). A MDN declara que o campo experimental está obsoleto em favor de medidas como Baseline (S55).
- Consulta em Node: import bcd from '@mdn/browser-compat-data' with { type: 'json' }, ou require; acesso por caminho, por exemplo bcd.css.properties.background.__compat ou bcd['api']['Document']['body']['__compat']; chaves de topo api, browsers, css, html, http, javascript, svg, webassembly entre outras; __meta traz version e timestamp (S56).
- eslint-plugin-compat 7.0.2 depende de @mdn/browser-compat-data ^6.1.1 e browserslist ^4.25.2, tem peer eslint ^9.0.0 ou ^10.0.0 e exige Node 22 ou superior (S57). Detecta uso de APIs web (fetch, Promise); a verificação de APIs ES é experimental e fica desligada (settings.lintAllEsApis); lê os navegadores-alvo da configuração browserslist; settings.polyfills marca APIs cobertas; verificações condicionais como if (fetch) não são reportadas por padrão; configuração flat com compat.configs["flat/recommended"] (S58). A página não lista limitações (S58).
- doiuse 6.0.6 verifica CSS contra caniuse-lite; a página descreve a detecção como "bastante ingênua", por expressão regular ou subtexto sobre nomes de propriedade e, quando a feature lista valores, também sobre o valor; opções browsers, ignore, ignoreFiles, onFeatureUsage; comentários doiuse-disable e doiuse-enable (S59, S60). stylelint-no-unsupported-browser-features 8.1.2 usa doiuse 6.0.6 e exige stylelint >= 16.0.2 (S61).
- browserslist: consultas com defaults, last 2 versions, > 0.5%; combinadores or, and, not; configuração em package.json, .browserslistrc ou variável BROWSERSLIST; npx browserslist lista os navegadores resultantes; a fonte é caniuse-lite, atualizada por update-browserslist-db; a página cita consultas por suporte de Baseline e por feature do Can I Use (S62).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Script que extrai de src todas as propriedades CSS, métodos e interfaces usadas e consulta @mdn/browser-compat-data (já instalado, versão 8.1.2) por caminho, comparando version_added com as versões mínimas dos navegadores-alvo | Não | Script próprio; sem dependência nova; os dados do projeto são os mais novos (8.x) | Feature sem suporte nos navegadores-alvo, flags, prefixos, implementação parcial (partial_implementation) | Comportamento divergente de feature suportada; depende da qualidade da extração dos nomes |
| eslint-plugin-compat | Não | Dependência de desenvolvimento; traz sua própria cópia de BCD 6.x (S57) | APIs web nos navegadores-alvo do browserslist | Dados mais antigos que o BCD 8.x do projeto; instância de método e CSS não são documentados como cobertos (S58) |
| doiuse ou stylelint-no-unsupported-browser-features | Não | Dependência de desenvolvimento | Propriedades CSS sem suporte segundo caniuse | Features recentes ausentes do caniuse; detecção por nome é ingênua (S60) |
| Execução do mesmo roteiro Playwright em chromium, firefox e webkit | Sim | Triplica o tempo; WebKit do Playwright não é o Safari real | Diferenças reais de layout, de foco e de eventos | Versões antigas dos navegadores |
| npx browserslist para listar e cobrir os navegadores-alvo | Não | Mínimo | Documenta o alvo | Não verifica código |

### Avaliação

- Como o projeto já instala BCD 8.1.2, o script próprio consulta os dados mais novos e evita a cópia 6.x que o eslint-plugin-compat traz (S57). O custo é escrever a extração de nomes.
- O projeto não declara campo browserslist no package.json (leitura de package.json em 2026-10-08); sem alvo declarado, nenhuma das ferramentas acima tem referência. Declarar o alvo é pré-requisito.
- Os dois lados do Baseline aparecem nas fontes: currentCSSZoom está como Baseline 2026 Newly available e zoom como Baseline 2024 Newly available (S51, S52); o alvo de navegadores define se o editor pode depender deles.

---

## 8. Precisão numérica e unidades

### Fato documentado

- Number.EPSILON vale 2^-52; serve como limiar só para valores de magnitude perto de 1; para magnitudes maiores a MDN mostra tolerância escalada (2000 * Number.EPSILON para valores em torno de 2000); o limiar deve refletir a exatidão da entrada (S63).
- Em CSS, 1in = 96px, 1px = 1/96 in; em é o tamanho da fonte do elemento, rem é o da raiz; percentual é relativo a uma grandeza que cada propriedade define (S64). A página não trata de precisão (S64).
- A especificação CSS Values 4 diz que precisão e faixa dos números são definidas pela implementação, que valores não suportados viram o mais próximo suportado, que o px é a unidade canônica na serialização de comprimentos computados e que inteiros arredondam o meio-termo para +infinito (S65). Para bordas: valores entre 0 e 1 pixel de dispositivo sobem para 1, e valores acima de 1 descem para o inteiro de pixels de dispositivo (S65). A leitura cobriu os primeiros 100000 caracteres de 253104.
- tldraw (código do ramo main lido em 2026-10-08): approximately(a, b, precision = 0.000001) compara por diferença absoluta; toPrecision arredonda com fator 1e10; toDomPrecision arredonda a 4 casas; toFixed arredonda a 2 casas; isSafeFloat compara com Number.MAX_SAFE_INTEGER; um comentário no código registra que igualdade exata de ponto flutuante com resultado de raiz quadrada praticamente nunca dispara (S66). O comentário de toDomPrecision cita 3 casas e o código usa 4 (S66). O limiar de encaixe do tldraw é definido em pixels de tela (8 por padrão) e convertido por getSnapThreshold dividindo pelo zoom (S67).
- Não há fonte aberta nesta pesquisa sobre a abordagem do Figma.

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Teste de propriedades com fast-check (já instalado, versão ^4.10.2): para valores aleatórios em px, em, rem e %, converter ida e volta e exigir igualdade dentro de tolerância relativa | Não | Baixo | Erro acumulado de conversão, arredondamento assimétrico, perda ao serializar e reler | Valor que só o navegador calcula (px usado, snapping de subpixel) |
| Tolerância relativa escalada à magnitude em vez de Number.EPSILON fixo, aplicada nas asserções numéricas | Não | Baixo | Falso defeito por diferença de 1 ulp em valores grandes (S63) | Erro maior que a tolerância escolhida |
| Teste de idempotência: aplicar a mesma transformação duas vezes e exigir o mesmo resultado serializado | Não | Baixo | Arredondamento que deriva a cada edição (arraste, redimensionamento) | Deriva que só aparece após muitas operações diferentes |
| Medir no navegador o valor usado (getBoundingClientRect, getComputedStyle) e comparar com o valor gravado no documento nas escalas 1 e 1.25 | Sim | Médio | Divergência entre o valor gravado e o valor que o navegador usa após arredondar | Casos fora das escalas testadas |
| Busca estática por comparações === entre resultados de operações aritméticas em número | Não | Baixo | Igualdade exata de ponto flutuante (padrão registrado como problema em S66) | Comparações feitas por abstração |

### Avaliação

- O tldraw separa três precisões distintas (comparação com 1e-6, DOM com 4 casas, armazenamento com 2 casas ou 10 casas) em funções nomeadas (S66); a lição aplicável é concentrar arredondamento em um ponto único, o que combina com a regra de ponto garantidor do CLAUDE.md do projeto.
- Number.EPSILON como limiar fixo é inadequado para coordenadas grandes (S63); o limiar deve ser relativo.
- A falta de fonte sobre o Figma fica registrada como lacuna: nenhuma afirmação sobre o Figma foi feita.

---

## 9. Desempenho com documentos grandes

### Fato documentado

- tldraw (página editada em 2026-01-31): oculta formas fora da viewport com display none (culling); formas selecionadas ou em edição nunca são removidas; sinais reativos em vez de estado do React, de forma que só componentes dependentes re-renderizam; atualizações em lote por createShapes, updateShapes e editor.run; getEfficientZoomLevel mantém zoom estável durante o movimento da câmera para documentos acima de 500 formas; cache de geometria invalidado só por mudança de props; nível de detalhe por zoom; opções debouncedZoomThreshold (500) e maxShapesPerPage (4000); recomenda medir com editor.getCurrentPageShapeIds().size, perfilar builds de produção e usar editor.performance para telemetria (S68).
- Excalidraw: a página do repositório não traz documentação de desempenho nem de benchmark; indica Vitest (S69).
- Virtualização: o janelamento renderiza só os itens na janela visível, reduz o número de nós do DOM e o custo de estilo e de mutação do DOM; overscan reduz brancos na rolagem mas custa desempenho se for grande (S72, atualizada em 2019-04-29). @tanstack/react-virtual 3.14.13 é headless, expõe useVirtualizer com count, getScrollElement e estimateSize, e suporta React até 19 (S70, S71).
- Custo de layout cresce com o número de elementos que precisam de layout, em geral com o escopo do documento inteiro; layout síncrono forçado ocorre ao ler propriedade de layout depois de alterar estilos; layout thrashing é a alternância de leituras e escritas; detecção: trace de Performance no DevTools e o insight Forced Reflow; em campo, forcedStyleAndLayoutDuration do LoAF (S73, atualizada em 2025-05-07).
- Vitest 5.0.3 tem modo browser com provider Playwright e instances para chromium, firefox e webkit; a página não afirma a disponibilidade de layout real nem de getBoundingClientRect (S74). happy-dom é descrito como implementação de navegador sem interface gráfica; as páginas lidas não declaram nada sobre layout (S75, S76).

### Técnicas de detecção concretas

| Técnica | Precisa de navegador | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Gerador de documento sintético profundo e largo (por exemplo 1000, 5000 e 10000 blocos) e medição por ação (selecionar, editar propriedade, abrir Camadas) com LoAF e contagem de commits do Profiler | Sim | Gerador próprio; minutos por varredura | Curva de custo por tamanho do documento; ação cujo custo cresce com o documento inteiro | Defeitos em documentos de formato diferente do gerado |
| Contagem de nós do DOM da árvore de Camadas por tamanho de documento (document.querySelectorAll dentro do painel) | Sim ou happy-dom para a contagem | Baixo | Árvore que renderiza todos os nós em vez de uma janela | Custo de cada nó |
| Medida de layout: PerformanceObserver long-animation-frame, campos renderStart, styleAndLayoutStart e forcedStyleAndLayoutDuration, durante a ação | Sim, Chromium | Baixo | Layout forçado e tempo de estilo e layout por quadro | Firefox e Safari |
| Trace do Chrome por CDP (Tracing.start) ou pelo Playwright em ações do roteiro, buscando eventos de Layout e contagem de nós | Sim | Alto na análise do trace | Origem do layout forçado | Custo agregado sem análise |
| Roteiro de teclado e de ARIA da árvore virtualizada: foco preservado ao rolar, aria-setsize e aria-posinset corretos | Sim | Médio | Perda de foco e de atributos quando o nó focado sai da janela | Usabilidade com leitor de tela real |

### Avaliação

- A virtualização da árvore de Camadas tem custo de acessibilidade explícito no APG: aria-level, aria-setsize e aria-posinset passam a ser obrigatórios (S31); o item selecionado ou com foco precisa continuar montado, como o tldraw faz com formas selecionadas (S68).
- O render do canvas em iframe é um problema de layout do documento do iframe e não de virtualização de lista; a medida pertinente é a de estilo e layout por quadro (S73, S18), com documento sintético crescente.
- Como as páginas de happy-dom lidas não declaram nada sobre layout, qualquer teste que dependa de dimensão fica no navegador, como já determina a seção 8 do CLAUDE.md.

---

## Lacunas desta pesquisa

- A página de asserções de memória do memlab (guides/memory-assertions-in-node) retornou 404; a funcionalidade vem só da menção em S1.
- A definição do tipo RunOptions do memlab não foi aberta.
- A página da regra de eslint-plugin-i18next foi aberta em sua versão do ramo master; a documentação não declara compatibilidade com eslint 10.
- Sem fonte aberta sobre precisão numérica no Figma.
- Compatibilidade de axe-core com happy-dom 20.x não está documentada nas fontes abertas; só JSDOM é mencionada (S26).
- Não há fonte aberta que descreva react-scan em CI.
