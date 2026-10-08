# EST-L05a-009 × GRE-EST-L05a-009-01 → GRL-EST-L05a-009-01
- **Estado:** EST-L05a-009
- **Escritor:** GRE-EST-L05a-009-01 (endBurst): ENT-L05a-0022, ENT-L05a-0026
- **Leitor:** GRL-EST-L05a-009-01 (onKeyDown): ENT-L05a-0028
## Estados deixados por A
- **V1 false.** `src/editor/input/keymap.ts:345` `let typing = false;` — a instalação do teclado começa sem rajada de digitação.
- **V2 true, desde a primeira letra que não casa atalho.** `src/editor/input/keymap.ts:479` `typing = true;` — `onKeyDown` marca a rajada como digitação (fluxo ENT-L05a-0028); é o estado que este grupo de escritores deixa aberto até o fim da rajada.
- **V1 de novo, pelo fim da rajada.** `src/editor/input/keymap.ts:371` `typing = false;` — `endBurst` marca que a rajada deixou de ser digitação; é a escrita dos fluxos ENT-L05a-0022 (o temporizador vence) e ENT-L05a-0026 (um clique).
- **Sem estado de recusa.** `src/editor/input/keymap.ts:478` `if (!binding && letter && !FIELDS.includes(focused) && context !== TEXT_EDITING) {` — a marca só é posta por uma letra que não casa atalho fora de um campo e fora do texto editado; uma letra que casa atalho não a escreve.
## Casos
### C1 final
- O escritor já terminou e deixou a marca em falso: `src/editor/input/keymap.ts:371` `typing = false;`.
- O leitor chega no `keydown` seguinte (ENT-L05a-0028) e lê o item em `src/editor/input/keymap.ts:391` `const inBurst = letter && typing;`: com `typing` falso, `inBurst` é falso e a letra segue para o atalho, sem parar em `src/editor/input/keymap.ts:504` `if (inBurst && binding.door.kind === 'shortcut' && !FIELDS.includes(focused) && context !== TEXT_EDITING) return;`.
- ok — o leitor lê a marca em falso e deixa o atalho correr.
### C2 intermediário
- No meio da rajada o item está em verdadeiro: `src/editor/input/keymap.ts:479` `typing = true;` quando a letra não casa atalho.
- O leitor lê `src/editor/input/keymap.ts:391` `const inBurst = letter && typing;` e, com `letter` e `typing` verdadeiros, `inBurst` é verdadeiro; em `src/editor/input/keymap.ts:504` `if (inBurst && binding.door.kind === 'shortcut' && !FIELDS.includes(focused) && context !== TEXT_EDITING) return;` a letra é texto e não roda o atalho.
- ok — o leitor lê a marca de meio de rajada e trata a letra como texto.
### C3 em curso
- Na mesma chamada de `onKeyDown` o item é lido em `src/editor/input/keymap.ts:391` `const inBurst = letter && typing;` depois de `endBurst` o ter reiniciado em `src/editor/input/keymap.ts:371` `typing = false;` (chamado em `src/editor/input/keymap.ts:389` `endBurst();`) e antes da marca de digitação da própria linha `src/editor/input/keymap.ts:479` `typing = true;`.
- A leitura vê o valor inteiro do carimbo anterior, nunca uma escrita a meio.
- ok — a leitura em curso vê a marca inteira.
### C4 desmontagem
- A instalação do teclado fecha com `src/editor/input/keymap.ts:590` `endBurst();`, que repõe a marca em falso (`src/editor/input/keymap.ts:371` `typing = false;`), e remove o ouvinte em `src/editor/input/keymap.ts:591` `target.removeEventListener('keydown', onKeyDown);`.
- O item vive no fecho de `installKeymap`; sem o ouvinte `keydown` nenhum leitor o alcança.
- ok — depois de desmontado o teclado, o leitor não corre.
## Resultado
- O leitor lê a marca e decide se a letra é texto ou atalho: `src/editor/input/keymap.ts:391` `const inBurst = letter && typing;`.
