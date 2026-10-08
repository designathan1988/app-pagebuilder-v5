# EST-L05a-034 × GRE-EST-L05a-034-09 → GRL-EST-L05a-034-08
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-09 (onLostCapture): ENT-L05a-0045
- **Leitor:** GRL-EST-L05a-034-08 (onMouseDown): ENT-L05a-0047
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` — larga o ponteiro capturado.
- **V-intacto.** `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` — a captura perdida de outro ponteiro não escreve.
- **V-adicional.** `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();` — com o botão ainda pressionado, cancela o gesto (a máquina é escrita pelo grupo de onCancel).
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` é uma só instrução.
## Casos
### C1 final
- Lê o pedido de manter o foco em `src/editor/input/pointer/events.ts:574` `const keep = ps.keepFocus;` e consome-o (`src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;`).
- Com o pedido, impede a ação por omissão do navegador (`src/editor/input/pointer/events.ts:577` `if (keep || toolbar || onOwnOption(event.target) || (event.button === 2 && event.target instanceof Element && event.target.closest(EDITOR_MENU_AREA))) event.preventDefault();`).
- ok — o leitor lê e consome o pedido.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;` é uma só instrução.

### C3 em curso
- n/a — o mousedown corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de mousedown (`src/editor/input/pointer.ts:241` `target.removeEventListener('mousedown', p.onMouseDown, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor impede o navegador de tirar o foco quando o pedido guardado existe: `src/editor/input/pointer/events.ts:577` `if (keep || toolbar || onOwnOption(event.target) || (event.button === 2 && event.target instanceof Element && event.target.closest(EDITOR_MENU_AREA))) event.preventDefault();`.
