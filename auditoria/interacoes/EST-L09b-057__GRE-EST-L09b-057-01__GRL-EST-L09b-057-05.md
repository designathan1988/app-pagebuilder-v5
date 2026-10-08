# EST-L09b-057 × GRE-EST-L09b-057-01 → GRL-EST-L09b-057-05
- **Estado:** EST-L09b-057
- **Escritor:** GRE-EST-L09b-057-01 (a limpeza do efeito): ENT-L09b-0035
- **Leitor:** GRL-EST-L09b-057-05 (o retorno do foco): ENT-L09b-0009
## Estados deixados por A
- **V o elemento guardado volta a ter o foco.** `src/editor/shell/shell.tsx:105` `wasFocused?.focus();` — a limpeza do efeito do preview devolve o foco ao elemento ativo guardado antes de abrir; o valor é do navegador, medido em MED-0035.
- **A recusa natural deixa o foco onde está.** `src/editor/shell/panel-field.tsx:76` `if (autoFocus) input.current?.focus();` — a guarda do efeito decide antes de escrever: sem a condição, o foco não muda.
- **A desmontagem devolve o foco.** `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();` — ao fechar, quem devolve o foco o repõe no gatilho ou no elemento guardado.
## Casos
### C1 final
- O escritor já terminou e o foco está no elemento que ele focou. O leitor lê o elemento ativo para decidir devolver o foco ao gatilho: `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();`; medido em MED-0032.
- ok — o leitor lê o elemento ativo que o escritor deixou.

### C2 intermediário
- O foco é escrito por efeitos que correm depois da pintura; entre um escritor e o leitor seguinte o valor pode ter passado por um elemento intermédio (um controlo da camada, o corpo do documento). O leitor lê o valor atual inteiro: `src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`.
- ok — o leitor lê o elemento ativo no instante, um valor inteiro.

### C3 em curso
- A escrita do foco (`src/editor/shell/popover.tsx:78` `if (placed && takesFocus) own.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();`) e a leitura (`src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`) são síncronas, no mesmo fio; a leitura nunca apanha uma escrita a meio.
- ok — a leitura é de um valor inteiro do navegador.

### C4 desmontagem
- O leitor corre ao dispensar a camada; aí devolve o foco ao gatilho: `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();`.
- ok — depois de desmontada a camada, o leitor repõe o foco no gatilho.

## Resultado
- O leitor devolve o foco ao gatilho quando o foco caiu no corpo ou em nenhum lugar: `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();`.
