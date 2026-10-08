# EST-L09a-028 × GRE-EST-L09a-028-01 → GRL-EST-L09a-028-01
- **Estado:** EST-L09a-028
- **Escritor:** GRE-EST-L09a-028-01 (o recálculo quando as dependências mudam): ENT-L09a-0029
- **Leitor:** GRL-EST-L09a-028-01 (leitura de content): ENT-L09a-0029
## Estados deixados por A

O escritor é o recálculo do memo `content` do bloco de CSS de um ficheiro da captura, declarado em `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {` (fluxo ENT-L09a-0029); as dependências são o ficheiro e o aberto, em `src/editor/shell/captured-inspector.tsx:87` `}, [file, open]);`. Os estados distintos que ele deixa são:

- **V1 calculado** — `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {`; corre o corpo uma vez, decodificando os `bytes` do ficheiro.
- **V2 reaproveitado** — `src/editor/shell/captured-inspector.tsx:87` `}, [file, open]);`; enquanto o ficheiro e o aberto não mudam, o React devolve o valor guardado sem correr o corpo de novo.
- **V3 vazio com o bloco fechado** — `src/editor/shell/captured-inspector.tsx:84` `if (!open) return '';`; com o bloco fechado o corpo devolve a cadeia vazia.
- **Recusa: nenhuma** — o corpo das linhas 83 a 87 não julga valor nem tem ramo que recuse.
- **Intermediário: nenhum** — o memo corre inteiro dentro da renderização de `CapturedCss`, entre `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {` e `src/editor/shell/captured-inspector.tsx:87` `}, [file, open]);`, sem ponto em que o leitor o encontre a meio.

## Casos
### C1 final
O leitor é a própria renderização de `CapturedCss`. Com o recálculo terminado, ele lê o item em `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}`: com V1 o `<pre>` mostra o CSS decodificado que o memo calculou; com V3 o corpo devolve a cadeia vazia da linha 84 e o `<pre>` não é desenhado. ok

### C2 intermediário
n/a — o recálculo do memo é uma passagem síncrona na renderização, de `src/editor/shell/captured-inspector.tsx:83` `const content = useMemo(() => {` até `src/editor/shell/captured-inspector.tsx:87` `}, [file, open]);`; não há gesto nem sequência que deixe o conteúdo num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedCss`, que lê o conteúdo em `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}`; o recálculo da linha 83 corre na mesma renderização e não há assinatura de store que observe este memo.

### C4 desmontagem
n/a — o memo vive no `CapturedCss`, desenhado com a chave do ficheiro em `src/editor/shell/captured-inspector.tsx:122` `{stylesheets.map((file) => <CapturedCss key={file.path} file={file} />)}`; desmontar o bloco descarta o valor guardado e termina a renderização que o lê.

## Resultado
O leitor lê EST-L09a-028 em `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}` e mostra o CSS do ficheiro; o conteúdo é o que o memo calculou quando o ficheiro ou o aberto mudaram, e vazio quando o bloco está fechado em `src/editor/shell/captured-inspector.tsx:84` `if (!open) return '';`.
