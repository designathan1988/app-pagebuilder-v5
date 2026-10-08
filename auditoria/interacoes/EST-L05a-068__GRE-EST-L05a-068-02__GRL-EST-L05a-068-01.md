# EST-L05a-068 × GRE-EST-L05a-068-02 → GRL-EST-L05a-068-01
- **Estado:** EST-L05a-068
- **Escritor:** GRE-EST-L05a-068-02 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-068-01 (a retomada): ENT-L05a-0095
## Estados deixados por A
- **V1 null, a criação.** `src/editor/persistence/autosave.ts:237` `  let pending: SavedWork | null = null;` — na montagem de `startAutosave` o item nasce nulo: nenhum trabalho à espera.
- **V2 o trabalho de uma mudança nova.** `src/editor/persistence/autosave.ts:392` `    pending = work;` — a cada mudança de documento ou seleção o ouvinte põe no item o trabalho dessa revisão; uma mudança seguinte substitui-o pelo trabalho mais novo.
- **V2 mantido quando só a seleção muda depois.** `src/editor/persistence/autosave.ts:391` `    else if (pending !== null && documentRevisions.has(pending.revision)) documentRevisions.add(revision);` — o trabalho já guardado continua no item; o ouvinte só acrescenta a revisão nova às revisões de documento.
- **Sem estado intermediário.** `src/editor/persistence/autosave.ts:392` `    pending = work;` — o registo é uma só instrução síncrona; o ouvinte para durante gesto, sequência ou grupo (`src/editor/persistence/autosave.ts:368` `    if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;`) antes de tocar no item.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — a limpeza de `startAutosave` remove a assinatura do ouvinte, mas não repõe `pending`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: `pending` guarda o trabalho da última mudança — `src/editor/persistence/autosave.ts:392` `    pending = work;`.
- O leitor `a retomada` é o temporizador da nova tentativa (ENT-L05a-0095): lê `pending` em `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();`.
- Com trabalho guardado e sem escrita em curso, o leitor volta a chamar `flush`; com o item nulo, não faz nada.
- ok — o leitor lê o trabalho que o escritor deixou e decide se grava.
### C2 intermediário
- n/a — o escritor não deixa estado intermediário neste item: `src/editor/persistence/autosave.ts:392` `    pending = work;` é a escrita do fluxo do grupo (ENT-L05a-0099), uma só instrução síncrona de atribuição; o estado a meio que o item conhece é o de `flush` a tirá-lo, e isso é do outro grupo de escritores.
### C3 em curso
- O leitor corre enquanto o escritor corre: o ouvinte toma o estado novo em `src/editor/persistence/autosave.ts:369` `    const now = store.getState();` e grava `pending` em `src/editor/persistence/autosave.ts:392` `    pending = work;`, no mesmo passo síncrono.
- A linha do leitor lê o item: `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();` — com `flush` a correr (`writing` verdadeiro, `src/editor/persistence/autosave.ts:305` `    writing = true;`) o teste é falso e o leitor não reentra.
- ok — a leitura em curso recebe o item no instante da linha e evita uma gravação sobreposta.
### C4 desmontagem
- A limpeza de `startAutosave` desarma o temporizador que é o leitor (ENT-L05a-0095): `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` — depois disso a retomada deixa de correr e não lê `pending`.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide se volta a gravar o trabalho guardado, evitando uma gravação sobreposta: `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();`.
