# EST-L09a-013 × GRE-EST-L09a-013-01 → GRL-EST-L09a-013-01
- **Estado:** EST-L09a-013
- **Escritor:** GRE-EST-L09a-013-01 (setCompact): ENT-L09a-0014
- **Leitor:** GRL-EST-L09a-013-01 (compact): ENT-L09a-0014
## Estados deixados por A
- **V1 — as abas inteiras.** `src/editor/shell/canvas.tsx:179` `const [compact, setCompact] = useState(false);` — a linha das abas abre desenhada inteira.
- **V2 — as abas compactas.** `src/editor/shell/canvas.tsx:190` `if (element.scrollWidth > room + 0.5) setCompact(true);` — quando a largura das abas passa o espaço da linha, o efeito marca a linha compacta.
- **V1 — de volta às abas inteiras.** `src/editor/shell/canvas.tsx:193` `setCompact(false);` — quando voltam a caber, o efeito desmarca a linha.
- **Sem estado intermediário.** `src/editor/shell/canvas.tsx:190` `if (element.scrollWidth > room + 0.5) setCompact(true);` e `src/editor/shell/canvas.tsx:193` `setCompact(false);` são instruções síncronas; nenhum gesto, grupo ou sequência escreve EST-L09a-013.
- **Sem estado de recusa.** O efeito não é disparado por comando: corre antes da pintura `src/editor/shell/canvas.tsx:184` `useLayoutEffect(() => {`, sem recusa que o toque.
## Casos
### C1 final
- O escritor já terminou: `compact` guarda `true` ou `false` — `src/editor/shell/canvas.tsx:190` `if (element.scrollWidth > room + 0.5) setCompact(true);`.
- O leitor é a própria linha das abas, que lê `compact` na renderização seguinte: `src/editor/shell/canvas.tsx:188` `if (!compact) {`.
- A marca decide a classe e a largura desenhadas: `src/editor/shell/canvas.tsx:197` `<div ref={row} className={`frame-tabs${compact ? ' is-compact' : ''}`} data-region="canvas-breakpoints" role="tablist" style={{ marginLeft: seen.from, width: compact ? undefined : room }}>`.
- ok — o leitor lê a marca que o escritor deixou e desenha a linha inteira ou compacta.
### C2 intermediário
- n/a — o escritor `setCompact` não deixa estado intermediário: `src/editor/shell/canvas.tsx:190` `if (element.scrollWidth > room + 0.5) setCompact(true);` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setCompact` corre síncrono no efeito de layout `src/editor/shell/canvas.tsx:184` `useLayoutEffect(() => {`; o leitor corre na renderização seguinte, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o componente desmonta, a marca `compact` perde-se com o seu estado `src/editor/shell/canvas.tsx:179` `const [compact, setCompact] = useState(false);`, e a linha que a lê deixa de ser desenhada.
## Resultado
- O leitor lê a marca de compacto e desenha a linha das abas inteira, ou só com o ícone de cada uma quando não cabem: `src/editor/shell/canvas.tsx:197` `<div ref={row} className={`frame-tabs${compact ? ' is-compact' : ''}`} data-region="canvas-breakpoints" role="tablist" style={{ marginLeft: seen.from, width: compact ? undefined : room }}>`.
