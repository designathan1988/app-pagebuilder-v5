# EST-L09b-025 × GRE-EST-L09b-025-01 → GRL-EST-L09b-025-01
- **Estado:** EST-L09b-025
- **Escritor:** GRE-EST-L09b-025-01 (setMoving): ENT-L09b-0050, ENT-L09b-0051
- **Leitor:** GRL-EST-L09b-025-01 (a renderização das pastas de destino): ENT-L09b-0050, ENT-L09b-0051
## Estados deixados por A
A é `setMoving` (`src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);`), que cobre ENT-L09b-0050 e ENT-L09b-0051.

- **V1 falso** — `src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);`; é o valor da declaração, com as pastas de destino escondidas.
- **V2 verdadeiro** — `src/editor/shell/sidebar/explorer.tsx:308` `onClick={() => setMoving((one) => !one)}`; o toque em Mover para inverte o valor e abre as pastas de destino.
- **V3 falso** — `src/editor/shell/sidebar/explorer.tsx:315` `onClick={() => setMoving(false)}`; o toque nas pastas de destino fecha-as.
- **Recusa: nenhuma** — as linhas 308 e 315 são uma atribuição cada, sem ramo que recuse.
- **Intermediário: nenhum** — cada toque é uma só escrita; o leitor corre na renderização seguinte, já com o valor novo.

## Casos
### C1 final
O leitor é a renderização das pastas de destino (ENT-L09b-0050 e ENT-L09b-0051). Chegando depois de o toque ter terminado, lê o item em `src/editor/shell/sidebar/explorer.tsx:314` `{moving && target !== undefined ? (`: com V2 e uma porta de destino as pastas são desenhadas; com V1 ou V3 o trecho é nulo. ok

### C2 intermediário
n/a — as escritas são uma só atribuição em `src/editor/shell/sidebar/explorer.tsx:308` `onClick={() => setMoving((one) => !one)}` e em `src/editor/shell/sidebar/explorer.tsx:315` `onClick={() => setMoving(false)}`; não há gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o item é estado de componente da linha (`src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);`); o leitor é a renderização da própria linha e não há assinatura de store sobre o item.

### C4 desmontagem
n/a — o item vive no estado da linha (`src/editor/shell/sidebar/explorer.tsx:230` `const [moving, setMoving] = useState(false);`) e é descartado com ela; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide se as pastas de destino são desenhadas: `src/editor/shell/sidebar/explorer.tsx:314` `{moving && target !== undefined ? (`.
