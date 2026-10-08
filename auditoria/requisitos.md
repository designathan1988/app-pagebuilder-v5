# Requisitos

## REQ-0101 — animation.create
- **Onde:** `manifest/commands/animation.json:5` `"id": "animation.create",`
- **Tratador:** `src/app/commands.ts:192` `'animation.create': createAnimationCommand,`
- **Feature:** `src/app/features.ts:198` `'timeline-animations': registerFeature('timeline-animations'),`
- **Recusa declarada:** `manifest/commands/animation.json:18` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** O botão "Nova animação" do painel Timeline cria uma animação no elemento selecionado; o painel lista as animações do elemento com uma régua de tempo. A animação entra no JSON do documento com o nome digitado, duração de 1 s, atraso 0 s, uma repetição, direção `normal`, preenchimento `none`, função de tempo `linear` e estado de reprodução `running`, com um quadro-chave em 0% e outro em 100%, ambos sem nenhum valor declarado. O nome é um identificador CSS de quadro-chave único no documento inteiro: um nome já usado é recusado (`status.animation.nameTaken`) e um texto que não seja nome é recusado (`status.animation.nameInvalid`), sem alterar o documento; um elemento travado ou dentro de um é recusado (`status.locked.edit`). A criação é um passo de undo. A disponibilidade da porta exige seleção única e nomeia `status.needsSingleSelection`.

## REQ-0102 — animation.rename
- **Onde:** `manifest/commands/animation.json:63` `"id": "animation.rename",`
- **Tratador:** `src/app/commands.ts:193` `'animation.rename': renameAnimationCommand,`
- **Feature:** `src/app/features.ts:198` `'timeline-animations': registerFeature('timeline-animations'),`
- **Comportamento esperado:** O campo de nome da linha da animação no painel Timeline renomeia a animação. O nome novo é um identificador CSS de quadro-chave livre no documento inteiro: um nome já usado é recusado (`status.animation.nameTaken`) e um texto que não seja nome é recusado (`status.animation.nameInvalid`), sem alterar o documento; um elemento travado é recusado (`status.locked.edit`). A renomeação é um passo de undo e o cenário segue com o nome novo nomeando a animação nos passos posteriores.

## REQ-0103 — animation.delete
- **Onde:** `manifest/commands/animation.json:126` `"id": "animation.delete",`
- **Tratador:** `src/app/commands.ts:194` `'animation.delete': deleteAnimationCommand,`
- **Feature:** `src/app/features.ts:198` `'timeline-animations': registerFeature('timeline-animations'),`
- **Comportamento esperado:** O botão de lixeira da linha exclui a animação do elemento. A animação sai do JSON do documento e o elemento deixa de ter as propriedades dela. O cenário remove a animação criada e mantém a anterior, com o aviso `status.animation.deleted` nomeando a excluída. Um elemento travado é recusado (`status.locked.edit`). A exclusão é um passo de undo.

## REQ-0104 — animation.addKeyframe
- **Onde:** `manifest/commands/animation.json:182` `"id": "animation.addKeyframe",`
- **Tratador:** `src/app/commands.ts:195` `'animation.addKeyframe': addKeyframeCommand,`
- **Feature:** `src/app/features.ts:199` `'timeline-keyframes': registerFeature('timeline-keyframes'),`
- **Comportamento esperado:** O botão "Adicionar quadro-chave" cria um quadro-chave no deslocamento indicado da animação mostrada; os quadros-chave aparecem como losangos na trilha, no percentual próprio, e ficam em ordem de deslocamento. O quadro nasce sem valores; com o indicador de reprodução sobre ele, o inspetor edita os valores do quadro (um distintivo avisa disso), e não os estilos base. O deslocamento é um percentual inteiro dentro do intervalo `timeline.offsetRange` do manifesto: um deslocamento fora do intervalo é recusado (`status.animation.offsetOutOfRange`), um deslocamento já ocupado é recusado (`status.animation.keyframeTaken`) e um elemento travado é recusado (`status.locked.edit`). A criação é um passo de undo.

## REQ-0105 — animation.moveKeyframe
- **Onde:** `manifest/commands/animation.json:245` `"id": "animation.moveKeyframe",`
- **Tratador:** `src/app/commands.ts:196` `'animation.moveKeyframe': moveKeyframeCommand,`
- **Feature:** `src/app/features.ts:199` `'timeline-keyframes': registerFeature('timeline-keyframes'),`
- **Comportamento esperado:** Arrastar o losango do quadro-chave ao longo da trilha move o quadro para o novo deslocamento; no cenário o quadro de 50% passa a 30% e o aviso é `status.animation.keyframeMoved` com o deslocamento novo. O deslocamento é um percentual inteiro dentro do intervalo `timeline.offsetRange` do manifesto: um deslocamento fora do intervalo é recusado (`status.animation.offsetOutOfRange`), um deslocamento já ocupado é recusado (`status.animation.keyframeTaken`) e um elemento travado é recusado (`status.locked.edit`). O movimento é um passo de undo, um por gesto de arraste.

## REQ-0106 — animation.setKeyframeEasing
- **Onde:** `manifest/commands/animation.json:312` `"id": "animation.setKeyframeEasing",`
- **Tratador:** `src/app/commands.ts:197` `'animation.setKeyframeEasing': setKeyframeEasingCommand,`
- **Feature:** `src/app/features.ts:199` `'timeline-keyframes': registerFeature('timeline-keyframes'),`
- **Comportamento esperado:** O campo "Suavização do quadro-chave" grava a suavização do quadro-chave sob o indicador de reprodução; no cenário o quadro de 50% recebe `ease-out` no JSON do documento e o aviso é `status.animation.easingSet` com o deslocamento e o valor. O valor é lido pelo codec da propriedade que a porta oferece (`animation-timing-function`): um valor que o codec não aceita é recusado (`status.animation.invalidSetting`), e um valor vazio devolve o quadro à suavização da própria animação (`timeline.easingDefault`). Um elemento travado é recusado (`status.locked.edit`). O ajuste é um passo de undo.

## REQ-0107 — animation.deleteKeyframe
- **Onde:** `manifest/commands/animation.json:386` `"id": "animation.deleteKeyframe",`
- **Tratador:** `src/app/commands.ts:198` `'animation.deleteKeyframe': deleteKeyframeCommand,`
- **Feature:** `src/app/features.ts:199` `'timeline-keyframes': registerFeature('timeline-keyframes'),`
- **Comportamento esperado:** Excluir o quadro-chave sob o indicador de reprodução. O comando tem duas portas — a lixeira do painel e a tecla Delete com o contexto `timeline` — e as duas entregam o mesmo resultado no mesmo estado (G3). O cenário exclui o quadro de 50%, mantém os de 0% e 100% e avisa `status.animation.keyframeDeleted` com o deslocamento. Um elemento travado é recusado (`status.locked.edit`). A exclusão é um passo de undo.

## REQ-0108 — animation.setSettings
- **Onde:** `manifest/commands/animation.json:467` `"id": "animation.setSettings",`
- **Tratador:** `src/app/commands.ts:199` `'animation.setSettings': setAnimationSettingsCommand,`
- **Feature:** `src/app/features.ts:200` `'timeline-animation-settings': registerFeature('timeline-animation-settings'),`
- **Comportamento esperado:** Os campos "Duração", "Atraso", "Repetição", "Direção da animação", "Fora da animação", "Função de tempo" e "Estado de reprodução" do painel Timeline gravam cada ajuste na animação, guardado no JSON do documento junto dela; no cenário a sequência termina com duração `800ms`, atraso `200ms`, repetição `infinite`, direção `alternate`, preenchimento `both`, função de tempo `ease-in-out` e estado `running`, com o aviso `status.animation.settingSet` nomeando o ajuste e o valor. Um valor que o codec da propriedade não aceita é recusado (`status.animation.invalidSetting`) sem alterar o documento; um elemento travado é recusado (`status.locked.edit`). Cada ajuste é um passo de undo. A animação não tem ajuste de gatilho próprio.

## REQ-0109 — timeline.show
- **Onde:** `manifest/commands/animation.json:761` `"id": "timeline.show",`
- **Tratador:** `src/app/commands.ts:201` `'timeline.show': showAnimationCommand,`
- **Feature:** `src/app/features.ts:198` `'timeline-animations': registerFeature('timeline-animations'),`
- **Comportamento esperado:** Clicar a linha da animação no painel Timeline mostra essa animação no painel e o aviso é `status.timeline.shown`; o cenário mostra `slide-in` e segue renomeando e excluindo a mesma animação. A ação escreve apenas o estado do editor: não muda o documento e não entra na história (sem passo de undo).

## REQ-0110 — timeline.setPlayhead
- **Onde:** `manifest/commands/animation.json:811` `"id": "timeline.setPlayhead",`
- **Tratador:** `src/app/commands.ts:200` `'timeline.setPlayhead': setPlayheadCommand,`
- **Feature:** `src/app/features.ts:199` `'timeline-keyframes': registerFeature('timeline-keyframes'),`
- **Comportamento esperado:** "Mover o indicador de reprodução": clicar ou arrastar na régua move o indicador e o canvas mostra o estado interpolado no ponto — em 50% de uma animação linear de opacidade de 0 a 1 a opacidade calculada é 0.5. O indicador fica entre zero e a duração da animação mostrada, e a pré-visualização não altera o JSON do documento. A ação escreve apenas o estado do editor: não muda o documento e não entra na história (sem passo de undo).

## REQ-0111 — timeline.play
- **Onde:** `manifest/commands/animation.json:860` `"id": "timeline.play",`
- **Tratador:** `src/app/commands.ts:202` `'timeline.play': playCommand,`
- **Feature:** `src/app/features.ts:201` `'timeline-preview': registerFeature('timeline-preview'),`
- **Comportamento esperado:** "Reproduzir" anima o elemento no canvas com os quadros-chave gravados: o cenário mede `animation-name: fade-in` e `animation-play-state: running` no elemento, com o aviso `status.timeline.playing` nomeando a animação. A pré-visualização nunca altera o JSON do documento e não entra na história (sem passo de undo).

## REQ-0112 — timeline.pause
- **Onde:** `manifest/commands/animation.json:904` `"id": "timeline.pause",`
- **Tratador:** `src/app/commands.ts:203` `'timeline.pause': pauseCommand,`
- **Feature:** `src/app/features.ts:201` `'timeline-preview': registerFeature('timeline-preview'),`
- **Comportamento esperado:** "Pausar" congela a animação onde o indicador de reprodução está: o cenário mede `animation-play-state: paused` no elemento, que segue nomeando a animação. A ação escreve apenas o estado do editor: não muda o documento e não entra na história (sem passo de undo).

## REQ-0113 — timeline.stop
- **Onde:** `manifest/commands/animation.json:948` `"id": "timeline.stop",`
- **Tratador:** `src/app/commands.ts:204` `'timeline.stop': stopCommand,`
- **Feature:** `src/app/features.ts:201` `'timeline-preview': registerFeature('timeline-preview'),`
- **Comportamento esperado:** "Parar" devolve o elemento aos estilos próprios: o cenário mede `animation-name: none` no elemento e o aviso é `status.timeline.stopped`. A ação escreve apenas o estado do editor: não muda o documento e não entra na história (sem passo de undo).

## REQ-0114 — timeline.toggleLoop
- **Onde:** `manifest/commands/animation.json:992` `"id": "timeline.toggleLoop",`
- **Tratador:** `src/app/commands.ts:205` `'timeline.toggleLoop': toggleLoopCommand,`
- **Feature:** `src/app/features.ts:201` `'timeline-preview': registerFeature('timeline-preview'),`
- **Comportamento esperado:** "Repetir" liga e desliga a repetição da reprodução; com ela ligada o cenário mede `animation-iteration-count: infinite` no elemento que reproduz e o aviso é `status.timeline.loopOn` (ao desligar, `status.timeline.loopOff`). A ação escreve apenas o estado do editor: não muda o documento e não entra na história (sem passo de undo).

# Domínio `assistant`

14 comandos, REQ-0201 a REQ-0214, na ordem de `manifest/commands/assistant.json`. Todos vêm da feature `assistant-chat` (`manifest/features/22-assistant.json`), cujo intent é operar um assistente pareado localmente pelo catálogo real de comandos. Nenhum deles entra na pilha de desfazer (`"undoable": false` no manifesto).

## REQ-0201 — assistant.setModel
- **Onde:** `manifest/commands/assistant.json:5` `"id": "assistant.setModel",`
- **Tratador:** `src/app/commands.ts:178` `'assistant.setModel': setAssistantModel,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** A pessoa escolhe o modelo do serviço no campo "Modelo" (`assistant.model`) das preferências. O cenário `a-model-is-chosen-in-the-preferences` envia o identificador pelo campo `assistant-model` e espera o aviso `assistant.modelChanged` ("Modelo alterado. Uma nova conversa será iniciada."), com documento, seleção e histórico intocados (`undoSteps: 0`). A escolha reinicia a conversa: as mensagens anteriores são limpas junto com a troca. O tratador recusa com `assistant.busy` enquanto um turno está em curso e com `assistant.invalidModel` um identificador inválido; o campo envia só o valor e é o tratador quem valida (G3).

## REQ-0202 — assistant.setPreferences
- **Onde:** `manifest/commands/assistant.json:63` `"id": "assistant.setPreferences",`
- **Tratador:** `src/app/commands.ts:179` `'assistant.setPreferences': setAssistantPreferences,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Abre e fecha as preferências do assistente na barra lateral, por duas portas que enviam só o booleano `open`: a porta `assistant-preferences`, rotulada "Preferências do assistente" (`assistant.preferences`), abre (`open: true`), e a porta `assistant-close-preferences`, rotulada "Voltar à conversa" (`assistant.backToChat`), volta à conversa (`open: false`). Os cenários `the-preferences-open-from-the-conversation` e `the-preferences-close-back-to-the-conversation` esperam a região `assistant-panel` desenhada com altura maior que zero depois de cada porta, e nenhum deles escreve no documento, na seleção ou no histórico. As duas portas levam ao mesmo tratador, que grava o booleano (G3).

## REQ-0203 — assistant.attachReference
- **Onde:** `manifest/commands/assistant.json:151` `"id": "assistant.attachReference",`
- **Tratador:** `src/app/commands.ts:180` `'assistant.attachReference': attachAssistantReference,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Anexa uma imagem de referência à conversa. A porta `assistant-reference`, rotulada "Adicionar imagem de referência" (`assistant.reference`), lê o arquivo escolhido; o cenário `a-reference-image-is-added-to-the-next-message` anexa a imagem e espera o aviso `assistant.referenceAdded` ("Imagem de referência adicionada à próxima mensagem."), com documento, seleção e histórico intocados. A imagem anexada fica ligada à mensagem, à espera do envio, e é removida pela porta `assistant-clear-reference` ou pela conversa nova. Arquivo fora dos formatos aceitos (PNG, JPEG, WebP ou GIF) ou do tamanho máximo é recusado com `assistant.invalidImage`.

## REQ-0204 — assistant.clearReference
- **Onde:** `manifest/commands/assistant.json:210` `"id": "assistant.clearReference",`
- **Tratador:** `src/app/commands.ts:181` `'assistant.clearReference': clearAssistantReference,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Remove a imagem de referência anexada. A porta `assistant-clear-reference`, rotulada "Remover referência" (`assistant.clearReference`), aparece junto da prévia da imagem; o cenário `a-reference-image-is-removed` anexa, remove e espera documento, seleção, histórico e feedback intocados (`undoSteps: 0`).

## REQ-0205 — assistant.editKey
- **Onde:** `manifest/commands/assistant.json:262` `"id": "assistant.editKey",`
- **Tratador:** `src/app/commands.ts:182` `'assistant.editKey': editAssistantKey,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Registra a digitação da chave do serviço no campo "Chave do serviço" (`assistant.key`) das preferências sem escrever em lugar nenhum. O cenário `typing-the-service-key-writes-nothing-anywhere` digita um valor e espera documento, seleção, histórico e feedback intocados. A chave é segredo: não entra no estado do projeto, nos rascunhos nem no histórico de comandos, e vive no cofre deste dispositivo.

## REQ-0206 — assistant.send
- **Onde:** `manifest/commands/assistant.json:320` `"id": "assistant.send",`
- **Tratador:** `src/app/commands.ts:183` `'assistant.send': sendAssistant,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Envia a mensagem da conversa ao assistente, por duas portas que levam ao mesmo tratador: o botão "Enviar" (`assistant.send`) e a tecla Ctrl+Enter no campo da conversa (porta `send-key`, contexto `assistant-input`). O cenário `a-message-is-sent-and-answered` digita o texto, envia e espera o aviso `assistant.finished` ("Turno do assistente concluído. Desfazer restaura a página anterior."), com documento, seleção e histórico intocados pelo cenário. O tratador recusa com `assistant.busy` durante um turno, `assistant.keyRequired` sem chave salva, `assistant.connectionRequired` sem Companion conectado e `assistant.emptyInput` sem texto digitado e sem imagem de referência. As alterações que o turno faz na página passam pelos comandos reais do editor, em um grupo de desfazer próprio (G1).
- **Divergência:** com imagem de referência anexada e sem texto digitado, o botão Enviar fica indisponível (`src/editor/assistant/surface.tsx:15` `door('assistant-send', { disabled: !configured || !draft.trim() })`) e não dispara o comando, enquanto o tratador aceita o envio nesse estado (`src/editor/assistant/state.ts:57` `if (!current.draft.trim() && current.reference === null)`) e a tecla do campo despacha o comando pelo caminho comum das teclas (`src/editor/input/keymap.ts:531` `if (clipboard === undefined) dispatch(binding.command.id, args);`); o intent pede enviar texto ou imagem de referência (`manifest/features/22-assistant.json:32` `"Pair Companion, select this editor session and send text or a reference image."`), e G3 pede que todas as portas do comando deem o mesmo resultado no mesmo estado.

## REQ-0207 — assistant.cancel
- **Onde:** `manifest/commands/assistant.json:392` `"id": "assistant.cancel",`
- **Tratador:** `src/app/commands.ts:184` `'assistant.cancel': cancelAssistant,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Interrompe o turno em curso. Com o assistente trabalhando, a porta `assistant-cancel`, rotulada "Parar" (`assistant.cancel`), toma o lugar do botão Enviar no rodapé da conversa. O cenário `stop-ends-a-running-turn-and-keeps-the-page` envia, para e espera o aviso `assistant.cancelled` ("O assistente parou. As alterações desta conversa foram desfeitas."), com documento, seleção e histórico consistentes (`undoSteps: 0`).

## REQ-0208 — assistant.connect
- **Onde:** `manifest/commands/assistant.json:444` `"id": "assistant.connect",`
- **Tratador:** `src/app/commands.ts:185` `'assistant.connect': connectAssistant,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Conecta o editor ao Companion. A porta `assistant-bridge-connect`, rotulada "Conectar ao Companion" (`assistant.connect`), abre o seletor do arquivo de conexão criado pelo Companion; o cenário `connecting-reads-the-companion-connection-file` parte do Companion em execução, lê o arquivo e espera o aviso `assistant.connected` ("Companion conectado. Selecione este editor para as ferramentas externas."), sem tocar documento, seleção ou histórico. A porta fica indisponível enquanto um turno está em curso.

## REQ-0209 — assistant.disconnect
- **Onde:** `manifest/commands/assistant.json:496` `"id": "assistant.disconnect",`
- **Tratador:** `src/app/commands.ts:186` `'assistant.disconnect': disconnectAssistant,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Encerra a conexão com o Companion. A porta `assistant-bridge-disconnect`, rotulada "Desconectar" (`assistant.disconnect`), fica indisponível sem conexão aberta; o cenário `disconnecting-closes-the-companion-connection` desconecta com o Companion pareado e espera documento, seleção e histórico intocados, sem aviso, e a região `assistant-panel` ainda desenhada.

## REQ-0210 — assistant.saveKey
- **Onde:** `manifest/commands/assistant.json:548` `"id": "assistant.saveKey",`
- **Tratador:** `src/app/commands.ts:187` `'assistant.saveKey': saveAssistantKey,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Guarda a chave do serviço no cofre deste dispositivo, fora do projeto. A porta `assistant-save-key`, rotulada "Salvar chave" (`assistant.saveKey`), entrega o texto do campo de senha; o cenário `the-service-key-is-saved-on-this-device` digita a chave, salva e espera o aviso `assistant.keySaved` ("Sua chave está salva neste dispositivo, fora do projeto."), sem tocar documento, seleção ou histórico. Sem texto no campo, a porta responde `assistant.keyRequired`. A chave não entra no projeto nem nos arquivos exportados.

## REQ-0211 — assistant.deleteKey
- **Onde:** `manifest/commands/assistant.json:600` `"id": "assistant.deleteKey",`
- **Tratador:** `src/app/commands.ts:188` `'assistant.deleteKey': deleteAssistantKey,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Remove a chave salva neste dispositivo. A porta `assistant-delete-key`, rotulada "Remover chave salva" (`assistant.deleteKey`), fica indisponível sem chave salva; o cenário `a-saved-service-key-is-removed` salva, remove e espera o aviso `assistant.keyRemoved` ("Chave do serviço removida."), sem tocar documento, seleção ou histórico.

## REQ-0212 — assistant.selectSession
- **Onde:** `manifest/commands/assistant.json:652` `"id": "assistant.selectSession",`
- **Tratador:** `src/app/commands.ts:189` `'assistant.selectSession': selectAssistantSession,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Aponta as ferramentas externas para este editor. A porta `assistant-select-session`, rotulada "Usar este editor nas ferramentas externas" (`assistant.selectSession`), aparece com o Companion conectado; o cenário `external-tools-are-pointed-at-this-editor` aciona a porta e espera o aviso `assistant.sessionSelected` ("As ferramentas externas agora usam este editor."), sem tocar documento, seleção ou histórico.

## REQ-0213 — assistant.clearConversation
- **Onde:** `manifest/commands/assistant.json:704` `"id": "assistant.clearConversation",`
- **Tratador:** `src/app/commands.ts:190` `'assistant.clearConversation': clearAssistantConversation,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Começa uma conversa nova. A porta `assistant-clear-conversation`, rotulada "Nova conversa" (`assistant.clearConversation`), limpa as mensagens, o texto por enviar e a imagem de referência; o cenário `a-new-conversation-clears-the-message-and-the-reference` digita, abre a conversa nova e espera documento, seleção, histórico e feedback intocados. O tratador recusa com `assistant.busy` enquanto um turno está em curso.

## REQ-0214 — assistant.update
- **Onde:** `manifest/commands/assistant.json:756` `"id": "assistant.update",`
- **Tratador:** `src/app/commands.ts:191` `'assistant.update': reportAssistant,`
- **Feature:** `src/app/features.ts:10` `'assistant-chat': registerFeature('assistant-chat'),`
- **Comportamento esperado:** Leva para o estado da conversa o texto digitado no campo `assistant-input` (`assistant.input`, "Descreva o que deseja mudar") e o que o Companion reporta do turno. O cenário `the-message-is-typed-in-the-conversation` digita o texto e espera documento, seleção, histórico e feedback intocados. O campo entrega o texto a cada digitação, então o rascunho já está no estado antes de qualquer outra entrada. O valor aceita o texto digitado ou um relatório do turno (ocupado, chave, conexão, sessão, mensagens, rascunho e contagem de tokens); valor fora do formato é recusado com `assistant.failed`.

# Domínio breakpoints — REQ-0301 a REQ-0304

## REQ-0301 — breakpoints.add
- **Onde:** `manifest/commands/breakpoints.json:5` `"id": "breakpoints.add",`
- **Tratador:** `src/app/commands.ts:451` `'breakpoints.add': addBreakpoint,`
- **Feature:** `src/app/features.ts:236` `'project-breakpoints': registerFeature('project-breakpoints'),`
- **Comportamento esperado:** Cria um breakpoint do projeto na largura que o canvas mostra no momento; o rótulo da porta é "Adicionar um breakpoint nesta largura" (`src/i18n/locales/pt-BR.json:3335` `"command.breakpoints.add": "Adicionar um breakpoint nesta largura",`). O breakpoint novo entra na tabela do projeto na posição que a largura dele define, entre o vizinho mais largo e o mais estreito, com o nome vindo da porta ou tirado da largura ("Screen 900" no cenário, em inglês); ele ganha a própria aba e passa a ser o breakpoint mostrado pelo canvas. As duas portas do comando — o item do menu Ver e o botão do diálogo Breakpoints — enviam só a intenção ao mesmo tratador, e a largura sai do estado do canvas; os cenários `a-breakpoint-is-made-at-the-width-the-canvas-shows` e `the-dialog-adds-a-breakpoint-at-the-width-shown` mostram as duas dando o mesmo resultado no mesmo estado (G3). Recusa com `status.breakpoints.widthRange` quando a largura sai da faixa permitida, com `status.breakpoints.widthTaken` quando ela já é a de outro breakpoint e com `status.breakpoints.nameTaken` quando o nome já está em uso; a recusa aparece na barra de status, o documento fica sem alteração e nenhuma entrada de histórico é gravada. Cada adição é uma entrada de undo, e o undo restaura a seleção de antes do comando.

## REQ-0302 — breakpoints.rename
- **Onde:** `manifest/commands/breakpoints.json:90` `"id": "breakpoints.rename",`
- **Tratador:** `src/app/commands.ts:452` `'breakpoints.rename': renameBreakpoint,`
- **Feature:** `src/app/features.ts:236` `'project-breakpoints': registerFeature('project-breakpoints'),`
- **Comportamento esperado:** Dá outro nome ao breakpoint escolhido; o rótulo da porta é "Nome do breakpoint" (`src/i18n/locales/pt-BR.json:3336` `"command.breakpoints.rename": "Nome do breakpoint",`). A porta é o campo de nome do diálogo Breakpoints, e a intenção enviada é o texto do campo: como toda digitação, o rascunho é gravado no contexto em que foi feito (G1) e não se perde quando a seleção ou a camada mudam com a digitação pendente (G2). O nome novo passa a valer no lugar do anterior na tabela do projeto. Recusa com `status.breakpoints.unknown` quando o projeto não tem o breakpoint pedido, com `status.breakpoints.nameEmpty` quando o nome fica vazio e com `status.breakpoints.nameTaken` quando outro breakpoint já mostra esse nome; a recusa aparece na barra de status, o documento fica sem alteração e nenhuma entrada de histórico é gravada. Quando o nome enviado é o que o breakpoint já tem, nada muda e nenhuma entrada de histórico é gravada. Cada renomeação é uma entrada de undo, e o undo restaura a seleção de antes do comando.

## REQ-0303 — breakpoints.setWidth
- **Onde:** `manifest/commands/breakpoints.json:153` `"id": "breakpoints.setWidth",`
- **Tratador:** `src/app/commands.ts:453` `'breakpoints.setWidth': setBreakpointWidth,`
- **Feature:** `src/app/features.ts:236` `'project-breakpoints': registerFeature('project-breakpoints'),`
- **Comportamento esperado:** Dá outra largura ao breakpoint escolhido; o rótulo da porta é "Largura do breakpoint" (`src/i18n/locales/pt-BR.json:3337` `"command.breakpoints.setWidth": "Largura do breakpoint",`). A porta é o campo de largura do diálogo Breakpoints, e a largura nova fica entre as dos vizinhos: no cenário, o Tablet (834 px, entre o Phone de 390 px e o Laptop de 1180 px) aceita 800 px, e 1200 px é recusado com a faixa de 391 a 1179 px na mensagem. Aceita, a mensagem `status.breakpoints.resized` diz até que largura o breakpoint passa a valer. Recusa com `status.breakpoints.unknown` quando o projeto não tem o breakpoint pedido e com `status.breakpoints.widthOrder` quando a largura não fica entre as dos vizinhos; a recusa aparece na barra de status, o documento fica sem alteração e nenhuma entrada de histórico é gravada. Quando a largura enviada é a que o breakpoint já tem, nada muda e nenhuma entrada de histórico é gravada. Cada mudança é uma entrada de undo, e o undo restaura a seleção de antes do comando.

## REQ-0304 — breakpoints.remove
- **Onde:** `manifest/commands/breakpoints.json:215` `"id": "breakpoints.remove",`
- **Tratador:** `src/app/commands.ts:454` `'breakpoints.remove': removeBreakpoint,`
- **Feature:** `src/app/features.ts:236` `'project-breakpoints': registerFeature('project-breakpoints'),`
- **Comportamento esperado:** Remove o breakpoint escolhido, com os estilos definidos nele; o rótulo da porta é "Remover o breakpoint" (`src/i18n/locales/pt-BR.json:3338` `"command.breakpoints.remove": "Remover o breakpoint",`). A porta envia, além do breakpoint, o destino dos estilos definidos ali: descartar (`discard`), mover para o vizinho mais largo (`wider`) ou mover para o vizinho mais estreito (`narrower`). Os estilos definidos no breakpoint fazem parte do contexto dele (G1): descartar tira os estilos, e mover os passa para o vizinho — no cenário do Tablet, para o Phone (mais estreito) ou para o Laptop (mais largo). A mensagem diz o que houve: `status.breakpoints.removed` quando os estilos saem junto com o breakpoint e `status.breakpoints.removedInto` quando eles vão para outro. Recusa com `status.breakpoints.unknown` quando o projeto não tem o breakpoint pedido, com `status.breakpoints.baseStays` quando o escolhido é a base, com `status.breakpoints.usedByMotion` quando um movimento só roda nele ou começa nele e com `status.breakpoints.noNarrower` quando não há vizinho mais estreito para receber os estilos; a recusa aparece na barra de status, o documento fica sem alteração e nenhuma entrada de histórico é gravada. Cada remoção é uma entrada de undo, e o undo restaura a seleção de antes do comando.

# Requisitos — domínio capture

## REQ-0401 — capture.edit
- **Onde:** `manifest/commands/capture.json:5` `"id": "capture.edit",`
- **Tratador:** `src/app/commands.ts:217` `'capture.edit': editCaptureCommand,`
- **Feature:** `src/app/features.ts:247` `'capture-url': registerFeature('capture-url'),`
- **Comportamento esperado:** A pessoa aplica uma edição ao conteúdo capturado de uma página, na funcionalidade capture-url, intitulada "Abrir qualquer endereço da web como página do projeto" (`src/i18n/locales/pt-BR.json:3573` `"feature.captureUrl": "Abrir qualquer endereço da web como página do projeto",`). O rótulo do comando em pt-BR é "Aplicar edição capturada" (`src/i18n/locales/pt-BR.json:3546` `"command.capture.edit": "Aplicar edição capturada",`). A edição é uma das cinco operações — text, attribute, insert, remove e move — sobre o nó de destino (target), com os campos name, value, parent e index conforme a operação: editar o texto de um nó, editar um atributo seguro, inserir conteúdo, mover ou remover. A alteração grava na árvore capturada da página e chega ao documento como uma transação desfazível (undoable, transaction per-dispatch, coalesce none), com uma entrada de undo; sem mudança não entra no histórico (noChange no-entry) e o undo volta a seleção ao estado anterior ao comando (undoRestoresSelection before-command). O cenário "captured-text-field-keeps-a-real-json-edit" grava o valor novo no nó de texto da captura e o cenário "captured-attribute-apply-keeps-a-real-json-edit" acrescenta o atributo ao elemento; os dois terminam com o aviso "Conteúdo capturado salvo." (`src/i18n/locales/pt-BR.json:3567` `"status.capture.edited": "Conteúdo capturado salvo.",`). O manifesto declara estas recusas: o nó não existe mais — "O elemento capturado não está mais nesta página." (`src/i18n/locales/pt-BR.json:3563` `"status.capture.nodeMissing": "O elemento capturado não está mais nesta página.",`); a edição não se aplica ao nó — "Esta edição não se aplica ao elemento capturado." (`src/i18n/locales/pt-BR.json:3564` `"status.capture.invalidEdit": "Esta edição não se aplica ao elemento capturado.",`); o atributo poderia executar código — "Este atributo capturado poderia executar código inseguro e foi recusado." (`src/i18n/locales/pt-BR.json:3566` `"status.capture.unsafeEdit": "Este atributo capturado poderia executar código inseguro e foi recusado.",`). As áreas opacas de pintura (canvas, vídeo e quadro) usam um fallback de imagem explícito cujo conteúdo interno não é editável: "Esta área é uma imagem capturada. É possível editar sua caixa e origem, mas o conteúdo interno não está disponível." (`src/i18n/locales/pt-BR.json:3552` `"capture.editor.paintFallback": "Esta área é uma imagem capturada. É possível editar sua caixa e origem, mas o conteúdo interno não está disponível.",`). As portas do comando entregam a mesma intenção no mesmo estado e convergem no mesmo tratador (G3); canvas e exportação renderizam a mesma árvore JSON capturada na largura observada (G7).

## REQ-0402 — capture.select
- **Onde:** `manifest/commands/capture.json:140` `"id": "capture.select",`
- **Tratador:** `src/app/commands.ts:218` `'capture.select': selectCapturedCommand,`
- **Feature:** `src/app/features.ts:247` `'capture-url': registerFeature('capture-url'),`
- **Comportamento esperado:** A pessoa seleciona um elemento capturado, pelo item do inspetor de captura ou por um clique no canvas, sem entrar na seleção de autoria — o cenário "a-captured-node-is-selected-without-entering-authored-selection" mantém a seleção de elementos vazia e o histórico sem passos. O rótulo do comando em pt-BR é "Selecionar elemento capturado" (`src/i18n/locales/pt-BR.json:3547` `"command.capture.select": "Selecionar elemento capturado",`). A confirmação nomeia o nó de destino — "text" para um nó de texto e "p" para um parágrafo, no cenário "a-press-on-a-captured-element-selects-it-on-the-canvas" — com o aviso "Seleção: {name}." (`src/i18n/locales/pt-BR.json:1930` `"status.selected": "Seleção: {name}.",`). O comando não altera o documento e não é desfazível (undoable false); o inspetor de captura fica visível com largura maior que 200, conforme os cenários. O manifesto declara a recusa de nó inexistente — "O elemento capturado não está mais nesta página." (`src/i18n/locales/pt-BR.json:3563` `"status.capture.nodeMissing": "O elemento capturado não está mais nesta página.",`).

## REQ-0501 — Corrigir uma verificação
- **Onde:** `manifest/commands/checks.json:5` `"id": "checks.applyFix",`
- **Tratador:** `src/app/commands.ts:505` `'checks.applyFix': fixCheck,`
- **Feature:** `src/app/features.ts:177` `'accessibility-checks': registerFeature('accessibility-checks'),`
- **Comportamento esperado:** Cada aviso listado no painel Verificações (a regra, o elemento e a correção sugerida) traz o botão da correção daquela regra, e o botão aplica no elemento do aviso o que a regra pede: o formulário sem botão de envio ganha um botão no fim dos filhos e a seleção vai para ele; o título que pula um nível recebe o nível seguinte ao do título anterior e segue selecionado; a imagem sem texto Alt, a imagem sem Origem, o quadro sem Título e o link sem endereço ficam selecionados e o campo do atributo correspondente (texto Alt, Origem, Título, endereço) abre no inspetor, sem mudança no documento. As seis portas enviam ao mesmo tratador só o elemento e a regra (G3). Cada aplicação grava uma entrada de desfazer que devolve a seleção de antes do comando; quando nada muda, nenhuma entrada é gravada. Um aviso que o documento não tem mais (já resolvido, ou o elemento removido) é recusado (`status.stale`). As verificações nunca bloqueiam a edição nem a exportação, e a lista se atualiza depois de cada comando.

## REQ-0601 — clipboard.copy (Copiar)
- **Onde:** `manifest/commands/clipboard.json:5` `"id": "clipboard.copy",`
- **Tratador:** `src/app/commands.ts:206` `'clipboard.copy': copyCommand,`
- **Feature:** `src/app/features.ts:36` `'clipboard-copy-paste': registerFeature('clipboard-copy-paste'),`
- **Recusa declarada:** `manifest/commands/clipboard.json:12` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** A cópia (Ctrl+C, menu de contexto, menu Editar e barra de comandos) grava o elemento selecionado na área de transferência do sistema no formato de elemento do app — a subárvore com textos e estilos — e mantém a cópia própria do editor; a intenção registra que a leitura da área de transferência do sistema depois do Ctrl+C devolve esse elemento e que, com a área de transferência do navegador ilegível (permissão negada), o colar ainda encontra essa cópia. A feature clipboard-cut-system acrescenta à cópia a gravação de text/html do markup exportado do elemento com as suas regras de CSS, ao lado do formato do app, sem atributos do editor, ids gerados pelo editor nem estilos em linha. Sem seleção o comando é recusado com `refusal.nothingSelected` e o documento não muda (cenário copy-with-nothing-selected-is-refused). A cópia não entra no histórico (history.undoable false). As quatro portas enviam a mesma intenção e dão o mesmo resultado no mesmo estado (G3).

## REQ-0602 — clipboard.paste (Colar)
- **Onde:** `manifest/commands/clipboard.json:109` `"id": "clipboard.paste",`
- **Tratador:** `src/app/commands.ts:207` `'clipboard.paste': pasteCommand,`
- **Feature:** `src/app/features.ts:36` `'clipboard-copy-paste': registerFeature('clipboard-copy-paste'),`
- **Comportamento esperado:** O colar (Ctrl+V, menu de contexto, menu Editar e barra de comandos) lê a área de transferência do sistema: com um contêiner selecionado a cópia entra como último filho dele (aviso `status.pasted.inside`); com um elemento que não é contêiner a cópia entra logo depois dele (aviso `status.pasted.after`). A subárvore colada ganha ids novos e nomes únicos e mantém os mesmos estilos e o mesmo texto da origem; o elemento colado fica selecionado (as vistas derivam a seleção da store, G6) e cada colar é um passo de desfazer (um passo nos cenários). Com a cópia vazia o comando é recusado com `status.paste.empty`, sem mudar o documento nem a seleção (cenário paste-with-an-empty-clipboard-is-refused). Com a área de transferência do navegador negada, o colar encontra a cópia própria do editor (cenário paste-finds-the-editors-own-copy-when-the-browser-denies-the-clipboard). As quatro portas dão o mesmo resultado no mesmo estado (G3).

## REQ-0603 — clipboard.cut (Recortar)
- **Onde:** `manifest/commands/clipboard.json:231` `"id": "clipboard.cut",`
- **Tratador:** `src/app/commands.ts:208` `'clipboard.cut': cutCommand,`
- **Feature:** `src/app/features.ts:181` `'clipboard-cut-system': registerFeature('clipboard-cut-system'),`
- **Recusa declarada:** `manifest/commands/clipboard.json:238` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** O recorte (Ctrl+X, menu de contexto, menu Editar e barra de comandos) copia o elemento para a área de transferência do sistema e o remove do documento como um único passo de desfazer, com o aviso `status.cut`; a intenção registra que o Recortar aparece no menu de contexto e no menu Editar. O que foi recortado pode ser colado de volta a partir do sistema (cenário the-cut-heading-pastes-back-from-the-system-clipboard). Elemento trancado é recusado com `status.locked.delete`, sem mudar o documento (cenário cutting-a-locked-element-is-refused). Depois do recorte a seleção passa para o elemento seguinte. As portas dão o mesmo resultado no mesmo estado (G3).

## REQ-0604 — clipboard.copyStyle (Copiar estilo)
- **Onde:** `manifest/commands/clipboard.json:339` `"id": "clipboard.copyStyle",`
- **Tratador:** `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,`
- **Feature:** `src/app/features.ts:182` `'copy-paste-styles': registerFeature('copy-paste-styles'),`
- **Recusa declarada:** `manifest/commands/clipboard.json:346` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** O Copiar estilo (Ctrl+Alt+C, menu de contexto, menu Editar e barra de comandos) põe todos os valores de estilo do elemento na área de transferência do sistema, no formato do app, com o aviso `status.style.copied`; o documento e o histórico não mudam (os cenários esperam zero passos de desfazer) e a seleção permanece. Sem seleção o comando é recusado com `refusal.nothingSelected`. As quatro portas dão o mesmo resultado no mesmo estado (G3).

## REQ-0605 — clipboard.pasteStyle (Colar estilo)
- **Onde:** `manifest/commands/clipboard.json:442` `"id": "clipboard.pasteStyle",`
- **Tratador:** `src/app/commands.ts:210` `'clipboard.pasteStyle': pasteStyleCommand,`
- **Feature:** `src/app/features.ts:182` `'copy-paste-styles': registerFeature('copy-paste-styles'),`
- **Recusa declarada:** `manifest/commands/clipboard.json:455` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** O Colar estilo (Ctrl+Alt+V, menu de contexto, menu Editar e barra de comandos) substitui os valores de estilo do alvo pelos valores copiados, num único passo de desfazer, com o aviso `status.style.pasted`; texto, filhos e atributos do alvo permanecem; a intenção registra que os dois comandos de estilo ficam no menu de contexto e no menu Editar com os seus atalhos. Com a cópia vazia o comando é recusado com `status.paste.empty`, sem mudar o documento nem a seleção (cenário pasting-a-style-with-an-empty-clipboard-is-refused). As quatro portas dão o mesmo resultado no mesmo estado (G3).

# Requisitos — domínio content

## REQ-0701 — data.select
- **Onde:** `manifest/commands/content.json:5` `"id": "data.select",`
- **Tratador:** `src/app/commands.ts:152` `'data.select': selectCollection,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa escolhe, na aba de coleções do painel Dados, qual coleção a grade mostra, na funcionalidade data-collections, intitulada "Coleções: campos, itens e consultas" (`src/i18n/locales/pt-BR.json:3106` `"feature.dataCollections": "Coleções: campos, itens e consultas",`); o rótulo do comando em pt-BR é "Mostrar a coleção" (`src/i18n/locales/pt-BR.json:3111` `"command.data.select": "Mostrar a coleção",`). A escolha diz quantos itens a coleção tem — o cenário "showing-a-collection-says-how-many-items-it-holds" termina com "{collection}: {count}." (`src/i18n/locales/pt-BR.json:3324` `"status.data.shown": "{collection}: {count}.",`) —, o documento não muda e a escolha não entra no desfazer (undoable false; zero passos de undo no cenário).

## REQ-0702 — data.setQuery
- **Onde:** `manifest/commands/content.json:56` `"id": "data.setQuery",`
- **Tratador:** `src/app/commands.ts:153` `'data.setQuery': setQuery,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa filtra, ordena e limita os itens da coleção mostrada; o rótulo em pt-BR é "Filtrar, ordenar e limitar os itens" (`src/i18n/locales/pt-BR.json:3112` `"command.data.setQuery": "Filtrar, ordenar e limitar os itens",`). As oito portas do painel (campo do filtro, condição, valor a comparar, ordenar por, depois por, pular, mostrar no máximo e limpar o filtro e a ordem) mandam ao mesmo tratador só a parte e o valor (G3); a grade passa a mostrar a contagem "{collection} mostra {count} de {total}." (`src/i18n/locales/pt-BR.json:3325` `"status.data.queryApplied": "{collection} mostra {count} de {total}.",`). O pular e o limite levam números inteiros a partir de 0; um valor que não é inteiro é recusado e nada muda: "O pular e o limite de {collection} aceitam números inteiros a partir de 0." (`src/i18n/locales/pt-BR.json:3261` `"status.data.badCount": "O pular e o limite de {collection} aceitam números inteiros a partir de 0.",`). A consulta não entra no desfazer (undoable false; zero passos em todos os cenários, inclusive no que limpa o filtro e a ordem).

## REQ-0703 — data.createCollection
- **Onde:** `manifest/commands/content.json:324` `"id": "data.createCollection",`
- **Tratador:** `src/app/commands.ts:154` `'data.createCollection': createCollectionCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa cria uma coleção nova pelo botão do painel; o rótulo em pt-BR é "Nova coleção" (`src/i18n/locales/pt-BR.json:3113` `"command.data.createCollection": "Nova coleção",`). A coleção nasce com um campo de texto (o cenário "a-new-collection-starts-with-one-text-field" espera um campo name de tipo text), o aviso é "Coleção {name} criada." (`src/i18n/locales/pt-BR.json:3286` `"status.data.created": "Coleção {name} criada.",`) e a criação é uma etapa de desfazer. Nome vazio ou repetido é recusado sem alterar nada: "Uma coleção precisa de um nome." (`src/i18n/locales/pt-BR.json:3254` `"status.data.nameEmpty": "Uma coleção precisa de um nome.",`) e "Já existe uma coleção chamada {name}." (`src/i18n/locales/pt-BR.json:3255` `"status.data.nameTaken": "Já existe uma coleção chamada {name}.",`).

## REQ-0704 — data.renameCollection
- **Onde:** `manifest/commands/content.json:381` `"id": "data.renameCollection",`
- **Tratador:** `src/app/commands.ts:155` `'data.renameCollection': renameCollectionCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa renomeia a coleção pelo campo do nome, sem perder os itens — o cenário "a-renamed-collection-keeps-its-list" mantém a lista —, e o aviso é "A coleção agora se chama {name}." (`src/i18n/locales/pt-BR.json:3287` `"status.data.renamed": "A coleção agora se chama {name}.",`). O rótulo em pt-BR é "Renomear a coleção" (`src/i18n/locales/pt-BR.json:3114` `"command.data.renameCollection": "Renomear a coleção",`). A renomeação é uma etapa de desfazer; o campo entrega o texto digitado no contexto em que a digitação começou, mesmo na digitação pendente (G1, G2). Nome vazio ou repetido é recusado sem alterar nada ("Uma coleção precisa de um nome." e "Já existe uma coleção chamada {name}.").

## REQ-0705 — data.deleteCollection
- **Onde:** `manifest/commands/content.json:444` `"id": "data.deleteCollection",`
- **Tratador:** `src/app/commands.ts:156` `'data.deleteCollection': deleteCollectionCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa exclui a coleção pela lixeira do cartão da coleção, e a exclusão só acontece depois da confirmação; o rótulo em pt-BR é "Excluir a coleção" (`src/i18n/locales/pt-BR.json:3115` `"command.data.deleteCollection": "Excluir a coleção",`) e o aviso da confirmação é "Excluir a coleção {name}? Páginas e listas ligadas a ela: {count}. O conteúdo delas fica como está." (`src/i18n/locales/pt-BR.json:3248` `"dialog.deleteCollection.message": "Excluir a coleção {name}? Páginas e listas ligadas a ela: {count}. O conteúdo delas fica como está.",`). Os cartões das páginas ficam como estão — o cenário "a-collection-is-deleted-after-the-confirmation-its-cards-staying" mantém os cartões preenchidos na página e remove a coleção — e o aviso final é "Coleção {name} excluída." (`src/i18n/locales/pt-BR.json:3288` `"status.data.deleted": "Coleção {name} excluída.",`). A exclusão é uma etapa de desfazer.

## REQ-0706 — data.addField
- **Onde:** `manifest/commands/content.json:503` `"id": "data.addField",`
- **Tratador:** `src/app/commands.ts:157` `'data.addField': addFieldCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa acrescenta um campo à coleção pelo nome e pelo tipo (texto, texto rico, imagem, número, data, ligação ou booleano); o rótulo em pt-BR é "Adicionar um campo" (`src/i18n/locales/pt-BR.json:3116` `"command.data.addField": "Adicionar um campo",`) e o aviso é "Campo {label} adicionado a {collection}." (`src/i18n/locales/pt-BR.json:3289` `"status.data.fieldAdded": "Campo {label} adicionado a {collection}.",`). A adição é uma etapa de desfazer. Nome vazio ou repetido é recusado sem alterar nada: "Um campo de {collection} precisa de um nome." (`src/i18n/locales/pt-BR.json:3252` `"status.data.fieldLabelEmpty": "Um campo de {collection} precisa de um nome.",`) e "{collection} já tem um campo chamado {label}." (`src/i18n/locales/pt-BR.json:3253` `"status.data.fieldLabelTaken": "{collection} já tem um campo chamado {label}.",`).

## REQ-0707 — data.setField
- **Onde:** `manifest/commands/content.json:574` `"id": "data.setField",`
- **Tratador:** `src/app/commands.ts:158` `'data.setField': setFieldCommand,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa altera o rótulo ou o tipo de um campo; o rótulo em pt-BR é "Alterar o campo" (`src/i18n/locales/pt-BR.json:3117` `"command.data.setField": "Alterar o campo",`), renomear mantém as ligações (cenário "a-field-is-renamed-and-its-bindings-stay") e o aviso é "Campo {label} de {collection} alterado." (`src/i18n/locales/pt-BR.json:3290` `"status.data.fieldChanged": "Campo {label} de {collection} alterado.",`). Trocar o tipo reescreve os valores para a forma do tipo (cenário "a-field-takes-a-type-every-value-reads-as"); um valor que o tipo novo não aceita recusa a troca inteira, nomeando a linha e a coluna: "Linha {row} de {collection}: “{value}” em {column} não é um valor do tipo {type}. Nada foi alterado." (`src/i18n/locales/pt-BR.json:3256` `"status.data.badValue": "Linha {row} de {collection}: “{value}” em {column} não é um valor do tipo {type}. Nada foi alterado.",`). Cada alteração é uma etapa de desfazer; o rótulo digitado é gravado no contexto da digitação (G1, G2).

## REQ-0708 — data.removeField
- **Onde:** `manifest/commands/content.json:689` `"id": "data.removeField",`
- **Tratador:** `src/app/commands.ts:159` `'data.removeField': removeFieldCommand,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa remove um campo não usado pela lixeira do campo; o rótulo em pt-BR é "Remover o campo" (`src/i18n/locales/pt-BR.json:3118` `"command.data.removeField": "Remover o campo",`) e o aviso é "Campo {label} removido de {collection}." (`src/i18n/locales/pt-BR.json:3293` `"status.data.fieldRemoved": "Campo {label} removido de {collection}.",`). A remoção é uma etapa de desfazer (o cenário "an-unused-field-is-removed" contabiliza duas: a adição de prova e a remoção). Um campo usado por ligações, filtros ou ordens é recusado nomeando os usos, sem alterar nada e sem entrada no desfazer: "{label} de {collection} é usado em {count} (ligações, filtros ou ordens). Remova-os primeiro." (`src/i18n/locales/pt-BR.json:3291` `"status.data.fieldInUse": "{label} de {collection} é usado em {count} (ligações, filtros ou ordens). Remova-os primeiro.",`).

## REQ-0709 — data.addItem
- **Onde:** `manifest/commands/content.json:752` `"id": "data.addItem",`
- **Tratador:** `src/app/commands.ts:160` `'data.addItem': addItemCommand,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa acrescenta uma linha à coleção pelo botão do painel; o rótulo em pt-BR é "Adicionar um item" (`src/i18n/locales/pt-BR.json:3119` `"command.data.addItem": "Adicionar um item",`), o aviso é "Linha {row} adicionada a {collection}." (`src/i18n/locales/pt-BR.json:3294` `"status.data.itemAdded": "Linha {row} adicionada a {collection}.",`), a linha nova ganha o cartão correspondente (cenário "an-added-item-gets-its-card") e a adição é uma etapa de desfazer.

## REQ-0710 — data.setCell
- **Onde:** `manifest/commands/content.json:816` `"id": "data.setCell",`
- **Tratador:** `src/app/commands.ts:161` `'data.setCell': setCellCommand,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa digita um valor numa célula da grade; o rótulo em pt-BR é "Alterar o valor" (`src/i18n/locales/pt-BR.json:3120` `"command.data.setCell": "Alterar o valor",`), o valor é guardado na forma canônica do tipo do campo e chega ao cartão (cenário "a-typed-value-reaches-its-card"), com o aviso "{column} da linha {row} de {collection} alterado." (`src/i18n/locales/pt-BR.json:3295` `"status.data.cellSet": "{column} da linha {row} de {collection} alterado.",`). Um valor que o tipo do campo não aceita recusa a gravação nomeando a linha e a coluna, sem alterar nada: "Linha {row} de {collection}: “{value}” em {column} não é um valor do tipo {type}. Nada foi alterado." (`src/i18n/locales/pt-BR.json:3256` `"status.data.badValue": "Linha {row} de {collection}: “{value}” em {column} não é um valor do tipo {type}. Nada foi alterado.",`). Cada gravação é uma etapa de desfazer; a digitação pendente grava no contexto em que começou (G1, G2).

## REQ-0711 — data.deleteItems
- **Onde:** `manifest/commands/content.json:895` `"id": "data.deleteItems",`
- **Tratador:** `src/app/commands.ts:162` `'data.deleteItems': deleteItemsCommand,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa exclui o item pela lixeira do cartão; o rótulo em pt-BR é "Excluir o item" (`src/i18n/locales/pt-BR.json:3121` `"command.data.deleteItems": "Excluir o item",`), o aviso é "{count} de {collection} excluídos." (`src/i18n/locales/pt-BR.json:3296` `"status.data.itemsDeleted": "{count} de {collection} excluídos.",`), o cartão daquele item some da página (cenário "a-deleted-item-takes-its-card-away") e a exclusão é uma etapa de desfazer.

## REQ-0712 — data.moveItem
- **Onde:** `manifest/commands/content.json:964` `"id": "data.moveItem",`
- **Tratador:** `src/app/commands.ts:163` `'data.moveItem': moveItemCommand,`
- **Feature:** `src/app/features.ts:231` `'data-collections': registerFeature('data-collections'),`
- **Comportamento esperado:** A pessoa move o item para cima ou para baixo pelas setas do cartão; o rótulo em pt-BR é "Mover o item" (`src/i18n/locales/pt-BR.json:3122` `"command.data.moveItem": "Mover o item",`). As duas portas mandam ao mesmo tratador o item e o destino (G3), o cartão acompanha (cenários "an-item-moved-up-moves-its-card" e "an-item-moved-down-moves-its-card") e o aviso é "Item movido para a linha {row} de {collection}." (`src/i18n/locales/pt-BR.json:3298` `"status.data.itemMoved": "Item movido para a linha {row} de {collection}.",`). Cada movimento é uma etapa de desfazer.

## REQ-0713 — data.preview
- **Onde:** `manifest/commands/content.json:1064` `"id": "data.preview",`
- **Tratador:** `src/app/commands.ts:164` `'data.preview': previewFile,`
- **Feature:** `src/app/features.ts:232` `'data-import': registerFeature('data-import'),`
- **Comportamento esperado:** A pessoa importa um arquivo de dados — CSV, TSV, JSON ou XLSX — na funcionalidade data-import, intitulada "Importar CSV, TSV, JSON e XLSX" (`src/i18n/locales/pt-BR.json:3107` `"feature.dataImport": "Importar CSV, TSV, JSON e XLSX",`); o rótulo em pt-BR é "Importar um arquivo de dados (CSV, TSV, JSON, XLSX)" (`src/i18n/locales/pt-BR.json:3123` `"command.data.preview": "Importar um arquivo de dados (CSV, TSV, JSON, XLSX)",`). O arquivo é mostrado em prévia antes de qualquer alteração — o cenário "a-file-is-previewed-before-anything-changes" fecha com zero passos de undo — com o aviso "{name}: {count} prontas para importar." (`src/i18n/locales/pt-BR.json:3279` `"status.data.previewed": "{name}: {count} prontas para importar.",`). Um arquivo que não dá para ler é recusado nomeando o arquivo e o problema: no cenário "a-file-that-cannot-be-read-is-refused-naming-the-problem" o aviso é "{name} tem uma aspa aberta que nunca se fecha." (`src/i18n/locales/pt-BR.json:3271` `"status.data.fileQuote": "{name} tem uma aspa aberta que nunca se fecha.",`). A prévia não entra no desfazer (undoable false).

## REQ-0714 — data.previewSheet
- **Onde:** `manifest/commands/content.json:1129` `"id": "data.previewSheet",`
- **Tratador:** `src/app/commands.ts:165` `'data.previewSheet': choosePreviewSheet,`
- **Feature:** `src/app/features.ts:232` `'data-import': registerFeature('data-import'),`
- **Comportamento esperado:** Num arquivo com mais de uma planilha, a pessoa escolhe qual delas a prévia mostra; o rótulo em pt-BR é "Mostrar a planilha" (`src/i18n/locales/pt-BR.json:3124` `"command.data.previewSheet": "Mostrar a planilha",`) e o cenário "a-workbook-shows-each-sheet" termina com "Planilha {name}: {count}." (`src/i18n/locales/pt-BR.json:3326` `"status.data.sheetShown": "Planilha {name}: {count}.",`). A escolha não altera o documento nem entra no desfazer (undoable false).

## REQ-0715 — data.previewType
- **Onde:** `manifest/commands/content.json:1179` `"id": "data.previewType",`
- **Tratador:** `src/app/commands.ts:166` `'data.previewType': setPreviewType,`
- **Feature:** `src/app/features.ts:232` `'data-import': registerFeature('data-import'),`
- **Comportamento esperado:** A pessoa escolhe o tipo com que cada coluna do arquivo será importada; o rótulo em pt-BR é "Escolher o tipo da coluna" (`src/i18n/locales/pt-BR.json:3125` `"command.data.previewType": "Escolher o tipo da coluna",`) e o cenário "a-column-takes-the-type-chosen" termina com "{column} será importada como {type}." (`src/i18n/locales/pt-BR.json:3327` `"status.data.columnTyped": "{column} será importada como {type}.",`). A escolha vale para a importação seguinte e não entra no desfazer (undoable false).

## REQ-0716 — data.closePreview
- **Onde:** `manifest/commands/content.json:1242` `"id": "data.closePreview",`
- **Tratador:** `src/app/commands.ts:167` `'data.closePreview': closePreview,`
- **Feature:** `src/app/features.ts:232` `'data-import': registerFeature('data-import'),`
- **Comportamento esperado:** A pessoa fecha a prévia sem importar nada; o rótulo em pt-BR é "Fechar o arquivo" (`src/i18n/locales/pt-BR.json:3126` `"command.data.closePreview": "Fechar o arquivo",`) e o cenário "closing-the-preview-imports-nothing" fecha com o aviso "Prévia de {name} fechada sem importar." (`src/i18n/locales/pt-BR.json:3328` `"status.data.previewClosed": "Prévia de {name} fechada sem importar.",`) e zero passos de undo. O fechamento não altera o documento nem o desfazer (undoable false).

## REQ-0717 — data.importNew
- **Onde:** `manifest/commands/content.json:1286` `"id": "data.importNew",`
- **Tratador:** `src/app/commands.ts:168` `'data.importNew': importNew,`
- **Feature:** `src/app/features.ts:232` `'data-import': registerFeature('data-import'),`
- **Comportamento esperado:** A pessoa importa o arquivo em prévia como uma coleção nova, com o nome digitado; o rótulo em pt-BR é "Importar como nova coleção" (`src/i18n/locales/pt-BR.json:3127` `"command.data.importNew": "Importar como nova coleção",`). O arquivo original entra como está, sem reordenar as colunas (cenário "carlas-original-csv-imports-as-a-new-collection"), e o aviso é "{count} importados para {collection}." (`src/i18n/locales/pt-BR.json:3282` `"status.data.imported": "{count} importados para {collection}.",`). Quando um valor não cabe no tipo escolhido para a coluna, a importação inteira é recusada sem alterar nada: "Linha {row} de {collection}: “{value}” em {column} não é um valor do tipo {type}. Nada foi alterado." (`src/i18n/locales/pt-BR.json:3256` `"status.data.badValue": "Linha {row} de {collection}: “{value}” em {column} não é um valor do tipo {type}. Nada foi alterado.",`). A importação é uma etapa de desfazer.

## REQ-0718 — data.importInto
- **Onde:** `manifest/commands/content.json:1366` `"id": "data.importInto",`
- **Tratador:** `src/app/commands.ts:169` `'data.importInto': importInto,`
- **Feature:** `src/app/features.ts:232` `'data-import': registerFeature('data-import'),`
- **Comportamento esperado:** A pessoa leva as linhas da prévia para uma coleção existente por uma das três portas — "Adicionar as linhas depois dos itens" (`src/i18n/locales/pt-BR.json:3129` `"command.data.importAppend": "Adicionar as linhas depois dos itens",`), "Substituir os itens" (`src/i18n/locales/pt-BR.json:3130` `"command.data.importReplace": "Substituir os itens",`) e "Atualizar pela primeira coluna" (`src/i18n/locales/pt-BR.json:3131` `"command.data.importUpdate": "Atualizar pela primeira coluna",`) — e as três mandam ao mesmo tratador só a coleção e o modo (G3); o rótulo em pt-BR é "Importar para a coleção" (`src/i18n/locales/pt-BR.json:3128` `"command.data.importInto": "Importar para a coleção",`), o aviso é "{count} importados para {collection}, {mode}." (`src/i18n/locales/pt-BR.json:3284` `"status.data.importedInto": "{count} importados para {collection}, {mode}.",`) e cada importação é uma etapa de desfazer. Sem coluna do arquivo com o nome de um campo da coleção, a importação é recusada: "Nenhuma coluna do arquivo tem o nome de um campo de {collection}." (`src/i18n/locales/pt-BR.json:3219` `"status.data.noColumnMatches": "Nenhuma coluna do arquivo tem o nome de um campo de {collection}.",`); para atualizar, a primeira coluna precisa ser um campo que não seja texto rico ("Para atualizar {collection}, a primeira coluna precisa ter o nome de um campo que não seja texto rico." `src/i18n/locales/pt-BR.json:3257` `"status.data.keyNeeded": "Para atualizar {collection}, a primeira coluna precisa ter o nome de um campo que não seja texto rico.",`) e uma chave vazia recusa sem importar: "Linha {row}: {column} está vazio, então não atualiza um item de {collection}. Nada foi importado." (`src/i18n/locales/pt-BR.json:3258` `"status.data.keyEmpty": "Linha {row}: {column} está vazio, então não atualiza um item de {collection}. Nada foi importado.",`).

## REQ-0719 — data.bindElement
- **Onde:** `manifest/commands/content.json:1515` `"id": "data.bindElement",`
- **Tratador:** `src/app/commands.ts:170` `'data.bindElement': bindElementCommand,`
- **Feature:** `src/app/features.ts:233` `'data-binding': registerFeature('data-binding'),`
- **Comportamento esperado:** A pessoa liga a parte escolhida de um elemento a um campo da coleção, dizendo como ela mostra o valor — texto, imagem, alt ou ligação —, na funcionalidade data-binding, intitulada "Ligar campos e preencher listas" (`src/i18n/locales/pt-BR.json:3108` `"feature.dataBinding": "Ligar campos e preencher listas",`). As duas portas — o menu do campo, com rótulo "Ligar um campo" (`src/i18n/locales/pt-BR.json:3132` `"command.data.bindElement": "Ligar um campo",`), e o arraste de uma coluna do painel até a parte — mandam ao mesmo tratador só o nó, o campo e o destino (G3); nos cenários "a-part-shows-the-field-chosen-in-its-menu" e "a-column-dropped-on-a-part-connects-it" o aviso é "{name} mostra {field} como {target}." (`src/i18n/locales/pt-BR.json:3300` `"status.data.bound": "{name} mostra {field} como {target}.",`) e a ligação é uma etapa de desfazer. Quando o elemento não pode mostrar o valor daquele jeito, a ligação é recusada sem alterar nada: "{name} não pode mostrar um valor como {target}." (`src/i18n/locales/pt-BR.json:3299` `"status.data.cannotShow": "{name} não pode mostrar um valor como {target}.",`).

## REQ-0720 — data.fill
- **Onde:** `manifest/commands/content.json:1616` `"id": "data.fill",`
- **Tratador:** `src/app/commands.ts:171` `'data.fill': fillCommand,`
- **Feature:** `src/app/features.ts:233` `'data-binding': registerFeature('data-binding'),`
- **Comportamento esperado:** A pessoa preenche a lista pelo botão "Preencher com dados" (`src/i18n/locales/pt-BR.json:3133` `"command.data.fill": "Preencher com dados",`): a lista passa a repetir o cartão para cada item da coleção, com as fotos encontradas pelo nome do arquivo — cenário "fill-repeats-the-card-for-every-item-photos-found-by-name" —, o aviso é "{name} repete {count} de {collection}." (`src/i18n/locales/pt-BR.json:3305` `"status.data.listFilled": "{name} repete {count} de {collection}.",`) e o preenchimento é uma etapa de desfazer. Um cartão que ainda não mostra nenhum campo é recusado: "{name} ainda não mostra nenhum campo: ligue pelo menos uma das suas partes a um campo primeiro." (`src/i18n/locales/pt-BR.json:3303` `"status.data.noBindings": "{name} ainda não mostra nenhum campo: ligue pelo menos uma das suas partes a um campo primeiro.",`). Uma foto que não corresponde a arquivo do projeto nem a endereço da web recusa o preenchimento nomeando a linha e a coluna, com nada preenchido: "Linha {row} dos dados: “{value}” na coluna {column} não é uma imagem do projeto (pelo caminho ou nome do arquivo) nem um endereço da web. Nada foi preenchido." (`src/i18n/locales/pt-BR.json:2201` `"status.data.imageNotFound": "Linha {row} dos dados: “{value}” na coluna {column} não é uma imagem do projeto (pelo caminho ou nome do arquivo) nem um endereço da web. Nada foi preenchido.",`).

## REQ-0721 — data.unbind
- **Onde:** `manifest/commands/content.json:1700` `"id": "data.unbind",`
- **Tratador:** `src/app/commands.ts:172` `'data.unbind': unbindCommand,`
- **Feature:** `src/app/features.ts:233` `'data-binding': registerFeature('data-binding'),`
- **Comportamento esperado:** A pessoa deixa de seguir a coleção pelo botão "Deixar de seguir a coleção" (`src/i18n/locales/pt-BR.json:3134` `"command.data.unbind": "Deixar de seguir a coleção",`); a lista para de repetir os itens e mantém os cartões como estão — o cenário "an-unbound-list-keeps-its-cards" mantém os cartões preenchidos —, com o aviso "{name} não segue mais {collection}; seus itens ficam como estão." (`src/i18n/locales/pt-BR.json:3307` `"status.data.listUnbound": "{name} não segue mais {collection}; seus itens ficam como estão.",`). A operação é uma etapa de desfazer.

## REQ-0722 — pages.fromNames
- **Onde:** `manifest/commands/content.json:1758` `"id": "pages.fromNames",`
- **Tratador:** `src/app/commands.ts:173` `'pages.fromNames': pagesFromNamesCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:234` `'data-pages': registerFeature('data-pages'),`
- **Comportamento esperado:** A pessoa digita os nomes das páginas novas, um por linha, e as cria a partir da página aberta, na funcionalidade data-pages, intitulada "Páginas a partir de uma página" (`src/i18n/locales/pt-BR.json:3109` `"feature.dataPages": "Páginas a partir de uma página",`); o rótulo em pt-BR é "Criar páginas a partir desta página" (`src/i18n/locales/pt-BR.json:3135` `"command.pages.fromNames": "Criar páginas a partir desta página",`). Cada página é uma cópia nomeada e arquivada como uma duplicada, e a primeira delas abre — no cenário "two-pages-from-a-list-of-names-the-first-opening" as páginas novas ganham arquivos unidade-centro.html e unidade-norte.html e o aviso é "{count} criadas a partir de {name}." (`src/i18n/locales/pt-BR.json:3311` `"status.pages.madeFromNames": "{count} criadas a partir de {name}.",`) —, com uma etapa de desfazer. Sem nenhum nome, a criação é recusada e nada é criado: "Digite pelo menos um nome para as páginas a criar a partir de {name}." (`src/i18n/locales/pt-BR.json:3310` `"status.pages.noNames": "Digite pelo menos um nome para as páginas a criar a partir de {name}.",`). O texto digitado no campo é gravado no contexto em que a digitação começou (G1, G2).

## REQ-0723 — pages.fromCollection
- **Onde:** `manifest/commands/content.json:1822` `"id": "pages.fromCollection",`
- **Tratador:** `src/app/commands.ts:174` `'pages.fromCollection': pagesFromCollectionCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:234` `'data-pages': registerFeature('data-pages'),`
- **Comportamento esperado:** A pessoa cria uma página por item da coleção, escolhendo o campo que nomeia cada página; o rótulo em pt-BR é "Criar uma página por item" (`src/i18n/locales/pt-BR.json:3136` `"command.pages.fromCollection": "Criar uma página por item",`), cada página mostra o seu item — no cenário "a-page-per-item-each-showing-its-item" cada página recebe o item e a ligação passa a apontar para o arquivo da página —, o aviso é "{count} criadas para os itens de {collection}." (`src/i18n/locales/pt-BR.json:3313` `"status.pages.madeFromCollection": "{count} criadas para os itens de {collection}.",`) e a criação é uma etapa de desfazer; a página de um item mantém o próprio arquivo quando o item muda. Um item sem valor no campo escolhido recusa sem criar nada: "Linha {row} de {collection}: {column} está vazio, então sua página não tem nome. Nada foi criado." (`src/i18n/locales/pt-BR.json:3309` `"status.data.emptyName": "Linha {row} de {collection}: {column} está vazio, então sua página não tem nome. Nada foi criado.",`). Uma página já criada para um item não serve de molde: "{name} foi criada para um item: crie as páginas a partir da página de onde ela foi copiada." (`src/i18n/locales/pt-BR.json:3308` `"status.data.templateIsItemPage": "{name} foi criada para um item: crie as páginas a partir da página de onde ela foi copiada.",`).

## REQ-0724 — regions.share
- **Onde:** `manifest/commands/content.json:1893` `"id": "regions.share",`
- **Tratador:** `src/app/commands.ts:175` `'regions.share': shareRegionCommand,`
- **Feature:** `src/app/features.ts:235` `'shared-regions': registerFeature('shared-regions'),`
- **Recusa declarada:** `manifest/commands/content.json:1906` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** A pessoa compartilha o cabeçalho, rodapé ou menu selecionado com as páginas escolhidas e com as páginas criadas depois, na funcionalidade shared-regions, intitulada "Regiões compartilhadas" (`src/i18n/locales/pt-BR.json:3110` `"feature.sharedRegions": "Regiões compartilhadas",`); os cenários "the-header-is-shared-with-every-page-and-the-pages-made-later" e "a-page-made-later-receives-the-shared-header" cobrem as duas coisas. O rótulo em pt-BR é "Compartilhar com páginas" (`src/i18n/locales/pt-BR.json:3137` `"command.regions.share": "Compartilhar com páginas",`) e o aviso é "{name}: compartilhamento com {count}." (`src/i18n/locales/pt-BR.json:3321` `"status.regions.shared": "{name}: compartilhamento com {count}.",`). O compartilhamento é uma etapa de desfazer, e uma edição na região compartilhada aparece em todas as páginas ligadas na mesma etapa de desfazer (cenário "the-menu-changed-once-shows-on-every-page"). O comando exige uma seleção única: com outra seleção vale a recusa declarada, "Isto exige uma seleção única." (`src/i18n/locales/pt-BR.json:1857` `"status.needsSingleSelection": "Isto exige uma seleção única.",`). Um elemento que não está direto dentro da página é recusado — "{name} não está direto dentro da sua página: selecione o próprio cabeçalho, rodapé ou menu." (`src/i18n/locales/pt-BR.json:3316` `"status.regions.notTopLevel": "{name} não está direto dentro da sua página: selecione o próprio cabeçalho, rodapé ou menu.",`) — e sem nenhuma página escolhida nada é compartilhado: "Escolha pelo menos uma página com a qual compartilhar {name}." (`src/i18n/locales/pt-BR.json:3317` `"status.regions.noPages": "Escolha pelo menos uma página com a qual compartilhar {name}.",`).

## REQ-0725 — regions.detach
- **Onde:** `manifest/commands/content.json:1962` `"id": "regions.detach",`
- **Tratador:** `src/app/commands.ts:176` `'regions.detach': detachRegionCommand,`
- **Feature:** `src/app/features.ts:235` `'shared-regions': registerFeature('shared-regions'),`
- **Comportamento esperado:** A pessoa desvincula a página escolhida da região compartilhada pelo botão "Desvincular nesta página" (`src/i18n/locales/pt-BR.json:3138` `"command.regions.detach": "Desvincular nesta página",`); a página fica com a própria cópia, que não segue mais as edições da região — cenário "a-detached-page-keeps-its-own-copy" —, e o aviso é "{name} em {page} não segue mais a região compartilhada." (`src/i18n/locales/pt-BR.json:3322` `"status.regions.detached": "{name} em {page} não segue mais a região compartilhada.",`). A operação é uma etapa de desfazer. Um elemento que não é região compartilhada é recusado: "{name} não é uma região compartilhada." (`src/i18n/locales/pt-BR.json:3318` `"status.regions.notShared": "{name} não é uma região compartilhada.",`).

## REQ-0726 — regions.stopSharing
- **Onde:** `manifest/commands/content.json:2020` `"id": "regions.stopSharing",`
- **Tratador:** `src/app/commands.ts:177` `'regions.stopSharing': stopSharingCommand,`
- **Feature:** `src/app/features.ts:235` `'shared-regions': registerFeature('shared-regions'),`
- **Comportamento esperado:** A pessoa encerra o compartilhamento da região pelo botão "Parar de compartilhar" (`src/i18n/locales/pt-BR.json:3139` `"command.regions.stopSharing": "Parar de compartilhar",`); cada página mantém a sua cópia e deixa de seguir as edições — cenário "stopping-the-sharing-keeps-every-copy" —, e o aviso é "Compartilhamento de {name} encerrado; cada página mantém sua cópia." (`src/i18n/locales/pt-BR.json:3323` `"status.regions.stopped": "Compartilhamento de {name} encerrado; cada página mantém sua cópia.",`). A operação é uma etapa de desfazer. Uma região que não é compartilhada é recusada: "{name} não é uma região compartilhada." (`src/i18n/locales/pt-BR.json:3318` `"status.regions.notShared": "{name} não é uma região compartilhada.",`).

## REQ-0801 — colors.saveSwatch
- **Onde:** `manifest/commands/design-system.json:5` `"id": "colors.saveSwatch",`
- **Tratador:** `src/app/commands.ts:211` `'colors.saveSwatch': saveSwatchCommand,`
- **Feature:** `src/app/features.ts:72` `'color-swatches-eyedropper': registerFeature('color-swatches-eyedropper'),`
- **Comportamento esperado:** o botão "Salvar a atual" do seletor de cor guarda a cor atual entre as cores salvas do projeto, no documento; ela passa a ser listada em todo seletor de cor e continua com o projeto; a gravação é uma única entrada de desfazer, que devolve a seleção de antes do comando e o refazer repõe; a barra de status anuncia `status.swatch.saved` com a cor.

## REQ-0802 — colors.removeSwatch
- **Onde:** `manifest/commands/design-system.json:59` `"id": "colors.removeSwatch",`
- **Tratador:** `src/app/commands.ts:212` `'colors.removeSwatch': removeSwatchCommand,`
- **Feature:** `src/app/features.ts:72` `'color-swatches-eyedropper': registerFeature('color-swatches-eyedropper'),`
- **Comportamento esperado:** o x de uma cor salva tira da lista de cores do projeto a cor apontada pelo índice, sem tocar no valor que o elemento tem; é uma única entrada de desfazer, que devolve a seleção de antes do comando; a barra de status anuncia `status.swatch.removed` com a cor.

## REQ-0803 — tokens.create
- **Onde:** `manifest/commands/design-system.json:113` `"id": "tokens.create",`
- **Tratador:** `src/app/commands.ts:213` `'tokens.create': createToken,`
- **Feature:** `src/app/features.ts:101` `'css-variables-tokens': registerFeature('css-variables-tokens'),`
- **Comportamento esperado:** o botão de nova variável do painel de variáveis cria uma variável do projeto do tipo escolhido (cor, comprimento ou tamanho de fonte) com o nome e o valor dados; a variável entra no documento e passa a ser oferecida nos campos de cor, comprimento e tamanho de fonte ao lado dos valores digitados; é uma entrada de desfazer, que devolve a seleção de antes do comando; a barra de status anuncia `status.tokens.created` com o nome. Nome já usado é recusado com `status.tokens.nameTaken`, um nome que não é nome válido com `status.tokens.badName` e um valor que o tipo não aceita com `status.tokens.invalidValue`, sem mudar o documento.

## REQ-0804 — tokens.update
- **Onde:** `manifest/commands/design-system.json:185` `"id": "tokens.update",`
- **Tratador:** `src/app/commands.ts:214` `'tokens.update': updateToken,`
- **Feature:** `src/app/features.ts:101` `'css-variables-tokens': registerFeature('css-variables-tokens'),`
- **Comportamento esperado:** o campo de valor muda o valor da variável nomeada; todo elemento que a usa (`var(--nome)`) passa a desenhar com o novo valor na mesma transação, como uma entrada de desfazer, que devolve a seleção de antes do comando; a barra de status anuncia `status.tokens.updated` com o nome e o valor; um valor que o tipo da variável não aceita é recusado com `status.tokens.invalidValue`, sem mudar o documento.

## REQ-0805 — tokens.rename
- **Onde:** `manifest/commands/design-system.json:247` `"id": "tokens.rename",`
- **Tratador:** `src/app/commands.ts:225` `'tokens.rename': renameToken,`
- **Feature:** `src/app/features.ts:101` `'css-variables-tokens': registerFeature('css-variables-tokens'),`
- **Comportamento esperado:** o campo de nome renomeia a variável e reescreve, no mesmo passo de desfazer, toda menção a ela no documento, de modo que `var(--antigo)` vira `var(--novo)`; a barra de status anuncia `status.tokens.renamed` com o nome antigo e o novo; nome já usado é recusado com `status.tokens.nameTaken` e um nome que não é nome válido com `status.tokens.badName`, sem mudar o documento.

## REQ-0806 — tokens.delete
- **Onde:** `manifest/commands/design-system.json:310` `"id": "tokens.delete",`
- **Tratador:** `src/app/commands.ts:226` `'tokens.delete': deleteToken,`
- **Feature:** `src/app/features.ts:101` `'css-variables-tokens': registerFeature('css-variables-tokens'),`
- **Comportamento esperado:** apaga a variável nomeada quando nenhum valor do site a usa, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.tokens.deleted` com o nome. Uma variável em uso é recusada com `status.tokens.inUse`, que nomeia a variável e conta os usos, ou com `status.tokens.inUseShared`, sem mudar o documento.

## REQ-0807 — classes.create
- **Onde:** `manifest/commands/design-system.json:368` `"id": "classes.create",`
- **Tratador:** `src/app/commands.ts:227` `'classes.create': createClassCommand,`
- **Feature:** `src/app/features.ts:113` `'shared-style-classes': registerFeature('shared-style-classes'),`
- **Recusa declarada:** `manifest/commands/design-system.json:381` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** salva os estilos próprios do elemento selecionado como uma classe nova com o nome dado: a definição entra em `@classes` com os estilos do breakpoint e do estado atuais, o elemento passa a listar a classe e deixa de guardar esses estilos, numa única entrada de desfazer que devolve a seleção de antes do comando; a exportação escreve a regra da classe e o elemento sem estilo próprio; a barra de status anuncia `status.classes.created` com o elemento e o nome. Sem uma única seleção o comando é recusado com `status.needsSingleSelection`; nome já usado com `status.classes.nameTaken`, nome que não é nome de classe com `status.classes.badName` e elemento trancado com `status.locked.edit`, sem mudar o documento.

## REQ-0808 — classes.apply
- **Onde:** `manifest/commands/design-system.json:426` `"id": "classes.apply",`
- **Tratador:** `src/app/commands.ts:228` `'classes.apply': applyClassCommand,`
- **Feature:** `src/app/features.ts:113` `'shared-style-classes': registerFeature('shared-style-classes'),`
- **Comportamento esperado:** faz os elementos da seleção listarem a classe nomeada; um nome que o projeto ainda não tem cria a definição vazia em `@classes` e aplica a classe, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.classes.applied` com o nome; a exportação leva o elemento a listar a classe no HTML. Nome que não é nome de classe é recusado com `status.classes.badName` e elemento trancado com `status.locked.edit`, sem mudar o documento. As duas portas, o campo do inspetor e a barra de comandos, mandam a mesma intenção ao mesmo tratador (G3).

## REQ-0809 — classes.detach
- **Onde:** `manifest/commands/design-system.json:506` `"id": "classes.detach",`
- **Tratador:** `src/app/commands.ts:229` `'classes.detach': detachClassCommand,`
- **Feature:** `src/app/features.ts:113` `'shared-style-classes': registerFeature('shared-style-classes'),`
- **Comportamento esperado:** o x do chip tira a classe nomeada dos elementos da seleção, de modo que eles deixam de tomar os estilos da classe e voltam aos valores próprios; é uma entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.classes.detached` com o nome; elemento trancado é recusado com `status.locked.edit`, sem mudar o documento.

## REQ-0810 — classes.rename
- **Onde:** `manifest/commands/design-system.json:562` `"id": "classes.rename",`
- **Tratador:** `src/app/commands.ts:230` `'classes.rename': renameClassCommand,`
- **Feature:** `src/app/features.ts:124` `'settings-class-management': registerFeature('settings-class-management'),`
- **Comportamento esperado:** o campo de nome do painel de estilos renomeia a classe na definição e em todo elemento que a lista, no mesmo passo de desfazer; a barra de status anuncia `status.classes.renamed` com o nome antigo e o novo; nome que não é nome de classe é recusado com `status.classes.badName`, nome já usado com `status.classes.nameTaken` e elemento trancado com `status.locked.edit`, sem mudar o documento.

## REQ-0811 — classes.delete
- **Onde:** `manifest/commands/design-system.json:625` `"id": "classes.delete",`
- **Tratador:** `src/app/commands.ts:231` `'classes.delete': deleteClassCommand,`
- **Feature:** `src/app/features.ts:124` `'settings-class-management': registerFeature('settings-class-management'),`
- **Comportamento esperado:** o botão de apagar classe pede confirmação no diálogo `dialog.classes.delete`, com os botões `dialog.delete` e `dialog.cancel`; confirmada, a definição sai do projeto e todo elemento que a lista deixa de listá-la, numa só entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.classes.deleted` com o nome e quantos elementos foram atingidos; elemento trancado é recusado com `status.locked.edit`, sem mudar o documento.

## REQ-0812 — inspector.setStyleTarget
- **Onde:** `manifest/commands/design-system.json:685` `"id": "inspector.setStyleTarget",`
- **Tratador:** `src/app/commands.ts:232` `'inspector.setStyleTarget': setStyleTarget,`
- **Feature:** `src/app/features.ts:113` `'shared-style-classes': registerFeature('shared-style-classes'),`
- **Comportamento esperado:** a barra de seleção do inspetor escolhe se a próxima escrita de estilo cai no elemento selecionado ou numa classe nomeada; com a classe como alvo, o inspetor edita a definição dela e todo elemento que a lista toma a mudança, e o valor próprio do elemento sobrepõe a classe quando o alvo é o elemento, de modo que o inspetor mostra de onde cada valor vem; apontar uma classe que o projeto ainda não tem registra a definição vazia em `@classes`, com a barra de status `status.classes.registered`, como uma entrada de desfazer que devolve o documento e a seleção de antes do comando.

## REQ-0813 — components.startCreate
- **Onde:** `manifest/commands/design-system.json:747` `"id": "components.startCreate",`
- **Tratador:** `src/app/commands.ts:234` `'components.startCreate': openComponentPrompt,`
- **Feature:** `src/app/features.ts:130` `'reusable-components': registerFeature('reusable-components'),`
- **Recusa declarada:** `manifest/commands/design-system.json:760` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** "Criar um componente" abre o pedido do nome a partir do elemento selecionado, sem tocar o documento nem o histórico; a gravação só acontece na confirmação do nome, pelo comando `components.create`. Sem uma única seleção é recusado com `status.needsSingleSelection`; a raiz da página (`status.components.root`), um elemento dentro de uma instância (`status.components.inInstance`), um elemento que contém uma instância (`status.components.holdsInstance`) e um elemento trancado (`status.locked.edit`) são recusados, sem mudar o documento. As duas portas, o menu do contexto e a barra de comandos, mandam a mesma intenção ao mesmo tratador (G3).

## REQ-0814 — components.create
- **Onde:** `manifest/commands/design-system.json:817` `"id": "components.create",`
- **Tratador:** `src/app/commands.ts:233` `'components.create': createComponentCommand,`
- **Feature:** `src/app/features.ts:130` `'reusable-components': registerFeature('reusable-components'),`
- **Recusa declarada:** `manifest/commands/design-system.json:830` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** cria o componente com o nome digitado no pedido a partir do elemento selecionado: a árvore do elemento passa a viver em `@components` e o elemento vira a primeira instância dela, com o próprio e as partes marcados, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.components.created` com o nome. Sem uma única seleção é recusado com `status.needsSingleSelection`; a raiz da página (`status.components.root`), um elemento dentro de uma instância (`status.components.inInstance`), um que contém instâncias (`status.components.holdsInstance`) e um trancado (`status.locked.edit`) são recusados, sem mudar o documento.

## REQ-0815 — components.closePrompt
- **Onde:** `manifest/commands/design-system.json:876` `"id": "components.closePrompt",`
- **Tratador:** `src/app/commands.ts:235` `'components.closePrompt': closeComponentPrompt,`
- **Feature:** `src/app/features.ts:130` `'reusable-components': registerFeature('reusable-components'),`
- **Comportamento esperado:** fecha o pedido do nome do componente, pelo botão de fechar ou pelo Esc no pedido; nada muda no documento nem no histórico, e a seleção fica como está; é o descarte da criação iniciada por `components.startCreate`.

## REQ-0816 — components.insertInstance
- **Onde:** `manifest/commands/design-system.json:940` `"id": "components.insertInstance",`
- **Tratador:** `src/app/commands.ts:236` `'components.insertInstance': insertInstanceCommand,`
- **Feature:** `src/app/features.ts:130` `'reusable-components': registerFeature('reusable-components'),`
- **Comportamento esperado:** coloca uma instância do componente logo depois do elemento selecionado, ou no lugar apontado pelo arraste do quadro de componentes até o canvas; a instância nasce ligada à definição, com o próprio e as partes marcados, recebe o nome do componente com um número simples (CardA, CardA 2) e fica selecionada; é uma entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.placed` com o elemento, o pai e a posição. O destino que o aninhamento não aceita é recusado (`status.refused.onlyAccepts`, `status.refused.requiresParent`, `status.refused.interactiveInside`, `status.refused.notInside`, `status.refused.singleChild`, `status.refused.noChildren`), a inserção num elemento trancado é recusada com `status.locked.insert` e o lugar dentro de uma instância com `status.components.inInstance`, sem mudar o documento. As duas portas, o quadro do painel e o arraste até o canvas, mandam a mesma intenção ao mesmo tratador (G3).

## REQ-0817 — components.detach
- **Onde:** `manifest/commands/design-system.json:1035` `"id": "components.detach",`
- **Tratador:** `src/app/commands.ts:237` `'components.detach': detachInstanceCommand,`
- **Feature:** `src/app/features.ts:130` `'reusable-components': registerFeature('reusable-components'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1042` `"refusalKey": "status.components.notInstance"`
- **Comportamento esperado:** desvincula a instância selecionada do seu componente: os nós deixam as marcas de instância e passam a ser elementos comuns, que não seguem mais a definição, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.components.detached` com o nome. Com uma seleção que não é instância o comando é recusado com `status.components.notInstance`, sem mudar o documento. As duas portas, o menu do contexto e a barra de comandos, mandam a mesma intenção ao mesmo tratador (G3).

## REQ-0818 — components.repeat
- **Onde:** `manifest/commands/design-system.json:1098` `"id": "components.repeat",`
- **Tratador:** `src/app/commands.ts:238` `'components.repeat': repeatCommand,`
- **Feature:** `src/app/features.ts:131` `'repeat-element': registerFeature('repeat-element'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1105` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** "Repetir (cópia ligada)" faz do elemento selecionado um componente e acrescenta logo depois dele uma cópia ligada, que fica selecionada, de modo que cada repetição seguinte acrescenta a próxima; um estilo escrito em qualquer um dos itens alcança todos (a definição guarda o estilo e os itens o tomam) e um texto fica só no item em que foi escrito; cada repetição é uma entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.components.repeated` com o nome e a contagem. A raiz da página é recusada com `status.components.root`; um elemento dentro de uma instância (`status.components.inInstance`), um que contém instância (`status.components.holdsInstance`), um trancado ou trancado por um ancestral (`status.locked.edit`, `status.locked.byAncestor`) e os destinos que o aninhamento não aceita são recusados, sem mudar o documento. As quatro portas, o atalho Ctrl+Shift+D, o menu do contexto, o menu Organizar e a barra de comandos, mandam a mesma intenção ao mesmo tratador (G3).

## REQ-0819 — components.fillFromData
- **Onde:** `manifest/commands/design-system.json:1216` `"id": "components.fillFromData",`
- **Tratador:** `src/app/commands.ts:239` `'components.fillFromData': fillFromDataCommand,`
- **Feature:** `src/app/features.ts:131` `'repeat-element': registerFeature('repeat-element'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1229` `"refusalKey": "status.components.notInstance"`
- **Comportamento esperado:** o botão do explorador preenche os itens repetidos a partir do arquivo de dados escolhido: cada linha vira um item, os textos tomam os valores das colunas e os itens que faltam são acrescentados, no mesmo passo de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.data.filled` com a contagem, o nome e o caminho. Um arquivo sem linhas para preencher é recusado com `status.data.unreadable` e uma imagem que o projeto não tem com `status.data.imageNotFound`, e um item trancado com `status.locked.edit` ou `status.locked.byAncestor`, sem mudar o documento; com uma seleção que não é instância o comando é recusado com `status.components.notInstance`.

## REQ-0820 — design.replaceColour
- **Onde:** `manifest/commands/design-system.json:1275` `"id": "design.replaceColour",`
- **Tratador:** `src/app/commands.ts:215` `'design.replaceColour': replaceColourCommand,`
- **Feature:** `src/app/features.ts:242` `'site-colours': registerFeature('site-colours'),`
- **Comportamento esperado:** "Trocar esta cor em todo o site" troca toda menção da cor escolhida pela cor nova, onde quer que ela esteja escrita — na definição da classe, no estilo do elemento e dentro de outro valor, como uma parada de gradiente — numa só entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.siteColours.replaced` com a cor, o valor novo e a contagem. Uma cor que nenhum valor do site usa é recusada com `status.siteColours.notUsed` e um texto que não é cor com `status.siteColours.invalid`, sem mudar o documento.

## REQ-0821 — design.colourToVariable
- **Onde:** `manifest/commands/design-system.json:1337` `"id": "design.colourToVariable",`
- **Tratador:** `src/app/commands.ts:224` `'design.colourToVariable': colourToVariableCommand,`
- **Feature:** `src/app/features.ts:242` `'site-colours': registerFeature('site-colours'),`
- **Comportamento esperado:** "Criar uma variável desta cor" cria uma variável de cor com o nome dado, com o valor da cor escolhida, e reescreve toda menção daquela cor no site para `var(--nome)`, na mesma entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.siteColours.madeVariable` com o nome, a cor e a contagem. Uma cor que nenhum valor usa é recusada com `status.siteColours.notUsed`, um nome que não é nome de variável com `status.tokens.badName` e um nome já usado com `status.tokens.nameTaken`, sem mudar o documento.

## REQ-0822 — classes.moveInto
- **Onde:** `manifest/commands/design-system.json:1400` `"id": "classes.moveInto",`
- **Tratador:** `src/app/commands.ts:222` `'classes.moveInto': moveIntoClassCommand,`
- **Feature:** `src/app/features.ts:243` `'class-moves': registerFeature('class-moves'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1414` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** "Mover os estilos deste elemento para a classe" move os estilos próprios do elemento selecionado para dentro da definição da classe nomeada: as declarações entram na definição e o elemento deixa de guardar estilos próprios, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.classes.moved` com o elemento e o nome. Sem seleção é recusado com `refusal.nothingSelected`; uma classe que o projeto não tem com `status.classes.unknown`, um elemento sem estilos próprios para mover com `status.classes.nothingToMove` e um elemento trancado com `status.locked.edit`, sem mudar o documento.

## REQ-0823 — classes.applyToSimilar
- **Onde:** `manifest/commands/design-system.json:1459` `"id": "classes.applyToSimilar",`
- **Tratador:** `src/app/commands.ts:223` `'classes.applyToSimilar': applyToSimilarCommand,`
- **Feature:** `src/app/features.ts:243` `'class-moves': registerFeature('class-moves'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1481` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** faz todo elemento do mesmo tipo do selecionado listar a classe nomeada — os da página pela porta "desta página" e os do projeto inteiro pela porta "do projeto" — numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.classes.appliedToSimilar` com a classe e quantos elementos a ganharam. Sem seleção é recusado com `refusal.nothingSelected`; uma classe que o projeto não tem com `status.classes.unknown`, quando todos os elementos do tipo já listam a classe com `status.classes.noSimilar` e um elemento trancado com `status.locked.edit`, sem mudar o documento.

## REQ-0824 — design.applySuggestion
- **Onde:** `manifest/commands/design-system.json:1556` `"id": "design.applySuggestion",`
- **Tratador:** `src/app/commands.ts:221` `'design.applySuggestion': applySuggestionCommand,`
- **Feature:** `src/app/features.ts:244` `'style-suggestions': registerFeature('style-suggestions'),`
- **Comportamento esperado:** "Criar a classe" aplica a sugestão de estilo repetido: as declarações compartilhadas entram na definição da classe nomeada, todo elemento da sugestão passa a listar a classe e deixa de guardar essas declarações por si, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.suggest.applied` com o nome e a contagem. Uma sugestão que os elementos já não repetem é recusada com `status.suggest.none`, nome que não é nome de classe com `status.classes.badName`, nome já usado com `status.classes.nameTaken` e um elemento trancado entre os da sugestão com `status.locked.edit`, sem mudar o documento.

## REQ-0825 — components.updateFromInstance
- **Onde:** `manifest/commands/design-system.json:1621` `"id": "components.updateFromInstance",`
- **Tratador:** `src/app/commands.ts:219` `'components.updateFromInstance': updateFromInstanceCommand,`
- **Feature:** `src/app/features.ts:245` `'component-master-edit': registerFeature('component-master-edit'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1628` `"refusalKey": "status.components.notInstance"`
- **Comportamento esperado:** "Atualizar o componente a partir desta instância" toma a instância editada, ou o elemento selecionado dentro dela, como a nova verdade do componente: a definição e as demais instâncias recebem a estrutura e os estilos escritos naquela instância, e cada instância guarda os próprios textos, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.components.updated` com o nome e quantas instâncias acompanham. Com uma seleção fora de uma instância o comando é recusado com `status.components.notInstance`, sem mudar o documento.

## REQ-0826 — components.setVariant
- **Onde:** `manifest/commands/design-system.json:1663` `"id": "components.setVariant",`
- **Tratador:** `src/app/commands.ts:220` `'components.setVariant': setVariantCommand,`
- **Feature:** `src/app/features.ts:246` `'component-variants': registerFeature('component-variants'),`
- **Recusa declarada:** `manifest/commands/design-system.json:1676` `"refusalKey": "status.components.notInstance"`
- **Comportamento esperado:** o campo de variante faz a instância selecionada mostrar a variante nomeada, listando a classe da variante (a variante gold do componente Plan dá a classe plan--gold); um nome que o projeto ainda não tem cria a definição vazia da variante e a aplica, numa entrada de desfazer que devolve a seleção de antes do comando; a barra de status anuncia `status.components.variantSet` com a instância e a variante. Fora de uma instância é recusado com `status.components.notInstance` e um nome que não é nome de variante com `status.components.badVariant`, sem mudar o documento.

## REQ-2601 — page
- **Onde:** `manifest/elements.json:4` `"id": "page",`
- **Rótulo:** `manifest/elements.json:8` `"labelKey": "element.page.label",`
- **Comportamento esperado:** Serve para representar a raiz do documento, o corpo da página. Aceita elementos filhos, a tag padrão é body. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2602 — div
- **Onde:** `manifest/elements.json:20` `"id": "div",`
- **Rótulo:** `manifest/elements.json:33` `"labelKey": "element.div.label",`
- **Comportamento esperado:** Serve para agrupar outros elementos num contêiner genérico. Aceita elementos filhos, a tag padrão é div. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2603 — header
- **Onde:** `manifest/elements.json:42` `"id": "header",`
- **Rótulo:** `manifest/elements.json:55` `"labelKey": "element.header.label",`
- **Comportamento esperado:** Serve para marcar o cabeçalho da página ou de uma seção. Aceita elementos filhos, a tag padrão é header. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2604 — nav
- **Onde:** `manifest/elements.json:70` `"id": "nav",`
- **Rótulo:** `manifest/elements.json:83` `"labelKey": "element.nav.label",`
- **Comportamento esperado:** Serve para reunir os links de navegação. Aceita elementos filhos, a tag padrão é nav. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2605 — main
- **Onde:** `manifest/elements.json:97` `"id": "main",`
- **Rótulo:** `manifest/elements.json:110` `"labelKey": "element.main.label",`
- **Comportamento esperado:** Serve para marcar o conteúdo principal da página. Aceita elementos filhos, a tag padrão é main. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2606 — section
- **Onde:** `manifest/elements.json:124` `"id": "section",`
- **Rótulo:** `manifest/elements.json:137` `"labelKey": "element.section.label",`
- **Comportamento esperado:** Serve para dividir o documento em seções temáticas. Aceita elementos filhos, a tag padrão é section. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2607 — article
- **Onde:** `manifest/elements.json:152` `"id": "article",`
- **Rótulo:** `manifest/elements.json:165` `"labelKey": "element.article.label",`
- **Comportamento esperado:** Serve para isolar um conteúdo completo e independente por si. Aceita elementos filhos, a tag padrão é article. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2608 — aside
- **Onde:** `manifest/elements.json:179` `"id": "aside",`
- **Rótulo:** `manifest/elements.json:192` `"labelKey": "element.aside.label",`
- **Comportamento esperado:** Serve para marcar um conteúdo lateral complementar ao principal. Aceita elementos filhos, a tag padrão é aside. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2609 — footer
- **Onde:** `manifest/elements.json:206` `"id": "footer",`
- **Rótulo:** `manifest/elements.json:219` `"labelKey": "element.footer.label",`
- **Comportamento esperado:** Serve para undefined. Aceita elementos filhos, a tag padrão é footer. pode assumir as tags div, section, header, main, footer, nav, aside e article. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2610 — linkBlock
- **Onde:** `manifest/elements.json:234` `"id": "linkBlock",`
- **Rótulo:** `manifest/elements.json:238` `"labelKey": "element.linkBlock.label",`
- **Comportamento esperado:** Serve para tornar um bloco inteiro clicável, levando a um endereço. Aceita elementos filhos, a tag padrão é a. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo structure.

## REQ-2611 — heading
- **Onde:** `manifest/elements.json:249` `"id": "heading",`
- **Rótulo:** `manifest/elements.json:260` `"labelKey": "element.heading.label",`
- **Comportamento esperado:** Serve para marcar um título de seção, de h1 a h6. Aceita texto, a tag padrão é h2. pode assumir as tags h1, h2, h3, h4, h5 e h6. não cria filho natural. Aparece na paleta de inserção, no grupo text.

## REQ-2612 — paragraph
- **Onde:** `manifest/elements.json:269` `"id": "paragraph",`
- **Rótulo:** `manifest/elements.json:277` `"labelKey": "element.paragraph.label",`
- **Comportamento esperado:** Serve para marcar um parágrafo de texto. Aceita texto, a tag padrão é p. pode assumir as tags p, span e pre. não cria filho natural. Aparece na paleta de inserção, no grupo text.

## REQ-2613 — link
- **Onde:** `manifest/elements.json:286` `"id": "link",`
- **Rótulo:** `manifest/elements.json:293` `"labelKey": "element.link.label",`
- **Comportamento esperado:** Serve para marcar um link de texto dentro do conteúdo. Aceita texto, a tag padrão é a. pode assumir as tags a e button. não cria filho natural. Aparece na paleta de inserção, no grupo text.

## REQ-2614 — blockquote
- **Onde:** `manifest/elements.json:302` `"id": "blockquote",`
- **Rótulo:** `manifest/elements.json:306` `"labelKey": "element.blockquote.label",`
- **Comportamento esperado:** Serve para marcar uma citação em bloco. Aceita elementos filhos, a tag padrão é blockquote. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Aparece na paleta de inserção, no grupo text.

## REQ-2615 — pre
- **Onde:** `manifest/elements.json:315` `"id": "pre",`
- **Rótulo:** `manifest/elements.json:319` `"labelKey": "element.pre.label",`
- **Comportamento esperado:** Serve para marcar um trecho de texto pré-formatado. Aceita texto, a tag padrão é pre. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo text.

## REQ-2616 — rule
- **Onde:** `manifest/elements.json:328` `"id": "rule",`
- **Rótulo:** `manifest/elements.json:332` `"labelKey": "element.rule.label",`
- **Comportamento esperado:** Serve para separar conteúdos com uma linha divisória. Não aceita conteúdo, a tag padrão é hr. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo text.

## REQ-2617 — list
- **Onde:** `manifest/elements.json:341` `"id": "list",`
- **Rótulo:** `manifest/elements.json:345` `"labelKey": "element.list.label",`
- **Comportamento esperado:** Serve para montar uma lista não ordenada. Aceita elementos filhos, a tag padrão é ul. não pode trocar de tag. cria como filho natural um elemento do tipo listItem. Aparece na paleta de inserção, no grupo lists.

## REQ-2618 — orderedList
- **Onde:** `manifest/elements.json:354` `"id": "orderedList",`
- **Rótulo:** `manifest/elements.json:358` `"labelKey": "element.orderedList.label",`
- **Comportamento esperado:** Serve para montar uma lista ordenada. Aceita elementos filhos, a tag padrão é ol. não pode trocar de tag. cria como filho natural um elemento do tipo listItem. Aparece na paleta de inserção, no grupo lists.

## REQ-2619 — definitionList
- **Onde:** `manifest/elements.json:367` `"id": "definitionList",`
- **Rótulo:** `manifest/elements.json:371` `"labelKey": "element.definitionList.label",`
- **Comportamento esperado:** Serve para listar termos e as suas definições. Aceita elementos filhos, a tag padrão é dl. não pode trocar de tag. cria como filhos naturais elementos dos tipos term e description. Aparece na paleta de inserção, no grupo lists.

## REQ-2620 — listItem
- **Onde:** `manifest/elements.json:383` `"id": "listItem",`
- **Rótulo:** `manifest/elements.json:387` `"labelKey": "element.listItem.label",`
- **Comportamento esperado:** Serve para representar um item de lista. Aceita elementos filhos, a tag padrão é li. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Não aparece na paleta de inserção.

## REQ-2621 — term
- **Onde:** `manifest/elements.json:396` `"id": "term",`
- **Rótulo:** `manifest/elements.json:400` `"labelKey": "element.term.label",`
- **Comportamento esperado:** Serve para marcar o termo de uma lista de definições. Aceita elementos filhos, a tag padrão é dt. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Não aparece na paleta de inserção.

## REQ-2622 — description
- **Onde:** `manifest/elements.json:409` `"id": "description",`
- **Rótulo:** `manifest/elements.json:413` `"labelKey": "element.description.label",`
- **Comportamento esperado:** Serve para marcar a definição de um termo. Aceita elementos filhos, a tag padrão é dd. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Não aparece na paleta de inserção.

## REQ-2623 — table
- **Onde:** `manifest/elements.json:422` `"id": "table",`
- **Rótulo:** `manifest/elements.json:426` `"labelKey": "element.table.label",`
- **Comportamento esperado:** Serve para montar uma tabela de dados. Aceita elementos filhos, a tag padrão é table. não pode trocar de tag. cria como filho natural um elemento do tipo tableBody. Aparece na paleta de inserção, no grupo tables.

## REQ-2624 — caption
- **Onde:** `manifest/elements.json:435` `"id": "caption",`
- **Rótulo:** `manifest/elements.json:439` `"labelKey": "element.caption.label",`
- **Comportamento esperado:** Serve para marcar o título de uma tabela. Aceita elementos filhos, a tag padrão é caption. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Não aparece na paleta de inserção.

## REQ-2625 — tableHead
- **Onde:** `manifest/elements.json:448` `"id": "tableHead",`
- **Rótulo:** `manifest/elements.json:452` `"labelKey": "element.tableHead.label",`
- **Comportamento esperado:** Serve para marcar o cabeçalho de uma tabela. Aceita elementos filhos, a tag padrão é thead. não pode trocar de tag. cria como filho natural um elemento do tipo tableRow. Não aparece na paleta de inserção.

## REQ-2626 — tableBody
- **Onde:** `manifest/elements.json:461` `"id": "tableBody",`
- **Rótulo:** `manifest/elements.json:465` `"labelKey": "element.tableBody.label",`
- **Comportamento esperado:** Serve para marcar o corpo de uma tabela. Aceita elementos filhos, a tag padrão é tbody. não pode trocar de tag. cria como filho natural um elemento do tipo tableRow. Não aparece na paleta de inserção.

## REQ-2627 — tableFoot
- **Onde:** `manifest/elements.json:474` `"id": "tableFoot",`
- **Rótulo:** `manifest/elements.json:478` `"labelKey": "element.tableFoot.label",`
- **Comportamento esperado:** Serve para marcar o rodapé de uma tabela. Aceita elementos filhos, a tag padrão é tfoot. não pode trocar de tag. cria como filho natural um elemento do tipo tableRow. Não aparece na paleta de inserção.

## REQ-2628 — tableRow
- **Onde:** `manifest/elements.json:487` `"id": "tableRow",`
- **Rótulo:** `manifest/elements.json:491` `"labelKey": "element.tableRow.label",`
- **Comportamento esperado:** Serve para representar uma linha de tabela. Aceita elementos filhos, a tag padrão é tr. não pode trocar de tag. cria como filho natural um elemento do tipo cell. Não aparece na paleta de inserção.

## REQ-2629 — headerCell
- **Onde:** `manifest/elements.json:500` `"id": "headerCell",`
- **Rótulo:** `manifest/elements.json:504` `"labelKey": "element.headerCell.label",`
- **Comportamento esperado:** Serve para marcar uma célula de cabeçalho de tabela. Aceita elementos filhos, a tag padrão é th. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Não aparece na paleta de inserção.

## REQ-2630 — cell
- **Onde:** `manifest/elements.json:513` `"id": "cell",`
- **Rótulo:** `manifest/elements.json:517` `"labelKey": "element.cell.label",`
- **Comportamento esperado:** Serve para marcar uma célula de dados de tabela. Aceita elementos filhos, a tag padrão é td. não pode trocar de tag. cria como filho natural um elemento do tipo paragraph. Não aparece na paleta de inserção.

## REQ-2631 — form
- **Onde:** `manifest/elements.json:526` `"id": "form",`
- **Rótulo:** `manifest/elements.json:530` `"labelKey": "element.form.label",`
- **Comportamento esperado:** Serve para reunir campos num formulário. Aceita elementos filhos, a tag padrão é form. não pode trocar de tag. cria como filho natural um elemento do tipo label. Aparece na paleta de inserção, no grupo forms.

## REQ-2632 — fieldset
- **Onde:** `manifest/elements.json:539` `"id": "fieldset",`
- **Rótulo:** `manifest/elements.json:543` `"labelKey": "element.fieldset.label",`
- **Comportamento esperado:** Serve para agrupar campos de formulário. Aceita elementos filhos, a tag padrão é fieldset. não pode trocar de tag. cria como filho natural um elemento do tipo legend. Aparece na paleta de inserção, no grupo forms.

## REQ-2633 — legend
- **Onde:** `manifest/elements.json:552` `"id": "legend",`
- **Rótulo:** `manifest/elements.json:556` `"labelKey": "element.legend.label",`
- **Comportamento esperado:** Serve para marcar o título de um grupo de campos. Aceita elementos filhos, a tag padrão é legend. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2634 — label
- **Onde:** `manifest/elements.json:565` `"id": "label",`
- **Rótulo:** `manifest/elements.json:569` `"labelKey": "element.label.label",`
- **Comportamento esperado:** Serve para marcar o rótulo de um campo de formulário. Aceita elementos filhos, a tag padrão é label. não pode trocar de tag. cria como filho natural um elemento do tipo input. Aparece na paleta de inserção, no grupo forms.

## REQ-2635 — input
- **Onde:** `manifest/elements.json:578` `"id": "input",`
- **Rótulo:** `manifest/elements.json:582` `"labelKey": "element.input.label",`
- **Comportamento esperado:** Serve para criar um campo de entrada. Não aceita conteúdo, a tag padrão é input. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo forms.

## REQ-2636 — textarea
- **Onde:** `manifest/elements.json:591` `"id": "textarea",`
- **Rótulo:** `manifest/elements.json:595` `"labelKey": "element.textarea.label",`
- **Comportamento esperado:** Serve para criar um campo de texto de várias linhas. Aceita texto, a tag padrão é textarea. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo forms.

## REQ-2637 — select
- **Onde:** `manifest/elements.json:604` `"id": "select",`
- **Rótulo:** `manifest/elements.json:608` `"labelKey": "element.select.label",`
- **Comportamento esperado:** Serve para criar uma lista de opções suspensa. Aceita elementos filhos, a tag padrão é select. não pode trocar de tag. cria como filhos naturais elementos dos tipos option. Aparece na paleta de inserção, no grupo forms.

## REQ-2638 — optionGroup
- **Onde:** `manifest/elements.json:621` `"id": "optionGroup",`
- **Rótulo:** `manifest/elements.json:625` `"labelKey": "element.optionGroup.label",`
- **Comportamento esperado:** Serve para agrupar opções dentro de uma lista suspensa. Aceita elementos filhos, a tag padrão é optgroup. não pode trocar de tag. cria como filho natural um elemento do tipo option. Não aparece na paleta de inserção.

## REQ-2639 — option
- **Onde:** `manifest/elements.json:634` `"id": "option",`
- **Rótulo:** `manifest/elements.json:638` `"labelKey": "element.option.label",`
- **Comportamento esperado:** Serve para representar uma opção de uma lista suspensa. Aceita texto, a tag padrão é option. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2640 — button
- **Onde:** `manifest/elements.json:647` `"id": "button",`
- **Rótulo:** `manifest/elements.json:651` `"labelKey": "element.button.label",`
- **Comportamento esperado:** Serve para criar um botão de ação. Aceita texto, a tag padrão é button. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo text.

## REQ-2641 — progress
- **Onde:** `manifest/elements.json:660` `"id": "progress",`
- **Rótulo:** `manifest/elements.json:664` `"labelKey": "element.progress.label",`
- **Comportamento esperado:** Serve para mostrar o progresso de uma tarefa. Não aceita conteúdo, a tag padrão é progress. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo forms.

## REQ-2642 — meter
- **Onde:** `manifest/elements.json:673` `"id": "meter",`
- **Rótulo:** `manifest/elements.json:677` `"labelKey": "element.meter.label",`
- **Comportamento esperado:** Serve para medir uma grandeza dentro de uma faixa. Não aceita conteúdo, a tag padrão é meter. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo forms.

## REQ-2643 — output
- **Onde:** `manifest/elements.json:686` `"id": "output",`
- **Rótulo:** `manifest/elements.json:690` `"labelKey": "element.output.label",`
- **Comportamento esperado:** Serve para mostrar o resultado calculado de um formulário. Aceita texto, a tag padrão é output. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo forms.

## REQ-2644 — image
- **Onde:** `manifest/elements.json:699` `"id": "image",`
- **Rótulo:** `manifest/elements.json:703` `"labelKey": "element.image.label",`
- **Comportamento esperado:** Serve para mostrar uma imagem. Não aceita conteúdo, a tag padrão é img. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo media.

## REQ-2645 — picture
- **Onde:** `manifest/elements.json:715` `"id": "picture",`
- **Rótulo:** `manifest/elements.json:719` `"labelKey": "element.picture.label",`
- **Comportamento esperado:** Serve para oferecer fontes alternativas de imagem por condição. Aceita elementos filhos, a tag padrão é picture. não pode trocar de tag. cria como filhos naturais elementos dos tipos image. Aparece na paleta de inserção, no grupo media.

## REQ-2646 — figure
- **Onde:** `manifest/elements.json:730` `"id": "figure",`
- **Rótulo:** `manifest/elements.json:734` `"labelKey": "element.figure.label",`
- **Comportamento esperado:** Serve para reunir uma figura e a sua legenda. Aceita elementos filhos, a tag padrão é figure. não pode trocar de tag. cria como filhos naturais elementos dos tipos image e figureCaption. Aparece na paleta de inserção, no grupo media.

## REQ-2647 — figureCaption
- **Onde:** `manifest/elements.json:746` `"id": "figureCaption",`
- **Rótulo:** `manifest/elements.json:750` `"labelKey": "element.figureCaption.label",`
- **Comportamento esperado:** Serve para marcar a legenda de uma figura. Aceita texto, a tag padrão é figcaption. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2648 — video
- **Onde:** `manifest/elements.json:759` `"id": "video",`
- **Rótulo:** `manifest/elements.json:763` `"labelKey": "element.video.label",`
- **Comportamento esperado:** Serve para incorporar um vídeo. Aceita elementos filhos, a tag padrão é video. não pode trocar de tag. cria como filho natural um elemento do tipo source. Aparece na paleta de inserção, no grupo media.

## REQ-2649 — audio
- **Onde:** `manifest/elements.json:772` `"id": "audio",`
- **Rótulo:** `manifest/elements.json:776` `"labelKey": "element.audio.label",`
- **Comportamento esperado:** Serve para incorporar um áudio. Aceita elementos filhos, a tag padrão é audio. não pode trocar de tag. cria como filho natural um elemento do tipo source. Aparece na paleta de inserção, no grupo media.

## REQ-2650 — source
- **Onde:** `manifest/elements.json:785` `"id": "source",`
- **Rótulo:** `manifest/elements.json:789` `"labelKey": "element.source.label",`
- **Comportamento esperado:** Serve para apontar uma fonte de mídia para video, audio ou picture. Não aceita conteúdo, a tag padrão é source. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2651 — track
- **Onde:** `manifest/elements.json:798` `"id": "track",`
- **Rótulo:** `manifest/elements.json:802` `"labelKey": "element.track.label",`
- **Comportamento esperado:** Serve para acrescentar uma faixa de texto a um vídeo, como legendas. Não aceita conteúdo, a tag padrão é track. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2652 — iframe
- **Onde:** `manifest/elements.json:811` `"id": "iframe",`
- **Rótulo:** `manifest/elements.json:815` `"labelKey": "element.iframe.label",`
- **Comportamento esperado:** Serve para embutir outra página numa moldura. Não aceita conteúdo, a tag padrão é iframe. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo media.

## REQ-2653 — canvas
- **Onde:** `manifest/elements.json:827` `"id": "canvas",`
- **Rótulo:** `manifest/elements.json:831` `"labelKey": "element.canvas.label",`
- **Comportamento esperado:** Serve para reservar uma área de desenho por script. Não aceita conteúdo, a tag padrão é canvas. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo media.

## REQ-2654 — svg
- **Onde:** `manifest/elements.json:843` `"id": "svg",`
- **Rótulo:** `manifest/elements.json:847` `"labelKey": "element.svg.label",`
- **Comportamento esperado:** Serve para desenhar com formas vetoriais SVG. Aceita elementos filhos, a tag padrão é svg. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo media.

## REQ-2655 — rectangle
- **Onde:** `manifest/elements.json:859` `"id": "rectangle",`
- **Rótulo:** `manifest/elements.json:863` `"labelKey": "element.rectangle.label",`
- **Comportamento esperado:** Serve para desenhar um retângulo dentro de um SVG. Não aceita conteúdo, a tag padrão é rect. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2656 — ellipse
- **Onde:** `manifest/elements.json:876` `"id": "ellipse",`
- **Rótulo:** `manifest/elements.json:880` `"labelKey": "element.ellipse.label",`
- **Comportamento esperado:** Serve para desenhar uma elipse dentro de um SVG. Não aceita conteúdo, a tag padrão é ellipse. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2657 — line
- **Onde:** `manifest/elements.json:893` `"id": "line",`
- **Rótulo:** `manifest/elements.json:897` `"labelKey": "element.line.label",`
- **Comportamento esperado:** Serve para desenhar uma linha dentro de um SVG. Não aceita conteúdo, a tag padrão é line. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2658 — details
- **Onde:** `manifest/elements.json:910` `"id": "details",`
- **Rótulo:** `manifest/elements.json:914` `"labelKey": "element.details.label",`
- **Comportamento esperado:** Serve para esconder conteúdo que a pessoa abre e fecha. Aceita elementos filhos, a tag padrão é details. não pode trocar de tag. cria como filho natural um elemento do tipo summary. Aparece na paleta de inserção, no grupo interactive.

## REQ-2659 — summary
- **Onde:** `manifest/elements.json:923` `"id": "summary",`
- **Rótulo:** `manifest/elements.json:927` `"labelKey": "element.summary.label",`
- **Comportamento esperado:** Serve para marcar o título clicável de um bloco details. Aceita elementos filhos, a tag padrão é summary. não pode trocar de tag. não cria filho natural. Não aparece na paleta de inserção.

## REQ-2660 — dialog
- **Onde:** `manifest/elements.json:936` `"id": "dialog",`
- **Rótulo:** `manifest/elements.json:940` `"labelKey": "element.dialog.label",`
- **Comportamento esperado:** Serve para abrir uma caixa de diálogo. Aceita elementos filhos, a tag padrão é dialog. não pode trocar de tag. cria como filhos naturais elementos dos tipos heading, paragraph e button. Aparece na paleta de inserção, no grupo interactive.

## REQ-2661 — embed
- **Onde:** `manifest/elements.json:959` `"id": "embed",`
- **Rótulo:** `manifest/elements.json:963` `"labelKey": "element.embed.label",`
- **Comportamento esperado:** Serve para inserir um trecho de marcação HTML livre que o editor desenha tal como foi escrito. Aceita marcação HTML, não tem tag própria. não pode trocar de tag. não cria filho natural. Aparece na paleta de inserção, no grupo media.

## REQ-2801 — text
- **Onde:** `manifest/elements.json:974` `"id": "text",`
- **Rótulo:** `manifest/elements.json:976` `"labelKey": "attribute.text.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos heading, paragraph, link, pre, button, figureCaption, caption, headerCell, cell, listItem, term, description, legend, summary, output e option. Ao editar, aparece um campo de texto.

## REQ-2802 — tag
- **Onde:** `manifest/elements.json:1000` `"id": "tag",`
- **Rótulo:** `manifest/elements.json:1002` `"labelKey": "attribute.tag.label",`
- **Comportamento esperado:** Toma uma tag HTML. Aplica-se aos elementos div, header, nav, main, section, article, aside, footer, heading, paragraph e link. Ao editar, aparece um seletor com as tags equivalentes.

## REQ-2803 — id
- **Onde:** `manifest/elements.json:1021` `"id": "id",`
- **Rótulo:** `manifest/elements.json:1023` `"labelKey": "attribute.id.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se a todos os elementos. É global. Ao editar, aparece um campo de texto.

## REQ-2804 — classes
- **Onde:** `manifest/elements.json:1031` `"id": "classes",`
- **Rótulo:** `manifest/elements.json:1033` `"labelKey": "attribute.classes.label",`
- **Comportamento esperado:** Toma uma lista de classes. Aplica-se a todos os elementos. É global. Ao editar, aparece um campo de classes.

## REQ-2805 — title
- **Onde:** `manifest/elements.json:1041` `"id": "title",`
- **Rótulo:** `manifest/elements.json:1043` `"labelKey": "attribute.title.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se a todos os elementos. É global. Ao editar, aparece um campo de texto.

## REQ-2806 — href
- **Onde:** `manifest/elements.json:1051` `"id": "href",`
- **Rótulo:** `manifest/elements.json:1053` `"labelKey": "attribute.href.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos linkBlock e link. Ao editar, aparece um campo de endereço.

## REQ-2807 — newTab
- **Onde:** `manifest/elements.json:1063` `"id": "newTab",`
- **Rótulo:** `manifest/elements.json:1065` `"labelKey": "attribute.newTab.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos linkBlock e link. Ao editar, aparece uma caixa de marcação.

## REQ-2808 — src
- **Onde:** `manifest/elements.json:1075` `"id": "src",`
- **Rótulo:** `manifest/elements.json:1077` `"labelKey": "attribute.src.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos image, source, track, video, audio e iframe. Ao editar, aparece um campo de endereço.

## REQ-2809 — alt
- **Onde:** `manifest/elements.json:1091` `"id": "alt",`
- **Rótulo:** `manifest/elements.json:1093` `"labelKey": "attribute.alt.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos image. Ao editar, aparece um campo de texto.

## REQ-2810 — srcset
- **Onde:** `manifest/elements.json:1103` `"id": "srcset",`
- **Rótulo:** `manifest/elements.json:1105` `"labelKey": "attribute.srcset.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos image e source. Ao editar, aparece um campo de texto.

## REQ-2811 — sizes
- **Onde:** `manifest/elements.json:1115` `"id": "sizes",`
- **Rótulo:** `manifest/elements.json:1117` `"labelKey": "attribute.sizes.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos image e source. Ao editar, aparece um campo de texto.

## REQ-2812 — media
- **Onde:** `manifest/elements.json:1127` `"id": "media",`
- **Rótulo:** `manifest/elements.json:1129` `"labelKey": "attribute.media.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos source. Ao editar, aparece um campo de texto.

## REQ-2813 — placeholder
- **Onde:** `manifest/elements.json:1138` `"id": "placeholder",`
- **Rótulo:** `manifest/elements.json:1140` `"labelKey": "attribute.placeholder.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input e textarea. Ao editar, aparece um campo de texto.

## REQ-2814 — value
- **Onde:** `manifest/elements.json:1150` `"id": "value",`
- **Rótulo:** `manifest/elements.json:1152` `"labelKey": "attribute.value.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input, textarea, option, progress e meter. Ao editar, aparece um campo de texto.

## REQ-2815 — name
- **Onde:** `manifest/elements.json:1165` `"id": "name",`
- **Rótulo:** `manifest/elements.json:1167` `"labelKey": "attribute.name.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input, textarea, select e button. Ao editar, aparece um campo de texto.

## REQ-2816 — required
- **Onde:** `manifest/elements.json:1179` `"id": "required",`
- **Rótulo:** `manifest/elements.json:1181` `"labelKey": "attribute.required.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos input, textarea e select. Ao editar, aparece uma caixa de marcação.

## REQ-2817 — pattern
- **Onde:** `manifest/elements.json:1192` `"id": "pattern",`
- **Rótulo:** `manifest/elements.json:1194` `"labelKey": "attribute.pattern.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input. Ao editar, aparece um campo de texto.

## REQ-2818 — min
- **Onde:** `manifest/elements.json:1203` `"id": "min",`
- **Rótulo:** `manifest/elements.json:1205` `"labelKey": "attribute.min.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input e meter. Ao editar, aparece um campo de texto.

## REQ-2819 — max
- **Onde:** `manifest/elements.json:1215` `"id": "max",`
- **Rótulo:** `manifest/elements.json:1217` `"labelKey": "attribute.max.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input, progress e meter. Ao editar, aparece um campo de texto.

## REQ-2820 — step
- **Onde:** `manifest/elements.json:1228` `"id": "step",`
- **Rótulo:** `manifest/elements.json:1230` `"labelKey": "attribute.step.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input. Ao editar, aparece um campo de texto.

## REQ-2821 — autocomplete
- **Onde:** `manifest/elements.json:1239` `"id": "autocomplete",`
- **Rótulo:** `manifest/elements.json:1241` `"labelKey": "attribute.autocomplete.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input, textarea e select. Ao editar, aparece um campo de texto.

## REQ-2822 — formAutocomplete
- **Onde:** `manifest/elements.json:1316` `"id": "formAutocomplete",`
- **Rótulo:** `manifest/elements.json:1318` `"labelKey": "attribute.formAutocomplete.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos form. Ao editar, aparece um campo de texto.

## REQ-2823 — disabled
- **Onde:** `manifest/elements.json:1330` `"id": "disabled",`
- **Rótulo:** `manifest/elements.json:1332` `"labelKey": "attribute.disabled.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos input, textarea, select, button, fieldset, optionGroup e option. Ao editar, aparece uma caixa de marcação.

## REQ-2824 — readonly
- **Onde:** `manifest/elements.json:1347` `"id": "readonly",`
- **Rótulo:** `manifest/elements.json:1349` `"labelKey": "attribute.readonly.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos input e textarea. Ao editar, aparece uma caixa de marcação.

## REQ-2825 — checked
- **Onde:** `manifest/elements.json:1359` `"id": "checked",`
- **Rótulo:** `manifest/elements.json:1361` `"labelKey": "attribute.checked.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos input. Ao editar, aparece uma caixa de marcação.

## REQ-2826 — inputType
- **Onde:** `manifest/elements.json:1370` `"id": "inputType",`
- **Rótulo:** `manifest/elements.json:1372` `"labelKey": "attribute.inputType.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos input. Ao editar, aparece um seletor com as opções text, hidden, email, password, number, tel, url, search, date, datetime-local, month, week, time, color, range, checkbox, radio, file, image, button, submit e reset.

## REQ-2827 — labelFor
- **Onde:** `manifest/elements.json:1404` `"id": "labelFor",`
- **Rótulo:** `manifest/elements.json:1406` `"labelKey": "attribute.labelFor.label",`
- **Comportamento esperado:** Toma a referência a um id de elemento. Aplica-se aos elementos label. Ao editar, aparece um seletor de id de elemento no documento.

## REQ-2828 — action
- **Onde:** `manifest/elements.json:1415` `"id": "action",`
- **Rótulo:** `manifest/elements.json:1417` `"labelKey": "attribute.action.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos form. Ao editar, aparece um campo de endereço.

## REQ-2829 — method
- **Onde:** `manifest/elements.json:1426` `"id": "method",`
- **Rótulo:** `manifest/elements.json:1428` `"labelKey": "attribute.method.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos form. Ao editar, aparece um seletor com as opções get e post.

## REQ-2830 — buttonType
- **Onde:** `manifest/elements.json:1440` `"id": "buttonType",`
- **Rótulo:** `manifest/elements.json:1442` `"labelKey": "attribute.buttonType.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos button e link. Ao editar, aparece um seletor com as opções submit, button e reset.

## REQ-2831 — rows
- **Onde:** `manifest/elements.json:1456` `"id": "rows",`
- **Rótulo:** `manifest/elements.json:1458` `"labelKey": "attribute.rows.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos textarea. Ao editar, aparece um campo numérico.

## REQ-2832 — groupLabel
- **Onde:** `manifest/elements.json:1467` `"id": "groupLabel",`
- **Rótulo:** `manifest/elements.json:1469` `"labelKey": "attribute.groupLabel.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos optionGroup. Ao editar, aparece um campo de texto.

## REQ-2833 — selected
- **Onde:** `manifest/elements.json:1478` `"id": "selected",`
- **Rótulo:** `manifest/elements.json:1480` `"labelKey": "attribute.selected.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos option. Ao editar, aparece uma caixa de marcação.

## REQ-2834 — poster
- **Onde:** `manifest/elements.json:1489` `"id": "poster",`
- **Rótulo:** `manifest/elements.json:1491` `"labelKey": "attribute.poster.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos video. Ao editar, aparece um campo de endereço.

## REQ-2835 — controls
- **Onde:** `manifest/elements.json:1500` `"id": "controls",`
- **Rótulo:** `manifest/elements.json:1502` `"labelKey": "attribute.controls.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos video e audio. Ao editar, aparece uma caixa de marcação.

## REQ-2836 — autoplay
- **Onde:** `manifest/elements.json:1512` `"id": "autoplay",`
- **Rótulo:** `manifest/elements.json:1514` `"labelKey": "attribute.autoplay.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos video e audio. Ao editar, aparece uma caixa de marcação.

## REQ-2837 — loop
- **Onde:** `manifest/elements.json:1524` `"id": "loop",`
- **Rótulo:** `manifest/elements.json:1526` `"labelKey": "attribute.loop.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos video e audio. Ao editar, aparece uma caixa de marcação.

## REQ-2838 — muted
- **Onde:** `manifest/elements.json:1536` `"id": "muted",`
- **Rótulo:** `manifest/elements.json:1538` `"labelKey": "attribute.muted.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos video e audio. Ao editar, aparece uma caixa de marcação.

## REQ-2839 — trackKind
- **Onde:** `manifest/elements.json:1548` `"id": "trackKind",`
- **Rótulo:** `manifest/elements.json:1550` `"labelKey": "attribute.trackKind.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos track. Ao editar, aparece um seletor com as opções subtitles, captions, descriptions, chapters e metadata.

## REQ-2840 — canvasWidth
- **Onde:** `manifest/elements.json:1565` `"id": "canvasWidth",`
- **Rótulo:** `manifest/elements.json:1567` `"labelKey": "attribute.canvasWidth.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos canvas. Ao editar, aparece um campo numérico.

## REQ-2841 — canvasHeight
- **Onde:** `manifest/elements.json:1576` `"id": "canvasHeight",`
- **Rótulo:** `manifest/elements.json:1578` `"labelKey": "attribute.canvasHeight.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos canvas. Ao editar, aparece um campo numérico.

## REQ-2842 — open
- **Onde:** `manifest/elements.json:1587` `"id": "open",`
- **Rótulo:** `manifest/elements.json:1589` `"labelKey": "attribute.open.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos details e dialog. Ao editar, aparece uma caixa de marcação.

## REQ-2843 — svgMarkup
- **Onde:** `manifest/elements.json:1599` `"id": "svgMarkup",`
- **Rótulo:** `manifest/elements.json:1601` `"labelKey": "attribute.svgMarkup.label",`
- **Comportamento esperado:** Toma marcação HTML. Aplica-se aos elementos svg. Ao editar, aparece um editor de marcação.

## REQ-2844 — shapeX
- **Onde:** `manifest/elements.json:1610` `"id": "shapeX",`
- **Rótulo:** `manifest/elements.json:1612` `"labelKey": "attribute.shapeX.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos rectangle. Ao editar, aparece um campo numérico.

## REQ-2845 — shapeY
- **Onde:** `manifest/elements.json:1621` `"id": "shapeY",`
- **Rótulo:** `manifest/elements.json:1623` `"labelKey": "attribute.shapeY.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos rectangle. Ao editar, aparece um campo numérico.

## REQ-2846 — shapeWidth
- **Onde:** `manifest/elements.json:1632` `"id": "shapeWidth",`
- **Rótulo:** `manifest/elements.json:1634` `"labelKey": "attribute.shapeWidth.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos rectangle. Ao editar, aparece um campo numérico.

## REQ-2847 — shapeHeight
- **Onde:** `manifest/elements.json:1643` `"id": "shapeHeight",`
- **Rótulo:** `manifest/elements.json:1645` `"labelKey": "attribute.shapeHeight.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos rectangle. Ao editar, aparece um campo numérico.

## REQ-2848 — ellipseCx
- **Onde:** `manifest/elements.json:1654` `"id": "ellipseCx",`
- **Rótulo:** `manifest/elements.json:1656` `"labelKey": "attribute.ellipseCx.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos ellipse. Ao editar, aparece um campo numérico.

## REQ-2849 — ellipseCy
- **Onde:** `manifest/elements.json:1665` `"id": "ellipseCy",`
- **Rótulo:** `manifest/elements.json:1667` `"labelKey": "attribute.ellipseCy.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos ellipse. Ao editar, aparece um campo numérico.

## REQ-2850 — ellipseRx
- **Onde:** `manifest/elements.json:1676` `"id": "ellipseRx",`
- **Rótulo:** `manifest/elements.json:1678` `"labelKey": "attribute.ellipseRx.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos ellipse. Ao editar, aparece um campo numérico.

## REQ-2851 — ellipseRy
- **Onde:** `manifest/elements.json:1687` `"id": "ellipseRy",`
- **Rótulo:** `manifest/elements.json:1689` `"labelKey": "attribute.ellipseRy.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos ellipse. Ao editar, aparece um campo numérico.

## REQ-2852 — lineX1
- **Onde:** `manifest/elements.json:1698` `"id": "lineX1",`
- **Rótulo:** `manifest/elements.json:1700` `"labelKey": "attribute.lineX1.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos line. Ao editar, aparece um campo numérico.

## REQ-2853 — lineY1
- **Onde:** `manifest/elements.json:1709` `"id": "lineY1",`
- **Rótulo:** `manifest/elements.json:1711` `"labelKey": "attribute.lineY1.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos line. Ao editar, aparece um campo numérico.

## REQ-2854 — lineX2
- **Onde:** `manifest/elements.json:1720` `"id": "lineX2",`
- **Rótulo:** `manifest/elements.json:1722` `"labelKey": "attribute.lineX2.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos line. Ao editar, aparece um campo numérico.

## REQ-2855 — lineY2
- **Onde:** `manifest/elements.json:1731` `"id": "lineY2",`
- **Rótulo:** `manifest/elements.json:1733` `"labelKey": "attribute.lineY2.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos line. Ao editar, aparece um campo numérico.

## REQ-2856 — embedMarkup
- **Onde:** `manifest/elements.json:1742` `"id": "embedMarkup",`
- **Rótulo:** `manifest/elements.json:1744` `"labelKey": "attribute.embedMarkup.label",`
- **Comportamento esperado:** Toma marcação HTML. Aplica-se aos elementos embed. Ao editar, aparece um editor de marcação.

## REQ-2857 — cite
- **Onde:** `manifest/elements.json:1753` `"id": "cite",`
- **Rótulo:** `manifest/elements.json:1755` `"labelKey": "attribute.cite.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos blockquote. Ao editar, aparece um campo de endereço.

## REQ-2858 — start
- **Onde:** `manifest/elements.json:1764` `"id": "start",`
- **Rótulo:** `manifest/elements.json:1766` `"labelKey": "attribute.start.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos orderedList. Ao editar, aparece um campo numérico.

## REQ-2859 — reversed
- **Onde:** `manifest/elements.json:1775` `"id": "reversed",`
- **Rótulo:** `manifest/elements.json:1777` `"labelKey": "attribute.reversed.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos orderedList. Ao editar, aparece uma caixa de marcação.

## REQ-2860 — listType
- **Onde:** `manifest/elements.json:1786` `"id": "listType",`
- **Rótulo:** `manifest/elements.json:1788` `"labelKey": "attribute.listType.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos orderedList. Ao editar, aparece um seletor com as opções 1, a, A, i e I.

## REQ-2861 — scope
- **Onde:** `manifest/elements.json:1803` `"id": "scope",`
- **Rótulo:** `manifest/elements.json:1805` `"labelKey": "attribute.scope.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos headerCell. Ao editar, aparece um seletor com as opções row, col, rowgroup e colgroup.

## REQ-2862 — accept
- **Onde:** `manifest/elements.json:1819` `"id": "accept",`
- **Rótulo:** `manifest/elements.json:1821` `"labelKey": "attribute.accept.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input. Ao editar, aparece um campo de texto.

## REQ-2863 — multiple
- **Onde:** `manifest/elements.json:1830` `"id": "multiple",`
- **Rótulo:** `manifest/elements.json:1832` `"labelKey": "attribute.multiple.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos input. Ao editar, aparece uma caixa de marcação.

## REQ-2864 — cols
- **Onde:** `manifest/elements.json:1841` `"id": "cols",`
- **Rótulo:** `manifest/elements.json:1843` `"labelKey": "attribute.cols.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos textarea. Ao editar, aparece um campo numérico.

## REQ-2865 — maxLength
- **Onde:** `manifest/elements.json:1852` `"id": "maxLength",`
- **Rótulo:** `manifest/elements.json:1854` `"labelKey": "attribute.maxLength.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos input e textarea. Ao editar, aparece um campo numérico.

## REQ-2866 — minLength
- **Onde:** `manifest/elements.json:1864` `"id": "minLength",`
- **Rótulo:** `manifest/elements.json:1866` `"labelKey": "attribute.minLength.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos input e textarea. Ao editar, aparece um campo numérico.

## REQ-2867 — low
- **Onde:** `manifest/elements.json:1876` `"id": "low",`
- **Rótulo:** `manifest/elements.json:1878` `"labelKey": "attribute.low.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos meter. Ao editar, aparece um campo numérico.

## REQ-2868 — high
- **Onde:** `manifest/elements.json:1887` `"id": "high",`
- **Rótulo:** `manifest/elements.json:1889` `"labelKey": "attribute.high.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos meter. Ao editar, aparece um campo numérico.

## REQ-2869 — optimum
- **Onde:** `manifest/elements.json:1898` `"id": "optimum",`
- **Rótulo:** `manifest/elements.json:1900` `"labelKey": "attribute.optimum.label",`
- **Comportamento esperado:** Toma um número. Aplica-se aos elementos meter. Ao editar, aparece um campo numérico.

## REQ-2870 — allow
- **Onde:** `manifest/elements.json:1909` `"id": "allow",`
- **Rótulo:** `manifest/elements.json:1911` `"labelKey": "attribute.allow.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos iframe. Ao editar, aparece um campo de texto.

## REQ-2871 — loading
- **Onde:** `manifest/elements.json:1920` `"id": "loading",`
- **Rótulo:** `manifest/elements.json:1922` `"labelKey": "attribute.loading.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos iframe e image. Ao editar, aparece um seletor com as opções eager e lazy.

## REQ-2872 — playsInline
- **Onde:** `manifest/elements.json:1935` `"id": "playsInline",`
- **Rótulo:** `manifest/elements.json:1937` `"labelKey": "attribute.playsInline.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos video. Ao editar, aparece uma caixa de marcação.

## REQ-2873 — preload
- **Onde:** `manifest/elements.json:1946` `"id": "preload",`
- **Rótulo:** `manifest/elements.json:1948` `"labelKey": "attribute.preload.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos video e audio. Ao editar, aparece um seletor com as opções none, metadata e auto.

## REQ-2874 — pageTitle
- **Onde:** `manifest/elements.json:1962` `"id": "pageTitle",`
- **Rótulo:** `manifest/elements.json:1964` `"labelKey": "attribute.pageTitle.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos page. Ao editar, aparece um campo de texto.

## REQ-2875 — pageLanguage
- **Onde:** `manifest/elements.json:1973` `"id": "pageLanguage",`
- **Rótulo:** `manifest/elements.json:1975` `"labelKey": "attribute.pageLanguage.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos page. É global. Ao editar, aparece um campo de texto.

## REQ-2876 — pageDirection
- **Onde:** `manifest/elements.json:1985` `"id": "pageDirection",`
- **Rótulo:** `manifest/elements.json:1987` `"labelKey": "attribute.pageDirection.label",`
- **Comportamento esperado:** Toma uma palavra-chave escolhida entre opções. Aplica-se aos elementos page. É global. Ao editar, aparece um seletor com as opções ltr, rtl e auto.

## REQ-2877 — pageHtmlClasses
- **Onde:** `manifest/elements.json:2001` `"id": "pageHtmlClasses",`
- **Rótulo:** `manifest/elements.json:2003` `"labelKey": "attribute.pageHtmlClasses.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos page. É global. Ao editar, aparece um campo de texto.

## REQ-2878 — pageDescription
- **Onde:** `manifest/elements.json:2013` `"id": "pageDescription",`
- **Rótulo:** `manifest/elements.json:2015` `"labelKey": "attribute.pageDescription.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos page. Ao editar, aparece um campo de texto.

## REQ-2879 — pageCanonical
- **Onde:** `manifest/elements.json:2025` `"id": "pageCanonical",`
- **Rótulo:** `manifest/elements.json:2027` `"labelKey": "attribute.pageCanonical.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos page. Ao editar, aparece um campo de endereço.

## REQ-2880 — pageOgTitle
- **Onde:** `manifest/elements.json:2037` `"id": "pageOgTitle",`
- **Rótulo:** `manifest/elements.json:2039` `"labelKey": "attribute.pageOgTitle.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos page. Ao editar, aparece um campo de texto.

## REQ-2881 — pageOgImage
- **Onde:** `manifest/elements.json:2049` `"id": "pageOgImage",`
- **Rótulo:** `manifest/elements.json:2051` `"labelKey": "attribute.pageOgImage.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos page. Ao editar, aparece um campo de endereço.

## REQ-2882 — pageFavicon
- **Onde:** `manifest/elements.json:2061` `"id": "pageFavicon",`
- **Rótulo:** `manifest/elements.json:2063` `"labelKey": "attribute.pageFavicon.label",`
- **Comportamento esperado:** Toma um endereço (URL). Aplica-se aos elementos page. Ao editar, aparece um campo de endereço.

## REQ-2883 — pageScripts
- **Onde:** `manifest/elements.json:2073` `"id": "pageScripts",`
- **Rótulo:** `manifest/elements.json:2075` `"labelKey": "attribute.pageScripts.label",`
- **Comportamento esperado:** Toma uma lista de caminhos de arquivo. Aplica-se aos elementos page. Ao editar, aparece uma lista de caminhos de arquivo.

## REQ-2884 — gridColumns
- **Onde:** `manifest/elements.json:2085` `"id": "gridColumns",`
- **Rótulo:** `manifest/elements.json:2087` `"labelKey": "attribute.gridColumns.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos page. Ao editar, aparece uma caixa de marcação.

## REQ-2885 — gridRows
- **Onde:** `manifest/elements.json:2096` `"id": "gridRows",`
- **Rótulo:** `manifest/elements.json:2098` `"labelKey": "attribute.gridRows.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos page. Ao editar, aparece uma caixa de marcação.

## REQ-2886 — gridDots
- **Onde:** `manifest/elements.json:2107` `"id": "gridDots",`
- **Rótulo:** `manifest/elements.json:2109` `"labelKey": "attribute.gridDots.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos page. Ao editar, aparece uma caixa de marcação.

## REQ-2887 — foldLines
- **Onde:** `manifest/elements.json:2118` `"id": "foldLines",`
- **Rótulo:** `manifest/elements.json:2120` `"labelKey": "attribute.foldLines.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se aos elementos page. Ao editar, aparece uma caixa de marcação.

## REQ-2888 — role
- **Onde:** `manifest/elements.json:2129` `"id": "role",`
- **Rótulo:** `manifest/elements.json:2131` `"labelKey": "attribute.role.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se a todos os elementos. É global. Ao editar, aparece um campo de texto.

## REQ-2889 — ariaLabel
- **Onde:** `manifest/elements.json:2139` `"id": "ariaLabel",`
- **Rótulo:** `manifest/elements.json:2141` `"labelKey": "attribute.ariaLabel.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se a todos os elementos. É global. Ao editar, aparece um campo de texto.

## REQ-2890 — ariaHidden
- **Onde:** `manifest/elements.json:2149` `"id": "ariaHidden",`
- **Rótulo:** `manifest/elements.json:2151` `"labelKey": "attribute.ariaHidden.label",`
- **Comportamento esperado:** Toma um valor ligado ou desligado. Aplica-se a todos os elementos. É global. Ao editar, aparece uma caixa de marcação.

## REQ-2891 — formField
- **Onde:** `manifest/elements.json:2159` `"id": "formField",`
- **Rótulo:** `manifest/elements.json:2161` `"labelKey": "attribute.formField.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input, textarea e select. Ao editar, aparece um campo de texto.

## REQ-2892 — formSubmit
- **Onde:** `manifest/elements.json:2172` `"id": "formSubmit",`
- **Rótulo:** `manifest/elements.json:2174` `"labelKey": "attribute.formSubmit.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos form. Ao editar, aparece um campo de texto.

## REQ-2893 — formConfigurationError
- **Onde:** `manifest/elements.json:2183` `"id": "formConfigurationError",`
- **Rótulo:** `manifest/elements.json:2185` `"labelKey": "attribute.formConfigurationError.label",`
- **Comportamento esperado:** Toma um texto. Aplica-se aos elementos input, textarea e select. Ao editar, aparece um campo de texto.

## REQ-0901 — element.setTag
- **Onde:** `manifest/commands/elements.json:5` `"id": "element.setTag",`
- **Tratador:** `src/app/commands.ts:240` `'element.setTag': setTagCommand,`
- **Feature:** `src/app/features.ts:89` `'semantic-tag-switch': registerFeature('semantic-tag-switch'),`
- **Comportamento esperado:** Trocar a tag de um elemento pelo campo "Mudar a tag". O menu oferece só as tags equivalentes ao elemento: contêineres (div, section, header, main, footer, nav, aside, article), títulos (h1 a h6) e texto (p, span, pre). A troca preserva filhos, texto, nome e estilos, e o iframe passa a desenhar a tag nova; cada troca é um passo de desfazer. A tag digitada em maiúsculas entra em minúsculas. São recusadas a tag não equivalente (p num contêiner ou num título), a tag que o aninhamento não aceita (footer dentro de header; contêiner que guarda footer virando header) e a edição em elemento travado ou sob ancestral travado, com o documento intacto.

## REQ-0902 — element.setAttribute
- **Onde:** `manifest/commands/elements.json:96` `"id": "element.setAttribute",`
- **Tratador:** `src/app/commands.ts:241` `'element.setAttribute': closingAssetPicker(setAttributeCommand),`
- **Feature:** `src/app/features.ts:84` `'props-attributes': registerFeature('props-attributes'),`
- **Comportamento esperado:** Definir um atributo do elemento pelos campos do inspetor ("Definir {attribute}"): título (title), texto alternativo (alt), origem (src), origem responsiva (srcset), tipo do botão (buttonType), rótulo do grupo (groupLabel), opção marcada (selected) e os demais campos por tipo de elemento. O valor entra nos atributos do documento JSON e é desenhado no iframe; cada gravação é um passo de desfazer. Valor inválido para o atributo (por exemplo rows com texto não numérico), URL insegura e as regras de formulário são recusados, com o documento intacto.

## REQ-0903 — assetPicker.open
- **Onde:** `manifest/commands/elements.json:3598` `"id": "assetPicker.open",`
- **Tratador:** `src/app/commands.ts:399` `'assetPicker.open': openAssetPicker,`
- **Feature:** `src/app/features.ts:217` `'explorer-assets-use': registerFeature('explorer-assets-use'),`
- **Comportamento esperado:** Abrir o seletor de arquivos do projeto pelo controle do campo Origem da imagem ("Escolher um arquivo do projeto"), para escolher um arquivo já enviado. A escolha grava a referência do arquivo no atributo src: o documento guarda o arquivo (img/photo.png) e a imagem o desenha no canvas e o leva na exportação. Camada não modal: a escolha ou o Esc restauram o gatilho (o campo Origem).

## REQ-0904 — assetPicker.close
- **Onde:** `manifest/commands/elements.json:3648` `"id": "assetPicker.close",`
- **Tratador:** `src/app/commands.ts:400` `'assetPicker.close': closeAssetPicker,`
- **Feature:** `src/app/features.ts:217` `'explorer-assets-use': registerFeature('explorer-assets-use'),`
- **Comportamento esperado:** Fechar o seletor de arquivos do projeto ("Fechar o seletor de arquivos") pelo botão de fechar ou pela tecla Esc no contexto do seletor. Camada não modal: o toque de fora fecha sem consumir o toque, e o fechamento restaura o gatilho.

## REQ-0905 — element.setId
- **Onde:** `manifest/commands/elements.json:3712` `"id": "element.setId",`
- **Tratador:** `src/app/commands.ts:242` `'element.setId': setIdCommand,`
- **Feature:** `src/app/features.ts:84` `'props-attributes': registerFeature('props-attributes'),`
- **Comportamento esperado:** Gravar o ID do elemento pelo campo "Definir o ID". O ID entra nos atributos do documento JSON e é o alvo das âncoras de link; cada gravação é um passo de desfazer. São recusados, com aviso e o documento intacto, o ID que outro elemento já usa (status.id.duplicate) e o ID inválido, como o que começa por dígito (status.id.invalid).

## REQ-0906 — element.setClasses
- **Onde:** `manifest/commands/elements.json:3775` `"id": "element.setClasses",`
- **Tratador:** `src/app/commands.ts:243` `'element.setClasses': setClassesCommand,`
- **Feature:** `src/app/features.ts:84` `'props-attributes': registerFeature('props-attributes'),`
- **Comportamento esperado:** Gravar as classes do elemento pelo campo "Definir as classes", como "dark wide". As classes são guardadas como lista no documento JSON do elemento, ao lado do ID e do título, na seção de Conteúdo sob o título Atributos; cada gravação é um passo de desfazer. O valor inválido para as classes é recusado, e a edição em elemento travado também, com o documento intacto.

## REQ-0907 — element.setLink
- **Onde:** `manifest/commands/elements.json:3837` `"id": "element.setLink",`
- **Tratador:** `src/app/commands.ts:244` `'element.setLink': closingPicker(setLinkCommand),`
- **Feature:** `src/app/features.ts:104` `'elements-structure': registerFeature('elements-structure'),`
- **Comportamento esperado:** Definir o link do elemento pelo campo de endereço e pelo campo de nova aba ("Definir o link"). O endereço é gravado e desenhado no iframe; a nova aba vira o destino em nova aba. O link para uma página é guardado como referência ao arquivo da página, e renomear ou mover a página de destino atualiza todo link para ela; a âncora vira referência ao nó ("#@/Page/Heading") e sai com o id do elemento na exportação ("#inicio"); o link de página sai como "index.html". O status mostra status.link.set, e a nova aba, status.link.newTab; cada definição é um passo de desfazer. A URL insegura (javascript:alert(1)) é recusada com status.url.unsafe, e a edição em elemento travado, sob ancestral travado ou em elemento a que o link não se aplica também é recusada, com o documento intacto.

## REQ-0908 — linkPicker.open
- **Onde:** `manifest/commands/elements.json:4041` `"id": "linkPicker.open",`
- **Tratador:** `src/app/commands.ts:396` `'linkPicker.open': openLinkPicker,`
- **Feature:** `src/app/features.ts:215` `'link-picker': registerFeature('link-picker'),`
- **Comportamento esperado:** Abrir o seletor de destino do link ("Escolher o destino do link") pelo controle do campo de endereço do Link, com o alvo recebido. O seletor oferece as páginas da árvore de arquivos, os elementos de uma página — dando id ao elemento quando ele não tem —, um URL, email (mailto:) e telefone (tel:).

## REQ-0909 — linkPicker.setKind
- **Onde:** `manifest/commands/elements.json:4091` `"id": "linkPicker.setKind",`
- **Tratador:** `src/app/commands.ts:397` `'linkPicker.setKind': setLinkKind,`
- **Feature:** `src/app/features.ts:215` `'link-picker': registerFeature('link-picker'),`
- **Comportamento esperado:** Escolher o tipo de link no seletor ("O tipo de link"): URL, página, âncora, email ou telefone. Cada tipo mostra os alvos que lhe cabem — as páginas do projeto, os elementos da página, o campo do endereço, mailto: ou tel: — e o tipo escolhido decide a forma do link gravado; as URLs inseguras são recusadas.

## REQ-0910 — linkPicker.close
- **Onde:** `manifest/commands/elements.json:4261` `"id": "linkPicker.close",`
- **Tratador:** `src/app/commands.ts:398` `'linkPicker.close': closeLinkPicker,`
- **Feature:** `src/app/features.ts:215` `'link-picker': registerFeature('link-picker'),`
- **Comportamento esperado:** Fechar o seletor de links ("Fechar o seletor de links") pelo botão de fechar ou pela tecla Esc no contexto do seletor. Camada não modal: o toque de fora fecha sem consumir o toque, e o fechamento restaura o gatilho (o campo de endereço).

## REQ-0911 — element.setInputType
- **Onde:** `manifest/commands/elements.json:4325` `"id": "element.setInputType",`
- **Tratador:** `src/app/commands.ts:245` `'element.setInputType': setInputTypeCommand,`
- **Feature:** `src/app/features.ts:115` `'elements-form-inputs-rules': registerFeature('elements-form-inputs-rules'),`
- **Comportamento esperado:** Mudar o tipo do campo de formulário ("Mudar o tipo de campo"). O inspetor mostra só os atributos válidos para o tipo (por exemplo marcado, para checkbox e radio; mínimo, máximo e passo, para número, intervalo, data e hora). A troca mantém os atributos que continuam válidos e descarta os demais: virar checkbox descarta o placeholder. Cada troca é um passo de desfazer. São recusados o tipo inválido (status.input.invalidType), a troca que a regra de formulário não aceita (status.forms.requiresText) e a edição em elemento travado, com o documento intacto.

## REQ-0912 — element.setLabelTarget
- **Onde:** `manifest/commands/elements.json:4411` `"id": "element.setLabelTarget",`
- **Tratador:** `src/app/commands.ts:246` `'element.setLabelTarget': setLabelTargetCommand,`
- **Feature:** `src/app/features.ts:115` `'elements-form-inputs-rules': registerFeature('elements-form-inputs-rules'),`
- **Comportamento esperado:** Escolher o controle rotulado ("Escolher o controle rotulado") no campo "for" do rótulo. O campo oferece os ids dos controles de formulário da página e dá id ao controle quando ele não tem (o input sem id ganha "input"); o rótulo exportado aponta para esse id. Cada escolha é um passo de desfazer. São recusados o elemento que não é rótulo (status.label.notLabel), o alvo que não é controle (status.label.notControl) e a edição em elemento travado, com o documento intacto.

## REQ-0913 — element.setCustomAttribute
- **Onde:** `manifest/commands/elements.json:4469` `"id": "element.setCustomAttribute",`
- **Tratador:** `src/app/commands.ts:247` `'element.setCustomAttribute': setCustomAttributeCommand,`
- **Feature:** `src/app/features.ts:112` `'element-attributes-aria': registerFeature('element-attributes-aria'),`
- **Comportamento esperado:** Adicionar um atributo personalizado pelo inspetor ("Definir um atributo personalizado"): aria-*, data-* e role. O atributo é guardado no documento JSON do elemento, é desenhado no iframe e sai na exportação — são atributos do usuário, distintos dos atributos que o editor gera e que a exportação não escreve. O status mostra status.attribute.added ao adicionar e status.attribute.set ao mudar o valor; cada mudança é um passo de desfazer. São recusados os atributos de evento (on*) com status.attribute.eventHandler, os nomes inválidos com status.attribute.invalidName, os atributos reservados ao editor (status.attribute.reserved) e a edição em elemento travado, com o documento intacto.

## REQ-0914 — element.removeCustomAttribute
- **Onde:** `manifest/commands/elements.json:4559` `"id": "element.removeCustomAttribute",`
- **Tratador:** `src/app/commands.ts:248` `'element.removeCustomAttribute': removeCustomAttributeCommand,`
- **Feature:** `src/app/features.ts:112` `'element-attributes-aria': registerFeature('element-attributes-aria'),`
- **Comportamento esperado:** Remover um atributo personalizado pelo botão de remover do inspetor ("Remover o atributo"). O atributo sai do documento JSON e do iframe; o status mostra status.attribute.removed e a remoção é um passo de desfazer. A edição em elemento travado é recusada com o documento intacto.

## REQ-0915 — element.setSvgMarkup
- **Onde:** `manifest/commands/elements.json:4615` `"id": "element.setSvgMarkup",`
- **Tratador:** `src/app/commands.ts:249` `'element.setSvgMarkup': setSvgMarkupCommand,`
- **Feature:** `src/app/features.ts:120` `'elements-svg-shapes': registerFeature('elements-svg-shapes'),`
- **Comportamento esperado:** Gravar a marcação do SVG pelo campo de marcação ("Definir a marcação SVG"): a marcação digitada ou colada vira o conteúdo do SVG, desenhada no iframe e exportada como foi escrita, com scripts e atributos de evento removidos; o status mostra status.svg.set e a gravação é um passo de desfazer. São recusados, com aviso e o documento intacto, a marcação com elemento nunca fechado (status.svg.unclosed), a tag de fechamento que não fecha nada (status.svg.unmatched) e a marcação quebrada (status.svg.broken); a edição em elemento travado e o elemento a que o campo não se aplica também são recusados.

## REQ-0916 — element.setEmbedMarkup
- **Onde:** `manifest/commands/elements.json:4675` `"id": "element.setEmbedMarkup",`
- **Tratador:** `src/app/commands.ts:250` `'element.setEmbedMarkup': setEmbedMarkupCommand,`
- **Feature:** `src/app/features.ts:163` `'embed-html': registerFeature('embed-html'),`
- **Comportamento esperado:** Gravar o HTML incorporado pelo campo de marcação do Embed ("Definir o HTML incorporado"). A marcação fica guardada como está, é mostrada em sandbox no canvas do editor — onde os scripts dela nunca rodam —, roda na visualização prévia e sai literal na exportação no lugar do Embed; as Camadas marcam o elemento como incorporado. O status mostra status.embed.set e a gravação é um passo de desfazer. A edição em elemento travado e o elemento a que o Embed não se aplica são recusados com o documento intacto.

## REQ-0917 — element.applyHtml
- **Onde:** `manifest/commands/elements.json:4737` `"id": "element.applyHtml",`
- **Tratador:** `src/app/commands.ts:251` `'element.applyHtml': applyHtmlCommand,`
- **Feature:** `src/app/features.ts:196` `'code-panel-edit-html': registerFeature('code-panel-edit-html'),`
- **Comportamento esperado:** Aplicar sobre o elemento selecionado o HTML editado no painel de código ("Aplicar o HTML"). A marcação é interpretada pelas regras do importador de HTML e substitui a subárvore do elemento no documento JSON como um passo de desfazer; o canvas, as Camadas e o inspetor acompanham, e os nós sem mudança mantêm ids, nomes e estilos. São recusados, com a linha e o motivo e o documento intacto, a marcação que não é um único elemento, a que fere as regras de aninhamento (um p dentro de ul) e a que não pode ser interpretada; a edição em elemento travado também. O status mostra status.html.applied.

## REQ-0918 — parts.toggle
- **Onde:** `manifest/commands/elements.json:4802` `"id": "parts.toggle",`
- **Tratador:** `src/app/commands.ts:252` `'parts.toggle': togglePartCommand,`
- **Feature:** `src/app/features.ts:109` `'elements-tables': registerFeature('elements-tables'),`
- **Comportamento esperado:** Ligar ou desligar uma parte da tabela pelos controles de legenda, cabeçalho e rodapé no inspetor ("Mostrar ou remover uma parte"). A legenda entra como primeiro filho da tabela, o rodapé entra depois do corpo, e o cabeçalho sai e volta; a tabela aceita só uma legenda, um thead e um tfoot, e o iframe desenha caption, thead, tbody, tfoot, tr, th e td em ordem válida. O status mostra status.table.partAdded ao acrescentar e status.table.partRemoved ao remover; cada alternância é um passo de desfazer, e a edição em elemento travado é recusada.

## REQ-0919 — parts.add
- **Onde:** `manifest/commands/elements.json:4920` `"id": "parts.add",`
- **Tratador:** `src/app/commands.ts:253` `'parts.add': addPartCommand,`
- **Feature:** `src/app/features.ts:117` `'elements-form-controls': registerFeature('elements-form-controls'),`
- **Comportamento esperado:** Adicionar uma parte ao elemento selecionado ("Adicionar uma parte"): uma opção ou um grupo de opções no Select — o grupo entra com uma opção dentro —, uma origem no picture e no vídeo, uma faixa no vídeo e as formas retângulo, elipse e linha dentro do SVG. O Select aceita só opção e grupo de opções, e o grupo de opções aceita só opção; as formas entram só num SVG, e o SVG com marcação guardada não recebe peças. O status mostra status.parts.added; cada adição é um passo de desfazer. São recusados o destino que não aceita a peça (status.refused.onlyAccepts), a peça sem pai que a receba (status.refused.requiresParent), a peça onde o aninhamento não a comporta (status.refused.notInside, status.refused.interactiveInside, status.refused.singleChild, status.refused.noChildren), a inserção travada (status.locked.insert) e as peças sobre marcação do SVG (status.svg.holdsMarkup).

## REQ-0920 — parts.move
- **Onde:** `manifest/commands/elements.json:5189` `"id": "parts.move",`
- **Tratador:** `src/app/commands.ts:254` `'parts.move': movePartCommand,`
- **Feature:** `src/app/features.ts:117` `'elements-form-controls': registerFeature('elements-form-controls'),`
- **Comportamento esperado:** Reordenar uma parte do elemento pelas setas de subir e descer ("Reordenar uma parte"): a parte troca de posição na lista do dono e a ordem nova é gravada no documento. O status mostra status.parts.moved, com a parte, a posição nova e o total; cada movimento é um passo de desfazer. O movimento travado é recusado (status.locked.move) com o documento intacto.

## REQ-0921 — parts.remove
- **Onde:** `manifest/commands/elements.json:5280` `"id": "parts.remove",`
- **Tratador:** `src/app/commands.ts:255` `'parts.remove': removePartCommand,`
- **Feature:** `src/app/features.ts:117` `'elements-form-controls': registerFeature('elements-form-controls'),`
- **Comportamento esperado:** Remover uma parte do elemento pelo botão de remover ("Remover uma parte"), como uma opção do Select. A parte sai do documento e a seleção fica no dono; o status mostra status.parts.removed e a remoção é um passo de desfazer. A edição em elemento travado é recusada com o documento intacto.

## REQ-0922 — table.addColumnAfter
- **Onde:** `manifest/commands/elements.json:5336` `"id": "table.addColumnAfter",`
- **Tratador:** `src/app/commands.ts:256` `'table.addColumnAfter': addColumnAfterCommand,`
- **Feature:** `src/app/features.ts:110` `'table-commands': registerFeature('table-commands'),`
- **Recusa declarada:** `manifest/commands/elements.json:5343` `"refusalKey": "status.table.selectCell"`
- **Comportamento esperado:** Adicionar uma coluna depois da coluna da célula selecionada, pelo menu de contexto ("Adicionar uma coluna depois desta"). A célula nova entra no mesmo índice em todas as linhas — th nas linhas de cabeçalho, td nas demais. O status lê o número de linhas alcançadas (status.table.columnCreated) e o comando é um passo de desfazer. Vale a recusa declarada status.table.selectCell: sem célula selecionada o comando não age; a edição em elemento travado é recusada.

## REQ-0923 — table.addColumnEnd
- **Onde:** `manifest/commands/elements.json:5401` `"id": "table.addColumnEnd",`
- **Tratador:** `src/app/commands.ts:257` `'table.addColumnEnd': addColumnEndCommand,`
- **Feature:** `src/app/features.ts:110` `'table-commands': registerFeature('table-commands'),`
- **Recusa declarada:** `manifest/commands/elements.json:5408` `"refusalKey": "status.table.selectPart"`
- **Comportamento esperado:** Adicionar uma coluna no final de todas as linhas da tabela ("Adicionar uma coluna no final"). A célula nova entra como última de cada linha — th nas linhas de cabeçalho, td nas demais. O status lê o número de linhas alcançadas (status.table.columnCreated) e o comando é um passo de desfazer. Vale a recusa declarada status.table.selectPart: fora de uma tabela o comando não age; a edição em elemento travado é recusada.

## REQ-0924 — table.removeColumn
- **Onde:** `manifest/commands/elements.json:5466` `"id": "table.removeColumn",`
- **Tratador:** `src/app/commands.ts:258` `'table.removeColumn': removeColumnCommand,`
- **Feature:** `src/app/features.ts:110` `'table-commands': registerFeature('table-commands'),`
- **Recusa declarada:** `manifest/commands/elements.json:5473` `"refusalKey": "status.table.selectCell"`
- **Comportamento esperado:** Remover a coluna da célula selecionada de todas as linhas da tabela ("Remover esta coluna"). A célula daquele índice some de cada linha e a seleção fica na célula remanescente; o status lê o número de linhas alcançadas (status.table.columnRemoved) e o comando é um passo de desfazer. Vale a recusa declarada status.table.selectCell: sem célula selecionada o comando não age; a última coluna (status.table.lastColumn) e a edição em elemento travado são recusadas, com o documento intacto.

## REQ-0925 — table.addRowAfter
- **Onde:** `manifest/commands/elements.json:5532` `"id": "table.addRowAfter",`
- **Tratador:** `src/app/commands.ts:259` `'table.addRowAfter': addRowAfterCommand,`
- **Feature:** `src/app/features.ts:110` `'table-commands': registerFeature('table-commands'),`
- **Recusa declarada:** `manifest/commands/elements.json:5539` `"refusalKey": "status.table.selectCell"`
- **Comportamento esperado:** Adicionar uma linha depois da linha da célula selecionada ("Adicionar uma linha depois desta"). A linha nova copia a estrutura de células da linha da célula, com células vazias. O status lê o nome da linha nova (status.table.rowCreated) e o comando é um passo de desfazer. Vale a recusa declarada status.table.selectCell: sem célula selecionada o comando não age; a edição em elemento travado é recusada.

## REQ-0926 — table.removeRow
- **Onde:** `manifest/commands/elements.json:5597` `"id": "table.removeRow",`
- **Tratador:** `src/app/commands.ts:260` `'table.removeRow': removeRowCommand,`
- **Feature:** `src/app/features.ts:110` `'table-commands': registerFeature('table-commands'),`
- **Recusa declarada:** `manifest/commands/elements.json:5604` `"refusalKey": "status.table.selectCell"`
- **Comportamento esperado:** Remover a linha da célula selecionada ("Remover esta linha"). A linha some e a seleção fica na célula remanescente; o status lê o nome da linha removida (status.table.rowRemoved) e o comando é um passo de desfazer. Vale a recusa declarada status.table.selectCell: sem célula selecionada o comando não age; a última linha (status.table.lastRow) e a edição em elemento travado são recusadas, com o documento intacto.

# Requisitos — domínio events

## REQ-1001 — interactions.add
- **Onde:** `manifest/commands/events.json:5` `"id": "interactions.add",`
- **Tratador:** `src/app/commands.ts:261` `'interactions.add': addInteractionCommand,`
- **Feature:** `src/app/features.ts:203` `'events-actions': registerFeature('events-actions'),`
- **Recusa declarada:** `manifest/commands/events.json:46` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** A pessoa adiciona uma interação ao elemento selecionado; a funcionalidade é a events-actions, "Eventos e ações por elemento" (`src/i18n/locales/pt-BR.json:712` `"feature.eventsActions": "Eventos e ações por elemento",`), e o rótulo do comando em pt-BR é "Adicionar uma interação" (`src/i18n/locales/pt-BR.json:383` `"command.interactions.add": "Adicionar uma interação",`). O comando exige seleção única (`manifest/commands/events.json:45` `"predicate": "singleSelection",`); sem ela a porta fica desabilitada com o motivo "Isto exige uma seleção única." (`manifest/commands/events.json:75` `"disabledReasonKey": "status.needsSingleSelection",`; `src/i18n/locales/pt-BR.json:1857` `"status.needsSingleSelection": "Isto exige uma seleção única.",`). A interação nova nasce com o gatilho de clique e a ação de mostrar (`manifest/features/18-animation-and-events.json:2419` `"trigger": "click",`; `manifest/features/18-animation-and-events.json:2420` `"action": "show"`). Os gatilhos são clique, passar o ponteiro (entrar e sair), entrar na área visível, carregar a página e enviar formulário; as ações são mostrar, esconder, alternar classe, rodar animação, rolar até e abrir link (`manifest/features/18-animation-and-events.json:2368` `"Triggers are click, hover (enter and leave), scroll into view, page load and form submit; actions are show, hide, toggle class, play animation, scroll to and open link.",`). A interação é gravada no elemento, no JSON do documento (`manifest/features/18-animation-and-events.json:2370` `"Interactions are stored per element in the document JSON; each add, edit and remove is one undo step.",`): o cenário "an-interaction-is-added-to-the-selected-element" grava em "/Page/Hero/@interactions" (`manifest/features/18-animation-and-events.json:2416` `"path": "/Page/Hero/@interactions",`). O canvas de edição nunca executa as interações (`manifest/features/18-animation-and-events.json:2371` `"The editing canvas never runs them."`). A adição é desfazível (`manifest/commands/events.json:55` `"undoable": true,`), é uma transação por despacho (`manifest/commands/events.json:58` `"transaction": "per-dispatch",`), sem mudança não entra no histórico (`manifest/commands/events.json:59` `"noChange": "no-entry"`), e o desfazer devolve a seleção anterior ao comando (`manifest/commands/events.json:57` `"undoRestoresSelection": "before-command",`). A confirmação anuncia a interação e o total: "Interação adicionada em {element}. Total: {count}." (`src/i18n/locales/pt-BR.json:1812` `"status.interactions.added": "Interação adicionada em {element}. Total: {count}.",`). O manifesto também declara as recusas de opções inválidas (`manifest/commands/events.json:49` `"status.interactions.badOptions",`), de gatilho que não se aplica (`manifest/commands/events.json:50` `"status.interactions.notApplicable",`) e de documento travado (`manifest/commands/events.json:51` `"status.locked.edit"`; `src/i18n/locales/pt-BR.json:1845` `"status.locked.edit": "Desbloqueie {name} antes de alterá-lo.",`). A gravação fica no contexto em que a edição foi feita (G1) e a seleção não muda com o comando, como o cenário espera.

## REQ-1002 — interactions.update
- **Onde:** `manifest/commands/events.json:91` `"id": "interactions.update",`
- **Tratador:** `src/app/commands.ts:262` `'interactions.update': INTERACTIONS_UPDATE,`
- **Feature:** `src/app/features.ts:203` `'events-actions': registerFeature('events-actions'),`
- **Comportamento esperado:** A pessoa muda um campo da interação escolhida — gatilho, ação, alvo, valor, opções, escopo ou nova aba — pelos campos do inspetor, pelo clique no canvas, por um item de Camadas ou pelo botão de nova aba; o rótulo do comando em pt-BR é "Mudar a interação" (`src/i18n/locales/pt-BR.json:385` `"command.interactions.update": "Mudar a interação",`). O alvo é escolhido na página ou em Camadas, nunca digitado (`manifest/features/18-animation-and-events.json:2369` `"Targets are picked from the page or Layers, never typed ids; combinations that cannot apply (form submit on a non-form) are not offered.",`); o clique no canvas grava o caminho do nó escolhido (`manifest/features/18-animation-and-events.json:2656` `"target": "@/Page/Hero/Intro"`). Mudar gatilho, ação, valor e escopo grava os campos da interação, como o escopo "card" (`manifest/features/18-animation-and-events.json:2552` `"scope": "card"`). A ação abrir link guarda o endereço (`manifest/features/18-animation-and-events.json:2870` `"address": "https://example.com/plans",`) e o pedido de nova aba (`manifest/features/18-animation-and-events.json:2871` `"newTab": true`). As opções aceitam "once 200ms" — uma vez, com atraso de 200 (`manifest/features/18-animation-and-events.json:3131` `"once": true,`; `manifest/features/18-animation-and-events.json:3132` `"delay": 200`) — e "always" — toda vez (`manifest/features/18-animation-and-events.json:3234` `"once": false`). Cada mudança é um passo de desfazer (`manifest/features/18-animation-and-events.json:2370` `"Interactions are stored per element in the document JSON; each add, edit and remove is one undo step.",`) e a confirmação é "Interação de {element} alterada." (`src/i18n/locales/pt-BR.json:1816` `"status.interactions.updated": "Interação de {element} alterada.",`). Gatilho que não se aplica é recusado com o documento intacto — "Este gatilho não se aplica a {name}." (`src/i18n/locales/pt-BR.json:1813` `"status.interactions.notApplicable": "Este gatilho não se aplica a {name}.",`) — e um texto de opções que não é opção também: "“{text}” não é uma opção: escreva uma vez ou toda vez, e um atraso como 200ms." (`src/i18n/locales/pt-BR.json:1814` `"status.interactions.badOptions": "“{text}” não é uma opção: escreva uma vez ou toda vez, e um atraso como 200ms.",`). O manifesto declara também as recusas de documento travado (`manifest/commands/events.json:127` `"status.locked.edit",`) e de endereço não permitido (`manifest/commands/events.json:128` `"status.url.unsafe"`; `src/i18n/locales/pt-BR.json:2008` `"status.url.unsafe": "Este endereço não é permitido: {url}",`). Todas as portas do comando entregam a mesma intenção ao mesmo tratador (G3) e a gravação fica no contexto em que a edição foi feita (G1).

## REQ-1003 — interactions.remove
- **Onde:** `manifest/commands/events.json:393` `"id": "interactions.remove",`
- **Tratador:** `src/app/commands.ts:263` `'interactions.remove': removeInteractionCommand,`
- **Feature:** `src/app/features.ts:203` `'events-actions': registerFeature('events-actions'),`
- **Comportamento esperado:** A pessoa remove uma interação do elemento pelo botão de remover do inspetor; o rótulo do comando em pt-BR é "Remover a interação" (`src/i18n/locales/pt-BR.json:384` `"command.interactions.remove": "Remover a interação",`). O passo do intent é "Remove an action and undo." (`manifest/features/18-animation-and-events.json:2365` `"Remove an action and undo."`). No cenário "an-interaction-is-removed" a remoção devolve o documento ao estado anterior (`manifest/features/18-animation-and-events.json:2952` `"document": [],`) e a seleção continua a mesma. A remoção é desfazível em um passo (`manifest/features/18-animation-and-events.json:2370` `"Interactions are stored per element in the document JSON; each add, edit and remove is one undo step.",`) e a confirmação é "Interação de {element} removida." (`src/i18n/locales/pt-BR.json:1815` `"status.interactions.removed": "Interação de {element} removida.",`). O manifesto declara a recusa de documento travado (`manifest/commands/events.json:409` `"status.locked.edit"`; `src/i18n/locales/pt-BR.json:1845` `"status.locked.edit": "Desbloqueie {name} antes de alterá-lo.",`). A gravação fica no contexto em que a edição foi feita (G1) e o desfazer devolve a seleção anterior ao comando (`manifest/commands/events.json:415` `"undoRestoresSelection": "before-command",`).

## REQ-1101 — pages.add (adicionar uma página)
- **Onde:** `manifest/commands/files.json:5` `"id": "pages.add",`
- **Tratador:** `src/app/commands.ts:296` `'pages.add': addPageCommand<EditorUi>(),`
- **Feature:** `src/app/features.ts:213` `'explorer-pages': registerFeature('explorer-pages'),`
- **Comportamento esperado:** O botão + do explorador, rotulado "Adicionar uma página" (`src/i18n/locales/pt-BR.json:412` `"command.pages.add": "Adicionar uma página",`), acrescenta uma página ao projeto. Sem nome no campo, ela toma o próximo nome livre (Page, Page 2…) e o campo de nome da página nova recebe o foco com o nome selecionado (`manifest/features/19-pages-files-assets.json:31` `"The + with no name given takes the next free name (Page, Page 2…), and the new page's name field takes the focus with its name selected.",`). Cada página é um arquivo .html cujo caminho segue o nome (about-us.html), com árvore própria no JSON do projeto, e o explorador lista as páginas como arquivos .html, com a ativa destacada e desenhada no canvas (`manifest/features/19-pages-files-assets.json:26` `"The Explorer lists the project pages as .html files; the active page is highlighted and shown on the canvas.",`). Nome já tomado é recusado com a mensagem `manifest/commands/files.json:21` `"status.pages.nameTaken"`. A criação é um passo de undo (`manifest/features/19-pages-files-assets.json:28` `"The home page cannot be deleted; delete asks for confirmation; every page operation is an undo step.",`), a árvore confirma com `manifest/features/19-pages-files-assets.json:125` `"key": "status.pages.added",` e a página ativa é restaurada ao recarregar (`manifest/features/19-pages-files-assets.json:30` `"The active page is restored after reload.",`).

## REQ-1102 — pages.rename (renomear a página)
- **Onde:** `manifest/commands/files.json:63` `"id": "pages.rename",`
- **Tratador:** `src/app/commands.ts:297` `'pages.rename': renamePageCommand,`
- **Feature:** `src/app/features.ts:213` `'explorer-pages': registerFeature('explorer-pages'),`
- **Comportamento esperado:** O campo de nome da página no explorador, rotulado "Renomear a página" (`src/i18n/locales/pt-BR.json:415` `"command.pages.rename": "Renomear a página",`), troca o nome da página indicada. A raiz da página é renomeada junto, de modo que as Camadas, a trilha e a barra de status nomeiam a página como a pessoa a nomeou (`manifest/features/19-pages-files-assets.json:32` `"Renaming a page renames its root too (unique among the pages' roots), so the Layers, the breadcrumb and the status bar name the page as the person does."`). Renomear a página inicial mantém o arquivo index.html (`manifest/features/19-pages-files-assets.json:464` `"file": "index.html",`). Nome já usado é recusado com a mensagem `manifest/commands/files.json:85` `"status.pages.nameTaken"`. A renomeação é um passo de undo (`manifest/features/19-pages-files-assets.json:28` `"The home page cannot be deleted; delete asks for confirmation; every page operation is an undo step.",`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:490` `"key": "status.pages.renamed",`. Pela regra G2, a digitação pendente é gravada antes de qualquer entrada que a perderia (`CLAUDE.md:79` `### G2. Digitação nunca some`).

## REQ-1103 — pages.duplicate (duplicar a página)
- **Onde:** `manifest/commands/files.json:125` `"id": "pages.duplicate",`
- **Tratador:** `src/app/commands.ts:298` `'pages.duplicate': duplicatePageCommandFor<EditorUi>(),`
- **Feature:** `src/app/features.ts:213` `'explorer-pages': registerFeature('explorer-pages'),`
- **Comportamento esperado:** Duplicar a página (`src/i18n/locales/pt-BR.json:414` `"command.pages.duplicate": "Duplicar a página",`) cria a cópia logo depois da página original (`manifest/features/19-pages-files-assets.json:509` `"id": "duplicating-a-page-adds-the-copy-right-after-it",`). No cenário, a cópia da página inicial recebe o nome "Home 2" e o arquivo home-2.html (`manifest/features/19-pages-files-assets.json:566` `"name": "Home 2",`; `manifest/features/19-pages-files-assets.json:567` `"file": "home-2.html",`). A duplicação é um passo de undo (`manifest/features/19-pages-files-assets.json:28` `"The home page cannot be deleted; delete asks for confirmation; every page operation is an undo step.",`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:593` `"key": "status.pages.duplicated",`.

## REQ-1104 — pages.delete (excluir a página)
- **Onde:** `manifest/commands/files.json:180` `"id": "pages.delete",`
- **Tratador:** `src/app/commands.ts:299` `'pages.delete': deletePageCommand,`
- **Feature:** `src/app/features.ts:213` `'explorer-pages': registerFeature('explorer-pages'),`
- **Comportamento esperado:** Excluir a página (`src/i18n/locales/pt-BR.json:413` `"command.pages.delete": "Excluir a página",`) pede confirmação antes de excluir (`manifest/commands/files.json:200` `"messageKey": "dialog.deletePage.message",`). A página inicial não pode ser excluída: o comando recusa com `manifest/commands/files.json:197` `"status.pages.homeUndeletable"` e o documento fica intacto, sem passo de undo (`manifest/features/19-pages-files-assets.json:1028` `"key": "status.pages.homeUndeletable",`). Confirmada, a exclusão é um passo de undo (`manifest/features/19-pages-files-assets.json:28` `"The home page cannot be deleted; delete asks for confirmation; every page operation is an undo step.",`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:1104` `"key": "status.pages.deleted",`; cancelada, a página fica e a mensagem é `manifest/features/19-pages-files-assets.json:1212` `"key": "status.confirmation.cancelled",`.

## REQ-1105 — pages.switch (abrir a página)
- **Onde:** `manifest/commands/files.json:241` `"id": "pages.switch",`
- **Tratador:** `src/app/commands.ts:300` `'pages.switch': SWITCH_PAGE,`
- **Feature:** `src/app/features.ts:213` `'explorer-pages': registerFeature('explorer-pages'),`
- **Comportamento esperado:** Abrir a página (`src/i18n/locales/pt-BR.json:416` `"command.pages.switch": "Abrir a página",`) torna a página indicada a ativa, destacada no explorador e mostrada no canvas (`manifest/features/19-pages-files-assets.json:26` `"The Explorer lists the project pages as .html files; the active page is highlighted and shown on the canvas.",`). Quatro portas levam a mesma intenção: a linha do explorador, a aba de arquivo, o seletor da barra superior e a entrada da barra de comandos (`src/i18n/locales/pt-BR.json:3480` `"commandBar.goToPage": "Ir para a página {page}",`); pela regra G3, todas as portas do comando convergem no mesmo tratador (`CLAUDE.md:93` `### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado`). A árvore confirma com `manifest/features/19-pages-files-assets.json:724` `"key": "status.pages.opened",`. Abrir não altera o documento nem entra na pilha de undo (`manifest/commands/files.json:260` `"undoable": false`), e a página ativa é restaurada ao recarregar (`manifest/features/19-pages-files-assets.json:30` `"The active page is restored after reload.",`).

## REQ-1106 — files.createFolder (nova pasta)
- **Onde:** `manifest/commands/files.json:367` `"id": "files.createFolder",`
- **Tratador:** `src/app/commands.ts:301` `'files.createFolder': createFolderCommand,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Nova pasta (`src/i18n/locales/pt-BR.json:341` `"command.files.newFolder": "Nova pasta",`): o campo do explorador cria a pasta no caminho indicado (`manifest/features/19-pages-files-assets.json:1262` `"id": "a-folder-and-a-file-are-made-by-their-paths",`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:1319` `"key": "status.files.folderCreated",`. Os nomes são únicos por pasta (`manifest/features/19-pages-files-assets.json:1252` `"Files and folders can be created, renamed, moved (drag and drop, and a Move to… command) and deleted; names are unique per folder.",`), e nome já tomado é recusado com `manifest/commands/files.json:383` `"status.files.nameTaken",` (`manifest/features/19-pages-files-assets.json:2494` `"id": "a-folder-name-already-taken-is-refused",`). Criar num dos caminhos gerados é recusado com `manifest/commands/files.json:384` `"status.files.generatedPath",` e nome inválido com `manifest/commands/files.json:385` `"status.files.badName"`. A criação é um passo de undo (`manifest/features/19-pages-files-assets.json:1255` `"Deleting a folder that holds files asks for confirmation; every operation is one undo step.",`), e a árvore fica guardada com o projeto em IndexedDB e volta ao recarregar (`manifest/features/19-pages-files-assets.json:1257` `The tree is stored with the project in IndexedDB and restored after reload`).

## REQ-1107 — files.createFile (novo arquivo)
- **Onde:** `manifest/commands/files.json:425` `"id": "files.createFile",`
- **Tratador:** `src/app/commands.ts:302` `'files.createFile': createFileCommand,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Novo arquivo (`src/i18n/locales/pt-BR.json:340` `"command.files.newFile": "Novo arquivo",`): o campo do explorador cria o arquivo no caminho indicado (`manifest/features/19-pages-files-assets.json:1338` `"id": "a-file-is-made-in-a-folder-by-its-path",`); no cenário, js/main.js nasce vazio e do tipo text/javascript (`manifest/features/19-pages-files-assets.json:1400` `"type": "text/javascript",`; `manifest/features/19-pages-files-assets.json:1401` `"bytes": ""`), e a árvore confirma com `manifest/features/19-pages-files-assets.json:1417` `"key": "status.files.fileCreated",`. As recusas do comando são `manifest/commands/files.json:441` `"status.files.nameTaken",`, `manifest/commands/files.json:442` `"status.files.generatedPath",` e `manifest/commands/files.json:443` `"status.files.badName"`; o cenário do caminho gerado cria css/styles.css e é recusado (`manifest/features/19-pages-files-assets.json:1811` `"id": "a-generated-path-is-refused",`). A criação é um passo de undo (`manifest/features/19-pages-files-assets.json:1255` `"Deleting a folder that holds files asks for confirmation; every operation is one undo step.",`). O painel Código usa esta porta para criar o arquivo que vai editar (`manifest/features/19-pages-files-assets.json:6914` `"files.createFile",`; no cenário, `manifest/features/19-pages-files-assets.json:7013` `"path": "js/main.js",`).

## REQ-1108 — files.startRename (renomear este arquivo ou pasta)
- **Onde:** `manifest/commands/files.json:483` `"id": "files.startRename",`
- **Tratador:** `src/app/commands.ts:303` `'files.startRename': startRenameFile,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Renomear este arquivo ou pasta (`src/i18n/locales/pt-BR.json:345` `"command.files.startRename": "Renomear este arquivo ou pasta",`): o botão de renomear da linha do explorador abre o campo que renomeia aquela linha (`manifest/features/19-pages-files-assets.json:2294` `"id": "the-rows-name-opens-the-field-that-renames-it",`), sem alterar o documento e sem passo de undo próprio (`manifest/commands/files.json:501` `"undoable": false`). A gravação do nome novo vem depois, pelo comando do campo (`manifest/features/19-pages-files-assets.json:1436` `"id": "a-files-name-is-kept-from-its-row",`).

## REQ-1109 — files.rename (renomear)
- **Onde:** `manifest/commands/files.json:533` `"id": "files.rename",`
- **Tratador:** `src/app/commands.ts:304` `'files.rename': renameFileCommand,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Renomear (`src/i18n/locales/pt-BR.json:343` `"command.files.rename": "Renomear",`): o campo do nome no explorador troca o nome do arquivo ou da pasta indicada e a árvore confirma com `manifest/features/19-pages-files-assets.json:1520` `"key": "status.files.renamed",`. Os nomes são únicos por pasta (`manifest/features/19-pages-files-assets.json:1252` `"Files and folders can be created, renamed, moved (drag and drop, and a Move to… command) and deleted; names are unique per folder.",`) e renomear uma pasta leva os arquivos dela junto: no cenário, docs com docs/a.txt vira notes com notes/a.txt (`manifest/features/19-pages-files-assets.json:2378` `"id": "a-folders-name-is-kept-and-its-files-go-with-it",`; `manifest/features/19-pages-files-assets.json:2462` `"path": "notes/a.txt",`). Renomear o arquivo de uma página renomeia a página (`manifest/features/19-pages-files-assets.json:1254` `renaming a page file renames its page and moving it moves the page`). Recusas: `manifest/commands/files.json:554` `"status.files.nameTaken",`, `manifest/commands/files.json:555` `"status.files.generatedPath",`, `manifest/commands/files.json:556` `"status.files.pageNeedsHtml",` e `manifest/commands/files.json:557` `"status.files.badName"`. A renomeação é um passo de undo (`manifest/features/19-pages-files-assets.json:1255` `"Deleting a folder that holds files asks for confirmation; every operation is one undo step.",`) e, pela regra G2, a digitação pendente é gravada antes de qualquer entrada que a perderia (`CLAUDE.md:79` `### G2. Digitação nunca some`).

## REQ-1110 — files.move (mover para…)
- **Onde:** `manifest/commands/files.json:597` `"id": "files.move",`
- **Tratador:** `src/app/commands.ts:305` `'files.move': moveFileCommand,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Mover para… (`src/i18n/locales/pt-BR.json:339` `"command.files.moveTo": "Mover para…",`) leva o arquivo ou a pasta para a pasta de destino. Três portas levam a mesma intenção: o arraste da linha do explorador até a pasta (`manifest/features/19-pages-files-assets.json:1879` `"id": "a-row-is-dragged-into-a-folder",`), o botão que escolhe o destino (`manifest/features/19-pages-files-assets.json:1986` `"id": "the-move-to-button-stands-for-the-folder-the-row-is-in",`) e a escolha do destino (`manifest/features/19-pages-files-assets.json:1534` `"id": "a-file-moves-into-a-folder-through-the-entries",`); pela regra G3, todas convergem no mesmo tratador (`CLAUDE.md:93` `### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado`). A árvore confirma com `manifest/features/19-pages-files-assets.json:1637` `"key": "status.files.moved",` e o arquivo passa a viver na pasta nova (`manifest/features/19-pages-files-assets.json:1619` `"path": "src/note.txt",`). Recusas: `manifest/commands/files.json:623` `"status.files.nameTaken",`, `manifest/commands/files.json:624` `"status.files.generatedPath",`, `manifest/commands/files.json:625` `"status.files.pageNeedsHtml",` e `manifest/commands/files.json:626` `"status.files.badName"`. O movimento é um passo de undo por gesto (`manifest/commands/files.json:633` `"transaction": "per-gesture",`).

## REQ-1111 — files.delete (excluir)
- **Onde:** `manifest/commands/files.json:712` `"id": "files.delete",`
- **Tratador:** `src/app/commands.ts:306` `'files.delete': deleteFileCommand,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Excluir (`src/i18n/locales/pt-BR.json:338` `"command.files.delete": "Excluir",`) exclui o arquivo ou a pasta após confirmação (`manifest/commands/files.json:732` `"messageKey": "dialog.deleteFiles.message",`). A pasta sai com o conteúdo: no cenário, excluir src confirmada leva src/note.txt junto (`manifest/features/19-pages-files-assets.json:2089` `"id": "a-file-a-row-holds-is-deleted-after-the-confirmation",`; `manifest/features/19-pages-files-assets.json:2172` `"key": "status.files.deleted",`). Caminho gerado é recusado (`manifest/commands/files.json:728` `"status.files.generatedPath",`) e pasta que guarda o arquivo de uma página também (`manifest/commands/files.json:729` `"status.files.holdsPage"`), porque uma pasta que guarda um arquivo de página não pode ser excluída (`manifest/features/19-pages-files-assets.json:1254` `a folder that holds a page file cannot be deleted`). Excluir um arquivo sem uso o tira da árvore e do IndexedDB, como um passo de undo (`manifest/features/19-pages-files-assets.json:3627` `"Deleting an unused file removes it from the tree and from IndexedDB, as an undo step."`), e excluir um arquivo em uso, ou uma pasta que guarda um, pede confirmação e lista onde ele é usado (`manifest/features/19-pages-files-assets.json:3833` `Deleting an asset in use, or a folder that holds one, asks for confirmation and lists where it is used`).

## REQ-1112 — files.open (abrir no painel Código)
- **Onde:** `manifest/commands/files.json:773` `"id": "files.open",`
- **Tratador:** `src/app/commands.ts:307` `'files.open': openFile,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Abrir no painel Código (`src/i18n/locales/pt-BR.json:342` `"command.files.open": "Abrir no painel Código",`): a linha do arquivo no explorador e a aba de arquivo abrem o arquivo no painel Código (`manifest/features/19-pages-files-assets.json:1256` `Clicking a page file or css/styles.css opens it in the Code panel`); pela regra G3, as duas portas convergem no mesmo tratador (`CLAUDE.md:93` `### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado`). O cenário abre um arquivo de página pela linha do explorador (`manifest/features/19-pages-files-assets.json:1652` `"id": "a-page-file-is-opened-in-the-code-pane-by-its-row",`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:1701` `"key": "status.files.opened",`. Abrir não altera o documento nem entra na pilha de undo (`manifest/commands/files.json:791` `"undoable": false`).

## REQ-1113 — files.closeTab (fechar a aba do arquivo)
- **Onde:** `manifest/commands/files.json:849` `"id": "files.closeTab",`
- **Tratador:** `src/app/commands.ts:308` `'files.closeTab': closeFileTab,`
- **Feature:** `src/app/features.ts:214` `'explorer-file-system': registerFeature('explorer-file-system'),`
- **Comportamento esperado:** Fechar a aba do arquivo (`src/i18n/locales/pt-BR.json:337` `"command.files.closeTab": "Fechar a aba do arquivo",`): o botão de fechar da aba fecha o arquivo que o painel mostra (`manifest/features/19-pages-files-assets.json:1726` `"id": "a-file-tab-closes-the-file-the-pane-shows",`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:1786` `"key": "status.files.closed",`; o cenário espera de volta a moldura do canvas (`manifest/features/19-pages-files-assets.json:1796` `"region": "canvas-frame",`). Fechar não altera o documento nem entra na pilha de undo (`manifest/commands/files.json:867` `"undoable": false`).

## REQ-1114 — files.upload (enviar arquivos)
- **Onde:** `manifest/commands/files.json:899` `"id": "files.upload",`
- **Tratador:** `src/app/commands.ts:309` `'files.upload': uploadCommand,`
- **Feature:** `src/app/features.ts:216` `'explorer-assets': registerFeature('explorer-assets'),`
- **Comportamento esperado:** Enviar arquivos (`src/i18n/locales/pt-BR.json:346` `"command.files.upload": "Enviar arquivos",`): o botão de envio, com o seletor de arquivos, e o arraste de um arquivo do sistema para uma pasta do explorador levam a mesma intenção; pela regra G3, as duas portas convergem no mesmo tratador (`CLAUDE.md:93` `### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado`). O arquivo vira um arquivo comum da árvore: entra na pasta em que foi enviado ou solto (img/ para imagens e fonts/ para fontes por padrão), fica guardado no IndexedDB e é listado com miniatura para imagens, nome e tamanho (`manifest/features/19-pages-files-assets.json:3625` `stored in IndexedDB, placed in the folder they were uploaded or dropped into (img/ by default for images, fonts/ for fonts), and listed with a thumbnail for images, their name and size`), sobrevivendo ao recarregar (`manifest/features/19-pages-files-assets.json:3632` `"id": "the-upload-stores-the-file-and-it-survives-a-reload",`). A árvore confirma com `manifest/features/19-pages-files-assets.json:3704` `"key": "status.files.uploaded",`. Recusas: `manifest/commands/files.json:920` `"status.files.nameTaken",` e `manifest/commands/files.json:921` `"status.files.unsupportedType"`. Cada envio é um passo de undo por gesto (`manifest/commands/files.json:928` `"transaction": "per-gesture",`).

## REQ-1115 — files.saveContent (salvar o arquivo)
- **Onde:** `manifest/commands/files.json:983` `"id": "files.saveContent",`
- **Tratador:** `src/app/commands.ts:310` `'files.saveContent': saveFileContentCommand,`
- **Feature:** `src/app/features.ts:224` `'code-panel-edit-js': registerFeature('code-panel-edit-js'),`
- **Comportamento esperado:** Salvar o arquivo (`src/i18n/locales/pt-BR.json:344` `"command.files.save": "Salvar o arquivo",`): o botão do painel Código, a tecla Ctrl+S no editor de código (`manifest/commands/files.json:1049` `"chord": "Ctrl+S",`) e o próprio editor levam o caminho e o conteúdo; pela regra G3, as três portas convergem no mesmo tratador (`CLAUDE.md:93` `### G3. Todas as portas de um comando dão o mesmo resultado no mesmo estado`). A gravação escreve o arquivo na árvore como um passo de undo (`manifest/features/19-pages-files-assets.json:6929` `saving writes the file in the file tree as one undo step`) e a árvore confirma com `manifest/features/19-pages-files-assets.json:7031` `"key": "status.files.saved",`; no cenário, js/main.js termina com o conteúdo digitado (`manifest/features/19-pages-files-assets.json:7013` `"path": "js/main.js",`). Salvar pela tecla grava o que estava digitado (`manifest/features/19-pages-files-assets.json:7061` `"id": "the-panes-save-keeps-what-was-typed-with-its-own-key",`), e pela regra G2 a digitação pendente é gravada antes de qualquer entrada que a perderia (`CLAUDE.md:79` `### G2. Digitação nunca some`). Recusas: erro de sintaxe mostrado com a linha e o motivo (`manifest/commands/files.json:1004` `"status.js.invalidAt",`; `manifest/features/19-pages-files-assets.json:6930` `"Syntax errors are shown with the line and the reason.",`) e caminho gerado, pois js/interactions.js abre somente leitura (`manifest/commands/files.json:1005` `"status.files.generatedPath"`; `manifest/features/19-pages-files-assets.json:6929` `js/interactions.js, which is generated, opens read-only`).

## REQ-1116 — assets.insertImageFile (inserir o arquivo de imagem)
- **Onde:** `manifest/commands/files.json:1099` `"id": "assets.insertImageFile",`
- **Tratador:** `src/app/commands.ts:311` `'assets.insertImageFile': insertImageFileCommand,`
- **Feature:** `src/app/features.ts:217` `'explorer-assets-use': registerFeature('explorer-assets-use'),`
- **Comportamento esperado:** Inserir o arquivo de imagem (`src/i18n/locales/pt-BR.json:291` `"command.assets.insertImage": "Inserir o arquivo de imagem",`): o arraste de um arquivo de imagem do sistema para o canvas guarda o arquivo como asset e insere um elemento Image que o usa na posição da soltura, como um passo de undo (`manifest/features/19-pages-files-assets.json:3831` `"Dropping an image file on the canvas uploads it as an asset and inserts an Image that uses it at the drop position, as one undo step.",`). No cenário, o asset img/photo.png é guardado e o Image nasce com `manifest/features/19-pages-files-assets.json:4101` `"src": "img/photo.png"` (`manifest/features/19-pages-files-assets.json:4020` `"id": "an-image-file-dropped-on-the-canvas-places-an-image",`). A inserção segue as regras de aninhamento, com as recusas de `manifest/commands/files.json:1130` `"status.refused.onlyAccepts",` a `manifest/commands/files.json:1135` `"status.refused.noChildren",`, e, com o documento travado, `manifest/commands/files.json:1136` `"status.locked.insert"`. O passo é por gesto (`manifest/commands/files.json:1143` `"transaction": "per-gesture",`).

## REQ-1201 — focus.next (Próximo item)
- **Onde:** `manifest/commands/focus.json:5` `"id": "focus.next",`
- **Tratador:** `src/app/commands.ts:312` `'focus.next': focusNext,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Leva o foco do teclado ao próximo item da região que o detém — um menu, uma barra de ferramentas ou uma faixa de abas —, na ordem do documento e em ciclo; o rótulo da interface é "Próximo item" (`src/i18n/locales/pt-BR.json:351` `"command.focusNext": "Próximo item",`). O menu de contexto é operável com ArrowUp/ArrowDown e Enter, fecha com Escape ou um clique fora e fica sempre dentro da janela (`manifest/features/02-structure-editing.json:7923` `"The menu is operable with ArrowUp/ArrowDown and Enter, closes with Escape or a click outside, and always stays fully inside the window.",`); o cenário `the-menu-runs-from-the-keyboard` abre o menu sobre `/Page/Hero/Intro` e desce os itens com ArrowDown (`manifest/features/02-structure-editing.json:8554` `"door": "focus.next#key-arrow-down-in-menu",`). Barras de ferramentas e faixas de abas usam roving tabindex, em que as setas movem o foco (`manifest/features/14-accessibility-and-keyboard.json:843` `"Tab strips and toolbars use roving tabindex: arrows move, Home/End jump, Enter/Space activate.",`), e o cenário `the-arrows-walk-the-items-of-a-region` percorre uma barra com ArrowRight (`manifest/features/14-accessibility-and-keyboard.json:1046` `"door": "focus.next#key-arrow-right-in-toolbar",`). Pela G3, cada porta manda só a intenção ao tratador único: o pedido é gravado por `asking(state.ui, 'next')` (`src/editor/focus/focus.ts:24` `asking(state.ui, 'next')`) em `state.ui.focus`, e o instalador o aplica ao foco do DOM quando o estado muda; o documento não é tocado (G7).

## REQ-1202 — focus.menuBar (Abrir a barra de menus)
- **Onde:** `manifest/commands/focus.json:223` `"id": "focus.menuBar",`
- **Tratador:** `src/app/commands.ts:313` `'focus.menuBar': focusMenuBar,`
- **Feature:** `src/app/features.ts:50` `'app-menu': registerFeature('app-menu'),`
- **Comportamento esperado:** Abre a barra de menus do aplicativo pelo teclado, com F10 no contexto global, e põe o foco no primeiro menu da barra; o rótulo da interface é "Abrir a barra de menus" (`src/i18n/locales/pt-BR.json:352` `"command.focusMenuBar": "Abrir a barra de menus",`). A barra de menus abre com Enter ou ArrowDown, anda com as setas, fecha com Escape e devolve o foco ao seu botão (`manifest/features/03-app-and-persistence.json:44` `"The menu opens with Enter or ArrowDown, moves with the arrow keys, closes with Escape and returns focus to the logo button.",`), e o cenário `the-keyboard-walks-the-menu-bar-and-runs-an-item` começa na porta F10 (`manifest/features/03-app-and-persistence.json:400` `"door": "focus.menuBar#key-f10-in-global",`). Pela G3, a porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'menuBar')` (`src/editor/focus/focus.ts:101` `asking(state.ui, 'menuBar')`), aplicado ao foco do DOM quando o estado muda; o documento e o canvas não mudam (G7).

## REQ-1203 — focus.nextMenu (Próximo menu)
- **Onde:** `manifest/commands/focus.json:261` `"id": "focus.nextMenu",`
- **Tratador:** `src/app/commands.ts:314` `'focus.nextMenu': focusNextMenu,`
- **Feature:** `src/app/features.ts:50` `'app-menu': registerFeature('app-menu'),`
- **Comportamento esperado:** Move o foco para o próximo menu da barra de menus; com o foco num item que leva a um submenu, abre esse submenu e põe o foco no primeiro item dele; o rótulo da interface é "Próximo menu" (`src/i18n/locales/pt-BR.json:353` `"command.focusNextMenu": "Próximo menu",`). A barra de menus anda com as setas, fecha com Escape e devolve o foco ao seu botão (`manifest/features/03-app-and-persistence.json:44` `"The menu opens with Enter or ArrowDown, moves with the arrow keys, closes with Escape and returns focus to the logo button.",`); no cenário `the-keyboard-walks-the-menu-bar-and-runs-an-item`, ArrowRight anda da barra para os próximos menus (`manifest/features/03-app-and-persistence.json:409` `"door": "focus.nextMenu#key-arrow-right-in-menu",`). Pela G3, a porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'nextMenu')` (`src/editor/focus/focus.ts:102` `asking(state.ui, 'nextMenu')`); o documento não muda (G7).

## REQ-1204 — focus.previousMenu (Menu anterior)
- **Onde:** `manifest/commands/focus.json:299` `"id": "focus.previousMenu",`
- **Tratador:** `src/app/commands.ts:315` `'focus.previousMenu': focusPreviousMenu,`
- **Feature:** `src/app/features.ts:50` `'app-menu': registerFeature('app-menu'),`
- **Comportamento esperado:** Move o foco para o menu anterior da barra de menus; com o foco dentro de um submenu, fecha o submenu e devolve o foco ao item que o abriu; o rótulo da interface é "Menu anterior" (`src/i18n/locales/pt-BR.json:354` `"command.focusPreviousMenu": "Menu anterior",`). No cenário `the-keyboard-walks-the-menu-bar-and-runs-an-item`, ArrowLeft volta pela barra ao menu anterior (`manifest/features/03-app-and-persistence.json:427` `"door": "focus.previousMenu#key-arrow-left-in-menu",`), e a barra anda com as setas (`manifest/features/03-app-and-persistence.json:44` `"The menu opens with Enter or ArrowDown, moves with the arrow keys, closes with Escape and returns focus to the logo button.",`). Pela G3, a porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'previousMenu')` (`src/editor/focus/focus.ts:103` `asking(state.ui, 'previousMenu')`); o documento não muda (G7).

## REQ-1205 — focus.previous (Item anterior)
- **Onde:** `manifest/commands/focus.json:337` `"id": "focus.previous",`
- **Tratador:** `src/app/commands.ts:316` `'focus.previous': focusPrevious,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Leva o foco ao item anterior da região que detém o foco, na ordem do documento e em ciclo; partindo da região sem item em foco, vai ao último item dela; o rótulo da interface é "Item anterior" (`src/i18n/locales/pt-BR.json:356` `"command.focusPrevious": "Item anterior",`). O menu de contexto é operável com ArrowUp/ArrowDown (`manifest/features/02-structure-editing.json:7923` `"The menu is operable with ArrowUp/ArrowDown and Enter, closes with Escape or a click outside, and always stays fully inside the window.",`), e o cenário `the-menu-runs-from-the-keyboard` sobe os itens com ArrowUp (`manifest/features/02-structure-editing.json:8563` `"door": "focus.previous#key-arrow-up-in-menu",`). Barras de ferramentas e faixas de abas usam roving tabindex, em que as setas movem o foco (`manifest/features/14-accessibility-and-keyboard.json:843` `"Tab strips and toolbars use roving tabindex: arrows move, Home/End jump, Enter/Space activate.",`), e o cenário `the-arrows-walk-the-items-back` anda para trás numa barra (`manifest/features/14-accessibility-and-keyboard.json:1116` `"door": "focus.previous#key-arrow-left-in-toolbar",`). Pela G3, cada porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'previous')` (`src/editor/focus/focus.ts:25` `asking(state.ui, 'previous')`); o documento não muda (G7).

## REQ-1206 — focus.first (Primeiro item)
- **Onde:** `manifest/commands/focus.json:555` `"id": "focus.first",`
- **Tratador:** `src/app/commands.ts:317` `'focus.first': focusFirst,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Leva o foco ao primeiro item da região que o detém; o rótulo da interface é "Primeiro item" (`src/i18n/locales/pt-BR.json:349` `"command.focusFirst": "Primeiro item",`). Barras de ferramentas e faixas de abas usam roving tabindex, em que Home salta ao primeiro item (`manifest/features/14-accessibility-and-keyboard.json:843` `"Tab strips and toolbars use roving tabindex: arrows move, Home/End jump, Enter/Space activate.",`), e o cenário `home-jumps-to-the-first-item-of-a-region` prova o salto numa barra (`manifest/features/14-accessibility-and-keyboard.json:1177` `"door": "focus.first#key-home-in-toolbar",`). No menu de contexto, Home também leva ao primeiro item, como no cenário `the-menu-runs-from-the-keyboard` (`manifest/features/02-structure-editing.json:8545` `"door": "focus.first#key-home-in-menu",`). Pela G3, a porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'first')` (`src/editor/focus/focus.ts:26` `asking(state.ui, 'first')`); o documento não muda (G7).

## REQ-1207 — focus.last (Último item)
- **Onde:** `manifest/commands/focus.json:673` `"id": "focus.last",`
- **Tratador:** `src/app/commands.ts:318` `'focus.last': focusLast,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Leva o foco ao último item da região que o detém; o rótulo da interface é "Último item" (`src/i18n/locales/pt-BR.json:350` `"command.focusLast": "Último item",`). Barras de ferramentas e faixas de abas usam roving tabindex, em que End salta ao último item (`manifest/features/14-accessibility-and-keyboard.json:843` `"Tab strips and toolbars use roving tabindex: arrows move, Home/End jump, Enter/Space activate.",`), e o cenário `end-jumps-to-the-last-item-of-a-region` prova o salto numa barra (`manifest/features/14-accessibility-and-keyboard.json:1235` `"door": "focus.last#key-end-in-toolbar",`). No menu de contexto, End também leva ao último item, como no cenário `the-menu-runs-from-the-keyboard` (`manifest/features/02-structure-editing.json:8572` `"door": "focus.last#key-end-in-menu",`). Pela G3, a porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'last')` (`src/editor/focus/focus.ts:27` `asking(state.ui, 'last')`); o documento não muda (G7).

## REQ-1208 — focus.activate (Executar o item em foco)
- **Onde:** `manifest/commands/focus.json:791` `"id": "focus.activate",`
- **Tratador:** `src/app/commands.ts:319` `'focus.activate': focusActivate,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Executa o item em foco, acionando o controle que o detém; o rótulo da interface é "Executar o item em foco" (`src/i18n/locales/pt-BR.json:347` `"command.focusActivate": "Executar o item em foco",`). No cenário `the-menu-runs-from-the-keyboard`, Enter executa o último item do menu de contexto, que apaga `/Page/Hero/Intro` do documento (`manifest/features/02-structure-editing.json:8581` `"door": "focus.activate#key-enter-in-menu",`). Barras de ferramentas e faixas de abas usam roving tabindex, em que Enter e Space executam o item (`manifest/features/14-accessibility-and-keyboard.json:843` `"Tab strips and toolbars use roving tabindex: arrows move, Home/End jump, Enter/Space activate.",`), como no cenário `enter-and-space-run-the-item-the-focus-is-on` (`manifest/features/14-accessibility-and-keyboard.json:1293` `"door": "focus.activate#key-enter-in-toolbar",`). Pela G3, cada porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'activate')` (`src/editor/focus/focus.ts:28` `asking(state.ui, 'activate')`). Pela G2, a execução roda no contexto da região em foco; o documento é alterado pela ação executada (G1/G7).

## REQ-1209 — focus.nextRegion (Próxima região)
- **Onde:** `manifest/commands/focus.json:949` `"id": "focus.nextRegion",`
- **Tratador:** `src/app/commands.ts:320` `'focus.nextRegion': focusNextRegion,`
- **Feature:** `src/app/features.ts:179` `'keyboard-panel-navigation': registerFeature('keyboard-panel-navigation'),`
- **Comportamento esperado:** Com F6, passa o foco à próxima região que a janela desenha, depois da região em foco; partindo de nenhuma região, vai à primeira; o rótulo da interface é "Próxima região" (`src/i18n/locales/pt-BR.json:355` `"command.focusNextRegion": "Próxima região",`). F6 e Shift+F6 alternam o foco entre a barra superior, a doca esquerda, o canvas, o inspector, o workbench e a barra de status, e a região em foco mostra um anel visível (`manifest/features/14-accessibility-and-keyboard.json:842` `"F6 and Shift+F6 cycle focus between top bar, left dock, canvas, inspector, workbench and status bar; the focused region shows a visible focus ring.",`); o cenário `f6-walks-the-regions` começa na porta F6 (`manifest/features/14-accessibility-and-keyboard.json:863` `"door": "focus.nextRegion#key-f6-in-global",`). Pela G3, as portas (F6 no contexto global e F6 no campo) mandam só a intenção: o pedido é gravado por `asking(state.ui, 'nextRegion')` (`src/editor/focus/focus.ts:95` `asking(state.ui, 'nextRegion')`). Pela G4, o resultado fica visível pelo anel de foco; a seleção fica intacta (G6).

## REQ-1210 — focus.previousRegion (Região anterior)
- **Onde:** `manifest/commands/focus.json:1007` `"id": "focus.previousRegion",`
- **Tratador:** `src/app/commands.ts:321` `'focus.previousRegion': focusPreviousRegion,`
- **Feature:** `src/app/features.ts:179` `'keyboard-panel-navigation': registerFeature('keyboard-panel-navigation'),`
- **Comportamento esperado:** Com Shift+F6, passa o foco à região anterior que a janela desenha, antes da região em foco; partindo de nenhuma região, vai à última; o rótulo da interface é "Região anterior" (`src/i18n/locales/pt-BR.json:357` `"command.focusPreviousRegion": "Região anterior",`). F6 e Shift+F6 alternam o foco entre a barra superior, a doca esquerda, o canvas, o inspector, o workbench e a barra de status, e a região em foco mostra um anel visível (`manifest/features/14-accessibility-and-keyboard.json:842` `"F6 and Shift+F6 cycle focus between top bar, left dock, canvas, inspector, workbench and status bar; the focused region shows a visible focus ring.",`); o cenário `shift-f6-walks-the-regions-back` começa na porta Shift+F6 (`manifest/features/14-accessibility-and-keyboard.json:920` `"door": "focus.previousRegion#key-shift-f6-in-global",`). Pela G3, as portas (Shift+F6 no contexto global e Shift+F6 no campo) mandam só a intenção: o pedido é gravado por `asking(state.ui, 'previousRegion')` (`src/editor/focus/focus.ts:96` `asking(state.ui, 'previousRegion')`). Pela G4, o resultado fica visível pelo anel de foco; a seleção fica intacta (G6).

## REQ-1211 — focus.canvas (Voltar para a tela)
- **Onde:** `manifest/commands/focus.json:1065` `"id": "focus.canvas",`
- **Tratador:** `src/app/commands.ts:322` `'focus.canvas': focusCanvas,`
- **Feature:** `src/app/features.ts:179` `'keyboard-panel-navigation': registerFeature('keyboard-panel-navigation'),`
- **Comportamento esperado:** Devolve o foco ao canvas: Escape dentro de um painel volta o foco ao canvas com a seleção intacta (`manifest/features/14-accessibility-and-keyboard.json:844` `"Escape inside a panel returns focus to the canvas with the selection intact.",`); o rótulo da interface é "Voltar para a tela" (`src/i18n/locales/pt-BR.json:348` `"command.focusCanvas": "Voltar para a tela",`). O cenário `escape-in-a-panel-returns-the-focus-to-the-canvas` parte da árvore de Camadas (`manifest/features/14-accessibility-and-keyboard.json:977` `"door": "focus.canvas#key-escape-in-layers-tree",`), e as portas do comando são Escape nas Camadas, na paleta, na faixa de abas, na barra de ferramentas e no divisor. Pela G3, cada porta manda só a intenção: o pedido é gravado por `asking(state.ui, 'canvas')` (`src/editor/focus/focus.ts:97` `asking(state.ui, 'canvas')`). Pela G6, a seleção é a mesma da store e não muda com o comando.

## REQ-1212 — ui.dismiss (Fechar)
- **Onde:** `manifest/commands/focus.json:1183` `"id": "ui.dismiss",`
- **Tratador:** `src/app/commands.ts:323` `'ui.dismiss': dismiss,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Fecha o que flutua sobre o editor; hoje, o menu aberto, por suas portas de fechamento; o rótulo da interface é "Fechar" (`src/i18n/locales/pt-BR.json:319` `"command.dismiss": "Fechar",`). O menu de contexto fecha com Escape ou um clique fora (`manifest/features/02-structure-editing.json:7923` `"The menu is operable with ArrowUp/ArrowDown and Enter, closes with Escape or a click outside, and always stays fully inside the window.",`), e o cenário `escape-or-a-click-outside-closes-the-menu` fecha pelo Escape no menu (`manifest/features/02-structure-editing.json:8651` `"door": "ui.dismiss#key-escape-in-menu",`). O tratador soma uma dispensa em `state.ui.overlays.dismissals` (`src/editor/menus/overlays.ts:21` `overlays: { dismissals: state.ui.overlays.dismissals + 1 }`), e o menu aberto fecha quando chega uma dispensa mais nova que a sua abertura; o mesmo tratador também fecha o diálogo e a barra de comandos. Pela G3, as portas do comando (Escape no menu, o toque no fundo do menu, Escape na barra de comandos, Escape nas sugestões do campo, Escape no diálogo e o botão de fechar do diálogo) mandam só a intenção ao tratador único.

## REQ-1301 — position.setMode (Definir a posição)
- **Onde:** `manifest/commands/geometry.json:5` `"id": "position.setMode",`
- **Tratador:** `src/app/commands.ts:324` `'position.setMode': setPositionModeCommand,`
- **Feature:** `src/app/features.ts:69` `'props-position': registerFeature('props-position'),`
- **Comportamento esperado:** O comando define o modo de posicionamento do elemento selecionado (`static`, `relative`, `absolute`, `fixed` ou `sticky`); o rótulo da interface é "Definir a posição" (`src/i18n/locales/pt-BR.json:468` `"command.setPosition": "Definir a posição",`), e ele também aparece na barra de comandos como "Definir {property} como {value}" (`src/i18n/locales/pt-BR.json:469` `"command.setProperty": "Definir {property} como {value}",`). A intenção da feature é que os botões de posição gravem `position` e que os campos de deslocamento apareçam quando a posição não é `static` (`manifest/features/04-inspector.json:11990` `"The position buttons write position; offset fields top/right/bottom/left appear when position is not static.",`), a partir do cenário `the-static-button-sets-the-position` (`manifest/features/04-inspector.json:11998` `"id": "the-static-button-sets-the-position",`). Escolher `absolute` grava também `position` no elemento e põe o pai estático como `relative` (`manifest/features/04-inspector.json:12193` `"path": "/Page/Hero/@styles/desktop/base/position",`), como no cenário `the-absolute-button-sets-the-position` (`manifest/features/04-inspector.json:12144` `"id": "the-absolute-button-sets-the-position",`). Um valor inválido é recusado com `status.value.invalid` (`manifest/features/04-inspector.json:13058` `"key": "status.value.invalid",`) — "Definir a posição" usa a mensagem `{property}: "{value}" não é um valor aceito por este campo.` (`src/i18n/locales/pt-BR.json:2009` `"status.value.invalid": "{property}: `) — e um elemento bloqueado é recusado com `status.locked.edit` (`manifest/features/04-inspector.json:13146` `"key": "status.locked.edit",`), "Desbloqueie {name} antes de alterá-lo." (`src/i18n/locales/pt-BR.json:1845` `"status.locked.edit": "Desbloqueie {name} antes de alterá-lo.",`); voltar a `static` retira `top` e `left`, no cenário `back-to-static-takes-the-top-and-left-away` (`manifest/features/04-inspector.json:13165` `"id": "back-to-static-takes-the-top-and-left-away",`). As duas portas do comando — o campo do inspector (`manifest/commands/geometry.json:47` `"id": "inspector-position",`) e a barra de comandos (`manifest/commands/geometry.json:80` `"id": "command-bar-set-property",`) — enviam só a intenção ao tratador único (G3). Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita, com `"transaction": "per-dispatch"` e restauração da seleção anterior (`manifest/commands/geometry.json:41` `"undoRestoresSelection": "before-command",`); G2 — a posição altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G6 — canvas e Camadas mostram a seleção lida da store; G7 — o canvas renderiza a posição gravada. A pilha de undo/redo fica consistente a cada escrita (integridade do documento).

## REQ-1302 — geometry.resize (Redimensionar)
- **Onde:** `manifest/commands/geometry.json:103` `"id": "geometry.resize",`
- **Tratador:** `src/app/commands.ts:325` `'geometry.resize': resizeCommand,`
- **Feature:** `src/app/features.ts:93` `'resize-handles': registerFeature('resize-handles'),`
- **Comportamento esperado:** O comando redimensiona o elemento selecionado a partir de suas oito alças; o rótulo da interface é "Redimensionar" (`src/i18n/locales/pt-BR.json:436` `"command.resize": "Redimensionar",`). A intenção da feature é "Resize an element with its eight handles" (`manifest/features/05-canvas-handles.json:13` `"title": "Resize an element with its eight handles",`): as alças de borda mudam uma dimensão e as de canto mudam as duas, a variação em px de CSS é o movimento do ponteiro dividido pelo zoom e a largura e a altura são gravadas no JSON do documento; no fim, a barra de status mostra "Redimensionado para W × H" (`src/i18n/locales/pt-BR.json:1920` `"status.resized": "Redimensionado para {width} × {height}.",`), como no cenário `an-edge-handle-writes-the-width-and-is-one-undo-step` (`manifest/features/05-canvas-handles.json:29` `"id": "an-edge-handle-writes-the-width-and-is-one-undo-step",`). Cancelar com Escape não altera o documento, no cenário `escape-during-a-resize-changes-nothing` (`manifest/features/05-canvas-handles.json:352` `"id": "escape-during-a-resize-changes-nothing",`), em que a barra de status mostra "Arraste cancelado — nada mudou." (`src/i18n/locales/pt-BR.json:1721` `"status.drag.cancelled": "Arraste cancelado — nada mudou.",`). As doze portas do comando — as alças de canto, de borda e os atalhos equivalentes (`manifest/commands/geometry.json:165` `"id": "handle-resize-n",` … `manifest/commands/geometry.json:413` `"id": "handle-resize-edge-w",`) — enviam só a intenção (largura, altura, bordas e modificador) ao tratador único (G3). Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita, com `"transaction": "per-gesture"` (`manifest/commands/geometry.json:160` `"transaction": "per-gesture",`); G2 — o arraste de alça altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G4 — nenhuma alça cobre o canvas no ponto da ação; G7 — o canvas mostra a medida final igual à gravada. A pilha de undo/redo fica consistente a cada gesto (integridade do documento).

## REQ-1303 — position.move (Mover para uma posição)
- **Onde:** `manifest/commands/geometry.json:438` `"id": "position.move",`
- **Tratador:** `src/app/commands.ts:326` `'position.move': movePositionedCommand,`
- **Feature:** `src/app/features.ts:149` `'absolute-free-drag': registerFeature('absolute-free-drag'),`
- **Recusa declarada:** `manifest/commands/geometry.json:464` `"refusalKey": "status.position.notPositioned"`
- **Comportamento esperado:** O comando move livremente um elemento com posição absoluta ou fixa; o rótulo da interface é "Mover para uma posição" (`src/i18n/locales/pt-BR.json:396` `"command.movePositioned": "Mover para uma posição",`). A intenção da feature é o posicionamento livre de filhos absolutos por arraste (`manifest/features/10-view-and-positioning.json:4674` `"title": "Free positioning of absolute children by dragging",`): arrastar o filho absoluto o move livremente, a barra de status mostra suas coordenadas em relação ao pai e, ao soltar, grava `top` e `left` no JSON do documento (`manifest/features/10-view-and-positioning.json:4681` `"Dragging an absolute child moves it freely; the status bar shows its coordinates relative to the parent; release writes top and left to the document JSON.",`), no cenário `dragging-an-absolute-child-moves-it-freely` (`manifest/features/10-view-and-positioning.json:4793` `"id": "dragging-an-absolute-child-moves-it-freely",`). Pelas teclas, a intenção é deslocar por 1 px e, com Shift, por 10 px, sem andar pela árvore (`manifest/features/10-view-and-positioning.json:5296` `"For a selection that is absolutely or fixed positioned, arrows move the element by 1 px and Shift+arrows by 10 px instead of walking the tree; top/left in the document JSON change accordingly.",`), e uma rajada rápida de teclas é um único passo de desfazer (`manifest/features/10-view-and-positioning.json:5298` `"A quick burst of nudges is one undo step."`), no cenário `a-burst-of-arrows-is-one-undo-step` (`manifest/features/10-view-and-positioning.json:5534` `"id": "a-burst-of-arrows-is-one-undo-step",`). A barra de status usa `{name} em x {x}, y {y} dentro de {parent}.` (`src/i18n/locales/pt-BR.json:1895` `"status.position.moved": "{name} em x {x}, y {y} dentro de {parent}.",`). Um elemento bloqueado é recusado com `status.locked.move` — "Desbloqueie {name} antes de movê-lo." (`src/i18n/locales/pt-BR.json:1848` `"status.locked.move": "Desbloqueie {name} antes de movê-lo.",`), nos cenários `a-locked-absolute-element-is-not-moved` (`manifest/features/10-view-and-positioning.json:5170` `"id": "a-locked-absolute-element-is-not-moved",`) e `a-locked-element-is-not-nudged` (`manifest/features/10-view-and-positioning.json:5805` `"id": "a-locked-element-is-not-nudged",`). As cinco portas do comando — o arraste no canvas (`manifest/commands/geometry.json:482` `"id": "canvas-drag-positioned-element-containing-block",`) e os quatro atalhos de seta (`manifest/commands/geometry.json:502` `"id": "key-arrow-left-in-canvas-positioned",`) — enviam só a intenção ao tratador único (G3). Pelas regras do editor: G1 — o movimento é gravado no contexto em que foi feito, e uma rajada de teclas coalesce no mesmo alvo e propriedade (`manifest/commands/geometry.json:474` `"within": "history.nudgeBurstWindow"`); G2 — mover altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G6 — canvas e Camadas mostram a seleção lida da store; G7 — a posição medida no iframe é igual ao `top` e ao `left` gravados. A pilha de undo/redo fica consistente a cada gesto (integridade do documento).

## REQ-1304 — position.setAnchors (Ancorar às bordas)
- **Onde:** `manifest/commands/geometry.json:596` `"id": "position.setAnchors",`
- **Tratador:** `src/app/commands.ts:327` `'position.setAnchors': setAnchorsCommand,`
- **Feature:** `src/app/features.ts:151` `'absolute-anchors': registerFeature('absolute-anchors'),`
- **Recusa declarada:** `manifest/commands/geometry.json:626` `"refusalKey": "status.position.notPositioned"`
- **Comportamento esperado:** O comando ancora o elemento posicionado às bordas e aos centros; o rótulo da interface é "Ancorar às bordas" (`src/i18n/locales/pt-BR.json:445` `"command.setAnchors": "Ancorar às bordas",`). A intenção da feature é "Anchor positioned elements to edges and centres" (`manifest/features/10-view-and-positioning.json:5933` `"title": "Anchor positioned elements to edges and centres",`): Alt+Shift+seta alterna a âncora naquela borda e ancorar esquerda e direita grava as duas, com a largura acompanhando o pai (`manifest/features/10-view-and-positioning.json:5941` `"Alt+Shift+arrow toggles the anchor on that edge; anchoring both left and right stores left and right (width follows the parent).",`); ancorar o centro grava `left` e `right` 0 com margens automáticas e largura `fit-content` (`manifest/features/10-view-and-positioning.json:5942` `"Anchoring the centre stores left and right 0 with auto side margins and a fit-content width (top, bottom, auto margins and a fit-content height for the vertical centre), so the element stays centred without translate, which belongs to Move X/Y.",`); alternar uma âncora nunca move o elemento visualmente e, ao redimensionar o pai, ele mantém as distâncias às bordas ancoradas (`manifest/features/10-view-and-positioning.json:5943` `"Toggling an anchor never moves the element visually; after resizing the parent the element keeps its distances to the anchored edges."`). A barra de status mostra `Âncoras de {name}: {horizontal} · {vertical}.` (`src/i18n/locales/pt-BR.json:1647` `"status.anchors.set": "Âncoras de {name}: {horizontal} · {vertical}.",`), no cenário `alt-shift-right-key-anchors-left-and-right` (`manifest/features/10-view-and-positioning.json:5948` `"id": "alt-shift-right-key-anchors-left-and-right",`), e o controle do inspector centra na horizontal, no cenário `the-inspector-centres-it-horizontally` (`manifest/features/10-view-and-positioning.json:7400` `"id": "the-inspector-centres-it-horizontally",`). As nove portas do comando — os quatro atalhos Alt+Shift (`manifest/commands/geometry.json:642` `"id": "key-alt-shift-arrow-left-in-canvas-positioned",`), as quatro abas de âncora e o controle do inspector (`manifest/commands/geometry.json:854` `"id": "inspector-anchor-control",`) — enviam só a intenção ao tratador único (G3). Pelas regras do editor: G1 — a âncora é gravada no contexto em que foi feita, com `"transaction": "per-gesture"` (`manifest/commands/geometry.json:637` `"transaction": "per-gesture",`); G2 — ancorar altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G6 — canvas e Camadas mostram a seleção lida da store; G7 — o canvas mostra as distâncias ancoradas iguais às gravadas. A pilha de undo/redo fica consistente a cada escrita (integridade do documento).

## REQ-1305 — position.align (Alinhar)
- **Onde:** `manifest/commands/geometry.json:893` `"id": "position.align",`
- **Tratador:** `src/app/commands.ts:328` `'position.align': alignCommand,`
- **Feature:** `src/app/features.ts:152` `'align-distribute': registerFeature('align-distribute'),`
- **Recusa declarada:** `manifest/commands/geometry.json:913` `"refusalKey": "status.align.needsPositioned"`
- **Comportamento esperado:** O comando alinha os elementos posicionados; o rótulo da interface é "Alinhar" (`src/i18n/locales/pt-BR.json:266` `"command.align": "Alinhar",`), com faces como "Alinhar à esquerda" (`src/i18n/locales/pt-BR.json:269` `"command.align.left": "Alinhar à esquerda",`). A intenção da feature é alinhar e distribuir elementos posicionados (`manifest/features/10-view-and-positioning.json:7795` `"title": "Align and distribute positioned elements",`): com vários elementos selecionados, o alinhamento usa os limites da seleção e, com um só, a caixa do pai (`manifest/features/10-view-and-positioning.json:7802` `"With several elements selected, align works on the selection's bounds; with one element, on its parent's box.",`); a barra de status mostra `{edge}: {elements}.` (`src/i18n/locales/pt-BR.json:1644` `"status.align.done": "{edge}: {elements}.",`). O cenário `align-left-on-the-selection-bounds` (`manifest/features/10-view-and-positioning.json:7809` `"id": "align-left-on-the-selection-bounds",`) grava `left` 10px para os três cartões, e o cenário `one-element-aligns-to-its-parent` (`manifest/features/10-view-and-positioning.json:11179` `"id": "one-element-aligns-to-its-parent",`) centraliza um só cartão no pai. As três portas de cada face — o painel rápido (`manifest/commands/geometry.json:928` `"id": "quick-panel-align-left",`), o menu Organizar (`manifest/commands/geometry.json:953` `"id": "menu-arrange-left",`) e a barra de comandos — enviam só a intenção (a borda) ao tratador único (G3); quando a seleção não tem posição absoluta, a porta é recusada com "Alinhar funciona com elementos com posição absoluta." (`src/i18n/locales/pt-BR.json:1645` `"status.align.needsPositioned": "Alinhar funciona com elementos com posição absoluta.",`). Pelas regras do editor: G1 — o alinhamento é gravado no contexto em que foi feito, com `"transaction": "per-dispatch"` (`manifest/commands/geometry.json:923` `"transaction": "per-dispatch",`); G2 — alinhar altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G6 — canvas e Camadas mostram a seleção lida da store; G7 — as posições medidas no iframe são iguais às gravadas. A pilha de undo/redo fica consistente a cada escrita (integridade do documento).

## REQ-1306 — position.distribute (Distribuir)
- **Onde:** `manifest/commands/geometry.json:1362` `"id": "position.distribute",`
- **Tratador:** `src/app/commands.ts:329` `'position.distribute': distributeCommand,`
- **Feature:** `src/app/features.ts:152` `'align-distribute': registerFeature('align-distribute'),`
- **Recusa declarada:** `manifest/commands/geometry.json:1378` `"refusalKey": "status.distribute.needsPositioned"`
- **Comportamento esperado:** O comando distribui os elementos posicionados, igualando os espaços entre eles; o rótulo da interface é "Distribuir" (`src/i18n/locales/pt-BR.json:320` `"command.distribute": "Distribuir",`), com faces "Distribuir na horizontal" (`src/i18n/locales/pt-BR.json:321` `"command.distribute.horizontal": "Distribuir na horizontal",`) e "Distribuir na vertical" (`src/i18n/locales/pt-BR.json:322` `"command.distribute.vertical": "Distribuir na vertical",`). A intenção da feature é que distribuir iguale os espaços entre os elementos (`manifest/features/10-view-and-positioning.json:7803` `"Distribute makes the gaps between the elements equal.",`), nos cenários `distribute-horizontally-makes-the-gaps-equal` (`manifest/features/10-view-and-positioning.json:10334` `"id": "distribute-horizontally-makes-the-gaps-equal",`) e `distribute-vertically-makes-the-gaps-equal` (`manifest/features/10-view-and-positioning.json:10759` `"id": "distribute-vertically-makes-the-gaps-equal",`); a barra de status mostra `{axis}: {elements}, espaços iguais.` (`src/i18n/locales/pt-BR.json:1716` `"status.distribute.done": "{axis}: {elements}, espaços iguais.",`). Distribuir exige pelo menos três elementos — "Distribuir exige pelo menos três elementos." (`src/i18n/locales/pt-BR.json:1718` `"status.distribute.needsThree": "Distribuir exige pelo menos três elementos.",`) — e a porta é recusada quando a seleção não tem posição absoluta. As três portas de cada eixo — o painel rápido (`manifest/commands/geometry.json:1394` `"id": "quick-panel-distribute-horizontal",`), o menu Organizar e a barra de comandos — enviam só a intenção (o eixo) ao tratador único (G3). Pelas regras do editor: G1 — a distribuição é gravada no contexto em que foi feita, com `"transaction": "per-dispatch"`; G2 — distribuir altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G6 — canvas e Camadas mostram a seleção lida da store; G7 — as posições medidas no iframe são iguais às gravadas. A pilha de undo/redo fica consistente a cada escrita (integridade do documento).

## REQ-1307 — handle.step (Ajustar o valor da alça)
- **Onde:** `manifest/commands/geometry.json:1540` `"id": "handle.step",`
- **Tratador:** `src/app/commands.ts:330` `'handle.step': stepHandle,`
- **Feature:** `src/app/features.ts:95` `'radius-border-gap-handles': registerFeature('radius-border-gap-handles'),`
- **Comportamento esperado:** O comando ajusta em um passo o valor da alça em foco no canvas; o rótulo da interface é "Ajustar o valor da alça" (`src/i18n/locales/pt-BR.json:373` `"command.handleStep": "Ajustar o valor da alça",`). A feature edita raio, largura de borda e espaçamentos por arraste no canvas (`manifest/features/05-canvas-handles.json:2804` `"title": "Edit radius, border width and gaps by dragging on the canvas",`): no modo raio há uma alça de canto rotulada com o raio atual que grava os quatro cantos de uma vez (`manifest/features/05-canvas-handles.json:2811` `"Radius mode shows a corner handle labelled with the current radius and writes the four corner radius longhands in one command.",`). O comando é o passo pelo teclado dessa alça: a seta para a direita e a seta para cima aumentam ("Aumentar", `src/i18n/locales/pt-BR.json:162` `"canvas.handle.increase": "Aumentar",`) e a seta para a esquerda e a seta para baixo diminuem ("Diminuir", `src/i18n/locales/pt-BR.json:160` `"canvas.handle.decrease": "Diminuir",`); em `arrow-right-on-the-radius-handle-adds-one` (`manifest/features/05-canvas-handles.json:3565` `"id": "arrow-right-on-the-radius-handle-adds-one",`) o raio passa de 0 para 1px e em `arrow-left-on-the-radius-handle-takes-one-away` (`manifest/features/05-canvas-handles.json:3659` `"id": "arrow-left-on-the-radius-handle-takes-one-away",`) de 12 para 11px. As quatro portas de teclado — seta direita e seta para cima aumentam (`manifest/commands/geometry.json:1574` `"id": "key-arrow-right-in-canvas-handle",`) e seta esquerda e seta para baixo diminuem (`manifest/commands/geometry.json:1618` `"id": "key-arrow-left-in-canvas-handle",`) — enviam só a intenção (a direção e a alça) ao tratador único (G3). Pelas regras do editor: G1 — o passo é gravado no contexto em que foi feito, com `"transaction": "per-dispatch"` (`manifest/commands/geometry.json:1569` `"transaction": "per-dispatch",`); G2 — o passo altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G5 — a alça e seu rótulo cabem no painel; G7 — o canvas mostra o valor da alça igual ao gravado. A pilha de undo/redo fica consistente a cada passo (integridade do documento).

## REQ-1308 — canvas.setEditMode (Editar na tela)
- **Onde:** `manifest/commands/geometry.json:1664` `"id": "canvas.setEditMode",`
- **Tratador:** `src/app/commands.ts:331` `'canvas.setEditMode': setEditMode,`
- **Feature:** `src/app/features.ts:94` `'spacing-handles': registerFeature('spacing-handles'),`
- **Comportamento esperado:** O comando entra e sai do modo de edição na tela; o rótulo da interface é "Editar na tela" (`src/i18n/locales/pt-BR.json:1583` `"quickPanel.editOnCanvas": "Editar na tela",`). A intenção da feature é editar padding e margin por arraste no canvas (`manifest/features/05-canvas-handles.json:1576` `"title": "Edit padding and margin by dragging on the canvas",`): nos modos Padding ou Margin as quatro laterais são desenhadas como faixas com seus valores, arrastar uma faixa muda só aquela lateral, Alt muda a lateral oposta na mesma medida e Shift muda as quatro (`manifest/features/05-canvas-handles.json:1585` `"Dragging a band changes only that side; Alt changes the opposite side by the same amount; Shift changes all four sides.",`), e a barra de status mostra o valor ao vivo, gravado no JSON do documento como um passo de desfazer (`manifest/features/05-canvas-handles.json:1586` `"The status bar shows the live value; the value is written to the document JSON as one undo step."`). O modo escolhido pelo painel rápido desenha as faixas, no cenário `padding-mode-from-the-quick-panel-draws-the-bands` (`manifest/features/05-canvas-handles.json:1591` `"id": "padding-mode-from-the-quick-panel-draws-the-bands",`), e o Esc deixa o modo de edição ("Sair do modo de edição", `src/i18n/locales/pt-BR.json:142` `"canvas.editMode.leave": "Sair do modo de edição",`), no cenário `escape-leaves-the-edit-mode` (`manifest/features/05-canvas-handles.json:2653` `"id": "escape-leaves-the-edit-mode",`). A escolha do modo inclui `none`, `padding`, `margin`, `radius`, `border`, `gap`, `row-gap`, `column-gap`, `shadow-offset` e `shadow-blur` (`manifest/commands/geometry.json:1669` `"mode": {`). As duas portas do comando — o item do painel rápido (`manifest/commands/geometry.json:1697` `"id": "quick-panel-edit-on-canvas",`) e o Esc do modo de edição (`manifest/commands/geometry.json:1720` `"id": "key-escape-in-canvas-edit-mode",`) — enviam só a intenção (o modo) ao tratador único (G3). Pelas regras do editor: a entrada e a saída do modo não são um passo de desfazer (`manifest/commands/geometry.json:1693` `"undoable": false`); G2 — os arrastes das faixas alteram o documento, então a digitação pendente é gravada antes, no contexto da digitação; G4 — as faixas não cobrem o canvas no ponto da ação; G5 — as faixas e seus rótulos cabem no painel; G7 — o canvas mostra o valor da faixa igual ao gravado. A pilha de undo/redo fica consistente a cada escrita das faixas (integridade do documento).

## REQ-1401 — history.undo (Desfazer)
- **Onde:** `manifest/commands/history.json:5` `"id": "history.undo",`
- **Tratador:** `src/app/commands.ts:332` `'history.undo': undoCommand,`
- **Feature:** `src/app/features.ts:20` `'undo-redo': registerFeature('undo-redo'),`
- **Recusa declarada:** `manifest/commands/history.json:12` `"refusalKey": "status.undo.nothing"`
- **Comportamento esperado:** Desfaz a última alteração feita no documento; o rótulo da interface é "Desfazer" (`src/i18n/locales/pt-BR.json:515` `"command.undo": "Desfazer",`). O documento volta ao estado exato anterior ao comando desfeito e a seleção passa a ser a que pertencia àquele estado (`manifest/features/02-structure-editing.json:1924` `"After undo or redo the selection is the one that belonged to that document state.",`): no cenário `undo-restores-the-document-and-selection-and-names-what-it-undid`, a seleção volta a `/Page/Hero/Title`. A barra de status anuncia o que foi desfeito com a chave `status.undone` — "Desfeito: {action}" (`src/i18n/locales/pt-BR.json:2000` `"status.undone": "Desfeito: {action}",`) — nomeando a ação desfeita: "Placed Paragraph in Hero, position 2 of 4." numa inserção (`manifest/features/02-structure-editing.json:2014` `"action": "Placed Paragraph in Hero, position 2 of 4."`) e "Height of Hero: 900px." numa altura, no cenário `undo-after-a-height-names-the-height-it-undid` (`manifest/features/02-structure-editing.json:2437` `"action": "Height of Hero: 900px."`). Sem nada para desfazer, o predicado `canUndo` (`manifest/commands/history.json:11` `"predicate": "canUndo",`) recusa a porta com `status.undo.nothing` — "Nada para desfazer." (`src/i18n/locales/pt-BR.json:1999` `"status.undo.nothing": "Nada para desfazer.",`) — e o documento fica inalterado, no cenário `undo-with-an-empty-history-is-refused`. As cinco portas do comando — Ctrl+Z, botão da barra superior, botão Desfazer do toast, item do menu Editar e a barra de comandos — enviam só a intenção ao único tratador, sem argumentos, e o botão da barra superior fica desabilitado quando não há o que desfazer (`manifest/features/02-structure-editing.json:1922` `"The top bar Undo and Redo buttons do the same and are disabled when there is nothing to undo or redo.",`). Pelas regras do editor: G1 — toda edição é gravada no contexto em que foi feita (elementos, breakpoint, estado, classe-alvo e quadro-chave), e é esse estado que o desfazer devolve; G2 — o desfazer é comando que altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só a intenção; G6 — canvas e Camadas mostram a seleção restaurada, lida da store; G7 — o canvas renderiza o documento restaurado. O desfazer não entra na própria pilha (`manifest/commands/history.json:17` `"undoable": false`), e a pilha de undo/redo fica consistente a cada escrita (integridade do documento).

## REQ-1402 — history.redo (Refazer)
- **Onde:** `manifest/commands/history.json:134` `"id": "history.redo",`
- **Tratador:** `src/app/commands.ts:333` `'history.redo': redoCommand,`
- **Feature:** `src/app/features.ts:20` `'undo-redo': registerFeature('undo-redo'),`
- **Recusa declarada:** `manifest/commands/history.json:141` `"refusalKey": "status.redo.nothing"`
- **Comportamento esperado:** Refaz a última alteração desfeita; o rótulo da interface é "Refazer" (`src/i18n/locales/pt-BR.json:429` `"command.redo": "Refazer",`). O documento volta ao estado que o desfazer tinha removido e a seleção passa a ser a que pertencia àquele estado (`manifest/features/02-structure-editing.json:1924` `"After undo or redo the selection is the one that belonged to that document state.",`): o cenário `redo-restores-the-document-and-selection-and-names-what-it-redid` espera o parágrafo de volta e a seleção em `/Page/Hero/Paragraph` (`manifest/features/02-structure-editing.json:2145` `"/Page/Hero/Paragraph"`). A barra de status anuncia o que foi refeito com a chave `status.redone` — "Refeito: {action}" (`src/i18n/locales/pt-BR.json:1909` `"status.redone": "Refeito: {action}",`). Um comando novo depois de um desfazer esvazia a pilha de refazer (`manifest/features/02-structure-editing.json:1923` `"A new command after an undo empties the redo stack (Redo becomes disabled).",`): o cenário `a-new-command-after-undo-empties-redo` recusa o refazer com `status.redo.nothing` (`manifest/features/02-structure-editing.json:2320` `"key": "status.redo.nothing",`) — "Nada para refazer." (`src/i18n/locales/pt-BR.json:1908` `"status.redo.nothing": "Nada para refazer.",`) — e o documento fica inalterado. Sem nada para refazer, o predicado `canRedo` (`manifest/commands/history.json:140` `"predicate": "canRedo",`) recusa a porta com a mesma mensagem, e o botão da barra superior fica desabilitado (`manifest/features/02-structure-editing.json:1922` `"The top bar Undo and Redo buttons do the same and are disabled when there is nothing to undo or redo.",`). As cinco portas do comando — Ctrl+Shift+Z, Ctrl+Y, botão da barra superior, item do menu Editar e a barra de comandos — enviam só a intenção ao único tratador, sem argumentos (G3). G1 — a alteração refeita foi gravada no contexto em que foi feita; G2 — o refazer é comando que altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G6 — canvas e Camadas mostram a seleção restaurada, lida da store; G7 — o canvas renderiza o documento restaurado. O refazer não entra na própria pilha (`manifest/commands/history.json:146` `"undoable": false`), e a pilha de undo/redo fica consistente a cada escrita (integridade do documento).

## REQ-1501 — layout.enter (Compor layout)
- **Onde:** `manifest/commands/layout-composer.json:5` `"id": "layout.enter",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:399` `export const enterLayout = registerHandler<'layout.enter', EditorUi>('layout.enter', (context, { target }) => {` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Comportamento esperado:** Abre a composição de layout do contêiner (a página ou um elemento que contém outros). O rótulo da interface é "Compor layout" (`src/i18n/locales/pt-BR.json:2471` `"layout.command.enter": "Compor layout",`). As quatro portas do comando enviam só a intenção e convergem no mesmo tratador (G3): o botão da barra do canvas (`manifest/features/23-layout-composer.json:69` `"layout.enter#layout-compose",`), o item do menu de contexto (`manifest/features/23-layout-composer.json:164` `"layout.enter#layout-compose-menu"`), a tecla L no contexto global e o botão da barra de atividades. O comando grava os dados da composição no documento sob a chave `layout-composer` — papel de contêiner, intenção com viewport, regiões, regras, regras por tamanho de tela e variáveis — e é um único passo de desfazer: o cenário `compose-the-page-keeps-its-intent-on-the-page` (`manifest/features/23-layout-composer.json:44` `"id": "compose-the-page-keeps-its-intent-on-the-page",`) espera um passo de desfazer e a seleção intacta. A barra de status anuncia a chave `layout.status.entered` — "Ferramenta Layout em {name}. Arraste para desenhar; Ctrl+arrastar move; S+arrastar divide; M+arrastar une." (`src/i18n/locales/pt-BR.json:2498` `"layout.status.entered": "Ferramenta Layout em {name}. Arraste para desenhar; Ctrl+arrastar move; S+arrastar divide; M+arrastar une.",`). Pelo intent da feature, compor devolve estrutura comum de flex e grade, e cada gesto é um passo de desfazer (`manifest/features/23-layout-composer.json:37` `"Every gesture is one undo step and is written at once as normal elements with flex or grid declarations, never absolute positioning.",`). Pelas regras do editor: G1 — a edição é gravada no contexto em que foi feita (contêiner, breakpoint, estado e quadro-chave); G4 — o resultado fica visível no canvas; G6 — canvas e Camadas derivam da store a seleção; G7 — o canvas renderiza o documento.

## REQ-1502 — layout.leave (Concluir composição)
- **Onde:** `manifest/commands/layout-composer.json:123` `"id": "layout.leave",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:441` `export const leaveLayout = registerHandler<'layout.leave', EditorUi>('layout.leave', ({ state }) => {` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:130` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Fecha a composição de layout e a página mantém a estrutura. O rótulo da interface é "Concluir composição" (`src/i18n/locales/pt-BR.json:2472` `"layout.command.leave": "Concluir composição",`). As duas portas enviam só a intenção ao mesmo tratador (G3): o controle "Concluir" do painel (`manifest/features/23-layout-composer.json:2788` `"layout.leave#layout-done",`) e a tecla Escape no contexto da composição (`manifest/features/23-layout-composer.json:2789` `"layout.leave#layout-escape"`), cujos rótulos são "Concluir" (`src/i18n/locales/pt-BR.json:2482` `"layout.door.done": "Concluir",`) e "Sair da composição de layout" (`src/i18n/locales/pt-BR.json:2483` `"layout.door.escape": "Sair da composição de layout",`). O cenário `done-closes-the-composer-and-the-page-keeps-its-structure` (`manifest/features/23-layout-composer.json:2747` `"id": "done-closes-the-composer-and-the-page-keeps-its-structure",`) anuncia `layout.status.closed` — "Ferramenta Layout fechada. A página mantém a estrutura." (`src/i18n/locales/pt-BR.json:2499` `"layout.status.closed": "Ferramenta Layout fechada. A página mantém a estrutura.",`). Fechar é o passo final do intent: "Escolha Concluir: a página mantém a estrutura para a qual o layout compilou" (`manifest/features/23-layout-composer.json:34` `"Choose Done: the page keeps the structure the layout compiled to."`). O comando não entra na pilha de desfazer (`"undoable": false` em `manifest/commands/layout-composer.json:141` `"undoable": false`). Quando nenhuma composição está aberta, o predicado `layoutComposing` recusa a porta com `layout.inactive` — "Nenhum layout está sendo composto. Selecione um contêiner e escolha Layout." (`src/i18n/locales/pt-BR.json:2496` `"layout.inactive": "Nenhum layout está sendo composto. Selecione um contêiner e escolha Layout.",`). Pelas regras: G2 — o fechar não força gravação de digitação pendente, pois o rascunho do campo é do próprio campo; G6 — canvas e Camadas seguem a store; G7 — o canvas renderiza o documento final.

## REQ-1503 — layout.stroke (Desenhar no layout)
- **Onde:** `manifest/commands/layout-composer.json:193` `"id": "layout.stroke",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:463` `export const strokeLayout = registerHandler<'layout.stroke', EditorUi>('layout.stroke', (context, { mode, points, handle }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:227` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** É o gesto de desenhar e compor regiões no canvas. O rótulo da interface é "Desenhar no layout" (`src/i18n/locales/pt-BR.json:2473` `"layout.command.stroke": "Desenhar no layout",`). Os argumentos são o modo (`auto`, `draw`, `cut`, `merge`, `subtract`, `move`, `nest`, `select`, `relate`, `group`), os pontos do traço e o puxador opcional. As portas são um arraste no palco (`manifest/features/23-layout-composer.json:269` `"layout.stroke#layout-stage"`) e cinco puxadores de canvas — divisa comum, espaçamento, repetição, canto e movimento — que enviam só a intenção ao mesmo tratador (G3): `manifest/features/23-layout-composer.json:494` `"layout.stroke#layout-boundary"`, `manifest/features/23-layout-composer.json:822` `"layout.stroke#layout-gap"`, `manifest/features/23-layout-composer.json:1180` `"layout.stroke#layout-repeat"`, `manifest/features/23-layout-composer.json:1739` `"layout.stroke#layout-vertex"` e `manifest/features/23-layout-composer.json:8590` `"layout.stroke#layout-move"`, com os rótulos "Desenhar, cortar, unir ou mover regiões" (`src/i18n/locales/pt-BR.json:2484` `"layout.door.stage": "Desenhar, cortar, unir ou mover regiões",`), "Arrastar uma divisa comum" (`src/i18n/locales/pt-BR.json:2485` `"layout.door.boundaryHandle": "Arrastar uma divisa comum",`), "Arrastar o espaçamento" (`src/i18n/locales/pt-BR.json:2486` `"layout.door.gapHandle": "Arrastar o espaçamento",`), "Arrastar para repetir" (`src/i18n/locales/pt-BR.json:2487` `"layout.door.repeatHandle": "Arrastar para repetir",`), "Arrastar um canto" (`src/i18n/locales/pt-BR.json:2488` `"layout.door.vertexHandle": "Arrastar um canto",`) e "Arraste o rótulo para mover a região" (`src/i18n/locales/pt-BR.json:2503` `"layout.door.moveHandle": "Arraste o rótulo para mover a região",`). Cada gesto é um passo de desfazer, com transação por gesto (`manifest/commands/layout-composer.json:242` `"transaction": "per-gesture",`). Os cenários cobrem desenhar uma região (`manifest/features/23-layout-composer.json:221` `"id": "a-stroke-on-empty-space-draws-a-region-as-an-element",`, barra de status `layout.status.drew` — "Nova região: {names}." em `src/i18n/locales/pt-BR.json:2519` `"layout.status.drew": "Nova região: {names}.",`), arrastar uma divisa comum (`manifest/features/23-layout-composer.json:403` `"id": "dragging-a-shared-boundary-resizes-both-regions",`, `layout.status.resized` — "Redimensionadas: {sizes}." em `src/i18n/locales/pt-BR.json:2751` `"layout.status.resized": "Redimensionadas: {sizes}.",`), arrastar o espaçamento (`manifest/features/23-layout-composer.json:735` `"id": "dragging-the-gap-widens-it",`), arrastar a ponta de uma fileira repetida (`manifest/features/23-layout-composer.json:1072` `"id": "dragging-the-end-of-a-repeated-row-adds-an-item",`) e arrastar um canto (`manifest/features/23-layout-composer.json:1648` `"id": "dragging-a-corner-moves-the-boundaries-that-meet-there",`). Pelas regras: G2 — um toque que começa grava antes a digitação pendente no contexto dela; G4 — o resultado fica visível sobre o canvas; G7 — o caminho incremental produz o mesmo DOM que o render do zero.

## REQ-1504 — layout.select (Selecionar uma região)
- **Onde:** `manifest/commands/layout-composer.json:364` `"id": "layout.select",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:574` `export const selectLayout = registerHandler<'layout.select', EditorUi>('layout.select', (context, { regions, mode }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:387` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Seleciona regiões do layout sem mudar o documento. O rótulo da interface é "Selecionar uma região" (`src/i18n/locales/pt-BR.json:2474` `"layout.command.select": "Selecionar uma região",`). Os argumentos são as regiões e o modo (`replace`, `add`, `toggle`, `cycle`). As três portas enviam só a intenção ao mesmo tratador (G3): o clique simples na região (`manifest/features/23-layout-composer.json:2063` `"layout.select#layout-region",`, modo `replace`, rótulo "Selecionar uma região" em `src/i18n/locales/pt-BR.json:2489` `"layout.door.regionClick": "Selecionar uma região",`), o clique com Shift (`manifest/features/23-layout-composer.json:2388` `"layout.select#layout-region-add"`, modo `add`, rótulo "Somar uma região à seleção" em `src/i18n/locales/pt-BR.json:2490` `"layout.door.regionAdd": "Somar uma região à seleção",`) e o clique com Alt (`manifest/features/23-layout-composer.json:2064` `"layout.select#layout-region-cycle"`, modo `cycle`, rótulo "Selecionar a região de baixo" em `src/i18n/locales/pt-BR.json:2491` `"layout.door.regionCycle": "Selecionar a região de baixo",`). O comando não entra na pilha de desfazer (`manifest/commands/layout-composer.json:398` `"undoable": false`). O cenário `a-click-selects-a-region-and-changes-nothing` (`manifest/features/23-layout-composer.json:1980` `"id": "a-click-selects-a-region-and-changes-nothing",`) muda só a seleção e anuncia `layout.status.selected` — "Selecionadas: {names}." (`src/i18n/locales/pt-BR.json:2641` `"layout.status.selected": "Selecionadas: {names}.",`); o cenário `shift-click-adds-a-region-to-the-selection` (`manifest/features/23-layout-composer.json:2305` `"id": "shift-click-adds-a-region-to-the-selection",`) soma à seleção. Pelas regras: G6 — a store é a fonte única da seleção, e canvas e Camadas apenas derivam dela.

## REQ-1505 — layout.delete (Excluir regiões)
- **Onde:** `manifest/commands/layout-composer.json:476` `"id": "layout.delete",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:585` `export const deleteLayout = registerHandler<'layout.delete', EditorUi>('layout.delete', (context) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:483` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Exclui as regiões selecionadas do layout. O rótulo da interface é "Excluir regiões" (`src/i18n/locales/pt-BR.json:2475` `"layout.command.delete": "Excluir regiões",`). As duas portas enviam só a intenção ao mesmo tratador (G3): a tecla Delete no contexto da composição (`manifest/features/23-layout-composer.json:2691` `"layout.delete#layout-delete",`, rótulo "Excluir as regiões selecionadas" em `src/i18n/locales/pt-BR.json:2492` `"layout.door.delete": "Excluir as regiões selecionadas",`) e o botão do painel (`manifest/features/23-layout-composer.json:2692` `"layout.delete#layout-delete-button"`, rótulo "Excluir regiões" em `src/i18n/locales/pt-BR.json:2493` `"layout.door.deleteButton": "Excluir regiões",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:495` `"undoable": true,`). O cenário `delete-removes-the-selected-regions` (`manifest/features/23-layout-composer.json:2629` `"id": "delete-removes-the-selected-regions",`) anuncia `layout.status.deleted` — "Exclusão: {names}." (`src/i18n/locales/pt-BR.json:2529` `"layout.status.deleted": "Exclusão: {names}.",`). Pelas regras: G1 — a exclusão é gravada no contexto em que foi feita; G2 — a tecla Delete é comando que altera o documento, então a digitação pendente é gravada antes, no contexto dela; G7 — o canvas reflete o documento; a integridade do documento permanece (nenhum bloco órfão, filhos recompostos).

## REQ-1506 — layout.place (Posicionar uma região)
- **Onde:** `manifest/commands/layout-composer.json:551` `"id": "layout.place",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:541` `export const placeLayout = registerHandler<'layout.place', EditorUi>('layout.place', (context, { target: named, dx, dy, edges }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Comportamento esperado:** Move ou redimensiona uma região com a ferramenta de seleção. O rótulo da interface é "Posicionar uma região" (`src/i18n/locales/pt-BR.json:2477` `"layout.command.place": "Posicionar uma região",`). Os argumentos são o alvo opcional, o deslocamento `dx` e `dy` e as bordas (`move`, `n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`). As duas portas enviam só a intenção ao mesmo tratador (G3): o arraste de uma região (`manifest/features/23-layout-composer.json:11405` `"layout.place#canvas-drag-layout-region"`, com `edges` igual a `move`), rótulo "Arraste uma região para movê-la" (`src/i18n/locales/pt-BR.json:2478` `"layout.door.placeRegion": "Arraste uma região para movê-la",`), e o puxador de borda (`manifest/features/23-layout-composer.json:11627` `"layout.place#handle-layout-region-edge"`), rótulo "Arraste o puxador de uma região para redimensioná-la" (`src/i18n/locales/pt-BR.json:2479` `"layout.door.resizeRegion": "Arraste o puxador de uma região para redimensioná-la",`). É um passo de desfazer, com transação por gesto (`manifest/commands/layout-composer.json:602` `"transaction": "per-gesture",`). Os cenários `the-select-tool-moves-a-region-in-the-layout` (`manifest/features/23-layout-composer.json:11319` `"id": "the-select-tool-moves-a-region-in-the-layout",`, barra de status `layout.status.moved` — "Nova posição: {names}." em `src/i18n/locales/pt-BR.json:2523` `"layout.status.moved": "Nova posição: {names}.",`) e `the-select-tool-resizes-a-region-in-the-layout` (`manifest/features/23-layout-composer.json:11541` `"id": "the-select-tool-resizes-a-region-in-the-layout",`, `layout.status.resized`) cobrem o mover e o redimensionar. Pelas regras: G2 — um toque que começa grava antes a digitação pendente; G7 — o canvas reflete o documento.

## REQ-1507 — layout.merge (Unir regiões)
- **Onde:** `manifest/commands/layout-composer.json:650` `"id": "layout.merge",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:599` `export const mergeLayout = registerHandler<'layout.merge', EditorUi>('layout.merge', (context) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:657` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Une as regiões selecionadas numa só. O rótulo da interface é "Unir regiões" (`src/i18n/locales/pt-BR.json:2476` `"layout.command.merge": "Unir regiões",`). A única porta é o botão do painel (`manifest/features/23-layout-composer.json:10721` `"layout.merge#layout-merge-button"`), com o rótulo "Unir" (`src/i18n/locales/pt-BR.json:2494` `"layout.door.mergeButton": "Unir",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:669` `"undoable": true,`). O cenário `merge-makes-the-selected-regions-one` (`manifest/features/23-layout-composer.json:10610` `"id": "merge-makes-the-selected-regions-one",`) anuncia `layout.status.merged` — "Regiões unidas em {name}." (`src/i18n/locales/pt-BR.json:2521` `"layout.status.merged": "Regiões unidas em {name}.",`). Pelas regras: G1 — a união é gravada no contexto em que foi feita; G3 — a porta envia só a intenção; G7 — o canvas reflete o documento a cada escrita; a integridade do documento permanece (regiões da mesma área, sem sobreposição).

## REQ-1508 — layout.configure (Definir uma propriedade da região)
- **Onde:** `manifest/commands/layout-composer.json:705` `"id": "layout.configure",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:654` `export const configureLayout = registerHandler<'layout.configure', EditorUi>('layout.configure', (context, { field, value }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:734` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Define uma propriedade da região selecionada. O rótulo da interface é "Definir uma propriedade da região" (`src/i18n/locales/pt-BR.json:2648` `"layout.command.configure": "Definir uma propriedade da região",`). Os argumentos são o campo (`name`, `semantic`, `width`, `height`, `padding`, `alignment`, `distribution`, `equalize`, `spacing`, `repeat`) e o valor. As portas são controles de painel que enviam só a intenção ao mesmo tratador (G3): nome (`manifest/features/23-layout-composer.json:2984` `"layout.configure#layout-name"`), significado (`manifest/features/23-layout-composer.json:3317` `"layout.configure#layout-semantic"`), largura (`manifest/features/23-layout-composer.json:3650` `"layout.configure#layout-width"`), altura (`manifest/features/23-layout-composer.json:3982` `"layout.configure#layout-height"`), espaço interno (`manifest/features/23-layout-composer.json:4312` `"layout.configure#layout-padding"`), alinhamento (`manifest/features/23-layout-composer.json:4655` `"layout.configure#layout-alignment"`), distribuição (`manifest/features/23-layout-composer.json:4992` `"layout.configure#layout-distribution"`), espaçamento (`manifest/features/23-layout-composer.json:10218` `"layout.configure#layout-spacing"`), repetição (`manifest/features/23-layout-composer.json:10936` `"layout.configure#layout-repeat"`), igualar larguras (`manifest/features/23-layout-composer.json:8917` `"layout.configure#layout-equal-widths"`, com o valor `equal-size`) e igualar espaços (`manifest/features/23-layout-composer.json:9315` `"layout.configure#layout-equal-gaps"`, com o valor `gap`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:745` `"undoable": true,`). A barra de status anuncia `layout.status.configured` (`src/i18n/locales/pt-BR.json:2671` `"layout.status.configured": "{names} — {property}: ajuste aplicado.",`) e, nas igualdades, `layout.status.equalized` — "Agora iguais: {names}." (`src/i18n/locales/pt-BR.json:2505` `"layout.status.equalized": "Agora iguais: {names}.",`). Os cenários cobrem renomear (`manifest/features/23-layout-composer.json:2894` `"id": "renaming-a-region-renames-its-element",`), significado (`manifest/features/23-layout-composer.json:3227` `"id": "a-region-meaning-is-the-tag-of-its-element",`), largura (`manifest/features/23-layout-composer.json:3560` `"id": "a-region-can-fill-the-width-left",`), altura (`manifest/features/23-layout-composer.json:3892` `"id": "a-region-can-take-the-height-of-its-content",`), espaço interno (`manifest/features/23-layout-composer.json:4222` `"id": "the-inner-space-of-a-region-is-its-padding",`), alinhamento (`manifest/features/23-layout-composer.json:4565` `"id": "a-region-aligns-what-it-holds",`), distribuição (`manifest/features/23-layout-composer.json:4902` `"id": "a-region-distributes-what-it-holds",`), igualar larguras (`manifest/features/23-layout-composer.json:8803` `"id": "equal-widths-makes-the-selected-regions-as-wide",`), igualar espaços (`manifest/features/23-layout-composer.json:9166` `"id": "equal-gaps-keeps-one-gap-between-the-selected-regions",`), espaçamento (`manifest/features/23-layout-composer.json:10069` `"id": "spacing-puts-one-gap-typed-between-the-selected-regions",`) e repetição (`manifest/features/23-layout-composer.json:10857` `"id": "repeat-makes-items-of-the-selected-region",`). Pelas regras: G1 — nome, espaço interno, espaçamento e repetição são campos de digitação, gravados no contexto em que foram digitados; G2 — o registro único grava a digitação pendente antes de qualquer entrada que mude a seleção ou a camada, feche um painel ou comece um toque; G7 — o canvas reflete o documento.

## REQ-1509 — layout.interpret (Escolher como as regiões se organizam)
- **Onde:** `manifest/commands/layout-composer.json:1065` `"id": "layout.interpret",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:752` `export const interpretLayout = registerHandler<'layout.interpret', EditorUi>('layout.interpret', (context, { strategy }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1085` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Escolhe como as regiões se organizam. O rótulo da interface é "Escolher como as regiões se organizam" (`src/i18n/locales/pt-BR.json:2649` `"layout.command.interpret": "Escolher como as regiões se organizam",`). O argumento é a estratégia (`auto`, `grid`, `flex`, `fixed`, `proportional`, `masonry`). A única porta é o controle do painel (`manifest/features/23-layout-composer.json:5328` `"layout.interpret#layout-strategy"`), com o rótulo "Organização" (`src/i18n/locales/pt-BR.json:2660` `"layout.door.strategy": "Organização",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1096` `"undoable": true,`). O cenário `the-arrangement-can-be-a-grid` (`manifest/features/23-layout-composer.json:5239` `"id": "the-arrangement-can-be-a-grid",`) anuncia `layout.status.interpreted` — "Organizado como {strategy}." (`src/i18n/locales/pt-BR.json:2672` `"layout.status.interpreted": "Organizado como {strategy}.",`). O intent da feature declara que compor devolve estrutura comum de flex e grade (`manifest/features/23-layout-composer.json:30` `"title": "Compose a container's layout by drawing regions, and get ordinary flex and grid structure",`). Pelas regras: G1 — a escolha é gravada no contexto (breakpoint e estado); G3 — a porta envia só a intenção; G7 — o canvas reflete o documento.

## REQ-1510 — layout.respond (Mudar o layout neste tamanho de tela)
- **Onde:** `manifest/commands/layout-composer.json:1132` `"id": "layout.respond",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:764` `export const respondLayout = registerHandler<'layout.respond', EditorUi>('layout.respond', (context, { edit, value }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1156` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Muda o que acontece com o layout num tamanho de tela menor que o desenhado. O rótulo da interface é "Mudar o layout neste tamanho de tela" (`src/i18n/locales/pt-BR.json:2650` `"layout.command.respond": "Mudar o layout neste tamanho de tela",`). Os argumentos são a edição (`stack`, `unstack`, `columns`, `hide`, `show`) e o valor opcional. As cinco portas enviam só a intenção ao mesmo tratador (G3): empilhar (`manifest/features/23-layout-composer.json:5680` `"layout.respond#layout-stack"`, rótulo "Empilhar aqui" em `src/i18n/locales/pt-BR.json:2661` `"layout.door.stack": "Empilhar aqui",`), manter a organização desenhada (`manifest/features/23-layout-composer.json:6039` `"layout.respond#layout-unstack"`, rótulo "Manter a organização desenhada aqui" em `src/i18n/locales/pt-BR.json:2662` `"layout.door.unstack": "Manter a organização desenhada aqui",`), colunas (`manifest/features/23-layout-composer.json:6356` `"layout.respond#layout-columns"`, rótulo "Colunas aqui" em `src/i18n/locales/pt-BR.json:2663` `"layout.door.columns": "Colunas aqui",`), ocultar (`manifest/features/23-layout-composer.json:6704` `"layout.respond#layout-hide"`, rótulo "Ocultar aqui" em `src/i18n/locales/pt-BR.json:2664` `"layout.door.hide": "Ocultar aqui",`) e mostrar (`manifest/features/23-layout-composer.json:7066` `"layout.respond#layout-show"`, rótulo "Mostrar aqui" em `src/i18n/locales/pt-BR.json:2665` `"layout.door.show": "Mostrar aqui",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1168` `"undoable": true,`). Os cenários cobrem empilhar no tablet (`manifest/features/23-layout-composer.json:5580` `"id": "the-regions-stack-on-a-tablet",`), trazer de volta a organização desenhada (`manifest/features/23-layout-composer.json:5928` `"id": "the-drawn-arrangement-comes-back-on-a-tablet",`), uma coluna no tablet (`manifest/features/23-layout-composer.json:6255` `"id": "one-column-on-a-tablet",`), ocultar (`manifest/features/23-layout-composer.json:6604` `"id": "a-region-hides-on-a-tablet",`) e mostrar de novo (`manifest/features/23-layout-composer.json:6955` `"id": "a-hidden-region-shows-again-on-a-tablet",`), todos anunciando `layout.status.responded` — "Alterado em {breakpoint} e menores." (`src/i18n/locales/pt-BR.json:2673` `"layout.status.responded": "Alterado em {breakpoint} e menores.",`). Este é o tamanho em que o layout é desenhado, e o painel explica isso pela chave `layout.respond.base` (`src/i18n/locales/pt-BR.json:2666` `"layout.respond.base": "Este é o tamanho de tela em que o layout é desenhado. Escolha um menor nas abas do quadro para mudar o que acontece lá.",`). Pelas regras: G1 — a mudança é gravada no contexto (breakpoint, estado e quadro-chave); G3 — as portas enviam só a intenção; G7 — o canvas reflete o documento em cada tamanho de tela.

## REQ-1511 — layout.unrelate (Remover uma regra do layout)
- **Onde:** `manifest/commands/layout-composer.json:1318` `"id": "layout.unrelate",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:784` `export const unrelateLayout = registerHandler<'layout.unrelate', EditorUi>('layout.unrelate', (context, { constraint }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1331` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Remove uma regra do layout. O rótulo da interface é "Remover uma regra do layout" (`src/i18n/locales/pt-BR.json:2704` `"layout.command.unrelate": "Remover uma regra do layout",`). O argumento é a regra a remover. A única porta é o controle do painel (`manifest/features/23-layout-composer.json:9832` `"layout.unrelate#layout-unrelate"`), com o rótulo "Remover esta regra" (`src/i18n/locales/pt-BR.json:2709` `"layout.door.unrelate": "Remover esta regra",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1342` `"undoable": true,`). O cenário `a-rule-is-removed-by-its-door` (`manifest/features/23-layout-composer.json:9707` `"id": "a-rule-is-removed-by-its-door",`) anuncia `layout.status.unrelated` — "Regra removida." (`src/i18n/locales/pt-BR.json:2742` `"layout.status.unrelated": "Regra removida.",`). Pelas regras: G1 — a remoção é gravada no contexto em que foi feita; G3 — a porta envia só a intenção; G7 — o canvas reflete o documento; a integridade do documento permanece (nenhuma referência quebrada a uma região removida).

## REQ-1512 — layout.suggest (Aplicar uma sugestão de layout)
- **Onde:** `manifest/commands/layout-composer.json:1380` `"id": "layout.suggest",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:815` `export const suggestLayout = registerHandler<'layout.suggest', EditorUi>('layout.suggest', (context, { suggestion }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1393` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Aplica uma sugestão de layout. O rótulo da interface é "Aplicar uma sugestão de layout" (`src/i18n/locales/pt-BR.json:2705` `"layout.command.suggest": "Aplicar uma sugestão de layout",`). O argumento é a sugestão escolhida. A única porta é o botão do painel (`manifest/features/23-layout-composer.json:7356` `"layout.suggest#layout-suggest"`), com o rótulo "Aplicar" (`src/i18n/locales/pt-BR.json:2710` `"layout.door.suggest": "Aplicar",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1404` `"undoable": true,`). O cenário `a-wrapper-that-changes-nothing-goes-from-its-suggestion` (`manifest/features/23-layout-composer.json:7313` `"id": "a-wrapper-that-changes-nothing-goes-from-its-suggestion",`) aplica a sugestão e anuncia `layout.status.suggested` — "Sugestão aplicada." (`src/i18n/locales/pt-BR.json:2743` `"layout.status.suggested": "Sugestão aplicada.",`). Pelas regras: G1 — a mudança é gravada no contexto em que foi feita; G3 — a porta envia só a intenção; G7 — o canvas reflete o documento.

## REQ-1513 — layout.template (Colocar um modelo de layout)
- **Onde:** `manifest/commands/layout-composer.json:1442` `"id": "layout.template",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:827` `export const templateLayout = registerHandler<'layout.template', EditorUi>('layout.template', (context, { template }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1461` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Coloca um modelo de layout no contêiner vazio. O rótulo da interface é "Colocar um modelo de layout" (`src/i18n/locales/pt-BR.json:2706` `"layout.command.template": "Colocar um modelo de layout",`). O argumento é o modelo (`dashboard`, `landing`, `sidebar`, `article`, `gallery`). A única porta é o controle do painel (`manifest/features/23-layout-composer.json:7531` `"layout.template#layout-template"`), com o rótulo "Modelos" (`src/i18n/locales/pt-BR.json:2711` `"layout.door.template": "Modelos",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1472` `"undoable": true,`). O cenário `a-template-fills-the-empty-container` (`manifest/features/23-layout-composer.json:7488` `"id": "a-template-fills-the-empty-container",`) coloca o modelo "lateral" e anuncia `layout.status.templated` — "Modelo {template} colocado." (`src/i18n/locales/pt-BR.json:2744` `"layout.status.templated": "Modelo {template} colocado.",`). Pelas regras: G1 — o modelo é gravado no contexto em que foi aplicado; G3 — a porta envia só a intenção; G7 — o canvas reflete o documento; a integridade do documento permanece (regiões válidas, ids únicos).

## REQ-1514 — layout.reference (Definir a imagem de referência)
- **Onde:** `manifest/commands/layout-composer.json:1508` `"id": "layout.reference",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:847` `export const referenceLayout = registerHandler<'layout.reference', EditorUi>('layout.reference', (context, { file, opacity }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1526` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Define a imagem de referência para traçar regiões sobre ela. O rótulo da interface é "Definir a imagem de referência" (`src/i18n/locales/pt-BR.json:2707` `"layout.command.reference": "Definir a imagem de referência",`). Os argumentos são o arquivo e a opacidade, ambos opcionais. As três portas enviam só a intenção ao mesmo tratador (G3): escolher a imagem (`manifest/features/23-layout-composer.json:7809` `"layout.reference#layout-reference"`, rótulo "Imagem de referência" em `src/i18n/locales/pt-BR.json:2712` `"layout.door.reference": "Imagem de referência",`), digitar a opacidade (`manifest/features/23-layout-composer.json:7929` `"layout.reference#layout-reference-opacity"`, rótulo "Opacidade da referência (%)" em `src/i18n/locales/pt-BR.json:2713` `"layout.door.referenceOpacity": "Opacidade da referência (%)",`) e remover a referência (`manifest/features/23-layout-composer.json:8049` `"layout.reference#layout-reference-clear"`, rótulo "Remover a referência" em `src/i18n/locales/pt-BR.json:2714` `"layout.door.referenceClear": "Remover a referência",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1537` `"undoable": true,`). Os cenários cobrem escolher a imagem (`manifest/features/23-layout-composer.json:7766` `"id": "a-project-image-becomes-the-reference",`), digitar a opacidade (`manifest/features/23-layout-composer.json:7875` `"id": "the-reference-opacity-is-typed",`) e remover a referência (`manifest/features/23-layout-composer.json:7995` `"id": "the-reference-is-removed",`), anunciando `layout.status.referenced` — "Imagem de referência: {file}." (`src/i18n/locales/pt-BR.json:2745` `"layout.status.referenced": "Imagem de referência: {file}.",`) — e `layout.status.unreferenced` — "Imagem de referência removida." (`src/i18n/locales/pt-BR.json:2746` `"layout.status.unreferenced": "Imagem de referência removida.",`). Pelas regras: G1 — a referência é gravada no contexto da composição mais a digitação da opacidade no contexto dela; G2 — a opacidade é um campo de digitação, gravado antes de qualquer entrada que mude a seleção ou feche o painel; G7 — o canvas reflete o documento.

## REQ-1515 — layout.trace (Traçar regiões a partir da imagem de referência)
- **Onde:** `manifest/commands/layout-composer.json:1627` `"id": "layout.trace",`
- **Tratador:** `src/modules/layout-composer/host/handlers.ts:878` `export const traceLayout = registerHandler<'layout.trace', EditorUi>('layout.trace', (context, { luminance }) =>` — a tabela do núcleo recebe os comandos do módulo em `src/app/commands.ts:511` `...MODULE_COMMANDS,`
- **Feature:** `src/app/features.ts:12` `'layout-composer': registerFeature('layout-composer'),`
- **Recusa declarada:** `manifest/commands/layout-composer.json:1640` `"refusalKey": "layout.inactive"`
- **Comportamento esperado:** Traça regiões a partir da imagem de referência. O rótulo da interface é "Traçar regiões a partir da imagem de referência" (`src/i18n/locales/pt-BR.json:2708` `"layout.command.trace": "Traçar regiões a partir da imagem de referência",`). O argumento é a luminância, opcional. A única porta é o botão do painel (`manifest/features/23-layout-composer.json:8154` `"layout.trace#layout-trace"`), com o rótulo "Traçar regiões da imagem" (`src/i18n/locales/pt-BR.json:2715` `"layout.door.trace": "Traçar regiões da imagem",`). É um passo de desfazer (`"undoable": true` em `manifest/commands/layout-composer.json:1651` `"undoable": true,`). O cenário `the-reference-is-traced-into-regions` (`manifest/features/23-layout-composer.json:8102` `"id": "the-reference-is-traced-into-regions",`) anuncia `layout.status.traced` — "{count} regiões traçadas da imagem." (`src/i18n/locales/pt-BR.json:2747` `"layout.status.traced": "{count} regiões traçadas da imagem.",`). Sem uma imagem de referência escolhida, o comando recusa com a chave `layout.problem.no-reference` — "Escolha uma imagem de referência primeiro." (`src/i18n/locales/pt-BR.json:2749` `"layout.problem.no-reference": "Escolha uma imagem de referência primeiro.",`). Pelas regras: G1 — as regiões traçadas são gravadas no contexto em que foram feitas; G3 — a porta envia só a intenção; G7 — o canvas reflete o documento; a integridade do documento permanece (regiões válidas, ids únicos).

## REQ-1601 — motion.add (Adicionar uma interação)
- **Onde:** `manifest/commands/motion.json:5` `"id": "motion.add",`
- **Tratador:** `src/app/commands.ts:264` `'motion.add': addMotionCommand,`
- **Feature:** `src/app/features.ts:206` `'motion-interactions': registerFeature('motion-interactions'),`
- **Recusa declarada:** `manifest/commands/motion.json:67` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** Adiciona uma interação ao elemento selecionado; o rótulo da interface é "Adicionar uma interação" (`src/i18n/locales/pt-BR.json:2753` `"command.motion.add": "Adicionar uma interação",`). A interação nasce com o gatilho de clique e uma linha do tempo nova batizada com o nome do elemento e do gatilho (`manifest/features/24-motion.json:19` `"Select an element, open Interactions and add one: it plays a new timeline named after the element and the trigger.",`); a interação fica guardada no elemento, apontando a linha do tempo pelo nome (`manifest/features/24-motion.json:75` `"timeline": "Hero click",`), e a linha do tempo fica no projeto, de modo que cada alteração é um passo de desfazer (`manifest/features/24-motion.json:24` `"The interaction is stored on the element, its timeline in the project; each change is one undo step."`). A barra de status anuncia a interação criada com a chave `status.motion.added` (`manifest/features/24-motion.json:118` `"key": "status.motion.added",`) nomeando o gatilho na interação com o elemento — "On click" no cenário `an-interaction-is-added-with-a-timeline-of-its-own` (`manifest/features/24-motion.json:120` `"name": "On click",`). Sem seleção única, o predicado recusa a porta com `status.needsSingleSelection` — "Isto exige uma seleção única." (`src/i18n/locales/pt-BR.json:1857` `"status.needsSingleSelection": "Isto exige uma seleção única.",`) — e o documento fica inalterado; um gatilho que não se aplica ao elemento é recusado com `status.motion.notApplicable` (`manifest/features/24-motion.json:5314` `"key": "status.motion.notApplicable",`), no cenário `a-motion-trigger-that-cannot-apply-is-refused`. Pelas regras do editor: G1 — a interação é gravada no contexto em que foi feita (elementos, breakpoint, estado, classe-alvo e quadro-chave); G2 — por ser comando que altera o documento e chega de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G6 — canvas e Camadas leem a seleção da store; G7 — o canvas é o documento, e o render incremental coincide com o render do zero; a escrita deixa o esquema do elemento válido, os ids únicos e a pilha de undo/redo consistente.

## REQ-1602 — motion.update (Alterar a interação)
- **Onde:** `manifest/commands/motion.json:113` `"id": "motion.update",`
- **Tratador:** `src/app/commands.ts:265` `'motion.update': updateMotionCommand,`
- **Feature:** `src/app/features.ts:206` `'motion-interactions': registerFeature('motion-interactions'),`
- **Comportamento esperado:** Altera a interação do elemento selecionado, campo a campo; o rótulo da interface é "Alterar a interação" (`src/i18n/locales/pt-BR.json:2782` `"command.motion.update": "Alterar a interação",`). O gatilho escolhido define as opções oferecidas (`manifest/features/24-motion.json:20` `"Choose each trigger of the catalogue and set its options; make another element play the same timeline by name; apply it to every .card."`). Exemplos dos cenários: trocar o gatilho para duplo clique grava a interação com `"kind": "double-click"` (`manifest/features/24-motion.json:194` `"kind": "double-click"`); o gatilho de passar o ponteiro acrescenta a saída `"leave": "reverse"` (`manifest/features/24-motion.json:798` `"leave": "reverse"`); o escopo de classe grava `"scope": "card"` (`manifest/features/24-motion.json:6032` `"scope": "card"`), fazendo a interação valer para todo elemento daquela classe no cenário `the-interaction-applies-to-every-element-of-a-class`; e o "uma vez" grava `"once": true` (`manifest/features/24-motion.json:6153` `"once": true`), no cenário `the-interaction-runs-only-once`. Cada alteração anuncia na barra de status `status.motion.updated` (`manifest/features/24-motion.json:239` `"key": "status.motion.updated",`) com o nome do gatilho e o elemento. Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita, com o breakpoint, o estado, a classe-alvo e o quadro-chave; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas de campo do inspector enviam só o texto digitado e o campo ao único tratador; G6 — canvas e Camadas leem a seleção da store; G7 — o canvas é o documento, e o render incremental coincide com o render do zero; a escrita mantém o esquema válido, os ids únicos e a pilha de undo/redo consistente.

## REQ-1603 — motion.remove (Remover a interação)
- **Onde:** `manifest/commands/motion.json:737` `"id": "motion.remove",`
- **Tratador:** `src/app/commands.ts:266` `'motion.remove': removeMotionCommand,`
- **Feature:** `src/app/features.ts:206` `'motion-interactions': registerFeature('motion-interactions'),`
- **Comportamento esperado:** Remove a interação do elemento selecionado; o rótulo da interface é "Remover a interação" (`src/i18n/locales/pt-BR.json:2767` `"command.motion.remove": "Remover a interação",`). A barra de status anuncia a remoção com a chave `status.motion.removed` (`manifest/features/24-motion.json:7901` `"key": "status.motion.removed",`), nomeando o gatilho e o elemento — "On click" (`manifest/features/24-motion.json:7903` `"name": "On click",`) — no cenário `an-interaction-is-removed-and-its-timeline-stays`, onde a linha do tempo continua no projeto. Pelas regras do editor: G1 — a remoção é gravada no contexto em que foi feita (elemento, breakpoint, estado, classe-alvo e quadro-chave); G2 — por ser comando que altera o documento e chega de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G6 — canvas e Camadas leem a seleção da store; G7 — o canvas é o documento, e o render incremental coincide com o render do zero; a remoção deixa o esquema válido, sem referência quebrada, e a pilha de undo/redo consistente.

## REQ-1604 — motion.createTimeline (Nova linha do tempo)
- **Onde:** `manifest/commands/motion.json:793` `"id": "motion.createTimeline",`
- **Tratador:** `src/app/commands.ts:267` `'motion.createTimeline': createTimelineCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Cria uma linha do tempo vazia no projeto, com o nome digitado; o rótulo da interface é "Nova linha do tempo" (`src/i18n/locales/pt-BR.json:2757` `"command.motion.createTimeline": "Nova linha do tempo",`). No cenário `a-timeline-is-made-to-reuse`, o campo recebe o nome "Fade in" (`manifest/features/24-motion.json:5367` `"name": "Fade in"`), a linha do tempo entra no projeto sem ações nem marcadores e a barra de status anuncia `status.motion.timelineCreated` (`manifest/features/24-motion.json:8027` `"key": "status.motion.timelineCreated",`), cujo texto é "Criada a linha do tempo {name}." (`src/i18n/locales/pt-BR.json:3096` `"status.motion.timelineCreated": "Criada a linha do tempo {name}.",`). Nome fora do aceito é recusado com "não é um nome de linha do tempo" (`src/i18n/locales/pt-BR.json:3074` `"status.motion.nameInvalid":`) e nome repetido com "Já existe uma linha do tempo chamada {name}." (`src/i18n/locales/pt-BR.json:3075` `"status.motion.nameTaken": "Já existe uma linha do tempo chamada {name}.",`), sem alterar o documento. Pelas regras do editor: G1 — a criação é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém os nomes e ids consistentes e a pilha de undo/redo inteira.

## REQ-1605 — motion.renameTimeline (Renomear a linha do tempo)
- **Onde:** `manifest/commands/motion.json:850` `"id": "motion.renameTimeline",`
- **Tratador:** `src/app/commands.ts:268` `'motion.renameTimeline': renameTimelineCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Renomeia a linha do tempo e faz as interações que a apontam seguir o nome novo; o rótulo da interface é "Renomear a linha do tempo" (`src/i18n/locales/pt-BR.json:2772` `"command.motion.renameTimeline": "Renomear a linha do tempo",`). No cenário `a-timeline-is-renamed-and-its-interactions-follow`, a interação passa a apontar o nome novo (`manifest/features/24-motion.json:8115` `"timeline": "Hero intro",`) e a barra de status anuncia `status.motion.timelineRenamed` (`manifest/features/24-motion.json:8158` `"key": "status.motion.timelineRenamed",`), com o nome antigo `"oldName": "Hero click",` (`manifest/features/24-motion.json:8160` `"oldName": "Hero click",`) — "Renomeada a linha do tempo {oldName} para {name}." (`src/i18n/locales/pt-BR.json:3101` `"status.motion.timelineRenamed": "Renomeada a linha do tempo {oldName} para {name}.",`). Nome repetido é recusado sem alterar o documento. Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta de campo envia só o texto ao único tratador; G7 — o canvas é o documento; a escrita mantém as referências por nome válidas e a pilha de undo/redo consistente.

## REQ-1606 — motion.deleteTimeline (Excluir a linha do tempo)
- **Onde:** `manifest/commands/motion.json:913` `"id": "motion.deleteTimeline",`
- **Tratador:** `src/app/commands.ts:269` `'motion.deleteTimeline': deleteTimelineCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Exclui uma linha do tempo que ninguém usa; o rótulo da interface é "Excluir a linha do tempo" (`src/i18n/locales/pt-BR.json:2759` `"command.motion.deleteTimeline": "Excluir a linha do tempo",`). No cenário `an-unused-timeline-is-deleted` a linha do tempo sai do projeto e a barra de status anuncia `status.motion.timelineDeleted` (`manifest/features/24-motion.json:8244` `"key": "status.motion.timelineDeleted",`) — "Excluída a linha do tempo {name}." (`src/i18n/locales/pt-BR.json:3097` `"status.motion.timelineDeleted": "Excluída a linha do tempo {name}.",`). Uma linha do tempo que alguma interação reproduz ou controla é recusada com `status.motion.timelineInUse` (`manifest/features/24-motion.json:8388` `"key": "status.motion.timelineInUse",`), no cenário `a-timeline-an-interaction-plays-is-not-deleted`, e o documento fica inalterado — "{name} é reproduzida ou controlada {count} vezes: remova essas primeiro." (`src/i18n/locales/pt-BR.json:3098` `"status.motion.timelineInUse": "{name} é reproduzida ou controlada {count} vezes: remova essas primeiro.",`). Pelas regras do editor: G1 — a exclusão é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita não deixa referência quebrada nem bloco órfão e mantém a pilha de undo/redo consistente.

## REQ-1607 — motion.openTimeline (Mostrar esta linha do tempo)
- **Onde:** `manifest/commands/motion.json:970` `"id": "motion.openTimeline",`
- **Tratador:** `src/app/commands.ts:270` `'motion.openTimeline': openTimelineCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Abre na linha do tempo do editor a linha do tempo escolhida na lista; o rótulo da interface é "Mostrar esta linha do tempo" (`src/i18n/locales/pt-BR.json:2764` `"command.motion.openTimeline": "Mostrar esta linha do tempo",`). No cenário `the-panel-shows-another-timeline`, escolher "Fade in" na lista passa a mostrar essa linha do tempo e a barra de status anuncia `status.motion.timelineOpened` (`manifest/features/24-motion.json:8522` `"key": "status.motion.timelineOpened",`) — "A linha do tempo mostra {name}." (`src/i18n/locales/pt-BR.json:3100` `"status.motion.timelineOpened": "A linha do tempo mostra {name}.",`). A escolha é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:990` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G6 — todas as vistas leem o estado da store; o documento fica inalterado.

## REQ-1608 — motion.addAction (Adicionar uma ação)
- **Onde:** `manifest/commands/motion.json:1022` `"id": "motion.addAction",`
- **Tratador:** `src/app/commands.ts:271` `'motion.addAction': addActionCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Adiciona à linha do tempo aberta uma ação do catálogo, com a colocação escolhida — depois, junto ou no cabeçote (`manifest/features/24-motion.json:7951` `"Open the Timeline, add each action of the catalogue after, with or at the playhead; drag bars and their edges; pick targets on the canvas or in Layers; add markers."`); o rótulo da interface é "Adicionar uma ação" (`src/i18n/locales/pt-BR.json:2754` `"command.motion.addAction": "Adicionar uma ação",`), e as portas trazem os rótulos "Adicionar depois" (`src/i18n/locales/pt-BR.json:2931` `"motion.timeline.addAfter": "Adicionar depois",`), "Adicionar junto" (`src/i18n/locales/pt-BR.json:2934` `"motion.timeline.addWith": "Adicionar junto",`) e "Adicionar no cabeçote" (`src/i18n/locales/pt-BR.json:2932` `"motion.timeline.addAt": "Adicionar no cabeçote",`). A ação "animate" entra como no cenário `the-action-animate-is-added`, e a barra de status anuncia `status.motion.actionAdded` (`manifest/features/24-motion.json:8664` `"key": "status.motion.actionAdded",`). Com "junto" a ação nova começa junto da última (`manifest/features/24-motion.json:12087` `"start": 0,`, porta `manifest/features/24-motion.json:12034` `"door": "motion.addAction#timeline-motion-add-action-with",`), no cenário `an-action-is-added-with-the-last-one`; no cabeçote começa no ponto do cabeçote, no cenário `an-action-is-added-at-the-playhead` (porta `manifest/features/24-motion.json:12187` `"door": "motion.addAction#timeline-motion-add-action-at",`). Pelas regras do editor: G1 — a ação é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — cada porta envia só a intenção, o texto do campo e a colocação, ao único tratador; G7 — o canvas é o documento; a escrita mantém o esquema da ação válido e a pilha de undo/redo consistente.

## REQ-1609 — motion.updateAction (Alterar a ação)
- **Onde:** `manifest/commands/motion.json:1176` `"id": "motion.updateAction",`
- **Tratador:** `src/app/commands.ts:272` `'motion.updateAction': MOTION_UPDATE_ACTION,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Altera a ação selecionada na linha do tempo, campo a campo: o tipo, o alvo, o valor do alvo, o início, a duração, a suavização, a repetição, a ida e volta, o escalonamento e o ponto de partida do escalonamento; o rótulo da interface é "Alterar a ação" (`src/i18n/locales/pt-BR.json:2783` `"command.motion.updateAction": "Alterar a ação",`). Cada alteração anuncia `status.motion.actionUpdated` (`manifest/features/24-motion.json:12410` `"key": "status.motion.actionUpdated",`). O alvo da ação pode ser escolhido com o botão "Escolher o alvo" (`src/i18n/locales/pt-BR.json:2906` `"motion.pickTarget": "Escolher o alvo",`) e apontado no canvas (`manifest/features/24-motion.json:12802` `"door": "motion.updateAction#canvas-click-pick-motion-target",`) ou numa linha de Camadas (`manifest/features/24-motion.json:12959` `"door": "motion.updateAction#layers-row-pick-motion-target",`), gravando o nó escolhido como alvo da ação. O escalonamento é gravado em passos por alvo — `"each": 100,` (`manifest/features/24-motion.json:13881` `"each": 100,`) — e o início em milissegundos — `"start": 1000,` (`manifest/features/24-motion.json:13146` `"start": 1000,`). Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — todas as portas (campos, botão de escolher alvo, clique no canvas e linha de Camadas) enviam só a intenção ao único tratador; G6 — Camadas e canvas leem a seleção da store; G7 — o canvas é o documento; a escrita mantém o esquema da ação válido e a pilha de undo/redo consistente.

## REQ-1610 — motion.setEffectOption (Alterar uma opção da ação)
- **Onde:** `manifest/commands/motion.json:1603` `"id": "motion.setEffectOption",`
- **Tratador:** `src/app/commands.ts:273` `'motion.setEffectOption': setEffectOptionCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Altera uma opção própria do efeito da ação selecionada; o rótulo da interface é "Alterar uma opção da ação" (`src/i18n/locales/pt-BR.json:2776` `"command.motion.setEffectOption": "Alterar uma opção da ação",`). No cenário `an-option-of-an-action-is-set`, a opção escolhida é a classe (`manifest/features/24-motion.json:14145` `"option": "className",`), e o efeito passa a valer com a classe informada; a barra de status anuncia `status.motion.actionUpdated` (`manifest/features/24-motion.json:14223` `"key": "status.motion.actionUpdated",`). Uma opção que o efeito não tem é recusada sem alterar o documento. Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só o nome da opção e o valor ao único tratador; G7 — o canvas é o documento; a escrita mantém o esquema do efeito válido e a pilha de undo/redo consistente.

## REQ-1611 — motion.removeActions (Excluir as ações selecionadas)
- **Onde:** `manifest/commands/motion.json:1710` `"id": "motion.removeActions",`
- **Tratador:** `src/app/commands.ts:274` `'motion.removeActions': removeActionsCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Exclui as ações selecionadas da linha do tempo; o rótulo da interface é "Excluir as ações selecionadas" (`src/i18n/locales/pt-BR.json:2768` `"command.motion.removeActions": "Excluir as ações selecionadas",`). No cenário `an-action-is-deleted`, a ação sai da linha do tempo e a barra de status anuncia `status.motion.actionsRemoved` (`manifest/features/24-motion.json:14354` `"key": "status.motion.actionsRemoved",`) — "Excluídas ações de {timeline}." (`src/i18n/locales/pt-BR.json:3057` `"status.motion.actionsRemoved": "Excluídas ações de {timeline}.",`). Pelas regras do editor: G1 — a exclusão é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém o esquema da linha do tempo válido e a pilha de undo/redo consistente.

## REQ-1612 — motion.moveActions (Mover ações na linha do tempo)
- **Onde:** `manifest/commands/motion.json:1776` `"id": "motion.moveActions",`
- **Tratador:** `src/app/commands.ts:275` `'motion.moveActions': moveActionsCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Move as ações selecionadas ao longo da linha do tempo, arrastando as barras; o rótulo da interface é "Mover ações na linha do tempo" (`src/i18n/locales/pt-BR.json:2761` `"command.motion.moveActions": "Mover ações na linha do tempo",`). No cenário `an-action-bar-is-dragged-along-the-timeline`, arrastar a barra desloca o início da ação para o novo ponto — `"start": 500,` (`manifest/features/24-motion.json:14459` `"start": 500,`) — e a barra de status anuncia `status.motion.actionsMoved` (`manifest/features/24-motion.json:14486` `"key": "status.motion.actionsMoved",`) com o deslocamento — "Movidas ações de {timeline} em {delta} s." (`src/i18n/locales/pt-BR.json:3056` `"status.motion.actionsMoved": "Movidas ações de {timeline} em {delta} s.",`). O arraste ocupa uma transação por gesto (`manifest/commands/motion.json:1819` `"transaction": "per-gesture",`). Pelas regras do editor: G1 — o movimento é gravado no contexto em que foi feito; G2 — o toque começa gravando a digitação pendente; G3 — o arraste envia só a distância ao único tratador, que decide o ponto; G7 — o canvas é o documento; a escrita mantém o esquema da linha do tempo válido e a pilha de undo/redo consistente.

## REQ-1613 — motion.resizeAction (Alterar quando uma ação começa ou termina)
- **Onde:** `manifest/commands/motion.json:1846` `"id": "motion.resizeAction",`
- **Tratador:** `src/app/commands.ts:276` `'motion.resizeAction': resizeActionCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Estica ou encolhe uma ação arrastando as pontas da barra, mudando o início ou a duração; o rótulo da interface é "Alterar quando uma ação começa ou termina" (`src/i18n/locales/pt-BR.json:2773` `"command.motion.resizeAction": "Alterar quando uma ação começa ou termina",`). No cenário `an-action-bar-is-lengthened-by-its-end`, arrastar a ponta final alonga a duração — `"duration": 1000,` (`manifest/features/24-motion.json:14593` `"duration": 1000,`) — e a barra de status anuncia `status.motion.actionResized` (`manifest/features/24-motion.json:14619` `"key": "status.motion.actionResized",`); no cenário `an-action-bar-is-shortened-by-its-start`, arrastar a ponta inicial desloca o começo — `"start": 200,` (`manifest/features/24-motion.json:14725` `"start": 200,`). Uma ação instantânea, sem duração, é recusada (`manifest/commands/motion.json:1891` `"status.motion.instant"`). O arraste ocupa uma transação por gesto (`manifest/commands/motion.json:1898` `"transaction": "per-gesture",`). Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita; G2 — o toque começa gravando a digitação pendente; G3 — as duas pontas enviam só a distância e a ponta ao único tratador; G7 — o canvas é o documento; a escrita mantém o esquema da ação válido e a pilha de undo/redo consistente.

## REQ-1614 — motion.select (Selecionar na linha do tempo)
- **Onde:** `manifest/commands/motion.json:1949` `"id": "motion.select",`
- **Tratador:** `src/app/commands.ts:277` `'motion.select': selectMotionCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Seleciona na linha do tempo as barras de ação ou os quadros-chave apontados; o rótulo da interface é "Selecionar na linha do tempo" (`src/i18n/locales/pt-BR.json:2774` `"command.motion.select": "Selecionar na linha do tempo",`). Com a tecla Shift a seleção é acrescentada à anterior — `"modifier": "Shift",` na barra de ações (`manifest/commands/motion.json:2034` `"modifier": "Shift",`) e no quadro-chave (`manifest/commands/motion.json:2088` `"modifier": "Shift",`) —, no cenário `bars-are-selected-one-and-then-another`, que acrescenta a segunda barra pela porta `manifest/features/24-motion.json:14840` `"door": "motion.select#timeline-motion-bar-add",`. A seleção é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:1997` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só a intenção e o acréscimo ao único tratador; G6 — a store é a fonte única da seleção, e canvas e Camadas apenas derivam dela; o documento fica inalterado.

## REQ-1615 — motion.setPlayhead (Mover o cabeçote)
- **Onde:** `manifest/commands/motion.json:2111` `"id": "motion.setPlayhead",`
- **Tratador:** `src/app/commands.ts:278` `'motion.setPlayhead': setMotionPlayheadCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Move o cabeçote da linha do tempo arrastando-o pela régua; o rótulo da interface é "Mover o cabeçote" (`src/i18n/locales/pt-BR.json:2778` `"command.motion.setPlayhead": "Mover o cabeçote",`). O eixo está em segundos e a leitura mostra o ponto do cabeçote e a duração (`manifest/features/24-motion.json:7954` `"The axis is in seconds with zoom;`), no cenário `the-playhead-is-dragged-along-the-ruler`, cuja porta de arraste é `manifest/features/24-motion.json:14974` `"door": "motion.setPlayhead#panel-drag-motion-playhead",`. O cabeçote é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:2134` `"undoable": false`). Pelas regras do editor: G2 — o toque começa gravando a digitação pendente; G3 — o arraste envia só a distância ao único tratador, que decide o ponto; G6 — a leitura do cabeçote sai da store; o documento fica inalterado.

## REQ-1616 — motion.zoomTimeline (Aproximar ou afastar a linha do tempo)
- **Onde:** `manifest/commands/motion.json:2160` `"id": "motion.zoomTimeline",`
- **Tratador:** `src/app/commands.ts:279` `'motion.zoomTimeline': zoomTimelineCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Aproxima ou afasta a escala da linha do tempo; o rótulo da interface é "Aproximar ou afastar a linha do tempo" (`src/i18n/locales/pt-BR.json:2784` `"command.motion.zoomTimeline": "Aproximar ou afastar a linha do tempo",`), com as portas "Aproximar" (`src/i18n/locales/pt-BR.json:2949` `"motion.timeline.zoomIn": "Aproximar",`) e "Afastar" (`src/i18n/locales/pt-BR.json:2950` `"motion.timeline.zoomOut": "Afastar",`). Cada porta envia ao tratador só o fator (`manifest/commands/motion.json:2211` `"factor": 1.25` e `manifest/commands/motion.json:2239` `"factor": 0.8`), no cenário `the-timeline-zooms-in-and-out`, cuja porta é `manifest/features/24-motion.json:15097` `"door": "motion.zoomTimeline#timeline-motion-zoom-in",`. A escala é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:2183` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só o fator ao único tratador; o documento fica inalterado.

## REQ-1617 — motion.toggleSnap (Encaixar na linha do tempo)
- **Onde:** `manifest/commands/motion.json:2245` `"id": "motion.toggleSnap",`
- **Tratador:** `src/app/commands.ts:280` `'motion.toggleSnap': toggleSnapCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Liga ou desliga o encaixe das barras e do cabeçote; o rótulo da interface é "Encaixar na linha do tempo" (`src/i18n/locales/pt-BR.json:2781` `"command.motion.toggleSnap": "Encaixar na linha do tempo",`), e a porta traz "Encaixar" (`src/i18n/locales/pt-BR.json:2945` `"motion.timeline.snap": "Encaixar",`). Com o encaixe ligado, as barras encaixam nas pontas, nos quadros-chave, nos marcadores e no cabeçote (`manifest/features/24-motion.json:7954` `"The axis is in seconds with zoom;`). No cenário `snapping-is-turned-off`, desligar anuncia `status.motion.snapOff` (`manifest/features/24-motion.json:15292` `"key": "status.motion.snapOff",`) — "Encaixe desligado." (`src/i18n/locales/pt-BR.json:3093` `"status.motion.snapOff": "Encaixe desligado.",`); ligar anuncia "Encaixe ligado." (`src/i18n/locales/pt-BR.json:3094` `"status.motion.snapOn": "Encaixe ligado.",`). O encaixe é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:2257` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; o documento fica inalterado.

## REQ-1618 — motion.addMarker (Adicionar um marcador no cabeçote)
- **Onde:** `manifest/commands/motion.json:2289` `"id": "motion.addMarker",`
- **Tratador:** `src/app/commands.ts:281` `'motion.addMarker': addMarkerCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Adiciona um marcador no ponto do cabeçote da linha do tempo aberta; o rótulo da interface é "Adicionar um marcador no cabeçote" (`src/i18n/locales/pt-BR.json:2755` `"command.motion.addMarker": "Adicionar um marcador no cabeçote",`). No cenário `a-marker-is-added-at-the-playhead`, o marcador entra com o nome "Marker 1" (`manifest/features/24-motion.json:15404` `"name": "Marker 1",`) e a barra de status anuncia `status.motion.markerAdded` (`manifest/features/24-motion.json:15425` `"key": "status.motion.markerAdded",`) — "Marcador {name} em {time} s." (`src/i18n/locales/pt-BR.json:3070` `"status.motion.markerAdded": "Marcador {name} em {time} s.",`). Pelas regras do editor: G1 — o marcador é gravado no contexto em que foi feito; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém os marcadores e a linha do tempo consistentes e a pilha de undo/redo inteira.

## REQ-1619 — motion.moveMarker (Mover um marcador)
- **Onde:** `manifest/commands/motion.json:2351` `"id": "motion.moveMarker",`
- **Tratador:** `src/app/commands.ts:282` `'motion.moveMarker': moveMarkerCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Move um marcador pela régua, arrastando-o; o rótulo da interface é "Mover um marcador" (`src/i18n/locales/pt-BR.json:2763` `"command.motion.moveMarker": "Mover um marcador",`). No cenário `a-marker-is-dragged`, arrastar o marcador para outro ponto regrava o tempo dele — `"time": 500` (`manifest/features/24-motion.json:15554` `"time": 500`) — e a barra de status anuncia `status.motion.markerMoved` (`manifest/features/24-motion.json:15574` `"key": "status.motion.markerMoved",`) — "Movido o marcador {name}." (`src/i18n/locales/pt-BR.json:3071` `"status.motion.markerMoved": "Movido o marcador {name}.",`). O arraste ocupa uma transação por gesto (`manifest/commands/motion.json:2394` `"transaction": "per-gesture",`). Pelas regras do editor: G1 — o movimento é gravado no contexto em que foi feito; G2 — o toque começa gravando a digitação pendente; G3 — o arraste envia só a distância ao único tratador; G7 — o canvas é o documento; a escrita mantém os marcadores consistentes e a pilha de undo/redo inteira.

## REQ-1620 — motion.renameMarker (Renomear o marcador)
- **Onde:** `manifest/commands/motion.json:2421` `"id": "motion.renameMarker",`
- **Tratador:** `src/app/commands.ts:283` `'motion.renameMarker': renameMarkerCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Renomeia um marcador da linha do tempo; o rótulo da interface é "Renomear o marcador" (`src/i18n/locales/pt-BR.json:2771` `"command.motion.renameMarker": "Renomear o marcador",`). No cenário `a-marker-is-renamed`, o marcador passa a ter o nome novo — `"name": "Peak",` (`manifest/features/24-motion.json:15701` `"name": "Peak",`) — e a barra de status anuncia `status.motion.markerRenamed` (`manifest/features/24-motion.json:15722` `"key": "status.motion.markerRenamed",`) — "Renomeado o marcador para {name}." (`src/i18n/locales/pt-BR.json:3073` `"status.motion.markerRenamed": "Renomeado o marcador para {name}.",`). Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta de campo envia só o texto ao único tratador; G7 — o canvas é o documento; a escrita mantém os marcadores consistentes e a pilha de undo/redo inteira.

## REQ-1621 — motion.removeMarker (Remover o marcador)
- **Onde:** `manifest/commands/motion.json:2493` `"id": "motion.removeMarker",`
- **Tratador:** `src/app/commands.ts:284` `'motion.removeMarker': removeMarkerCommand,`
- **Feature:** `src/app/features.ts:207` `'motion-timeline': registerFeature('motion-timeline'),`
- **Comportamento esperado:** Remove um marcador da linha do tempo; o rótulo da interface é "Remover o marcador" (`src/i18n/locales/pt-BR.json:2770` `"command.motion.removeMarker": "Remover o marcador",`). No cenário `a-marker-is-removed`, o marcador sai da linha do tempo e a barra de status anuncia `status.motion.markerRemoved` (`manifest/features/24-motion.json:15864` `"key": "status.motion.markerRemoved",`) — "Removido o marcador {name}." (`src/i18n/locales/pt-BR.json:3072` `"status.motion.markerRemoved": "Removido o marcador {name}.",`). Pelas regras do editor: G1 — a remoção é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém os marcadores consistentes e a pilha de undo/redo inteira.

## REQ-1622 — motion.setKeyframe (Adicionar um quadro-chave no cabeçote)
- **Onde:** `manifest/commands/motion.json:2559` `"id": "motion.setKeyframe",`
- **Tratador:** `src/app/commands.ts:285` `'motion.setKeyframe': setKeyframeCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Adiciona um quadro-chave no ponto do cabeçote, ligando uma propriedade à ação; o rótulo da interface é "Adicionar um quadro-chave no cabeçote" (`src/i18n/locales/pt-BR.json:2777` `"command.motion.setKeyframe": "Adicionar um quadro-chave no cabeçote",`) e a porta que anima a propriedade traz "Animar propriedade" (`src/i18n/locales/pt-BR.json:2933` `"motion.timeline.addProperty": "Animar propriedade",`). Cada propriedade é a própria trilha (`manifest/features/24-motion.json:15958` `"Each property is its own track; an inspector change while recording becomes a keyframe at the playhead."`). No cenário `a-keyframe-is-added-at-the-playhead`, um segundo quadro-chave entra no tempo do cabeçote — `"time": 3000,` (`manifest/features/24-motion.json:16412` `"time": 3000,`) — e a barra de status anuncia `status.motion.keyframeSet` (`manifest/features/24-motion.json:16100` `"key": "status.motion.keyframeSet",`) — "Quadro-chave de {property} em {time} s." (`src/i18n/locales/pt-BR.json:3066` `"status.motion.keyframeSet": "Quadro-chave de {property} em {time} s.",`). Com o cabeçote antes do início da ação, a porta é recusada (`manifest/commands/motion.json:2598` `"status.motion.recordBeforeAction"`) — "O cabeçote em {time} s está antes do início da ação." (`src/i18n/locales/pt-BR.json:3087` `"status.motion.recordBeforeAction": "O cabeçote em {time} s está antes do início da ação.",`). Pelas regras do editor: G1 — o quadro-chave é gravado no contexto em que foi feito; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só a intenção, a propriedade e o valor ao único tratador; G7 — o canvas é o documento; a escrita mantém as trilhas e os quadros-chave consistentes e a pilha de undo/redo inteira.

## REQ-1623 — motion.editKeyframe (Alterar o quadro-chave)
- **Onde:** `manifest/commands/motion.json:2664` `"id": "motion.editKeyframe",`
- **Tratador:** `src/app/commands.ts:286` `'motion.editKeyframe': editKeyframeCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Altera o quadro-chave selecionado, campo a campo: o valor, a suavização, o tempo e a propriedade; o rótulo da interface é "Alterar o quadro-chave" (`src/i18n/locales/pt-BR.json:2760` `"command.motion.editKeyframe": "Alterar o quadro-chave",`). Exemplos dos cenários: mudar o valor grava `"value": "0.5"` (`manifest/features/24-motion.json:16550` `"value": "0.5"`); digitar o tempo grava `"time": 400,` (`manifest/features/24-motion.json:16994` `"time": 400,`); e trocar a propriedade regrava a trilha como `"property": "scale-x",` (`manifest/features/24-motion.json:17175` `"property": "scale-x",`). Cada alteração anuncia `status.motion.keyframeEdited` (`manifest/features/24-motion.json:16625` `"key": "status.motion.keyframeEdited",`) — "Alterado um quadro-chave de {timeline}." (`src/i18n/locales/pt-BR.json:3065` `"status.motion.keyframeEdited": "Alterado um quadro-chave de {timeline}.",`). Pelas regras do editor: G1 — a alteração é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas de campo enviam só o texto ao único tratador; G7 — o canvas é o documento; a escrita mantém as trilhas e os quadros-chave consistentes e a pilha de undo/redo inteira.

## REQ-1624 — motion.moveKeyframes (Mover quadros-chave na linha do tempo)
- **Onde:** `manifest/commands/motion.json:2842` `"id": "motion.moveKeyframes",`
- **Tratador:** `src/app/commands.ts:287` `'motion.moveKeyframes': moveKeyframesCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Move pela régua os quadros-chave selecionados, arrastando-os; o rótulo da interface é "Mover quadros-chave na linha do tempo" (`src/i18n/locales/pt-BR.json:2762` `"command.motion.moveKeyframes": "Mover quadros-chave na linha do tempo",`). No cenário `a-keyframe-is-dragged`, arrastar o quadro-chave regrava o tempo dele e a barra de status anuncia `status.motion.keyframesMoved` (`manifest/features/24-motion.json:17404` `"key": "status.motion.keyframesMoved",`) — "Movidos quadros-chave de {timeline}." (`src/i18n/locales/pt-BR.json:3068` `"status.motion.keyframesMoved": "Movidos quadros-chave de {timeline}.",`). O arraste ocupa uma transação por gesto (`manifest/commands/motion.json:2895` `"transaction": "per-gesture",`). Pelas regras do editor: G1 — o movimento é gravado no contexto em que foi feito; G2 — o toque começa gravando a digitação pendente; G3 — o arraste envia só a distância ao único tratador; G7 — o canvas é o documento; a escrita mantém as trilhas e os quadros-chave consistentes e a pilha de undo/redo inteira.

## REQ-1625 — motion.deleteKeyframes (Excluir os quadros-chave selecionados)
- **Onde:** `manifest/commands/motion.json:2922` `"id": "motion.deleteKeyframes",`
- **Tratador:** `src/app/commands.ts:288` `'motion.deleteKeyframes': deleteKeyframesCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Exclui os quadros-chave selecionados; o rótulo da interface é "Excluir os quadros-chave selecionados" (`src/i18n/locales/pt-BR.json:2758` `"command.motion.deleteKeyframes": "Excluir os quadros-chave selecionados",`). No cenário `a-keyframe-is-deleted`, os quadros-chave saem e a barra de status anuncia `status.motion.keyframesDeleted` (`manifest/features/24-motion.json:17611` `"key": "status.motion.keyframesDeleted",`) — "Excluídos quadros-chave de {timeline}." (`src/i18n/locales/pt-BR.json:3067` `"status.motion.keyframesDeleted": "Excluídos quadros-chave de {timeline}.",`). Excluir o último quadro-chave de uma propriedade esvazia a trilha — `"tracks": []` (`manifest/features/24-motion.json:17761` `"tracks": []`) — no cenário `deleting-the-last-keyframe-of-a-property-stops-animating-it`, deixando de animar aquela propriedade. Pelas regras do editor: G1 — a exclusão é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém as trilhas e os quadros-chave consistentes e a pilha de undo/redo inteira.

## REQ-1626 — motion.copyKeyframes (Copiar os quadros-chave selecionados)
- **Onde:** `manifest/commands/motion.json:2998` `"id": "motion.copyKeyframes",`
- **Tratador:** `src/app/commands.ts:289` `'motion.copyKeyframes': copyMotionKeyframesCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Copia os quadros-chave selecionados na linha do tempo; o rótulo da interface é "Copiar os quadros-chave selecionados" (`src/i18n/locales/pt-BR.json:2756` `"command.motion.copyKeyframes": "Copiar os quadros-chave selecionados",`). Na cópia, cada quadro-chave guarda a propriedade, o deslocamento e o valor, como no cenário `keyframes-are-copied-and-pasted-at-the-playhead`, cuja porta é `manifest/features/24-motion.json:17983` `"door": "motion.copyKeyframes#timeline-motion-keyframes-copy",`; a barra de status anuncia "Copiados {count} quadros-chave." (`src/i18n/locales/pt-BR.json:3061` `"status.motion.copied": "Copiados {count} quadros-chave.",`). Sem quadros-chave selecionados, a porta é recusada (`manifest/commands/motion.json:3008` `"status.motion.nothingSelected"`) — "Selecione quadros-chave na linha do tempo primeiro." (`src/i18n/locales/pt-BR.json:3084` `"status.motion.nothingSelected": "Selecione quadros-chave na linha do tempo primeiro.",`). A cópia é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:3012` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; o documento fica inalterado.

## REQ-1627 — motion.pasteKeyframes (Colar quadros-chave no cabeçote)
- **Onde:** `manifest/commands/motion.json:3044` `"id": "motion.pasteKeyframes",`
- **Tratador:** `src/app/commands.ts:290` `'motion.pasteKeyframes': pasteKeyframesCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Cola na linha do tempo os quadros-chave copiados, deslocando-os para o ponto do cabeçote; o rótulo da interface é "Colar quadros-chave no cabeçote" (`src/i18n/locales/pt-BR.json:2765` `"command.motion.pasteKeyframes": "Colar quadros-chave no cabeçote",`). No cenário `keyframes-are-copied-and-pasted-at-the-playhead`, os quadros-chave colados esticam a duração da ação — `"duration": 6000,` (`manifest/features/24-motion.json:18046` `"duration": 6000,`) — e a barra de status anuncia `status.motion.keyframesPasted` (`manifest/features/24-motion.json:18090` `"key": "status.motion.keyframesPasted",`) — "Colados quadros-chave em {timeline}." (`src/i18n/locales/pt-BR.json:3069` `"status.motion.keyframesPasted": "Colados quadros-chave em {timeline}.",`). Sem nada copiado, a porta é recusada (`manifest/commands/motion.json:3076` `"status.motion.nothingCopied",`) — "Copie quadros-chave primeiro." (`src/i18n/locales/pt-BR.json:3083` `"status.motion.nothingCopied": "Copie quadros-chave primeiro.",`) —, e com o cabeçote antes do início da ação a porta é recusada (`manifest/commands/motion.json:3077` `"status.motion.recordBeforeAction"`). Pelas regras do editor: G1 — a colagem é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém as trilhas e os quadros-chave consistentes e a pilha de undo/redo inteira.

## REQ-1628 — motion.toggleRecord (Gravar alterações como quadros-chave)
- **Onde:** `manifest/commands/motion.json:3117` `"id": "motion.toggleRecord",`
- **Tratador:** `src/app/commands.ts:291` `'motion.toggleRecord': toggleRecordCommand,`
- **Feature:** `src/app/features.ts:208` `'motion-keyframes': registerFeature('motion-keyframes'),`
- **Comportamento esperado:** Liga ou desliga a gravação; com ela ligada, uma alteração feita no inspector vira quadro-chave no ponto do cabeçote (`manifest/features/24-motion.json:15958` `"Each property is its own track; an inspector change while recording becomes a keyframe at the playhead."`), e cada propriedade fica na própria trilha; o rótulo da interface é "Gravar alterações como quadros-chave" (`src/i18n/locales/pt-BR.json:2779` `"command.motion.toggleRecord": "Gravar alterações como quadros-chave",`) e a porta traz "Gravar" (`src/i18n/locales/pt-BR.json:2943` `"motion.timeline.record": "Gravar",`). No cenário `recording-turns-an-inspector-change-into-a-keyframe`, ligar a gravação pela porta `manifest/features/24-motion.json:18165` `"door": "motion.toggleRecord#timeline-motion-record",` e depois mudar a opacidade no inspector grava o quadro-chave com o valor novo — `"value": "0.25"` (`manifest/features/24-motion.json:18234` `"value": "0.25"`) — e a barra de status anuncia `status.motion.recorded` (`manifest/features/24-motion.json:18261` `"key": "status.motion.recorded",`) — "Gravado {property} em {time} s em {timeline}." (`src/i18n/locales/pt-BR.json:3090` `"status.motion.recorded": "Gravado {property} em {time} s em {timeline}.",`). Ligada, informa "Gravando: alterações no inspector viram quadros-chave." (`src/i18n/locales/pt-BR.json:3089` `"status.motion.recordOn": "Gravando: alterações no inspector viram quadros-chave.",`); desligada, "Gravação desligada." (`src/i18n/locales/pt-BR.json:3088` `"status.motion.recordOff": "Gravação desligada.",`). Sem linha do tempo, a porta é recusada (`manifest/commands/motion.json:3127` `"status.motion.noTimeline"`) — "Crie ou abra uma linha do tempo primeiro." (`src/i18n/locales/pt-BR.json:3078` `"status.motion.noTimeline": "Crie ou abra uma linha do tempo primeiro.",`). O modo de gravação é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:3131` `"undoable": false`). Pelas regras do editor: G2 — a alteração registrada pela gravação chega de fora do campo, e a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G7 — o canvas é o documento; a escrita mantém as trilhas e os quadros-chave consistentes e a pilha de undo/redo inteira.

## REQ-1629 — motion.preview (Pré-visualizar a linha do tempo no canvas)
- **Onde:** `manifest/commands/motion.json:3163` `"id": "motion.preview",`
- **Tratador:** `src/app/commands.ts:292` `'motion.preview': previewMotionCommand,`
- **Feature:** `src/app/features.ts:209` `'motion-preview': registerFeature('motion-preview'),`
- **Comportamento esperado:** Reproduz, pausa ou para a linha do tempo aberta no canvas; o rótulo da interface é "Pré-visualizar a linha do tempo no canvas" (`src/i18n/locales/pt-BR.json:2766` `"command.motion.preview": "Pré-visualizar a linha do tempo no canvas",`), e o canvas desenha a linha do tempo no ponto do cabeçote (`manifest/features/24-motion.json:18298` `"The canvas draws the timeline at the playhead; in run mode the canvas runs the interactions as the page does."`). As portas enviam a operação ao tratador; no cenário `the-timeline-preview-plays`, a reprodução anuncia `status.motion.previewPlaying` (`manifest/features/24-motion.json:18415` `"key": "status.motion.previewPlaying",`) — "Pré-visualizando {name} no canvas." (`src/i18n/locales/pt-BR.json:3085` `"status.motion.previewPlaying": "Pré-visualizando {name} no canvas.",`) —, e no cenário `the-timeline-preview-stops`, a parada anuncia `status.motion.previewStopped` (`manifest/features/24-motion.json:18690` `"key": "status.motion.previewStopped",`) — "Pré-visualização parada: os elementos mostram seus próprios estilos." (`src/i18n/locales/pt-BR.json:3086` `"status.motion.previewStopped": "Pré-visualização parada: os elementos mostram seus próprios estilos.",`). Sem linha do tempo, a porta é recusada (`manifest/commands/motion.json:3183` `"status.motion.noTimeline"`) — "Crie ou abra uma linha do tempo primeiro." (`src/i18n/locales/pt-BR.json:3078` `"status.motion.noTimeline": "Crie ou abra uma linha do tempo primeiro.",`). A pré-visualização é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:3187` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só a operação ao único tratador; G7 — o canvas é o documento, e o que ele desenha na pré-visualização coincide com o render do zero; o documento fica inalterado.

## REQ-1630 — motion.toggleRun (Executar interações)
- **Onde:** `manifest/commands/motion.json:3277` `"id": "motion.toggleRun",`
- **Tratador:** `src/app/commands.ts:293` `'motion.toggleRun': toggleRunCommand,`
- **Feature:** `src/app/features.ts:209` `'motion-preview': registerFeature('motion-preview'),`
- **Comportamento esperado:** Liga ou desliga a execução das interações no canvas; o rótulo da interface é "Executar interações" (`src/i18n/locales/pt-BR.json:2780` `"command.motion.toggleRun": "Executar interações",`), e a porta é o item de menu "Executar interações" (`src/i18n/locales/pt-BR.json:2910` `"motion.run": "Executar interações",`), um item marcável do menu Ver (`manifest/commands/motion.json:3293` `"id": "menu-view-run-interactions",`, `manifest/commands/motion.json:3296` `"menu": "view",`). Ligado, o canvas executa as interações como a página (`manifest/features/24-motion.json:18298` `"The canvas draws the timeline at the playhead; in run mode the canvas runs the interactions as the page does."`); no cenário `the-canvas-runs-the-interactions`, ligar anuncia `status.motion.running` (`manifest/features/24-motion.json:18804` `"key": "status.motion.running",`) — "O canvas executa as interações. Desligue Executar interações para voltar a editar com o ponteiro." (`src/i18n/locales/pt-BR.json:3092` `"status.motion.running": "O canvas executa as interações. Desligue Executar interações para voltar a editar com o ponteiro.",`); desligar anuncia "O canvas não executa mais as interações." (`src/i18n/locales/pt-BR.json:3095` `"status.motion.stopped": "O canvas não executa mais as interações.",`). A execução é estado do editor e não entra na pilha de desfazer (`manifest/commands/motion.json:3289` `"undoable": false`). Pelas regras do editor: G2 — por chegar de fora do campo, a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só a intenção ao único tratador; G6 — todas as vistas leem o estado da store; o documento fica inalterado.

## REQ-1631 — motion.setBehaviour (Definir um comportamento)
- **Onde:** `manifest/commands/motion.json:3317` `"id": "motion.setBehaviour",`
- **Tratador:** `src/app/commands.ts:294` `'motion.setBehaviour': setBehaviourCommand,`
- **Feature:** `src/app/features.ts:210` `'motion-behaviours': registerFeature('motion-behaviours'),`
- **Recusa declarada:** `manifest/commands/motion.json:3350` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** Dá a um elemento um comportamento entre fixo, encaixe de rolagem, rolagem suave, paralaxe, letreiro em loop e seguir o cursor; o rótulo da interface é "Definir um comportamento" (`src/i18n/locales/pt-BR.json:2775` `"command.motion.setBehaviour": "Definir um comportamento",`), com os nomes "Fixo ao rolar" (`src/i18n/locales/pt-BR.json:2828` `"motion.behaviour.sticky": "Fixo ao rolar",`), "Encaixe de rolagem" (`src/i18n/locales/pt-BR.json:2826` `"motion.behaviour.scrollSnap": "Encaixe de rolagem",`) e "Seguir o cursor" (`src/i18n/locales/pt-BR.json:2823` `"motion.behaviour.cursorFollow": "Seguir o cursor",`). O fixo e o encaixe de rolagem são CSS comum escrito pelo dono de estilos, e os demais rodam pelo script de movimento respeitando o movimento reduzido (`manifest/features/24-motion.json:18837` `"Sticky and scroll snap are plain CSS written through the style owner; the others run from the motion script and respect reduced motion."`): o fixo grava `"value": "sticky"` (`manifest/features/24-motion.json:18885` `"value": "sticky"`); a rolagem suave grava o comportamento `"kind": "smooth-scroll",` (`manifest/features/24-motion.json:19077` `"kind": "smooth-scroll",`); a paralaxe, `"kind": "parallax",` (`manifest/features/24-motion.json:19160` `"kind": "parallax",`); o letreiro, `"kind": "marquee",` (`manifest/features/24-motion.json:19244` `"kind": "marquee",`); e seguir o cursor, `"kind": "cursor-follow",` (`manifest/features/24-motion.json:19328` `"kind": "cursor-follow",`). O eixo é trocado pelas portas "Horizontal" (`src/i18n/locales/pt-BR.json:2817` `"motion.axis.x": "Horizontal",`) e "Vertical" (`src/i18n/locales/pt-BR.json:2818` `"motion.axis.y": "Vertical",`) — porta `manifest/features/24-motion.json:19498` `"door": "motion.setBehaviour#inspector-motion-behaviour-axis-y",` — e cada aplicação anuncia `status.motion.behaviourSet` (`manifest/features/24-motion.json:18906` `"key": "status.motion.behaviourSet",`). Sem seleção única, o predicado recusa a porta com `status.needsSingleSelection` — "Isto exige uma seleção única." (`src/i18n/locales/pt-BR.json:1857` `"status.needsSingleSelection": "Isto exige uma seleção única.",`). Pelas regras do editor: G1 — o comportamento é gravado no contexto em que foi feito; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só o comportamento, a intensidade e o eixo ao único tratador; G7 — o canvas é o documento, e o render incremental coincide com o render do zero; a escrita mantém o esquema do elemento e o estado de estilo válidos e a pilha de undo/redo consistente.

## REQ-1632 — motion.removeBehaviour (Remover o comportamento)
- **Onde:** `manifest/commands/motion.json:3627` `"id": "motion.removeBehaviour",`
- **Tratador:** `src/app/commands.ts:295` `'motion.removeBehaviour': removeBehaviourCommand,`
- **Feature:** `src/app/features.ts:210` `'motion-behaviours': registerFeature('motion-behaviours'),`
- **Comportamento esperado:** Remove de um elemento um comportamento entre rolagem suave, paralaxe, letreiro em loop e seguir o cursor; o rótulo da interface é "Remover o comportamento" (`src/i18n/locales/pt-BR.json:2769` `"command.motion.removeBehaviour": "Remover o comportamento",`). No cenário `a-behaviour-is-removed`, a paralaxe sai do elemento e a barra de status anuncia `status.motion.behaviourRemoved` (`manifest/features/24-motion.json:19731` `"key": "status.motion.behaviourRemoved",`). Pelas regras do editor: G1 — a remoção é gravada no contexto em que foi feita; G2 — a digitação pendente é gravada antes, no contexto da digitação; G3 — a porta envia só o comportamento ao único tratador; G7 — o canvas é o documento, e o render incremental coincide com o render do zero; a escrita mantém o esquema do elemento válido e a pilha de undo/redo consistente.

## REQ-1801 — layers.startRename (Renomear)
- **Onde:** `manifest/commands/nodes.json:5` `"id": "layers.startRename",`
- **Tratador:** `src/app/commands.ts:334` `'layers.startRename': startRename,`
- **Feature:** `src/app/features.ts:41` `'rename-element': registerFeature('rename-element'),`
- **Recusa declarada:** `manifest/commands/nodes.json:12` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** Abre a edição do nome do elemento selecionado dentro da própria linha dele em Camadas, com o nome atual selecionado, sem abrir diálogo: `manifest/features/02-structure-editing.json:14067` `"F2 edits the selection's name in place in its Layers row, the same inline edit as double-clicking the row name, with the current name selected; no dialog opens."`. O rótulo da interface é "Renomear" (`src/i18n/locales/pt-BR.json:431` `"command.rename": "Renomear",`). As seis portas do comando — F2 no canvas, F2 na árvore de Camadas, o duplo clique no nome da linha de Camadas, o menu de contexto, o item do menu do aplicativo e a barra de comandos — enviam só a intenção ao único tratador, sem argumentos (G3). A porta só é oferecida com exatamente um elemento selecionado (`manifest/commands/nodes.json:11` `"predicate": "singleSelection",`); sem isso a recusa é `status.needsSingleSelection` — "Isto exige uma seleção única." (`src/i18n/locales/pt-BR.json:1857` `"status.needsSingleSelection": "Isto exige uma seleção única.",`). O painel Camadas aparece primeiro quando estava oculto e os ramos que escondiam a linha se abrem, para a linha a editar ficar à vista. O comando recusa renomear a raiz da página — `status.rename.root`, "A raiz da página não pode ser renomeada." (`src/i18n/locales/pt-BR.json:1918` `"status.rename.root": "A raiz da página não pode ser renomeada.",`) — e recusa renomear um elemento bloqueado, ou um elemento dentro de um bloqueado, nomeando o bloqueio (`manifest/commands/nodes.json:218` `"status.locked.rename",`, `manifest/commands/nodes.json:219` `"status.locked.byAncestor"`). A seleção lida é a da store, fonte única (G6).

## REQ-1802 — layers.cancelRename (Cancelar a renomeação)
- **Onde:** `manifest/commands/nodes.json:157` `"id": "layers.cancelRename",`
- **Tratador:** `src/app/commands.ts:335` `'layers.cancelRename': cancelRename,`
- **Feature:** `src/app/features.ts:41` `'rename-element': registerFeature('rename-element'),`
- **Comportamento esperado:** O Escape dentro do campo do nome na linha de Camadas (contexto de tecla do campo de renomeação) encerra a edição em linha mantendo o nome que o elemento já tinha: `manifest/features/02-structure-editing.json:14068` `"Enter commits the new name into the document JSON; Escape cancels."`. O rótulo é "Cancelar a renomeação" (`src/i18n/locales/pt-BR.json:2189` `"command.layers.cancelRename": "Cancelar a renomeação",`). Nada é gravado no documento e nenhuma entrada de desfazer é criada: o cenário `escape-cancels-the-rename` espera o documento inalterado e zero passos de desfazer (`manifest/features/02-structure-editing.json:14323` `"door": "layers.startRename#key-f2-in-canvas",` antes do cancelamento). A porta é única e sua disponibilidade é sempre (`manifest/commands/nodes.json:163` `"predicate": "always",`); o comando não declara recusa. Como encerrar a edição sem gravar tira o campo do caminho da digitação, o registro único da digitação pendente fecha o rascunho no contexto da digitação (G2).

## REQ-1803 — element.rename (Salvar o nome)
- **Onde:** `manifest/commands/nodes.json:195` `"id": "element.rename",`
- **Tratador:** `src/app/commands.ts:336` `'element.rename': renameCommand,`
- **Feature:** `src/app/features.ts:41` `'rename-element': registerFeature('rename-element'),`
- **Comportamento esperado:** Grava como nome do elemento o texto que o campo do nome da linha entrega, sem os espaços em volta, numa única transação: `manifest/features/02-structure-editing.json:14068` `"Enter commits the new name into the document JSON; Escape cancels."`. O rótulo é "Salvar o nome" (`src/i18n/locales/pt-BR.json:432` `"command.renameCommit": "Salvar o nome",`) e o campo anuncia-se "Nome do elemento" (`src/i18n/locales/pt-BR.json:1224` `"layers.renameField": "Nome do elemento",`). Um nome vazio mantém o nome anterior e a barra de status diz `status.rename.empty` — "Um nome não pode ficar vazio; {name} mantém o nome." (`src/i18n/locales/pt-BR.json:1917` `"status.rename.empty": "Um nome não pode ficar vazio; {name} mantém o nome.",`) —, conforme "An empty name keeps the previous name." (`manifest/features/02-structure-editing.json:14069` `"An empty name keeps the previous name.",`); gravar o mesmo nome não registra entrada (`manifest/commands/nodes.json:227` `"noChange": "no-entry"`). Ao gravar um nome novo, a barra de status diz `status.renamed` — "Novo nome de {old}: {name}." (`src/i18n/locales/pt-BR.json:1919` `"status.renamed": "Novo nome de {old}: {name}.",`). O comando recusa a raiz da página — `status.rename.root` (`manifest/commands/nodes.json:217` `"status.rename.root",`) — e recusa um elemento bloqueado ou dentro de um bloqueado (`status.locked.rename`, `status.locked.byAncestor`). A porta é única — o campo do nome da linha de Camadas — e sua disponibilidade é sempre (`manifest/commands/nodes.json:212` `"predicate": "always",`); o manifesto marca o comando como desfazível, com uma entrada de desfazer que devolve a seleção de antes do comando (`manifest/commands/nodes.json:223` `"undoable": true,`), coerente com "cada renomeação é um passo de desfazer" (`manifest/features/02-structure-editing.json:14070` `"The new name appears in Layers and on the canvas label; each rename is one undo step."`). Pela G1 a gravação usa o contexto em que foi feita; pela G7 o canvas mostra o novo nome.

## REQ-1804 — element.toggleLock (Bloquear)
- **Onde:** `manifest/commands/nodes.json:259` `"id": "element.toggleLock",`
- **Tratador:** `src/app/commands.ts:338` `'element.toggleLock': toggleLockCommand,`
- **Feature:** `src/app/features.ts:47` `'lock-element': registerFeature('lock-element'),`
- **Recusa declarada:** `manifest/commands/nodes.json:272` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Alterna o bloqueio do elemento sobre o qual a porta age: guarda a marca no JSON do documento e mostra o cadeado na linha (`manifest/features/02-structure-editing.json:17033` `"The lock flag is stored in the document JSON and a lock icon shows on the row.",`); o rótulo é "Bloquear" (`src/i18n/locales/pt-BR.json:392` `"command.lock": "Bloquear",`). A barra de status diz `status.locked` — "Bloqueado: {name}" (`src/i18n/locales/pt-BR.json:1842` `"status.locked": "Bloqueado: {name}",`) ao bloquear e `status.unlocked` — "Desbloqueado: {name}" (`src/i18n/locales/pt-BR.json:2001` `"status.unlocked": "Desbloqueado: {name}",`) ao desbloquear. O elemento bloqueado continua selecionável (`manifest/features/02-structure-editing.json:17035` `"Locked elements can still be selected.",`) e desbloquear devolve todas as ações; bloquear e desbloquear são passos de desfazer (`manifest/features/02-structure-editing.json:17036` `"Unlocking restores all actions; lock and unlock are undo steps."`). As quatro portas — o cadeado da linha de Camadas, o menu de contexto, o menu de ações do elemento e a barra de comandos — enviam só a intenção ao único tratador (G3); a linha age sobre o elemento que ela representa e as outras portas agem sobre o elemento primário da seleção. A porta só é oferecida com um elemento nomeado pela porta ou uma seleção (`manifest/commands/nodes.json:271` `"predicate": "targetOrSelection",`); sem isso a recusa é `refusal.nothingSelected` — "Selecione um elemento primeiro." (`src/i18n/locales/pt-BR.json:1604` `"refusal.nothingSelected": "Selecione um elemento primeiro.",`). O comando recusa a raiz da página — `status.lock.root`, "A raiz da página não pode ser bloqueada." (`src/i18n/locales/pt-BR.json:1841` `"status.lock.root": "A raiz da página não pode ser bloqueada.",`) — e recusa um elemento dentro de um bloqueado, nomeando o bloqueio (`manifest/commands/nodes.json:275` `"status.locked.byAncestor",`). As mudanças estruturais no elemento bloqueado ou em seus descendentes são recusadas nomeando o bloqueio: `status.locked.delete` — "Desbloqueie {name} antes de excluí-lo." (`src/i18n/locales/pt-BR.json:1844` `"status.locked.delete": "Desbloqueie {name} antes de excluí-lo.",`) —, `status.locked.rename` (`src/i18n/locales/pt-BR.json:1849` `"status.locked.rename": "Desbloqueie {name} antes de renomeá-lo.",`) e `status.locked.editText` (`src/i18n/locales/pt-BR.json:1846` `"status.locked.editText": "Desbloqueie {name} antes de editar o texto.",`). Pela G1 o bloqueio é gravado no contexto em que foi feito; pela G6 canvas e Camadas leem a mesma seleção; pela G7 o canvas desenha o documento.

## REQ-1805 — element.toggleHidden (Ocultar)
- **Onde:** `manifest/commands/nodes.json:379` `"id": "element.toggleHidden",`
- **Tratador:** `src/app/commands.ts:339` `'element.toggleHidden': toggleHiddenCommand,`
- **Feature:** `src/app/features.ts:48` `'hide-element': registerFeature('hide-element'),`
- **Recusa declarada:** `manifest/commands/nodes.json:392` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Alterna o ocultamento do elemento: guarda a marca no JSON do documento, o elemento passa a ter `display:none` calculado no iframe e a linha dele fica esmaecida com o olho cortado (`manifest/features/02-structure-editing.json:17444` `"The hidden flag is stored in the document JSON; the element has computed display:none in the iframe and its row is dimmed with a crossed eye.",`). O rótulo é "Ocultar" (`src/i18n/locales/pt-BR.json:374` `"command.hide": "Ocultar",`); a barra de status diz `status.hidden` — "Oculto: {name}" (`src/i18n/locales/pt-BR.json:1782` `"status.hidden": "Oculto: {name}",`) ao ocultar e `status.visible` — "Visível: {name}" (`src/i18n/locales/pt-BR.json:2016` `"status.visible": "Visível: {name}",`) ao mostrar. O elemento oculto continua selecionável em Camadas (`manifest/features/02-structure-editing.json:17445` `"Hidden elements can still be selected from Layers.",`) e mostrar devolve exatamente o leiaute que ele tinha; as duas ações são passos de desfazer (`manifest/features/02-structure-editing.json:17446` `"Showing it restores its layout exactly; both actions are undo steps."`). As quatro portas — o olho da linha de Camadas, o menu de contexto, o menu de ações do elemento e a barra de comandos — enviam só a intenção ao único tratador (G3); a linha age sobre o elemento que ela representa e as outras portas agem sobre o elemento primário da seleção. A porta só é oferecida com um elemento nomeado pela porta ou uma seleção (`manifest/commands/nodes.json:391` `"predicate": "targetOrSelection",`); sem isso a recusa é `refusal.nothingSelected` — "Selecione um elemento primeiro." (`src/i18n/locales/pt-BR.json:1604` `"refusal.nothingSelected": "Selecione um elemento primeiro.",`). O comando recusa a raiz da página — `status.hide.root`, "A raiz da página não pode ser ocultada." (`src/i18n/locales/pt-BR.json:1783` `"status.hide.root": "A raiz da página não pode ser ocultada.",`) — e recusa um elemento dentro de um bloqueado, nomeando o bloqueio (`manifest/commands/nodes.json:395` `"status.locked.byAncestor",`). Pela G6 a seleção vem da store; pela G7 o canvas desenha o documento com o elemento oculto.

## REQ-1806 — element.setLayerColor (Definir a cor da camada)
- **Onde:** `manifest/commands/nodes.json:499` `"id": "element.setLayerColor",`
- **Tratador:** `src/app/commands.ts:340` `'element.setLayerColor': setLayerColorCommand,`
- **Feature:** `src/app/features.ts:139` `'layers-row-colours': registerFeature('layers-row-colours'),`
- **Comportamento esperado:** Define a cor de rótulo de um elemento; a cor escolhida tinge a linha em Camadas e é guardada no documento, e o contorno de seleção daquele elemento no canvas usa essa cor (`manifest/features/09-panels.json:1281` `"The canvas selection outline of that element uses its label colour.",`). O rótulo é "Definir a cor da camada" (`src/i18n/locales/pt-BR.json:464` `"command.setLayerColor": "Definir a cor da camada",`). O ponto de cor da linha abre a paleta; a cor escolhida fica guardada nas configurações de página do JSON do documento (`manifest/features/09-panels.json:1280` `"The colour dot opens a small palette; the chosen colour tints the row and is stored in the page settings of the document JSON.",`) e volta depois de recarregar, nunca entrando na exportação (`manifest/features/09-panels.json:1282` `"The colour is restored after reload and never exported."`). Uma cor vazia tira a cor da linha e a barra de status diz `status.layerColor.removed` — "{name} não tem cor de rótulo." (`src/i18n/locales/pt-BR.json:1823` `"status.layerColor.removed": "{name} não tem cor de rótulo.",`). A porta é única — o ponto de cor da linha de Camadas — e sua disponibilidade é sempre (`manifest/commands/nodes.json:516` `"predicate": "always",`); o manifesto marca o comando como desfazível (`manifest/commands/nodes.json:522` `"undoable": true,`). Pela G1 a cor é gravada no contexto em que foi feita; pela G6 canvas e Camadas leem a mesma seleção.

## REQ-1807 — element.renameMany (Renomear)
- **Onde:** `manifest/commands/nodes.json:558` `"id": "element.renameMany",`
- **Tratador:** `src/app/commands.ts:337` `'element.renameMany': renameManyCommand,`
- **Feature:** `src/app/features.ts:240` `'batch-rename': registerFeature('batch-rename'),`
- **Recusa declarada:** `manifest/commands/nodes.json:576` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Renomeia de uma vez os elementos selecionados: cada um recebe o padrão com o seu número, na ordem da seleção, e tudo entra como um passo de desfazer (`manifest/features/21-layout-and-structure.json:2669` `"Each takes the pattern with its number, in the order selected; one undo step."`). A barra de status diz `status.rename.many` — "{count} elementos renomeados." (`src/i18n/locales/pt-BR.json:3447` `"status.rename.many": "{count} elementos renomeados.",`). O comando é recusado quando o padrão fica vazio ou o primeiro número é menor que 1, com `status.rename.patternInvalid` — "Digite os nomes a dar, e um primeiro número de 1 ou mais." (`src/i18n/locales/pt-BR.json:3448` `"status.rename.patternInvalid": "Digite os nomes a dar, e um primeiro número de 1 ou mais.",`) —, sem mudança no documento (`manifest/commands/nodes.json:579` `"status.rename.patternInvalid",`). O rótulo é "Renomear" (`src/i18n/locales/pt-BR.json:3440` `"command.renameMany": "Renomear",`). A porta é única — o botão Aplicar do diálogo de renomeação em lote — e sua disponibilidade é uma seleção qualquer (`manifest/commands/nodes.json:575` `"predicate": "hasSelection",`); sem seleção a recusa é `refusal.nothingSelected` — "Selecione um elemento primeiro." (`src/i18n/locales/pt-BR.json:1604` `"refusal.nothingSelected": "Selecione um elemento primeiro.",`). A raiz da página e o elemento bloqueado são recusas declaradas do comando (`manifest/commands/nodes.json:580` `"status.rename.root",`, `manifest/commands/nodes.json:581` `"status.locked.rename"`). Cada nome passa pelo mesmo renomeador, então um elemento bloqueado ou a raiz da página recusa o lote inteiro e nada é renomeado. Pela G1 cada nome é gravado no contexto em que foi feito; pela G3 a porta envia só a intenção; pela G7 o canvas desenha os novos nomes.

## REQ-1901 — page.openProperties (Propriedades da página)
- **Onde:** `manifest/commands/page.json:5` `"id": "page.openProperties",`
- **Tratador:** `src/app/commands.ts:341` `'page.openProperties': openPageProperties,`
- **Feature:** `src/app/features.ts:98` `'page-properties': registerFeature('page-properties'),`
- **Comportamento esperado:** Abre as propriedades da página. O rótulo da interface é "Propriedades da página" (`src/i18n/locales/pt-BR.json:411` `"command.pageProperties": "Propriedades da página",`), e a feature leva o nome "Propriedades da página: título, idioma, direção e estilos da página" (`src/i18n/locales/pt-BR.json:766` `"feature.pageProperties": "Propriedades da página: título, idioma, direção e estilos da página",`). A pessoa chega ao comando pelo botão do cabeçalho do inspector (`manifest/commands/page.json:21` `"id": "inspector-page-properties-button",`) e pela barra de comandos (`manifest/commands/page.json:47` `"id": "command-bar",`); a feature descreve o gesto: "Click Page in the top bar (or Page properties in the empty inspector)." (`manifest/features/06-page-and-export.json:18` `"Click Page in the top bar (or Page properties in the empty inspector).",`). O esperado: "The Page root is selected and the inspector shows page settings above the page styles." (`manifest/features/06-page-and-export.json:23` `"The Page root is selected and the inspector shows page settings above the page styles.",`). No cenário `page-properties-selects-the-page-root-and-shows-its-settings` (`manifest/features/06-page-and-export.json:31` `"id": "page-properties-selects-the-page-root-and-shows-its-settings",`), com a seleção inicial no filho `/Page/Hero/Intro` (`manifest/features/06-page-and-export.json:35` `"/Page/Hero/Intro"`), disparar a porta do botão do inspector (`manifest/features/06-page-and-export.json:46` `"door": "page.openProperties#inspector-page-properties-button",`) deixa a seleção no root `/Page` (`manifest/features/06-page-and-export.json:61` `"/Page"`), sem passo de desfazer (`manifest/features/06-page-and-export.json:64` `"undoSteps": 0,`) e sem mudança no documento (`manifest/features/06-page-and-export.json:59` `"document": [],`); a barra de status anuncia `status.selected` com o nome "Page" (`manifest/features/06-page-and-export.json:73` `"key": "status.selected",`, `manifest/features/06-page-and-export.json:75` `"name": "Page"`), que na interface é "Seleção: {name}." (`src/i18n/locales/pt-BR.json:1930` `"status.selected": "Seleção: {name}.",`). O cenário mede a região `inspector-settings` com altura maior que zero (`manifest/features/06-page-and-export.json:83` `"region": "inspector-settings",`, `manifest/features/06-page-and-export.json:86` `"value": 0,`), o que põe os campos de configuração da página à vista. Pelas regras do editor: G6 — toda vista mostra a mesma seleção, lida da store, e por isso canvas e Camadas passam a mostrar o root da página; G3 — as portas enviam só a intenção, sem argumentos; G1 — o comando não grava no documento e por isso não entra no histórico; G4 e G5 — o inspector ocupa a própria coluna, e os campos da página ficam dentro do alcance.

## REQ-1902 — page.setSetting (Definir uma configuração da página)
- **Onde:** `manifest/commands/page.json:70` `"id": "page.setSetting",`
- **Tratador:** `src/app/commands.ts:342` `'page.setSetting': setPageSettingCommand,`
- **Feature:** `src/app/features.ts:98` `'page-properties': registerFeature('page-properties'),`
- **Comportamento esperado:** Define uma configuração da página. O rótulo é "Definir {setting}" (`src/i18n/locales/pt-BR.json:466` `"command.setPageSetting": "Definir {setting}",`) e o nome "Definir uma configuração da página" (`src/i18n/locales/pt-BR.json:467` `"command.setPageSetting.name": "Definir uma configuração da página",`). O comando recebe a configuração (`manifest/commands/page.json:76` `"setting": {`) e o valor; suas portas são os campos da aba de configurações do root da página: título (`manifest/commands/page.json:106` `"id": "inspector-page-title",`, atributo `pageTitle` em `manifest/commands/page.json:113` `"attribute": "pageTitle",`), idioma (`manifest/commands/page.json:132` `"id": "inspector-page-language",`, atributo `pageLanguage` em `manifest/commands/page.json:139` `"attribute": "pageLanguage",`), direção (`manifest/commands/page.json:158` `"id": "inspector-page-direction",`, atributo `pageDirection` em `manifest/commands/page.json:165` `"attribute": "pageDirection",`) e classes do root HTML (`manifest/commands/page.json:184` `"id": "inspector-page-html-classes",`, atributo `pageHtmlClasses` em `manifest/commands/page.json:191` `"attribute": "pageHtmlClasses",`). A feature manda "Set the title 'Landing', language 'pt-BR', direction rtl." (`manifest/features/06-page-and-export.json:19` `"Set the title 'Landing', language 'pt-BR', direction rtl.",`) e espera "Title, language and direction are stored in the page settings of the document JSON; the iframe html element gets lang and dir." (`manifest/features/06-page-and-export.json:24` `"Title, language and direction are stored in the page settings of the document JSON; the iframe html element gets lang and dir.",`) e "The HTML root class setting remains separate from body classes, is editable and undoable, and reaches canvas and export." (`manifest/features/06-page-and-export.json:25` `"The HTML root class setting remains separate from body classes, is editable and undoable, and reaches canvas and export.",`). No cenário `the-page-title-is-kept-in-one-undo-step-and-survives-a-reload` (`manifest/features/06-page-and-export.json:98` `"id": "the-page-title-is-kept-in-one-undo-step-and-survives-a-reload",`), a porta do título (`manifest/features/06-page-and-export.json:122` `"door": "page.setSetting#inspector-page-title",`) entrega a configuração `pageTitle` e o texto do campo (`manifest/features/06-page-and-export.json:124` `"setting": "pageTitle",`, `manifest/features/06-page-and-export.json:125` `"value": "Landing"`), e o documento recebe `/Page/@attributes/pageTitle` com o valor "Landing" (`manifest/features/06-page-and-export.json:141` `"path": "/Page/@attributes/pageTitle",`, `manifest/features/06-page-and-export.json:142` `"value": "Landing"`), num único passo de desfazer (`manifest/features/06-page-and-export.json:149` `"undoSteps": 1,`), com a barra de status anunciando `status.page.settingSet` (`manifest/features/06-page-and-export.json:158` `"key": "status.page.settingSet",`, nome da configuração "Page title" em `manifest/features/06-page-and-export.json:160` `"setting": "Page title",`); o valor sobrevive à recarga (`manifest/features/06-page-and-export.json:167` `"persistence": {`, `manifest/features/06-page-and-export.json:168` `"reload": "immediate",`). No cenário `the-page-language-is-kept-and-survives-a-reload` (`manifest/features/06-page-and-export.json:178` `"id": "the-page-language-is-kept-and-survives-a-reload",`), o idioma vai para `/Page/@attributes/pageLanguage` com o valor "pt-BR" (`manifest/features/06-page-and-export.json:221` `"path": "/Page/@attributes/pageLanguage",`, `manifest/features/06-page-and-export.json:222` `"value": "pt-BR"`), com o mesmo anúncio (`manifest/features/06-page-and-export.json:238` `"key": "status.page.settingSet",`). No cenário `the-html-root-class-is-editable-and-kept` (`manifest/features/06-page-and-export.json:258` `"id": "the-html-root-class-is-editable-and-kept",`), as classes vão para `/Page/@attributes/pageHtmlClasses` com o valor "font-brand" (`manifest/features/06-page-and-export.json:301` `"path": "/Page/@attributes/pageHtmlClasses",`, `manifest/features/06-page-and-export.json:302` `"value": "font-brand"`), anunciadas como "HTML root classes" (`manifest/features/06-page-and-export.json:320` `"setting": "HTML root classes",`). No cenário `a-right-to-left-page-is-drawn-right-to-left-on-the-canvas` (`manifest/features/06-page-and-export.json:338` `"id": "a-right-to-left-page-is-drawn-right-to-left-on-the-canvas",`), a direção vai para `/Page/@attributes/pageDirection` com o valor "rtl" (`manifest/features/06-page-and-export.json:381` `"path": "/Page/@attributes/pageDirection",`, `manifest/features/06-page-and-export.json:382` `"value": "rtl"`), e o canvas computa `direction: rtl` no próprio `/Page` (`manifest/features/06-page-and-export.json:396` `"node": "/Page",`, `manifest/features/06-page-and-export.json:398` `"value": "rtl"`) e no descendente `/Page/Hero/Title` (`manifest/features/06-page-and-export.json:401` `"node": "/Page/Hero/Title",`, `manifest/features/06-page-and-export.json:403` `"value": "rtl"`). Quando o valor não serve, o comando recusa: a linguagem "english!" cai em `status.page.settingInvalid` (`manifest/features/06-page-and-export.json:478` `"key": "status.page.settingInvalid",`, `manifest/features/06-page-and-export.json:481` `"value": "english!"`), sem passo de desfazer (`manifest/features/06-page-and-export.json:469` `"undoSteps": 0,`) e com o documento inalterado (`manifest/features/06-page-and-export.json:491` `{`, `manifest/features/06-page-and-export.json:492` `"key": "status.page.settingInvalid",`); a direção "sideways" cai na mesma recusa (`manifest/features/06-page-and-export.json:552` `"key": "status.page.settingInvalid",`, `manifest/features/06-page-and-export.json:555` `"value": "sideways"`, `manifest/features/06-page-and-export.json:566` `"key": "status.page.settingInvalid",`). Na interface, a recusa diz "{setting} não aceita {value}." (`src/i18n/locales/pt-BR.json:1862` `"status.page.settingInvalid": "{setting} não aceita {value}.",`) e o sucesso diz "{setting}: {value}." (`src/i18n/locales/pt-BR.json:1866` `"status.page.settingSet": "{setting}: {value}.",`). O comando declara as recusas `status.page.settingInvalid`, `status.url.unsafe` e `status.url.malformed` (`manifest/commands/page.json:92` `"status.page.settingInvalid",`, `manifest/commands/page.json:93` `"status.url.unsafe",`, `manifest/commands/page.json:94` `"status.url.malformed"`), e a disponibilidade é `always` com `"refusalKey": null` (`manifest/commands/page.json:89` `"refusalKey": null`). O histórico guarda a mudança como desfazível (`manifest/commands/page.json:98` `"undoable": true,`), sem agrupar (`manifest/commands/page.json:99` `"coalesce": "none",`), restaurando a seleção anterior ao comando (`manifest/commands/page.json:100` `"undoRestoresSelection": "before-command",`), com uma transação por despacho (`manifest/commands/page.json:101` `"transaction": "per-dispatch",`) e nenhuma entrada quando o valor não muda (`manifest/commands/page.json:102` `"noChange": "no-entry"`). Pelas regras do editor: G1 — a edição é gravada no contexto em que foi feita (a configuração pertence ao root da página); G2 — o comando altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G3 — as portas enviam só a intenção, a configuração e o texto do campo; G6 — canvas e Camadas mostram a mesma seleção, lida da store; G7 — o canvas é o documento, e por isso a direção `rtl` aparece computada no iframe.

# Domínio project — REQ-2001 a REQ-2011

## REQ-2001 — project.newBlankPage
- **Onde:** `manifest/commands/project.json:5` `"id": "project.newBlankPage",`
- **Tratador:** `src/app/commands.ts:343` `'project.newBlankPage': newBlankPage,`
- **Feature:** `src/app/features.ts:55` `'new-blank-page': registerFeature('new-blank-page'),`
- **Comportamento esperado:** Começa de novo com uma página em branco; o rótulo da porta é "Nova página em branco" (`src/i18n/locales/pt-BR.json:400` `"command.newBlankPage": "Nova página em branco",`). Antes de trocar a página atual uma confirmação pergunta (`dialog.newBlankPage.message`, com `dialog.newBlankPage.confirm` e `dialog.cancel`): cancelar deixa o JSON do documento sem mudança e a barra de status mostra `status.confirmation.cancelled`; confirmar troca a página por uma raiz Page vazia, limpa a seleção e o histórico de undo, e a barra de status mostra `status.project.blankPage`, depois o autosave grava a página em branco. Com o projeto já vazio o comando começa de novo sem perguntar (cenário `the-empty-project-starts-over-without-asking`). As duas portas — o item do menu Arquivo e a entrada da paleta de comandos — enviam só a intenção ao mesmo tratador, e o resultado é o mesmo no mesmo estado (G3).

## REQ-2002 — project.restoreVersion
- **Onde:** `manifest/commands/project.json:70` `"id": "project.restoreVersion",`
- **Tratador:** `src/app/commands.ts:344` `'project.restoreVersion': restoreVersion,`
- **Feature:** `src/app/features.ts:56` `'autosave-corruption-recovery': registerFeature('autosave-corruption-recovery'),`
- **Comportamento esperado:** Restaura a versão escolhida de um projeto cujo registro salvo atual está corrompido; o rótulo da porta é "Restaurar esta versão" (`src/i18n/locales/pt-BR.json:438` `"command.restoreVersion": "Restaurar esta versão",`) e o argumento `version` diz qual versão anterior restaurar. A porta é o botão de restaurar do diálogo de recuperação. Com o registro corrompido o app abre na barra de status dizendo que a recuperação é necessária (`status.save.recoveryRequired`) e um diálogo lista as versões anteriores com seus horários. Restaurar carrega exatamente aquele JSON de documento e ele vira o registro salvo atual, com a barra de status mostrando `status.save.restored`; até algo ser restaurado ou uma página nova ser começada, o autosave não sobrescreve o registro corrompido. A recusa declarada é `status.open.invalidArchive`, que aparece na barra de status e deixa o documento sem alteração.

## REQ-2003 — project.takeOverEditing
- **Onde:** `manifest/commands/project.json:122` `"id": "project.takeOverEditing",`
- **Tratador:** `src/app/commands.ts:345` `'project.takeOverEditing': takeOverEditing,`
- **Feature:** `src/app/features.ts:57` `'multi-tab-guard': registerFeature('multi-tab-guard'),`
- **Comportamento esperado:** Faz esta aba assumir a edição do projeto; o rótulo da porta é "Assumir a edição" (`src/i18n/locales/pt-BR.json:2077` `"tabGuard.takeOver": "Assumir a edição",`) e a porta é o botão do painel de aviso sobre a outra aba. Só uma aba edita por vez: uma aba que abre enquanto outra edita mostra o projeto em modo leitura com o aviso e o botão, e nunca grava no IndexedDB. Assumir a edição recarrega o último projeto salvo nesta aba e deixa a outra aba em modo leitura (as abas se coordenam por BroadcastChannel); a partir daí a edição desta aba grava no documento (o cenário seleciona e remove um elemento). Uma aba em modo leitura recusa todo comando de documento com a barra de status mostrando `status.tabGuard.readOnly`, e o documento fica sem alteração, de modo que o autosave de duas abas nunca se mistura.

## REQ-2004 — project.save
- **Onde:** `manifest/commands/project.json:166` `"id": "project.save",`
- **Tratador:** `src/app/commands.ts:346` `'project.save': saveProject,`
- **Feature:** `src/app/features.ts:58` `'project-save-json': registerFeature('project-save-json'),`
- **Comportamento esperado:** Salva o projeto como um único arquivo; o rótulo da porta é "Salvar projeto" (`src/i18n/locales/pt-BR.json:439` `"command.saveProject": "Salvar projeto",`). O comando baixa um arquivo `project.zip` com `project.json` e cada arquivo que o projeto guarda ao lado do documento, no mesmo caminho, de modo que arquivos acrescentados por outras funcionalidades entram no salvamento. `project.json` leva a versão do formato e todo o JSON do documento (as árvores de página e cada ajuste que ele guarda) e nada que dependa da sessão do editor (sem seleção, sem zoom, sem ids do DOM). Salvar o mesmo documento duas vezes produz arquivos idênticos byte a byte a menos do carimbo de tempo (cena `save-downloads-the-project-archive`), e os cenários mostram que o documento gravado é o que está na tela no momento do comando. A barra de status mostra `status.project.saved` nomeando `project.zip`; salvar não altera o documento. As duas portas — o item do menu Arquivo e a entrada da paleta de comandos — enviam só a intenção ao mesmo tratador (G3).

## REQ-2005 — project.open
- **Onde:** `manifest/commands/project.json:227` `"id": "project.open",`
- **Tratador:** `src/app/commands.ts:349` `'project.open': openProject,`
- **Feature:** `src/app/features.ts:59` `'project-open-json': registerFeature('project-open-json'),`
- **Comportamento esperado:** Abre um arquivo de projeto escolhido pelo campo `file`; o rótulo da porta é "Abrir projeto" (`src/i18n/locales/pt-BR.json:410` `"command.openProject": "Abrir projeto",`). Antes de trocar o projeto atual uma confirmação pergunta (`dialog.openProject.message`, com `dialog.replace` e `dialog.cancel`): cancelar deixa o JSON do documento sem mudança e a barra de status mostra `status.confirmation.cancelled`. Abrir o arquivo salvo restaura exatamente o JSON do documento guardado e cada arquivo que o arquivo de projeto guarda; depois de abrir, o histórico de undo fica vazio, a barra de status mostra `status.open.opened` e o projeto é autossalvo. Um arquivo que não é um projeto válido é recusado com `status.open.invalidArchive` e o documento fica sem alteração; um projeto com versão de formato mais nova ou desconhecida é recusado com `status.open.newerVersion` nomeando a versão, também sem alterar o documento. Com o projeto vazio o comando abre sem perguntar (cenário `the-empty-project-opens-without-asking`). As duas portas — o item do menu Arquivo e a entrada da paleta de comandos — enviam só a intenção ao mesmo tratador (G3).

## REQ-2006 — project.openFolder
- **Onde:** `manifest/commands/project.json:301` `"id": "project.openFolder",`
- **Tratador:** `src/app/commands.ts:350` `'project.openFolder': openFolderCommand,`
- **Feature:** `src/app/features.ts:223` `'explorer-open-folder': registerFeature('explorer-open-folder'),`
- **Comportamento esperado:** Abre uma pasta inteira do disco pelo campo `folder`; o rótulo da porta é "Abrir pasta" (`src/i18n/locales/pt-BR.json:408` `"command.openFolder": "Abrir pasta",`). A pasta é lida com o seletor de diretórios do Chrome e cada arquivo cai no mesmo caminho do sistema de arquivos virtual, a menos de um arquivo cujo caminho pertence a um arquivo gerado (`css/styles.css`, `js/interactions.js`), que é mantido com um nome novo e listado no relatório da importação. As páginas HTML passam pelo importador de HTML: as folhas de estilo que elas ligam são resolvidas na pasta e viram os estilos do documento, porque o JSON do documento é a fonte da verdade; cada página vira uma página nomeada pelo seu arquivo, no seu caminho, e o `index.html` da raiz é a página inicial; uma pasta sem ele ganha um `index.html` inicial vazio, listado no relatório; os arquivos `.css` originais ficam na árvore como arquivos comuns que nenhuma página liga. JS, imagens e fontes são mantidos como arquivos. O relatório lista o que foi convertido, mantido ou descartado, e a barra de status mostra `status.folder.imported`; exportar logo depois reproduz a mesma estrutura de pastas. Substituir o projeto atual pede confirmação (`dialog.openFolder.message`, com `dialog.replace` e `dialog.cancel`); a recusa declarada `status.import.noPage` vale para uma pasta sem nenhuma página HTML, deixando o documento sem alteração, e as recusas `status.folder.unsupported` e `status.import.invalidArchive` aparecem na barra de status. As duas portas — o item do menu Arquivo e a entrada da paleta de comandos — enviam só a intenção ao mesmo tratador (G3).

## REQ-2007 — project.importHtml
- **Onde:** `manifest/commands/project.json:378` `"id": "project.importHtml",`
- **Tratador:** `src/app/commands.ts:351` `'project.importHtml': choosingImport(importHtmlCommand),`
- **Feature:** `src/app/features.ts:184` `'html-import-structure': registerFeature('html-import-structure'),`
- **Comportamento esperado:** Importa arquivos HTML escolhidos pelo campo `files`, com o destino do campo `destination` (`page`, `inside` ou `replace`) e o elemento do campo `target`; o rótulo das portas de arquivo é "Importar HTML" (`src/i18n/locales/pt-BR.json:376` `"command.importHtml": "Importar HTML",`) e o rótulo da porta de pasta é "Importar pasta HTML" (`src/i18n/locales/pt-BR.json:2207` `"command.importHtmlFolder": "Importar pasta HTML",`). Cada tag aceita vira o tipo de elemento correspondente no JSON do documento com o texto, as marcas em linha e os atributos aceitos; o nome do elemento sai da classe BEM quando existe e, quando não, do tipo do elemento; um link e as palavras vizinhas no item de lista continuam um trecho em linha editável. A importação em páginas novas e a de pasta preservam as páginas, os nomes de arquivo, os estilos e os arquivos existentes; nomes importados que colidem recebem nomes únicos e as referências acompanham. A importação para dentro é uma inserção desfazível e só a substituição pergunta antes, pedindo para remover o projeto atual (`dialog.importHtml.message`, com `dialog.replace` e `dialog.cancel`). A importação é uma entrada de undo (com undoRestoresSelection de antes do comando); a barra de status mostra `status.import.done`. As recusas declaradas são `status.import.noPage` — arquivos sem nenhuma página HTML são recusados, o documento fica sem alteração e a importação seguinte roda —, `status.import.insideRefused` — importar para dentro de um parágrafo é recusado — e `status.import.invalidArchive`. As portas de arquivo do menu e da paleta, a porta de pasta e os três controles do painel de importação (destino `page`, `inside` ou `replace`) enviam só a intenção ao mesmo tratador, e o resultado é o mesmo no mesmo estado (G3).

## REQ-2008 — project.export
- **Onde:** `manifest/commands/project.json:581` `"id": "project.export",`
- **Tratador:** `src/app/commands.ts:352` `'project.export': exportProject,`
- **Feature:** `src/app/features.ts:100` `'export-zip': registerFeature('export-zip'),`
- **Comportamento esperado:** Exporta a página como um ZIP com HTML e uma folha de estilo própria; o rótulo da porta é "Exportar ZIP" (`src/i18n/locales/pt-BR.json:332` `"command.exportPage": "Exportar ZIP",`). O ZIP baixado tem `index.html` e `css/styles.css`, e o `index.html` liga a folha de estilo. O `index.html` tem o doctype, o `<html lang dir>`, o `<meta charset>`, a meta de viewport e o `<title>` da página, além do `lang` no idioma do projeto; cada nó é escrito com a sua tag semântica, o texto é escapado e as marcas em linha ficam, e uma quebra de linha vira `<br>`. Nenhum elemento do `index.html` fica com atributo `style`, atributo `data-` gerado pelo editor ou id gerado pelo editor; um elemento oculto carrega o atributo `hidden`, e a folha de estilo não leva `display: none` para ele. A página exportada aberta no Chrome desenha cada elemento com os mesmos estilos calculados do canvas, a menos dos apoios que só existem no editor (DCS-002). A barra de status mostra `status.export.done` nomeando `site.zip`; exportar não altera o documento. As quatro portas — o item do menu Arquivo, o botão da barra de cima, o botão da barra de visualização e a entrada da paleta de comandos — enviam só a intenção ao mesmo tratador (G3).

## REQ-2009 — project.setLanguage
- **Onde:** `manifest/commands/project.json:686` `"id": "project.setLanguage",`
- **Tratador:** `src/app/commands.ts:347` `'project.setLanguage': setProjectLanguage,`
- **Feature:** `src/app/features.ts:239` `'project-language': registerFeature('project-language'),`
- **Comportamento esperado:** Dá ao projeto o seu idioma; o rótulo da porta é "Idioma do projeto" (`src/i18n/locales/pt-BR.json:3432` `"command.project.setLanguage": "Idioma do projeto",`) e a porta é o campo de idioma do projeto na aba Ajustes. O idioma enviado entra no documento e toda página sem idioma próprio é exportada no idioma do projeto (o cenário `the-export-writes-the-project-language` mostra o `lang` do HTML exportado no idioma escolhido); a barra de status mostra `status.project.languageSet` com o idioma. Como toda digitação, o texto é gravado no contexto em que foi feito (G1) e não se perde se a seleção ou a camada mudarem com a digitação pendente (G2). Recusa com `status.project.languageInvalid` quando o valor não é uma etiqueta de idioma, deixando o documento sem alteração. Cada mudança é uma entrada de undo, e o undo restaura a seleção de antes do comando.

## REQ-2010 — project.setCodeLanguage
- **Onde:** `manifest/commands/project.json:742` `"id": "project.setCodeLanguage",`
- **Tratador:** `src/app/commands.ts:348` `'project.setCodeLanguage': setCodeLanguage,`
- **Feature:** `src/app/features.ts:239` `'project-language': registerFeature('project-language'),`
- **Comportamento esperado:** Dá ao projeto o seu idioma de código; o rótulo da porta é "Idioma do código" (`src/i18n/locales/pt-BR.json:3433` `"command.project.setCodeLanguage": "Idioma do código",`) e a porta é o campo de idioma do código na aba Ajustes. O idioma de código enviado entra no documento e as classes exportadas são nomeadas nesse idioma (intenção da feature `project-language`); a barra de status mostra `status.project.codeLanguageSet` com o idioma. Como toda digitação, o texto é gravado no contexto em que foi feito (G1) e não se perde se a seleção ou a camada mudarem com a digitação pendente (G2). Recusa com `status.project.languageInvalid` quando o valor não é uma etiqueta de idioma, deixando o documento sem alteração. Cada mudança é uma entrada de undo, e o undo restaura a seleção de antes do comando.

## REQ-2011 — project.captureUrl
- **Onde:** `manifest/commands/project.json:798` `"id": "project.captureUrl",`
- **Tratador:** `src/app/commands.ts:216` `'project.captureUrl': captureUrlCommand,`
- **Feature:** `src/app/features.ts:247` `'capture-url': registerFeature('capture-url'),`
- **Comportamento esperado:** Abre um endereço da web como uma página do projeto; o rótulo da porta é "Capturar" (`src/i18n/locales/pt-BR.json:3545` `"command.project.captureUrl": "Capturar",`) e a porta é o botão do diálogo aberto pelo item do menu Arquivo. O endereço vem do campo `url` digitado no diálogo e a contagem de páginas, quando enviada, do campo `pages`; o endereço digitado é gravado no contexto em que foi feito (G1). A captura chega pelo importador de HTML: a página como os scripts a deixaram, com uma fotografia ordenada do DOM em cada largura observada, folhas de estilo na ordem de origem com suas condições de mídia, e imagens, fontes e recursos localizados quando disponíveis, com recursos que faltam sendo relatados em vez de trocados por endereços remotos. O canvas e o export desenham a mesma árvore JSON capturada na largura observada, e larguras não observadas ficam aproximadas; scripts capturados não rodam de novo sobre a fotografia, e pintura opaca de canvas, vídeo e quadro usa uma imagem de apoio explícita cujo DOM interno não é editável. Recusa com `status.capture.invalidUrl` quando o texto não é um endereço da web e com `status.capture.badPages` quando a contagem de páginas sai da faixa, deixando o documento sem alteração em ambos os casos; o comando não entra no histórico de undo.

## REQ-4001 — display
- **Onde:** `manifest/properties.json:515` `"id": "display",`
- **Rótulo:** `manifest/properties.json:516` `"labelKey": "property.display"`
- **Comportamento esperado:** Escreve a declaração `display` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: block, inline, inline-block, flex, inline-flex, grid, inline-grid, contents, none. Está entre as propriedades essenciais.

## REQ-4002 — flex-direction
- **Onde:** `manifest/properties.json:555` `"id": "flex-direction",`
- **Rótulo:** `manifest/properties.json:556` `"labelKey": "property.flexDirection"`
- **Comportamento esperado:** Escreve a declaração `flex-direction` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner flex. No inspetor a pessoa vê uma fileira de botões de palavra-chave. Está entre as propriedades essenciais.

## REQ-4003 — flex-wrap
- **Onde:** `manifest/properties.json:592` `"id": "flex-wrap",`
- **Rótulo:** `manifest/properties.json:593` `"labelKey": "property.flexWrap"`
- **Comportamento esperado:** Escreve a declaração `flex-wrap` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner flex. No inspetor a pessoa vê um menu de palavras-chave. Está entre as propriedades essenciais.

## REQ-4004 — justify-content
- **Onde:** `manifest/properties.json:608` `"id": "justify-content",`
- **Rótulo:** `manifest/properties.json:609` `"labelKey": "property.justifyContent"`
- **Comportamento esperado:** Escreve a declaração `justify-content` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner flex ou grid. No inspetor a pessoa vê um menu de palavras-chave. Está entre as propriedades essenciais.

## REQ-4005 — align-items
- **Onde:** `manifest/properties.json:627` `"id": "align-items",`
- **Rótulo:** `manifest/properties.json:628` `"labelKey": "property.alignItems"`
- **Comportamento esperado:** Escreve a declaração `align-items` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner flex ou grid. No inspetor a pessoa vê um menu de palavras-chave. Está entre as propriedades essenciais.

## REQ-4006 — align-content
- **Onde:** `manifest/properties.json:646` `"id": "align-content",`
- **Rótulo:** `manifest/properties.json:647` `"labelKey": "property.alignContent"`
- **Comportamento esperado:** Escreve a declaração `align-content` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner flex ou grid. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4007 — row-gap
- **Onde:** `manifest/properties.json:662` `"id": "row-gap",`
- **Rótulo:** `manifest/properties.json:663` `"labelKey": "property.rowGap"`
- **Comportamento esperado:** Escreve a declaração `row-gap` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um contêiner flex ou grid. No inspetor a pessoa vê um campo de comprimento. Os valores oferecidos pela lista são: normal.

## REQ-4008 — column-gap
- **Onde:** `manifest/properties.json:696` `"id": "column-gap",`
- **Rótulo:** `manifest/properties.json:697` `"labelKey": "property.columnGap"`
- **Comportamento esperado:** Escreve a declaração `column-gap` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um contêiner flex ou grid. No inspetor a pessoa vê um campo de comprimento. Os valores oferecidos pela lista são: normal.

## REQ-4009 — grid-template-columns
- **Onde:** `manifest/properties.json:730` `"id": "grid-template-columns",`
- **Rótulo:** `manifest/properties.json:731` `"labelKey": "property.gridTemplateColumns"`
- **Comportamento esperado:** Escreve a declaração `grid-template-columns` (codec `track-list`, valueType `string`). Aplica-se a um contêiner grid. No inspetor a pessoa vê um editor de trilhas. Os valores oferecidos pela lista são: auto, min-content, max-content. Está entre as propriedades essenciais.

## REQ-4010 — grid-template-rows
- **Onde:** `manifest/properties.json:767` `"id": "grid-template-rows",`
- **Rótulo:** `manifest/properties.json:768` `"labelKey": "property.gridTemplateRows"`
- **Comportamento esperado:** Escreve a declaração `grid-template-rows` (codec `track-list`, valueType `string`). Aplica-se a um contêiner grid. No inspetor a pessoa vê um editor de trilhas. Os valores oferecidos pela lista são: auto, min-content, max-content.

## REQ-4011 — grid-auto-flow
- **Onde:** `manifest/properties.json:803` `"id": "grid-auto-flow",`
- **Rótulo:** `manifest/properties.json:804` `"labelKey": "property.gridAutoFlow"`
- **Comportamento esperado:** Escreve a declaração `grid-auto-flow` (codec `keyword-set`, valueType `keyword`). Aplica-se a um contêiner grid. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: row, column, row dense, column dense.

## REQ-4012 — justify-items
- **Onde:** `manifest/properties.json:831` `"id": "justify-items",`
- **Rótulo:** `manifest/properties.json:832` `"labelKey": "property.justifyItems"`
- **Comportamento esperado:** Escreve a declaração `justify-items` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner grid. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4013 — grid-template-areas
- **Onde:** `manifest/properties.json:847` `"id": "grid-template-areas",`
- **Rótulo:** `manifest/properties.json:848` `"labelKey": "property.gridTemplateAreas"`
- **Comportamento esperado:** Escreve a declaração `grid-template-areas` (codec `grid-areas`, valueType `string`). Aplica-se a um contêiner grid. No inspetor a pessoa vê um campo de texto.

## REQ-4014 — flex-grow
- **Onde:** `manifest/properties.json:863` `"id": "flex-grow",`
- **Rótulo:** `manifest/properties.json:864` `"labelKey": "property.flexGrow"`
- **Comportamento esperado:** Escreve a declaração `flex-grow` (codec `number`, valueType `number`). Aplica-se a um item flex (filho de um contêiner flex). No inspetor a pessoa vê um campo numérico.

## REQ-4015 — flex-shrink
- **Onde:** `manifest/properties.json:880` `"id": "flex-shrink",`
- **Rótulo:** `manifest/properties.json:881` `"labelKey": "property.flexShrink"`
- **Comportamento esperado:** Escreve a declaração `flex-shrink` (codec `number`, valueType `number`). Aplica-se a um item flex (filho de um contêiner flex). No inspetor a pessoa vê um campo numérico.

## REQ-4016 — flex-basis
- **Onde:** `manifest/properties.json:896` `"id": "flex-basis",`
- **Rótulo:** `manifest/properties.json:897` `"labelKey": "property.flexBasis"`
- **Comportamento esperado:** Escreve a declaração `flex-basis` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um item flex (filho de um contêiner flex). No inspetor a pessoa vê um campo de comprimento.

## REQ-4017 — align-self
- **Onde:** `manifest/properties.json:912` `"id": "align-self",`
- **Rótulo:** `manifest/properties.json:913` `"labelKey": "property.alignSelf"`
- **Comportamento esperado:** Escreve a declaração `align-self` (codec `keyword`, valueType `keyword`). Aplica-se a um item flex ou grid. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4018 — justify-self
- **Onde:** `manifest/properties.json:928` `"id": "justify-self",`
- **Rótulo:** `manifest/properties.json:929` `"labelKey": "property.justifySelf"`
- **Comportamento esperado:** Escreve a declaração `justify-self` (codec `keyword`, valueType `keyword`). Aplica-se a um item de grid. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4019 — order
- **Onde:** `manifest/properties.json:944` `"id": "order",`
- **Rótulo:** `manifest/properties.json:945` `"labelKey": "property.order"`
- **Comportamento esperado:** Escreve a declaração `order` (codec `integer`, valueType `integer`). Aplica-se a um item flex ou grid. No inspetor a pessoa vê um campo numérico.

## REQ-4020 — grid-column-start
- **Onde:** `manifest/properties.json:960` `"id": "grid-column-start",`
- **Rótulo:** `manifest/properties.json:961` `"labelKey": "property.gridColumnStart"`
- **Comportamento esperado:** Escreve a declaração `grid-column-start` (codec `grid-line`, valueType `string`). Aplica-se a um item de grid. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4021 — grid-column-end
- **Onde:** `manifest/properties.json:980` `"id": "grid-column-end",`
- **Rótulo:** `manifest/properties.json:981` `"labelKey": "property.gridColumnEnd"`
- **Comportamento esperado:** Escreve a declaração `grid-column-end` (codec `grid-line`, valueType `string`). Aplica-se a um item de grid. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4022 — grid-row-start
- **Onde:** `manifest/properties.json:1000` `"id": "grid-row-start",`
- **Rótulo:** `manifest/properties.json:1001` `"labelKey": "property.gridRowStart"`
- **Comportamento esperado:** Escreve a declaração `grid-row-start` (codec `grid-line`, valueType `string`). Aplica-se a um item de grid. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4023 — grid-row-end
- **Onde:** `manifest/properties.json:1019` `"id": "grid-row-end",`
- **Rótulo:** `manifest/properties.json:1020` `"labelKey": "property.gridRowEnd"`
- **Comportamento esperado:** Escreve a declaração `grid-row-end` (codec `grid-line`, valueType `string`). Aplica-se a um item de grid. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4024 — column-width
- **Onde:** `manifest/properties.json:1038` `"id": "column-width",`
- **Rótulo:** `manifest/properties.json:1039` `"labelKey": "property.columnWidth"`
- **Comportamento esperado:** Escreve a declaração `column-width` (codec `length`, valueType `length`). Aplica-se a um contêiner que pode guardar filhos. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4025 — column-count
- **Onde:** `manifest/properties.json:1054` `"id": "column-count",`
- **Rótulo:** `manifest/properties.json:1055` `"labelKey": "property.columnCount"`
- **Comportamento esperado:** Escreve a declaração `column-count` (codec `integer`, valueType `integer`). Aplica-se a um contêiner que pode guardar filhos. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4026 — column-span
- **Onde:** `manifest/properties.json:1070` `"id": "column-span",`
- **Rótulo:** `manifest/properties.json:1071` `"labelKey": "property.columnSpan"`
- **Comportamento esperado:** Escreve a declaração `column-span` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento sujeito a fragmentação (bloco, coluna ou página). No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4027 — column-fill
- **Onde:** `manifest/properties.json:1086` `"id": "column-fill",`
- **Rótulo:** `manifest/properties.json:1087` `"labelKey": "property.columnFill"`
- **Comportamento esperado:** Escreve a declaração `column-fill` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com colunas múltiplas. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4028 — column-rule-width
- **Onde:** `manifest/properties.json:1102` `"id": "column-rule-width",`
- **Rótulo:** `manifest/properties.json:1103` `"labelKey": "property.columnRuleWidth"`
- **Comportamento esperado:** Escreve a declaração `column-rule-width` (codec `line-width`, valueType `length`). Aplica-se a um elemento com colunas múltiplas. No inspetor a pessoa vê um campo de comprimento.

## REQ-4029 — column-rule-style
- **Onde:** `manifest/properties.json:1118` `"id": "column-rule-style",`
- **Rótulo:** `manifest/properties.json:1119` `"labelKey": "property.columnRuleStyle"`
- **Comportamento esperado:** Escreve a declaração `column-rule-style` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com colunas múltiplas. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4030 — column-rule-color
- **Onde:** `manifest/properties.json:1134` `"id": "column-rule-color",`
- **Rótulo:** `manifest/properties.json:1135` `"labelKey": "property.columnRuleColor"`
- **Comportamento esperado:** Escreve a declaração `column-rule-color` (codec `color`, valueType `color`). Aplica-se a um elemento com colunas múltiplas. No inspetor a pessoa vê um campo de cor.

## REQ-4031 — break-before
- **Onde:** `manifest/properties.json:1150` `"id": "break-before",`
- **Rótulo:** `manifest/properties.json:1151` `"labelKey": "property.breakBefore"`
- **Comportamento esperado:** Escreve a declaração `break-before` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento sujeito a fragmentação (bloco, coluna ou página). No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: auto, page, left, right.

## REQ-4032 — break-after
- **Onde:** `manifest/properties.json:1178` `"id": "break-after",`
- **Rótulo:** `manifest/properties.json:1179` `"labelKey": "property.breakAfter"`
- **Comportamento esperado:** Escreve a declaração `break-after` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento sujeito a fragmentação (bloco, coluna ou página). No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: auto, page, left, right.

## REQ-4033 — break-inside
- **Onde:** `manifest/properties.json:1206` `"id": "break-inside",`
- **Rótulo:** `manifest/properties.json:1207` `"labelKey": "property.breakInside"`
- **Comportamento esperado:** Escreve a declaração `break-inside` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento sujeito a fragmentação (bloco, coluna ou página). No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: auto, avoid, avoid-page, avoid-column.

## REQ-4034 — scroll-behavior
- **Onde:** `manifest/properties.json:1234` `"id": "scroll-behavior",`
- **Rótulo:** `manifest/properties.json:1235` `"labelKey": "property.scrollBehavior"`
- **Comportamento esperado:** Escreve a declaração `scroll-behavior` (codec `keyword`, valueType `keyword`). Aplica-se a um contêiner com rolagem. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4035 — scroll-snap-type
- **Onde:** `manifest/properties.json:1250` `"id": "scroll-snap-type",`
- **Rótulo:** `manifest/properties.json:1251` `"labelKey": "property.scrollSnapType"`
- **Comportamento esperado:** Escreve a declaração `scroll-snap-type` (codec `keyword-set`, valueType `keyword`). Aplica-se a um contêiner com rolagem. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: none, x mandatory, y mandatory, both mandatory, x proximity, y proximity.

## REQ-4036 — scroll-snap-align
- **Onde:** `manifest/properties.json:1281` `"id": "scroll-snap-align",`
- **Rótulo:** `manifest/properties.json:1282` `"labelKey": "property.scrollSnapAlign"`
- **Comportamento esperado:** Escreve a declaração `scroll-snap-align` (codec `keyword-set`, valueType `keyword`). Aplica-se a um filho de um contêiner com encaixe de rolagem. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4037 — border-collapse
- **Onde:** `manifest/properties.json:1298` `"id": "border-collapse",`
- **Rótulo:** `manifest/properties.json:1299` `"labelKey": "property.borderCollapse"`
- **Comportamento esperado:** Escreve a declaração `border-collapse` (codec `keyword`, valueType `keyword`). Aplica-se a uma tabela. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4038 — border-spacing
- **Onde:** `manifest/properties.json:1314` `"id": "border-spacing",`
- **Rótulo:** `manifest/properties.json:1315` `"labelKey": "property.borderSpacing"`
- **Comportamento esperado:** Escreve a declaração `border-spacing` (codec `length-pair`, valueType `length`). Aplica-se a uma tabela. No inspetor a pessoa vê um campo de comprimento.

## REQ-4039 — table-layout
- **Onde:** `manifest/properties.json:1330` `"id": "table-layout",`
- **Rótulo:** `manifest/properties.json:1331` `"labelKey": "property.tableLayout"`
- **Comportamento esperado:** Escreve a declaração `table-layout` (codec `keyword`, valueType `keyword`). Aplica-se a uma tabela. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4040 — caption-side
- **Onde:** `manifest/properties.json:1346` `"id": "caption-side",`
- **Rótulo:** `manifest/properties.json:1347` `"labelKey": "property.captionSide"`
- **Comportamento esperado:** Escreve a declaração `caption-side` (codec `keyword`, valueType `keyword`). Aplica-se a uma tabela ou à sua legenda. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4041 — empty-cells
- **Onde:** `manifest/properties.json:1362` `"id": "empty-cells",`
- **Rótulo:** `manifest/properties.json:1363` `"labelKey": "property.emptyCells"`
- **Comportamento esperado:** Escreve a declaração `empty-cells` (codec `keyword`, valueType `keyword`). Aplica-se a uma tabela. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4042 — contain
- **Onde:** `manifest/properties.json:1378` `"id": "contain",`
- **Rótulo:** `manifest/properties.json:1379` `"labelKey": "property.contain"`
- **Comportamento esperado:** Escreve a declaração `contain` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4043 — content-visibility
- **Onde:** `manifest/properties.json:1394` `"id": "content-visibility",`
- **Rótulo:** `manifest/properties.json:1395` `"labelKey": "property.contentVisibility"`
- **Comportamento esperado:** Escreve a declaração `content-visibility` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4044 — counter-reset
- **Onde:** `manifest/properties.json:1410` `"id": "counter-reset",`
- **Rótulo:** `manifest/properties.json:1411` `"labelKey": "property.counterReset"`
- **Comportamento esperado:** Escreve a declaração `counter-reset` (codec `counter-list`, valueType `string`). Aplica-se a um contêiner que pode guardar filhos. No inspetor a pessoa vê um campo de texto.

## REQ-4045 — counter-increment
- **Onde:** `manifest/properties.json:1426` `"id": "counter-increment",`
- **Rótulo:** `manifest/properties.json:1427` `"labelKey": "property.counterIncrement"`
- **Comportamento esperado:** Escreve a declaração `counter-increment` (codec `counter-list`, valueType `string`). Aplica-se a um contêiner que pode guardar filhos. No inspetor a pessoa vê um campo de texto.

## REQ-4046 — padding-top
- **Onde:** `manifest/properties.json:1442` `"id": "padding-top",`
- **Rótulo:** `manifest/properties.json:1443` `"labelKey": "property.paddingTop"`
- **Comportamento esperado:** Escreve a declaração `padding-top` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4047 — padding-right
- **Onde:** `manifest/properties.json:1461` `"id": "padding-right",`
- **Rótulo:** `manifest/properties.json:1462` `"labelKey": "property.paddingRight"`
- **Comportamento esperado:** Escreve a declaração `padding-right` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4048 — padding-bottom
- **Onde:** `manifest/properties.json:1480` `"id": "padding-bottom",`
- **Rótulo:** `manifest/properties.json:1481` `"labelKey": "property.paddingBottom"`
- **Comportamento esperado:** Escreve a declaração `padding-bottom` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4049 — padding-left
- **Onde:** `manifest/properties.json:1499` `"id": "padding-left",`
- **Rótulo:** `manifest/properties.json:1500` `"labelKey": "property.paddingLeft"`
- **Comportamento esperado:** Escreve a declaração `padding-left` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4050 — margin-top
- **Onde:** `manifest/properties.json:1518` `"id": "margin-top",`
- **Rótulo:** `manifest/properties.json:1519` `"labelKey": "property.marginTop"`
- **Comportamento esperado:** Escreve a declaração `margin-top` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4051 — margin-right
- **Onde:** `manifest/properties.json:1541` `"id": "margin-right",`
- **Rótulo:** `manifest/properties.json:1542` `"labelKey": "property.marginRight"`
- **Comportamento esperado:** Escreve a declaração `margin-right` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4052 — margin-bottom
- **Onde:** `manifest/properties.json:1560` `"id": "margin-bottom",`
- **Rótulo:** `manifest/properties.json:1561` `"labelKey": "property.marginBottom"`
- **Comportamento esperado:** Escreve a declaração `margin-bottom` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4053 — margin-left
- **Onde:** `manifest/properties.json:1579` `"id": "margin-left",`
- **Rótulo:** `manifest/properties.json:1580` `"labelKey": "property.marginLeft"`
- **Comportamento esperado:** Escreve a declaração `margin-left` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de caixa (box model). Está entre as propriedades essenciais.

## REQ-4054 — width
- **Onde:** `manifest/properties.json:1602` `"id": "width",`
- **Rótulo:** `manifest/properties.json:1603` `"labelKey": "property.width"`
- **Comportamento esperado:** Escreve a declaração `width` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento. Está entre as propriedades essenciais.

## REQ-4055 — height
- **Onde:** `manifest/properties.json:1632` `"id": "height",`
- **Rótulo:** `manifest/properties.json:1633` `"labelKey": "property.height"`
- **Comportamento esperado:** Escreve a declaração `height` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento. Os valores oferecidos pela lista são: 100vh. Está entre as propriedades essenciais.

## REQ-4056 — min-width
- **Onde:** `manifest/properties.json:1671` `"id": "min-width",`
- **Rótulo:** `manifest/properties.json:1672` `"labelKey": "property.minWidth"`
- **Comportamento esperado:** Escreve a declaração `min-width` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento.

## REQ-4057 — max-width
- **Onde:** `manifest/properties.json:1687` `"id": "max-width",`
- **Rótulo:** `manifest/properties.json:1688` `"labelKey": "property.maxWidth"`
- **Comportamento esperado:** Escreve a declaração `max-width` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento.

## REQ-4058 — min-height
- **Onde:** `manifest/properties.json:1703` `"id": "min-height",`
- **Rótulo:** `manifest/properties.json:1704` `"labelKey": "property.minHeight"`
- **Comportamento esperado:** Escreve a declaração `min-height` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento.

## REQ-4059 — max-height
- **Onde:** `manifest/properties.json:1719` `"id": "max-height",`
- **Rótulo:** `manifest/properties.json:1720` `"labelKey": "property.maxHeight"`
- **Comportamento esperado:** Escreve a declaração `max-height` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento.

## REQ-4060 — box-sizing
- **Onde:** `manifest/properties.json:1735` `"id": "box-sizing",`
- **Rótulo:** `manifest/properties.json:1736` `"labelKey": "property.boxSizing"`
- **Comportamento esperado:** Escreve a declaração `box-sizing` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4061 — aspect-ratio
- **Onde:** `manifest/properties.json:1751` `"id": "aspect-ratio",`
- **Rótulo:** `manifest/properties.json:1752` `"labelKey": "property.aspectRatio"`
- **Comportamento esperado:** Escreve a declaração `aspect-ratio` (codec `ratio`, valueType `number`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de texto. Os valores oferecidos pela lista são: auto, 16 / 9, 4 / 3, 3 / 2, 1 / 1, 21 / 9, 9 / 16.

## REQ-4062 — overflow-x
- **Onde:** `manifest/properties.json:1782` `"id": "overflow-x",`
- **Rótulo:** `manifest/properties.json:1783` `"labelKey": "property.overflowX"`
- **Comportamento esperado:** Escreve a declaração `overflow-x` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4063 — overflow-y
- **Onde:** `manifest/properties.json:1801` `"id": "overflow-y",`
- **Rótulo:** `manifest/properties.json:1802` `"labelKey": "property.overflowY"`
- **Comportamento esperado:** Escreve a declaração `overflow-y` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4064 — resize
- **Onde:** `manifest/properties.json:1820` `"id": "resize",`
- **Rótulo:** `manifest/properties.json:1821` `"labelKey": "property.resize"`
- **Comportamento esperado:** Escreve a declaração `resize` (codec `keyword`, valueType `keyword`). Aplica-se a uma área de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4065 — object-fit
- **Onde:** `manifest/properties.json:1836` `"id": "object-fit",`
- **Rótulo:** `manifest/properties.json:1837` `"labelKey": "property.objectFit"`
- **Comportamento esperado:** Escreve a declaração `object-fit` (codec `keyword`, valueType `keyword`). Aplica-se a uma mídia (imagem ou vídeo). No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4066 — object-position
- **Onde:** `manifest/properties.json:1853` `"id": "object-position",`
- **Rótulo:** `manifest/properties.json:1854` `"labelKey": "property.objectPosition"`
- **Comportamento esperado:** Escreve a declaração `object-position` (codec `position`, valueType `length-percentage`). Aplica-se a uma mídia (imagem ou vídeo). No inspetor a pessoa vê um campo de texto.

## REQ-4067 — position
- **Onde:** `manifest/properties.json:1869` `"id": "position",`
- **Rótulo:** `manifest/properties.json:1870` `"labelKey": "property.position"`
- **Comportamento esperado:** Escreve a declaração `position` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma fileira de botões de palavra-chave. Está entre as propriedades essenciais.

## REQ-4068 — top
- **Onde:** `manifest/properties.json:1886` `"id": "top",`
- **Rótulo:** `manifest/properties.json:1887` `"labelKey": "property.top"`
- **Comportamento esperado:** Escreve a declaração `top` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento posicionado (não estático). No inspetor a pessoa vê um campo de comprimento.

## REQ-4069 — right
- **Onde:** `manifest/properties.json:1912` `"id": "right",`
- **Rótulo:** `manifest/properties.json:1913` `"labelKey": "property.right"`
- **Comportamento esperado:** Escreve a declaração `right` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento posicionado (não estático). No inspetor a pessoa vê um campo de comprimento.

## REQ-4070 — bottom
- **Onde:** `manifest/properties.json:1933` `"id": "bottom",`
- **Rótulo:** `manifest/properties.json:1934` `"labelKey": "property.bottom"`
- **Comportamento esperado:** Escreve a declaração `bottom` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento posicionado (não estático). No inspetor a pessoa vê um campo de comprimento.

## REQ-4071 — left
- **Onde:** `manifest/properties.json:1954` `"id": "left",`
- **Rótulo:** `manifest/properties.json:1955` `"labelKey": "property.left"`
- **Comportamento esperado:** Escreve a declaração `left` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento posicionado (não estático). No inspetor a pessoa vê um campo de comprimento.

## REQ-4072 — z-index
- **Onde:** `manifest/properties.json:1978` `"id": "z-index",`
- **Rótulo:** `manifest/properties.json:1979` `"labelKey": "property.zIndex"`
- **Comportamento esperado:** Escreve a declaração `z-index` (codec `integer`, valueType `integer`). Aplica-se a um elemento posicionado (não estático). No inspetor a pessoa vê um campo numérico.

## REQ-4073 — float
- **Onde:** `manifest/properties.json:1994` `"id": "float",`
- **Rótulo:** `manifest/properties.json:1995` `"labelKey": "property.float"`
- **Comportamento esperado:** Escreve a declaração `float` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de caixa estática. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: none, left, right, inline-start, inline-end.

## REQ-4074 — clear
- **Onde:** `manifest/properties.json:2023` `"id": "clear",`
- **Rótulo:** `manifest/properties.json:2024` `"labelKey": "property.clear"`
- **Comportamento esperado:** Escreve a declaração `clear` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de caixa estática. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: none, left, right, both, inline-start, inline-end.

## REQ-4075 — translate
- **Onde:** `manifest/properties.json:2053` `"id": "translate",`
- **Rótulo:** `manifest/properties.json:2054` `"labelKey": "property.translate"`
- **Comportamento esperado:** Escreve a declaração `translate` (codec `translate`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê campos de transformação.

## REQ-4076 — rotate
- **Onde:** `manifest/properties.json:2071` `"id": "rotate",`
- **Rótulo:** `manifest/properties.json:2072` `"labelKey": "property.rotate"`
- **Comportamento esperado:** Escreve a declaração `rotate` (codec `rotate`, valueType `angle`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê campos de transformação.

## REQ-4077 — scale
- **Onde:** `manifest/properties.json:2089` `"id": "scale",`
- **Rótulo:** `manifest/properties.json:2090` `"labelKey": "property.scale"`
- **Comportamento esperado:** Escreve a declaração `scale` (codec `scale`, valueType `number`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê campos de transformação.

## REQ-4078 — background-color
- **Onde:** `manifest/properties.json:2106` `"id": "background-color",`
- **Rótulo:** `manifest/properties.json:2107` `"labelKey": "property.backgroundColor"`
- **Comportamento esperado:** Escreve a declaração `background-color` (codec `color`, valueType `color`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de cor. Está entre as propriedades essenciais.

## REQ-4079 — background-image
- **Onde:** `manifest/properties.json:2123` `"id": "background-image",`
- **Rótulo:** `manifest/properties.json:2124` `"labelKey": "property.backgroundImage"`
- **Comportamento esperado:** Escreve a declaração `background-image` (codec `image-layers`, valueType `image`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de imagem.

## REQ-4080 — background-size
- **Onde:** `manifest/properties.json:2152` `"id": "background-size",`
- **Rótulo:** `manifest/properties.json:2153` `"labelKey": "property.backgroundSize"`
- **Comportamento esperado:** Escreve a declaração `background-size` (codec `background-size`, valueType `length-percentage`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: auto, cover, contain, 100% 100%.

## REQ-4081 — background-position-x
- **Onde:** `manifest/properties.json:2182` `"id": "background-position-x",`
- **Rótulo:** `manifest/properties.json:2183` `"labelKey": "property.backgroundPositionX"`
- **Comportamento esperado:** Escreve a declaração `background-position-x` (codec `position-axis`, valueType `length-percentage`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo. Os valores oferecidos pela lista são: left, center, right.

## REQ-4082 — background-position-y
- **Onde:** `manifest/properties.json:2211` `"id": "background-position-y",`
- **Rótulo:** `manifest/properties.json:2212` `"labelKey": "property.backgroundPositionY"`
- **Comportamento esperado:** Escreve a declaração `background-position-y` (codec `position-axis`, valueType `length-percentage`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo. Os valores oferecidos pela lista são: top, center, bottom.

## REQ-4083 — background-repeat
- **Onde:** `manifest/properties.json:2240` `"id": "background-repeat",`
- **Rótulo:** `manifest/properties.json:2241` `"labelKey": "property.backgroundRepeat"`
- **Comportamento esperado:** Escreve a declaração `background-repeat` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4084 — background-attachment
- **Onde:** `manifest/properties.json:2258` `"id": "background-attachment",`
- **Rótulo:** `manifest/properties.json:2259` `"labelKey": "property.backgroundAttachment"`
- **Comportamento esperado:** Escreve a declaração `background-attachment` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4085 — background-origin
- **Onde:** `manifest/properties.json:2276` `"id": "background-origin",`
- **Rótulo:** `manifest/properties.json:2277` `"labelKey": "property.backgroundOrigin"`
- **Comportamento esperado:** Escreve a declaração `background-origin` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4086 — background-clip
- **Onde:** `manifest/properties.json:2294` `"id": "background-clip",`
- **Rótulo:** `manifest/properties.json:2295` `"labelKey": "property.backgroundClip"`
- **Comportamento esperado:** Escreve a declaração `background-clip` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4087 — background-blend-mode
- **Onde:** `manifest/properties.json:2312` `"id": "background-blend-mode",`
- **Rótulo:** `manifest/properties.json:2313` `"labelKey": "property.backgroundBlendMode"`
- **Comportamento esperado:** Escreve a declaração `background-blend-mode` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento que pinta imagem de fundo. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4088 — fill
- **Onde:** `manifest/properties.json:2328` `"id": "fill",`
- **Rótulo:** `manifest/properties.json:2329` `"labelKey": "property.fill"`
- **Comportamento esperado:** Escreve a declaração `fill` (codec `paint`, valueType `color`). Aplica-se a uma figura SVG. No inspetor a pessoa vê um campo de cor.

## REQ-4089 — stroke
- **Onde:** `manifest/properties.json:2345` `"id": "stroke",`
- **Rótulo:** `manifest/properties.json:2346` `"labelKey": "property.stroke"`
- **Comportamento esperado:** Escreve a declaração `stroke` (codec `paint`, valueType `color`). Aplica-se a uma figura SVG. No inspetor a pessoa vê um campo de cor.

## REQ-4090 — stroke-width
- **Onde:** `manifest/properties.json:2361` `"id": "stroke-width",`
- **Rótulo:** `manifest/properties.json:2362` `"labelKey": "property.strokeWidth"`
- **Comportamento esperado:** Escreve a declaração `stroke-width` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a uma figura SVG. No inspetor a pessoa vê um campo de comprimento.

## REQ-4091 — border-top-width
- **Onde:** `manifest/properties.json:2377` `"id": "border-top-width",`
- **Rótulo:** `manifest/properties.json:2378` `"labelKey": "property.borderTopWidth"`
- **Comportamento esperado:** Escreve a declaração `border-top-width` (codec `line-width`, valueType `length`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4092 — border-top-style
- **Onde:** `manifest/properties.json:2398` `"id": "border-top-style",`
- **Rótulo:** `manifest/properties.json:2399` `"labelKey": "property.borderTopStyle"`
- **Comportamento esperado:** Escreve a declaração `border-top-style` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4093 — border-top-color
- **Onde:** `manifest/properties.json:2417` `"id": "border-top-color",`
- **Rótulo:** `manifest/properties.json:2418` `"labelKey": "property.borderTopColor"`
- **Comportamento esperado:** Escreve a declaração `border-top-color` (codec `color`, valueType `color`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4094 — border-right-width
- **Onde:** `manifest/properties.json:2436` `"id": "border-right-width",`
- **Rótulo:** `manifest/properties.json:2437` `"labelKey": "property.borderRightWidth"`
- **Comportamento esperado:** Escreve a declaração `border-right-width` (codec `line-width`, valueType `length`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4095 — border-right-style
- **Onde:** `manifest/properties.json:2457` `"id": "border-right-style",`
- **Rótulo:** `manifest/properties.json:2458` `"labelKey": "property.borderRightStyle"`
- **Comportamento esperado:** Escreve a declaração `border-right-style` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4096 — border-right-color
- **Onde:** `manifest/properties.json:2476` `"id": "border-right-color",`
- **Rótulo:** `manifest/properties.json:2477` `"labelKey": "property.borderRightColor"`
- **Comportamento esperado:** Escreve a declaração `border-right-color` (codec `color`, valueType `color`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4097 — border-bottom-width
- **Onde:** `manifest/properties.json:2495` `"id": "border-bottom-width",`
- **Rótulo:** `manifest/properties.json:2496` `"labelKey": "property.borderBottomWidth"`
- **Comportamento esperado:** Escreve a declaração `border-bottom-width` (codec `line-width`, valueType `length`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4098 — border-bottom-style
- **Onde:** `manifest/properties.json:2516` `"id": "border-bottom-style",`
- **Rótulo:** `manifest/properties.json:2517` `"labelKey": "property.borderBottomStyle"`
- **Comportamento esperado:** Escreve a declaração `border-bottom-style` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4099 — border-bottom-color
- **Onde:** `manifest/properties.json:2535` `"id": "border-bottom-color",`
- **Rótulo:** `manifest/properties.json:2536` `"labelKey": "property.borderBottomColor"`
- **Comportamento esperado:** Escreve a declaração `border-bottom-color` (codec `color`, valueType `color`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4100 — border-left-width
- **Onde:** `manifest/properties.json:2554` `"id": "border-left-width",`
- **Rótulo:** `manifest/properties.json:2555` `"labelKey": "property.borderLeftWidth"`
- **Comportamento esperado:** Escreve a declaração `border-left-width` (codec `line-width`, valueType `length`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4101 — border-left-style
- **Onde:** `manifest/properties.json:2575` `"id": "border-left-style",`
- **Rótulo:** `manifest/properties.json:2576` `"labelKey": "property.borderLeftStyle"`
- **Comportamento esperado:** Escreve a declaração `border-left-style` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4102 — border-left-color
- **Onde:** `manifest/properties.json:2594` `"id": "border-left-color",`
- **Rótulo:** `manifest/properties.json:2595` `"labelKey": "property.borderLeftColor"`
- **Comportamento esperado:** Escreve a declaração `border-left-color` (codec `color`, valueType `color`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de bordas.

## REQ-4103 — border-top-left-radius
- **Onde:** `manifest/properties.json:2613` `"id": "border-top-left-radius",`
- **Rótulo:** `manifest/properties.json:2614` `"labelKey": "property.borderTopLeftRadius"`
- **Comportamento esperado:** Escreve a declaração `border-top-left-radius` (codec `radius`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de raios.

## REQ-4104 — border-top-right-radius
- **Onde:** `manifest/properties.json:2632` `"id": "border-top-right-radius",`
- **Rótulo:** `manifest/properties.json:2633` `"labelKey": "property.borderTopRightRadius"`
- **Comportamento esperado:** Escreve a declaração `border-top-right-radius` (codec `radius`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de raios.

## REQ-4105 — border-bottom-right-radius
- **Onde:** `manifest/properties.json:2651` `"id": "border-bottom-right-radius",`
- **Rótulo:** `manifest/properties.json:2652` `"labelKey": "property.borderBottomRightRadius"`
- **Comportamento esperado:** Escreve a declaração `border-bottom-right-radius` (codec `radius`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de raios.

## REQ-4106 — border-bottom-left-radius
- **Onde:** `manifest/properties.json:2670` `"id": "border-bottom-left-radius",`
- **Rótulo:** `manifest/properties.json:2671` `"labelKey": "property.borderBottomLeftRadius"`
- **Comportamento esperado:** Escreve a declaração `border-bottom-left-radius` (codec `radius`, valueType `length-percentage`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de raios.

## REQ-4107 — outline-width
- **Onde:** `manifest/properties.json:2689` `"id": "outline-width",`
- **Rótulo:** `manifest/properties.json:2690` `"labelKey": "property.outlineWidth"`
- **Comportamento esperado:** Escreve a declaração `outline-width` (codec `line-width`, valueType `length`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4108 — outline-style
- **Onde:** `manifest/properties.json:2705` `"id": "outline-style",`
- **Rótulo:** `manifest/properties.json:2706` `"labelKey": "property.outlineStyle"`
- **Comportamento esperado:** Escreve a declaração `outline-style` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4109 — outline-color
- **Onde:** `manifest/properties.json:2721` `"id": "outline-color",`
- **Rótulo:** `manifest/properties.json:2722` `"labelKey": "property.outlineColor"`
- **Comportamento esperado:** Escreve a declaração `outline-color` (codec `color`, valueType `color`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4110 — outline-offset
- **Onde:** `manifest/properties.json:2737` `"id": "outline-offset",`
- **Rótulo:** `manifest/properties.json:2738` `"labelKey": "property.outlineOffset"`
- **Comportamento esperado:** Escreve a declaração `outline-offset` (codec `length`, valueType `length`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de comprimento.

## REQ-4111 — color
- **Onde:** `manifest/properties.json:2753` `"id": "color",`
- **Rótulo:** `manifest/properties.json:2754` `"labelKey": "property.color"`
- **Comportamento esperado:** Escreve a declaração `color` (codec `color`, valueType `color`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de cor. Está entre as propriedades essenciais.

## REQ-4112 — font-family
- **Onde:** `manifest/properties.json:2770` `"id": "font-family",`
- **Rótulo:** `manifest/properties.json:2771` `"labelKey": "property.fontFamily"`
- **Comportamento esperado:** Escreve a declaração `font-family` (codec `font-family-list`, valueType `font-family-list`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de fontes. Os valores oferecidos pela lista são: system-ui, sans-serif, Arial, Helvetica, sans-serif, Verdana, Geneva, sans-serif, Tahoma, sans-serif, 'Trebuchet MS', sans-serif, Georgia, 'Times New Roman', serif, 'Times New Roman', Times, serif, 'Courier New', monospace, serif, sans-serif, monospace. Está entre as propriedades essenciais.

## REQ-4113 — font-size
- **Onde:** `manifest/properties.json:2806` `"id": "font-size",`
- **Rótulo:** `manifest/properties.json:2807` `"labelKey": "property.fontSize"`
- **Comportamento esperado:** Escreve a declaração `font-size` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de comprimento. Está entre as propriedades essenciais.

## REQ-4114 — font-weight
- **Onde:** `manifest/properties.json:2823` `"id": "font-weight",`
- **Rótulo:** `manifest/properties.json:2824` `"labelKey": "property.fontWeight"`
- **Comportamento esperado:** Escreve a declaração `font-weight` (codec `font-weight`, valueType `number`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: 100, 200, 300, 400, 500, 600, 700, 800, 900, normal, bold, lighter, bolder. Está entre as propriedades essenciais.

## REQ-4115 — font-style
- **Onde:** `manifest/properties.json:2861` `"id": "font-style",`
- **Rótulo:** `manifest/properties.json:2862` `"labelKey": "property.fontStyle"`
- **Comportamento esperado:** Escreve a declaração `font-style` (codec `font-style`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: normal, italic, oblique.

## REQ-4116 — line-height
- **Onde:** `manifest/properties.json:2888` `"id": "line-height",`
- **Rótulo:** `manifest/properties.json:2889` `"labelKey": "property.lineHeight"`
- **Comportamento esperado:** Escreve a declaração `line-height` (codec `line-height`, valueType `number`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de comprimento. Está entre as propriedades essenciais.

## REQ-4117 — letter-spacing
- **Onde:** `manifest/properties.json:2905` `"id": "letter-spacing",`
- **Rótulo:** `manifest/properties.json:2906` `"labelKey": "property.letterSpacing"`
- **Comportamento esperado:** Escreve a declaração `letter-spacing` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de comprimento.

## REQ-4118 — word-spacing
- **Onde:** `manifest/properties.json:2922` `"id": "word-spacing",`
- **Rótulo:** `manifest/properties.json:2923` `"labelKey": "property.wordSpacing"`
- **Comportamento esperado:** Escreve a declaração `word-spacing` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de comprimento.

## REQ-4119 — text-align
- **Onde:** `manifest/properties.json:2938` `"id": "text-align",`
- **Rótulo:** `manifest/properties.json:2939` `"labelKey": "property.textAlign"`
- **Comportamento esperado:** Escreve a declaração `text-align` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma fileira de botões de palavra-chave. Os valores oferecidos pela lista são: left, center, right, justify. Está entre as propriedades essenciais.

## REQ-4120 — text-decoration-line
- **Onde:** `manifest/properties.json:2974` `"id": "text-decoration-line",`
- **Rótulo:** `manifest/properties.json:2975` `"labelKey": "property.textDecorationLine"`
- **Comportamento esperado:** Escreve a declaração `text-decoration-line` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4121 — text-decoration-thickness
- **Onde:** `manifest/properties.json:2990` `"id": "text-decoration-thickness",`
- **Rótulo:** `manifest/properties.json:2991` `"labelKey": "property.textDecorationThickness"`
- **Comportamento esperado:** Escreve a declaração `text-decoration-thickness` (codec `length-percentage`, valueType `length-percentage`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4122 — text-decoration-style
- **Onde:** `manifest/properties.json:3006` `"id": "text-decoration-style",`
- **Rótulo:** `manifest/properties.json:3007` `"labelKey": "property.textDecorationStyle"`
- **Comportamento esperado:** Escreve a declaração `text-decoration-style` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4123 — text-decoration-color
- **Onde:** `manifest/properties.json:3022` `"id": "text-decoration-color",`
- **Rótulo:** `manifest/properties.json:3023` `"labelKey": "property.textDecorationColor"`
- **Comportamento esperado:** Escreve a declaração `text-decoration-color` (codec `color`, valueType `color`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4124 — text-transform
- **Onde:** `manifest/properties.json:3038` `"id": "text-transform",`
- **Rótulo:** `manifest/properties.json:3039` `"labelKey": "property.textTransform"`
- **Comportamento esperado:** Escreve a declaração `text-transform` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4125 — text-indent
- **Onde:** `manifest/properties.json:3054` `"id": "text-indent",`
- **Rótulo:** `manifest/properties.json:3055` `"labelKey": "property.textIndent"`
- **Comportamento esperado:** Escreve a declaração `text-indent` (codec `text-indent`, valueType `length-percentage`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de comprimento.

## REQ-4126 — text-overflow
- **Onde:** `manifest/properties.json:3070` `"id": "text-overflow",`
- **Rótulo:** `manifest/properties.json:3071` `"labelKey": "property.textOverflow"`
- **Comportamento esperado:** Escreve a declaração `text-overflow` (codec `keyword`, valueType `keyword`). Aplica-se a uma caixa que recorta. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4127 — white-space-collapse
- **Onde:** `manifest/properties.json:3086` `"id": "white-space-collapse",`
- **Rótulo:** `manifest/properties.json:3087` `"labelKey": "property.whiteSpaceCollapse"`
- **Comportamento esperado:** Escreve a declaração `white-space-collapse` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4128 — text-wrap-mode
- **Onde:** `manifest/properties.json:3102` `"id": "text-wrap-mode",`
- **Rótulo:** `manifest/properties.json:3103` `"labelKey": "property.textWrapMode"`
- **Comportamento esperado:** Escreve a declaração `text-wrap-mode` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4129 — word-break
- **Onde:** `manifest/properties.json:3118` `"id": "word-break",`
- **Rótulo:** `manifest/properties.json:3119` `"labelKey": "property.wordBreak"`
- **Comportamento esperado:** Escreve a declaração `word-break` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4130 — vertical-align
- **Onde:** `manifest/properties.json:3134` `"id": "vertical-align",`
- **Rótulo:** `manifest/properties.json:3135` `"labelKey": "property.verticalAlign"`
- **Comportamento esperado:** Escreve a declaração `vertical-align` (codec `vertical-align`, valueType `length-percentage`). Aplica-se a um elemento em linha ou a uma célula. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: baseline, top, middle, bottom, sub, super, text-top, text-bottom.

## REQ-4131 — font-stretch
- **Onde:** `manifest/properties.json:3166` `"id": "font-stretch",`
- **Rótulo:** `manifest/properties.json:3167` `"labelKey": "property.fontStretch"`
- **Comportamento esperado:** Escreve a declaração `font-stretch` (codec `font-stretch`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4132 — font-variant-ligatures
- **Onde:** `manifest/properties.json:3182` `"id": "font-variant-ligatures",`
- **Rótulo:** `manifest/properties.json:3183` `"labelKey": "property.fontVariantLigatures"`
- **Comportamento esperado:** Escreve a declaração `font-variant-ligatures` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4133 — font-variant-caps
- **Onde:** `manifest/properties.json:3198` `"id": "font-variant-caps",`
- **Rótulo:** `manifest/properties.json:3199` `"labelKey": "property.fontVariantCaps"`
- **Comportamento esperado:** Escreve a declaração `font-variant-caps` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4134 — font-variant-alternates
- **Onde:** `manifest/properties.json:3214` `"id": "font-variant-alternates",`
- **Rótulo:** `manifest/properties.json:3215` `"labelKey": "property.fontVariantAlternates"`
- **Comportamento esperado:** Escreve a declaração `font-variant-alternates` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4135 — font-variant-numeric
- **Onde:** `manifest/properties.json:3230` `"id": "font-variant-numeric",`
- **Rótulo:** `manifest/properties.json:3231` `"labelKey": "property.fontVariantNumeric"`
- **Comportamento esperado:** Escreve a declaração `font-variant-numeric` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4136 — font-variant-east-asian
- **Onde:** `manifest/properties.json:3246` `"id": "font-variant-east-asian",`
- **Rótulo:** `manifest/properties.json:3247` `"labelKey": "property.fontVariantEastAsian"`
- **Comportamento esperado:** Escreve a declaração `font-variant-east-asian` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4137 — font-variant-position
- **Onde:** `manifest/properties.json:3262` `"id": "font-variant-position",`
- **Rótulo:** `manifest/properties.json:3263` `"labelKey": "property.fontVariantPosition"`
- **Comportamento esperado:** Escreve a declaração `font-variant-position` (codec `keyword-set`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4138 — font-feature-settings
- **Onde:** `manifest/properties.json:3278` `"id": "font-feature-settings",`
- **Rótulo:** `manifest/properties.json:3279` `"labelKey": "property.fontFeatureSettings"`
- **Comportamento esperado:** Escreve a declaração `font-feature-settings` (codec `feature-tag-list`, valueType `string`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo de texto.

## REQ-4139 — overflow-wrap
- **Onde:** `manifest/properties.json:3294` `"id": "overflow-wrap",`
- **Rótulo:** `manifest/properties.json:3295` `"labelKey": "property.overflowWrap"`
- **Comportamento esperado:** Escreve a declaração `overflow-wrap` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4140 — hyphens
- **Onde:** `manifest/properties.json:3310` `"id": "hyphens",`
- **Rótulo:** `manifest/properties.json:3311` `"labelKey": "property.hyphens"`
- **Comportamento esperado:** Escreve a declaração `hyphens` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4141 — direction
- **Onde:** `manifest/properties.json:3326` `"id": "direction",`
- **Rótulo:** `manifest/properties.json:3327` `"labelKey": "property.direction"`
- **Comportamento esperado:** Escreve a declaração `direction` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4142 — writing-mode
- **Onde:** `manifest/properties.json:3342` `"id": "writing-mode",`
- **Rótulo:** `manifest/properties.json:3343` `"labelKey": "property.writingMode"`
- **Comportamento esperado:** Escreve a declaração `writing-mode` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4143 — text-orientation
- **Onde:** `manifest/properties.json:3358` `"id": "text-orientation",`
- **Rótulo:** `manifest/properties.json:3359` `"labelKey": "property.textOrientation"`
- **Comportamento esperado:** Escreve a declaração `text-orientation` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4144 — list-style-type
- **Onde:** `manifest/properties.json:3374` `"id": "list-style-type",`
- **Rótulo:** `manifest/properties.json:3375` `"labelKey": "property.listStyleType"`
- **Comportamento esperado:** Escreve a declaração `list-style-type` (codec `counter-style`, valueType `keyword`). Aplica-se a uma lista. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: none, disc, circle, square, decimal, lower-alpha, upper-alpha, lower-roman, upper-roman.

## REQ-4145 — list-style-position
- **Onde:** `manifest/properties.json:3407` `"id": "list-style-position",`
- **Rótulo:** `manifest/properties.json:3408` `"labelKey": "property.listStylePosition"`
- **Comportamento esperado:** Escreve a declaração `list-style-position` (codec `keyword`, valueType `keyword`). Aplica-se a uma lista. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4146 — list-style-image
- **Onde:** `manifest/properties.json:3423` `"id": "list-style-image",`
- **Rótulo:** `manifest/properties.json:3424` `"labelKey": "property.listStyleImage"`
- **Comportamento esperado:** Escreve a declaração `list-style-image` (codec `image`, valueType `image`). Aplica-se a uma lista. No inspetor a pessoa vê um campo de imagem.

## REQ-4147 — accent-color
- **Onde:** `manifest/properties.json:3439` `"id": "accent-color",`
- **Rótulo:** `manifest/properties.json:3440` `"labelKey": "property.accentColor"`
- **Comportamento esperado:** Escreve a declaração `accent-color` (codec `color`, valueType `color`). Aplica-se a um controle de formulário. No inspetor a pessoa vê um campo de cor.

## REQ-4148 — caret-color
- **Onde:** `manifest/properties.json:3455` `"id": "caret-color",`
- **Rótulo:** `manifest/properties.json:3456` `"labelKey": "property.caretColor"`
- **Comportamento esperado:** Escreve a declaração `caret-color` (codec `color`, valueType `color`). Aplica-se a um campo de texto. No inspetor a pessoa vê um campo de cor.

## REQ-4149 — appearance
- **Onde:** `manifest/properties.json:3471` `"id": "appearance",`
- **Rótulo:** `manifest/properties.json:3472` `"labelKey": "property.appearance"`
- **Comportamento esperado:** Escreve a declaração `appearance` (codec `keyword`, valueType `keyword`). Aplica-se a um controle de formulário. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4150 — opacity
- **Onde:** `manifest/properties.json:3487` `"id": "opacity",`
- **Rótulo:** `manifest/properties.json:3488` `"labelKey": "property.opacity"`
- **Comportamento esperado:** Escreve a declaração `opacity` (codec `alpha`, valueType `number`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um controle deslizante. Há valores prontos: faint, half, most, full. Está entre as propriedades essenciais.

## REQ-4151 — visibility
- **Onde:** `manifest/properties.json:3526` `"id": "visibility",`
- **Rótulo:** `manifest/properties.json:3527` `"labelKey": "property.visibility"`
- **Comportamento esperado:** Escreve a declaração `visibility` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4152 — mix-blend-mode
- **Onde:** `manifest/properties.json:3542` `"id": "mix-blend-mode",`
- **Rótulo:** `manifest/properties.json:3543` `"labelKey": "property.mixBlendMode"`
- **Comportamento esperado:** Escreve a declaração `mix-blend-mode` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4153 — isolation
- **Onde:** `manifest/properties.json:3558` `"id": "isolation",`
- **Rótulo:** `manifest/properties.json:3559` `"labelKey": "property.isolation"`
- **Comportamento esperado:** Escreve a declaração `isolation` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4154 — cursor
- **Onde:** `manifest/properties.json:3574` `"id": "cursor",`
- **Rótulo:** `manifest/properties.json:3575` `"labelKey": "property.cursor"`
- **Comportamento esperado:** Escreve a declaração `cursor` (codec `cursor`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4155 — pointer-events
- **Onde:** `manifest/properties.json:3590` `"id": "pointer-events",`
- **Rótulo:** `manifest/properties.json:3591` `"labelKey": "property.pointerEvents"`
- **Comportamento esperado:** Escreve a declaração `pointer-events` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4156 — will-change
- **Onde:** `manifest/properties.json:3606` `"id": "will-change",`
- **Rótulo:** `manifest/properties.json:3607` `"labelKey": "property.willChange"`
- **Comportamento esperado:** Escreve a declaração `will-change` (codec `animateable-feature-list`, valueType `keyword`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de texto. Os valores oferecidos pela lista são: auto, scroll-position, contents, transform, opacity.

## REQ-4157 — box-shadow
- **Onde:** `manifest/properties.json:3635` `"id": "box-shadow",`
- **Rótulo:** `manifest/properties.json:3636` `"labelKey": "property.boxShadow"`
- **Comportamento esperado:** Escreve a declaração `box-shadow` (codec `shadow-list`, valueType `shadow-list`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de sombras. Há valores prontos: soft, medium, strong, inner. Está entre as propriedades essenciais.

## REQ-4158 — text-shadow
- **Onde:** `manifest/properties.json:3690` `"id": "text-shadow",`
- **Rótulo:** `manifest/properties.json:3691` `"labelKey": "property.textShadow"`
- **Comportamento esperado:** Escreve a declaração `text-shadow` (codec `text-shadow-list`, valueType `text-shadow-list`). Aplica-se a um elemento de texto. No inspetor a pessoa vê um editor de sombras.

## REQ-4159 — filter
- **Onde:** `manifest/properties.json:3722` `"id": "filter",`
- **Rótulo:** `manifest/properties.json:3723` `"labelKey": "property.filter"`
- **Comportamento esperado:** Escreve a declaração `filter` (codec `filter-list`, valueType `string`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um editor de filtros. Há valores prontos: soft, blur, strong, grey.

## REQ-4160 — backdrop-filter
- **Onde:** `manifest/properties.json:3769` `"id": "backdrop-filter",`
- **Rótulo:** `manifest/properties.json:3770` `"labelKey": "property.backdropFilter"`
- **Comportamento esperado:** Escreve a declaração `backdrop-filter` (codec `filter-list`, valueType `string`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de texto.

## REQ-4161 — clip-path
- **Onde:** `manifest/properties.json:3785` `"id": "clip-path",`
- **Rótulo:** `manifest/properties.json:3786` `"labelKey": "property.clipPath"`
- **Comportamento esperado:** Escreve a declaração `clip-path` (codec `clip-path`, valueType `string`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de texto.

## REQ-4162 — mask-image
- **Onde:** `manifest/properties.json:3801` `"id": "mask-image",`
- **Rótulo:** `manifest/properties.json:3802` `"labelKey": "property.maskImage"`
- **Comportamento esperado:** Escreve a declaração `mask-image` (codec `image-layers`, valueType `image`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de imagem.

## REQ-4163 — transform
- **Onde:** `manifest/properties.json:3817` `"id": "transform",`
- **Rótulo:** `manifest/properties.json:3818` `"labelKey": "property.transform"`
- **Comportamento esperado:** Escreve a declaração `transform` (codec `transform-list`, valueType `transform-list`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê campos de transformação.

## REQ-4164 — transform-origin
- **Onde:** `manifest/properties.json:3836` `"id": "transform-origin",`
- **Rótulo:** `manifest/properties.json:3837` `"labelKey": "property.transformOrigin"`
- **Comportamento esperado:** Escreve a declaração `transform-origin` (codec `position`, valueType `length-percentage`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de texto. Os valores oferecidos pela lista são: center, top, bottom, left, right, top left, top right, bottom left, bottom right.

## REQ-4165 — perspective
- **Onde:** `manifest/properties.json:3869` `"id": "perspective",`
- **Rótulo:** `manifest/properties.json:3870` `"labelKey": "property.perspective"`
- **Comportamento esperado:** Escreve a declaração `perspective` (codec `length`, valueType `length`). Aplica-se a um elemento com caixa gerada. No inspetor a pessoa vê um campo de comprimento.

## REQ-4166 — perspective-origin
- **Onde:** `manifest/properties.json:3885` `"id": "perspective-origin",`
- **Rótulo:** `manifest/properties.json:3886` `"labelKey": "property.perspectiveOrigin"`
- **Comportamento esperado:** Escreve a declaração `perspective-origin` (codec `position`, valueType `length-percentage`). Aplica-se a um contexto de perspectiva. No inspetor a pessoa vê um campo de texto.

## REQ-4167 — transform-style
- **Onde:** `manifest/properties.json:3901` `"id": "transform-style",`
- **Rótulo:** `manifest/properties.json:3902` `"labelKey": "property.transformStyle"`
- **Comportamento esperado:** Escreve a declaração `transform-style` (codec `keyword`, valueType `keyword`). Aplica-se a um contexto de perspectiva. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4168 — backface-visibility
- **Onde:** `manifest/properties.json:3917` `"id": "backface-visibility",`
- **Rótulo:** `manifest/properties.json:3918` `"labelKey": "property.backfaceVisibility"`
- **Comportamento esperado:** Escreve a declaração `backface-visibility` (codec `keyword`, valueType `keyword`). Aplica-se a um contexto de perspectiva. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4169 — transform-box
- **Onde:** `manifest/properties.json:3933` `"id": "transform-box",`
- **Rótulo:** `manifest/properties.json:3934` `"labelKey": "property.transformBox"`
- **Comportamento esperado:** Escreve a declaração `transform-box` (codec `keyword`, valueType `keyword`). Aplica-se a um elemento transformado. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4170 — animation-duration
- **Onde:** `manifest/properties.json:3949` `"id": "animation-duration",`
- **Rótulo:** `manifest/properties.json:3950` `"labelKey": "property.animationDuration"`
- **Comportamento esperado:** Escreve a declaração `animation-duration` (codec `time-list`, valueType `time`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de comprimento.

## REQ-4171 — animation-delay
- **Onde:** `manifest/properties.json:3965` `"id": "animation-delay",`
- **Rótulo:** `manifest/properties.json:3966` `"labelKey": "property.animationDelay"`
- **Comportamento esperado:** Escreve a declaração `animation-delay` (codec `time-list`, valueType `time`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo de comprimento.

## REQ-4172 — animation-iteration-count
- **Onde:** `manifest/properties.json:3981` `"id": "animation-iteration-count",`
- **Rótulo:** `manifest/properties.json:3982` `"labelKey": "property.animationIterationCount"`
- **Comportamento esperado:** Escreve a declaração `animation-iteration-count` (codec `integer`, valueType `number`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um campo numérico.

## REQ-4173 — animation-direction
- **Onde:** `manifest/properties.json:3997` `"id": "animation-direction",`
- **Rótulo:** `manifest/properties.json:3998` `"labelKey": "property.animationDirection"`
- **Comportamento esperado:** Escreve a declaração `animation-direction` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4174 — animation-fill-mode
- **Onde:** `manifest/properties.json:4013` `"id": "animation-fill-mode",`
- **Rótulo:** `manifest/properties.json:4014` `"labelKey": "property.animationFillMode"`
- **Comportamento esperado:** Escreve a declaração `animation-fill-mode` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4175 — animation-timing-function
- **Onde:** `manifest/properties.json:4029` `"id": "animation-timing-function",`
- **Rótulo:** `manifest/properties.json:4030` `"labelKey": "property.animationTimingFunction"`
- **Comportamento esperado:** Escreve a declaração `animation-timing-function` (codec `easing-list`, valueType `string`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4176 — animation-play-state
- **Onde:** `manifest/properties.json:4046` `"id": "animation-play-state",`
- **Rótulo:** `manifest/properties.json:4047` `"labelKey": "property.animationPlayState"`
- **Comportamento esperado:** Escreve a declaração `animation-play-state` (codec `keyword`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4177 — transition-property
- **Onde:** `manifest/properties.json:4062` `"id": "transition-property",`
- **Rótulo:** `manifest/properties.json:4063` `"labelKey": "property.transitionProperty"`
- **Comportamento esperado:** Escreve a declaração `transition-property` (codec `property-list`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4178 — transition-duration
- **Onde:** `manifest/properties.json:4078` `"id": "transition-duration",`
- **Rótulo:** `manifest/properties.json:4079` `"labelKey": "property.transitionDuration"`
- **Comportamento esperado:** Escreve a declaração `transition-duration` (codec `time-list`, valueType `time`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4179 — transition-timing-function
- **Onde:** `manifest/properties.json:4094` `"id": "transition-timing-function",`
- **Rótulo:** `manifest/properties.json:4095` `"labelKey": "property.transitionTimingFunction"`
- **Comportamento esperado:** Escreve a declaração `transition-timing-function` (codec `easing-list`, valueType `string`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4180 — transition-delay
- **Onde:** `manifest/properties.json:4110` `"id": "transition-delay",`
- **Rótulo:** `manifest/properties.json:4111` `"labelKey": "property.transitionDelay"`
- **Comportamento esperado:** Escreve a declaração `transition-delay` (codec `time-list`, valueType `time`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4181 — transition-behavior
- **Onde:** `manifest/properties.json:4126` `"id": "transition-behavior",`
- **Rótulo:** `manifest/properties.json:4127` `"labelKey": "property.transitionBehavior"`
- **Comportamento esperado:** Escreve a declaração `transition-behavior` (codec `keyword-list`, valueType `keyword`). Aplica-se a qualquer elemento. No inspetor a pessoa vê uma parte de uma propriedade longa, editada junto do seu grupo.

## REQ-4182 — gap
- **Onde:** `manifest/properties.json:4144` `"id": "gap",`
- **Comportamento esperado:** É a propriedade longa `gap` (codec `axis-pair`), que agrupa e lê as longas row-gap, column-gap. No inspetor a pessoa vê um campo de comprimento. Os valores oferecidos pela lista são: normal. Está entre as propriedades essenciais.

## REQ-4183 — overflow
- **Onde:** `manifest/properties.json:4173` `"id": "overflow",`
- **Comportamento esperado:** É a propriedade longa `overflow` (codec `axis-pair`), que agrupa e lê as longas overflow-x, overflow-y. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4184 — columns
- **Onde:** `manifest/properties.json:4192` `"id": "columns",`
- **Comportamento esperado:** É a propriedade longa `columns` (codec `columns`), que agrupa e lê as longas column-width, column-count. Deixa de fora a longa column-height (que apenas o Chrome implementa). No inspetor a pessoa vê um campo de texto.

## REQ-4185 — grid-column
- **Onde:** `manifest/properties.json:4216` `"id": "grid-column",`
- **Comportamento esperado:** É a propriedade longa `grid-column` (codec `grid-line-pair`), que agrupa e lê as longas grid-column-start, grid-column-end. No inspetor a pessoa vê um campo de texto.

## REQ-4186 — grid-row
- **Onde:** `manifest/properties.json:4235` `"id": "grid-row",`
- **Comportamento esperado:** É a propriedade longa `grid-row` (codec `grid-line-pair`), que agrupa e lê as longas grid-row-start, grid-row-end. No inspetor a pessoa vê um campo de texto.

## REQ-4187 — grid-area
- **Onde:** `manifest/properties.json:4254` `"id": "grid-area",`
- **Comportamento esperado:** É a propriedade longa `grid-area` (codec `grid-area`), que agrupa e lê as longas grid-row-start, grid-column-start, grid-row-end, grid-column-end. No inspetor a pessoa vê um campo de texto.

## REQ-4188 — padding
- **Onde:** `manifest/properties.json:4275` `"id": "padding",`
- **Comportamento esperado:** É a propriedade longa `padding` (codec `box-sides`), que agrupa e lê as longas padding-top, padding-right, padding-bottom, padding-left. No inspetor a pessoa vê um editor de caixa (box model).

## REQ-4189 — margin
- **Onde:** `manifest/properties.json:4296` `"id": "margin",`
- **Comportamento esperado:** É a propriedade longa `margin` (codec `box-sides`), que agrupa e lê as longas margin-top, margin-right, margin-bottom, margin-left. No inspetor a pessoa vê um editor de caixa (box model).

## REQ-4190 — inset
- **Onde:** `manifest/properties.json:4317` `"id": "inset",`
- **Comportamento esperado:** É a propriedade longa `inset` (codec `box-sides`), que agrupa e lê as longas top, right, bottom, left. No inspetor a pessoa vê um campo de comprimento.

## REQ-4191 — border
- **Onde:** `manifest/properties.json:4336` `"id": "border",`
- **Comportamento esperado:** É a propriedade longa `border` (codec `border`), que agrupa e lê as longas border-top-width, border-right-width, border-bottom-width, border-left-width, border-top-style, border-right-style, border-bottom-style, border-left-style, border-top-color, border-right-color, border-bottom-color, border-left-color. No inspetor a pessoa vê um editor de bordas. Está entre as propriedades essenciais.

## REQ-4192 — border-width
- **Onde:** `manifest/properties.json:4388` `"id": "border-width",`
- **Comportamento esperado:** É a propriedade longa `border-width` (codec `box-sides`), que agrupa e lê as longas border-top-width, border-right-width, border-bottom-width, border-left-width. No inspetor a pessoa vê um editor de bordas.

## REQ-4193 — border-style
- **Onde:** `manifest/properties.json:4409` `"id": "border-style",`
- **Comportamento esperado:** É a propriedade longa `border-style` (codec `box-sides`), que agrupa e lê as longas border-top-style, border-right-style, border-bottom-style, border-left-style. No inspetor a pessoa vê um editor de bordas.

## REQ-4194 — border-color
- **Onde:** `manifest/properties.json:4430` `"id": "border-color",`
- **Comportamento esperado:** É a propriedade longa `border-color` (codec `box-sides`), que agrupa e lê as longas border-top-color, border-right-color, border-bottom-color, border-left-color. No inspetor a pessoa vê um editor de bordas. Está entre as propriedades essenciais.

## REQ-4195 — border-top
- **Onde:** `manifest/properties.json:4451` `"id": "border-top",`
- **Comportamento esperado:** É a propriedade longa `border-top` (codec `border-side`), que agrupa e lê as longas border-top-width, border-top-style, border-top-color. No inspetor a pessoa vê um editor de bordas.

## REQ-4196 — border-right
- **Onde:** `manifest/properties.json:4471` `"id": "border-right",`
- **Comportamento esperado:** É a propriedade longa `border-right` (codec `border-side`), que agrupa e lê as longas border-right-width, border-right-style, border-right-color. No inspetor a pessoa vê um editor de bordas.

## REQ-4197 — border-bottom
- **Onde:** `manifest/properties.json:4491` `"id": "border-bottom",`
- **Comportamento esperado:** É a propriedade longa `border-bottom` (codec `border-side`), que agrupa e lê as longas border-bottom-width, border-bottom-style, border-bottom-color. No inspetor a pessoa vê um editor de bordas.

## REQ-4198 — border-left
- **Onde:** `manifest/properties.json:4511` `"id": "border-left",`
- **Comportamento esperado:** É a propriedade longa `border-left` (codec `border-side`), que agrupa e lê as longas border-left-width, border-left-style, border-left-color. No inspetor a pessoa vê um editor de bordas.

## REQ-4199 — border-radius
- **Onde:** `manifest/properties.json:4531` `"id": "border-radius",`
- **Comportamento esperado:** É a propriedade longa `border-radius` (codec `box-corners`), que agrupa e lê as longas border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius. No inspetor a pessoa vê um editor de raios. Está entre as propriedades essenciais.

## REQ-4200 — outline
- **Onde:** `manifest/properties.json:4580` `"id": "outline",`
- **Comportamento esperado:** É a propriedade longa `outline` (codec `border-side`), que agrupa e lê as longas outline-width, outline-style, outline-color. No inspetor a pessoa vê um campo de texto.

## REQ-4201 — text-decoration
- **Onde:** `manifest/properties.json:4600` `"id": "text-decoration",`
- **Comportamento esperado:** É a propriedade longa `text-decoration` (codec `text-decoration`), que agrupa e lê as longas text-decoration-line, text-decoration-thickness, text-decoration-style, text-decoration-color. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: none, underline, overline, line-through, underline dotted.

## REQ-4202 — white-space
- **Onde:** `manifest/properties.json:4634` `"id": "white-space",`
- **Comportamento esperado:** É a propriedade longa `white-space` (codec `white-space`), que agrupa e lê as longas white-space-collapse, text-wrap-mode. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4203 — font-variant
- **Onde:** `manifest/properties.json:4653` `"id": "font-variant",`
- **Comportamento esperado:** É a propriedade longa `font-variant` (codec `font-variant`), que agrupa e lê as longas font-variant-ligatures, font-variant-caps, font-variant-alternates, font-variant-numeric, font-variant-east-asian, font-variant-position. Deixa de fora a longa font-variant-emoji (que o Safari implementa apenas em versão de prévia). No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: normal, small-caps, all-small-caps, tabular-nums, oldstyle-nums.

## REQ-4204 — background-position
- **Onde:** `manifest/properties.json:4694` `"id": "background-position",`
- **Comportamento esperado:** É a propriedade longa `background-position` (codec `position`), que agrupa e lê as longas background-position-x, background-position-y. No inspetor a pessoa vê um menu de palavras-chave. Os valores oferecidos pela lista são: center, top, bottom, left, right, top left, top right, bottom left, bottom right.

## REQ-4205 — background
- **Onde:** `manifest/properties.json:4730` `"id": "background",`
- **Comportamento esperado:** É a propriedade longa `background` (codec `background-layers`), que agrupa e lê as longas background-image, background-position-x, background-position-y, background-size, background-repeat, background-attachment, background-origin, background-clip. Deixa de fora a longa background-color (porque uma edição de camada nunca toca a cor sob as camadas). No inspetor a pessoa vê um editor de gradiente.

## REQ-4206 — transition
- **Onde:** `manifest/properties.json:4761` `"id": "transition",`
- **Comportamento esperado:** É a propriedade longa `transition` (codec `transition-list`), que agrupa e lê as longas transition-property, transition-duration, transition-timing-function, transition-delay, transition-behavior. No inspetor a pessoa vê um campo de texto. Os valores oferecidos pela lista são: all 200ms ease, all 300ms ease-in-out, opacity 200ms ease, transform 300ms ease, background-color 150ms linear.

## REQ-4207 — alignment-matrix
- **Onde:** `manifest/properties.json:4796` `"id": "alignment-matrix",`
- **Comportamento esperado:** Não tem forma abreviada própria; agrupa e lê as longas justify-content, align-items (codec `alignment-matrix`). No inspetor a pessoa vê uma matriz de alinhamento.

## REQ-4208 — line-clamp
- **Onde:** `manifest/properties.json:4817` `"id": "line-clamp",`
- **Comportamento esperado:** Escreve as declarações display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp com o valor do campo; overflow-x: hidden; overflow-y: hidden. Aplica-se a um elemento de texto. No inspetor a pessoa vê um campo numérico. As declarações são compartilhadas com o documento: ao limpar, cada uma volta ao valor anterior, e escrever outra propriedade do mesmo conjunto apaga a receita.

## REQ-4209 — user-select
- **Onde:** `manifest/properties.json:4859` `"id": "user-select",`
- **Comportamento esperado:** Escreve as declarações -webkit-user-select com o valor do campo; user-select com o valor do campo. Aplica-se a qualquer elemento. No inspetor a pessoa vê um menu de palavras-chave.

## REQ-4210 — base
- **Onde:** `manifest/properties.json:286` `"id": "base",`
- **Comportamento esperado:** É o estado base: não usa pseudo-classe e vale para qualquer elemento; é a aba em que se editam as regras sem estado.

## REQ-4211 — hover
- **Onde:** `manifest/properties.json:292` `"id": "hover",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe :hover.

## REQ-4212 — focus
- **Onde:** `manifest/properties.json:298` `"id": "focus",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe :focus.

## REQ-4213 — focus-visible
- **Onde:** `manifest/properties.json:304` `"id": "focus-visible",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe :focus-visible.

## REQ-4214 — active
- **Onde:** `manifest/properties.json:310` `"id": "active",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe :active.

## REQ-4215 — visited
- **Onde:** `manifest/properties.json:316` `"id": "visited",`
- **Comportamento esperado:** Fica sobre link e aparece com a pseudo-classe :visited.

## REQ-4216 — disabled
- **Onde:** `manifest/properties.json:324` `"id": "disabled",`
- **Comportamento esperado:** Fica sobre input, textarea, select, button, optionGroup, option, fieldset e aparece com a pseudo-classe :disabled.

## REQ-4217 — invalid
- **Onde:** `manifest/properties.json:338` `"id": "invalid",`
- **Comportamento esperado:** Fica sobre input, textarea, select e aparece com a pseudo-classe :invalid.

## REQ-4218 — placeholder-shown
- **Onde:** `manifest/properties.json:348` `"id": "placeholder-shown",`
- **Comportamento esperado:** Fica sobre input, textarea e aparece com a pseudo-classe :placeholder-shown.

## REQ-4219 — first-child
- **Onde:** `manifest/properties.json:357` `"id": "first-child",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe :first-child.

## REQ-4220 — last-child
- **Onde:** `manifest/properties.json:363` `"id": "last-child",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe :last-child.

## REQ-4221 — before
- **Onde:** `manifest/properties.json:369` `"id": "before",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe ::before.

## REQ-4222 — after
- **Onde:** `manifest/properties.json:375` `"id": "after",`
- **Comportamento esperado:** Fica sobre qualquer elemento e aparece com a pseudo-classe ::after.

## REQ-4223 — user-invalid
- **Onde:** `manifest/properties.json:381` `"id": "user-invalid",`
- **Comportamento esperado:** Fica sobre input, textarea, select e aparece com a pseudo-classe :user-invalid.

## REQ-4224 — user-valid
- **Onde:** `manifest/properties.json:391` `"id": "user-valid",`
- **Comportamento esperado:** Fica sobre input, textarea, select e aparece com a pseudo-classe :user-valid.

## REQ-2101 — selection.select (Selecionar)
- **Onde:** `manifest/commands/selection.json:5` `"id": "selection.select",`
- **Tratador:** `src/app/commands.ts:353` `'selection.select': selectCommand,`
- **Feature:** `src/app/features.ts:18` `'select-click': registerFeature('select-click'),`
- **Comportamento esperado:** Um clique no canvas faz do elemento clicado a seleção, sozinho, e a barra de status o nomeia; o rótulo da interface é "Selecionar" (`src/i18n/locales/pt-BR.json:440` `"command.select": "Selecionar",`). O tratador recebe o nó do alvo e devolve a seleção com esse nó e a mensagem `status.selected` (`src/core/selection/selection.ts:34` `return { kind: 'change', selection: [target], message: message('status.selected', { name: found.node.name }) };`); a disponibilidade é `always` (`manifest/commands/selection.json:17` `"predicate": "always",`). Clicar dentro do espaçamento de um contêiner seleciona o contêiner, e clicar na página vazia seleciona a raiz da página (`manifest/features/02-structure-editing.json:1098` `"Clicking the Section's padding selects the Section, not a child; clicking empty page area selects the Page root.",`). O cenário `click-selects-the-element` espera a seleção `/Page/Hero/Intro` com o aviso `status.selected` nome `Intro` (`manifest/features/02-structure-editing.json:1105` `"id": "click-selects-the-element",` `manifest/features/02-structure-editing.json:1147` `"key": "status.selected",`), e o cenário `click-on-empty-page-selects-the-page` espera `/Page` (`manifest/features/02-structure-editing.json:1217` `"id": "click-on-empty-page-selects-the-page",`). A seleção vive na store ao lado do documento, nunca dentro dele, e selecionar não grava histórico (`src/core/selection/selection.ts:2` `// store beside the document, never in it: selecting changes no document and records no history, and undo and redo`; `manifest/commands/selection.json:23` `"undoable": false`). Um nó que o documento não tem faz o tratador lançar erro, defeito da porta (`src/core/selection/selection.ts:33` `if (!found) throw new Error(`). Pelas regras do editor: G6 — canvas e Camadas apenas derivam da seleção da store; G7 — o canvas desenha o contorno medido e o rótulo com tag e nome (`manifest/features/02-structure-editing.json:1097` `"After each click the document selection is the clicked element; a selection outline matches the element's measured bounding box on the canvas and a label shows its tag and name.",`); G2 — mudar a seleção é uma das entradas que grava antes a digitação pendente; G3 — cada porta envia só o nó do alvo.

## REQ-2102 — selection.clear (Limpar a seleção)
- **Onde:** `manifest/commands/selection.json:198` `"id": "selection.clear",`
- **Tratador:** `src/app/commands.ts:354` `'selection.clear': clearSelectionCommand,`
- **Feature:** `src/app/features.ts:18` `'select-click': registerFeature('select-click'),`
- **Recusa declarada:** `manifest/commands/selection.json:205` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Escape no canvas ou um clique na área do palco fora da página esvaziam a seleção; o rótulo da interface é "Limpar a seleção" (`src/i18n/locales/pt-BR.json:297` `"command.clearSelection": "Limpar a seleção",`). O tratador devolve a seleção vazia com a mensagem `status.selection.cleared` (`src/core/selection/selection.ts:38` `export const clearSelectionCommand = registerHandler('selection.clear', () => ({ kind: 'change', selection: [], message: message('status.selection.cleared') }));`), "Nada selecionado." (`src/i18n/locales/pt-BR.json:1931` `"status.selection.cleared": "Nada selecionado.",`); o cenário `escape-or-click-outside-the-page-clears` espera a seleção vazia e esse aviso (`manifest/features/02-structure-editing.json:1273` `"id": "escape-or-click-outside-the-page-clears",`). A disponibilidade é o predicado `hasSelection` (`manifest/commands/selection.json:204` `"predicate": "hasSelection",`), que exige algo selecionado (`src/core/selection/selection.ts:12` `export const hasSelection = registerPredicate('hasSelection', (state) => state.selection.length > 0);`). Sem nada selecionado a porta é recusada com `refusal.nothingSelected` (`src/i18n/locales/pt-BR.json:1604` `"refusal.nothingSelected": "Selecione um elemento primeiro.",`) e o documento fica inalterado, no cenário `escape-with-nothing-selected-is-refused` (`manifest/features/02-structure-editing.json:1326` `"id": "escape-with-nothing-selected-is-refused",` `manifest/features/02-structure-editing.json:1364` `"key": "refusal.nothingSelected",`). Limpar não grava histórico nem muda o documento (`manifest/commands/selection.json:210` `"undoable": false`). Pelas regras: G6 — canvas e Camadas passam a não mostrar seleção nenhuma, lido da store; G3 — todas as portas (Escape no canvas, clique fora da página, item do menu Editar e barra de comandos) enviam só a intenção, sem argumentos; G2 — a entrada que muda a seleção grava antes a digitação pendente.

## REQ-2103 — selection.add (Adicionar à seleção)
- **Onde:** `manifest/commands/selection.json:301` `"id": "selection.add",`
- **Tratador:** `src/app/commands.ts:355` `'selection.add': addCommand,`
- **Feature:** `src/app/features.ts:42` `'multi-select-click': registerFeature('multi-select-click'),`
- **Comportamento esperado:** Shift+clique num elemento do canvas acrescenta o nó à seleção depois dos que já estão nela; um nó já selecionado permanece onde está (`src/core/selection/selection.ts:173` `export const addCommand = registerHandler('selection.add', ({ state }, { target }) => {`). O rótulo da interface é "Adicionar à seleção" (`src/i18n/locales/pt-BR.json:442` `"command.selectionAdd": "Adicionar à seleção",`). A barra de status nomeia um nó, conta vários e diz quando nada resta (`src/core/selection/selection.ts:140` `function several(state: StoreState<never>, selection: StoreState<never>['selection']): Outcome<never> {`). O cenário `shift-click-adds-to-the-selection` parte de `/Page/Hero/Title` e depois do Shift+clique em `/Page/Hero/Intro` espera os dois e o aviso `status.selection.count` com `count` 2 (`manifest/features/02-structure-editing.json:14398` `"id": "shift-click-adds-to-the-selection",`); o cenário `shift-click-on-a-selected-element-keeps-it` repete o clique e mantém a seleção. Shift+clique numa linha de Camadas acrescenta do mesmo modo (`manifest/features/02-structure-editing.json:14392` `"Shift+click in Layers adds to the selection the same way.",`). Cada elemento selecionado tem contorno próprio e a linha dele em Camadas fica realçada (`manifest/features/02-structure-editing.json:14390` `"Shift+click adds to the selection and Ctrl+click toggles an element in or out; each selected element has its own outline and its Layers row is highlighted.",`). Nada muda no documento nem no histórico (`manifest/commands/selection.json:319` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — a porta envia só o nó do alvo; G2 — adicionar à seleção grava antes a digitação pendente.

- **Divergência:** O `intent` nomeia uma chave que o código não tem: `[canvas.label.selectionCount]` (`manifest/features/02-structure-editing.json:14391` `"The canvas label reads 'N elements' [canvas.label.selectionCount].",`); o rótulo do canvas para vários selecionados usa `canvas.selectedCount` (`src/editor/canvas/chrome.tsx:994` `{t('canvas.selectedCount', { count: selection.length })}`, "elementos selecionados" em `src/i18n/locales/pt-BR.json:190` `"canvas.selectedCount": "{count} elementos selecionados",`).

## REQ-2104 — selection.range (Selecionar as linhas entre)
- **Onde:** `manifest/commands/selection.json:347` `"id": "selection.range",`
- **Tratador:** `src/app/commands.ts:356` `'selection.range': rangeCommand,`
- **Feature:** `src/app/features.ts:42` `'multi-select-click': registerFeature('multi-select-click'),`
- **Comportamento esperado:** Shift+clique numa linha de Camadas seleciona, do nó selecionado por último até o clicado, todos os irmãos entre eles, na ordem que vai daquele nó ao clicado (`src/core/selection/selection.ts:156` `export const rangeCommand = registerHandler('selection.range', ({ state }, { target }) => {`). O rótulo da interface é "Selecionar as linhas entre" (`src/i18n/locales/pt-BR.json:3450` `"command.selectRange": "Selecionar as linhas entre",`). Linhas de pais diferentes não formam uma sequência: o nó clicado apenas entra na seleção, como no Shift+clique no canvas; sem nada selecionado ele é selecionado sozinho (`src/core/selection/selection.ts:162` `if (anchor === null || clicked === null || clicked.parent === null || anchor.parent?.id !== clicked.parent.id) {`). O cenário `shift-click-on-a-layers-row-selects-the-rows-between` espera `/Page/Hero/Title`, `/Page/Hero/Intro` e `/Page/Hero/Actions` com `count` 3 (`manifest/features/02-structure-editing.json:14637` `"id": "shift-click-on-a-layers-row-selects-the-rows-between",`); o cenário `shift-click-upwards-selects-the-rows-between-in-that-order` espera a mesma corrida na ordem inversa (`manifest/features/02-structure-editing.json:14697` `"id": "shift-click-upwards-selects-the-rows-between-in-that-order",`); e o cenário `shift-click-on-a-row-of-another-parent-adds-it` acrescenta só a linha clicada (`manifest/features/02-structure-editing.json:14757` `"id": "shift-click-on-a-row-of-another-parent-adds-it",`). Nada muda no documento nem no histórico (`manifest/commands/selection.json:365` `"undoable": false`). Pelas regras: G6 — a seleção resultante é a da store, mostrada por canvas e Camadas; G3 — a porta envia só o nó do alvo; G2 — mudar a seleção grava antes a digitação pendente.

- **Divergência:** O `intent` nomeia a chave `[canvas.label.selectionCount]` que o código não tem (`manifest/features/02-structure-editing.json:14391` `"The canvas label reads 'N elements' [canvas.label.selectionCount].",`); o rótulo do canvas para vários selecionados usa `canvas.selectedCount` (`src/editor/canvas/chrome.tsx:994` `{t('canvas.selectedCount', { count: selection.length })}`).

## REQ-2105 — selection.toggle (Adicionar ou remover da seleção)
- **Onde:** `manifest/commands/selection.json:397` `"id": "selection.toggle",`
- **Tratador:** `src/app/commands.ts:357` `'selection.toggle': toggleCommand,`
- **Feature:** `src/app/features.ts:42` `'multi-select-click': registerFeature('multi-select-click'),`
- **Comportamento esperado:** Ctrl+clique alterna o elemento na seleção: um nó selecionado sai dela, qualquer outro entra depois dos demais (`src/core/selection/selection.ts:180` `export const toggleCommand = registerHandler('selection.toggle', ({ state }, { target }) => {`). O rótulo da interface é "Adicionar ou remover da seleção" (`src/i18n/locales/pt-BR.json:443` `"command.selectionToggle": "Adicionar ou remover da seleção",`). As portas são o Ctrl+clique no canvas e o Ctrl+clique numa linha de Camadas (`manifest/commands/selection.json:419` `"id": "canvas-click-element-ctrl",` `manifest/commands/selection.json:441` `"id": "layers-row-ctrl",`). O cenário `ctrl-click-toggles-an-element-out` parte de `/Page/Hero/Title` e `/Page/Hero/Intro`, clica em `/Page/Hero/Intro` e espera só `/Page/Hero/Title` com o aviso `status.selected` nome `Title` (`manifest/features/02-structure-editing.json:14517` `"id": "ctrl-click-toggles-an-element-out",`); o cenário `ctrl-click-toggles-an-element-in` parte de `/Page/Hero/Title`, clica em `/Page/Hero/Actions` e espera os dois com `count` 2 (`manifest/features/02-structure-editing.json:14577` `"id": "ctrl-click-toggles-an-element-in",`). Nada muda no documento nem no histórico (`manifest/commands/selection.json:415` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — a porta envia só o nó do alvo; G2 — mudar a seleção grava antes a digitação pendente.

- **Divergência:** O `intent` nomeia a chave `[canvas.label.selectionCount]` que o código não tem (`manifest/features/02-structure-editing.json:14391` `"The canvas label reads 'N elements' [canvas.label.selectionCount].",`); o rótulo do canvas para vários selecionados usa `canvas.selectedCount` (`src/editor/canvas/chrome.tsx:994` `{t('canvas.selectedCount', { count: selection.length })}`).

## REQ-2106 — selection.walkNextSibling (Selecionar o próximo irmão)
- **Onde:** `manifest/commands/selection.json:469` `"id": "selection.walkNextSibling",`
- **Tratador:** `src/app/commands.ts:358` `'selection.walkNextSibling': walkNextSiblingCommand,`
- **Feature:** `src/app/features.ts:37` `'keyboard-tree-walk': registerFeature('keyboard-tree-walk'),`
- **Comportamento esperado:** Seta direita no canvas seleciona o próximo irmão do nó primário; o nó alcançado fica sozinho na seleção e a barra de status o nomeia (`src/core/selection/selection.ts:208` `export const walkNextSiblingCommand = registerHandler('selection.walkNextSibling', ({ state }) => {`; `src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`). O rótulo da interface é "Selecionar o próximo irmão" (`src/i18n/locales/pt-BR.json:518` `"command.walkNextSibling": "Selecionar o próximo irmão",`). No último filho a porta é recusada com `status.walk.noNext` (`manifest/commands/selection.json:479` `"status.walk.noNext"`), "Nenhum irmão seguinte em {parent}." (`src/i18n/locales/pt-BR.json:2019` `"status.walk.noNext": "Nenhum irmão seguinte em {parent}.",`), e a seleção fica como está, no cenário `arrow-right-on-the-last-child-is-refused` (`manifest/features/02-structure-editing.json:11851` `"id": "arrow-right-on-the-last-child-is-refused",`). Sem nada selecionado a caminhada começa pela raiz da página aberta (`src/core/selection/selection.ts:201` `function start(state: StoreState<never>): Outcome<never> {`), no cenário `an-arrow-with-nothing-selected-starts-at-the-page` (`manifest/features/02-structure-editing.json:11973` `"id": "an-arrow-with-nothing-selected-starts-at-the-page",`). A caminhada nunca muda o documento nem grava histórico (`manifest/features/02-structure-editing.json:11446` `"Walking never changes the document JSON."`; `manifest/commands/selection.json:483` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — a porta envia só a intenção; G2 — mudar a seleção grava antes a digitação pendente.

- **Divergência:** O `intent` cita a chave `[status.walk.sibling]` ao descrever o anúncio de cada passo (`manifest/features/02-structure-editing.json:11444` `"The status bar announces each move, e.g. 'Paragraph selected. Sibling 2 of 2.' [status.walk.sibling].",`); essa chave não existe no código nem nas mensagens. O passo que alcança um nó anuncia `status.selected` (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`, "Seleção: {name}." em `src/i18n/locales/pt-BR.json:1930` `"status.selected": "Seleção: {name}.",`), e nos fins vale a chave da recusa.

## REQ-2107 — selection.walkPreviousSibling (Selecionar o irmão anterior)
- **Onde:** `manifest/commands/selection.json:509` `"id": "selection.walkPreviousSibling",`
- **Tratador:** `src/app/commands.ts:359` `'selection.walkPreviousSibling': walkPreviousSiblingCommand,`
- **Feature:** `src/app/features.ts:37` `'keyboard-tree-walk': registerFeature('keyboard-tree-walk'),`
- **Comportamento esperado:** Seta esquerda no canvas seleciona o irmão anterior do nó primário; o nó alcançado fica sozinho na seleção e a barra de status o nomeia (`src/core/selection/selection.ts:217` `export const walkPreviousSiblingCommand = registerHandler('selection.walkPreviousSibling', ({ state }) => {`). O rótulo da interface é "Selecionar o irmão anterior" (`src/i18n/locales/pt-BR.json:520` `"command.walkPreviousSibling": "Selecionar o irmão anterior",`). No primeiro filho a porta é recusada com `status.walk.noPrevious` (`manifest/commands/selection.json:519` `"status.walk.noPrevious"`), "Nenhum irmão anterior em {parent}." (`src/i18n/locales/pt-BR.json:2020` `"status.walk.noPrevious": "Nenhum irmão anterior em {parent}.",`), e a seleção fica como está, no cenário `arrow-left-on-the-first-child-is-refused` (`manifest/features/02-structure-editing.json:11912` `"id": "arrow-left-on-the-first-child-is-refused",`). O cenário `arrow-left-selects-the-previous-sibling` parte de `/Page/Hero/Actions` e espera `/Page/Hero/Intro` (`manifest/features/02-structure-editing.json:11507` `"id": "arrow-left-selects-the-previous-sibling",`). Sem nada selecionado a caminhada começa pela raiz da página aberta (`src/core/selection/selection.ts:201` `function start(state: StoreState<never>): Outcome<never> {`). A caminhada nunca muda o documento nem grava histórico (`manifest/features/02-structure-editing.json:11446` `"Walking never changes the document JSON."`; `manifest/commands/selection.json:523` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — a porta envia só a intenção; G2 — mudar a seleção grava antes a digitação pendente.

- **Divergência:** O `intent` cita `[status.walk.sibling]` no anúncio de cada passo (`manifest/features/02-structure-editing.json:11444` `"The status bar announces each move, e.g. 'Paragraph selected. Sibling 2 of 2.' [status.walk.sibling].",`), chave que não existe; o código anuncia `status.selected` ao alcançar um nó (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`).

## REQ-2108 — selection.walkParent (Selecionar o pai)
- **Onde:** `manifest/commands/selection.json:549` `"id": "selection.walkParent",`
- **Tratador:** `src/app/commands.ts:360` `'selection.walkParent': walkParentCommand,`
- **Feature:** `src/app/features.ts:37` `'keyboard-tree-walk': registerFeature('keyboard-tree-walk'),`
- **Comportamento esperado:** Seta para cima no canvas seleciona o pai do nó primário, inclusive a raiz da página alcançada a partir de um filho (`src/core/selection/selection.ts:226` `export const walkParentCommand = registerHandler('selection.walkParent', ({ state }) => {`; `src/core/selection/selection.ts:229` `if (at.parent) return reach(at.parent);`). O rótulo da interface é "Selecionar o pai" (`src/i18n/locales/pt-BR.json:519` `"command.walkParent": "Selecionar o pai",`). Na raiz a porta é recusada com `status.walk.atRoot` (`manifest/commands/selection.json:559` `"status.walk.atRoot"`), "Já está na raiz." (`src/i18n/locales/pt-BR.json:2017` `"status.walk.atRoot": "Já está na raiz.",`), e a seleção fica como está, no cenário `arrow-up-at-the-page-is-refused` (`manifest/features/02-structure-editing.json:11731` `"id": "arrow-up-at-the-page-is-refused",`). O cenário `arrow-up-selects-the-parent` parte de `/Page/Hero/Title` e espera `/Page/Hero` (`manifest/features/02-structure-editing.json:11563` `"id": "arrow-up-selects-the-parent",`); o cenário `arrow-up-from-a-top-level-element-selects-the-page` parte de `/Page/Hero` e espera `/Page` (`manifest/features/02-structure-editing.json:11619` `"id": "arrow-up-from-a-top-level-element-selects-the-page",`). A caminhada nunca muda o documento nem grava histórico (`manifest/features/02-structure-editing.json:11446` `"Walking never changes the document JSON."`; `manifest/commands/selection.json:563` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — a porta envia só a intenção; G2 — mudar a seleção grava antes a digitação pendente.

- **Divergência:** O `intent` cita `[status.walk.sibling]` no anúncio de cada passo (`manifest/features/02-structure-editing.json:11444` `"The status bar announces each move, e.g. 'Paragraph selected. Sibling 2 of 2.' [status.walk.sibling].",`), chave que não existe; o código anuncia `status.selected` ao alcançar um nó (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`).

## REQ-2109 — selection.walkFirstChild (Selecionar o primeiro filho)
- **Onde:** `manifest/commands/selection.json:589` `"id": "selection.walkFirstChild",`
- **Tratador:** `src/app/commands.ts:361` `'selection.walkFirstChild': walkFirstChildCommand,`
- **Feature:** `src/app/features.ts:37` `'keyboard-tree-walk': registerFeature('keyboard-tree-walk'),`
- **Comportamento esperado:** Seta para baixo no canvas seleciona o primeiro filho do nó primário (`src/core/selection/selection.ts:234` `export const walkFirstChildCommand = registerHandler('selection.walkFirstChild', ({ state }) => {`). O rótulo da interface é "Selecionar o primeiro filho" (`src/i18n/locales/pt-BR.json:517` `"command.walkFirstChild": "Selecionar o primeiro filho",`). Num nó sem filhos a porta é recusada com `status.walk.noChildren` (`manifest/commands/selection.json:599` `"status.walk.noChildren"`), "{name} não tem filhos." (`src/i18n/locales/pt-BR.json:2018` `"status.walk.noChildren": "{name} não tem filhos.",`), e a seleção fica como está, no cenário `arrow-down-on-a-leaf-is-refused` (`manifest/features/02-structure-editing.json:11790` `"id": "arrow-down-on-a-leaf-is-refused",`). O cenário `arrow-down-selects-the-first-child` parte de `/Page/Hero` e espera `/Page/Hero/Title` (`manifest/features/02-structure-editing.json:11675` `"id": "arrow-down-selects-the-first-child",`); sem nada selecionado a caminhada começa pela raiz da página aberta e o cenário `an-arrow-with-nothing-selected-starts-at-the-page` espera `/Page` (`manifest/features/02-structure-editing.json:11973` `"id": "an-arrow-with-nothing-selected-starts-at-the-page",`; `src/core/selection/selection.ts:204` `return reach(root);`). A caminhada nunca muda o documento nem grava histórico (`manifest/features/02-structure-editing.json:11446` `"Walking never changes the document JSON."`; `manifest/commands/selection.json:603` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — a porta envia só a intenção; G2 — mudar a seleção grava antes a digitação pendente.

- **Divergência:** O `intent` cita `[status.walk.sibling]` no anúncio de cada passo (`manifest/features/02-structure-editing.json:11444` `"The status bar announces each move, e.g. 'Paragraph selected. Sibling 2 of 2.' [status.walk.sibling].",`), chave que não existe; o código anuncia `status.selected` ao alcançar um nó (`src/core/selection/selection.ts:199` `const reach = (node: DocNode): Outcome<never> => ({ kind: 'change', selection: [node.id], message: message('status.selected', { name: node.name }) });`).

## REQ-2110 — selection.selectAllInContainer (Selecionar todos os irmãos)
- **Onde:** `manifest/commands/selection.json:629` `"id": "selection.selectAllInContainer",`
- **Tratador:** `src/app/commands.ts:362` `'selection.selectAllInContainer': selectAllInContainerCommand,`
- **Feature:** `src/app/features.ts:46` `'select-container-children': registerFeature('select-container-children'),`
- **Comportamento esperado:** Ctrl+A seleciona o elemento selecionado e todos os irmãos dele, na ordem (`src/core/selection/selection.ts:44` `export const selectAllInContainerCommand = registerHandler('selection.selectAllInContainer', ({ state }): Outcome<never> => {`). O rótulo da interface é "Selecionar todos os irmãos" (`src/i18n/locales/pt-BR.json:441` `"command.selectAllInContainer": "Selecionar todos os irmãos",`). Sem nada selecionado, ou com a raiz da página selecionada, seleciona todo filho da página (`src/core/selection/selection.ts:47` `const container = at?.parent ?? at?.node ?? pageShown(state)?.tree ?? null;`). Um filho oculto é deixado de fora, e também um bloqueado ou dentro de um elemento bloqueado, e a barra de status conta o que ficou de fora (`src/core/selection/selection.ts:49` `const taken = container.children.filter((child) => child.hidden !== true && lockOver(state.document, child.id) === null);`; `src/core/selection/selection.ts:54` `message: skipped > 0 ? message('status.selection.skipped', { count: taken.length, skipped }) : message('status.selection.count', { count: taken.length }),`). O cenário `ctrl-a-selects-the-element-and-its-siblings` parte de `/Page/Plans/Grid/CardB` e espera os três cartões com `count` 3 (`manifest/features/02-structure-editing.json:16763` `"id": "ctrl-a-selects-the-element-and-its-siblings",`); o cenário `ctrl-a-with-nothing-selected-selects-the-page-children` espera `/Page/Hero`, `/Page/Plans` e `/Page/Footer` (`manifest/features/02-structure-editing.json:16821` `"id": "ctrl-a-with-nothing-selected-selects-the-page-children",`); o cenário `ctrl-a-on-a-control-outside-the-canvas-selects-the-page-children` faz o mesmo a partir do contexto global (`manifest/features/02-structure-editing.json:16960` `"id": "ctrl-a-on-a-control-outside-the-canvas-selects-the-page-children",`). Enquanto um texto é editado, Ctrl+A é do campo de texto e não muda a seleção de elementos (`manifest/features/02-structure-editing.json:16757` `"While editing text Ctrl+A selects the text and does not change the element selection.",`). O documento JSON nunca muda (`manifest/features/02-structure-editing.json:16758` `"The document JSON never changes."`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — as portas (Ctrl+A no canvas e no global, item do menu Editar e barra de comandos) enviam só a intenção; G2 — mudar a seleção grava antes a digitação pendente.

## REQ-2111 — selection.marquee (Selecionar com retângulo)
- **Onde:** `manifest/commands/selection.json:730` `"id": "selection.marquee",`
- **Tratador:** `src/app/commands.ts:363` `'selection.marquee': marqueeCommand,`
- **Feature:** `src/app/features.ts:45` `'marquee-select': registerFeature('marquee-select'),`
- **Comportamento esperado:** Arrastar uma faixa a partir da área vazia da página ou de um contêiner desenha um retângulo translúcido que segue o ponteiro e, ao soltar, seleciona cada elemento que a faixa toca, exceto os que contêm o ponto de partida (`src/core/selection/selection.ts:75` `export const marqueeCommand = registerHandler('selection.marquee', ({ state, layout, rules }, { rect, mode, leaves, target }) => {`; `manifest/features/02-structure-editing.json:15178` `"While dragging a translucent rectangle follows the pointer.",`). O rótulo da interface é "Selecionar com retângulo" (`src/i18n/locales/pt-BR.json:393` `"command.marqueeSelect": "Selecionar com retângulo",`). A faixa toma os filhos diretos do contêiner onde começou, cada um que ela toca (`src/core/selection/selection.ts:117` `scope.children.forEach((child) => {`); com a tecla de pegar folhas (Alt) vale a regra fina: uma folha que a faixa toca, um contêiner só quando a faixa o contém por inteiro (`src/core/selection/selection.ts:103` `if (leaves === true) {`). Um elemento bloqueado, dentro de um bloqueado ou oculto nunca é tomado, e os que a faixa atingiu são contados na barra de status (`src/core/selection/selection.ts:102` `const leftOut = (node: DocNode) => node.hidden === true || lockOver(state.document, node.id) !== null;`; `src/core/selection/selection.ts:134` `if (skipped > 0) return { kind: 'change', selection, message: message('status.selection.skipped', { count: selection.length, skipped }) };`), "{count} elementos selecionados; bloqueados ou ocultos fora da seleção: {skipped}." (`src/i18n/locales/pt-BR.json:1934` `"status.selection.skipped": "{count} elementos selecionados; bloqueados ou ocultos fora da seleção: {skipped}.",`). O modo diz o que acontece com a seleção de partida: substituída, acrescida (a seleção primeiro, depois o que a faixa tomou, na ordem do documento) ou alternada (`src/core/selection/selection.ts:126` `const selection =`; `manifest/features/02-structure-editing.json:15180` `"Shift adds to the existing selection; Ctrl toggles the touched elements.",`); a barra lê "{count} elementos selecionados." (`src/i18n/locales/pt-BR.json:1932` `"status.selection.count": "{count} elementos selecionados.",`). O cenário `a-band-inside-a-container-selects-what-it-touches` seleciona `/Page/Hero/Title` e `/Page/Hero/Intro` (`manifest/features/02-structure-editing.json:15186` `"id": "a-band-inside-a-container-selects-what-it-touches",`); o cenário `shift-band-adds-to-the-selection` acrescenta à seleção anterior (`manifest/features/02-structure-editing.json:15246` `"id": "shift-band-adds-to-the-selection",`); o cenário `a-band-over-the-cards-of-a-grid-takes-the-cards` toma os cartões e o cenário `a-band-with-alt-takes-the-leaves-inside-the-cards` toma as folhas dentro deles (`manifest/features/02-structure-editing.json:15309` `"id": "a-band-over-the-cards-of-a-grid-takes-the-cards",` `manifest/features/02-structure-editing.json:15566` `"id": "a-band-with-alt-takes-the-leaves-inside-the-cards",`); o cenário `a-band-leaves-out-a-locked-card` deixa de fora o cartão bloqueado e conta o que ficou fora (`manifest/features/02-structure-editing.json:15764` `"id": "a-band-leaves-out-a-locked-card",`). Pressionar sobre um elemento começa um arraste de movimento, nunca uma faixa (`manifest/features/02-structure-editing.json:15181` `"Pressing on an element starts a move drag, never a marquee."`); a faixa sobre um elemento só começa com Shift, pela porta de arraste com Shift (`manifest/commands/selection.json:791` `"id": "canvas-drag-shift-on-element",`). Nada muda no documento nem no histórico (`manifest/commands/selection.json:767` `"undoable": false`). Pelas regras: G6 — canvas e Camadas leem a seleção da store; G3 — as portas enviam só a intenção (o retângulo e o modo); G2 — mudar a seleção grava antes a digitação pendente.

## REQ-2112 — contextMenu.open (Abrir o menu do elemento)
- **Onde:** `manifest/commands/selection.json:813` `"id": "contextMenu.open",`
- **Tratador:** `src/app/commands.ts:364` `'contextMenu.open': contextMenuOpen,`
- **Feature:** `src/app/features.ts:30` `'context-menu': registerFeature('context-menu'),`
- **Comportamento esperado:** Um clique com o botão secundário num elemento ou na página do canvas, o clique secundário numa linha de Camadas ou o controle de mais ações do painel rápido (rótulo "Mais ações", `src/i18n/locales/pt-BR.json:1588` `"quickPanel.moreActions": "Mais ações",`) selecionam o elemento e abrem o menu de contexto no ponteiro; o rótulo da interface é "Abrir o menu do elemento" (`src/i18n/locales/pt-BR.json:405` `"command.openContextMenu": "Abrir o menu do elemento",`). O menu contém, nesta ordem, Renomear, Copiar, Recortar, Colar, Duplicar, Subir, Descer, Envolver em linha, Envolver em coluna, Remover invólucro, Tornar filho da camada anterior, Sair do pai, Pegar na mão, Bloquear, Ocultar e Excluir, e entradas posteriores podem acrescentar itens (`manifest/features/02-structure-editing.json:7911` `"title": "Right-click context menu on the canvas and in Layers",`). Cada item tem dica que nomeia a ação e o atalho, e roda o mesmo comando que o atalho ou a linha de menu, produzindo o mesmo documento JSON; itens que não se aplicam à seleção ficam desabilitados; itens de recursos ainda não construídos ficam desabilitados e rotulados "ainda não disponível" (`src/i18n/locales/pt-BR.json:554` `"common.notAvailableYet": "ainda não disponível",`). O menu é operável com as setas e Enter, fecha com Escape ou um clique fora e permanece por inteiro dentro da janela (`manifest/features/02-structure-editing.json:7923` `"The menu is operable with ArrowUp/ArrowDown and Enter, closes with Escape or a click outside, and always stays fully inside the window.",`). O mesmo menu abre nas linhas de Camadas (`manifest/features/02-structure-editing.json:7924` `"The same menu opens on Layers rows."`). O cenário `the-menu-opens-on-the-canvas-or-a-layers-row-and-moves-up` abre no canvas pela porta `contextMenu.open#canvas-right-click-element-or-page` e nas linhas pela porta `contextMenu.open#layers-row-secondary-click` (`manifest/features/02-structure-editing.json:7929` `"id": "the-menu-opens-on-the-canvas-or-a-layers-row-and-moves-up",`). Abrir o menu não muda o documento nem grava histórico (`manifest/commands/selection.json:831` `"undoable": false`). Pelas regras: G6 — a seleção do elemento clicado vem da store; G4 — o menu não cobre o ponto da ação no canvas; G3 — cada porta envia só o nó do alvo; G2 — mudar a seleção grava antes a digitação pendente.

## REQ-2201 — element.insert
- **Onde:** `manifest/commands/structure.json:5` `"id": "element.insert",`
- **Tratador:** `src/app/commands.ts:365` `'element.insert': insertCommand,`
- **Feature:** `src/app/features.ts:17` `'palette-click-insert': registerFeature('palette-click-insert'),`
- **Comportamento esperado:** Inserir um elemento escolhido no painel de Elementos, com o rótulo "Inserir {element}" (`src/i18n/locales/pt-BR.json:377` `"command.insertElement": "Inserir {element}",`). O comando recebe a entrada da paleta e, opcionalmente, o pai e o índice. Sem pai, o elemento novo entra como último filho do Page e passa a ser a seleção (`manifest/features/02-structure-editing.json:25` `the Section is appended as the last child of Page in the document JSON and becomes the selection.`); com contêiner selecionado, entra como último filho dele, e com um não-contêiner, logo depois dele no mesmo pai (`manifest/features/02-structure-editing.json:26` `the Heading is appended as its last child; with a non-container selected, the Paragraph is inserted right after it in the same parent.`). Um bloco de página (Section, Header, Footer) entra logo depois do bloco de página que contém a seleção, nunca dentro dele (`manifest/features/02-structure-editing.json:29` `lands right after the page block holding the selection, never inside it.`). O iframe desenha a tag nova e a barra de status lê a inserção (`src/i18n/locales/pt-BR.json:1894` `"status.placed": "Inserção de {element} em {parent}, posição {position} de {count}.",`); cada inserção é um passo de desfazer. Nomes repetidos ganham sufixo numérico e o novo elemento copia a classe que os irmãos partilham. A inserção é recusada, com o documento intacto, quando o pai não aceita o elemento — tipicamente `status.refused.onlyAccepts` (`src/i18n/locales/pt-BR.json:1914` `"status.refused.onlyAccepts": "Recusado. {parent} só aceita {children}.",`) — e quando o elemento ou um ancestral está travado. As portas (o item do painel, Enter e Espaço na paleta, o arraste da paleta e a barra de comandos) enviam só a intenção ao mesmo tratador (G3). Vale G1, que grava a inserção no contexto em que foi feita; G2, que grava a digitação pendente antes de um comando que altera o documento; G6, com a seleção nova lida da store; e G7, com o canvas mostrando o mesmo documento do render do zero.

## REQ-2202 — element.moveTo
- **Onde:** `manifest/commands/structure.json:162` `"id": "element.moveTo",`
- **Tratador:** `src/app/commands.ts:366` `'element.moveTo': moveToCommand,`
- **Feature:** `src/app/features.ts:22` `'drag-reorder-canvas': registerFeature('drag-reorder-canvas'),`
- **Comportamento esperado:** Mover um elemento para um pai e uma posição, com o rótulo "Mover" (`src/i18n/locales/pt-BR.json:397` `"command.moveTo": "Mover",`). O comando recebe o pai e o índice e é o destino comum do arraste: pelo canvas antes ou depois de um irmão, pelo canvas para dentro de um elemento, pelo arraste nas Camadas e pela tecla Enter da mão. Durante o arraste o canvas desenha a linha de inserção no vão onde o elemento vai cair, tinge o pai que recebe, acompanha o ponteiro com o nome do elemento e mostra a indicação de destino (`manifest/features/02-structure-editing.json:2882` `While dragging, an insertion line is drawn in the gap where the element will land`). Ao soltar, a ordem dos filhos no documento JSON acompanha a última indicação e o elemento arrastado continua selecionado (`manifest/features/02-structure-editing.json:2883` `On release the order of children in the document JSON matches the last indicator exactly and the dragged element stays selected.`); o pressionar e soltar abaixo do limite de arraste só seleciona e não muda o documento (`manifest/features/02-structure-editing.json:2884` `A press and release under the drag threshold only selects; the document JSON is unchanged.`). Cada soltura é um passo de desfazer. A barra de status lê a posição nova (`src/i18n/locales/pt-BR.json:1852` `"status.moved": "{name} agora está na posição {position} de {count} em {parent}.",`). O comando é recusado, com o documento intacto, quando o pai não aceita o elemento, quando o elemento é movido para dentro de si mesmo, quando cai fora da página (`status.drop.outsidePage`), quando é peça ou contém instância (`status.instance.partLeaves`, `status.instance.nested`) e quando o elemento ou um ancestral está travado. As portas enviam só a intenção, sem decidir por conta própria (G3); G1 grava o movimento no contexto em que foi feito, G2 grava a digitação pendente antes, G6 deriva a seleção da store e G7 mantém o canvas igual ao render do zero.

## REQ-2203 — drag.levelUp
- **Onde:** `manifest/commands/structure.json:289` `"id": "drag.levelUp",`
- **Tratador:** `src/app/commands.ts:367` `'drag.levelUp': levelUp,`
- **Feature:** `src/app/features.ts:24` `'drag-level-keys-escape': registerFeature('drag-level-keys-escape'),`
- **Comportamento esperado:** Subir o destino do arraste um nível, pelo rótulo "Soltar um nível acima" (`src/i18n/locales/pt-BR.json:325` `"command.drag.levelUp": "Soltar um nível acima",`). A tecla ArrowUp, durante o arraste, move o alvo para fora um nível de cada vez e a barra de status nomeia o destino novo (`manifest/features/02-structure-editing.json:3786` `ArrowUp moves the target out one level at a time and the status bar names it`); a soltura seguinte cai exatamente no nível mostrado por último (`manifest/features/02-structure-editing.json:3787` `Release drops exactly at the level last shown`). O comando não é gravado por si só (só a soltura é um passo de desfazer). Fora de um arraste, ou já no nível mais alto, é recusado com `status.drop.topLevel` (`src/i18n/locales/pt-BR.json:1726` `"status.drop.topLevel": "Já está no nível mais alto.",`) e o documento fica intacto. A porta única — ArrowUp no contexto do arraste — envia só a intenção ao tratador (G3), e o indicador e o rótulo seguem a mudança sem alterar o documento até a soltura.

## REQ-2204 — drag.levelDown
- **Onde:** `manifest/commands/structure.json:329` `"id": "drag.levelDown",`
- **Tratador:** `src/app/commands.ts:368` `'drag.levelDown': levelDown,`
- **Feature:** `src/app/features.ts:24` `'drag-level-keys-escape': registerFeature('drag-level-keys-escape'),`
- **Comportamento esperado:** Descer o destino do arraste um nível, pelo rótulo "Soltar um nível abaixo" (`src/i18n/locales/pt-BR.json:324` `"command.drag.levelDown": "Soltar um nível abaixo",`). A tecla ArrowDown, durante o arraste, desfaz um nível da subida e a barra de status nomeia o destino (`src/i18n/locales/pt-BR.json:1852` `"status.moved": "{name} agora está na posição {position} de {count} em {parent}.",`); o indicador e o rótulo acompanham a mudança. O comando não é gravado por si só: só a soltura é um passo de desfazer. A porta única — ArrowDown no contexto do arraste — envia só a intenção ao tratador (G3), sem alterar o documento antes da soltura.

## REQ-2205 — drag.cancel
- **Onde:** `manifest/commands/structure.json:367` `"id": "drag.cancel",`
- **Tratador:** `src/app/commands.ts:369` `'drag.cancel': cancelDrag,`
- **Feature:** `src/app/features.ts:24` `'drag-level-keys-escape': registerFeature('drag-level-keys-escape'),`
- **Comportamento esperado:** Cancelar o arraste, pelo rótulo "Cancelar o arraste" (`src/i18n/locales/pt-BR.json:323` `"command.drag.cancel": "Cancelar o arraste",`). A tecla Escape, no contexto do arraste, remove todos os indicadores de arraste e a soltura seguinte não muda nada no documento JSON (`manifest/features/02-structure-editing.json:3788` `Escape removes every drag indicator and the following release changes nothing in the document JSON.`). A barra de status confirma o cancelamento (`src/i18n/locales/pt-BR.json:1721` `"status.drag.cancelled": "Arraste cancelado — nada mudou.",`). O comando também serve ao contexto do seletor de cor (a tecla Escape fecha sem aplicar). Não é gravado na pilha de desfazer por si só. As portas enviam só a intenção, sem decidir (G3); o cancelamento não altera o documento.

## REQ-2206 — element.moveUp
- **Onde:** `manifest/commands/structure.json:425` `"id": "element.moveUp",`
- **Tratador:** `src/app/commands.ts:370` `'element.moveUp': moveUpCommand,`
- **Feature:** `src/app/features.ts:27` `'move-up-down': registerFeature('move-up-down'),`
- **Recusa declarada:** `manifest/commands/structure.json:432` `"refusalKey": "status.move.alreadyFirst"`
- **Comportamento esperado:** Mover a seleção uma posição para cima entre os irmãos, pelo rótulo "Mover para cima" (`src/i18n/locales/pt-BR.json:398` `"command.moveUp": "Mover para cima",`). O comando recebe a intenção vazia e troca o elemento com o irmão anterior no documento JSON (`manifest/features/02-structure-editing.json:6634` `Each Alt+ArrowUp swaps the element with its previous sibling in the document JSON; Alt+ArrowDown with its next sibling.`); o elemento continua selecionado e a barra de status lê a posição nova (`src/i18n/locales/pt-BR.json:1852` `"status.moved": "{name} agora está na posição {position} de {count} em {parent}.",`); cada movimento é um passo de desfazer. Na primeira posição o documento fica intacto e o predicado `canMoveUp` recusa a porta com `status.move.alreadyFirst` (`src/i18n/locales/pt-BR.json:1850` `"status.move.alreadyFirst": "Já está no início de {parent}.",`). As portas — Alt+ArrowUp no canvas, Alt+ArrowUp na árvore de Camadas, o item do menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção ao mesmo tratador (G3). Vale G1, que grava o movimento no contexto em que foi feito; G2, que grava a digitação pendente antes; G6, com a seleção lida da store; e G7, com o canvas igual ao render do zero.

## REQ-2207 — element.moveDown
- **Onde:** `manifest/commands/structure.json:556` `"id": "element.moveDown",`
- **Tratador:** `src/app/commands.ts:371` `'element.moveDown': moveDownCommand,`
- **Feature:** `src/app/features.ts:27` `'move-up-down': registerFeature('move-up-down'),`
- **Recusa declarada:** `manifest/commands/structure.json:563` `"refusalKey": "status.move.alreadyLast"`
- **Comportamento esperado:** Mover a seleção uma posição para baixo entre os irmãos, pelo rótulo "Mover para baixo" (`src/i18n/locales/pt-BR.json:394` `"command.moveDown": "Mover para baixo",`). O comando troca o elemento com o irmão seguinte no documento JSON (`manifest/features/02-structure-editing.json:6634` `Each Alt+ArrowUp swaps the element with its previous sibling in the document JSON; Alt+ArrowDown with its next sibling.`); o elemento continua selecionado e a barra de status lê a posição (`src/i18n/locales/pt-BR.json:1852` `"status.moved": "{name} agora está na posição {position} de {count} em {parent}.",`); cada movimento é um passo de desfazer. Na última posição o documento fica intacto e o predicado `canMoveDown` recusa a porta com `status.move.alreadyLast` (`src/i18n/locales/pt-BR.json:1851` `"status.move.alreadyLast": "Já está no fim de {parent}.",`). As portas — Alt+ArrowDown no canvas, Alt+ArrowDown na árvore de Camadas, o item do menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção ao mesmo tratador (G3); G1, G2, G6 e G7 valem como no movimento para cima.

## REQ-2208 — element.wrapRow
- **Onde:** `manifest/commands/structure.json:687` `"id": "element.wrapRow",`
- **Tratador:** `src/app/commands.ts:372` `'element.wrapRow': wrapRowCommand,`
- **Feature:** `src/app/features.ts:28` `'wrap-row-column': registerFeature('wrap-row-column'),`
- **Recusa declarada:** `manifest/commands/structure.json:694` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Envolver a seleção numa linha, pelo rótulo "Envolver em uma linha" (`src/i18n/locales/pt-BR.json:523` `"command.wrapRow": "Envolver em uma linha",`). A tecla R troca o elemento na posição dele por uma nova div chamada "Row" cujo único filho é o elemento (`manifest/features/02-structure-editing.json:6989` `R replaces the Paragraph at its index with a new div named 'Row' [node.name.row] whose only child is the Paragraph`), com display flex, flex-direction row e column-gap 16px no documento JSON e no estilo calculado. A nova envoltória passa a ser a seleção e um desfazer restaura a árvore original; a barra de status lê o envolvimento (`src/i18n/locales/pt-BR.json:2023` `"status.wrapped": "{wrapper} agora envolve {name} ({styles}).",`). A raiz da página não pode ser envolvida e a barra de status diz isso (`manifest/features/02-structure-editing.json:6992` `The Page root cannot be wrapped and the status bar says so.`) — `status.wrap.root` (`src/i18n/locales/pt-BR.json:2022` `"status.wrap.root": "A raiz da página não pode ser envolvida.",`). Sem seleção, o predicado `hasSelection` recusa a porta com `refusal.nothingSelected`. As portas — R no canvas, R na árvore de Camadas, o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); G1 grava no contexto em que foi feito, G2 grava a digitação pendente antes, G6 e G7 mantêm seleção e canvas coerentes com a store.

## REQ-2209 — element.wrapColumn
- **Onde:** `manifest/commands/structure.json:827` `"id": "element.wrapColumn",`
- **Tratador:** `src/app/commands.ts:373` `'element.wrapColumn': wrapColumnCommand,`
- **Feature:** `src/app/features.ts:28` `'wrap-row-column': registerFeature('wrap-row-column'),`
- **Recusa declarada:** `manifest/commands/structure.json:834` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Envolver a seleção numa coluna, pelo rótulo "Envolver em uma coluna" (`src/i18n/locales/pt-BR.json:522` `"command.wrapColumn": "Envolver em uma coluna",`). A tecla C troca o elemento na posição dele por uma nova div chamada "Column" com display flex, flex-direction column e row-gap 16px, tendo o elemento como único filho; a nova envoltória passa a ser a seleção e um desfazer restaura a árvore original. A barra de status lê o envolvimento (`src/i18n/locales/pt-BR.json:2023` `"status.wrapped": "{wrapper} agora envolve {name} ({styles}).",`). A raiz da página não pode ser envolvida, e aí a barra de status diz isso — `status.wrap.root` (`src/i18n/locales/pt-BR.json:2022` `"status.wrap.root": "A raiz da página não pode ser envolvida.",`). Sem seleção, o predicado `hasSelection` recusa a porta com `refusal.nothingSelected`. As portas — C no canvas, C na árvore de Camadas, o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2210 — element.wrapBeside
- **Onde:** `manifest/commands/structure.json:967` `"id": "element.wrapBeside",`
- **Tratador:** `src/app/commands.ts:376` `'element.wrapBeside': wrapBesideCommand,`
- **Feature:** `src/app/features.ts:29` `'drag-side-wrap': registerFeature('drag-side-wrap'),`
- **Comportamento esperado:** Largar um elemento ao lado de outro e pôr os dois lado a lado numa linha ou coluna nova, pelo rótulo "Colocar lado a lado" (`src/i18n/locales/pt-BR.json:521` `"command.wrapBeside": "Colocar lado a lado",`). O comando recebe o alvo, o lado (antes ou depois) e a envoltória (linha ou coluna); até a oferta ser confirmada, o indicador mostra a queda comum e uma dica, e confirmada, desenha a linha pela borda do lado, contorna o alvo e mostra a pastilha que nomeia o resultado visível. A soltura põe os dois numa Row nova (display flex, row) no lugar do alvo, com o elemento arrastado do lado em que caiu (`manifest/features/02-structure-editing.json:7425` `The release puts both in a new Row (display flex, row) at the target's place, the dragged element on the side it was dropped; one undo step; the Row selected.`); a Row passa a ser a seleção e cada queda é um passo de desfazer. A barra de status lê o resultado (`src/i18n/locales/pt-BR.json:2024` `"status.wrappedBeside": "{name} e {target} lado a lado em {wrapper} ({styles}).",`). Num pai que já é linha, as faixas de lado são o topo e a base e a envoltória é uma coluna. As portas — o arraste de um elemento pelo canvas e o arraste de uma telha da paleta para a faixa lateral — enviam só a intenção ao mesmo tratador (G3); G1 grava no contexto em que foi feito, G2 grava a digitação pendente antes, G6 e G7 mantêm seleção e canvas coerentes.

## REQ-2211 — element.nestIntoPrevious
- **Onde:** `manifest/commands/structure.json:1069` `"id": "element.nestIntoPrevious",`
- **Tratador:** `src/app/commands.ts:377` `'element.nestIntoPrevious': nestIntoPreviousCommand,`
- **Feature:** `src/app/features.ts:31` `'nest-into-previous': registerFeature('nest-into-previous'),`
- **Recusa declarada:** `manifest/commands/structure.json:1076` `"refusalKey": "status.nest.noPrevious"`
- **Comportamento esperado:** Aninhar a seleção no irmão anterior, pelo rótulo "Tornar filho da camada anterior" (`src/i18n/locales/pt-BR.json:399` `"command.nestIntoPrevious": "Tornar filho da camada anterior",`). O elemento passa a ser o último filho do irmão anterior no documento JSON e continua selecionado (`manifest/features/02-structure-editing.json:8721` `The Paragraph becomes the last child of the Container in the document JSON and stays selected.`); a barra de status lê o novo destino (`src/i18n/locales/pt-BR.json:1853` `"status.movedInto": "{name} agora está dentro de {receiver}, posição {position} de {count}.",`) e um desfazer restaura a árvore original. Quando não há irmão anterior, ou o anterior não pode conter o elemento, o comando é desabilitado e o documento fica intacto (`manifest/features/02-structure-editing.json:8722` `When there is no previous sibling, or the previous sibling cannot contain the element, the command is disabled and the document JSON is unchanged.`) — `status.nest.noPrevious` (`src/i18n/locales/pt-BR.json:1858` `"status.nest.noPrevious": "Não há elemento anterior que possa contê-lo.",`). Instância não entra em outra e peça de instância não sai dela (`status.instance.nested`, `status.instance.partLeaves`), e elemento sob ancestral travado é recusado. As portas — o item do menu de contexto, Alt+ArrowRight no canvas e na árvore de Camadas, o menu Organizar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2212 — element.promote
- **Onde:** `manifest/commands/structure.json:1206` `"id": "element.promote",`
- **Tratador:** `src/app/commands.ts:378` `'element.promote': promoteCommand,`
- **Feature:** `src/app/features.ts:32` `'promote-out': registerFeature('promote-out'),`
- **Recusa declarada:** `manifest/commands/structure.json:1213` `"refusalKey": "status.promote.topLevel"`
- **Comportamento esperado:** Mover a seleção para fora do pai, pelo rótulo "Mover para fora do pai" (`src/i18n/locales/pt-BR.json:427` `"command.promote": "Mover para fora do pai",`). A tecla P e o item do menu movem o elemento para o avô, logo depois do antigo pai, no documento JSON (`manifest/features/02-structure-editing.json:9501` `P and the 'Move out of parent' [command.promote] menu item move the element into its grandparent, directly after its former parent, in the document JSON.`); a barra de status lê a promoção (`src/i18n/locales/pt-BR.json:1852` `"status.moved": "{name} agora está na posição {position} de {count} em {parent}.",`); cada promoção é um passo de desfazer e o elemento continua selecionado. Um filho direto do Page não pode ser promovido e o predicado `canPromote` recusa a porta com `status.promote.topLevel` (`src/i18n/locales/pt-BR.json:1906` `"status.promote.topLevel": "Um filho direto da página não tem para onde subir.",`). Peça de instância não sai da instância (`status.instance.partLeaves` — `src/i18n/locales/pt-BR.json:3576` `"status.instance.partLeaves": "{name} faz parte da instância {instance} e fica nela. Desvincule a instância primeiro.",`). As portas — P no canvas e na árvore de Camadas, o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2213 — element.duplicate
- **Onde:** `manifest/commands/structure.json:1344` `"id": "element.duplicate",`
- **Tratador:** `src/app/commands.ts:379` `'element.duplicate': duplicateCommand,`
- **Feature:** `src/app/features.ts:33` `duplicate: registerFeature('duplicate'),`
- **Recusa declarada:** `manifest/commands/structure.json:1351` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Duplicar a seleção, pelo rótulo "Duplicar" (`src/i18n/locales/pt-BR.json:327` `"command.duplicate": "Duplicar",`). Uma cópia profunda do elemento, com filhos, textos e estilos, é inserida logo depois dele no documento JSON (`manifest/features/02-structure-editing.json:10066` `A deep copy of the Section with its children, texts and styles is inserted directly after it in the document JSON.`); cada nó da cópia recebe id e nome novos e únicos (`manifest/features/02-structure-editing.json:10067` `Every node of the copy has a new unique id and a unique name.`) — "CardA" gera "CardA 2" — e a cópia passa a ser a seleção, num passo de desfazer; a barra de status lê a cópia (`src/i18n/locales/pt-BR.json:1728` `"status.duplicated": "Cópia de {name} criada: {copy}.",`). A raiz da página não pode ser duplicada (`status.duplicate.root` — `src/i18n/locales/pt-BR.json:1727` `"status.duplicate.root": "A raiz da página não pode ser duplicada.",`), e elemento travado ou sob ancestral travado é recusado. Sem seleção, o predicado `hasSelection` recusa a porta com `refusal.nothingSelected`. As portas — Ctrl+D, o menu de contexto, o menu Editar, a barra de comandos e o arraste de duplicação no canvas — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2214 — element.delete
- **Onde:** `manifest/commands/structure.json:1474` `"id": "element.delete",`
- **Tratador:** `src/app/commands.ts:380` `'element.delete': deleteCommand,`
- **Feature:** `src/app/features.ts:21` `'delete-element': registerFeature('delete-element'),`
- **Recusa declarada:** `manifest/commands/structure.json:1481` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Excluir o elemento selecionado, pelo rótulo "Excluir" (`src/i18n/locales/pt-BR.json:317` `"command.delete": "Excluir",`). Delete e Backspace removem o nó selecionado e toda a subárvore dele do documento JSON (`manifest/features/02-structure-editing.json:2468` `Delete and Backspace remove the selected node and its whole subtree from the document JSON.`). Depois da exclusão, a seleção passa ao irmão seguinte, senão ao irmão anterior, senão ao pai (`manifest/features/02-structure-editing.json:2469` `After a delete the selection moves to the next sibling, else the previous sibling, else the parent.`); a barra de status lê a exclusão (`src/i18n/locales/pt-BR.json:1713` `"status.deleted": "{name} saiu da página.",`) e o desfazer devolve cada subárvore no índice e com os ids originais. A raiz da página nunca é excluída e a barra de status explica por quê (`manifest/features/02-structure-editing.json:2470` `The Page root is never deleted; the status bar explains why.`) — `status.delete.root` (`src/i18n/locales/pt-BR.json:1712` `"status.delete.root": "A raiz da página não pode ser excluída.",`). Elemento travado ou sob ancestral travado é recusado; sem seleção, o predicado `hasSelection` recusa a porta com `refusal.nothingSelected`. As portas — Delete e Backspace no canvas e na árvore de Camadas, o menu de contexto, o menu Editar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2215 — element.unwrap
- **Onde:** `manifest/commands/structure.json:1643` `"id": "element.unwrap",`
- **Tratador:** `src/app/commands.ts:381` `'element.unwrap': unwrapCommand,`
- **Feature:** `src/app/features.ts:44` `unwrap: registerFeature('unwrap'),`
- **Recusa declarada:** `manifest/commands/structure.json:1650` `"refusalKey": "status.unwrap.unavailable"`
- **Comportamento esperado:** Remover uma envoltória e erguer os filhos para o lugar dela, pelo rótulo "Remover contêiner" (`src/i18n/locales/pt-BR.json:516` `"command.unwrap": "Remover contêiner",`). O contêiner desaparece do documento JSON e os filhos tomam o índice dele no pai, na ordem original (`manifest/features/02-structure-editing.json:14832` `The Container disappears from the document JSON and the Heading and Paragraph take its index in the Section, in their original order.`); os filhos erguidos passam a ser a seleção (`manifest/features/02-structure-editing.json:14833` `The lifted children become the selection.`) e um desfazer devolve o contêiner com os filhos. A barra de status lê a remoção (`src/i18n/locales/pt-BR.json:2005` `"status.unwrapped": "O contêiner {name} foi removido.",`). O comando é indisponível para a raiz da página e para elementos sem filhos (`manifest/features/02-structure-editing.json:14834` `The command is unavailable for the Page root and for elements without children.`) — `status.unwrap.unavailable` —, e a edição em elemento travado ou sob ancestral travado é recusada. As portas — o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2216 — element.createNaturalChild
- **Onde:** `manifest/commands/structure.json:1739` `"id": "element.createNaturalChild",`
- **Tratador:** `src/app/commands.ts:382` `'element.createNaturalChild': createNaturalChildCommand,`
- **Feature:** `src/app/features.ts:122` `'natural-child-command': registerFeature('natural-child-command'),`
- **Recusa declarada:** `manifest/commands/structure.json:1747` `"refusalKey": "status.naturalChild.none"`
- **Comportamento esperado:** Criar o filho natural dentro de um contêiner, com o rótulo que nomeia a tag do filho — "Criar {tag} dentro" (`src/i18n/locales/pt-BR.json:314` `"command.createNaturalChild": "Criar {tag} dentro",`). O rótulo nomeia o filho natural do elemento selecionado e acrescenta esse filho com conteúdo padrão (`manifest/features/07-elements.json:21334` `The command label names the child tag for the selected element and appends that child with default content.`): uma lista ganha um \<li>, um Select ganha uma \<option>, uma Figure sem legenda recupera a \<figcaption>, e o corpo de uma tabela ganha uma \<tr>. O comando é desabilitado quando o elemento não tem filho natural ou quando o filho é único e já existe (`manifest/features/07-elements.json:21335` `It is disabled when the element has no natural child or the child is unique and already present (a Details always has its Summary, so it is disabled there).`) — `status.naturalChild.none` (`src/i18n/locales/pt-BR.json:1855` `"status.naturalChild.none": "{name} não tem um filho natural.",`) e `status.naturalChild.present` (`src/i18n/locales/pt-BR.json:1856` `"status.naturalChild.present": "{parent} já tem seu {child}.",`). Cada criação é um passo de desfazer e seleciona o filho novo; a barra de status lê a inserção (`src/i18n/locales/pt-BR.json:1894` `"status.placed": "Inserção de {element} em {parent}, posição {position} de {count}.",`). As portas — o menu de contexto e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2217 — hand.take
- **Onde:** `manifest/commands/structure.json:1806` `"id": "hand.take",`
- **Tratador:** `src/app/commands.ts:383` `'hand.take': HAND.take,`
- **Feature:** `src/app/features.ts:38` `'hand-keyboard-move': registerFeature('hand-keyboard-move'),`
- **Recusa declarada:** `manifest/commands/structure.json:1813` `"refusalKey": "status.needsSingleSelection"`
- **Comportamento esperado:** Pegar a seleção na mão, pelo rótulo "Pegar na mão" (`src/i18n/locales/pt-BR.json:491` `"command.takeIntoHand": "Pegar na mão",`). A tecla M põe a seleção na mão e a barra de status lê "Segurando {name}. Setas miram, Enter coloca, Esc solta." (`src/i18n/locales/pt-BR.json:1780` `"status.hand.holding": "Segurando {name}. Setas miram, Enter coloca, Esc solta.",`); o canvas mostra o mesmo indicador de inserção do arraste com o mouse (`manifest/features/02-structure-editing.json:12050` `After M the status bar reads 'Holding <name>. Arrows aim, Enter places, Esc drops.' [status.hand.holding] and the canvas shows the same insertion indicator a mouse drag shows.`). A raiz da página não pode ser pega na mão (`status.hand.root` — `src/i18n/locales/pt-BR.json:1781` `"status.hand.root": "A raiz da página não pode ser pega na mão.",`), e um elemento travado também é recusado; sem seleção única, o predicado `singleSelection` recusa a porta com `status.needsSingleSelection`. Pegar não grava por si só: só a colocação (element.moveTo) é um passo de desfazer. As portas — M no canvas, M na árvore de Camadas, o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); G6 e G7 mantêm seleção e canvas coerentes com a store.

## REQ-2218 — hand.aimNext
- **Onde:** `manifest/commands/structure.json:1931` `"id": "hand.aimNext",`
- **Tratador:** `src/app/commands.ts:384` `'hand.aimNext': HAND.aimNext,`
- **Feature:** `src/app/features.ts:38` `'hand-keyboard-move': registerFeature('hand-keyboard-move'),`
- **Comportamento esperado:** Mirar a próxima posição com o elemento na mão, pelo rótulo "Mirar a próxima posição" (`src/i18n/locales/pt-BR.json:367` `"command.hand.aimNext": "Mirar a próxima posição",`). As teclas ArrowDown e ArrowRight, durante a mão, miram a posição seguinte, e a barra de status nomeia o destino, a posição e o nível depois de cada tecla (`manifest/features/02-structure-editing.json:12051` `ArrowDown/ArrowRight aim at the next position, ArrowUp climbs a receiver level, ArrowLeft descends; the status bar names the receiver, position and level after each key.`). A mira não altera o documento JSON: só a tecla Enter (element.moveTo) coloca o elemento, num passo de desfazer. Instância dentro de outra é recusada (`status.instance.nested`, `status.instance.partLeaves`). As portas — ArrowDown e ArrowRight no contexto da mão — enviam só a intenção (G3).

## REQ-2219 — hand.aimPrevious
- **Onde:** `manifest/commands/structure.json:1992` `"id": "hand.aimPrevious",`
- **Tratador:** `src/app/commands.ts:385` `'hand.aimPrevious': HAND.aimPrevious,`
- **Feature:** `src/app/features.ts:38` `'hand-keyboard-move': registerFeature('hand-keyboard-move'),`
- **Comportamento esperado:** Mirar a posição anterior com o elemento na mão, pelo rótulo "Mirar a posição anterior" (`src/i18n/locales/pt-BR.json:368` `"command.hand.aimPrevious": "Mirar a posição anterior",`). As teclas Shift+ArrowDown e Shift+ArrowRight, durante a mão, miram a posição anterior, e a barra de status nomeia o destino, a posição e o nível depois de cada tecla. A mira não altera o documento JSON: só a tecla Enter (element.moveTo) coloca o elemento, num passo de desfazer. Instância dentro de outra é recusada (`status.instance.nested`, `status.instance.partLeaves`). As portas — Shift+ArrowDown e Shift+ArrowRight no contexto da mão — enviam só a intenção (G3).

## REQ-2220 — hand.climb
- **Onde:** `manifest/commands/structure.json:2053` `"id": "hand.climb",`
- **Tratador:** `src/app/commands.ts:386` `'hand.climb': HAND.climb,`
- **Feature:** `src/app/features.ts:38` `'hand-keyboard-move': registerFeature('hand-keyboard-move'),`
- **Comportamento esperado:** Subir um nível de destino com o elemento na mão, pelo rótulo "Subir um nível de destino" (`src/i18n/locales/pt-BR.json:369` `"command.hand.climb": "Subir um nível de destino",`). A tecla ArrowUp, durante a mão, sobe a mira para o nível que recebe acima, e a barra de status nomeia o destino, a posição e o nível (`manifest/features/02-structure-editing.json:12051` `ArrowDown/ArrowRight aim at the next position, ArrowUp climbs a receiver level, ArrowLeft descends; the status bar names the receiver, position and level after each key.`). A mira não altera o documento JSON: só a tecla Enter (element.moveTo) coloca o elemento, num passo de desfazer. Instância dentro de outra é recusada (`status.instance.nested`, `status.instance.partLeaves`). A porta única — ArrowUp no contexto da mão — envia só a intenção (G3).

## REQ-2221 — hand.descend
- **Onde:** `manifest/commands/structure.json:2094` `"id": "hand.descend",`
- **Tratador:** `src/app/commands.ts:387` `'hand.descend': HAND.descend,`
- **Feature:** `src/app/features.ts:38` `'hand-keyboard-move': registerFeature('hand-keyboard-move'),`
- **Comportamento esperado:** Descer um nível de destino com o elemento na mão, pelo rótulo "Descer um nível de destino" (`src/i18n/locales/pt-BR.json:370` `"command.hand.descend": "Descer um nível de destino",`). A tecla ArrowLeft, durante a mão, desce a mira de volta ao nível interno, e a barra de status nomeia o destino, a posição e o nível (`manifest/features/02-structure-editing.json:12051` `ArrowDown/ArrowRight aim at the next position, ArrowUp climbs a receiver level, ArrowLeft descends; the status bar names the receiver, position and level after each key.`). A mira não altera o documento JSON: só a tecla Enter (element.moveTo) coloca o elemento, num passo de desfazer. Instância dentro de outra é recusada (`status.instance.nested`, `status.instance.partLeaves`). A porta única — ArrowLeft no contexto da mão — envia só a intenção (G3).

## REQ-2222 — hand.drop
- **Onde:** `manifest/commands/structure.json:2135` `"id": "hand.drop",`
- **Tratador:** `src/app/commands.ts:388` `'hand.drop': HAND.drop,`
- **Feature:** `src/app/features.ts:38` `'hand-keyboard-move': registerFeature('hand-keyboard-move'),`
- **Comportamento esperado:** Largar a mão, pelo rótulo "Largar a mão" (`src/i18n/locales/pt-BR.json:371` `"command.hand.drop": "Largar a mão",`). A tecla Escape, durante a mão, larga a mão e deixa o documento JSON sem mudança (`manifest/features/02-structure-editing.json:12053` `Escape drops the hand and leaves the document JSON unchanged.`). Só a tecla Enter de element.moveTo grava a colocação, num passo de desfazer. A porta única — Escape no contexto da mão — envia só a intenção (G3); a seleção permanece a da store (G6).

## REQ-2223 — element.wrapContainer
- **Onde:** `manifest/commands/structure.json:2177` `"id": "element.wrapContainer",`
- **Tratador:** `src/app/commands.ts:374` `'element.wrapContainer': wrapContainerCommand,`
- **Feature:** `src/app/features.ts:228` `'layout-actions': registerFeature('layout-actions'),`
- **Recusa declarada:** `manifest/commands/structure.json:2184` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Envolver a seleção num contêiner, pelo rótulo "Envolver em um contêiner" (`src/i18n/locales/pt-BR.json:524` `"command.wrapContainer": "Envolver em um contêiner",`). As ações de envolver põem os elementos selecionados numa envoltória nova no índice do primeiro, selecionada depois de um passo de desfazer (`manifest/features/21-layout-and-structure.json:27` `The wrap commands put the selected elements in a new wrapper at the first one's index, selected after one undo step: a container (a plain div, no styles), or a grid whose columns are one equal track per element, two at the Tablet breakpoint while it holds more, one at the Phone (item A1.4).`) — no caso, uma div simples, sem estilos. A barra de status lê o envolvimento (`src/i18n/locales/pt-BR.json:2028` `"status.wrappedManyPlain": "Envolvi {count} elementos em {wrapper}.",`). Uma envoltória em torno de um elemento posicionado, ou de elementos que não estavam lado a lado, é perguntada antes (`src/i18n/locales/pt-BR.json:561` `"dialog.wrap.message": "Colocar estes elementos juntos pode mudar a posição deles na página. Continuar?",`) — o Cancelar não muda nada (`src/i18n/locales/pt-BR.json:1699` `"status.confirmation.cancelled": "Cancelado: nada mudou.",`) e o Envolver confirma (`src/i18n/locales/pt-BR.json:562` `"dialog.wrap.confirm": "Envolver",`). A raiz da página não pode ser envolvida (`status.wrap.root`) e seleção vazia é recusada com `refusal.nothingSelected`. As portas — D no canvas e na árvore de Camadas, o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2224 — element.wrapGrid
- **Onde:** `manifest/commands/structure.json:2317` `"id": "element.wrapGrid",`
- **Tratador:** `src/app/commands.ts:375` `'element.wrapGrid': wrapGridCommand,`
- **Feature:** `src/app/features.ts:228` `'layout-actions': registerFeature('layout-actions'),`
- **Recusa declarada:** `manifest/commands/structure.json:2324` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Envolver a seleção numa grade, pelo rótulo "Envolver em uma grade" (`src/i18n/locales/pt-BR.json:525` `"command.wrapGrid": "Envolver em uma grade",`). As ações de envolver põem os elementos selecionados numa envoltória nova no índice do primeiro, selecionada depois de um passo de desfazer (`manifest/features/21-layout-and-structure.json:27` `The wrap commands put the selected elements in a new wrapper at the first one's index, selected after one undo step: a container (a plain div, no styles), or a grid whose columns are one equal track per element, two at the Tablet breakpoint while it holds more, one at the Phone (item A1.4).`) — no caso, uma grade cujas colunas são uma faixa igual por elemento, duas no Tablet enquanto guarda mais, uma no Phone. A barra de status lê o envolvimento (`src/i18n/locales/pt-BR.json:2025` `"status.wrappedMany": "{count} elementos envolvidos em {wrapper} ({styles}).",`). Uma envoltória em torno de um elemento posicionado, ou de elementos que não estavam lado a lado, é perguntada antes, com `dialog.wrap.message` e `dialog.wrap.confirm` (`src/i18n/locales/pt-BR.json:561` `"dialog.wrap.message": "Colocar estes elementos juntos pode mudar a posição deles na página. Continuar?",`). A raiz da página não pode ser envolvida (`status.wrap.root`) e seleção vazia é recusada com `refusal.nothingSelected`. As portas — G no canvas e na árvore de Camadas, o menu de contexto, o menu Organizar e a barra de comandos — enviam só a intenção (G3); valem G1, G2, G6 e G7.

## REQ-2301 — style.set (Definir {property} como {value})
- **Onde:** `manifest/commands/style.json:5` `"id": "style.set",`
- **Tratador:** `src/app/commands.ts:389` `'style.set': setStyleCommand,`
- **Feature:** `src/app/features.ts:62` `'inspector-number-fields': registerFeature('inspector-number-fields'),`
- **Recusa declarada:** `manifest/commands/style.json:29` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve o valor de uma propriedade a partir de um campo do inspector, do painel rápido e de outras portas de campo, com a unidade junto ao número; é o comando que todos esses campos usam, e o rótulo é "Definir {property} como {value}" (`src/i18n/locales/pt-BR.json:469` `"command.setProperty": "Definir {property} como {value}",`). O intent da feature que o introduz diz que pressionar Enter grava o valor com a sua unidade no documento e o estilo calculado no iframe confere (`manifest/features/04-inspector.json:1488` `"Enter writes the value with its unit into the document JSON and the computed style in the iframe matches it.",`); o cenário `typing-a-width-and-enter-sets-it-in-one-undo-step` (`manifest/features/04-inspector.json:1498` `"id": "typing-a-width-and-enter-sets-it-in-one-undo-step",`) grava width 240 como "240px", e o cenário `arithmetic-typed-in-the-field-is-worked-out` (`manifest/features/04-inspector.json:1737` `"id": "arithmetic-typed-in-the-field-is-worked-out",`) resolve a conta digitada. Um valor que o campo não aceita é recusado e o anterior fica (`manifest/features/04-inspector.json:1491` `"Invalid input is rejected with a message and the previous value stays; Escape restores the previous value.",`), com a mensagem `status.value.invalid` — "{property}: \"{value}\" não é um valor aceito por este campo." (`src/i18n/locales/pt-BR.json:2009` `"status.value.invalid": "{property}: \"{value}\" não é um valor aceito por este campo.",`) — e a gravação bem-sucedida anuncia `status.style.set` — "{property} de {name}: {value}." (`src/i18n/locales/pt-BR.json:1950` `"status.style.set": "{property} de {name}: {value}.",`). A propriedade só é escrita quando a seleção é editável (`manifest/commands/style.json:28` `"predicate": "editableSelection",`); fora disso a porta é recusada com `status.locked.edit` — "Desbloqueie {name} antes de alterá-lo." (`src/i18n/locales/pt-BR.json:1845` `"status.locked.edit": "Desbloqueie {name} antes de alterá-lo.",`) — e as demais recusas do comando são `status.value.invalid`, `status.locked.byAncestor` e `status.styleState.notApplicable` (`manifest/commands/style.json:32` `"status.value.invalid",`). Pelas regras do editor: G1 — a edição é gravada no contexto em que foi feita (elementos, breakpoint, estado, classe-alvo, quadro-chave); G2 — o Enter/commit é comando que altera o documento, então a digitação pendente de outro campo é gravada antes, no contexto da digitação; G3 — todas as portas enviam só a intenção, o texto do campo e a propriedade; G7 — o canvas renderiza o documento alterado.

## REQ-2302 — style.setSpacing (Definir {box})
- **Onde:** `manifest/commands/style.json:5463` `"id": "style.setSpacing",`
- **Tratador:** `src/app/commands.ts:390` `'style.setSpacing': setSpacingCommand,`
- **Feature:** `src/app/features.ts:67` `'props-spacing': registerFeature('props-spacing'),`
- **Recusa declarada:** `manifest/commands/style.json:5504` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve o espaçamento interno ou externo (preenchimento ou margem) de um lado ou dos quatro lados, a partir do diagrama de caixa; o rótulo é "Definir {box}" (`src/i18n/locales/pt-BR.json:474` `"command.setSpacing": "Definir {box}",`). O intent da feature diz que lados vinculados mudam juntos: um comando escreve as quatro longhands (margin-top, margin-right, margin-bottom, margin-left) como um passo de desfazer, e lados soltos escrevem a sua própria longhand (`manifest/features/04-inspector.json:9386` `"Linked sides change together: one command writes the four longhands (margin-top, margin-right, margin-bottom, margin-left) as one undo step; unlinked sides write their own longhand.",`); margens negativas são aceitas e preenchimento negativo é recusado com mensagem (`manifest/features/04-inspector.json:9387` `"Negative margins are accepted; negative padding is rejected with a message.",`). O cenário `a-linked-padding-writes-the-four-sides-in-one-undo-step` (`manifest/features/04-inspector.json:10061` `"door": "style.setSpacing#inspector-padding-box-model",`) grava os quatro lados numa só edição. A gravação anuncia `status.spacing.set` — "{property} de {name}: {value}." (`src/i18n/locales/pt-BR.json:1944` `"status.spacing.set": "{property} de {name}: {value}.",`) — e o preenchimento negativo é recusado com `status.value.negativePadding` — "O espaçamento interno não pode ser negativo." (`src/i18n/locales/pt-BR.json:2010` `"status.value.negativePadding": "O espaçamento interno não pode ser negativo.",`). A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:5503` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`; a longhand e o sinal da margem seguem as recusas `status.value.invalid`, `status.value.negativePadding`, `status.locked.edit`, `status.styleState.notApplicable` e `status.locked.byAncestor` (`manifest/commands/style.json:5508` `"status.value.negativePadding",`). Pelas regras do editor: G1 — o espaçamento é gravado no contexto em que foi editado; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o diagrama de caixa e as bandas dos canvas (padding e margin) enviam só a intenção, o lado e a caixa; G7 — o canvas renderiza o espaçamento gravado.

## REQ-2303 — inspector.toggleSpacingLink (Vincular os quatro lados)
- **Onde:** `manifest/commands/style.json:6050` `"id": "inspector.toggleSpacingLink",`
- **Tratador:** `src/app/commands.ts:395` `'inspector.toggleSpacingLink': toggleSpacingLink,`
- **Feature:** `src/app/features.ts:67` `'props-spacing': registerFeature('props-spacing'),`
- **Comportamento esperado:** Liga ou desliga o vínculo dos quatro lados de uma caixa (preenchimento ou margem), mudando como o diagrama passa a ser editado; o rótulo é "Vincular os quatro lados" (`src/i18n/locales/pt-BR.json:1079` `"inspector.spacing.linkAll": "Vincular os quatro lados",`). O cenário `the-link-changes-how-the-box-is-edited-and-writes-nothing` mostra que o vínculo não escreve no documento e não entra na pilha (`manifest/features/04-inspector.json:10315` `"key": "status.spacing.linked",`), e o comando não é desfazível (`manifest/commands/style.json:6071` `"undoable": false`), com disponibilidade sempre e sem recusa declarada (`manifest/commands/style.json:6066` `"refusalKey": null`). A intenção do vínculo é anunciada por `status.spacing.linked` — "{box}: os quatro lados agora mudam juntos." (`src/i18n/locales/pt-BR.json:1943` `"status.spacing.linked": "{box}: os quatro lados agora mudam juntos.",`). Pelas regras do editor: G1 — o comando não grava no documento, logo não carrega contexto de escrita; G2 — é comando que vem de fora do campo, então a digitação pendente é gravada antes; G3 — a única porta, o botão do inspector, envia só a intenção com a caixa; G6 — o vínculo é estado de interface e a seleção continua lida da store.

## REQ-2304 — style.setBorder (Definir a borda)
- **Onde:** `manifest/commands/style.json:6103` `"id": "style.setBorder",`
- **Tratador:** `src/app/commands.ts:406` `'style.setBorder': setBorderCommand,`
- **Feature:** `src/app/features.ts:77` `'props-border-outline': registerFeature('props-border-outline'),`
- **Recusa declarada:** `manifest/commands/style.json:6142` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve largura, estilo e cor da borda de um lado ou de todos os lados; o rótulo é "Definir a borda" (`src/i18n/locales/pt-BR.json:449` `"command.setBorder": "Definir a borda",`). O intent da feature diz que edições de todos os lados escrevem as longhands de largura, estilo e cor de cada lado num comando e num passo de desfazer, edições de uma só borda escrevem as longhands daquele lado, e as bordas calculadas no iframe conferem (`manifest/features/04-inspector.json:23119` `"All-sides edits write the width, style and colour longhands of every side in one command and one undo step; single-edge edits write the longhands of that side only; the computed borders in the iframe match.",`); o controle de estilo oferece todos os keywords da lista gerada de border-style (`manifest/features/04-inspector.json:23118` `"The border style control offers every keyword of the generated border-style list (none, hidden, dotted, dashed, solid, double, groove, ridge, inset, outset).",`). O cenário `escape-in-the-border-field-puts-its-value-back` mostra que o Escape no campo da borda devolve o valor e nada é gravado (`manifest/features/04-inspector.json:25204` `"door": "field.cancel#key-escape-in-command-field",`). A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:6141` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`; a lista de recusas traz `status.value.invalid`, `status.styleState.notApplicable` e `status.locked.byAncestor` (`manifest/commands/style.json:6145` `"status.value.invalid",`). Pelas regras do editor: G1 — a borda é gravada no contexto em que foi editada; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o editor de borda, o painel rápido e as alças de borda do canvas enviam só a intenção, o lado e os valores; G7 — o canvas renderiza a borda gravada.

## REQ-2305 — style.setRadius (Definir o raio)
- **Onde:** `manifest/commands/style.json:6751` `"id": "style.setRadius",`
- **Tratador:** `src/app/commands.ts:407` `'style.setRadius': setRadiusCommand,`
- **Feature:** `src/app/features.ts:77` `'props-border-outline': registerFeature('props-border-outline'),`
- **Recusa declarada:** `manifest/commands/style.json:6780` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve o raio de um canto ou dos quatro cantos; o rótulo é "Definir o raio" (`src/i18n/locales/pt-BR.json:472` `"command.setRadius": "Definir o raio",`). O intent da feature diz que os valores de raio por canto são gravados e os raios calculados conferem (`manifest/features/04-inspector.json:23120` `"Per-corner radius values are written and the computed border radii match.",`). O cenário `a-bare-radius-uses-the-default-unit` (`manifest/features/04-inspector.json:25264` `"id": "a-bare-radius-uses-the-default-unit",`) grava o número solto 12 como "12px", e o cenário `radius-arithmetic-uses-the-length-interpreter` (`manifest/features/04-inspector.json:25362` `"id": "radius-arithmetic-uses-the-length-interpreter",`) resolve "16*2" como "32px"; um raio que não é comprimento é recusado. A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:6779` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`. Pelas regras do editor: G1 — o raio é gravado no contexto em que foi editado; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o editor de raio do inspector e a alça de canto do canvas enviam só a intenção, os cantos e o valor; G7 — o canvas renderiza o raio gravado.

## REQ-2306 — style.setBackgroundImage (Definir a imagem de fundo)
- **Onde:** `manifest/commands/style.json:7053` `"id": "style.setBackgroundImage",`
- **Tratador:** `src/app/commands.ts:408` `'style.setBackgroundImage': setBackgroundImageCommand,`
- **Feature:** `src/app/features.ts:75` `'props-background': registerFeature('props-background'),`
- **Recusa declarada:** `manifest/commands/style.json:7086` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve a imagem de fundo (um endereço, um gradiente ou "none"); o rótulo é "Definir a imagem de fundo" (`src/i18n/locales/pt-BR.json:448` `"command.setBackgroundImage": "Definir a imagem de fundo",`). O intent da feature diz que cada valor é escrito no documento e o fundo calculado da seção no iframe confere (`manifest/features/04-inspector.json:19775` `"Each value is written to the document JSON and the computed background of the section in the iframe matches.",`). O cenário `an-image-address-is-written-as-a-url` (`manifest/features/04-inspector.json:19781` `"id": "an-image-address-is-written-as-a-url",`) grava o endereço como url(...), o valor "none" tira a imagem, e um endereço com javaScript é recusado com `status.url.unsafe` — "Este endereço não é permitido: {url}" (`src/i18n/locales/pt-BR.json:2008` `"status.url.unsafe": "Este endereço não é permitido: {url}",`); texto que não é imagem é recusado com `status.value.invalid`. A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:7085` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`; a lista de recusas traz `status.value.invalid`, `status.url.unsafe`, `status.gradient.none`, `status.gradient.minStops` e `status.styleState.notApplicable` (`manifest/commands/style.json:7090` `"status.url.unsafe",`). Pelas regras do editor: G1 — a imagem é gravada no contexto em que foi editada; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o campo do inspector, o editor de gradiente e o painel rápido enviam só a intenção e o valor; G7 — o canvas renderiza o fundo gravado.

## REQ-2307 — style.setShadows (Definir as sombras)
- **Onde:** `manifest/commands/style.json:7708` `"id": "style.setShadows",`
- **Tratador:** `src/app/commands.ts:418` `'style.setShadows': setShadowsCommand,`
- **Feature:** `src/app/features.ts:79` `'shadow-editor': registerFeature('shadow-editor'),`
- **Recusa declarada:** `manifest/commands/style.json:7746` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve as camadas de sombra de caixa ou de texto; o rótulo é "Definir as sombras" (`src/i18n/locales/pt-BR.json:473` `"command.setShadows": "Definir as sombras",`). O intent da feature diz que as camadas são gravadas no documento como um valor de box-shadow composto de camadas tipadas (X, Y, desfoque, espalhamento, cor, interior, oculta), na ordem das camadas, por um comando por mudança; o códex escreve as camadas visíveis como a lista de box-shadow e as camadas ocultas ficam no documento mas fora do CSS (`manifest/features/04-inspector.json:26164` `"The shadow layers are written to the document JSON as one box-shadow value made of typed layers (X, Y, blur, spread, colour, inset, hidden), in layer order, by one command per change; the codec writes the visible layers as the box-shadow list, and hidden layers stay in the document but are left out of the CSS.",`). O cenário `a-text-shadow-typed-as-css-writes-its-layers` (`manifest/features/04-inspector.json:29381` `"id": "a-text-shadow-typed-as-css-writes-its-layers",`) grava o texto "0 1px 2px #000" como camadas, e o cenário `a-negative-blur-is-refused` (`manifest/features/04-inspector.json:29069` `"id": "a-negative-blur-is-refused",`) recusa um desfoque negativo com `status.value.invalid`. O cenário `dragging-box-shadow-layer-2-over-layer-1-swaps-them` mostra a reordenação por arraste (`manifest/features/04-inspector.json:29517` `"door": "style.setShadows#panel-drag-box-shadow-row",`). A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:7745` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`. Pelas regras do editor: G1 — a sombra é gravada no contexto em que foi editada; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — os campos do inspector, o pad de luz, as setas do pad, o arraste da camada e as alças de sombra do canvas enviam só a intenção e a edição; G7 — o canvas renderiza as sombras gravadas.

## REQ-2308 — style.setFilter (Definir os filtros)
- **Onde:** `manifest/commands/style.json:8694` `"id": "style.setFilter",`
- **Tratador:** `src/app/commands.ts:419` `'style.setFilter': setFilterCommand,`
- **Feature:** `src/app/features.ts:80` `'props-filters-clip': registerFeature('props-filters-clip'),`
- **Recusa declarada:** `manifest/commands/style.json:8717` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve a lista de filtros de uma propriedade; o rótulo é "Definir os filtros" (`src/i18n/locales/pt-BR.json:457` `"command.setFilter": "Definir os filtros",`). O intent da feature diz que os controles de filtro compõem um único valor de filter numa ordem fixa e o gravam no documento, e o filtro calculado confere (`manifest/features/04-inspector.json:29751` `"The filter sliders compose one filter value in a fixed order and write it to the document JSON; the computed filter matches.",`); um botão "Remover os filtros" [inspector.filters.remove] tira a propriedade do documento (`manifest/features/04-inspector.json:29752` `"A 'Remove filters' [inspector.filters.remove] button in the filter group removes the filter property from the document JSON.",`). O cenário `a-second-filter-keeps-the-first-in-its-unit` (`manifest/features/04-inspector.json:30364` `"id": "a-second-filter-keeps-the-first-in-its-unit",`) grava "blur(4px) brightness(120%)", e a remoção anuncia `status.style.reset` — "Valor de {property} em {name} voltou ao padrão." (`src/i18n/locales/pt-BR.json:1948` `"status.style.reset": "Valor de {property} em {name} voltou ao padrão.",`). Um filtro que o navegador não aceita é recusado com `status.value.invalid`. A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:8716` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`. Pelas regras do editor: G1 — o filtro é gravado no contexto em que foi editado; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — os controles de filtro e o painel rápido enviam só a intenção e a lista de funções; G7 — o canvas renderiza o filtro gravado.

## REQ-2309 — style.setTransform (Definir a transformação)
- **Onde:** `manifest/commands/style.json:9139` `"id": "style.setTransform",`
- **Tratador:** `src/app/commands.ts:420` `'style.setTransform': setTransformCommand,`
- **Feature:** `src/app/features.ts:81` `'props-transforms': registerFeature('props-transforms'),`
- **Recusa declarada:** `manifest/commands/style.json:9162` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve as partes da transformação (as funções que translate, rotate e scale não cobrem, como o skew); o rótulo é "Definir a transformação" (`src/i18n/locales/pt-BR.json:482` `"command.setTransform": "Definir a transformação",`). O intent da feature diz que Skew X/Y compõem o valor de transform, que só guarda as funções que translate, rotate e scale não cobrem, e que a transformação calculada no iframe confere (`manifest/features/04-inspector.json:30983` `"Move X/Y write translate, Rotate writes rotate and Scale writes scale, each its own property in the document JSON; Skew X/Y compose the transform value, which holds only the functions translate, rotate and scale do not cover; the computed translate, rotate, scale and transform in the iframe match.",`). O cenário `skew-x-sets-its-function-in-the-transform` (`manifest/features/04-inspector.json:31372` `"id": "skew-x-sets-its-function-in-the-transform",`) grava "skewX(10deg)"; um skew que o navegador não aceita é recusado com `status.value.invalid`. A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:9161` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`. Pelas regras do editor: G1 — a transformação é gravada no contexto em que foi editada; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o campo do inspector e o painel rápido enviam só a intenção e as partes; G7 — o canvas renderiza a transformação gravada.

## REQ-2310 — style.setAlignment (Alinhar o conteúdo)
- **Onde:** `manifest/commands/style.json:9329` `"id": "style.setAlignment",`
- **Tratador:** `src/app/commands.ts:421` `'style.setAlignment': setAlignmentCommand,`
- **Feature:** `src/app/features.ts:64` `'props-flex-container': registerFeature('props-flex-container'),`
- **Recusa declarada:** `manifest/commands/style.json:9355` `"refusalKey": "status.layout.notFlex"`
- **Comportamento esperado:** Escreve justify-content e align-items juntos, pelo eixo da direção corrente, a partir da matriz de alinhamento; o rótulo é "Alinhar o conteúdo" (`src/i18n/locales/pt-BR.json:444` `"command.setAlignment": "Alinhar o conteúdo",`). O intent da feature diz que cada célula da matriz define justify-content e align-items juntos, mapeados para a direção corrente (`manifest/features/04-inspector.json:4144` `"Each matrix cell sets justify-content and align-items together, mapped to the current direction; Stretch sets align-items:stretch and Spread sets justify-content:space-between.",`). A gravação anuncia `status.alignment.set` — "Alinhamento de {name}: {justify} · {align}." (`src/i18n/locales/pt-BR.json:1646` `"status.alignment.set": "Alinhamento de {name}: {justify} · {align}.",`). A disponibilidade só admite contêiner flex ou grid (`manifest/commands/style.json:9354` `"predicate": "flexOrGridContainer",`), e fora disso a porta é recusada com `status.layout.notFlex` — "O alinhamento se aplica a contêineres flex e grid." (`src/i18n/locales/pt-BR.json:1833` `"status.layout.notFlex": "O alinhamento se aplica a contêineres flex e grid.",`). Pelas regras do editor: G1 — o alinhamento é gravado no contexto em que foi editado; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — a matriz do inspector é a única porta e envia só a intenção, x e y; G7 — o canvas renderiza o alinhamento gravado.

## REQ-2311 — style.setCustomDeclarations (Definir declarações personalizadas)
- **Onde:** `manifest/commands/style.json:9402` `"id": "style.setCustomDeclarations",`
- **Tratador:** `src/app/commands.ts:422` `'style.setCustomDeclarations': setCustomDeclarationsCommand,`
- **Feature:** `src/app/features.ts:84` `'props-attributes': registerFeature('props-attributes'),`
- **Recusa declarada:** `manifest/commands/style.json:9420` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve declarações CSS personalizadas nos estilos do elemento; o rótulo é "Definir declarações personalizadas" (`src/i18n/locales/pt-BR.json:454` `"command.setCustomDeclarations": "Definir declarações personalizadas",`). O intent da feature diz que as declarações são validadas e guardadas com os estilos do elemento (`manifest/features/04-inspector.json:34422` `"Classes are stored as a list; custom declarations are validated and stored with the element's styles.",`). O cenário `a-custom-property-and-a-shorthand-are-taken` (`manifest/features/04-inspector.json:35335` `"id": "a-custom-property-and-a-shorthand-are-taken",`) grava uma propriedade personalizada e uma abreviação, anunciando `status.style.declarationsSet` — "{name} tem {count} declarações." (`src/i18n/locales/pt-BR.json:1946` `"status.style.declarationsSet": "{name} tem {count} declarações.",`). Uma linha que não é "propriedade: valor" é recusada com `status.css.notDeclaration` — "Linha {line}: \"{text}\" não é \"propriedade: valor\"." (`src/i18n/locales/pt-BR.json:1710` `"status.css.notDeclaration": "Linha {line}: \"{text}\" não é \"propriedade: valor\".",`) — e uma propriedade que o editor não escreve é recusada com `status.css.unknownProperty` — "Linha {line}: {property} não é uma propriedade que o editor escreve." (`src/i18n/locales/pt-BR.json:1711` `"status.css.unknownProperty": "Linha {line}: {property} não é uma propriedade que o editor escreve.",`). A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:9419` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`; a lista de recusas traz `status.css.notDeclaration`, `status.css.unknownProperty` e `status.css.badValue` (`manifest/commands/style.json:9423` `"status.css.notDeclaration",`). Pelas regras do editor: G1 — as declarações são gravadas no contexto em que foram editadas; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o campo de declarações do inspector é a única porta e envia só a intenção e o texto; G7 — o canvas renderiza as declarações gravadas.

## REQ-2312 — style.applyCssRule (Aplicar o CSS)
- **Onde:** `manifest/commands/style.json:9468` `"id": "style.applyCssRule",`
- **Tratador:** `src/app/commands.ts:423` `'style.applyCssRule': applyCssRuleCommand,`
- **Feature:** `src/app/features.ts:195` `'code-panel-edit-css': registerFeature('code-panel-edit-css'),`
- **Comportamento esperado:** Aplica a regra CSS editada no painel de código aos estilos do elemento selecionado; o rótulo é "Aplicar o CSS" (`src/i18n/locales/pt-BR.json:287` `"command.applyCss": "Aplicar o CSS",`). O intent da feature diz que aplicar substitui os estilos do elemento no documento pelas declarações da sua regra como um passo de desfazer, e o inspector e o canvas se atualizam (`manifest/features/17-code-panel.json:758` `"Applying replaces the element's styles in the document JSON with the declarations of its rule as one undo step; the inspector and canvas update.",`); um CSS inválido é recusado com a linha e o motivo, e o documento fica inalterado (`manifest/features/17-code-panel.json:759` `"Invalid CSS is refused with the line and reason, and the document JSON is unchanged.",`); a regra é editada para o breakpoint e o estado ativos (`manifest/features/17-code-panel.json:760` `"The rule is edited for the active breakpoint and state."`). O cenário `a-rule-typed-in-the-pane-styles-the-element` grava color "#aa0000" e anuncia `status.css.applied` (`manifest/features/17-code-panel.json:825` `"key": "status.css.applied",`); o cenário `a-piece-that-is-no-declaration-is-refused-with-its-line` (`manifest/features/17-code-panel.json:1020` `"key": "status.css.notDeclaration",`) recusa "this is no css", o cenário de propriedade desconhecida recusa "colr: red;" com `status.css.unknownProperty` e o de valor em chaves recusa "color: {red};" com `status.css.badValue` — "Linha {line}: \"{value}\" não é um valor de {property}." (`src/i18n/locales/pt-BR.json:1709` `"status.css.badValue": "Linha {line}: \"{value}\" não é um valor de {property}.",`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:9481` `"refusalKey": null`), e o elemento bloqueado é recusado com `status.locked.edit` (`manifest/commands/style.json:9487` `"status.locked.edit"`). Pelas regras do editor: G1 — a regra é aplicada ao breakpoint e ao estado ativos; G2 — aplicar é comando que vem de fora do campo e altera o documento, então a digitação pendente é gravada antes; G3 — o botão Aplicar do painel de código é a única porta e envia só a intenção e o texto do CSS; G7 — o canvas renderiza os estilos aplicados.

## REQ-2313 — style.reset (Redefinir este valor)
- **Onde:** `manifest/commands/style.json:9529` `"id": "style.reset",`
- **Tratador:** `src/app/commands.ts:424` `'style.reset': resetValueCommand,`
- **Feature:** `src/app/features.ts:85` `'inspector-provenance-reset': registerFeature('inspector-provenance-reset'),`
- **Recusa declarada:** `manifest/commands/style.json:9542` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Remove uma propriedade dos estilos do elemento, voltando o campo ao valor herdado ou padrão; o rótulo é "Redefinir este valor" (`src/i18n/locales/pt-BR.json:434` `"command.resetValue": "Redefinir este valor",`). O intent da feature diz que redefinir uma propriedade a tira dos estilos do elemento no documento e o campo passa a mostrar o valor herdado ou padrão num estilo apagado (`manifest/features/04-inspector.json:35739` `"Resetting a property removes it from the element styles in the document JSON and the field shows the inherited or default value in a muted style.",`). O cenário `reset-this-value-takes-the-colour-away` tira a cor e anuncia `status.style.reset` — "Valor de {property} em {name} voltou ao padrão." (`src/i18n/locales/pt-BR.json:1948` `"status.style.reset": "Valor de {property} em {name} voltou ao padrão.",`). A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:9541` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`. Pelas regras do editor: G1 — a redefinição é gravada no contexto em que foi feita; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — o botão de redefinir do campo é a única porta e envia só a intenção e a propriedade; G7 — o canvas renderiza o documento sem a propriedade.

## REQ-2314 — style.resetAll (Redefinir todos os valores)
- **Onde:** `manifest/commands/style.json:9587` `"id": "style.resetAll",`
- **Tratador:** `src/app/commands.ts:425` `'style.resetAll': resetAllCommand,`
- **Feature:** `src/app/features.ts:85` `'inspector-provenance-reset': registerFeature('inspector-provenance-reset'),`
- **Recusa declarada:** `manifest/commands/style.json:9594` `"refusalKey": "refusal.nothingSelected"`
- **Comportamento esperado:** Remove todos os valores de estilo do elemento selecionado num só passo de desfazer; o rótulo é "Redefinir todos os valores" (`src/i18n/locales/pt-BR.json:433` `"command.resetAllValues": "Redefinir todos os valores",`). O intent da feature diz que o menu de ações do elemento ganha "Redefinir todos os valores" [command.resetAllValues], que tira todos os valores de estilo do elemento num passo de desfazer (`manifest/features/04-inspector.json:35740` `"The element actions menu gains 'Reset every value' [command.resetAllValues], which removes all style values of the element in one undo step."`). O cenário `reset-every-value-takes-them-all-away` grava os estilos do elemento como objeto vazio e anuncia `status.style.resetAll` — "Todos os valores de {name} redefinidos." (`src/i18n/locales/pt-BR.json:1949` `"status.style.resetAll": "Todos os valores de {name} redefinidos.",`); o cenário `a-locked-element-keeps-its-values` (`manifest/features/04-inspector.json:36006` `"id": "a-locked-element-keeps-its-values",`) mostra que o elemento bloqueado mantém os valores e a porta é recusada. A disponibilidade exige seleção (`manifest/commands/style.json:9593` `"predicate": "hasSelection",`) e sem seleção a porta é recusada com `refusal.nothingSelected` — "Selecione um elemento primeiro." (`src/i18n/locales/pt-BR.json:1604` `"refusal.nothingSelected": "Selecione um elemento primeiro.",`). Pelas regras do editor: G1 — a redefinição é gravada no contexto em que foi feita; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — o item do menu de ações do elemento e a barra de comandos enviam só a intenção; G6 — a seleção é lida da store; G7 — o canvas renderiza o documento sem os valores.

## REQ-2315 — field.step (Ajustar o valor)
- **Onde:** `manifest/commands/style.json:9654` `"id": "field.step",`
- **Tratador:** `src/app/commands.ts:426` `'field.step': stepField,`
- **Feature:** `src/app/features.ts:62` `'inspector-number-fields': registerFeature('inspector-number-fields'),`
- **Comportamento esperado:** Ajusta o valor de um campo numérico por um passo ou por uma página, para cima ou para baixo, com multiplicadores pelas teclas modificadoras; o rótulo é "Ajustar o valor" (`src/i18n/locales/pt-BR.json:336` `"command.fieldStep": "Ajustar o valor",`). O intent da feature diz que ArrowUp/ArrowDown passam de 1 em 1, com Shift de 10 em 10 e com Alt de 0,1 em 0,1 (`manifest/features/04-inspector.json:1490` `"ArrowUp/ArrowDown step by 1, with Shift by 10, with Alt by 0.1; dragging the label scrubs with the same multipliers.",`), e os cenários `arrow-up-steps-the-width-by-one`, `shift-arrow-up-steps-the-width-by-ten`, `alt-arrow-down-steps-the-width-by-a-tenth`, `page-up-steps-the-width-by-ten` e `page-down-steps-the-width-down-by-ten` cobrem as teclas e `the-step-up-button-steps-the-width-by-one` e `the-step-down-button-with-shift-steps-the-width-down-by-ten` cobrem os botões. A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:9696` `"refusalKey": null`), e as recusas do comando são `status.locked.edit`, `status.locked.byAncestor`, `status.value.notSteppable` e `status.styleState.notApplicable` (`manifest/commands/style.json:9701` `"status.value.notSteppable",`). Pelas regras do editor: G1 — o novo valor é gravado no contexto em que o ajuste foi feito; G2 — o ajuste é comando que altera o documento, então a digitação pendente é gravada antes, no contexto da digitação; G3 — as teclas ArrowUp/Down e PageUp/Down e os botões de passo enviam só a intenção, a direção, o tamanho e a propriedade.

## REQ-2316 — field.scrub (Arraste para mudar o valor)
- **Onde:** `manifest/commands/style.json:9915` `"id": "field.scrub",`
- **Tratador:** `src/app/commands.ts:427` `'field.scrub': scrubField,`
- **Feature:** `src/app/features.ts:62` `'inspector-number-fields': registerFeature('inspector-number-fields'),`
- **Comportamento esperado:** Muda o valor de um campo numérico arrastando o rótulo, com multiplicadores pelas teclas modificadoras; o rótulo é "Arraste para mudar o valor" (`src/i18n/locales/pt-BR.json:334` `"command.fieldScrub": "Arraste para mudar o valor",`). O intent da feature diz que arrastar o rótulo muda o valor com os mesmos multiplicadores dos passos e que um gesto inteiro de arraste ou um commit digitado é exatamente um passo de desfazer (`manifest/features/04-inspector.json:1492` `"A whole scrub gesture or one typed commit is exactly one undo step.",`). Os cenários `dragging-the-label-scrubs-the-width-in-one-undo-step`, `shift-while-scrubbing-steps-by-ten`, `alt-while-scrubbing-steps-by-a-tenth` e `scrubbing-below-zero-stops-at-zero` cobrem o arraste e o limite em zero; o cenário `escape-during-a-scrub-puts-the-width-back` cancela o arraste, anunciando `status.drag.cancelled`. A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:9946` `"refusalKey": null`). Pelas regras do editor: G1 — o valor é gravado no contexto em que o arraste foi feito; G2 — o arraste é comando que altera o documento, então a digitação pendente é gravada antes; G3 — o arraste do rótulo é a única porta e envia só a intenção, a propriedade, a distância e o modificador.

## REQ-2317 — field.setUnit (Mudar a unidade)
- **Onde:** `manifest/commands/style.json:9986` `"id": "field.setUnit",`
- **Tratador:** `src/app/commands.ts:428` `'field.setUnit': setFieldUnit,`
- **Feature:** `src/app/features.ts:62` `'inspector-number-fields': registerFeature('inspector-number-fields'),`
- **Comportamento esperado:** Muda a unidade de um valor pelo menu de unidades do campo, convertendo o número; o rótulo é "Mudar a unidade" (`src/i18n/locales/pt-BR.json:335` `"command.fieldSetUnit": "Mudar a unidade",`). O intent da feature diz que o menu de unidades oferece px, %, em, rem, vw, vh e os keywords válidos para a propriedade (`manifest/features/04-inspector.json:1489` `"The unit menu offers px, %, em, rem, vw, vh and the keywords valid for the property (auto, fit-content, min-content, max-content where valid).",`). Os cenários `the-unit-menu-converts-the-width-to-points`, `a-keyword-from-the-unit-menu-sets-it` e `a-unit-the-width-cannot-be-converted-to-is-refused` cobrem a conversão, o keyword e a recusa. Uma unidade para a qual o valor não pode ser convertido é recusada com `status.value.unitNotConverted` — "Não foi possível converter o valor para {unit}." (`src/i18n/locales/pt-BR.json:2012` `"status.value.unitNotConverted": "Não foi possível converter o valor para {unit}.",`), a partir da recusa declarada na lista do comando (`manifest/commands/style.json:10012` `"status.value.unitNotConverted",`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10009` `"refusalKey": null`). Pelas regras do editor: G1 — a mudança de unidade é gravada no contexto em que foi feita; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — o menu de unidades do campo é a única porta e envia só a intenção, a propriedade, o valor e a unidade.

## REQ-2318 — field.cancel (Voltar ao valor)
- **Onde:** `manifest/commands/style.json:10055` `"id": "field.cancel",`
- **Tratador:** `src/app/commands.ts:429` `'field.cancel': cancelField,`
- **Feature:** `src/app/features.ts:62` `'inspector-number-fields': registerFeature('inspector-number-fields'),`
- **Comportamento esperado:** Descarta o texto digitado num campo e volta ao valor anterior; o rótulo é "Voltar ao valor" (`src/i18n/locales/pt-BR.json:333` `"command.fieldCancel": "Voltar ao valor",`). O intent da feature diz que o Escape devolve o valor anterior (`manifest/features/04-inspector.json:1491` `"Invalid input is rejected with a message and the previous value stays; Escape restores the previous value.",`). Os cenários `escape-puts-the-typed-width-back-and-leaving-the-field-keeps-nothing`, `escape-in-a-spacing-side-discards-the-text-and-leaving-writes-nothing` e `escape-in-the-border-field-puts-its-value-back` cobrem a digitação pendente descartada sem gravar. O comando não é desfazível (`manifest/commands/style.json:10073` `"undoable": false`), a disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10068` `"refusalKey": null`). Pelas regras do editor: G1 — o comando não grava valor novo, apenas descarta a digitação pendente, logo não carrega contexto de escrita; G3 — o Escape no campo numérico, no campo de espaçamento e no campo de comando envia só a intenção e a propriedade.

## REQ-2319 — style.setGridTracks (Definir as trilhas da grade)
- **Onde:** `manifest/commands/style.json:10139` `"id": "style.setGridTracks",`
- **Tratador:** `src/app/commands.ts:409` `'style.setGridTracks': setGridTracksCommand,`
- **Feature:** `src/app/features.ts:65` `'props-grid-container': registerFeature('props-grid-container'),`
- **Recusa declarada:** `manifest/commands/style.json:10167` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve as trilhas da grade (colunas ou linhas): o valor de uma trilha, uma trilha a mais, a última trilha a menos, ou a expressão inteira de trilhas; o rótulo é "Definir as trilhas da grade" (`src/i18n/locales/pt-BR.json:459` `"command.setGridTracks": "Definir as trilhas da grade",`). O intent da feature diz que o editor de trilhas mostra um chip por trilha de coluna e escreve grid-template-columns (por exemplo '1fr 2fr 200px'), e que digitar uma expressão de trilhas substitui as trilhas e os chips se ajustam (`manifest/features/04-inspector.json:6083` `"The track editor shows one chip per column track and writes grid-template-columns (e.g. '1fr 2fr 200px').",`). Os cenários `add-column-appends-a-track`, `a-column-removed-gives-three-columns-back`, `the-second-track-written-keeps-its-place`, `a-row-added-keeps-the-repeat-form` e `the-second-row-written-keeps-its-place` cobrem a edição de trilha, e a gravação anuncia `status.style.set` — "{property} de {name}: {value}." (`src/i18n/locales/pt-BR.json:1950` `"status.style.set": "{property} de {name}: {value}.",`). Um valor que não é trilha é recusado com `status.value.invalid`. A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:10166` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`; a alça de trilha do editor de grade do canvas usa a mesma porta (`manifest/commands/style.json:10407` `"id": "handle-grid-track",`). Pelas regras do editor: G1 — a trilha é gravada no contexto em que foi editada; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — o campo de trilha do inspector, o botão de acrescentar e o de remover, a roda e a alça de trilha do canvas enviam só a intenção, a propriedade e a trilha; G7 — o canvas renderiza as trilhas gravadas.

## REQ-2320 — style.setGridItem (Definir o item da grade)
- **Onde:** `manifest/commands/style.json:10432` `"id": "style.setGridItem",`
- **Tratador:** `src/app/commands.ts:417` `'style.setGridItem': setGridItemCommand,`
- **Feature:** `src/app/features.ts:65` `'props-grid-container': registerFeature('props-grid-container'),`
- **Recusa declarada:** `manifest/commands/style.json:10455` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Escreve a posição e a extensão de um item na grade (coluna e linha); o rótulo é "Definir o item da grade" (`src/i18n/locales/pt-BR.json:458` `"command.setGridItem": "Definir o item da grade",`). O intent da feature diz que as linhas, o espaçamento, o fluxo automático, o alinhamento de itens e as áreas de modelo são escritos no documento (`manifest/features/04-inspector.json:6086` `"Rows, gap, auto flow, justify-items and template areas are written to the document JSON."`). Os cenários `a-card-spanning-two-columns-is-written`, `a-card-starting-at-the-second-column-is-written`, `a-row-span-of-two-is-written` e `a-row-starting-at-the-second-row-is-written` gravam a extensão e o início; o cenário `a-start-below-one-is-refused` recusa um início menor que 1 com `status.gridItem.noStart` — "O início deve ser um número inteiro a partir de 1." (`src/i18n/locales/pt-BR.json:1770` `"status.gridItem.noStart": "O início deve ser um número inteiro a partir de 1.",`). A disponibilidade é predicado `editableSelection` (`manifest/commands/style.json:10454` `"predicate": "editableSelection",`) e a recusa é `status.locked.edit`. Pelas regras do editor: G1 — o item é gravado no contexto em que foi editado; G2 — a edição é comando que altera o documento e grava a digitação pendente antes; G3 — os campos de início e de extensão de coluna e de linha enviam só a intenção, a propriedade, o início e a extensão; G7 — o canvas renderiza o item gravado.

## REQ-2321 — grid.enterEdit (Editar esta grade no canvas)
- **Onde:** `manifest/commands/style.json:10619` `"id": "grid.enterEdit",`
- **Tratador:** `src/app/commands.ts:410` `'grid.enterEdit': enterGridEdit,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Abre o editor de grade no canvas; o rótulo é "Editar esta grade no canvas" (`src/i18n/locales/pt-BR.json:2175` `"command.grid.enterEdit": "Editar esta grade no canvas",`). O intent da feature diz que o clique duplo abre o editor de grade: o canvas desenha os números das colunas e uma alça em cada limite de trilha, e o Escape do contexto próprio de teclas o deixa (`manifest/features/21-layout-and-structure.json:2044` `"The double click opens the grid editor: the canvas draws the numbers of its columns and a grip on every track boundary, and the Escape of its own key context leaves it.",`). O cenário `the-grid-editor-opens-from-the-arrange-menu` abre pelo menu Organizar (`manifest/features/21-layout-and-structure.json:2611` `"grid.enterEdit#menu-arrange"`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10632` `"refusalKey": null`), e a recusa do comando é `status.gridEdit.notGrid` — "{name} não é um contêiner de grade." (`src/i18n/locales/pt-BR.json:2185` `"status.gridEdit.notGrid": "{name} não é um contêiner de grade.",`). O comando não é desfazível (`manifest/commands/style.json:10639` `"undoable": false`). Pelas regras do editor: G1 — o comando não grava no documento, logo não carrega contexto de escrita; G2 — é comando que vem de fora de um campo, então a digitação pendente é gravada antes; G3 — a porta do clique duplo no canvas e o item do menu Organizar enviam só a intenção e o alvo; G4 — o editor de grade desenha-se sobre o canvas, não o cobre no ponto da ação.

## REQ-2322 — grid.exitEdit (Sair do editor de grade)
- **Onde:** `manifest/commands/style.json:10689` `"id": "grid.exitEdit",`
- **Tratador:** `src/app/commands.ts:411` `'grid.exitEdit': exitGridEdit,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Sai do editor de grade do canvas; o rótulo é "Sair do editor de grade" (`src/i18n/locales/pt-BR.json:2176` `"command.grid.exitEdit": "Sair do editor de grade",`). O intent da feature diz que o Escape do contexto próprio de teclas do editor de grade o deixa (`manifest/features/21-layout-and-structure.json:2044` `"The double click opens the grid editor: the canvas draws the numbers of its columns and a grip on every track boundary, and the Escape of its own key context leaves it.",`); o cenário `the-grid-editor-adds-a-column-and-escape-leaves-it` mostra o Escape deixando o editor (`manifest/features/21-layout-and-structure.json:2087` `"grid.exitEdit#key-escape-in-grid-edit"`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10696` `"refusalKey": null`), e o comando não é desfazível (`manifest/commands/style.json:10701` `"undoable": false`). Pelas regras do editor: G1 — o comando não grava no documento, logo não carrega contexto de escrita; G2 — é comando que vem de fora de um campo, então a digitação pendente é gravada antes; G3 — a tecla Escape do contexto do editor de grade é a única porta e envia só a intenção.

## REQ-2323 — grid.addTrack (Adicionar uma coluna)
- **Onde:** `manifest/commands/style.json:10727` `"id": "grid.addTrack",`
- **Tratador:** `src/app/commands.ts:412` `'grid.addTrack': addGridTrack,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Acrescenta uma trilha de coluna à grade pelo editor de grade do canvas; o rótulo é "Adicionar uma coluna" (`src/i18n/locales/pt-BR.json:2177` `"command.grid.addTrack": "Adicionar uma coluna",`). O intent da feature diz que mais acrescenta uma coluna e menos tira a última (`manifest/features/21-layout-and-structure.json:2045` `"Dragging a boundary grip writes grid-template-columns with that track sized in px (through the one owner of a grid`), e o cenário `the-grid-editor-adds-a-column-and-escape-leaves-it` grava grid-template-columns. O cenário `the-grid-editor-adds-a-column-and-escape-leaves-it` grava a trilha (`manifest/features/21-layout-and-structure.json:2114` `"/Page/Grid/@styles/desktop/base/grid-template-columns",`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10742` `"refusalKey": null`); a tecla "=" do editor de grade é a porta (`manifest/commands/style.json:10758` `"chord": "=",`). Pelas regras do editor: G1 — a trilha acrescentada é gravada no contexto em que foi feita; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — a tecla "=" do editor de grade é a única porta e envia só a intenção e a propriedade; G7 — o canvas renderiza a trilha acrescentada.

## REQ-2324 — grid.removeTrack (Remover a última coluna)
- **Onde:** `manifest/commands/style.json:10779` `"id": "grid.removeTrack",`
- **Tratador:** `src/app/commands.ts:413` `'grid.removeTrack': removeGridTrack,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Tira a última trilha de coluna da grade pelo editor de grade do canvas; o rótulo é "Remover a última coluna" (`src/i18n/locales/pt-BR.json:2178` `"command.grid.removeTrack": "Remover a última coluna",`). O intent da feature diz que menos tira a última trilha (`manifest/features/21-layout-and-structure.json:2045` `"Dragging a boundary grip writes grid-template-columns with that track sized in px (through the one owner of a grid`), e o cenário `removing-a-track-and-splitting-the-merged-cell` grava grid-template-columns reduzida (`manifest/features/21-layout-and-structure.json:2541` `"/Page/Grid/@styles/desktop/base/grid-template-columns"`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10794` `"refusalKey": null`); a tecla "-" do editor de grade é a porta (`manifest/commands/style.json:10810` `"chord": "-",`). Pelas regras do editor: G1 — a trilha removida é gravada no contexto em que foi removida; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — a tecla "-" do editor de grade é a única porta e envia só a intenção e a propriedade; G7 — o canvas renderiza a grade sem a trilha.

## REQ-2325 — grid.spanItem (Esticar o item por células)
- **Onde:** `manifest/commands/style.json:10831` `"id": "grid.spanItem",`
- **Tratador:** `src/app/commands.ts:414` `'grid.spanItem': spanGridItem,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Estica o item sobre as células cobertas pelo arraste da alça de canto, no editor de grade do canvas; o rótulo é "Esticar o item por células" (`src/i18n/locales/pt-BR.json:2179` `"command.grid.spanItem": "Esticar o item por células",`). O intent da feature diz que a alça de canto estica o item sobre as células que o arraste cobre, com o px dividido pela largura de uma trilha, lido da caixa do próprio item (`manifest/features/21-layout-and-structure.json:2047` `"The corner grip stretches the item over the cells the drag covers (the px divided by the width of one track, read from the item`). O cenário `the-corner-grip-stretches-the-item-over-two-columns` grava grid-column-start "span 2" e o fim "auto" (`manifest/features/21-layout-and-structure.json:2409` `"/Page/Grid/Cell/@styles/desktop/base/grid-column-start",`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10861` `"refusalKey": null`); a porta é a alça `handle-grid-span` (`manifest/commands/style.json:10874` `"id": "handle-grid-span",`). Pelas regras do editor: G1 — o item é gravado no contexto em que foi esticado; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — a alça de canto do canvas é a única porta e envia só a intenção, a propriedade e o valor; G7 — o canvas renderiza o item esticado.

## REQ-2326 — grid.mergeCells (Juntar com a próxima célula)
- **Onde:** `manifest/commands/style.json:10900` `"id": "grid.mergeCells",`
- **Tratador:** `src/app/commands.ts:415` `'grid.mergeCells': mergeGridCells,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Junta a célula do item selecionado com a próxima, criando um item que cobre duas colunas, no editor de grade do canvas; o rótulo é "Juntar com a próxima célula" (`src/i18n/locales/pt-BR.json:2180` `"command.grid.mergeCells": "Juntar com a próxima célula",`). O intent da feature diz que Ctrl+M junta a célula do item selecionado com a próxima (um item que cobre duas colunas), recusado onde a próxima célula tem um elemento (`manifest/features/21-layout-and-structure.json:2046` `"Ctrl+M merges the selected item`). O cenário `merging-the-cell-with-the-next-one-makes-an-item-of-span-two` grava grid-column-start "span 2" (`manifest/features/21-layout-and-structure.json:2298` `"/Page/Grid/Cell/@styles/desktop/base/grid-column-start"`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10915` `"refusalKey": null`); a porta é o Ctrl+M do editor de grade (`manifest/commands/style.json:10931` `"chord": "Ctrl+M",`). Pelas regras do editor: G1 — a junção é gravada no contexto em que foi feita; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — o Ctrl+M do editor de grade é a única porta e envia só a intenção e a propriedade; G7 — o canvas renderiza a célula juntada.

## REQ-2327 — grid.splitCells (Separar a última célula)
- **Onde:** `manifest/commands/style.json:10952` `"id": "grid.splitCells",`
- **Tratador:** `src/app/commands.ts:416` `'grid.splitCells': splitGridCells,`
- **Feature:** `src/app/features.ts:229` `'canvas-grid-editor': registerFeature('canvas-grid-editor'),`
- **Comportamento esperado:** Separa a última célula do item que cobre duas colunas, no editor de grade do canvas; o rótulo é "Separar a última célula" (`src/i18n/locales/pt-BR.json:2181` `"command.grid.splitCells": "Separar a última célula",`). O intent da feature diz que Ctrl+Shift+M separa a última célula de volta (`manifest/features/21-layout-and-structure.json:2046` `"Ctrl+M merges the selected item`). O cenário `removing-a-track-and-splitting-the-merged-cell` grava grid-column-start e o fim como "auto" (`manifest/features/21-layout-and-structure.json:2546` `"/Page/Grid/Cell/@styles/desktop/base/grid-column-start"`). A disponibilidade é sempre, sem recusa declarada (`manifest/commands/style.json:10967` `"refusalKey": null`); a porta é o Ctrl+Shift+M do editor de grade (`manifest/commands/style.json:10983` `"chord": "Ctrl+Shift+M",`). Pelas regras do editor: G1 — a separação é gravada no contexto em que foi feita; G2 — é comando que altera o documento, então a digitação pendente é gravada antes; G3 — o Ctrl+Shift+M do editor de grade é a única porta e envia só a intenção e a propriedade; G7 — o canvas renderiza a célula separada.

## REQ-2328 — element.swapDirection (Trocar a direção)
- **Onde:** `manifest/commands/style.json:11004` `"id": "element.swapDirection",`
- **Tratador:** `src/app/commands.ts:391` `'element.swapDirection': swapDirectionCommand,`
- **Feature:** `src/app/features.ts:228` `'layout-actions': registerFeature('layout-actions'),`
- **Recusa declarada:** `manifest/commands/style.json:11033` `"refusalKey": "status.swap.unavailable"`
- **Comportamento esperado:** Escreve a direção oposta à que o elemento dispõe; o rótulo é "Trocar a direção" (`src/i18n/locales/pt-BR.json:526` `"command.swapDirection": "Trocar a direção",`). O intent da feature diz que a troca escreve a direção oposta da que o elemento dispõe (uma fileira flex vira coluna, o fluxo automático de uma grade em linha vira coluna) para cada elemento selecionado, no breakpoint e no estado que o editor edita (`manifest/features/21-layout-and-structure.json:28` `"The swap writes the opposite direction of what the element lays out with (a flex row into a column, a grid's auto flow row into column) for every selected element, at the breakpoint and state the editor edits.",`). Os cenários `swapping-the-direction-of-a-row` e `swapping-the-direction-from-the-context-menu` gravam flex-direction "column" e anunciam `status.swapped` — "Troquei a direção de {name}: {property} {value}." (`src/i18n/locales/pt-BR.json:2029` `"status.swapped": "Troquei a direção de {name}: {property} {value}.",`). A disponibilidade só admite contêiner flex ou grid (`manifest/commands/style.json:11032` `"predicate": "flexOrGridContainer",`) e a recusa é `status.swap.unavailable` — "Disponível num contêiner flex ou grid." (`src/i18n/locales/pt-BR.json:2035` `"status.swap.unavailable": "Disponível num contêiner flex ou grid.",`). Pelas regras do editor: G1 — a direção é gravada no breakpoint e no estado que o editor edita; G2 — o comando vem de fora de um campo e altera o documento, então a digitação pendente é gravada antes; G3 — a tecla S no canvas e na árvore de camadas, o menu de contexto, o menu Organizar e a barra de comandos enviam só a intenção; G7 — o canvas renderiza a direção trocada.

## REQ-2329 — element.stackOnPhone (Empilhar no celular)
- **Onde:** `manifest/commands/style.json:11186` `"id": "element.stackOnPhone",`
- **Tratador:** `src/app/commands.ts:392` `'element.stackOnPhone': stackOnPhoneCommand,`
- **Feature:** `src/app/features.ts:228` `'layout-actions': registerFeature('layout-actions'),`
- **Recusa declarada:** `manifest/commands/style.json:11215` `"refusalKey": "status.stack.unavailable"`
- **Comportamento esperado:** Escreve uma só coluna no breakpoint mais estreito, deixando o Desktop com a fileira; o rótulo é "Empilhar no celular" (`src/i18n/locales/pt-BR.json:527` `"command.stackOnPhone": "Empilhar no celular",`). O intent da feature diz que o empilhar escreve uma coluna no breakpoint mais estreito sozinho (a flex-direction de um contêiner flex, a trilha única de uma grade), de modo que o Desktop mantém a fileira: a sobreposição por breakpoint que a aba Estilos mostra (`manifest/features/21-layout-and-structure.json:29` `"The stack writes one column at the narrowest breakpoint alone (a flex container's flex-direction, a grid's single track), so the Desktop keeps the row: the per-breakpoint override the Styles tab shows.",`). Os cenários `stacking-a-row-on-the-phone` e `stacking-on-the-phone-from-the-context-menu` gravam a flex-direction "column" no telefone e anunciam `status.stacked` — "{name}: uma coluna em {breakpoint}." (`src/i18n/locales/pt-BR.json:2031` `"status.stacked": "{name}: uma coluna em {breakpoint}.",`). A disponibilidade só admite contêiner flex ou grid (`manifest/commands/style.json:11214` `"predicate": "flexOrGridContainer",`) e a recusa é `status.stack.unavailable` — "Disponível num contêiner flex ou grid." (`src/i18n/locales/pt-BR.json:2037` `"status.stack.unavailable": "Disponível num contêiner flex ou grid.",`). Pelas regras do editor: G1 — a coluna é gravada no breakpoint mais estreito, contexto distinto de Desktop; G2 — o comando vem de fora de um campo e altera o documento, então a digitação pendente é gravada antes; G3 — a tecla Shift+S no canvas e na árvore de camadas, o menu de contexto, o menu Organizar e a barra de comandos enviam só a intenção; G7 — o canvas renderiza a coluna no breakpoint do telefone.

## REQ-2330 — element.organize (Organizar os filhos)
- **Onde:** `manifest/commands/style.json:11366` `"id": "element.organize",`
- **Tratador:** `src/app/commands.ts:393` `'element.organize': organizeCommand,`
- **Feature:** `src/app/features.ts:228` `'layout-actions': registerFeature('layout-actions'),`
- **Recusa declarada:** `manifest/commands/style.json:11402` `"refusalKey": "status.organize.unavailable"`
- **Comportamento esperado:** Dispõe os filhos soltos do contêiner como a linha flex por onde já correm, com o espaçamento que a maioria mantém, e tira as margens deles nessa linha; o rótulo é "Organizar os filhos" (`src/i18n/locales/pt-BR.json:528` `"command.organize": "Organizar os filhos",`). O intent da feature diz que o organizar dispõe os filhos soltos do contêiner como a linha flex por onde já correm, com o espaçamento que a maioria mantém, e tira as margens deles nessa linha, de modo que o que a página mostra não se mexe (`manifest/features/21-layout-and-structure.json:30` `"The organize lays the loose children of the container out as the flex line they already run along, with the gap most of them stand apart, and takes their margins along that line away, so what the page shows does not move.",`). Os cenários `organizing-the-loose-children-of-a-section`, `organizing-from-the-context-menu` e `organizing-takes-a-childs-margin-into-the-gap` gravam display flex, flex-direction e row-gap e anunciam `status.organized` — "Dispus {name} como {direction} com espaçamento de {gap}px." (`src/i18n/locales/pt-BR.json:2033` `"status.organized": "Dispus {name} como {direction} com espaçamento de {gap}px.",`). A disponibilidade exige seleção organizável (`manifest/commands/style.json:11401` `"predicate": "organizableSelection",`) e a recusa é `status.organize.unavailable` — "Selecione um contêiner com pelo menos dois filhos." (`src/i18n/locales/pt-BR.json:2038` `"status.organize.unavailable": "Selecione um contêiner com pelo menos dois filhos.",`); a lista de recusas traz também `status.organize.unmeasured`, `status.locked.edit` e `status.locked.byAncestor` (`manifest/commands/style.json:11406` `"status.organize.unmeasured",`). Pelas regras do editor: G1 — o arranjo é gravado no breakpoint e no estado que o editor edita; G2 — o comando vem de fora de um campo e altera o documento, então a digitação pendente é gravada antes; G3 — a tecla O no canvas e na árvore de camadas, o menu de contexto, o menu Organizar e a barra de comandos enviam só a intenção; G7 — o canvas renderiza o arranjo gravado.

## REQ-2331 — element.setDivider (Ajustar a divisão)
- **Onde:** `manifest/commands/style.json:11575` `"id": "element.setDivider",`
- **Tratador:** `src/app/commands.ts:394` `'element.setDivider': setDividerCommand,`
- **Feature:** `src/app/features.ts:228` `'layout-actions': registerFeature('layout-actions'),`
- **Recusa declarada:** `manifest/commands/style.json:11621` `"refusalKey": "status.divider.unavailable"`
- **Comportamento esperado:** Ajusta, pelo arraste da alça, a parte da fileira que cada uma das duas colunas ocupa, como a flex-grow dos dois filhos; o rótulo é "Ajustar a divisão" (`src/i18n/locales/pt-BR.json:529` `"command.setDivider": "Ajustar a divisão",`). O intent da feature diz que a alça de divisão fica sobre a fronteira entre cada duas colunas de uma fileira flex e o seu arraste escreve a parte da fileira dos dois filhos como a flex-grow deles, limitada para cada um manter a largura mínima de uma coluna (`manifest/features/21-layout-and-structure.json:31` `"The divider grip stands on the boundary between each two columns of a flex row; its drag writes the two children's share of the row as their flex-grow, bounded so each keeps a column's least width.",`). O cenário `the-divider-sets-the-share-of-two-columns` grava flex-grow "0.34" e "0.66" e anuncia `status.divider` — "Divisão de {name}: colunas de {left}% e {right}%." (`src/i18n/locales/pt-BR.json:2034` `"status.divider": "Divisão de {name}: colunas de {left}% e {right}%.",`). A disponibilidade exige seleção divisível (`manifest/commands/style.json:11620` `"predicate": "divideableSelection",`) e a recusa é `status.divider.unavailable` — "Selecione uma linha flex com pelo menos dois filhos." (`src/i18n/locales/pt-BR.json:2040` `"status.divider.unavailable": "Selecione uma linha flex com pelo menos dois filhos.",`); a lista de recusas traz também `status.divider.unmeasured`, `status.value.invalid`, `status.locked.edit` e `status.locked.byAncestor` (`manifest/commands/style.json:11625` `"status.divider.unmeasured",`). Pelas regras do editor: G1 — a divisão é gravada no breakpoint e no estado que o editor edita; G2 — o comando vem de fora de um campo e altera o documento, então a digitação pendente é gravada antes; G3 — a alça de divisão do canvas é a única porta e envia só a intenção, o índice e o valor; G7 — o canvas renderiza a divisão gravada.

## REQ-2401 — text.startEdit (Editar texto)
- **Onde:** `manifest/commands/text.json:5` `"id": "text.startEdit",`
- **Tratador:** `src/app/commands.ts:430` `'text.startEdit': startEdit,`
- **Feature:** `src/app/features.ts:39` `'text-edit-inline': registerFeature('text-edit-inline'),`
- **Recusa declarada:** `manifest/commands/text.json:12` `"refusalKey": "status.textEdit.notText"`
- **Comportamento esperado:** Inicia a edição do texto de um elemento no próprio lugar. O rótulo da interface é "Editar texto" (`src/i18n/locales/pt-BR.json:330` `"command.editText": "Editar texto",`). Um duplo clique ou Enter torna o texto do elemento editável no lugar com um cursor (`manifest/features/02-structure-editing.json:13151` `"title": "Edit text in place with double-click or Enter",`) e a barra de status explica que Enter, Escape ou um clique fora o mantém (`manifest/features/02-structure-editing.json:13159` `"Double-click or Enter makes the element's text editable in place with a caret; the status bar explains that Enter, Escape or a click away keeps it [status.textEdit.editing].",`), com a mensagem `status.textEdit.editing` — "Editando o texto — Enter, Esc ou um clique fora o mantém; Ctrl+Z o desfaz." (`src/i18n/locales/pt-BR.json:1980` `"status.textEdit.editing": "Editando o texto — Enter, Esc ou um clique fora o mantém; Ctrl+Z o desfaz.",`). O elemento precisa ser um único elemento de texto: o predicado `singleTextSelection` recusa o comando quando a seleção não é essa, e o cenário `an-element-without-text-cannot-be-edited` mostra a recusa `status.textEdit.notText` num Section (`manifest/features/02-structure-editing.json:13603` `"key": "status.textEdit.notText",`) — "{name} não tem texto para editar." (`src/i18n/locales/pt-BR.json:1981` `"status.textEdit.notText": "{name} não tem texto para editar.",`). As três portas do comando — o duplo clique sobre um elemento de texto no canvas, o Enter com o contexto do canvas e a barra de comandos — enviam só a intenção ao único tratador, sem argumentos (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:21` `"undoable": false`). Pelas regras do editor: G2 — no início de cada toque no canvas a digitação pendente é gravada antes, no contexto da digitação; G4 — o resultado da ação (o campo editável) fica visível no canvas, onde a ação acontece; G6 — a seleção lida por canvas e Camadas vem da store, e a edição não cria cópia local; G7 — o canvas segue igual ao documento.

## REQ-2402 — text.set (Definir o texto)
- **Onde:** `manifest/commands/text.json:90` `"id": "text.set",`
- **Tratador:** `src/app/commands.ts:431` `'text.set': setTextCommand,`
- **Feature:** `src/app/features.ts:39` `'text-edit-inline': registerFeature('text-edit-inline'),`
- **Comportamento esperado:** Grava o texto digitado no documento JSON como um único passo de desfazer. O rótulo da interface é "Definir o texto" (`src/i18n/locales/pt-BR.json:480` `"command.setText": "Definir o texto",`). Recebe o elemento-alvo e o conteúdo. Enter, Escape ou um clique fora gravam o texto novo no documento JSON como um passo de desfazer, e o Desfazer restaura o texto original (`manifest/features/02-structure-editing.json:13160` `"Enter, Escape or clicking away writes the new text into the document JSON as one undo step; Undo restores the original text.",`); o cenário `enter-keeps-the-typed-text` espera a operação `set` em `/Page/Hero/Intro/@text` e um passo de undo; o cenário `a-click-outside-keeps-the-text-and-selects-there` espera o mesmo e a seleção movida para onde se clicou. O espaço insere no cursor ou substitui o trecho selecionado, inclusive em botões e links e nos textos filhos de labels e summaries, e nunca ativa o controle editado (`manifest/features/02-structure-editing.json:13161` `"Space inserts at the caret or replaces the text selection, including on buttons and links and in the text children of labels and summaries. It never activates the edited control.",`). A barra de status anuncia a gravação com `status.textEdit.committed` — "Texto de {name} salvo." (`src/i18n/locales/pt-BR.json:1979` `"status.textEdit.committed": "Texto de {name} salvo.",`). As seis portas do comando — Enter e Escape no contexto de edição de texto, o clique do canvas fora do elemento editado, o campo de texto do Inspector, o Enter no campo de texto do elemento e o campo do painel rápido — enviam só a intenção (o texto do campo, mesmo vazio, e o alvo) ao único tratador (G3). O histórico declara o comando desfazível, com uma transação por despacho, restauração da seleção anterior ao comando e nenhuma entrada quando o texto não muda (`manifest/commands/text.json:118` `"coalesce": "none",`). Pelas regras do editor: G1 — a edição é gravada no contexto capturado na primeira digitação (elementos, breakpoint, estado, classe-alvo e quadro-chave), inclusive quando breakpoint, estado, classe ou seleção mudam com a digitação pendente; G2 — todo toque ou comando que altera o documento grava antes o rascunho pendente, no contexto da digitação; G7 — o canvas renderiza o texto gravado e a integridade do documento é preservada a cada escrita.

## REQ-2403 — text.cancelEdit (Cancelar a edição do texto)
- **Onde:** `manifest/commands/text.json:258` `"id": "text.cancelEdit",`
- **Tratador:** `src/app/commands.ts:432` `'text.cancelEdit': cancelEdit,`
- **Feature:** `src/app/features.ts:39` `'text-edit-inline': registerFeature('text-edit-inline'),`
- **Comportamento esperado:** Cancela a edição do texto em curso sem gravar alteração. O rótulo da interface é "Cancelar a edição do texto" (`src/i18n/locales/pt-BR.json:493` `"command.textEdit.cancel": "Cancelar a edição do texto",`); a chave de rodapé do comando na barra de comandos declara "Manter o texto" (`manifest/commands/text.json:259` `"labelKey": "command.textEdit.cancel",`). A barra de status anuncia o cancelamento com `status.textEdit.cancelled` — "O texto de {name} ficou como estava." (`src/i18n/locales/pt-BR.json:1978` `"status.textEdit.cancelled": "O texto de {name} ficou como estava.",`). O comando tem uma porta declarada, o Escape no campo de texto do elemento (`manifest/commands/text.json:274` `"id": "key-escape-in-element-text-field",`), que envia só a intenção ao único tratador, sem argumentos (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:270` `"undoable": false`). Pelas regras do editor: G2 — o cancelamento descarta a edição pendente por especificação, e o texto do elemento permanece o que estava; G6 — a seleção continua lida da store; G7 — o canvas segue igual ao documento.

## REQ-2404 — text.insertLineBreak (Inserir uma quebra de linha)
- **Onde:** `manifest/commands/text.json:296` `"id": "text.insertLineBreak",`
- **Tratador:** `src/app/commands.ts:433` `'text.insertLineBreak': insertLineBreak,`
- **Feature:** `src/app/features.ts:39` `'text-edit-inline': registerFeature('text-edit-inline'),`
- **Comportamento esperado:** Insere uma quebra de linha no texto em edição. O rótulo da interface é "Inserir uma quebra de linha" (`src/i18n/locales/pt-BR.json:496` `"command.textEdit.lineBreak": "Inserir uma quebra de linha",`). A única porta é o Shift+Enter no contexto de edição de texto (`manifest/commands/text.json:315` `"chord": "Shift+Enter",`), que envia só a intenção ao único tratador, sem argumentos (G3); o cenário `shift-enter-keeps-a-line-break` mostra que a quebra faz parte do texto gravado, com o valor `"Fresh coffee, roasted every week. A\nB"` (`manifest/features/02-structure-editing.json:13518` `"value": "Fresh coffee, roasted every week. A\nB"`). O comando não entra na pilha de undo (`manifest/commands/text.json:308` `"undoable": false`); a quebra apenas entra no texto e é gravada junto pelo commit da edição. Pelas regras do editor: G1 — a edição, com a quebra, é gravada no contexto em que foi feita; G3 — a porta do campo envia só a intenção; G7 — o canvas renderiza o texto com a quebra.

## REQ-2405 — text.toggleBold (Negrito)
- **Onde:** `manifest/commands/text.json:334` `"id": "text.toggleBold",`
- **Tratador:** `src/app/commands.ts:434` `'text.toggleBold': toggleBold,`
- **Feature:** `src/app/features.ts:40` `'text-inline-formatting': registerFeature('text-inline-formatting'),`
- **Comportamento esperado:** Aplica ou remove negrito no trecho selecionado do texto em edição. O rótulo da interface é "Negrito" (`src/i18n/locales/pt-BR.json:492` `"command.textEdit.bold": "Negrito",`) e o rótulo de face do botão da barra de texto é "B" (`src/i18n/locales/pt-BR.json:3583` `"textToolbar.face.bold": "B",`). O Ctrl+B envolve a seleção em `strong` e, pressionado de novo dentro da marca, a remove (`manifest/features/02-structure-editing.json:13630` `"Ctrl+B wraps the selection in <strong>, Ctrl+I in <em>, Ctrl+K in <a href>; pressing the shortcut again inside the mark removes it.",`); o cenário `ctrl-b-makes-the-selected-word-bold` espera a operação `set` em `/Page/Plans/Grid/CardA/CardATitle/@inline` com o nó `strong` (`manifest/features/02-structure-editing.json:13693` `"tag": "strong",`). As duas portas — o Ctrl+B no contexto de edição de texto e o botão da barra de texto (`manifest/commands/text.json:373` `"pressed": true,`) — enviam só a intenção ao único tratador, sem argumentos (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:346` `"undoable": false`); a marca entra no texto e é gravada junto pelo commit da edição. Pelas regras do editor: G1 — a marca é gravada no contexto em que foi feita; G3 — as portas enviam só a intenção; G7 — o canvas renderiza o texto marcado.

## REQ-2406 — text.toggleItalic (Itálico)
- **Onde:** `manifest/commands/text.json:394` `"id": "text.toggleItalic",`
- **Tratador:** `src/app/commands.ts:435` `'text.toggleItalic': toggleItalic,`
- **Feature:** `src/app/features.ts:40` `'text-inline-formatting': registerFeature('text-inline-formatting'),`
- **Comportamento esperado:** Aplica ou remove itálico no trecho selecionado do texto em edição. O rótulo da interface é "Itálico" (`src/i18n/locales/pt-BR.json:495` `"command.textEdit.italic": "Itálico",`) e o rótulo de face do botão da barra de texto é "I" (`src/i18n/locales/pt-BR.json:3584` `"textToolbar.face.italic": "I",`). O Ctrl+I envolve a seleção em `em` e, pressionado de novo dentro da marca, a remove (`manifest/features/02-structure-editing.json:13630` `"Ctrl+B wraps the selection in <strong>, Ctrl+I in <em>, Ctrl+K in <a href>; pressing the shortcut again inside the mark removes it.",`); o cenário `ctrl-i-makes-the-selected-word-italic` espera a operação `set` em `/Page/Plans/Grid/CardB/CardBTitle/@inline` com o nó `em` (`manifest/features/02-structure-editing.json:13784` `"tag": "em",`). As duas portas — o Ctrl+I no contexto de edição de texto e o botão da barra de texto (`manifest/commands/text.json:434` `"feature": "text-inline-formatting",`) — enviam só a intenção ao único tratador, sem argumentos (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:406` `"undoable": false`); a marca entra no texto e é gravada junto pelo commit da edição. Pelas regras do editor: G1 — a marca é gravada no contexto em que foi feita; G3 — as portas enviam só a intenção; G7 — o canvas renderiza o texto marcado.

## REQ-2407 — text.editLink (Link)
- **Onde:** `manifest/commands/text.json:454` `"id": "text.editLink",`
- **Tratador:** `src/app/commands.ts:436` `'text.editLink': editLink,`
- **Feature:** `src/app/features.ts:40` `'text-inline-formatting': registerFeature('text-inline-formatting'),`
- **Comportamento esperado:** Aplica um link no trecho selecionado do texto em edição. O rótulo da interface é "Link" (`src/i18n/locales/pt-BR.json:497` `"command.textEdit.link": "Link",`). Recebe um `href` opcional e abre a entrada do endereço; o cenário `ctrl-k-links-the-selected-word` espera a operação `set` em `/Page/Plans/Grid/CardA/CardATitle/@inline` com o nó `a` de `href` seguro (`manifest/features/02-structure-editing.json:13876` `"href": "https://example.com",`). Um endereço inseguro é recusado com a chave `status.link.unsafe` — "Links precisam começar com http, https, mailto ou tel." (`src/i18n/locales/pt-BR.json:1840` `"status.link.unsafe": "Links precisam começar com http, https, mailto ou tel.",`) — e o documento fica inalterado, no cenário `an-unsafe-link-is-refused` (`manifest/features/02-structure-editing.json:13963` `"key": "status.link.unsafe",`). As duas portas — o Ctrl+K no contexto de edição de texto e o botão de ícone da barra de texto (`manifest/commands/text.json:500` `"drawnAs": "icon-button",`) — enviam só a intenção ao único tratador (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:474` `"undoable": false`); o link entra no texto e é gravado junto pelo commit da edição. Pelas regras do editor: G1 — o link é gravado no contexto em que foi feito; G3 — as portas enviam só a intenção; G7 — o canvas renderiza o texto com o link.

## REQ-2408 — text.paste (Colar mantendo negrito, itálico e links)
- **Onde:** `manifest/commands/text.json:522` `"id": "text.paste",`
- **Tratador:** `src/app/commands.ts:437` `'text.paste': pasteText,`
- **Feature:** `src/app/features.ts:40` `'text-inline-formatting': registerFeature('text-inline-formatting'),`
- **Comportamento esperado:** Cola conteúdo da área de transferência no texto em edição mantendo as marcas suportadas. O rótulo da interface é "Colar mantendo negrito, itálico e links" (`src/i18n/locales/pt-BR.json:498` `"command.textEdit.paste": "Colar mantendo negrito, itálico e links",`). Recebe a área de transferência como argumento. O conteúdo colado mantém as marcas suportadas (strong, em e links com endereços seguros) e descarta o resto: outras tags viram seu texto simples e os scripts são removidos (`manifest/features/02-structure-editing.json:13631` `"Pasted content keeps the supported marks (strong, em, and links with safe URLs) and drops everything else: other tags become their plain text and scripts are removed.",`). Com a área de transferência vazia, o comando é recusado com `status.paste.empty` — "A área de transferência não tem nada que possa ser colado." (`src/i18n/locales/pt-BR.json:1887` `"status.paste.empty": "A área de transferência não tem nada que possa ser colado.",`) — e o documento fica inalterado, no cenário `pasting-with-an-empty-clipboard-changes-nothing` (`manifest/features/02-structure-editing.json:14031` `"key": "status.paste.empty",`). Se o navegador não permitir o acesso, o comando é recusado com `status.clipboard.denied` — "O navegador não permitiu acesso à área de transferência." (`src/i18n/locales/pt-BR.json:1681` `"status.clipboard.denied": "O navegador não permitiu acesso à área de transferência.",`). A única porta é o Ctrl+V no contexto de edição de texto (`manifest/commands/text.json:547` `"id": "key-ctrl-v-in-text-editing",`), que envia só a intenção ao único tratador (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:543` `"undoable": false`); o conteúdo colado entra no texto e é gravado junto pelo commit da edição. Pelas regras do editor: G1 — o texto colado é gravado no contexto em que foi feito; G3 — a porta envia só a intenção; G7 — o canvas renderiza o texto colado.

## REQ-2409 — text.selectAll (Selecionar todo o texto)
- **Onde:** `manifest/commands/text.json:569` `"id": "text.selectAll",`
- **Tratador:** `src/app/commands.ts:438` `'text.selectAll': selectAllText,`
- **Feature:** `src/app/features.ts:46` `'select-container-children': registerFeature('select-container-children'),`
- **Comportamento esperado:** Seleciona todo o texto em edição, sem mexer na seleção de elementos. O rótulo da interface é "Selecionar todo o texto" (`src/i18n/locales/pt-BR.json:499` `"command.textEdit.selectAll": "Selecionar todo o texto",`). A feature pede que, enquanto se edita texto, o Ctrl+A selecione o texto e não mude a seleção de elementos (`manifest/features/02-structure-editing.json:16757` `"While editing text Ctrl+A selects the text and does not change the element selection.",`) e que o documento JSON nunca mude (`manifest/features/02-structure-editing.json:16758` `"The document JSON never changes."`). O cenário `ctrl-a-while-editing-selects-the-text-only` mostra o texto todo selecionado e substituído pela digitação (`manifest/features/02-structure-editing.json:16907` `"type": "Replaced"`), com a seleção de elementos mantida em `/Page/Hero/Intro` e a gravação vindo do commit da edição. A única porta é o Ctrl+A no contexto de edição de texto (`manifest/commands/text.json:585` `"id": "key-ctrl-a-in-text-editing",`), que envia só a intenção ao único tratador, sem argumentos (G3). O comando não entra na pilha de undo (`manifest/commands/text.json:581` `"undoable": false`). Pelas regras do editor: G2 — o comando não altera o documento, então não força gravação; G6 — a seleção de elementos segue lida da store, sem cópia local, e o comando não a muda; G7 — o canvas segue igual ao documento.

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

# Domínio view — REQ-2501 a REQ-2534

## REQ-2501 — view.zoomIn (Aumentar o zoom)
- **Onde:** `manifest/commands/view.json:5` `"id": "view.zoomIn",`
- **Tratador:** `src/app/commands.ts:439` `'view.zoomIn': zoomIn,`
- **Feature:** `src/app/features.ts:141` `'zoom-keyboard-buttons': registerFeature('zoom-keyboard-buttons'),`
- **Comportamento esperado:** Aumenta o zoom da tela em dez pontos; o rótulo da porta é "Aumentar o zoom" (`src/i18n/locales/pt-BR.json:532` `"command.zoomIn": "Aumentar o zoom",`). A intenção da feature diz que `Ctrl+=` e `Ctrl+-` mudam o zoom em dez pontos e o zoom do iframe acompanha a porcentagem da barra de status (`manifest/features/10-view-and-positioning.json:24` `"Ctrl+= and Ctrl+- change zoom by 10 points, Ctrl+0 sets 100%; the iframe CSS zoom and the percentage in the status bar match.",`); no cenário `zoom-in-adds-10-points-and-is-kept-after-a-reload` a mensagem é `status.zoom.set` com zoom 110 (`manifest/features/10-view-and-positioning.json:150` `"key": "status.zoom.set",`). O zoom fica entre dez e oitocentos por cento e o ponto da página no centro do canvas permanece sob o centro (`manifest/features/10-view-and-positioning.json:25` `"Zoom stays between 10% and 800%; the page point at the centre of the canvas stays under the centre.",`); o valor é restaurado ao recarregar (`manifest/features/10-view-and-positioning.json:28` `"The zoom (or Fit mode) is restored after a reload."`). As quatro portas do comando — `Ctrl+=`, `Ctrl++`, o botão da barra de status (`toolbar-status-bar-zoom-in`) e a barra de comandos (`command-bar`) — enviam só a intenção ao mesmo tratador, sem argumentos (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:19` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha o documento no novo zoom (G7). G4 exige que a barra lateral fique na própria coluna para o resultado ficar visível.

## REQ-2502 — view.zoomOut (Diminuir o zoom)
- **Onde:** `manifest/commands/view.json:108` `"id": "view.zoomOut",`
- **Tratador:** `src/app/commands.ts:440` `'view.zoomOut': zoomOut,`
- **Feature:** `src/app/features.ts:141` `'zoom-keyboard-buttons': registerFeature('zoom-keyboard-buttons'),`
- **Comportamento esperado:** Diminui o zoom da tela em dez pontos; o rótulo da porta é "Diminuir o zoom" (`src/i18n/locales/pt-BR.json:533` `"command.zoomOut": "Diminuir o zoom",`). No cenário `zoom-out-takes-10-points-away` a mensagem é `status.zoom.set` com zoom 90 (`manifest/features/10-view-and-positioning.json:228` `"key": "status.zoom.set",`). Quando o zoom já está no mínimo de dez por cento, o passo para fora é recusado com `status.zoom.limit` e o documento fica inalterado, no cenário `a-step-out-at-the-lowest-zoom-is-refused` (`manifest/features/10-view-and-positioning.json:339` `"refusals": [` seguido de `status.zoom.limit`); o comando declara essa recusa (`manifest/commands/view.json:117` `"refusals": [`). O zoom é restaurado ao recarregar (`manifest/features/10-view-and-positioning.json:28` `"The zoom (or Fit mode) is restored after a reload."`). As três portas do comando — `Ctrl+-`, o botão da barra de status (`toolbar-status-bar-zoom-out`) e a barra de comandos (`command-bar`) — enviam só a intenção ao mesmo tratador (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:122` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha no novo zoom (G7).

## REQ-2503 — view.zoomReset (Zoom em 100 por cento)
- **Onde:** `manifest/commands/view.json:191` `"id": "view.zoomReset",`
- **Tratador:** `src/app/commands.ts:441` `'view.zoomReset': zoomReset,`
- **Feature:** `src/app/features.ts:141` `'zoom-keyboard-buttons': registerFeature('zoom-keyboard-buttons'),`
- **Comportamento esperado:** Devolve o zoom a cem por cento; o rótulo da porta é "Zoom em 100%" (`src/i18n/locales/pt-BR.json:534` `"command.zoomReset": "Zoom em 100%",`). A intenção da feature descreve `Ctrl+0` fixando cem por cento com o zoom do iframe e a porcentagem da barra de status acompanhando (`manifest/features/10-view-and-positioning.json:24` `"Ctrl+= and Ctrl+- change zoom by 10 points, Ctrl+0 sets 100%; the iframe CSS zoom and the percentage in the status bar match.",`). No cenário `ctrl-0-shows-the-page-at-100-and-keeps-it-after-a-reload` a mensagem é `status.zoom.set` com zoom cem (`manifest/features/10-view-and-positioning.json:71` `"key": "status.zoom.set",`) e a largura do quadro é 1440 px (`manifest/features/10-view-and-positioning.json:84` `"value": 1440,`). O comando não declara recusa (`manifest/commands/view.json:200` `"refusals": [],`) e o valor é restaurado ao recarregar (`manifest/features/10-view-and-positioning.json:28` `"The zoom (or Fit mode) is restored after a reload."`). As duas portas — `Ctrl+0` e a barra de comandos (`command-bar`) — enviam só a intenção ao mesmo tratador (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:203` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha no novo zoom (G7).

## REQ-2504 — view.zoomTo (Zoom em {percent}%)
- **Onde:** `manifest/commands/view.json:250` `"id": "view.zoomTo",`
- **Tratador:** `src/app/commands.ts:442` `'view.zoomTo': zoomToLevel,`
- **Feature:** `src/app/features.ts:141` `'zoom-keyboard-buttons': registerFeature('zoom-keyboard-buttons'),`
- **Comportamento esperado:** Fixa o zoom na porcentagem pedida; o rótulo da porta é "Zoom em {percent}%" (`src/i18n/locales/pt-BR.json:535` `"command.zoomTo": "Zoom em {percent}%",`) e há um segundo rótulo de nome (`manifest/commands/view.json:252` `"nameKey": "command.zoomTo.name",`). O argumento `percent` é um inteiro obrigatório (`manifest/commands/view.json:257` `"type": "integer",`). As portas são os itens do menu de zoom com 10, 25, 50, 100, 200, 400 e 800 (`manifest/commands/view.json:278` `"labelKey": "view.zoomPreset.10",`), e cada uma envia só a intenção com a porcentagem dela (`manifest/commands/view.json:293` `"percent": 10`). Os cenários `the-zoom-menu-sets-10`, `the-zoom-menu-sets-25`, `the-zoom-menu-sets-50`, `the-zoom-menu-sets-100`, `the-zoom-menu-sets-200`, `the-zoom-menu-sets-400` e `the-zoom-menu-sets-800` mostram cada item confirmando com `status.zoom.set` na porcentagem escolhida (`manifest/features/10-view-and-positioning.json:385` `"key": "status.zoom.set",`). O zoom fica entre dez e oitocentos por cento (`manifest/features/10-view-and-positioning.json:25` `"Zoom stays between 10% and 800%; the page point at the centre of the canvas stays under the centre.",`). O comando é de visão: não entra no histórico (`manifest/commands/view.json:269` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha no novo zoom (G7).

## REQ-2505 — view.zoomFit (Ajustar)
- **Onde:** `manifest/commands/view.json:443` `"id": "view.zoomFit",`
- **Tratador:** `src/app/commands.ts:443` `'view.zoomFit': zoomFit,`
- **Feature:** `src/app/features.ts:141` `'zoom-keyboard-buttons': registerFeature('zoom-keyboard-buttons'),`
- **Comportamento esperado:** Ajusta o zoom para a largura inteira da página caber no canvas e mantém esse modo enquanto o tamanho do canvas mudar; o rótulo da porta é "Ajustar" (`src/i18n/locales/pt-BR.json:531` `"command.zoomFit": "Ajustar",`). A intenção da feature diz que Ajustar fixa o zoom de modo que a largura inteira caiba e o mantém quando o canvas muda, e que qualquer zoom manual deixa o modo Ajustar até ele ser escolhido de novo (`manifest/features/10-view-and-positioning.json:27` `"Fit sets the zoom so the whole page width fits in the canvas and keeps it fitted when the canvas size changes; any manual zoom leaves Fit mode until Fit is chosen again.",`). No cenário `fit-brings-back-the-whole-page-width-after-a-manual-zoom` a mensagem é `status.zoom.fitted` com zoom 56 (`manifest/features/10-view-and-positioning.json:710` `"key": "status.zoom.fitted",`); no cenário `fit-mode-refits-when-the-stage-widens` o modo refaz o ajuste quando a bancada alarga (`manifest/features/10-view-and-positioning.json:801` `"id": "fit-mode-refits-when-the-stage-widens",`). O valor é restaurado ao recarregar (`manifest/features/10-view-and-positioning.json:28` `"The zoom (or Fit mode) is restored after a reload."`). As quatro portas — `Shift+1`, o botão Ajustar da barra de status (`toolbar-status-bar-fit`), o item do menu de zoom (`menu-zoom`) e a barra de comandos (`command-bar`) — enviam só a intenção ao mesmo tratador (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:455` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha no novo zoom (G7).

## REQ-2506 — view.zoomAt (Zoom em torno do ponteiro)
- **Onde:** `manifest/commands/view.json:546` `"id": "view.zoomAt",`
- **Tratador:** `src/app/commands.ts:444` `'view.zoomAt': zoomAt,`
- **Feature:** `src/app/features.ts:143` `'zoom-wheel-pan': registerFeature('zoom-wheel-pan'),`
- **Comportamento esperado:** Muda o zoom em torno do ponto onde o ponteiro está; o rótulo da porta é "Zoom em torno do ponteiro" (`src/i18n/locales/pt-BR.json:530` `"command.zoomAt": "Zoom em torno do ponteiro",`). Os argumentos são o fator e o ponto (`manifest/commands/view.json:551` `"factor": {`), ambos obrigatórios. A intenção da feature diz que `Ctrl+wheel` aumenta em torno do ponteiro e o título sob o ponteiro permanece ali (`manifest/features/10-view-and-positioning.json:1352` `"Ctrl+wheel zooms around the pointer: the heading stays under the pointer.",`). A única porta é a roda do canvas com `Ctrl` (`manifest/commands/view.json:575` `"id": "canvas-wheel-ctrl",`), que envia só a intenção ao tratador (G3); o cenário `ctrl-wheel-zooms-in-around-the-pointer-and-is-kept-after-a-reload` confirma com `status.zoom.set` no zoom 122 (`manifest/features/10-view-and-positioning.json:1408` `"key": "status.zoom.set",`). Ao passar do zoom máximo o comando é recusado com `status.zoom.limit` e o documento fica inalterado, no cenário `ctrl-wheel-past-the-highest-zoom-is-refused` (`manifest/features/10-view-and-positioning.json:1498` `"key": "status.zoom.limit",`); o comando declara essa recusa (`manifest/commands/view.json:566` `"refusals": [`). É comando de visão: não entra no histórico (`manifest/commands/view.json:571` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha no novo zoom (G7).

## REQ-2507 — view.pan (Rolar a visualização)
- **Onde:** `manifest/commands/view.json:596` `"id": "view.pan",`
- **Tratador:** `src/app/commands.ts:445` `'view.pan': pan,`
- **Feature:** `src/app/features.ts:143` `'zoom-wheel-pan': registerFeature('zoom-wheel-pan'),`
- **Comportamento esperado:** Move a visualização do canvas sem alterar o documento; o rótulo da porta é "Rolar a visualização" (`src/i18n/locales/pt-BR.json:419` `"command.pan": "Rolar a visualização",`). Os argumentos são o deslocamento horizontal e o vertical (`manifest/commands/view.json:601` `"dx": {`), ambos obrigatórios. A intenção da feature diz que a roda rola na vertical e `Shift` com a roda na horizontal, e que segurar Espaço mostra o cursor de mão e o arraste move a vista sem selecionar nem mover nada (`manifest/features/10-view-and-positioning.json:1353` `"Wheel scrolls vertically and Shift+wheel horizontally; the page can be scrolled to see content below the fold.",` e `manifest/features/10-view-and-positioning.json:1354` `"Holding Space shows a grab cursor and dragging pans the view without selecting or moving anything; releasing Space returns to selection."`). As quatro portas — a roda (`canvas-wheel`), a roda com `Shift` (`canvas-wheel-shift`), o arraste com Espaço (`canvas-drag-space-held-stage`) e o arraste com o botão do meio (`canvas-drag-middle-button-stage`) — enviam só a intenção ao mesmo tratador (G3); os cenários `the-wheel-scrolls-the-page`, `shift-wheel-pans-across`, `a-drag-with-space-held-pans-by-the-pointers-travel` e `a-middle-button-drag-pans-without-selecting` cobrem as quatro. O comando não declara recusa (`manifest/commands/view.json:616` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:619` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha na nova posição (G7).

## REQ-2508 — view.setBreakpoint (Mostrar o breakpoint {breakpoint})
- **Onde:** `manifest/commands/view.json:703` `"id": "view.setBreakpoint",`
- **Tratador:** `src/app/commands.ts:446` `'view.setBreakpoint': setBreakpoint,`
- **Feature:** `src/app/features.ts:158` `'breakpoints-switch': registerFeature('breakpoints-switch'),`
- **Comportamento esperado:** Passa o canvas a mostrar o breakpoint pedido; o rótulo da porta é "Mostrar o breakpoint {breakpoint}" (`src/i18n/locales/pt-BR.json:450` `"command.setBreakpoint": "Mostrar o breakpoint {breakpoint}",`) e há um segundo rótulo de nome (`manifest/commands/view.json:705` `"nameKey": "command.setBreakpoint.name",`). O argumento `breakpoint` é obrigatório (`manifest/commands/view.json:710` `"type": "breakpoint",`). A intenção da feature diz que a largura da página dentro do iframe passa a ser 1180 px no Laptop, 834 no Tablet, 390 no Phone e 1440 no Desktop, e no modo Ajustar o canvas reajusta o zoom (`manifest/features/11-responsive-and-states.json:22` `"The page width inside the iframe becomes 1180 CSS px for Laptop, 834 for Tablet, 390 for Phone and 1440 for Desktop; in Fit mode the canvas refits the zoom.",`); a barra de status mostra o breakpoint ativo (`manifest/features/11-responsive-and-states.json:23` `"The status bar shows the active breakpoint; the buttons show their widths in tooltips.",`). Os cenários `the-laptop-tab-gives-the-page-1180-px`, `the-tablet-tab-gives-the-page-834-px`, `the-phone-tab-gives-the-page-390-px` e `the-desktop-tab-gives-the-page-1440-px` confirmam com `status.breakpointActive` (`manifest/features/11-responsive-and-states.json:85` `"key": "status.breakpointActive",`). O breakpoint ativo é restaurado ao recarregar (`manifest/features/11-responsive-and-states.json:25` `"The active breakpoint is restored after a reload."`). As portas — as abas do canvas, as abas da barra de pré-visualização e o quadro do modo lado a lado (`side-by-side-frame`) — enviam só o breakpoint ao mesmo tratador (G3). Quando o projeto não tem o breakpoint pedido a porta é recusada com `status.breakpoints.unknown` (`manifest/commands/view.json:720` `"status.breakpoints.unknown"`). É comando de visão: não entra no histórico (`manifest/commands/view.json:724` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha no novo breakpoint (G7).

## REQ-2509 — view.setEditorView (Mostrar a tela, o código ou os dois)
- **Onde:** `manifest/commands/view.json:988` `"id": "view.setEditorView",`
- **Tratador:** `src/app/commands.ts:455` `'view.setEditorView': setEditorView,`
- **Feature:** `src/app/features.ts:192` `'code-panel-view': registerFeature('code-panel-view'),`
- **Comportamento esperado:** Escolhe se o editor mostra o canvas, o painel de código ou os dois lado a lado; o rótulo da porta é "Mostrar a tela, o código ou os dois" (`src/i18n/locales/pt-BR.json:455` `"command.setEditorView": "Mostrar a tela, o código ou os dois",`). O argumento `view` aceita `canvas`, `split` e `code` (`manifest/commands/view.json:996` `"canvas",`). A intenção da feature diz que Ver > Código abre o painel de código como aba na bancada inferior e que o painel mostra `index.html` e `styles.css` iguais aos arquivos que a exportação escreve (`manifest/features/17-code-panel.json:23` `"The panel shows index.html and styles.css with line numbers and syntax colouring, identical to the files the export writes.",`). Os cenários `the-code-view-draws-the-pane`, `the-split-view-draws-the-canvas-and-the-pane` e o terceiro com o canvas confirmam com as mensagens `status.view.code` (`manifest/features/17-code-panel.json:69` `"key": "status.view.code",`), `status.view.split` (`manifest/features/17-code-panel.json:130` `"key": "status.view.split",`) e `status.view.canvas` (`manifest/features/17-code-panel.json:198` `"key": "status.view.canvas",`). As portas — os três segmentos da barra do canvas, o item do menu Ver (`menu-view-code`) — enviam só o modo pedido ao mesmo tratador (G3). O comando não declara recusa (`manifest/commands/view.json:1007` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:1010` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas continua mostrando o mesmo documento (G7).

## REQ-2510 — view.setStyleState (Editar o estado {state})
- **Onde:** `manifest/commands/view.json:1112` `"id": "view.setStyleState",`
- **Tratador:** `src/app/commands.ts:456` `'view.setStyleState': setStyleState,`
- **Feature:** `src/app/features.ts:160` `'state-styles': registerFeature('state-styles'),`
- **Comportamento esperado:** Escolhe o estado de estilo em que a edição passa a gravar; o rótulo da porta é "Editar o estado {state}" (`src/i18n/locales/pt-BR.json:476` `"command.setStyleState": "Editar o estado {state}",`) e há um segundo rótulo de nome (`manifest/commands/view.json:1114` `"nameKey": "command.setStyleState.name",`). O argumento `state` é obrigatório (`manifest/commands/view.json:1119` `"type": "state",`). A intenção da feature diz que o menu de Estado lista Base, Hover, Focus, Active, Disabled, Invalid e Placeholder shown, que enquanto um estado está escolhido o canvas mostra a insígnia com o estado em edição e o elemento com os valores daquele estado, e que os valores ficam guardados por estado e por breakpoint sem mudar os da base (`manifest/features/11-responsive-and-states.json:1363` `"The State menu lists Base, Hover, Focus, Active, Disabled, Invalid and Placeholder shown; while a state is chosen a canvas badge reads 'Editing Hover' [canvas.badge.editingState] and the canvas shows the element with that state's values.",` e `manifest/features/11-responsive-and-states.json:1364` `"State values are stored per state (and per breakpoint) in the document JSON and do not change the base values.",`). No cenário `the-hover-state-takes-the-value` a porta escolhe Hover e o valor seguinte grava no caminho do estado (`manifest/features/11-responsive-and-states.json:1415` `"path": "/Page/Hero/Intro/@styles/desktop/hover/color",`). As portas são os itens do menu de estado (`menu-style-state-base` e os demais), que enviam só o estado ao mesmo tratador (G3). Quando um estado não se aplica ao elemento, a porta é recusada com `status.styleState.notApplicable` (`manifest/commands/view.json:1129` `"status.styleState.notApplicable"`). É comando de visão: não entra no histórico (`manifest/commands/view.json:1133` `"undoable": false`), não altera o documento nem a seleção (G1, G6); o estado escolhido faz parte do contexto em que a digitação é gravada (G1), e o canvas redesenha o documento com os valores daquele estado (G7).

## REQ-2511 — view.enterPreview (Pré-visualizar)
- **Onde:** `manifest/commands/view.json:1499` `"id": "view.enterPreview",`
- **Tratador:** `src/app/commands.ts:457` `'view.enterPreview': enterPreview,`
- **Feature:** `src/app/features.ts:162` `'preview-mode': registerFeature('preview-mode'),`
- **Comportamento esperado:** Mostra a página como ela sai na exportação, sem a moldura do editor; o rótulo da porta é "Pré-visualizar" (`src/i18n/locales/pt-BR.json:426` `"command.preview": "Pré-visualizar",`). A intenção da feature diz que a pré-visualização esconde as bancadas, a seleção, as guias e as alças e deixa só uma barra enxuta com o seletor de breakpoint, Sair da pré-visualização e Exportar (`manifest/features/12-preview-embed-theme.json:26` `"Preview hides docks, selection, guides and handles; only a slim bar with the breakpoint switcher, Exit preview and Export remains.",`), que a página é desenhada como na exportação e que a pré-visualização nunca muda o documento (`manifest/features/12-preview-embed-theme.json:27` `"The page renders exactly like the export: hover states apply and details open; links do not navigate the editor away.",` e `manifest/features/12-preview-embed-theme.json:29` `"Preview never changes the document JSON."`). No cenário `ctrl-p-shows-the-page-as-exported` a mensagem é `status.preview.on` (`manifest/features/12-preview-embed-theme.json:76` `"key": "status.preview.on",`). As quatro portas do comando — `Ctrl+P`, `Ctrl+Enter`, o botão da barra superior (`toolbar-top-bar-preview`) e a barra de comandos (`command-bar`) — enviam só a intenção ao mesmo tratador, sem argumentos (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:1511` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas continua mostrando o mesmo documento (G7). G4 exige que nada cubra o canvas no ponto da ação.

## REQ-2512 — view.exitPreview (Sair da pré-visualização)
- **Onde:** `manifest/commands/view.json:1600` `"id": "view.exitPreview",`
- **Tratador:** `src/app/commands.ts:458` `'view.exitPreview': exitPreview,`
- **Feature:** `src/app/features.ts:162` `'preview-mode': registerFeature('preview-mode'),`
- **Comportamento esperado:** Volta da pré-visualização para a edição; o rótulo da porta é "Sair da pré-visualização" (`src/i18n/locales/pt-BR.json:331` `"command.exitPreview": "Sair da pré-visualização",`). A intenção da feature diz que Esc ou `Ctrl+Enter` sai da pré-visualização e restaura a seleção e o zoom anteriores (`manifest/features/12-preview-embed-theme.json:28` `"Escape or Ctrl+Enter exits preview and restores the previous selection and zoom.",`). No cenário `escape-returns-to-editing-with-the-selection`, depois de entrar na pré-visualização com a seleção em `/Page/Hero/Intro`, o Esc confirma com `status.preview.off` (`manifest/features/12-preview-embed-theme.json:301` `"key": "status.preview.off",`) e a seleção continua em `/Page/Hero/Intro` (`manifest/features/12-preview-embed-theme.json:289` `"/Page/Hero/Intro"`). As três portas do comando — Esc no contexto `preview` (`key-escape-in-preview`), `Ctrl+Enter` no contexto `preview` (`key-ctrl-enter-in-preview`) e o botão Sair da barra da pré-visualização (`toolbar-preview-bar-exit`) — enviam só a intenção ao mesmo tratador, sem argumentos (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:1612` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha na seleção restaurada (G7). A seleção restaurada vem da store (G6).

## REQ-2513 — view.toggleOutlines (Contornos)
- **Onde:** `manifest/commands/view.json:1680` `"id": "view.toggleOutlines",`
- **Tratador:** `src/app/commands.ts:459` `'view.toggleOutlines': toggleOutlines,`
- **Feature:** `src/app/features.ts:146` `'canvas-outlines-zones': registerFeature('canvas-outlines-zones'),`
- **Comportamento esperado:** Liga e desliga os contornos dos elementos no canvas; o rótulo da porta é "Contornos" (`src/i18n/locales/pt-BR.json:505` `"command.toggleOutlines": "Contornos",`). A intenção da feature diz que os contornos desenham uma caixa tracejada em volta de cada elemento do canvas e que a escolha não muda o documento nem a exportação, ficando guardada nas preferências (`manifest/features/10-view-and-positioning.json:2862` `"Outlines draw a dashed box around every element on the canvas.",` e `manifest/features/10-view-and-positioning.json:2864` `"Neither changes the document JSON or the export; the choices are stored in preferences."`). No cenário `outlines-draw-a-box-around-every-element-and-stay-after-a-reload` o estado da porta é ligado e a preferência se mantém ao recarregar (`manifest/features/10-view-and-positioning.json:2922` `"persistence": {`). A porta é o botão de ícone de Contornos na caixa de ferramentas do canvas (`manifest/commands/view.json:1696` `"id": "canvas-tools-outlines",`), que envia só a intenção ao tratador (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:1692` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com ou sem contornos (G7). G4 exige que o resultado fique visível no canvas.

## REQ-2514 — view.toggleZones (Zonas)
- **Onde:** `manifest/commands/view.json:1724` `"id": "view.toggleZones",`
- **Tratador:** `src/app/commands.ts:460` `'view.toggleZones': toggleZones,`
- **Feature:** `src/app/features.ts:146` `'canvas-outlines-zones': registerFeature('canvas-outlines-zones'),`
- **Comportamento esperado:** Liga e desliga a marcação das zonas de espaçamento e de solta dos recipientes; o rótulo da porta é "Zonas" (`src/i18n/locales/pt-BR.json:510` `"command.toggleZones": "Zonas",`). A intenção da feature diz que as zonas mostram o espaçamento interno e as áreas vazias de solta dos recipientes e que a escolha não muda o documento nem a exportação, ficando guardada nas preferências (`manifest/features/10-view-and-positioning.json:2863` `"Zones show the padding and empty drop areas of containers.",` e `manifest/features/10-view-and-positioning.json:2864` `"Neither changes the document JSON or the export; the choices are stored in preferences."`). No cenário `zones-tint-the-padding-of-containers-and-stay-after-a-reload` a preferência se mantém ao recarregar (`manifest/features/10-view-and-positioning.json:2986` `"persistence": {`). A porta é o botão de ícone de Zonas na caixa de ferramentas do canvas (`manifest/commands/view.json:1740` `"id": "canvas-tools-zones",`), que envia só a intenção ao tratador (G3). É comando de visão: não entra no histórico (`manifest/commands/view.json:1736` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com ou sem zonas (G7).

## REQ-2515 — view.toggleRulers (Réguas)
- **Onde:** `manifest/commands/view.json:1768` `"id": "view.toggleRulers",`
- **Tratador:** `src/app/commands.ts:461` `'view.toggleRulers': toggleRulers,`
- **Feature:** `src/app/features.ts:148` `'workspace-settings-dialog': registerFeature('workspace-settings-dialog'),`
- **Comportamento esperado:** Liga e desliga as réguas ao longo do canvas; o rótulo da porta é "Réguas" (`src/i18n/locales/pt-BR.json:508` `"command.toggleRulers": "Réguas",`). No cenário `the-rulers-switch-hides-the-rulers` o interruptor da seção de Visibilidade do diálogo Guias e grades desliga as réguas e a régua passa a ter `display: none` (`manifest/features/10-view-and-positioning.json:3952` `"property": "display",` e `manifest/features/10-view-and-positioning.json:3953` `"value": "none"`). A porta é o interruptor de Réguas no diálogo Guias e grades (`manifest/commands/view.json:1784` `"id": "guides-grids-rulers",`), que envia só a intenção ao tratador (G3). A escolha fica guardada nas preferências (G1 para a captura do contexto; a visibilidade vive na preferência). É comando de visão: não entra no histórico (`manifest/commands/view.json:1780` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com ou sem réguas (G7). G5 exige que o interruptor caiba no diálogo em qualquer janela.

## REQ-2516 — view.toggleSmartGuides (Guias inteligentes)
- **Onde:** `manifest/commands/view.json:1812` `"id": "view.toggleSmartGuides",`
- **Tratador:** `src/app/commands.ts:462` `'view.toggleSmartGuides': toggleSmartGuides,`
- **Feature:** `src/app/features.ts:155` `'smart-guides': registerFeature('smart-guides'),`
- **Comportamento esperado:** Liga e desliga as linhas de alinhamento inteligente; o rótulo da porta é "Guias inteligentes" (`src/i18n/locales/pt-BR.json:509` `"command.toggleSmartGuides": "Guias inteligentes",`). A intenção da feature diz que as linhas de alinhamento aparecem quando bordas ou centros se alinham com outros elementos e que o diálogo Guias e grades ganha um interruptor de Guias inteligentes sob Visibilidade, cujo desligamento remove essas pistas (`manifest/features/10-view-and-positioning.json:13046` `"Alignment lines appear when edges or centres align with other elements.",` e `manifest/features/10-view-and-positioning.json:13048` `"The Guides & Grids dialog gains a Smart guides toggle under Visibility and an Equal spacing toggle; turning smart guides off removes these hints."`). No cenário `smart-guides-off-keeps-snapping` a porta desliga as guias inteligentes mas o encaixe continua (`manifest/features/10-view-and-positioning.json:13680` `"id": "smart-guides-off-keeps-snapping",`). A porta é o interruptor de Guias inteligentes no diálogo Guias e grades (`manifest/commands/view.json:1828` `"id": "guides-grids-smart-guides",`), que envia só a intenção ao tratador (G3). A escolha fica guardada nas preferências. É comando de visão: não entra no histórico (`manifest/commands/view.json:1824` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com ou sem as pistas (G7).

## REQ-2517 — view.toggleEqualSpacing (Espaçamento igual)
- **Onde:** `manifest/commands/view.json:1856` `"id": "view.toggleEqualSpacing",`
- **Tratador:** `src/app/commands.ts:463` `'view.toggleEqualSpacing': toggleEqualSpacing,`
- **Feature:** `src/app/features.ts:155` `'smart-guides': registerFeature('smart-guides'),`
- **Comportamento esperado:** Liga e desliga as marcas de espaçamento igual; o rótulo da porta é "Espaçamento igual" (`src/i18n/locales/pt-BR.json:501` `"command.toggleEqualSpacing": "Espaçamento igual",`). A intenção da feature diz que as marcas de espaçamento igual aparecem quando os vãos ficam iguais e a caixa se encaixa na posição de vão igual com o encaixe ligado, usando a distância das configurações de encaixe (`manifest/features/10-view-and-positioning.json:13047` `"Equal spacing markers appear when the gaps are equal and the box snaps to the equal-gap position when snap is on, using the snap distance from Snap settings (one setting).",`). No cenário `equal-spacing-off-repeats-no-gap` a porta desliga o espaçamento igual e o arraste seguinte não encaixa em vão nenhum (`manifest/features/10-view-and-positioning.json:13352` `"id": "equal-spacing-off-repeats-no-gap",`). A porta é o interruptor de Espaçamento igual no diálogo Guias e grades (`manifest/commands/view.json:1872` `"id": "guides-grids-equal-spacing",`), que envia só a intenção ao tratador (G3). A escolha fica guardada nas preferências. É comando de visão: não entra no histórico (`manifest/commands/view.json:1868` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com ou sem as marcas (G7).

## REQ-2518 — grid.toggleColumns (Grade de colunas)
- **Onde:** `manifest/commands/view.json:1900` `"id": "grid.toggleColumns",`
- **Tratador:** `src/app/commands.ts:464` `'grid.toggleColumns': toggleColumns,`
- **Feature:** `src/app/features.ts:147` `'layout-grid-overlay': registerFeature('layout-grid-overlay'),`
- **Comportamento esperado:** Mostra e esconde a grade de colunas sobre a página; o rótulo da porta é "Grade de colunas" (`src/i18n/locales/pt-BR.json:358` `"command.grid.columns": "Grade de colunas",`). A intenção da feature diz que `Ctrl+'` alterna uma grade de doze colunas (1280 px de largura, 24 px de calha e 80 px de margem por padrão) desenhada sobre a página nas coordenadas certas e que as configurações da grade ficam guardadas por página no documento (`manifest/features/10-view-and-positioning.json:3094` `"Ctrl+' toggles a 12-column grid overlay (1280 px wide, 24 px gutter, 80 px margin by default) drawn over the page at the right page coordinates.",` e `manifest/features/10-view-and-positioning.json:3096` `"Grid settings are stored per page in the document JSON and never exported."`). No cenário `the-column-grid-is-drawn-at-its-default-sizes-and-saved-with-the-page` a porta grava `gridColumns` em verdadeiro na página e confirma com `status.grid.columnsShown` (`manifest/features/10-view-and-positioning.json:3146` `"key": "status.grid.columnsShown",`); no cenário `the-column-grid-toggled-again-is-hidden` a mensagem é `status.grid.columnsHidden`. As portas — `Ctrl+'` (`key-ctrl-quote-in-global`), o botão de ícone na caixa de ferramentas do canvas (`canvas-tools-column-grid`) e o interruptor do diálogo Guias e grades (`guides-grids-column-grid`) — enviam só a intenção ao mesmo tratador (G3). Cada alternância é uma entrada de undo (`manifest/commands/view.json:1912` `"undoable": true,`) e o undo restaura a seleção de antes do comando (`undoRestoresSelection`); sem mudança não há entrada (`manifest/commands/view.json:1916` `"noChange": "no-entry"`). G1: a alternância grava no breakpoint e na seleção do momento.

## REQ-2519 — grid.toggleRows (Grade de linhas)
- **Onde:** `manifest/commands/view.json:1994` `"id": "grid.toggleRows",`
- **Tratador:** `src/app/commands.ts:465` `'grid.toggleRows': toggleRows,`
- **Feature:** `src/app/features.ts:147` `'layout-grid-overlay': registerFeature('layout-grid-overlay'),`
- **Comportamento esperado:** Mostra e esconde a grade de linhas sobre a página; o rótulo da porta é "Grade de linhas" (`src/i18n/locales/pt-BR.json:360` `"command.grid.rows": "Grade de linhas",`). A intenção da feature diz que a grade de linhas desenha faixas horizontais e a grade de pontos desenha pontos, cada uma no espaçamento padrão (`manifest/features/10-view-and-positioning.json:3095` `"The row grid draws horizontal bands and the dot grid draws dots, each at its default spacing.",`), e que as configurações ficam guardadas por página no documento (`manifest/features/10-view-and-positioning.json:3096` `"Grid settings are stored per page in the document JSON and never exported."`). No cenário `the-row-grid-is-drawn-at-its-default-height` a porta grava `gridRows` em verdadeiro na página e confirma com `status.grid.rowsShown` (`manifest/features/10-view-and-positioning.json:3285` `"key": "status.grid.rowsShown",`). As portas — o botão de ícone na caixa de ferramentas do canvas (`canvas-tools-row-grid`) e o interruptor do diálogo Guias e grades (`guides-grids-row-grid`) — enviam só a intenção ao mesmo tratador (G3). Cada alternância é uma entrada de undo (`manifest/commands/view.json:2006` `"undoable": true,`) e o undo restaura a seleção de antes do comando; sem mudança não há entrada (`manifest/commands/view.json:2010` `"noChange": "no-entry"`). G1: a alternância grava no breakpoint e na seleção do momento.

## REQ-2520 — grid.toggleDots (Grade de pontos)
- **Onde:** `manifest/commands/view.json:2068` `"id": "grid.toggleDots",`
- **Tratador:** `src/app/commands.ts:466` `'grid.toggleDots': toggleDots,`
- **Feature:** `src/app/features.ts:147` `'layout-grid-overlay': registerFeature('layout-grid-overlay'),`
- **Comportamento esperado:** Mostra e esconde a grade de pontos sobre a página; o rótulo da porta é "Grade de pontos" (`src/i18n/locales/pt-BR.json:359` `"command.grid.dots": "Grade de pontos",`). A intenção da feature diz que a grade de pontos desenha pontos no espaçamento padrão (`manifest/features/10-view-and-positioning.json:3095` `"The row grid draws horizontal bands and the dot grid draws dots, each at its default spacing.",`). No cenário `the-dot-grid-covers-the-page` a porta grava `gridDots` em verdadeiro na página e confirma com `status.grid.dotsShown` (`manifest/features/10-view-and-positioning.json:3364` `"key": "status.grid.dotsShown",`). As portas — o botão de ícone na caixa de ferramentas do canvas (`canvas-tools-dot-grid`) e o interruptor do diálogo Guias e grades (`guides-grids-dot-grid`) — enviam só a intenção ao mesmo tratador (G3). Cada alternância é uma entrada de undo (`manifest/commands/view.json:2080` `"undoable": true,`) e o undo restaura a seleção de antes do comando; sem mudança não há entrada (`manifest/commands/view.json:2084` `"noChange": "no-entry"`). G1: a alternância grava no breakpoint e na seleção do momento.

## REQ-2521 — grid.toggleFolds (Mostrar ou ocultar as linhas de dobra)
- **Onde:** `manifest/commands/view.json:2142` `"id": "grid.toggleFolds",`
- **Tratador:** `src/app/commands.ts:467` `'grid.toggleFolds': toggleFolds,`
- **Feature:** `src/app/features.ts:148` `'workspace-settings-dialog': registerFeature('workspace-settings-dialog'),`
- **Comportamento esperado:** Mostra e esconde as linhas de dobra do breakpoint; o rótulo da porta é "Mostrar ou ocultar as linhas de dobra" (`src/i18n/locales/pt-BR.json:502` `"command.toggleFolds": "Mostrar ou ocultar as linhas de dobra",`). No cenário coberto pela feature o interruptor de linhas de dobra na seção de grades do diálogo confirma com `status.grid.foldsShown` (`manifest/features/11-responsive-and-states.json:799` `"key": "status.grid.foldsShown",`). A porta é o interruptor de Linhas de dobra no diálogo Guias e grades (`manifest/commands/view.json:2162` `"id": "guides-grids-fold-lines",`), que envia só a intenção ao tratador (G3). Cada alternância é uma entrada de undo (`manifest/commands/view.json:2154` `"undoable": true,`) e o undo restaura a seleção de antes do comando; sem mudança não há entrada (`manifest/commands/view.json:2158` `"noChange": "no-entry"`). G1: a alternância grava no breakpoint e na seleção do momento.

## REQ-2522 — grid.setSettings (Mudar as configurações da grade)
- **Onde:** `manifest/commands/view.json:2190` `"id": "grid.setSettings",`
- **Tratador:** `src/app/commands.ts:468` `'grid.setSettings': setGridSettings,`
- **Feature:** `src/app/features.ts:148` `'workspace-settings-dialog': registerFeature('workspace-settings-dialog'),`
- **Comportamento esperado:** Muda um valor das configurações da grade de colunas, linhas ou pontos; o rótulo da porta é "Mudar as configurações da grade" (`src/i18n/locales/pt-BR.json:361` `"command.grid.settings": "Mudar as configurações da grade",`). Os argumentos são a grade, a configuração e o valor (`manifest/commands/view.json:2195` `"grid": {`), obrigatórios. No cenário `the-column-grid-takes-its-settings` os campos do diálogo enviam contar, largura, calha e margem e a porta grava a grade de colunas na página com os valores enviados (`manifest/features/10-view-and-positioning.json:4304` `"path": "/Page/@grid",`) confirmando com `status.grid.set` (`manifest/features/10-view-and-positioning.json:4328` `"key": "status.grid.set",`). A intenção da feature diz que cada mudança passa a valer no canvas na hora e fica guardada (a visibilidade na preferência, grades e guias na página) (`manifest/features/10-view-and-positioning.json:3701` `"Each change applies to the canvas immediately and is stored (visibility in preferences, grids and guides in the page).",`). Quando o valor sai da faixa, no cenário `a-setting-out-of-its-bounds-is-refused` a porta é recusada com `status.grid.outOfRange` mostrando o mínimo e o máximo (`manifest/features/10-view-and-positioning.json:4644` `"key": "status.grid.outOfRange",`), e o documento fica inalterado (`manifest/features/10-view-and-positioning.json:4659` `"key": "status.grid.outOfRange",`); o comando declara essa recusa (`manifest/commands/view.json:2226` `"refusals": [`). As portas são os campos de colunas, linhas e pontos do diálogo Guias e grades, que enviam só grade, configuração e valor ao mesmo tratador (G3); como toda digitação, o valor é gravado no contexto em que foi feito (G1) e não se perde quando a seleção muda com a digitação pendente (G2). Cada mudança é uma entrada de undo (`manifest/commands/view.json:2231` `"undoable": true,`).

## REQ-2523 — guides.create (Adicionar uma guia)
- **Onde:** `manifest/commands/view.json:2325` `"id": "guides.create",`
- **Tratador:** `src/app/commands.ts:469` `'guides.create': createGuideCommand,`
- **Feature:** `src/app/features.ts:145` `'guides-manual': registerFeature('guides-manual'),`
- **Comportamento esperado:** Cria uma guia na página; o rótulo da porta é "Adicionar uma guia" (`src/i18n/locales/pt-BR.json:362` `"command.guides.create": "Adicionar uma guia",`). Os argumentos são o eixo (horizontal ou vertical) e a posição (`manifest/commands/view.json:2330` `"axis": {`), obrigatórios. A intenção da feature diz que arrastar para fora da régua de cima cria uma guia horizontal e para fora da régua da esquerda uma guia vertical, cada uma rotulada com a posição em px de página (`manifest/features/10-view-and-positioning.json:1998` `"Dragging out of the top ruler creates a horizontal guide and out of the left ruler a vertical guide, each labelled with its position in page px.",`), e que as guias ficam guardadas por página no documento, restauradas ao recarregar e nunca exportadas, sendo criar, mover e excluir guias etapas de undo (`manifest/features/10-view-and-positioning.json:2000` `"Guides are stored per page in the document JSON, restored after reload and never exported; creating, moving and deleting guides are undo steps."`). Os cenários `dragging-out-of-the-top-ruler-creates-a-horizontal-guide` (`manifest/features/10-view-and-positioning.json:2045` `"op": "set",`) e `dragging-out-of-the-left-ruler-creates-a-vertical-guide` (`manifest/features/10-view-and-positioning.json:2139` `"op": "set",`) gravam a guia em `/Page/@guides` e confirmam com `status.guides.at` (`manifest/features/10-view-and-positioning.json:2161` `"key": "status.guides.at",`); o cenário `a-vertical-guide-is-added-by-typing-its-place` cobre a porta do campo do diálogo (`manifest/features/10-view-and-positioning.json:4073` `"door": "guides.create#guides-grids-add-guide",`). As portas — o arraste da régua de cima (`canvas-drag-top-ruler-page`), o arraste da régua da esquerda (`canvas-drag-left-ruler-page`) e o botão Adicionar uma guia do diálogo Guias e grades (`guides-grids-add-guide`) — enviam só eixo e posição ao mesmo tratador (G3). Quando não há posição, a porta é recusada com `status.guides.noPosition` (`manifest/commands/view.json:2349` `"status.guides.noPosition"`). Cada guia criada é uma entrada de undo (`manifest/commands/view.json:2353` `"undoable": true,`) e o undo restaura a seleção de antes do comando; sem mudança não há entrada (`manifest/commands/view.json:2357` `"noChange": "no-entry"`).

## REQ-2524 — guides.move (Mover a guia)
- **Onde:** `manifest/commands/view.json:2429` `"id": "guides.move",`
- **Tratador:** `src/app/commands.ts:470` `'guides.move': moveGuideCommand,`
- **Feature:** `src/app/features.ts:145` `'guides-manual': registerFeature('guides-manual'),`
- **Comportamento esperado:** Move uma guia para outra posição; o rótulo da porta é "Mover a guia" (`src/i18n/locales/pt-BR.json:365` `"command.guides.move": "Mover a guia",`). Os argumentos são a guia, a posição, o passo e o eixo, uns obrigatórios e outros opcionais (`manifest/commands/view.json:2434` `"guide": {`). A intenção da feature diz que as guias podem ser movidas (`manifest/features/10-view-and-positioning.json:1999` `"Guides can be moved; dropping a guide on its ruler deletes it.",`). Os cenários `a-guide-dragged-to-a-new-place-moves` (`manifest/features/10-view-and-positioning.json:2205` `"door": "guides.move#canvas-drag-guide-page",`), `arrow-down-moves-a-horizontal-guide-one-pixel` (passo de um) e `shift-arrow-up-moves-a-horizontal-guide-ten-pixels` (passo de dez com `Shift`) mudam a posição da guia em `/Page/@guides` e confirmam com `status.guides.at` (`manifest/features/10-view-and-positioning.json:2245` `"key": "status.guides.at",`). As portas — o arraste da guia (`canvas-drag-guide-page`) e as teclas de seta no contexto da guia (`key-arrow-up-in-guide`, `key-arrow-down-in-guide`, `key-arrow-left-in-guide`, `key-arrow-right-in-guide`) — enviam só a intenção ao mesmo tratador (G3). Quando a guia está bloqueada, no cenário `a-locked-guide-is-not-moved` a porta é recusada com `status.guides.locked` e o documento fica inalterado (`manifest/features/10-view-and-positioning.json:2827` `"key": "status.guides.locked",` e `manifest/features/10-view-and-positioning.json:2838` `"key": "status.guides.locked",`); o comando declara essa recusa (`manifest/commands/view.json:2471` `"status.guides.locked"`). Cada movimento é uma entrada de undo (`manifest/commands/view.json:2475` `"undoable": true,`) e o undo restaura a seleção de antes do comando.

## REQ-2525 — guides.delete (Excluir a guia)
- **Onde:** `manifest/commands/view.json:2597` `"id": "guides.delete",`
- **Tratador:** `src/app/commands.ts:471` `'guides.delete': deleteGuideCommand,`
- **Feature:** `src/app/features.ts:145` `'guides-manual': registerFeature('guides-manual'),`
- **Comportamento esperado:** Exclui a guia escolhida; o rótulo da porta é "Excluir a guia" (`src/i18n/locales/pt-BR.json:363` `"command.guides.delete": "Excluir a guia",`). O argumento é a guia (`manifest/commands/view.json:2602` `"guide": {`), obrigatório. A intenção da feature diz que soltar uma guia na própria régua apaga a guia (`manifest/features/10-view-and-positioning.json:1999` `"Guides can be moved; dropping a guide on its ruler deletes it.",`). No cenário `a-guide-dropped-on-its-ruler-is-deleted` a porta remove a guia de `/Page/@guides` e confirma com `status.guides.deleted` (`manifest/features/10-view-and-positioning.json:2335` `"key": "status.guides.deleted",`); no cenário `delete-removes-the-focused-guide` as duas teclas de exclusão dão o mesmo resultado (`manifest/features/10-view-and-positioning.json:2641` `"guides.delete#key-delete-in-guide",` e `manifest/features/10-view-and-positioning.json:2642` `"guides.delete#key-backspace-in-guide"`); no cenário `a-guide-is-removed-by-its-button` o botão de remover do diálogo faz o mesmo (`manifest/features/10-view-and-positioning.json:4195` `"key": "status.guides.deleted",`). As portas — o arraste da guia para a própria régua (`canvas-drag-guide-own-ruler`), as teclas Delete e Backspace no contexto da guia e o botão Remover do diálogo Guias e grades (`guides-grids-remove-guide`) — enviam só a intenção ao mesmo tratador (G3). O comando não declara recusa (`manifest/commands/view.json:2613` `"refusals": [],`). Cada exclusão é uma entrada de undo (`manifest/commands/view.json:2616` `"undoable": true,`) e o undo restaura a seleção de antes do comando.

## REQ-2526 — guides.toggleLock (Bloquear ou desbloquear a guia)
- **Onde:** `manifest/commands/view.json:2712` `"id": "guides.toggleLock",`
- **Tratador:** `src/app/commands.ts:472` `'guides.toggleLock': toggleGuideLockCommand,`
- **Feature:** `src/app/features.ts:145` `'guides-manual': registerFeature('guides-manual'),`
- **Comportamento esperado:** Bloqueia e desbloqueia a guia escolhida; o rótulo da porta é "Bloquear ou desbloquear a guia" (`src/i18n/locales/pt-BR.json:364` `"command.guides.lock": "Bloquear ou desbloquear a guia",`). O argumento é a guia (`manifest/commands/view.json:2717` `"guide": {`), obrigatório. No cenário `l-locks-the-focused-guide` a tecla L na guia em foco grava o bloqueio na guia de `/Page/@guides` e confirma com `status.guides.lockedNow` (`manifest/features/10-view-and-positioning.json:2734` `"key": "status.guides.lockedNow",`); a guia bloqueada deixa de se mover, no cenário `a-locked-guide-is-not-moved` (`manifest/features/10-view-and-positioning.json:2751` `"id": "a-locked-guide-is-not-moved",`). A porta é a tecla L no contexto da guia (`manifest/commands/view.json:2739` `"id": "key-l-in-guide",`), que envia só a intenção ao tratador (G3). O comando não declara recusa (`manifest/commands/view.json:2728` `"refusals": [],`). Cada alternância é uma entrada de undo (`manifest/commands/view.json:2731` `"undoable": true,`) e o undo restaura a seleção de antes do comando; sem mudança não há entrada (`manifest/commands/view.json:2735` `"noChange": "no-entry"`).

## REQ-2527 — guides.toggleVisible (Guias manuais)
- **Onde:** `manifest/commands/view.json:2761` `"id": "guides.toggleVisible",`
- **Tratador:** `src/app/commands.ts:473` `'guides.toggleVisible': toggleGuidesVisible,`
- **Feature:** `src/app/features.ts:148` `'workspace-settings-dialog': registerFeature('workspace-settings-dialog'),`
- **Comportamento esperado:** Mostra e esconde as guias manuais; o rótulo da porta é "Guias manuais" (`src/i18n/locales/pt-BR.json:366` `"command.guides.visible": "Guias manuais",`). A intenção da feature diz que o diálogo tem as seções de Visibilidade, Guias manuais, Grade de colunas, Grade de linhas e Grade de pontos, cada uma com uma dica de informação (`manifest/features/10-view-and-positioning.json:3700` `"The dialog has Visibility, Manual guides, Column grid, Row grid and Dot grid sections, each with an info tooltip.",`). No cenário `the-manual-guides-switch-hides-the-guides` a porta do interruptor de Guias manuais esconde as guias e a preferência se mantém ao recarregar (`manifest/features/10-view-and-positioning.json:4041` `"preferences": "same"`). A porta é o interruptor de Guias manuais no diálogo Guias e grades (`manifest/commands/view.json:2777` `"id": "guides-grids-manual-guides",`), que envia só a intenção ao tratador (G3). A escolha fica guardada nas preferências. É comando de visão: não entra no histórico (`manifest/commands/view.json:2773` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com ou sem as guias (G7).

## REQ-2528 — snap.setEnabled (Encaixe)
- **Onde:** `manifest/commands/view.json:2805` `"id": "snap.setEnabled",`
- **Tratador:** `src/app/commands.ts:474` `'snap.setEnabled': setSnapEnabled,`
- **Feature:** `src/app/features.ts:153` `'snap-toggle-settings': registerFeature('snap-toggle-settings'),`
- **Comportamento esperado:** Liga e desliga o encaixe; o rótulo da porta é "Encaixe" (`src/i18n/locales/pt-BR.json:484` `"command.snap": "Encaixe",`). O argumento `enabled` aceita `toggle`, `on` e `off` (`manifest/commands/view.json:2813` `"toggle",`). A intenção da feature diz que o botão da barra superior alterna entre o encaixe desligado e ligado, com os dois rótulos da barra (`manifest/features/10-view-and-positioning.json:11572` `"The top bar button toggles between 'Snap: Off' [topbar.snap.off] and 'Snap: On' [topbar.snap.on].",`), e que as escolhas ficam guardadas nas preferências (`manifest/features/10-view-and-positioning.json:11574` `"Apply stores the settings in preferences; Cancel discards changes."`). Os cenários `the-snap-button-turns-snap-on` (`manifest/features/10-view-and-positioning.json:11619` `"key": "status.snap.on",`), `the-snap-button-turns-snap-off-again` (`manifest/features/10-view-and-positioning.json:11687` `"key": "status.snap.off",`), `the-snap-menu-turns-snap-on` e `the-snap-menu-turns-snap-off` cobrem as portas. As três portas — o botão da barra do canvas (`toolbar-canvas-toolbar-snap`) e os itens do menu de encaixe (`menu-snap-on`, `menu-snap-off`) — enviam só a intenção ao mesmo tratador (G3). O comando não declara recusa (`manifest/commands/view.json:2824` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:2827` `"undoable": false`), não altera o documento nem a seleção (G1, G6).

## REQ-2529 — snap.setSettings (Aplicar as configurações de encaixe)
- **Onde:** `manifest/commands/view.json:2905` `"id": "snap.setSettings",`
- **Tratador:** `src/app/commands.ts:475` `'snap.setSettings': setSnapSettings,`
- **Feature:** `src/app/features.ts:153` `'snap-toggle-settings': registerFeature('snap-toggle-settings'),`
- **Comportamento esperado:** Aplica os alvos e a distância do encaixe; o rótulo da porta é "Aplicar as configurações de encaixe" (`src/i18n/locales/pt-BR.json:485` `"command.snap.settings": "Aplicar as configurações de encaixe",`). Os argumentos são os alvos e a distância (`manifest/commands/view.json:2910` `"targets": {`), obrigatórios. A intenção da feature diz que as configurações de encaixe listam os alvos Página, Pai, Elementos, Guias, Réguas, Grade, Centros e Bordas e uma distância de encaixe em px (`manifest/features/10-view-and-positioning.json:11573` `"Snap settings lists Page, Parent, Elements, Guides, Rulers, Grid, Centers and Edges targets and a snap distance in px.",`) e que Aplicar guarda as configurações nas preferências enquanto Cancelar descarta as mudanças (`manifest/features/10-view-and-positioning.json:11574` `"Apply stores the settings in preferences; Cancel discards changes."`). No cenário `apply-keeps-the-targets-and-the-distance` a porta confirma com `status.snap.settingsKept` (`manifest/features/10-view-and-positioning.json:11942` `"key": "status.snap.settingsKept",`). Quando a distância sai da faixa, no cenário `a-distance-out-of-its-range-is-refused` a porta é recusada com `status.snap.distanceRange` e o documento fica inalterado (`manifest/features/10-view-and-positioning.json:12020` `"key": "status.snap.distanceRange",` e `manifest/features/10-view-and-positioning.json:12031` `"key": "status.snap.distanceRange",`); o comando declara essa recusa (`manifest/commands/view.json:2934` `"refusals": [`). A porta é o botão Aplicar do diálogo de configurações de encaixe (`manifest/commands/view.json:2943` `"id": "snap-settings-apply",`), que envia só os alvos e a distância ao tratador (G3); como toda digitação, os valores são gravados no contexto em que foram feitos (G1) e não se perdem quando a seleção muda com a digitação pendente (G2). É comando de preferência: não entra no histórico (`manifest/commands/view.json:2939` `"undoable": false`), não altera o documento nem a seleção (G1, G6).

## REQ-2530 — workspace.openDialog (Abrir {dialog})
- **Onde:** `manifest/commands/view.json:2971` `"id": "workspace.openDialog",`
- **Tratador:** `src/app/commands.ts:476` `'workspace.openDialog': openDialog,`
- **Feature:** `src/app/features.ts:148` `'workspace-settings-dialog': registerFeature('workspace-settings-dialog'),`
- **Comportamento esperado:** Abre o diálogo pedido; o rótulo da porta é "Abrir {dialog}" (`src/i18n/locales/pt-BR.json:406` `"command.openDialog": "Abrir {dialog}",`) e há um segundo rótulo de nome (`manifest/commands/view.json:2973` `"nameKey": "command.openDialog.name",`). O argumento `dialog` aceita `guides-grids`, `snap-settings`, `breakpoints`, `batch-rename` e `capture-url` (`manifest/commands/view.json:2980` `"guides-grids",`). A intenção da feature dos diálogos diz que Ver > Guias e grades abre o diálogo e que Esc e o botão de fechar o fecham devolvendo o foco aonde estava (`manifest/features/10-view-and-positioning.json:3702` `"Escape and the close button close the dialog and return focus to where it was."`). No cenário `view-guides-and-grids-opens-the-dialog` a porta do item do menu Ver abre o diálogo (`manifest/features/10-view-and-positioning.json:3746` `"region": "guides-grids-dialog",`); no cenário `snap-settings-opens-from-the-snap-menu` o item do menu de encaixe abre o diálogo de configurações de encaixe (`manifest/features/10-view-and-positioning.json:11868` `"region": "snap-settings-dialog",`). As portas — os itens do menu Ver e do menu de encaixe, o item do menu de contexto de renomeação em lote, o item do menu Arquivo de captura por URL — enviam só o identificador do diálogo ao mesmo tratador (G3). O comando não declara recusa (`manifest/commands/view.json:2993` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:2996` `"undoable": false`), não altera o documento nem a seleção (G1, G6). G5 exige que o diálogo caiba em qualquer janela.

## REQ-2531 — view.setViewportWidth (Largura da tela em pixels)
- **Onde:** `manifest/commands/view.json:3120` `"id": "view.setViewportWidth",`
- **Tratador:** `src/app/commands.ts:447` `'view.setViewportWidth': setViewportWidth,`
- **Feature:** `src/app/features.ts:158` `'breakpoints-switch': registerFeature('breakpoints-switch'),`
- **Comportamento esperado:** Dá ao canvas uma largura contínua em px, escolhendo a cascata de breakpoint em vigor sem mudar a página; o rótulo da porta é "Largura da tela em pixels" (`src/i18n/locales/pt-BR.json:2165` `"command.setViewportWidth": "Largura da tela em pixels",`). O argumento `width` é um número obrigatório (`manifest/commands/view.json:3126` `"type": "number",`). No cenário `a-continuous-width-selects-the-cascade-without-changing-the-page` a porta do campo do diálogo de breakpoints fixa 1024 px, a largura de `/Page/Hero` passa a 1024 px e a mensagem `status.viewport.set` nomeia o breakpoint em vigor, Laptop (`manifest/features/11-responsive-and-states.json:877` `"key": "status.viewport.set",` e `manifest/features/11-responsive-and-states.json:880` `"breakpoint": "Laptop"`). A porta é o campo de largura no diálogo de breakpoints (`manifest/commands/view.json:3144` `"id": "viewport-width",`), que envia só a largura ao tratador (G3). Quando a largura não é válida, a porta é recusada com `status.viewport.invalid` (`manifest/commands/view.json:3136` `"status.viewport.invalid"`). É comando de visão: não entra no histórico (`manifest/commands/view.json:3140` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha na nova largura (G7).

## REQ-2532 — view.resizeViewport (Arraste a borda do quadro para mudar a largura)
- **Onde:** `manifest/commands/view.json:3172` `"id": "view.resizeViewport",`
- **Tratador:** `src/app/commands.ts:448` `'view.resizeViewport': resizeViewport,`
- **Feature:** `src/app/features.ts:158` `'breakpoints-switch': registerFeature('breakpoints-switch'),`
- **Comportamento esperado:** Muda a largura do quadro arrastando a borda; o rótulo da porta é "Arraste a borda do quadro para mudar a largura" (`src/i18n/locales/pt-BR.json:3365` `"command.resizeViewport": "Arraste a borda do quadro para mudar a largura",`). Os argumentos são o tamanho opcional e a distância obrigatória (`manifest/commands/view.json:3177` `"size": {`). No cenário `dragging-the-frame-edge-changes-the-width` o arraste da borda do quadro com distância de cem px para dentro deixa `status.viewport.set` com a largura 1040 e o breakpoint Laptop (`manifest/features/11-responsive-and-states.json:933` `"key": "status.viewport.set",` e `manifest/features/11-responsive-and-states.json:935` `"width": 1040,`). A porta é o arraste da borda do quadro (`manifest/commands/view.json:3199` `"id": "panel-drag-frame-edge",`), que envia só a intenção ao tratador (G3). O comando não declara recusa (`manifest/commands/view.json:3192` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:3195` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha na nova largura (G7).

## REQ-2533 — view.toggleSideBySide (Lado a lado)
- **Onde:** `manifest/commands/view.json:3221` `"id": "view.toggleSideBySide",`
- **Tratador:** `src/app/commands.ts:449` `'view.toggleSideBySide': toggleSideBySide,`
- **Feature:** `src/app/features.ts:237` `'side-by-side-view': registerFeature('side-by-side-view'),`
- **Comportamento esperado:** Liga e desliga a vista em que todos os breakpoints aparecem ao mesmo tempo; o rótulo da porta é "Lado a lado" (`src/i18n/locales/pt-BR.json:3366` `"command.toggleSideBySide": "Lado a lado",`). A intenção da feature diz que os outros breakpoints mostram a página ao vivo, cada um na própria largura, com a seleção contornada em cada um (`manifest/features/26-project-breakpoints.json:1738` `"The other breakpoints show the page live, each at its own width, the selection outlined in each.",`). No cenário `side-by-side-shows-the-other-breakpoints` a porta confirma com a mensagem de preferência ligada, nomeando Lado a lado (`manifest/features/26-project-breakpoints.json:1783` `"key": "status.preference.on",`). A porta é o item do menu Ver (`manifest/commands/view.json:3237` `"id": "menu-view-side-by-side",`), que envia só a intenção ao tratador (G3). O comando não declara refusa (`manifest/commands/view.json:3230` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:3233` `"undoable": false`), não altera o documento nem a seleção (G1, G6), e o canvas redesenha com os quadros dos breakpoints (G7). G4 exige que os quadros não cubram o canvas no ponto da ação.

## REQ-2534 — view.selectTool (Seleção (V))
- **Onde:** `manifest/commands/view.json:3261` `"id": "view.selectTool",`
- **Tratador:** `src/app/commands.ts:450` `'view.selectTool': selectTool,`
- **Feature:** `src/app/features.ts:18` `'select-click': registerFeature('select-click'),`
- **Comportamento esperado:** Volta a ferramenta ativa para a de seleção; o rótulo da porta é "Seleção (V)" (`src/i18n/locales/pt-BR.json:3367` `"command.selectTool": "Seleção (V)",`). A intenção da feature diz que depois de cada clique a seleção do documento é o elemento clicado, com um contorno igual à caixa medida do elemento no canvas e um rótulo com a tag e o nome (`manifest/features/02-structure-editing.json:1097` `"After each click the document selection is the clicked element; a selection outline matches the element's measured bounding box on the canvas and a label shows its tag and name.",`), e que Esc limpa a seleção e remove o contorno (`manifest/features/02-structure-editing.json:1100` `"Escape clears the selection and removes the selection outline."`). As duas portas — o botão de ícone da barra do canvas (`toolbar-canvas-toolbar-select`) e a tecla `V` (`key-v-in-global`) — enviam só a intenção ao mesmo tratador (G3); o cenário `click-selects-the-element` cobre a seleção por clique no canvas (`manifest/features/02-structure-editing.json:1147` `"key": "status.selected",`). O comando não declara recusa (`manifest/commands/view.json:3270` `"refusals": [],`). É comando de visão: não entra no histórico (`manifest/commands/view.json:3273` `"undoable": false`), não altera o documento (G1); a seleção vive na store como fonte única e todas as vistas derivam dela (G6), e o canvas redesenha o contorno a partir da store (G7).

## REQ-6201 — workspace.setPanelOpen (Mostrar ou ocultar um painel)
- **Onde:** `manifest/commands/workspace.json:5` `"id": "workspace.setPanelOpen",`
- **Tratador:** `src/app/commands.ts:477` `'workspace.setPanelOpen': setPanelOpen,`
- **Feature:** `src/app/features.ts:14` `'editor-shell': registerFeature('editor-shell'),`
- **Comportamento esperado:** Abre, fecha ou alterna um painel nomeado (Elements, Layers, Inspector, Explorer, Timeline, Motion, Variáveis, Verificações, Bancada, Atalhos, Documento, Ferramentas do canvas, Assistente, Compositor de layout e Dados), conforme o argumento `open` valer `open`, `close` ou `toggle`, fechando quando ele já estiver aberto e abrindo quando estiver fechado. O rótulo da interface é "Mostrar ou ocultar {panel}" (`src/i18n/locales/pt-BR.json:506` `"command.togglePanel": "Mostrar ou ocultar {panel}",`), e a barra de status reporta cada mudança com `status.panel.opened` — "Painel {panel} aberto." (`src/i18n/locales/pt-BR.json:1881` `"status.panel.opened": "Painel {panel} aberto.",`) — e `status.panel.closed`. A feature `editor-shell` fixa o arranjo padrão: a doca esquerda mostra Elements acima de Layers, a doca direita mostra o Inspector, a barra de status fecha a parte de baixo e a bancada inferior começa fechada, de modo que os painéis acrescentados depois abrem como abas nas docas existentes ou na bancada (`manifest/features/01-foundation.json:23` `"The bottom workbench dock is closed by default; panels added by later entries open as tabs in existing docks or in that workbench, so these five regions stay the default layout."`). Esse mesmo comando, pela porta do menu Ver do inspetor, entrega a coluna escondida ao canvas no cenário `hiding-the-inspector-gives-its-column-to-the-canvas` (`manifest/features/01-foundation.json:28` `"id": "hiding-the-inspector-gives-its-column-to-the-canvas",`). Pela G3, todas as portas (itens do menu Ver, botões da barra de atividades e da barra de ferramentas do canvas, ícones da faixa da bancada e o item "Abrir {panel}" da barra de comandos) enviam só a intenção ao tratador único.

## REQ-6202 — workspace.toggleLeftDock (Mostrar ou ocultar a doca esquerda)
- **Onde:** `manifest/commands/workspace.json:694` `"id": "workspace.toggleLeftDock",`
- **Tratador:** `src/app/commands.ts:478` `'workspace.toggleLeftDock': toggleLeftDock,`
- **Feature:** `src/app/features.ts:166` `'dock-toggles': registerFeature('dock-toggles'),`
- **Comportamento esperado:** Mostra e oculta a doca esquerda; o rótulo é "Mostrar ou ocultar a doca esquerda" (`src/i18n/locales/pt-BR.json:504` `"command.toggleLeftDock": "Mostrar ou ocultar a doca esquerda",`). A feature `dock-toggles` fixa o comportamento: Ctrl+B esconde e mostra a doca esquerda e o canvas cresce para o espaço liberado, refazendo o ajuste no modo Ajustar (`manifest/features/13-workspace.json:23` `"Ctrl+B hides and shows the left dock; Ctrl+Alt+B hides and shows the inspector; the canvas grows into the freed space and refits in Fit mode. While editing text Ctrl+B keeps its bold meaning."`). O primeiro toque esconde a barra lateral (`status.sidebar.hidden` — "Barra lateral oculta." em `src/i18n/locales/pt-BR.json:1937` `"status.sidebar.hidden": "Barra lateral oculta.",`) no cenário `ctrl-b-hides-the-left-dock-and-the-canvas-grows` (`manifest/features/13-workspace.json:30` `"id": "ctrl-b-hides-the-left-dock-and-the-canvas-grows",`); o segundo toque a mostra de novo (`status.sidebar.shown`) no cenário `a-second-ctrl-b-shows-the-left-dock-again` (`manifest/features/13-workspace.json:106` `"id": "a-second-ctrl-b-shows-the-left-dock-again",`). A tecla funciona também com o foco num campo de texto, no cenário `ctrl-b-in-a-text-field-hides-the-left-dock-too` (`manifest/features/13-workspace.json:931` `"id": "ctrl-b-in-a-text-field-hides-the-left-dock-too",`). Pela G3, as três portas (Ctrl+B global, Ctrl+B no campo e o item do menu Ver) enviam só a intenção ao tratador único.

## REQ-6203 — workspace.toggleInspector (Mostrar ou ocultar o inspetor)
- **Onde:** `manifest/commands/workspace.json:774` `"id": "workspace.toggleInspector",`
- **Tratador:** `src/app/commands.ts:479` `'workspace.toggleInspector': toggleInspector,`
- **Feature:** `src/app/features.ts:166` `'dock-toggles': registerFeature('dock-toggles'),`
- **Comportamento esperado:** Mostra e oculta o inspetor; o rótulo é "Mostrar ou ocultar o inspetor" (`src/i18n/locales/pt-BR.json:503` `"command.toggleInspector": "Mostrar ou ocultar o inspetor",`). Ctrl+Alt+B esconde e mostra o inspetor e o canvas ocupa a coluna que ele deixa (`manifest/features/13-workspace.json:23` `"Ctrl+B hides and shows the left dock; Ctrl+Alt+B hides and shows the inspector; the canvas grows into the freed space and refits in Fit mode. While editing text Ctrl+B keeps its bold meaning."`). O primeiro toque anuncia `status.inspector.hidden` — "Inspetor oculto." (`src/i18n/locales/pt-BR.json:1808` `"status.inspector.hidden": "Inspetor oculto.",`) — no cenário `ctrl-alt-b-hides-the-inspector-and-the-canvas-takes-its-column` (`manifest/features/13-workspace.json:191` `"id": "ctrl-alt-b-hides-the-inspector-and-the-canvas-takes-its-column",`); o segundo anuncia `status.inspector.shown` no cenário `a-second-ctrl-alt-b-shows-the-inspector-again` (`manifest/features/13-workspace.json:260` `"id": "a-second-ctrl-alt-b-shows-the-inspector-again",`). A tecla funciona também com o foco num campo de texto, no cenário `ctrl-alt-b-in-a-text-field-hides-the-inspector-too` (`manifest/features/13-workspace.json:1017` `"id": "ctrl-alt-b-in-a-text-field-hides-the-inspector-too",`). Pela G3, as três portas (Ctrl+Alt+B global, Ctrl+Alt+B no campo e o item do menu Ver) enviam só a intenção ao tratador único.

## REQ-6204 — workspace.collapseDocks (Recolher todas as docas)
- **Onde:** `manifest/commands/workspace.json:854` `"id": "workspace.collapseDocks",`
- **Tratador:** `src/app/commands.ts:480` `'workspace.collapseDocks': collapseDocks,`
- **Feature:** `src/app/features.ts:166` `'dock-toggles': registerFeature('dock-toggles'),`
- **Comportamento esperado:** Recolhe todas as docas de uma vez; o rótulo é "Recolher todas as docas" (`src/i18n/locales/pt-BR.json:298` `"command.collapseDocks": "Recolher todas as docas",`). O primeiro Ctrl+\ recolhe todas as docas e o segundo põe de volta exatamente o que estava aberto, e a barra de status reporta cada mudança (`manifest/features/13-workspace.json:25` `"Panels close and reopen from the top bar toggles and the View menu; the status bar reports each change."`). O primeiro toque anuncia `status.docks.collapsed` — "Todos os painéis recolhidos." (`src/i18n/locales/pt-BR.json:1719` `"status.docks.collapsed": "Todos os painéis recolhidos.",`) — no cenário `ctrl-backslash-collapses-every-dock` (`manifest/features/13-workspace.json:345` `"id": "ctrl-backslash-collapses-every-dock",`); o segundo anuncia `status.docks.restored` — "Os painéis voltaram como estavam." (`src/i18n/locales/pt-BR.json:1720` `"status.docks.restored": "Os painéis voltaram como estavam.",`) — no cenário `a-second-ctrl-backslash-puts-back-exactly-what-was-open` (`manifest/features/13-workspace.json:414` `"id": "a-second-ctrl-backslash-puts-back-exactly-what-was-open",`). A tecla funciona também com o foco num campo de texto, no cenário `ctrl-backslash-in-a-text-field-collapses-every-dock-too` (`manifest/features/13-workspace.json:1096` `"id": "ctrl-backslash-in-a-text-field-collapses-every-dock-too",`). Pela G3, as três portas (Ctrl+\ global, Ctrl+\ no campo e o item do menu Ver) enviam só a intenção ao tratador único.

## REQ-6205 — workspace.toggleDeveloperTools (Ferramentas de desenvolvedor)
- **Onde:** `manifest/commands/workspace.json:934` `"id": "workspace.toggleDeveloperTools",`
- **Tratador:** `src/app/commands.ts:481` `'workspace.toggleDeveloperTools': toggleDeveloperTools,`
- **Feature:** `src/app/features.ts:170` `'workbench-panel': registerFeature('workbench-panel'),`
- **Comportamento esperado:** Liga e desliga as ferramentas de desenvolvedor; o rótulo é "Ferramentas de desenvolvedor" (`src/i18n/locales/pt-BR.json:318` `"command.developerTools": "Ferramentas de desenvolvedor",`). Ligadas, acrescentam uma aba Documento à bancada que mostra o JSON do documento ao vivo, somente leitura, atualizado depois de cada comando, e a escolha é guardada nas preferências (`manifest/features/13-workspace.json:11496` `"Developer tools adds a Document tab showing the live document JSON read-only, updated after every command; the choice is stored in preferences."`). Ligar acrescenta a aba e a mostra no cenário `developer-tools-adds-the-document-tab-and-shows-it` (`manifest/features/13-workspace.json:11868` `"id": "developer-tools-adds-the-document-tab-and-shows-it",`); desligar tira a aba no cenário `developer-tools-turned-off-takes-the-document-tab-out` (`manifest/features/13-workspace.json:11943` `"id": "developer-tools-turned-off-takes-the-document-tab-out",`). A porta é o item do menu Ver, que envia só a intenção ao tratador único (G3). Como o painel fica na própria coluna da bancada, não cobre o canvas no ponto da ação (G4).

## REQ-6206 — workspace.reset (Redefinir o espaço de trabalho)
- **Onde:** `manifest/commands/workspace.json:974` `"id": "workspace.reset",`
- **Tratador:** `src/app/commands.ts:482` `'workspace.reset': resetWorkspace,`
- **Feature:** `src/app/features.ts:174` `'workspace-persist-reset': registerFeature('workspace-persist-reset'),`
- **Comportamento esperado:** Devolve o arranjo padrão das docas, dos tamanhos e dos painéis; o rótulo é "Redefinir o espaço de trabalho" (`src/i18n/locales/pt-BR.json:435` `"command.resetWorkspace": "Redefinir o espaço de trabalho",`). Redefinir restaura as docas, os tamanhos e os painéis padrão, avisa na barra de status e não toca no JSON do documento (`manifest/features/13-workspace.json:13693` `"Reset workspace restores the default docks, sizes and panels and says so in the status bar; the document JSON is untouched."`). A barra de status anuncia a redefinição com `status.workspace.reset` — "Área de trabalho redefinida: os painéis, tamanhos e encaixes padrão." (`src/i18n/locales/pt-BR.json:1880` `"status.workspace.reset": "Área de trabalho redefinida: os painéis, tamanhos e encaixes padrão.",`) — no cenário `reset-workspace-puts-the-default-panels-and-sizes-back` (`manifest/features/13-workspace.json:13698` `"id": "reset-workspace-puts-the-default-panels-and-sizes-back",`). Pela G3, as duas portas (item do menu Ver e item da barra de comandos) enviam só a intenção ao tratador único.

## REQ-6207 — workspace.setWorkbenchState (Mostrar ou ocultar a bancada)
- **Onde:** `manifest/commands/workspace.json:1035` `"id": "workspace.setWorkbenchState",`
- **Tratador:** `src/app/commands.ts:483` `'workspace.setWorkbenchState': setWorkbenchState,`
- **Feature:** `src/app/features.ts:170` `'workbench-panel': registerFeature('workbench-panel'),`
- **Comportamento esperado:** Põe a bancada inferior no estado pedido pelo argumento `state` (`collapsed`, `open`, `max`, `toggle` ou `toggle-max`); o rótulo do botão de recolher e abrir é "Mostrar ou ocultar a bancada" (`src/i18n/locales/pt-BR.json:2170` `"workbench.toggle": "Mostrar ou ocultar a bancada",`) e o de maximizar é "Maximizar a bancada" (`src/i18n/locales/pt-BR.json:2169` `"workbench.maximize": "Maximizar a bancada",`). A bancada mostra uma faixa de abas, o conteúdo da aba escolhida a preenche e as abas podem ser fechadas (`manifest/features/13-workspace.json:11494` `"The workbench shows one tab strip; the chosen tab's content fills it; tabs can be closed."`); ela recolhe até a faixa de abas, expande e maximiza para cobrir a área do canvas, e depois volta (`manifest/features/13-workspace.json:11495` `"It collapses to its tab strip, expands, and maximises to cover the canvas area, then restores."`). O botão da faixa recolhe a bancada no cenário `the-strip-toggle-folds-the-workbench-to-its-strip` (`manifest/features/13-workspace.json:11574` `"id": "the-strip-toggle-folds-the-workbench-to-its-strip",`); maximizar cobre toda a área do canvas no cenário `maximize-covers-the-whole-canvas-area` (`manifest/features/13-workspace.json:11637` `"id": "maximize-covers-the-whole-canvas-area",`) e o segundo toque restaura no cenário `maximize-again-restores-the-open-workbench` (`manifest/features/13-workspace.json:11707` `"id": "maximize-again-restores-the-open-workbench",`). Pela G3, as duas portas (botão recolher/abrir e botão maximizar da faixa) enviam só a intenção — o mesmo texto de estado e a direção — ao tratador único.

## REQ-6208 — workspace.setActiveTab (Mostrar a aba)
- **Onde:** `manifest/commands/workspace.json:1113` `"id": "workspace.setActiveTab",`
- **Tratador:** `src/app/commands.ts:484` `'workspace.setActiveTab': setActiveTab,`
- **Feature:** `src/app/features.ts:61` `'inspector-panel': registerFeature('inspector-panel'),`
- **Comportamento esperado:** Mostra a aba pedida dentro do grupo indicado; o rótulo é "Mostrar a aba" (`src/i18n/locales/pt-BR.json:483` `"command.showTab": "Mostrar a aba",`). No inspetor, a aba escolhida aparece sob o cabeçalho e continua escolhida para a próxima seleção, no cenário `the-settings-tab-shows-under-the-header-and-stays-for-the-next-selection` (`manifest/features/04-inspector.json:35` `"id": "the-settings-tab-shows-under-the-header-and-stays-for-the-next-selection",`), e a aba Estilo traz de volta a barra de seletores e as seções, no cenário `the-style-tab-brings-back-the-selector-bar-and-the-sections` (`manifest/features/04-inspector.json:264` `"id": "the-style-tab-brings-back-the-selector-bar-and-the-sections",`). A mesma aba escolhida pelo conteúdo preenche a bancada no cenário `a-tab-of-the-strip-shows-its-panel` (`manifest/features/13-workspace.json:12027` `"id": "a-tab-of-the-strip-shows-its-panel",`). Pela G3, as portas (abas do cabeçalho do inspetor, abas da faixa da bancada e a aba da barra lateral) enviam só a intenção (o grupo e o painel) ao tratador único.

## REQ-6209 — workspace.resizeSplitter (Redimensionar)
- **Onde:** `manifest/commands/workspace.json:1284` `"id": "workspace.resizeSplitter",`
- **Tratador:** `src/app/commands.ts:485` `'workspace.resizeSplitter': resizeSplitter,`
- **Feature:** `src/app/features.ts:171` `'panel-resize': registerFeature('panel-resize'),`
- **Comportamento esperado:** Redimensiona os painéis vizinhos de um separador; o rótulo é "Redimensionar" (`src/i18n/locales/pt-BR.json:437` `"command.resizeSplitter": "Redimensionar",`). Cada separador redimensiona os vizinhos com o mouse e em 20 px por tecla de seta, dentro de tamanhos mínimo e máximo (`manifest/features/13-workspace.json:12291` `"Each splitter resizes its neighbours with the mouse and by 20 px per arrow key, within minimum and maximum sizes."`); os separadores têm papel separator com aria-valuenow (`manifest/features/13-workspace.json:12292` `"Splitters have role separator with aria-valuenow."`) e os tamanhos são restaurados depois de recarregar (`manifest/features/13-workspace.json:12293` `"Sizes are restored after reload."`). Os itens do menu Ver dão nomes às direções: "Alargar a barra lateral" (`src/i18n/locales/pt-BR.json:1636` `"workspace.sidebarWider": "Alargar a barra lateral",`) no cenário `view-menu-widens-the-sidebar` (`manifest/features/13-workspace.json:12663` `"id": "view-menu-widens-the-sidebar",`), e "Aumentar a altura das Camadas" (`src/i18n/locales/pt-BR.json:1640` `"workspace.layersTaller": "Aumentar a altura das Camadas",`) no cenário `view-menu-makes-the-layers-taller` (`manifest/features/13-workspace.json:12887` `"id": "view-menu-makes-the-layers-taller",`). Pela G3, todas as portas (arraste do separador, setas com o foco no separador e itens do menu Ver) enviam só a intenção — o separador e a direção — ao tratador único. Por G5, os painéis e barras continuam cabendo depois de redimensionar.

## REQ-6210 — workspace.movePanel (Mover o painel)
- **Onde:** `manifest/commands/workspace.json:1587` `"id": "workspace.movePanel",`
- **Tratador:** `src/app/commands.ts:486` `'workspace.movePanel': movePanel,`
- **Feature:** `src/app/features.ts:172` `'floating-panels': registerFeature('floating-panels'),`
- **Comportamento esperado:** Move um painel para o destino pedido pelo argumento `to` (`float`, `dock-left`, `dock-right`, `workbench`, `tabs` ou `stack`); o rótulo é "Mover o painel" (`src/i18n/locales/pt-BR.json:395` `"command.movePanel": "Mover o painel",`). Um painel arrastado para fora da doca vira uma janela flutuante no ponto onde foi solto, mantida dentro da janela (`manifest/features/13-workspace.json:13018` `"A panel dragged out of its dock becomes a floating window at the drop point, kept inside the viewport."`); perto da borda esquerda ou direita aparece a dica "Ancorar à esquerda"/"Ancorar à direita" e soltar ancora o painel ali (`manifest/features/13-workspace.json:13019` `"Near the left or right edge a 'Dock left' [workspace.hint.dockLeft]/'Dock right' [workspace.hint.dockRight] hint appears and release docks the panel there."`); o Esc cancela o arraste e devolve o painel ao lugar de onde saiu (`manifest/features/13-workspace.json:13020` `"Escape cancels the drag and returns the panel where it was."`), e o arranjo flutuante é restaurado depois de recarregar (`manifest/features/13-workspace.json:13021` `"The floating layout is restored after reload."`). Soltar no canvas faz o painel flutuar onde caiu no cenário `the-layers-panel-dropped-on-the-canvas-floats-where-it-lands` (`manifest/features/13-workspace.json:13026` `"id": "the-layers-panel-dropped-on-the-canvas-floats-where-it-lands",`), encostar na esquerda ancora no cenário `the-layers-panel-dropped-on-the-left-edge-goes-back-to-the-sidebar` (`manifest/features/13-workspace.json:13099` `"id": "the-layers-panel-dropped-on-the-left-edge-goes-back-to-the-sidebar",`) e na direita no cenário `the-layers-panel-dropped-on-the-right-edge-docks-there` (`manifest/features/13-workspace.json:13165` `"id": "the-layers-panel-dropped-on-the-right-edge-docks-there",`). Pela G3, todas as portas (arraste do cabeçalho do painel para cada zona, arraste do cabeçalho flutuante e o botão do cabeçalho "Trazer de volta à doca") enviam só a intenção ao tratador único.

## REQ-6211 — quickPanel.setOffset (Mover o painel rápido)
- **Onde:** `manifest/commands/workspace.json:1798` `"id": "quickPanel.setOffset",`
- **Tratador:** `src/app/commands.ts:487` `'quickPanel.setOffset': setOffset,`
- **Feature:** `src/app/features.ts:90` `'quick-panel': registerFeature('quick-panel'),`
- **Comportamento esperado:** Guarda o deslocamento (`offset`) que a pessoa deu ao painel rápido para o elemento indicado; o rótulo é "Mover o painel rápido" (`src/i18n/locales/pt-BR.json:428` `"command.quickPanel.move": "Mover o painel rápido",`). Um painel rápido arrastado mantém o deslocamento para aquele elemento (`manifest/features/04-inspector.json:37851` `"A dragged quick panel keeps its offset for that element."`), e o painel continua sempre colocado dentro da janela do canvas, indo abaixo do elemento quando não há espaço acima (`manifest/features/04-inspector.json:37852` `"The quick panel is always placed inside the canvas viewport; with no room above the element it goes below it."`). O arraste pela alça é testado no cenário `the-grip-drags-the-panel-and-it-stays-after-a-reload` (`manifest/features/04-inspector.json:40056` `"id": "the-grip-drags-the-panel-and-it-stays-after-a-reload",`). Pela G3, a porta (arraste pela alça do painel no canvas) envia só a intenção ao tratador único; pelo G4, o painel não cobre o canvas no ponto onde a ação acontece.

## REQ-6212 — preferences.setLanguage (Idioma)
- **Onde:** `manifest/commands/workspace.json:1852` `"id": "preferences.setLanguage",`
- **Tratador:** `src/app/commands.ts:489` `'preferences.setLanguage': setLanguage,`
- **Feature:** `src/app/features.ts:51` `'ui-language': registerFeature('ui-language'),`
- **Comportamento esperado:** Troca o idioma da interface entre português do Brasil e inglês conforme o argumento `locale`; o rótulo é "Idioma" (`src/i18n/locales/pt-BR.json:463` `"command.setLanguage": "Idioma",`), e as opções do menu são "Português (Brasil)" (`src/i18n/locales/pt-BR.json:1214` `"language.ptBR": "Português (Brasil)",`) e "English" (`src/i18n/locales/pt-BR.json:1213` `"language.en": "English",`). Um perfil novo mostra todo texto em inglês e, depois de trocar para português, todo texto passa a pt-BR (`manifest/features/03-app-and-persistence.json:2341` `"A fresh profile shows every UI text in English: menus, panels, tooltips, status bar messages and accessible names; after switching to Português (Brasil) every one of them is in pt-BR."`); a troca redesenha todo texto visível sem recarregar e a escolha fica guardada na store de preferências e volta depois de recarregar (`manifest/features/03-app-and-persistence.json:2342` `"Switching the language re-renders every visible text without a reload; the choice is stored in the preferences store and restored after reload."`). A escolha do português é testada no cenário `portuguese-re-renders-the-editor-and-is-kept` (`manifest/features/03-app-and-persistence.json:2349` `"id": "portuguese-re-renders-the-editor-and-is-kept",`) e a volta ao inglês no cenário `english-brings-the-editor-back-and-is-kept` (`manifest/features/03-app-and-persistence.json:2418` `"id": "english-brings-the-editor-back-and-is-kept",`). Pela G3, as portas (itens do menu Idioma) enviam só a intenção (o idioma) ao tratador único.

## REQ-6213 — preferences.setTheme (Tema)
- **Onde:** `manifest/commands/workspace.json:1927` `"id": "preferences.setTheme",`
- **Tratador:** `src/app/commands.ts:490` `'preferences.setTheme': setTheme,`
- **Feature:** `src/app/features.ts:164` `'theme-switch': registerFeature('theme-switch'),`
- **Comportamento esperado:** Troca o tema da interface conforme o argumento `theme` (`light`, `dark` ou `system`); o rótulo é "Tema" (`src/i18n/locales/pt-BR.json:481` `"command.setTheme": "Tema",`), com as opções "Claro" (`src/i18n/locales/pt-BR.json:2117` `"theme.light": "Claro",`), "Escuro" (`src/i18n/locales/pt-BR.json:2116` `"theme.dark": "Escuro",`) e "Sistema" (`src/i18n/locales/pt-BR.json:2118` `"theme.system": "Sistema",`). O tema troca os tokens de cor da interface do editor e a página dentro do iframe conserva as cores próprias (`manifest/features/12-preview-embed-theme.json:1147` `"The editor chrome switches its colour tokens; the page inside the iframe keeps its own colours."`); "Sistema" acompanha o esquema preferido do navegador ao vivo (`manifest/features/12-preview-embed-theme.json:1148` `"System follows prefers-color-scheme live."`) e a escolha fica guardada na store de preferências e volta depois de recarregar (`manifest/features/12-preview-embed-theme.json:1149` `"The choice is stored in the preferences store and restored after reload."`). O tema escuro é testado no cenário `dark-draws-the-editor-dark` (`manifest/features/12-preview-embed-theme.json:1154` `"id": "dark-draws-the-editor-dark",`) e o sistema no cenário `system-follows-the-browser-scheme` (`manifest/features/12-preview-embed-theme.json:1279` `"id": "system-follows-the-browser-scheme",`). Pela G3, as portas (itens do menu Tema) enviam só a intenção (o tema) ao tratador único.

## REQ-6214 — commandBar.open (Comandos)
- **Onde:** `manifest/commands/workspace.json:2027` `"id": "commandBar.open",`
- **Tratador:** `src/app/commands.ts:491` `'commandBar.open': openCommandBar,`
- **Feature:** `src/app/features.ts:167` `'command-bar': registerFeature('command-bar'),`
- **Comportamento esperado:** Abre a barra de comandos; o rótulo é "Comandos" (`src/i18n/locales/pt-BR.json:304` `"command.commandBar": "Comandos",`). A barra lista comandos, painéis ("Abrir {panel}") e tipos de elemento, cada um com o atalho quando existe, e a busca difusa os filtra (`manifest/features/13-workspace.json:1241` `"The command bar lists commands, panels ('Open Layers' [command.openPanel]) and element types ('Insert Hero' [command.insertElement]), each with its shortcut where it has one; fuzzy search filters them."`); as setas movem o destaque e o Enter roda o item e fecha a barra, e o Esc ou um clique fora a fecham (`manifest/features/13-workspace.json:1242` `"ArrowUp/ArrowDown move the highlight, Enter runs it and closes the bar; Escape and clicking outside close it."`). Enquanto se edita texto o Ctrl+K mantém seu sentido de link e não abre a barra (`manifest/features/13-workspace.json:1245` `"While editing text Ctrl+K keeps its link meaning and does not open the bar."`), no cenário `ctrl-shift-k-opens-the-command-bar-while-editing-text` (`manifest/features/13-workspace.json:9769` `"id": "ctrl-shift-k-opens-the-command-bar-while-editing-text",`). O Ctrl+K abre a barra no cenário `ctrl-k-opens-the-command-bar` (`manifest/features/13-workspace.json:9707` `"id": "ctrl-k-opens-the-command-bar",`) e o Esc a fecha devolvendo as teclas do canvas no cenário `escape-closes-the-bar-and-the-canvas-keys-work-again` (`manifest/features/13-workspace.json:10312` `"id": "escape-closes-the-bar-and-the-canvas-keys-work-again",`). Pela G3, as portas (Ctrl+K, Ctrl+Shift+K, campo da barra superior e item do menu Arquivo) enviam só a intenção ao tratador único.

## REQ-6215 — palette.toggleGroup (Recolher ou expandir o grupo)
- **Onde:** `manifest/commands/workspace.json:2149` `"id": "palette.toggleGroup",`
- **Tratador:** `src/app/commands.ts:492` `'palette.toggleGroup': toggleGroup,`
- **Feature:** `src/app/features.ts:134` `'palette-search-groups': registerFeature('palette-search-groups'),`
- **Comportamento esperado:** Recolhe ou expande um grupo de elementos do painel Elements; o rótulo é "Recolher ou expandir o grupo" (`src/i18n/locales/pt-BR.json:418` `"command.palette.toggleGroup": "Recolher ou expandir o grupo",`). Os grupos são Estrutura e layout, Texto, Listas, Tabelas, Formulários, Imagens e mídia, Interativo e Modelos, cada um com sua contagem, e as partes internas dos elementos compostos não são listadas (`manifest/features/09-panels.json:21` `"Groups are Structure and layout, Text, Lists, Tables, Forms, Images and media, Interactive and Templates, each with its count; internal parts of composite elements (list items, table parts, options and option groups, sources, tracks, captions, legend, summary, SVG shapes) are not listed."`); um grupo recolhido continua recolhido depois de recarregar (`manifest/features/09-panels.json:24` `"Collapsed groups stay collapsed after reload."`). Recolher é testado no cenário `a-collapsed-group-hides-its-tiles-and-stays-collapsed-after-a-reload` (`manifest/features/09-panels.json:29` `"id": "a-collapsed-group-hides-its-tiles-and-stays-collapsed-after-a-reload",`) e abrir de novo no cenário `a-collapsed-group-opens-again-and-stays-open-after-a-reload` (`manifest/features/09-panels.json:97` `"id": "a-collapsed-group-opens-again-and-stays-open-after-a-reload",`). A porta é o cabeçalho do grupo no painel Elements, que envia só a intenção ao tratador único (G3).

## REQ-6216 — palette.setDensity (Densidade da visualização)
- **Onde:** `manifest/commands/workspace.json:2199` `"id": "palette.setDensity",`
- **Tratador:** `src/app/commands.ts:493` `'palette.setDensity': setDensity,`
- **Feature:** `src/app/features.ts:135` `'palette-density': registerFeature('palette-density'),`
- **Comportamento esperado:** Muda a densidade da lista de elementos do painel Elements conforme o argumento `density` (`list`, `two-columns`, `three-columns` ou `icons`); o rótulo é "Densidade da visualização" (`src/i18n/locales/pt-BR.json:417` `"command.palette.density": "Densidade da visualização",`), com as opções "Lista" (`src/i18n/locales/pt-BR.json:1267` `"palette.density.list": "Lista",`), "Duas colunas" (`src/i18n/locales/pt-BR.json:1269` `"palette.density.twoColumns": "Duas colunas",`), "Três colunas" (`src/i18n/locales/pt-BR.json:1268` `"palette.density.threeColumns": "Três colunas",`) e "Grade de ícones" (`src/i18n/locales/pt-BR.json:1266` `"palette.density.icons": "Grade de ícones",`). Cada densidade dispõe os itens como descrito (um por linha com a etiqueta, dois ou três por linha, ou só ícones com a etiqueta no tooltip), e os tamanhos medidos dos itens mudam de acordo (`manifest/features/09-panels.json:191` `"Each density lays items out as described (one per row with tag, two or three per row, icons only with the label as tooltip); measured item sizes change accordingly."`); a densidade escolhida fica guardada na store de preferências e volta depois de recarregar (`manifest/features/09-panels.json:192` `"The chosen density is stored in the single preferences store and restored after reload."`). A densidade em lista é testada no cenário `the-list-density-lays-the-tiles-out-and-is-kept-after-a-reload` (`manifest/features/09-panels.json:197` `"id": "the-list-density-lays-the-tiles-out-and-is-kept-after-a-reload",`). Pela G3, as portas (os quatro segmentos de densidade) enviam só a intenção (a densidade) ao tratador único.

## REQ-6217 — layers.setExpanded (Recolher ou expandir o ramo)
- **Onde:** `manifest/commands/workspace.json:2340` `"id": "layers.setExpanded",`
- **Tratador:** `src/app/commands.ts:494` `'layers.setExpanded': setExpanded,`
- **Feature:** `src/app/features.ts:19` `'layers-tree': registerFeature('layers-tree'),`
- **Comportamento esperado:** Expande, recolhe ou alterna o ramo de um nó na árvore de Camadas conforme o argumento `expanded` (`expand`, `collapse` ou `toggle`); o rótulo é "Recolher ou expandir o ramo" (`src/i18n/locales/pt-BR.json:388` `"command.layers.toggleBranch": "Recolher ou expandir o ramo",`). Camadas mostra uma linha por nó na ordem do documento, indentada pela profundidade, com um cursor nas linhas que têm filhos e um ícone por tipo de elemento (`manifest/features/02-structure-editing.json:1563` `"Layers shows one row per node in document order, indented by depth, with a caret on rows that have children and an icon per element type."`), e o cursor recolhe e expande o ramo sem mudar a seleção (`manifest/features/02-structure-editing.json:1566` `"The caret collapses and expands the branch without changing the selection."`), no cenário `caret-folds-a-branch-and-keeps-the-selection` (`manifest/features/02-structure-editing.json:1628` `"id": "caret-folds-a-branch-and-keeps-the-selection",`). Selecionar dentro de um ramo recolhido o desdobra, no cenário `selecting-inside-a-folded-branch-unfolds-it` (`manifest/features/02-structure-editing.json:1686` `"id": "selecting-inside-a-folded-branch-unfolds-it",`). Pela G3, as portas (clique no cursor da linha e repouso do arraste de camadas sobre uma linha recolhida) enviam só a intenção ao tratador único; pela G6, a seleção continua lida da store única.

## REQ-6218 — layers.collapseAll (Recolher todos os ramos)
- **Onde:** `manifest/commands/workspace.json:2423` `"id": "layers.collapseAll",`
- **Tratador:** `src/app/commands.ts:495` `'layers.collapseAll': collapseAll,`
- **Feature:** `src/app/features.ts:136` `'layers-expand-collapse-all': registerFeature('layers-expand-collapse-all'),`
- **Comportamento esperado:** Recolhe todos os ramos da árvore de Camadas; o rótulo é "Recolher todos os ramos" (`src/i18n/locales/pt-BR.json:1215` `"layers.collapseAll": "Recolher todos os ramos",`). Recolher tudo deixa visíveis só as linhas do primeiro nível (`manifest/features/09-panels.json:434` `"Collapse all leaves only top-level rows visible; expand all shows every row."`), no cenário `collapse-every-branch-keeps-the-page-and-its-first-level` (`manifest/features/09-panels.json:440` `"id": "collapse-every-branch-keeps-the-page-and-its-first-level",`), e a barra de status anuncia `status.layers.collapsedAll` — "Todos os ramos recolhidos." (`src/i18n/locales/pt-BR.json:1825` `"status.layers.collapsedAll": "Todos os ramos recolhidos.",`). Selecionar um descendente escondido expande os ancestrais e rola a linha para a vista, no cenário `selecting-a-deep-element-after-collapsing-reveals-its-row` (`manifest/features/09-panels.json:578` `"id": "selecting-a-deep-element-after-collapsing-reveals-its-row",`). A porta é o botão do cabeçalho das Camadas, que envia só a intenção ao tratador único (G3).

## REQ-6219 — layers.expandAll (Expandir todos os ramos)
- **Onde:** `manifest/commands/workspace.json:2463` `"id": "layers.expandAll",`
- **Tratador:** `src/app/commands.ts:496` `'layers.expandAll': expandAll,`
- **Feature:** `src/app/features.ts:136` `'layers-expand-collapse-all': registerFeature('layers-expand-collapse-all'),`
- **Comportamento esperado:** Expande todos os ramos da árvore de Camadas; o rótulo é "Expandir todos os ramos" (`src/i18n/locales/pt-BR.json:1218` `"layers.expandAll": "Expandir todos os ramos",`). Expandir tudo volta a mostrar todas as linhas (`manifest/features/09-panels.json:434` `"Collapse all leaves only top-level rows visible; expand all shows every row."`), no cenário `expand-every-branch-shows-every-row-again` (`manifest/features/09-panels.json:508` `"id": "expand-every-branch-shows-every-row-again",`), e a barra de status anuncia `status.layers.expandedAll` — "Todos os ramos expandidos." (`src/i18n/locales/pt-BR.json:1826` `"status.layers.expandedAll": "Todos os ramos expandidos.",`). A porta é o botão do cabeçalho das Camadas, que envia só a intenção ao tratador único (G3).

## REQ-6220 — layers.expandOrFocusChild (Expandir ou ir para o primeiro filho)
- **Onde:** `manifest/commands/workspace.json:2503` `"id": "layers.expandOrFocusChild",`
- **Tratador:** `src/app/commands.ts:497` `'layers.expandOrFocusChild': expandOrFocusChild,`
- **Feature:** `src/app/features.ts:178` `'layers-keyboard-navigation': registerFeature('layers-keyboard-navigation'),`
- **Comportamento esperado:** Com a seta direita, expande a linha focada ou move o foco para o primeiro filho; o rótulo é "Expandir ou ir para o primeiro filho" (`src/i18n/locales/pt-BR.json:387` `"command.layers.expandOrChild": "Expandir ou ir para o primeiro filho",`). A árvore tem papel tree com treeitems, aria-level e aria-expanded, e uma linha por vez recebe foco (`manifest/features/14-accessibility-and-keyboard.json:1368` `"The tree has role tree with treeitems, aria-level and aria-expanded; one row is focusable at a time."`); as setas movem o foco e expandem ou recolhem como no padrão de árvore WAI-ARIA (`manifest/features/14-accessibility-and-keyboard.json:1369` `"Arrows move focus and expand/collapse as in the WAI-ARIA tree pattern; Home/End jump to first/last visible row."`). Pressionar seta direita com uma linha recolhida focada a desdobra, no cenário `arrow-right-unfolds-the-focused-row` (`manifest/features/14-accessibility-and-keyboard.json:1440` `"id": "arrow-right-unfolds-the-focused-row",`), anunciando `status.layers.unfolded` — "{name}: ramo expandido." (`src/i18n/locales/pt-BR.json:1832` `"status.layers.unfolded": "{name}: ramo expandido.",`). A porta é a seta direita com o contexto da árvore de Camadas, que envia só a intenção ao tratador único (G3). O nó-alvo vem da seleção focada que a porta declara (`"selection": "focused-row"`), sem cópia local (G6).

## REQ-6221 — layers.collapseOrFocusParent (Recolher ou ir para o pai)
- **Onde:** `manifest/commands/workspace.json:2547` `"id": "layers.collapseOrFocusParent",`
- **Tratador:** `src/app/commands.ts:498` `'layers.collapseOrFocusParent': collapseOrFocusParent,`
- **Feature:** `src/app/features.ts:178` `'layers-keyboard-navigation': registerFeature('layers-keyboard-navigation'),`
- **Comportamento esperado:** Com a seta esquerda, recolhe a linha focada ou move o foco para o pai; o rótulo é "Recolher ou ir para o pai" (`src/i18n/locales/pt-BR.json:386` `"command.layers.collapseOrParent": "Recolher ou ir para o pai",`). As setas movem o foco e expandem ou recolhem como no padrão de árvore WAI-ARIA (`manifest/features/14-accessibility-and-keyboard.json:1369` `"Arrows move focus and expand/collapse as in the WAI-ARIA tree pattern; Home/End jump to first/last visible row."`). A seta esquerda recolhe a linha focada no cenário `arrow-left-folds-the-focused-row` (`manifest/features/14-accessibility-and-keyboard.json:1375` `"id": "arrow-left-folds-the-focused-row",`), anunciando `status.layers.folded` — "{name}: ramo recolhido." (`src/i18n/locales/pt-BR.json:1827` `"status.layers.folded": "{name}: ramo recolhido.",`). A porta é a seta esquerda com o contexto da árvore de Camadas, que envia só a intenção ao tratador único (G3). O nó-alvo vem da seleção focada (G6).

## REQ-6222 — layers.setRowDetails (O que cada linha mostra)
- **Onde:** `manifest/commands/workspace.json:2591` `"id": "layers.setRowDetails",`
- **Tratador:** `src/app/commands.ts:499` `'layers.setRowDetails': setRowDetails,`
- **Feature:** `src/app/features.ts:138` `'layers-row-columns': registerFeature('layers-row-columns'),`
- **Comportamento esperado:** Escolhe quais detalhes cada linha das Camadas mostra, conforme o argumento `detail` (`tag`, `id`, `classes` ou `attributes`) e o `shown` opcional; o rótulo é "O que cada linha mostra" (`src/i18n/locales/pt-BR.json:1229` `"layers.rowDetails": "O que cada linha mostra",`). As linhas mostram os detalhes escolhidos (nome, tag HTML, id, classes, atributos) ao lado do nome (`manifest/features/09-panels.json:979` `"Rows show the chosen details (name, HTML tag, id, classes, attributes) next to the name."`), e a escolha fica guardada na store de preferências e volta depois de recarregar (`manifest/features/09-panels.json:980` `"The choice is stored in the preferences store and restored after reload."`). Classes sem a tag são testadas no cenário `classes-without-the-tag-are-shown-and-kept-after-a-reload` (`manifest/features/09-panels.json:985` `"id": "classes-without-the-tag-are-shown-and-kept-after-a-reload",`). Pela G3, as portas (itens do menu "O que cada linha mostra") enviam só a intenção (o detalhe e se está mostrado) ao tratador único; por G5, as linhas com nomes longos continuam cabendo.

## REQ-6223 — layers.search (Pesquisar camadas)
- **Onde:** `manifest/commands/workspace.json:2721` `"id": "layers.search",`
- **Tratador:** `src/app/commands.ts:500` `'layers.search': search,`
- **Feature:** `src/app/features.ts:137` `'layers-search': registerFeature('layers-search'),`
- **Comportamento esperado:** Filtra as linhas das Camadas pela consulta digitada; o rótulo é "Pesquisar camadas" (`src/i18n/locales/pt-BR.json:1230` `"layers.search": "Pesquisar camadas",`). Só as linhas cujo nome, tag, id ou classe correspondem aparecem, com os ancestrais para contexto e a correspondência realçada (`manifest/features/09-panels.json:667` `"Only rows whose name, tag, id or class matches are shown, with their ancestors for context and the match highlighted."`); clicar num resultado seleciona o elemento (`manifest/features/09-panels.json:668` `"Clicking a result selects the element."`) e limpar restaura o estado de expansão anterior (`manifest/features/09-panels.json:669` `"Clearing restores the previous expansion state."`). Digitar "card" mostra as linhas correspondentes e seus ancestrais no cenário `typing-card-shows-the-matching-rows-and-their-ancestors` (`manifest/features/09-panels.json:674` `"id": "typing-card-shows-the-matching-rows-and-their-ancestors",`), anunciando `status.layers.searchMatches` — "{count} camadas correspondem a \"{query}\"." (`src/i18n/locales/pt-BR.json:1829` `"status.layers.searchMatches": "{count} camadas correspondem a \"{query}\".",`); limpar a pesquisa devolve as dobras que havia no cenário `clearing-the-search-brings-back-the-folds-it-had` (`manifest/features/09-panels.json:747` `"id": "clearing-the-search-brings-back-the-folds-it-had",`), com `status.layers.searchCleared`; uma busca sem resultado avisa com `status.layers.searchNoMatch` — "Nenhuma camada corresponde a \"{query}\"." (`src/i18n/locales/pt-BR.json:1831` `"status.layers.searchNoMatch": "Nenhuma camada corresponde a \"{query}\".",`) — no cenário `a-search-nothing-matches-says-so` (`manifest/features/09-panels.json:906` `"id": "a-search-nothing-matches-says-so",`). A porta é o campo "Pesquisar camadas", que envia só a intenção (o texto) ao tratador único (G3).

## REQ-6224 — inspector.toggleSection (Recolher ou expandir a seção)
- **Onde:** `manifest/commands/workspace.json:2771` `"id": "inspector.toggleSection",`
- **Tratador:** `src/app/commands.ts:501` `'inspector.toggleSection': toggleSection,`
- **Feature:** `src/app/features.ts:61` `'inspector-panel': registerFeature('inspector-panel'),`
- **Comportamento esperado:** Recolhe ou expande uma seção do inspetor; o rótulo é "Recolher ou expandir a seção" (`src/i18n/locales/pt-BR.json:381` `"command.inspector.toggleSection": "Recolher ou expandir a seção",`). As seções recolhem e expandem e o estado recolhido é lembrado por seção entre seleções e recarregares (`manifest/features/04-inspector.json:28` `"Sections collapse and expand; the collapsed state is remembered per section across selections and reloads."`). Seções recolhidas continuam recolhidas para outro elemento, no cenário `collapsed-sections-stay-collapsed-for-another-element` (`manifest/features/04-inspector.json:365` `"id": "collapsed-sections-stay-collapsed-for-another-element",`), e uma seção recolhida abre de novo no cenário `a-collapsed-section-opens-again` (`manifest/features/04-inspector.json:504` `"id": "a-collapsed-section-opens-again",`). A porta é o cabeçalho da seção, que envia só a intenção (a seção) ao tratador único (G3).

## REQ-6225 — inspector.toggleRow (Mostrar ou ocultar os detalhes)
- **Onde:** `manifest/commands/workspace.json:2822` `"id": "inspector.toggleRow",`
- **Tratador:** `src/app/commands.ts:502` `'inspector.toggleRow': toggleRow,`
- **Feature:** `src/app/features.ts:61` `'inspector-panel': registerFeature('inspector-panel'),`
- **Comportamento esperado:** Mostra ou oculta os detalhes de uma linha de conceito do inspetor; o rótulo é "Mostrar ou ocultar os detalhes" (`src/i18n/locales/pt-BR.json:382` `"command.inspector.toggleRow": "Mostrar ou ocultar os detalhes",`). Com um elemento selecionado o inspetor mostra o ícone, o nome e a tag do elemento e, numa ordem fixa, as seções que se aplicam ao tipo dele entre Content, Layout, Space, Size, Position, Paint, Border, Text e Effects (`manifest/features/04-inspector.json:27` `"With an element selected it shows the element icon, name and tag, and, in this order, the sections that apply to the element type among Content, Layout, Space, Size, Position, Paint, Border, Text and Effects; later entries may add sections after Effects. Each section header summarises its current values (e.g. Layout: block, Size: auto x auto)."`). Uma linha de conceito abre os detalhes e continua aberta no cenário `a-concept-row-opens-its-details-and-stays-open` (`manifest/features/04-inspector.json:1413` `"id": "a-concept-row-opens-its-details-and-stays-open",`). A porta é o disclosable da linha, que envia só a intenção (a linha) ao tratador único (G3).

## REQ-6226 — inspector.setMode (Modo do inspetor)
- **Onde:** `manifest/commands/workspace.json:2873` `"id": "inspector.setMode",`
- **Tratador:** `src/app/commands.ts:503` `'inspector.setMode': setMode,`
- **Feature:** `src/app/features.ts:87` `'inspector-advanced-mode': registerFeature('inspector-advanced-mode'),`
- **Comportamento esperado:** Alterna o inspetor entre todas as propriedades e somente o essencial, conforme o argumento `mode` (`all` ou `essentials`); o rótulo é "Modo do inspetor" (`src/i18n/locales/pt-BR.json:379` `"command.inspector.mode": "Modo do inspetor",`), com as opções "Somente o essencial" (`src/i18n/locales/pt-BR.json:1034` `"inspector.mode.essentials": "Somente o essencial",`) e "Todas as propriedades" (`src/i18n/locales/pt-BR.json:1033` `"inspector.mode.all": "Todas as propriedades",`). Por padrão o inspetor mostra toda propriedade do catálogo que se aplica ao elemento, agrupada por seção, e isso continua sendo o padrão (`manifest/features/04-inspector.json:36331` `"By default the inspector shows every property of the catalogue that applies to the element, grouped by section; this stays the default."`); "Somente o essencial" mostra o subconjunto comum (display, fundamentos de flex ou grid, margin, padding, width, height, position, cor, fundo, borda, raio, família de fonte, tamanho, peso, altura de linha, alinhamento, opacidade e sombra) (`manifest/features/04-inspector.json:36332` `"Essentials only shows the common subset (display, flex/grid basics, margin, padding, width, height, position, colour, background, border, radius, font family, size, weight, line height, alignment, opacity, shadow)."`); uma propriedade com valor definido aparece também no essencial (`manifest/features/04-inspector.json:36333` `"A property with a value set is always shown in essentials too."`); o modo escolhido é lembrado entre recarregares e um perfil novo começa com todas as propriedades (`manifest/features/04-inspector.json:36334` `"The chosen mode is remembered across reloads; a fresh profile starts with all properties."`). "Somente o essencial" deixa de fora o que "adicionar uma propriedade" oferece no cenário `essentials-only-leaves-out-what-add-a-property-offers` (`manifest/features/04-inspector.json:36339` `"id": "essentials-only-leaves-out-what-add-a-property-offers",`), e "Todas as propriedades" mostra cada campo de novo no cenário `all-properties-shows-every-field-again` (`manifest/features/04-inspector.json:36439` `"id": "all-properties-shows-every-field-again",`). Pela G3, as portas (os dois segmentos de modo) enviam só a intenção (o modo) ao tratador único.

## REQ-6227 — inspector.reveal (Editar a propriedade {property})
- **Onde:** `manifest/commands/workspace.json:2956` `"id": "inspector.reveal",`
- **Tratador:** `src/app/commands.ts:504` `'inspector.reveal': revealField,`
- **Feature:** `src/app/features.ts:88` `'inspector-add-property': registerFeature('inspector-add-property'),`
- **Comportamento esperado:** Revela uma propriedade ainda não mostrada (ou um atributo) no inspetor e a foca; o rótulo é "Editar a propriedade {property}" (`src/i18n/locales/pt-BR.json:328` `"command.editProperty": "Editar a propriedade {property}",`) e o nome genérico é "Editar uma propriedade" (`src/i18n/locales/pt-BR.json:329` `"command.editProperty.name": "Editar uma propriedade",`). O menu + lista as propriedades aplicáveis que não estão mostradas, agrupadas por seção, com rótulo e nome CSS, filtráveis pela digitação (`manifest/features/04-inspector.json:36555` `"The + menu lists the applicable properties not currently shown, grouped by section, with label and CSS name, filterable by typing."`); escolher uma revela o campo dela na seção e o foca (`manifest/features/04-inspector.json:36556` `"Choosing one reveals that field in its section and focuses it."`). Uma propriedade acrescentada mostra o campo dela no cenário `a-property-added-shows-its-field` (`manifest/features/04-inspector.json:36561` `"id": "a-property-added-shows-its-field",`), e a revelada pela lista ou pela barra de comandos recebe o valor no cenário `a-property-revealed-from-the-list-or-the-command-bar-takes-its-value` (`manifest/features/04-inspector.json:36656` `"id": "a-property-revealed-from-the-list-or-the-command-bar-takes-its-value",`). Pela G3, as portas (o item + do inspetor, o item da barra de comandos e o clique duplo num controle de formulário no canvas, que envia o atributo) enviam só a intenção ao tratador único.

## REQ-6228 — inspector.search (Encontrar uma propriedade…)
- **Onde:** `manifest/commands/workspace.json:3057` `"id": "inspector.search",`
- **Tratador:** `src/app/commands.ts:506` `'inspector.search': searchInspector,`
- **Feature:** `src/app/features.ts:86` `'inspector-property-search': registerFeature('inspector-property-search'),`
- **Comportamento esperado:** Filtra as propriedades do inspetor pela consulta digitada; o rótulo é "Encontrar uma propriedade…" (`src/i18n/locales/pt-BR.json:1050` `"inspector.searchProperty": "Encontrar uma propriedade…",`). Só as propriedades cujo rótulo ou nome CSS correspondem aparecem, dentro das suas seções, com o texto correspondente realçado (`manifest/features/04-inspector.json:36124` `"Only properties whose label or CSS name matches are shown, inside their sections, with the matched text highlighted."`); uma busca sem resultado avisa (`manifest/features/04-inspector.json:36125` `"A search with no match says so."`) e limpar restaura as seções anteriores e o estado recolhido delas (`manifest/features/04-inspector.json:36126` `"Clearing the search restores the previous sections and their collapsed state."`). Digitar um rótulo filtra a aba Estilo no cenário `typing-a-label-filters-the-style-tab` (`manifest/features/04-inspector.json:36131` `"id": "typing-a-label-filters-the-style-tab",`), anunciando `status.inspector.searchFor` — "Mostrando as propriedades que correspondem a \"{query}\"." (`src/i18n/locales/pt-BR.json:1810` `"status.inspector.searchFor": "Mostrando as propriedades que correspondem a \"{query}\".",`); esvaziar o campo limpa a busca no cenário `emptying-the-field-clears-the-search` (`manifest/features/04-inspector.json:36247` `"id": "emptying-the-field-clears-the-search",`), com `status.inspector.searchCleared` — "Busca limpa; todas as propriedades estão visíveis." (`src/i18n/locales/pt-BR.json:1809` `"status.inspector.searchCleared": "Busca limpa; todas as propriedades estão visíveis.",`). A porta é o campo de busca do inspetor, que envia só a intenção (o texto) ao tratador único (G3).

## REQ-6229 — codePanel.setPane (Mostrar esta parte do código)
- **Onde:** `manifest/commands/workspace.json:3107` `"id": "codePanel.setPane",`
- **Tratador:** `src/app/commands.ts:507` `'codePanel.setPane': setPane,`
- **Feature:** `src/app/features.ts:192` `'code-panel-view': registerFeature('code-panel-view'),`
- **Comportamento esperado:** Mostra no painel Código a parte pedida no argumento `pane` (`html`, `css` ou `js`); o rótulo é "Mostrar esta parte do código" (`src/i18n/locales/pt-BR.json:232` `"codePanel.setPane": "Mostrar esta parte do código",`), com as abas "HTML" (`src/i18n/locales/pt-BR.json:228` `"codePanel.pane.html": "HTML",`), "CSS" (`src/i18n/locales/pt-BR.json:227` `"codePanel.pane.css": "CSS",`) e "JS" (`src/i18n/locales/pt-BR.json:229` `"codePanel.pane.js": "JS",`). O painel abre como aba da bancada inferior (`manifest/features/17-code-panel.json:22` `"View > Code opens the Code panel as a tab in the bottom workbench."`) e mostra index.html e styles.css com números de linha e coloração de sintaxe, iguais aos arquivos que a exportação grava (`manifest/features/17-code-panel.json:23` `"The panel shows index.html and styles.css with line numbers and syntax colouring, identical to the files the export writes."`), atualizando depois de cada comando (`manifest/features/17-code-panel.json:24` `"It updates after every command."`). Trocar entre as abas é testado no cenário `the-panes-css-and-js-tabs-and-back-to-the-markup` (`manifest/features/17-code-panel.json:291` `"id": "the-panes-css-and-js-tabs-and-back-to-the-markup",`). Pela G3, as portas (as abas do painel Código) enviam só a intenção (a parte) ao tratador único.

## REQ-6230 — codePanel.copyPane (Copiar este painel)
- **Onde:** `manifest/commands/workspace.json:3219` `"id": "codePanel.copyPane",`
- **Tratador:** `src/app/commands.ts:508` `'codePanel.copyPane': copyPane,`
- **Feature:** `src/app/features.ts:194` `'code-panel-copy-download': registerFeature('code-panel-copy-download'),`
- **Comportamento esperado:** Copia o texto da aba aberta do painel Código para a área de transferência; o rótulo é "Copiar este painel" (`src/i18n/locales/pt-BR.json:221` `"codePanel.copyPane": "Copiar este painel",`). A área de transferência recebe exatamente o texto da aba aberta (`manifest/features/17-code-panel.json:581` `"The clipboard receives exactly the text of the open tab."`), no cenário `copy-hands-the-panes-text-and-names-the-file` (`manifest/features/17-code-panel.json:587` `"id": "copy-hands-the-panes-text-and-names-the-file",`), e a barra de status anuncia `status.codePanel.copied` — "Copiado {path}." (`src/i18n/locales/pt-BR.json:1682` `"status.codePanel.copied": "Copiado {path}.",`). A porta é o botão "Copiar este painel", que envia só a intenção ao tratador único (G3).

## REQ-6231 — codePanel.downloadPane (Baixar este painel)
- **Onde:** `manifest/commands/workspace.json:3263` `"id": "codePanel.downloadPane",`
- **Tratador:** `src/app/commands.ts:509` `'codePanel.downloadPane': downloadPane,`
- **Feature:** `src/app/features.ts:194` `'code-panel-copy-download': registerFeature('code-panel-copy-download'),`
- **Comportamento esperado:** Baixa o arquivo aberto do painel Código; o rótulo é "Baixar este painel" (`src/i18n/locales/pt-BR.json:222` `"codePanel.downloadPane": "Baixar este painel",`). O download é o arquivo aberto (index.html ou styles.css) com exatamente o conteúdo mostrado (`manifest/features/17-code-panel.json:582` `"The download is the open file (index.html or styles.css) with exactly the shown content."`), no cenário `download-hands-the-open-file-itself` (`manifest/features/17-code-panel.json:659` `"id": "download-hands-the-open-file-itself",`), e a barra de status anuncia `status.codePanel.downloaded` — "Baixado {path}." (`src/i18n/locales/pt-BR.json:1684` `"status.codePanel.downloaded": "Baixado {path}.",`). A porta é o botão "Baixar este painel", que envia só a intenção ao tratador único (G3).

## REQ-6232 — colorPicker.open (Abrir o seletor de cor)
- **Onde:** `manifest/commands/workspace.json:3307` `"id": "colorPicker.open",`
- **Tratador:** `src/app/commands.ts:401` `'colorPicker.open': openColorPicker,`
- **Feature:** `src/app/features.ts:70` `'color-picker': registerFeature('color-picker'),`
- **Recusa declarada:** `manifest/commands/workspace.json:3320` `"refusalKey": "status.locked.edit"`
- **Comportamento esperado:** Abre o seletor de cor para a propriedade indicada; o rótulo é "Abrir o seletor de cor" (`src/i18n/locales/pt-BR.json:301` `"command.colorPicker.open": "Abrir o seletor de cor",`). A entrada acrescenta o campo de cor de fundo (Paint) e o campo de cor (Text), e ambos abrem o seletor (`manifest/features/04-inspector.json:13284` `"This entry adds the background-color field (Paint) and the color field (Text); both open the picker."`); o seletor mostra a cor anterior e a atual, a área de saturação/brilho, os controles de matiz e alfa, um campo de texto e campos por canal do formato escolhido (`manifest/features/04-inspector.json:13285` `"The picker shows the previous and current colour, the saturation/brightness area, hue and alpha sliders, a text field and per-channel fields for the chosen format."`). Os dois campos abrem o mesmo componente de seletor, e há exatamente um seletor de cor no código (`manifest/features/04-inspector.json:13288` `"Both fields open the same picker component; the codebase has exactly one colour picker, which every later colour field reuses (evaluator checks the diff)."`). O predicado de disponibilidade é `editableSelection` e a recusa declarada é `status.locked.edit` — "Desbloqueie {name} antes de alterá-lo." (`src/i18n/locales/pt-BR.json:1845` `"status.locked.edit": "Desbloqueie {name} antes de alterá-lo.",`). Abrir o seletor pelo campo de cor de fundo é testado no cenário `the-background-swatch-opens-the-picker-and-apply-keeps-the-colour` (`manifest/features/04-inspector.json:13294` `"id": "the-background-swatch-opens-the-picker-and-apply-keeps-the-colour",`). A porta é o campo de cor, que envia só a intenção (a propriedade) ao tratador único (G3).

## REQ-6233 — colorPicker.setFormat (Formato da cor)
- **Onde:** `manifest/commands/workspace.json:3360` `"id": "colorPicker.setFormat",`
- **Tratador:** `src/app/commands.ts:402` `'colorPicker.setFormat': setColorFormat,`
- **Feature:** `src/app/features.ts:70` `'color-picker': registerFeature('color-picker'),`
- **Comportamento esperado:** Troca o formato com que o seletor de cor mostra e aceita valores, conforme o argumento `format` (`hsb`, `rgb`, `hex`, `oklch` ou `oklab`); o rótulo é "Formato da cor" (`src/i18n/locales/pt-BR.json:303` `"command.colorPicker.setFormat": "Formato da cor",`), com a opção "HSB" entre outras (`src/i18n/locales/pt-BR.json:241` `"colorPicker.format.hsb": "HSB",`). O seletor mostra um campo de texto e campos por canal do formato escolhido (`manifest/features/04-inspector.json:13285` `"The picker shows the previous and current colour, the saturation/brightness area, hue and alpha sliders, a text field and per-channel fields for the chosen format."`), e a pessoa alterna o formato entre HSB, RGB e Hex digitando valores em cada um (passo do intent em `manifest/features/04-inspector.json:13279` `"Switch the format between HSB, RGB and Hex and type values in each."`). Digitar um canal no formato RGB grava a cor no cenário `a-channel-typed-in-rgb-writes-the-colour` (`manifest/features/04-inspector.json:14397` `"id": "a-channel-typed-in-rgb-writes-the-colour",`). Pela G3, as portas (os segmentos de formato no seletor) enviam só a intenção (o formato) ao tratador único.

## REQ-6234 — colorPicker.setChannel (Canal da cor)
- **Onde:** `manifest/commands/workspace.json:3530` `"id": "colorPicker.setChannel",`
- **Tratador:** `src/app/commands.ts:403` `'colorPicker.setChannel': setColorChannel,`
- **Feature:** `src/app/features.ts:70` `'color-picker': registerFeature('color-picker'),`
- **Comportamento esperado:** Escreve o valor digitado no canal pedido do seletor de cor, conforme os argumentos `channel`, `text` e `base` opcional; o rótulo é "Canal da cor" (`src/i18n/locales/pt-BR.json:302` `"command.colorPicker.setChannel": "Canal da cor",`). O canvas previsualiza a cor ao vivo enquanto se arrasta e o Apply grava a cor no JSON do documento como um passo de desfazer (`manifest/features/04-inspector.json:13286` `"The canvas previews the colour live while dragging; Apply writes it to the document JSON as one undo step; Cancel restores the previous value."`); valores de canal inválidos são recusados (`manifest/features/04-inspector.json:13287` `"Invalid channel values are rejected."`). A recusa avisa com `status.colorPicker.invalid` — "{channel}: \"{value}\" não é um valor que este canal aceita." (`src/i18n/locales/pt-BR.json:1689` `"status.colorPicker.invalid": "{channel}: \"{value}\" não é um valor que este canal aceita.",`) — no cenário `red-999-is-refused` (`manifest/features/04-inspector.json:14857` `"id": "red-999-is-refused",`). Como altera o documento, o rascunho pendente é gravado antes no contexto da digitação (G2) e o canvas mostra o documento gravado (G7). A porta é o campo de canal do seletor, que envia só a intenção (o canal e o texto) ao tratador único (G3).

## REQ-6235 — colorPicker.cancel (Cancelar)
- **Onde:** `manifest/commands/workspace.json:3617` `"id": "colorPicker.cancel",`
- **Tratador:** `src/app/commands.ts:405` `'colorPicker.cancel': cancelColorPicker,`
- **Feature:** `src/app/features.ts:70` `'color-picker': registerFeature('color-picker'),`
- **Comportamento esperado:** Fecha o seletor de cor devolvendo a cor com que ele abriu; o rótulo é "Cancelar" (`src/i18n/locales/pt-BR.json:300` `"command.colorPicker.cancel": "Cancelar",`). O Cancel restaura o valor anterior (`manifest/features/04-inspector.json:13286` `"The canvas previews the colour live while dragging; Apply writes it to the document JSON as one undo step; Cancel restores the previous value."`), no cenário `cancel-puts-the-opening-colour-back` (`manifest/features/04-inspector.json:13595` `"id": "cancel-puts-the-opening-colour-back",`), e o Esc faz o mesmo no cenário `escape-puts-the-opening-colour-back` (`manifest/features/04-inspector.json:13678` `"id": "escape-puts-the-opening-colour-back",`); a barra de status anuncia `status.colorPicker.cancelled` — "Cor inalterada." (`src/i18n/locales/pt-BR.json:1688` `"status.colorPicker.cancelled": "Cor inalterada.",`). Pela G3, as portas (o botão Cancelar e o Esc) enviam só a intenção ao tratador único.

## REQ-6236 — colorPicker.apply (Aplicar)
- **Onde:** `manifest/commands/workspace.json:3661` `"id": "colorPicker.apply",`
- **Tratador:** `src/app/commands.ts:404` `'colorPicker.apply': applyColorPicker,`
- **Feature:** `src/app/features.ts:70` `'color-picker': registerFeature('color-picker'),`
- **Comportamento esperado:** Aplica a cor escolhida no seletor; o rótulo é "Aplicar" (`src/i18n/locales/pt-BR.json:299` `"command.colorPicker.apply": "Aplicar",`). O Apply grava a cor no JSON do documento como um passo de desfazer (`manifest/features/04-inspector.json:13286` `"The canvas previews the colour live while dragging; Apply writes it to the document JSON as one undo step; Cancel restores the previous value."`), no cenário `the-background-swatch-opens-the-picker-and-apply-keeps-the-colour` (`manifest/features/04-inspector.json:13294` `"id": "the-background-swatch-opens-the-picker-and-apply-keeps-the-colour",`); toda a mudança feita no seletor entra como um passo de desfazer no cenário `apply-keeps-every-change-as-one-undo-step` (`manifest/features/04-inspector.json:13485` `"id": "apply-keeps-every-change-as-one-undo-step",`). Como altera o documento, o rascunho pendente é gravado antes no contexto da digitação (G2), a pilha de undo fica consistente e o canvas renderiza o documento gravado (G7). A porta é o botão Aplicar do seletor, que envia só a intenção ao tratador único (G3).

## REQ-6237 — quickPanel.setOpen (Abrir ou fechar o painel rápido)
- **Onde:** `manifest/commands/workspace.json:3705` `"id": "quickPanel.setOpen",`
- **Tratador:** `src/app/commands.ts:488` `'quickPanel.setOpen': setOpen,`
- **Feature:** `src/app/features.ts:90` `'quick-panel': registerFeature('quick-panel'),`
- **Comportamento esperado:** Abre, fecha ou alterna o painel rápido conforme o argumento `open` (`open`, `close` ou `toggle`); o rótulo é "Abrir ou fechar o painel rápido" (`src/i18n/locales/pt-BR.json:471` `"command.setQuickPanelOpen": "Abrir ou fechar o painel rápido",`) e o chip se chama "Painel rápido" (`src/i18n/locales/pt-BR.json:1590` `"quickPanel.open": "Painel rápido",`). O Ctrl+Shift+Q abre e fecha o painel de qualquer lugar (o chip faz o mesmo), abrir põe o foco no primeiro campo para o Tab percorrer os campos, e o Esc com o foco em qualquer ponto dentro dele o fecha e devolve o foco ao canvas, onde o Delete apaga a seleção; o que um campo tinha sem guardar é descartado ao fechar o painel (`manifest/features/04-inspector.json:37853` `"Ctrl+Shift+Q opens and closes the panel from anywhere (its chip does the same), opening it puts the focus in its first field so Tab walks the fields, and Escape with the focus anywhere inside it closes it and gives the focus back to the canvas, where Delete deletes the selection; what a field held unkept is dropped as the panel closes."`). O atalho vira o painel no cenário `the-shortcut-turns-the-panel-over` (`manifest/features/04-inspector.json:40655` `"id": "the-shortcut-turns-the-panel-over",`), o Esc fecha no cenário `escape-in-the-panel-closes-it-and-the-canvas-keys-return` (`manifest/features/04-inspector.json:40576` `"id": "escape-in-the-panel-closes-it-and-the-canvas-keys-return",`) e fechar descarta o campo sem guardar no cenário `closing-the-panel-cancels-what-a-field-held-unkept` (`manifest/features/04-inspector.json:40734` `"id": "closing-the-panel-cancels-what-a-field-held-unkept",`). Pela G3, as portas (o chip e o atalho Ctrl+Shift+Q) enviam só a intenção (o estado pedido) ao tratador único.
