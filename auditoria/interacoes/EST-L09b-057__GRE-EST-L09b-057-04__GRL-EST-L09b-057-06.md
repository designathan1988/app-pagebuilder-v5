# EST-L09b-057 × GRE-EST-L09b-057-04 → GRL-EST-L09b-057-06
- **Estado:** EST-L09b-057
- **Escritor:** GRE-EST-L09b-057-04 (input.current.focus): ENT-L09b-0046
- **Leitor:** GRL-EST-L09b-057-06 (usePreviewModal): ENT-L09b-0035
## Estados deixados por A
- **V o campo da página toma o foco.** `src/editor/shell/sidebar/explorer.tsx:78` `input.current.focus();` — o efeito da página recém-criada põe o foco no campo.
- **A recusa natural deixa o foco onde está.** `src/editor/shell/panel-field.tsx:76` `if (autoFocus) input.current?.focus();` — a guarda do efeito decide antes de escrever: sem a condição, o foco não muda.
- **A desmontagem devolve o foco.** `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();` — ao fechar, quem devolve o foco o repõe no gatilho ou no elemento guardado.
## Casos
### C1 final
- O escritor já terminou e o foco está no elemento que ele focou. O leitor lê o elemento ativo antes de o preview abrir, para o devolver depois: `src/editor/shell/shell.tsx:99` `const wasFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;`; medido em MED-0035.
- ok — o leitor lê o elemento ativo que o escritor deixou.

### C2 intermediário
- O foco é escrito por efeitos que correm depois da pintura; entre um escritor e o leitor seguinte o valor pode ter passado por um elemento intermédio (um controlo da camada, o corpo do documento). O leitor lê o valor atual inteiro: `src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`.
- ok — o leitor lê o elemento ativo no instante, um valor inteiro.

### C3 em curso
- A escrita do foco (`src/editor/shell/popover.tsx:78` `if (placed && takesFocus) own.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();`) e a leitura (`src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`) são síncronas, no mesmo fio; a leitura nunca apanha uma escrita a meio.
- ok — a leitura é de um valor inteiro do navegador.

### C4 desmontagem
- O leitor corre na limpeza do efeito, ao fechar o preview; aí devolve o foco ao elemento guardado: `src/editor/shell/shell.tsx:105` `wasFocused?.focus();`.
- ok — depois de desmontado o preview, o leitor repõe o foco guardado.

## Resultado
- O leitor guarda o elemento a que devolverá o foco ao fechar o preview: `src/editor/shell/shell.tsx:105` `wasFocused?.focus();`.
