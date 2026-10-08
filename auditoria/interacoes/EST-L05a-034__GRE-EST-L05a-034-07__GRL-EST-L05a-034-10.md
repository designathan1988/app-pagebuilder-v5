# EST-L05a-034 × GRE-EST-L05a-034-07 → GRL-EST-L05a-034-10
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-07 (onCancel): ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-10 (onNative): ENT-L05a-0049, ENT-L05a-0050
## Estados deixados por A
- **V-cancelado.** `src/editor/input/pointer/events.ts:550` `ps.machine = next.machine;` — grava a máquina já cancelada.
- **V-sem-captura.** `src/editor/input/pointer/events.ts:545` `ps.captured = null;` — larga o ponteiro capturado.
- **V-sem-deslizador.** `src/editor/input/pointer/events.ts:546` `ps.sliding = null;` — larga o deslizador de campo.
- **V-sem-gestos-de-alça.** `src/editor/input/pointer/events.ts:548` `p.dropHandleGestures();` — larga os gestos das alças abertos (a ferramenta incluída).
- **Sem recusa.** O caminho entrega o cancelamento ao gesto (`src/editor/input/pointer/events.ts:551` `p.run(next.effect);`); a recusa de um comando não muda a sessão.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/events.ts:545` `ps.captured = null;`).
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
