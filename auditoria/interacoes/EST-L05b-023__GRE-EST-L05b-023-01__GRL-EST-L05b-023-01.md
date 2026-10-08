# EST-L05b-023 × GRE-EST-L05b-023-01 → GRL-EST-L05b-023-01
- **Estado:** EST-L05b-023
- **Escritor:** GRE-EST-L05b-023-01 (persistPreferences): ENT-L05b-0046
- **Leitor:** GRL-EST-L05b-023-01 (persistPreferences): ENT-L05b-0046
## Estados deixados por A
A = `persistPreferences` (`src/editor/preferences/preferences.ts:233` `export function persistPreferences(store: Store<EditorUi>, storage: PreferenceStorage): () => void {`), que cobre `ENT-L05b-0046`; a produtora é a atribuição da última leitura dentro do ouvinte.

- **V1 as preferências de quando a inscrição abriu** — a declaração da marca, com as preferências correntes quando a inscrição abre: `src/editor/preferences/preferences.ts:234` `  let last = store.getState().ui.preferences;`.
- **V2 as preferências da leitura corrente** — a marca passa às preferências de agora: `src/editor/preferences/preferences.ts:242` `    last = now;`.
- **Recusa: V1 mantido com gesto aberto** — com um gesto, uma rajada ou um grupo aberto a inscrição espera antes da gravação e não toca a marca: `src/editor/preferences/preferences.ts:239` `    if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;`.
- **Intermediário: nenhum** — a escrita da linha 242 é uma só atribuição atômica, sem `await`, temporizador, quadro nem ouvinte no corpo do ouvinte.

## Casos
### C1 final
O leitor é o próprio ouvinte da inscrição. Numa passagem, ele lê o item antes de o escritor o atualizar, em `src/editor/preferences/preferences.ts:240` `    const changed = now !== last;`, e compara as preferências de agora com a marca; o valor lido é o que a passagem anterior deixou em `src/editor/preferences/preferences.ts:242` `    last = now;`. Com V2 diferente das preferências de agora, `changed` é verdadeiro e a gravação segue; com V2 igual, `changed` é falso. ok

### C2 intermediário
n/a — a única escrita é a atribuição atômica `src/editor/preferences/preferences.ts:242` `    last = now;`, dentro do ouvinte; não há gesto, rajada, sequência nem espera que deixe a marca num valor parcial. O retorno antecipado com gesto aberto (`src/editor/preferences/preferences.ts:239` `    if (store.gestureOpen() || store.sequenceOpen() || store.commandGroupOpen()) return;`) deixa a marca como estava, sem valor parcial.

### C3 em curso
n/a — o ouvinte da inscrição corre de uma vez, sem `await`, temporizador nem quadro (`src/editor/preferences/preferences.ts:236` `  return store.subscribe(() => {`); o leitor e o escritor estão na mesma passagem, e não há leitura da marca enquanto ela é escrita.

### C4 desmontagem
n/a — o leitor é o próprio ouvinte da inscrição, e a desmontagem remove a inscrição inteira pela função que `store.subscribe` devolve (`src/core/store/store.ts:756` `      return () => listeners.delete(listener);`); removida, não há ouvinte que leia a marca.

## Resultado
O ouvinte lê EST-L05b-023 em `src/editor/preferences/preferences.ts:240` `    const changed = now !== last;` e decide se as preferências mudaram; quando mudaram, grava EST-L05b-022 no armazenamento em `src/editor/preferences/preferences.ts:252` `    storage.write(JSON.stringify(kept === undefined ? rest : { ...rest, quickPanelOffsets: kept }));`.
