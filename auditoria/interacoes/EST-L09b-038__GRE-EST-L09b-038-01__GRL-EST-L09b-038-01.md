# EST-L09b-038 × GRE-EST-L09b-038-01 → GRL-EST-L09b-038-01
- **Estado:** EST-L09b-038
- **Escritor:** GRE-EST-L09b-038-01 (scrolledTo): ENT-L09b-0064
- **Leitor:** GRL-EST-L09b-038-01 (scrolledTo): ENT-L09b-0064
## Estados deixados por A
A é a marca `scrolledTo` no efeito que segue a seleção (`src/editor/shell/sidebar/layers.tsx:538` `useEffect(() => {`), que cobre ENT-L09b-0064.

- **V1 nulo** — `src/editor/shell/sidebar/layers.tsx:537` `const scrolledTo = useRef<string | null>(null);`; é o valor da declaração, antes de qualquer linha primária ser trazida à vista.
- **V2 o id da linha primária** — `src/editor/shell/sidebar/layers.tsx:542` `scrolledTo.current = primary;`; marca a linha primária como já trazida à vista.
- **Recusa: V1** — `src/editor/shell/sidebar/layers.tsx:541` `if (el === null || at < 0 || scrolledTo.current === primary) return;`; sem rolador, sem linha ou com a linha já trazida, o efeito termina e não marca.
- **Intermediário: nenhum** — a marca é uma só atribuição em `src/editor/shell/sidebar/layers.tsx:542` `scrolledTo.current = primary;`.

## Casos
### C1 final
O leitor e o escritor são o mesmo efeito (ENT-L09b-0064). Numa passagem seguinte do efeito, o leitor lê o valor que a passagem anterior deixou em `src/editor/shell/sidebar/layers.tsx:542` `scrolledTo.current = primary;` por `src/editor/shell/sidebar/layers.tsx:541` `if (el === null || at < 0 || scrolledTo.current === primary) return;`: com V2 igual à seleção, o efeito termina sem rolar de novo; com outra seleção, não. ok

### C2 intermediário
n/a — a marca é uma só atribuição em `src/editor/shell/sidebar/layers.tsx:542` `scrolledTo.current = primary;`; não há gesto nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o efeito da linha 538 é síncrono e o leitor da linha `src/editor/shell/sidebar/layers.tsx:541` `if (el === null || at < 0 || scrolledTo.current === primary) return;` lê a referência antes de a linha 542 a escrever, numa mesma passagem sem concorrência.

### C4 desmontagem
n/a — a marca vive numa referência da seção de Camadas (`src/editor/shell/sidebar/layers.tsx:537` `const scrolledTo = useRef<string | null>(null);`) e é descartada com ela; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide se o efeito rola a árvore até a linha primária: `src/editor/shell/sidebar/layers.tsx:541` `if (el === null || at < 0 || scrolledTo.current === primary) return;`.
