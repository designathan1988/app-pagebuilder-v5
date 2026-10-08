# EST-L05a-013 × GRE-EST-L05a-013-01 → GRL-EST-L05a-013-01
- **Estado:** EST-L05a-013
- **Escritor:** GRE-EST-L05a-013-01 (endBurst): ENT-L05a-0022, ENT-L05a-0026
- **Leitor:** GRL-EST-L05a-013-01 (endBurst): ENT-L05a-0022, ENT-L05a-0026
## Estados deixados por A
- **V1 null.** `src/editor/input/keymap.ts:362` `let burstSequence: CommandSequence | null = null;` — a instalação do teclado começa sem transação de rajada.
- **V2 a sequência aberta da rajada.** `src/editor/input/keymap.ts:520` `burstSequence = store.sequence();` — `onKeyDown` abre a transação reversível da rajada de atalhos (fluxo ENT-L05a-0028); é o estado que este grupo lê em `commit` e larga.
- **V1 de novo, pelo fim da rajada.** `src/editor/input/keymap.ts:369` `burstSequence = null;` — `endBurst` larga a transação; é a escrita dos fluxos ENT-L05a-0022 (o temporizador vence) e ENT-L05a-0026 (um clique).
- **Sem estado de recusa.** `src/editor/input/keymap.ts:518` `if (typedKey) {` — só uma tecla de canvas ou de Camadas escolhida abre a sequência; outra tecla não escreve o item.
## Casos
### C1 final
- O escritor já terminou e deixou a transação largada: `src/editor/input/keymap.ts:369` `burstSequence = null;`.
- O leitor é o próprio `endBurst`, que volta a correr no fim de uma rajada seguinte; lê o item em `src/editor/input/keymap.ts:368` `burstSequence?.commit();`: com o item nulo o encadeamento opcional salta o `commit` e nada é gravado.
- ok — o leitor lê a transação largada e não grava nada.
### C2 intermediário
- No meio da rajada de atalhos o item guarda a sequência aberta: `src/editor/input/keymap.ts:520` `burstSequence = store.sequence();`.
- O leitor corre no fim da rajada e lê `src/editor/input/keymap.ts:368` `burstSequence?.commit();`: com a sequência aberta o `commit` grava os atalhos do grupo como uma só transação reversível, antes de o item ser largado em `src/editor/input/keymap.ts:369` `burstSequence = null;`.
- ok — o leitor lê a sequência de meio de rajada e grava o grupo.
### C3 em curso
- O leitor lê em `src/editor/input/keymap.ts:368` `burstSequence?.commit();` e o escritor larga em `src/editor/input/keymap.ts:369` `burstSequence = null;` na mesma passagem de `endBurst`, sem publicar nem chamar ouvinte entre a leitura e a escrita.
- A leitura vê a sequência inteira, nunca uma escrita a meio.
- ok — a leitura em curso vê a sequência inteira.
### C4 desmontagem
- A instalação do teclado fecha com `src/editor/input/keymap.ts:590` `endBurst();`, que grava ou larga a transação (`src/editor/input/keymap.ts:369` `burstSequence = null;`), e remove o ouvinte em `src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`.
- O item vive no fecho de `installKeymap`; sem o ouvinte `keydown` nenhum leitor o alcança.
- ok — depois de desmontado o teclado, o leitor não corre.
## Resultado
- O leitor lê a transação da rajada e grava o grupo aberto quando ela existe: `src/editor/input/keymap.ts:368` `burstSequence?.commit();`.
