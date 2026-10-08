# EST-L09a-143 × GRE-EST-L09a-143-01 → GRL-EST-L09a-143-01
- **Estado:** EST-L09a-143
- **Escritor:** GRE-EST-L09a-143-01 (GridItemField): ENT-L09a-0155, ENT-L09a-0156, ENT-L09a-0157
- **Leitor:** GRL-EST-L09a-143-01 (GridItemField): ENT-L09a-0154, ENT-L09a-0155, ENT-L09a-0157
## Estados deixados por A
- V1 sem rascunho, no primeiro render `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`
- V2 com rascunho, a digitação começa `src/editor/shell/inspector-controls.tsx:309` `onInput={() => { draft.current = true; }}`
- V3 sem rascunho, consumido pelo guardar `src/editor/shell/inspector-controls.tsx:276` `draft.current = false;`
- V4 sem rascunho quando o texto não é um inteiro `src/editor/shell/inspector-controls.tsx:281` `element.value = shown;`
- Recusa: sem rascunho o guardar não corre `src/editor/shell/inspector-controls.tsx:275` `if (element === null || !draft.current) return;`
- Desmontagem: o rascunho cai com o `GridItemField` `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`
## Casos
### C1 final
- O leitor chega com o guardar terminado: o efeito lê o rascunho `src/editor/shell/inspector-controls.tsx:271` `if (element !== null && !draft.current) element.value = shown;` e repõe o valor do item. Resultado: ok — sem rascunho o valor é reposto; com ele, o que foi digitado fica.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto, antes do guardar: o rascunho está a verdadeiro e o guardar lê-o para gravar o número `src/editor/shell/inspector-controls.tsx:275` `if (element === null || !draft.current) return;`. Resultado: ok.
### C3 em curso
- n/a — o efeito que mostra o valor lê o rascunho de forma síncrona depois do commit `src/editor/shell/inspector-controls.tsx:271` `if (element !== null && !draft.current) element.value = shown;`.
### C4 desmontagem
- n/a — o rascunho é referência do `GridItemField` e cai com ele `src/editor/shell/inspector-controls.tsx:268` `const draft = useRef(false);`.
## Resultado
- Sem rascunho o input volta a mostrar o valor do item; com rascunho o número digitado é gravado no comando do item de grade `src/editor/shell/inspector-controls.tsx:271` `if (element !== null && !draft.current) element.value = shown;`.
