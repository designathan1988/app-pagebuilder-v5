# EST-L05a-049 × GRE-EST-L05a-049-03 → GRL-EST-L05a-049-04
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-03 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-049-04 (o ouvinte): ENT-L05a-0102
## Estados deixados por A
- **Final — nulo, no começo da ligação:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Final — o rascunho restaurado, aceito só com a revisão e a seleção conferindo:** `src/editor/persistence/drafts.ts:160` `  if (parsed.success && canWrite() && parsed.data.revision === revision() && JSON.stringify(parsed.data.selection) === JSON.stringify(owner.getState().selection)) held = parsed.data;`
- **Final — nulo de novo, quando o rascunho de canvas é recusado:** `src/editor/persistence/drafts.ts:181` `        persist(null);`
- **Intermediário — nulo antes de o rascunho restaurado ser aceito:** `src/editor/persistence/drafts.ts:156` `  held = null;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `o ouvinte` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; com uma mudança de documento ou seleção, descarta o rascunho em `src/editor/persistence/drafts.ts:190` `      persist(null);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:190` `      persist(null);`
### C2 intermediário
- O leitor chega com o rascunho restaurado em memória; compara o estado corrente com `last` em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; sem mudança, o rascunho fica.
- Fecho: ok — `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
### C3 em curso
- O leitor é o ouvinte da assinatura da store (`src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`) e é chamado no meio de um `publish` da store; a leitura de `held` ocorre dentro dessa publicação, já com o rascunho restaurado pelo arranque.
- Fecho: ok — `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`
### C4 desmontagem
- Depois de o editor desmontar, a assinatura é removida em `src/editor/persistence/drafts.ts:196` `    stop();` e o leitor deixa de correr; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:196` `    stop();`
## Resultado
- O leitor descarta o rascunho em memória quando o documento, a seleção, o texto editado ou o painel rápido mudam: `src/editor/persistence/drafts.ts:190` `      persist(null);`
