# EST-L09a-054 × GRE-EST-L09a-054-01 → GRL-EST-L09a-054-02
- **Estado:** EST-L09a-054
- **Escritor:** GRE-EST-L09a-054-01 (setQuery): ENT-L09a-0062, ENT-L09a-0063
- **Leitor:** GRL-EST-L09a-054-02 (scopeOf(query)): ENT-L09a-0063
## Estados deixados por A
- V1 a consulta vazia, no primeiro render `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
- V2 o texto digitado, gravado pelo `onChange` `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}`
- V3 o prefixo da cápsula diante das palavras `src/editor/shell/command-bar.tsx:200` `scopeOf(query).words`
- Recusa: não é deste item — a consulta não é comando `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}`
- Desmontagem: a consulta cai com o componente `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
## Casos
### C1 final
- O leitor chega com o `onChange` terminado: `scopeOf(query)` lê a consulta para marcar a cápsula `src/editor/shell/command-bar.tsx:197` `scopeOf(query).prefix === pill.prefix ? ' is-current' : ''`; a cápsula do prefixo corrente fica pressionada `src/editor/shell/command-bar.tsx:198` `aria-pressed={scopeOf(query).prefix === pill.prefix}`. Resultado: ok.
### C2 intermediário
- n/a — `setQuery` é uma gravação só; a consulta lida por `scopeOf` é sempre o valor acabado `src/editor/shell/command-bar.tsx:200` `scopeOf(query).words`.
### C3 em curso
- n/a — o leitor corre no render seguinte ao `setQuery`, não durante a gravação `src/editor/shell/command-bar.tsx:200` `scopeOf(query).words`.
### C4 desmontagem
- n/a — a consulta cai com `CommandBarDialog`; sem componente não há cápsula a marcar `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`.
## Resultado
- A cápsula cujo prefixo casa com a consulta é desenhada pressionada `src/editor/shell/command-bar.tsx:198` `aria-pressed={scopeOf(query).prefix === pill.prefix}`.
