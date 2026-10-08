# EST-L10a-016 × GRE-EST-L10a-016-01 → GRL-EST-L10a-016-01
- **Estado:** EST-L10a-016
- **Escritor:** GRE-EST-L10a-016-01 (o efeito de DoorField): ENT-L10a-0008
- **Leitor:** GRL-EST-L10a-016-01 (field.current): ENT-L10a-0009, ENT-L10a-0010
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
- O leitor chega pela submissão do formulário (ENT-L10a-0009) ou pela saída do campo (ENT-L10a-0010) e captura o elemento: `src/modules/layout-composer/ui/panel.tsx:95` `    const input = field.current;`. Com o campo montado (V2/V3) `input` é o `<input>`; com o item em V1 é nulo.
- Com o elemento, o leitor decide em `src/modules/layout-composer/ui/panel.tsx:96` `    if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;`: sem digitação pendente o campo mostra o valor do documento e nada é despachado; com digitação, segue ao despacho de `src/modules/layout-composer/ui/panel.tsx:97` `    const outcome = (store.dispatch as (id: CommandId, args: unknown) => DispatchResult)(entry.command.id, { ...entry.door.args, [arg]: input.value });`.
- ok — o leitor lê o elemento que o escritor deixou e decide por ele.

### C2 intermediário
- n/a — este grupo não deixa estado intermediário: `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` é uma só instrução síncrona, e entre ela e a guarda de `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;` não corre leitor nenhum.

### C3 em curso
- O escritor escreve o item numa só instrução — `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` — e o leitor lê numa só captura — `src/modules/layout-composer/ui/panel.tsx:95` `    const input = field.current;`; não há assinatura de store sobre este item, de modo que nenhum caminho corre entre a leitura e a escrita.
- ok — o leitor vê o elemento antes ou depois da escrita, nunca a meio.

### C4 desmontagem
- n/a — o escritor e o leitor vivem no mesmo componente `DoorField` (`src/modules/layout-composer/ui/panel.tsx:82` `function DoorField({ entry, value, type = 'text', arg = 'value' }: { readonly entry: DoorEntry; readonly value: string; readonly type?: 'text' | 'number'; readonly arg?: string }) {`); desmontá-lo remove o efeito e os manipuladores que leem `field.current` (`src/modules/layout-composer/ui/panel.tsx:104` `      keep();`), e não há leitura do item depois disso.

## Resultado
- O leitor lê o elemento do campo que o efeito deixou e decide se despacha o comando: `src/modules/layout-composer/ui/panel.tsx:96` `    if (input === null || !door.available || input.value === (input.dataset.shown ?? value)) return;`.
