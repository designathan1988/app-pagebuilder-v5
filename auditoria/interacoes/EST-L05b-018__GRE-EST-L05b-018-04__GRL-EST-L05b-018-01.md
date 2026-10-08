# EST-L05b-018 × GRE-EST-L05b-018-04 → GRL-EST-L05b-018-01
- **Estado:** EST-L05b-018
- **Escritor:** GRE-EST-L05b-018-04 (menuBarMove): ENT-L05b-0041
- **Leitor:** GRL-EST-L05b-018-01 (carryOut): ENT-L05b-0042, ENT-L05b-0043, ENT-L05b-0044
## Estados deixados por A
A = `menuBarMove` (`src/editor/focus/focus.ts:107` `function menuBarMove(move: 'menuBar' | 'nextMenu' | 'previousMenu', focused: Element | null): void {`), que cobre `ENT-L05b-0041`; a produtora é o quadro que leva o foco ao primeiro item do submenu.

- **V2 o primeiro item do submenu** — no quadro seguinte o foco vai ao primeiro item do submenu aberto: `src/editor/focus/focus.ts:119` `    requestAnimationFrame(() => sub.querySelector<HTMLElement>(':scope > .menu [role^="menuitem"]')?.focus());`.
- **V1 o corpo do documento ou nada ativo** — o valor de que o item parte, tratado pelo próprio código como possível: `src/editor/doors/menu.tsx:240` `    if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();`.
- **Recusa: V1 mantido** — o quadro só é pedido quando o movimento é `nextMenu`, o item abre um submenu e o submenu do item existe: `src/editor/focus/focus.ts:117` `  if (move === 'nextMenu' && item?.getAttribute('aria-haspopup') === 'menu' && sub !== null && sub !== undefined) {`; fora disso o item não é tocado.
- **Intermediário: V1** — o foco só é levado no quadro seguinte (`src/editor/focus/focus.ts:119` `    requestAnimationFrame(() => sub.querySelector<HTMLElement>(':scope > .menu [role^="menuitem"]')?.focus());`); entre o pedido e o quadro o item ainda é V1.

## Casos
### C1 final
O leitor `carryOut` (`src/editor/focus/focus.ts:184` `function carryOut(store: EditorStore, move: FocusMove, focused: Element | null): void {`) chega depois de o quadro ter corrido e lê o item: recebe-o em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e lê-o de novo na entrada de painel, `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. Com V2 o foco está no primeiro item do submenu, fora da região do painel, e o foco entra no painel; com V1 está no corpo ou em nada. ok

### C2 intermediário
O leitor `carryOut` pode ser chamado por uma nova requisição de foco na janela entre o pedido do quadro e o quadro de `src/editor/focus/focus.ts:119` `    requestAnimationFrame(() => sub.querySelector<HTMLElement>(':scope > .menu [role^="menuitem"]')?.focus());`; nessa janela o item ainda é V1, e o leitor o lê em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

### C3 em curso
n/a — `menuBarMove` é chamada de dentro de `carryOut` (`src/editor/focus/focus.ts:204` `  if (move === 'menuBar' || move === 'nextMenu' || move === 'previousMenu') {`) e o quadro que ela pede corre num quadro seguinte; o leitor `carryOut` só volta a ler o item numa publicação posterior da store, em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);`, não durante a corrida do quadro.

### C4 desmontagem
n/a — `menuBarMove` é uma função do módulo (`src/editor/focus/focus.ts:107` `function menuBarMove(move: 'menuBar' | 'nextMenu' | 'previousMenu', focused: Element | null): void {`), sem componente próprio que se desmonte; o quadro só é pedido quando o submenu já existe, em `src/editor/focus/focus.ts:119` `    requestAnimationFrame(() => sub.querySelector<HTMLElement>(':scope > .menu [role^="menuitem"]')?.focus());`.

## Resultado
`carryOut` lê EST-L05b-018 em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);` e decide se o foco entra na região do painel: quando o item lido não está na região, o foco entra por `focusRegion`.
