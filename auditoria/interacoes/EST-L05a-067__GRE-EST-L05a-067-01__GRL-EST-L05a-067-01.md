# EST-L05a-067 × GRE-EST-L05a-067-01 → GRL-EST-L05a-067-01
- **Estado:** EST-L05a-067
- **Escritor:** GRE-EST-L05a-067-01 (flush): ENT-L05a-0094
- **Leitor:** GRL-EST-L05a-067-01 (a retomada): ENT-L05a-0095
## Estados deixados por A
- **V1 false, a criação.** `src/editor/persistence/autosave.ts:236` `  let writing = false;` — na montagem de `startAutosave` o item nasce falso: nenhuma gravação em curso.
- **V2 true, enquanto `flush` grava.** `src/editor/persistence/autosave.ts:305` `    writing = true;` — a gravação em curso marca o item verdadeiro antes de escrever o registro.
- **V1 false de novo, no fim da gravação.** `src/editor/persistence/autosave.ts:327` `    writing = false;` — o item volta a falso quando o ciclo de escrita termina, antes de `flush` decidir o estado de gravação.
- **V2, o estado intermediário: a gravação por terminar.** `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);` — entre `writing = true` e `writing = false` o item fica verdadeiro durante a espera; é o meio da gravação, e a recusa que volta a pendente (`src/editor/persistence/autosave.ts:313` `        pending ??= work;`) acontece ainda com o item verdadeiro.
- **V1, a recusa que não grava.** `src/editor/persistence/autosave.ts:301` `    if (!canWrite()) {` — numa aba sem a trava de edição `flush` para antes de marcar `writing`; o item fica falso.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` — a limpeza de `startAutosave` desarma o temporizador da nova tentativa, mas não repõe `writing`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: `flush` deixou `writing` falso ao fim do ciclo — `src/editor/persistence/autosave.ts:327` `    writing = false;` — e marcou o estado de gravação em `src/editor/persistence/autosave.ts:329` `      setState('saved');` ou `src/editor/persistence/autosave.ts:332` `    setState('notSaved', failed);`.
- O leitor `a retomada` é o temporizador da nova tentativa (ENT-L05a-0095): ele chega depois do atraso `autosave.retryDelay` e lê `writing` em `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();`.
- Com `writing` falso e trabalho pendente, o leitor volta a chamar `flush`; com `writing` verdadeiro, não faz nada.
- ok — o leitor lê o valor final do escritor e decide se tenta gravar de novo.
### C2 intermediário
- O estado intermediário do item é V2, a gravação por terminar: `src/editor/persistence/autosave.ts:305` `    writing = true;` deixa o item verdadeiro durante a espera de `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);`.
- O leitor pode chegar nesse meio: o temporizador da tentativa anterior pode disparar, ou `writeWhenIdle` pode correr, enquanto `flush` espera — e a linha `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();` lê o item verdadeiro e não chama outra gravação.
- ok — o leitor lê o item verdadeiro a meio e não inicia uma segunda gravação sobreposta.
### C3 em curso
- O leitor corre enquanto o escritor está dentro de `flush`: a espera de `src/editor/persistence/autosave.ts:310` `      failed = await writeRecord(work);` mantém `writing` verdadeiro, e nesse intervalo pode disparar o temporizador da nova tentativa (`src/editor/persistence/autosave.ts:334` `    retry = window.setTimeout(() => {`).
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();` — com a gravação em curso, o teste é falso e o leitor não reentra.
- ok — a leitura em curso recebe o item verdadeiro e evita uma gravação sobreposta.
### C4 desmontagem
- A limpeza de `startAutosave` desarma o temporizador que é o leitor: `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` — depois disso a retomada deixa de correr e não lê `writing`.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide se volta a gravar o trabalho pendente, evitando uma gravação sobreposta: `src/editor/persistence/autosave.ts:335` `      if (!writing && pending !== null) void flush();`.
