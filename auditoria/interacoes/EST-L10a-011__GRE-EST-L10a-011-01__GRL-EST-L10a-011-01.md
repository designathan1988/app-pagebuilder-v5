# EST-L10a-011 × GRE-EST-L10a-011-01 → GRL-EST-L10a-011-01
- **Estado:** EST-L10a-011
- **Escritor:** GRE-EST-L10a-011-01 (o efeito de medição): ENT-L10a-0003
- **Leitor:** GRL-EST-L10a-011-01 (box): ENT-L10a-0004
## Estados deixados por A
A é o efeito de medição (`src/modules/layout-composer/ui/overlay.tsx:89` `useEffect(() => {`), que cobre ENT-L10a-0003; a linha que produz o valor novo de EST-L10a-011 é `src/modules/layout-composer/ui/overlay.tsx:86`.

- **V1 nulo** — `src/modules/layout-composer/ui/overlay.tsx:68` `const [box, setBox] = useState<Box | null>(null);`; é o valor da declaração, antes da primeira medição.
- **V2 a caixa medida** — `src/modules/layout-composer/ui/overlay.tsx:97` `setBox((before) => (before !== null && next !== null && same(before, next) ? before : next));`; a caixa do contêiner composto em px da camada.
- **V3 a caixa anterior mantida** — `src/modules/layout-composer/ui/overlay.tsx:97` `setBox((before) => (before !== null && next !== null && same(before, next) ? before : next));`; uma medida igual à anterior mantém a referência (por `same`).
- **Recusa: nulo** — `src/modules/layout-composer/ui/overlay.tsx:95` `const found = frame === null || origin === undefined ? null : nodeBox(frame, composer.target as NodeId);`; sem moldura ou sem origem `next` é nulo e a linha 86 grava nulo.
- **Intermediário: nulo até o primeiro quadro** — `src/modules/layout-composer/ui/overlay.tsx:109` `request = requestAnimationFrame(measure);`; a caixa só é medida quando o quadro corre.

## Casos
### C1 final
O leitor é o `box` (ENT-L10a-0004). Chegando depois de o quadro ter medido, ele lê o item em `src/modules/layout-composer/ui/overlay.tsx:117` `const placed = box !== null;`: com V2 ou V3 `placed` é verdadeiro; com V1 ou com a recusa é falso. ok

### C2 intermediário
A medição corre num quadro (`src/modules/layout-composer/ui/overlay.tsx:109` `request = requestAnimationFrame(measure);`) e o `setBox` de `src/modules/layout-composer/ui/overlay.tsx:97` `setBox((before) => (before !== null && next !== null && same(before, next) ? before : next));` só chega à renderização seguinte; nessa passagem o leitor lê V1 em `src/modules/layout-composer/ui/overlay.tsx:117` `const placed = box !== null;`. ok

### C3 em curso
n/a — o item é estado de componente do `LayoutOverlay` (`src/modules/layout-composer/ui/overlay.tsx:68` `const [box, setBox] = useState<Box | null>(null);`); o leitor corre na renderização do componente, que lê o valor já fixado para aquela passagem.

### C4 desmontagem
n/a — o item vive no estado de `LayoutOverlay` (`src/modules/layout-composer/ui/overlay.tsx:68` `const [box, setBox] = useState<Box | null>(null);`) e é descartado com ele; nenhum leitor do item corre depois disso.

## Resultado
O leitor decide se a caixa do alvo já foi medida: `src/modules/layout-composer/ui/overlay.tsx:117` `const placed = box !== null;`.
