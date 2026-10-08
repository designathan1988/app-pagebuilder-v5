# EST-L05b-021 × GRE-EST-L05b-021-01 → GRL-EST-L05b-021-01
- **Estado:** EST-L05b-021
- **Escritor:** GRE-EST-L05b-021-01 (a inscrição criada por installFocus): ENT-L05b-0044
- **Leitor:** GRL-EST-L05b-021-01 (a inscrição criada por installFocus): ENT-L05b-0044
## Estados deixados por A
A = a inscrição criada por `installFocus` (`src/editor/focus/focus.ts:247` `export function installFocus(store: EditorStore): () => void {`), que cobre `ENT-L05b-0044`; a produtora é a atribuição da marca dentro do ouvinte.

- **V1 o número da requisição atendida na abertura** — a declaração da marca, no número da requisição corrente quando a inscrição abre: `src/editor/focus/focus.ts:248` `  let done = store.getState().ui.focus.request?.count ?? 0;`.
- **V2 o número da requisição que acabou de ser atendida** — a marca passa ao número da requisição servida: `src/editor/focus/focus.ts:252` `    done = request.count;`.
- **Recusa: V1 mantido** — sem requisição nova a marca não muda e a inscrição volta: `src/editor/focus/focus.ts:251` `    if (request === null || request.count === done) return;`.
- **Intermediário: nenhum** — a escrita da linha 252 é uma só atribuição atômica, sem `await`, temporizador, quadro nem ouvinte no corpo do ouvinte.

## Casos
### C1 final
O leitor é o próprio ouvinte da inscrição. Numa passagem, ele lê o item antes de o escritor o atualizar, em `src/editor/focus/focus.ts:251` `    if (request === null || request.count === done) return;`, e compara com a requisição corrente; o valor lido é o que a passagem anterior deixou em `src/editor/focus/focus.ts:252` `    done = request.count;`. Com V2 igual ao número da requisição que chega, a linha 251 volta e nada é atendido de novo; com V2 de um número anterior, a requisição é atendida. ok

### C2 intermediário
n/a — a única escrita é a atribuição atômica `src/editor/focus/focus.ts:252` `    done = request.count;`, dentro do ouvinte; não há gesto, rajada, sequência nem espera que deixe a marca num valor parcial.

### C3 em curso
n/a — o ouvinte da inscrição corre de uma vez, sem `await`, temporizador nem quadro (`src/editor/focus/focus.ts:249` `  return store.subscribe(() => {`); o leitor e o escritor estão na mesma passagem, uma linha depois da outra, e não há leitura da marca enquanto ela é escrita.

### C4 desmontagem
n/a — o leitor é o próprio ouvinte da inscrição, e a desmontagem remove a inscrição inteira pela função que `store.subscribe` devolve (`src/core/store/store.ts:756` `      return () => listeners.delete(listener);`); removida, não há ouvinte que leia a marca.

## Resultado
O ouvinte lê EST-L05b-021 em `src/editor/focus/focus.ts:251` `    if (request === null || request.count === done) return;` e decide se a requisição de foco é nova; quando é, grava a marca em `src/editor/focus/focus.ts:252` `    done = request.count;` e leva o pedido ao DOM em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);`.
