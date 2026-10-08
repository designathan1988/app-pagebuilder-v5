# EST-L09b-004 × GRE-EST-L09b-004-01 → GRL-EST-L09b-004-02
- **Estado:** EST-L09b-004
- **Escritor:** GRE-EST-L09b-004-01 (onChange): ENT-L09b-0007
- **Leitor:** GRL-EST-L09b-004-02 (keep): ENT-P-project-0021, ENT-P-project-0022
## Estados deixados por A
O item é o estado local `draft` de `PanelField` (`src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);`), o texto digitado no campo de painel. O único membro do GRE- é a digitação (ENT-L09b-0007).

- **V1 o valor do documento.** `src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);` — o valor da primeira renderização.
- **V2 o texto digitado.** `src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);` — cada mudança do campo guarda o texto.
- **V3 o texto esvaziado.** `src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);` — o campo vazio grava a cadeia vazia.
- **Intermediário: inexistente.** `src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado distinto.** `keep` não escreve o rascunho; o comando recusado deixa-o como a digitação o deixou (`src/editor/shell/panel-field.tsx:87` `runWith(accept === undefined ? draft : accept(draft));`).
- **Desmontagem: sem estado.** o estado é descartado com o campo (`src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);`).

## Casos
### C1 final
O escritor já terminou: a digitação deixou o texto em `src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);`. O leitor `keep` chega no envio do formulário (`src/editor/shell/panel-field.tsx:82` `const keep = (event: FormEvent) => {`) e lê o rascunho em `src/editor/shell/panel-field.tsx:87` `runWith(accept === undefined ? draft : accept(draft));`, que o leva ao comando da porta. ok — `src/editor/shell/panel-field.tsx:87` `runWith(accept === undefined ? draft : accept(draft));`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência que deixe o rascunho a meio.

### C3 em curso
n/a — o escritor corre no `onChange` (`src/editor/shell/panel-field.tsx:114` `setDraft(event.target.value);`) e o leitor no envio do formulário (`src/editor/shell/panel-field.tsx:82` `const keep = (event: FormEvent) => {`); os dois são eventos distintos, sem espera pelo meio.

### C4 desmontagem
n/a — o rascunho e o leitor vivem na mesma componente (`src/editor/shell/panel-field.tsx:67` `const [draft, setDraft] = useState(value);`); desmontado o campo, o formulário que dispara o envio não existe mais.

## Resultado
O leitor `keep` leva o rascunho ao comando da porta no envio: `src/editor/shell/panel-field.tsx:87` `runWith(accept === undefined ? draft : accept(draft));`.
