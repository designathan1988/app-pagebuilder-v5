# EST-L09a-014 × GRE-EST-L09a-014-01 → GRL-EST-L09a-014-01
- **Estado:** EST-L09a-014
- **Escritor:** GRE-EST-L09a-014-01 (setSize): ENT-L09a-0015, ENT-L09a-0016
- **Leitor:** GRL-EST-L09a-014-01 (size): ENT-L09a-0018
## Estados deixados por A
- **V1 — o tamanho inicial.** `src/editor/shell/canvas.tsx:250` `const [size, setSize] = useState({ width: 0, height: 0 });` — a coluna abre com largura e altura a zero, antes da primeira medida.
- **V2 — o tamanho medido antes da pintura.** `src/editor/shell/canvas.tsx:263` `setSize({ width, height });` — o efeito da montagem `ENT-L09a-0015` grava a caixa do palco sem o recheio nem a borda.
- **V2 — o tamanho reportado pelo observador.** `src/editor/shell/canvas.tsx:265` `if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });` — a cada redimensionamento do palco, o observador `ENT-L09a-0016` grava a largura e a altura que o navegador reporta.
- **Sem estado intermediário.** `src/editor/shell/canvas.tsx:263` `setSize({ width, height });` e `src/editor/shell/canvas.tsx:265` `if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });` são instruções síncronas; nenhum gesto, grupo ou sequência escreve EST-L09a-014.
- **Sem estado de recusa.** Os dois escritores não são disparados por comando: um corre no efeito de montagem `src/editor/shell/canvas.tsx:256` `useLayoutEffect(() => {` e o outro no observador `src/editor/shell/canvas.tsx:264` `const observer = new ResizeObserver(([entry]) => {`, sem recusa que os toque.
## Casos
### C1 final
- O escritor já terminou: `size` guarda a largura e a altura do palco — `src/editor/shell/canvas.tsx:263` `setSize({ width, height });`.
- O leitor chega na renderização seguinte, no efeito que reporta o zoom `ENT-L09a-0018`, e lê o tamanho: `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);`.
- ok — o leitor lê o tamanho que o escritor deixou e calcula o zoom que encaixa a página no palco.
### C2 intermediário
- ok — o leitor chega com o escritor a meio: entre a criação do observador `src/editor/shell/canvas.tsx:264` `const observer = new ResizeObserver(([entry]) => {` e cada redimensionamento que o dispara, o `size` é o que a última medida deixou, e é ele que o leitor lê em `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);`.
### C3 em curso
- n/a — os dois escritores correm síncronos `src/editor/shell/canvas.tsx:265` `if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });`; o leitor corre na renderização seguinte, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o palco desmonta, o observador é desligado `src/editor/shell/canvas.tsx:268` `return () => observer.disconnect();` e o tamanho guardado perde-se com o estado `src/editor/shell/canvas.tsx:250` `const [size, setSize] = useState({ width: 0, height: 0 });`; o leitor deixa de correr.
## Resultado
- O leitor lê a largura e a altura do palco e calcula o zoom que encaixa a largura da página, reportando-o à shell: `src/editor/shell/canvas.tsx:277` `const zoom = chosen !== undefined ? chosen / 100 : fitZoom(size.width, pageWidth);`.
