# EST-L05a-072 × GRE-EST-L05a-072-01 → GRL-EST-L05a-072-01
- **Estado:** EST-L05a-072
- **Escritor:** GRE-EST-L05a-072-01 (journalNow): ENT-L05a-0092
- **Leitor:** GRL-EST-L05a-072-01 (journalNow): ENT-L05a-0092
## Estados deixados por A
- **V1 false, a criação.** `src/editor/persistence/autosave.ts:244` `  let journalInDatabase = false;` — na montagem de `startAutosave` o diário ainda vai para o `localStorage`.
- **V2 true, quando o `localStorage` recusa o diário.** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` — a gravação do diário que o `localStorage` recusa (`src/editor/persistence/autosave.ts:258` `      } catch {`) marca o item, e o diário passa a ser escrito em IndexedDB.
- **V2 mantido.** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` — o item só sobe de falso a verdadeiro, uma vez; uma segunda recusa deixa-o verdadeiro.
- **Sem estado intermediário.** `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` — a escrita é uma só instrução síncrona, dentro do `catch` do `localStorage`; nenhum gesto, grupo ou sequência escreve este item.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:400` `    unsubscribe();` — a limpeza de `startAutosave` remove a assinatura do ouvinte e os caminhos que chamam o leitor, mas não repõe `journalInDatabase`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: depois de o `localStorage` recusar o diário, o item ficou verdadeiro — `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;`.
- O leitor é o mesmo `journalNow`, na chamada seguinte: lê o item em `src/editor/persistence/autosave.ts:253` `    if (!journalInDatabase) {`.
- Com o item falso, o leitor tenta o `localStorage` (`src/editor/persistence/autosave.ts:255` `        window.localStorage.setItem(JOURNAL, JSON.stringify(work));`); com o item verdadeiro, salta para a escrita em IndexedDB (`src/editor/persistence/autosave.ts:270` `    void writeDatabaseJournal(work).then((done) => {`).
- ok — o leitor lê o item que o escritor deixou e escolhe onde gravar o diário.
### C2 intermediário
- n/a — o escritor não deixa estado intermediário neste item: `src/editor/persistence/autosave.ts:261` `        journalInDatabase = true;` é a única escrita, uma só instrução síncrona dentro do `catch` do `localStorage`; o fluxo do grupo (ENT-L05a-0092) não tem espera antes dela.
### C3 em curso
- O leitor corre enquanto o escritor corre: uma chamada de `journalNow` pode estar no meio da escrita do diário em IndexedDB (`src/editor/persistence/autosave.ts:270` `    void writeDatabaseJournal(work).then((done) => {`) quando outra entra pela saída da página ou por uma escrita do ouvinte.
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:253` `    if (!journalInDatabase) {` — com o item já verdadeiro, o leitor não tenta o `localStorage` e segue para IndexedDB; a transição de falso a verdadeiro é uma só instrução, pelo que o leitor nunca a vê a meio.
- ok — a leitura em curso recebe o item como ele está, e a escolha do destino é única.
### C4 desmontagem
- A limpeza de `startAutosave` remove os caminhos que chamam o leitor — o ouvinte no `src/editor/persistence/autosave.ts:400` `    unsubscribe();` e a saída da página no `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` — e `journalNow` deixa de correr.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide onde gravar o diário — no `localStorage` ou em IndexedDB — a partir do item: `src/editor/persistence/autosave.ts:253` `    if (!journalInDatabase) {`.
