# EST-L09a-034 × GRE-EST-L09a-034-01 → GRL-EST-L09a-034-01
- **Estado:** EST-L09a-034
- **Escritor:** GRE-EST-L09a-034-01 (setDraft): ENT-L09a-0040
- **Leitor:** GRL-EST-L09a-034-01 (leitura de draft): ENT-L09a-0040
## Estados deixados por A

O escritor é o `setDraft` do editor do painel de código, declarado em `src/editor/shell/code-pane.tsx:108` `const [draft, setDraft] = useState<{ readonly over: string; readonly text: string } | null>(null);` e chamado pela área editável em `src/editor/shell/code-pane.tsx:153` `onChange={(event) => setDraft({ over: edited ?? '', text: event.target.value })}` (fluxo ENT-L09a-0040). Os estados distintos que ele deixa são:

- **V1 `null`** — `src/editor/shell/code-pane.tsx:108` `const [draft, setDraft] = useState<{ readonly over: string; readonly text: string } | null>(null);`; é o valor da declaração e o estado em que o editor mostra o texto do documento.
- **V2 o rascunho sobre o texto corrente** — `src/editor/shell/code-pane.tsx:153` `onChange={(event) => setDraft({ over: edited ?? '', text: event.target.value })}`; grava o texto digitado com o `edited` do momento por marca, de modo que o `over` iguala o texto por baixo.
- **V3 o rascunho cujo `over` já não iguala o texto** — o mesmo objeto da linha 153 quando `edited` muda depois; o leitor compara-o com o `edited` corrente em `src/editor/shell/code-pane.tsx:114` `const shown = draft !== null && draft.over === edited ? draft.text : edited;` e volta ao texto do documento.
- **Recusa: nenhuma** — a linha 153 grava o que o evento traz e não tem ramo que recuse.
- **Intermediário: nenhum** — cada `setDraft` da linha 153 é uma só chamada; o leitor só corre na renderização seguinte, já terminada a chamada.

## Casos
### C1 final
O leitor é a própria renderização de `CodePane`. Com o escritor terminado, ele lê o item em `src/editor/shell/code-pane.tsx:114` `const shown = draft !== null && draft.over === edited ? draft.text : edited;`: com V2, cujo `over` iguala o `edited` de `src/editor/shell/code-pane.tsx:113` `const edited = fileText ?? (kind === 'css' ? rule : kind === 'html' ? ownText : null);`, `shown` é o rascunho; com V1 ou V3 `shown` é o texto do documento. O editor mostra `shown` em `src/editor/shell/code-pane.tsx:152` `value={shown ?? ''}`. ok

### C2 intermediário
n/a — a escrita é uma só chamada `setDraft` de `src/editor/shell/code-pane.tsx:153` `onChange={(event) => setDraft({ over: edited ?? '', text: event.target.value })}`; a área grava o texto inteiro a cada alteração e não há gesto nem sequência que deixe o rascunho num valor parcial.

### C3 em curso
n/a — o leitor é a renderização do próprio `CodePane`, que lê o rascunho em `src/editor/shell/code-pane.tsx:114` `const shown = draft !== null && draft.over === edited ? draft.text : edited;`; a escrita da linha 153 corre no `onChange` do editor e termina antes da renderização, e não há assinatura de store que observe este item.

### C4 desmontagem
n/a — o escritor e o leitor vivem no mesmo `CodePane` (`src/editor/shell/code-pane.tsx:119` `<section className="code-pane" data-region="code-view" aria-label={t('panel.code')}>`); desmontar o painel termina a renderização que o lê, e não há leitura do item depois disso.

## Resultado
O leitor lê EST-L09a-034 em `src/editor/shell/code-pane.tsx:114` `const shown = draft !== null && draft.over === edited ? draft.text : edited;` e decide o texto do editor: mostra o rascunho enquanto o texto sobre o qual foi digitado não mudou, e volta ao texto do documento quando mudou; o editor mostra o resultado em `src/editor/shell/code-pane.tsx:152` `value={shown ?? ''}`.
