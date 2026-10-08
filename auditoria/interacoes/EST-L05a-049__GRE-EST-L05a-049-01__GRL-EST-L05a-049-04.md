# EST-L05a-049 × GRE-EST-L05a-049-01 → GRL-EST-L05a-049-04
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-049-04 (o ouvinte): ENT-L05a-0102
## Estados deixados por A
- **Final — o rascunho descartado (nulo), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:190` `      persist(null);`
- **Intermediário — a restauração à espera desfeita antes do descarte:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Desmontagem — a assinatura removida; o rascunho em memória fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `o ouvinte` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; com uma mudança de documento ou seleção, descarta o rascunho em `src/editor/persistence/drafts.ts:190` `      persist(null);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:190` `      persist(null);`
### C2 intermediário
- O leitor compara o estado corrente com o da notificação anterior, `last`, em `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`; sem mudança, o rascunho fica.
- Fecho: ok — `src/editor/persistence/drafts.ts:188` `    if (held && (next.document !== last.document || next.selection !== last.selection || (held.kind === 'canvas' && next.ui.textEdit.node !== held.node) || (held.context.quick && next.ui.quickPanelOpen !== true))) {`
### C3 em curso
- O leitor é o ouvinte da assinatura da store (`src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`) e é chamado no meio de um `publish` da store; a leitura de `held` ocorre dentro dessa publicação, e o descarte é escrito em `src/editor/persistence/drafts.ts:190` `      persist(null);` na mesma chamada.
- Fecho: ok — `src/editor/persistence/drafts.ts:186` `  const stop = owner.subscribe(() => {`
### C4 desmontagem
- Depois de o editor desmontar, a assinatura é removida em `src/editor/persistence/drafts.ts:196` `    stop();` e o leitor deixa de correr; `held` fica como estava.
- Fecho: ok — `src/editor/persistence/drafts.ts:196` `    stop();`
## Resultado
- O leitor descarta o rascunho em memória quando o documento, a seleção, o texto editado ou o painel rápido mudam: `src/editor/persistence/drafts.ts:190` `      persist(null);`
