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
- **Divergência:** com imagem de referência anexada e sem texto digitado, o botão Enviar fica indisponível (`src/editor/assistant/surface.tsx:15` `door('assistant-send', { disabled: !configured || !draft.trim() })`) e não dispara o comando, enquanto o tratador aceita o envio nesse estado (`src/editor/assistant/state.ts:57` `if (!current.draft.trim() && current.reference === null)`) e a tecla do campo despacha o comando pelo caminho comum das teclas (`src/editor/input/keymap.ts:532` `if (clipboard === undefined) dispatch(binding.command.id, args);`); o intent pede enviar texto ou imagem de referência (`manifest/features/22-assistant.json:32` `"Pair Companion, select this editor session and send text or a reference image."`), e G3 pede que todas as portas do comando deem o mesmo resultado no mesmo estado.

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
