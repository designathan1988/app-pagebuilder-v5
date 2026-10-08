# EST-L09a-001 × GRE-EST-L09a-001-01 → GRL-EST-L09a-001-01
- **Estado:** EST-L09a-001
- **Escritor:** GRE-EST-L09a-001-01 (setQuery): ENT-L09a-0003
- **Leitor:** GRL-EST-L09a-001-01 (leitura de query): ENT-L09a-0003
## Estados deixados por A
- **V1 — a consulta vazia inicial.** `src/editor/shell/asset-picker.tsx:36` `const [query, setQuery] = useState('');` — o seletor abre sem filtro; a lista mostra todos os arquivos.
- **V2 — a consulta digitada.** `src/editor/shell/asset-picker.tsx:71` `onChange={(event) => setQuery(event.target.value)} />` — cada tecla no campo de busca grava em `query` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/asset-picker.tsx:71` `onChange={(event) => setQuery(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-001 pelo `setQuery`.
- **Sem estado de recusa.** A busca é um campo local do seletor `src/editor/shell/asset-picker.tsx:71` `onChange={(event) => setQuery(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `query` guarda o texto digitado — `src/editor/shell/asset-picker.tsx:71` `onChange={(event) => setQuery(event.target.value)} />`.
- O leitor chega na renderização seguinte, dentro do `useMemo`, e lê a consulta: `src/editor/shell/asset-picker.tsx:38` `const wanted = fold(query);`.
- Com a consulta lê a lista de arquivos e filtra por caminho: `src/editor/shell/asset-picker.tsx:39` `return wanted === '' ? files : files.filter((file) => fold(file.path).includes(wanted));`.
- ok — o leitor lê a consulta que o escritor deixou e a usa para filtrar a lista mostrada.
### C2 intermediário
- n/a — o escritor `setQuery` não deixa estado intermediário: `src/editor/shell/asset-picker.tsx:71` `onChange={(event) => setQuery(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setQuery` corre síncrono no `onChange` `src/editor/shell/asset-picker.tsx:71` `onChange={(event) => setQuery(event.target.value)} />`; o leitor corre na renderização seguinte, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o seletor fecha, o componente deixa de ser desenhado `src/editor/shell/asset-picker.tsx:50` `if (open === null || CLOSE === null) return null;`, e o `useMemo` que lê a consulta deixa de correr; a consulta guardada é descartada.
## Resultado
- O leitor lê a consulta e filtra a lista de imagens do projeto por caminho, desenhando só as miniaturas que casam: `src/editor/shell/asset-picker.tsx:39` `return wanted === '' ? files : files.filter((file) => fold(file.path).includes(wanted));`.
