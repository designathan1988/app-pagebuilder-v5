# EST-L09a-024 × GRE-EST-L09a-024-01 → GRL-EST-L09a-024-01
- **Estado:** EST-L09a-024
- **Escritor:** GRE-EST-L09a-024-01 (setIndex): ENT-L09a-0028
- **Leitor:** GRL-EST-L09a-024-01 (leitura de index): ENT-L09a-0023, ENT-L09a-0028
## Estados deixados por A

O escritor é o `setIndex` do formulário de edição da captura, declarado em `src/editor/shell/captured-inspector.tsx:55` `const [index, setIndex] = useState(0);` e chamado pelo campo do índice em `src/editor/shell/captured-inspector.tsx:76` `onChange={(event) => setIndex(Number(event.currentTarget.value))}` (fluxo ENT-L09a-0028). Os estados distintos que ele deixa são:

- **V1 o zero** — `src/editor/shell/captured-inspector.tsx:55` `const [index, setIndex] = useState(0);`; é o índice que o campo mostra na primeira renderização.
- **V2 o número digitado** — `src/editor/shell/captured-inspector.tsx:76` `onChange={(event) => setIndex(Number(event.currentTarget.value))}`; o campo converte o texto a número antes de gravar.
- **Recusa: nenhuma** — o campo do índice só é desenhado com as operações `insert` e `move`, em `src/editor/shell/captured-inspector.tsx:76` `{['insert', 'move'].includes(operation) && <label>{t('capture.editor.index')}`; a conversão `Number(event.currentTarget.value)` grava o que resultar dela e não tem ramo que recuse.
- **Intermediário: nenhum** — cada `setIndex` da linha 76 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor chega na renderização de `CapturedEdit` depois de o `setIndex` da linha 76 ter gravado. Ele lê o item em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`, onde o `index` do estado entra nos argumentos da porta de aplicar; os argumentos alimentam a porta em `src/editor/shell/captured-inspector.tsx:57` `const apply = useDoor(APPLY, args);`, e o botão de aplicar é desenhado com eles em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`. Com V2 o `data-args` leva o número digitado; com V1 leva zero. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setIndex` de `src/editor/shell/captured-inspector.tsx:76` `onChange={(event) => setIndex(Number(event.currentTarget.value))}`; o campo grava o número a cada alteração e não há gesto nem sequência que deixe o índice num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedEdit`, que lê o índice em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`; a escrita de `src/editor/shell/captured-inspector.tsx:76` `onChange={(event) => setIndex(Number(event.currentTarget.value))}` corre no tratador do evento e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedEdit`, desenhado com a chave do nó em `src/editor/shell/captured-inspector.tsx:116` `{node !== null && <CapturedEdit key={node.id} node={node} />}`; quando o nó selecionado muda, o componente desmonta e uma instância nova nasce com o zero da linha 55, e não há leitura do item depois da desmontagem.

## Resultado
O leitor lê EST-L09a-024 em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` e leva o índice aos argumentos da porta de aplicar; o botão é desenhado com ele em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`, e o envio do formulário (ENT-L09a-0023) despacha o comando com ele.
