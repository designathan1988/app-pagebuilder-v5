# EST-L09a-100 × GRE-EST-L09a-100-01 → GRL-EST-L09a-100-02
- **Estado:** EST-L09a-100
- **Escritor:** GRE-EST-L09a-100-01 (NumberField): ENT-L09a-0097, ENT-L09a-0098
- **Leitor:** GRL-EST-L09a-100-02 (keep): ENT-L09a-0100
## Estados deixados por A
- V1 o rascunho neutro, no primeiro render `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- V2 sem digitação depois de mostrar o valor `src/editor/shell/field.tsx:624` `draft.current.typed = false;`
- V3 com rascunho restaurado, a mensagem e a marca `src/editor/shell/field.tsx:628` `draft.current.message = store.getState().message;` e `src/editor/shell/field.tsx:629` `draft.current.typed = recordFieldInput(element, new Event('input'));`
- V4 com digitação, a marca a verdadeiro `src/editor/shell/field.tsx:654` `typing.typed = recordFieldInput(element, event);`
- Recusa: sem digitação o ouvinte de saída nada agenda `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`
- Desmontagem: o rascunho cai com o `NumberField` `src/editor/shell/field.tsx:588` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
## Casos
### C1 final
- O leitor chega com o efeito terminado: o ouvinte de saída lê a marca de digitação `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`. Resultado: ok — sem pendência nada é agendado; com ela, o guardar é agendado.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto: a marca está a verdadeiro e o guardar é agendado para a task seguinte `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`. Resultado: ok.
### C3 em curso
- n/a — o ouvinte de saída lê a marca de forma síncrona no evento `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`.
### C4 desmontagem
- n/a — o rascunho é referência do `NumberField` e cai com ele; o ouvinte de saída é removido na limpeza `src/editor/shell/field.tsx:665` `element.removeEventListener('blur', keep);`.
## Resultado
- Deixar o campo com digitação pendente agenda o guardar uma task depois, pela marca lida `src/editor/shell/field.tsx:659` `if (typing.typed) keepSoon(element);`.
