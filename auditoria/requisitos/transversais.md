## REQ-3001 — Salvar o projeto
- **Onde:** `src/core/project/archive.ts:40` `export const saveProject = registerHandler('project.save', ({ state, clock }) => {`
- **Comportamento esperado:** escreve um arquivo, `project.zip`, com `project.json` dentro, o documento como o editor o guarda, formatado; o horário da gravação é só o tempo de modificação das entradas, lido da porta do relógio, de modo que o mesmo documento salvo duas vezes dá o mesmo `project.json`; nada muda no documento nem no histórico; a entrega do arquivo à pessoa passa pela porta de download.

## REQ-3002 — Abrir um projeto
- **Onde:** `src/core/project/archive.ts:63` `export const openProject = registerHandler('project.open', ({ rules, state, confirmed }, args) => {`
- **Comportamento esperado:** o `project.json` do arquivo escolhido é lido e conferido antes de qualquer coisa, de modo que um arquivo que o modelo recusa nunca pergunta nada; um projeto válido substitui um documento que tem trabalho só depois da confirmação da pessoa, e o projeto vazio na hora; a seleção e o histórico começam vazios; o autosave passa a gravar o projeto aberto. O leitor único é `readProject`, pelo qual também passa o trabalho restaurado do autosave.

## REQ-3003 — Desfazer
- **Onde:** `src/core/history/history.ts:79` `export const undoCommand = registerHandler('history.undo', () => ({ kind: 'undo' }));`
- **Comportamento esperado:** aplica os inversos da última transação e restaura a seleção de antes do comando dela; um comando que nada muda não grava entrada, então não há o que desfazer; a barra de status diz o que foi desfeito, nomeando o que o comando disse, ou `history.lastChange` quando ele nada disse; nada a desfazer é recusado com `status.undo.nothing`.

## REQ-3004 — Refazer
- **Onde:** `src/core/history/history.ts:80` `export const redoCommand = registerHandler('history.redo', () => ({ kind: 'redo' }));`
- **Comportamento esperado:** aplica de novo os patches da última transação desfeita e restaura a seleção de depois do comando dela; um comando novo depois de um desfazer esvazia a pilha de refazer; nada a refazer é recusado com `status.redo.nothing`.

## REQ-3005 — Breakpoints do projeto
- **Onde:** `src/core/document/breakpoints.ts:20` `export const breakpointsOf = (document: Tabled): readonly ProjectBreakpoint[] => document.breakpoints ?? DEFAULT_BREAKPOINTS;`
- **Comportamento esperado:** o projeto usa a própria tabela de breakpoints quando a tem, e a tabela padrão de `properties.json` quando não tem; a tabela vai da mais larga para a mais estreita, com a base em primeiro e cada largura uma vez; os estilos são guardados sob o id do breakpoint, e o validador, a cascata, o canvas, as media queries do export e as abas do editor leem todos a mesma tabela.

## REQ-3006 — Estados de estilo
- **Onde:** `src/editor/view/style-state.ts:64` `export const setStyleState = registerHandler<'view.setStyleState', EditorUi>(`
- **Comportamento esperado:** o editor edita um dos estados de `properties.json`, e o estado Base enquanto nenhum for escolhido; as escritas de estilo vão para a camada desse estado no breakpoint ativo; escolher um estado não é passo de desfazer e não grava nada no documento; um estado em que o elemento selecionado não fica é recusado, e uma seleção que passa a ter um elemento assim volta ao Base e diz por quê.

## REQ-3007 — Classes de estilo compartilhadas
- **Onde:** `src/core/design/classes.ts:21` `export const classesOf = (document: DocumentJson): readonly StyleClass[] => document.classes ?? NONE;`
- **Comportamento esperado:** uma classe é um nome que um elemento lista em `classes` e os estilos que todo elemento com aquele nome toma, guardados no documento na ordem em que foram feitos; o alvo de estilo do editor faz a escrita de estilo ir para a classe enquanto o projeto a tem e todos os elementos selecionados a listam (core/design/classes.ts `classTarget`); renomear ou apagar uma classe muda a definição e todo elemento que a nomeia numa só transação.

## REQ-3008 — Quadros-chave
- **Onde:** `src/editor/timeline/playhead.ts:86` `export function keyframeTarget(state: StoreState<EditorUi>): KeyframeTarget | null {`
- **Comportamento esperado:** enquanto o painel Timeline mostra e o cursor está sobre um quadro-chave, a escrita de estilo cai nas declarações daquele quadro em vez dos estilos do elemento; entre dois quadros-chave o inspetor volta a editar os estilos do elemento; o quadro-chave é o da animação mostrada cujo deslocamento é o percentual inteiro do cursor.

## REQ-3009 — Idiomas da interface
- **Onde:** `src/i18n/index.ts:54` `export function translate(locale: Locale, key: MessageId, params: MessageParams = {}): string {`
- **Comportamento esperado:** todo texto da interface é um `MessageId` procurado no catálogo do idioma da interface, com inglês e português do Brasil; não há texto de reserva: os dois catálogos têm as mesmas chaves e os mesmos marcadores, e uma chave sem texto lança nomeando a chave e o idioma, nunca mostrando inglês no lugar do português.
