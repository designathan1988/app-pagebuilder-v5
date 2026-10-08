# EST-L05a-036 × GRE-EST-L05a-036-01 → GRL-EST-L05a-036-03
- **Estado:** EST-L05a-036
- **Escritor:** GRE-EST-L05a-036-01 (dispatchPan): ENT-L05a-0039
- **Leitor:** GRL-EST-L05a-036-03 (getState): ENT-P-design-system-0001, ENT-P-design-system-0002, ENT-P-design-system-0003, ENT-P-design-system-0004, ENT-P-design-system-0005, ENT-P-design-system-0006, ENT-P-design-system-0007, ENT-P-design-system-0008, ENT-P-design-system-0009, ENT-P-design-system-0010, ENT-P-design-system-0011, ENT-P-design-system-0012, ENT-P-design-system-0013, ENT-P-design-system-0014, ENT-P-design-system-0015, ENT-P-design-system-0016, ENT-P-design-system-0017, ENT-P-design-system-0019, ENT-P-design-system-0021, ENT-P-design-system-0022, ENT-P-design-system-0024, ENT-P-design-system-0025, ENT-P-design-system-0026, ENT-P-design-system-0027, ENT-P-design-system-0028, ENT-P-design-system-0029, ENT-P-design-system-0030, ENT-P-design-system-0031, ENT-P-design-system-0032, ENT-P-design-system-0033, ENT-P-design-system-0034, ENT-P-design-system-0035, ENT-P-elements-0001, ENT-P-elements-0002, ENT-P-elements-0003, ENT-P-elements-0004, ENT-P-elements-0005, ENT-P-elements-0006, ENT-P-elements-0007, ENT-P-elements-0008, ENT-P-elements-0009, ENT-P-elements-0010, ENT-P-elements-0011, ENT-P-elements-0012, ENT-P-elements-0013, ENT-P-elements-0014, ENT-P-elements-0015, ENT-P-elements-0016, ENT-P-elements-0017, ENT-P-elements-0018, ENT-P-elements-0019, ENT-P-elements-0020, ENT-P-elements-0021, ENT-P-elements-0022, ENT-P-elements-0023, ENT-P-elements-0024, ENT-P-elements-0025, ENT-P-elements-0026, ENT-P-elements-0027, ENT-P-elements-0028, ENT-P-elements-0029, ENT-P-elements-0030, ENT-P-elements-0031, ENT-P-elements-0032, ENT-P-elements-0033, ENT-P-elements-0034, ENT-P-elements-0035, ENT-P-elements-0036, ENT-P-elements-0037, ENT-P-elements-0038, ENT-P-elements-0039, ENT-P-elements-0040, ENT-P-elements-0041, ENT-P-elements-0042, ENT-P-elements-0043, ENT-P-elements-0044, ENT-P-elements-0045, ENT-P-elements-0046, ENT-P-elements-0047, ENT-P-elements-0048, ENT-P-elements-0049, ENT-P-elements-0050, ENT-P-elements-0051, ENT-P-elements-0052, ENT-P-elements-0053, ENT-P-elements-0054, ENT-P-elements-0055, ENT-P-elements-0056, ENT-P-elements-0057, ENT-P-elements-0058, ENT-P-elements-0059, ENT-P-elements-0060, ENT-P-elements-0061, ENT-P-elements-0062, ENT-P-elements-0063, ENT-P-elements-0064, ENT-P-elements-0065, ENT-P-elements-0066, ENT-P-elements-0067, ENT-P-elements-0068, ENT-P-elements-0069, ENT-P-elements-0070, ENT-P-elements-0071, ENT-P-elements-0072, ENT-P-elements-0073, ENT-P-elements-0074, ENT-P-elements-0075, ENT-P-elements-0076, ENT-P-elements-0077, ENT-P-elements-0078, ENT-P-elements-0079, ENT-P-elements-0080, ENT-P-elements-0081, ENT-P-elements-0082, ENT-P-elements-0083, ENT-P-elements-0084, ENT-P-elements-0085, ENT-P-elements-0086, ENT-P-elements-0087, ENT-P-elements-0088, ENT-P-elements-0089, ENT-P-elements-0090, ENT-P-elements-0091, ENT-P-elements-0092, ENT-P-elements-0093, ENT-P-elements-0094, ENT-P-nodes-0001, ENT-P-nodes-0002, ENT-P-nodes-0003, ENT-P-nodes-0004, ENT-P-nodes-0005, ENT-P-nodes-0006, ENT-P-nodes-0007, ENT-P-nodes-0008, ENT-P-nodes-0009, ENT-P-nodes-0010, ENT-P-nodes-0011, ENT-P-nodes-0012, ENT-P-nodes-0013, ENT-P-nodes-0014, ENT-P-nodes-0015, ENT-P-nodes-0016, ENT-P-nodes-0017, ENT-P-nodes-0018, ENT-P-project-0001, ENT-P-project-0002, ENT-P-project-0003, ENT-P-project-0004, ENT-P-project-0005, ENT-P-project-0006, ENT-P-project-0007, ENT-P-project-0008, ENT-P-project-0009, ENT-P-project-0010, ENT-P-project-0011, ENT-P-project-0012, ENT-P-project-0013, ENT-P-project-0014, ENT-P-project-0015, ENT-P-project-0016, ENT-P-project-0017, ENT-P-project-0018, ENT-P-project-0019, ENT-P-project-0020, ENT-P-project-0021, ENT-P-project-0022, ENT-P-project-0023
## Estados deixados por A
- **V1 a store recém-criada, restaurada ou vazia.** `src/editor/store.ts:108` `export function createEditorStore(options: EditorStoreOptions = {}): EditorStore {` — a store criada por createEditorStore, seja do trabalho restaurado seja do projeto vazio.
- **V2 com um gesto aberto.** `src/editor/store.ts:208` `open = gesture;` — o invólucro guarda o gesto aberto.
- **V3 com uma sequência aberta (a rajada do teclado).** `src/editor/store.ts:192` `sequence: () => {` — a sequência corre com a digitação presa antes.
- **V4 com um grupo de comandos ocupado.** `src/editor/store.ts:206` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — um grupo aberto devolve um gesto que despacha sem mudar o documento.
- **V5 com a gravação adiada.** `src/editor/store.ts:230` `waiting.push(() => void store.dispatch(id, args, asked));` — com um gesto aberto, uma gravação que muda o documento espera na fila.
- **V6 somente leitura.** `src/editor/store.ts:143` `readOnly: options.ports?.readOnly ?? (() => !isEditing()),` — a aba sem a trava de edição recusa comandos de documento.
- **V-do-despacho.** `src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });` — o grupo despacha o comando da roda pela store e a store publica o estado novo.
- **Sem intermediário.** Cada despacho deixa a store num estado publicado (`src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`); não há meio de gesto, de grupo nem de sequência deixado por este grupo.
- **Sem recusa.** A recusa de um comando não muda a identidade da store; publica um estado com a mensagem e a marca de recusa.

## Casos
### C1 final
- O escritor despacha o comando da roda e a store publica o estado novo (`src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`).
- O leitor lê a store já com o estado publicado.
- ok — o leitor lê o estado que o escritor deixou.

### C2 intermediário
- n/a — o grupo deixa a store num estado publicado por despacho (`src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`); não há meio de gesto, de grupo nem de sequência deixado por este grupo.

### C3 em curso
- O leitor pode ler no meio de um despacho do escritor (um ouvinte da store dentro da publicação); lê o estado já fixado antes do aviso.
- ok — a leitura em curso vê o estado publicado pelo escritor.

### C4 desmontagem
- O desmonte do dono do ponteiro remove os seus ouvintes (`src/editor/input/pointer.ts:215` `return () => {`).
- ok — depois da desmontagem os leitores do ponteiro deixam de ler a store.

## Resultado
- A store leva o comando da roda ao seu tratador, e o estado publicado é o que os leitores leem: `src/editor/input/pointer/tools.ts:46` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id as CommandId, { ...entry.door.args, ...args });`.
## Casos
### C1 final
- O leitor lê o estado atual da store em `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());`, dentro do invólucro gestureSafe.
- ok — lê o estado que o escritor deixou.

### C2 intermediário
- n/a — `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());` lê o estado publicado, sem meio.

### C3 em curso
- n/a — a leitura corre num despacho que passa pelo invólucro, quando o estado já foi fixado.

### C4 desmontagem
- A leitura vive com a store criada em `src/editor/store.ts:108` `export function createEditorStore(options: EditorStoreOptions = {}): EditorStore {`; não é removida por um desmonte de componente.
- ok — sem desmontagem, o leitor continua a ler a store.

## Resultado
- O leitor compara o estado lido para saber se a digitação presa mudou de contexto: `src/editor/store.ts:224` `const edited = heldTyping() === null ? null : editedKey(store.getState());`.
