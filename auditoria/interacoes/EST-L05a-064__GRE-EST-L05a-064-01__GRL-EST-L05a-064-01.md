# EST-L05a-064 × GRE-EST-L05a-064-01 → GRL-EST-L05a-064-01
- **Estado:** EST-L05a-064
- **Escritor:** GRE-EST-L05a-064-01 (o ouvinte): ENT-L05a-0099
- **Leitor:** GRL-EST-L05a-064-01 (guard): ENT-L05a-0096
## Estados deixados por A
- **V1 false, a criação.** `src/editor/persistence/autosave.ts:231` `  let unwritten = false;` — na montagem de `startAutosave` o item nasce falso: nenhum trabalho feito ficou por escrever.
- **V2 true, com a recuperação obrigatória.** `src/editor/persistence/autosave.ts:381` `      unwritten = true;` — uma mudança que chega com `blocked` verdadeiro e sem documento substituído (`src/editor/persistence/autosave.ts:380` `    if (blocked && !replaced) {`) marca o trabalho como feito e não escrito, e o ouvinte para (`src/editor/persistence/autosave.ts:382` `      return;`).
- **V3 false de novo, com o documento substituído.** `src/editor/persistence/autosave.ts:385` `    unwritten = false;` — um documento substituído (um arquivo aberto, uma versão restaurada, uma página em branco) libera a escrita e o item volta a V1.
- **Sem estado intermediário.** `src/editor/persistence/autosave.ts:381` `      unwritten = true;` e `src/editor/persistence/autosave.ts:385` `    unwritten = false;` — cada escrita é uma só instrução síncrona, e o corpo do ouvinte entre elas não tem espera; nenhum gesto, grupo ou sequência escreve este item.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` — a limpeza de `startAutosave` tira o ouvinte de saída, mas não repõe `unwritten`; o item vive no fecho de `startAutosave` até o fim da página.
## Casos
### C1 final
- O escritor já terminou: depois de uma mudança com recuperação obrigatória, `unwritten` ficou verdadeiro — `src/editor/persistence/autosave.ts:381` `      unwritten = true;` —, e falso de novo quando um documento substituído foi escrito (`src/editor/persistence/autosave.ts:385` `    unwritten = false;`).
- O leitor `guard` chega na saída da página: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;` — lê `unwritten` como a última escrita do ouvinte o deixou.
- Com `unwritten` verdadeiro o teste é falso, e o caminho pede a confirmação: `src/editor/persistence/autosave.ts:347` `    event.preventDefault();` e `src/editor/persistence/autosave.ts:348` `    event.returnValue = '';`.
- ok — o leitor lê o valor final do escritor e decide confirmar a saída quando há trabalho feito por escrever.
### C2 intermediário
- n/a — o escritor não deixa estado intermediário neste item: `src/editor/persistence/autosave.ts:381` `      unwritten = true;` e `src/editor/persistence/autosave.ts:385` `    unwritten = false;` são as únicas escritas, cada uma uma só instrução síncrona, e o fluxo do grupo (ENT-L05a-0099) não tem espera entre elas.
### C3 em curso
- O leitor corre na saída da página e lê `unwritten` de uma vez: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`.
- O passo anterior do próprio leitor pode reentrar no escritor — `src/editor/persistence/autosave.ts:345` `    journalNow(draft);` escreve o diário e, quando a cota o recusa, avisa a store (`src/editor/persistence/autosave.ts:267` `        store.notice(message('status.save.journalInDatabase'));`), e a store pode chamar o ouvinte — mas a leitura de `unwritten` vem depois, e recebe o valor que estiver nesse instante.
- ok — a leitura recebe o valor do item no instante da linha, sem valor a meio.
### C4 desmontagem
- A limpeza de `startAutosave` tira o ouvinte que o leitor usa: `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` — depois disso o `guard` deixa de ser chamado.
- O item fica com o valor que tinha, dentro do fecho de `startAutosave`; nenhuma linha da limpeza o repõe (`src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`).
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide se a saída da página pede confirmação do navegador a partir do valor de `unwritten`: `src/editor/persistence/autosave.ts:346` `    if (state !== 'saving' && refusal === null && !draft && !unwritten) return;`.
