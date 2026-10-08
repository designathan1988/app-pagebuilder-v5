# EST-L05a-034 × GRE-EST-L05a-034-16 → GRL-EST-L05a-034-12
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-16 (stopRepeating): ENT-L05a-0043, ENT-L05a-0044, ENT-L05a-0048
- **Leitor:** GRL-EST-L05a-034-12 (over): ENT-L05a-0058
## Estados deixados por A
- **V-sem-repetição.** `src/editor/input/pointer/panels.ts:33` `ps.repeating = null;` — larga a repetição guardada.
- **V-intacto.** `src/editor/input/pointer/panels.ts:30` `if (ps.repeating === null) return;` — sem repetição o caminho para sem escrever.
- **Sem recusa.** O caminho não despacha comando.
- **Sem intermediário.** `src/editor/input/pointer/panels.ts:33` `ps.repeating = null;` é uma só instrução.
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
