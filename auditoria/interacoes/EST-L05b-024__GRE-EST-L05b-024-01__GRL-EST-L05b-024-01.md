# EST-L05b-024 × GRE-EST-L05b-024-01 → GRL-EST-L05b-024-01
- **Estado:** EST-L05b-024
- **Escritor:** GRE-EST-L05b-024-01 (persistPreferences): ENT-L05b-0046
- **Leitor:** GRL-EST-L05b-024-01 (persistPreferences): ENT-L05b-0046
## Estados deixados por A
- **V1 inicial.** `src/editor/preferences/preferences.ts:235` `let lastDocument = store.getState().document;` — o documento da store quando a inscrição abriu.
- **V2 corrente.** `src/editor/preferences/preferences.ts:243` `lastDocument = state.document;` — a rodada reescreve o valor com o documento da leitura.
- **V-do-gesto.** `src/editor/preferences/preferences.ts:239` `if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;` — com um gesto, uma sequência ou um grupo aberto a rodada volta antes de escrever; o valor fica o da leitura anterior.
- **Sem recusa que mude o valor.** Um comando recusado publica sem mudar o documento, e a rodada reescreve `lastDocument` com o mesmo valor `src/editor/preferences/preferences.ts:243` `lastDocument = state.document;`.
## Casos
### C1 final
- O escritor terminou a rodada: `lastDocument` guarda o documento da última leitura `src/editor/preferences/preferences.ts:243` `lastDocument = state.document;`.
- O leitor é a rodada seguinte da mesma inscrição, que compara o documento da store com o guardado `src/editor/preferences/preferences.ts:241` `const documentChanged = state.document !== lastDocument;`.
- ok — a inscrição lê o documento que a rodada anterior deixou para decidir se grava `src/editor/preferences/preferences.ts:252` `storage.write(JSON.stringify(kept === undefined ? rest : { ...rest, quickPanelOffsets: kept }));`.
### C2 intermediário
- n/a — o escritor não deixa valor a meio: a escrita é uma só atribuição `src/editor/preferences/preferences.ts:243` `lastDocument = state.document;`, e com o gesto aberto a rodada volta antes dela `src/editor/preferences/preferences.ts:239` `if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;`.
### C3 em curso
- O leitor corre na mesma inscrição, chamada na publicação da store `src/core/store/store.ts:325` `for (const listener of [...listeners]) listener();`, depois de o estado já estar fixado em `src/core/store/store.ts:320` `state = next;`.
- A leitura relê o estado `src/editor/preferences/preferences.ts:237` `const state = store.getState();` e vê o documento já publicado.
- ok — no meio da publicação o leitor lê o estado fixado.
### C4 desmontagem
- n/a — a inscrição criada em `src/editor/store.ts:166` `persistPreferences(store, storage);` vive enquanto a store do editor viver; o retorno ali não é guardado e nada desmonta o componente que a usa.
## Resultado
- O leitor decide se grava as preferências comparando o documento da store com o guardado: `src/editor/preferences/preferences.ts:241` `const documentChanged = state.document !== lastDocument;`.
