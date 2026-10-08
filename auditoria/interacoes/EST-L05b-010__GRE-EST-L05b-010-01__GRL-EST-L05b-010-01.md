# EST-L05b-010 × GRE-EST-L05b-010-01 → GRL-EST-L05b-010-01
- **Estado:** EST-L05b-010
- **Escritor:** GRE-EST-L05b-010-01 (MenuGroup): ENT-L05b-0034
- **Leitor:** GRL-EST-L05b-010-01 (useMenuLayer): ENT-L05b-0031, ENT-L05b-0032
## Estados deixados por A
A = `MenuGroup` (`src/editor/doors/menu.tsx:209` `export function MenuGroup({ children }: { readonly children: ReactNode }) {`), que cobre `ENT-L05b-0034`; a produtora é `setOpened`.

- **V1 `null`** — o valor da declaração do item, `src/editor/doors/menu.tsx:213` `  const [opened, setOpened] = useState<{ readonly menu: MenuId; readonly at: number; readonly hovered?: boolean } | null>(null);`; é também o que o `toggle` deixa quando o menu que ele abriu é apertado de novo, pelo ramo `current.hovered === true ? { menu, at: dismissals } : null` de `src/editor/doors/menu.tsx:217` `    setOpened((current) => (current?.menu === menu && current.at === dismissals ? (current.hovered === true ? { menu, at: dismissals } : null) : { menu, at: dismissals }));`.
- **V2 o menu aberto** — a mesma linha 217 grava `{ menu, at: dismissals }` quando o menu não estava aberto: `src/editor/doors/menu.tsx:217` `    setOpened((current) => (current?.menu === menu && current.at === dismissals ? (current.hovered === true ? { menu, at: dismissals } : null) : { menu, at: dismissals }));`.
- **V2 aberto com a marca do ponteiro** — a atualização de renderização grava o menu apontado com `hovered: true`, `src/editor/doors/menu.tsx:225` `    if (active !== null && over !== null && over !== active) setOpened({ menu: over as MenuId, at: dismissals, hovered: true });`.
- **Recusa: nenhuma** — `toggle` e a atualização do ponteiro gravam sem ramo que recuse; a linha 217 só escolhe entre `null` e o objeto.
- **Intermediário: nenhum** — `setOpened` é uma só chamada atômica em cada ramo.

## Casos
### C1 final
O leitor `useMenuLayer` chega com o grupo já terminado e lê o item pelo contexto: `src/editor/doors/menu.tsx:236` `  const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;` (lê `group.active`) e `src/editor/doors/menu.tsx:237` `  const dismissed = grouped ? group.dismissed === menu : openedAt !== null && !open;` (lê `group.dismissed`). `active` e `dismissed` derivam de `opened` em `src/editor/doors/menu.tsx:214` `  const active = opened !== null && opened.at === dismissals ? opened.menu : null;` e `src/editor/doors/menu.tsx:215` `  const dismissed = opened !== null && opened.at !== dismissals ? opened.menu : null;`, entregues no contexto em `src/editor/doors/menu.tsx:227` `  return <MenuGroupContext.Provider value={{ active, dismissed, toggle, close: () => setOpened(null) }}>{children}</MenuGroupContext.Provider>;`. Com V2 a camada do menu lê `active` igual ao seu menu e `open` é verdadeiro; com V1 `open` é falso. ok

### C2 intermediário
n/a — a única escrita é a chamada atômica `setOpened` de `src/editor/doors/menu.tsx:217` `    setOpened((current) => (current?.menu === menu && current.at === dismissals ? (current.hovered === true ? { menu, at: dismissals } : null) : { menu, at: dismissals }));`; não há gesto, rajada nem sequência que deixe `opened` num valor parcial.

### C3 em curso
n/a — o leitor `useMenuLayer` lê o item na sua própria renderização, a partir do contexto (`src/editor/doors/menu.tsx:236` `  const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;`); a escrita de `MenuGroup` é a chamada atômica da linha 217, e não há `await` nem caminho que leia o item no meio dessa escrita.

### C4 desmontagem
n/a — o leitor lê EST-L05b-010 pelo contexto do grupo (`src/editor/doors/menu.tsx:227` `  return <MenuGroupContext.Provider value={{ active, dismissed, toggle, close: () => setOpened(null) }}>{children}</MenuGroupContext.Provider>;`); quando `MenuGroup` desmonta, os leitores desmontam com ele, e não há leitura depois.

## Resultado
`useMenuLayer` lê EST-L05b-010 em `src/editor/doors/menu.tsx:236` `  const open = grouped ? group.active === menu : openedAt !== null && openedAt === dismissals;` e `src/editor/doors/menu.tsx:237` `  const dismissed = grouped ? group.dismissed === menu : openedAt !== null && !open;` e decide o `open` da camada; o botão segue esse `open` em `src/editor/doors/menu.tsx:274` `        aria-expanded={layer.open}` e a lista é desenhada quando ele é verdadeiro `src/editor/doors/menu.tsx:283` `      {layer.open ? <MenuList menu={menu} onDone={layer.close} focusFirst anchor={button} /> : null}`.
