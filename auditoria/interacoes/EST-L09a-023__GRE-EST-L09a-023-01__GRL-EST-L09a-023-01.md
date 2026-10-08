# EST-L09a-023 × GRE-EST-L09a-023-01 → GRL-EST-L09a-023-01
- **Estado:** EST-L09a-023
- **Escritor:** GRE-EST-L09a-023-01 (setParent): ENT-L09a-0027
- **Leitor:** GRL-EST-L09a-023-01 (leitura de parent): ENT-L09a-0023, ENT-L09a-0027
## Estados deixados por A

O escritor é o `setParent` do formulário de edição da captura, declarado em `src/editor/shell/captured-inspector.tsx:54` `const [parent, setParent] = useState(node.id);` e chamado pelo campo do destino em `src/editor/shell/captured-inspector.tsx:75` `onChange={(event) => setParent(event.currentTarget.value)}` (fluxo ENT-L09a-0027). Os estados distintos que ele deixa são:

- **V1 o id do nó** — `src/editor/shell/captured-inspector.tsx:54` `const [parent, setParent] = useState(node.id);`; é o destino que o campo mostra na primeira renderização.
- **V2 o texto digitado** — `src/editor/shell/captured-inspector.tsx:75` `onChange={(event) => setParent(event.currentTarget.value)}`; cada alteração do campo grava o valor dele no estado, inteiro.
- **Recusa: nenhuma** — o campo do destino só é desenhado com as operações `insert` e `move`, em `src/editor/shell/captured-inspector.tsx:75` `{['insert', 'move'].includes(operation) && <label>{t('capture.editor.target')}`; com outra operação não há campo a escrever.
- **Intermediário: nenhum** — cada `setParent` da linha 75 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor chega na renderização de `CapturedEdit` depois de o `setParent` da linha 75 ter gravado. Ele lê o item em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`, onde o `parent` do estado entra nos argumentos da porta de aplicar; os argumentos alimentam a porta em `src/editor/shell/captured-inspector.tsx:57` `const apply = useDoor(APPLY, args);`, e o botão de aplicar é desenhado com eles em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`. Com V2 o `data-args` leva o destino digitado; com V1 leva o id do nó. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setParent` de `src/editor/shell/captured-inspector.tsx:75` `onChange={(event) => setParent(event.currentTarget.value)}`; o campo grava o texto inteiro a cada alteração e não há gesto nem sequência que deixe o destino num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedEdit`, que lê o destino em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`; a escrita de `src/editor/shell/captured-inspector.tsx:75` `onChange={(event) => setParent(event.currentTarget.value)}` corre no tratador do evento e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedEdit`, desenhado com a chave do nó em `src/editor/shell/captured-inspector.tsx:116` `{node !== null && <CapturedEdit key={node.id} node={node} />}`; quando o nó selecionado muda, o componente desmonta e uma instância nova nasce com o id do nó da linha 54, e não há leitura do item depois da desmontagem.

## Resultado
O leitor lê EST-L09a-023 em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` e leva o destino aos argumentos da porta de aplicar; o botão é desenhado com ele em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`, e o envio do formulário (ENT-L09a-0023) despacha o comando com ele.
