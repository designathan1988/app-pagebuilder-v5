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
