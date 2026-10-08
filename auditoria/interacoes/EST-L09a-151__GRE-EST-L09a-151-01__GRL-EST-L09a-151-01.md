# EST-L09a-151 × GRE-EST-L09a-151-01 → GRL-EST-L09a-151-01
- **Estado:** EST-L09a-151
- **Escritor:** GRE-EST-L09a-151-01 (CustomAttributeRow): ENT-L09a-0171, ENT-L09a-0172, ENT-L09a-0173, ENT-L09a-0174
- **Leitor:** GRL-EST-L09a-151-01 (CustomAttributeRow): ENT-L09a-0172, ENT-L09a-0173, ENT-L09a-0174
## Estados deixados por A
O item é a ref `shown` de `CustomAttributeRow` (`src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`), o valor por último mostrado no campo do atributo. Os membros do GRE- gravam-na por três entradas da mesma componente.

- **V1 o valor do documento.** `src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);` — o valor da criação; o efeito de montagem repõe-no quando o valor ou a mensagem da store mudam: `src/editor/shell/inspector-settings.tsx:183` `shown.current = value;` (ENT-L09a-0171).
- **V2 o texto digitado.** `src/editor/shell/inspector-settings.tsx:191` `shown.current = element.value;` — o `keep` do envio (ENT-L09a-0173) e da saída (ENT-L09a-0174); ENT-L09a-0172 inscreve os dois ouvintes pelo mesmo `keep`.
- **Intermediário: inexistente.** `src/editor/shell/inspector-settings.tsx:191` `shown.current = element.value;` é uma só instrução síncrona; não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado distinto.** `keep` escreve a ref antes de despachar (`src/editor/shell/inspector-settings.tsx:191` `shown.current = element.value;`), e o nó ausente só impede o despacho (`src/editor/shell/inspector-settings.tsx:194` `if (locate(store.getState().document, node.id) === null) return;`): `shown.current` fica com o texto digitado.
- **Desmontagem: sem estado.** a ref é descartada com a linha (`src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`); a limpeza do efeito ainda chama `keep`, `src/editor/shell/inspector-settings.tsx:207` `keep();`.

## Casos
### C1 final
O escritor já terminou: o efeito de montagem deixou `src/editor/shell/inspector-settings.tsx:183` `shown.current = value;`. O leitor `keep` chega pelo envio (`src/editor/shell/inspector-settings.tsx:202` `row.addEventListener('submit', submit);`) ou pela saída (`src/editor/shell/inspector-settings.tsx:203` `element.addEventListener('blur', keep);`) e lê a ref em `src/editor/shell/inspector-settings.tsx:190` `if (element.value === shown.current) return;`: com o texto diferente do mostrado, o guarda não devolve e o comando corre em `src/editor/shell/inspector-settings.tsx:195` `(store.dispatch as (id: CommandId, a: unknown) => DispatchResult)(valueEntry.command.id, { name, value: text });`. ok — `src/editor/shell/inspector-settings.tsx:190` `if (element.value === shown.current) return;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: as escritas são instruções síncronas únicas — `src/editor/shell/inspector-settings.tsx:191` `shown.current = element.value;` e `src/editor/shell/inspector-settings.tsx:183` `shown.current = value;` —, e nenhum meio de gesto, de grupo ou de sequência as interrompe.

### C3 em curso
n/a — o escritor e o leitor correm na mesma chamada síncrona (`keep` abre em `src/editor/shell/inspector-settings.tsx:189` `const keep = () => {`) ou no efeito de montagem (`src/editor/shell/inspector-settings.tsx:180` `useEffect(() => {`); não há espera entre a leitura da linha `src/editor/shell/inspector-settings.tsx:190` `if (element.value === shown.current) return;` e a escrita seguinte.

### C4 desmontagem
n/a — a ref e o leitor vivem na mesma componente (`src/editor/shell/inspector-settings.tsx:178` `const shown = useRef(value);`); a desmontagem remove os dois ouvintes (`src/editor/shell/inspector-settings.tsx:205` `row.removeEventListener('submit', submit);`) e descarta a ref.

## Resultado
O leitor `keep` decide se grava o valor do atributo: `src/editor/shell/inspector-settings.tsx:190` `if (element.value === shown.current) return;` — só quando o texto difere do mostrado ele o guarda em `src/editor/shell/inspector-settings.tsx:191` `shown.current = element.value;` e despacha o comando do valor.
