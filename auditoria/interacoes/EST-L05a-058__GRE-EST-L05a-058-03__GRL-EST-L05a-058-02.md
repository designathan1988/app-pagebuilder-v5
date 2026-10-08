# EST-L05a-058 × GRE-EST-L05a-058-03 → GRL-EST-L05a-058-02
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-03 (setState): ENT-L05a-0009
- **Leitor:** GRL-EST-L05a-058-02 (saveState.get): ENT-L09b-0017
## Estados deixados por A
- **Final — `notSaved` e `recoveryRequired`, conforme o trabalho guardado, no arranque:** `src/editor/persistence/autosave.ts:235` `  setState(blocked ? 'recoveryRequired' : saved !== null && saved !== undefined ? 'saved' : 'notSaved');`
- **Final — `saved`:** `src/editor/persistence/autosave.ts:329` `      setState('saved');`
- **Final — `notSaved` com a razão:** `src/editor/persistence/autosave.ts:332` `    setState('notSaved', failed);`
- **Final — `saving`:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **A escrita do item:** `src/editor/persistence/autosave.ts:81` `  state = next;`
- **Inalterado, quando o valor e a razão repetem:** `src/editor/persistence/autosave.ts:80` `  if (next === state && reason === refusal) return;`
- **Desmontagem — nenhum estado novo:** a limpeza de `startAutosave` não chama `setState` (`src/editor/persistence/autosave.ts:398` `  return () => {`)
## Casos
### C1 final
- O leitor `saveState.get` devolve o item em `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`; devolve o último valor que `setState` gravou em `src/editor/persistence/autosave.ts:81` `  state = next;`.
- Fecho: ok — `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
### C2 intermediário
- O leitor pode devolver `saving`, o estado entre a mudança e a escrita no banco, em `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`.
- Fecho: ok — `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
### C3 em curso
- O leitor é chamado no meio de `setState`, dentro do laço de ouvintes de `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`, pelo `useSyncExternalStore` que o inscreveu; a leitura de `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,` vê o valor já gravado em `src/editor/persistence/autosave.ts:81` `  state = next;`.
- Fecho: ok — `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`
### C4 desmontagem
- Depois de o componente desmontar, a inscrição é desfeita pelo `useSyncExternalStore` e o leitor deixa de ser chamado; `saveState.get` continua a devolver o último estado (`src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`).
- Fecho: ok — `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
## Resultado
- O leitor devolve o estado de gravação corrente para a barra de status: `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
