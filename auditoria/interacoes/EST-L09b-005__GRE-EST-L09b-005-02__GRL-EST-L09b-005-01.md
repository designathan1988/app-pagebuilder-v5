# EST-L09b-005 × GRE-EST-L09b-005-02 → GRL-EST-L09b-005-01
- **Estado:** EST-L09b-005
- **Escritor:** GRE-EST-L09b-005-02 (onChange): ENT-L09b-0007
- **Leitor:** GRL-EST-L09b-005-01 (a renderização do input): ENT-L09b-0007, ENT-L09b-0008
## Estados deixados por A
O item é o estado local `edited` de `PanelField` (`src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);`), a marca de digitação não guardada no campo de painel.

- **V1 falso.** `src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);` — o campo mostra o valor do documento.
- **V2 verdadeiro.** `src/editor/shell/panel-field.tsx:113` `setEdited(true);` — a digitação marca a marca não guardada (GRE-EST-L09b-005-02).
- **V1 falso pela saída do campo.** `src/editor/shell/panel-field.tsx:117` `onBlur={() => setEdited(false)}` — deixar o campo descarta a marca (GRE-EST-L09b-005-01).
- **V1 falso pelo keep.** `src/editor/shell/panel-field.tsx:86` `setEdited(false);` — o envio do formulário consome a marca (GRE-EST-L09b-005-03).
- **Intermediário: inexistente.** cada escrita é uma instrução síncrona única (`src/editor/shell/panel-field.tsx:113` `setEdited(true);`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado distinto.** `keep` marca falso antes de despachar (`src/editor/shell/panel-field.tsx:86` `setEdited(false);`); o comando recusado deixa a marca como o aceito.
- **Desmontagem: sem estado.** o estado é descartado com o campo (`src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);`).

## Casos
### C1 final
O escritor já terminou: a digitação deixou a marca verdadeira em `src/editor/shell/panel-field.tsx:113` `setEdited(true);`. O leitor `a renderização do input` lê a marca em `src/editor/shell/panel-field.tsx:106` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`: com `edited` verdadeiro o campo mostra o rascunho. ok — `src/editor/shell/panel-field.tsx:106` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/panel-field.tsx:113` `setEdited(true);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.

### C3 em curso
n/a — o escritor corre no `onChange` (`src/editor/shell/panel-field.tsx:113` `setEdited(true);`) e o leitor na renderização do campo; a re-renderização do React corre depois do evento, sem espera pelo meio.

### C4 desmontagem
n/a — a marca e o leitor vivem na mesma componente (`src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);`); desmontado o campo, o estado é descartado com ele.

## Resultado
O leitor mostra o rascunho no campo enquanto a marca está verdadeira: `src/editor/shell/panel-field.tsx:106` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`.
