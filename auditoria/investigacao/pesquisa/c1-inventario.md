# C1 — Inventário dinâmico: pesquisa

Data de acesso de todas as fontes: 2026-10-08. Convenção do arquivo: a seção "Fatos documentados" registra o que a página aberta afirma, com a versão a que ela se refere. A seção "Avaliação" é opinião do pesquisador e vem separada. Quando uma página aberta não cobriu um ponto, o texto diz "não coberto pela página" e o ponto não é afirmado.

Versões do projeto consideradas: React 19.3.0, TypeScript 6.0.3, Vite 8.3.0, Vitest 5.0.1, @playwright/test 1.63.0, zod 4.6.5, css-tree 3.2.1, fast-check 4.10.2, happy-dom 20.14.5, Windows.

Nenhuma medição de custo foi feita neste projeto. Onde o texto fala de custo, ele cita número publicado pela fonte ou declara que o custo no projeto não está medido.

---

## 1. Fontes abertas

### 1.1 TypeScript e compilador

**F1. Announcing TypeScript 7.0** — https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/ — publicado em 2026-07-08 (data da listagem do blog); conteúdo refere-se a TypeScript 7.0.
- O pacote `typescript` do npm instala o binário `tsc` do compilador nativo (escrito em Go). Os builds noturnos antes saíam como `@typescript/native-preview` e voltam sob `typescript@next`.
- A versão 7.0 não traz API programática. A página diz que a 7.1 deve trazer uma API nova e diferente da atual. A página não cita `createProgram` nem `TypeChecker`.
- Ferramentas que embutem o TypeScript (Volar para Vue, Astro, Svelte, MDX) permanecem na 6.0.
- Pacote de compatibilidade `@typescript/typescript6`: fornece o executável `tsc6` e reexporta a API da 6.0. Para ferramentas que importam `typescript` por peer dependency, a página recomenda alias de npm: `"typescript": "npm:@typescript/typescript6@^6.0.2"` e `"@typescript/native": "npm:typescript@^7.0.2"` para o binário `tsc`.
- Novos padrões: `strict` ligado, `module` igual a `esnext`, `rootDir` igual a `./`, `types` igual a `[]`. Opções obsoletas na 6.0 viram erro (`target: es5`, `baseUrl`, `moduleResolution: node`, `downlevelIteration`).
- Desempenho publicado (6 para 7, padrão): vscode 125,7 s para 10,6 s; tldraw 11,2 s para 1,46 s. Os números são de build completo, não de uso da API.
- A página não menciona ts-morph.

**F2. Announcing TypeScript 6.0** — https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ — a listagem do blog dá 2026-03-06 e o corpo da página, na leitura feita, dá 2026-03-23; as duas datas divergem e nenhuma foi confirmada em outra fonte.
- A 6.0 "continua compatível em API com a 5.9" e é a última versão baseada na base de código JavaScript. É a ponte entre a 5.9 e a 7.0.
- Padrões mudados: `strict` verdadeiro, `module` `esnext`, `target` o ES mais recente (es2025), `noUncheckedSideEffectImports` verdadeiro, `types` igual a `[]`, `rootDir` igual ao diretório do tsconfig.
- Removidos na 6.0: `--moduleResolution classic` e `--outFile`. Passar arquivos na linha de comando com tsconfig presente é erro sem `--ignoreConfig`.

**F3. Wiki "Using the Compiler API"** — https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API — a página afirma descrever "TypeScript 6.0 e anteriores" e que "TypeScript 7.1 terá uma API completamente diferente".
- `ts.createProgram(fileNames, options)` cria o Program; `program.getTypeChecker()` devolve o verificador; `ts.getPreEmitDiagnostics(program)` coleta erros.
- Verificador: `getSymbolAtLocation(node)`, `getTypeAtLocation(node)`, `getTypeOfSymbolAtLocation(symbol, node)`, `typeToString(type)`.
- `ts.createSourceFile(fileName, text, ScriptTarget, setParentNodes)` analisa um arquivo sem Program. `ts.forEachChild(node, visitor)` percorre filhos.
- Exemplo de gerador de documentação: itera `program.getSourceFiles()`, ignora arquivos de declaração, acha classes exportadas com `forEachChild` e serializa nome, tipo e JSDoc em `classes.json`.
- `ts.createLanguageService(host, ts.createDocumentRegistry())` cria serviço incremental; o host fornece `getScriptFileNames`, `getScriptVersion`, `getScriptSnapshot`.

**F4. README do repositório microsoft/typescript-go** — https://github.com/microsoft/typescript-go — conteúdo da leitura de 2026-10-08.
- O repositório está encerrado: o README diz que o porte para a 7.0 está concluído, que o desenvolvimento continua em microsoft/TypeScript e que este repositório será arquivado em definitivo em setembro de 2026.
- Concluído: criação de Program, análise sintática, tsconfig, verificação de tipos, JSX, emissão de declarações e de JS, modo watch, build com project references.
- Parcial: serviço de linguagem (LSP).
- Não suportado: a API está "não pronta".
- Para a 7.0 RC e posteriores o comando é `tsc`; a prévia no npm era `@typescript/native-preview` com `npx tsgo`.

**F5. npm: typescript latest** — https://registry.npmjs.org/typescript/latest — versão 7.0.2.
- Sem campo `main`; o export `"."` aponta para `./lib/version.cjs`; os demais exports são subcaminhos `./unstable/*`. O binário é `tsc`. O manifesto não lista `lib/typescript.js`.

### 1.2 ts-morph

**F6. Releases do ts-morph** — https://github.com/dsherret/ts-morph/releases — leitura de 2026-10-08.
- ts-morph 28.0.0 (12 de abril, a página não mostra o ano) é o mais recente e atualiza para TypeScript 6.0, marcado como mudança incompatível. A 27.0.0 usava TypeScript 5.9; a 26.0.0, 5.8.

**F7. npm: ts-morph latest** — https://registry.npmjs.org/ts-morph/latest — versão 28.0.0; dependências `@ts-morph/common ~0.29.0` e `code-block-writer ^13.0.3`; sem campo `engines`.

**F8. npm: @ts-morph/common 0.29.0** — https://registry.npmjs.org/@ts-morph/common/0.29.0 — devDependency `typescript` fixada em 6.0.2; script de build `bundleLocalTs`. Dependências: minimatch, tinyglobby, path-browserify.
- Fato: `typescript` não aparece nas dependências de runtime do ts-morph. O nome do script de build indica que o compilador é empacotado dentro do `@ts-morph/common`; a página não confirma a versão empacotada.

**F9. Setup do ts-morph** — https://ts-morph.com/setup/ — documentação do ts-morph, versão não indicada na página (a série atual é a 28).
- `new Project({ tsConfigFilePath, skipAddingFilesFromTsConfig, compilerOptions, resolutionHost, libFolderPath })`. Por padrão os arquivos do tsconfig são adicionados. Os `lib.d.ts` são servidos da memória no caminho falso `/node_modules/typescript/lib`.

**F10. Navegação do ts-morph** — https://ts-morph.com/navigation/ — mesma série.
- `node.getChildren()` devolve todos os filhos incluindo tokens; `node.forEachChild(cb)` só os nós-propriedade; `node.forEachDescendant((node, traversal) => ...)` percorre descendentes, com `traversal.skip()`, `traversal.up()`, `traversal.stop()`; retornar valor interrompe e devolve o valor. `Node.isClassDeclaration(child)` é o guarda de tipo.

### 1.3 Playwright e árvore de acessibilidade

**F11. Aria snapshots** — https://playwright.dev/docs/aria-snapshots — documentação corrente de @playwright/test (o índice de release notes aberto lista até a 1.64).
- `expect(page).toMatchAriaSnapshot(template)` e `expect(locator).toMatchAriaSnapshot(template)`; `{ name: 'main.aria.yml' }` grava em arquivo `.aria.yml`. `page.ariaSnapshot()` e `locator.ariaSnapshot()` devolvem YAML em string.
- Sintaxe de nó: `- role "nome" [atributo=valor]`, indentação define aninhamento. Omitir nome ou atributo gera correspondência parcial; nomes aceitam expressão regular `/.../`. `/children` aceita `contain` (padrão), `equal`, `deep-equal`. Comparação sensível a maiúsculas, com espaço normalizado e sensível à ordem. O template é "uma restrição, não necessariamente uma serialização completa da árvore".
- Geração: `npx playwright test --update-snapshots`; modos `default`, `missing`, `changed`, `all`, `none`; `--update-source-method` com `patch`, `3way`, `overwrite`. Snapshots separados ficam em `<arquivo-de-teste>-snapshots`.
- Configuração: `expect.toMatchAriaSnapshot` com `children` e `pathTemplate`.

**F12. API de Locator** — https://playwright.dev/docs/api/class-locator — páginas de API de @playwright/test, série corrente.
- `locator.ariaSnapshot(options?: { boxes?: boolean; depth?: number; mode?: "ai" | "default"; signal?: AbortSignal; timeout?: number }): Promise<string>`; adicionado na v1.49. `depth` e `mode` na v1.59; `boxes` na v1.60 (acrescenta `[box=x,y,width,height]`); `signal` na v1.62. Timeout padrão 0 (sem limite).
- O modo `ai` inclui referências `[ref=e2]` na saída.
- O trecho de `locator.ariaSnapshotJSON` não foi lido nesta fonte (a página tem 203 mil caracteres; a leitura cobriu 0 a 100 mil e 100 mil a 200 mil sem encontrar o corpo da seção).

**F13. API de Page, ariaSnapshotJSON** — https://playwright.dev/docs/api/class-page — série corrente.
- `page.ariaSnapshotJSON(options?)` adicionado na v1.63; opções `boxes`, `depth`, `mode`, `signal`, `timeout`; devolve `Promise<Serializable>`. A página afirma que é a mesma árvore de `page.ariaSnapshot()`, serializada como valor JSON em vez de YAML. Os nomes dos campos dos nós não foram descritos na leitura.

**F14. Release notes do Playwright** — https://playwright.dev/docs/release-notes — o índice vai até a 1.64; leitura cobriu os primeiros 100 mil caracteres.
- 1.64: `page.getByRef()` localiza elemento pela referência `eN` do modo `ai`.
- 1.63: `locator.ariaSnapshotJSON()` e `page.ariaSnapshotJSON()`; a opção `snapshots` de `tracing.start()` e a opção de teste `trace` aceitam objeto que captura aria snapshots; o visualizador de trace ganha modo "Display Aria".
- 1.60: `toMatchAriaSnapshot` aceita Page (equivale a `page.locator('body')`); opção `boxes`.
- 1.59: `page.ariaSnapshot()`; opções `depth` e `mode`.
- 1.57: `page.accessibility` removido (estava obsoleto havia três anos); a nota recomenda ferramenta como Axe.
- 1.56: aria snapshots passam a incluir o `placeholder` de `input`.

**F15. LocatorAssertions** — https://playwright.dev/docs/api/class-locatorassertions — série corrente.
- `toMatchAriaSnapshot(expected, options?)` com template inline, adicionado na v1.49; `toMatchAriaSnapshot(options?)` com `name`, `signal` (v1.62) e `timeout`, forma em arquivo adicionada na v1.50. A expectativa tenta de novo até o timeout.

**F16. CDPSession** — https://playwright.dev/docs/api/class-cdpsession — série corrente.
- `page.context().newCDPSession(page)`; `send(method, params?)` executa método CDP bruto; `on('event')` e `on('close')` adicionados na v1.59; `detach()`.
- A página não afirma que o recurso é exclusivo do Chromium; essa restrição não foi confirmada nesta leitura.

**F17. Protocolo CDP, domínio Accessibility** — https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/browser_protocol.json — esquema do ramo master (tip-of-tree), sem número de versão. A página HTML https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/ só devolveu um redirecionamento e não foi usada.
- O domínio `Accessibility` está marcado `experimental: true`, e os comandos abaixo também.
- `getFullAXTree(depth?: integer, frameId?: Page.FrameId)` devolve `nodes: AXNode[]`. Sem `depth`, devolve a árvore completa; sem `frameId`, usa o frame raiz.
- `getPartialAXTree(nodeId?, backendNodeId?, objectId?, fetchRelatives?)`; `queryAXTree(nodeId?, backendNodeId?, objectId?, accessibleName?, role?)` busca por nome calculado e/ou papel, incluindo nós ignorados.
- `AXNode`: `nodeId`, `ignored`, `ignoredReasons?`, `role?`, `chromeRole?`, `name?`, `description?`, `value?`, `properties?`, `parentId?`, `childIds?`, `backendDOMNodeId?`, `frameId?`.

### 1.4 Análise de dependências, código morto, API

**F18. npm: dependency-cruiser latest** — https://registry.npmjs.org/dependency-cruiser/latest — versão 18.5.0.
- `engines.node`: `^22||^24||>=26`. `supportedTranspilers`: typescript `>=2.0.0 <7.0.0`, swc `>=1.0.0 <2.0.0`, babel `>=7.0.0 <8.0.0`. Sem dependência de runtime em typescript (o compilador é usado quando existe no projeto); devDependency `typescript ^6.0.3`.

**F19. README do dependency-cruiser** — https://github.com/sverweij/dependency-cruiser — versão não indicada na página.
- Lê JavaScript, TypeScript, CoffeeScript, LiveScript; ES6, CommonJS, AMD; `.jsx`, `.tsx`, `.vue`, `.svelte`. Reporters citados: err, dot, html, csv, mermaid, json, texto.

**F20. Referência de regras do dependency-cruiser** — https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/rules-reference.md — ramo main (série 18).
- Seções `forbidden`, `allowed`, `required`, `extends`, `options`. Regra tem `from` e `to`; `name` e `severity` (`error`, `warn`, `info`, `ignore`) só em `forbidden`; só `error` produz saída de código não zero no reporter `err`.
- `path`/`pathNot` são expressões regulares, com grupos reutilizáveis como `$1` em `to`.
- `orphan: true` em `from` casa módulos sem dependências de entrada nem de saída. A página avisa que órfãos raramente aparecem ao analisar um único arquivo de entrada e orienta passar pastas inteiras.
- `reachable` em `to`: `true` casa módulos alcançáveis a partir de `from`; `false` encontra módulos inalcançáveis, indicado para achar código morto. Regras com `reachable` aceitam só `path` e `pathNot` ao lado.
- `required`: usa `module` em vez de `from`, e `to` descreve a dependência obrigatória; `reachable: true` permite dependência indireta.
- Outras condições: `couldNotResolve`, `circular` (com `via`, `viaOnly`), `dependencyTypes`, `dynamic`, `preCompilationOnly`, `numberOfDependentsLessThan`/`MoreThan`.

**F21. Formato de saída do dependency-cruiser** — https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/output-format.md — ramo main.
- JSON: `modules` (cada um com `source`, `dependencies`, `followable`, `coreModule`, `couldNotResolve`, `dependencyTypes`), `summary` (`violations`, `error`, `warn`, `info`, `totalCruised`, `optionsUsed`) e `folders` opcional. Cada dependência traz `resolved`, `module`, `moduleSystem`, `valid`, `circular`. A página não descreve o campo de órfão nem versão.

**F22. Opções do dependency-cruiser** — https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/options-reference.md — ramo main.
- `doNotFollow`, `includeOnly`, `exclude`, `tsConfig`, `tsPreCompilationDeps` (padrão `false`; `"specify"` distingue dependências pré e pós compilação), `enhancedResolveOptions`, `metrics`, `reporterOptions`, `cache` (disponível desde a 11.14.0; pasta `node_modules/.cache/dependency-cruiser`, estratégia `metadata`), `detectJSDocImports` (ligar faz o parser `tsc` ser usado), `skipAnalysisNotInRules` (padrão `false`; `true` pula análise de ciclo, dependentes e órfãos que nenhuma regra usa).

**F23. CLI do dependency-cruiser** — https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/doc/cli.md — ramo main.
- `--output-type`/`-T`: `err` (padrão), `err-long`, `dot`, `mermaid`, `d2`, `html`, `markdown`, `csv`, `text`, `json`, `anon`, `metrics`, `baseline`, `null`.
- `--init` cria configuração com `no-circular`, `no-orphans`, `not-to-unresolvable`. `--cache` e `--cache-strategy` (`metadata` usa git; `content` para clones rasos). `--ignore-known` ignora violações listadas em `.dependency-cruiser-known-violations.json`. `--baseline` cria ou atualiza esse arquivo e informa novas, iguais e obsoletas; `--baseline-mode` aceita `full`, `shrink-only`, `format`. Código de saída igual ao número de violações de severidade `error`.

**F24. npm: knip latest** — https://registry.npmjs.org/knip/latest — versão 6.40.0; `engines.node`: `^20.19.0 || >=22.12.0`; dependências incluem `oxc-parser ^0.150.0`, `oxc-resolver 11.24.2`, `zod ^4.4.3`, `get-tsconfig 4.14.3`, `fdir`, `picomatch`, `tinyglobby`. `typescript` aparece só em devDependencies (7.0.2); nenhum peer dependency listado.

**F25. Announcing Knip v6** — https://knip.dev/blog/knip-v6 — Knip 6, anúncio de 2026-03-20 (data da listagem do blog).
- A v6 troca o backend TypeScript por `oxc-parser` (análise) e `oxc-resolver` (resolução). Motivo declarado: as APIs do TypeScript foram desenhadas para IDEs, não para análise estática em passagem única.
- Quebras: Node 18 removido (exige 20.19.0 ou superior); tipo de problema `classMembers` removido porque dependia de `ts.LanguageService`, que a reescrita em Go do TypeScript 7 não vai expor; reporter JSON: problemas sempre em arrays e a propriedade raiz `files` removida; `--include-libs` e `--isolate-workspaces` viraram comportamento padrão.
- Novo tipo `namespaceMembers`.
- Desempenho publicado (v5.88.0 para v6.0.0): astro 4,0 s para 2,0 s; rolldown 3,7 s para 1,7 s; sentry 11,0 s para 4,0 s; TypeScript 3,7 s para 0,9 s.

**F26. Tipos de problema do Knip** — https://knip.dev/reference/issue-types — série 6.
- `files` (arquivo sem referência), `dependencies`, `unlisted`, `binaries`, `unresolved`, `exports`, `types`, `nsExports`, `nsTypes`, `enumMembers`, `namespaceMembers`, `duplicates`, `cycles`, `catalog`, `catalogReferences`. Correção automática existe para a maioria, exceto `cycles`, `nsExports` e `nsTypes`; `cycles`, `nsExports` e `nsTypes` não estão no relatório por padrão.

**F27. Configuração do Knip** — https://knip.dev/reference/configuration e https://knip.dev/overview/configuration — série 6.
- `entry` e `project` (globs; `!` na frente nega; valores de `entry` substituem os padrões, não se mesclam), `ignore`, `ignoreFiles`, `ignoreDependencies`, `ignoreExportsUsedInFile`, `includeEntryExports` (padrão `false`: exports de arquivos de entrada não são reportados por padrão), `ignoreIssues`, `paths`, `workspaces`, `rules`, `include`, `exclude`.
- Plugins são habilitados automaticamente e acrescentam seus arquivos de entrada; Vitest e Playwright constam entre os exemplos da página.
- Padrão de `project` na página de entradas: `**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!`.

**F28. Arquivos de entrada do Knip** — https://knip.dev/explanations/entry-files — série 6.
- Arquivos de entrada são o ponto de partida do grafo de módulos; vêm de locais padrão, dos campos `main`, `bin` e `exports` do `package.json`, de plugins e de importações dinâmicas. Arquivos do projeto nunca alcançados a partir das entradas ficam fora do grafo e são reportados como não usados (a página implica essa regra, não a enuncia literalmente). "Mais arquivos de entrada levam a mais cobertura."

**F29. Modo de produção do Knip** — https://knip.dev/features/production-mode — série 6.
- `knip --production` limita a análise a padrões marcados com `!`, às entradas de produção dos plugins e ao script `start`; exclui arquivos de teste, que mascaram código morto. `--strict` implica produção e verifica dependências por workspace.

**F30. Reporters do Knip** — https://knip.dev/features/reporters — série 6.
- Reporters: `codeclimate`, `codeowners`, `compact`, `cycles`, `disclosure`, `github-actions`, `json`, `markdown`, `sarif`, `symbols` (padrão). JSON em uma linha com chave `issues`; cada elemento é um arquivo com `file`, `owners` e uma chave por tipo (`exports`, `types`, `dependencies`, `unlisted`...), cada item com `name`, `namespace`, `line`, `col`, `pos`. Reporter próprio: função `Reporter` recebendo `ReporterOptions` (`report`, `issues`, `counters`, `cwd`...), executada com `knip --reporter ./meu-reporter.ts`; vários reporters por repetição do argumento.

**F31. npm: @microsoft/api-extractor latest** — https://registry.npmjs.org/@microsoft/api-extractor/latest — versão 7.59.4; Node `>=20.9.0`; dependência `typescript` fixada em 5.9.3.

**F32. Changelog do API Extractor** — https://raw.githubusercontent.com/microsoft/rushstack/HEAD/apps/api-extractor/CHANGELOG.md — leitura de 2026-10-08.
- 7.59.4 em 2026-10-06. A versão 7.58.0 (2026-04-01) atualizou o compilador empacotado para TypeScript 5.9.3. O changelog lido não menciona TypeScript 6.

**F33. Introdução do API Extractor** — https://api-extractor.com/pages/overview/intro/ — série 7.
- Três saídas: relatório de API (traça tudo que o ponto de entrada principal exporta), rollup de `.d.ts` e modelo de documentação em JSON por projeto.

**F34. Configuração do relatório do API Extractor** — https://api-extractor.com/pages/setup/configure_api_report/ — série 7.
- `apiReport.enabled`, `apiReport.reportFolder` (padrão `<projectFolder>/etc/`), arquivo de exemplo `etc/api-extractor.api.md`. O relatório deve ser versionado no git para que mudanças de API apareçam como diff em pull request; o repositório rushstack usa CODEOWNERS para exigir aprovação.
- Mensagens como `ae-forgotten-export` podem ir ao relatório com `addToApiReportFile: true`.

**F35. Execução do API Extractor** — https://api-extractor.com/pages/setup/invoking/ — série 7.
- `api-extractor run --local --verbose` (`localBuild: true` na API programática); `api-extractor init` cria o `api-extractor.json`. `mainEntryPointFilePath` aponta para `.d.ts` (por exemplo `lib/index.d.ts`), e deve coincidir com o campo `typings` do `package.json`; os arquivos TypeScript de origem não são analisados diretamente; exige `declaration: true` (e `declarationMap: true` recomendado).
- A página não explica o que `--local` muda no tratamento do relatório nem o comportamento em CI.

**F36. README do eslint-plugin-jsx-a11y** — https://github.com/jsx-eslint/eslint-plugin-jsx-a11y — versão não indicada na página.
- Regras sobre elementos interativos: `no-static-element-interactions`, `no-noninteractive-element-interactions`, `interactive-supports-focus`, `click-events-have-key-events`. Presets `recommended` e `strict`; flat config em `flatConfigs.recommended`. Configurações `settings.jsx-a11y.components` (mapeia componente próprio a elemento DOM), `polymorphicPropName`. A página afirma que a análise é estática e recomenda complementar com `@axe-core/react` e teste manual.

### 1.5 Registros de componentes e comandos em editores maduros

**F37. GrapesJS, módulo Commands** — https://grapesjs.com/docs/api/commands.html — versão não indicada na página.
- `add(id, command)` (objeto com `run` e opcional `stop`, ou função), `remove(id)`, `extend(id, props)`, `get(id)`, `has(id)`, `getAll()` (objeto com todos os comandos registrados), `run(id, ...)`, `stop(id, ...)`, `isActive(id)`, `getActive()`. Eventos `command:run`, `command:run:ID`, `command:run:before:ID`, `command:abort:ID`, `command:stop`, `command:call`. Comandos iniciais via opção `commands` de `grapesjs.init()`.

**F38. GrapesJS, Traits** — https://grapesjs.com/docs/modules/Traits.html — versão não indicada.
- `editor.Components.addType(nome, { isComponent, model: { defaults: { traits } } })`. Trait é string ou objeto `{ type, name, label, ... }`; `traits` pode ser função do componente. Tipos embutidos: `text`, `number`, `checkbox`, `select`, `color`, `button`. `component.get('traits')`, `getTrait`, `addTrait`, `removeTrait`; `editor.Traits.addType` define tipo próprio com `createInput`, `onEvent`, `onUpdate`.

**F39. GrapesJS, Components** — https://grapesjs.com/docs/api/components.html — versão não indicada.
- `addType(type, methods)`, `getType(type)`, `getTypes()` devolve array com todos os tipos de componente.

**F40. Builder.io, componentes customizados** — https://www.builder.io/c/docs/custom-components-setup — versão do SDK não indicada.
- `Builder.registerComponent(component, options)`; opções `name` (obrigatório), `inputs` (array com `name`, `type`, `defaultValue`), `image`, `defaultStyles`, `noWrap`, `hideFromInsertMenu`, `models`, `defaults.bindings`. As registrações ficam no código; o Builder "não retém nem armazena" os componentes. A página não descreve API de listagem nem de validação das registrações.

**F41. Webflow, componentes de código** — https://developers.webflow.com/code-components/define-code-component — versão não indicada.
- Arquivo de definição `NomeDoComponente.webflow.tsx` (ou `.ts`) ao lado do componente; o nome do arquivo é o identificador do componente (renomear cria componente novo e remove o antigo). `declareComponent(Componente, { name, description?, group?, props?, decorators?, options? })`; as props vêm de `@webflow/data-types` (`props.Text`, `props.Variant`). O padrão de nome é configurável em `webflow.json`.

**F42. tldraw, shapes** — https://tldraw.dev/docs/shapes — versão não indicada.
- Classes `ShapeUtil` passadas na prop `shapeUtils` de `<Tldraw>`; `static type` e `static props` (validação no store; sem `props` o valor aceita qualquer JSON); tipagem por `TLGlobalShapePropsMap`; métodos obrigatórios `getDefaultProps`, `getGeometry`, `component`, `getIndicatorPath`.

**F43. tldraw, ferramentas** — https://tldraw.dev/docs/tools — versão não indicada.
- Ferramenta é `StateNode` com `static id`, passada na prop `tools`; registrar adiciona ao gráfico de estados, não à barra de ferramentas. `editor.setCurrentTool`, `editor.getCurrentToolId`.

**F44. tldraw, ações** — https://tldraw.dev/sdk-features/actions — versão não indicada.
- Ações vivem em contexto React; a interface registra as ações padrão ao montar, aplica `overrides` (tipo `TLUiOverrides`, função `actions(editor, actions, helpers)`) e expõe por `useActions()`, que devolve um registro indexado por id e pode ser iterado. Campos de `TLUiActionItem`: `id`, `label`, `icon`, `kbd`, `readonlyOk`, `checkbox`, `isRequiredA11yAction`, `onSelect(source)` com `source` igual a `'kbd'`, `'menu'`, `'toolbar'` ou `'context-menu'`. Cerca de 100 ações padrão. Atalhos são ligados automaticamente a partir de `kbd`.

**F45. Lexical, comandos** — https://lexical.dev/docs/concepts/commands — versão não indicada.
- `createCommand('NOME')` tipado por genérico; `editor.registerCommand(COMANDO, (payload) => boolean, prioridade)` devolve função de remoção; `editor.dispatchCommand`; prioridades `COMMAND_PRIORITY_EDITOR`, `LOW`, `NORMAL`, `HIGH`, `CRITICAL` e variantes `BEFORE_`; retorno `true` interrompe a propagação. A página não descreve listagem dos comandos registrados.

### 1.6 Literatura

**F46. GUI Ripping (Memon, Banerjee, Nagarajan; WCRE, novembro de 2003)** — https://www.cs.umd.edu/~atif/pubs/MemonWCRE2003-abstract.html — resumo aberto.
- A técnica percorre automaticamente a interface de uma aplicação em execução, abrindo janelas e extraindo todos os widgets, suas propriedades e valores. O resultado é verificado por um projetista de testes e gera três estruturas: floresta da GUI, grafos de fluxo de eventos e árvore de integração. Implementação para GUIs Java e Microsoft Windows. Os estudos de caso indicam pouca intervenção humana e utilidade para teste de regressão de software modificado com frequência.

**F47. AutoInSpec (Cohen, Huang, Memon; ISSRE 2012)** — https://www.cs.umd.edu/~atif/pubs/ISSRE2012-abstract.html — a página aberta contém só título, autores, veículo e BibTeX; o conteúdo do artigo não foi lido. O título declara o uso de cobertura de teste ausente para melhorar especificações de GUIs.

**F48. OUIA 1.0-RC (Open UI Automation)** — https://ouia.readthedocs.io/en/latest/ — especificação em candidata a lançamento 1.0.
- Especificação de projeto de interface web para testadores, com responsabilidades separadas para fornecedores de componentes e desenvolvedores de páginas. Os nomes dos atributos e o mecanismo de enumeração de componentes não constam do trecho lido.

**Busca de literatura sobre "feature inventory" e "UI inventory" automatizados.** Uma busca na web com termos em inglês sobre inventário de funcionalidades ou de interface gerado do código e comparado com especificação devolveu artigos acadêmicos (GUI Ripping, AutoInSpec), materiais de análise estática e "skills" de comunidade para agentes de IA. Nenhum post de engenharia de empresa descrevendo um inventário de funcionalidades automatizado com diff entre versões foi encontrado e aberto. O 2013 "The First Decade of GUI Ripping" apareceu só como resultado de busca e não foi aberto; não é usado como fonte.

---

## 2. Técnicas: como se faz, custo, o que detecta, compatibilidade

### T1. Extração estática com a API do compilador TypeScript

**Como se faz.**
1. Carregar o tsconfig com `ts.readConfigFile` e `ts.parseJsonConfigFileContent` (ou `ts.getParsedCommandLineOfConfigFile`) e criar `ts.createProgram(fileNames, options)`.
2. Para cada `SourceFile` que não seja de declaração, percorrer com `ts.forEachChild` e coletar: chamadas a funções de registro (nome da função e argumento literal), elementos JSX com nome intrínseco (`button`, `input`, `select`, `a`, `textarea`) e atributos de manipulador (`onClick`, `onKeyDown`, `onPointerDown`), atributos `role` e `aria-*`.
3. Resolver identificadores com `checker.getSymbolAtLocation` para ligar uma constante usada como id ao seu valor literal; `checker.getTypeAtLocation` para ler uniões de literais (por exemplo, o conjunto de ids de comandos).
4. Gravar o resultado em JSON ordenado e comparar com a versão anterior por diff textual.

**Custo.** `createProgram` carrega e analisa o grafo inteiro; a verificação de tipos só roda se `getTypeChecker` for chamado e os símbolos forem pedidos. O custo neste projeto não está medido. A fonte F1 dá referência de escala para build completo (tldraw 11,2 s na 6 e 1,46 s na 7), que não se aplica à API.

**Detecta.** Tudo que é visível na sintaxe e na resolução de símbolos: registros com id literal, JSX intrínseco com manipulador, exports, uniões de literais, imports. Detecta estruturas que o manifesto nomeia e o código não referencia (id do manifesto sem nenhuma referência).

**Não detecta.** Ids montados em tempo de execução (concatenação, `map` sobre lista dinâmica), elementos criados com `document.createElement` ou `innerHTML`, elementos interativos dentro de componentes de terceiros, ramificações condicionais que nunca renderizam, interatividade via delegação de eventos no `document`. A fonte F36 registra a mesma limitação para a análise estática de JSX ("somente análise estática").

**Compatibilidade.**
- TypeScript 6.0.3: documentado como compatível em API com a 5.9 (F2); a API do wiki (F3) vale para a 6.0 e anteriores.
- TypeScript 7.0.x: não há API programática (F1, F4); o pacote `typescript` 7.0.2 não expõe `lib/typescript.js` (F5). A API nova está prevista para a 7.1 e é diferente (F1, F3). Para ferramentas que importam `typescript`, a F1 recomenda alias de npm para `@typescript/typescript6`.
- O projeto fica em TypeScript 6.0.3, portanto a extração com a API funciona hoje; a migração para a 7.x exige o pacote de compatibilidade `@typescript/typescript6` para o script do inventário.

### T2. ts-morph

**Como se faz.**
1. `new Project({ tsConfigFilePath: 'tsconfig.json' })` (F9).
2. `project.getSourceFiles()`, depois `sourceFile.forEachDescendant((node, traversal) => ...)` com `Node.isCallExpression`, `Node.isJsxOpeningElement` e afins (F10).
3. Consultas de referência e exports (`getExportedDeclarations`, `findReferencesAsNodes`) existem no ts-morph, mas as páginas lidas (F9, F10) não as documentam; seus nomes vêm do conhecimento prévio e não foram verificados nas fontes abertas.

**Custo.** Camada sobre a API do compilador: mesma carga de Program mais a criação de wrappers de nós. Não medido neste projeto.

**Detecta e não detecta.** Os mesmos limites de T1. Ganha em ergonomia (guardas de tipo, travessia com `skip`/`stop`) e perde em dependência extra.

**Compatibilidade.** ts-morph 28.0.0 (F6, F7) atualiza para TypeScript 6.0 e traz mudanças incompatíveis. Depende de `@ts-morph/common ~0.29.0`, cuja devDependency `typescript` é 6.0.2 (F8) e que empacota o compilador no build; `typescript` não é dependência de runtime (F7). Nenhuma fonte aberta descreve ts-morph sobre TypeScript 7; a F1 afirma que ferramentas que embutem o compilador permanecem na 6.0, e o ts-morph não aparece na página. Fato adicional: o ts-morph usa o compilador empacotado, de modo que a versão 6.0.2 do pacote convive com a 6.0.3 do projeto.

### T3. Registro em tempo de execução (cada controle se declara ao montar)

**Como se faz (padrões documentados nos editores maduros).**
- Registro central com id, consultável por listagem: GrapesJS `Commands.add/getAll/has` (F37) e `Components.getTypes()` (F39); tldraw `useActions()` devolve registro iterável por id (F44).
- Registro por declaração tipada na entrada: Lexical `createCommand` + `registerCommand` (F45); tldraw `shapeUtils` e `tools` como props (F42, F43); Builder.io `registerComponent` (F40); Webflow `declareComponent` em arquivo com nome convencional (F41).
- Verificação em tempo de execução: o registro é lido (por exemplo, em teste Playwright via `page.evaluate`) depois de montar cada tela e comparado com o manifesto.

**Custo.** Uma chamada por montagem; cabe em modo de teste. Sem medição neste projeto.

**Detecta.** O que realmente montou naquele estado de tela: controles presentes, com id e tipo declarados. Detecta controle montado que não está no manifesto e id do manifesto que nenhum controle declara, nos estados percorridos.

**Não detecta.** Controles em estados e telas não visitados pelo roteiro; controle que existe no DOM e esqueceu de se declarar (o registro só conhece quem se declara).

**Fatos sobre enumeração.** GrapesJS documenta `getAll()` e `getTypes()` (F37, F39); tldraw documenta `useActions()` (F44); as páginas lidas de Lexical (F45) e Builder.io (F40) não documentam API de listagem.

**Compatibilidade.** Sem restrição de versão: é padrão de código do aplicativo, sem dependência externa.

### T4. Varredura da árvore de acessibilidade com Playwright (ARIA snapshots)

**Como se faz.**
1. Abrir o app no Chromium pelo Playwright (como já exige a seção 8 do CLAUDE.md do projeto).
2. Colher a árvore: `await page.ariaSnapshot()` (v1.59) ou `locator.ariaSnapshot({ depth, mode, boxes })` (v1.49, opções 1.59 e 1.60) devolve YAML; `page.ariaSnapshotJSON()` (v1.63) devolve a mesma árvore como JSON (F12, F13, F14).
3. Para o canvas em iframe, o modo `ai` inclui o snapshot do `<iframe>` e referências `[ref=eN]` (F13); `page.getByRef()` localiza pela referência a partir da 1.64 (F14).
4. Verificar contra expectativa: `expect(locator).toMatchAriaSnapshot(template)` (v1.49) ou `toMatchAriaSnapshot({ name })` com arquivo `.aria.yml` (v1.50). Atualização com `--update-snapshots` (F11, F15).
5. Para inventário, percorrer o JSON, listar os nós com papel interativo (`button`, `textbox`, `checkbox`, `slider`, `combobox`, `menuitem`, `tab`, `link`, `switch`, `spinbutton`) e comparar cada par papel mais nome com o manifesto.

**Custo.** Uma captura por estado de tela; o timeout padrão é 0 (sem limite) e deve ser definido no script (F12). Sem medição neste projeto.

**Detecta.** O que um usuário de tecnologia assistiva percebe: papel, nome acessível, estado (`checked`, `disabled`, `expanded`, `pressed`), hierarquia. Pega controle interativo sem nome, sem papel, e controle que aparece na interface e não está no manifesto. O texto em inglês na interface pt-BR (família `english` da regra G5) aparece nos nomes.

**Não detecta.** Elemento sem semântica de acessibilidade que responde a clique (`div` com manipulador e sem `role`): ele não entra na árvore como interativo. Segundo F11, o template é "uma restrição, não necessariamente uma serialização completa", portanto o snapshot em modo de asserção parcial não prova ausência de itens extras; a prova de "nada além do esperado" exige `/children: equal` ou comparação do JSON completo. A árvore não traz posição sem a opção `boxes` (F12) e não mostra elementos fora da árvore de acessibilidade.

**Compatibilidade.** @playwright/test 1.63.0 instalado: tem `ariaSnapshotJSON` (v1.63), `boxes` (1.60), `depth`/`mode` (1.59), `toMatchAriaSnapshot` em Page (1.60), `signal` (1.62). `page.getByRef` é da 1.64 e não está no 1.63. `page.accessibility` foi removido na 1.57 (F14).

### T5. Chrome DevTools Protocol, `Accessibility.getFullAXTree`

**Como se faz.**
1. `const cdp = await page.context().newCDPSession(page)` (F16).
2. `await cdp.send('Accessibility.getFullAXTree', { depth, frameId })` devolve `{ nodes }` (F17). Para cada frame (inclusive o iframe do canvas), repetir com o `frameId` do frame.
3. Cada `AXNode` traz `role`, `name`, `ignored`, `properties`, `childIds` e `backendDOMNodeId`. O `backendDOMNodeId` permite chamar `DOM.describeNode` para obter o elemento (atributos como `data-*`) e ligar o nó a um id do manifesto.

**Custo.** Uma chamada por frame. Sem medição neste projeto.

**Detecta.** O mesmo que T4, com dados brutos adicionais: nós ignorados com `ignoredReasons`, `chromeRole`, e a ligação ao nó do DOM por `backendDOMNodeId`.

**Não detecta.** Os limites de T4. Adicionalmente: o domínio e os comandos estão marcados experimentais (F17), então o formato pode mudar entre versões do Chrome. O CDP é específico do Chromium; a página de CDPSession lida (F16) não afirma isso, e a restrição não foi confirmada nesta leitura.

**Compatibilidade.** `newCDPSession` e `send` existem em todas as versões recentes do Playwright (F16); a chamada independe da versão 1.63. O texto do protocolo foi lido no ramo master, sem versão.

### T6. dependency-cruiser

**Como se faz.**
1. Instalar `dependency-cruiser` 18.5.0 (F18). Gerar configuração com `--init` (F23).
2. Regra `forbidden` com `orphan: true` em `from` acha módulos sem entrada nem saída (F20). Regra com `reachable: false` acha módulos inalcançáveis a partir de um conjunto `from`, usada para achar código morto (F20). Regra `required` exige que módulos selecionados tenham dependência direta (ou indireta com `reachable: true`) em outro (F20).
3. Para "funcionalidade do manifesto sem caminho no código": um arquivo de registro (por exemplo, o módulo que lista os comandos) como `from` e cada módulo de implementação como `to` com `reachable`; módulo de comando fora do alcance vira violação.
4. Saída JSON (`-T json`) traz `modules`, `dependencies`, `summary.violations` (F21, F23). `--baseline` grava violações conhecidas e `--ignore-known` as suprime, o que permite adoção gradual (F23).
5. `--cache` acelera execuções repetidas (F22, F23).

**Custo.** Análise de arquivo e resolução de imports, sem verificação de tipos; cache disponível. Sem medição neste projeto; a fonte não publica números.

**Detecta.** Arquivos órfãos, módulos inalcançáveis, ciclos, imports não resolvidos, violação de camada por caminho (`path`/`pathNot` por expressão regular).

**Não detecta.** Uso de símbolo dentro de um módulo (a unidade é o módulo/arquivo, não o export), controle da interface, comportamento em tempo de execução. Um arquivo alcançável por import não prova que a função é chamada.

**Compatibilidade.** Versão 18.5.0 aceita TypeScript `>=2.0.0 <7.0.0` (F18); TypeScript 6.0.3 está dentro. Exige Node `^22||^24||>=26` (F18); a versão de Node do projeto não foi verificada nesta pesquisa. TypeScript 7 fica fora da faixa declarada de transpiladores suportados.

### T7. knip

**Como se faz.**
1. Instalar `knip` 6.40.0 (F24). Configurar `entry` e `project` (F27); os plugins de Vitest e Playwright acrescentam entradas sozinhos (F27).
2. Executar com `knip --reporter json` (F30). Os campos `exports`, `types`, `files`, `enumMembers`, `duplicates` indicam o que não é referenciado (F26, F30).
3. Para o inventário: ligar `includeEntryExports` quando o arquivo de entrada exporta funcionalidades que o manifesto deve referenciar (F27). `--production` com padrões marcados `!` mede o que o app de produção alcança, sem a ajuda de testes (F29).
4. Reporter próprio em TypeScript recebe `ReporterOptions` e pode escrever o diff do inventário (F30).

**Custo.** Publicado pelo autor, de v5.88.0 para v6.0.0: de 2 a 4 vezes mais rápido; projetos de 0,9 s (TypeScript) a 4,0 s (sentry) (F25). No projeto não está medido.

**Detecta.** Arquivos não alcançados a partir das entradas, exports sem referência, tipos exportados sem referência, membros de enum e de namespace sem referência, dependências não usadas ou não declaradas, imports não resolvidos (F26).

**Não detecta.** Uso por string (id de comando resolvido em tempo de execução por chave dinâmica): o export aparece como usado ou não usado conforme as referências estáticas. Não enxerga elementos de interface nem o manifesto JSON como referência, a menos que um plugin ou entrada o declare. Em modo padrão, o código usado só por testes conta como usado (F29).

**Compatibilidade.** Knip 6 usa oxc-parser e oxc-resolver, não a API do TypeScript (F25); por isso não depende da versão do compilador do projeto e não é afetado pela ausência de API no TypeScript 7. Exige Node `^20.19.0 || >=22.12.0` (F24). O tipo `classMembers` foi removido (F25). A dependência `zod ^4.4.3` do próprio Knip (F24) é compatível em major com o zod 4.6.5 do projeto.

### T8. API Extractor

**Como se faz.**
1. Gerar `.d.ts` com `declaration: true` (F35).
2. `api-extractor init`; configurar `mainEntryPointFilePath` para o `.d.ts` de entrada e `apiReport` com `reportFolder` (F34, F35).
3. Executar `api-extractor run`. O relatório `etc/<pacote>.api.md` é versionado no git; o diff de pull request mostra mudança de API (F34). O comportamento exato de `--local` versus execução de CI não é explicado pela página lida (F35).
4. O modelo de documentação `.api.json` (F33) é consumível por script para montar inventário de exports e diff.

**Custo.** Analisa só declarações. Sem medição neste projeto.

**Detecta.** Mudanças na superfície pública exportada de um ponto de entrada: assinaturas, exports acrescentados ou removidos, tipos esquecidos (`ae-forgotten-export`) (F34).

**Não detecta.** Controles de interface, estado interno, comandos que não saem do ponto de entrada, uso em tempo de execução. A unidade é o pacote com `.d.ts` de entrada; um aplicativo (não biblioteca) precisa de um ponto de entrada artificial que reexporte o que se quer inventariar.

**Compatibilidade.** API Extractor 7.59.4 embute TypeScript 5.9.3 fixo (F31). O changelog lido não cita TypeScript 6 (F32). O projeto usa TypeScript 6.0.3; nenhuma fonte aberta confirma o comportamento do API Extractor sobre `.d.ts` gerados pela 6.0.3 nem sobre as novas configurações padrão da 6.0 (F2). Exige Node `>=20.9.0` (F31).

### T9. Análise estática de JSX com ESLint (eslint-plugin-jsx-a11y)

**Como se faz.** Ativar `flatConfigs.recommended` (ou `strict`) e as regras `no-static-element-interactions`, `interactive-supports-focus`, `click-events-have-key-events` (F36). Configurar `settings.jsx-a11y.components` para mapear componentes próprios a elementos DOM (F36).

**Detecta.** Elemento não interativo com manipulador sem `role` e sem foco: é a classe de elemento que escapa de T4 e T5.

**Não detecta.** Componentes que repassam props a elementos ocultos sem mapeamento, interatividade ligada em `addEventListener`. A própria página declara a análise estática e recomenda `@axe-core/react` e teste manual (F36). O repositório já usa ESLint (CLAUDE.md, seção 10); a versão do plugin e a compatibilidade com ESLint do projeto não foram verificadas.

### T10. Percurso dinâmico da interface (GUI ripping)

**Fato documentado (F46).** A técnica abre janelas e extrai todos os widgets com propriedades e valores de uma aplicação em execução, e produz floresta da GUI, grafos de fluxo de eventos e árvore de integração. O trabalho original cobre Java e Windows; a versão web não foi lida.

**Aplicação ao Playwright (avaliação na seção 4).** Percorrer o app disparando cada controle detectado e capturando a árvore de acessibilidade depois de cada ação produz o grafo de estados e eventos.

---

## 3. Tabela comparativa (fatos das seções anteriores)

| Técnica | Unidade que enxerga | Enxerga elemento de interface | Enxerga manifesto sem caminho no código | Exige TypeScript API | Funciona com TypeScript 7 |
|---|---|---|---|---|---|
| T1 API do compilador | símbolo, nó de sintaxe | só JSX/DOM literal no código | sim, por referência a id | sim | não (sem API na 7.0; 7.1 tem API nova) |
| T2 ts-morph 28 | símbolo, nó de sintaxe | só JSX/DOM literal no código | sim, por referência a id | sim (compilador empacotado 6.0.x) | nenhuma fonte aberta confirma |
| T3 registro em execução | controle montado | sim, se declarado | sim, nos estados visitados | não | sim |
| T4 aria snapshot | nó de acessibilidade | sim, os com semântica | não | não | sim |
| T5 CDP getFullAXTree | nó de acessibilidade + DOM | sim, os com semântica | não | não | sim |
| T6 dependency-cruiser 18.5 | módulo | não | parcial (módulo inalcançável) | opcional (faixa menor que 7.0.0) | fora da faixa declarada |
| T7 knip 6.40 | export, arquivo | não | parcial (export sem referência) | não (oxc) | sim |
| T8 API Extractor 7.59 | export de `.d.ts` | não | não | embute 5.9.3 | não documentado |
| T9 jsx-a11y | elemento JSX | só interativos sem semântica | não | não | versão do plugin não verificada |

---

## 4. Avaliação do pesquisador (opinião, não fato documentado)

1. **Nenhuma técnica sozinha cobre os dois requisitos.** "Elemento interativo na interface que não está no manifesto" é problema de DOM em execução e pede T4/T5 mais T3; "funcionalidade do manifesto sem caminho no código" é problema de grafo estático e pede T1/T2 mais T6/T7. A tabela da seção 3 mostra que cada coluna é coberta por técnicas diferentes.
2. **Para a camada estática, a opção de menor risco de versão é Knip mais um script próprio com a API do TypeScript 6.0.3.** O Knip 6 não depende do compilador (F25). O script próprio com a API do compilador depende de a 7.0 não oferecer API (F1, F4), então o projeto deve fixar o `typescript` 6.x para essa ferramenta ou usar o pacote `@typescript/typescript6` (F1) no dia em que o projeto principal passar para a 7.x. O ts-morph acrescenta dependência sem ganho de capacidade para as consultas de inventário e não tem confirmação de funcionamento sobre a 7.
3. **Para a camada de interface, o caminho com melhor custo é ler a árvore com `page.ariaSnapshotJSON()` (disponível no 1.63.0 instalado) e ligar cada nó interativo ao manifesto.** Para elementos clicáveis sem semântica (que T4 não vê), a regra de ESLint `no-static-element-interactions` (T9) fecha a lacuna na origem, e uma consulta direta ao DOM por manipuladores via CDP (fora do escopo desta pesquisa) seria o complemento dinâmico.
4. **O registro em tempo de execução (T3) é o único método que dá identidade estável ao controle.** A árvore de acessibilidade identifica por papel e nome, e o nome muda com o idioma (a interface tem pt-BR e inglês). Um atributo `data-` com o id do manifesto (por exemplo, o id da feature) em cada controle, lido por T4/T5 via `backendDOMNodeId` ou por seletor, evita a dependência do texto traduzido. O CLAUDE.md do projeto proíbe escrever ids do manifesto à mão (regra de lint `no-manifest-id`); o atributo teria de ser derivado do manifesto por código.
5. **O diff entre versões é um problema de formato, não de ferramenta.** A recomendação é gerar um único JSON canônico (chaves ordenadas, sem datas nem caminhos absolutos) a cada build e usar diff textual no git, como o API Extractor faz com o relatório `.api.md` versionado (F34) e como o dependency-cruiser faz com o arquivo de violações conhecidas (F23). O padrão "arquivo de referência versionado, atualizado só por comando explícito" é a prática comum às duas ferramentas.
6. **dependency-cruiser tem valor limitado aqui.** Ele opera em módulos, e a pergunta do projeto é sobre funcionalidades dentro dos módulos. Fica útil para uma verificação específica: o módulo de implementação de cada comando é alcançável a partir da entrada da aplicação (regra com `reachable`, F20).
7. **API Extractor tem valor baixo para um aplicativo.** Ele exige um ponto de entrada `.d.ts` (F35), embute TypeScript 5.9.3 (F31) e o changelog não registra suporte à 6 (F32). O relatório de API pode ser substituído por um JSON gerado pelo próprio script de T1, sem a incompatibilidade de versão.
8. **O percurso dinâmico do tipo GUI ripping (T10) é a única técnica citada que produz estados e transições, necessários para testar "estados" e "eventos" no inventário.** Seu custo cresce com o número de combinações de controles; o limite do percurso deve ser definido pelo manifesto (cada feature com seus scenarios), e não por exploração cega.

---

## 5. Lacunas desta pesquisa (pontos não verificados nas fontes abertas)

- Campos dos nós do JSON de `ariaSnapshotJSON` (F13 não os descreve; a seção de `locator.ariaSnapshotJSON` não foi localizada na leitura de F12).
- Funcionamento do ts-morph 28 sobre TypeScript 7 e a versão exata do compilador empacotado no `@ts-morph/common` 0.29.0 (F8 informa só a devDependency 6.0.2).
- Comportamento do API Extractor 7.59.4 com projetos em TypeScript 6.0.3.
- Diferença de `--local` versus CI no API Extractor (F35 não explica).
- Versão de Node do projeto frente às exigências do dependency-cruiser 18.5.0 (`^22||^24||>=26`) e do Knip 6.40.0 (`^20.19.0 || >=22.12.0`).
- API de listagem de comandos registrados em Lexical e de componentes registrados em Builder.io: as páginas lidas não a documentam.
- Atributos e mecanismo de enumeração do OUIA (F48 não os mostra).
- Custos de execução no projeto: nenhum foi medido.
- Datas divergentes do anúncio do TypeScript 6.0 entre a listagem do blog (2026-03-06) e o corpo da página (2026-03-23).
