# EST-L09b-012 × GRE-EST-L09b-012-03 → GRL-EST-L09b-012-01
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-03 (getDerivedStateFromError): ENT-L09b-0018
- **Leitor:** GRL-EST-L09b-012-01 (a inscrição na store): ENT-L09b-0020
## Estados deixados por A
A é o `getDerivedStateFromError` (`src/editor/shell/region-boundary.tsx:39` `static getDerivedStateFromError(): State {`), que cobre ENT-L09b-0018.

- **V2 `failed` verdadeiro** — `src/editor/shell/region-boundary.tsx:40` `return { failed: true };`; um erro de renderização marca a região falhada.
- **Recusa: nenhuma** — a linha 40 devolve sempre o estado falhado; só corre quando um filho lança.

## Casos
### C1 final
O leitor é a inscrição na store (ENT-L09b-0020). Chegando depois de o erro ter marcado a região, ele lê o item em `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`: com V2 (`failed` verdadeiro) a guarda é verdadeira e limpa a falha; com a região sã não grava. ok

### C2 intermediário
n/a — o escritor devolve o estado de uma vez em `src/editor/shell/region-boundary.tsx:40` `return { failed: true };`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o `getDerivedStateFromError` corre durante a renderização e o leitor só o encontra depois, numa publicação seguinte da store (`src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`).

### C4 desmontagem
n/a — a inscrição que o leitor usa é removida na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`); depois dela o leitor não corre.

## Resultado
O leitor decide se limpa a falha da região: `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`.
