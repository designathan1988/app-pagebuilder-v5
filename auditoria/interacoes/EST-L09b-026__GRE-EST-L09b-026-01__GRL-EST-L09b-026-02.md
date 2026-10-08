# EST-L09b-026 × GRE-EST-L09b-026-01 → GRL-EST-L09b-026-02
- **Estado:** EST-L09b-026
- **Escritor:** GRE-EST-L09b-026-01 (setQuery): ENT-L09b-0052
- **Leitor:** GRL-EST-L09b-026-02 (searching): ENT-L09b-0052
## Estados deixados por A
A é `setQuery` (`src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');`), que cobre ENT-L09b-0052.

- **V1 vazio** — `src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');`; é o valor da declaração, sem busca.
- **V2 o texto digitado** — `src/editor/shell/sidebar/insert.tsx:83` `onChange={(event) => setQuery(event.target.value)}`; cada mudança do campo escreve o texto.
- **Recusa: nenhuma** — a linha 83 escreve o valor do campo sem ramo que recuse.
- **Intermediário: nenhum** — a escrita é uma só por tecla; o leitor corre na renderização seguinte, já com o texto novo.

## Casos
### C1 final
O leitor é o `searching` (ENT-L09b-0052). Chegando depois da digitação, lê o item em `src/editor/shell/sidebar/insert.tsx:66` `const searching = query.trim() !== '';`: com V2 e texto não vazio a busca está em curso; com V1, ou com texto só de espaços, é falsa. ok

### C2 intermediário
n/a — a escrita é uma só atribuição em `src/editor/shell/sidebar/insert.tsx:83` `onChange={(event) => setQuery(event.target.value)}`; não há gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o item é estado de componente do `Insert` (`src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');`); o leitor é a renderização do próprio componente e não há assinatura de store sobre o item.

### C4 desmontagem
n/a — o item vive no estado do `Insert` (`src/editor/shell/sidebar/insert.tsx:65` `const [query, setQuery] = useState('');`) e é descartado com ele; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide se a lista está em busca: `src/editor/shell/sidebar/insert.tsx:66` `const searching = query.trim() !== '';`.
