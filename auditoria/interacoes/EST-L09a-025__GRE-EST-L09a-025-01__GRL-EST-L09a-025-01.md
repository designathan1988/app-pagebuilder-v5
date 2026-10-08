# EST-L09a-025 × GRE-EST-L09a-025-01 → GRL-EST-L09a-025-01
- **Estado:** EST-L09a-025
- **Escritor:** GRE-EST-L09a-025-01 (setOpen): ENT-L09a-0029
- **Leitor:** GRL-EST-L09a-025-01 (leitura de open): ENT-L09a-0029
## Estados deixados por A

O escritor é o `setOpen` do bloco de CSS de um ficheiro da captura, declarado em `src/editor/shell/captured-inspector.tsx:82` `const [open, setOpen] = useState(false);` e chamado pelo `onToggle` do `<details>` em `src/editor/shell/captured-inspector.tsx:88` `return <details onToggle={(event) => setOpen(event.currentTarget.open)}>` (fluxo ENT-L09a-0029). Os estados distintos que ele deixa são:

- **V1 `false`** — `src/editor/shell/captured-inspector.tsx:82` `const [open, setOpen] = useState(false);`; é o valor da declaração e aquele a que o fecho do bloco volta.
- **V2 `true`** — `src/editor/shell/captured-inspector.tsx:88` `return <details onToggle={(event) => setOpen(event.currentTarget.open)}>`; abrir o `<details>` grava o `open` dele.
- **Recusa: nenhuma** — o `onToggle` da linha 88 acompanha o estado do elemento e não tem ramo que recuse.
- **Intermediário: nenhum** — o `onToggle` da linha 88 é uma só chamada, com o estado do `<details>` no momento; não há gesto nem espera que deixe o item a meio.

## Casos
### C1 final
O leitor é a própria renderização de `CapturedCss`. Com o escritor terminado, ele lê o item em `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}`: com V2 o `<pre>` com o CSS decodificado é desenhado; com V1 não. A mesma leitura decide o memo do conteúdo, em `src/editor/shell/captured-inspector.tsx:84` `if (!open) return '';`, de modo que com o bloco fechado o CSS não é decodificado. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setOpen` de `src/editor/shell/captured-inspector.tsx:88` `return <details onToggle={(event) => setOpen(event.currentTarget.open)}>`; não há gesto, rajada nem sequência que deixe o aberto num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedCss`, que lê o aberto em `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}`; a escrita da linha 88 corre no `onToggle` do `<details>` e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedCss`, desenhado com a chave do ficheiro em `src/editor/shell/captured-inspector.tsx:122` `{stylesheets.map((file) => <CapturedCss key={file.path} file={file} />)}`; desmontar o bloco termina a renderização que o lê, e não há leitura do item depois disso.

## Resultado
O leitor lê EST-L09a-025 em `src/editor/shell/captured-inspector.tsx:90` `{open && <pre className="captured-inspector__code"><code>{content}</code></pre>}` e decide se o CSS do ficheiro é desenhado: com o aberto verdadeiro o `<pre>` mostra o conteúdo, e com ele falso o memo devolve vazio em `src/editor/shell/captured-inspector.tsx:84` `if (!open) return '';`.
