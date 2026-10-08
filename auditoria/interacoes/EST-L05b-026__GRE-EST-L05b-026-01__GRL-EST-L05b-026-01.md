# EST-L05b-026 × GRE-EST-L05b-026-01 → GRL-EST-L05b-026-01
- **Estado:** EST-L05b-026
- **Escritor:** GRE-EST-L05b-026-01 (settle): ENT-L05b-0049
- **Leitor:** GRL-EST-L05b-026-01 (settle): ENT-L05b-0049
## Estados deixados por A
- **V1 vazio.** `src/editor/test-boot.ts:108` `let last = '';` — nenhum quadro medido ainda.
- **V2 medida.** `src/editor/test-boot.ts:119` `last = size;` — a caixa do palco do quadro corrente, como texto; a medida sai de `src/editor/test-boot.ts:117` `const size = box === undefined ? '' : `${box.left},${box.top},${box.width},${box.height}`;`.
- **V-sem-palco.** `src/editor/test-boot.ts:117` `const size = box === undefined ? '' : `${box.left},${box.top},${box.width},${box.height}`;` — sem o palco no documento a medida é vazia.
- **Sem recusa.** `settle` não é comando; não há recusa que deixe este item noutro valor.
## Casos
### C1 final
- O escritor correu no quadro anterior e deixou a medida `src/editor/test-boot.ts:119` `last = size;`.
- O leitor é a rodada seguinte de `settle`, que lê a medida guardada para contar os quadros parados `src/editor/test-boot.ts:118` `still = size !== '' && size === last ? still + 1 : 0;`.
- ok — a rodada lê a medida que o escritor deixou e a compara com a do quadro corrente.
### C2 intermediário
- n/a — o escritor escreve uma vez por quadro `src/editor/test-boot.ts:119` `last = size;`; não há meio de gesto, de grupo nem de sequência que deixe EST-L05b-026 a meio.
### C3 em curso
- O leitor corre na mesma rodada de `settle` antes da escrita daquele quadro: a leitura `src/editor/test-boot.ts:118` `still = size !== '' && size === last ? still + 1 : 0;` usa o valor que o quadro anterior deixou, e só depois `src/editor/test-boot.ts:119` `last = size;` o substitui.
- ok — a leitura do quadro corrente vê o valor do quadro anterior.
### C4 desmontagem
- ok — quem pára a cadeia (a função que `runDrawnTestBoot` devolve, DEF-0001) cancela o quadro pendente (`src/editor/test-boot.ts:129` `if (frame !== null) target.cancelAnimationFrame(frame);`), e um quadro que ainda chegue sai antes de ler o palco (`src/editor/test-boot.ts:115` `if (stopped) return;`): o leitor não roda depois da parada.
## Resultado
- O leitor decide se o palco assentou e roda os comandos desenhados: `src/editor/test-boot.ts:121` `if (still >= STILL_FRAMES || frames >= MOST_FRAMES) results.push(...runTestBoot(store, { commands: drawn }));`.
