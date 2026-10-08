# EST-L09a-030 × GRE-EST-L09a-030-01 → GRL-EST-L09a-030-01
- **Estado:** EST-L09a-030
- **Escritor:** GRE-EST-L09a-030-01 (o recálculo quando as dependências mudam): ENT-L09a-0031
- **Leitor:** GRL-EST-L09a-030-01 (leitura de formatted): ENT-L09a-0031
## Estados deixados por A

O escritor é o recálculo do memo `formatted` do bloco de código da captura, declarado em `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);` (fluxo ENT-L09a-0031); as dependências são o aberto do bloco e a raiz da captura. Os estados distintos que ele deixa são:

- **V1 calculado** — `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`; com o bloco aberto e uma raiz, formata o HTML.
- **V2 reaproveitado** — a mesma linha 106; enquanto o aberto e a raiz não mudam, o React devolve o HTML guardado sem formatar de novo.
- **V3 vazio** — a mesma linha 106; com o bloco fechado ou sem raiz, o ternário devolve a cadeia vazia.
- **Recusa: nenhuma** — a linha 106 não julga valor nem tem ramo que recuse.
- **Intermediário: nenhum** — o memo corre inteiro numa só chamada de `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`, sem ponto em que o leitor o encontre a meio.

## Casos
### C1 final
O leitor é a própria renderização de `CapturedInspector`. Com o recálculo terminado, ele lê o item em `src/editor/shell/captured-inspector.tsx:120` `<pre className="captured-inspector__code"><code>{formatted}</code></pre>`: com V1 o `<pre>` mostra o HTML formatado; com V3 o `<pre>` mostra vazio. O bloco só o desenha com o aberto verdadeiro, em `src/editor/shell/captured-inspector.tsx:119` `{codeOpen && <>`. ok

### C2 intermediário
n/a — o recálculo do memo é uma só chamada de `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`; não há gesto, rajada nem sequência que deixe o HTML formatado num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedInspector`, que lê o HTML formatado em `src/editor/shell/captured-inspector.tsx:120` `<pre className="captured-inspector__code"><code>{formatted}</code></pre>`; o recálculo da linha 106 corre na mesma renderização e não há assinatura de store que observe este memo.

### C4 desmontagem
n/a — o memo vive no `CapturedInspector` (`src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`); desmontar o inspector descarta o valor guardado e termina a renderização que o lê.

## Resultado
O leitor lê EST-L09a-030 em `src/editor/shell/captured-inspector.tsx:120` `<pre className="captured-inspector__code"><code>{formatted}</code></pre>` e mostra o HTML formatado da captura; o conteúdo é o que o memo calculou quando o aberto ou a raiz mudaram, e vazio quando o bloco está fechado, pela linha 106.
