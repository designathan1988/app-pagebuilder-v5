# EST-L05b-017 × GRE-EST-L05b-017-01 → GRL-EST-L05b-017-01
- **Estado:** EST-L05b-017
- **Escritor:** GRE-EST-L05b-017-01 (OpenContextMenu): ENT-L05b-0035
- **Leitor:** GRL-EST-L05b-017-01 (OpenContextMenu): ENT-L05b-0035
## Estados deixados por A
A = `OpenContextMenu` (`src/editor/doors/menu.tsx:304` `function OpenContextMenu() {`), que cobre `ENT-L05b-0035`; a produtora é `setAt`.

- **V1 a posição do último aperto** — o valor da declaração do item, `src/editor/doors/menu.tsx:316` `  const [at, setAt] = useState<Placed>({ left: start.x, top: start.y });`.
- **V2 a posição movida para dentro da janela** — o efeito de layout mede e grava, `src/editor/doors/menu.tsx:322` `    setAt(floatBelow(pointAnchor(start.x, start.y), { width, height: naturalHeight(menu) }, { width: window.innerWidth, height: window.innerHeight }, edge));`.
- **Recusa: nenhuma** — o efeito grava sem ramo que recuse; o único retorno antecipado é a ausência do elemento, `src/editor/doors/menu.tsx:319` `    if (!menu) return;`.
- **Intermediário: nenhum** — o efeito de layout de `src/editor/doors/menu.tsx:317` `  useLayoutEffect(() => {` corre uma vez, de forma síncrona, depois da montagem e antes da pintura; não há gesto nem espera que deixe o item num valor parcial entre uma gravação e a seguinte.

## Casos
### C1 final
O leitor é a própria renderização do menu de contexto. Com o escritor terminado, ela lê o item em `src/editor/doors/menu.tsx:330` `      <div className="menu" role="menu" tabIndex={-1} ref={list} aria-label={t('contextMenu.label')} data-region="context-menu" data-key-context="menu" style={placedStyle(at)}>` (`style={placedStyle(at)}`). Com V2 o menu é desenhado na posição medida e recolhida para dentro da janela. ok

### C2 intermediário
n/a — a escrita é uma só chamada atômica `setAt` de `src/editor/doors/menu.tsx:322` `    setAt(floatBelow(pointAnchor(start.x, start.y), { width, height: naturalHeight(menu) }, { width: window.innerWidth, height: window.innerHeight }, edge));`, dentro do efeito de layout de `src/editor/doors/menu.tsx:317` `  useLayoutEffect(() => {`, que corre uma vez e não cede a outro ator; não há estado parcial do item.

### C3 em curso
n/a — o leitor é a renderização do próprio componente que grava (`src/editor/doors/menu.tsx:330` `      <div className="menu" role="menu" tabIndex={-1} ref={list} aria-label={t('contextMenu.label')} data-region="context-menu" data-key-context="menu" style={placedStyle(at)}>`) e a escrita é a chamada atômica da linha 322, síncrona no efeito de layout; não há assinatura nem `await` que leia o item no meio da escrita.

### C4 desmontagem
n/a — o item é estado do próprio `OpenContextMenu` (`src/editor/doors/menu.tsx:316` `  const [at, setAt] = useState<Placed>({ left: start.x, top: start.y });`), montado por abertura e desmontado com o fecho, `src/editor/doors/menu.tsx:295` `  return opened === null ? null : <OpenContextMenu key={opened.count} />;`; o leitor é a renderização do mesmo componente, então não há leitura depois da desmontagem.

## Resultado
`OpenContextMenu` lê EST-L05b-017 em `src/editor/doors/menu.tsx:330` `      <div className="menu" role="menu" tabIndex={-1} ref={list} aria-label={t('contextMenu.label')} data-region="context-menu" data-key-context="menu" style={placedStyle(at)}>` e desenha o menu de contexto na posição lida; a posição medida da linha 322 substitui a do último aperto da linha 316 antes da pintura.
