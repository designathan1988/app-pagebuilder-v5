# EST-L09b-057 × GRE-EST-L09b-057-02 → GRL-EST-L09b-057-05
- **Estado:** EST-L09b-057
- **Escritor:** GRE-EST-L09b-057-02 (a remoção do efeito): ENT-L09b-0005
- **Leitor:** GRL-EST-L09b-057-05 (o retorno do foco): ENT-L09b-0009
## Estados deixados por A
- **V o foco volta ao elemento guardado.** `src/editor/shell/outside-layer.ts:56` `if (restoreFocus && !outside && restore?.isConnected && (focused === document.body || focused === null || own.contains(focused))) restore.focus();` — a remoção do efeito devolve o foco quando ficou no corpo, em nenhum lugar ou dentro do painel; medido em MED-0031.
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
