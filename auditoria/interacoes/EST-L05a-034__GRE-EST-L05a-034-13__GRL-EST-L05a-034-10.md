# EST-L05a-034 × GRE-EST-L05a-034-13 → GRL-EST-L05a-034-10
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-13 (over): ENT-L05a-0058
- **Leitor:** GRL-EST-L05a-034-10 (onNative): ENT-L05a-0049, ENT-L05a-0050
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-da-linha.** `src/editor/input/pointer/drag.ts:212` `ps.dragging.fromRow = row !== null;` — marca se a proposta veio de uma linha de Camadas.
- **V-da-proposta-tomada.** `src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;` e `src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;` — guardam a proposta e o ponto em que foi tomada.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);` — sem quadro armado, pede o próximo do autoscroll.
- **Sem recusa.** A recusa entra como dado da proposta (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`); o caminho não deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`).
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
