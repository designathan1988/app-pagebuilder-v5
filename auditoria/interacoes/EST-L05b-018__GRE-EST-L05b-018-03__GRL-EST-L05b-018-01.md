# EST-L05b-018 × GRE-EST-L05b-018-03 → GRL-EST-L05b-018-01
- **Estado:** EST-L05b-018
- **Escritor:** GRE-EST-L05b-018-03 (focusRegion): ENT-L05b-0040, ENT-L05b-0042, ENT-L05b-0043
- **Leitor:** GRL-EST-L05b-018-01 (carryOut): ENT-L05b-0042, ENT-L05b-0043, ENT-L05b-0044
## Estados deixados por A
A = `focusRegion` (`src/editor/focus/focus.ts:48` `function focusRegion(region: Element): void {`), que cobre `ENT-L05b-0040`, `ENT-L05b-0042` e `ENT-L05b-0043`; a produtora leva o foco ao DOM por quatro caminhos.

- **V2 o palco** — a região é o palco e o foco vai a ele: `src/editor/focus/focus.ts:56` `    stage.focus({ preventScroll: true });`.
- **V2 a linha das Camadas** — a linha que toma a tecla Tab recebe o foco: `src/editor/focus/focus.ts:65` `      row.focus();`.
- **V2 o primeiro controle da região** — o primeiro controle habilitado recebe o foco: `src/editor/focus/focus.ts:77` `    first.focus();`.
- **V2 a própria região** — sem controle, a região recebe o foco: `src/editor/focus/focus.ts:82` `    own.focus();`.
- **Recusa: nenhuma** — `focusRegion` leva o foco a um dos quatro destinos, sem ramo que recuse.
- **Intermediário: V1 nos quadros pendentes** — nos quadros `ENT-L05b-0042` e `ENT-L05b-0043` o foco só entra na região no segundo quadro (`src/editor/focus/focus.ts:188` `      requestAnimationFrame(() => {`); entre o pedido e ele o item ainda é V1.

## Casos
### C1 final
O leitor `carryOut` (`src/editor/focus/focus.ts:184` `function carryOut(store: EditorStore, move: FocusMove, focused: Element | null): void {`) chega depois de `focusRegion` ter terminado e lê o item: recebe-o em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e lê-o de novo na entrada de painel, `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. Com V2 o foco está no controle da região, e uma entrada seguinte de outro painel o encontra fora da sua região. ok

### C2 intermediário
Nos quadros pendentes o foco só entra na região no segundo quadro (`src/editor/focus/focus.ts:188` `      requestAnimationFrame(() => {`); nessa janela o item ainda é V1, e o leitor `carryOut` pode ser chamado por uma nova requisição de foco e lê esse valor em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

### C3 em curso
O leitor `carryOut` recebe o item em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` numa publicação da store; um quadro de `ENT-L05b-0042`/`ENT-L05b-0043` de um pedido anterior pode estar pendente, e o leitor decide sobre o valor que o quadro ainda não mudou, em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

### C4 desmontagem
n/a — `focusRegion` é uma função do módulo (`src/editor/focus/focus.ts:48` `function focusRegion(region: Element): void {`), sem componente próprio que se desmonte; ela age sobre o elemento que desenha a região na altura em que for chamada, e o único componente que ela usa é a região já consultada em `src/editor/focus/focus.ts:56` `    stage.focus({ preventScroll: true });`.

## Resultado
`carryOut` lê EST-L05b-018 em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);` e decide se o foco entra na região do painel: quando o item lido não está na região, o foco entra por `focusRegion`.
