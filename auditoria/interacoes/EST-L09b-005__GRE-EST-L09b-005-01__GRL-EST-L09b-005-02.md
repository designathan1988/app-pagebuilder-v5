# EST-L09b-005 × GRE-EST-L09b-005-01 → GRL-EST-L09b-005-02
- **Estado:** EST-L09b-005
- **Escritor:** GRE-EST-L09b-005-01 (a saída do campo): ENT-L09b-0008
- **Leitor:** GRL-EST-L09b-005-02 (keep): ENT-P-motion-0002, ENT-P-motion-0003, ENT-P-motion-0004, ENT-P-motion-0005, ENT-P-motion-0006, ENT-P-motion-0008, ENT-P-motion-0009, ENT-P-motion-0010, ENT-P-motion-0011, ENT-P-motion-0012, ENT-P-motion-0013, ENT-P-motion-0014, ENT-P-motion-0015, ENT-P-motion-0016, ENT-P-motion-0017, ENT-P-motion-0018, ENT-P-motion-0019, ENT-P-motion-0020, ENT-P-motion-0021, ENT-P-motion-0023, ENT-P-motion-0024, ENT-P-motion-0027, ENT-P-motion-0028, ENT-P-motion-0029, ENT-P-motion-0030, ENT-P-motion-0031, ENT-P-motion-0032, ENT-P-motion-0033, ENT-P-motion-0034, ENT-P-motion-0035, ENT-P-motion-0036, ENT-P-motion-0037, ENT-P-motion-0038, ENT-P-motion-0043, ENT-P-motion-0058, ENT-P-motion-0061, ENT-P-motion-0062, ENT-P-motion-0063, ENT-P-motion-0064, ENT-P-motion-0065, ENT-P-motion-0081, ENT-P-project-0021, ENT-P-project-0022
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
O escritor já terminou: a saída do campo repôs a marca a falso em `src/editor/shell/panel-field.tsx:117` `onBlur={() => setEdited(false)}`. O leitor `keep` lê a marca em `src/editor/shell/panel-field.tsx:85` `if (!edited) return;`: com a marca falsa o envio não grava. ok — `src/editor/shell/panel-field.tsx:85` `if (!edited) return;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/panel-field.tsx:117` `onBlur={() => setEdited(false)}` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.

### C3 em curso
n/a — o escritor corre no `onBlur` (`src/editor/shell/panel-field.tsx:117` `onBlur={() => setEdited(false)}`) e o leitor no envio do formulário (`src/editor/shell/panel-field.tsx:82` `const keep = (event: FormEvent) => {`); os dois são eventos distintos, sem espera pelo meio.

### C4 desmontagem
n/a — a marca e o leitor vivem na mesma componente (`src/editor/shell/panel-field.tsx:68` `const [edited, setEdited] = useState(false);`); desmontado o campo, o estado é descartado com ele.

## Resultado
O leitor `keep` decide se grava a digitação: `src/editor/shell/panel-field.tsx:85` `if (!edited) return;` — com a marca falsa o envio não grava nem despacha.
