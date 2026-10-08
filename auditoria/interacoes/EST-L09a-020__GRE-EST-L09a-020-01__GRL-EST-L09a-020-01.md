# EST-L09a-020 × GRE-EST-L09a-020-01 → GRL-EST-L09a-020-01
- **Estado:** EST-L09a-020
- **Escritor:** GRE-EST-L09a-020-01 (setOperation): ENT-L09a-0024
- **Leitor:** GRL-EST-L09a-020-01 (leitura de operation): ENT-L09a-0023, ENT-L09a-0024
## Estados deixados por A
- **V1 — a operação inicial.** `src/editor/shell/captured-inspector.tsx:51` `const [operation, setOperation] = useState<'text' | 'attribute' | 'insert' | 'remove' | 'move'>(node.kind === 'text' ? 'text' : 'attribute');` — o formulário abre com a operação própria do nó (texto num nó de texto, atributo num elemento).
- **V2 — a operação escolhida.** `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>` — escolher uma opção na lista grava em `operation` o valor escolhido.
- **Sem estado intermediário.** `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>` é uma só instrução síncrona; nenhum gesto, grupo ou sequência escreve EST-L09a-020 pelo `setOperation`.
- **Sem estado de recusa.** A escolha é um controlo local do formulário `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>`, não uma porta de comando que possa recusar.
## Casos
### C1 final
- O escritor já terminou: `operation` guarda a operação escolhida — `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>`.
- O leitor chega na renderização seguinte e lê a operação para compor os argumentos da porta de aplicar e para decidir os campos desenhados: `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`.
- Os campos seguem a operação: `src/editor/shell/captured-inspector.tsx:73` `{operation === 'attribute' && <label>{t('capture.editor.attribute')}<input value={name} onChange={(event) => setName(event.currentTarget.value)} /></label>}`.
- ok — o leitor lê a operação que o escritor deixou e compõe com ela os argumentos e os campos.
### C2 intermediário
- n/a — o escritor `setOperation` não deixa estado intermediário: `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>` é uma só instrução síncrona.
### C3 em curso
- n/a — o escritor `setOperation` corre síncrono no `onChange` `src/editor/shell/captured-inspector.tsx:65` `<select value={operation} onChange={(event) => setOperation(event.currentTarget.value as typeof operation)}>`; o leitor corre na renderização seguinte ou no envio, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando o nó selecionado muda, o `CapturedEdit` é remontado pela chave `src/editor/shell/captured-inspector.tsx:116` `{node !== null && <CapturedEdit key={node.id} node={node} />}`; a operação guardada perde-se e volta à inicial de `src/editor/shell/captured-inspector.tsx:51` `const [operation, setOperation] = useState<'text' | 'attribute' | 'insert' | 'remove' | 'move'>(node.kind === 'text' ? 'text' : 'attribute');`, e a leitura que a compunha deixa de correr.
## Resultado
- O leitor lê a operação escolhida e compõe com ela os argumentos da porta de aplicar a edição e os campos do formulário: `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`.
