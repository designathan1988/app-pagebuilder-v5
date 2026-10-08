# EST-L09a-106 × GRE-EST-L09a-106-01 → GRL-EST-L09a-106-01
- **Estado:** EST-L09a-106
- **Escritor:** GRE-EST-L09a-106-01 (TextStyleField): ENT-L09a-0109, ENT-L09a-0110
- **Leitor:** GRL-EST-L09a-106-01 (TextStyleField): ENT-L09a-0110
## Estados deixados por A
- V1 o rascunho neutro, no primeiro render `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- V2 sem digitação depois de mostrar o valor `src/editor/shell/field.tsx:1038` `draft.current.typed = false;`
- V3 com rascunho restaurado, a mensagem e a marca `src/editor/shell/field.tsx:1042` `draft.current.message = store.getState().message;` e `src/editor/shell/field.tsx:1043` `draft.current.typed = recordFieldInput(element, new Event('input'));`
- V4 os alvos e o contexto capturados na primeira digitação `src/editor/shell/field.tsx:1065` `typing.targets = state.selection;` e `src/editor/shell/field.tsx:1066` `typing.context = editContextOf(state);`
- V5 sem digitação depois de guardar `src/editor/shell/field.tsx:1056` `typing.typed = false;`
- V6 a mensagem e a marca da digitação `src/editor/shell/field.tsx:1073` `typing.message = store.getState().message;` e `src/editor/shell/field.tsx:1074` `typing.typed = recordFieldInput(element, event);`
- Recusa: um campo de painel rápido fechado não guarda o rascunho `src/editor/shell/field.tsx:1059` `if (!keepOnLeave && !quickPanelOpen(store.getState().ui)) return;`
- Desmontagem: o rascunho cai com o `TextStyleField`; a limpeza guarda a digitação quando o campo é do inspector `src/editor/shell/field.tsx:1111` `if (keepOnLeave) keepNow();`
## Casos
### C1 final
- O leitor chega com o efeito terminado: lê o rascunho `src/editor/shell/field.tsx:1049` `const typing = draft.current;` e, sem digitação, não guarda `src/editor/shell/field.tsx:1055` `if (!typing.typed) return;`. Resultado: ok.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o guardar usa os alvos e o contexto capturados `src/editor/shell/field.tsx:1060` `keepText.current(element.value, typing.targets, typing.context);`. Resultado: ok.
### C3 em curso
- n/a — o efeito lê o rascunho de forma síncrona depois do commit `src/editor/shell/field.tsx:1049` `const typing = draft.current;`.
### C4 desmontagem
- n/a — o rascunho é referência do `TextStyleField` e cai com ele; a limpeza guarda a pendência do campo do inspector `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`.
## Resultado
- A digitação pendente é guardada no contexto em que começou, pelo texto, alvos e contexto lidos `src/editor/shell/field.tsx:1060` `keepText.current(element.value, typing.targets, typing.context);`.
