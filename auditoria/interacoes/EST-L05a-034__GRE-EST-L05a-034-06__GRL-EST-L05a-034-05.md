# EST-L05a-034 × GRE-EST-L05a-034-06 → GRL-EST-L05a-034-05
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-06 (offer): ENT-L05a-0054
- **Leitor:** GRL-EST-L05a-034-05 (onDoubleClick): ENT-L05a-0041
## Estados deixados por A
- **V-sem-oferta.** `src/editor/input/pointer/drag.ts:95` `ps.dragging.side = null;` — sem alvo nem porta, larga a oferta lateral.
- **V-oferta-desarmada.** `src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };` — a oferta nova entra desarmada, com a recusa que o envolvimento encontraria guardada.
- **V-da-permanência.** `src/editor/input/pointer/drag.ts:105` `ps.dwell = setTimeout(() => {` arma a permanência da oferta; `src/editor/input/pointer/drag.ts:92` `if (ps.dwell !== null) clearTimeout(ps.dwell);` desarma o temporizador anterior.
- **V-oferta-armada.** `src/editor/input/pointer/drag.ts:108` `ps.dragging.side = { ...ps.dragging.side, armed: true, pill: { x: ps.pointerAt.x + PILL_OFFSET[0], y: ps.pointerAt.y + PILL_OFFSET[1] } };` — a oferta confirmada fica armada, com a pílula desenhada no ponteiro.
- **Sem recusa.** A recusa entra como dado da oferta (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`); nenhuma linha do grupo deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:99` `ps.dragging.side = { offer: next, armed: false, pill: null, refusal: store.refusal(door.command.id, args as never) };`).
## Casos
### C1 final
- Lê a máquina em `src/editor/input/pointer/events.ts:38` `if (ps.machine.phase !== 'idle' || shared.open !== null || event.button !== 0) return;`: só com a máquina ociosa, sem gesto aberto e no botão primário segue.
- Abre um gesto e despacha a porta do duplo clique (`src/editor/input/pointer/events.ts:43` `const gesture = store.gesture();`).
- ok — com a máquina ociosa, o leitor corre o comando do duplo clique.

### C2 intermediário
- n/a — o caminho decide pela máquina deixada (`src/editor/input/pointer/events.ts:38` `if (ps.machine.phase !== 'idle' || shared.open !== null || event.button !== 0) return;`) e não por um meio.

### C3 em curso
- n/a — o duplo clique corre no seu próprio evento, fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de dblclick (`src/editor/input/pointer.ts:235` `target.removeEventListener('dblclick', p.onDoubleClick, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor reconhece a máquina ociosa e corre o comando do duplo clique num gesto: `src/editor/input/pointer/events.ts:43` `const gesture = store.gesture();`.
