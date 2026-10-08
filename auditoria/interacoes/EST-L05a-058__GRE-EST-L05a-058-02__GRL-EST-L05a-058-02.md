# EST-L05a-058 × GRE-EST-L05a-058-02 → GRL-EST-L05a-058-02
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-02 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-058-02 (saveState.get): ENT-L09b-0017
## Estados deixados por A
- **Final — `saving`, quando uma mudança de documento ou seleção chega:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **Intermediário — o mesmo `saving`, mantido até `flush` publicar `saved` ou `notSaved`:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **Desmontagem — nenhum estado novo:** a limpeza de `startAutosave` remove a assinatura sem chamar `setState` (`src/editor/persistence/autosave.ts:400` `    unsubscribe();`)
## Casos
### C1 final
- O leitor `saveState.get` devolve o item em `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`; com o ouvinte já terminado, devolve o `saving` que ele publicou.
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
- O leitor devolve o estado de gravação corrente, `saving` incluído, para a barra de status: `src/editor/persistence/autosave.ts:71` `  get: (): SaveState => state,`
