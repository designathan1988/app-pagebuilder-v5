# EST-L05a-068 × GRE-EST-L05a-068-01 → GRL-EST-L05a-068-01
- **Estado:** EST-L05a-068
- **Escritor:** GRE-EST-L05a-068-01 (flush): ENT-L05a-0094
- **Leitor:** GRL-EST-L05a-068-01 (a retomada): ENT-L05a-0095
## Estados deixados por A
- **V1 null, a criação.** `src/editor/persistence/autosave.ts:237` `  let pending: SavedWork | null = null;` — na montagem de `startAutosave` o item nasce nulo: nenhum trabalho à espera.
- **V1 null de novo, ao tirar o trabalho.** `src/editor/persistence/autosave.ts:309` `      pending = null;` — `flush` tira o trabalho antes de o escrever; `src/editor/persistence/autosave.ts:302` `      pending = null;` esvazia-o também numa aba sem a trava de edição (`src/editor/persistence/autosave.ts:301` `    if (!canWrite()) {`).
- **V2 o trabalho reposto, na recusa.** `src/editor/persistence/autosave.ts:313` `        pending ??= work;` — quando a escrita é recusada (`src/editor/persistence/autosave.ts:312` `      if (failed !== null) {`), o trabalho volta ao item para a nova tentativa; com um trabalho novo já ali, o `??=` mantém o mais recente.
- **V2, o estado intermediário: o trabalho tirado durante a espera.** `src/editor/persistence/autosave.ts:309` `      pending = null;` — entre tirar o trabalho e a escrita resolver (`src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);`) o item fica nulo, até uma mudança nova o repor.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` — a limpeza de `startAutosave` não repõe `pending`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: com a escrita recusada, `flush` repôs o trabalho — `src/editor/persistence/autosave.ts:313` `        pending ??= work;` —; com a escrita aceita e nada mais a escrever, deixou o item nulo (`src/editor/persistence/autosave.ts:309` `      pending = null;`).
- O leitor `a retomada` é o temporizador da nova tentativa (ENT-L05a-0095): lê `pending` em `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();`.
- Com trabalho guardado e sem escrita em curso, o leitor volta a chamar `flush`; com o item nulo, não faz nada.
- ok — o leitor lê o trabalho que o escritor deixou e decide se grava de novo.
### C2 intermediário
- O estado intermediário é o trabalho tirado durante a espera — `src/editor/persistence/autosave.ts:309` `      pending = null;`, com a escrita por resolver em `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);`.
- Um leitor que chegue nesse meio lê `pending` nulo em `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();` e não chama outra gravação; se uma mudança nova repôs o item nesse intervalo (`src/editor/persistence/autosave.ts:392` `    pending = work;`), o leitor lê esse trabalho.
- ok — o leitor lê o item como ele está no instante da linha, nulo ou reposto.
### C3 em curso
- O leitor corre enquanto `flush` espera: a espera de `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);` deixa o item nulo ou reposto por uma mudança nova.
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();` — com `writing` verdadeiro (a gravação em curso) o teste é falso, e o leitor não reentra.
- ok — a leitura em curso recebe o item tal como está e não inicia uma gravação sobreposta.
### C4 desmontagem
- A limpeza de `startAutosave` desarma o temporizador que é o leitor: `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` — depois disso a retomada deixa de correr e não lê `pending`.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide se volta a gravar o trabalho guardado, evitando uma gravação sobreposta: `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();`.
