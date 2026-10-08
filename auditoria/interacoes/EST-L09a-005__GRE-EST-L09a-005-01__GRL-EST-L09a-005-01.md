# EST-L09a-005 × GRE-EST-L09a-005-01 → GRL-EST-L09a-005-01
- **Estado:** EST-L09a-005
- **Escritor:** GRE-EST-L09a-005-01 (setPattern): ENT-L09a-0005
- **Leitor:** GRL-EST-L09a-005-01 (form.get('pattern')): ENT-L09a-0004
## Estados deixados por A
- **V1 — o padrão inicial.** `src/editor/shell/batch-rename.tsx:38` `const [pattern, setPattern] = useState(START_PATTERN);` — o diálogo abre com o padrão que numera cada nome.
- **V2 — o padrão digitado.** `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />` — cada tecla no campo do padrão grava em `pattern` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-005 pelo `setPattern`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `pattern` guarda o texto digitado — `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />`.
- O leitor chega no envio do formulário `ENT-L09a-0004`, lê o valor do campo do padrão do próprio formulário e o põe nos argumentos: `src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };`.
- ok — o leitor lê o padrão que o escritor deixou e o envia ao tratador do comando.
### C2 intermediário
- n/a — o escritor `setPattern` não deixa estado intermediário: `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setPattern` corre síncrono no `onChange` `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />`; o leitor corre no envio do formulário, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/batch-rename.tsx:30` `return open && APPLY !== undefined ? <OpenBatchRename apply={APPLY} /> : null;`, e o envio que lê o padrão deixa de poder correr; o padrão guardado é descartado.
## Resultado
- O leitor lê o padrão digitado e o envia ao comando de renomear em lote: `src/editor/shell/batch-rename.tsx:52` `const args = { ...apply.door.args, pattern: String(form.get('pattern') ?? ''), start: typed === '' ? Number.NaN : Number(typed) };`.
