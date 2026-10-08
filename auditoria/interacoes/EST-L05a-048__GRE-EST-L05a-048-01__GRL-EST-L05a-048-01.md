# EST-L05a-048 × GRE-EST-L05a-048-01 → GRL-EST-L05a-048-01
- **Estado:** EST-L05a-048
- **Escritor:** GRE-EST-L05a-048-01 (startDrafts): ENT-L05a-0010
- **Leitor:** GRL-EST-L05a-048-01 (apply): ENT-L05a-0100
## Estados deixados por A
- **Final — a função de escrita desta aba (a trava de edição):** `src/editor/persistence/drafts.ts:155` `  mayWrite = canWrite;`
- **Repouso — a função que devolve falso, antes da ligação:** `src/editor/persistence/drafts.ts:38` `let mayWrite = () => false;`
- **Intermediário — nenhum:** a ligação é escrita uma vez; o valor que a função devolve só muda com o papel da aba, por outro caminho (`src/editor/persistence/drafts.ts:152` `export function startDrafts(owner: EditorStore, currentRevision: () => number, canWrite: () => boolean): () => void {`)
- **Desmontagem — não é reposta:** a limpeza de `startDrafts` não toca `mayWrite` (`src/editor/persistence/drafts.ts:195` `  return () => {`)
## Casos
### C1 final
- O leitor `apply` chega com o escritor terminado e lê o item em `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`. Com a função de escrita a permitir, aplica o rascunho ao campo a partir de `src/editor/persistence/drafts.ts:120` `    restoring = true;`.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
### C2 intermediário
- O item é escrito uma vez, na ligação; não há estado intermediário que o escritor deixe, e o leitor só vê o valor corrente na guarda de `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`.
- Fecho: n/a — o item não tem estado intermediário (`src/editor/persistence/drafts.ts:155` `  mayWrite = canWrite;`)
### C3 em curso
- O leitor corre dentro de um quadro próprio (`src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`); entre a ligação e o quadro nenhum escritor de `mayWrite` corre, e a chamada do quadro é síncrona.
- Fecho: n/a — nenhum escritor do item corre em paralelo com o quadro (`src/editor/persistence/drafts.ts:131` `  frame = requestAnimationFrame(apply);`)
### C4 desmontagem
- Depois de o campo desmontar, `apply` sai na primeira condição, `!field.isConnected`, em `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`, e a limpeza cancela o quadro em `src/editor/persistence/drafts.ts:132` `  return () => cancelAnimationFrame(frame);`.
- Fecho: ok — `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
## Resultado
- O leitor decide se aplica o rascunho ao campo pela função de escrita desta aba: `src/editor/persistence/drafts.ts:114` `    if (!field.isConnected || held !== draft || !mayWrite()) return;`
