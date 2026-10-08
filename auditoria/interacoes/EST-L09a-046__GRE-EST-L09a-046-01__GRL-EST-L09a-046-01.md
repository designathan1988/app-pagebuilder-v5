# EST-L09a-046 × GRE-EST-L09a-046-01 → GRL-EST-L09a-046-01
- **Estado:** EST-L09a-046
- **Escritor:** GRE-EST-L09a-046-01 (setChosenHue): ENT-L09a-0058
- **Leitor:** GRL-EST-L09a-046-01 (leitura de chosenHue): ENT-L09a-0058
## Estados deixados por A

O escritor é o `setChosenHue` do seletor de cor, declarado em `src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);` e chamado pelo controle da matiz em `src/editor/shell/color.tsx:459` `setChosenHue(n);` (fluxo ENT-L09a-0058). Os estados distintos que ele deixa são:

- **V1 o zero** — `src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);`; é o valor da declaração, antes de qualquer arraste.
- **V2 a matiz arrastada** — `src/editor/shell/color.tsx:459` `setChosenHue(n);`; o `onValue` do controle grava o número da matiz que o arraste entrega.
- **Recusa: nenhuma** — a linha 459 grava o número do controle e não tem ramo que recuse.
- **Intermediário: nenhum** — cada `setChosenHue` da linha 459 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor chega na renderização de `Picker` depois de o `setChosenHue` da linha 459 ter gravado. Ele lê o item em `src/editor/shell/color.tsx:369` `const hue = hsb.s > 0 && hsb.v > 0 ? Math.round(hsb.h) : chosenHue;`: com uma cor cinza ou preta usa a matiz escolhida; com uma cor com saturação e brilho, a matiz da própria cor. A matiz lida decide o fundo da área em `src/editor/shell/color.tsx:439` `style={{ '--picker-area': areaBackground(hue) } as CSSProperties}`, o atributo da área em `src/editor/shell/color.tsx:436` `data-hue={hue}` e o valor do controle em `src/editor/shell/color.tsx:453` `value={Math.round(hue)}`. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setChosenHue` de `src/editor/shell/color.tsx:459` `setChosenHue(n);`; o controle entrega um número inteiro a cada alteração e não há gesto nem sequência que deixe a matiz num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `Picker`, que lê a matiz em `src/editor/shell/color.tsx:369` `const hue = hsb.s > 0 && hsb.v > 0 ? Math.round(hsb.h) : chosenHue;`; a escrita da linha 459 corre no `onValue` do controle e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `Picker` (`src/editor/shell/color.tsx:368` `const [chosenHue, setChosenHue] = useState(0);`); desmontar o seletor termina a renderização que o lê, e não há leitura do item depois disso.

## Resultado
O leitor lê EST-L09a-046 em `src/editor/shell/color.tsx:369` `const hue = hsb.s > 0 && hsb.v > 0 ? Math.round(hsb.h) : chosenHue;` e decide a matiz que o seletor mostra quando a cor é cinza ou preta; a matiz lida pinta a área em `src/editor/shell/color.tsx:439` `style={{ '--picker-area': areaBackground(hue) } as CSSProperties}` e o valor do controle em `src/editor/shell/color.tsx:453` `value={Math.round(hue)}`.
