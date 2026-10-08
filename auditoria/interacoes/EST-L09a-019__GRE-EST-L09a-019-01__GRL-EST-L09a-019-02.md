# EST-L09a-019 × GRE-EST-L09a-019-01 → GRL-EST-L09a-019-02
- **Estado:** EST-L09a-019
- **Escritor:** GRE-EST-L09a-019-01 (setPages): ENT-L09a-0021
- **Leitor:** GRL-EST-L09a-019-02 (submit): ENT-P-project-0023
## Estados deixados por A
- **V1 — o número de páginas inicial.** `src/editor/shell/capture-url.tsx:30` `const [pages, setPages] = useState('1');` — o diálogo abre com uma página.
- **V2 — o número de páginas digitado.** `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />` — cada tecla no campo do número de páginas grava em `pages` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-019 pelo `setPages`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `pages` guarda o texto digitado — `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />`.
- O leitor `submit` chega no envio do formulário, no caminho da porta `ENT-P-project-0023`, e lê o número de páginas: `src/editor/shell/capture-url.tsx:36` `const count = String(form.get('pages') ?? '').trim();`.
- Com o valor lido, o despacho leva `pages`, ou uma página quando o campo está vazio `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`.
- ok — o leitor lê o número que o escritor deixou e o leva nos argumentos do comando.
### C2 intermediário
- n/a — o escritor `setPages` não deixa estado intermediário: `src/editor/shell/capture-url.tsx:48` `onChange={(event) => setPages(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- ok — o leitor `submit` adia o despacho com `afterGesture` quando um gesto de ponteiro está aberto `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`; o número lido é o que estava no campo no momento do envio, e a digitação que corra no intervalo grava em `pages` sem tocar no `count` já lido.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/capture-url.tsx:22` `return open && RUN !== undefined ? <OpenCaptureUrl run={RUN} /> : null;`, e o envio que lê o número de páginas deixa de poder correr; o valor guardado é descartado.
## Resultado
- O leitor lê o número de páginas digitado e o leva nos argumentos do comando `project.captureUrl`, que envia o pedido de captura: `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`.
