# EST-L09b-058 × GRE-EST-L09b-058-01 → GRL-EST-L09b-058-01
- **Estado:** EST-L09b-058
- **Escritor:** GRE-EST-L09b-058-01 (el.scrollTop): ENT-L09b-0064, ENT-L09b-0065
- **Leitor:** GRL-EST-L09b-058-01 (el.scrollTop): ENT-L09b-0058, ENT-L09b-0059, ENT-L09b-0060
## Estados deixados por A
A é o efeito que segue a seleção (`src/editor/shell/sidebar/layers.tsx:538` `useEffect(() => {`) e o `onFocusIn` (`src/editor/shell/sidebar/layers.tsx:497` `const onFocusIn = (event: React.FocusEvent<HTMLDivElement>) => {`), que cobrem ENT-L09b-0064 e ENT-L09b-0065; as linhas que mudam o `scrollTop` do rolador são 509, 510, 544 e 545.

- **V1 no topo** — `src/editor/shell/sidebar/layers.tsx:470` `const el = scroller.current;`; o rolador como o navegador o entrega, no topo.
- **V2 rolado pelo foco** — `src/editor/shell/sidebar/layers.tsx:509` `if (top < el.scrollTop + ROW) el.scrollTop = Math.max(0, top - ROW);` e `src/editor/shell/sidebar/layers.tsx:510` `else if (top + ROW > el.scrollTop + el.clientHeight - ROW) el.scrollTop = top + ROW * 2 - el.clientHeight;`; o foco que entra numa linha move a rolagem para a mostrar.
- **V3 rolado pela seleção** — `src/editor/shell/sidebar/layers.tsx:544` `if (top < el.scrollTop) el.scrollTop = top;` e `src/editor/shell/sidebar/layers.tsx:545` `else if (top + ROW > el.scrollTop + el.clientHeight) el.scrollTop = top + ROW - el.clientHeight;`; a linha primária é trazida à vista.
- **Recusa: a rolagem fica** — `src/editor/shell/sidebar/layers.tsx:505` `if (views.pointerPressing()) return;` (o foco do ponteiro não rola a árvore) e `src/editor/shell/sidebar/layers.tsx:507` `if (el === null || at < 0) return;`; as guardas terminam sem escrever.
- **Intermediário: nenhum** — cada caminho escreve o `scrollTop` de uma vez, sem gesto nem sequência que o deixe num valor parcial.

## Casos
### C1 final
O leitor é o `measure` (ENT-L09b-0058, ENT-L09b-0059 e ENT-L09b-0060). Chegando depois de o foco ou a seleção ter movido o rolador, lê o item em `src/editor/shell/sidebar/layers.tsx:472` `const measure = () => setWindow({ top: el.scrollTop, height: el.clientHeight });`: lê o `scrollTop` que `src/editor/shell/sidebar/layers.tsx:510` `else if (top + ROW > el.scrollTop + el.clientHeight - ROW) el.scrollTop = top + ROW * 2 - el.clientHeight;` deixou. ok

### C2 intermediário
n/a — cada caminho move a rolagem com uma só atribuição em `src/editor/shell/sidebar/layers.tsx:509` `if (top < el.scrollTop + ROW) el.scrollTop = Math.max(0, top - ROW);` ou em `src/editor/shell/sidebar/layers.tsx:544` `if (top < el.scrollTop) el.scrollTop = top;`; não há valor parcial a ler.

### C3 em curso
n/a — o leitor `src/editor/shell/sidebar/layers.tsx:472` `const measure = () => setWindow({ top: el.scrollTop, height: el.clientHeight });` corre como ouvinte de `scroll` e do observador de redimensionamento, depois de o navegador aplicar a rolagem que o escritor deixou.

### C4 desmontagem
n/a — o ouvinte e o observador do leitor são removidos na limpeza do efeito (`src/editor/shell/sidebar/layers.tsx:478` `el.removeEventListener('scroll', measure);`); depois disso o leitor não corre.

## Resultado
O leitor mede a rolagem que o escritor deixou e redesenha a janela da árvore: `src/editor/shell/sidebar/layers.tsx:472` `const measure = () => setWindow({ top: el.scrollTop, height: el.clientHeight });`.
