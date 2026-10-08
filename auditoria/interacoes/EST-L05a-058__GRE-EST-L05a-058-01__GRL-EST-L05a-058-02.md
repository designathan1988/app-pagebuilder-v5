# EST-L05a-058 × GRE-EST-L05a-058-01 → GRL-EST-L05a-058-02
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-01 (flush): ENT-L05a-0094, ENT-L05a-0095
- **Leitor:** GRL-EST-L05a-058-02 (saveState.get): ENT-L09b-0017
## Estados deixados por A
- **Final — `saved`, quando a escrita no banco é aceita:** `src/editor/persistence/autosave.ts:329` `      setState('saved');`
- **Final — `notSaved` com a razão, quando a escrita é recusada:** `src/editor/persistence/autosave.ts:332` `    setState('notSaved', failed);`
- **Intermediário — nenhum que `flush` produza:** ele só publica `saved` ou `notSaved`; o `saving` que o precede foi escrito pelo ouvinte da store (`src/editor/persistence/autosave.ts:393` `    setState('saving');`)
- **Desmontagem — nenhum estado novo:** a limpeza de `startAutosave` não chama `setState` (`src/editor/persistence/autosave.ts:398` `  return () => {`)
## Casos
### C1 final
- O leitor `saveState.get` devolve o item em `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`; a barra de status lê-o em `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`.
- Fecho: ok — `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
### C2 intermediário
- O leitor pode devolver `saving`, o estado entre a mudança e a escrita no banco, em `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`.
- Fecho: ok — `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
### C3 em curso
- O leitor é chamado no meio de `setState`, dentro do laço de ouvintes de `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`, pelo `useSyncExternalStore` que o inscreveu.
- Fecho: ok — `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`
### C4 desmontagem
- Depois de o componente desmontar, a inscrição é desfeita pelo `useSyncExternalStore` e o leitor deixa de ser chamado; `saveState.get` continua a devolver o último estado (`src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`).
- Fecho: ok — `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
## Resultado
- O leitor devolve o estado de gravação corrente para a barra de status: `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
