# EST-L05a-034 × GRE-EST-L05a-034-11 → GRL-EST-L05a-034-05
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-11 (onMove): ENT-L05a-0042, ENT-L05a-0053, ENT-P-motion-0045, ENT-P-motion-0046, ENT-P-motion-0047, ENT-P-motion-0052, ENT-P-motion-0057, ENT-P-motion-0066, ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087
- **Leitor:** GRL-EST-L05a-034-05 (onDoubleClick): ENT-L05a-0041
## Estados deixados por A
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;` — grava a máquina (a passagem a dragging).
- **V-do-menu.** `src/editor/input/pointer/events.ts:265` `ps.menuResting = menuUnder;` grava o botão de menu sob o ponteiro; `src/editor/input/pointer/events.ts:267` `if (ps.menuDwell !== null) clearTimeout(ps.menuDwell);` desarma o temporizador anterior e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` arma o novo.
- **V-do-gesto-da-guia.** `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste de guia aberto ao passar o limiar.
- **Sem recusa.** O caminho só regista o movimento; a recusa de um comando despachado não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`).
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
