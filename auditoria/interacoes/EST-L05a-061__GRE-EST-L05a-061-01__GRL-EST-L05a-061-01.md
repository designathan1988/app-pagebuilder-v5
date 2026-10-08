# EST-L05a-061 × GRE-EST-L05a-061-01 → GRL-EST-L05a-061-01
- **Estado:** EST-L05a-061
- **Escritor:** GRE-EST-L05a-061-01 (db): ENT-L05a-0007, ENT-L05a-0008, ENT-L05a-0070, ENT-L05a-0071
- **Leitor:** GRL-EST-L05a-061-01 (db): ENT-L05a-0072, ENT-L05a-0075, ENT-L05a-0080, ENT-L05a-0083, ENT-L05a-0089
## Estados deixados por A
- **V1 → V2, a abertura pedida.** `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — com `database` ainda nulo, a chamada guarda ali a promessa de `openDatabase`; o item passa da ausência à promessa da abertura em curso.
- **V2 mantido.** `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — o `??=` só atribui quando `database` é nulo; com a promessa já guardada, a chamada devolve a mesma e não abre a base outra vez.
- **V3, a promessa resolvida a nulo.** `src/editor/persistence/autosave.ts:87` `  if (typeof indexedDB === 'undefined') return Promise.resolve(null);` — sem `indexedDB` a promessa resolve logo a nulo; a abertura que falha resolve a nulo em `src/editor/persistence/autosave.ts:95` `    request.onerror = () => resolve(null);`. É o estado da recusa: as leituras devolvem o vazio.
- **V3, a promessa resolvida com a base.** `src/editor/persistence/autosave.ts:94` `    request.onsuccess = () => resolve(request.result);` — a abertura bem-sucedida resolve a promessa com a `IDBDatabase`.
- **V4, a base aberta na versão 2 com as reservas.** `src/editor/persistence/autosave.ts:89` `    const request = indexedDB.open(DATABASE, 2);` abre a base `work` na versão 2; `src/editor/persistence/autosave.ts:91` `      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);` cria `projects`; `src/editor/persistence/autosave.ts:92` `      if (!request.result.objectStoreNames.contains(VERSIONS)) request.result.createObjectStore(VERSIONS);` cria `versions`.
- **V2, o estado intermediário: a promessa por resolver.** `src/editor/persistence/autosave.ts:88` `  return new Promise((resolve) => {` — entre o pedido e a resolução o item é uma promessa pendente; é onde correm ENT-L05a-0069, ENT-L05a-0070 e ENT-L05a-0071, e onde o tratador de subida de versão desenha as reservas (`src/editor/persistence/autosave.ts:90` `    request.onupgradeneeded = () => {`).
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;` — o item vive no módulo, fora do fecho de `startAutosave`; a limpeza devolvida por `startAutosave` não o repõe (`src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`).
## Casos
### C1 final
- O escritor `db` já terminou: guardou a promessa e a abertura resolveu-a com a base — `src/editor/persistence/autosave.ts:94` `    request.onsuccess = () => resolve(request.result);`.
- O leitor `db` chega: `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — encontra `database` já preenchido e devolve a promessa resolvida, sem reabrir a base.
- A continuação do leitor usa a base nas operações dos cinco fluxos do grupo: `src/editor/persistence/autosave.ts:106` `        const request = opened.transaction(STORE).objectStore(STORE).get(RECORD);` (ENT-L05a-0072), `src/editor/persistence/autosave.ts:122` `          transaction.objectStore(STORE).put(work, RECORD);` (ENT-L05a-0075), `src/editor/persistence/autosave.ts:160` `          const request = opened.transaction(STORE).objectStore(STORE).get(DATABASE_JOURNAL);` (ENT-L05a-0080), `src/editor/persistence/autosave.ts:176` `          const transaction = opened.transaction(STORE, 'readwrite');` (ENT-L05a-0083) e `src/editor/persistence/autosave.ts:206` `        const request = opened.transaction(VERSIONS).objectStore(VERSIONS).getAll();` (ENT-L05a-0089).
- ok — o leitor lê a base que o escritor deixou aberta e corre a operação sobre ela.
### C2 intermediário
- O estado intermediário do item é V2, a promessa por resolver — `src/editor/persistence/autosave.ts:88` `  return new Promise((resolve) => {`. Nesse meio o tratador de subida de versão cria as reservas, antes de a promessa resolver (`src/editor/persistence/autosave.ts:90` `    request.onupgradeneeded = () => {`).
- O leitor `db` que chega ali lê a mesma promessa: `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — não abre outra base nem vê um valor a meio; a continuação do consumidor (`src/editor/persistence/autosave.ts:102` `  return db().then(`) só corre depois de a promessa resolver.
- ok — o leitor só age sobre a base depois de a promessa resolver, com as reservas prontas.
### C3 em curso
- O escritor abre a base quando `openDatabase` executa: `src/editor/persistence/autosave.ts:88` `  return new Promise((resolve) => {` — o executor corre de imediato e os tratadores `onupgradeneeded`, `onsuccess` e `onerror` disparam depois.
- O leitor que chama `db` nesse intervalo lê a mesma promessa guardada: `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — a atribuição do `??=` é síncrona e acontece antes de qualquer resolução, pelo que não há segunda abertura nem valor a meio.
- ok — a leitura em curso é a da promessa única, e a continuação corre só na resolução.
### C4 desmontagem
- O item `database` vive no módulo — `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;` — e a limpeza devolvida por `startAutosave` não o repõe: `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);` limpa o temporizador da nova tentativa, não a base.
- Um leitor que chegue depois da desmontagem volta a `db` e lê a mesma base aberta: `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());`.
- ok — a desmontagem não muda o item, e o leitor lê o que estava.
## Resultado
- O leitor devolve a base que o escritor abriu uma só vez e corre sobre ela a operação do fluxo: `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());`.
