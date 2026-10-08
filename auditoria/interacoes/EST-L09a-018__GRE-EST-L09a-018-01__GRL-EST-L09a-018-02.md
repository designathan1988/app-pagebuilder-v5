# EST-L09a-018 × GRE-EST-L09a-018-01 → GRL-EST-L09a-018-02
- **Estado:** EST-L09a-018
- **Escritor:** GRE-EST-L09a-018-01 (setUrl): ENT-L09a-0020
- **Leitor:** GRL-EST-L09a-018-02 (submit): ENT-P-project-0023
## Estados deixados por A
- **V1 — o endereço vazio inicial.** `src/editor/shell/capture-url.tsx:29` `const [url, setUrl] = useState('');` — o diálogo abre com o campo do endereço vazio.
- **V2 — o endereço digitado.** `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />` — cada tecla no campo do endereço grava em `url` o texto digitado.
- **Sem estado intermediário.** `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-018 pelo `setUrl`.
- **Sem estado de recusa.** A digitação é um campo local do diálogo `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `url` guarda o texto digitado — `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />`.
- O leitor `submit` chega no envio do formulário `ENT-L09a-0019`, no caminho da porta `ENT-P-project-0023`, e lê o endereço: `src/editor/shell/capture-url.tsx:35` `const typed = String(form.get('url') ?? '');`.
- Com o valor lido, o despacho do comando leva `url` como argumento `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`.
- ok — o leitor lê o endereço que o escritor deixou e o leva nos argumentos do comando.
### C2 intermediário
- n/a — o escritor `setUrl` não deixa estado intermediário: `src/editor/shell/capture-url.tsx:44` `onChange={(event) => setUrl(event.target.value)} />` é uma só instrução síncrona.
### C3 em curso
- ok — o leitor `submit` adia o despacho com `afterGesture` quando um gesto de ponteiro está aberto `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`; o valor lido é o que estava no campo no momento do envio, e a digitação que corra no intervalo grava em `url` sem tocar no `typed` já lido.
### C4 desmontagem
- n/a — quando o diálogo fecha, o componente deixa de ser desenhado `src/editor/shell/capture-url.tsx:22` `return open && RUN !== undefined ? <OpenCaptureUrl run={RUN} /> : null;`, e o envio que lê o endereço deixa de poder correr; o endereço guardado é descartado.
## Resultado
- O leitor lê o endereço digitado e o leva nos argumentos do comando `project.captureUrl`, que envia o pedido de captura: `src/editor/shell/capture-url.tsx:37` `afterGesture(store, () => (store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(run.command.id as CommandId, { ...run.door.args, url: typed, pages: count === '' ? 1 : Number(count) }));`.
