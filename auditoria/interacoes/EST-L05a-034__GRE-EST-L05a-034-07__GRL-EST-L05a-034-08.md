# EST-L05a-034 × GRE-EST-L05a-034-07 → GRL-EST-L05a-034-08
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-07 (onCancel): ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-08 (onMouseDown): ENT-L05a-0047
## Estados deixados por A
- **V-cancelado.** `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;` — grava a máquina já cancelada.
- **V-sem-captura.** `src/editor/input/pointer/events.ts:545` `ps.captured = null;` — larga o ponteiro capturado.
- **V-sem-deslizador.** `src/editor/input/pointer/events.ts:546` `ps.sliding = null;` — larga o deslizador de campo.
- **V-sem-gestos-de-alça.** `src/editor/input/pointer/events.ts:548` `p.dropHandleGestures();` — larga os gestos das alças abertos (a ferramenta incluída).
- **Sem recusa.** O caminho entrega o cancelamento ao gesto (`src/editor/input/pointer/events.ts:551` `p.run(next.effect);`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:545` `ps.captured = null;`).
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
