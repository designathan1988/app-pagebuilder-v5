# EST-L09a-005 × GRE-EST-L09a-005-01 → GRL-EST-L09a-005-02
- **Estado:** EST-L09a-005
- **Escritor:** GRE-EST-L09a-005-01 (setPattern): ENT-L09a-0005
- **Leitor:** GRL-EST-L09a-005-02 (leitura de pattern): ENT-L09a-0005, ENT-L09a-0006
## Estados deixados por A
- **V1 — o padrão inicial.** `src/editor/shell/batch-rename.tsx:38` `const [pattern, setPattern] = useState(START_PATTERN);` — o diálogo abre com o padrão que numera cada nome.
- **V2 — o padrão digitado.** `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />` — cada tecla no campo do padrão grava em `pattern` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-005 pelo `setPattern`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `pattern` guarda o texto digitado — `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />`.
- O leitor chega na renderização seguinte e lê o padrão para recalcular a prévia dos nomes: `src/editor/shell/batch-rename.tsx:42` `return batchNames(names === '' ? [] : names.split('\n'), pattern, Number(start)).join(', ');`.
- A prévia desenhada sai desse valor: `src/editor/shell/batch-rename.tsx:70` `{preview === '' ? null : <p className="batch-rename__preview">{t('batchRename.preview', { names: preview })}</p>}`.
- ok — o leitor lê o padrão que o escritor deixou e a prévia muda com ele.
### C2 intermediário
- n/a — o escritor `setPattern` não deixa estado intermediário: `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setPattern` corre síncrono no `onChange` `src/editor/shell/batch-rename.tsx:63` `onChange={(event) => setPattern(event.target.value)} />`; o leitor corre na renderização seguinte, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/batch-rename.tsx:30` `return open && APPLY !== undefined ? <OpenBatchRename apply={APPLY} /> : null;`, e a leitura que recalculava a prévia deixa de correr; o padrão guardado é descartado.
## Resultado
- O leitor lê o padrão e recalcula a prévia dos nomes mostrada no diálogo: `src/editor/shell/batch-rename.tsx:42` `return batchNames(names === '' ? [] : names.split('\n'), pattern, Number(start)).join(', ');`.
