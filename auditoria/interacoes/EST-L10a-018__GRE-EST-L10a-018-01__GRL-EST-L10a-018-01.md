# EST-L10a-018 × GRE-EST-L10a-018-01 → GRL-EST-L10a-018-01
- **Estado:** EST-L10a-018
- **Escritor:** GRE-EST-L10a-018-01 (o efeito que põe o foco no palco): ENT-L10a-0004
- **Leitor:** GRL-EST-L10a-018-01 (document.activeElement): ENT-L10a-0008
## Estados deixados por A
O item é o elemento ativo do documento (`document.activeElement`, um valor do navegador). O grupo escritor é o efeito de `LayoutOverlay` (ENT-L10a-0004), que põe o foco no palco do compositor.

- **V1 o campo do painel com o foco.** É o valor que o efeito de `DoorField` observa em `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;`; o efeito do palco não o escreve.
- **V2 o palco do compositor com o foco.** `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });` — o `focus` põe o palco `stage` (`src/modules/layout-composer/ui/overlay.tsx:139` `        ref={stage}`, `src/modules/layout-composer/ui/overlay.tsx:140` `        tabIndex={-1}`) como o elemento ativo do documento, quando composto e medido.
- **V3 nenhum dos dois.** Quando a guarda do efeito não passa — sem alvo composto ou sem caixa medida — o palco não recebe o foco: `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });`; as dependências são `src/modules/layout-composer/ui/overlay.tsx:117` `  const placed = box !== null;` e `src/modules/layout-composer/ui/overlay.tsx:118` `  const composing = composer?.target ?? null;`.
- **Sem estado de recusa.** O efeito não despacha comando; o único ramo que não escreve é a guarda de `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });`, que deixa o item como estava.
- **Sem estado intermediário.** `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });` — a chamada de `focus` é uma só, síncrona.
- **Desmontagem: o item é do navegador.** O Descarte é fim-da-página: o elemento ativo vive com o documento e não tem remoção própria. A ordem de foco (qual elemento fica ativo) é valor do navegador, registrado em MED-0032 (o palco, `src/modules/layout-composer/ui/overlay.tsx:109`) e MED-0033 (a leitura do campo, `src/modules/layout-composer/ui/panel.tsx:89`).

## Casos
### C1 final
- O escritor já terminou e pôs o foco no palco: `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });`.
- O leitor chega pelo efeito de `DoorField` e lê o elemento ativo: `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;` — a comparação `document.activeElement === field.current` decide se o efeito reescreve o campo em `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` ou retorna sem o tocar.
- Qual elemento fica ativo é valor do navegador, medido em MED-0032 (o palco) e MED-0033 (o campo do painel); a composição que os alcança não se mediu.
- ok — o leitor lê o elemento ativo que o escritor deixou e decide por ele.

### C2 intermediário
- n/a — este grupo não deixa estado intermediário: `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });` é uma só chamada síncrona, e entre a guarda e a chamada não corre leitor nenhum.

### C3 em curso
- O escritor escreve numa só chamada — `src/modules/layout-composer/ui/overlay.tsx:120` `    if (composing !== null && placed) stage.current?.focus({ preventScroll: true });` — e o leitor lê numa só comparação — `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;`; o escritor não tem assinatura de store sobre este item.
- ok — o leitor vê o elemento ativo antes ou depois da chamada, nunca a meio.

### C4 desmontagem
- O escritor vive no efeito de `LayoutOverlay`, a camada do canvas (`src/modules/layout-composer/ui/overlay.tsx:119` `  useEffect(() => {`); ao desmontar essa camada o palco sai do documento, e o leitor, que vive no efeito de `DoorField`, continua a ler `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;`.
- O leitor compara `document.activeElement` com `field.current` e não cita o palco; com o palco desmontado a comparação decide sem ele, reescrevendo o campo em `src/modules/layout-composer/ui/panel.tsx:90` `    field.current.value = value;` ou retornando.
- ok — o leitor lê o elemento ativo depois da desmontagem do escritor e decide sem depender do palco.

## Resultado
- O leitor lê o elemento ativo do documento e decide se reescreve o campo: `src/modules/layout-composer/ui/panel.tsx:89` `    if (field.current === null || document.activeElement === field.current) return;`.
