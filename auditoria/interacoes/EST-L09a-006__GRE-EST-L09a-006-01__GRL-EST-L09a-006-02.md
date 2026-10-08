# EST-L09a-006 × GRE-EST-L09a-006-01 → GRL-EST-L09a-006-02
- **Estado:** EST-L09a-006
- **Escritor:** GRE-EST-L09a-006-01 (setStart): ENT-L09a-0006
- **Leitor:** GRL-EST-L09a-006-02 (leitura de start): ENT-L09a-0005, ENT-L09a-0006
## Estados deixados por A
- **V1 — o primeiro número inicial.** `src/editor/shell/batch-rename.tsx:39` `const [start, setStart] = useState('1');` — o diálogo abre com a numeração a começar em um.
- **V2 — o primeiro número digitado.** `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />` — cada tecla no campo do primeiro número grava em `start` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-006 pelo `setStart`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `start` guarda o texto digitado — `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />`.
- O leitor chega na renderização seguinte e lê o primeiro número para recalcular a prévia: `src/editor/shell/batch-rename.tsx:42` `return batchNames(names === '' ? [] : names.split('\n'), pattern, Number(start)).join(', ');`.
- Um texto que vira `NaN` faz a chamada lançar e a prévia fica vazia: `src/editor/shell/batch-rename.tsx:44` `return '';`.
- ok — o leitor lê o primeiro número que o escritor deixou e a prévia é refeita com ele.
### C2 intermediário
- n/a — o escritor `setStart` não deixa estado intermediário: `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setStart` corre síncrono no `onChange` `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />`; o leitor corre na renderização seguinte, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/batch-rename.tsx:30` `return open && APPLY !== undefined ? <OpenBatchRename apply={APPLY} /> : null;`, e a leitura que recalculava a prévia deixa de correr; o valor guardado é descartado.
## Resultado
- O leitor lê o primeiro número e recalcula a prévia dos nomes, ou a deixa vazia quando o valor não numera: `src/editor/shell/batch-rename.tsx:42` `return batchNames(names === '' ? [] : names.split('\n'), pattern, Number(start)).join(', ');`.
