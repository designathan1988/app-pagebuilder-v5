# EST-L05a-049 × GRE-EST-L05a-049-02 → GRL-EST-L05a-049-01
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-02 (persist): ENT-L10a-0011
- **Leitor:** GRL-EST-L05a-049-01 (apply): ENT-L05a-0100
## Estados deixados por A
- **Final — o rascunho de campo:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:96` `  persist({ ...context(), kind: 'field', key, shown: field.dataset.shown, value: field.value, range: fieldRange(field) });`
- **Final — o rascunho de canvas:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o rascunho montado por `src/editor/persistence/drafts.ts:144` `  persist({ ...context(), kind: 'canvas', node, runs: [...runs], range });`
- **Final — nulo, quando o rascunho se resolve:** `src/editor/persistence/drafts.ts:64` `  held = next;` com o valor nulo de `src/editor/persistence/drafts.ts:92` `    if (held?.kind === 'field' && held.key === key) persist(null);`
- **Intermediário — a restauração à espera desfeita antes de gravar:** `src/editor/persistence/drafts.ts:95` `  pending = false;`
- **Desmontagem — nenhum descarte:** a limpeza de `startDrafts` não toca `held` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `apply` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`. Coincidindo com o rascunho que capturou, aplica o valor e o foco ao campo em `src/editor/persistence/drafts.ts:124` `    field.ownerDocument.execCommand('insertText', false, draft.value);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
### C2 intermediário
- O leitor chega quando o rascunho já foi trocado ou descartado; a comparação `held !== draft` em `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;` é verdadeira e o leitor sai sem aplicar.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
### C3 em curso
- O leitor corre dentro de um quadro próprio (`src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`) e é síncrono; nenhum escritor de `held` corre no meio dele.
- Fecho: n/a — nenhum escritor do item corre em paralelo com o quadro (`src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`)
### C4 desmontagem
- Depois de o campo desmontar, o leitor sai em `!field.isConnected` (`src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`) e a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
## Resultado
- O leitor decide se aplica o rascunho ao campo pela comparação com o rascunho que capturou: `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
