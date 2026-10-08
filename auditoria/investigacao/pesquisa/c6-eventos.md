# C6 — Controlador global de eventos e estados: pesquisa

Data de acesso de todas as fontes: 2026-10-08.
Convenção: a seção "Fatos documentados" de cada fonte traz o que a página ou o código público afirma. As seções "Avaliação" são juízo do pesquisador e estão marcadas assim.
Versões do projeto-alvo: React 19.3.0, react-dom 19.3.0, TypeScript 6.0.3, Vite 8.3.0, Vitest 5.0.1, fast-check 4.10.2, happy-dom 20.14.5, @playwright/test 1.63.0.

Observação de método: duas fontes de código (tldraw Editor.ts e excalidraw App.tsx) foram baixadas por completo com curl a partir do endereço raw do GitHub e examinadas com grep e leitura de trechos; os arquivos têm 11764 e 12053 linhas. A ferramenta WebFetch lê apenas as primeiras 100000 caracteres desses arquivos, por isso o curl foi usado para chegar às funções citadas. As linhas citadas abaixo são descritas em prosa e referem-se ao conteúdo de master/main em 2026-10-08.

---

## 1. tldraw

### 1.1 Documentação: editor, ferramentas, eventos, entrada
- URLs: https://tldraw.dev/docs/editor , https://tldraw.dev/sdk-features/tools , https://tldraw.dev/sdk-features/events , https://tldraw.dev/sdk-features/input-handling , https://tldraw.dev/reference/editor/Editor
- Versão: as páginas não declaram número; o package.json de packages/editor em main indica 5.5.2 (lido por curl em 2026-10-08).

Fatos documentados:
- A página de ferramentas define StateNode como a classe base de todas as ferramentas e estados. Três tipos: root (contém as ferramentas), branch (tem estados filhos) e leaf (executa o trabalho). O select tem os filhos idle, pointing_shape, translating, resizing e rotating.
- Propriedades estáticas: id (obrigatório), initial (obrigatório se houver filhos) e children() que devolve os construtores dos filhos.
- Ganchos: onEnter, onExit e um handler por evento: onPointerDown(info: TLPointerEventInfo), onPointerMove, onPointerUp, onKeyDown, onKeyUp, onWheel, onLongPress, onDoubleClick, onCancel, onComplete, onInterrupt, onTick.
- Transição: this.parent.transition('pointing_shape', info). Aceita o id de um filho direto ou caminho com pontos, como 'crop.pointing_crop_handle'. O info passa ao onExit do estado antigo e ao onEnter do novo.
- Despacho: o evento desce do root até a ferramenta ativa e depois ao filho ativo. Estado sem handler para o evento o ignora e o evento continua para o filho. No estado idle do select, o hit-test reenvia o evento a si mesmo com target 'shape' ou 'canvas'.
- Editor: dispatch(info: TLEventInfo): this ("Dispatch an event to the editor."), getPath(): string (exemplo "select.idle"), getCurrentTool(): StateNode, getCurrentToolId(): string, readonly root: StateNode ("The root state of the statechart."), setCurrentTool(id).
- Eventos: editor.on('before-event') dispara antes de o evento chegar à máquina de estados; editor.on('event') dispara depois. O tipo agrupa (pointer, click, keyboard, wheel, pinch, misc) e o name identifica (pointer_down, pointer_move, pointer_up, right_click, middle_click, long_press, e em misc: cancel, complete, interrupt, tick). O target de eventos de ponteiro é canvas, shape, selection, handle ou overlay.
- Tick: editor.on('tick', (elapsed) => ...) recebe milissegundos desde o quadro anterior e dispara logo após o evento frame.
- Entrada: editor.inputs (InputsManager) guarda posições atual, anterior e de origem em coordenadas de tela e de página, teclas, botões e tipo de dispositivo, tudo como átomos reativos de @tldraw/state. getIsDragging() vira verdadeiro quando o ponteiro passa do limiar dragDistanceSquared (ou coarseDragDistanceSquared) com o botão pressionado. getOriginPagePoint() guarda o ponto do último pointer_down.
- Ordem do processamento (página de entrada): before-event, atualização das teclas modificadoras, updateFromEvent (ponteiro, pinça, roda), botões e flags, ClickManager, máquina de estados, evento event. pointer_move, wheel e pinch são enfileirados e processados uma vez por quadro; os demais processam na hora.

### 1.2 Código: StateNode.ts
- URL: https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/editor/tools/StateNode.ts (aberto com WebFetch).
- Fatos: StateNode é classe abstrata que implementa Partial<TLEventHandlers>. Guarda os átomos _isActive e _current e o computed _path. getPath monta this.id seguido de ponto e do caminho do filho ativo. getCurrent devolve o filho ativo. transition(id, info) divide o id por ponto e percorre os níveis: sai do filho anterior se ainda ativo, define o novo _current e chama enter; interrompe a cadeia se o novo filho não ficou ativo.
- handleEvent obtém o nome do callback por EVENT_NAME_MAP[info.name], chama no próprio nó e só encaminha ao filho se o nó continua ativo e o filho atual não mudou durante o callback. O pai processa primeiro; o evento desce depois.
- Proteções contra transição reentrante, todas por verificação de estado e sem trava: o filho anterior só sai se ainda ativo (evita onExit espúrio quando o pai já saiu); a cadeia para quando o filho recém-entrado já foi desativado; em enter, o filho inicial só é ativado se o filho atual não mudou durante onEnter (evita filho órfão); em handleEvent o encaminhamento depende de o nó e o filho continuarem os mesmos.
- Não há tabela de transições legais: qualquer estado pode chamar transition para qualquer id. A "acusação" de transição ilegal inexiste no tldraw; a proteção é só contra reentrância.

### 1.3 Código: Editor.ts (lido por curl)
- URL: https://raw.githubusercontent.com/tldraw/tldraw/main/packages/editor/src/lib/editor/Editor.ts
- Fatos: dispatch(info) empilha o evento em _pendingEventsForNextTick e, quando o evento não é pointer_move, wheel nem pinch, chama _flushEventsForTick(0) de imediato. O método _flushEventsForTick executa dentro de this.run, copia a fila, zera, processa cada evento por _flushEventForTick e, se elapsed for maior que zero, envia root.handleEvent com type misc, name tick e elapsed. _flushEventForTick retorna cedo se getCrashingError() existe, emite before-event e segue para o tratamento. O evento tick registrado por this.on('tick', this._flushEventsForTick) dá o descarregamento dos movimentos acumulados uma vez por quadro.
- getPath() é computed e devolve root.getPath() cortado depois de 'root.'. isIn(path) divide por ponto e compara id do filho atual nível a nível a partir do root; isInAny(...paths) é some sobre isIn.
- markEventAsHandled(e) guarda o evento nativo em um conjunto (handledEvents) e wasEventAlreadyHandled(e) consulta; o comentário do código explica que serve para um componente impedir que outras partes do tldraw tratem o mesmo evento sem chamar stopPropagation e sem afetar ouvintes de fora do tldraw. É um mecanismo de dono explícito do evento DOM.

### 1.4 Avaliação (pesquisador)
- O ponto único do tldraw é dispatch. Toda entrada vira um TLEventInfo tipado e passa por before-event, máquina, event. Esse desenho dá um ponto para registrar, repetir e auditar eventos.
- O dono do evento é o estado ativo na hierarquia; markEventAsHandled resolve a disputa entre ouvintes DOM.
- A máquina não declara transições legais. Para o requisito "transições ilegais acusadas" é necessário adicionar uma tabela de transições permitidas e uma verificação em transition; o tldraw serve de modelo para o despacho, não para a acusação.
- A coalescência de pointer_move por quadro reduz custo; o custo é que movimento e clique deixam de ter a mesma latência, o que exige regra explícita sobre ordem entre pointer_move pendente e pointer_up.

---

## 2. ProseMirror

### 2.1 Referência: EditorProps
- URL: https://prosemirror.net/docs/ref/#view.EditorProps (primeiros 100000 caracteres lidos de 282448). Versão de prosemirror-view: a página não informa.
- Fatos: handleDOMEvents é um objeto que mapeia nome de evento DOM a função chamada antes de o ProseMirror tratar o evento no elemento editável; se retornar true, cabe ao handler chamar preventDefault. handleKeyDown(view, event). handleTextInput(view, from, to, text, deflt): retornar true suprime a inserção padrão. handleClick(view, pos, event) roda depois dos handleClickOn, que são chamados de dentro para fora com o parâmetro direct.
- Combinação de props: primeiro as props diretas da view, depois os plugins da view, depois os plugins do estado na ordem. Handlers são chamados um por vez até um retornar true. Nos handlers comuns, true faz a view chamar preventDefault; em handleDOMEvents essa responsabilidade é do handler. Funções das props de plugin recebem a instância do plugin como this.

### 2.2 Guia
- URL: https://prosemirror.net/docs/guide/ . Versão: não informada.
- Fatos: um evento DOM chega à EditorView, gera uma transação, a transação produz um novo EditorState, devolvido à view; o guia descreve o fluxo como cíclico e direto. A view emite cada transação por dispatchTransaction, que pode ser interceptada para integrar a um store. "Every state update has to go through updateState." Estado é imutável: state.apply(tr) produz novo estado. Plugins têm props, slot de estado e metadados de transação (setMeta, getMeta). Digitação e movimento do cursor ficam com o navegador; depois o ProseMirror lê a seleção DOM e despacha uma transação de seleção, ou reanalisa o trecho alterado e traduz a diferença em transação.

### 2.3 Avaliação (pesquisador)
- O modelo "cadeia de handlers por prioridade até um retornar true" do ProseMirror dá regra clara de dono: o primeiro que trata encerra. A ordem é estática (props diretas, depois plugins na ordem de registro).
- O ProseMirror deixa a digitação ao navegador e reconcilia depois; isso é relevante para campos com rascunho: o controlador não deve tentar substituir a entrada nativa de campos de texto, e sim observar e registrar.

---

## 3. Lexical

### 3.1 Comandos
- URL: https://lexical.dev/docs/concepts/commands . Versão: a página não informa.
- Fatos: createCommand<T>('NOME') cria comando tipado. editor.dispatchCommand(command, payload) dispara os ouvintes; fora de editor.update ele abre um implicitamente; não se deve despachar dentro de editor.read (aviso em desenvolvimento). editor.registerCommand(command, listener, priority) devolve uma função de remoção. O ouvinte roda dentro de editor.update; não deve chamar editor.update nem editor.read de modo síncrono (editor.read('latest', ...) é seguro). Retornar true marca como tratado e interrompe a propagação; false deixa os demais receberem.
- Prioridades da mais baixa à mais alta: COMMAND_PRIORITY_EDITOR, COMMAND_PRIORITY_BEFORE_EDITOR, COMMAND_PRIORITY_LOW e BEFORE_LOW, COMMAND_PRIORITY_NORMAL e BEFORE_NORMAL, COMMAND_PRIORITY_HIGH e BEFORE_HIGH, COMMAND_PRIORITY_CRITICAL e BEFORE_CRITICAL. Chamada da prioridade mais alta para a mais baixa até algum retornar true; dentro de uma prioridade, primeiro os BEFORE_* do registro mais recente para o mais antigo, depois os normais na ordem de registro. A página recomenda a menor prioridade possível, em geral BEFORE_EDITOR, e usar a variante BEFORE_* para observar sem bloquear (retornando false).
- Desregistro: guardar a função devolvida; combinar várias com mergeRegister de @lexical/utils; em plugins React, retornar a chamada de dentro de useEffect.

### 3.2 Listeners
- URL: https://lexical.dev/docs/concepts/listeners . Versão: não informada.
- Fatos: registerRootListener(callback) chama callback(rootElement, prevRootElement) imediatamente no registro e a cada mudança de raiz, e devolve função de remoção; o uso indicado é anexar ouvintes DOM ao novo elemento e remover os do anterior. registerUpdateListener recebe editorState, prevEditorState, tags, dirtyElements, dirtyLeaves, mutatedNodes, normalizedNodes. registerMutationListener(NodeClass, callback, options) aceita skipInitialization (padrão false: se já houver nós, chama de imediato com estado created). registerTextContentListener, registerDecoratorListener. Todos devolvem função de remoção, e a página manda chamá-la quando o ouvinte não for mais necessário.

### 3.3 Avaliação (pesquisador)
- O contrato de Lexical é: todo registro devolve uma função de remoção; tudo que registra é agrupável. Esse contrato mapeia direto para um "escopo de ciclo de vida" do controlador: cada registro entra em uma lista e a desmontagem executa a lista.
- O padrão registerRootListener resolve o caso de o elemento raiz trocar (por exemplo, o documento do iframe recarregar): o ouvinte é religado ao novo elemento e solto do antigo em um único callback. O canvas em iframe do builder tem esse caso.
- Prioridade numérica de comando é mais flexível que a ordem de registro, e mais difícil de auditar: dois comandos de mesma prioridade dependem da ordem de registro. Para dono explícito, prefira uma tabela de dono por evento em vez de prioridade.

---

## 4. Excalidraw

- URL: https://raw.githubusercontent.com/excalidraw/excalidraw/master/packages/excalidraw/components/App.tsx (WebFetch leu 100000 de 390829 caracteres; o arquivo inteiro foi baixado por curl para localizar as funções). Versão: package.json de packages/excalidraw em master não expôs campo de versão pelo comando usado; o package.json de packages indicou 0.18.0.
- Fatos do código:
  - handleCanvasPointerDown é um arrow method privado da classe App. Primeiro verifica se a interação está habilitada; depois calcula a posição na cena; chama setPointerCapture no alvo do evento quando o método existe, com o comentário "capture subsequent pointer events to the canvas"; chama maybeCleanupAfterMissingPointerUp(event.nativeEvent), que encerra o pan, chama lastPointerUp e dispara e limpa o missingPointerEventCleanupEmitter. Isso trata o caso de um pointerup que nunca chegou: ao começar um novo toque, o anterior é encerrado à força. Em seguida fecha o menu de contexto (setState contextMenu nulo), limpa snapLines, fecha openPopup e registra o gesto.
  - O arrasto registra ouvintes na janela dona (ownerWindow) para pointermove, pointerup, keydown e keyup, guardados em pointerDownState.eventListeners (onMove, onUp, onKeyDown, onKeyUp). No pointerup, o código remove os quatro por removeEventListener com as mesmas referências e limpa o missingPointerEventCleanupEmitter.
  - Ciclo de vida central: o App mantém onRemoveEventListenersEmitter. addEventListeners chama removeEventListeners primeiro ("remove first as we can add event listeners multiple times"); cada registro devolvido por um helper addEventListener é entregue a onRemoveEventListenersEmitter.once(...). removeEventListeners apenas dispara o emissor. componentWillUnmount também limpa timers (clearTimeout em zenModeTransitionTimer e em touchTimeout), desconecta o resizeObserver, para laserTrails, drawShape, toolDrag e eraserTrail, e limpa os emissores.
  - Estado de interação fica repartido: no this.state do React (activeTool, multiElement, selectionElement, newElement, resizingElement, selectedElementsAreBeingDragged, cursorButton, editingTextElement, contextMenu, openPopup), em campos de instância (lastPointerDownEvent, lastPointerMoveEvent, activeResizeHandle, bindModeHandler) e em variáveis de módulo (gesture, lastPointerUp, touchTimeout). Não existe máquina de estados nomeada: o "modo" é deduzido de combinações desses campos.
  - Feature detection de setPointerCapture no render: sem o método, uma variável shouldBlockPointerEvents calculada de selectionElement, newElement, selectedElementsAreBeingDragged, resizingElement e laser decide o CSS --ui-pointerEvents.
- Avaliação (pesquisador): o Excalidraw mostra o padrão de emissor de limpeza (registro, remoção, once) e o padrão de "encerrar o gesto anterior ao começar um novo" que cobre pointerup perdido. Também mostra o custo de não ter máquina explícita: o modo é a conjunção de vários campos, e combinações impossíveis não são acusadas. Para o builder, o emissor de limpeza serve como modelo do escopo de ciclo de vida; o modo por conjunção de campos é o que se deve evitar.

---

## 5. React 19

### 5.1 StrictMode
- URL: https://react.dev/reference/react/StrictMode . Versão: a página não declara; o conteúdo cita ref callbacks com cleanup, que é recurso do React 19.
- Fatos: somente em desenvolvimento, o React executa um ciclo extra de setup, cleanup e setup em cada Effect, para expor cleanup ausente. O exemplo mostra um contador de conexões que chega a 2 quando falta o cleanup. Ref callbacks também recebem um ciclo extra de setup e cleanup. Corpo de componente, funções de useState, useMemo e useReducer rodam duas vezes. Se o StrictMode cobre só parte da árvore, os Effects da montagem inicial não são reexecutados.

### 5.2 React 19 e ref cleanup
- URL: https://react.dev/blog/2024/12/05/react-19 . Versão: React 19 estável, 2024-12-05.
- Fatos: um callback de ref pode devolver função de cleanup; ao desmontar, o React chama essa função e deixa de chamar a ref com null. Retornar outra coisa de um callback de ref é erro de tipo no TypeScript. A página não descreve mudança no sistema de eventos nem cita StrictMode.

### 5.3 useEffectEvent
- URL: https://react.dev/reference/react/useEffectEvent . Versão: não informada pela página (ela não marca como experimental).
- Fatos: const onEvent = useEffectEvent(callback). Chamar só de dentro de Effects (useEffect, useLayoutEffect, useInsertionEffect) ou de outros Effect Events do mesmo componente; não chamar durante a renderização, não usar como handler, não passar a filhos ou a outros Hooks; não listar nas dependências (o linter avisa). Lê sempre os valores mais recentes de props e state sem reconectar o Effect. A identidade é instável de propósito.

### 5.4 Delegação de eventos
- URLs: https://legacy.reactjs.org/blog/2020/10/20/react-v17.html (aberto) e https://react.dev/reference/react-dom/client/createRoot (aberto).
- Fatos: a partir do React 17 os handlers são anexados ao contêiner raiz onde a árvore é renderizada, e não ao document. Eventos Capture usam a fase de captura do navegador. onFocus e onBlur usam focusin e focusout. onTouchStart, onTouchMove e onWheel continuam passivos. root.unmount() desanexa o React do nó e remove handlers e estado da árvore; depois dele não se pode chamar root.render na mesma raiz. A página de createRoot não descreve a delegação.
- Consequência para o builder (avaliação do pesquisador): handlers React da interface do editor ficam na raiz do documento do editor; o canvas em iframe tem outro documento, e ouvintes nativos ali pertencem ao controlador, não ao React. Um ouvinte nativo no document ou na janela dispara na ordem de fases do DOM em relação ao da raiz React, e ordem entre os dois precisa ser decidida por fase (captura ou bolha) declarada.

---

## 6. DOM

### 6.1 addEventListener, opção signal
- URL: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- Fatos: opção signal recebe um AbortSignal; o ouvinte é removido quando o AbortController dono do sinal chama abort(). Opções once (removido após a primeira chamada), passive (padrão true para wheel, mousewheel, touchstart e touchmove em Window, Document, documentElement e body), capture. Disponível desde julho de 2015 (Baseline amplamente disponível); a página não detalha o caso de sinal já abortado.

### 6.2 Especificação WHATWG DOM
- URL: https://dom.spec.whatwg.org/#abortsignal (Living Standard; 100000 de 400851 caracteres lidos; data de atualização não exposta no trecho).
- Fatos: no algoritmo "add an event listener", se o signal do ouvinte não é nulo e já está abortado, o algoritmo retorna sem adicionar. Se não está abortado, o ouvinte registra um passo de aborto que executa "remove an event listener". AbortSignal.any(signals) devolve sinal que aborta quando qualquer entrada abortar; AbortSignal.timeout(ms) aborta com DOMException TimeoutError; throwIfAborted() lança o motivo se abortado.

### 6.3 AbortSignal.any
- URL: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static
- Fatos: AbortSignal.any(iterable); se algum sinal de entrada já está abortado, o resultado nasce abortado; disponível em todos os navegadores desde março de 2024 (Baseline). O combinado não se desinscreve dos sinais de origem; ouvintes de abort adicionados ao combinado devem ser removidos ao fim da operação.

### 6.4 Captura de ponteiro
- URLs: https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture , https://developer.mozilla.org/en-US/docs/Web/API/Element/releasePointerCapture , https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event , https://www.w3.org/TR/pointerevents/
- Versão do conteúdo: o w3.org/TR/pointerevents/ serviu, em 2026-10-08, o Working Draft Pointer Events Level 4 de 2026-10-08 (100000 de 372869 caracteres lidos; a seção 8 de captura ficou fora do trecho lido).
- Fatos MDN: setPointerCapture(pointerId) e releasePointerCapture(pointerId) retornam undefined e lançam NotFoundError se o pointerId não corresponde a ponteiro ativo. A captura é liberada implicitamente no pointerup. lostpointercapture é um PointerEvent disparado quando a captura é liberada; a página MDN não descreve a ordem nem bubbling. releasePointerCapture é Baseline desde julho de 2020.
- Fatos da especificação (trecho lido): setPointerCapture falha em silêncio se o ponteiro não está com botões ativos; pointerup e pointercancel liberam a captura implicitamente; lostpointercapture "MUST be fired prior to any subsequent events for the pointer after capture was released"; gotpointercapture e lostpointercapture têm Bubbles sim, Cancelable não, Composed sim.
- Afirmações que as páginas lidas não sustentam e que ficam sem confirmação: comportamento quando o elemento capturador é removido do documento, e InvalidStateError para elemento desconectado.
- Avaliação (pesquisador): lostpointercapture é o único evento que cobre os três fins de um arraste (pointerup, pointercancel e liberação programática), então é o ponto de limpeza mais robusto do modo "arrastando". O Excalidraw usa outro caminho (ouvintes na janela e encerramento forçado no próximo pointerdown).

### 6.5 Contagem de ouvintes: console e CDP
- URL: https://developer.chrome.com/docs/devtools/console/utilities
- Fatos: getEventListeners(object) devolve um objeto com um array por tipo de evento; cada elemento descreve um ouvinte. Utilitários do console só existem no Console do DevTools e não funcionam em scripts da página.
- URL: https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/DOMDebugger.pdl (a página chromedevtools.github.io/devtools-protocol/tot/DOMDebugger/ devolveu só um aviso de redirecionamento; o PDL no GitHub foi aberto). Versão do protocolo: não exposta no trecho.
- Fatos: DOMDebugger.getEventListeners recebe objectId (obrigatório), depth (padrão 1; -1 para a subárvore inteira) e pierce (padrão false; true atravessa iframes e shadow roots) e devolve listeners: lista de EventListener com type, useCapture, passive, once, scriptId, lineNumber, columnNumber, handler, originalHandler e backendNodeId.
- URL: https://playwright.dev/docs/api/class-cdpsession
- Fatos: page.context().newCDPSession(page) cria a sessão; cdpSession.send(method, params) devolve Promise com objeto; eventos on('event') com method e params, e on('close'). A página do Playwright lida não exemplifica DOMDebugger e não declara restrição a Chromium (o texto lido não tem essa informação; o aviso do uso com Chromium aparece no uso de CDP em geral e deve ser conferido na página de BrowserContext antes de depender).
- Técnica: contar ouvintes pelo CDP.
  - Como: abrir newCDPSession, obter por Runtime.evaluate o objectId de window, document e dos nós de interesse (inclusive os do iframe), chamar DOMDebugger.getEventListeners com pierce true, somar por type e comparar antes de montar e depois de desmontar o editor.
  - Custo: uma ida ao navegador por alvo; roda só em Chromium; funciona no teste de ponta a ponta com o build.
  - Detecta: ouvintes registrados por qualquer código (inclusive de bibliotecas) que sobraram depois da desmontagem, com arquivo, linha e coluna do handler.
  - Não detecta: timers, observers (ResizeObserver, MutationObserver, IntersectionObserver), requestAnimationFrame pendente, promessas; ouvintes em objetos que o teste não consultou (precisa listar os alvos).

---

## 7. Detecção de vazamento em testes

### 7.1 Vitest: timers falsos
- URLs: https://vitest.dev/api/vi.html#vi-gettimercount e https://vitest.dev/config/faketimers . Versão: Vitest v5.0.3 (o projeto usa 5.0.1).
- Fatos: vi.useFakeTimers(config) aceita toFake e toNotFake (mutuamente exclusivos). vi.getTimerCount() devolve o número de timers pendentes. vi.advanceTimersByTime(ms), vi.runAllTimers() (erro após loopLimit, padrão 10000), vi.runOnlyPendingTimers(), vi.clearAllTimers(), vi.useRealTimers() (descarta os agendados antes), vi.isFakeTimers(). O padrão de toFake é tudo o que existe no global, exceto nextTick e queueMicrotask; portanto requestAnimationFrame e performance entram quando existem no global. shouldAdvanceTime padrão false.
- Técnica: asserção de contagem zero.
  - Como: vi.useFakeTimers(); montar; exercitar; desmontar; expect(vi.getTimerCount()).toBe(0).
  - Custo: baixo; exige que o código use os timers globais (setTimeout, setInterval, requestAnimationFrame) e que estejam falsificados antes de o código criá-los.
  - Detecta: setTimeout, setInterval e requestAnimationFrame pendentes depois da desmontagem.
  - Não detecta: ouvintes de evento, observers, promessas pendentes, nem timers criados antes de useFakeTimers ou por referência guardada do setTimeout original.
- Avaliação (pesquisador): como a contagem do getTimerCount mistura todos os timers, o teste deve rodar com o cenário isolado e o contador em zero na linha de base.

### 7.2 why-is-node-running
- URL: https://github.com/mafintosh/why-is-node-running
- Fatos: registra os handles ativos que mantêm o Node em execução, com arquivo e linha que os criaram (exemplos: Timeout, TCPSERVERWRAP). Uso: importar e chamar whyIsNodeRunning(); CLI com sinal SIGUSR1; --import why-is-node-running/include. Requer Node.js 20.11 ou superior na versão ESM. A página não descreve o mecanismo interno.
- Avaliação (pesquisador): atua no processo Node do Vitest, não no navegador; serve para achar por que o processo de teste não termina (handles em ambiente happy-dom que usa timers do Node). Não enxerga ouvintes DOM.

### 7.3 Técnica por embrulho em desenvolvimento (avaliação do pesquisador, sem fonte externa)
- Como: em modo de desenvolvimento e de teste, substituir EventTarget.prototype.addEventListener e removeEventListener, setTimeout, clearTimeout, setInterval, clearInterval, requestAnimationFrame e cancelAnimationFrame, e o construtor de ResizeObserver, MutationObserver e IntersectionObserver por versões que registram (tipo, alvo, fase, pilha de chamada) em um conjunto. A opção signal e once exigem tratamento: ouvinte com once sai do conjunto na primeira chamada; ouvinte com signal sai quando o sinal aborta. Observers saem no disconnect.
- Custo: poucas dezenas de linhas; custo de execução proporcional ao número de registros; a captura de pilha (new Error().stack) é o trecho caro e pode ficar ligada só em depuração.
- Detecta: tudo o que passou pelo embrulho e não foi removido, com a linha de criação; permite o vazamento ser acusado na desmontagem (conjunto não vazio) e dentro de StrictMode (setup, cleanup, setup deve deixar o mesmo conjunto que um setup).
- Não detecta: registros feitos antes de instalar o embrulho; ouvintes em atributos on* (onclick = ...) que não passam por addEventListener; referências guardadas do método original; código em outro realm (o iframe tem o próprio EventTarget.prototype e exige instalar o embrulho dentro do iframe).

---

## 8. fast-check 4.x: corridas assíncronas

- URLs: https://fast-check.dev/docs/advanced/race-conditions/ (duas leituras, uma delas da âncora do scheduler). Versão: a página cita a v4.2.0 como marco de depreciação; o projeto usa 4.10.2.
- Fatos:
  - fc.scheduler gera instâncias de Scheduler que controlam a ordem em que as promessas agendadas resolvem. fc.schedulerFor(ordering) usa ordem fixa, por exemplo [1,3,2].
  - Métodos: schedule(promise, label?, metadata?, act?) envolve promessa existente; scheduleFunction(fn, act?) devolve versão agendada (a chamada ocorre na hora, a resolução é adiada); scheduleSequence([...], act?) executa operações em ordem, cada uma só depois da anterior; waitNext(count) libera exatamente count tarefas; waitIdle() espera o scheduler ficar ocioso, inclusive tarefas criadas por tarefas; waitFor(promise) libera tarefas até a promessa resolver; report() devolve as tarefas na ordem de execução com status e saída ou erro.
  - Obsoletos desde 4.2.0: waitOne (usar waitNext(1)), waitAll (usar waitIdle) e count (sem substituto).
  - fc.scheduledModelRun combina teste baseado em modelo com o scheduler; check e run não devem depender da conclusão de outras tarefas agendadas, embora possam disparar novas tarefas sem aguardá-las.
  - Padrão de uso: fc.asyncProperty com fc.scheduler({ act }); agendar as tarefas e terminar com await s.waitIdle(). O parâmetro act envolve cada tarefa (necessário em React para atualizações de estado). setTimeout e setInterval são ordenados e exigem um act personalizado com timers falsos; o exemplo da página usa Jest.
  - Limites declarados: waitIdle não espera fontes não controladas (fetch, emissores de eventos externos); tratamento de exceção em schedule é do usuário; em scheduleSequence as tarefas não podem depender de outras tarefas agendadas; chamadas assíncronas não controladas dentro de waitFor dificultam a reprodução; em React as atualizações precisam estar dentro de act. A página não cobre seed e path.
- Técnica: reordenar as respostas assíncronas do app (carregamento, gravação de rascunho, medição) sob o scheduler.
  - Como: passar ao app dublês de portas assíncronas feitos com s.scheduleFunction; gerar sequências de comandos de entrada com fc.commands; ao fim, await s.waitIdle() e conferir invariantes (modo ocioso, documento consistente, contagem de ouvintes zero).
  - Custo: o app precisa receber suas dependências assíncronas por injeção; timers exigem act com timers falsos do Vitest.
  - Detecta: falha dependente da ordem de resolução de promessas e de timers controlados, com a ordem reduzida pelo shrinking e reproduzível.
  - Não detecta: corridas com fontes não controladas (fetch real, eventos do navegador reais, requestAnimationFrame fora do act, MessageChannel), nem corridas entre processos ou entre o iframe e a página.

---

## 9. Barramento de eventos tipado

### 9.1 mitt
- URL: https://github.com/developit/mitt . Versão: não informada.
- Fatos: menos de 200 bytes gzip, sem dependências. mitt<Events>() com tipo Events tipa on e emit (recomenda strict true). on(type, handler), off(type, handler) (sem handler remove todos do tipo), emit(type, evt); handlers '*' recebem (type, e) e rodam depois dos específicos. all é um Map; emitter.all.clear() remove tudo.

### 9.2 nanoevents
- URL: https://github.com/ai/nanoevents . Versão: não informada.
- Fatos: createNanoEvents<Events>() com interface que mapeia nome a assinatura do ouvinte; on devolve função unbind (sem guardar referência do callback); emit(evento, ...args); a propriedade events expõe os ouvintes e atribuir emitter.events = {} remove todos. Tamanho informado: 108 bytes no README (107 na seção About).

### 9.3 Avaliação (pesquisador)
- nanoevents devolve a função de remoção no registro, o mesmo contrato de Lexical, e casa com um escopo de ciclo de vida que acumula as funções. mitt oferece wildcard '*' útil para registro central de todos os eventos, mas o off exige a mesma referência da função.
- Nenhum dos dois decide dono de evento nem ordem entre ouvintes: apenas ordem de registro. Para o builder, o barramento é a base do registro e da repetição de eventos; o dono e a máquina de modos ficam por cima. EventTarget tipado por tabela de eventos em TypeScript é opção sem dependência, mas cada ouvinte também precisa de remoção via signal.

---

## 10. XState v5 (resumo; o tema C3 cobre a fundo)

- URLs: https://stately.ai/docs/xstate , https://stately.ai/docs/transitions , https://stately.ai/docs/invoke , https://stately.ai/docs/inspection . Versão: as páginas indicam XState v5 (exige TypeScript 5.0 ou superior); a versão exata do pacote não aparece.
- Fatos: createMachine, createActor(machine).start(), actor.send(event), actor.subscribe(). Transições: target pode ser irmão, descendente ('.filho') ou id ('#id'); com guard só ocorre se o guard der true; evento sem transição habilitada não executa transição e não muda o estado, e a busca sobe aos estados pai; transição proibida (forbidden: {}) casa com o evento, não faz nada e impede a busca nos pais. Targetless e targeted para o mesmo estado preservam invocações; reenter true executa entry e exit e reinicia invocações. Transições always são sem evento. Invoke: o ator invocado inicia ao entrar no estado e para ao sair; fromPromise abandonada ao sair do estado descarta o resultado; a página lida não descreve o cleanup devolvido por fromCallback. Inspeção: opção inspect de createActor recebe eventos @xstate.actor, @xstate.event (actorRef, event, sourceRef), @xstate.snapshot (snapshot, event) e @xstate.microstep (value, event, transitions).
- Avaliação (pesquisador): a máquina do XState acusa transição ilegal só se o autor declara explicitamente forbidden; um evento sem transição é descartado em silêncio. Para "transições ilegais acusadas" é necessário uma camada própria: fallback que registra todo evento sem transição habilitada em um estado, exceto os eventos declarados ignoráveis. O ciclo de vida de invocação por estado (inicia ao entrar, para ao sair) resolve o vazamento de ouvintes e timers do modo, e é a característica do XState mais relevante para C6.

---

## 11. Síntese comparativa (avaliação do pesquisador)

| Aspecto | tldraw | ProseMirror | Lexical | Excalidraw |
|---|---|---|---|---|
| Ponto único | Editor.dispatch com TLEventInfo | EditorView, transação | dispatchCommand | métodos da classe App ligados a props |
| Dono do evento | estado ativo; markEventAsHandled | primeiro handler que retorna true | maior prioridade que retorna true | condicionais sobre this.state |
| Máquina de modos | StateNode hierárquica, getPath, isIn | não há | não há | não há, conjunção de campos |
| Transição ilegal acusada | não | não aplicável | não aplicável | não |
| Limpeza de ouvintes | não coberta nas páginas lidas | destroy do plugin (não lido) | função devolvida pelo registro, mergeRegister | emissor onRemoveEventListenersEmitter |

Conclusões de engenharia para o builder (avaliação):
1. Um despachante único recebe a entrada já normalizada (tipo, nome, alvo, contexto de edição) e é o único chamador dos tratadores; ouvintes DOM só convertem e despacham. O modelo é tldraw dispatch com before-event e event.
2. Os modos (ocioso, digitando, arrastando, redimensionando, menu aberto) formam uma máquina com tabela explícita de transições permitidas. tldraw fornece hierarquia, getPath e isIn; o XState fornece estados proibidos e invocação com ciclo de vida; nenhum dos dois acusa por padrão o evento sem transição, então a acusação é código próprio.
3. Cada modo possui um escopo de ciclo de vida: ao entrar, abre um AbortController e registra ouvintes com a opção signal, timers e observers por funções que devolvem remoção; ao sair, aborta. Equivale ao emissor de limpeza do Excalidraw e ao invoke do XState.
4. Fim do arraste por lostpointercapture, que cobre pointerup, pointercancel e liberação programática; no início de um novo toque, o modo anterior ainda aberto é encerrado e a situação é acusada, como o Excalidraw faz em maybeCleanupAfterMissingPointerUp.
5. Verificação: três camadas complementares: (a) embrulho de addEventListener, timers e observers em desenvolvimento (cobre tudo que passa por ele, em cada realm); (b) vi.getTimerCount igual a zero com timers falsos; (c) DOMDebugger.getEventListeners com pierce true no teste de ponta a ponta para confirmar ouvintes no navegador real, inclusive no iframe. StrictMode confirma a simetria setup, cleanup, setup dos escopos.
6. Corridas assíncronas: fast-check com fc.scheduler, scheduleFunction e waitIdle sobre portas assíncronas injetadas; os limites são fontes não controladas (eventos reais, rAF fora do act) que ficam para o teste no navegador.
7. useEffectEvent serve para que um Effect que registra ouvintes leia os valores atuais sem reconectar; ele não pode ser chamado de handlers nem passado a filhos, então o ouvinte registrado pelo controlador chama uma função própria, e o Effect só liga e desliga o escopo.

## 12. Lacunas desta pesquisa
- Seção 8 (captura de ponteiro) do Pointer Events Level 4 não foi lida; ordem exata de lostpointercapture em relação a pointerup e o efeito de remover o elemento capturador do documento não estão confirmados.
- Restrição de CDP a Chromium no Playwright 1.63 não foi confirmada em página lida.
- O destroy do plugin ProseMirror e o cleanup de fromCallback no XState não foram lidos.
- Versões exatas de ProseMirror, Lexical, mitt, nanoevents e XState não aparecem nas páginas abertas.
