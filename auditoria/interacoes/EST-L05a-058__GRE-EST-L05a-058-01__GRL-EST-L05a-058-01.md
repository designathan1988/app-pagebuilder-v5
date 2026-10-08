# EST-L05a-058 × GRE-EST-L05a-058-01 → GRL-EST-L05a-058-01
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-01 (flush): ENT-L05a-0094, ENT-L05a-0095
- **Leitor:** GRL-EST-L05a-058-01 (guard): ENT-L05a-0096
## Estados deixados por A
- **Final — `saved`, quando a escrita no banco é aceita:** `src/editor/persistence/autosave.ts:329` `      setState('saved');`
- **Final — `notSaved` com a razão, quando a escrita é recusada:** `src/editor/persistence/autosave.ts:332` `    setState('notSaved', failed);`
- **Intermediário — nenhum que `flush` produza:** ele só publica `saved` ou `notSaved`; o `saving` que o precede foi escrito pelo ouvinte da store (`src/editor/persistence/autosave.ts:393` `    setState('saving');`)
- **Desmontagem — nenhum estado novo:** a limpeza de `startAutosave` não chama `setState` (`src/editor/persistence/autosave.ts:398` `  return () => {`)
## Casos
### C1 final
- O leitor `guard` chega com o escritor terminado e lê o item em `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`; com `state` fora de `saving` e as outras condições, deixa passar; caso contrário pede confirmação em `src/editor/persistence/autosave.ts:347` `    event.preventDefault();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C2 intermediário
- O leitor chega com o estado `saving` deixado antes de `flush` correr; a guarda de `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` é falsa e o ouvinte da saída pede confirmação.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:350` `  window.addEventListener('beforeunload', guard);`); nenhuma escrita do item corre no meio da leitura da guarda.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor decide pedir a confirmação de saída do navegador pelo estado de gravação: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
