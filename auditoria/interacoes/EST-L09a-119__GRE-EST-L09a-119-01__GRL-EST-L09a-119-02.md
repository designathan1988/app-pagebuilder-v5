# EST-L09a-119 × GRE-EST-L09a-119-01 → GRL-EST-L09a-119-02
- **Estado:** EST-L09a-119
- **Escritor:** GRE-EST-L09a-119-01 (TextField): ENT-L09a-0125, ENT-L09a-0126
- **Leitor:** GRL-EST-L09a-119-02 (keep): ENT-L09a-0128
## Estados deixados por A
- V1 o rascunho neutro, no primeiro render `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`
- V2 sem digitação depois de mostrar o texto `src/editor/shell/field.tsx:1552` `draft.current.typed = false;`
- V3 com rascunho restaurado, a mensagem e a marca `src/editor/shell/field.tsx:1556` `draft.current.message = store.getState().message;` e `src/editor/shell/field.tsx:1557` `draft.current.typed = recordFieldInput(element, new Event('input'));`
- V4 com digitação, a marca a verdadeiro `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`
- Recusa: sem digitação o ouvinte de saída nada guarda `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`
- Desmontagem: a marca cai com o `TextField`; a limpeza guarda a pendência `src/editor/shell/field.tsx:1597` `if (keepOnLeave) keepNow();`
## Casos
### C1 final
- O leitor chega com o efeito terminado: o ouvinte de saída lê a marca `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`. Resultado: ok — com pendência guarda já; sem ela nada muda.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o guardar grava o texto para o nó `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`. Resultado: ok.
### C3 em curso
- n/a — o ouvinte de saída lê a marca de forma síncrona no evento `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`.
### C4 desmontagem
- n/a — o ouvinte de saída é removido com o `TextField` na limpeza `src/editor/shell/field.tsx:1594` `element.removeEventListener('blur', keep);`.
## Resultado
- Deixar o campo com digitação pendente guarda o texto para o nó pela marca lida `src/editor/shell/field.tsx:1588` `if (typing.typed) keepNow();`.
