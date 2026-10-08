# Decisões

## DCS-001 — critério de "serialização ida-e-volta idêntica"
- **Origem:** dono (2026-10-08)
- **Opções:** (a) o JSON salvo é igual byte a byte depois de salvar, abrir e salvar; (b) a comparação é por igualdade estrutural, ignorando a ordem das chaves e a formatação.
- **Escolhida:** (a)
- **Efeito no plano:** a linha INT de cada fluxo que escreve no documento; os requisitos de salvar e carregar.
- **Requisitos afetados:** os requisitos de salvar e de carregar, montados na Fase 2.

## DCS-002 — G7: o que pode diferir entre o DOM do canvas e o exportado
- **Origem:** dono (2026-10-08)
- **Opções:** (a) mesmo DOM, menos uma lista fechada de marcas só do editor, declarada no código; (b) igualdade exata entre o DOM do canvas e o exportado.
- **Escolhida:** (a)
- **Efeito no plano:** as medições de G7; a ausência da lista fechada no código vira defeito.
- **Requisitos afetados:** os requisitos de exportar a página e de renderizar o canvas.

## DCS-003 — G5, família `english`: texto em inglês aceito na interface pt-BR
- **Origem:** dono (2026-10-08)
- **Opções:** (a) só os textos do catálogo de mensagens são conferidos; (b) as categorias técnicas são aceitas por regra: nomes e valores CSS, unidades, código, nomes de arquivo e conteúdo do usuário.
- **Escolhida:** (b)
- **Efeito no plano:** as medições de G5 nas duas configurações de tela.

## DCS-004 — precedência entre o intent e os scenarios do manifesto e o código
- **Origem:** dono (2026-10-08)
- **Opções:** (a) o intent e os scenarios definem o comportamento esperado, e a divergência do código é defeito; (b) o código define o comportamento esperado, e o manifesto se ajusta a ele.
- **Escolhida:** (a)
- **Efeito no plano:** a montagem de requisitos.md e a conferência C9.
- **Requisitos afetados:** todos os requisitos derivados de features do manifesto.

## DCS-005 — palavras proibidas dentro de trechos de código
- **Origem:** execução (regra 3 do PROMPT)
- **Opções:** (a) a conferência de linguagem ignora os trechos de código, como a trava; (b) a conferência reprova qualquer ocorrência, inclusive dentro de código.
- **Escolhida:** (a)
- **Comportamento atual:** `.claude/hooks/vistoria.mjs:308` `const plain = stripCode(text).toLowerCase();`
- **Efeito no plano:** a conferência C7 do verificador.

## DCS-007 — a linha 235 da fixture canônica não cabia numa leitura (resolvida pelo dono)
- **Origem:** execução (regra 3 do PROMPT)
- **Opções:** (a) ler a linha em partes menores, o que o Read não permitia porque o limite é por resposta; (b) tratar a ocorrência como lida fora do Read, o que a trava não registra; (c) pedir ao dono que excluísse as fixtures do escopo da trava (`.claude/vistoria.config.json`, a lista `ignorar`) ou elevasse o limite de tokens do Read.
- **Escolhida:** (c) — as opções (a) e (b) não existiam dentro das travas.
- **Comportamento atual:** `manifest/features/fixtures/canonical.json:2` `"version": 4,` — o arquivo tem 113.447 bytes em 1.523 linhas, e a linha 235 sozinha tem 57.249 caracteres. O plano (`auditoria/plano-execucao.md`, A.2 letra c) contava que essa linha caberia numa parte só pela regra da trava, que mede 60.000 caracteres de custo. O Read do aplicativo mede tokens e recusou a mesma linha com "File content (39727 tokens) exceeds maximum allowed tokens (25000)". Uma leitura de `offset=236` com `limit=3` era aceita, então o limite era da faixa pedida; a única faixa que cobria a linha 235 era a própria linha 235.
- **Efeito no plano:** o registro da trava em `.claude/vistoria/registro.jsonl` cobria 1 a 234, 236 a 1.285 e 1.286 a 1.523, com um buraco na linha 235. Enquanto o buraco durou, a trava de encerramento acusava "1 de 1225 arquivos não lidos por inteiro" e bloqueava todo encerramento, e a trava de edição bloqueava qualquer edição em código da aplicação. Era uma contradição entre a regra da trava (60.000 caracteres) e o limite do Read (25.000 tokens): nenhuma leitura, por parte de agente algum, fechava a linha.
- **Resolução (dono, 2026-10-08):** `manifest/features/fixtures/**` e `deepseek.ps1` saíram da lista `ignorar` do escopo em `.claude/vistoria.config.json`, e a leitura sem offset/limit passou a contar só para arquivo de até 34.000 caracteres, com o arquivo maior lido em partes de até 60.000 caracteres. O escopo caiu de 1.225 para 1.163 arquivos, e os arquivos grandes que já estavam lidos por uma leitura inteira voltaram a exigir leitura em partes.
- **Requisitos afetados:** nenhum.

## DCS-006 — barras de rolagem e escala das duas configurações de medição
- **Origem:** execução (regra 3 do PROMPT)
- **Opções:** (a) as duas configurações usam barras ocultas e escala 1; (b) a configuração de 1440×900 usa barras visíveis e escala 1.25.
- **Escolhida:** (b)
- **Comportamento atual:** `PROMPT.md:166` `- 1440×900 em inglês, com barras de rolagem visíveis e escala 1.25.`
- **Efeito no plano:** a seção de medições no navegador (Fase 6).

## DCS-008 — as partes do estado da store do núcleo e a marca de cada parte (Fase 7)
- **Origem:** dono (2026-10-08), ao re-escopar a Fase 7.
- **Opções:** (a) manter o `state` da store do núcleo como um item único e rastrear os 77.715 pares que a matriz conta; (b) partir o `state` nas partes que `src/core/store/store.ts` mantém e re-marcar cada fluxo com a parte e a função da linha citada.
- **Escolhida:** (b).
- **Por quê:** o item único dava 181 grupos de escritores × 425 de leitores, porque a escrita de qualquer parte do estado contava como escrita do mesmo item; o plano (`auditoria/plano-execucao.md`, G.1) esperava de 1 a 24 grupos de escritores e de 10 a 25 de leitores por item do documento.
- **As oito partes, uma por campo de `StoreState`:**
  - `EST-L01-030` o documento — `src/core/store/store.ts:28` `readonly document: DocumentJson;`
  - `EST-L01-031` a seleção — `src/core/store/store.ts:29` `readonly selection: Selection;`
  - `EST-L01-032` o histórico — `src/core/store/store.ts:30` `readonly history: HistoryState;`
  - `EST-L01-033` a mensagem da barra de status — `src/core/store/store.ts:32` `readonly message: Message | null;`
  - `EST-L01-034` a confirmação pendente — `src/core/store/store.ts:35` `readonly confirmation?: PendingConfirmation | null;`
  - `EST-L01-035` a recusa do último comando — `src/core/store/store.ts:38` `readonly refusal?: Refusal | null;`
  - `EST-L01-036` o sinal de recusa — `src/core/store/store.ts:42` `readonly refused?: boolean;`
  - `EST-L01-037` o estado do editor — `src/core/store/store.ts:43` `readonly ui: Ui;`
- **Regra da marca:** a marca `[lê: EST-x via F]` ou `[escreve: EST-x via F]` nomeia a parte do estado e a função F que, na linha citada, lê ou escreve aquela parte. Quem escreve o `state` é a própria store (`run`, `commit`, `publish`); o tratador do comando nunca é nomeado, porque ele devolve remendos e um resultado, e não escreve o estado.
- **Efeito no plano:** a matriz da Fase 7 e os pares; a conferência C4 passa a exigir um item por parte.

## DCS-009 — D-A: o desfazer e o refazer devolvem o contexto de edição
- **Origem:** dono (2026-10-08), opção 1 do relatório da investigação (`auditoria/investigacao/relatorio.md`, seção 5, D-A).
- **Opções:** (1) desfazer e refazer devolvem o breakpoint, o estado, a classe e o quadro-chave em que a mudança foi feita; (2) manter o contexto atual; (3) manter o contexto atual e avisar na barra de status.
- **Escolhida:** (1).
- **Comportamento atual:** `src/core/history/transaction.ts:21` `readonly selectionBefore: Selection;` — a transação guarda a seleção e não guarda o contexto de edição.
- **Efeito no plano:** a transação ganha o contexto de edição; o desfazer e o refazer devolvem o `ui` desse contexto (Fase 8, defeito aberto para isso); o modelo do histórico confere o contexto devolvido.

## DCS-010 — D-B: o histórico não sobrevive a recarregar a página
- **Origem:** dono (2026-10-08), opção 1.
- **Opções:** (1) não, como hoje; (2) sim, gravado pelo autosave.
- **Escolhida:** (1).
- **Comportamento atual:** `src/editor/persistence/autosave.ts:11` `the history starts empty`
- **Efeito no plano:** nenhum código muda; o contexto gravado na transação (DCS-009) não entra no formato salvo.

## DCS-011 — D-C: nenhuma dependência nova
- **Origem:** dono (2026-10-08), opção 1.
- **Opções:** (1) catálogo de mutantes, leitor de fonte e contagem de ouvintes próprios; (2) StrykerJS 10; (3) memlab.
- **Escolhida:** (1).
- **Efeito no plano:** `tools/runner/mutants.ts` troca trechos na carga do módulo (plugin do Vite próprio); `tools/ui-fit/font.ts` lê TrueType sem pacote; a contagem de ouvintes é de `src/editor/input/scope.ts`.

## DCS-012 — D-D: fonte da interface empacotada com o app
- **Origem:** dono (2026-10-08), opção 2, com fonte de licença livre (SIL Open Font License) escolhida pela proximidade com a aparência atual.
- **Opções:** (1) a fonte do sistema; (2) empacotar uma fonte OFL.
- **Escolhida:** (2), com **Source Sans 3** (Adobe), pesos Regular (400) e Semibold (600), arquivos TTF da pasta `TTF/` do ramo `release` de `github.com/adobe-fonts/source-sans`.
- **Licença:** SIL Open Font License 1.1, "Copyright 2010-2024 Adobe", nome reservado "Source"; o texto da licença vai junto dos arquivos no app (`src/ui/fonts/OFL.txt`), como a licença exige.
- **Comportamento atual:** `src/ui/tokens.css:4` `--font-ui: "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif;`
- **Por quê, medido nesta máquina** (6.229 textos de `pt-BR.json` e `en.json`, 12 px, largura com GPOS `kern`, razão contra a Segoe UI de `C:/Windows/Fonts`):
  - Source Sans 3: altura-x 0,486 em (Segoe UI 0,500); razão mediana 0,945 no peso 400 e 0,943 no 600; desvio mediano 5,5% e 5,7%;
  - Open Sans: altura-x 0,535; razão mediana 1,061 e 1,067; desvio 6,1% e 6,7%;
  - Noto Sans: altura-x 0,536; razão mediana 1,069 e 1,077; desvio 6,9% e 7,7%.
  A Source Sans 3 tem a altura-x e as larguras mais próximas, e é a única mais estreita que a Segoe UI: nenhum texto que hoje cabe passa a não caber.
- **Fora da escolha:** a Selawik (Microsoft, OFL 1.1, substituta declarada da Segoe UI) só é publicada como fonte-código UFO e Glyphs, sem arquivo TTF ou WOFF no repositório nem em versões publicadas; compilá-la exigiria uma ferramenta nova (fontmake), o que DCS-011 exclui.
- **Efeito no plano:** etapa 4 — `@font-face` em `src/ui/`, `--font-ui` passa a nomear a fonte empacotada, e a medição de texto sem navegador lê os mesmos arquivos em toda máquina.

## DCS-013 — D-E: um segundo toque com o gesto aberto
- **Origem:** dono (2026-10-08), opção 2.
- **Opções:** (1) ignorar; (2) cancelar o gesto aberto e começar o novo; (3) confirmar o gesto aberto e começar o novo.
- **Escolhida:** (2).
- **Comportamento atual:** `src/editor/input/pointer/machine.ts:90` `if (event.type === 'down' || event.pointer !== machine.pointer) return { machine, effect: null };`
- **Efeito no plano:** a máquina de gestos devolve o cancelamento do gesto aberto e começa o novo; defeito aberto na Fase 8.

## DCS-014 — os detectores da investigação são criados e rodados
- **Origem:** dono (2026-10-08), instrução da execução final (etapas 1 a 5).
- **Opções:** (a) seguir `CLAUDE.md` seção 3, "Sem testes", e não criar os detectores; (b) criar e rodar os detectores que o dono pediu (modelos sobre a store, catálogo de mutantes, contratos de campo, varreduras), sem rodar a suíte de testes inteira.
- **Escolhida:** (b) — a instrução do dono nomeia cada detector e cada caminho; a suíte completa (`npm test`) continua sem ser rodada.
- **Efeito no plano:** os detectores ficam em `tools/runner/model/`, `tools/runner/mutants.ts`, `tools/runner/field-contracts.test.ts`, `tools/inventory/`, `tools/ui-fit/` e `tools/map/`, registrados em `auditoria/mecanismos.md`.

## DCS-015 — codecs de vários valores guardam o número como digitado (achado C5 da investigação)
- **Origem:** execução (regra 3 do PROMPT; instrução do dono: rastrear e decidir entre defeito e regra registrada).
- **Opções:** (a) defeito: todo codec arredonda o número a quatro casas pelo `writeNumber`; (b) regra: o codec que lê um número (comprimento, porcentagem, par de eixos, número, alfa, proporção) escreve pelo `writeNumber`, e o codec cuja gramática o navegador confere guarda o texto como a pessoa digitou.
- **Escolhida:** (b) — preserva o comportamento que o código oferece e declara.
- **Comportamento atual:** `src/core/style/codecs.ts:638` `// A value whose grammar is the browser's to check (a cursor, a transition, a filter, a clip path, grid lines and` — `translate`, `rotate`, `scale`, `font-stretch` e `track-list` leem por `cssText` (`src/core/style/codecs.ts:852` `const translate = registerCodec('translate', { read: cssText, write: writeCssText });`), e `object-position`, `transform-origin` e `perspective-origin`, propriedades com posição própria, também (`src/core/style/codecs.ts:424` `if (facts.axes === undefined) return cssText(text, facts);`). Nenhuma conta passa por esses textos: o passo de campo só move um comprimento e recusa o resto (`src/editor/inspector/number-field.ts:73` `if (read === null || read.value.kind !== 'length') return { kind: 'refused', message: message('status.value.notSteppable', { property: propertyName(property, context.rules), value: value.trim() }) };`), então o texto guardado é o que a pessoa escreveu, sem ruído de ponto flutuante.
- **Efeito no plano:** o contrato de campo (MEC-05) confere a preservação do número com quatro casas só nos valores que o codec lê como comprimento; nos de texto conferido pelo navegador, confere que o texto guardado é o digitado, sem espaços nas pontas.

## DCS-016 — D-A e o quadro-chave: o que o desfazer devolve quando a mudança não foi feita num quadro-chave
- **Origem:** execução (regra 3 do PROMPT), ao aplicar a DCS-009.
- **Opções:** (a) uma mudança feita fora de quadro-chave fecha a Timeline ou tira o playhead do quadro-chave ao ser desfeita ou refeita; (b) desfazer e refazer devolvem o quadro-chave só quando a mudança foi feita num; a mudança feita fora deixa a Timeline como a pessoa a tem.
- **Escolhida:** (b) — preserva o comportamento que o editor já oferece: o quadro-chave é derivado de onde o playhead está com a Timeline aberta (`src/editor/timeline/playhead.ts:75` `if (!isPanelOpen(state.ui, TIMELINE_PANEL)) return null;`), e nenhum comando fecha o painel nem move o playhead por conta própria.
- **Comportamento atual:** `src/editor/timeline/playhead.ts:86` `export function keyframeTarget(state: StoreState<EditorUi>): KeyframeTarget | null {`
- **Efeito no plano:** o modelo do histórico (MEC-01) confere a camada e a classe sempre, e o quadro-chave quando a mudança foi feita num; a correção do DEF-0511 abre a Timeline no quadro-chave da mudança.

## DCS-017 — o cancelamento de gesto e de grupo não devolve o `ui` (achado C7 da investigação)
- **Origem:** execução (regra 3 do PROMPT), ao rastrear o achado; o relatório admite "devolve também o `ui` de antes, ou a regra registra por que não devolve".
- **Opções:** (a) o cancelamento devolve o `ui` de antes do gesto ou do grupo; (b) devolve o documento, a seleção, o histórico (e, no grupo, a confirmação), e o `ui` fica.
- **Escolhida:** (b) — preserva o comportamento do código e o que o manifesto descreve.
- **Comportamento atual:** `src/core/store/store.ts:750` `if (state !== before) publish(commit({ ...state, document: before.document, selection: before.selection, history: before.history }, 'a cancelled gesture'), current.inverses);`
- **Por quê:**
  - o `ui` guarda a contabilidade do próprio gesto: o Esc de um arraste (`drag.cancel`) conta o cancelamento no `ui` (`src/editor/drag/drag-session.ts:126` `ui: { ...state.ui, drag: { ...state.ui.drag, cancels: state.ui.drag.cancels + 1 } },`), e o dono do ponteiro compara essa contagem com a da abertura para saber que o gesto foi cancelado (`src/editor/input/pointer/effects.ts:43` `ps.cancelsAtOpen = store.getState().ui.drag.cancels;`); devolver o `ui` de antes apagaria o próprio sinal do cancelamento;
  - o que no `ui` depende da seleção volta com ela: a publicação do cancelamento passa pelo `followSelection` (`src/core/store/store.ts:314` `const next = follow ? followSelection(before, committed) : committed;`), que abre a página do nó, desdobra Camadas e acerta o estado de estilo da seleção devolvida;
  - os oito cenários de cancelamento do manifesto (`drag.cancel`: `drag-level-keys-escape`, `palette-drag-insert`, `layers-drag`, `inspector-number-fields`, `color-picker`, `gradient-editor`, `shadow-editor`, `resize-handles`) esperam o documento, a seleção e o histórico de antes, e nenhum espera outro `ui` (DCS-004).
- **Efeito no plano:** o achado C7 "cancelamento de gesto e de grupo sem devolver o ui" fica resolvido por esta regra, sem `DEF-`; o modelo (MEC-01) continua conferindo documento e seleção devolvidos (M11 no catálogo).

## DCS-018 — o `postMessage` da pré-visualização com destino `'*'` não expõe dado (achado C8 da investigação)
- **Origem:** execução; instrução do dono: conferir se o envio expõe dado e corrigir se expuser.
- **Opções:** (a) trocar o destino `'*'` pela origem do editor; (b) manter: o envio não leva dado da pessoa nem do documento.
- **Escolhida:** (b) — o envio não expõe dado.
- **Comportamento atual:** `src/editor/shell/preview.tsx:64` `parent.postMessage({ builderPreviewKey: { key: e.key, code: e.code, ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey, altKey: e.altKey } }, '*');`
- **Rastreio:**
  - o que vai na mensagem é só a tecla e os modificadores, e só para Esc e Ctrl ou Cmd com Enter (`src/editor/shell/preview.tsx:62` `var leave = e.key === 'Escape' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey));`); nada do documento, do projeto, do armazenamento nem do que a pessoa digitou na página;
  - o destino é o `parent` da moldura, que é a janela do editor que desenha a moldura (`src/editor/shell/preview.tsx:53` `<iframe ref={frame} className="preview__page" data-region="preview-page" title={t('preview.pageLabel')} srcDoc={html} sandbox="allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox" style={{ width }} />`); a moldura sai da página quando o editor sai, então nenhuma outra origem fica no lugar do `parent`;
  - a moldura roda sem `allow-same-origin`, com a origem opaca `null`, e o editor confere a janela que enviou, nunca a origem (`src/editor/shell/preview.tsx:42` `if (event.source === null || event.source !== frame.current?.contentWindow) return;`), e lê só os dois campos de tecla (`src/editor/shell/preview.tsx:70` `if (key !== 'Escape' && key !== 'Enter') return null;`).
- **Efeito no plano:** o achado C8 fica resolvido por este rastreio, sem `DEF-`; a regra de lint "todo ouvinte de `message` confere `event.source`" do catálogo C8 entra na etapa 5.
