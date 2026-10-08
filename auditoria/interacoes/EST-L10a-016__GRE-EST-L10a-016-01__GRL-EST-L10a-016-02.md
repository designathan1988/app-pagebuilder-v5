# EST-L10a-016 × GRE-EST-L10a-016-01 → GRL-EST-L10a-016-02
- **Estado:** EST-L10a-016
- **Escritor:** GRE-EST-L10a-016-01 (o efeito de DoorField): ENT-L10a-0008
- **Leitor:** GRL-EST-L10a-016-02 (o efeito de DoorField): ENT-L10a-0008
## Estados deixados por A
O item é a referência `field` do campo de porta `DoorField` (`src/modules/layout-composer/ui/panel.tsx:85` `  const field = useRef<HTMLInputElement>(null);`). O grupo escritor é o efeito de `DoorField` (ENT-L10a-0008), que lê a guarda do elemento ativo e reescreve o valor do campo.

- **V1 `null`.** `src/modules/layout-composer/ui/panel.tsx:85` `  const field = useRef<HTMLInputElement>(null);` — a referência nasce sem elemento; é o estado antes de o campo montar e aquele a que a desmontagem volta.
- **V2 o campo montado.** `src/modules/layout-composer/ui/panel.tsx:107` `      <input ref={field} className="input"` — a ligação `ref={field}` põe o `<input>` em `field.current` ao montar.
- **V3 o valor do campo reescrito com o do documento.** `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` — com o campo montado e sem o foco, o efeito escreve o valor do documento no campo.
- **Sem estado de recusa.** `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;` — sem o campo ou com o campo a deter o foco, o efeito retorna antes de escrever; o item guarda V1 ou o valor que tinha.
- **Sem estado intermediário.** `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` — a escrita é uma só instrução síncrona, entre a guarda de `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;` e a marca de `src/modules/layout-composer/ui/panel.tsx:91` `    markFieldKept(field.current, value);`.

## Casos
### C1 final
- O escritor já terminou e deixou o campo com o valor do documento: `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;`.
- O leitor é o próprio efeito numa execução seguinte — quando `value` muda, pelas dependências de `src/modules/layout-composer/ui/panel.tsx:92` `  }, [value]);` — e lê o item na guarda: `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;`.
- Com o campo montado (V2/V3) e sem o foco, a guarda é falsa e o efeito reescreve em `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;`; com o campo a deter o foco, retorna sem reescrever; com o item em V1, o primeiro membro da condição é verdadeiro e retorna.
- ok — o leitor lê o elemento que a execução anterior deixou e decide por ele.

### C2 intermediário
- n/a — este grupo não deixa estado intermediário: `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` é uma só instrução síncrona, e a leitura da guarda em `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;` acontece antes dela, na mesma execução.

### C3 em curso
- A leitura e a escrita correm na mesma execução do efeito e em sequência: a guarda lê o item em `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;` e a escrita grava em `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;`; não há assinatura de store sobre este item.
- ok — não há leitor a chegar entre a leitura e a escrita da mesma execução.

### C4 desmontagem
- n/a — o leitor é o próprio efeito de `DoorField` (`src/modules/layout-composer/ui/panel.tsx:88` `  useEffect(() => {`); desmontar o componente remove o efeito, e não há leitura do item depois disso.

## Resultado
- O efeito lê o item na sua própria guarda e decide se reescreve o valor do campo: `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;`.
