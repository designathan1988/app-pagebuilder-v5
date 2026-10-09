# Grupo L — decisões (verificação de 2026-10-09)

Escopo: DCS-001, DCS-002, DCS-003, DCS-004, DCS-005, DCS-006, DCS-007, DCS-008, DCS-010, DCS-011, DCS-012, DCS-014, DCS-022 de `auditoria/decisoes.md`, e as decisões do dono D-1 e DEC-70 (com a exceção de 2026-10-07) do `CLAUDE.md`, seção 5.

Linha de base dos detectores, antes de qualquer conferência: `npx vitest run --config tools/runner/model/vitest.config.ts` → `Test Files  22 passed (22)`, `Tests  61 passed (61)`, 39,9 s.

## DCS-001 — salvar, abrir e salvar dá o mesmo JSON byte a byte

- **Veredito:** parcial — o código cumpre a regra (a) nas quatro fixtures; nenhum detector do projeto prova a regra (a): o único teste de salvar compara por igualdade estrutural, que é a opção (b) que o dono recusou.
- **Provas:**
  - a gravação é uma só, determinística pela ordem das chaves do objeto: `src/core/project/archive.ts:41` `const document = new TextEncoder().encode(`${JSON.stringify(state.document, null, 2)}\n`);`
  - a abertura não reescreve o documento da versão atual: `src/core/document/migrations.ts:51` `let document = parsed as Record<string, unknown>;` e o laço só roda com `at < current` (`src/core/document/migrations.ts:53` `while (at < current) {`); a carga põe o documento lido no estado sem transformá-lo: `src/core/store/store.ts:489` `const loaded = commit({ ...state, document: outcome.document, selection: [], history: EMPTY_HISTORY, ...`.
  - corrida própria no scratchpad (`scratchpad/dcs001/roundtrip.test.ts`, a store real do editor por `createEditorStore`, `project.open` → `project.save` → `project.open` do `project.json` salvo → `project.save`, `project.json` extraído por `tools/runner/unzip.ts`): 4 de 4 passaram — `aurora` 7.291 = 7.291 bytes, `responsive-sections` 7.915 = 7.915, `grid-page` 3.217 = 3.217, `canonical` 113.447 = 113.447, iguais byte a byte em todas.
- **Achados:**
  1. Falta o detector da regra. `tests/e2e/project-save.spec.ts:56` `const second = await save(page);` salva duas vezes sem reabrir o arquivo salvo, e a conferência do conteúdo é estrutural: `tests/e2e/project-save.spec.ts:66` `expect(JSON.parse((files.get('project.json') as Buffer).toString('utf8'))).toEqual(document);`. O `toEqual` ignora a ordem das chaves e a formatação, que é exatamente a opção (b). `tools/runner/model/storage.test.ts:92` `if (twice.ok) expect(JSON.stringify(twice.document)).toBe(JSON.stringify(once.document));` confere só a migração repetida, sem passar por `project.save` nem por `project.open`. Efeito: uma mudança na abertura que reconstrua o documento com as chaves em outra ordem (uma normalização no leitor ou uma migração da versão atual) passaria por todos os detectores e quebraria a regra (a).
  2. O que a abertura de um arquivo de versão antiga devolve não é o arquivo original (a migração escreve `version` e reconstrói o objeto, `src/core/document/migrations.ts:26` `{ from: 1, to: 2, migrate: (document) => ({ ...document, version: 2 }) },`); a regra (a) parte do primeiro salvar, então isso não a quebra. Registrado só para delimitar o que foi conferido.

## DCS-002 — G7: o canvas e a exportação diferem só numa lista fechada de marcas do editor, declarada no código

- **Veredito:** parcial — a lista existe no código, mas o detector usa uma cópia dela, e ela não cobre todas as marcas que o canvas desenha e a exportação não tem.
- **Provas:**
  - a lista no código: `src/core/document/validate.ts:519` `const EDITOR_ATTRIBUTES: ReadonlySet<string> = new Set(['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style']);` — não exportada; o uso dela no arquivo é recusar esses nomes como atributo da pessoa (o comentário de `src/core/document/validate.ts:516` `// Why a name cannot be a custom attribute (feature element-attributes-aria), or null: an attribute name of HTML (a`).
  - o detector usa uma cópia escrita à mão: `tests/e2e/lote-visual.spec.ts:26` `const EDITOR_MARKS: readonly string[] = ['data-node', 'data-container', 'data-hidden', 'data-empty-text', 'data-key-context', 'data-editor-style', 'data-node-style'];`
  - a exportação não escreve as marcas: `grep "data-node\|data-container\|data-hidden" src/core/render src/core/export` sem resultado.
- **Achados:**
  1. A lista declarada não é fechada sobre o que o canvas desenha só para o editor. `src/editor/canvas/render/render.ts` declara outras marcas e elementos só do editor, fora de `EDITOR_ATTRIBUTES`: `src/editor/canvas/render/render.ts:79` `const EMBED_FRAME_ATTRIBUTE = 'data-embed-frame';` (a moldura do embed), `src/editor/canvas/render/render.ts:115` `const SVG_MARKUP_ATTRIBUTE = 'data-svg-markup';` (o grupo que desenha o markup do SVG), `src/editor/canvas/render/render.ts:77` `const EDITABLE_ATTRIBUTE = 'contenteditable';` e a imagem de marcador de `src/editor/canvas/render/render.ts:119` `const IMAGE_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`. Efeito: uma página com embed, com SVG de markup ou com imagem sem fonte tem no canvas um DOM que difere da exportação fora da lista; o lote visual compara canvas com canvas (`tests/e2e/lote-visual.spec.ts:236` `await expect.poll(() => serializeCanvas(page), { message: `${id}: o canvas depois de recarregar`, timeout: 4_000 }).toBe(editado);`), e canvas com exportação só por propriedades calculadas, então essas diferenças não são acusadas nem declaradas.
  2. Duas cópias da lista sem ligação: mudar `EDITOR_ATTRIBUTES` não muda `EDITOR_MARKS`. O comentário que acompanha a lista no código já diverge dela: `src/core/document/validate.ts:518` `// (data-node, data-container, data-hidden, data-key-context, contenteditable), which the page never carries.` cita `contenteditable`, que não está no conjunto, e omite `data-empty-text`, `data-editor-style` e `data-node-style`.
  3. Não verificado: a comparação de DOM entre canvas e exportação que a decisão descreve ("mesmo DOM, menos uma lista") — nenhum detector a faz; o `2b` do lote visual compara 22 propriedades calculadas. Não rodei Playwright (proibido nesta verificação).

## DCS-003 — G5, família `english`: as categorias técnicas aceitas por regra

- **Veredito:** parcial — as exceções técnicas da opção (b) estão no código; o que a regra acusa é só o texto igual a um texto inglês do catálogo, que é o alcance da opção (a). Um texto inglês fora do catálogo chega à interface pt-BR sem ser acusado.
- **Provas:**
  - a lista do que é acusado vem só do catálogo, sem os textos com marcador nem os que o pt-BR repete: `tests/support/screen-guard.ts:52` `.filter(([key, value]) => ptBR[key] !== undefined && ptBR[key] !== value && !value.includes('{') && /[a-z]{3}/.test(value))`;
  - a acusação exige igualdade com um desses textos: `tests/support/screen-guard.ts:332` `if (english !== null && text.length > 3 && english.has(text) && !project.has(text) && !code && !allowed('english', el)) out.push({ kind: 'english', text, where: where(el), box: box(rect(r)) });`;
  - as categorias da opção (b): código, valores CSS na face de código e nomes de tecla (`tests/support/screen-guard.ts:331` `const code = tag === 'KBD' || el.closest('kbd') !== null || (codeFace !== '' && s.fontFamily === codeFace);`); conteúdo da pessoa (o conjunto `project`, os textos do documento lidos pela porta de teste, na mesma linha 332, `!project.has(text)`); unidades e nomes de arquivo não são textos do catálogo, então nunca entram na lista;
  - o texto literal em JSX é recusado pelo lint (`eslint.config.js:120` `'builder/no-literal-ui-string': 'error',`), então o texto de componente vem do catálogo.
- **Achados:**
  1. Um texto inglês que entra como parâmetro de mensagem não é acusado. `src/core/project/archive.ts:23` `return invalid('it is not a project document');` passa um texto inglês fixo para `status.open.invalidArchive`, e o parâmetro de texto é posto como está (`src/editor/text.ts:13` `if (typeof value !== 'object') out[name] = value;`). Entrada: na interface pt-BR, Arquivo › Abrir com um JSON que não é projeto → a barra de status diz "Este arquivo não é um arquivo de projeto válido: it is not a project document". O mesmo vale para `src/core/project/archive.ts:22` (a versão sem degrau) e `src/core/project/archive.ts:28` (o `message` de `validateDocument`). Não é nome CSS, unidade, código, nome de arquivo nem conteúdo da pessoa; a guarda não o acusa porque o texto inteiro não é igual a um texto do catálogo. Rastreado no código; não reproduzido no navegador (Playwright proibido nesta verificação).
  2. Nenhum detector sem navegador cobre a família; `tools/runner/model/i18n.test.ts:5` declara isso (`catalogue is accused here. What this group does not see — a Portuguese text left in English, a text too long for`).

## DCS-004 — o intent e os scenarios do manifesto definem o comportamento esperado

- **Veredito:** confirmado como regra aplicada nos registros conferidos; é regra de processo, sem ponto único no código.
- **Provas:**
  - os testes de comportamento são gerados dos cenários do manifesto e falham na divergência do código: `tools/runner/scenarios.ts:1` `// The scenario runner: npm run e2e is generated from the manifest's scenarios. One Playwright test`;
  - o verificador do manifesto roda entre os detectores e passa (`tools/runner/model/manifest.test.ts`, dentro dos 22 arquivos da linha de base);
  - aplicação num defeito: o DEF-0509 foi aberto porque o manifesto declara o codec e o código o recusava (`auditoria/defeitos.md:224`, campo **Efeito**, "Pela DCS-004, o manifesto…");
  - `auditoria/requisitos.md` tem 44 ocorrências de `intent` na montagem dos requisitos.
- **Achados:** nenhum dentro deste grupo. As decisões que escolheram "preservar o comportamento do código" (DCS-015, DCS-016, DCS-017, DCS-021) são de outros grupos; só a DCS-017 cita no próprio texto a conferência contra os cenários do manifesto.

## DCS-005 — palavras proibidas dentro de trechos de código

- **Veredito:** parcial — a regra (a) vale no verificador da auditoria; o trecho que a decisão cita não existe mais.
- **Provas:**
  - `tools/audit/lib.mjs:162` `export function stripCode(text) {` remove os blocos de código e os trechos entre crases, e a conferência de linguagem lê o texto sem eles: `tools/audit/lib.mjs:167` `const plain = stripCode(text).toLowerCase();`, usada pela C7 (`tools/audit/check.mjs:413` `const bad = forbiddenWordsIn(text);`).
- **Achados:**
  1. A citação da decisão aponta para um arquivo que não existe: `.claude/hooks/vistoria.mjs` não está no disco (`.claude/` tem só `launch.json`; `git log --all -- .claude/hooks/vistoria.mjs` vazio). O "Comportamento atual" da DCS-005 não pode ser conferido como escrito.

## DCS-006 — barras de rolagem visíveis e escala 1.25 na configuração de 1440×900

- **Veredito:** confirmado nas medições do rastreamento; com uma ambiguidade de texto entre a decisão e o `CLAUDE.md`.
- **Provas:**
  - os scripts de medição declaram as duas configurações da decisão: `auditoria/medicoes/MED-0001.mjs:13` `A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },` e `auditoria/medicoes/MED-0001.mjs:14` `B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },`; 62 dos 63 scripts têm as duas linhas; o 63º, `MED-0029.mjs`, não mede (o id não tem fluxo);
  - as barras visíveis vêm de tirar `--hide-scrollbars` (`auditoria/medicoes/MED-0001.mjs:18`), a mesma técnica de `playwright.config.ts:56` `...(process.env.E2E_SCROLLBARS === 'shown' ? { launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } } : {}),`.
- **Achados:**
  1. O `CLAUDE.md`, seção 8, item 4, escreve "Use 1280×720 em pt-BR e 1440×900 em inglês, com barras de rolagem visíveis (~15 px por painel) e escala 1.25", que se lê também como barras e escala nas duas telas; a DCS-006 e o `PROMPT.md:166` põem barras e escala só na de 1440×900. As medições seguem a decisão.
  2. A medição de larguras da C4 (DCS-022) não usa a configuração A da decisão: ver o achado 1 da DCS-022.

## DCS-007 — a linha 235 da fixture canônica (resolvida pelo dono)

- **Veredito:** não confere no estado de agora — os fatos medidos da decisão conferem, mas a resolução vivia em arquivos que não existem mais.
- **Provas:**
  - `wc -c -l manifest/features/fixtures/canonical.json` → 1.523 linhas e 113.447 bytes; a linha 235 tem 57.249 caracteres; `manifest/features/fixtures/canonical.json:2` `"version": 4,` — confere com a decisão.
- **Achados:**
  1. `.claude/vistoria.config.json`, `.claude/hooks/vistoria.mjs` e `.claude/vistoria/registro.jsonl` não estão no disco (`find` em `C:/Codex-Shared` e em `C:/Users/jonathanrodriguesti/.claude` sem resultado). A resolução (as fixtures e `deepseek.ps1` fora de `ignorar`, o limite de 34.000 caracteres para a leitura inteira) não pode ser conferida.
  2. O verificador da auditoria que restou lê a mesma configuração e cai no padrão quando ela falta: `tools/audit/lib.mjs:13` `const CONFIG_FILE = path.join(ROOT, '.claude', 'vistoria.config.json');` e `tools/audit/lib.mjs:36` `try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { /* arquivo ausente ou inválido */ return fallback; }`. O padrão não tem `limiteLeituraInteira` (só `tools/audit/lib.mjs:27` `limiteLeituraCaracteres: 60000,`), e o `catch` cala também um JSON inválido — fallback que esconde falha, proibido pelo `CLAUDE.md` seção 3; o arquivo é ferramenta da auditoria, não código da aplicação. A manutenção da auditoria foi encerrada pelo dono, e o verificador não foi rodado (proibido nesta verificação).

## DCS-008 — as oito partes do estado da store do núcleo

- **Veredito:** parcial — as oito partes e as linhas citadas conferem com `StoreState`; a matriz derivada da re-marcação não tem leitor para duas partes que o código lê.
- **Provas:** os oito campos nas linhas citadas, em `src/core/store/store.ts`: `:28` `readonly document: DocumentJson;`, `:29` `readonly selection: Selection;`, `:30` `readonly history: HistoryState;`, `:32` `readonly message: Message | null;`, `:35` `readonly confirmation?: PendingConfirmation | null;`, `:38` `readonly refusal?: Refusal | null;`, `:42` `readonly refused?: boolean;`, `:43` `readonly ui: Ui;`. `auditoria/estado.md` tem um item por parte (`## EST-L01-030` a `## EST-L01-037`) e `auditoria/matriz.md` uma seção por parte.
- **Achados:**
  1. EST-L01-035 (a recusa) aparece com "Leitores: nenhum" e "Pares:" vazio em `auditoria/matriz.md:497` a `:503`, mas o código a lê: `src/editor/inspector/attribute-feedback.ts:11` `const found = state.refusal;`, chamado de `src/editor/shell/inspector-settings.tsx:134` `const refused = useSettingsRefusal(addEntry.command.id, undefined, node.id);`. O fluxo que cita essa chamada (`auditoria/fluxos/ENT-L09a-0169.md:10`) não leva a marca `[lê: EST-L01-035 …]`; nenhum fluxo leva (a busca por `[lê: EST-L01-035` e `[lê: EST-L01-036` em `auditoria/fluxos/` não acha nada; as outras seis partes têm de 27 a 2.005 marcas). O próprio `auditoria/estado.md` lista esse leitor no item EST-L01-035.
  2. EST-L01-036 (o sinal de recusa): "Leitores: nenhum" em `auditoria/matriz.md:505` a `:511`, mas `auditoria/estado.md` lista dois leitores em `run`, entre eles `src/core/store/store.ts:489` (`message: outcome.message ?? (state.refused === true ? null : state.message)`). Efeito das duas lacunas: os pares (escritor, leitor) dessas partes não foram rastreados (0 arquivos `EST-L01-035__*` e `EST-L01-036__*` em `auditoria/interacoes/`).
  3. Os escritores das duas partes na matriz são 8 trechos (`TRC-element.rename` a `TRC-project.restoreVersion`), quando todo comando recusado escreve a recusa (`src/core/store/store.ts:472`, citado no próprio `auditoria/estado.md`). Não verificado o motivo da lista curta: a geração da matriz (`tools/audit/matriz.mjs`) não pode ser rodada nesta verificação.

## DCS-010 — o histórico não sobrevive a recarregar a página

- **Veredito:** confirmado.
- **Provas:**
  - o registro do autosave leva só revisão, versão, documento e seleção: `src/editor/persistence/autosave.ts:388` `const work: SavedWork = { revision, format: now.document.version, document: now.document, selection: now.selection };` (a forma em `src/editor/persistence/autosave.ts:38` a `:45`, sem histórico);
  - a store nasce com o histórico vazio, também a restaurada: `src/core/store/store.ts:292` `{ document: options.initial.document, selection: options.initial.selection ?? [], history: EMPTY_HISTORY, message: options.initial.message ?? null, ui: options.initial.ui },`;
  - o contexto gravado na transação (DCS-009) não entra no formato salvo: o `SavedWork` não tem campo de histórico nem de transação.
- **Achados:** nenhum.

## DCS-011 — nenhuma dependência nova

- **Veredito:** confirmado quanto às dependências; a decisão cita um arquivo que não existe para a contagem de ouvintes.
- **Provas:**
  - `git diff 8c71d650 HEAD -- package-lock.json` vazio (`git diff --quiet` → igual);
  - `git diff 8c71d650 HEAD -- package.json`: o diff mostra o arquivo inteiro porque ele passou de CRLF para LF (`git show 8c71d650:package.json | od -c` mostra `\r\n`; o de agora, `\n`); com `git diff -w --ignore-cr-at-eol` sobra uma linha: `+    "ui-fit:measure": "playwright test -c tools/ui-fit/measure.config.ts",` — um script, não uma dependência (commit `1bc2d094`);
  - comparação campo a campo de `dependencies`, `devDependencies`, `optionalDependencies`, `peerDependencies` e `overrides` (script Node lendo os dois JSON): nenhuma entrada nova, removida ou com versão mudada;
  - árvore de trabalho igual ao HEAD nos dois arquivos (`git diff --quiet HEAD -- package.json package-lock.json`);
  - o catálogo de mutantes é um plugin do Vite próprio (`tools/runner/mutants.ts:10` `import { normalizePath, type Plugin } from 'vite';`, `tools/runner/mutants.ts:134` `transform(code, id) {`); o leitor de fonte só importa `fs` (`tools/ui-fit/font.ts:6` `import fs from 'node:fs';`); nenhum `stryker` nem `memlab` no código nem em `node_modules/.bin`.
- **Dependências que entraram ou mudaram de versão:** nenhuma.
- **Achados:**
  1. A decisão diz "a contagem de ouvintes é de `src/editor/input/scope.ts`"; o arquivo não existe (nem no histórico do git). A contagem tomou outra forma, sem dependência: a regra de lint `builder/listener-scope` (`tools/lint/plugin.ts`, MEC-09) e a janela contadora de `tools/runner/model/lifetime.test.ts` (MEC-07). O registro da decisão ficou desatualizado.

## DCS-012 — a fonte da interface empacotada (Source Sans 3, OFL)

- **Veredito:** confirmado, com uma observação sobre o build e outra sobre o cabeçalho do arquivo de tokens.
- **Provas:**
  - os arquivos: `src/ui/fonts/SourceSans3-Regular.ttf` (431.196 bytes), `src/ui/fonts/SourceSans3-Semibold.ttf` (425.904 bytes), `src/ui/fonts/OFL.txt` (93 linhas); entraram no commit `cb59b928`;
  - a tabela `name` dos dois TTF (lida por script Node): família "Source Sans 3" e "Source Sans 3 Semibold", "Version 3.052", peso `OS/2` 400 e 600, copyright "© 2023 Adobe (http://www.adobe.com/), with Reserved Font Name ‘Source’", licença OFL 1.1 no campo 13;
  - a licença: `src/ui/fonts/OFL.txt:1` `Copyright 2010-2024 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'. All Rights Reserved. Source is a trademark of Adobe in the United States and/or other countries.`;
  - o `@font-face` e o token: `src/ui/tokens.css:6` `font-family: "Source Sans 3";`, `src/ui/tokens.css:7` `src: url("./fonts/SourceSans3-Regular.ttf") format("truetype");`, `src/ui/tokens.css:15` `src: url("./fonts/SourceSans3-Semibold.ttf") format("truetype");`, `src/ui/tokens.css:22` `--font-ui: "Source Sans 3", system-ui, sans-serif;`;
  - a medição sem navegador lê os mesmos arquivos: `tools/ui-fit/font.ts:12` `400: 'src/ui/fonts/SourceSans3-Regular.ttf',` e `tools/ui-fit/font.ts:13` `600: 'src/ui/fonts/SourceSans3-Semibold.ttf',`;
  - o build leva as duas faces: `dist/assets/SourceSans3-Regular-CgvQnV7E.ttf` e `dist/assets/SourceSans3-Semibold-Bz5Pz_jG.ttf`.
- **Onde ainda aparece "Segoe UI"** (busca em `src/`, `tools/`, `tests/`, `manifest/`):
  - `src/core/render/base.ts:19` `:where(body) { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 16px; line-height: 1.5; }` — o estilo base da página do site (o canvas e a exportação): uma pilha de fontes do sistema, que não nomeia a fonte do editor; o site exportado não depende dela;
  - `src/core/files/files.test.ts:54` e `:57` — dados de teste de `font-family` de um nó;
  - `tools/lint/plugin.test.ts:218` e `:224` — o caso de teste da regra que recusa `font-family` literal;
  - `manifest/features/fixtures/canonical.json` — conteúdo de documento de fixture.
  Nenhuma declaração da interface do editor usa "Segoe UI"; nenhum arquivo de `src/` fora de `src/ui/tokens.css` nomeia "Source Sans" ou `ui/fonts`.
- **Achados:**
  1. O `OFL.txt` não vai para o `dist/`: o build leva os TTF e o comentário de `src/ui/tokens.css:3` que aponta para `src/ui/fonts/OFL.txt` (presente em `dist/assets/index-UZC9pilA.css`), não o texto da licença. A OFL aceita o aviso "in the appropriate machine-readable metadata fields" de arquivos binários (`src/ui/fonts/OFL.txt:60`), e os TTF levam copyright e licença na tabela `name`; a decisão, porém, diz que o texto da licença "vai junto dos arquivos no app", o que vale para o código-fonte e não para o app construído.
  2. `src/ui/tokens.css:1` `/* Generated by npm run gen (tools/gen/tokens.ts, Style Dictionary 5.5.5) from design/final/tokens.json. Do not edit. */` — nem `tools/gen/tokens.ts` nem `design/final/tokens.json` existem (já não existiam no estado de partida); o `@font-face` foi escrito à mão num arquivo que se declara gerado. Sem gerador, nada o sobrescreve hoje; o cabeçalho engana quem for editar.

## DCS-014 — os detectores da investigação criados e rodados

- **Veredito:** parcial — os detectores existem e passam; um caminho da decisão não existe.
- **Provas:**
  - `tools/runner/model/` (22 arquivos `*.test.ts`), `tools/runner/mutants.ts`, `tools/inventory/`, `tools/ui-fit/` e `tools/map/` existem; `auditoria/mecanismos.md` registra MEC-01 a MEC-22;
  - linha de base: `npx vitest run --config tools/runner/model/vitest.config.ts` → 22 arquivos e 61 testes passaram.
- **Achados:**
  1. `tools/runner/field-contracts.test.ts`, citado na decisão, não existe nem existiu (`git log --all -- tools/runner/field-contracts.test.ts` vazio). Os contratos de campo ficaram em `tools/runner/model/fields.test.ts` (MEC-05). O registro da decisão ficou desatualizado.

## DCS-022 — o que o C4 mede, e contra qual coluna

- **Veredito:** parcial — os quatro pontos da decisão estão no código como escritos e o mutante do token é acusado; as "duas condições de tela" medidas não são as duas do projeto, e 150 das 944 portas com texto são puladas sem aviso.
- **Provas:**
  1. o texto: `tools/ui-fit/check.ts:86` `if (drawnAs === 'icon-button') continue;` e `tools/ui-fit/check.ts:88` `out.push({ ref: `${command.id}#${door.id}`, region: door.placement.region, labelKey: face ?? door.labelKey });` (`faceLabelKey` quando há, `labelKey` senão; `icon-button` fora);
  2. a pseudo-expansão: `tools/ui-fit/check.ts:48` `const accented = text.replace(/[aeiou]/g, (c) => 'áéíóú'['aeiou'.indexOf(c)] ?? c);` e `tools/ui-fit/check.ts:49` `return `【${accented.padEnd(Math.round(text.length * 1.4), '·')}】`;`; as três variantes, vale a mais larga: `tools/ui-fit/check.ts:113` `const variants = [ptBR, en, en === '' ? '' : pseudoExpansion(en)].filter((text) => text !== '');` e o laço de `:141` a `:147`;
  3. a coluna: os sete tokens de largura em `tools/ui-fit/check.ts:16` a `:24` (inspector, barra lateral, largura mínima de menu, paleta, painel de código, dock da direita, janela de painel), lidos do arquivo com o trecho do mutante trocado (`tools/ui-fit/check.ts:157` `const css = mutatedSource('src/ui/tokens.css', fs.readFileSync(at('src/ui/tokens.css'), 'utf8'));`); a região fluida pela mais estreita medida e pelo menor tamanho e peso: `tools/ui-fit/check.ts:127` `column = Math.min(...sizes.map((s) => s.width));`, `:128` e `:129`;
  4. a folga: `tools/ui-fit/check.ts:148` `if (need + 1 > column) findings.push(...)` — passa quando `largura + 1 ≤ coluna`.
  - Detector sem mutante: passa (na linha de base). Com o mutante: `BUILDER_MUTANT=M68 npx vitest run --config tools/runner/model/vitest.config.ts tools/runner/model/ui-fit.test.ts` → `Tests 1 failed (1)`, "rótulos que não cabem na coluna da sua região: expected [ …(2) ] to deeply equal []". O trecho do M68 (`tools/runner/mutants.ts:119`, `--size-inspector: 336px;` → `280px;`) confere com o token de hoje (`--size-inspector` 336 px).
  - A medição está em dia com o CSS: o hash de `manifest/generated/ui-widths.json` (`$generated.css`) é igual ao hash calculado como `tools/ui-fit/measure.spec.ts` calcula, sobre os `.css` de `src/` de agora (script no scratchpad).
  - DEF-0519 e DEF-0520 registrados como corrigidos em `auditoria/defeitos.md:340` e `:351`.
- **Achados:**
  1. As "duas condições de tela" de `ui-widths.json` são a mesma janela de 1440×900 em inglês, com e sem barras: `tools/ui-fit/measure.config.ts:26` `viewport: VIEWPORT,` (`tools/runner/environment.ts:23` `const first = environment.viewports[0];`, a `desktop-1440` de `manifest/environment.json`), `tools/ui-fit/measure.config.ts:27` `locale: 'en-US',` e `tools/ui-fit/measure.spec.ts:15` `const CONDITION = process.env.E2E_SCROLLBARS === 'shown' ? 'windows' : 'default';`. A configuração de 1280×720 do `CLAUDE.md` seção 8 e da DCS-006 não é medida; uma região cuja largura acompanha a janela entra com a largura de 1440, mais larga que a que a pessoa vê a 1280.
  2. Portas puladas em silêncio. Contagem com as funções do próprio `check.ts` (script no scratchpad, `drawnLabels` sobre o manifesto de agora): 944 portas desenham texto; 715 caem numa região de token, 79 numa região medida e **150 em região sem token nem medição**, que `tools/ui-fit/check.ts:130` `} else {` / `:131` `continue;` pula sem contar: `quick-panel` 45, `context-menu` 35, `color-picker` 16, `guides-grids-dialog` 12, `link-picker` 7, `preview-bar` 7, `field` 6, `breakpoints-dialog` 4, `captured-inspector` 3, `html-import` 3, `text-toolbar` 2, e uma em cada uma de `component-prompt`, `asset-picker`, `overlay`, `toast`, `batch-rename-dialog`, `recovery-dialog`, `tab-guard`, `capture-url-dialog`, `canvas-side-by-side`, `snap-settings-dialog`. O detector (`tools/runner/model/ui-fit.test.ts:12` a `:14`) só confere a lista de achados vazia, sem contagem nem piso. Efeito: um rótulo do painel rápido ou do menu de contexto que não cabe passa pelo C4.
  3. Um token que some também é pulado em silêncio: `tools/ui-fit/check.ts:121` `const width = input.tokens.get(token.slice(2));` e `:122` `if (width === undefined) continue;`. Com `size-inspector` tirado do mapa de tokens (script no scratchpad), os achados ficam em 0; com 1 px, 430. Um renome de `--size-inspector` em `src/ui/tokens.css` desliga a conferência das portas do inspector sem o detector falhar.
  4. A própria decisão se contradiz no ponto 3: inclui "a largura mínima de um menu" entre os tokens de coluna e logo depois diz "Um token que é altura (…), mínimo ou máximo não é coluna"; o código segue a lista (`tools/ui-fit/check.ts:19` `{ region: /^menu:/, token: '--size-menu-min' },`), e o comentário de `tools/ui-fit/check.ts:15` repete a regra do mínimo.

## D-1 — as abas de breakpoint coladas no topo da moldura

- **Veredito:** confirmado no código; nenhum detector mede a posição das abas contra a moldura.
- **Provas:**
  - as abas são o primeiro filho da moldura, que empilha em coluna: `src/editor/shell/canvas.tsx:302` `<div className="frame" data-region="canvas-frame" style={{ width: pageWidth * zoom, left: FIT_MARGIN + pan }}>` e `src/editor/shell/canvas.tsx:306` `<BreakpointTabs seen={{ ... }} />`; `src/editor/shell/canvas.css:467` `display: flex;` e `:468` `flex-direction: column;`;
  - a linha das abas: `src/editor/shell/canvas.css:527` `/* The breakpoints: a row of tabs attached to the top of the frame (the owner's decision D-1), as wide as its tabs need —`, com altura fixa `src/editor/shell/canvas.css:536` `height: var(--size-frame-tabs);`;
  - os irmãos entre as abas e a página: o selo de estado e a borda de redimensionar são `position: absolute` (`src/editor/shell/window-overlays.css:455`, `src/editor/shell/canvas.css:515`), fora do fluxo.
- **Achados:**
  1. Num breakpoint que não é a base, a faixa do breakpoint fica no fluxo entre as abas e a página: `src/editor/shell/window-overlays.css:468` `.canvas-breakpoint-badge {` com `flex: none;` e `height: var(--size-target-min);`, descrita como "under its tabs and over the page" (`src/editor/shell/window-overlays.css:467`). As abas continuam no topo do elemento `.frame`; a página desce a altura da faixa. É o desenho canônico citado no comentário (`design/final .bpband`), não uma quebra de D-1 no sentido de "topo da moldura"; registrado para quem ler "moldura" como a borda da página.
  2. Nenhum teste mede a borda de baixo das abas contra o topo da moldura: a busca por `frame-tab`, `D-1` e `canvas-breakpoints` em `tests/e2e/` só acha usos que excluem as abas de outra conta (`tests/e2e/workspace-doors.spec.ts:114`) e o teste do rótulo (DEC-70). As fotos de `visual.spec.ts` cobrem o desenho indiretamente (não verificado: Playwright proibido nesta verificação).

## DEC-70 — o rótulo acima do elemento, o chip à direita, e a exceção de 2026-10-07

- **Veredito:** confirmado nos dois ramos da exceção; o ramo "logo abaixo" só tem detector unitário.
- **Provas:**
  - o lugar único: `src/editor/canvas/placement.ts:121` `const box = { x: frame.x - edge, y: frame.y - edge - size.height, ...size };` (acima, encostado na linha da moldura, na borda esquerda), sempre `placement: 'above'` (`:123`);
  - o chip à direita do rótulo, encostado: `src/editor/quick-panel/quick-panel.ts:91` `return { x: label.x + label.width, y: open || under ? label.y : label.y + label.height - size.height, ...size };`; a caixa `label` é a do rótulo desenhado (`src/editor/canvas/quick-panel.tsx:450`, `placeQuickPanel({ x: at.x, y: at.y, width: at.width, height: at.height }, ...)`), então o chip segue o rótulo também quando ele andou ou desceu;
  - o grupo que anda junto (rótulo, chip e barra de texto) entra em `clearedLabel` pela chamada `src/editor/canvas/chrome.tsx:751` `const spot = clearedLabel(one, labelFrame, edge, { above: Math.max(tools === null ? 0 : gap + tools.height, chipRise), width: Math.max(size.width + chipWidth, tools?.width ?? 0) }, tabs, content);`, com as abas lidas da página (`src/editor/canvas/chrome.tsx:79` `const EDITOR_CONTROLS = '[data-region="canvas-breakpoints"] button, [data-region="canvas-breakpoints"] [role="tab"]';`);
  - **ramo 1** (seguem pela linha de cima até passar a última aba, enquanto couberem sobre o elemento): o laço anda para a direita de cada aba atingida, na mesma altura — `src/editor/canvas/placement.ts:170` `const next = Math.max(...hit.map((c) => c.x + c.width)) + 2 * SLACK;` — e para quando o grupo inteiro passaria da borda direita da moldura — `src/editor/canvas/placement.ts:171` `past = next + whole.width > frame.x + frame.width + edge ? null : next;`; o resultado fica `'above'` com o `y` de antes (`:174` `const moved = { ...placed.box, x: past };`);
  - **ramo 2** (elemento estreito sob as abas: logo abaixo dele): `src/editor/canvas/placement.ts:178` `const box = { ...placed.box, y: frame.y + frame.height + edge };`, `placement: 'below'` (`:180`), mesma borda esquerda; o chip pende do topo do rótulo (`under` em `quick-panel.ts:91`) e a barra de texto vai para baixo do rótulo (`src/editor/canvas/chrome.tsx:762` `placedToolbar = tools === null ? null : { x: spot.box.x, y: under ? spot.box.y + size.height + gap : top };`);
  - fora das abas, o lugar único fica: `src/editor/canvas/placement.ts:163` `if (under.length === 0) return { ...placed };`;
  - o commit da exceção (`0c22cd6e`, 2026-10-07) só acrescenta `clearedLabel` e o comentário em `placement.ts`; a função anterior (`selectionLabelBox`) não mudou no diff.
- **Detectores de cada ramo:**
  - unitário, rodado: `npx vitest run src/editor/canvas/placement.test.ts` → `Tests 13 passed (13)`. Ramo 1: `src/editor/canvas/placement.test.ts:50` `it('moves along the top just past the tabs, over a wide element, touching the frame line', ...` (caixa `box(276, -18, 80, 16)`, fora das três abas); com o chip e a barra: `:64` a `:72`. Ramo 2: `src/editor/canvas/placement.test.ts:57` `it('stands under a narrow element the tabs lie over, at the same left edge, touching the frame line', ...` (`placement` `'below'`, `box(-2, 42, 80, 16)`). Lugar único sem abas: `:46`;
  - navegador, só leitura: `tests/e2e/selection-label-touches.spec.ts:106` `await expect.poll(() => clearOfTabs(page), { message: 'c-header' }).toEqual({ top: 0, chip: 0, overTabs: false });` e `:109` (a página) cobrem o ramo 1 no app (rótulo encostado na linha de cima, chip encostado, nada sobre as abas). O ramo 2 não tem teste no navegador: nenhum `.spec.ts` seleciona um elemento estreito no topo nem espera `data-placement="below"` do rótulo de seleção (os `'below'` de `tests/e2e/` são do rótulo de soltar).
  - Nenhum mutante de `tools/runner/mutants.ts` toca `placement.ts` nem `quick-panel.ts`.
- **Achados:**
  1. O ramo 2 depende só do teste unitário com caixas escritas à mão; no app real nenhum detector o exercita.
  2. Não verificado (precisa de navegador): a chave que decide recolocar o rótulo não inclui as abas — `src/editor/canvas/chrome.tsx:734` `const key = JSON.stringify([first, size, tools, mode, edge, turn, chipWidth, chipRise, Math.round(origin.x), Math.round(origin.y), Math.round(origin.width), Math.round(origin.height)]);`. Uma mudança só na linha das abas (um breakpoint acrescentado ou renomeado com o elemento do topo selecionado) não muda a chave; pelo código, o rótulo que andou até depois da última aba fica onde estava e pode ficar sobre a aba nova até outra coisa da chave mudar.

## Resumo

| ID | Veredito | Achado principal |
|---|---|---|
| DCS-001 | parcial | O código dá o mesmo `project.json` byte a byte em salvar → abrir → salvar (4 de 4 fixtures, corrida no scratchpad); nenhum detector do projeto prova isso: `tests/e2e/project-save.spec.ts` compara com `toEqual` (igualdade estrutural, a opção recusada) e não reabre o arquivo salvo. |
| DCS-002 | parcial | A lista existe (`src/core/document/validate.ts:519`), mas o lote visual usa uma cópia escrita à mão, e a lista não cobre marcas e elementos só do editor declarados em `render.ts` (`data-embed-frame`, `data-svg-markup`, `contenteditable`, a imagem de marcador); canvas e exportação não são comparados por DOM. |
| DCS-003 | parcial | As exceções técnicas estão na guarda, mas ela só acusa texto igual a um texto inglês do catálogo; "Este arquivo não é um arquivo de projeto válido: it is not a project document" (`src/core/project/archive.ts:23`) passa na interface pt-BR sem acusação. |
| DCS-004 | confirmado | Regra de processo aplicada (DEF-0509, cenários gerados do manifesto, verificador do manifesto passa). |
| DCS-005 | parcial | `stripCode` vale na C7 (`tools/audit/lib.mjs:167`); o trecho citado, `.claude/hooks/vistoria.mjs:308`, não existe mais. |
| DCS-006 | confirmado | As 62 medições usam A (1280×720 pt-BR, escala 1, sem barras) e B (1440×900 en, 1.25, barras); o `CLAUDE.md` seção 8 tem redação ambígua sobre a qual tela valem barras e escala. |
| DCS-007 | não confere | Os números da fixture conferem (1.523 linhas, 113.447 bytes, linha 235 com 57.249 caracteres), mas a trava e a configuração que a resolução mudou não existem mais no disco; `tools/audit/lib.mjs:36` cala JSON inválido com um `catch` que devolve o padrão. |
| DCS-008 | parcial | As oito partes e as linhas conferem; a matriz dá "Leitores: nenhum" para EST-L01-035 e EST-L01-036, que o código lê (`src/editor/inspector/attribute-feedback.ts:11`, `src/core/store/store.ts:489`), e os pares dessas partes não foram rastreados. |
| DCS-010 | confirmado | O autosave grava só revisão, versão, documento e seleção; a store nasce com o histórico vazio. |
| DCS-011 | confirmado | Nenhuma dependência entrou ou mudou de versão desde `8c71d650` (lock igual; `package.json` só ganhou o script `ui-fit:measure` e passou a LF); o `src/editor/input/scope.ts` citado não existe. |
| DCS-012 | confirmado | Source Sans 3 3.052, 400 e 600, OFL junto em `src/ui/fonts/`; "Segoe UI" só na pilha de sistema do site (`src/core/render/base.ts:19`), em testes e numa fixture; o `OFL.txt` não vai para o `dist/` (a licença viaja nos metadados do TTF) e `tokens.css` se declara gerado por um gerador que não existe. |
| DCS-014 | parcial | Os detectores existem e passam (22 arquivos, 61 testes); o `tools/runner/field-contracts.test.ts` citado nunca existiu (os contratos estão em `tools/runner/model/fields.test.ts`). |
| DCS-022 | parcial | Os quatro pontos estão no código e o M68 é acusado; as duas condições medidas são 1440×900 com e sem barras (a de 1280×720 não é medida), 150 de 944 portas são puladas sem aviso (painel rápido, menu de contexto, seletor de cor, diálogos) e um token renomeado desliga a conferência sem falha. |
| D-1 | confirmado | As abas são o primeiro filho da moldura em coluna; num breakpoint que não é a base, a faixa do breakpoint fica entre as abas e a página; nenhum detector mede a posição das abas. |
| DEC-70 | confirmado | `clearedLabel` cumpre os dois ramos da exceção e o chip segue o rótulo; o ramo "logo abaixo" só tem teste unitário (13 de 13 passam), sem teste no navegador nem mutante; não verificado: a chave de recolocação (`src/editor/canvas/chrome.tsx:734`) não inclui as abas. |
