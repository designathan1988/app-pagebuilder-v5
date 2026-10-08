# EST-L09b-012 × GRE-EST-L09b-012-02 → GRL-EST-L09b-012-01
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-02 (componentDidMount): ENT-L09b-0019
- **Leitor:** GRL-EST-L09b-012-01 (a inscrição na store): ENT-L09b-0020
## Estados deixados por A
A é o `componentDidMount` (`src/editor/shell/region-boundary.tsx:43` `override componentDidMount(): void {`), que cobre ENT-L09b-0019.

- **V3 com a inscrição viva** — `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`; guarda a remoção que a inscrição devolve.
- **V4 com a inscrição nula** — `src/editor/shell/region-boundary.tsx:47` `}) ?? null;`; sem contexto a remoção guardada é nula.
- **Recusa: nenhuma** — a linha 44 guarda o retorno da inscrição ou nulo; não há ramo que recuse.

## Casos
### C1 final
O leitor é a inscrição na store (ENT-L09b-0020). Chegando depois de a montagem ter terminado, lê o item na sua parte falhada em `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`: com a região sã a guarda é falsa; com a região falhada grava falso. ok

### C2 intermediário
n/a — a montagem é uma só atribuição em `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o `componentDidMount` corre de forma síncrona após a montagem (`src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`), antes de qualquer publicação da store que faça a inscrição correr.

### C4 desmontagem
n/a — a inscrição criada pela montagem é removida na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`); depois dela a inscrição não corre.

## Resultado
O leitor decide se limpa a falha da região: `src/editor/shell/region-boundary.tsx:46` `if (this.state.failed) this.setState({ failed: false });`.
