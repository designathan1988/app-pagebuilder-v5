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
