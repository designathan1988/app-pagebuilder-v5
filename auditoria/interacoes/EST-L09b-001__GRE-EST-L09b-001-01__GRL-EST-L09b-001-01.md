# EST-L09b-001 × GRE-EST-L09b-001-01 → GRL-EST-L09b-001-01
- **Estado:** EST-L09b-001
- **Escritor:** GRE-EST-L09b-001-01 (a renderização do diálogo): ENT-L09b-0001
- **Leitor:** GRL-EST-L09b-001-01 (o efeito da abertura): ENT-L09b-0001
## Estados deixados por A
O item é a ref `panel` de `LinkPicker` (`src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);`), o elemento do diálogo do seletor. O único membro do GRE- é a renderização do diálogo (ENT-L09b-0001).

- **V1 nulo.** `src/editor/shell/link-picker.tsx:53` `const panel = useRef<HTMLDivElement>(null);` — antes de o diálogo montar; é também a que o fecho deixa, porque o corpo deixa de ser desenhado: `src/editor/shell/link-picker.tsx:58` `if (open === null) return null;`.
- **V2 o elemento do diálogo.** `src/editor/shell/link-picker.tsx:70` `ref={panel}` — a renderização do diálogo preenche a ref.
- **Intermediário: inexistente.** a atribuição é feita pelo React no commit (`src/editor/shell/link-picker.tsx:70` `ref={panel}`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** a renderização não julga valor (`src/editor/shell/link-picker.tsx:70` `ref={panel}`).
- **Desmontagem: V1 de novo.** ao desmontar o diálogo o React devolve a ref a nulo; fechado, o corpo não é desenhado (`src/editor/shell/link-picker.tsx:58` `if (open === null) return null;`).

## Casos
### C1 final
O escritor já terminou: o diálogo montado deixou `src/editor/shell/link-picker.tsx:70` `ref={panel}` com o elemento. O leitor `o efeito da abertura` lê a ref em `src/editor/shell/link-picker.tsx:56` `if (open !== null) panel.current?.focus();`: com o seletor aberto a ref aponta o diálogo, e o foco vai para ele. ok — `src/editor/shell/link-picker.tsx:56` `if (open !== null) panel.current?.focus();`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: a atribuição é uma passada do React no commit (`src/editor/shell/link-picker.tsx:70` `ref={panel}`); não há meio de gesto, de grupo nem de sequência que deixe a ref a meio.

### C3 em curso
n/a — o leitor lê a ref num efeito próprio (`src/editor/shell/link-picker.tsx:56` `if (open !== null) panel.current?.focus();`), que corre depois do commit; não há ponto em que leia a ref a meio de uma atribuição.

### C4 desmontagem
n/a — o leitor e o escritor vivem na mesma componente; quando o diálogo não é desenhado (`src/editor/shell/link-picker.tsx:58` `if (open === null) return null;`), o guarda da linha do foco falha e a ref não é lida.

## Resultado
O leitor leva o foco ao diálogo do seletor quando ele está aberto: `src/editor/shell/link-picker.tsx:56` `if (open !== null) panel.current?.focus();`.
