# EST-L05b-001 × GRE-EST-L05b-001-01 → GRL-EST-L05b-001-01
- **Estado:** EST-L05b-001
- **Escritor:** GRE-EST-L05b-001-01 (browserClipboard.write): ENT-L05b-0008, ENT-L05b-0009, TRC-clipboard.copy, TRC-clipboard.copyStyle, TRC-clipboard.cut, TRC-codePanel.copyPane
- **Leitor:** GRL-EST-L05b-001-01 (readClipboard): ENT-L05b-0007, ENT-P-clipboard-0005, ENT-P-clipboard-0006, ENT-P-clipboard-0007, ENT-P-clipboard-0008, ENT-P-clipboard-0017, ENT-P-clipboard-0018, ENT-P-clipboard-0019, ENT-P-clipboard-0020
## Estados deixados por A
A = `browserClipboard.write` (`src/editor/clipboard.ts:77` `export const browserClipboard: ClipboardWriter = {`). O grupo cobre `ENT-L05b-0008`, `ENT-L05b-0009` e os trechos `TRC-clipboard.copy`, `TRC-clipboard.copyStyle`, `TRC-clipboard.cut` e `TRC-codePanel.copyPane`; a produtora do item é uma só atribuição, dentro do `write` (`src/editor/clipboard.ts:78` `  write(content) {`).

- **V2 o texto copiado ou cortado** — a atribuição grava o texto que a última cópia ou o último corte escreveu: `src/editor/clipboard.ts:79` `    own = content.text;`. É o estado final de `TRC-clipboard.copy`, `TRC-clipboard.cut`, `TRC-clipboard.copyStyle` e `TRC-codePanel.copyPane`; a porta da área de transferência recebe a escrita depois do commit, `src/core/store/store.ts:572` `    if (outcome.clipboard !== undefined) options.clipboard?.write(outcome.clipboard);`.
- **V1 `null`** — antes de qualquer cópia ou corte, o item é o da declaração de topo: `src/editor/clipboard.ts:58` `let own: string | null = null;`.
- **Recusa: ainda V2** — a atribuição da linha 79 corre antes da escrita do navegador, então um navegador que recusa a escrita (`ENT-L05b-0008`, `ENT-L05b-0009`) deixa V2 gravado: `src/editor/clipboard.ts:79` `    own = content.text;`.
- **Intermediário: nenhum** — a produtora é uma só atribuição atômica, o primeiro comando do corpo de `write`; não há `await`, temporizador, quadro nem ouvinte antes dela.

## Casos
### C1 final
O leitor `readClipboard` chega depois de o escritor ter terminado e lê o item em `src/editor/clipboard.ts:66` `  if (own === null) return read;` e `src/editor/clipboard.ts:67` `  return { status: 'read', html: null, text: own, markup: null };`. Com V2, a linha `src/editor/clipboard.ts:65` `  if (read.status === 'read' && (read.text !== null || read.html !== null)) return read;` não foi tomada (o sistema não tinha texto nem HTML) e a linha 67 devolve a cópia própria como conteúdo lido; a porta que pediu despacha o comando com ela, `src/editor/doors/door.tsx:112` `afterRead(store, readClipboard(), (content) => dispatch(entry.command.id, { ...given, [clipboard]: content }));`. Com V1, a linha 66 devolve a leitura do sistema sem tocar a cópia própria. ok

### C2 intermediário
n/a — a única escrita de `browserClipboard` no item é a atribuição atômica `src/editor/clipboard.ts:79` `    own = content.text;`, o primeiro comando do corpo de `write`; não há gesto, rajada, sequência, `await`, temporizador nem quadro dentro de `write` antes dela que deixe o item num valor parcial.

### C3 em curso
O leitor `readClipboard` suspende-se em `src/editor/clipboard.ts:64` `  const read = await systemClipboard();` (a retomada `ENT-L05b-0007`). Enquanto está suspenso, uma cópia ou um corte pode rodar e escrever o item em `src/editor/clipboard.ts:79` `    own = content.text;`. Ao retomar, o leitor lê o valor que o escritor deixou em `src/editor/clipboard.ts:66` `  if (own === null) return read;`; o comando de colar passa a levar o texto dessa cópia, feita depois de a leitura ter começado. ok

### C4 desmontagem
n/a — o item é estado de módulo de `src/editor/clipboard.ts` (`src/editor/clipboard.ts:58` `let own: string | null = null;`); nenhum componente o possui e nenhuma desmontagem o reinicia ou o remove, então não há desmontagem depois da qual o leitor chegue.

## Resultado
`readClipboard` lê EST-L05b-001 em `src/editor/clipboard.ts:67` `  return { status: 'read', html: null, text: own, markup: null };` e devolve a cópia própria do editor como conteúdo da área de transferência quando o sistema não tem texto nem HTML (`src/editor/clipboard.ts:66` `  if (own === null) return read;`); a porta despacha o comando de colar com esse conteúdo (`src/editor/doors/door.tsx:111`).
