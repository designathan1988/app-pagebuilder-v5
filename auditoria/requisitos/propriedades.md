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
