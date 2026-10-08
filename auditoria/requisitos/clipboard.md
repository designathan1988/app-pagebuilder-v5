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
