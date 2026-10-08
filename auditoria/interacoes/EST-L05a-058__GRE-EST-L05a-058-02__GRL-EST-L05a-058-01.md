# EST-L05a-058 × GRE-EST-L05a-058-02 → GRL-EST-L05a-058-01
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-02 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-058-01 (guard): ENT-L05a-0096
## Estados deixados por A
- **Final — `saving`, quando uma mudança de documento ou seleção chega:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **Intermediário — o mesmo `saving`, mantido até `flush` publicar `saved` ou `notSaved`:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **Desmontagem — nenhum estado novo:** a limpeza de `startAutosave` remove a assinatura sem chamar `setState` (`src/editor/persistence/autosave.ts:400` `    unsubscribe();`)
## Casos
### C1 final
- O leitor `guard` chega com o escritor terminado e lê o item em `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`; com `saving` deixa de deixar passar e pede confirmação em `src/editor/persistence/autosave.ts:347` `    event.preventDefault();`.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C2 intermediário
- O leitor chega com `saving`, o estado intermediário até a escrita terminar; a guarda de `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` é falsa e pede confirmação.
- Fecho: ok — `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
### C3 em curso
- O leitor corre no ouvinte de `beforeunload` (`src/editor/persistence/autosave.ts:350` `  window.addEventListener('beforeunload', guard);`); nenhum escritor do item corre no meio da leitura da guarda.
- Fecho: n/a — o ouvinte da saída é síncrono (`src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`)
### C4 desmontagem
- Depois de o autosave desmontar, o ouvinte `beforeunload` é removido em `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` e o leitor deixa de correr.
- Fecho: ok — `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);`
## Resultado
- O leitor decide pedir a confirmação de saída do navegador pelo estado de gravação: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`
