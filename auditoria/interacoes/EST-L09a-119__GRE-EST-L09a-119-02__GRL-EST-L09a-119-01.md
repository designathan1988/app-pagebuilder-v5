# EST-L09a-119 × GRE-EST-L09a-119-02 → GRL-EST-L09a-119-01
- **Estado:** EST-L09a-119
- **Escritor:** GRE-EST-L09a-119-02 (onInput): ENT-L09a-0127
- **Leitor:** GRL-EST-L09a-119-01 (TextField): ENT-L09a-0126
## Estados deixados por A
- V1 a mensagem da gravação, guardada na digitação `src/editor/shell/field.tsx:1582` `typing.message = store.getState().message;`
- V2 a marca de digitação verdadeira quando o texto saiu do mostrado `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`
- V3 a libertação da pendência quando o texto voltou ao mostrado `src/editor/shell/field.tsx:1585` `else releaseTyping(element);`
- Recusa: sem digitação o ouvinte nada guarda `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`
- Desmontagem: a marca cai com o `TextField`; a limpeza guarda a pendência `src/editor/shell/field.tsx:1597` `if (keepOnLeave) keepNow();`
## Casos
### C1 final
- O leitor chega com a digitação terminada: o efeito lê o rascunho `src/editor/shell/field.tsx:1563` `const typing = draft.current;`; com a marca a verdadeiro, guarda o texto `src/editor/shell/field.tsx:1573` `keepTextWith(store, command, target, element.value);`. Resultado: ok.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o guardar grava o texto para o nó `src/editor/shell/field.tsx:1573` `keepTextWith(store, command, target, element.value);`. Resultado: ok.
### C3 em curso
- n/a — o ouvinte de digitação grava de forma síncrona na marca; o efeito lê depois `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`.
### C4 desmontagem
- n/a — o rascunho é do `TextField` e cai com ele; a limpeza guarda a pendência antes `src/editor/shell/field.tsx:1597` `if (keepOnLeave) keepNow();`.
## Resultado
- A marca de digitação lida decide guardar o texto para o nó `src/editor/shell/field.tsx:1573` `keepTextWith(store, command, target, element.value);`.
