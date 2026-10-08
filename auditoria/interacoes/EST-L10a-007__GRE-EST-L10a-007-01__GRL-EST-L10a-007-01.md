# EST-L10a-007 × GRE-EST-L10a-007-01 → GRL-EST-L10a-007-01
- **Estado:** EST-L10a-007
- **Escritor:** GRE-EST-L10a-007-01 (preview.subscribe): ENT-L10a-0001
- **Leitor:** GRL-EST-L10a-007-01 (preview.set): ENT-L10a-0001
## Estados deixados por A
A é `preview.subscribe` (`src/modules/layout-composer/interaction/preview.ts:23` `subscribe(listener: () => void): () => void {`), que cobre ENT-L10a-0001.

- **V1 vazio** — `src/modules/layout-composer/interaction/preview.ts:14` `const listeners = new Set<() => void>();`; é o valor da declaração, sem assinantes.
- **V2 com o assinante vivo** — `src/modules/layout-composer/interaction/preview.ts:24` `listeners.add(listener);`; a camada entra no conjunto ao montar.
- **V3 sem o assinante que saiu** — `src/modules/layout-composer/interaction/preview.ts:25` `return () => listeners.delete(listener);`; a remoção devolvida tira o ouvinte.
- **Recusa: nenhuma** — as linhas 24 e 25 acrescentam e tiram sem ramo que recuse.
- **Intermediário: nenhum** — cada linha é uma só operação no conjunto, sem valor parcial.

## Casos
### C1 final
O leitor é o `preview.set` (ENT-L10a-0001). Chegando depois de a assinatura ter terminado, ele percorre o conjunto em `src/modules/layout-composer/interaction/preview.ts:21` `for (const listener of listeners) listener();`: com V2 avisa o ouvinte da camada; com V1 ou V3 não avisa ninguém. ok

### C2 intermediário
n/a — cada escrita é uma só operação em `src/modules/layout-composer/interaction/preview.ts:24` `listeners.add(listener);` ou em `src/modules/layout-composer/interaction/preview.ts:25` `return () => listeners.delete(listener);`; não há gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o leitor percorre o conjunto em `src/modules/layout-composer/interaction/preview.ts:21` `for (const listener of listeners) listener();` de forma síncrona; o ouvinte da camada não acrescenta nem tira a sua própria entrada durante a chamada.

### C4 desmontagem
ok — o leitor chega depois de a camada desmontar: a remoção de `src/modules/layout-composer/interaction/preview.ts:25` `return () => listeners.delete(listener);` tirou o ouvinte, e o conjunto percorrido em `src/modules/layout-composer/interaction/preview.ts:21` `for (const listener of listeners) listener();` já não o tem.

## Resultado
O leitor avisa os assinantes vivos do traço: `src/modules/layout-composer/interaction/preview.ts:21` `for (const listener of listeners) listener();`.
