# Plano de execução do PROMPT.md

## Contexto
- **Pedido:** planejar a execução do `PROMPT.md` (rastreamento completo de estado, entradas, fluxos e interações do Builder, com prova conferida por verificador), dentro das travas de `.claude/`.
- **Destino:** depois de aprovado, este texto é gravado em `auditoria/plano-execucao.md`. A execução começa em outra sessão.
- **Base levantada em 2026-10-08:**
  - branch `estrutura/edicao-e-espaco`, commit `0c22cd6`;
  - `PROMPT.md`, `CLAUDE.md`, `.claude/hooks/vistoria.mjs` e `.claude/vistoria.config.json` na versão revisada hoje, relidos por inteiro.
- **O que mudou nesta revisão:**
  - a lista `ignorar` agora inclui `.xlsx`, `manifest/generated/`, `src/generated/` e `vendor/`;
  - a leitura conta por custo em caracteres;
  - as partes contam de `offset` a `offset+limit-1`;
  - a conclusão é conferida por palavra inteira;
  - o universo do inventário passou a ser o escopo da trava;
  - o PROMPT ganhou trechos compartilhados de fluxo e o agrupamento de escritores;
  - o dono decidiu K1 a K4.
- **Origem dos números:**
  - scripts somente leitura que reproduzem `scopeFiles()`, `fileInfo()` e `readableRanges()` da trava;
  - a Fase 1 recria esses scripts em `tools/audit/`, e eles recalculam tudo.
- **Citações deste plano:** são verificadas como qualquer registro de `auditoria/`. Se o código citado mudar, atualize a citação no mesmo passo de impacto.
- **Lido por inteiro nesta sessão:**
  - instruções: `PROMPT.md`, `CLAUDE.md`;
  - travas: `.claude/settings.json`, `.claude/hooks/vistoria.mjs`, `.claude/vistoria.config.json`;
  - configuração: `package.json`, os quatro `tsconfig*.json`, `eslint.config.js`, `vite.config.ts`, `vite.proofs.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `index.html`, `.mcp.json`, `.dependency-cruiser.cjs`;
  - código: `src/main.tsx`, `tools/gen/generate.ts`, `src/app/commands.ts`, `src/app/features.ts`, `src/app/modules.ts`, `manifest/commands/history.json`.
- **Lido em parte:** `src/core/import/import.ts`, linhas 1 a 983.
- **Todo o resto: não lido.** Nada abaixo afirma comportamento nem defeito de código não lido.

---

## A. Números

### A.1 Escopo da trava (e universo do inventário)
O escopo é `git ls-files -co --exclude-standard` menos a lista `ignorar` de `.claude/vistoria.config.json`. É também o universo da conferência 1 do PROMPT.
- **Total:** 1.217 arquivos, 455.299 linhas, 17.916.462 bytes.
- **Custo de leitura pela regra da trava:** 21.095.822 caracteres, somando as linhas mais 8 de prefixo por linha.

**Por pasta de primeiro nível:**

| pasta | arquivos | linhas |
|---|---|---|
| `manifest/` | 122 | 292.414 |
| `src/` | 726 | 111.738 |
| `tests/` | 245 | 34.983 |
| `tools/` | 97 | 14.749 |
| raiz | 16 | 1.063 |
| `companion/` | 11 | 352 |

**Por pasta de segundo nível:**

| pasta | arq. | linhas | pasta | arq. | linhas |
|---|---|---|---|---|---|
| `manifest/features` (com `fixtures`) | 88 | 228.053 | `tools/lint` | 3 | 1.173 |
| `src/editor` | 337 | 51.314 | raiz do repositório | 16 | 1.063 |
| `manifest/commands` | 25 | 47.553 | `src/app` | 6 | 882 |
| `src/core` | 295 | 37.758 | `tools/impact` | 8 | 771 |
| `tests/e2e` | 207 | 25.578 | `src/ui` | 3 | 600 |
| `manifest` (raiz) | 9 | 16.808 | `tools/test` | 5 | 314 |
| `tests/support` | 34 | 9.253 | `tools/perf` | 5 | 281 |
| `src/modules` | 52 | 8.494 | `tools/inventory` | 4 | 234 |
| `src/i18n` | 5 | 7.584 | `companion` (raiz) | 6 | 178 |
| `src/manifest` | 25 | 5.011 | `companion/extension` | 5 | 174 |
| `tools/runner` | 19 | 4.106 | `tests/perf` | 4 | 152 |
| `tools/manifest` | 14 | 1.947 | `tools/assistant` | 2 | 119 |
| `tools/companion` | 9 | 1.482 | `tools/i18n` | 4 | 111 |
| `tools/gen` | 6 | 1.435 | `tools/modules` | 1 | 108 |
| `tools/ui` | 3 | 1.379 | `src` (raiz) | 2 | 90 |
| `tools/capture` | 14 | 1.289 | `src/config` | 1 | 5 |

**Dentro de `src/`:**
- produção: 478 arquivos `.ts`/`.tsx` com 76.398 linhas;
- testes: 220 arquivos com 18.185 linhas;
- CSS: 21 arquivos com 9.547 linhas;
- `src/generated/` e `vendor/` ficam fora do escopo. Eles são cobertos pela leitura do gerador `tools/gen/` e das entradas dele.

**Por extensão (arquivos / linhas):**
- `.json`: 124 / 307.840
- `.ts`: 921 / 118.191
- `.tsx`: 97 / 18.185
- `.css`: 29 / 9.643
- `.md`: 4 / 464
- `.html`: 21 / 281
- `.svg`: 5 / 220
- `.js`: 4 / 218
- `.mjs`: 5 / 164
- `.cjs`: 1 / 29
- `.csv`: 3 / 29
- `.mts`: 1 / 14
- `.tsv`: 1 / 13
- sem extensão (`.gitignore`): 1 / 8

### A.2 Arquivos que exigem leitura em partes
**Regra da trava:** uma parte só conta se a soma dos caracteres das linhas mais 8 por linha não passar de 60.000.
- Configuração: `.claude/vistoria.config.json:68` `"limiteLeituraCaracteres": 60000,`
- Custo por linha: `.claude/hooks/vistoria.mjs:203` `for (let i = 0; i < info.l; i++) prefix.push(prefix[i] + (lines[i] || '').length + 8);`
- Filtro de cada parte: `.claude/hooks/vistoria.mjs:215` `return prefix[end] - prefix[a - 1] <= limit;`, com o limite da leitura inteira ou da leitura em partes em `.claude/hooks/vistoria.mjs:214` `const limit = inteira ? cfg.limiteLeituraInteira : cfg.limiteLeituraCaracteres;`

**(a) Mais de 2000 linhas: 33 arquivos, 274.617 linhas.**

| arquivo | linhas |
|---|---|
| `manifest/features/04-inspector.json` | 41.571 |
| `manifest/features/07-elements.json` | 32.650 |
| `manifest/features/24-motion.json` | 19.977 |
| `manifest/features/02-structure-editing.json` | 18.163 |
| `manifest/features/10-view-and-positioning.json` | 14.344 |
| `manifest/features/13-workspace.json` | 14.033 |
| `manifest/features/25-content.json` | 13.817 |
| `manifest/features/23-layout-composer.json` | 11.765 |
| `manifest/commands/style.json` | 11.668 |
| `tests/support/flows/large-page.json` | 7.991 |
| `manifest/features/08-templates-and-components.json` | 7.563 |
| `manifest/features/19-pages-files-assets.json` | 7.561 |
| `manifest/properties.json` | 5.690 |
| `manifest/commands/elements.json` | 5.663 |
| `manifest/features/03-app-and-persistence.json` | 4.417 |
| `manifest/features/05-canvas-handles.json` | 4.355 |
| `manifest/features/16-html-import.json` | 4.258 |
| `manifest/features/06-page-and-export.json` | 4.153 |
| `manifest/features/18-animation-and-events.json` | 3.897 |
| `manifest/commands/workspace.json` | 3.827 |
| `manifest/commands/motion.json` | 3.688 |
| `src/i18n/locales/en.json` | 3.588 |
| `src/i18n/locales/pt-BR.json` | 3.588 |
| `manifest/elements.json` | 3.568 |
| `manifest/commands/view.json` | 3.321 |
| `manifest/features/11-responsive-and-states.json` | 2.994 |
| `manifest/features/21-layout-and-structure.json` | 2.927 |
| `manifest/references.json` | 2.459 |
| `manifest/commands/structure.json` | 2.457 |
| `manifest/consumers.json` | 2.316 |
| `tools/runner/scenarios.ts` | 2.225 |
| `manifest/commands/content.json` | 2.077 |
| `manifest/features/14-accessibility-and-keyboard.json` | 2.046 |

**(b) Até 2000 linhas, mas com custo acima de 60.000: 11 arquivos.**

| arquivo | linhas | custo |
|---|---|---|
| `src/core/import/import.ts` | 1.939 | 124.605 |
| `manifest/features/fixtures/canonical.json` | 1.523 | 124.037 |
| `src/editor/shell/field.tsx` | 1.841 | 122.754 |
| `src/editor/canvas/chrome.tsx` | 1.187 | 91.032 |
| `src/manifest/schema.ts` | 1.369 | 82.946 |
| `src/modules/layout-composer/host/handlers.ts` | 891 | 66.626 |
| `manifest/features/26-project-breakpoints.json` | 1.872 | 66.321 |
| `manifest/features/17-code-panel.json` | 1.830 | 64.783 |
| `src/editor/shell/inspector.css` | 1.609 | 63.268 |
| `manifest/commands/geometry.json` | 1.744 | 60.576 |
| `manifest/interactions.json` | 1.765 | 60.295 |

**(c) A linha mais longa do escopo** é uma de `manifest/features/fixtures/canonical.json`, com 57.249 caracteres. Ela cabe numa parte só (custo 57.257). Nenhuma linha do escopo passa do limite.

**Custo da Fase 2:**
- **Alvo do plano:** 50.000 de custo por parte.
  - É abaixo do limite da trava, com margem para o teto de 25.000 tokens do `Read`.
  - Medido nesta sessão: `src/core/import/import.ts` dá cerca de 2,65 caracteres por token, então 60.000 caracteres dão cerca de 22.600 tokens.
- **Com esse alvo:**
  - 1.424 chamadas de `Read`;
  - 45 arquivos lidos em partes;
  - cerca de 6,8 milhões de tokens de saída (17,9 MB divididos por 2,65).

### A.3 Pacotes externos importados pelo código do escopo
A trava exige pesquisa para todos estes pacotes. A versão foi lida de `node_modules/<pacote>/package.json`.

| pacote | versão | onde é importado |
|---|---|---|
| `react` | 19.3.0 | 92 arquivos de produção e 7 outros |
| `react-dom` | 19.3.0 | 5 de produção e 7 outros |
| `zod` | 4.6.5 | 6 de produção |
| `css-tree` | 3.2.1 | 3 de produção e 7 outros |
| `html-to-image` | 1.11.13 | 1 de produção (import dinâmico) |
| `happy-dom` | 20.14.5 | 1 de produção (`src/editor/motion/runtime/fake-page.ts`) e 2 testes |
| `ws` | 8.21.3 | `companion/` (1) |
| `parse5` | 8.0.1 | 1 teste |
| `html-validate` | 11.16.0 | 3 testes e 1 ferramenta |
| `fast-check` | 4.10.2 | 5 testes |
| `vitest` | 5.0.1 | 242 testes e configuração |
| `@playwright/test` | 1.63.0 | 31 (testes, `tools/`, `playwright.config.ts`) |
| `vite` | 8.3.0 | 4 (configurações e `tools/`) |
| `@vitejs/plugin-react` | 6.1.1 | `vite.config.ts` |
| `eslint` | 10.11.0 | 3 |
| `@eslint/js` | 10.0.1 | 1 |
| `@eslint/css` | 2.0.0 | 3 |
| `@eslint/core` | 1.2.1 | 1 |
| `eslint-plugin-react-hooks` | 7.1.1 | 1 |
| `globals` | 17.12.0 | 1 |
| `typescript-eslint` | 8.70.1 | 2 |
| `@typescript-eslint/utils` | 8.70.1 | 1 |
| `dependency-cruiser` | 18.5.0 | 1 |
| `es-module-lexer` | 2.3.2 | 1 |
| `@mdn/browser-compat-data` | 8.1.2 | 1 |
| `@webref/css` | 8.7.5 | 1 |
| `source-map-js` | 1.2.2 | 1 |

**Usados sem import detectável pela trava (o uso se confirma na Fase 2):**
- `typescript` 6.0.3, via `tsc` no typecheck;
- `playwright` e `playwright-core` 1.63.0, no laboratório;
- `lucide-static` 1.48.0;
- `style-dictionary` 5.5.5;
- `@vitest/coverage-v8` 5.0.1;
- `lottie-web` 5.13.0, embutido em `src/editor/motion/vendor/` (fora do escopo da trava, mas chamado pelo código).

### A.4 Bibliotecas de estado, renderização e interação usadas de fato
**Renderização:** React 19.3.0.
- `src/main.tsx:2` `import { createRoot } from 'react-dom/client';`
- `src/main.tsx:77` `createRoot(container, {`
- `src/editor/canvas/chrome.tsx:32` `import { createPortal } from 'react-dom';`
- `src/editor/doors/menu.tsx:11` `import { flushSync } from 'react-dom';`

**Estado: store própria, sem biblioteca externa.**
- Nenhum import de biblioteca de estado entre os 27 pacotes.
- Dispatch da store do núcleo: `src/core/store/store.ts:122` `dispatch<Id extends CommandId>(id: Id, args: CommandArgs[Id], context?: EditContext): DispatchResult;`
- Criação da store do editor: `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- Ligação com o React: `src/editor/store.ts:275` `return useSyncExternalStore(store.subscribe, () => select(store.getState()));`
- Stores de módulo: mais 15 chamadas de `useSyncExternalStore`, por exemplo `src/editor/shell/status-bar.tsx:283` `const current = useSyncExternalStore(saveState.subscribe, saveState.get);`
- Estado local do React, contado por regex no código de produção:
  - `useState`: 92;
  - `useRef`: 138;
  - `useMemo`: 61;
  - `createContext`: 6.
- Armazenamento do navegador:
  - `localStorage`/`sessionStorage`: 24 ocorrências em 7 arquivos;
  - IndexedDB: 5 ocorrências em 3 arquivos, por exemplo `src/editor/assistant/credentials.ts:6` `const request = indexedDB.open(name, 1);`

**Validação de dados guardados:** zod 4.6.5.
- `src/editor/persistence/drafts.ts:3` `import { z } from 'zod';`
- `src/manifest/schema.ts:7` `import { z } from 'zod';`

**CSS:** css-tree 3.2.1.
- `src/core/render/base.ts:15` `import { generate as generateCssTree, parse as parseCssTree } from 'css-tree';`

**Imagem do canvas:** `src/editor/canvas/screenshot.ts:23` `const { toSvg } = await import('html-to-image');`

**Runtime de motion fora do navegador:** `src/editor/motion/runtime/fake-page.ts:5` `import { Window } from 'happy-dom';` (uso não lido).

**Interação: sem biblioteca externa.** Os donos aparecem declarados como regras de lint. O que cada regra impõe está em `tools/lint/plugin.ts`, não lido.
- ponteiro: `eslint.config.js:80` `rules: { 'builder/pointer-owner': 'error' },`
- gesto: `eslint.config.js:89` `rules: { 'builder/gesture-owner': 'error' },`
- teclado: `eslint.config.js:97` `rules: { 'builder/keyboard-owner': 'error' },`
- iframe do canvas: `eslint.config.js:113` `rules: { 'builder/frame-owner': 'error' },`

### A.5 Funcionalidades que o levantamento já identifica (base de `requisitos.md`)
**Comandos do manifesto:** 373 em 25 domínios.

| domínio | comandos | portas | domínio | comandos | portas |
|---|---|---|---|---|---|
| animation | 14 | 21 | history | 2 | 10 |
| assistant | 14 | 16 | layout-composer | 15 | 44 |
| breakpoints | 4 | 5 | motion | 32 | 84 |
| capture | 2 | 5 | nodes | 7 | 18 |
| checks | 1 | 6 | page | 2 | 12 |
| clipboard | 5 | 20 | project | 11 | 23 |
| content | 26 | 38 | selection | 12 | 28 |
| design-system | 26 | 35 | structure | 24 | 84 |
| elements | 26 | 187 | style | 31 | 337 |
| events | 3 | 11 | text | 9 | 19 |
| files | 16 | 25 | view | 34 | 106 |
| focus | 12 | 55 | workspace | 37 | 115 |
| geometry | 8 | 58 | **total** | **373** | **1.362** |

**Portas (controles da interface que acionam comandos), por tipo:**
- `panel-control`: 380
- `inspector-field`: 353
- `shortcut`: 209
- `menu`: 111
- `command-bar`: 74
- `toolbar`: 46
- `quick-panel`: 45
- `canvas-handle`: 44
- `context-menu`: 35
- `panel-drag`: 26
- `canvas-drag`: 19
- `canvas-click`: 15
- `canvas-wheel`: 3
- `layers-drag`: 2

**Desfazíveis (campo `history.undoable`):**
- desfazíveis: 203 comandos com 924 portas;
- não desfazíveis: 170 comandos com 438 portas.

**Tabela de tratadores:**
- 358 entradas em `src/app/commands.ts`, mais 15 do módulo `layout-composer` (`src/app/modules.ts:24` `export const MODULE_COMMANDS = { ...byCommand(LAYOUT_COMPOSER.handlers) } as const;`), somando 373;
- nenhuma entrada está como `NOT_AVAILABLE_YET`;
- fechamento da tabela: `src/app/commands.ts:512` `} as const satisfies CommandTable<EditorUi>;`

**Features:** 214 em `manifest/features/`.
- Todas têm `intent` e `scenarios`.
- Todas estão registradas com `registerFeature`.
- Instalação da tabela: `src/app/features.ts:250` `installFeatureTable(FEATURES);`

**Outros catálogos:**
- `manifest/elements.json`:
  - 61 tipos de elemento;
  - 93 atributos.
- `manifest/properties.json`:
  - 181 propriedades;
  - 26 composições;
  - 15 estados;
  - 4 breakpoints;
  - 22 `conceptRows`;
  - 9 `controls`.
- `manifest/layout.json`:
  - 92 regiões;
  - 12 menus;
  - 9 controles locais.
- `manifest/interactions.json`:
  - 39 contextos de tecla;
  - 49 gestos.
- `manifest/environment.json`:
  - 2 viewports;
  - os locales.

**Estimativa de itens de `requisitos.md`:**
- itens:
  - 373 comandos;
  - 61 tipos de elemento;
  - 181 propriedades;
  - 9 controles locais;
  - 9 transversais: salvar, carregar, desfazer, refazer, breakpoints, estados, classes, quadros-chave e idiomas.
- **total: cerca de 633**, mais os controles sem comando que a Fase 2 encontrar no código.
- O comportamento esperado vem do `intent` e dos `scenarios` da feature (DCS-004, seção I).

---

## B. Leitura integral (Fase 2)

### B.1 Regra dos lotes
- **Definição:** cada lote é um conjunto exato de prefixos de caminho sobre o escopo de A.1. O prefixo mais longo vence.
  - `[l-z]` quer dizer: o nome seguinte ao prefixo (arquivo ou subpasta) começa por uma letra de l a z.
  - O prefixo vazio quer dizer: os arquivos da raiz.
- **Lista exata de arquivos:** o primeiro passo da Fase 2 roda `node tools/audit/lotes.mjs`. Ele grava `auditoria/lotes/<lote>.md` com, para cada arquivo:
  - caminho;
  - linhas;
  - SHA1;
  - a lista exata de leituras (`offset`, `limit`), cada uma com custo até 50.000.
- **Conferência:** o script compara as contagens com a tabela abaixo e recusa partição com arquivo sem lote ou em dois lotes.

### B.2 Lotes, responsáveis e ondas
A coluna "leit." é o número de chamadas de `Read` com o alvo de 50.000.

| lote | quem | onda | prefixos exatos | arq. | linhas | KB | tokens est. | leit. |
|---|---|---|---|---|---|---|---|---|
| L01 | principal | 1 | `src/core/store/` `src/core/history/` `src/core/commands/` `src/core/ports/` `src/core/document/` `src/core/a11y/` `src/core/testing/` e arquivos soltos de `src/core/` | 43 | 5.712 | 330 | 127k | 43 |
| L02 | subagente | 1 | `src/core/selection/` `structure/` `nodes/` `text/` `geometry/` `page/` `project/` `files/` `clipboard/` (todos sob `src/core/`) | 74 | 7.794 | 481 | 186k | 74 |
| L03 | subagente | 1 | `src/core/style/` `design/` `elements/` `forms/` | 89 | 9.317 | 574 | 222k | 89 |
| L04a | subagente | 1 | `src/core/render/` `export/` `import/` `capture/` | 46 | 7.066 | 424 | 164k | 48 |
| L04b | subagente | 1 | `src/core/data/` `animation/` `events/` `motion/` | 43 | 7.869 | 469 | 181k | 43 |
| L05a | principal | 2 | `src/editor/store*` `src/editor/input/` `src/editor/persistence/` `src/app/` `src/main.tsx` `src/env.d.ts` `src/config/` `src/editor/state*` `src/editor/wiring*` | 48 | 6.648 | 398 | 154k | 48 |
| L05b | subagente | 2 | demais arquivos soltos de `src/editor/` e `doors/` `drag/` `focus/` `menus/` `command-bar/` `preferences/` `project/` | 34 | 3.363 | 196 | 76k | 34 |
| L06 | subagente | 2 | `src/editor/inspector/` `forms/` `quick-panel/` `checks/` `layers/` `palette/` `explorer/` `code-panel/` `data/` `import/` `capture/` `assistant/` | 72 | 6.784 | 398 | 154k | 72 |
| L07 | subagente | 3 | `src/editor/canvas/` `view/` `workspace/` `timeline/` | 73 | 10.457 | 627 | 242k | 74 |
| L08 | subagente | 3 | `src/editor/motion/` (sem `vendor/`) | 31 | 5.158 | 255 | 99k | 31 |
| L09a | subagente | 3 | `src/editor/shell/` cujo nome seguinte começa de a até k (último: `interactions.tsx`) | 41 | 11.769 | 548 | 212k | 44 |
| L09b | subagente | 3 | `src/editor/shell/[l-z]`, com a subpasta `sidebar/` (primeiro: `link-picker.ts`) | 47 | 8.112 | 327 | 126k | 47 |
| L10a | subagente | 4 | `src/modules/` | 52 | 8.494 | 502 | 194k | 53 |
| L10b | subagente | 4 | `src/manifest/` `src/ui/` | 28 | 5.611 | 334 | 129k | 29 |
| L10c | subagente | 4 | `src/i18n/` | 5 | 7.584 | 416 | 161k | 13 |
| L11a | subagente | 4 | `manifest/commands/` menos os seis de L11b | 19 | 24.764 | 665 | 257k | 28 |
| L11b | subagente | 4 | `manifest/commands/` `style.json` `structure.json` `text.json` `view.json` `workspace.json` `selection.json` | 6 | 22.789 | 618 | 239k | 19 |
| L12 | subagente | 4 | `manifest/` `checks.json` `consumers.json` `css-exclusions.json` `elements.json` `environment.json` `interactions.json` `layout.json` `properties.json` `references.json` | 9 | 16.808 | 420 | 162k | 17 |
| L13a | subagente | 5 | `manifest/features/02-structure-editing.json` | 1 | 18.163 | 545 | 211k | 14 |
| L13b | subagente | 5 | `manifest/features/` `01-` `03-` `05-` `06-` | 4 | 13.389 | 385 | 149k | 12 |
| L14a | subagente | 5 | `manifest/features/04-inspector.json`, leituras 1 a 15 (linhas 1 a 21.009) | 1 | 21.009 | 587 | 226k | 15 |
| L14b | subagente | 5 | `manifest/features/04-inspector.json`, leituras 16 a 30 (linhas 21.010 a 41.571) | (mesmo) | 20.562 | 586 | 227k | 15 |
| L15a | subagente | 5 | `manifest/features/07-elements.json`, leituras 1 a 12 (linhas 1 a 15.730) | 1 | 15.730 | 486 | 188k | 12 |
| L15b | subagente | 5 | `manifest/features/07-elements.json`, leituras 13 a 25 (linhas 15.731 a 32.650) | (mesmo) | 16.920 | 486 | 188k | 13 |
| L16 | subagente | 5 | `manifest/features/` `08-` `09-` `10-` `11-` `12-` | 5 | 27.782 | 805 | 311k | 22 |
| L17a | subagente | 5 | `manifest/features/` `13-` `14-` `15-` `16-` | 4 | 21.115 | 635 | 245k | 18 |
| L17b | subagente | 5 | `manifest/features/` `17-` a `22-` | 6 | 17.714 | 515 | 199k | 16 |
| L18a | subagente | 5 | `manifest/features/` `23-` `26-` | 2 | 13.637 | 423 | 164k | 12 |
| L18b | subagente | 5 | `manifest/features/24-motion.json` | 1 | 19.977 | 560 | 216k | 15 |
| L18c | subagente | 5 | `manifest/features/25-content.json` | 1 | 13.817 | 493 | 191k | 13 |
| L19 | subagente | 5 | `manifest/features/fixtures/` | 62 | 8.238 | 298 | 115k | 65 |
| L20a | subagente | 6 | `tests/e2e/` cujo nome seguinte começa de a até h (último: `html-import-roundtrip.spec.ts`) | 85 | 11.199 | 674 | 260k | 85 |
| L20b | subagente | 6 | `tests/e2e/[i-p]` | 60 | 7.196 | 429 | 166k | 60 |
| L20c | subagente | 6 | `tests/e2e/[q-z]` | 62 | 7.183 | 427 | 165k | 62 |
| L21 | subagente | 6 | `tests/support/` `tests/perf/` | 38 | 9.405 | 254 | 98k | 42 |
| L22a | subagente | 6 | `tools/` (inclui `tools/audit/`, criado na Fase 1) | 97 | 14.749 | 844 | 326k | 100 |
| L22b | subagente | 6 | `companion/` e os 16 arquivos da raiz | 27 | 1.415 | 81 | 31k | 27 |
| **total** | | | | **1.217** | **455.299** | **17.497** | **6.761k** | **1.424** |

Os 16 arquivos da raiz em L22b são:
- `PROMPT.md`, `CLAUDE.md`
- `.dependency-cruiser.cjs`, `.gitignore`, `.mcp.json`
- `eslint.config.js`, `index.html`, `package.json`, `playwright.config.ts`
- `tsconfig.app.json`, `tsconfig.core.json`, `tsconfig.json`, `tsconfig.node.json`
- `vite.config.ts`, `vite.proofs.config.ts`, `vitest.config.ts`

O agente principal fica com:
- **L01:** núcleo, ponto garantidor de G1 (`dispatch` com `EditContext`);
- **L05a:** store do editor, `src/editor/input/` e `src/editor/persistence/`, pontos garantidores de G1 e G2.

Todo o resto vai para subagentes `general-purpose`, com até 6 ao mesmo tempo.

### B.3 Ordem de leitura (do núcleo para as bordas)
- **Onda 1, núcleo:** L01 (principal) junto com L02, L03, L04a e L04b.
- **Onda 2, store do editor, entrada e persistência:** L05a (principal) junto com L05b e L06 (inspector).
- **Onda 3, canvas e shell:** L07, L08, L09a e L09b.
- **Onda 4, módulos, leitor do manifesto, i18n e manifesto de comandos:** L10a, L10b, L10c, L11a, L11b e L12.
- **Onda 5, features e fixtures:** L13a a L19.
- **Onda 6, testes, ferramentas e raiz:** L20a a L22b.

Uma onda começa quando a anterior fecha com `node tools/audit/check.mjs --so C1,C2,C7 --lote <cada lote da onda>` sem pendências.

### B.4 Procedimento de cada lote (texto do prompt do subagente)
1. **Retomada:** relê do disco:
   - `auditoria/plano-execucao.md`, seções B e D;
   - `auditoria/lotes/<lote>.md`;
   - o próprio `auditoria/inventario/<lote>.md`. Arquivo já registrado com o SHA1 atual não é relido.
2. **Leitura de cada arquivo:**
   - faz exatamente as leituras listadas em `lotes/<lote>.md`: um `Read` sem `offset`/`limit` quando há uma parte só, ou as partes contíguas, em que cada `offset` é o anterior mais o `limit`;
   - se o `Read` responder "PARTIAL", relê aquela faixa em duas metades e registra o fato.
3. **Gravação:** logo depois de ler, acrescenta o bloco do arquivo em `auditoria/inventario/<lote>.md` (formato D.1), com as partes lidas. Nunca escreve de memória.
4. **Fechamento:** `node tools/audit/check.mjs --so C1,C2,C7 --lote <lote>` sem pendências. Se reprovar, refaz o registro.
5. **Proibido:** palavras proibidas, citação aproximada e conclusão sobre arquivo de outro lote.

Arquivos fora do escopo (`src/generated/`, `manifest/generated/`, `vendor/`) não entram nos lotes. Quando um fluxo passa por eles na Fase 5, o agente lê o trecho com `Read`, cita a linha e cita a parte do gerador que o produz.

### B.5 Como os registros não se sobrescrevem
- **Arquivo de cada lote:** cada lote escreve só em `auditoria/inventario/<lote>.md`.
  - L14a e L14b têm blocos do mesmo arquivo; o script une as partes.
  - L15a e L15b funcionam do mesmo jeito.
- **Pilha de versões:** o principal grava `auditoria/inventario/stack.md`.
- **Arquivo final:** `inventario-arquivos.md` só é escrito por `node tools/audit/juntar-inventario.mjs`, rodado pelo principal ao fim de cada onda.
  - Saída ordenada por caminho.
  - Une as partes do mesmo arquivo vindas de lotes diferentes.
  - Recusa bloco duplicado com propósito divergente.
- **Demais registros:** a mesma regra vale para `requisitos.md`, `estado.md`, `entradas.md` e `matriz.md`. Cada subagente escreve em `auditoria/<registro>/<área>.md`, e o principal junta com `node tools/audit/juntar.mjs <registro>`.

### B.6 Demais passos da Fase 2
1. **`padroes.json`:** rascunho da seção F, confirmado na documentação (seção C).
2. **`requisitos.md`:**
   - um subagente por domínio de comando (25);
   - um para tipos de elemento e atributos;
   - um para propriedades e composições;
   - o principal faz os transversais e os controles locais.
3. **Fontes do comportamento esperado de cada requisito:**
   - o `intent` e os `scenarios` da feature (DCS-004);
   - rótulo i18n;
   - recusas e confirmações do comando;
   - regras G1 a G7;
   - integridade (DCS-001);
   - decisões do dono.
   - Divergência entre o código e o `intent`/`scenarios` é registrada como `DEF-`.

---

## C. Pesquisa da documentação
**Molde do `prompt` do WebFetch:** `Documentação oficial de <pacote> <versão>: confirme assinatura e semântica de <APIs>; aponte o que mudou até a versão <versão>.`
- A trava confere nome e versão no texto da URL somado ao prompt (`.claude/hooks/vistoria.mjs:295` `const ok = texts.some((t) => t.includes(name) && versionTokens(ver).some((tok) => hasToken(t, tok)));`).
- Quando o site só documenta a versão mais nova, busca também a fonte da tag da versão instalada.

| pacote e versão | URL oficial (e fonte da tag) | APIs a conferir |
|---|---|---|
| react 19.3.0 | https://react.dev/reference/react ; https://github.com/facebook/react/releases/tag/v19.3.0 | `useState` `useRef` `useEffect` `useLayoutEffect` `useSyncExternalStore` `useMemo` `useCallback` `useContext` `createContext` `useId` `memo` `Component` `createRef` `Fragment` `StrictMode` `act` |
| react-dom 19.3.0 | https://react.dev/reference/react-dom ; https://react.dev/reference/react-dom/client/createRoot | `createPortal` `flushSync` `createRoot` com `onUncaughtError` |
| zod 4.6.5 | https://zod.dev/api ; https://github.com/colinhacks/zod/releases/tag/v4.6.5 | `z` e os métodos chamados (lista na Fase 2) |
| css-tree 3.2.1 | https://github.com/csstree/csstree/tree/v3.2.1/docs | `parse` `generate` `walk` `lexer` `fork` `definitionSyntax` `toPlainObject` |
| html-to-image 1.11.13 | https://github.com/bubkoo/html-to-image/tree/v1.11.13 | `toSvg` e opções |
| happy-dom 20.14.5 | https://github.com/capricorn86/happy-dom/wiki ; tag v20.14.5 | `Window` `Document` `Element` `Node` |
| ws 8.21.3 | https://github.com/websockets/ws/blob/8.21.3/doc/ws.md | `WebSocketServer` |
| parse5 8.0.1 | https://parse5.js.org/ | `parse` `DefaultTreeAdapterMap` |
| html-validate 11.16.0 | https://html-validate.org/dev/using-api.html ; https://html-validate.org/usage/elements.html | `HtmlValidate`, metadados `elements/html5` |
| fast-check 4.10.2 | https://fast-check.dev/docs/introduction/ | `fc` (propriedades e arbitrários usados) |
| vitest 5.0.1 | https://vitest.dev/api/ ; https://vitest.dev/config/ | `describe` `it` `test` `expect` `vi`, ganchos, `defineConfig` `configDefaults` `fsModuleCache` `configureVitest` |
| @playwright/test 1.63.0 | https://playwright.dev/docs/api/class-browsertype ; https://playwright.dev/docs/api/class-page ; https://playwright.dev/docs/api/class-route ; https://playwright.dev/docs/test-reporter-api/ | `chromium.launch` (`channel` `headless` `ignoreDefaultArgs`) `newContext` (`viewport` `locale` `deviceScaleFactor`) `route.fulfill` `evaluate` `Locator`, reporter |
| vite 8.3.0 | https://vite.dev/config/ ; https://vite.dev/guide/api-plugin ; https://vite.dev/guide/env-and-mode | `defineConfig` `define` `build` (`lib` `minify` `sourcemap`), `server.watch`, plugins (`transformIndexHtml` `handleHotUpdate` `generateBundle` `apply`), `normalizePath`, modo `e2e` |
| @vitejs/plugin-react 6.1.1 | https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react | `react()` |
| eslint 10.11.0 | https://eslint.org/docs/latest/use/configure/configuration-files ; https://eslint.org/docs/latest/extend/custom-rules ; https://eslint.org/docs/latest/integrate/nodejs-api | `defineConfig` `globalIgnores` `Linter` `RuleTester` `SourceCode`, `max-len` `max-statements-per-line` `no-restricted-imports` `no-restricted-globals`, `--cache` `--max-warnings` |
| @eslint/js 10.0.1 | https://www.npmjs.com/package/@eslint/js/v/10.0.1 | `configs.recommended` |
| @eslint/css 2.0.0 | https://github.com/eslint/css | linguagem `css/css`, `CSSRuleDefinition` |
| @eslint/core 1.2.1 | https://github.com/eslint/rewrite/tree/main/packages/core | `RuleDefinition` `RuleVisitor` |
| eslint-plugin-react-hooks 7.1.1 | https://react.dev/reference/eslint-plugin-react-hooks | `configs.flat.recommended` |
| globals 17.12.0 | https://github.com/sindresorhus/globals | `browser` `node` `serviceworker` |
| typescript-eslint 8.70.1 | https://typescript-eslint.io/packages/typescript-eslint ; https://typescript-eslint.io/users/configs | `configs.strict` |
| @typescript-eslint/utils 8.70.1 | https://typescript-eslint.io/packages/utils | `TSESTree` |
| dependency-cruiser 18.5.0 | https://github.com/sverweij/dependency-cruiser/blob/v18.5.0/doc/rules-reference.md | `no-circular`, `npm-no-pkg`, `tsPreCompilationDeps`, `enhancedResolveOptions` |
| es-module-lexer 2.3.2 | https://github.com/guybedford/es-module-lexer | `init` `parse` |
| @mdn/browser-compat-data 8.1.2 | https://github.com/mdn/browser-compat-data/tree/v8.1.2/schemas | esquema dos dados de compatibilidade |
| @webref/css 8.7.5 | https://github.com/w3c/webref/tree/main/packages/css | estrutura de `css.json` |
| source-map-js 1.2.2 | https://github.com/7rulnik/source-map-js | `SourceMapConsumer` `RawSourceMap` |

**Além da trava (regra 6 do PROMPT):**
- **typescript 6.0.3:** https://www.typescriptlang.org/tsconfig/, para as opções dos `tsconfig*.json`.
- **playwright 1.63.0:** as mesmas páginas do `@playwright/test`, para o laboratório.
- **lottie-web 5.13.0:** https://github.com/airbnb/lottie-web/tree/v5.13.0, para a API que o runtime de motion chama. O rastreamento vai até a chamada do reprodutor.
- **APIs do navegador lidas nos ramos:** MDN de cada uma (lista em H.1).

A pesquisa roda na Fase 2, em paralelo à leitura, num subagente. Cada consulta é registrada em `auditoria/inventario/stack.md` com URL, data e o que foi confirmado.

---

## D. Formatos dos registros (legíveis por máquina)

### Convenções comuns
**Identificadores:**

| registro | formato |
|---|---|
| requisito | `REQ-<nnnn>` |
| estado | `EST-<lote>-<nnn>` |
| entrada | `ENT-<lote>-<nnnn>`; porta de comando: `ENT-P-<domínio>-<nnnn>` |
| trecho compartilhado | `TRC-<id do comando>` (por exemplo `TRC-history.undo`) ou `TRC-<lote>-<nnn>` para trecho fora de comando |
| grupo de leitores | `GRL-<EST>-<nn>` |
| grupo de escritores | `GRE-<EST>-<nn>` |
| defeito | `DEF-<nnnn>` |
| otimização | `OTM-<nnn>` |
| decisão | `DCS-<nnn>` |
| medição | `MED-<nnnn>` |
| exclusão | `EXC-<nnnn>` |

**Estrutura dos itens:**
- Cada item é um título `## <ID> — <nome>`, seguido de campos `- **<Campo>:** <valor>`.
- Campo com vários valores tem um subitem por valor.

**Citação:**
- **Formato:** `` `caminho:LINHA` `trecho` ``.
- **Regra de conferência (a mesma da trava):** o trecho aparado é igual à linha aparada, ou o trecho tem 6 ou mais caracteres não brancos e está contido na linha.
  - Prova: `.claude/hooks/vistoria.mjs:338` `const okPart = s.replace(/\s/g, '').length >= 6 && line.includes(s);`
- **Linha com crase:** cita-se um trecho sem a crase.
- **Referência nua:** `` `caminho:LINHA` `` sem trecho só vale para apontar posição. A linha precisa existir.

**Marcas de estado nos passos:**
- `[lê: EST-x via <função>]`
- `[escreve: EST-x via <função>]`
- A função é a que lê ou escreve S naquela linha. Os grupos da Fase 7 saem dessas marcas.

### D.1 `inventario-arquivos.md` (e `inventario/<lote>.md`, `inventario/stack.md`)
```markdown
# Inventário de arquivos
## Stack
| pacote | versão instalada | consultas (stack.md) |
|---|---|---|
| react | 19.3.0 | 2026-10-xx: https://react.dev/reference/react |

## Arquivos
### `src/main.tsx`
- **Lote:** L05a
- **Linhas:** 86
- **SHA1:** 714ca510fcde885f0c1f5f0897e875231879bdec
- **Partes lidas:** 1-86
- **Propósito:** ponto de entrada do editor: instala as portas do navegador e a tabela de comandos, restaura o trabalho salvo, cria a store do editor e monta o React.
- **Âncora:** `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
```

### D.2 `padroes.json`
```json
{
  "versao": 1,
  "alvos": {
    "codigo": { "incluir": ["src/**/*.ts", "src/**/*.tsx"], "excluir": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/core/testing/**", "src/generated/**", "src/**/vendor/**", "src/**/*.typecheck.ts"] },
    "manifesto": { "incluir": ["manifest/commands/*.json"], "excluir": [] }
  },
  "padroes": [
    { "id": "P-E01", "tipo": "estado", "alvo": "codigo", "regex": "^(export\\s+)?let\\s+\\w+", "flags": "m",
      "justificativa": "variável mutável de módulo", "fonte": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let" }
  ]
}
```
Exclusões ficam em `estado.md` e `entradas.md` (seção `## Excluídos`), para que a trava confira as citações delas.

### D.3 `requisitos.md`
```markdown
## REQ-0123 — Desfazer
- **Onde:** `manifest/commands/history.json:5` `"id": "history.undo",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Feature:** `src/app/features.ts:20` `'undo-redo': registerFeature('undo-redo'),`
- **Recusa declarada:** `manifest/commands/history.json:12` `"refusalKey": "status.undo.nothing"`
- **Comportamento esperado:** <texto do intent e dos scenarios da feature undo-redo, citados, completado pelo rótulo i18n e pela regra de integridade da pilha de undo/redo>
- **Entradas:** ENT-P-history-0001, ENT-P-history-0002
- **Trecho:** TRC-history.undo
```

### D.4 `estado.md`
O exemplo abaixo usa só `src/main.tsx`, lido por inteiro.
```markdown
## EST-L05a-001 — instância da store do editor
- **Declaração:** `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- **Forma:** valor de retorno de createEditorStore (tipo a citar em src/editor/store.ts)
- **Valores possíveis:**
  - V1 inexistente: enquanto o boot espera nas linhas 59, 60 e 63 de src/main.tsx
  - V2 criada: depois da linha 64
- **Escritores:**
  - ENT-L05a-0001 `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- **Leitores:**
  - ENT-L05a-0001 `src/main.tsx:65` `startAutosave(store, saved, restored !== null, isEditing);`
  - ENT-L05a-0001 `src/main.tsx:66` `startDrafts(store, currentWorkRevision, isEditing);`
  - ENT-L05a-0001 `src/main.tsx:82` `<App store={store} />`
- **Criação:** `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- **Descarte:** fim-da-página `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- **Navegador:** não

## Excluídos
### EXC-0001
- **Padrão:** P-E03
- **Ocorrência:** <citação da linha>
- **Motivo:** <por que não é estado que sobrevive à chamada, com a citação do fim do escopo>
```
- O campo `Navegador` aceita `não`, `foco`, `seleção-de-texto`, `rolagem`, `documento-do-iframe` ou `captura-de-ponteiro`.
- `fim-da-página` só vale com a citação da declaração em escopo de módulo ou do boot.

### D.5 `entradas.md`
```markdown
## ENT-L05a-0001 — boot do editor
- **Tipo:** boot
- **Origem:** `index.html:11` `<script type="module" src="/src/main.tsx"></script>`
- **Início:** `src/main.tsx:37` `if (__BUILDER_TEST_PORT__) noteStoredAtStart();`
- **Fluxo:** fluxos/ENT-L05a-0001.md
- **Requisitos:** REQ-0004

## ENT-P-history-0001 — history.undo pela porta key-ctrl-z-in-global
- **Tipo:** comando-porta shortcut
- **Comando:** history.undo
- **Porta:** `manifest/commands/history.json:21` `"id": "key-ctrl-z-in-global",`
- **Gatilho:** `manifest/commands/history.json:24` `"chord": "Ctrl+Z",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Início:** <citação da linha do keymap que despacha a porta; arquivo não lido>
- **Fluxo:** fluxos/ENT-P-history-0001.md
- **Requisitos:** REQ-0123
```
Tipos aceitos:
- comandos e atalhos: `comando-porta <kind>`, `atalho`;
- ouvintes: `listener`, `handler-jsx`;
- ciclo de vida: `montagem`, `desmontagem`;
- assíncronos: `timer`, `frame`, `microtarefa`, `observer`, `mensagem`, `promessa`, `assinatura-de-store`;
- inicialização: `boot`, `carga-de-projeto`, `restauração-de-rascunho`.

### D.6 `fluxos/<ENT>.md` e `fluxos/trechos/<TRC>.md`
**Seções obrigatórias**, nesta ordem e com estes títulos, nos dois tipos de arquivo:
- `## Passos`
- `## Ramos`
- `## Fronteiras assíncronas`
- `## Estado`
- `## Resultado`
- `## Regras`
- `## Limpeza`
- `## Medições`

**Trecho de comando (`fluxos/trechos/TRC-<comando>.md`).** Há um por comando e ele começa no despacho para o tratador. Leva, antes das seções:
- `- **Chamada:**`: a citação da chamada onde o trecho começa;
- `- **Argumentos:**`: a forma dos argumentos, com o nome de cada campo;
- `- **Ramos que dependem dos argumentos:**`: os ids dos ramos (R1, R2…) cujo caminho muda com o valor de um argumento.

**Fluxo de porta.**
- Rastreia o caminho próprio, do handler da porta até a chamada do trecho.
- Termina com `- **Trecho:** TRC-<comando>` e `- **Argumentos enviados:**`, com os valores que a porta envia.
- Tem a seção `## Ramos do trecho`, com um item para cada ramo listado no trecho e o caminho que os argumentos desta porta tomam, citado.
- A prova de G3 compara os argumentos enviados por todas as portas do comando.

Exemplo de forma de fluxo de entrada. Os campos não citados ficam a preencher, porque as funções chamadas não foram lidas.
```markdown
# ENT-L05a-0001 — boot do editor
## Passos
1. `src/main.tsx:59` `await claimEditing();` — abre claimEditing (src/editor/persistence/tab-guard.ts) e segue cada chamada.
2. `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });` [escreve: EST-L05a-001 via createEditorStore]
3. `src/main.tsx:65` `startAutosave(store, saved, restored !== null, isEditing);` [lê: EST-L05a-001 via startAutosave]
## Ramos
- R1 `src/main.tsx:45` `if (!container) {` — sem #root: `src/main.tsx:46` `throw new Error('The #root element is missing from index.html.');` — com #root: segue para `src/main.tsx:51` `const icons = document.createElement('div');`
## Fronteiras assíncronas
- F1 `src/main.tsx:59` `await claimEditing();` — entradas que podem rodar no intervalo: <ids>; estado: EST-L05a-001 em V1
- F2 `src/main.tsx:60` `const saved = await readSavedWork();` — <ids>; <estado>
## Estado
- lê: EST-L05a-001
- escreve: EST-L05a-001
## Resultado
- **Estado final:** EST-L05a-001 em V2
- **Re-renderizado:** árvore montada por `src/main.tsx:77` `createRoot(container, {`
- **DOM do editor:** sprite de ícones por `src/main.tsx:54` `document.body.prepend(icons);` e <o que App monta>
- **DOM do canvas:** <a citar>
## Regras
- G1: n/a — <motivo citado>
- G2: <ok citado | DEF-nnnn | n/a com motivo>
- G3: …
- G4: …
- G5: …
- G6: …
- G7: …
- INT: …
## Limpeza
- <criação citada> → remoção <citação> | DEF-nnnn
## Medições
- nenhuma | MED-nnnn
```

### D.7 `matriz.md`
```markdown
## EST-L05a-001
- **Escritores:** ENT-L05a-0001
- **Leitores:** ENT-L05a-0001
- **Grupos de escritores:** nenhum
- **Grupos de leitores:** nenhum
- **Pares:** EST-L05a-001__ENT-L05a-0001__ENT-L05a-0001
```
Formato de um grupo:
```markdown
- **Grupos de escritores:**
  - GRE-EST-x-01: <citação da declaração da função> — cobre ENT-a, ENT-b, ENT-c
- **Grupos de leitores:**
  - GRL-EST-x-01: <citação da declaração da função> — cobre ENT-d, ENT-e
- **Pares:** EST-x__GRE-EST-x-01__GRL-EST-x-01, EST-x__ENT-f__GRL-EST-x-01
```

### D.8 `interacoes/<EST>__<A ou GRE>__<B ou GRL>.md`
```markdown
# EST-L05a-001 × ENT-L05a-0001 → ENT-L05a-0001
- **Estado:** EST-L05a-001
- **Escritor:** ENT-L05a-0001
- **Leitor:** ENT-L05a-0001
## Estados deixados por A
- A1 final: V2 `src/main.tsx:64` `const store = createEditorStore({ restored, recovery, narrow: windowIsNarrow() });`
- A2 intermediário: V1 durante F1 e F2
## Casos
### C1 final
- **Rastreamento:** <passos de B a partir de A1, citados>
- **Resultado:** ok `src/main.tsx:65` `startAutosave(store, saved, restored !== null, isEditing);`
### C2 intermediário
- **Resultado:** <ok citado | DEF | n/a com motivo citado>
### C3 em curso
- **Resultado:** …
### C4 desmontagem
- **Resultado:** …
## Resultado
- ok | DEF-nnnn
```
**Par de grupo de escritores:**
- `Escritor` traz o id `GRE-`, a citação da função e a lista completa dos membros.
- Em `Estados deixados por A`, cada estado distinto aparece uma vez, com a citação do membro (ou do trecho do comando) que o produz.
- `Casos` rastreia o leitor a partir de cada estado listado.

**Par de grupo de leitores:** `Leitor` traz o id `GRL-`, a citação da função e a lista completa das entradas cobertas.

### D.9 `defeitos.md`
```markdown
## DEF-0001 — <título>
- **Status:** aberto | corrigido
- **Citação:** <citação do ponto do defeito>
- **Causa:** …
- **Efeito:** …
- **Alcance:** ENT-… ; EST-…__ENT-…__ENT-…
- **Itens de estado tocados:** EST-…
- **Correção:** <citação do código corrigido>          (obrigatório se corrigido)
- **Re-rastreados:** fluxos: …; trechos: …; pares: …   (obrigatório se corrigido)
- **Verificação:** saída resumida de typecheck, lint e check.mjs
```

### D.10 `otimizacoes.md`
```markdown
## OTM-001 — <título>
- **Status:** aberta | aplicada
- **Citação:** …
- **Tipo:** re-render | layout-forçado | árvore | listener | bundle
- **Medida antes:** <valor> (MED-nnnn)
- **Medida depois:** <valor> (MED-nnnn)                 (obrigatório se aplicada)
- **Itens de estado tocados:** …
- **Re-rastreados:** …
```

### D.11 `decisoes.md`
```markdown
## DCS-001 — <questão>
- **Origem:** dono (2026-10-08) | execução (regra 3 do PROMPT)
- **Opções:** (a) … (b) …
- **Escolhida:** (a)
- **Comportamento atual:** <citação, quando a origem é a execução>
- **Efeito no plano:** <fases e conferências afetadas>
- **Requisitos afetados:** REQ-…
```

### D.12 `medicoes/`
- Cada medição tem dois arquivos:
  - `MED-nnnn.mjs`: o script;
  - `MED-nnnn.md`: o registro.
- Campos do registro:
  - **Fluxo e passo:** de onde vem a medição;
  - **Configuração:** A ou B;
  - **Build:** SHA1 de `dist/index.html` e do chunk principal;
  - **Commit:** o commit e o estado do `git status` ao medir;
  - **Valor:** o valor medido;
  - **Saída:** a saída bruta, num bloco de código.

---

## E. Verificador `tools/audit/check.mjs`
**Uso:** `node tools/audit/check.mjs [--ate-fase N] [--so C1,C2] [--lote Lxx] [--resumo]`.
- Sem argumentos roda tudo. É o que a trava de encerramento executa.
- Só usa módulos nativos do Node: `fs`, `path`, `crypto`, `child_process`.
- Lê `ignorar`, `limiteLeituraCaracteres` e `palavrasProibidas` de `.claude/vistoria.config.json` pelo `fs`, sem citar a pasta na linha de comando.

**Saída:**
- uma linha por conferência: `C1 inventário: 1217 no escopo | 1217 inventariados | 0 pendências`;
- depois, as pendências: `PENDENTE <Cn> <registro ou caminho>: <motivo>`;
- por fim, `TOTAL: N pendências`;
- código de saída 1 quando N > 0.

### C1 Inventário
- **Lê:**
  - o escopo da trava: `git ls-files -co --exclude-standard` menos `ignorar`;
  - os blocos de título de nível 3 (caminho entre crases) de `inventario-arquivos.md` e de `inventario/*.md`;
  - com `--lote`, só os arquivos daquele lote.
- **Pendência:**
  - arquivo do escopo sem bloco;
  - bloco de arquivo inexistente ou fora do escopo;
  - SHA1 diferente do atual;
  - `Partes lidas` sem cobrir 1..Linhas;
  - parte com custo acima de `limiteLeituraCaracteres`, calculado como na trava (caracteres das linhas mais 8 por linha);
  - `Propósito` vazio;
  - `inventario-arquivos.md` diferente do que `juntar-inventario.mjs` geraria;
  - pacote importado sem linha na Stack;
  - versão da Stack diferente de `node_modules`;
  - pacote da Stack sem consulta registrada.
- **Imprime:** `PENDENTE C1 src/x.ts: SHA1 mudou desde a leitura`.

### C2 Citações
- **Lê:**
  - todo arquivo de texto de `auditoria/` (`.md`, `.json`, `.mjs`);
  - nas citações, o regex da trava; nas referências nuas, `` `caminho:LINHA` `` sem trecho.
- **Pendência:**
  - arquivo inexistente;
  - linha fora do intervalo;
  - trecho que não confere (regra de D);
  - referência a id (`ENT-`, `EST-`, `TRC-`, `DEF-`, `MED-`, `REQ-`, `GRE-`, `GRL-`) que não existe. Essa checagem só olha texto fora de blocos e trechos de código, porque os exemplos deste plano ficam em blocos.
- **Imprime:** `PENDENTE C2 auditoria/fluxos/ENT-x.md:14 cita src/y.ts:88: trecho não está na linha`.

### C3 Padrões de busca
- **Lê:**
  - `padroes.json`;
  - aplica cada regex aos alvos;
  - recolhe as ocorrências (arquivo, linha).
- **Pendência:**
  - ocorrência de padrão `estado` sem citação dessa linha em `estado.md`;
  - ocorrência de padrão `entrada` sem citação em `entradas.md`;
  - ocorrência sem bloco `EXC-` com motivo e a mesma citação;
  - regex que não compila;
  - padrão sem `justificativa` ou `fonte`.
- **Imprime:** `PENDENTE C3 P-E05 src/x.tsx:12: ocorrência sem item nem exclusão`.

### C4 Estado
- **Lê:** os blocos `## EST-` com os campos de D.4.
- **Pendência:**
  - campo ausente ou vazio;
  - `Declaração`, `Criação` ou `Descarte` sem citação;
  - `Escritores` ou `Leitores` sem citação;
  - estado escrito e nunca lido sem um `DEF` no item;
  - falta de item de navegador para cada uma das cinco categorias;
  - a partir da Fase 5: divergência entre as marcas `[lê]`/`[escreve]` (dos fluxos e dos trechos que eles citam) e as listas do item;
  - id de estado usado num fluxo e ausente de `estado.md`;
  - cópia local de seleção (item marcado `seleção`) fora da store, pela regra G6.
- **Imprime:** `PENDENTE C4 EST-L01-003: Descarte sem citação`.

### C5 Fluxos e trechos
- **Lê:** `entradas.md`, `fluxos/*.md` e `fluxos/trechos/*.md`.
- **Pendência estrutural:**
  - entrada sem arquivo de fluxo;
  - arquivo de fluxo sem entrada;
  - comando do manifesto sem `TRC-`;
  - trecho que nenhum fluxo cita;
  - seção obrigatória ausente ou vazia, em fluxo ou trecho;
  - `Passos` sem citação;
  - `Regras` sem as oito linhas (G1 a G7 e INT), cada uma com `ok` mais citação, `DEF-` ou `n/a —` mais motivo;
  - `Resultado` sem os quatro campos.
- **Pendência do trecho compartilhado:**
  - fluxo de porta sem `Trecho` ou sem `Argumentos enviados`;
  - último passo do fluxo que não cite a mesma linha da `Chamada` do trecho;
  - ramo listado em `Ramos que dependem dos argumentos` sem item em `Ramos do trecho` do fluxo da porta;
  - portas do mesmo comando que chegam ao trecho por outra chamada (G3).
- **Pendência automática:**
  - passo cuja linha citada tenha `await`, `.then(`, `setTimeout(`, `setInterval(`, `requestAnimationFrame(`, `queueMicrotask(` ou `addEventListener(` sem item em `Fronteiras assíncronas` com a mesma citação;
  - passo que cria `addEventListener`, `setInterval`, `setTimeout`, `requestAnimationFrame` ou `new *Observer` sem item em `Limpeza` com a remoção citada ou um `DEF-`;
  - passo cuja linha use uma API calculada pelo navegador (lista de H.1) sem `MED-` em `Medições`;
  - `MED-` cujo `.md` não aponte para esse fluxo ou trecho.
- **Imprime:** `PENDENTE C5 ENT-x: passo 4 tem await sem fronteira registrada`.

### C6 Interações
- **Lê:**
  - monta a matriz a partir das marcas dos fluxos e dos trechos que cada fluxo cita;
  - compara com `matriz.md`;
  - forma os grupos pelas marcas `via <função>`: escritores com todas as escritas de S pela mesma função formam um `GRE-`, e leitores com todas as leituras de S pela mesma função formam um `GRL-`;
  - pares = (grupos de escritores + escritores fora de grupo) × (grupos de leitores + leitores fora de grupo), incluindo A = B.
- **Pendência:**
  - divergência entre a matriz calculada e `matriz.md`;
  - par sem arquivo;
  - arquivo sem par;
  - arquivo sem os quatro casos (C1 final, C2 intermediário, C3 em curso, C4 desmontagem), cada um com `ok` citado, `DEF-` ou `n/a —` mais motivo citado;
  - grupo cuja função não esteja citada;
  - membro com escrita ou leitura de S por outra função (invalida o grupo);
  - par de `GRE-` sem a lista de estados distintos com a citação do membro que produz cada um.
- **Imprime:** `PENDENTE C6 EST-a__GRE-EST-a-01__ENT-c: arquivo ausente`.

### C7 Linguagem
- **Lê:**
  - todo texto de `auditoria/`;
  - remove blocos e trechos de código, como a trava faz: `.claude/hooks/vistoria.mjs:308` `const plain = stripCode(text).toLowerCase();`;
  - procura cada palavra proibida com fronteira de letra.
- **Pendência:** cada ocorrência.
- **Imprime:** `PENDENTE C7 auditoria/x.md:40: palavra proibida "<palavra>"`.

### C8 Defeitos
- **Lê:** os blocos `## DEF-`.
- **Pendência:**
  - `Status` diferente de `aberto` ou `corrigido`;
  - campo obrigatório vazio;
  - `Alcance` com id inexistente;
  - todo defeito `aberto` (pronto exige zero);
  - `corrigido` sem citação em `Correção`;
  - `Re-rastreados` que não inclua todas as entradas e os trechos que escrevem ou leem cada item de `Itens de estado tocados` (pela matriz) e todos os pares desses itens;
  - `DEF-` citado em fluxo, trecho ou par que não exista.
- **Imprime:** `PENDENTE C8 DEF-0007: aberto`.

### C9 Requisitos (acréscimo exigido pelo critério de pronto)
- **Pendência:**
  - `REQ-` sem `Onde` citado ou sem `Comportamento esperado`;
  - entrada inexistente;
  - entrada sem fluxo completo;
  - entrada alcançada por `DEF-` aberto;
  - comando do manifesto, feature ou tipo de elemento ausente de todo `REQ-`.

### C10 Otimizações
- **Pendência:**
  - `OTM-` aplicada sem as duas medidas e os `MED-` existentes;
  - `OTM-` sem `Re-rastreados`.

### Corte por fase (`--ate-fase N`)
| fase | conferências |
|---|---|
| 1 | C2, C7 |
| 2 | C2, C7, C1, C9 estrutural |
| 3 | + C4 (sem cruzamento) e C3 dos padrões de estado |
| 4 | + C3 dos padrões de entrada e C9 (entradas existem) |
| 5 e 6 | + C5 e C4 cruzado |
| 7 | + C6 |
| 8 | + C8 e C9 completo |
| 9 | + C10 (equivale à execução sem argumentos) |

---

## F. Rascunho de `padroes.json`
- **Alvo de código:** produção de `src/`, com as exclusões de D.2.
  - O `companion/` fica fora porque é a fronteira de backend: o rastreamento vai até a chamada.
  - `src/editor/motion/runtime/` fica dentro: é código da aplicação.
- **Contagem:** é a de hoje no alvo de produção. Cada padrão se confirma na documentação da seção C.

| id | tipo | regex (flags) | ocorr. | justificativa |
|---|---|---|---|---|
| P-E01 | estado | `^(export\s+)?let\s+\w+` (m) | 37 | variável mutável de módulo |
| P-E02 | estado | `^(export\s+)?const\s+\w+[^=\n]*=\s*new\s+(Map\|Set\|WeakMap\|WeakSet)\b` (m) | 149 | coleção compartilhada no módulo |
| P-E03 | estado | `^  let\s+\w+` (m) | 378 | `let` no corpo de função de topo: pega o estado fechado em fábricas (createStore); locais curtos viram `EXC-` com motivo |
| P-E04 | estado | `^(export\s+)?(abstract\s+)?class\s` (m) | 9 | cada classe obriga um item com os campos dela |
| P-E05 | estado | `\buse(State\|Reducer)\s*[<(]` | 92 | estado de componente React |
| P-E06 | estado | `\b(useRef\|createRef)\s*[<(]` | 138 | refs |
| P-E07 | estado | `\bcreateContext\s*[<(]` | 6 | contexto React |
| P-E08 | estado | `\b(useMemo\|useCallback\|memo)\s*[<(]` | 69 | memoização (cache) |
| P-E09 | estado | `\bcreate\w*Store\s*[<(]` | 7 | criação de stores |
| P-E10 | estado | `\b(localStorage\|sessionStorage\|indexedDB)\b` | 29 | armazenamento do navegador |
| P-E11 | estado | `\b(activeElement\|\.focus\s*\(\|\.blur\s*\(\|getSelection\s*\(\|contentEditable\|contenteditable\|scrollTop\|scrollLeft\|scrollTo\s*\(\|scrollIntoView\s*\(\|contentDocument\|contentWindow\|setPointerCapture\|releasePointerCapture)` | (a contar) | estado do navegador exigido na Fase 3 |
| P-N01 | entrada | `\.addEventListener\s*\(` | 105 | ouvinte do DOM |
| P-N02 | entrada | `\.on[a-z]+\s*=(?!=)` | (a contar) | ouvinte por propriedade (`onload`, `onmessage`) |
| P-N03 | entrada | `\bon[A-Z]\w*=\{` | 212 | handler no JSX |
| P-N04 | entrada | `\buse(Layout)?Effect\s*\(` | 137 | montagem e desmontagem |
| P-N05 | entrada | `\b(setTimeout\|setInterval\|requestAnimationFrame\|requestIdleCallback\|queueMicrotask)\s*\(` | 99 | timers, quadros e microtarefas |
| P-N06 | entrada | `\bnew\s+(Resize\|Mutation\|Intersection\|Performance)Observer\b` | 18 | observers |
| P-N07 | entrada | `(\.postMessage\s*\(\|['"]message['"]\|\bonmessage\b)` | 10 | mensagens entre editor e iframe |
| P-N08 | entrada | `(\.then\s*\(\|\.catch\s*\(\|\.finally\s*\(\|\bawait\s)` | 99 | continuações de Promise |
| P-N09 | entrada | `\.subscribe\s*\(` | 18 | callbacks de store |
| P-N10 | entrada | `\buseSyncExternalStore\s*\(` | 16 | leitura reativa de store |
| P-N11 | entrada | `^(await\s\|[\w$.]+\s*\(\|for\s*\(\|if\s*\()` (m) | (a contar) | efeito de topo de módulo (boot) |
| P-N12 | entrada | `\bimport\s*\(` | (a contar) | carga dinâmica |
| P-N13 | entrada | `\b(componentDidMount\|componentDidUpdate\|componentWillUnmount\|componentDidCatch\|getDerivedStateFromError)\b` | (a contar) | ciclo de vida de classe (`Component` é importado) |
| P-N14 | entrada | `^\s*"kind":\s*"` (m), alvo `manifesto` | 1.362 | cada porta de comando do manifesto |

Na tabela, `\|` é só o escape da barra vertical. No `padroes.json`, o regex usa `|`. As contagens de P-N05 e P-N08 não incluem `requestIdleCallback`, `.catch(` e `.finally(`, que a Fase 2 conta.

---

## G. Escala das interações

### G.1 Estimativas a partir dos números de A
**Itens de estado: entre 450 e 700.**
- **Base:** as ocorrências de P-E01 a P-E10, somando cerca de 900 candidatos brutos.
- **O que reduz a contagem:** várias ocorrências descrevem o mesmo item, e parte de P-E03 vira exclusão.
- **O que soma:** as 5 categorias do navegador e os itens do documento, divididos pela estrutura do próprio modelo.

**Entradas: entre 2.000 e 2.300.**
- 1.362 portas de comando.
- Entre 640 e 940 outras entradas:
  - 105 `addEventListener`;
  - os `on*=` do JSX que não são portas, menos de 212;
  - 137 montagens e até 137 desmontagens;
  - 99 timers e quadros;
  - 18 observers;
  - 10 mensagens;
  - 99 continuações;
  - 18 assinaturas;
  - boot, carga e rascunho.

**Fluxos, com os trechos compartilhados a partir do tratador de cada comando.**
- **Trechos de comando:** 373 arquivos em `fluxos/trechos/`, um por comando. Cada um é um rastreamento completo, do despacho até o fim do tratador.
- **Fluxos de porta:** 1.362 arquivos. Cada um rastreia o caminho da porta até o despacho e os ramos do trecho que os argumentos dela selecionam.
- **Fluxos de outras entradas:** de 640 a 940 arquivos, com rastreamento completo. Quando chegam a uma chamada já rastreada com os mesmos argumentos, citam o trecho em vez de repeti-lo.
- **Total:**
  - arquivos: de 2.375 a 2.675 (entradas mais trechos);
  - rastreamentos completos: de 1.013 a 1.313 (os 373 trechos mais as outras entradas);
  - antes dos trechos, eram de 2.000 a 2.300 rastreamentos completos.

**Pares, com agrupamento de escritores e de leitores.**
- **Fórmula:** Σ_S (|GRE(S)| + |escritores fora de grupo(S)|) × (|GRL(S)| + |leitores fora de grupo(S)|).
- **Quem forma o grupo de escritores:** as entradas cujas marcas `[escreve: S via F]` usam a mesma função F. Todas as portas de um comando escrevem pela função do trecho do comando, então elas caem sempre no mesmo grupo.
- **Documento:**
  - o número de grupos de escritores por item fica entre 1 e o número de funções que escrevem o item;
  - o valor 1 vale se a store do núcleo grava o documento por uma função única;
  - a granularidade se fixa na Fase 3, ao ler `src/core/store/store.ts` (não lido);
  - cerca de 25 itens do documento;
  - de 1 a 24 grupos de escritores por item (203 tratadores desfazíveis, cada um tocando de 1 a 3 itens, divididos por 25 itens);
  - de 10 a 25 grupos de leitores por item;
  - resultado: de 250 a 15.000 pares.
- **Estado de interface:**
  - de 450 a 650 itens;
  - de 1 a 3 grupos de escritores e de 1 a 5 grupos de leitores por item;
  - resultado: de 450 a 9.750 pares.
- **Total estimado:** de 700 a 24.750 arquivos em `interacoes/`, que são os limites da fórmula.
  - Antes do agrupamento de escritores, eram de 25.000 a 60.000.
- **O que não diminui:** o trabalho dentro de cada par de grupo de escritores, que lista e rastreia cada estado distinto deixado pelos membros.
- **Número exato:** sai do C6 no início da Fase 7.

### G.2 Divisão entre subagentes
- **Unidade de trabalho:** o item de estado S.
  - Um subagente recebe um S grande, ou um lote de S pequenos que some até 300 pares.
  - Um S com mais de 300 pares é dividido por faixa de grupos de escritor.
- **Sem colisão:** o nome do arquivo inclui S, A (ou o `GRE-`) e B (ou o `GRL-`).
- **Esqueletos:** `node tools/audit/esqueletos.mjs <EST>` cria só os esqueletos (título, ids, membros dos grupos e títulos de seção), nunca conteúdo.
- **Antes de começar a Fase 7:** o principal gera e congela `matriz.md` com `node tools/audit/matriz.mjs`.

### G.3 Agrupamento sem violar a regra (PROMPT, Fase 7, item 3)
**Leitores (`GRL-`):**
- todos os membros leem S só pela função F;
- a matriz cita a declaração de F e lista os membros.

**Escritores (`GRE-`):**
- todos os membros escrevem S só pela função F;
- o par lista, um a um, todos os estados distintos que os membros deixam em S, cada um com a citação do membro, ou do trecho do comando que ele usa, que o produz;
- o par rastreia o leitor a partir de cada estado.

**Conferência do C6:**
- membro com outra leitura ou escrita de S fora de F invalida o grupo;
- código diferente exige registro separado.

---

## H. Medições no navegador

### H.1 O que exige medição
**G4, o resultado da ação fica visível.**
- **O que se mede:** o elemento sob o ponto da ação precisa ser o iframe do canvas.
- **Onde:** em cada entrada que age num ponto do canvas:
  - portas `canvas-click` (15), `canvas-drag` (19), `canvas-handle` (44) e `canvas-wheel` (3);
  - os fluxos de ponteiro de `src/editor/input/pointer/`.

**G5, painéis e barras cabem.**
- **Famílias medidas:** `cut`, `wrapped`, `off-window`, `covered`, `english` e `sideways`.
- **Onde:** nas 92 regiões, 12 menus e nos painéis de `manifest/layout.json`, além de popovers, painel rápido e trilha da barra de status.
- **Como:** nas duas configurações, com documento profundo e nomes longos.
- **Família `english` (DCS-003):** aceita, por regra, as categorias técnicas (nomes e valores CSS, unidades, código, nomes de arquivo, conteúdo do usuário), além das exceções de `tests/support/screen-guard-allowed.ts`.

**G7, o canvas é o documento.**
- **Que mudanças entram:** cada tipo de mudança do documento (os 203 comandos desfazíveis e as entradas sem porta que escrevem no documento).
- **O que se compara:**
  - o DOM do iframe depois do caminho incremental;
  - o DOM depois de abrir o mesmo projeto do zero pelo boot de teste.
- **Editor e final (DCS-002):** mesmo DOM, menos uma lista fechada de marcas só do editor, declarada no código. Se essa lista não existir no código, isso é `DEF-`.

**Ramos que dependem de valor calculado.**
- **Quantidade:** 271 ocorrências em 71 arquivos de produção do escopo.
- **APIs:**
  - `getBoundingClientRect` e `getClientRects`;
  - `offset*`, `client*` e `scroll*`;
  - `getComputedStyle`;
  - `elementFromPoint`/`elementsFromPoint`;
  - `matchMedia`, `innerWidth`/`innerHeight` e `devicePixelRatio`;
  - `currentCSSZoom`;
  - `activeElement`;
  - `caretPositionFromPoint`/`caretRangeFromPoint`.
- **Maiores concentrações:**
  - `src/editor/canvas/coordinates.ts`: 35
  - `src/editor/canvas/chrome.tsx`: 23
  - `src/editor/doors/menu.tsx`: 16
  - `src/editor/shell/row-fit.ts`: 12
  - `src/editor/shell/field.tsx`: 10
  - `src/editor/motion/runtime/actions.ts`: 10
  - `src/editor/canvas/chip-fit.ts`: 9
  - `src/editor/canvas/quick-panel.tsx`: 9
  - `src/editor/input/pointer/common.ts`: 8

### H.2 Roteiro do laboratório no Windows (CLAUDE.md seção 8)
1. **Build e2e do estado atual:**
   - O modo `e2e` liga a porta de teste: `vite.config.ts:85` `const e2e = process.env.E2E_BUILD === '1' || mode === 'e2e';`
   - Comando, com prioridade baixa:
     ```powershell
     $p = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','build:e2e' -NoNewWindow -PassThru; $p.PriorityClass = 'BelowNormal'; $p.WaitForExit()
     ```
   - Depois de cada grupo de correções, refaça o build antes de medir.
2. **Servidor:**
   ```powershell
   $s = Start-Process -FilePath 'python' -ArgumentList '-m','http.server','5399','--bind','127.0.0.1','--directory','dist' -WindowStyle Hidden -PassThru; $s.PriorityClass = 'BelowNormal'
   ```
3. **Script:**
   - fica em `auditoria/medicoes/MED-nnnn.mjs`;
   - roda da raiz do projeto, para resolver `@playwright/test`:
     ```powershell
     Get-Content -Raw auditoria/medicoes/MED-0001.mjs | node --input-type=module -
     ```
   - esqueleto:
     ```js
     import { chromium } from '@playwright/test';
     const CONFIGS = {
       A: { viewport: { width: 1280, height: 720 }, locale: 'pt-BR', deviceScaleFactor: 1, barras: false },
       B: { viewport: { width: 1440, height: 900 }, locale: 'en-US', deviceScaleFactor: 1.25, barras: true },
     };
     for (const [nome, c] of Object.entries(CONFIGS)) {
       const browser = await chromium.launch({ channel: 'chrome', headless: true, ...(c.barras ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {}) });
       const context = await browser.newContext({ viewport: c.viewport, locale: c.locale, deviceScaleFactor: c.deviceScaleFactor });
       const page = await context.newPage();
       await page.route('**/__builderTestBoot.json', (route) => route.fulfill({ json: { project: PROJETO, commands: COMANDOS, drawn: DESENHADOS } }));
       await page.goto('http://127.0.0.1:5399/?test-boot');
       const valor = await page.evaluate(() => { /* medida do passo do fluxo */ });
       console.log(JSON.stringify({ config: nome, valor }));
       await browser.close();
     }
     ```
   - o formato de `{ project, commands, drawn }` se confirma em `src/editor/test-boot.ts`, ainda não lido.
4. **Regras de cada medição:**
   - **Um editor por página:** um contexto novo por configuração.
   - **Ponto no canvas:** posição do iframe mais a posição do nó vezes `iframe.currentCSSZoom`.
   - **Painel do app:** nunca usar o painel de navegador do app.
5. **Registro:**
   - `MED-nnnn.md` no formato D.12;
   - a citação do `MED-` vai no passo do fluxo ou do trecho.
6. **Ao fim do lote de medições:** `Stop-Process -Id $s.Id`.

---

## I. Ordem de execução
**Retomada e trabalho contínuo:**
- **Registro de progresso:** o principal mantém `auditoria/progresso.md` com:
  - a fase;
  - cada lote ou unidade, com estado e subagente;
  - o próximo passo.
- **Ao retomar** (nova sessão ou depois de compactação), relê:
  - `progresso.md`;
  - a seção deste plano da fase corrente;
  - a saída de `node tools/audit/check.mjs --resumo`.
- **Trava de encerramento:** bloqueia cada resposta até tudo passar, então o trabalho segue sem parar até o critério de pronto.

**Primeiro passo da Fase 1: gravar `auditoria/decisoes.md` com as decisões do dono (2026-10-08), no formato D.11.**

| id | questão | escolhida | efeito no plano |
|---|---|---|---|
| DCS-001 | critério de "serialização ida-e-volta idêntica" (CLAUDE.md, Integridade) | (a) o JSON salvo é igual byte a byte depois de salvar, abrir e salvar | linha INT de cada fluxo que escreve no documento; requisitos de salvar e carregar |
| DCS-002 | G7: o que pode diferir entre o DOM do canvas e o exportado | (a) mesmo DOM, menos uma lista fechada de marcas só do editor, declarada no código | medições de G7 (H.1); a falta da lista é `DEF-` |
| DCS-003 | G5, família `english`: texto em inglês aceito na interface pt-BR | (b) categorias técnicas por regra: nomes e valores CSS, unidades, código, nomes de arquivo, conteúdo do usuário | medições de G5 (H.1) |
| DCS-004 | precedência entre o `intent`/`scenarios` do manifesto e o código quando divergem | (a) o `intent` e os `scenarios` definem o esperado; a divergência é defeito | `requisitos.md` (B.6) e C9 |

**Decisões de execução, gravadas no mesmo arquivo:**
- **DCS-005:** o C7 ignora trechos de código, como a trava (J5).
- **DCS-006:** a configuração A de medição usa barras ocultas e escala 1; a B usa barras visíveis e escala 1.25 (J10).

| fase | depende de | trabalho | `check.mjs` precisa aprovar ao fim |
|---|---|---|---|
| 1 | — | `decisoes.md` (acima); criar `tools/audit/` (`check.mjs`, `lotes.mjs`, `juntar-inventario.mjs`, `juntar.mjs`, `matriz.mjs`, `esqueletos.mjs`) e `progresso.md` | `--ate-fase 1` sem pendências; a execução sem argumentos roda as dez conferências e imprime contagens sem erro de execução |
| 2 | 1 | lotes B.2 nas ondas B.3, pesquisa C, `padroes.json`, `requisitos.md`; a trava passa a mostrar 1.217 de 1.217 lidos e a pesquisa completa | `--ate-fase 2` sem pendências |
| 3 | 2 | `estado.md` por área (subagentes por lote de código); fixa a granularidade dos itens do documento | `--ate-fase 3` sem pendências |
| 4 | 2 | `entradas.md`: portas por domínio, demais entradas por área; roda junto com a 3 | `--ate-fase 4` sem pendências |
| 5 e 6 | 3, 4 | primeiro os 373 trechos de comando, depois os fluxos de porta e os das outras entradas, por área; medições no mesmo passo em que o ramo depende do navegador | `--ate-fase 5` sem pendências |
| 7 | 5 | `matriz.mjs` forma os grupos e congela a matriz; pares por item de estado (G.2) | `--ate-fase 7` sem pendências |
| 8 | 7 | correções na ordem do PROMPT: build e tipos, modelo e estado, renderização, interações, UI e estilos; impacto em cada uma | `--ate-fase 8` sem pendências; `npm run typecheck` e `npm run lint` sem erros |
| 9 | 8 | otimizações com medida antes e depois | `node tools/audit/check.mjs` sem argumentos, `npm run typecheck` e `npm run lint` sem pendências; a trava de encerramento libera |

**Verificação ao fim de cada grupo de correções (Fase 8):**
1. `npm run typecheck`;
2. `npm run lint`;
3. `node tools/audit/check.mjs`;
4. novo build e2e e reexecução das medições dos fluxos e trechos re-rastreados.

---

## J. Riscos e conflitos

### Resolvidos na trava (revisão de 2026-10-08)
**Binário, gerados e vendor fora do escopo.**
- `.claude/vistoria.config.json:34` `"**/*.xlsx",`
- `.claude/vistoria.config.json:35` `"manifest/generated/**",`
- `.claude/vistoria.config.json:36` `"src/generated/**",`
- `.claude/vistoria.config.json:37` `"**/vendor/**"`

**Leitura parcial não conta mais.** Uma parte só vale se o custo cabe no limite.
- `.claude/hooks/vistoria.mjs:214` `const limit = inteira ? cfg.limiteLeituraInteira : cfg.limiteLeituraCaracteres;`
- `.claude/hooks/vistoria.mjs:215` `return prefix[end] - prefix[a - 1] <= limit;`

**Faixa exata de cada parte:** `.claude/hooks/vistoria.mjs:456` `const b = a + lim - 1;`

**Conclusão por palavra inteira:** `.claude/hooks/vistoria.mjs:547` `const claimed = cfg.palavrasDeConclusao.filter((w) => {` com a fronteira de letra e número na linha seguinte.

### Travas que ainda exigem procedimento
**J1. Gerador.**
- **O que está no escopo:** das saídas do gerador, só `src/ui/icons.svg`, escrito por `tools/gen/generate.ts:367` `fs.writeFileSync(path.join(root, ICON_SPRITE), generateSprite(root));`
- **Efeito na trava:** conteúdo mudado volta a exigir leitura, conforme `.claude/hooks/vistoria.mjs:491` `if (ent && ent.last && ent.last !== fileInfo(f).h && !isCovered(k, f, fileInfo(f))) changed.push(f);`
- **Resolução:**
  - juntar as mensagens novas de i18n de um grupo de correções;
  - rodar `node tools/gen/generate.ts` uma vez;
  - reler o que mudou no escopo;
  - o C1 aponta qualquer SHA1 desatualizado.
- **Gerados fora do escopo:** os fluxos que passam por eles citam a linha gerada e o gerador.

**J2. `package.json` e dependências.**
- **Exigências da trava:**
  - leitura completa;
  - o caminho citado em `defeitos.md` ou `otimizacoes.md` (busca por trecho do caminho: `.claude/hooks/vistoria.mjs:365` `return (WIN ? t.toLowerCase() : t).includes(needle);`).
- **Resolução:**
  - registrar o `DEF-` com a citação da linha de `package.json` antes de editar;
  - pacote novo importado exige WebFetch com nome e versão antes da edição do arquivo que o importa.

**J3. Comandos não podem citar `.claude`.**
- **Código:** `.claude/hooks/vistoria.mjs:443` `deny('Comandos não podem acessar a pasta .claude (hooks, configuração e registro da vistoria). Ela é do dono do projeto.');`
- **Alcance:** vale também para caminhos como o diretório pessoal `~/.claude`.
- **Resolução:**
  - `check.mjs` lê a configuração pelo `fs`;
  - os arquivos de `.claude/` são lidos só com `Read`.

**J4. Trava de encerramento.**
- **Como funciona:**
  - typecheck, lint e verificador só rodam quando não há outra pendência: `.claude/hooks/vistoria.mjs:537` `if (!problems.length) {`;
  - a pausa é a variável de ambiente ou o arquivo que só o dono cria: `.claude/hooks/vistoria.mjs:509` `if (process.env.VISTORIA_PAUSA === '1' || fs.existsSync(path.join(DIR, 'PAUSA'))) return;`
- **Consequência nesta sessão de planejamento:** depois de gravar `plano-execucao.md`, a parada vai ser bloqueada (1.217 arquivos pendentes). Só interromper a sessão ou iniciar o Claude Code com `VISTORIA_PAUSA=1` encerra.
- **Na execução:** trabalho contínuo com retomada por `progresso.md` (seção I).

**J5. Palavras proibidas dentro de código.**
- **O que acontece:**
  - a trava ignora trechos de código (`.claude/hooks/vistoria.mjs:308` `const plain = stripCode(text).toLowerCase();`);
  - o código-fonte tem 7 ocorrências da palavra inteira `similar` ou `etc.`, além de identificadores como `applyToSimilar`.
- **Resolução (DCS-005):** o C7 segue a trava e confere só o texto fora de código, para permitir citar a linha literal.

**J6. Validação ao gravar só cobre `.md`.**
- **Código:** `.claude/hooks/vistoria.mjs:467` `if (rel.startsWith('auditoria/') && rel.endsWith('.md')) {`
- **Resolução:** `padroes.json` e os `.mjs` de `medicoes/` são cobertos pelo C2 e pelo C7.

**J7. Escrita concorrente.**
- **Risco:** subagentes no mesmo arquivo perdem escrita.
- **Resolução:** posse exclusiva por lote ou área e junção por script, só pelo principal (B.5).

**J8. Subagentes.**
- **Como funcionam:**
  - os ganchos valem para as ferramentas deles;
  - a leitura registra o campo `agente`: `.claude/hooks/vistoria.mjs:457` `append({ t: 'read', r: rel, h: info.h, a, b, u: !(Number(ti.offset) > 0) && !(Number(ti.limit) > 0), agente: input.agent_id || null });`;
  - não há gancho de parada de subagente, então eles terminam normalmente.
- **Resolução:** cada subagente fecha o próprio lote com o C1, o C2 e o C7.

**J9. Escala e custo (recalculados com trechos e agrupamento de escritores).**
- **Leitura:** cerca de 6,8 milhões de tokens na Fase 2, em 1.424 leituras.
- **Fluxos:**
  - de 1.013 a 1.313 rastreamentos completos, a 10 a 20 mil tokens cada: de 10 a 26 milhões;
  - 1.362 fluxos de porta curtos, a 2 a 4 mil cada: de 3 a 5,5 milhões.
- **Pares:** de 700 a 24.750 arquivos, a 5 a 15 mil tokens cada (o par de grupo de escritores lista vários estados): de 3,5 a 371 milhões.
- **Total:** de cerca de 23 a 410 milhões de tokens.
- **Maior incerteza:** a granularidade da escrita do documento, que a leitura de `src/core/store/store.ts` fixa na Fase 3.
- **Risco:** continua o maior do plano, em tempo e em custo.

### Contradições levantadas
**J10. CLAUDE.md seção 8 e PROMPT Fase 6: a quem se aplicam as barras visíveis e a escala 1.25.**
- **CLAUDE.md:** a frase admite as duas leituras.
- **PROMPT:** põe as barras e a escala no item de 1440×900.
- **Resolução (DCS-006):** seguir o PROMPT.
  - Configuração A: 1280×720, pt-BR, escala 1, barras ocultas.
  - Configuração B: 1440×900, inglês, barras visíveis, escala 1.25.

**J11. O código cita um plano que não está no repositório.**
- **Exemplo:** `.dependency-cruiser.cjs:1` `// The import graph's rules (plan phase I, item 8; docs/PRODUCT.md section 6): no module reaches itself back through`. Não existe pasta `docs/`.
- **Volume:**
  - 101 ocorrências de "plan X.n", "the plan's" ou "plan phase";
  - 394 de "AUD-n" ou "the audit's", em comentários de `src/`, `tools/` e `tests/`.
- **Pelo PROMPT:** não são fonte de requisito.

**J12. Comentário cita um script que `package.json` não define.**
- **Linha:** `vite.config.ts:99` `// npm run e2e:affected reads to choose the tests a change reaches (plan G6, R4)`
- **Origem:** observação em arquivos lidos por inteiro.
- **Classificação:** na Fase 2.

**J13. Mapa do CLAUDE.md seção 6 conferido por existência** (comportamento não lido).
- **Caminhos que existem:**
  - `src/core/store/store.ts`
  - `src/editor/store.ts`
  - `src/editor/persistence/drafts.ts`
  - `src/editor/input/pending.ts`
  - `src/editor/input/pointer/events.ts`
  - `src/editor/inspector/number-field.ts`
  - `src/core/ports/layout.ts`
  - `src/editor/workspace/narrow.ts`
  - `tests/support/screen-guard-allowed.ts`
  - `src/editor/shell/crumb-fold.ts`
  - `src/editor/canvas/placement.ts`
- **Nomes encontrados:**
  - `src/editor/store.ts:104` `export function editContextOf(state: EditorState): EditContext {`
  - `src/editor/store.ts:185` `function gestureSafe(store: EditorStore): EditorStore {`
  - `src/editor/inspector/number-field.ts:55` `function startOf<Ui>(context: HandlerContext<Ui>, property: string, value: string): string {`
  - `src/core/ports/layout.ts:25` `computed(node: NodeId, property: string): string | null;`
  - `src/editor/canvas/placement.ts:153` `export function clearedLabel(`
  - `src/core/store/store.ts:66` `export interface EditContext {`
- **Ainda não existe:** `tools/audit/check.mjs`, criado na Fase 1.

### Recursos que parecem incompletos no código levantado
Só arquivos lidos.
- **J14. Tabelas completas:**
  - todos os 373 comandos têm tratador;
  - todas as 214 features estão registradas;
  - não há recurso marcado como indisponível nas tabelas lidas.
- **J15. Comentário sem o código que ele anuncia:**
  - `src/core/import/import.ts:66` `// the entries this module published before the markup reading moved out stay published here: consumers need not change`;
  - as duas linhas seguintes são só `;` (`src/core/import/import.ts:67` `;`).
  - Arquivo lido até a linha 983; a classificação fica para a Fase 2.