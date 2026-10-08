# EST-L09b-052 × GRE-EST-L09b-052-01 → GRL-EST-L09b-052-01
- **Estado:** EST-L09b-052
- **Escritor:** GRE-EST-L09b-052-01 (setOffered): ENT-L09b-0078, ENT-L09b-0079, ENT-L09b-0080, ENT-L09b-0082
- **Leitor:** GRL-EST-L09b-052-01 (shown): ENT-L09b-0081, ENT-L09b-0082
## Estados deixados por A
A é `setOffered` (`src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);`), que cobre ENT-L09b-0078, ENT-L09b-0079, ENT-L09b-0080 e ENT-L09b-0082.

- **V1 nulo** — `src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);`; é o valor da declaração, sem lista oferecida.
- **V2 as variáveis** — `src/editor/shell/variable-suggestions.tsx:80` `setOffered(matches.length === 0 ? null : { matches, at: store.getState().ui.overlays.dismissals });`; a digitação que começa uma variável oferece as que casam, com o número de dispensas.
- **V3 nulo** — `src/editor/shell/variable-suggestions.tsx:82` `const leave = () => setOffered(null);` e `src/editor/shell/variable-suggestions.tsx:101` `onDismiss={() => setOffered(null)}`; sair do campo ou dispensar a lista fecha-a.
- **Recusa: nenhuma** — as linhas 80, 82 e 101 gravam sem ramo que recuse.
- **Intermediário: nenhum** — cada escrita é uma só atribuição, sem gesto nem sequência que deixe o item num valor parcial.

## Casos
### C1 final
O leitor é o `shown` (ENT-L09b-0081 e ENT-L09b-0082). Chegando depois da escrita, lê o item em `src/editor/shell/variable-suggestions.tsx:90` `const shown = offered !== null && offered.at === dismissals ? offered.matches : null;`: com V2 e o número de dispensas igual ao da oferta, `shown` são as variáveis; com V1 ou V3 é nulo. ok

### C2 intermediário
n/a — cada escrita é uma só atribuição em `src/editor/shell/variable-suggestions.tsx:80` `setOffered(matches.length === 0 ? null : { matches, at: store.getState().ui.overlays.dismissals });`, em `src/editor/shell/variable-suggestions.tsx:82` `const leave = () => setOffered(null);` e em `src/editor/shell/variable-suggestions.tsx:101` `onDismiss={() => setOffered(null)}`; o leitor corre na renderização seguinte, já com o valor novo.

### C3 em curso
n/a — o item é estado de componente do campo (`src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);`); os ouvintes que a escrevem terminam a escrita antes de o leitor da renderização correr.

### C4 desmontagem
n/a — o item vive no estado do campo (`src/editor/shell/variable-suggestions.tsx:73` `const [offered, setOffered] = useState<{ readonly matches: readonly string[]; readonly at: number } | null>(null);`) e é descartado com ele; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide quais variáveis a lista mostra: `src/editor/shell/variable-suggestions.tsx:90` `const shown = offered !== null && offered.at === dismissals ? offered.matches : null;`.
