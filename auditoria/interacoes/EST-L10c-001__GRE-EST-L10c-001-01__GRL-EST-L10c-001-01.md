# EST-L10c-001 × GRE-EST-L10c-001-01 → GRL-EST-L10c-001-01
- **Estado:** EST-L10c-001
- **Escritor:** GRE-EST-L10c-001-01 (listenToKeys): ENT-L10c-0001
- **Leitor:** GRL-EST-L10c-001-01 (translate): ENT-L10c-0001
## Estados deixados por A
O item é o ouvinte de chaves traduzidas, guardado no módulo de i18n (`src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`). O grupo escritor é `listenToKeys` (ENT-L10c-0001), que grava o ouvinte recebido.

- **V1 `null`.** `src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;` — o valor da declaração, sem ouvinte registrado.
- **V2 a função ouvinte.** `src/i18n/index.ts:50` `keyListener = listener;` — `listenToKeys` grava a função recebida; no build de teste o ouvinte entregue é a função de `installTestPort` (`src/editor/test-port.ts:74` `  listenToKeys((key) => shown.add(key));`), que soma a chave ao conjunto `shown`.
- **V3 `null` de novo.** `src/i18n/index.ts:50` `keyListener = listener;` — com `listener` nulo (a porta `listenToKeys(null)`) o registro fica sem ouvinte.
- **Sem estado de recusa.** `src/i18n/index.ts:50` `keyListener = listener;` grava sem ramo que recuse.
- **Sem estado intermediário.** `src/i18n/index.ts:50` `keyListener = listener;` é uma só atribuição síncrona; nenhum gesto, grupo ou sequência a deixa a meio.
- **Desmontagem: fim-da-página.** O registro vive no módulo (`src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`); o único caminho de remoção é `listenToKeys(null)`, que regrava o item com `null` (`src/i18n/index.ts:50` `keyListener = listener;`).

## Casos
### C1 final
- O escritor já terminou e gravou o ouvinte: `src/i18n/index.ts:50` `keyListener = listener;`.
- O leitor chega por `translate` e lê o ouvinte do registro: `src/i18n/index.ts:57` `  if (keyListener !== null) {`; com o ouvinte (V2) chama-o em `src/i18n/index.ts:58` `    keyListener(key);` e, quando o texto tem plural, de novo em `src/i18n/index.ts:59` `    if (form !== null) keyListener(form);`.
- Com o item em V1 ou V3 (nulo), a guarda de `src/i18n/index.ts:57` `  if (keyListener !== null) {` é falsa e `translate` segue para a mensagem sem chamar ouvinte.
- ok — o leitor lê o ouvinte que `listenToKeys` deixou e chama-o por cada chave traduzida.

### C2 intermediário
- n/a — este grupo não deixa estado intermediário: `src/i18n/index.ts:50` `keyListener = listener;` é uma só atribuição síncrona; não há meio de gesto, de grupo nem de sequência que deixe o registro a meio.

### C3 em curso
- O leitor lê o registro mais de uma vez na mesma chamada de `translate`: a guarda em `src/i18n/index.ts:57` `  if (keyListener !== null) {`, a chamada da chave em `src/i18n/index.ts:58` `    keyListener(key);` e a chamada do plural em `src/i18n/index.ts:59` `    if (form !== null) keyListener(form);`; as linhas 58 e 59 releem a variável do módulo.
- Um ouvinte que, ao correr em `src/i18n/index.ts:58` `    keyListener(key);`, chame `listenToKeys`, troca o ouvinte que a linha de `src/i18n/index.ts:59` `    if (form !== null) keyListener(form);` chama; cada releitura vê o registro inteiro, nunca a meio da atribuição de `src/i18n/index.ts:50` `keyListener = listener;`.
- ok — cada leitura vê o ouvinte tal como ele está nesse instante.

### C4 desmontagem
- O escritor não é um componente: vive no registro do módulo `src/i18n/index.ts:48` `let keyListener: ((key: string) => void) | null = null;`. A remoção é `listenToKeys(null)`, que regrava o item com `null` (`src/i18n/index.ts:50` `keyListener = listener;`); no caminho produzido o ouvinte é registrado no boot por `installTestPort` (`src/editor/test-port.ts:74` `  listenToKeys((key) => shown.add(key));`) e dura a página.
- O leitor continua a ler `src/i18n/index.ts:57` `  if (keyListener !== null) {`; com o item em V3 (nulo) salta as chamadas de `src/i18n/index.ts:58` `    keyListener(key);` e `src/i18n/index.ts:59` `    if (form !== null) keyListener(form);` e segue para a mensagem.
- ok — depois de `listenToKeys(null)` o leitor lê nulo e não chama ouvinte.

## Resultado
- O leitor chama o ouvinte registrado a cada chave traduzida e, quando o texto tem plural, uma segunda vez pela forma do plural: `src/i18n/index.ts:58` `    keyListener(key);`.
