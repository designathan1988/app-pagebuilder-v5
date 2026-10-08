# EST-L09a-147 × GRE-EST-L09a-147-01 → GRL-EST-L09a-147-01
- **Estado:** EST-L09a-147
- **Escritor:** GRE-EST-L09a-147-01 (SpacingField): ENT-L09a-0162, ENT-L09a-0163, ENT-L09a-0164, ENT-L09a-0165
- **Leitor:** GRL-EST-L09a-147-01 (SpacingField): ENT-L09a-0163, ENT-L09a-0165
## Estados deixados por A
O item é a ref `typed` de `SpacingField` (`src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`). Os membros do GRE- gravam-na por três entradas da mesma componente, e o estado distinto é o booleano que fica na ref.

- **V1 falso.** `src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);` — o valor da criação; é também aquele a que o efeito de montagem volta: `src/editor/shell/inspector-controls.tsx:451` `typed.current = false;` (ENT-L09a-0162; o envio ENT-L09a-0163 e a saída ENT-L09a-0165 gravam o mesmo pelo `keep`).
- **V2 verdadeiro.** `src/editor/shell/inspector-controls.tsx:485` `typed.current = true;` — a digitação (ENT-L09a-0164) marca a face da caixa como digitada.
- **Intermediário: inexistente.** `src/editor/shell/inspector-controls.tsx:485` `typed.current = true;` é uma só instrução síncrona; não há meio de gesto, de grupo nem de sequência que deixe a ref a meio.
- **Recusa: sem estado distinto.** `keep` consome a digitação antes de despachar — `src/editor/shell/inspector-controls.tsx:456` `typed.current = false;` — e o comando recusado (`src/editor/shell/inspector-controls.tsx:459` `if (store.getState().selection.length === 0) return;`) deixa `typed.current` falso, como o aceito.
- **Desmontagem: sem estado.** a ref pertence à componente e é descartada com ela: `src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`.

## Casos
### C1 final
O escritor já terminou: a digitação deixou `src/editor/shell/inspector-controls.tsx:485` `typed.current = true;`. O leitor `keep` chega pelo envio (`src/editor/shell/inspector-controls.tsx:472` `onSubmit={(event) => {`) ou pela saída (`src/editor/shell/inspector-controls.tsx:487` `onBlur={keep}`) e lê a ref em `src/editor/shell/inspector-controls.tsx:455` `if (element === null || !typed.current) return;`: com `typed.current` verdadeiro o guarda não devolve, e a gravação segue até `src/editor/shell/inspector-controls.tsx:460` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { box, sides, value });`. ok — `src/editor/shell/inspector-controls.tsx:455` `if (element === null || !typed.current) return;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: as escritas são instruções síncronas únicas — `src/editor/shell/inspector-controls.tsx:485` `typed.current = true;` e `src/editor/shell/inspector-controls.tsx:456` `typed.current = false;` —, e nenhum meio de gesto, de grupo ou de sequência as interrompe.

### C3 em curso
n/a — o escritor e o leitor correm na mesma chamada síncrona (`keep` abre em `src/editor/shell/inspector-controls.tsx:454` `const element = field.current;`) ou no efeito de montagem (`src/editor/shell/inspector-controls.tsx:448` `useEffect(() => {`); não há assinatura nem espera entre a leitura da linha `src/editor/shell/inspector-controls.tsx:455` `if (element === null || !typed.current) return;` e a escrita seguinte.

### C4 desmontagem
n/a — a ref e o leitor vivem na mesma componente (`src/editor/shell/inspector-controls.tsx:446` `const typed = useRef(false);`); desmontado o campo, o input que dispara `keep` não existe mais, e a ref é descartada com ele.

## Resultado
O leitor `keep` decide se grava a face da caixa: `src/editor/shell/inspector-controls.tsx:455` `if (element === null || !typed.current) return;` — só com digitação (`typed.current` verdadeiro) ele segue, consome-a em `src/editor/shell/inspector-controls.tsx:456` `typed.current = false;` e despacha o comando de espaçamento.
