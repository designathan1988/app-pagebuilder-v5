# Builder: as regras que o editor garante

O código cita estas regras como `CLAUDE.md, rule Gn`. Cada uma tem um único lugar que a garante. Corrija um defeito nesse lugar, e não em cada porta ou componente que o manifesta: foi o remendo por porta que fez os defeitos voltarem.

## G1. Uma edição é gravada no contexto em que foi feita
O contexto inclui os elementos, o breakpoint, o estado, a classe-alvo e o quadro-chave.
- **Onde vive:** o `dispatch` da store do núcleo aceita um `EditContext` (`src/core/store/store.ts`). O campo captura o contexto na primeira digitação, com `editContextOf` (`src/editor/store.ts`), e grava nele. O rascunho guardado leva o breakpoint (`src/editor/persistence/drafts.ts`).
- **Prova:** `tests/e2e/edicao-pendente.spec.ts` e `src/editor/input/pending.test.ts`.

## G2. Digitação não some
- **Onde vive:** o registro único `src/editor/input/pending.ts`, aplicado em dois pontos por onde tudo passa:
  - a store do editor (`gestureSafe` em `src/editor/store.ts`), em `dispatch`, `gesture`, `sequence` e `commandGroup`;
  - o início de cada toque (`src/editor/input/pointer/events.ts`).
- **Comandos do próprio campo:** são lidos do manifesto (partes, arraste do rótulo e teclas do contexto do campo) e rodam no contexto da digitação.
- **Gravar antes:** antes de um comando que muda o documento ou que vem de fora do campo.
- **Deixar como está:** o que se faz dentro do campo. O campo inclui a linha dele e as camadas ligadas por `aria-controls`: o menu de valores, as sugestões e o Esc do painel rápido, que descarta o rascunho por especificação.
- **Rede de segurança:** se um comando mover a seleção ou a camada com a digitação ainda pendente, ela é gravada na hora, onde foi digitada.
- **Regra de manutenção:** nunca acrescente "lembre de gravar o campo" num caminho novo. O registro já cobre.
- **Prova:** `edicao-pendente.spec.ts`, `font-menu-draft.spec.ts`, o cenário `closing-the-panel-cancels-what-a-field-held-unkept` e `pending.test.ts`.

## G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado
- **Onde vive:** cada porta (botão, tecla, roda, arraste) manda a intenção: o texto do campo, mesmo vazio, e a direção. O tratador do comando decide o resto. Exemplo: `startOf` em `src/editor/inspector/number-field.ts`, com `Layout.computed` (`src/core/ports/layout.ts`).
- **Prova:** `tests/e2e/portas-equivalentes.spec.ts`.

## G4. O resultado de uma ação fica visível
Nada do editor fica sobre o canvas onde a ação acontece. A barra lateral ocupa a própria coluna em qualquer janela. Numa janela estreita, a primeira visita abre com ela fechada (`src/editor/workspace/narrow.ts`).
- **Prova:** `tests/e2e/espaco.spec.ts` e `narrow-window.spec.ts`.

## G5. Painéis e barras cabem; nenhum controle fica fora de alcance
- Medir fora de vista é feito numa caixa de tamanho zero que recorta (`overflow: hidden; contain: strict`), porque uma caixa invisível ainda alarga a rolagem (CSS Overflow 3 §2.2).
- Um item que cresce declara como encolhe (`min-width: 0`), e o conteúdo se adapta: a trilha da barra de status recolhe os níveis do meio (`src/editor/shell/crumb-fold.ts`).
- Medir contra o espaço do próprio elemento, nunca contra uma trilha escolhida por posição.
- **Guarda:** `tests/support/screen-guard.ts` roda no fim de todo teste e acusa as famílias `cut`, `wrapped`, `off-window`, `covered`, `english` e `sideways`. Exceção só em `screen-guard-allowed.ts`, com o motivo.
- **Prova:** `espaco.spec.ts`, a 1280×720 em pt-BR e a 1440×900 em inglês, com documento profundo e nomes longos.

## G6. Todas as vistas mostram a mesma seleção
A store é a fonte única. `espaco.spec.ts` compara store, canvas e Camadas.

## G7. O canvas é o documento
O render incremental é igual a um render do zero. `espaco.spec.ts` recarrega e compara.

## Decisões do dono que valem como regra
- **D-1:** as abas de breakpoint ficam coladas no topo da moldura.
- **DEC-70:** o rótulo da seleção fica sempre acima do elemento, encostado na moldura, e o chip do painel rápido fica à direita dele. Única exceção, escolhida pelo dono em 2026-10-07: onde esse lugar cai sobre as abas de breakpoint (um elemento no topo da página), rótulo e chip seguem pela linha de cima da moldura só até passar a última aba, enquanto couberem sobre o elemento; num elemento estreito sob as abas, ficam logo abaixo dele (`clearedLabel` em `src/editor/canvas/placement.ts`). Descer para dentro do elemento cobria a alça de raio e punha o chip sob a alça leste; ficar sempre embaixo tirava de vista o rótulo de um elemento alto.
- Mudar qualquer uma delas é decisão do dono.

## Como verificar
- **Estático:** `npm run typecheck` e `npm run lint` (o lint inclui o CSS).
- **Unitários:** `node node_modules/vitest/vitest.mjs run --maxWorkers=2 <pastas>`.
- **Navegador:**
  - no máximo 4 workers, com prioridade baixa (`Start-Process` e `PriorityClass = 'BelowNormal'`);
  - nunca duas execuções de Playwright ao mesmo tempo, porque cada uma reconstrói `dist/`;
  - a suíte completa leva uns 18 minutos.
- **Barras de rolagem:** o Chrome do Playwright as esconde, e a janela do Windows as mostra (~15 px por painel). Para varrer a interface como a pessoa a vê, rode com `E2E_SCROLLBARS=shown`; `E2E_SCALE=1.25` dá a escala de tela de 125% comum nos notebooks com Windows. Nesse modo, leia os achados do guarda de tela. As diferenças de documento, as capturas e as larguras dos cenários foram calibradas sem barras e diferem por desenho: a página Desktop deixa a largura da barra livre (A3.22).
- **Antes de dizer que funciona:** use o app como a pessoa usa, no laboratório abaixo, a 1280×720 em pt-BR e a 1440×900 em inglês, com entradas variadas.

## Laboratório: uso real sem tocar no projeto
- **Servidor:** `python -m http.server 5399 --bind 127.0.0.1 --directory dist`. O `dist` é o build e2e, com `window.__builderTestPort` só para leitura.
- **Roteiro:** Playwright headless pela entrada padrão (`$script | node --input-type=module -`), com `chromium.launch({ channel: 'chrome', headless: true })`.
- **Boot de teste:** responder `**/__builderTestBoot.json` com `{ project, commands, drawn }` e abrir `/?test-boot`.
- **Ponto no canvas:** posição do iframe mais a posição do nó vezes `iframe.currentCSSZoom`.
- **Painel de navegador do app:** oculto, ele para de desenhar quadros. Use o headless.

## Armadilhas
- **Finais de linha:** convivem arquivos CRLF e LF. Ao editar por script, preserve o final de linha de cada arquivo.
- **Ids do manifesto:** nunca se escrevem à mão no código (`builder/no-manifest-id`). Leia do manifesto.
- **Mensagem nova:** entra em `src/i18n/locales/en.json` e `pt-BR.json`; depois rode `node tools/gen/generate.ts`.
- **Segundo editor:** nunca abra um segundo editor na mesma página de teste. O perfil já guarda o que o primeiro salvou, e a verificação de perfil limpo falha conforme o tempo do autosave.
