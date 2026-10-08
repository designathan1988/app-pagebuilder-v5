# EST-L09b-001 × GRE-EST-L09b-001-01 → GRL-EST-L09b-001-02
- **Estado:** EST-L09b-001
- **Escritor:** GRE-EST-L09b-001-01 (a renderização do diálogo): ENT-L09b-0001
- **Leitor:** GRL-EST-L09b-001-02 (o layout effect da inscrição): ENT-L09b-0005
## Estados deixados por A
O item é a ref `panel` de `LinkPicker` (`src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);`), o elemento do diálogo do seletor. O único membro do GRE- é a renderização do diálogo (ENT-L09b-0001).

- **V1 nulo.** `src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);` — antes de o diálogo montar; é também a que o fecho deixa, porque o corpo deixa de ser desenhado: `src/editor/shell/link-picker.tsx:58` `if (open === null) return null;`.
- **V2 o elemento do diálogo.** `src/editor/shell/link-picker.tsx:70` `ref={panel}` — a renderização do diálogo preenche a ref.
- **Intermediário: inexistente.** a atribuição é feita pelo React no commit (`src/editor/shell/link-picker.tsx:70` `ref={panel}`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** a renderização não julga valor (`src/editor/shell/link-picker.tsx:70` `ref={panel}`).
- **Desmontagem: V1 de novo.** ao desmontar o diálogo o React devolve a ref a nulo; fechado, o corpo não é desenhado (`src/editor/shell/link-picker.tsx:58` `if (open === null) return null;`).

## Casos
### C1 final
O escritor já terminou: o diálogo montado deixou `src/editor/shell/link-picker.tsx:70` `ref={panel}` com o elemento. O leitor `o layout effect da inscrição` (ENT-L09b-0005) recebe a ref pela chamada `src/editor/shell/link-picker.tsx:54` `useOutsideLayer(panel, open !== null, () => closeLinkPicker(store));` e lê-a em `src/editor/shell/outside-layer.ts:39` `const own = panel.current;`: com o painel montado, `own` é o diálogo e a camada é inscrita em `src/editor/shell/outside-layer.ts:52` `layers.add(layer);`. ok — `src/editor/shell/outside-layer.ts:39` `const own = panel.current;`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: a atribuição é uma passada do React no commit (`src/editor/shell/link-picker.tsx:70` `ref={panel}`); não há meio de gesto, de grupo nem de sequência que deixe a ref a meio.

### C3 em curso
n/a — o leitor lê a ref num layout effect próprio (`src/editor/shell/outside-layer.ts:39` `const own = panel.current;`), que corre depois do commit; não há ponto em que leia a ref a meio de uma atribuição.

### C4 desmontagem
ok — fechado, o diálogo não é desenhado (`src/editor/shell/link-picker.tsx:58` `if (open === null) return null;`), o React devolve a ref a nulo, e o layout effect seguinte lê-a em `src/editor/shell/outside-layer.ts:39` `const own = panel.current;` e devolve sem inscrever, em `src/editor/shell/outside-layer.ts:40` `if (!open || !own) return;`.

## Resultado
O leitor inscreve a camada do seletor enquanto ela está aberta: `src/editor/shell/outside-layer.ts:39` `const own = panel.current;` — com o painel montado, o conjunto de camadas do editor ganha a do seletor.
