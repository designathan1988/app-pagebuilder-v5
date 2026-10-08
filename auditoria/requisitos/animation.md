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
