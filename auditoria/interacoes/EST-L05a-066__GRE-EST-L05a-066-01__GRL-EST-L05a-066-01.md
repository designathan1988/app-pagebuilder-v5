# EST-L05a-066 × GRE-EST-L05a-066-01 → GRL-EST-L05a-066-01
- **Estado:** EST-L05a-066
- **Escritor:** GRE-EST-L05a-066-01 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-066-01 (o ouvinte): ENT-L05a-0099
## Estados deixados por A
- **V1, o estado da montagem.** `src/editor/persistence/autosave.ts:234` `  let last = store.getState();` — na montagem de `startAutosave` o item recebe o estado da store nesse instante.
- **V2, o estado da última notificação tratada, numa aba sem a trava.** `src/editor/persistence/autosave.ts:372` `      last = now;` — quando `canWrite` é falso (`src/editor/persistence/autosave.ts:371` `    if (!canWrite()) {`) o ouvinte só regista o estado visto e para; nada é escrito.
- **V2, o estado da última notificação tratada, numa aba que escreve.** `src/editor/persistence/autosave.ts:379` `    last = now;` — o ouvinte regista o estado novo antes de montar o trabalho e pedir a escrita.
- **Sem estado intermediário.** `src/editor/persistence/autosave.ts:379` `    last = now;` — cada registo é uma só instrução síncrona; entre a leitura (`src/editor/persistence/autosave.ts:377` `    const replaced = now.document !== last.document && now.history.past.length === 0 && now.history.future.length === 0;`) e o registo não há espera, e nenhum gesto, grupo ou sequência escreve este item (o ouvinte para em `src/editor/persistence/autosave.ts:368` `    if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;`).
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — a limpeza de `startAutosave` remove a assinatura do ouvinte, mas não repõe `last`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: `last` guarda o estado da última notificação tratada — `src/editor/persistence/autosave.ts:379` `    last = now;`.
- O leitor é o mesmo ouvinte, na notificação seguinte: `src/editor/persistence/autosave.ts:370` `    if (now.document === last.document && now.selection === last.selection) return;` — compara o estado novo com o que o escritor deixou.
- Sem mudança de documento nem de seleção, o caminho para; com mudança, segue para montar o trabalho — `src/editor/persistence/autosave.ts:388` `    const work: SavedWork = { revision, format: now.document.version, document: now.document, selection: now.selection };`.
- ok — o leitor lê o estado que o escritor deixou e decide se há mudança a escrever.
### C2 intermediário
- n/a — o escritor não deixa estado intermediário neste item: `src/editor/persistence/autosave.ts:372` `      last = now;` e `src/editor/persistence/autosave.ts:379` `    last = now;` são as escritas do fluxo do grupo (ENT-L05a-0099), cada uma uma só instrução síncrona de atribuição de objeto.
### C3 em curso
- O leitor corre no próprio ouvinte: lê `last` em `src/editor/persistence/autosave.ts:370` `    if (now.document === last.document && now.selection === last.selection) return;` e volta a lê-lo em `src/editor/persistence/autosave.ts:377` `    const replaced = now.document !== last.document && now.history.past.length === 0 && now.history.future.length === 0;`, antes de o escritor o registar em `src/editor/persistence/autosave.ts:379` `    last = now;`.
- A leitura e o registo estão no mesmo passo síncrono, sem espera entre eles: uma publicação que chegue enquanto a rodada corre não se interpola, e uma rodada seguinte lê já o valor registado.
- ok — a leitura recebe o valor do item no instante da linha, sem valor a meio.
### C4 desmontagem
- A limpeza de `startAutosave` remove a assinatura que o escritor e o leitor usam: `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — depois disso o ouvinte deixa de correr, e nem lê nem escreve o item.
- O item fica com o valor que tinha; nenhuma linha da limpeza o repõe (`src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`).
- ok — depois da desmontagem o ouvinte não corre, e o item fica como estava.
## Resultado
- O leitor decide se a notificação traz uma mudança a escrever, comparando o estado novo com o registado: `src/editor/persistence/autosave.ts:370` `    if (now.document === last.document && now.selection === last.selection) return;`.
