# EST-L09a-158 × GRE-EST-L09a-158-01 → GRL-EST-L09a-158-01
- **Estado:** EST-L09a-158
- **Escritor:** GRE-EST-L09a-158-01 (AddProperty): ENT-L09a-0185
- **Leitor:** GRL-EST-L09a-158-01 (AddProperty): ENT-L09a-0185
## Estados deixados por A
- **V1 texto vazio.** `src/editor/shell/inspector.tsx:370` `const [query, setQuery] = useState('');` — o valor da criação do componente, antes de qualquer digitação.
- **V2 o texto digitado.** `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}` — o produtor é o valor do campo `event.currentTarget.value` a cada mudança (ENT-L09a-0185).
- **Intermediário: o texto a meio da digitação.** `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}` — cada tecla grava o texto até ali; entre elas há textos com espaços nas pontas, que o leitor apara em `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());`, e textos sem correspondência.
- **Sem estado de recusa.** `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}` — o tratador não tem condição: toda mudança do campo grava.
- **Desmontagem do campo: o último texto fica.** `src/editor/shell/inspector.tsx:416` `{open ? (` — fechar o menu desmonta o campo, e nenhuma linha zera o estado (a única escrita de `setQuery` é `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}`); o texto vive enquanto `AddProperty` vive.
## Casos
### C1 final
- O escritor terminou: `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}` deixou o texto final.
- O leitor chega na renderização seguinte: `src/editor/shell/inspector.tsx:405` `.filter((target) => {` percorre as propriedades do catálogo, `src/editor/shell/inspector.tsx:406` `if (!hiddenTargets.has(target)) return false;` descarta as que não estão escondidas e `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());` guarda as cujo rótulo e nome contêm o texto.
- O DOM acompanha: `src/editor/shell/inspector.tsx:431` `value={query}` mostra o texto no campo, `src/editor/shell/inspector.tsx:441` `{hidden.map((target, i) => (` desenha só as que casam e `src/editor/shell/inspector.tsx:388` `}, [open, query, mode, revealed, node, kindsKey]);` roda de novo o efeito que marca a primeira opção.
- ok — a lista mostra as propriedades que casam com o texto final.
### C2 intermediário
- O escritor deixou um texto só com espaços: `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());` apara para o texto vazio e `words.includes('')` é verdadeiro, então a lista mostra todas as escondidas.
- O escritor deixou um texto sem correspondência: `hidden` fica vazio e `src/editor/shell/inspector.tsx:439` `{hidden.length === 0 ? <p className="add-property__none">{hiddenTargets.size === 0 || mode === 'all' ? t('inspector.addProperty.none') : t('inspector.addProperty.noMatch', { query: query.trim() })}</p> : null}` diz que nada casa e repete o texto aparado.
- Maiúsculas: `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());` compara com `src/editor/shell/inspector.tsx:408` `const words = `${label === undefined ? '' : t(label as MessageId)} ${target}`.toLowerCase();`, ambos em minúsculas.
- ok — cada texto intermediário dá uma lista coerente com ele.
### C3 em curso
- O escritor corre dentro do tratador do campo: `src/editor/shell/inspector.tsx:432` `onChange={(event) => setQuery(event.currentTarget.value)}`; o leitor `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());` está dentro do corpo do componente (`src/editor/shell/inspector.tsx:361` `function AddProperty() {`) e roda na renderização, não dentro do tratador.
- O fluxo do grupo não cita `await`, timer, quadro nem ouvinte (ENT-L09a-0185, Fronteiras assíncronas), então nenhuma renderização do leitor cai no meio da escrita.
- ok — o leitor só vê o texto anterior à escrita ou o texto posterior a ela.
### C4 desmontagem
- O menu fecha: `src/editor/shell/inspector.tsx:416` `{open ? (` deixa de desenhar o campo, o escritor.
- O leitor segue rodando a cada renderização de `AddProperty` com o texto retido, porque o cálculo de `hidden` está fora do ramo `open`: `src/editor/shell/inspector.tsx:400` `const hidden =` e `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());`; a lista não é desenhada, pois `src/editor/shell/inspector.tsx:441` `{hidden.map((target, i) => (` está dentro do ramo `open`.
- Ao abrir de novo, `src/editor/shell/inspector.tsx:431` `value={query}` mostra o texto retido e a lista parte filtrada por ele; `src/editor/shell/inspector.tsx:387` `if (open && input) setActiveOption(input, options, options.length > 0 ? 0 : null);` marca a primeira opção dessa lista.
- ok — depois da desmontagem do campo, o leitor lê o último texto e não desenha nada até o menu abrir.
## Resultado
- O leitor decide, a partir do texto guardado, quais propriedades escondidas a lista mostra: `src/editor/shell/inspector.tsx:409` `return words.includes(query.trim().toLowerCase());`.
