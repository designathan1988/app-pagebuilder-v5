# EST-L09a-124 × GRE-EST-L09a-124-01 → GRL-EST-L09a-124-01
- **Estado:** EST-L09a-124
- **Escritor:** GRE-EST-L09a-124-01 (KeptTextField): ENT-L09a-0129, ENT-L09a-0131, ENT-L09a-0132, ENT-L09a-0134, ENT-L09a-0137
- **Leitor:** GRL-EST-L09a-124-01 (KeptTextField): ENT-L09a-0131
## Estados deixados por A
- V1 o mostrado vazio, no primeiro render `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });`
- V2 o valor do nó guardado como mostrado `src/editor/shell/field.tsx:1738` `draft.current.shown = stored;`
- V3 o texto gravado guardado como mostrado `src/editor/shell/field.tsx:1764` `typing.shown = text;`
- V4 o valor escolhido no seletor guardado como mostrado `src/editor/shell/field.tsx:1799` `draft.current.shown = value;`
- Recusa: um campo de painel rápido fechado não grava e o mostrado fica como estava `src/editor/shell/field.tsx:1763` `if (!keepOnLeave && !quickPanelOpen(store.getState().ui)) return;`
- Desmontagem: o mostrado cai com o `KeptTextField`; a limpeza grava o que estava digitado `src/editor/shell/field.tsx:1792` `if (keepOnLeave) keep();`
## Casos
### C1 final
- O leitor chega com o efeito terminado: lê o mostrado `src/editor/shell/field.tsx:1755` `const typing = draft.current;` e compara o texto com ele `src/editor/shell/field.tsx:1762` `if (text === typing.shown) return;`. Resultado: ok — texto igual nada grava; diferente, grava.
### C2 intermediário
- n/a — o mostrado guarda o texto acabado de cada porta; não deixa valor a meio caminho `src/editor/shell/field.tsx:1764` `typing.shown = text;`.
### C3 em curso
- n/a — o leitor compara o mostrado de forma síncrona no tratador `src/editor/shell/field.tsx:1762` `if (text === typing.shown) return;`.
### C4 desmontagem
- n/a — o mostrado é referência do `KeptTextField` e cai com ele; a limpeza grava antes o que estava digitado `src/editor/shell/field.tsx:1722` `const draft = useRef({ shown: '' });`.
## Resultado
- O texto do campo, quando difere do mostrado lido, é gravado no nó `src/editor/shell/field.tsx:1768` `(store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(command, { ...args, [filled]: text });`.
