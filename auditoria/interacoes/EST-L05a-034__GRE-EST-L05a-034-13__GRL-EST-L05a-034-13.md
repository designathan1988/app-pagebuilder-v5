# EST-L05a-034 × GRE-EST-L05a-034-13 → GRL-EST-L05a-034-13
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-13 (over): ENT-L05a-0058
- **Leitor:** GRL-EST-L05a-034-13 (resize): ENT-P-view-0103
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-da-linha.** `src/editor/input/pointer/drag.ts:212` `ps.dragging.fromRow = row !== null;` — marca se a proposta veio de uma linha de Camadas.
- **V-da-proposta-tomada.** `src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;` e `src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;` — guardam a proposta e o ponto em que foi tomada.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);` — sem quadro armado, pede o próximo do autoscroll.
- **Sem recusa.** A recusa entra como dado da proposta (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`); o caminho não deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`).
## Casos
### C1 final
- Lê o splitter em `src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;`: sem splitter aberto nada corre.
- Com splitter, despacha o comando com o tamanho do início e a distância (`src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`).
- ok — o leitor lê o splitter deixado e corre o comando.

### C2 intermediário
- n/a — o caminho decide pelo splitter deixado (`src/editor/input/pointer/resize.ts:18` `if (ps.splitting === null) return;`).

### C3 em curso
- n/a — o resize corre a partir do pointermove, fora da execução do escritor.

### C4 desmontagem
- O desmonte do dono remove o ouvinte de pointermove que chama o resize (`src/editor/input/pointer.ts:236` `target.removeEventListener('pointermove', p.onMove, true);`).
- ok — depois da desmontagem o splitter guardado deixa de ser lido.

## Resultado
- O leitor despacha o comando do splitter com o tamanho do início e a distância do ponteiro: `src/editor/input/pointer/resize.ts:24` `shared.open.dispatch(press.entry.command.id as CommandId, { ...press.entry.door.args, ...press.args, size: from, distance } as never);`.
