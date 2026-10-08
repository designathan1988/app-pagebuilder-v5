# EST-L09a-163 × GRE-EST-L09a-163-01 → GRL-EST-L09a-163-01
- **Estado:** EST-L09a-163
- **Escritor:** GRE-EST-L09a-163-01 (DeclarationsField): ENT-L09a-0186, ENT-L09a-0187, ENT-L09a-0188, ENT-L09a-0189
- **Leitor:** GRL-EST-L09a-163-01 (DeclarationsField): ENT-L09a-0187, ENT-L09a-0188, ENT-L09a-0189
## Estados deixados por A
O item é a ref `shown` de `DeclarationsField` (`src/editor/shell/inspector.tsx:483` `const shown = useRef('');`), o texto das declarações por último mostrado no campo. Os membros do GRE- gravam-na por três entradas da mesma componente.

- **V1 o texto do documento.** `src/editor/shell/inspector.tsx:483` `const shown = useRef('');` — o valor da criação; o efeito repõe as declarações do nó: `src/editor/shell/inspector.tsx:490` `shown.current = stored;` (ENT-L09a-0186).
- **V2 o texto digitado.** `src/editor/shell/inspector.tsx:498` `shown.current = element.value;` — o `keep` do envio (ENT-L09a-0188) e da saída (ENT-L09a-0189); ENT-L09a-0187 inscreve os dois ouvintes pelo mesmo `keep`.
- **Intermediário: inexistente.** `src/editor/shell/inspector.tsx:498` `shown.current = element.value;` é uma só instrução síncrona; não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado distinto.** `keep` escreve a ref antes de despachar (`src/editor/shell/inspector.tsx:498` `shown.current = element.value;`), e o nó ausente só impede o despacho (`src/editor/shell/inspector.tsx:501` `if (locate(store.getState().document, args.target) === null) return;`).
- **Desmontagem: sem estado.** a ref é descartada com a componente (`src/editor/shell/inspector.tsx:483` `const shown = useRef('');`); a limpeza do efeito ainda chama `keep`, `src/editor/shell/inspector.tsx:514` `keep();`.

## Casos
### C1 final
O escritor já terminou: o efeito deixou `src/editor/shell/inspector.tsx:490` `shown.current = stored;`. O leitor `keep` chega pelo envio (`src/editor/shell/inspector.tsx:509` `row.addEventListener('submit', submit);`) ou pela saída (`src/editor/shell/inspector.tsx:510` `element.addEventListener('blur', keep);`) e lê a ref em `src/editor/shell/inspector.tsx:497` `if (element.value === shown.current) return;`: com o texto diferente do mostrado, o guarda não devolve e o comando corre em `src/editor/shell/inspector.tsx:502` `(store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(command, { ...args, [filled]: text });`. ok — `src/editor/shell/inspector.tsx:497` `if (element.value === shown.current) return;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: as escritas são instruções síncronas únicas — `src/editor/shell/inspector.tsx:498` `shown.current = element.value;` e `src/editor/shell/inspector.tsx:490` `shown.current = stored;` —, e nenhum meio de gesto, de grupo ou de sequência as interrompe.

### C3 em curso
n/a — o escritor e o leitor correm na mesma chamada síncrona (`keep` abre em `src/editor/shell/inspector.tsx:496` `const keep = () => {`) ou no efeito de montagem (`src/editor/shell/inspector.tsx:487` `useEffect(() => {`); não há espera entre a leitura da linha `src/editor/shell/inspector.tsx:497` `if (element.value === shown.current) return;` e a escrita seguinte.

### C4 desmontagem
n/a — a ref e o leitor vivem na mesma componente (`src/editor/shell/inspector.tsx:483` `const shown = useRef('');`); a desmontagem remove os dois ouvintes (`src/editor/shell/inspector.tsx:512` `row.removeEventListener('submit', submit);`) e descarta a ref.

## Resultado
O leitor `keep` decide se grava as declarações do elemento: `src/editor/shell/inspector.tsx:497` `if (element.value === shown.current) return;` — só quando o texto difere do mostrado ele o guarda em `src/editor/shell/inspector.tsx:498` `shown.current = element.value;` e despacha o comando das declarações.
