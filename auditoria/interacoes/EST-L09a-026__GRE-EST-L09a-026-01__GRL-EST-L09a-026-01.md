# EST-L09a-026 × GRE-EST-L09a-026-01 → GRL-EST-L09a-026-01
- **Estado:** EST-L09a-026
- **Escritor:** GRE-EST-L09a-026-01 (setSearch): ENT-L09a-0030
- **Leitor:** GRL-EST-L09a-026-01 (leitura de search): ENT-L09a-0030
## Estados deixados por A

O escritor é o `setSearch` do campo de busca do inspector da captura, declarado em `src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');` e chamado pelo campo em `src/editor/shell/captured-inspector.tsx:114` `onChange={(event) => setSearch(event.currentTarget.value)}` (fluxo ENT-L09a-0030). Os estados distintos que ele deixa são:

- **V1 o texto vazio** — `src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');`; é o valor da declaração, e o estado em que a lista mostra as primeiras linhas do corpo.
- **V2 o texto digitado** — `src/editor/shell/captured-inspector.tsx:114` `onChange={(event) => setSearch(event.currentTarget.value)}`; cada alteração do campo grava o valor dele no estado, inteiro.
- **Recusa: nenhuma** — a linha 114 grava sem ramo que recuse; o campo de busca é livre.
- **Intermediário: nenhum** — cada `setSearch` da linha 114 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor é a própria renderização de `CapturedInspector`. Com o escritor terminado, ele lê o item em `src/editor/shell/captured-inspector.tsx:104` `const visible = search.trim() === '' ?` e escolhe as linhas: com V1 as primeiras 200 dentro do corpo, com V2 as cujo rótulo contém o texto, em `src/editor/shell/captured-inspector.tsx:104` `rows.filter((one) => one.label.toLowerCase().includes(search.toLowerCase())).slice(0, 200)`. A lista desenhada segue o resultado, em `src/editor/shell/captured-inspector.tsx:115` `{visible.map((row) => <CapturedRow key={row.node.id} row={row} selected={row.node.id === selected} />)}`. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setSearch` de `src/editor/shell/captured-inspector.tsx:114` `onChange={(event) => setSearch(event.currentTarget.value)}`; o campo grava o texto inteiro a cada alteração e não há gesto nem sequência que deixe a busca num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedInspector`, que lê a busca em `src/editor/shell/captured-inspector.tsx:104` `const visible = search.trim() === '' ?`; a escrita da linha 114 corre no tratador do evento e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedInspector` (`src/editor/shell/captured-inspector.tsx:100` `const [search, setSearch] = useState('');`); desmontar o inspector termina a renderização que o lê, e não há leitura do item depois disso.

## Resultado
O leitor lê EST-L09a-026 em `src/editor/shell/captured-inspector.tsx:104` `const visible = search.trim() === '' ?` e decide as linhas que a lista mostra; a lista é desenhada com o resultado em `src/editor/shell/captured-inspector.tsx:115` `{visible.map((row) => <CapturedRow key={row.node.id} row={row} selected={row.node.id === selected} />)}`.
