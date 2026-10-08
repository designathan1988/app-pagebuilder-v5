# EST-L09a-145 × GRE-EST-L09a-145-01 → GRL-EST-L09a-145-01
- **Estado:** EST-L09a-145
- **Escritor:** GRE-EST-L09a-145-01 (GridTrackField): ENT-L09a-0159, ENT-L09a-0160, ENT-L09a-0161
- **Leitor:** GRL-EST-L09a-145-01 (GridTrackField): ENT-L09a-0158, ENT-L09a-0159, ENT-L09a-0161
## Estados deixados por A
- V1 sem rascunho, no primeiro render `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`
- V2 com rascunho, a digitação começa `src/editor/shell/inspector-controls.tsx:402` `onInput={() => { draft.current = true; }}`
- V3 sem rascunho, consumido pelo guardar `src/editor/shell/inspector-controls.tsx:377` `draft.current = false;`
- Recusa: sem rascunho ou sem porta o guardar não corre `src/editor/shell/inspector-controls.tsx:376` `if (element === null || !draft.current || entry === undefined) return;`
- Desmontagem: o rascunho cai com o `GridTrackField` `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`
## Casos
### C1 final
- O leitor chega com o guardar terminado: o efeito lê o rascunho `src/editor/shell/inspector-controls.tsx:372` `if (element !== null && !draft.current) element.value = track;` e repõe a trilha. Resultado: ok — sem rascunho a trilha é reposta; com ele, o que foi digitado fica.
### C2 intermediário
- O leitor chega com a digitação a meio do gesto, antes do guardar: o rascunho está a verdadeiro e o guardar lê-o para gravar o texto da trilha `src/editor/shell/inspector-controls.tsx:376` `if (element === null || !draft.current || entry === undefined) return;`. Resultado: ok.
### C3 em curso
- n/a — o efeito que mostra a trilha lê o rascunho de forma síncrona depois do commit `src/editor/shell/inspector-controls.tsx:372` `if (element !== null && !draft.current) element.value = track;`.
### C4 desmontagem
- n/a — o rascunho é referência do `GridTrackField` e cai com ele `src/editor/shell/inspector-controls.tsx:369` `const draft = useRef(false);`.
## Resultado
- Sem rascunho o input volta a mostrar a trilha; com rascunho o texto digitado é gravado no comando da trilha `src/editor/shell/inspector-controls.tsx:372` `if (element !== null && !draft.current) element.value = track;`.
