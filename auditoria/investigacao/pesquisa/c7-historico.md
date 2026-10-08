# C7 — Undo e redo precisos: pesquisa

Data de acesso de todas as fontes: 2026-10-08.
Convenção: a seção "Fatos documentados" traz apenas o que a fonte aberta afirma. A seção "Avaliação" traz o julgamento do pesquisador e vem marcada como avaliação.
Observação de método: o WebFetch devolve resumos de páginas feitos por um modelo auxiliar. Onde o resumo declarou lacuna (versão ausente, trecho não coberto), a lacuna consta nesta nota.

## 1. Fontes abertas e o que cada uma sustenta

### 1.1 prosemirror-history (ProseMirror)
- URL do código: https://github.com/ProseMirror/prosemirror-history/blob/master/src/history.ts (branch master; a página informa que o repositório foi arquivado em 2026-04-01 e movido para https://code.haverbeke.berlin/prosemirror/prosemirror-history).
- URL da referência: https://prosemirror.net/docs/ref/ (seção prosemirror-history, aberta com offset 200000).
- Versão: o registro npm informa 1.5.1 como a mais recente em 2026-10-08. As páginas não declaram versão.
- Fatos documentados:
  - Assinatura: history(config = {}) devolve um Plugin. Opções: depth (padrão 100, quantidade de eventos guardados) e newGroupDelay (padrão 500 ms; mudanças não adjacentes sempre abrem novo grupo).
  - Comandos: undo, redo, undoNoScroll, redoNoScroll. Consultas: undoDepth(state), redoDepth(state), isHistoryTransaction(tr).
  - closeHistory(tr) marca a transação para que os próximos passos não sejam anexados ao evento existente. No código ele grava a meta closeHistoryKey, e applyTransaction recria o estado com prevTime 0 e prevComposition -1.
  - Meta addToHistory igual a false impede que a transação seja desfeita. No código, essa transação só alimenta addMaps, que preserva os mapas de posição sem criar passos desfazíveis.
  - Cada pilha (done e undone) é um Branch com items (RopeSequence de Item) e eventCount. Cada Item guarda map (StepMap direto), step (o passo invertido, calculado com steps[i].invert(docs[i])), selection (bookmark) e mirrorOffset.
  - Seleção: state.selection.getBookmark() é gravado apenas quando começa um grupo novo. O bookmark é resolvido somente ao desfazer, em histTransaction, com pop.selection.resolve(pop.transform.doc). Passos seguintes do mesmo grupo não levam bookmark; Item.merge funde itens consecutivos quando o segundo não tem selection.
  - Regra de grupo novo: prevTime igual a 0, ou (sem transação anexada, composição diferente e (intervalo maior que newGroupDelay ou mudança não adjacente)). A adjacência vem de isAdjacentTo(transform, prevRanges), que compara intervalos alterados com rangesFor e mapRanges.
  - Transações anexadas (appendedTransaction) entram no grupo corrente sem novo bookmark.
  - mustPreserveItems(state) consulta a propriedade historyPreserveItems das specs dos plugins; com ela, os itens não se fundem e popEvent remapeia passos. Isso serve à colaboração com rebase.
  - Branch.rebased recalcula os passos invertidos via mapping.getMirror quando a transação tem a meta rebased. Quando emptyItemCount passa de max_empty_items (500), compress(upto) remove itens que carregam só mapa.
  - Aplicar um evento (histTransaction) o move para a outra pilha, com a meta historyKey contendo redo e historyState.
  - O campo de estado do plugin define apenas init e apply. Não define toJSON nem fromJSON. O init cria HistoryState com Branch.empty nas duas pilhas, prevRanges nulo, prevTime 0 e prevComposition -1.
- Fonte complementar: https://prosemirror.net/docs/ref/#state.EditorState.toJSON afirma que toJSON recebe um objeto que mapeia nomes de propriedade a plugins para serializar o estado dos plugins, e que StateField.toJSON é opcional (sem ele, o campo não é serializado). Combinada com a leitura do código do plugin de histórico (sem toJSON), o histórico do ProseMirror não entra na serialização do estado.
- O README do repositório (https://raw.githubusercontent.com/ProseMirror/prosemirror-history/master/README.md) só descreve o módulo como plugin de undo e redo e remete à referência.

### 1.2 Lexical, pacote @lexical/history
- URLs: https://lexical.dev/docs/concepts/history ; https://raw.githubusercontent.com/facebook/lexical/main/packages/lexical-history/src/index.ts ; https://raw.githubusercontent.com/facebook/lexical/main/packages/lexical/src/LexicalUpdateTags.ts ; https://lexical.dev/docs/concepts/transforms .
- Versão: o registro npm informa @lexical/history 0.52.0 como a mais recente em 2026-10-08. As páginas não declaram versão.
- Fatos documentados:
  - Formas de uso: registerHistory, HistoryExtension e o componente React HistoryPlugin (de @lexical/react/LexicalHistoryPlugin).
  - Janela de mesclagem delay: padrão 300 ms em HistoryConfig. A página de conceito sugere 500 a 1000 ms para textos longos. O código tem assinatura registerHistory(editor, historyState, delay, dateNow = Date.now, onHistoryStateChange?, maxDepth = null) e devolve a função que remove os listeners. dateNow é injetável, o que torna o relógio controlável em testes.
  - Resultados de mesclagem: HISTORY_MERGE (0), HISTORY_PUSH (1), DISCARD_HISTORY_CANDIDATE (2). Tipos de mudança: OTHER, COMPOSING_CHARACTER, INSERT_CHARACTER_AFTER_SELECTION, DELETE_CHARACTER_BEFORE_SELECTION, DELETE_CHARACTER_AFTER_SELECTION.
  - Ordem de decisão em getMergeAction (criada por createMergeActionGetter): (1) tag de merge presente, sem tag de push e mesmo editor: MERGE; (2) caractere em composição: DISCARD; (3) sem estado anterior: PUSH; (4) sem nós sujos: MERGE se há seleção, DISCARD se não há; (5) MERGE se não há tag de push, o tipo não é OTHER, o tipo é igual ao anterior, o intervalo é menor que delay e o editor é o mesmo; (6) exatamente um nó folha sujo cujo texto não mudou: MERGE; (7) senão PUSH.
  - Colar e recortar são sempre classificados como OTHER e abrem limite próprio de undo. Atualizações com HISTORIC_TAG (undo e redo) são descartadas e zeram o tipo anterior.
  - Tags exportadas (valor string): HISTORIC_TAG 'historic'; HISTORY_PUSH_TAG 'history-push' (adiciona nova entrada); HISTORY_MERGE_TAG 'history-merge' (mescla com a entrada anterior); PASTE_TAG 'paste'; CUT_TAG 'cut'; COLLABORATION_TAG 'collaboration'; SKIP_COLLAB_TAG 'skip-collab'; SKIP_SCROLL_INTO_VIEW_TAG; SKIP_DOM_SELECTION_TAG; SKIP_SELECTION_FOCUS_TAG; FOCUS_TAG; COMPOSITION_START_TAG; COMPOSITION_END_TAG. O tipo UpdateTag aceita qualquer outra string.
  - createEmptyHistoryState devolve {current: null, redoStack: [], undoStack: []}. Cada entrada é {editor, editorState} com referência ao EditorState completo. Em PUSH, current vai para undoStack; em MERGE só current é substituído.
  - A página de conceito afirma que os snapshots compartilham um NodeMap com cópia sob escrita, de modo que o custo marginal por entrada é pequeno e não nulo.
  - maxDepth padrão null (pilha ilimitada). Com valor finito, as entradas mais antigas saem em ordem FIFO quando um PUSH excede o limite. Reduzir maxDepth em tempo de execução não corta a pilha existente.
  - A pilha de redo é esvaziada em PUSH (quando não está vazia) e pelos comandos CLEAR_EDITOR_COMMAND e CLEAR_HISTORY_COMMAND. MERGE e atualizações históricas não a esvaziam.
  - O código de undo e redo não tem lógica própria de seleção: chama setEditorState com a tag HISTORIC_TAG sobre o EditorState guardado. Que a seleção volta junto porque o EditorState contém _selection é inferência do resumo sobre o código.
  - A página de transforms registra que cada ciclo de transform cria um novo EditorState e que isso pode interferir em undo e redo se não for tratado.

### 1.3 tldraw
- URLs: https://tldraw.dev/sdk-features/history (editada em 2025-12-20) ; https://tldraw.dev/docs/editor ; https://tldraw.dev/sdk-features/instance-state (atualizada em 2026-01-31) ; https://tldraw.dev/sdk-features/store ; https://tldraw.dev/reference/editor/Editor ; https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/editor/managers/HistoryManager/HistoryManager.ts .
- Versão: a referência do Editor aponta o código da v5.5.1; o registro npm informa tldraw 5.5.2 como a mais recente em 2026-10-08. As demais páginas não declaram versão.
- Fatos documentados:
  - Duas pilhas (undo e redo). Cada entrada é um diff de registros ou uma marca de parada. Mudanças da store viram diff pendente e só vão para a pilha de undo quando se cria uma marca.
  - editor.markHistoryStoppingPoint(nome) cria a marca; o nome só aparece no id, para depuração. Criar marca não limpa o redo; quem limpa é a próxima mudança gravada. A página manda criar uma marca no início de cada interação contínua.
  - editor.run(fn, { history }) aceita três modos. record: grava em undo e limpa redo. record-preserveRedoStack: grava em undo e mantém redo. ignore: não grava e mantém redo. Chamadas aninhadas herdam o modo externo, salvo declaração própria. Nenhum modo vale durante undo ou redo. O agrupamento de run vira um único passo de undo.
  - bail() e bailToMark(id) voltam à marca e descartam as mudanças sem ir para redo. A referência descreve bailToMark como "Undo to the given mark, discarding the changes so they cannot be redone" e mostra o uso típico: guardar a marca no início de um arraste e voltar a ela para cancelar.
  - squashToMark(id) funde tudo desde a marca em um único passo de undo, remove marcas intermediárias e não altera o estado atual. Se a marca não está na pilha, registra erro e não faz nada.
  - clearHistory() zera as duas pilhas. canUndo() e canRedo() são reativos.
  - No código do HistoryManager: pilhas imutáveis (StackItem), entradas {type: 'diff', diff} e {type: 'stop', id}. Três estados do gravador: recording, recordingPreserveRedoStack e paused. O interceptor da store captura só mudanças com source igual a 'user' e, no estado recording, substitui redos por pilha vazia.
  - PendingDiff acumula com squashRecordDiffsMutable. _undo calcula reverseRecordsDiff do diff pendente, soma os diffs revertidos das entradas até a marca e aplica o resultado com store.applyDiff(..., { ignoreEphemeralKeys: true }). Se toMark não existe, restaura o pendingDiff e não aplica nada. redo faz flushPendingDiff, soma os diffs seguintes até a próxima marca e aplica. squashToMark percorre os diffs até a marca, junta em ordem cronológica e empilha o resultado sobre a marca.
  - Store: escopos document (persistido e sincronizado), session (persistência opcional, não sincronizado, por exemplo página atual e posição da câmera) e presence (não persistido, sincronizado). listen entrega changes com added, updated (pares antes e depois) e removed, e filtra por source ('user' ou 'remote') e scope. Os ouvintes são notificados uma vez por quadro de animação, com mudanças adjacentes da mesma origem unidas.
  - Apenas registros da store participam de undo e redo; estado fora da store (átomos próprios) fica de fora.
  - Instance state (por aba, não sincronizado): updateInstanceState não entra no undo por padrão; para registrar, passa-se { history: 'record' }. A seleção (selectedShapeIds, editingShapeId, hoveredShapeId) fica no page state, por página; com persistenceKey a seleção e a câmera de cada página são salvas e restauradas pelo mecanismo de persistência do estado, não pelo histórico.
  - A documentação lida não detalha limites de tamanho das pilhas.
- Lacuna: as páginas lidas não descrevem a assinatura de RecordsDiff nem o texto de reverseRecordsDiff e squashRecordDiffs; os nomes e o uso constam do código do HistoryManager (reverseRecordsDiff, squashRecordDiffsMutable, createEmptyRecordsDiff).

### 1.4 Excalidraw
- URLs: https://github.com/excalidraw/excalidraw/pull/7348 (PR "feat: multiplayer undo / redo", mesclado em 2024-04-17) ; https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/element/src/store.ts ; https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/history.ts ; https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/excalidraw-api .
- Versão: o registro npm informa @excalidraw/excalidraw 0.18.1 como a mais recente em 2026-10-08. As páginas não declaram versão. O texto do PR 7348 não menciona CaptureUpdateAction; os nomes de captureUpdate constam da documentação da API e do código atual.
- Fatos documentados:
  - O PR introduz Store, Change (AppStateChange e ElementsChange), Delta e History. A Store mantém um snapshot sempre atualizado, calcula o incremento e o emite. O Delta guarda deleted (valores anteriores) e inserted (valores novos); inverter um delta troca os dois campos. O histórico guarda incrementos invertíveis em vez de snapshots. As pilhas são locais; a mudança remota pode entrar em conflito com elas, e o undo continua funcionando depois que a colaboração começa. O PR registra a motivação como o Ctrl+Z em sessões colaborativas (issue 5375).
  - A History pula entradas sem efeito visível, por exemplo quando o delta toca elementos excluídos ou quando um cliente remoto já levou o elemento ao mesmo estado. O PR também registra que o undo atualiza a entrada de redo com propriedades conflitantes, e o redo faz o mesmo no sentido oposto.
  - Enum CaptureUpdateAction: IMMEDIATELY (desfazível de imediato; a maioria das edições locais, exceto operações efêmeras como arrastar e redimensionar), NEVER (nunca desfazível; atualizações remotas e inicialização da cena) e EVENTUALLY (fluxos assíncronos de várias etapas; as mudanças entram no histórico apenas na próxima captura IMMEDIATELY).
  - A API updateScene aceita elements, appState, collaborators e captureUpdate. Atualizações de collaborators e de partes não observadas do AppState nunca entram nas pilhas, qualquer que seja o valor. history.clear() esvazia as pilhas.
  - No código de store.ts: commit(elements, appState) executa as microações pendentes, escolhe uma única macroação com prioridade IMMEDIATELY, depois NEVER, depois EVENTUALLY, processa e limpa o conjunto agendado. Só IMMEDIATELY emite DurableIncrement (e só se o delta não é vazio); NEVER e EVENTUALLY emitem apenas EphemeralIncrement. IMMEDIATELY atualiza o snapshot; EVENTUALLY não atualiza, então as mudanças se acumulam até a próxima captura.
  - scheduleMicroAction calcula de imediato a diferença entre o estado atual e o snapshot agendado, para que a mudança não sofra mutações posteriores.
  - getObservedAppState mantém somente: name, editingGroupId, viewBackgroundColor, selectedElementIds, selectedGroupIds, croppingElementId, activeLockedId, lockedMultiSelections e selectedLinearElement (reduzido a elementId e isEditing). A seleção portanto faz parte do que o histórico observa.
  - Elementos excluídos permanecem no snapshot marcados com isDeleted.
  - No código de history.ts: HistoryDelta estende StoreDelta; applyTo devolve [elements, appState, houveMudancaVisivel] e exclui version e versionNonce da aplicação. record(delta) ignora deltas vazios, empilha o inverso em undoStack e limpa redoStack somente quando a parte de elementos do delta é não vazia (uma mudança só de appState, como desselecionar, preserva o redo). undo e redo chamam perform em laço: repetem pop até que uma entrada produza mudança visível, empilhando cada entrada percorrida na pilha oposta. O trecho lido não mostra limite de profundidade das pilhas.

### 1.5 Figma
- URL: https://www.figma.com/blog/how-figmas-multiplayer-technology-works/ (publicado em 2019-10-16). A busca também listou o post de 2016 em https://www.figma.com/blog/multiplayer-editing-in-figma/ , que não foi aberto.
- Fatos documentados:
  - Em multiplayer, o undo é "inherently confusing" porque outras pessoas editam os mesmos objetos.
  - Princípio adotado: se a pessoa desfaz muito, copia algo e refaz até o presente, o documento não deve mudar.
  - Uma operação de undo modifica o histórico de redo no momento do undo, e uma operação de redo modifica o histórico de undo no momento do redo.
  - O post não menciona restauração de seleção. O resumo da página também não traz exemplo detalhado.
- Fonte secundária tentada: https://replicache.notion.site/Redoing-undo-c0183b91d12c4272a3482e3233cc2890 devolveu apenas a palavra "Notion" ao WebFetch; seu conteúdo não foi lido e nenhuma afirmação desta nota depende dela.
- Fonte complementar lida, Liveblocks: https://liveblocks.io/blog/how-to-build-undo-redo-in-a-multiplayer-environment (publicado em 2022-06-09). Afirma que cada usuário guarda o comando inverso das próprias operações (Command) em vez de snapshots (Memento), que o histórico é pausado no início de uma ação contínua (mouse down) e retomado ao fim (mouse up), que seleção, página atual e zoom podem entrar na pilha de histórico, que o caso "item a desfazer já não existe" resulta em nada acontecer (como em Figma e Google Slides), e que room.history expõe undo, redo, pause e resume. O texto classifica a inclusão de seleção e outros estados no histórico como difícil de implementar.

### 1.6 Immer
- URL: https://immerjs.github.io/immer/patches
- Versão: a página não declara versão; registra que, a partir da versão 6, os patches precisam ser habilitados. O registro npm informa immer 11.1.21 como a mais recente em 2026-10-08.
- Fatos documentados:
  - enablePatches() é chamado uma vez na inicialização.
  - produceWithPatches tem a assinatura de produce e devolve a tupla [nextState, patches, inversePatches]; também aceita currying. O terceiro argumento de produce recebe um callback (patches, inversePatches).
  - Formato do patch: op ('replace', 'add' ou 'remove'), path (array, diferente da RFC 6902, que usa string) e value. A página dá a conversão para string: "/" mais path.join("/"), com escape de ~ e / conforme a RFC 6901.
  - applyPatches(state, changes) aplica patches; aplicar inversePatches desfaz as mudanças.
  - Os patches gerados são corretos, mas não garantidamente mínimos; otimizar pode ser caro, e a página remete a um artigo sobre compressão de patches acumulados.
  - O exemplo de undo e redo da página usa inversePatches para desfazer; para redo ela cita apenas material externo, sem código.

### 1.7 Mutative
- URLs: http://mutative.js.org/docs/getting-started/performance/ ; http://mutative.js.org/docs/api-reference/create/ ; http://mutative.js.org/docs/api-reference/apply/ .
- Versão: o benchmark da página usa Mutative v1.3.0 contra Immer v10.1.3. O registro npm informa mutative 1.3.0 como a mais recente em 2026-10-08 (Immer mais recente: 11.1.21, portanto o benchmark publicado compara contra uma versão de Immer anterior à atual). Páginas de API atualizadas em 2023-12-10 (create) e 2025-05-22 (apply).
- Fatos documentados:
  - create(state, fn, options). Opção enablePatches: booleano ou { pathAsArray?, arrayLengthAssignment? }, padrão false. pathAsArray padrão true (path em array). arrayLengthAssignment padrão true; com false, os patches ficam compatíveis com JSON Patch, com possível perda de desempenho. Não existe a chave patchesOptions: as duas opções ficam dentro de enablePatches.
  - enableAutoFreeze padrão false; strict padrão false; mark define se um valor é mutável ou imutável (autoFreeze e patches devem estar desligados ao usar cópia rasa).
  - Com enablePatches ativo, create devolve [state, patches, inversePatches]. apply(state, patches, options?) avança ou reverte; a opção mutable (desde 1.2.0) altera o estado original e devolve void, e não combina com outras opções. Os patches têm op, path e value, por exemplo { op: 'replace', path: ['foo', 'bar'], value: 'test2' }.
  - Benchmark publicado (ops/s, atualizando 50 mil itens de array e mil de objeto; macOS 14.7, Apple M1 Max, Node 22.11.0): sem patches e sem autoFreeze, Mutative 6.783 e Immer 5,72; sem patches e com autoFreeze, 1.069 contra 392; com patches e sem autoFreeze, 1.006 contra 5,73; com patches e com autoFreeze, 548 contra 287. A página afirma de 2,5x a 82,9x em cenários mais amplos e até 2x (objetos) e 6x (arrays) contra reducer escrito à mão, e traz inconsistência interna (texto inicial fala em até 16x, enquanto a tabela mostra razões maiores). Os valores são da página, medidos pelo autor da biblioteca; nenhuma medição independente foi lida.

### 1.8 Yjs, UndoManager
- URLs: https://docs.yjs.dev/api/undo-manager ; https://raw.githubusercontent.com/yjs/yjs/main/src/utils/UndoManager.js .
- Versão: as páginas não declaram versão. O registro npm informa yjs 13.6.33 como a mais recente em 2026-10-08.
- Fatos documentados:
  - new Y.UndoManager(scope, opções). captureTimeout padrão 500 ms (0 captura cada mudança separadamente). trackedOrigins: Set, padrão contendo null (mudanças locais sem origem); o próprio UndoManager é sempre incluído. captureTransaction padrão (_tr) => true; deleteFilter padrão () => true; ignoreRemoteAttributeChanges padrão false (nome atual no código; a documentação usa nome anterior).
  - Métodos: undo, redo, stopCapturing (zera lastChange e força novo item), clear(clearUndoStack = true, clearRedoStack = true).
  - Regra de mescla no código: a transação se une ao último item quando lastChange é maior que 0, a diferença de tempo é menor que captureTimeout, a pilha não está vazia e não há undo ou redo em curso.
  - Eventos: stack-item-added (item novo), stack-item-updated (mescla), stack-item-popped (após undo ou redo com mudança efetiva), stack-cleared. Cada item tem meta, um Map para guardar dados como a seleção ao criar o item e restaurá-los em stack-item-popped.
  - Transação capturada fora de undo e redo esvazia o redoStack (clear(false, true)). Durante undo as mudanças vão para redoStack; durante redo vão para undoStack sem limpar o redo.
  - Para atributos de mapa, se um item mais novo (remoto) ocupa a posição, redoItem devolve null e nada é refeito, a menos que ignoreRemoteAttributeChanges seja verdadeiro.

### 1.9 Command, Memento e prós e contras
- URLs: https://refactoring.guru/design-patterns/command ; https://refactoring.guru/design-patterns/memento .
- Versão: páginas de catálogo de padrões, sem versão ou data legível no resumo.
- Fatos documentados:
  - Command com backup: o comando que altera estado salva uma cópia antes de executar e vai para uma pilha; desfazer restaura o backup. Alternativa: executar a operação inversa, que o texto descreve como difícil ou até impossível em alguns casos. Comandos que não alteram estado, como copiar, não entram no histórico.
  - Prós listados: separa quem invoca de quem executa; novos comandos entram sem quebrar clientes; permite undo e redo, execução adiada e composição de comandos. Contra listado: camada extra de complexidade. O texto indica que backups podem consumir muita RAM, o que motiva a operação inversa.
  - Memento: o originador cria snapshots imutáveis do próprio estado, o zelador mantém a pilha. Prós: snapshots sem violar encapsulamento; originador mais simples. Contras: consumo de RAM se os mementos são criados com frequência; o zelador precisa descartar mementos obsoletos; em linguagens dinâmicas não há garantia de que o estado no memento permaneça intacto.

### 1.10 Testes baseados em propriedades e em modelo
- fast-check, página de teste baseado em modelo: https://fast-check.dev/docs/advanced/model-based-testing/ ; interface: https://fast-check.dev/docs/api/interfaces/ICommand/ . A página não declara a versão do pacote (a página da interface traz um hash de commit e copyright de 2026). A versão do projeto em questão é 4.10.2, informada pelo solicitante.
  - fc.commands(arrayDeComandos, restrições?) gera cenários e encolhe falhas; aceita { size: '+1' } e { replayPath }. fc.modelRun(setup, cmds) roda comandos síncronos; setup devolve { model, real }. Existem fc.asyncModelRun e fc.scheduledModelRun.
  - ICommand: check(m) diz se o comando se aplica ao modelo e não altera o modelo; run(m, r) recebe o modelo ainda não atualizado e o sistema real, verifica o estado resultante, lança erro se inválido e atualiza o modelo; toString() nomeia o comando nos relatórios. Desde a versão 1.5.0.
  - Para repetir uma falha gerada por commands, o assert recebe replayPath além de seed e path.
  - A página alerta que o modelo deve ser uma representação simplificada, nunca uma cópia do sistema, porque copiar leva a testar o código contra si mesmo.
- Hypothesis, https://hypothesis.readthedocs.io/en/latest/stateful.html (versão não declarada; "latest"): RuleBasedStateMachine, rule, precondition, invariant (roda após cada passo), initialize, Bundle, consumes, run_state_machine_as_test; recomenda comparar a implementação com um modelo simplificado em memória; max_examples e stateful_step_count ajustam o tamanho.
- quickcheck-state-machine, https://github.com/stevana/quickcheck-state-machine (Haskell; versão não declarada na página): modelo com estado inicial e transição, ações, pré-condições (usadas na geração e no encolhimento) e pós-condições (comparam a resposta concreta com o modelo); execução sequencial e paralela com busca de linearização.
- Busca de artigos específicos sobre undo e redo: a pesquisa não encontrou artigo dedicado a testes de propriedade de undo e redo em editor. Resultados mais próximos, não abertos e portanto não usados como fonte de fato: issue 1472 do projeto Serenity (propõe a propriedade aplicar N edições, desfazer N vezes e conferir o estado original) e issue 13183 do KittyCAD/modeling-app (propõe modelos de máquina de estados com fast-check e relatórios com seed e path).

## 2. Técnicas de histórico: como se faz, custo, o que garante e o que não garante

Esta seção mistura fatos das fontes acima (marcados com a fonte) e avaliação do pesquisador (marcada "Avaliação").

### 2.1 Passos invertidos com mapeamento (ProseMirror)
- Como: cada transação gera passos; o histórico guarda o passo invertido e o StepMap; a seleção inicial do grupo vai como bookmark; o undo aplica o passo invertido e move o evento para a pilha oposta.
- Custo (fato): memória proporcional aos passos, não ao documento; o RopeSequence permite fatiar sem copiar tudo; compressão remove itens só de mapa após 500 vazios. Profundidade padrão de 100 eventos.
- Garante (fato): seleção por bookmark resolvida só no momento do undo; agrupamento por tempo (500 ms) e adjacência; escape explícito por closeHistory e addToHistory false; suporte a rebase colaborativo.
- Não garante (fato): o histórico não entra em toJSON do estado; sem toJSON no campo do plugin, não sobrevive a salvar e abrir.
- Avaliação: a técnica exige que todo passo tenha inverso computável e que o documento seja só do modelo do editor. O contexto de edição do builder (breakpoint, estado, classe, quadro-chave) não existe nesse modelo; teria de ser incluído no passo.

### 2.2 Snapshot do estado inteiro com compartilhamento estrutural (Lexical)
- Como: cada entrada guarda a referência ao EditorState imutável; undo troca o estado inteiro com a tag historic.
- Custo (fato): cada entrada é uma referência; o estado compartilha o NodeMap com cópia sob escrita; maxDepth padrão sem limite.
- Garante (fato): o EditorState contém a seleção, e o undo devolve esse estado inteiro (inferência do resumo sobre o código); mesclagem decidida por função pura com relógio injetável (dateNow).
- Não garante (fato): a pilha ilimitada por padrão cresce até o limite escolhido pela aplicação; a página admite custo marginal não nulo.
- Avaliação: snapshot com compartilhamento estrutural dá igualdade exata de estado após undo e redo por construção, mas qualquer parte do estado que não esteja dentro do snapshot (contexto de edição, rascunho de campo) fica de fora e precisa de tratamento explícito.

### 2.3 Diffs de registros com marcas de parada (tldraw)
- Como: a store emite diffs {added, updated com pares antes e depois, removed}; o histórico acumula um diff pendente e o fecha numa marca; undo aplica o inverso (troca antes e depois); redo reaplica; bailToMark descarta; squashToMark compacta.
- Custo (fato): proporcional ao que mudou; o pendingDiff funde mudanças com squashRecordDiffsMutable; sem limite de profundidade documentado.
- Garante (fato): escopos separam o que entra (registros da store de origem 'user') do que fica fora (átomos externos; instance state por padrão); três modos de gravação cobrem "ignorar" e "gravar sem apagar o redo"; undo e redo rodam com o gravador pausado para que suas escritas não criem entradas; cancelar um arraste é bailToMark.
- Não garante (fato): marcas são responsabilidade do chamador; sem marca, uma interação contínua vira vários passos.
- Avaliação: é o modelo mais próximo da regra do builder de que digitação e arraste formam um gesto com ponto de início e fim e de que o que está fora do documento não entra no histórico.

### 2.4 Deltas por propriedade com política de captura (Excalidraw)
- Como: Store mantém snapshot, emite DurableIncrement só quando a ação agendada é IMMEDIATELY e o delta não é vazio; History empilha o inverso; undo e redo percorrem entradas até haver mudança visível.
- Custo (fato): proporcional ao delta; elementos excluídos ficam no snapshot com isDeleted; sem limite de profundidade no trecho lido.
- Garante (fato): três políticas explícitas (IMMEDIATELY, NEVER, EVENTUALLY); filtro explícito do appState observado, o que inclui seleção; mudança só de appState não apaga o redo; microação calcula o delta no instante da chamada.
- Não garante (fato): o trecho lido não mostra restauração explícita de selectedElementIds por undo além da aplicação do delta de appState; entradas sem efeito visível são puladas, o que muda a contagem de passos percebida.

### 2.5 Patches (Immer e Mutative)
- Como: o produtor de estado imutável devolve o novo estado, os patches e os patches inversos; undo aplica os inversos; redo aplica os diretos.
- Custo (fato): patches proporcionais ao que mudou; Immer declara que os patches não são mínimos; benchmark do autor do Mutative mostra Immer 5,73 ops/s contra 1.006 do Mutative com patches e sem autoFreeze, e 287 contra 548 com autoFreeze, num cenário de 50 mil itens (medição do autor, M1 Max).
- Garante (fato): aplicar inversePatches ao estado resultante devolve o estado base.
- Não garante (fato): Immer não minimiza patches; o formato de path em array difere da RFC 6902.
- Avaliação: patches só são seguros para undo quando aplicados exatamente sobre o estado que os produziu. Num documento em árvore com IDs, um patch por caminho de índice quebra se algo reordenar irmãos entre a gravação e a aplicação; patches por ID de bloco evitam isso.

### 2.6 Command com inverso versus snapshot versus patches
- Fatos (Refactoring Guru e Liveblocks): Command com inverso gasta pouca memória, mas o inverso pode ser difícil ou impossível de escrever e cada comando novo exige o seu; backup de estado é simples, mas consome RAM; Memento é apropriado quando o estado tem partes privadas. Liveblocks adota inversos por usuário em multiplayer por causa do conflito em que snapshot apaga trabalho alheio.
- Avaliação, tabela de decisão para o builder:
  - Comando com inverso escrito à mão: menor memória; risco de divergência entre o comando e seu inverso; cobre-se com teste de propriedade (aplicar e desfazer devolve o estado).
  - Snapshot estrutural: igualdade exata garantida, custo por entrada igual ao caminho copiado; adequado quando o documento é imutável com compartilhamento estrutural.
  - Patches ou diffs gerados: inverso derivado, sem escrever inverso por comando; exige igualdade de base e cuidado com identidade (ID) em árvores.
  - Qualquer um dos três exige decisão explícita sobre o que entra no registro além do documento (seleção, contexto de edição) e sobre o que fica fora.

### 2.7 Agrupamento e coalescência
- Fatos: ProseMirror agrupa por tempo (500 ms) e adjacência, e fecha o grupo com closeHistory; Lexical decide por função pura com delay de 300 ms, tipo de mudança igual ao anterior, tags history-merge e history-push, e trata colar e recortar como fronteira; Yjs agrupa por captureTimeout (500 ms) e fecha com stopCapturing; tldraw agrupa por marca (início de gesto) e por run; Liveblocks usa pause e resume em mouse down e mouse up; Excalidraw usa IMMEDIATELY ao final do gesto e trata arraste como efêmero até lá.
- Avaliação: as ferramentas mais recentes (tldraw, Excalidraw, Liveblocks) delimitam arrastes por evento (início e fim), e as de texto (ProseMirror, Lexical, Yjs) por tempo e tipo. Para o builder, arraste de valor e digitação de campo correspondem aos dois casos e podem usar as duas regras: fronteira explícita no confirmar do campo e no soltar do arraste, tempo como rede de segurança.

### 2.8 Seleção e contexto no histórico
- Fatos: ProseMirror guarda bookmark da seleção no primeiro item do grupo; Yjs entrega meta por item para o aplicativo guardar e restaurar a seleção; Excalidraw inclui selectedElementIds no appState observado; tldraw guarda a seleção no page state, que não está no histórico por padrão para o instance state (a página não afirma o tratamento da seleção no undo); Lexical restaura o EditorState inteiro; o post do Figma não menciona seleção; Liveblocks afirma que seleção pode entrar na pilha e que isso é difícil.
- Avaliação: toda fonte que restaura seleção a guarda no mesmo item do histórico, no momento da gravação. Para o builder, o EditContext capturado na primeira digitação (elementos, breakpoint, estado, classe, quadro-chave) é o equivalente do bookmark e deve ir no item de histórico, não ser recalculado no undo.

### 2.9 O que fica fora do histórico
- Fatos: tldraw exclui instance state por padrão e átomos fora da store, e filtra por source 'user'; Excalidraw exclui collaborators, a maior parte do AppState e atualizações NEVER; ProseMirror exclui transações com addToHistory false.
- Avaliação: as três bibliotecas definem a exclusão por uma lista nominal (escopo, filtro de appState observado, meta explícita) e não por inspeção caso a caso. Isso corresponde à exigência de que nada fora do documento entre por engano: a lista deve ser única, num ponto, e o teste deve provar que câmera, zoom, painéis e rascunho não alteram a profundidade das pilhas.

### 2.10 Persistência do histórico
- Fatos: o campo de histórico do ProseMirror não define toJSON; tldraw persiste seleção e câmera por persistenceKey, e as páginas lidas não afirmam que persiste pilhas; Excalidraw tem history.clear e as páginas lidas não documentam persistência da pilha; a documentação lida do Lexical não trata de persistência do histórico. Nenhuma das fontes lidas documenta histórico persistido em salvar e abrir.
- Avaliação: não há prática documentada nas fontes lidas para sobreviver ao salvar e abrir; é decisão de produto do builder. Se for persistir, o item deve ser serializável (diffs e patches são dados simples; snapshots com compartilhamento perdem o compartilhamento ao serializar).

### 2.11 Redo, divergência e invariantes de teste
- Fatos: o Figma adota o invariante de que desfazer muito, copiar e refazer até o presente não altera o documento; Yjs esvazia o redo apenas quando uma transação capturada ocorre fora de undo e redo; Lexical esvazia o redo em PUSH; tldraw esvazia no modo record; Excalidraw só quando o delta de elementos é não vazio; tldraw, no undo, calcula o diff reverso e o aplica com o gravador pausado.
- Fatos de teste: fast-check permite um modelo simples com comandos (check e run), encolhimento de cenários e reprodução por replayPath; Hypothesis oferece invariant após cada passo; a documentação do fast-check adverte contra um modelo que copia o sistema.
- Avaliação, propriedades candidatas para o builder (derivadas das fontes, não citadas delas):
  1. aplicar uma sequência de comandos e desfazer todos devolve o documento, a seleção e o contexto iniciais, comparados por serialização;
  2. desfazer N e refazer N devolve o estado anterior ao primeiro undo (invariante do Figma);
  3. um comando novo após undo esvazia o redo e um comando de seleção ou de câmera não esvazia;
  4. o número de itens nas pilhas não muda com ações que ficam fora do documento;
  5. uma sequência de digitação dentro da janela de coalescência ou de um gesto vira um item, e o item contém o contexto da primeira digitação;
  6. undo com rascunho pendente grava o rascunho no contexto original antes de desfazer, e o resultado é igual ao de gravar e desfazer em dois passos;
  7. após cada passo vale a integridade do documento (IDs únicos, sem órfãos, esquema válido) e a serialização ida-e-volta é idêntica;
  8. o modelo do teste é uma pilha de estados serializados de um documento puro, sem reusar o código de histórico, para não testar o código contra si mesmo.

## 3. Resumo das conclusões (separado dos fatos)

Fatos que sustentam as conclusões:
- Todas as bibliotecas lidas separam o que entra no histórico por uma regra nominal e única (meta, escopo, política de captura).
- Todas as que restauram seleção a gravam no item do histórico no momento do primeiro evento do grupo (bookmark, meta, appState observado).
- As bibliotecas de desenho delimitam gestos por marca explícita; as de texto, por tempo e tipo.
- Nenhuma fonte lida documenta histórico persistido em salvar e abrir.

Avaliação do pesquisador:
- O desenho mais próximo da arquitetura descrita (dispatch com EditContext, store do núcleo) é o de tldraw: marcas no início do gesto, modo de gravação por chamada (gravar, gravar sem apagar o redo, ignorar), undo aplicado com o gravador pausado e cancelamento por bailToMark.
- O item de histórico deve carregar o EditContext capturado na primeira digitação e a seleção da hora da gravação, no estilo do bookmark do ProseMirror e do meta do Yjs.
- Teste de propriedade com fast-check: fc.commands com modelo de pilhas de estados serializados, invariante conferido após cada comando e replayPath para reprodução.
- Lacunas desta pesquisa: não foi lido nenhum artigo dedicado a testes de propriedade de undo e redo; o post do Figma de 2016 e a nota do Replicache não foram lidos; as páginas de tldraw lidas não documentam o texto de RecordsDiff nem profundidade máxima das pilhas; os números de benchmark do Mutative são do autor da biblioteca.
