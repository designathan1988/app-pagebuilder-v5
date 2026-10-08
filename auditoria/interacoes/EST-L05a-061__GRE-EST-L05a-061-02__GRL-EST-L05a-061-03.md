# EST-L05a-061 × GRE-EST-L05a-061-02 → GRL-EST-L05a-061-03
- **Estado:** EST-L05a-061
- **Escritor:** GRE-EST-L05a-061-02 (openDatabase): ENT-L05a-0069, ENT-L05a-0070, ENT-L05a-0071
- **Leitor:** GRL-EST-L05a-061-03 (readRecord): ENT-L05a-0087
## Estados deixados por A
- **A promessa que `openDatabase` devolve é guardada no item.** `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — o valor produzido por `openDatabase` passa a ser o valor de `database`; é por esta promessa que os estados seguintes chegam ao item.
- **V3, a promessa resolvida a nulo.** `src/editor/persistence/autosave.ts:87` `  if (typeof indexedDB === 'undefined') return Promise.resolve(null);` — sem `indexedDB` a promessa resolve logo a nulo; a abertura que falha resolve a nulo em `src/editor/persistence/autosave.ts:95` `    request.onerror = () => resolve(null);`. É o estado da recusa: as leituras devolvem o vazio.
- **V3, a promessa resolvida com a base.** `src/editor/persistence/autosave.ts:94` `    request.onsuccess = () => resolve(request.result);` — a abertura bem-sucedida resolve a promessa com a `IDBDatabase`.
- **V4, a base aberta na versão 2 com as reservas.** `src/editor/persistence/autosave.ts:89` `    const request = indexedDB.open(DATABASE, 2);` abre a base `work` na versão 2; `src/editor/persistence/autosave.ts:91` `      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);` cria `projects`; `src/editor/persistence/autosave.ts:92` `      if (!request.result.objectStoreNames.contains(VERSIONS)) request.result.createObjectStore(VERSIONS);` cria `versions`.
- **V2, o estado intermediário: a promessa por resolver.** `src/editor/persistence/autosave.ts:88` `  return new Promise((resolve) => {` — entre o pedido e a resolução o item é uma promessa pendente; é onde o tratador de subida de versão desenha as reservas (`src/editor/persistence/autosave.ts:90` `    request.onupgradeneeded = () => {`), antes de ENT-L05a-0070 ou ENT-L05a-0071 resolverem.
- **Desmontagem: o item fica como estava.** `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;` — o item vive no módulo, fora do fecho de `startAutosave`; a limpeza devolvida por `startAutosave` não o repõe (`src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`).
## Casos
### C1 final
- O escritor `openDatabase` já terminou: a abertura resolveu a promessa com a base — `src/editor/persistence/autosave.ts:94` `    request.onsuccess = () => resolve(request.result);` — e essa promessa é a que `database` guarda (`src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());`).
- O leitor `readRecord` chega: `src/editor/persistence/autosave.ts:102` `  return db().then(` pede a base (o `db` devolve a promessa já resolvida) e encadeia a leitura do registro.
- Sem base, a continuação resolve nulo: `src/editor/persistence/autosave.ts:105` `        if (opened === null) return resolve(null);`. Com base, lê o registro `current`: `src/editor/persistence/autosave.ts:106` `        const request = opened.transaction(STORE).objectStore(STORE).get(RECORD);`, e resolve-o em `src/editor/persistence/autosave.ts:107` `        request.onsuccess = () => resolve((request.result as SavedWork | undefined) ?? null);`.
- ok — o leitor lê a base deixada aberta e devolve o registro salvo, ou nulo.
### C2 intermediário
- O estado intermediário do item é V2, a promessa por resolver — `src/editor/persistence/autosave.ts:88` `  return new Promise((resolve) => {`. Nesse meio o tratador de subida de versão cria as reservas, antes de a promessa resolver (`src/editor/persistence/autosave.ts:90` `    request.onupgradeneeded = () => {`).
- O leitor `readRecord` que chega ali lê a mesma promessa: `src/editor/persistence/autosave.ts:102` `  return db().then(`; a continuação só corre quando a promessa resolve, e é aí que vê a base com as reservas, não a meio.
- ok — a leitura da base acontece só depois de a promessa resolver.
### C3 em curso
- O leitor corre enquanto o escritor abre: `src/editor/persistence/autosave.ts:102` `  return db().then(` pede a base, e a continuação espera pela resolução.
- A base é a mesma promessa guardada pelo escritor — `src/editor/persistence/autosave.ts:99` `const db = () => (database ??= openDatabase());` — pelo que o leitor não dispara uma segunda abertura.
- ok — a leitura em curso aguarda a resolução da promessa única.
### C4 desmontagem
- O item vive no módulo — `src/editor/persistence/autosave.ts:98` `let database: Promise<IDBDatabase | null> | null = null;` — e a limpeza de `startAutosave` não o repõe: `src/editor/persistence/autosave.ts:405` `    window.clearTimeout(retry);`.
- O leitor `readRecord` depois da desmontagem volta a `db` — `src/editor/persistence/autosave.ts:102` `  return db().then(` — e lê a mesma base aberta.
- ok — a desmontagem não muda o item.
## Resultado
- O leitor devolve o registro `current` da base que o escritor abriu, ou nulo quando não há base nem registro: `src/editor/persistence/autosave.ts:107` `        request.onsuccess = () => resolve((request.result as SavedWork | undefined) ?? null);`.
