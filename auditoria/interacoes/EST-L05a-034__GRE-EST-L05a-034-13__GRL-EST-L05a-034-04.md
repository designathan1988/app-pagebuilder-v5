# EST-L05a-034 × GRE-EST-L05a-034-13 → GRL-EST-L05a-034-04
- **Estado:** EST-L05a-034
- **Escritor:** GRE-EST-L05a-034-13 (over): ENT-L05a-0058
- **Leitor:** GRL-EST-L05a-034-04 (o ouvinte): ENT-L05a-0032, ENT-L05a-0034, ENT-L05a-0035, ENT-L05a-0036, ENT-L05a-0037
## Estados deixados por A
- **V-intacto.** `src/editor/input/pointer/drag.ts:206` `if (ps.dragging === null) return;` — sem arraste aberto nada é escrito.
- **V-da-linha.** `src/editor/input/pointer/drag.ts:212` `ps.dragging.fromRow = row !== null;` — marca se a proposta veio de uma linha de Camadas.
- **V-da-proposta-tomada.** `src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;` e `src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;` — guardam a proposta e o ponto em que foi tomada.
- **V-do-quadro.** `src/editor/input/pointer/drag.ts:224` `if (ps.scrolling === 0) ps.scrolling = requestAnimationFrame(p.autoscroll);` — sem quadro armado, pede o próximo do autoscroll.
- **Sem recusa.** A recusa entra como dado da proposta (`src/editor/input/pointer/drag.ts:216` `ps.dragging.base = next;`); o caminho não deixa de escrever por causa dela.
- **Sem intermediário.** Cada escrita é uma só instrução (`src/editor/input/pointer/drag.ts:217` `ps.dragging.takenAt = at;`).
## Casos
### C1 final
- O escritor terminou; a assinatura da store (`src/editor/input/pointer.ts:149` `const stopListening = store.subscribe(() => {`) lê a sessão a cada mudança.
- Larga as alças canceladas (`src/editor/input/pointer.ts:157` `if (ps.spacing?.gesture != null && store.getState().ui.drag.cancels !== ps.spacing.cancels) {`) e redesenha o gesto aberto (`src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);`).
- ok — o leitor lê a sessão deixada e larga o que foi cancelado.

### C2 intermediário
- n/a — a assinatura dispara numa publicação da store (`src/editor/input/pointer.ts:149` `const stopListening = store.subscribe(() => {`), quando o escritor já completou a instrução que a provocou.

### C3 em curso
- O ouvinte pode ser chamado no meio do escritor: o escritor despacha comandos pelo gesto, e a store avisa os assinantes dentro desse despacho (`src/editor/input/pointer.ts:152` `if (ps.tooling !== null && store.getState().ui.drag.cancels !== ps.tooling.cancels) {`).
- A leitura é do estado da sessão já escrito até ali; um campo ainda por escrever aparece como estava.
- ok — a leitura em curso vê a sessão a meio do escritor.

### C4 desmontagem
- O desmonte do dono remove a assinatura (`src/editor/input/pointer.ts:216` `stopListening();`).
- ok — depois da desmontagem o ouvinte deixa de correr.

## Resultado
- O leitor larga os gestos cancelados e redesenha o gesto aberto a partir da sessão: `src/editor/input/pointer.ts:193` `p.redraw(ps.pointerAt, false);`.
