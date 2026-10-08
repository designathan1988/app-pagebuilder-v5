# EST-L09a-011 × GRE-EST-L09a-011-01 → GRL-EST-L09a-011-01
- **Estado:** EST-L09a-011
- **Escritor:** GRE-EST-L09a-011-01 (kept.current): ENT-L09a-0011, ENT-L09a-0012, ENT-L09a-0013
- **Leitor:** GRL-EST-L09a-011-01 (kept.current): ENT-L09a-0011
## Estados deixados por A
- **V1 — a referência inicial falsa.** `src/editor/shell/breakpoints-dialog.tsx:177` `const kept = useRef(false);` — a célula abre sem valor guardado.
- **V2 — um valor guardado.** `src/editor/shell/breakpoints-dialog.tsx:186` `kept.current = true;` — o `keep` do campo marca que acabou de guardar um valor; é o que ele deixa antes do efeito seguinte (ENT-L09a-0012 e ENT-L09a-0013).
- **V1 — reposta pelo efeito.** `src/editor/shell/breakpoints-dialog.tsx:181` `kept.current = false;` — o efeito do campo repõe a marca, de modo que a reposição do valor mostrado só acontece na passagem em que houve guarda.
- **Sem estado intermediário.** `src/editor/shell/breakpoints-dialog.tsx:186` `kept.current = true;` e `src/editor/shell/breakpoints-dialog.tsx:181` `kept.current = false;` são instruções síncronas; nenhum gesto, grupo ou sequência escreve EST-L09a-011.
- **Sem estado de recusa.** O `keep` só marca quando vai despachar `src/editor/shell/breakpoints-dialog.tsx:184` `if (!field.available || typed.trim() === shown) return;`; a recusa da store não toca na referência.
## Casos
### C1 final
- O escritor já terminou: `kept.current` ficou verdadeiro — `src/editor/shell/breakpoints-dialog.tsx:186` `kept.current = true;`.
- O leitor chega no efeito do campo, na passagem em que `shown` ou a mensagem mudam, e lê a marca: `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`.
- Com a marca verdadeira, o valor mostrado é reposto mesmo com o foco no campo; e o leitor repõe a marca `src/editor/shell/breakpoints-dialog.tsx:181` `kept.current = false;`.
- ok — o leitor lê a marca que o escritor deixou e repõe o valor da tabela no campo.
### C2 intermediário
- ok — o leitor chega com o escritor a meio: entre `src/editor/shell/breakpoints-dialog.tsx:186` `kept.current = true;` e a reposição de `src/editor/shell/breakpoints-dialog.tsx:181` `kept.current = false;`, a marca está verdadeira, e é exactamente nessa passagem que o efeito lê `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`.
### C3 em curso
- n/a — o escritor `keep` corre síncrono no envio ou no `onBlur` `src/editor/shell/breakpoints-dialog.tsx:184` `if (!field.available || typed.trim() === shown) return;`; o leitor corre no efeito seguinte, e nenhum está a meio quando o outro chega.
### C4 desmontagem
- n/a — quando a célula desmonta, a referência `kept` perde-se com o componente `src/editor/shell/breakpoints-dialog.tsx:177` `const kept = useRef(false);`, e o efeito que a lê já não corre.
## Resultado
- O leitor lê a marca de valor guardado e, quando ela é verdadeira, repõe no campo o valor que a tabela mostra mesmo com o foco nele: `src/editor/shell/breakpoints-dialog.tsx:180` `if (input.current !== null && (kept.current || document.activeElement !== input.current)) input.current.value = shown;`.
