# EST-L09a-027 × GRE-EST-L09a-027-01 → GRL-EST-L09a-027-01
- **Estado:** EST-L09a-027
- **Escritor:** GRE-EST-L09a-027-01 (setCodeOpen): ENT-L09a-0031
- **Leitor:** GRL-EST-L09a-027-01 (leitura de codeOpen): ENT-L09a-0031
## Estados deixados por A

O escritor é o `setCodeOpen` do bloco de código da captura, declarado em `src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);` e chamado pelo `onToggle` do `<details>` em `src/editor/shell/captured-inspector.tsx:117` `<details onToggle={(event) => setCodeOpen(event.currentTarget.open)}>` (fluxo ENT-L09a-0031). Os estados distintos que ele deixa são:

- **V1 `false`** — `src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);`; é o valor da declaração e aquele a que o fecho do bloco volta.
- **V2 `true`** — `src/editor/shell/captured-inspector.tsx:117` `<details onToggle={(event) => setCodeOpen(event.currentTarget.open)}>`; abrir o `<details>` grava o `open` dele.
- **Recusa: nenhuma** — o `onToggle` da linha 117 acompanha o estado do elemento e não tem ramo que recuse.
- **Intermediário: nenhum** — o `onToggle` da linha 117 é uma só chamada, com o estado do `<details>` no momento; não há gesto nem espera que deixe o item a meio.

## Casos
### C1 final
O leitor é a própria renderização de `CapturedInspector`. Com o escritor terminado, ele lê o item em `src/editor/shell/captured-inspector.tsx:119` `{codeOpen && <>`: com V2 o `<pre>` do HTML formatado e a lista de ficheiros de CSS são desenhados; com V1 não. O mesmo aberto entra nas dependências do memo, em `src/editor/shell/captured-inspector.tsx:106` `const formatted = useMemo(() => codeOpen && root !== null ? formattedCapturedHtml(root) : '', [codeOpen, root]);`, de modo que com o bloco fechado o HTML não é calculado. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setCodeOpen` de `src/editor/shell/captured-inspector.tsx:117` `<details onToggle={(event) => setCodeOpen(event.currentTarget.open)}>`; não há gesto, rajada nem sequência que deixe o aberto num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CapturedInspector`, que lê o aberto em `src/editor/shell/captured-inspector.tsx:119` `{codeOpen && <>`; a escrita da linha 117 corre no `onToggle` do `<details>` e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CapturedInspector` (`src/editor/shell/captured-inspector.tsx:101` `const [codeOpen, setCodeOpen] = useState(false);`); desmontar o inspector termina a renderização que o lê, e não há leitura do item depois disso.

## Resultado
O leitor lê EST-L09a-027 em `src/editor/shell/captured-inspector.tsx:119` `{codeOpen && <>` e decide se o bloco de código é desenhado: com o aberto verdadeiro o HTML formatado é mostrado em `src/editor/shell/captured-inspector.tsx:120` `<pre className="captured-inspector__code"><code>{formatted}</code></pre>`, e com ele falso o memo devolve vazio.
