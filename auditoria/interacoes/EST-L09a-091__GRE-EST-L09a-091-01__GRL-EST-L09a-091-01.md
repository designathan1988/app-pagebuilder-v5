# EST-L09a-091 × GRE-EST-L09a-091-01 → GRL-EST-L09a-091-01
- **Estado:** EST-L09a-091
- **Escritor:** GRE-EST-L09a-091-01 (setExpanded): ENT-L09a-0095
- **Leitor:** GRL-EST-L09a-091-01 (UnitMenu): ENT-L09a-0095
## Estados deixados por A
- V1 recolhido, no primeiro render `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`
- V2 alternado pelo clique `src/editor/shell/field.tsx:489` `onClick={() => setExpanded(!expanded)}`
- Recusa: não é deste item — o clique só alterna a lista do menu de unidades `src/editor/shell/field.tsx:489` `onClick={() => setExpanded(!expanded)}`
- Desmontagem: a expansão cai com o `UnitMenu` `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`
## Casos
### C1 final
- O leitor chega com o clique terminado: o `UnitMenu` lê a expansão para montar a lista de unidades `src/editor/shell/field.tsx:408` `const shownUnits = expanded ? [...menu.common, ...menu.more] : menu.common;` e para o rótulo do botão `src/editor/shell/field.tsx:488` `aria-label={t(expanded ? 'field.unit.fewer' : 'field.unit.more')}`. Resultado: ok.
### C2 intermediário
- n/a — o clique é uma gravação só; a expansão não fica a meio caminho para o leitor ler `src/editor/shell/field.tsx:489` `onClick={() => setExpanded(!expanded)}`.
### C3 em curso
- n/a — `setExpanded` agenda o próximo render; o leitor corre depois do retorno do tratador `src/editor/shell/field.tsx:489` `onClick={() => setExpanded(!expanded)}`.
### C4 desmontagem
- n/a — a expansão é estado do `UnitMenu` e cai com ele; não há leitor depois da desmontagem `src/editor/shell/field.tsx:403` `const [expanded, setExpanded] = useState(false);`.
## Resultado
- O menu de unidades passa a listar o resto das unidades e as palavras-chave, ou volta a encurtar, pela expansão lida `src/editor/shell/field.tsx:408` `const shownUnits = expanded ? [...menu.common, ...menu.more] : menu.common;`.
