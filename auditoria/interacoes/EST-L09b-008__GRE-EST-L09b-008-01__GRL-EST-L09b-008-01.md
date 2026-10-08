# EST-L09b-008 × GRE-EST-L09b-008-01 → GRL-EST-L09b-008-01
- **Estado:** EST-L09b-008
- **Escritor:** GRE-EST-L09b-008-01 (a renderização do form): ENT-L09b-0012
- **Leitor:** GRL-EST-L09b-008-01 (o layout effect da colocação): ENT-L09b-0010
## Estados deixados por A
O item é a ref `own` da camada (`src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);`), o elemento da camada (o form ou o div). O único membro do GRE- é a renderização do form (ENT-L09b-0012).

- **V1 nulo.** `src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);` — antes de a camada montar.
- **V2 a camada montada.** `src/editor/shell/popover.tsx:87` `ref={own as RefObject<HTMLFormElement | null>}` (o formulário) e `src/editor/shell/popover.tsx:91` `ref={own as RefObject<HTMLDivElement | null>}` (o div); a renderização preenche a ref com o elemento.
- **Intermediário: inexistente.** a atribuição é feita pelo React no commit (`src/editor/shell/popover.tsx:87` `ref={own as RefObject<HTMLFormElement | null>}`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** a renderização não julga valor (`src/editor/shell/popover.tsx:87` `ref={own as RefObject<HTMLFormElement | null>}`).
- **Desmontagem: V1 de novo.** ao desmontar a camada o React devolve a ref a nulo (`src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);`).

## Casos
### C1 final
O escritor já terminou: a camada montada deixou `src/editor/shell/popover.tsx:87` `ref={own as RefObject<HTMLFormElement | null>}` com o elemento. O leitor `o layout effect da colocação` (ENT-L09b-0010) lê a ref em `src/editor/shell/popover.tsx:67` `const panel = own.current;`: com a camada montada, `panel` é o elemento, e a posição é medida em `src/editor/shell/popover.tsx:73` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge, space));`. ok — `src/editor/shell/popover.tsx:67` `const panel = own.current;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: a atribuição é uma passada do React no commit (`src/editor/shell/popover.tsx:87` `ref={own as RefObject<HTMLFormElement | null>}`); não há meio de gesto, de grupo nem de sequência.

### C3 em curso
n/a — o leitor lê a ref num layout effect próprio (`src/editor/shell/popover.tsx:67` `const panel = own.current;`), que corre depois do commit; não há ponto em que leia a ref a meio de uma atribuição.

### C4 desmontagem
n/a — a ref e o leitor vivem na mesma componente (`src/editor/shell/popover.tsx:62` `const own = useRef<HTMLElement | null>(null);`); desmontada a camada, o React devolve a ref a nulo e o layout effect não corre de novo.

## Resultado
O leitor mede e coloca a camada sob o seu gatilho: `src/editor/shell/popover.tsx:67` `const panel = own.current;` — com a camada montada, `panel` é o elemento de que a colocação parte.
