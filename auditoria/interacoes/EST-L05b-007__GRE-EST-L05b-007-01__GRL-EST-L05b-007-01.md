# EST-L05b-007 × GRE-EST-L05b-007-01 → GRL-EST-L05b-007-01
- **Estado:** EST-L05b-007
- **Escritor:** GRE-EST-L05b-007-01 (SubMenu): ENT-L05b-0033
- **Leitor:** GRL-EST-L05b-007-01 (SubMenu): ENT-L05b-0033
## Estados deixados por A
A = `SubMenu` (`src/editor/doors/menu.tsx:166` `function SubMenu({ menu, onDone }: { readonly menu: MenuId; readonly onDone: () => void }) {`), que cobre `ENT-L05b-0033`; a produtora é o `setOpen` do aperto do botão.

- **V1 `false`** — o valor da declaração do item, `src/editor/doors/menu.tsx:167` `  const [open, setOpen] = useState(false);`; é também o valor que o aperto deixa quando o submenu estava aberto, porque `setOpen(!open)` com `open` verdadeiro grava `false` (`src/editor/doors/menu.tsx:172` `      <button ref={item} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} className="menu__item" onClick={() => setOpen(!open)}>`).
- **V2 `true`** — a mesma linha 172 com `open` falso grava `true`: `src/editor/doors/menu.tsx:172` `      <button ref={item} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} className="menu__item" onClick={() => setOpen(!open)}>`.
- **Recusa: nenhuma** — o aperto troca o valor sem condição; o corpo é só `setOpen(!open)` na linha 172, sem ramo que recuse.
- **Intermediário: nenhum** — `setOpen(!open)` é uma só troca de booleano, sem `await`, temporizador, quadro ou ouvinte no corpo.

## Casos
### C1 final
O leitor é a própria renderização de `SubMenu`. Com o escritor terminado, ela lê o item em `src/editor/doors/menu.tsx:172` `      <button ref={item} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} className="menu__item" onClick={() => setOpen(!open)}>` (`aria-expanded={open}`) e na classe do submenu, `src/editor/doors/menu.tsx:171` `menu__sub${open ? ' is-open' : ''}`. Com V2 a classe `is-open` mostra a lista (`src/editor/doors/menu.tsx:177` `      <MenuList menu={menu} onDone={onDone} focusFirst={false} beside={item} />`); com V1 a classe não a mostra. ok

### C2 intermediário
n/a — a única escrita é a troca atômica `setOpen(!open)` do handler de `src/editor/doors/menu.tsx:172` `      <button ref={item} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} className="menu__item" onClick={() => setOpen(!open)}>`; não há gesto, rajada nem sequência que deixe o item num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio componente e a escrita é a troca atômica do handler de `src/editor/doors/menu.tsx:172` `      <button ref={item} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} className="menu__item" onClick={() => setOpen(!open)}>`; não há assinatura de store que observe este item, e o handler corre até o fim sem ceder a outro ator no meio.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo componente: `SubMenu` desmonta quando o menu que o contém fecha (`src/editor/doors/menu.tsx:160` `          slot.kind === 'door' ? <MenuItem key={slot.entry.ref} entry={slot.entry} onDone={onDone} keysIn="canvas" /> : <SubMenu key={slot.menu} menu={slot.menu} onDone={onDone} />,`), e com ele a renderização que lê o item; não há leitura depois da desmontagem.

## Resultado
O leitor lê EST-L05b-007 em `src/editor/doors/menu.tsx:172` `      <button ref={item} type="button" role="menuitem" aria-haspopup="menu" aria-expanded={open} className="menu__item" onClick={() => setOpen(!open)}>` e decide a classe do submenu em `src/editor/doors/menu.tsx:171` `menu__sub${open ? ' is-open' : ''}`: a classe `is-open` mostra a lista, e a sua ausência a esconde.
