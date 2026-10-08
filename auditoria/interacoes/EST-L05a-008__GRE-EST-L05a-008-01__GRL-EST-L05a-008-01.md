# EST-L05a-008 × GRE-EST-L05a-008-01 → GRL-EST-L05a-008-01
- **Estado:** EST-L05a-008
- **Escritor:** GRE-EST-L05a-008-01 (onKeyDown): ENT-L05a-0022
- **Leitor:** GRL-EST-L05a-008-01 (onKeyDown): ENT-L05a-0022, ENT-L05a-0028
## Estados deixados por A
- **V1 `Number.NEGATIVE_INFINITY`.** `src/editor/input/keymap.ts:344` `let lastLetterAt = Number.NEGATIVE_INFINITY;` — nenhuma rajada em curso; é o estado da instalação do teclado.
- **V2 o carimbo da última letra.** `src/editor/input/keymap.ts:393` `lastLetterAt = event.timeStamp;` — `onKeyDown` guarda o instante da letra que arma o temporizador da rajada; é a escrita que a ENT-L05a-0022 cita.
- **V1 de novo, pelo fim da rajada.** `src/editor/input/keymap.ts:370` `lastLetterAt = Number.NEGATIVE_INFINITY;` — `endBurst` reinicia o instante; `onKeyDown` chama-o em `src/editor/input/keymap.ts:389` `endBurst();` quando a tecla não é letra (fora Shift) ou a letra cai fora da janela da rajada.
- **Sem estado de recusa.** `src/editor/input/keymap.ts:392` `if (letter) {` — só uma letra escreve o carimbo; uma tecla que não é letra não escreve o item, apenas o reinicia.
## Casos
### C1 final
- O escritor já terminou e deixou o carimbo da última letra: `src/editor/input/keymap.ts:393` `lastLetterAt = event.timeStamp;`.
- O leitor chega no `keydown` seguinte (ENT-L05a-0028) e lê o item em `src/editor/input/keymap.ts:388` `if ((!letter && event.key !== SHIFT) || (letter && event.timeStamp - lastLetterAt >= TYPING_BURST)) {`: com uma letra dentro da janela de rajada a diferença é menor que `keys.typingBurst`, a condição é falsa e `endBurst` não corre; fora da janela, ou com uma tecla que não é letra, a condição é verdadeira e `src/editor/input/keymap.ts:389` `endBurst();` reinicia o item.
- ok — o leitor lê o carimbo deixado e decide se a rajada terminou.
### C2 intermediário
- No meio da rajada o item guarda o carimbo da última letra: `src/editor/input/keymap.ts:393` `lastLetterAt = event.timeStamp;`.
- O leitor lê o carimbo inteiro em `src/editor/input/keymap.ts:388` `if ((!letter && event.key !== SHIFT) || (letter && event.timeStamp - lastLetterAt >= TYPING_BURST)) {` e, sendo uma letra dentro da janela, a rajada continua.
- ok — o leitor lê o carimbo de meio de rajada e não a termina.
### C3 em curso
- O mesmo `onKeyDown` lê em `src/editor/input/keymap.ts:388` `if ((!letter && event.key !== SHIFT) || (letter && event.timeStamp - lastLetterAt >= TYPING_BURST)) {` e só depois escreve em `src/editor/input/keymap.ts:393` `lastLetterAt = event.timeStamp;`.
- Numa chamada em curso a leitura vê o carimbo deixado pela letra anterior da rajada, nunca uma escrita a meio: a escrita é uma só atribuição de `number`.
- ok — a leitura vê sempre um carimbo inteiro.
### C4 desmontagem
- A instalação do teclado fecha com `src/editor/input/keymap.ts:590` `endBurst();`, que reinicia o item (`src/editor/input/keymap.ts:370` `lastLetterAt = Number.NEGATIVE_INFINITY;`), e remove o ouvinte em `src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`.
- O item vive no fecho de `installKeymap`; sem o ouvinte `keydown` nenhum leitor o alcança.
- ok — depois de desmontado o teclado, o leitor não corre.
## Resultado
- O leitor lê o instante da última letra e decide se a rajada terminou: `src/editor/input/keymap.ts:388` `if ((!letter && event.key !== SHIFT) || (letter && event.timeStamp - lastLetterAt >= TYPING_BURST)) {`.
