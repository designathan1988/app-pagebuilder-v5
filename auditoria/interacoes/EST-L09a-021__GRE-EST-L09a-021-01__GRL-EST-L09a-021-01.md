# EST-L09a-021 × GRE-EST-L09a-021-01 → GRL-EST-L09a-021-01
- **Estado:** EST-L09a-021
- **Escritor:** GRE-EST-L09a-021-01 (setName): ENT-L09a-0025
- **Leitor:** GRL-EST-L09a-021-01 (leitura de name): ENT-L09a-0023, ENT-L09a-0025
## Estados deixados por A

O escritor é o `setName` do formulário de edição da captura, declarado em `src/editor/shell/captured-inspector.tsx:52` `const [name, setName] = useState('style');` e chamado pelo campo do nome do atributo em `src/editor/shell/captured-inspector.tsx:73` `onChange={(event) => setName(event.currentTarget.value)}` (fluxo ENT-L09a-0025). Os estados distintos que ele deixa são:

- **V1 o texto inicial** — `src/editor/shell/captured-inspector.tsx:52` `const [name, setName] = useState('style');`; é o nome que o campo mostra na primeira renderização do formulário, e aquilo a que uma instância nova volta.
- **V2 o texto digitado** — `src/editor/shell/captured-inspector.tsx:73` `onChange={(event) => setName(event.currentTarget.value)}`; cada alteração do campo grava o valor dele no estado, inteiro, sem julgamento.
- **Recusa: nenhuma** — o `setName` da linha 73 não tem ramo que recuse; o campo do nome só é desenhado com a operação `attribute`, em `src/editor/shell/captured-inspector.tsx:73` `{operation === 'attribute' && <label>{t('capture.editor.attribute')}`; com outra operação não há campo a escrever.
- **Intermediário: nenhum** — cada `setName` da linha 73 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor chega na renderização de `CapturedEdit` depois de o `setName` da linha 73 ter gravado. Ele lê o item em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`, onde o `name` do estado entra nos argumentos da porta de aplicar; os argumentos alimentam a porta em `src/editor/shell/captured-inspector.tsx:57` `const apply = useDoor(APPLY, args);`, e o botão de aplicar é desenhado com eles em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`. Com V2 o `data-args` do botão leva o nome digitado; com V1 leva `style`. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setName` de `src/editor/shell/captured-inspector.tsx:73` `onChange={(event) => setName(event.currentTarget.value)}`; o campo grava o texto inteiro a cada alteração e não há gesto nem sequência que deixe o nome num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedEdit`, que lê o nome em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`; a escrita de `src/editor/shell/captured-inspector.tsx:73` `onChange={(event) => setName(event.currentTarget.value)}` corre no tratador do evento e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedEdit`, desenhado com a chave do nó em `src/editor/shell/captured-inspector.tsx:116` `{node !== null && <CapturedEdit key={node.id} node={node} />}`; quando o nó selecionado muda, o componente desmonta e uma instância nova nasce com o valor inicial da linha 52, e não há leitura do item depois da desmontagem.

## Resultado
O leitor lê EST-L09a-021 em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` e leva o nome do atributo aos argumentos da porta de aplicar; o botão de aplicar é desenhado com o nome lido em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`, e o envio do formulário (ENT-L09a-0023) despacha o comando com ele.
