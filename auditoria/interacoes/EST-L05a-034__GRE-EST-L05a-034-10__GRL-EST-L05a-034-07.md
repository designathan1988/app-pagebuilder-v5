# EST-L05a-034 × GRE-EST-L05a-034-10 → GRL-EST-L05a-034-07
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-10 (onMouseDown): ENT-L05a-0047
- **Leitor:** GRL-EST-L05a-034-07 (onLostCapture): ENT-L05a-0045
## Estados deixados por A
- **V-consumido.** `src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;` — consome o pedido de manter o foco.
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/events.ts:575` `ps.keepFocus = false;` é uma só instrução.
## Casos
### C1 final
- Lê o ponteiro capturado em `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;`: só o ponteiro capturado conta.
- Larga a captura (`src/editor/input/pointer/events.ts:557` `ps.captured = null;`) e, com o botão ainda pressionado, cancela o gesto (`src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`).
- ok — o leitor lê a captura deixada e cancela o gesto correspondente.

### C2 intermediário
- n/a — `src/editor/input/pointer/events.ts:556` `if (event.pointerId !== ps.captured) return;` só compara o identificador do ponteiro.

### C3 em curso
- n/a — o evento da captura perdida corre fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de lostpointercapture (`src/editor/input/pointer.ts:239` `target.removeEventListener('lostpointercapture', p.onLostCapture, true);`).
- ok — depois da desmontagem o leitor deixa de correr.

## Resultado
- O leitor larga a captura e, com o botão ainda pressionado, cancela o gesto: `src/editor/input/pointer/events.ts:558` `if (pointerPressing()) p.onCancel();`.
