# EST-L09a-114 × GRE-EST-L09a-114-01 → GRL-EST-L09a-114-01
- **Estado:** EST-L09a-114
- **Escritor:** GRE-EST-L09a-114-01 (TextStyleField): ENT-L09a-0108
- **Leitor:** GRL-EST-L09a-114-01 (finish): ENT-L09a-0111
## Estados deixados por A
- V1 o fechar da camada, no primeiro render `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`
- V2 o fechar mais recente guardado pelo efeito `src/editor/shell/field.tsx:1011` `closeValues.current = valuesLayer.close;`
- Recusa: não é deste item — o efeito só guarda a função de fechar `src/editor/shell/field.tsx:1011` `closeValues.current = valuesLayer.close;`
- Desmontagem: a referência cai com o `TextStyleField` `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`
## Casos
### C1 final
- O leitor chega com o efeito de guarda terminado: o `finish` lê o fechar guardado e fecha a lista `src/editor/shell/field.tsx:1083` `closeValues.current();`. Resultado: ok.
### C2 intermediário
- n/a — o efeito de guarda atribui de uma vez; o fechar guardado é sempre uma função acabada `src/editor/shell/field.tsx:1011` `closeValues.current = valuesLayer.close;`.
### C3 em curso
- n/a — o efeito de guarda corre de forma síncrona depois do commit; não há leitura durante a atribuição `src/editor/shell/field.tsx:1011` `closeValues.current = valuesLayer.close;`.
### C4 desmontagem
- n/a — a referência é do `TextStyleField` e cai com ele; sem componente a lista também cai `src/editor/shell/field.tsx:1009` `const closeValues = useRef(valuesLayer.close);`.
## Resultado
- O `finish` fecha a lista de valores pela função lida `src/editor/shell/field.tsx:1083` `closeValues.current();`.
