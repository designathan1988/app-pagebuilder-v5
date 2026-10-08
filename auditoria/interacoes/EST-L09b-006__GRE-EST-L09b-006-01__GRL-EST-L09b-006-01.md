# EST-L09b-006 × GRE-EST-L09b-006-01 → GRL-EST-L09b-006-01
- **Estado:** EST-L09b-006
- **Escritor:** GRE-EST-L09b-006-01 (a renderização do input): ENT-L09b-0006
- **Leitor:** GRL-EST-L09b-006-01 (o efeito de autoFocus): ENT-L09b-0006
## Estados deixados por A
O item é a ref `input` do campo de painel (`src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);`), o input que o efeito de autoFocus focaliza. O único membro do GRE- é a renderização do input (ENT-L09b-0006).

- **V1 nulo.** `src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);` — antes de o input montar.
- **V2 o input montado.** `src/editor/shell/panel-field.tsx:98` `ref={input}` — a renderização do input preenche a ref.
- **Intermediário: inexistente.** a atribuição é feita pelo React no commit (`src/editor/shell/panel-field.tsx:98` `ref={input}`); não há meio de gesto, de grupo nem de sequência.
- **Recusa: sem estado.** a renderização não julga valor (`src/editor/shell/panel-field.tsx:98` `ref={input}`).
- **Desmontagem: V1 de novo.** ao desmontar o input o React devolve a ref a nulo (`src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);`).

## Casos
### C1 final
O escritor já terminou: o input montado deixou `src/editor/shell/panel-field.tsx:98` `ref={input}` com o elemento. O leitor `o efeito de autoFocus` lê a ref em `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();`: com `autoFocus` verdadeiro o campo recebe o foco. ok — `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();`.

### C2 intermediário
n/a — o escritor não deixa estado intermediário: a atribuição é uma passada do React no commit (`src/editor/shell/panel-field.tsx:98` `ref={input}`); não há meio de gesto, de grupo nem de sequência que deixe a ref a meio.

### C3 em curso
n/a — o leitor lê a ref num efeito próprio (`src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();`), que corre depois do commit; não há ponto em que leia a ref a meio de uma atribuição.

### C4 desmontagem
n/a — o leitor e o escritor vivem na mesma componente (`src/editor/shell/panel-field.tsx:69` `const input = useRef<HTMLInputElement>(null);`); desmontado o campo, a ref é descartada com ele e o efeito não corre.

## Resultado
O leitor leva o foco ao campo do painel quando `autoFocus` o pede: `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();`.
