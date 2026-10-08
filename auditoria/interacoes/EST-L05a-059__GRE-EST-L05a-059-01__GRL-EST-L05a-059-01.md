# EST-L05a-059 × GRE-EST-L05a-059-01 → GRL-EST-L05a-059-01
- **Estado:** EST-L05a-059
- **Escritor:** GRE-EST-L05a-059-01 (setState): ENT-L05a-0009
- **Leitor:** GRL-EST-L05a-059-01 (guard): ENT-L05a-0096
## Estados deixados por A
- **Final — a razão nula, quando o estado não traz razão:** `src/editor/persistence/autosave.ts:82` `  refusal = reason;` com a razão nula de `src/editor/persistence/autosave.ts:329` `      setState('saved');`
- **Final — as palavras do navegador, quando a escrita é recusada:** `src/editor/persistence/autosave.ts:82` `  refusal = reason;` com a razão de `src/editor/persistence/autosave.ts:332` `    setState('notSaved', failed);`
- **Final — a chave `status.save.noDatabase`, quando `indexedDB` não existe:** `src/editor/persistence/autosave.ts:66` `const NO_DATABASE: SaveRefusal = { key: 'status.save.noDatabase' };`
- **Inalterada, quando o valor e a razão repetem:** `src/editor/persistence/autosave.ts:80` `  if (next === state && reason === refusal) return;`
- **Desmontagem — nenhum valor novo:** a limpeza de `startAutosave` não chama `setState` (`src/editor/persistence/autosave.ts:398` `  return () => {`)
## Casos
### C1 final
- O leitor `guard` chega com o escritor terminado e lê o item em `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`; com a razão posta, a guarda é falsa e pede confirmação em `src/editor/persistence/autosave.ts:347` `    event.preventDefault();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C2 intermediário
- O leitor chega com `notSaved` e a razão posta, o estado entre a recusa e a nova tentativa; a guarda de `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` é falsa e pede confirmação.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:350` `  window.addEventListener('beforeunload', guard);`); nenhuma escrita da razão corre no meio da leitura da guarda.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor decide pedir a confirmação de saída do navegador também pela razão da última recusa: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
