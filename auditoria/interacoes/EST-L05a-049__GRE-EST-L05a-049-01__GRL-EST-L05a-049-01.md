# EST-L05a-049 × GRE-EST-L05a-049-01 → GRL-EST-L05a-049-01
- **Estado:** EST-L05a-049
- **Escritor:** GRE-EST-L05a-049-01 (o ouvinte): ENT-L05a-0102
- **Leitor:** GRL-EST-L05a-049-01 (apply): ENT-L05a-0100
## Estados deixados por A
- **Final — o rascunho descartado (nulo), quando o documento, a seleção, o texto editado ou o painel rápido mudam:** `src/editor/persistence/drafts.ts:190` `      persist(null);`
- **Intermediário — a restauração à espera desfeita antes do descarte:** `src/editor/persistence/drafts.ts:189` `      pending = false;`
- **Desmontagem — a assinatura removida; o rascunho em memória fica como estava:** `src/editor/persistence/drafts.ts:196` `    stop();`
## Casos
### C1 final
- O leitor `apply` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`. Coincidindo com o rascunho que capturou, aplica o valor e o foco ao campo em `src/editor/persistence/drafts.ts:124` `    field.ownerDocument.execCommand('insertText', false, draft.value);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
### C2 intermediário
- O leitor chega quando o rascunho já foi descartado pelo escritor; a comparação `held !== draft` em `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;` é verdadeira e o leitor sai sem aplicar.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
### C3 em curso
- O leitor corre dentro de um quadro próprio (`src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`) e é síncrono; nenhum escritor de `held` corre no meio dele.
- Fecho: n/a — nenhum escritor do item corre em paralelo com o quadro (`src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`)
### C4 desmontagem
- Depois de o campo desmontar, o leitor sai em `!field.isConnected` (`src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`) e a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
## Resultado
- O leitor decide se aplica o rascunho ao campo pela comparação com o rascunho que capturou: `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
