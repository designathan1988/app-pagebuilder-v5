# EST-L05b-018 × GRE-EST-L05b-018-05 → GRL-EST-L05b-018-01
- **Estado:** EST-L05b-018
- **Escritor:** GRE-EST-L05b-018-05 (useMenuLayer): ENT-L05b-0031, ENT-L05b-0032
- **Leitor:** GRL-EST-L05b-018-01 (carryOut): ENT-L05b-0042, ENT-L05b-0043, ENT-L05b-0044
## Estados deixados por A
A = `useMenuLayer` (`src/editor/doors/menu.tsx:230` `export function useMenuLayer(button: RefObject<HTMLButtonElement | null>, list?: RefObject<HTMLElement | null>, menu?: MenuId,`), que cobre `ENT-L05b-0031` e `ENT-L05b-0032`; as produtoras são dois efeitos que levam o foco ao DOM.

- **V2 o gatilho da camada** — com a camada descartada e o foco solto, o gatilho recebe o foco: `src/editor/doors/menu.tsx:240` `    if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();`.
- **V2 o primeiro item da camada** — com a camada aberta, o primeiro item recebe o foco: `src/editor/doors/menu.tsx:245` `    if (open) list?.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();`.
- **V1 o corpo do documento ou nada ativo** — o valor de que o item parte, tratado pela condição da devolução: `src/editor/doors/menu.tsx:240` `    if (dismissed && (document.activeElement === null || document.activeElement === document.body)) returnFocus.current?.focus();`.
- **Recusa: V1 mantido** — a devolução só age com a camada descartada e o foco no corpo ou em nada (linha 240); a abertura só age com `open` verdadeiro (linha 245); sem a condição o item não é tocado.
- **Intermediário: V1** — os dois efeitos são de `useEffect` (`src/editor/doors/menu.tsx:239` `  useEffect(() => {` e `src/editor/doors/menu.tsx:244` `  useEffect(() => {`), que correm depois da pintura; entre a mudança que os dispara e eles o item ainda é V1.

## Casos
### C1 final
O leitor `carryOut` (`src/editor/focus/focus.ts:184` `function carryOut(store: EditorStore, move: FocusMove, focused: Element | null): void {`) chega depois de o efeito ter terminado e lê o item: recebe-o em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e lê-o de novo na entrada de painel, `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. Com V2 o foco está no gatilho ou no primeiro item da camada, fora da região do painel, e o foco entra no painel; com V1 está no corpo ou em nada. ok

### C2 intermediário
O leitor `carryOut` pode ser chamado por uma nova requisição de foco na janela entre a mudança que dispara o efeito e o efeito de `src/editor/doors/menu.tsx:244` `  useEffect(() => {`; nessa janela o item ainda é V1, e o leitor o lê em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

### C3 em curso
n/a — os efeitos de foco correm de forma síncrona na confirmação da renderização (`src/editor/doors/menu.tsx:245` `    if (open) list?.current?.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();`) e o leitor `carryOut` corre numa publicação da store; nenhum dos dois lê o item enquanto o outro corre.

### C4 desmontagem
O leitor `carryOut` vive na inscrição de foco, que dura enquanto durar o editor, e pode chegar depois de o componente que usa a camada desmontar. Com a desmontagem os dois efeitos deixam de correr (`src/editor/doors/menu.tsx:230` `export function useMenuLayer(button: RefObject<HTMLButtonElement | null>, list?: RefObject<HTMLElement | null>, menu?: MenuId,`); o foco que a camada tinha posto pode ter sido removido com o item, e o leitor lê o valor corrente em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);`. ok

## Resultado
`carryOut` lê EST-L05b-018 em `src/editor/focus/focus.ts:253` `    carryOut(store, request.move, document.activeElement);` e em `src/editor/focus/focus.ts:195` `        if (region && !region.contains(document.activeElement)) focusRegion(region);` e decide se o foco entra na região do painel: quando o item lido não está na região, o foco entra por `focusRegion`.
