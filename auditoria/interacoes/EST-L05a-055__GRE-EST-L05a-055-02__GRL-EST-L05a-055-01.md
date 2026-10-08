# EST-L05a-055 × GRE-EST-L05a-055-02 → GRL-EST-L05a-055-01
- **Estado:** EST-L05a-055
- **Escritor:** GRE-EST-L05a-055-02 (startDrafts): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-055-01 (o ouvinte): ENT-L05a-0102
## Estados deixados por A
- **Final — o estado da store no instante da ligação:** `src/editor/persistence/drafts.ts:185` `  let last = owner.getState();`
- **Desmontagem — não é reposto:** a limpeza de `startDrafts` não toca `last` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `o ouvinte` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; compara o estado corrente com o último visto para decidir o descarte do rascunho.
- Fecho: ok — `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
### C2 intermediário
- O leitor chega com `last` no estado que o arranque guardou em `src/editor/persistence/drafts.ts:185` `  let last = owner.getState();`; é esse estado que forma o par de comparação da guarda em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`.
- Fecho: ok — `src/editor/persistence/drafts.ts:185` `  let last = owner.getState();`
### C3 em curso
- O leitor é o ouvinte da assinatura da store em `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {` e corre no meio de um `publish`; a primeira notificação chega com `last` ainda no estado do arranque e logo o substitui em `src/editor/persistence/drafts.ts:192` `    last = next;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`
### C4 desmontagem
- Depois de o editor desmontar, a assinatura é removida em `src/editor/persistence/drafts.ts:196` `    stop();` e o leitor deixa de correr; `last` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:196` `    stop();`
## Resultado
- O leitor compara o estado corrente com o último visto e decide o descarte do rascunho por ele: `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
