# EST-L05a-034 × GRE-EST-L05a-034-09 → GRL-EST-L05a-034-10
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-09 (onLostCapture): ENT-L05a-0045
- **Leitor:** GRL-EST-L05a-034-10 (onNative): ENT-L05a-0049, ENT-L05a-0050
## Estados deixados por A
- **V-sem-captura.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` — larga o ponteiro capturado.
- **V-intacto.** `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` — a captura perdida de outro ponteiro não escreve.
- **V-adicional.** `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();` — com o botão ainda pressionado, cancela o gesto (a máquina é escrita pelo grupo de onCancel).
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/events.ts:557` `ps.captured = null;` é uma só instrução.
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
