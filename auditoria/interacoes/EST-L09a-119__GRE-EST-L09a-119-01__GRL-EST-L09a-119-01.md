# EST-L09a-119 × GRE-EST-L09a-119-01 → GRL-EST-L09a-119-01
- **Estado:** EST-L09a-119
- **Escritor:** GRE-EST-L09a-119-01 (TextField): ENT-L09a-0125, ENT-L09a-0126
- **Leitor:** GRL-EST-L09a-119-01 (TextField): ENT-L09a-0126
## Estados deixados por A
- V1 o rascunho neutro, no primeiro render `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`
- V2 sem digitação depois de mostrar o texto `src/editor/shell/field.tsx:1552` `draft.current.typed = false;`
- V3 com rascunho restaurado, a mensagem e a marca `src/editor/shell/field.tsx:1556` `draft.current.message = store.getState().message;` e `src/editor/shell/field.tsx:1557` `draft.current.typed = recordFieldInput(element, new Event('input'));`
- V4 sem digitação depois de guardar `src/editor/shell/field.tsx:1569` `typing.typed = false;`
- V5 a mensagem e a marca da digitação `src/editor/shell/field.tsx:1582` `typing.message = store.getState().message;` e `src/editor/shell/field.tsx:1583` `typing.typed = recordFieldInput(element, event);`
- Recusa: um campo de painel rápido fechado não guarda o rascunho `src/editor/shell/field.tsx:1572` `if (!keepOnLeave && !quickPanelOpen(store.getState().ui)) return;`
- Desmontagem: o rascunho cai com o `TextField`; a limpeza guarda o texto do campo do inspector `src/editor/shell/field.tsx:1597` `if (keepOnLeave) keepNow();`
## Casos
### C1 final
- O leitor chega com o efeito terminado: lê o rascunho `src/editor/shell/field.tsx:1563` `const typing = draft.current;` e, sem digitação, não guarda `src/editor/shell/field.tsx:1568` `if (!typing.typed) return;`. Resultado: ok.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o guardar grava o texto para o nó `src/editor/shell/field.tsx:1573` `keepTextWith(store, command, target, element.value);`. Resultado: ok.
### C3 em curso
- n/a — o efeito lê o rascunho de forma síncrona depois do commit `src/editor/shell/field.tsx:1563` `const typing = draft.current;`.
### C4 desmontagem
- n/a — o rascunho é referência do `TextField` e cai com ele; a limpeza guarda a pendência do campo do inspector `src/editor/shell/field.tsx:1538` `const draft = useRef<{ typed: boolean; message: EditorState['message'] }>({ typed: false, message: store.getState().message });`.
## Resultado
- A digitação pendente é guardada para o nó a que o campo pertence `src/editor/shell/field.tsx:1573` `keepTextWith(store, command, target, element.value);`.
