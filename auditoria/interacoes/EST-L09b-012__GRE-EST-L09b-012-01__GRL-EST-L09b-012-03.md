# EST-L09b-012 × GRE-EST-L09b-012-01 → GRL-EST-L09b-012-03
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-01 (a inscrição na store): ENT-L09b-0020
- **Leitor:** GRL-EST-L09b-012-03 (render): ENT-L09b-0018, ENT-L09b-0020
## Estados deixados por A
A é a inscrição na store (`src/editor/shell/region-boundary.tsx:45` `this.context?.subscribe(() => {`), que cobre ENT-L09b-0020.

- **V1 `failed` falso** — `src/editor/shell/region-boundary.tsx:36` `override state: State = { failed: false };`; é o valor da declaração e o que a linha 46 deixa quando limpa uma falha.
- **Recusa: o valor fica** — `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; com `failed` já falso a guarda não grava e o item fica como estava.
- **Intermediário: `failed` verdadeiro até a renderização seguinte** — `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; o `setState` só chega à renderização seguinte; na passagem em que a inscrição corre o item ainda é o anterior.

## Casos
### C1 final
O leitor é o `render` (ENT-L09b-0018 e ENT-L09b-0020). Chegando depois de a inscrição ter terminado, lê o item em `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`: com V1 (`failed` falso) desenha os filhos; com o estado falhado desenha o substituto. ok

### C2 intermediário
A inscrição escreve em `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });` e o `setState` só chega à renderização seguinte; nessa passagem o leitor lê o valor anterior em `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`, ainda com o substituto desenhado. ok

### C3 em curso
n/a — a inscrição da linha 45 corre de forma síncrona sobre uma publicação da store; o leitor é a renderização do próprio componente e lê o estado já fixado para aquela passagem (`src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`).

### C4 desmontagem
n/a — a inscrição que o escritor usa é removida na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`); depois dela não há escrita que o leitor possa encontrar.

## Resultado
O leitor decide o que a região desenha: `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`.
