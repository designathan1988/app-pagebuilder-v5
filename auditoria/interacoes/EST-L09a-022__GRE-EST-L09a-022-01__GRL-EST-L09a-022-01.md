# EST-L09a-022 × GRE-EST-L09a-022-01 → GRL-EST-L09a-022-01
- **Estado:** EST-L09a-022
- **Escritor:** GRE-EST-L09a-022-01 (setValue): ENT-L09a-0026
- **Leitor:** GRL-EST-L09a-022-01 (leitura de value): ENT-L09a-0023, ENT-L09a-0026
## Estados deixados por A

O escritor é o `setValue` do formulário de edição da captura, declarado em `src/editor/shell/captured-inspector.tsx:53` `const [value, setValue] = useState(node.kind === 'text' ? node.value : '');` e chamado pela área do valor em `src/editor/shell/captured-inspector.tsx:74` `onChange={(event) => setValue(event.currentTarget.value)}` (fluxo ENT-L09a-0026). Os estados distintos que ele deixa são:

- **V1 o texto inicial** — `src/editor/shell/captured-inspector.tsx:53` `const [value, setValue] = useState(node.kind === 'text' ? node.value : '');`; é o valor do nó de texto, ou vazio quando o nó não é texto.
- **V2 o texto digitado** — `src/editor/shell/captured-inspector.tsx:74` `onChange={(event) => setValue(event.currentTarget.value)}`; cada alteração da área grava o valor dela no estado, inteiro.
- **Recusa: nenhuma** — a área do valor só é desenhada com as operações `text`, `attribute` e `insert`, em `src/editor/shell/captured-inspector.tsx:74` `{['text', 'attribute', 'insert'].includes(operation) && <label>{t('capture.editor.value')}`; com `remove` ou `move` não há campo a escrever, e o `setValue` não tem ramo que recuse.
- **Intermediário: nenhum** — cada `setValue` da linha 74 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor chega na renderização de `CapturedEdit` depois de o `setValue` da linha 74 ter gravado. Ele lê o item em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`, onde o `value` do estado entra nos argumentos da porta de aplicar; a própria área do valor lê o item uma segunda vez para mostrar o campo, em `src/editor/shell/captured-inspector.tsx:74` `value={value}`, e o botão de aplicar é desenhado com os argumentos em `src/editor/shell/captured-inspector.tsx:77` `data-args={JSON.stringify(args)}`. Com V2 o campo e o `data-args` do botão levam o texto digitado; com V1 levam o valor inicial. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setValue` de `src/editor/shell/captured-inspector.tsx:74` `onChange={(event) => setValue(event.currentTarget.value)}`; a área grava o texto inteiro a cada alteração e não há gesto nem sequência que deixe o valor num estado parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedEdit`, que lê o valor em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };`; a escrita de `src/editor/shell/captured-inspector.tsx:74` `onChange={(event) => setValue(event.currentTarget.value)}` corre no tratador do evento e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedEdit`, desenhado com a chave do nó em `src/editor/shell/captured-inspector.tsx:116` `{node !== null && <CapturedEdit key={node.id} node={node} />}`; quando o nó selecionado muda, o componente desmonta e uma instância nova nasce com o valor inicial da linha 53, e não há leitura do item depois da desmontagem.

## Resultado
O leitor lê EST-L09a-022 em `src/editor/shell/captured-inspector.tsx:56` `const args = { target: node.id, operation, name, value, parent, index };` e leva o valor aos argumentos da porta de aplicar, e a área mostra o mesmo valor em `src/editor/shell/captured-inspector.tsx:74` `value={value}`; o envio do formulário (ENT-L09a-0023) despacha o comando com ele.
