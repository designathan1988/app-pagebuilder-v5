# EST-L09a-092 × GRE-EST-L09a-092-01 → GRL-EST-L09a-092-01
- **Estado:** EST-L09a-092
- **Escritor:** GRE-EST-L09a-092-01 (setMoreValues): ENT-L09a-0106
- **Leitor:** GRL-EST-L09a-092-01 (FieldValues): ENT-L09a-0106
## Estados deixados por A
- V1 recolhido, no primeiro render `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`
- V2 alternado pelo clique `src/editor/shell/field.tsx:900` `onClick={() => setMoreValues(!moreValues)}>`
- Recusa: não é deste item — o clique só alterna a lista longa de valores `src/editor/shell/field.tsx:900` `onClick={() => setMoreValues(!moreValues)}>`
- Desmontagem: a expansão cai com `FieldValues` `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`
## Casos
### C1 final
- O leitor chega com o clique terminado: o `FieldValues` lê a expansão para montar a lista `src/editor/shell/field.tsx:875` `const menuValues = first === null ? suggestions : [...first.filter((v) => suggestions.includes(v)), ...(moreValues && !essentialsMode ? suggestions.filter((v) => !first.includes(v)) : [])];`; o item do botão lê a expansão para o rótulo `src/editor/shell/field.tsx:902` `<span className="menu__label">{t(moreValues ? 'field.values.fewer' : 'field.values.more')}</span>`. Resultado: ok.
### C2 intermediário
- n/a — o clique é uma gravação só; a expansão não fica a meio caminho `src/editor/shell/field.tsx:900` `onClick={() => setMoreValues(!moreValues)}>`.
### C3 em curso
- n/a — `setMoreValues` agenda o próximo render; o leitor corre depois do retorno do tratador `src/editor/shell/field.tsx:900` `onClick={() => setMoreValues(!moreValues)}>`.
### C4 desmontagem
- n/a — a expansão é estado de `FieldValues` e cai com ele `src/editor/shell/field.tsx:873` `const [moreValues, setMoreValues] = useState(false);`.
## Resultado
- A lista de valores passa a mostrar o resto dos valores, ou volta a encurtar, pela expansão lida `src/editor/shell/field.tsx:875` `const menuValues = first === null ? suggestions : [...first.filter((v) => suggestions.includes(v)), ...(moreValues && !essentialsMode ? suggestions.filter((v) => !first.includes(v)) : [])];`.
