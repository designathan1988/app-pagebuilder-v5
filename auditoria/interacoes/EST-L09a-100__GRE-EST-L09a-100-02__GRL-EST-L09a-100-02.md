# EST-L09a-100 × GRE-EST-L09a-100-02 → GRL-EST-L09a-100-02
- **Estado:** EST-L09a-100
- **Escritor:** GRE-EST-L09a-100-02 (onInput): ENT-L09a-0099
- **Leitor:** GRL-EST-L09a-100-02 (keep): ENT-L09a-0100
## Estados deixados por A
- V1 a mensagem da gravação, guardada na digitação `src/editor/shell/field.tsx:653` `typing.message = store.getState().message;`
- V2 a marca de digitação verdadeira quando o campo saiu do valor mostrado `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`
- V3 a libertação da pendência quando o campo voltou ao valor mostrado `src/editor/shell/field.tsx:656` `else releaseTyping(element);`
- Recusa: sem digitação nada é agendado `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`
- Desmontagem: a marca cai com o `NumberField`; o ouvinte de saída é removido `src/editor/shell/field.tsx:665` `element.removeEventListener('blur', keep);`
## Casos
### C1 final
- O leitor chega com a digitação terminada: o ouvinte de saída lê a marca `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`. Resultado: ok — a marca a verdadeiro agenda o guardar.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o guardar é agendado `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`. Resultado: ok.
### C3 em curso
- n/a — a digitação e a saída são eventos síncronos separados; o leitor não corre durante a gravação da marca `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`.
### C4 desmontagem
- n/a — o ouvinte de saída é removido com o `NumberField` `src/editor/shell/field.tsx:665` `element.removeEventListener('blur', keep);`.
## Resultado
- Deixar o campo com digitação pendente agenda o guardar uma task depois, pela marca lida `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`.
