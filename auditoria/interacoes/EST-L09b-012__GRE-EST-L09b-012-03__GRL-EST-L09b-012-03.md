# EST-L09b-012 × GRE-EST-L09b-012-03 → GRL-EST-L09b-012-03
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-03 (getDerivedStateFromError): ENT-L09b-0018
- **Leitor:** GRL-EST-L09b-012-03 (render): ENT-L09b-0018, ENT-L09b-0020
## Estados deixados por A
A é o `getDerivedStateFromError` (`src/editor/shell/region-boundary.tsx:39` `static getDerivedStateFromError(): State {`), que cobre ENT-L09b-0018.

- **V2 `failed` verdadeiro** — `src/editor/shell/region-boundary.tsx:40` `return { failed: true };`; um erro de renderização marca a região falhada.
- **Recusa: nenhuma** — a linha 40 devolve sempre o estado falhado; só corre quando um filho lança.

## Casos
### C1 final
O leitor é o `render` (ENT-L09b-0018 e ENT-L09b-0020). Chegando depois do erro, ele lê o item em `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`: com V2 (`failed` verdadeiro) desenha o substituto; com a região sã desenha os filhos. ok

### C2 intermediário
n/a — o escritor devolve o estado de uma vez em `src/editor/shell/region-boundary.tsx:40` `return { failed: true };`; a renderização retomada lê o estado já fixado, sem valor parcial.

### C3 em curso
n/a — o `getDerivedStateFromError` corre durante a renderização e o leitor é a renderização retomada do mesmo componente (`src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`), não uma leitura concorrente.

### C4 desmontagem
n/a — a região que o escritor marca deixa de ser desenhada na desmontagem; o leitor é a própria renderização e não corre depois dela.

## Resultado
O leitor decide o que a região desenha: `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`.
