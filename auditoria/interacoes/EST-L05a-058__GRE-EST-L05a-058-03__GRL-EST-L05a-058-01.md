# EST-L05a-058 × GRE-EST-L05a-058-03 → GRL-EST-L05a-058-01
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-03 (setState): ENT-L05a-0009
- **Leitor:** GRL-EST-L05a-058-01 (guard): ENT-L05a-0096
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
- O leitor `guard` chega com o escritor terminado e lê o item em `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`; com `state` fora de `saving`, `notSaved` e `saved` deixam passar, e só `saving` pede confirmação em `src/editor/persistence/autosave.ts:347` `    event.preventDefault();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C2 intermediário
- O leitor chega com `saving`, o estado entre a mudança e a escrita; a guarda de `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` é falsa e pede confirmação.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:350` `  window.addEventListener('beforeunload', guard);`); nenhuma escrita do item corre no meio da leitura da guarda.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor decide pedir a confirmação de saída do navegador pelo estado de gravação: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
