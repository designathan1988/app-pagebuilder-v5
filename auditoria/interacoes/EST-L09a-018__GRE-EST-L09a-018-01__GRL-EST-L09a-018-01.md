# EST-L09a-018 × GRE-EST-L09a-018-01 → GRL-EST-L09a-018-01
- **Estado:** EST-L09a-018
- **Escritor:** GRE-EST-L09a-018-01 (setUrl): ENT-L09a-0020
- **Leitor:** GRL-EST-L09a-018-01 (form.get('url')): ENT-L09a-0019, ENT-L09a-0020
## Estados deixados por A
- **V1 — o endereço vazio inicial.** `src/editor/shell/capture-url.tsx:29` `const [url, setUrl] = useState('');` — o diálogo abre com o campo do endereço vazio.
- **V2 — o endereço digitado.** `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />` — cada tecla no campo do endereço grava em `url` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-018 pelo `setUrl`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `url` guarda o texto digitado — `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />`.
- O leitor chega no envio do formulário `ENT-L09a-0019`, lê o valor do campo do endereço do próprio formulário: `src/editor/shell/capture-url.tsx:35` `const typed = String(form.get('url') ?? '');`.
- ok — o leitor lê o endereço que o escritor deixou e o envia ao tratador do comando.
### C2 intermediário
- n/a — o escritor `setUrl` não deixa estado intermediário: `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setUrl` corre síncrono no `onChange` `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />`; o leitor corre no envio do formulário, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/capture-url.tsx:22` `return open && RUN !== undefined ? <OpenCaptureUrl run={RUN} /> : null;`, e o envio que lê o endereço deixa de poder correr; o endereço guardado é descartado.
## Resultado
- O leitor lê o endereço digitado e o envia ao comando de capturar o endereço: `src/editor/shell/capture-url.tsx:35` `const typed = String(form.get('url') ?? '');`.
