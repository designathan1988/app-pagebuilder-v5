# EST-L05a-068 × GRE-EST-L05a-068-02 → GRL-EST-L05a-068-02
- **Estado:** EST-L05a-068
- **Escritor:** GRE-EST-L05a-068-02 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-068-02 (hidden): ENT-L05a-0097, ENT-L05a-0098
## Estados deixados por A
- **V1 null, a criação.** `src/editor/persistence/autosave.ts:237` `  let pending: SavedWork | null = null;` — na montagem de `startAutosave` o item nasce nulo: nenhum trabalho à espera.
- **V2 o trabalho de uma mudança nova.** `src/editor/persistence/autosave.ts:392` `    pending = work;` — a cada mudança de documento ou seleção o ouvinte põe no item o trabalho dessa revisão; uma mudança seguinte substitui-o pelo trabalho mais novo.
- **V2 mantido quando só a seleção muda depois.** `src/editor/persistence/autosave.ts:391` `    else if (pending !== null && documentRevisions.has(pending.revision)) documentRevisions.add(revision);` — o trabalho já guardado continua no item; o ouvinte só acrescenta a revisão nova às revisões de documento.
- **Sem estado intermediário.** `src/editor/persistence/autosave.ts:392` `    pending = work;` — o registo é uma só instrução síncrona; o ouvinte para durante gesto, sequência ou grupo (`src/editor/persistence/autosave.ts:368` `    if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;`) antes de tocar no item.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — a limpeza de `startAutosave` remove a assinatura do ouvinte, mas não repõe `pending`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: `pending` guarda o trabalho da última mudança — `src/editor/persistence/autosave.ts:392` `    pending = work;`.
- O leitor `hidden` chega no `visibilitychange` ou no `pagehide` (ENT-L05a-0097, ENT-L05a-0098): lê `pending` em `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());`.
- Com a página oculta e trabalho guardado, o leitor chama `writeNow`, que grava o diário e `flush` já — `src/editor/persistence/autosave.ts:296` `    if (!writing && pending !== null) void flush();`; com o item nulo, não faz nada.
- ok — o leitor lê o trabalho que o escritor deixou e grava-o sem esperar o momento ocioso.
### C2 intermediário
- n/a — o escritor não deixa estado intermediário neste item: `src/editor/persistence/autosave.ts:392` `    pending = work;` é a escrita do fluxo do grupo (ENT-L05a-0099), uma só instrução síncrona de atribuição; o estado a meio que o item conhece é o de `flush` a tirá-lo, e isso é do outro grupo de escritores.
### C3 em curso
- O leitor corre enquanto o escritor corre: o ouvinte toma o estado novo em `src/editor/persistence/autosave.ts:369` `    const now = store.getState();` e grava `pending` em `src/editor/persistence/autosave.ts:392` `    pending = work;`, no mesmo passo síncrono.
- A linha do leitor lê o item: `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());` — com trabalho guardado manda gravar já; a gravação que corre não é sobreposta (`src/editor/persistence/autosave.ts:296` `    if (!writing && pending !== null) void flush();`).
- ok — a leitura em curso recebe o item no instante da linha e não sobrepõe a gravação que corre.
### C4 desmontagem
- A limpeza de `startAutosave` remove os dois ouvintes que o leitor usa: `src/editor/persistence/autosave.ts:407` `    document.removeEventListener('visibilitychange', hidden);` e `src/editor/persistence/autosave.ts:408` `    window.removeEventListener('pagehide', hidden);` — depois disso o leitor deixa de correr e não lê `pending`.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide gravar já o trabalho guardado quando a aba fica oculta, sem esperar o momento ocioso: `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());`.
