# EST-L09b-009 × GRE-EST-L09b-009-01 → GRL-EST-L09b-009-01
- **Estado:** EST-L09b-009
- **Escritor:** GRE-EST-L09b-009-01 (o layout effect da colocação): ENT-L09b-0010
- **Leitor:** GRL-EST-L09b-009-01 (Popover): ENT-L09b-0010, ENT-L09b-0011
## Estados deixados por A
A é o layout effect da colocação (`src/editor/shell/popover.tsx:65` `useLayoutEffect(() => {`), que cobre ENT-L09b-0010; a linha que produz o valor novo de EST-L09b-009 é a chamada de `setAt` em `src/editor/shell/popover.tsx:73`.

- **V1 nulo** — `src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);`; é o valor da declaração, antes de a camada ser medida; com ele a camada é desenhada invisível.
- **V2 a posição** — `src/editor/shell/popover.tsx:73` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge, space));`; a posição colocada sob o gatilho, dentro da janela.
- **Recusa: V1** — `src/editor/shell/popover.tsx:68` `if (!from || !panel) return;`; sem a caixa do gatilho ou sem a camada, o efeito termina e não grava posição.
- **Intermediário: V1 na renderização em curso** — a posição de `src/editor/shell/popover.tsx:73` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge, space));` só chega à renderização seguinte; na passagem em que o efeito corre o item ainda é V1.
- **Desmontagem: o item é descartado** — `src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);`; a posição vive no estado do `Popover` e some com a camada.

## Casos
### C1 final
O leitor é a renderização do `Popover` (ENT-L09b-0010 e ENT-L09b-0011). Chegando depois de o efeito ter terminado, lê o item em `src/editor/shell/popover.tsx:76` `const placed = at !== null;`: com V2 `placed` é verdadeiro; com V1 ou com a recusa é falso. ok

### C2 intermediário
Na passagem em que o efeito escreve em `src/editor/shell/popover.tsx:73` `setAt(floatBelow(from, { width, height }, { width: window.innerWidth, height: window.innerHeight }, edge, space));`, a posição ainda não chegou à renderização; nessa passagem o leitor lê V1 em `src/editor/shell/popover.tsx:76` `const placed = at !== null;`. ok

### C3 em curso
n/a — o item é estado de componente do `Popover` (`src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);`); o leitor é a renderização do próprio componente e não há assinatura de store sobre o item.

### C4 desmontagem
n/a — a posição vive no estado do `Popover` (`src/editor/shell/popover.tsx:64` `const [at, setAt] = useState<Placed | null>(null);`) e é descartada com ele; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide se a camada está colocada: `src/editor/shell/popover.tsx:76` `const placed = at !== null;`.
