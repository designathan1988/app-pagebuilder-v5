# TRC-clipboard.copyStyle
- **Chamada:** `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,`
- **Argumentos:** nenhum campo variável — o tipo é `Record<string, never>`, `src/generated/commands.ts:79` `"clipboard.copyStyle": Record<string, never>;`; o tratador recebe só o contexto (o primeiro parâmetro).
- **Ramos que dependem dos argumentos:** nenhum — não há campo cujo valor mude o caminho.

## Passos
1. `src/core/store/store.ts:434` `outcome = entry.run(handlerContext(confirmed, at), args);` — o despacho da store chama o tratador. [lê: EST-L01-030 via handlerContext] [lê: EST-L01-037 via handlerContext]
2. `src/core/clipboard/clipboard.ts:339` `  const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);` — o nó principal da seleção. [lê: EST-L01-030 via locate] [lê: EST-L01-031 via locate]
3. `src/core/clipboard/clipboard.ts:340` `  if (primary === null) return { kind: 'refused', message: message('refusal.nothingSelected') };` — sem alvo, recusa.
4. `src/core/clipboard/clipboard.ts:343` `    clipboard: { text: JSON.stringify({ format: STYLES_FORMAT, styles: primary.node.styles }) },` — os estilos do nó, no formato de estilos. [lê: EST-L01-030 via handlerContext]
5. `src/core/clipboard/clipboard.ts:323` `export const STYLES_FORMAT = 'builder/styles';` — o nome do formato, o primeiro campo do texto.
6. `src/core/clipboard/clipboard.ts:344` `    message: message('status.style.copied', { name: primary.node.name }),` — o recado nomeia o elemento.
7. `src/core/store/store.ts:518` `    const documentChanged = applied.applied.length > 0 && !deepEqual(before.document, applied.document);` — a cópia de estilo não devolve patch, então o documento não mudou. [lê: EST-L01-030 via deepEqual]
8. `src/core/store/store.ts:540` `      message: outcome.message ?? (before.refused === true ? null : before.message),` — a mensagem do estado passa a ser a do recado. [escreve: EST-L01-033 via run]
9. `src/core/store/store.ts:567` `      publish(committed, documentChanged ? applied.applied : []);` — publica sem patches. [escreve: EST-L01-033 via publish]
10. `src/core/store/store.ts:572` `    if (outcome.clipboard !== undefined) options.clipboard?.write(outcome.clipboard);` — entrega a escrita à porta da área de transferência.
11. `src/editor/clipboard.ts:79` `    own = content.text;` — a cópia própria do editor guarda o texto. [escreve: EST-L05b-001 via browserClipboard.write]

## Ramos
- R1 `src/core/clipboard/clipboard.ts:340` `  if (primary === null) return { kind: 'refused', message: message('refusal.nothingSelected') };` — seleção vazia: recusa `refusal.nothingSelected`; com alvo: devolve a escrita dos estilos.

## Fronteiras assíncronas
- nenhuma — o tratador de `src/core/clipboard/clipboard.ts:338` é síncrono e devolve o resultado antes de qualquer retorno de chamada; ler o estilo do nó (`src/core/clipboard/clipboard.ts:339` `  const primary = state.selection[0] === undefined ? null : locate(state.document, state.selection[0]);`) não espera por nada.

## Estado
- lê: EST-L01-030 (o documento, via handlerContext, locate, deepEqual), EST-L01-031 (a seleção, via locate), EST-L01-037 (o estado do editor, via handlerContext)
- escreve: EST-L01-033 (a mensagem, via run, publish), EST-L05b-001

## Resultado
- **Estado final:** EST-L01-030 com o mesmo documento e EST-L01-031 com a mesma seleção; muda só EST-L01-033 (a mensagem) (`src/core/store/store.ts:515`) e EST-L05b-001 em V2, com o texto dos estilos (`src/editor/clipboard.ts:79` `    own = content.text;`).
- **Re-renderizado:** os assinantes da store são chamados por `src/core/store/store.ts:325` `    for (const listener of [...listeners]) listener();`; os assinantes de documento não, porque o documento não mudou (`src/core/store/store.ts:321` `    if (next.document !== before.document) {`).
- **DOM do editor:** nada muda — o tratador devolve só uma escrita de área de transferência (`src/core/clipboard/clipboard.ts:343`); a barra de status passa a mostrar a mensagem de `src/core/clipboard/clipboard.ts:344`.
- **DOM do canvas:** nada muda — `src/core/clipboard/clipboard.ts:338` `export const copyStyleCommand = registerHandler('clipboard.copyStyle', ({ state }): Outcome<never> => {` não devolve patch, e `src/core/store/store.ts:542` publica com a lista vazia.

## Regras
- G1: n/a — o trecho não grava no documento por um campo de digitação; devolve uma escrita de área de transferência (`src/core/clipboard/clipboard.ts:343`).
- G2: n/a — o trecho não lê campo de texto nem rascunho; lê o estado (`src/core/clipboard/clipboard.ts:339`) e nada é descartado.
- G3: ok — as portas chamam o mesmo tratador pela mesma linha `src/app/commands.ts:209` `'clipboard.copyStyle': copyStyleCommand,` e enviam os mesmos argumentos vazios.
- G4: n/a — o trecho não posiciona nem cobre o canvas; não desenha.
- G5: n/a — o trecho não mede nem desenha painel ou barra.
- G6: ok — a seleção não muda (`src/core/store/store.ts:522` `    const chosen = outcome.selection ?? before.selection;`), então todas as vistas seguem a seleção única da store.
- G7: ok — sem patch, o DOM do canvas não muda (`src/core/clipboard/clipboard.ts:338`).
- INT: n/a — o trecho não escreve no documento; devolve só o texto dos estilos (`src/core/clipboard/clipboard.ts:343`).

## Limpeza
- nenhuma — o trecho não cria ouvinte, timer, quadro nem observador; o tratador de `src/core/clipboard/clipboard.ts:338` é síncrono.

## Medições
- nenhuma — nenhum passo usa dimensão, posição, quebra de linha, rolagem, zoom, estilo calculado, elemento sob um ponto ou ordem de foco; o trecho lê o modelo e devolve dados.
