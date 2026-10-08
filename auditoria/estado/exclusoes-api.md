# Exclusões: ocorrências de APIs do navegador

Ocorrências dos padrões de estado P-E04 e P-E11 que não são itens de estado: cada linha abaixo
consulta ou escreve o navegador no ato da chamada (o documento do quadro, a janela dele, a rolagem,
a seleção de texto), ou é um comentário, ou um texto constante, ou um campo de uma classe já
registrada.

## EXC-API-001
- **Padrão:** P-E04
- **Ocorrência:** `src/editor/shell/region-boundary.tsx:33` `export class RegionBoundary extends Component<Props, State> {`
- **Motivo:** declaração da classe da barreira de região; os campos dela (o `state.failed` e o `unsubscribe`) são o item de estado EST-L09b-012, já registrado. A linha só abre a classe, sem campo novo.

## EXC-API-002
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:63` `const win = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato da chamada (a `window` do iframe) para alcançar a rolagem da página; consulta ao navegador a cada chamada, não item guardado. O quadro registrado é o item de estado EST-L07-006.

## EXC-API-003
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:66` `if (!win || !iframe.contentDocument || !(zoom > 0) || box.width === 0) return null;`
- **Motivo:** verifica no ato a janela e o documento do quadro do canvas (a guarda de `geometryOf`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-004
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:76` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato (o `elementAt` procura nele o elemento sob um ponto); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-005
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:96` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`innerBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-006
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:99` `const style = element ? iframe.contentWindow?.getComputedStyle(element) : undefined;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir o estilo computado do elemento (`innerBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-007
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:106` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para decidir se um nó contém outro (`holdsNode`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-008
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:132` `const element = iframe.contentDocument?.querySelector(`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um id capturado (`capturedBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-009
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:141` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para listar os nós sob um ponto (`nodesUnder`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-010
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:159` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`flowAxis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-011
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:160` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados (`flowAxis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-012
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:172` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`flowReversed`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-013
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:173` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados (`flowReversed`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-014
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:182` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`laysOut`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-015
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:183` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir o estilo computado (`laysOut`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-016
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:193` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`sideFlow`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-017
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:194` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados (`sideFlow`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-018
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:205` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato e rola a página dela (`scrollPage`); consulta e escrita ao navegador na chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-019
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:216` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para repor a rolagem depois de um zoom (`keepPagePoint`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-020
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:247` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`elementRotation`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-021
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:248` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir o estilo computado da rotação (`elementRotation`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-022
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:282` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`resizeBasis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-023
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:283` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados do nó e do pai (`resizeBasis`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-024
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:345` `const page = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para percorrer os elementos desenhados (`elementBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-025
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:346` `const view = iframe.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para pedir estilos computados de cada elemento (`elementBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-026
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:372` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`nodeBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-027
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:380` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`nodeSize`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-028
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:394` `const element = iframe.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`trackBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-029
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:424` `const element = iframe?.contentDocument?.querySelector(nodeSelector(id));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`pageLayout.box`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-030
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:434` `const element = iframe?.contentDocument?.querySelector(nodeSelector(id));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`pageLayout.paddingBox`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-031
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:449` `const document = current?.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para ler um tamanho de fonte (`pageLayout.fontPx`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-032
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:456` `const element = current?.contentDocument?.querySelector(nodeSelector(id));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`pageLayout.place`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-033
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:493` `const doc = iframe.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para percorrer os trechos de texto e os elementos substituídos (`readContentBoxes`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-034
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:528` `const element = current?.contentDocument?.querySelector(nodeSelector(id as NodeId));`
- **Motivo:** lê o documento do quadro do canvas no ato e busca nele o elemento de um nó (`computedValues`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-035
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:653` `return current?.contentDocument ?? null;`
- **Motivo:** devolve o documento do quadro do canvas no ato (`canvasDocument`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-036
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/coordinates.ts:659` `const page = current?.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para ver se a página anima (`pageAnimating`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-037
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:70` `const target = frame.contentDocument;`
- **Motivo:** lê o documento do quadro do canvas no ato para entregá-lo ao renderizador (`CanvasFrame`, no arranque do quadro); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-038
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:129` `const view = frame.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para instalar o mapa de teclas da edição em texto (`CanvasFrame.followEdit`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-039
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:200` `if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.body) start();`
- **Motivo:** lê o documento do quadro do canvas no ato para ver se a página já carregou antes de arrancar (`CanvasFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-040
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:225` `const view = frame.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato para guardar a rolagem no instante do zoom (`CanvasFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-041
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:235` `const inside = frame.contentWindow;`
- **Motivo:** lê a janela do quadro do canvas no ato, a cada quadro da espera do zoom, para repor a rolagem (`CanvasFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro é o item EST-L07-006.

## EXC-API-042
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/frame.tsx:245` `inside.scrollTo(inside.scrollX, wanted);`
- **Motivo:** escreve no ato a rolagem da página dentro do quadro do canvas (`CanvasFrame`), sem guardar o valor entre chamadas; consulta e escrita ao navegador na chamada. O quadro é o item EST-L07-006.

## EXC-API-043
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/captured.ts:64` `if (state.scrollLeft !== undefined || state.scrollTop !== undefined) scrolled.push([element, state.scrollLeft ?? 0, state.scrollTop ?? 0]);`
- **Motivo:** lê os deslocamentos guardados no estado de um elemento capturado (o campo `state` do nó capturado, dado do documento) e junta-os na lista local `scrolled`, consumida na mesma chamada de `mountCaptured`; não é item de estado do editor.

## EXC-API-044
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/captured.ts:139` `element.scrollLeft = left;`
- **Motivo:** escreve no ato o deslocamento horizontal do elemento do quadro, do estado capturado, enquanto monta a página capturada (`mountCaptured`); a lista `scrolled` morre no fim da chamada, sem vida entre chamadas.

## EXC-API-045
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/captured.ts:140` `element.scrollTop = top;`
- **Motivo:** escreve no ato o deslocamento vertical do elemento do quadro, do estado capturado, enquanto monta a página capturada (`mountCaptured`); a lista `scrolled` morre no fim da chamada, sem vida entre chamadas.

## EXC-API-046
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/inline.ts:4` `// What a contenteditable's DOM says about the runs of an inline text (split out of editor/canvas/render/render.ts,`
- **Motivo:** comentário do topo do arquivo que cita a palavra contenteditable ao explicar a origem do módulo; nenhuma chamada e nenhum valor guardado.

## EXC-API-047
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:36` `// contenteditable="plaintext-only" and data-key-context naming the key context of the edit, is focused with the caret`
- **Motivo:** comentário do topo do arquivo que cita a palavra contenteditable ao descrever a edição em texto no lugar; nenhuma chamada e nenhum valor guardado.

## EXC-API-048
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:51` `// what a contenteditable's DOM says about the runs (editor/canvas/render/inline.ts), moved out of this file`
- **Motivo:** comentário acima do import que cita a palavra contenteditable ao apontar o módulo movido; nenhuma chamada e nenhum valor guardado.

## EXC-API-049
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:77` `const EDITABLE_ATTRIBUTE = 'contenteditable';`
- **Motivo:** constante de módulo com o nome do atributo que marca o texto editado no lugar; é um texto literal, não um valor lido do navegador nem guardado entre chamadas.

## EXC-API-050
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:434` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro, para inserir a quebra de linha no ponto do cursor (`PageRenderer.insertLineBreak`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-051
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:451` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro para selecionar todo o texto editado (`PageRenderer.selectEditedText`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-052
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:466` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro para reduzi-la a um intervalo de caracteres (`PageRenderer.editedContent`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-053
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/render/render.ts:491` `const selection = this.target.getSelection();`
- **Motivo:** lê no ato a seleção de texto da página do quadro para repor o intervalo selecionado (`PageRenderer.focusEdited`); a seleção vive no navegador, não é item guardado. O texto editado é o item EST-L07-010.

## EXC-API-054
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/side-frame.tsx:50` `const target = frame.contentDocument;`
- **Motivo:** lê o documento do iframe do quadro lateral no ato para entregá-lo ao renderizador do quadro (`SideFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro lateral é o item EST-L07-033.

## EXC-API-055
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/canvas/side-frame.tsx:59` `if (frame.contentDocument?.readyState === 'complete') start();`
- **Motivo:** lê o documento do iframe do quadro lateral no ato para ver se a página já carregou antes de arrancar (`SideFrame`); consulta ao navegador a cada chamada, não item guardado. O quadro lateral é o item EST-L07-033.

## EXC-API-056
- **Padrão:** P-E11
- **Ocorrência:** `src/editor/motion/runtime/actions.ts:184` `win.scrollTo({ top: Math.max(0, box.top + win.scrollY - align + effect.offset), behavior });`
- **Motivo:** rola a janela da página no ato, ao executar a ação de rolagem do tempo de execução (`scroll`); leitura e escrita ao navegador na chamada, sem valor guardado entre chamadas.
