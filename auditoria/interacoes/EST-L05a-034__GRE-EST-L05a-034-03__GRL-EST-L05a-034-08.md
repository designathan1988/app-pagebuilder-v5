# EST-L05a-034 × GRE-EST-L05a-034-03 → GRL-EST-L05a-034-08
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-03 (endCancelled): ENT-L05a-0038
- **Leitor:** GRL-EST-L05a-034-08 (onMouseDown): ENT-L05a-0047
## Estados deixados por A
- **V-ocioso.** `src/editor/input/pointer/effects.ts:294` `ps.machine = IDLE;` — a máquina volta a ociosa.
- **V-sem-arraste.** `src/editor/input/pointer/effects.ts:292` `ps.dragging = null;` — larga o arraste em curso.
- **V-sem-pressão.** `src/editor/input/pointer/effects.ts:293` `ps.pressed = null;` — larga a pressão guardada.
- **V-do-fim.** `src/editor/input/pointer/effects.ts:295` `p.run(effect);` — corre o efeito (cancelar ou confirmar) por último, quando a máquina já está ociosa.
- **Sem recusa.** O caminho entrega o fim ao gesto; nenhuma linha do grupo lê a recusa de um comando.
- **Sem intermediário.** As três escritas são instruções isoladas (`src/editor/input/pointer/effects.ts:292` `ps.dragging = null;`).
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
