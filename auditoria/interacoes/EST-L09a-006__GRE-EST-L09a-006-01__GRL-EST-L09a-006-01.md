# EST-L09a-006 × GRE-EST-L09a-006-01 → GRL-EST-L09a-006-01
- **Estado:** EST-L09a-006
- **Escritor:** GRE-EST-L09a-006-01 (setStart): ENT-L09a-0006
- **Leitor:** GRL-EST-L09a-006-01 (form.get('start')): ENT-L09a-0004
## Estados deixados por A
- **V1 — o primeiro número inicial.** `src/editor/shell/batch-rename.tsx:39` `const [start, setStart] = useState('1');` — o diálogo abre com a numeração a começar em um.
- **V2 — o primeiro número digitado.** `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />` — cada tecla no campo do primeiro número grava em `start` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-006 pelo `setStart`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `start` guarda o texto digitado — `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />`.
- O leitor chega no envio do formulário `ENT-L09a-0004`, lê o valor do campo do primeiro número do próprio formulário: `src/editor/shell/batch-rename.tsx:51` `const typed = String(form.get('start') ?? '').trim();`.
- Com o valor lido, põe nos argumentos o número, ou `NaN` quando o campo está vazio: `src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };`.
- ok — o leitor lê o primeiro número que o escritor deixou e o envia ao tratador do comando.
### C2 intermediário
- n/a — o escritor `setStart` não deixa estado intermediário: `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setStart` corre síncrono no `onChange` `src/editor/shell/batch-rename.tsx:68` `onChange={(event) => setStart(event.target.value)} />`; o leitor corre no envio do formulário, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/batch-rename.tsx:30` `return open && APPLY !== undefined ? <OpenBatchRename apply={APPLY} /> : null;`, e o envio que lê o primeiro número deixa de poder correr; o valor guardado é descartado.
## Resultado
- O leitor lê o primeiro número digitado e o envia ao comando de renomear em lote, ou `NaN` quando o campo está vazio: `src/editor/shell/batch-rename.tsx:51` `const typed = String(form.get('start') ?? '').trim();`.
