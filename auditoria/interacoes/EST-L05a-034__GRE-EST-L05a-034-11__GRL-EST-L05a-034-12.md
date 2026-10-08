# EST-L05a-034 × GRE-EST-L05a-034-11 → GRL-EST-L05a-034-12
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-11 (onMove): ENT-L05a-0042, ENT-L05a-0053, ENT-P-motion-0045, ENT-P-motion-0046, ENT-P-motion-0047, ENT-P-motion-0052, ENT-P-motion-0057, ENT-P-motion-0066, ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087
- **Leitor:** GRL-EST-L05a-034-12 (over): ENT-L05a-0058
## Estados deixados por A
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;` — grava a máquina (a passagem a dragging).
- **V-do-menu.** `src/editor/input/pointer/events.ts:265` `ps.menuResting = menuUnder;` grava o botão de menu sob o ponteiro; `src/editor/input/pointer/events.ts:267` `if (ps.menuDwell !== null) clearTimeout(ps.menuDwell);` desarma o temporizador anterior e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` arma o novo.
- **V-do-gesto-da-guia.** `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste de guia aberto ao passar o limiar.
- **Sem recusa.** O caminho só regista o movimento; a recusa de um comando despachado não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`).
## Casos
### C1 final
- Lê o arraste em `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;`: sem arraste aberto nada corre.
- Com arraste, publica a proposta (`src/editor/input/pointer/drag.ts:223` `p.redraw(at, creation || ps.dragging.dragged.length > 0 || offered !== ps.dragging.side);`).
- ok — o leitor lê o arraste deixado e publica a proposta.

### C2 intermediário
- n/a — o over reage à proposta deixada (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`).

### C3 em curso
- n/a — o over corre a partir do pointermove ou do quadro de autoscroll, fora da execução do escritor.

### C4 desmontagem
- O fim do gesto larga o arraste (`src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;`) e o desmonte do dono cancela o gesto (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — sem arraste aberto o leitor para na primeira condição.

## Resultado
- O leitor publica a proposta desenhada e retoma o quadro do autoscroll a partir do arraste: `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);`.
