# EST-L05a-068 × GRE-EST-L05a-068-01 → GRL-EST-L05a-068-02
- **Estado:** EST-L05a-068
- **Escritor:** GRE-EST-L05a-068-01 (flush): ENT-L05a-0094
- **Leitor:** GRL-EST-L05a-068-02 (hidden): ENT-L05a-0097, ENT-L05a-0098
## Estados deixados por A
- **V1 null, a criação.** `src/editor/persistence/autosave.ts:237` `  let pending: SavedWork | null = null;` — na montagem de `startAutosave` o item nasce nulo: nenhum trabalho à espera.
- **V1 null de novo, ao tirar o trabalho.** `src/editor/persistence/autosave.ts:309` `      pending = null;` — `flush` tira o trabalho antes de o escrever; `src/editor/persistence/autosave.ts:302` `      pending = null;` esvazia-o também numa aba sem a trava de edição (`src/editor/persistence/autosave.ts:301` `    if (!canWrite()) {`).
- **V2 o trabalho reposto, na recusa.** `src/editor/persistence/autosave.ts:313` `        pending ??= work;` — quando a escrita é recusada (`src/editor/persistence/autosave.ts:312` `      if (failed !== null) {`), o trabalho volta ao item para a nova tentativa; com um trabalho novo já ali, o `??=` mantém o mais recente.
- **V2, o estado intermediário: o trabalho tirado durante a espera.** `src/editor/persistence/autosave.ts:309` `      pending = null;` — entre tirar o trabalho e a escrita resolver (`src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);`) o item fica nulo, até uma mudança nova o repor.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` — a limpeza de `startAutosave` não repõe `pending`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: com a escrita recusada, `flush` repôs o trabalho — `src/editor/persistence/autosave.ts:313` `        pending ??= work;` —; com a escrita aceita e nada mais a escrever, deixou o item nulo (`src/editor/persistence/autosave.ts:309` `      pending = null;`).
- O leitor `hidden` chega no `visibilitychange` ou no `pagehide` (ENT-L05a-0097, ENT-L05a-0098): lê `pending` em `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());`.
- Com a página oculta e trabalho guardado, o leitor chama `writeNow`, que grava o diário e `flush` já — `src/editor/persistence/autosave.ts:296` `    if (!writing && pending !== null) void flush();`; com o item nulo, não faz nada.
- ok — o leitor lê o trabalho que o escritor deixou e grava-o sem esperar o momento ocioso.
### C2 intermediário
- O estado intermediário é o trabalho tirado durante a espera — `src/editor/persistence/autosave.ts:309` `      pending = null;`, com a escrita por resolver em `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);`.
- Um leitor que chegue nesse meio lê `pending` nulo em `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());` e não grava nada; se uma mudança nova repôs o item nesse intervalo (`src/editor/persistence/autosave.ts:392` `    pending = work;`), o leitor grava esse trabalho.
- ok — o leitor lê o item como ele está no instante da linha, nulo ou reposto.
### C3 em curso
- O leitor corre enquanto `flush` espera: a espera de `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);` deixa o item nulo ou reposto por uma mudança nova.
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());` — com trabalho guardado manda gravar já, que por sua vez não sobrepõe uma escrita em curso (`src/editor/persistence/autosave.ts:296` `    if (!writing && pending !== null) void flush();`).
- ok — a leitura em curso recebe o item tal como está e não sobrepõe a gravação que corre.
### C4 desmontagem
- A limpeza de `startAutosave` remove os dois ouvintes que o leitor usa: `src/editor/persistence/autosave.ts:407` `    document.removeEventListener('visibilitychange', hidden);` e `src/editor/persistence/autosave.ts:408` `    window.removeEventListener('pagehide', hidden);` — depois disso o leitor deixa de correr e não lê `pending`.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide gravar já o trabalho guardado quando a aba fica oculta, sem esperar o momento ocioso: `src/editor/persistence/autosave.ts:353` `    if (document.visibilityState === 'hidden' && pending !== null) writeNow(hasPendingDraft());`.
