# EST-L09b-012 × GRE-EST-L09b-012-02 → GRL-EST-L09b-012-02
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-02 (componentDidMount): ENT-L09b-0019
- **Leitor:** GRL-EST-L09b-012-02 (componentWillUnmount): ENT-L09b-0021
## Estados deixados por A
A é o `componentDidMount` (`src/editor/shell/region-boundary.tsx:43` `override componentDidMount(): void {`), que cobre ENT-L09b-0019.

- **V3 com a inscrição viva** — `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`; guarda a remoção que a inscrição devolve.
- **V4 com a inscrição nula** — `src/editor/shell/region-boundary.tsx:47` `}) ?? null;`; sem contexto a remoção guardada é nula.
- **Recusa: nenhuma** — a linha 44 guarda o retorno da inscrição ou nulo; não há ramo que recuse.

## Casos
### C1 final
O leitor é o `componentWillUnmount` (ENT-L09b-0021). Chegando depois de a montagem ter terminado, lê o item em `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`: com a inscrição viva (V3) chama a remoção; com ela nula (V4) nada acontece. ok

### C2 intermediário
n/a — a montagem é uma só atribuição em `src/editor/shell/region-boundary.tsx:44` `this.unsubscribe =`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o leitor corre na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`), muito depois de a montagem da linha 44 ter terminado.

### C4 desmontagem
ok — o leitor é exatamente a desmontagem do componente que a montagem prepara: lê a inscrição guardada em `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();` para a remover.

## Resultado
O leitor decide se remove a inscrição da store: `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`.
