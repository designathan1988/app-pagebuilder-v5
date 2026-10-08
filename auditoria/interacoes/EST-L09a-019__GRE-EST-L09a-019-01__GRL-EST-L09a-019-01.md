# EST-L09a-019 × GRE-EST-L09a-019-01 → GRL-EST-L09a-019-01
- **Estado:** EST-L09a-019
- **Escritor:** GRE-EST-L09a-019-01 (setPages): ENT-L09a-0021
- **Leitor:** GRL-EST-L09a-019-01 (form.get('pages')): ENT-L09a-0019, ENT-L09a-0021
## Estados deixados por A
- **V1 — o número de páginas inicial.** `src/editor/shell/capture-url.tsx:30` `const [pages, setPages] = useState('1');` — o diálogo abre com uma página.
- **V2 — o número de páginas digitado.** `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />` — cada tecla no campo do número de páginas grava em `pages` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-019 pelo `setPages`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `pages` guarda o texto digitado — `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />`.
- O leitor chega no envio do formulário `ENT-L09a-0019` e lê o número de páginas do próprio formulário: `src/editor/shell/capture-url.tsx:36` `const count = String(form.get('pages') ?? '').trim();`.
- ok — o leitor lê o número que o escritor deixou e o envia ao tratador do comando.
### C2 intermediário
- n/a — o escritor `setPages` não deixa estado intermediário: `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setPages` corre síncrono no `onChange` `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />`; o leitor corre no envio do formulário, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/capture-url.tsx:22` `return open && RUN !== undefined ? <OpenCaptureUrl run={RUN} /> : null;`, e o envio que lê o número de páginas deixa de poder correr; o valor guardado é descartado.
## Resultado
- O leitor lê o número de páginas digitado e, quando o campo está vazio, envia uma página: `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`.
