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
