# EST-L09a-100 × GRE-EST-L09a-100-01 → GRL-EST-L09a-100-01
- **Estado:** EST-L09a-100
- **Escritor:** GRE-EST-L09a-100-01 (NumberField): ENT-L09a-0097, ENT-L09a-0098
- **Leitor:** GRL-EST-L09a-100-01 (NumberField): ENT-L09a-0098
## Estados deixados por A
- V1 o rascunho neutro, no primeiro render `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- V2 sem digitação depois de mostrar o valor `src/editor/shell/field.tsx:624` `draft.current.typed = false;`
- V3 com rascunho restaurado, a mensagem e a marca `src/editor/shell/field.tsx:628` `draft.current.message = store.getState().message;` e `src/editor/shell/field.tsx:629` `draft.current.typed = recordFieldInput(element, new Event('input'));`
- V4 os alvos e o contexto capturados na primeira digitação `src/editor/shell/field.tsx:648` `typing.targets = state.selection;` e `src/editor/shell/field.tsx:649` `typing.context = editContextOf(state);`
- V5 sem digitação depois de guardar `src/editor/shell/field.tsx:640` `typing.typed = false;`
- V6 a mensagem e a marca da digitação `src/editor/shell/field.tsx:653` `typing.message = store.getState().message;` e `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`
- Recusa: quando o comando é recusado o rascunho fica sem digitação, guardado pela limpeza do efeito `src/editor/shell/field.tsx:667` `keepNow();`
- Desmontagem: o rascunho cai com o `NumberField`; a limpeza guarda a digitação pendente antes `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
## Casos
### C1 final
- O leitor chega com o efeito terminado: lê o rascunho `src/editor/shell/field.tsx:635` `const typing = draft.current;` e, sem digitação, não guarda `src/editor/shell/field.tsx:639` `if (!typing.typed) return;`. Resultado: ok.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e os alvos e o contexto foram capturados `src/editor/shell/field.tsx:639` `if (!typing.typed) return;`; o guardar usa esses alvos e contexto `src/editor/shell/field.tsx:643` `keepValue(store, command, property, element.value, typing.targets, typing.context);`. Resultado: ok.
### C3 em curso
- n/a — o efeito lê o rascunho de forma síncrona depois do commit; não há leitura durante uma gravação a decorrer `src/editor/shell/field.tsx:635` `const typing = draft.current;`.
### C4 desmontagem
- n/a — o rascunho é referência do `NumberField` e cai com ele; a limpeza guarda a pendência antes da saída `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`.
## Resultado
- A digitação pendente é guardada no contexto em que começou, pelos alvos e contexto lidos `src/editor/shell/field.tsx:643` `keepValue(store, command, property, element.value, typing.targets, typing.context);`.
