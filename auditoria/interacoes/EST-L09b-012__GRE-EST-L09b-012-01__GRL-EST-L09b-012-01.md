# EST-L09b-012 × GRE-EST-L09b-012-01 → GRL-EST-L09b-012-01
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-01 (a inscrição na store): ENT-L09b-0020
- **Leitor:** GRL-EST-L09b-012-01 (a inscrição na store): ENT-L09b-0020
## Estados deixados por A
A é a inscrição na store (`src/editor/shell/region-boundary.tsx:45` `this.context?.subscribe(() => {`), que cobre ENT-L09b-0020.

- **V1 `failed` falso** — `src/editor/shell/region-boundary.tsx:36` `override state: State = { failed: false };`; é o valor da declaração e o que a linha 46 deixa quando limpa uma falha.
- **Recusa: o valor fica** — `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; com `failed` já falso a guarda não grava e o item fica como estava.
- **Intermediário: `failed` verdadeiro até a renderização seguinte** — `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; o `setState` só chega à renderização seguinte; na passagem em que a inscrição corre o item ainda é o anterior.

## Casos
### C1 final
O leitor é a mesma inscrição na store (ENT-L09b-0020). Numa mudança seguinte da store ele lê o item em `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`: com V1 (`failed` falso) a guarda é falsa e não grava; com o estado falhado grava falso. ok

### C2 intermediário
n/a — o escritor é uma só guarda e um só `setState` em `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o leitor é a própria guarda da linha `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; ela lê o valor e escreve no mesmo passo, sem outra assinatura sobre o item.

### C4 desmontagem
n/a — a inscrição que o escritor usa é removida na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`); depois dela a inscrição não corre e não há leitura do item por esta via.

## Resultado
O leitor decide se limpa a falha da região: `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`.
