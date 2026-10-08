# EST-L05a-049 × GRE-EST-L05a-049-02 → GRL-EST-L05a-049-04
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-02 (persist): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-049-04 (o ouvinte): ENT-L05a-0102
## Estados deixados por A
- **Final — o rascunho de campo:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
- **Final — o rascunho de canvas:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:144` `  persist({ ...context(), kind: 'canvas', node, runs: [...runs], range });`
- **Final — nulo, quando o rascunho se resolve:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o valor nulo de `src/editor/persistence/drafts.ts:92` `    if (held?.kind === 'field' && held.key === key) persist(null);`
- **Intermediário — a restauração à espera desfeita antes de gravar:** `src/editor/persistence/drafts.ts:95` `  pending = false;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `o ouvinte` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; com uma mudança de documento ou seleção, descarta o rascunho em `src/editor/persistence/drafts.ts:190` `      persist(null);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:190` `      persist(null);`
### C2 intermediário
- O leitor chega com o rascunho de campo em memória e ainda não resolvido; compara o estado corrente com `last` em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; sem mudança, o rascunho fica.
- Fecho: ok — `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
### C3 em curso
- O leitor é o ouvinte da assinatura da store (`src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`) e é chamado no meio de um `publish` da store; a leitura de `held` ocorre dentro dessa publicação.
- Fecho: ok — `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`
### C4 desmontagem
- Depois de o editor desmontar, a assinatura é removida em `src/editor/persistence/drafts.ts:196` `    stop();` e o leitor deixa de correr; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:196` `    stop();`
## Resultado
- O leitor descarta o rascunho em memória quando o documento, a seleção, o texto editado ou o painel rápido mudam: `src/editor/persistence/drafts.ts:190` `      persist(null);`
