# C4 — Detectar quebra de interface sem abrir o navegador

Data da pesquisa: 2026-10-08. Todas as fontes abaixo foram abertas com WebFetch nesta data. Onde a página não informa a versão, isso está dito. Nenhum pacote foi instalado.

Convenção: "Fato documentado" vem da fonte citada. "Avaliação" é interpretação minha para este projeto (React 19.3.0, TypeScript 6.0.3, Vite 8.3.0, Vitest 5.0.1, Playwright 1.63.0, css-tree 3.2.1, happy-dom 20.14.5, Node 24, Windows).

---

## 1. Pretext (@chenglou/pretext)

### Fontes
- https://github.com/chenglou/pretext (README, acesso 2026-10-08, conteúdo do ramo main, 1.819 commits).
- https://raw.githubusercontent.com/chenglou/pretext/main/package.json (acesso 2026-10-08): versão 0.0.9.
- https://registry.npmjs.org/@chenglou/pretext/latest (acesso 2026-10-08): versão 0.0.9, campo sideEffects igual a false, sem campo engines, sem dependências de execução.
- https://raw.githubusercontent.com/chenglou/pretext/main/CHANGELOG.md (acesso 2026-10-08): 0.0.9 em 2026-09-07; seção Unreleased com mudanças posteriores.
- https://raw.githubusercontent.com/chenglou/pretext/main/src/measurement.ts (acesso 2026-10-08, ramo main).
- https://raw.githubusercontent.com/chenglou/pretext/main/PLATFORM_BUGS.md (acesso 2026-10-08, ramo main).
- https://raw.githubusercontent.com/chenglou/pretext/main/DEVELOPMENT.md (acesso 2026-10-08, ramo main).
- https://raw.githubusercontent.com/chenglou/pretext/main/RESEARCH.md (acesso 2026-10-08; só os primeiros 100000 de 473775 caracteres foram lidos pela ferramenta).
- https://github.com/chenglou/pretext/issues?q=node+canvas (acesso 2026-10-08): 52 resultados; nenhum título visível cita @napi-rs/canvas, skia-canvas ou node-canvas.

### Fatos documentados
- O que mede: altura e número de linhas de parágrafo multilinha sem DOM; também larguras de linha, cursores e largura natural da linha mais larga.
- API: `prepare(text, font, options?)` devolve PreparedText; `layout(prepared, maxWidth, lineHeight)` devolve `{ height, lineCount }`. Variantes: `prepareWithSegments`, `layoutWithLines`, `walkLineRanges`, `measureLineStats`, `measureNaturalWidth`, `layoutNextLine`, `layoutNextLineRange`, `materializeLineRange`, `prepareRichInline` (entrada separada "./rich-inline"), `clearCache()`, `setLocale(locale?)`.
- Dependência de canvas: o código de medição escolhe o canvas em ordem. Primeiro `new OffscreenCanvas(1, 1).getContext('2d')`; se não existir, `document.createElement('canvas').getContext('2d')`; se nenhum existir, lança `Error('Text measurement requires OffscreenCanvas or a DOM canvas context.')`. Cada segmento é medido com `measureText(text).width` e guardado em cache por fonte.
- Em Node puro (sem document e sem OffscreenCanvas) o Pretext lança esse erro. O código não tem caminho específico para Node. O README não menciona Node. DEVELOPMENT.md cita Bun como executor principal e diz que os testes offline rodam sem navegador, mas a medição real exige navegador.
- Perfil de engine: lê `navigator.userAgent`; quando não reconhece o motor, assume `'blink'`.
- Intl.Segmenter: exigido para scripts sem espaço (tailandês, lao, khmer, birmanês). Também exige escapes Unicode `\p{...}` em regex.
- Precisão declarada: o projeto diz usar o motor de fontes do navegador como referência ("ground truth"). Não publica percentual de acerto. Os dados de quebra de linha são cópias manuais de Blink, WebKit e Gecko. O catálogo de comportamento (cerca de 30 MB) guarda larguras medidas por bisseção nos navegadores e não se regenera offline.
- Cálculo de encaixe por motor: Chrome em 1/64 px, Safari em float32, Firefox em unidades de app (RESEARCH.md). Overflow de até 0.005 px não quebra linha (CHANGELOG, seção Unreleased).
- Windows: PLATFORM_BUGS.md diz "Windows is untested"; as medições do projeto são de macOS com device pixel ratio 2. Não há nada sobre DirectWrite nem hinting.
- Limites de CSS: `white-space` apenas `normal` e `pre-wrap`; `word-break` apenas `normal` e `keep-all`; `line-break: auto`; `letter-spacing` só numérico em px; sem suporte a `font-feature-settings`, `font-variant-numeric`, `font-variation-settings`, `font-optical-sizing`; sem `text-wrap: balance` ou `pretty`, sem `hyphens: auto`; sem níveis bidi. Pede tamanhos de fonte inteiros em px, nome de família em inglês, `lang` no html e `document.fonts.load()` antes de preparar; largura máxima arredondada para inteiro ou quarto de pixel.
- Discrepâncias canvas versus DOM registradas em PLATFORM_BUGS.md:
  - Chrome: o Canvas faz shaping palavra a palavra, cortando nos espaços e ao redor de CJK, e perde o kerning entre os cortes. Exemplo do documento: Arial 15 px, "x A x" mede 33.34 px no Canvas e 31.69 px na página. O documento chama isso de maior causa de linhas erradas no Chrome.
  - Chrome: emoji mede até 4 px a mais entre 14 e 16 px, sem diferença a partir de 24 px (macOS).
  - Chrome: a largura de uma string pode depender do que o contexto mediu antes (parênteses com texto árabe ou hebraico).
  - Firefox: o Canvas arredonda o tamanho da fonte para 7 bits significativos e o DOM usa 10 bits; 13.33 px muda o número de linhas.
  - Safari: o Canvas fora do DOM não tem idioma; com letterSpacing mantém ligaduras opcionais que o CSS desliga.
  - Todos: contexto Canvas que mediu antes da fonte carregar continua com a fonte de reserva.
- CHANGELOG (Unreleased, ainda não publicado na 0.0.9): Chrome passa a consultar o Canvas sobre pares de letras para ler kerning (mais chamadas a measureText); com letterSpacing, fontes com ligaduras fi, fl, ffi medem as palavras sem ligadura, como o navegador desenha; Safari fica levemente subestimado nesse caso.

### Avaliação
- O Pretext não roda em Node sem um OffscreenCanvas. Um shim que exponha `globalThis.OffscreenCanvas` como classe cujo `getContext('2d')` devolva um contexto de @napi-rs/canvas ou skia-canvas satisfaz a checagem do código lido. Isso não foi executado nesta pesquisa.
- A precisão declarada vale para a medição feita pelo canvas do próprio navegador. Com canvas do Skia em Node, a largura vem do Skia com as fontes registradas por arquivo; o Pretext não declara nem testa essa combinação. A compensação de kerning do Chrome depende de o canvas responder a pares de letras como o Chrome responde; isso é desconhecido para o Skia em Node.
- O Pretext só cobre texto: não calcula caixa de flex, padding, min-width, overflow. Detecta "este texto quebra em N linhas nesta largura" e "esta palavra mais larga excede a coluna", não "este controle está coberto" nem "fora da janela".
- Custo: `prepare` mede cada segmento uma vez; `layout` é aritmética sobre larguras em cache (README).

---

## 2. Canvas para Node

### Fontes
- https://registry.npmjs.org/@napi-rs/canvas/latest (acesso 2026-10-08): versão 1.0.10; engines node >= 10; optionalDependencies inclui @napi-rs/canvas-win32-x64-msvc 1.0.10.
- https://raw.githubusercontent.com/Brooooooklyn/canvas/main/package.json (acesso 2026-10-08): napi.targets inclui x86_64-pc-windows-msvc e aarch64-pc-windows-msvc.
- https://raw.githubusercontent.com/Brooooooklyn/canvas/main/index.d.ts (acesso 2026-10-08, @napi-rs/canvas 1.0.10): tipos.
- https://github.com/Brooooooklyn/canvas/releases (acesso 2026-10-08): v1.0.10 publicada em 2026-10-01 (corrige use-after-free em ctx.restore com CanvasPattern; atualiza suporte ao Chrome para m156); v1.0.9 invalida o cache de typefaces do FontCollection ao registrar fonte.
- https://github.com/samizdatco/skia-canvas/releases (acesso 2026-10-08): estável 3.0.8 (25 de setembro); v4.0.0-rc9 em pré-lançamento, publicada em 6 de outubro.
- https://raw.githubusercontent.com/samizdatco/skia-canvas/master/package.json (acesso 2026-10-08): versão 4.0.0-rc9; engines node >=18; script download baixa binário pré-compilado ou compila.
- https://registry.npmjs.org/skia-canvas/latest (acesso 2026-10-08): versão 3.0.8.
- https://skia-canvas.org/getting-started (acesso 2026-10-08, versão não informada pela página): Linux, macOS ou Windows; binários pré-compilados baixados para arm64 ou x64; N-API v8; sem binário, compila com Rust, compilador C, Python 3 e Ninja.
- https://skia-canvas.org/api/font-library (acesso 2026-10-08, conteúdo da série 3.x, que cita a v3.0).
- https://skia-canvas.org/api/context (acesso 2026-10-08).
- https://github.com/Automattic/node-canvas (acesso 2026-10-08): v3 estável (`npm install canvas`); v4 em pré-lançamento (`npm install canvas@next`); Node mínimo 22 na v4; binários pré-compilados para Windows x64, x86 e arm64.

### Fatos documentados
- @napi-rs/canvas 1.0.10 (Skia via Rust/N-API, sem dependência de sistema):
  - `GlobalFonts.registerFromPath(path: string, nameAlias?: string): FontKey | null` (caminho absoluto); `GlobalFonts.register(font: Buffer, nameAlias?: string)`; `GlobalFonts.families` lista famílias com weight, width e style.
  - `TextMetrics` com `width`, `actualBoundingBoxAscent/Descent/Left/Right`, `fontBoundingBoxAscent/Descent`, `emHeightAscent/Descent`, `alphabeticBaseline`, `hangingBaseline`, `ideographicBaseline`.
  - Propriedades de texto no contexto: `letterSpacing`, `wordSpacing` (strings), `fontKerning` ('auto' | 'none' | 'normal'), `textRendering` ('auto' | 'geometricPrecision' | 'optimizeLegibility' | 'optimizeSpeed'), `fontVariantCaps`.
  - Binário Windows x64 existe como pacote opcional win32-x64-msvc.
- skia-canvas:
  - `FontLibrary.use([...caminhos])` (família vinda dos metadados), `FontLibrary.use(alias, [...caminhos])`, `FontLibrary.use({alias: [...]})`; aceita .otf, .ttf, .woff, .woff2; `FontLibrary.has`, `FontLibrary.family(name)`, `FontLibrary.reset()`.
  - `measureText(str, [width])` devolve TextMetrics com a extensão `.lines` (x, y, width, height, baseline, ascent, descent, startIndex, endIndex, runs por fonte). Com `textWrap = true`, `measureText` quebra o texto em linhas de acordo com a largura de coluna dada, o que dá número de linhas e altura sem Pretext.
  - `fontHinting` fica desligado por padrão "para aproximar a renderização dos navegadores"; `letterSpacing` e `fontVariant` com valores CSS 3 suportados.
  - A página da instalação não cita Windows x64 pelo nome; diz Linux, macOS ou Windows com binários para arm64 ou x64.
  - A v4.0.0-rc9 (pré-lançamento) instancia fontes variáveis para wght, wdth e opsz e torna kerning e antialiasing configuráveis.
- node-canvas: backend Cairo; a página não documenta as propriedades de measureText além de `width`; recomenda `FontFace` e `fonts.add()` para fontes na v4.

### Avaliação
- Para fontes registradas por arquivo e execução no Windows x64, @napi-rs/canvas 1.0.10 é a opção estável com binário Windows confirmado no metadado npm. skia-canvas 3.0.8 é estável e tem `textWrap` com `.lines`, mas a página oficial não nomeia Windows x64. node-canvas v3 tem menos informação de medição documentada.
- Nenhum deles usa DirectWrite para medir; todos usam Skia (ou Cairo). Fato não verificado nesta pesquisa: igualdade de largura entre canvas Node e o Chrome do Windows. Só uma medição lado a lado no Chrome prova isso.

---

## 3. Leitura direta de métricas de fonte

### Fontes
- https://github.com/opentypejs/opentype.js (acesso 2026-10-08; a página não informa versão).
- https://registry.npmjs.org/opentype.js/latest (acesso 2026-10-08): versão 2.0.0, sem dependências de execução.
- https://github.com/foliojs/fontkit (acesso 2026-10-08; sem versão na página).
- https://registry.npmjs.org/fontkit/latest (acesso 2026-10-08): versão 2.0.4.
- https://github.com/harfbuzz/harfbuzzjs (acesso 2026-10-08; sem versão na página).
- https://registry.npmjs.org/harfbuzzjs/latest (acesso 2026-10-08): versão 1.6.3, cerca de 1,3 MB descompactado, 9 arquivos, entrada dist/index.mjs mais arquivos wasm.

### Fatos documentados
- opentype.js: `getAdvanceWidth(text, fontSize, options)` equivale a `measureText().width` do canvas; `stringToGlyphs(string)` pode devolver número de glifos diferente do de caracteres por causa de substituições; `getKerningValue(leftGlyph, rightGlyph)` devolve o par de kerning ou 0; a página afirma suporte a kerning por GPOS ou tabela kern; features suportadas hoje: "liga" e "rlig"; `charToGlyph` assume mapeamento 1 para 1; leitura em Node via `opentype.parse(buffer)`.
- fontkit 2.0.4: `fontkit.openSync(filename, postscriptName)`, `fontkit.open`, `fontkit.create`; `font.layout(string, features)` devolve GlyphRun com glifos e posições (`xAdvance`, `yAdvance`, `xOffset`, `yOffset`); `font.widthOfGlyph(id)`; GSUB, GPOS, AAT morx e fontes variáveis. A página não cita árabe nem índicos pelo nome.
- harfbuzzjs 1.6.3: WASM do HarfBuzz compilado com `-DHB_TINY`, então algumas funções não existem; fluxo de uso: `new hb.Blob(arrayBuffer)`, `new hb.Face(blob)`, `new hb.Font(face)`, `new hb.Buffer()`, `buffer.addText`, `guessSegmentProperties()`, `hb.shape(font, buffer)`, `buffer.getGlyphPositions()` (campos xAdvance, yAdvance, xOffset, yOffset) e `getGlyphInfos()` (o campo `codepoint` é, na verdade, o ID do glifo).

### Avaliação
- Para largura de uma string em uma fonte e tamanho conhecidos, harfbuzzjs dá o shaping completo (kerning GPOS, ligaduras, scripts complexos) com o mesmo motor de shaping que o Chrome usa. Fontkit dá GSUB e GPOS, mas o shaping de scripts complexos não está documentado na página. opentype.js cobre kerning e liga/rlig e basta para latim (pt-BR) com a fonte da interface.
- Nenhum deles faz quebra de linha nem layout; é preciso somar larguras de palavras e aplicar as regras de quebra. O Pretext já faz isso sobre larguras de canvas. Uma largura vinda de HarfBuzz poderia alimentar um shim de canvas (avaliação; não verificado).
- Largura lida do arquivo de fonte não inclui o arredondamento do rasterizador do navegador. Não há medição própria nesta pesquisa que quantifique a diferença.

---

## 4. Motores de layout fora do navegador

### Fontes
- https://registry.npmjs.org/yoga-layout/latest (acesso 2026-10-08): versão 3.2.1.
- https://www.yogalayout.dev/docs/styling/ (acesso 2026-10-08; sem versão na página).
- https://www.yogalayout.dev/docs/getting-started/configuring-yoga (acesso 2026-10-08).
- https://www.yogalayout.dev/docs/advanced/external-layout-systems (acesso 2026-10-08).
- https://raw.githubusercontent.com/facebook/yoga/main/javascript/src/wrapAssembly.ts (acesso 2026-10-08, ramo main) e https://raw.githubusercontent.com/facebook/yoga/main/javascript/README.md (acesso 2026-10-08).
- https://github.com/DioxusLabs/taffy (acesso 2026-10-08; sem versão na página).
- https://docs.rs/taffy/latest/taffy/ (acesso 2026-10-08): taffy 0.14.0.
- https://registry.npmjs.org/taffy-js/latest (acesso 2026-10-08): 0.2.12, obsoleto, renomeado para taffy-layout.
- https://registry.npmjs.org/taffy-layout/latest (acesso 2026-10-08): 3.0.0, MIT, Node >= 18, ES module.
- https://github.com/ByteLandTechnology/taffy-layout (acesso 2026-10-08).
- https://registry.npmjs.org/satori/latest (acesso 2026-10-08): 0.44.0, Node >= 16.
- https://github.com/vercel/satori e https://github.com/vercel/satori/blob/main/README.md (acesso 2026-10-08).

### Fatos documentados
- yoga-layout 3.2.1 (WASM): `Yoga.Node.create()`, `setFlexDirection`, `setWidth`, `setMargin`, `insertChild`, `calculateLayout(width, height, direction?)`, `getComputedLayout()` devolve `left`, `right`, `top`, `bottom`, `width`, `height`, `hadOverflow`. Propriedades documentadas: align-content, align-items, aspect-ratio, display, flex-basis/grow/shrink, flex-direction, flex-wrap, gap, insets, justify-content, margin, padding, border, position, min/max width e height. A página não lista grid nem overflow. Comportamento sempre border-box. Padrões diferentes da web (column, flex-shrink 0) a menos que se ative `UseWebDefaults`. Sem unidades CSS (só pontos e porcentagem).
- Medição de texto: `setMeasureFunc(measureFunc: MeasureFunction | null)` no código-fonte, com `(width, widthMode, height, heightMode) => { width, height }`; MeasureMode: Exactly, AtMost, Undefined (correspondem a stretch-fit, fit-content, max-content). A página do site chama o método de `setMeasureFunction`; o código-fonte do ramo main usa `setMeasureFunc`. Yoga não implementa layout de texto.
- Memória: a página do site manda chamar `free()` e `freeRecursive()`; o código do ramo main não expõe `free` e usa FinalizationRegistry. As duas fontes divergem; a conferência precisa ser feita no pacote instalado.
- Taffy 0.14.0: algoritmos block (com float), flexbox, grid (features padrão); `TaffyTree::compute_layout_with_measure` recebe closure para folhas. O README oficial afirma que nem Yoga nem Taffy implementam layout de texto. Binding JS: taffy-layout 3.0.0 expõe `loadTaffy()`, `TaffyTree` (`newLeaf`, `newLeafWithContext`, `computeLayout`, `computeLayoutWithMeasure`, `getLayout`), `Style`, `Layout` (x, y, width, height); exige BigInt integrado ao WASM e tipos de referência. O mantenedor é um terceiro (ByteLandTechnology), não o DioxusLabs.
- Satori 0.44.0: renderiza JSX para SVG; layout de flexbox, grid e bloco com Taffy (conforme README do ramo main); texto com layout próprio e HarfBuzz; fontes TTF, OTF e WOFF (sem WOFF2) passadas em `fonts` com `name`, `data`, `weight`, `style`; só as fontes passadas são usadas; `whiteSpace: break-spaces` vira `pre-wrap`; `overflowWrap` não suportado; `textOverflow: ellipsis` e `lineClamp` só em texto sem elementos inline; subgrid, display table e ruby lançam erro; não replica o navegador com precisão total.

### Avaliação
- Esses motores medem a árvore que o programador descreve neles, não o DOM e o CSS reais do builder. Usá-los exige traduzir o CSS próprio para estilo Yoga ou Taffy, o que perde cascata, seletores, variáveis, unidades e o mínimo automático de itens flex. A tradução é fonte de falso positivo e de falso negativo.
- Satori aceita um subconjunto de CSS inline e não lê folhas de estilo; não serve para o CSS do builder sem conversão.

---

## 5. Pseudo-localização e expansão de texto

### Fontes
- https://developer.android.com/guide/topics/resources/pseudolocales (acesso 2026-10-08).
- https://learn.microsoft.com/en-us/windows/win32/intl/pseudo-locales (acesso 2026-10-08; atualizada em 2025-03-11).
- https://learn.microsoft.com/en-us/windows/win32/intl/using-pseudo-locales-for-localization-testing (acesso 2026-10-08; atualizada em 2025-03-11).
- https://github.com/tryggvigy/pseudo-localization (acesso 2026-10-08).
- https://registry.npmjs.org/pseudo-localization/latest (acesso 2026-10-08): versão 3.1.3, sem dependências de execução.
- https://formatjs.github.io/docs/tooling/cli/ (acesso 2026-10-08; sem versão na página).
- https://www.w3.org/International/articles/article-text-size (acesso 2026-10-08).

### Fatos documentados
- Android: pseudolocale en-XA acrescenta acentos latinos, expande o texto original com texto não acentuado e envolve cada mensagem em colchetes; ar-XB inverte a direção do texto (ordem dos caracteres) para testar RTL. A página não dá percentual de expansão.
- Windows: pseudo-locales qps-ploc (base, LCID 0501), qps-plocm (espelhado, 09ff), qps-ploca (leste asiático, 05fe) e, a partir do Windows 10, qps-Latn-x-sh. Exemplo de saída da página para o base: `[Шěđлеśđαỳ !!!], 8 ōf [Μäŕςћ !!] ōf 2006`. No Windows 10 versão 1803 ou mais nova, editar o registro não habilita a enumeração, mas as APIs NLS aceitam os nomes diretamente.
- Pacote pseudo-localization 3.1.3: `pseudoLocalizeString(str, options?)` com `strategy` 'accented' (padrão) ou 'bidi'; `PseudoLocalizeDom.start(options?)` devolve `stop()` e aceita `blacklistedNodeNames` (padrão ['STYLE']) e `root` (padrão document.body); funciona em navegador e Node; a página não declara taxa de expansão.
- FormatJS CLI (exige `--ast`): xx-LS acrescenta sufixo de 25 letras S; xx-AC passa para caixa alta; xx-HA prefixa `[javascript]`; en-XA acentua e envolve em colchetes; en-XB usa caracteres invertidos com marcas de direção.
- W3C (tabela atribuída à IBM, "Guidelines to design global solutions", para idiomas europeus): original de até 10 caracteres expande 200 a 300 por cento; 11 a 20 caracteres, 180 a 200; 21 a 30, 160 a 180; 31 a 50, 140 a 160; 51 a 70, 151 a 170 (grafado assim no artigo); acima de 70, 130. O artigo cita o caso do Flickr com razão 2.6 para "views" traduzido para "visualizações" (português).

### Avaliação
- Pseudo-localização gera o texto de entrada para o teste de largura; sozinha não detecta nada. Combinada com medição de texto (Pretext ou largura de fonte), simula o pior caso sem depender do tradutor. A tabela IBM dá fatores de teste por faixa de comprimento; rótulos curtos exigem fator até 3 vezes.
- O pt-BR real já é o texto de produção da interface. Medir o arquivo de mensagens pt-BR é mais exato que pseudo-localizar; a pseudo-localização em en-XA serve para encontrar texto cortado em mensagens novas antes de existir a tradução.

---

## 6. Snapshots de acessibilidade do Playwright

### Fontes
- https://playwright.dev/docs/aria-snapshots (acesso 2026-10-08; documentação sem número de versão, direitos 2026).
- https://playwright.dev/docs/api/class-locator#locator-aria-snapshot (acesso 2026-10-08).
- https://playwright.dev/docs/api/class-page#page-aria-snapshot (acesso 2026-10-08).
- https://playwright.dev/docs/release-notes (acesso 2026-10-08; versão mais recente listada: 1.64).

### Fatos documentados
- `locator.ariaSnapshot()` desde a 1.49. `page.ariaSnapshot()` e as opções `depth` e `mode` ('ai' ou 'default') desde a 1.59. `expect(page).toMatchAriaSnapshot()` funcionando em Page, e a opção `boxes`, desde a 1.60. `ariaSnapshotJSON()` em page e locator, e `aria: true` no tracing, na 1.63. `page.getByRef()` na 1.64.
- Conteúdo: YAML com roles, nomes acessíveis, estados (checked, disabled, expanded, invalid, level, pressed, selected), valores de campos e URL de links. O modelo é uma restrição, não uma serialização completa; a ordem importa; modos de filhos: contain (padrão), equal, deep-equal.
- Geometria: com `boxes: true`, cada elemento ganha `[box=x,y,width,height]` em pixels CSS relativos ao viewport, como getBoundingClientRect; no JSON da 1.63, propriedade `box` com x, y, width, height.
- A documentação lida não diz se elementos ocultos por CSS entram no snapshot.

### Avaliação
- O snapshot padrão não tem geometria e não detecta corte, cobertura nem posição fora da janela. A opção `boxes` entrega retângulos, mas a geometria vem do layout do Chrome, então exige navegador: é instrumento de medição, não detecção sem navegador. Serve ao verificador de contrato (nome acessível presente, role correta, estado), com custo de uma página aberta.

---

## 7. happy-dom

### Fontes
- https://registry.npmjs.org/happy-dom/latest (acesso 2026-10-08): versão 20.14.5, engines node >=20.0.0.
- https://raw.githubusercontent.com/capricorn86/happy-dom/master/packages/happy-dom/src/nodes/element/Element.ts (acesso 2026-10-08, ramo master).
- https://raw.githubusercontent.com/capricorn86/happy-dom/master/packages/happy-dom/src/nodes/html-element/HTMLElement.ts (acesso 2026-10-08, ramo master).
- https://github.com/capricorn86/happy-dom e https://github.com/capricorn86/happy-dom/wiki (acesso 2026-10-08).
- https://github.com/capricorn86/happy-dom/wiki/Node-Canvas-Adapter (acesso 2026-10-08).

### Fatos documentados
- README: "A JavaScript implementation of a web browser without its graphical user interface." A wiki e o README lidos não trazem afirmação textual sobre layout nem sobre getBoundingClientRect.
- Código-fonte de Element: `getBoundingClientRect()` devolve `new DOMRect()` sem argumentos, com o comentário "TODO: Not full implementation"; `scrollWidth` e `scrollHeight` são inicializados com 0 e nenhum trecho lido os altera.
- Código-fonte de HTMLElement: `offsetWidth`, `offsetHeight`, `offsetLeft`, `offsetTop`, `clientWidth`, `clientHeight` são inicializados com 0 e os getters só devolvem esses valores. O arquivo não tem lógica de layout.
- DOMRect: a página lida não mostrou o construtor padrão; MDN e a especificação definem 0 como padrão.
- Wiki "Node Canvas Adapter": permite usar o pacote `canvas` (node-canvas) com `@happy-dom/node-canvas-adapter`; não cita @napi-rs/canvas nem measureText.

### Avaliação
- No happy-dom 20.14.5, as grandezas de layout lidas do DOM valem zero. Ele serve para lógica de DOM, eventos e árvore lógica; não serve para detectar corte, cobertura, quebra de linha ou posição.

---

## 8. Análise estática de CSS

### Fontes
- https://registry.npmjs.org/css-tree/latest (acesso 2026-10-08): 3.2.1; dependências mdn-data 2.27.1 e source-map-js.
- https://github.com/csstree/csstree/blob/master/README.md (acesso 2026-10-08; ramo master, sem versão).
- https://github.com/csstree/csstree/blob/master/docs/ast.md (acesso 2026-10-08).
- https://github.com/csstree/csstree/blob/master/docs/parsing.md (acesso 2026-10-08).
- https://github.com/csstree/csstree/blob/master/docs/traversal.md (acesso 2026-10-08).
- https://registry.npmjs.org/stylelint/latest (acesso 2026-10-08): 17.16.0, Node >=20.19.0.
- https://stylelint.io/user-guide/rules/ (acesso 2026-10-08).
- https://stylelint.io/developer-guide/plugins/ (acesso 2026-10-08).

### Fatos documentados
- css-tree: `parse(source, options)` com opções context ('stylesheet' padrão), atrule, positions (padrão false; `loc` com offset, line, column), onParseError, parseRulePrelude (true), parseValue (true), parseCustomProperty (false). AST: StyleSheet, Rule (prelude SelectorList, block Block), Declaration (property, important, value), Value, Identifier e outros. `walk(ast, { enter, leave, visit, reverse })`, com `this.rule`, `this.declaration`, `this.atrule`; `find`, `findLast`, `findAll`; `walk.skip` e `walk.break`. O lexer valida valores de declaração contra sintaxes do mdn-data (`csstree.lexer.matchProperty`); hoje valida apenas valores de declarações e at-rules. Parser tolerante: conteúdo inválido vira nó Raw.
- Stylelint 17.16.0: nenhuma regra nativa trata de overflow, white-space, min-width, text-overflow ou flex. `declaration-property-value-disallowed-list` proíbe pares fixos (por exemplo white-space com nowrap). Relações entre propriedades exigem plugin: `createPlugin(ruleName, ruleFunction)` com nome com namespace, `utils.report`, `root.walkDecls` e `root.walkRules` (API PostCSS).

### Técnicas (como fazer, custo, detecta, não detecta) — avaliação minha
1. `white-space: nowrap` sem `overflow` ou `text-overflow` no mesmo seletor: percorrer as regras com css-tree (`walk` com `visit: 'Rule'`, ler as declarações do `block`). Custo: milissegundos por folha, sem navegador. Detecta nowrap sem contenção declarada no mesmo bloco. Não detecta contenção herdada por outra regra que case o mesmo elemento (cascata e especificidade), ancestral que corta, nem a largura real do conteúdo.
2. Item flex sem `min-width: 0`: exige saber que o pai é `display: flex` ou `inline-flex`. Só a árvore DOM sabe isso; o CSS isolado mostra apenas seletores. Com seletores de filho direto o resultado é parcial. Não detecta item cujo pai flex vem de outro componente, nem itens com overflow diferente de visible (que zera o mínimo automático).
3. Largura fixa em px em contêineres de texto: sinal fraco; não mede o conteúdo.
- A análise estática é rápida e barata, enxerga apenas padrões declarados e não sabe a largura do texto, a do contêiner nem o que cobre o quê. Serve de primeira rede (anti-padrão sintático), não de prova de geometria.

---

## 9. Diferenças entre medida do canvas e layout do DOM

### Fontes
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText (acesso 2026-10-08).
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fontKerning (acesso 2026-10-08).
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing (acesso 2026-10-08).
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter (acesso 2026-10-08).
- PLATFORM_BUGS.md, CHANGELOG.md e RESEARCH.md do Pretext (seção 1).

### Fatos documentados
- `measureText(text)` devolve TextMetrics; Baseline desde julho de 2015.
- `fontKerning` do canvas: 'auto' (padrão; alguns navegadores desligam kerning em fonte pequena), 'normal', 'none'; corresponde ao CSS `font-kerning`; disponibilidade limitada.
- `letterSpacing` do canvas: string CSS, padrão "0px", corresponde ao CSS `letter-spacing`; Baseline 2025 (março de 2025).
- `Intl.Segmenter`: Baseline 2024 (abril de 2024), granularidades grapheme, word, sentence, ECMA-402.
- Pretext (RESEARCH.md): canvas e DOM divergem em caracteres de controle, hífen opcional, espaçamento entre letras (que desliga ligaduras no navegador), emoji, zoom, densidade de pixels e zoom só de texto. O Chrome encaixa linhas em 1/64 px; o letterSpacing do Firefox usa passos de 1/60 px.
- Não foi encontrada, nas fontes abertas, medição de hinting do DirectWrite no Windows contra canvas. O Pretext declara o Windows como não testado.

### Avaliação
- Para latim em pt-BR com letter-spacing zero e sem font-feature-settings, as fontes de erro relevantes são: kerning perdido nos espaços no Chrome (até alguns pixels por linha, segundo o Pretext), fonte de reserva quando a fonte própria não está registrada, e arredondamento do tamanho. A margem de segurança em pixels precisa de medição própria contra o Chrome do projeto.

---

## 10. Resumo por técnica (avaliação minha)

| Técnica | Como | Custo | Detecta | Não detecta |
|---|---|---|---|---|
| Pretext com OffscreenCanvas de Node | shim apontando para @napi-rs/canvas; fontes via GlobalFonts.registerFromPath | milissegundos por rótulo após o primeiro prepare; um binário nativo | texto que quebra em mais linhas que o previsto, palavra mais larga que a coluna, altura de texto | caixa do componente, padding, flex, overflow, cobertura, fora da janela; precisão contra o Chrome do Windows não declarada |
| Largura por HarfBuzz ou fontkit | ler o arquivo de fonte e somar avanços com kerning | sem canvas; leitura da fonte uma vez | largura natural de uma string | quebra de linha, layout, rasterização |
| skia-canvas com textWrap e measureText().lines | registrar fontes com FontLibrary.use | binário nativo | número de linhas e altura de um texto em uma coluna | layout; Windows x64 não nomeado na página |
| Yoga ou Taffy | traduzir CSS para estilo do motor | a tradução de CSS é o custo dominante | overflow de um modelo simplificado | semântica real do CSS do builder |
| Pseudo-localização e fatores IBM | gerar entrada de teste | trivial | casos de pior comprimento | geometria, por si só |
| Snapshots Playwright | ariaSnapshot, toMatchAriaSnapshot | página aberta | role, nome, estado; com boxes, retângulos | sem boxes, geometria; exige navegador |
| happy-dom | lógica de DOM | baixo | nenhum problema geométrico (valores zerados) | tudo que depende de layout |
| css-tree e stylelint | walk sobre a AST, plugin | milissegundos | padrões sintáticos (nowrap sem contenção) | efeito real, cascata, largura de conteúdo |

## 11. Conclusões (avaliação minha)
1. Nenhuma ferramenta sem navegador prova que um controle não está coberto ou fora da janela: isso depende do layout completo (posição, z-index, overflow de ancestrais). Yoga, Taffy e Satori não implementam o CSS do builder.
2. O que dá para antecipar sem navegador é a largura do texto contra a largura disponível: Pretext (com shim de canvas) ou soma de avanços de HarfBuzz, alimentadas com o catálogo pt-BR e com texto pseudo-expandido. A largura disponível precisa vir de um número já medido (por exemplo, valores gravados em auditoria/medicoes) ou de um token de CSS fixo.
3. A análise estática de CSS com css-tree pega anti-padrões sintáticos (nowrap sem contenção, falta de min-width: 0 em filhos diretos de flex), com taxa de falso negativo alta por causa da cascata.
4. Playwright 1.63 oferece `boxes` no snapshot de acessibilidade e `ariaSnapshotJSON`, úteis como instrumento de medição em lote no navegador, não como detecção sem navegador.
5. Antes de adotar o Pretext em Node é preciso um experimento próprio: comparar a largura do canvas Node (@napi-rs/canvas 1.0.10) com `getBoundingClientRect` no Chrome do Windows para as fontes do builder, nos tamanhos usados. O Pretext 0.0.9 não declara suporte a Node nem ao Windows; a seção Unreleased do CHANGELOG traz correções de kerning e ligadura que não estão na versão publicada.
