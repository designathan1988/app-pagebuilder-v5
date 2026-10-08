# EST-L05a-036 × GRE-EST-L05a-036-01 → GRL-EST-L05a-036-01
- **Estado:** EST-L05a-036
- **Escritor:** GRE-EST-L05a-036-01 (dispatchPan): ENT-L05a-0039
- **Leitor:** GRL-EST-L05a-036-01 (followPicker): ENT-L05a-0031
## Estados deixados por A
- **V1 a store recém-criada, restaurada ou vazia.** `src/editor/store.ts:111` `export function createEditorStore(options: EditorStoreOptions = {}): EditorStore {` — a store criada por createEditorStore, seja do trabalho restaurado seja do projeto vazio.
- **V2 com um gesto aberto.** `src/editor/store.ts:220` `open = gesture;` — o invólucro guarda o gesto aberto.
- **V3 com uma sequência aberta (a rajada do teclado).** `src/editor/store.ts:204` `sequence: () => {` — a sequência corre com a digitação presa antes.
- **V4 com um grupo de comandos ocupado.** `src/editor/store.ts:218` `if (store.commandGroupOpen()) return { dispatch: (id, args) => store.dispatch(id, args), commit: () => undefined, cancel: () => undefined };` — um grupo aberto devolve um gesto que despacha sem mudar o documento.
- **V5 com a gravação adiada.** `src/editor/store.ts:244` `waiting.push(() => void store.dispatch(id, args, asked));` — com um gesto aberto, uma gravação que muda o documento espera na fila.
- **V6 somente leitura.** `src/editor/store.ts:146` `readOnly: options.ports?.readOnly ?? (() => !isEditing()),` — a aba sem a trava de edição recusa comandos de documento.
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
- O leitor lê a interface atual da store em `src/editor/input/pointer/tools.ts:19` `const ui = store.getState().ui;` e decide pela sessão do seletor.
- ok — lê o estado que o escritor deixou.

### C2 intermediário
- n/a — `src/editor/input/pointer/tools.ts:19` `const ui = store.getState().ui;` lê o estado publicado, sem meio.

### C3 em curso
- n/a — o seguidor corre numa publicação da store, quando o escritor já completou a instrução.

### C4 desmontagem
- O desmonte do dono remove a assinatura do seguidor (`src/editor/input/pointer.ts:217` `stopPicker();`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor abre ou fecha a sessão do seletor conforme a interface lida: `src/editor/input/pointer/tools.ts:21` `shared.session = store.gesture();`.
