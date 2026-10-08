# EST-L09b-057 × GRE-EST-L09b-057-03 → GRL-EST-L09b-057-02
- **Estado:** EST-L09b-057
- **Escritor:** GRE-EST-L09b-057-03 (focus): ENT-L09b-0083
- **Leitor:** GRL-EST-L09b-057-02 (document.activeElement): ENT-L09b-0045
## Estados deixados por A
- **V o campo do nome toma o foco.** `src/editor/shell/variables.tsx:75` `name?.focus();` — o efeito da variável recém-criada põe o foco no campo do nome.
- **A recusa natural deixa o foco onde está.** `src/editor/shell/panel-field.tsx:76` `if (autoFocus) input.current?.focus();` — a guarda do efeito decide antes de escrever: sem a condição, o foco não muda.
- **A desmontagem devolve o foco.** `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();` — ao fechar, quem devolve o foco o repõe no gatilho ou no elemento guardado.
## Casos
### C1 final
- O escritor já terminou e o foco está no elemento que ele focou. O leitor lê o elemento ativo para não reescrever o campo que o tem: `src/editor/shell/sidebar/explorer.tsx:70` `if (input.current !== null && document.activeElement !== input.current) input.current.value = page.name;`.
- ok — o leitor lê o elemento ativo que o escritor deixou.

### C2 intermediário
- O foco é escrito por efeitos que correm depois da pintura; entre um escritor e o leitor seguinte o valor pode ter passado por um elemento intermédio (um controlo da camada, o corpo do documento). O leitor lê o valor atual inteiro: `src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`.
- ok — o leitor lê o elemento ativo no instante, um valor inteiro.

### C3 em curso
- A escrita do foco (`src/editor/shell/popover.tsx:78` `if (placed && takesFocus) own.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();`) e a leitura (`src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`) são síncronas, no mesmo fio; a leitura nunca apanha uma escrita a meio.
- ok — a leitura é de um valor inteiro do navegador.

### C4 desmontagem
- n/a — o leitor corre num efeito enquanto o campo está montado; depois de ele desmontar a ref é nula e a guarda retorna (`src/editor/shell/sidebar/explorer.tsx:70` `if (input.current !== null && document.activeElement !== input.current) input.current.value = page.name;`).
- n/a — o leitor não corre depois da desmontagem.

## Resultado
- O leitor escreve o nome da página no campo só quando o campo não tem o foco: `src/editor/shell/sidebar/explorer.tsx:70` `if (input.current !== null && document.activeElement !== input.current) input.current.value = page.name;`.
