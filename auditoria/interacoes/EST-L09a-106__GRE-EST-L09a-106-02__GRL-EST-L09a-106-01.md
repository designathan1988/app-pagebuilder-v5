# EST-L09a-106 × GRE-EST-L09a-106-02 → GRL-EST-L09a-106-01
- **Estado:** EST-L09a-106
- **Escritor:** GRE-EST-L09a-106-02 (choose): ENT-L09a-0105
- **Leitor:** GRL-EST-L09a-106-01 (TextStyleField): ENT-L09a-0110
## Estados deixados por A
- V1 a marca de digitação limpa pela escolha de um valor `src/editor/shell/field.tsx:1187` `draft.current.typed = false;`
- V2 o rascunho neutro antes de qualquer digitação `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`
- Recusa: a escolha limpa a marca antes de gravar, pelo que nada fica pendente `src/editor/shell/field.tsx:1187` `draft.current.typed = false;`
- Desmontagem: o rascunho cai com o `TextStyleField`; a limpeza guarda a digitação do campo do inspector `src/editor/shell/field.tsx:1111` `if (keepOnLeave) keepNow();`
## Casos
### C1 final
- O leitor chega com a escolha terminada: lê o rascunho `src/editor/shell/field.tsx:1049` `const typing = draft.current;`; com a marca a falso, o guardar não corre `src/editor/shell/field.tsx:1055` `if (!typing.typed) return;`. Resultado: ok.
### C2 intermediário
- n/a — a escolha é uma gravação só na marca; não deixa estado a meio caminho `src/editor/shell/field.tsx:1187` `draft.current.typed = false;`.
### C3 em curso
- n/a — a escolha grava de forma síncrona no tratador; o efeito lê no render seguinte `src/editor/shell/field.tsx:1187` `draft.current.typed = false;`.
### C4 desmontagem
- n/a — o rascunho é referência do `TextStyleField` e cai com ele `src/editor/shell/field.tsx:966` `const draft = useRef<{ typed: boolean; message: EditorState['message']; targets: readonly string[]; context: EditContext | undefined }>({ typed: false, message: store.getState().message, targets: [], context: undefined });`.
## Resultado
- Com a marca lida a falso, o efeito não guarda de novo o texto escolhido já gravado `src/editor/shell/field.tsx:1055` `if (!typing.typed) return;`.
