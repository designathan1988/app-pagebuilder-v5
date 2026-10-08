# EST-L05a-058 × GRE-EST-L05a-058-03 → GRL-EST-L05a-058-03
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-03 (setState): ENT-L05a-0009
- **Leitor:** GRL-EST-L05a-058-03 (useSyncExternalStore): ENT-L09b-0017
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
- O leitor `useSyncExternalStore` chega com o escritor terminado e lê o item em `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`; o rótulo desenha o estado com a chave de `src/editor/shell/status-bar.tsx:288` `      {reason !== null && current === 'notSaved' ? t('status.save.notSavedBecause', { reason }) : t(SAVE_STATE_KEYS[current])}`.
- Fecho: ok — `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`
### C2 intermediário
- O leitor desenha também os estados intermediários: `saving` no rótulo de `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);` e `recoveryRequired` em `src/editor/shell/recovery.tsx:26` `  const waiting = useSyncExternalStore(saveState.subscribe, saveState.get) === 'recoveryRequired';`.
- Fecho: ok — `src/editor/shell/recovery.tsx:26` `  const waiting = useSyncExternalStore(saveState.subscribe, saveState.get) === 'recoveryRequired';`
### C3 em curso
- O leitor é inscrito por `saveState.subscribe` e é chamado no meio de `setState`, no laço de `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`; a leitura re-renderiza o rótulo.
- Fecho: ok — `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`
### C4 desmontagem
- Depois de o diálogo desmontar, o `useSyncExternalStore` remove a inscrição e o leitor deixa de ser chamado; a guarda de `src/editor/shell/recovery.tsx:27` `  if (!open || !waiting || RESTORE === undefined) return null;` deixa de ser avaliada.
- Fecho: ok — `src/editor/shell/recovery.tsx:27` `  if (!open || !waiting || RESTORE === undefined) return null;`
## Resultado
- O leitor re-renderiza o rótulo da barra e o diálogo de recuperação conforme o estado de gravação: `src/editor/shell/status-bar.tsx:288` `      {reason !== null && current === 'notSaved' ? t('status.save.notSavedBecause', { reason }) : t(SAVE_STATE_KEYS[current])}`
