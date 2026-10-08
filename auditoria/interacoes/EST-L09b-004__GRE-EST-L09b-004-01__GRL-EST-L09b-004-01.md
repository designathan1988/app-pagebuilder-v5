# EST-L09b-004 × GRE-EST-L09b-004-01 → GRL-EST-L09b-004-01
- **Estado:** EST-L09b-004
- **Escritor:** GRE-EST-L09b-004-01 (onChange): ENT-L09b-0007
- **Leitor:** GRL-EST-L09b-004-01 (a renderização do input): ENT-L09b-0007, ENT-L09b-0008
## Estados deixados por A
O item é o estado local `draft` de `PanelField` (`src/editor/shell/panel-field.tsx:69` `const [draft, setDraft] = useState(value);`), o texto digitado no campo de painel. O único membro do GRE- é a digitação (ENT-L09b-0007).

- **V1 o valor do documento.** `src/editor/shell/panel-field.tsx:69` `const [draft, setDraft] = useState(value);` — o valor da primeira renderização.
- **V2 o texto digitado.** `src/editor/shell/panel-field.tsx:140` `setDraft(event.target.value);` — cada mudança do campo guarda o texto.
- **V3 o texto esvaziado.** `src/editor/shell/panel-field.tsx:140` `setDraft(event.target.value);` — o campo vazio grava a cadeia vazia.
- **Intermediário: inexistente.** `src/editor/shell/panel-field.tsx:140` `setDraft(event.target.value);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado distinto.** `keep` não escreve o rascunho; o comando recusado deixa-o como a digitação o deixou (`src/editor/shell/panel-field.tsx:112` `runWith(accept === undefined ? draft : accept(draft));`).
- **Desmontagem: sem estado.** o estado é descartado com o campo (`src/editor/shell/panel-field.tsx:69` `const [draft, setDraft] = useState(value);`).

## Casos
### C1 final
O escritor já terminou: a digitação deixou o texto em `src/editor/shell/panel-field.tsx:140` `setDraft(event.target.value);`. O leitor `a renderização do input` lê o rascunho no valor do campo, `src/editor/shell/panel-field.tsx:132` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`: com `edited` verdadeiro o campo mostra o rascunho. ok — `src/editor/shell/panel-field.tsx:132` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/panel-field.tsx:140` `setDraft(event.target.value);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência que deixe o rascunho a meio.

### C3 em curso
n/a — o escritor corre no `onChange` (`src/editor/shell/panel-field.tsx:139` `setEdited(true);`) e o leitor na renderização do campo; a re-renderização do React corre depois do evento, sem espera pelo meio.

### C4 desmontagem
n/a — o rascunho e o leitor vivem na mesma componente (`src/editor/shell/panel-field.tsx:69` `const [draft, setDraft] = useState(value);`); desmontado o campo, o formulário que dispara o envio não existe mais.

## Resultado
O leitor mostra o rascunho no campo enquanto há digitação não guardada: `src/editor/shell/panel-field.tsx:132` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`.
