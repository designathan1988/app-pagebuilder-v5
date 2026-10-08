# EST-L05a-034 × GRE-EST-L05a-034-06 → GRL-EST-L05a-034-08
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-06 (offer): ENT-L05a-0054
- **Leitor:** GRL-EST-L05a-034-08 (onMouseDown): ENT-L05a-0047
## Estados deixados por A
- **V-sem-oferta.** `src/editor/input/pointer/drag.ts:95` `ps.dragging.side = null;` — sem alvo nem porta, larga a oferta lateral.
- **V-oferta-desarmada.** `src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };` — a oferta nova entra desarmada, com a recusa que o envolvimento encontraria guardada.
- **V-da-permanência.** `src/editor/input/pointer/drag.ts:105` `ps.dwell = setTimeout(() => {` arma a permanência da oferta; `src/editor/input/pointer/drag.ts:92` `if (ps.dwell !== null) clearTimeout(ps.dwell);` desarma o temporizador anterior.
- **V-oferta-armada.** `src/editor/input/pointer/drag.ts:108` `ps.dragging.side = { ...ps.dragging.side, armed: true, pill: { x: ps.pointerAt.x + PILL_OFFSET[0], y: ps.pointerAt.y + PILL_OFFSET[1] } };` — a oferta confirmada fica armada, com a pílula desenhada no ponteiro.
- **Sem recusa.** A recusa entra como dado da oferta (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`); nenhuma linha do grupo deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`).
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
