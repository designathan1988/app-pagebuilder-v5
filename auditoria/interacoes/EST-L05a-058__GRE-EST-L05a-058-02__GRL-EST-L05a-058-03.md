# EST-L05a-058 × GRE-EST-L05a-058-02 → GRL-EST-L05a-058-03
- **Estado:** EST-L05a-058
- **Escritor:** GRE-EST-L05a-058-02 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-058-03 (useSyncExternalStore): ENT-L09b-0017
## Estados deixados por A
- **Final — `saving`, quando uma mudança de documento ou seleção chega:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **Intermediário — o mesmo `saving`, mantido até `flush` publicar `saved` ou `notSaved`:** `src/editor/persistence/autosave.ts:393` `    setState('saving');`
- **Desmontagem — nenhum estado novo:** a limpeza de `startAutosave` remove a assinatura sem chamar `setState` (`src/editor/persistence/autosave.ts:400` `    unsubscribe();`)
## Casos
### C1 final
- O leitor `useSyncExternalStore` chega com o ouvinte terminado e lê o item em `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`; com `saving` o rótulo desenha a chave `status.save.saving` em `src/editor/shell/status-bar.tsx:288` `      {reason !== null && current === 'notSaved' ? t('status.save.notSavedBecause', { reason }) : t(SAVE_STATE_KEYS[current])}`.
- Fecho: ok — `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`
### C2 intermediário
- O leitor desenha `saving`, o estado entre a mudança e a escrita, no rótulo de `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`.
- Fecho: ok — `src/editor/shell/status-bar.tsx:283` `  const current = useSyncExternalStore(saveState.subscribe, saveState.get);`
### C3 em curso
- O leitor é inscrito por `saveState.subscribe` e é chamado no meio de `setState`, no laço de `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`; a leitura re-renderiza o rótulo.
- Fecho: ok — `src/editor/persistence/autosave.ts:83` `  for (const listener of [...listeners]) listener();`
### C4 desmontagem
- Depois de a barra desmontar, o `useSyncExternalStore` remove a inscrição e o leitor deixa de ser chamado; o `className` de `src/editor/shell/status-bar.tsx:287` `    <span className={`status-bar__item status-bar__save is-${current}`} data-save-state={current}>` deixa de ser re-avaliado.
- Fecho: ok — `src/editor/shell/status-bar.tsx:287` `    <span className={`status-bar__item status-bar__save is-${current}`} data-save-state={current}>`
## Resultado
- O leitor re-renderiza o rótulo da barra conforme o estado de gravação: `src/editor/shell/status-bar.tsx:288` `      {reason !== null && current === 'notSaved' ? t('status.save.notSavedBecause', { reason }) : t(SAVE_STATE_KEYS[current])}`
