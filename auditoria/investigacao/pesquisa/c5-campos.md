# C5: controlador global de entradas (pesquisa)

Data da pesquisa: 2026-10-08. Versões instaladas no projeto, lidas em `package.json` de cada pacote em `node_modules`: css-tree 3.2.1, zod 4.6.5, fast-check 4.10.2, vitest 5.0.1.

Convenção deste arquivo: a seção "Fatos documentados" de cada fonte registra o que a página abriu afirma. A seção "Medido aqui" registra experimentos rodados no projeto em 2026-10-08. A seção "Avaliação" registra julgamento do pesquisador e é a única que contém recomendação.

Limite da investigação: o WebFetch devolve resumos gerados por um modelo pequeno a partir da página. Onde o resumo disse que um item não consta na página, o item está listado como lacuna e não como fato.

---

## 1. css-tree 3.x: lexer e validação de valores

### 1.1 README do repositório csstree/csstree
- URL: https://raw.githubusercontent.com/csstree/csstree/master/README.md
- Acesso: 2026-10-08. Conteúdo do ramo master (npm css-tree 3.x).
- Fatos documentados:
  - O lexer testa CSS contra sintaxes definidas pelo W3C. Usa mdn/data como base de dicionários e acrescenta sintaxes de fornecedores e legadas.
  - O lexer verifica apenas valores de declarações e at-rules.
  - O lexer pode ser importado isolado em `css-tree/lexer`. Os dados de sintaxe ficam em `css-tree/definition-syntax-data` e `css-tree/definition-syntax-data-patch`.
  - Exemplo oficial: parse do valor com `{ context: 'value' }` e depois `csstree.lexer.matchProperty('border', ast)`.
  - O resultado oferece `isType(node, 'color')` e `getTrace(node)`. O `getTrace` devolve a cadeia de tipos e palavras-chave que casaram o nó, por exemplo propriedade border, tipo color, tipo named-color, palavra-chave red.
  - O parser é tolerante a erros: conteúdo inválido vira nó `Raw`.

### 1.2 Índice da documentação, definition-syntax e utils
- URLs: https://raw.githubusercontent.com/csstree/csstree/master/docs/readme.md, https://github.com/csstree/csstree/blob/master/docs/definition-syntax.md, https://raw.githubusercontent.com/csstree/csstree/master/docs/utils.md
- Acesso: 2026-10-08. Ramo master.
- Fatos documentados:
  - A pasta docs contém ast.md, definition-syntax.md, generate.md, list.md, parsing.md, readme.md, traversal.md, utils.md. Não existe página de documentação dedicada ao lexer (matchProperty, matchType, match, SyntaxMatchError). A API do lexer só é descrita no README e no código-fonte.
  - A página definition-syntax.md documenta o módulo `definitionSyntax` com `parse(source)` (devolve AST de definição, com nós Group, Keyword, Type, Property, Multiplier, Range, Function, Token, String, Comma, AtKeyword), `walk(node, options, context)` e `generate(node, options)` com as opções `forceBraces`, `compact`, `decorate`.
  - A página utils.md documenta `property(name)`, `keyword(name)`, `ident`, `string`, `url` (decode e encode), `clone`, `fromPlainObject`, `toPlainObject`. Nada sobre lexer.

### 1.3 Código-fonte do Lexer
- URL: https://github.com/csstree/csstree/blob/master/lib/lexer/Lexer.js
- Acesso: 2026-10-08. Ramo master.
- Fatos documentados:
  - Construtor `constructor(config, syntax, structure)`. A configuração aceita `cssWideKeywords`, `units`, `types`, `atrules`, `properties` e `generic`.
  - Métodos públicos de correspondência: `matchProperty`, `matchType`, `match`, `matchAtrulePrelude`, `matchAtruleDescriptor`, `matchDeclaration`.
  - Métodos de verificação: `checkStructure`, `checkPropertyName`, `checkAtruleName`, `checkAtrulePrelude`, `checkAtruleDescriptorName`. Busca: `getProperty`, `getType`, `getAtrule`. Fragmentos: `findValueFragments`, `findDeclarationValueFragments`, `findAllFragments`. Utilitários: `validate`, `dump`, `toString`.
  - Propriedade desconhecida: o resultado de `matchProperty` traz `SyntaxReferenceError` ("Unknown property") e `matched` nulo.
  - Propriedade customizada (`--x`): não é casada. O resultado traz um erro dizendo que a correspondência não se aplica.
  - Valor com `var(`: recusado com o erro "Matching for a tree with var() is not supported".
  - Em `matchProperty`, as palavras-chave CSS-wide (inherit, initial, unset, revert e afins) são testadas antes da sintaxe da propriedade.

### 1.4 Erros do lexer
- URL: https://github.com/csstree/csstree/blob/master/lib/lexer/error.js
- Acesso: 2026-10-08. Ramo master.
- Fatos documentados:
  - `SyntaxReferenceError(type, referenceName)` tem o campo extra `reference`.
  - `SyntaxMatchError(message, syntax, node, matchResult)` tem os campos `rawMessage`, `syntax` (sintaxe gerada em texto), `css` (texto do valor), `mismatchOffset`, `mismatchLength`, `offset`, `line`, `column` e `loc`.
  - O campo `message` junta a mensagem original, a linha `syntax:`, a linha `value:` e uma linha de traços com `^` na posição do desencontro. O texto da mensagem é inglês e fixo; não há mecanismo de tradução.

### 1.5 fork e CHANGELOG
- URLs: https://github.com/csstree/csstree/blob/master/lib/syntax/create.js, https://github.com/csstree/csstree/blob/master/CHANGELOG.md
- Acesso: 2026-10-08. Ramo master.
- Fatos documentados:
  - `fork(extension)` aceita uma função (recebe cópia da configuração e devolve a configuração) ou um objeto (mesclado sobre a base). Recria parser, walker, generator e um novo `Lexer` do zero. As chaves repassadas ao Lexer incluem `generic`, `cssWideKeywords`, `units`, `types`, `atrules`, `properties`, `node`.
  - 3.0.0 (2024-09-11): corrige `<'property'>` com `#`; `fork()` respeita `generic`; mdn-data 2.10.0.
  - 3.0.1 (2024-11-01): `Lexer#validate()` devolve array `errors`; personalização de `cssWideKeywords`; mdn-data 2.12.1.
  - 3.1.0 (2024-12-06): suporte a `<boolean-expr[ test ]>`; mdn-data 2.12.2.
  - 3.2.0 (2026-03-04): notação funcional em definições de sintaxe; multiplicadores empilhados; correspondência de `min()` e `max()`; mdn-data 2.27.1.
  - 3.2.1 (2026-03-05): corrige função aninhada em grupo na definição de sintaxe.
  - O CHANGELOG não registra nada sobre desempenho.

### 1.6 Medido aqui (css-tree 3.2.1, Node local, 2026-10-08)
Script de medição: arquivos temporários no diretório de rascunho da sessão, fora do projeto. Resultados:
- Aceitos pelo lexer: `width: 0`, `width: 1e3px`, `width: 10PX`, `width: calc(10px + 2%)`, `margin: calc(1px + )`, `opacity: 150%`, `opacity: 2`, `color: rgb(300,0,0)`, `box-shadow: 0 0 -4px red`, `box-shadow: 0 0 4px` (sem cor), `transition: all 0.3s ease`.
- Recusados pelo lexer: `width: 10` (sem unidade), `width: -5px`, `width: 10xx`, `width: abc`, `width: ` (vazio), `box-shadow: 0 0 4px 2px #zzz` (desencontro no deslocamento 12), `transform: rotate(45)` (deslocamento 7), `background-image: linear-gradient(red 10%, )` (deslocamento 24).
- Mensagem de recusa: a primeira linha é sempre `Mismatch`, seguida da sintaxe completa da propriedade em inglês (para `width`, a sintaxe inteira com todas as palavras-chave). O campo `rawMessage` vale `Mismatch`; a informação útil é `mismatchOffset`.
- Erros que não são de casamento: `var(--a)` devolve Error "Matching for a tree with var() is not supported". `--a` devolve "Lexer matching doesn't applicable for custom properties". `foo` devolve `SyntaxReferenceError` "Unknown property `foo`".
- Fork com gramática própria: `csstree.fork({ types: { 'my-unit-len': '<number> | <length>' }, properties: { 'x-gap': '<my-unit-len>{1,2}' } })` aceitou `4 8px`, recusou `4 8px 9px` e manteve `width: 1px` válido. `matchType('length', ast de 5px)` aceitou.
- Unidades conhecidas pelo lexer: grupos angle, decibel, flex, frequency, length (49 unidades), resolution, semitones, time.
- Custo por chamada, depois do aquecimento: casamento de `box-shadow` com AST pronto, 10,2 microssegundos; parse mais casamento, 12,5 microssegundos; `width: 120px` com parse, 10,4 microssegundos; gradiente com 20 paradas com parse, 101,6 microssegundos; 50 sombras em uma declaração, 1,67 ms; 5000 dígitos seguidos de px, 0,19 ms; primeira chamada fria, 3,9 ms; `fork` com uma propriedade nova, 2,06 ms por chamada.

### 1.7 Técnica: validar valor contra a gramática da propriedade
- Como se faz: `csstree.parse(texto, { context: 'value' })` e depois `csstree.lexer.matchProperty(nomeDaPropriedade, ast)`. Se `resultado.error` existe, o valor é recusado; `resultado.error.mismatchOffset` aponta o trecho. Para campo de um único tipo (por exemplo só comprimento), `lexer.matchType('length', ast)`.
- Custo: da ordem de 10 microssegundos para valores curtos e 100 microssegundos para gradiente longo. Cabe em validação a cada tecla.
- Detecta: unidade desconhecida, palavra-chave inexistente, número de argumentos errado, faixa declarada na gramática (por exemplo `[0,∞]` em `width`), vírgula sobrando em gradiente.
- Não detecta: conteúdo interno de `calc()` malformado (`calc(1px + )` passou); faixas que a especificação impõe fora da gramática de valor (blur negativo em `box-shadow` passou); canais de cor fora de faixa (`rgb(300,0,0)` passou); qualquer valor com `var()`; propriedades customizadas; texto de erro em português.

### 1.8 Avaliação (pesquisador)
- O lexer serve como oráculo de "o navegador aceitaria este texto?" para a maioria das propriedades, com custo desprezível. Serve mal como fonte da mensagem exibida ao usuário: o texto é inglês e genérico.
- O registro do contrato deve guardar a mensagem própria (chave i18n) por regra, e usar o lexer só para decidir aceitar ou recusar e para obter `mismatchOffset`.
- Lacunas do lexer (calc interno, blur negativo, canais de cor) exigem verificações complementares declaradas no contrato do campo. A verificação automática deve incluir casos negativos para essas lacunas.
- `fork` custa cerca de 2 ms; deve ser feito uma vez na inicialização, não por campo.

---

## 2. zod 4.x

### 2.1 Codecs
- URLs: https://zod.dev/codecs e https://zod.dev/api?id=codecs
- Acesso: 2026-10-08. Documentação da série 4.x do zod (páginas não informam número de versão menor).
- Fatos documentados:
  - Assinatura `z.codec(inputSchema, outputSchema, { decode, encode })`. Os callbacks podem ser assíncronos e `decode` recebe `ctx` para registrar issues.
  - API: `z.decode`, `z.encode`, `z.safeDecode`, `z.safeEncode`, variantes assíncronas, `z.invertCodec(codec)` (não recursivo).
  - `parse` tem em tempo de execução o mesmo comportamento de `decode`.
  - Exemplo oficial de `stringToNumber`: `z.codec(z.string().regex(z.regexes.number), z.number(), { decode: parseFloat, encode: toString })`. Os codecs prontos (stringToNumber, stringToInt e outros) são código para copiar, não API nativa.
  - Checks como `refine`, `min`, `max` executam nas duas direções. Em `encode` há duas passagens: tipo primeiro, refinamento depois.
  - Defaults, prefaults e `catch` valem só em `decode`. `transform` é unidirecional: `encode` lança erro de runtime, não ZodError.
- Medido aqui (zod 4.6.5): um codec string para número com `min(0).max(100)` devolveu `{ success: true, data: 50 }` para "50". Para "500" e para encode de 500 ambos devolveram a mesma issue "Too big: expected number to be <=100". Ou seja, a faixa é verificada nas duas direções com a mesma mensagem.

### 2.2 templateLiteral e refine
- URL: https://zod.dev/api?id=codecs (mesma página de API, seções templateLiteral e refine)
- Acesso: 2026-10-08.
- Fatos documentados: `z.templateLiteral([z.number(), z.enum(["px","em","rem"])])` produz o tipo de template literal `${number}px` e as demais uniões. `refine` aceita as opções `error`, `abort`, `path`, `when` e a função não deve lançar exceção.
- Medido aqui (zod 4.6.5): com `templateLiteral([number, enum px em rem %])`, "10px" passa; "10pt", "1e3px" e " 10px" (espaço inicial) são recusados.
- Avaliação: `templateLiteral` descreve a forma "número seguido de unidade fechada" e dá o tipo TypeScript, mas não aceita notação científica nem espaço e não sabe de `calc()`. Serve para o subconjunto numérico com unidade; não substitui o lexer.

### 2.3 Mensagens, i18n e z.config
- URLs: https://zod.dev/error-customization, https://zod.dev/error-customization?id=internationalization, https://zod.dev/v4/changelog
- Acesso: 2026-10-08.
- Fatos documentados:
  - O parâmetro `error` aceita string ou função (mapa de erro) que recebe a issue; devolver `undefined` passa para a próxima camada. A issue traz `code`, `input`, `inst`, `schema`, `path` e propriedades do tipo (por exemplo `minimum`). `input` só aparece com `reportInput: true`.
  - Precedência, da maior para a menor: erro no próprio check; erro no schema; erro por chamada de parse; `z.config({ customError })`; locale em `z.config(locale())`.
  - Locales: importados de `zod/locales` ou lidos em `z.locales`. A lista inclui `pt` e `ptBR` (a chave é `ptBR`, sem hífen). O pacote `zod` carrega `en` por padrão. Carregamento dinâmico por `import()` de `zod/v4/locales/<nome>.js`.
  - Para traduzir na renderização, usar `iss.code` como chave e as propriedades da issue como valores de interpolação.
  - Mudanças da série 4: `message` virou `error` (o antigo segue funcionando, marcado como depreciado); `invalid_type_error` e `required_error` foram removidos; `errorMap` virou `error`; o mapa passado ao parse não sobrepõe mais o do schema; `refine` não aceita mais função como segundo argumento.
- Medido aqui (zod 4.6.5): `Object.keys(z.locales)` filtrado devolve `en`, `pt`, `ptBR`. Depois de `z.config(z.locales.ptBR())`, a issue de tipo inválido diz "Entrada inválida: esperava um número, recebeu um texto" e a de mínimo diz "Pequeno demais: esperava que o número fosse >= 3".
- Avaliação: o locale ptBR do zod cobre mensagens genéricas de tipo e de faixa. Mensagens de domínio (por exemplo "blur não pode ser negativo") precisam de `error` por check apontando para chave do i18n do projeto. A troca de idioma exige que a função `error` rode no momento da exibição (guardar `code` e parâmetros na issue e traduzir ao desenhar), porque `z.config` fixa o idioma no momento do parse.

### 2.4 Formatação de erros
- URL: https://zod.dev/error-formatting
- Acesso: 2026-10-08.
- Fatos documentados: `z.treeifyError`, `z.prettifyError`, `z.flattenError` (campos `formErrors` e `fieldErrors`); `z.formatError` está obsoleto; `issue.path` é array; `ZodError.issues` traz `code`, `path`, `message` e campos próprios por tipo.

### 2.5 z.toJSONSchema
- URL: https://zod.dev/json-schema
- Acesso: 2026-10-08.
- Fatos documentados: assinatura `z.toJSONSchema(schema, params?)`; opções `target` (padrão draft-2020-12; também draft-07, draft-04, openapi-3.0), `io` ("output" padrão, "input"), `unrepresentable` ("throw" padrão ou "any"), `override`, `reused`, `cycles`, `metadata`, `uri`. Por padrão lançam erro: bigint, symbol, undefined, void, date, map, set, transform, nan, custom. `z.fromJSONSchema` existe e é descrito como experimental.
- Medido aqui (zod 4.6.5): para o codec de teste, `toJSONSchema(codec)` devolveu o lado de saída (number com minimum e maximum) e `toJSONSchema(codec, { io: 'input' })` devolveu o lado de entrada (string com pattern). Codec não lançou erro.
- Avaliação: o JSON Schema gerado do registro serve como documentação exportável e como entrada para a verificação (limites e padrão de cada campo lidos de uma só fonte). Refinamentos com função não aparecem no JSON Schema, então limites que dependem de `refine` não ficam documentados por essa via.

---

## 3. fast-check 4.x

### 3.1 Strings e stringMatching
- URLs: https://fast-check.dev/docs/core-blocks/arbitraries/primitives/string/ e https://fast-check.dev/docs/core-blocks/arbitraries/combiners/string/
- Acesso: 2026-10-08. Documentação da série 4.x.
- Fatos documentados:
  - `fc.string({ minLength, maxLength, size, unit })`; `unit` padrão `'grapheme-ascii'`; outras: `'grapheme'`, `'grapheme-composite'`, `'binary'`, `'binary-ascii'` ou arbitrário próprio, por exemplo `fc.constantFrom('Hello','World')`.
  - `fc.stringMatching(regex)` e `fc.stringMatching(regex, { maxLength, size })`, disponível desde 3.10.0. A regex não tem `^` nem `$` implícitos, então pode haver texto antes e depois; usar âncoras para correspondência exata. Com `\p{...}`, os valores dependem da versão Unicode do runtime. Para limitar comprimento, usar `.filter` ou combinar regexes.
- Medido aqui (fast-check 4.10.2): `fc.stringMatching(/^-?\d{1,3}(\.\d{1,2})?(px|em|%)$/)` gerou `-51px`, `-34em`, `-0em`, `-0em`, `10px`. A forma `-0em` aparece com frequência.
- Avaliação: `stringMatching` com regex derivada da gramática do campo gera entradas válidas por construção, e `-0` é um caso de borda real para `format(parse(x))`. Para entradas inválidas, usar `fc.oneof` entre uma regex de entradas quase válidas e `fc.string({ unit: 'binary' })`.

### 3.2 oneof, option, constant, constantFrom, mapToConstant
- URLs: https://fast-check.dev/docs/core-blocks/arbitraries/combiners/any/ e https://fast-check.dev/docs/core-blocks/arbitraries/combiners/constant/
- Acesso: 2026-10-08.
- Fatos documentados:
  - `fc.oneof(...arbs)` e `fc.oneof({ withCrossShrink, maxDepth, depthSize, depthIdentifier }, ...arbs)`; cada argumento pode ser `{ arbitrary, weight }` com peso inteiro maior ou igual a zero. O primeiro arbitrário é o favorecido por `maxDepth`, `depthSize` e `withCrossShrink`. O shrink acontece dentro do arbitrário que falhou, não entre arbitrários, salvo `withCrossShrink`.
  - `fc.option(arb, { freq, nil, depthSize, maxDepth, depthIdentifier })`; padrão `freq` 5 e `nil` null.
  - `fc.constant(v)`, `fc.constantFrom(...vs)` (primeiro valor é o alvo do shrink; exige ao menos um valor), `fc.mapToConstant(...{ num, build })` mapeia inteiros em constantes e permite intervalos não contíguos.
- Medido aqui: `fc.mapToConstant({ num: 3, build: v => ['px','em','%'][v] })` gerou `px`, `%`, `em`, `em`.
- Avaliação: gerar a lista de unidades e de palavras-chave de cada campo com `constantFrom` lido do registro mantém o teste acoplado ao contrato. `mapToConstant` serve para montar alfabetos de caracteres separados.

### 3.3 Propriedades e execução
- URLs: https://fast-check.dev/docs/core-blocks/properties/, https://fast-check.dev/docs/core-blocks/runners/, https://fast-check.dev/docs/api/interfaces/Parameters/, https://fast-check.dev/docs/configuration/global-settings/, https://fast-check.dev/docs/configuration/user-definable-values/
- Acesso: 2026-10-08. Série 4.x.
- Fatos documentados:
  - `fc.property(...arbs, predicado)`: sucesso com `true` ou `undefined`; falha com `false` ou exceção. `fc.pre(cond)` e `.filter` descartam valores e são ineficientes se restritivos.
  - `fc.assert(property, params)` lança erro formatado; `fc.check` devolve `RunDetails` (campos `failed`, `interrupted`, `counterexample`, `counterexamplePath`, `error`).
  - Parâmetros de `Parameters`: `numRuns` (padrão 100), `seed` (padrão `Date.now()`), `path` (reexecuta o contraexemplo; exige `seed`), `verbose`, `endOnFailure`, `examples`, `maxSkipsPerRun`, `timeout` e `interruptAfterTimeLimit` (ambos obsoletos em favor de plugins), `reporter`.
  - `examples` roda casos fixos antes dos gerados; cada exemplo consome uma das execuções. Exemplos que falham são reduzidos; arbitrários derivados de `.map` precisam de `unmapper` para reduzir.
  - `fc.configureGlobal` reinicia todas as configurações globais; `fc.readConfigureGlobal` permite acrescentar.
- Avaliação: fixar `seed` e `path` no relatório de falha torna a falha reproduzível; os casos conhecidos (por exemplo `-0`, vazio, só sinal) entram em `examples` do registro para rodar sempre.

### 3.4 Teste baseado em modelo (várias portas, sequências)
- URL: https://fast-check.dev/docs/advanced/model-based-testing/
- Acesso: 2026-10-08. Série 4.x.
- Fatos documentados: `fc.commands(arrayDeComandos, { size })` gera cenários; cada comando implementa `check(model)`, `run(model, real)` e `toString()`; `fc.modelRun(() => ({ model, real }), cmds)` executa (síncrono), com variantes `asyncModelRun` e `scheduledModelRun`. O modelo deve ser uma versão simplificada do sistema, não uma cópia, porque cópia testa o código contra ele mesmo. O replay exige `replayPath` em `fc.commands` além de `seed` e `path`.
- Avaliação: cada porta (botão, tecla, roda, arraste) vira um comando que envia a intenção ao tratador. O modelo do campo guarda só o valor confirmado esperado; a propriedade afirma que, para a mesma sequência de intenções, todas as portas produzem o mesmo valor gravado.

---

## 4. Literatura de teste baseado em propriedades para parsers e formatadores

### 4.1 Wlaschin, escolha de propriedades
- URL: https://fsharpforfunandprofit.com/posts/property-based-testing-2/
- Acesso: 2026-10-08. Série "Choosing properties for property-based testing" (data de publicação não exibida na página aberta).
- Fatos documentados: seis categorias de propriedade. (1) "There and back again": operação mais inversa devolve o original (serialização e desserialização). (2) "Some things never change": invariantes. (3) "The more things change, the more they stay the same": idempotência, f(f(x)) igual a f(x). (4) Resolver um problema menor (indução). (5) "Hard to prove, easy to verify" (um tokenizador cuja concatenação reproduz a entrada). (6) Oráculo de teste.
- Aplicação ao formatador: ida e volta vale para `parse(format(v))` igual a `v` partindo de valor canônico; idempotência vale para `format(parse(format(parse(x))))` igual a `format(parse(x))`. A forma "format(parse(x)) estável" do tema C5 é a propriedade de idempotência da normalização, não a de ida e volta estrita, porque `parse` perde informação (espaços, zeros à esquerda, caixa da unidade).

### 4.2 Hypothesis, "What is Hypothesis?"
- URL: https://hypothesis.works/articles/what-is-hypothesis/
- Acesso: 2026-10-08. Publicado em 2016-07-24, por David R. MacIver.
- Fatos documentados: o exemplo de round-trip `fromutf8b(toutf8b(s)) == s` com entrada binária encontrou dois defeitos no Mercurial; o Hypothesis reduz o caso falho ao exemplo mais simples e guarda falhas num banco local que reexecuta primeiro o exemplo que falhou. O artigo não trata de idempotência.
- Lacuna: o artigo original de QuickCheck (Claessen e Hughes, 2000) foi baixado como PDF comprimido e não pôde ser lido nesta sessão; não é usado como fonte.

---

## 5. Campos numéricos com unidade em bibliotecas e ferramentas

### 5.1 React Aria NumberField (componente e hook)
- URLs: https://react-aria.adobe.com/NumberField e https://react-aria.adobe.com/NumberField/useNumberField
- Acesso: 2026-10-08. As páginas não exibem versão. O registro npm lista, em 2026-10-08, react-aria-components 1.22.0 e @react-aria/numberfield 3.13.1.
- Fatos documentados:
  - Props: `value`, `defaultValue`, `onChange(number)`, `minValue`, `maxValue`, `step` (passos contados a partir do mínimo), `formatOptions` (Intl.NumberFormatOptions; controla a exibição e quais caracteres podem ser digitados), `isWheelDisabled`, `commitBehavior` (padrão `'snap'`; com `'validate'` o valor não é ajustado, só validado), `validate`, `validationBehavior` ('native' ou 'aria'), `isInvalid`.
  - `onChange` dispara quando o usuário termina a edição (blur), ao incrementar ou ao decrementar. O formulário recebe o número bruto, não o texto formatado.
  - Sistemas numéricos trocados por `I18nProvider`.
  - A página não documenta Escape, Enter nem arraste de rótulo.

### 5.2 @react-stately/numberfield: código de useNumberFieldState
- URL: https://cdn.jsdelivr.net/npm/@react-stately/numberfield/src/useNumberFieldState.ts (código-fonte; URL sem versão serve a mais recente; registro npm informa 3.12.1 em 2026-10-08)
- Acesso: 2026-10-08.
- Fatos documentados pelo código (lido por resumo):
  - `commit()` em cinco passos: (1) texto vazio vira NaN e o texto é restaurado ou limpo; (2) se o parse dá NaN, o texto volta ao formatado do valor atual e não há mudança; (3) sem `step`, limita entre mínimo e máximo; com `step`, `snapValueToStep`; (4) o valor passa por format e depois por parse, o que aplica a precisão da formatação; (5) grava o número, atualiza o texto e executa `commitValidation()`. No modo controlado o texto usa o valor anterior para o campo não exibir algo diferente do que o pai controla.
  - `validate(texto)` devolve `numberParser.isValidPartialNumber(texto, minValue, maxValue)`; aceita entradas parciais.
  - `increment` e `decrement` usam `safeNextStep`: com valor NaN partem do mínimo (ou do máximo ao decrementar), ou de 0; usam `handleDecimalOperation` para somar sem erro de ponto flutuante; se o resultado igualar o valor atual, o texto é atualizado manualmente porque não haveria nova renderização.
  - `onChange` passa por `useControlledState` e só ocorre quando o valor muda; o resumo marca esta última parte como inferência, porque `useControlledState` não estava no trecho.

### 5.3 @react-aria/numberfield: código de useNumberField
- URL: https://cdn.jsdelivr.net/npm/@react-aria/numberfield/src/useNumberField.ts (registro npm informa 3.13.1)
- Acesso: 2026-10-08.
- Fatos documentados pelo código (lido por resumo):
  - Enter chama `commit()`; é ignorado durante composição de texto (`isComposing`). O blur também chama `commit()`.
  - Não há tratamento de Escape no código lido.
  - Roda do mouse: ignorada quando o movimento horizontal supera o vertical; `deltaY` positivo chama `increment()`, negativo chama `decrement()`. A roda só atua com o foco dentro do campo e fora de desabilitado e somente leitura.
  - A validação parcial roda em `onChange` do input, que chama `state.validate(valor)` e só aceita o texto se for parcialmente válido. O resumo anterior do estado disse que `setInputValue` não valida; as duas leituras concordam que a validação parcial fica em `validate`, chamada pelo manipulador de `onChange`.
  - O input define `role` nulo e `aria-valuenow`, `aria-valuetext`, `aria-valuemin`, `aria-valuemax` nulos, com o comentário do código dizendo que o VoiceOver não consegue focar um spinbutton.

### 5.4 @internationalized/number: NumberParser
- URL: https://react-aria.adobe.com/internationalized/number/NumberParser
- Acesso: 2026-10-08. A página não exibe versão; o registro npm informa 3.6.9.
- Fatos documentados: `new NumberParser(locale, options)` com as opções de Intl.NumberFormat; `parse(texto)` devolve número ou `NaN`; no estilo percentual divide por 100; no estilo moeda exige `currency`; no estilo unidade exige `unit` e `unitDisplay`, e unidade parcial ou diferente dá `NaN`. `isValidPartialNumber(texto, minValue, maxValue)`: `'.'`, `'.2'` e `'10 in'` são aceitos; `'10 i'` e `'10 x'` são recusados; unidades e símbolos de moeda parciais não são aceitos. `getNumberingSystem(texto)` identifica o sistema numérico.
- Limites para este projeto: o NumberParser trata unidades do Intl (inch e afins), não unidades CSS (`px`, `rem`, `vh`, `%` como unidade de comprimento). Não há como cadastrar unidades CSS sem tratá-las fora dele.

### 5.5 Base UI NumberField (Radix não tem campo numérico)
- URL: https://base-ui.com/react/components/number-field
- Acesso: 2026-10-08. Pacote @base-ui/react, versão 1.8.0 conforme a página.
- Fatos documentados: partes Root, ScrubArea, ScrubAreaCursor, Group, Input, Increment, Decrement. Props: `value`, `defaultValue`, `onValueChange`, `onValueCommitted`, `min`, `max`, `step` (padrão 1, aceita `'any'`), `smallStep` (padrão 0,1), `largeStep` (padrão 10), `snapOnStep`, `allowOutOfRange`, `format`, `locale`, `allowWheelScrub` (padrão falso). Alt usa `smallStep` e Shift usa `largeStep`. ScrubArea: `direction`, `pixelSensitivity` (padrão 2), `teleportDistance`; o cursor usa Pointer Lock API e fica desativado no Safari. `onValueCommitted` dispara no blur após digitação, ao soltar o ponteiro depois de scrub ou de botão, e junto de `onValueChange` em teclado e roda; a documentação avisa que é evento genérico. Escape não é mencionado.
- Observação: a lista de componentes do Radix Primitives não foi aberta nesta pesquisa; a afirmação de que o Radix não tem campo numérico não está sustentada por fonte aberta e fica como lacuna.

### 5.6 react-input-with-drag
- URL: https://github.com/designbyadrian/react-input-with-drag
- Acesso: 2026-10-08. Versão não exibida; o repositório consta como descontinuado em favor de React Interactive Input.
- Fatos documentados: prop `modifiers` com padrão `{ shiftKey: 0.1 }`; com `step` 0,1, Shift ajusta em 0,01; `onChange` dispara na alteração e ao terminar o arraste. A conversão de pixels em incremento e o uso de pointer lock não constam na página.

### 5.7 Chrome DevTools: edição de valores CSS
- URLs: https://developer.chrome.com/docs/devtools/shortcuts, https://developer.chrome.com/docs/devtools/css/reference, https://developer.chrome.com/docs/devtools/css
- Acesso: 2026-10-08. Páginas sem número de versão do Chrome, exceto a nota abaixo.
- Fatos documentados:
  - Painel Styles: clicar no valor e usar seta para cima ou para baixo muda 1; Shift muda 10; Command ou Control muda 100; Option ou Alt muda 0,1. Na referência, a seta sem modificador muda 0,1 quando o valor está entre -1 e 1, e Shift mais Command (Mac) ou Control mais Shift mais Page Up (Windows e Linux) muda 100.
  - Tab e Shift mais Tab editam a próxima ou a anterior propriedade ou valor.
  - Shift mais clique na caixa de cor alterna a representação (RGB, hex, oklch e outras). Shift mais clique na caixa de ângulo cicla as unidades de ângulo (deg, grad, rad, turn). No relógio de ângulo, Shift mais clique ou arraste ajusta de 15 em 15.
  - A seção "alterar valores de comprimento" por arraste do número (Shift em passos de 10) e menu de unidade está marcada como obsoleta desde o Chrome 123 e reativável em Experiments.
  - Editor de sombra (box-shadow e text-shadow): tipo, deslocamentos X e Y, blur e spread.
  - Caixa do modelo de caixa: duplo clique, digitar e Enter; aceita `25%` e `10vw`, padrão em pixels.
  - Lacuna: as páginas não documentam Enter, Escape nem Page Up e Page Down na edição de valor do painel Styles.

### 5.8 WAI-ARIA APG, padrão spinbutton
- URL: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
- Acesso: 2026-10-08. Data da página não exibida.
- Fatos documentados: seta para cima aumenta e seta para baixo diminui; Home vai ao mínimo e End ao máximo (quando existem); Page Up e Page Down (opcionais) mudam por passo maior. Propriedades `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` (texto legível quando o número não basta).

### 5.9 MDN, input type number
- URL: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number
- Acesso: 2026-10-08. Data da página não exibida.
- Fatos documentados: `step` padrão 1; a base do passo é `min`, depois `value`, depois 0; `step="any"` desliga a restrição de passo; entrada não numérica é inválida e campo vazio é válido salvo `required`; `pattern` não é suportado; a página não especifica o que `value` devolve para texto inválido e não trata de separador decimal por locale. `type="number"` tem papel implícito spinbutton.
- Avaliação: o campo nativo não aceita unidade nem expressão; por isso o campo do editor é de texto com contrato próprio.

### 5.10 Figma, Webflow, Framer, tldraw
- Páginas abertas: https://help.figma.com/hc/en-us/articles/360040449873-Set-small-and-big-nudge-values, https://help.figma.com/hc/en-us/articles/360040328653-Use-Figma-products-with-a-keyboard, https://university.webflow.com/videos/input-values-and-units, https://elementor.com/help/number-scrubber/
- Acesso: 2026-10-08.
- Fatos documentados: as duas páginas do Figma abertas não tratam de campos numéricos, de operações aritméticas nos campos nem de arraste do rótulo; a página do Webflow University diz só que o valor pode ser digitado por teclado ou mouse e remete a um vídeo; a página do Elementor abriu sem o corpo do artigo. Webstudio redirecionou para a página inicial. Framer e tldraw não tiveram página aberta.
- Lacuna registrada: o comportamento de arraste do rótulo, de Shift e de unidades no Figma, no Webflow e no Framer não está sustentado por fonte aberta nesta pesquisa. Resultados de busca mencionam Shift em passos de 10 no Webflow e arraste de rótulo com Ctrl ou Cmd e Alt no Elementor, mas buscas não contam como leitura e esses itens não entram como fato.

---

## 6. Valores CSS (especificação)

### 6.1 CSS Values and Units Module Level 4
- URL: https://www.w3.org/TR/css-values-4/
- Acesso: 2026-10-08. Foram lidos os primeiros 100000 de 253104 caracteres da página; o restante não foi lido.
- Fatos documentados: `<number>` é inteiro ou decimal com ponto, expoente opcional com `e` ou `E`, sinal opcional. `<dimension>` é número seguido imediatamente de identificador de unidade. Em `<length>`, zero não precisa de unidade; quando um 0 puder ser `<number>` ou `<length>` (como em `line-height`), é interpretado como número. `<percentage>` é número seguido de `%`. Unidades são insensíveis a caixa ASCII e serializam em minúsculas (`1Q` vira `1q`). A precisão é definida pela implementação; arredondar para o inteiro mais próximo arredonda em direção a mais infinito quando a fração é exatamente 0,5. A seção lida não define uma serialização textual canônica de números.
- Consequências para o contrato (avaliação): `10PX` e `10px` são o mesmo valor, então `format` precisa normalizar a caixa; `1e3px` é válido e `format` precisa decidir se o reescreve; `0` sem unidade é válido em comprimento e inválido onde a gramática exige dimensão com unidade em outra propriedade.

---

## 7. Máquina de estados para rascunho, confirmação e cancelamento

### 7.1 XState v5, exemplo de campo de texto
- URL: https://stately.ai/docs/xstate
- Acesso: 2026-10-08. Documentação do XState v5 (usa `createActor`).
- Fatos documentados: eventos são objetos `{ type }`; transições podem mudar de estado (`target`) ou só executar `actions`; `context` muda com `assign`. O exemplo oficial de campo de texto tem estados `reading` e `editing`: em `editing`, `text.change` atualiza `value`; `text.commit` copia `value` para `committedValue` e volta a `reading`; `text.cancel` restaura `committedValue` e volta a `reading`.
- Lacuna: guards e setup não constam no trecho lido; a página não traz exemplo de estado intermediário de confirmação.

### 7.2 Padrões observados nas bibliotecas lidas (fatos de 5.2, 5.3 e 5.5)
- React Aria: o rascunho é o texto do input; Enter e blur chamam `commit()`; `commit()` tem retorno antecipado para texto vazio e para texto não interpretável (o texto volta ao último valor confirmado e nenhuma gravação ocorre). Não há Escape no código lido.
- Base UI: `onValueChange` acompanha cada mudança e `onValueCommitted` marca o fim do gesto (blur, soltar o ponteiro).
- XState: `committedValue` e `value` separados no contexto; `cancel` restaura o confirmado.

### 7.3 Avaliação (pesquisador): máquina do campo
Estados propostos: `ocioso` (texto igual ao confirmado), `rascunho` (texto diferente, com resultado de validação parcial), `gesto` (arraste ou roda em curso, com valor provisório), `invalido` (rascunho que não passa na validação, ainda editável). Eventos: digitar, confirmar (Enter, blur, soltar), cancelar (Esc), intenção de comando (botão, tecla, roda, arraste), atualização vinda da store. O contrato do campo declara, para cada evento, qual ação a store recebe; a máquina é um único módulo do registro, e nenhum campo implementa a sua. A regra de retorno da store ao campo (texto igual ao confirmado, a não ser que haja rascunho) fica na transição `atualização vinda da store`: no estado `rascunho` a store não sobrescreve o texto, no estado `ocioso` sobrescreve com `format(valor)`. Isso se alinha à nota do React Aria de que o campo controlado não exibe algo diferente do que o pai controla.

---

## 8. Técnicas e o que cada uma detecta

| Técnica | Como se faz | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Round-trip e idempotência com fast-check | `fc.property(arbitrarioDoCampo, x => format(parse(format(parse(x)))) igual a format(parse(x)))` e `parse(format(v))` igual a `v` para `v` canônico, para cada campo do registro | milissegundos por campo com 100 execuções | `-0`, perda de precisão, unidade em caixa diferente, zeros à esquerda, espaços | erro de contrato que o próprio `parse` e `format` repetem (os dois errados de forma coerente) |
| Rejeição com mensagem certa | entradas inválidas de `fc.oneof` entre quase válidas e binárias; afirmar que `validate` devolve recusa e que a chave da mensagem é a declarada para a regra violada | milissegundos | valor inválido aceito; mensagem trocada ou em inglês na interface pt-BR | mensagem correta no código mas truncada na tela (exige medição no navegador) |
| Oráculo css-tree | para cada valor aceito pelo campo, `lexer.matchProperty` da propriedade correspondente; para cada valor emitido por `format`, o mesmo | cerca de 10 a 100 microssegundos por valor | valor emitido que o navegador recusaria; unidade ou palavra-chave fora da gramática | calc malformado, blur negativo, canais de cor fora de faixa, `var()` (ver 1.6) |
| Todas as portas dão o mesmo resultado (fast-check commands) | comandos por porta enviam a mesma intenção; o modelo guarda o valor esperado; afirmar o mesmo valor gravado | dezenas de milissegundos | porta que decide por conta própria; diferença entre tecla, botão e roda no mesmo estado | diferença visível apenas no layout |
| JSON Schema do registro | `z.toJSONSchema` do contrato com `io: 'input'` e `io: 'output'` e comparação com o contrato esperado | microssegundos | divergência entre limites declarados e aplicados quando os limites vêm só de checks nativos | limites escritos em `refine` com função |
| Texto mais longo cabendo no campo | medir no navegador (largura do texto formatado do maior valor contra a largura do campo) com o maior `format` gerado por `fc` | exige navegador | corte e quebra de linha | nada fora das telas medidas |

Detalhe do custo de css-tree por chamada: números da seção 1.6. A medição do texto no campo depende de layout e só o navegador a calcula; o registro pode exportar a lista dos maiores textos formatados por campo para a medição.

---

## 9. Conclusões da pesquisa

Fatos:
1. O lexer do css-tree 3.2.1 recusa unidade desconhecida, falta de unidade em comprimento, faixa não negativa da gramática e vírgula sobrando; aceita calc malformado, canais de cor fora de faixa e blur negativo.
2. O texto de erro do lexer é inglês e o campo útil é `mismatchOffset`.
3. O zod 4.6.5 oferece `z.codec` com a mesma validação de faixa em `decode` e `encode`, `z.config` com locale `ptBR`, e `z.toJSONSchema` que aceita codec.
4. O fast-check 4.10.2 oferece `stringMatching`, `oneof` ponderado, `mapToConstant`, `commands` e `modelRun`, `seed` e `path` para reprodução.
5. React Aria confirma no código o ciclo parse, limitação, ajuste ao passo, reformatação e gravação no Enter e no blur; Base UI confirma `onValueCommitted` separado de `onValueChange` e Alt e Shift como passo pequeno e grande; Chrome DevTools usa 1, 10, 100 e 0,1 para seta, Shift, Ctrl ou Cmd e Alt.

Avaliação:
1. O registro único deve guardar, por campo: gramática (regex ou propriedade CSS), lista de unidades, faixa, passo pequeno, normal e grande, chave de mensagem por regra, comando de gravação e função de retorno da store. Os testes leem apenas o registro.
2. A validação em camadas é necessária: forma (regex ou templateLiteral), gramática (lexer) e domínio (checks do zod com chave de mensagem própria).
3. Estabilidade de `format(parse(x))` é idempotência de normalização; `-0` e a caixa da unidade são os casos de borda comprovados nesta pesquisa.

Lacunas que ficam abertas: comportamento de Figma, Webflow, Framer e tldraw; lista do Radix; Escape em React Aria e Base UI; QuickCheck (2000) não lido; Enter e Escape no painel Styles do Chrome DevTools.
