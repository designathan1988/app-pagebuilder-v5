# EST-L05a-072 × GRE-EST-L05a-072-01 → GRL-EST-L05a-072-02
- **Estado:** EST-L05a-072
- **Escritor:** GRE-EST-L05a-072-01 (journalNow): ENT-L05a-0092
- **Leitor:** GRL-EST-L05a-072-02 (o ouvinte): ENT-L05a-0099
## Estados deixados por A
- **V1 false, a criação.** `src/editor/persistence/autosave.ts:244` `  let journalInDatabase = false;` — na montagem de `startAutosave` o diário ainda vai para o `localStorage`.
- **V2 true, quando o `localStorage` recusa o diário.** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` — a gravação do diário que o `localStorage` recusa (`src/editor/persistence/autosave.ts:258` `      } catch {`) marca o item, e o diário passa a ser escrito em IndexedDB.
- **V2 mantido.** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` — o item só sobe de falso a verdadeiro, uma vez; uma segunda recusa deixa-o verdadeiro.
- **Sem estado intermediário.** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` — a escrita é uma só instrução síncrona, dentro do `catch` do `localStorage`; nenhum gesto, grupo ou sequência escreve este item.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — a limpeza de `startAutosave` remove a assinatura do ouvinte e os caminhos que chamam o leitor, mas não repõe `journalInDatabase`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: depois de o `localStorage` recusar o diário, o item ficou verdadeiro — `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;`.
- O leitor `o ouvinte` chega numa mudança da store: lê o item em `src/editor/persistence/autosave.ts:396` `    if (journalInDatabase) journalNow();`, depois de montar o trabalho e pedir a escrita ociosa (`src/editor/persistence/autosave.ts:394` `    writeWhenIdle();`).
- Com o item verdadeiro, o leitor chama `journalNow` já, para uma queda antes do momento ocioso guardar a mudança; com o item falso, não chama nada.
- ok — o leitor lê o item que o escritor deixou e guarda o diário em IndexedDB já, a cada mudança do documento.
### C2 intermediário
- n/a — o escritor não deixa estado intermediário neste item: `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` é a única escrita, uma só instrução síncrona dentro do `catch` do `localStorage`; o fluxo do grupo (ENT-L05a-0092) não tem espera antes dela.
### C3 em curso
- O leitor corre enquanto o escritor corre: uma chamada de `journalNow` pode estar no meio da escrita do diário em IndexedDB (`src/editor/persistence/autosave.ts:270` `    void writeDatabaseJournal(work).then((done) => {`) quando uma mudança da store chega e o ouvinte corre.
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:396` `    if (journalInDatabase) journalNow();` — com o item verdadeiro, chama `journalNow` já, que reescreve o diário com o trabalho mais novo; a transição de falso a verdadeiro é uma só instrução, pelo que o leitor nunca a vê a meio.
- ok — a leitura em curso recebe o item como ele está e guarda o diário no destino certo.
### C4 desmontagem
- A limpeza de `startAutosave` remove a assinatura que é o leitor: `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — depois disso o ouvinte deixa de correr e não lê `journalInDatabase`.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide escrever o diário em IndexedDB já, a cada mudança, quando o item é verdadeiro: `src/editor/persistence/autosave.ts:396` `    if (journalInDatabase) journalNow();`.
