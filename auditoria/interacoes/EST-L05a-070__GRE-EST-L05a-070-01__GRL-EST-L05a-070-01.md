# EST-L05a-070 × GRE-EST-L05a-070-01 → GRL-EST-L05a-070-01
- **Estado:** EST-L05a-070
- **Escritor:** GRE-EST-L05a-070-01 (journalNow): ENT-L05a-0092
- **Leitor:** GRL-EST-L05a-070-01 (journalNow): ENT-L05a-0092
## Estados deixados por A
- **V1 -1, a criação.** `src/editor/persistence/autosave.ts:240` `  let journalled = -1;` — na montagem de `startAutosave` o item é -1: nada no diário.
- **V2 a revisão que o diário guarda.** `src/editor/persistence/autosave.ts:250` `      journalled = Math.max(journalled, work.revision);` — depois de o diário do trabalho ser escrito (no `localStorage` em `src/editor/persistence/autosave.ts:255` `        window.localStorage.setItem(JOURNAL, JSON.stringify(work));` ou no banco), o item recebe a revisão guardada; o `Math.max` mantém a maior.
- **V3 a revisão mais nova, quando o diário é regravado.** `src/editor/persistence/autosave.ts:250` `      journalled = Math.max(journalled, work.revision);` — cada regravação com uma revisão maior sobe o item; uma regravação com revisão menor não o baixa.
- **V2, o estado intermediário: o diário escrito e o item por subir.** `src/editor/persistence/autosave.ts:270` `    void writeDatabaseJournal(work).then((done) => {` — quando o diário vai para o banco, o item só sobe na resolução (`src/editor/persistence/autosave.ts:271` `      if (done) kept();`); entre a escrita e a resolução o diário já está gravado mas o item ainda não o diz.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` — a limpeza de `startAutosave` remove os caminhos que chamam o leitor, mas não repõe `journalled`; o item vive no fecho até o fim da página.
## Casos
### C1 final
- O escritor já terminou: `kept` deixou `journalled` na revisão guardada — `src/editor/persistence/autosave.ts:250` `      journalled = Math.max(journalled, work.revision);`.
- O leitor é o mesmo `journalNow`, na chamada seguinte: lê `journalled` em `src/editor/persistence/autosave.ts:248` `    if (work === null || (!withSelection && !documentRevisions.has(work.revision)) || journalled >= work.revision) return;`.
- Com uma revisão já guardada que é maior ou igual à do trabalho, o teste é verdadeiro e o caminho para sem regravar o diário; com uma revisão mais nova, escreve-o de novo.
- ok — o leitor lê a revisão que o escritor deixou e decide se o diário é regravado.
### C2 intermediário
- O estado intermediário é o diário já escrito no banco e o item por subir — `src/editor/persistence/autosave.ts:270` `    void writeDatabaseJournal(work).then((done) => {` com a subida só na resolução (`src/editor/persistence/autosave.ts:271` `      if (done) kept();`).
- Um leitor que chegue nesse meio lê `journalled` ainda com a revisão antiga em `src/editor/persistence/autosave.ts:248` `    if (work === null || (!withSelection && !documentRevisions.has(work.revision)) || journalled >= work.revision) return;` e regrava o diário; a resolução seguinte sobe o item.
- ok — o leitor lê o item como ele está no instante da linha; a regravação é inofensiva porque o item sobe a seguir.
### C3 em curso
- O leitor corre enquanto o escritor corre: uma escrita do diário no banco está por resolver (`src/editor/persistence/autosave.ts:270` `    void writeDatabaseJournal(work).then((done) => {`) e outra chamada de `journalNow` entra pela saída da página ou por uma escrita do ouvinte.
- A linha do leitor lê o item nesse instante: `src/editor/persistence/autosave.ts:248` `    if (work === null || (!withSelection && !documentRevisions.has(work.revision)) || journalled >= work.revision) return;` — o item ainda não subiu, e o leitor regrava; a subida da escrita anterior usa `Math.max`, pelo que não baixa o item.
- ok — a leitura em curso recebe o item como ele está e o `Math.max` do escritor mantém a maior revisão.
### C4 desmontagem
- A limpeza de `startAutosave` remove os caminhos que chamam o leitor — o ouvinte no `src/editor/persistence/autosave.ts:400` `    unsubscribe();` e a saída da página no `src/editor/persistence/autosave.ts:406` `    window.removeEventListener('beforeunload', guard);` — e `journalNow` deixa de correr.
- O item fica com o valor que tinha; a limpeza não o repõe.
- ok — depois da desmontagem o leitor não chega, e o item fica como estava.
## Resultado
- O leitor decide se regrava o diário, comparando a revisão guardada com a do trabalho: `src/editor/persistence/autosave.ts:248` `    if (work === null || (!withSelection && !documentRevisions.has(work.revision)) || journalled >= work.revision) return;`.
