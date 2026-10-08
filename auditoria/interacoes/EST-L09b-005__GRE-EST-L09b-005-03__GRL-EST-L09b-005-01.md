# EST-L09b-005 × GRE-EST-L09b-005-03 → GRL-EST-L09b-005-01
- **Estado:** EST-L09b-005
- **Escritor:** GRE-EST-L09b-005-03 (setEdited): ENT-P-project-0021, ENT-P-project-0022
- **Leitor:** GRL-EST-L09b-005-01 (a renderização do input): ENT-L09b-0007, ENT-L09b-0008
## Estados deixados por A
O item é o estado local `edited` de `PanelField` (`src/editor/shell/panel-field.tsx:70` `const [edited, setEdited] = useState(false);`), a marca de digitação não guardada no campo de painel.

- **V1 falso.** `src/editor/shell/panel-field.tsx:70` `const [edited, setEdited] = useState(false);` — o campo mostra o valor do documento.
- **V2 verdadeiro.** `src/editor/shell/panel-field.tsx:139` `setEdited(true);` — a digitação marca a marca não guardada (GRE-EST-L09b-005-02).
- **V1 falso pela saída do campo.** `src/editor/shell/panel-field.tsx:145` `onBlur={() => {` — deixar o campo descarta a marca (GRE-EST-L09b-005-01).
- **V1 falso pelo keep.** `src/editor/shell/panel-field.tsx:111` `setEdited(false);` — o envio do formulário consome a marca, e é ele que os membros deste grupo (ENT-P-project-0021, ENT-P-project-0022) deixam.
- **Intermediário: inexistente.** cada escrita é uma instrução síncrona única (`src/editor/shell/panel-field.tsx:111` `setEdited(false);`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado distinto.** `keep` marca falso antes de despachar (`src/editor/shell/panel-field.tsx:111` `setEdited(false);`); o comando recusado deixa a marca como o aceito.
- **Desmontagem: sem estado.** o estado é descartado com o campo (`src/editor/shell/panel-field.tsx:70` `const [edited, setEdited] = useState(false);`).

## Casos
### C1 final
O escritor já terminou: o `keep` da porta deixou a marca falsa em `src/editor/shell/panel-field.tsx:111` `setEdited(false);`. O leitor `a renderização do input` lê a marca em `src/editor/shell/panel-field.tsx:132` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`: com `edited` falso o campo mostra o valor do documento. ok — `src/editor/shell/panel-field.tsx:132` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/panel-field.tsx:111` `setEdited(false);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.

### C3 em curso
n/a — o escritor corre no `keep` do envio (`src/editor/shell/panel-field.tsx:107` `const keep = (event: FormEvent) => {`) e o leitor na renderização seguinte do campo; a re-renderização do React corre depois do evento, sem espera pelo meio.

### C4 desmontagem
n/a — a marca e o leitor vivem na mesma componente (`src/editor/shell/panel-field.tsx:70` `const [edited, setEdited] = useState(false);`); desmontado o campo, o estado é descartado com ele.

## Resultado
O leitor mostra o valor do documento no campo depois do envio: `src/editor/shell/panel-field.tsx:132` `value={edited ? draft : display === undefined || value === '' ? value : display(value)}`.
