# EST-L09a-119 × GRE-EST-L09a-119-02 → GRL-EST-L09a-119-02
- **Estado:** EST-L09a-119
- **Escritor:** GRE-EST-L09a-119-02 (onInput): ENT-L09a-0127
- **Leitor:** GRL-EST-L09a-119-02 (keep): ENT-L09a-0128
## Estados deixados por A
- V1 a mensagem da gravação, guardada na digitação `src/editor/shell/field.tsx:1582` `typing.message = store.getState().message;`
- V2 a marca de digitação verdadeira quando o texto saiu do mostrado `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`
- V3 a libertação da pendência quando o texto voltou ao mostrado `src/editor/shell/field.tsx:1585` `else releaseTyping(element);`
- Recusa: sem digitação o ouvinte de saída nada guarda `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`
- Desmontagem: a marca cai com o `TextField`; o ouvinte de saída é removido `src/editor/shell/field.tsx:1594` `element.removeEventListener('blur', keep);`
## Casos
### C1 final
- O leitor chega com a digitação terminada: o ouvinte de saída lê a marca `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`. Resultado: ok — a marca a verdadeiro guarda já o texto.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o texto é guardado para o nó `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`. Resultado: ok.
### C3 em curso
- n/a — a digitação e a saída são eventos síncronos separados; o leitor não corre durante a gravação da marca `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`.
### C4 desmontagem
- n/a — o ouvinte de saída é removido com o `TextField` `src/editor/shell/field.tsx:1594` `element.removeEventListener('blur', keep);`.
## Resultado
- Deixar o campo com digitação pendente guarda o texto para o nó pela marca lida `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`.
