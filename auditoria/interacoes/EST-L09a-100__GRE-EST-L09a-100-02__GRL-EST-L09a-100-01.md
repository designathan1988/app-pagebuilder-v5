# EST-L09a-100 × GRE-EST-L09a-100-02 → GRL-EST-L09a-100-01
- **Estado:** EST-L09a-100
- **Escritor:** GRE-EST-L09a-100-02 (onInput): ENT-L09a-0099
- **Leitor:** GRL-EST-L09a-100-01 (NumberField): ENT-L09a-0098
## Estados deixados por A
- V1 a mensagem da gravação, guardada na digitação `src/editor/shell/field.tsx:653` `typing.message = store.getState().message;`
- V2 a marca de digitação, verdadeira quando o campo saiu do valor mostrado `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`
- V3 a libertação da pendência quando o campo voltou ao valor mostrado `src/editor/shell/field.tsx:656` `else releaseTyping(element);`
- Recusa: sem digitação o ouvinte nada guarda `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`
- Desmontagem: a marca cai com o `NumberField`; a limpeza guarda a pendência `src/editor/shell/field.tsx:667` `keepNow();`
## Casos
### C1 final
- O leitor chega com a digitação terminada: o efeito lê o rascunho `src/editor/shell/field.tsx:635` `const typing = draft.current;`; com a marca a verdadeiro o guardar usa os alvos e o contexto `src/editor/shell/field.tsx:643` `keepValue(store, command, property, element.value, typing.targets, typing.context);`. Resultado: ok.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro, capturada no contexto em que a digitação começou `src/editor/shell/field.tsx:648` `typing.targets = state.selection;`. Resultado: ok.
### C3 em curso
- n/a — o ouvinte de digitação grava de forma síncrona na marca; o efeito lê depois, não durante `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`.
### C4 desmontagem
- n/a — o efeito e o seu rascunho são do `NumberField` e caem com ele; a limpeza guarda a pendência antes `src/editor/shell/field.tsx:667` `keepNow();`.
## Resultado
- A marca de digitação lida decide guardar o valor no contexto em que a digitação começou `src/editor/shell/field.tsx:643` `keepValue(store, command, property, element.value, typing.targets, typing.context);`.
