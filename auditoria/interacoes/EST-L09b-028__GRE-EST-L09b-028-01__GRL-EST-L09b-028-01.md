# EST-L09b-028 × GRE-EST-L09b-028-01 → GRL-EST-L09b-028-01
- **Estado:** EST-L09b-028
- **Escritor:** GRE-EST-L09b-028-01 (setOpen): ENT-L09b-0054, ENT-L09b-0055, ENT-L09b-0056
- **Leitor:** GRL-EST-L09b-028-01 (a classe da paleta): ENT-L09b-0054, ENT-L09b-0055, ENT-L09b-0056
## Estados deixados por A
A é `setOpen` (`src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);`), que cobre ENT-L09b-0054, ENT-L09b-0055 e ENT-L09b-0056.

- **V1 falso** — `src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);`; é o valor da declaração, com a paleta fechada.
- **V2 verdadeiro** — `src/editor/shell/sidebar/layers.tsx:141` `onClick={() => setOpen((one) => !one)}`; o toque no ponto de cor inverte o valor e abre a paleta.
- **V3 falso** — `src/editor/shell/sidebar/layers.tsx:146` `onClick={() => setOpen(false)}` e `src/editor/shell/sidebar/layers.tsx:153` `onClick={() => setOpen(false)}`; um toque num swatch fecha a paleta.
- **Recusa: nenhuma** — as três linhas são uma atribuição cada, sem ramo que recuse.
- **Intermediário: nenhum** — cada toque é uma só escrita; o leitor corre na renderização seguinte, já com o valor novo.

## Casos
### C1 final
O leitor é a classe da paleta (ENT-L09b-0054, ENT-L09b-0055 e ENT-L09b-0056). Chegando depois do toque, lê o item em `src/editor/shell/sidebar/layers.tsx:140` `open ? ' is-open' : ''`: com V2 a paleta ganha a classe que a mostra; com V1 ou V3 a classe sai. ok

### C2 intermediário
n/a — as escritas são uma só atribuição em `src/editor/shell/sidebar/layers.tsx:141` `onClick={() => setOpen((one) => !one)}`, em `src/editor/shell/sidebar/layers.tsx:146` `onClick={() => setOpen(false)}` e em `src/editor/shell/sidebar/layers.tsx:153` `onClick={() => setOpen(false)}`; não há gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o item é estado de componente da linha (`src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);`); o leitor é a renderização da própria linha e não há assinatura de store sobre o item.

### C4 desmontagem
n/a — o item vive no estado da linha (`src/editor/shell/sidebar/layers.tsx:131` `const [open, setOpen] = useState(false);`) e é descartado com ela; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide se a paleta é mostrada: `src/editor/shell/sidebar/layers.tsx:140` `open ? ' is-open' : ''`.
