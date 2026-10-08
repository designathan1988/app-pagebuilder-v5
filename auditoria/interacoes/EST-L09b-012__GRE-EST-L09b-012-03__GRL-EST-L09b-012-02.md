# EST-L09b-012 × GRE-EST-L09b-012-03 → GRL-EST-L09b-012-02
- **Estado:** EST-L09b-012
- **Escritor:** GRE-EST-L09b-012-03 (getDerivedStateFromError): ENT-L09b-0018
- **Leitor:** GRL-EST-L09b-012-02 (componentWillUnmount): ENT-L09b-0021
## Estados deixados por A
A é o `getDerivedStateFromError` (`src/editor/shell/region-boundary.tsx:39` `static getDerivedStateFromError(): State {`), que cobre ENT-L09b-0018.

- **V2 `failed` verdadeiro** — `src/editor/shell/region-boundary.tsx:40` `return { failed: true };`; um erro de renderização marca a região falhada.
- **Recusa: nenhuma** — a linha 40 devolve sempre o estado falhado; só corre quando um filho lança.

## Casos
### C1 final
O leitor é o `componentWillUnmount` (ENT-L09b-0021). Chegando depois de o erro ter marcado a região, ele lê o item na sua parte da inscrição em `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`: com a inscrição viva chama a remoção. ok

### C2 intermediário
n/a — o escritor devolve o estado de uma vez em `src/editor/shell/region-boundary.tsx:40` `return { failed: true };`, sem gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o leitor corre na desmontagem (`src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`), fora da renderização em que o erro foi apanhado.

### C4 desmontagem
ok — o leitor é exatamente a desmontagem do componente que desenha a região: lê a inscrição guardada em `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();` para a remover, depois de a região falhada ter deixado de desenhar.

## Resultado
O leitor decide se remove a inscrição da store: `src/editor/shell/region-boundary.tsx:51` `this.unsubscribe?.();`.
