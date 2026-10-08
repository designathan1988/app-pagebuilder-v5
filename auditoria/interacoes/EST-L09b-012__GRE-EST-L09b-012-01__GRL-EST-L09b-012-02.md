# EST-L09b-012 × GRE-EST-L09b-012-01 → GRL-EST-L09b-012-02
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-01 (a inscrição na store): ENT-L09b-0020
- **Leitor:** GRL-EST-L09b-012-02 (componentWillUnmount): ENT-L09b-0021
## Estados deixados por A
A é a inscrição na store (`src/editor/shell/region-boundary.tsx:45` `this.context?.subscribe(() => {`), que cobre ENT-L09b-0020.

- **V1 `failed` falso** — `src/editor/shell/region-boundary.tsx:36` `override state: State = { failed: false };`; é o valor da declaração e o que a linha 46 deixa quando limpa uma falha.
- **Recusa: o valor fica** — `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; com `failed` já falso a guarda não grava e o item fica como estava.
- **Intermediário: `failed` verdadeiro até a renderização seguinte** — `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`; o `setState` só chega à renderização seguinte; na passagem em que a inscrição corre o item ainda é o anterior.

## Casos
### C1 final
O leitor é o `componentWillUnmount` (ENT-L09b-0021). Chegando depois de a inscrição ter terminado, lê o item na sua parte da inscrição em `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`: com a inscrição viva (V3) chama a remoção; com ela nula (V4) nada acontece. ok

### C2 intermediário
n/a — o escritor é uma só guarda e um só `setState` em `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o leitor corre na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`), fora de qualquer passagem em curso da inscrição da linha 45.

### C4 desmontagem
ok — o leitor é exatamente a desmontagem do componente que o escritor usa: ele chega depois de a região deixar de desenhar e lê a inscrição guardada em `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();` para a remover.

## Resultado
O leitor decide se remove a inscrição da store: `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`.
