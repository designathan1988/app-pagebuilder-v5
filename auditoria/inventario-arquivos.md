# Inventário de arquivos

# Stack (ferramentas)

| pacote | versão instalada | consultas |
|---|---|---|
| html-validate | 11.16.0 | 2026-10-08: https://html-validate.org/dev/using-api.html ; https://github.com/html-validate/html-validate/tree/v11.16.0 ; https://github.com/html-validate/html-validate/tree/v11.16.0/docs/api ; https://github.com/html-validate/html-validate/blob/v11.16.0/docs/api/metadata-helper.md |
| fast-check | 4.10.2 | 2026-10-08: https://fast-check.dev/docs/introduction/ ; https://fast-check.dev/docs/core-blocks/properties/ ; https://fast-check.dev/docs/core-blocks/arbitraries/ ; https://github.com/dubzzz/fast-check/releases/tag/v4.10.2 ; https://github.com/dubzzz/fast-check/tree/v4.10.2 |
| vitest | 5.0.1 | 2026-10-08: https://vitest.dev/api/ ; https://vitest.dev/config/ ; https://vitest.dev/api/describe ; https://vitest.dev/api/expect ; https://vitest.dev/api/vi ; https://github.com/vitest-dev/vitest/tree/v5.0.1 ; https://github.com/vitest-dev/vitest/releases/tag/v5.0.1 |
| @playwright/test | 1.63.0 | 2026-10-08: https://playwright.dev/docs/api/class-browsertype ; https://playwright.dev/docs/api/class-page ; https://playwright.dev/docs/api/class-route ; https://github.com/microsoft/playwright/releases/tag/v1.63.0 |
| vite | 8.3.0 | 2026-10-08: https://vite.dev/config/ ; https://vite.dev/guide/api-plugin ; https://vite.dev/config/build-options ; https://vite.dev/config/server-options ; https://github.com/vitejs/vite/tree/v8.3.0 |
| @vitejs/plugin-react | 6.1.1 | 2026-10-08: https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react ; https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/CHANGELOG.md |
| eslint | 10.11.0 | 2026-10-08: https://eslint.org/docs/latest/use/configure/configuration-files ; https://eslint.org/docs/latest/integrate/nodejs-api ; https://github.com/eslint/eslint/releases/tag/v10.11.0 |
| @eslint/js | 10.0.1 | 2026-10-08: https://github.com/eslint/eslint/tree/v10.11.0/packages/js ; https://registry.npmjs.org/@eslint/js/10.0.1 |
| @eslint/css | 2.0.0 | 2026-10-08: https://github.com/eslint/css ; https://registry.npmjs.org/@eslint/css/2.0.0 |
| @eslint/core | 1.2.1 | 2026-10-08: https://github.com/eslint/rewrite/tree/main/packages/core ; https://github.com/eslint/rewrite/blob/main/packages/core/src/types.ts ; https://registry.npmjs.org/@eslint/core/1.2.1 |
| eslint-plugin-react-hooks | 7.1.1 | 2026-10-08: https://react.dev/reference/eslint-plugin-react-hooks ; https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks ; https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md |
| globals | 17.12.0 | 2026-10-08: https://github.com/sindresorhus/globals ; https://github.com/sindresorhus/globals/tree/v17.12.0 |
| typescript-eslint | 8.70.1 | 2026-10-08: https://typescript-eslint.io/packages/typescript-eslint ; https://typescript-eslint.io/users/configs ; https://registry.npmjs.org/typescript-eslint/8.70.1 |
| @typescript-eslint/utils | 8.70.1 | 2026-10-08: https://typescript-eslint.io/packages/utils ; https://registry.npmjs.org/@typescript-eslint/utils/8.70.1 |
| dependency-cruiser | 18.5.0 | 2026-10-08: https://github.com/sverweij/dependency-cruiser/blob/v18.5.0/doc/rules-reference.md |
| es-module-lexer | 2.3.2 | 2026-10-08: https://github.com/guybedford/es-module-lexer ; https://github.com/guybedford/es-module-lexer/tree/2.3.2 |
| @mdn/browser-compat-data | 8.1.2 | 2026-10-08: https://github.com/mdn/browser-compat-data/tree/v8.1.2/schemas ; https://github.com/mdn/browser-compat-data/blob/v8.1.2/schemas/compat-data-schema.md |
| @webref/css | 8.7.5 | 2026-10-08: https://github.com/w3c/webref/tree/main/packages/css ; https://github.com/w3c/webref/blob/main/packages/css/CHANGELOG.md ; https://registry.npmjs.org/@webref/css/8.7.5 |
| source-map-js | 1.2.2 | 2026-10-08: https://github.com/7rulnik/source-map-js ; https://github.com/7rulnik/source-map-js/blob/master/CHANGELOG.md ; https://registry.npmjs.org/source-map-js/1.2.2 |

## html-validate 11.16.0
- **URL consultada:** https://html-validate.org/dev/using-api.html
- **URL consultada:** https://github.com/html-validate/html-validate/tree/v11.16.0
- **URL consultada:** https://github.com/html-validate/html-validate/tree/v11.16.0/docs/api
- **URL consultada:** https://github.com/html-validate/html-validate/blob/v11.16.0/docs/api/metadata-helper.md
- **Confirmado:** A página de API (exibida na versão 11.16.2) descreve a classe HtmlValidate e os métodos validateString(markup, filename, config, hooks), validateFile e validateSource, além de configuradores e resolvedores. Na tag v11.16.0, o documento docs/api/metadata-helper.md descreve o metadataHelper (allowedIfAttributeIsPresent, allowedIfAttributeIsAbsent, allowedIfAttributeHasValue, allowedIfParentIsPresent, hasKeyword) usado com defineMetadata para definir os atributos de elementos; o método getMetaTable não aparece nos documentos consultados.

## fast-check 4.10.2
- **URL consultada:** https://fast-check.dev/docs/introduction/
- **URL consultada:** https://fast-check.dev/docs/core-blocks/properties/
- **URL consultada:** https://fast-check.dev/docs/core-blocks/arbitraries/
- **URL consultada:** https://github.com/dubzzz/fast-check/releases/tag/v4.10.2
- **URL consultada:** https://github.com/dubzzz/fast-check/tree/v4.10.2
- **Confirmado:** O README na tag v4.10.2 mostra o import `import fc from 'fast-check'` e o uso de fc.assert(fc.property(...)); a página de propriedades documenta fc.property(...arbitraries, predicate), com retorno true ou undefined como sucesso e false como falha, as precondições fc.pre e o esquema "for all (x, y, ...) such that precondition ... holds"; a página de arbitrários descreve as famílias Primitives, Composites, Combiners e Fake data, com os combinadores oneof, option, letrec, filter, map e chain. A tag v4.10.2 existe no repositório oficial.

## vitest 5.0.1
- **URL consultada:** https://vitest.dev/api/
- **URL consultada:** https://vitest.dev/config/
- **URL consultada:** https://vitest.dev/api/describe
- **URL consultada:** https://vitest.dev/api/expect
- **URL consultada:** https://vitest.dev/api/vi
- **URL consultada:** https://github.com/vitest-dev/vitest/tree/v5.0.1
- **URL consultada:** https://github.com/vitest-dev/vitest/releases/tag/v5.0.1
- **Confirmado:** As páginas de API (exibidas na versão 5.0.3) definem describe(name, body?, timeout?) e describe(name, options, body?) com alias suite e os modificadores skip, skipIf, runIf, only, concurrent, shuffle, todo, each e for; it/test(name, body?, timeout?) com marcação todo quando falta o corpo; expect como asserções compatíveis com chai e Jest, com soft, poll, assert, extend e os matchers toBe, toEqual e toThrow; vi exportado por 'vitest' com vi.mock elevado ao topo, vi.fn, vi.spyOn e temporizadores falsos, com membros marcados 5.0.0+ (vi.when e vi.isWhenChain). A página de configuração mostra defineConfig importado de 'vitest/config' com configDefaults e mergeConfig; as notas da versão 5.0.1 registram recursos de interface e correções.

## @playwright/test 1.63.0
- **URL consultada:** https://playwright.dev/docs/api/class-browsertype
- **URL consultada:** https://playwright.dev/docs/api/class-page
- **URL consultada:** https://playwright.dev/docs/api/class-route
- **URL consultada:** https://github.com/microsoft/playwright/releases/tag/v1.63.0
- **Confirmado:** A referência de API descreve chromium.launch com channel (por exemplo "chrome") e headless, as opções viewport (padrão 1280x720), locale e deviceScaleFactor em contextos, page.goto com waitUntil e timeout, page.evaluate com serialização do retorno e route.fulfill com as opções body, json, status, headers e path. As notas da versão 1.63.0 registram test locks, locator.visible(), test.step com subtitle e params e frameLocator sem seletor; as páginas de referência não exibem o número 1.63.0 e a versão foi confirmada pela página de release.

## vite 8.3.0
- **URL consultada:** https://vite.dev/config/
- **URL consultada:** https://vite.dev/guide/api-plugin
- **URL consultada:** https://vite.dev/config/build-options
- **URL consultada:** https://vite.dev/config/server-options
- **URL consultada:** https://github.com/vitejs/vite/tree/v8.3.0
- **Confirmado:** A documentação (páginas exibidas na versão 8.3.3) descreve defineConfig importado de 'vite' (objeto ou função assíncrona), a seção build (build.target com padrão 'baseline-widely-available', build.outDir com padrão dist, build.minify com padrão 'oxc' e build.watch) e server.watch (tipo object ou null, com opções do chokidar e do watcher do Rolldown); a página da API de plugins descreve o campo plugins, os hooks resolveId, load e transform e os hooks próprios config, configResolved, configureServer e transformIndexHtml. A tag v8.3.0 existe no repositório oficial.

## @vitejs/plugin-react 6.1.1
- **URL consultada:** https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react
- **URL consultada:** https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/CHANGELOG.md
- **Confirmado:** O README descreve o plugin react() como padrão para projetos React (Fast Refresh e runtime automático de JSX) com as opções include, exclude, jsxImportSource, jsxRuntime, reactRefreshHost e compiler; o CHANGELOG oficial registra a versão 6.1.1 (2026-08-28), com a nova opção compiler.logDiagnostics.

## eslint 10.11.0
- **URL consultada:** https://eslint.org/docs/latest/use/configure/configuration-files
- **URL consultada:** https://eslint.org/docs/latest/integrate/nodejs-api
- **URL consultada:** https://github.com/eslint/eslint/releases/tag/v10.11.0
- **Confirmado:** A página de arquivos de configuração (exibida na versão 10.12.0) descreve defineConfig e globalIgnores importados de "eslint/config", os nomes reconhecidos de eslint.config.js e as propriedades de um objeto de configuração; a página da API Node.js descreve a classe Linter com verify(code, config, options), getSourceCode e verifyAndFix. As notas da versão 10.11.0 estão publicadas no repositório oficial.

## @eslint/js 10.0.1
- **URL consultada:** https://github.com/eslint/eslint/tree/v10.11.0/packages/js
- **URL consultada:** https://registry.npmjs.org/@eslint/js/10.0.1
- **Confirmado:** O README do pacote no repositório eslint (tag v10.11.0) descreve as configurações recommended (substitui "eslint:recommended") e all, aplicadas com extends: ["js/recommended"]; o registro npm confirma a versão 10.0.1 do @eslint/js, com a dependência de pares eslint ^10.0.0.

## @eslint/css 2.0.0
- **URL consultada:** https://github.com/eslint/css
- **URL consultada:** https://registry.npmjs.org/@eslint/css/2.0.0
- **Confirmado:** O README oficial descreve a linguagem "css/css" para analisar folhas CSS, o plugin registrado em plugins: { css } e a configuração recommended aplicada com extends: ["css/recommended"] sobre files: ["**/*.css"], com regras de prefixo css/ e os modos tolerant e customSyntax; o registro npm confirma a versão 2.0.0 do @eslint/css.

## @eslint/core 1.2.1
- **URL consultada:** https://github.com/eslint/rewrite/tree/main/packages/core
- **URL consultada:** https://github.com/eslint/rewrite/blob/main/packages/core/src/types.ts
- **URL consultada:** https://registry.npmjs.org/@eslint/core/1.2.1
- **Confirmado:** O arquivo oficial de tipos (packages/core/src/types.ts, branch main) define o tipo RuleVisitor e a interface RuleDefinition com os membros meta e create; o registro npm confirma a versão 1.2.1 do @eslint/core.

## eslint-plugin-react-hooks 7.1.1
- **URL consultada:** https://react.dev/reference/eslint-plugin-react-hooks
- **URL consultada:** https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
- **URL consultada:** https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md
- **Confirmado:** O README no repositório oficial descreve reactHooks.configs.flat.recommended (e a variante recommended-latest) para a configuração flat; o CHANGELOG registra a versão 7.1.1, que devolve a regra component-hook-factories como no-op depreciado por compatibilidade. A página do react.dev está marcada como rc e não descreve a configuração flat.

## globals 17.12.0
- **URL consultada:** https://github.com/sindresorhus/globals
- **URL consultada:** https://github.com/sindresorhus/globals/tree/v17.12.0
- **Confirmado:** O README descreve globals.browser (objeto com globais de navegador marcados com true ou false), globals.nodeBuiltin e globals.node (nodeBuiltin mais os argumentos CommonJS); a tag v17.12.0 existe no repositório oficial.

## typescript-eslint 8.70.1
- **URL consultada:** https://typescript-eslint.io/packages/typescript-eslint
- **URL consultada:** https://typescript-eslint.io/users/configs
- **URL consultada:** https://registry.npmjs.org/typescript-eslint/8.70.1
- **Confirmado:** A página de configurações prontas (exibida na versão 8.71.1) documenta configs.strict (strict inclui recommended mais regras opinativas; strict-type-checked reúne strict e recommended-type-checked) e avisa que strict e strict-type-checked não são consideradas estáveis sob SemVer; a página do pacote descreve o export configs e tseslint.configs.recommended. O registro npm confirma a versão 8.70.1 do typescript-eslint.

## @typescript-eslint/utils 8.70.1
- **URL consultada:** https://typescript-eslint.io/packages/utils
- **URL consultada:** https://registry.npmjs.org/@typescript-eslint/utils/8.70.1
- **Confirmado:** A página do pacote lista o export TSESTree como os tipos da variante TypeScript do ESTree, além de ESLintUtils, AST_NODE_TYPES, AST_TOKEN_TYPES, JSONSchema e ParserServices; o registro npm confirma a versão 8.70.1 do @typescript-eslint/utils.

## dependency-cruiser 18.5.0
- **URL consultada:** https://github.com/sverweij/dependency-cruiser/blob/v18.5.0/doc/rules-reference.md
- **Confirmado:** A referência de regras na tag v18.5.0 documenta a condição circular e a regra de exemplo no-circular, com os atributos via e viaOnly; a opção tsPreCompilationDeps aparece com o valor "specify" junto da condição preCompilationOnly (válida apenas para fontes TypeScript), e a estrutura de regras (from, to, name, severity e options) é descrita na mesma página.

## es-module-lexer 2.3.2
- **URL consultada:** https://github.com/guybedford/es-module-lexer
- **URL consultada:** https://github.com/guybedford/es-module-lexer/tree/2.3.2
- **Confirmado:** O README descreve import { init, parse } de 'es-module-lexer', o await init() antes do parse(source) e o retorno [imports, exports] com os campos s, e, ss, se, n, t e d (facade e hasModuleSyntax apenas no build completo); a tag 2.3.2 existe no repositório oficial.

## @mdn/browser-compat-data 8.1.2
- **URL consultada:** https://github.com/mdn/browser-compat-data/tree/v8.1.2/schemas
- **URL consultada:** https://github.com/mdn/browser-compat-data/blob/v8.1.2/schemas/compat-data-schema.md
- **Confirmado:** O esquema compat-data-schema.md na tag v8.1.2 descreve a organização por diretórios de área (api, css, html, http, javascript, manifests, mathml, mediatypes, svg, webdriver, webextensions, webassembly), os identificadores hierárquicos (por exemplo css.properties.text-align), o objeto __compat com support e status e as propriedades de suporte com version_added obrigatória; a pasta schemas da tag v8.1.2 contém browsers.schema.json, compat-data.schema.json e public.schema.json.

## @webref/css 8.7.5
- **URL consultada:** https://github.com/w3c/webref/tree/main/packages/css
- **URL consultada:** https://github.com/w3c/webref/blob/main/packages/css/CHANGELOG.md
- **URL consultada:** https://registry.npmjs.org/@webref/css/8.7.5
- **Confirmado:** O README do pacote descreve css.json com os métodos assíncronos listAll() e index() e as categorias atrules, functions, properties, selectors e types, com name e href em todos os itens e a declaração de que os valores de sintaxe são parseáveis pela versão do CSSTree em peerDependencies; o registro npm confirma a versão 8.7.5 do @webref/css. O CHANGELOG consultado no repositório não lista entrada da 8.7.5.

## source-map-js 1.2.2
- **URL consultada:** https://github.com/7rulnik/source-map-js
- **URL consultada:** https://github.com/7rulnik/source-map-js/blob/master/CHANGELOG.md
- **URL consultada:** https://registry.npmjs.org/source-map-js/1.2.2
- **Confirmado:** O README descreve SourceMapConsumer (originalPositionFor, generatedPositionFor, allGeneratedPositionsFor, eachMapping e sourceContentFor), além de SourceMapGenerator e SourceNode; o registro npm confirma a versão 1.2.2 do source-map-js. O CHANGELOG consultado na branch master não mostra entrada da 1.2.2.

# Stack

| pacote | versão instalada | consultas |
|---|---|---|
| react | 19.3.0 | 2026-10-08: https://react.dev/reference/react ; https://react.dev/reference/react/hooks ; https://github.com/facebook/react/releases/tag/v19.3.0 |
| react-dom | 19.3.0 | 2026-10-08: https://react.dev/reference/react-dom ; https://react.dev/reference/react-dom/client/createRoot |
| zod | 4.6.5 | 2026-10-08: https://zod.dev/api ; https://github.com/colinhacks/zod/blob/v4.6.5/packages/zod/README.md |
| css-tree | 3.2.1 | 2026-10-08: https://github.com/csstree/csstree/tree/v3.2.1/docs ; https://github.com/csstree/csstree/blob/v3.2.1/docs/parsing.md |
| html-to-image | 1.11.13 | 2026-10-08: https://github.com/bubkoo/html-to-image/tree/v1.11.13 |
| happy-dom | 20.14.5 | 2026-10-08: https://github.com/capricorn86/happy-dom/wiki ; https://github.com/capricorn86/happy-dom/tree/v20.14.5 |
| ws | 8.21.3 | 2026-10-08: https://github.com/websockets/ws/blob/8.21.3/doc/ws.md |
| parse5 | 8.0.1 | 2026-10-08: https://parse5.js.org/ ; https://parse5.js.org/modules/parse5.html |
| lottie-web | 5.13.0 | 2026-10-08: https://github.com/airbnb/lottie-web/tree/v5.13.0 |
| typescript | 6.0.3 | 2026-10-08: https://www.typescriptlang.org/tsconfig/ ; https://github.com/microsoft/TypeScript/tree/v6.0.3 |

## react 19.3.0
- **URL consultada:** https://react.dev/reference/react
- **URL consultada:** https://react.dev/reference/react/hooks
- **URL consultada:** https://react.dev/reference/react/createContext
- **URL consultada:** https://react.dev/reference/react/memo
- **URL consultada:** https://react.dev/reference/react/StrictMode
- **URL consultada:** https://react.dev/reference/react/Fragment
- **URL consultada:** https://github.com/facebook/react/releases/tag/v19.3.0
- **Confirmado:** A referência lista useState, useRef, useEffect, useLayoutEffect, useSyncExternalStore, useMemo, useCallback, useContext e useId como hooks embutidos, e confirma createContext(defaultValue) com o próprio objeto de contexto renderizado como provider desde o React 19. Confirma memo(Component, arePropsEqual?) com comparação por Object.is, Fragment cuja sintaxe curta não aceita key e StrictMode sem props com renderização dupla e ciclo extra de efeitos apenas em desenvolvimento; a tag v19.3.0 do repositório oficial existe e consta como a mais recente.

## react-dom 19.3.0
- **URL consultada:** https://react.dev/reference/react-dom
- **URL consultada:** https://react.dev/reference/react-dom/client/createRoot
- **Confirmado:** Confirma createPortal e flushSync importáveis de react-dom e a assinatura createRoot(domNode, options?) com as opções onCaughtError, onUncaughtError e onRecoverableError, além de root.render e root.unmount; root.render não é síncrono e flushSync força a atualização do DOM de forma síncrona.

## zod 4.6.5
- **URL consultada:** https://zod.dev/api
- **URL consultada:** https://github.com/colinhacks/zod/blob/v4.6.5/packages/zod/README.md
- **URL consultada:** https://github.com/colinhacks/zod/releases/tag/v4.6.5
- **Confirmado:** A página zod.dev/api (documentada como Zod 4.6) confirma z, z.object, z.string, z.array, z.record, parse e safeParse. O README na tag v4.6.5 confirma que parse devolve uma cópia profunda tipada e lança ZodError, e que safeParse devolve uma união discriminada com success, data e error; a tag v4.6.5 consta como a mais recente no repositório oficial.

## css-tree 3.2.1
- **URL consultada:** https://github.com/csstree/csstree/tree/v3.2.1/docs
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/parsing.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/generate.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/traversal.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/utils.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/README.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/definition-syntax.md
- **URL consultada:** https://github.com/csstree/csstree/blob/v3.2.1/docs/readme.md
- **URL consultada:** https://api.github.com/repos/csstree/csstree/contents/docs?ref=v3.2.1
- **URL consultada:** https://csstree.github.io/docs/
- **Confirmado:** Os docs da tag v3.2.1 confirmam parse(source[, options]) com context, positions, onParseError, parseAtrulePrelude, parseRulePrelude, parseValue e parseCustomProperty, generate(ast[, options]) com mode spec ou safe, walk(ast, options) com enter, leave, visit e reverse (e break e skip), toPlainObject(ast), que converte filhos List em arrays com alteração da árvore passada, e csstree.lexer em checkStructure. As páginas consultadas (docs, README e índice dos docs da tag v3.2.1, além do site csstree.github.io/docs) não apresentam uma função fork.

## html-to-image 1.11.13
- **URL consultada:** https://github.com/bubkoo/html-to-image/tree/v1.11.13
- **Confirmado:** O README da tag v1.11.13 confirma toSvg com as opções de renderização width, height, pixelRatio, backgroundColor, style, filter e quality aplicadas ao nó antes da renderização.

## happy-dom 20.14.5
- **URL consultada:** https://github.com/capricorn86/happy-dom/wiki
- **URL consultada:** https://github.com/capricorn86/happy-dom/wiki/Window
- **URL consultada:** https://github.com/capricorn86/happy-dom/wiki/Getting-started
- **URL consultada:** https://github.com/capricorn86/happy-dom/tree/v20.14.5
- **Confirmado:** O wiki confirma a classe Window, importada de happy-dom, com new Window({ url }) e window.document, e a página de primeiros passos usa document.createElement, document.querySelector e appendChild. As páginas do wiki consultadas não trazem número de versão; a tag v20.14.5 do repositório oficial existe.

## ws 8.21.3
- **URL consultada:** https://github.com/websockets/ws/blob/8.21.3/doc/ws.md
- **Confirmado:** O doc/ws.md da tag 8.21.3 confirma new WebSocketServer(options[, callback]) com a opção port (exatamente uma entre port, server e noServer), o evento connection com websocket e request, o evento message com data e isBinary, server.close, websocket.send e websocket.close([code[, reason]]).

## parse5 8.0.1
- **URL consultada:** https://parse5.js.org/
- **URL consultada:** https://parse5.js.org/modules/parse5.html
- **Confirmado:** A referência do módulo confirma as funções parse, parseFragment, serialize e serializeOuter e o tipo DefaultTreeAdapterMap na versão 8.0.1 do parse5; a página inicial descreve a biblioteca como conjunto de análise e serialização de HTML em conformidade com o padrão WHATWG.

## lottie-web 5.13.0
- **URL consultada:** https://github.com/airbnb/lottie-web/tree/v5.13.0
- **Confirmado:** O README da tag v5.13.0 confirma loadAnimation com um único objeto de parâmetros e as opções container, renderer, loop, autoplay, path, animationData e name.

## typescript 6.0.3
- **URL consultada:** https://www.typescriptlang.org/tsconfig/
- **URL consultada:** https://github.com/microsoft/TypeScript/tree/v6.0.3
- **Confirmado:** A referência de tsconfig confirma as opções target ES2022, module ESNext, moduleResolution bundler, jsx react-jsx, strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride, noFallthroughCasesInSwitch, noUnusedLocals, noUnusedParameters, verbatimModuleSyntax, isolatedModules, allowImportingTsExtensions, resolveJsonModule e skipLibCheck, com a nota de que allowImportingTsExtensions exige noEmit ou emitDeclarationOnly; a tag v6.0.3 do repositório oficial existe.

## Arquivos

### `.dependency-cruiser.cjs`
- **Lote:** L22b
- **Linhas:** 29
- **SHA1:** 6a918ec26da512f8468ea29f5ec191d2e12bb8e7
- **Partes lidas:** 1-29
- **Propósito:** as regras do grafo de importação: nenhum módulo volta a si mesmo pelo que importa e nenhum importa um pacote ausente de `package.json`.
- **Âncora:** `.dependency-cruiser.cjs:9` `name: 'no-circular',`

### `.gitignore`
- **Lote:** L22b
- **Linhas:** 8
- **SHA1:** 9c1f4e1e6f5f68becddb0254e0ab2dc072df3a32
- **Partes lidas:** 1-8
- **Propósito:** as pastas que o git ignora: dependências, saída de build, caches de ferramenta e relatórios.
- **Âncora:** `.gitignore:2` `dist/`

### `.mcp.json`
- **Lote:** L22b
- **Linhas:** 8
- **SHA1:** a2bcd537a845d31a2673c5a49841af1099b60d2e
- **Partes lidas:** 1-8
- **Propósito:** declara o servidor MCP do Playwright usado pelo app.
- **Âncora:** `.mcp.json:3` `"playwright": {`

### `CLAUDE.md`
- **Lote:** L22b
- **Linhas:** 213
- **SHA1:** 388da4102db372add3153df271ba1e2ee22346a7
- **Partes lidas:** 1-213
- **Propósito:** as instruções do projeto: escopo, método obrigatório de alteração, conduta, as regras G1 a G7 do editor com os seus pontos garantidores, as decisões do dono, o mapa do código, os registros da auditoria, a medição no navegador, as travas automáticas e o ambiente.
- **Âncora:** `CLAUDE.md:3` `Page builder com editor visual. O canvas é renderizado em iframe e há breakpoints, estados, classes e quadros-chave. A interface tem dois idiomas: pt-BR e inglês.`

### `PROMPT.md`
- **Lote:** L22b
- **Linhas:** 234
- **SHA1:** c16645c032b84804dd39e2203872fa89dd4eb76a
- **Partes lidas:** 1-234
- **Propósito:** a missão: o rastreamento completo de estado, entradas, fluxos e interações, as nove fases, o formato de citação e a estrutura dos registros.
- **Âncora:** `PROMPT.md:2` `Corrigir integralmente a aplicação de page builder deste repositório e entregá-la funcional, sem erros e otimizada.`

### `companion/bridge.d.mts`
- **Lote:** L22b
- **Linhas:** 14
- **SHA1:** 68c37b03867a6f97baa273d1626aba90a8b4ab6f
- **Partes lidas:** 1-14
- **Propósito:** os tipos do ponte entre o Companion e uma sessão do editor aberta no navegador.
- **Âncora:** `companion/bridge.d.mts:2` `export interface EditorBridge {`

### `companion/bridge.mjs`
- **Lote:** L22b
- **Linhas:** 47
- **SHA1:** 62a0f626e4e06e4e6852a98257621d91055dd27c
- **Partes lidas:** 1-47
- **Propósito:** o ponte HTTP e WebSocket do Companion: confere origem, host e token, sustenta as sessões do editor e encaminha as chamadas com os seus tempos limite.
- **Âncora:** `companion/bridge.mjs:4` `export async function createEditorBridge({origins,port=0,timeoutMs=30000,onRequest}){`

### `companion/companion.mjs`
- **Lote:** L22b
- **Linhas:** 22
- **SHA1:** acd90d33b3c2031c58db3dcf2fb94c05b30853b9
- **Partes lidas:** 1-22
- **Propósito:** monta o Companion: o procurador do provedor, o ponte com o editor, o catálogo de ferramentas, o tratador MCP e o transporte por entrada e saída padrão.
- **Âncora:** `companion/companion.mjs:8` `export async function startAssistantCompanion({commands,words,origins,selectSession,input,output,port=0,allowedProviderHosts=['api.anthropic.com'],handlers=[]}){`

### `companion/extension/manifest.json`
- **Lote:** L22b
- **Linhas:** 11
- **SHA1:** 69af5a60f861adecc86545cd10f5d7c24e618937
- **Partes lidas:** 1-11
- **Propósito:** o manifesto da extensão de captura do Chrome: permissões, worker de fundo, ação de barra e página de opções.
- **Âncora:** `companion/extension/manifest.json:2` `"manifest_version": 3,`

### `companion/extension/options.html`
- **Lote:** L22b
- **Linhas:** 18
- **SHA1:** a37ef78c1041b06ed453a28c94f90b3631456130
- **Partes lidas:** 1-18
- **Propósito:** a página de opções da extensão: a porta do Companion e o token que ele imprime ao arrancar.
- **Âncora:** `companion/extension/options.html:9` `<h1>Builder Capture</h1>`

### `companion/extension/src/background.ts`
- **Lote:** L22b
- **Linhas:** 103
- **SHA1:** 30590b118d16772916960019d9e83e7847f7783d
- **Partes lidas:** 1-103
- **Propósito:** o worker de fundo da extensão: lê a página da aba como a pessoa a vê, busca os arquivos que a cópia precisa com as credenciais dela e entrega tudo ao Companion.
- **Âncora:** `companion/extension/src/background.ts:76` `export async function captureTab(tab: chrome.tabs.Tab): Promise<{ readonly ok: boolean; readonly said: string }> {`

### `companion/extension/src/chrome.d.ts`
- **Lote:** L22b
- **Linhas:** 28
- **SHA1:** ae5ead2facf72a52306bb4cd6dcd9bd12ef24e26
- **Partes lidas:** 1-28
- **Propósito:** declara as poucas APIs `chrome.*` que a extensão chama, para ela não precisar de pacote próprio.
- **Âncora:** `companion/extension/src/chrome.d.ts:3` `declare namespace chrome {`

### `companion/extension/src/options.ts`
- **Lote:** L22b
- **Linhas:** 14
- **SHA1:** 29bc018ccd0fb67ffb8e43d98b978d1dc94d2cde
- **Partes lidas:** 1-14
- **Propósito:** lê e grava a porta e o token do Companion no armazenamento local da extensão.
- **Âncora:** `companion/extension/src/options.ts:6` `void chrome.storage.local.get(['port', 'token']).then((stored) => {`

### `companion/main.mjs`
- **Lote:** L22b
- **Linhas:** 66
- **SHA1:** 80193eae7f8dfa444b2661d47d7114b08e48af01
- **Partes lidas:** 1-66
- **Propósito:** o executável do Companion: lê as opções, monta o catálogo a partir do manifesto, sobe o serviço e grava o arquivo de emparelhamento com o token.
- **Âncora:** `companion/main.mjs:37` `companion = await startAssistantCompanion({`

### `companion/proxy.mjs`
- **Lote:** L22b
- **Linhas:** 19
- **SHA1:** 8aa4b686d1a0d060edb7a97c33fe250cc8167c4b
- **Partes lidas:** 1-19
- **Propósito:** encaminha o fluxo do provedor para um host permitido, com o endereço conferido e a chave mantida só na memória da requisição.
- **Âncora:** `companion/proxy.mjs:2` `export function providerProxy({allowedHosts=['api.anthropic.com'],fetcher=fetch}={}){`

### `companion/stdio.mjs`
- **Lote:** L22b
- **Linhas:** 10
- **SHA1:** db96b3a0f9af14611aadd00bab314e630025f2c7
- **Partes lidas:** 1-10
- **Propósito:** o transporte MCP por entrada e saída padrão, com o limite de tamanho e as respostas de erro do JSON-RPC.
- **Âncora:** `companion/stdio.mjs:2` `export function serveStdio(handler,input,output){`

### `eslint.config.js`
- **Lote:** L22b
- **Linhas:** 228
- **SHA1:** 84fffda2ab0c33ce5447cbf2eb2fb5512c3f80ec
- **Partes lidas:** 1-228
- **Propósito:** a configuração do lint: os ignorados globais, as regras de JavaScript e TypeScript e as regras do projeto (donos do ponteiro, do gesto, do teclado e do iframe; tokens de estilo; ids do manifesto).
- **Âncora:** `eslint.config.js:30` `extends: [js.configs.recommended, tseslint.configs.strict],`

### `index.html`
- **Lote:** L22b
- **Linhas:** 13
- **SHA1:** 7ad8ed0c73483ea110c2799a3f5992d25f3a7f6b
- **Partes lidas:** 1-13
- **Propósito:** a página do editor: o elemento `#root` e o módulo que monta a aplicação.
- **Âncora:** `index.html:11` `<script type="module" src="/src/main.tsx"></script>`

### `manifest/checks.json`
- **Lote:** L12
- **Linhas:** 61
- **SHA1:** c9e7dc1fab989768b84ae11809266540dca02bfc
- **Partes lidas:** 1-61
- **Propósito:** Declara as categorias de verificação (acessibilidade, ligações, SEO e exportação) e os consertos automáticos: cada regra liga-se à sua porta, com o tipo de conserto e o atributo ou o elemento usado.
- **Âncora:** `manifest/checks.json:26` `"rule": "checks.formSubmit",`

### `manifest/commands/animation.json`
- **Lote:** L11a
- **Linhas:** 1036
- **SHA1:** c9aa8172f78cecdec4ac22b6969c02bd2c1dc69b
- **Partes lidas:** 1-1036
- **Propósito:** Manifesto de comandos do domínio de animação: criar, renomear e excluir animações, acrescentar, mover, suavizar e excluir quadros-chave, ajustar duração, atraso, repetições, direção, preenchimento, tempo e estado de reprodução, mostrar a animação na linha do tempo e controlar a cabeça de leitura, tocar, pausar, parar e repetir, com as portas de cada comando.
- **Âncora:** `manifest/commands/animation.json:2` `"domain": "animation",`

### `manifest/commands/assistant.json`
- **Lote:** L11a
- **Linhas:** 814
- **SHA1:** b84efdf527501e42c8c5da8c1a041d9ebe7758c1
- **Partes lidas:** 1-814
- **Propósito:** Manifesto de comandos do domínio do assistente: escolher o modelo, abrir e fechar as preferências, anexar e limpar a referência, editar a chave, enviar e cancelar o pedido, conectar e desconectar da ponte, salvar e excluir a chave, escolher a sessão, limpar a conversa e atualizar a entrada, com as portas de cada comando.
- **Âncora:** `manifest/commands/assistant.json:2` `"domain": "assistant",`

### `manifest/commands/breakpoints.json`
- **Lote:** L11a
- **Linhas:** 283
- **SHA1:** afa65de7c7585ad42f4d04267df373c7f9b8f9a6
- **Partes lidas:** 1-283
- **Propósito:** Manifesto de comandos do domínio de vista: adicionar um breakpoint (aqui e pelo diálogo), renomear, definir a largura e remover com o destino dos estilos, com as portas de menu e do diálogo de breakpoints.
- **Âncora:** `manifest/commands/breakpoints.json:2` `"domain": "view",`

### `manifest/commands/capture.json`
- **Lote:** L11a
- **Linhas:** 214
- **SHA1:** d288edc5bd81913b3506bdece07515ca9e0a35be
- **Partes lidas:** 1-214
- **Propósito:** Manifesto de comandos do domínio de captura: editar a página capturada (texto, atributo, inserir, remover e mover) e selecionar um nó capturado, com as portas do inspector de captura, do canvas e da tecla Enter.
- **Âncora:** `manifest/commands/capture.json:2` `"domain": "capture",`

### `manifest/commands/checks.json`
- **Lote:** L11a
- **Linhas:** 225
- **SHA1:** bacdc38a14e22e4e0507e65796314229ee57e64a
- **Partes lidas:** 1-225
- **Propósito:** Manifesto de comandos do domínio de verificações: a correção automática de cada regra de acessibilidade (envio de formulário, nível de título, texto alternativo, fonte de imagem, título de iframe e href de link), com um botão por regra.
- **Âncora:** `manifest/commands/checks.json:2` `"domain": "checks",`

### `manifest/commands/clipboard.json`
- **Lote:** L11a
- **Linhas:** 558
- **SHA1:** 3b74c6d08199b4bf37eac781b6005e2c446f1326
- **Partes lidas:** 1-558
- **Propósito:** Manifesto de comandos do domínio da área de transferência: copiar, colar e recortar elementos e copiar e colar estilos, com as portas de tecla, menu de contexto, menu de edição e barra de comandos.
- **Âncora:** `manifest/commands/clipboard.json:2` `"domain": "clipboard",`

### `manifest/commands/content.json`
- **Lote:** L11a
- **Linhas:** 2077
- **SHA1:** e40fc5b22ca70e20310c07d198d5f0f709d1047a
- **Partes lidas:** 1-1485; 1486-2077
- **Propósito:** Manifesto de comandos do domínio de conteúdo: coleções de dados (selecionar, consultar, criar, renomear, excluir, campos, itens e prévia de importação), importar para coleção nova ou existente, vincular elemento a campo, preencher lista, desvincular, páginas a partir de nomes e de coleção e regiões compartilhadas (compartilhar, desanexar e parar de compartilhar).
- **Âncora:** `manifest/commands/content.json:2` `"domain": "content",`

### `manifest/commands/design-system.json`
- **Lote:** L11a
- **Linhas:** 1720
- **SHA1:** 354fab2f4ddc0ebb5afcb07e5e94196e2c015973
- **Partes lidas:** 1-1457; 1458-1720
- **Propósito:** Manifesto de comandos do domínio do design system: amostras de cor, variáveis CSS (criar, atualizar, renomear e excluir), classes compartilhadas (criar, aplicar, desanexar, renomear, excluir, mover para dentro e aplicar a semelhantes), alvo de estilo do inspector, componentes reutilizáveis (iniciar e criar, inserir instância, fechar o diálogo, desanexar, repetir, preencher com dados, atualizar a partir da instância e definir variante), substituição de cores do site e sugestões de estilo.
- **Âncora:** `manifest/commands/design-system.json:2` `"domain": "design-system",`

### `manifest/commands/elements.json`
- **Lote:** L11a
- **Linhas:** 5663
- **SHA1:** 82ecde03826190ae4e8208e566121b75ed6ab2ac
- **Partes lidas:** 1-1402; 1403-2758; 2759-4156; 4157-5598; 5599-5663
- **Propósito:** Manifesto de comandos do domínio de elementos: trocar a tag, definir id, classes, link, tipo de entrada e alvo do rótulo, os campos de atributo do inspector (título, mídia e imagens, formulários, controles, incorporados, interativos, ARIA e auditoria), atributos personalizados, marcação SVG e de incorporação, aplicar HTML, partes (alternar, acrescentar, mover e remover), máscaras, regras, endereço, mensagens e submissão de formulários, comandos de tabela (colunas e linhas) e os seletores de recurso e de link.
- **Âncora:** `manifest/commands/elements.json:2` `"domain": "elements",`

### `manifest/commands/events.json`
- **Lote:** L11a
- **Linhas:** 449
- **SHA1:** 12112085c6130cadd2c32e9ae81fada3e7dbd6e0
- **Partes lidas:** 1-449
- **Propósito:** Manifesto de comandos do domínio de eventos: adicionar, atualizar (gatilho, ação, alvo, valor, opções, escopo e nova aba) e remover as interações do elemento, com as portas do inspector, do canvas e das Camadas.
- **Âncora:** `manifest/commands/events.json:2` `"domain": "events",`

### `manifest/commands/files.json`
- **Lote:** L11a
- **Linhas:** 1171
- **SHA1:** b43d39b15ef927e89d55c862495b1b3c6e01bc56
- **Partes lidas:** 1-1171
- **Propósito:** Manifesto de comandos do domínio de arquivos: páginas (acrescentar, renomear, duplicar, excluir e trocar), sistema de arquivos (criar pasta e arquivo, iniciar e concluir a renomeação, mover, excluir, abrir e fechar aba, enviar arquivos e salvar conteúdo) e inserir imagem de arquivo no canvas.
- **Âncora:** `manifest/commands/files.json:2` `"domain": "files",`

### `manifest/commands/focus.json`
- **Lote:** L11a
- **Linhas:** 1333
- **SHA1:** e0546184a2beb82224edd3cba792e0db708f5a44
- **Partes lidas:** 1-1333
- **Propósito:** Manifesto de comandos do domínio de foco: próximo, anterior, primeiro, último e ativar item, foco na barra de menus e no canvas, próximo e anterior menu, próxima e anterior região e dispensar sobreposições, com as portas de tecla de cada contexto.
- **Âncora:** `manifest/commands/focus.json:2` `"domain": "focus",`

### `manifest/commands/geometry.json`
- **Lote:** L11a
- **Linhas:** 1744
- **SHA1:** 5c7e9c29a254753c2ae99e30cc4cdc437fb06132
- **Partes lidas:** 1-1438; 1439-1744
- **Propósito:** Manifesto de comandos do domínio de geometria: modo de posicionamento, redimensionar pelos puxadores, mover com o arraste e com as teclas, definir âncoras, alinhar e distribuir, passo dos puxadores e modo de edição no canvas.
- **Âncora:** `manifest/commands/geometry.json:2` `"domain": "geometry",`

### `manifest/commands/history.json`
- **Lote:** L11a
- **Linhas:** 257
- **SHA1:** 9f4e8df062f77fcf9645715d31a0f000c0dc4f7e
- **Partes lidas:** 1-257
- **Propósito:** Manifesto de comandos do domínio de histórico: desfazer e refazer, com as portas de tecla, da barra superior, do aviso, do menu de edição e da barra de comandos.
- **Âncora:** `manifest/commands/history.json:2` `"domain": "history",`

### `manifest/commands/layout-composer.json`
- **Lote:** L11a
- **Linhas:** 1687
- **SHA1:** eef071b3dc0614bef8015ea1a62377d04b889015
- **Partes lidas:** 1-1456; 1457-1687
- **Propósito:** Manifesto de comandos do domínio do compositor de layout: entrar e sair, traço e seleção de regiões, excluir, posicionar e redimensionar, mesclar, configurar (nome, semântica, largura, altura, preenchimento, espaçamento, alinhamento, distribuição, igualar e repetição), interpretar, responder por breakpoint, desfazer relação, sugerir, modelo, referência e traçar.
- **Âncora:** `manifest/commands/layout-composer.json:2` `"domain": "layout-composer",`

### `manifest/commands/motion.json`
- **Lote:** L11a
- **Linhas:** 3688
- **SHA1:** e1bf04359590eebc37120502771f17cb88256c9a
- **Partes lidas:** 1-1445; 1446-2945; 2946-3688
- **Propósito:** Manifesto de comandos do domínio de movimento: interações (adicionar, atualizar e remover), linhas do tempo (criar, renomear, excluir e abrir), ações (acrescentar, atualizar, opção de efeito, remover, mover e redimensionar), seleção, cabeça de leitura, zoom, encaixe, marcadores (acrescentar, mover, renomear e remover), quadros-chave (definir, editar, mover, excluir, copiar e colar), gravação, prévia, execução e comportamentos (definir e remover).
- **Âncora:** `manifest/commands/motion.json:2` `"domain": "motion",`

### `manifest/commands/nodes.json`
- **Lote:** L11a
- **Linhas:** 621
- **SHA1:** 6df45fdfc611073f7e9a1da0e832c73ff3ff03cf
- **Partes lidas:** 1-621
- **Propósito:** Manifesto de comandos do domínio de nós: renomear (iniciar nas Camadas, cancelar, confirmar e renomear em lote), travar e esconder o elemento e definir a cor da linha nas Camadas.
- **Âncora:** `manifest/commands/nodes.json:2` `"domain": "nodes",`

### `manifest/commands/page.json`
- **Lote:** L11a
- **Linhas:** 368
- **SHA1:** 7d464c066d5270816d99f1ba042235427065c3fb
- **Partes lidas:** 1-368
- **Propósito:** Manifesto de comandos do domínio de página: abrir as propriedades da página e definir cada ajuste (título, idioma, direção, classes do html, descrição, canônica, títulos e imagem de compartilhamento, favicon e scripts).
- **Âncora:** `manifest/commands/page.json:2` `"domain": "page",`

### `manifest/commands/project.json`
- **Lote:** L11a
- **Linhas:** 856
- **SHA1:** a3e73ac82aaf13f99a92afbb3c424c651f9f68a4
- **Partes lidas:** 1-856
- **Propósito:** Manifesto de comandos do domínio de projeto: página em branco, restaurar versão, assumir a edição na guarda de abas, salvar, abrir projeto, abrir pasta, importar HTML (arquivo e pasta, com os destinos página, dentro e substituir), exportar, definir idioma e idioma do código e capturar endereço web.
- **Âncora:** `manifest/commands/project.json:2` `"domain": "project",`

### `manifest/commands/selection.json`
- **Lote:** L11b
- **Linhas:** 909
- **SHA1:** 307b2b5513abf72a6d1fc512890679192112e6fd
- **Partes lidas:** 1-909
- **Propósito:** Manifesto de comandos do domínio de seleção: selecionar, limpar, somar, intervalo e alternar seleção, caminhada pela árvore, seleção dos filhos de um contêiner, seleção por retângulo e abertura do menu de contexto, com as portas de cada comando.
- **Âncora:** `manifest/commands/selection.json:2` `"domain": "selection",`

### `manifest/commands/structure.json`
- **Lote:** L11b
- **Linhas:** 2457
- **SHA1:** 012d0e9781971b7065697a0885fc2676291b7872
- **Partes lidas:** 1-1411; 1412-2457
- **Propósito:** Manifesto de comandos do domínio de estrutura: inserir, mover, envolver em linha, coluna, ao lado, contêiner e grade, desfazer envolvimento, duplicar, excluir, criar filho natural, aninhar no anterior, promover, comandos da mão e níveis com escape de arraste.
- **Âncora:** `manifest/commands/structure.json:2` `"domain": "structure",`

### `manifest/commands/style.json`
- **Lote:** L11b
- **Linhas:** 11668
- **SHA1:** 6e955d468d45f2ad4649e74578cd7f3df5a54483
- **Partes lidas:** 1-1404; 1405-2808; 2809-4198; 4199-5620; 5621-7014; 7015-8423; 8424-9869; 9870-11322; 11323-11668
- **Propósito:** Manifesto de comandos do domínio de estilo: definir propriedade, espaçamento, borda, raio, fundo com gradiente, sombras, filtros, transformações, alinhamento, declarações CSS e regras, redefinir valores, trilhas e itens de grade com edição no canvas, direção, empilhamento, organização, divisão e operações de campo numérico.
- **Âncora:** `manifest/commands/style.json:2` `"domain": "style",`

### `manifest/commands/text.json`
- **Lote:** L11b
- **Linhas:** 607
- **SHA1:** 1cf6d71e663133da3a98bed267b14f89a788967b
- **Partes lidas:** 1-607
- **Propósito:** Manifesto de comandos do domínio de texto: iniciar, confirmar e cancelar a edição em linha, definir o conteúdo, inserir quebra de linha, negrito, itálico, link, colar e selecionar tudo.
- **Âncora:** `manifest/commands/text.json:2` `"domain": "text",`

### `manifest/commands/view.json`
- **Lote:** L11b
- **Linhas:** 3321
- **SHA1:** 5e58f8794f28fd5739de4e48fb451bff681bd279
- **Partes lidas:** 1-1470; 1471-2937; 2938-3321
- **Propósito:** Manifesto de comandos do domínio de vista: zoom, pan, breakpoints, vistas do editor, estados de estilo, pré-visualização, sobreposições, grades, guias, encaixe, diálogos, largura e redimensionamento do viewport, lado a lado e ferramenta de seleção.
- **Âncora:** `manifest/commands/view.json:2` `"domain": "view",`

### `manifest/commands/workspace.json`
- **Lote:** L11b
- **Linhas:** 3827
- **SHA1:** 883febac8e266afb45e057427d5ccc3149865e55
- **Partes lidas:** 1-1467; 1468-2946; 2947-3827
- **Propósito:** Manifesto de comandos do domínio de espaço de trabalho: painéis e docas, workbench, abas, divisores, movimento de painel, painel rápido, idioma, tema, barra de comandos, paleta, árvore de camadas, inspetor, painel de código e seletor de cores.
- **Âncora:** `manifest/commands/workspace.json:2` `"domain": "workspace",`

### `manifest/consumers.json`
- **Lote:** L12
- **Linhas:** 2316
- **SHA1:** 033900d6298d9192e5801c00f6c8f096fd72be4e
- **Partes lidas:** 1-1420; 1421-2316
- **Propósito:** Lista, campo a campo, qual arquivo lê cada chave dos manifestos (ambiente, elementos, propriedades, interações, comandos, layout, verificações, features, referências, consumidores, exclusões de CSS e arquivos gerados), servindo de guia de quem consome cada campo.
- **Âncora:** `manifest/consumers.json:4` `"field": "environment:browser",`

### `manifest/css-exclusions.json`
- **Lote:** L12
- **Linhas:** 114
- **SHA1:** a66695ad33fba4caca126d983f22b66689a3f064
- **Partes lidas:** 1-114
- **Propósito:** Registra as exclusões de valores CSS (propriedade, palavra-chave e unidade), cada uma com a evidência de especificação ou do Chrome instalado que a justifica.
- **Âncora:** `manifest/css-exclusions.json:2` `"exclusions": [`

### `manifest/elements.json`
- **Lote:** L12
- **Linhas:** 3568
- **SHA1:** b6695c38bdbb19dedaa14cc2db887cc33d7bd8ca
- **Partes lidas:** 1-1685; 1686-3228; 3229-3568
- **Propósito:** Declara os elementos HTML e SVG (etiqueta, espaço de nomes, conteúdo, filho natural e estilos padrão), os atributos por elemento, as seções de configurações, os grupos e entradas da paleta, os modelos e os wrappers de layout (row, column, container e grid).
- **Âncora:** `manifest/elements.json:5` `"tag": "body",`

### `manifest/environment.json`
- **Lote:** L12
- **Linhas:** 35
- **SHA1:** 927e7b04cb6bb4fb8dd19ec5ca6ca09f80d8edc1
- **Partes lidas:** 1-35
- **Propósito:** Define o ambiente dos testes: canal do navegador (Chrome), duas telas (1440x900 e 1920x1080), idiomas (inglês como padrão, com pt-BR disponível), tema escuro, cinco níveis de zoom e movimento reduzido.
- **Âncora:** `manifest/environment.json:2` `"browser": {`

### `manifest/features/01-foundation.json`
- **Lote:** L13b
- **Linhas:** 464
- **SHA1:** bf01208f3d48b25030d1d4ff34ca6c915fc3684f
- **Partes lidas:** 1-464
- **Propósito:** Declara o grupo foundation com as features editor-shell (barra superior, docks, canvas e barra de status) e canvas-page-iframe (página renderizada em iframe com zoom), com intents, cenários com portas, args e expectativas de documento, render e editor.
- **Âncora:** `manifest/features/01-foundation.json:6` `"id": "editor-shell",`

### `manifest/features/02-structure-editing.json`
- **Lote:** L13a
- **Linhas:** 18163
- **SHA1:** c44211dc837aaf1571e83e4d7833806d0c4bb7a3
- **Partes lidas:** 1-1295; 1296-2684; 2685-3972; 3973-5241; 5242-6550; 6551-7865; 7866-9118; 9119-10432; 10433-11795; 11796-13141; 13142-14512; 14513-15866; 15867-17227; 17228-18163
- **Propósito:** Declara o grupo "structure-editing" do manifesto de funcionalidades do editor, com 32 funcionalidades (id, título, comandos, dependências e intenção com passos e resultado esperado) e, para cada uma, cenários de teste com preparação (fixture, seleção, contexto, breakpoint, estado, idioma, viewport e zoom), passos com porta de entrada e argumentos, as portas equivalentes, a expectativa de documento (operações sobre o JSON), seleção, histórico, renderização (estilos computados, geometria e feedback) e recusas.
- **Âncora:** `manifest/features/02-structure-editing.json:2` `"group": "structure-editing",`

### `manifest/features/03-app-and-persistence.json`
- **Lote:** L13b
- **Linhas:** 4417
- **SHA1:** 14db56bf634e55624c783ef5d84ed70c8b1cf4ec
- **Partes lidas:** 1-1313; 1314-2644; 2645-3955; 3956-4417
- **Propósito:** Declara o grupo app-and-persistence com as features app-menu, ui-language, autosave-restore, unsaved-work-guard, autosave-crash-recovery, new-blank-page, autosave-corruption-recovery, multi-tab-guard, project-save-json e project-open-json, com cenários que detalham portas, operações de documento e expectativas de persistência e exportação.
- **Âncora:** `manifest/features/03-app-and-persistence.json:6` `"id": "app-menu",`

### `manifest/features/04-inspector.json`
- **Lote:** L14a
- **Linhas:** 41571
- **SHA1:** 99b5a076a840f9a22ec41dc18fc040a8cdd0010c
- **Partes lidas:** 1-1379; 1380-2793; 2794-4205; 4206-5623; 5624-7000; 7001-8367; 8368-9770; 9771-11189; 11190-12612; 12613-14011; 14012-15414; 15415-16775; 16776-18199; 18200-19600; 19601-21009; 21010-22346; 22347-23664; 23665-25049; 25050-26436; 26437-27826; 27827-29211; 29212-30598; 30599-32006; 32007-33381; 33382-34775; 34776-36167; 36168-37582; 37583-38935; 38936-40360; 40361-41571
- **Propósito:** Parte do manifesto do grupo inspector: descreve os recursos inspector-panel, inspector-number-fields, props-display, props-flex-container, props-grid-container, props-layout-item, props-spacing, props-size-overflow, props-position, color-picker, color-picker-oklch, color-swatches-eyedropper, props-typography, props-typography-advanced, props-background e gradient-editor, cada um com comandos, dependências, intenção (passos e resultados esperados) e cenários com setup, passos por porta, expectativas e recusas.
- **Âncora:** `manifest/features/04-inspector.json:2` `  "group": "inspector",`

### `manifest/features/05-canvas-handles.json`
- **Lote:** L13b
- **Linhas:** 4355
- **SHA1:** 917a69ea410ec585247d1dbbd617a3925d0990e7
- **Partes lidas:** 1-1373; 1374-2786; 2787-4166; 4167-4355
- **Propósito:** Declara o grupo canvas-handles com as features resize-handles, spacing-handles, radius-border-gap-handles e shadow-handles, com cenários de arraste de alças, medidas geométricas e expectativas de documento, estilo e estilo computado.
- **Âncora:** `manifest/features/05-canvas-handles.json:6` `"id": "resize-handles",`

### `manifest/features/06-page-and-export.json`
- **Lote:** L13b
- **Linhas:** 4153
- **SHA1:** b77acfd94b3413a1400c9608e63390e53fa63878
- **Partes lidas:** 1-1386; 1387-2819; 2820-4153
- **Propósito:** Declara o grupo page-and-export com as features page-properties, base-style, export-zip, css-variables-tokens, export-bem-css, project-language, site-colours e style-suggestions, com cenários de edição e de arquivos exportados.
- **Âncora:** `manifest/features/06-page-and-export.json:6` `"id": "page-properties",`

### `manifest/features/07-elements.json`
- **Lote:** L15a
- **Linhas:** 32650
- **SHA1:** 5fe9c0f6c0dfd318fd18bfbf8d6e73fa87a9b9bb
- **Partes lidas:** 1-1375; 1376-2720; 2721-3987; 3988-5207; 5208-6308; 6309-7378; 7379-8756; 8757-10166; 10167-11600; 11601-13015; 13016-14387; 14388-15730; 15731-17101; 17102-18458; 18459-19792; 19793-21123; 21124-22375; 22376-23777; 23778-25157; 25158-26569; 26570-27913; 27914-29293; 29294-30639; 30640-31969; 31970-32650
- **Propósito:** Declara o grupo de funcionalidades "elements" do manifesto, cobrindo os elementos de estrutura, texto, listas, a gramática de aninhamento, tabelas e seus comandos, a estrutura de formulário, atributos personalizados e de acessibilidade, classes de estilo compartilhadas, as entradas de formulário com suas regras, os controles de formulário e a mídia, e para cada funcionalidade lista os comandos, a intenção e os cenários com passos, portas de entrada, expectativas de documento, seleção, histórico, renderização, persistência e exportação, e as recusas.
- **Âncora:** `manifest/features/07-elements.json:2` `"group": "elements",`

### `manifest/features/08-templates-and-components.json`
- **Lote:** L16
- **Linhas:** 7563
- **SHA1:** 9c2cd68f8c9b8cebfcffcd8909593560018caaba
- **Partes lidas:** 1-1268; 1269-2484; 2485-3775; 3776-5110; 5111-6396; 6397-7563
- **Propósito:** Manifesto de cenários dos templates e componentes: inserção de templates de layout (Container, Row, Column, Grid), de conteúdo (listas, tabela, formulário, select, figure), de seções (Card, Hero, Navbar, Sidebar, Gallery) e de componentes (Form group, Button group, Tabs, Accordion, Modal); componentes reutilizáveis com instâncias, variantes e atualização do componente a partir de uma instância; repetição de elementos em cópias ligadas e preenchimento a partir de um arquivo de dados.
- **Âncora:** `manifest/features/08-templates-and-components.json:2` `  "group": "templates-and-components",`

### `manifest/features/09-panels.json`
- **Lote:** L16
- **Linhas:** 1543
- **SHA1:** d916d4b2fb523beea3e707440bed91b121a42fd9
- **Partes lidas:** 1-1375; 1376-1543
- **Propósito:** Manifesto de cenários dos painéis do editor: busca e recolhimento de grupos na paleta de elementos e densidade de exibição da paleta; recolher tudo, expandir tudo e busca no painel Camadas; colunas de detalhe por linha e cores de rótulo das camadas.
- **Âncora:** `manifest/features/09-panels.json:2` `  "group": "panels",`

### `manifest/features/10-view-and-positioning.json`
- **Lote:** L16
- **Linhas:** 14344
- **SHA1:** 68930fb4bec41af12365dd82ba4247a265ed62c7
- **Partes lidas:** 1-1421; 1422-2854; 2855-4254; 4255-5638; 5639-7009; 7010-8385; 8386-9764; 9765-11136; 11137-12543; 12544-13934; 13935-14344
- **Propósito:** Manifesto de cenários de visão e posicionamento: zoom por teclado, botões, menu e roda; réguas, guias manuais e ajuste magnético (snap) com suas configurações e guias inteligentes; grades de colunas, linhas e pontos; posicionamento absoluto por arraste, setas e âncoras; alinhar e distribuir; medição de tamanho e distância ao passar o ponteiro.
- **Âncora:** `manifest/features/10-view-and-positioning.json:2` `  "group": "view-and-positioning",`

### `manifest/features/11-responsive-and-states.json`
- **Lote:** L16
- **Linhas:** 2994
- **SHA1:** 879ce4e2fe7294cde14c849e306674866c0d8681
- **Partes lidas:** 1-1399; 1400-2819; 2820-2994
- **Propósito:** Manifesto de cenários de responsividade e estados: troca de breakpoints (Desktop, Laptop, Tablet e Phone) e largura contínua da viewport, sobrescritas de estilo por breakpoint e estados de estilo (hover, focus, active, disabled, invalid, placeholder shown, before, after, visited, user-invalid, user-valid, focus-visible, first-child e last-child).
- **Âncora:** `manifest/features/11-responsive-and-states.json:2` `  "group": "responsive-and-states",`

### `manifest/features/12-preview-embed-theme.json`
- **Lote:** L16
- **Linhas:** 1338
- **SHA1:** f29c815c20fa3b88e83f2372f7e80ac6873924b3
- **Partes lidas:** 1-1338
- **Propósito:** Manifesto de cenários de pré-visualização, HTML embutido e tema: modo de pré-visualização com barra de breakpoints, exportação e saída por Escape ou Ctrl+Enter; elemento de embed com a marcação guardada como foi digitada; escolha de tema claro, escuro ou do sistema.
- **Âncora:** `manifest/features/12-preview-embed-theme.json:2` `  "group": "preview-embed-theme",`

### `manifest/features/13-workspace.json`
- **Lote:** L17a
- **Linhas:** 14033
- **SHA1:** 1400a38073bbc3f6e6b69ad190b85f3c678e5391
- **Partes lidas:** 1-1388; 1389-2546; 2547-3733; 3734-5115; 5116-6495; 6496-7908; 7909-9245; 9246-10635; 10636-12008; 12009-13411; 13412-14033
- **Propósito:** Manifesto de cenários do grupo workspace: alternância de docks e painéis, barra de comandos com Ctrl+K, definição de propriedades pela barra, painel de atalhos, workbench inferior com abas, redimensionadores, painéis flutuantes, combinação de painéis em abas, persistência e reinício do layout e barra de status, cada funcionalidade com comandos, portas de entrada, passos e expectativas de documento, render e editor.
- **Âncora:** `manifest/features/13-workspace.json:2` `  "group": "workspace",`

### `manifest/features/14-accessibility-and-keyboard.json`
- **Lote:** L17a
- **Linhas:** 2046
- **SHA1:** ca05f495975c5a69ff72fc2e2668cf2fcd0ee479
- **Partes lidas:** 1-1379; 1380-2046
- **Propósito:** Manifesto de cenários do grupo accessibility-and-keyboard: verificações de acessibilidade com correções aplicáveis, navegação por regiões com F6, operação de barras e abas com setas, Home, End e Enter e operação da árvore de Camadas pelo teclado com as mesmas ações do canvas.
- **Âncora:** `manifest/features/14-accessibility-and-keyboard.json:2` `  "group": "accessibility-and-keyboard",`

### `manifest/features/15-clipboard-and-styles.json`
- **Lote:** L17a
- **Linhas:** 778
- **SHA1:** 0cae7313a6a72e43c1feb834eb1d4a94955f5404
- **Partes lidas:** 1-778
- **Propósito:** Manifesto de cenários do grupo clipboard-and-styles: recortar elementos para a área de transferência do sistema, colar a partir dela e copiar e colar estilos entre elementos, com portas por tecla, menu de contexto, menu Editar e barra de comandos.
- **Âncora:** `manifest/features/15-clipboard-and-styles.json:2` `  "group": "clipboard-and-styles",`

### `manifest/features/16-html-import.json`
- **Lote:** L17a
- **Linhas:** 4258
- **SHA1:** e7672b3224d1e9a4bec8f540b0fb819ac6f6256a
- **Partes lidas:** 1-1228; 1229-2456; 2457-3651; 3652-4258
- **Propósito:** Manifesto de cenários do grupo html-import: importação de arquivos HTML como páginas com marcas e atributos, limpeza de scripts, elementos desconhecidos e aninhamento, importação de CSS, regras @media e pseudo-classes como breakpoints e estados, ida e volta de exportação e importação, colagem de HTML e texto externos e captura de endereço da web.
- **Âncora:** `manifest/features/16-html-import.json:2` `  "group": "html-import",`

### `manifest/features/17-code-panel.json`
- **Lote:** L17b
- **Linhas:** 1830
- **SHA1:** 3e93518b966ca59977efd3dafb8853fe1ee0e993
- **Partes lidas:** 1-1405; 1406-1830
- **Propósito:** Manifesto do grupo code-panel: declara as features code-panel-view, code-panel-selection-sync, code-panel-copy-download, code-panel-edit-css e code-panel-edit-html, cada uma com comandos, intenção e cenários com portas, passos e expectativas de documento, seleção, histórico, render, persistência e exportação.
- **Âncora:** `manifest/features/17-code-panel.json:6` `"id": "code-panel-view",`

### `manifest/features/18-animation-and-events.json`
- **Lote:** L17b
- **Linhas:** 3897
- **SHA1:** c929fd03836545e2da27075920551d3f73ca6041
- **Partes lidas:** 1-1352; 1353-2721; 2722-3897
- **Propósito:** Manifesto do grupo animation-and-events: declara as features timeline-animations, timeline-keyframes, timeline-animation-settings, timeline-preview, export-keyframes, events-actions e export-events-js, com comandos, intenção e cenários de animações, quadros-chave, interações e do JavaScript exportado.
- **Âncora:** `manifest/features/18-animation-and-events.json:6` `"id": "timeline-animations",`

### `manifest/features/19-pages-files-assets.json`
- **Lote:** L17b
- **Linhas:** 7561
- **SHA1:** af35338aa0684f49c9cd634bc0d22798d55b90e2
- **Partes lidas:** 1-1323; 1324-2765; 2766-4127; 4128-5510; 5511-6775; 6776-7561
- **Propósito:** Manifesto do grupo pages-files-assets: declara as features explorer-pages, explorer-file-system, link-picker, export-multi-page, explorer-assets, explorer-assets-use, export-file-tree, export-assets, page-seo-meta, custom-fonts, explorer-open-folder, code-panel-edit-js e command-bar-find, com comandos, intenção e cenários de páginas, árvore de arquivos, links, assets, exportação, metadados e fontes.
- **Âncora:** `manifest/features/19-pages-files-assets.json:6` `"id": "explorer-pages",`

### `manifest/features/20-shortcut-sweep.json`
- **Lote:** L17b
- **Linhas:** 296
- **SHA1:** 9f43c688e39d38f9fdbabf9f20883bb9faec4011
- **Partes lidas:** 1-296
- **Propósito:** Manifesto do grupo shortcut-sweep: declara a feature shortcuts-e2e-sweep, que varre os atalhos da keymap em cenários de teclas, e o campo toothProof que aponta para src/editor/input/keymap.ts.
- **Âncora:** `manifest/features/20-shortcut-sweep.json:6` `"id": "shortcuts-e2e-sweep",`

### `manifest/features/21-layout-and-structure.json`
- **Lote:** L17b
- **Linhas:** 2927
- **SHA1:** 5a1b7e1eddb30810d5ea5c4d2e0b5a51aeaf98f5
- **Partes lidas:** 1-1257; 1258-2601; 2602-2927
- **Propósito:** Manifesto do grupo layout-and-structure: declara as features layout-actions, canvas-grid-editor e batch-rename, com comandos, intenção e cenários de envolvimento em contêiner e em grade, troca de direção, pilha no telefone, organização dos filhos, divisória de colunas, edição de grade no canvas e renomeação em lote.
- **Âncora:** `manifest/features/21-layout-and-structure.json:6` `"id": "layout-actions",`

### `manifest/features/22-assistant.json`
- **Lote:** L17b
- **Linhas:** 1203
- **SHA1:** a27118bf47b14d6da4284edebe7ec418de067322
- **Partes lidas:** 1-1203
- **Propósito:** Manifesto do grupo assistant: declara a feature assistant-chat, com comandos, intenção e cenários do painel do assistente (preferências, modelo, chave de serviço, referência, mensagem, cancelamento, pareamento e seleção de sessão).
- **Âncora:** `manifest/features/22-assistant.json:6` `"id": "assistant-chat",`

### `manifest/features/23-layout-composer.json`
- **Lote:** L18a
- **Linhas:** 11765
- **SHA1:** efe02a34de18a6820a05994e0835957de85c01a9
- **Partes lidas:** 1-1305; 1306-2536; 2537-3833; 3834-5109; 5110-6385; 6386-7655; 7656-8938; 8939-10197; 10198-11420; 11421-11765
- **Propósito:** Grupo de manifesto do compositor de layout: declara os comandos layout.enter, layout.leave, layout.stroke, layout.select, layout.delete, layout.merge, layout.place, layout.configure, layout.interpret, layout.respond, layout.unrelate, layout.suggest, layout.template, layout.reference, layout.trace e workspace.setPanelOpen, e reúne cenários que cobrem entrar no compositor, traçar, cortar e mesclar regiões, arrastar bordas, vértices e espaços, configurar nome, sentido, largura, altura, espaçamento interno, alinhamento, distribuição, repetição e igualar tamanhos, responder em outro breakpoint, usar referência de wireframe, aplicar modelo e mover ou redimensionar pelo canvas, com os estados de documento, seleção, histórico, render, persistência e export esperados.
- **Âncora:** `manifest/features/23-layout-composer.json:2` `"group": "layout-composer",`

### `manifest/features/24-motion.json`
- **Lote:** L18b
- **Linhas:** 19977
- **SHA1:** faa8ea73ce9ce11aef865dc4be89925c391ad929
- **Partes lidas:** 1-1406; 1407-2814; 2815-4225; 4226-5635; 5636-7045; 7046-8449; 8450-9829; 9830-11214; 11215-12602; 12603-14001; 14002-15404; 15405-16790; 16791-18164; 18165-19582; 19583-19977
- **Propósito:** Arquivo de dados do manifesto que declara o grupo motion: seis funcionalidades (interações, linha de tempo, quadros-chave, pré-visualização, comportamentos e exportação do movimento em JavaScript), cada uma com os comandos, as dependências, a intenção e os cenários de preparação, passos por porta e resultado esperado.
- **Âncora:** `manifest/features/24-motion.json:3` `"titleKey": "featureGroup.motion",`

### `manifest/features/25-content.json`
- **Lote:** L18c
- **Linhas:** 13817
- **SHA1:** ece69b7c548cc26a1068cbccd7a7ab6b23dcd57d
- **Partes lidas:** 1-1183; 1184-2365; 2366-3523; 3524-4860; 4861-5975; 5976-7055; 7056-8134; 8135-9169; 9170-10364; 10365-11505; 11506-12628; 12629-13765; 13766-13817
- **Propósito:** Manifesto do grupo de recursos content com cinco recursos — data-collections, data-import, data-binding, data-pages e shared-regions —, cada um com comandos, dependências, intenção e cenários que descrevem, por porta, os passos e as expectativas de documento, seleção, histórico, render, editor, persistência e export.
- **Âncora:** `manifest/features/25-content.json:2` `  "group": "content",`

### `manifest/features/26-project-breakpoints.json`
- **Lote:** L18a
- **Linhas:** 1872
- **SHA1:** 409bdec64d9825fe4550ca723f9fbf8b3f78752e
- **Partes lidas:** 1-1409; 1410-1872
- **Propósito:** Grupo de manifesto com as features project-breakpoints e side-by-side-view: declara os comandos breakpoints.add, breakpoints.rename, breakpoints.setWidth, breakpoints.remove, workspace.openDialog, view.setBreakpoint, view.setViewportWidth, style.set e project.export, e reúne cenários sobre criar um breakpoint na largura mostrada, recusar largura ou nome já tomados, renomear, mudar a largura entre os vizinhos, remover levando os estilos ou movendo-os para o vizinho, abas e pré-visualização do breakpoint, a exportação que escreve media queries e a visão lado a lado que mostra os outros breakpoints.
- **Âncora:** `manifest/features/26-project-breakpoints.json:2` `"group": "project-breakpoints",`

### `manifest/interactions.json`
- **Lote:** L12
- **Linhas:** 1765
- **SHA1:** 7938168c003e746369677f90ca4a57cf72f8ca28
- **Partes lidas:** 1-1348; 1349-1765
- **Propósito:** Declara os contextos de teclado com suas heranças e a absorção de campos, as constantes numéricas das interações (arraste, encaixe, campos, zoom, réguas, guias, painéis e movimento), os gestos com seus modificadores, as propriedades de verificação de contraste e as cores de camada.
- **Âncora:** `manifest/interactions.json:4` `"id": "global",`

### `manifest/layout.json`
- **Lote:** L12
- **Linhas:** 800
- **SHA1:** 870eba5dd14cbfba5b0108b9f3efbe6fd671f86c
- **Partes lidas:** 1-800
- **Propósito:** Descreve o arranjo da interface: regiões com área e pontos de quebra, menus com âncoras e quebras, grupos do painel rápido, glifos, painéis com lugar e abertura, divisores com tamanho, mínimo e máximo, e controles locais.
- **Âncora:** `manifest/layout.json:4` `"id": "top-bar",`

### `manifest/properties.json`
- **Lote:** L12
- **Linhas:** 5690
- **SHA1:** fbdac7b6f0a326cb66def43711be82736a850a34
- **Partes lidas:** 1-1511; 1512-2873; 2874-4367; 4368-5690
- **Propósito:** Declara as seções, os pontos de quebra, os estados, as estruturas, as propriedades CSS, os compostos, as receitas, os acoplamentos, os predicados de valor, o contexto, as linhas do inspector e os controles, cada um com portas, codec e subconjuntos de valores.
- **Âncora:** `manifest/properties.json:4` `"id": "content",`

### `manifest/references.json`
- **Lote:** L12
- **Linhas:** 2459
- **SHA1:** b4b789fb00630967c430c79096edc1017de3005a
- **Partes lidas:** 1-2254; 2255-2459
- **Propósito:** Inventaria as referências do projeto — manipuladores, predicados, ações e codecs — com o estado de cada uma: registrada ou planejada.
- **Âncora:** `manifest/references.json:2` `"references": [`

### `package.json`
- **Lote:** L22b
- **Linhas:** 78
- **SHA1:** 9237e47814988d43774284407ee9e59e2cc932d5
- **Partes lidas:** 1-78
- **Propósito:** os scripts de desenvolvimento, verificação estática, testes e geração, e as dependências e versões instaladas.
- **Âncora:** `package.json:10` `"dev": "vite",`

### `playwright.config.ts`
- **Lote:** L22b
- **Linhas:** 84
- **SHA1:** bd650a4bf3102a88e3dc67a00861c38c09c546f2
- **Partes lidas:** 1-84
- **Propósito:** a configuração da suíte e2e: navegador, viewport, locale, trabalhadores, relatadores e o servidor que serve o build.
- **Âncora:** `playwright.config.ts:33` `export default defineConfig({`

### `src/app/commands.ts`
- **Lote:** L05a
- **Linhas:** 540
- **SHA1:** c914cb1103e631b0ad4a62f8b9c8956cf03274c7
- **Partes lidas:** 1-540
- **Propósito:** a tabela de comandos: o mapa único de cada comando do manifesto ao seu tratador, na ordem do manifesto, com os comandos dos módulos instalados no fim e a tabela de predicados de disponibilidade.
- **Âncora:** `src/app/commands.ts:150` `export const COMMANDS = {`

### `src/app/commands.typecheck.ts`
- **Lote:** L05a
- **Linhas:** 21
- **SHA1:** 24a384371d112d5917e2fad79d9fa6deb715c55a
- **Partes lidas:** 1-21
- **Propósito:** prova em tempo de compilação que a tabela de comandos está completa, com uma diretiva de erro esperado para cada falta e cada excesso.
- **Âncora:** `src/app/commands.typecheck.ts:9` `export const complete: CommandTable<EditorUi> = COMMANDS;`

### `src/app/features.ts`
- **Lote:** L05a
- **Linhas:** 253
- **SHA1:** 66c00a593aa5dc2a22e560fabc2f57c71716f52d
- **Partes lidas:** 1-253
- **Propósito:** a tabela de funcionalidades: o mapa de cada funcionalidade do manifesto ao seu registro, que se instala no registro do núcleo ao carregar.
- **Âncora:** `src/app/features.ts:250` `installFeatureTable(FEATURES);`

### `src/app/modules-view.ts`
- **Lote:** L05a
- **Linhas:** 27
- **SHA1:** ca00134c94bf7f3eed755143fd669393c0fd2d3f
- **Partes lidas:** 1-27
- **Propósito:** o lado editor dos módulos instalados: as vistas de barra lateral, as camadas sobre o canvas e as ferramentas de canvas que entram no dono do ponteiro uma vez, ao arrancar.
- **Âncora:** `src/app/modules-view.ts:22` `export function installModuleTools(): () => void {`

### `src/app/modules.ts`
- **Lote:** L05a
- **Linhas:** 25
- **SHA1:** 87a8e587ec33d61245968b14b2e255e0b4137ffe
- **Partes lidas:** 1-25
- **Propósito:** o lugar único onde um módulo removível entra na tabela de comandos, nos predicados e no validador do documento, com o validador de autoria registrado por namespace.
- **Âncora:** `src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`

### `src/app/wiring.ts`
- **Lote:** L05a
- **Linhas:** 16
- **SHA1:** a116692c60f702493eca111135b137c2ea2c5cd4
- **Partes lidas:** 1-16
- **Propósito:** a composição que o editor recebe: tabela de comandos, predicados, vistas de barra lateral dos módulos, camadas de canvas e a instalação das ferramentas.
- **Âncora:** `src/app/wiring.ts:10` `export const EDITOR_WIRING: EditorWiring = {`

### `src/config/product.ts`
- **Lote:** L05a
- **Linhas:** 5
- **SHA1:** d84150aaf82ffa8c3d61eead6401c4fb470829a1
- **Partes lidas:** 1-5
- **Propósito:** o único lugar onde o nome e a marca do produto são escritos.
- **Âncora:** `src/config/product.ts:2` `export const PRODUCT_NAME = 'Builder';`

### `src/core/a11y/checks.test.ts`
- **Lote:** L01
- **Linhas:** 28
- **SHA1:** b94df080f0d1bc287655ccbe8699e63dfb386b8f
- **Partes lidas:** 1-28
- **Propósito:** testa a regra do painel de Checks para um formulário sem botão de envio, montando documentos com `documentOf` e `node` e lendo `checksOf`.
- **Âncora:** `src/core/a11y/checks.test.ts:13` `return checksOf(document, manifest.interactions.checks).some((issue) => issue.node === 'form' && issue.rule === 'checks.formSubmit');`

### `src/core/a11y/checks.ts`
- **Lote:** L01
- **Linhas:** 129
- **SHA1:** 1242beb449a3cd0fa0166e7dd2ce8073c27d5afe
- **Partes lidas:** 1-129
- **Propósito:** dono único da lista de problemas de acessibilidade e estrutura da página (alt, texto e endereço de link, nível de título, contraste, título de iframe, src de imagem, botão de envio), lida do documento e nunca do DOM renderizado.
- **Âncora:** `src/core/a11y/checks.ts:99` `export function checksOf(document: DocumentJson, properties: CheckProperties): readonly CheckIssue[] {`

### `src/core/animation/animation-list.test.ts`
- **Lote:** L04b
- **Linhas:** 15
- **SHA1:** 020d08742702d75c6f73625325b310f9a7b8b954
- **Partes lidas:** 1-15
- **Propósito:** Teste do agrupamento AN3: as várias animações de um elemento viram listas CSS em uma única regra.
- **Âncora:** `src/core/animation/animation-list.test.ts:7` `describe('the animations of one element in one rule (AN3)', () => {`

### `src/core/animation/animation-names.test.ts`
- **Lote:** L04b
- **Linhas:** 35
- **SHA1:** 6814cc313c157ff4b28f4200b3d3be02829fb1b5
- **Partes lidas:** 1-35
- **Propósito:** Teste UQ1: cópia (duplicar, colar, duplicar página) recebe um nome de @keyframes livre e as interações acompanham.
- **Âncora:** `src/core/animation/animation-names.test.ts:17` `describe('a copy takes a free @keyframes name (UQ1)', () => {`

### `src/core/animation/animation.ts`
- **Lote:** L04b
- **Linhas:** 351
- **SHA1:** c44f510a937544e45f7838ca25bc28fb6f9bb316
- **Partes lidas:** 1-351
- **Propósito:** As animações de um elemento: o modelo e os comandos animation.create, rename, delete, de quadros-chave e de ajustes, com o escritor único do CSS delas.
- **Âncora:** `src/core/animation/animation.ts:28` `export const animationsOf = (node: DocNode): readonly Animation[] => node.animations ?? NONE;`

### `src/core/audit-fixes.test.ts`
- **Lote:** L01
- **Linhas:** 214
- **SHA1:** 2f9e2d4cbfa2c761f05a24017971c37b2bba7622
- **Partes lidas:** 1-214
- **Propósito:** prova os defeitos corrigidos da auditoria de código de 2026-09-30 (nomes com acento, export de classes, páginas, estrutura, área de transferência, campo deixado por um clique, grid e opacidade, trava por elemento).
- **Âncora:** `src/core/audit-fixes.test.ts:26` `expect(slug('Título do Card')).toBe('titulo-do-card');`

### `src/core/capture/edits.ts`
- **Lote:** L04a
- **Linhas:** 124
- **SHA1:** 59a66a3b0bce91b5f3826c17d8e2d8e72efe1ba7
- **Partes lidas:** 1-124
- **Propósito:** Comandos de edição (texto, atributo, remover, inserir, mover) sobre a árvore capturada de uma página, gravando cada mudança no nó e em todas as larguras observadas.
- **Âncora:** `src/core/capture/edits.ts:16` `export function findCaptured(document: DocumentJson, id: string): CapturedLocation | null {`

### `src/core/capture/merge.test.ts`
- **Lote:** L04a
- **Linhas:** 99
- **SHA1:** 3a2a47f358c2149fe1676e93c41f5bb294ddd238
- **Partes lidas:** 1-99
- **Propósito:** Testes da fusão das larguras de uma página capturada numa única árvore, verificando que cada largura projetada volta igual à observada, inclusive em páginas aleatórias.
- **Âncora:** `src/core/capture/merge.test.ts:23` `describe('the widths of a page merged into one tree', () => {`

### `src/core/capture/merge.ts`
- **Lote:** L04a
- **Linhas:** 198
- **SHA1:** 4cdf62fcdebb6a338fe3895d2347ae381992d4d1
- **Partes lidas:** 1-198
- **Propósito:** Funde as observações de várias larguras de uma página capturada numa só árvore, com os valores de cada largura no campo `at`, ausências marcadas e correspondência por subsequência comum dos filhos.
- **Âncora:** `src/core/capture/merge.ts:11` `export interface Observation {`

### `src/core/clipboard/clipboard.ts`
- **Lote:** L02
- **Linhas:** 369
- **SHA1:** d64513359e5e8cfb7551d7294c8ca7480951875d
- **Partes lidas:** 1-369
- **Propósito:** Os comandos de área de transferência: copiar, recortar e colar elementos no formato builder/elements com o HTML exportado ao lado, e copiar e colar estilos no formato builder/styles.
- **Âncora:** `src/core/clipboard/clipboard.ts:44` `export const ELEMENTS_FORMAT = 'builder/elements';`

### `src/core/clipboard/foreign-clipboard.test.ts`
- **Lote:** L02
- **Linhas:** 23
- **SHA1:** e7fa22433a1e9276c232ba68e3504f78e0a54423
- **Partes lidas:** 1-23
- **Propósito:** Testes da família CB1: uma colagem nos formatos do editor vinda de fora é recusada antes de qualquer patch.
- **Âncora:** `src/core/clipboard/foreign-clipboard.test.ts:5` `import { describe, expect, it } from 'vitest';`

### `src/core/commands/registry.ts`
- **Lote:** L01
- **Linhas:** 224
- **SHA1:** 0e6a1b3ae3b8c2c7ddab9633059913a4ca88b3f7
- **Partes lidas:** 1-224
- **Propósito:** o contrato de todo comando: entradas da tabela (`registerHandler`, `NOT_AVAILABLE_YET`), o contexto do tratador, os tipos de resultado, os predicados de disponibilidade, condições e ações de acoplamento, e a tabela de features instalável.
- **Âncora:** `src/core/commands/registry.ts:21` `export const NOT_AVAILABLE_YET = Object.freeze({ notAvailableYet: true as const });`

### `src/core/data/bindings.ts`
- **Lote:** L04b
- **Linhas:** 144
- **SHA1:** 117f0bc2115c9bc6fe102c36b363b6c59bdc69cf
- **Partes lidas:** 1-144
- **Propósito:** Elementos vinculados: o que um elemento mostra de um item, as páginas por item e o preenchimento de subárvores com os valores do item.
- **Âncora:** `src/core/data/bindings.ts:28` `export function itemPagesOf(document: DocumentJson): ItemPages {`

### `src/core/data/collections.test.ts`
- **Lote:** L04b
- **Linhas:** 269
- **SHA1:** 4d21e6b0d8a22fe752dc3765e5e00f2ffa719475
- **Partes lidas:** 1-269
- **Propósito:** Testes das regras das coleções: valor canônico de cada tipo, esquema, importações com suas recusas, edições e consulta.
- **Âncora:** `src/core/data/collections.test.ts:29` `const WORDS = { yes: 'Yes', no: 'No' };`

### `src/core/data/collections.ts`
- **Lote:** L04b
- **Linhas:** 410
- **SHA1:** 375d8ba068633bb32bfcb7c5c17919eca567b44c
- **Partes lidas:** 1-410
- **Propósito:** As coleções do projeto: funções puras de valor canônico de cada tipo, esquema, importação de linhas, edições de campos e itens e a consulta que uma lista mostra.
- **Âncora:** `src/core/data/collections.ts:16` `export class DataRefusal extends Error {`

### `src/core/data/commands.ts`
- **Lote:** L04b
- **Linhas:** 488
- **SHA1:** 8d312823260e81e1bea7b5eb2e35127edf9ff4c5
- **Partes lidas:** 1-488
- **Propósito:** Tratadores dos comandos de conteúdo: coleções, campos, itens, vínculos, listas vinculadas, páginas por item e regiões compartilhadas.
- **Âncora:** `src/core/data/commands.ts:54` `export function contentChange<Ui>(`

### `src/core/data/derive.ts`
- **Lote:** L04b
- **Linhas:** 214
- **SHA1:** 4acc90e21be350c4855d31249cbf287e48105408
- **Partes lidas:** 1-214
- **Propósito:** A derivação que segue toda mudança do documento: escrita de volta dos valores editados nos elementos, sincronização das regiões compartilhadas e materialização das listas e páginas.
- **Âncora:** `src/core/data/derive.ts:196` `export function derivedDocument(before: DocumentJson, changed: DocumentJson, context: DataContext): DocumentJson {`

### `src/core/data/materialize.ts`
- **Lote:** L04b
- **Linhas:** 136
- **SHA1:** 5743f31bd6fe86f47379f49c6ac1e0f2e4915291
- **Partes lidas:** 1-136
- **Propósito:** Faz cada lista vinculada e cada página por item mostrar a coleção dela, criando e removendo instâncias repetidas.
- **Âncora:** `src/core/data/materialize.ts:76` `export function materialize(document: DocumentJson, context: DataContext): DocumentJson {`

### `src/core/data/model.ts`
- **Lote:** L04b
- **Linhas:** 97
- **SHA1:** 4912eab93797b9ee6b01aab9974b7518036307b5
- **Partes lidas:** 1-97
- **Propósito:** Modelo do conteúdo de um projeto: tipos de campo, coleção, item, consulta, alvos de vínculo, lista vinculada, página por item e região compartilhada.
- **Âncora:** `src/core/data/model.ts:18` `export const FIELD_TYPES = ['text', 'richtext', 'image', 'number', 'date', 'link', 'boolean'] as const;`

### `src/core/data/patches.test.ts`
- **Lote:** L04b
- **Linhas:** 117
- **SHA1:** aa436e32695c91f4edf4adc81f3c3d822a3db44b
- **Partes lidas:** 1-117
- **Propósito:** Testes dos patches entre dois documentos e da parte do conteúdo no validador e na derivação.
- **Âncora:** `src/core/data/patches.test.ts:19` `describe('the patches between two documents', () => {`

### `src/core/data/patches.ts`
- **Lote:** L04b
- **Linhas:** 74
- **SHA1:** 60ff376155d7c23260321f87d112ad29f6237dbb
- **Partes lidas:** 1-74
- **Propósito:** Os menores patches de um documento para outro: nó a nó, lista de registros a registro, campo a campo.
- **Âncora:** `src/core/data/patches.ts:24` `export function treePatches(path: Path, before: DocNode, after: DocNode): Patch[] {`

### `src/core/data/readers.test.ts`
- **Lote:** L04b
- **Linhas:** 152
- **SHA1:** dfe138965f47c8f1527048fef60560017f0aa354
- **Partes lidas:** 1-152
- **Propósito:** Testes da leitura de arquivos de dados (CSV, TSV, JSON e XLSX), com as recusas nomeando o arquivo e onde está o problema.
- **Âncora:** `src/core/data/readers.test.ts:24` `describe('CSV and TSV', () => {`

### `src/core/data/readers.ts`
- **Lote:** L04b
- **Linhas:** 280
- **SHA1:** dc938ff19ef9146f9855e985e8c46b194f5b2a6d
- **Partes lidas:** 1-280
- **Propósito:** Leitura de arquivos de dados entregues por uma pessoa (CSV, TSV, JSON e XLSX) como folhas de colunas e linhas para a prévia de importação.
- **Âncora:** `src/core/data/readers.ts:258` `export async function readDataFile(name: string, bytes: Uint8Array, xml: XmlReader): Promise<DataFile> {`

### `src/core/data/regions.ts`
- **Lote:** L04b
- **Linhas:** 222
- **SHA1:** a49184d8fdd5f86b53886056f4ca0143a1da7c4d
- **Partes lidas:** 1-222
- **Propósito:** Regiões compartilhadas: compartilhar, desanexar e parar de compartilhar, e sincronizar o conteúdo entre definição e instâncias.
- **Âncora:** `src/core/data/regions.ts:23` `export const NEW_PAGES = 'new';`

### `src/core/data/targets.ts`
- **Lote:** L04b
- **Linhas:** 27
- **SHA1:** 6db94d9e657e956a070b94a2598d45a002fb55f7
- **Partes lidas:** 1-27
- **Propósito:** As partes de um elemento que um vínculo pode preencher e quais campos servem a cada alvo.
- **Âncora:** `src/core/data/targets.ts:12` `export function targetsOf(node: DocNode, rules: ModelRules): readonly BindTarget[] {`

### `src/core/data/validate.ts`
- **Lote:** L04b
- **Linhas:** 123
- **SHA1:** 2fafe7b64c1199e060c735ed0699c7fd425601c8
- **Partes lidas:** 1-123
- **Propósito:** A parte do conteúdo no validador do documento: coleções e valores canônicos, marcas de vínculo, listas, páginas por item e regiões compartilhadas.
- **Âncora:** `src/core/data/validate.ts:95` `export function dataProblems(document: DocumentJson, rules: ModelRules): DataProblem[] {`

### `src/core/design/classes.test.ts`
- **Lote:** L03
- **Linhas:** 59
- **SHA1:** de43a1e2082e315327ed2fc8a0f3034f78d63751
- **Partes lidas:** 1-59
- **Propósito:** Testa os comandos de classes moveIntoClassCommand e applyToSimilarCommand: mover os estilos próprios do elemento para uma classe existente, aplicar a classe aos demais elementos do tipo e as recusas de cada caso, conferindo o documento resultante com validateDocument.
- **Âncora:** `src/core/design/classes.test.ts:34` `describe('class moves', () => {`

### `src/core/design/classes.ts`
- **Lote:** L03
- **Linhas:** 228
- **SHA1:** 248ab2c87a4e5ec45bb7192e3359e19dda773f3d
- **Partes lidas:** 1-228
- **Propósito:** Dono único dos comandos de classes de estilo do projeto (classes.create, classes.apply, classes.detach, classes.rename, classes.delete, classes.moveInto e classes.applyToSimilar) e das leituras targetClass, classesOf, usesOfClass, missingClassDefinitions e renameClassPatches.
- **Âncora:** `src/core/design/classes.ts:21` `export const classesOf = (document: DocumentJson): readonly StyleClass[] => document.classes ?? NONE;`

### `src/core/design/colors.ts`
- **Lote:** L03
- **Linhas:** 29
- **SHA1:** 62cba537e99b0f9dc1a52581d77c5dcc21b6d1f1
- **Partes lidas:** 1-29
- **Propósito:** Comandos colors.saveSwatch e colors.removeSwatch, que guardam e removem as cores salvas do projeto no documento (campo swatches), um passo de undo cada, com swatchesOf como leitura.
- **Âncora:** `src/core/design/colors.ts:10` `export const swatchesOf = (document: DocumentJson): readonly string[] => document.swatches ?? NONE;`

### `src/core/design/component-update.test.ts`
- **Lote:** L03
- **Linhas:** 20
- **SHA1:** cf03ef8180bd41756c287c2f3eafefda216b22a3
- **Partes lidas:** 1-20
- **Propósito:** Teste da família CS1: uma instância cuja parte é um elemento de outro tipo recebe o elemento editado inteiro em components.updateFromInstance, sem problemas no documento.
- **Âncora:** `src/core/design/component-update.test.ts:9` `describe('Update component keeps values of the same element only (CS1)', () => {`

### `src/core/design/components.test.ts`
- **Lote:** L03
- **Linhas:** 123
- **SHA1:** 3297b8367d7adca6dbf3ce276e5b56e1962ba6ae
- **Partes lidas:** 1-123
- **Propósito:** Testes dos comandos de componentes (criar, inserir instância e desanexar), da escrita de estilo num elemento de instância que alcança a definição e todas as instâncias, e do nome-base das variantes (variantBase).
- **Âncora:** `src/core/design/components.test.ts:42` `describe('components.create (spec reusable-components)', () => {`

### `src/core/design/components.ts`
- **Lote:** L03
- **Linhas:** 473
- **SHA1:** e79d94fa259b822dc79f5c18ad209cc70e747fc4
- **Partes lidas:** 1-473
- **Propósito:** Dono único dos comandos de componentes reutilizáveis (components.create, insertInstance, detach, repeat, fillFromData, updateFromInstance e setVariant), mais as recusas instanceMoveRefusal e createRefusal e os utilitários marked, unmarked, copied e componentName.
- **Âncora:** `src/core/design/components.ts:294` `const IMAGE = 'image';`

### `src/core/design/data.test.ts`
- **Lote:** L03
- **Linhas:** 35
- **SHA1:** ec0c67d3b007832ae296f8d890e0f2b2285690a0
- **Partes lidas:** 1-35
- **Propósito:** Testes do leitor de arquivos de dados (dataRows, csvLines e isDataFile): lista JSON de objetos, o único array de um objeto, CSV com aspas e acentos, CRLF e arquivos sem linhas legíveis.
- **Âncora:** `src/core/design/data.test.ts:7` `describe('dataRows', () => {`

### `src/core/design/data.ts`
- **Lote:** L03
- **Linhas:** 86
- **SHA1:** 149c2021a329f0245f384324f01066ff4946917d
- **Partes lidas:** 1-86
- **Propósito:** Lê as linhas de um arquivo de dados do projeto (lista JSON ou CSV/TSV cuja primeira linha nomeia as colunas) como DataRow com nomes e valores, devolvendo null quando o arquivo não tem linhas que o leitor leia.
- **Âncora:** `src/core/design/data.ts:12` `const text = (file: ProjectFile): string => new TextDecoder().decode(fileBytes(file));`

### `src/core/design/fill-from-data.test.ts`
- **Lote:** L03
- **Linhas:** 91
- **SHA1:** 8fe2a1b43d3d32ba319331bd7147648b8ea3e897
- **Partes lidas:** 1-91
- **Propósito:** Testes do Fill from data com a planilha de Carla: casamento de colunas por nome e por tipo, fotos achadas por nome de arquivo, imagem recusada nomeando linha, coluna e célula, e imageSource lendo caminho, nome de arquivo e endereço da web.
- **Âncora:** `src/core/design/fill-from-data.test.ts:54` `describe('Fill from data', () => {`

### `src/core/design/fill-locked.test.ts`
- **Lote:** L03
- **Linhas:** 23
- **SHA1:** ce630e6537d4a133bb499da89b190d8b01d3ee6d
- **Partes lidas:** 1-23
- **Propósito:** Teste da família LK2: components.fillFromData é recusado quando um item que reescreveria está trancado.
- **Âncora:** `src/core/design/fill-locked.test.ts:18` `describe('a fill from data never rewrites a locked item (LK2)', () => {`

### `src/core/design/instances.test.ts`
- **Lote:** L03
- **Linhas:** 54
- **SHA1:** ec53aa9f3a609470a930a4b0b69807606f6e5c10
- **Partes lidas:** 1-54
- **Propósito:** Teste da família AUD-04 que roda os comandos de estrutura sobre cada nó das fixtures com instâncias, provando que nenhuma parte sai da sua instância nem instância entra em outra, e que as recusas dizem a regra em palavras.
- **Âncora:** `src/core/design/instances.test.ts:27` `describe('structure commands and component instances (AUD-04)', () => {`

### `src/core/design/instances.ts`
- **Lote:** L03
- **Linhas:** 48
- **SHA1:** 4b3430db250ec240906f943098f02e6875e50b66
- **Partes lidas:** 1-48
- **Propósito:** Leituras do documento sobre componentes sem importar os comandos: componentsOf, instanceRootOf (a raiz da instância em que um nó está) e componentHolders (os lugares que uma escrita de estilo num elemento de instância alcança).
- **Âncora:** `src/core/design/instances.ts:11` `export const componentsOf = (document: DocumentJson): readonly ComponentDefinition[] => document.components ?? NONE;`

### `src/core/design/site-colours.test.ts`
- **Lote:** L03
- **Linhas:** 21
- **SHA1:** 310df7f7800e08728812cc0a0b0d8b9fbb885d47
- **Partes lidas:** 1-21
- **Propósito:** Testes de colourKey: uma grafia única por cor (hex de 3, 4, 6 e 8 dígitos, rgb() e rgba()), alfa guardado quando não opaco, e null para textos que não são cor.
- **Âncora:** `src/core/design/site-colours.test.ts:5` `describe('a colour of the site', () => {`

### `src/core/design/site-colours.ts`
- **Lote:** L03
- **Linhas:** 180
- **SHA1:** cd347ac1c6e81359b8b5811e2be88c0a03867eef
- **Partes lidas:** 1-180
- **Propósito:** Dono único das cores do site e da sua troca (siteColoursOf, colourKey, design.replaceColour e design.colourToVariable), coletando valores de estilo de páginas, classes, componentes e linhas de animação, com recusa por tranca.
- **Âncora:** `src/core/design/site-colours.ts:26` `export function colourKey(text: string): string | null {`

### `src/core/design/suggest.test.ts`
- **Lote:** L03
- **Linhas:** 23
- **SHA1:** f36fc49800bc12ed55f8a7598ce682561f82e082
- **Partes lidas:** 1-23
- **Propósito:** Testes de suggestionsOf e suggestedName: oferecer como sugestão o que todos os elementos de um tipo repetem e nomear a classe nova com o primeiro nome livre.
- **Âncora:** `src/core/design/suggest.test.ts:11` `describe('style suggestions', () => {`

### `src/core/design/suggest.ts`
- **Lote:** L03
- **Linhas:** 90
- **SHA1:** 4ac4196ad405b46581e8f70dfbc9d9fd5b41cdb7
- **Partes lidas:** 1-90
- **Propósito:** As sugestões de repetição e o comando design.applySuggestion: suggestionsOf agrupa por tipo os elementos de todas as páginas e acha as declarações comuns, suggestedName nomeia a classe, e a aplicação move essas declarações para uma classe nova num passo de undo.
- **Âncora:** `src/core/design/suggest.ts:16` `const [BASE_BREAKPOINT = '', BASE_STATE = ''] = 'desktop base'.split(' ');`

### `src/core/design/token-timelines.test.ts`
- **Lote:** L03
- **Linhas:** 28
- **SHA1:** 6a976f432b1b550562f6f0e06370b1cf63d7a7fd
- **Partes lidas:** 1-28
- **Propósito:** Teste da família SV1: renomear uma variável alcança as linhas de animação (motionTimelines), apagar uma variável em uso é recusado, e as cores dos quadros-chave de animação entram nas cores do site.
- **Âncora:** `src/core/design/token-timelines.test.ts:18` `describe('every store of values is read (SV1)', () => {`

### `src/core/design/tokens.test.ts`
- **Lote:** L03
- **Linhas:** 92
- **SHA1:** 764f029bf2bb28819aec358692bc33530ae0e1be
- **Partes lidas:** 1-92
- **Propósito:** Testes das variáveis do projeto (usesOf, usesToken, renameToken e deleteToken): usos no elemento, nos quadros-chave e na classe, renomeação de todos os usos num passo de undo, e recusas de exclusão com a contagem de elementos.
- **Âncora:** `src/core/design/tokens.test.ts:43` `describe('the variable references (spec css-variables-tokens, Problems in Pager 2 and 3)', () => {`

### `src/core/design/tokens.ts`
- **Lote:** L03
- **Linhas:** 263
- **SHA1:** d9b9deab20e29cf52d58a48a26793bb0f2b9d994
- **Partes lidas:** 1-263
- **Propósito:** Dono único das variáveis de design do projeto como CSS custom properties: tokens.create, update, rename e delete (renomeando todo var(--nome) que a usa e recusando excluir uma em uso), mais usesOf, usesToken, renameTokenPatches, rootCss e tokenKindOf.
- **Âncora:** `src/core/design/tokens.ts:31` `export const tokensOf = (document: DocumentJson): readonly Token[] => document.tokens ?? NONE;`

### `src/core/document/authoring.test.ts`
- **Lote:** L01
- **Linhas:** 24
- **SHA1:** 5b9bcd65d3765bb4659b4f396b901296688961a8
- **Partes lidas:** 1-24
- **Propósito:** testa os dados de autoria de módulos removíveis: namespace sem módulo instalado passa, o que não é JSON é recusado e o validador registrado é consultado enquanto durar.
- **Âncora:** `src/core/document/authoring.test.ts:8` `expect(authoringProblems({ 'gone-module': { role: 'container', intent: { regions: [] } } })).toEqual([]);`

### `src/core/document/authoring.ts`
- **Lote:** L01
- **Linhas:** 51
- **SHA1:** 05c8d1ed18bd6ab0aa2656f5285f182d883f8957
- **Partes lidas:** 1-51
- **Propósito:** guarda os dados de autoria de módulos removíveis sob um nó e valida cada namespace com o validador que o módulo instalado registra.
- **Âncora:** `src/core/document/authoring.ts:20` `export function registerAuthoringValidator(namespace: string, validator: AuthoringValidator): () => void {`

### `src/core/document/breakpoint-rules.ts`
- **Lote:** L01
- **Linhas:** 113
- **SHA1:** 5e3876f4d1b7cd4559c16ecf341d24a2bb7ad409
- **Partes lidas:** 1-113
- **Propósito:** a forma da tabela de breakpoints do projeto, as regras que a validam e o que ela muda no modelo de saída e nas regras do modelo, em cache por tabela.
- **Âncora:** `src/core/document/breakpoint-rules.ts:22` `export const MIN_BREAKPOINT_WIDTH = 240;`

### `src/core/document/breakpoints.ts`
- **Lote:** L01
- **Linhas:** 178
- **SHA1:** 8ec756989698f68b36b063568bb7fd3f412edd51
- **Partes lidas:** 1-178
- **Propósito:** a tabela de breakpoints que cada leitor toma (a do projeto ou a padrão), o rótulo de cada um, e as mudanças de tabela (acrescentar, renomear, redimensionar, remover com ou sem destino).
- **Âncora:** `src/core/document/breakpoints.ts:20` `export const breakpointsOf = (document: Tabled): readonly ProjectBreakpoint[] => document.breakpoints ?? DEFAULT_BREAKPOINTS;`

### `src/core/document/captured.test.ts`
- **Lote:** L01
- **Linhas:** 83
- **SHA1:** 43cf72e3fbd085241782ce91e7d20f5cef4ff2ab
- **Partes lidas:** 1-83
- **Propósito:** testa a captura de uma página: conteúdo misto ordenado, tags desconhecidas, namespace SVG, atributos executáveis removidos, validação do pacote e leitura das versões 1 e 2.
- **Âncora:** `src/core/document/captured.test.ts:21` `expect(root.attributes).toContainEqual({ name: 'class', namespace: null, value: 'brand' });`

### `src/core/document/captured.ts`
- **Lote:** L01
- **Linhas:** 238
- **SHA1:** 8fd1f04bef00ba0f6678086835c8a98d6720789e
- **Partes lidas:** 1-238
- **Propósito:** o modelo JSON da página capturada (uma árvore para todas as larguras observadas, com valores por largura), o que é inseguro nele e a leitura de um pacote de captura nos formatos 1 e 2.
- **Âncora:** `src/core/document/captured.ts:96` `export function unsafeCapturedElement(tag: string, attributes: readonly Pick<CapturedAttribute, 'name'>[]): boolean {`

### `src/core/document/clone.ts`
- **Lote:** L01
- **Linhas:** 98
- **SHA1:** 5fa6ee1cc6add2b4dbdaac38e281f356272473d6
- **Partes lidas:** 1-98
- **Propósito:** repara as identidades de uma cópia de subárvore: ids HTML, referências internas do grupo copiado, alvos de interação, cores de camada, links em linha e nomes de animação.
- **Âncora:** `src/core/document/clone.ts:42` `export function refreshCopiedIdentities(document: DocumentJson, pairs: readonly Pair[], regenerateHtmlIds: boolean | 'collisions' = true): DocNode[] {`

### `src/core/document/migrations.test.ts`
- **Lote:** L01
- **Linhas:** 64
- **SHA1:** dcba71bb3e217660106c436257cafe3ba0501dac
- **Partes lidas:** 1-64
- **Propósito:** prova a cadeia de migrações do documento: versão corrente passa, antiga avança passo a passo, versão mais nova e buraco na cadeia são recusados com razão, e o leitor de projeto usa a cadeia.
- **Âncora:** `src/core/document/migrations.test.ts:23` `it('carries an older document forward, step by step', () => {`

### `src/core/document/migrations.ts`
- **Lote:** L01
- **Linhas:** 60
- **SHA1:** 3637853fe3dec0c785c17910cd41d5c6470fa477
- **Partes lidas:** 1-60
- **Propósito:** dono único das versões do formato do documento: leva um documento antigo até a versão corrente pela cadeia de passos e recusa o mais novo ou o que não tem passo.
- **Âncora:** `src/core/document/migrations.ts:46` `export function migrateDocument(parsed: unknown, chain: readonly Migration[] = MIGRATIONS, current: number = DOCUMENT_VERSION): MigrationResult {`

### `src/core/document/model.ts`
- **Lote:** L01
- **Linhas:** 321
- **SHA1:** b46e8e3bdb220be9fe370aba1cc2b09246a5ac5c
- **Partes lidas:** 1-321
- **Propósito:** o JSON do documento: o tipo `DocNode` e todos os seus campos, o tipo `DocumentJson`, a criação do projeto vazio, a caminhada das árvores e a localização de um nó com índice por árvore.
- **Âncora:** `src/core/document/model.ts:17` `export const DOCUMENT_VERSION = 4;`

### `src/core/document/pattern-flag.test.ts`
- **Lote:** L01
- **Linhas:** 14
- **SHA1:** 0e2c2caea3f5bbd60511cb75e1ba4334730045f2
- **Partes lidas:** 1-14
- **Propósito:** prova que o atributo `pattern` é lido como o navegador o lê, com a flag v, recusando `[(]` e aceitando `[0-9]{3}`.
- **Âncora:** `src/core/document/pattern-flag.test.ts:11` `expect(attributeValueRefusal('pattern', '[(]', RULES)).not.toBeNull();`

### `src/core/document/references-follow.test.ts`
- **Lote:** L01
- **Linhas:** 143
- **SHA1:** d2078814f667093f28a204a975dca71962c141a0
- **Partes lidas:** 1-143
- **Propósito:** prova um caso por dono de que o que aponta para algo o acompanha quando ele se move, muda de nome ou sai, no mesmo passo de desfazer.
- **Âncora:** `src/core/document/references-follow.test.ts:27` `it('an imported section a link names by its HTML id is deleted, and the link lets go of it', () => {`

### `src/core/document/tree.ts`
- **Lote:** L01
- **Linhas:** 104
- **SHA1:** 063fc93e14d6536639bde6312e681b971cb93627
- **Partes lidas:** 1-104
- **Propósito:** as invariantes da árvore num só lugar: os patches que tiram uma subárvore, soltam as referências que apontavam para o que sai e a regra que diz se um movimento poria um nó dentro dele mesmo.
- **Âncora:** `src/core/document/tree.ts:29` `export function movesIntoItself(moved: readonly DocNode[], parentId: NodeId): boolean {`

### `src/core/document/validate.test.ts`
- **Lote:** L01
- **Linhas:** 92
- **SHA1:** 6512c90039ebf6143f754b003ea51ad267c9f466
- **Partes lidas:** 1-92
- **Propósito:** testa a validação do documento inteiro: raiz da página, ids repetidos, tipos e tags, atributos, classes, breakpoints, estados, propriedades, texto contra filhos, flags de oculto e de trava, seleção e páginas.
- **Âncora:** `src/core/document/validate.test.ts:20` `it('takes the page root from the manifest: the element whose tag is body', () => {`

### `src/core/document/validate.ts`
- **Lote:** L01
- **Linhas:** 663
- **SHA1:** e8968b0b3c747cf8983c1987ce102863417f2a2d
- **Partes lidas:** 1-663
- **Propósito:** a validação da árvore inteira que a store roda a cada commit: monta as `ModelRules` do manifesto, valida estilos, atributos e pares de atributos, marca de texto em linha, instâncias de componente, captura, movimento, interações e referências órfãs, e nunca repara nada.
- **Âncora:** `src/core/document/validate.ts:333` `export function validateDocument(doc: DocumentJson, selection: Selection, manifestRules: ModelRules): Invalid[] {`

### `src/core/elements/address.ts`
- **Lote:** L03
- **Linhas:** 79
- **SHA1:** f9b2c5562358a322cafb3efa3a732ff2a2d900a5
- **Partes lidas:** 1-79
- **Propósito:** A regra única de um endereço (readAddress e addressAllowed): fragmento, caminho, endereço da web, mailto e tel aceitos, domínio digitado sem esquema normalizado para https, e esquemas que rodam código ou entregam documento recusados com o motivo.
- **Âncora:** `src/core/elements/address.ts:44` `export function readAddress(typed: string): Address {`

### `src/core/elements/attributes.ts`
- **Lote:** L03
- **Linhas:** 307
- **SHA1:** 0ef137f87de637ac76d27d63fffd05f707a77c64
- **Partes lidas:** 1-307
- **Propósito:** Comandos dos atributos de um elemento (element.setId, element.setClasses, element.setAttribute, element.setCustomAttribute e element.removeCustomAttribute) com as validações de id único, nomes de classe, tipos de valor dos atributos do manifesto, relações entre campos e atributos próprios que não são do editor.
- **Âncora:** `src/core/elements/attributes.ts:26` `const ID = /^[A-Za-z][A-Za-z0-9_-]*$/;`

### `src/core/elements/captured-receiver.test.ts`
- **Lote:** L03
- **Linhas:** 35
- **SHA1:** dfafeefbd1b09cc4b555d84984257331d6f885f4
- **Partes lidas:** 1-35
- **Propósito:** Teste da família CA1: uma página capturada não recebe elemento — inserir e colar com essa página aberta são recusados com status.capture.noElements.
- **Âncora:** `src/core/elements/captured-receiver.test.ts:25` `describe('a captured page takes no element (CA1)', () => {`

### `src/core/elements/content-model.ts`
- **Lote:** L03
- **Linhas:** 317
- **SHA1:** d13a2f499695ce3d49b8793f32aebf333027fe30
- **Partes lidas:** 1-317
- **Propósito:** O modelo de conteúdo HTML: contentModelFrom lê listas fechadas, exclusões, categorias, ordem, atributos por tag e elementos estrangeiros, e placementRefusal, childrenRefusal, interactiveInsideRefusal e retagRefusal são a regra que todo comando que põe elementos consulta.
- **Âncora:** `src/core/elements/content-model.ts:83` `export function contentModelFrom(html: GeneratedHtml, foreign: ReadonlyMap<string, readonly string[]> = new Map()): ContentModel {`

### `src/core/elements/custom-address.test.ts`
- **Lote:** L03
- **Linhas:** 23
- **SHA1:** 8aeb78bbfad9b1ca5c9dffc6e92fc9c22a8fdd42
- **Partes lidas:** 1-23
- **Propósito:** Teste da família XA1: um atributo próprio que segura um endereço passa pela regra única de endereço — formaction com javascript: é recusado ao digitar, e um documento que o guarde é apontado pelo validador.
- **Âncora:** `src/core/elements/custom-address.test.ts:11` `describe('an address a custom attribute holds passes the address rule (XA1)', () => {`

### `src/core/elements/embed.ts`
- **Lote:** L03
- **Linhas:** 29
- **SHA1:** 3da24bee79fb7d2ed95cb9b87bf47fd70b29ed45
- **Partes lidas:** 1-29
- **Propósito:** element.setEmbedMarkup, que guarda a marcação do Embed selecionado como texto, e holdsExecutableCode, que reconhece script, atributo de evento e endereço que roda código na marcação.
- **Âncora:** `src/core/elements/embed.ts:12` `export function holdsExecutableCode(markup: string): boolean {`

### `src/core/elements/inputs.ts`
- **Lote:** L03
- **Linhas:** 165
- **SHA1:** ae5d41c4a862246755ffce94d4b6a3aeb1414b03
- **Partes lidas:** 1-165
- **Propósito:** Regras dos campos de formulário: quais atributos cada tipo de input aceita (attributeApplies e droppedInputAttributes), as regras de validação que cada tipo de controle pode quebrar (rulesOfControl), element.setInputType, element.setLabelTarget e as leituras freshId, formControls e isValueControl.
- **Âncora:** `src/core/elements/inputs.ts:76` `export const inputTypeOf = (node: DocNode): string => String(node.attributes.inputType ?? 'text');`

### `src/core/elements/link.test.ts`
- **Lote:** L03
- **Linhas:** 108
- **SHA1:** d63e7cd0e58798ba8ae429bdb040b39c6da39652
- **Partes lidas:** 1-108
- **Propósito:** Testes de element.setLink: gravar, substituir e remover o href, atuar no elemento selecionado sem nó nomeado, tomar o endereço pela regra única, e recusar sem endereço, elemento sem link, elemento trancado e seleção múltipla.
- **Âncora:** `src/core/elements/link.test.ts:54` `describe('element.setLink (src/core/elements/link.ts)', () => {`

### `src/core/elements/link.ts`
- **Lote:** L03
- **Linhas:** 102
- **SHA1:** 6c5c4c9fdb811d65130a2435c5f8e24382feb5c9
- **Partes lidas:** 1-102
- **Propósito:** element.setLink, que escreve o href do Link Block ou do link a partir de um endereço, de uma página do projeto ou de uma âncora, com a regra única de endereço, a escolha de abrir em nova aba e as recusas por tranca.
- **Âncora:** `src/core/elements/link.ts:25` `const LINK = 'href';`

### `src/core/elements/parts.ts`
- **Lote:** L03
- **Linhas:** 127
- **SHA1:** 2e2cb8ee98560d768980dd4307d33a865fc70780
- **Partes lidas:** 1-127
- **Propósito:** Comandos das partes de um elemento: parts.toggle (legenda, cabeçalho e pé da tabela), parts.add, parts.move e parts.remove, com as recusas por capacidade do contentor, marcação de SVG e tranca, e as leituras partTypesOf e selectionInTable.
- **Âncora:** `src/core/elements/parts.ts:16` `const TABLE = 'table';`

### `src/core/elements/references.ts`
- **Lote:** L03
- **Linhas:** 101
- **SHA1:** e7f02c894d9ad7b6df2ea8d85740986f90d5716d
- **Partes lidas:** 1-101
- **Propósito:** A regra única das referências entre elementos (for de um label e href de fragmento): guardar o id interno do alvo, resolvedReference escrever o atributo id do momento, orphanReferences apontar as órfãs e referencesTo contar quem aponta para um nó.
- **Âncora:** `src/core/elements/references.ts:12` `const REFERENCE_HTM = ['for', 'href'];`

### `src/core/elements/rules-of-control.test.ts`
- **Lote:** L03
- **Linhas:** 31
- **SHA1:** 3319be82258645fdde9c2a6bdbc41cc2d5952e02
- **Partes lidas:** 1-31
- **Propósito:** Testes de rulesOfControl: checkbox e radio só requerido e configuração, texto com contagens e padrão, senha com os requisitos, data com os dias, número com limites, arquivo com tipos e tamanhos, e select com os valores permitidos.
- **Âncora:** `src/core/elements/rules-of-control.test.ts:10` `describe('rulesOfControl', () => {`

### `src/core/elements/svg-animation.test.ts`
- **Lote:** L03
- **Linhas:** 11
- **SHA1:** 778074d98eed8cad6c7b16e715da5f8575911408
- **Partes lidas:** 1-11
- **Propósito:** Teste da família S1: sanitizedSvgMarkup tira to, values e from que seguram javascript: num elemento de animação de um SVG.
- **Âncora:** `src/core/elements/svg-animation.test.ts:6` `describe('an SVG keeps no animated link that runs code (S1)', () => {`

### `src/core/elements/svg-html.test.ts`
- **Lote:** L03
- **Linhas:** 34
- **SHA1:** df874078a1932b8fe81d1eac11989b3a7a4a58b2
- **Partes lidas:** 1-34
- **Propósito:** Teste da família S1: a marcação de SVG perde elementos HTML com o que eles seguram e endereços que rodam código escritos com referências de caracteres, e svgMarkupOf escreve sempre pelo sanitizador.
- **Âncora:** `src/core/elements/svg-html.test.ts:15` `describe('an SVG keeps only SVG elements and no address that runs code (S1)', () => {`

### `src/core/elements/svg.test.ts`
- **Lote:** L03
- **Linhas:** 60
- **SHA1:** 61f3ca3ab384c82e2e8fb8a99ab70633447a6447
- **Partes lidas:** 1-60
- **Propósito:** Testes do sanitizador de marcação SVG (elementos, atributos e texto preservados; script, foreignObject, atributos de evento e endereços de script fora; desembrulhar um svg colado) e da geometria das formas (viewBox, colocação de uma forma nova e redimensionamento).
- **Âncora:** `src/core/elements/svg.test.ts:11` `describe('sanitizedSvgMarkup', () => {`

### `src/core/elements/svg.ts`
- **Lote:** L03
- **Linhas:** 316
- **SHA1:** 0815747829e24c4ff08459fab80b539cb4ed99b1
- **Partes lidas:** 1-316
- **Propósito:** Dono único do SVG/Ícone: element.setSvgMarkup com o sanitizador que parte marcação mal formada com o motivo, svgMarkupOf como leitura única da marcação guardada, o viewBox do elemento (viewBoxOf) e a geometria das formas (geometryAttributes, shapeGeometry, shapeBox, shapeResizeFrom e resizedShape).
- **Âncora:** `src/core/elements/svg.ts:188` `const MARKUP = 'svgMarkup';`

### `src/core/elements/table.ts`
- **Lote:** L03
- **Linhas:** 163
- **SHA1:** f9413d3069063e2fe7ffec7f9c38bb7e2f599454
- **Partes lidas:** 1-163
- **Propósito:** Tabelas: as partes com que uma tabela nova começa (startingParts e newRow) e os comandos de coluna e linha (table.addColumnAfter, addColumnEnd, removeColumn, addRowAfter e removeRow), com as recusas de última coluna e última linha e a liberação das referências que apontavam para o que sai.
- **Âncora:** `src/core/elements/table.ts:34` `export function newRow(make: NodeMaker, group: string, count: number): DocNode {`

### `src/core/elements/tag.test.ts`
- **Lote:** L03
- **Linhas:** 158
- **SHA1:** 301f4b5d6797cf055ee5f3ca7cd83f6f0eef9286
- **Partes lidas:** 1-158
- **Propósito:** Testes de equivalentTags e element.setTag: trocar a tag entre as equivalentes do tipo mantendo o resto do nó, e recusar tag não equivalente, tranca, lista fechada do pai, exclusões do modelo de conteúdo e interativo dentro de interativo.
- **Âncora:** `src/core/elements/tag.test.ts:71` `describe('element.setTag', () => {`

### `src/core/elements/tag.ts`
- **Lote:** L03
- **Linhas:** 57
- **SHA1:** f6e6c1a3db2aa4546efc786e7939e54d3f61ef17
- **Partes lidas:** 1-57
- **Propósito:** element.setTag, que troca a tag do elemento selecionado entre as equivalentes do seu tipo (equivalentTags), perde os atributos que a nova tag não aceita e pergunta retagRefusal antes de gravar, num passo de undo.
- **Âncora:** `src/core/elements/tag.ts:22` `export function equivalentTags(element: ElementRules): readonly string[] {`

### `src/core/events/interaction-rule.ts`
- **Lote:** L04b
- **Linhas:** 44
- **SHA1:** 7c134015991276e0163b0f9dca8ef51980e34e65
- **Partes lidas:** 1-44
- **Propósito:** A fronteira de confiança das interações sem o manifesto: gatilhos, ações e campos aceitos, lida pelo validador e por interactions.add.
- **Âncora:** `src/core/events/interaction-rule.ts:17` `export const MAX_DELAY = 10_000;`

### `src/core/events/interactions-trust.test.ts`
- **Lote:** L04b
- **Linhas:** 29
- **SHA1:** eb29f3bb160b6f584aea22fe5b8e365e8fc7d6ee
- **Partes lidas:** 1-29
- **Propósito:** Teste EV2: o validador e interactions.add recusam interações que abrem endereço que roda código ou nomeiam o que não existe.
- **Âncora:** `src/core/events/interactions-trust.test.ts:13` `describe('event interactions pass the trust boundary (EV2)', () => {`

### `src/core/events/interactions.ts`
- **Lote:** L04b
- **Linhas:** 383
- **SHA1:** d7382d3b1d760109635da99d196e470aed161e3e
- **Partes lidas:** 1-383
- **Propósito:** As interações de um elemento: os comandos add, update e remove, as opções e os leitores que o export pede.
- **Âncora:** `src/core/events/interactions.ts:28` `export const interactionsOf = (node: DocNode): readonly Interaction[] => node.interactions ?? NONE;`

### `src/core/events/played-holder.test.ts`
- **Lote:** L04b
- **Linhas:** 26
- **SHA1:** 379e68a9d84cf18220f7020dc33747909a4f7b33
- **Partes lidas:** 1-26
- **Propósito:** Teste EV3: a animação que um evento toca pertence ao elemento que guarda a interação, e o export escreve a regra de classe dela.
- **Âncora:** `src/core/events/played-holder.test.ts:20` `describe('an animation an event plays belongs to the element that holds it (EV3)', () => {`

### `src/core/events/script-scope.test.ts`
- **Lote:** L04b
- **Linhas:** 23
- **SHA1:** 4433055b500511dca2c526c6d38b5b01d2c158a1
- **Partes lidas:** 1-23
- **Propósito:** Teste EV1: o script amarra a interação ao escopo que ela diz e uma só vez quando instâncias compartilham a classe.
- **Âncora:** `src/core/events/script-scope.test.ts:12` `describe('the interactions script binds what the interaction says, once (EV1)', () => {`

### `src/core/events/script.test.ts`
- **Lote:** L04b
- **Linhas:** 124
- **SHA1:** f7d362c5144d54ddcc8d2333f7e0ea593d781895
- **Partes lidas:** 1-124
- **Propósito:** Testes de readOptions e das Options no script exportado, executado contra uma página de apoio.
- **Âncora:** `src/core/events/script.test.ts:66` `describe('readOptions', () => {`

### `src/core/events/script.ts`
- **Lote:** L04b
- **Linhas:** 215
- **SHA1:** c99e94cc2e8c0292f61332f2e4fd55b72da3fa86
- **Partes lidas:** 1-215
- **Propósito:** O escritor único do js/interactions.js do site: gatilhos, ações e opções das interações em JavaScript simples.
- **Âncora:** `src/core/events/script.ts:23` `export const pageNeedsScript = (tree: DocNode): boolean =>`

### `src/core/explain.test.ts`
- **Lote:** L01
- **Linhas:** 81
- **SHA1:** 145179f8ff4ce4aafc5ff000ab13290a641ecb8e
- **Partes lidas:** 1-81
- **Propósito:** testa as respostas de engenharia de `explain.ts`: por que uns nós não entram num pai, a recusa numa linha e o que o documento diz de um nó.
- **Âncora:** `src/core/explain.test.ts:50` `const refused = whyNotAccepted(doc, RULES, 'List' as NodeId, ['Para' as NodeId]);`

### `src/core/explain.ts`
- **Lote:** L01
- **Linhas:** 70
- **SHA1:** 3379d42e607145727f08a49dda4e8c574732edd3
- **Partes lidas:** 1-70
- **Propósito:** superfície de leitura que responde "por quê" sobre o documento, reunindo as respostas dos donos (modelo de conteúdo, travas, checks) sem executar comando algum.
- **Âncora:** `src/core/explain.ts:27` `export function whyNotAccepted(document: DocumentJson, rules: ModelRules, parentId: NodeId, nodes: readonly NodeId[]): { readonly asked: string; readonly refusal: Message | null } {`

### `src/core/export/authoring.test.ts`
- **Lote:** L04a
- **Linhas:** 29
- **SHA1:** 04e5400649a20735e2d1eb82b2b0febb643b4fc1
- **Partes lidas:** 1-29
- **Propósito:** Testes de `renameBatch` e `projectLanguagePatches`: lote de renomeação atômico com travas e recusa de pai, e idiomas de projeto válidos.
- **Âncora:** `src/core/export/authoring.test.ts:1` `import {test} from 'vitest';`

### `src/core/export/authoring.ts`
- **Lote:** L04a
- **Linhas:** 38
- **SHA1:** ee07251f6dc5ef667be31b7273122b7e4ae55410
- **Partes lidas:** 1-38
- **Propósito:** Auxiliares de autoria do export: patches do idioma do projeto, renomeação de um lote de nós reutilizando o comando de renomear, e coleta dos nós dentro de formulários.
- **Âncora:** `src/core/export/authoring.ts:17` `// Reuse the rename owner for every refusal and patch; no partial changes escape when one target is locked.`

### `src/core/export/clean-export.test.ts`
- **Lote:** L04a
- **Linhas:** 44
- **SHA1:** c29eb5b3975c71e9927d7658c9c2236127e8b9ec
- **Partes lidas:** 1-44
- **Propósito:** Testa que a exportação real compartilha classes semânticas entre páginas, preserva idioma e semântica de botões, gera HTML válido e mantém a folha residual de uma página capturada.
- **Âncora:** `src/core/export/clean-export.test.ts:30` `test('new project metadata does not make a fresh project nonempty',()=>{`

### `src/core/export/export.test.ts`
- **Lote:** L04a
- **Linhas:** 252
- **SHA1:** 36162b1d2d0dc508d49094316e2dfe302f775118
- **Partes lidas:** 1-252
- **Propósito:** Testes da exportação: nomes BEM, bytes iguais para o mesmo documento, espaço entre vizinhos em linha, modelos de modal e abas, endereços de imagens e ordem da cascata.
- **Âncora:** `src/core/export/export.test.ts:40` `describe('the export (specs export-zip, export-bem-css)', () => {`

### `src/core/export/export.ts`
- **Lote:** L04a
- **Linhas:** 563
- **SHA1:** df9f965433cfc33770b6617306d5df0ccfb2e204
- **Partes lidas:** 1-563
- **Propósito:** Dono da exportação: escreve o HTML de cada página, a folha do site (classes, elementos, mídias em cascata), os scripts, a pré-visualização e o arquivo site.zip.
- **Âncora:** `src/core/export/export.ts:55` `const SITE_ARCHIVE = 'site.zip';`

### `src/core/export/names.test.ts`
- **Lote:** L04a
- **Linhas:** 63
- **SHA1:** 1fe676194670731935258042b73b51ef4a852cef
- **Partes lidas:** 1-63
- **Propósito:** Testa os nomes semânticos por idioma de código, a estabilidade de classes, nomes de lote, idioma de página, tipo de botão e modificadores de variantes.
- **Âncora:** `src/core/export/names.test.ts:4` `test('semantic roles translated to code language, custom names retained', () => {`

### `src/core/export/names.ts`
- **Lote:** L04a
- **Linhas:** 248
- **SHA1:** e87d396a5ebf1a80bb2a8fe6676189a702f455a5
- **Partes lidas:** 1-248
- **Propósito:** Os nomes do export: papel de um elemento no idioma do código, modificador BEM para uma segunda aparição de nome, nomes de lote, idioma da página e tipo do botão.
- **Âncora:** `src/core/export/names.ts:47` `export function semanticName(name: string, tag: string, language: string): string {`

### `src/core/export/paths.ts`
- **Lote:** L04a
- **Linhas:** 15
- **SHA1:** b3a0f9e79d4edd896cabbd544260872b97b4f410
- **Partes lidas:** 1-15
- **Propósito:** A lista única dos caminhos dos arquivos gerados pelo export (folha de estilo e scripts), lida pelo export que os escreve e pela árvore de arquivos que os reserva.
- **Âncora:** `src/core/export/paths.ts:5` `export const STYLESHEET = 'css/styles.css';`

### `src/core/export/preview-script.test.ts`
- **Lote:** L04a
- **Linhas:** 25
- **SHA1:** 06cf5f0694c488f9f75f5d4a4d92eee3f0bad448
- **Partes lidas:** 1-25
- **Propósito:** Testa que a pré-visualização escreve o código de um script como ele é: os padrões `$&`, `$'` e `` $` `` ficam intactos e um `</script` não termina o elemento antes do fim.
- **Âncora:** `src/core/export/preview-script.test.ts:14` `const bytes = btoa(CODE);`

### `src/core/export/roles.json`
- **Lote:** L04a
- **Linhas:** 57
- **SHA1:** 7f5cbb3e3d97224c6e632caa87775c91d571f4b7
- **Partes lidas:** 1-57
- **Propósito:** Vocabulário do export: aliases de papéis por idioma, chaves de layout, propriedades e valores de layout e as regras de modificadores (tag, luz, presença, tamanho, layout, reserva).
- **Âncora:** `src/core/export/roles.json:5` `"text": ["Texto", "Text", "Paragraph", "Parágrafo"],`

### `src/core/export/sheet-headings.ts`
- **Lote:** L04a
- **Linhas:** 17
- **SHA1:** 09cefaf44f0234bdde6eb0f94e5d585fafdf5374
- **Partes lidas:** 1-17
- **Propósito:** Os cabeçalhos `/* Classes */` e `/* Elements */` da folha exportada e o leitor que diz se uma linha está sob o cabeçalho das classes.
- **Âncora:** `src/core/export/sheet-headings.ts:5` `export const CLASSES_HEADING = '/* Classes */';`

### `src/core/export/validity.test.ts`
- **Lote:** L04a
- **Linhas:** 42
- **SHA1:** 951bcd65a8ed6d4313233d700ce2ff0e640cf98c
- **Partes lidas:** 1-42
- **Propósito:** Valida o HTML exportado de cada fixture com html-validate, aceitando erro apenas onde o painel de verificação o reporta no mesmo elemento.
- **Âncora:** `src/core/export/validity.test.ts:19` `describe('the export of every fixture', () => {`

### `src/core/files/assets.ts`
- **Lote:** L02
- **Linhas:** 60
- **SHA1:** 0a4c0129ea0b8508469dc747fa7d91ac78c3e6a6
- **Partes lidas:** 1-60
- **Propósito:** O comando assets.insertImageFile: guarda um arquivo de imagem nos arquivos do projeto e coloca um elemento Image que o usa, ou troca a fonte de uma imagem sob o ponto de soltura.
- **Âncora:** `src/core/files/assets.ts:16` `const IMAGE_TYPE = 'image';`

### `src/core/files/files.test.ts`
- **Lote:** L02
- **Linhas:** 108
- **SHA1:** 2ee01da7e0041854de62a599abba881ff8085028
- **Partes lidas:** 1-108
- **Propósito:** Testes dos comandos de arquivos: exclusão, renomeação e movimentação que levam junto os usuários do caminho, javascriptProblem e os caminhos gerados pelo export.
- **Âncora:** `src/core/files/files.test.ts:9` `describe('files.delete (src/core/files/files.ts)', () => {`

### `src/core/files/files.ts`
- **Lote:** L02
- **Linhas:** 577
- **SHA1:** 870f1c2729505f0201afee046d38d18eba7c125c
- **Partes lidas:** 1-577
- **Propósito:** Dono da árvore de arquivos do projeto: upload, criação, renomeação, movimentação, exclusão e conteúdo dos arquivos, mais os caminhos, o tipo por extensão e o leitor de um arquivo entregue.
- **Âncora:** `src/core/files/files.ts:35` `const FILE_FOLDER = 'files/';`

### `src/core/files/fonts.ts`
- **Lote:** L02
- **Linhas:** 73
- **SHA1:** 035cdc88f6361dfcbca5bb56d51db3de0129f8cb
- **Partes lidas:** 1-73
- **Propósito:** Dono das fontes do projeto: quais arquivos são fontes, a família pela qual cada uma é conhecida e as regras @font-face escritas a partir delas.
- **Âncora:** `src/core/files/fonts.ts:14` `const FONT_TYPES: readonly string[] = ['font/', 'application/font', 'application/vnd.ms-fontobject', 'application/x-font'];`

### `src/core/files/path-rule.ts`
- **Lote:** L02
- **Linhas:** 12
- **SHA1:** 2952ddb9a9effc9551d39044d6c5618d1500fef0
- **Partes lidas:** 1-12
- **Propósito:** A regra única de um caminho do projeto: partes unidas por "/", sem vazios, "." ou "..", sem barra invertida nem caractere de controle.
- **Âncora:** `src/core/files/path-rule.ts:5` `export function projectPathProblem(path: string): string | null {`

### `src/core/files/path-segments.test.ts`
- **Lote:** L02
- **Linhas:** 29
- **SHA1:** e67832032cc0a1860534794cf2ffa85f4f517a04
- **Partes lidas:** 1-29
- **Propósito:** Testes da família FP1: caminhos que subem para fora do projeto são recusados em renomear, criar e na validação de um documento aberto.
- **Âncora:** `src/core/files/path-segments.test.ts:13` `describe('a project path never climbs out of the project (FP1)', () => {`

### `src/core/files/project-paths.test.ts`
- **Lote:** L02
- **Linhas:** 57
- **SHA1:** d1ae3ff6ab95f5dc72b6ad89f879e48f1147e0ae
- **Partes lidas:** 1-57
- **Propósito:** Testes da família AD1: um arquivo com espaço ou acento no nome o mantém ao ser colocado, renomeado, exportado e importado.
- **Âncora:** `src/core/files/project-paths.test.ts:22` `describe('a file of the project keeps its own name on every road (AD1)', () => {`

### `src/core/files/references.ts`
- **Lote:** L02
- **Linhas:** 139
- **SHA1:** 5e8e976a91a7e961defaf84a5c4537fdb83062ed
- **Partes lidas:** 1-139
- **Propósito:** A regra única de todo lugar que escreve um caminho do projeto: atributos de endereço, url() de estilos, scripts ligados e famílias de fonte seguem um caminho movido na mesma transação.
- **Âncora:** `src/core/files/references.ts:13` `export type PathRewrite = (path: string) => string;`

### `src/core/files/size-label.test.ts`
- **Lote:** L02
- **Linhas:** 16
- **SHA1:** f389cda5d49eb91b5a407ee034826dcae73b18bb
- **Partes lidas:** 1-16
- **Propósito:** Testes da família SZ1: o tamanho de um arquivo é a contagem dos bytes do base64 sem o preenchimento.
- **Âncora:** `src/core/files/size-label.test.ts:5` `import { byteCount, sizeLabel } from './files.ts';`

### `src/core/files/srcset.test.ts`
- **Lote:** L02
- **Linhas:** 24
- **SHA1:** 1922015a7aca9dfe2a989830fac9c2f71ac0d114
- **Partes lidas:** 1-24
- **Propósito:** Testes de srcset: a reescrita só toca as URLs mantendo os descritores, e a filtragem mantém a lista quando nada ou tudo ficaria.
- **Âncora:** `src/core/files/srcset.test.ts:2` `import { keptSrcset, rewriteSrcsetUrls } from './srcset.ts';`

### `src/core/files/srcset.ts`
- **Lote:** L02
- **Linhas:** 59
- **SHA1:** 95cd118e6bcbaf1957568e766fa48e22cc5f9fb6
- **Partes lidas:** 1-59
- **Propósito:** A gramática de candidatos de um srcset do HTML: reescreve apenas as URLs, sem quebrar uma URL de dados na vírgula interna, e filtra candidatos mantendo os descritores.
- **Âncora:** `src/core/files/srcset.ts:3` `export function rewriteSrcsetUrls(value: string, rewrite: (url: string) => string): string {`

### `src/core/files/values.ts`
- **Lote:** L02
- **Linhas:** 44
- **SHA1:** 98dba63cffb97b56f1c1d113ebefbc2b84a192b8
- **Partes lidas:** 1-44
- **Propósito:** O escritor único do valor de um atributo: referências a elementos e fontes do projeto viram o caminho relativo no export e a URL de objeto no canvas.
- **Âncora:** `src/core/files/values.ts:22` `export function exportValue(document: DocumentJson, name: string, value: string, from = ''): string | null {`

### `src/core/forms/catalog.ts`
- **Lote:** L03
- **Linhas:** 29
- **SHA1:** 854f6e66bf92fa54fbc99abaf7878743e6495b52
- **Partes lidas:** 1-29
- **Propósito:** O catálogo dos presets de máscara (cpf, cnpj, cep, telefone, rg, pis, título, placa, cartão, validade, cvv, email, url, data, hora, moeda e medida) com exemplo, inputMode, autocomplete e máscara, e o mapa das chaves de mensagem de cada regra de validação.
- **Âncora:** `src/core/forms/catalog.ts:25` `export const validationMessageKeys: Readonly<Record<RuleCode, string>> = {`

### `src/core/forms/config.ts`
- **Lote:** L03
- **Linhas:** 103
- **SHA1:** 3f0649120c25cebdb4cbe5295f87acc0bb8870e7
- **Partes lidas:** 1-103
- **Propósito:** Esquemas zod das configurações de campo e de formulário (máscara, regras, mensagens, destino, endereço sem credenciais), com readFieldConfig, readFormConfig e formAttributeIssue como guardas antes do patch.
- **Âncora:** `src/core/forms/config.ts:78` `export function readFieldConfig(value: unknown): FieldConfig | null {`

### `src/core/forms/engine.test.ts`
- **Lote:** L03
- **Linhas:** 107
- **SHA1:** efc245f24392543a18e7863deea4d6ab4a50f301
- **Partes lidas:** 1-107
- **Propósito:** Testes do motor de formulários: máscaras e validade dos presets, CNPJ alfanumérico, títulos de eleitor, blocos e repetições de máscara, decimais localizados, moedas, datas com autocorreção, regex, bandeiras de cartão e a validação de todas as regras com mensagens localizadas.
- **Âncora:** `src/core/forms/engine.test.ts:6` `describe('forms masks and document validators', () => {`

### `src/core/forms/engine.ts`
- **Lote:** L03
- **Linhas:** 317
- **SHA1:** 482fe6c6e07d40e1e154a878bb912ea7f7f9d528
- **Partes lidas:** 1-317
- **Propósito:** A fábrica autocontida do motor de formulários (createFormsEngine): máscaras de todos os tipos (fixa, dinâmica, numérica, moeda, data, hora, regex, maiúsculas), presets com dígitos verificadores e bandeiras de cartão, e validate com todas as regras, limites de calendário relativos e arquivos.
- **Âncora:** `src/core/forms/engine.ts:4` `export function createFormsEngine(now: () => number) {`

### `src/core/forms/types.ts`
- **Lote:** L03
- **Linhas:** 64
- **SHA1:** c635c3c0f2aac00ceee30a00d0b5e2e5c0908141
- **Partes lidas:** 1-64
- **Propósito:** Os tipos das configurações de formulário: Preset, MaskConfig, RuleCode, ValidationRules, FieldConfig, FormConfig, MaskResult, ValidationContext e Violation.
- **Âncora:** `src/core/forms/types.ts:64` `export interface Violation { readonly code: RuleCode; readonly message: string }`

### `src/core/geometry/align.ts`
- **Lote:** L02
- **Linhas:** 115
- **SHA1:** 62b93696746374b56c5f3e6b6e1dbebf0d99b609
- **Partes lidas:** 1-115
- **Propósito:** Alinhar e distribuir elementos posicionados: position.align e position.distribute movem cada elemento pelas inserções ancoradas, em um passo de undo, com o predicado distributableSelection.
- **Âncora:** `src/core/geometry/align.ts:51` `export const alignCommand = registerHandler('position.align', (context, { edge }) => {`

### `src/core/geometry/anchors.test.ts`
- **Lote:** L02
- **Linhas:** 58
- **SHA1:** 5fde452b963707c1181f4080b85d2fc913f01f26
- **Partes lidas:** 1-58
- **Propósito:** Testes de position.setAnchors em medidas fracionárias: as inserções e tamanhos escritos são px inteiros que nunca deixam a caixa mais estreita que a desenhada (AUD-35).
- **Âncora:** `src/core/geometry/anchors.test.ts:13` `const PARAGRAPH = 'n-intro';`

### `src/core/geometry/anchors.ts`
- **Lote:** L02
- **Linhas:** 160
- **SHA1:** abfff672c36bff886ac6bdc0a53e9c0e879942d7
- **Partes lidas:** 1-160
- **Propósito:** As âncoras de um elemento posicionado: position.setAnchors alterna uma borda ou define as âncoras de um eixo, medindo as distâncias onde o elemento está agora.
- **Âncora:** `src/core/geometry/anchors.ts:58` `const AUTO = 'auto';`

### `src/core/geometry/lines.test.ts`
- **Lote:** L02
- **Linhas:** 67
- **SHA1:** c985f92268c22961704d1702b7748f76d355f3a5
- **Partes lidas:** 1-67
- **Propósito:** Testes das linhas de caixas: linesOf reparte uma grade em linhas e colunas, gapsBetween dá os vãos, sameLine compara e gapBands desenha as faixas de vão.
- **Âncora:** `src/core/geometry/lines.test.ts:6` `const GRID = [at('c1', 0, 0), at('c2', 120, 0), at('c3', 240, 0), at('c4', 0, 60)];`

### `src/core/geometry/lines.ts`
- **Lote:** L02
- **Linhas:** 60
- **SHA1:** e577101864509420b86c5ca3a2efe8f89ede140a
- **Partes lidas:** 1-60
- **Propósito:** As linhas de caixas dispostas (linesOf, lineExtent, sameLine, gapsBetween, gapBands), lidas das medidas das caixas na tela.
- **Âncora:** `src/core/geometry/lines.ts:17` `const OVERLAP = 0.5;`

### `src/core/geometry/position.test.ts`
- **Lote:** L02
- **Linhas:** 21
- **SHA1:** 9fc509a3500be970e868c6f3b16b3ef19334a482
- **Partes lidas:** 1-21
- **Propósito:** Testes de movedInsets: cada eixo move pela borda ancorada, e um elemento ancorado nas duas bordas se move inteiro, mantendo o tamanho.
- **Âncora:** `src/core/geometry/position.test.ts:11` `describe('movedInsets', () => {`

### `src/core/geometry/position.ts`
- **Lote:** L02
- **Linhas:** 121
- **SHA1:** 452d8e8056efdca6668ccabf4ca0bf1aa8c35e41
- **Partes lidas:** 1-121
- **Propósito:** Posicionamento: position.setMode escreve o modo de posição, position.move move os selecionados pelas inserções ancoradas, com o predicado positionedSelection e measuredPlace.
- **Âncora:** `src/core/geometry/position.ts:56` `const POSITIONED = 'positionedSelection';`

### `src/core/geometry/resize.ts`
- **Lote:** L02
- **Linhas:** 143
- **SHA1:** cc6e603dd4486043f4a8eaf64e74f16360f0c585
- **Partes lidas:** 1-143
- **Propósito:** geometry.resize e resizedBox: o comando grava largura, altura, left e top em px inteiros e resizedBox calcula a caixa de um arraste de alça, com proporção, centro e limites.
- **Âncora:** `src/core/geometry/resize.ts:17` `const LENGTH = /^-?\d+px$/;`

### `src/core/geometry/snap.test.ts`
- **Lote:** L02
- **Linhas:** 35
- **SHA1:** 905395fb3aa5ceb97dcad0c310f627bd4234b94e
- **Partes lidas:** 1-35
- **Propósito:** Testes de snapAxis e rulerLines: a linha do degrau mais cedo vence, a mais próxima dentro do degrau, e além da distância nada encaixa.
- **Âncora:** `src/core/geometry/snap.test.ts:9` `describe('snapAxis', () => {`

### `src/core/geometry/snap.ts`
- **Lote:** L02
- **Linhas:** 127
- **SHA1:** e9e298a3a942f54e4400dc4018f5d28d9d505b9d
- **Partes lidas:** 1-127
- **Propósito:** O encaixe: snapAxis escolhe a linha por prioridade de degrau e distância, placesOf lê as bordas de uma caixa, rulerLines dá os traços da régua e equalGap acha espaçamentos iguais.
- **Âncora:** `src/core/geometry/snap.ts:8` `export type SnapAxis = 'x' | 'y';`

### `src/core/history/history.ts`
- **Lote:** L01
- **Linhas:** 83
- **SHA1:** 03e3d7574767cab69283d1d0c01516b069ac2bd2
- **Partes lidas:** 1-83
- **Propósito:** pilhas de desfazer e refazer, coalescência de entradas por chave e janela, e os comandos `history.undo` e `history.redo`.
- **Âncora:** `src/core/history/history.ts:53` `export function undo(state: Restorable): Restorable | null {`

### `src/core/history/invariants.ts`
- **Lote:** L23
- **Linhas:** 59
- **SHA1:** 4001c56ebc88220e6199504472ba1a7cb26dbf54
- **Partes lidas:** 1-59
- **Propósito:** Regras do histórico conferidas a cada publicação da store, só em desenvolvimento e teste (MEC-03): entrada nova ou fundida muda o documento e esvazia o refazer, desfazer e refazer movem a entrada certa, e os patches publicados levam o documento de antes ao de depois.
- **Âncora:** `src/core/history/invariants.ts:13` `import type { DocumentJson } from '../document/model.ts';`

### `src/core/history/transaction.test.ts`
- **Lote:** L01
- **Linhas:** 132
- **SHA1:** fbcf64fec5e2c34e2284a51582d1d59eb9a3b30d
- **Partes lidas:** 1-132
- **Propósito:** testa os patches (RFC 6902) sobre árvores JSON: aplicação, inversos, cópia só do caminho, patch que nada muda, chave `__proto__` e caminho que não serve, mais uma propriedade com fast-check.
- **Âncora:** `src/core/history/transaction.test.ts:39` `it('drops a patch that changes nothing, so it leaves no inverse', () => {`

### `src/core/history/transaction.ts`
- **Lote:** L01
- **Linhas:** 153
- **SHA1:** 92d5a045f8d41aecb80d74fd7c5fc6b6d8b7f990
- **Partes lidas:** 1-153
- **Propósito:** os patches de uma transação, seus inversos e a seleção antes e depois; aplica sem mudar a entrada, copiando só os contêineres do caminho.
- **Âncora:** `src/core/history/transaction.ts:141` `export function applyPatches(document: DocumentJson, patches: readonly Patch[]): Applied {`

### `src/core/import/apply-html-marks.test.ts`
- **Lote:** L04a
- **Linhas:** 25
- **SHA1:** 85a4fa01d02ffb29133d3a276f89ad965917b716
- **Partes lidas:** 1-25
- **Propósito:** Testa que o markup do painel de código substitui o que o elemento guardava: uma marca e um atributo retirados somem e um texto mudado é mantido (AH1).
- **Âncora:** `src/core/import/apply-html-marks.test.ts:16` `describe('the code pane writes what its markup says (AH1)', () => {`

### `src/core/import/apply-html-references.test.ts`
- **Lote:** L04a
- **Linhas:** 87
- **SHA1:** c503ad19f84d0d1deb7ca6599d788a27442d3c12
- **Partes lidas:** 1-87
- **Propósito:** Testa que aplicar markup libera as referências de um filho que o markup deixa de fora, no mesmo passo e com documento válido.
- **Âncora:** `src/core/import/apply-html-references.test.ts:70` `describe('element.applyHtml and the references of what the markup drops', () => {`

### `src/core/import/apply-html.ts`
- **Lote:** L04a
- **Linhas:** 86
- **SHA1:** 6636c24fa2cf02b727d1f043ab04a4cd84f990de
- **Partes lidas:** 1-86
- **Propósito:** Comando `element.applyHtml`: lê o markup do painel de código como nós, reconcilia com o elemento selecionado (mantendo id, nome e estilos) e libera as referências do que saiu.
- **Âncora:** `src/core/import/apply-html.ts:45` `export const applyHtmlCommand = registerHandler('element.applyHtml', (context, { html }) => {`

### `src/core/import/capture-residual.test.ts`
- **Lote:** L04a
- **Linhas:** 154
- **SHA1:** 4a71dc2950e2635e6d0e95db6bbe56f2c588a539
- **Partes lidas:** 1-154
- **Propósito:** Testa que uma página capturada mantém folha, seletores e nós na ordem de origem, e o que o importador mantém do DOM (SVG, listas, escondidos, cascata).
- **Âncora:** `src/core/import/capture-residual.test.ts:42` `describe('the original stylesheet of a captured page', () => {`

### `src/core/import/capture-styles.ts`
- **Lote:** L04a
- **Linhas:** 19
- **SHA1:** df45926aa7a632d7ae059d88aa5e49acc63ff36d
- **Partes lidas:** 1-19
- **Propósito:** Donos do CSS residual de uma página capturada: o caminho da folha, sua leitura como texto e a resolução de endereços de assets relativos.
- **Âncora:** `src/core/import/capture-styles.ts:3` `export function capturedPageStylePath(page: CapturePage): string {`

### `src/core/import/captured-tokens.test.ts`
- **Lote:** L04a
- **Linhas:** 51
- **SHA1:** f75a23ec530bd5c09b9be3a4ed63873888d58606
- **Partes lidas:** 1-51
- **Propósito:** Testa que as variáveis de uma página capturada ficam na folha de origem (condicionais inclusive) sem virar tokens do projeto.
- **Âncora:** `src/core/import/captured-tokens.test.ts:21` `describe('the variables of a captured page', () => {`

### `src/core/import/destinations.ts`
- **Lote:** L04a
- **Linhas:** 96
- **SHA1:** 1e2924a0a3207339b17661898209b23288517c11
- **Partes lidas:** 1-96
- **Propósito:** Compõe as páginas importadas no destino pedido (nova página, dentro de um nó ou substituindo o projeto), isolando colisões de classes, tokens, caminhos e nomes.
- **Âncora:** `src/core/import/destinations.ts:1` `// Compose parsed pages into the requested destination; parsing and style writing remain in import.ts.`

### `src/core/import/folder-import.test.ts`
- **Lote:** L04a
- **Linhas:** 32
- **SHA1:** b068869dda8df8d60b6ec9de8d4e7437278e326c
- **Partes lidas:** 1-32
- **Propósito:** Testa que uma pasta aberta lê as páginas com o importador de HTML, preservando atributos de estilo, blocos, mídias, estados e a cascata (FO1).
- **Âncora:** `src/core/import/folder-import.test.ts:16` `describe('an opened folder reads its pages as the HTML importer does (FO1)', () => {`

### `src/core/import/folder.ts`
- **Lote:** L04a
- **Linhas:** 198
- **SHA1:** d9b8455ca4fc200a21fb64b0ad8810fca149406f
- **Partes lidas:** 1-198
- **Propósito:** Comando `project.openFolder`: lê a pasta escolhida como projeto, nomeia páginas pelos arquivos, move arquivos que colidem com gerados e devolve o relatório.
- **Âncora:** `src/core/import/folder.ts:190` `export const openFolderCommand = registerHandler('project.openFolder', (context, { folder }) => {`

### `src/core/import/hidden-runs.test.ts`
- **Lote:** L04a
- **Linhas:** 21
- **SHA1:** 2846e3e3b618b890a7ed36b689cd920b8ff92906
- **Partes lidas:** 1-21
- **Propósito:** Testa que um pedaço oculto de um texto é descartado na importação, mantendo o resto da linha.
- **Âncora:** `src/core/import/hidden-runs.test.ts:15` `it('drops a hidden piece of a text, and keeps the rest of the line', () => {`

### `src/core/import/html-whitespace.test.ts`
- **Lote:** L04a
- **Linhas:** 21
- **SHA1:** d7a28e6e1e0369d0806cd1e117d695f944a7eb4c
- **Partes lidas:** 1-21
- **Propósito:** Testa que a indentação do código-fonte não vira quebras de linha na importação e que um `<br>` real é mantido.
- **Âncora:** `src/core/import/html-whitespace.test.ts:11` `it('does not turn source indentation into line breaks while keeping a real br', () => {`

### `src/core/import/image-size.test.ts`
- **Lote:** L04a
- **Linhas:** 30
- **SHA1:** 9a9b29945d44d66b24038334ed7d3ce7f726ef97
- **Partes lidas:** 1-30
- **Propósito:** Testa que as dimensões HTML de uma imagem viram dicas de tamanho com proporção intrínseca e que o CSS do site vence a dica de largura.
- **Âncora:** `src/core/import/image-size.test.ts:11` `const file = (name: string, type: string, text: string): PickedFile => ({ name, type, bytes: btoa(text) });`

### `src/core/import/import-classes.test.ts`
- **Lote:** L04a
- **Linhas:** 84
- **SHA1:** a9fa8e634ec4f0f558f078368637c2a97d3cae78
- **Partes lidas:** 1-84
- **Propósito:** Testa que exportar e importar de volta mantém as classes do projeto (B-04), inclusive a classe que um único elemento lista por último, pelo cabeçalho da folha.
- **Âncora:** `src/core/import/import-classes.test.ts:3` `// The code audit's B-04: a page exported and imported back keeps the project's classes.`

### `src/core/import/import-destinations.test.ts`
- **Lote:** L04a
- **Linhas:** 70
- **SHA1:** 3ad69f2ba2b797005c8e482eea40a09e15f5e574
- **Partes lidas:** 1-70
- **Propósito:** Testa os destinos da importação: nova página com nome de arquivo livre, isolamento de colisões de classe e asset, inserção dentro de um nó e remapeamento de âncoras.
- **Âncora:** `src/core/import/import-destinations.test.ts:8` `it('the default import preserves existing pages and chooses a free source filename', () => {`

### `src/core/import/import.ts`
- **Lote:** L04a
- **Linhas:** 1939
- **SHA1:** 7645defd9f15632fdb9521a506b74aaaa782e1d0
- **Partes lidas:** 1-788; 789-1584; 1585-1939
- **Propósito:** Dono de ler HTML: converte arquivos, ZIP ou markup em nós do modelo, mapeia estilos e folhas pelo matcher, compõe o relatório, e define os comandos de importação, o leitor estrito do painel de código e o CSS residual de páginas capturadas.
- **Âncora:** `src/core/import/import.ts:77` `export async function readPickedFiles(files: readonly File[]): Promise<readonly PickedFile[]> {`

### `src/core/import/linked-media.test.ts`
- **Lote:** L04a
- **Linhas:** 23
- **SHA1:** edd171cdeb23c2b29f7d1c414f8c21e6e4e8502b
- **Partes lidas:** 1-23
- **Propósito:** Testa que uma imagem dentro de um link vira Link Block com o filho imagem, na árvore e no HTML exportado.
- **Âncora:** `src/core/import/linked-media.test.ts:13` `it('keeps an image inside a link in the tree and in the exported HTML', () => {`

### `src/core/import/markup.ts`
- **Lote:** L04a
- **Linhas:** 55
- **SHA1:** 0214c83d86e2831f7b06040f25dfc1de1f6ebac7
- **Partes lidas:** 1-55
- **Propósito:** Leitura de markup pelo parser do navegador: árvore de tags, atributos e texto, a cabeça de uma página e a linha de origem de cada peça.
- **Âncora:** `src/core/import/markup.ts:14` `export const parseMarkup = (markup: string): readonly MarkupChild[] => browserPorts().fragment(markup);`

### `src/core/import/roundtrip.test.ts`
- **Lote:** L04a
- **Linhas:** 135
- **SHA1:** 4ac8ee7965174804e302af2831ad896f4a26b0aa
- **Partes lidas:** 1-135
- **Propósito:** Testa a ida e volta exportar→importar→exportar de cada fixture: mesmas páginas, declarações, variáveis e classes, e arquivo canônico byte a byte (AUD-05).
- **Âncora:** `src/core/import/roundtrip.test.ts:71` `describe('export then import back (AUD-05)', () => {`

### `src/core/import/selectors.test.ts`
- **Lote:** L04a
- **Linhas:** 102
- **SHA1:** af535e983a35b8e5b2487850b86e443dd9e038e7
- **Partes lidas:** 1-102
- **Propósito:** Testa a leitura de seletores, a correspondência com os fatos de um elemento e o cálculo de especificidade, com os exemplos das Selectors 4.
- **Âncora:** `src/core/import/selectors.test.ts:13` `describe('readSelector', () => {`

### `src/core/import/selectors.ts`
- **Lote:** L04a
- **Linhas:** 322
- **SHA1:** dc9213e874ede912ba28df1a1f9b375b8a109f46
- **Partes lidas:** 1-322
- **Propósito:** Dono de quais elementos um seletor CSS corresponde e da especificidade de um seletor: lê compostos, combinadores, testes de atributo e pseudoclasses, e conta especificidade para o canvas também.
- **Âncora:** `src/core/import/selectors.ts:109` `export function readSelector(text: string): Selector | null {`

### `src/core/import/stylesheet.test.ts`
- **Lote:** L04a
- **Linhas:** 92
- **SHA1:** 3ef1976dabd298352f6081283ccd97a199234caf
- **Partes lidas:** 1-92
- **Propósito:** Testa a leitura de folhas de estilo e listas de declarações, com linhas, mídias, listas de seletores, `!important` e at-rules não mapeáveis.
- **Âncora:** `src/core/import/stylesheet.test.ts:4` `describe('readStylesheet', () => {`

### `src/core/import/stylesheet.ts`
- **Lote:** L04a
- **Linhas:** 177
- **SHA1:** 0247117e133f585f7633bf02c0834a1fabe43748
- **Partes lidas:** 1-177
- **Propósito:** Dono de ler uma folha de estilo como regras: sem comentários, com seletores, declarações com linha e `!important`, mídias aninhadas e at-rules que o chamador reporta.
- **Âncora:** `src/core/import/stylesheet.ts:118` `export function readStylesheet(source: string): CssSheet {`

### `src/core/import/svg-size.test.ts`
- **Lote:** L04a
- **Linhas:** 66
- **SHA1:** f691aa5aeef18e7058d8b3029b764b256c138581
- **Partes lidas:** 1-66
- **Propósito:** Testa que um `<svg>` importado mantém tamanho e coordenadas de desenho: atributos viram dicas, o CSS vence e um viewBox próprio vive num svg interno (AUD-15).
- **Âncora:** `src/core/import/svg-size.test.ts:33` `describe('an imported svg', () => {`

### `src/core/incidents.test.ts`
- **Lote:** L01
- **Linhas:** 32
- **SHA1:** 957457fb63cb86b04f29229a2cea4b4afd3e3fc4
- **Partes lidas:** 1-32
- **Propósito:** testa o feed de incidentes: registra o que lhe dizem, avisa os ouvintes, guarda os cinquenta mais novos e limpa.
- **Âncora:** `src/core/incidents.test.ts:24` `it('keeps the newest fifty, and clears', () => {`

### `src/core/incidents.ts`
- **Lote:** L01
- **Linhas:** 66
- **SHA1:** 60db1bb2980878b8f7e8eabe0f1a04890069b212
- **Partes lidas:** 1-66
- **Propósito:** feed de incidentes do processo (violação de invariante, mudança vazia, erro da página), anel limitado aos cinquenta mais novos, com ouvintes.
- **Âncora:** `src/core/incidents.ts:34` `export function reportInvariantBreach(source: string, problems: readonly Invalid[]): void {`

### `src/core/motion/behaviour-axis.test.ts`
- **Lote:** L04b
- **Linhas:** 13
- **SHA1:** 39adf48ce991f26033efba0977a9dd6f25e82f90
- **Partes lidas:** 1-13
- **Propósito:** Teste BA1: comportamento sem eixo usa o eixo do próprio tipo (parallax em y, marquee em x).
- **Âncora:** `src/core/motion/behaviour-axis.test.ts:5` `import { behaviourAxis } from './commands.ts';`

### `src/core/motion/catalog.test.ts`
- **Lote:** L04b
- **Linhas:** 82
- **SHA1:** c214751e06868099536df005f716a281d31ab1d1
- **Partes lidas:** 1-82
- **Propósito:** Testes do catálogo de movimento: os nomes conferem com os do manifesto, os padrões são válidos, onde cada gatilho se aplica e os alvos.
- **Âncora:** `src/core/motion/catalog.test.ts:16` `describe('the motion catalogue and the manifest name the same things', () => {`

### `src/core/motion/catalog.ts`
- **Lote:** L04b
- **Linhas:** 254
- **SHA1:** 3624ce3a1d7d6b83d333fcba55fdb41963c17a6c
- **Partes lidas:** 1-254
- **Propósito:** O catálogo do movimento: cada gatilho com seus parâmetros e onde se aplica, os tipos de ação com seus padrões e os tipos de alvo.
- **Âncora:** `src/core/motion/catalog.ts:39` `export const TRIGGERS = {`

### `src/core/motion/commands.test.ts`
- **Lote:** L04b
- **Linhas:** 321
- **SHA1:** dc5244f74b6fd0518fd2dd5bfc16bdcf7364d34e
- **Partes lidas:** 1-321
- **Propósito:** Testes dos comandos de movimento: interações, linhas de tempo, ações, quadros-chave, marcadores e comportamentos.
- **Âncora:** `src/core/motion/commands.test.ts:312` `describe('what a field hands', () => {`

### `src/core/motion/commands.ts`
- **Lote:** L04b
- **Linhas:** 804
- **SHA1:** 5b7cb09a7c241e2d6966a5a94b5081f9fa778b0f
- **Partes lidas:** 1-702; 703-804
- **Propósito:** Os comandos de movimento: interações de um elemento, linhas de tempo, ações, quadros-chave, marcadores e comportamentos.
- **Âncora:** `src/core/motion/commands.ts:65` `export function readTime(value: unknown): number | null {`

### `src/core/motion/document.test.ts`
- **Lote:** L04b
- **Linhas:** 147
- **SHA1:** 4ffe294a9669ed434276276b31670d83d7cfa2bd
- **Partes lidas:** 1-147
- **Propósito:** Testes dos dados de movimento de um documento e dos dados entregues ao script da página.
- **Âncora:** `src/core/motion/document.test.ts:42` `describe('the motion data of a document', () => {`

### `src/core/motion/document.ts`
- **Lote:** L04b
- **Linhas:** 238
- **SHA1:** 065b207b0c92b30426233c3fd340b5bbbbf7e881
- **Partes lidas:** 1-238
- **Propósito:** Os dados de movimento de um documento inteiro: linhas de tempo, referências entre eles, problemas para o validador e substitutos de cenário.
- **Âncora:** `src/core/motion/document.ts:42` `export function uniqueTimelineName(document: DocumentJson, wanted: string): string {`

### `src/core/motion/easing.test.ts`
- **Lote:** L04b
- **Linhas:** 64
- **SHA1:** 3f1dcd39dc18bc5e5cf043dd97fe6ef59f783853
- **Partes lidas:** 1-64
- **Propósito:** Testes do leitor de aceleração: análise, recusas, amostragem da curva e a mola escrita como linear().
- **Âncora:** `src/core/motion/easing.test.ts:11` `describe('the one reader of an easing', () => {`

### `src/core/motion/easing.ts`
- **Lote:** L04b
- **Linhas:** 234
- **SHA1:** f0ce92fce1fc851d92e089c41e412e2735a87ac8
- **Partes lidas:** 1-234
- **Propósito:** O leitor único do texto de uma aceleração (palavras-chave, cubic-bezier, steps, linear e spring), numa fábrica autocontida embutida também no runtime.
- **Âncora:** `src/core/motion/easing.ts:31` `export function createEasing(): EasingKit {`

### `src/core/motion/export.ts`
- **Lote:** L04b
- **Linhas:** 150
- **SHA1:** 56260c9ade0fc6bb405ead3295234da46fe06fd3
- **Partes lidas:** 1-150
- **Propósito:** O que o script de movimento da página recebe: vínculos, linhas de tempo necessárias, comportamentos e o texto JSON para um elemento script.
- **Âncora:** `src/core/motion/export.ts:106` `export function motionConfig(document: DocumentJson, inputs: ConfigInputs): RuntimeConfig | null {`

### `src/core/motion/model.ts`
- **Lote:** L04b
- **Linhas:** 207
- **SHA1:** 3501829f00453787a95cb1223cfe6fa24087a589
- **Partes lidas:** 1-207
- **Propósito:** O modelo do movimento: alvos, trilhas e quadros-chave, efeitos, linha de tempo, gatilhos, interações e comportamentos.
- **Âncora:** `src/core/motion/model.ts:162` `export type Control = 'play' | 'restart' | 'reverse' | 'toggle' | 'pause' | 'stop' | 'scrub';`

### `src/core/motion/read.test.ts`
- **Lote:** L04b
- **Linhas:** 106
- **SHA1:** d06e1dc9da512fcfb4fdcad1c8f5832834633a35
- **Partes lidas:** 1-106
- **Propósito:** Testes dos leitores estritos de linha de tempo, interação e comportamento.
- **Âncora:** `src/core/motion/read.test.ts:8` `describe('a timeline read strictly', () => {`

### `src/core/motion/read.ts`
- **Lote:** L04b
- **Linhas:** 486
- **SHA1:** 089a2d830f4e3e7e9166b2b7d0deef6d090d5e09
- **Partes lidas:** 1-486
- **Propósito:** A fronteira de confiança do modelo de movimento: leitura estrita, campo a campo, de cada linha de tempo, interação e comportamento.
- **Âncora:** `src/core/motion/read.ts:391` `export function readTimeline(value: unknown): Read<MotionTimeline> {`

### `src/core/motion/record.ts`
- **Lote:** L04b
- **Linhas:** 85
- **SHA1:** b4d4085b8d52e67630ac1f3199b2335de4689f6b
- **Partes lidas:** 1-85
- **Propósito:** Modo de gravação: uma escrita de estilo do elemento selecionado vira quadro-chave no cursor da linha de tempo aberta.
- **Âncora:** `src/core/motion/record.ts:27` `export interface MotionEditorContext {`

### `src/core/motion/timeline.test.ts`
- **Lote:** L04b
- **Linhas:** 150
- **SHA1:** f89bc8bba5c5ed64f60e2d4d82e58702aaa6db83
- **Partes lidas:** 1-150
- **Propósito:** Testes das edições de uma linha de tempo: posicionamento, barras, quadros-chave e marcadores.
- **Âncora:** `src/core/motion/timeline.test.ts:39` `describe('sequence and parallel', () => {`

### `src/core/motion/timeline.ts`
- **Lote:** L04b
- **Linhas:** 288
- **SHA1:** 809b95d08f475375078416f7b9079569b889b5fe
- **Partes lidas:** 1-288
- **Propósito:** Funções puras que editam uma linha de tempo: posicionamento, movimento e redimensionamento de barras, quadros-chave e marcadores.
- **Âncora:** `src/core/motion/timeline.ts:20` `export function timelineDuration(timeline: MotionTimeline): number {`

### `src/core/motion/view.test.ts`
- **Lote:** L04b
- **Linhas:** 76
- **SHA1:** 59d83283797001a721454615518f48373fdf7d33
- **Partes lidas:** 1-76
- **Propósito:** Testes da geometria do painel da linha de tempo: eixo em segundos, zoom, réguas, encaixes e trilhas.
- **Âncora:** `src/core/motion/view.test.ts:17` `describe('the seconds axis', () => {`

### `src/core/motion/view.ts`
- **Lote:** L04b
- **Linhas:** 152
- **SHA1:** a450d16d01e9b53b4a07a19997114ec3b8e4fc8d
- **Partes lidas:** 1-152
- **Propósito:** A geometria do painel da Linha de Tempo: eixo de segundos com zoom, marcas da régua, leitura do cursor, trilhas por alvo e por propriedade e encaixe.
- **Âncora:** `src/core/motion/view.ts:25` `export function zoomAt(view: TimelineView, factor: number, anchorX: number, limits: ZoomLimits): TimelineView {`

### `src/core/motion/words.ts`
- **Lote:** L04b
- **Linhas:** 14
- **SHA1:** 880e66f442eb0d93b6aaa2dc209319c29d4c8243
- **Partes lidas:** 1-14
- **Propósito:** Palavras do movimento que nomeiam propriedades do manifesto, lidas de um objeto para a regra de lint não recusar esses literais.
- **Âncora:** `src/core/motion/words.ts:6` `const [direction, display, scale, visibility, top, bottom, opacity] = Object.keys(WORDS);`

### `src/core/nodes/flags.test.ts`
- **Lote:** L02
- **Linhas:** 271
- **SHA1:** e9cb50432e02ef1b0d3fa7eb1c3b0691244921aa
- **Partes lidas:** 1-271
- **Propósito:** Testes de element.toggleHidden, element.toggleLock (com a trava recusando cada comando construído, LK1) e element.setLayerColor (LC1).
- **Âncora:** `src/core/nodes/flags.test.ts:23` `import { firstLockRefusal, lockOver, lockRefusal, setLayerColorCommand, toggleHiddenCommand, toggleLockCommand } from './flags.ts';`

### `src/core/nodes/flags.ts`
- **Lote:** L02
- **Linhas:** 177
- **SHA1:** abb8c84d89f12ae49c5c9598c479a9055de941be
- **Partes lidas:** 1-177
- **Propósito:** Sinalizadores de nó: element.toggleHidden, element.toggleLock, as respostas de trava (lockOver, lockRefusal, firstLockRefusal, editableSelection) e element.setLayerColor.
- **Âncora:** `src/core/nodes/flags.ts:29` `export type LockedKey = 'status.locked.delete' | 'status.locked.edit' | 'status.locked.editText' | 'status.locked.insert' | 'status.locked.move' | 'status.locked.rename';`

### `src/core/nodes/lock-writes.test.ts`
- **Lote:** L02
- **Linhas:** 56
- **SHA1:** a3fad0577193538f9e2afbe0d12ec5b21171b54c
- **Partes lidas:** 1-56
- **Propósito:** Testes da família LK1: nenhum comando muda um elemento travado ou um dentro de um, qualquer que seja o nó que a porta nomeia.
- **Âncora:** `src/core/nodes/lock-writes.test.ts:20` `describe('a locked element keeps what it holds, whatever door names it (LK1)', () => {`

### `src/core/nodes/names.test.ts`
- **Lote:** L02
- **Linhas:** 86
- **SHA1:** e49cd3e29a2588389291659202a5506315b68962
- **Partes lidas:** 1-86
- **Propósito:** Testes de element.rename: o nome novo em um patch, o inverso devolve o antigo, e um elemento travado ou dentro de um recusa.
- **Âncora:** `src/core/nodes/names.test.ts:44` `describe('element.rename (src/core/nodes/names.ts)', () => {`

### `src/core/nodes/names.ts`
- **Lote:** L02
- **Linhas:** 29
- **SHA1:** 251cc859fdbfd47548a37435c80f8197d918217e
- **Partes lidas:** 1-29
- **Propósito:** element.rename: escreve o nome de um nó sem os espaços em volta, com nome vazio ou igual sem gravar nada, recusando a raiz e a trava.
- **Âncora:** `src/core/nodes/names.ts:14` `export const renameCommand = registerHandler('element.rename', ({ state }, { target, name }) => {`

### `src/core/nodes/rename-many.ts`
- **Lote:** L02
- **Linhas:** 20
- **SHA1:** 42ae1df074064295c6175f1c030e129b1a40bc79
- **Partes lidas:** 1-20
- **Propósito:** element.renameMany: renomeia os elementos selecionados por um padrão com {name} e {n}, passando pelo renomeador único, em um passo de undo.
- **Âncora:** `src/core/nodes/rename-many.ts:10` `export const renameManyCommand = registerHandler('element.renameMany', (context, { pattern, start }) => {`

### `src/core/page/grid-settings.ts`
- **Lote:** L02
- **Linhas:** 28
- **SHA1:** 1ec1864bf17edac7af2730c9d2a1fe2216d7bd2b
- **Partes lidas:** 1-28
- **Propósito:** As configurações de cada grade de layout, com rótulo, padrão e faixa vindos de interactions.json, e os leitores settingsOf e settingOf.
- **Âncora:** `src/core/page/grid-settings.ts:27` `export const settingsOf = (grid: string): readonly (readonly [string, GridSetting])[] => (grid in GRID_SETTINGS ? Object.entries(GRID_SETTINGS[grid as GridName]) : []);`

### `src/core/page/grid.ts`
- **Lote:** L02
- **Linhas:** 136
- **SHA1:** f18f6d709b958dd5df0abcdae73ea0956cb88f1c
- **Partes lidas:** 1-136
- **Propósito:** As grades de layout da página: alternadores de colunas, linhas, pontos e linhas de dobra, as configurações por breakpoint (grid.setSettings) e as faixas de colunas e linhas calculadas.
- **Âncora:** `src/core/page/grid.ts:15` `export type Grid = 'gridColumns' | 'gridRows' | 'gridDots' | 'foldLines';`

### `src/core/page/guides.ts`
- **Lote:** L02
- **Linhas:** 94
- **SHA1:** f2ea1219d3ea3ac06a64ccef963a410374d842b9
- **Partes lidas:** 1-94
- **Propósito:** Guias manuais da página: criar, mover, excluir e travar guias, guardadas na raiz da página que o editor mostra (openedPage).
- **Âncora:** `src/core/page/guides.ts:19` `export const guidesOf = (document: DocumentJson, page: number): readonly Guide[] => document.pages[page]?.tree.guides ?? NONE;`

### `src/core/page/open-page.test.ts`
- **Lote:** L02
- **Linhas:** 42
- **SHA1:** af4e441a1e7969c21e2263651d407516f07979c7
- **Partes lidas:** 1-42
- **Propósito:** Testes da família PG2: guias, configurações de grade e o arquivo do painel de código pertencem à página aberta, não à primeira do projeto.
- **Âncora:** `src/core/page/open-page.test.ts:22` `describe("a page's own things are the open page's (PG2)", () => {`

### `src/core/page/settings.test.ts`
- **Lote:** L02
- **Linhas:** 97
- **SHA1:** 919f294e1531d2f9b7cf58c1b2a77abeea556a1b
- **Partes lidas:** 1-97
- **Propósito:** Testes de isPageSetting e page.setSetting: gravar, substituir, remover e recusar valores (idioma, direção, endereços) com as palavras próprias de cada regra.
- **Âncora:** `src/core/page/settings.test.ts:41` `describe('the settings of the page', () => {`

### `src/core/page/settings.ts`
- **Lote:** L02
- **Linhas:** 99
- **SHA1:** 069059fb74114eca71b1ff96063c7432e56aac8e
- **Partes lidas:** 1-99
- **Propósito:** As configurações da página (page.setSetting e isPageSetting): título, idioma, direção, ligações e endereços, guardados nos atributos da raiz da página aberta.
- **Âncora:** `src/core/page/settings.ts:32` `const LANGUAGE = 'lang';`

### `src/core/ports/browser.ts`
- **Lote:** L01
- **Linhas:** 31
- **SHA1:** 61e6b0732fadb372439c43f77c8a3f0aac1b2419
- **Partes lidas:** 1-31
- **Propósito:** porta do navegador que o núcleo pede por injeção: leitura de um fragmento e de uma página HTML, do head dela, de uma captura de DOM e do tamanho intrínseco de uma imagem.
- **Âncora:** `src/core/ports/browser.ts:24` `export function installBrowserPorts(ports: BrowserPorts): void {`

### `src/core/ports/clipboard.ts`
- **Lote:** L01
- **Linhas:** 21
- **SHA1:** bd4acf79d54f90dc252a7fa56fe3aef1ddecfb13
- **Partes lidas:** 1-21
- **Propósito:** porta da área de transferência: o que um comando manda escrever (texto, HTML e CSS) e quem escreve.
- **Âncora:** `src/core/ports/clipboard.ts:6` `export interface ClipboardWrite {`

### `src/core/ports/clock.ts`
- **Lote:** L01
- **Linhas:** 26
- **SHA1:** 822158af5d3b2e3b22a82b81748ccb3387cf744c
- **Partes lidas:** 1-26
- **Propósito:** o único leitor do tempo: a porta `Clock`, o relógio do sistema e um relógio manual para testes.
- **Âncora:** `src/core/ports/clock.ts:9` `export const systemClock: Clock = {`

### `src/core/ports/css.ts`
- **Lote:** L01
- **Linhas:** 15
- **SHA1:** ae678e1d0c354a2355133a8650d613d43f27ab95
- **Partes lidas:** 1-15
- **Propósito:** porta de suporte a CSS: se o navegador aceita um valor para uma propriedade, e o padrão que aceita tudo.
- **Âncora:** `src/core/ports/css.ts:13` `export const anyCss: CssSupport = {`

### `src/core/ports/download.ts`
- **Lote:** L01
- **Linhas:** 15
- **SHA1:** da6dc5b3bdecbaf359247beb7e25f0cc69056f3b
- **Partes lidas:** 1-15
- **Propósito:** porta de download: o arquivo que um comando entrega à pessoa e quem o entrega.
- **Âncora:** `src/core/ports/download.ts:6` `export interface DownloadFile {`

### `src/core/ports/ids.ts`
- **Lote:** L01
- **Linhas:** 23
- **SHA1:** 0041c10f5e828f47f14b27355a07d95a5bcc4cbb
- **Partes lidas:** 1-23
- **Propósito:** a única fonte de ids: a porta `IdGenerator`, o gerador aleatório do navegador, o nonce de credencial e o gerador sequencial dos testes.
- **Âncora:** `src/core/ports/ids.ts:8` `export const randomIds: IdGenerator = {`

### `src/core/ports/layout.ts`
- **Lote:** L01
- **Linhas:** 61
- **SHA1:** cf7b8c3667f83a9468bb0645262c40344dec0b79
- **Partes lidas:** 1-61
- **Propósito:** porta de layout: onde o canvas desenha cada nó (caixa, caixa de preenchimento, lugar, fonte em px e valor computado), o layout que nada desenha e o de caixas fixas dos testes.
- **Âncora:** `src/core/ports/layout.ts:38` `export const noLayout: Layout = {`

### `src/core/ports/site-scripts.ts`
- **Lote:** L01
- **Linhas:** 10
- **SHA1:** 64a3ed20d73720bee87c787c739ef754acb9c775
- **Partes lidas:** 1-10
- **Propósito:** os scripts que o site exportado leva: os formulários, o script de movimento e o reprodutor Lottie.
- **Âncora:** `src/core/ports/site-scripts.ts:4` `export interface SiteScripts {`

### `src/core/project/archive.test.ts`
- **Lote:** L02
- **Linhas:** 42
- **SHA1:** 02796b41ea1908a49ffc927aab02c6b63fef34f3
- **Partes lidas:** 1-42
- **Propósito:** Testes de File › Open: um documento válido carrega com seleção e histórico vazios, e um arquivo não-JSON, de versão nova ou que o modelo recusa é rejeitado mantendo o documento.
- **Âncora:** `src/core/project/archive.test.ts:14` `describe('File › Open (src/core/project/archive.ts)', () => {`

### `src/core/project/archive.ts`
- **Lote:** L02
- **Linhas:** 77
- **SHA1:** 2ea7c89ac45fbeffe1a0af191d4d9e4a442a55c0
- **Partes lidas:** 1-77
- **Propósito:** O arquivo de projeto: readProject lê e valida um documento, saveProject escreve project.zip com project.json e openProject lê o arquivo escolhido.
- **Âncora:** `src/core/project/archive.ts:37` `const PROJECT_ARCHIVE = 'project.zip';`

### `src/core/project/copy-page.test.ts`
- **Lote:** L02
- **Linhas:** 20
- **SHA1:** 7382eaae7b096d534d5f5d15930cba35dd6c1298
- **Partes lidas:** 1-20
- **Propósito:** Testes da família CP1: uma página capturada duplicada mantém as capturas e a folha de estilo residual própria.
- **Âncora:** `src/core/project/copy-page.test.ts:7` `describe('a copy keeps what it copies (CP1)', () => {`

### `src/core/project/language.ts`
- **Lote:** L02
- **Linhas:** 29
- **SHA1:** 1fe6d2f4443059db64c191b1f5dc9b40da4c1f76
- **Partes lidas:** 1-29
- **Propósito:** Os idiomas do projeto: project.setLanguage define o idioma das páginas e project.setCodeLanguage o idioma do código exportado, ambos com a etiqueta validada antes.
- **Âncora:** `src/core/project/language.ts:11` `const DEFAULT_CODE_LANGUAGE = 'en';`

### `src/core/project/pages.test.ts`
- **Lote:** L02
- **Linhas:** 51
- **SHA1:** 563f9ddc34f28c83039500732f1bdc97c0a44174
- **Partes lidas:** 1-51
- **Propósito:** Testes de pages.duplicate: refresca ids HTML e referências na cópia e põe cada cópia depois das cópias feitas antes (AUD-27).
- **Âncora:** `src/core/project/pages.test.ts:19` `describe('pages.duplicate', () => {`

### `src/core/project/pages.ts`
- **Lote:** L02
- **Linhas:** 240
- **SHA1:** 3803fc9dd9785e61c8297d0123e687f0df9e1a1e
- **Partes lidas:** 1-240
- **Propósito:** As páginas do projeto: pages.add, pages.rename, pages.duplicate, pages.delete e pages.switch, mais copyPage e a página aberta (openedPage e pageShown).
- **Âncora:** `src/core/project/pages.ts:38` `const HOME = 'index.html';`

### `src/core/project/project.ts`
- **Lote:** L02
- **Linhas:** 14
- **SHA1:** 40e339dd2452b3b4b3b51eb0c01f7e123627f34d
- **Partes lidas:** 1-14
- **Propósito:** project.newBlankPage: substitui o projeto pelo projeto vazio, de uma página, perguntando primeiro sobre um projeto que tem trabalho.
- **Âncora:** `src/core/project/project.ts:8` `export const newBlankPage = registerHandler('project.newBlankPage', ({ state, ids, rules, words, confirmed, language }) => {`

### `src/core/project/recovery.ts`
- **Lote:** L02
- **Linhas:** 14
- **SHA1:** cd295bb9a6e6aea05e3c5b3ee18fb8d928f0d8ea
- **Partes lidas:** 1-14
- **Propósito:** project.restoreVersion: restaura exatamente o documento da versão que o diálogo nomeia, lido pelo leitor de projeto que toda abertura usa.
- **Âncora:** `src/core/project/recovery.ts:8` `export const restoreVersion = registerHandler('project.restoreVersion', ({ rules, version }, args) => {`

### `src/core/project/tab-guard.ts`
- **Lote:** L02
- **Linhas:** 6
- **SHA1:** 260dedd3b77d53d02156b03d76c72c0775f45491
- **Partes lidas:** 1-6
- **Propósito:** project.takeOverEditing: numa aba somente leitura, assume a trava de edição do projeto (outcome editing) sem mudar o documento.
- **Âncora:** `src/core/project/tab-guard.ts:6` `export const takeOverEditing = registerHandler('project.takeOverEditing', () => ({ kind: 'change' as const, editing: 'take-over' as const }));`

### `src/core/project/zip.test.ts`
- **Lote:** L02
- **Linhas:** 136
- **SHA1:** 728a4b37ca3f8a5b8233df66375c9603a7d9ddbe
- **Partes lidas:** 1-136
- **Propósito:** Testes do leitor de arquivos: limites declarados antes de desempacotar, inflar que para ao passar o tamanho declarado, caminhos inseguros e motivos lidos de volta.
- **Âncora:** `src/core/project/zip.test.ts:63` `describe('reading an archive', () => {`

### `src/core/project/zip.ts`
- **Lote:** L02
- **Linhas:** 265
- **SHA1:** e67349e5e04cf11499699a15f26ecee2464ebe21
- **Partes lidas:** 1-265
- **Propósito:** O escritor e o leitor únicos de arquivos ZIP: zip, isZip, unzip com limites contra bombas de descompressão, ArchiveError e archiveReason.
- **Âncora:** `src/core/project/zip.ts:24` `export function crc32(bytes: Uint8Array): number {`

### `src/core/render/base.ts`
- **Lote:** L04a
- **Linhas:** 63
- **SHA1:** 7e33dea19808eb47f1a8176277fd09c754b9e234
- **Partes lidas:** 1-63
- **Propósito:** O estilo base do projeto (títulos, box-sizing, controles), escrito no canvas e no cabeçalho de toda folha exportada, e a variante com escopo para páginas capturadas.
- **Âncora:** `src/core/render/base.ts:17` `export function baseCss(): string {`

### `src/core/render/captured.test.ts`
- **Lote:** L04a
- **Linhas:** 237
- **SHA1:** d90b95108288ceb23fb97c47244c3c45a51628cd
- **Partes lidas:** 1-237
- **Propósito:** Testa a escrita HTML de uma árvore capturada: volta igual pelo parser, cabeça válida, shadow root declarativo, estado de campos, script de larguras e declaração UTF-8.
- **Âncora:** `src/core/render/captured.test.ts:36` `describe('a captured page written as HTML', () => {`

### `src/core/render/captured.ts`
- **Lote:** L04a
- **Linhas:** 467
- **SHA1:** 3fc42aebddafd22ff49a7355ab2b968781aae51e
- **Partes lidas:** 1-467
- **Propósito:** Escreve uma página capturada em HTML (shadow root declarativo, estado como atributos, UTF-8), projeta a árvore na largura mais próxima, gera o script de larguras e formata HTML e CSS.
- **Âncora:** `src/core/render/captured.ts:174` `export function capturedHtml(root: CapturedElement, options: WriteOptions = {}): string {`

### `src/core/render/clean.test.ts`
- **Lote:** L04a
- **Linhas:** 130
- **SHA1:** 591f32fbda8cc0dd4aee737c94fcac28bbba1705
- **Partes lidas:** 1-130
- **Propósito:** Testa a compactação de declarações em shorthands, a fusão de regras exclusivas de corpos iguais e a ordem de cascata das folhas geradas (AUD-02).
- **Âncora:** `src/core/render/clean.test.ts:8` `test('existing box codec composes four padding sides and preserves isolated overrides', () => {`

### `src/core/render/clean.ts`
- **Lote:** L04a
- **Linhas:** 239
- **SHA1:** d261ec8c3427dcdab527c5dadf744cd97c421a22
- **Partes lidas:** 1-239
- **Propósito:** Compactação segura de declarações em shorthands (com resets e conflitos) e fusão de regras geradas de corpos iguais, com a ordem de cascata: bases antes dos blocos de breakpoint.
- **Âncora:** `src/core/render/clean.ts:41` `export function compactDeclarations(lines: readonly string[], composites: readonly Composite[]): string[] {`

### `src/core/render/font-parts.json`
- **Lote:** L04a
- **Linhas:** 1
- **SHA1:** e2d986613f96ee2b36b9b92c11658cd7f2a6c62f
- **Partes lidas:** 1-1
- **Propósito:** Declaração do composto da shorthand `font`: seu nome e as sete longhands que a compõem.
- **Âncora:** `src/core/render/font-parts.json:1` `"shorthand":"font"`

### `src/core/render/output.ts`
- **Lote:** L04a
- **Linhas:** 229
- **SHA1:** 542bbdf95ed3f9c51fe3668baa827f5e566a2893
- **Partes lidas:** 1-229
- **Propósito:** Dono do que a página escreve, no canvas e no export: o modelo de saída do manifesto, o CSS de um nó e de suas classes, endereços em `url()` e os atributos HTML de um elemento.
- **Âncora:** `src/core/render/output.ts:104` `export function mediaQuery(breakpoint: { readonly width: number }): string {`

### `src/core/render/reset-rules.json`
- **Lote:** L04a
- **Linhas:** 1
- **SHA1:** fe70cab324725e0c03ba770b2e0a1ffc90701356
- **Partes lidas:** 1-1
- **Propósito:** As propriedades que as shorthands `border` e `font` repõem, com o valor de reset de cada uma, usadas pela compactação de declarações.
- **Âncora:** `src/core/render/reset-rules.json:1` `"font-kerning":"auto"`

### `src/core/selection/selection.ts`
- **Lote:** L02
- **Linhas:** 240
- **SHA1:** 305d165fe49525ac94ab7af95c66988187f9dd7e
- **Partes lidas:** 1-240
- **Propósito:** A seleção: selecionar, limpar, selecionar todos no contêiner, marquee, faixa, adicionar, alternar e a caminhada pela árvore com as setas.
- **Âncora:** `src/core/selection/selection.ts:12` `export const hasSelection = registerPredicate('hasSelection', (state) => state.selection.length > 0);`

### `src/core/store/args.ts`
- **Lote:** L01
- **Linhas:** 108
- **SHA1:** c5e7ff3d72ac2445a48603e0764573798d5a6cc7
- **Partes lidas:** 1-108
- **Propósito:** o único leitor dos tipos de argumento declarados no manifesto, para a store recusar antes do predicado e do tratador um argumento impossível ou um nome que o documento não tem.
- **Âncora:** `src/core/store/args.ts:76` `export function argumentRefusal(id: CommandId, command: Pick<Command, 'args' | 'labelKey' | 'nameKey'>, args: unknown, document: DocumentJson, rules: ModelRules): Message | null {`

### `src/core/store/command-group.test.ts`
- **Lote:** L01
- **Linhas:** 158
- **SHA1:** 76631f203578977f8ba601b5c0e21aaf20ec6676
- **Partes lidas:** 1-158
- **Propósito:** testa o grupo de comandos da store: uma transação por grupo, cancelamento que restaura, locação exclusiva contra despachos externos, falha que desfaz tudo e a sessão do assistente.
- **Âncora:** `src/core/store/command-group.test.ts:44` `test('actual attribute and rename commands form one entry and undo/redo restore both',()=>{`

### `src/core/store/references.ts`
- **Lote:** L01
- **Linhas:** 28
- **SHA1:** 62f08af1e162cb26b11c264dd307dbe25b8869e5
- **Partes lidas:** 1-28
- **Propósito:** o que o argumento de um comando nomeia (a sua `refers` do manifesto) e como cada espécie é encontrada, com registro por módulo dono.
- **Âncora:** `src/core/store/references.ts:16` `export function registerReferenceKind(kind: ReferenceKind, finds: Finder): void {`

### `src/core/store/store-refusal.test.ts`
- **Lote:** L01
- **Linhas:** 26
- **SHA1:** 785d0ffbd866d7c1bf6ff871912ff83185413250
- **Partes lidas:** 1-26
- **Propósito:** prova que uma recusa dita ao lado de um campo vive até o próximo comando rodar, e o desfazer a remove.
- **Âncora:** `src/core/store/store-refusal.test.ts:20` `expect(store.dispatch('style.set', { property: 'width', value: '120px' }).status).toBe('done');`

### `src/core/store/store.test.ts`
- **Lote:** L01
- **Linhas:** 771
- **SHA1:** 721fc09affddbb57d0b91a5bb766fefed80565cc
- **Partes lidas:** 1-771
- **Propósito:** a bateria da store: sequências, gestos, coalescência, histórico, refusos, validação no commit, incidentes, assinaturas e uma propriedade com fast-check sobre sequências de comandos, desfazer e refazer.
- **Âncora:** `src/core/store/store.test.ts:255` `it('records a transaction with its patches, inverses and the selection before and after', () => {`

### `src/core/store/store.ts`
- **Lote:** L01
- **Linhas:** 763
- **SHA1:** 6c197416501c7b63815cdb5d4032f7af6e2a6df1
- **Partes lidas:** 1-763
- **Propósito:** a store única: estado só muda por `dispatch`, com `EditContext` opcional, predicado de disponibilidade, tratador, transação, validação e histórico; gestos, sequências e grupos de comando.
- **Âncora:** `src/core/store/store.ts:122` `dispatch<Id extends CommandId>(id: Id, args: CommandArgs[Id], context?: EditContext): DispatchResult;`

### `src/core/structure/duplicate.test.ts`
- **Lote:** L02
- **Linhas:** 128
- **SHA1:** c8d386087376b4f99a8a483f3fcb6b0ffe053386
- **Partes lidas:** 1-128
- **Propósito:** Testes de copyName e element.duplicate: a cópia vai logo depois do original, todo nó com id e nome novos, e os ids HTML e referências são refeitos.
- **Âncora:** `src/core/structure/duplicate.test.ts:64` `describe('copyName', () => {`

### `src/core/structure/duplicate.ts`
- **Lote:** L02
- **Linhas:** 111
- **SHA1:** 0180e0f42768d04c566d3089259bcfb83cfd5ea4
- **Partes lidas:** 1-111
- **Propósito:** element.duplicate: copia cada raiz da seleção com ids e nomes novos, desloca a cópia de um elemento posicionado e põe as cópias logo após os originais.
- **Âncora:** `src/core/structure/duplicate.ts:25` `export function copyName(name: string, taken: ReadonlySet<string>): string {`

### `src/core/structure/empty-cell-references.test.ts`
- **Lote:** L02
- **Linhas:** 27
- **SHA1:** aa2d7a6522f41c8591700b989c4f831d04281f15
- **Partes lidas:** 1-27
- **Propósito:** Teste da família RF2: uma célula que um insert toma solta na mesma mudança o que apontava para ela.
- **Âncora:** `src/core/structure/empty-cell-references.test.ts:20` `describe('a cell an insert takes lets go of what pointed at it (RF2)', () => {`

### `src/core/structure/hand.test.ts`
- **Lote:** L02
- **Linhas:** 139
- **SHA1:** 5d62f8ac774b864e5931582babeedb7e95b204ba
- **Partes lidas:** 1-139
- **Propósito:** Testes da mão do teclado (spec hand-keyboard-move): slots em ordem de leitura, levar, mirar, subir, descer, soltar e as recusas.
- **Âncora:** `src/core/structure/hand.test.ts:63` `describe('the hand (spec hand-keyboard-move)', () => {`

### `src/core/structure/hand.ts`
- **Lote:** L02
- **Linhas:** 165
- **SHA1:** d2abbcac69689d96fa3eed27678dd8913a93d97c
- **Partes lidas:** 1-165
- **Propósito:** A mão do teclado: hand.take leva o elemento selecionado, mirar percorre os slots, subir e descer níveis e soltar sem mudar nada.
- **Âncora:** `src/core/structure/hand.ts:50` `export const NO_HAND: HandState | null = null;`

### `src/core/structure/insert.test.ts`
- **Lote:** L02
- **Linhas:** 156
- **SHA1:** aa98cab88b24e562024972696ac591aa6e304994
- **Partes lidas:** 1-156
- **Propósito:** Testes de element.insert, do modelo de conteúdo e da inserção dentro de um Link Block, cada recusa com as palavras da regra.
- **Âncora:** `src/core/structure/insert.test.ts:63` `describe('element.insert (src/core/structure/insert.ts)', () => {`

### `src/core/structure/insert.ts`
- **Lote:** L02
- **Linhas:** 254
- **SHA1:** 3dc36ba2184296883156a4432d808d53b060a7ef
- **Partes lidas:** 1-254
- **Propósito:** element.insert e vizinhos: uniqueName, templateElement, createNaturalChild, placement, paletteNode e a tomada da primeira célula vazia de uma grade.
- **Âncora:** `src/core/structure/insert.ts:27` `export function uniqueName(document: DocumentJson, base: string): string {`

### `src/core/structure/move-availability.test.ts`
- **Lote:** L02
- **Linhas:** 37
- **SHA1:** b84d2402e122a30840f2a023298667dee3205f20
- **Partes lidas:** 1-37
- **Propósito:** Testes de canMoveUp e canMoveDown: as palavras da recusa coincidem com a checagem do próprio comando, e vários selecionados movem quando um pode passar.
- **Âncora:** `src/core/structure/move-availability.test.ts:14` `describe('Move up and Move down available where they would move', () => {`

### `src/core/structure/move.test.ts`
- **Lote:** L02
- **Linhas:** 195
- **SHA1:** 449bfa5cc308dcecf1ade2b4d066a07e79345223
- **Partes lidas:** 1-195
- **Propósito:** Testes de element.moveTo, element.moveUp e element.moveDown, incluindo mover para dentro de um Link Block.
- **Âncora:** `src/core/structure/move.test.ts:69` `describe('element.moveTo (src/core/structure/move.ts)', () => {`

### `src/core/structure/move.ts`
- **Lote:** L02
- **Linhas:** 316
- **SHA1:** 9d3b471df57d98d2790cf15abbb7ee3915335431
- **Partes lidas:** 1-316
- **Propósito:** element.moveTo (moveSelectionTo), element.nestIntoPrevious e element.promote, com o reposicionamento do elemento posicionado cuja caixa contentora muda, e moveUp e moveDown entre irmãos.
- **Âncora:** `src/core/structure/move.ts:35` `export const moveToCommand = registerHandler('element.moveTo', ({ state, rules, layout }, { parent, index }): Outcome<never> => moveSelectionTo(state, rules, layout, parent, index));`

### `src/core/structure/nesting.test.ts`
- **Lote:** L02
- **Linhas:** 97
- **SHA1:** 7ba9defc9b553123570d31be23b9da9fd9ead4f9
- **Partes lidas:** 1-97
- **Propósito:** Testes da gramática de aninhamento: uma tabela de casos atravessa wrap, promote, move, troca de tag e insert, cada caminho recusando com a mensagem da regra.
- **Âncora:** `src/core/structure/nesting.test.ts:82` `describe('the nesting grammar, through every path that places an element', () => {`

### `src/core/structure/node-maker.ts`
- **Lote:** L02
- **Linhas:** 50
- **SHA1:** 34c2ad10bd03f6187fd4ba94433ff18b63d25310
- **Partes lidas:** 1-50
- **Propósito:** O que faz elementos novos: nodeMaker, freshName e newElement, com nome, tag, estilos padrão, texto e filhos naturais de elements.json.
- **Âncora:** `src/core/structure/node-maker.ts:22` `export function freshName(make: NodeMaker, base: string): string {`

### `src/core/structure/remove.test.ts`
- **Lote:** L02
- **Linhas:** 92
- **SHA1:** cc474e19656e0b4c7fc1df6528773ed59b33c959
- **Partes lidas:** 1-92
- **Propósito:** Testes de element.delete: remoção com a subárvore, a seleção resultante, a multi-seleção e a regra followsDelete.
- **Âncora:** `src/core/structure/remove.test.ts:61` `describe('element.delete (src/core/structure/remove.ts)', () => {`

### `src/core/structure/remove.ts`
- **Lote:** L02
- **Linhas:** 91
- **SHA1:** c0f9a364aae3c8561954fcd9f5172e5424aec129
- **Partes lidas:** 1-91
- **Propósito:** element.delete e selectionRoots: os nós selecionados saem com suas subárvores, a seleção vai para o próximo irmão e followsDelete sustenta o aviso de desfazer.
- **Âncora:** `src/core/structure/remove.ts:18` `export function selectionRoots(document: DocumentJson, selection: Selection): Location[] {`

### `src/core/structure/unwrap-references.test.ts`
- **Lote:** L02
- **Linhas:** 88
- **SHA1:** b6677ace47c69c189a0113799d1f521def06e2e4
- **Partes lidas:** 1-88
- **Propósito:** Teste de element.unwrap com um invólucro que um rótulo aponta: a referência é solta no mesmo passo e o documento resultante passa o validador.
- **Âncora:** `src/core/structure/unwrap-references.test.ts:70` `describe('element.unwrap and the references pointing at the wrapper', () => {`

### `src/core/structure/wrap-beside-instance.test.ts`
- **Lote:** L02
- **Linhas:** 23
- **SHA1:** 329d22780127a7122e6de04b6a0c01f972077d33
- **Partes lidas:** 1-23
- **Propósito:** Teste da família IN1: soltar uma parte de instância ao lado de um elemento de fora é recusado antes de qualquer patch.
- **Âncora:** `src/core/structure/wrap-beside-instance.test.ts:18` `describe('a side drop keeps a part in its instance (IN1)', () => {`

### `src/core/structure/wrap.test.ts`
- **Lote:** L02
- **Linhas:** 114
- **SHA1:** 94523902874a721f019cbdcefffa12a0dc9f7709
- **Partes lidas:** 1-114
- **Propósito:** Testes de element.wrapRow e element.wrapColumn: o invólucro entra no índice da seleção com os estilos do manifesto e o conteúdo é perguntado antes quando muda o que a página mostra.
- **Âncora:** `src/core/structure/wrap.test.ts:61` `describe('element.wrapRow and element.wrapColumn (src/core/structure/wrap.ts)', () => {`

### `src/core/structure/wrap.ts`
- **Lote:** L02
- **Linhas:** 292
- **SHA1:** bb24ce861bd4fa58326ed75e6fbdf025c65a4c80
- **Partes lidas:** 1-292
- **Propósito:** Os invólucros Row, Column, Container e Grid, mais element.wrapBeside e element.unwrap, com os estilos de filho do invólucro e as trilhas por breakpoint.
- **Âncora:** `src/core/structure/wrap.ts:154` `export const wrapRowCommand = registerHandler('element.wrapRow', (context): Outcome<never> => wrap('row', context));`

### `src/core/style/alignment.ts`
- **Lote:** L03
- **Linhas:** 50
- **SHA1:** dd71e6620aeae8b1feb23dfcbe94980ed002710f
- **Partes lidas:** 1-50
- **Propósito:** style.setAlignment, que escreve onde os filhos de um contentor flex ou grid ficam através do composto alignment-matrix (justify-content pelo x e align-items pelo y), com o predicado flexOrGridContainer e o estado do botão lido depois dos acoplamentos.
- **Âncora:** `src/core/style/alignment.ts:14` `const MATRIX = 'alignment-matrix';`

### `src/core/style/applies.test.ts`
- **Lote:** L03
- **Linhas:** 180
- **SHA1:** 991008b69ce0144e20905ad215d7e709cd26840f
- **Partes lidas:** 1-180
- **Propósito:** Testes dos predicados de elemento e de contexto (applies.ts) e dos codecs das propriedades específicas de elemento, mostrando quando um campo aparece para uma seleção e o que o codec escreve para cada texto.
- **Âncora:** `src/core/style/applies.test.ts:13` `describe('the element predicates (spec props-element-specific)', () => {`

### `src/core/style/applies.ts`
- **Lote:** L03
- **Linhas:** 166
- **SHA1:** c10c932a95b78c56cde24b6c82b3c55ff946d4ef
- **Partes lidas:** 1-166
- **Propósito:** Quais elementos uma propriedade alcança: os predicados de tipo lidos da tag (KINDS, HOLDS, elementPredicate, kindsOf) e os predicados de contexto calculado (contextPredicate), com appliesToOf, shownForKinds e shownForContext para os campos do inspector e do painel rápido.
- **Âncora:** `src/core/style/applies.ts:47` `export function elementPredicate(predicate: string, node: DocNode, rules: ModelRules): boolean | null {`

### `src/core/style/background-image.ts`
- **Lote:** L03
- **Linhas:** 68
- **SHA1:** 5c501932bc5ee87b1fe384bed947c88e7d49faa6
- **Partes lidas:** 1-68
- **Propósito:** style.setBackgroundImage, que escreve a imagem ou aplica uma edição do editor de gradiente no background-image dos elementos, remove a camada do gradiente ou a declaração inteira, e recusa endereço e valor que o campo não toma.
- **Âncora:** `src/core/style/background-image.ts:25` `export const setBackgroundImageCommand = registerHandler('style.setBackgroundImage', (given, { property, value, edit, targets }) => {`

### `src/core/style/border.test.ts`
- **Lote:** L03
- **Linhas:** 17
- **SHA1:** b0d059d173bdb788442b00ab96017b4a5202854e
- **Partes lidas:** 1-17
- **Propósito:** Testes de borderArgs: partir o texto de um campo de borda nos argumentos de style.setBorder (largura, estilo e cor de uma borda inteira, ou o texto de um aspecto de todos os lados).
- **Âncora:** `src/core/style/border.test.ts:10` `describe('the border field', () => {`

### `src/core/style/border.ts`
- **Lote:** L03
- **Linhas:** 86
- **SHA1:** 0417ed79950aa1ba90eefbfb86e93e0d445aa561
- **Partes lidas:** 1-86
- **Propósito:** style.setBorder e style.setRadius: escrever largura, estilo e cor de todas as bordas ou de uma, e o raio de todos os cantos ou de um, pelos longhands dos compostos num passo de undo, mais borderArgs para os campos de borda.
- **Âncora:** `src/core/style/border.ts:35` `export const setBorderCommand = registerHandler('style.setBorder', (asked, args) => {`

### `src/core/style/box-input.test.ts`
- **Lote:** L03
- **Linhas:** 28
- **SHA1:** b50020b1c5b9ceb42811f990d06fb5b712191ae3
- **Partes lidas:** 1-28
- **Propósito:** Testes dos codecs boxSides e boxCorners: ler de uma a quatro medidas e expandi-las como o CSS, fazer contas com medidas, preservar funções explícitas, tomar uma unidade padrão e manter compostos de cor no seu domínio.
- **Âncora:** `src/core/style/box-input.test.ts:6` `describe('box composite input', () => {`

### `src/core/style/codecs.ts`
- **Lote:** L03
- **Linhas:** 958
- **SHA1:** 6ddbd1417cfcb707d7de1ca91a7cf718e0d83e04
- **Partes lidas:** 1-958
- **Propósito:** O leitor e escritor único dos valores de uma propriedade: cada codec (length-percentage, keyword, ratio, axis-pair, font-family-list, cor, paint, posição, tamanho de fundo, camadas de imagem, lados e cantos de caixa, borda, integer, number, alpha, grade, transições, tempos, easing, filtros, colunas, sombras de texto, contador, imagem) lê o texto digitado e escreve o texto CSS guardado, com workOut, workOutLengths, splitLayers, FINE_STEP_UNITS, PIXELS_PER e convertLength.
- **Âncora:** `src/core/style/codecs.ts:65` `export const DEFAULT_UNIT = 'px';`

### `src/core/style/color.test.ts`
- **Lote:** L03
- **Linhas:** 62
- **SHA1:** 0cf1f59050bd7876fe22f6dd6bda132a3d4c8e1a
- **Partes lidas:** 1-62
- **Propósito:** Testes de parseColor, parseSrgb, inSrgbGamut, channelText, editedColour e toOklab: todas as sintaxes de cor do CSS lidas como o seletor as mostra, gamut sRGB e os canais OKLCH e OKLab.
- **Âncora:** `src/core/style/color.test.ts:6` `describe('parseColor reads every CSS colour syntax as the picker shows it', () => {`

### `src/core/style/color.ts`
- **Lote:** L03
- **Linhas:** 382
- **SHA1:** 19f586f3aebb1188a2e4392d4984eb2fa5e218b7
- **Partes lidas:** 1-382
- **Propósito:** O leitor e escritor único das cores do seletor: parseSrgb e parseColor para todas as sintaxes CSS (hex, rgb, hsl, hwb, lab, lch, oklab, oklch e color()), conversões entre RGB, HSB, OKLab e OKLCH, os fundos do seletor, channelText e editedColour para a escrita por canal.
- **Âncora:** `src/core/style/color.ts:152` `export function parseSrgb(text: string): Srgb | null {`

### `src/core/style/composes-not.test.ts`
- **Lote:** L03
- **Linhas:** 22
- **SHA1:** 88d524126673b53f8a7f36c4b47526f8fbf6fcba
- **Partes lidas:** 1-22
- **Propósito:** Testes de composesNot e composedText: um composto cujos longhands nenhum atalho escreve (uma borda só num lado) lê Mixed no campo, os quatro lados iguais compõem e uma propriedade sem atalho próprio junta os seus valores.
- **Âncora:** `src/core/style/composes-not.test.ts:11` `describe('composesNot (src/core/style/set.ts)', () => {`

### `src/core/style/couplings.ts`
- **Lote:** L03
- **Linhas:** 100
- **SHA1:** 772e47f0259d71d5ed5428bfe0bf517f3214ff85
- **Partes lidas:** 1-100
- **Propósito:** Os acoplamentos de properties.json: as condições e ações registradas (valueIn, always, parentValueIn, setValue, swapWith, mirror, setParentValue e keepVisualPlace), valuePredicateHolds lendo também as classes, e coupledScene, que muda o que uma escrita grava no mesmo passo.
- **Âncora:** `src/core/style/couplings.ts:16` `const valueIn = registerCondition('valueIn', (own, _parent, values) => own !== undefined && values.includes(own));`

### `src/core/style/css-rule.ts`
- **Lote:** L03
- **Linhas:** 33
- **SHA1:** a9e737abf59dcb81fffed72995fc75ef86f395e0
- **Partes lidas:** 1-33
- **Propósito:** style.applyCssRule, que grava as declarações de CSS editadas no painel de código sobre o elemento selecionado, substituindo a camada do breakpoint e estado ativos pelo escritor único de declarações, num passo de undo.
- **Âncora:** `src/core/style/css-rule.ts:14` `export const applyCssRuleCommand = registerHandler('style.applyCssRule', (context, { css }) => {`

### `src/core/style/custom.ts`
- **Lote:** L03
- **Linhas:** 87
- **SHA1:** b7ba36681ea1af14602fa64ef576dbf01c80f589
- **Partes lidas:** 1-87
- **Propósito:** style.setCustomDeclarations e parseDeclarations: gravar declarações escritas como texto CSS, com propriedades próprias (--nome), atalhos expandidos nos seus longhands e endereços url() passando pela regra única de endereço, recusando a primeira peça errada com a sua linha.
- **Âncora:** `src/core/style/custom.ts:29` `export function parseDeclarations<Ui>(text: string, context: HandlerContext<Ui>): { readonly declarations: ReadonlyMap<string, string> } | { readonly refused: Message } {`

### `src/core/style/decimal-comma.test.ts`
- **Lote:** L03
- **Linhas:** 16
- **SHA1:** f734136c281b99ebeae6c7cc47cd75487263353e
- **Partes lidas:** 1-16
- **Propósito:** Teste da família L10N1: uma vírgula decimal num campo de número vale como ponto decimal — "1,5px" é guardado como 1.5px.
- **Âncora:** `src/core/style/decimal-comma.test.ts:9` `describe('a decimal comma is a decimal point (L10N1)', () => {`

### `src/core/style/direction.ts`
- **Lote:** L03
- **Linhas:** 120
- **SHA1:** 493f0806d717a96a304e6cc4aaa0c675d73241b5
- **Partes lidas:** 1-120
- **Propósito:** element.swapDirection e element.stackOnPhone, que trocam a direção de um contentor flex ou grid e empilham numa coluna no breakpoint mais estreito, lendo os nomes das propriedades dos próprios doors do manifesto, com recusa por tranca.
- **Âncora:** `src/core/style/direction.ts:34` `export const swapDirectionCommand = registerHandler('element.swapDirection', (context): Outcome<never> => {`

### `src/core/style/divider.ts`
- **Lote:** L03
- **Linhas:** 85
- **SHA1:** bf0e49f321fe399183f1ec3e78606d8a3d113d1c
- **Partes lidas:** 1-85
- **Propósito:** element.setDivider, que divide a largura entre dois vizinhos de uma fileira flex a partir do arraste da alça, medindo as caixas pelo port de layout e escrevendo a fração como crescimento dos dois, mais o predicado divideableSelection.
- **Âncora:** `src/core/style/divider.ts:26` `const MIN_WIDTH = numberConstant('divider.minWidth');`

### `src/core/style/field-targets.test.ts`
- **Lote:** L03
- **Linhas:** 21
- **SHA1:** 9f6c633cd41f6fc6958d9871953eede38813fc37
- **Partes lidas:** 1-21
- **Propósito:** Teste da família FD1: o que foi digitado num campo vai para os elementos para os quais foi digitado (os targets), nunca para o que a pressão seguinte selecionou.
- **Âncora:** `src/core/style/field-targets.test.ts:13` `describe('a field keeps its typing for the elements it was typed for (FD1)', () => {`

### `src/core/style/filter.ts`
- **Lote:** L03
- **Linhas:** 36
- **SHA1:** 06af125c57b33597350c181fc0af9c26d8e8ddaf
- **Partes lidas:** 1-36
- **Propósito:** style.setFilter e applyFunctions: escrever as funções de filtro dadas no valor de filter de cada elemento, cada função no seu lugar ou por último, uma fora para um argumento vazio, e a declaração fora para "none", num passo de undo.
- **Âncora:** `src/core/style/filter.ts:14` `export function applyFunctions(held: string | undefined, functions: unknown): string | null {`

### `src/core/style/functions.test.ts`
- **Lote:** L03
- **Linhas:** 21
- **SHA1:** c309d25da6742ca508711340ecfeb2d89674dd46
- **Partes lidas:** 1-21
- **Propósito:** Testes de withBareUnit e withFunction: um número nu recebe a unidade da sua função (blur em px, hue-rotate em deg, brightness em %), e uma função com unidade, sem unidade ou outra expressão é mantida.
- **Âncora:** `src/core/style/functions.test.ts:5` `describe('withBareUnit', () => {`

### `src/core/style/functions.ts`
- **Lote:** L03
- **Linhas:** 100
- **SHA1:** edfee8e6d45653822097e874c1573339a45a93a3
- **Partes lidas:** 1-100
- **Propósito:** As listas de funções CSS: functionsOf e functionArgument leem os valores de filtro e transformação, withFunction põe ou tira uma função, withBareUnit dá a unidade ao número nu, functionOfControl nomeia a função de um controle e translateWith/translateAxis escrevem um eixo do translate.
- **Âncora:** `src/core/style/functions.ts:12` `export function functionsOf(value: string | undefined): CssFunction[] | null {`

### `src/core/style/gradient.ts`
- **Lote:** L03
- **Linhas:** 190
- **SHA1:** 8df1b94b2a6cc4ceacf8980ae9ecdf3eff7bf1c5
- **Partes lidas:** 1-190
- **Propósito:** O leitor e escritor único do gradiente de um background-image: parseGradient e writeGradient, gradientLayer para achar a camada do gradiente, colorAt para a cor entre paradas e editedGradient com todas as edições do editor (tipo, ângulo, paradas, inverter, distribuir e reiniciar).
- **Âncora:** `src/core/style/gradient.ts:32` `export const MIN_STOPS = 2;`

### `src/core/style/grid-item.ts`
- **Lote:** L03
- **Linhas:** 58
- **SHA1:** b11b6bf23d0f89ea188469877eca46f1fe17bcdb
- **Partes lidas:** 1-58
- **Propósito:** style.setGridItem: escrever o início e a extensão de um item de grid num eixo (grid-column ou grid-row), lendo a metade que o door deixa de fora dos longhands guardados (storedPlace) e recusando início e extensão abaixo de 1.
- **Âncora:** `src/core/style/grid-item.ts:26` `export function storedPlace(node: DocNode, property: string, rules: ModelRules): { readonly start: number | null; readonly span: number } {`

### `src/core/style/holders-together.test.ts`
- **Lote:** L03
- **Linhas:** 24
- **SHA1:** 6fb308ad76314b24ee8f5149e931300b3a6ce416
- **Partes lidas:** 1-24
- **Propósito:** Teste da família LU1: uma escrita a vários elementos lê cada elemento do documento já atualizado — um pai e um filho escritos juntos ficam ambos absolutos, sem problemas no documento.
- **Âncora:** `src/core/style/holders-together.test.ts:11` `const staticStyle = { desktop: { base: { position: 'static' } } } as never;`

### `src/core/style/keyword-words.ts`
- **Lote:** L03
- **Linhas:** 23
- **SHA1:** 266f5276ee6a81d2da4ad1a918ffa4ba46561b16
- **Partes lidas:** 1-23
- **Propósito:** keywordOfWord: a palavra do idioma da pessoa que vale por uma palavra-chave do CSS, comparada sem caixa e sem acentos (folded), onde a propriedade oferece aquela palavra-chave.
- **Âncora:** `src/core/style/keyword-words.ts:19` `export function keywordOfWord(typed: string, keywords: readonly string[], words: (key: MessageId) => string): string | null {`

### `src/core/style/ok-alpha.test.ts`
- **Lote:** L03
- **Linhas:** 17
- **SHA1:** d525c093a5ac9b7e076d0790c097b06d32916a69
- **Partes lidas:** 1-17
- **Propósito:** Teste da família CH1: o alfa de uma cor em OKLCH ou OKLab é escrito nesse espaço, fora do sRGB como está, e o eixo a do OKLab é tratado como o eixo b, nunca como o alfa.
- **Âncora:** `src/core/style/ok-alpha.test.ts:7` `describe('OKLCH and OKLab keep their colour when the alpha or an axis is edited (CH1)', () => {`

### `src/core/style/one-writer.test.ts`
- **Lote:** L03
- **Linhas:** 34
- **SHA1:** f91b28d28931af410ba3c889703d142b076d41ee
- **Partes lidas:** 1-34
- **Propósito:** Teste da família OW1: a regra do painel de código e as declarações próprias passam pelo escritor único de declarações — uma regra esvaziada não deixa camada vazia, e uma regra num elemento de instância alcança a outra instância.
- **Âncora:** `src/core/style/one-writer.test.ts:24` `describe('every style write goes through the one writer of declarations (OW1)', () => {`

### `src/core/style/organize.ts`
- **Lote:** L03
- **Linhas:** 112
- **SHA1:** 021ac6611c130d237d3ec6e9cadf7788d3e586b7
- **Partes lidas:** 1-112
- **Propósito:** element.organize, que transforma os filhos soltos do contentor selecionado num layout flex cuja direção é a linha em que eles correm e cujo gap é a distância mais frequente entre vizinhos, movendo as margens das crianças para o gap, mais o predicado organizableSelection.
- **Âncora:** `src/core/style/organize.ts:39` `export const organizableSelection = registerPredicate('organizableSelection', (state, rules) => containerOf(state, rules) !== null, (state) =>`

### `src/core/style/plural-messages.test.ts`
- **Lote:** L03
- **Linhas:** 37
- **SHA1:** 5f6cca343ce084025f8f96c8a345c9403a5857a2
- **Partes lidas:** 1-37
- **Propósito:** Teste do item J28: uma mudança em vários elementos é dita com a contagem deles (status.style.setMany, resetMany e resetAllMany), e um elemento só é dito pelo nome.
- **Âncora:** `src/core/style/plural-messages.test.ts:26` `describe('several elements are named by their count', () => {`

### `src/core/style/recipes.ts`
- **Lote:** L03
- **Linhas:** 19
- **SHA1:** e251cbe1500418b1c67dac50db581193af2a8edd
- **Partes lidas:** 1-19
- **Propósito:** clearedRecipes: as receitas de properties.json que uma escrita de uma das suas propriedades desfaz no mesmo passo (shared.otherWrite: clears-recipe), devolvendo os valores com a receita marcada para sair.
- **Âncora:** `src/core/style/recipes.ts:12` `export function clearedRecipes(node: DocNode, values: Readonly<Record<string, string | null>>, rules: ModelRules): Record<string, string | null> {`

### `src/core/style/reset.ts`
- **Lote:** L03
- **Linhas:** 57
- **SHA1:** a464e6fddc7339ccf3b66d1cde741c4bbfab105a
- **Partes lidas:** 1-57
- **Propósito:** style.reset, style.resetAll e removeStyle: tirar uma propriedade (com os seus longhands e o que um acoplamento preencheu) ou todos os valores de estilo dos elementos selecionados, num passo de undo, com recusa por tranca e a contagem nos vários.
- **Âncora:** `src/core/style/reset.ts:18` `export function removeStyle<Ui>(context: HandlerContext<Ui>, property: string): Outcome<Ui> {`

### `src/core/style/set.test.ts`
- **Lote:** L03
- **Linhas:** 123
- **SHA1:** 854ba030114663a738b598a6006f506c22e4a723
- **Partes lidas:** 1-123
- **Propósito:** Testes do codec length-percentage e de style.set: unidade digitada, número nu na unidade padrão, palavras-chave, contas, calc(), conversão de unidades, escrita no breakpoint e estado base, valor já guardado sem entrada, recusas por valor inválido e por tranca.
- **Âncora:** `src/core/style/set.test.ts:77` `describe('style.set', () => {`

### `src/core/style/set.ts`
- **Lote:** L03
- **Linhas:** 410
- **SHA1:** ecb5fba9574bfd33020cdacf08a5d73500e4baad
- **Partes lidas:** 1-410
- **Propósito:** O escritor único de uma propriedade nos estilos dos elementos: styleHolders (elemento, classe alvo ou definição de componente e suas cópias), writeDeclarations e replaceLayer, heldAt e storedValue, readValue com a leitura de token e vírgula decimal, writeStyle com acoplamentos e receitas, writePropertyText e withTargets.
- **Âncora:** `src/core/style/set.ts:88` `export function writeDeclarations(`

### `src/core/style/shadows.test.ts`
- **Lote:** L03
- **Linhas:** 40
- **SHA1:** 64fd162526250b5dae5e88eee7853d173cebf3e2
- **Partes lidas:** 1-40
- **Propósito:** Testes de editedLayers: ler uma sombra escrita como CSS (X, Y, blur e cor, spread e inset na sombra de caixa), ler cada camada separada por vírgula, esvaziar todas as camadas com um texto vazio e recusar textos que não fazem camada.
- **Âncora:** `src/core/style/shadows.test.ts:17` `describe('a shadow typed as CSS', () => {`

### `src/core/style/shadows.ts`
- **Lote:** L03
- **Linhas:** 180
- **SHA1:** 25ebb8b78bfcc84c3219f289612dede59fd95571
- **Partes lidas:** 1-180
- **Propósito:** style.setShadows e editedLayers: escrever as camadas de uma box shadow ou text shadow como campos tipados (nunca texto CSS), com add, remoção, mudança de campo, mover, esconder e nudge, e shadowLayersFromCss como leitura única do texto de CSS da sombra.
- **Âncora:** `src/core/style/shadows.ts:59` `export function shadowLayersFromCss(text: string, fields: readonly StructureField[]): StructuredLayer[] | null {`

### `src/core/style/smart-input.test.ts`
- **Lote:** L03
- **Linhas:** 40
- **SHA1:** a2edd486e728cd9c7154a5bbfc6759cff0fe2cb5
- **Partes lidas:** 1-40
- **Propósito:** Testes da entrada inteligente: aritmética com medidas (feita numa unidade ou escrita como calc(), recusando multiplicar duas medidas e dividir por medida ou por zero) e palavras-chave digitadas no idioma da pessoa.
- **Âncora:** `src/core/style/smart-input.test.ts:11` `describe('arithmetic on lengths', () => {`

### `src/core/style/spacing.ts`
- **Lote:** L03
- **Linhas:** 44
- **SHA1:** 4e1aa775cf3fa3172f4be719ac6629593aba84bc
- **Partes lidas:** 1-44
- **Propósito:** style.setSpacing: escrever um lado no seu longhand ou os quatro lados de uma caixa (padding ou margem), lendo o texto como style.set lê, recusando padding negativo com uma palavra própria e nomeando os vários elementos pela contagem.
- **Âncora:** `src/core/style/spacing.ts:18` `export const mayBeNegative = (box: string): boolean => box !== NO_NEGATIVE;`

### `src/core/style/state-elements.ts`
- **Lote:** L03
- **Linhas:** 11
- **SHA1:** abb6475caf220908b587cca2a0094eff012d7301
- **Partes lidas:** 1-11
- **Propósito:** stateStandsOn: quais elementos um estado de estilo alcança (properties.json states[].elements), regra lida pelo validador, pelas recusas dos escritores de estilo e pelo estado de estilo do editor.
- **Âncora:** `src/core/style/state-elements.ts:8` `export function stateStandsOn(state: string, type: string, rules: Pick<ModelRules, 'stateElements'>): boolean {`

### `src/core/style/stored.ts`
- **Lote:** L03
- **Linhas:** 36
- **SHA1:** 6aba28ec0af2cd7cb6fdeb57d4d42037b5a8432b
- **Partes lidas:** 1-36
- **Propósito:** As leituras que os módulos de estilo fazem antes de escrever: storedValue, storedLayers, storedStyleValue e heldAt, lendo o documento apenas, no breakpoint e estado base.
- **Âncora:** `src/core/style/stored.ts:8` `export function storedValue(node: DocNode, property: string, rules: ModelRules): string | undefined {`

### `src/core/style/sweep.test.ts`
- **Lote:** L03
- **Linhas:** 77
- **SHA1:** 5a5c2fe041b858d6c3d6ec9bbf52df2050cbbbbb
- **Partes lidas:** 1-77
- **Propósito:** A varredura de falha silenciosa: cada propriedade e composto de properties.json com cada valor oferecido, num elemento e numa classe, no breakpoint base e noutro, ou muda o documento para um que o validador toma, ou não muda nada, ou é recusado antes de qualquer patch.
- **Âncora:** `src/core/style/sweep.test.ts:56` `describe('the silent-failure sweep of style.set', () => {`

### `src/core/style/tracks.test.ts`
- **Lote:** L03
- **Linhas:** 45
- **SHA1:** 16b71ef0e5a5388735a256040ebd145c9754669a
- **Partes lidas:** 1-45
- **Propósito:** Testes das faixas de grid (tracksOf, tracksToValue, withTrackAdded, withTrackRemoved e withTrackSet): ler a forma repeat e a lista, escrever iguais em repeat, pôr uma faixa igual às existentes, tirar a última e trocar uma faixa pelo seu lugar.
- **Âncora:** `src/core/style/tracks.test.ts:2` `import { tracksOf, tracksToValue, withTrackAdded, withTrackRemoved, withTrackSet } from './tracks.ts';`

### `src/core/style/tracks.ts`
- **Lote:** L03
- **Linhas:** 142
- **SHA1:** a45522d751155cfa37458024a06f83bb0552cd6c
- **Partes lidas:** 1-142
- **Propósito:** O dono único da lista de faixas de um eixo de grid e do valor que a escreve (tracksOf, tracksToValue, withTrackAdded, withTrackRemoved, withTrackSet), mais tracksForChildren para a grade responsiva, COLUMNS_PROPERTY e style.setGridTracks.
- **Âncora:** `src/core/style/tracks.ts:7` `const DEFAULT_TRACK = 'minmax(0, 1fr)';`

### `src/core/style/transform.ts`
- **Lote:** L03
- **Linhas:** 21
- **SHA1:** 8fb917a06f53b1a5f30208debeabd940ab682342
- **Partes lidas:** 1-21
- **Propósito:** style.setTransform: escrever as funções de transformação dadas no valor de transform de cada elemento, cada uma no seu lugar ou por último, uma fora para um argumento vazio, num passo de undo.
- **Âncora:** `src/core/style/transform.ts:11` `export const setTransformCommand = registerHandler('style.setTransform', (given, { property, parts, targets }) => {`

### `src/core/style/units.ts`
- **Lote:** L03
- **Linhas:** 12
- **SHA1:** c08403a06ddd4704682a0eb058faaca702afcc1c
- **Partes lidas:** 1-12
- **Propósito:** unitMenu: as unidades que o menu de um campo de medida mostra de imediato (as comuns: px, %, em, rem, vw, vh e ch) e as que ficam atrás de "More units".
- **Âncora:** `src/core/style/units.ts:9` `export function unitMenu(units: readonly string[]): { readonly common: readonly string[]; readonly more: readonly string[] } {`

### `src/core/style/value-predicates.test.ts`
- **Lote:** L03
- **Linhas:** 36
- **SHA1:** a5e553f8f959fe4f557b12f7f32aeae6d5713914
- **Partes lidas:** 1-36
- **Propósito:** Teste da família AL1: um predicado de disponibilidade que lê um valor lê também as classes do elemento (o próprio valor primeiro, a última classe do projeto que o define vencendo), e a matriz de alinhamento alcança um contentor que uma classe faz flex.
- **Âncora:** `src/core/style/value-predicates.test.ts:8` `import { RULES, documentOf, node } from '../testing/handlers.ts';`

### `src/core/style/variables-in-composites.test.ts`
- **Lote:** L03
- **Linhas:** 104
- **SHA1:** 50c711fb4f88bffba11da6e60bf89a2801aa4682
- **Partes lidas:** 1-104
- **Propósito:** Teste do item D1: uma variável de design digitada num campo composto (com ou sem var()) escreve-se em cada longhand ou é recusada antes de qualquer patch, nunca deixando um estado que o validador recusa.
- **Âncora:** `src/core/style/variables-in-composites.test.ts:53` `describe('a design token in a composite field', () => {`

### `src/core/testing/archive.ts`
- **Lote:** L01
- **Linhas:** 74
- **SHA1:** 05f27df336e26d8a3c668b7458fc97543bb3cf8f
- **Partes lidas:** 1-74
- **Propósito:** escreve arquivos ZIP como outras ferramentas os escrevem, para os testes: entradas deflacionadas ou guardadas e cabeçalhos que podem mentir no tamanho.
- **Âncora:** `src/core/testing/archive.ts:21` `export async function archiveOf(parts: readonly ArchivePart[]): Promise<Uint8Array> {`

### `src/core/testing/handlers.ts`
- **Lote:** L01
- **Linhas:** 68
- **SHA1:** 8f3cb3a71734612d05c54c3a716636cb5a0a5182
- **Partes lidas:** 1-68
- **Propósito:** roda um tratador para os testes do núcleo como a store o roda: documento congelado, regras do manifesto e portas que nada medem, com o resultado aplicado e validado.
- **Âncora:** `src/core/testing/handlers.ts:17` `export const RULES = rulesFromManifest(manifest.elements, manifest.properties, manifest.html);`

### `src/core/testing/workbook.ts`
- **Lote:** L01
- **Linhas:** 95
- **SHA1:** aa0aed3b2d8d6a5add29038844e04bdd7a7686ef
- **Partes lidas:** 1-95
- **Propósito:** escreve planilhas XLSX como um programa de planilha as escreve, para os testes dos leitores de dados: strings compartilhadas e em linha, números, booleanos, datas, fórmulas, células de erro e buracos.
- **Âncora:** `src/core/testing/workbook.ts:92` `export async function workbook(sheets: readonly WorkbookSheet[], options: WorkbookOptions = {}): Promise<Uint8Array> {`

### `src/core/text/fold.ts`
- **Lote:** L02
- **Linhas:** 9
- **SHA1:** e67776f8f976d05ba988d25c8305a20eea08758c
- **Partes lidas:** 1-9
- **Propósito:** fold e slug: o texto como a busca o compara (minúsculas, sem acentos) e como as palavras de um nome de arquivo, classe ou id.
- **Âncora:** `src/core/text/fold.ts:4` `export const fold = (text: string): string => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();`

### `src/core/text/identifier.ts`
- **Lote:** L02
- **Linhas:** 6
- **SHA1:** bbd0e8d085ba6ed11a3a9511eb967dae60434826
- **Partes lidas:** 1-6
- **Propósito:** A regra única de um identificador CSS como uma pessoa o nomeia, com IDENTIFIER_SOURCE e isIdentifier.
- **Âncora:** `src/core/text/identifier.ts:6` `export const isIdentifier = (name: string): boolean => IDENTIFIER.test(name);`

### `src/core/text/inline-address.test.ts`
- **Lote:** L02
- **Linhas:** 25
- **SHA1:** a1d892551885ba19a7f617ea0449881b4811314e
- **Partes lidas:** 1-25
- **Propósito:** Testes da família AD2: um link dentro do texto guarda o endereço que a regra de endereço lê (domínio nu vira https://), em text.set e na colagem.
- **Âncora:** `src/core/text/inline-address.test.ts:15` `describe('a link in a text keeps the address the rule reads (AD2)', () => {`

### `src/core/text/inline.test.ts`
- **Lote:** L02
- **Linhas:** 136
- **SHA1:** bd63becd20c5864148fad50fad11ef6452f143f6
- **Partes lidas:** 1-136
- **Propósito:** Testes da marcação inline: árvore canônica, texto puro, endereço seguro, mudanças de marca sobre um intervalo e conteúdo colado.
- **Âncora:** `src/core/text/inline.test.ts:12` `describe('inline marks (src/core/text/inline.ts)', () => {`

### `src/core/text/inline.ts`
- **Lote:** L02
- **Linhas:** 338
- **SHA1:** 32bd7477cf09d11994dcc1ecb980a0e6a949c666
- **Partes lidas:** 1-338
- **Propósito:** A marcação inline de um texto: a árvore canônica de runs (strong, em, a), as mudanças de marca sobre um intervalo e a leitura de conteúdo colado.
- **Âncora:** `src/core/text/inline.ts:110` `export const canonical = (runs: readonly InlineRun[]): InlineRun[] => runsOf(segmentsOf(runs));`

### `src/core/text/language-tag.ts`
- **Lote:** L02
- **Linhas:** 18
- **SHA1:** 5f76532d6935bca89d49f47f6ba4fa0fbcd84c60
- **Partes lidas:** 1-18
- **Propósito:** A regra única de etiqueta de idioma: um tag de uso privado (x-…) ou um que o ICU conhece, pela função languageTagAllowed.
- **Âncora:** `src/core/text/language-tag.ts:4` `const LANGUAGE_TAG = /^[A-Za-z]{1,8}(?:-[A-Za-z0-9]{1,8})*$/;`

### `src/core/text/text.test.ts`
- **Lote:** L02
- **Linhas:** 79
- **SHA1:** 227edcecc72fb01b85ec3f821a3d6bb181f796d5
- **Partes lidas:** 1-79
- **Propósito:** Testes de text.set: grava o texto com quebra de linha, mantém a árvore de runs em inline e recusa um endereço de link não permitido.
- **Âncora:** `src/core/text/text.test.ts:35` `describe('text.set', () => {`

### `src/core/text/text.ts`
- **Lote:** L02
- **Linhas:** 42
- **SHA1:** 96fe3d0e902147f42e71fbb7834140354b219404
- **Partes lidas:** 1-42
- **Propósito:** text.set: escreve o texto de um elemento em uma transação, com o texto puro sempre em text e a árvore canônica em inline só enquanto algo está marcado.
- **Âncora:** `src/core/text/text.ts:18` `export const setTextCommand = registerHandler('text.set', ({ state, rules }, { target, content }) => {`

### `src/editor/app.tsx`
- **Lote:** L05b
- **Linhas:** 10
- **SHA1:** 413da0d982cc97b66b2d92459c91ac7cef28680a
- **Partes lidas:** 1-10
- **Propósito:** Componente raiz do editor: envolve o Shell no provedor do contexto da store do editor.
- **Âncora:** `src/editor/app.tsx:4` `export function App({ store }: { readonly store: EditorStore }) {`

### `src/editor/assistant/catalogue.ts`
- **Lote:** L06
- **Linhas:** 51
- **SHA1:** 1e0543b5b79a5627b52a2bb57f63e5127363a48d
- **Partes lidas:** 1-51
- **Propósito:** Converte os comandos do manifesto em definições de ferramenta do assistente e valida os argumentos recebidos contra o tipo declarado de cada um.
- **Âncora:** `src/editor/assistant/catalogue.ts:4` `export const toolName = (id: string) => id.replaceAll('.', '_');`

### `src/editor/assistant/chat.ts`
- **Lote:** L06
- **Linhas:** 41
- **SHA1:** 59ca30614b95ff470c0d32df63530907f6818e8e
- **Partes lidas:** 1-41
- **Propósito:** Executa um turno de conversa do assistente em rodadas, criando uma transação para as chamadas de ferramenta e cancelando-a em caso de falha.
- **Âncora:** `src/editor/assistant/chat.ts:3` `export interface ToolResult { content: readonly ContentBlock[]; isError?: boolean }`

### `src/editor/assistant/client.ts`
- **Lote:** L06
- **Linhas:** 57
- **SHA1:** d2ccb8ed1628b95ea8be97db2070b7f2e7fa169b
- **Partes lidas:** 1-57
- **Propósito:** Conecta o editor à ponte local por WebSocket autenticado em loopback, executando cada requisição recebida em fila e abortando as pendentes quando a conexão termina.
- **Âncora:** `src/editor/assistant/client.ts:5` `if (address.protocol !== 'ws:' || address.hostname !== '127.0.0.1' || address.pathname !== '/editor') throw new Error('Editor bridge must use authenticated loopback');`

### `src/editor/assistant/controller.ts`
- **Lote:** L06
- **Linhas:** 236
- **SHA1:** 2f6ffeea8443df9646d6ca9465732ad662ea0814
- **Partes lidas:** 1-236
- **Propósito:** Instala e mantém o controlador do assistente no editor: monta as ferramentas, a sessão e o cofre de credenciais, e executa cada pedido vindo da interface.
- **Âncora:** `src/editor/assistant/controller.ts:35` `export function installAssistant(store: EditorStore): () => void {`

### `src/editor/assistant/credentials.ts`
- **Lote:** L06
- **Linhas:** 56
- **SHA1:** 9aa0c32a79f48040e6bac4695edee4261e45bd31
- **Partes lidas:** 1-56
- **Propósito:** Abre um cofre de credenciais em IndexedDB com chave AES-GCM gerada fora do projeto, para gravar, ler e apagar a chave de API.
- **Âncora:** `src/editor/assistant/credentials.ts:3` `export interface CredentialVault { save(value: string): Promise<void>; read(): Promise<string | null>; clear(): Promise<void>; close(): void }`

### `src/editor/assistant/editor.ts`
- **Lote:** L06
- **Linhas:** 86
- **SHA1:** 135a323fce4dd15ed25a38506fb2c8cf1f9b28ea
- **Partes lidas:** 1-86
- **Propósito:** Embrulha os comandos do manifesto como ferramentas do assistente, com leitura do documento, captura de tela e autorização antes de despachar.
- **Âncora:** `src/editor/assistant/editor.ts:11` `export function editorTools(commands: readonly ManifestCommand[], editor: EditorPort) {`

### `src/editor/assistant/mcp.ts`
- **Lote:** L06
- **Linhas:** 43
- **SHA1:** 0663ce777acd488514518916c710f68f5c13380b
- **Partes lidas:** 1-43
- **Propósito:** Atende requisições JSON-RPC do protocolo MCP sobre as ferramentas do assistente, com negociação de versão e cancelamento por id.
- **Âncora:** `src/editor/assistant/mcp.ts:5` `export function createMcpHandler(ports: McpPorts) {`

### `src/editor/assistant/panel.tsx`
- **Lote:** L06
- **Linhas:** 95
- **SHA1:** d57f71c34a2f92811b6ead5cd6015effdb64eae3
- **Partes lidas:** 1-95
- **Propósito:** Desenha o painel do assistente na barra lateral, com os campos de preferências, a conversa e o estado da conexão, cada controle uma porta do manifesto.
- **Âncora:** `src/editor/assistant/panel.tsx:45` `export function AssistantPanel(): ReactNode {`

### `src/editor/assistant/provider.ts`
- **Lote:** L06
- **Linhas:** 67
- **SHA1:** 89e23ae4073998e8be5aaee3ab6bfa32469740d1
- **Partes lidas:** 1-67
- **Propósito:** Fala com o provedor Anthropic: monta o corpo da requisição e lê o fluxo SSE de blocos de conteúdo, acumulando texto, tokens e motivo de parada.
- **Âncora:** `src/editor/assistant/provider.ts:19` `if (response.status === 404) throw new Error('assistant.modelUnavailable');`

### `src/editor/assistant/proxy-client.ts`
- **Lote:** L06
- **Linhas:** 9
- **SHA1:** bef4353bcee87045186d8120e05d2cc54eb1ee9e
- **Partes lidas:** 1-9
- **Propósito:** Monta o fetch que envia cada requisição do provedor pelo proxy local do Companion em 127.0.0.1, com o token da ponte.
- **Âncora:** `src/editor/assistant/proxy-client.ts:1` `export function companionFetch(base: string, token: string, fetcher: typeof fetch = fetch): typeof fetch {`

### `src/editor/assistant/session.ts`
- **Lote:** L06
- **Linhas:** 59
- **SHA1:** b4a671915e96e064a496ca03860d7c011eccb5c8
- **Partes lidas:** 1-59
- **Propósito:** Guarda a conversa do assistente e envia cada mensagem pelo turno da conversa, publicando o estado de ocupado, o histórico e os erros.
- **Âncora:** `src/editor/assistant/session.ts:14` `export function createAssistantSession(ports: SessionPorts) {`

### `src/editor/assistant/state.ts`
- **Lote:** L06
- **Linhas:** 76
- **SHA1:** 87273b52738c78ad498d90d64667da74a6ef935f
- **Partes lidas:** 1-76
- **Propósito:** Define o estado do assistente na interface do editor e os comandos que o alteram: rascunho, preferências, pedidos e o relatório do controlador.
- **Âncora:** `src/editor/assistant/state.ts:7` `export const DEFAULT_ASSISTANT_MODEL = 'claude-opus-5-5';`

### `src/editor/assistant/stream.ts`
- **Lote:** L06
- **Linhas:** 51
- **SHA1:** bbd30faf70ee67b0da863c4279c9a99a07bee3b7
- **Partes lidas:** 1-51
- **Propósito:** Lê o fluxo SSE do provedor como eventos, juntando as linhas de dados e recusando fluxos truncados ou grandes demais.
- **Âncora:** `src/editor/assistant/stream.ts:2` `export async function* parseEvents(stream: ReadableStream<Uint8Array>, signal?: AbortSignal): AsyncGenerator<StreamEvent> {`

### `src/editor/assistant/surface.css`
- **Lote:** L06
- **Linhas:** 25
- **SHA1:** b30734fccc775611918358983d46b75ae7e0eb32
- **Partes lidas:** 1-25
- **Propósito:** Estiliza a superfície do assistente: a conversa, o rodapé, as preferências e os campos do painel.
- **Âncora:** `src/editor/assistant/surface.css:2` `.assistant-chat { display:flex;flex-direction:column;flex:1 0 auto;gap:var(--space-3); }`

### `src/editor/assistant/surface.tsx`
- **Lote:** L06
- **Linhas:** 26
- **SHA1:** ada65f6147eb072c36c476000bea2633a1707fcd
- **Partes lidas:** 1-26
- **Propósito:** Desenha a conversa do assistente e a tela de preferências a partir do estado do editor, mostrando as mensagens como texto.
- **Âncora:** `src/editor/assistant/surface.tsx:5` `export function ChatSurface({ entries, draft, busy, configured, model, door, t }: ChatSurfaceProps) {`

### `src/editor/browser-ports.ts`
- **Lote:** L05b
- **Linhas:** 104
- **SHA1:** b3d482c20bfa017ceb58c1f0c56c9da8857f3840
- **Partes lidas:** 1-104
- **Propósito:** Lado do navegador das portas do núcleo: parser HTML que vira árvore de marcação, leitura de cabeçalho e atributos, captura de página sem marcação executável e medida intrínseca de imagem.
- **Âncora:** `src/editor/browser-ports.ts:9` `const ELEMENT_NODE = 1;`

### `src/editor/canvas/anchor-tabs.tsx`
- **Lote:** L07
- **Linhas:** 98
- **SHA1:** 370a523a5225d466d6b184394eb3b7c0e35628bb
- **Partes lidas:** 1-98
- **Propósito:** Desenha as quatro abas de âncora de uma seleção posicionada sobre a moldura do canvas, cada uma a porta do gesto que alterna a âncora daquela borda, afastando a aba de cima do rótulo e do chip do painel rápido.
- **Âncora:** `src/editor/canvas/anchor-tabs.tsx:21` `const SIZE = numberConstant('anchors.tabSize');`

### `src/editor/canvas/arrangement.test.ts`
- **Lote:** L07
- **Linhas:** 160
- **SHA1:** dbe03b455e0b4f6adb30bf2eb11481e764e644d4
- **Partes lidas:** 1-160
- **Propósito:** Testes da arrumação dos controles do canvas: as camadas contra os tokens de z-index das folhas, os lugares das zonas de rotação e a invariante de que nenhum controle fica sem pressão em milhares de casos semeados.
- **Âncora:** `src/editor/canvas/arrangement.test.ts:22` `describe('the layers of the canvas controls', () => {`

### `src/editor/canvas/arrangement.ts`
- **Lote:** L07
- **Linhas:** 171
- **SHA1:** e64da8e033f9da2edbccd3925d1e4d680b16e60a
- **Partes lidas:** 1-171
- **Propósito:** A regra única da arrumação dos controles do canvas: as camadas de CANVAS_LAYERS, os lugares das zonas de rotação e a decisão de quem cede a pressão quando dois controles querem o mesmo lugar.
- **Âncora:** `src/editor/canvas/arrangement.ts:56` `export const ROTATION_SIDES: readonly string[] = ['nw', 'ne', 'se', 'sw'];`

### `src/editor/canvas/band-typing.ts`
- **Lote:** L07
- **Linhas:** 30
- **SHA1:** c560474ec5d2e91dc3c0e87ec5a3a6c3b2387bf1
- **Partes lidas:** 1-30
- **Propósito:** O estado de editor do campo digitado de uma faixa de espaçamento: qual faixa o abriu, contada por abertura, com open e close e assinatura de mudança.
- **Âncora:** `src/editor/canvas/band-typing.ts:8` `let open: TypedBand | null = null;`

### `src/editor/canvas/browser-defaults.ts`
- **Lote:** L07
- **Linhas:** 43
- **SHA1:** 10218f731e51573c726b3211e967a5eeed5c4c4f
- **Partes lidas:** 1-43
- **Propósito:** Lê a largura inicial que o navegador desenha para uma linha, como a de uma borda, numa árvore sombra do documento do editor e a um zoom alto, para os campos sem declaração da página.
- **Âncora:** `src/editor/canvas/browser-defaults.ts:8` `const PROBE_ZOOM = 1000;`

### `src/editor/canvas/chip-fit.ts`
- **Lote:** L07
- **Linhas:** 87
- **SHA1:** 22f2a7685d1da80126ee28ebf89a10722e294efd
- **Partes lidas:** 1-87
- **Propósito:** Instala o juiz que manda um campo do painel rápido ocupar a linha inteira do grupo de duas colunas quando seu valor não cabe na metade, sem que o campo digitado perca o lugar sob o cursor.
- **Âncora:** `src/editor/canvas/chip-fit.ts:7` `const GROUPS = '.quick-panel__group-fields';`

### `src/editor/canvas/chrome.test.ts`
- **Lote:** L07
- **Linhas:** 72
- **SHA1:** 36386c4b44fb5996c0b9ba525d05ebe339f797cf
- **Partes lidas:** 1-72
- **Propósito:** Testes da caixa de acerto de uma alça de redimensionar: a caixa fica fora do elemento, centrada no ponto da borda, e nunca cobre a caixa de um vizinho.
- **Âncora:** `src/editor/canvas/chrome.test.ts:16` `const ELEMENT = box(0, 0, 100, 100);`

### `src/editor/canvas/chrome.tsx`
- **Lote:** L07
- **Linhas:** 1187
- **SHA1:** bf129d5916502d98e63e2f54159d8394de47a597
- **Partes lidas:** 1-631; 632-1187
- **Propósito:** O chrome do canvas: contorno e rótulo da seleção, indicador de soltura, fantasmas de arraste, flash da inserção, medição da arrumação e o desenho das alças, zonas de rotação e faixas.
- **Âncora:** `src/editor/canvas/chrome.tsx:123` `const HANDLE_KIN = 8;`

### `src/editor/canvas/computed-loop.test.tsx`
- **Lote:** L07
- **Linhas:** 32
- **SHA1:** 28ad52c861c3d58130c97f0cbb55333ad75157f7
- **Partes lidas:** 1-32
- **Propósito:** Teste da família RL1: useComputed não reinicia o laço de medição a cada render e desenha um número limitado de vezes enquanto nada muda.
- **Âncora:** `src/editor/canvas/computed-loop.test.tsx:10` `import { useComputed } from './edit-handles.tsx';`

### `src/editor/canvas/coordinates.ts`
- **Lote:** L07
- **Linhas:** 662
- **SHA1:** 5312f10fd85b0c7135cefe377e23ae6e2493c6a4
- **Partes lidas:** 1-662
- **Propósito:** A conversão única entre a página, a moldura e a tela sob zoom, e as medidas da página no canvas: caixas de nós, eixos de fluxo, base do redimensionar, valores computados e a porta de layout.
- **Âncora:** `src/editor/canvas/coordinates.ts:13` `export interface Point {`

### `src/editor/canvas/distances.ts`
- **Lote:** L07
- **Linhas:** 37
- **SHA1:** 79b7ab7f5e53ea453deeb7b1ff26335d2db3168c
- **Partes lidas:** 1-37
- **Propósito:** Calcula as distâncias que o Alt mede entre a seleção e outro elemento ou as bordas internas de um ancestral, cada uma com seu comprimento em px de CSS.
- **Âncora:** `src/editor/canvas/distances.ts:5` `export interface Distance {`

### `src/editor/canvas/edit-handles.tsx`
- **Lote:** L07
- **Linhas:** 407
- **SHA1:** 54a942dbcf9394b2db386b0e7876f71556257494
- **Partes lidas:** 1-407
- **Propósito:** Desenha as alças de um modo de edição no canvas sobre o elemento selecionado: faixas de espaçamento e de vão, canto do raio, bordas, sombra e o divisor de colunas, com os valores lidos a cada quadro.
- **Âncora:** `src/editor/canvas/edit-handles.tsx:51` `const MIN_BAND = numberConstant('spacing.minBand');`

### `src/editor/canvas/edit-mode.ts`
- **Lote:** L07
- **Linhas:** 90
- **SHA1:** 67dd3b4b881cf3fe27da0670584c004956a12f1e
- **Partes lidas:** 1-90
- **Propósito:** O modo de edição no canvas: quais modos o menu oferece, quando um modo recusa agir num elemento (modeRefusal) e o contexto de teclas do canvas enquanto um modo está aceso.
- **Âncora:** `src/editor/canvas/edit-mode.ts:25` `export const NO_MODE: EditMode = 'none';`

### `src/editor/canvas/frame.tsx`
- **Lote:** L07
- **Linhas:** 276
- **SHA1:** 4e089fd3c148c82ba0b808ffa7afafd9cbd3d516
- **Partes lidas:** 1-276
- **Propósito:** A moldura do canvas: um iframe sem scripts que só renderiza, ligado ao renderizador, aos rascunhos do texto, ao relógio da página, ao laço do playhead e à manutenção do ponto da página sob o zoom.
- **Âncora:** `src/editor/canvas/frame.tsx:32` `const PAGE = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';`

### `src/editor/canvas/grid-edit.ts`
- **Lote:** L07
- **Linhas:** 165
- **SHA1:** bb21cffd5ba2d62a1fd90b56dd46ef176165fccc
- **Partes lidas:** 1-165
- **Propósito:** O editor de grelha do canvas: entrar e sair, somar e tirar trilhos de coluna, estender o vão do item, mesclar e dividir células, por meio dos donos dos trilhos e do lugar do item.
- **Âncora:** `src/editor/canvas/grid-edit.ts:31` `export const GRID_EDIT_CONTEXT: KeyContextId = 'grid-edit';`

### `src/editor/canvas/grid-editor.tsx`
- **Lote:** L07
- **Linhas:** 112
- **SHA1:** 796bd7f32081c706161489467b652b3c77e09a8f
- **Partes lidas:** 1-112
- **Propósito:** O que o editor de grelha desenha sobre os trilhos: o número de cada coluna no seu início, a alça na fronteira entre duas colunas e a alça de vão no canto inferior direito do item selecionado.
- **Âncora:** `src/editor/canvas/grid-editor.tsx:24` `export function GridEditor() {`

### `src/editor/canvas/grid-overlay.tsx`
- **Lote:** L07
- **Linhas:** 87
- **SHA1:** a6ed66d5413b85337a94dfd68d89a77beaec8d23
- **Partes lidas:** 1-87
- **Propósito:** Desenha as grelhas de layout sobre a página: as colunas, as linhas, os pontos e as linhas de dobra, comandados pelas opções de Guides & Grids da página aberta.
- **Âncora:** `src/editor/canvas/grid-overlay.tsx:23` `export function GridOverlay() {`

### `src/editor/canvas/guides.tsx`
- **Lote:** L07
- **Linhas:** 68
- **SHA1:** e571f83f6b464f63dd51ea1c37867e3b31908acb
- **Partes lidas:** 1-68
- **Propósito:** As guias manuais sobre o canvas: uma linha por guia no lugar dela em px da página, com o valor na ponta do ruler, cada uma a porta do arraste e com foco.
- **Âncora:** `src/editor/canvas/guides.tsx:16` `const NONE: readonly never[] = [];`

### `src/editor/canvas/handles.ts`
- **Lote:** L07
- **Linhas:** 118
- **SHA1:** 47dd16def9e274885c69efbc0416bbd020006001
- **Partes lidas:** 1-118
- **Propósito:** O dono único do que a porta de uma alça de edição representa, do valor que ela arrasta, da sombra que edita e do passo das setas de uma alça focada.
- **Âncora:** `src/editor/canvas/handles.ts:90` `const KEY_STEP = numberConstant('handle.keyStep');`

### `src/editor/canvas/hover-measure.ts`
- **Lote:** L07
- **Linhas:** 31
- **SHA1:** 5499109e2379a2a0b0918205704c4b211d6b4146
- **Partes lidas:** 1-31
- **Propósito:** O código da medição de hover: o tamanho do elemento sob o ponteiro num chip sob o contorno, e, com Alt, as distâncias da seleção até ele.
- **Âncora:** `src/editor/canvas/hover-measure.ts:10` `export interface HoverSize {`

### `src/editor/canvas/layer-order.test.ts`
- **Lote:** L07
- **Linhas:** 29
- **SHA1:** 0a2ab39cbd52e2f95e4330f0f3caf79092fee7c1
- **Partes lidas:** 1-29
- **Propósito:** Teste da família CL1: declaredWidth respeita a ordem que um comando @layer declara, lendo a largura da camada posta por último.
- **Âncora:** `src/editor/canvas/layer-order.test.ts:6` `import { declaredWidth } from './coordinates.ts';`

### `src/editor/canvas/page-clock.ts`
- **Lote:** L07
- **Linhas:** 30
- **SHA1:** 7d19ddb7e29e4a5ddbb34bcdb72613dc18f698d5
- **Partes lidas:** 1-30
- **Propósito:** O relógio único da página do canvas: pageChanged sobe a versão e avisa os leitores no quadro seguinte; onPageChange registra um leitor.
- **Âncora:** `src/editor/canvas/page-clock.ts:12` `export const pageVersion = (): number => version;`

### `src/editor/canvas/placement.test.ts`
- **Lote:** L07
- **Linhas:** 114
- **SHA1:** ef8bef1d46d5ed8f611e600f377590495261a4d2
- **Partes lidas:** 1-114
- **Propósito:** Testes das regras de lugar: o lugar único do rótulo da seleção, o desvio para longe das abas dos breakpoints, os lugares de um rótulo de soltura e a moldura virada.
- **Âncora:** `src/editor/canvas/placement.test.ts:10` `const CANVAS = box(0, 0, 1000, 1000);`

### `src/editor/canvas/placement.ts`
- **Lote:** L07
- **Linhas:** 239
- **SHA1:** 61b7dc042ae5bd127146d508441a9a9d3838dd63
- **Partes lidas:** 1-239
- **Propósito:** As regras puras de onde o chrome desenha: o lugar único do rótulo da seleção, o desvio do grupo quando ele cair sobre as abas, os lugares de um rótulo de soltura e a caixa de acerto da alça.
- **Âncora:** `src/editor/canvas/placement.ts:27` `export type Placement = 'above' | 'inside' | 'below';`

### `src/editor/canvas/quick-panel.tsx`
- **Lote:** L07
- **Linhas:** 552
- **SHA1:** 4a61cf46e826a8d8427b38a078d4260b4075ff32
- **Partes lidas:** 1-552
- **Propósito:** O painel rápido sobre o canvas: o chip que o abre, os campos das portas da região, as ações da barra, o menu de valores do modo de edição e o lugar do painel medido a cada quadro.
- **Âncora:** `src/editor/canvas/quick-panel.tsx:37` `const REGION = 'quick-panel';`

### `src/editor/canvas/render/captured.ts`
- **Lote:** L07
- **Linhas:** 143
- **SHA1:** 3b0752c3ee59497677b49c808a942c4aab4db75e
- **Partes lidas:** 1-143
- **Propósito:** O renderizador de uma página capturada: monta a árvore capturada no documento alvo, resolvendo endereços para os arquivos do projeto e devolvendo o estado dos campos depois do layout.
- **Âncora:** `src/editor/canvas/render/captured.ts:8` `const HTML = 'http://www.w3.org/1999/xhtml';`

### `src/editor/canvas/render/file-bytes.test.ts`
- **Lote:** L07
- **Linhas:** 38
- **SHA1:** 073237b995e8f8977e00604e5299861df6ebaf54
- **Partes lidas:** 1-38
- **Propósito:** Teste da família RN1: novos bytes de um arquivo alcançam os elementos que o desenham, com a imagem redesenhada pelo novo URL de objeto.
- **Âncora:** `src/editor/canvas/render/file-bytes.test.ts:14` `const model = renderModelFromManifest(manifest.elements, manifest.properties, manifest.interactions);`

### `src/editor/canvas/render/inline.ts`
- **Lote:** L07
- **Linhas:** 61
- **SHA1:** d74693f7b80c5215a35c7952f67554457dfa050d
- **Partes lidas:** 1-61
- **Propósito:** Lê o que o DOM de um contenteditable diz sobre as partes de um texto editado: os nós de texto e os <br>, as marcas ao redor de cada um e a quebra final que o navegador guarda.
- **Âncora:** `src/editor/canvas/render/inline.ts:10` `export const ELEMENT_NODE = 1;`

### `src/editor/canvas/render/render.test.ts`
- **Lote:** L07
- **Linhas:** 392
- **SHA1:** 5ac6ec7536cdaa27445528e4eeb4c5a2b3f7664b
- **Partes lidas:** 1-392
- **Propósito:** Testes do renderizador: a construção da página, cada tipo de patch deixando a página igual a uma montagem nova e mantendo os elementos não substituídos, e a edição de texto em linha.
- **Âncora:** `src/editor/canvas/render/render.test.ts:43` `const must = <T,>(value: T | null | undefined): T => {`

### `src/editor/canvas/render/render.ts`
- **Lote:** L07
- **Linhas:** 887
- **SHA1:** ce51a1e54591d2982a1716ae465d64fa587a021c
- **Partes lidas:** 1-736; 737-887
- **Propósito:** O renderizador, o único escritor do HTML e do CSS da página a partir do documento: monta a página no documento dado e aplica cada patch sem reconstruí-la, com a edição de texto em linha e as folhas só do editor.
- **Âncora:** `src/editor/canvas/render/render.ts:64` `export const NODE_ATTRIBUTE = 'data-node';`

### `src/editor/canvas/reveal-selection.test.tsx`
- **Lote:** L07
- **Linhas:** 99
- **SHA1:** 4092e9e78c742d69d1f0d513294e73f3cb0ff5f4
- **Partes lidas:** 1-99
- **Propósito:** Testes do RevealSelection sobre a store do editor: a seleção feita fora da tela move o canvas, uma linha das Camadas não o move e a seleção feita durante um arraste é decidida no fim dele.
- **Âncora:** `src/editor/canvas/reveal-selection.test.tsx:35` `const idOf = (store: EditorStore, name: string): string => {`

### `src/editor/canvas/reveal-selection.tsx`
- **Lote:** L07
- **Linhas:** 91
- **SHA1:** 2fdf3a98429777bc50d4e5b476963eb575250535
- **Partes lidas:** 1-91
- **Propósito:** Traz à vista a seleção feita fora do canvas: quando o primeiro elemento da seleção muda e nenhuma parte dele está na vista, o canvas se move pelo mínimo que o mostra.
- **Âncora:** `src/editor/canvas/reveal-selection.tsx:20` `import { travelInto } from './reveal.ts';`

### `src/editor/canvas/reveal.test.ts`
- **Lote:** L07
- **Linhas:** 19
- **SHA1:** 27013460f821a0743470f61247f53da7c18f87ba
- **Partes lidas:** 1-19
- **Propósito:** Testes de travelInto: uma caixa com parte na vista fica onde está; uma caixa fora entra pela borda da vista, e uma mais alta que a vista mostra o próprio início.
- **Âncora:** `src/editor/canvas/reveal.test.ts:2` `import { travelInto } from './reveal.ts';`

### `src/editor/canvas/reveal.ts`
- **Lote:** L07
- **Linhas:** 9
- **SHA1:** d97b0cced4336be4c62ad434ce18e87da3fdbc36
- **Partes lidas:** 1-9
- **Propósito:** A função travelInto: o menor percurso num eixo que traz uma caixa para dentro de uma vista, com a borda a um inset da borda da vista.
- **Âncora:** `src/editor/canvas/reveal.ts:5` `export function travelInto(from: number, to: number, low: number, high: number, inset: number): number {`

### `src/editor/canvas/rulers.test.ts`
- **Lote:** L07
- **Linhas:** 26
- **SHA1:** 7cf64bb2126ac2fc1b65b82a143889783d3329d4
- **Partes lidas:** 1-26
- **Propósito:** Testes de rulerSteps: os rótulos caem em valores redondos com o afastamento mínimo e os traços dividem o passo do rótulo em todos os zooms de 10 por cento a 800 por cento.
- **Âncora:** `src/editor/canvas/rulers.test.ts:3` `import { rulerSteps } from './rulers.ts';`

### `src/editor/canvas/rulers.ts`
- **Lote:** L07
- **Linhas:** 72
- **SHA1:** 2018cb2badbcb54c44c35f92789d1a10571ffb0f
- **Partes lidas:** 1-72
- **Propósito:** As marcas dos rulers: o passo dos rótulos e o dos traços por zoom (rulerSteps) e o lugar de cada marca em cada faixa (rulerMarks).
- **Âncora:** `src/editor/canvas/rulers.ts:14` `const STEPS = constant('rulers.steps') as readonly number[];`

### `src/editor/canvas/rulers.tsx`
- **Lote:** L07
- **Linhas:** 89
- **SHA1:** 0bdcea5abb379e844a17e202677b2df0420c3a76
- **Partes lidas:** 1-89
- **Propósito:** Os rulers do canvas: as faixas de cima e da esquerda desenhando as marcas que rulers.ts calcula, com a extensão da seleção e a marca do ponteiro.
- **Âncora:** `src/editor/canvas/rulers.tsx:39` `export function Rulers() {`

### `src/editor/canvas/screenshot.ts`
- **Lote:** L07
- **Linhas:** 48
- **SHA1:** 2eb50fe5f975bb00746d668b275d4943104b474f
- **Partes lidas:** 1-48
- **Propósito:** Captura a página do canvas como PNG por meio da biblioteca html-to-image, conferindo as fontes, a decodificação das imagens e os limites de tamanho.
- **Âncora:** `src/editor/canvas/screenshot.ts:4` `import { canvasDocument, canvasFrame } from './coordinates.ts';`

### `src/editor/canvas/side-frame.tsx`
- **Lote:** L07
- **Linhas:** 86
- **SHA1:** c0931feb9895a4fdbcd36f71067d9b172e387144
- **Partes lidas:** 1-86
- **Propósito:** Uma moldura lateral de outro breakpoint do projeto, com renderizador próprio que segue o documento e desenha o contorno da seleção.
- **Âncora:** `src/editor/canvas/side-frame.tsx:19` `const PAGE = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';`

### `src/editor/canvas/snap-lines.tsx`
- **Lote:** L07
- **Linhas:** 107
- **SHA1:** f1485f4b634732743fcb90402ac7f5804ee214fb
- **Partes lidas:** 1-107
- **Propósito:** As linhas de encaixe desenhadas sobre a página: por eixo, a linha do lugar encaixado, o contorno do alvo e a marca de cada vão igual.
- **Âncora:** `src/editor/canvas/snap-lines.tsx:13` `interface Drawn {`

### `src/editor/canvas/snapping.ts`
- **Lote:** L07
- **Linhas:** 179
- **SHA1:** 3c6875b4ab3ca5446c90bfbace2f8f9da0b9dd3b
- **Partes lidas:** 1-179
- **Propósito:** O encaixe do canvas: reúne as linhas dos alvos habilitados e calcula o encaixe de um arraste livre (snapMove) ou das bordas de um redimensionar (snapResize), publicando o que o chrome desenha.
- **Âncora:** `src/editor/canvas/snapping.ts:34` `const EQUAL_RADIUS = numberConstant('snap.equalSpacingRadius');`

### `src/editor/canvas/text-edit.test.ts`
- **Lote:** L07
- **Linhas:** 235
- **SHA1:** 12da9fb6d3f756013b492fd0af7676e6b3286b8a
- **Partes lidas:** 1-235
- **Propósito:** Testes da edição de texto em linha sobre a store do editor: início e fim da edição, quebra de linha, marcas, prompt de link, colagem e os argumentos que editArgs monta.
- **Âncora:** `src/editor/canvas/text-edit.test.ts:14` `const AURORA = fixture as DocumentJson;`

### `src/editor/canvas/text-edit.ts`
- **Lote:** L07
- **Linhas:** 230
- **SHA1:** 6b31fb55a7f28c5bf6d6044f94e95abaa9fd4a80
- **Partes lidas:** 1-230
- **Propósito:** A edição de texto em linha: início, cancelamento e quebra de linha, as mudanças de marcas, o prompt de link e a colagem, e a leitura do que o elemento editado contém.
- **Âncora:** `src/editor/canvas/text-edit.ts:52` `export const TEXT_EDITING: KeyContextId = 'text-editing';`

### `src/editor/canvas/text-toolbar.tsx`
- **Lote:** L07
- **Linhas:** 87
- **SHA1:** ab49084d339d1398503a58c5669632d6de61262b
- **Partes lidas:** 1-87
- **Propósito:** A barra do texto editado em linha: as portas da região text-toolbar e o painel do prompt de link desenhado sob ela, sobre a janela toda.
- **Âncora:** `src/editor/canvas/text-toolbar.tsx:23` `const DOORS = doorSlots(TEXT_TOOLBAR);`

### `src/editor/canvas/view-overlays.tsx`
- **Lote:** L07
- **Linhas:** 98
- **SHA1:** bdf4d9668045a6e10dd8efe0ae1464ab9c9b6f15
- **Partes lidas:** 1-98
- **Propósito:** O que os interruptores de vista desenham sobre a página: o contorno de cada elemento, as faixas de preenchimento de cada contêiner e a caixa de um contêiner vazio.
- **Âncora:** `src/editor/canvas/view-overlays.tsx:46` `export function ViewOverlays() {`

### `src/editor/capture/selection.ts`
- **Lote:** L06
- **Linhas:** 12
- **SHA1:** 7e72405b808af4a038c4fd29d4114b07c31aef62
- **Partes lidas:** 1-12
- **Propósito:** Seleciona um nó capturado na interface do editor, guardando o id em capturedNode e limpando a seleção dos elementos.
- **Âncora:** `src/editor/capture/selection.ts:7` `export const selectCapturedCommand = registerHandler<'capture.select', EditorUi>('capture.select', ({ state }, { target }) => {`

### `src/editor/checks/fix.ts`
- **Lote:** L06
- **Linhas:** 40
- **SHA1:** 2d92818d616bdc6bb941aba418d5ea6642d84f55
- **Partes lidas:** 1-40
- **Propósito:** Executa a correção automática de uma verificação de acessibilidade sobre o elemento do problema, por inserção, troca de nível ou revelação do campo.
- **Âncora:** `src/editor/checks/fix.ts:21` `export const fixCheck = registerHandler<'checks.applyFix', EditorUi>('checks.applyFix', (context, { target, rule }): Outcome<EditorUi> => {`

### `src/editor/clipboard.ts`
- **Lote:** L05b
- **Linhas:** 96
- **SHA1:** 92be9981d31a78d470be6f1aefbc24e9f764e8ff
- **Partes lidas:** 1-96
- **Propósito:** Leitor único da área de transferência do sistema e guarda da cópia própria do editor, entregando o que a área de transferência tem (árvore HTML, texto ou recusa) ao comando que a consome e escrevendo o que o editor copia.
- **Âncora:** `src/editor/clipboard.ts:14` `const ELEMENT_NODE = 1;`

### `src/editor/code-panel/apply-generated-classes.test.ts`
- **Lote:** L06
- **Linhas:** 32
- **SHA1:** 3d45e6805a369e060bdcd6e6a302532395ca2e35
- **Partes lidas:** 1-32
- **Propósito:** Verifica que a marcação mostrada pelo painel de código volta a ser aplicada sem a classe que a exportação inventa.
- **Âncora:** `src/editor/code-panel/apply-generated-classes.test.ts:19` `describe('the code pane writes back no class the export invented (CP2)', () => {`

### `src/editor/code-panel/code-panel.ts`
- **Lote:** L06
- **Linhas:** 164
- **SHA1:** a3f695428b6b5352f3e616cdd664ca02b41b8c63
- **Partes lidas:** 1-164
- **Propósito:** Dá o texto de cada arquivo mostrado no painel de código (gerado pela exportação ou guardado no projeto) e as portas de copiar e baixar.
- **Âncora:** `src/editor/code-panel/code-panel.ts:20` `export function paneText(path: string, document: DocumentJson, rules: ModelRules): string | null {`

### `src/editor/code-panel/highlight.ts`
- **Lote:** L06
- **Linhas:** 107
- **SHA1:** 28abd65c20af10e4a704ade26d6b3fb49ad7e7e3
- **Partes lidas:** 1-107
- **Propósito:** Divide uma linha de HTML, CSS ou JavaScript nos tokens que o painel de código pinta, por tipo de código.
- **Âncora:** `src/editor/code-panel/highlight.ts:103` `export function highlight(line: string, kind: PaneKind): readonly Token[] {`

### `src/editor/command-bar/command-bar.test.ts`
- **Lote:** L05b
- **Linhas:** 104
- **SHA1:** a23d70490750d941020c574365cbae7025ea9c50
- **Partes lidas:** 1-104
- **Propósito:** Testes da consulta da barra de comandos: pontuação de casamento, trechos marcados, agrupamento, escopo, entradas mostradas e os outros nomes de uma entrada de inserção.
- **Âncora:** `src/editor/command-bar/command-bar.test.ts:4` `import { describe, expect, it } from 'vitest';`

### `src/editor/command-bar/command-bar.ts`
- **Lote:** L05b
- **Linhas:** 253
- **SHA1:** b3a0cf17a97b0c1b175b0eba5d8678d940b9d237
- **Partes lidas:** 1-253
- **Propósito:** Barra de comandos: monta as entradas a partir das portas do manifesto, pontua e filtra a consulta, agrupa por tipo, oferece propriedades do manifesto e memoriza as entradas usadas por último.
- **Âncora:** `src/editor/command-bar/command-bar.ts:23` `export const MAX_RESULTS = constant('commandBar.maxResults');`

### `src/editor/css-support.ts`
- **Lote:** L05b
- **Linhas:** 7
- **SHA1:** daacbe14bdae5eaed121f09ac3edda3a5efa2345
- **Partes lidas:** 1-7
- **Propósito:** Lado do navegador da porta de suporte a CSS, respondendo com CSS.supports se um valor significa algo para uma propriedade.
- **Âncora:** `src/editor/css-support.ts:5` `export const browserCss: CssSupport = {`

### `src/editor/data/content.test.ts`
- **Lote:** L06
- **Linhas:** 374
- **SHA1:** 32c42ef281f64614d43d4a38d44395b9bf9bf4d2
- **Partes lidas:** 1-374
- **Propósito:** Exercita os comandos de conteúdo sobre a store do editor: importação de dados, vínculos de campos, páginas a partir de páginas e regiões compartilhadas, com undo e redo.
- **Âncora:** `src/editor/data/content.test.ts:44` `describe("jornada03 C4: Carla's cardapio.csv fills her card", () => {`

### `src/editor/data/controls.tsx`
- **Lote:** L06
- **Linhas:** 145
- **SHA1:** 92893d9b9237506489dcde791b52e03833dfdd74
- **Partes lidas:** 1-145
- **Propósito:** Desenha os controles do painel de Dados como portas do manifesto: campos, menus e formulários que despacham o comando da porta com os argumentos do lugar e do valor.
- **Âncora:** `src/editor/data/controls.tsx:17` `export function doorOf(region: RegionId, control: string): DoorEntry {`

### `src/editor/data/grid.tsx`
- **Lote:** L06
- **Linhas:** 163
- **SHA1:** b66b0ddf288503379805ccc11a64888e561c7123
- **Partes lidas:** 1-163
- **Propósito:** Desenha a coleção do painel de Dados: nome, campos, barra de consulta e a grade de itens, cada célula um campo.
- **Âncora:** `src/editor/data/grid.tsx:151` `export function CollectionView({ collection, query }: { readonly collection: Collection; readonly query: Query }): ReactNode {`

### `src/editor/data/mapping.tsx`
- **Lote:** L06
- **Linhas:** 151
- **SHA1:** 27df7f2d58eb8e79334b65214bc446719c2889ed
- **Partes lidas:** 1-151
- **Propósito:** Desenha o Conectar campos: as partes do elemento a repetir que mostram um valor, as colunas arrastáveis, a prévia dos primeiros itens e o Fill.
- **Âncora:** `src/editor/data/mapping.tsx:53` `export function MappingView({ collection, query, selected }: { readonly collection: Collection; readonly query: Query; readonly selected: NodeId | null }): ReactNode {`

### `src/editor/data/pages.tsx`
- **Lote:** L06
- **Linhas:** 100
- **SHA1:** fde069c94b05335cb04f8eda31e42a0211148ca3
- **Partes lidas:** 1-100
- **Propósito:** Desenha as vistas de páginas a partir de uma página e de regiões compartilhadas, com os formulários de nomes, de partilha e os botões de desanexar e parar de compartilhar.
- **Âncora:** `src/editor/data/pages.tsx:23` `export function PagesView({ page, collection }: { readonly page: Page; readonly collection: Collection | undefined }): ReactNode {`

### `src/editor/data/panel.css`
- **Lote:** L06
- **Linhas:** 262
- **SHA1:** 69a0d0cdd2fc7e3bc2a17fca93066f8ea02f7a45
- **Partes lidas:** 1-262
- **Propósito:** Estiliza o painel de Dados: seções, campos, menus, tabelas com rolagem lateral e as listas de regiões compartilhadas.
- **Âncora:** `src/editor/data/panel.css:100` `.data-grid {`

### `src/editor/data/panel.test.tsx`
- **Lote:** L06
- **Linhas:** 135
- **SHA1:** bfb0560b552dac1f9ce9d3ac8bd2d92981cbfd31
- **Partes lidas:** 1-135
- **Propósito:** Desenha o painel de Dados em happy-dom e verifica as portas de cada controle, os argumentos do lugar e as submissões de célula, menu e formulário.
- **Âncora:** `src/editor/data/panel.test.tsx:49` `describe('the Data panel', () => {`

### `src/editor/data/panel.tsx`
- **Lote:** L06
- **Linhas:** 92
- **SHA1:** 87654ab9511c104594321f47960dcab6c97cff92
- **Partes lidas:** 1-92
- **Propósito:** Compõe o painel de Dados na barra lateral: importação, coleções, vínculos, páginas e regiões, tudo lido do documento e da interface do editor.
- **Âncora:** `src/editor/data/panel.tsx:41` `export function DataPanel(): ReactNode {`

### `src/editor/data/preview.tsx`
- **Lote:** L06
- **Linhas:** 98
- **SHA1:** 479337ccc5dd6167b8fbebaf65b10ff4819b1611
- **Partes lidas:** 1-98
- **Propósito:** Desenha a prévia do arquivo de dados em importação: folhas, colunas com o tipo de cada uma, primeiras linhas e os destinos dos itens.
- **Âncora:** `src/editor/data/preview.tsx:25` `export function PreviewView({ preview, into }: { readonly preview: DataPreview; readonly into: Collection | undefined }): ReactNode {`

### `src/editor/data/read-file.ts`
- **Lote:** L06
- **Linhas:** 25
- **SHA1:** 78eb4a1e06786743a8fa7b7e2375424343636031
- **Partes lidas:** 1-25
- **Propósito:** Lê um arquivo de dados escolhido pela pessoa com o DOMParser do navegador e entrega as folhas ao comando de prévia como JSON.
- **Âncora:** `src/editor/data/read-file.ts:9` `export const domXml: XmlReader = (source) => {`

### `src/editor/data/state.ts`
- **Lote:** L06
- **Linhas:** 246
- **SHA1:** ab9c0ade3569b1530b6cc8bc6537513e7618fc3b
- **Partes lidas:** 1-246
- **Propósito:** Guarda o estado do painel de Dados (coleção mostrada, consulta e prévia) e os comandos que o alteram, incluindo os dois modos de importação.
- **Âncora:** `src/editor/data/state.ts:17` `export interface DataPreview {`

### `src/editor/doors/current.ts`
- **Lote:** L05b
- **Linhas:** 24
- **SHA1:** ea120151ccbaaa7d385f4db160e5eaaf392f6674
- **Partes lidas:** 1-24
- **Propósito:** Leitura do estado de uma porta: os parâmetros do rótulo e se a porta está marcada como corrente, a partir do tratador registrado e do estado do editor.
- **Âncora:** `src/editor/doors/current.ts:13` `export function labelParamsOf(entry: DoorEntry, state: EditorState): Readonly<Record<string, string>> {`

### `src/editor/doors/door.test.tsx`
- **Lote:** L05b
- **Linhas:** 56
- **SHA1:** 22bda98730ebec1a754ca757d913ab9abedabcbf
- **Partes lidas:** 1-56
- **Propósito:** Testes da regra de desenho das portas: porta de comando construído de recurso registrado desenha um controle pressionável e porta de recurso não registrado desenha desabilitada dizendo que ainda não está disponível.
- **Âncora:** `src/editor/doors/door.test.tsx:6` `import { describe, expect, it } from 'vitest';`

### `src/editor/doors/door.tsx`
- **Lote:** L05b
- **Linhas:** 328
- **SHA1:** 6c3f2c33338c9379435c78cbab3fce7bb52fad75
- **Partes lidas:** 1-328
- **Propósito:** Desenho de uma porta do manifesto como o controle que drawnAs nomeia, com ícone, rótulo, atalho e estado indisponível, reunindo também os seletores de arquivo, de arquivos e de pasta que uma porta que lê arquivos usa.
- **Âncora:** `src/editor/doors/door.tsx:38` `export function isDoorBuilt(entry: DoorEntry): boolean {`

### `src/editor/doors/menu-groups.test.ts`
- **Lote:** L05b
- **Linhas:** 64
- **SHA1:** b0e15a6b17f64bc8331191b0653b8b1255ec127f
- **Partes lidas:** 1-64
- **Propósito:** Testes dos grupos dos menus: grupo único dos painéis no menu Ver, limite de itens por grupo, ícones não repetidos entre comandos de um mesmo menu e a vista de Código como escolha marcada.
- **Âncora:** `src/editor/doors/menu-groups.test.ts:7` `import { describe, expect, it } from 'vitest';`

### `src/editor/doors/menu.tsx`
- **Lote:** L05b
- **Linhas:** 337
- **SHA1:** bbd44b6aaf871253378d60bd985c6c55ccfb4d52
- **Partes lidas:** 1-337
- **Propósito:** Menus da aplicação: itens a partir das portas e submenus colocados, colocação flutuante com rolagem, menu de contexto aberto por comando e fechamento por camada externa e contagem de descartes.
- **Âncora:** `src/editor/doors/menu.tsx:95` `function MenuList({ menu, onDone, focusFirst, anchor, beside }: MenuListProps) {`

### `src/editor/doors/placement.ts`
- **Lote:** L05b
- **Linhas:** 56
- **SHA1:** b20888871d0029db9419db739a23092d7f6e1f11
- **Partes lidas:** 1-56
- **Propósito:** Colocação das portas: junta as portas e os botões de menu de uma região na ordem do manifesto, com separadores, desenho de cada controle e os glifos.
- **Âncora:** `src/editor/doors/placement.ts:13` `const cache = new Map<string, readonly Slot[]>();`

### `src/editor/download.ts`
- **Lote:** L05b
- **Linhas:** 15
- **SHA1:** 353be63e790b37d044ad0bc9cb1c1189d96f298c
- **Partes lidas:** 1-15
- **Propósito:** Lado do navegador da porta de download: salva o arquivo que um comando entrega por um link clicado uma vez.
- **Âncora:** `src/editor/download.ts:5` `export const browserDownloads: Downloads = {`

### `src/editor/drag/drag-session.test.ts`
- **Lote:** L05b
- **Linhas:** 126
- **SHA1:** dc2b9c897f6165b9aaa4b450176d7b3a58c53a4e
- **Partes lidas:** 1-126
- **Propósito:** Testes da sessão de arraste: a escada de um arraste vivo, as teclas de nível e o Escape, com a proposta desenhada e sem passos de undo.
- **Âncora:** `src/editor/drag/drag-session.test.ts:41` `afterEach(() => liveDrag.end());`

### `src/editor/drag/drag-session.ts`
- **Lote:** L05b
- **Linhas:** 128
- **SHA1:** c1d79950a1376a4f0797f0b54db73de96d693e03
- **Partes lidas:** 1-128
- **Propósito:** Sessão de arraste: guarda o arraste vivo e o nível fixado pelas teclas, monta a escada de propostas e trata drag.levelUp, drag.levelDown e drag.cancel.
- **Âncora:** `src/editor/drag/drag-session.ts:42` `let live: LiveDrag | null = null;`

### `src/editor/drag/drop.test.ts`
- **Lote:** L05b
- **Linhas:** 139
- **SHA1:** 1e3166419e7b5b9ff1dccbf8fa95fff3256e0ae5
- **Partes lidas:** 1-139
- **Propósito:** Testes da proposta de solta em caixas medidas dadas à mão: divisão de folhas, bandas de contêiner, escada de escape, alvos pequenos e o encaixe em duas dimensões.
- **Âncora:** `src/editor/drag/drop.test.ts:22` `const CONTAINERS = new Set(['page', 'section', 'div', 'article']);`

### `src/editor/drag/drop.ts`
- **Lote:** L05b
- **Linhas:** 377
- **SHA1:** 135193679f88c9fab011a2ef5db227b0be4a910a
- **Partes lidas:** 1-377
- **Propósito:** Proposta de solta de um arraste no canvas: alvo, colocação e índice a partir das caixas na tela e do fluxo dos pais, mais a oferta de lado e a regra de solta nas linhas de Camadas.
- **Âncora:** `src/editor/drag/drop.ts:116` `export const DROP_ZONES: DropZones = {`

### `src/editor/errors.ts`
- **Lote:** L05b
- **Linhas:** 17
- **SHA1:** fce8085f7184b7b3e370c760f541529e258ef338
- **Partes lidas:** 1-17
- **Propósito:** Instala o alimentador de incidentes que captura erros da janela e promessas rejeitadas sem tratador.
- **Âncora:** `src/editor/errors.ts:6` `export function installErrorFeed(target: Window = window): void {`

### `src/editor/explorer/explorer.test.ts`
- **Lote:** L06
- **Linhas:** 48
- **SHA1:** a101889aac200688699a7559532e00265ccf864b
- **Partes lidas:** 1-48
- **Propósito:** Verifica que a árvore do Explorador lista o que a exportação escreve, com os scripts gerados conferidos em todos os fixtures.
- **Âncora:** `src/editor/explorer/explorer.test.ts:15` `describe('the Explorer tree lists what the export writes', () => {`

### `src/editor/explorer/explorer.ts`
- **Lote:** L06
- **Linhas:** 167
- **SHA1:** 67f21b43106db614b7f0ad0fa464b2f63e8d1d30
- **Partes lidas:** 1-167
- **Propósito:** Lista os arquivos do Explorador (gerados e guardados) em linhas e árvore, e a porta files.open que abre um deles no painel de código.
- **Âncora:** `src/editor/explorer/explorer.ts:37` `export function kindOf(path: string, type = ''): FileKind {`

### `src/editor/explorer/file-tab-current.test.ts`
- **Lote:** L06
- **Linhas:** 26
- **SHA1:** fc21b9b35224446aa9bcc294b663ba51c61fbdad
- **Partes lidas:** 1-26
- **Propósito:** Verifica que a aba de um arquivo de código, e o seu botão de fechar, ficam atuais só enquanto o arquivo mostra, na vista de código e no split.
- **Âncora:** `src/editor/explorer/file-tab-current.test.ts:12` `describe('a code file tab is current while its file shows (FT1)', () => {`

### `src/editor/explorer/file-tabs.ts`
- **Lote:** L06
- **Linhas:** 55
- **SHA1:** aafcb36e46ce8ca52e6e3589e2d78e6cb49ed28d
- **Partes lidas:** 1-55
- **Propósito:** Guarda os arquivos de código abertos e o ativo no painel de código, com abrir, fechar e a regra que decide qual aba mostra.
- **Âncora:** `src/editor/explorer/file-tabs.ts:16` `export const codeTabs = (ui: EditorUi): CodeTabsState | null => ui.code ?? null;`

### `src/editor/focus/focus.ts`
- **Lote:** L05b
- **Linhas:** 255
- **SHA1:** daf9d6ac15a9b7c2065032a9b1389b0954a8e85c
- **Partes lidas:** 1-255
- **Propósito:** Foco do teclado: os comandos focus.* registram o pedido no estado e o instalador o executa sobre o foco do documento, movendo entre itens e regiões (F6), a barra de menus e o combobox.
- **Âncora:** `src/editor/focus/focus.ts:20` `export const INITIAL_FOCUS: FocusState = { request: null };`

### `src/editor/forms/inspector.tsx`
- **Lote:** L06
- **Linhas:** 145
- **SHA1:** d9dcf4970eeb9c4941b2487357d3e6d852a26d0b
- **Partes lidas:** 1-145
- **Propósito:** Desenha as configurações de formulário e de campo no inspector, ligando cada controle às portas do manifesto e ao comando de atributo.
- **Âncora:** `src/editor/forms/inspector.tsx:102` `export function FormsInspector({ node }: { readonly node: DocNode }): ReactNode {`

### `src/editor/forms/integration.test.ts`
- **Lote:** L06
- **Linhas:** 62
- **SHA1:** 14a2a92dc0fdbf25c62590e9458e304b79e021e5
- **Partes lidas:** 1-62
- **Propósito:** Verifica a integração dos formulários com o documento, o histórico e a exportação: máscaras de texto, configuração malformada e um passo de undo.
- **Âncora:** `src/editor/forms/integration.test.ts:14` `describe('forms integrated with the document, history and output owners', () => {`

### `src/editor/forms/runtime.test.ts`
- **Lote:** L06
- **Linhas:** 195
- **SHA1:** 2bf63744b8b3032d6c844696d223910e83666ef8
- **Partes lidas:** 1-195
- **Propósito:** Exercita o runtime dos formulários sobre controles DOM reais: máscara, validação, submissão por fetch, honeypot, endereço postal e composição de texto.
- **Âncora:** `src/editor/forms/runtime.test.ts:37` `describe('forms runtime on real DOM controls', () => {`

### `src/editor/forms/runtime.ts`
- **Lote:** L06
- **Linhas:** 381
- **SHA1:** 91685f7f5552dc2680bdfa96aa4f152c6f6e576e
- **Partes lidas:** 1-381
- **Propósito:** Instala o runtime dos formulários na página exportada e na prévia: máscaras, validação com mensagens, submissão por fetch e desmontagem que devolve a página ao estado anterior.
- **Âncora:** `src/editor/forms/runtime.ts:5` `export function installFormsRuntime(target: Document, engine: FormsEngine, defaults: Readonly<Record<string, Partial<Record<RuleCode, string>>>> = {}): () => void {`

### `src/editor/forms/script.ts`
- **Lote:** L06
- **Linhas:** 9
- **SHA1:** 61d96294c09b81199f068c84e1d80047b3ee353c
- **Partes lidas:** 1-9
- **Propósito:** Monta as mensagens de validação por idioma para o script de formulários e reúne as portas de scripts do site.
- **Âncora:** `src/editor/forms/script.ts:9` `export const siteScripts: SiteScripts = { forms: () => formsRuntimeSource(messages), motion: motionScript, lottie: lottieScript };`

### `src/editor/forms/settings.tsx`
- **Lote:** L06
- **Linhas:** 181
- **SHA1:** 1a1568173f0c2dab91d416c7f5669d14a42e5f92
- **Partes lidas:** 1-181
- **Propósito:** Desenha os campos das configurações de formulário e de campo como controles ligados às portas, cobrindo máscaras, regras de validação e mensagens.
- **Âncora:** `src/editor/forms/settings.tsx:33` `export function FieldFormSettings({ config, onChange: commit, ports, maskAllowed = true, rules: applies }: {`

### `src/editor/host-testing.ts`
- **Lote:** L05b
- **Linhas:** 11
- **SHA1:** e25b51486eb293deae501d1763fa16028f3328bb
- **Partes lidas:** 1-11
- **Propósito:** Superfície de teste dos módulos removíveis: reexporta a store do editor e os dublês das portas do núcleo que os testes podem usar.
- **Âncora:** `src/editor/host-testing.ts:3` `export { createEditorStore } from './store.ts';`

### `src/editor/host.ts`
- **Lote:** L05b
- **Linhas:** 45
- **SHA1:** c368d494642fbd5bed4fad34062111c2dbae395e
- **Partes lidas:** 1-45
- **Propósito:** API do hospedeiro dos módulos removíveis: reúne em um arquivo o que um módulo sob src/modules pode importar do editor, do núcleo do documento, do manifesto e das listas geradas.
- **Âncora:** `src/editor/host.ts:8` `export { message, registerHandler, registerPredicate } from '../core/commands/registry.ts';`

### `src/editor/import/capture.test.ts`
- **Lote:** L06
- **Linhas:** 17
- **SHA1:** 28939e846a11922ff727f0a78f60a5c5547d98be
- **Partes lidas:** 1-17
- **Propósito:** Verifica que captureAddress lê um host simples como https e a máquina local como http, e devolve nenhum para o que não é endereço web.
- **Âncora:** `src/editor/import/capture.test.ts:5` `describe('a web address to capture', () => {`

### `src/editor/import/capture.ts`
- **Lote:** L06
- **Linhas:** 107
- **SHA1:** 1b83ffabe10b3212caee5a3ab9b09f4ede9532f1
- **Partes lidas:** 1-107
- **Propósito:** Abre um endereço web: valida a URL digitada, pede a captura ao Companion local e importa os arquivos devolvidos como se tivessem sido escolhidos.
- **Âncora:** `src/editor/import/capture.ts:34` `export function captureAddress(typed: string): string | null {`

### `src/editor/import/html-import.ts`
- **Lote:** L06
- **Linhas:** 20
- **SHA1:** e47805ad17c388255ffb428892ce803851c55dab
- **Partes lidas:** 1-20
- **Propósito:** Embrulha o comando de importar HTML para escolher o destino num diálogo, mantendo os bytes dos arquivos uma vez no estado do editor.
- **Âncora:** `src/editor/import/html-import.ts:6` `export function choosingImport(owner: RegisteredHandler<'project.importHtml', EditorUi>): RegisteredHandler<'project.importHtml', EditorUi> {`

### `src/editor/input/drafts.ts`
- **Lote:** L05a
- **Linhas:** 29
- **SHA1:** 4475661381b31d27fc6f95236582e05716bda0c4
- **Partes lidas:** 1-29
- **Propósito:** marca no elemento do campo se ele guarda digitação ainda não confirmada, lê o estado do rascunho do nó e registra a digitação nativa desfazer/refazer do campo.
- **Âncora:** `src/editor/input/drafts.ts:11` `export function markFieldKept(field: DraftField, value: string): void {`

### `src/editor/input/drop-proposals.ts`
- **Lote:** L05a
- **Linhas:** 107
- **SHA1:** 415d17b53a8b57c3a30b88eccfc238f6aa682bd3
- **Partes lidas:** 1-107
- **Propósito:** mede no canvas onde um soltar cairia: a proposta do ponteiro, o lugar aceito mais próximo quando há recusa, a coluna do Layers sob o ponteiro e a oferta de lado.
- **Âncora:** `src/editor/input/drop-proposals.ts:26` `export function proposalAt(document: DocumentJson, dragged: readonly NodeId[], at: Point): DropProposal | null {`

### `src/editor/input/file-drop-navigation.test.ts`
- **Lote:** L05a
- **Linhas:** 27
- **SHA1:** 7936fe30f0ca774d67d864b6482512298b4b97c6
- **Partes lidas:** 1-27
- **Propósito:** prova que um arquivo arrastado e solto onde nada o recebe é recusado, com o padrão do navegador impedido.
- **Âncora:** `src/editor/input/file-drop-navigation.test.ts:18` `const stop = installOsFileDrop({ getState: () => ({ document: { pages: [] } }) } as unknown as EditorStore, window, false);`

### `src/editor/input/file-drop.ts`
- **Lote:** L05a
- **Linhas:** 186
- **SHA1:** e3d553085431d62163c19e7be040166c60cd76ec
- **Partes lidas:** 1-186
- **Propósito:** o arrasto de arquivo do sistema operacional: uma imagem sobre o canvas publica a proposta de criação e a solta insere ou substitui; um arquivo solto na zona de pasta do Explorer sobe.
- **Âncora:** `src/editor/input/file-drop.ts:116` `export function installOsFileDrop(store: EditorStore, win: Window, inside: boolean): () => void {`

### `src/editor/input/key-caps.ts`
- **Lote:** L05a
- **Linhas:** 7
- **SHA1:** 20761d44d259e5ae21d3bcf71a047f3a6f6db13f
- **Partes lidas:** 1-7
- **Propósito:** escreve um acorde como a tecla o mostra, com as setas como setas e Escape como Esc.
- **Âncora:** `src/editor/input/key-caps.ts:5` `export function chordCap(chord: string): string {`

### `src/editor/input/keymap-composition.test.ts`
- **Lote:** L05a
- **Linhas:** 27
- **SHA1:** 4fcfefdea111e0dcb977d6120be55967e0f4ce0c
- **Partes lidas:** 1-27
- **Propósito:** prova que uma tecla de uma composição de método de entrada não roda binding algum, e que a mesma tecla fora da composição roda.
- **Âncora:** `src/editor/input/keymap-composition.test.ts:17` `it('a bound chord pressed during a composition runs nothing', () => {`

### `src/editor/input/keymap.test.ts`
- **Lote:** L05a
- **Linhas:** 94
- **SHA1:** eb4a42858d6406ea68d6bff94c731f1bb8f34c6c
- **Partes lidas:** 1-94
- **Propósito:** testa a leitura de uma tecla como o manifesto a escreve, os atalhos de cada contexto, a herança de contexto, o campo de número, as dicas de atalho e a lista de bindings do painel.
- **Âncora:** `src/editor/input/keymap.test.ts:11` `expect(chordOf(key({ key: 'z', code: 'KeyZ', ctrlKey: true }))).toBe('Ctrl+Z');`

### `src/editor/input/keymap.ts`
- **Lote:** L05a
- **Linhas:** 599
- **SHA1:** 0eff15f20d268b830f78531db63965ead25db060
- **Partes lidas:** 1-599
- **Propósito:** o dono único das teclas: lê o contexto do foco, decide quando um atalho roda, lê os argumentos que o controle focado representa e despacha pelo gesto, pela sequência de digitação ou pela store.
- **Âncora:** `src/editor/input/keymap.ts:314` `export function installKeymap(store: EditorStore, target: Window = window): () => void {`

### `src/editor/input/modes.ts`
- **Lote:** L05a
- **Linhas:** 54
- **SHA1:** efcd0eee30bee7f56920b1214e35564b06d70bdd
- **Partes lidas:** 1-54
- **Propósito:** Modos de interação do editor (MEC-10, C6 opção A), lidos do estado que já guarda cada um (gesto e sessão do seletor no estado do ponteiro, digitação pendente, camadas da store), a tabela REFUSED_WHILE do que não abre com outro modo ativo e modeBreaches; conferida pela store do editor a cada comando dentro de um gesto.
- **Âncora:** `src/editor/input/modes.ts:9` `import type { EditorStore } from '../store.ts';`

### `src/editor/input/pending.test.ts`
- **Lote:** L05a
- **Linhas:** 140
- **SHA1:** 1003e84695265df5766305ab9ed6ba9d93be6eda
- **Partes lidas:** 1-140
- **Propósito:** testa as regras G1 e G2: a digitação não confirmada é gravada antes de um comando que muda o documento, o comando do próprio campo roda no contexto da digitação e a tecla de pressão a grava.
- **Âncora:** `src/editor/input/pending.test.ts:66` `it('is kept before a command that changes the document: its undo step comes first', () => {`

### `src/editor/input/pending.ts`
- **Lote:** L05a
- **Linhas:** 84
- **SHA1:** 1bea1332712caedd4ba0ed143244eb0998c7befd
- **Partes lidas:** 1-84
- **Propósito:** o registro único da digitação pendente: um campo por vez, com o contexto em que a digitação começou, consultado pela store do editor e pelo início de cada toque.
- **Âncora:** `src/editor/input/pending.ts:30` `export function holdTyping(typing: Typing): void {`

### `src/editor/input/pointer-install.test.ts`
- **Lote:** L05a
- **Linhas:** 53
- **SHA1:** 31a786e8cbc047f5ac0cac76c10d2d5b2842de59
- **Partes lidas:** 1-53
- **Propósito:** testa que um segundo editor na mesma janela é recusado com incidente e que dois editores em duas janelas não compartilham o estado do ponteiro.
- **Âncora:** `src/editor/input/pointer-install.test.ts:22` `const remove = installPointer(first, window);`

### `src/editor/input/pointer-tools.ts`
- **Lote:** L05a
- **Linhas:** 106
- **SHA1:** 3e448d7717791ac94f23021c1f2bdf40cc83ad2d
- **Partes lidas:** 1-106
- **Propósito:** a superfície das ferramentas de canvas: o registro por dono, a sessão que toma uma pressão, as letras seguradas durante o arrasto e o contexto de teclas da ferramenta.
- **Âncora:** `src/editor/input/pointer-tools.ts:69` `export function registerPointerTool(tool: PointerTool): () => void {`

### `src/editor/input/pointer.test.ts`
- **Lote:** L05a
- **Linhas:** 64
- **SHA1:** 59e4625a59dd50a68e9c2e002109eb562ecdfa28
- **Partes lidas:** 1-64
- **Propósito:** testa a máquina de gestos (pressão, limiar, arrasto, cancelamento, outro ponteiro) e a porta de uma pressão por alvo, botão, contagem e modificador.
- **Âncora:** `src/editor/input/pointer.test.ts:50` `expect(clickDoor(node, 'primary', 1, null)?.ref).toBe('selection.select#canvas-click-element-or-page');`

### `src/editor/input/pointer.ts`
- **Lote:** L05a
- **Linhas:** 249
- **SHA1:** 02a5621d137b9f7b5aae7f66b134b3f3b1955e9d
- **Partes lidas:** 1-249
- **Propósito:** o instalador do dono do ponteiro: um editor por janela, a sessão do ponteiro, os ouvintes de evento e a remoção que devolve a janela.
- **Âncora:** `src/editor/input/pointer.ts:77` `export function installPointer(store: EditorStore, target: Window = window): () => void {`

### `src/editor/input/pointer/common.ts`
- **Lote:** L05a
- **Linhas:** 546
- **SHA1:** 0945c93392a69d73b414a71ea6f028c36a831bea
- **Partes lidas:** 1-546
- **Propósito:** o que as partes do dono do ponteiro compartilham: as portas e constantes lidas do manifesto, o estado que sobrevive a um gesto, o pan, a sessão do seletor de cor e a leitura da pressão.
- **Âncora:** `src/editor/input/pointer/shared.ts:22` `export function sharedOf(store: EditorStore): PointerShared {`

### `src/editor/input/pointer/drag.ts`
- **Lote:** L05a
- **Linhas:** 227
- **SHA1:** 22a59d1a147c3e38bc6ccc2c52b7c0c33a4e912e
- **Partes lidas:** 1-227
- **Propósito:** o arrasto de elementos e blocos: a faixa da seleção por retângulo, a proposta redesenhada, a oferta de lado, a rolagem automática e o repouso numa linha dobrada.
- **Âncora:** `src/editor/input/pointer/drag.ts:16` `export function pointerDrag(p: PointerOwner): Pick<PointerOwner, 'pagePoint' | 'drawMarquee' | 'redraw' | 'sideView' | 'offer' | 'autoscroll' | 'rest' | 'stopDragTimers' | 'over'> {`

### `src/editor/input/pointer/effects.ts`
- **Lote:** L05a
- **Linhas:** 298
- **SHA1:** ce7b81a46763700ce580a9e943a5d027fc7fccea
- **Partes lidas:** 1-298
- **Propósito:** o que os efeitos da máquina fazem: os fatos da pressão, o gesto aberto, a porta que a pressão roda e o que cada efeito de confirmação ou cancelamento despacha.
- **Âncora:** `src/editor/input/pointer/effects.ts:22` `export function pointerEffects(p: PointerOwner): Pick<PointerOwner, 'factsOf' | 'run' | 'isRoot' | 'capture' | 'underPointer' | 'leaveField' | 'endCancelled'> {`

### `src/editor/input/pointer/events.ts`
- **Lote:** L05a
- **Linhas:** 580
- **SHA1:** bc3a8f25a3c392199c31ed27a8391a95dc86b9d1
- **Partes lidas:** 1-580
- **Propósito:** os eventos de ponteiro da janela virados em eventos da máquina: pressão, movimento, soltura, cancelamento, captura perdida, gestos nativos, menu de contexto e clique duplo.
- **Âncora:** `src/editor/input/pointer/events.ts:25` `export function pointerEvents(p: PointerOwner): Pick<PointerOwner, 'onDoubleClick' | 'onDown' | 'onMove' | 'onUp' | 'onCancel' | 'onLostCapture' | 'onNative' | 'onContextMenu' | 'onMouseDown'> {`

### `src/editor/input/pointer/machine.ts`
- **Lote:** L05a
- **Linhas:** 96
- **SHA1:** d0601bc7feadfbdb7a189ed4a36fc2c332e1f524
- **Partes lidas:** 1-96
- **Propósito:** a máquina de gestos: o que uma pressão atinge, as fases idle, pressed, dragging e a transição que vira arrasto no limiar lido do manifesto.
- **Âncora:** `src/editor/input/pointer/machine.ts:79` `export function step(machine: Machine, event: MachineEvent, dragThreshold = DRAG_THRESHOLD): { readonly machine: Machine; readonly effect: Effect } {`

### `src/editor/input/pointer/owner.ts`
- **Lote:** L05a
- **Linhas:** 212
- **SHA1:** 4e45fbf69e0261a53c970e1b3b27099356304725
- **Partes lidas:** 1-212
- **Propósito:** o dono do ponteiro de um editor: a interface da sessão entre eventos, o que sobrevive a um gesto e o objeto pelo qual cada parte lê as outras.
- **Âncora:** `src/editor/input/pointer/owner.ts:22` `export interface PointerSession {`

### `src/editor/input/pointer/panels.ts`
- **Lote:** L05a
- **Linhas:** 140
- **SHA1:** eecdb89064cd1afef6d206aa1aaf20d2ea226e6a
- **Partes lidas:** 1-140
- **Propósito:** as pressões nos controles dos painéis: a área de cor, o passo repetido, o pad de luz, a alça e a dica do painel, a coluna de dados, o playhead e os quadros-chave, o Explorer e a rolagem de um campo de número.
- **Âncora:** `src/editor/input/pointer/panels.ts:13` `export function pointerPanels(p: PointerOwner): Pick<PointerOwner, 'pickColor' | 'stopRepeating' | 'moveLight' | 'moveGrip' | 'partUnder' | 'moveColumn' | 'movePlayhead' | 'moveKeyframe' | 'folderUnder' | 'moveExplorer' | 'moveLayer' | 'movePanelHint' | 'moveStop' | 'scrub'> {`

### `src/editor/input/pointer/press.ts`
- **Lote:** L05a
- **Linhas:** 99
- **SHA1:** 9da6ff33b3785e1fbf6266434e7bc468fc85694e
- **Partes lidas:** 1-99
- **Propósito:** qual porta uma pressão no canvas roda: os fatos que a julgam, as portas de clique do manifesto com o alvo que cada uma toma, o modificador segurado e os argumentos de cada porta.
- **Âncora:** `src/editor/input/pointer/press.ts:66` `export function clickDoor(press: Press, button: Button, count: number, modifier: string | null, facts: PressFacts = NO_FACTS, picking: Picking = NOT_PICKING): DoorEntry | null {`

### `src/editor/input/pointer/resize.ts`
- **Lote:** L05a
- **Linhas:** 96
- **SHA1:** f7e40bc66c0e01f472609a49b1d69323f8546025
- **Partes lidas:** 1-96
- **Propósito:** redimensionar e mover no canvas: a alça de resize, o arrasto livre de um elemento posicionado, o encaixe e a soltura dos gestos de alça.
- **Âncora:** `src/editor/input/pointer/resize.ts:11` `export function pointerResize(p: PointerOwner): Pick<PointerOwner, 'resize' | 'positionedNow' | 'snappedResize' | 'moveFree' | 'dropHandleGestures'> {`

### `src/editor/input/pointer/shared.ts`
- **Lote:** L05a
- **Linhas:** 29
- **SHA1:** 69b00561f171df82b43d31c6d72a7bdcdb2ffc4e
- **Partes lidas:** 1-29
- **Propósito:** Estado do ponteiro de um editor que dura além de um gesto (PointerShared, sharedOf: pan, gesto aberto, sessão do seletor de cor), num módulo sem importação que rode, para modes.ts e a store do editor o lerem sem carregar as partes do dono do ponteiro.
- **Âncora:** `src/editor/input/pointer/shared.ts:5` `import type { DispatchResult, Gesture } from '../../../core/store/store.ts';`

### `src/editor/input/pointer/tools.ts`
- **Lote:** L05a
- **Linhas:** 62
- **SHA1:** 26c0bcb54b11a52a1e9f260c9c5e55948aa48f04
- **Partes lidas:** 1-62
- **Propósito:** as ferramentas de canvas de um módulo, a sessão do seletor de cor e o pan; inclui o despacho da roda por modificador.
- **Âncora:** `src/editor/input/pointer/tools.ts:8` `export function pointerTools(p: PointerOwner): Pick<PointerOwner, 'dropTool' | 'followPicker' | 'dispatchPan' | 'onWheel'> {`

### `src/editor/input/pointer/use-views.ts`
- **Lote:** L05a
- **Linhas:** 23
- **SHA1:** 0c4c68f5dfd26901aa0b8eda2b59f6b87455f507
- **Partes lidas:** 1-23
- **Propósito:** lê as vistas do ponteiro do jeito React: um controle redesenha quando o valor que ele lê muda, por `useSyncExternalStore`.
- **Âncora:** `src/editor/input/pointer/use-views.ts:13` `export function usePointerValue<K extends Published>(key: K): ReturnType<PointerViews[K]['get']> {`

### `src/editor/input/pointer/views.ts`
- **Lote:** L05a
- **Linhas:** 229
- **SHA1:** 0696bf2d750c183e87a32bdfc949c402dbefe719
- **Partes lidas:** 1-229
- **Propósito:** o que o ponteiro publica: a faixa, o nó sob o ponteiro, o arrasto em curso, a proposta, os fantasmas e a região da última pressão, cada valor com um assinar, um conjunto por editor.
- **Âncora:** `src/editor/input/pointer/views.ts:222` `export function pointerViews(store: object): PointerViews {`

### `src/editor/input/select-on-focus.ts`
- **Lote:** L05a
- **Linhas:** 32
- **SHA1:** be139381ea2053b114a9f449394bf613d49b8b5f
- **Partes lidas:** 1-32
- **Propósito:** o primeiro clique num campo de valor seleciona tudo o que ele guarda, para o que for digitado substituí-lo.
- **Âncora:** `src/editor/input/select-on-focus.ts:10` `export function installSelectOnFocus(root: Document = document): () => void {`

### `src/editor/input/shortcut-rule.test.ts`
- **Lote:** L05a
- **Linhas:** 37
- **SHA1:** 0c0392c3e948370279728026b1b3c4ff99ba9fe2
- **Partes lidas:** 1-37
- **Propósito:** testa quando um atalho roda, sobre os dados do próprio manifesto: comando construído e a funcionalidade da porta registrada.
- **Âncora:** `src/editor/input/shortcut-rule.test.ts:19` `expect(shortcutRuns(shortcut('focus.next#key-arrow-down-in-menu'), built(focus), registered([]))).toBe(true);`

### `src/editor/input/shortcut-rule.ts`
- **Lote:** L05a
- **Linhas:** 18
- **SHA1:** d3aff73c0696cb06fb21f1756dd8c4c4a0ac5152
- **Partes lidas:** 1-18
- **Propósito:** quando um atalho roda: o comando é construído e a funcionalidade da porta é a que introduz o comando ou está registrada como construída.
- **Âncora:** `src/editor/input/shortcut-rule.ts:16` `export function shortcutRuns(door: ShortcutFacts, built: (command: string) => boolean, featureBuilt: (feature: string) => boolean): boolean {`

### `src/editor/input/wheel-step.test.ts`
- **Lote:** L05a
- **Linhas:** 13
- **SHA1:** 56353129071cb3594db1c934dc5c5af72a57531b
- **Partes lidas:** 1-13
- **Propósito:** prova que um entalhe da roda sobre um campo de número focado passa a valer com Shift, quando o Chrome entrega o entalhe como deltaX.
- **Âncora:** `src/editor/input/wheel-step.test.ts:8` `expect(wheelStep({ deltaX: -100, deltaY: 0, shiftKey: true })).toBe('up');`

### `src/editor/input/wheel-step.ts`
- **Lote:** L05a
- **Linhas:** 8
- **SHA1:** 24233e1844ca89d828e39cf1a7729007bece0527
- **Partes lidas:** 1-8
- **Propósito:** para que lado um entalhe da roda sobre um campo de número focado o move, com o delta horizontal valendo quando Shift está segurado.
- **Âncora:** `src/editor/input/wheel-step.ts:5` `export function wheelStep(event: Pick<WheelEvent, 'deltaX' | 'deltaY' | 'shiftKey'>): 'up' | 'down' | null {`

### `src/editor/inspector/attribute-feedback.ts`
- **Lote:** L06
- **Linhas:** 24
- **SHA1:** fa7a85ce413f0a9931c3ae7bcf221a6435324d15
- **Partes lidas:** 1-24
- **Propósito:** Liga a última recusa da store ao campo de configurações do nó selecionado, para mostrá-la até a pessoa digitar de novo.
- **Âncora:** `src/editor/inspector/attribute-feedback.ts:8` `export function useSettingsRefusal(command: CommandId, attribute: string | undefined, nodeId: string): { readonly text: string | null; readonly dismiss: () => void } {`

### `src/editor/inspector/attributes.ts`
- **Lote:** L06
- **Linhas:** 39
- **SHA1:** 00efdfe52df0f40d446dfb5266c6f677b355e577
- **Partes lidas:** 1-39
- **Propósito:** Lê do manifesto os atributos e as seções de configurações e decide se a tag de um elemento aceita um atributo e em que seção ele aparece.
- **Âncora:** `src/editor/inspector/attributes.ts:8` `export const ATTRIBUTES = new Map(manifest.elements.attributes.map((attribute) => [attribute.id, attribute]));`

### `src/editor/inspector/color-picker.ts`
- **Lote:** L06
- **Linhas:** 102
- **SHA1:** 414748d153f7adbc6ac4077ce342b285c4fa040a
- **Partes lidas:** 1-102
- **Propósito:** Abre, edita por canal e fecha o seletor de cor, escrevendo as cores pelo escritor único do estilo e guardando as cores recentes.
- **Âncora:** `src/editor/inspector/color-picker.ts:37` `export const openColorPicker = registerHandler<'colorPicker.open', EditorUi>('colorPicker.open', ({ state, rules }, { property }) => {`

### `src/editor/inspector/concept-rows.test.ts`
- **Lote:** L06
- **Linhas:** 70
- **SHA1:** f47c6d9efa9073272bb063a6fb1564741b976e57
- **Partes lidas:** 1-70
- **Propósito:** Verifica as linhas de conceito: as propriedades de cada item, a abertura automática quando um detalhe tem valor que a cabeça não mostra, e a escolha da pessoa.
- **Âncora:** `src/editor/inspector/concept-rows.test.ts:12` `describe('concept rows (src/editor/inspector/concept-rows.ts)', () => {`

### `src/editor/inspector/concept-rows.ts`
- **Lote:** L06
- **Linhas:** 108
- **SHA1:** 8b0b946de3a8887ec68d114577b64ae0d9ca8d54
- **Partes lidas:** 1-108
- **Propósito:** Lê do manifesto as linhas de conceito da aba Estilo, decide se uma linha abre e executa o comando que a dobra ou desdobra.
- **Âncora:** `src/editor/inspector/concept-rows.ts:69` `export function detailsHoldMore(row: ConceptRow, held: ReadonlySet<string>): boolean {`

### `src/editor/inspector/gradient-view.ts`
- **Lote:** L06
- **Linhas:** 34
- **SHA1:** 38044047ded12ab918e31b3dfac1262b675df7aa
- **Partes lidas:** 1-34
- **Propósito:** Guarda a vista do editor de gradiente: a parada em edição e o ângulo lembrado por tipo enquanto o tipo é trocado.
- **Âncora:** `src/editor/inspector/gradient-view.ts:16` `export const gradientView = {`

### `src/editor/inspector/number-field.test.ts`
- **Lote:** L06
- **Linhas:** 97
- **SHA1:** db4e350bb043c73ed7312fcaa87187533ab69529
- **Partes lidas:** 1-97
- **Propósito:** Verifica a aritmética dos campos numéricos: passo, página, scrub, troca de unidade, campo vazio e as recusas, com o portão de CSS e o layout de teste.
- **Âncora:** `src/editor/inspector/number-field.test.ts:34` `describe('the number fields', () => {`

### `src/editor/inspector/number-field.ts`
- **Lote:** L06
- **Linhas:** 140
- **SHA1:** b469984f301c7b64d0911f456b5b6e0f710d135c
- **Partes lidas:** 1-140
- **Propósito:** Executa os comandos dos campos numéricos: passo, página, scrub e troca de unidade, escrevendo pelo escritor único do estilo.
- **Âncora:** `src/editor/inspector/number-field.ts:82` `export const stepField = registerHandler('field.step', (context, { property, value, direction, size, modifier }) => {`

### `src/editor/inspector/origin.test.ts`
- **Lote:** L06
- **Linhas:** 54
- **SHA1:** dae03a92cb0d6fe76ec70f10ab2c62fffd5b7d25
- **Partes lidas:** 1-54
- **Propósito:** Verifica a origem do valor que um campo de estilo mostra: própria, de classe, herdada de um ancestral, de breakpoint maior ou padrão.
- **Âncora:** `src/editor/inspector/origin.test.ts:20` `describe('the origin of the value a Style field shows (inspector/origin.ts)', () => {`

### `src/editor/inspector/origin.ts`
- **Lote:** L06
- **Linhas:** 55
- **SHA1:** 351b457f8c8a9bbe07fc7ab5c531a2a897730329
- **Partes lidas:** 1-55
- **Propósito:** Determina de onde vem o valor que um campo de estilo mostra: a camada própria, uma classe, um ancestral que herda a propriedade ou o padrão.
- **Âncora:** `src/editor/inspector/origin.ts:36` `export function valueOrigin(state: State, properties: readonly string[], rules: ModelRules): ValueOrigin | null {`

### `src/editor/inspector/page-properties.ts`
- **Lote:** L06
- **Linhas:** 28
- **SHA1:** 7e990fbadc61fdec7222c961ea690132af419df8
- **Partes lidas:** 1-28
- **Propósito:** Abre as propriedades da página: seleciona a raiz da página mostrada e leva o inspector à aba que desenha os campos dela.
- **Âncora:** `src/editor/inspector/page-properties.ts:24` `export const openPageProperties = registerHandler<'page.openProperties', EditorUi>('page.openProperties', ({ state, rules }) => {`

### `src/editor/inspector/pick-target.ts`
- **Lote:** L06
- **Linhas:** 19
- **SHA1:** 0ea51d5dfc48c9e46048d751454f441411eec1e8
- **Partes lidas:** 1-19
- **Propósito:** Guarda qual interação espera o próximo toque para escolher o alvo, no estado do editor, com as funções de iniciar e limpar essa escolha.
- **Âncora:** `src/editor/inspector/pick-target.ts:9` `export const pickingTarget = (ui: EditorUi): number | null => ui.pickTarget ?? null;`

### `src/editor/inspector/rows.test.ts`
- **Lote:** L06
- **Linhas:** 93
- **SHA1:** 36253159dd371bbf5228a58471cad6c299606a1a
- **Partes lidas:** 1-93
- **Propósito:** Verifica as linhas duplas e os grupos de uma seção: nomes de catálogo nas duas línguas, um eixo por coluna nas linhas de tamanho e a ordem por grupo.
- **Âncora:** `src/editor/inspector/rows.test.ts:13` `describe('the pair rows (inspector/rows.ts)', () => {`

### `src/editor/inspector/rows.ts`
- **Lote:** L06
- **Linhas:** 92
- **SHA1:** 3a9b79a5747456c5b11d0c08828fbe2619b49e78
- **Partes lidas:** 1-92
- **Propósito:** Lê do manifesto as linhas duplas e os grupos das seções e ordena os campos de uma seção pelos grupos declarados.
- **Âncora:** `src/editor/inspector/rows.ts:33` `export const PAIR_ROWS: readonly PairRow[] = manifest.properties.rows.map((row) => {`

### `src/editor/inspector/sections.test.ts`
- **Lote:** L06
- **Linhas:** 133
- **SHA1:** 7cac20dee1bb690c019bfdb990428744b43cba91
- **Partes lidas:** 1-133
- **Propósito:** Verifica as seções recolhidas do inspector: abrir e fechar sem tocar no documento, as preferências que sobrevivem a um reload e o resumo de cada seção.
- **Âncora:** `src/editor/inspector/sections.test.ts:24` `describe('collapsed sections (inspector/sections.ts)', () => {`

### `src/editor/inspector/sections.ts`
- **Lote:** L06
- **Linhas:** 340
- **SHA1:** 80a0c1e025ec207157b82606907961a92c66f934
- **Partes lidas:** 1-340
- **Propósito:** Decide quais seções do inspector ficam recolhidas, escreve o resumo de cada uma a partir dos valores em vigor e guarda o modo, a busca e a revelação de campos.
- **Âncora:** `src/editor/inspector/sections.ts:91` `export function sectionClosed(ui: EditorUi, section: SectionId, held: ReadonlySet<string>): boolean {`

### `src/editor/inspector/selection.tsx`
- **Lote:** L06
- **Linhas:** 21
- **SHA1:** 6bc058eebf62e99b34d0703364189b4c168ffc29
- **Partes lidas:** 1-21
- **Propósito:** Dá às abas do inspector o nó único selecionado (ou nenhum, com zero ou vários) e a lista de dicas com nada selecionado.
- **Âncora:** `src/editor/inspector/selection.tsx:12` `export function Hints() {`

### `src/editor/inspector/shadow-view.ts`
- **Lote:** L06
- **Linhas:** 22
- **SHA1:** 4f11bfbdf3f9f9a90d20fa93975cff647832af74
- **Partes lidas:** 1-22
- **Propósito:** Guarda a vista do editor de sombras: a camada em edição por propriedade e a versão que sinaliza cada escolha.
- **Âncora:** `src/editor/inspector/shadow-view.ts:9` `export const shadowView = {`

### `src/editor/inspector/spacing.ts`
- **Lote:** L06
- **Linhas:** 44
- **SHA1:** 54c5ac907bdc90c0d759e36d1105e9a89d4e48e8
- **Partes lidas:** 1-44
- **Propósito:** Guarda se uma caixa de espaçamento está ligada por elemento e executa o comando que alterna essa ligação entre um valor e os quatro lados.
- **Âncora:** `src/editor/inspector/spacing.ts:27` `export const toggleSpacingLink = registerHandler<'inspector.toggleSpacingLink', EditorUi>(`

### `src/editor/inspector/style-target.ts`
- **Lote:** L06
- **Linhas:** 102
- **SHA1:** 902b35817e384ee9bc5e213b9c66020f95fcfb36
- **Partes lidas:** 1-102
- **Propósito:** Guarda o alvo dos estilos (elemento ou classe), resolve o nó que a aba Estilo lê e a origem de um valor em cascata, e segue a renomeação da classe.
- **Âncora:** `src/editor/inspector/style-target.ts:29` `export const setStyleTarget = registerHandler<'inspector.setStyleTarget', EditorUi>(`

### `src/editor/layers/rename.test.ts`
- **Lote:** L06
- **Linhas:** 100
- **SHA1:** 12f8dea3b843be50f6c01db10708db985128d232
- **Partes lidas:** 1-100
- **Propósito:** Verifica o renomear nas Camadas: o início sem mudar o documento, as recusas, o fim pelo rename e pelo nome vazio, e a mudança de seleção.
- **Âncora:** `src/editor/layers/rename.test.ts:21` `describe('renaming in Layers (src/editor/layers/rename.ts)', () => {`

### `src/editor/layers/rename.ts`
- **Lote:** L06
- **Linhas:** 64
- **SHA1:** e20c0b8e40ec0ab6b3946b9505cdc8e5db23454a
- **Partes lidas:** 1-64
- **Propósito:** Guarda o estado do renomear em Camadas e os comandos que o iniciam e terminam, mostrando o painel das Camadas e desdobrando os ramos que escondem a linha.
- **Âncora:** `src/editor/layers/rename.ts:38` `export const startRename = registerHandler<'layers.startRename', EditorUi>('layers.startRename', ({ state }) => {`

### `src/editor/layers/tree.test.ts`
- **Lote:** L06
- **Linhas:** 58
- **SHA1:** dd62ceb3e21d4a589f001f2cb0e979c70549ade1
- **Partes lidas:** 1-58
- **Propósito:** Verifica a dobra de ramos das Camadas: dobrar, desdobrar e alternar sem tocar no documento, e o desdobrar dos ramos que escondem um nó selecionado.
- **Âncora:** `src/editor/layers/tree.test.ts:16` `describe('Layers folding (src/editor/layers/tree.ts)', () => {`

### `src/editor/layers/tree.ts`
- **Lote:** L06
- **Linhas:** 165
- **SHA1:** c0c8faee0babb0f30d263ec1e91ec308bc73e798
- **Partes lidas:** 1-165
- **Propósito:** Guarda a dobra e a busca das Camadas, com os comandos que dobram, desdobram, mostram detalhes das linhas e revelam a seleção.
- **Âncora:** `src/editor/layers/tree.ts:69` `export const setExpanded = registerHandler<'layers.setExpanded', EditorUi>('layers.setExpanded', ({ state }, { target, expanded }) => {`

### `src/editor/menus/context-menu.ts`
- **Lote:** L05b
- **Linhas:** 33
- **SHA1:** c621a4063454fdac4176ecc510bdc200103d09bf
- **Partes lidas:** 1-33
- **Propósito:** Abertura do menu de contexto por comando: registra a abertura com o número de descartes e, quando o nó não está na seleção, passa a selecioná-lo.
- **Âncora:** `src/editor/menus/context-menu.ts:17` `export const INITIAL_CONTEXT_MENU: ContextMenuState = { opened: null };`

### `src/editor/menus/overlays.ts`
- **Lote:** L05b
- **Linhas:** 22
- **SHA1:** 2d07a37629e7bd4634a3b22ffb524896a9520350
- **Partes lidas:** 1-22
- **Propósito:** Descarte dos overlays (ui.dismiss): conta os descartes no estado do editor e fecha o diálogo, a barra de comandos e a importação abertos.
- **Âncora:** `src/editor/menus/overlays.ts:13` `export const INITIAL_OVERLAYS: OverlaysState = { dismissals: 0 };`

### `src/editor/motion/canvas.ts`
- **Lote:** L08
- **Linhas:** 39
- **SHA1:** 65c962db1570bbd9389b09edecfe03e1ab5ef5f3
- **Partes lidas:** 1-39
- **Propósito:** Roda o runtime de motion no iframe do canvas do editor: o modo de execução liga as interações como a página faria e a pré-visualização desenha a timeline aberta no playhead, com cada elemento endereçado pela marca data-node do canvas.
- **Âncora:** `src/editor/motion/canvas.ts:17` `import { startOn } from './runtime/compose.ts';`

### `src/editor/motion/drag-tool.ts`
- **Lote:** L08
- **Linhas:** 66
- **SHA1:** 04ac7c796da837b36ac3d12d0e1479fcca0033e6
- **Partes lidas:** 1-66
- **Propósito:** Ferramenta de ponteiro da timeline de motion: uma pressão primária nos controles de arraste do painel (barra, início, fim, quadro-chave, marcador, playhead) vira o comando da porta com os argumentos que o deslocamento do ponteiro produz, e uma pressão sem deslocamento põe o playhead ou seleciona o que está sob ele.
- **Âncora:** `src/editor/motion/drag-tool.ts:29` `export const motionDragTool: PointerTool = {`

### `src/editor/motion/pointer.ts`
- **Lote:** L08
- **Linhas:** 97
- **SHA1:** 12d3cfdfc9fc10715d66d67d6ab20b2d84ecffa7
- **Partes lidas:** 1-97
- **Propósito:** O único lugar que converte o deslocamento do ponteiro sobre a trilha da timeline nos argumentos dos comandos de motion, com encaixe nos alvos (início, playhead, bordas de barras, quadros-chave e marcadores) ou na grade, movendo junto as barras ou quadros-chave selecionados.
- **Âncora:** `src/editor/motion/pointer.ts:25` `export interface MotionPress {`

### `src/editor/motion/runtime/actions.test.ts`
- **Lote:** L08
- **Linhas:** 210
- **SHA1:** 3c569f2dcc02152f5a2bde861a3b6b38f797496a
- **Partes lidas:** 1-210
- **Propósito:** Testes das ações instantâneas do runtime de motion e dos seus desfazeres: classe, atributo, estilo, variável, texto, exibição, diálogo, details, tema, aba, slide, mídia, evento, foco, formulário, navegação, área de transferência, animação CSS, Lottie e rolagem, incluindo o que o canvas nunca faz (sair do editor ou enviar formulário).
- **Âncora:** `src/editor/motion/runtime/actions.test.ts:1` `import { describe, expect, it, vi } from 'vitest';`

### `src/editor/motion/runtime/actions.ts`
- **Lote:** L08
- **Linhas:** 418
- **SHA1:** 324dd765ebff886697419e744a3f713091139bb5
- **Partes lidas:** 1-418
- **Propósito:** As ações instantâneas do runtime: o que uma ação faz ao alvo no momento em que a timeline cruza o seu início, devolvendo o desfazer para que reproduzir de trás para frente ou arrastar o playhead ponha a página de volta, enquanto efeitos fora da página (navegar, copiar, enviar formulário, evento próprio) não têm desfazer e só rodam em reprodução para frente.
- **Âncora:** `src/editor/motion/runtime/actions.ts:38` `export function createActions(win: Window, kit: MotionKit): ActionKit {`

### `src/editor/motion/runtime/behaviours.test.ts`
- **Lote:** L08
- **Linhas:** 55
- **SHA1:** a2be052d78d53a5424ff4d70d3fdbd2dddadb3f2
- **Partes lidas:** 1-55
- **Propósito:** Testes dos comportamentos do runtime: rolagem suave da página, parallax contra o centro da janela, letreiro em laço com cópia oculta e elemento que segue o cursor, verificando que cada um devolve o que mudou ao ser removido.
- **Âncora:** `src/editor/motion/runtime/behaviours.test.ts:1` `import { describe, expect, it } from 'vitest';`

### `src/editor/motion/runtime/behaviours.ts`
- **Lote:** L08
- **Linhas:** 180
- **SHA1:** 229697fcd97e71b5091225a58948573ad4490ec2
- **Partes lidas:** 1-180
- **Propósito:** Os comportamentos do runtime de motion: rolagem suave, parallax, letreiro em laço (que pausa sob o ponteiro ou o foco e esconde as cópias da tecnologia assistiva) e elemento que segue o cursor, cada um devolvendo o que mudou quando removido e respeitando menos movimento.
- **Âncora:** `src/editor/motion/runtime/behaviours.ts:17` `export function createBehaviours(win: Window, kit: MotionKit): BehaviourKit {`

### `src/editor/motion/runtime/compose.ts`
- **Lote:** L08
- **Linhas:** 50
- **SHA1:** 23484d40e7b4542d132e1300491d8681a1b3bfc8
- **Partes lidas:** 1-50
- **Propósito:** Monta o runtime de motion: as fábricas por nome, o start que o editor chama na janela do canvas e o mesmo runtime escrito como texto para a página exportada, para que a página rode exatamente o que o editor roda.
- **Âncora:** `src/editor/motion/runtime/compose.ts:16` `export const FACTORIES: Factories = {`

### `src/editor/motion/runtime/fake-page.ts`
- **Lote:** L08
- **Linhas:** 122
- **SHA1:** a940df00c305671a6b0fe8903896b2806816aba8
- **Partes lidas:** 1-122
- **Propósito:** Página falsa (happy-dom) dos testes unitários do runtime de motion, com animações e quadros movidos pelo relógio do teste, menos movimento, redimensionamento, e a configuração de teste do runtime.
- **Âncora:** `src/editor/motion/runtime/fake-page.ts:65` `export function fakePage(markup: string): FakePage {`

### `src/editor/motion/runtime/kit.ts`
- **Lote:** L08
- **Linhas:** 45
- **SHA1:** f0aafc2202ca70eba9a4bdd33019ee9a9afcbadc
- **Partes lidas:** 1-45
- **Propósito:** Tipos das partes do runtime de motion e de como elas se alcançam: o problema relatado (código e detalhe) e o kit preenchido com a janela, a configuração, o modo página/canvas e cada fábrica já feita.
- **Âncora:** `src/editor/motion/runtime/kit.ts:25` `export interface MotionKit {`

### `src/editor/motion/runtime/lottie.ts`
- **Lote:** L08
- **Linhas:** 82
- **SHA1:** 230c8a0d3aaeef82ecb8405b336e6574cd96542a
- **Partes lidas:** 1-82
- **Propósito:** Lottie no runtime de motion: toca, pausa, para, busca ou reproduz um segmento da animação dentro do alvo, com um player por alvo e arquivo feito na primeira ação que precisa dele, destruído com o runtime e relatando player ou dados ausentes.
- **Âncora:** `src/editor/motion/runtime/lottie.ts:32` `export function createLottie(win: Window, kit: MotionKit): LottieKit {`

### `src/editor/motion/runtime/player.test.ts`
- **Lote:** L08
- **Linhas:** 160
- **SHA1:** f80c1255b6872ea74df9612fa01adb4f4e3d6acd
- **Partes lidas:** 1-160
- **Propósito:** Testes do player das timelines de motion: animação por trilha de propriedade atrasada até o início da ação, cruzamento e desfazer das ações instantâneas com o relógio, reprodução de trás para frente, menos movimento, escalonamento, transformação composta em propriedades registradas, pré-visualização sem tocar e devolução da página ao parar.
- **Âncora:** `src/editor/motion/runtime/player.test.ts:1` `import { describe, expect, it } from 'vitest';`

### `src/editor/motion/runtime/player.ts`
- **Lote:** L08
- **Linhas:** 647
- **SHA1:** 128b5da898de0396eb811ca6e369a84d8d9dca28
- **Partes lidas:** 1-647
- **Propósito:** O player do runtime: uma timeline tocada sobre um elemento é uma corrida com animações nativas da Web Animations para tudo o que se move e cues para as ações instantâneas, todas com um relógio único (busca, reversão, linha do tempo de rolagem nativa) e devolução do que o run mudou.
- **Âncora:** `src/editor/motion/runtime/player.ts:57` `export function createPlayer(win: Window, kit: MotionKit): PlayerKit {`

### `src/editor/motion/runtime/scroll.ts`
- **Lote:** L08
- **Linhas:** 83
- **SHA1:** 6aac9e52a832b7d37ccd60aeb1e4e28844a1bea2
- **Partes lidas:** 1-83
- **Propósito:** O progresso de rolagem dos gatilhos contínuos: linha do tempo nativa do navegador (ScrollTimeline/ViewTimeline) quando existe, com ouvinte de rolagem como alternativa e como fonte do progresso que cruza as ações instantâneas, estreitado pela faixa da interação.
- **Âncora:** `src/editor/motion/runtime/scroll.ts:24` `export function createScroll(win: Window): ScrollKit {`

### `src/editor/motion/runtime/self-contained.test.ts`
- **Lote:** L08
- **Linhas:** 79
- **SHA1:** 586aeceee01103318c5ed04fb9e3f32584a0d02d
- **Partes lidas:** 1-79
- **Propósito:** Testes de que o runtime escrito em texto para a página se basta: cada fábrica é escrita como fonte própria sem nomear nada de outro módulo, e o script roda, toca e desfaz sozinho numa página, sem id do editor nem atributo data.
- **Âncora:** `src/editor/motion/runtime/self-contained.test.ts:1` `import fs from 'node:fs';`

### `src/editor/motion/runtime/split-text.ts`
- **Lote:** L08
- **Linhas:** 123
- **SHA1:** f5d52ce354c16f51e44c453d0e5e8bcad9c6895e
- **Partes lidas:** 1-123
- **Propósito:** Divide o texto de um elemento em letras, palavras ou linhas para uma animação escalonada, cortando cada nó de texto onde ele está (negrito segue negrito, link segue link), com uma cópia oculta de tecnologia assistiva e restauração dos nós originais.
- **Âncora:** `src/editor/motion/runtime/split-text.ts:21` `export function createSplitText(): SplitKit {`

### `src/editor/motion/runtime/start.ts`
- **Lote:** L08
- **Linhas:** 180
- **SHA1:** a45901c9f96bbf81e17e0bf2e68707bb6084d6e6
- **Partes lidas:** 1-180
- **Propósito:** O início do runtime de motion: monta o kit a partir das fábricas, liga cada interação aos elementos que o seletor encontra e instala cada comportamento, devolvendo o controlador que desfaz tudo e deixa o editor desenhar uma timeline no playhead.
- **Âncora:** `src/editor/motion/runtime/start.ts:41` `export interface MotionController {`

### `src/editor/motion/runtime/targets.ts`
- **Lote:** L08
- **Linhas:** 51
- **SHA1:** b2f5fcd9116564ef6b68c9c3b94e02152a957bc8
- **Partes lidas:** 1-51
- **Propósito:** A leitura de alvo do runtime: os elementos em que uma ação age a partir do elemento cujo gatilho disparou, caminhando a família da fonte (filhos, irmãos, pai, próximo, anterior, descendentes, ancestral) ou buscando por classe ou seletor no documento da fonte.
- **Âncora:** `src/editor/motion/runtime/targets.ts:13` `export function createTargets(): TargetKit {`

### `src/editor/motion/runtime/triggers.test.ts`
- **Lote:** L08
- **Linhas:** 320
- **SHA1:** 69db58b81e3a7e6119a08e153d1ef1dbb8c5d325
- **Partes lidas:** 1-320
- **Propósito:** Testes dos gatilhos do runtime: eventos do elemento, os pares de hover e de foco, o progresso do ponteiro, tecla, formulário inválido, pressão longa, gatilhos de rolagem, da página, de mídia e de componentes, mais a prova de que toda categoria do catálogo é exercitada por um teste.
- **Âncora:** `src/editor/motion/runtime/triggers.test.ts:1` `import { describe, expect, it, vi } from 'vitest';`

### `src/editor/motion/runtime/triggers.ts`
- **Lote:** L08
- **Linhas:** 411
- **SHA1:** 742231e72a6b841a6f9cdc8bd9bcb256d837c93a
- **Partes lidas:** 1-411
- **Propósito:** Os gatilhos do runtime: cada um liga ao elemento fonte (ou à página) e chama de volta ao disparar, na metade par do gatilho ou com o progresso, lendo o estado que a marcação da página carrega (aria-expanded, aria-selected, aria-current, open) e devolvendo a remoção.
- **Âncora:** `src/editor/motion/runtime/triggers.ts:24` `export function createTriggers(win: Window, kit: MotionKit): TriggerKit {`

### `src/editor/motion/script.ts`
- **Lote:** L08
- **Linhas:** 12
- **SHA1:** de79eddb0dab90ee05c98c3ad8a4c7af36f249d8
- **Partes lidas:** 1-12
- **Propósito:** A parte de motion da porta de scripts do site: entrega ao núcleo o script de motion da página e, só quando uma timeline toca uma animação Lottie, o player lottie-web 5.13.0 (build light) como texto para a página carregar.
- **Âncora:** `src/editor/motion/script.ts:9` `export const motionScript = (config: RuntimeConfig): string => motionRuntimeSource(config);`

### `src/editor/motion/state.test.ts`
- **Lote:** L08
- **Linhas:** 118
- **SHA1:** f6afe19949b913f267e788f940c0093f95ae94c5
- **Partes lidas:** 1-118
- **Propósito:** Testes do estado de editor da timeline de motion: a timeline mostrada, o playhead, o zoom, a seleção de barras e quadros-chave com Shift, cópia, gravação de uma mudança do inspetor como um passo de desfazer, encaixe, pré-visualização, execução e os arrastes do dono do ponteiro.
- **Âncora:** `src/editor/motion/state.test.ts:1` `import { describe, expect, it } from 'vitest';`

### `src/editor/motion/state.ts`
- **Lote:** L08
- **Linhas:** 226
- **SHA1:** 68c10a24a0560c1846ae3f7bb4fac501133d21cc
- **Partes lidas:** 1-226
- **Propósito:** O estado de editor da timeline de motion em `ui.motion` — a timeline mostrada, o playhead, o zoom e a rolagem, a seleção, a área de transferência, gravação, encaixe, pré-visualização e execução — com os comandos que o mudam, nenhum deles um passo de desfazer.
- **Âncora:** `src/editor/motion/state.ts:17` `export interface MotionUiState {`

### `src/editor/motion/ui/doors.ts`
- **Lote:** L08
- **Linhas:** 66
- **SHA1:** 4d79801e13224d0b9ac0d99bda07068b27e0dadf
- **Partes lidas:** 1-66
- **Propósito:** As portas que as superfícies de motion desenham, lidas dos dados do próprio manifesto (motion.json) pelos ids das portas, para que nada seja desenhado que o manifesto não declare.
- **Âncora:** `src/editor/motion/ui/doors.ts:10` `export function motionDoor(id: string): DoorEntry {`

### `src/editor/motion/ui/interactions.tsx`
- **Lote:** L08
- **Linhas:** 186
- **SHA1:** 5bee9a24be52832c050dfbfd830cd41654456298
- **Partes lidas:** 1-186
- **Propósito:** A parte de motion da aba de interações do inspetor: os cartões de interação do elemento selecionado (aplica-se a, gatilho, ação, alvo, opções, uma vez, atraso, breakpoints, menos movimento) e os comportamentos, com cada controle sendo uma porta do manifesto.
- **Âncora:** `src/editor/motion/ui/interactions.tsx:167` `export function MotionInteractions({ node }: { readonly node: DocNode | null }) {`

### `src/editor/motion/ui/lane-rows.test.ts`
- **Lote:** L08
- **Linhas:** 31
- **SHA1:** 745afe247e5edf4577316640b9950c2a4b898870
- **Partes lidas:** 1-31
- **Propósito:** Testes das fileiras de uma faixa: barras que se seguem ficam numa fileira, barras tocadas juntas ganham fileiras próprias com uma barra posterior voltando à primeira fileira livre, e uma faixa vazia tem uma fileira.
- **Âncora:** `src/editor/motion/ui/lane-rows.test.ts:2` `import { laneRows } from './lane-rows.ts';`

### `src/editor/motion/ui/lane-rows.ts`
- **Lote:** L08
- **Linhas:** 23
- **SHA1:** f42076a4f034038f30086fe63d210d482960e0e2
- **Partes lidas:** 1-23
- **Propósito:** A fileira de cada barra de uma faixa: põe cada barra na primeira fileira cujas barras terminam antes do seu início, para que toda barra seja vista e pressionada inteira, e diz quantas fileiras a faixa tem.
- **Âncora:** `src/editor/motion/ui/lane-rows.ts:4` `export interface Span {`

### `src/editor/motion/ui/motion.css`
- **Lote:** L08
- **Linhas:** 377
- **SHA1:** 3be7eb89f306c7fa07816cb784ac97c248d28609
- **Partes lidas:** 1-377
- **Propósito:** Os estilos das superfícies de motion: os cartões e os comportamentos da aba de interações e o eixo de segundos, as faixas, as barras, os quadros-chave, os marcadores e o playhead da timeline, com todos os valores vindos dos tokens.
- **Âncora:** `src/editor/motion/ui/motion.css:4` `.motion-interactions {`

### `src/editor/motion/ui/options.ts`
- **Lote:** L08
- **Linhas:** 128
- **SHA1:** 9e599414484f12929410464da7c61f85abb921cc
- **Partes lidas:** 1-128
- **Propósito:** O que as superfícies de motion oferecem em cada campo: as opções que o efeito de uma ação mostra por seu tipo, com os valores que o campo lista, as palavras com que um valor é mostrado, os controles por gatilho e os campos próprios de uma interação.
- **Âncora:** `src/editor/motion/ui/options.ts:12` `export type OptionField =`

### `src/editor/motion/ui/timeline.tsx`
- **Lote:** L08
- **Linhas:** 455
- **SHA1:** 05fe3ef384b6b2d92a8f2aadd11a8625d9294ff4
- **Partes lidas:** 1-455
- **Propósito:** A timeline de motion do editor: as timelines do projeto à esquerda e, à direita, o eixo de segundos com zoom, régua, playhead com leitura, marcadores e uma faixa por alvo com as ações em barras mais uma faixa por propriedade com quadros-chave, e abaixo os campos da seleção; todo controle é uma porta do manifesto e os arrastes são do dono do ponteiro.
- **Âncora:** `src/editor/motion/ui/timeline.tsx:400` `export function MotionTimelinePanel() {`

### `src/editor/motion/use-canvas-motion.ts`
- **Lote:** L08
- **Linhas:** 118
- **SHA1:** b7849769939d14879f98123240879eff3bf19708
- **Partes lidas:** 1-118
- **Propósito:** O motion do canvas: o que o quadro do canvas roda dentro do seu iframe (as interações com a execução ligada e a timeline aberta no playhead durante a pré-visualização), mais o caminhar do playhead enquanto a pré-visualização toca e o relato de problemas na barra de status e no registro de incidentes.
- **Âncora:** `src/editor/motion/use-canvas-motion.ts:62` `export function useCanvasMotion(frameWindow: () => Window | null, page: unknown): void {`

### `src/editor/palette/palette-rank.test.ts`
- **Lote:** L06
- **Linhas:** 24
- **SHA1:** 3d6cdc5329942da1d2b291bed6145fd1c0cc334a
- **Partes lidas:** 1-24
- **Propósito:** Verifica a ordem de resposta da busca da paleta de Inserir: o nome, as palavras dele, os sinônimos e a tag.
- **Âncora:** `src/editor/palette/palette-rank.test.ts:6` `describe('the palette search', () => {`

### `src/editor/palette/palette.ts`
- **Lote:** L06
- **Linhas:** 77
- **SHA1:** 30abd4754c893f5aff2e60a2f7b3a6488f853d36
- **Partes lidas:** 1-77
- **Propósito:** Guarda o estado do painel de Elementos (grupos recolhidos e densidade) e ordena as entradas da busca por nome, sinônimos e tag.
- **Âncora:** `src/editor/palette/palette.ts:51` `export function paletteRank(query: string, label: string, tag: string | null, also: readonly string[] = []): number | null {`

### `src/editor/persistence/autosave-recovery.test.ts`
- **Lote:** L05a
- **Linhas:** 28
- **SHA1:** a59ebc7259034ff3404274cdd6b7b3e899fd1f7a
- **Partes lidas:** 1-28
- **Propósito:** prova que um trabalho feito enquanto a recuperação é exigida faz a saída da aba perguntar antes.
- **Âncora:** `src/editor/persistence/autosave-recovery.test.ts:20` `const stop = startAutosave(store, { revision: 4, format: 3, document: { broken: true }, selection: [] }, false);`

### `src/editor/persistence/autosave.ts`
- **Lote:** L05a
- **Linhas:** 410
- **SHA1:** 0a92fd66482a7d604862e275fd58f89f95000f8b
- **Partes lidas:** 1-410
- **Propósito:** o autosave: grava o documento e a seleção a cada mudança confirmada, primeiro no diário e depois no IndexedDB, guarda versões, lê o trabalho salvo e o restaura, e mantém o estado de gravação e a guarda de saída.
- **Âncora:** `src/editor/persistence/autosave.ts:226` `export function startAutosave<Ui>(store: Store<Ui>, saved: SavedWork | null | undefined, restored: boolean, canWrite: () => boolean = () => true): () => void {`

### `src/editor/persistence/drafts.ts`
- **Lote:** L05a
- **Linhas:** 200
- **SHA1:** d2027725af6e687fd5be31285093a43650b68b52
- **Partes lidas:** 1-200
- **Propósito:** a edição não confirmada da aba: o rascunho de um campo e o de um texto no canvas, com o contexto em que a digitação começou, guardados na sessão e restaurados na mesma revisão.
- **Âncora:** `src/editor/persistence/drafts.ts:152` `export function startDrafts(owner: EditorStore, currentRevision: () => number, canWrite: () => boolean): () => void {`

### `src/editor/persistence/tab-guard.ts`
- **Lote:** L05a
- **Linhas:** 68
- **SHA1:** 70c8beb0cc07d8275ab436a43de55b688564ce95
- **Partes lidas:** 1-68
- **Propósito:** a guarda de abas: uma aba edita por vez pelo Web Locks, com o papel editando, somente leitura ou perdido, e a tomada de edição que rouba a trava e recarrega.
- **Âncora:** `src/editor/persistence/tab-guard.ts:34` `export function claimEditing(): Promise<void> {`

### `src/editor/preferences/browser-locale.test.ts`
- **Lote:** L05b
- **Linhas:** 18
- **SHA1:** f515f87a578c0cc3b308a02a7e92eb119d54215b
- **Partes lidas:** 1-18
- **Propósito:** Testes do idioma com que o editor abre sem escolha guardada: o primeiro idioma do navegador que o editor fala, exato ou pela etiqueta principal, e a escolha da pessoa quando guardada.
- **Âncora:** `src/editor/preferences/browser-locale.test.ts:5` `const none = { read: () => null, write: () => {} };`

### `src/editor/preferences/preferences.ts`
- **Lote:** L05b
- **Linhas:** 263
- **SHA1:** 6546336b8c8087c8b3e3a6a67ed152a4ba5580f4
- **Partes lidas:** 1-263
- **Propósito:** Preferências do editor: idioma, tema, seções e linhas recolhidas, densidade da paleta, zoom, interruptores de vista, quebra de tela e tamanhos de divisores, lidas da storage com validação contra o manifesto, guardadas a cada mudança e restauradas após recarregar.
- **Âncora:** `src/editor/preferences/preferences.ts:108` `export const RECENT_COLOURS = 10;`

### `src/editor/preferences/said.ts`
- **Lote:** L05b
- **Linhas:** 32
- **SHA1:** 5be542c5b32f9181447ae616d78897a46bddc39e
- **Partes lidas:** 1-32
- **Propósito:** Mensagens da barra de status para mudanças de preferência: o nome do comando e o rótulo do valor escolhido, lidos do manifesto.
- **Âncora:** `src/editor/preferences/said.ts:20` `export function chosen(command: CommandId, args: Readonly<Record<string, unknown>>): Message {`

### `src/editor/project/page-follows.test.ts`
- **Lote:** L05b
- **Linhas:** 29
- **SHA1:** 4bfc887f5a1579b322e5a5a30698b88dac8b3ecc
- **Partes lidas:** 1-29
- **Propósito:** Testes de pageFollowsSelection: abre a página de uma seleção restaurada em outra página e deixa a página como está quando a seleção está nela ou vazia.
- **Âncora:** `src/editor/project/page-follows.test.ts:1` `import { describe, expect, it } from 'vitest';`

### `src/editor/project/page-follows.ts`
- **Lote:** L05b
- **Linhas:** 20
- **SHA1:** c5e89381934a8620a14b7f4cda6bf793d917e4cc
- **Partes lidas:** 1-20
- **Propósito:** A página mostrada segue a seleção: quando o primeiro nó selecionado está em outra página, o estado do editor passa a mostrar essa página.
- **Âncora:** `src/editor/project/page-follows.ts:9` `export function pageFollowsSelection(state: StoreState<EditorUi>): EditorUi {`

### `src/editor/quick-panel/quick-panel.test.ts`
- **Lote:** L06
- **Linhas:** 37
- **SHA1:** c105588e29e951f5970167a3e45923197ee105eb
- **Partes lidas:** 1-37
- **Propósito:** Verifica o lugar do chip e do painel rápido: à direita do rótulo, encostados, no deslocamento lembrado da pessoa e além da borda do palco.
- **Âncora:** `src/editor/quick-panel/quick-panel.test.ts:14` `describe('placeQuickPanel (src/editor/quick-panel/quick-panel.ts)', () => {`

### `src/editor/quick-panel/quick-panel.ts`
- **Lote:** L06
- **Linhas:** 105
- **SHA1:** 0dc5e26e5bc0092ace6a9c87187eee26dd0672b4
- **Partes lidas:** 1-105
- **Propósito:** Guarda o painel rápido (aberto e o deslocamento por elemento), calcula onde ficam o chip e o painel e decide quais campos se aplicam ao elemento selecionado.
- **Âncora:** `src/editor/quick-panel/quick-panel.ts:50` `export const setOpen = registerHandler<'quickPanel.setOpen', EditorUi>('quickPanel.setOpen', ({ state }, { open }) => {`

### `src/editor/shell/asset-picker.ts`
- **Lote:** L09a
- **Linhas:** 27
- **SHA1:** a53c82e4f8604521ea3b435779d2c1ef61200f1b
- **Partes lidas:** 1-27
- **Propósito:** Guarda o estado do seletor de imagens (ui.assetPicker) e registra os comandos que o abrem e o fecham, fechando-o também quando uma escrita de atributo o completa.
- **Âncora:** `src/editor/shell/asset-picker.ts:5` `import { registerHandler, type RegisteredHandler } from '../../core/commands/registry.ts';`

### `src/editor/shell/asset-picker.tsx`
- **Lote:** L09a
- **Linhas:** 87
- **SHA1:** 338e5c16890d830989453e1e48260e20b426ec8f
- **Partes lidas:** 1-87
- **Propósito:** A vista do seletor de imagens do projeto: campo de busca, miniaturas com nome e tamanho, cada uma uma porta que escreve o caminho no atributo do campo, sobre uma proteção fechada pelo botão, pelo clique e pelo Escape.
- **Âncora:** `src/editor/shell/asset-picker.tsx:26` `const PICKER_CONTEXT = 'asset-picker';`

### `src/editor/shell/batch-rename.tsx`
- **Lote:** L09a
- **Linhas:** 79
- **SHA1:** 3f74d327634a3b4323aa008d7691f83614caaed1
- **Partes lidas:** 1-79
- **Propósito:** O diálogo de renomeação em lote: mostra o padrão com {name} e {n}, o número inicial e a prévia dos nomes conforme se digita, e aplica element.renameMany fechando o diálogo ao concluir.
- **Âncora:** `src/editor/shell/batch-rename.tsx:26` `const START_PATTERN = '{name} {n}';`

### `src/editor/shell/bodies.ts`
- **Lote:** L09a
- **Linhas:** 34
- **SHA1:** e045c3071fbeaf7987b77d620ea4fb9f4647ba3a
- **Partes lidas:** 1-34
- **Propósito:** Responde se um painel tem corpo a partir das tabelas que o shell desenha (vistas da barra lateral, abas do dock, seções), resposta entregue às portas pelo contexto PanelBodies.
- **Âncora:** `src/editor/shell/bodies.ts:10` `export type BodyTable = Readonly<Partial<Record<Panel, ComponentType>>>;`

### `src/editor/shell/breakpoint-tabs.tsx`
- **Lote:** L09a
- **Linhas:** 71
- **SHA1:** 6500eb3ecdbf6a0833dfb34382d04aaa59b8da27
- **Partes lidas:** 1-71
- **Propósito:** Desenha as abas de breakpoint da moldura e da barra de pré-visualização: uma porta por breakpoint padrão, a porta do projeto para os criados, todas desenhadas onde a primeira porta de aba está.
- **Âncora:** `src/editor/shell/breakpoint-tabs.tsx:25` `const isTab = (entry: DoorEntry): boolean => {`

### `src/editor/shell/breakpoints-dialog.tsx`
- **Lote:** L09a
- **Linhas:** 216
- **SHA1:** d51afc4c5e2dc2d41a40a9b334bd200634a025e4
- **Partes lidas:** 1-216
- **Propósito:** O diálogo de breakpoints: por breakpoint, os campos de nome e largura (Enter ou sair do campo grava) e a lixeira com o menu de destino dos estilos; mostra a largura da tela exibida e o botão de adicionar um breakpoint nessa largura.
- **Âncora:** `src/editor/shell/breakpoints-dialog.tsx:23` `const DIALOG = 'breakpoints';`

### `src/editor/shell/canvas-editing.css`
- **Lote:** L09a
- **Linhas:** 741
- **SHA1:** dbe05e6160550e1dfcb1482e70b343d9acea7304
- **Partes lidas:** 1-741
- **Propósito:** Estilos das camadas desenhadas sobre o palco: o painel rápido e seu chip, as abas de âncora, as faixas de Editar na tela (padding, margem, divisória), as alças diretas, os menus do painel rápido e as miniaturas do seletor de imagens.
- **Âncora:** `src/editor/shell/canvas-editing.css:40` `.anchor-tab__dot {`

### `src/editor/shell/canvas.css`
- **Lote:** L09a
- **Linhas:** 1460
- **SHA1:** d4088bb75362e2e45bcf7dc4dddfa7a0bf5b6de0
- **Partes lidas:** 1-1441; 1442-1460
- **Propósito:** Estilos da coluna central: abas de arquivo, barra de ferramentas do canvas, palco e réguas, a moldura com as abas de breakpoint e o chrome do canvas (seleção, alças, rotação, grades, guias, medições e indicadores de arrasto).
- **Âncora:** `src/editor/shell/canvas.css:39` `.file-tabs {`

### `src/editor/shell/canvas.tsx`
- **Lote:** L09a
- **Linhas:** 331
- **SHA1:** 4e11defb9e84c9bec62c244b67e1aa5b0ecf5251
- **Partes lidas:** 1-331
- **Propósito:** A coluna central: abas de arquivo, barra de ferramentas com o seletor Canvas/Split/Código e dicas, réguas, a moldura com as abas de breakpoint, emblemas de estado e de breakpoint, a borda de largura e o iframe da página na câmera.
- **Âncora:** `src/editor/shell/canvas.tsx:33` `const NO_CODE: readonly string[] = [];`

### `src/editor/shell/capture-url.tsx`
- **Lote:** L09a
- **Linhas:** 61
- **SHA1:** ef6275c6cbd2ebf8ae2e9279b21fdba9eacb0d32
- **Partes lidas:** 1-61
- **Propósito:** O diálogo Abrir um endereço da web: campos do endereço e do número de páginas, avisos e o botão que envia project.captureUrl e fecha o diálogo.
- **Âncora:** `src/editor/shell/capture-url.tsx:17` `const DIALOG = 'capture-url';`

### `src/editor/shell/captured-inspector.css`
- **Lote:** L09a
- **Linhas:** 68
- **SHA1:** ae98d00a392484184a604e2c046971d2ac2f561c
- **Partes lidas:** 1-68
- **Propósito:** Estilos do inspector de página capturada: a lista de nós com suas linhas, o formulário de edição e os blocos de código com rolagem.
- **Âncora:** `src/editor/shell/captured-inspector.css:26` `.captured-inspector__list {`

### `src/editor/shell/captured-inspector.tsx`
- **Lote:** L09a
- **Linhas:** 126
- **SHA1:** d402604d8c38cbc5a1b7d093c72e1f9a9368d08b
- **Partes lidas:** 1-126
- **Propósito:** O inspector de uma página capturada: busca e lista os nós com os problemas de recursos, seleciona e edita um nó (texto, atributo, inserir, remover, mover) e mostra o HTML formatado e os CSS do projeto.
- **Âncora:** `src/editor/shell/captured-inspector.tsx:94` `export function CapturedInspector() {`

### `src/editor/shell/class-bar.tsx`
- **Lote:** L09a
- **Linhas:** 230
- **SHA1:** ddf80706ceff6ed70777848e55012194c6e3b2aa
- **Partes lidas:** 1-230
- **Propósito:** Os controles de classe da barra de seleção: chips de alvo (Elemento e cada classe com seu ×), + Class com a lista e o campo de novo nome, salvar os estilos como classe, a linha de quantos elementos a classe afeta e as ações de mover os estilos e aplicar a classe.
- **Âncora:** `src/editor/shell/class-bar.tsx:40` `const ELEMENT = 'element';`

### `src/editor/shell/code-pane.tsx`
- **Lote:** L09a
- **Linhas:** 173
- **SHA1:** 645409f2269e6d1971253800791285ecdc12865d
- **Partes lidas:** 1-173
- **Propósito:** O painel de código: abas por tipo ou o arquivo aberto, linhas coloridas marcadas e clicáveis pelo elemento selecionado e um campo de edição com os botões de aplicar, copiar, baixar e salvar.
- **Âncora:** `src/editor/shell/code-pane.tsx:74` `export function CodePane() {`

### `src/editor/shell/color.tsx`
- **Lote:** L09a
- **Linhas:** 517
- **SHA1:** 6b6b26b609fdafff05d53756c81de6afab4474e3
- **Partes lidas:** 1-517
- **Propósito:** O seletor de cor: área de saturação e brilho, sliders de matiz e alfa, campo de texto e canais por formato, cores salvas, recentes e variáveis, conta-gotas, linha de contraste e Cancel/Apply pela sessão do seletor.
- **Âncora:** `src/editor/shell/color.tsx:47` `const BLACK: Rgba = { r: 0, g: 0, b: 0, a: 1 };`

### `src/editor/shell/command-bar.tsx`
- **Lote:** L09a
- **Linhas:** 284
- **SHA1:** a3ebca5b15cfdf7be032d7c7d4215db0ce71ca15
- **Partes lidas:** 1-284
- **Propósito:** A barra de comandos: busca com pílulas de escopo sobre as entradas (comandos, abas, propriedades, páginas, camadas e classes), cada uma com rótulo, menu de origem e atalho, com o foco no campo e as setas movendo a entrada ativa.
- **Âncora:** `src/editor/shell/command-bar.tsx:27` `const LIST_ID = 'command-bar-list';`

### `src/editor/shell/component-prompt.ts`
- **Lote:** L09a
- **Linhas:** 23
- **SHA1:** bae8206678062b1441cc9990ff77abdeb36eed8f
- **Partes lidas:** 1-23
- **Propósito:** O estado do aviso de nome de componente: abre com o nó da seleção (recusando quando um componente não pode ser criado ali) e fecha com components.closePrompt.
- **Âncora:** `src/editor/shell/component-prompt.ts:17` `if (state.ui.componentPrompt?.node === node) return { kind: 'change' };`

### `src/editor/shell/component-prompt.tsx`
- **Lote:** L09a
- **Linhas:** 78
- **SHA1:** 3cbd4739398d53989a12cd248b948692ad2c7771
- **Partes lidas:** 1-78
- **Propósito:** A vista do aviso de nome de componente: painel sobre proteção com o campo preenchido e selecionado com o nome do elemento, que entrega a components.create o nome digitado.
- **Âncora:** `src/editor/shell/component-prompt.tsx:19` `const FORM_ID = 'component-prompt-name';`

### `src/editor/shell/concept-row.tsx`
- **Lote:** L09a
- **Linhas:** 70
- **SHA1:** 1182b7368a59043361202c37118bb7342be437f6
- **Partes lidas:** 1-70
- **Propósito:** Uma linha de conceito da aba Estilo: o disclosure na calha, o cabeçalho com os campos ou o rótulo e o resumo dos valores, e os detalhes agrupados quando aberta.
- **Âncora:** `src/editor/shell/concept-row.tsx:52` `function useRowSummary(row: ConceptRow): string {`

### `src/editor/shell/confirmation.tsx`
- **Lote:** L09a
- **Linhas:** 75
- **SHA1:** e61f50fcd38a1a20069dd4d9e5895a48d2a39a36
- **Partes lidas:** 1-75
- **Propósito:** A confirmação que um dispatch aguarda: diálogo modal com a pergunta do manifesto e as duas respostas, foco em Cancelar, foco preso dentro do diálogo e Escape respondendo Cancelar, com a resposta voltando à store.
- **Âncora:** `src/editor/shell/confirmation.tsx:56` `<div className="confirmation" data-confirmation-dialog>`

### `src/editor/shell/crumb-fold.test.ts`
- **Lote:** L09a
- **Linhas:** 37
- **SHA1:** 16ba4beac71665536ae01dd3a27174c475e217ea
- **Partes lidas:** 1-37
- **Propósito:** Testes de crumbsAfterFold: nada dobra enquanto tudo cabe, a raiz e os últimos níveis ficam, o nível selecionado nunca dobra e a dobra de nada entre a raiz e o nível selecionado não existe.
- **Âncora:** `src/editor/shell/crumb-fold.test.ts:7` `const CRUMBS = [50, 60, 60, 60, 60, 60];`

### `src/editor/shell/crumb-fold.ts`
- **Lote:** L09a
- **Linhas:** 25
- **SHA1:** e4d72ca8feb218886bd71194c7e391bfa41ac5f6
- **Partes lidas:** 1-25
- **Propósito:** Calcula quantos níveis finais da trilha da barra de status ficam depois da dobra, mantendo a raiz e o nível selecionado e dobrando os níveis do meio num botão de reticências.
- **Âncora:** `src/editor/shell/crumb-fold.ts:11` `export function crumbsAfterFold(widths: readonly number[], more: number, room: number): number | null {`

### `src/editor/shell/css-contracts.test.ts`
- **Lote:** L09a
- **Linhas:** 35
- **SHA1:** 50b6091b60f76172aa949692a360c886ce713807
- **Partes lidas:** 1-35
- **Propósito:** Testes que leem os estilos do shell como o navegador os cascateia: o editor do painel de código não silencia o anel de foco (FR1), a máscara de seleção usa classe própria (CL2) e selects e textareas herdam a tipografia da interface (TY1).
- **Âncora:** `src/editor/shell/css-contracts.test.ts:24` `const editor = rule(css('canvas.css'), '.code-pane__editor');`

### `src/editor/shell/dialog.tsx`
- **Lote:** L09a
- **Linhas:** 55
- **SHA1:** 1e7e5cba57e705ef5b518cc4cbbcbbd202eb1d00
- **Partes lidas:** 1-55
- **Propósito:** O diálogo modal do editor: scrim, título e botão de fechar, foco preso com as bordas, contexto de teclas do diálogo e devolução do foco ao controle que o abriu.
- **Âncora:** `src/editor/shell/dialog.tsx:15` `export const DIALOG_KEYS = 'dialog';`

### `src/editor/shell/dock.css`
- **Lote:** L09a
- **Linhas:** 269
- **SHA1:** 59a55320ab970ab8bfa6eb3accac9e5522654b16
- **Partes lidas:** 1-269
- **Propósito:** Estilos do dock inferior: a faixa de abas com distintivo e a espiada da primeira pendência, o corpo dos painéis, a aba de atalhos de teclado, o JSON do documento e as linhas do painel de Checks.
- **Âncora:** `src/editor/shell/dock.css:16` `.dock-strip {`

### `src/editor/shell/dock.tsx`
- **Lote:** L09a
- **Linhas:** 238
- **SHA1:** f00a9e02df6402b2995aefdfc20a55215b835a02
- **Partes lidas:** 1-238
- **Propósito:** O dock inferior: a faixa com uma aba por painel aberto (abrir, fechar, maximizar e mais painéis) e o corpo do painel ativo (Timeline, Motion, Document, Checks, Shortcuts).
- **Âncora:** `src/editor/shell/dock.tsx:24` `const TAB = doorSlots('tab-strip')[0];`

### `src/editor/shell/easing-curve.tsx`
- **Lote:** L09a
- **Linhas:** 131
- **SHA1:** a82bfd95303954e5e8499a0961838b84c20e6318
- **Partes lidas:** 1-131
- **Propósito:** O editor de curva de aceleração: botão com a curva do valor que abre um popover com as easings prontas desenhadas e os quatro números de um cubic-bezier, aplicando a escolhida pela porta do campo.
- **Âncora:** `src/editor/shell/easing-curve.tsx:17` `const SAMPLES = 48;`

### `src/editor/shell/field-face.test.ts`
- **Lote:** L09a
- **Linhas:** 22
- **SHA1:** f27d238dceb557d5cdb1b48d0c64eea39dee2262
- **Partes lidas:** 1-22
- **Propósito:** Testes de compactFieldValue: cor transparente, cor opaca em hexadecimal, cor translúcida com a opacidade ao lado, cor ilegível deixada como digitada e comprimento partido em número e unidade.
- **Âncora:** `src/editor/shell/field-face.test.ts:6` `describe('compactFieldValue', () => {`

### `src/editor/shell/field-face.tsx`
- **Lote:** L09a
- **Linhas:** 51
- **SHA1:** df7271a26dc0d9bd78b653e18342d6fde8d4a6a0
- **Partes lidas:** 1-51
- **Propósito:** A face compacta de um campo: a aparência da origem (useFieldAppearance), a leitura de repouso de cores e comprimentos (compactFieldValue) e as peças da vista do valor e do distintivo de origem.
- **Âncora:** `src/editor/shell/field-face.tsx:10` `export function useFieldAppearance(properties: readonly string[], mixed = false) {`

### `src/editor/shell/field-origin.tsx`
- **Lote:** L09a
- **Linhas:** 96
- **SHA1:** 5dc3e70ac742b1648a36ef6d4640187dbfe09e00
- **Partes lidas:** 1-96
- **Propósito:** A nota detalhada de origem de um campo: mostra de onde vem o valor (aqui, breakpoint, estado, classe, herdado) e, com o campo em foco e o valor vindo de outro lugar, onde a digitação grava.
- **Âncora:** `src/editor/shell/field-origin.tsx:22` `function useFocusWithin(ref: string): boolean {`

### `src/editor/shell/field.tsx`
- **Lote:** L09a
- **Linhas:** 1841
- **SHA1:** 476a00c3f0f0ef68ed674df59b8ca2e2c0a6cd7f
- **Partes lidas:** 1-721; 722-1517; 1518-1841
- **Propósito:** O componente de campo do inspector: número e comprimento com menu de unidades, passos, scrub no rótulo, menu de valores, reset e rascunho (regras G1 e G2), além dos campos de texto, de atributo e do texto do elemento.
- **Âncora:** `src/editor/shell/field.tsx:66` `const NUMBER_FIELD_CONTEXT: KeyContextId = 'number-field';`

### `src/editor/shell/float.test.ts`
- **Lote:** L09a
- **Linhas:** 53
- **SHA1:** 4942d2868b9d5548d1a2cefbdd147f2ff497c38b
- **Partes lidas:** 1-53
- **Propósito:** Testes de floatBelow, floatBeside e pointAnchor: abertura sob ou acima da âncora, dentro da janela, a altura máxima de uma camada mais alta que a janela e o submenu ao lado do item.
- **Âncora:** `src/editor/shell/float.test.ts:4` `const VIEW = { width: 1000, height: 800 };`

### `src/editor/shell/float.ts`
- **Lote:** L09a
- **Linhas:** 55
- **SHA1:** c0abea827d6a230ca8adb3f60ee65b964ec0422d
- **Partes lidas:** 1-55
- **Propósito:** Onde uma camada flutuante é desenhada: sob a âncora ou acima dela quando não há espaço, sempre dentro da janela com uma margem, com altura limitada quando mais alta que a janela; o submenu ao lado e o ponto do menu de contexto.
- **Âncora:** `src/editor/shell/float.ts:25` `export function floatBelow(anchor: Box, size: Size, view: Size, edge: number, gap = 0): Placed {`

### `src/editor/shell/gradient.tsx`
- **Lote:** L09a
- **Linhas:** 194
- **SHA1:** 5eb84c63d6bbb0cfa10aedbeb9279c65bc003850
- **Partes lidas:** 1-194
- **Propósito:** O editor de gradiente: botões de adicionar, remover, reverter, distribuir e adicionar parada, os três tipos com o ângulo lembrado, a barra com as paradas arrastáveis e os campos de cor, posição e ângulo.
- **Âncora:** `src/editor/shell/gradient.tsx:25` `const TYPES: readonly GradientType[] = ['linear', 'radial', 'conic'];`

### `src/editor/shell/guides-grids.tsx`
- **Lote:** L09a
- **Linhas:** 192
- **SHA1:** 8cda24c1e4411471fb1b3fab69d807c9438f9109
- **Partes lidas:** 1-192
- **Propósito:** O diálogo de guias e grades: as seções com interruptores, adicionar guia por eixo com campo de posição, a lista de guias da página com remover e os campos das configurações de cada grade.
- **Âncora:** `src/editor/shell/guides-grids.tsx:32` `const DIALOG = 'guides-grids';`

### `src/editor/shell/html-import.tsx`
- **Lote:** L09a
- **Linhas:** 37
- **SHA1:** 4a450e2bbe0d9ab2c0cdcf71ff0836aefd78c0a6
- **Partes lidas:** 1-37
- **Propósito:** O diálogo de importação de HTML: lista os arquivos da escolha e oferece os destinos possíveis com suas dicas, focando o destino padrão e mostrando mensagens de importação.
- **Âncora:** `src/editor/shell/html-import.tsx:10` `const CHOICES = doorSlots('html-import');`

### `src/editor/shell/inspector-controls.tsx`
- **Lote:** L09a
- **Linhas:** 618
- **SHA1:** ca9abad44e1270ddd8ccee87d6080951bb6b58e7
- **Partes lidas:** 1-618
- **Propósito:** Os controles da aba Estilo: o alvo e o campo de cada porta (comprimento, palavras-chave, cor, imagem, borda, parte de função), a caixa de espaçamento com link, os itens e as faixas de grade e o controle de âncoras.
- **Âncora:** `src/editor/shell/inspector-controls.tsx:51` `export const targetOf = (entry: DoorEntry): Target | null => {`

### `src/editor/shell/inspector-settings.tsx`
- **Lote:** L09a
- **Linhas:** 422
- **SHA1:** 24f4f61d0af7fe74d7a019fcc21872c8e6b9b3a7
- **Partes lidas:** 1-422
- **Propósito:** A aba Settings: os campos dos atributos que se aplicam ao tipo do elemento selecionado, alternadores booleanos, partes de tabela, atributos próprios da pessoa, alvo de rótulo, idioma do projeto e variante de componente.
- **Âncora:** `src/editor/shell/inspector-settings.tsx:353` `export function SettingsTab({ head = null }: { readonly head?: ReactNode } = {}) {`

### `src/editor/shell/inspector.css`
- **Lote:** L09a
- **Linhas:** 1609
- **SHA1:** c6e6e44e35e2779f222a49887b7207496ebd9f5e
- **Partes lidas:** 1-1280; 1281-1609
- **Propósito:** Estilos do inspector: cabeçalho e abas, a barra de seleção com chips de alvo e escolha de estado, as seções com ponto de origem e resumo, o campo (caixa, unidade, passos, valores), a caixa de espaçamento, linhas de conceito e valores prontos.
- **Âncora:** `src/editor/shell/inspector.css:3` `.inspector {`

### `src/editor/shell/inspector.tsx`
- **Lote:** L09a
- **Linhas:** 799
- **SHA1:** 36dfc5928dbf06ba97db038981da524b97ddee35
- **Partes lidas:** 1-738; 739-799
- **Propósito:** O inspector: cabeçalho com abas e ações, a aba Style (barra de seleção, legenda de origem, busca de propriedades, as seções com linhas de conceito e a matriz de alinhamento), Settings, Interactions e o inspector de página capturada.
- **Âncora:** `src/editor/shell/inspector.tsx:713` `export function Inspector() {`

### `src/editor/shell/interactions.tsx`
- **Lote:** L09a
- **Linhas:** 239
- **SHA1:** 0cdaa65d1cc54a4033bf06e914d8e71afd3191fc
- **Partes lidas:** 1-239
- **Propósito:** A aba Interactions: o cabeçalho com o elemento e Add e um cartão por interação (escopo, gatilho, ação, valor, nova aba, alvo e opções) com Remove, as interações de movimento e a porta de escolher alvo nas Camadas.
- **Âncora:** `src/editor/shell/interactions.tsx:186` `export function InteractionsTab() {`

### `src/editor/shell/link-picker.ts`
- **Lote:** L09b
- **Linhas:** 53
- **SHA1:** 29d065137f0c113010933a7ca00c96d379870737
- **Partes lidas:** 1-53
- **Propósito:** O estado do seletor de link (ui.linkPicker) e os três comandos que o abrem, trocam o tipo do link e o fecham, além da leitura do tipo de um href guardado e do fechamento quando uma página ou uma âncora é escolhida.
- **Âncora:** `src/editor/shell/link-picker.ts:11` `export function linkKindOf(document: DocumentJson, href: string): string {`

### `src/editor/shell/link-picker.tsx`
- **Lote:** L09b
- **Linhas:** 127
- **SHA1:** 95cdc8ceb9ccd464e43e00919faa6cc8261d1348
- **Partes lidas:** 1-127
- **Propósito:** A vista do seletor de link: os cinco tipos num grupo segmentado, o campo do endereço com o tipo de entrada da espécie, as listas de páginas do projeto e de elementos com id da página aberta, o aviso de âncora nenhuma e o fechamento pelo botão, pelo escudo e pelo Escape.
- **Âncora:** `src/editor/shell/link-picker.tsx:46` `export function LinkPicker() {`

### `src/editor/shell/menus.css`
- **Lote:** L09b
- **Linhas:** 161
- **SHA1:** eae94f4146f4afa52373fc064f1f76442dff9f56
- **Partes lidas:** 1-161
- **Propósito:** Os estilos dos menus: a âncora e o botão, o painel do menu com os itens, separador, motivo e atalhos, o submenu fixo à janela, o pano de fundo que fecha ao clique e o menu de contexto no ponteiro.
- **Âncora:** `src/editor/shell/menus.css:123` `.overlay-backdrop {`

### `src/editor/shell/outside-layer.test.tsx`
- **Lote:** L09b
- **Linhas:** 46
- **SHA1:** 933aabfcb22e1adf4d76e5875f1c002763539fd4
- **Partes lidas:** 1-46
- **Propósito:** Teste (happy-dom) das camadas não modais: um filho em portal protege o painel pai, uma pressão fora dispensa ambos, e a limpeza ao desmontar retira a inscrição de cada camada.
- **Âncora:** `src/editor/shell/outside-layer.test.tsx:12` `const store = {} as EditorStore;`

### `src/editor/shell/outside-layer.ts`
- **Lote:** L09b
- **Linhas:** 59
- **SHA1:** c930e09b286068443efa414e4b53bf5b9ecf43cf
- **Partes lidas:** 1-59
- **Propósito:** A política única das camadas não modais: as camadas abertas de cada editor num WeakMap, com a pressão de fora publicada pelo dono do ponteiro dispensando as que estão fora, a proteção do filho em portal pelo gatilho e a restauração do foco ao fechar.
- **Âncora:** `src/editor/shell/outside-layer.ts:14` `const LAYERS = new WeakMap<EditorStore, Set<Layer>>();`

### `src/editor/shell/panel-editors.css`
- **Lote:** L09b
- **Linhas:** 598
- **SHA1:** 9df28ab7e5172f34c1ad0f6a1a97a10119465fbe
- **Partes lidas:** 1-598
- **Propósito:** Os estilos dos editores de campos: o toast, os chips de cor e amostras, o seletor de cor, o editor de gradiente com seus stops, o editor de sombra com linhas e almofada de luz, a proveniência de valores no inspetor, o modo do inspetor com Adicionar uma propriedade e a curva de easing com sua janela.
- **Âncora:** `src/editor/shell/panel-editors.css:4` `.toast {`

### `src/editor/shell/panel-field-draft.test.tsx`
- **Lote:** L09b
- **Linhas:** 44
- **SHA1:** 4bab0f982fc6ab87506d3c24e00179eb05c697cf
- **Partes lidas:** 1-44
- **Propósito:** Teste (FD2, happy-dom) de que um campo de painel deixado sem guardar o que foi digitado volta a mostrar o valor do documento.
- **Âncora:** `src/editor/shell/panel-field-draft.test.tsx:17` `it('drops the draft when the focus leaves the field', () => {`

### `src/editor/shell/panel-field.tsx`
- **Lote:** L09b
- **Linhas:** 180
- **SHA1:** 01e98c1d15dae327e88ad9671ae01d160b02e8aa
- **Partes lidas:** 1-180
- **Propósito:** O campo de texto de um painel (PanelField) e o botão de painel (PanelButton): o controle de uma porta panel-control desenhado como o manifesto diz, com o argumento de texto lido do próprio contrato da porta, a lista de valores oferecidos como datalist, o rascunho que some ao sair do campo e o botão de curva de easing.
- **Âncora:** `src/editor/shell/panel-field.tsx:33` `export function PanelField({`

### `src/editor/shell/panels.css`
- **Lote:** L09b
- **Linhas:** 135
- **SHA1:** 2489e39bc2e997c3996278027f6a6971d448008c
- **Partes lidas:** 1-135
- **Propósito:** Os estilos dos painéis que saíram do lugar: a linha do centro com o canvas e o dock direito, as áreas de painel com cabeçalho, grip de arraste, abas e corpo, as empilhadas, a janela flutuante e a dica de encaixe com o rótulo.
- **Âncora:** `src/editor/shell/panels.css:4` `.workbench__row {`

### `src/editor/shell/popover.tsx`
- **Lote:** L09b
- **Linhas:** 98
- **SHA1:** 10a52f00abc219123990214909434183f354da1d
- **Partes lidas:** 1-98
- **Propósito:** O popover padrão de uma camada que flutua ao lado do controle que a abriu: aberto até uma dispensa mais nova, colocado no portal sob a âncora por floatBelow, fechado por pressão externa e pelo Escape, com o foco entrando na camada e voltando ao gatilho quando desce com a dispensa; inclui o usePopover.
- **Âncora:** `src/editor/shell/popover.tsx:24` `export function usePopover(trigger: RefObject<HTMLElement | null>): PopoverState {`

### `src/editor/shell/preview.tsx`
- **Lote:** L09b
- **Linhas:** 75
- **SHA1:** df0ec2a9faa8c8d31b13854510039213e825cc69
- **Partes lidas:** 1-75
- **Propósito:** A barra de pré-visualização com as abas de breakpoint e a página da pré-visualização, exportada e desenhada num quadro isolado na largura do breakpoint ativo, com o relay de Escape e Ctrl+Enter do quadro para a barra.
- **Âncora:** `src/editor/shell/preview.tsx:17` `export function PreviewBar() {`

### `src/editor/shell/primitives.css`
- **Lote:** L09b
- **Linhas:** 278
- **SHA1:** 27fea915e9c6d135b254c41201f9a457063c9bbb
- **Partes lidas:** 1-278
- **Propósito:** Os estilos das primitivas da interface: as opções nativas na cor de destaque, a porta e suas variantes (ícone, alternador, botão, primária, revelação), o controle segmentado, o popover, a amostra de cor sobre o xadrez e a matriz de alinhamento.
- **Âncora:** `src/editor/shell/primitives.css:18` `.door {`

### `src/editor/shell/recovery.tsx`
- **Lote:** L09b
- **Linhas:** 48
- **SHA1:** c565f89e1407f63d9bad4b076b48382844f1d9b6
- **Partes lidas:** 1-48
- **Propósito:** O diálogo de recuperação: aberto quando o trabalho salvo não pôde ser lido e a gravação ainda espera recuperação, lista as versões da mais nova para a mais antiga com o horário de cada uma e a porta Restore por revisão, ou diz que não há nenhuma.
- **Âncora:** `src/editor/shell/recovery.tsx:21` `export function RecoveryDialog() {`

### `src/editor/shell/region-boundary.test.tsx`
- **Lote:** L09b
- **Linhas:** 65
- **SHA1:** c7299b7ef016dc79c80d04a3868b10a14940e9d6
- **Partes lidas:** 1-65
- **Propósito:** Teste (AUD-01) de que uma região que não desenha falha sozinha: a região vizinha segue desenhada, o aviso da região aparece com papel de alerta, o incidente é registrado com o detalhe, e a próxima mudança da store desenha a região de novo.
- **Âncora:** `src/editor/shell/region-boundary.test.tsx:17` `function Fragile() {`

### `src/editor/shell/region-boundary.tsx`
- **Lote:** L09b
- **Linhas:** 62
- **SHA1:** 66d9cc3d5098bcb9584d31ac352feed62ffea356
- **Partes lidas:** 1-62
- **Propósito:** A fronteira de erro de cada região do casco: captura o erro de renderização, registra no feed de incidentes qual região não desenhou, mostra o aviso no lugar do conteúdo e se inscreve na store para desenhar a região de novo na próxima mudança.
- **Âncora:** `src/editor/shell/region-boundary.tsx:33` `export class RegionBoundary extends Component<Props, State> {`

### `src/editor/shell/row-fit.ts`
- **Lote:** L09b
- **Linhas:** 135
- **SHA1:** 33bc2113fce0ad2e95fea6e285ee60f34bf735d6
- **Partes lidas:** 1-135
- **Propósito:** O ajuste de linhas do inspetor: mede num contexto de canvas se o rótulo de uma linha e os valores dela cabem lado a lado (palavra por palavra, campo de valores oferecidos e metades de par) e marca a linha como empilhada quando não cabem, reavaliando a cada mudança do DOM, do tamanho, do foco e das fontes.
- **Âncora:** `src/editor/shell/row-fit.ts:97` `export function installRowFit(root: HTMLElement): () => void {`

### `src/editor/shell/settings.css`
- **Lote:** L09b
- **Linhas:** 144
- **SHA1:** 5df68fc9e67908939fba441be43184bc036d55a2
- **Partes lidas:** 1-144
- **Propósito:** Os estilos da aba Settings do inspetor: o aviso de linha, os valores de campo com botão de escolha, a coluna de rótulos igual à da aba Style, os atributos próprios, os editores de partes de um elemento e a mensagem padrão de uma regra de validação.
- **Âncora:** `src/editor/shell/settings.css:9` `.settings-field__value {`

### `src/editor/shell/shadow.tsx`
- **Lote:** L09b
- **Linhas:** 238
- **SHA1:** 2de468cf2b3226f2946d19eb9a4ee872e50c61df
- **Partes lidas:** 1-238
- **Propósito:** O editor de sombra: a linha do cabeçalho com Adicionar uma sombra, uma linha por camada com a amostra de cor e o resumo em palavras, a almofada de luz com o seu ponteiro, os campos de X, Y, blur, spread e cor, o campo de CSS e as portas de inserção, remoção, esconder e redefinir.
- **Âncora:** `src/editor/shell/shadow.tsx:36` `export function isShadowControl(entry: DoorEntry): boolean {`

### `src/editor/shell/shell.css`
- **Lote:** L09b
- **Linhas:** 109
- **SHA1:** b0db1f7b759678add1c2126fe777ab2c539380b8
- **Partes lidas:** 1-109
- **Propósito:** Os estilos de base do casco do editor: a caixa de todos os elementos, a página e o corpo, os padrões de tipo dos controles de formulário, o ponteiro de cada botão, o anel de foco único, o kbd, a classe visually-hidden e os tamanhos dos ícones.
- **Âncora:** `src/editor/shell/shell.css:75` `.visually-hidden {`

### `src/editor/shell/shell.tsx`
- **Lote:** L09b
- **Linhas:** 204
- **SHA1:** 233c3f145950fce7067ab4880509fa453ae46ec0
- **Partes lidas:** 1-204
- **Propósito:** O casco do editor: o tema e o idioma no documento, as fontes do projeto, a instalação das entradas (teclado, ponteiro, foco, ferramentas, captura), as larguras dos divisores, a grade das regiões cada uma na sua fronteira de erro, os diálogos e sobreposições, e o modo modal da pré-visualização com a devolução do foco.
- **Âncora:** `src/editor/shell/shell.tsx:111` `export function Shell() {`

### `src/editor/shell/shortcuts.tsx`
- **Lote:** L09b
- **Linhas:** 35
- **SHA1:** ee6f6c175eae27a7c2dacf2deb607441e85bd0d1
- **Partes lidas:** 1-35
- **Propósito:** O painel de atalhos de teclado: desenha os grupos de ligações lidos do próprio keymap, cada linha com as teclas, o rótulo do que a tecla faz e a marca de ainda não disponível para as não construídas.
- **Âncora:** `src/editor/shell/shortcuts.tsx:10` `export function Shortcuts() {`

### `src/editor/shell/side-by-side.tsx`
- **Lote:** L09b
- **Linhas:** 41
- **SHA1:** 8773d7ce542b1faca37fe38f31c1c4e9d4af9ad1
- **Partes lidas:** 1-41
- **Propósito:** Os breakpoints lado a lado: com a preferência ligada, até três quadros laterais com os breakpoints mais próximos em largura do editado, cada um a página viva no seu breakpoint com a seleção contornada.
- **Âncora:** `src/editor/shell/side-by-side.tsx:22` `export function SideBySide() {`

### `src/editor/shell/sidebar.css`
- **Lote:** L09b
- **Linhas:** 876
- **SHA1:** 4e401a045ca67d96c56d22cf2716af660a011f39
- **Partes lidas:** 1-876
- **Propósito:** Os estilos da barra de atividades e da barra lateral: atividades, a vista e as seções empilhadas, os divisores, os títulos, as linhas da árvore (seleção, renomear, detalhes, cor do rótulo com a paleta, ações, esconder e travar), a busca, o painel de inserção com densidades e a linha de inserção.
- **Âncora:** `src/editor/shell/sidebar.css:43` `.sidebar {`

### `src/editor/shell/sidebar.tsx`
- **Lote:** L09b
- **Linhas:** 96
- **SHA1:** 8f73b0c25f2055fb444a66d4de574f7bce39ded0
- **Partes lidas:** 1-96
- **Propósito:** A barra de atividades com as portas dos painéis, a tabela das vistas da barra lateral (Explorer, Insert, Styles e as das seções), a vista vazia com o aviso, e a barra lateral que desenha a vista, as seções empilhadas com a altura do divisor e o divisor da largura.
- **Âncora:** `src/editor/shell/sidebar.tsx:25` `export function ActivityBar() {`

### `src/editor/shell/sidebar/doors.tsx`
- **Lote:** L09b
- **Linhas:** 38
- **SHA1:** 6ed87318e478c4b35d0b3839523d4cc7f94b6b73
- **Partes lidas:** 1-38
- **Propósito:** O que as vistas da barra lateral compartilham: a leitura do desenho de uma porta (drawnAs) e da sua ordem, o requireDoor que exige uma porta de uma região, e o SectionTitle com os controles da região antes do primeiro item ou campo.
- **Âncora:** `src/editor/shell/sidebar/doors.tsx:13` `export function requireDoor(region: RegionId, test: (entry: DoorEntry) => boolean): DoorEntry {`

### `src/editor/shell/sidebar/explorer.tsx`
- **Lote:** L09b
- **Linhas:** 332
- **SHA1:** 2243f972953f0fa98216b5f5601be1d9eb1b9051
- **Partes lidas:** 1-332
- **Propósito:** A vista Explorer: a seção Pages com uma linha por página e o campo de nome que renomeia em linha ou abre a página, e a seção Files com a árvore de pastas e arquivos, os campos de criar arquivo e pasta, o abrir, renomear, mover com os alvos, preencher de dados e apagar, e o ajuste do nome antes dos detalhes.
- **Âncora:** `src/editor/shell/sidebar/explorer.tsx:116` `export function Explorer() {`

### `src/editor/shell/sidebar/insert.tsx`
- **Lote:** L09b
- **Linhas:** 152
- **SHA1:** 4c117004a1160896a261136455c5fa785ca6e2ff
- **Partes lidas:** 1-152
- **Propósito:** A vista de inserção: a linha que diz onde um clique insere (o destino de element.insert), a busca com a contagem de resultados, os segmentos de densidade, os grupos de elementos com os seus tiles, e os tiles dos componentes do projeto.
- **Âncora:** `src/editor/shell/sidebar/insert.tsx:59` `export function Insert() {`

### `src/editor/shell/sidebar/layers.tsx`
- **Lote:** L09b
- **Linhas:** 583
- **SHA1:** 4345b8a8109e0bb3aad6932c567adbe9cb0a2e05
- **Partes lidas:** 1-583
- **Propósito:** A seção de Camadas: a árvore da página desenhada numa janela de rolagem com over-scan, a busca com a vista de resultados, o campo de renomear em linha, a paleta de cor do rótulo, os detalhes e a marca de vazio da linha, os alvos de picking de interação e de movimento, o menu de contexto por clique secundário e a linha tracejada do destino de inserção.
- **Âncora:** `src/editor/shell/sidebar/layers.tsx:448` `export function LayersSection() {`

### `src/editor/shell/sidebar/name-first.ts`
- **Lote:** L09b
- **Linhas:** 31
- **SHA1:** 5624c93d9018ce60b0fb112b820f641f9ee0f6d1
- **Partes lidas:** 1-31
- **Propósito:** O ajuste nome primeiro de uma linha: quando o nome não cabe ao lado dos detalhes, estes saem e o lugar fica para o nome, guardando a largura deles para que a linha seja julgada do mesmo jeito e os detalhes voltem quando cabem de novo.
- **Âncora:** `src/editor/shell/sidebar/name-first.ts:13` `export function fitNames(list: HTMLElement): void {`

### `src/editor/shell/sidebar/styles.tsx`
- **Lote:** L09b
- **Linhas:** 78
- **SHA1:** a61887bdf53c758ba68e44d706215b5527fa7501
- **Partes lidas:** 1-78
- **Propósito:** A vista de estilos: a lista das classes do projeto com o uso de cada uma, o campo de renomear em linha e o apagar, seguidas das seções de variáveis, cores do site e sugestões.
- **Âncora:** `src/editor/shell/sidebar/styles.tsx:19` `export function Styles() {`

### `src/editor/shell/slots.tsx`
- **Lote:** L09b
- **Linhas:** 31
- **SHA1:** 67e8a3a221bb1c4ac210dc78ccc7f965aeef3395
- **Partes lidas:** 1-31
- **Propósito:** O componente Slots, que desenha os controles de uma região na ordem (cada porta como seu DoorControl e cada menu como seu MenuButton, salvo quando o chamador desenha o lugar), e os contextos do zoom que ajusta o breakpoint base ao palco.
- **Âncora:** `src/editor/shell/slots.tsx:26` `export const FitZoom = createContext<number>(1);`

### `src/editor/shell/snap-settings.tsx`
- **Lote:** L09b
- **Linhas:** 73
- **SHA1:** 33e6333523e1165583f91089c34568af01e098e5
- **Partes lidas:** 1-73
- **Propósito:** O diálogo de configurações de encaixe: as configurações em vigor quando abre, uma caixa por alvo de encaixe e o campo da distância, e a porta Apply que leva os alvos marcados e a distância digitada ao comando do manifesto.
- **Âncora:** `src/editor/shell/snap-settings.tsx:26` `export function SnapSettingsDialog() {`

### `src/editor/shell/splitter.tsx`
- **Lote:** L09b
- **Linhas:** 35
- **SHA1:** 636b1b7535b59e4569095cfb4d8b31a9841273ba
- **Partes lidas:** 1-35
- **Propósito:** O divisor de painéis: um separador que o teclado alcança e o ponteiro arrasta, com o eixo, os limites, o rótulo e a porta de arraste lidos do manifesto e o tamanho atual no estado de acessibilidade.
- **Âncora:** `src/editor/shell/splitter.tsx:15` `export function Splitter({ splitter, className }: { readonly splitter: string; readonly className?: string }) {`

### `src/editor/shell/status-bar.css`
- **Lote:** L09b
- **Linhas:** 175
- **SHA1:** 9e763d1890006c76761bd2bb7f79ef9843cb4714
- **Partes lidas:** 1-175
- **Propósito:** Os estilos da barra de status: a mensagem com elipse, os itens fixos, as portas e os menus da barra (abertos para cima), a trilha de migalhas com a caixa de medição oculta que recorta, o estado de gravação com largura fixa e o selo de incidentes.
- **Âncora:** `src/editor/shell/status-bar.css:4` `.status-bar {`

### `src/editor/shell/status-bar.tsx`
- **Lote:** L09b
- **Linhas:** 303
- **SHA1:** e359cac17b9199e342ecb230981d0521c6ce39c1
- **Partes lidas:** 1-303
- **Propósito:** A barra de status: a mensagem da última ação numa região viva, com as palavras do arraste em curso, a trilha de migalhas com a dobra dos níveis do meio, o tamanho da seleção, o breakpoint e o estado, a contagem de elementos, o selo de incidentes, os menus de zoom e idioma, o estado de gravação e o mesmo estado no topo.
- **Âncora:** `src/editor/shell/status-bar.tsx:34` `export function StatusBar() {`

### `src/editor/shell/tab-guard.tsx`
- **Lote:** L09b
- **Linhas:** 24
- **SHA1:** 6e13a7131fd544a2ec0a0fbc77e279da0980cd66
- **Partes lidas:** 1-24
- **Propósito:** O aviso do guarda de abas: enquanto esta aba não edita o projeto, uma barra diz por quê (outra aba edita ou tomou o projeto) e oferece a porta Assumir a edição.
- **Âncora:** `src/editor/shell/tab-guard.tsx:14` `export function TabGuardNotice() {`

### `src/editor/shell/toast.tsx`
- **Lote:** L09b
- **Linhas:** 20
- **SHA1:** 7e24883cdac71ffe3b0621633aedab09e13f9fbb
- **Partes lidas:** 1-20
- **Propósito:** O aviso que segue uma exclusão: mostra a mensagem do estado enquanto ela segue uma exclusão, com o texto na língua do editor e as portas da região toast.
- **Âncora:** `src/editor/shell/toast.tsx:10` `export function Toast() {`

### `src/editor/shell/top-bar.css`
- **Lote:** L09b
- **Linhas:** 91
- **SHA1:** af6c809492e3d76d19edcea582ded8ea3f8fd471
- **Partes lidas:** 1-91
- **Propósito:** Os estilos da barra superior: a marca, os menus da aplicação acima do pano de fundo de um menu aberto, o botão da página com o arquivo, a busca da paleta de comandos e o estado de gravação com o ponto na cor de cada estado.
- **Âncora:** `src/editor/shell/top-bar.css:3` `.top-bar {`

### `src/editor/shell/top-bar.tsx`
- **Lote:** L09b
- **Linhas:** 121
- **SHA1:** fa58c320fe107995ca117aefd79f1f25cd971502
- **Partes lidas:** 1-121
- **Propósito:** A barra superior: a marca do produto, os menus da aplicação, o seletor de páginas que abre a lista do projeto, a busca da paleta de comandos, e os controles da região com os separadores de grupo e o estado de gravação antes do último grupo.
- **Âncora:** `src/editor/shell/top-bar.tsx:91` `export function TopBar() {`

### `src/editor/shell/value-presets.test.ts`
- **Lote:** L09b
- **Linhas:** 30
- **SHA1:** 41997cf3872de8179be48dd486d98bba4a9df483
- **Partes lidas:** 1-30
- **Propósito:** Teste de que todo valor pronto de properties.json é um valor que a propriedade aceita: cada um despachado pela porta dos valores prontos na store real, gravado numa etapa de desfazer.
- **Âncora:** `src/editor/shell/value-presets.test.ts:13` `describe('value presets', () => {`

### `src/editor/shell/value-presets.tsx`
- **Lote:** L09b
- **Linhas:** 72
- **SHA1:** 87de65b337a1eea3d2d4146efd9c5b25f9ad0c4b
- **Partes lidas:** 1-72
- **Propósito:** Os valores prontos com prévia: as miniaturas de um alvo desenhadas sob o primeiro campo da propriedade, cada uma com o seu nome e o valor, escrita pela porta do campo (a própria do alvo, ou a que edita qualquer propriedade).
- **Âncora:** `src/editor/shell/value-presets.tsx:35` `export function ValuePresets({ target, label }: { readonly target: string; readonly label: string }) {`

### `src/editor/shell/variable-suggestions.tsx`
- **Lote:** L09b
- **Linhas:** 126
- **SHA1:** be4422cdc2e09b410c976839a3666e6145c260b7
- **Partes lidas:** 1-126
- **Propósito:** As sugestões de variáveis de um campo de valor: enquanto o texto começa "--" ou "var(" e o início de um nome, lista as variáveis do projeto de que o campo precisa, com o campo feito combobox no contexto de sugestões e o primeiro item ativo; cada item é a porta do campo.
- **Âncora:** `src/editor/shell/variable-suggestions.tsx:57` `export function VariableSuggestions({ entry, property, label, input, anchor, variables, choose }: {`

### `src/editor/shell/variables.tsx`
- **Lote:** L09b
- **Linhas:** 258
- **SHA1:** d8eb3d5bd2d9221e9f243dac8ede74c0a4c0f2af
- **Partes lidas:** 1-258
- **Propósito:** As variáveis do projeto na vista de estilos: os grupos por tipo com o campo do nome, o campo do valor e o apagar de cada variável, a lista de tipos de Nova variável com o próximo nome livre, as cores do site com o campo que troca a cor e o botão de variável, e as sugestões de classe.
- **Âncora:** `src/editor/shell/variables.tsx:149` `export function Variables() {`

### `src/editor/shell/view-title.tsx`
- **Lote:** L09b
- **Linhas:** 31
- **SHA1:** c40b107ff66d1aa6e0cfb44166884cd399592ebe
- **Partes lidas:** 1-31
- **Propósito:** O título que cada vista da barra lateral desenha: o nome da vista e as portas do cabeçalho do painel (a porta que devolve o painel ao lugar só enquanto ele está fora), com o grip de arraste da janela.
- **Âncora:** `src/editor/shell/view-title.tsx:18` `export function ViewTitle({ panel, title }: { readonly panel: Panel; readonly title: string }) {`

### `src/editor/shell/viewport-width.tsx`
- **Lote:** L09b
- **Linhas:** 29
- **SHA1:** c64fba726e9fe17f464f2c923ba4445526bbe260
- **Partes lidas:** 1-29
- **Propósito:** O campo e o controle deslizante da largura da tela mostrada, no diálogo de breakpoints: o texto é guardado como rascunho e despachado ao enviar ou ao sair, e o deslizante despacha a cada movimento.
- **Âncora:** `src/editor/shell/viewport-width.tsx:11` `export function ViewportWidth({ entry }: { readonly entry: DoorEntry }) {`

### `src/editor/shell/window-overlays.css`
- **Lote:** L09b
- **Linhas:** 1514
- **SHA1:** 4c254570d832718b9afed5624a1bf2de16177bae
- **Partes lidas:** 1-1450; 1451-1514
- **Propósito:** Os estilos das sobreposições e painéis da janela: as variáveis e cores do site, o diálogo modal com o escudo, encaixes, linhas de alinhamento e de intervalo igual, confirmação, recuperação, guarda de abas, selos do canvas, a pré-visualização, a barra de comandos com os seus escopos, a árvore de arquivos, a linha do tempo com os seus controles e a linha de teclas, os cartões de interação e o campo de painel.
- **Âncora:** `src/editor/shell/window-overlays.css:125` `.dialog {`

### `src/editor/shell/window.css`
- **Lote:** L09b
- **Linhas:** 58
- **SHA1:** e377cbf61ba39ac3ba3e6bc0f154c5503f7253fc
- **Partes lidas:** 1-58
- **Propósito:** A grade da janela do casco com as quatro colunas e as três linhas e as suas variantes sem barra lateral e sem inspetor, além do aviso de uma região que não pôde desenhar, com o lugar próprio de cada região.
- **Âncora:** `src/editor/shell/window.css:3` `.shell {`

### `src/editor/state.ts`
- **Lote:** L05a
- **Linhas:** 147
- **SHA1:** af1aa1c525179a3b85836cb5fd212ec1cffd4d4f
- **Partes lidas:** 1-147
- **Propósito:** a parte do estado da store que é do editor: painéis, layout, preferências, foco, sobreposições, menus, camadas, renomeação, texto em edição, arrasto, mão, câmera e os campos opcionais de cada ferramenta.
- **Âncora:** `src/editor/state.ts:36` `export interface EditorUi {`

### `src/editor/store-gesture-safe.test.ts`
- **Lote:** L05a
- **Linhas:** 33
- **SHA1:** 36814db2909c391d4c6a545cb293ccfa974d42ec
- **Partes lidas:** 1-33
- **Propósito:** prova que a store do editor não lança numa pressão nem num despacho tardio: abre gesto durante um grupo de comando e roda o despacho desfazível depois do gesto.
- **Âncora:** `src/editor/store-gesture-safe.test.ts:19` `const gesture = store.gesture();`

### `src/editor/store.ts`
- **Lote:** L05a
- **Linhas:** 276
- **SHA1:** 1d71dacbbcc1c708ff9c60bac608c43bb8c4e5a9
- **Partes lidas:** 1-276
- **Propósito:** a ligação da store do editor: cria a store com a tabela, o manifesto, as portas e o estado do editor, expõe `editContextOf` e envolve tudo em `gestureSafe`, que grava a digitação pendente antes de cada comando.
- **Âncora:** `src/editor/store.ts:104` `export function editContextOf(state: EditorState): EditContext {`

### `src/editor/test-boot.test.ts`
- **Lote:** L05b
- **Linhas:** 72
- **SHA1:** c2a553f26dccd5b02f52e27c8d278a7953d36898
- **Partes lidas:** 1-72
- **Propósito:** Testes da inicialização de teste: abre o projeto como File › Open, roda os comandos na ordem, registra incidente para comando que não rodou como pedido e anota o que a storage guardava no início.
- **Âncora:** `src/editor/test-boot.test.ts:17` `const AURORA = fs.readFileSync('manifest/features/fixtures/aurora.json', 'utf8');`

### `src/editor/test-boot.ts`
- **Lote:** L05b
- **Linhas:** 132
- **SHA1:** 2181a077576b6d3ddc7de343c3fce8f89c7a1e31
- **Partes lidas:** 1-132
- **Propósito:** Inicialização de teste do editor (servidor de desenvolvimento e build e2e): busca com ?test-boot qual projeto abrir e quais comandos rodar antes do primeiro desenho, resolve caminhos de nós e roda os comandos 'drawn' quando o palco do canvas fica com um tamanho só.
- **Âncora:** `src/editor/test-boot.ts:16` `export const TEST_BOOT_PARAM = 'test-boot';`

### `src/editor/test-port.test.ts`
- **Lote:** L05b
- **Linhas:** 61
- **SHA1:** 5c766bf8c34bfc75c1f8bd700ef8cb86ca644ad7
- **Partes lidas:** 1-61
- **Propósito:** Testes da porta de teste somente leitura: cópias do documento, da seleção e do histórico, respostas de explicação, incidentes e chaves traduzidas com formas plurais.
- **Âncora:** `src/editor/test-port.test.ts:17` `describe('the read-only test port', () => {`

### `src/editor/test-port.ts`
- **Lote:** L05b
- **Linhas:** 76
- **SHA1:** 5e2a87d93f491f8f7f0a56feace0557c50543b80
- **Partes lidas:** 1-76
- **Propósito:** Porta de teste somente leitura instalada congelada em window: cópias do documento, da seleção, do histórico e dos incidentes, explicações de comando, destino e nó, texto traduzido, chaves cobertas e o resultado da inicialização de teste.
- **Âncora:** `src/editor/test-port.ts:47` `export const TEST_PORT_KEY = '__builderTestPort';`

### `src/editor/text.test.ts`
- **Lote:** L05b
- **Linhas:** 14
- **SHA1:** 4fdaf6393e1618d428bcbc4373e0ed4f55fb2c91
- **Partes lidas:** 1-14
- **Propósito:** Teste do texto de mensagem com plural aninhado em substantivo localizado, no singular e no plural, em inglês e português.
- **Âncora:** `src/editor/text.test.ts:2` `import { textOf } from './text.ts';`

### `src/editor/text.ts`
- **Lote:** L05b
- **Linhas:** 51
- **SHA1:** 2a7e84ffcc478b2b603716759961a4b27502e1a4
- **Partes lidas:** 1-51
- **Propósito:** Texto da interface no idioma escolhido: resolve parâmetros aninhados e formas plurais e expõe textOf, messageText e os ganchos useT, useLocale e useValueLabel.
- **Âncora:** `src/editor/text.ts:20` `export function textOf(locale: Locale, key: MessageId, params: Readonly<Record<string, MessageParam>> = {}): string {`

### `src/editor/timeline/panel.tsx`
- **Lote:** L07
- **Linhas:** 246
- **SHA1:** 82fdb9b942b2cdb625cb2e23354c8416e952f08c
- **Partes lidas:** 1-246
- **Propósito:** O painel Timeline: as animações do elemento selecionado, as opções da animação mostrada e a pista com ruler, playhead e quadros-chave, desenhados por portas do manifesto.
- **Âncora:** `src/editor/timeline/panel.tsx:79` `const QUARTERS = [0, 25, 50, 75, 100] as const;`

### `src/editor/timeline/playhead.ts`
- **Lote:** L07
- **Linhas:** 154
- **SHA1:** 6aee565b420559100bea13ecf73db8a23b623fd5
- **Partes lidas:** 1-154
- **Propósito:** O assunto e o playhead do timeline: a animação mostrada, o playhead em por cento e em ms, o quadro-chave sob ele e as commands timeline.show e timeline.setPlayhead.
- **Âncora:** `src/editor/timeline/playhead.ts:41` `export const trackWidth = (): number => numberConstant('timeline.trackWidth');`

### `src/editor/timeline/preview.ts`
- **Lote:** L07
- **Linhas:** 102
- **SHA1:** 6c26ccb76cf3dbecfa2dedc4247b5ff4b706e0a8
- **Partes lidas:** 1-102
- **Propósito:** A prévia do timeline: play, pause, stop e toggleLoop sobre ui.timeline, o que o canvas desenha ao playhead e o laço que caminha o playhead enquanto toca.
- **Âncora:** `src/editor/timeline/preview.ts:17` `export const playCommand = registerHandler<'timeline.play', EditorUi>('timeline.play', ({ state }) => {`

### `src/editor/view/breakpoint-table.test.ts`
- **Lote:** L07
- **Linhas:** 109
- **SHA1:** 3c7243f23e4b11f0d0e45888c6145aeba5d661b1
- **Partes lidas:** 1-109
- **Propósito:** Testes dos breakpoints do projeto sobre a store real: somar um no tamanho mostrado, renomear, dar outra largura e remover com os estilos, com as recusas, o undo e a validação.
- **Âncora:** `src/editor/view/breakpoint-table.test.ts:13` `const quiet = { read: () => null, write: () => {} };`

### `src/editor/view/breakpoint-table.ts`
- **Lote:** L07
- **Linhas:** 87
- **SHA1:** 82fdfac4ab2825bdb129e470b02f08d9b4bc92f6
- **Partes lidas:** 1-87
- **Propósito:** As commands que mudam os breakpoints do projeto: somar, renomear, dar outra largura e remover, cada uma um passo de undo e com o breakpoint mostrado seguindo a mudança.
- **Âncora:** `src/editor/view/breakpoint-table.ts:19` `const unknown = (): Outcome<EditorUi> => ({ kind: 'refused', message: message('status.breakpoints.unknown') });`

### `src/editor/view/breakpoints.ts`
- **Lote:** L07
- **Linhas:** 67
- **SHA1:** b6b25b4e14fdfc8c892ec7b174442e95591d046f
- **Partes lidas:** 1-67
- **Propósito:** O breakpoint que o editor mostra e edita: activeBreakpoint, viewportWidth, a escolha guardada nas preferências e as commands view.setBreakpoint e view.setViewportWidth.
- **Âncora:** `src/editor/view/breakpoints.ts:37` `export const MIN_VIEWPORT_WIDTH = 320;`

### `src/editor/view/camera.ts`
- **Lote:** L07
- **Linhas:** 133
- **SHA1:** 3f10f474cc9f6926f508fe8ea282fb104c8e978c
- **Partes lidas:** 1-133
- **Propósito:** A câmera do canvas: o zoom escolhido ou o do Fit, o panX da página na tela, o pivô do zoom e as commands de aproximar, afastar, encaixar e mover.
- **Âncora:** `src/editor/view/camera.ts:19` `export const ZOOM_MIN = numberConstant('zoom.min');`

### `src/editor/view/edit-context.ts`
- **Lote:** L23
- **Linhas:** 34
- **SHA1:** a93194dc90ea2db738f92ff9535fcdf9359e95b8
- **Partes lidas:** 1-34
- **Propósito:** Devolve ao editor o contexto em que uma mudança desfeita ou refeita foi feita (DCS-009, DCS-016): o breakpoint, o estado de estilo, a classe-alvo e, numa mudança feita num quadro-chave, a Timeline aberta nele; a store do núcleo pede isto pela opção restoreContext.
- **Âncora:** `src/editor/view/edit-context.ts:6` `import type { EditContext, StoreState } from '../../core/store/store.ts';`

### `src/editor/view/editor-view.ts`
- **Lote:** L07
- **Linhas:** 21
- **SHA1:** 038cafb12c2bbdbafd1df60e1e9c7cb1f21e24ff
- **Partes lidas:** 1-21
- **Propósito:** A vista da coluna central (canvas, dividida ou só o code), com editorView e a command view.setEditorView.
- **Âncora:** `src/editor/view/editor-view.ts:8` `export type EditorView = 'canvas' | 'split' | 'code';`

### `src/editor/view/frame-edge.ts`
- **Lote:** L07
- **Linhas:** 17
- **SHA1:** 9c0c8833124e8151a0a1e480f25b85fff3621901
- **Partes lidas:** 1-17
- **Propósito:** A borda da moldura arrastada: view.resizeViewport converte o percurso do ponteiro em largura de tela, presa entre os limites que o canvas mostra.
- **Âncora:** `src/editor/view/frame-edge.ts:7` `import { registerHandler } from '../../core/commands/registry.ts';`

### `src/editor/view/overlays.ts`
- **Lote:** L07
- **Linhas:** 71
- **SHA1:** 807c0156831782ef91555af57424322cd88c2d81
- **Partes lidas:** 1-71
- **Propósito:** Os interruptores de vista do canvas: contornos, zonas, rulers, guias, guias inteligentes, espaçamento igual e breakpoints lado a lado, guardados como preferências.
- **Âncora:** `src/editor/view/overlays.ts:11` `type Switch = 'outlines' | 'zones' | 'rulersHidden' | 'guidesHidden' | 'smartGuidesOff' | 'equalSpacingOff' | 'sideBySide';`

### `src/editor/view/preview.ts`
- **Lote:** L07
- **Linhas:** 22
- **SHA1:** 00d51e6efcde632444b14ac44d4ba15832050896
- **Partes lidas:** 1-22
- **Propósito:** O modo de prévia: view.enterPreview guarda a seleção e mostra a página exportada; view.exitPreview sai e devolve a seleção, sem tocar no documento.
- **Âncora:** `src/editor/view/preview.ts:9` `export const previewing = (ui: EditorUi): boolean => ui.preview !== undefined;`

### `src/editor/view/select-tool.ts`
- **Lote:** L07
- **Linhas:** 28
- **SHA1:** d00f3ae3fa2cce5f13a34bf742a8a75c0f1cd294
- **Partes lidas:** 1-28
- **Propósito:** A ferramenta Select: a forma comum de trabalhar do editor; escolhê-la põe de lado a ferramenta de um módulo e o modo de edição de grelha.
- **Âncora:** `src/editor/view/select-tool.ts:7` `import { showPanel } from '../workspace/panels.ts';`

### `src/editor/view/selection-size.ts`
- **Lote:** L07
- **Linhas:** 56
- **SHA1:** cd65b1e75e5c3b2ecb0d5810aad37df6e6386593
- **Partes lidas:** 1-56
- **Propósito:** Mede o tamanho do elemento primário ou o do conjunto selecionado em px da página, re-medido a cada quadro nos dois hooks do arquivo.
- **Âncora:** `src/editor/view/selection-size.ts:9` `export interface ElementSize {`

### `src/editor/view/snap.ts`
- **Lote:** L07
- **Linhas:** 73
- **SHA1:** fa212297183f49f682e6d984d3accf10ad9d6d0f
- **Partes lidas:** 1-73
- **Propósito:** O encaixe como preferência: snap.setEnabled e snap.setSettings, os alvos e a distância em vigor (snapSettingsOf) e a leitura de um valor guardado.
- **Âncora:** `src/editor/view/snap.ts:15` `const SNAP_DISTANCE = numberConstant('snap.distance');`

### `src/editor/view/style-state.test.ts`
- **Lote:** L07
- **Linhas:** 68
- **SHA1:** 4b99aa0f4bcf2bf0fc7f3129673e197cf7e93042
- **Partes lidas:** 1-68
- **Propósito:** Testes da família AUD-03 sobre a store congelada: o estado de estilo volta a Base com palavra quando a seleção muda, é recusado quando não se aplica, e as sequências mínimas da sonda não estouram.
- **Âncora:** `src/editor/view/style-state.test.ts:16` `const memory = (): { read(): string | null; write(text: string): void } => {`

### `src/editor/view/style-state.ts`
- **Lote:** L07
- **Linhas:** 79
- **SHA1:** f7bc2acfe419d3cfd46ea43595c9dd9c3712f6d4
- **Partes lidas:** 1-79
- **Propósito:** O estado de estilo que o editor edita, Base enquanto nenhum é escolhido: activeState, activeLayer, view.setStyleState e o seguidor styleStateFollows.
- **Âncora:** `src/editor/view/style-state.ts:16` `export const BASE_STATE = BASE;`

### `src/editor/view/viewport.test.ts`
- **Lote:** L07
- **Linhas:** 32
- **SHA1:** c8900225b87c0d061adecafa1c8f5ff72bbe754f
- **Partes lidas:** 1-32
- **Propósito:** Testes da largura de prévia contínua: o Fit mede a largura mostrada, as larguras intermediárias escolhem o breakpoint certo sem tocar no documento e larguras inválidas são recusadas.
- **Âncora:** `src/editor/view/viewport.test.ts:2` `import { createEditorStore } from '../store.ts';`

### `src/editor/wiring.ts`
- **Lote:** L05a
- **Linhas:** 39
- **SHA1:** 637b8ecdc8db80654614642579dc9a21c40e7c78
- **Partes lidas:** 1-39
- **Propósito:** o que o editor recebe da composição: tabela de comandos, predicados e o que os módulos instalados acrescentam, com a instalação e a leitura tardia de um valor.
- **Âncora:** `src/editor/wiring.ts:29` `export function wiring(): EditorWiring {`

### `src/editor/workspace/dialogs.test.ts`
- **Lote:** L07
- **Linhas:** 36
- **SHA1:** 59ffa805fae500c819f5e19803b6df126a43d654
- **Partes lidas:** 1-36
- **Propósito:** Testes de que o diálogo do lote de renomeação só abre numa seleção que o lote renomeia, nunca na raiz da página nem sem seleção.
- **Âncora:** `src/editor/workspace/dialogs.test.ts:11` `const store = () => createEditorStore({ storage: memory(), ids: sequentialIds('n'), clock: manualClock() });`

### `src/editor/workspace/dialogs.ts`
- **Lote:** L07
- **Linhas:** 23
- **SHA1:** c64d30e56a87c796400436f8c0d8849f0e0d2d57
- **Partes lidas:** 1-23
- **Propósito:** Os diálogos do editor guardados em ui.dialog (workspace.openDialog), com a recusa do lote de renomeação vinda do próprio renomeador.
- **Âncora:** `src/editor/workspace/dialogs.ts:12` `const BATCH_RENAME = 'batch-rename';`

### `src/editor/workspace/layout.test.ts`
- **Lote:** L07
- **Linhas:** 65
- **SHA1:** 795461cc33a4b76ab6169d8d5ec2e46aa3df7181
- **Partes lidas:** 1-65
- **Propósito:** Testes da aba ativa de um grupo (workspace.setActiveTab): as abas do inspector na ordem do cabeçalho, a aba da doca e a recusa de uma aba que o grupo não tem.
- **Âncora:** `src/editor/workspace/layout.test.ts:13` `const store = () => createEditorStore({ storage: memory(), ids: sequentialIds('n'), clock: manualClock() });`

### `src/editor/workspace/layout.ts`
- **Lote:** L07
- **Linhas:** 337
- **SHA1:** babb933753be26a41437b724080d5039edb266f7
- **Partes lidas:** 1-337
- **Propósito:** O layout do workspace: o estado da doca, a aba ativa de cada grupo de abas, os painéis que saíram do lugar (flutuantes, doca direita, áreas combinadas) e os splitters.
- **Âncora:** `src/editor/workspace/layout.ts:14` `export const DOCK_STATES = ['collapsed', 'open', 'max'] as const;`

### `src/editor/workspace/narrow.ts`
- **Lote:** L07
- **Linhas:** 16
- **SHA1:** 6f558e83e3bdfd2b2f07bbca421dda765b413f45
- **Partes lidas:** 1-16
- **Propósito:** Diz se a janela é estreita (abaixo de workspace.narrowWindow), o que faz a primeira visita abrir com a barra lateral fechada.
- **Âncora:** `src/editor/workspace/narrow.ts:14` `export function windowIsNarrow(): boolean {`

### `src/editor/workspace/panel-catalogue.ts`
- **Lote:** L07
- **Linhas:** 59
- **SHA1:** 5db2e963ceb7def4d79e100ca7d2b3fc08deb558
- **Partes lidas:** 1-59
- **Propósito:** O catálogo dos painéis lido de layout.json: nome, lugar e abertura inicial de cada painel, e o estado inicial dos painéis.
- **Âncora:** `src/editor/workspace/panel-catalogue.ts:14` `export const PANELS = manifest.layout.panels as Readonly<Record<Panel, PanelData>>;`

### `src/editor/workspace/panel-drag.ts`
- **Lote:** L07
- **Linhas:** 100
- **SHA1:** 3bc387ae52729cade4160cef343fa81b9079356c
- **Partes lidas:** 1-100
- **Propósito:** O arraste de um painel: onde uma soltura cairia (panelHintAt), o que cada lugar significa (panelDrop) e o aviso que a camada desenha.
- **Âncora:** `src/editor/workspace/panel-drag.ts:31` `const EDGE = constant('panels.dockEdgeZone');`

### `src/editor/workspace/panels.ts`
- **Lote:** L07
- **Linhas:** 149
- **SHA1:** 46b1c9c8d9a56d3bf602834c292d3588de67e517
- **Partes lidas:** 1-149
- **Propósito:** A visibilidade dos painéis: qual vista da barra lateral mostra, se cada seção, o inspector, as ferramentas do canvas e cada aba da doca estão abertos, e as commands de alternância.
- **Âncora:** `src/editor/workspace/panels.ts:18` `export function isPanelOpen(ui: EditorUi, panel: Panel): boolean {`

### `src/editor/workspace/persist.ts`
- **Lote:** L07
- **Linhas:** 118
- **SHA1:** 1fb3c17d462c0837c7f110c3d30802ddbfa514cd
- **Partes lidas:** 1-118
- **Propósito:** Guarda e restaura entre sessões o workspace (painéis, layout e a página aberta) no armazenamento do navegador, deixando de fora valores que já não existem.
- **Âncora:** `src/editor/workspace/persist.ts:16` `const KEY = 'workspace';`

### `src/editor/workspace/windows.tsx`
- **Lote:** L07
- **Linhas:** 154
- **SHA1:** 84dbbf18136ec0a7df0ea5367a3e2781c66e016a
- **Partes lidas:** 1-154
- **Propósito:** Desenha os painéis que saíram do lugar: as janelas flutuantes, a doca direita, as abas e pilhas de uma área combinada e o aviso do arraste.
- **Âncora:** `src/editor/workspace/windows.tsx:20` `export const PanelBodyTable = createContext<PanelBodies>({});`

### `src/editor/workspace/workspace.test.ts`
- **Lote:** L07
- **Linhas:** 152
- **SHA1:** bada37cbc5bab7cc32d7522bdcc798a0eab1033e
- **Partes lidas:** 1-152
- **Propósito:** Testes da visibilidade dos painéis e das preferências sobre a store: o estado inicial conforme layout.json, as alternâncias, o colapso das docas e a língua e o tema guardados.
- **Âncora:** `src/editor/workspace/workspace.test.ts:21` `const store = () => createEditorStore({ storage: memory(), ids: sequentialIds('n'), clock: manualClock() });`

### `src/env.d.ts`
- **Lote:** L05a
- **Linhas:** 4
- **SHA1:** 821bb1dc8033613114f149c7d722a0a175093204
- **Partes lidas:** 1-4
- **Propósito:** declara as constantes que o Vite substitui em tempo de build, entre elas a porta de teste.
- **Âncora:** `src/env.d.ts:4` `declare const __BUILDER_TEST_PORT__: boolean;`

### `src/i18n/glossary.json`
- **Lote:** L10c
- **Linhas:** 157
- **SHA1:** cd9de63b03f4e1124077ed82a4362968e246a53f
- **Partes lidas:** 1-157
- **Propósito:** Glossário dos conceitos de estilo e de animação do editor: para cada conceito, a propriedade CSS, o termo em inglês e em pt-BR e uma nota que fixa quando usar cada termo.
- **Âncora:** `src/i18n/glossary.json:2` `  "concepts": [`

### `src/i18n/i18n.test.ts`
- **Lote:** L10c
- **Linhas:** 167
- **SHA1:** a64896a8dc3a647a0a0b7c326163253976d51d31
- **Partes lidas:** 1-167
- **Propósito:** Verificações em Vitest do runtime de i18n: preenchimento dos espaços reservados, formas plurais por idioma, chaves e espaços reservados iguais nos dois catálogos, ausência de fallback, textos em pt-BR e a descrição de um texto pelos nomes dos espaços reservados.
- **Âncora:** `src/i18n/i18n.test.ts:1` `import { describe, expect, it } from 'vitest';`

### `src/i18n/index.ts`
- **Lote:** L10c
- **Linhas:** 84
- **SHA1:** 9cd51302d17cb90048243f7c41ea82d12579e226
- **Partes lidas:** 1-84
- **Propósito:** Runtime de i18n: os idiomas e o tipo das chaves, os dois catálogos JSON importados, o preenchimento dos espaços reservados, a escolha da forma plural, a tradução com ouvinte de chaves do port de teste e a descrição de um texto sem valores.
- **Âncora:** `src/i18n/index.ts:27` `export function formatMessage(template: string, params: MessageParams = {}): string {`

### `src/i18n/locales/en.json`
- **Lote:** L10c
- **Linhas:** 3588
- **SHA1:** 00f72a0f863270b0ed508ed91430944aadd56d3b
- **Partes lidas:** 1-817; 818-1711; 1712-2470; 2471-3288; 3289-3588
- **Propósito:** Catálogo de mensagens da interface em inglês: um texto por chave, com espaços reservados de valores e formas plurais .one e .other para as contagens.
- **Âncora:** `src/i18n/locales/en.json:2` `  "activity.insert": "Insert",`

### `src/i18n/locales/pt-BR.json`
- **Lote:** L10c
- **Linhas:** 3588
- **SHA1:** 2d2fc47831e82c4373140c9e878b972aaa1baba0
- **Partes lidas:** 1-785; 786-1645; 1646-2355; 2356-3130; 3131-3588
- **Propósito:** Catálogo de mensagens da interface em português do Brasil: um texto por chave, com espaços reservados de valores e formas plurais .one e .other para as contagens.
- **Âncora:** `src/i18n/locales/pt-BR.json:2` `  "activity.insert": "Inserir",`

### `src/main.tsx`
- **Lote:** L05a
- **Linhas:** 86
- **SHA1:** 714ca510fcde885f0c1f5f0897e875231879bdec
- **Partes lidas:** 1-86
- **Propósito:** o ponto de entrada: instala as portas do navegador e a composição, restaura o trabalho salvo, cria a store do editor, liga o autosave e os rascunhos, lê o boot de teste e monta o React.
- **Âncora:** `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`

### `src/manifest/check.ts`
- **Lote:** L10b
- **Linhas:** 105
- **SHA1:** 1600f686bfbb294ac0d93720bfd62f389ee83e81
- **Partes lidas:** 1-105
- **Propósito:** Valida o manifesto em ordem: rejeita lógica nos dados escritos à mão, analisa cada arquivo pelo seu esquema, roda todas as famílias de regras e devolve os problemas e o resumo (ManifestSummary).
- **Âncora:** `src/manifest/check.ts:26` `export function checkManifest(input: ManifestInput): CheckResult {`

### `src/manifest/check/base.ts`
- **Lote:** L10b
- **Linhas:** 512
- **SHA1:** c49098b0e34df7748c4cf3b354d8db80674c7cce
- **Partes lidas:** 1-512
- **Propósito:** É a base do verificador do manifesto: os ids de regra, os tipos de problema e de resumo, a análise dos arquivos do manifesto e as funções auxiliares que as famílias de regras compartilham.
- **Âncora:** `src/manifest/check/base.ts:46` `export const RULES = [`

### `src/manifest/check/browser-support.ts`
- **Lote:** L10b
- **Linhas:** 107
- **SHA1:** 6c55ef19ab4a5a2957a7d5529bb91c21d8b8c0ca
- **Partes lidas:** 1-107
- **Propósito:** Confere que o editor edita, oferece e escreve apenas o que Chrome, Firefox e Safari suportam, e que prefixos de fornecedor só aparecem em uma receita de compatibilidade e nos seus usos.
- **Âncora:** `src/manifest/check/browser-support.ts:5` `import type { CheckContext, Support } from './context.ts';`

### `src/manifest/check/catalogues.ts`
- **Lote:** L10b
- **Linhas:** 130
- **SHA1:** 68e6dc4d898306749f07be28bfebf79ce4e81264
- **Partes lidas:** 1-130
- **Propósito:** Confere as palavras da interface: toda chave de i18n usada existe em cada idioma, todo comando tem referência de tratador e todo comando com marcadores tem um nome sem eles.
- **Âncora:** `src/manifest/check/catalogues.ts:5` `export function cataloguesRules(ctx: CheckContext) {`

### `src/manifest/check/command-links.ts`
- **Lote:** L10b
- **Linhas:** 65
- **SHA1:** 47aa4b8f28b3ee7b00a76c1d776cb45880e7a6c8
- **Partes lidas:** 1-65
- **Propósito:** Confere os vínculos entre portas, comandos e features: a porta nomeada existe no comando, todo comando tem porta, a feature lista o comando que introduz e nada depende do que vem depois.
- **Âncora:** `src/manifest/check/command-links.ts:5` `export function commandLinksRules(ctx: CheckContext) {`

### `src/manifest/check/context.ts`
- **Lote:** L10b
- **Linhas:** 134
- **SHA1:** 0bb17de83c7d771ca3be64757a2aaca28752eef4
- **Partes lidas:** 1-134
- **Propósito:** Monta o contexto que todas as famílias de regras do verificador leem: o manifesto analisado, o relatório de problemas e os índices de features, comandos, portas, elementos, propriedades e suporte de navegador.
- **Âncora:** `src/manifest/check/context.ts:9` `export function collectContext(input: ManifestInput, parsed: Parsed, problems: Problem[]) {`

### `src/manifest/check/css-syntax.ts`
- **Lote:** L10b
- **Linhas:** 97
- **SHA1:** 4948142a7796b8b20d959b57afad52cb864b4082
- **Partes lidas:** 1-97
- **Propósito:** Confere que todo valor que uma porta oferece ou escreve casa com a sintaxe oficial do CSS, e que a sintaxe dos navegadores só entra pelos valores da lista de exceções (syntaxFallbacks).
- **Âncora:** `src/manifest/check/css-syntax.ts:6` `import { supportedUnits } from './base.ts';`

### `src/manifest/check/data-rules.ts`
- **Lote:** L10b
- **Linhas:** 153
- **SHA1:** f5c77dbcc1dc412edfb7ff4ff987f3725ae25d19
- **Partes lidas:** 1-153
- **Propósito:** Confere que os dados não guardam lógica: acoplamentos com predicados e ações de listas fechadas, histórico dos comandos, referências para código, um leitor para cada campo e o modelo de conteúdo HTML.
- **Âncora:** `src/manifest/check/data-rules.ts:8` `export function dataRulesRules(ctx: CheckContext) {`

### `src/manifest/check/identity.ts`
- **Lote:** L10b
- **Linhas:** 140
- **SHA1:** ea97981ea9201c2ec1baef8f7461e5efbe455c5c
- **Partes lidas:** 1-140
- **Propósito:** Confere a identidade dos dados: todo id é único no seu tipo e toda referência (seção, grupo, porta, elemento, comando) nomeia algo existente.
- **Âncora:** `src/manifest/check/identity.ts:4` `export function identityRules(ctx: CheckContext) {`

### `src/manifest/check/interactions.ts`
- **Lote:** L10b
- **Linhas:** 88
- **SHA1:** ea5dfa745fb0fba424158f36d08bfa54ed3bd804
- **Partes lidas:** 1-88
- **Propósito:** Confere uma ligação por atalho em cada contexto, um sentido por modificador em cada gesto, o zoom inicial permitido de cada cenário e as evidências das palavras-chave e unidades excluídas do CSS.
- **Âncora:** `src/manifest/check/interactions.ts:3` `import { BROWSERS } from '../schema.ts';`

### `src/manifest/check/placement.ts`
- **Lote:** L10b
- **Linhas:** 249
- **SHA1:** 4bbe39af872a9eeee84113a03fd1f23cd0296b4c
- **Partes lidas:** 1-249
- **Propósito:** Confere onde as portas são desenhadas: região e ordem, posição única, estados só no seletor do inspector, um rótulo por termo do glossário, ícones exigidos e os painéis da barra lateral.
- **Âncora:** `src/manifest/check/placement.ts:6` `import { schemaProblems, generatedOffer } from './base.ts';`

### `src/manifest/check/scenario-terminals.ts`
- **Lote:** L10b
- **Linhas:** 20
- **SHA1:** 2a41c98912d2a9fed223962e6258d7b761353590
- **Partes lidas:** 1-20
- **Propósito:** Confere que todo cenário termina em um terminal: a renderização na tela, o editor medido, a persistência após recarga ou os arquivos exportados.
- **Âncora:** `src/manifest/check/scenario-terminals.ts:4` `export function scenarioTerminalsRules(ctx: CheckContext) {`

### `src/manifest/check/scenarios.ts`
- **Lote:** L10b
- **Linhas:** 264
- **SHA1:** 50f7be7cb8e9fbffbbb9a3fb711576d08e3c4f26
- **Partes lidas:** 1-264
- **Propósito:** Confere que todo cenário roda como escrito: o fixture é um documento válido do modelo, os caminhos de documento resolvem, os passos têm argumentos válidos, toda porta da feature roda e a prova de dente (toothProof) é nomeada.
- **Âncora:** `src/manifest/check/scenarios.ts:11` `export function scenariosRules(ctx: CheckContext) {`

### `src/manifest/check/style-doors.ts`
- **Lote:** L10b
- **Linhas:** 186
- **SHA1:** f4ddbf3454220bb35b3d400e5ef08508e05128c8
- **Partes lidas:** 1-186
- **Propósito:** Confere as portas da aba Style — cada porta tem a sua seção, cada campo do painel rápido um grupo de layout.json e cada linha de conceito itens da própria seção — e as referências de composites, receitas, verificações, argumentos de portas e features.
- **Âncora:** `src/manifest/check/style-doors.ts:2` `import { styleSections, type StyleDoor } from '../style-places.ts';`

### `src/manifest/check/value-shapes.ts`
- **Lote:** L10b
- **Linhas:** 293
- **SHA1:** 9b76602a1bba35e17d604d38084ef92715b93b2f
- **Partes lidas:** 1-293
- **Propósito:** Confere como os valores são escritos: receitas de compatibilidade, valores estruturados, atalhos e composites, as portas que escrevem cada propriedade e o uso de transformações individuais.
- **Âncora:** `src/manifest/check/value-shapes.ts:7` `import { VENDOR_PREFIX, baseName } from './base.ts';`

### `src/manifest/check/values.ts`
- **Lote:** L10b
- **Linhas:** 91
- **SHA1:** 97b40f9a56b2f938f52500e7838570503a12b7e4
- **Partes lidas:** 1-91
- **Propósito:** Confere que cada porta oferece a lista gerada da sua propriedade, composite ou receita (ou um subconjunto declarado) e que a lista Essentials only não tem valor que All properties não tenha.
- **Âncora:** `src/manifest/check/values.ts:8` `export function valuesRules(ctx: CheckContext) {`

### `src/manifest/chord.ts`
- **Lote:** L10b
- **Linhas:** 34
- **SHA1:** 09c0bcb7e10b93662872e66a3bfedd4b9f473f4d
- **Partes lidas:** 1-34
- **Propósito:** Lê e normaliza um atalho de teclado (modificadores na ordem fixa, uma tecla nomeada ou um caractere) e devolve nulo quando o texto não é um atalho.
- **Âncora:** `src/manifest/chord.ts:12` `export function normaliseChord(chord: string): string | null {`

### `src/manifest/css.ts`
- **Lote:** L10b
- **Linhas:** 285
- **SHA1:** 8e78690965caf5e640240c445749b892753a995a
- **Partes lidas:** 1-285
- **Propósito:** Constrói o lexer do CSSTree a partir das sintaxes oficiais, analisa um valor contra a sintaxe oficial e a dos navegadores e extrai a forma de um valor e as palavras-chave e funções que uma sintaxe nomeia.
- **Âncora:** `src/manifest/css.ts:218` `export function valueShape(value: string): ValueShape {`

### `src/manifest/fields.ts`
- **Lote:** L10b
- **Linhas:** 60
- **SHA1:** f31981215701d28f01f851aa0e1f9d2255744476
- **Partes lidas:** 1-60
- **Propósito:** Percorre os esquemas dos arquivos do manifesto e lista cada campo que eles definem, como arquivo:caminho, para o verificador exigir um leitor para cada campo.
- **Âncora:** `src/manifest/fields.ts:52` `export function schemaFields(): string[] {`

### `src/manifest/runtime.test.ts`
- **Lote:** L10b
- **Linhas:** 18
- **SHA1:** 3a0c4dd5c242165fe31ae9e93d9fd244e8b94ea2
- **Partes lidas:** 1-18
- **Propósito:** Prova que cada arquivo do manifesto, lido pelo editor, é idêntico ao analisado pelo seu esquema, e que um esquema recusa uma chave que ele não nomeia.
- **Âncora:** `src/manifest/runtime.test.ts:4` `describe('the manifest the editor reads', () => {`

### `src/manifest/runtime.ts`
- **Lote:** L10b
- **Linhas:** 154
- **SHA1:** 14dbb18fac552de6fc9e97033002712e7534d490
- **Partes lidas:** 1-154
- **Propósito:** Carrega uma única vez cada arquivo do manifesto que o app lê na inicialização e expõe as consultas que a store e o editor usam: comando por id, ícone de elemento, portas de uma região e a cadeia de contextos de tecla.
- **Âncora:** `src/manifest/runtime.ts:97` `export const manifest: Manifest = load();`

### `src/manifest/scenario.test.ts`
- **Lote:** L10b
- **Linhas:** 107
- **SHA1:** 64b3753ffacd39c0c5c93a04b8334033aef25a81
- **Partes lidas:** 1-107
- **Propósito:** Prova, para os cenários, a leitura dos caminhos de documento, a aplicação do diff de documento em ordem e a comparação entre o documento real e o esperado, com ids provisórios.
- **Âncora:** `src/manifest/scenario.test.ts:35` `describe('document paths (src/manifest/scenario.ts)', () => {`

### `src/manifest/scenario.ts`
- **Lote:** L10b
- **Linhas:** 299
- **SHA1:** 41bf8c093b1940cc78b7cec4e0e7f1eab5b5ad4a
- **Partes lidas:** 1-299
- **Propósito:** Define a gramática dos cenários: como um caminho nomeia nós e campos de um documento, como o diff se aplica sem mudar a entrada, a comparação com o documento real, os ids provisórios e a checagem de recusa.
- **Âncora:** `src/manifest/scenario.ts:55` `export function resolveNode(document: unknown, nodes: readonly string[]): Resolved | string {`

### `src/manifest/schema.ts`
- **Lote:** L10b
- **Linhas:** 1369
- **SHA1:** 04c6a1514d2f55dbd3a9a854004ea263c6ec295c
- **Partes lidas:** 1-834; 835-1369
- **Propósito:** Declara todos os esquemas (estritos, com todos os campos exigidos) dos arquivos do manifesto, deriva deles os tipos do domínio e define as listas fechadas (BROWSERS, PAGE_REGIONS, STRUCTURED_VALUE_TYPES) que o verificador usa.
- **Âncora:** `src/manifest/schema.ts:202` `export const BROWSERS = ['chrome', 'firefox', 'safari'] as const;`

### `src/manifest/style-places.ts`
- **Lote:** L10b
- **Linhas:** 51
- **SHA1:** f69b695565725e7fa7c734988a180f2badcb45a9
- **Partes lidas:** 1-51
- **Propósito:** Responde em que seção da aba Style cada porta é desenhada, a partir da propriedade, composite ou receita que o campo edita, do controle declarado em properties.json ou da primeira entrada que lista a porta.
- **Âncora:** `src/manifest/style-places.ts:35` `export function styleSections(data: StylePlacesData): (ref: string, door: StyleDoor) => string | null | undefined {`

### `src/modules/layout-composer/adapters/adapters.test.ts`
- **Lote:** L10a
- **Linhas:** 94
- **SHA1:** e03d1d6364415c71beb9c88eb1779ca21801b827
- **Partes lidas:** 1-94
- **Propósito:** Testes do import estrutural (recoverIntent, com nós medidos) e do decalque da imagem de referência (traceBlocks, traceLines, traceRegions), além do vocabulário de propriedades do manifesto.
- **Âncora:** `src/modules/layout-composer/adapters/adapters.test.ts:11` `describe('recovering intent from an existing structure', () => {`

### `src/modules/layout-composer/adapters/properties.ts`
- **Lote:** L10a
- **Linhas:** 6
- **SHA1:** 641a73eefd7547235270846a5f11b4926de2d633
- **Partes lidas:** 1-6
- **Propósito:** Monta o vocabulário de propriedades do manifesto por papel em camelCase, para o compilador nomear o que declara sem escrever identificador de propriedade à mão.
- **Âncora:** `src/modules/layout-composer/adapters/properties.ts:4` `export function propertyVocabulary(properties: readonly { readonly id: string }[]): Readonly<Record<string, string>> {`

### `src/modules/layout-composer/adapters/recover.ts`
- **Lote:** L10a
- **Linhas:** 182
- **SHA1:** aa987db2fa04110d9c298c5e5b26ebf7e8516fbc
- **Partes lidas:** 1-182
- **Propósito:** Importação estrutural: lê os elementos que um contêiner já tem de volta para o Layout Intent Graph, com a confiança do que foi recuperado e as ambiguidades do que não deu para recuperar.
- **Âncora:** `src/modules/layout-composer/adapters/recover.ts:42` `const PX = /^(-?\d+(?:\.\d+)?)px$/;`

### `src/modules/layout-composer/adapters/reference.ts`
- **Lote:** L10a
- **Linhas:** 114
- **SHA1:** 756fa325647f917ff3a54ff41267f2d4df834305
- **Partes lidas:** 1-114
- **Propósito:** Decalque da imagem de referência: acha os blocos da imagem por cortes recursivos, devolve as linhas de encaixe e desenha os blocos como regiões em uma operação.
- **Âncora:** `src/modules/layout-composer/adapters/reference.ts:13` `export interface Luminance {`

### `src/modules/layout-composer/compiler/area-keywords.test.ts`
- **Lote:** L10a
- **Linhas:** 15
- **SHA1:** a29dd65dc25dab93d7ce39f0eb3e8f8fab94c5d3
- **Partes lidas:** 1-15
- **Propósito:** Teste da família GA1: o nome de uma área de grade nunca é uma palavra-chave do CSS (auto, span, none, inherit).
- **Âncora:** `src/modules/layout-composer/compiler/area-keywords.test.ts:8` `describe('a grid area never takes a keyword as its name (GA1)', () => {`

### `src/modules/layout-composer/compiler/compile.test.ts`
- **Lote:** L10a
- **Linhas:** 160
- **SHA1:** 9bcf29f45f1fb7679153e3faa2adee863126a95f
- **Partes lidas:** 1-160
- **Propósito:** Testes do compilador de layout: grade com áreas nomeadas, linha flex, gaps, reflow responsivo, morph escrito em clamp(), recorte de forma, compilação estável e o espaço vazio ao redor do desenho.
- **Âncora:** `src/modules/layout-composer/compiler/compile.test.ts:17` `describe('the layout compiler', () => {`

### `src/modules/layout-composer/compiler/compile.ts`
- **Lote:** L10a
- **Linhas:** 610
- **SHA1:** 6757feeb66ffb0d64d1f6610424aa7584f744982
- **Partes lidas:** 1-610
- **Propósito:** O compilador de layout: converte o Layout Intent Graph na menor estrutura comum que o preserva (linhas e colunas flex onde o espaço corta limpo, grade com áreas nomeadas onde não), escolhida por função de custo que prefere a estrutura que a página já tem.
- **Âncora:** `src/modules/layout-composer/compiler/compile.ts:70` `export const ROOT_NODE = '$root';`

### `src/modules/layout-composer/constraints/solve.test.ts`
- **Lote:** L10a
- **Linhas:** 66
- **SHA1:** 5f93c52637117b45db6d15b2e8c4a0b5a642fafa
- **Partes lidas:** 1-66
- **Propósito:** Testes do solucionador de restrições: tamanho igual, gaps iguais, proporção, alinhamento, tamanho fixo, preenchimento do espaço restante e conflitos.
- **Âncora:** `src/modules/layout-composer/constraints/solve.test.ts:15` `describe('the constraint solver', () => {`

### `src/modules/layout-composer/constraints/solve.ts`
- **Lote:** L10a
- **Linhas:** 167
- **SHA1:** 85f0c6aaf48d7d13cb42602b155d3dff74d52747
- **Partes lidas:** 1-167
- **Propósito:** O solucionador de restrições: aplica cada restrição como projeção em ordem fixa até as passagens assentarem e devolve como conflito a restrição que ainda move regiões.
- **Âncora:** `src/modules/layout-composer/constraints/solve.ts:18` `const PASSES = 64;`

### `src/modules/layout-composer/geometry/geometry.test.ts`
- **Lote:** L10a
- **Linhas:** 77
- **SHA1:** 4d551b3e8f01ff5198d0dede4a28f2766813605e
- **Partes lidas:** 1-77
- **Propósito:** Testes da geometria de caixas (divisão, subtração, precisão, teste de acerto e distância até a borda) e das operações booleanas de polígonos.
- **Âncora:** `src/modules/layout-composer/geometry/geometry.test.ts:6` `describe('the geometry of boxes', () => {`

### `src/modules/layout-composer/geometry/geometry.ts`
- **Lote:** L10a
- **Linhas:** 115
- **SHA1:** 2ff7e0849121f18047bdf7b7becdd52ae9e9433b
- **Partes lidas:** 1-115
- **Propósito:** A geometria das regiões em coordenadas do contêiner composto: limites, interseção, contenção, teste de acerto, subtração e divisão de caixas, com quantização da precisão.
- **Âncora:** `src/modules/layout-composer/geometry/geometry.ts:10` `export const precision = 1 / 1024;`

### `src/modules/layout-composer/geometry/keys.ts`
- **Lote:** L10a
- **Linhas:** 16
- **SHA1:** b2d4876c75cc27c7c9e26fd9ed87ce696f3415e8
- **Partes lidas:** 1-16
- **Propósito:** Lê do próprio modelo de autoria as chaves de comprimento de uma caixa e as palavras order e stroke, para não escrever identificadores de propriedades do manifesto como literais.
- **Âncora:** `src/modules/layout-composer/geometry/keys.ts:6` `export const WIDTH = Object.keys(LENGTHS)[0] as 'width';`

### `src/modules/layout-composer/geometry/polygons.ts`
- **Lote:** L10a
- **Linhas:** 194
- **SHA1:** 67b2d379baec6ef1b2d8cce32e29d9d928565108
- **Partes lidas:** 1-194
- **Propósito:** Operações booleanas (união, interseção e diferença) sobre polígonos simples com furos, por arranjo planar, para as formas desenhadas.
- **Âncora:** `src/modules/layout-composer/geometry/polygons.ts:19` `const EPS = 1e-7;`

### `src/modules/layout-composer/gestures/operations.test.ts`
- **Lote:** L10a
- **Linhas:** 172
- **SHA1:** 69690f111224490c4a278d899c9e54f7b908abba
- **Partes lidas:** 1-172
- **Propósito:** Testes da álgebra de gestos: desenhar, dividir, cortar, juntar, subtrair, mover, aninhar, duplicar, repetir, alinhar e distribuir, apagar, restaurar e operações compostas com o inverso.
- **Âncora:** `src/modules/layout-composer/gestures/operations.test.ts:16` `describe('the gesture algebra', () => {`

### `src/modules/layout-composer/gestures/operations.ts`
- **Lote:** L10a
- **Linhas:** 513
- **SHA1:** 2c760ec42a2a89d6ffa795fa6d43e193ffbb5626
- **Partes lidas:** 1-513
- **Propósito:** A álgebra de gestos: cada gesto do compositor vira uma operação declarativa sobre o Layout Intent Graph; execute() a roda, resolve as restrições, valida o resultado e devolve o inverso e os destinos do conteúdo das regiões que somem.
- **Âncora:** `src/modules/layout-composer/gestures/operations.ts:70` `export interface Naming {`

### `src/modules/layout-composer/gestures/recognize.test.ts`
- **Lote:** L10a
- **Linhas:** 133
- **SHA1:** b4fd9c54322b0f594917ceb0294aa91aa9895ef3
- **Partes lidas:** 1-133
- **Propósito:** Testes da leitura de um traço com a ferramenta única: desenhar, cortar, mover, aninhar, juntar, redimensionar pela borda, arrastar uma fronteira compartilhada, selecionar, agrupar, pintar relações e editar por alças.
- **Âncora:** `src/modules/layout-composer/gestures/recognize.test.ts:16` `describe('reading a stroke with the one tool', () => {`

### `src/modules/layout-composer/gestures/recognize.ts`
- **Lote:** L10a
- **Linhas:** 629
- **SHA1:** 9fdab62d9c9f7693e068bdfe1c603a98a0f00b17
- **Partes lidas:** 1-629
- **Propósito:** A ferramenta única de construção: lê um traço pelo início, pelo que cruza e pelo fim e o torna uma operação da álgebra de gestos, com encaixe nas linhas próximas, alças estruturais e leitura no contexto responsivo.
- **Âncora:** `src/modules/layout-composer/gestures/recognize.ts:40` `export type HandleKind = 'boundary' | 'vertex' | 'gap' | 'repeat' | 'edge' | 'move';`

### `src/modules/layout-composer/gestures/sequences.ts`
- **Lote:** L10a
- **Linhas:** 61
- **SHA1:** ed2e0377b4ae51a5b3395954a3958569735a19cd
- **Partes lidas:** 1-61
- **Propósito:** Lê as amostras de um traço em trechos retos e a volta ao ponto de partida que o reconhecedor interpreta.
- **Âncora:** `src/modules/layout-composer/gestures/sequences.ts:35` `export interface Piece {`

### `src/modules/layout-composer/gestures/structural.ts`
- **Lote:** L10a
- **Linhas:** 183
- **SHA1:** b0ed3278a92356ac272c6bae29a6778c6c72365e
- **Partes lidas:** 1-183
- **Propósito:** Edições estruturais usadas pelo canvas e pelo painel: pintar restrições, mudar a contagem de uma repetição, rearranjar uma grade, escolher interpretação, aceitar sugestão, remover envoltórios inertes, ciclar a seleção e editar fronteiras.
- **Âncora:** `src/modules/layout-composer/gestures/structural.ts:141` `export type SelectionMode = 'replace' | 'add' | 'toggle' | 'cycle';`

### `src/modules/layout-composer/host/handlers.ts`
- **Lote:** L10a
- **Linhas:** 891
- **SHA1:** 437ce5eefa746b071f1468bfa7b14e5f152c087c
- **Partes lidas:** 1-659; 660-891
- **Propósito:** Os comandos do Layout Composer: cada mudança do layout é um comando e um passo de desfazer; o traço é relido pelo mesmo leitor da prévia e a estrutura compilada é escrita no contêiner.
- **Âncora:** `src/modules/layout-composer/host/handlers.ts:28` `const PANEL = 'layout-composer';`

### `src/modules/layout-composer/host/host.test.ts`
- **Lote:** L10a
- **Linhas:** 300
- **SHA1:** 12e23b914e229799f8bcc9e11ac72a944d3ae31f
- **Partes lidas:** 1-300
- **Propósito:** Testes do Layout Composer pela store real do editor: entrar em um contêiner, traços como passos únicos de desfazer, releitura da página, propriedades, tamanhos de tela e colocação de região com a ferramenta de seleção.
- **Âncora:** `src/modules/layout-composer/host/host.test.ts:31` `describe('Layout Composer host (host/handlers.ts)', () => {`

### `src/modules/layout-composer/host/materialize.ts`
- **Lote:** L10a
- **Linhas:** 122
- **SHA1:** 7595e47d692a03b5505197997c671deddf83fe0b
- **Partes lidas:** 1-122
- **Propósito:** Escreve a estrutura compilada no documento: cada nó compilado vira um elemento comum, reaproveitando pelo marcador o elemento que a página já tem, e cada elemento que o layout coloca mantém id, estilos próprios e filhos.
- **Âncora:** `src/modules/layout-composer/host/materialize.ts:16` `export interface MaterializePorts {`

### `src/modules/layout-composer/host/project-breakpoints.test.ts`
- **Lote:** L10a
- **Linhas:** 33
- **SHA1:** 0d13d32074875893881ccf8670ff373fc94d4d4e
- **Partes lidas:** 1-33
- **Propósito:** Teste da família BP1: o compositor casa suas regras com a tabela de breakpoints do próprio projeto, não com a padrão do manifesto.
- **Âncora:** `src/modules/layout-composer/host/project-breakpoints.test.ts:12` `describe('the composer reads the project\'s own breakpoints (BP1)', () => {`

### `src/modules/layout-composer/host/record.ts`
- **Lote:** L10a
- **Linhas:** 75
- **SHA1:** 658eb78eaa27e356384252403a7e590dda1e2a1c
- **Partes lidas:** 1-75
- **Propósito:** O que o Layout Composer guarda no documento: o registro do contêiner com o Layout Intent Graph e o marcador de cada elemento que ele escreveu ou colocou, com validador próprio.
- **Âncora:** `src/modules/layout-composer/host/record.ts:13` `export const NAMESPACE = 'layout-composer';`

### `src/modules/layout-composer/host/state.ts`
- **Lote:** L10a
- **Linhas:** 32
- **SHA1:** 52ed79362f16248fe4a84f186529ddf98e9c7345
- **Partes lidas:** 1-32
- **Propósito:** O estado do compositor na store do editor: qual contêiner está composto, a seleção, a lente, a ferramenta e a vista lateral de onde ele veio.
- **Âncora:** `src/modules/layout-composer/host/state.ts:9` `export interface ComposerState {`

### `src/modules/layout-composer/host/tools.test.ts`
- **Lote:** L10a
- **Linhas:** 121
- **SHA1:** 8cf5eb665ae2d35ddb2f8c8583ed4f9ec78651cf
- **Partes lidas:** 1-121
- **Propósito:** Testes das regras, sugestões, gabaritos e imagem de referência do Layout Composer pela store real do editor.
- **Âncora:** `src/modules/layout-composer/host/tools.test.ts:37` `describe('Layout Composer rules, suggestions and templates', () => {`

### `src/modules/layout-composer/intent/analysis.test.ts`
- **Lote:** L10a
- **Linhas:** 67
- **SHA1:** 407963f9c5bdf4f6ba31cb285904500f79d5fa5d
- **Partes lidas:** 1-67
- **Propósito:** Testes do que o compositor entende da geometria: padrões, interpretações, previsão, diferença semântica, estresse de larguras, sugestões e canonização.
- **Âncora:** `src/modules/layout-composer/intent/analysis.test.ts:8` `describe('what the composer understands from geometry', () => {`

### `src/modules/layout-composer/intent/analysis.ts`
- **Lote:** L10a
- **Linhas:** 384
- **SHA1:** 68fc6031fa2fe3a712fafb8addf1a609e865f78f
- **Partes lidas:** 1-384
- **Propósito:** Lê o grafo e propõe sem alterá-lo: reconhecimento de padrões, motor de ambiguidade, previsor, diferença semântica, pressão de conteúdo, teste de estresse, sugestões estruturais e forma canônica.
- **Âncora:** `src/modules/layout-composer/intent/analysis.ts:89` `const PATTERNS = new WeakMap<LayoutIntent, readonly Pattern[]>();`

### `src/modules/layout-composer/intent/ids.ts`
- **Lote:** L10a
- **Linhas:** 26
- **SHA1:** 6d0888854d39bebccef602ce7bd054d3ffc07001
- **Partes lidas:** 1-26
- **Propósito:** Ids determinísticos do grafo (regiões, restrições, regras, morphs e o id da operação), derivados do próprio grafo e da revisão.
- **Âncora:** `src/modules/layout-composer/intent/ids.ts:6` `const REGION = /^r(\d+)$/;`

### `src/modules/layout-composer/intent/meaning.test.ts`
- **Lote:** L10a
- **Linhas:** 56
- **SHA1:** 9178bf2740e1a2c10c2c4995aa3a89b62e2dcfd7
- **Partes lidas:** 1-56
- **Propósito:** Testes da inferência semântica de uma página: cabeçalho, lateral, conteúdo principal, rodapé, cartões e seção.
- **Âncora:** `src/modules/layout-composer/intent/meaning.test.ts:8` `describe('what a page layout plainly means', () => {`

### `src/modules/layout-composer/intent/meaning.ts`
- **Lote:** L10a
- **Linhas:** 145
- **SHA1:** 8ba4af754fbce8a9d357a131b41a9427fb9d56a8
- **Partes lidas:** 1-145
- **Propósito:** Lê o significado que o layout mostra: faixa larga no topo vira cabeçalho e no rodapé vira rodapé, a coluna estreita ao lado do conteúdo vira lateral, a região mais larga vira conteúdo principal e linhas de três iguais viram cartões.
- **Âncora:** `src/modules/layout-composer/intent/meaning.ts:22` `const ACROSS = 0.8;`

### `src/modules/layout-composer/intent/model.ts`
- **Lote:** L10a
- **Linhas:** 202
- **SHA1:** 809facc0c63e835c5c7aaedd6e1c47ddb550890b
- **Partes lidas:** 1-202
- **Propósito:** O Layout Intent Graph: os tipos do grafo (ponto, caixa, dimensão, região, restrições, regras responsivas, morphs, imagem de referência e preferências) e as buscas de região, filhos, descendentes e profundidade.
- **Âncora:** `src/modules/layout-composer/intent/model.ts:144` `export const ROOT_KEY = '$root';`

### `src/modules/layout-composer/intent/problems.ts`
- **Lote:** L10a
- **Linhas:** 96
- **SHA1:** e935a292fe3a96eb7231baa75ffbf7ce788e4b70
- **Partes lidas:** 1-96
- **Propósito:** Os códigos de recusa do compositor, o problema tipado com seus valores, a exceção de recusa e a chave do catálogo com que o problema é dito.
- **Âncora:** `src/modules/layout-composer/intent/problems.ts:74` `export interface LayoutProblem {`

### `src/modules/layout-composer/intent/templates.test.ts`
- **Lote:** L10a
- **Linhas:** 62
- **SHA1:** 72a1dd762ad1d53ecf44c1e86cd1c6ce86bda683
- **Partes lidas:** 1-62
- **Propósito:** Testes dos gabaritos e componentes espaciais e das variáveis de layout: amarrar um valor a um nome, editar um lugar ou todos e remover a variável.
- **Âncora:** `src/modules/layout-composer/intent/templates.test.ts:17` `describe('templates and spatial components', () => {`

### `src/modules/layout-composer/intent/templates.ts`
- **Lote:** L10a
- **Linhas:** 214
- **SHA1:** 21894a9c6749791617407653466ac3d9cb08ee70
- **Partes lidas:** 1-214
- **Propósito:** Gabaritos de layout e componentes espaciais: uma composição válida ou uma seleção vira estrutura reutilizável com os parâmetros que oferece, colocada escalada no lugar escolhido com contagens novas; inclui os gabaritos internos.
- **Âncora:** `src/modules/layout-composer/intent/templates.ts:170` `export type BuiltInTemplate = 'dashboard' | 'landing' | 'sidebar' | 'article' | 'gallery';`

### `src/modules/layout-composer/intent/variables.ts`
- **Lote:** L10a
- **Linhas:** 70
- **SHA1:** 92a9738b854577fdb5397b39e659144b38974fe9
- **Partes lidas:** 1-70
- **Propósito:** Variáveis de layout: um comprimento que vários lugares compartilham por nome, com as operações de amarrar, editar em um lugar ou em todos e remover, e a consulta dos lugares que nomeiam a variável.
- **Âncora:** `src/modules/layout-composer/intent/variables.ts:28` `export function usages(graph: LayoutIntent, name: string): ValueRef[] {`

### `src/modules/layout-composer/interaction/luminance.ts`
- **Lote:** L10a
- **Linhas:** 33
- **SHA1:** 45d2fb3775e73b1c0408d279840fce28f618254d
- **Partes lidas:** 1-33
- **Propósito:** Lê a luminância da imagem de referência no navegador, desenhada em uma tela de largura limitada, um valor por pixel, para o comando de decalque.
- **Âncora:** `src/modules/layout-composer/interaction/luminance.ts:9` `const TRACE_WIDTH = 160;`

### `src/modules/layout-composer/interaction/place-tool.ts`
- **Lote:** L10a
- **Linhas:** 77
- **SHA1:** 7a8ded0856d5fcec23091e104c5f6f0a79fccc7b
- **Partes lidas:** 1-77
- **Propósito:** A ferramenta de seleção sobre uma região desenhada pelo Layout Composer: um arraste do corpo ou de uma alça roda layout.place a cada movimento, com encaixe, e um clique seleciona a região.
- **Âncora:** `src/modules/layout-composer/interaction/place-tool.ts:16` `const CLICK_TRAVEL = numberConstant('drag.threshold');`

### `src/modules/layout-composer/interaction/preview.ts`
- **Lote:** L10a
- **Linhas:** 27
- **SHA1:** 43f0f590653e09b8e835de83bb6eb83495082549
- **Partes lidas:** 1-27
- **Propósito:** O estado transitório da prévia de um traço: os pontos até agora e a leitura que o soltar gravaria, com inscrição e cancelamento de ouvintes.
- **Âncora:** `src/modules/layout-composer/interaction/preview.ts:13` `let current: StrokePreview | null = null;`

### `src/modules/layout-composer/interaction/tool.ts`
- **Lote:** L10a
- **Linhas:** 109
- **SHA1:** c7601db3787f0c8e1c059436a3c91e18e5c8e54d
- **Partes lidas:** 1-109
- **Propósito:** A ferramenta de canvas do Layout Composer: lê prensa, movimentos e solta no px do contêiner; os movimentos só desenham a prévia e o soltar despacha a porta do gesto.
- **Âncora:** `src/modules/layout-composer/interaction/tool.ts:25` `const CLICK_TRAVEL = numberConstant('drag.threshold');`

### `src/modules/layout-composer/module.ts`
- **Lote:** L10a
- **Linhas:** 12
- **SHA1:** 1661689a2b7eef2ddd91da4e644f9d90856a965f
- **Partes lidas:** 1-12
- **Propósito:** Instala o Layout Composer como módulo do editor: os comandos, o predicado e o validador do que ele guarda no documento.
- **Âncora:** `src/modules/layout-composer/module.ts:7` `export const LAYOUT_COMPOSER = {`

### `src/modules/layout-composer/responsive/adaptation.test.ts`
- **Lote:** L10a
- **Linhas:** 197
- **SHA1:** 38743cbbe720d8e7477ee411a4f335e79d0ff8df
- **Partes lidas:** 1-197
- **Propósito:** Testes do reflow automático em telas mais estreitas e dos traços que encaixam, selecionam e cortam, a partir de um layout desenhado à mão.
- **Âncora:** `src/modules/layout-composer/responsive/adaptation.test.ts:36` `describe('a layout drawn by hand', () => {`

### `src/modules/layout-composer/responsive/continuum.test.ts`
- **Lote:** L10a
- **Linhas:** 58
- **SHA1:** 6604f0a3ededda7e1f7b6260e9ad92c4fa791bb0
- **Partes lidas:** 1-58
- **Propósito:** Testes do continuum responsivo: morph contínuo escrito em clamp(), comportamento registrado no breakpoint que segura a largura, regras adaptativas e recusa de largura que nenhum breakpoint nomeia.
- **Âncora:** `src/modules/layout-composer/responsive/continuum.test.ts:19` `describe('the responsive continuum', () => {`

### `src/modules/layout-composer/responsive/continuum.ts`
- **Lote:** L10a
- **Linhas:** 236
- **SHA1:** 3a7700a6c132be31f828eab186db49379288a20a
- **Partes lidas:** 1-236
- **Propósito:** O continuum responsivo: registra o comportamento onde a pessoa o mudou, mapeia regras e segmentos de morph para os breakpoints do projeto, infere o comportamento automático em telas estreitas e monta curvas de morph.
- **Âncora:** `src/modules/layout-composer/responsive/continuum.ts:20` `export function morphValue(points: readonly MorphPoint[], width: number): number {`

### `src/modules/layout-composer/testing/ports.ts`
- **Lote:** L10a
- **Linhas:** 25
- **SHA1:** 706103e7c5b7ef4514442411b543ea1980a8509c
- **Partes lidas:** 1-25
- **Propósito:** As portas do compilador usadas pelos testes do módulo (lista de trilhas e vocabulário de propriedades) e um construtor de composições desenhadas e já resolvidas.
- **Âncora:** `src/modules/layout-composer/testing/ports.ts:10` `export const PORTS: CompilerPorts = {`

### `src/modules/layout-composer/topology/topology.ts`
- **Lote:** L10a
- **Linhas:** 233
- **SHA1:** d7065fed49793d4475f42fad418b56cfd33446ca
- **Partes lidas:** 1-233
- **Propósito:** A topologia do layout (fronteiras compartilhadas cortadas nos encontros, arestas, vértices e adjacência) e a validação do grafo: sobreposições, órfãos, tamanhos impossíveis, geometria degenerada e ciclos de hierarquia.
- **Âncora:** `src/modules/layout-composer/topology/topology.ts:79` `export function topology(graph: LayoutIntent): Topology {`

### `src/modules/layout-composer/ui/composer.css`
- **Lote:** L10a
- **Linhas:** 281
- **SHA1:** 26ea44c22e1f6411c3432c552414849670eaf779
- **Partes lidas:** 1-281
- **Propósito:** Estilos da camada de canvas e do painel do Layout Composer, com cores, espaçamento, tipo e raios vindos dos tokens.
- **Âncora:** `src/modules/layout-composer/ui/composer.css:4` `.layout-composer {`

### `src/modules/layout-composer/ui/overlay.tsx`
- **Lote:** L10a
- **Linhas:** 220
- **SHA1:** 546acaa1dbab8b32db3a9415a40aa1e901f251a9
- **Partes lidas:** 1-220
- **Propósito:** O que o canvas desenha enquanto um contêiner está composto: o palco que recebe as prensas, as regiões da lente escolhida com seus rótulos, as alças da seleção e o traço em curso com o que o soltar faria.
- **Âncora:** `src/modules/layout-composer/ui/overlay.tsx:63` `export function LayoutOverlay() {`

### `src/modules/layout-composer/ui/panel.tsx`
- **Lote:** L10a
- **Linhas:** 314
- **SHA1:** 5585ffd0be7e11fdad3697c78d5ea177cb6effbd
- **Partes lidas:** 1-314
- **Propósito:** A vista lateral do Layout Composer: a previsão do que o layout vira, a legenda dos gestos, as propriedades das regiões selecionadas, o arranjo do grupo, o que muda na tela escolhida, as regras, as sugestões, os gabaritos, a imagem de referência e o aviso de larguras.
- **Âncora:** `src/modules/layout-composer/ui/panel.tsx:171` `export function LayoutPanel(): ReactNode {`

### `src/modules/layout-composer/ui/scene.test.ts`
- **Lote:** L10a
- **Linhas:** 39
- **SHA1:** bca0e7886d75995f288bec1b1f5e01aa05e24689
- **Partes lidas:** 1-39
- **Propósito:** Testes do que a sobreposição e o inspetor de intenção mostram, por lente.
- **Âncora:** `src/modules/layout-composer/ui/scene.test.ts:7` `describe('what the overlay and the intent inspector show', () => {`

### `src/modules/layout-composer/ui/scene.ts`
- **Lote:** L10a
- **Linhas:** 228
- **SHA1:** 10d3eb1f687993402a258e3c12b1c43246524b9e
- **Partes lidas:** 1-228
- **Propósito:** Os dados que a sobreposição e o inspetor mostram: seis lentes sobre o grafo, as alças da seleção, as relações de restrições e a descrição em palavras de uma restrição.
- **Âncora:** `src/modules/layout-composer/ui/scene.ts:15` `export const LENSES: readonly Lens[] = ['spatial', 'structure', 'constraints', 'responsive', 'flow', 'semantic'];`

### `src/modules/layout-composer/view.ts`
- **Lote:** L10a
- **Linhas:** 13
- **SHA1:** c3d5b751d39330eb55e99073ed5de6ba71841c68
- **Partes lidas:** 1-13
- **Propósito:** Instala o lado de editor do Layout Composer: a vista lateral, a camada de canvas e as duas ferramentas de canvas.
- **Âncora:** `src/modules/layout-composer/view.ts:9` `export const LAYOUT_COMPOSER_VIEW = {`

### `src/ui/icons.svg`
- **Lote:** L10b
- **Linhas:** 216
- **SHA1:** d67f4e29b5f47c65ba16e5947cd3ca563af9547f
- **Partes lidas:** 1-216
- **Propósito:** Conjunto de símbolos SVG com os ícones da Lucide que o manifesto nomeia, com os metadados de licença, gerado por npm run gen.
- **Âncora:** `src/ui/icons.svg:2` `<svg xmlns="http://www.w3.org/2000/svg">`

### `src/ui/tokens.css`
- **Lote:** L10b
- **Linhas:** 316
- **SHA1:** 1543c78d250b15d4e63afbd039f9cdbc671209ef
- **Partes lidas:** 1-316
- **Propósito:** Folha de tokens do design (tipografia, espaçamento, tamanhos, raios, camadas de empilhamento e cores dos temas claro e escuro), gerada de design/final/tokens.json.
- **Âncora:** `src/ui/tokens.css:3` `:root {`

### `src/ui/tokens.test.ts`
- **Lote:** L10b
- **Linhas:** 68
- **SHA1:** a5e425fc761f7be537baeb883d5e9f54c8584ff6
- **Partes lidas:** 1-68
- **Propósito:** Prova que os temas claro, escuro e o escuro do sistema definem os mesmos nomes e que cada cor de texto tem contraste de ao menos 4,5:1 sobre a superfície em que se apoia.
- **Âncora:** `src/ui/tokens.test.ts:54` `describe('the design tokens', () => {`

### `tests/e2e/absolute-anchors.spec.ts`
- **Lote:** L20a
- **Linhas:** 87
- **SHA1:** d48ff64c96c3351333699395bfd3d3e4ddcae57c
- **Partes lidas:** 1-87
- **Propósito:** Testa que a aba de âncora no topo de um elemento estreito não é coberta pelo rótulo de seleção nem pelo chip do painel rápido, e que a aba de âncora diz se a borda está ancorada e vira ao ser pressionada.
- **Âncora:** `tests/e2e/absolute-anchors.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/accessibility-audit.spec.ts`
- **Lote:** L20a
- **Linhas:** 245
- **SHA1:** 4bd4f46b99f7c169ddc8644344174be8473dafe7
- **Partes lidas:** 1-245
- **Propósito:** Mede no navegador o contraste de todo texto visível, o tamanho mínimo de 24 x 24 dos controles, os estados de um campo (repouso, hover, foco, erro), a diferença entre controle desabilitado e inativo, nomes acessíveis únicos na aba Style e o contraste do detalhe da linha selecionada em Camadas no tema escuro.
- **Âncora:** `tests/e2e/accessibility-audit.spec.ts:13` `const ALL = 'inspector.setMode#inspector-mode-all';`

### `tests/e2e/accessibility-checks.spec.ts`
- **Lote:** L20a
- **Linhas:** 95
- **SHA1:** e244d68d9bd9eb57beafd56e9d6f5d94fa44b2c2
- **Partes lidas:** 1-95
- **Propósito:** Verifica o painel Checks: cada problema do documento entra na lista com categoria, regra e correção sugerida, um clique na linha seleciona o elemento, cada problema leva o triângulo de advertência na cor de aviso, e a lista acompanha o documento sem bloquear a exportação.
- **Âncora:** `tests/e2e/accessibility-checks.spec.ts:10` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/activity-open.spec.ts`
- **Lote:** L20a
- **Linhas:** 45
- **SHA1:** 18d3de0073b36ef897dc31094bfdc2d856e5317f
- **Partes lidas:** 1-45
- **Propósito:** Verifica que o ícone de atividade foca o painel aberto sem fechá-lo, e que reabrir um painel flutuante preserva o lugar dele e o botão de fechar continua atuando.
- **Âncora:** `tests/e2e/activity-open.spec.ts:1` `import { expect, test } from '../support/test.ts';`

### `tests/e2e/add-property-focus.spec.ts`
- **Lote:** L20a
- **Linhas:** 148
- **SHA1:** 08b6f0e6d4531257b2e4b7a029c7511e25451c15
- **Partes lidas:** 1-148
- **Propósito:** Cobre o botão de adicionar propriedade no inspector: o foco vai ao filtro, text-shadow e Enter desenham o campo Text shadow com foco, o valor digitado é gravado, Escape devolve o foco ao botão e um clique fora fecha a lista e seleciona o alvo, e as duas mensagens vazias da lista se distinguem.
- **Âncora:** `tests/e2e/add-property-focus.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/address-rule.spec.ts`
- **Lote:** L20a
- **Linhas:** 93
- **SHA1:** 8beda1264301ea2392ceccc9364620d7b852c6f6
- **Partes lidas:** 1-93
- **Propósito:** Verifica a regra única de endereço: Link e Form aceitam caminho relativo, mailto, tel e domínio sem esquema guardado como https, recusam javascript: e fragmento sem alvo com o motivo ao lado do campo, e o Poster de vídeo e as declarações livres seguem a mesma regra.
- **Âncora:** `tests/e2e/address-rule.spec.ts:11` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/app-menu.spec.ts`
- **Lote:** L20a
- **Linhas:** 159
- **SHA1:** b4d14ac05028e1b0249b26b5757973ea340371ed
- **Partes lidas:** 1-159
- **Propósito:** Cobre o menu da aplicação: foco no primeiro item ao abrir, setas movem o foco, Escape fecha e devolve o foco ao botão, F10 abre a barra de menus e as setas andam pelos menus abrindo e fechando submenu, item sem seleção fica desabilitado com motivo e nada faz, e o ponteiro que cruza outro botão a caminho usa o item de destino.
- **Âncora:** `tests/e2e/app-menu.spec.ts:10` `const DUPLICATE = 'element.duplicate#menu-edit';`

### `tests/e2e/assistant.spec.ts`
- **Lote:** L20a
- **Linhas:** 203
- **SHA1:** db2ec69bfead1282f45f6a232ca1c28750270ca9
- **Partes lidas:** 1-203
- **Propósito:** Cobre o assistente: a chave fica cifrada no IndexedDB fora dos dados do projeto, as edições por ferramentas viram uma entrada de undo e o Stop desfaz, a captura do canvas chega ao companheiro, e a imagem de referência vai ao provedor antes das palavras com o layout construído em uma entrada de undo.
- **Âncora:** `tests/e2e/assistant.spec.ts:7` `const OPEN = 'workspace.setPanelOpen#toolbar-activity-bar-assistant';`

### `tests/e2e/autosave-corruption-recovery.spec.ts`
- **Lote:** L20a
- **Linhas:** 70
- **SHA1:** a83d0b26adb1bf21064bf3848be5ed9042b00ee0
- **Partes lidas:** 1-70
- **Propósito:** Verifica que, com o registro salvo corrompido, o estado fica recoveryRequired, o diálogo de recuperação abre e uma edição não grava nada, e que File › New blank page volta a permitir a gravação do autosave.
- **Âncora:** `tests/e2e/autosave-corruption-recovery.spec.ts:9` `const INSERT_VIEW = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/autosave-crash-recovery.spec.ts`
- **Lote:** L20a
- **Linhas:** 128
- **SHA1:** a705bf0da0a703e821584729ba6a6e827dd1f4cc
- **Partes lidas:** 1-128
- **Propósito:** Lê o IndexedDB no navegador e verifica que são guardadas as últimas dez versões com o tempo de cada uma, que uma mudança que não chegou ao registro volta do diário no arranque seguinte com aviso na barra de status, e que um projeto grande demais para o journal rápido o mantém no IndexedDB sem perder mudança.
- **Âncora:** `tests/e2e/autosave-crash-recovery.spec.ts:11` `const INSERT_VIEW = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/autosave.spec.ts`
- **Lote:** L20a
- **Linhas:** 67
- **SHA1:** 357fec5109bcba819e7729d68089031ef35f03b2
- **Partes lidas:** 1-67
- **Propósito:** Verifica que uma mudança sobrevive a um recarregamento imediato mesmo com o IndexedDB ocupado por uma transação retida, usando o diário gravado antes do descarregamento da página.
- **Âncora:** `tests/e2e/autosave.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/base-style.spec.ts`
- **Lote:** L20a
- **Linhas:** 106
- **SHA1:** cec573a4500f55895937f6a328da47d5be93a9b2
- **Partes lidas:** 1-106
- **Propósito:** Verifica que os padrões neutros da base aparecem no canvas e na exportação, que o CSS importado mantém o valor próprio, e que a página exportada reproduz as mesmas medidas do canvas.
- **Âncora:** `tests/e2e/base-style.spec.ts:7` `const IMPORT = 'project.importHtml#menu-file';`

### `tests/e2e/border-width-zoom.spec.ts`
- **Lote:** L20a
- **Linhas:** 36
- **SHA1:** a94693721a90bb141a6a56cb0512eb3b0866ade7
- **Partes lidas:** 1-36
- **Propósito:** Verifica que o campo Border mostra a largura que a página dá ao elemento, no zoom de ajuste e em 100 %, lendo a largura declarada nas folhas de estilo e não o valor dividido pelo zoom.
- **Âncora:** `tests/e2e/border-width-zoom.spec.ts:10` `const INSERT = 'element.insert#elements-tile';`

### `tests/e2e/box-model.spec.ts`
- **Lote:** L20a
- **Linhas:** 128
- **SHA1:** f4a9b320ef8987121debf323223b264afc13450b
- **Partes lidas:** 1-128
- **Propósito:** Confere na geometria que o navegador calcula que cada caixa do modelo de caixa envolve a seguinte, que o campo de cada lado fica no lado que o índice nomeia, que o Tab caminha cada caixa de cima em sentido horário e que um clique num lado seleciona o valor.
- **Âncora:** `tests/e2e/box-model.spec.ts:11` `const SIDES = ['top', 'right', 'bottom', 'left'] as const;`

### `tests/e2e/browser-language.spec.ts`
- **Lote:** L20a
- **Linhas:** 105
- **SHA1:** b8004f84340d69d3cdf8a9f4a80b78888bb32f34
- **Partes lidas:** 1-105
- **Propósito:** Verifica que o editor abre no idioma do navegador quando ninguém escolheu, que a escolha de idioma permanece após recarregar, que o editor novo abre no painel Insert com o nome Inserir, que o rótulo Exportar ZIP cabe na barra em 1280 px, que a mensagem de uma camada fica no singular, que sem IndexedDB o motivo sai no idioma do editor e que valores CSS aparecem como o CSS os escreve.
- **Âncora:** `tests/e2e/browser-language.spec.ts:8` `test.use({ locale: 'pt-BR' });`

### `tests/e2e/canonical-details.spec.ts`
- **Lote:** L20a
- **Linhas:** 69
- **SHA1:** 60c30d5be2354c829b983784bef9203b097ced28
- **Partes lidas:** 1-69
- **Propósito:** Confere detalhes contra a interface canônica: Paste style leva ícone como Copy style, o item do menu de contexto diz Layout, o chip do painel rápido desenha o glifo settings-2, o Open Explorer da barra de comandos leva o ícone do Explorer, o rodapé da barra diz as palavras canônicas e o Tab alcança as pastilhas de escopo.
- **Âncora:** `tests/e2e/canonical-details.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/canvas-fit.spec.ts`
- **Lote:** L20a
- **Linhas:** 33
- **SHA1:** ddc60b64b27143a3524294aae3352aca6565b179
- **Partes lidas:** 1-33
- **Propósito:** Verifica que a moldura da página já tem a largura ajustada desde o primeiro quadro pintado, registrando a largura em cada quadro antes de qualquer código do aplicativo rodar.
- **Âncora:** `tests/e2e/canvas-fit.spec.ts:6` `import { expect, expectBrowserErrors, test } from '../support/test.ts';`

### `tests/e2e/capture-media.spec.ts`
- **Lote:** L20a
- **Linhas:** 186
- **SHA1:** 909bea4bbe48e825691e85483f2a61120edc295c
- **Partes lidas:** 1-186
- **Propósito:** Cobre a captura de mídia: uma regra min-width capturada sobrevive a importação e exportação em telas largas sem vazar para o telefone, o poster de um vídeo capturado mantém as proporções, a moldura pintada mostra a imagem da sua largura, e a mudança de largura não recarrega a moldura quando a imagem não muda e preserva o desenho de um canvas.
- **Âncora:** `tests/e2e/capture-media.spec.ts:14` `const IMPORT = 'project.importHtml#menu-file';`

### `tests/e2e/capture-url-layout.spec.ts`
- **Lote:** L20a
- **Linhas:** 24
- **SHA1:** 84108aabfcc96cbdbe493dbaf092595117a39a26
- **Partes lidas:** 1-24
- **Propósito:** Verifica que os textos do diálogo de captura de endereço ficam no espaçamento do diálogo, sob o que explicam.
- **Âncora:** `tests/e2e/capture-url-layout.spec.ts:8` `const CAPTURE = 'workspace.openDialog#menu-file-capture-url';`

### `tests/e2e/capture-url.spec.ts`
- **Lote:** L20a
- **Linhas:** 503
- **SHA1:** 1054efa6a35ac144d6ee10bf93e0e7cfe44e62ed
- **Partes lidas:** 1-503
- **Propósito:** Cobre a abertura de um endereço web com o Builder Companion: a captura de um site local com script, folha de estilo e imagens, a chegada por Import HTML, a cascata e o DOM mistos no canvas e na exportação, larguras dirigidas por script, fontes de imagem responsivas, classes na raiz, edição de nós capturados em todas as larguras, o que um script construiu, duas páginas com ligação entre arquivos, o aviso sem o Companion e a extensão capturando uma página atrás de login.
- **Âncora:** `tests/e2e/capture-url.spec.ts:18` `const SITE_PORT = 5421;`

### `tests/e2e/card-labels-fit.spec.ts`
- **Lote:** L20a
- **Linhas:** 65
- **SHA1:** ff8f270253a2caa66e86a1b4bea9931df95298a1
- **Partes lidas:** 1-65
- **Propósito:** Verifica que todo nome na coluna de rótulo de um cartão cabe em uma linha, em inglês e em português, nos diálogos, no Timeline e nos cartões da aba Interactions.
- **Âncora:** `tests/e2e/card-labels-fit.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/census.spec.ts`
- **Lote:** L20a
- **Linhas:** 99
- **SHA1:** 0dd4a6abb86ad01056ae60d296f126a7061f1917
- **Partes lidas:** 1-99
- **Propósito:** Lê o manifesto, as anotações de porta dos testes e os cenários, e falha quando uma porta é desenhada habilitada sem comando construído, quando um comando construído não tem teste que rode uma porta sua, quando uma porta alcançável não é rodada por nenhum teste, e quando uma funcionalidade registrada como construída não tem cenário.
- **Âncora:** `tests/e2e/census.spec.ts:26` `import { DOOR_ANNOTATION, UNAVAILABLE_ANNOTATION } from './door.ts';`

### `tests/e2e/clipboard-cut-styles.spec.ts`
- **Lote:** L20a
- **Linhas:** 171
- **SHA1:** dc08140f53fed263e983a025d6aae6c0bc692ef4
- **Partes lidas:** 1-171
- **Propósito:** Lê o clipboard do sistema depois de cortar ou copiar: guarda o formato da aplicação em texto simples e a marcação exportada com regras CSS em HTML, sem atributo do editor, id de nó ou estilo embutido, e confere o que colar cada formato faz ao documento; cobre também Copy style e Paste style com uma entrada de undo.
- **Âncora:** `tests/e2e/clipboard-cut-styles.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/clipboard-menu.spec.ts`
- **Lote:** L20a
- **Linhas:** 83
- **SHA1:** 2b76624f0c676a30a70acb03009fabbacc51ec01
- **Partes lidas:** 1-83
- **Propósito:** Cobre Copy e Paste pelo menu Edit: a cópia vai ao clipboard do sistema, a colagem entra logo depois da folha selecionada com ids novos e nome único, vira a seleção e ocupa uma entrada de undo.
- **Âncora:** `tests/e2e/clipboard-menu.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/code-panel.spec.ts`
- **Lote:** L20a
- **Linhas:** 289
- **SHA1:** 07c5f3a3e490066c77c15d2824ece6db451fa2fa
- **Partes lidas:** 1-289
- **Propósito:** Verifica o painel de código: o texto mostrado é o mesmo que a exportação escreve, byte a byte, para a página e para a folha de estilos; Copy entrega exatamente esse texto e Download o mesmo em arquivo; selecionar um elemento marca e rola até suas linhas; um clique numa linha seleciona o elemento; o painel escreve a subárvore do elemento e recusa uma linha que não é declaração; um arquivo JS é editado e salvo com a página rodando no Preview; a tecla Delete no painel não apaga o elemento; um arquivo de texto ganha aba própria; e o painel fica dentro da sua coluna.
- **Âncora:** `tests/e2e/code-panel.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/color-picker-oklch.spec.ts`
- **Lote:** L20a
- **Linhas:** 56
- **SHA1:** 6458b497ea123de14d8f4e601f5ce566e97c99a0
- **Partes lidas:** 1-56
- **Propósito:** Verifica que o seletor de cor lê nome de cor e oklch() como uma só cor, mostra os canais em RGB e OKLCH, guarda uma cor fora do sRGB e avisa mostrando a cor mais próxima.
- **Âncora:** `tests/e2e/color-picker-oklch.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/color-picker.spec.ts`
- **Lote:** L20a
- **Linhas:** 138
- **SHA1:** 38796d225c64c2305860ebe168d45b1ed2b0e861
- **Partes lidas:** 1-138
- **Propósito:** Verifica que a área e o controle de matiz se movem pelo teclado com um passo na seta e dez com Shift, que um recarregamento antes de Apply mantém a cor de antes, que Previous devolve a cor que a página mostrava, que o cabeçalho nomeia a propriedade e o elemento e que uma cor parte de um valor maior aparece como amostra.
- **Âncora:** `tests/e2e/color-picker.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/command-bar-other-names.spec.ts`
- **Lote:** L20a
- **Linhas:** 27
- **SHA1:** efbe92d3187ec87174e08a759ba91956bc4890f2
- **Partes lidas:** 1-27
- **Propósito:** Verifica que em português a barra de comandos encontra um elemento pelo nome em inglês e pelo tag, e o insere.
- **Âncora:** `tests/e2e/command-bar-other-names.spec.ts:8` `const CTRL_K = 'commandBar.open#key-ctrl-k-in-global';`

### `tests/e2e/command-bar-set-property.spec.ts`
- **Lote:** L20a
- **Linhas:** 115
- **SHA1:** 46cfe8f5fbcc5b43b7c6295950d516fc2eec0994
- **Partes lidas:** 1-115
- **Propósito:** Verifica que digitar propriedade e valor oferece defini-la, que a entrada escreve o valor pelo escritor da propriedade em uma entrada de undo com o canvas acompanhando, que um valor que a propriedade não aceita nunca é oferecido, e que a entrada de editar a propriedade abre o inspector no campo com foco sem mudar o documento.
- **Âncora:** `tests/e2e/command-bar-set-property.spec.ts:11` `const SET = 'style.set#command-bar-set-property';`

### `tests/e2e/command-bar.spec.ts`
- **Lote:** L20a
- **Linhas:** 186
- **SHA1:** 5939526e4ea5d2c44df81f20cb0ee70d8adf3faf
- **Partes lidas:** 1-186
- **Propósito:** Cobre a barra de comandos: oferece um comando só enquanto ele se aplica à seleção, mostra primeiro a entrada rodada por último, casa as palavras da consulta em qualquer ordem, fecha com uma pressão no fundo, não abre com Ctrl+K enquanto um texto é editado, mostra um ícone por entrada, as pastilhas de escopo mostram e mudam o escopo guardando as palavras, um comando que não pode rodar agora diz o motivo, e as palavras de cada entrada começam no mesmo lugar.
- **Âncora:** `tests/e2e/command-bar.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/concept-row-heads.spec.ts`
- **Lote:** L20a
- **Linhas:** 31
- **SHA1:** 6d926ebc2668b6d33f2b4dffb12ed4ae90cf9938
- **Partes lidas:** 1-31
- **Propósito:** Verifica que o nome de cada linha de conceito fica no nível do seu disclosure, com o centro do rótulo a menos de dois pixels do centro do botão.
- **Âncora:** `tests/e2e/concept-row-heads.spec.ts:9` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/context-menu.spec.ts`
- **Lote:** L20a
- **Linhas:** 217
- **SHA1:** 0eebd0ca7486c99feda18d6651bc54af7f76cdd1
- **Partes lidas:** 1-217
- **Propósito:** Cobre o menu de contexto: mostra só os comandos construídos que se aplicam, na ordem do manifesto, cada um com o atalho no título; um clique secundário dentro da seleção a mantém; o menu fica dentro da janela; Escape, um clique fora e um item rodado devolvem o foco à linha das Camadas; e o menu do navegador não abre no canvas nem numa linha.
- **Âncora:** `tests/e2e/context-menu.spec.ts:14` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/coordinates.spec.ts`
- **Lote:** L20a
- **Linhas:** 244
- **SHA1:** 26ad4c847a28a64ea54313c5c8a6fba84088a36a
- **Partes lidas:** 1-244
- **Propósito:** Mede, em cada nível de zoom de manifest/environment.json, que o clique real num ponto de tela atinge o elemento que a página dispõe ali, que o ponto recebido de volta em coordenadas da página coincide com o clicado e que screenBox bate com a caixa que o Chrome pintou.
- **Âncora:** `tests/e2e/coordinates.spec.ts:21` `const MODULE = '/proofs.js';`

### `tests/e2e/corpus-reference.spec.ts`
- **Lote:** L20a
- **Linhas:** 144
- **SHA1:** 6afe8531ad9bcf70a7a22a31548a43a0b37784fd
- **Partes lidas:** 1-144
- **Propósito:** Registra uma referência a partir de uma navegação nova em cada largura e a repete com os recursos escolhidos; verifica que o assentamento espera conteúdo preguiçoso visível, que a evidência de disposição nomeia um elemento sem marca que ultrapassa a janela, e que a evidência de diferença marca pixels e identifica o primeiro elemento alterado e a faixa mudada.
- **Âncora:** `tests/e2e/corpus-reference.spec.ts:6` `import { comparePictures } from '../../tools/capture/fidelity.ts';`

### `tests/e2e/css-support.spec.ts`
- **Lote:** L20a
- **Linhas:** 76
- **SHA1:** 207d43fe15613de247cc78486180ef2fa744cc9d
- **Partes lidas:** 1-76
- **Propósito:** Verifica com o CSS.supports do Chrome instalado que toda palavra-chave, valor e unidade oferecidos pelas portas são aceitos para alguma das propriedades a que se destinam.
- **Âncora:** `tests/e2e/css-support.spec.ts:7` `import { GENERATED_VALUES } from '../../src/generated/value-lists.ts';`

### `tests/e2e/current-state.spec.ts`
- **Lote:** L20a
- **Linhas:** 169
- **SHA1:** e0c878f9168d9aee62dcaa5a2d993b78faf90e2f
- **Partes lidas:** 1-169
- **Propósito:** Verifica que uma porta de comando não construído não diz nem parece dizer o estado corrente: nenhum atributo pressionado, selecionado ou marcado, nenhum visual de seleção entre portas lado a lado nem em linha da barra lateral, e nenhum item de menu marcado.
- **Âncora:** `tests/e2e/current-state.spec.ts:16` `const START_REGIONS: readonly string[] = ['top-bar', 'activity-bar', 'canvas-toolbar', 'status-bar', 'canvas-breakpoints', 'canvas-frame'];`

### `tests/e2e/custom-attributes.spec.ts`
- **Lote:** L20a
- **Linhas:** 48
- **SHA1:** 8a5a5bf5444151aeb517ff8020b0f53cb118d8d1
- **Partes lidas:** 1-48
- **Propósito:** Verifica que o nome, o campo de valor e o botão de remover de um atributo personalizado ficam numa linha dentro do inspector, com o botão centrado no campo e depois dele.
- **Âncora:** `tests/e2e/custom-attributes.spec.ts:7` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/custom-fonts.spec.ts`
- **Lote:** L20a
- **Linhas:** 45
- **SHA1:** 954c656ed5ccd163e6e4425ded464c7c4ba56c43
- **Partes lidas:** 1-45
- **Propósito:** Verifica que as fontes do projeto encabeçam o menu de fontes, cada uma desenhada com a própria face, sem More values e também em Essentials apenas.
- **Âncora:** `tests/e2e/custom-fonts.spec.ts:10` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/default-state-controls.spec.ts`
- **Lote:** L20a
- **Linhas:** 73
- **SHA1:** 98af6e7e491af3de972d12cd61ca51192370269f
- **Partes lidas:** 1-73
- **Propósito:** Verifica que um campo desenha o Reset só enquanto o elemento guarda um valor próprio, que a barra do painel rápido deixa de fora align e distribute enquanto não podem agir, e que um controle que não pode agir é desenhado claramente desabilitado, na tinta sutil, sem opacidade reduzida e sem placa de hover.
- **Âncora:** `tests/e2e/default-state-controls.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/delete-element.spec.ts`
- **Lote:** L20a
- **Linhas:** 131
- **SHA1:** 6ec2007b8ff26fe1106df3bacfdca9e3283bc161
- **Partes lidas:** 1-131
- **Propósito:** Cobre o Delete pelo menu Edit: desabilitado com motivo sem seleção; apaga a seleção como as teclas; remove todas as raízes selecionadas em um passo com um Undo que as devolve; e o toast mostra no máximo um aviso, com o Undo desfazendo só o apagamento mais recente.
- **Âncora:** `tests/e2e/delete-element.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/distribute-availability.spec.ts`
- **Lote:** L20a
- **Linhas:** 83
- **SHA1:** 79a264be8eb0132112cb11c09eeab527070c3373
- **Partes lidas:** 1-83
- **Propósito:** Verifica que Distribute fica disponível só com três elementos posicionados ou mais, dizendo o próprio motivo e nunca o de Align, que um clique forçado não muda nada, e que uma porta lê o breakpoint mostrado, com o align valendo no Phone e a mensagem contando um elemento em palavras.
- **Âncora:** `tests/e2e/distribute-availability.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/dock-empty-states.spec.ts`
- **Lote:** L20a
- **Linhas:** 46
- **SHA1:** 3a0bb589aaf7c21deaf19ef46e08deecff97ccbb
- **Partes lidas:** 1-46
- **Propósito:** Verifica que os painéis do dock dizem uma coisa por vez: o Timeline pede um elemento sem seleção e diz que o elemento não guarda animação com um selecionado, e o painel Motion diz uma vez que o projeto não tem timeline.
- **Âncora:** `tests/e2e/dock-empty-states.spec.ts:12` `const ROW = 'selection.select#layers-row';`

### `tests/e2e/dock-panels-reachable.spec.ts`
- **Lote:** L20a
- **Linhas:** 19
- **SHA1:** 02a9d3ab7c15f6127c9657cd87bcd331d23a5aae
- **Partes lidas:** 1-19
- **Propósito:** Verifica que, com o dock aberto no Timeline, o painel Motion abre pela faixa de abas.
- **Âncora:** `tests/e2e/dock-panels-reachable.spec.ts:8` `const TIMELINE = 'workspace.setPanelOpen#dock-strip-timeline';`

### `tests/e2e/door-state.spec.ts`
- **Lote:** L20a
- **Linhas:** 121
- **SHA1:** bae21969bb58f2accae417e0707ebcc9d0768ab7
- **Partes lidas:** 1-121
- **Propósito:** Verifica que uma porta construída que representa um estado diz se está ligada, por aria-pressed nos botões de alternância e aria-checked nos itens de escolha, com o desenho conferido ao lado (a vista da barra lateral, a altura do dock, o brilho do fundo), e que a ação principal da barra superior veste o acento quando pode rodar e exporta o site.
- **Âncora:** `tests/e2e/door-state.spec.ts:5` `import { openEditor } from '../support/editor.ts';`

### `tests/e2e/door.ts`
- **Lote:** L20a
- **Linhas:** 572
- **SHA1:** 3b166aa1fa3a06966bd0afae45e4b86ba996c105
- **Partes lidas:** 1-572
- **Propósito:** Reúne os utilitários dos testes de ponta a ponta sobre as portas do manifesto: carrega portas e menus, anota cada porta rodada para o censo, resolve a seção e a linha do inspector em que um campo é desenhado, e executa uma porta como uma pessoa faria — atalho, item de menu, clique com tecla ou botão, duplo clique, barra de comandos, arraste — com esperas por quadro, sondagem de ponto livre e abertura de seções e painéis.
- **Âncora:** `tests/e2e/door.ts:139` `export const DOOR_ANNOTATION = 'door';`

### `tests/e2e/doors.spec.ts`
- **Lote:** L20a
- **Linhas:** 49
- **SHA1:** 3700c81d538162f8637d3d8b8d1af58336217312
- **Partes lidas:** 1-49
- **Propósito:** Verifica, no Chrome instalado e em inglês e português, que uma porta com faceLabelKey mostra o texto curto no desenho e mantém o rótulo completo como nome acessível.
- **Âncora:** `tests/e2e/doors.spec.ts:14` `const faced: { ref: string; labelKey: string; faceLabelKey: string }[] = [];`

### `tests/e2e/draft-recovery.spec.ts`
- **Lote:** L20a
- **Linhas:** 201
- **SHA1:** c42faa9428651c2d4c8fc0fe34a51ac1957f661d
- **Partes lidas:** 1-201
- **Propósito:** Cobre o rascunho de edição: cada tipo de campo avisa antes de recarregar e volta não confirmado com o cursor no lugar; o texto do canvas volta com a edição aberta; o rascunho volta quando o último salvamento de seleção não chegou ao idle; marcas, quebras de linha e cursor sobrevivem; um rascunho confirmado não volta num projeto substituto com os mesmos ids; uma aba aberta por outra descarta o rascunho copiado; e o rascunho de classe volta no estado hover e no breakpoint tablet.
- **Âncora:** `tests/e2e/draft-recovery.spec.ts:6` `const project = (page: Page) => page.evaluate(() => (window as unknown as { __builderTestPort: { document(): unknown } }).__builderTestPort.document());`

### `tests/e2e/drag-autoscroll.spec.ts`
- **Lote:** L20a
- **Linhas:** 48
- **SHA1:** 3ee97e54e5e8379a7e201443b17c88a68881d32d
- **Partes lidas:** 1-48
- **Propósito:** Verifica que arrastar uma linha até a borda inferior da árvore de Camadas rola a árvore até as linhas abaixo do corte, medindo a própria rolagem, e que Escape durante o arraste deixa o documento como estava.
- **Âncora:** `tests/e2e/drag-autoscroll.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drag-container.spec.ts`
- **Lote:** L20a
- **Linhas:** 89
- **SHA1:** 6d2ca493b23bcd98da08a5ab8ad985f68e7fe3d7
- **Partes lidas:** 1-89
- **Propósito:** Verifica que um arraste começado dentro de um contêiner selecionado arrasta o contêiner, com o gesto de mão, mantendo o título dentro dele, e que um clique no título sem arraste seleciona o título.
- **Âncora:** `tests/e2e/drag-container.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drag-drop-inside.spec.ts`
- **Lote:** L20a
- **Linhas:** 225
- **SHA1:** 6b739d76b5606ad7459b41af0913b397ee0c8f2b
- **Partes lidas:** 1-225
- **Propósito:** Mede o desenho do canvas durante um arraste para dentro de contêineres: contêiner vazio contornado sólido e preenchido como receptor, sem linha, com o rótulo nomeando-o e a soltura colocando o elemento nele; contêiner com filhos com a linha na lacuna do ponteiro; o fundo da página como receptor no fim; e o próprio lugar do elemento arrastado desenhado como qualquer outro, sem mudança na soltura.
- **Âncora:** `tests/e2e/drag-drop-inside.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drag-level-keys-escape.spec.ts`
- **Lote:** L20a
- **Linhas:** 370
- **SHA1:** 18f746e24a3d63a0267c82cb609fd702cd3dd6e1
- **Partes lidas:** 1-370
- **Propósito:** Cobre as teclas de nível e o Escape no arraste: a tecla de nível redesenha linha e rótulo ato contínuo, sem mover o ponteiro, e o rótulo conta os níveis subidos; o topo recusa; Escape tira todas as marcas do arraste e a soltura seguinte não muda nada, com a seleção da pressão mantida; Escape na marquee devolve a seleção de antes da pressão; e o arraste de criação de um bloco da paleta sobe os mesmos níveis, com o Escape sem inserir.
- **Âncora:** `tests/e2e/drag-level-keys-escape.spec.ts:14` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drag-reorder-canvas.spec.ts`
- **Lote:** L20a
- **Linhas:** 252
- **SHA1:** 39ff7ccbf1a2f28c92781cf854baeea5b33c4d8d
- **Partes lidas:** 1-252
- **Propósito:** Mede o que o canvas desenha durante um arraste: a linha de inserção atravessando o receptor na lacuna em que o elemento cai, o contorno do receptor, o rótulo de soltura ao lado da linha sem cobrir texto, o elemento arrastado sem contorno e com o rótulo oculto, a histerese que mantém a proposta desenhada até o ponteiro andar alguns pixels, e uma pressão menor que o limiar que só seleciona.
- **Âncora:** `tests/e2e/drag-reorder-canvas.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drag-selection.spec.ts`
- **Lote:** L20a
- **Linhas:** 100
- **SHA1:** 69dc9a1a65e7dd9319fb8cafa8daf25d0e62646f
- **Partes lidas:** 1-100
- **Propósito:** Verifica que arrastar um de dois títulos selecionados arrasta ambos, na ordem deles, em uma entrada de undo que devolve os dois, e que uma pressão num deles solta sem arraste seleciona só aquele.
- **Âncora:** `tests/e2e/drag-selection.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drop-2d.spec.ts`
- **Lote:** L20a
- **Linhas:** 135
- **SHA1:** eb657bf02a4ccb2d0470fb55b68ecb690386b34e
- **Partes lidas:** 1-135
- **Propósito:** Mede o indicador de soltura em duas dimensões: numa grade a linha desce entre os dois cartões atravessando só a linha deles, e num flex row-reverse a linha fica na borda direita do primeiro cartão, com a peça caindo no lugar que a linha mostra.
- **Âncora:** `tests/e2e/drop-2d.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drop-indicator.spec.ts`
- **Lote:** L20a
- **Linhas:** 196
- **SHA1:** a6a076ab3f2b47ab968a414ce15afe24cbdff181
- **Partes lidas:** 1-196
- **Propósito:** Verifica que a linha de inserção é uma barra de pelo menos 3 px numa cor diferente da seleção, que o contorno do elemento arrastado deixa de ser o da seleção, que o rótulo de soltura nunca fica sob o chip fantasma em qualquer ponto sobre a metade inferior do Intro, que um redimensionamento terminado por ponteiro cancelado ou captura perdida não grava nem lança erro com o próximo gravando um passo, e que Escape com o foco no quadro do canvas cancela o arraste.
- **Âncora:** `tests/e2e/drop-indicator.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drop-refusal.spec.ts`
- **Lote:** L20a
- **Linhas:** 121
- **SHA1:** 648357e894e0fc12cc0b26270430cc24c516bee2
- **Partes lidas:** 1-121
- **Propósito:** Verifica em 25 % que alvos pequenos nunca recebem uma soltura de lado: uma peça de Link solta sobre a metade de um Link cai ao lado dele no mesmo pai sem criar Row, e uma peça solta numa lacuna de 7 px entre dois botões cai entre eles sem criar Row.
- **Âncora:** `tests/e2e/drop-refusal.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drop-rest.spec.ts`
- **Lote:** L20a
- **Linhas:** 154
- **SHA1:** c386acf19961f2cd20bc500bb6447415ce022be1
- **Partes lidas:** 1-154
- **Propósito:** Verifica com gestos de mão que, com o ponteiro parado sobre uma lacuna tremendo alguns pixels, a proposta é uma só, a linha fica parada, os elementos da página não se movem e nada é previsualizado, com o documento intacto; que a soltura cai onde a linha estava; que Escape tira a linha e a soltura não muda nada; e que uma peça da paleta repete o comportamento.
- **Âncora:** `tests/e2e/drop-rest.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drop-small-targets.spec.ts`
- **Lote:** L20a
- **Linhas:** 168
- **SHA1:** e8081c150e2a59c1f12e6a226241bf5050caa47e
- **Partes lidas:** 1-168
- **Propósito:** Verifica em 25 % que uma peça solta 10 px abaixo do meio de um contêiner vazio, fora da caixa dele, cai dentro dele pelo seu alvo, e que perto do topo do Hero a faixa mantém o tamanho em pixels de tela com a soltura caindo antes do Hero; cobre também as bordas de fuga de uma linha de links.
- **Âncora:** `tests/e2e/drop-small-targets.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/drop-words.spec.ts`
- **Lote:** L20a
- **Linhas:** 101
- **SHA1:** 295ce6a659e49b2ae129a2d3cc7ce74a7092f369
- **Partes lidas:** 1-101
- **Propósito:** Verifica que o rótulo de soltura nomeia o vizinho e o caminho até o cartão, que a barra de status repete as palavras, que a barra do canvas mostra as teclas do arraste e as esconde após a soltura, e que com Alt pressionado o rótulo e a barra começam por Duplicate, com a soltura deixando o original e largando uma cópia.
- **Âncora:** `tests/e2e/drop-words.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/duplicate.spec.ts`
- **Lote:** L20a
- **Linhas:** 169
- **SHA1:** 2dfddab52767f5e40e943143fff4bf20d49a0859
- **Partes lidas:** 1-169
- **Propósito:** Cobre o Duplicate: Ctrl+D e o item do menu Edit copiam cada raiz selecionada logo depois do original com toda a subárvore, textos e classes, com id novo e nome único em cada nó; as cópias viram a seleção; um passo de undo as tira e o redo traz as mesmas cópias; e a raiz da página é recusada.
- **Âncora:** `tests/e2e/duplicate.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/easing-curve.spec.ts`
- **Lote:** L20a
- **Linhas:** 38
- **SHA1:** 1dd6f9bc57c64d4fdfb2eb8bcc8f283790db9ae1
- **Partes lidas:** 1-38
- **Propósito:** Verifica que as curvas prontas de easing são escolhidas pelo desenho e que uma Bézier digitada pelos pontos de controle é usada, com o campo mantendo o último valor.
- **Âncora:** `tests/e2e/easing-curve.spec.ts:10` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/edicao-pendente.spec.ts`
- **Lote:** L20a
- **Linhas:** 195
- **SHA1:** 4d9fec4c156c90065a491d59947a33814873df6d
- **Partes lidas:** 1-195
- **Propósito:** Verifica G1 e G2: um valor digitado num campo do inspector e ainda não gravado é gravado uma vez, no contexto em que foi digitado (os elementos e o breakpoint do canvas), antes da próxima ação, seja ela uma aba de breakpoint, outra aba do inspector, uma pressão noutro elemento (no canvas e em Camadas), uma alça arrastada, um comando de menu ou o Undo — para campos de número, de texto de estilo e de atributo.
- **Âncora:** `tests/e2e/edicao-pendente.spec.ts:10` `import { NODE_PATH, type TestBootCommand } from '../../src/editor/test-boot.ts';`

### `tests/e2e/elements-structure.spec.ts`
- **Lote:** L20a
- **Linhas:** 402
- **SHA1:** f31eb5796a154f8911e24b779699cbbb62022d05
- **Partes lidas:** 1-402
- **Propósito:** Cobre a estrutura de elementos: cada peça do grupo Structure insere o seu elemento, desenhado pelo tag e mantido visível vazio só pelo canvas, sem Card; um elemento interativo nunca entra num Link Block nem num elemento dentro dele, por todas as portas (Enter e Space na peça focada, peça arrastada, elemento arrastado); o endereço de Link mantém o link no Enter, ao sair do campo e num clique fora, para o Link Block para o qual foi desenhado; um campo esvaziado tira o href; um endereço não seguro é recusado; e um Link Block travado mantém o link.
- **Âncora:** `tests/e2e/elements-structure.spec.ts:14` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/empty-container.spec.ts`
- **Lote:** L20a
- **Linhas:** 69
- **SHA1:** a2936ffddde245cdaa9e28df8a24a26c98bd0de7
- **Partes lidas:** 1-69
- **Propósito:** Verifica que um contêiner vazio recebe no canvas uma altura mínima visível, só do editor, que pode ser clicado, e que nada disso entra no JSON do documento nem na marcação do nó (sem estilo embutido nem classe), enquanto um contêiner com filhos e a raiz da página mantêm a altura própria.
- **Âncora:** `tests/e2e/empty-container.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/empty-elements.spec.ts`
- **Lote:** L20a
- **Linhas:** 71
- **SHA1:** 1894e83b97ce5c74c86ddaabe5a9fa4ce6f7f7cf
- **Partes lidas:** 1-71
- **Propósito:** Verifica que um título com o texto apagado mantém no canvas a altura mínima de texto vazio, aceita um clique ali, tem a linha de Camadas dizendo que está vazio, e que a exportação não leva marca nem regra do editor.
- **Âncora:** `tests/e2e/empty-elements.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/empty-page-size.spec.ts`
- **Lote:** L20a
- **Linhas:** 20
- **SHA1:** 34691c5ea3dbcf55ae50ecd1bb585bd65bc62dfa
- **Partes lidas:** 1-20
- **Propósito:** Verifica que a raiz de uma página vazia tem no canvas a altura da tela do breakpoint, em todo breakpoint, com o rótulo dizendo a medida e a barra de status repetindo-a.
- **Âncora:** `tests/e2e/empty-page-size.spec.ts:7` `const ROW = 'selection.select#layers-row';`

### `tests/e2e/escape-closes.spec.ts`
- **Lote:** L20a
- **Linhas:** 85
- **SHA1:** 62e189beba2991e79cff00b07c0fee8b55f83390
- **Partes lidas:** 1-85
- **Propósito:** Verifica que Escape fecha o que abriu sem guardar nada: os popups de + Class e Save as class, que também ficam dentro da janela sem rolar o inspector de lado; um renomear nas Camadas, que mantém o nome; e uma confirmação, que responde Cancelar mantendo o foco preso dentro dela até lá e devolvendo-o ao controle que perguntou.
- **Âncora:** `tests/e2e/escape-closes.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/espaco.spec.ts`
- **Lote:** L20a
- **Linhas:** 190
- **SHA1:** 223cf82ca65e9621eea602672bff6e1e8f831cb7
- **Partes lidas:** 1-190
- **Propósito:** Verifica G4 e G5, com G6 e G7 de carona: em pt-BR a 1280 × 720 e em inglês a 1440 × 900, numa página de doze níveis com nomes longos, nenhum painel rola de lado, toda barra guarda seus controles dentro da janela, nenhum controle visível passa a borda ou fica coberto, o elemento recém-inserido aparece no canvas sem nada sobre o seu início, todas as vistas mostram a mesma seleção, e o canvas que um recarregamento desenha é o que as edições desenharam.
- **Âncora:** `tests/e2e/espaco.spec.ts:12` `import type { TestBootCommand } from '../../src/editor/test-boot.ts';`

### `tests/e2e/explorer-assets.spec.ts`
- **Lote:** L20a
- **Linhas:** 201
- **SHA1:** 2790b2a83290a6eeef4a75ef68a54c812ced60ec
- **Partes lidas:** 1-201
- **Propósito:** Cobre os arquivos do Explorer: o botão Upload guarda um arquivo que o inspector lista com o tamanho intrínseco, mantido após recarregar; um arquivo de imagem solto na pasta é enviado sem sobrescrever outro de mesmo nome; um arquivo solto sobre uma imagem troca a fonte dela e a exportação leva o arquivo; o campo Source escolhe um arquivo do projeto pelo seletor e pelas sugestões, com Escape e o botão de fechar saindo; e um clique fora fecha o seletor e digita no campo seguinte.
- **Âncora:** `tests/e2e/explorer-assets.spec.ts:12` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/explorer-files.spec.ts`
- **Lote:** L20a
- **Linhas:** 138
- **SHA1:** 542be9624aef80c4233a936505be633ce4d3d7b0
- **Partes lidas:** 1-138
- **Propósito:** Cobre a árvore de arquivos do Explorer: pasta e arquivo são feitos digitando os caminhos, um arquivo é renomeado pelo campo do nome da linha, movido para uma pasta pelas entradas Move to… e apagado (uma pasta que guarda arquivos pergunta antes), com um undo devolvendo cada passo; os caminhos gerados pelo documento e as pastas que os guardam são recusados em toda parte; uma linha de código mostra o seu tipo como etiqueta; e só a página no canvas é renomeada no lugar.
- **Âncora:** `tests/e2e/explorer-files.spec.ts:10` `const NEW_FILE = 'files.createFile#explorer-new-file';`

### `tests/e2e/explorer-pages.spec.ts`
- **Lote:** L20a
- **Linhas:** 29
- **SHA1:** f1f1561048d98b6b2691879d2e0423e23400156c
- **Partes lidas:** 1-29
- **Propósito:** Verifica que o + da lista de páginas dá o foco ao campo do nome da página nova com o nome selecionado, para digitar o nome e Enter guardá-lo com o arquivo acompanhando, e que um segundo + cria a segunda página.
- **Âncora:** `tests/e2e/explorer-pages.spec.ts:8` `const ADD = 'pages.add#explorer-add-page';`

### `tests/e2e/export-cascade.spec.ts`
- **Lote:** L20a
- **Linhas:** 65
- **SHA1:** f82a6824d89f8dcc2dde2102d5a2f62edd168ce7
- **Partes lidas:** 1-65
- **Propósito:** Verifica que a página exportada bate com o canvas em todo breakpoint: num projeto de duas seções e uma grade, cada um com valores próprios de tablet e phone, todo elemento tem os mesmos estilos calculados no canvas a 100 % e na página do arquivo servida na largura da página da moldura.
- **Âncora:** `tests/e2e/export-cascade.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/responsive-sections.json';`

### `tests/e2e/export-zip.spec.ts`
- **Lote:** L20a
- **Linhas:** 122
- **SHA1:** 19f758e58efb9cc9a5939357f54b626e62ef0a34
- **Partes lidas:** 1-122
- **Propósito:** Verifica que a página exportada tem os estilos calculados do canvas elemento a elemento; que a folha exportada começa pelo estilo base do projeto, antes dos tokens e das classes; e que os elementos exportados ficam onde o canvas os desenha, sem espaço entre vizinhos em linha.
- **Âncora:** `tests/e2e/export-zip.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/field-history.spec.ts`
- **Lote:** L20a
- **Linhas:** 122
- **SHA1:** 592647652aa9bf4611fe887eefe64b062fc9219b
- **Partes lidas:** 1-122
- **Propósito:** Verifica que campos de valor confirmados usam o histórico do documento, com undo e os dois atalhos de redo encaminhados sem reaplicar ao sair do campo, enquanto a digitação pendente usa o undo nativo do texto; que um undo imediato após Enter não precisa de clique nem espera; e que o undo na busca de propriedades nunca mexe no histórico do documento.
- **Âncora:** `tests/e2e/field-history.spec.ts:3` `import { expect, test, type Page } from '../support/test.ts';`

### `tests/e2e/field-refusal.spec.ts`
- **Lote:** L20a
- **Linhas:** 64
- **SHA1:** 39aeb1d90d24df756cbac4dbf6d7888de65b9feb
- **Partes lidas:** 1-64
- **Propósito:** Verifica que um valor recusado é dito ao lado do campo: o campo fica no contorno de erro com o texto sob ele, mostra o valor que tinha e o documento o mantém, e digitar de novo tira o aviso; no painel rápido o que foi digitado aparece citado uma vez só, no campo e na barra de status.
- **Âncora:** `tests/e2e/field-refusal.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/flows.spec.ts`
- **Lote:** L20a
- **Linhas:** 19
- **SHA1:** 8780ab786504be17110c4ef3bcc8981ccaf5c83b
- **Partes lidas:** 1-19
- **Propósito:** Roda cada fluxo de tools/ui/flows.ts como um teste próprio num editor novo, com os gestos reais que npm run ui usa, passando quando toda expectativa do fluxo é cumprida e a página não registra erro nem incidente.
- **Âncora:** `tests/e2e/flows.spec.ts:5` `import { expect, installClock, test } from '../support/test.ts';`

### `tests/e2e/font-menu-draft.spec.ts`
- **Lote:** L20a
- **Linhas:** 100
- **SHA1:** ac5b6f1d4dd69f8eddee6f9aec52c2d01601ff16
- **Partes lidas:** 1-100
- **Propósito:** Verifica o rascunho no menu de fontes: abrir e explorar a lista deixa o texto inacabado não confirmado; escolher uma fonte pelo mouse ou pelo teclado substitui o rascunho em exatamente um passo de undo; Escape volta ao rascunho inalterado e Tab confirma uma vez; um clique fora confirma o rascunho no elemento original e seleciona a linha clicada; Tab e Shift+Tab saem da lista confirmando uma vez; e recarregar enquanto explora recupera o rascunho não confirmado.
- **Âncora:** `tests/e2e/font-menu-draft.spec.ts:6` `const FONT = 'style.set#inspector-font-family';`

### `tests/e2e/forms-runtime.spec.ts`
- **Lote:** L20a
- **Linhas:** 158
- **SHA1:** b3cb21e1c77eb51786f8c7ccbd94e92f24a1910f
- **Partes lidas:** 1-158
- **Propósito:** Cobre o runtime dos formulários: uma máscara configurada roda na pré-visualização e no site baixado com erros acessíveis; e os dezenove presets validam e enviam valores crus na pré-visualização e na exportação, cada um formatando o valor aceito, recusando o obrigatório ausente com a mensagem própria e enviando tudo no POST.
- **Âncora:** `tests/e2e/forms-runtime.spec.ts:8` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/guides-grids-names.spec.ts`
- **Lote:** L20a
- **Linhas:** 32
- **SHA1:** 35ccde1f6ba96fdf863cd9dfd20a1f6fcb91ce4d
- **Partes lidas:** 1-32
- **Propósito:** Verifica que nenhum controle de Guides & Grids repete o nome da seção que o contém, nos dois idiomas, e que o alternador das linhas de dobra fica na seção das réguas com um nome como o delas.
- **Âncora:** `tests/e2e/guides-grids-names.spec.ts:9` `const GUIDES = 'workspace.openDialog#menu-view-guides-grids';`

### `tests/e2e/guides-manual.spec.ts`
- **Lote:** L20a
- **Linhas:** 65
- **SHA1:** b06994b45fd521d4fc4c03d615a439cb9a65aa65
- **Partes lidas:** 1-65
- **Propósito:** Verifica que uma pressão e soltura numa régua sem movimento não cria guia, que um guia arrastado sobre a própria régua mostra a dica de exclusão e é apagado ali, e que um guia levado além da régua, fora do canvas, também é apagado.
- **Âncora:** `tests/e2e/guides-manual.spec.ts:9` `const FROM_TOP = 'guides.create#canvas-drag-top-ruler-page';`

### `tests/e2e/hand-keyboard-move.spec.ts`
- **Lote:** L20a
- **Linhas:** 276
- **SHA1:** f44304f4c689599c2b096511001d295574db9cf9
- **Partes lidas:** 1-276
- **Propósito:** Mede o desenho do canvas enquanto a mão do teclado segura um elemento: o indicador igual ao de um arraste de rato (a linha onde o elemento cai, o contorno do receptor, o rótulo nomeando-o, o elemento segurado tracejado e sem rótulo, nada após soltar), o que a barra de status diz a cada tecla (o receptor, a posição e o nível), o Enter em contêiner aninhado em um passo de undo, um alvo recusado anunciado e desenhado como recusa com o Enter sem mudar nada, o Arrange › Take, um elemento oculto recusado, e uma nova seleção encerrando a mão.
- **Âncora:** `tests/e2e/hand-keyboard-move.spec.ts:15` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/hide-element.spec.ts`
- **Lote:** L20a
- **Linhas:** 270
- **SHA1:** cfea705c201f5c702a1ba134c037509f1bda28a1
- **Partes lidas:** 1-270
- **Propósito:** Cobre o esconder de elementos: o olho das Camadas esconde o elemento da linha e mantém a seleção, com a bandeira no JSON, a subárvore inteira fora do desenho e o irmão seguinte tomando o lugar, e um segundo clique o mostra exatamente onde estava, um passo de undo cada; um elemento oculto ainda é selecionado pelas Camadas e mostrado de novo pelo menu de contexto; a raiz é recusada; Element actions › Hide age sobre o primário; a bandeira sobrevive a um recarregamento imediato e vai ao projeto salvo; e a linha mostra o Hide só sob o ponteiro, exceto a de um elemento oculto, que o mantém visível e pressionado.
- **Âncora:** `tests/e2e/hide-element.spec.ts:15` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/history-doors.spec.ts`
- **Lote:** L20a
- **Linhas:** 129
- **SHA1:** a0bad8b2d992ea26e495ea16b6ecc786d17bd868
- **Partes lidas:** 1-129
- **Propósito:** Cobre o Undo e o Redo por todas as portas (Ctrl+Z, Ctrl+Shift+Z, Ctrl+Y, os botões da barra e os itens do menu Edit): sem nada para desfazer ou refazer, a porta desenhada fica desabilitada com o motivo e a tecla o relata na barra de status sem mudar nada; cada porta restaura o documento e a seleção de antes do comando, com o redo os de depois; e um comando novo após um undo esvazia a pilha de redo.
- **Âncora:** `tests/e2e/history-doors.spec.ts:16` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/hover-measure.spec.ts`
- **Lote:** L20a
- **Linhas:** 118
- **SHA1:** 57727c98b28befbcfe5b864cb0f41e23f58e93af
- **Partes lidas:** 1-118
- **Propósito:** Verifica que pairar sobre um elemento mostra o tamanho em px CSS ao lado do contorno de hover; que com uma seleção e Alt pressionado aparecem as distâncias da seleção ao elemento pairado (até um irmão, entre as bordas próximas; até um ancestral, às bordas internas), com os mesmos valores a 50 %; que medir nunca muda a seleção nem o documento; e que um redimensionamento no fluxo desenha a distância ao vizinho mais próximo.
- **Âncora:** `tests/e2e/hover-measure.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/html-import-roundtrip.spec.ts`
- **Lote:** L20a
- **Linhas:** 65
- **SHA1:** 26a2e0834ef2a1a7caeb77fd0d174d26aeae3223
- **Partes lidas:** 1-65
- **Propósito:** Verifica que o ZIP canônico sai byte a byte idêntico depois de importar por File › Import HTML e exportar de novo, e que uma classe de autor sozinha num elemento sem estilo sobrevive a exportar e importar.
- **Âncora:** `tests/e2e/html-import-roundtrip.spec.ts:8` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/import-destinations.spec.ts`
- **Lote:** L20b
- **Linhas:** 118
- **SHA1:** 57ba2d7a04ce4894ab5becd55c440d57e87ab31f
- **Partes lidas:** 1-118
- **Propósito:** Teste e2e da importação de HTML: os três destinos oferecidos (página, dentro de um contêiner e substituir), a importação de uma pasta inteira com páginas, imagens, folha de estilo e ligações, a recusa de um alvo de texto sem contêiner, a confirmação exigida pela substituição e o undo de cada escrita, com o documento lido pela porta de teste e o site exportado lido do ZIP.
- **Âncora:** `tests/e2e/import-destinations.spec.ts:7` `const IMPORT = 'project.importHtml#menu-file';`

### `tests/e2e/insert-same-kind.spec.ts`
- **Lote:** L20b
- **Linhas:** 23
- **SHA1:** 4a45735e6f2f13ebaef28507f5ba58064f1819c3
- **Partes lidas:** 1-23
- **Propósito:** Teste e2e de que uma peça do mesmo tipo do elemento selecionado põe o novo elemento ao lado dele: Grid e depois Card três vezes dá uma grade com três cards, nunca cards aninhados.
- **Âncora:** `tests/e2e/insert-same-kind.spec.ts:7` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/inspector-advanced-mode.spec.ts`
- **Lote:** L20b
- **Linhas:** 61
- **SHA1:** 759a8d3b1a3ca47dcafb1134486d642ddfc06f2c
- **Partes lidas:** 1-61
- **Propósito:** Teste e2e do modo do inspetor: Essentials only deixa de fora os campos de propriedades não essenciais e mantém os que o elemento tem valor, All properties volta a desenhar todos os campos, o campo mantido mostra seu valor e o modo escolhido é guardado no localStorage e sobrevive a um recarregamento.
- **Âncora:** `tests/e2e/inspector-advanced-mode.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-concept-rows.spec.ts`
- **Lote:** L20b
- **Linhas:** 119
- **SHA1:** c469cd5222e73628100fa5f081b1d20f41adba5e
- **Partes lidas:** 1-119
- **Propósito:** Teste e2e das linhas de conceito da aba Style: o orçamento de até quatro telas com All properties, todas as seções abertas e as linhas fechadas, o disclosure de 24 px nomeado pela linha e aberto com Enter, o estado da linha mantido entre elementos, cada detalhe alcançável na janela e cada detalhe nomeado mais curto desenhado sob o nome curto.
- **Âncora:** `tests/e2e/inspector-concept-rows.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-empty-style.spec.ts`
- **Lote:** L20b
- **Linhas:** 12
- **SHA1:** dcb88b6357f67e93f5b78d0edd4ccb2d72e9ca6a
- **Partes lidas:** 1-12
- **Propósito:** Teste e2e de que a aba Style sem seleção mostra apenas a orientação: o rótulo "Nothing selected", as três dicas e nenhuma seção, campo ou barra de alvo e estado desenhados.
- **Âncora:** `tests/e2e/inspector-empty-style.spec.ts:4` `test('Style with no selection shows only the guidance', async ({ page }) => {`

### `tests/e2e/inspector-field-visuals.spec.ts`
- **Lote:** L20b
- **Linhas:** 70
- **SHA1:** 2caf31773ae12dda452cc151cbc49e24851eafec
- **Partes lidas:** 1-70
- **Propósito:** Teste e2e dos valores de repouso de um par de campos legíveis com as unidades completas na edição, o passo com seta escrevendo na página e o Reset ao fim da coluna do rótulo; e do contexto e da busca da aba Style fixos enquanto as seções rolam.
- **Âncora:** `tests/e2e/inspector-field-visuals.spec.ts:10` `const WIDTH = 'style.set#inspector-width';`

### `tests/e2e/inspector-fields.spec.ts`
- **Lote:** L20b
- **Linhas:** 37
- **SHA1:** 2006098a3e7124e89fdd9ae07850f548b91b765f
- **Partes lidas:** 1-37
- **Propósito:** Teste e2e de que cada campo do inspetor na tela é um botão exatamente quando a porta do manifesto diz drawnAs button: lê o manifesto de comandos e confere os campos desenhados na aba Style.
- **Âncora:** `tests/e2e/inspector-fields.spec.ts:10` `const DRAWN = new Map<string, string>();`

### `tests/e2e/inspector-number-fields.spec.ts`
- **Lote:** L20b
- **Linhas:** 341
- **SHA1:** 5e0643fd6dee63ea477380fe8bc4b58da66f23d3
- **Partes lidas:** 1-341
- **Propósito:** Teste e2e dos campos numéricos além dos cenários: os multiplicadores das setas num surto (1, 10 com Shift, 0,1 com Alt, PageUp e PageDown por 10), os botões de passo mostrados só com o foco e o surto de prensas como um passo de undo cada, o scrub seguindo o ponteiro ao vivo com Shift e Alt, Escape durante o scrub, Escape e Tab no campo, as teclas que ficam no campo, o menu de unidades com a conversão recusada e o campo de uma feature não registrada ainda indisponível, com documento, seleção e histórico pela porta de teste.
- **Âncora:** `tests/e2e/inspector-number-fields.spec.ts:14` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-organisation.spec.ts`
- **Lote:** L20b
- **Linhas:** 278
- **SHA1:** 5f22e63771fcb0df43fa778b29743e55ebc05f65
- **Partes lidas:** 1-278
- **Propósito:** Teste e2e da organização da aba Style: as linhas de par do properties.json numa linha sob o rótulo do conceito, a ordem dos campos pelos grupos declarados sem título de grupo desenhado, a seção sem essencial e sem valor desenhada recolhida com resumo e reaberta por um valor escrito, o editor de trilhas da grade, o editor de gradiente desenhado só enquanto o valor tem gradiente, o modo Essentials desenhando o Border como linhas compostas, cada controle na sua seção e as trilhas herdadas de um breakpoint mostradas com a escrita no breakpoint editado.
- **Âncora:** `tests/e2e/inspector-organisation.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-panel.spec.ts`
- **Lote:** L20b
- **Linhas:** 671
- **SHA1:** 51903f257d341917b225fe307de93a4f28513245
- **Partes lidas:** 1-671
- **Propósito:** Teste e2e do painel do inspetor além dos cenários: as dicas sem seleção, Page properties conforme a tabela de features, o ícone, o nome e a tag da barra de seleção, as nove seções dos campos de estilo na ordem do properties.json, os resumos das seções recolhidas lidos da página, as teclas do cabeçalho de seção, as seções recolhidas mantidas para outro elemento e após um recarregamento, as abas Settings e Style, o campo de texto com as portas de Enter, Escape, Shift+Enter, Tab e um clique fora, Element actions › Hide e a aba do dock, com documento, seleção e histórico pela porta de teste.
- **Âncora:** `tests/e2e/inspector-panel.spec.ts:14` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-property-search.spec.ts`
- **Lote:** L20b
- **Linhas:** 69
- **SHA1:** fddba7bb25e2a146d191649f05ba2fe77007aeef
- **Partes lidas:** 1-69
- **Propósito:** Teste e2e da busca de propriedades além dos cenários: digitar um rótulo ou um nome CSS mantém só os campos que casam, uma seção sem campo que casa não é desenhada, "No property matches" quando nada casa e esvaziar o campo devolve todas as seções como estavam, uma recolhida ainda recolhida.
- **Âncora:** `tests/e2e/inspector-property-search.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-provenance-reset.spec.ts`
- **Lote:** L20b
- **Linhas:** 49
- **SHA1:** c77de9f53d8b98c90ba19f95907bec3b22bc8624
- **Partes lidas:** 1-49
- **Propósito:** Teste e2e do cabeçalho de uma seção contando os valores que o elemento tem nela, do nome acessível repetindo a contagem, de a contagem não ser desenhada e de um reset tirar um valor da contagem.
- **Âncora:** `tests/e2e/inspector-provenance-reset.spec.ts:8` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-selection.spec.ts`
- **Lote:** L20b
- **Linhas:** 65
- **SHA1:** 93aa76a70dc9aa1cb4cb1f5fbdba2c2237f8fa83
- **Partes lidas:** 1-65
- **Propósito:** Teste e2e de que a barra de seleção do inspetor diz o que a store tem: um elemento com nome e tag, vários contados com suas tags distintas e "Nothing selected" somente quando a seleção lida pela porta de teste está vazia.
- **Âncora:** `tests/e2e/inspector-selection.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/inspector-summaries.spec.ts`
- **Lote:** L20b
- **Linhas:** 41
- **SHA1:** a72b6f78c628ec96be2e003e7000bc7a6f71af15
- **Partes lidas:** 1-41
- **Propósito:** Teste e2e do que a aba Style diz de um valor com o canvas num zoom abaixo do tamanho natural: uma borda de 1px lê 1px e o resumo da linha da sombra escreve a sombra que o elemento tem, no CSS dela.
- **Âncora:** `tests/e2e/inspector-summaries.spec.ts:9` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/inspector-text-fits.spec.ts`
- **Lote:** L20b
- **Linhas:** 167
- **SHA1:** ee8639f8b7dfea6495ff9928ebde1279e0c96e5a
- **Partes lidas:** 1-167
- **Propósito:** Teste e2e de que nenhum texto do inspetor é cortado nos dois idiomas: para um elemento de cada tipo, em cada aba com todas as seções e linhas abertas, nada que o inspetor escreve é cortado pela caixa, nenhuma palavra de um rótulo quebra em duas linhas e um valor de várias partes pode terminar em reticências com o todo no tooltip, com um caso próprio para um campo de valores oferecidos e para a aba Interactions com um evento e um movimento.
- **Âncora:** `tests/e2e/inspector-text-fits.spec.ts:12` `const INSERT = 'element.insert#elements-tile';`

### `tests/e2e/instance-part-delete.spec.ts`
- **Lote:** L20b
- **Linhas:** 71
- **SHA1:** 717e35ff34581716097b11659298a13f5c045014
- **Partes lidas:** 1-71
- **Propósito:** Teste e2e de que Delete num elemento de uma instância o tira daquela instância, a definição do componente o mantém, a barra de status diz o que foi apagado e um undo devolve o elemento.
- **Âncora:** `tests/e2e/instance-part-delete.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/jornada03.spec.ts`
- **Lote:** L20b
- **Linhas:** 158
- **SHA1:** 988668f824c4da5166e680f29bd9d4f7c3359a17
- **Partes lidas:** 1-158
- **Propósito:** Teste e2e que reexecuta os achados do estudo jornada03 (J1, J5, J15, J20, J21, J22 e J28): uma variável escrita numa cor de borda chega a cada lado sem incidente, a lista longa de variáveis rola dentro da vista Styles deixando as Camadas onde estão, o menu de fontes é desenhado inteiro dentro da janela, a página duplicada abre logo depois da origem com o nome pronto para digitar, a linha de uma instância nomeia seu componente, uma imagem sem origem desenha um marcador 16:9 de até 640 px e o português diz a inserção sem concordar com o nome e um elemento no singular.
- **Âncora:** `tests/e2e/jornada03.spec.ts:10` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/keyboard-panel-navigation.spec.ts`
- **Lote:** L20b
- **Linhas:** 139
- **SHA1:** ae77f71ef7e233d3dffe4ffccd51584879c4907c
- **Partes lidas:** 1-139
- **Propósito:** Teste e2e da navegação por teclado entre as regiões do editor: F6 percorre as regiões e Shift+F6 volta, Escape dentro de um painel devolve o foco ao canvas mantendo a seleção e as teclas do canvas agindo de novo, o canvas é uma parada própria com foco visível, Ctrl+A fora do canvas seleciona os elementos da página sem selecionar o texto da interface e um controle alcançado dentro de um painel recém-aberto mantém o foco.
- **Âncora:** `tests/e2e/keyboard-panel-navigation.spec.ts:12` `const escapeInLayers = 'focus.canvas#key-escape-in-layers-tree';`

### `tests/e2e/keyframe-only-with-timeline.spec.ts`
- **Lote:** L20b
- **Linhas:** 25
- **SHA1:** 116d0d75697069092551d29fb957aecc78ab2b14
- **Partes lidas:** 1-25
- **Propósito:** Teste e2e de que o inspetor lê e escreve um quadro-chave somente enquanto a linha do tempo o mostra: com o painel fechado o elemento selecionado mostra os próprios valores e com a linha do tempo aberta mostra os do quadro-chave sob o playhead.
- **Âncora:** `tests/e2e/keyframe-only-with-timeline.spec.ts:8` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/layers-drag.spec.ts`
- **Lote:** L20b
- **Linhas:** 55
- **SHA1:** 3fda435f477671eb2382539d2b8d5c8f054a7291
- **Partes lidas:** 1-55
- **Propósito:** Teste e2e de que um arraste parado sobre uma linha dobrada com ArrowLeft a desdobra depois do dwell (layers.expandDwell) e o Escape deixa o documento como estava.
- **Âncora:** `tests/e2e/layers-drag.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/layers-row-colours.spec.ts`
- **Lote:** L20b
- **Linhas:** 78
- **SHA1:** 2c9fa5d39f4d7be3dcd4a2df95aea9dda46141f7
- **Partes lidas:** 1-78
- **Propósito:** Teste e2e da cor de rótulo de uma linha de Camadas: o ponto da linha abre a paleta de tokens, um swatch escreve a cor na lista da página, a linha e a seleção do canvas a vestem, ela sobrevive a um recarregamento e nunca chega à exportação.
- **Âncora:** `tests/e2e/layers-row-colours.spec.ts:11` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/layers-tree.spec.ts`
- **Lote:** L20b
- **Linhas:** 145
- **SHA1:** 1e8de72caa7c86fdc42bbae0a203c57dad16c0c8
- **Partes lidas:** 1-145
- **Propósito:** Teste e2e da árvore de Camadas: uma linha por nó em ordem de documento com recuo crescente por profundidade, o cabeçalho contando todos os nós com ramos dobrados, o caret dobrando sem selecionar, a janela desenhando só as linhas visíveis com a pilha estreitada, e a seleção feita no canvas marcando a linha e trazendo-a para a vista.
- **Âncora:** `tests/e2e/layers-tree.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/layout-composer-entry.spec.ts`
- **Lote:** L20b
- **Linhas:** 18
- **SHA1:** b9d8c768a6e5aa01a15abb7ee85560ceb482a7bb
- **Partes lidas:** 1-18
- **Propósito:** Teste e2e de que Escape deixa o modo Layout mesmo enquanto o botão da barra ainda tem o foco antes de o palco tomá-lo.
- **Âncora:** `tests/e2e/layout-composer-entry.spec.ts:6` `const PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-layout-composer';`

### `tests/e2e/layout-grid-overlay.spec.ts`
- **Lote:** L20b
- **Linhas:** 109
- **SHA1:** f560bb723f147ea1ce0bb9c3221c54629ae7959b
- **Partes lidas:** 1-109
- **Propósito:** Teste e2e da grade de colunas por breakpoint (12 no Desktop, 8 no Tablet e 4 no Phone com margem de 16 px), da grade cobrindo o frame até o fundo, do Ctrl+roda mantendo o ponto da página sob o ponteiro e das configurações de Guides & Grids como linhas de campo com o rótulo ao lado do campo.
- **Âncora:** `tests/e2e/layout-grid-overlay.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/link-picker-and-references.spec.ts`
- **Lote:** L20b
- **Linhas:** 238
- **SHA1:** 71f2f01c2ea2c0a7ff4f817c642eb5c1ef52d354
- **Partes lidas:** 1-238
- **Propósito:** Teste e2e do seletor de links e das referências entre elementos: o seletor escolhe uma página, um elemento da página ou um endereço, a referência é mantida pelo id do alvo e segue a renomeação, um apagar diz quantas referências leva e as remove no mesmo passo de undo, um arquivo com semântica quebrada é recusado com a razão, e uma página escolhida fecha o seletor antes do clique seguinte.
- **Âncora:** `tests/e2e/link-picker-and-references.spec.ts:12` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/lock-element.spec.ts`
- **Lote:** L20b
- **Linhas:** 360
- **SHA1:** 8242a627bbff71b49c5ef99cccf9b8aef830a1bf
- **Partes lidas:** 1-360
- **Propósito:** Teste e2e do bloqueio de elemento: a fechadura da linha de Camadas bloqueia e desbloqueia o elemento da própria linha com um passo de undo cada mantendo a seleção, a linha mantém a fechadura desenhada e pressionada, o sinal fica no documento JSON e sobrevive a um recarregamento, cada comando construído que mudaria o elemento o recusa nomeando a fechadura, Ctrl+A deixa de fora um irmão bloqueado e conta, e a raiz da página não pode ser bloqueada.
- **Âncora:** `tests/e2e/lock-element.spec.ts:17` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/locked-fields.spec.ts`
- **Lote:** L20b
- **Linhas:** 155
- **SHA1:** b51edc1c2e4b3cacd0b9e973325b884d0598c4ed
- **Partes lidas:** 1-155
- **Propósito:** Teste e2e dos campos de estilo de um elemento bloqueado: cada porta é desenhada desabilitada antes de qualquer digitação com o motivo da fechadura no title nomeando a fechadura, uma tentativa forçada não muda nada e, desbloqueado, a mesma porta volta a receber entrada e escreve.
- **Âncora:** `tests/e2e/locked-fields.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/marquee-select.spec.ts`
- **Lote:** L20b
- **Linhas:** 189
- **SHA1:** e6f6defa76db47a015dfe2808a746a5df18aa4b1
- **Partes lidas:** 1-189
- **Propósito:** Teste e2e do laço de seleção: a faixa desenhada do ponto de pressão até o ponteiro com a seleção seguindo ao vivo, os filhos diretos do contêiner onde a pressão começou, um laço que não toca nada substituindo a seleção por nada, Shift somando ao que já estava selecionado, Alt afundando até as folhas, Ctrl alternando e uma pressão sobre folha nunca virando laço.
- **Âncora:** `tests/e2e/marquee-select.spec.ts:13` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/media-parts.spec.ts`
- **Lote:** L20b
- **Linhas:** 138
- **SHA1:** 366655bfd1bffe84daae5800990d41c75b3a97de
- **Partes lidas:** 1-138
- **Propósito:** Teste e2e das regras de mídia e embeds: uma parte sem endereço nunca é exportada enquanto o canvas continua desenhando, Autoplay liga Muted no mesmo passo de undo, uma imagem com texto alternativo vazio é decorativa e exporta alt="", um `<svg>` inteiro colado é desembrulhado, um SVG que desenha marcação não toma formas e um Embed avisa que o código roda na página publicada.
- **Âncora:** `tests/e2e/media-parts.spec.ts:12` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/menus-fit-window.spec.ts`
- **Lote:** L20b
- **Linhas:** 60
- **SHA1:** 7aacfc6d26b35639791a14df03bc8a1c0228db4b
- **Partes lidas:** 1-60
- **Propósito:** Teste e2e de que numa janela de 1280 × 720 o menu View cabe na janela e rola com os itens na altura original, seu último item e um submenu ficam ao alcance dentro da janela e o submenu abre depois da barra de rolagem do menu sem que nada dele seja cortado.
- **Âncora:** `tests/e2e/menus-fit-window.spec.ts:10` `const RESET = 'workspace.reset#menu-view';`

### `tests/e2e/menus.spec.ts`
- **Lote:** L20b
- **Linhas:** 137
- **SHA1:** 0088739b221703ff5837162700b917672050dfe9
- **Partes lidas:** 1-137
- **Propósito:** Teste e2e dos menus sem teclas nem ponteiros próprios: as teclas de um menu aberto são as portas do contexto "menu" (próximo, anterior, primeiro, último e ativar) mais Escape, uma pressão fora atinge o alvo e fecha o menu, uma pressão no fundo do menu o mantém aberto, um clique troca direto entre menus vizinhos e um submenu aparece com o ponteiro sobre o item e some quando ele sai.
- **Âncora:** `tests/e2e/menus.spec.ts:8` `import { openMenu, runs } from './door.ts';`

### `tests/e2e/motion-card-fits.spec.ts`
- **Lote:** L20b
- **Linhas:** 42
- **SHA1:** 10921111d46eb01c6817981476b0956980d59473
- **Partes lidas:** 1-42
- **Propósito:** Teste e2e de que o campo Reduced motion de um cartão de movimento lê inteiro nos dois idiomas e permanece inteiro quando o inspetor é medido de novo com o dock Motion aberto.
- **Âncora:** `tests/e2e/motion-card-fits.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/motion-dock-fits.spec.ts`
- **Lote:** L20b
- **Linhas:** 60
- **SHA1:** 0bf2ded2fc787927672f869099e707e3f2e30431
- **Partes lidas:** 1-60
- **Propósito:** Teste e2e de que o dock Motion guarda seus botões dentro da coluna e seus valores inteiros ou com reticências e tooltip, todos numa única face de código.
- **Âncora:** `tests/e2e/motion-dock-fits.spec.ts:12` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/motion-dock-labels-fit.spec.ts`
- **Lote:** L20b
- **Linhas:** 44
- **SHA1:** 4d491056a442b479bb0697e34ff1d3d3d3116e8b
- **Partes lidas:** 1-44
- **Propósito:** Teste e2e de que cada nome de campo do dock Motion toma uma linha nos dois idiomas (DEC-68).
- **Âncora:** `tests/e2e/motion-dock-labels-fit.spec.ts:8` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/motion-dock-row-fits.spec.ts`
- **Lote:** L20b
- **Linhas:** 34
- **SHA1:** 301438899ce980130e57ef04da7eb806ed0dc15c
- **Partes lidas:** 1-34
- **Propósito:** Teste e2e de que a linha de ação do dock Motion fica dentro do dock, cada campo com sua borda direita dentro dele, em 1280 × 720 e 1440 × 900.
- **Âncora:** `tests/e2e/motion-dock-row-fits.spec.ts:6` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/move-up-down.spec.ts`
- **Lote:** L20b
- **Linhas:** 142
- **SHA1:** fd3ea9163e2a74946a92ac43c9ab2dd9aa87494b
- **Partes lidas:** 1-142
- **Propósito:** Teste e2e de Move up e Move down: desabilitados com motivo enquanto nada está selecionado, movendo como as teclas com um passo de undo cada, várias raízes de um mesmo pai movendo juntas com a contagem na barra de status e raízes de pais diferentes recusadas sem mudar nada.
- **Âncora:** `tests/e2e/move-up-down.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/multi-select-click.spec.ts`
- **Lote:** L20b
- **Linhas:** 200
- **SHA1:** be2f0ecee8588d1accd652772f4c4d70a84920bc
- **Partes lidas:** 1-200
- **Propósito:** Teste e2e do que o canvas desenha com vários elementos selecionados: o contorno de cada um, o contorno tracejado da união e um rótulo contando-os que cobre nenhum texto, a volta a um elemento nomeando-o, e um Shift+clique na área vazia da página não acrescentando a raiz.
- **Âncora:** `tests/e2e/multi-select-click.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/multi-select-edit.spec.ts`
- **Lote:** L20b
- **Linhas:** 62
- **SHA1:** 75089534d5c517282cc24797f20d7f54cde31dd4
- **Partes lidas:** 1-62
- **Propósito:** Teste e2e de que com vários elementos selecionados um campo cujos valores diferem mostra Mixed sem valor, um campo com valores iguais mostra o valor, um valor escrito a todos passa a ser mostrado, e um campo sem valor próprio traz a medida que a página computa como placeholder.
- **Âncora:** `tests/e2e/multi-select-edit.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/multi-select-mixed.spec.ts`
- **Lote:** L20b
- **Linhas:** 170
- **SHA1:** b5838f3fb58ae1ce130e99e0ba747ce0209d79d1
- **Partes lidas:** 1-170
- **Propósito:** Teste e2e de valores Mixed ditos da mesma forma em todo lugar: os botões de alinhamento dizem Mixed sem nenhum pressionado, Reset os tira dos dois num passo de undo, cada link de caixa nomeia sua caixa, um lado que só um título tem diz Mixed, dois títulos não desenham nenhum campo de flex, grid ou item, e o link de caixa pertence ao elemento.
- **Âncora:** `tests/e2e/multi-select-mixed.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/multi-tab-guard.spec.ts`
- **Lote:** L20b
- **Linhas:** 89
- **SHA1:** ddf0d4cccf5229afed5aae7a9f2a19ac85035fbc
- **Partes lidas:** 1-89
- **Propósito:** Teste e2e da trava de duas abas: a segunda aba lê o projeto, diz que o projeto está sendo editado em outra aba, recusa um comando de documento com a barra de status dizendo a razão e nada escreve; ao assumir, a primeira aba vira somente leitura e recusa; e uma aba recarregada continua sendo a de edição sem aviso de outra aba.
- **Âncora:** `tests/e2e/multi-tab-guard.spec.ts:8` `const INSERT_VIEW = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/narrow-window.spec.ts`
- **Lote:** L20b
- **Linhas:** 78
- **SHA1:** d05563cf240e06cfb4064ac2839eb22f39dcc465
- **Partes lidas:** 1-78
- **Propósito:** Teste e2e da janela estreita: em 1024 px a janela não rola lateralmente e a aba Phone fica alcançável; em 1280 × 720 o canvas tem ao menos metade da janela e a barra do canvas cabe inteira; a barra lateral abre ao lado do canvas, nunca sobre ele, uma pressão no canvas a deixa aberta e Escape na paleta leva o foco ao canvas.
- **Âncora:** `tests/e2e/narrow-window.spec.ts:8` `const PHONE = 'view.setBreakpoint#toolbar-breakpoint-tabs-phone';`

### `tests/e2e/native-choices-accent.spec.ts`
- **Lote:** L20b
- **Linhas:** 27
- **SHA1:** c111d843b76a4d380134de82f815b2e4918bafac
- **Partes lidas:** 1-27
- **Propósito:** Teste e2e de que as caixas de seleção das configurações de Snap vestem o acento da interface, conferido contra a cor de --color-accent.
- **Âncora:** `tests/e2e/native-choices-accent.spec.ts:8` `const SNAP = 'workspace.openDialog#menu-snap-snap-settings';`

### `tests/e2e/nest-promote.spec.ts`
- **Lote:** L20b
- **Linhas:** 74
- **SHA1:** da2aa075c390921129f2469e7f2ec27c6929b285
- **Partes lidas:** 1-74
- **Propósito:** Teste e2e de Arrange › Move out of parent e Arrange › Make child of previous layer pelas portas do menu: mover para fora põe o título depois do cartão e aninhar o devolve, com as posições na barra de status, e o item fica desabilitado com o motivo quando o elemento anterior não pode contê-lo.
- **Âncora:** `tests/e2e/nest-promote.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/number-fields-one-rule.spec.ts`
- **Lote:** L20b
- **Linhas:** 90
- **SHA1:** 36344df330b566305d26ba013be84e4adb0583e9
- **Partes lidas:** 1-90
- **Propósito:** Teste e2e da regra única dos campos numéricos: quatro setas seguidas num campo são um passo de undo, uma unidade relativa à fonte anda um décimo, um número puro toma a unidade própria do campo (px, o % de um filtro, os graus de uma transformação) e a seta sobre calc() diz que não há número para andar sem escrever.
- **Âncora:** `tests/e2e/number-fields-one-rule.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/open-project.spec.ts`
- **Lote:** L20b
- **Linhas:** 97
- **SHA1:** 9a88d11e16e9f2fa08c86edaa64bc531a63ee8b2
- **Partes lidas:** 1-97
- **Propósito:** Teste e2e do File › Open: o documento escolhido é renderizado no canvas com seus textos e estilos, o iframe não toma eventos de ponteiro (o overlay sobre ele os recebe), cada caret de uma linha de Camadas é desenhado sozinho e nomeado pelo rótulo, e um arquivo que não é projeto ou de formato mais novo é recusado com a razão mantendo o canvas.
- **Âncora:** `tests/e2e/open-project.spec.ts:17` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/overlay-lifecycle.spec.ts`
- **Lote:** L20b
- **Linhas:** 130
- **SHA1:** edcf82d753aebebb47972a021371228aafcac5f7
- **Partes lidas:** 1-130
- **Propósito:** Teste e2e do ciclo de vida das camadas do editor: cada gatilho com aria-haspopup da barra superior e do painel Style abre uma camada que fecha com a segunda pressão no gatilho, uma pressão fora e Escape, sem deixar backdrop, e o menu de contexto fecha com uma pressão fora e com Escape sem deixar backdrop.
- **Âncora:** `tests/e2e/overlay-lifecycle.spec.ts:10` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/overlay-scrollbar-width.spec.ts`
- **Lote:** L20b
- **Linhas:** 38
- **SHA1:** a04e6378120eaa5ff986c86eacc91f2c1eec5851
- **Partes lidas:** 1-38
- **Propósito:** Teste e2e de que a página mantém a largura inteira de um telefone e de um tablet (390 e 834 px) enquanto a de desktop mantém a largura livre do espaço da barra de rolagem (1440 menos a barra), num navegador que desenha barra de rolagem.
- **Âncora:** `tests/e2e/overlay-scrollbar-width.spec.ts:12` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/page-properties.spec.ts`
- **Lote:** L20b
- **Linhas:** 322
- **SHA1:** 6a41737a51017fccba074c4d20b08697350a7cf8
- **Partes lidas:** 1-322
- **Propósito:** Teste e2e das Page properties: seleciona a raiz da página de qualquer seleção e mostra os campos na ordem do elements.json com os de features futuras indisponíveis; um valor guardado com Enter é escrito na raiz sem renomeá-la e undo devolve valor e seleção; esvaziar um campo o remove da raiz e do `<html>` do canvas também após um recarregamento; sair de um campo com Tab ou um clique mantém o digitado e o `<html>` do canvas toma direção e idioma; os campos de metadados escrevem o head da exportação; e um valor recusado deixa o documento como estava com o campo mostrando o valor do documento outra vez.
- **Âncora:** `tests/e2e/page-properties.spec.ts:19` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/palette-drag-insert.spec.ts`
- **Lote:** L20b
- **Linhas:** 298
- **SHA1:** c4ae01a8ab5b47af5d637b0792a524a175fdf422
- **Partes lidas:** 1-298
- **Propósito:** Teste e2e do arraste de uma peça da paleta: uma pressão curta é o clique da peça, que insere na seleção, e um arraste além do limiar é uma criação que insere só onde é solto, nada fora da página ou de volta na peça; durante o arraste o chrome desenha a linha e o rótulo da inserção, o fantasma segue o ponteiro e, onde o comando recusa, o indicador é desenhado recusado com a recusa e sem linha.
- **Âncora:** `tests/e2e/palette-drag-insert.spec.ts:17` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/palette-tiles.spec.ts`
- **Lote:** L20b
- **Linhas:** 82
- **SHA1:** 7d0e5fbaeb6635b08738216b3c4a7f26f97bec71
- **Partes lidas:** 1-82
- **Propósito:** Teste e2e das peças da paleta de Inserir: cada peça é utilizável exatamente quando a feature da sua entrada está registrada como construída, e as peças de palette-click-insert inserem com clique, Enter e Espaço.
- **Âncora:** `tests/e2e/palette-tiles.spec.ts:12` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/palette-view.spec.ts`
- **Lote:** L20b
- **Linhas:** 82
- **SHA1:** 5e87afb2b12daa432e27d18bcca67b3cd908fe2c
- **Partes lidas:** 1-82
- **Propósito:** Teste e2e da vista do painel Inserir: cada densidade dispõe os grupos no seu número de colunas (List uma, Two columns duas, Three columns três, Icon grid mais com rótulos escondidos), Two columns devolve o arranjo padrão, um grupo recolhido não desenha nenhuma peça e as duas escolhas ficam guardadas após um recarregamento.
- **Âncora:** `tests/e2e/palette-view.spec.ts:9` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/panels-windows.spec.ts`
- **Lote:** L20b
- **Linhas:** 143
- **SHA1:** b4669e686773605376b952d12ef477cac40274aa
- **Partes lidas:** 1-143
- **Propósito:** Teste e2e dos painéis que saem do lugar: arrastar o cabeçalho de um painel sobre o canvas flutua uma janela no ponto do solto mantida dentro da janela, as dicas de borda ancoram à esquerda ou à direita, sobre a parte de cima de outro painel combinam em abas e sobre a de baixo empilham, Escape solta o arraste sem palavra, o arranjo sobrevive a um recarregamento e Reset workspace devolve os padrões dizendo o que fez sem tocar o documento.
- **Âncora:** `tests/e2e/panels-windows.spec.ts:11` `const CANVAS = 'workspace.movePanel#panel-drag-panel-header-canvas';`

### `tests/e2e/panels.spec.ts`
- **Lote:** L20b
- **Linhas:** 103
- **SHA1:** 76f2308f158e9f60f9af24b72d10157523057619
- **Partes lidas:** 1-103
- **Propósito:** Teste e2e das portas de painel: nenhuma porta abre um painel sem conteúdo e as portas dos painéis existentes ficam habilitadas exatamente enquanto sua feature está registrada, conferido contra a tabela de features e um instantâneo das regiões, colunas, preferências e documento.
- **Âncora:** `tests/e2e/panels.spec.ts:16` `const EMPTY: readonly string[] = [];`

### `tests/e2e/pointer.spec.ts`
- **Lote:** L20b
- **Linhas:** 33
- **SHA1:** 7b5c4846a6c8ea9acb5d023a8f9613cd4b7e920b
- **Partes lidas:** 1-33
- **Propósito:** Teste e2e do dono do ponteiro: enquanto uma pressão no canvas está aberta as teclas pertencem ao gesto (a porta global não roda) e após o solto as teclas são de novo do editor.
- **Âncora:** `tests/e2e/pointer.spec.ts:4` `import { expect, test } from '../support/test.ts';`

### `tests/e2e/portas-equivalentes.spec.ts`
- **Lote:** L20b
- **Linhas:** 114
- **SHA1:** 94130461c49e6a1053126b4b4f1a5c325466f9d1
- **Partes lidas:** 1-114
- **Propósito:** Teste e2e da regra G3: o passo de um campo numérico desenhado por três portas (o botão de passo, a seta no campo e a roda sobre o campo focado) anda o mesmo valor a partir do mesmo estado de campo (vazio, um comprimento que o elemento tem, uma palavra-chave), cada porta num editor próprio aberto do mesmo jeito.
- **Âncora:** `tests/e2e/portas-equivalentes.spec.ts:10` `import { NODE_PATH, type TestBootCommand } from '../../src/editor/test-boot.ts';`

### `tests/e2e/preview-mode.spec.ts`
- **Lote:** L20b
- **Linhas:** 118
- **SHA1:** a8bc96005ea135748d1306c60400f0e4d093d830
- **Partes lidas:** 1-118
- **Propósito:** Teste e2e do modo de pré-visualização: a página exportada roda como o navegador a roda, com um valor de hover aplicando sob o ponteiro, as ligações abrindo em nova aba, nenhum chrome do editor sobre ela e o documento inalterado; Escape sai da pré-visualização mesmo após um clique dentro dela; e só a janela do frame da pré-visualização é ouvida no relé de teclas.
- **Âncora:** `tests/e2e/preview-mode.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/project-save.spec.ts`
- **Lote:** L20b
- **Linhas:** 68
- **SHA1:** 6899de4b90f0694f0ef2cc4bea409339cbfcfcaf
- **Partes lidas:** 1-68
- **Propósito:** Teste e2e do salvar projeto em JSON: o mesmo documento salvo duas vezes dá arquivos idênticos a menos do horário gravado (que segue o momento do salvar em passos de dois segundos) e o project.json do arquivo é exatamente o documento que a porta de teste lê.
- **Âncora:** `tests/e2e/project-save.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/props-element-specific.spec.ts`
- **Lote:** L20b
- **Linhas:** 86
- **SHA1:** 2f96f72bdf16db0475c48e93ba6e3bac18b60ce8
- **Partes lidas:** 1-86
- **Propósito:** Teste e2e das propriedades de um tipo de elemento: uma lista desenha seus campos de marcador e nenhum de tabela, mídia ou formulário e uma seção nenhum deles, a lista e a seção juntas não desenham o campo da lista, e Add a property oferece uma propriedade de lista para uma lista e não para uma seção, desenhando o campo ao escolher e escrevendo nele.
- **Âncora:** `tests/e2e/props-element-specific.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/props-flex-container.spec.ts`
- **Lote:** L20b
- **Linhas:** 103
- **SHA1:** fb1efe9210fb7d0a6f2f0f6f086088d17d89b28a
- **Partes lidas:** 1-103
- **Propósito:** Teste e2e do contêiner flex: o gap é a distância que a página mede entre filhos vizinhos, a matriz de alinhamento age só num contêiner flex ou grid (num elemento em bloco não é desenhada, então nenhuma pressão escreve), suas células são botões que o teclado alcança e pressiona com uma parada de Tab, e as setas movem entre os botões de direção.
- **Âncora:** `tests/e2e/props-flex-container.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/props-typography-advanced.spec.ts`
- **Lote:** L20b
- **Linhas:** 71
- **SHA1:** f5b45eedbebe98a7d61575d0a7b760d65299b6f1
- **Partes lidas:** 1-71
- **Propósito:** Teste e2e da tipografia avançada: o line clamp corta o texto nas linhas pedidas, com as declarações prefixadas chegando à página e o parágrafo com a altura das linhas pedidas, e o campo Line clamp de um elemento sem clamp não levanta exceção na página.
- **Âncora:** `tests/e2e/props-typography-advanced.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/quick-panel-chip-press.spec.ts`
- **Lote:** L20c
- **Linhas:** 49
- **SHA1:** abc15c1f98451ed47275f4945e7dc634fc8c846c
- **Partes lidas:** 1-49
- **Propósito:** Verifica que o chip do painel rápido e cada zona de rotação desenhada tomam a pressão no próprio meio ao lado do rótulo de um elemento estreito, ao longo da varredura de largura de 120 a 260 px, e que o chip abre o painel.
- **Âncora:** `tests/e2e/quick-panel-chip-press.spec.ts:10` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/quick-panel-tag-fits.spec.ts`
- **Lote:** L20c
- **Linhas:** 22
- **SHA1:** af6d689c0cf951d930298a4d859ee623ac40570d
- **Partes lidas:** 1-22
- **Propósito:** Verifica que o campo do tag no cabeçalho do painel rápido mostra inteiro o tag mais longo digitável, blockquote, e mais três entradas, sem corte nem rolagem horizontal.
- **Âncora:** `tests/e2e/quick-panel-tag-fits.spec.ts:8` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/quick-panel.spec.ts`
- **Lote:** L20c
- **Linhas:** 257
- **SHA1:** 1d88c13ea0e9333934b7595ce621d09a26412e83
- **Partes lidas:** 1-257
- **Propósito:** Cobre o painel rápido além dos cenários: o deslocamento do painel arrastado pela alça sobrevive ao recarregar, os campos seguem o tipo do elemento, o campo de preenchimento é nomeado Background image e grava o endereço digitado, excluir o elemento poda o deslocamento das preferências, a opacidade é lida em porcentagem como na aba Style e o campo cujo valor não cabe na metade ocupa a linha do grupo com o Reset visível só sob hover.
- **Âncora:** `tests/e2e/quick-panel.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/refusal-never-blanks.spec.ts`
- **Lote:** L20c
- **Linhas:** 52
- **SHA1:** 943c796cd0a3ac4ec6eb64b2a5d483b481c37b0b
- **Partes lidas:** 1-52
- **Propósito:** Percorre o caminho da AUD-01: com um estado Visited escolhido e a seleção trocada para um heading, o estado volta para Base com aviso na barra de status, o valor digitado vai para a camada base do Title e nenhuma região do editor é substituída por fallback.
- **Âncora:** `tests/e2e/refusal-never-blanks.spec.ts:10` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/rename-element.spec.ts`
- **Lote:** L20c
- **Linhas:** 224
- **SHA1:** 635bf4f32464e6ccf59af5bc19a7d5fdeb89c49c
- **Partes lidas:** 1-224
- **Propósito:** Cobre o renomear por F2, pelo clique duplo no nome da linha de Camadas, pelo Arrange › Rename e pelo menu de contexto: o campo abre com o nome inteiro selecionado e o foco, Enter ou a saída guarda no documento com um passo de undo, o foco volta ao canvas, o clique único só seleciona, a seção Camadas aparece quando escondida e elemento travado é recusado com o motivo do desbloqueio.
- **Âncora:** `tests/e2e/rename-element.spec.ts:14` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/render.spec.ts`
- **Lote:** L20c
- **Linhas:** 208
- **SHA1:** 79bdd11ab367da2602bc5511b07a66361b1787af
- **Partes lidas:** 1-208
- **Propósito:** Monta o renderizador da build servida dentro de um iframe próprio e verifica no Chrome que os patches de cada tipo de mudança aplicam estilos por breakpoint, geometria, texto e ordem preservando os mesmos objetos de elemento, e que o canvas do editor aplica um comando de movimento no lugar.
- **Âncora:** `tests/e2e/render.spec.ts:11` `import { openMenu, runs } from './door.ts';`

### `tests/e2e/resize-handles.spec.ts`
- **Lote:** L20c
- **Linhas:** 416
- **SHA1:** 83e5562a84a9120841696808c395ce5d026c9596
- **Partes lidas:** 1-416
- **Propósito:** Cobre as alças de redimensionar além dos cenários: a borda inteira redimensiona sem gravar padding, Shift mantém a proporção do canto, Alt redimensiona do centro, os valores saem em px inteiros, a alça escreve na classe-alvo no estado e breakpoint em vista, alças aparecem só com um elemento único com espaço, e o rótulo e o card vizinho nunca engolem a pressão de uma alça.
- **Âncora:** `tests/e2e/resize-handles.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/responsive-and-states.spec.ts`
- **Lote:** L20c
- **Linhas:** 156
- **SHA1:** 5ef62182e4ed6cc1d5fa4b62b121a415b5a06deb
- **Partes lidas:** 1-156
- **Propósito:** Verifica que a largura contínua atualiza o frame, o cartão do breakpoint e o preview sem criar histórico, que o breakpoint fica após recarregar, que os campos dizem onde o valor foi definido, que a página exportada muda de cor no hover e que o menu de estados oferece apenas os estados do tipo do elemento.
- **Âncora:** `tests/e2e/responsive-and-states.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/responsive-matrix.spec.ts`
- **Lote:** L20c
- **Linhas:** 293
- **SHA1:** e0ee23672c54e2035d686e40b0ff6f3540e4f3f5
- **Partes lidas:** 1-293
- **Propósito:** Roda o editor sob uma matriz pareada de janelas, idiomas, temas e projetos e as superfícies de estado — mapeamento do painel Data, regiões compartilhadas, dock Motion, gradiente, grade, raio e campo de tamanho focado — sob quatro condições, checando cada tela pelo screen guard.
- **Âncora:** `tests/e2e/responsive-matrix.spec.ts:28` `const WINDOWS = { 1280: 720, 1366: 768, 1440: 900, 1920: 1080 } as const;`

### `tests/e2e/reusable-components.spec.ts`
- **Lote:** L20c
- **Linhas:** 103
- **SHA1:** 7218fb05a7aaf93bbe0946fce47692a81656935f
- **Partes lidas:** 1-103
- **Propósito:** Verifica no Chrome os itens do menu de contexto de componentes: Create a component só onde aplica, nunca na raiz da página nem dentro de uma instância, Detach from the component só na raiz da instância, clique fora fechando o prompt sem criar, e o prompt segurando o nome num campo largo nomeado pelo título com o fechar no topo.
- **Âncora:** `tests/e2e/reusable-components.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/rotation-handle.spec.ts`
- **Lote:** L20c
- **Linhas:** 184
- **SHA1:** 8453d6316c991d9e62f4fd9aa58f082ae9d9e245
- **Partes lidas:** 1-184
- **Propósito:** Cobre a alça de rotação além dos cenários: o rótulo e o chip do painel rápido não cobrem a zona de um elemento estreito, Shift encaixa o giro em passos de 15°, as quatro zonas giram o elemento com o ângulo vivo no rótulo e o contorno acompanhando, e com o elemento girado as zonas e as alças mantêm o lugar por trinta quadros.
- **Âncora:** `tests/e2e/rotation-handle.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/rows-never-select-text.spec.ts`
- **Lote:** L20c
- **Linhas:** 23
- **SHA1:** 86038d9f81160e4528e6a4850896dddd652bfa60
- **Partes lidas:** 1-23
- **Propósito:** Verifica que Shift+clique numa linha de Camadas seleciona linhas sem deixar nenhum texto da interface selecionado no navegador.
- **Âncora:** `tests/e2e/rows-never-select-text.spec.ts:8` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/scenarios.spec.ts`
- **Lote:** L20c
- **Linhas:** 4
- **SHA1:** a86360bd6acca0733390265586ff5f6efdc33b38
- **Partes lidas:** 1-4
- **Propósito:** Registra um teste por cenário e por porta do manifesto, chamando o registrador do runner de cenários.
- **Âncora:** `tests/e2e/scenarios.spec.ts:4` `registerScenarioTests();`

### `tests/e2e/screen-guard.spec.ts`
- **Lote:** L20c
- **Linhas:** 194
- **SHA1:** 33e2734cf1cb2c0f9b60d34e152aafcdaf45e2b0
- **Partes lidas:** 1-194
- **Propósito:** Prova o screen guard contra páginas plantadas: encontra cada defeito nomeado e nada nos gêmeos desenhados certo, lê inglês na interface pt-BR, trata diálogo modal e escudo sobre a janela como cobertura proposital e ignora texto invisível ou destinado a leitores de tela.
- **Âncora:** `tests/e2e/screen-guard.spec.ts:4` `import { expect, test } from '../support/test.ts';`

### `tests/e2e/screen-height.spec.ts`
- **Lote:** L20c
- **Linhas:** 115
- **SHA1:** 8f95e15ed44d67bf32f951f7e7dc8b1368ddeaf9
- **Partes lidas:** 1-115
- **Propósito:** Verifica as linhas de dobra desenhadas a cada tela inteira com o nome e a distância, o preset Screen height do campo Height gravando 100vh e o canvas dispondo a página na largura que uma janela real de 1440 px dá, em Fit e a 25 %.
- **Âncora:** `tests/e2e/screen-height.spec.ts:12` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/select-click.spec.ts`
- **Lote:** L20c
- **Linhas:** 151
- **SHA1:** 5def7f684eabab99ad4b053c9dda7b3eb7d734ed
- **Partes lidas:** 1-151
- **Propósito:** Verifica o que o canvas desenha para a seleção e o hover: contorno sobre a caixa do elemento com nome e tag no rótulo acima, hover num traço mais fino sem selecionar nada, Escape removendo tudo, clique em área vazia selecionando a raiz da página e as portas de linha de Camadas e Edit › Clear selection.
- **Âncora:** `tests/e2e/select-click.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/select-container-children.spec.ts`
- **Lote:** L20c
- **Linhas:** 60
- **SHA1:** 68dd3622faa7b9212e3821049ffc5fe0718c42fd
- **Partes lidas:** 1-60
- **Propósito:** Verifica que Edit › Select all e o Ctrl+A do canvas selecionam o elemento e os irmãos, e que um irmão escondido fica de fora com a contagem dita na barra de status.
- **Âncora:** `tests/e2e/select-container-children.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/selection-label-contrast.spec.ts`
- **Lote:** L20c
- **Linhas:** 53
- **SHA1:** 8d8f3f86c7d5f630b957c3b748d2da08168dc0a4
- **Partes lidas:** 1-53
- **Propósito:** Mede que o alvo de classe e o breakpoint escritos no rótulo de seleção mantêm contraste de ao menos 4.5:1 com o fundo do rótulo nos temas escuro e claro.
- **Âncora:** `tests/e2e/selection-label-contrast.spec.ts:9` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/selection-label-touches.spec.ts`
- **Lote:** L20c
- **Linhas:** 211
- **SHA1:** bfdbf5ecbf348acf8654b31ba6e3aede3bb1dfef
- **Partes lidas:** 1-211
- **Propósito:** Prova que o rótulo fica sempre acima do elemento encostado na moldura e o painel rápido à direita do rótulo — em vários tipos de elemento, zooms de 25 a 400 %, girado, rolado, vários selecionados e todos os breakpoints — e que no topo da página o rótulo e o chip desviam das abas de breakpoint.
- **Âncora:** `tests/e2e/selection-label-touches.spec.ts:34` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/selection-reveal.spec.ts`
- **Lote:** L20c
- **Linhas:** 107
- **SHA1:** 24c7170147ea4d685787936e2975c1354f698226
- **Partes lidas:** 1-107
- **Propósito:** Verifica que seleção feita fora do canvas — andando com as setas, pelo achado da barra de comando ou inserindo um elemento abaixo do palco — traz o elemento à vista, enquanto a linha de Camadas deixa o canvas onde está.
- **Âncora:** `tests/e2e/selection-reveal.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/semantic-tag-switch.spec.ts`
- **Lote:** L20c
- **Linhas:** 265
- **SHA1:** cfff2fbd77434e73af47f4220c0a7e588588af64
- **Partes lidas:** 1-265
- **Propósito:** Cobre o campo HTML tag: mostra o tag do elemento e sugere os equivalentes, a troca guardada com Enter muda apenas o tag em um passo de undo com undo e redo devolvendo cada tag e a seleção, sair do campo mantém o digitado, tag recusado ou campo esvaziado não mudam o documento, o tag sobrevive ao recarregar e a troca derruba atributos que o novo tag não aceita.
- **Âncora:** `tests/e2e/semantic-tag-switch.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/settings-class-management.spec.ts`
- **Lote:** L20c
- **Linhas:** 73
- **SHA1:** 1d066f20e3eb1de80486bb1df3a234b3b402e468
- **Partes lidas:** 1-73
- **Propósito:** Verifica que uma classe digitada nas Settings entra no registro do projeto, vira alvo de estilo e mantém a largura do inspector, e que um atributo personalizado reservado é recusado no próprio campo com o rascunho guardado junto da seleção original.
- **Âncora:** `tests/e2e/settings-class-management.spec.ts:5` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/settings-form-field.spec.ts`
- **Lote:** L20c
- **Linhas:** 86
- **SHA1:** 4ea12efaaecd28dd1cd3ac8d31196c2e84d05c2e
- **Partes lidas:** 1-86
- **Propósito:** Verifica que as Settings de um campo de formulário desenham cada controle inteiro na própria linha — as opções do select com os botões ao lado dos nomes e os botões de adicionar inteiros — e que a seção Form mantém as colunas do tab e os campos separados.
- **Âncora:** `tests/e2e/settings-form-field.spec.ts:9` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/settings-head.spec.ts`
- **Lote:** L20c
- **Linhas:** 26
- **SHA1:** 57a7b1fe03717c6f6e8065de3bb31bf315181827
- **Partes lidas:** 1-26
- **Propósito:** Verifica que a aba Settings encabeça os campos com o ícone, o nome e o tag do elemento selecionado, e que sem seleção o cabeçalho não é desenhado.
- **Âncora:** `tests/e2e/settings-head.spec.ts:8` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/settings-organized.spec.ts`
- **Lote:** L20c
- **Linhas:** 39
- **SHA1:** 46fbaa413bf05f4e4ccb9ec9a73e5a874ffc3af1
- **Partes lidas:** 1-39
- **Propósito:** Verifica que as Settings agrupam os campos conforme o tipo do elemento — General, Link, Accessibility e Attributes com seus subtítulos — e que o tipo do botão mostra o padrão não guardado antes de uma edição real do atributo.
- **Âncora:** `tests/e2e/settings-organized.spec.ts:5` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/settings-validation.spec.ts`
- **Lote:** L20c
- **Linhas:** 225
- **SHA1:** 4eae5b3d8a68014ddb13942280f08e948bd4ce41
- **Partes lidas:** 1-225
- **Propósito:** Cobre a validação das Settings: tipo de entrada, máx, mín, valor, passo, padrão, autocomplete, nome e idioma recusam valores inválidos ao lado da própria porta sem tocar o documento, trocar o tipo avisa antes de descartar atributos num passo de undo, e valores válidos de mídia sobrevivem à exportação em ZIP e são lidos pelo arquivo exportado.
- **Âncora:** `tests/e2e/settings-validation.spec.ts:9` `const INSERT = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/shared-style-classes.spec.ts`
- **Lote:** L20c
- **Linhas:** 97
- **SHA1:** 925863286ae78a8e2ff18883080d08d3f33c81f7
- **Partes lidas:** 1-97
- **Propósito:** Verifica no Chrome o alcance da classe-alvo no inspetor, o valor vindo de classe nomeado no campo do elemento até ele ter valor próprio, a contagem de elementos na vista Styles e a volta ao alvo Element numa nova seleção, e que após recarregar o valor do elemento continua sobrepondo a classe no canvas.
- **Âncora:** `tests/e2e/shared-style-classes.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/shell.spec.ts`
- **Lote:** L20c
- **Linhas:** 96
- **SHA1:** b11520926f3589976231a3fbcd15088d8cb14dfd
- **Partes lidas:** 1-96
- **Propósito:** Roda os comandos da fundação pelo mouse e teclado com artefato final: Ctrl+B e Ctrl+Alt+B devolvendo as colunas da barra lateral e do inspector ao canvas, Ctrl+\ recolhendo as docas e restaurando o que estava aberto, View › Workbench abrindo o dock sob o canvas, tema claro e escuro sobrevivendo ao recarregar e o menu de idioma trocando para pt-BR com persistência.
- **Âncora:** `tests/e2e/shell.spec.ts:4` `import { expect, test, type Page } from '../support/test.ts';`

### `tests/e2e/shortcuts-panel.spec.ts`
- **Lote:** L20c
- **Linhas:** 73
- **SHA1:** be9124c0aea89d5f5d93e8b95e399eb705b6721a
- **Partes lidas:** 1-73
- **Propósito:** Verifica que Help › Keyboard shortcuts abre o painel como aba do dock listando exatamente os atalhos do keymap agrupados pelos contextos do manifesto, com as teclas no formato das caps e o rótulo traduzido, marcando os comandos de recursos não construídos.
- **Âncora:** `tests/e2e/shortcuts-panel.spec.ts:14` `const HELP = 'workspace.setPanelOpen#menu-help-shortcuts';`

### `tests/e2e/shown-values.spec.ts`
- **Lote:** L20c
- **Linhas:** 97
- **SHA1:** 4a13c774bb839f040fc69923bc8210ceb59a6857
- **Partes lidas:** 1-97
- **Propósito:** Verifica o que um campo de estilo mostra: o valor do documento como escrito na aba Style e no painel rápido, campo vazio com placeholder do valor efetivo quando não há valor, nada mudando com o zoom do canvas, a borda escrita guardada em longhands, e o resumo recolhido da seção estável entre zooms.
- **Âncora:** `tests/e2e/shown-values.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/sidebar-view-titles.spec.ts`
- **Lote:** L20c
- **Linhas:** 35
- **SHA1:** 3cef6954d35294183a4a94171a480e9f38f554a4
- **Partes lidas:** 1-35
- **Propósito:** Verifica que toda vista da barra lateral desenha o título na mesma posição horizontal, com o botão de fechar do cabeçalho do painel, incluindo a vista Layout.
- **Âncora:** `tests/e2e/sidebar-view-titles.spec.ts:8` `const VIEWS = ['explorer', 'insert', 'styles', 'data', 'assistant'] as const;`

### `tests/e2e/smart-guides.spec.ts`
- **Lote:** L20c
- **Linhas:** 180
- **SHA1:** 626c04d83cf509f13c6765f389213a3747877dd4
- **Partes lidas:** 1-180
- **Propósito:** Lê as guias inteligentes com o arrasto ainda em curso: caixa puxada a vãos iguais mostra os dois vãos com seu valor, com o snap desligado o alinhamento com a borda de um irmão é desenhado sem mover a caixa, com as guias desligadas o encaixe do snap acontece sem linha, a linha grossa mostra a distância até o elemento e a borda de coluna da grade é alvo com linha desenhada.
- **Âncora:** `tests/e2e/smart-guides.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/smoke.spec.ts`
- **Lote:** L20c
- **Linhas:** 9
- **SHA1:** 611064ce9ce3fd8dc11bad17abe66dab2bd56974
- **Partes lidas:** 1-9
- **Propósito:** Verifica que o app abre no Chrome com o nome do produto como título da página e como cabeçalho de nível 1.
- **Âncora:** `tests/e2e/smoke.spec.ts:2` `import { PRODUCT_NAME } from '../../src/config/product.ts';`

### `tests/e2e/snap-toggle-settings.spec.ts`
- **Lote:** L20c
- **Linhas:** 86
- **SHA1:** 1759c748a2105e1d24c3bb88c917db266e23cb6b
- **Partes lidas:** 1-86
- **Propósito:** Lê o armazenamento depois de recarregar: o botão Snap alterna o encaixe num clique com persistência, Apply guarda os alvos e a distância deixando o snap desligado e o diálogo reaberto os mostra, e Cancel descarta o que foi marcado e digitado.
- **Âncora:** `tests/e2e/snap-toggle-settings.spec.ts:9` `const TOGGLE = 'snap.setEnabled#toolbar-canvas-toolbar-snap';`

### `tests/e2e/snap-while-moving.spec.ts`
- **Lote:** L20c
- **Linhas:** 67
- **SHA1:** f7eeecec1a4ccf4b94390ef49b46fe5b7f65ac97
- **Partes lidas:** 1-67
- **Propósito:** Verifica com o arrasto ainda em curso que o encaixe desenha a linha do elemento até a borda alvo na posição do alvo e contorna o elemento alvo, e que soltar tira os dois.
- **Âncora:** `tests/e2e/snap-while-moving.spec.ts:14` `const SNAP = 'snap.setEnabled#toolbar-canvas-toolbar-snap';`

### `tests/e2e/space-focus-pan.spec.ts`
- **Lote:** L20c
- **Linhas:** 76
- **SHA1:** b54c48d127e902ebbd9c79dc7f4a7360d3cf2d36
- **Partes lidas:** 1-76
- **Propósito:** Verifica que o tile alcançado por Tab insere o elemento com Space mesmo com o ponteiro sobre o canvas, e que o tile focado por um clique deixa Space para o pan, movendo a página sem inserir nada.
- **Âncora:** `tests/e2e/space-focus-pan.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/spacing-handles.spec.ts`
- **Lote:** L20c
- **Linhas:** 154
- **SHA1:** 3e6cda22728e7ca195d772b5bf48db5741d57331
- **Partes lidas:** 1-154
- **Propósito:** Lê no Chrome as bandas de espaçamento: as quatro de padding e as de margem com valores, o modo prendendo as bandas e o Escape soltando só o modo, o item de gap desabilitado com motivo em contêiner que não é flex nem grid, o modo largando uma seleção que não edita, e a banda em arrasto mantendo o valor vivo fora do ponteiro.
- **Âncora:** `tests/e2e/spacing-handles.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/status-bar-messages.spec.ts`
- **Lote:** L20c
- **Linhas:** 85
- **SHA1:** 94957832b6ecddf1a601c8b3be351e499203518b
- **Partes lidas:** 1-85
- **Propósito:** Verifica que uma recusa é substituída pela próxima ação mesmo quando ela nada diz, que mudanças de preferência nomeiam o que foi definido na língua mostrada, e que uma mensagem longa é cortada numa linha, lida inteira no tooltip, sem mexer em nenhum item fixo da barra.
- **Âncora:** `tests/e2e/status-bar-messages.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/status-bar.spec.ts`
- **Lote:** L20c
- **Linhas:** 150
- **SHA1:** 9756e9dae3e3330caff7de4eb1441e50183b790d
- **Partes lidas:** 1-150
- **Propósito:** Verifica a barra de status contra o que a página mede: caminho de migalhas que selecionam seus ancestrais, tamanho da seleção em px de página, contexto de breakpoint e estado, contagem de elementos da página aberta, zoom, altura de todo controle e a contagem de problemas na aba Checks do dock fechado.
- **Âncora:** `tests/e2e/status-bar.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/styles-view.spec.ts`
- **Lote:** L20c
- **Linhas:** 34
- **SHA1:** 7d33bbb72397c13558c6fbccb030bb1833925edd
- **Partes lidas:** 1-34
- **Propósito:** Verifica que a vista Styles de um projeto vazio ensina como criar classe e variável, e que num projeto cada nome e valor de variável aparece inteiro sem corte.
- **Âncora:** `tests/e2e/styles-view.spec.ts:10` `const STYLES = 'workspace.setPanelOpen#toolbar-activity-bar-styles';`

### `tests/e2e/table-parts.spec.ts`
- **Lote:** L20c
- **Linhas:** 66
- **SHA1:** 5354980e4500abc5f3b2361a46e4c0fb4efeafbd
- **Partes lidas:** 1-66
- **Propósito:** Verifica que os toggles Caption, Head e Footer desenham preenchidos com o acento exatamente para as partes que a tabela tem, e que um clique adiciona ou remove a parte virando o toggle.
- **Âncora:** `tests/e2e/table-parts.spec.ts:8` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/template-modal-preview.spec.ts`
- **Lote:** L20c
- **Linhas:** 38
- **SHA1:** f1884a8042163693fa7390c8a4edce0dde895afc
- **Partes lidas:** 1-38
- **Propósito:** Verifica que o template modal abre e fecha com o comportamento nativo de dialog no Preview, com Escape fechando, e que sair do Preview deixa o documento como estava.
- **Âncora:** `tests/e2e/template-modal-preview.spec.ts:8` `const PREVIEW = 'view.enterPreview#key-ctrl-p-in-global';`

### `tests/e2e/template-tabs-preview.spec.ts`
- **Lote:** L20c
- **Linhas:** 50
- **SHA1:** 3fcc6c1dea70903a4f2da9c4fef6c53095cec110
- **Partes lidas:** 1-50
- **Propósito:** Verifica que abas copiadas alternam painéis independentes por mouse e teclado no Preview, com aria-controls apontando cada painel, e que o documento não muda.
- **Âncora:** `tests/e2e/template-tabs-preview.spec.ts:6` `const INSERT_PANEL = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/test-port.spec.ts`
- **Lote:** L20c
- **Linhas:** 80
- **SHA1:** e9724290aa97d7a2f52e327cd3a01f6877e67cec
- **Partes lidas:** 1-80
- **Propósito:** Prova a porta de teste somente leitura: seus membros são exatamente os leitores, ela é congelada e fixa na window, uma leitura é cópia e chamar todo membro com argumentos não muda o documento nem o que o canvas desenha.
- **Âncora:** `tests/e2e/test-port.spec.ts:9` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/text-areas.spec.ts`
- **Lote:** L20c
- **Linhas:** 37
- **SHA1:** 1978e75ca716f15063dedd508657245e35f7dee8
- **Partes lidas:** 1-37
- **Propósito:** Verifica que a área de nomes do painel Data e o campo de pedido do assistente mostram ao menos três linhas, e que duas linhas digitadas ficam inteiras sem rolagem.
- **Âncora:** `tests/e2e/text-areas.spec.ts:9` `const DATA = 'workspace.setPanelOpen#toolbar-activity-bar-data';`

### `tests/e2e/text-edit-inline.spec.ts`
- **Lote:** L20c
- **Linhas:** 317
- **SHA1:** a32e1ec346d71e3c26616956625f1116d9ad1127
- **Partes lidas:** 1-317
- **Propósito:** Cobre a edição de texto no lugar: o clique duplo edita no próprio elemento com foco e contexto de teclado, Enter e Escape guardam o texto em um passo de undo devolvendo o foco ao canvas, a quebra de linha vira br, o frame sai do aria-hidden apenas enquanto a edição dura, o contorno e o rótulo vestem o modo de texto, seleção múltipla é recusada com motivo e espaços digitados em botão, link e textos de template são preservados.
- **Âncora:** `tests/e2e/text-edit-inline.spec.ts:14` `const SELECT = 'selection.select#canvas-click-element-or-page';`

### `tests/e2e/text-inline-formatting.spec.ts`
- **Lote:** L20c
- **Linhas:** 259
- **SHA1:** 6ce8c0df590e5a92a3b533c0dd3c6118d67ff23e
- **Partes lidas:** 1-259
- **Propósito:** Cobre a formatação embutida: Ctrl+B pega parte de uma palavra e desfaz parte de um trecho em negrito, os botões Italic e Bold agem na seleção mantendo o foco, as marcas aninham e sobrevivem ao recarregar, Ctrl+K liga o termo selecionado, começa do endereço do link do cursor e o endereço vazio remove o link, endereço não permitido é recusado com o prompt aberto explicando, Ctrl+V cola o HTML mantendo negrito, itálico e links permitidos e descartando script, e o campo de texto do inspector conserva as marcas.
- **Âncora:** `tests/e2e/text-inline-formatting.spec.ts:16` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/theme-switch.spec.ts`
- **Lote:** L20c
- **Linhas:** 25
- **SHA1:** 36e8c420431458be4a54bcd8b168ec654febaa32
- **Partes lidas:** 1-25
- **Propósito:** Verifica que, com System escolhido, o editor segue o esquema de cores do navegador ao vivo, sem recarregar, e que a página dentro do frame mantém as próprias cores em qualquer tema.
- **Âncora:** `tests/e2e/theme-switch.spec.ts:7` `const SYSTEM = 'preferences.setTheme#menu-theme-system';`

### `tests/e2e/timeline-bar-fits.spec.ts`
- **Lote:** L20c
- **Linhas:** 67
- **SHA1:** 4b667eeeb404c5dd51500ad8686250f02df73b97
- **Partes lidas:** 1-67
- **Propósito:** Verifica na janela mais estreita que mantém a barra lateral que a barra de quadros-chave desenha cada controle inteiro, sem sobreposição nem corte, dentro do painel nos dois idiomas.
- **Âncora:** `tests/e2e/timeline-bar-fits.spec.ts:11` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/timeline-ruler.spec.ts`
- **Lote:** L20c
- **Linhas:** 42
- **SHA1:** d529b85b8b4f3e2278142dfff2803138c7bfe79b
- **Partes lidas:** 1-42
- **Propósito:** Verifica que a régua da Timeline nomeia seus quartos em segundos e que a barra de transporte diz o tempo do cursor sobre a duração, com os rótulos dentro da régua e nada desenhado sem seleção.
- **Âncora:** `tests/e2e/timeline-ruler.spec.ts:9` `const OPEN = 'project.open#menu-file';`

### `tests/e2e/undo-never-jumps.spec.ts`
- **Lote:** L20c
- **Linhas:** 42
- **SHA1:** 0a83cf4bd6f60b8113f10172b2cae5db2cf3e0fd
- **Partes lidas:** 1-42
- **Propósito:** Verifica que Ctrl+Z e Ctrl+Shift+Z no campo vazio de nova animação da Timeline desfazem e refazem o documento, com o foco mantido no campo e sem rascunho redigitado no campo de Font size.
- **Âncora:** `tests/e2e/undo-never-jumps.spec.ts:10` `const ROW = 'selection.select#layers-row';`

### `tests/e2e/unsaved-work-guard.spec.ts`
- **Lote:** L20c
- **Linhas:** 56
- **SHA1:** 75d1b59a90ff8522ab59744ad1c26dd254e35dd3
- **Partes lidas:** 1-56
- **Propósito:** Verifica que, com a gravação no IndexedDB recusada, a barra lê Not saved com o motivo do navegador e sair da aba pede a confirmação, e que quando o armazenamento volta a aceitar o autosave grava sozinho, lê Saved e sair não pergunta nada.
- **Âncora:** `tests/e2e/unsaved-work-guard.spec.ts:10` `const INSERT_VIEW = 'workspace.setPanelOpen#toolbar-activity-bar-insert';`

### `tests/e2e/unwrap.spec.ts`
- **Lote:** L20c
- **Linhas:** 87
- **SHA1:** ce8326a4d3e7fa557b626b5c442d24b0e37c1d68
- **Partes lidas:** 1-87
- **Propósito:** Verifica que Arrange › Remove wrapper levanta os filhos do Grid no lugar em um passo de undo, e que com um elemento sem filhos ou na raiz da página o item fica desabilitado com o motivo e a pressão nada muda.
- **Âncora:** `tests/e2e/unwrap.spec.ts:10` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/value-origin.spec.ts`
- **Lote:** L20c
- **Linhas:** 135
- **SHA1:** f804b9b00661ffddd0af62b7cfaf6286ad0f8bd9
- **Partes lidas:** 1-135
- **Propósito:** Verifica de onde vem o valor de um campo: valor vindo de classe vira placeholder mudo com nota nomeando a classe e aviso de que digitar escreve no elemento, o valor digitado cai no elemento enquanto a classe mantém o seu, cor herdada nomeia o ancestral, e em Tablet cor definida no Desktop vira placeholder.
- **Âncora:** `tests/e2e/value-origin.spec.ts:12` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/variable-kinds.spec.ts`
- **Lote:** L20c
- **Linhas:** 68
- **SHA1:** 42080de8fee5a737543f90408fb140f3effd3766
- **Partes lidas:** 1-68
- **Propósito:** Verifica que o + de nova variável abre a lista de tipos com o primeiro focado, que as setas, Home e End movem o foco, que Escape fecha devolvendo o foco ao + e que Enter cria a variável com o campo de nome focado.
- **Âncora:** `tests/e2e/variable-kinds.spec.ts:10` `const STYLES = 'workspace.setPanelOpen#toolbar-activity-bar-styles';`

### `tests/e2e/variable-suggestions.spec.ts`
- **Lote:** L20c
- **Linhas:** 83
- **SHA1:** 53e6517b4cc098ec8507730dac18e82a0d567ffc
- **Partes lidas:** 1-83
- **Propósito:** Verifica que um campo de comprimento lista só as variáveis de comprimento que o nome começado por -- casa, que pressionar uma variável grava e mantém o foco no campo e que a lista própria do campo de cor deixa as variáveis para as sugestões.
- **Âncora:** `tests/e2e/variable-suggestions.spec.ts:11` `const ROW = 'selection.select#layers-row';`

### `tests/e2e/visual.spec.ts`
- **Lote:** L20c
- **Linhas:** 78
- **SHA1:** 4a496e0b49f01de313e6c4a316fc21f9e58fae02
- **Partes lidas:** 1-78
- **Propósito:** Compara baselines visuais de sete estados fixos do editor nos temas claro e escuro, com a animação desligada e tolerância de 50 pixels.
- **Âncora:** `tests/e2e/visual.spec.ts:11` `const FIXTURE = 'manifest/features/fixtures/aurora.json';`

### `tests/e2e/waiting-panels.spec.ts`
- **Lote:** L20c
- **Linhas:** 85
- **SHA1:** 464c3bb3f28a462f4c3eec8e8079c7b3c681f37d
- **Partes lidas:** 1-85
- **Propósito:** Verifica que as portas de recursos registrados como construídos são usáveis: View › Timeline abre a aba do dock com suas 18 portas, a vista Styles abre com New variable usável e sem porta desabilitada, e View › Checks e Help › Keyboard shortcuts abrem seus painéis com conteúdo.
- **Âncora:** `tests/e2e/waiting-panels.spec.ts:9` `import { openMenu, runDoor, runs } from './door.ts';`

### `tests/e2e/workbench-panel.spec.ts`
- **Lote:** L20c
- **Linhas:** 75
- **SHA1:** 21edb18ee139203ca1913df6125b3de89314bb69
- **Partes lidas:** 1-75
- **Propósito:** Verifica que View › Developer tools dá ao dock a aba Document mostrando o documento vivo em JSON somente leitura, redesenhada a cada comando, mantida após recarregar enquanto ligada, e com strings longas resumidas no início e no comprimento.
- **Âncora:** `tests/e2e/workbench-panel.spec.ts:9` `const DEVELOPER = 'workspace.toggleDeveloperTools#menu-view';`

### `tests/e2e/workspace-doors.spec.ts`
- **Lote:** L20c
- **Linhas:** 237
- **SHA1:** 9ce8d97ba1105fdb0978cb9e1e761b2c79254918
- **Partes lidas:** 1-237
- **Propósito:** Roda com mouse e teclado cada porta habilitada de workspace e preferências contra um artefato final: vistas na barra lateral, Camadas dobrando e desdobrando, inspector e ferramentas do canvas alternando, faixa do dock fechando abas e mostrando a próxima, dobrando, maximizando e restaurando, recolher docas devolvendo o que estava aberto, e idioma e tema voltando com persistência.
- **Âncora:** `tests/e2e/workspace-doors.spec.ts:10` `const found = await page.locator(selector).boundingBox();`

### `tests/e2e/workspace-settings-dialog.spec.ts`
- **Lote:** L20c
- **Linhas:** 75
- **SHA1:** 27e7926993cfc4d435e69208f9c6cfc46b350060
- **Partes lidas:** 1-75
- **Propósito:** Verifica que o diálogo de guias e grades toma o foco, mantém Tab dentro de si e devolve o foco ao menu ao fechar com Escape, e que os interruptores escondem guias e réguas com o palco tomando o lugar das réguas, persistindo após recarregar enquanto o documento guarda a guia.
- **Âncora:** `tests/e2e/workspace-settings-dialog.spec.ts:15` `const DIALOG = '[data-region="guides-grids-dialog"]';`

### `tests/e2e/wrap-row-column.spec.ts`
- **Lote:** L20c
- **Linhas:** 346
- **SHA1:** 4bd08bbf89e15cee1769e6ab4990016b25dffb4f
- **Partes lidas:** 1-346
- **Propósito:** Cobre Wrap in a row e Wrap in a column além dos cenários: embrulham como as teclas R e C com um passo de undo cada, R ordena irmãos com confirmação quando a ordem muda, pais diferentes e pai que não aceita div são recusados sem mudança, C alcança o elemento coberto pelo único filho via ArrowUp, e palavras digitadas no canvas não disparam atalhos, com o burst de digitação, o F6 e o autosave cobertos e o redo anterior preservado.
- **Âncora:** `tests/e2e/wrap-row-column.spec.ts:15` `const TYPING_BURST = interactionNumber('keys.typingBurst');`

### `tests/perf/README.md`
- **Lote:** L21
- **Linhas:** 31
- **SHA1:** 2e456b2b36315aac9a0aa8a7f4fa2ce77c2fca59
- **Partes lidas:** 1-31
- **Propósito:** referência da medição de página grande: como rodar a medição, o que o intervalo do carimbo do evento até o segundo quadro representa, onde ficam as amostras e capturas e o que o relatório e a opção de imposição de meta fazem.
- **Âncora:** `tests/perf/README.md:1` `# Large-page performance reference`

### `tests/perf/budget.json`
- **Lote:** L21
- **Linhas:** 7
- **SHA1:** b7efad25051712668c8fade6363b1facdd22ebe3
- **Partes lidas:** 1-7
- **Propósito:** orçamento da medição de desempenho: nomeia a fixture de 641 nós, a referência histórica do estudo anterior e as metas de p50 e p95 por grupo de ação, com três execuções.
- **Âncora:** `tests/perf/budget.json:3` `"nodes": 641,`

### `tests/perf/large-page.perf.ts`
- **Lote:** L21
- **Linhas:** 106
- **SHA1:** b8fb2f771202579216241efee9a4a758802e918c
- **Partes lidas:** 1-106
- **Propósito:** teste de desempenho do Playwright: abre o editor, carrega a fixture de 641 nós pelo menu de arquivo, faz dez seleções, uma digitação, uma mudança de estilo e desfazer pelos botões e pelas teclas, e grava as amostras, o relatório e as capturas de cada execução.
- **Âncora:** `tests/perf/large-page.perf.ts:25` `await page.setViewportSize({ width: 1440, height: 900 });`

### `tests/perf/playwright.config.ts`
- **Lote:** L21
- **Linhas:** 8
- **SHA1:** b62d7ce3282b241f9adce10d9519e8fcf44abcb5
- **Partes lidas:** 1-8
- **Propósito:** configuração do Playwright para as medições: aponta para os arquivos de desempenho, com um worker único, sem retentativas, prazo de 90 segundos e rastreamento desligado.
- **Âncora:** `tests/perf/playwright.config.ts:1` `import { defineConfig } from '@playwright/test';`

### `tests/support/capture-site/assets/band.svg`
- **Lote:** L21
- **Linhas:** 1
- **SHA1:** cae5d6b7ff31502a1338305884b108eb773293ac
- **Partes lidas:** 1-1
- **Propósito:** imagem do site de captura: um retângulo estreito e alto que a folha de estilo repete como faixa horizontal.
- **Âncora:** `tests/support/capture-site/assets/band.svg:1` `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="40"><rect width="10" height="40" fill="#7a3e1d"/></svg>`

### `tests/support/capture-site/assets/cup.svg`
- **Lote:** L21
- **Linhas:** 1
- **SHA1:** d89f3091336e120d6ff1144c07e431d4d56a948a
- **Partes lidas:** 1-1
- **Propósito:** imagem do site de captura: um círculo laranja usado como a xícara da página de exemplo.
- **Âncora:** `tests/support/capture-site/assets/cup.svg:1` `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="30" fill="#b9512a"/></svg>`

### `tests/support/capture-site/assets/narrow.svg`
- **Lote:** L21
- **Linhas:** 1
- **SHA1:** ef8fbee5cc72dea0a07c92e770f59eb498e14de1
- **Partes lidas:** 1-1
- **Propósito:** imagem responsiva estreita do site de captura: retângulo azul de 120 por 60, origem pequena do conjunto de fontes da imagem.
- **Âncora:** `tests/support/capture-site/assets/narrow.svg:1` `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60"><rect width="120" height="60" fill="#abcdef"/></svg>`

### `tests/support/capture-site/assets/site.css`
- **Lote:** L21
- **Linhas:** 5
- **SHA1:** c696136cc8ff97661bce50d09765ad509c7cb379
- **Partes lidas:** 1-5
- **Propósito:** folha de estilo do site de captura: zera a margem do corpo, monta o topo e a marca, repete a faixa da imagem ao fundo e ajusta o espaçamento abaixo de 600 px.
- **Âncora:** `tests/support/capture-site/assets/site.css:1` `body { margin: 0; font-family: Georgia, serif; }`

### `tests/support/capture-site/assets/wide.svg`
- **Lote:** L21
- **Linhas:** 1
- **SHA1:** 6074b83634805017e711663f93d5348d160759db
- **Partes lidas:** 1-1
- **Propósito:** imagem responsiva larga do site de captura: retângulo escuro de 120 por 60, origem grande do conjunto de fontes da imagem.
- **Âncora:** `tests/support/capture-site/assets/wide.svg:1` `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60"><rect width="120" height="60" fill="#123456"/></svg>`

### `tests/support/capture-site/index.html`
- **Lote:** L21
- **Linhas:** 28
- **SHA1:** 433209d917442eafb06f1ac48385d66eef53eae4
- **Partes lidas:** 1-28
- **Propósito:** página de exemplo para a captura de sites: cabeçalho, texto, imagem, um elemento customizado com raiz sombra e um parágrafo acrescentado por script depois do carregamento.
- **Âncora:** `tests/support/capture-site/index.html:10` `<header class="top"><h1 class="brand">Grão Norte</h1></header>`

### `tests/support/capture-site/mixed-dom.html`
- **Lote:** L21
- **Linhas:** 20
- **SHA1:** 2f56fa3450f4b20cdc8eab3fa97eadda356282b5
- **Partes lidas:** 1-20
- **Propósito:** documento de origem misto para a captura: usa camadas de CSS, um elemento customizado e uma imagem embutida em data URI dentro de um link.
- **Âncora:** `tests/support/capture-site/mixed-dom.html:2` `<html lang="en" class="source-root">`

### `tests/support/capture-site/parser-rebuilt.html`
- **Lote:** L21
- **Linhas:** 41
- **SHA1:** a6bf609011867b9b9ea5608c8ee0aa59a4ca894d
- **Partes lidas:** 1-41
- **Propósito:** página que monta por script estruturas que o analisador de HTML nunca forma a partir de texto: um bloco dentro de um parágrafo, um link dentro de outro link e uma linha solta dentro de uma tabela.
- **Âncora:** `tests/support/capture-site/parser-rebuilt.html:12` `<main id="target"></main>`

### `tests/support/capture-site/plans/index.html`
- **Lote:** L21
- **Linhas:** 12
- **SHA1:** c0fc231fa25d8771dd02db46211fd8b99cb0a1ba
- **Partes lidas:** 1-12
- **Propósito:** página secundária do site de captura: apresenta o plano mensal ou o semanal e um link de volta para a página inicial.
- **Âncora:** `tests/support/capture-site/plans/index.html:9` `<header class="top"><h1 class="brand">Our plans</h1></header>`

### `tests/support/capture-site/print.css`
- **Lote:** L21
- **Linhas:** 1
- **SHA1:** 0a327a02c45f80eca5a6e1426d2105932afda4cd
- **Partes lidas:** 1-1
- **Propósito:** folha de estilo de impressão do site de captura: pinta o fundo do corpo de vermelho e é ligada ao documento com media de impressão.
- **Âncora:** `tests/support/capture-site/print.css:1` `body { background-color: rgb(255, 0, 0); }`

### `tests/support/capture-site/responsive-img.html`
- **Lote:** L21
- **Linhas:** 6
- **SHA1:** 8e6c9e3bd768c601c4af24796c81880834a64a25
- **Partes lidas:** 1-6
- **Propósito:** página com imagem responsiva: usa srcset e sizes para o navegador escolher entre o arquivo estreito e o largo pela largura disponível.
- **Âncora:** `tests/support/capture-site/responsive-img.html:3` `<img id="responsive-img" alt="Two browser-selected artworks" src="/assets/narrow.svg"`

### `tests/support/capture-site/responsive-picture.html`
- **Lote:** L21
- **Linhas:** 11
- **SHA1:** 857c2c25623a02e13a8a59984698871c7a5b5df9
- **Partes lidas:** 1-11
- **Propósito:** página com o elemento picture: duas origens de mídia escolhem a imagem estreita ou a larga conforme a largura da janela.
- **Âncora:** `tests/support/capture-site/responsive-picture.html:6` `<source media="(min-width: 800px)" srcset="assets/wide.svg 1x">`

### `tests/support/capture-site/responsive.html`
- **Lote:** L21
- **Linhas:** 16
- **SHA1:** 0008221c270151d47fc37f0364c76138745ef468
- **Partes lidas:** 1-16
- **Propósito:** página de captura responsiva: um script redimensiona a faixa conforme a largura da janela e troca o raio da borda abaixo de 390 px.
- **Âncora:** `tests/support/capture-site/responsive.html:5` `<div id="responsive-rail" style="width: 480px; height: 80px; background: rgb(20, 80, 120);"></div>`

### `tests/support/capture-site/root-classes.html`
- **Lote:** L21
- **Linhas:** 13
- **SHA1:** f91df0c0048f3b8afc6cbfd56929e33950ced0e2
- **Partes lidas:** 1-13
- **Propósito:** página de captura de classes na raiz: a classe font-brand no elemento html troca a fonte da marca usada pelo corpo.
- **Âncora:** `tests/support/capture-site/root-classes.html:2` `<html lang="en" class="font-brand">`

### `tests/support/coverage.ts`
- **Lote:** L21
- **Linhas:** 196
- **SHA1:** 461dd8104b06fe8fd9ebae7be293334e6a8d5cba
- **Partes lidas:** 1-196
- **Propósito:** registro de cobertura dos testes de navegador: com a variável de ambiente ligada, lê a cobertura do Chrome pela sessão de DevTools, converte as faixas executadas em linhas de src pelos mapas de código e grava, por teste, as linhas, os seletores de CSS e as chaves de mensagem usadas.
- **Âncora:** `tests/support/coverage.ts:13` `export const COVERAGE = process.env.E2E_COVERAGE === '1';`

### `tests/support/editor.ts`
- **Lote:** L21
- **Linhas:** 75
- **SHA1:** 26d2981dfec3c8a77dc5e8c438d75e55cc5fc4c6
- **Partes lidas:** 1-75
- **Propósito:** abertura do editor para os testes de navegador: entrega o projeto e os comandos pelo boot de teste, confere que o perfil está limpo e espera o editor e o canvas desenhados antes de devolver o controle ao teste.
- **Âncora:** `tests/support/editor.ts:37` `export async function openEditor(page: Page, setup: EditorSetup = {}): Promise<void> {`

### `tests/support/flows/cardapio.csv`
- **Lote:** L21
- **Linhas:** 13
- **SHA1:** e4d61c84893631834f9b1b70480f2a2aa6dc568f
- **Partes lidas:** 1-13
- **Propósito:** dados de um cardápio em CSV, com nome, preço, foto e descrição em português, usados pelos fluxos de importação de conteúdo.
- **Âncora:** `tests/support/flows/cardapio.csv:1` `nome,preco,foto,descricao`

### `tests/support/flows/large-page.json`
- **Lote:** L21
- **Linhas:** 7991
- **SHA1:** 43cb7172dbf70dc9d912d31ef3bd77c18a21052a
- **Partes lidas:** 1-1685; 1686-3358; 3359-5027; 5028-6698; 6699-7991
- **Propósito:** documento de exemplo no formato do projeto, versão 4: uma página inicial com blocos de hero, planos e rodapé repetidos dezenas de vezes, para medições em árvore profunda.
- **Âncora:** `tests/support/flows/large-page.json:2` `"version": 4,`

### `tests/support/folders/import-page/legacy.html`
- **Lote:** L21
- **Linhas:** 1
- **SHA1:** cc83117c14101a93028d96eb9292b14cb5a724f2
- **Partes lidas:** 1-1
- **Propósito:** página antiga de uma linha para os fluxos de importação de pastas: título e parágrafo que entram entre as páginas do cliente.
- **Âncora:** `tests/support/folders/import-page/legacy.html:1` `<!doctype html><html lang="en"><head><title>Legacy page</title></head><body><h1>Imported legacy page</h1><p>This page should join the client pages.</p></body></html>`

### `tests/support/folders/notes/note.html`
- **Lote:** L21
- **Linhas:** 11
- **SHA1:** fc61989c53423db25f25bf606b6f97cb8ece4c7e
- **Partes lidas:** 1-11
- **Propósito:** página de nota em português, com cabeçalho e parágrafo, usada nos fluxos de pastas de importação.
- **Âncora:** `tests/support/folders/notes/note.html:8` `<h2>Nota</h2>`

### `tests/support/folders/site/about/index.html`
- **Lote:** L21
- **Linhas:** 12
- **SHA1:** 34a6e780d603440880557aa5459487f466f54846
- **Partes lidas:** 1-12
- **Propósito:** página About do site de exemplo: título e texto, ligada à folha de estilo compartilhada, usada nos fluxos de importação de pasta.
- **Âncora:** `tests/support/folders/site/about/index.html:9` `<h1 class="title">About us</h1>`

### `tests/support/folders/site/css/site.css`
- **Lote:** L21
- **Linhas:** 25
- **SHA1:** eae46dc3b870efe14142d2581378116bf71030df
- **Partes lidas:** 1-25
- **Propósito:** folha de estilo do site de exemplo: define cor e tamanho do título, o espaçamento do cartão, um estado de passagem do ponteiro e um ajuste abaixo de 600 px.
- **Âncora:** `tests/support/folders/site/css/site.css:4` `font-size: 40px;`

### `tests/support/folders/site/css/styles.css`
- **Lote:** L21
- **Linhas:** 5
- **SHA1:** cfd458fa71e68d5787c121bc1cc27fd0ef8451a1
- **Partes lidas:** 1-5
- **Propósito:** folha de estilo antiga do site de exemplo: define só a cor da classe old, e o comentário registra que a importação a renomeia para não colidir com o arquivo gerado.
- **Âncora:** `tests/support/folders/site/css/styles.css:4` `color: #667788;`

### `tests/support/folders/site/index.html`
- **Lote:** L21
- **Linhas:** 16
- **SHA1:** 26e952828b1e86978a9e776b124a6f00ec3f6435
- **Partes lidas:** 1-16
- **Propósito:** página inicial do site de exemplo: título, cartão com texto e imagem e a ligação do script próprio do site.
- **Âncora:** `tests/support/folders/site/index.html:9` `<h1 class="title">Welcome</h1>`

### `tests/support/folders/site/js/app.js`
- **Lote:** L21
- **Linhas:** 4
- **SHA1:** 3e028d25b6cbfd9eb4d14e47a47ed0f94a844ef6
- **Partes lidas:** 1-4
- **Propósito:** script próprio do site de exemplo: registra um ouvinte de DOMContentLoaded que escreve uma linha no console.
- **Âncora:** `tests/support/folders/site/js/app.js:2` `document.addEventListener('DOMContentLoaded', () => {`

### `tests/support/folders/site/js/interactions.js`
- **Lote:** L21
- **Linhas:** 3
- **SHA1:** 3f086726b59c3c26860e5e04f6152fcc2e42a294
- **Partes lidas:** 1-3
- **Propósito:** script antigo do site de exemplo: marca siteReady na janela, e o comentário registra que a importação o renomeia para não colidir com o arquivo gerado.
- **Âncora:** `tests/support/folders/site/js/interactions.js:3` `window.siteReady = true;`

### `tests/support/folders/static/README.md`
- **Lote:** L21
- **Linhas:** 3
- **SHA1:** 62b7bb9e7ab7d89bd6811745f58a4bc4b1ef977b
- **Partes lidas:** 1-3
- **Propósito:** texto da pasta sem página HTML: registra que a pasta não tem página, caso do fluxo em que a importação é recusada.
- **Âncora:** `tests/support/folders/static/README.md:1` `# Static files`

### `tests/support/folders/static/css/theme.css`
- **Lote:** L21
- **Linhas:** 4
- **SHA1:** d8cc4ef1b9b2247dfd4fb4c1d887a6b1c0ff19f1
- **Partes lidas:** 1-4
- **Propósito:** folha de estilo da pasta sem página HTML: o comentário registra a recusa da importação e a regra pinta a classe plain.
- **Âncora:** `tests/support/folders/static/css/theme.css:3` `color: #333333;`

### `tests/support/groups.ts`
- **Lote:** L21
- **Linhas:** 68
- **SHA1:** ebf06307df9dd8c619a3d428da8f8b1a4285d3a8
- **Partes lidas:** 1-68
- **Propósito:** os três tipos de teste de navegador por arquivo de spec: lista os nomes de ponta a ponta e de render e expõe kindOf, que classifica cada arquivo de spec numa das três categorias.
- **Âncora:** `tests/support/groups.ts:67` `export type TestKind = 'end-to-end' | 'integration' | 'render';`

### `tests/support/hand.ts`
- **Lote:** L21
- **Linhas:** 47
- **SHA1:** 9fabd7aabc4f51fd2ebca1a75ee7f46d11d91337
- **Partes lidas:** 1-47
- **Propósito:** a mão de uma pessoa nos testes em que o tempo faz parte do comportamento: tremor sobre o ponteiro antes de soltar um arraste e letras digitadas com intervalo, com os números lidos do manifesto de interações.
- **Âncora:** `tests/support/hand.ts:11` `export function interactionNumber(id: string): number {`

### `tests/support/proofs.ts`
- **Lote:** L21
- **Linhas:** 8
- **SHA1:** d1f84a0e22d74c9b4c0342585f46a6c8c255c875
- **Partes lidas:** 1-8
- **Propósito:** ponto de entrada do apoio de testes: reexporta módulos do próprio aplicativo para as provas que rodam no navegador contra o build servido.
- **Âncora:** `tests/support/proofs.ts:5` `export * from '../../src/editor/canvas/coordinates.ts';`

### `tests/support/screen-guard-allowed.ts`
- **Lote:** L21
- **Linhas:** 55
- **SHA1:** f57718162f9cf3d1674b1c427b2ed774d0c1cb34
- **Partes lidas:** 1-55
- **Propósito:** as exceções do guarda de tela: cada achado que o produto mantém de propósito, com o tipo, o seletor coberto, o que cobre e o motivo.
- **Âncora:** `tests/support/screen-guard-allowed.ts:12` `export const ALLOWED: readonly Allowed[] = [`

### `tests/support/screen-guard.ts`
- **Lote:** L21
- **Linhas:** 428
- **SHA1:** 734b653f45566c4ea8fa43fa162198f3b1b19e17
- **Partes lidas:** 1-428
- **Propósito:** o guarda de tela do editor: percorre o DOM e aponta texto cortado, nome de uma linha quebrado em duas, controle fora da janela ou coberto, texto inglês na interface portuguesa e painel com rolagem lateral, descontando as exceções declaradas.
- **Âncora:** `tests/support/screen-guard.ts:39` `export const SCREEN_GUARD_DIR = path.join('.cache', 'screen-guard');`

### `tests/support/test.ts`
- **Lote:** L21
- **Linhas:** 131
- **SHA1:** 5033ea0fc979c68d2b531043992f801c97611f30
- **Partes lidas:** 1-131
- **Propósito:** o ponto de entrada único dos testes de navegador: estende o test do Playwright com os guardas automáticos de incidentes, erros da página, cobertura e tela, instala o relógio controlado e ordena os testes conforme o ambiente.
- **Âncora:** `tests/support/test.ts:30` `export function expectBrowserErrors(...patterns: RegExp[]): void {`

### `tools/assistant/real-check.test.ts`
- **Lote:** L22a
- **Linhas:** 14
- **SHA1:** 7dbb7b075410e52ce654397129bc980f27169468
- **Partes lidas:** 1-14
- **Propósito:** Testa o PNG do wireframe da checagem real do assistente quanto a assinatura, cabeçalho de 1200 × 800 e tamanho.
- **Âncora:** `tools/assistant/real-check.test.ts:3` `import { describe, expect, it } from 'vitest';`

### `tools/assistant/real-check.ts`
- **Lote:** L22a
- **Linhas:** 105
- **SHA1:** 193b2e8b8f85955d24ca5961402ffe1d949d6c11
- **Partes lidas:** 1-105
- **Propósito:** Checagem do assistente contra o provedor real: monta um wireframe em PNG, envia antes do texto e confere que a resposta usa as ferramentas do Layout Composer, gravando o resultado em `.cache/logs/assistant`.
- **Âncora:** `tools/assistant/real-check.ts:15` `const MODEL = process.env.ASSISTANT_MODEL ?? 'claude-opus-5-5';`

### `tools/audit/check.mjs`
- **Lote:** L22a
- **Linhas:** 508
- **SHA1:** 2e22ce1eff8b69cf039e9193e7bf066a3a5399ea
- **Partes lidas:** 1-508
- **Propósito:** Verificador da auditoria: roda as checagens C1 a C10 sobre os registros, com filtro por fase, por lote e modo resumo, e sai com código 1 quando há pendência.
- **Âncora:** `tools/audit/check.mjs:45` `const auditoriaFiles = listAuditFiles(['.md', '.json', '.mjs']);`

### `tools/audit/contar.mjs`
- **Lote:** L22a
- **Linhas:** 30
- **SHA1:** 98949705e7857f1c2f4cf5887fdfdc2045f2db35
- **Partes lidas:** 1-30
- **Propósito:** Conta as ocorrências de cada padrão de `auditoria/padroes.json` nos seus alvos e imprime o total, por padrão e no fim.
- **Âncora:** `tools/audit/contar.mjs:22` `for (const line of text.split('\n')) {`

### `tools/audit/esqueletos.mjs`
- **Lote:** L22a
- **Linhas:** 53
- **SHA1:** 3f9684d0f697b508bd48c7261fb41a556293f304
- **Partes lidas:** 1-53
- **Propósito:** Cria os esqueletos dos arquivos de interação de um item de estado em auditoria/interacoes/, só com títulos, ids de grupo e seções.
- **Âncora:** `tools/audit/esqueletos.mjs:20` `const wFns = [...e.writers.keys()].sort();`

### `tools/audit/inventariar.mjs`
- **Lote:** L23
- **Linhas:** 76
- **SHA1:** ac03fc587e52514c4c5c1946661424edf1ac00a6
- **Partes lidas:** 1-76
- **Propósito:** Mantém o inventário de arquivos depois de uma mudança: atualiza linhas, SHA1 e partes do bloco existente ou acrescenta o bloco de um arquivo novo, e junta inventario-arquivos.md.
- **Âncora:** `tools/audit/inventariar.mjs:8` `import fs from 'node:fs';`

### `tools/audit/juntar-inventario.mjs`
- **Lote:** L22a
- **Linhas:** 14
- **SHA1:** 4e233399b7e7cc5f425afd0f9f2b687cc53af77c
- **Partes lidas:** 1-14
- **Propósito:** Junta os arquivos de auditoria/inventario/ em auditoria/inventario-arquivos.md, ordenado pelo caminho.
- **Âncora:** `tools/audit/juntar-inventario.mjs:13` `fs.writeFileSync(path.join(ROOT, 'auditoria', 'inventario-arquivos.md'), out);`

### `tools/audit/juntar.mjs`
- **Lote:** L22a
- **Linhas:** 32
- **SHA1:** a01d0f67a7631eab59d6be57743e95e51ad6e46f
- **Partes lidas:** 1-32
- **Propósito:** Junta os arquivos de uma pasta de registro de auditoria (estado, entradas, requisitos, matriz) no arquivo único correspondente, deixando de fora o PROCEDIMENTO.md.
- **Âncora:** `tools/audit/juntar.mjs:15` `const registro = process.argv[2];`

### `tools/audit/lib.mjs`
- **Lote:** L22a
- **Linhas:** 348
- **SHA1:** e49efa55a321b65e65fc4e601b037bd94cf8e841
- **Partes lidas:** 1-348
- **Propósito:** Utilitários compartilhados pelos scripts de auditoria: escopo da vistoria, hashes, citações, palavras proibidas, parser de itens, blocos de inventário, a junção com o custo de leitura.
- **Âncora:** `tools/audit/lib.mjs:10` `export const ROOT = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());`

### `tools/audit/lotes.mjs`
- **Lote:** L22a
- **Linhas:** 185
- **SHA1:** 8f889ac8b8997a1b87e3640ab59ab6c47edbfe97
- **Partes lidas:** 1-185
- **Propósito:** Divide o escopo da vistoria nos lotes do plano e grava auditoria/lotes/<lote>.md com linhas, SHA1 e as leituras de cada arquivo.
- **Âncora:** `tools/audit/lotes.mjs:119` `function readsFor(rel) {`

### `tools/audit/matriz.mjs`
- **Lote:** L22a
- **Linhas:** 36
- **SHA1:** 03fbf306840ee43f6634f253a9154fdaa3c2062b
- **Partes lidas:** 1-36
- **Propósito:** Forma os grupos de escritores e de leitores a partir das marcas dos fluxos e congela auditoria/matriz.md com os pares de cada item de estado.
- **Âncora:** `tools/audit/matriz.mjs:9` `const ests = [...mat.keys()].sort();`

### `tools/audit/recitar.mjs`
- **Lote:** L23
- **Linhas:** 135
- **SHA1:** 57e176e33526e994977fd94cc01b09773a7b1814
- **Partes lidas:** 1-135
- **Propósito:** Reposiciona as citações da auditoria depois de uma edição no código, pelo diff exato contra a versão-base de cada arquivo citado, e lista as citações cuja linha mudou ou cujo trecho deixou de existir.
- **Âncora:** `tools/audit/recitar.mjs:13` `import fs from 'node:fs';`

### `tools/audit/renumerar.mjs`
- **Lote:** L23
- **Linhas:** 65
- **SHA1:** 8a627998bcfacd38c4bbd5b9c2797cbe0031d892
- **Partes lidas:** 1-65
- **Propósito:** Renomeia os arquivos de par de auditoria/interacoes/ pelo nome das funções do cabeçalho para o id que a matriz dá hoje, em duas fases e sem colisão, e lista os pares cuja função saiu da matriz.
- **Âncora:** `tools/audit/renumerar.mjs:9` `import fs from 'node:fs';`

### `tools/capture/audit-cli.ts`
- **Lote:** L22a
- **Linhas:** 55
- **SHA1:** a93d664937e998c237ebfc83e2fbe3aa58714eff
- **Partes lidas:** 1-55
- **Propósito:** Linha de comando da auditoria de importação da captura: roda a auditoria por site e largura do corpus e grava os relatórios em `.cache/logs`.
- **Âncora:** `tools/capture/audit-cli.ts:9` `const widths = [1440, 1180, 834, 390];`

### `tools/capture/audit-observation.ts`
- **Lote:** L22a
- **Linhas:** 26
- **SHA1:** 33f17f3559f2c2afa785b00b0a4976cf432bd9b3
- **Partes lidas:** 1-26
- **Propósito:** Lê no navegador a árvore do DOM exportado, com elementos, textos e comentários em ordem, para a comparação estrutural da auditoria.
- **Âncora:** `tools/capture/audit-observation.ts:9` `export async function readDomObservation(page: Page): Promise<AuditNode> {`

### `tools/capture/audit.test.ts`
- **Lote:** L22a
- **Linhas:** 26
- **SHA1:** 7d38a8e9ae0e8fe6e6900b0c17376274d5db054b
- **Partes lidas:** 1-26
- **Propósito:** Testa a regra de transbordo horizontal da auditoria de captura sobre as larguras medidas no site bellroy.
- **Âncora:** `tools/capture/audit.test.ts:3` `import { describe, expect, it } from 'vitest';`

### `tools/capture/audit.ts`
- **Lote:** L22a
- **Linhas:** 320
- **SHA1:** de61a93791cc402d9754906d4b91436b3e7b7f2d
- **Partes lidas:** 1-320
- **Propósito:** Auditoria de importação somente leitura: compara DOM vivo, pacote da captura, projeto salvo e DOM exportado em cada largura, com recursos, geometria e referência.
- **Âncora:** `tools/capture/audit.ts:166` `export function overflowsWindow(width: number, sourceWidth: number | null, madeWidth: number | null): boolean {`

### `tools/capture/corpus.capture.ts`
- **Lote:** L22a
- **Linhas:** 188
- **SHA1:** 6dadd21b7253904540f6145e617d6952242040f2
- **Partes lidas:** 1-188
- **Propósito:** Teste do corpus por site: registra a referência viva, importa a captura no editor, exporta e compara as fotografias de página inteira em cada largura.
- **Âncora:** `tools/capture/corpus.capture.ts:38` `const EXPORT_ORIGIN = 'http://export.corpus.test';`

### `tools/capture/corpus.config.ts`
- **Lote:** L22a
- **Linhas:** 36
- **SHA1:** c88ead951488a7abb77f78dd0c6a4136a8992d2c
- **Partes lidas:** 1-36
- **Propósito:** Configuração do Playwright para as corridas do corpus de captura, com um trabalhador, o Chrome instalado e um servidor próprio.
- **Âncora:** `tools/capture/corpus.config.ts:8` `const port = process.env.CORPUS_PORT ?? '5344';`

### `tools/capture/corpus.json`
- **Lote:** L22a
- **Linhas:** 25
- **SHA1:** 5878fee7f949896b72479cd78f87321201f01ffc
- **Partes lidas:** 1-25
- **Propósito:** Lista os vinte sites públicos do corpus de captura, cada um com id, URL e tipo.
- **Âncora:** `tools/capture/corpus.json:3` `"sites": [`

### `tools/capture/diagnose-cli.ts`
- **Lote:** L22a
- **Linhas:** 33
- **SHA1:** 8ffaa8523808c5e6f3b26d17efded30cd4c673a1
- **Partes lidas:** 1-33
- **Propósito:** Linha de comando do diagnóstico de fidelidade: compara a referência viva com um export ou com uma segunda carga do site e imprime o primeiro ponto divergente.
- **Âncora:** `tools/capture/diagnose-cli.ts:10` `const [id, typedWidth, mode = 'export'] = process.argv.slice(2);`

### `tools/capture/diagnose.ts`
- **Lote:** L22a
- **Linhas:** 132
- **SHA1:** 6cbdc94d4db6ba126cc489384a71e679b364754f
- **Partes lidas:** 1-132
- **Propósito:** Diagnóstico somente leitura de fidelidade: produz o PNG marcado, a primeira faixa divergente e as caixas de origem e export para investigar de cima para baixo.
- **Âncora:** `tools/capture/diagnose.ts:8` `export interface DifferenceDiagnosis {`

### `tools/capture/fidelity.ts`
- **Lote:** L22a
- **Linhas:** 41
- **SHA1:** 111fe9d81d19e0cc142214e746484e54327c0b52
- **Partes lidas:** 1-41
- **Propósito:** Compara duas fotografias de página inteira pela fração de pixels iguais, sobre a altura comum, em cada largura observada da captura.
- **Âncora:** `tools/capture/fidelity.ts:6` `export const TOLERANCE = 24;`

### `tools/capture/reference.ts`
- **Lote:** L22a
- **Linhas:** 228
- **SHA1:** d393fe35850f047de34e49917c6fa76cfa52b7f9
- **Partes lidas:** 1-228
- **Propósito:** Grava e lê as referências do corpus: navegação viva com relógio fixo e semente, fotografias, instantâneos de DOM e layout, e manifesto com hashes.
- **Âncora:** `tools/capture/reference.ts:12` `export const REFERENCE_TIME = '2026-10-04T12:00:00.000Z';`

### `tools/capture/report.ts`
- **Lote:** L22a
- **Linhas:** 105
- **SHA1:** fba9951702091972f8c60f79843dd319ecf6d822
- **Partes lidas:** 1-105
- **Propósito:** Gera o relatório do corpus de captura a partir dos registros, com a fidelidade de cada site em cada ponto de quebra e os diagnósticos de replay e estabilidade.
- **Âncora:** `tools/capture/report.ts:103` `fs.mkdirSync(path.join('.cache', 'logs'), { recursive: true });`

### `tools/capture/score.test.ts`
- **Lote:** L22a
- **Linhas:** 48
- **SHA1:** fc81136a600716012944b3678c55f9057d1fd062
- **Partes lidas:** 1-48
- **Propósito:** Testa a regra do placar do corpus: alvo de 98 por cento, site abaixo quando a própria página varia e não medido sem referência atual.
- **Âncora:** `tools/capture/score.test.ts:8` `const WIDTHS = [1440, 1180, 834, 390] as const;`

### `tools/capture/score.ts`
- **Lote:** L22a
- **Linhas:** 26
- **SHA1:** 8010f3132e0df45afaba8f035cf677cbb624da5e
- **Partes lidas:** 1-26
- **Propósito:** Regra do placar do corpus: decide se um site alcança o alvo em todas as larguras, fica abaixo ou é inconclusivo por variação própria.
- **Âncora:** `tools/capture/score.ts:8` `export const TARGET = 98;`

### `tools/companion/build-extension.ts`
- **Lote:** L22a
- **Linhas:** 28
- **SHA1:** 12101630e16f623c19d2322933e53d78c1d9d010
- **Partes lidas:** 1-28
- **Propósito:** Compila a extensão do Companion (companion/extension) na pasta dist que o Chrome carrega, reunindo o service worker e a página de opções com o Vite.
- **Âncora:** `tools/companion/build-extension.ts:8` `export const EXTENSION = path.resolve('companion', 'extension', 'dist');`

### `tools/companion/capture.test.ts`
- **Lote:** L22a
- **Linhas:** 112
- **SHA1:** 3d49d5355ad90b95e8644eb71d2890e483002eb0
- **Partes lidas:** 1-112
- **Propósito:** Testa o caminho de página capturada, importações de CSS com ponto e vírgula, empacotamento em uma árvore, fontes gravadas sem corpo e srcset reduzido.
- **Âncora:** `tools/companion/capture.test.ts:7` `const HTML = 'http://www.w3.org/1999/xhtml';`

### `tools/companion/capture.ts`
- **Lote:** L22a
- **Linhas:** 649
- **SHA1:** 5554b6a7b5d2431005d407aa7b8a2c0d0a3116f1
- **Partes lidas:** 1-649
- **Propósito:** Captura do Companion: abre a URL no Chrome instalado, espera a rede, rola a página, lê o DOM, as folhas de estilo, imagens e fontes, segue links até o limite de páginas e devolve os arquivos da cópia estática.
- **Âncora:** `tools/companion/capture.ts:59` `const MOST_PAGES = 30;`

### `tools/companion/paint.ts`
- **Lote:** L22a
- **Linhas:** 72
- **SHA1:** 32c33af4803fa14b99809dbdfa353410bf1f8b92
- **Partes lidas:** 1-72
- **Propósito:** Recorta da fotografia de página inteira a tinta opaca de canvas, vídeo e quadro, trocando cada marcador por um arquivo local de imagem.
- **Âncora:** `tools/companion/paint.ts:8` `export async function completeOpaquePaint(page: Page, read: PageRead, screenshot: Buffer): Promise<PageRead> {`

### `tools/companion/serialize.test.ts`
- **Lote:** L22a
- **Linhas:** 104
- **SHA1:** 8e741ac3e7b9cd431754ca6150a1aa8f3fd692a8
- **Partes lidas:** 1-104
- **Propósito:** Testa a leitura da página em árvore de nós: propriedade de raiz, srcset malformado, nós fora do lugar do HTML, folhas inseridas por script, shadow root, estado de campo e dicas de recurso.
- **Âncora:** `tools/companion/serialize.test.ts:3` `import { beforeEach, expect, it } from 'vitest';`

### `tools/companion/serialize.ts`
- **Lote:** L22a
- **Linhas:** 231
- **SHA1:** c81956ebcf8041d7292cd74c362631548627227f
- **Partes lidas:** 1-231
- **Propósito:** Lê a página como árvore de nós, com folhas de estilo marcadas por espaço reservado, estado de formulário, imagens, vínculos e tinta opaca, sem depender de Node nem do Playwright.
- **Âncora:** `tools/companion/serialize.ts:52` `const HTML = 'http://www.w3.org/1999/xhtml';`

### `tools/companion/server.test.ts`
- **Lote:** L22a
- **Linhas:** 105
- **SHA1:** 43bb31be550f00f024dff087279d2da08d8fd2d8
- **Partes lidas:** 1-105
- **Propósito:** Testa a rota de instantâneo do Companion, quem pode pedir uma captura, nome de host rebatido e os endereços aceitos.
- **Âncora:** `tools/companion/server.test.ts:7` `const PORT = 5431;`

### `tools/companion/server.ts`
- **Lote:** L22a
- **Linhas:** 130
- **SHA1:** d521dd4b92cc803103807f026e9cb21bedcda5e0
- **Partes lidas:** 1-130
- **Propósito:** Servidor local do Companion: responde saúde, captura de um endereço com o próprio Chrome e instantâneos da extensão, restringindo quem pergunta e com qual origem.
- **Âncora:** `tools/companion/server.ts:19` `const LOOPBACK = new Set(['127.0.0.1', 'localhost', '[::1]']);`

### `tools/companion/tree.ts`
- **Lote:** L22a
- **Linhas:** 51
- **SHA1:** d47d6c6929dd06ed52df86edfbaeb22880b9efbc
- **Partes lidas:** 1-51
- **Propósito:** Percorre e transforma a árvore capturada, mapeando atributos e comentários por largura e reunindo valores de atributo e nós no início do head.
- **Âncora:** `tools/companion/tree.ts:15` `export function mapTree<T extends CapturedElement>(root: T, changes: TreeChanges): T {`

### `tools/gen/check.ts`
- **Lote:** L22a
- **Linhas:** 41
- **SHA1:** 8939fafeb8b7009f47312335366b443b3ab080ec
- **Partes lidas:** 1-41
- **Propósito:** Confere que os arquivos gerados são o que o gerador escreve agora, apontando arquivo editado à mão, fora de data ou feito fora do gerador.
- **Âncora:** `tools/gen/check.ts:13` `const at = (file: string) => path.join(REPO_ROOT, file);`

### `tools/gen/compat.ts`
- **Lote:** L22a
- **Linhas:** 663
- **SHA1:** 2f36208afa62eef2213e76ca6ae01ca96bd2fe16
- **Partes lidas:** 1-663
- **Propósito:** Decide o suporte de navegador dos dados CSS gerados a partir do BCD da MDN: propriedades, palavras-chave em cada contexto e funções, formas de sintaxe e unidades.
- **Âncora:** `tools/gen/compat.ts:114` `return require('@mdn/browser-compat-data') as Bcd;`

### `tools/gen/generate.ts`
- **Lote:** L22a
- **Linhas:** 374
- **SHA1:** 09cf53ae6a82b11571b5ba7be1b911c02cfa2900
- **Partes lidas:** 1-374
- **Propósito:** Gera src/generated, manifest/generated e o sprite de ícones a partir do manifesto e dos dados publicados da plataforma web, com saída determinística.
- **Âncora:** `tools/gen/generate.ts:24` `export const GENERATED_DIR = 'manifest/generated';`

### `tools/gen/icons.ts`
- **Lote:** L22a
- **Linhas:** 83
- **SHA1:** 4ebd61fd09661f22550177d5a84c7122580d4a3a
- **Partes lidas:** 1-83
- **Propósito:** Gera a lista de nomes de ícones do Lucide instalado e o sprite SVG com os ícones que o manifesto nomeia, com a licença no metadado.
- **Âncora:** `tools/gen/icons.ts:15` `export const ICONS_FILE = 'icons.json';`

### `tools/gen/types.ts`
- **Lote:** L22a
- **Linhas:** 253
- **SHA1:** 50ce7e244c37c04879d1ff648b28aaa2bc5c2bb0
- **Partes lidas:** 1-253
- **Propósito:** Escreve os tipos e as listas de ids gerados a partir do manifesto e do catálogo em inglês, além dos valores, unidades e iniciais que cada porta oferece.
- **Âncora:** `tools/gen/types.ts:29` `export const TYPES_DIR = 'src/generated';`

### `tools/gen/versions.ts`
- **Lote:** L22a
- **Linhas:** 21
- **SHA1:** 007762f62c81070df28a9d8727dec27015af73e2
- **Partes lidas:** 1-21
- **Propósito:** Lê a versão instalada de um pacote a partir do arquivo package.json encontrado do ponto de entrada resolvido.
- **Âncora:** `tools/gen/versions.ts:9` `export function packageVersion(pkg: string): string {`

### `tools/i18n/dedupe.test.ts`
- **Lote:** L22a
- **Linhas:** 13
- **SHA1:** 969b4c3353454b7227a08e5a339937a44d79b340
- **Partes lidas:** 1-13
- **Propósito:** Testa a detecção de chaves escritas duas vezes nos catálogos de idioma.
- **Âncora:** `tools/i18n/dedupe.test.ts:3` `import { LOCALE_FILES, duplicateKeys } from './dedupe.ts';`

### `tools/i18n/dedupe.ts`
- **Lote:** L22a
- **Linhas:** 35
- **SHA1:** 1a129c4e4d5c17aeb957a2b8ec8ec5b1d96bac58
- **Partes lidas:** 1-35
- **Propósito:** Detecta e corrige chaves duplicadas nos catálogos de idioma, que o JSON resolve em silêncio pela última cópia.
- **Âncora:** `tools/i18n/dedupe.ts:7` `export const LOCALE_FILES = ['src/i18n/locales/en.json', 'src/i18n/locales/pt-BR.json'];`

### `tools/i18n/unused.test.ts`
- **Lote:** L22a
- **Linhas:** 14
- **SHA1:** 74bba182b2a41b4016199e1b709fd2652db5fcf2
- **Partes lidas:** 1-14
- **Propósito:** Testa a checagem de chaves do catálogo inglês que nenhum código, manifesto, ferramenta ou teste nomeia.
- **Âncora:** `tools/i18n/unused.test.ts:3` `import { namedIn, projectText, unusedKeys } from './unused.ts';`

### `tools/i18n/unused.ts`
- **Lote:** L22a
- **Linhas:** 49
- **SHA1:** 32d4920e47266d3ecb25f784579f1c327a5ce82a
- **Partes lidas:** 1-49
- **Propósito:** Encontra as chaves do catálogo inglês que nada nomeia, contando o token, o radical de plural e prefixos que um modelo ou concatenação completa.
- **Âncora:** `tools/i18n/unused.ts:10` `const SKIPPED = normalize('src/generated');`

### `tools/impact/css.ts`
- **Lote:** L22a
- **Linhas:** 22
- **SHA1:** e2d05ab4026f93c6dd8b8e122682b8a1f250e985
- **Partes lidas:** 1-22
- **Propósito:** Lê, com o css-tree, os seletores das regras de uma folha que ficam sobre um conjunto de linhas, para o seletor de impacto.
- **Âncora:** `tools/impact/css.ts:6` `export function selectorsOn(css: string, lines: Lines): ReadonlySet<string> {`

### `tools/impact/detectors.ts`
- **Lote:** L23
- **Linhas:** 78
- **SHA1:** 74eee92453ef5578eab08099019c53297d9b2194
- **Partes lidas:** 1-78
- **Propósito:** Escolha dos detectores sem navegador que uma mudança alcança (MEC-04): os grupos do modelo da store pelo grafo de imports e os mutantes do catálogo pelo arquivo que trocam, cada um com o motivo.
- **Âncora:** `tools/impact/detectors.ts:6` `import fs from 'node:fs';`

### `tools/impact/diff.test.ts`
- **Lote:** L22a
- **Linhas:** 47
- **SHA1:** d27a2f03438cbdd2d52f35e75154b2279ac040e4
- **Partes lidas:** 1-47
- **Propósito:** Testa o diff de linhas do seletor de impacto: linhas editadas, removidas e as que bordejam uma inserção.
- **Âncora:** `tools/impact/diff.test.ts:6` `const text = (...lines: string[]) => lines.join('\n');`

### `tools/impact/diff.ts`
- **Lote:** L22a
- **Linhas:** 76
- **SHA1:** 0135b491e7d06d8f896d3a1df4544f584d68935c
- **Partes lidas:** 1-76
- **Propósito:** Calcula as linhas alteradas de um texto antigo em relação a um novo pela subsequência comum mais longa, sem sistema de controle de versão.
- **Âncora:** `tools/impact/diff.ts:5` `export type Lines = readonly (readonly [number, number])[];`

### `tools/impact/map.ts`
- **Lote:** L22a
- **Linhas:** 64
- **SHA1:** eb408a5133c30dcc44f0173fa2f5c6d328a2f4d0
- **Partes lidas:** 1-64
- **Propósito:** Guarda e lê o mapa de impacto: as entradas da corrida com seus hashes e textos, e o que cada teste de navegador executou.
- **Âncora:** `tools/impact/map.ts:14` `export const SNAPSHOT_FILE = path.join(IMPACT_DIR, 'snapshot.json');`

### `tools/impact/run.ts`
- **Lote:** L22a
- **Linhas:** 128
- **SHA1:** 430768d18db8581ab94c766b466224b0a2f2006b
- **Partes lidas:** 1-128
- **Propósito:** Linha de comando do seletor de impacto: compara as entradas atuais com as da última corrida gravada e roda as checagens que a mudança alcança, dizendo o motivo de cada escolha.
- **Âncora:** `tools/impact/run.ts:10` `import { kindOf } from '../../tests/support/groups.ts';`

### `tools/impact/select.test.ts`
- **Lote:** L22a
- **Linhas:** 125
- **SHA1:** 6acd9b64446713304793d902134c8af8b5c69d4e
- **Partes lidas:** 1-125
- **Propósito:** Testa as regras do seletor de impacto sobre mudanças e mapas sintéticos, inclusive quando nada pode ser colocado.
- **Âncora:** `tools/impact/select.test.ts:19` `const ran = (lines: Executed['lines'], selectors: string[] = [], keys: string[] = []): Executed => ({ lines, selectors, keys });`

### `tools/impact/select.ts`
- **Lote:** L22a
- **Linhas:** 222
- **SHA1:** d429c201e234b6c81d0b638e2f48fb14cac9fb38
- **Partes lidas:** 1-222
- **Propósito:** Regras do seletor de impacto: decide, camada por camada, o que rodar a partir dos arquivos tocados, sempre com o motivo e escalando sem silêncio.
- **Âncora:** `tools/impact/select.ts:77` `const posix = (file: string) => file.replaceAll('\\', '/');`

### `tools/impact/sources.ts`
- **Lote:** L22a
- **Linhas:** 101
- **SHA1:** 8893f2c2d3b3eda2778228ab98d1baf9d416bcc7
- **Partes lidas:** 1-101
- **Propósito:** Lê das duas versões de um texto o que uma mudança no manifesto ou no catálogo toca (cenários, portas, chaves) e quais arquivos de spec usam um arquivo.
- **Âncora:** `tools/impact/sources.ts:6` `const parse = (text: string): unknown => {`

### `tools/inventory/citations.test.ts`
- **Lote:** L22a
- **Linhas:** 44
- **SHA1:** bc19abba9ab5901f7be2da0be742f8791c0e622a
- **Partes lidas:** 1-44
- **Propósito:** Testa que todo documento citado por um arquivo-fonte existe no repositório, em docs/ ou na pasta de quem cita.
- **Âncora:** `tools/inventory/citations.test.ts:11` `const ROOTS = ['src', 'tools', 'tests'];`

### `tools/inventory/generate.ts`
- **Lote:** L22a
- **Linhas:** 109
- **SHA1:** f8720de49e4bc7766dce536485ac4d819bdb5d59
- **Partes lidas:** 1-109
- **Propósito:** Calcula o inventário da aplicação a partir do manifesto e das fontes: comandos e portas por funcionalidade, módulos donos e contagem de cenários.
- **Âncora:** `tools/inventory/generate.ts:57` `export function generate(): Inventory {`

### `tools/inventory/inventory-file.ts`
- **Lote:** L23
- **Linhas:** 26
- **SHA1:** 2c9625cd92a089d694d1b53ba42194e7757caab6
- **Partes lidas:** 1-26
- **Propósito:** Texto do manifest/generated/inventory.json (MEC-08, C1 opção F): funcionalidades, comandos e portas, campos de valor, partes do estado da store e elementos interativos com dono; o mesmo para o gravador e para o detector.
- **Âncora:** `tools/inventory/inventory-file.ts:5` `import { fieldContracts } from '../runner/contracts.ts';`

### `tools/inventory/inventory.test.ts`
- **Lote:** L22a
- **Linhas:** 55
- **SHA1:** 8f75e43df7f3bc86d267842e3354fd250796947b
- **Partes lidas:** 1-55
- **Propósito:** Confere o inventário contra a fonte e a tabela de funcionalidades: funcionalidade construída implementada, nenhum comando de funcionalidade não construída e donos corretos.
- **Âncora:** `tools/inventory/inventory.test.ts:13` `const inventory = generate();`

### `tools/inventory/local-controls.test.ts`
- **Lote:** L22a
- **Linhas:** 26
- **SHA1:** 1164a8ecba114efa41d746b8da842bc9c2197f20
- **Partes lidas:** 1-26
- **Propósito:** Testa que todo controle marcado `data-local` é declarado em manifest/layout.json com motivo e que nenhum declarado deixa de ser desenhado.
- **Âncora:** `tools/inventory/local-controls.test.ts:8` `const DRAWN = /data-local="([a-z0-9-]+)"/gu;`

### `tools/inventory/ui-scan.ts`
- **Lote:** L23
- **Linhas:** 91
- **SHA1:** 96f5748f6e122a54c5f725b5e25ec749fdd09fde
- **Partes lidas:** 1-91
- **Propósito:** Varredor dos elementos interativos do código (MEC-08, C1 opção A) pela API do compilador TypeScript: cada elemento em que a pessoa age, o dono dele e uma chave estável; o leitor de arquivo é trocável para o mutante sob execução.
- **Âncora:** `tools/inventory/ui-scan.ts:8` `import fs from 'node:fs';`

### `tools/inventory/write.ts`
- **Lote:** L23
- **Linhas:** 21
- **SHA1:** b50cdc4c9806016b84631c1aa0a75ef8c6a799a5
- **Partes lidas:** 1-21
- **Propósito:** Gravador do manifest/generated/inventory.json (MEC-08), que carrega o texto por um servidor Vite em modo middleware porque o manifesto usa import.meta.glob. Uso: node tools/inventory/write.ts.
- **Âncora:** `tools/inventory/write.ts:10` `import fs from 'node:fs';`

### `tools/lint/interactive-allowed.ts`
- **Lote:** L23
- **Linhas:** 98
- **SHA1:** e89afafb407ec1d86fc21027ade90531c861c185
- **Partes lidas:** 1-98
- **Propósito:** Lista das exceções da regra builder/interactive-owner (MEC-08): 81 elementos interativos sem porta nem data-local, cada um com categoria (structural, local, door-part) e motivo.
- **Âncora:** `tools/lint/interactive-allowed.ts:10` `export interface AllowedInteractive {`

### `tools/lint/listener-allowed.ts`
- **Lote:** L23
- **Linhas:** 23
- **SHA1:** 46485e46567976d575550710e5014651f31a5df0
- **Partes lidas:** 1-23
- **Propósito:** Exceções da regra builder/listener-scope (MEC-09): o que um arquivo começa e termina de outro jeito que a regra não vê, cada um com motivo; hoje os dois tratadores de erro da página e o intervalo da repetição do ponteiro.
- **Âncora:** `tools/lint/listener-allowed.ts:5` `export interface AllowedListener {`

### `tools/lint/plugin.test.ts`
- **Lote:** L22a
- **Linhas:** 332
- **SHA1:** 8a7c657294f1b107d13af71819fe395f0cc14238
- **Partes lidas:** 1-332
- **Propósito:** Testa as regras de lint do contrato sobre código válido e inválido, com o RuleTester e os tokens reais do tema.
- **Âncora:** `tools/lint/plugin.test.ts:14` `const stylesheets = new RuleTester({ plugins: { css }, language: 'css/css' });`

### `tools/lint/plugin.ts`
- **Lote:** L22a
- **Linhas:** 766
- **SHA1:** aa01a60e1cb7d84117206d1914fe112bec6574e9
- **Partes lidas:** 1-766
- **Propósito:** Implementa as regras de ESLint que seguram o contrato no código: portas de relógio e ids, textos de interface, tokens de estilo, donos de ponteiro, gesto, quadro e teclado, e ids do manifesto.
- **Âncora:** `tools/lint/plugin.ts:19` `type Node = Rule.Node;`

### `tools/lint/style-values.ts`
- **Lote:** L22a
- **Linhas:** 227
- **SHA1:** cabb439335db71e696a77c4396691eafe0b104e4
- **Partes lidas:** 1-227
- **Propósito:** Analisa valores literais de estilo — cores, espaçamentos, tamanhos, raios, sombras e fontes — além de `var()` e das propriedades de tokens, para as regras de lint.
- **Âncora:** `tools/lint/style-values.ts:7` `export const DEFAULT_TOKENS_FILE = 'src/ui/tokens.css';`

### `tools/manifest/check-plants-1.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** 768aec5e64aa626211073dda9a34f9e55f0e4f48
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 1 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-1.test.ts:3` `plantShard(0);`

### `tools/manifest/check-plants-2.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** 24a718795d96d02fcf24dbf1294bb46fb3d3d6c3
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 2 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-2.test.ts:3` `plantShard(1);`

### `tools/manifest/check-plants-3.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** a8849e2ea85675a9a0d61a633b80be30be5c6b46
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 3 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-3.test.ts:3` `plantShard(2);`

### `tools/manifest/check-plants-4.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** fb68f78eeea3429fe204beec5421e111a1bfa4fd
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 4 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-4.test.ts:3` `plantShard(3);`

### `tools/manifest/check-plants-5.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** aa6c317e84a1c69e3b99f878997cd6aa062035e9
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 5 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-5.test.ts:3` `plantShard(4);`

### `tools/manifest/check-plants-6.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** 22cd7e7597a510bf48ab522e0fcf65d60ef512e8
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 6 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-6.test.ts:3` `plantShard(5);`

### `tools/manifest/check-plants-7.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** 5c50afecf35e068ae6bdb184e79e5b40b866e332
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 7 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-7.test.ts:3` `plantShard(6);`

### `tools/manifest/check-plants-8.test.ts`
- **Lote:** L22a
- **Linhas:** 3
- **SHA1:** d37d21c1daa3f5ecf63794b6cc32b7f3d3f76dbd
- **Partes lidas:** 1-3
- **Propósito:** Roda a fatia 8 de 8 dos testes das mutações plantadas do verificador do manifesto.
- **Âncora:** `tools/manifest/check-plants-8.test.ts:3` `plantShard(7);`

### `tools/manifest/check.test.ts`
- **Lote:** L22a
- **Linhas:** 584
- **SHA1:** 55d7069139ad6d31e5346a5409443587e17826d2
- **Partes lidas:** 1-584
- **Propósito:** Testa o verificador do manifesto: aprovação no manifesto real, planta para cada regra, mutações do revisor, argumentos de passo, cenários e dados gerados.
- **Âncora:** `tools/manifest/check.test.ts:10` `const loaded = loadManifest();`

### `tools/manifest/check.ts`
- **Lote:** L22a
- **Linhas:** 72
- **SHA1:** 3a0a8c974e3ec0153eeb24d3bbda3b64572a82ac
- **Partes lidas:** 1-72
- **Propósito:** Linha de comando do verificador do manifesto: valida manifest/ e os catálogos, imprime o resumo e permite plantar uma falha pelo identificador.
- **Âncora:** `tools/manifest/check.ts:3` `import { checkManifest, type ManifestSummary, type Problem } from '../../src/manifest/check.ts';`

### `tools/manifest/declared-refusals.test.ts`
- **Lote:** L22a
- **Linhas:** 55
- **SHA1:** f68ebf901ad196cc3f43b6e41f9c56d93bd2f71b
- **Partes lidas:** 1-55
- **Propósito:** Testa que toda recusa declarada por um comando é dita por algum código ou regra, e que as palavras do modelo de conteúdo aparecem em conjunto.
- **Âncora:** `tools/manifest/declared-refusals.test.ts:26` `const COMMANDS: readonly Command[] = fs`

### `tools/manifest/load.ts`
- **Lote:** L22a
- **Linhas:** 99
- **SHA1:** 1f19be22959c53f420f818fbd3f1004cdb1588b5
- **Partes lidas:** 1-99
- **Propósito:** Lê manifest/ e os catálogos do disco para a entrada que o verificador espera, congelando os dados gerados e coletando os ids registrados nas fontes.
- **Âncora:** `tools/manifest/load.ts:7` `export const REPO_ROOT = fileURLToPath(new URL('../../', import.meta.url));`

### `tools/manifest/plant-shard.ts`
- **Lote:** L22a
- **Linhas:** 25
- **SHA1:** a1c414dbb9c56e6a54ab49b5ed53d8f3738318a0
- **Partes lidas:** 1-25
- **Propósito:** Divide as mutações plantadas do manifesto em oito fatias e roda cada uma num caso de teste, provando que a planta falha na própria regra e só nas que ela implica.
- **Âncora:** `tools/manifest/plant-shard.ts:8` `export const SHARDS = 8;`

### `tools/manifest/plants.ts`
- **Lote:** L22a
- **Linhas:** 1088
- **SHA1:** 72db80b75db0e8b93f72f9454d98b8081873ee35
- **Partes lidas:** 1-1045; 1046-1088
- **Propósito:** Declara as mutações plantadas do manifesto: cada uma copia o manifesto real e aplica um defeito único, com as regras consequentes que implica.
- **Âncora:** `tools/manifest/plants.ts:5` `import { DOCUMENT_VERSION } from '../../src/core/document/model.ts';`

### `tools/map/behavior.ts`
- **Lote:** L23
- **Linhas:** 38
- **SHA1:** 7e488e563fa1c74582994775a39f10124eb77314
- **Partes lidas:** 1-38
- **Propósito:** Textos do mapa de comportamento gerado (MEC-06), os mesmos para o gerador e para o detector: chaves em ordem fixa, sem data e sem caminho absoluto.
- **Âncora:** `tools/map/behavior.ts:7` `import { gestureTable, IGNORED_ON_PURPOSE, ignoredOf, mermaidOf } from './gesture-table.ts';`

### `tools/map/generate.ts`
- **Lote:** L23
- **Linhas:** 21
- **SHA1:** 1b77b2d9d15873b56192167316698c9dc0aa80fe
- **Partes lidas:** 1-21
- **Propósito:** Gerador do mapa de comportamento (MEC-06): grava manifest/generated/behavior.json e behavior.md carregando a tabela por um servidor do Vite em modo middleware.
- **Âncora:** `tools/map/generate.ts:8` `import fs from 'node:fs';`

### `tools/map/gesture-table.ts`
- **Lote:** L23
- **Linhas:** 70
- **SHA1:** 05eff3d2f9fcbe182ceec5a7b3bdf425e1197ac2
- **Partes lidas:** 1-70
- **Propósito:** Tabela de transições da máquina de gestos executada a partir do código (MEC-06), com as combinações ignoradas de propósito e o motivo de cada uma, e o diagrama Mermaid.
- **Âncora:** `tools/map/gesture-table.ts:7` `import { DRAG_THRESHOLD, IDLE, step, type Machine, type MachineEvent, type Press } from '../../src/editor/input/pointer/machine.ts';`

### `tools/modules/removal.ts`
- **Lote:** L22a
- **Linhas:** 108
- **SHA1:** 7f2c2e98f6ebec6902184bc4f44abc3b1ace7b96
- **Partes lidas:** 1-108
- **Propósito:** Prova de remoção de um módulo: copia o projeto, retira tudo do módulo e exige que a cópia ainda gere, passe o verificador do manifesto, o typecheck e o build.
- **Âncora:** `tools/modules/removal.ts:11` `if (id === undefined || !/^[a-z-]+$/.test(id)) throw new Error('usage: node tools/modules/removal.ts <module-id>');`

### `tools/perf/layout-pointer.ts`
- **Lote:** L22a
- **Linhas:** 91
- **SHA1:** 93bebad1058a3341c6089ee23f21edea07bd0d8c
- **Partes lidas:** 1-91
- **Propósito:** Mede no Chrome instalado o orçamento de ponteiro do Layout Composer durante um traço sobre quinze regiões e falha quando o percentil 95 passa de 16 ms.
- **Âncora:** `tools/perf/layout-pointer.ts:11` `const BUDGET_MS = 16;`

### `tools/perf/metrics.test.ts`
- **Lote:** L22a
- **Linhas:** 19
- **SHA1:** 4c20a47b5f1d70e2a8f623c14a4f4a4f66fba43c
- **Partes lidas:** 1-19
- **Propósito:** Testa o resumo de percentuais e o veredito de orçamento das medições de desempenho, inclusive amostras ausentes e inválidas.
- **Âncora:** `tools/perf/metrics.test.ts:2` `import { summarize, budgetResult } from './metrics.ts';`

### `tools/perf/metrics.ts`
- **Lote:** L22a
- **Linhas:** 32
- **SHA1:** 24084334a5dd6d213bf51a4c1f1296e0dea21ab3
- **Partes lidas:** 1-32
- **Propósito:** Resume amostras de tempo por percentuais e decide o veredito contra um alvo, além dos tipos das amostras e da corrida de desempenho.
- **Âncora:** `tools/perf/metrics.ts:2` `export interface Summary { readonly n: number; readonly p50: number | null; readonly p95: number | null; readonly max: number | null }`

### `tools/perf/probe.ts`
- **Lote:** L22a
- **Linhas:** 59
- **SHA1:** 1a91ae82682fdb073ec570f004dc8e934aa8e413
- **Partes lidas:** 1-59
- **Propósito:** Instrumenta o navegador para medir eventos confiáveis de ponteiro e teclado até o segundo quadro, com o Event Timing como dado suplementar, sem alterar o editor.
- **Âncora:** `tools/perf/probe.ts:12` `export function installPerformanceProbe(): void {`

### `tools/perf/run.ts`
- **Lote:** L22a
- **Linhas:** 80
- **SHA1:** cd4a5094b8ab41c5e7ce6934e0ed2d5c8c1fab1f
- **Partes lidas:** 1-80
- **Propósito:** Corrida de medição de desempenho no Chrome: coleta execuções, resume por fase, grava o relatório em HTML e PNG e, com a opção de exigir, falha quando o alvo não é atingido.
- **Âncora:** `tools/perf/run.ts:28` `if (!Number.isInteger(runs) || runs < 1 || runs > 20) throw new Error('--runs must be an integer from 1 to 20');`

### `tools/runner/balance.test.ts`
- **Lote:** L22a
- **Linhas:** 112
- **SHA1:** 7e3dfb225f17b6d7eb7e4c93ad3864dc68fa4b0e
- **Partes lidas:** 1-112
- **Propósito:** Testa o equilíbrio entre os dois executores de cenários: quando uma corrida de navegador fica de fora, quando desfaz e refaz e quando recarrega.
- **Âncora:** `tools/runner/balance.test.ts:7` `const plain = { render: { computed: [], geometry: [] }, editor: null, persistence: null, export: null };`

### `tools/runner/balance.ts`
- **Lote:** L22a
- **Linhas:** 162
- **SHA1:** c1f58c3685bd563ac1540ec5341cc2a3cad8e465
- **Partes lidas:** 1-162
- **Propósito:** Decide o que o executor de navegador faz de cada cenário provado pelo executor rápido — deixar de fora, desfazer e refazer, recarregar — gravando e lendo o registro com a impressão das entradas.
- **Âncora:** `tools/runner/balance.ts:24` `export const PROVEN_HEADLESS = 'proven-headless';`

### `tools/runner/clock.ts`
- **Lote:** L22a
- **Linhas:** 40
- **SHA1:** 6e7b66b6b0da5a8d250b5d0210af13bd0b25bb54
- **Partes lidas:** 1-40
- **Propósito:** Controla o tempo da página nos testes de navegador com o relógio do Playwright, com espera por dois quadros e pausa que anda só pelo relógio da página.
- **Âncora:** `tools/runner/clock.ts:13` `export const nextFrames = (page: Page): Promise<void> => page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));`

### `tools/runner/companion.ts`
- **Lote:** L22a
- **Linhas:** 59
- **SHA1:** a37360e292c46d9fd72bcf0e57c298de21ceb1f0
- **Partes lidas:** 1-59
- **Propósito:** Sobe um Companion local para os cenários do assistente, com um modelo que responde na hora ou fica preso até o editor parar o turno.
- **Âncora:** `tools/runner/companion.ts:10` `export const COMPANION_KEY = 'test-only-not-a-service-key';`

### `tools/runner/contracts.ts`
- **Lote:** L23
- **Linhas:** 74
- **SHA1:** f08daca55a63571b90c51d6aade978991c685e5d
- **Partes lidas:** 1-74
- **Propósito:** Contrato de cada campo de valor (MEC-05): o codec declarado e se está registrado, unidades e palavras-chave oferecidas, portas que o escrevem, se style.set o alcança, se é estruturado, os fatores de passo e as chaves de recusa dos comandos de campo.
- **Âncora:** `tools/runner/contracts.ts:7` `import { codecOf } from '../../src/core/style/codecs.ts';`

### `tools/runner/css-lexer-port.ts`
- **Lote:** L23
- **Linhas:** 11
- **SHA1:** 8fe8306e7ec63710c6b22fddf0889af589894d11
- **Partes lidas:** 1-11
- **Propósito:** Porta css de teste (MEC-05): responde pelo lexer do css-tree montado em src/manifest/css.ts, no lugar de anyCss, para que as verificações sem navegador recusem o que o navegador recusaria.
- **Âncora:** `tools/runner/css-lexer-port.ts:6` `import type { CssSupport } from '../../src/core/ports/css.ts';`

### `tools/runner/environment.ts`
- **Lote:** L22a
- **Linhas:** 25
- **SHA1:** be36114d81c69941be4bbe8bb93530285d697242
- **Partes lidas:** 1-25
- **Propósito:** Lê do manifesto o canal de navegador, a redução de movimento e a primeira janela que os testes de navegador usam.
- **Âncora:** `tools/runner/environment.ts:18` `export const CHANNEL = environment.browser.channel;`

### `tools/runner/fuzz.test.ts`
- **Lote:** L22a
- **Linhas:** 129
- **SHA1:** 6c20be98d755574c6ae64998938f83c9a51ed9fd
- **Partes lidas:** 1-129
- **Propósito:** Fuzz de falhas silenciosas: cada comando de texto, por cada porta, em cada fixture e seleção, com textos que uma pessoa digitaria, exigindo documento válido, nenhuma mudança ou recusa com palavras.
- **Âncora:** `tools/runner/fuzz.test.ts:36` `// the arguments a person types`

### `tools/runner/headless.test.ts`
- **Lote:** L22a
- **Linhas:** 381
- **SHA1:** dbdb6975008096ac7096336d42334dd46cd6200f
- **Partes lidas:** 1-381
- **Propósito:** Executor rápido dos cenários: roda a lógica de cada passo e seus terminais na store do editor, sem navegador, deixando ao executor de navegador o que só ele prova.
- **Âncora:** `tools/runner/headless.test.ts:335` `const RUNNABLE = FEATURES.filter((f) => isFeatureBuilt(f.id as FeatureId));`

### `tools/runner/invariants.test.ts`
- **Lote:** L22a
- **Linhas:** 250
- **SHA1:** 688854df6e40666cba4d044a89815b8a2d75ce68
- **Partes lidas:** 1-250
- **Propósito:** Sonda de invariantes: sequências aleatórias de comandos e argumentos ruins não podem quebrar o modelo, nem recusar sem palavras, nem alterar o documento.
- **Âncora:** `tools/runner/invariants.test.ts:162` `{ seed: 20261002, numRuns: 200 },`

### `tools/runner/layout-composer.ts`
- **Lote:** L22a
- **Linhas:** 81
- **SHA1:** ce48237656feb71f183ed9f1051f661f3e835438
- **Partes lidas:** 1-81
- **Propósito:** Dirige as portas do Layout Composer como uma pessoa: traço com o botão preso, alça arrastada e região clicada, levando cada ponto do contêiner para a tela pela caixa desenhada.
- **Âncora:** `tools/runner/layout-composer.ts:21` `export const LAYOUT_GESTURES: readonly string[] = ['layout-stroke', 'layout-handle', 'layout-click'];`

### `tools/runner/model/fields.test.ts`
- **Lote:** L23
- **Linhas:** 118
- **SHA1:** d0410699af8143c943737d9f885b680d5ff48264
- **Partes lidas:** 1-118
- **Propósito:** Grupo fields do modelo (MEC-05): codec registrado, ida e volta, gramática pelo lexer, número preservado, aceitação, vírgula decimal, passo pelos fatores do manifesto e recusas com palavras nos dois catálogos.
- **Âncora:** `tools/runner/model/fields.test.ts:13` `import fs from 'node:fs';`

### `tools/runner/model/harness.ts`
- **Lote:** L23
- **Linhas:** 590
- **SHA1:** 24a8890921f0629d9693e7c50985d3d33f8a471a
- **Partes lidas:** 1-590
- **Propósito:** Núcleo do modelo da store e do histórico (MEC-01): o sistema real sobre a fixture, o modelo da pilha de entradas, as conferências depois de cada passo e os passos comuns (desfazer, refazer, digitar, toque, troca de contexto, gesto, carga de projeto).
- **Âncora:** `tools/runner/model/harness.ts:21` `import fs from 'node:fs';`

### `tools/runner/model/history.test.ts`
- **Lote:** L23
- **Linhas:** 52
- **SHA1:** f3d4bc9d72754427415f6e8963d04cd85a54abe6
- **Partes lidas:** 1-52
- **Propósito:** Grupo do modelo para o histórico e a seleção (MEC-01): seleções, rajadas de seta com esperas na janela de fusão e o vaivém que reproduz o DEF-0508.
- **Âncora:** `tools/runner/model/history.test.ts:5` `import fc from 'fast-check';`

### `tools/runner/model/inventory.test.ts`
- **Lote:** L23
- **Linhas:** 30
- **SHA1:** 8aa45187d3c972e3ef751c9e0489988418594ff5
- **Partes lidas:** 1-30
- **Propósito:** Grupo inventory dos detectores (MEC-08): o inventário em disco é o que o gerador escreve agora, todo elemento interativo tem dono e toda exceção ainda nomeia um elemento sem dono; lê o código com o trecho do mutante trocado (M43).
- **Âncora:** `tools/runner/model/inventory.test.ts:6` `import fs from 'node:fs';`

### `tools/runner/model/lifetime.test.ts`
- **Lote:** L23
- **Linhas:** 67
- **SHA1:** a18a13d76e4e60fa3b5e35c074119f46f39c2c7b
- **Partes lidas:** 1-67
- **Propósito:** Grupo lifetime do modelo (MEC-07): cada rotina que agenda quadros ou timers, parada no meio, não deixa nada agendado e não roda o que esperava; hoje o boot de teste desenhado (DEF-0001).
- **Âncora:** `tools/runner/model/lifetime.test.ts:6` `import { describe, expect, it } from 'vitest';`

### `tools/runner/model/lint.test.ts`
- **Lote:** L23
- **Linhas:** 32
- **SHA1:** 0abf42f7bb8f513542c888991751c0924a6c2be8
- **Partes lidas:** 1-32
- **Propósito:** Grupo lint dos detectores (MEC-09): passa o arquivo do mutante sob execução, com o trecho trocado, pelo ESLint do projeto e falha quando o texto mutado recebe erro que o arquivo em disco não recebe (M44, M45).
- **Âncora:** `tools/runner/model/lint.test.ts:5` `import fs from 'node:fs';`

### `tools/runner/model/machine.test.ts`
- **Lote:** L23
- **Linhas:** 38
- **SHA1:** ceb4ed214f10410e1ed394bdfb170ba1c2bacbd2
- **Partes lidas:** 1-38
- **Propósito:** Grupo machine do modelo (MEC-06): a tabela gravada é a que o código dá, toda combinação ignorada tem motivo declarado e o segundo toque do mesmo ponteiro com o gesto aberto reinicia o gesto (DCS-013).
- **Âncora:** `tools/runner/model/machine.test.ts:6` `import fs from 'node:fs';`

### `tools/runner/model/modes.test.ts`
- **Lote:** L23
- **Linhas:** 116
- **SHA1:** 978e0b31519b03e8ddaf5a747c0263b8d81eb90f
- **Partes lidas:** 1-116
- **Propósito:** Grupo modes dos detectores (MEC-10): com um gesto do ponteiro aberto, cada atalho do manifesto passa pelo mapa de teclas real e nenhum modo recusado abre nem nenhuma tecla lança; o mesmo em sequências aleatórias com gestos abertos e fechados (M46).
- **Âncora:** `tools/runner/model/modes.test.ts:7` `import fc from 'fast-check';`

### `tools/runner/model/pages.test.ts`
- **Lote:** L23
- **Linhas:** 26
- **SHA1:** d891a3300828f57ba0e21919c2595148d8e6f076
- **Partes lidas:** 1-26
- **Propósito:** Grupo do modelo para páginas e abertura de projeto (MEC-01): páginas acrescentadas, renomeadas, duplicadas, apagadas e trocadas, e project.open e project.newBlankPage, que esvaziam o histórico.
- **Âncora:** `tools/runner/model/pages.test.ts:6` `import fc from 'fast-check';`

### `tools/runner/model/structure.test.ts`
- **Lote:** L23
- **Linhas:** 70
- **SHA1:** 2b9b907424a94d869dcf97f64962e7c976382c55
- **Partes lidas:** 1-70
- **Propósito:** Grupo do modelo para a estrutura (MEC-01) e a integridade do documento: inserir, apagar, duplicar, mover, envolver, renomear e ocultar; ids repetidos recusados e patch além do fim recusado.
- **Âncora:** `tools/runner/model/structure.test.ts:7` `import fc from 'fast-check';`

### `tools/runner/model/style.test.ts`
- **Lote:** L23
- **Linhas:** 66
- **SHA1:** 97e728113a0de5b6f1c9bb0c7ef28669fa930639
- **Partes lidas:** 1-66
- **Propósito:** Grupo do modelo para os comandos de estilo (MEC-01): escrita de valor, passo de campo e rajadas, unidade, espaçamento e redefinir, com digitação e troca de breakpoint e estado gravando no contexto pedido.
- **Âncora:** `tools/runner/model/style.test.ts:6` `import fc from 'fast-check';`

### `tools/runner/model/text.test.ts`
- **Lote:** L23
- **Linhas:** 29
- **SHA1:** 87e55385cd993d06c2bda3f39a879d124be765e4
- **Partes lidas:** 1-29
- **Propósito:** Grupo do modelo para o texto (MEC-01): text.set nos elementos de texto com a digitação de um campo pendente em volta.
- **Âncora:** `tools/runner/model/text.test.ts:5` `import fc from 'fast-check';`

### `tools/runner/model/vitest.config.ts`
- **Lote:** L23
- **Linhas:** 20
- **SHA1:** 2f0e69217a5efaf2554c1687dff6f36a545b0925
- **Partes lidas:** 1-20
- **Propósito:** Configuração das corridas do modelo e do catálogo de mutantes: a mesma preparação dos testes unitários, o plugin do mutante escolhido e nenhum cache de módulos.
- **Âncora:** `tools/runner/model/vitest.config.ts:5` `import { defineConfig } from 'vitest/config';`

### `tools/runner/mutants-run.ts`
- **Lote:** L23
- **Linhas:** 125
- **SHA1:** 5c1713c59f17e80b059561126ab4021f84d1737a
- **Partes lidas:** 1-125
- **Propósito:** Corrida do catálogo de mutantes (MEC-02): linha de base, um processo do Vitest por mutante, quatro em paralelo com prioridade baixa, taxa de acusação e falha para sobrevivente sem motivo ou troca não carregada.
- **Âncora:** `tools/runner/mutants-run.ts:8` `import { spawn } from 'node:child_process';`

### `tools/runner/mutants.ts`
- **Lote:** L23
- **Linhas:** 136
- **SHA1:** 342a66e352de0969a41960c93bc68d09a1a65472
- **Partes lidas:** 1-136
- **Propósito:** Catálogo de mutantes plantados (MEC-02), cada um com o trecho trocado, a regra que quebra, a origem e os detectores que o alcançam, e o plugin do Vite que faz a troca na carga do módulo.
- **Âncora:** `tools/runner/mutants.ts:9` `import fs from 'node:fs';`

### `tools/runner/order.test.ts`
- **Lote:** L22a
- **Linhas:** 63
- **SHA1:** 86bec3fb4c223bde7b3593ea2c70f857466b2ccb
- **Partes lidas:** 1-63
- **Propósito:** Testa a ordem das declarações dos testes de navegador: leitura da variável de ambiente, embaralhamento com semente e inversão por escopo.
- **Âncora:** `tools/runner/order.test.ts:2` `import { arrange, ordered, orderOf } from './order.ts';`

### `tools/runner/order.ts`
- **Lote:** L22a
- **Linhas:** 114
- **SHA1:** 4f5b21e59f33843743efe3ea795732dbf9cb129d
- **Partes lidas:** 1-114
- **Propósito:** Muda a ordem das declarações dos testes de navegador (inversão ou embaralhamento com semente) para a checagem de independência.
- **Âncora:** `tools/runner/order.ts:15` `export type Order = { readonly kind: 'declared' } | { readonly kind: 'reverse' } | { readonly kind: 'shuffle'; readonly seed: number };`

### `tools/runner/production-probe.ts`
- **Lote:** L23
- **Linhas:** 33
- **SHA1:** f67039467b8075e0c7fddf7ce76ee1470912994e
- **Partes lidas:** 1-33
- **Propósito:** Prova P5 (MEC-03): constrói o app em memória com import.meta.env.DEV falso e verdadeiro e confere que a marca das regras de desenvolvimento falta no primeiro e aparece no segundo.
- **Âncora:** `tools/runner/production-probe.ts:7` `import { performance } from 'node:perf_hooks';`

### `tools/runner/refusals.test.ts`
- **Lote:** L22a
- **Linhas:** 59
- **SHA1:** 5a51a44f48efd14e7da631dc5be8c7fd4dc731cb
- **Partes lidas:** 1-59
- **Propósito:** Testa que toda recusa dita por um predicado de disponibilidade é declarada pelos comandos que nomeiam esse predicado.
- **Âncora:** `tools/runner/refusals.test.ts:17` `const FIXTURES = ['aurora', 'catalog', 'content-site-shared', 'form-controls', 'motion'];`

### `tools/runner/run-inputs.test.ts`
- **Lote:** L22a
- **Linhas:** 45
- **SHA1:** cd5c8e31b17e24d2b8a0243b97335cf09c687cd4
- **Partes lidas:** 1-45
- **Propósito:** Testa a lista das entradas de uma corrida: todo caminho da raiz é colocado, e a impressão muda só quando uma entrada muda.
- **Âncora:** `tools/runner/run-inputs.test.ts:7` `import { NOT_INPUTS, OUTPUTS, RUN_INPUTS, changedBetween, inputHashes, inputsFingerprint } from './run-inputs.ts';`

### `tools/runner/run-inputs.ts`
- **Lote:** L22a
- **Linhas:** 84
- **SHA1:** 746234fe44697e88719d0d5a63896cccb13d0d2c
- **Partes lidas:** 1-84
- **Propósito:** Lista o que uma corrida de testes usa, lê do disco os arquivos e seus hashes e calcula a impressão das entradas.
- **Âncora:** `tools/runner/run-inputs.ts:37` `export const OUTPUTS: ReadonlySet<string> = new Set(['node_modules', 'dist', '.cache', '.playwright-mcp', 'test-results', 'playwright-report', 'coverage']);`

### `tools/runner/scenarios.ts`
- **Lote:** L22a
- **Linhas:** 2225
- **SHA1:** f3323d94e5956629f6c88025b2c37655b207cd10
- **Partes lidas:** 1-655; 656-1281; 1282-1868; 1869-2225
- **Propósito:** Executor de cenários do manifesto: um teste do Playwright por cenário e porta, com gestos reais, conferindo documento, seleção, histórico, render, terminal do editor, exportação, persistência e recusas.
- **Âncora:** `tools/runner/scenarios.ts:122` `const DOCUMENT_REPLACING: ReadonlySet<string> = new Set(['project.open', 'project.newBlankPage', 'project.restoreVersion', 'project.openFolder']);`

### `tools/runner/status.ts`
- **Lote:** L22a
- **Linhas:** 53
- **SHA1:** df74ce306061bdbc015dc5952bb1cbbac9cae0f3
- **Partes lidas:** 1-53
- **Propósito:** Relator do Playwright que deriva o status de cada funcionalidade dos resultados dos cenários e falha a corrida quando uma funcionalidade registrada falha ou não pode rodar.
- **Âncora:** `tools/runner/status.ts:10` `export default class StatusReporter implements Reporter {`

### `tools/runner/tooth-plugin.ts`
- **Lote:** L22a
- **Linhas:** 57
- **SHA1:** 5f2887d12ad3a9f54b6284383511b3594ac80bc0
- **Partes lidas:** 1-57
- **Propósito:** Plugin do Vite que desliga uma funcionalidade na prova do dente: torna tratadores de comando e predicados inócuos, ou os métodos do módulo nomeado.
- **Âncora:** `tools/runner/tooth-plugin.ts:25` `export function toothPlugin(): Plugin | null {`

### `tools/runner/tooth.ts`
- **Lote:** L22a
- **Linhas:** 124
- **SHA1:** 186c8d5d68923700a2a804de39defbec02211718
- **Partes lidas:** 1-124
- **Propósito:** Prova do dente: roda os cenários de cada funcionalidade com seus comandos desligados e exige que todo teste falhe numa asserção, imprimindo o resultado bruto.
- **Âncora:** `tools/runner/tooth.ts:16` `const features = FEATURES.filter(runnable).filter((f) => only.length === 0 || only.includes(f.id));`

### `tools/runner/unzip.ts`
- **Lote:** L22a
- **Linhas:** 43
- **SHA1:** 09f39a25255db861c16d6ecc05222c04cc42b646
- **Partes lidas:** 1-43
- **Propósito:** Lê os arquivos de um ZIP como qualquer descompactador, conferindo tamanho e CRC-32 de cada entrada, escrito à parte do gravador do editor.
- **Âncora:** `tools/runner/unzip.ts:7` `export function unzip(bytes: Buffer): Map<string, Buffer> {`

### `tools/test/all.ts`
- **Lote:** L22a
- **Linhas:** 133
- **SHA1:** 6208799b7e5cb64b758b32e4770b1985bbcc7cde
- **Partes lidas:** 1-133
- **Propósito:** Corrida completa dos testes: build, servidor, executor rápido, suíte de navegador, checagens estáticas e testes unitários, gravando as entradas para o seletor de impacto.
- **Âncora:** `tools/test/all.ts:17` `const map = !process.argv.includes('--no-map');`

### `tools/test/independence.ts`
- **Lote:** L22a
- **Linhas:** 164
- **SHA1:** 8dff1765f603cc8e92d26679692dc3a2d4f92b41
- **Partes lidas:** 1-164
- **Propósito:** Checagem de independência dos testes de navegador sob ordens e repetições diferentes: invertida, embaralhada, repetida, um trabalhador e cada teste sozinho.
- **Âncora:** `tools/test/independence.ts:37` `const PORT = '5330';`

### `tools/test/setup-browser.ts`
- **Lote:** L22a
- **Linhas:** 7
- **SHA1:** 687e59cfdcfa0a4cb72776f624285745dabcf821
- **Partes lidas:** 1-7
- **Propósito:** Instala as portas de navegador do núcleo para os testes unitários lerem marcação e imagens como a aplicação lê.
- **Âncora:** `tools/test/setup-browser.ts:4` `import { installBrowserPorts } from '../../src/core/ports/browser.ts';`

### `tools/test/setup-language.ts`
- **Lote:** L22a
- **Linhas:** 5
- **SHA1:** 08f10034ef43eac721f0d455a01cce8c8d30746f
- **Partes lidas:** 1-5
- **Propósito:** Fixa o idioma dos testes unitários em inglês, qualquer que seja o idioma da máquina.
- **Âncora:** `tools/test/setup-language.ts:4` `Object.defineProperty(globalThis.navigator, 'languages', { value: ['en-US'], configurable: true });`

### `tools/test/setup-wiring.ts`
- **Lote:** L22a
- **Linhas:** 5
- **SHA1:** 7cfba507e03dae50a47f32aff5c9c300983ec440
- **Partes lidas:** 1-5
- **Propósito:** Instala nos testes unitários a fiação da aplicação, como o editor a usa.
- **Âncora:** `tools/test/setup-wiring.ts:2` `import { EDITOR_WIRING } from '../../src/app/wiring.ts';`

### `tools/ui/drive.ts`
- **Lote:** L22a
- **Linhas:** 108
- **SHA1:** 4ed89f5e5d539979b71087d9991a2387b120d1db
- **Partes lidas:** 1-108
- **Propósito:** Motor da interface: comanda o aplicativo real no Chrome com gestos reais, fotografa cada passo e falha com erro de console, incidente ou expectativa não cumprida.
- **Âncora:** `tools/ui/drive.ts:22` `const port = process.env.PORT ?? '5320';`

### `tools/ui/flows.ts`
- **Lote:** L22a
- **Linhas:** 990
- **SHA1:** 9eb4970b5b93a0b8bf5675387620430e486045f5
- **Partes lidas:** 1-895; 896-990
- **Propósito:** Lista os fluxos do motor da interface: caminhos dourados com portas, gestos, digitação, fotos e expectativas lidas pela porta de teste.
- **Âncora:** `tools/ui/flows.ts:57` `export interface Flow {`

### `tools/ui/play.ts`
- **Lote:** L22a
- **Linhas:** 281
- **SHA1:** df5a619c3260e2d3923087214492bf9eedb2f6c6
- **Partes lidas:** 1-281
- **Propósito:** Toca um fluxo numa página do editor já aberta com gestos reais, lê o que aconteceu pela porta de teste e responde os problemas encontrados.
- **Âncora:** `tools/ui/play.ts:242` `export async function playFlow(page: Page, flow: Flow, options: PlayOptions = {}): Promise<readonly string[]> {`

### `tsconfig.app.json`
- **Lote:** L22b
- **Linhas:** 25
- **SHA1:** b77f25533e57facaf9d55d68aef9ba15126f8e34
- **Partes lidas:** 1-25
- **Propósito:** as opções do compilador para o código da aplicação em `src`, com os tipos do Vite e as travas de tipo estritas.
- **Âncora:** `tsconfig.app.json:9` `"strict": true,`

### `tsconfig.core.json`
- **Lote:** L22b
- **Linhas:** 10
- **SHA1:** 32d2674b6f89d88cf6e5cae4dca33dcefcfab305
- **Partes lidas:** 1-10
- **Propósito:** o projeto que compila o núcleo sem o DOM, provando que ele não toca no navegador.
- **Âncora:** `tsconfig.core.json:7` `"files": ["node_modules/vite/types/importMeta.d.ts"],`

### `tsconfig.json`
- **Lote:** L22b
- **Linhas:** 4
- **SHA1:** 35c386719365850d2b4881eed38e368ae369d24e
- **Partes lidas:** 1-4
- **Propósito:** a raiz das referências de projeto, sem arquivos próprios.
- **Âncora:** `tsconfig.json:3` `"references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]`

### `tsconfig.node.json`
- **Lote:** L22b
- **Linhas:** 24
- **SHA1:** 8bc258322712edff230dfc0dfd037b57554f30e4
- **Partes lidas:** 1-24
- **Propósito:** as opções do compilador para as ferramentas, os testes e a extensão, com os tipos do Node.
- **Âncora:** `tsconfig.node.json:22` `"include": ["vite.config.ts", "vitest.config.ts", "playwright.config.ts", "tests", "tools", "companion/extension/src"],`

### `vite.config.ts`
- **Lote:** L22b
- **Linhas:** 102
- **SHA1:** 86622fdb91143764dd20b812dae0efba32a1435c
- **Partes lidas:** 1-102
- **Propósito:** a configuração do Vite: os plugins do título, da recarga inteira e do proof do dente, a definição da porta de teste, o servidor e a saída do build e2e.
- **Âncora:** `vite.config.ts:81` `export default defineConfig(({ command, mode }) => {`

### `vite.proofs.config.ts`
- **Lote:** L22b
- **Linhas:** 17
- **SHA1:** c73f8bd9b8beca69279157ef13728725982411e9
- **Partes lidas:** 1-17
- **Propósito:** o build do módulo de apoio da suíte e2e, servido ao lado do app na mesma pasta.
- **Âncora:** `vite.proofs.config.ts:7` `export default defineConfig({`

### `vitest.config.ts`
- **Lote:** L22b
- **Linhas:** 40
- **SHA1:** 1eaf8cb215aaf5d59f2be48701220017e1558b9c
- **Partes lidas:** 1-40
- **Propósito:** a configuração dos testes de unidade: o módulo sem cache para os arquivos lidos por glob, os arquivos de preparação, os limites de cobertura e os excluídos.
- **Âncora:** `vitest.config.ts:3` `export default defineConfig({`
