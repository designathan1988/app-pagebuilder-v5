# EST-L09b-007 × GRE-EST-L09b-007-01 → GRL-EST-L09b-007-01
- **Estado:** EST-L09b-007
- **Escritor:** GRE-EST-L09b-007-01 (setOpen): ENT-L09b-0084, ENT-L09b-0085, ENT-L09b-0086
- **Leitor:** GRL-EST-L09b-007-01 (open): ENT-L09b-0084
## Estados deixados por A
O item é o estado local `openedAt` de `usePopover` (`src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);`), a abertura da camada sobreposta. Os membros do GRE- são as três entradas que fecham ou abrem a lista de tipos de variável (ENT-L09b-0084, ENT-L09b-0085, ENT-L09b-0086), todas por `setOpen`.

- **V1 nulo (fechada).** `src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);` — o valor da criação.
- **V2 o número de dispensas com que abriu (aberta).** `src/editor/shell/popover.tsx:34` `setOpenedAt(value ? dismissals : null);` — `setOpen` grava o número de dispensas do momento.
- **V3 dispensada.** o número gravado fica mais antigo que as dispensas atuais: a leitura em `src/editor/shell/popover.tsx:27` `const open = openedAt !== null && openedAt === dismissals;` passa a falso quando `dismissals` sobe (`src/editor/shell/popover.tsx:25` `const dismissals = useEditorState((s) => s.ui.overlays.dismissals);`).
- **Intermediário: inexistente.** `src/editor/shell/popover.tsx:34` `setOpenedAt(value ? dismissals : null);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** `setOpen` não julga valor (`src/editor/shell/popover.tsx:34` `setOpenedAt(value ? dismissals : null);`).
- **Desmontagem: sem estado.** o estado é descartado com o gatilho (`src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);`).

## Casos
### C1 final
O escritor já terminou: `setOpen` deixou a abertura em `src/editor/shell/popover.tsx:34` `setOpenedAt(value ? dismissals : null);` (o número da abertura ou nulo). O leitor `open` lê-a em `src/editor/shell/popover.tsx:27` `const open = openedAt !== null && openedAt === dismissals;`: com o número da abertura igual às dispensas, `open` é verdadeiro e a lista é desenhada (`src/editor/shell/variables.tsx:111` `{open ? (`). ok — `src/editor/shell/popover.tsx:27` `const open = openedAt !== null && openedAt === dismissals;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: `src/editor/shell/popover.tsx:34` `setOpenedAt(value ? dismissals : null);` é uma instrução síncrona única; não há meio de gesto, de grupo nem de sequência.

### C3 em curso
n/a — o escritor corre no toque (`src/editor/shell/variables.tsx:107` `onClick={() => (door.available ? setOpen((was) => !was) : undefined)}`) e o leitor na renderização; a re-renderização do React corre depois do evento, sem espera pelo meio.

### C4 desmontagem
n/a — a abertura e o leitor vivem no mesmo gatilho (`src/editor/shell/popover.tsx:26` `const [openedAt, setOpenedAt] = useState<number | null>(null);`); desmontado o botão Nova variável, o estado é descartado com ele.

## Resultado
O leitor decide se a lista de tipos é desenhada: `src/editor/shell/popover.tsx:27` `const open = openedAt !== null && openedAt === dismissals;` — a lista só é desenhada enquanto o número das dispensas for o da abertura.
