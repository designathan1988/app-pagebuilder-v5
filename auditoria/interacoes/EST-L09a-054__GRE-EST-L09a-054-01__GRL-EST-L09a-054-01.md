# EST-L09a-054 × GRE-EST-L09a-054-01 → GRL-EST-L09a-054-01
- **Estado:** EST-L09a-054
- **Escritor:** GRE-EST-L09a-054-01 (setQuery): ENT-L09a-0062, ENT-L09a-0063
- **Leitor:** GRL-EST-L09a-054-01 (leitura de query): ENT-L09a-0062
## Estados deixados por A
- V1 a consulta vazia, no primeiro render `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
- V2 o texto digitado, gravado pelo `onChange` `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}`
- V3 o prefixo da cápsula diante das palavras `src/editor/shell/command-bar.tsx:200` `scopeOf(query).words`
- Recusa: não é deste item — nenhuma porta aqui é comando que possa ser recusado; a consulta só filtra a lista `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}`
- Desmontagem: a consulta é estado do componente e cai com ele `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`
## Casos
### C1 final
- O leitor chega com o `onChange` terminado: o memo da lista mostrada lê a consulta `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`; o memo das oferecidas também lê a consulta `src/editor/shell/command-bar.tsx:88` `const asked = query.trim().toLowerCase();` e `src/editor/shell/command-bar.tsx:97` `const asked = askedSet(query);`. Resultado: ok.
### C2 intermediário
- n/a — `setQuery` é uma gravação só; a consulta não fica num valor a meio caminho para o leitor ler `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}`.
### C3 em curso
- n/a — a gravação de `setQuery` agenda o próximo render; o leitor corre depois do retorno do tratador, nunca durante a gravação `src/editor/shell/command-bar.tsx:186` `onChange={(event) => setQuery(event.target.value)}`.
### C4 desmontagem
- n/a — a consulta é estado de `CommandBarDialog` e cai com ele; não há leitor depois da desmontagem `src/editor/shell/command-bar.tsx:54` `const [query, setQuery] = useState('');`.
## Resultado
- A barra refiltra as entradas oferecidas e mostradas pela consulta lida `src/editor/shell/command-bar.tsx:134` `const shown = useMemo(() => shownEntries(query, offered, recentEntries()), [query, offered]);`.
