# EST-L05a-055 × GRE-EST-L05a-055-01 → GRL-EST-L05a-055-01
- **Estado:** EST-L05a-055
- **Escritor:** GRE-EST-L05a-055-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-055-01 (o ouvinte): ENT-L05a-0102
## Estados deixados por A
- **Final — o estado da notificação corrente, guardado como o último visto:** `src/editor/persistence/drafts.ts:192` `    last = next;`
- **Desmontagem — a assinatura removida; o item fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `o ouvinte` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; compara o estado corrente com o último visto para decidir o descarte do rascunho.
- Fecho: ok — `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
### C2 intermediário
- O leitor chega com `last` no estado da notificação anterior; é esse estado guardado que forma o par de comparação da guarda em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`.
- Fecho: ok — `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
### C3 em curso
- O leitor é o ouvinte da assinatura da store em `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {` e corre no meio de um `publish`; lê `last` e logo o substitui em `src/editor/persistence/drafts.ts:192` `    last = next;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`
### C4 desmontagem
- Depois de o editor desmontar, a assinatura é removida em `src/editor/persistence/drafts.ts:196` `    stop();` e o leitor deixa de correr; `last` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:196` `    stop();`
## Resultado
- O leitor compara o estado corrente com o último visto e decide o descarte do rascunho por ele: `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
