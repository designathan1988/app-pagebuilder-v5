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
