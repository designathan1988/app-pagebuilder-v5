# EST-L05b-018 × GRE-EST-L05b-018-01 → GRL-EST-L05b-018-01
- **Estado:** EST-L05b-018
- **Escritor:** GRE-EST-L05b-018-01 (MenuList): ENT-L05b-0030
- **Leitor:** GRL-EST-L05b-018-01 (carryOut): ENT-L05b-0042, ENT-L05b-0043, ENT-L05b-0044
## Estados deixados por A
A = `MenuList` (`src/editor/doors/menu.tsx:95` `function MenuList({ menu, onDone, focusFirst, anchor, beside }: MenuListProps) {`), que cobre `ENT-L05b-0030`; a produtora é o efeito de foco no primeiro item.

- **V2 o primeiro item de menu da lista** — o efeito de foco leva o foco ao primeiro controle com papel de item de menu: `src/editor/doors/menu.tsx:142` `    if (focusFirst && shown) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();`.
- **V1 o corpo do documento ou nada ativo** — o valor de que o item parte, tratado pelo próprio código como possível: `src/editor/doors/menu.tsx:240` `    if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();`.
- **Recusa: V1 mantido** — o efeito só age quando `focusFirst` é verdadeiro e o menu está mostrado (`src/editor/doors/menu.tsx:140` `  const shown = anchor === undefined || at !== null;`); sem as duas condições o item não é tocado.
- **Intermediário: V1** — o efeito é de `useEffect` (`src/editor/doors/menu.tsx:141` `  useEffect(() => {`), que corre depois da pintura; entre a montagem da lista e o efeito o item ainda é V1.

## Casos
### C1 final
O leitor `carryOut` (`src/editor/focus/focus.ts:184` `function carryOut(store: EditorStore, move: FocusMove, focused: Element | null): void {`) chega depois de o escritor ter terminado e lê o item: recebe-o em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` (a chamada lê `document.activeElement` e entrega-o como `focused`) e lê-o de novo na entrada de painel, `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. Com V2 o foco está no primeiro item do menu, e a região do painel não o contém, então o foco entra no painel; com V1 o foco está no corpo ou em nada. ok

### C2 intermediário
O leitor `carryOut` pode ser chamado por uma nova requisição de foco na janela entre a montagem da lista e o efeito de `src/editor/doors/menu.tsx:141` `  useEffect(() => {`; nessa janela o item ainda é V1, e o leitor o lê em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

### C3 em curso
n/a — o efeito de foco corre de forma síncrona na confirmação da renderização (`src/editor/doors/menu.tsx:142` `    if (focusFirst && shown) list.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();`) e o leitor `carryOut` corre numa publicação da store; nenhum dos dois lê o item enquanto o outro corre.

### C4 desmontagem
O leitor `carryOut` vive na inscrição de foco, que dura enquanto durar o editor, e pode chegar depois de a lista desmontar. `MenuList` desmonta quando a camada fecha (`src/editor/doors/menu.tsx:283` `      {layer.open ? <MenuList menu={menu} onDone={layer.close} focusFirst anchor={button} /> : null}`); o navegador move o foco ao corpo quando o item focado é removido, e o leitor lê esse valor em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

## Resultado
`carryOut` lê EST-L05b-018 em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);` e decide se o foco entra na região do painel: quando o item lido não está na região, o foco entra por `focusRegion`.
