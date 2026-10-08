# EST-L09b-057 × GRE-EST-L09b-057-09 → GRL-EST-L09b-057-03
- **Estado:** EST-L09b-057
- **Escritor:** GRE-EST-L09b-057-09 (usePreviewModal): ENT-L09b-0035
- **Leitor:** GRL-EST-L09b-057-03 (judge): ENT-L09b-0023
## Estados deixados por A
- **V o foco entra no preview.** `src/editor/shell/shell.tsx:102` `(first ?? preview).focus();` — usePreviewModal põe o foco no primeiro controlo do preview, ou nele; medido em MED-0035.
- **A recusa natural deixa o foco onde está.** `src/editor/shell/panel-field.tsx:71` `if (autoFocus) input.current?.focus();` — a guarda do efeito decide antes de escrever: sem a condição, o foco não muda.
- **A desmontagem devolve o foco.** `src/editor/shell/popover.tsx:30` `if (dismissed && (document.activeElement === null || document.activeElement === document.body)) trigger.current?.focus();` — ao fechar, quem devolve o foco o repõe no gatilho ou no elemento guardado.
## Casos
### C1 final
- O escritor já terminou e o foco está no elemento que ele focou. O leitor lê o elemento ativo para saber se um campo está a ser digitado: `src/editor/shell/row-fit.ts:107` `const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement ? document.activeElement : null;`; medido em MED-0034.
- ok — o leitor lê o elemento ativo que o escritor deixou.

### C2 intermediário
- O foco é escrito por efeitos que correm depois da pintura; entre um escritor e o leitor seguinte o valor pode ter passado por um elemento intermédio (um controlo da camada, o corpo do documento). O leitor lê o valor atual inteiro: `src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`.
- ok — o leitor lê o elemento ativo no instante, um valor inteiro.

### C3 em curso
- A escrita do foco (`src/editor/shell/popover.tsx:78` `if (placed && takesFocus) own.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();`) e a leitura (`src/editor/shell/outside-layer.ts:55` `const focused = document.activeElement;`) são síncronas, no mesmo fio; a leitura nunca apanha uma escrita a meio.
- ok — a leitura é de um valor inteiro do navegador.

### C4 desmontagem
- n/a — o leitor `judge` é uma função pura da medição da linha (`src/editor/shell/row-fit.ts:107` `const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement ? document.activeElement : null;`); não guarda assinatura, e a desmontagem não deixa nada dele.
- n/a — o leitor não corre depois da desmontagem.

## Resultado
- O leitor decide se mede contra o campo em digitação ou contra a linha: `src/editor/shell/row-fit.ts:107` `const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement ? document.activeElement : null;`.
