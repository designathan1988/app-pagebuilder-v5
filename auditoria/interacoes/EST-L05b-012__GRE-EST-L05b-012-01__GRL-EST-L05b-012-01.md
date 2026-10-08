# EST-L05b-012 × GRE-EST-L05b-012-01 → GRL-EST-L05b-012-01
- **Estado:** EST-L05b-012
- **Escritor:** GRE-EST-L05b-012-01 (useMenuLayer): ENT-L05b-0034
- **Leitor:** GRL-EST-L05b-012-01 (useMenuLayer): ENT-L05b-0031, ENT-L05b-0032, ENT-L05b-0034
## Estados deixados por A
A = `useMenuLayer` (`src/editor/doors/menu.tsx:230` `export function useMenuLayer(button: RefObject<HTMLButtonElement | null>, list?: RefObject<HTMLElement | null>, menu?: MenuId,`), que cobre `ENT-L05b-0034`; a produtora é `setOpenedAt`.

- **V1 `null`** — o valor da declaração do item, `src/editor/doors/menu.tsx:235` `  const [openedAt, setOpenedAt] = useState<number | null>(null);`; é também o que `close` deixa, `src/editor/doors/menu.tsx:247` `  const close = grouped ? group.close : () => setOpenedAt(null);`.
- **V2 o número de descartes da abertura** — o `toggle` grava o número de descartes corrente quando a camada abre, `src/editor/doors/menu.tsx:255` `    toggle: grouped ? () => group.toggle(menu) : () => setOpenedAt(open ? null : dismissals),`; quando a camada estava aberta, o mesmo `toggle` grava `null` (V1).
- **Recusa: nenhuma** — `close` e `toggle` gravam sem ramo que recuse; não há mensagem de recusa.
- **Intermediário: nenhum** — `setOpenedAt` é uma só chamada atômica em cada ramo.

## Casos
### C1 final
O leitor `useMenuLayer` lê o item na sua própria renderização, `src/editor/doors/menu.tsx:236` `  const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;`. Com V2 e o número de descartes ainda o da abertura, `open` é verdadeiro e o botão mostra-se aberto em `src/editor/doors/menu.tsx:274` `        aria-expanded={layer.open}`; com V1 `open` é falso. `dismissed` decorre do mesmo, `src/editor/doors/menu.tsx:237` `  const dismissed = grouped ? group.dismissed === menu : openedAt !== null && !open;`. ok

### C2 intermediário
n/a — a única escrita é a chamada atômica `setOpenedAt` de `src/editor/doors/menu.tsx:255` `    toggle: grouped ? () => group.toggle(menu) : () => setOpenedAt(open ? null : dismissals),` (e `close` de `src/editor/doors/menu.tsx:247` `  const close = grouped ? group.close : () => setOpenedAt(null);`); não há gesto, rajada nem sequência que deixe `openedAt` num valor parcial.

### C3 em curso
n/a — o leitor é a própria renderização do componente que usa a camada (`src/editor/doors/menu.tsx:236` `  const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;`); a escrita da linha 255 corre no handler síncrono do aperto, e a assinatura da store que a camada tem lê outro item, o número de descartes corrente (`src/editor/doors/menu.tsx:234` `  const dismissals = useEditorState((s) => s.ui.overlays.dismissals);`), não `openedAt`.

### C4 desmontagem
n/a — `openedAt` é estado do próprio hook `src/editor/doors/menu.tsx:235` `  const [openedAt, setOpenedAt] = useState<number | null>(null);`; o leitor é a renderização do mesmo componente, e a desmontagem termina ambos, sem leitura de `openedAt` depois de o componente desmontar.

## Resultado
`useMenuLayer` lê EST-L05b-012 em `src/editor/doors/menu.tsx:236` `  const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;` e decide o `open` da camada; o botão segue esse `open` em `src/editor/doors/menu.tsx:274` `        aria-expanded={layer.open}` e a lista é desenhada quando ele é verdadeiro `src/editor/doors/menu.tsx:283` `      {layer.open ? <MenuList menu={menu} onDone={layer.close} focusFirst anchor={button} /> : null}`.
