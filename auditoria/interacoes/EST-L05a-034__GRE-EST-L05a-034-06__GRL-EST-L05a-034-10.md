# EST-L05a-034 × GRE-EST-L05a-034-06 → GRL-EST-L05a-034-10
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-06 (offer): ENT-L05a-0054
- **Leitor:** GRL-EST-L05a-034-10 (onNative): ENT-L05a-0049, ENT-L05a-0050
## Estados deixados por A
- **V-sem-oferta.** `src/editor/input/pointer/drag.ts:95` `ps.dragging.side = null;` — sem alvo nem porta, larga a oferta lateral.
- **V-oferta-desarmada.** `src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };` — a oferta nova entra desarmada, com a recusa que o envolvimento encontraria guardada.
- **V-da-permanência.** `src/editor/input/pointer/drag.ts:105` `ps.dwell = setTimeout(() => {` arma a permanência da oferta; `src/editor/input/pointer/drag.ts:92` `if (ps.dwell !== null) clearTimeout(ps.dwell);` desarma o temporizador anterior.
- **V-oferta-armada.** `src/editor/input/pointer/drag.ts:108` `ps.dragging.side = { ...ps.dragging.side, armed: true, pill: { x: ps.pointerAt.x + PILL_OFFSET[0], y: ps.pointerAt.y + PILL_OFFSET[1] } };` — a oferta confirmada fica armada, com a pílula desenhada no ponteiro.
- **Sem recusa.** A recusa entra como dado da oferta (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`); nenhuma linha do grupo deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:563` `if (ps.machine.phase !== 'idle') event.preventDefault();`: durante um gesto impede a ação por omissão do navegador.
- ok — o leitor lê a máquina deixada e bloqueia a seleção e o arraste nativos.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:563` `if (ps.machine.phase !== 'idle') event.preventDefault();` só compara a fase.

### C3 em curso
- n/a — o evento corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove os ouvintes de selectstart e dragstart (`src/editor/input/pointer.ts:243` `target.removeEventListener('selectstart', p.onNative, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor impede a seleção e o arraste nativos do navegador durante um gesto: `src/editor/input/pointer/events.ts:563` `if (ps.machine.phase !== 'idle') event.preventDefault();`.
