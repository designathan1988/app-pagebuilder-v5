# EST-L05a-034 × GRE-EST-L05a-034-11 → GRL-EST-L05a-034-02
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-11 (onMove): ENT-L05a-0042, ENT-L05a-0053, ENT-P-motion-0045, ENT-P-motion-0046, ENT-P-motion-0047, ENT-P-motion-0052, ENT-P-motion-0057, ENT-P-motion-0066, ENT-P-view-0079, ENT-P-view-0080, ENT-P-view-0082, ENT-P-view-0087
- **Leitor:** GRL-EST-L05a-034-02 (dropTool): ENT-L05a-0033
## Estados deixados por A
- **V-com-a-máquina.** `src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;` — grava a máquina (a passagem a dragging).
- **V-do-menu.** `src/editor/input/pointer/events.ts:265` `ps.menuResting = menuUnder;` grava o botão de menu sob o ponteiro; `src/editor/input/pointer/events.ts:267` `if (ps.menuDwell !== null) clearTimeout(ps.menuDwell);` desarma o temporizador anterior e `src/editor/input/pointer/events.ts:270` `else ps.menuDwell = setTimeout(() => setMenuOver(menuUnder), MENU_HOVER_SWITCH);` arma o novo.
- **V-do-gesto-da-guia.** `src/editor/input/pointer/events.ts:327` `ps.guiding.gesture = store.gesture();` — o gesto do arraste de guia aberto ao passar o limiar.
- **Sem recusa.** O caminho só regista o movimento; a recusa de um comando despachado não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:399` `ps.machine = next.machine;`).
## Casos
### C1 final
- O escritor já terminou; o dropTool lê a ferramenta em `src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;`.
- Com ferramenta, larga-a (`src/editor/input/pointer/tools.ts:13` `ps.tooling = null;`) e cancela a sessão e o gesto (`src/editor/input/pointer/tools.ts:16` `gesture.cancel();`).
- ok — o leitor larga a ferramenta e desfaz o que ela fez.

### C2 intermediário
- n/a — o caminho reage à ferramenta deixada; a ferramenta é um só campo (`src/editor/input/pointer/tools.ts:11` `if (ps.tooling === null) return;`).

### C3 em curso
- n/a — o dropTool corre numa microtarefa (`src/editor/input/pointer.ts:153` `queueMicrotask(p.dropTool);`), fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono do ponteiro remove as assinaturas da store (`src/editor/input/pointer.ts:216` `stopListening();`) e cancela já a ferramenta (`src/editor/input/pointer.ts:220` `p.onCancel();`).
- ok — depois da desmontagem o dropTool deixa de ser agendado.

## Resultado
- O leitor larga a ferramenta e cancela a sessão e o gesto dela: `src/editor/input/pointer/tools.ts:16` `gesture.cancel();`.
