# EST-L09a-106 × GRE-EST-L09a-106-03 → GRL-EST-L09a-106-01
- **Estado:** EST-L09a-106
- **Escritor:** GRE-EST-L09a-106-03 (onInput): ENT-L09a-0112
- **Leitor:** GRL-EST-L09a-106-01 (TextStyleField): ENT-L09a-0110
## Estados deixados por A
- V1 a mensagem da gravação, guardada na digitação `src/editor/shell/field.tsx:1073` `typing.message = store.getState().message;`
- V2 a marca de digitação verdadeira quando o campo saiu do valor mostrado `src/editor/shell/field.tsx:1074` `typing.typed = recordFieldInput(element, event);`
- V3 a libertação da pendência quando o campo voltou ao valor mostrado `src/editor/shell/field.tsx:1076` `else releaseTyping(element);`
- Recusa: sem digitação o ouvinte nada guarda `src/editor/shell/field.tsx:1074` `typing.typed = recordFieldInput(element, event);`
- Desmontagem: a marca cai com o `TextStyleField`; a limpeza guarda a pendência do campo do inspector `src/editor/shell/field.tsx:1111` `if (keepOnLeave) keepNow();`
## Casos
### C1 final
- O leitor chega com a digitação terminada: o efeito lê o rascunho `src/editor/shell/field.tsx:1049` `const typing = draft.current;`; com a marca a verdadeiro, guarda o texto `src/editor/shell/field.tsx:1060` `keepText.current(element.value, typing.targets, typing.context);`. Resultado: ok.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o contexto foi capturado na primeira digitação `src/editor/shell/field.tsx:1066` `typing.context = editContextOf(state);`. Resultado: ok.
### C3 em curso
- n/a — o ouvinte de digitação grava de forma síncrona na marca; o efeito lê depois `src/editor/shell/field.tsx:1074` `typing.typed = recordFieldInput(element, event);`.
### C4 desmontagem
- n/a — o rascunho é do `TextStyleField` e cai com ele; a limpeza guarda a pendência antes `src/editor/shell/field.tsx:1111` `if (keepOnLeave) keepNow();`.
## Resultado
- A marca de digitação lida decide guardar o texto no contexto em que a digitação começou `src/editor/shell/field.tsx:1060` `keepText.current(element.value, typing.targets, typing.context);`.
