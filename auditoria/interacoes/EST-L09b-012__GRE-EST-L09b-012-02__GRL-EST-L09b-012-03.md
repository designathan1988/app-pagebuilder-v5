# EST-L09b-012 × GRE-EST-L09b-012-02 → GRL-EST-L09b-012-03
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-02 (componentDidMount): ENT-L09b-0019
- **Leitor:** GRL-EST-L09b-012-03 (render): ENT-L09b-0018, ENT-L09b-0020
## Estados deixados por A
A é o `componentDidMount` (`src/editor/shell/region-boundary.tsx:43` `override componentDidMount(): void {`), que cobre ENT-L09b-0019.

- **V3 com a inscrição viva** — `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`; guarda a remoção que a inscrição devolve.
- **V4 com a inscrição nula** — `src/editor/shell/region-boundary.tsx:47` `}) ?? null;`; sem contexto a remoção guardada é nula.
- **Recusa: nenhuma** — a linha 44 guarda o retorno da inscrição ou nulo; não há ramo que recuse.

## Casos
### C1 final
O leitor é o `render` (ENT-L09b-0018 e ENT-L09b-0020). Chegando depois de a montagem ter terminado, lê o item em `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`: com a região sã desenha os filhos; com a região falhada desenha o substituto. ok

### C2 intermediário
n/a — a montagem é uma só atribuição em `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o `componentDidMount` corre de forma síncrona após a montagem (`src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`); a renderização do leitor corre antes e depois dela, sem ler durante a atribuição.

### C4 desmontagem
n/a — a inscrição criada pela montagem é removida na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`); depois dela a renderização da região deixa de existir.

## Resultado
O leitor decide o que a região desenha: `src/editor/shell/region-boundary.tsx:60` `return this.state.failed ? <RegionFallback region={this.props.region} /> : this.props.children;`.
