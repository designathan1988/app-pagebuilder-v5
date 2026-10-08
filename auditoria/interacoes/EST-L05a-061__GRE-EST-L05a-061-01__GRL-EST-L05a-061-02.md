# EST-L05a-061 × GRE-EST-L05a-061-01 → GRL-EST-L05a-061-02
- **Estado:** EST-L05a-061
- **Escritor:** GRE-EST-L05a-061-01 (db): ENT-L05a-0007, ENT-L05a-0008, ENT-L05a-0070, ENT-L05a-0071
- **Leitor:** GRL-EST-L05a-061-02 (readDatabaseJournal): ENT-L05a-0088
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
- O leitor `readDatabaseJournal` chega: `src/editor/persistence/autosave.ts:155` `  return db().then(` pede a base (o `db` devolve a promessa já resolvida) e encadeia a leitura do diário do banco (ENT-L05a-0088).
- Sem base, a continuação resolve nulo: `src/editor/persistence/autosave.ts:158` `        if (opened === null) return resolve(null);`. Com base, lê o diário pela chave `journal`: `src/editor/persistence/autosave.ts:160` `          const request = opened.transaction(STORE).objectStore(STORE).get(DATABASE_JOURNAL);`, e resolve-o em `src/editor/persistence/autosave.ts:161` `          request.onsuccess = () => resolve((request.result as SavedWork | undefined) ?? null);`.
- ok — o leitor lê a base deixada aberta e devolve o diário do banco, ou nulo.
### C2 intermediário
- O estado intermediário do item é V2, a promessa por resolver — `src/editor/persistence/autosave.ts:88` `  return new Promise((resolve) => {`. Nesse meio o tratador de subida de versão cria as reservas, antes de a promessa resolver (`src/editor/persistence/autosave.ts:90` `    request.onupgradeneeded = () => {`).
- O leitor `readDatabaseJournal` que chega ali lê a mesma promessa: `src/editor/persistence/autosave.ts:155` `  return db().then(`; a continuação só corre quando a promessa resolve, e é aí que vê a base com as reservas, não a meio.
- ok — a leitura da base acontece só depois de a promessa resolver.
### C3 em curso
- O leitor corre enquanto o escritor abre: `src/editor/persistence/autosave.ts:155` `  return db().then(` pede a base, e a continuação espera pela resolução.
- A base é a mesma promessa guardada pelo escritor — `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — pelo que o leitor não dispara uma segunda abertura.
- ok — a leitura em curso aguarda a resolução da promessa única.
### C4 desmontagem
- O item vive no módulo — `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;` — e a limpeza de `startAutosave` não o repõe: `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`.
- O leitor `readDatabaseJournal` depois da desmontagem volta a `db` — `src/editor/persistence/autosave.ts:155` `  return db().then(` — e lê a mesma base aberta.
- ok — a desmontagem não muda o item.
## Resultado
- O leitor devolve o diário guardado em IndexedDB sob a chave própria, ou nulo quando não há base nem diário: `src/editor/persistence/autosave.ts:161` `          request.onsuccess = () => resolve((request.result as SavedWork | undefined) ?? null);`.
